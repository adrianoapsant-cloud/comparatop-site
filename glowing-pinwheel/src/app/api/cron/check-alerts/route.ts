/**
 * Cron Job: Check Alerts
 * 
 * Secure endpoint to be called by Vercel Cron or external scheduler.
 * Runs the Alert Monitor to check and trigger price/TCO alerts.
 * 
 * Security: Protected by CRON_SECRET header
 * Schedule: Daily at 08:00 BRT (recommended)
 * 
 * Vercel Cron config (vercel.json):
 * {
 *   "crons": [{
 *     "path": "/api/cron/check-alerts",
 *     "schedule": "0 11 * * *"  // 11:00 UTC = 08:00 BRT
 *   }]
 * }
 */

import { NextResponse } from 'next/server';
import { checkActiveAlerts, getAlertStats } from '@/lib/services/alert-monitor';

export const runtime = 'nodejs';
export const maxDuration = 60; // 60 second timeout for cron jobs

// Secret for authenticating cron requests
const CRON_SECRET = process.env.CRON_SECRET;

/**
 * POST - Run alert check (called by cron)
 * 
 * Headers required:
 * - Authorization: Bearer <CRON_SECRET>
 * 
 * Query params:
 * - mock: "true" to use mock prices (default: true)
 * - dry: "true" for dry run without triggering (not yet implemented)
 */
export async function POST(request: Request): Promise<Response> {
    // Verify authorization
    const authHeader = request.headers.get('Authorization');
    const cronHeader = request.headers.get('x-vercel-cron'); // Vercel sends this

    // Allow if Vercel cron is calling OR valid Bearer token
    const isVercelCron = cronHeader === '1';
    const hasValidToken = authHeader === `Bearer ${CRON_SECRET}` && CRON_SECRET;

    if (!isVercelCron && !hasValidToken) {
        console.warn('[cron/check-alerts] Unauthorized request');
        return NextResponse.json(
            { error: 'Unauthorized', message: 'Invalid or missing CRON_SECRET' },
            { status: 401 }
        );
    }

    // Parse options from query params
    const url = new URL(request.url);
    const useMock = url.searchParams.get('mock') !== 'false';

    console.log(`[cron/check-alerts] Starting check (mock=${useMock})`);
    const startTime = Date.now();

    try {
        // Run the alert monitor
        const report = await checkActiveAlerts(useMock);
        const duration = Date.now() - startTime;

        console.log(`[cron/check-alerts] Complete: ${report.triggeredCount}/${report.totalAlerts} triggered in ${duration}ms`);

        return NextResponse.json({
            ok: true,
            duration: `${duration}ms`,
            summary: {
                totalAlerts: report.totalAlerts,
                triggered: report.triggeredCount,
                failed: report.failedCount,
                errors: report.errors.length,
            },
            report, // Full details
        });

    } catch (err) {
        console.error('[cron/check-alerts] Error:', err);
        return NextResponse.json(
            {
                ok: false,
                error: 'Alert check failed',
                message: err instanceof Error ? err.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

/**
 * GET - Health check and stats (no auth required)
 * 
 * Returns current alert statistics without triggering anything.
 */
export async function GET(): Promise<Response> {
    try {
        const stats = await getAlertStats();

        return NextResponse.json({
            ok: true,
            status: 'healthy',
            cronEndpoint: '/api/cron/check-alerts',
            stats,
            instructions: {
                trigger: 'POST with Authorization: Bearer <CRON_SECRET>',
                schedule: 'Recommended: Daily at 08:00 BRT',
            },
        });

    } catch (err) {
        return NextResponse.json(
            {
                ok: false,
                status: 'error',
                message: err instanceof Error ? err.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
