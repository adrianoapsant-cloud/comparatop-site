/**
 * Scoring Engine - Server-Side Only
 * 
 * @description Proprietary scoring algorithms. This module runs exclusively
 * on the server to protect intellectual property.
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

// ============================================
// VALIDATION
// ============================================

/**
 * Validates that a product has scores for all category criteria
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

/**
 * Validates that category weights sum to 1.0
 */
export function validateCategoryWeights(
    category: CategoryDefinition
): { valid: boolean; sum: number } {
    const sum = category.criteria.reduce((acc, c) => acc + c.weight, 0);
    return {
        valid: Math.abs(sum - 1.0) < 0.001, // Allow floating point tolerance
        sum,
    };
}

// ============================================
// WEIGHT CALCULATION
// ============================================

/**
 * Get effective weights for a category, optionally adjusted by a user profile.
 * Returns a map of criterion ID -> effective weight.
 */
export function getEffectiveWeights(
    category: CategoryDefinition,
    profile?: UserProfile | null
): Record<string, number> {
    const weights: Record<string, number> = {};

    for (const criterion of category.criteria) {
        // Start with default weight
        let weight = criterion.weight;

        // Apply profile overrides if present
        if (profile?.weightOverrides && criterion.id in profile.weightOverrides) {
            weight = profile.weightOverrides[criterion.id];
        }

        weights[criterion.id] = weight;
    }

    // Normalize weights to sum to 1.0
    const sum = Object.values(weights).reduce((a, b) => a + b, 0);
    if (sum > 0) {
        for (const key of Object.keys(weights)) {
            weights[key] = weights[key] / sum;
        }
    }

    return weights;
}

// ============================================
// SCORE CALCULATION - CORE ALGORITHM
// ============================================

/**
 * Calculate the weighted score for a specific group (QS, VS, or GS)
 */
function calculateGroupScore(
    product: Product,
    category: CategoryDefinition,
    group: 'QS' | 'VS' | 'GS',
    effectiveWeights: Record<string, number>
): number {
    const groupCriteria = category.criteria.filter(c => c.group === group);

    if (groupCriteria.length === 0) return 0;

    // Calculate weighted sum for this group
    let weightedSum = 0;
    let totalWeight = 0;

    for (const criterion of groupCriteria) {
        const score = product.scores[criterion.id] ?? 0;
        const weight = effectiveWeights[criterion.id] ?? criterion.weight;

        weightedSum += score * weight;
        totalWeight += weight;
    }

    // Return normalized score (0-10 scale)
    return totalWeight > 0 ? weightedSum / totalWeight * 10 : 0;
}

/**
 * Generate detailed breakdown of score calculation
 */
function generateBreakdown(
    product: Product,
    category: CategoryDefinition,
    effectiveWeights: Record<string, number>
): ScoreBreakdown[] {
    return category.criteria.map(criterion => ({
        criterionId: criterion.id,
        criterionLabel: criterion.label,
        rawScore: product.scores[criterion.id] ?? 0,
        weight: effectiveWeights[criterion.id] ?? criterion.weight,
        weightedScore: (product.scores[criterion.id] ?? 0) * (effectiveWeights[criterion.id] ?? criterion.weight),
        group: criterion.group,
    }));
}

/**
 * MAIN SCORING FUNCTION
 * 
 * Calculates all scores for a product based on its category definition.
 * This is the core proprietary algorithm.
 */
export function calculateScores(
    product: Product,
    category: CategoryDefinition,
    profile?: UserProfile | null
): ComputedScores {
    // Get effective weights (with profile adjustments)
    const effectiveWeights = getEffectiveWeights(category, profile);

    // Calculate group scores
    const qs = calculateGroupScore(product, category, 'QS', effectiveWeights);
    const vs = calculateGroupScore(product, category, 'VS', effectiveWeights);
    const gs = calculateGroupScore(product, category, 'GS', effectiveWeights);

    // Calculate overall score
    // Formula: QS contributes 50%, VS contributes 35%, GS contributes 15%
    const overall = (qs * 0.50) + (vs * 0.35) + (gs * 0.15);

    // Calculate price per quality point
    // Lower is better - shows how much you pay for each point of quality
    const pricePerPoint = product.price / (overall > 0 ? overall : 1);

    // Generate breakdown
    const breakdown = generateBreakdown(product, category, effectiveWeights);

    return {
        qs: Math.round(qs * 10) / 10,
        vs: Math.round(vs * 10) / 10,
        gs: Math.round(gs * 10) / 10,
        overall: Math.round(overall * 10) / 10,
        pricePerPoint: Math.round(pricePerPoint),
        breakdown,
        profileId: profile?.id ?? null,
    };
}

/**
 * Score a single product and return with computed scores attached
 */
export function scoreProduct(
    product: Product,
    category: CategoryDefinition,
    profile?: UserProfile | null
): ScoredProduct {
    const computed = calculateScores(product, category, profile);

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
    // Score both products
    const scoredA = scoreProduct(productA, category, profile);
    const scoredB = scoreProduct(productB, category, profile);

    // Compare each criterion
    const criteriaComparison: CriterionComparison[] = category.criteria.map(criterion => {
        const scoreA = productA.scores[criterion.id] ?? 0;
        const scoreB = productB.scores[criterion.id] ?? 0;
        const difference = scoreA - scoreB;

        let winner: 'A' | 'B' | 'tie' = 'tie';
        if (difference > 0.1) winner = 'A';
        else if (difference < -0.1) winner = 'B';

        return {
            criterionId: criterion.id,
            label: criterion.label,
            scoreA,
            scoreB,
            winner,
            difference,
        };
    });

    // Determine score winners
    const determineWinner = (a: number, b: number): 'A' | 'B' | 'tie' => {
        if (a - b > 0.1) return 'A';
        if (b - a > 0.1) return 'B';
        return 'tie';
    };

    // Price comparison
    const priceDiff = productA.price - productB.price;
    const pricePercentDiff = productB.price > 0
        ? ((productA.price - productB.price) / productB.price) * 100
        : 0;

    // Generate recommendation
    const recommendation = generateRecommendation(scoredA, scoredB, criteriaComparison);

    return {
        productA: scoredA,
        productB: scoredB,
        criteria: criteriaComparison,
        scores: {
            qs: {
                winner: determineWinner(scoredA.computed.qs, scoredB.computed.qs),
                difference: scoredA.computed.qs - scoredB.computed.qs,
            },
            vs: {
                winner: determineWinner(scoredA.computed.vs, scoredB.computed.vs),
                difference: scoredA.computed.vs - scoredB.computed.vs,
            },
            overall: {
                winner: determineWinner(scoredA.computed.overall, scoredB.computed.overall),
                difference: scoredA.computed.overall - scoredB.computed.overall,
            },
        },
        price: {
            cheaper: priceDiff < 0 ? 'A' : priceDiff > 0 ? 'B' : 'tie',
            difference: Math.abs(priceDiff),
            percentDifference: Math.round(pricePercentDiff * 10) / 10,
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

    // Determine best for specific use cases based on criteria groups
    const bestFor: Record<string, 'A' | 'B'> = {};

    // Group QS criteria wins
    const qsCriteria = criteria.filter(c => {
        // This would need access to category, simplified here
        return true;
    });

    if (winsA > winsB) {
        bestFor['qualidade'] = 'A';
    } else if (winsB > winsA) {
        bestFor['qualidade'] = 'B';
    }

    if (productA.computed.vs > productB.computed.vs) {
        bestFor['custo-benefício'] = 'A';
    } else {
        bestFor['custo-benefício'] = 'B';
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
 * Get products within a price range
 */
export function filterByPriceRange(
    products: ScoredProduct[],
    minPrice: number,
    maxPrice: number
): ScoredProduct[] {
    return products.filter(p => p.price >= minPrice && p.price <= maxPrice);
}

/**
 * Get the best value product (highest VS score per price)
 */
export function getBestValue(products: ScoredProduct[]): ScoredProduct | null {
    if (products.length === 0) return null;

    return products.reduce((best, current) => {
        const bestRatio = best.computed.vs / best.price;
        const currentRatio = current.computed.vs / current.price;
        return currentRatio > bestRatio ? current : best;
    });
}
