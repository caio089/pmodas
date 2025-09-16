#!/usr/bin/env python
"""
Script para testar as views específicas
"""
import os
import sys
import django

# Configurar ambiente de produção
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
os.environ.setdefault('DEBUG', 'False')
os.environ.setdefault('SECRET_KEY', 'test-secret-key-for-production-test')

# Inicializar Django
django.setup()

from django.conf import settings
from django.test import RequestFactory

def testar_views():
    """Testa as views específicas"""
    print("🔍 Testando views...")
    
    factory = RequestFactory()
    
    # Testar view home
    try:
        from pag1.views import home
        request = factory.get('/')
        response = home(request)
        print(f"✅ View home: Status {response.status_code}")
    except Exception as e:
        print(f"❌ View home: ERRO - {e}")
        import traceback
        traceback.print_exc()
    
    # Testar view admin_dashboard (sem autenticação)
    try:
        from pag1.views_admin import admin_dashboard
        request = factory.get('/painel-admin/dashboard/')
        response = admin_dashboard(request)
        print(f"✅ View admin_dashboard: Status {response.status_code}")
    except Exception as e:
        print(f"❌ View admin_dashboard: ERRO - {e}")
        import traceback
        traceback.print_exc()
    
    # Testar SupabaseService com dados reais
    try:
        from pag1.supabase_service import SupabaseService
        service = SupabaseService()
        
        if service.supabase:
            roupas = service.get_roupas_ativas()
            print(f"✅ SupabaseService.get_roupas_ativas: {len(roupas)} roupas encontradas")
        else:
            print("⚠️ SupabaseService: Usando fallback local")
            from pag1.models import Roupa
            roupas = Roupa.objects.filter(ativo=True)
            print(f"✅ Fallback local: {len(roupas)} roupas encontradas")
            
    except Exception as e:
        print(f"❌ SupabaseService: ERRO - {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    testar_views()
