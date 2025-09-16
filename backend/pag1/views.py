from django.shortcuts import render
from .models import Roupa
from .supabase_service import SupabaseService

def home(request):
    # Usar Supabase para buscar roupas ou fallback local
    supabase_service = SupabaseService()
    
    if supabase_service.supabase:
        # Usar Supabase - buscar apenas roupas ativas para o site
        roupas_data = supabase_service.get_roupas_ativas()
        
        # Converter dados do Supabase para objetos Roupa (compatibilidade)
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
    else:
        # Usar banco SQLite local como fallback
        roupas_queryset = Roupa.objects.filter(ativo=True)
        roupas = []
        for roupa in roupas_queryset:
            # Criar objeto Roupa com URLs locais
            roupa_obj = Roupa()
            roupa_obj.id = roupa.id
            roupa_obj.nome = roupa.nome
            roupa_obj.descricao = roupa.descricao
            roupa_obj.preco = float(roupa.preco)
            roupa_obj.categoria = roupa.categoria
            roupa_obj.tamanhos = roupa.tamanhos
            roupa_obj.imagem_principal = roupa.imagem_principal.url if roupa.imagem_principal else ''
            roupa_obj.imagem_2 = roupa.imagem_2.url if roupa.imagem_2 else ''
            roupa_obj.imagem_3 = roupa.imagem_3.url if roupa.imagem_3 else ''
            roupa_obj.ativo = roupa.ativo
            roupa_obj.data_criacao = roupa.data_criacao
            roupas.append(roupa_obj)
        
    
    # Filtros opcionais via GET
    categoria = request.GET.get('categoria', '')
    preco_range = request.GET.get('preco', '')
    busca = request.GET.get('busca', '')
    
    # Aplicar filtros
    if categoria:
        roupas = [r for r in roupas if r.categoria == categoria]
    
    # Processar filtro de preço
    if preco_range:
        if preco_range == '0-50':
            roupas = [r for r in roupas if r.preco <= 50]
        elif preco_range == '50-100':
            roupas = [r for r in roupas if 50 <= r.preco <= 100]
        elif preco_range == '100-200':
            roupas = [r for r in roupas if 100 <= r.preco <= 200]
        elif preco_range == '200+':
            roupas = [r for r in roupas if r.preco >= 200]
    
    if busca:
        roupas = [r for r in roupas if busca.lower() in r.nome.lower() or busca.lower() in (r.descricao or '').lower()]
    
    context = {
        'roupas': roupas,
        'categorias': Roupa.CATEGORIA_CHOICES,
        'categoria_atual': categoria,
        'busca_atual': busca,
        'preco_atual': preco_range,
    }
    
    return render(request, "pag1/index.html", context)