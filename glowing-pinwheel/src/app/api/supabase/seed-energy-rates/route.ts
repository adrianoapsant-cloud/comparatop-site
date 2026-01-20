/**
 * Seed Energy Rates API
 * 
 * POST /api/supabase/seed-energy-rates
 * 
 * Seeds energy_rates table with mock data from SP/RJ/MG.
 * DEV-only or protected by SUPABASE_SETUP_KEY
 */

import { NextResponse } from 'next/server';
import { getSupabaseAdminSafe, isSupabaseConfigured } from '@/lib/supabase/server';
import { ENERGY_RATES } from '@/lib/tco/energy-rates';

export const runtime = 'nodejs';

// States to seed (most important ones)
const STATES_TO_SEED = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'PE', 'CE', 'DF'];

export async function POST(request: Request) {
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

    if (!isSupabaseConfigured()) {
        return NextResponse.json(
            { error: 'Supabase not configured' },
            { status: 501 }
        );
    }

    const supabase = getSupabaseAdminSafe();
    if (!supabase) {
        return NextResponse.json(
            { error: 'Failed to create Supabase client' },
            { status: 500 }
        );
    }

    try {
        // Check if table exists
        const { error: tableError } = await supabase
            .from('energy_rates')
            .select('state_code')
            .limit(1);

        if (tableError && tableError.code === 'PGRST116') {
            return NextResponse.json({
                error: 'Table energy_rates not found',
                message: 'Run migration first: supabase/migrations/20260114_smart_value_tco.sql',
                code: 'TABLE_NOT_FOUND'
            }, { status: 409 });
        }

        // Prepare data from mock
        const seedData = STATES_TO_SEED
            .filter(code => ENERGY_RATES[code])
            .map(code => ({
                state_code: code,
                state_name: ENERGY_RATES[code].stateName,
                rate_kwh: ENERGY_RATES[code].rateKwh
            }));

        // Upsert (insert or update on conflict)
        const { data, error } = await supabase
            .from('energy_rates')
            .upsert(seedData, {
                onConflict: 'state_code',
                ignoreDuplicates: false
            })
            .select('state_code');

        if (error) {
            return NextResponse.json({
                error: 'Failed to seed data',
                message: error.message
            }, { status: 500 });
        }

        // ============================================
        // SEED ENERGY_PROFILES (2-3 TVs)
        // ============================================
        const profilesSeed = [
            { sku: 'samsung-qn90c-65', kwh_month: 12.5, source: 'manual' },
            { sku: 'lg-c3-65', kwh_month: 14.2, source: 'manual' },
            { sku: 'tcl-c735-65', kwh_month: 11.8, source: 'manual' }
        ];

        let profilesUpserted = 0;
        try {
            const { data: profilesData, error: profilesError } = await supabase
                .from('energy_profiles')
                .upsert(profilesSeed, { onConflict: 'sku', ignoreDuplicates: false })
                .select('sku');

            if (!profilesError) {
                profilesUpserted = profilesData?.length || profilesSeed.length;
            }
        } catch {
            // Table may not exist, ignore
        }

        return NextResponse.json({
            ok: true,
            upserted: data?.length || seedData.length,
            states: STATES_TO_SEED.filter(code => ENERGY_RATES[code]),
            energyProfiles: profilesUpserted
        });

    } catch (err) {
        return NextResponse.json({
            error: 'Internal error',
            message: err instanceof Error ? err.message : 'Unknown'
        }, { status: 500 });
    }
}
