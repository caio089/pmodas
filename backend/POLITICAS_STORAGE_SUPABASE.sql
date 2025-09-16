-- POLÍTICAS DO STORAGE PARA FUNCIONAMENTO COMPLETO DO PAINEL
-- Execute este script no SQL Editor do Supabase

-- 1. VERIFICAR SE O BUCKET EXISTE
SELECT 'Verificando bucket imagens:' as status;
SELECT * FROM storage.buckets WHERE name = 'imagens';

-- 2. CRIAR BUCKET SE NÃO EXISTIR
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'imagens',
    'imagens', 
    true,
    52428800, -- 50MB
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg']
) ON CONFLICT (id) DO NOTHING;

-- 3. REMOVER POLÍTICAS EXISTENTES DO STORAGE
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'objects' AND schemaname = 'storage'
    ) LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON storage.objects';
    END LOOP;
END $$;

-- 4. CRIAR POLÍTICAS PARA O STORAGE (BUCKET imagens)

-- Política de leitura pública (qualquer um pode ver as imagens)
CREATE POLICY "storage_public_read" ON storage.objects
    FOR SELECT USING (bucket_id = 'imagens');

-- Política de upload (qualquer um pode fazer upload)
CREATE POLICY "storage_public_insert" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'imagens');

-- Política de atualização (qualquer um pode atualizar)
CREATE POLICY "storage_public_update" ON storage.objects
    FOR UPDATE USING (bucket_id = 'imagens');

-- Política de exclusão (qualquer um pode excluir)
CREATE POLICY "storage_public_delete" ON storage.objects
    FOR DELETE USING (bucket_id = 'imagens');

-- 5. VERIFICAR POLÍTICAS CRIADAS
SELECT 'Políticas do Storage criadas:' as status;
SELECT policyname, cmd, qual FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage' 
ORDER BY policyname;

-- 6. TESTAR FUNCIONAMENTO
SELECT 'Bucket configurado:' as teste, name as bucket_name, public as is_public 
FROM storage.buckets WHERE name = 'imagens';

-- 7. VERIFICAR SE AS POLÍTICAS ESTÃO FUNCIONANDO
SELECT 'Teste de políticas:' as teste, 
       CASE 
           WHEN COUNT(*) > 0 THEN 'Políticas ativas'
           ELSE 'Nenhuma política encontrada'
       END as status
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';
