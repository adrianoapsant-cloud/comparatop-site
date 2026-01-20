/**
 * UI Semantic Snapshot v1
 * 
 * Captura leve de elementos interativos da UI (sem PII)
 * para ajudar o chat a diagnosticar problemas de navegação.
 */

// Types
export interface UiElement {
    ct?: string;              // data-ct
    tag: string;              // BUTTON/A/INPUT
    role?: string;
    disabled?: boolean;
    ariaDisabled?: boolean;
    ariaExpanded?: boolean;
    ariaPressed?: boolean;
    ariaSelected?: boolean;
    hrefPath?: string;        // pathname only (no query)
}

export interface NavMini {
    type: string;
    target?: string;
    ts: string;
}

export interface ErrorMini {
    kind: 'error' | 'rejection';
    name?: string;
    messageTrunc: string;
    ts: string;
}

export interface UiSemanticSnapshot {
    elements: UiElement[];
    lastNav: NavMini[];
    lastErrors: ErrorMini[];
    updatedAt: string;
}

// Config
const MAX_ELEMENTS = 30;
const MAX_NAV = 5;
const MAX_ERRORS = 5;
const THROTTLE_MS = 2000;
const MESSAGE_TRUNCATE = 120;

// State
let cachedSnapshot: UiSemanticSnapshot | null = null;
let lastSnapshotTime = 0;
let navBuffer: NavMini[] = [];
let errorBuffer: ErrorMini[] = [];
let initialized = false;

/**
 * Initialize UI Semantic Snapshot listeners
 */
export function initUiSemanticSnapshot(): void {
    if (typeof window === 'undefined' || initialized) return;
    initialized = true;

    // Error listener
    window.addEventListener('error', (e) => {
        addError({
            kind: 'error',
            name: e.error?.name,
            messageTrunc: truncateMessage(e.message || 'Unknown error'),
            ts: new Date().toISOString()
        });
    });

    // Unhandled rejection listener
    window.addEventListener('unhandledrejection', (e) => {
        const reason = e.reason;
        addError({
            kind: 'rejection',
            name: reason?.name,
            messageTrunc: truncateMessage(reason?.message || String(reason) || 'Unknown rejection'),
            ts: new Date().toISOString()
        });
    });

    console.log('[uiSnapshot] Initialized');
}

/**
 * Add a nav event to the buffer (called from client-telemetry)
 */
export function addNavEvent(event: { type: string; target?: string; ts: string }): void {
    navBuffer.push({
        type: event.type,
        target: event.target,
        ts: event.ts
    });
    if (navBuffer.length > MAX_NAV) {
        navBuffer.shift();
    }
}

/**
 * Add an error to the buffer
 */
function addError(error: ErrorMini): void {
    errorBuffer.push(error);
    if (errorBuffer.length > MAX_ERRORS) {
        errorBuffer.shift();
    }
}

/**
 * Truncate message and remove sensitive info
 */
function truncateMessage(msg: string): string {
    // Remove URLs
    let clean = msg.replace(/https?:\/\/[^\s]+/g, '[URL]');
    // Remove email-like patterns
    clean = clean.replace(/[^\s]+@[^\s]+\.[^\s]+/g, '[EMAIL]');
    // Truncate
    if (clean.length > MESSAGE_TRUNCATE) {
        clean = clean.slice(0, MESSAGE_TRUNCATE) + '...';
    }
    return clean;
}

/**
 * Get current UI Semantic Snapshot (throttled)
 */
export function getUiSemanticSnapshot(): UiSemanticSnapshot {
    const now = Date.now();

    // Return cached if within throttle window
    if (cachedSnapshot && (now - lastSnapshotTime) < THROTTLE_MS) {
        return cachedSnapshot;
    }

    // Build new snapshot
    cachedSnapshot = buildSnapshot();
    lastSnapshotTime = now;

    return cachedSnapshot;
}

/**
 * Force refresh snapshot (for opening chat)
 */
export function refreshUiSemanticSnapshot(): UiSemanticSnapshot {
    cachedSnapshot = buildSnapshot();
    lastSnapshotTime = Date.now();
    return cachedSnapshot;
}

/**
 * Build the snapshot by scanning DOM
 */
function buildSnapshot(): UiSemanticSnapshot {
    const elements: UiElement[] = [];

    if (typeof document === 'undefined') {
        return {
            elements: [],
            lastNav: [...navBuffer],
            lastErrors: [...errorBuffer],
            updatedAt: new Date().toISOString()
        };
    }

    // Priority 1: elements with data-ct
    const ctElements = document.querySelectorAll('[data-ct]');
    ctElements.forEach((el) => {
        if (elements.length >= MAX_ELEMENTS) return;
        const uiEl = extractElementData(el as HTMLElement);
        if (uiEl) elements.push(uiEl);
    });

    // Priority 2: interactive elements without data-ct
    if (elements.length < MAX_ELEMENTS) {
        const interactiveSelectors = 'button:not([data-ct]), a:not([data-ct]), [role="button"]:not([data-ct]), [role="tab"]:not([data-ct]), input:not([data-ct]), select:not([data-ct])';
        const interactiveElements = document.querySelectorAll(interactiveSelectors);

        interactiveElements.forEach((el) => {
            if (elements.length >= MAX_ELEMENTS) return;
            // Only visible elements (rough check)
            const rect = el.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;
            // Only in or near viewport
            if (rect.top > window.innerHeight * 2 || rect.bottom < -window.innerHeight) return;

            const uiEl = extractElementData(el as HTMLElement);
            if (uiEl) elements.push(uiEl);
        });
    }

    return {
        elements,
        lastNav: [...navBuffer],
        lastErrors: [...errorBuffer],
        updatedAt: new Date().toISOString()
    };
}

/**
 * Extract data from an element (NO TEXT/VALUE)
 */
function extractElementData(el: HTMLElement): UiElement | null {
    const tag = el.tagName.toUpperCase();

    const uiEl: UiElement = {
        tag,
        ct: el.dataset.ct || undefined,
        role: el.getAttribute('role') || undefined,
        disabled: el.hasAttribute('disabled') || undefined,
        ariaDisabled: el.getAttribute('aria-disabled') === 'true' || undefined,
        ariaExpanded: el.getAttribute('aria-expanded') === 'true' ? true :
            el.getAttribute('aria-expanded') === 'false' ? false : undefined,
        ariaPressed: el.getAttribute('aria-pressed') === 'true' ? true :
            el.getAttribute('aria-pressed') === 'false' ? false : undefined,
        ariaSelected: el.getAttribute('aria-selected') === 'true' ? true :
            el.getAttribute('aria-selected') === 'false' ? false : undefined
    };

    // For links, extract pathname only (NO query string)
    if (tag === 'A') {
        const href = (el as HTMLAnchorElement).href;
        if (href) {
            try {
                const url = new URL(href);
                uiEl.hrefPath = url.pathname;
            } catch {
                // Invalid URL, skip
            }
        }
    }

    // Clean undefined values
    const uiElAny = uiEl as unknown as Record<string, unknown>;
    Object.keys(uiElAny).forEach(key => {
        if (uiElAny[key] === undefined) {
            delete uiElAny[key];
        }
    });

    return Object.keys(uiEl).length > 1 ? uiEl : null; // At least tag + something
}

/**
 * Get summary for immunity logging (compact)
 */
export function getUiSnapshotSummary(): {
    hasUi: boolean;
    elementsCtSample: string[];
    disabledCt: string[];
    lastNavType?: string;
    lastNavTarget?: string;
    lastErrorsCount: number;
    frictionScore?: number;
} {
    const snapshot = cachedSnapshot || getUiSemanticSnapshot();

    const elementsWithCt = snapshot.elements.filter(e => e.ct);
    const disabledElements = snapshot.elements.filter(e => e.disabled || e.ariaDisabled);
    const lastNav = snapshot.lastNav[snapshot.lastNav.length - 1];

    return {
        hasUi: snapshot.elements.length > 0,
        elementsCtSample: elementsWithCt.slice(0, 10).map(e => e.ct!),
        disabledCt: disabledElements.filter(e => e.ct).map(e => e.ct!),
        lastNavType: lastNav?.type,
        lastNavTarget: lastNav?.target,
        lastErrorsCount: snapshot.lastErrors.length
    };
}
