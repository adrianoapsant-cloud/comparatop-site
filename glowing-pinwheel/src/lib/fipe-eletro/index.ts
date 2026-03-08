/**
 * =============================================================================
 * FIPE-Eletro Module Index
 * =============================================================================
 *
 * Exporta todos os componentes do sistema de cálculo TCO.
 */

// ─── Motor de Cálculo ────────────────────────────────────────────────────────
export {
    TCOEngine,
    conditionGradeToKFactor,
    calculateDeltaRate,
    estimateBreakEvenYear,
    type TcoEngineConfig,
} from './tcoCalculator';

// ─── Gerador de Prompts para Deep Research ───────────────────────────────────
export {
    generateDeepResearchPrompt,
    generateQuickResearchPrompt,
} from './generateDeepResearchPrompt';

// ─── Defaults por Família de Custo ────────────────────────────────────────────
export {
    // Mapeamentos
    CATEGORY_TO_FAMILY,
    FAMILY_DEFAULTS,
    DEFAULT_MACRO_CONSTANTS,

    // Funções de família
    getFamilyForCategory,
    getDefaultsForCategory,
    getDeltaRateForCategory,
    getExpectedLifespanForCategory,
    getQualityWeightsForCategory,
    getFailureCurveForCategory,
    getPromptContextForCategory,

    // Item 3: Regionalização MO
    REGIONAL_LABOR_MULTIPLIERS,
    getRegionalLaborMultiplier,

    // Item 2: K_tech automático
    TECHNOLOGY_K_FACTORS,
    calculateKTechnology,
    inferKTechFromCategory,

    // Item 1: K_condition de scores
    calculateKConditionFromScores,
    conditionGradeToScores,

    // Item 5: Água progressiva
    WATER_TARIFF_BRACKETS,
    calculateWaterCostProgressive,

    // Item 4: Ciclos → Meses
    USAGE_PROFILES,
    convertCyclesToMonths,
    calculateWaterFilterReplacementMonths,

    // Types
    type FamilyDefaults,
    type TechnologyType,
    type QualityScores,
    type WaterTariffBracket,
    type UsageProfile,
} from './familyDefaults';


// ─── Re-export de Tipos ──────────────────────────────────────────────────────
export type {
    // Categorias e Enums
    FipeEletroCategory,
    CostFamily,
    EnergyRating,
    ConditionGrade,
    ConsumableType,

    // Dados do Produto
    ProductStaticData,
    EnergyConsumption,
    WaterConsumption,
    GasConsumption,
    ConsumableItem,
    OpexVariables,

    // Manutenção
    FailureProbabilityPoint,
    RepairCostBreakdown,
    MaintenanceVariables,

    // Contexto Macro
    MacroeconomicContext,

    // Depreciação
    DepreciationConfig,
    QualityScoringProfile,

    // Outputs
    TcoBreakdown,
    FipeValuation,
    FipeEletroProduct,
    TcoCalculationContext,
    ProductComparison,
    TcoCurveDataPoint,
    CategoryDefaults,
} from '@/types/fipe-eletro';
