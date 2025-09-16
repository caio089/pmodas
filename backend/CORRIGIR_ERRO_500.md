# 🔧 Corrigindo Erro 500 no Render

## 📋 Diagnóstico

Baseado nos logs, o erro 500 (Internal Server Error) indica que:
- ✅ O erro 400 foi corrigido (ALLOWED_HOSTS)
- ❌ Agora há um problema no código Django em tempo de execução

## 🔍 Possíveis Causas

### 1. **Banco de Dados PostgreSQL**
- O Render usa PostgreSQL, mas o código pode estar tentando usar SQLite
- **Solução**: Configurar DATABASE_URL corretamente

### 2. **Variáveis de Ambiente Faltando**
- SECRET_KEY, SUPABASE_URL, etc.
- **Solução**: Verificar todas as variáveis no dashboard do Render

### 3. **Migrações Não Aplicadas**
- Banco em produção sem migrações
- **Solução**: Executar `python manage.py migrate`

### 4. **Arquivos Estáticos**
- Templates ou arquivos CSS/JS não encontrados
- **Solução**: Executar `python manage.py collectstatic`

## 🚀 Correções Aplicadas

### ✅ **Arquivos Modificados:**

1. **`build.sh`** - Script de build melhorado com logs
2. **`render.yaml`** - Configuração do Render atualizada
3. **`verificar_render.py`** - Script de verificação
4. **`render_settings.py`** - Configurações específicas do Render

### ✅ **Configurações Corrigidas:**

- **ALLOWED_HOSTS**: `['*']` para aceitar todos os hosts
- **DEBUG**: `False` por padrão
- **Banco de Dados**: Configuração robusta para PostgreSQL/SQLite
- **Arquivos Estáticos**: WhiteNoise configurado corretamente
- **Middleware**: Ordem corrigida

## 📋 Próximos Passos

### 1. **Fazer Deploy das Correções:**
```bash
git add .
git commit -m "Correções para erro 500 no Render"
git push origin main
```

### 2. **No Render Dashboard:**
- Ir para o serviço
- Clicar em "Manual Deploy" > "Deploy latest commit"
- Aguardar o build

### 3. **Verificar Logs:**
- Ir em "Logs" > "Service logs"
- Procurar por erros Python (stack trace)
- Verificar se o build foi bem-sucedido

### 4. **Variáveis de Ambiente:**
Verificar se estão configuradas:
- ✅ `SECRET_KEY` (gerada automaticamente)
- ✅ `DEBUG=False`
- ⚠️ `SUPABASE_URL` (opcional)
- ⚠️ `SUPABASE_KEY` (opcional)
- ⚠️ `SUPABASE_SERVICE_KEY` (opcional)

## 🔍 Debugging

### **Se ainda houver erro 500:**

1. **Verificar logs de aplicação** (não apenas de acesso)
2. **Procurar por stack trace Python**
3. **Verificar se todas as dependências estão instaladas**
4. **Testar localmente com `DEBUG=False`**

### **Comandos de Debug no Render:**
```bash
# No console do Render
python manage.py check --deploy
python manage.py migrate
python manage.py collectstatic --no-input
```

## 📞 URLs após correção:
- **Site**: `https://pmodas.onrender.com/`
- **Admin**: `https://pmodas.onrender.com/painel-admin/`
- **Django Admin**: `https://pmodas.onrender.com/admin/`

## 🔑 Credenciais:
- **Painel Admin**: `admin` / `paixao10`
- **Django Admin**: `admin` / `admin123`

---

**As correções devem resolver o erro 500. Faça o deploy e verifique os logs!** 🚀
