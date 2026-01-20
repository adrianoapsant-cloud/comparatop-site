/**
 * Digital Immunity - Recent Events API
 * 
 * GET /api/immunity/recent
 * Returns the last 200 immunity events from the JSONL log.
 * 
 * Protection:
 * - Only available in development, OR
 * - Requires x-immu-key header matching IMMU_API_KEY env var
 */

import { NextResponse } from 'next/server';
import { readRecentEvents } from '@/lib/immunity/ingest';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    // Security check
    const isDevMode = process.env.NODE_ENV !== 'production';
    const apiKey = process.env.IMMU_API_KEY;
    const providedKey = request.headers.get('x-immu-key');

    if (!isDevMode && apiKey && providedKey !== apiKey) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        // Parse limit from query params
        const url = new URL(request.url);
        const limit = parseInt(url.searchParams.get('limit') || '200', 10);
        const safeLimit = Math.min(Math.max(limit, 1), 500);

        // Read events
        const events = await readRecentEvents(safeLimit);

        return NextResponse.json({
            count: events.length,
            events
        });
    } catch (error) {
        console.error('[immunity/recent] Error:', error);
        return NextResponse.json(
            { error: 'Failed to read events' },
            { status: 500 }
        );
    }
}
