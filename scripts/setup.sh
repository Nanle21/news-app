#!/bin/bash

# Nanle News Aggregator - Setup Script
# This script sets up the development environment

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Setting up Nanle News Aggregator...${NC}"

# Add local domains to /etc/hosts
bash scripts/setup-hosts.sh

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker Desktop and try again.${NC}"
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker Compose is not available. Please install Docker Compose.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose are available${NC}"

# Create environment files if they don't exist
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}📝 Creating backend environment file...${NC}"
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
    else
        cat > backend/.env <<EOF
APP_NAME="Nanle News Aggregator"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://nanle.local.api:8000
APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=news_aggregator
DB_USERNAME=laravel
DB_PASSWORD=laravel_password

BROADCAST_DRIVER=log
CACHE_DRIVER=redis
FILESYSTEM_DISK=local
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379
REDIS_DB=0
REDIS_CACHE_DB=1

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https
PUSHER_APP_CLUSTER=mt1

VITE_APP_NAME="${APP_NAME}"
VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_HOST="${PUSHER_HOST}"
VITE_PUSHER_PORT="${PUSHER_PORT}"
VITE_PUSHER_SCHEME="${PUSHER_SCHEME}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"

# News API Keys (can be empty for development)
NEWSAPI_KEY=
GUARDIAN_API_KEY=
BBC_API_KEY=

# OAuth Configuration
LARAVEL_PASSPORT_PRIVATE_KEY=
LARAVEL_PASSPORT_PUBLIC_KEY=

# Queue Configuration
QUEUE_CONNECTION=redis
QUEUE_FAILED_DRIVER=database-uuids

# Cache Configuration
CACHE_PREFIX=news_aggregator_

# Session Configuration
SESSION_DOMAIN=localhost
SESSION_SECURE_COOKIE=false

# Database Configuration
DB_CHARSET=utf8mb4
DB_COLLATION=utf8mb4_unicode_ci
DB_PREFIX=

# Mail Configuration for Development
MAIL_LOG_CHANNEL=mailpit
EOF
    fi
fi

# Copy API keys from keys.txt if it exists
if [ -f "keys.txt" ]; then
    echo -e "${YELLOW}🔑 Copying API keys from keys.txt...${NC}"
    # Read and update API keys in backend/.env
    while IFS='=' read -r key value; do
        if [[ ! -z "$key" && ! "$key" =~ ^# ]]; then
            # Escape special characters in the value
            escaped_value=$(echo "$value" | sed 's/[\/&]/\\&/g')
            # Update the key in .env file
            if grep -q "^${key}=" backend/.env; then
                sed -i.bak "s/^${key}=.*/${key}=${escaped_value}/" backend/.env
            else
                echo "${key}=${value}" >> backend/.env
            fi
        fi
    done < keys.txt
    echo -e "${GREEN}✅ API keys copied successfully${NC}"
else
    echo -e "${YELLOW}⚠️  keys.txt not found. You may need to add API keys manually.${NC}"
fi

# Print resulting backend/.env for verification
echo -e "${YELLOW}--- backend/.env ---${NC}"
cat backend/.env

# Create frontend .env file
echo -e "${GREEN}🔧 Creating frontend environment file...${NC}"
echo "VITE_API_BASE_URL=http://nanle.local.api:8000/api" > frontend/.env

# Build and start services
echo -e "${GREEN}🔨 Building Docker containers...${NC}"
docker compose build

echo -e "${GREEN}🚀 Starting services...${NC}"
docker compose up -d

# Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
sleep 30

# Run database migrations
echo -e "${GREEN}🗄️ Running database migrations...${NC}"
docker compose exec -T backend php artisan migrate --force

# Generate application key
echo -e "${GREEN}🔑 Generating application key...${NC}"
docker compose exec -T backend php artisan key:generate --force

# Ensure a Passport personal access client exists
echo -e "${GREEN}🔑 Ensuring Passport personal access client exists...${NC}"
CLIENT_COUNT=$(docker compose exec -T backend php artisan tinker --execute="echo \Laravel\Passport\PersonalAccessClient::count();")
if [ "$CLIENT_COUNT" -gt 0 ]; then
  echo -e "${YELLOW}Personal access client already exists. Skipping creation.${NC}"
else
  docker compose exec -T backend php artisan passport:client --name="Personal Access Client" --personal --no-interaction
fi

# Install Laravel Passport (only if not already installed)
if ! ls backend/database/migrations/*oauth* >/dev/null 2>&1; then
  echo -e "${GREEN}🔐 Installing Laravel Passport...${NC}"
  docker compose exec -T backend php artisan passport:install --force --no-interaction
else
  echo -e "${YELLOW}🔐 Passport migrations already exist. Skipping passport:install.${NC}"
fi

# Seed data sources
echo -e "${GREEN}📰 Seeding data sources...${NC}"
docker compose exec -T backend php artisan db:seed --class=DataSourceSeeder

# Clear caches
echo -e "${GREEN}🧹 Clearing caches...${NC}"
docker compose exec -T backend php artisan optimize:clear

# Fetch initial news data
echo -e "${GREEN}📰 Fetching initial news data...${NC}"
docker compose exec -T backend php artisan news:fetch --limit=25

echo -e "${GREEN}✅ Setup completed successfully!${NC}"
echo -e "${GREEN}🌐 Access your application:${NC}"
echo -e "  Frontend: ${GREEN}http://nanle.local:3000${NC}"
echo -e "  Backend API: ${GREEN}http://nanle.local.api:8000${NC}"
echo -e "  API Documentation: ${GREEN}http://nanle.local.api:8000/docs${NC}"
echo -e "  Email Testing: ${GREEN}http://nanle.local:8025${NC}"
echo ""
echo -e "${YELLOW}📋 Useful commands:${NC}"
echo -e "  make help     - Show all available commands"
echo -e "  make logs     - View logs"
echo -e "  make status   - Check service status"
echo -e "  make down     - Stop services"
echo ""
echo -e "${YELLOW}🔑 Next steps:${NC}"
echo -e "  1. Fetch news data: make artisan cmd=\"news:fetch\""
echo -e "  2. Create a user account at http://nanle.local:3000/register"
echo -e "  3. Check email verification at http://nanle.local:8025" 