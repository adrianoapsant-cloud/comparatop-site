/**
 * Client Telemetry v1.1 - Friction Detection
 * 
 * Captura eventos leves de navegação e detecta fricção:
 * - Rage click: muitos cliques rápidos no mesmo alvo
 * - Confusion scroll: scroll yo-yo (sobe/desce rapidamente)
 */

import type { NavEvent } from './types';
import { initUiSemanticSnapshot, addNavEvent } from './ui-semantic-snapshot';

// Config
const BATCH_INTERVAL_MS = 2000;
const BATCH_MAX_SIZE = 10;
const SCROLL_THROTTLE_MS = 250;
const SCROLL_MIN_DELTA = 0.1;

// Friction detection config
const RAGE_CLICK_WINDOW_MS = 900;
const RAGE_CLICK_MIN_COUNT = 4;
const RAGE_CLICK_COOLDOWN_MS = 2000;
const CONFUSION_SCROLL_WINDOW_MS = 2200;
const CONFUSION_SCROLL_MIN_DELTA = 0.12;
const CONFUSION_SCROLL_MIN_REVERSALS = 2;
const CONFUSION_SCROLL_COOLDOWN_MS = 3000;

// State
let eventBuffer: NavEvent[] = [];
let lastScrollDepth = 0;
let scrollThrottleTimer: ReturnType<typeof setTimeout> | null = null;
let batchTimer: ReturnType<typeof setInterval> | null = null;
let initialized = false;

// Ring buffers for friction detection
interface ClickSample {
    ts: number;
    path: string;
    targetId: string;
    xBucket: number;
    yBucket: number;
}
interface ScrollSample {
    ts: number;
    depth: number;
}

const CLICKS_BUFFER_SIZE = 12;
const SCROLL_BUFFER_SIZE = 20;
let clicksBuffer: ClickSample[] = [];
let scrollBuffer: ScrollSample[] = [];

// Friction counters
let rageClicks = 0;
let confusionScrolls = 0;
let lastRageClickTime = 0;
let lastConfusionScrollTime = 0;
let frictionUpdatedAt = '';

const SESSION_KEY = 'comparatop_session_id';

/**
 * Get or create session ID (same as chat)
 */
export function getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return '';

    let sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
}

/**
 * Get friction summary for pageContextSnapshot
 */
export function getFrictionSummary(): {
    rageClicks: number;
    confusionScrolls: number;
    score: number;
    updatedAt: string;
} {
    const score = Math.min(100, rageClicks * 25 + confusionScrolls * 20);
    return {
        rageClicks,
        confusionScrolls,
        score,
        updatedAt: frictionUpdatedAt || new Date().toISOString()
    };
}

/**
 * Reset friction counters (call on page change)
 */
export function resetFriction(): void {
    rageClicks = 0;
    confusionScrolls = 0;
    frictionUpdatedAt = '';
    clicksBuffer = [];
    scrollBuffer = [];
}

/**
 * Start telemetry tracking
 */
export function startTelemetry(): void {
    if (typeof window === 'undefined' || initialized) return;
    initialized = true;

    // Init UI Semantic Snapshot
    initUiSemanticSnapshot();

    trackPageView();

    if (typeof window !== 'undefined') {
        window.addEventListener('popstate', handleRouteChange);

        let lastUrl = window.location.pathname;
        const observer = new MutationObserver(() => {
            if (window.location.pathname !== lastUrl) {
                lastUrl = window.location.pathname;
                handleRouteChange();
            }
        });
        observer.observe(document, { subtree: true, childList: true });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('click', handleClick, { capture: true });
    startBatchTimer();

    window.addEventListener('beforeunload', flushBuffer);
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            flushBuffer();
        }
    });

    console.log('[telemetry] Started with friction detection');
}

/**
 * Stop telemetry tracking
 */
export function stopTelemetry(): void {
    if (!initialized) return;

    window.removeEventListener('popstate', handleRouteChange);
    window.removeEventListener('scroll', handleScroll);
    document.removeEventListener('click', handleClick);

    if (batchTimer) clearInterval(batchTimer);
    if (scrollThrottleTimer) clearTimeout(scrollThrottleTimer);

    flushBuffer();
    initialized = false;
}

/**
 * Track page view
 */
export function trackPageView(): void {
    addEvent({
        type: 'page_view',
        ts: new Date().toISOString(),
        path: window.location.pathname
    });
}

/**
 * Get current scroll depth
 */
export function getScrollDepth(): number {
    if (typeof window === 'undefined') return 0;

    const docHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY;

    if (docHeight <= viewportHeight) return 1;

    return Math.min(1, Math.max(0, scrollY / (docHeight - viewportHeight)));
}

function handleRouteChange(): void {
    trackPageView();
    lastScrollDepth = 0;
    resetFriction();
}

function handleScroll(): void {
    if (scrollThrottleTimer) return;

    scrollThrottleTimer = setTimeout(() => {
        scrollThrottleTimer = null;

        const depth = getScrollDepth();
        const now = Date.now();

        scrollBuffer.push({ ts: now, depth });
        if (scrollBuffer.length > SCROLL_BUFFER_SIZE) {
            scrollBuffer.shift();
        }

        detectConfusionScroll(now);

        const delta = Math.abs(depth - lastScrollDepth);
        if (delta >= SCROLL_MIN_DELTA) {
            lastScrollDepth = depth;
            addEvent({
                type: 'scroll',
                ts: new Date().toISOString(),
                path: window.location.pathname,
                depth: Math.round(depth * 100) / 100
            });
        }
    }, SCROLL_THROTTLE_MS);
}

function detectConfusionScroll(now: number): void {
    if (now - lastConfusionScrollTime < CONFUSION_SCROLL_COOLDOWN_MS) return;
    if (scrollBuffer.length < 4) return;

    const windowStart = now - CONFUSION_SCROLL_WINDOW_MS;
    const recentSamples = scrollBuffer.filter(s => s.ts >= windowStart);
    if (recentSamples.length < 4) return;

    let reversals = 0;
    let lastDirection: 'up' | 'down' | null = null;

    for (let i = 1; i < recentSamples.length; i++) {
        const delta = recentSamples[i].depth - recentSamples[i - 1].depth;
        if (Math.abs(delta) < CONFUSION_SCROLL_MIN_DELTA) continue;

        const direction = delta > 0 ? 'down' : 'up';
        if (lastDirection && direction !== lastDirection) {
            reversals++;
        }
        lastDirection = direction;
    }

    if (reversals >= CONFUSION_SCROLL_MIN_REVERSALS) {
        confusionScrolls++;
        lastConfusionScrollTime = now;
        frictionUpdatedAt = new Date().toISOString();

        addEvent({
            type: 'confusion_scroll',
            ts: new Date().toISOString(),
            path: window.location.pathname,
            depth: getScrollDepth()
        });

        console.log('[telemetry] Confusion scroll detected:', confusionScrolls);
    }
}

function handleClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (!target) return;

    const now = Date.now();
    const trackable = target.closest('[data-ct]') as HTMLElement | null;

    let targetId: string;
    if (trackable?.dataset.ct) {
        targetId = `data-ct=${trackable.dataset.ct}`;
    } else {
        const role = target.getAttribute('role');
        const tag = target.tagName.toLowerCase();
        if (['button', 'a', 'input', 'select'].includes(tag) || role) {
            targetId = role ? `${tag}[role=${role}]` : tag;
        } else {
            targetId = tag;
        }
    }

    const xBucket = Math.floor(e.clientX / 80);
    const yBucket = Math.floor(e.clientY / 80);

    clicksBuffer.push({ ts: now, path: window.location.pathname, targetId, xBucket, yBucket });
    if (clicksBuffer.length > CLICKS_BUFFER_SIZE) {
        clicksBuffer.shift();
    }

    detectRageClick(now, targetId, xBucket, yBucket);

    if (targetId && !targetId.startsWith('div')) {
        addEvent({
            type: 'click',
            ts: new Date().toISOString(),
            path: window.location.pathname,
            target: targetId
        });
    }
}

function detectRageClick(now: number, targetId: string, xBucket: number, yBucket: number): void {
    if (now - lastRageClickTime < RAGE_CLICK_COOLDOWN_MS) return;

    const windowStart = now - RAGE_CLICK_WINDOW_MS;
    const recentClicks = clicksBuffer.filter(c => c.ts >= windowStart);

    if (recentClicks.length < RAGE_CLICK_MIN_COUNT) return;

    const sameTargetCount = recentClicks.filter(c => c.targetId === targetId).length;
    const sameAreaCount = recentClicks.filter(c => c.xBucket === xBucket && c.yBucket === yBucket).length;

    if (sameTargetCount >= RAGE_CLICK_MIN_COUNT || sameAreaCount >= RAGE_CLICK_MIN_COUNT) {
        rageClicks++;
        lastRageClickTime = now;
        frictionUpdatedAt = new Date().toISOString();

        addEvent({
            type: 'rage_click',
            ts: new Date().toISOString(),
            path: window.location.pathname,
            target: targetId
        });

        console.log('[telemetry] Rage click detected:', rageClicks);
    }
}

function addEvent(event: NavEvent): void {
    eventBuffer.push(event);
    if (eventBuffer.length >= BATCH_MAX_SIZE) {
        flushBuffer();
    }
}

function startBatchTimer(): void {
    batchTimer = setInterval(flushBuffer, BATCH_INTERVAL_MS);
}

function flushBuffer(): void {
    if (eventBuffer.length === 0) return;

    const events = [...eventBuffer];
    eventBuffer = [];

    const sessionId = getOrCreateSessionId();
    if (!sessionId) return;

    const payload = JSON.stringify({ sessionId, events });

    if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon('/api/immunity/ingest', blob);
    } else {
        fetch('/api/immunity/ingest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true
        }).catch(() => { });
    }
}
