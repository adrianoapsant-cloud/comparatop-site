/**
 * @file types.ts
 * @description Contextual Actuarial Scoring System - Type Definitions v2.0
 * 
 * This module defines the core types for the decoupled scoring architecture
 * that separates:
 * - "Product Facts" (immutable raw specs - INPUTS)
 * - "Shadow Metrics" (computed actuarial values - COMPUTED)
 * - "Scoring Rules" (contextual logic)
 * 
 * @version 2.0.0
 * @changelog
 * - v1.0: Basic ProductFacts as flexible dictionary
 * - v2.0: Structured ontology with MaintenanceMetrics, ReliabilityMetrics,
 *         FinancialContext, and Shadow Metrics (computed)
 * 
 * This resolves:
 * 1. "Beach Paradox": A product can score 10 inland but 4 coastal
 * 2. "Double Counting": Separates raw inputs from derived scores
 */

// ============================================
// MAINTENANCE METRICS (Raw Inputs)
// ============================================

/**
 * MaintenanceMetrics: Raw data about repair costs and parts availability.
 * 
 * @description These are observable, objective facts about maintenance -
 * NOT calculated scores. The Shadow Engine computes risk scores from these.
 * 
 * @see French Repairability Index (Indice de Réparabilité)
 * @see https://www.ecologie.gouv.fr/indice-reparabilite
 */
export interface MaintenanceMetrics {
    /** Average cost of common repair parts (R$) */
    avgPartsCostBRL?: number;

    /** Average labor cost for common repairs (R$) */
    avgLaborCostBRL?: number;

    /** Availability of spare parts in the Brazilian market */
    partsAvailability?: 'widely_available' | 'limited' | 'scarce' | 'discontinued';

    /** Years the manufacturer guarantees parts availability */
    partsAvailabilityYears?: number;

    /** Ease of repair (1-10 scale, based on iFixit methodology) */
    repairabilityScore?: number;

    /** Whether authorized service centers exist in major cities */
    hasAuthorizedServiceCenters?: boolean;

    /** Common failure points identified from user reviews */
    knownIssues?: string[];

    /** Replacement filter/consumable cost (R$) - for appliances */
    consumableCostBRL?: number;

    /** Consumable replacement interval in months */
    consumableIntervalMonths?: number;
}

// ============================================
// RELIABILITY METRICS (Raw Inputs)
// ============================================

/**
 * ReliabilityMetrics: Raw reliability data from various sources.
 * 
 * @description Objective reliability data that feeds into lifespan calculations.
 * The Shadow Engine will compute estimatedLifespanYears from these inputs.
 */
export interface ReliabilityMetrics {
    /** L10 bearing life in hours (for motors/compressors) */
    l10LifeHours?: number;

    /** MTBF (Mean Time Between Failures) in hours */
    mtbfHours?: number;

    /** Manufacturer's claimed lifespan in years */
    manufacturerClaimedLifeYears?: number;

    /** Warranty period in years */
    warrantyYears?: number;

    /** Extended warranty available (years) */
    extendedWarrantyYears?: number;

    /** Data source for reliability claims */
    reliabilitySource?: 'lab_test' | 'manufacturer_spec' | 'user_review' | 'industry_average';

    /** Confidence level in the data (0.0 to 1.0) */
    dataConfidence?: number;

    /** Annual failure probability (0.0 to 1.0) */
    annualFailureProbability?: number;

    /** Material quality indicators */
    keyComponentMaterial?: string;

    /** Corrosion protection (for coastal/humid environments) */
    hasAnticorrosiveProtection?: boolean;

    /** Type of anticorrosive protection */
    anticorrosiveType?: 'gold_fin' | 'blue_fin' | 'epoxy' | 'none';
}

// ============================================
// FINANCIAL CONTEXT (Raw Inputs)
// ============================================

/**
 * FinancialContext: Financial data for TCO calculations.
 * 
 * @description Raw financial inputs used to calculate Total Cost of Ownership.
 */
export interface FinancialContext {
    /** Original purchase price (CAPEX) in R$ */
    purchasePriceBRL: number;

    /** Estimated annual operating cost (energy, consumables) in R$ */
    annualOperatingCostBRL?: number;

    /** Monthly energy consumption in kWh */
    monthlyEnergyKwh?: number;

    /** Local electricity tariff (R$/kWh) - defaults to national average */
    electricityTariffBRL?: number;

    /** Estimated resale value after 5 years (R$) */
    estimatedResaleValue5YearsBRL?: number;

    /** Depreciation rate per year (0.0 to 1.0) */
    annualDepreciationRate?: number;

    /** Insurance cost per year (R$) */
    annualInsuranceCostBRL?: number;
}

// ============================================
// USAGE PROFILE (User Input)
// ============================================

/**
 * UsageProfile: User's expected usage pattern.
 * 
 * @description This contextualizes the calculations for the specific user.
 */
export interface UsageProfile {
    /** Expected daily usage in hours */
    dailyUsageHours?: number;

    /** Expected annual usage in hours */
    annualUsageHours?: number;

    /** Location type (affects corrosion, humidity calculations) */
    locationType?: 'coastal' | 'inland' | 'industrial' | 'rural';

    /** Climate zone */
    climateZone?: 'tropical' | 'subtropical' | 'temperate' | 'arid';

    /** User priority (affects scoring weights) */
    userPriority?: 'performance' | 'economy' | 'durability' | 'convenience';

    /** Voltage stability in user's region */
    voltageStable?: boolean;

    /** Has pets (affects filter/maintenance requirements) */
    hasPets?: boolean;

    /** Senior user (affects accessibility scoring) */
    isSenior?: boolean;
}

// ============================================
// SHADOW METRICS (Computed - NOT Inputs)
// ============================================

/**
 * ShadowMetrics: Actuarial values computed by the Shadow Engine.
 * 
 * @description These are DERIVED values, calculated from raw inputs.
 * They should NEVER be stored in the product database - always computed on-demand.
 * 
 * This separation eliminates "Double Counting" in scoring.
 * 
 * @see src/lib/scoring/shadow-engine.ts for calculation formulas
 */
export interface ShadowMetrics {
    /**
     * Estimated Useful Life (VUE) in years.
     * 
     * @formula VUE = (L10_hours / Annual_Usage_hours) * Confidence_Factor
     */
    estimatedLifespanYears: number;

    /**
     * Total Cost of Ownership over 5 years (R$).
     * 
     * @formula TCO = CAPEX + (OpEx * 5) + (Failure_Prob * 5 * Repair_Cost) - Resale_Value
     */
    totalCostOfOwnership5Years: number;

    /**
     * Maintenance Risk Score (0-10).
     * Based on the French Repairability Index methodology.
     * 
     * @formula Ratio = (Parts + Labor) / New_Price
     * @rule Ratio <= 0.10 → Score 10, Ratio >= 0.50 → Score 0, linear interpolation
     */
    maintenanceRiskScore: number;

    /**
     * Monthly cost projection breakdown.
     */
    monthlyCostBreakdown?: {
        energy: number;
        consumables: number;
        maintenanceReserve: number;
    };

    /**  
     * Confidence level of the computed values (0.0 to 1.0).
     */
    computedConfidence: number;

    /**
     * Warnings/alerts generated during computation.
     */
    computationWarnings?: string[];
}

// ============================================
// ENHANCED PRODUCT FACTS (v2.0 Structure)
// ============================================

/**
 * ProductFactsV2: The complete actuarial data structure for a product.
 * 
 * @description Separates raw INPUTS from COMPUTED shadow metrics.
 * This is the primary data structure for v2.0 scoring.
 */
export interface ProductFactsV2 {
    /** Product identifier */
    productId: string;

    /** Category identifier */
    categoryId: string;

    // ========================================
    // RAW INPUTS (Observable Facts)
    // ========================================

    /** Raw maintenance data */
    maintenance?: MaintenanceMetrics;

    /** Raw reliability data */
    reliability?: ReliabilityMetrics;

    /** Financial data */
    financial: FinancialContext;

    /** User's usage profile */
    usageProfile?: UsageProfile;

    /** Legacy flexible facts (backward compatibility) */
    specs?: Record<string, string | number | boolean | string[] | null>;

    // ========================================
    // COMPUTED (Shadow Metrics - Calculated)
    // ========================================

    /**
     * Shadow Metrics: Computed actuarial values.
     * 
     * @important This is COMPUTED, not stored. The Shadow Engine
     * calculates these values on-demand from raw inputs.
     */
    computed?: ShadowMetrics;
}

// ============================================
// BACKWARD COMPATIBILITY
// ============================================

/**
 * ProductFacts: Legacy flexible dictionary for backward compatibility.
 * 
 * @deprecated Use ProductFactsV2 for new implementations.
 */
export type ProductFacts = Record<string, string | number | boolean | string[] | null>;

// ============================================
// SCORING RULES (Contextual Logic)
// ============================================

/**
 * Severity levels for rules - affects UI presentation and sorting.
 */
export type RuleSeverity = 'low' | 'medium' | 'high' | 'critical';

/**
 * ScoringRule: The structure of a single scoring rule.
 */
export interface ScoringRule {
    id: string;
    condition: string;
    target_contexts: string[];
    penalty?: number;
    bonus?: number;
    label: string;
    severity?: RuleSeverity;
}

// ============================================
// SCORING CONTEXT (User Environment/Profile)
// ============================================

/**
 * ScoringContext: Defines the user's environment or usage profile.
 */
export interface ScoringContext {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    group?: string;
    voltage_unstable?: boolean;
    has_pets?: boolean;
    accessibility_senior?: boolean;
}

// ============================================
// CATEGORY RULES
// ============================================

/**
 * CategoryRules: Complete rule configuration for a product category.
 */
export interface CategoryRules {
    category_id: string;
    category_name: string;
    available_contexts: ScoringContext[];
    rules: ScoringRule[];
}

// ============================================
// SCORING RESULTS
// ============================================

/**
 * ScoringReason: A single adjustment applied during scoring.
 */
export interface ScoringReason {
    rule_id: string;
    label: string;
    adjustment: number;
    severity: RuleSeverity;
    type: 'penalty' | 'bonus';
}

/**
 * ScoringResult: The complete output from the scoring engine.
 */
export interface ScoringResult {
    baseScore: number;
    finalScore: number;
    delta: number;
    reasons: ScoringReason[];
    contextId: string;
}

/**
 * ScoringResultV2: Enhanced scoring result with shadow metrics.
 */
export interface ScoringResultV2 extends ScoringResult {
    /** Shadow metrics used in computation */
    shadowMetrics?: ShadowMetrics;
    /** Weight adjustments applied by rules engine */
    weightAdjustments?: Record<string, number>;
}

// ============================================
// ENGINE CONFIGURATION
// ============================================

/**
 * EngineConfig: Optional configuration for the scoring engine.
 */
export interface EngineConfig {
    baseScore?: number;
    minScore?: number;
    maxScore?: number;
    debug?: boolean;
}

// ============================================
// HELPER TYPES
// ============================================

/**
 * ContextOption: Simplified type for UI selectors.
 */
export interface ContextOption {
    id: string;
    name: string;
    icon?: string;
    active?: boolean;
}

/**
 * ScoreComparison: For comparing scores across contexts.
 */
export interface ScoreComparison {
    contexts: Array<{
        contextId: string;
        contextName: string;
        score: number;
        delta: number;
    }>;
    bestContext: string;
    worstContext: string;
}

// ============================================
// CONFIDENCE FACTORS (Constants)
// ============================================

/**
 * Confidence factors for reliability data sources.
 * Higher = more trustworthy.
 */
export const RELIABILITY_CONFIDENCE_FACTORS: Record<string, number> = {
    lab_test: 1.0,
    user_review: 0.8,
    industry_average: 0.7,
    manufacturer_spec: 0.6,
    unknown: 0.5,
} as const;

/**
 * Default usage hours per year by category.
 */
export const DEFAULT_ANNUAL_USAGE_HOURS: Record<string, number> = {
    'ar-condicionado': 2000,    // ~5.5h/day
    'geladeira': 8760,          // 24/7
    'lavadora': 520,            // ~10h/week
    'tv': 1460,                 // ~4h/day
    'notebook': 2000,           // ~5.5h/day
    'smartphone': 1825,         // ~5h/day
    default: 1000,
} as const;

/**
 * Brazilian average electricity tariff (R$/kWh).
 * Source: ANEEL, 2024 average
 */
export const BRAZIL_AVG_ELECTRICITY_TARIFF = 0.75;

// ============================================
// EXPANDED SHADOW METRICS (For OwnershipInsights UI)
// ============================================

/**
 * TCO Breakdown: Itemized costs for transparent display.
 */
export interface TCOBreakdown {
    /** Initial purchase price (CAPEX) */
    capex: number;

    /** Total energy cost over 5 years */
    energyCost: number;

    /** Energy calculation details */
    energyDetails: {
        monthlyKwh: number;
        tariffPerKwh: number;
        monthlyAmount: number;
        totalMonths: number;
    };

    /** Total maintenance reserve over 5 years */
    maintenanceCost: number;

    /** Maintenance calculation details */
    maintenanceDetails: {
        annualFailureProbability: number;
        avgRepairCost: number;
        yearsProjected: number;
    };

    /** Estimated resale value after 5 years (subtracted from TCO) */
    resaleValue: number;

    /** Annual depreciation rate used */
    depreciationRate: number;
}

/**
 * Lifespan Explanation: Why the product lasts X years.
 */
export interface LifespanExplanation {
    /** Estimated lifespan in years */
    years: number;

    /** Category average for comparison */
    categoryAverageYears: number;

    /** Percentage above/below average */
    percentageVsAverage: number;

    /** The component that limits lifespan (weakest link) */
    limitingComponent: {
        name: string;
        category: string;
        l10Hours: number;
        failureModes: string[];
    };

    /** Usage assumptions for calculation */
    usageAssumptions: {
        dailyHours: number;
        annualHours: number;
        source: 'user_input' | 'category_default';
    };

    /** Quality multipliers applied */
    qualityMultipliers: {
        brand: { name: string; factor: number };
        technology: { name: string; factor: number };
    };

    /** Calculation breakdown */
    calculationBreakdown: {
        baseLifeYears: number;
        afterBrandMultiplier: number;
        afterTechMultiplier: number;
        finalEstimate: number;
    };
}

/**
 * Component status for repairability map.
 */
export type ComponentStatus = 'critical' | 'moderate' | 'repairable';

/**
 * Parts availability levels.
 */
export type PartsAvailability = 'good' | 'limited' | 'scarce' | 'discontinued';

/**
 * Single component in the repairability map.
 */
export interface RepairabilityComponent {
    /** Component name (user-friendly) */
    name: string;

    /** Component ID for linking */
    id: string;

    /** Category (panel, board, power_supply, backlight) */
    category: string;

    /** Repairability score (0-10) */
    score: number;

    /** Overall status (derived from score) */
    status: ComponentStatus;

    /** Estimated repair cost (parts + labor) in R$ */
    repairCost: number;

    /** Parts availability in Brazilian market */
    partsAvailability: PartsAvailability;

    /** User-friendly failure symptoms */
    symptoms: string[];

    /** Recommendation text */
    recommendation: string;

    /** Is this the limiting component? */
    isLimitingComponent: boolean;

    /** Can DIY repair? */
    diyFriendly: boolean;
}

/**
 * Complete repairability map for a product.
 */
export interface RepairabilityMap {
    /** Overall repairability score (0-10) */
    overallScore: number;

    /** Human-readable label */
    label: 'Fácil Reparo' | 'Reparo Moderado' | 'Risco de Descarte';

    /** Category average score for comparison (contextualizes low scores) */
    categoryAverage?: number;

    /** List of components with details */
    components: RepairabilityComponent[];

    /** Summary statistics */
    summary: {
        totalComponents: number;
        repairableCount: number;
        criticalCount: number;
        avgRepairCost: number;
    };
}

/**
 * ExpandedShadowMetrics: Complete ownership insights with transparent breakdowns.
 * 
 * @description This extends ShadowMetrics with detailed explanations for UI display.
 * Used by the OwnershipInsights component to show "why" behind each number.
 */
export interface ExpandedShadowMetrics extends ShadowMetrics {
    /** Itemized TCO breakdown */
    tcoBreakdown: TCOBreakdown;

    /** Lifespan calculation explanation */
    lifespanExplanation: LifespanExplanation;

    /** Component-level repairability map */
    repairabilityMap: RepairabilityMap;
}
