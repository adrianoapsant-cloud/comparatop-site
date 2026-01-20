/**
 * Contextual Dynamic Scoring System
 * 
 * This module provides the complete infrastructure for contextual product scoring.
 * 
 * @example
 * import { calculateContextualScore, CategoryRules } from '@/lib/scoring';
 * import acRules from '@/data/rules/ac-rules.json';
 * 
 * const result = calculateContextualScore(
 *   { coil_material: 'aluminum', has_anticorrosive_protection: false },
 *   'litoral',
 *   acRules as CategoryRules
 * );
 * 
 * console.log(result.finalScore); // 5.0
 * console.log(result.reasons);    // [{ label: '...', adjustment: -3.0 }, ...]
 */

// Re-export types
export type {
    ProductFacts,
    ScoringRule,
    CategoryRules,
    ScoringContext,
    ScoringResult,
    ScoringReason,
    RuleSeverity,
    EngineConfig,
    ContextOption,
    ScoreComparison,
} from './types';

// Re-export engine functions
export {
    calculateContextualScore,
    compareAcrossContexts,
    getAvailableContexts,
    findContext,
    getRuleCountForContext,
    validateCategoryRules,
    isCategoryRules,
} from './engine';

// Re-export facts extraction utilities
export {
    extractFactsFromProduct,
    enhanceProductWithScoring,
    hasContextualScoring,
} from './extract-facts';
