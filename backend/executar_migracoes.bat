@echo off
echo 🔧 Configurando banco de dados do Django...
echo.

echo 📦 Executando migrações...
python manage.py migrate

echo.
echo 👤 Criando usuário cliente...
python manage.py shell -c "from django.contrib.auth.models import User; User.objects.create_user('cliente', 'cliente@paixao-modas.com', 'pmodas2024') if not User.objects.filter(username='cliente').exists() else print('Usuário já existe')"

echo.
echo ✅ Configuração concluída!
echo 🌐 Acesse: http://127.0.0.1:8000/painel-admin/
echo 📋 Credenciais: cliente / pmodas2024
echo.
echo 🚀 Iniciando servidor...
python manage.py runserver
