"use client";

import { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import { buildUiSnapshot, type UiSnapshot } from '@/lib/ui/semanticSnapshot';
import { getBehaviorSignals, startBehaviorSignals, type BehaviorSignals } from '@/lib/behavior/signals';
import { startTelemetry, getScrollDepth, getFrictionSummary } from '@/lib/immunity/client-telemetry';
import { refreshUiSemanticSnapshot, type UiSemanticSnapshot } from '@/lib/immunity/ui-semantic-snapshot';
import type { PageContextSnapshot } from '@/lib/immunity/types';

// Session ID for persistent chat history
const SESSION_KEY = "comparatop_chat_session";
const LAYOUT_MODE_KEY = "comparatop_chat_layout";
const ACTIVE_CATEGORY_KEY = "ct_active_category_slug";

// ============================================
// CATEGORY PERSISTENCE HELPERS
// ============================================

/**
 * Get persisted active category slug from localStorage
 */
export function getActiveCategorySlug(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACTIVE_CATEGORY_KEY);
}

/**
 * Set active category slug in localStorage
 */
export function setActiveCategorySlug(slug: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACTIVE_CATEGORY_KEY, slug);
}

/**
 * Clear active category slug from localStorage
 */
export function clearActiveCategorySlug(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACTIVE_CATEGORY_KEY);
}

// ============================================
// HOTFIX: Toggle para diagnóstico do snapshot
// ============================================
const USE_SNAPSHOT = true; // Set to false to disable snapshot for debugging
const MAX_SNAPSHOT_ITEMS = 8;

// Build normalized, 100% serializable snapshot
interface SafeSnapshotItem {
    id: string;
    name: string;
    brand: string;
    category: string;
    price: number;
    score: number;
}

interface SafeCatalogSnapshot {
    lastResults: SafeSnapshotItem[];
    focusIds: string[];
    updatedAt: string;
}

function buildCatalogSnapshot(
    products: Array<{ id?: string; name?: string; brand?: string; category?: string; price?: number; score?: number }>
): SafeCatalogSnapshot | undefined {
    if (!Array.isArray(products) || products.length === 0) return undefined;

    // Normalize to primitive types only, max 8 items
    const lastResults: SafeSnapshotItem[] = products
        .slice(0, MAX_SNAPSHOT_ITEMS)
        .map(p => ({
            id: String(p.id ?? ''),
            name: String(p.name ?? '').slice(0, 100),
            brand: String(p.brand ?? '').slice(0, 50),
            category: String(p.category ?? 'unknown').slice(0, 30),
            price: Number(p.price) || 0,
            score: Number(p.score) || 0
        }))
        .filter(p => p.id && p.name); // Filter out empty items

    if (lastResults.length === 0) return undefined;

    // focusIds = top 2 by score (product IDs, not brand/name)
    const focusIds = [...lastResults]
        .sort((a, b) => b.score - a.score)
        .slice(0, 2)
        .map(p => p.id);

    return {
        lastResults,
        focusIds,
        updatedAt: new Date().toISOString()
    };
}

interface ProductCardData {
    __ui: "product_card";
    id: string;
    name: string;
    brand: string;
    price: number;
    priceFormatted: string;
    score: number;
    internalUrl: string;
    amazonUrl: string;
}

interface BundleProduct {
    id: string;
    name: string;
    brand: string;
    price: number;
    priceFormatted: string;
}

interface BundleCardData {
    __ui: "bundle_card";
    bundleType: 'deficiency_fix' | 'experience_boost';
    bundleName: string;
    weakness: string;
    mainProduct: BundleProduct;
    accessory: BundleProduct;
    totalPrice: number;
    totalPriceFormatted: string;
    accessoryPercentage: number;
    amazonUrl: string;
}

type UIComponentData = ProductCardData | BundleCardData;

interface Message {
    role: "user" | "assistant";
    content: string;
    uiComponents?: UIComponentData[];
}

// Product context for AI to use
export interface ProductContext {
    id: string;
    name: string;
    brand: string;
    category: string;
    price?: number;
    score?: number;
    energyKwh?: number;
}

// Catalog Snapshot for follow-up questions
export interface CatalogSnapshot {
    lastResults: Array<{
        id: string;
        name: string;
        price: number;
        score: number;
        category: string;
    }>;
    focusIds: string[];  // Top 2 by score
    updatedAt: string;
}

// Layout modes for the chat
export type ChatLayoutMode = "closed" | "overlay" | "split" | "focus";

interface ChatContextType {
    // Session
    sessionId: string;

    // Layout State
    layoutMode: ChatLayoutMode;
    setLayoutMode: (mode: ChatLayoutMode) => void;

    // Derived state
    isOpen: boolean;
    isSplit: boolean;

    // Messages State
    messages: Message[];
    isLoading: boolean;

    // Catalog Snapshot (for follow-up questions)
    catalogSnapshot: CatalogSnapshot | null;

    // Actions
    openOverlay: () => void;
    openSplit: () => void;
    openFocus: () => void;
    close: () => void;
    toggleSplit: () => void;
    sendMessage: (text: string) => Promise<void>;
    openWithQuery: (query: string) => void;
    clearMessages: () => void;

    // Product Context
    productContext: ProductContext | null;
    setProductContext: (product: ProductContext | null) => void;

    // Catalog Snapshot from store pages
    updateCatalogSnapshot: (products: CatalogSnapshot['lastResults']) => void;

    // Navigation
    lastVisitedPage: string;
    setLastVisitedPage: (page: string) => void;

    // Safety (Guardião Digital)
    ethicalBrake: boolean;
    safetyLevel: 'none' | 'watch' | 'high';
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
    // Session persistence
    const [sessionId, setSessionId] = useState<string>("");
    const [lastVisitedPage, setLastVisitedPage] = useState<string>("/");

    // Layout mode
    const [layoutMode, setLayoutModeState] = useState<ChatLayoutMode>("closed");

    // Chat state
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // External catalog snapshot (from store pages)
    const externalSnapshotRef = useRef<CatalogSnapshot | null>(null);
    const [snapshotVersion, setSnapshotVersion] = useState(0);
    const [productContext, setProductContext] = useState<ProductContext | null>(null);

    // Derived states
    const isOpen = layoutMode !== "closed";
    const isSplit = layoutMode === "split";

    // Safety state (Guardião Digital)
    const [ethicalBrake, setEthicalBrake] = useState(false);
    const [safetyLevel, setSafetyLevel] = useState<'none' | 'watch' | 'high'>('none');

    // Initialize session on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            let storedSession = localStorage.getItem(SESSION_KEY);
            if (!storedSession) {
                storedSession = uuidv4();
                localStorage.setItem(SESSION_KEY, storedSession);
            }
            setSessionId(storedSession);

            // Load stored messages for this session
            const storedMessages = localStorage.getItem(`chat_messages_${storedSession}`);
            if (storedMessages) {
                try {
                    setMessages(JSON.parse(storedMessages));
                } catch (e) {
                    console.error("Failed to parse stored messages", e);
                }
            }

            // Initialize behavior signals for confusion detection
            startBehaviorSignals();

            // Initialize navigation telemetry
            startTelemetry();
        }
    }, []);

    // Persist messages when they change
    useEffect(() => {
        if (sessionId && messages.length > 0) {
            localStorage.setItem(`chat_messages_${sessionId}`, JSON.stringify(messages));
        }
    }, [messages, sessionId]);

    // Auto-set active category when on /categorias/[slug]
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const pathname = window.location.pathname;
        const categoryMatch = pathname.match(/\/categorias\/([^/]+)/);

        if (categoryMatch?.[1]) {
            const slug = categoryMatch[1];
            // Only set if different from current
            if (getActiveCategorySlug() !== slug) {
                setActiveCategorySlug(slug);
                console.log(`[chat] Auto-set activeCategorySlug: ${slug}`);
            }
        }
    }, []); // Run once on mount

    // Layout mode setters
    const setLayoutMode = useCallback((mode: ChatLayoutMode) => {
        setLayoutModeState(mode);
    }, []);

    const openOverlay = useCallback(() => setLayoutModeState("overlay"), []);
    const openSplit = useCallback(() => setLayoutModeState("split"), []);
    const openFocus = useCallback(() => setLayoutModeState("focus"), []);
    const close = useCallback(() => setLayoutModeState("closed"), []);

    const toggleSplit = useCallback(() => {
        setLayoutModeState(prev => prev === "split" ? "overlay" : "split");
    }, []);

    const clearMessages = useCallback(() => {
        setMessages([]);
        if (sessionId) {
            localStorage.removeItem(`chat_messages_${sessionId}`);
        }
    }, [sessionId]);

    // Update catalog snapshot from store pages (category listings)
    const updateCatalogSnapshot = useCallback((products: CatalogSnapshot['lastResults']) => {
        if (products.length === 0) return;

        const focusIds = [...products]
            .sort((a, b) => b.score - a.score)
            .slice(0, 2)
            .map(p => p.id);

        externalSnapshotRef.current = {
            lastResults: products,
            focusIds,
            updatedAt: new Date().toISOString()
        };
        setSnapshotVersion(v => v + 1); // Trigger re-render for badge
    }, []);

    const sendMessage = useCallback(async (text: string) => {
        if (!text.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: text };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setIsLoading(true);

        // Priority 1: Use external snapshot from store pages (if available)
        // Priority 2: Build from product cards in chat messages
        let catalogSnapshotPayload: SafeCatalogSnapshot | undefined = undefined;

        if (USE_SNAPSHOT) {
            if (externalSnapshotRef.current && externalSnapshotRef.current.lastResults.length > 0) {
                // Use external snapshot from category page
                catalogSnapshotPayload = buildCatalogSnapshot(
                    externalSnapshotRef.current.lastResults.map(p => ({
                        ...p,
                        brand: p.name.split(' ')[0] // Extract brand from name
                    }))
                );
            } else {
                // Fallback: Build from product cards in messages
                const productCards = messages
                    .flatMap(m => m.uiComponents || [])
                    .filter((c): c is ProductCardData => c.__ui === "product_card");

                if (productCards.length > 0) {
                    catalogSnapshotPayload = buildCatalogSnapshot(
                        productCards.map(p => ({
                            id: p.id,
                            name: p.name,
                            brand: p.brand,
                            category: 'tv',
                            price: p.price,
                            score: p.score
                        }))
                    );
                }
            }
        }

        // Build payload for logging and sending
        // Session Handshake: include analytics IDs if available
        const analyticsIds: { posthogDistinctId?: string; posthogSessionId?: string } = {};
        try {
            // @ts-expect-error - PostHog may not be loaded
            if (typeof window !== 'undefined' && window.posthog) {
                // @ts-expect-error - PostHog types
                const distinctId = window.posthog.get_distinct_id?.();
                if (distinctId) analyticsIds.posthogDistinctId = distinctId;

                // @ts-expect-error - PostHog types
                const sessionId = window.posthog.get_session_id?.();
                if (sessionId) analyticsIds.posthogSessionId = sessionId;
            }
        } catch {
            // PostHog not available, ignore
        }

        // Read region from localStorage (same pattern as sessionId)
        const REGION_KEY = "comparatop_user_region";
        const stateCode = typeof window !== 'undefined'
            ? (localStorage.getItem(REGION_KEY) || 'SP')
            : 'SP';

        // Build uiSnapshot if feature flag enabled
        const uiSnapshotEnabled = typeof window !== 'undefined' &&
            process.env.NEXT_PUBLIC_CHAT_UI_SNAPSHOT === '1';
        let uiSnapshot: UiSnapshot | undefined;
        if (uiSnapshotEnabled) {
            try {
                uiSnapshot = buildUiSnapshot();
            } catch (e) {
                console.warn('[chat] Failed to build UI snapshot:', e);
            }
        }

        // Get behavior signals (always, lightweight)
        const behaviorSignals = getBehaviorSignals();

        // Build pageContextSnapshot
        let pageContextSnapshot: PageContextSnapshot | undefined;
        try {
            const pathname = window.location.pathname;
            // Extract category from route /categorias/[slug]
            const categoryMatch = pathname.match(/\/categorias\/([^/]+)/);
            const categorySlug = categoryMatch?.[1] || undefined;

            // Get persisted active category (for /chat route)
            const activeCategorySlug = getActiveCategorySlug() || undefined;

            // Determine section based on scroll depth
            const scrollDepth = getScrollDepth();
            let section: string | undefined;
            if (scrollDepth < 0.25) section = 'Topo';
            else if (scrollDepth < 0.6) section = 'Destaque';
            else section = 'Todos';

            // Get visible skus from catalogSnapshot
            const visibleSkus = catalogSnapshotPayload?.lastResults
                ?.slice(0, 8)
                ?.map(p => p.id)
                ?.filter(Boolean) as string[] | undefined;

            pageContextSnapshot = {
                path: pathname,
                categorySlug,
                activeCategorySlug,  // <-- Persisted category for /chat route
                section,
                visibleSkus,
                scrollDepth: Math.round(scrollDepth * 100) / 100,
                friction: getFrictionSummary(),
                ui: refreshUiSemanticSnapshot(),
                updatedAt: new Date().toISOString()
            } as PageContextSnapshot;
        } catch (e) {
            console.warn('[chat] Failed to build pageContextSnapshot:', e);
        }

        const payload = {
            messages: updatedMessages.map(m => ({
                role: m.role,
                content: m.content
            })),
            catalogSnapshot: catalogSnapshotPayload,
            pageContextSnapshot,
            sessionId,
            analytics: Object.keys(analyticsIds).length > 0 ? analyticsIds : undefined,
            region: { stateCode },
            uiSnapshot: uiSnapshotEnabled ? uiSnapshot : undefined,
            behaviorSignals: behaviorSignals.sinceMs > 0 ? behaviorSignals : undefined
        };

        // Log payload size for debugging
        const payloadBytes = new TextEncoder().encode(JSON.stringify(payload)).length;
        console.log(
            "[chat] payload bytes:", payloadBytes,
            "| snapshot items:", catalogSnapshotPayload?.lastResults?.length ?? 0,
            "| focusIds:", catalogSnapshotPayload?.focusIds ?? [],
            "| USE_SNAPSHOT:", USE_SNAPSHOT
        );

        // Warn if payload is too large
        if (payloadBytes > 100000) {
            console.warn("[chat] Payload too large! Consider reducing snapshot items.");
        }

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to get response");
            if (!response.body) throw new Error("Response sem body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = "";
            let buffer = "";
            const uiComponents: UIComponentData[] = [];
            let streamDone = false;

            setMessages(prev => [...prev, { role: "assistant", content: "" }]);

            while (!streamDone) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                // Processa linhas completas (padrão ouro para protocolo por linhas)
                let nlIndex;
                while ((nlIndex = buffer.indexOf("\n")) >= 0) {
                    const line = buffer.slice(0, nlIndex).trimEnd();
                    buffer = buffer.slice(nlIndex + 1);

                    if (!line) continue;

                    const prefix = line[0];
                    const sep = line[1];
                    if (sep !== ":") continue;

                    const payload = line.slice(2);

                    // 0: texto
                    if (prefix === "0") {
                        try {
                            const textContent = JSON.parse(payload);
                            if (typeof textContent === "string" && textContent) {
                                assistantMessage += textContent;
                            }
                        } catch (e) {
                            console.error("[Chat] Parse 0: error:", e);
                        }
                        continue;
                    }

                    // 9: UI component or guard event
                    if (prefix === "9") {
                        try {
                            const uiData = JSON.parse(payload);

                            // Guard event (Guardião Digital)
                            if (uiData.type === "guard") {
                                if (uiData.ethicalBrake) {
                                    setEthicalBrake(true);
                                }
                                if (uiData.safetyLevel) {
                                    setSafetyLevel(uiData.safetyLevel);
                                }
                                continue;
                            }

                            if (uiData.__ui === "product_card" || uiData.__ui === "bundle_card") {
                                uiComponents.push(uiData);
                            }
                        } catch (e) {
                            console.error("[Chat] Parse 9: error:", e);
                        }
                        continue;
                    }

                    // d: finish
                    if (prefix === "d") {
                        streamDone = true;
                        break;
                    }
                }

                // Atualiza UI a cada chunk
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = {
                        role: "assistant",
                        content: assistantMessage,
                        uiComponents: uiComponents.length > 0 ? [...uiComponents] : undefined
                    };
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente."
            }]);
        } finally {
            setIsLoading(false);
        }
    }, [messages, isLoading]);

    const openWithQuery = useCallback((query: string) => {
        setLayoutModeState("overlay");
        // Auto-send the query
        setTimeout(() => sendMessage(query), 100);
    }, [sendMessage]);

    // Compute current catalogSnapshot for badge display
    // Priority: external snapshot (store pages) > chat product cards
    const catalogSnapshot = useMemo<CatalogSnapshot | null>(() => {
        // Priority 1: External snapshot from store pages
        if (externalSnapshotRef.current && externalSnapshotRef.current.lastResults.length > 0) {
            return externalSnapshotRef.current;
        }

        // Priority 2: Products from chat responses
        const productCards = messages
            .flatMap(m => m.uiComponents || [])
            .filter((c): c is ProductCardData => c.__ui === "product_card");

        if (productCards.length === 0) return null;

        const lastResults = productCards.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            score: p.score,
            category: 'tv'
        }));

        const focusIds = [...lastResults]
            .sort((a, b) => b.score - a.score)
            .slice(0, 2)
            .map(p => p.id);

        return {
            lastResults,
            focusIds,
            updatedAt: new Date().toISOString()
        };
    }, [messages, snapshotVersion]);

    return (
        <ChatContext.Provider value={{
            sessionId,
            layoutMode,
            setLayoutMode,
            isOpen,
            isSplit,
            messages,
            isLoading,
            catalogSnapshot,
            openOverlay,
            openSplit,
            openFocus,
            close,
            toggleSplit,
            sendMessage,
            openWithQuery,
            clearMessages,
            productContext,
            setProductContext,
            updateCatalogSnapshot,
            lastVisitedPage,
            setLastVisitedPage,
            ethicalBrake,
            safetyLevel
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within ChatProvider");
    }
    return context;
}
