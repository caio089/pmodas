from django.contrib import admin
from django.utils.html import format_html
from .models import Roupa

@admin.register(Roupa)
class RoupaAdmin(admin.ModelAdmin):
    list_display = ['nome', 'categoria', 'tamanhos_display', 'preco_formatado', 'imagem_preview', 'data_criacao']
    list_filter = ['categoria', 'data_criacao']
    search_fields = ['nome', 'descricao']
    list_per_page = 20
    ordering = ['-data_criacao']
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('nome', 'descricao', 'categoria', 'tamanhos')
        }),
        ('Preço e Imagens', {
            'fields': ('preco', 'imagem_principal', 'imagem_2', 'imagem_3')
        }),
    )
    
    readonly_fields = ['data_criacao']
    
    def preco_formatado(self, obj):
        return obj.get_preco_formatado()
    preco_formatado.short_description = 'Preço'
    
    def tamanhos_display(self, obj):
        return obj.get_tamanhos_display()
    tamanhos_display.short_description = 'Tamanhos'
    
    def imagem_preview(self, obj):
        if obj.imagem_principal:
            return format_html(
                '<img src="{}" width="50" height="50" style="border-radius: 5px;" />',
                obj.imagem_principal.url
            )
        return "Sem imagem"
    imagem_preview.short_description = 'Preview'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related()