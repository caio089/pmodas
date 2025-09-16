#!/usr/bin/env python
"""
Script para verificar problemas específicos do Render
"""
import os
import sys
import django

# Configurar ambiente como no Render
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
os.environ.setdefault('DEBUG', 'False')

# Inicializar Django
django.setup()

from django.conf import settings
from django.core.management import execute_from_command_line

def verificar_render():
    """Verifica problemas específicos do Render"""
    print("🔍 Verificando configurações do Render...")
    
    # 1. Verificar variáveis de ambiente
    print(f"✅ RENDER: {os.getenv('RENDER', 'Não definido')}")
    print(f"✅ PORT: {os.getenv('PORT', 'Não definido')}")
    print(f"✅ DATABASE_URL: {'Definido' if os.getenv('DATABASE_URL') else 'Não definido'}")
    print(f"✅ SECRET_KEY: {'Definido' if os.getenv('SECRET_KEY') else 'Não definido'}")
    
    # 2. Verificar configurações Django
    print(f"✅ DEBUG: {settings.DEBUG}")
    print(f"✅ ALLOWED_HOSTS: {settings.ALLOWED_HOSTS}")
    print(f"✅ SECRET_KEY: {'OK' if settings.SECRET_KEY else 'FALTANDO'}")
    
    # 3. Verificar banco de dados
    try:
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        print("✅ Banco de dados: Conectado")
    except Exception as e:
        print(f"❌ Banco de dados: ERRO - {e}")
    
    # 4. Verificar se é PostgreSQL
    if 'postgresql' in str(settings.DATABASES['default']['ENGINE']):
        print("✅ Banco: PostgreSQL (produção)")
    else:
        print("⚠️ Banco: SQLite (desenvolvimento)")
    
    # 5. Verificar arquivos estáticos
    try:
        execute_from_command_line(['manage.py', 'collectstatic', '--no-input'])
        print("✅ Arquivos estáticos: Coletados")
    except Exception as e:
        print(f"❌ Arquivos estáticos: ERRO - {e}")
    
    # 6. Verificar migrações
    try:
        execute_from_command_line(['manage.py', 'migrate', '--no-input'])
        print("✅ Migrações: Aplicadas")
    except Exception as e:
        print(f"❌ Migrações: ERRO - {e}")
    
    # 7. Verificar SupabaseService
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

if __name__ == "__main__":
    verificar_render()
