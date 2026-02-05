from pathlib import Path
import environ

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Setup environment variables
env = environ.Env()
environ.Env.read_env(BASE_DIR / ".env")

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.bool("DEBUG")

ALLOWED_HOSTS = env.list("ALLOWED_HOSTS")

# Application definition
INSTALLED_APPS = [
    # "base16_admin",
    # default django apps
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    # use whitenoise features for dev
    "whitenoise.runserver_nostatic",
    "django.contrib.staticfiles",
    # auth apps
    "corsheaders",
    "storages",
    "django_ltree",
    # custom apps
    "quiblet",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    # serve static files
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    # handle cors (must be placed before common middleware)
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

AUTHENTICATION_BACKENDS = [
    # needed to login by username in django admin
    "django.contrib.auth.backends.ModelBackend",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                # "base16_admin.context_processors.base16_theme",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases
DATABASES = {
    "default": env.db()  # auto-detect database
}

# Cache Backend
# https://docs.djangoproject.com/en/5.2/topics/cache/
CACHES = {
    "default": env.cache()  # auto-detect cache backend
}

# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/
LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True

# AWS & S3
AWS_ACCESS_KEY_ID = env("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = env("AWS_SECRET_ACCESS_KEY")
AWS_STORAGE_BUCKET_NAME = env("AWS_S3_BUCKET_NAME")
AWS_QUERYSTRING_AUTH = False

AWS_S3_ENDPOINT_URL = env("AWS_S3_ENDPOINT_URL")
AWS_S3_REGION_NAME = env("AWS_S3_REGION_NAME")
AWS_S3_ADDRESSING_STYLE = "path"
AWS_S3_SIGNATURE_VERSION = "s3v4"
AWS_S3_USE_SSL = not DEBUG

# Storages
# https://docs.djangoproject.com/en/5.2/ref/files/storage/
STORAGES = {
    "default": {"BACKEND": "storages.backends.s3.S3Storage"},
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage"
    },
}

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/
STATIC_ROOT = BASE_DIR / "staticfiles"
STATIC_URL = "/static/"

# Media files
# https://docs.djangoproject.com/en/5.2/topics/files/
MEDIA_URL = f"{AWS_S3_ENDPOINT_URL}/{AWS_STORAGE_BUCKET_NAME}/media/"

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Auth Service
AUTH_SERVICE_URL = env("AUTH_SERVICE_URL", default="http://localhost:8002")

# django-cors-headers settings
# https://pypi.org/project/django-cors-headers/
CORS_ALLOW_CREDENTIALS = True

SESSION_COOKIE_SECURE = not DEBUG
SESSION_COOKIE_SAMESITE = "None" if not DEBUG else "Lax"
SESSION_COOKIE_DOMAIN = None if DEBUG else env("COOKIE_DOMAIN")
CSRF_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SAMESITE = "None" if not DEBUG else "Lax"
CSRF_COOKIE_DOMAIN = None if DEBUG else env("COOKIE_DOMAIN")

CSRF_TRUSTED_ORIGINS = env.list("ALLOWED_ORIGINS")
CORS_ALLOWED_ORIGINS = env.list("ALLOWED_ORIGINS")

# Celery
CELERY_BROKER_URL = env("CELERY_BROKER_URL", default=env("CACHE_URL"))
CELERY_RESULT_BACKEND = env("CELERY_RESULT_BACKEND", default=env("CACHE_URL"))
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = TIME_ZONE
