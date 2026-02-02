/**
 * Scoring Engine - Server-Side Only
 * 
 * @description Product scoring using getUnifiedScore() as the single source of truth.
 * 
 * IMPORTANT: The legacy QS/VS/GS system has been COMPLETELY ABANDONED.
 * All scores now come from getUnifiedScore() which reads:
 * 1. product.scores (c1-c10) with PARR weights
 * 2. Fallback to 7.5
 * 
 * DO NOT import this file in client components.
 */

import type {
    CategoryDefinition,
    Product,
    ScoredProduct,
    ComputedScores,
    ScoreBreakdown,
    UserProfile,
    ProductComparison,
    CriterionComparison,
} from '@/types/category';
import { getCategoryById } from '@/config/categories';
import { getUnifiedScore } from '@/lib/scoring/getUnifiedScore';

// ============================================
// MAIN SCORING FUNCTION
// ============================================

/**
 * Calculate all scores for a product.
 * 
 * USES getUnifiedScore() as the SINGLE SOURCE OF TRUTH for overall score.
 * The legacy QS/VS/GS system has been completely removed.
 * 
 * @param product - The product with raw scores
 * @param category - Optional category override (auto-fetches if not provided)
 * @param profile - Optional user profile (kept for API compatibility, not used)
 * @returns ComputedScores with overall score from getUnifiedScore()
 */
export function calculateProductScores(
    product: Product,
    category?: CategoryDefinition | null,
    profile?: UserProfile | null
): ComputedScores {
    // 1. Get category definition (for breakdown generation)
    const cat = category ?? getCategoryById(product.categoryId);
    if (!cat) {
        throw new Error(`Category not found: ${product.categoryId}`);
    }

    // 2. Get the UNIFIED score using getUnifiedScore()
    // This is the ONLY source of truth for scores across the entire site
    const overall = getUnifiedScore(product);

    // 3. Calculate price per quality point
    const pricePerPoint = product.price / (overall > 0 ? overall : 1);

    // 4. Generate breakdown (for detailed views)
    const breakdown = generateBreakdown(product, cat);

    // Return simplified computed scores
    // Legacy fields (qs, vs, gs) are set to overall for backwards compatibility
    return {
        qs: overall,  // Legacy compatibility
        vs: overall,  // Legacy compatibility
        gs: overall,  // Legacy compatibility
        overall: overall,
        pricePerPoint: Math.round(pricePerPoint),
        breakdown,
        profileId: profile?.id ?? null,
    };
}

// ============================================
// BREAKDOWN GENERATION
// ============================================

/**
 * Generate detailed breakdown of individual criterion scores
 */
function generateBreakdown(
    product: Product,
    category: CategoryDefinition
): ScoreBreakdown[] {
    return category.criteria.map(criterion => {
        const rawScore = product.scores[criterion.id] ?? 0;
        const weight = criterion.weight;

        return {
            criterionId: criterion.id,
            criterionLabel: criterion.label,
            rawScore,
            weight,
            weightedScore: rawScore * weight,
            group: criterion.group,
        };
    });
}

// ============================================
// PRODUCT SCORING UTILITIES
// ============================================

/**
 * Score a single product and return with computed scores attached
 */
export function scoreProduct(
    product: Product,
    category?: CategoryDefinition | null,
    profile?: UserProfile | null
): ScoredProduct {
    const computed = calculateProductScores(product, category, profile);

    return {
        ...product,
        computed,
    };
}

/**
 * Score multiple products and sort by overall score (descending)
 */
export function scoreAndRankProducts(
    products: Product[],
    category: CategoryDefinition,
    profile?: UserProfile | null
): ScoredProduct[] {
    return products
        .map(p => scoreProduct(p, category, profile))
        .sort((a, b) => b.computed.overall - a.computed.overall);
}

// ============================================
// COMPARISON ENGINE
// ============================================

/**
 * Compare two products criterion by criterion
 */
export function compareProducts(
    productA: Product,
    productB: Product,
    category: CategoryDefinition,
    profile?: UserProfile | null
): ProductComparison {
    // Score both products using getUnifiedScore()
    const scoredA = scoreProduct(productA, category, profile);
    const scoredB = scoreProduct(productB, category, profile);

    // Compare each criterion
    const criteriaComparison: CriterionComparison[] = category.criteria.map(criterion => {
        const scoreA = productA.scores[criterion.id] ?? 0;
        const scoreB = productB.scores[criterion.id] ?? 0;
        const difference = scoreA - scoreB;

        let winner: 'A' | 'B' | 'tie' = 'tie';
        if (difference > 0.2) winner = 'A';
        else if (difference < -0.2) winner = 'B';

        return {
            criterionId: criterion.id,
            label: criterion.label,
            scoreA,
            scoreB,
            winner,
            difference: round(difference),
        };
    });

    // Determine score winners
    const determineWinner = (a: number, b: number): 'A' | 'B' | 'tie' => {
        if (a - b > 0.2) return 'A';
        if (b - a > 0.2) return 'B';
        return 'tie';
    };

    // Price comparison
    const priceDiff = productA.price - productB.price;
    const pricePercentDiff = productB.price > 0
        ? ((productA.price - productB.price) / productB.price) * 100
        : 0;

    // Generate recommendation
    const recommendation = generateRecommendation(scoredA, scoredB, criteriaComparison);

    // All score comparisons use overall (no more QS/VS/GS distinction)
    return {
        productA: scoredA,
        productB: scoredB,
        criteria: criteriaComparison,
        scores: {
            qs: {
                winner: determineWinner(scoredA.computed.overall, scoredB.computed.overall),
                difference: round(scoredA.computed.overall - scoredB.computed.overall),
            },
            vs: {
                winner: determineWinner(scoredA.computed.overall, scoredB.computed.overall),
                difference: round(scoredA.computed.overall - scoredB.computed.overall),
            },
            overall: {
                winner: determineWinner(scoredA.computed.overall, scoredB.computed.overall),
                difference: round(scoredA.computed.overall - scoredB.computed.overall),
            },
        },
        price: {
            cheaper: priceDiff < 0 ? 'A' : priceDiff > 0 ? 'B' : 'tie',
            difference: Math.abs(priceDiff),
            percentDifference: round(pricePercentDiff),
        },
        recommendation,
    };
}

/**
 * Generate human-readable recommendation based on comparison
 */
function generateRecommendation(
    productA: ScoredProduct,
    productB: ScoredProduct,
    criteria: CriterionComparison[]
): ProductComparison['recommendation'] {
    const overallDiff = productA.computed.overall - productB.computed.overall;
    const priceDiff = productA.price - productB.price;

    // Count wins per product
    const winsA = criteria.filter(c => c.winner === 'A').length;
    const winsB = criteria.filter(c => c.winner === 'B').length;

    // Determine overall winner
    let winner: 'A' | 'B' | 'tie' = 'tie';
    let reason = '';

    if (Math.abs(overallDiff) < 0.3) {
        // Very close - consider price
        if (priceDiff < -500) {
            winner = 'A';
            reason = `Desempenho similar, mas ${productA.shortName || productA.name} é mais acessível.`;
        } else if (priceDiff > 500) {
            winner = 'B';
            reason = `Desempenho similar, mas ${productB.shortName || productB.name} é mais acessível.`;
        } else {
            winner = 'tie';
            reason = 'Produtos muito equivalentes. A escolha depende de preferências pessoais.';
        }
    } else if (overallDiff > 0) {
        winner = 'A';
        reason = `${productA.shortName || productA.name} supera em ${winsA} de 10 critérios.`;
    } else {
        winner = 'B';
        reason = `${productB.shortName || productB.name} supera em ${winsB} de 10 critérios.`;
    }

    // Determine best for specific use cases (all based on overall score now)
    const bestFor: Record<string, 'A' | 'B'> = {};

    if (productA.computed.overall > productB.computed.overall) {
        bestFor['qualidade'] = 'A';
        bestFor['custo-benefício'] = 'A';
        bestFor['confiabilidade'] = 'A';
    } else if (productB.computed.overall > productA.computed.overall) {
        bestFor['qualidade'] = 'B';
        bestFor['custo-benefício'] = 'B';
        bestFor['confiabilidade'] = 'B';
    }

    return {
        winner,
        reason,
        bestFor,
    };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Round to 2 decimal places
 */
function round(value: number): number {
    return Math.round(value * 100) / 100;
}

/**
 * Find the best product for a specific criterion
 */
export function findBestForCriterion(
    products: ScoredProduct[],
    criterionId: string
): ScoredProduct | null {
    if (products.length === 0) return null;

    return products.reduce((best, current) => {
        const bestScore = best.scores[criterionId] ?? 0;
        const currentScore = current.scores[criterionId] ?? 0;
        return currentScore > bestScore ? current : best;
    });
}

/**
 * Get top N products by overall score
 */
export function getTopProducts(
    products: ScoredProduct[],
    n: number = 3
): ScoredProduct[] {
    return [...products]
        .sort((a, b) => b.computed.overall - a.computed.overall)
        .slice(0, n);
}

/**
 * Validate that product has all required scores for category
 */
export function validateProductScores(
    product: Product,
    category: CategoryDefinition
): { valid: boolean; missing: string[] } {
    const missing: string[] = [];

    for (const criterion of category.criteria) {
        if (!(criterion.id in product.scores)) {
            missing.push(criterion.id);
        }
    }

    return {
        valid: missing.length === 0,
        missing,
    };
}

// ============================================
// LEGACY COMPATIBILITY EXPORTS
// ============================================

/**
 * Get effective weights for a category.
 * DEPRECATED: Kept for backwards compatibility only.
 * All scoring now uses getUnifiedScore() directly.
 */
export function getEffectiveWeights(
    category: CategoryDefinition,
    profile?: UserProfile | null
): Record<string, number> {
    const weights: Record<string, number> = {};

    for (const criterion of category.criteria) {
        weights[criterion.id] = criterion.weight;
    }

    return weights;
}
