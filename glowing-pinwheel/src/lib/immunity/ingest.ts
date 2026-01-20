/**
 * Digital Immunity v1 - Ingest
 * 
 * Dual-Stream / Side-Channel Logging:
 * - Hot path: stream pro usuário (não bloqueia)
 * - Cold path: log assíncrono via onFinish
 * 
 * Modos:
 * - DEV: Append JSONL em .immunity/immunity.jsonl
 * - PROD (opcional): POST para QStash se envs existirem
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import type { ImmunityEvent, PartialImmunityEvent } from './types';

// Directory and file paths
const IMMUNITY_DIR = join(process.cwd(), '.immunity');
const IMMUNITY_FILE = join(IMMUNITY_DIR, 'immunity.jsonl');

// QStash config (optional)
const QSTASH_URL = process.env.IMMU_QSTASH_URL;
const QSTASH_TOKEN = process.env.IMMU_QSTASH_TOKEN;
const QSTASH_TIMEOUT_MS = 1200;

/**
 * Enqueue an immunity event for logging.
 * This is the "cold path" - called after response is sent to user.
 * 
 * IMPORTANT: This function should NEVER throw or block the chat.
 */
export async function enqueueImmunityEvent(event: PartialImmunityEvent): Promise<void> {
    // Build full event with defaults for metadata fields only
    const fullEvent: ImmunityEvent = {
        // Metadata with defaults
        ts: event.ts || new Date().toISOString(),
        env: event.env || ((process.env.NODE_ENV as 'development' | 'production' | 'preview') || 'development'),
        app: event.app || 'glowing-pinwheel',
        // Required fields from event
        requestId: event.requestId,
        sessionId: event.sessionId,
        chat: event.chat,
        // Optional fields from event
        analyticsSessionId: event.analyticsSessionId,
        page: event.page,
        llm: event.llm,
        tools: event.tools,
        errors: event.errors,
        latency: event.latency,
        safety: event.safety,
        // New fields for friction + intents
        nav: event.nav,
        pageContext: event.pageContext,
        friction: event.friction,
        intents: event.intents,
        questionHash: event.questionHash
    };

    // Attempt local logging first (DEV mode)
    await logToLocalFile(fullEvent);

    // Optionally send to QStash if configured
    if (QSTASH_URL && QSTASH_TOKEN) {
        await sendToQStash(fullEvent);
    }
}

/**
 * Append event to local JSONL file.
 * Creates directory if it doesn't exist.
 */
async function logToLocalFile(event: ImmunityEvent): Promise<void> {
    try {
        // Ensure directory exists
        await fs.mkdir(IMMUNITY_DIR, { recursive: true });

        // Append to JSONL file
        const line = JSON.stringify(event) + '\n';
        await fs.appendFile(IMMUNITY_FILE, line, 'utf-8');

        console.log(`[immunity] Logged event ${event.requestId.slice(0, 8)} | mode: ${event.chat?.mode || 'nav'}`);
    } catch (error) {
        // Silent fail - never break the chat
        console.error('[immunity] Failed to log to local file:', error instanceof Error ? error.message : error);
    }
}

/**
 * Send event to QStash queue (optional, for production).
 * Uses short timeout to not delay response.
 */
async function sendToQStash(event: ImmunityEvent): Promise<void> {
    if (!QSTASH_URL || !QSTASH_TOKEN) return;

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), QSTASH_TIMEOUT_MS);

        await fetch(QSTASH_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${QSTASH_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(event),
            signal: controller.signal
        });

        clearTimeout(timeout);
        console.log(`[immunity] Sent to QStash: ${event.requestId.slice(0, 8)}`);
    } catch (error) {
        // Silent fail - never break the chat
        if (error instanceof Error && error.name === 'AbortError') {
            console.warn('[immunity] QStash timeout - event will be in local file only');
        } else {
            console.error('[immunity] QStash error:', error instanceof Error ? error.message : error);
        }
    }
}

/**
 * Read recent events from local JSONL file.
 * Used by /api/immunity/recent endpoint.
 */
export async function readRecentEvents(limit: number = 200): Promise<ImmunityEvent[]> {
    try {
        const content = await fs.readFile(IMMUNITY_FILE, 'utf-8');
        const lines = content.trim().split('\n').filter(Boolean);

        // Get last N lines
        const recentLines = lines.slice(-limit);

        // Parse and return
        return recentLines.map(line => {
            try {
                return JSON.parse(line) as ImmunityEvent;
            } catch {
                return null;
            }
        }).filter((e): e is ImmunityEvent => e !== null);
    } catch (error) {
        // File doesn't exist yet or read error
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        console.error('[immunity] Failed to read events:', error);
        return [];
    }
}

/**
 * Log a generic immunity event (admin, security, etc).
 * Simpler interface for non-chat events.
 */
export async function logImmunityEvent(event: Record<string, unknown>): Promise<void> {
    try {
        // Ensure directory exists
        await fs.mkdir(IMMUNITY_DIR, { recursive: true });

        // Add timestamp if not present
        const fullEvent = {
            ts: new Date().toISOString(),
            env: process.env.NODE_ENV || 'development',
            app: 'glowing-pinwheel',
            ...event
        };

        // Append to JSONL file
        const line = JSON.stringify(fullEvent) + '\n';
        await fs.appendFile(IMMUNITY_FILE, line, 'utf-8');

        console.log(`[immunity] Logged ${event.type || 'event'}`);
    } catch (error) {
        // Silent fail - never break the flow
        console.error('[immunity] Failed to log event:', error instanceof Error ? error.message : error);
    }
}

