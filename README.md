# 📰 Nanle News Aggregator

A modern news aggregation platform built with **Laravel** (backend) and **React** (frontend).

## ✨ Features

- 🔍 News aggregation from multiple sources
- 🎯 Personalized feeds and preferences
- 🔖 Article bookmarking
- 🌍 Multi-language support (EN, FR, DE)
- 🌙 Dark/Light mode
- 📱 Responsive design
- 🔐 User authentication with email verification

## 🚀 Quick Start

### Prerequisites
- Docker Desktop
- Git

### Installation

1. **Clone and setup**
   ```bash
   git clone <repository-url>
   cd nanle-home-task
   make setup
   ```

2. **Access the application**
   - Frontend: http://nanle.local:3000
   - API: http://nanle.local.api:8000
   - API Docs: http://nanle.local.api:8000/docs

## 🛠️ Development

### Commands
```bash
make setup         # setup the entire application
make help          # Show all commands
make up            # Start services
make down          # Stop services
make logs          # View logs
make test          # Run backend tests
make shell-backend # Backend container access
```

### Project Structure
```
nanle-home-task/
├── backend/        # Laravel API
├── frontend/       # React app
├── docker-compose.yml
└── Makefile
```

## 🏗️ Tech Stack

**Backend**: Laravel 11, MySQL 8.0, Redis, Laravel Passport  
**Frontend**: React 18, TypeScript, Redux Toolkit, Tailwind CSS  
**Services**: Docker, Nginx, Mailpit (email testing)

## 🔧 Configuration

Add API keys to `backend/.env`:
```env
NEWSAPI_KEY=your-key
GUARDIAN_API_KEY=your-key
```

Get free API keys from:
- [NewsAPI.org](https://newsapi.org/register)
- [The Guardian](https://open-platform.theguardian.com/access/)

## 📊 Key API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/articles/search` - Search articles
- `GET /api/articles/feed` - Personalized feed
- `GET /api/articles/dashboard-stats` - Dashboard statistics
- `POST /api/articles/{id}/bookmark` - Toggle bookmark

## 🐛 Troubleshooting

```bash
# Reset everything
make clean-all
make setup

# Check service status
docker compose ps

# View logs
make logs
```

## 📝 License

Part of the Nanle home task assignment.