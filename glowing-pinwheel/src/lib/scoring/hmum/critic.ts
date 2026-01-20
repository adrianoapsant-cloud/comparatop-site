/**
 * @file critic.ts
 * @description CRITIC method for objective weight calculation
 * 
 * CRITIC = CRiteria Importance Through Intercriteria Correlation
 * 
 * Formula: C_j = σ_j * Σ(1 - r_jk)
 * Where:
 * - σ_j = standard deviation of criterion j
 * - r_jk = Pearson correlation between criteria j and k
 * 
 * This method:
 * - Considers both contrast (variation) and conflict (correlation)
 * - Reduces weight of redundant criteria
 * - Values criteria that bring unique information
 * 
 * @version 2.0.0
 */

import type { CriterionHMUMConfig, HMUMProduct } from './types';
import { normalizeValue, getNested } from './normalize';

// ============================================
// CRITIC WEIGHT CALCULATION
// ============================================

/**
 * Calculate objective weights using CRITIC method
 * 
 * @param products - Array of products (minimum 2 required)
 * @param criteria - Array of criterion configurations
 * @returns Record of criterion ID to weight (0-1, sum = 1)
 */
export function calculateCRITICWeights(
    products: HMUMProduct[],
    criteria: CriterionHMUMConfig[]
): Record<string, number> {
    const n = products.length;

    // Require at least 2 products for statistical analysis
    if (n < 2) {
        console.warn('[CRITIC] Requires at least 2 products, returning empty weights');
        return {};
    }

    // ========================================
    // STEP 1: Build Normalized Data Matrix
    // ========================================

    const matrix: Record<string, number[]> = {};

    for (const crit of criteria) {
        matrix[crit.id] = products.map(product => {
            const raw = getNested(product, crit.dataField);

            // Use impute value if null (to avoid breaking statistics)
            const safeRaw = (raw === undefined || raw === null)
                ? (crit.imputeValue ?? 0)
                : raw;

            // Normalize to 0-10 scale
            return normalizeValue(safeRaw, crit).value;
        });
    }

    // ========================================
    // STEP 2: Calculate Standard Deviation
    // ========================================

    const stdDevs: Record<string, number> = {};

    for (const crit of criteria) {
        const arr = matrix[crit.id];
        const mean = arr.reduce((a, b) => a + b, 0) / n;
        const variance = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
        stdDevs[crit.id] = Math.sqrt(variance);
    }

    // ========================================
    // STEP 3: Calculate Conflict (1 - correlation)
    // ========================================

    const C_values: Record<string, number> = {};

    for (const j of criteria) {
        let conflictSum = 0;

        for (const k of criteria) {
            const r_jk = pearsonCorrelation(matrix[j.id], matrix[k.id]);
            conflictSum += (1 - r_jk);
        }

        // C_j = σ_j * Σ(1 - r_jk)
        C_values[j.id] = stdDevs[j.id] * conflictSum;
    }

    // ========================================
    // STEP 4: Normalize to Weights (sum = 1)
    // ========================================

    const sumC = Object.values(C_values).reduce((a, b) => a + b, 0);
    const weights: Record<string, number> = {};

    for (const crit of criteria) {
        weights[crit.id] = sumC > 0 ? (C_values[crit.id] / sumC) : 0;
    }

    return weights;
}

// ============================================
// STATISTICAL HELPERS
// ============================================

/**
 * Calculate Pearson correlation coefficient between two arrays
 * 
 * @returns r value between -1 and 1
 */
function pearsonCorrelation(x: number[], y: number[]): number {
    const n = x.length;

    if (n === 0 || n !== y.length) return 0;

    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

    for (let i = 0; i < n; i++) {
        sumX += x[i];
        sumY += y[i];
        sumXY += x[i] * y[i];
        sumX2 += x[i] ** 2;
        sumY2 += y[i] ** 2;
    }

    const numerator = (n * sumXY) - (sumX * sumY);
    const denominator = Math.sqrt(
        (n * sumX2 - sumX ** 2) * (n * sumY2 - sumY ** 2)
    );

    // Avoid division by zero
    return denominator === 0 ? 0 : numerator / denominator;
}

/**
 * Calculate mean of an array
 */
export function mean(arr: number[]): number {
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

/**
 * Calculate standard deviation of an array
 */
export function stdDev(arr: number[]): number {
    const n = arr.length;
    if (n === 0) return 0;

    const avg = mean(arr);
    const variance = arr.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / n;
    return Math.sqrt(variance);
}
