-- SCRIPT CORRIGIDO FINAL - SUPABASE
-- Execute este script no SQL Editor do Supabase

-- 1. CRIAR TABELA DE ROUPAS (se não existir)
CREATE TABLE IF NOT EXISTS roupas (
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

-- 2. CRIAR ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_roupas_categoria ON roupas(categoria);
CREATE INDEX IF NOT EXISTS idx_roupas_ativo ON roupas(ativo);
CREATE INDEX IF NOT EXISTS idx_roupas_preco ON roupas(preco);
CREATE INDEX IF NOT EXISTS idx_roupas_data_criacao ON roupas(data_criacao);

-- 3. CRIAR FUNÇÃO E TRIGGER (removendo existentes primeiro)
DROP TRIGGER IF EXISTS trigger_atualizar_data_atualizacao ON roupas;
DROP FUNCTION IF EXISTS atualizar_data_atualizacao();

CREATE OR REPLACE FUNCTION atualizar_data_atualizacao()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualizar_data_atualizacao
    BEFORE UPDATE ON roupas
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_data_atualizacao();

-- 4. CRIAR BUCKET DE STORAGE PARA IMAGENS (se não existir)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'imagens',
    'imagens', 
    true,
    52428800, -- 50MB
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg']
) ON CONFLICT (id) DO NOTHING;

-- 5. DESABILITAR RLS TEMPORARIAMENTE
ALTER TABLE roupas DISABLE ROW LEVEL SECURITY;

-- 6. REMOVER TODAS AS POLÍTICAS EXISTENTES
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Remover políticas da tabela roupas
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'roupas') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON roupas';
    END LOOP;
    
    -- Remover políticas do storage
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON storage.objects';
    END LOOP;
END $$;

-- 7. REABILITAR RLS
ALTER TABLE roupas ENABLE ROW LEVEL SECURITY;

-- 8. CRIAR POLÍTICAS PERMISSIVAS PARA ROUPAS
CREATE POLICY "permitir_leitura_roupas" ON roupas
    FOR SELECT USING (true);

CREATE POLICY "permitir_insercao_roupas" ON roupas
    FOR INSERT WITH CHECK (true);

CREATE POLICY "permitir_atualizacao_roupas" ON roupas
    FOR UPDATE USING (true);

CREATE POLICY "permitir_exclusao_roupas" ON roupas
    FOR DELETE USING (true);

-- 9. CRIAR POLÍTICAS PERMISSIVAS PARA STORAGE (BUCKET imagens)
CREATE POLICY "permitir_leitura_imagens" ON storage.objects
    FOR SELECT USING (bucket_id = 'imagens');

CREATE POLICY "permitir_upload_imagens" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'imagens');

CREATE POLICY "permitir_atualizacao_imagens" ON storage.objects
    FOR UPDATE USING (bucket_id = 'imagens');

CREATE POLICY "permitir_exclusao_imagens" ON storage.objects
    FOR DELETE USING (bucket_id = 'imagens');

-- 10. INSERIR DADOS DE EXEMPLO (apenas se a tabela estiver vazia)
INSERT INTO roupas (nome, descricao, preco, categoria, tamanhos, ativo) 
SELECT 'Vestido Floral', 'Vestido elegante com estampa floral perfeito para o verão', 89.90, 'vestido', 'P,M,G', true
WHERE NOT EXISTS (SELECT 1 FROM roupas LIMIT 1);

-- 11. VERIFICAR CONFIGURAÇÃO FINAL
SELECT '✅ Configuração concluída!' as status;

SELECT 'Tabela roupas:' as item, COUNT(*) as total FROM roupas;

SELECT 'Bucket imagens:' as item, name as bucket_name, public as is_public 
FROM storage.buckets WHERE name = 'imagens';

SELECT 'Políticas da tabela roupas:' as item, COUNT(*) as total 
FROM pg_policies WHERE tablename = 'roupas';

SELECT 'Políticas do storage:' as item, COUNT(*) as total 
FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

SELECT 'RLS ativo:' as item, relrowsecurity as rls_ativo 
FROM pg_class WHERE relname = 'roupas';
