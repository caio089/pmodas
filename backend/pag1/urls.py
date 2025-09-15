from django.urls import path, include
from .views import home
from . import views_admin

urlpatterns = [
    path("", home, name="home"),
    
    # Painel Administrativo - URLs específicas para evitar conflito com admin do Django
    path('painel-admin/', views_admin.admin_login, name='admin_login'),
    path('painel-admin/dashboard/', views_admin.admin_dashboard, name='admin_dashboard'),
    path('painel-admin/api/products/', views_admin.admin_api_products, name='admin_api_products'),
]
