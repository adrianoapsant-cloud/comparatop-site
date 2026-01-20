/**
 * Contextual Dynamic Scoring Engine
 * 
 * @description Category-agnostic scoring engine that calculates contextual scores
 * by evaluating rules against product facts for a given user context.
 * 
 * Algorithm:
 * 1. Start: Base score = 10.0
 * 2. Filter: Get rules matching the target context
 * 3. Evaluate: For each rule, evaluate condition against ProductFacts
 * 4. Apply: If condition matches, apply penalty or bonus
 * 5. Clamp: Ensure score is 0.0 ≤ score ≤ 10.0
 * 6. Return: { finalScore, reasons, delta }
 */

import type {
    ProductFacts,
    ScoringRule,
    CategoryRules,
    ScoringResult,
    ScoringReason,
    EngineConfig,
    RuleSeverity,
    ScoringContext,
    ScoreComparison,
} from './types';

// ============================================
// DEFAULT CONFIGURATION
// ============================================

const DEFAULT_CONFIG: Required<EngineConfig> = {
    baseScore: 10.0,
    minScore: 0.0,
    maxScore: 10.0,
    debug: false,
};

// ============================================
// CONDITION EVALUATOR
// ============================================

/**
 * Safely evaluates a condition string against ProductFacts.
 * 
 * The condition is a JavaScript expression where 'facts' refers to ProductFacts.
 * 
 * @example
 * evaluateCondition("facts.coil_material === 'aluminum'", { coil_material: 'aluminum' })
 * // returns true
 * 
 * @example
 * evaluateCondition("facts.noise_db > 25", { noise_db: 28 })
 * // returns true
 */
function evaluateCondition(condition: string, facts: ProductFacts): boolean {
    try {
        // Create a safe evaluation context
        // The condition can reference 'facts' directly
        const evalFunc = new Function('facts', `
      "use strict";
      try {
        return Boolean(${condition});
      } catch (e) {
        return false;
      }
    `);

        return evalFunc(facts);
    } catch (error) {
        // If the condition is malformed, return false (rule doesn't apply)
        console.warn(`[ScoringEngine] Invalid condition: "${condition}"`, error);
        return false;
    }
}

// ============================================
// MAIN SCORING FUNCTION
// ============================================

/**
 * Calculates the contextual score for a product.
 * 
 * @param facts - Product's technical specifications
 * @param contextId - The user's context ID (e.g., 'litoral', 'quarto_silencio')
 * @param categoryRules - The rules configuration for the product's category
 * @param config - Optional engine configuration
 * 
 * @returns ScoringResult with finalScore, reasons, and delta
 * 
 * @example
 * const result = calculateContextualScore(
 *   { coil_material: 'aluminum', has_anticorrosive_protection: false },
 *   'litoral',
 *   acRules
 * );
 * // result.finalScore = 5.0 (10 - 3.0 - 2.0)
 * // result.reasons = [{ label: 'Alumínio oxida...', adjustment: -3.0 }, ...]
 */
export function calculateContextualScore(
    facts: ProductFacts,
    contextId: string,
    categoryRules: CategoryRules,
    config: EngineConfig = {}
): ScoringResult {
    const cfg = { ...DEFAULT_CONFIG, ...config };
    const reasons: ScoringReason[] = [];
    let currentScore = cfg.baseScore;

    if (cfg.debug) {
        console.log(`[ScoringEngine] Calculating score for context: ${contextId}`);
        console.log(`[ScoringEngine] Facts:`, facts);
    }

    // Filter rules that apply to the given context
    const applicableRules = categoryRules.rules.filter(rule =>
        rule.target_contexts.includes(contextId)
    );

    if (cfg.debug) {
        console.log(`[ScoringEngine] Applicable rules: ${applicableRules.length}`);
    }

    // Evaluate each applicable rule
    for (const rule of applicableRules) {
        const conditionMatches = evaluateCondition(rule.condition, facts);

        if (cfg.debug) {
            console.log(`[ScoringEngine] Rule ${rule.id}: condition="${rule.condition}" → ${conditionMatches}`);
        }

        if (conditionMatches) {
            // Determine adjustment (penalty is negative, bonus is positive)
            const adjustment = (rule.penalty ?? 0) + (rule.bonus ?? 0);
            const type: 'penalty' | 'bonus' = adjustment < 0 ? 'penalty' : 'bonus';
            const severity: RuleSeverity = rule.severity ?? 'medium';

            // Apply adjustment
            currentScore += adjustment;

            // Record reason
            reasons.push({
                rule_id: rule.id,
                label: rule.label,
                adjustment,
                severity,
                type,
            });

            if (cfg.debug) {
                console.log(`[ScoringEngine] Applied ${type}: ${adjustment} → current score: ${currentScore}`);
            }
        }
    }

    // Clamp final score
    const finalScore = Math.max(cfg.minScore, Math.min(cfg.maxScore, currentScore));
    const delta = finalScore - cfg.baseScore;

    if (cfg.debug) {
        console.log(`[ScoringEngine] Final score: ${finalScore} (delta: ${delta})`);
    }

    return {
        baseScore: cfg.baseScore,
        finalScore: Math.round(finalScore * 10) / 10, // Round to 1 decimal
        delta: Math.round(delta * 10) / 10,
        reasons,
        contextId,
    };
}

// ============================================
// MULTI-CONTEXT COMPARISON
// ============================================

/**
 * Compares a product's score across all available contexts.
 * Useful for showing the user which context is best/worst for this product.
 * 
 * @param facts - Product's technical specifications
 * @param categoryRules - The rules configuration for the product's category
 * @param config - Optional engine configuration
 * 
 * @returns ScoreComparison with scores for each context and best/worst indicators
 */
export function compareAcrossContexts(
    facts: ProductFacts,
    categoryRules: CategoryRules,
    config: EngineConfig = {}
): ScoreComparison {
    const results: ScoreComparison['contexts'] = [];

    for (const context of categoryRules.available_contexts) {
        const result = calculateContextualScore(facts, context.id, categoryRules, config);
        results.push({
            contextId: context.id,
            contextName: context.name,
            score: result.finalScore,
            delta: result.delta,
        });
    }

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);

    return {
        contexts: results,
        bestContext: results[0]?.contextId ?? '',
        worstContext: results[results.length - 1]?.contextId ?? '',
    };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Gets available contexts for a category.
 */
export function getAvailableContexts(categoryRules: CategoryRules): ScoringContext[] {
    return categoryRules.available_contexts;
}

/**
 * Finds a specific context by ID.
 */
export function findContext(
    categoryRules: CategoryRules,
    contextId: string
): ScoringContext | undefined {
    return categoryRules.available_contexts.find(c => c.id === contextId);
}

/**
 * Gets the count of rules for a specific context.
 */
export function getRuleCountForContext(
    categoryRules: CategoryRules,
    contextId: string
): number {
    return categoryRules.rules.filter(r => r.target_contexts.includes(contextId)).length;
}

/**
 * Validates that a CategoryRules object is well-formed.
 */
export function validateCategoryRules(categoryRules: CategoryRules): {
    valid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    if (!categoryRules.category_id) {
        errors.push('Missing category_id');
    }

    if (!categoryRules.category_name) {
        errors.push('Missing category_name');
    }

    if (!Array.isArray(categoryRules.available_contexts)) {
        errors.push('available_contexts must be an array');
    } else if (categoryRules.available_contexts.length === 0) {
        errors.push('available_contexts cannot be empty');
    }

    if (!Array.isArray(categoryRules.rules)) {
        errors.push('rules must be an array');
    } else {
        // Validate each rule
        for (const rule of categoryRules.rules) {
            if (!rule.id) {
                errors.push(`Rule missing id`);
            }
            if (!rule.condition) {
                errors.push(`Rule ${rule.id} missing condition`);
            }
            if (!rule.target_contexts || rule.target_contexts.length === 0) {
                errors.push(`Rule ${rule.id} missing target_contexts`);
            }
            if (rule.penalty === undefined && rule.bonus === undefined) {
                errors.push(`Rule ${rule.id} must have either penalty or bonus`);
            }
            if (!rule.label) {
                errors.push(`Rule ${rule.id} missing label`);
            }
        }
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

// ============================================
// RULE LOADER (for JSON files)
// ============================================

/**
 * Type guard to validate loaded JSON is valid CategoryRules.
 */
export function isCategoryRules(obj: unknown): obj is CategoryRules {
    if (typeof obj !== 'object' || obj === null) return false;
    const o = obj as Record<string, unknown>;
    return (
        typeof o.category_id === 'string' &&
        typeof o.category_name === 'string' &&
        Array.isArray(o.available_contexts) &&
        Array.isArray(o.rules)
    );
}

// ============================================
// EXPORTS
// ============================================

export type {
    ProductFacts,
    ScoringRule,
    CategoryRules,
    ScoringResult,
    ScoringReason,
    EngineConfig,
    RuleSeverity,
    ScoringContext,
    ScoreComparison,
} from './types';
