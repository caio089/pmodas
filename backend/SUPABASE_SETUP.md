# Configuração do Supabase para Paixão Modas

## 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Clique em "New Project"
4. Escolha sua organização e dê um nome ao projeto (ex: "pmodas")
5. Escolha uma senha forte para o banco de dados
6. Escolha uma região próxima ao Brasil (ex: South America - São Paulo)
7. Clique em "Create new project"

## 2. Configurar Banco de Dados

Execute este SQL no editor SQL do Supabase:

```sql
-- Criar tabela de roupas
CREATE TABLE roupas (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL CHECK (preco > 0),
    categoria VARCHAR(20) NOT NULL CHECK (categoria IN ('vestido', 'blusa', 'calca', 'saia', 'conjunto', 'acessorios')),
    tamanhos VARCHAR(20) NOT NULL DEFAULT 'P,M,G',
    imagem_principal TEXT,
    imagem_2 TEXT,
    imagem_3 TEXT,
    ativo BOOLEAN NOT NULL DEFAULT true,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX idx_roupas_ativo ON roupas(ativo);
CREATE INDEX idx_roupas_categoria ON roupas(categoria);
CREATE INDEX idx_roupas_data_criacao ON roupas(data_criacao);

-- Habilitar RLS (Row Level Security)
ALTER TABLE roupas ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública de roupas ativas
CREATE POLICY "Permitir leitura de roupas ativas" ON roupas
    FOR SELECT USING (ativo = true);

-- Política para permitir todas as operações para usuários autenticados
CREATE POLICY "Permitir todas as operações para usuários autenticados" ON roupas
    FOR ALL USING (auth.role() = 'authenticated');
```

## 3. Configurar Storage

1. No painel do Supabase, vá para "Storage"
2. Clique em "Create a new bucket"
3. Nome: `imagens`
4. Marque como público: **SIM**
5. Clique em "Create bucket"

### Configurar políticas do Storage:

```sql
-- Política para permitir upload de imagens
CREATE POLICY "Permitir upload de imagens" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'imagens');

-- Política para permitir leitura pública de imagens
CREATE POLICY "Permitir leitura pública de imagens" ON storage.objects
    FOR SELECT USING (bucket_id = 'imagens');

-- Política para permitir atualização de imagens
CREATE POLICY "Permitir atualização de imagens" ON storage.objects
    FOR UPDATE USING (bucket_id = 'imagens');

-- Política para permitir exclusão de imagens
CREATE POLICY "Permitir exclusão de imagens" ON storage.objects
    FOR DELETE USING (bucket_id = 'imagens');
```

## 4. Obter Chaves de API

1. No painel do Supabase, vá para "Settings" > "API"
2. Copie as seguintes informações:
   - **Project URL** (SUPABASE_URL)
   - **anon public** key (SUPABASE_KEY)
   - **service_role** key (SUPABASE_SERVICE_KEY)

## 5. Configurar Variáveis de Ambiente

### Para desenvolvimento local:
Crie um arquivo `.env` na pasta `backend/` com:

```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_KEY=sua_chave_anonima
SUPABASE_SERVICE_KEY=sua_chave_de_servico
SECRET_KEY=sua_chave_secreta_django
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Para produção no Render:
1. No painel do Render, vá para seu serviço
2. Clique em "Environment"
3. Adicione as variáveis:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `SUPABASE_SERVICE_KEY`
   - `SECRET_KEY` (gerada automaticamente)
   - `DEBUG=False`
   - `ALLOWED_HOSTS=pmodas-backend.onrender.com`

## 6. Testar a Configuração

1. Execute as migrações: `python manage.py migrate`
2. Inicie o servidor: `python manage.py runserver`
3. Acesse o painel admin: `http://localhost:8000/admin/`
4. Tente adicionar uma roupa com imagem

## 7. Deploy no Render

1. Faça push do código para o GitHub
2. No Render, conecte seu repositório
3. Configure as variáveis de ambiente
4. Faça o deploy

## Estrutura Final

- **Banco de dados**: Supabase PostgreSQL
- **Storage**: Supabase Storage para imagens
- **Deploy**: Render.com
- **Dados persistentes**: Não se perdem com deploys
- **Imagens**: URLs públicas do Supabase

