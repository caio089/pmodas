-- ================================================
-- SCRIPT SQL PARA SUPABASE - PAIXÃO MODAS
-- ================================================
-- Execute este script no SQL Editor do Supabase
-- para criar a estrutura completa do banco de dados

-- 1. CRIAR TABELA DE ROUPAS
-- ================================================
CREATE TABLE IF NOT EXISTS roupas (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL CHECK (preco > 0),
    categoria VARCHAR(20) NOT NULL CHECK (categoria IN ('vestido', 'blusa', 'calca', 'saia', 'conjunto', 'acessorios')),
    tamanhos VARCHAR(20) NOT NULL DEFAULT 'P,M,G' CHECK (tamanhos IN ('P', 'M', 'G', 'GG', 'P,M', 'M,G', 'G,GG', 'P,M,G', 'M,G,GG', 'P,M,G,GG')),
    imagem_principal TEXT,
    imagem_2 TEXT,
    imagem_3 TEXT,
    ativo BOOLEAN NOT NULL DEFAULT true,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CRIAR ÍNDICES PARA PERFORMANCE
-- ================================================
CREATE INDEX IF NOT EXISTS idx_roupas_ativo ON roupas(ativo);
CREATE INDEX IF NOT EXISTS idx_roupas_categoria ON roupas(categoria);
CREATE INDEX IF NOT EXISTS idx_roupas_data_criacao ON roupas(data_criacao);
CREATE INDEX IF NOT EXISTS idx_roupas_preco ON roupas(preco);
CREATE INDEX IF NOT EXISTS idx_roupas_nome ON roupas(nome);

-- 3. HABILITAR ROW LEVEL SECURITY (RLS)
-- ================================================
ALTER TABLE roupas ENABLE ROW LEVEL SECURITY;

-- 4. CRIAR POLÍTICAS DE SEGURANÇA
-- ================================================

-- Política para permitir leitura pública de roupas ativas
CREATE POLICY "Permitir leitura de roupas ativas" ON roupas
    FOR SELECT USING (ativo = true);

-- Política para permitir todas as operações para usuários autenticados
CREATE POLICY "Permitir todas as operações para usuários autenticados" ON roupas
    FOR ALL USING (auth.role() = 'authenticated');

-- Política para permitir inserção de novas roupas (para o sistema)
CREATE POLICY "Permitir inserção de roupas" ON roupas
    FOR INSERT WITH CHECK (true);

-- Política para permitir atualização de roupas (para o sistema)
CREATE POLICY "Permitir atualização de roupas" ON roupas
    FOR UPDATE USING (true);

-- Política para permitir exclusão de roupas (para o sistema)
CREATE POLICY "Permitir exclusão de roupas" ON roupas
    FOR DELETE USING (true);

-- 5. CRIAR FUNÇÃO PARA ATUALIZAR DATA_ATUALIZACAO
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. CRIAR TRIGGER PARA ATUALIZAR DATA_ATUALIZACAO
-- ================================================
CREATE TRIGGER update_roupas_updated_at 
    BEFORE UPDATE ON roupas 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 7. CRIAR BUCKET DE STORAGE PARA IMAGENS
-- ================================================
-- Execute no painel do Supabase: Storage > Create bucket
-- Nome: imagens
-- Público: SIM

-- 8. CONFIGURAR POLÍTICAS DO STORAGE
-- ================================================
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

-- 9. INSERIR DADOS DE EXEMPLO (OPCIONAL)
-- ================================================
INSERT INTO roupas (nome, descricao, preco, categoria, tamanhos, ativo) VALUES
('Vestido Floral Elegante', 'Vestido de verão com estampa floral delicada, perfeito para ocasiões especiais.', 89.90, 'vestido', 'P,M,G', true),
('Blusa Básica Branca', 'Blusa básica em algodão, ideal para combinar com qualquer look.', 45.50, 'blusa', 'P,M,G,GG', true),
('Calça Jeans Skinny', 'Calça jeans skinny com elastano, confortável e moderna.', 120.00, 'calca', 'P,M,G', true),
('Saia Midi Plissada', 'Saia midi plissada em tecido fluido, elegante e versátil.', 75.00, 'saia', 'P,M,G', true),
('Conjunto Casual', 'Conjunto composto por blusa e calça, perfeito para o dia a dia.', 150.00, 'conjunto', 'P,M,G,GG', true),
('Bolsa de Couro', 'Bolsa de couro legítimo, espaçosa e durável.', 200.00, 'acessorios', 'P,M,G', true);

-- 10. VERIFICAR ESTRUTURA CRIADA
-- ================================================
-- Execute esta query para verificar se tudo foi criado corretamente
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'roupas' 
ORDER BY ordinal_position;

-- 11. VERIFICAR POLÍTICAS CRIADAS
-- ================================================
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'roupas';

-- 12. VERIFICAR ÍNDICES CRIADOS
-- ================================================
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'roupas';

-- ================================================
-- SCRIPT CONCLUÍDO!
-- ================================================
-- 
-- PRÓXIMOS PASSOS:
-- 1. Execute este script no SQL Editor do Supabase
-- 2. Crie o bucket 'imagens' no Storage (público)
-- 3. Configure as variáveis de ambiente no seu projeto
-- 4. Teste a conexão com o Supabase
-- 
-- ESTRUTURA FINAL:
-- ✅ Tabela 'roupas' com todos os campos necessários
-- ✅ Índices para performance otimizada
-- ✅ Políticas de segurança (RLS) configuradas
-- ✅ Trigger para atualização automática de timestamps
-- ✅ Políticas do Storage para imagens
-- ✅ Dados de exemplo para teste
-- ================================================
