/**
 * @file seo-strategy.ts
 * @description Configuração de SEO para Indexação Progressiva
 * 
 * Este módulo controla quais produtos são indexados pelo Google,
 * permitindo gerenciar o Crawl Budget e evitar penalidades por "Thin Content".
 * 
 * Estratégia:
 * - Fase 1: Apenas os 200 produtos mais populares (Head Tail)
 * - Fase 2: Expandir para 500 produtos
 * - Fase 3: Todos os produtos com conteúdo suficiente
 * 
 * @see https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
 */

// ============================================
// TIPOS
// ============================================

export interface ProductIndexingMetrics {
    id: string;
    slug: string;
    /** Score de popularidade (0-100). Pode vir de analytics, vendas, etc. */
    popularityScore: number;
    /** Data de criação do produto */
    createdAt?: Date;
    /** Indica se tem conteúdo editorial completo */
    hasFullContent?: boolean;
    /** Número de ofertas ativas */
    offerCount?: number;
    /** Views nos últimos 30 dias */
    monthlyViews?: number;
}

export interface IndexingDecision {
    shouldIndex: boolean;
    reason: string;
    phase: IndexingPhase;
}

export type IndexingPhase = 'PHASE_1_HEAD_TAIL' | 'PHASE_2_EXPANSION' | 'PHASE_3_FULL';

// ============================================
// CONFIGURAÇÃO
// ============================================

/**
 * Configuração de Indexação Progressiva
 * Altere apenas estas constantes para escalar
 */
export const SEO_CONFIG = {
    /** Fase atual da indexação */
    CURRENT_PHASE: 'PHASE_1_HEAD_TAIL' as IndexingPhase,

    /** Limites de produtos por fase */
    LIMITS: {
        PHASE_1_HEAD_TAIL: 200,     // Fase 1: Top 200 produtos
        PHASE_2_EXPANSION: 500,     // Fase 2: Top 500 produtos
        PHASE_3_FULL: Infinity,     // Fase 3: Todos os produtos
    } as const,

    /** Score mínimo de popularidade para indexação */
    MIN_POPULARITY_SCORE: 10,

    /** Requer conteúdo editorial completo? */
    REQUIRE_FULL_CONTENT: false,

    /** Número mínimo de ofertas para indexar */
    MIN_OFFER_COUNT: 0,
} as const;

// ============================================
// FUNÇÕES UTILITÁRIAS
// ============================================

/**
 * Retorna o limite atual de produtos para indexação
 */
export function getIndexingLimit(): number {
    return SEO_CONFIG.LIMITS[SEO_CONFIG.CURRENT_PHASE];
}

/**
 * Decide se um produto deve ser indexado baseado em suas métricas
 * 
 * @param metrics - Métricas do produto
 * @param currentRank - Posição do produto no ranking de popularidade (1-indexed)
 * @returns Decisão de indexação com motivo
 * 
 * @example
 * const decision = shouldIndexProduct({ popularityScore: 85 }, 150);
 * // { shouldIndex: true, reason: 'Dentro do limite (150/200)', phase: 'PHASE_1_HEAD_TAIL' }
 */
export function shouldIndexProduct(
    metrics: ProductIndexingMetrics,
    currentRank?: number
): IndexingDecision {
    const limit = getIndexingLimit();
    const phase = SEO_CONFIG.CURRENT_PHASE;

    // Critério 1: Verificar score mínimo de popularidade
    if (metrics.popularityScore < SEO_CONFIG.MIN_POPULARITY_SCORE) {
        return {
            shouldIndex: false,
            reason: `Score de popularidade muito baixo (${metrics.popularityScore} < ${SEO_CONFIG.MIN_POPULARITY_SCORE})`,
            phase,
        };
    }

    // Critério 2: Verificar conteúdo completo (se requerido)
    if (SEO_CONFIG.REQUIRE_FULL_CONTENT && !metrics.hasFullContent) {
        return {
            shouldIndex: false,
            reason: 'Produto sem conteúdo editorial completo',
            phase,
        };
    }

    // Critério 3: Verificar número de ofertas (se requerido)
    if (metrics.offerCount !== undefined && metrics.offerCount < SEO_CONFIG.MIN_OFFER_COUNT) {
        return {
            shouldIndex: false,
            reason: `Ofertas insuficientes (${metrics.offerCount} < ${SEO_CONFIG.MIN_OFFER_COUNT})`,
            phase,
        };
    }

    // Critério 4: Verificar posição no ranking
    if (currentRank !== undefined && currentRank > limit) {
        return {
            shouldIndex: false,
            reason: `Fora do limite de indexação (rank ${currentRank} > ${limit})`,
            phase,
        };
    }

    // Produto aprovado para indexação
    return {
        shouldIndex: true,
        reason: currentRank
            ? `Dentro do limite (rank ${currentRank}/${limit})`
            : `Score de popularidade suficiente (${metrics.popularityScore})`,
        phase,
    };
}

/**
 * Filtra e ordena produtos para o sitemap
 * Retorna apenas os produtos que devem ser indexados
 * 
 * @param products - Lista completa de produtos
 * @returns Lista filtrada e ordenada por popularidade
 */
export function getIndexableProducts<T extends ProductIndexingMetrics>(
    products: T[]
): T[] {
    const limit = getIndexingLimit();

    // Ordenar por popularidade (maior primeiro)
    const sorted = [...products].sort((a, b) => b.popularityScore - a.popularityScore);

    // Filtrar produtos que passam nos critérios
    const filtered = sorted.filter((product, index) => {
        const decision = shouldIndexProduct(product, index + 1);
        return decision.shouldIndex;
    });

    // Aplicar limite
    return filtered.slice(0, limit);
}

/**
 * Verifica se um produto específico deve ser indexado
 * Usa a lista completa de produtos para calcular o ranking
 * 
 * @param productId - ID do produto a verificar
 * @param allProducts - Lista completa de produtos
 * @returns Decisão de indexação
 */
export function checkProductIndexing<T extends ProductIndexingMetrics>(
    productId: string,
    allProducts: T[]
): IndexingDecision {
    // Ordenar por popularidade
    const sorted = [...allProducts].sort((a, b) => b.popularityScore - a.popularityScore);

    // Encontrar o produto e sua posição
    const index = sorted.findIndex(p => p.id === productId);

    if (index === -1) {
        return {
            shouldIndex: false,
            reason: 'Produto não encontrado',
            phase: SEO_CONFIG.CURRENT_PHASE,
        };
    }

    const product = sorted[index];
    return shouldIndexProduct(product, index + 1);
}

/**
 * Retorna estatísticas sobre a indexação atual
 */
export function getIndexingStats<T extends ProductIndexingMetrics>(
    products: T[]
): {
    total: number;
    indexable: number;
    percentage: number;
    phase: IndexingPhase;
    limit: number;
} {
    const indexable = getIndexableProducts(products);

    return {
        total: products.length,
        indexable: indexable.length,
        percentage: Math.round((indexable.length / products.length) * 100),
        phase: SEO_CONFIG.CURRENT_PHASE,
        limit: getIndexingLimit(),
    };
}

// ============================================
// CONSTANTES PARA ROBOTS META TAG
// ============================================

export const ROBOTS_INDEX = {
    index: true,
    follow: true,
} as const;

export const ROBOTS_NOINDEX = {
    index: false,
    follow: true,  // Mantém follow para passar link juice
} as const;
