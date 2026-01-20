/**
 * @file battle-engine.ts
 * @description Motor de Batalhas para Indexação de Páginas de Comparação
 * 
 * Implementa a lógica de "Ringue por Categoria":
 * - Comparações DEVEM acontecer dentro da mesma categoria pai
 * - Evita comparações absurdas (ex: Geladeira vs Notebook)
 * - Calcula Battle Score para decidir indexação
 * 
 * @see https://developers.google.com/search/docs/crawling-indexing
 */

// ============================================
// TIPOS
// ============================================

export interface BattleProduct {
    id: string;
    slug: string;
    /** Categoria do produto - OBRIGATÓRIO para validação */
    categoryId: string;
    /** Score de popularidade (0-100) */
    popularityScore: number;
    /** Preço do produto */
    price?: number;
    /** Marca do produto */
    brand?: string;
    /** Nome do produto */
    name?: string;
}

export interface BattleScoreResult {
    /** Score final da batalha (0-100) */
    score: number;
    /** Se a batalha deve ser indexada */
    shouldIndex: boolean;
    /** Motivo da decisão */
    reason: string;
    /** Categoria da batalha */
    categoryId: string;
    /** Componentes do score */
    breakdown: {
        popularitySum: number;
        seasonalityFactor: number;
        brandDiversityBonus: number;
    };
}

export interface CategoryBattleStats {
    categoryId: string;
    totalProducts: number;
    totalBattles: number;
    indexableBattles: number;
}

// ============================================
// CONFIGURAÇÃO
// ============================================

export const BATTLE_ENGINE_CONFIG = {
    /** Threshold mínimo para indexação (0-100) */
    INDEXING_THRESHOLD: 40,

    /** Produtos por categoria para gerar combinações */
    PRODUCTS_PER_CATEGORY: 20,

    /** Fator de sazonalidade (1.0 = normal, pode variar por época) */
    SEASONALITY_FACTOR: 1.0,

    /** Bônus quando as marcas são diferentes (mais interessante comparar) */
    BRAND_DIVERSITY_BONUS: 10,

    /** Limite máximo de batalhas por categoria no sitemap */
    MAX_BATTLES_PER_CATEGORY: 100,
} as const;

// Export para uso externo
export const INDEXING_THRESHOLD = BATTLE_ENGINE_CONFIG.INDEXING_THRESHOLD;

// ============================================
// VALIDAÇÃO DE CATEGORIA (Kill Switch)
// ============================================

/**
 * Erro lançado quando se tenta comparar produtos de categorias diferentes
 */
export class CategoryMismatchError extends Error {
    constructor(
        public categoryA: string,
        public categoryB: string
    ) {
        super(`Batalha inválida: categorias diferentes (${categoryA} vs ${categoryB})`);
        this.name = 'CategoryMismatchError';
    }
}

/**
 * Valida se dois produtos podem ser comparados
 * @throws {CategoryMismatchError} Se as categorias forem diferentes
 */
export function validateBattlePair(
    productA: BattleProduct,
    productB: BattleProduct
): void {
    if (productA.categoryId !== productB.categoryId) {
        throw new CategoryMismatchError(productA.categoryId, productB.categoryId);
    }
}

/**
 * Verifica se dois produtos podem ser comparados (versão sem throw)
 */
export function canBattle(
    productA: BattleProduct,
    productB: BattleProduct
): boolean {
    return productA.categoryId === productB.categoryId;
}

// ============================================
// CÁLCULO DO BATTLE SCORE
// ============================================

/**
 * Calcula o Battle Score para uma comparação entre dois produtos
 * 
 * REGRA ZERO (Kill Switch): Se as categorias forem diferentes, retorna score 0
 * 
 * Fórmula: (PopularidadeA + PopularidadeB) * FatorSazonalidade + BônusDiversidade
 * 
 * @param productA - Primeiro produto
 * @param productB - Segundo produto
 * @returns Resultado do score com decisão de indexação
 * 
 * @example
 * const result = calculateBattleScore(
 *   { id: 'samsung-qn90c', categoryId: 'tv', popularityScore: 85 },
 *   { id: 'lg-c3', categoryId: 'tv', popularityScore: 80 }
 * );
 * // result.score = 84.5, result.shouldIndex = true
 */
export function calculateBattleScore(
    productA: BattleProduct,
    productB: BattleProduct
): BattleScoreResult {
    const { INDEXING_THRESHOLD, SEASONALITY_FACTOR, BRAND_DIVERSITY_BONUS } = BATTLE_ENGINE_CONFIG;

    // =========================================
    // REGRA ZERO: Kill Switch de Categoria
    // =========================================
    if (productA.categoryId !== productB.categoryId) {
        return {
            score: 0,
            shouldIndex: false,
            reason: `Categorias diferentes: ${productA.categoryId} vs ${productB.categoryId}`,
            categoryId: 'invalid',
            breakdown: {
                popularitySum: 0,
                seasonalityFactor: SEASONALITY_FACTOR,
                brandDiversityBonus: 0,
            },
        };
    }

    // =========================================
    // CÁLCULO DO SCORE
    // =========================================

    // Base: soma das popularidades (0-200)
    const popularitySum = productA.popularityScore + productB.popularityScore;

    // Aplicar fator de sazonalidade
    // TODO: Conectar com calendário de vendas (Black Friday, Natal, etc.)
    const seasonalityFactor = SEASONALITY_FACTOR;

    // Bônus de diversidade de marca (mais interessante comparar marcas diferentes)
    const brandDiversityBonus = (productA.brand && productB.brand && productA.brand !== productB.brand)
        ? BRAND_DIVERSITY_BONUS
        : 0;

    // Score final: normalizado para 0-100
    const rawScore = (popularitySum / 2) * seasonalityFactor + brandDiversityBonus;
    const score = Math.min(100, Math.max(0, rawScore));

    // Decisão de indexação
    const shouldIndex = score >= INDEXING_THRESHOLD;

    // Gerar motivo
    let reason: string;
    if (shouldIndex) {
        reason = `Score ${score.toFixed(1)} >= threshold ${INDEXING_THRESHOLD}`;
        if (brandDiversityBonus > 0) {
            reason += ` (bônus marcas: +${brandDiversityBonus})`;
        }
    } else {
        reason = `Score ${score.toFixed(1)} < threshold ${INDEXING_THRESHOLD}`;
    }

    return {
        score,
        shouldIndex,
        reason,
        categoryId: productA.categoryId,
        breakdown: {
            popularitySum,
            seasonalityFactor,
            brandDiversityBonus,
        },
    };
}

/**
 * Verifica rapidamente se uma batalha deve ser indexada
 */
export function shouldIndexBattle(
    productA: BattleProduct,
    productB: BattleProduct
): boolean {
    return calculateBattleScore(productA, productB).shouldIndex;
}

// ============================================
// GERADOR DE BATALHAS POR CATEGORIA
// ============================================

/**
 * Gera batalhas para uma única categoria usando Generator para economia de memória
 * 
 * @param products - Lista de produtos DA MESMA CATEGORIA
 * @yields Batalhas individuais
 */
export function* generateCategoryBattles(
    products: BattleProduct[]
): Generator<{
    productA: BattleProduct;
    productB: BattleProduct;
    result: BattleScoreResult;
}> {
    const { PRODUCTS_PER_CATEGORY, MAX_BATTLES_PER_CATEGORY } = BATTLE_ENGINE_CONFIG;

    if (products.length === 0) return;

    // Validar que todos são da mesma categoria
    const categoryId = products[0].categoryId;
    const validProducts = products.filter(p => p.categoryId === categoryId);

    // Ordenar por popularidade e pegar top N
    const topProducts = [...validProducts]
        .sort((a, b) => b.popularityScore - a.popularityScore)
        .slice(0, PRODUCTS_PER_CATEGORY);

    let battleCount = 0;

    // Gerar combinações (N * (N-1) / 2)
    for (let i = 0; i < topProducts.length && battleCount < MAX_BATTLES_PER_CATEGORY; i++) {
        for (let j = i + 1; j < topProducts.length && battleCount < MAX_BATTLES_PER_CATEGORY; j++) {
            const result = calculateBattleScore(topProducts[i], topProducts[j]);

            yield {
                productA: topProducts[i],
                productB: topProducts[j],
                result,
            };

            battleCount++;
        }
    }
}

/**
 * Gera todas as batalhas indexáveis para uma categoria
 * 
 * @param products - Lista de produtos da categoria
 * @param onlyIndexable - Se true, retorna apenas batalhas que devem ser indexadas
 * @returns Array de batalhas
 */
export function getCategoryBattles(
    products: BattleProduct[],
    onlyIndexable: boolean = true
): Array<{
    productA: BattleProduct;
    productB: BattleProduct;
    score: number;
    slug: string;
}> {
    const battles: Array<{
        productA: BattleProduct;
        productB: BattleProduct;
        score: number;
        slug: string;
    }> = [];

    for (const battle of generateCategoryBattles(products)) {
        if (!onlyIndexable || battle.result.shouldIndex) {
            // Slug canônico: ordenação alfabética
            const [first, second] = [battle.productA.slug, battle.productB.slug].sort();
            battles.push({
                productA: battle.productA,
                productB: battle.productB,
                score: battle.result.score,
                slug: `${first}-vs-${second}`,
            });
        }
    }

    // Ordenar por score (maior primeiro)
    return battles.sort((a, b) => b.score - a.score);
}

// ============================================
// HELPERS PARA CONVERSÃO DE DADOS
// ============================================

/**
 * Converte um produto do catálogo para BattleProduct
 * 
 * 🔌 PONTO DE INTEGRAÇÃO FUTURA:
 * Aqui você conectará dados reais de analytics:
 * - Google Analytics Data API
 * - Vercel KV
 * - Database com métricas de vendas
 */
export function toBattleProduct(product: {
    id: string;
    categoryId?: string;
    price?: number;
    offers?: unknown[];
    badges?: string[];
    brand?: string;
    name?: string;
}): BattleProduct {
    // =====================================================
    // 🔌 TODO: CONECTAR DADOS REAIS DE ANALYTICS AQUI
    // =====================================================
    // Exemplo:
    // const realViews = await getPageViewsFromGA4(product.id);
    // const popularityScore = normalizeViewsToScore(realViews);
    // =====================================================

    let popularityScore = 50;

    if (product.offers && Array.isArray(product.offers) && product.offers.length > 0) {
        popularityScore += Math.min(product.offers.length * 10, 30);
    }

    if (product.price) {
        if (product.price < 2000) {
            popularityScore += 15;
        } else if (product.price < 5000) {
            popularityScore += 10;
        }
    }

    if (product.badges?.includes('editors-choice')) {
        popularityScore += 20;
    }
    if (product.badges?.includes('best-value')) {
        popularityScore += 15;
    }

    popularityScore = Math.min(100, Math.max(0, popularityScore));

    return {
        id: product.id,
        slug: product.id,
        categoryId: product.categoryId || 'unknown',
        popularityScore,
        price: product.price,
        brand: product.brand,
        name: product.name,
    };
}

// ============================================
// CONSTANTES PARA ROBOTS META TAG
// ============================================

export const ROBOTS_INDEX_BATTLE = {
    index: true,
    follow: true,
} as const;

export const ROBOTS_NOINDEX_BATTLE = {
    index: false,
    follow: true,
} as const;

export const ROBOTS_CATEGORY_MISMATCH = {
    index: false,
    follow: false,  // Não seguir links de página inválida
} as const;
