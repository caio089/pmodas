"""
Configurações específicas para o Render
"""
import os
import dj_database_url
from .settings import *

# Configurações específicas do Render
DEBUG = False
ALLOWED_HOSTS = ['*']

# Configuração de banco de dados para Render
DATABASE_URL = os.getenv('DATABASE_URL')
if DATABASE_URL:
    DATABASES = {
        'default': dj_database_url.parse(DATABASE_URL)
    }
else:
    # Fallback para SQLite se não houver DATABASE_URL
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# Configurações de arquivos estáticos
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Configurações de mídia
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Configurações de segurança (comentadas para evitar problemas)
# SECURE_BROWSER_XSS_FILTER = True
# SECURE_CONTENT_TYPE_NOSNIFF = True
# X_FRAME_OPTIONS = 'DENY'
