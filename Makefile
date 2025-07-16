# Nanle News Aggregator - Development Makefile
# Use 'make help' to see all available commands

.PHONY: help build up down restart logs clean status test shell setup

# Default target
.DEFAULT_GOAL := help

# Colors for output
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

# Help
help: ## Show this help message
	@echo "$(GREEN)Nanle News Aggregator - Available Commands:$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(GREEN)Quick Start:$(NC)"
	@echo "  make setup    # Complete setup from scratch"
	@echo "  make build    # Build all containers"
	@echo "  make up       # Start all services"
	@echo "  make logs     # View logs"
	@echo "  make down     # Stop all services"

# Setup
setup: ## Complete setup from scratch (clean, build, migrate, seed)
	@echo "$(GREEN)🚀 Setting up Nanle News Aggregator from scratch...$(NC)"
	@echo "$(YELLOW)Cleaning up existing environment...$(NC)"
	docker compose down -v --remove-orphans
	rm -f backend/.env*
	@echo "$(GREEN)Running setup script...$(NC)"
	echo "y" | ./scripts/setup.sh
	@echo "$(GREEN)✅ Setup completed successfully!$(NC)"
	@echo "$(GREEN)🌐 Access your application:$(NC)"

# Development
build: ## Build all Docker containers
	@echo "$(GREEN)Building containers...$(NC)"
	docker compose build

up: ## Start all services
	@echo "$(GREEN)Starting services...$(NC)"
	docker compose up -d

down: ## Stop all services
	@echo "$(YELLOW)Stopping services...$(NC)"
	docker compose down

restart: ## Restart all services
	@echo "$(YELLOW)Restarting services...$(NC)"
	docker compose restart

# Logs
logs: ## View logs from all services
	docker compose logs -f

logs-backend: ## View backend logs only
	docker compose logs -f backend nginx

logs-frontend: ## View frontend logs only
	docker compose logs -f frontend

logs-db: ## View database logs only
	docker compose logs -f db

# Status and monitoring
status: ## Show status of all services
	@echo "$(GREEN)Service Status:$(NC)"
	docker compose ps
	@echo ""
	@echo "$(GREEN)Access URLs:$(NC)"

# Shell access
shell-backend: ## Access backend container shell
	docker compose exec backend sh

shell-frontend: ## Access frontend container shell
	docker compose exec frontend sh

shell-db: ## Access database shell
	docker compose exec db mysql -u news_user -p news_aggregator

# Backend commands
artisan: ## Run Laravel artisan command (usage: make artisan cmd="migrate")
	docker compose exec backend php artisan $(cmd)

migrate: ## Run database migrations
	docker compose exec backend php artisan migrate

migrate-fresh: ## Fresh migration with seeding
	docker compose exec backend php artisan migrate:fresh --seed

seed: ## Run database seeders
	docker compose exec backend php artisan db:seed

cache-clear: ## Clear all Laravel caches
	docker compose exec backend php artisan optimize:clear

# Frontend commands
npm-install: ## Install frontend dependencies
	docker compose exec frontend yarn install

npm-build: ## Build frontend for production
	docker compose exec frontend yarn build

npm-dev: ## Start frontend development server
	docker compose exec frontend yarn dev

# Testing
test-backend: ## Run backend tests only
	docker compose exec backend php artisan test

test-frontend: ## Run frontend tests only
	docker compose exec frontend yarn test:run

test: test-backend test-frontend ## Run all tests (backend and frontend)

# Database
db-backup: ## Create database backup
	docker compose exec db mysqldump -u news_user -p news_aggregator > backup_$(shell date +%Y%m%d_%H%M%S).sql

db-restore: ## Restore database from backup (usage: make db-restore file=backup.sql)
	docker compose exec -T db mysql -u news_user -p news_aggregator < $(file)

# Cleanup
clean: ## Stop services and remove volumes
	@echo "$(RED)Cleaning up...$(NC)"
	docker compose down -v
	docker system prune -f

clean-all: ## Complete cleanup including images
	@echo "$(RED)Complete cleanup...$(NC)"
	docker compose down -v --rmi all
	docker system prune -a -f

# Health checks
health: ## Check health of all services
	@echo "$(GREEN)Checking service health...$(NC)"
	docker compose ps
	@echo ""
	@echo "$(GREEN)Testing endpoints:$(NC)"
	@curl -s -o /dev/null -w "Frontend: %{http_code}\n" http://localhost:3000 || echo "Frontend: Not responding"
	@curl -s -o /dev/null -w "Backend: %{http_code}\n" http://localhost:8000/api/test || echo "Backend: Not responding"

# Development helpers
dev: ## Start development environment with logs
	docker compose up

rebuild: ## Rebuild and restart all services
	@echo "$(GREEN)Rebuilding and restarting...$(NC)"
	docker compose down
	docker compose build --no-cache
	docker compose up -d

# Production helpers
prod-build: ## Build for production
	docker compose -f docker-compose.prod.yml build

prod-up: ## Start production environment
	docker compose -f docker-compose.prod.yml up -d

prod-down: ## Stop production environment
	docker compose -f docker-compose.prod.yml down 