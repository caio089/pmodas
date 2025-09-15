@echo off
echo ========================================
echo    PAIXAO MODAS - Sistema Django
echo ========================================
echo.

echo Executando migrações do Django...
python manage.py makemigrations
python manage.py migrate

echo.
echo Criando usuário 'cliente' com senha 'pmodas2024'...
python manage.py shell -c "from django.contrib.auth.models import User; User.objects.filter(username='cliente').delete(); User.objects.create_user('cliente', password='pmodas2024')"

echo.
echo Criando superusuário para admin Django...
python manage.py shell -c "from django.contrib.auth.models import User; User.objects.filter(username='admin').delete(); User.objects.create_superuser('admin', 'admin@pmodas.com', 'admin123')"

echo.
echo ========================================
echo    Sistema configurado com sucesso!
echo ========================================
echo.
echo Acessos disponíveis:
echo - Site principal: http://127.0.0.1:8000/
echo - Painel admin: http://127.0.0.1:8000/painel-admin/
echo - Admin Django: http://127.0.0.1:8000/admin/
echo.
echo Credenciais:
echo - Cliente: cliente / pmodas2024
echo - Admin Django: admin / admin123
echo.
echo Iniciando o servidor Django...
echo.
python manage.py runserver
pause
