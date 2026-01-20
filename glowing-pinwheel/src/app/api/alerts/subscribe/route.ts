/**
 * Alert Subscribe API
 * 
 * POST /api/alerts/subscribe - Create a new price/TCO alert
 * 
 * This is an alias endpoint that provides a cleaner URL for frontend integration.
 * The main logic lives in /api/smart-alerts for backwards compatibility.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdminSafe } from '@/lib/supabase/server';
import type { AlertSubscribeResponse } from '@/types/db';

export const runtime = 'nodejs';

// Rate limit configuration
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 alerts per email per hour

// Validation schema
const SubscribeSchema = z.object({
    email: z.string().email('Email inválido'),
    productSku: z.string().min(1, 'SKU obrigatório'),
    alertType: z.enum(['PRICE', 'SMART_VALUE']),
    targetPrice: z.number().positive().optional(),
    targetTco: z.number().positive().optional(),
    currentTcoAtSignup: z.number().positive().optional(),
    stateCode: z.string().length(2).default('SP'),
});

/**
 * Check and update rate limit
 */
async function checkRateLimit(
    supabase: NonNullable<ReturnType<typeof getSupabaseAdminSafe>>,
    email: string
): Promise<{ allowed: boolean; remaining: number }> {
    const endpoint = 'alerts/subscribe';
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);

    // Count requests in current window
    const { data: existing } = await supabase
        .from('api_rate_limits')
        .select('request_count')
        .eq('identifier', email.toLowerCase())
        .eq('endpoint', endpoint)
        .gte('window_start', windowStart.toISOString())
        .single();

    const currentCount = existing?.request_count || 0;

    if (currentCount >= RATE_LIMIT_MAX_REQUESTS) {
        return { allowed: false, remaining: 0 };
    }

    // Update or insert rate limit record
    if (existing) {
        await supabase
            .from('api_rate_limits')
            .update({ request_count: currentCount + 1 })
            .eq('identifier', email.toLowerCase())
            .eq('endpoint', endpoint)
            .gte('window_start', windowStart.toISOString());
    } else {
        await supabase
            .from('api_rate_limits')
            .insert({
                identifier: email.toLowerCase(),
                endpoint,
                request_count: 1,
                window_start: new Date().toISOString()
            });
    }

    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - currentCount - 1 };
}

/**
 * POST - Subscribe to price/TCO alerts
 */
export async function POST(request: Request): Promise<Response> {
    const supabase = getSupabaseAdminSafe();

    if (!supabase) {
        const response: AlertSubscribeResponse = {
            ok: false,
            message: 'Sistema de alertas indisponível. Tente novamente mais tarde.',
            error: 'SUPABASE_NOT_CONFIGURED'
        };
        return NextResponse.json(response, { status: 501 });
    }

    try {
        // Parse and validate request body
        const body = await request.json();
        const parsed = SubscribeSchema.safeParse(body);

        if (!parsed.success) {
            const response: AlertSubscribeResponse = {
                ok: false,
                message: 'Dados inválidos',
                error: parsed.error.flatten().fieldErrors.email?.[0]
                    || parsed.error.flatten().fieldErrors.productSku?.[0]
                    || 'Validation failed'
            };
            return NextResponse.json(response, { status: 400 });
        }

        const { email, productSku, alertType, targetPrice, targetTco, currentTcoAtSignup, stateCode } = parsed.data;

        // Check rate limit
        const rateLimit = await checkRateLimit(supabase, email);
        if (!rateLimit.allowed) {
            const response: AlertSubscribeResponse = {
                ok: false,
                message: 'Limite de alertas atingido. Tente novamente em 1 hora.',
                error: 'RATE_LIMIT_EXCEEDED'
            };
            return NextResponse.json(response, {
                status: 429,
                headers: {
                    'Retry-After': '3600',
                    'X-RateLimit-Remaining': '0'
                }
            });
        }

        // Check for duplicate active alert
        const { data: existingAlert } = await supabase
            .from('smart_alerts')
            .select('id')
            .eq('user_email', email.toLowerCase())
            .eq('product_sku', productSku)
            .eq('alert_type', alertType)
            .eq('is_active', true)
            .single();

        if (existingAlert) {
            const response: AlertSubscribeResponse = {
                ok: false,
                message: 'Você já possui um alerta ativo para este produto.',
                error: 'DUPLICATE_ALERT'
            };
            return NextResponse.json(response, { status: 409 });
        }

        // Insert new alert
        const { data, error } = await supabase
            .from('smart_alerts')
            .insert({
                user_email: email.toLowerCase(),
                product_sku: productSku,
                alert_type: alertType,
                target_price: targetPrice || null,
                target_tco: targetTco || null,
                current_tco_at_signup: currentTcoAtSignup || null,
                state_code: stateCode,
                is_active: true
            })
            .select('id')
            .single();

        if (error) {
            console.error('[alerts/subscribe] Insert error:', error);
            const response: AlertSubscribeResponse = {
                ok: false,
                message: 'Erro ao criar alerta. Tente novamente.',
                error: error.message
            };
            return NextResponse.json(response, { status: 500 });
        }

        // Success response
        const successMessage = alertType === 'PRICE'
            ? `Alerta de preço criado! Você será notificado quando o preço cair abaixo de R$ ${targetPrice?.toFixed(2)}.`
            : `Alerta de Custo-Total criado! Você será notificado quando o TCO ficar mais vantajoso.`;

        const response: AlertSubscribeResponse = {
            ok: true,
            alertId: data.id,
            message: successMessage
        };

        return NextResponse.json(response, {
            status: 201,
            headers: {
                'X-RateLimit-Remaining': String(rateLimit.remaining)
            }
        });

    } catch (err) {
        console.error('[alerts/subscribe] Error:', err);
        const response: AlertSubscribeResponse = {
            ok: false,
            message: 'Erro interno. Tente novamente.',
            error: 'INTERNAL_ERROR'
        };
        return NextResponse.json(response, { status: 500 });
    }
}
