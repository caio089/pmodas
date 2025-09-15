from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
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
    return render(request, 'pag1/admin_dashboard.html')

def admin_logout(request):
    """Logout do painel administrativo"""
    logout(request)
    return redirect('admin_login')

@csrf_exempt
def admin_api_products(request):
    """API para gerenciar produtos do painel administrativo"""
    if request.method == 'GET':
        # Retornar lista de produtos (simulado)
        products = [
            {
                'id': 1,
                'name': 'Vestido Floral Elegante',
                'price': '89.90',
                'category': 'vestidos',
                'color': 'floral',
                'sizes': 'P, M, G, GG',
                'status': 'ativo',
                'description': 'Vestido elegante com estampa floral',
                'photos': ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop']
            }
        ]
        return JsonResponse({'products': products})
    
    elif request.method == 'POST':
        # Adicionar novo produto
        try:
            data = json.loads(request.body)
            # Aqui você salvaria no banco de dados
            return JsonResponse({'success': True, 'message': 'Produto adicionado com sucesso!'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})
    
    return JsonResponse({'error': 'Método não permitido'}, status=405)
