/**
 * ComparaMatch - Math Engine
 * 
 * @description Core algorithm for calculating personalized match scores
 * Uses Soft Constraints with Sigmoid Penalty model
 */

import type {
    UserPreferences,
    CriteriaConfig,
    MatchResult,
    PenaltyDetail,
    TrophyLevel,
    getNestedValue,
} from './types';
import { getNestedValue as getNested } from './types';

// ============================================
// CONSTANTS
// ============================================

const DEVIATION_THRESHOLD = 0.20; // 20% deviation triggers penalty
const SIGMOID_STEEPNESS = 10;     // Controls sigmoid curve steepness
const UNCERTAINTY_PENALTY = 0.90; // 10% penalty for null values
const IMPUTATION_FACTOR = 0.80;   // Impute at 80% of average

// Trophy weights for weighted sum
const TROPHY_WEIGHTS: Record<TrophyLevel, number> = {
    gold: 0,    // Gold uses multiplicative penalty, not weighted sum
    silver: 3,
    bronze: 1,
    none: 0,
};

// ============================================
// PENALTY FUNCTIONS
// ============================================

/**
 * Sigmoid Penalty Function with Bonus
 * 
 * Returns >1.0 if value exceeds target (bonus), 1.0 if meets target,
 * decreases sigmoidally as value falls below target.
 * 
 * @param value - Actual value from product
 * @param target - Target value from config
 * @param lowerIsBetter - If true, values below target are good
 */
export function calculateSigmoidPenalty(
    value: number,
    target: number,
    lowerIsBetter: boolean = false
): number {
    if (target === 0) return 1.0;

    let deviation: number;

    if (lowerIsBetter) {
        // For input lag, price, etc: lower is better
        if (value <= target) {
            // BONUS: value is better than target
            const bonusRatio = (target - value) / target;
            return 1.0 + Math.min(0.15, bonusRatio * 0.5); // Up to 15% bonus
        }
        deviation = (value - target) / target;
    } else {
        // For brightness, scores: higher is better
        if (value >= target) {
            // BONUS: value exceeds target
            const bonusRatio = (value - target) / target;
            return 1.0 + Math.min(0.15, bonusRatio * 0.5); // Up to 15% bonus
        }
        deviation = (target - value) / target;
    }

    // Sigmoid function for penalty
    const penalty = 1 / (1 + Math.exp(SIGMOID_STEEPNESS * (deviation - DEVIATION_THRESHOLD)));

    // Clamp between 0.1 and 1.0
    return Math.max(0.1, Math.min(1.0, penalty));
}

/**
 * Logarithmic Decay Function
 * 
 * Ideal for prices where lower is always better.
 * Smooth decay that's gentler than sigmoid for small differences.
 * 
 * @param value - Actual value (e.g., price)
 * @param target - Target maximum value
 */
export function calculateLogarithmicDecay(
    value: number,
    target: number
): number {
    if (value <= target) return 1.0;
    if (value <= 0 || target <= 0) return 1.0;

    const ratio = value / target;
    const maxRatio = 3; // Cap at 3x price = minimum score

    if (ratio >= maxRatio) return 0.3; // Floor penalty

    // Logarithmic decay: 1 - log(ratio) / log(maxRatio)
    const penalty = 1 - Math.log(ratio) / Math.log(maxRatio);

    return Math.max(0.3, Math.min(1.0, penalty));
}

/**
 * Linear Penalty Function
 * 
 * Simple proportional penalty for less critical criteria.
 * 
 * @param value - Actual value
 * @param target - Target value
 * @param lowerIsBetter - Direction of comparison
 */
export function calculateLinearPenalty(
    value: number,
    target: number,
    lowerIsBetter: boolean = false
): number {
    if (target === 0) return 1.0;

    let ratio: number;

    if (lowerIsBetter) {
        ratio = value <= target ? 1 : target / value;
    } else {
        ratio = value >= target ? 1 : value / target;
    }

    return Math.max(0.5, Math.min(1.0, ratio));
}

// ============================================
// VALUE EXTRACTION & IMPUTATION
// ============================================

/**
 * Extract value from product using dot notation path
 */
function extractValue(product: Record<string, unknown>, path: string): number | null {
    const value = getNested(product, path);

    if (value === null || value === undefined) return null;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? null : parsed;
    }

    return null;
}

/**
 * Impute missing value using conservative estimate
 */
function imputeValue(
    target: number,
    lowerIsBetter: boolean
): number {
    // Impute at 80% of target (conservative estimate)
    // For lower-is-better, impute at 120% (pessimistic)
    return lowerIsBetter
        ? target * 1.20
        : target * IMPUTATION_FACTOR;
}

// ============================================
// MAIN SCORING FUNCTION
// ============================================

/**
 * Calculate Match Score for a product based on user preferences
 * 
 * NEW ALGORITHM (Weighted Sum):
 * - Gold (1 only): score × 5 → max 50 points
 * - Silver (2 max): score × 3 each → max 60 points
 * - Others (7 criteria): score × 1 each → max 70 points
 * - Total max: 180 points → Normalized to 100
 */
export function calculateMatchScore(
    product: Record<string, unknown>,
    preferences: UserPreferences,
    criteriaConfigs: CriteriaConfig[]
): MatchResult {
    const productId = (product.id as string) || 'unknown';
    const editorialScore = extractValue(product, 'computed.overall') || 7.0;
    const penalties: PenaltyDetail[] = [];
    let hasUncertainty = false;

    // Collect trophy assignments
    let goldCriteria: { config: CriteriaConfig; pref: typeof preferences.preferences[0] } | null = null;
    const silverCriteria: { config: CriteriaConfig; pref: typeof preferences.preferences[0] }[] = [];
    const otherCriteria: CriteriaConfig[] = [];

    // Separate criteria by trophy level
    for (const pref of preferences.preferences) {
        const config = criteriaConfigs.find(c => c.id === pref.criteriaId);
        if (!config) continue;

        if (pref.level === 'gold' && !goldCriteria) {
            goldCriteria = { config, pref };
        } else if (pref.level === 'silver' && silverCriteria.length < 2) {
            silverCriteria.push({ config, pref });
        }
    }

    // All criteria not marked as gold or silver are "others" with weight 1
    for (const config of criteriaConfigs) {
        const isGold = goldCriteria?.config.id === config.id;
        const isSilver = silverCriteria.some(s => s.config.id === config.id);
        if (!isGold && !isSilver) {
            otherCriteria.push(config);
        }
    }

    // Calculate weighted points
    let totalPoints = 0;
    const MAX_POINTS = 180; // 50 + 60 + 70

    // Gold: weight 5 (max 50 points)
    if (goldCriteria) {
        const value = extractValue(product, goldCriteria.config.tech_field);
        if (value !== null) {
            totalPoints += value * 5;
        } else {
            totalPoints += 5 * 5; // Default 5/10 if missing
            hasUncertainty = true;
        }
    } else {
        // No gold selected, use average (5) × 5 = 25 points
        totalPoints += 25;
    }

    // Silver: weight 3 each (max 30 × 2 = 60 points)
    for (const silver of silverCriteria) {
        const value = extractValue(product, silver.config.tech_field);
        if (value !== null) {
            totalPoints += value * 3;
        } else {
            totalPoints += 5 * 3; // Default 5/10 if missing
            hasUncertainty = true;
        }
    }
    // Fill remaining silver slots with average if not selected
    const remainingSilverSlots = 2 - silverCriteria.length;
    totalPoints += remainingSilverSlots * 15; // 5 × 3 = 15 per slot

    // Others: weight 1 each (max 10 × 7 = 70 points)
    for (const config of otherCriteria) {
        const value = extractValue(product, config.tech_field);
        if (value !== null) {
            totalPoints += value * 1;
        } else {
            totalPoints += 5 * 1; // Default 5/10 if missing
            hasUncertainty = true;
        }
    }

    // Normalize to 100
    let finalScore = Math.round((totalPoints / MAX_POINTS) * 100);

    // Clamp to 0-100
    finalScore = Math.max(0, Math.min(100, finalScore));

    // Determine color
    let scoreColor: 'green' | 'yellow' | 'orange' | 'red';
    if (finalScore >= 85) scoreColor = 'green';
    else if (finalScore >= 60) scoreColor = 'yellow';
    else if (finalScore >= 40) scoreColor = 'orange';
    else scoreColor = 'red';

    return {
        productId,
        matchScore: finalScore,
        editorialScore: editorialScore * 10, // Convert to 0-100 scale
        scoreColor,
        hasPenalties: penalties.length > 0,
        penalties,
        hasUncertainty,
    };
}

/**
 * Generate human-readable penalty reason
 */
function generatePenaltyReason(
    config: CriteriaConfig,
    actualValue: number,
    wasImputed: boolean
): string {
    if (wasImputed) {
        return `${config.label}: Dado não disponível (estimativa conservadora usada)`;
    }

    const direction = config.lower_is_better ? 'acima' : 'abaixo';
    return `${config.label} ${direction} do ideal (${actualValue} vs ${config.target_value} alvo)`;
}

// ============================================
// BATCH SCORING & SORTING
// ============================================

/**
 * Calculate match scores for all products and sort by score
 */
export function rankProductsByMatch(
    products: Record<string, unknown>[],
    preferences: UserPreferences,
    criteriaConfigs: CriteriaConfig[]
): Array<{ product: Record<string, unknown>; result: MatchResult }> {
    const results = products.map(product => ({
        product,
        result: calculateMatchScore(product, preferences, criteriaConfigs),
    }));

    // Sort by match score (highest first)
    results.sort((a, b) => b.result.matchScore - a.result.matchScore);

    return results;
}
