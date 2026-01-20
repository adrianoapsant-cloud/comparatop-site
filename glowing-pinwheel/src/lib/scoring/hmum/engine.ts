/**
 * @file engine.ts
 * @description Core HMUM calculation engine
 * 
 * Implements the Cobb-Douglas inspired multiplicative utility model:
 * U_i = Π(j=1..n) [x'_ij^w_j]
 * 
 * Key features:
 * - Multiplicative scoring (low scores in one criterion drag down total)
 * - Hybrid weights (objective CRITIC + subjective expert)
 * - Veto thresholds (deal breakers)
 * - Missing data handling (impute or reweight)
 * 
 * @version 2.0.0
 */

import type {
    CategoryHMUMConfig,
    CriterionHMUMConfig,
    HMUMResult,
    CriterionBreakdown,
    HMUMProduct,
} from './types';

import { normalizeValue, getNested } from './normalize';

// ============================================
// MAIN CALCULATION FUNCTION
// ============================================

/**
 * Calculate HMUM score for a product
 * 
 * @param product - Product with raw data
 * @param config - Category HMUM configuration
 * @param objectiveWeights - Optional pre-calculated CRITIC weights
 * @returns Complete HMUM result with score and breakdown
 */
export function calculateHMUMScore(
    product: HMUMProduct,
    config: CategoryHMUMConfig,
    objectiveWeights?: Record<string, number>
): HMUMResult {
    const start = performance.now();
    const warnings: string[] = [];
    const breakdown: CriterionBreakdown[] = [];

    // ========================================
    // PHASE 1: Filter and Prepare Criteria
    // ========================================

    interface ActiveItem {
        crit: CriterionHMUMConfig;
        rawVal: unknown;
        isImputed: boolean;
    }

    const activeItems: ActiveItem[] = [];

    for (const crit of config.criteria) {
        let rawVal = getNested(product, crit.dataField);
        let isImputed = false;

        // Handle missing data
        if (rawVal === undefined || rawVal === null || rawVal === '') {
            if (crit.missingStrategy === 'ignore_reweight') {
                // Skip this criterion, weight will be redistributed
                continue;
            }

            // Impute with penalty value
            rawVal = crit.imputeValue ?? 0;
            isImputed = true;
            warnings.push(`Critério '${crit.id}' imputado com valor ${rawVal}`);
        }

        activeItems.push({ crit, rawVal, isImputed });
    }

    // ========================================
    // PHASE 2: Calculate Hybrid Weights
    // ========================================

    let totalHybridWeight = 0;
    const itemWeights = new Map<string, number>();

    for (const { crit } of activeItems) {
        const wSubj = crit.weightSubjective;
        // Use CRITIC weight if available, otherwise fall back to subjective
        const wObj = objectiveWeights?.[crit.id] ?? wSubj;

        // Hybrid formula: α * Objective + (1-α) * Subjective
        const wHybrid = (config.hybridAlpha * wObj) + ((1 - config.hybridAlpha) * wSubj);

        itemWeights.set(crit.id, wHybrid);
        totalHybridWeight += wHybrid;
    }

    // ========================================
    // PHASE 3: Cobb-Douglas Core (Product)
    // ========================================

    let utilityProduct = 1.0;

    for (const { crit, rawVal, isImputed } of activeItems) {
        // A. Normalize value
        const { value: normVal, isVetoed } = normalizeValue(
            rawVal,
            crit,
            config.vetoPenalty
        );

        if (isVetoed) {
            warnings.push(`VETO aplicado em '${crit.id}' (Valor: ${rawVal})`);
        }

        // B. Normalize weight (ensure sum = 1.0 for active criteria)
        const rawW = itemWeights.get(crit.id)!;
        const finalWeight = totalHybridWeight > 0 ? (rawW / totalHybridWeight) : 0;

        // C. Calculate contribution: x'^w
        const contribution = Math.pow(normVal, finalWeight);
        utilityProduct *= contribution;

        // D. Record breakdown
        const flags: CriterionBreakdown['flags'] = [];
        if (isVetoed) flags.push('VETO');
        if (isImputed) flags.push('IMPUTED');

        breakdown.push({
            criterionId: crit.id,
            label: crit.label,
            rawValue: rawVal,
            normalizedValue: Number(normVal.toFixed(2)),
            finalWeight: Number(finalWeight.toFixed(4)),
            contribution: Number(contribution.toFixed(4)),
            flags,
        });
    }

    // ========================================
    // PHASE 4: Return Result
    // ========================================

    return {
        productId: product.id,
        score: Number(utilityProduct.toFixed(2)),
        breakdown,
        warnings,
        metadata: {
            calculationTimeMs: performance.now() - start,
            criteriaCount: activeItems.length,
            activeWeight: totalHybridWeight,
        },
    };
}

// ============================================
// BATCH CALCULATION
// ============================================

/**
 * Calculate HMUM scores for multiple products
 * 
 * @param products - Array of products
 * @param config - Category HMUM configuration
 * @param objectiveWeights - Optional pre-calculated CRITIC weights
 * @returns Array of HMUM results
 */
export function calculateHMUMBatch(
    products: HMUMProduct[],
    config: CategoryHMUMConfig,
    objectiveWeights?: Record<string, number>
): HMUMResult[] {
    return products.map(product =>
        calculateHMUMScore(product, config, objectiveWeights)
    );
}

// ============================================
// SCORE COMPARISON UTILITIES
// ============================================

/**
 * Rank products by HMUM score (descending)
 */
export function rankByHMUM(results: HMUMResult[]): HMUMResult[] {
    return [...results].sort((a, b) => b.score - a.score);
}

/**
 * Get products with veto flags
 */
export function getVetoedProducts(results: HMUMResult[]): HMUMResult[] {
    return results.filter(r =>
        r.breakdown.some(b => b.flags.includes('VETO'))
    );
}
