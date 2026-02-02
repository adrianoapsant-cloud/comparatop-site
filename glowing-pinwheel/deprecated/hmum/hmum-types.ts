/**
 * @file hmum-types.ts
 * @description Type Definitions for HMUM (Hybrid Multiplicative Utility Model)
 * 
 * This module defines the new ontology for the multiplicative scoring architecture.
 * These types are separate from the legacy types to avoid breaking existing code.
 * 
 * Key Concepts:
 * - **Utility (0-1):** Normalized value representing attribute quality
 * - **Context:** User profile that adjusts attribute weights
 * - **Constraint:** Conditions that modify or eliminate products
 * - **Curve:** Normalization function for raw specs
 * 
 * @version 2.0.0 (HMUM Architecture)
 */

// ============================================
// ATTRIBUTE CURVES (Normalization Functions)
// ============================================

/**
 * Curve types for normalizing raw specifications to utility (0-1).
 */
export type CurveType = 'sigmoid' | 'linear' | 'log_normal' | 'boolean' | 'passthrough';

/**
 * Sigmoid curve configuration.
 * 
 * @description S-curve for technical specs with diminishing returns.
 * Good for: brightness (nits), refresh rate (Hz), storage (GB).
 */
export interface SigmoidCurveConfig {
    type: 'sigmoid';
    /** Value where utility = 0.5 (inflection point) */
    midpoint: number;
    /** Steepness of the curve (0.001 = gradual, 0.1 = sharp) */
    steepness: number;
    /** Asymptotic maximum (default 0.99) */
    limit?: number;
}

/**
 * Linear curve configuration.
 * 
 * @description Simple min-max normalization.
 * Good for: warranty years, number of ports.
 */
export interface LinearCurveConfig {
    type: 'linear';
    /** Minimum expected value (maps to 0.01) */
    min: number;
    /** Maximum expected value (maps to 0.99) */
    max: number;
    /** If true, higher values = lower utility (e.g., noise dB) */
    invert?: boolean;
}

/**
 * Log-normal curve configuration.
 * 
 * @description Logarithmic scaling for price sensitivity.
 * Good for: price (value for money).
 */
export interface LogNormalCurveConfig {
    type: 'log_normal';
    /** Minimum price in category (best value) */
    minPrice: number;
    /** Maximum price in category (worst value) */
    maxPrice: number;
}

/**
 * Boolean curve configuration.
 * 
 * @description Binary features (has/doesn't have).
 * Good for: HDR support, VRR support, warranty included.
 */
export interface BooleanCurveConfig {
    type: 'boolean';
    /** Utility when feature is present (default 0.95) */
    presentUtility?: number;
    /** Utility when feature is absent (default 0.50) */
    absentUtility?: number;
}

/**
 * Passthrough configuration (already normalized 0-1).
 */
export interface PassthroughCurveConfig {
    type: 'passthrough';
}

/**
 * Union type for all curve configurations.
 */
export type CurveConfig =
    | SigmoidCurveConfig
    | LinearCurveConfig
    | LogNormalCurveConfig
    | BooleanCurveConfig
    | PassthroughCurveConfig;

// ============================================
// ATTRIBUTE DEFINITIONS
// ============================================

/**
 * Definition of a single attribute for HMUM evaluation.
 */
export interface AttributeDefinition {
    /** Unique identifier (e.g., 'peak_brightness', 'input_lag') */
    id: string;

    /** Display label in Portuguese (e.g., 'Brilho de Pico') */
    label: string;

    /** Path to extract value from product specs (e.g., 'specs.peak_brightness_nits') */
    specPath: string;

    /** Normalization curve configuration */
    curve: CurveConfig;

    /** Default weight (used when context doesn't specify) */
    defaultWeight: number;

    /** Default value if spec is missing (conservative estimate) */
    defaultValue?: unknown;

    /** Whether this attribute is required (missing = fatal) */
    required?: boolean;

    /** Group for UI organization */
    group?: 'quality' | 'value' | 'reliability' | 'features' | 'performance' | 'display' | 'portability' | 'storage';

    /** Description for documentation */
    description?: string;
}

// ============================================
// CONTEXT CONFIGURATION
// ============================================

/**
 * Context-specific weight configuration.
 * 
 * @description Defines how attribute weights shift based on user profile.
 * For example, in "Gamer" context, input lag weight goes from 0.1 to 0.4.
 */
export interface ContextWeights {
    /** Map of attribute ID to weight override */
    weights: Record<string, number>;
}

/**
 * Full context configuration.
 */
export interface ContextConfig {
    /** Unique identifier (e.g., 'gamer', 'cinema', 'litoral') */
    id: string;

    /** Display name in Portuguese (e.g., 'Gamer (PS5/Xbox/PC)') */
    name: string;

    /** Description of this context */
    description?: string;

    /** Icon for UI */
    icon?: string;

    /** Weight overrides for this context */
    weights: Record<string, number>;

    /** Constraints specific to this context */
    constraints?: ConstraintDefinition[];

    /** Group for UI organization */
    group?: string;
}

// ============================================
// CONSTRAINTS (SOFT & FATAL)
// ============================================

/**
 * Soft constraint: applies a multiplicative penalty.
 * 
 * @example
 * // 20% penalty for products without HDR
 * { type: 'soft', condition: 'specs.hdr_support === false', factor: 0.8, reason: 'Sem HDR' }
 */
export interface SoftConstraint {
    type: 'soft';

    /** Condition expression (evaluated against product facts) */
    condition: string;

    /** Multiplicative factor (0.8 = 20% reduction) */
    factor: number;

    /** Reason shown to user */
    reason: string;

    /** Severity for UI */
    severity?: 'low' | 'medium' | 'high';

    /** Only applies in specific contexts */
    contexts?: string[];
}

/**
 * Fatal constraint: marks product as incompatible.
 * 
 * @example
 * // Wrong voltage = product is unusable
 * { type: 'fatal', condition: 'specs.voltage !== user.voltage', reason: 'Voltagem incompatível' }
 */
export interface FatalConstraint {
    type: 'fatal';

    /** Condition expression (evaluated against product facts) */
    condition: string;

    /** Reason shown to user (displayed prominently) */
    reason: string;

    /** Only applies in specific contexts */
    contexts?: string[];
}

/**
 * Union type for constraints.
 */
export type ConstraintDefinition = SoftConstraint | FatalConstraint;

// ============================================
// EVALUATION RESULTS
// ============================================

/**
 * Utility breakdown for a single attribute.
 */
export interface AttributeUtility {
    /** Attribute ID */
    id: string;

    /** Display label */
    label: string;

    /** Raw value from product specs */
    rawValue: unknown;

    /** Normalized utility (0-1) */
    utility: number;

    /** Weight used in this context */
    weight: number;

    /** Contribution to final score (utility^weight in log space) */
    contribution: number;
}

/**
 * Applied penalty from a soft constraint.
 */
export interface AppliedPenalty {
    /** Constraint ID or reason */
    reason: string;

    /** Multiplicative factor applied */
    factor: number;

    /** Severity */
    severity: 'low' | 'medium' | 'high';
}

/**
 * Fatal constraint that was triggered.
 */
export interface FatalReason {
    /** Reason for incompatibility */
    reason: string;

    /** Which constraint triggered this */
    constraintId?: string;
}

/**
 * Complete evaluation result for a product in a context.
 */
export interface EvaluationResult {
    /** Product ID */
    productId: string;

    /** Context ID used for evaluation */
    contextId: string;

    /** Final score (0-1 scale) */
    finalScore: number;

    /** Final score for display (0-10 scale) */
    displayScore: number;

    /** Breakdown of utility contributions */
    utilityBreakdown: AttributeUtility[];

    /** Penalties applied (soft constraints) */
    appliedPenalties: AppliedPenalty[];

    /** Score before penalties */
    prepenaltyScore: number;

    /** Whether product is marked as incompatible */
    isIncompatible: boolean;

    /** Reasons for incompatibility (if any) */
    fatalReasons: FatalReason[];

    /** Editorial score contribution (if integrated) */
    editorialContribution?: {
        rawScore: number;
        utility: number;
        weight: number;
    };

    /** Computation metadata */
    metadata?: {
        timestamp: number;
        engineVersion: string;
        attributesEvaluated: number;
        missingAttributes: string[];
    };
}

// ============================================
// CATEGORY HMUM CONFIGURATION
// ============================================

/**
 * Complete HMUM configuration for a product category.
 * 
 * @description This replaces the old CategoryRules structure for HMUM evaluation.
 */
export interface CategoryHMUMConfig {
    /** Category identifier */
    categoryId: string;

    /** Category display name */
    categoryName: string;

    /** Attribute definitions for this category */
    attributes: AttributeDefinition[];

    /** Available contexts */
    contexts: ContextConfig[];

    /** Global constraints (apply to all contexts) */
    globalConstraints?: ConstraintDefinition[];

    /** Editorial score integration */
    editorialIntegration?: {
        /** Weight of editorial score in final calculation (e.g., 0.3 = 30%) */
        weight: number;
        /** Source path for editorial score (e.g., 'computed.overall') */
        sourcePath: string;
    };

    /** Price normalization config */
    priceConfig?: {
        minPrice: number;
        maxPrice: number;
    };
}

// ============================================
// USER CONTEXT (Runtime)
// ============================================

/**
 * User context at evaluation time.
 */
export interface UserContext {
    /** Selected context ID */
    contextId: string;

    /** User's voltage (for fatal constraint checking) */
    voltage?: 110 | 220 | 'bivolt';

    /** User's location type */
    locationType?: 'coastal' | 'inland' | 'industrial';

    /** User priority */
    priority?: 'performance' | 'economy' | 'durability';

    /** Additional user facts for constraint evaluation */
    facts?: Record<string, unknown>;
}

// ============================================
// ENGINE OPTIONS
// ============================================

/**
 * Options for the HMUM engine.
 */
export interface HMUMEngineOptions {
    /** Enable debug logging */
    debug?: boolean;

    /** Include missing attributes in breakdown (as EPSILON) */
    includeMissingAttributes?: boolean;

    /** Minimum utility floor (default EPSILON = 0.01) */
    minUtility?: number;

    /** Maximum utility ceiling (default 0.99) */
    maxUtility?: number;

    /** Default penalty factor for missing required attributes */
    missingRequiredPenalty?: number;
}

// ============================================
// COMPARISON TYPES
// ============================================

/**
 * Comparison result between two products.
 */
export interface HMUMComparison {
    productA: EvaluationResult;
    productB: EvaluationResult;

    /** Which product is better overall */
    winner: 'A' | 'B' | 'tie';

    /** Score difference */
    scoreDifference: number;

    /** Attribute-by-attribute comparison */
    attributeComparison: Array<{
        attributeId: string;
        label: string;
        utilityA: number;
        utilityB: number;
        winner: 'A' | 'B' | 'tie';
    }>;
}

// ============================================
// EXPORT VERSION
// ============================================

export const HMUM_VERSION = '2.0.0';
