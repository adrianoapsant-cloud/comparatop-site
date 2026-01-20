/**
 * Digital Immunity v1 - Types
 * 
 * Observabilidade do chat com Dual-Stream logging:
 * - Hot path: stream pro usuário (TTFT crítico)
 * - Cold path: log assíncrono via onFinish (não impacta UX)
 */

export interface ImmunityEvent {
    // Metadata
    ts: string;                    // ISO timestamp
    env: 'development' | 'production' | 'preview';
    app: 'glowing-pinwheel';
    requestId: string;

    // Session
    sessionId: string;
    analyticsSessionId?: string;   // PostHog session ID (session handshake)

    // Page Context
    page?: {
        url?: string;
        route?: string;
        categorySlug?: string;
        filters?: Record<string, string>;
    };

    // Chat Data (optional for nav events)
    chat?: {
        userMessage: string;
        assistantText: string;
        intents: {
            catalog?: boolean;
            comparison?: boolean;
            details?: boolean;
            budget?: boolean;
            manual?: boolean;
        };
        mode: 'deterministic' | 'llm';
        catalogSnapshot?: {
            count: number;
            focusIds: string[];
            updatedAt?: string;
            lastResultsIds?: string[];  // Only IDs to reduce payload
        };
        // Category Resolver telemetry
        activeCategorySlug?: string;
        categorySource?: 'page' | 'persisted' | 'text_infer' | 'none';
        candidateCountBefore?: number;
        candidateCountAfter?: number;
    };

    // LLM (if applicable)
    llm?: {
        provider: 'google';
        model: string;
        finishReason?: string;
        usage?: {
            promptTokens?: number;
            completionTokens?: number;
            totalTokens?: number;
        };
        cost?: {
            usd: number | null;
            source: 'env' | 'unset_env' | 'error';
            breakdown?: {
                inputCost: number;
                outputCost: number;
            };
        };
    };

    // Tools (if applicable)
    tools?: Array<{
        name: string;
        params?: Record<string, unknown>;
        resultSummary?: string;  // Short summary, not full payload
    }>;

    // Errors (if any)
    errors?: {
        name: string;
        message: string;
        stack?: string;
    };

    // Performance
    latency?: {
        totalMs: number;
        ttftMs?: number;  // Time to first token
    };

    // Safety (Guardião Digital)
    safety?: {
        level: 'none' | 'watch' | 'high';
        reason?: string;
        ethicalBrake: boolean;
        userTextRedacted?: string;
    };

    // Navigation Events (for nav type)
    nav?: {
        type: 'page_view' | 'scroll' | 'click' | 'rage_click' | 'confusion_scroll';
        path: string;
        depth?: number;      // scroll depth 0..1
        target?: string;     // click target (data-ct or tagName)
    };

    // Page Context (for chat correlation)
    pageContext?: {
        path: string;
        categorySlug?: string;
        section?: string;
        filters?: Record<string, string | string[]>;
        visibleSkus?: string[];
        scrollDepth?: number;
    };

    // Friction Summary (agregado)
    friction?: {
        rageClicks: number;
        confusionScrolls: number;
        score: number;
        updatedAt?: string;
    };

    // Intents detectadas no chat
    intents?: {
        catalog?: boolean;
        budget?: boolean;
        compare?: boolean;
        details?: boolean;
        manual?: boolean;
        llm?: boolean;       // Caiu no LLM fallback
        multi?: boolean;     // Foi multi-intent
        uiHelp?: boolean;    // Diagnóstico de navegação/UI
    };

    // Question hash (para correlação sem armazenar texto cru)
    questionHash?: string;

    // UI Snapshot summary for diagnostics (sem PII)
    uiSnapshot?: {
        hasUi: boolean;
        elementsCtSample: (string | undefined)[];
        disabledCt: (string | undefined)[];
        lastNavType?: string;
        lastNavTarget?: string;
        lastErrorsCount: number;
    };
}

// Event type discriminator
export type ImmunityEventType = 'chat' | 'nav';

// Helper type for building events
export type PartialImmunityEvent = Partial<ImmunityEvent> & {
    requestId: string;
    sessionId: string;
} & (
        | { chat: ImmunityEvent['chat'] }
        | { nav: ImmunityEvent['nav'] }
    );

// Navigation event for client-side batching
export interface NavEvent {
    type: 'page_view' | 'scroll' | 'click' | 'rage_click' | 'confusion_scroll';
    ts: string;
    path: string;
    depth?: number;
    target?: string;
}

// Friction summary for pageContextSnapshot
export interface FrictionSummary {
    rageClicks: number;
    confusionScrolls: number;
    score: number;
    updatedAt: string;
}

// UI Semantic Snapshot types
export interface UiElementMini {
    ct?: string;
    tag: string;
    role?: string;
    disabled?: boolean;
    ariaDisabled?: boolean;
    hrefPath?: string;
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

export interface UiSemanticSnapshotPayload {
    elements: UiElementMini[];
    lastNav: NavMini[];
    lastErrors: ErrorMini[];
    updatedAt: string;
}

// Page Context Snapshot for chat
export interface PageContextSnapshot {
    path: string;
    categorySlug?: string;
    activeCategorySlug?: string;  // Persisted category for /chat route
    section?: string;
    filters?: Record<string, string | string[]>;
    visibleSkus?: string[];
    scrollDepth?: number;
    friction?: FrictionSummary;
    ui?: UiSemanticSnapshotPayload;
    updatedAt: string;
}
