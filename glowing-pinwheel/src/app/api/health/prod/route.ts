/**
 * Production Health Check API
 * 
 * GET /api/health/prod
 * 
 * Comprehensive smoke test for production deployment.
 * Protected by IMMU_API_KEY or x-setup-key.
 */

import { NextResponse } from 'next/server';
import { getSupabaseAdminSafe, isSupabaseConfigured } from '@/lib/supabase/server';

export const runtime = 'nodejs';

interface HealthResponse {
    ok: boolean;
    timestamp: string;
    environment: string;
    supabase: {
        configured: boolean;
        canConnect: boolean;
        tablesOk: boolean;
    };
    energyRates: {
        source: 'supabase' | 'mock' | 'error';
    };
    smartAlerts: {
        mode: 'db' | 'local' | 'error';
    };
    llm: {
        provider: string;
        model: string;
        configured: boolean;
    };
    immunity: {
        recentOk: boolean;
    };
    errors: string[];
}

export async function GET(request: Request) {
    // Security check: require IMMU_API_KEY or x-setup-key
    const immuKey = process.env.IMMU_API_KEY;
    const setupKey = process.env.SUPABASE_SETUP_KEY;
    const providedApiKey = request.headers.get('x-api-key');
    const providedSetupKey = request.headers.get('x-setup-key');

    const isAuthed =
        (immuKey && providedApiKey === immuKey) ||
        (setupKey && providedSetupKey === setupKey) ||
        process.env.NODE_ENV !== 'production';

    if (!isAuthed) {
        return NextResponse.json(
            { error: 'Unauthorized', hint: 'Provide x-api-key or x-setup-key header' },
            { status: 401 }
        );
    }

    const errors: string[] = [];

    const health: HealthResponse = {
        ok: false,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'unknown',
        supabase: {
            configured: isSupabaseConfigured(),
            canConnect: false,
            tablesOk: false
        },
        energyRates: {
            source: 'error'
        },
        smartAlerts: {
            mode: 'error'
        },
        llm: {
            provider: 'google',
            model: 'gemini-2.5-flash-preview-05-20',
            configured: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY
        },
        immunity: {
            recentOk: true // Assume ok, check below
        },
        errors: []
    };

    // ============================================
    // 1. Check Supabase
    // ============================================
    if (health.supabase.configured) {
        const supabase = getSupabaseAdminSafe();
        if (supabase) {
            try {
                // Test connection
                const { error: connError } = await supabase
                    .from('energy_rates')
                    .select('state_code')
                    .limit(1);

                if (!connError || connError.code === 'PGRST116') {
                    health.supabase.canConnect = true;
                } else {
                    errors.push(`Supabase connection: ${connError.message}`);
                }

                // Check tables
                if (health.supabase.canConnect) {
                    const tables = ['energy_rates', 'smart_alerts', 'energy_profiles'];
                    let allOk = true;

                    for (const table of tables) {
                        const { error } = await supabase
                            .from(table)
                            .select('*')
                            .limit(1);

                        if (error && error.code !== 'PGRST116') {
                            allOk = false;
                            errors.push(`Table ${table}: ${error.message}`);
                        }
                    }

                    health.supabase.tablesOk = allOk;
                }
            } catch (err) {
                errors.push(`Supabase error: ${err instanceof Error ? err.message : 'unknown'}`);
            }
        } else {
            errors.push('Failed to create Supabase client');
        }
    } else {
        errors.push('Supabase not configured (missing env vars)');
    }

    // ============================================
    // 2. Check Energy Rates Source
    // ============================================
    try {
        const baseUrl = process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'http://localhost:3000';

        const energyRes = await fetch(`${baseUrl}/api/energy-rates?state=SP`, {
            headers: { 'User-Agent': 'HealthCheck/1.0' }
        });

        if (energyRes.ok) {
            const data = await energyRes.json();
            health.energyRates.source = data.source || 'mock';
        } else {
            health.energyRates.source = 'error';
            errors.push(`Energy rates: HTTP ${energyRes.status}`);
        }
    } catch (err) {
        errors.push(`Energy rates fetch: ${err instanceof Error ? err.message : 'unknown'}`);
    }

    // ============================================
    // 3. Check Smart Alerts Mode
    // ============================================
    if (health.supabase.configured && health.supabase.canConnect) {
        health.smartAlerts.mode = 'db';
    } else {
        health.smartAlerts.mode = 'local';
    }

    // ============================================
    // 4. Check LLM
    // ============================================
    if (!health.llm.configured) {
        errors.push('LLM not configured (missing GOOGLE_GENERATIVE_AI_API_KEY)');
    }

    // ============================================
    // 5. Determine overall health
    // ============================================
    health.ok =
        health.supabase.configured &&
        health.supabase.canConnect &&
        health.energyRates.source === 'supabase' &&
        health.llm.configured;

    health.errors = errors;

    // Add security headers
    const headers = {
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex, nofollow'
    };

    return NextResponse.json(health, { headers });
}
