#!/usr/bin/env python
"""
Script para testar configurações de produção localmente
"""
import os
import sys
import django
from django.conf import settings

# Configurar ambiente de produção
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
os.environ.setdefault('DEBUG', 'False')
os.environ.setdefault('SECRET_KEY', 'test-secret-key-for-production-test')

# Inicializar Django
django.setup()

def testar_configuracoes():
    """Testa as configurações de produção"""
    print("🔍 Testando configurações de produção...")
    
    # Testar configurações básicas
    print(f"✅ DEBUG: {settings.DEBUG}")
    print(f"✅ SECRET_KEY: {'Configurado' if settings.SECRET_KEY else 'FALTANDO'}")
    print(f"✅ ALLOWED_HOSTS: {settings.ALLOWED_HOSTS}")
    
    # Testar banco de dados
    try:
        from django.db import connection
        connection.ensure_connection()
        print("✅ Banco de dados: Conectado")
    except Exception as e:
        print(f"❌ Banco de dados: ERRO - {e}")
    
    # Testar Supabase
    print(f"✅ SUPABASE_URL: {'Configurado' if settings.SUPABASE_URL else 'Não configurado'}")
    print(f"✅ SUPABASE_KEY: {'Configurado' if settings.SUPABASE_KEY else 'Não configurado'}")
    
    # Testar arquivos estáticos
    print(f"✅ STATIC_ROOT: {settings.STATIC_ROOT}")
    print(f"✅ STATIC_URL: {settings.STATIC_URL}")
    
    # Testar views
    try:
        from pag1.views import home
        print("✅ View home: Importada com sucesso")
    except Exception as e:
        print(f"❌ View home: ERRO - {e}")
    
    try:
        from pag1.views_admin import admin_dashboard
        print("✅ View admin_dashboard: Importada com sucesso")
    except Exception as e:
        print(f"❌ View admin_dashboard: ERRO - {e}")
    
    # Testar modelos
    try:
        from pag1.models import Roupa
        print("✅ Modelo Roupa: Importado com sucesso")
    except Exception as e:
        print(f"❌ Modelo Roupa: ERRO - {e}")
    
    # Testar SupabaseService
    try:
        from pag1.supabase_service import SupabaseService
        service = SupabaseService()
        print("✅ SupabaseService: Criado com sucesso")
    except Exception as e:
        print(f"❌ SupabaseService: ERRO - {e}")

if __name__ == "__main__":
    testar_configuracoes()
