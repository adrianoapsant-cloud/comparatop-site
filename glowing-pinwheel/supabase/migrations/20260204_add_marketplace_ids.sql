-- ============================================================================
-- Add Marketplace IDs to products_tco
-- ============================================================================
-- Enables exact matching for Browser Extension strategy across multiple retailers.

-- 1. Add specific ID columns
ALTER TABLE products_tco
ADD COLUMN IF NOT EXISTS mlb_id TEXT,      -- Mercado Livre ID (ex: MLB-12345678)
ADD COLUMN IF NOT EXISTS magalu_id TEXT,   -- Magalu SKU (ex: 235235200)
ADD COLUMN IF NOT EXISTS shopee_id TEXT;   -- Shopee Item ID (ex: 123456789)

-- 2. Create indexes for "Sniper" lookups (O(1) access)
CREATE INDEX IF NOT EXISTS idx_products_tco_mlb ON products_tco(mlb_id);
CREATE INDEX IF NOT EXISTS idx_products_tco_magalu ON products_tco(magalu_id);
CREATE INDEX IF NOT EXISTS idx_products_tco_shopee ON products_tco(shopee_id);

-- 3. Comment explaining usage
COMMENT ON COLUMN products_tco.mlb_id IS 'Mercado Livre Item ID (e.g., MLB-12345678)';
COMMENT ON COLUMN products_tco.magalu_id IS 'Magazine Luiza SKU ID';
COMMENT ON COLUMN products_tco.shopee_id IS 'Shopee unique item identifier';
