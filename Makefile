# --- Configuration ---
BACKEND_DIR = backend
FRONTEND_DIR = frontend

# --- Backend Commands ---
.PHONY: install-backend
install-backend: ## Install backend dependencies
	cd $(BACKEND_DIR) && uv sync

.PHONY: run-backend
run-backend: ## Run Django development server
	cd $(BACKEND_DIR) && uv run python manage.py runserver

.PHONY: migrate
migrate: ## Run Django migrations
	cd $(BACKEND_DIR) && uv run python manage.py migrate

.PHONY: makemigrations
makemigrations: ## Create new Django migrations
	cd $(BACKEND_DIR) && uv run python manage.py makemigrations

.PHONY: backend-shell
backend-shell: ## Open Django shell
	cd $(BACKEND_DIR) && uv run python manage.py shell

# --- Frontend Commands (Proxies to npm workspace) ---
.PHONY: install-frontend
install-frontend: ## Install frontend dependencies
	npm install

.PHONY: run-frontend
run-frontend: ## Run Next.js development server
	npm run frontend:dev

.PHONY: build-frontend
build-frontend: ## Build Next.js production bundle
	npm run frontend:build

# --- General Commands ---
.PHONY: install
install: install-backend install-frontend ## Install all dependencies

.PHONY: help
help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
