/**
 * @file context-geo-restrictive.ts
 * @description Contextual Scoring Engine v4.0 - Geometric Mean + Hard Filters
 * 
 * Evolution from simpler weighted averages to context-aware scoring.
 * 
 * Key Changes:
 * - Phase 1: Hard Filters (Mutual Exclusion) to eliminate invalid combinations
 * - Phase 2: Weighted Geometric Mean instead of MAX for multi-context scoring
 * 
 * Why Geometric Mean?
 * - Arithmetic Mean: (9.5 + 2.0) / 2 = 5.75 → ignores the severity of the 2.0
 * - MAX (v3.0): max(9.5 × 2, 2.0 × 2) = 19 → completely ignores the weak criterion
 * - Geometric Mean: sqrt(9.5 × 2.0) = 4.36 → properly penalizes inconsistency
 * 
 * The Geometric Mean is the mathematically correct way to express:
 * "A chain is only as strong as its weakest link."
 * 
 * @version 4.0.0
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

/**
 * Product criteria scores (0-10 scale)
 */
export interface ProductCriteria {
    id: string;
    name: string;
    scores: Record<string, number>; // c1, c2, ..., c10 → 0-10
}

/**
 * Veto rule for hard filtering.
 * If condition is met, product is eliminated or heavily penalized.
 */
export interface VetoRule {
    /** Unique identifier */
    id: string;
    /** Human-readable description */
    description: string;
    /** Criterion being checked (e.g., 'c1', 'hasHEPA') */
    criterionId: string;
    /** Type of check */
    type: 'min_threshold' | 'max_threshold' | 'boolean_required';
    /** Threshold value (for min/max) or expected value (for boolean) */
    value: number | boolean;
    /** What happens on violation: 'eliminate' (score 0) or 'penalize' (heavy penalty) */
    action: 'eliminate' | 'penalize';
    /** Penalty multiplier if action is 'penalize' (e.g., 0.5 = halve the score) */
    penaltyMultiplier?: number;
}

/**
 * Context profile defining weight multipliers and veto rules.
 */
export interface ContextProfile {
    id: string;
    name: string;
    icon?: string;
    description?: string;
    /** 
     * Weight multipliers for each criterion (c1-c10).
     * 1.0 = original importance, 2.0 = double, 0.5 = half.
     */
    weightMultipliers: Partial<Record<string, number>>;
    /**
     * Hard filter rules that eliminate products.
     */
    vetoRules?: VetoRule[];
    /**
     * Mutually exclusive context IDs.
     * If user selects this AND any of these, throw error.
     */
    mutuallyExclusiveWith?: string[];
}

/**
 * Result of the scoring calculation.
 */
export interface ScoringResult {
    /** Final calculated score (0-10) */
    finalScore: number;
    /** Score before anti-ceiling compression */
    rawScore: number;
    /** Whether product was eliminated by veto */
    isEliminated: boolean;
    /** Veto reasons if eliminated */
    vetoReasons: string[];
    /** Active penalties applied */
    penalties: { reason: string; multiplier: number }[];
    /** Breakdown by criterion */
    breakdown: CriterionBreakdown[];
    /** Engine version */
    engine: 'hmum-v4-geo';
}

export interface CriterionBreakdown {
    id: string;
    label: string;
    rawScore: number;           // 0-10 scale
    normalizedScore: number;    // 0-1 scale (for geometric calculation)
    weight: number;             // Effective weight after multipliers
    contribution: number;       // Contribution to final score
}

// ============================================
// MUTUAL EXCLUSION GROUPS
// ============================================

/**
 * Defines groups of contexts that cannot be selected together.
 * These represent logically incompatible use cases.
 */
const MUTUAL_EXCLUSION_GROUPS: string[][] = [
    // Size-based exclusions: You can't simultaneously need a robot for
    // a small apartment AND a large house
    ['small_apartment', 'daily_maintenance', 'large_home'],

    // Example for TV: You can't be both a "cinema purist" and a "budget buyer"
    ['cinema_purist', 'budget_conscious'],
];

// ============================================
// CONTEXT PROFILES (ROBOT VACUUM EXAMPLE)
// ============================================

export const ROBOT_VACUUM_PROFILES_V4: ContextProfile[] = [
    {
        id: 'general_use',
        name: 'Uso Geral',
        icon: '📊',
        description: 'Score base com pesos originais.',
        weightMultipliers: {
            c1: 1.0, c2: 1.0, c3: 1.0, c4: 1.0, c5: 1.0,
            c6: 1.0, c7: 1.0, c8: 1.0, c9: 1.0, c10: 1.0,
        },
    },
    {
        id: 'daily_maintenance',
        name: 'Manutenção Diária (Apartamento)',
        icon: '🏠',
        description: 'Para limpeza leve de rotina em espaços até 60m².',
        mutuallyExclusiveWith: ['large_home'],
        weightMultipliers: {
            c1: 0.5,  // Navegação - menos crítico em espaços pequenos
            c2: 1.2,  // App/Voz
            c3: 1.5,  // Mop - limpeza completa
            c4: 1.0,  // Escovas
            c5: 1.8,  // Altura - passar sob móveis
            c6: 1.2,  // Peças BR
            c7: 0.6,  // Bateria - 60 min já basta
            c8: 1.4,  // Ruído - importante em apartamentos
            c9: 0.6,  // Base - simples basta
            c10: 0.3, // IA - não necessário
        },
        vetoRules: [
            {
                id: 'noise_limit',
                description: 'Ruído acima de 70dB é inaceitável para apartamentos',
                criterionId: 'c8',
                type: 'min_threshold',
                value: 5.0, // Score mínimo de 5.0 em Ruído
                action: 'penalize',
                penaltyMultiplier: 0.7,
            },
        ],
    },
    {
        id: 'large_home',
        name: 'Casas Grandes (>100m²)',
        icon: '🏡',
        description: 'Para residências grandes que exigem mapeamento e autonomia.',
        mutuallyExclusiveWith: ['daily_maintenance', 'small_apartment'],
        weightMultipliers: {
            c1: 2.5,  // Navegação - CRÍTICO
            c2: 1.5,  // App - zonas, mapas
            c3: 0.8,  // Mop
            c4: 1.2,  // Escovas
            c5: 0.6,  // Altura - menos crítico
            c6: 1.3,  // Peças BR
            c7: 2.0,  // Bateria - autonomia longa
            c8: 0.6,  // Ruído - menos crítico
            c9: 1.5,  // Base - auto-esvaziamento
            c10: 2.0, // IA - detecção obstáculos
        },
        vetoRules: [
            {
                id: 'navigation_required',
                description: 'Navegação ruim é inviável para casas grandes',
                criterionId: 'c1',
                type: 'min_threshold',
                value: 6.0, // Score mínimo de 6.0 em Navegação
                action: 'eliminate', // Produto é eliminado se não atender
            },
            {
                id: 'battery_required',
                description: 'Bateria curta é inviável para casas grandes',
                criterionId: 'c7',
                type: 'min_threshold',
                value: 5.0,
                action: 'penalize',
                penaltyMultiplier: 0.6,
            },
        ],
    },
    {
        id: 'pet_owners',
        name: 'Donos de Pets',
        icon: '🐕',
        description: 'Para casas com cães/gatos que soltam pelo.',
        weightMultipliers: {
            c1: 1.2,  // Navegação
            c2: 1.3,  // App - agendamento
            c3: 0.5,  // Mop - menos importante
            c4: 2.5,  // Escovas - CRÍTICO! Anti-embaraço
            c5: 1.0,  // Altura
            c6: 2.0,  // Peças BR - troca frequente
            c7: 1.2,  // Bateria
            c8: 1.0,  // Ruído
            c9: 2.0,  // Base - auto-esvaziamento
            c10: 1.5, // IA - evitar tigelas
        },
        vetoRules: [
            {
                id: 'brush_quality',
                description: 'Escova ruim é problema sério com pets',
                criterionId: 'c4',
                type: 'min_threshold',
                value: 5.0,
                action: 'penalize',
                penaltyMultiplier: 0.7,
            },
        ],
    },
];

// ============================================
// PHASE 1: HARD FILTERS (MUTUAL EXCLUSION)
// ============================================

export class MutualExclusionError extends Error {
    public conflictingContexts: string[];

    constructor(contexts: string[]) {
        super(`Contextos mutuamente exclusivos selecionados: ${contexts.join(', ')}`);
        this.name = 'MutualExclusionError';
        this.conflictingContexts = contexts;
    }
}

/**
 * Check for mutually exclusive context selections.
 * Throws MutualExclusionError if incompatible contexts are selected.
 * 
 * @param selectedContextIds - Array of selected context IDs
 * @param profiles - Available context profiles
 * @throws MutualExclusionError if conflicts detected
 */
export function checkMutualExclusion(
    selectedContextIds: string[],
    profiles: ContextProfile[]
): void {
    // Skip check if 0 or 1 context selected
    if (selectedContextIds.length <= 1) return;

    // Check each profile's exclusion rules
    for (const contextId of selectedContextIds) {
        const profile = profiles.find(p => p.id === contextId);
        if (!profile?.mutuallyExclusiveWith) continue;

        const conflicts = selectedContextIds.filter(
            id => id !== contextId && profile.mutuallyExclusiveWith!.includes(id)
        );

        if (conflicts.length > 0) {
            throw new MutualExclusionError([contextId, ...conflicts]);
        }
    }

    // Check global exclusion groups
    for (const group of MUTUAL_EXCLUSION_GROUPS) {
        const matches = selectedContextIds.filter(id => group.includes(id));
        if (matches.length > 1) {
            throw new MutualExclusionError(matches);
        }
    }
}

/**
 * Apply veto rules to a product.
 * Returns elimination status and penalties.
 */
export function applyVetoRules(
    productScores: Record<string, number>,
    activeProfiles: ContextProfile[]
): {
    isEliminated: boolean;
    vetoReasons: string[];
    penalties: { reason: string; multiplier: number }[];
} {
    const vetoReasons: string[] = [];
    const penalties: { reason: string; multiplier: number }[] = [];

    for (const profile of activeProfiles) {
        if (!profile.vetoRules) continue;

        for (const rule of profile.vetoRules) {
            const score = productScores[rule.criterionId] ?? 5.0;
            let violated = false;

            switch (rule.type) {
                case 'min_threshold':
                    violated = score < (rule.value as number);
                    break;
                case 'max_threshold':
                    violated = score > (rule.value as number);
                    break;
                case 'boolean_required':
                    violated = score < 5.0; // Interpret as "doesn't have feature"
                    break;
            }

            if (violated) {
                if (rule.action === 'eliminate') {
                    return {
                        isEliminated: true,
                        vetoReasons: [rule.description],
                        penalties: [],
                    };
                } else {
                    penalties.push({
                        reason: rule.description,
                        multiplier: rule.penaltyMultiplier || 0.5,
                    });
                }
            }
        }
    }

    return { isEliminated: false, vetoReasons, penalties };
}

// ============================================
// PHASE 2: WEIGHTED GEOMETRIC MEAN
// ============================================

/**
 * Laplace Smoothing constant.
 * 
 * Why we need this:
 * - log(0) = -Infinity → would crash the calculation
 * - A single 0 score shouldn't necessarily zero the entire product
 * - We add a small epsilon to avoid this edge case
 * 
 * Value: 0.1 on 0-10 scale → 0.01 on 0-1 normalized scale
 */
const LAPLACE_EPSILON = 0.01;

/**
 * Normalize score from 0-10 scale to 0-1 scale.
 * Applies Laplace smoothing to avoid log(0).
 */
function normalizeScore(score: number): number {
    // Clamp to valid range
    const clamped = Math.max(0, Math.min(10, score));
    // Normalize to 0-1 with Laplace smoothing
    return (clamped / 10) + LAPLACE_EPSILON;
}

/**
 * Calculate Weighted Geometric Mean.
 * 
 * Formula: exp( Σ(w_i × ln(s_i)) / Σ(w_i) )
 * 
 * Why Geometric Mean instead of Arithmetic Mean?
 * 
 * Consider Product A: Sucção = 9.5, Bateria = 2.0 (both weight 2)
 * 
 * Arithmetic Mean: (9.5 × 2 + 2.0 × 2) / (2 + 2) = 5.75
 *   → The 2.0 is "averaged out" and the product looks decent
 * 
 * MAX (v3.0): The 9.5 dominates completely
 *   → The 2.0 is completely ignored
 * 
 * Geometric Mean: exp((2 × ln(0.95) + 2 × ln(0.20)) / 4) = ~0.44 → 4.4/10
 *   → The low score properly penalizes the product
 * 
 * The Geometric Mean enforces: "You need to be GOOD at everything that matters,
 * not just GREAT at one thing."
 * 
 * @param criteria - Array of {score, weight} pairs
 * @returns Score on 0-1 scale (multiply by 10 for display)
 */
export function calculateWeightedGeometricMean(
    criteria: Array<{ normalizedScore: number; weight: number }>
): number {
    let weightedLogSum = 0;
    let totalWeight = 0;

    for (const { normalizedScore, weight } of criteria) {
        if (weight <= 0) continue; // Skip zero-weight criteria

        // Take natural log of normalized score
        const logScore = Math.log(normalizedScore);

        // Add weighted contribution
        weightedLogSum += weight * logScore;
        totalWeight += weight;
    }

    if (totalWeight === 0) return 0.5; // Fallback to middle score

    // exp of weighted average of logs = geometric mean
    const geometricMean = Math.exp(weightedLogSum / totalWeight);

    // Remove Laplace epsilon effect and clamp
    const adjusted = geometricMean - LAPLACE_EPSILON;
    return Math.max(0, Math.min(1, adjusted));
}

/**
 * Combine context profiles using GEOMETRIC MEAN of multipliers.
 * 
 * This replaces the v3.0 MAX logic.
 * 
 * Before (MAX): max(0.5, 2.5, 1.2) = 2.5 → weak profile ignored
 * After (Geo): (0.5 × 2.5 × 1.2)^(1/3) = 1.15 → balanced combination
 */
function combineProfilesGeometric(
    profiles: ContextProfile[],
    selectedIds: string[]
): Partial<Record<string, number>> {
    const selectedProfiles = selectedIds
        .map(id => profiles.find(p => p.id === id))
        .filter((p): p is ContextProfile => p !== undefined);

    if (selectedProfiles.length === 0) {
        return profiles[0]?.weightMultipliers || {};
    }

    if (selectedProfiles.length === 1) {
        return selectedProfiles[0].weightMultipliers;
    }

    // Collect all criteria IDs
    const allCriteria = new Set<string>();
    for (const profile of selectedProfiles) {
        Object.keys(profile.weightMultipliers || {}).forEach(k => allCriteria.add(k));
    }

    const combined: Partial<Record<string, number>> = {};

    for (const criterion of allCriteria) {
        const weights = selectedProfiles.map(p => p.weightMultipliers?.[criterion] ?? 1.0);

        // Geometric mean of weights: (w1 × w2 × ... × wn)^(1/n)
        const product = weights.reduce((acc, w) => acc * w, 1);
        const geometricMean = Math.pow(product, 1 / weights.length);

        combined[criterion] = Math.round(geometricMean * 100) / 100;
    }

    return combined;
}

// ============================================
// MAIN SCORING FUNCTION (v4.0)
// ============================================

/**
 * Calculate unified score using HMUM v4.0 (Geo-Restrictive).
 * 
 * @param productScores - Product's criterion scores (c1-c10, 0-10 scale)
 * @param selectedContextIds - Array of selected context IDs
 * @param profiles - Available context profiles (defaults to robot vacuum)
 * @returns ScoringResult with final score and breakdown
 */
export function calculateHMUMv4Score(
    productScores: Record<string, number>,
    selectedContextIds: string[],
    profiles: ContextProfile[] = ROBOT_VACUUM_PROFILES_V4
): ScoringResult {
    // ================================
    // PHASE 1: HARD FILTERS
    // ================================

    // 1a. Check mutual exclusion
    checkMutualExclusion(selectedContextIds, profiles);

    // 1b. Get active profiles
    const activeProfileIds = selectedContextIds.length > 0
        ? selectedContextIds.filter(id => id !== 'general_use')
        : ['general_use'];

    const activeProfiles = activeProfileIds
        .map(id => profiles.find(p => p.id === id))
        .filter((p): p is ContextProfile => p !== undefined);

    // 1c. Apply veto rules
    const vetoResult = applyVetoRules(productScores, activeProfiles);

    if (vetoResult.isEliminated) {
        return {
            finalScore: 0,
            rawScore: 0,
            isEliminated: true,
            vetoReasons: vetoResult.vetoReasons,
            penalties: [],
            breakdown: [],
            engine: 'hmum-v4-geo',
        };
    }

    // ================================
    // PHASE 2: GEOMETRIC MEAN SCORING
    // ================================

    // 2a. Combine profiles using geometric mean of multipliers
    const combinedMultipliers = combineProfilesGeometric(profiles, activeProfileIds);

    // 2b. Build criteria array with normalized scores and effective weights
    const criteriaArray: Array<{
        id: string;
        rawScore: number;
        normalizedScore: number;
        weight: number;
    }> = [];

    // Base weight for each criterion (assuming 10 criteria = 0.1 each)
    const baseWeight = 0.1;

    for (let i = 1; i <= 10; i++) {
        const criterionId = `c${i}`;
        const rawScore = productScores[criterionId] ?? 5.0;
        const multiplier = combinedMultipliers[criterionId] ?? 1.0;

        criteriaArray.push({
            id: criterionId,
            rawScore,
            normalizedScore: normalizeScore(rawScore),
            weight: baseWeight * multiplier,
        });
    }

    // 2c. Calculate weighted geometric mean
    const geoMeanNormalized = calculateWeightedGeometricMean(criteriaArray);

    // 2d. Convert back to 0-10 scale
    let rawScore = geoMeanNormalized * 10;

    // 2e. Apply penalties from veto rules (non-eliminating ones)
    let penaltyMultiplier = 1.0;
    for (const penalty of vetoResult.penalties) {
        penaltyMultiplier *= penalty.multiplier;
    }
    rawScore *= penaltyMultiplier;

    // 2f. Apply anti-ceiling compression: Score = 5 + (raw - 5) × 0.90
    const COMPRESSION_FACTOR = 0.90;
    const MIDPOINT = 5.0;
    const finalScore = MIDPOINT + (rawScore - MIDPOINT) * COMPRESSION_FACTOR;

    // ================================
    // BUILD RESULT
    // ================================

    const breakdown: CriterionBreakdown[] = criteriaArray.map(c => ({
        id: c.id,
        label: getCriterionLabel(c.id),
        rawScore: c.rawScore,
        normalizedScore: c.normalizedScore,
        weight: c.weight,
        contribution: c.normalizedScore * c.weight,
    }));

    return {
        finalScore: Math.round(finalScore * 10) / 10,
        rawScore: Math.round(rawScore * 10) / 10,
        isEliminated: false,
        vetoReasons: [],
        penalties: vetoResult.penalties,
        breakdown,
        engine: 'hmum-v4-geo',
    };
}

// Helper: Get criterion labels
function getCriterionLabel(id: string): string {
    const labels: Record<string, string> = {
        c1: 'Navegação', c2: 'App/Voz', c3: 'Mop', c4: 'Escovas', c5: 'Altura',
        c6: 'Peças BR', c7: 'Bateria', c8: 'Ruído', c9: 'Base', c10: 'IA',
    };
    return labels[id] || id;
}

// ============================================
// COMPARISON SIMULATION: MAX vs GEOMETRIC
// ============================================

/**
 * Demonstrates the difference between MAX (v3.0) and Geometric Mean (v4.0).
 */
export function runComparisonSimulation(): void {
    console.log('='.repeat(60));
    console.log('COMPARISON: MAX (v3.0) vs GEOMETRIC MEAN (v4.0)');
    console.log('='.repeat(60));

    // Product A: "Especialista Falho"
    // Great at suction (c1), terrible at battery (c7)
    const productA = {
        c1: 9.5,  // Navegação: Excelente
        c2: 7.0,
        c3: 7.0,
        c4: 7.0,
        c5: 7.0,
        c6: 7.0,
        c7: 2.0,  // Bateria: Péssima
        c8: 7.0,
        c9: 7.0,
        c10: 7.0,
    };

    // Product B: "Equilibrado"
    // Good at everything, great at nothing
    const productB = {
        c1: 7.5,
        c2: 7.5,
        c3: 7.5,
        c4: 7.5,
        c5: 7.5,
        c6: 7.5,
        c7: 7.5,
        c8: 7.5,
        c9: 7.5,
        c10: 7.5,
    };

    // Context: Large Home (emphasizes c1=Navigation and c7=Battery)
    const context = ['large_home'];

    console.log('\n--- Product A (Especialista Falho) ---');
    console.log('c1 (Navegação): 9.5  |  c7 (Bateria): 2.0');

    console.log('\n--- Product B (Equilibrado) ---');
    console.log('Todos os critérios: 7.5');

    console.log('\n--- Context: Casas Grandes (>100m²) ---');
    console.log('c1 peso: ×2.5  |  c7 peso: ×2.0');

    // V3.0 MAX Calculation (simplified simulation)
    console.log('\n[V3.0 MAX - ANTIGO]');
    const maxWeightedA = Math.max(9.5 * 2.5, 2.0 * 2.0); // = 23.75
    const maxWeightedB = Math.max(7.5 * 2.5, 7.5 * 2.0); // = 18.75
    console.log(`Produto A: MAX contribuição = ${maxWeightedA} (9.5×2.5 domina)`);
    console.log(`Produto B: MAX contribuição = ${maxWeightedB}`);
    console.log(`→ Produto A GANHA apesar da bateria péssima!`);

    // V4.0 Geometric Calculation
    console.log('\n[V4.0 GEOMETRIC - NOVO]');
    try {
        const resultA = calculateHMUMv4Score(productA, context);
        const resultB = calculateHMUMv4Score(productB, context);

        console.log(`Produto A: Score = ${resultA.finalScore}`);
        console.log(`  Eliminado? ${resultA.isEliminated ? 'SIM - ' + resultA.vetoReasons.join(', ') : 'Não'}`);
        if (resultA.penalties.length > 0) {
            console.log(`  Penalidades: ${resultA.penalties.map(p => p.reason).join(', ')}`);
        }

        console.log(`Produto B: Score = ${resultB.finalScore}`);
        console.log(`  Eliminado? ${resultB.isEliminated ? 'SIM' : 'Não'}`);

        if (!resultA.isEliminated && !resultB.isEliminated) {
            const winner = resultA.finalScore > resultB.finalScore ? 'A' : 'B';
            console.log(`\n→ Produto ${winner} GANHA com Geometric Mean`);
        }
    } catch (e) {
        console.log('Erro:', e);
    }

    console.log('\n' + '='.repeat(60));
}

// ============================================
// EXPORTS
// ============================================

export default {
    calculateHMUMv4Score,
    checkMutualExclusion,
    applyVetoRules,
    calculateWeightedGeometricMean,
    runComparisonSimulation,
    MutualExclusionError,
    ROBOT_VACUUM_PROFILES_V4,
};

// Run simulation if executed directly (for testing)
// runComparisonSimulation();
