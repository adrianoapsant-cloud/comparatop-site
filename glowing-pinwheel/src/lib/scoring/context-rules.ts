/**
 * @file context-rules.ts
 * @description Integration with json-rules-engine for Contextual Scoring v2.0
 * 
 * This module configures the rules engine to:
 * 1. Receive enriched ProductFactsV2 (with computed Shadow Metrics)
 * 2. Apply contextual rules based on user profiles
 * 3. Adjust scoring weights dynamically
 * 
 * @version 2.0.0
 * @see https://github.com/CacheControl/json-rules-engine
 */

import { Engine, Rule, RuleProperties, EngineResult, Almanac } from 'json-rules-engine';
import type { ProductFactsV2, ShadowMetrics, UsageProfile } from './types';

// ============================================
// TYPES FOR RULES ENGINE
// ============================================

/**
 * Facts object passed to the rules engine.
 */
export interface RulesFacts {
    product: ProductFactsV2;
    userProfile: UsageProfile;
    shadowMetrics: ShadowMetrics;
}

/**
 * Event emitted when a rule fires.
 */
export interface RuleEvent {
    type: string;
    params: {
        message: string;
        adjustment?: number;
        targetCriterion?: string;
        severity?: 'low' | 'medium' | 'high' | 'critical';
    };
}

/**
 * Weight adjustments output from the engine.
 */
export interface WeightAdjustments {
    adjustments: Record<string, number>;
    appliedRules: string[];
    warnings: string[];
}

// ============================================
// RULE DEFINITIONS
// ============================================

/**
 * Performance Seeker Rule
 * 
 * @description When a user prioritizes performance but the product
 * has low reliability, we should warn them and increase the weight
 * of the reliability criterion.
 * 
 * This implements the "Tension Detection" pattern from the architecture spec.
 */
const performanceSeekerRule: RuleProperties = {
    name: 'performance-seeker-low-reliability',
    conditions: {
        all: [
            {
                fact: 'userProfile',
                path: '$.userPriority',
                operator: 'equal',
                value: 'performance',
            },
            {
                fact: 'shadowMetrics',
                path: '$.maintenanceRiskScore',
                operator: 'lessThan',
                value: 5.0, // Below average reliability
            },
        ],
    },
    event: {
        type: 'weight-adjustment',
        params: {
            message: 'Atenção: Este produto prioriza performance mas tem confiabilidade abaixo da média. Considere se a durabilidade atende suas necessidades.',
            adjustment: 0.05, // Increase reliability weight by 5%
            targetCriterion: 'c3', // Confiabilidade do Hardware
            severity: 'high',
        },
    },
};

/**
 * Economy Seeker Rule - TCO Alert
 * 
 * @description When a user prioritizes economy but the TCO is high,
 * warn about hidden costs.
 */
const economySeekerHighTCORule: RuleProperties = {
    name: 'economy-seeker-high-tco',
    conditions: {
        all: [
            {
                fact: 'userProfile',
                path: '$.userPriority',
                operator: 'equal',
                value: 'economy',
            },
            {
                // TCO is more than 2x purchase price
                fact: 'tcoRatio',
                operator: 'greaterThan',
                value: 2.0,
            },
        ],
    },
    event: {
        type: 'weight-adjustment',
        params: {
            message: 'Atenção: O Custo Total de Propriedade (5 anos) é mais que o dobro do preço de compra. Considere custos de energia e manutenção.',
            adjustment: 0.08, // Increase custo-benefício weight
            targetCriterion: 'c7', // Custo-Benefício
            severity: 'high',
        },
    },
};

/**
 * Durability Seeker Rule - Short Lifespan
 * 
 * @description When a user prioritizes durability but the estimated
 * lifespan is below average.
 */
const durabilitySeekerShortLifespanRule: RuleProperties = {
    name: 'durability-seeker-short-lifespan',
    conditions: {
        all: [
            {
                fact: 'userProfile',
                path: '$.userPriority',
                operator: 'equal',
                value: 'durability',
            },
            {
                fact: 'shadowMetrics',
                path: '$.estimatedLifespanYears',
                operator: 'lessThan',
                value: 7, // Below 7 years is considered short
            },
        ],
    },
    event: {
        type: 'weight-adjustment',
        params: {
            message: 'Atenção: Vida útil estimada abaixo de 7 anos. Verifique a garantia e disponibilidade de peças.',
            adjustment: 0.05,
            targetCriterion: 'c3',
            severity: 'medium',
        },
    },
};

/**
 * Coastal Location Rule
 * 
 * @description When user is in coastal area but product lacks
 * anticorrosive protection.
 */
const coastalNoProtectionRule: RuleProperties = {
    name: 'coastal-no-anticorrosive',
    conditions: {
        all: [
            {
                fact: 'userProfile',
                path: '$.locationType',
                operator: 'equal',
                value: 'coastal',
            },
            {
                fact: 'product',
                path: '$.reliability.hasAnticorrosiveProtection',
                operator: 'notEqual',
                value: true,
            },
        ],
    },
    event: {
        type: 'penalty',
        params: {
            message: 'Produto sem proteção anticorrosiva não é recomendado para ambiente de litoral.',
            adjustment: -2.0,
            targetCriterion: 'c3',
            severity: 'critical',
        },
    },
};

/**
 * Voltage Instability Rule
 * 
 * @description When user has unstable voltage, check for protection.
 */
const voltageInstabilityRule: RuleProperties = {
    name: 'voltage-unstable-no-protection',
    conditions: {
        all: [
            {
                fact: 'userProfile',
                path: '$.voltageStable',
                operator: 'equal',
                value: false,
            },
            {
                fact: 'product',
                path: '$.specs.voltage_protection',
                operator: 'notEqual',
                value: true,
            },
        ],
    },
    event: {
        type: 'penalty',
        params: {
            message: 'Rede elétrica instável requer equipamento com proteção de voltagem integrada.',
            adjustment: -1.5,
            targetCriterion: 'c3',
            severity: 'high',
        },
    },
};

// ============================================
// ENGINE FACTORY
// ============================================

/**
 * Creates a configured json-rules-engine instance.
 * 
 * @returns Configured Engine with all contextual rules loaded
 */
export function createContextRulesEngine(): Engine {
    const engine = new Engine();

    // Add all rules
    engine.addRule(new Rule(performanceSeekerRule));
    engine.addRule(new Rule(economySeekerHighTCORule));
    engine.addRule(new Rule(durabilitySeekerShortLifespanRule));
    engine.addRule(new Rule(coastalNoProtectionRule));
    engine.addRule(new Rule(voltageInstabilityRule));

    return engine;
}

// ============================================
// FACTS PREPARATION
// ============================================

/**
 * Prepares facts for the rules engine.
 * 
 * @description Enriches raw product data with computed metrics
 * and adds derived facts needed by rules.
 * 
 * @param product - ProductFactsV2 with computed shadow metrics
 * @param userProfile - User's profile/preferences
 * @returns Facts object ready for engine evaluation
 */
export function prepareFacts(
    product: ProductFactsV2,
    userProfile: UsageProfile
): RulesFacts & { tcoRatio?: number } {
    const shadowMetrics = product.computed!;

    // Calculate derived facts
    const tcoRatio = product.financial.purchasePriceBRL > 0
        ? shadowMetrics.totalCostOfOwnership5Years / product.financial.purchasePriceBRL
        : undefined;

    return {
        product,
        userProfile,
        shadowMetrics,
        tcoRatio,
    };
}

// ============================================
// MAIN EVALUATION FUNCTION
// ============================================

/**
 * Evaluates contextual rules and returns weight adjustments.
 * 
 * @description This is the main entry point for the context rules engine.
 * It evaluates all rules against the product facts and user profile,
 * then returns the weight adjustments to apply to the scoring.
 * 
 * @param product - ProductFactsV2 with computed shadow metrics
 * @param userProfile - User's profile/preferences
 * @returns Weight adjustments and applied rules
 * 
 * @example
 * const enrichedProduct = enrichWithShadowMetrics(productFacts);
 * const adjustments = await evaluateContextRules(enrichedProduct, userProfile);
 * // adjustments.adjustments = { c3: 0.05, c7: 0.08 }
 */
export async function evaluateContextRules(
    product: ProductFactsV2,
    userProfile: UsageProfile
): Promise<WeightAdjustments> {
    // Validate that product has computed metrics
    if (!product.computed) {
        console.warn('[ContextRules] Product missing computed shadow metrics');
        return {
            adjustments: {},
            appliedRules: [],
            warnings: ['Shadow metrics not computed - rules not evaluated'],
        };
    }

    const engine = createContextRulesEngine();
    const facts = prepareFacts(product, userProfile);

    // Run the engine
    const results: EngineResult = await engine.run(facts);

    // Process events into weight adjustments
    const adjustments: Record<string, number> = {};
    const appliedRules: string[] = [];
    const warnings: string[] = [];

    for (const event of results.events) {
        const ruleEvent = event as RuleEvent;

        if (ruleEvent.params.targetCriterion && ruleEvent.params.adjustment) {
            const criterion = ruleEvent.params.targetCriterion;
            adjustments[criterion] = (adjustments[criterion] || 0) + ruleEvent.params.adjustment;
        }

        appliedRules.push(`${ruleEvent.type}: ${ruleEvent.params.message}`);

        if (ruleEvent.params.severity === 'critical' || ruleEvent.params.severity === 'high') {
            warnings.push(ruleEvent.params.message);
        }
    }

    return {
        adjustments,
        appliedRules,
        warnings,
    };
}

// ============================================
// UTILITY: APPLY WEIGHT ADJUSTMENTS
// ============================================

/**
 * Applies weight adjustments to base criteria weights.
 * 
 * @description Adjusts the base weights while ensuring they still sum to 1.0.
 * 
 * @param baseWeights - Original criteria weights (sum = 1.0)
 * @param adjustments - Weight adjustments from rules engine
 * @returns Normalized adjusted weights (sum = 1.0)
 */
export function applyWeightAdjustments(
    baseWeights: Record<string, number>,
    adjustments: Record<string, number>
): Record<string, number> {
    // Apply adjustments
    const adjusted = { ...baseWeights };

    for (const [criterion, adjustment] of Object.entries(adjustments)) {
        if (criterion in adjusted) {
            adjusted[criterion] = Math.max(0, adjusted[criterion] + adjustment);
        }
    }

    // Normalize to sum = 1.0
    const total = Object.values(adjusted).reduce((sum, w) => sum + w, 0);

    if (total <= 0) {
        console.warn('[ContextRules] Invalid weights after adjustment, returning original');
        return baseWeights;
    }

    const normalized: Record<string, number> = {};
    for (const [criterion, weight] of Object.entries(adjusted)) {
        normalized[criterion] = Math.round((weight / total) * 1000) / 1000;
    }

    return normalized;
}

// ============================================
// EXPORT ALL RULES (for testing/extension)
// ============================================

export const CONTEXT_RULES = {
    performanceSeekerRule,
    economySeekerHighTCORule,
    durabilitySeekerShortLifespanRule,
    coastalNoProtectionRule,
    voltageInstabilityRule,
} as const;
