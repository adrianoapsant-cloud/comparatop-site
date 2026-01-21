-- ============================================================
-- FEEDBACK LOGS - Data Correction Extension
-- ============================================================
-- Extends feedback_logs to support contextual data corrections
-- from PDP pages. Backwards compatible with existing records.
-- ============================================================

-- Add new columns for data correction support
ALTER TABLE feedback_logs 
    ADD COLUMN IF NOT EXISTS element_id TEXT,
    ADD COLUMN IF NOT EXISTS feedback_type TEXT DEFAULT 'rating',
    ADD COLUMN IF NOT EXISTS suggested_fix TEXT,
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';

-- Add comment column if not exists (may already exist as reason_text)
-- We'll use reason_text for backwards compatibility

-- Indexes for the new workflow
CREATE INDEX IF NOT EXISTS idx_feedback_logs_element_id 
    ON feedback_logs(element_id) WHERE element_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_feedback_logs_status 
    ON feedback_logs(status);

CREATE INDEX IF NOT EXISTS idx_feedback_logs_feedback_type 
    ON feedback_logs(feedback_type);

CREATE INDEX IF NOT EXISTS idx_feedback_logs_product_sku 
    ON feedback_logs(product_sku) WHERE product_sku IS NOT NULL;

-- ============================================================
-- RATE LIMITS TABLE (if not exists)
-- ============================================================
-- Reused by /api/alerts/subscribe, now also by /api/feedback

CREATE TABLE IF NOT EXISTS api_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    request_count INTEGER DEFAULT 1,
    window_start TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup 
    ON api_rate_limits(identifier, endpoint, window_start);

-- ============================================================
-- DOCUMENTATION
-- ============================================================

COMMENT ON COLUMN feedback_logs.element_id IS 'Section identifier: pdp_specs, pdp_tco, spec_battery, etc.';
COMMENT ON COLUMN feedback_logs.feedback_type IS 'Type: rating (legacy thumbs up/down) or content_error (data correction)';
COMMENT ON COLUMN feedback_logs.suggested_fix IS 'User-provided suggested correction text';
COMMENT ON COLUMN feedback_logs.status IS 'Workflow status: new, reviewed, fixed, rejected';
