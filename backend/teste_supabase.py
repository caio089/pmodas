#!/usr/bin/env python3
"""
Script de teste para verificar a integração com Supabase
Execute: python teste_supabase.py
"""

import os
import sys
import django
from pathlib import Path

# Adicionar o diretório do projeto ao Python path
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from pag1.supabase_service import SupabaseService
from django.conf import settings

def test_supabase_connection():
    """Testa a conexão com o Supabase"""
    print("🔍 Testando conexão com Supabase...")
    
    try:
        # Verificar se as variáveis de ambiente estão configuradas
        if not settings.SUPABASE_URL:
            print("❌ ERRO: SUPABASE_URL não configurada")
            return False
        
        if not settings.SUPABASE_KEY:
            print("❌ ERRO: SUPABASE_KEY não configurada")
            return False
        
        if not settings.SUPABASE_SERVICE_KEY:
            print("❌ ERRO: SUPABASE_SERVICE_KEY não configurada")
            return False
        
        print("✅ Variáveis de ambiente configuradas")
        
        # Testar conexão
        supabase_service = SupabaseService()
        
        # Testar busca de roupas
        print("🔍 Testando busca de roupas...")
        roupas = supabase_service.get_roupas()
        print(f"✅ Encontradas {len(roupas)} roupas no Supabase")
        
        # Testar criação de uma roupa de teste
        print("🔍 Testando criação de roupa...")
        roupa_teste = {
            'nome': 'Teste de Conexão Supabase',
            'descricao': 'Roupa criada para testar a integração',
            'preco': 99.90,
            'categoria': 'vestido',
            'tamanhos': 'P,M,G',
            'imagem_principal': '',
            'imagem_2': '',
            'imagem_3': '',
            'ativo': True
        }
        
        roupa_criada = supabase_service.create_roupa(roupa_teste)
        if roupa_criada:
            print("✅ Roupa de teste criada com sucesso!")
            print(f"   ID: {roupa_criada['id']}")
            print(f"   Nome: {roupa_criada['nome']}")
            
            # Testar busca da roupa criada
            roupa_buscada = supabase_service.get_roupa_by_id(roupa_criada['id'])
            if roupa_buscada:
                print("✅ Roupa encontrada por ID!")
            else:
                print("❌ ERRO: Não foi possível buscar a roupa por ID")
                return False
            
            # Testar atualização da roupa
            print("🔍 Testando atualização de roupa...")
            roupa_atualizada = supabase_service.update_roupa(
                roupa_criada['id'], 
                {'nome': 'Teste Atualizado - Supabase'}
            )
            if roupa_atualizada:
                print("✅ Roupa atualizada com sucesso!")
            else:
                print("❌ ERRO: Não foi possível atualizar a roupa")
                return False
            
            # Testar desativação da roupa (soft delete)
            print("🔍 Testando desativação de roupa...")
            roupa_desativada = supabase_service.delete_roupa(roupa_criada['id'])
            if roupa_desativada:
                print("✅ Roupa desativada com sucesso!")
            else:
                print("❌ ERRO: Não foi possível desativar a roupa")
                return False
            
        else:
            print("❌ ERRO: Não foi possível criar a roupa de teste")
            return False
        
        print("\n🎉 SUCESSO! Integração com Supabase funcionando perfeitamente!")
        return True
        
    except Exception as e:
        print(f"❌ ERRO: {str(e)}")
        return False

def test_django_models():
    """Testa se os modelos Django estão funcionando"""
    print("\n🔍 Testando modelos Django...")
    
    try:
        from pag1.models import Roupa
        
        # Testar criação de uma roupa local
        roupa_local = Roupa()
        roupa_local.nome = "Teste Django Model"
        roupa_local.descricao = "Teste de modelo Django"
        roupa_local.preco = 50.00
        roupa_local.categoria = "blusa"
        roupa_local.tamanhos = "P,M"
        roupa_local.ativo = True
        
        # Testar métodos do modelo
        print(f"✅ Nome: {roupa_local.nome}")
        print(f"✅ Preço formatado: {roupa_local.get_preco_formatado()}")
        print(f"✅ Categoria: {roupa_local.get_categoria_display_pt()}")
        print(f"✅ Tamanhos: {roupa_local.get_tamanhos_display()}")
        print(f"✅ Status: {roupa_local.get_status_display()}")
        
        print("✅ Modelos Django funcionando corretamente!")
        return True
        
    except Exception as e:
        print(f"❌ ERRO nos modelos Django: {str(e)}")
        return False

def main():
    """Função principal de teste"""
    print("=" * 50)
    print("🧪 TESTE DE INTEGRAÇÃO SUPABASE - PAIXÃO MODAS")
    print("=" * 50)
    
    # Testar modelos Django
    django_ok = test_django_models()
    
    # Testar conexão Supabase
    supabase_ok = test_supabase_connection()
    
    print("\n" + "=" * 50)
    print("📊 RESULTADO DOS TESTES")
    print("=" * 50)
    print(f"Django Models: {'✅ OK' if django_ok else '❌ ERRO'}")
    print(f"Supabase: {'✅ OK' if supabase_ok else '❌ ERRO'}")
    
    if django_ok and supabase_ok:
        print("\n🎉 PARABÉNS! Tudo está funcionando perfeitamente!")
        print("Você pode agora:")
        print("1. Executar: python manage.py runserver")
        print("2. Acessar: http://localhost:8000/")
        print("3. Acessar o admin: http://localhost:8000/painel-admin/")
    else:
        print("\n❌ Há problemas que precisam ser resolvidos.")
        print("Verifique as configurações e tente novamente.")
    
    print("=" * 50)

if __name__ == "__main__":
    main()
