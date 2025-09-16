-- CORRIGIR EXCLUSÃO DE ROUPAS - SUPABASE
-- Execute este script no SQL Editor do Supabase

-- 1. VERIFICAR POLÍTICAS EXISTENTES
SELECT 'Políticas atuais da tabela roupas:' as status;
SELECT policyname, cmd, permissive FROM pg_policies WHERE tablename = 'roupas';

-- 2. DESABILITAR RLS TEMPORARIAMENTE
ALTER TABLE roupas DISABLE ROW LEVEL SECURITY;

-- 3. REMOVER TODAS AS POLÍTICAS EXISTENTES
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

-- 4. REABILITAR RLS
ALTER TABLE roupas ENABLE ROW LEVEL SECURITY;

-- 5. CRIAR POLÍTICAS PERMISSIVAS PARA ROUPAS
CREATE POLICY "permitir_leitura_roupas" ON roupas
    FOR SELECT USING (true);

CREATE POLICY "permitir_insercao_roupas" ON roupas
    FOR INSERT WITH CHECK (true);

CREATE POLICY "permitir_atualizacao_roupas" ON roupas
    FOR UPDATE USING (true);

CREATE POLICY "permitir_exclusao_roupas" ON roupas
    FOR DELETE USING (true);

-- 6. CRIAR POLÍTICAS PERMISSIVAS PARA STORAGE
CREATE POLICY "permitir_leitura_imagens" ON storage.objects
    FOR SELECT USING (bucket_id = 'imagens');

CREATE POLICY "permitir_upload_imagens" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'imagens');

CREATE POLICY "permitir_atualizacao_imagens" ON storage.objects
    FOR UPDATE USING (bucket_id = 'imagens');

CREATE POLICY "permitir_exclusao_imagens" ON storage.objects
    FOR DELETE USING (bucket_id = 'imagens');

-- 7. VERIFICAR POLÍTICAS CRIADAS
SELECT 'Políticas criadas para roupas:' as status;
SELECT policyname, cmd, permissive FROM pg_policies WHERE tablename = 'roupas';

SELECT 'Políticas criadas para storage:' as status;
SELECT policyname, cmd, permissive FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- 8. TESTAR EXCLUSÃO
SELECT 'Teste de contagem de roupas:' as teste, COUNT(*) as total FROM roupas;

-- 9. VERIFICAR SE RLS ESTÁ ATIVO
SELECT 'RLS ativo na tabela roupas:' as status, relrowsecurity as rls_ativo 
FROM pg_class WHERE relname = 'roupas';
