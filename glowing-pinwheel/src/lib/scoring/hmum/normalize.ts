/**
 * @file normalize.ts
 * @description Normalization functions for HMUM
 * 
 * Converts raw product values to 0-10 utility scale using:
 * - Sigmoid (for diminishing returns / Weber-Fechner law)
 * - Linear (for simple min-max scaling)
 * - Ordinal (for categorical values like "LiDAR", "VSLAM")
 * - Boolean (for yes/no features)
 * 
 * @version 2.0.0
 */

import type { CriterionHMUMConfig } from './types';

/**
 * Result of normalization including veto status
 */
export interface NormalizeResult {
    /** Normalized value (0-10, or epsilon if vetoed) */
    value: number;
    /** Whether this value triggered a veto (deal breaker) */
    isVetoed: boolean;
}

/**
 * Normalize a raw value to 0-10 scale based on criterion configuration
 * 
 * @param rawValue - The raw value from the product
 * @param config - Criterion configuration with normalization settings
 * @param vetoPenalty - Epsilon value for vetoed criteria (default: 0.01)
 * @returns Normalized value and veto status
 */
export function normalizeValue(
    rawValue: unknown,
    config: CriterionHMUMConfig,
    vetoPenalty: number = 0.01
): NormalizeResult {
    const L = 10; // Maximum score

    // ========================================
    // STEP 1: Convert/Map raw value to number
    // ========================================

    let val: number;

    if (config.normalization.method === 'ordinal') {
        // Ordinal mapping (e.g., "LiDAR" → 9.5)
        const map = config.normalization.ordinalMap || {};
        const key = String(rawValue);

        // Try exact match, then case-insensitive
        val = map[key] ??
            Object.entries(map).find(
                ([k]) => k.toLowerCase() === key.toLowerCase()
            )?.[1] ??
            0;

    } else if (config.normalization.method === 'boolean') {
        // Boolean mapping (e.g., true → 10, false → 5)
        const { trueVal = 10, falseVal = 5 } = config.normalization.booleanMap || {};
        val = rawValue ? trueVal : falseVal;

    } else {
        // Numeric value
        val = Number(rawValue);
    }

    // Handle NaN
    if (isNaN(val)) {
        return { value: vetoPenalty, isVetoed: false };
    }

    // ========================================
    // STEP 2: Check for Veto (Deal Breaker)
    // ========================================

    let isVetoed = false;

    if (config.vetoThreshold !== undefined) {
        if (config.direction === 'maximize' && val < config.vetoThreshold) {
            // For maximize: value below threshold is bad
            isVetoed = true;
        }
        if (config.direction === 'minimize' && val > config.vetoThreshold) {
            // For minimize: value above threshold is bad (e.g., noise > 80dB)
            isVetoed = true;
        }
    }

    if (isVetoed) {
        return { value: vetoPenalty, isVetoed: true };
    }

    // ========================================
    // STEP 3: Apply Normalization Function
    // ========================================

    let score: number;

    if (config.normalization.method === 'sigmoid' && config.normalization.sigmoidParams) {
        // Sigmoid: L / (1 + e^(-k*(x - x0)))
        const { k, x0 } = config.normalization.sigmoidParams;

        // Invert steepness for "minimize" direction
        const steepness = config.direction === 'maximize' ? k : -Math.abs(k);

        score = L / (1 + Math.exp(-steepness * (val - x0)));

    } else if (config.normalization.method === 'linear' && config.normalization.linearRange) {
        // Linear: (val - min) / (max - min) * L
        const { min, max } = config.normalization.linearRange;
        const clamped = Math.max(min, Math.min(max, val));

        if (config.direction === 'maximize') {
            score = ((clamped - min) / (max - min)) * L;
        } else {
            // Inverted for minimize
            score = ((max - clamped) / (max - min)) * L;
        }

    } else if (config.normalization.method === 'ordinal' || config.normalization.method === 'boolean') {
        // Already converted to score in step 1
        score = val;

    } else {
        // Fallback: assume value is already 0-10
        score = val;
    }

    // ========================================
    // STEP 4: Clamp to valid range
    // ========================================

    return {
        value: Math.max(vetoPenalty, Math.min(L, score)),
        isVetoed: false
    };
}

/**
 * Get nested property from object using dot notation
 * Example: getNested(obj, "specs.motor.power") → obj.specs.motor.power
 */
export function getNested(obj: unknown, path: string): unknown {
    return path.split('.').reduce(
        (current, key) => (current as Record<string, unknown>)?.[key],
        obj
    );
}
