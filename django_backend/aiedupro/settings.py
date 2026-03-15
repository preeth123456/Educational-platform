import os
from pathlib import Path
import pymysql
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Debug: Print DB password to verify it's loaded
print(f"DB_PASSWORD from env: '{os.getenv('DB_PASSWORD', 'NOT_SET')}'")

# Force PyMySQL to use MySQLdb interface
pymysql.install_as_MySQLdb()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'your-secret-key-here'
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# Dynamic timezone from platform config
def get_timezone_from_config():
    """Get timezone from platform_configs table, with fallback to Asia/Kolkata"""
    try:
        import pymysql
        conn = pymysql.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            port=int(os.getenv('DB_PORT', '3306')),
            user=os.getenv('DB_USER', 'root'),
            password=os.getenv('DB_PASSWORD', ''),
            database=os.getenv('DB_NAME', 'eduyata_db')
        )
        cursor = conn.cursor()
        cursor.execute("SELECT value FROM platform_configs WHERE `key` = 'timezone'")
        row = cursor.fetchone()
        conn.close()
        if row:
            return row[0]
    except Exception as e:
        print(f"Could not load timezone from config: {e}")
    return 'Asia/Kolkata'  # Default fallback

TIME_ZONE = get_timezone_from_config()
USE_TZ = True
LANGUAGE_CODE = 'en-us'
USE_I18N = True
USE_L10N = True

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'courses',
    'auth_app.apps.AuthAppConfig',
    'admin_auth',
    'collaboration',
    'virtual_classrooms',
    'social_auth',  # SSO integration
    'core.apps.CoreConfig',  # Event Bus / Messaging Layer
    'notifications',  # Unified Notification Service
    'session_management',  # Session & Device Management
    'public_api',  # Feature 1: Public API Framework
    'webhook_system',  # Feature 3: Webhook Framework
    'integration_marketplace',  # Feature 4: Integration Marketplace
    'platform_config',  # Feature 13: Platform Configuration APIs
    'compliance',
    'incident_response',
    'breach_notification',
    'system_monitoring',  # System Health Monitoring (sample data only)
    'third_party_connectors',  # Feature 5: Third-Party Connectors
    'pricing',  # Product Catalog & Pricing Plans
]

MIDDLEWARE = [
    # 'auth_app.forensic_middleware.ForensicAuditMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    # 'auth_app.middleware.AuditMiddleware',
]

ROOT_URLCONF = 'aiedupro.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('DB_NAME', 'eduyata_db'),
        'USER': os.getenv('DB_USER', 'root'),
        'PASSWORD': os.getenv('DB_PASSWORD', ''),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '3306'),
        'OPTIONS': {
            'charset': 'utf8mb4',
            'connect_timeout': 10,
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8001",
    "http://127.0.0.1:8001",
]


CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
    "x-api-key",  # Allow our custom API Key header
]

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

STATIC_URL = '/static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Media files configuration
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# File upload settings
FILE_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024   # 10MB

# Email settings
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', 'chaithrapoojary175@gmail.com')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', 'fqfvbmsfkjvbduvg')
DEFAULT_FROM_EMAIL = os.getenv('EMAIL_HOST_USER', 'chaithrapoojary175@gmail.com')

# Webhook settings - Feature 3 Phase 6
WEBHOOK_TIMEOUT = 30  # Webhook request timeout in seconds
WEBHOOK_MAX_RETRIES = 3  # Maximum retry attempts for failed webhooks
WEBHOOK_USER_AGENT = 'Eduyata-Webhook/1.0'  # User agent for webhook requests

# Encryption settings
ENCRYPTION_KEY = os.getenv('ENCRYPTION_KEY', '')
ENCRYPTION_ALGORITHM = os.getenv('ENCRYPTION_ALGORITHM', 'AES-256-GCM')
SESSION_ENCRYPTION_KEY = os.getenv('SESSION_ENCRYPTION_KEY', '')

# Password hashing
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.Argon2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
    'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
]

# Celery Configuration for Data Retention Tasks
CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')
CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = TIME_ZONE
# CELERY_BEAT_SCHEDULER = 'django_celery_beat.schedulers:DatabaseScheduler'

# Data Retention Settings
DATA_EXPORT_EXPIRY_DAYS = 7  # Data exports expire after 7 days
ACCOUNT_DELETION_GRACE_PERIOD_DAYS = 30  # 30-day grace period for account deletion
DATA_RETENTION_CLEANUP_BATCH_SIZE = 1000  # Process deletions in batches
