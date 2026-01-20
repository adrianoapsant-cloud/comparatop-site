/**
 * Supabase Server Client
 * 
 * Uses SERVICE_ROLE key for server-side operations.
 * Falls back gracefully if Supabase is not configured.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Singleton client
let supabaseAdmin: SupabaseClient | null = null;

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
    return !!(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Get Supabase admin client (server-side only)
 * 
 * @throws Error if Supabase is not configured
 */
export function getSupabaseAdmin(): SupabaseClient {
    if (!isSupabaseConfigured()) {
        throw new Error(
            'Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local'
        );
    }

    if (!supabaseAdmin) {
        supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });
    }

    return supabaseAdmin;
}

/**
 * Safely get Supabase admin client
 * Returns null if not configured (for fallback scenarios)
 */
export function getSupabaseAdminSafe(): SupabaseClient | null {
    if (!isSupabaseConfigured()) {
        return null;
    }

    try {
        return getSupabaseAdmin();
    } catch {
        return null;
    }
}

// Database types (matching migration schema)
export interface EnergyRateRow {
    id: string;
    state_code: string;
    state_name: string;
    rate_kwh: number;
    updated_at: string;
    created_at: string;
}

export interface SmartAlertRow {
    id: string;
    user_email: string;
    product_sku: string;
    alert_type: 'PRICE' | 'SMART_VALUE';
    target_price: number | null;
    target_tco: number | null;
    current_tco_at_signup: number | null;
    state_code: string;
    is_active: boolean;
    created_at: string;
    triggered_at: string | null;
    triggered_price: number | null;
}
