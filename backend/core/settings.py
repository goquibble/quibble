import os
from datetime import timedelta
from pathlib import Path

import dj_database_url
from dotenv import load_dotenv

# load envs
env_file = os.getenv("ENV_FILE", ".env")
load_dotenv(env_file)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv("SECRET_KEY", "ilovequibble")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv("DEBUG", "True").lower() == "true"

_env_hosts = os.getenv("DJANGO_ALLOWED_HOSTS", "").split()
ALLOWED_HOSTS = ["localhost", *_env_hosts]

# Application definition
DEFAULT_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

THIRD_PARTY_APPS = [
    "django_extensions",
    # rest framework
    "rest_framework",
    # 'rest_framework.authtoken',
    # auth
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",
    "dj_rest_auth",
    "dj_rest_auth.registration",
    # django filtering
    "django_filters",
    # middleware (cors)
    "corsheaders",
    # openapi
    "drf_spectacular",
    "drf_spectacular_sidecar",
    # custom error handling
    "drf_standardized_errors",
    # file middleware
    "django_cleanup",
    # postgres ltree
    "django_ltree",
    # cloud service
    "cloudinary_storage",
    "cloudinary",
]

SELF_APPS = [
    "apps.api",
    "apps.user",
    "apps.community",
    "apps.post",
    "apps.comment",
]

if DEBUG:
    THIRD_PARTY_APPS.append("silk")

INSTALLED_APPS = DEFAULT_APPS + THIRD_PARTY_APPS + SELF_APPS

SITE_ID = 1

_default_renderer_classes = ("rest_framework.renderers.JSONRenderer",)
if DEBUG:
    _default_renderer_classes += ("rest_framework.renderers.BrowsableAPIRenderer",)

DEFAULT_RENDERER_CLASSES = _default_renderer_classes

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "apps.user.auth.ExtendedJWTCookieAuthentication",
    ],
    "DEFAULT_RENDERER_CLASSES": DEFAULT_RENDERER_CLASSES,
    "EXCEPTION_HANDLER": "drf_standardized_errors.handler.exception_handler",
    "DEFAULT_SCHEMA_CLASS": "apps.api.openapi.CustomAutoSchema",
}

# django-allauth
ACCOUNT_EMAIL_NOTIFICATIONS = True
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION = "mandatory"
ACCOUNT_EMAIL_VERIFICATION_BY_CODE_ENABLED = True
ACCOUNT_LOGIN_METHODS = {"email"}
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_USER_MODEL_USERNAME_FIELD = None
ACCOUNT_EMAIL_SUBJECT_PREFIX = "[Quibble] "

# OAuth creds
OAUTH_CALLBACK_URL = os.getenv("OAUTH_CALLBACK_URL")

# sendgrid and mail settings
EMAIL_BACKEND = "sendgrid_backend.SendgridBackend"
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
DEFAULT_FROM_EMAIL = os.getenv("SENDGRID_EMAIL")
if DEBUG:
    SENDGRID_ECHO_TO_STDOUT = True

# JWT settings
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
}

# dj-rest-auth settings
REST_AUTH = {
    "USE_JWT": True,
    "TOKEN_MODEL": None,
    # jwt settings
    "JWT_AUTH_COOKIE": "jwt-auth",
    "JWT_AUTH_REFRESH_COOKIE": "jwt-refresh",
    "JWT_AUTH_SECURE": not DEBUG,
    "JWT_AUTH_HTTPONLY": True,
    "JWT_AUTH_SAMESITE": "None" if not DEBUG else "Lax",
    "JWT_AUTH_COOKIE_DOMAIN": os.getenv("DJANGO_COOKIE_DOMAIN"),
    # serializers
    "REGISTER_SERIALIZER": "apps.api.serializers.user.auth.RegisterSerializer",
    "LOGIN_SERIALIZER": "apps.api.serializers.user.auth.LoginSerializer",
    "USER_DETAILS_SERIALIZER": "apps.api.serializers.user.auth.UserDetailsSerializer",
}

# https://drf-standardized-errors.readthedocs.io/en/latest/openapi.html#tips-and-tricks
DRF_STANDARDIZED_ERRORS = {
    "ALLOWED_ERROR_STATUS_CODES": ["400", "403", "404", "500"],
}

# https://drf-standardized-errors.readthedocs.io/en/latest/openapi.html#hide-error-responses-that-show-in-every-operation
with open(BASE_DIR / "docs" / "openapi_desc.md") as md_file:
    openapi_description = md_file.read()

SPECTACULAR_SETTINGS = {
    "TITLE": "QuibbleAPI",
    "DESCRIPTION": openapi_description,
    "VERSION": "0.0.1",
    "SERVE_INCLUDE_SCHEMA": False,
    "SCHEMA_PATH_PREFIX": r"/api/v[1-9]/",
    "SCHEMA_PATH_PREFIX_TRIM": True,
    "SERVERS": [{"url": "/api/v1/"}],
    # sidecar config
    "SWAGGER_UI_DIST": "SIDECAR",
    "SWAGGER_UI_FAVICON_HREF": "SIDECAR",
    # https://swagger.io/docs/open-source-tools/swagger-ui/usage/configuration/
    "SWAGGER_UI_SETTINGS": {
        "deepLinking": True,
        "persistAuthorization": True,
        "defaultModelsExpandDepth": -1,
        "displayOperationId": True,
    },
    # integrate with drf-standardized-errors
    # https://drf-standardized-errors.readthedocs.io/en/latest/openapi.html
    "ENUM_NAME_OVERRIDES": {
        key: f"drf_standardized_errors.openapi_serializers.{key}.choices"
        for key in [
            "ValidationErrorEnum",
            "ClientErrorEnum",
            "ServerErrorEnum",
            "ErrorCode401Enum",
            "ErrorCode403Enum",
            "ErrorCode404Enum",
            "ErrorCode405Enum",
            "ErrorCode406Enum",
            "ErrorCode415Enum",
            "ErrorCode429Enum",
            "ErrorCode500Enum",
        ]
    },
    "POSTPROCESSING_HOOKS": [
        "drf_standardized_errors.openapi_hooks.postprocess_schema_enums",
    ],
}

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    # whitenoise
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    # cors middleware
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    # allauth middleware
    "allauth.account.middleware.AccountMiddleware",
]

if DEBUG:
    MIDDLEWARE.append("silk.middleware.SilkyMiddleware")

ROOT_URLCONF = "core.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "core.wsgi.application"


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    "default": dj_database_url.config(
        default=os.getenv("DATABASE_URL"),
        conn_max_age=600,
        conn_health_checks=True,
    ),
}


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

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
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True

LANGUAGES = [
    ("en", "English"),
]

LOCALE_PATHS = [os.path.join(BASE_DIR, "locale")]


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

# STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]
STATIC_URL = "static/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Custom AUTH model and backends
AUTH_USER_MODEL = "user.User"

AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    # custom auth backend
    # 'apps.user.backends.EmailAuthBackend',
    # `allauth` specific authentication methods, such as login by email
    "allauth.account.auth_backends.AuthenticationBackend",
]

# django-cors-headers settins
# https://pypi.org/project/django-cors-headers/

SESSION_COOKIE_SECURE = not DEBUG
SESSION_COOKIE_SAMESITE = "None" if not DEBUG else "Lax"
SESSION_COOKIE_DOMAIN = os.getenv("DJANGO_COOKIE_DOMAIN")

CSRF_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SAMESITE = "None" if not DEBUG else "Lax"
CSRF_COOKIE_DOMAIN = os.getenv("DJANGO_COOKIE_DOMAIN")

CORS_ALLOW_CREDENTIALS = True

_origins = os.getenv("DJANGO_ALLOWED_ORIGINS", "").split()
CORS_ALLOWED_ORIGINS = _origins
CSRF_TRUSTED_ORIGINS = _origins

# max no:of profiles a user can create
PROFILE_LIMIT = 3

# Media files ( Images, Videos )
# https://docs.djangoproject.com/en/4.2/howto/static-files/#serving-uploaded-files-in-development

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# storage and cloudinary config
# https://pypi.org/project/django-cloudinary-storage/

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
}

if not DEBUG:
    STORAGES["default"] = {
        "BACKEND": "cloudinary_storage.storage.MediaCloudinaryStorage",
    }

    CLOUDINARY_STORAGE = {
        "CLOUD_NAME": os.getenv("CLOUDINARY_CLOUD_NAME"),
        "API_KEY": os.getenv("CLOUDINARY_API_KEY"),
        "API_SECRET": os.getenv("CLOUDINARY_API_SECRET"),
    }
