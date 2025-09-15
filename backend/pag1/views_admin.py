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
    # Buscar roupas do banco de dados
    roupas = Roupa.objects.all().order_by('-data_criacao')
    
    # Filtros
    categoria = request.GET.get('categoria', '')
    busca = request.GET.get('busca', '')
    
    if categoria:
        roupas = roupas.filter(categoria=categoria)
    
    if busca:
        roupas = roupas.filter(
            Q(nome__icontains=busca) | Q(descricao__icontains=busca)
        )
    
    # Paginação
    paginator = Paginator(roupas, 12)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Estatísticas
    total_roupas = Roupa.objects.count()
    roupas_por_categoria = {}
    for categoria_choice in Roupa.CATEGORIA_CHOICES:
        count = Roupa.objects.filter(categoria=categoria_choice[0]).count()
        roupas_por_categoria[categoria_choice[1]] = count
    
    context = {
        'page_obj': page_obj,
        'total_roupas': total_roupas,
        'roupas_por_categoria': roupas_por_categoria,
        'categorias': Roupa.CATEGORIA_CHOICES,
        'categoria_atual': categoria,
        'busca_atual': busca,
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
            roupa = Roupa.objects.create(
                nome=request.POST.get('nome'),
                descricao=request.POST.get('descricao', ''),
                preco=request.POST.get('preco'),
                categoria=request.POST.get('categoria'),
                tamanhos=request.POST.get('tamanhos', 'P,M,G'),
                imagem_principal=request.FILES.get('imagem_principal'),
                imagem_2=request.FILES.get('imagem_2'),
                imagem_3=request.FILES.get('imagem_3')
            )
            messages.success(request, f'Roupa "{roupa.nome}" adicionada com sucesso!')
            return redirect('admin_dashboard')
        except Exception as e:
            messages.error(request, f'Erro ao adicionar roupa: {str(e)}')
    
    return redirect('admin_dashboard')

@login_required
def editar_roupa(request, roupa_id):
    """Editar roupa existente"""
    roupa = get_object_or_404(Roupa, id=roupa_id)
    
    if request.method == 'POST':
        try:
            roupa.nome = request.POST.get('nome')
            roupa.descricao = request.POST.get('descricao', '')
            roupa.preco = request.POST.get('preco')
            roupa.categoria = request.POST.get('categoria')
            roupa.tamanhos = request.POST.get('tamanhos', 'P,M,G')
            
            if request.FILES.get('imagem_principal'):
                roupa.imagem_principal = request.FILES.get('imagem_principal')
            if request.FILES.get('imagem_2'):
                roupa.imagem_2 = request.FILES.get('imagem_2')
            if request.FILES.get('imagem_3'):
                roupa.imagem_3 = request.FILES.get('imagem_3')
            
            roupa.save()
            messages.success(request, f'Roupa "{roupa.nome}" atualizada com sucesso!')
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
    """Excluir roupa"""
    roupa = get_object_or_404(Roupa, id=roupa_id)
    
    if request.method == 'POST':
        try:
            nome_roupa = roupa.nome
            roupa.delete()
            messages.success(request, f'Roupa "{nome_roupa}" excluída com sucesso!')
        except Exception as e:
            messages.error(request, f'Erro ao excluir roupa: {str(e)}')
    
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
