from django.urls import path, include
from django.shortcuts import redirect
from .views import home
from . import views_admin

def redirect_to_admin(request):
    """Redireciona para o painel administrativo"""
    return redirect('admin_login')

urlpatterns = [
    path("", home, name="home"),
    
    # Redirecionamentos para facilitar acesso
    path('admin_login/', redirect_to_admin, name='redirect_admin'),
    path('admin/', redirect_to_admin, name='redirect_admin_alt'),
    
    # Painel Administrativo - URLs específicas para evitar conflito com admin do Django
    path('painel-admin/', views_admin.admin_login, name='admin_login'),
    path('painel-admin/dashboard/', views_admin.admin_dashboard, name='admin_dashboard'),
    path('painel-admin/logout/', views_admin.admin_logout, name='admin_logout'),
    path('painel-admin/api/products/', views_admin.admin_api_products, name='admin_api_products'),
    
    # CRUD de Roupas
    path('painel-admin/adicionar-roupa/', views_admin.adicionar_roupa, name='adicionar_roupa'),
    path('painel-admin/editar-roupa/<int:roupa_id>/', views_admin.editar_roupa, name='editar_roupa'),
    path('painel-admin/excluir-roupa/<int:roupa_id>/', views_admin.excluir_roupa, name='excluir_roupa'),
    path('painel-admin/alternar-status/<int:roupa_id>/', views_admin.alternar_status_roupa, name='alternar_status_roupa'),
]
