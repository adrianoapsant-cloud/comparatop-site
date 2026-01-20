/**
 * ComparaMatch - Type Definitions
 * 
 * @description Core types for the recommendation engine
 */

// ============================================
// TROPHY LEVELS
// ============================================

export type TrophyLevel = 'gold' | 'silver' | 'bronze' | 'none';

// ============================================
// USER PREFERENCES
// ============================================

export interface UserPreference {
    /** Criteria ID from config */
    criteriaId: string;
    /** Trophy level assigned by user */
    level: TrophyLevel;
}

export interface UserPreferences {
    /** Active preferences selected by user */
    preferences: UserPreference[];
    /** Category context (e.g., 'tv', 'fridge') */
    categoryId: string;
}

// ============================================
// CRITERIA CONFIGURATION
// ============================================

export type PenaltyType =
    | 'sigmoid_penalty'      // Standard: deviation > 20% = severe penalty
    | 'logarithmic_decay'    // For prices: lower is better
    | 'linear_penalty';      // Simple proportional

export interface CriteriaConfig {
    /** Unique identifier */
    id: string;
    /** User-facing label */
    label: string;
    /** Emoji icon for UI */
    icon?: string;
    /** Path to product spec field (e.g., "specs.brightness_nits") */
    tech_field: string;
    /** Target value for Gold threshold */
    target_value: number;
    /** Type of penalty function */
    type: PenaltyType;
    /** Is lower better? (e.g., input lag, price) */
    lower_is_better?: boolean;
    /** Description for tooltip */
    description?: string;
}

// ============================================
// MATCH RESULT
// ============================================

export interface PenaltyDetail {
    /** Criteria that triggered penalty */
    criteriaId: string;
    /** Criteria label */
    label: string;
    /** Original value from product */
    actualValue: number | null;
    /** Target value from config */
    targetValue: number;
    /** Calculated penalty multiplier (0-1) */
    penaltyMultiplier: number;
    /** Human-readable reason */
    reason: string;
}

export interface MatchResult {
    /** Product ID */
    productId: string;
    /** Final match score (0-100) */
    matchScore: number;
    /** Editorial score (for comparison) */
    editorialScore: number;
    /** Score color class */
    scoreColor: 'green' | 'yellow' | 'orange' | 'red';
    /** Was score reduced by Gold penalties? */
    hasPenalties: boolean;
    /** Details of each penalty applied */
    penalties: PenaltyDetail[];
    /** Calculated from imputed values? */
    hasUncertainty: boolean;
}

// ============================================
// CHIP FILTER STATE
// ============================================

export interface FilterChip {
    /** Criteria ID */
    criteriaId: string;
    /** Display label */
    label: string;
    /** Icon emoji */
    icon: string;
    /** Current trophy level */
    level: TrophyLevel;
}

// ============================================
// HELPER: Get nested value from object
// ============================================

export function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
    return path.split('.').reduce((acc, part) => {
        if (acc && typeof acc === 'object' && part in acc) {
            return (acc as Record<string, unknown>)[part];
        }
        return undefined;
    }, obj as unknown);
}
