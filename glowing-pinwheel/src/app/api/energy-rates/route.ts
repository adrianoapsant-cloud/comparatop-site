/**
 * Energy Rates API
 * 
 * GET /api/energy-rates?state=SP
 * 
 * Returns energy rate for a Brazilian state.
 * Uses Supabase when configured, fallback to mock data.
 */

import { NextResponse } from 'next/server';
import { getSupabaseAdminSafe, type EnergyRateRow } from '@/lib/supabase/server';
import { getEnergyRate, DEFAULT_ENERGY_RATE, ENERGY_RATES } from '@/lib/tco/energy-rates';

export const runtime = 'nodejs';

// In-memory cache: { stateCode: { rateKwh, fetchedAt } }
const rateCache = new Map<string, { rateKwh: number; fetchedAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function GET(request: Request) {
    const url = new URL(request.url);
    const stateCode = url.searchParams.get('state')?.toUpperCase() || 'SP';

    // Validate state code
    if (!/^[A-Z]{2}$/.test(stateCode)) {
        return NextResponse.json(
            { error: 'Invalid state code. Must be 2 letters (e.g., SP, RJ)' },
            { status: 400 }
        );
    }

    // Check cache first
    const cached = rateCache.get(stateCode);
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
        return NextResponse.json({
            stateCode,
            rateKwh: cached.rateKwh,
            source: 'cache',
            stateName: ENERGY_RATES[stateCode]?.stateName || stateCode
        });
    }

    // Try Supabase
    const supabase = getSupabaseAdminSafe();

    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('energy_rates')
                .select('rate_kwh, state_name')
                .eq('state_code', stateCode)
                .single();

            if (!error && data) {
                const rate = data as Pick<EnergyRateRow, 'rate_kwh' | 'state_name'>;

                // Update cache
                rateCache.set(stateCode, {
                    rateKwh: rate.rate_kwh,
                    fetchedAt: Date.now()
                });

                return NextResponse.json({
                    stateCode,
                    rateKwh: rate.rate_kwh,
                    stateName: rate.state_name,
                    source: 'supabase'
                });
            }

            // Log error but fallback to mock
            console.warn(`[energy-rates] Supabase query failed for ${stateCode}:`, error?.message);
        } catch (err) {
            console.error('[energy-rates] Supabase error:', err);
        }
    }

    // Fallback to mock data
    const mockRate = getEnergyRate(stateCode);
    const mockStateName = ENERGY_RATES[stateCode]?.stateName || stateCode;

    // Cache mock result too (to avoid repeated failed DB calls)
    rateCache.set(stateCode, {
        rateKwh: mockRate,
        fetchedAt: Date.now()
    });

    return NextResponse.json({
        stateCode,
        rateKwh: mockRate,
        stateName: mockStateName,
        source: 'mock'
    });
}
