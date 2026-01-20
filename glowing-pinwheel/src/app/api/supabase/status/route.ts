/**
 * Supabase Status/Health Check API
 * 
 * GET /api/supabase/status
 * 
 * Returns connection status and table availability.
 * DEV-only or protected by SUPABASE_SETUP_KEY
 */

import { NextResponse } from 'next/server';
import { getSupabaseAdminSafe, isSupabaseConfigured } from '@/lib/supabase/server';

export const runtime = 'nodejs';

interface StatusResponse {
    configured: boolean;
    canConnect: boolean;
    tables: {
        energy_rates: boolean;
        smart_alerts: boolean;
        energy_profiles: boolean;
    };
    functions: {
        calculate_dynamic_tco: boolean;
    };
    lastError?: string;
}

export async function GET(request: Request) {
    // Security check: DEV-only or require setup key
    const isDev = process.env.NODE_ENV !== 'production';
    const setupKey = process.env.SUPABASE_SETUP_KEY;
    const providedKey = request.headers.get('x-setup-key');

    if (!isDev && setupKey && providedKey !== setupKey) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    const status: StatusResponse = {
        configured: isSupabaseConfigured(),
        canConnect: false,
        tables: {
            energy_rates: false,
            smart_alerts: false,
            energy_profiles: false
        },
        functions: {
            calculate_dynamic_tco: false
        }
    };

    // If not configured, return early
    if (!status.configured) {
        status.lastError = 'Environment variables not set (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)';
        return NextResponse.json(status);
    }

    const supabase = getSupabaseAdminSafe();
    if (!supabase) {
        status.lastError = 'Failed to create Supabase client';
        return NextResponse.json(status);
    }

    try {
        // Test connection with simple query
        const { error: connError } = await supabase.rpc('now');

        if (connError) {
            // Fallback: try a simpler query
            const { error: selectError } = await supabase
                .from('energy_rates')
                .select('state_code')
                .limit(1);

            if (selectError && selectError.code !== 'PGRST116') {
                // PGRST116 = table not found (expected if not migrated)
                status.lastError = `Connection test failed: ${selectError.message}`;
            } else {
                status.canConnect = true;
            }
        } else {
            status.canConnect = true;
        }

        // Check tables exist via information_schema
        if (status.canConnect) {
            // Check energy_rates
            const { data: energyTable } = await supabase
                .from('energy_rates')
                .select('state_code')
                .limit(1);
            status.tables.energy_rates = energyTable !== null;

            // Check smart_alerts
            const { data: alertsTable } = await supabase
                .from('smart_alerts')
                .select('id')
                .limit(1);
            status.tables.smart_alerts = alertsTable !== null;

            // Check energy_profiles
            const { data: energyProfilesTable } = await supabase
                .from('energy_profiles')
                .select('sku')
                .limit(1);
            status.tables.energy_profiles = energyProfilesTable !== null;

            // Check function (optional, may not work with RLS)
            try {
                const { error: funcError } = await supabase.rpc('calculate_dynamic_tco', {
                    p_price: 1000,
                    p_energy_kwh_month: 10,
                    p_energy_rate: 0.85
                });
                status.functions.calculate_dynamic_tco = !funcError;
            } catch {
                status.functions.calculate_dynamic_tco = false;
            }
        }

    } catch (err) {
        status.lastError = err instanceof Error ? err.message : 'Unknown error';
    }

    return NextResponse.json(status);
}
