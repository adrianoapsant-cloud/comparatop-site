/**
 * POST /api/ev/ac
 *
 * Receives affiliate click events and sends Telegram notification.
 *
 * NOTE: This endpoint uses an obfuscated path (/ev/ac) instead of
 * /track/affiliate-click to bypass ad-blocker filter lists that
 * target keywords like "track", "affiliate", and "click".
 *
 * IMPORTANT: navigator.sendBeacon sends with Content-Type: text/plain
 * when the payload is a plain string. We must handle both text/plain
 * and application/json Content-Types.
 */

import { NextRequest, NextResponse } from 'next/server';
import { notifyAffiliateClick } from '@/lib/notifications/telegram';

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        // sendBeacon sends text/plain, regular fetch sends application/json
        // Handle both by reading raw text first, then parsing
        const rawText = await req.text();
        let body: Record<string, unknown>;

        try {
            body = JSON.parse(rawText);
        } catch {
            return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
        }

        const product = typeof body.product === 'string' ? body.product.slice(0, 200) : '';
        const marketplace = typeof body.marketplace === 'string' ? body.marketplace.slice(0, 50) : '';
        const page = typeof body.page === 'string' ? body.page.slice(0, 200) : undefined;

        if (!product || !marketplace) {
            return NextResponse.json({ ok: false, error: 'missing fields' }, { status: 400 });
        }

        console.log(`[AFFILIATE TRACK] Product: ${product}, Store: ${marketplace}, Page: ${page}`);

        // Fire-and-forget Telegram notification
        notifyAffiliateClick({ product, marketplace, page }).catch((err) => {
            console.error('[AFFILIATE TRACK] Telegram error:', err);
        });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('[AFFILIATE TRACK] Error:', err);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
