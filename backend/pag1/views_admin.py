from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

def admin_login(request):
    """Página de login do painel administrativo"""
    return render(request, 'pag1/admin_login.html')

def admin_dashboard(request):
    """Dashboard do painel administrativo"""
    return render(request, 'pag1/admin_dashboard.html')

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
