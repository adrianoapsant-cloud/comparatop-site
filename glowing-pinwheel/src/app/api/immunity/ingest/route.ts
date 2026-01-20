/**
 * Digital Immunity - Navigation Events Ingest
 * 
 * POST /api/immunity/ingest
 * Recebe batch de eventos de navegação do frontend
 */

import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';
import type { NavEvent, ImmunityEvent } from '@/lib/immunity/types';

// Directory and file paths
const IMMUNITY_DIR = join(process.cwd(), '.immunity');
const IMMUNITY_FILE = join(IMMUNITY_DIR, 'immunity.jsonl');

// Limits
const MAX_EVENTS_PER_REQUEST = 50;
const MAX_PATH_LENGTH = 200;
const MAX_TARGET_LENGTH = 100;

interface IngestPayload {
    sessionId: string;
    events: NavEvent[];
}

export async function POST(request: Request) {
    try {
        const body = await request.json() as IngestPayload;

        // Validate sessionId
        if (!body.sessionId || typeof body.sessionId !== 'string') {
            return NextResponse.json(
                { error: 'Missing or invalid sessionId' },
                { status: 400 }
            );
        }

        // Validate events
        if (!Array.isArray(body.events) || body.events.length === 0) {
            return NextResponse.json(
                { error: 'Missing or empty events array' },
                { status: 400 }
            );
        }

        // Limit events
        const events = body.events.slice(0, MAX_EVENTS_PER_REQUEST);

        // Ensure directory exists
        await fs.mkdir(IMMUNITY_DIR, { recursive: true });

        // Process and log each event
        const env = (process.env.NODE_ENV as 'development' | 'production' | 'preview') || 'development';
        const lines: string[] = [];

        for (const event of events) {
            // Validate event type
            if (!['page_view', 'scroll', 'click', 'rage_click', 'confusion_scroll'].includes(event.type)) {
                continue;
            }

            // Sanitize path (no PII, limit length)
            const path = sanitizePath(event.path);
            if (!path) continue;

            // Build immunity event
            const immunityEvent: ImmunityEvent = {
                ts: event.ts || new Date().toISOString(),
                env,
                app: 'glowing-pinwheel',
                requestId: `nav-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                sessionId: body.sessionId,
                nav: {
                    type: event.type,
                    path,
                    depth: event.type === 'scroll' ? clamp(event.depth || 0, 0, 1) : undefined,
                    target: event.type === 'click' ? sanitizeTarget(event.target) : undefined
                }
            };

            lines.push(JSON.stringify(immunityEvent));
        }

        // Append to JSONL file
        if (lines.length > 0) {
            await fs.appendFile(IMMUNITY_FILE, lines.join('\n') + '\n', 'utf-8');
            console.log(`[immunity/ingest] Logged ${lines.length} nav events for session ${body.sessionId.slice(0, 8)}`);
        }

        return NextResponse.json({
            success: true,
            logged: lines.length
        });

    } catch (error) {
        console.error('[immunity/ingest] Error:', error);
        return NextResponse.json(
            { error: 'Failed to process events' },
            { status: 500 }
        );
    }
}

// Helpers
function sanitizePath(path: string | undefined): string | null {
    if (!path || typeof path !== 'string') return null;

    // Only pathname, no query params (could contain PII)
    const cleanPath = path.split('?')[0].slice(0, MAX_PATH_LENGTH);

    // Basic validation
    if (!cleanPath.startsWith('/')) return null;

    return cleanPath;
}

function sanitizeTarget(target: string | undefined): string | undefined {
    if (!target || typeof target !== 'string') return undefined;

    // Only allow safe identifiers
    const clean = target
        .replace(/[^a-zA-Z0-9_\-=\[\]]/g, '')
        .slice(0, MAX_TARGET_LENGTH);

    return clean || undefined;
}

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}
