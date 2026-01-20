-- ============================================================================
-- PRODUCTS SCHEMA - ComparaTop Database
-- ============================================================================
-- Migration: 20260120_products_schema.sql
-- Purpose: Store products with flexible JSONB for TCO calculations and alerts
-- ============================================================================

-- ============================================
-- MAIN PRODUCTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS products (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Core identification
    slug TEXT UNIQUE NOT NULL,          -- URL-friendly ID (e.g., 'roborock-q7-l5')
    name TEXT NOT NULL,                 -- Full product name
    brand TEXT NOT NULL,                -- Brand name
    category_slug TEXT NOT NULL,        -- Category (e.g., 'robo-aspiradores')
    
    -- Pricing (in centavos for precision, no floating point errors)
    price_cents INTEGER NOT NULL,
    
    -- Media
    image_url TEXT,
    
    -- Community Ratings (from Amazon/ML reviews via Gemini)
    rating_community NUMERIC(2,1),      -- 1.0-5.0 star rating
    community_reviews INTEGER,          -- Total review count
    
    -- Technical Rating (ComparaTop editorial score)
    rating_technical NUMERIC(3,1),      -- 0.0-10.0 scale
    
    -- ============================================
    -- JSONB FIELDS FOR FLEXIBILITY
    -- ============================================
    
    -- Technical specs (varies by category)
    -- Example: { "suction": "8000Pa", "navigation": "LiDAR", "runtime": "150min" }
    specs JSONB DEFAULT '{}' NOT NULL,
    
    -- TCO calculation parameters
    -- Example: {
    --   "energy_kwh": { "eco": 0.4, "family": 0.6, "gamer": 0.8 },
    --   "energy_cost": { "eco": 0.34, "family": 0.51, "gamer": 0.68 },
    --   "maintenance_cost": 150,
    --   "resale_percentage": 35,
    --   "lifespan_years": 5
    -- }
    tco_data JSONB DEFAULT '{}' NOT NULL,
    
    -- Feature flags
    -- Example: { "gaming": true, "smart": true, "premium_brand": true }
    features JSONB DEFAULT '{}' NOT NULL,
    
    -- SCRS (Supply Chain Risk Score) breakdown
    -- Example: {
    --   "score": 7.5,
    --   "parts_availability": 6.5,
    --   "service_network": 7.0,
    --   "repairability": 8.5,
    --   "brand_reliability": 7.5
    -- }
    scrs_data JSONB DEFAULT '{}' NOT NULL,
    
    -- ============================================
    -- TIMESTAMPS
    -- ============================================
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- INDEXES FOR FAST QUERIES
-- ============================================

-- Fast lookup by slug (primary access pattern)
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- Category listing pages
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_slug);

-- Brand filtering
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);

-- Price range queries
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price_cents);

-- Combined category + price for filtered listings
CREATE INDEX IF NOT EXISTS idx_products_category_price ON products(category_slug, price_cents);

-- ============================================
-- AUTO-UPDATE TIMESTAMP TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_products_updated_at ON products;
CREATE TRIGGER trigger_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_products_updated_at();

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Get products by category with TCO data
CREATE OR REPLACE FUNCTION get_products_by_category(p_category_slug TEXT)
RETURNS SETOF products AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM products
    WHERE category_slug = p_category_slug
    ORDER BY rating_technical DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql;

-- Get product with full data by slug
CREATE OR REPLACE FUNCTION get_product_by_slug(p_slug TEXT)
RETURNS products AS $$
DECLARE
    product_row products;
BEGIN
    SELECT * INTO product_row
    FROM products
    WHERE slug = p_slug
    LIMIT 1;
    
    RETURN product_row;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- RLS POLICIES (if needed for multi-tenant)
-- ============================================
-- Currently products are public read, admin write
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Products are viewable by everyone" ON products
--     FOR SELECT USING (true);

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE products IS 'Core product catalog with TCO data for ComparaTop';
COMMENT ON COLUMN products.slug IS 'URL-friendly unique identifier';
COMMENT ON COLUMN products.price_cents IS 'Price in centavos (R$ * 100) for precision';
COMMENT ON COLUMN products.rating_community IS 'Community rating 1-5 stars from Amazon/ML';
COMMENT ON COLUMN products.rating_technical IS 'ComparaTop editorial score 0-10';
COMMENT ON COLUMN products.specs IS 'Category-specific technical specifications as JSONB';
COMMENT ON COLUMN products.tco_data IS 'TCO calculation parameters (energy, maintenance, lifespan)';
COMMENT ON COLUMN products.scrs_data IS 'Supply Chain Risk Score breakdown';
