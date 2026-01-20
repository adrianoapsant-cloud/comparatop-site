/**
 * @file hmum-engine.ts
 * @description HMUM (Hybrid Multiplicative Utility Model) Evaluation Engine
 * 
 * This module orchestrates the complete evaluation pipeline:
 * 1. Extract raw specs from product
 * 2. Normalize specs to utility (0-1) using configured curves
 * 3. Apply context-specific weights
 * 4. Aggregate using Weighted Product Model
 * 5. Check fatal constraints (gatekeeper)
 * 6. Apply soft constraint penalties
 * 7. Integrate editorial score as virtual attribute
 * 
 * @version 2.0.0 (HMUM Architecture)
 */

import {
    sigmoidNormalization,
    logNormalNormalization,
    linearNormalization,
    booleanNormalization,
    weightedProductModel,
    applyMultiplePenalties,
    utilityToDisplayScore,
    displayScoreToUtility,
    EPSILON,
    MAX_UTILITY,
    MIN_UTILITY,
} from './math-utils';

import type {
    CategoryHMUMConfig,
    ContextConfig,
    AttributeDefinition,
    CurveConfig,
    ConstraintDefinition,
    SoftConstraint,
    FatalConstraint,
    EvaluationResult,
    AttributeUtility,
    AppliedPenalty,
    FatalReason,
    UserContext,
    HMUMEngineOptions,
} from './hmum-types';

// ============================================
// CONSTANTS
// ============================================

const ENGINE_VERSION = '2.0.0';

const DEFAULT_OPTIONS: Required<HMUMEngineOptions> = {
    debug: false,
    includeMissingAttributes: true,
    minUtility: EPSILON,
    maxUtility: MAX_UTILITY,
    missingRequiredPenalty: 0.5,
};

// ============================================
// VALUE EXTRACTION
// ============================================

/**
 * Safely extracts a value from an object using dot notation path.
 * 
 * @param obj - Object to extract from
 * @param path - Dot notation path (e.g., 'specs.peak_brightness_nits')
 * @returns Extracted value or undefined
 */
function extractValue(obj: Record<string, unknown>, path: string): unknown {
    const parts = path.split('.');
    let current: unknown = obj;

    for (const part of parts) {
        if (current === null || current === undefined) {
            return undefined;
        }
        if (typeof current !== 'object') {
            return undefined;
        }
        current = (current as Record<string, unknown>)[part];
    }

    return current;
}

// ============================================
// CURVE APPLICATION
// ============================================

/**
 * Applies a normalization curve to convert raw value to utility.
 * 
 * @param value - Raw value from product specs
 * @param curve - Curve configuration
 * @returns Utility value (0-1)
 */
function applyNormalizationCurve(
    value: unknown,
    curve: CurveConfig
): number {
    // Handle missing values
    if (value === undefined || value === null) {
        return MIN_UTILITY; // Missing = low utility (will be flagged as penalty)
    }

    switch (curve.type) {
        case 'sigmoid': {
            const numValue = typeof value === 'number' ? value : parseFloat(String(value));
            if (isNaN(numValue)) return MIN_UTILITY;
            return sigmoidNormalization(
                numValue,
                curve.midpoint,
                curve.steepness,
                curve.limit ?? MAX_UTILITY
            );
        }

        case 'linear': {
            const numValue = typeof value === 'number' ? value : parseFloat(String(value));
            if (isNaN(numValue)) return MIN_UTILITY;
            return linearNormalization(
                numValue,
                curve.min,
                curve.max,
                curve.invert ?? false
            );
        }

        case 'log_normal': {
            const numValue = typeof value === 'number' ? value : parseFloat(String(value));
            if (isNaN(numValue)) return MIN_UTILITY;
            return logNormalNormalization(
                numValue,
                curve.minPrice,
                curve.maxPrice
            );
        }

        case 'boolean': {
            const boolValue = Boolean(value);
            return booleanNormalization(
                boolValue,
                curve.presentUtility ?? 0.95,
                curve.absentUtility ?? 0.50
            );
        }

        case 'passthrough': {
            const numValue = typeof value === 'number' ? value : parseFloat(String(value));
            if (isNaN(numValue)) return MIN_UTILITY;
            return Math.max(MIN_UTILITY, Math.min(MAX_UTILITY, numValue));
        }

        default:
            return MIN_UTILITY;
    }
}

// ============================================
// CONDITION EVALUATION
// ============================================

/**
 * Safely evaluates a constraint condition.
 * 
 * @param condition - JavaScript expression string
 * @param product - Product object
 * @param user - User context
 * @returns Boolean result
 */
function evaluateCondition(
    condition: string,
    product: Record<string, unknown>,
    user: UserContext
): boolean {
    try {
        // Create evaluation context
        const evalFunc = new Function('product', 'specs', 'user', `
            "use strict";
            try {
                const facts = product.specs || product;
                return Boolean(${condition});
            } catch (e) {
                return false;
            }
        `);

        const specs = (product.specs as Record<string, unknown>) ?? product;
        return evalFunc(product, specs, user);
    } catch (error) {
        console.warn(`[HMUM] Failed to evaluate condition: ${condition}`, error);
        return false;
    }
}

// ============================================
// CONSTRAINT PROCESSING
// ============================================

/**
 * Checks for fatal constraints.
 * 
 * @description Fatal constraints are checked FIRST. If any fatal constraint
 * is triggered, the product is marked as incompatible and score is 0.
 * 
 * @param constraints - Array of constraint definitions
 * @param product - Product object
 * @param user - User context
 * @param contextId - Current context ID
 * @returns Array of fatal reasons (empty if none triggered)
 */
function checkFatalConstraints(
    constraints: ConstraintDefinition[],
    product: Record<string, unknown>,
    user: UserContext,
    contextId: string
): FatalReason[] {
    const fatalReasons: FatalReason[] = [];

    for (const constraint of constraints) {
        if (constraint.type !== 'fatal') continue;

        // Check if constraint applies to this context
        if (constraint.contexts && !constraint.contexts.includes(contextId)) {
            continue;
        }

        // Evaluate condition
        if (evaluateCondition(constraint.condition, product, user)) {
            fatalReasons.push({
                reason: constraint.reason,
                constraintId: constraint.condition,
            });
        }
    }

    return fatalReasons;
}

/**
 * Processes soft constraints and returns penalty factors.
 */
function processSoftConstraints(
    constraints: ConstraintDefinition[],
    product: Record<string, unknown>,
    user: UserContext,
    contextId: string
): AppliedPenalty[] {
    const penalties: AppliedPenalty[] = [];

    for (const constraint of constraints) {
        if (constraint.type !== 'soft') continue;

        // Check if constraint applies to this context
        if (constraint.contexts && !constraint.contexts.includes(contextId)) {
            continue;
        }

        // Evaluate condition
        if (evaluateCondition(constraint.condition, product, user)) {
            penalties.push({
                reason: constraint.reason,
                factor: constraint.factor,
                severity: constraint.severity ?? 'medium',
            });
        }
    }

    return penalties;
}

// ============================================
// MAIN EVALUATION FUNCTION
// ============================================

/**
 * Evaluates a product in a specific context using HMUM.
 * 
 * @description This is the main entry point for the HMUM engine.
 * 
 * Pipeline:
 * 1. Get context configuration (weights)
 * 2. Check FATAL constraints (gatekeeper)
 * 3. For each attribute: extract → normalize → record utility
 * 4. Integrate editorial score as virtual attribute
 * 5. Aggregate using Weighted Product Model
 * 6. Apply soft constraint penalties
 * 7. Return complete evaluation result
 * 
 * @param product - Product object with specs
 * @param categoryConfig - HMUM configuration for the category
 * @param userContext - User's context and preferences
 * @param options - Engine options
 * @returns Complete evaluation result
 * 
 * @example
 * const result = evaluateProductContext(tvProduct, tvHMUMConfig, {
 *     contextId: 'gamer',
 *     voltage: 110,
 * });
 * console.log(result.displayScore); // 8.4
 */
export function evaluateProductContext(
    product: Record<string, unknown>,
    categoryConfig: CategoryHMUMConfig,
    userContext: UserContext,
    options: HMUMEngineOptions = {}
): EvaluationResult {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const contextId = userContext.contextId;
    const productId = String(product.id ?? 'unknown');

    if (opts.debug) {
        console.log(`[HMUM] Evaluating ${productId} in context ${contextId}`);
    }

    // 1. Get context configuration
    const contextConfig = categoryConfig.contexts.find(c => c.id === contextId);
    if (!contextConfig) {
        console.warn(`[HMUM] Context '${contextId}' not found, using default weights`);
    }

    // 2. Collect all constraints (global + context-specific)
    const allConstraints: ConstraintDefinition[] = [
        ...(categoryConfig.globalConstraints ?? []),
        ...(contextConfig?.constraints ?? []),
    ];

    // 3. GATEKEEPER: Check fatal constraints FIRST
    const fatalReasons = checkFatalConstraints(
        allConstraints,
        product,
        userContext,
        contextId
    );

    if (fatalReasons.length > 0) {
        if (opts.debug) {
            console.log(`[HMUM] FATAL constraint triggered:`, fatalReasons);
        }

        // Return immediately with score 0
        return {
            productId,
            contextId,
            finalScore: 0,
            displayScore: 0,
            utilityBreakdown: [],
            appliedPenalties: [],
            prepenaltyScore: 0,
            isIncompatible: true,
            fatalReasons,
            metadata: {
                timestamp: Date.now(),
                engineVersion: ENGINE_VERSION,
                attributesEvaluated: 0,
                missingAttributes: [],
            },
        };
    }

    // 4. Build utilities and weights for each attribute
    const utilities: Record<string, number> = {};
    const weights: Record<string, number> = {};
    const utilityBreakdown: AttributeUtility[] = [];
    const missingAttributes: string[] = [];

    for (const attribute of categoryConfig.attributes) {
        // Extract raw value
        const rawValue = extractValue(product as Record<string, unknown>, attribute.specPath);

        // Normalize to utility
        let utility: number;
        if (rawValue === undefined || rawValue === null) {
            missingAttributes.push(attribute.id);
            utility = attribute.required ? opts.minUtility : 0.5; // Missing non-required = neutral
        } else {
            utility = applyNormalizationCurve(rawValue, attribute.curve);
        }

        // Get weight (context override or default)
        const weight = contextConfig?.weights[attribute.id] ?? attribute.defaultWeight;

        // Skip if weight is 0
        if (weight <= 0) continue;

        // Store for WPM
        utilities[attribute.id] = utility;
        weights[attribute.id] = weight;

        // Calculate contribution (for breakdown)
        // In WPM: contribution = utility^weight, but we show it as log contribution
        const contribution = Math.pow(utility, weight);

        utilityBreakdown.push({
            id: attribute.id,
            label: attribute.label,
            rawValue,
            utility,
            weight,
            contribution,
        });

        if (opts.debug) {
            console.log(`[HMUM] ${attribute.id}: raw=${rawValue}, utility=${utility.toFixed(3)}, weight=${weight}`);
        }
    }

    // 5. Integrate editorial score as virtual attribute
    if (categoryConfig.editorialIntegration) {
        const editorialPath = categoryConfig.editorialIntegration.sourcePath;
        const editorialWeight = categoryConfig.editorialIntegration.weight;
        const editorialRaw = extractValue(product as Record<string, unknown>, editorialPath);

        if (editorialRaw !== undefined) {
            const editorialScore = typeof editorialRaw === 'number' ? editorialRaw : parseFloat(String(editorialRaw));

            if (!isNaN(editorialScore)) {
                // Convert 0-10 score to 0-1 utility
                const editorialUtility = displayScoreToUtility(editorialScore);

                utilities['_editorial'] = editorialUtility;
                weights['_editorial'] = editorialWeight;

                utilityBreakdown.push({
                    id: '_editorial',
                    label: 'Nota Editorial',
                    rawValue: editorialScore,
                    utility: editorialUtility,
                    weight: editorialWeight,
                    contribution: Math.pow(editorialUtility, editorialWeight),
                });

                if (opts.debug) {
                    console.log(`[HMUM] Editorial: raw=${editorialScore}, utility=${editorialUtility.toFixed(3)}, weight=${editorialWeight}`);
                }
            }
        }
    }

    // 6. Aggregate using Weighted Product Model
    const prepenaltyScore = weightedProductModel(utilities, weights);

    if (opts.debug) {
        console.log(`[HMUM] Pre-penalty score: ${prepenaltyScore.toFixed(4)}`);
    }

    // 7. Process soft constraints and apply penalties
    const appliedPenalties = processSoftConstraints(
        allConstraints,
        product,
        userContext,
        contextId
    );

    let finalScore = prepenaltyScore;
    if (appliedPenalties.length > 0) {
        const penaltyFactors = appliedPenalties.map(p => p.factor);
        finalScore = applyMultiplePenalties(prepenaltyScore, penaltyFactors);

        if (opts.debug) {
            console.log(`[HMUM] Applied penalties:`, appliedPenalties);
            console.log(`[HMUM] Post-penalty score: ${finalScore.toFixed(4)}`);
        }
    }

    // 8. Convert to display score (0-10)
    const displayScore = utilityToDisplayScore(finalScore);

    return {
        productId,
        contextId,
        finalScore,
        displayScore,
        utilityBreakdown,
        appliedPenalties,
        prepenaltyScore,
        isIncompatible: false,
        fatalReasons: [],
        editorialContribution: categoryConfig.editorialIntegration ? {
            rawScore: utilities['_editorial'] ? utilities['_editorial'] * 10 : 0,
            utility: utilities['_editorial'] ?? 0,
            weight: weights['_editorial'] ?? 0,
        } : undefined,
        metadata: {
            timestamp: Date.now(),
            engineVersion: ENGINE_VERSION,
            attributesEvaluated: Object.keys(utilities).length,
            missingAttributes,
        },
    };
}

// ============================================
// BATCH EVALUATION
// ============================================

/**
 * Evaluates multiple products in a context and returns sorted results.
 */
export function evaluateProductsInContext(
    products: Record<string, unknown>[],
    categoryConfig: CategoryHMUMConfig,
    userContext: UserContext,
    options?: HMUMEngineOptions
): EvaluationResult[] {
    return products
        .map(product => evaluateProductContext(product, categoryConfig, userContext, options))
        .sort((a, b) => {
            // Incompatible products go to bottom
            if (a.isIncompatible && !b.isIncompatible) return 1;
            if (!a.isIncompatible && b.isIncompatible) return -1;
            // Otherwise sort by score descending
            return b.finalScore - a.finalScore;
        });
}

// ============================================
// CONTEXT COMPARISON
// ============================================

/**
 * Evaluates a single product across all contexts to find best/worst fit.
 */
export function compareProductAcrossContexts(
    product: Record<string, unknown>,
    categoryConfig: CategoryHMUMConfig,
    userFacts?: Record<string, unknown>,
    options?: HMUMEngineOptions
): {
    results: EvaluationResult[];
    bestContext: string;
    worstContext: string;
    bestScore: number;
    worstScore: number;
} {
    const results: EvaluationResult[] = [];

    for (const context of categoryConfig.contexts) {
        const result = evaluateProductContext(
            product,
            categoryConfig,
            { contextId: context.id, facts: userFacts },
            options
        );
        results.push(result);
    }

    // Sort by score descending
    results.sort((a, b) => b.finalScore - a.finalScore);

    // Find best and worst (excluding incompatible)
    const compatible = results.filter(r => !r.isIncompatible);
    const best = compatible[0] ?? results[0];
    const worst = compatible[compatible.length - 1] ?? results[results.length - 1];

    return {
        results,
        bestContext: best.contextId,
        worstContext: worst.contextId,
        bestScore: best.displayScore,
        worstScore: worst.displayScore,
    };
}

// ============================================
// EXPORT
// ============================================

export { ENGINE_VERSION as HMUM_ENGINE_VERSION };
