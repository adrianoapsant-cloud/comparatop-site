/**
 * Metric Confidence Types & Helpers
 * 
 * Provides optional confidence/range metadata for metrics like
 * Nota Contextual, TCO, etc. without breaking existing schema.
 * 
 * Usage:
 *   import { getMetricValue, getMetricRange, getMetricConfidence } from '@/lib/metrics/confidence';
 */

// ============================================
// Types
// ============================================

export type ConfidenceLevel = 'high' | 'medium' | 'low';

/**
 * A metric value with optional confidence metadata.
 * Can be used as union: value: number | MetricWithConfidence<number>
 */
export interface MetricWithConfidence<T = number> {
    value: T;
    range?: [T, T];
    confidenceLevel?: ConfidenceLevel;
    confidenceNote?: string;
}

/**
 * Parallel fields approach for existing Product interface.
 * These can be added optionally to any product without breaking existing code.
 */
export interface ProductConfidenceFields {
    // Contextual Score confidence
    contextualScoreRange?: [number, number];
    contextualScoreConfidence?: ConfidenceLevel;
    contextualScoreConfidenceNote?: string;

    // TCO confidence
    tcoTotalRange?: [number, number];
    tcoConfidence?: ConfidenceLevel;
    tcoConfidenceNote?: string;

    // Base Score confidence (optional)
    baseScoreRange?: [number, number];
    baseScoreConfidence?: ConfidenceLevel;
    baseScoreConfidenceNote?: string;
}

// ============================================
// Helper Functions
// ============================================

/**
 * Extract the numeric value from either a plain number or MetricWithConfidence
 */
export function getMetricValue<T = number>(
    input: T | MetricWithConfidence<T> | null | undefined
): T | null {
    if (input == null) return null;
    if (typeof input === 'object' && 'value' in input) {
        return (input as MetricWithConfidence<T>).value;
    }
    return input as T;
}

/**
 * Extract the range from MetricWithConfidence, or return null
 */
export function getMetricRange<T = number>(
    input: T | MetricWithConfidence<T> | null | undefined
): [T, T] | null {
    if (input == null) return null;
    if (typeof input === 'object' && 'range' in input) {
        return (input as MetricWithConfidence<T>).range ?? null;
    }
    return null;
}

/**
 * Extract the confidence level from MetricWithConfidence, or return null
 */
export function getMetricConfidence<T = number>(
    input: T | MetricWithConfidence<T> | null | undefined
): ConfidenceLevel | null {
    if (input == null) return null;
    if (typeof input === 'object' && 'confidenceLevel' in input) {
        return (input as MetricWithConfidence<T>).confidenceLevel ?? null;
    }
    return null;
}

/**
 * Extract the confidence note from MetricWithConfidence, or return null
 */
export function getMetricNote<T = number>(
    input: T | MetricWithConfidence<T> | null | undefined
): string | null {
    if (input == null) return null;
    if (typeof input === 'object' && 'confidenceNote' in input) {
        return (input as MetricWithConfidence<T>).confidenceNote ?? null;
    }
    return null;
}

// ============================================
// Parallel Fields Helpers (Option A)
// ============================================

/**
 * Build a MetricWithConfidence object from parallel fields.
 * Use this when you have separate fields in the product data.
 */
export function buildMetricFromParallelFields<T = number>(
    value: T | null | undefined,
    range?: [T, T] | null,
    confidenceLevel?: ConfidenceLevel | null,
    confidenceNote?: string | null
): MetricWithConfidence<T> | null {
    if (value == null) return null;

    return {
        value,
        ...(range && { range }),
        ...(confidenceLevel && { confidenceLevel }),
        ...(confidenceNote && { confidenceNote }),
    };
}

/**
 * Get confidence CSS class based on level
 */
export function getConfidenceClass(level: ConfidenceLevel | null | undefined): string {
    switch (level) {
        case 'high':
            return 'ct-evidence--high';
        case 'medium':
            return 'ct-evidence--med';
        case 'low':
            return 'ct-evidence--low';
        default:
            return '';
    }
}

/**
 * Get confidence label in Portuguese
 */
export function getConfidenceLabel(level: ConfidenceLevel | null | undefined): string {
    switch (level) {
        case 'high':
            return 'Alta';
        case 'medium':
            return 'Média';
        case 'low':
            return 'Baixa';
        default:
            return '';
    }
}
