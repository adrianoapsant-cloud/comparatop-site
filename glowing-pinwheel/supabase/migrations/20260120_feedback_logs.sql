-- ============================================================
-- FEEDBACK LOGS - Crowdsourced Data Quality Auditing
-- ============================================================
-- Enables community-powered data validation for TCO calculations.
-- Users can quickly flag issues with price, consumption, or missing products.
-- ============================================================

-- Create enum for feedback reasons
DO $$ BEGIN
    CREATE TYPE feedback_reason AS ENUM (
        'price_wrong',
        'consumption_unrealistic',
        'missing_product',
        'calculation_error',
        'other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Feedback logs table
CREATE TABLE IF NOT EXISTS feedback_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Context (all optional, collected when available)
    product_sku TEXT,
    category_slug TEXT,
    page_url TEXT,
    
    -- The feedback itself
    rating BOOLEAN NOT NULL,  -- true = positive (👍), false = negative (👎)
    reason feedback_reason,   -- Only for negative ratings
    reason_text TEXT,         -- Free-form for "other" reason
    
    -- Metadata
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for analytics
CREATE INDEX IF NOT EXISTS idx_feedback_logs_category 
    ON feedback_logs(category_slug);

CREATE INDEX IF NOT EXISTS idx_feedback_logs_product 
    ON feedback_logs(product_sku);

CREATE INDEX IF NOT EXISTS idx_feedback_logs_rating 
    ON feedback_logs(rating);

CREATE INDEX IF NOT EXISTS idx_feedback_logs_created 
    ON feedback_logs(created_at DESC);

-- ============================================================
-- ANALYTICS HELPER FUNCTION
-- ============================================================

-- Get feedback summary for a category
CREATE OR REPLACE FUNCTION get_feedback_summary(
    p_category_slug TEXT DEFAULT NULL,
    p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
    total_feedback BIGINT,
    positive_count BIGINT,
    negative_count BIGINT,
    positive_rate NUMERIC,
    top_issues JSONB
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH feedback_data AS (
        SELECT 
            rating,
            reason
        FROM feedback_logs
        WHERE 
            created_at > NOW() - (p_days || ' days')::INTERVAL
            AND (p_category_slug IS NULL OR category_slug = p_category_slug)
    ),
    counts AS (
        SELECT
            COUNT(*) AS total_feedback,
            COUNT(*) FILTER (WHERE rating = true) AS positive_count,
            COUNT(*) FILTER (WHERE rating = false) AS negative_count
        FROM feedback_data
    ),
    issues AS (
        SELECT 
            reason,
            COUNT(*) AS issue_count
        FROM feedback_data
        WHERE rating = false AND reason IS NOT NULL
        GROUP BY reason
        ORDER BY issue_count DESC
        LIMIT 5
    )
    SELECT 
        c.total_feedback,
        c.positive_count,
        c.negative_count,
        CASE 
            WHEN c.total_feedback > 0 
            THEN ROUND((c.positive_count::NUMERIC / c.total_feedback) * 100, 1)
            ELSE 0 
        END AS positive_rate,
        COALESCE(
            (SELECT jsonb_agg(jsonb_build_object('reason', i.reason, 'count', i.issue_count)) FROM issues i),
            '[]'::jsonb
        ) AS top_issues
    FROM counts c;
END;
$$;

-- Comment for documentation
COMMENT ON TABLE feedback_logs IS 'Stores user feedback for TCO analysis quality auditing. Enables crowdsourced data validation.';
COMMENT ON COLUMN feedback_logs.rating IS 'true = positive (helpful), false = negative (needs improvement)';
COMMENT ON COLUMN feedback_logs.reason IS 'Reason for negative feedback, from predefined list';
