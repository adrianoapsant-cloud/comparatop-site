// ============================================================================
// LAYOUT STRATEGY - Deterministic Layout Decision Engine
// ============================================================================
// Fase 1: Lógica determinística baseada em referer e categoria
// Fase 2 (Futuro): Evoluir para IA com base em mais sinais
// ============================================================================

import type { DynamicLayoutConfig, SlotConfig } from '@/types/dynamic-layout';

// ============================================
// TYPES
// ============================================

export interface LayoutStrategyResult {
    /** Configuração do layout para o DynamicLayoutRenderer */
    config: DynamicLayoutConfig;
    /** Tipo de estratégia aplicada */
    strategyType: 'seo' | 'social' | 'default';
    /** Modo de visualização */
    mode: 'visual' | 'technical' | 'gamer';
    /** Razão pela escolha da estratégia */
    reason: string;
}

// ============================================
// REFERER DETECTION
// ============================================

type RefererSource = 'google' | 'bing' | 'instagram' | 'tiktok' | 'facebook' | 'twitter' | 'youtube' | 'unknown';

/**
 * Detecta a fonte do referer
 */
function detectRefererSource(referer: string | null): RefererSource {
    if (!referer) return 'unknown';

    const refererLower = referer.toLowerCase();

    // Search engines (SEO)
    if (refererLower.includes('google.')) return 'google';
    if (refererLower.includes('bing.')) return 'bing';

    // Social media
    if (refererLower.includes('instagram.') || refererLower.includes('l.instagram')) return 'instagram';
    if (refererLower.includes('tiktok.') || refererLower.includes('vm.tiktok')) return 'tiktok';
    if (refererLower.includes('facebook.') || refererLower.includes('fb.')) return 'facebook';
    if (refererLower.includes('twitter.') || refererLower.includes('t.co') || refererLower.includes('x.com')) return 'twitter';
    if (refererLower.includes('youtube.')) return 'youtube';

    return 'unknown';
}

/**
 * Determina se o referer é de origem SEO
 */
function isSeoReferer(source: RefererSource): boolean {
    return ['google', 'bing'].includes(source);
}

/**
 * Determina se o referer é de origem social (visual-first)
 */
function isSocialReferer(source: RefererSource): boolean {
    return ['instagram', 'tiktok', 'facebook', 'twitter'].includes(source);
}

// ============================================
// LAYOUT CONFIGURATIONS
// ============================================

/**
 * Layout para tráfego SEO - Prioriza conteúdo textual e specs técnicas
 * Usuários de Google buscam informação detalhada
 */
function getSeoLayout(): DynamicLayoutConfig {
    return {
        order: [
            { type: 'verdict', variant: 'full', id: 'veredito' },
            { type: 'specs', variant: 'table_interactive', id: 'especificacoes' },
            { type: 'dna_chart', variant: 'technical', id: 'dna-produto' },
            { type: 'simulators', variant: 'cards', id: 'simuladores' },
            { type: 'bundle', variant: 'horizontal', id: 'bundle' },
        ] as SlotConfig[],
        layoutVariant: 'seo_optimized',
    };
}

/**
 * Layout para tráfego Social - Prioriza visual e quick wins
 * Usuários de Instagram/TikTok preferem scannability
 */
function getSocialLayout(): DynamicLayoutConfig {
    return {
        order: [
            { type: 'dna_chart', variant: 'visual', id: 'dna-produto' },
            { type: 'simulators', variant: 'cards', id: 'simuladores' },
            { type: 'verdict', variant: 'summary', id: 'veredito' },
            { type: 'bundle', variant: 'horizontal', id: 'bundle' },
            { type: 'specs', variant: 'list', id: 'especificacoes' },
        ] as SlotConfig[],
        layoutVariant: 'social_optimized',
    };
}

/**
 * Layout padrão balanceado
 */
function getDefaultLayout(): DynamicLayoutConfig {
    return {
        order: [
            { type: 'dna_chart', variant: 'visual', id: 'dna-produto' },
            { type: 'verdict', variant: 'full', id: 'veredito' },
            { type: 'simulators', variant: 'cards', id: 'simuladores' },
            { type: 'specs', variant: 'list', id: 'especificacoes' },
            { type: 'bundle', variant: 'horizontal', id: 'bundle' },
        ] as SlotConfig[],
        layoutVariant: 'default',
    };
}

/**
 * Layout otimizado para categoria gaming (TVs, Monitores)
 */
function getGamerLayout(): DynamicLayoutConfig {
    return {
        order: [
            { type: 'dna_chart', variant: 'gamer', id: 'dna-produto' },
            { type: 'specs', variant: 'table_interactive', id: 'especificacoes' },
            { type: 'simulators', variant: 'cards', id: 'simuladores' },
            { type: 'verdict', variant: 'full', id: 'veredito' },
            { type: 'bundle', variant: 'horizontal', id: 'bundle' },
        ] as SlotConfig[],
        layoutVariant: 'gamer_focused',
    };
}

// ============================================
// MAIN FUNCTION
// ============================================

/**
 * Determina a estratégia de layout baseado em referer e categoria
 * 
 * Lógica de Negócio (Fase 1 - Determinística):
 * 1. Se referer = Google/Bing (SEO) → Layout técnico, specs em destaque
 * 2. Se referer = Instagram/TikTok (Social) → Layout visual, gráficos primeiro
 * 3. Se categoria = TV/Monitor → Layout gamer com specs técnicos
 * 4. Fallback → Layout balanceado padrão
 * 
 * @param referer - Header Referer da requisição
 * @param category - ID da categoria do produto
 * @returns Configuração de layout e metadados da estratégia
 * 
 * @example
 * ```ts
 * const { config, mode, reason } = getLayoutStrategy(
 *   'https://www.google.com/search?q=samsung+qn90c',
 *   'tv'
 * );
 * ```
 */
export function getLayoutStrategy(
    referer: string | null,
    category: string
): LayoutStrategyResult {
    const refererSource = detectRefererSource(referer);

    // Priority 1: Gaming category always gets gamer layout
    if (['tv', 'monitor', 'console', 'headset'].includes(category)) {
        // But if from SEO, still prioritize text content
        if (isSeoReferer(refererSource)) {
            return {
                config: getSeoLayout(),
                strategyType: 'seo',
                mode: 'technical',
                reason: `Tráfego SEO (${refererSource}) em categoria gaming → Layout técnico com specs`,
            };
        }

        return {
            config: getGamerLayout(),
            strategyType: 'default',
            mode: 'gamer',
            reason: `Categoria gaming (${category}) → Layout gamer com specs técnicos`,
        };
    }

    // Priority 2: SEO traffic
    if (isSeoReferer(refererSource)) {
        return {
            config: getSeoLayout(),
            strategyType: 'seo',
            mode: 'technical',
            reason: `Tráfego SEO (${refererSource}) → Prioriza veredito e specs técnicas`,
        };
    }

    // Priority 3: Social traffic
    if (isSocialReferer(refererSource)) {
        return {
            config: getSocialLayout(),
            strategyType: 'social',
            mode: 'visual',
            reason: `Tráfego social (${refererSource}) → Prioriza gráficos e visual`,
        };
    }

    // Default: Balanced layout
    return {
        config: getDefaultLayout(),
        strategyType: 'default',
        mode: 'visual',
        reason: 'Tráfego direto/desconhecido → Layout balanceado padrão',
    };
}

// ============================================
// UTILITY EXPORTS
// ============================================

export {
    detectRefererSource,
    isSeoReferer,
    isSocialReferer,
    getSeoLayout,
    getSocialLayout,
    getDefaultLayout,
    getGamerLayout,
};

export type { RefererSource };

// Export layout mode type for MAB integration
export type LayoutMode = 'visual' | 'technical' | 'gamer';
