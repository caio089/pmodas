# 🧪 GUIA DE TESTE - INTEGRAÇÃO SUPABASE

## ✅ **PASSO 1: VERIFICAR CONFIGURAÇÃO DO SUPABASE**

### 1.1 Verificar se as variáveis de ambiente estão configuradas
Crie um arquivo `.env` na pasta `backend/` com:
```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_KEY=sua_chave_anonima
SUPABASE_SERVICE_KEY=sua_chave_de_servico
SECRET_KEY=sua_chave_secreta_django
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### 1.2 Verificar se o bucket 'imagens' foi criado
- Acesse o Supabase → Storage
- Verifique se existe o bucket `imagens`
- Confirme que está marcado como **público**

## ✅ **PASSO 2: TESTAR CONEXÃO COM SUPABASE**

### 2.1 Executar o servidor Django
```bash
cd backend
python manage.py runserver
```

### 2.2 Verificar logs do servidor
- Abra o terminal onde o servidor está rodando
- Procure por mensagens de erro relacionadas ao Supabase
- Se não houver erros, a conexão está funcionando

## ✅ **PASSO 3: TESTAR FUNCIONALIDADES**

### 3.1 Acessar o site principal
- Abra: `http://localhost:8000/`
- Verifique se a página carrega sem erros
- Se houver produtos cadastrados, eles devem aparecer

### 3.2 Acessar o painel administrativo
- Abra: `http://localhost:8000/painel-admin/`
- Faça login com: `cliente` / `pmodas2024`
- Verifique se o dashboard carrega

### 3.3 Testar adicionar uma roupa
1. No painel admin, clique em "Adicionar Nova Roupa"
2. Preencha os campos:
   - Nome: "Teste Supabase"
   - Preço: 99.90
   - Categoria: Vestido
   - Tamanhos: P,M,G
   - Descrição: "Teste de integração"
3. Selecione uma imagem
4. Clique em "Adicionar Roupa"

### 3.4 Verificar se a roupa foi salva
1. Volte ao dashboard
2. Verifique se a roupa aparece na lista
3. Clique em "Editar" para ver os detalhes

## ✅ **PASSO 4: VERIFICAR NO SUPABASE**

### 4.1 Verificar dados na tabela
- Acesse o Supabase → Table Editor
- Selecione a tabela `roupas`
- Verifique se os dados foram salvos

### 4.2 Verificar imagens no Storage
- Acesse o Supabase → Storage
- Abra o bucket `imagens`
- Verifique se as imagens foram enviadas

## ✅ **PASSO 5: TESTAR FUNCIONALIDADES COMPLETAS**

### 5.1 Testar filtros no site principal
- Acesse: `http://localhost:8000/`
- Teste os filtros de categoria e preço
- Verifique se os produtos são filtrados corretamente

### 5.2 Testar busca
- Digite algo na barra de busca
- Verifique se os resultados aparecem

### 5.3 Testar edição de roupa
1. No painel admin, clique em "Editar" em uma roupa
2. Modifique alguns dados
3. Salve as alterações
4. Verifique se as mudanças foram aplicadas

### 5.4 Testar ativação/desativação
1. No painel admin, clique em "Desativar" em uma roupa
2. Volte ao site principal
3. Verifique se a roupa não aparece mais
4. Reative a roupa no painel admin

## ✅ **PASSO 6: VERIFICAR LOGS DE ERRO**

### 6.1 Verificar logs do Django
- No terminal do servidor, procure por mensagens de erro
- Se houver erros, anote-os para correção

### 6.2 Verificar logs do Supabase
- Acesse o Supabase → Logs
- Verifique se há erros de API

## 🚨 **PROBLEMAS COMUNS E SOLUÇÕES**

### Problema: "Erro ao conectar com Supabase"
**Solução:**
- Verifique se as variáveis de ambiente estão corretas
- Confirme se a URL e as chaves estão corretas

### Problema: "Erro ao fazer upload de imagem"
**Solução:**
- Verifique se o bucket `imagens` foi criado
- Confirme se as políticas do Storage estão corretas

### Problema: "Produtos não aparecem no site"
**Solução:**
- Verifique se as roupas estão marcadas como `ativo = true`
- Confirme se a política de leitura pública está funcionando

### Problema: "Erro 500 no servidor"
**Solução:**
- Verifique os logs do Django
- Confirme se todas as dependências estão instaladas

## ✅ **CHECKLIST FINAL**

- [ ] Servidor Django rodando sem erros
- [ ] Site principal carregando
- [ ] Painel admin acessível
- [ ] Login funcionando
- [ ] Adicionar roupa funcionando
- [ ] Imagens sendo enviadas para Supabase
- [ ] Dados sendo salvos na tabela
- [ ] Filtros funcionando
- [ ] Busca funcionando
- [ ] Edição funcionando
- [ ] Ativação/desativação funcionando

## 🎉 **SUCESSO!**

Se todos os itens do checklist estão marcados, sua integração com Supabase está funcionando perfeitamente!

## 📞 **SUPORTE**

Se encontrar problemas:
1. Verifique os logs de erro
2. Confirme as configurações
3. Teste cada funcionalidade individualmente
4. Consulte a documentação do Supabase
