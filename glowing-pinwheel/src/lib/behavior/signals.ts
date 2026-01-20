/**
 * Behavior Signals
 * 
 * Detects user confusion patterns:
 * - Dead clicks (clicks on non-interactive elements)
 * - Rage clicks (rapid repeated clicks)
 * - Back scrolls (scrolling up and down repeatedly)
 */

export interface BehaviorSignals {
    sinceMs: number;
    deadClicks: number;
    rageClicks: number;
    backScrolls: number;
    routeChanges: number;
    confusionScore: number;
    lastHint?: string;
}

// Internal state
let signals: BehaviorSignals = {
    sinceMs: 0,
    deadClicks: 0,
    rageClicks: 0,
    backScrolls: 0,
    routeChanges: 0,
    confusionScore: 0
};

let startTime = 0;
let initialized = false;
let lastClickTime = 0;
let lastClickX = 0;
let lastClickY = 0;
let clicksInWindow: number[] = [];
let lastScrollY = 0;
let lastScrollDirection: 'up' | 'down' | null = null;
let scrollDirectionChanges = 0;
let lastScrollTime = 0;
let lastPathname = '';

// Constants
const CLICK_BUCKET_SIZE = 50; // pixels
const RAGE_CLICK_WINDOW_MS = 1000;
const RAGE_CLICK_THRESHOLD = 3;
const SCROLL_CHANGE_WINDOW_MS = 500;
const THROTTLE_MS = 250;

// Listeners
let clickListener: ((e: MouseEvent) => void) | null = null;
let scrollListener: (() => void) | null = null;
let routeListener: (() => void) | null = null;
let throttleTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Check if target is interactive
 */
function isInteractive(el: Element | null): boolean {
    if (!el) return false;

    const tag = el.tagName.toLowerCase();
    if (['button', 'a', 'input', 'select', 'textarea', 'label'].includes(tag)) {
        return true;
    }

    const role = el.getAttribute('role');
    if (['button', 'link', 'tab', 'menuitem', 'option', 'checkbox', 'radio'].includes(role || '')) {
        return true;
    }

    if (el.hasAttribute('onclick') || el.hasAttribute('data-action')) {
        return true;
    }

    // Check parent (common pattern: icon inside button)
    if (el.parentElement) {
        const parentTag = el.parentElement.tagName.toLowerCase();
        if (['button', 'a'].includes(parentTag)) return true;
    }

    return false;
}

/**
 * Calculate confusion score
 */
function calculateScore(): void {
    const score = Math.min(100,
        signals.deadClicks * 8 +
        signals.rageClicks * 20 +
        signals.backScrolls * 10
    );
    signals.confusionScore = score;

    // Generate hint
    if (score >= 60) {
        if (signals.rageClicks >= 2) {
            signals.lastHint = 'muitos cliques sem resposta';
        } else if (signals.deadClicks >= 4) {
            signals.lastHint = 'clicando em áreas não interativas';
        } else if (signals.backScrolls >= 3) {
            signals.lastHint = 'navegação confusa';
        }
    } else {
        signals.lastHint = undefined;
    }
}

/**
 * Handle click events
 */
function handleClick(e: MouseEvent): void {
    const now = Date.now();
    const target = e.target as Element;

    // Dead click detection
    if (!isInteractive(target)) {
        signals.deadClicks++;
    }

    // Rage click detection (same area, rapid succession)
    const bucketX = Math.floor(e.clientX / CLICK_BUCKET_SIZE);
    const bucketY = Math.floor(e.clientY / CLICK_BUCKET_SIZE);
    const sameBucket = bucketX === Math.floor(lastClickX / CLICK_BUCKET_SIZE) &&
        bucketY === Math.floor(lastClickY / CLICK_BUCKET_SIZE);

    if (sameBucket) {
        clicksInWindow.push(now);
        // Clean old clicks
        clicksInWindow = clicksInWindow.filter(t => now - t < RAGE_CLICK_WINDOW_MS);

        if (clicksInWindow.length >= RAGE_CLICK_THRESHOLD) {
            signals.rageClicks++;
            clicksInWindow = []; // Reset
        }
    } else {
        clicksInWindow = [now];
    }

    lastClickTime = now;
    lastClickX = e.clientX;
    lastClickY = e.clientY;

    throttledUpdate();
}

/**
 * Handle scroll events
 */
function handleScroll(): void {
    const now = Date.now();
    const currentY = window.scrollY;
    const direction: 'up' | 'down' = currentY > lastScrollY ? 'down' : 'up';

    // Detect direction change
    if (lastScrollDirection && direction !== lastScrollDirection) {
        if (now - lastScrollTime < SCROLL_CHANGE_WINDOW_MS) {
            scrollDirectionChanges++;
            if (scrollDirectionChanges >= 3) {
                signals.backScrolls++;
                scrollDirectionChanges = 0;
            }
        } else {
            scrollDirectionChanges = 1;
        }
    }

    lastScrollY = currentY;
    lastScrollDirection = direction;
    lastScrollTime = now;

    throttledUpdate();
}

/**
 * Handle route changes
 */
function handleRouteChange(): void {
    if (typeof window === 'undefined') return;

    const currentPath = window.location.pathname;
    if (currentPath !== lastPathname && lastPathname !== '') {
        signals.routeChanges++;
    }
    lastPathname = currentPath;

    throttledUpdate();
}

/**
 * Throttled score update
 */
function throttledUpdate(): void {
    if (throttleTimeout) return;

    throttleTimeout = setTimeout(() => {
        signals.sinceMs = Date.now() - startTime;
        calculateScore();
        throttleTimeout = null;
    }, THROTTLE_MS);
}

/**
 * Start behavior signal collection
 */
export function startBehaviorSignals(): void {
    if (typeof window === 'undefined') return;
    if (initialized) return;

    startTime = Date.now();
    lastPathname = window.location.pathname;
    lastScrollY = window.scrollY;
    initialized = true;

    // Add listeners
    clickListener = handleClick;
    window.addEventListener('click', clickListener, { passive: true, capture: true });

    scrollListener = handleScroll;
    window.addEventListener('scroll', scrollListener, { passive: true });

    // Route change detection (for Next.js)
    routeListener = handleRouteChange;

    // Use popstate for browser back/forward
    window.addEventListener('popstate', routeListener);

    // Observe URL changes (for client-side navigation)
    const originalPushState = history.pushState.bind(history);
    history.pushState = function (...args) {
        originalPushState(...args);
        handleRouteChange();
    };
}

/**
 * Stop behavior signal collection
 */
export function stopBehaviorSignals(): void {
    if (!initialized) return;

    if (clickListener) {
        window.removeEventListener('click', clickListener, { capture: true });
    }
    if (scrollListener) {
        window.removeEventListener('scroll', scrollListener);
    }
    if (routeListener) {
        window.removeEventListener('popstate', routeListener);
    }

    initialized = false;
}

/**
 * Get current behavior signals
 */
export function getBehaviorSignals(): BehaviorSignals {
    if (!initialized) {
        return {
            sinceMs: 0,
            deadClicks: 0,
            rageClicks: 0,
            backScrolls: 0,
            routeChanges: 0,
            confusionScore: 0
        };
    }

    signals.sinceMs = Date.now() - startTime;
    calculateScore();
    return { ...signals };
}

/**
 * Reset signals (e.g., after proactive help shown)
 */
export function resetBehaviorSignals(): void {
    signals = {
        sinceMs: 0,
        deadClicks: 0,
        rageClicks: 0,
        backScrolls: 0,
        routeChanges: 0,
        confusionScore: 0
    };
    startTime = Date.now();
    clicksInWindow = [];
    scrollDirectionChanges = 0;
}

/**
 * Check if signals are actively being collected
 */
export function isSignalsActive(): boolean {
    return initialized;
}
