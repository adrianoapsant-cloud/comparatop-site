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
    RatingCriteria,
} from '@/types/category';
import { getCategoryById, getReferencePrice } from '@/config/categories';

// ============================================
// MAIN SCORING FUNCTION
// ============================================

/**
 * Calculate all scores for a product based on its category definition.
 * This is the core proprietary algorithm.
 * 
 * @param product - The product with raw scores
 * @param category - Optional category override (auto-fetches if not provided)
 * @param profile - Optional user profile for weight adjustments
 * @returns ComputedScores with QS, VS, GS, and overall
 */
export function calculateProductScores(
    product: Product,
    category?: CategoryDefinition | null,
    profile?: UserProfile | null
): ComputedScores {
    // 1. Get category definition
    const cat = category ?? getCategoryById(product.categoryId);
    if (!cat) {
        throw new Error(`Category not found: ${product.categoryId}`);
    }

    // 2. Get effective weights (with profile adjustments)
    const effectiveWeights = getEffectiveWeights(cat, profile);

    // 3. Separate criteria by group
    const qsCriteria = cat.criteria.filter(c => c.group === 'QS');
    const gsCriteria = cat.criteria.filter(c => c.group === 'GS');
    const vsCriteria = cat.criteria.filter(c => c.group === 'VS');

    // 4. Calculate QS (Quality Score) - weighted average of QS group
    const qs = calculateGroupWeightedAverage(product, qsCriteria, effectiveWeights);

    // 5. Calculate GS (Gift Score) - weighted average of GS group
    const gs = calculateGroupWeightedAverage(product, gsCriteria, effectiveWeights);

    // 6. Calculate VS (Value Score) - HYBRID FORMULA
    const vs = calculateValueScore(product, vsCriteria, qs, effectiveWeights, cat.id);

    // 7. Calculate Overall Score
    // Formula: QS 50% + VS 35% + GS 15%
    const overall = (qs * 0.50) + (vs * 0.35) + (gs * 0.15);

    // 8. Calculate price per quality point
    const pricePerPoint = product.price / (overall > 0 ? overall : 1);

    // 9. Generate breakdown
    const breakdown = generateBreakdown(product, cat, effectiveWeights);

    return {
        qs: round(qs),
        vs: round(vs),
        gs: round(gs),
        overall: round(overall),
        pricePerPoint: Math.round(pricePerPoint),
        breakdown,
        profileId: profile?.id ?? null,
    };
}

// ============================================
// GROUP SCORE CALCULATIONS
// ============================================

/**
 * Calculate weighted average for a group of criteria
 */
function calculateGroupWeightedAverage(
    product: Product,
    criteria: RatingCriteria[],
    effectiveWeights: Record<string, number>
): number {
    if (criteria.length === 0) return 0;

    let weightedSum = 0;
    let totalWeight = 0;

    for (const criterion of criteria) {
        const score = product.scores[criterion.id] ?? 0;
        const weight = effectiveWeights[criterion.id] ?? criterion.weight;

        weightedSum += score * weight;
        totalWeight += weight;
    }

    // Return score on 0-10 scale
    return totalWeight > 0 ? (weightedSum / totalWeight) : 0;
}

/**
 * Calculate Value Score (VS) using HYBRID FORMULA
 * 
 * VS = (Editorial Cost-Benefit Score * 0.7) + (Price-Adjusted Quality * 0.3)
 * 
 * Where Price-Adjusted Quality = QS * (1 - price/reference_price)
 * This penalizes expensive products and rewards affordable quality.
 */
function calculateValueScore(
    product: Product,
    vsCriteria: RatingCriteria[],
    qsScore: number,
    effectiveWeights: Record<string, number>,
    categoryId: string
): number {
    // 1. Get editorial cost-benefit score (first VS criterion)
    let editorialVS = 5; // Default if not found

    if (vsCriteria.length > 0) {
        const costBenefitCriterion = vsCriteria[0]; // Usually "Custo-Benefício Real"
        editorialVS = product.scores[costBenefitCriterion.id] ?? 5;
    }

    // 2. Calculate normalized price factor
    // normalizedPrice = 1 - (price / referencePrice), clamped to [0, 1]
    const referencePrice = getReferencePrice(categoryId);
    const priceRatio = product.price / referencePrice;
    const normalizedPriceFactor = Math.max(0, Math.min(1, 1 - priceRatio));

    // 3. Calculate price-adjusted quality score
    // This rewards products that deliver high QS at a lower price
    const priceAdjustedQuality = qsScore * (0.5 + normalizedPriceFactor * 0.5);

    // 4. Apply hybrid formula: 70% editorial + 30% algorithmic
    const vs = (editorialVS * 0.7) + (priceAdjustedQuality * 0.3);

    // Clamp to 0-10 range
    return Math.max(0, Math.min(10, vs));
}

// ============================================
// WEIGHT MANAGEMENT
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

    // Normalize weights to sum to 1.0 (optional, for consistency)
    const sum = Object.values(weights).reduce((a, b) => a + b, 0);
    if (sum > 0 && Math.abs(sum - 1.0) > 0.001) {
        for (const key of Object.keys(weights)) {
            weights[key] = weights[key] / sum;
        }
    }

    return weights;
}

// ============================================
// BREAKDOWN GENERATION
// ============================================

/**
 * Generate detailed breakdown of score calculation
 */
function generateBreakdown(
    product: Product,
    category: CategoryDefinition,
    effectiveWeights: Record<string, number>
): ScoreBreakdown[] {
    return category.criteria.map(criterion => {
        const rawScore = product.scores[criterion.id] ?? 0;
        const weight = effectiveWeights[criterion.id] ?? criterion.weight;

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
    // Score both products
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

    return {
        productA: scoredA,
        productB: scoredB,
        criteria: criteriaComparison,
        scores: {
            qs: {
                winner: determineWinner(scoredA.computed.qs, scoredB.computed.qs),
                difference: round(scoredA.computed.qs - scoredB.computed.qs),
            },
            vs: {
                winner: determineWinner(scoredA.computed.vs, scoredB.computed.vs),
                difference: round(scoredA.computed.vs - scoredB.computed.vs),
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

    // Determine best for specific use cases
    const bestFor: Record<string, 'A' | 'B'> = {};

    if (productA.computed.qs > productB.computed.qs) {
        bestFor['qualidade'] = 'A';
    } else if (productB.computed.qs > productA.computed.qs) {
        bestFor['qualidade'] = 'B';
    }

    if (productA.computed.vs > productB.computed.vs) {
        bestFor['custo-benefício'] = 'A';
    } else if (productB.computed.vs > productA.computed.vs) {
        bestFor['custo-benefício'] = 'B';
    }

    if (productA.computed.gs > productB.computed.gs) {
        bestFor['confiabilidade'] = 'A';
    } else if (productB.computed.gs > productA.computed.gs) {
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
 * Round to 1 decimal place
 */
function round(value: number): number {
    return Math.round(value * 10) / 10;
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
