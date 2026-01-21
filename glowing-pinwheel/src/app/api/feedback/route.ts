/**
 * Feedback API - Extended for Data Correction
 * 
 * Supports two modes:
 * 1. Rating feedback (legacy): thumbs up/down for TCO analysis
 * 2. Content error (new): contextual data corrections from PDP
 * 
 * Part of the "Auditor Comunitário" crowdsourced validation system.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdminSafe } from '@/lib/supabase/server';

// ============================================
// RATE LIMITING CONFIG
// ============================================

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 10; // Max 10 feedback submissions per IP per hour

/**
 * Get client IP from request headers
 */
function getClientIP(request: NextRequest): string {
    return (
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        'unknown'
    );
}

/**
 * Check and update rate limit (by IP for anonymous submissions)
 */
async function checkRateLimit(
    supabase: NonNullable<ReturnType<typeof getSupabaseAdminSafe>>,
    identifier: string
): Promise<{ allowed: boolean; remaining: number }> {
    const endpoint = 'feedback';
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);

    try {
        // Count requests in current window
        const { data: existing } = await supabase
            .from('api_rate_limits')
            .select('request_count')
            .eq('identifier', identifier)
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
                .eq('identifier', identifier)
                .eq('endpoint', endpoint)
                .gte('window_start', windowStart.toISOString());
        } else {
            await supabase
                .from('api_rate_limits')
                .insert({
                    identifier,
                    endpoint,
                    request_count: 1,
                    window_start: new Date().toISOString()
                });
        }

        return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - currentCount - 1 };
    } catch {
        // If rate limit check fails, allow the request (fail open)
        return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS };
    }
}

// ============================================
// VALIDATION SCHEMAS
// ============================================

const FeedbackReasons = [
    'price_wrong',
    'consumption_unrealistic',
    'missing_product',
    'calculation_error',
    'other',
] as const;

// Legacy schema (rating-based feedback)
const LegacyFeedbackSchema = z.object({
    rating: z.boolean(),
    productSku: z.string().optional(),
    categorySlug: z.string().optional(),
    pageUrl: z.string().optional(),
    reason: z.enum(FeedbackReasons).optional(),
    reasonText: z.string().max(500).optional(),
});

// New schema (content error / data correction)
const DataCorrectionSchema = z.object({
    feedbackType: z.literal('content_error'),
    elementId: z.string().min(1, 'Element ID obrigatório'),
    comment: z.string().min(1, 'Comentário obrigatório').max(1000),
    suggestedFix: z.string().max(1000).optional(),
    productSlug: z.string().optional(),
    pageUrl: z.string().optional(),
});

// Union schema - accepts both
const FeedbackSchema = z.union([
    DataCorrectionSchema,
    LegacyFeedbackSchema,
]);

// ============================================
// POST - Submit Feedback
// ============================================

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const parsed = FeedbackSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { ok: false, message: 'Dados inválidos', errors: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const data = parsed.data;
        const userAgent = request.headers.get('user-agent') || null;
        const clientIP = getClientIP(request);

        // Get Supabase client
        const supabase = getSupabaseAdminSafe();
        if (!supabase) {
            // HARDENED: No dev fallback - return clear error
            console.error('[Feedback] MISSING_SERVICE_ROLE - Supabase not configured');
            return NextResponse.json(
                { ok: false, code: 'MISSING_SERVICE_ROLE', message: 'Serviço temporariamente indisponível.' },
                { status: 501 }
            );
        }

        // Check rate limit
        const rateLimit = await checkRateLimit(supabase, clientIP);
        if (!rateLimit.allowed) {
            return NextResponse.json(
                { ok: false, message: 'Limite de envios atingido. Tente novamente em 1 hora.' },
                {
                    status: 429,
                    headers: {
                        'Retry-After': '3600',
                        'X-RateLimit-Remaining': '0'
                    }
                }
            );
        }

        // Determine feedback type and build insert payload
        const isDataCorrection = 'feedbackType' in data && data.feedbackType === 'content_error';

        let insertPayload: Record<string, string | boolean | null>;

        if (isDataCorrection) {
            // Data correction fields (narrowed to DataCorrectionSchema type)
            insertPayload = {
                element_id: data.elementId,
                feedback_type: 'content_error',
                reason_text: data.comment,
                suggested_fix: data.suggestedFix || null,
                product_sku: data.productSlug || null,
                page_url: data.pageUrl || null,
                rating: false, // Corrections are implicitly negative
                status: 'new',
                user_agent: userAgent,
            };
        } else {
            // Legacy rating fields (narrowed to LegacyFeedbackSchema type)
            const legacyData = data as {
                rating: boolean;
                productSku?: string;
                categorySlug?: string;
                pageUrl?: string;
                reason?: string;
                reasonText?: string;
            };
            insertPayload = {
                product_sku: legacyData.productSku || null,
                category_slug: legacyData.categorySlug || null,
                page_url: legacyData.pageUrl || null,
                rating: legacyData.rating,
                reason: legacyData.reason || null,
                reason_text: legacyData.reasonText || null,
                feedback_type: 'rating',
                status: 'new',
                user_agent: userAgent,
            };
        }

        // Insert feedback
        const { data: result, error } = await supabase
            .from('feedback_logs')
            .insert(insertPayload)
            .select('id')
            .single();

        if (error) {
            // HARDENED: Log error without user content, add specific code
            console.error('[Feedback] SUPABASE_INSERT_FAILED:', error.code, error.message);
            return NextResponse.json(
                { ok: false, code: 'SUPABASE_INSERT_FAILED', message: 'Erro ao salvar feedback. Tente novamente.' },
                { status: 500 }
            );
        }

        // Success messages
        const successMessage = isDataCorrection
            ? 'Obrigado! Vamos revisar e corrigir. 🔍'
            : ('rating' in data && data.rating)
                ? 'Obrigado pelo feedback positivo! 🎉'
                : 'Obrigado! Vamos revisar essa análise. 🔍';

        return NextResponse.json({
            ok: true,
            id: result?.id,
            message: successMessage,
        }, {
            headers: {
                'X-RateLimit-Remaining': String(rateLimit.remaining)
            }
        });

    } catch (error) {
        // HARDENED: Sanitize logs - don't expose user content
        const errMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error('[Feedback] Unexpected error:', errMsg);
        return NextResponse.json(
            { ok: false, code: 'INTERNAL_ERROR', message: 'Erro interno. Tente novamente.' },
            { status: 500 }
        );
    }
}

// ============================================
// GET - Health Check
// ============================================

export async function GET() {
    return NextResponse.json({
        status: 'ok',
        endpoint: '/api/feedback',
        methods: ['POST'],
        schemas: ['legacy_rating', 'content_error'],
    });
}
