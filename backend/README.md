# Paixão Modas - E-commerce Django

Sistema de e-commerce completo para a loja Paixão Modas com painel administrativo integrado.

## 🚀 Deploy no Render

### Pré-requisitos
1. Conta no Render.com
2. Repositório no GitHub
3. (Opcional) Projeto Supabase configurado

### Passos para Deploy

1. **Conecte seu repositório ao Render**
   - Acesse render.com
   - Crie um novo Web Service
   - Conecte seu repositório GitHub

2. **Configure as variáveis de ambiente**
   - `SECRET_KEY`: Gerada automaticamente pelo Render
   - `DEBUG`: `False`
   - `SUPABASE_URL`: (Opcional) URL do seu Supabase
   - `SUPABASE_KEY`: (Opcional) Chave pública do Supabase
   - `SUPABASE_SERVICE_KEY`: (Opcional) Chave de serviço do Supabase

3. **Configurações do Build**
   - Build Command: `chmod +x ./build.sh && ./build.sh`
   - Start Command: `gunicorn backend.wsgi:application`
   - Python Version: 3.11+

### 📋 Funcionalidades

- ✅ **Site Principal**: Catálogo de produtos com carrinho
- ✅ **Painel Admin**: Gerenciamento completo de produtos
- ✅ **Sistema de Imagens**: Upload e exibição de fotos
- ✅ **WhatsApp Integration**: Mensagens automáticas
- ✅ **Responsivo**: Funciona em mobile e desktop

### 🔑 Credenciais

- **Painel Admin**: `admin` / `paixao10`
- **Admin Django**: `admin` / `admin123`

### 📁 Estrutura do Projeto

```
backend/
├── backend/          # Configurações Django
├── pag1/            # App principal
├── media/           # Imagens dos produtos
├── static/          # Arquivos estáticos
├── build.sh         # Script de build
├── Procfile         # Configuração do Render
├── requirements.txt # Dependências Python
└── render.yaml      # Configuração do Render
```

### 🛠️ Tecnologias

- **Backend**: Django 5.2.5
- **Frontend**: HTML, CSS (Tailwind), JavaScript
- **Banco**: PostgreSQL (Render) + SQLite (fallback)
- **Storage**: Supabase Storage (opcional)
- **Deploy**: Render.com

### 📞 Contato

Para suporte técnico, entre em contato com o desenvolvedor.
