#!/usr/bin/env python
"""
Script para debugar problemas específicos do Render
"""
import os
import sys
import django

# Configurar ambiente como no Render
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
os.environ.setdefault('DEBUG', 'False')
os.environ.setdefault('SECRET_KEY', 'test-secret-key-for-production-test')

# Inicializar Django
django.setup()

from django.conf import settings
from django.test import RequestFactory, Client
from django.contrib.auth.models import User

def debug_render():
    """Debuga problemas específicos do Render"""
    print("🔍 Debugando configurações do Render...")
    
    # 1. Verificar configurações básicas
    print(f"✅ DEBUG: {settings.DEBUG}")
    print(f"✅ ALLOWED_HOSTS: {settings.ALLOWED_HOSTS}")
    print(f"✅ SECRET_KEY: {'OK' if settings.SECRET_KEY else 'FALTANDO'}")
    
    # 2. Verificar banco de dados
    try:
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        print("✅ Banco de dados: Funcionando")
    except Exception as e:
        print(f"❌ Banco de dados: ERRO - {e}")
    
    # 3. Verificar migrações
    try:
        from django.core.management import execute_from_command_line
        execute_from_command_line(['manage.py', 'showmigrations'])
        print("✅ Migrações: OK")
    except Exception as e:
        print(f"❌ Migrações: ERRO - {e}")
    
    # 4. Verificar arquivos estáticos
    try:
        from django.core.management import execute_from_command_line
        execute_from_command_line(['manage.py', 'collectstatic', '--no-input', '--dry-run'])
        print("✅ Arquivos estáticos: OK")
    except Exception as e:
        print(f"❌ Arquivos estáticos: ERRO - {e}")
    
    # 5. Testar views com cliente Django
    try:
        client = Client()
        
        # Testar home
        response = client.get('/')
        print(f"✅ View home: Status {response.status_code}")
        
        # Testar admin login
        response = client.get('/painel-admin/')
        print(f"✅ View admin_login: Status {response.status_code}")
        
        # Testar admin dashboard (deve redirecionar para login)
        response = client.get('/painel-admin/dashboard/')
        print(f"✅ View admin_dashboard: Status {response.status_code}")
        
    except Exception as e:
        print(f"❌ Views: ERRO - {e}")
        import traceback
        traceback.print_exc()
    
    # 6. Verificar SupabaseService
    try:
        from pag1.supabase_service import SupabaseService
        service = SupabaseService()
        
        if service.supabase:
            print("✅ Supabase: Conectado")
            roupas = service.get_roupas_ativas()
            print(f"✅ Supabase: {len(roupas)} roupas ativas")
        else:
            print("⚠️ Supabase: Usando fallback local")
            from pag1.models import Roupa
            roupas = Roupa.objects.filter(ativo=True)
            print(f"✅ Fallback: {len(roupas)} roupas ativas")
            
    except Exception as e:
        print(f"❌ SupabaseService: ERRO - {e}")
        import traceback
        traceback.print_exc()
    
    # 7. Verificar templates
    try:
        from django.template.loader import get_template
        template = get_template('pag1/index.html')
        print("✅ Template index.html: OK")
        
        template = get_template('pag1/admin_login.html')
        print("✅ Template admin_login.html: OK")
        
        template = get_template('pag1/admin_dashboard.html')
        print("✅ Template admin_dashboard.html: OK")
        
    except Exception as e:
        print(f"❌ Templates: ERRO - {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    debug_render()
