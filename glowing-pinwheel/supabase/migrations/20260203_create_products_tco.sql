-- ============================================================================
-- FIPE-Eletro: Tabela de TCO de Produtos
-- ============================================================================
-- Migração para Supabase
-- Criar em: SQL Editor > New Query > Run

-- Tabela principal
CREATE TABLE IF NOT EXISTS products_tco (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Identificadores de busca
    asin TEXT,                          -- Amazon Standard Identification Number
    ean TEXT,                           -- European Article Number (código de barras)
    product_name TEXT NOT NULL,         -- Nome do produto (busca fuzzy)
    product_name_normalized TEXT,       -- Nome normalizado para busca (sem acentos, lowercase)
    
    -- Classificação
    category TEXT NOT NULL,             -- Ex: 'robo-aspirador', 'smartphone', 'pneu'
    brand TEXT,                         -- Marca do produto
    model TEXT,                         -- Modelo específico
    
    -- Monetização
    amazon_url TEXT,                    -- URL Amazon com tag de afiliado
    amazon_affiliate_tag TEXT DEFAULT 'comparatop-20',
    
    -- Dados do TCO (JSON estruturado)
    tco_data JSONB NOT NULL,
    
    -- Metadados
    image_url TEXT,
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '90 days'),
    last_verified TIMESTAMPTZ,
    
    -- Controle
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para busca rápida
CREATE INDEX IF NOT EXISTS idx_products_tco_asin ON products_tco(asin);
CREATE INDEX IF NOT EXISTS idx_products_tco_ean ON products_tco(ean);
CREATE INDEX IF NOT EXISTS idx_products_tco_category ON products_tco(category);
CREATE INDEX IF NOT EXISTS idx_products_tco_name_normalized ON products_tco(product_name_normalized);
CREATE INDEX IF NOT EXISTS idx_products_tco_active ON products_tco(is_active) WHERE is_active = TRUE;

-- Full-text search para nome do produto
CREATE INDEX IF NOT EXISTS idx_products_tco_name_fts 
ON products_tco USING GIN (to_tsvector('portuguese', product_name));

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_products_tco_updated_at ON products_tco;
CREATE TRIGGER trigger_products_tco_updated_at
    BEFORE UPDATE ON products_tco
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para normalizar nome do produto
CREATE OR REPLACE FUNCTION normalize_product_name()
RETURNS TRIGGER AS $$
BEGIN
    NEW.product_name_normalized = lower(
        translate(
            NEW.product_name,
            'áàãâéèêíìîóòõôúùûçÁÀÃÂÉÈÊÍÌÎÓÒÕÔÚÙÛÇ',
            'aaaaeeeiiioooouuucAAAAEEEIIIOOOOUUUC'
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_normalize_product_name ON products_tco;
CREATE TRIGGER trigger_normalize_product_name
    BEFORE INSERT OR UPDATE ON products_tco
    FOR EACH ROW
    EXECUTE FUNCTION normalize_product_name();

-- RLS (Row Level Security) - Leitura pública, escrita autenticada
ALTER TABLE products_tco ENABLE ROW LEVEL SECURITY;

-- Política: Qualquer um pode ler produtos ativos
CREATE POLICY "Public can read active products" ON products_tco
    FOR SELECT USING (is_active = TRUE);

-- Política: Apenas authenticated pode inserir/atualizar
CREATE POLICY "Authenticated can manage products" ON products_tco
    FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- Exemplo de inserção
-- ============================================================================
/* Example removed to prevent B0XXXXXXXX placeholder confusion */
