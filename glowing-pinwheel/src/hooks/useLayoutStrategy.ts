'use client';

// ============================================================================
// USE LAYOUT STRATEGY HOOK
// ============================================================================
// Determina automaticamente o layout ideal baseado no contexto do usuário
// e do produto, retornando a configuração apropriada para o DynamicLayoutRenderer
// ============================================================================

import { useMemo } from 'react';
import type {
    DynamicLayoutConfig,
    UserContext,
    ProductContext,
    LayoutPreset,
} from '@/types/dynamic-layout';

import {
    getDefaultLayoutConfig,
    getGamerLayoutConfig,
    getQuickDecisionLayoutConfig,
    getBudgetLayoutConfig,
} from '@/components/DynamicLayoutRenderer';

// ============================================
// TYPES
// ============================================

interface UseLayoutStrategyOptions {
    /** Contexto do usuário */
    userContext?: Partial<UserContext>;
    /** Contexto do produto */
    productContext?: Partial<ProductContext>;
    /** Forçar um preset específico (override automático) */
    forcePreset?: LayoutPreset;
    /** Callback para tracking de qual layout foi selecionado */
    onLayoutSelected?: (preset: LayoutPreset, reason: string) => void;
}

interface UseLayoutStrategyResult {
    /** Configuração de layout calculada */
    config: DynamicLayoutConfig;
    /** Preset selecionado */
    preset: LayoutPreset;
    /** Razão pela qual este preset foi escolhido */
    reason: string;
}

// ============================================
// LAYOUT STRATEGY ENGINE
// ============================================

/**
 * Determina o melhor preset baseado nos contextos
 */
function determineLayoutPreset(
    userContext: Partial<UserContext>,
    productContext: Partial<ProductContext>
): { preset: LayoutPreset; reason: string } {

    // Priority 1: Gamer user on gaming-relevant product
    if (
        userContext.viewerType === 'gamer' ||
        productContext.categoryId === 'tv' ||
        productContext.badges?.includes('gaming-pick')
    ) {
        return {
            preset: 'gamer_focused',
            reason: 'Usuário gamer ou produto gaming-relevant'
        };
    }

    // Priority 2: Mobile + returning visitor = quick decision
    if (
        userContext.device === 'mobile' &&
        userContext.isReturningVisitor
    ) {
        return {
            preset: 'quick_decision',
            reason: 'Mobile retornando - decisão rápida'
        };
    }

    // Priority 3: Budget product or traffic from price comparison
    if (
        productContext.priceRange === 'budget' ||
        productContext.badges?.includes('best-value') ||
        productContext.badges?.includes('budget-pick')
    ) {
        return {
            preset: 'budget_conscious',
            reason: 'Produto budget ou foco em economia'
        };
    }

    // Priority 4: Came from comparison = show detailed specs
    if (userContext.trafficSource === 'social') {
        return {
            preset: 'default',
            reason: 'Tráfego social - layout otimizado para descoberta'
        };
    }

    // Default: Balanced layout
    return {
        preset: 'default',
        reason: 'Layout padrão balanceado'
    };
}

/**
 * Mapeia preset para configuração
 */
function getConfigForPreset(preset: LayoutPreset): DynamicLayoutConfig {
    switch (preset) {
        case 'gamer_focused':
            return getGamerLayoutConfig();
        case 'quick_decision':
            return getQuickDecisionLayoutConfig();
        case 'budget_conscious':
            return getBudgetLayoutConfig();
        case 'comparison_mode':
            // TODO: Criar layout específico para comparação
            return getDefaultLayoutConfig();
        default:
            return getDefaultLayoutConfig();
    }
}

// ============================================
// MAIN HOOK
// ============================================

/**
 * Hook para determinação automática do layout da página de produto
 * 
 * @example
 * ```tsx
 * const { config, preset, reason } = useLayoutStrategy({
 *   userContext: {
 *     device: 'mobile',
 *     viewerType: 'gamer',
 *   },
 *   productContext: {
 *     categoryId: 'tv',
 *     priceRange: 'premium',
 *   },
 * });
 * ```
 */
export function useLayoutStrategy(
    options: UseLayoutStrategyOptions = {}
): UseLayoutStrategyResult {
    const {
        userContext = {},
        productContext = {},
        forcePreset,
        onLayoutSelected,
    } = options;

    const result = useMemo(() => {
        // If preset is forced, use it directly
        if (forcePreset) {
            const config = getConfigForPreset(forcePreset);
            const reason = `Preset forçado: ${forcePreset}`;

            return { config, preset: forcePreset, reason };
        }

        // Otherwise, determine based on context
        const { preset, reason } = determineLayoutPreset(userContext, productContext);
        const config = getConfigForPreset(preset);

        return { config, preset, reason };
    }, [userContext, productContext, forcePreset]);

    // Call tracking callback if provided
    useMemo(() => {
        if (onLayoutSelected) {
            onLayoutSelected(result.preset, result.reason);
        }
    }, [result.preset, result.reason, onLayoutSelected]);

    return result;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Detecta contexto do usuário a partir do request/browser
 */
export function detectUserContext(): Partial<UserContext> {
    if (typeof window === 'undefined') {
        return {};
    }

    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const isReturning = localStorage.getItem('comparatop_visited') === 'true';

    // Mark as visited for future
    localStorage.setItem('comparatop_visited', 'true');

    // Detect gamer by past navigation
    const recentCategories = JSON.parse(
        sessionStorage.getItem('comparatop_recent_categories') || '[]'
    ) as string[];

    const isGamer = recentCategories.some(cat =>
        ['tv', 'monitor', 'console', 'headset'].includes(cat)
    );

    return {
        device: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
        isReturningVisitor: isReturning,
        viewerType: isGamer ? 'gamer' : undefined,
        recentCategories,
    };
}

/**
 * Extrai contexto do produto a partir dos dados
 */
export function extractProductContext(
    product: Record<string, unknown>
): Partial<ProductContext> {
    const price = (product.price as number) || 0;
    const categoryId = (product.categoryId as string) || 'unknown';
    const badges = (product.badges as string[]) || [];
    const hasBundle = Boolean(product.bundleProduct);
    const hasRival = Boolean(product.mainCompetitor);

    // Determine price range
    let priceRange: 'budget' | 'mid' | 'premium' = 'mid';
    if (price < 2000) priceRange = 'budget';
    else if (price > 5000) priceRange = 'premium';

    return {
        categoryId,
        priceRange,
        hasBundle,
        hasRival,
        badges,
    };
}

export default useLayoutStrategy;
