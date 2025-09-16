-- CRIAR POLÍTICAS SIMPLES - SUPABASE
-- Execute este script no SQL Editor do Supabase

-- 1. DESABILITAR RLS TEMPORARIAMENTE
ALTER TABLE roupas DISABLE ROW LEVEL SECURITY;

-- 2. REMOVER TODAS AS POLÍTICAS EXISTENTES
DROP POLICY IF EXISTS "read_all" ON roupas;
DROP POLICY IF EXISTS "insert_all" ON roupas;
DROP POLICY IF EXISTS "update_all" ON roupas;
DROP POLICY IF EXISTS "delete_all" ON roupas;
DROP POLICY IF EXISTS "storage_read" ON storage.objects;
DROP POLICY IF EXISTS "storage_insert" ON storage.objects;
DROP POLICY IF EXISTS "storage_update" ON storage.objects;
DROP POLICY IF EXISTS "storage_delete" ON storage.objects;

-- 3. REABILITAR RLS
ALTER TABLE roupas ENABLE ROW LEVEL SECURITY;

-- 4. CRIAR POLÍTICAS PARA ROUPAS
CREATE POLICY "read_all" ON roupas FOR SELECT USING (true);
CREATE POLICY "insert_all" ON roupas FOR INSERT WITH CHECK (true);
CREATE POLICY "update_all" ON roupas FOR UPDATE USING (true);
CREATE POLICY "delete_all" ON roupas FOR DELETE USING (true);

-- 5. CRIAR POLÍTICAS PARA STORAGE
CREATE POLICY "storage_read" ON storage.objects FOR SELECT USING (bucket_id = 'imagens');
CREATE POLICY "storage_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'imagens');
CREATE POLICY "storage_update" ON storage.objects FOR UPDATE USING (bucket_id = 'imagens');
CREATE POLICY "storage_delete" ON storage.objects FOR DELETE USING (bucket_id = 'imagens');

-- 6. VERIFICAR POLÍTICAS CRIADAS
SELECT 'Políticas da tabela roupas:' as tipo;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'roupas';

SELECT 'Políticas do storage:' as tipo;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- 7. TESTAR
SELECT 'Teste final:' as teste, COUNT(*) as total_roupas FROM roupas;
