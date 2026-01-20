-- =============================================
-- SMART VALUE TCO SYSTEM - Database Migration
-- ComparaTop: Total Cost of Ownership Infrastructure
-- =============================================

-- 1. Energy Rates Table
-- Stores energy rates per Brazilian state (UF)
CREATE TABLE IF NOT EXISTS energy_rates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    state_code VARCHAR(2) NOT NULL UNIQUE,
    state_name VARCHAR(50) NOT NULL,
    rate_kwh NUMERIC(5,4) NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Seed with initial data (ANEEL averages 2025)
INSERT INTO energy_rates (state_code, state_name, rate_kwh) VALUES
    ('AC', 'Acre', 0.82),
    ('AL', 'Alagoas', 0.88),
    ('AP', 'Amapá', 0.75),
    ('AM', 'Amazonas', 0.90),
    ('BA', 'Bahia', 0.86),
    ('CE', 'Ceará', 0.84),
    ('DF', 'Distrito Federal', 0.88),
    ('ES', 'Espírito Santo', 0.87),
    ('GO', 'Goiás', 0.83),
    ('MA', 'Maranhão', 0.85),
    ('MT', 'Mato Grosso', 0.86),
    ('MS', 'Mato Grosso do Sul', 0.84),
    ('MG', 'Minas Gerais', 0.89),
    ('PA', 'Pará', 0.88),
    ('PB', 'Paraíba', 0.87),
    ('PR', 'Paraná', 0.85),
    ('PE', 'Pernambuco', 0.86),
    ('PI', 'Piauí', 0.83),
    ('RJ', 'Rio de Janeiro', 1.05),
    ('RN', 'Rio Grande do Norte', 0.88),
    ('RS', 'Rio Grande do Sul', 0.87),
    ('RO', 'Rondônia', 0.81),
    ('RR', 'Roraima', 0.78),
    ('SC', 'Santa Catarina', 0.82),
    ('SP', 'São Paulo', 0.92),
    ('SE', 'Sergipe', 0.85),
    ('TO', 'Tocantins', 0.84)
ON CONFLICT (state_code) DO UPDATE SET 
    rate_kwh = EXCLUDED.rate_kwh,
    updated_at = NOW();

-- 2. Products Table Updates
-- Add TCO-related columns to products table
ALTER TABLE products 
    ADD COLUMN IF NOT EXISTS energy_kwh_month NUMERIC(8,2),
    ADD COLUMN IF NOT EXISTS lifespan_years INT DEFAULT 10,
    ADD COLUMN IF NOT EXISTS maintenance_rate NUMERIC(4,3) DEFAULT 0.02;

-- 3. Smart Alerts Table
-- For lead capture with Price and Smart Value alerts
CREATE TABLE IF NOT EXISTS smart_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100) NOT NULL,
    alert_type VARCHAR(20) NOT NULL CHECK (alert_type IN ('PRICE', 'SMART_VALUE')),
    target_price NUMERIC(12,2),
    target_tco NUMERIC(12,2),
    current_tco_at_signup NUMERIC(12,2),
    state_code VARCHAR(2) DEFAULT 'SP',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    triggered_at TIMESTAMP,
    triggered_price NUMERIC(12,2)
);

-- Index for querying active alerts by product
CREATE INDEX IF NOT EXISTS idx_smart_alerts_product_active 
    ON smart_alerts(product_sku, is_active);

-- Index for querying by email
CREATE INDEX IF NOT EXISTS idx_smart_alerts_email 
    ON smart_alerts(user_email);


-- 4. TCO Calculation Function (PL/pgSQL)
-- Calculates Total Cost of Ownership with inflation and discounting
CREATE OR REPLACE FUNCTION calculate_dynamic_tco(
    p_price NUMERIC, 
    p_energy_kwh_month NUMERIC, 
    p_energy_rate NUMERIC,
    p_lifespan_years INT DEFAULT 5,
    p_maintenance_rate NUMERIC DEFAULT 0.02
) RETURNS NUMERIC AS $$
DECLARE
    v_total_energy_cost NUMERIC := 0;
    v_maintenance_cost NUMERIC := 0;
    v_inflation_energy CONSTANT NUMERIC := 0.05; -- 5% annual energy inflation
    v_discount_rate CONSTANT NUMERIC := 0.02;    -- 2% annual discount rate (real SELIC)
    i INT;
    v_annual_energy_cost NUMERIC;
    v_present_value NUMERIC;
BEGIN
    -- Calculate NPV of energy costs over lifespan
    FOR i IN 1..p_lifespan_years LOOP
        -- Annual energy cost with inflation
        v_annual_energy_cost := p_energy_kwh_month * 12 * p_energy_rate 
            * POWER(1 + v_inflation_energy, i);
        
        -- Present Value (discounted)
        v_present_value := v_annual_energy_cost / POWER(1 + v_discount_rate, i);
        
        v_total_energy_cost := v_total_energy_cost + v_present_value;
    END LOOP;
    
    -- Maintenance cost (simple annual rate)
    v_maintenance_cost := p_price * p_maintenance_rate * p_lifespan_years;
    
    -- Return Total Cost of Ownership
    RETURN ROUND(p_price + v_total_energy_cost + v_maintenance_cost, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;


-- 5. Helper Function: Get TCO for a product
CREATE OR REPLACE FUNCTION get_product_tco(
    p_product_sku VARCHAR,
    p_state_code VARCHAR DEFAULT 'SP',
    p_years INT DEFAULT 5
) RETURNS TABLE (
    product_sku VARCHAR,
    acquisition_cost NUMERIC,
    energy_cost NUMERIC,
    maintenance_cost NUMERIC,
    total_tco NUMERIC,
    tco_per_year NUMERIC
) AS $$
DECLARE
    v_product RECORD;
    v_energy_rate NUMERIC;
    v_total_energy NUMERIC := 0;
    v_maintenance NUMERIC;
    v_tco NUMERIC;
    i INT;
BEGIN
    -- Get product data
    SELECT p.price, p.energy_kwh_month, p.maintenance_rate
    INTO v_product
    FROM products p
    WHERE p.sku = p_product_sku;
    
    -- Get energy rate for state
    SELECT er.rate_kwh INTO v_energy_rate
    FROM energy_rates er
    WHERE er.state_code = p_state_code;
    
    IF v_energy_rate IS NULL THEN
        v_energy_rate := 0.85; -- Default rate
    END IF;
    
    -- Calculate energy cost (NPV)
    FOR i IN 1..p_years LOOP
        v_total_energy := v_total_energy + 
            ((v_product.energy_kwh_month * 12 * v_energy_rate * POWER(1.05, i)) 
            / POWER(1.02, i));
    END LOOP;
    
    -- Calculate maintenance
    v_maintenance := v_product.price * COALESCE(v_product.maintenance_rate, 0.02) * p_years;
    
    -- Calculate total TCO
    v_tco := v_product.price + v_total_energy + v_maintenance;
    
    -- Return results
    RETURN QUERY SELECT 
        p_product_sku,
        v_product.price AS acquisition_cost,
        ROUND(v_total_energy, 2) AS energy_cost,
        ROUND(v_maintenance, 2) AS maintenance_cost,
        ROUND(v_tco, 2) AS total_tco,
        ROUND(v_tco / p_years, 2) AS tco_per_year;
END;
$$ LANGUAGE plpgsql;


-- 6. RLS Policies for smart_alerts
ALTER TABLE smart_alerts ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to create alerts
CREATE POLICY "Users can create own alerts" ON smart_alerts
    FOR INSERT
    WITH CHECK (true);

-- Allow users to view their own alerts
CREATE POLICY "Users can view own alerts" ON smart_alerts
    FOR SELECT
    USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');


-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE energy_rates IS 'Energy rates per Brazilian state for TCO calculations';
COMMENT ON TABLE smart_alerts IS 'User price and smart value alerts for lead capture';
COMMENT ON FUNCTION calculate_dynamic_tco IS 'Calculates Total Cost of Ownership with NPV discounting';
COMMENT ON FUNCTION get_product_tco IS 'Returns full TCO breakdown for a product and state';
