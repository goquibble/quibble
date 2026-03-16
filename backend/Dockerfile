# Stage 1: Builder
FROM python:3.13-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
  PYTHONUNBUFFERED=1

WORKDIR /app

# Install uv for fast dependency resolution
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Copy dependency files first (better layer caching)
COPY pyproject.toml uv.lock ./

# Install production dependencies only
RUN uv sync --frozen --no-dev --no-install-project

# Stage 2: Runtime
FROM python:3.13-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
  PYTHONUNBUFFERED=1

WORKDIR /app

# Copy the virtual environment from builder
COPY --from=builder /app/.venv /app/.venv
ENV PATH="/app/.venv/bin:$PATH"

# Copy application source
COPY . .

# Collect static files (uses whitenoise for serving)
# We provide dummy environment variables so django-environ doesn't crash during build
RUN SECRET_KEY="dummy" \
    DEBUG="True" \
    ALLOWED_HOSTS="*" \
    DATABASE_URL="sqlite:///:memory:" \
    CACHE_URL="locmem://" \
    AWS_S3_BUCKET_NAME="dummy" \
    AWS_S3_REGION_NAME="dummy" \
    ALLOWED_ORIGINS="*" \
    COOKIE_DOMAIN="dummy" \
    python manage.py collectstatic --noinput

EXPOSE 8000

# Default command: run gunicorn (overridden in docker-compose for celery)
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "1", "--threads", "2", "--timeout", "120", "--access-logfile", "-", "--error-logfile", "-", "--log-level", "info"]
