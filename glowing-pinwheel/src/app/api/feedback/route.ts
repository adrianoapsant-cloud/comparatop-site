/**
 * Feedback API
 * 
 * Receives and stores user feedback for TCO analysis quality.
 * Part of the "Auditor Comunitário" crowdsourced validation system.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdminSafe } from '@/lib/supabase/server';

// ============================================
// VALIDATION SCHEMA
// ============================================

const FeedbackReasons = [
    'price_wrong',
    'consumption_unrealistic',
    'missing_product',
    'calculation_error',
    'other',
] as const;

const FeedbackSchema = z.object({
    rating: z.boolean(),
    productSku: z.string().optional(),
    categorySlug: z.string().optional(),
    pageUrl: z.string().optional(),
    reason: z.enum(FeedbackReasons).optional(),
    reasonText: z.string().max(500).optional(),
});

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
                { ok: false, message: 'Dados inválidos' },
                { status: 400 }
            );
        }

        const { rating, productSku, categorySlug, pageUrl, reason, reasonText } = parsed.data;

        // Get Supabase client
        const supabase = getSupabaseAdminSafe();
        if (!supabase) {
            // Dev mode fallback - just log
            console.log('[Feedback] Would save:', parsed.data);
            return NextResponse.json({
                ok: true,
                message: rating
                    ? 'Obrigado pelo feedback positivo!'
                    : 'Obrigado! Vamos revisar essa análise.',
                mode: 'dev',
            });
        }

        // Insert feedback
        const { error } = await supabase
            .from('feedback_logs')
            .insert({
                product_sku: productSku || null,
                category_slug: categorySlug || null,
                page_url: pageUrl || null,
                rating,
                reason: reason || null,
                reason_text: reasonText || null,
                user_agent: request.headers.get('user-agent') || null,
            });

        if (error) {
            console.error('[Feedback] Insert error:', error);
            return NextResponse.json(
                { ok: false, message: 'Erro ao salvar feedback' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            ok: true,
            message: rating
                ? 'Obrigado pelo feedback positivo! 🎉'
                : 'Obrigado! Vamos revisar essa análise. 🔍',
        });

    } catch (error) {
        console.error('[Feedback] Unexpected error:', error);
        return NextResponse.json(
            { ok: false, message: 'Erro interno' },
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
    });
}
