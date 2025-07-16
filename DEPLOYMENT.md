# 🚀 Deployment Guide

This guide covers deploying the Nanle News Aggregator to production environments.

## 📋 Prerequisites

- **Docker** and **Docker Compose** installed on the server
- **Domain name** configured with DNS
- **SSL certificates** (Let's Encrypt recommended)
- **Server** with at least 2GB RAM and 20GB storage

## 🏗️ Production Setup

### 1. Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
```

### 2. Clone and Configure

```bash
# Clone repository
git clone <repository-url>
cd nanle-home-task

# Copy environment file
cp env.example .env

# Edit environment variables
nano .env
```

### 3. Environment Configuration

Update `.env` with your production values:

```env
# Database Configuration
DB_DATABASE=news_aggregator
DB_USERNAME=news_user
DB_PASSWORD=your_secure_password_here
DB_ROOT_PASSWORD=your_secure_root_password_here

# API Configuration
API_BASE_URL=https://your-domain.com/api

# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.your-provider.com
MAIL_PORT=587
MAIL_USERNAME=your_email@domain.com
MAIL_PASSWORD=your_email_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@your-domain.com
MAIL_FROM_NAME="News Aggregator"

# News API Keys
NEWSAPI_KEY=your_newsapi_key_here
GUARDIAN_API_KEY=your_guardian_key_here
BBC_API_KEY=your_bbc_key_here

# Application Settings
APP_NAME="News Aggregator"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com
```

### 4. SSL Configuration

#### Using Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt install certbot

# Get SSL certificate
sudo certbot certonly --standalone -d your-domain.com

# Create SSL configuration
sudo nano /etc/nginx/sites-available/news-aggregator
```

SSL Nginx configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Proxy to Docker containers
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 5. Deploy Application

```bash
# Build and start production services
make prod-build
make prod-up

# Run database migrations
make artisan cmd="migrate --force"

# Generate application key
make artisan cmd="key:generate --force"

# Install Laravel Passport
make artisan cmd="passport:install --force"

# Optimize for production
make artisan cmd="config:cache"
make artisan cmd="route:cache"
make artisan cmd="view:cache"

# Fetch initial news data
make artisan cmd="news:fetch"
```

### 6. Monitoring and Maintenance

#### Health Checks

```bash
# Check service status
make status

# View logs
make logs

# Monitor resources
docker stats
```

#### Backup Strategy

```bash
# Database backup
make db-backup

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker compose exec -T db mysqldump -u news_user -p news_aggregator > backup_$DATE.sql
gzip backup_$DATE.sql
```

#### Update Process

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
make prod-build
make prod-up

# Run migrations
make artisan cmd="migrate --force"

# Clear caches
make artisan cmd="optimize:clear"
make artisan cmd="config:cache"
```

## 🔧 Performance Optimization

### 1. Database Optimization

```sql
-- Add indexes for better performance
ALTER TABLE articles ADD INDEX idx_published_at (published_at);
ALTER TABLE articles ADD INDEX idx_source_category (source_id, category_id);
ALTER TABLE bookmarks ADD INDEX idx_user_article (user_id, article_id);
```

### 2. Caching Strategy

```bash
# Configure Redis for caching
# Add to backend/.env
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

### 3. CDN Configuration

For static assets, consider using a CDN:

```bash
# Configure CDN in frontend/.env
VITE_CDN_URL=https://your-cdn.com
```

## 🔒 Security Considerations

### 1. Firewall Configuration

```bash
# Configure UFW firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2. Docker Security

```bash
# Run containers as non-root user
# Add to docker-compose.prod.yml
user: "1000:1000"
```

### 3. Environment Security

- Use strong, unique passwords
- Rotate API keys regularly
- Enable HTTPS only
- Set secure headers

## 📊 Monitoring

### 1. Log Management

```bash
# Configure log rotation
sudo nano /etc/logrotate.d/docker
```

### 2. Health Monitoring

```bash
# Create health check script
#!/bin/bash
curl -f http://localhost:3000/health || exit 1
curl -f http://localhost:8000/health || exit 1
```

### 3. Resource Monitoring

```bash
# Install monitoring tools
sudo apt install htop iotop

# Monitor Docker resources
docker system df
docker stats --no-stream
```

## 🚨 Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check what's using ports
   sudo netstat -tulpn | grep :80
   sudo netstat -tulpn | grep :443
   ```

2. **Database Connection Issues**
   ```bash
   # Check database status
   make shell-db
   mysql -u news_user -p -e "SHOW STATUS;"
   ```

3. **SSL Certificate Issues**
   ```bash
   # Renew Let's Encrypt certificate
   sudo certbot renew
   sudo systemctl reload nginx
   ```

### Emergency Procedures

```bash
# Emergency restart
make prod-down
make prod-up

# Database recovery
make db-restore file=backup_file.sql

# Complete reset
make clean-all
make prod-build
make prod-up
```

## 📞 Support

For deployment issues:

1. Check the [troubleshooting section](#-troubleshooting)
2. Review application logs: `make logs`
3. Verify environment configuration
4. Check system resources: `docker stats`

---

**Remember to regularly update dependencies and monitor security advisories!** 