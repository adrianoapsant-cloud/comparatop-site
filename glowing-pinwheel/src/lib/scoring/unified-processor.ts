/**
 * @file unified-processor.ts
 * @description HMUM v3.0 - Simplified Direct Weighted Average
 * 
 * Architecture:
 * - Score = Σ (score_critério × peso_critério)
 * - "general_use" context uses ORIGINAL weights → matches top score (8.7)
 * - Specific contexts modify weights → produces delta
 * 
 * This is the ONLY scoring engine - no legacy fallback needed.
 * 
 * @version 3.0.0 (Simplified)
 */

import type { Product, ScoredProduct } from '@/types/category';
import { getUnifiedScore } from '@/lib/scoring/getUnifiedScore';
import {
    checkMutualExclusion,
    ROBOT_VACUUM_PROFILES_V4
} from '@/lib/scoring/hmum-v4-geo-restrictive';

// ============================================
// TYPES
// ============================================

/**
 * Weight profile for a specific context.
 * Maps criterion ID (c1-c10) to weight multiplier.
 */
export interface ContextWeightProfile {
    id: string;
    name: string;
    icon?: string;
    description?: string;
    /**
     * Weight multipliers for each criterion.
     * Values are multipliers applied to the original weight.
     * 1.0 = same as original, 2.0 = double importance, 0.5 = half importance
     */
    weightMultipliers: Partial<Record<string, number>>;
}

/**
 * Criterion data from productDna.dimensions
 */
export interface CriterionData {
    id: string;
    name: string;
    score: number;
    weight: number;
}

/**
 * Unified scoring result
 */
export interface UnifiedScoringResult {
    /** Base score calculated using original weights (0-10) */
    baseScore: number;

    /** Contextual score for selected context (0-10) */
    contextualScore: number;

    /** Delta from base score (positive = better for this context, negative = worse) */
    delta: number;

    /** Final score to display (equals contextualScore) */
    finalScore: number;

    /** Source engine used */
    engine: 'hmum' | 'hmum-v4-geo';

    /** Context IDs used for evaluation (supports multiple) */
    contextIds: string[];

    /** Context names for display */
    contextNames: string[];

    /** Whether product is incompatible with context */
    isFatal: boolean;

    /** Reason for incompatibility */
    fatalReason?: string;

    /** Score breakdown by criterion */
    breakdown: UnifiedBreakdownItem[];

    /** Top strengths */
    strengths: UnifiedBreakdownItem[];

    /** Top weaknesses */
    weaknesses: UnifiedBreakdownItem[];

    /** Applied penalties */
    penalties: { reason: string; impact: number }[];
}

/**
 * Breakdown item for each criterion
 */
export interface UnifiedBreakdownItem {
    id: string;
    label: string;
    value: number; // raw score
    utility: number; // normalized 0-1
    weight: number; // effective weight
    contribution: number; // score × weight
    type: 'strength' | 'weakness' | 'neutral';
}

// ============================================
// CONTEXT WEIGHT PROFILES
// ============================================

/**
 * Context weight profiles for Smart TV category.
 * Each profile defines weight multipliers relative to default.
 */
const TV_CONTEXT_PROFILES: ContextWeightProfile[] = [
    // BASE CONTEXT - uses multiplier 1.0 for all (= original weights)
    {
        id: 'general_use',
        name: 'Uso Geral',
        icon: '📊',
        description: 'Score base com pesos originais. Este é o score principal.',
        weightMultipliers: {
            // All at 1.0 = original weights
            c1: 1.0, // Custo-Benefício
            c2: 1.0, // Design
            c3: 1.0, // Processamento
            c4: 1.0, // Qualidade de Imagem
            c5: 1.0, // Áudio
            c6: 1.0, // Gaming
            c7: 1.0, // Smart TV
            c8: 1.0, // Conectividade
            c9: 1.0, // Durabilidade
            c10: 1.0, // Suporte
        },
    },
    // CINEMA CONTEXT - emphasizes image quality, audio, de-emphasizes gaming
    {
        id: 'cinema_dark_room',
        name: 'Cinema / Sala Escura',
        icon: '🎬',
        description: 'Foco em qualidade de imagem e áudio para filmes.',
        weightMultipliers: {
            c1: 0.7,  // Custo-Benefício - menos importante para cinéfilos
            c2: 1.2,  // Design - importante para home theater
            c3: 1.0,  // Processamento
            c4: 2.0,  // Qualidade de Imagem - MUITO importante
            c5: 1.8,  // Áudio - importante
            c6: 0.3,  // Gaming - não é o foco
            c7: 0.8,  // Smart TV
            c8: 1.0,  // Conectividade
            c9: 1.0,  // Durabilidade
            c10: 1.0, // Suporte
        },
    },
    // GAMER CONTEXT - emphasizes gaming, input lag related specs
    {
        id: 'gamer_competitive',
        name: 'Gamer Competitivo (PC/PS5/Xbox)',
        icon: '🎮',
        description: 'Foco em gaming, input lag, VRR e conectividade.',
        weightMultipliers: {
            c1: 0.6,  // Custo-Benefício - gamers pagam por performance
            c2: 0.5,  // Design - menos importante
            c3: 1.2,  // Processamento
            c4: 1.0,  // Qualidade de Imagem
            c5: 0.5,  // Áudio - gamers usam headset
            c6: 3.0,  // Gaming - MUITO importante
            c7: 0.6,  // Smart TV
            c8: 1.8,  // Conectividade - HDMI 2.1
            c9: 0.8,  // Durabilidade
            c10: 0.5, // Suporte
        },
    },
    // CASUAL/FAMILY CONTEXT
    {
        id: 'family_casual',
        name: 'Família / Uso Casual',
        icon: '👨‍👩‍👧‍👦',
        description: 'Equilíbrio entre custo, facilidade de uso e durabilidade.',
        weightMultipliers: {
            c1: 1.5,  // Custo-Benefício - importante
            c2: 1.0,  // Design
            c3: 0.8,  // Processamento
            c4: 1.0,  // Qualidade de Imagem
            c5: 1.2,  // Áudio - família assiste junto
            c6: 0.5,  // Gaming
            c7: 1.5,  // Smart TV - apps, facilidade
            c8: 0.8,  // Conectividade
            c9: 1.3,  // Durabilidade - investimento longo prazo
            c10: 1.3, // Suporte
        },
    },
];

/**
 * Context weight profiles for Robot Vacuum category.
 * Uses PARR-BR criteria: c1=Navegação, c2=App, c3=Mop, c4=Escovas, c5=Altura,
 * c6=Peças, c7=Bateria, c8=Ruído, c9=Base, c10=IA
 */
const ROBOT_VACUUM_CONTEXT_PROFILES: ContextWeightProfile[] = [
    // BASE CONTEXT
    {
        id: 'general_use',
        name: 'Uso Geral',
        icon: '📊',
        description: 'Score base com pesos PARR-BR originais.',
        weightMultipliers: {
            c1: 1.0, c2: 1.0, c3: 1.0, c4: 1.0, c5: 1.0,
            c6: 1.0, c7: 1.0, c8: 1.0, c9: 1.0, c10: 1.0,
        },
    },
    // DAILY MAINTENANCE - small spaces, quick clean
    {
        id: 'daily_maintenance',
        name: 'Manutenção Diária (Apartamento)',
        icon: '🏠',
        description: 'Para limpeza leve de rotina em espaços até 60m².',
        weightMultipliers: {
            c1: 0.5,  // Navegação - menos crítico em espaços pequenos
            c2: 1.2,  // App/Voz - conveniência do dia-a-dia
            c3: 1.5,  // Mop - limpeza completa 3-em-1
            c4: 1.0,  // Escovas
            c5: 1.8,  // Altura - passar sob móveis é importante
            c6: 1.2,  // Peças BR - importante para reposição
            c7: 0.6,  // Bateria - 60 min já basta
            c8: 1.4,  // Ruído - importante para apartamentos
            c9: 0.6,  // Base - simples basta
            c10: 0.3, // IA - não necessário para espaços pequenos
        },
    },
    // LARGE HOMES - needs good navigation, battery, mapping
    {
        id: 'large_home',
        name: 'Casas Grandes (>100m²)',
        icon: '🏡',
        description: 'Para residências grandes que exigem mapeamento e autonomia.',
        weightMultipliers: {
            c1: 2.5,  // Navegação - CRÍTICO para eficiência
            c2: 1.5,  // App - zonas, mapas
            c3: 0.8,  // Mop
            c4: 1.2,  // Escovas - mais área = mais desgaste
            c5: 0.6,  // Altura - menos crítico
            c6: 1.3,  // Peças BR
            c7: 2.0,  // Bateria - autonomia longa necessária
            c8: 0.6,  // Ruído - menos crítico em casa grande
            c9: 1.5,  // Base - auto-esvaziamento ajuda
            c10: 2.0, // IA - detecção de obstáculos importante
        },
    },
    // PET OWNERS - hair/fur, frequent cleaning
    {
        id: 'pet_owners',
        name: 'Donos de Pets',
        icon: '🐕',
        description: 'Para casas com cães/gatos que soltam pelo.',
        weightMultipliers: {
            c1: 1.2,  // Navegação
            c2: 1.3,  // App - agendamento automático
            c3: 0.5,  // Mop - menos importante
            c4: 2.5,  // Escovas - CRÍTICO! Escova anti-embaraço
            c5: 1.0,  // Altura
            c6: 2.0,  // Peças BR - troca frequente de filtros
            c7: 1.2,  // Bateria
            c8: 1.0,  // Ruído
            c9: 2.0,  // Base - auto-esvaziamento evita cheiro
            c10: 1.5, // IA - evitar tigelas, brinquedos
        },
    },
];

// Registry of profiles by category
const CONTEXT_PROFILES_REGISTRY: Record<string, ContextWeightProfile[]> = {
    'tv': TV_CONTEXT_PROFILES,
    'smart-tv': TV_CONTEXT_PROFILES,
    'smarttv': TV_CONTEXT_PROFILES,
    'robot-vacuum': ROBOT_VACUUM_CONTEXT_PROFILES,
    'robo-aspirador': ROBOT_VACUUM_CONTEXT_PROFILES,
    'robotvacuum': ROBOT_VACUUM_CONTEXT_PROFILES,
    // TODO: Add notebook profiles
    // 'notebook': NOTEBOOK_CONTEXT_PROFILES,
};

// ============================================
// MULTI-CONTEXT HELPERS
// ============================================

/**
 * Normalize contextIds to array format.
 * Accepts: undefined, single string, or array of strings.
 */
function normalizeContextIds(contextIds: string | string[] | undefined): string[] {
    if (!contextIds) return [];
    if (typeof contextIds === 'string') return [contextIds];
    return contextIds.filter(id => id && id !== 'general_use');
}

/**
 * Combina perfis de contexto usando lógica de "União de Exigências".
 * 
 * Estratégia v2.0 (Cumulativo):
 * 1. MAXIMIZAÇÃO: Para cada critério, adota o maior peso entre os perfis.
 *    (Garante que a exigência crítica de um perfil não seja diluída pelo outro)
 * 2. SINERGIA: Se múltiplos perfis consideram o critério importante (>1.1),
 *    aplica um bônus multiplicativo para premiar produtos versáteis.
 * 
 * @param allProfiles - All available context profiles for the category
 * @param selectedIds - IDs of contexts selected by user
 * @returns Combined profile with maximized weights + synergy bonus
 */
function combineContextProfiles(
    allProfiles: ContextWeightProfile[],
    selectedIds: string[]
): ContextWeightProfile {
    // 1. Identificar perfis ativos
    const selectedProfiles = selectedIds
        .map(id => allProfiles.find(p => p.id === id))
        .filter((p): p is ContextWeightProfile => p !== undefined);

    // Retornos rápidos (sem combinação necessária)
    if (selectedProfiles.length === 0) return allProfiles[0];
    if (selectedProfiles.length === 1) return selectedProfiles[0];

    const combinedWeights: Partial<Record<string, number>> = {};
    const allCriteria = new Set<string>();

    // 2. Coletar todos os critérios envolvidos nos perfis selecionados
    for (const profile of selectedProfiles) {
        if (profile.weightMultipliers) {
            for (const key of Object.keys(profile.weightMultipliers)) {
                allCriteria.add(key);
            }
        }
    }

    // Configurações da Lógica
    const SYNERGY_THRESHOLD = 1.1;   // Peso mínimo para considerar que o perfil "se importa"
    const SYNERGY_MULTIPLIER = 1.15; // 15% de bônus se houver concordância entre perfis
    const MAX_WEIGHT_CAP = 4.0;      // Teto de segurança para evitar distorções extremas

    // 3. Calcular pesos combinados
    for (const criterion of allCriteria) {
        // Coleta pesos de cada perfil (assume 1.0 se não definido no perfil)
        const weights = selectedProfiles.map(p => p.weightMultipliers?.[criterion] ?? 1.0);

        // PASSO A: Regra do Máximo (Resolve a diluição)
        // O maior peso define a base. Se um exige (3.0) e outro ignora (0.3), fica 3.0.
        let finalWeight = Math.max(...weights);

        // PASSO B: Verificar Sinergia
        // Quantos contextos consideram este critério ativamente importante?
        const relevantCount = weights.filter(w => w >= SYNERGY_THRESHOLD).length;

        // Se 2 ou mais contextos concordam na importância, aplica boost
        if (relevantCount >= 2) {
            finalWeight *= SYNERGY_MULTIPLIER;
        }

        // Aplica teto de segurança e arredonda para 2 casas
        finalWeight = Math.min(finalWeight, MAX_WEIGHT_CAP);
        combinedWeights[criterion] = Math.round(finalWeight * 100) / 100;
    }

    return {
        id: 'combined_' + selectedIds.join('_'),
        name: selectedProfiles.map(p => p.name).join(' + '),
        icon: '🔥',
        description: `Modo Híbrido: exigências máximas de ${selectedProfiles.length} contextos`,
        weightMultipliers: combinedWeights,
    };
}

/**
 * Apply anti-ceiling compression to prevent score reaching 10.
 * Formula: Score = 5 + (raw - 5) * 0.90
 * 
 * Effect: 10 → 9.5, 8 → 7.7, 5 → 5.0
 */
function applyAntiCeilingCompression(rawScore: number): number {
    const COMPRESSION_FACTOR = 0.90;
    const MIDPOINT = 5.0;

    // Compress scores away from midpoint
    const compressed = MIDPOINT + (rawScore - MIDPOINT) * COMPRESSION_FACTOR;

    // Clamp to valid range
    return Math.max(0, Math.min(10, compressed));
}

// ============================================
// MAIN SCORING FUNCTION
// ============================================

/**
 * Calculate unified score using simple weighted average.
 * 
 * @param product - Product with productDna.dimensions containing 10 criteria
 * @param contextIds - Array of context IDs to combine (defaults to ['general_use'])
 * @returns UnifiedScoringResult with baseScore, contextualScore, and delta
 */
export function calculateUnifiedScore(
    product: Product | ScoredProduct,
    contextIds?: string | string[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _userSettings?: {
        voltage?: 110 | 220 | 'bivolt';
        locationType?: 'coastal' | 'inland';
    }
): UnifiedScoringResult {
    // Normalize contextIds to array
    const normalizedContextIds = normalizeContextIds(contextIds);

    // ========================================
    // PHASE 0: MUTUAL EXCLUSION CHECK
    // ========================================
    // For robot vacuum category, use v4 profiles which have mutuallyExclusiveWith
    // This will throw MutualExclusionError if conflicting contexts are selected
    const categoryId = product.categoryId || 'tv';
    const isRobotVacuum = categoryId.toLowerCase().includes('robot') ||
        categoryId.toLowerCase().includes('robo') ||
        categoryId.toLowerCase().includes('aspirador');

    if (isRobotVacuum && normalizedContextIds.length > 1) {
        // Use v4 profiles which have exclusion rules defined
        checkMutualExclusion(normalizedContextIds, ROBOT_VACUUM_PROFILES_V4);
    }

    // 1. Extract criteria from product
    const criteria = extractCriteria(product);

    if (criteria.length === 0) {
        // Fallback: use computed.overall if available
        const overallScore = getOverallScore(product);
        return createFallbackResult(overallScore);
    }

    // 2. Get context profiles for this category
    const profiles = getContextProfiles(categoryId);

    // 3. Get BASE score from product JSON using unified scoring
    // This ensures consistency: getUnifiedScore is the single source of truth
    const baseProfile = profiles.find(p => p.id === 'general_use') || profiles[0];
    const baseScore = getUnifiedScore(product);

    // 4. Calculate CONTEXTUAL score with combined profiles
    const isBaseOnly = normalizedContextIds.length === 0 ||
        (normalizedContextIds.length === 1 && normalizedContextIds[0] === 'general_use');

    const combinedProfile = isBaseOnly
        ? baseProfile
        : combineContextProfiles(profiles, normalizedContextIds);

    const rawContextualScore = isBaseOnly
        ? baseScore
        : calculateWeightedScore(criteria, combinedProfile);

    // Apply anti-ceiling compression: Score = 5 + (raw - 5) * 0.90
    const contextualScore = applyAntiCeilingCompression(rawContextualScore);

    // 5. Calculate delta
    const delta = Math.round((contextualScore - baseScore) * 10) / 10;

    // 6. Generate breakdown
    const breakdown = createBreakdown(criteria, combinedProfile);

    // Separate strengths and weaknesses
    const strengths = breakdown
        .filter(b => b.type === 'strength')
        .sort((a, b) => b.contribution - a.contribution)
        .slice(0, 3);

    const weaknesses = breakdown
        .filter(b => b.type === 'weakness')
        .sort((a, b) => a.value - b.value)
        .slice(0, 3);

    // Get context names for display
    const selectedProfiles = normalizedContextIds
        .map(id => profiles.find(p => p.id === id))
        .filter((p): p is ContextWeightProfile => p !== undefined);

    return {
        baseScore: Math.round(baseScore * 10) / 10,
        contextualScore: Math.round(contextualScore * 10) / 10,
        delta,
        finalScore: Math.round(contextualScore * 10) / 10,
        engine: 'hmum',
        contextIds: normalizedContextIds,
        contextNames: selectedProfiles.map(p => p.name),
        isFatal: false,
        breakdown,
        strengths,
        weaknesses,
        penalties: [],
    };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Extract criteria from product.productDna.dimensions or product.scores
 */
function extractCriteria(product: Product | ScoredProduct): CriterionData[] {
    // Labels for 10 Dores by category
    const TV_CRITERION_LABELS: Record<string, string> = {
        c1: 'Custo-Benefício',
        c2: 'Processamento de Imagem',
        c3: 'Confiabilidade/Hardware',
        c4: 'Fluidez do Sistema',
        c5: 'Desempenho Game',
        c6: 'Brilho e Reflexo',
        c7: 'Pós-Venda e Reputação',
        c8: 'Qualidade de Som',
        c9: 'Conectividade',
        c10: 'Design e Instalação',
    };

    const FRIDGE_CRITERION_LABELS: Record<string, string> = {
        c1: 'Custo-Benefício',
        c2: 'Eficiência Energética',
        c3: 'Capacidade e Espaço',
        c4: 'Sistema de Refrigeração',
        c5: 'Confiabilidade',
        c6: 'Nível de Ruído',
        c7: 'Pós-Venda e Suporte',
        c8: 'Recursos Smart',
        c9: 'Design e Acabamento',
        c10: 'Funcionalidades Extras',
    };

    const AC_CRITERION_LABELS: Record<string, string> = {
        c1: 'Custo-Benefício',
        c2: 'Eficiência Energética',
        c3: 'Capacidade de Refrigeração',
        c4: 'Durabilidade',
        c5: 'Nível de Ruído',
        c6: 'Tecnologia Inverter',
        c7: 'Filtros de Ar',
        c8: 'Facilidade de Instalação',
        c9: 'Conectividade',
        c10: 'Design',
    };

    const ROBOT_VACUUM_CRITERION_LABELS: Record<string, string> = {
        c1: 'Navegação',
        c2: 'App/Conectividade',
        c3: 'Mop',
        c4: 'Escovas',
        c5: 'Altura',
        c6: 'Peças BR',
        c7: 'Bateria',
        c8: 'Ruído',
        c9: 'Base',
        c10: 'IA',
    };

    // Get labels based on category
    const getCriterionLabel = (id: string, categoryId: string): string => {
        const category = categoryId.toLowerCase();
        if (category.includes('fridge') || category.includes('geladeira')) {
            return FRIDGE_CRITERION_LABELS[id] || id;
        }
        if (category.includes('air') || category.includes('ar')) {
            return AC_CRITERION_LABELS[id] || id;
        }
        if (category.includes('robot') || category.includes('robo') || category.includes('aspirador')) {
            return ROBOT_VACUUM_CRITERION_LABELS[id] || id;
        }
        // Default to TV labels
        return TV_CRITERION_LABELS[id] || id;
    };

    // Try productDna.dimensions first (preferred format)
    const productData = product as unknown as {
        productDna?: {
            dimensions?: Array<{
                id: string;
                name: string;
                score: number;
                weight: number;
            }>
        }
    };

    if (productData.productDna?.dimensions) {
        return productData.productDna.dimensions.map(d => ({
            id: d.id,
            name: d.name,
            score: d.score,
            weight: d.weight,
        }));
    }

    // Fallback: try product.scores with proper labels
    if (product.scores && Object.keys(product.scores).length > 0) {
        const scoreEntries = Object.entries(product.scores);
        const equalWeight = 1 / scoreEntries.length;
        const categoryId = product.categoryId || 'tv';

        return scoreEntries.map(([id, score]) => ({
            id,
            name: getCriterionLabel(id, categoryId),
            score: score as number,
            weight: equalWeight,
        }));
    }

    return [];
}

/**
 * Get overall score from product
 */
function getOverallScore(product: Product | ScoredProduct): number {
    const scored = product as ScoredProduct;
    if (scored.computed?.overall) {
        return scored.computed.overall;
    }
    // Try header.overallScore
    const productData = product as unknown as { header?: { overallScore?: number } };
    if (productData.header?.overallScore) {
        return productData.header.overallScore;
    }
    return 5.0;
}

/**
 * Get context profiles for a category
 */
function getContextProfiles(categoryId: string): ContextWeightProfile[] {
    const normalized = categoryId.toLowerCase().replace(/[-_\s]/g, '');
    return CONTEXT_PROFILES_REGISTRY[normalized]
        || CONTEXT_PROFILES_REGISTRY[categoryId]
        || TV_CONTEXT_PROFILES; // default
}

/**
 * Calculate weighted score with context multipliers.
 * 
 * Score = Σ (criterion_score × (original_weight × multiplier)) / Σ (original_weight × multiplier)
 */
function calculateWeightedScore(
    criteria: CriterionData[],
    profile: ContextWeightProfile
): number {
    let weightedSum = 0;
    let totalWeight = 0;

    for (const criterion of criteria) {
        const multiplier = profile.weightMultipliers[criterion.id] ?? 1.0;
        const effectiveWeight = criterion.weight * multiplier;

        weightedSum += criterion.score * effectiveWeight;
        totalWeight += effectiveWeight;
    }

    return totalWeight > 0 ? weightedSum / totalWeight : 5.0;
}

/**
 * Create breakdown items for each criterion
 */
function createBreakdown(
    criteria: CriterionData[],
    profile: ContextWeightProfile
): UnifiedBreakdownItem[] {
    // Calculate total weight for normalization
    let totalWeight = 0;
    for (const criterion of criteria) {
        const multiplier = profile.weightMultipliers[criterion.id] ?? 1.0;
        totalWeight += criterion.weight * multiplier;
    }

    return criteria.map(criterion => {
        const multiplier = profile.weightMultipliers[criterion.id] ?? 1.0;
        const effectiveWeight = (criterion.weight * multiplier) / totalWeight;
        const contribution = criterion.score * effectiveWeight;
        const utility = criterion.score / 10;

        let type: 'strength' | 'weakness' | 'neutral' = 'neutral';
        if (criterion.score >= 8.5) type = 'strength';
        else if (criterion.score <= 6.5) type = 'weakness';

        return {
            id: criterion.id,
            label: criterion.name,
            value: criterion.score,
            utility,
            weight: effectiveWeight,
            contribution,
            type,
        };
    });
}

/**
 * Create fallback result when no criteria available
 */
function createFallbackResult(score: number): UnifiedScoringResult {
    const roundedScore = Math.round(score * 10) / 10;
    return {
        baseScore: roundedScore,
        contextualScore: roundedScore,
        delta: 0,
        finalScore: roundedScore,
        engine: 'hmum',
        contextIds: [],
        contextNames: [],
        isFatal: false,
        breakdown: [],
        strengths: [],
        weaknesses: [],
        penalties: [],
    };
}

// ============================================
// PUBLIC API
// ============================================

/**
 * Check if a category has context support
 */
export function supportsContextualScoring(categoryId: string): boolean {
    const normalized = categoryId.toLowerCase().replace(/[-_\s]/g, '');
    return normalized in CONTEXT_PROFILES_REGISTRY || categoryId in CONTEXT_PROFILES_REGISTRY;
}

/**
 * Check if a category has been migrated to HMUM
 */
export function isHMUMCategory(categoryId: string): boolean {
    return supportsContextualScoring(categoryId);
}

/**
 * Get selectable contexts (excludes general_use for UI)
 */
export function getSelectableContexts(categoryId: string): { id: string; name: string; icon?: string }[] {
    const profiles = getContextProfiles(categoryId);
    return profiles
        .filter(p => p.id !== 'general_use')
        .map(p => ({ id: p.id, name: p.name, icon: p.icon }));
}

/**
 * Get all available contexts including base
 */
export function getAvailableContexts(categoryId: string): { id: string; name: string; icon?: string; isBase?: boolean }[] {
    const profiles = getContextProfiles(categoryId);
    return profiles.map(p => ({
        id: p.id,
        name: p.name,
        icon: p.icon,
        isBase: p.id === 'general_use',
    }));
}

// ============================================
// EXPORTS
// ============================================

export default {
    calculateUnifiedScore,
    supportsContextualScoring,
    isHMUMCategory,
    getSelectableContexts,
    getAvailableContexts,
};
