/**
 * @file hmum-types.ts
 * @description Type definitions for the Hybrid Multiplicative Utility Model (HMUM)
 * 
 * Based on Deep Research report "Metodologia HMUM para Eletroeletrônicos"
 * and Deep Thinking implementation guidance.
 * 
 * Formula: U_i = Π(j=1..n) [x'_ij^w_j]
 * 
 * @version 2.0.0
 */

// ============================================
// BASIC TYPES
// ============================================

/** Normalization method for converting raw values to 0-10 scale */
export type NormalizationMethod = 'sigmoid' | 'linear' | 'ordinal' | 'boolean';

/** Whether higher or lower values are better */
export type OptimizationDirection = 'maximize' | 'minimize';

/** How to handle missing data */
export type MissingDataStrategy = 'ignore_reweight' | 'impute_penalty';

// ============================================
// NORMALIZATION CONFIG
// ============================================

/**
 * Parameters for sigmoid normalization curve
 * Formula: L / (1 + e^(-k*(x - x0)))
 */
export interface SigmoidParams {
    /** Steepness (inclinação). Higher = sharper transition. Ex: 0.0015 */
    k: number;
    /** Midpoint (ponto de inflexão). Value where score = 5.0. Ex: 4000 */
    x0: number;
}

/**
 * Configuration for normalizing raw values to 0-10 scale
 */
export interface NormalizationConfig {
    method: NormalizationMethod;

    /** Parameters for sigmoid curve (when method = 'sigmoid') */
    sigmoidParams?: SigmoidParams;

    /** Min/max range for linear normalization (when method = 'linear') */
    linearRange?: { min: number; max: number };

    /** Mapping for ordinal/categorical values (when method = 'ordinal') */
    ordinalMap?: Record<string, number>;

    /** Mapping for boolean values (when method = 'boolean') */
    booleanMap?: { trueVal: number; falseVal: number };
}

// ============================================
// CRITERION CONFIG
// ============================================

/**
 * Configuration for a single criterion in HMUM calculation
 */
export interface CriterionHMUMConfig {
    /** Unique ID (ex: "c_succao", "c_navegacao") */
    id: string;

    /** Human-readable label for reports */
    label: string;

    /** JSON path to raw value in product (ex: "specs.succao_pa") */
    dataField: string;

    // ----------------------------------------
    // WEIGHT CONFIGURATION
    // ----------------------------------------

    /** Subjective weight from experts (0.0 to 1.0) */
    weightSubjective: number;

    // ----------------------------------------
    // SCORING LOGIC
    // ----------------------------------------

    /** Whether higher or lower values are better */
    direction: OptimizationDirection;

    /** How to normalize raw values */
    normalization: NormalizationConfig;

    // ----------------------------------------
    // DEAL BREAKERS (VETO)
    // ----------------------------------------

    /** Threshold below/above which product is penalized */
    vetoThreshold?: number;

    // ----------------------------------------
    // MISSING DATA HANDLING
    // ----------------------------------------

    /** Strategy for missing data */
    missingStrategy: MissingDataStrategy;

    /** Value to impute if strategy = 'impute_penalty' */
    imputeValue?: number;
}

// ============================================
// CATEGORY CONFIG
// ============================================

/**
 * Complete HMUM configuration for a product category
 */
export interface CategoryHMUMConfig {
    /** Category ID (ex: "robo-aspirador", "smart-tv") */
    categoryId: string;

    /** Mixing factor: α * Objective + (1-α) * Subjective. Default: 0.6 */
    hybridAlpha: number;

    /** Epsilon value for vetoed criteria. Default: 0.01 */
    vetoPenalty: number;

    /** List of criteria configurations */
    criteria: CriterionHMUMConfig[];
}

// ============================================
// CALCULATION RESULT
// ============================================

/**
 * Breakdown of a single criterion's contribution to the score
 */
export interface CriterionBreakdown {
    /** Criterion ID */
    criterionId: string;

    /** Human-readable label */
    label: string;

    /** Original raw value from product */
    rawValue: unknown;

    /** Normalized value (0-10 scale) */
    normalizedValue: number;

    /** Final weight used in calculation (normalized to sum = 1) */
    finalWeight: number;

    /** Multiplicative contribution: x'^w */
    contribution: number;

    /** Flags for special conditions */
    flags: ('VETO' | 'IMPUTED' | 'IGNORED')[];
}

/**
 * Complete result of HMUM calculation
 */
export interface HMUMResult {
    /** Product ID */
    productId: string;

    /** Final HMUM score (0-10) */
    score: number;

    /** Detailed breakdown by criterion */
    breakdown: CriterionBreakdown[];

    /** Diagnostic warnings */
    warnings: string[];

    /** Calculation metadata */
    metadata: {
        calculationTimeMs: number;
        criteriaCount: number;
        activeWeight: number;
    };
}

// ============================================
// PRODUCT INTERFACE (minimal for HMUM)
// ============================================

/**
 * Minimal product interface for HMUM calculations
 */
export interface HMUMProduct {
    id: string;
    [key: string]: unknown;
}
