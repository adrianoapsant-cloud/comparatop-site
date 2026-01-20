/**
 * Smart Alerts API
 * 
 * POST /api/smart-alerts - Create a new alert
 * GET /api/smart-alerts?email=... - List alerts for email
 * 
 * Uses Supabase when configured, returns 501 otherwise.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdminSafe, type SmartAlertRow } from '@/lib/supabase/server';

export const runtime = 'nodejs';

// Validation schema for POST
const CreateAlertSchema = z.object({
    userEmail: z.string().email(),
    productSku: z.string().min(1),
    alertType: z.enum(['PRICE', 'SMART_VALUE']),
    targetPrice: z.number().positive().optional(),
    targetTco: z.number().positive().optional(),
    currentTcoAtSignup: z.number().positive().optional(),
    stateCode: z.string().length(2).default('SP'),
    isActive: z.boolean().default(true)
});

/**
 * POST - Create a new smart alert
 */
export async function POST(request: Request) {
    const supabase = getSupabaseAdminSafe();

    if (!supabase) {
        return NextResponse.json(
            {
                error: 'Supabase not configured',
                message: 'Alert system unavailable. Please save locally.',
                code: 'SUPABASE_NOT_CONFIGURED'
            },
            { status: 501 }
        );
    }

    try {
        const body = await request.json();
        const parsed = CreateAlertSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    details: parsed.error.flatten().fieldErrors
                },
                { status: 400 }
            );
        }

        const alert = parsed.data;

        // Insert into Supabase
        const { data, error } = await supabase
            .from('smart_alerts')
            .insert({
                user_email: alert.userEmail,
                product_sku: alert.productSku,
                alert_type: alert.alertType,
                target_price: alert.targetPrice || null,
                target_tco: alert.targetTco || null,
                current_tco_at_signup: alert.currentTcoAtSignup || null,
                state_code: alert.stateCode,
                is_active: alert.isActive
            })
            .select('id')
            .single();

        if (error) {
            console.error('[smart-alerts] Insert error:', error);
            return NextResponse.json(
                { error: 'Failed to create alert', message: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            ok: true,
            alertId: data.id,
            message: 'Alert created successfully'
        });

    } catch (err) {
        console.error('[smart-alerts] POST error:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * GET - List alerts for an email (debug/admin)
 */
export async function GET(request: Request) {
    const supabase = getSupabaseAdminSafe();

    if (!supabase) {
        return NextResponse.json(
            {
                error: 'Supabase not configured',
                alerts: []
            },
            { status: 501 }
        );
    }

    const url = new URL(request.url);
    const email = url.searchParams.get('email');

    if (!email || !email.includes('@')) {
        return NextResponse.json(
            { error: 'Valid email required' },
            { status: 400 }
        );
    }

    try {
        const { data, error } = await supabase
            .from('smart_alerts')
            .select('*')
            .eq('user_email', email)
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) {
            console.error('[smart-alerts] Query error:', error);
            return NextResponse.json(
                { error: 'Failed to fetch alerts' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            count: data?.length || 0,
            alerts: data || []
        });

    } catch (err) {
        console.error('[smart-alerts] GET error:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
