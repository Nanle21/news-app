# Nanle News Aggregator - Backend

Laravel API backend for the Nanle News Aggregator application.

## 🏗️ Architecture

This backend is containerized using Docker and runs with:
- **PHP 8.3** with FPM
- **Laravel 11** framework
- **MySQL 8.0** database
- **Redis** for caching and sessions
- **Nginx** as web server (separate container)

## 🚀 Quick Start

The backend is automatically started with the main project:

```bash
# From the project root
docker compose up -d
```

This will start all services including the backend API.

## 📁 Structure

```
backend/
├── app/                    # Application logic
│   ├── Http/Controllers/   # API controllers
│   ├── Models/            # Eloquent models
│   ├── Services/          # Service classes
│   │   └── NewsApis/      # External news API integrations
│   └── Providers/         # Service providers
├── routes/                # API routes
├── database/              # Migrations and seeders
├── config/                # Configuration files
├── storage/               # File storage
├── Dockerfile             # Container configuration
└── nginx.conf             # Nginx configuration
```

## 🔧 Configuration

### Environment Variables
Configured in `docker-compose.yml`:
- `APP_ENV=local`
- `APP_DEBUG=true`
- `DB_HOST=db`
- `DB_DATABASE=news_aggregator`
- `DB_USERNAME=news_user`
- `DB_PASSWORD=news_password`
- `REDIS_HOST=redis`
- `REDIS_PORT=6379`

### News API Keys
Add these to your `.env` file for external news sources:
```env
NEWSAPI_KEY=your-newsapi-key-here
GUARDIAN_API_KEY=your-guardian-key-here
```

## 🛠️ Development

### Viewing Logs
```bash
docker compose logs -f app
```

### Running Artisan Commands
```bash
docker compose exec app php artisan [command]
```

### Database Migrations
```bash
docker compose exec app php artisan migrate
```

### Seeding Database
```bash
docker compose exec app php artisan db:seed
```

## 📰 News Data Sources

The application supports multiple external news APIs:

### Supported APIs
1. **NewsAPI.org** - Comprehensive news from 70,000+ sources
2. **The Guardian** - British newspaper content
3. **BBC News** - BBC news articles

### Managing Data Sources

#### List Data Sources
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://nanle.local.api:8000/api/data-sources
```

#### Create Data Source
```bash
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Custom News API",
    "type": "newsapi",
    "base_url": "https://newsapi.org/v2",
    "api_key": "your-api-key",
    "is_active": true,
    "rate_limit_per_hour": 1000
  }' \
  http://nanle.local.api:8000/api/data-sources
```

#### Test Data Source
```bash
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
  http://nanle.local.api:8000/api/data-sources/1/test
```

#### Fetch Articles from Data Source
```bash
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
  http://nanle.local.api:8000/api/data-sources/1/fetch
```

### Command Line News Fetching

Fetch news from all active data sources:
```bash
docker compose exec app php artisan news:fetch
```

Fetch from specific source:
```bash
docker compose exec app php artisan news:fetch --source=newsapi
```

Limit articles per source:
```bash
docker compose exec app php artisan news:fetch --limit=25
```

### Scheduled News Fetching

The system includes scheduled commands for automatic news fetching:

**Scheduled Command:**
```bash
docker compose exec app php artisan news:fetch-scheduled --limit=25
```

**System Status Check:**
```bash
docker compose exec app php artisan news:status
```

**Manual Scheduling (for production):**
To enable automatic scheduling, add a cron job to your server:
```bash
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

Or use the Laravel scheduler in development:
```bash
docker compose exec app php artisan schedule:work
```

## 📚 API Documentation

### Interactive Documentation
- **HTML Documentation**: http://nanle.local.api:8000/docs
- **Postman Collection**: http://nanle.local.api:8000/docs.postman
- **OpenAPI Specification**: http://nanle.local.api:8000/docs.openapi

### Quick API Reference

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout (requires auth)
- `GET /api/auth/profile` - Get user profile (requires auth)
- `PUT /api/auth/profile` - Update user profile (requires auth)

#### Articles
- `GET /api/articles/search` - Search articles with filters
- `GET /api/articles/categories` - Get all categories
- `GET /api/articles/sources` - Get active sources

#### Personalized Feed (requires authentication)
- `GET /api/articles/feed` - Get personalized news feed
- `GET /api/articles/preferences` - Get user preferences
- `PUT /api/articles/preferences` - Update user preferences
- `DELETE /api/articles/preferences` - Reset preferences to default

#### Data Sources (requires authentication)
- `GET /api/data-sources` - List all data sources
- `POST /api/data-sources` - Create new data source
- `GET /api/data-sources/{id}` - Get specific data source
- `PUT /api/data-sources/{id}` - Update data source
- `DELETE /api/data-sources/{id}` - Delete data source
- `POST /api/data-sources/{id}/test` - Test data source connection
- `POST /api/data-sources/{id}/fetch` - Fetch articles from data source

### Documentation Features
- **Interactive Testing**: Try API endpoints directly from the browser
- **Authentication Support**: Bearer token authentication
- **Request/Response Examples**: Detailed examples for all endpoints
- **Parameter Documentation**: Complete parameter descriptions and validation rules
- **Error Responses**: Documented error scenarios and response formats

## 🧪 Testing

Run all tests:
```bash
docker compose exec app php artisan test
```

Run specific test suite:
```bash
docker compose exec app php artisan test --filter="DataSourceTest"
```

## 📝 Notes

- The backend runs on port 9000 (PHP-FPM) internally
- Nginx serves the API on port 8000
- Database runs on port 3306
- Redis runs on port 6379
- All services are networked together via Docker Compose
- External news APIs require valid API keys to fetch articles
- Rate limiting is implemented to respect API limits
- Duplicate articles are automatically filtered out
- **All data filtering is performed on local database data, not live sources**
- **News articles are scraped and stored locally via scheduled commands**
- **Database indexes are optimized for fast local data filtering**
