"""
Configurações de produção para o Render
"""
import os
import dj_database_url
from .settings import *

# Configurações específicas de produção
DEBUG = False
ALLOWED_HOSTS = ['*']

# Configuração de banco de dados
DATABASE_URL = os.getenv('DATABASE_URL')
if DATABASE_URL:
    DATABASES = {
        'default': dj_database_url.parse(DATABASE_URL)
    }

# Configurações de arquivos estáticos
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Garantir que STATICFILES_DIRS esteja configurado
STATICFILES_DIRS = [
    BASE_DIR / "static",
]

# Configurações de mídia
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Logging para produção
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
