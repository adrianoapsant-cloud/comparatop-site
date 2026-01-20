/**
 * @file /api/health/events/route.ts
 * @description Endpoint para visualizar eventos recentes do ring buffer
 * 
 * Query params:
 * - category: 'product_health' | 'fallback' | 'route_error'
 * - level: 'info' | 'warn' | 'error'
 * - limit: número máximo de eventos (default: 50)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getRecentEvents, getBufferStats, type LogCategory, type LogLevel } from '@/lib/observability/logger';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        // Parse query params
        const category = searchParams.get('category') as LogCategory | null;
        const level = searchParams.get('level') as LogLevel | null;
        const limitParam = searchParams.get('limit');
        const limit = limitParam ? parseInt(limitParam, 10) : 50;

        // Validar category
        const validCategories: LogCategory[] = ['product_health', 'fallback', 'route_error'];
        if (category && !validCategories.includes(category)) {
            return NextResponse.json(
                { error: `Invalid category. Valid: ${validCategories.join(', ')}` },
                { status: 400 }
            );
        }

        // Validar level
        const validLevels: LogLevel[] = ['info', 'warn', 'error'];
        if (level && !validLevels.includes(level)) {
            return NextResponse.json(
                { error: `Invalid level. Valid: ${validLevels.join(', ')}` },
                { status: 400 }
            );
        }

        // Obter eventos
        const events = getRecentEvents({
            category: category || undefined,
            level: level || undefined,
            limit: Math.min(limit, 100), // Cap at 100
        });

        // Obter estatísticas
        const stats = getBufferStats();

        return NextResponse.json({
            timestamp: new Date().toISOString(),
            stats,
            events,
            meta: {
                filters: { category, level, limit },
                returned: events.length,
                note: 'Ring buffer reinicia em cold start (serverless). Eventos são deduplicados por 60s.',
            },
        }, {
            status: 200,
            headers: {
                'Cache-Control': 'no-store',
            },
        });
    } catch (error) {
        console.error('[api/health/events] Error:', error);
        return NextResponse.json(
            { error: 'Failed to get events' },
            { status: 500 }
        );
    }
}
