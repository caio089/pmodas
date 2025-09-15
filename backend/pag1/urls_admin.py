from django.urls import path
from . import views

urlpatterns = [
    # Painel Administrativo - URLs específicas para evitar conflito com admin do Django
    path('painel-admin/', views.admin_login, name='admin_login'),
    path('painel-admin/dashboard/', views.admin_dashboard, name='admin_dashboard'),
]
