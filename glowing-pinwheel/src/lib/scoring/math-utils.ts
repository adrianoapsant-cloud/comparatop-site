/**
 * @file math-utils.ts
 * @description Mathematical Primitives for HMUM (Hybrid Multiplicative Utility Model)
 * 
 * This module provides pure functions for:
 * - Non-linear normalization curves (Sigmoid, Log-Normal)
 * - Weighted Product Model aggregation
 * - Soft constraint multipliers
 * 
 * @why We abandoned the Linear Additive Model (Score = Base + Bonus) because it
 * suffers from "Ceiling Effect": when base is 10 and we add bonuses, the score
 * clamps at 10, making all "good" products identical.
 * 
 * The Multiplicative Model (Score = Product(Utility^Weight)) solves this by:
 * 1. Normalizing all attributes to 0-1 utility scale
 * 2. Using geometric aggregation that preserves relative differences
 * 3. Preventing any single attribute from hitting absolute ceiling
 * 
 * @version 2.0.0 (HMUM Architecture)
 * @see https://en.wikipedia.org/wiki/Weighted_product_model
 */

// ============================================
// CONSTANTS
// ============================================

/**
 * Epsilon value to prevent zero multiplication catastrophe.
 * In multiplicative models, a single zero would collapse the entire score.
 * This ensures non-fatal attributes always contribute positively.
 */
export const EPSILON = 0.01;

/**
 * Maximum utility value (asymptotic ceiling).
 * We use 0.99 instead of 1.0 to prevent perfect scores and maintain differentiation.
 */
export const MAX_UTILITY = 0.99;

/**
 * Minimum utility value for non-fatal attributes.
 */
export const MIN_UTILITY = EPSILON;

// ============================================
// SIGMOID NORMALIZATION
// ============================================

/**
 * Sigmoid (S-Curve) Normalization for Technical Specifications.
 * 
 * @description Transforms raw spec values (nits, Hz, dB) into utility (0-1) using
 * a logistic function. This creates a smooth S-curve that:
 * - Starts slow near zero
 * - Accelerates around the midpoint
 * - Saturates asymptotically toward the limit (never touches 1.0)
 * 
 * @why We use Sigmoid instead of Linear because:
 * 1. **Ceiling Prevention:** Linear normalization with (value/max) hits 1.0 at max.
 *    Sigmoid approaches but never reaches the limit, preserving differentiation.
 * 2. **Diminishing Returns:** Going from 1000 to 2000 nits matters more than
 *    going from 4000 to 5000 nits. Sigmoid naturally models this.
 * 3. **Robustness:** Outliers don't distort the scale as much.
 * 
 * @formula
 * U = limit / (1 + e^(-steepness * (value - midpoint)))
 * 
 * @param value - Raw spec value (e.g., 1000 nits, 120 Hz)
 * @param midpoint - Value where utility = limit/2 (inflection point)
 * @param steepness - How quickly the curve rises (higher = sharper transition)
 * @param limit - Asymptotic maximum (default 0.99 to prevent ceiling)
 * @returns Utility value in range [EPSILON, limit]
 * 
 * @example
 * // TV brightness normalization
 * sigmoidNormalization(1000, 800, 0.003, 0.99); // ≈ 0.65
 * sigmoidNormalization(2000, 800, 0.003, 0.99); // ≈ 0.94
 * sigmoidNormalization(4000, 800, 0.003, 0.99); // ≈ 0.98 (never reaches 0.99)
 */
export function sigmoidNormalization(
    value: number,
    midpoint: number,
    steepness: number = 0.01,
    limit: number = MAX_UTILITY
): number {
    // Handle edge cases
    if (value <= 0) return MIN_UTILITY;
    if (!isFinite(value)) return limit;

    // Logistic function: L / (1 + e^(-k(x-x0)))
    const exponent = -steepness * (value - midpoint);
    const utility = limit / (1 + Math.exp(exponent));

    // Ensure we stay within bounds and never hit exact ceiling
    return Math.max(MIN_UTILITY, Math.min(limit, utility));
}

// ============================================
// LOG-NORMAL NORMALIZATION (PRICE/VALUE)
// ============================================

/**
 * Log-Normal Normalization for Price Sensitivity.
 * 
 * @description Transforms price into "Value for Money" utility using logarithmic
 * scaling. This models consumer behavior where:
 * - The difference between R$1000 and R$2000 feels significant
 * - The difference between R$9000 and R$10000 feels negligible
 * 
 * @why We use Log instead of Linear because:
 * 1. **Psychophysics:** Weber-Fechner law states perception is logarithmic.
 * 2. **Price Sensitivity:** Consumers are more sensitive to price changes
 *    at lower price points (decreasing marginal sensitivity).
 * 3. **Range Normalization:** Prevents expensive outliers from dominating.
 * 
 * @formula
 * U = 1 - (log(price) - log(min)) / (log(max) - log(min))
 * 
 * Note: Lower price = higher utility (inverted scale)
 * 
 * @param price - Product price in BRL
 * @param minPrice - Minimum price in category (maps to utility ≈ 1)
 * @param maxPrice - Maximum price in category (maps to utility ≈ 0)
 * @returns Utility value in range [EPSILON, MAX_UTILITY]
 * 
 * @example
 * // TV price normalization (range R$1000 to R$15000)
 * logNormalNormalization(1000, 1000, 15000);  // ≈ 0.99 (best value)
 * logNormalNormalization(3000, 1000, 15000);  // ≈ 0.67
 * logNormalNormalization(10000, 1000, 15000); // ≈ 0.20
 * logNormalNormalization(15000, 1000, 15000); // ≈ 0.01 (worst value)
 */
export function logNormalNormalization(
    price: number,
    minPrice: number,
    maxPrice: number
): number {
    // Handle edge cases
    if (price <= 0 || minPrice <= 0 || maxPrice <= 0) return MIN_UTILITY;
    if (price <= minPrice) return MAX_UTILITY;
    if (price >= maxPrice) return MIN_UTILITY;

    // Logarithmic normalization (inverted: lower price = higher utility)
    const logPrice = Math.log(price);
    const logMin = Math.log(minPrice);
    const logMax = Math.log(maxPrice);

    // Avoid division by zero
    if (logMax === logMin) return 0.5;

    // Inverted: low price = high utility
    const normalizedLog = (logPrice - logMin) / (logMax - logMin);
    const utility = 1 - normalizedLog;

    // Apply ceiling cap
    return Math.max(MIN_UTILITY, Math.min(MAX_UTILITY, utility));
}

// ============================================
// LINEAR NORMALIZATION (SIMPLE CASES)
// ============================================

/**
 * Linear Normalization for simple bounded attributes.
 * 
 * @description Standard min-max normalization with ceiling cap.
 * Use for attributes without strong diminishing returns.
 * 
 * @param value - Raw value
 * @param min - Minimum expected value (maps to MIN_UTILITY)
 * @param max - Maximum expected value (maps to MAX_UTILITY)
 * @param invert - If true, higher values = lower utility
 * @returns Utility value in range [EPSILON, MAX_UTILITY]
 */
export function linearNormalization(
    value: number,
    min: number,
    max: number,
    invert: boolean = false
): number {
    if (max === min) return 0.5;

    let normalized = (value - min) / (max - min);
    normalized = Math.max(0, Math.min(1, normalized));

    if (invert) {
        normalized = 1 - normalized;
    }

    // Apply ceiling cap to prevent hitting 1.0
    return Math.max(MIN_UTILITY, Math.min(MAX_UTILITY, normalized));
}

// ============================================
// BOOLEAN NORMALIZATION
// ============================================

/**
 * Boolean Normalization for binary attributes.
 * 
 * @description Converts boolean features to utility values.
 * Presence of a positive feature = high utility.
 * 
 * @param value - Boolean value
 * @param presentUtility - Utility when true (default 0.95)
 * @param absentUtility - Utility when false (default 0.50 - neutral)
 * @returns Utility value
 */
export function booleanNormalization(
    value: boolean | undefined | null,
    presentUtility: number = 0.95,
    absentUtility: number = 0.50
): number {
    if (value === true) {
        return Math.min(presentUtility, MAX_UTILITY);
    }
    return Math.max(absentUtility, MIN_UTILITY);
}

// ============================================
// WEIGHTED PRODUCT MODEL (WPM) AGGREGATION
// ============================================

/**
 * Weighted Product Model Aggregation.
 * 
 * @description Aggregates multiple utility values using geometric weighted mean.
 * This is the core of the Multi-Attribute Utility Theory (MAUT) approach.
 * 
 * @why We use WPM instead of Weighted Sum (WSM) because:
 * 1. **No Ceiling Effect:** Products never hit perfect 10.0
 * 2. **Interdependence:** One bad attribute drags down the whole score
 *    (more realistic than simple averaging)
 * 3. **Proportional:** Relative rankings are preserved across contexts
 * 
 * @formula
 * S = ∏(U_i)^(w_i) = U_1^w_1 × U_2^w_2 × ... × U_n^w_n
 * 
 * Where:
 * - U_i = Utility of attribute i (0-1)
 * - w_i = Weight of attribute i (should sum to 1)
 * - S = Final score (0-1)
 * 
 * @param utilities - Map of attribute ID to utility value (0-1)
 * @param weights - Map of attribute ID to weight (should sum to 1)
 * @returns Aggregated score in range [0, 1]
 * 
 * @example
 * // TV evaluation with 3 criteria
 * const utilities = { brightness: 0.8, contrast: 0.9, price: 0.6 };
 * const weights = { brightness: 0.3, contrast: 0.4, price: 0.3 };
 * weightedProductModel(utilities, weights);
 * // = 0.8^0.3 × 0.9^0.4 × 0.6^0.3 ≈ 0.76
 */
export function weightedProductModel(
    utilities: Record<string, number>,
    weights: Record<string, number>
): number {
    const utilityKeys = Object.keys(utilities);

    if (utilityKeys.length === 0) {
        return MIN_UTILITY;
    }

    // Normalize weights to sum to 1
    const weightSum = Object.values(weights).reduce((sum, w) => sum + w, 0);
    const normalizedWeights: Record<string, number> = {};

    for (const key of Object.keys(weights)) {
        normalizedWeights[key] = weightSum > 0 ? weights[key] / weightSum : 1 / utilityKeys.length;
    }

    // Calculate geometric weighted product
    let product = 1.0;

    for (const key of utilityKeys) {
        const utility = utilities[key] ?? MIN_UTILITY;
        const weight = normalizedWeights[key] ?? 0;

        // Clamp utility to safe range to prevent math errors
        const safeUtility = Math.max(MIN_UTILITY, Math.min(MAX_UTILITY, utility));

        // Apply power: utility^weight
        product *= Math.pow(safeUtility, weight);
    }

    // Final score (already in 0-1 range)
    return Math.max(MIN_UTILITY, Math.min(MAX_UTILITY, product));
}

// ============================================
// PENALTY MULTIPLIERS (SOFT CONSTRAINTS)
// ============================================

/**
 * Apply Penalty Multiplier for Soft Constraints.
 * 
 * @description Reduces score by a multiplicative factor for non-fatal
 * constraints (e.g., missing feature, suboptimal spec).
 * 
 * @why We use multiplication instead of subtraction because:
 * 1. **Proportional Impact:** A 20% penalty on a 9.0 product hurts more
 *    (9.0 → 7.2) than on a 5.0 product (5.0 → 4.0)
 * 2. **No Negative Scores:** Multiplication can't produce negative values
 * 3. **Composable:** Multiple penalties can be chained
 * 
 * @param score - Current score (0-1 or 0-10)
 * @param penaltyFactor - Multiplier (0.7 = 30% reduction, 0.5 = 50% reduction)
 * @returns Reduced score
 * 
 * @example
 * applyPenaltyMultiplier(0.85, 0.8); // 0.85 × 0.8 = 0.68 (20% penalty)
 * applyPenaltyMultiplier(0.85, 0.5); // 0.85 × 0.5 = 0.425 (50% penalty)
 */
export function applyPenaltyMultiplier(
    score: number,
    penaltyFactor: number
): number {
    // Clamp penalty factor between 0 and 1
    const safeFactor = Math.max(0, Math.min(1, penaltyFactor));

    return score * safeFactor;
}

/**
 * Apply multiple penalties in sequence.
 * 
 * @param score - Current score
 * @param penalties - Array of penalty factors (e.g., [0.9, 0.8, 0.7])
 * @returns Score with all penalties applied
 */
export function applyMultiplePenalties(
    score: number,
    penalties: number[]
): number {
    let result = score;

    for (const penalty of penalties) {
        result = applyPenaltyMultiplier(result, penalty);
    }

    return Math.max(MIN_UTILITY, result);
}

// ============================================
// SCALE CONVERSION UTILITIES
// ============================================

/**
 * Convert utility (0-1) to display score (0-10).
 */
export function utilityToDisplayScore(utility: number): number {
    return Math.round(utility * 100) / 10; // 0.85 → 8.5
}

/**
 * Convert display score (0-10) to utility (0-1).
 */
export function displayScoreToUtility(score: number): number {
    return Math.max(MIN_UTILITY, Math.min(MAX_UTILITY, score / 10));
}

// ============================================
// CURVE CONFIGURATION TYPES
// ============================================

/**
 * Sigmoid curve parameters for a specific attribute.
 */
export interface SigmoidParams {
    midpoint: number;
    steepness: number;
    limit?: number;
}

/**
 * Linear curve parameters.
 */
export interface LinearParams {
    min: number;
    max: number;
    invert?: boolean;
}

/**
 * Log-normal curve parameters for price.
 */
export interface LogNormalParams {
    minPrice: number;
    maxPrice: number;
}

// ============================================
// EXPORT ALL
// ============================================

export const HMUM_MATH = {
    EPSILON,
    MAX_UTILITY,
    MIN_UTILITY,
    sigmoidNormalization,
    logNormalNormalization,
    linearNormalization,
    booleanNormalization,
    weightedProductModel,
    applyPenaltyMultiplier,
    applyMultiplePenalties,
    utilityToDisplayScore,
    displayScoreToUtility,
} as const;
