/**
 * AffiliateClickInterceptor.tsx
 * 
 * Global interceptor that captures ALL affiliate link clicks site-wide.
 * 
 * Instead of modifying 10+ individual components, this component uses
 * event delegation on the document to catch any click on <a rel="sponsored">
 * and fire a Telegram notification via sendBeacon.
 * 
 * Pattern inspired by AFERIO2.0's track.ts event system.
 * 
 * Mount this ONCE in the root layout.
 */

'use client';

import { useEffect } from 'react';

const ENDPOINT = '/api/track/affiliate-click';

function extractMarketplace(href: string): string {
    if (!href) return 'unknown';
    if (href.includes('amazon.com')) return 'Amazon';
    if (href.includes('mercadolivre.com') || href.includes('mercadolibre.com')) return 'Mercado Livre';
    if (href.includes('shopee.com')) return 'Shopee';
    if (href.includes('magazinevoce.com') || href.includes('magazineluiza.com') || href.includes('magalu')) return 'Magazine Luiza';
    return 'Outro';
}

function extractProductName(): string {
    // Try to get product name from the page's h1
    const h1 = document.querySelector('h1');
    if (h1?.textContent) return h1.textContent.trim().slice(0, 200);
    // Fallback: use document title
    return document.title.replace(' | ComparaTop', '').trim().slice(0, 200);
}

export function AffiliateClickInterceptor() {
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            // Walk up from the clicked element to find the nearest <a>
            const target = (e.target as HTMLElement)?.closest?.('a');
            if (!target) return;

            // Check if the link has rel="sponsored" (our marker for affiliate links)
            const rel = target.getAttribute('rel') || '';
            if (!rel.includes('sponsored')) return;

            const href = target.href || '';
            const marketplace = extractMarketplace(href);
            const product = extractProductName();
            const page = window.location.pathname;

            const payload = JSON.stringify({
                product,
                marketplace,
                page,
                ts: Date.now(),
            });

            // Send via sendBeacon (most reliable — survives navigation)
            if (navigator.sendBeacon) {
                navigator.sendBeacon(ENDPOINT, payload);
            } else {
                // Fallback: fetch with keepalive
                try {
                    fetch(ENDPOINT, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: payload,
                        keepalive: true,
                    }).catch(() => {});
                } catch { /* noop */ }
            }
        }

        // Use capture phase to ensure we catch clicks before any preventDefault
        document.addEventListener('click', handleClick, true);
        return () => document.removeEventListener('click', handleClick, true);
    }, []);

    return null; // This component renders nothing — it's purely behavioral
}
