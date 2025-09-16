from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.paginator import Paginator
from django.db.models import Q
from .models import Roupa
from .supabase_service import SupabaseService
import json

def admin_login(request):
    """Página de login do painel administrativo"""
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        # Verificar credenciais específicas do cliente
        if username == 'cliente' and password == 'pmodas2024':
            # Criar usuário se não existir
            if not User.objects.filter(username='cliente').exists():
                User.objects.create_user(username='cliente', password='pmodas2024')
            
            user = authenticate(request, username=username, password=password)
            if user:
                login(request, user)
                return redirect('admin_dashboard')
            else:
                messages.error(request, 'Credenciais inválidas!')
        else:
            messages.error(request, 'Acesso negado! Apenas o cliente autorizado pode acessar.')
    
    return render(request, 'pag1/admin_login.html')

@login_required
def admin_dashboard(request):
    """Dashboard do painel administrativo - Acesso restrito"""
    supabase_service = SupabaseService()
    
    # Buscar todas as roupas do Supabase
    roupas_data = supabase_service.get_roupas()
    
    # Converter para objetos Roupa para compatibilidade
    roupas = []
    for roupas_data_item in roupas_data:
        roupa = Roupa()
        roupa.id = roupas_data_item['id']
        roupa.nome = roupas_data_item['nome']
        roupa.descricao = roupas_data_item.get('descricao', '')
        roupa.preco = float(roupas_data_item['preco'])
        roupa.categoria = roupas_data_item['categoria']
        roupa.tamanhos = roupas_data_item['tamanhos']
        roupa.imagem_principal = roupas_data_item.get('imagem_principal', '')
        roupa.imagem_2 = roupas_data_item.get('imagem_2', '')
        roupa.imagem_3 = roupas_data_item.get('imagem_3', '')
        roupa.ativo = roupas_data_item['ativo']
        roupa.data_criacao = roupas_data_item.get('data_criacao', '')
        roupas.append(roupa)
    
    # Filtro por status ativo/inativo
    status = request.GET.get('status', '')
    if status == 'ativo':
        roupas = [r for r in roupas if r.ativo]
    elif status == 'inativo':
        roupas = [r for r in roupas if not r.ativo]
    
    # Filtros
    categoria = request.GET.get('categoria', '')
    busca = request.GET.get('busca', '')
    
    if categoria:
        roupas = [r for r in roupas if r.categoria == categoria]
    
    if busca:
        roupas = [r for r in roupas if busca.lower() in r.nome.lower() or busca.lower() in (r.descricao or '').lower()]
    
    # Paginação
    paginator = Paginator(roupas, 12)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Estatísticas
    total_roupas = len(roupas_data)
    roupas_ativas = len([r for r in roupas_data if r['ativo']])
    roupas_inativas = len([r for r in roupas_data if not r['ativo']])
    roupas_por_categoria = {}
    for categoria_choice in Roupa.CATEGORIA_CHOICES:
        count = len([r for r in roupas_data if r['categoria'] == categoria_choice[0]])
        roupas_por_categoria[categoria_choice[1]] = count
    
    context = {
        'page_obj': page_obj,
        'total_roupas': total_roupas,
        'roupas_ativas': roupas_ativas,
        'roupas_inativas': roupas_inativas,
        'roupas_por_categoria': roupas_por_categoria,
        'categorias': Roupa.CATEGORIA_CHOICES,
        'categoria_atual': categoria,
        'busca_atual': busca,
        'status_atual': status,
    }
    
    return render(request, 'pag1/admin_dashboard.html', context)

def admin_logout(request):
    """Logout do painel administrativo"""
    logout(request)
    return redirect('admin_login')

@login_required
def adicionar_roupa(request):
    """Adicionar nova roupa"""
    if request.method == 'POST':
        try:
            supabase_service = SupabaseService()
            
            # Fazer upload das imagens para o Supabase Storage
            imagem_principal_url = ''
            imagem_2_url = ''
            imagem_3_url = ''
            
            if request.FILES.get('imagem_principal'):
                imagem_principal_url = supabase_service.upload_image(request.FILES['imagem_principal'])
            
            if request.FILES.get('imagem_2'):
                imagem_2_url = supabase_service.upload_image(request.FILES['imagem_2'])
            
            if request.FILES.get('imagem_3'):
                imagem_3_url = supabase_service.upload_image(request.FILES['imagem_3'])
            
            # Preparar dados para o Supabase
            roupas_data = {
                'nome': request.POST.get('nome'),
                'descricao': request.POST.get('descricao', ''),
                'preco': float(request.POST.get('preco')),
                'categoria': request.POST.get('categoria'),
                'tamanhos': request.POST.get('tamanhos', 'P,M,G'),
                'imagem_principal': imagem_principal_url,
                'imagem_2': imagem_2_url,
                'imagem_3': imagem_3_url,
                'ativo': True
            }
            
            # Criar roupa no Supabase
            roupa_criada = supabase_service.create_roupa(roupas_data)
            
            if roupa_criada:
                messages.success(request, f'Roupa "{roupas_data["nome"]}" adicionada com sucesso!')
            else:
                messages.error(request, 'Erro ao adicionar roupa no Supabase!')
                
            return redirect('admin_dashboard')
        except Exception as e:
            messages.error(request, f'Erro ao adicionar roupa: {str(e)}')
    
    return redirect('admin_dashboard')

@login_required
def editar_roupa(request, roupa_id):
    """Editar roupa existente"""
    supabase_service = SupabaseService()
    roupa_data = supabase_service.get_roupa_by_id(roupa_id)
    
    if not roupa_data:
        messages.error(request, 'Roupa não encontrada!')
        return redirect('admin_dashboard')
    
    # Converter para objeto Roupa para compatibilidade
    roupa = Roupa()
    roupa.id = roupa_data['id']
    roupa.nome = roupa_data['nome']
    roupa.descricao = roupa_data.get('descricao', '')
    roupa.preco = float(roupa_data['preco'])
    roupa.categoria = roupa_data['categoria']
    roupa.tamanhos = roupa_data['tamanhos']
    roupa.imagem_principal = roupa_data.get('imagem_principal', '')
    roupa.imagem_2 = roupa_data.get('imagem_2', '')
    roupa.imagem_3 = roupa_data.get('imagem_3', '')
    roupa.ativo = roupa_data['ativo']
    
    if request.method == 'POST':
        try:
            # Fazer upload das novas imagens se fornecidas
            imagem_principal_url = roupa_data.get('imagem_principal', '')
            imagem_2_url = roupa_data.get('imagem_2', '')
            imagem_3_url = roupa_data.get('imagem_3', '')
            
            if request.FILES.get('imagem_principal'):
                # Deletar imagem antiga se existir
                if imagem_principal_url:
                    supabase_service.delete_image(imagem_principal_url)
                imagem_principal_url = supabase_service.upload_image(request.FILES['imagem_principal'])
            
            if request.FILES.get('imagem_2'):
                if imagem_2_url:
                    supabase_service.delete_image(imagem_2_url)
                imagem_2_url = supabase_service.upload_image(request.FILES['imagem_2'])
            
            if request.FILES.get('imagem_3'):
                if imagem_3_url:
                    supabase_service.delete_image(imagem_3_url)
                imagem_3_url = supabase_service.upload_image(request.FILES['imagem_3'])
            
            # Preparar dados para atualização
            roupas_data = {
                'nome': request.POST.get('nome'),
                'descricao': request.POST.get('descricao', ''),
                'preco': float(request.POST.get('preco')),
                'categoria': request.POST.get('categoria'),
                'tamanhos': request.POST.get('tamanhos', 'P,M,G'),
                'imagem_principal': imagem_principal_url,
                'imagem_2': imagem_2_url,
                'imagem_3': imagem_3_url,
                'ativo': roupa_data['ativo']
            }
            
            # Atualizar no Supabase
            roupa_atualizada = supabase_service.update_roupa(roupa_id, roupas_data)
            
            if roupa_atualizada:
                messages.success(request, f'Roupa "{roupas_data["nome"]}" atualizada com sucesso!')
            else:
                messages.error(request, 'Erro ao atualizar roupa no Supabase!')
                
            return redirect('admin_dashboard')
        except Exception as e:
            messages.error(request, f'Erro ao atualizar roupa: {str(e)}')
    
    context = {
        'roupa': roupa,
        'categorias': Roupa.CATEGORIA_CHOICES,
        'tamanhos': Roupa.TAMANHO_CHOICES,
    }
    return render(request, 'pag1/editar_roupa.html', context)

@login_required
def excluir_roupa(request, roupa_id):
    """Excluir roupa (soft delete)"""
    if request.method == 'POST':
        try:
            supabase_service = SupabaseService()
            roupa_data = supabase_service.get_roupa_by_id(roupa_id)
            
            if roupa_data:
                # Deletar imagens do storage
                if roupa_data.get('imagem_principal'):
                    supabase_service.delete_image(roupa_data['imagem_principal'])
                if roupa_data.get('imagem_2'):
                    supabase_service.delete_image(roupa_data['imagem_2'])
                if roupa_data.get('imagem_3'):
                    supabase_service.delete_image(roupa_data['imagem_3'])
                
                # Marcar como inativo no Supabase
                supabase_service.delete_roupa(roupa_id)
                messages.success(request, f'Roupa "{roupa_data["nome"]}" excluída com sucesso!')
            else:
                messages.error(request, 'Roupa não encontrada!')
        except Exception as e:
            messages.error(request, f'Erro ao excluir roupa: {str(e)}')
    
    return redirect('admin_dashboard')

@login_required
def alternar_status_roupa(request, roupa_id):
    """Alternar status ativo/inativo da roupa"""
    if request.method == 'POST':
        try:
            supabase_service = SupabaseService()
            roupa_data = supabase_service.get_roupa_by_id(roupa_id)
            
            if roupa_data:
                novo_status = not roupa_data['ativo']
                supabase_service.update_roupa(roupa_id, {'ativo': novo_status})
                
                status_texto = "ativada" if novo_status else "desativada"
                messages.success(request, f'Roupa "{roupa_data["nome"]}" foi {status_texto} com sucesso!')
            else:
                messages.error(request, 'Roupa não encontrada!')
        except Exception as e:
            messages.error(request, f'Erro ao alterar status da roupa: {str(e)}')
    
    return redirect('admin_dashboard')

@csrf_exempt
def admin_api_products(request):
    """API para gerenciar produtos do painel administrativo"""
    if request.method == 'GET':
        # Retornar lista de produtos do banco de dados
        roupas = Roupa.objects.all()
        products = []
        for roupa in roupas:
            products.append({
                'id': roupa.id,
                'name': roupa.nome,
                'price': str(roupa.preco),
                'category': roupa.categoria,
                'description': roupa.descricao or '',
                'imagem': roupa.imagem.url if roupa.imagem else '',
                'data_criacao': roupa.data_criacao.isoformat()
            })
        return JsonResponse({'products': products})
    
    elif request.method == 'POST':
        # Adicionar novo produto
        try:
            data = json.loads(request.body)
            roupa = Roupa.objects.create(
                nome=data.get('name'),
                descricao=data.get('description', ''),
                preco=data.get('price'),
                categoria=data.get('category')
            )
            return JsonResponse({'success': True, 'message': 'Produto adicionado com sucesso!'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})
    
    return JsonResponse({'error': 'Método não permitido'}, status=405)
