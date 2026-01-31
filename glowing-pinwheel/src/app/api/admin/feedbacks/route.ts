/**
 * Admin Feedbacks API
 * 
 * GET: List feedbacks with optional filters
 * PATCH: Update feedback status
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin/auth';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

// Supabase client with service role for admin operations
function getSupabaseAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        return null;
    }

    return createClient(url, key);
}

// ============================================
// GET - List Feedbacks
// ============================================

export async function GET(request: NextRequest) {
    // Verify admin session
    const session = await getAdminSession();
    if (!session) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json(
            { error: 'Database not configured' },
            { status: 503 }
        );
    }

    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const feedbackType = searchParams.get('type');
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        // Build query
        let query = supabase
            .from('feedback_logs')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        // Apply filters
        if (status) {
            query = query.eq('status', status);
        }
        if (feedbackType) {
            query = query.eq('feedback_type', feedbackType);
        }

        const { data, error, count } = await query;

        if (error) {
            console.error('[admin/feedbacks] Query error:', error);
            return NextResponse.json(
                { error: 'Failed to fetch feedbacks' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            feedbacks: data || [],
            total: count || 0,
            limit,
            offset
        });

    } catch (error) {
        console.error('[admin/feedbacks] Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// ============================================
// PATCH - Update Feedback Status
// ============================================

export async function PATCH(request: NextRequest) {
    // Verify admin session
    const session = await getAdminSession();
    if (!session) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json(
            { error: 'Database not configured' },
            { status: 503 }
        );
    }

    try {
        const body = await request.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json(
                { error: 'Missing id or status' },
                { status: 400 }
            );
        }

        const validStatuses = ['new', 'reviewed', 'fixed', 'wont_fix'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('feedback_logs')
            .update({ status })  // Apenas status - updated_at não existe no schema
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('[admin/feedbacks] Update error:', error.code, error.message, error.details);
            return NextResponse.json(
                { error: 'Failed to update feedback', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ feedback: data });

    } catch (error) {
        console.error('[admin/feedbacks] Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
