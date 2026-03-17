/**
 * trackAffiliateClick.ts — ComparaTop Affiliate Click Tracker
 *
 * Copied from AFERIO2.0's track.ts pattern:
 * - sendBeacon for fire-and-forget (survives page unload)
 * - Immediate flush (no batching needed since it's a single event)
 * - Falls back to fetch if sendBeacon unavailable
 */

const ENDPOINT = '/api/track/affiliate-click';

export function trackAffiliateClick(product: string, marketplace: string): void {
    if (typeof window === 'undefined') return;

    const payload = JSON.stringify({
        product,
        marketplace,
        page: window.location.pathname,
        ts: Date.now(),
    });

    // AFERIO pattern: sendBeacon first, fetch fallback
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const sent = navigator.sendBeacon(ENDPOINT, payload);
        if (sent) return;
    }

    // Fallback: fetch with keepalive
    try {
        fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true,
        }).catch(() => {});
    } catch {
        /* noop — tracking should never break UX */
    }
}
