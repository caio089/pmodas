# 🚀 Deploy no Render - Instruções

## ⚠️ Problema Identificado
O site está retornando erro 400 (Bad Request). As correções aplicadas:

### ✅ Correções Aplicadas:

1. **ALLOWED_HOSTS**: Configurado para aceitar todos os hosts (`['*']`)
2. **DEBUG**: Configurado para `False` por padrão
3. **Configurações de Segurança**: Comentadas para evitar conflitos
4. **STATIC_ROOT**: Configurado corretamente
5. **WhiteNoise**: Configurado no middleware
6. **Build Script**: Atualizado com verificações

### 🔧 Arquivos Modificados:

- `backend/settings.py` - Configurações de produção
- `build.sh` - Script de build melhorado
- `render.yaml` - Configuração do Render
- `wsgi.py` - Configuração WSGI

### 📋 Próximos Passos:

1. **Fazer commit das mudanças:**
   ```bash
   git add .
   git commit -m "Correções para deploy no Render"
   git push origin main
   ```

2. **No Render.com:**
   - Ir para o dashboard do seu serviço
   - Clicar em "Manual Deploy" > "Deploy latest commit"
   - Aguardar o build

3. **Verificar logs:**
   - Ir em "Logs" no dashboard do Render
   - Verificar se há erros durante o build

### 🔍 Variáveis de Ambiente no Render:

- `SECRET_KEY`: Gerada automaticamente ✅
- `DEBUG`: `False` ✅
- `SUPABASE_URL`: (Opcional) Se usar Supabase
- `SUPABASE_KEY`: (Opcional) Se usar Supabase
- `SUPABASE_SERVICE_KEY`: (Opcional) Se usar Supabase

### 🆘 Se ainda houver problemas:

1. Verificar logs do Render
2. Testar localmente com `DEBUG=False`
3. Verificar se todas as dependências estão no requirements.txt

### 📞 URLs após deploy:
- Site: `https://pmodas.onrender.com/`
- Admin: `https://pmodas.onrender.com/painel-admin/`
- Django Admin: `https://pmodas.onrender.com/admin/`
