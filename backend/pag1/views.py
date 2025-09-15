from django.shortcuts import render
from .models import Roupa

def home(request):
    # Carregar apenas roupas ativas do banco de dados
    roupas = Roupa.objects.filter(ativo=True).order_by('-data_criacao')
    
    # Filtros opcionais via GET
    categoria = request.GET.get('categoria', '')
    preco_range = request.GET.get('preco', '')
    busca = request.GET.get('busca', '')
    
    # Aplicar filtros
    if categoria:
        roupas = roupas.filter(categoria=categoria)
    
    # Processar filtro de preço
    if preco_range:
        if preco_range == '0-50':
            roupas = roupas.filter(preco__lte=50)
        elif preco_range == '50-100':
            roupas = roupas.filter(preco__gte=50, preco__lte=100)
        elif preco_range == '100-200':
            roupas = roupas.filter(preco__gte=100, preco__lte=200)
        elif preco_range == '200+':
            roupas = roupas.filter(preco__gte=200)
    
    if busca:
        roupas = roupas.filter(
            nome__icontains=busca
        )
    
    context = {
        'roupas': roupas,
        'categorias': Roupa.CATEGORIA_CHOICES,
        'categoria_atual': categoria,
        'busca_atual': busca,
        'preco_atual': preco_range,
    }
    
    return render(request, "pag1/index.html", context)