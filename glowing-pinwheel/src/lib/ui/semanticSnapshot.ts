/**
 * Semantic UI Snapshot
 * 
 * Collects a compact, PII-free snapshot of the current page state
 * for context-aware chat responses.
 */

// Types
export interface UiElement {
    kind: "button" | "link" | "input" | "select" | "checkbox" | "radio" | "tab" | "modal" | "toast" | "badge";
    label?: string;
    role?: string;
    disabled?: boolean;
    visible?: boolean;
    valueState?: "empty" | "filled" | "unknown";
    hint?: string;
    idHint?: string;
}

export interface UiSnapshot {
    url: string;
    title?: string;
    viewport: { w: number; h: number };
    pageContext?: {
        categorySlug?: string;
        productId?: string;
        isChat?: boolean;
    };
    elements: UiElement[];
    notices?: string[];
    bytesEstimate?: number;
}

// Constants
const MAX_ELEMENTS = 140;
const MAX_LABEL_LENGTH = 60;
const MAX_BYTES = 8 * 1024; // 8KB
const SENSITIVE_INPUT_TYPES = ['email', 'tel', 'password', 'search', 'number'];
const NOTICE_PATTERNS = [
    /sem\s*resultado/i,
    /nenhum\s*(produto|resultado|item)/i,
    /n[aã]o\s*encontr/i,
    /erro/i,
    /inv[aá]lido/i,
    /carregando/i,
    /aguarde/i,
    /falha/i,
    /desculpe/i
];

/**
 * Truncate string to max length
 */
function truncate(str: string, max: number): string {
    if (!str) return '';
    const cleaned = str.replace(/\s+/g, ' ').trim();
    return cleaned.length > max ? cleaned.slice(0, max - 3) + '...' : cleaned;
}

/**
 * Get element's accessible label
 */
function getLabel(el: Element): string | undefined {
    const ariaLabel = el.getAttribute('aria-label');
    if (ariaLabel) return truncate(ariaLabel, MAX_LABEL_LENGTH);

    const title = el.getAttribute('title');
    if (title) return truncate(title, MAX_LABEL_LENGTH);

    const text = el.textContent?.trim();
    if (text && text.length < 100) return truncate(text, MAX_LABEL_LENGTH);

    return undefined;
}

/**
 * Get element kind from tag/role
 */
function getKind(el: Element): UiElement['kind'] | null {
    const tag = el.tagName.toLowerCase();
    const role = el.getAttribute('role');

    if (role === 'button' || tag === 'button') return 'button';
    if (role === 'link' || tag === 'a') return 'link';
    if (role === 'tab') return 'tab';
    if (role === 'dialog' || role === 'modal') return 'modal';
    if (role === 'alert' || role === 'status') return 'toast';

    if (tag === 'input') {
        const type = (el as HTMLInputElement).type;
        if (type === 'checkbox') return 'checkbox';
        if (type === 'radio') return 'radio';
        return 'input';
    }

    if (tag === 'select') return 'select';
    if (tag === 'textarea') return 'input';

    if (el.classList.contains('badge') || el.getAttribute('data-badge')) return 'badge';

    return null;
}

/**
 * Check if element is visible in viewport
 */
function isVisible(el: Element): boolean {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return false;
    return (
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.right > 0
    );
}

/**
 * Get value state for input (without leaking actual value)
 */
function getValueState(el: Element): UiElement['valueState'] {
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
        return el.value.length > 0 ? 'filled' : 'empty';
    }
    if (el instanceof HTMLSelectElement) {
        return el.selectedIndex > 0 ? 'filled' : 'empty';
    }
    return 'unknown';
}

/**
 * Get hint (placeholder) without PII
 */
function getHint(el: Element): string | undefined {
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
        const type = (el as HTMLInputElement).type || '';

        // Don't expose hints for sensitive fields
        if (SENSITIVE_INPUT_TYPES.includes(type)) {
            return `[${type}]`;
        }

        const placeholder = el.placeholder;
        if (placeholder) return truncate(placeholder, 40);
    }
    return undefined;
}

/**
 * Extract page context from URL
 */
function getPageContext(): UiSnapshot['pageContext'] {
    const path = window.location.pathname;
    const context: UiSnapshot['pageContext'] = {};

    // Category pages: /categorias/smart-tvs
    const categoryMatch = path.match(/\/categorias?\/([\w-]+)/);
    if (categoryMatch) {
        context.categorySlug = categoryMatch[1];
    }

    // Product pages: /produto/samsung-qn90c-65
    const productMatch = path.match(/\/produtos?\/([\w-]+)/);
    if (productMatch) {
        context.productId = productMatch[1];
    }

    // Chat page
    if (path.includes('/chat')) {
        context.isChat = true;
    }

    return Object.keys(context).length > 0 ? context : undefined;
}

/**
 * Find notice elements (error messages, no results, etc.)
 */
function findNotices(): string[] {
    const notices: string[] = [];
    const maxNotices = 5;

    // Check common notice containers
    const candidates = document.querySelectorAll(
        '[role="alert"], [role="status"], .error, .warning, .notice, .empty-state, .no-results, [data-notice]'
    );

    for (const el of candidates) {
        if (notices.length >= maxNotices) break;
        const text = el.textContent?.trim();
        if (text && text.length < 100) {
            notices.push(truncate(text, 80));
        }
    }

    // Also scan for text patterns indicating issues
    if (notices.length < maxNotices) {
        const allText = document.body.innerText;
        for (const pattern of NOTICE_PATTERNS) {
            if (notices.length >= maxNotices) break;
            const match = allText.match(pattern);
            if (match && !notices.some(n => n.includes(match[0]))) {
                notices.push(`[texto detectado: "${match[0]}"]`);
            }
        }
    }

    return notices;
}

/**
 * Build semantic UI snapshot
 */
export function buildUiSnapshot(): UiSnapshot {
    if (typeof window === 'undefined') {
        return {
            url: '',
            viewport: { w: 0, h: 0 },
            elements: []
        };
    }

    const snapshot: UiSnapshot = {
        url: window.location.pathname + window.location.search,
        title: document.title ? truncate(document.title, 60) : undefined,
        viewport: {
            w: window.innerWidth,
            h: window.innerHeight
        },
        pageContext: getPageContext(),
        elements: [],
        notices: []
    };

    // Collect interactive elements
    const selectors = [
        'button',
        'a[href]',
        'input',
        'select',
        'textarea',
        '[role="button"]',
        '[role="link"]',
        '[role="tab"]',
        '[role="checkbox"]',
        '[role="radio"]',
        '[aria-disabled]',
        '[data-testid]'
    ];

    const elements = document.querySelectorAll(selectors.join(','));
    let bytesEstimate = JSON.stringify(snapshot).length;

    for (const el of elements) {
        if (snapshot.elements.length >= MAX_ELEMENTS) break;
        if (bytesEstimate > MAX_BYTES - 500) break;

        const kind = getKind(el);
        if (!kind) continue;

        const visible = isVisible(el);
        // Skip invisible elements (but keep a few for context)
        if (!visible && snapshot.elements.filter(e => !e.visible).length > 20) continue;

        const uiEl: UiElement = {
            kind,
            label: getLabel(el),
            disabled: el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true',
            visible
        };

        // Add role if meaningful
        const role = el.getAttribute('role');
        if (role && role !== kind) {
            uiEl.role = role;
        }

        // Add value state for inputs
        if (kind === 'input' || kind === 'select' || kind === 'checkbox' || kind === 'radio') {
            uiEl.valueState = getValueState(el);
            uiEl.hint = getHint(el);
        }

        // Add id hint for debugging (truncated)
        const id = el.id;
        if (id) {
            uiEl.idHint = truncate(id, 30);
        }

        snapshot.elements.push(uiEl);
        bytesEstimate += JSON.stringify(uiEl).length;
    }

    // Find notices
    snapshot.notices = findNotices();
    snapshot.bytesEstimate = bytesEstimate;

    return snapshot;
}

/**
 * Convert snapshot to text summary for system prompt
 */
export function snapshotToText(snapshot: UiSnapshot): string {
    const lines: string[] = [];

    lines.push(`Página: ${snapshot.url}`);
    if (snapshot.title) lines.push(`Título: ${snapshot.title}`);

    // Notices (most important)
    if (snapshot.notices && snapshot.notices.length > 0) {
        lines.push(`\nAvisos na tela:`);
        snapshot.notices.slice(0, 5).forEach(n => lines.push(`  - ${n}`));
    }

    // Disabled buttons/actions
    const disabledEls = snapshot.elements.filter(e => e.disabled && e.visible);
    if (disabledEls.length > 0) {
        lines.push(`\nElementos desabilitados (${disabledEls.length}):`);
        disabledEls.slice(0, 5).forEach(e => {
            lines.push(`  - ${e.kind}: "${e.label || 'sem label'}"`);
        });
    }

    // Empty inputs
    const emptyInputs = snapshot.elements.filter(
        e => e.visible && e.valueState === 'empty' && (e.kind === 'input' || e.kind === 'select')
    );
    if (emptyInputs.length > 0 && emptyInputs.length <= 5) {
        lines.push(`\nCampos vazios:`);
        emptyInputs.forEach(e => {
            lines.push(`  - ${e.hint || e.label || e.kind}`);
        });
    }

    // Key interactive elements summary
    const buttons = snapshot.elements.filter(e => e.kind === 'button' && e.visible && !e.disabled);
    const links = snapshot.elements.filter(e => e.kind === 'link' && e.visible);

    if (buttons.length > 0) {
        lines.push(`\nBotões ativos: ${buttons.slice(0, 8).map(b => `"${b.label || '?'}"`).join(', ')}`);
    }

    return lines.join('\n');
}
