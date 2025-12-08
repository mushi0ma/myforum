import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# СЕКРЕТЫ
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-change-me-in-prod')
DEBUG = True

ALLOWED_HOSTS = ["*"]

# settings.py

# Подключение к контейнеру redis, описанному в docker-compose
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://redis:6379/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
}

# Говорим Django хранить сессии в кэше (Redis)
SESSION_ENGINE = "django.contrib.sessions.backends.cache"
SESSION_CACHE_ALIAS = "default"

# Время жизни сессии (2 недели)
SESSION_COOKIE_AGE = 1209600

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites", 

    # Allauth
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.github',
    'allauth.socialaccount.providers.gitlab',
    'allauth.socialaccount.providers.discord',
    
    # API Auth
    'dj_rest_auth',
    'dj_rest_auth.registration',

    # Сторонние библиотеки
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'django_filters',
    'drf_spectacular',

    # Наше приложение
    'taggit',
    'forum',
    'core',
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    'allauth.account.middleware.AccountMiddleware',
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        # ВАЖНО: Указываем путь к папке templates в корне проекта
        "DIRS": [BASE_DIR / 'templates'],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# БАЗА ДАННЫХ
if os.environ.get('DB_HOST'):
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get('DB_NAME'),
            'USER': os.environ.get('DB_USER'),
            'PASSWORD': os.environ.get('DB_PASS'),
            'HOST': os.environ.get('DB_HOST'),
            'PORT': os.environ.get('DB_PORT'),
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    { "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator" },
    { "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator" },
    { "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator" },
    { "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator" },
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# CELERY & REDIS
CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL', 'redis://redis:6379/0')
CELERY_RESULT_BACKEND = os.environ.get('CELERY_RESULT_BACKEND', 'redis://redis:6379/0')

# DRF (API)
REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'dj_rest_auth.jwt_auth.JWTCookieAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ),
}

# SWAGGER
SPECTACULAR_SETTINGS = {
    'TITLE': 'GitForum API',
    'DESCRIPTION': 'API для системы контроля версий',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
}

# CORS  
CORS_ALLOW_ALL_ORIGINS = True

SITE_ID = 1 

# --- НАСТРОЙКИ ПРОВАЙДЕРОВ ---
# Мы добавляем 'VERIFIED_EMAIL': True, чтобы доверять почте от провайдеров
# и позволить автоматическое объединение аккаунтов.
SOCIALACCOUNT_PROVIDERS = {
    'discord': {
        'SCOPE': ['identify', 'email'],
        'AUTH_PARAMS': {'prompt': 'none'},
        'VERIFIED_EMAIL': True, 
    },
    'github': {
        'SCOPE': ['user', 'user:email'],
        'VERIFIED_EMAIL': True,
    },
    'gitlab': {
        'SCOPE': ['read_user', 'openid', 'profile', 'email'],
        'VERIFIED_EMAIL': True,
    },
    'google': {
        'SCOPE': ['profile', 'email'],
        'AUTH_PARAMS': {'access_type': 'online'},
        'VERIFIED_EMAIL': True,
    }
}

# Бэкенды авторизации
AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]

# 1. Автоматическое связывание аккаунтов по Email
# Если email от Google совпадает с email в базе -> пускаем сразу.
SOCIALACCOUNT_EMAIL_AUTHENTICATION_AUTO_CONNECT = True

# 2. Основные настройки аккаунта
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_UNIQUE_EMAIL = True       # Запрещаем дубли email
ACCOUNT_USERNAME_REQUIRED = True 
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_EMAIL_VERIFICATION = 'none' # Для скорости (можно поменять на 'optional' позже)

# 3. Бесшовный вход
SOCIALACCOUNT_AUTO_SIGNUP = True 
SOCIALACCOUNT_EMAIL_VERIFICATION = 'none'

# Куда редиректить после успешного входа
LOGIN_REDIRECT_URL = '/main'
# Вход по GET запросу (для ссылок в кнопках)
SOCIALACCOUNT_LOGIN_ON_GET = True

# Настройки dj-rest-auth
REST_USE_JWT = True
JWT_AUTH_COOKIE = 'gitforum-auth'

# Сеть и прокси
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False
ACCOUNT_DEFAULT_HTTP_PROTOCOL = 'http'
USE_X_FORWARDED_HOST = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'http')

# Важно для сохранения сессии при переходах между Django и React
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SAMESITE = 'Lax'

# Убираем Strict, чтобы при редиректе с GitHub кука сессии не терялась
SESSION_COOKIE_SECURE = False  # Так как у вас пока http (без SSL)

SOCIALACCOUNT_ADAPTER = 'core.adapters.MySocialAccountAdapter'