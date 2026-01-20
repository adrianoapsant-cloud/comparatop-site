-- =============================================
-- PRICE HISTORY & MARKET EVENTS - Database Migration
-- ComparaTop: Price Tracking Infrastructure
-- Date: 2026-01-20
-- =============================================

-- 1. Price History Table
-- Tracks price changes over time for trend analysis
CREATE TABLE IF NOT EXISTS price_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_sku VARCHAR(100) NOT NULL,
    price NUMERIC(12,2) NOT NULL,
    recorded_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast queries by product and date
CREATE INDEX IF NOT EXISTS idx_price_history_sku_date 
    ON price_history(product_sku, recorded_at DESC);

-- Index for recent prices (last 30 days queries)
CREATE INDEX IF NOT EXISTS idx_price_history_recent 
    ON price_history(recorded_at DESC);


-- 2. Market Events Table
-- Stores global market events that affect TCO calculations
CREATE TABLE IF NOT EXISTS market_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    description TEXT,
    impact_percent NUMERIC(5,2), -- Optional: % impact on prices/energy
    occurred_at TIMESTAMP DEFAULT NOW()
);

-- Index for querying recent events
CREATE INDEX IF NOT EXISTS idx_market_events_date 
    ON market_events(occurred_at DESC);

-- Common event types:
-- 'ENERGY_RATE_HIKE' - Energy tariff increase
-- 'ENERGY_RATE_DROP' - Energy tariff decrease  
-- 'SEASONAL_SALE' - Black Friday, Prime Day, etc.
-- 'NEW_MODEL_RELEASE' - When new models drop prices of older ones
-- 'SUPPLY_SHORTAGE' - Chip shortage, logistics issues


-- 3. Helper Functions

-- Get price trend for a product (last N days)
CREATE OR REPLACE FUNCTION get_price_trend(
    p_product_sku VARCHAR,
    p_days INT DEFAULT 30
) RETURNS TABLE (
    min_price NUMERIC,
    max_price NUMERIC,
    avg_price NUMERIC,
    current_price NUMERIC,
    price_change_percent NUMERIC,
    trend VARCHAR
) AS $$
DECLARE
    v_first_price NUMERIC;
    v_last_price NUMERIC;
BEGIN
    -- Get first recorded price in period
    SELECT price INTO v_first_price
    FROM price_history
    WHERE product_sku = p_product_sku
      AND recorded_at >= NOW() - (p_days || ' days')::INTERVAL
    ORDER BY recorded_at ASC
    LIMIT 1;
    
    -- Get most recent price
    SELECT price INTO v_last_price
    FROM price_history
    WHERE product_sku = p_product_sku
    ORDER BY recorded_at DESC
    LIMIT 1;
    
    RETURN QUERY
    SELECT 
        MIN(ph.price) AS min_price,
        MAX(ph.price) AS max_price,
        ROUND(AVG(ph.price), 2) AS avg_price,
        v_last_price AS current_price,
        CASE 
            WHEN v_first_price > 0 THEN 
                ROUND(((v_last_price - v_first_price) / v_first_price) * 100, 2)
            ELSE 0
        END AS price_change_percent,
        CASE 
            WHEN v_last_price < v_first_price THEN 'FALLING'
            WHEN v_last_price > v_first_price THEN 'RISING'
            ELSE 'STABLE'
        END AS trend
    FROM price_history ph
    WHERE ph.product_sku = p_product_sku
      AND ph.recorded_at >= NOW() - (p_days || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql;


-- 4. Rate Limiting Table (for API security)
CREATE TABLE IF NOT EXISTS api_rate_limits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    identifier VARCHAR(255) NOT NULL, -- email or IP
    endpoint VARCHAR(100) NOT NULL,
    request_count INT DEFAULT 1,
    window_start TIMESTAMP DEFAULT NOW()
);

-- Index for rate limit lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup 
    ON api_rate_limits(identifier, endpoint, window_start);

-- Cleanup old rate limit records (run periodically)
-- DELETE FROM api_rate_limits WHERE window_start < NOW() - INTERVAL '1 hour';


-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE price_history IS 'Historical price records for trend analysis and alert triggering';
COMMENT ON TABLE market_events IS 'Global market events that affect product pricing and TCO';
COMMENT ON TABLE api_rate_limits IS 'Rate limiting tracking for API endpoints';
COMMENT ON FUNCTION get_price_trend IS 'Returns price statistics and trend direction for a product over N days';
