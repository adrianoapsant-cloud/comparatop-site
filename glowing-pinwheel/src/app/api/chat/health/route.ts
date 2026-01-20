/**
 * Chat Health Check API
 * 
 * GET: Returns basic health status of chat API
 */

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
    const startTime = Date.now();

    try {
        // Basic health check - just verify the endpoint is responding
        // In a real scenario, you might ping dependencies here

        const latencyMs = Date.now() - startTime;

        return NextResponse.json({
            ok: true,
            latencyMs,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('[chat/health] Error:', error);
        return NextResponse.json({
            ok: false,
            error: 'Health check failed',
            latencyMs: Date.now() - startTime
        }, { status: 500 });
    }
}
