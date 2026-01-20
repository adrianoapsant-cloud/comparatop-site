/**
 * Database Types
 * 
 * TypeScript interfaces for Supabase tables.
 * Keep in sync with migrations in /supabase/migrations/
 */

// Re-export existing types from supabase server
export { type EnergyRateRow, type SmartAlertRow } from '@/lib/supabase/server';

/**
 * Price History - tracks price changes over time
 * Table: price_history
 */
export interface PriceHistoryRow {
    id: string;
    product_sku: string;
    price: number;
    recorded_at: string;
}

/**
 * Market Events - global events affecting prices/TCO
 * Table: market_events
 */
export interface MarketEventRow {
    id: string;
    event_type: MarketEventType;
    description: string | null;
    impact_percent: number | null;
    occurred_at: string;
}

export type MarketEventType =
    | 'ENERGY_RATE_HIKE'     // Energy tariff increase
    | 'ENERGY_RATE_DROP'     // Energy tariff decrease
    | 'SEASONAL_SALE'        // Black Friday, Prime Day, etc.
    | 'NEW_MODEL_RELEASE'    // New models dropping older prices
    | 'SUPPLY_SHORTAGE';     // Chip shortage, logistics issues

/**
 * API Rate Limits - tracking for security
 * Table: api_rate_limits
 */
export interface ApiRateLimitRow {
    id: string;
    identifier: string;
    endpoint: string;
    request_count: number;
    window_start: string;
}

/**
 * Price Trend - result from get_price_trend() function
 */
export interface PriceTrend {
    min_price: number;
    max_price: number;
    avg_price: number;
    current_price: number;
    price_change_percent: number;
    trend: 'FALLING' | 'RISING' | 'STABLE';
}

/**
 * Alert subscription request
 */
export interface AlertSubscribeRequest {
    email: string;
    productSku: string;
    alertType: 'PRICE' | 'SMART_VALUE';
    targetPrice?: number;
    targetTco?: number;
    currentTcoAtSignup?: number;
    stateCode?: string;
}

/**
 * Alert subscription response
 */
export interface AlertSubscribeResponse {
    ok: boolean;
    alertId?: string;
    message: string;
    error?: string;
}

// ============================================
// PRODUCTS TABLE TYPES
// ============================================

/**
 * TCO Data stored in JSONB
 */
export interface TcoDataJson {
    energy_kwh: { eco: number; family: number; gamer: number };
    energy_cost: { eco: number; family: number; gamer: number };
    maintenance_cost: number;
    resale_value: number;
    resale_percentage: number;
    lifespan_years: number;
}

/**
 * SCRS (Supply Chain Risk Score) stored in JSONB
 */
export interface ScrsDataJson {
    score: number;
    parts_availability: number;
    service_network: number;
    repairability: number;
    brand_reliability: number;
}

/**
 * Product row from Supabase products table
 * Table: products
 */
export interface ProductDB {
    id: string;
    slug: string;
    name: string;
    brand: string;
    category_slug: string;
    price_cents: number;
    image_url: string | null;
    rating_community: number | null;
    community_reviews: number | null;
    rating_technical: number | null;
    specs: Record<string, unknown>;
    tco_data: TcoDataJson;
    features: Record<string, boolean>;
    scrs_data: ScrsDataJson;
    created_at: string;
    updated_at: string;
}

/**
 * Insert type for products (without auto-generated fields)
 */
export interface ProductDBInsert {
    slug: string;
    name: string;
    brand: string;
    category_slug: string;
    price_cents: number;
    image_url?: string | null;
    rating_community?: number | null;
    community_reviews?: number | null;
    rating_technical?: number | null;
    specs?: Record<string, unknown>;
    tco_data?: Partial<TcoDataJson>;
    features?: Record<string, boolean>;
    scrs_data?: Partial<ScrsDataJson>;
}

/**
 * Update type for products (all fields optional)
 */
export type ProductDBUpdate = Partial<ProductDBInsert>;
