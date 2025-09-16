#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "🚀 Iniciando build no Render..."

# Install dependencies
echo "📦 Instalando dependências..."
pip install -r requirements.txt

# Check Django configuration
echo "🔍 Verificando configuração Django..."
python manage.py check --deploy

# Run migrations
echo "🗄️ Aplicando migrações..."
python manage.py migrate --no-input

# Collect static files
echo "📁 Coletando arquivos estáticos..."
python manage.py collectstatic --no-input --clear

# Verificar se os arquivos foram coletados
echo "🔍 Verificando arquivos estáticos coletados..."
ls -la staticfiles/ || echo "Diretório staticfiles não encontrado"
ls -la staticfiles/pag1/ || echo "Diretório pag1 não encontrado em staticfiles"

# Create superuser if it doesn't exist
echo "👤 Criando superusuário..."
echo "from django.contrib.auth.models import User; User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'admin@example.com', 'admin123')" | python manage.py shell

# Verificar configurações
echo "✅ Verificando configurações finais..."
python manage.py check --deploy

echo "🎉 Build concluído com sucesso!"
