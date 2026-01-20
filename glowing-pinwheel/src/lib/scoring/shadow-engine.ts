/**
 * @file shadow-engine.ts
 * @description Shadow Scoring Engine - Actuarial Calculations v2.0
 * 
 * This module contains PURE FUNCTIONS that compute "Shadow Metrics" from raw inputs.
 * These calculations are performed in parallel to the main scoring system and
 * enrich the ProductFacts with actuarial values.
 * 
 * Key Formulas Implemented:
 * - Maintenance Risk Score (French Repairability Index)
 * - Estimated Useful Life (VUE)
 * - Total Cost of Ownership (TCO)
 * 
 * @version 2.0.0
 * @see https://www.ecologie.gouv.fr/indice-reparabilite (French Repairability Index)
 */

import type {
    ProductFactsV2,
    ShadowMetrics,
    MaintenanceMetrics,
    ReliabilityMetrics,
    FinancialContext,
    UsageProfile,
} from './types';

import {
    RELIABILITY_CONFIDENCE_FACTORS,
    DEFAULT_ANNUAL_USAGE_HOURS,
    BRAZIL_AVG_ELECTRICITY_TARIFF,
} from './types';

// ============================================
// CONFIGURATION CONSTANTS
// ============================================

/**
 * French Repairability Index thresholds.
 * 
 * @see Indice de Réparabilité (France, 2021)
 * 
 * The "50% Rule": When repair cost reaches 50% of new price,
 * most consumers will replace rather than repair.
 */
const MAINTENANCE_RATIO_THRESHOLDS = {
    /** Ratio at which product scores 10 (excellent repairability) */
    EXCELLENT: 0.10,
    /** Ratio at which product scores 0 (economically unrepairable) */
    UNREPAIRABLE: 0.50,
} as const;

/**
 * Default values for missing data.
 */
const DEFAULTS = {
    /** Default annual failure probability if unknown */
    ANNUAL_FAILURE_PROBABILITY: 0.05,
    /** Default depreciation rate per year */
    ANNUAL_DEPRECIATION_RATE: 0.15,
    /** Default labor cost if unknown (R$) */
    LABOR_COST_BRL: 200,
    /** Default repair cost factor (parts + labor) */
    REPAIR_COST_FACTOR: 0.25,
    /** Minimum computed confidence */
    MIN_CONFIDENCE: 0.3,
} as const;

/**
 * Category average repairability scores.
 * Based on market analysis and French Repairability Index data.
 * 
 * @description These averages contextualize product scores.
 * A 4.0 on a TV is actually good because the category average is 3.8.
 */
const CATEGORY_REPAIRABILITY_AVERAGES: Record<string, number> = {
    'tv': 3.8,
    'smart-tv': 3.8,
    'geladeira': 5.2,
    'ar-condicionado': 4.5,
    'lavadora': 5.0,
    'lava-e-seca': 4.2,
    'notebook': 3.5,
    'smartphone': 3.0,
    'cafeteira': 4.0,
    'aspirador': 5.5,
    'fritadeira': 4.8,
    'microondas': 5.0,
    'default': 4.0,
} as const;

/**
 * Gets the category average repairability score for contextualizing product scores.
 */
function getCategoryAverageRepairability(categoryId: string): number {
    return CATEGORY_REPAIRABILITY_AVERAGES[categoryId] ?? CATEGORY_REPAIRABILITY_AVERAGES['default'];
}

// ============================================
// FORMULA A: MAINTENANCE RISK SCORE
// ============================================

/**
 * Calculates the Maintenance Risk Score (0-10) based on the French Repairability Index methodology.
 * 
 * @description This implements the "50% Rule" from actuarial product analysis:
 * - When repair costs reach 50% of the new product price, economic rationality
 *   dictates replacement over repair.
 * - A ratio of 10% or less indicates excellent repairability.
 * 
 * @formula
 * Ratio = (AvgPartsCost + AvgLaborCost) / PurchasePrice
 * Score = Linear interpolation between thresholds
 * 
 * @param maintenance - Raw maintenance metrics
 * @param financial - Financial context with purchase price
 * @returns Score from 0 (high risk) to 10 (low risk)
 * 
 * @example
 * // Parts: R$500, Labor: R$200, Price: R$5000
 * // Ratio = 700/5000 = 0.14
 * // Score ≈ 9.0 (interpolated)
 * 
 * @see https://www.ecologie.gouv.fr/indice-reparabilite
 */
export function calculateMaintenanceRiskScore(
    maintenance: MaintenanceMetrics | undefined,
    financial: FinancialContext
): number {
    const purchasePrice = financial.purchasePriceBRL;

    if (purchasePrice <= 0) {
        console.warn('[ShadowEngine] Invalid purchase price, returning default score');
        return 5.0;
    }

    // Calculate total repair cost
    const partsCost = maintenance?.avgPartsCostBRL ?? (purchasePrice * DEFAULTS.REPAIR_COST_FACTOR);
    const laborCost = maintenance?.avgLaborCostBRL ?? DEFAULTS.LABOR_COST_BRL;
    const totalRepairCost = partsCost + laborCost;

    // Calculate the repair-to-new ratio
    const ratio = totalRepairCost / purchasePrice;

    // Apply the French Repairability Index logic
    const { EXCELLENT, UNREPAIRABLE } = MAINTENANCE_RATIO_THRESHOLDS;

    if (ratio <= EXCELLENT) {
        // Excellent repairability: score 10
        return 10.0;
    }

    if (ratio >= UNREPAIRABLE) {
        // Economically unrepairable: score 0
        return 0.0;
    }

    // Linear interpolation between thresholds
    // Score = 10 * (1 - (ratio - EXCELLENT) / (UNREPAIRABLE - EXCELLENT))
    const normalizedRatio = (ratio - EXCELLENT) / (UNREPAIRABLE - EXCELLENT);
    const score = 10.0 * (1 - normalizedRatio);

    return Math.round(score * 10) / 10; // Round to 1 decimal
}

// ============================================
// FORMULA B: ESTIMATED USEFUL LIFE (VUE)
// ============================================

/**
 * Calculates the Estimated Useful Life (VUE) in years.
 * 
 * @description Uses bearing L10 life methodology commonly used in
 * industrial equipment (motors, compressors, fans).
 * 
 * @formula
 * VUE = (L10_hours / Annual_Usage_hours) * Confidence_Factor
 * 
 * L10 Life: The life at which 10% of bearings will have failed
 * (i.e., 90% survival probability).
 * 
 * @param reliability - Raw reliability metrics
 * @param usageProfile - User's usage profile
 * @param categoryId - Product category (for default usage hours)
 * @returns Estimated lifespan in years
 * 
 * @example
 * // L10: 20,000 hours, Usage: 2,000 hours/year, Confidence: 0.8
 * // VUE = (20000 / 2000) * 0.8 = 8 years
 */
export function calculateEstimatedLifespan(
    reliability: ReliabilityMetrics | undefined,
    usageProfile: UsageProfile | undefined,
    categoryId: string
): number {
    // Get L10 life or MTBF
    const l10Hours = reliability?.l10LifeHours ?? reliability?.mtbfHours;

    // If no reliability data, use manufacturer claim with penalty
    if (!l10Hours) {
        const claimedLife = reliability?.manufacturerClaimedLifeYears ?? 5;
        const confidenceFactor = RELIABILITY_CONFIDENCE_FACTORS['manufacturer_spec'];
        return Math.round(claimedLife * confidenceFactor * 10) / 10;
    }

    // Get annual usage hours
    const annualUsage = usageProfile?.annualUsageHours ??
        (usageProfile?.dailyUsageHours ? usageProfile.dailyUsageHours * 365 : null) ??
        DEFAULT_ANNUAL_USAGE_HOURS[categoryId] ??
        DEFAULT_ANNUAL_USAGE_HOURS['default'];

    if (annualUsage <= 0) {
        console.warn('[ShadowEngine] Invalid annual usage, using default');
        return 5.0;
    }

    // Get confidence factor based on data source
    const source = reliability?.reliabilitySource ?? 'unknown';
    const confidenceFactor = reliability?.dataConfidence ??
        RELIABILITY_CONFIDENCE_FACTORS[source] ??
        RELIABILITY_CONFIDENCE_FACTORS['unknown'];

    // Calculate VUE
    const rawLifeYears = l10Hours / annualUsage;
    const adjustedLifeYears = rawLifeYears * confidenceFactor;

    // Cap at reasonable maximum (30 years)
    const cappedLife = Math.min(adjustedLifeYears, 30);

    return Math.round(cappedLife * 10) / 10;
}

// ============================================
// FORMULA C: TOTAL COST OF OWNERSHIP (TCO)
// ============================================

/**
 * Calculates the Total Cost of Ownership over 5 years (R$).
 * 
 * @description Comprehensive financial analysis considering:
 * - CAPEX (initial purchase)
 * - OpEx (operating costs: energy, consumables)
 * - Expected repair costs (probability-weighted)
 * - Resale value (depreciated asset value)
 * 
 * @formula
 * TCO = CAPEX + (OpEx_Annual × 5) + (Failure_Prob × 5 × Repair_Cost) - Resale_Value
 * 
 * @param financial - Financial context
 * @param maintenance - Maintenance metrics
 * @param reliability - Reliability metrics
 * @returns Total cost in R$ over 5 years
 * 
 * @example
 * // CAPEX: R$5000, OpEx: R$600/yr, Failure: 5%/yr, Repair: R$700, Resale: R$1000
 * // TCO = 5000 + (600×5) + (0.05×5×700) - 1000 = 5000 + 3000 + 175 - 1000 = R$7175
 */
export function calculateTotalCostOfOwnership(
    financial: FinancialContext,
    maintenance: MaintenanceMetrics | undefined,
    reliability: ReliabilityMetrics | undefined
): number {
    const years = 5;

    // CAPEX: Initial purchase price
    const capex = financial.purchasePriceBRL;

    // OpEx: Annual operating costs
    let annualOpEx = financial.annualOperatingCostBRL ?? 0;

    // Calculate energy cost if not provided
    if (!annualOpEx && financial.monthlyEnergyKwh) {
        const tariff = financial.electricityTariffBRL ?? BRAZIL_AVG_ELECTRICITY_TARIFF;
        annualOpEx = financial.monthlyEnergyKwh * 12 * tariff;
    }

    // Add consumable costs
    if (maintenance?.consumableCostBRL && maintenance?.consumableIntervalMonths) {
        const consumablesPerYear = (12 / maintenance.consumableIntervalMonths) * maintenance.consumableCostBRL;
        annualOpEx += consumablesPerYear;
    }

    // Expected repair costs (probability-weighted)
    const failureProbability = reliability?.annualFailureProbability ?? DEFAULTS.ANNUAL_FAILURE_PROBABILITY;
    const avgRepairCost = (maintenance?.avgPartsCostBRL ?? 0) + (maintenance?.avgLaborCostBRL ?? DEFAULTS.LABOR_COST_BRL);
    const expectedRepairCosts = failureProbability * years * avgRepairCost;

    // Resale value (depreciated)
    let resaleValue = financial.estimatedResaleValue5YearsBRL ?? 0;
    if (!resaleValue) {
        const depreciationRate = financial.annualDepreciationRate ?? DEFAULTS.ANNUAL_DEPRECIATION_RATE;
        // Compound depreciation: Value = Price × (1 - rate)^years
        resaleValue = capex * Math.pow(1 - depreciationRate, years);
    }

    // TCO calculation
    const tco = capex + (annualOpEx * years) + expectedRepairCosts - resaleValue;

    return Math.round(tco * 100) / 100; // Round to cents
}

// ============================================
// MONTHLY COST BREAKDOWN
// ============================================

/**
 * Calculates monthly cost breakdown for budgeting.
 */
export function calculateMonthlyCostBreakdown(
    financial: FinancialContext,
    maintenance: MaintenanceMetrics | undefined,
    reliability: ReliabilityMetrics | undefined
): { energy: number; consumables: number; maintenanceReserve: number } {
    // Energy cost
    const tariff = financial.electricityTariffBRL ?? BRAZIL_AVG_ELECTRICITY_TARIFF;
    const energy = (financial.monthlyEnergyKwh ?? 0) * tariff;

    // Consumables
    let consumables = 0;
    if (maintenance?.consumableCostBRL && maintenance?.consumableIntervalMonths) {
        consumables = maintenance.consumableCostBRL / maintenance.consumableIntervalMonths;
    }

    // Maintenance reserve (monthly provision for expected repairs)
    const failureProbability = reliability?.annualFailureProbability ?? DEFAULTS.ANNUAL_FAILURE_PROBABILITY;
    const avgRepairCost = (maintenance?.avgPartsCostBRL ?? 0) + (maintenance?.avgLaborCostBRL ?? DEFAULTS.LABOR_COST_BRL);
    const maintenanceReserve = (failureProbability * avgRepairCost) / 12;

    return {
        energy: Math.round(energy * 100) / 100,
        consumables: Math.round(consumables * 100) / 100,
        maintenanceReserve: Math.round(maintenanceReserve * 100) / 100,
    };
}

// ============================================
// MAIN ENGINE: COMPUTE ALL SHADOW METRICS
// ============================================

/**
 * Computes all Shadow Metrics for a product.
 * 
 * @description This is the main entry point for the Shadow Engine.
 * It takes raw ProductFactsV2 and enriches it with computed actuarial values.
 * 
 * @param facts - Raw product facts (without computed values)
 * @returns Shadow metrics computed from raw inputs
 * 
 * @example
 * const shadowMetrics = computeShadowMetrics(productFacts);
 * productFacts.computed = shadowMetrics;
 */
export function computeShadowMetrics(facts: ProductFactsV2): ShadowMetrics {
    const warnings: string[] = [];

    // Validate inputs
    if (!facts.financial?.purchasePriceBRL) {
        warnings.push('Purchase price missing - using estimates');
    }

    // Calculate each metric
    const maintenanceRiskScore = calculateMaintenanceRiskScore(
        facts.maintenance,
        facts.financial
    );

    const estimatedLifespanYears = calculateEstimatedLifespan(
        facts.reliability,
        facts.usageProfile,
        facts.categoryId
    );

    const totalCostOfOwnership5Years = calculateTotalCostOfOwnership(
        facts.financial,
        facts.maintenance,
        facts.reliability
    );

    const monthlyCostBreakdown = calculateMonthlyCostBreakdown(
        facts.financial,
        facts.maintenance,
        facts.reliability
    );

    // Calculate overall confidence
    let confidence = 1.0;
    if (!facts.maintenance) confidence -= 0.2;
    if (!facts.reliability) confidence -= 0.3;
    if (!facts.reliability?.l10LifeHours) confidence -= 0.1;
    if (!facts.usageProfile) confidence -= 0.1;
    confidence = Math.max(confidence, DEFAULTS.MIN_CONFIDENCE);

    return {
        estimatedLifespanYears,
        totalCostOfOwnership5Years,
        maintenanceRiskScore,
        monthlyCostBreakdown,
        computedConfidence: Math.round(confidence * 100) / 100,
        computationWarnings: warnings.length > 0 ? warnings : undefined,
    };
}

// ============================================
// EXPANDED SHADOW METRICS (With Explanations)
// ============================================

import type {
    ExpandedShadowMetrics,
    TCOBreakdown,
    LifespanExplanation,
    RepairabilityMap,
    RepairabilityComponent,
    ComponentStatus,
    PartsAvailability,
} from './types';

/**
 * Component data for repairability calculations.
 * This would typically come from components database.
 */
interface ComponentInput {
    id: string;
    name: string;
    category: string;
    l10LifeHours?: number;
    repairabilityScore: number;
    partCostBRL: number;
    laborCostBRL: number;
    partsAvailability: PartsAvailability;
    failureModes: string[];
    failureSymptoms: string[];
    diyFriendly: boolean;
}

/**
 * Computes expanded Shadow Metrics with detailed breakdowns for UI.
 * 
 * @description This provides all the "why" behind each number for transparent display.
 * Used by OwnershipInsights to show detailed explanations.
 * 
 * @param facts - Raw product facts
 * @param components - Component data for the product
 * @param categoryAverageYears - Category average lifespan for comparison
 * @param brandName - Brand name for quality factor display
 * @param techName - Technology name for quality factor display
 * @returns ExpandedShadowMetrics with all breakdowns
 */
export function computeExpandedShadowMetrics(
    facts: ProductFactsV2,
    components: ComponentInput[] = [],
    categoryAverageYears: number = 8,
    brandName: string = 'Fabricante',
    techName: string = 'Padrão'
): ExpandedShadowMetrics {
    const baseMetrics = computeShadowMetrics(facts);
    const years = 5;

    // ========================================
    // TCO BREAKDOWN
    // ========================================
    const purchasePrice = facts.financial.purchasePriceBRL;
    const monthlyKwh = facts.financial.monthlyEnergyKwh ?? 0;
    const tariff = facts.financial.electricityTariffBRL ?? BRAZIL_AVG_ELECTRICITY_TARIFF;
    const monthlyEnergy = monthlyKwh * tariff;
    const totalEnergyCost = monthlyEnergy * 12 * years;

    const failureProbability = facts.reliability?.annualFailureProbability ?? DEFAULTS.ANNUAL_FAILURE_PROBABILITY;
    const avgRepairCost = (facts.maintenance?.avgPartsCostBRL ?? 0) +
        (facts.maintenance?.avgLaborCostBRL ?? DEFAULTS.LABOR_COST_BRL);
    const maintenanceCost = failureProbability * avgRepairCost * years;

    const depreciationRate = facts.financial.annualDepreciationRate ?? DEFAULTS.ANNUAL_DEPRECIATION_RATE;
    const resaleValue = facts.financial.estimatedResaleValue5YearsBRL ??
        (purchasePrice * Math.pow(1 - depreciationRate, years));

    const tcoBreakdown: TCOBreakdown = {
        capex: purchasePrice,
        energyCost: Math.round(totalEnergyCost),
        energyDetails: {
            monthlyKwh,
            tariffPerKwh: tariff,
            monthlyAmount: Math.round(monthlyEnergy * 100) / 100,
            totalMonths: 12 * years,
        },
        maintenanceCost: Math.round(maintenanceCost),
        maintenanceDetails: {
            annualFailureProbability: failureProbability,
            avgRepairCost: Math.round(avgRepairCost),
            yearsProjected: years,
        },
        resaleValue: Math.round(resaleValue),
        depreciationRate,
    };

    // ========================================
    // LIFESPAN EXPLANATION
    // ========================================
    const annualUsage = facts.usageProfile?.annualUsageHours ??
        (facts.usageProfile?.dailyUsageHours ? facts.usageProfile.dailyUsageHours * 365 : null) ??
        DEFAULT_ANNUAL_USAGE_HOURS[facts.categoryId] ??
        DEFAULT_ANNUAL_USAGE_HOURS['default'];

    const dailyUsage = facts.usageProfile?.dailyUsageHours ?? (annualUsage / 365);

    // Find limiting component (lowest L10 / usage ratio)
    let limitingComp = components.find(c => c.l10LifeHours) ?? {
        id: 'unknown',
        name: 'Componente Principal',
        category: 'general',
        l10LifeHours: 60000,
        failureModes: ['Desgaste normal'],
        failureSymptoms: ['Falha geral'],
        repairabilityScore: 5,
        partCostBRL: 500,
        laborCostBRL: 200,
        partsAvailability: 'limited' as PartsAvailability,
        diyFriendly: false,
    };

    // Quality multipliers (simplified - would come from quality-factors.ts)
    const brandMultiplier = 1.05; // Premium brand bonus
    const techMultiplier = 1.05; // Modern tech bonus

    const baseLifeYears = (limitingComp.l10LifeHours ?? 60000) / annualUsage;
    const afterBrand = baseLifeYears * brandMultiplier;
    const afterTech = afterBrand * techMultiplier;

    const percentageVsAverage = ((baseMetrics.estimatedLifespanYears / categoryAverageYears) - 1) * 100;

    const lifespanExplanation: LifespanExplanation = {
        years: baseMetrics.estimatedLifespanYears,
        categoryAverageYears,
        percentageVsAverage: Math.round(percentageVsAverage),
        limitingComponent: {
            name: limitingComp.name,
            category: limitingComp.category,
            l10Hours: limitingComp.l10LifeHours ?? 60000,
            failureModes: limitingComp.failureModes,
        },
        usageAssumptions: {
            dailyHours: Math.round(dailyUsage * 10) / 10,
            annualHours: Math.round(annualUsage),
            source: facts.usageProfile?.dailyUsageHours ? 'user_input' : 'category_default',
        },
        qualityMultipliers: {
            brand: { name: brandName, factor: brandMultiplier },
            technology: { name: techName, factor: techMultiplier },
        },
        calculationBreakdown: {
            baseLifeYears: Math.round(baseLifeYears * 10) / 10,
            afterBrandMultiplier: Math.round(afterBrand * 10) / 10,
            afterTechMultiplier: Math.round(afterTech * 10) / 10,
            finalEstimate: baseMetrics.estimatedLifespanYears,
        },
    };

    // ========================================
    // REPAIRABILITY MAP
    // ========================================
    const getComponentStatus = (score: number): ComponentStatus => {
        if (score >= 7) return 'repairable';
        if (score >= 4) return 'moderate';
        return 'critical';
    };

    const getRecommendation = (score: number, repairCost: number, purchasePrice: number): string => {
        const ratio = repairCost / purchasePrice;
        if (score < 3 || ratio > 0.5) {
            return 'Se esse componente falhar, o custo do reparo pode ser alto — depende da região e assistência';
        }
        if (score >= 7 && ratio < 0.2) {
            return 'Conserto viável e econômico';
        }
        return 'Reparo possível, avaliar custo-benefício';
    };

    const repairabilityComponents: RepairabilityComponent[] = components.map((comp, idx) => ({
        name: comp.name,
        id: comp.id,
        category: comp.category,
        score: comp.repairabilityScore,
        status: getComponentStatus(comp.repairabilityScore),
        repairCost: comp.partCostBRL + comp.laborCostBRL,
        partsAvailability: comp.partsAvailability,
        symptoms: comp.failureSymptoms,
        recommendation: getRecommendation(
            comp.repairabilityScore,
            comp.partCostBRL + comp.laborCostBRL,
            purchasePrice
        ),
        isLimitingComponent: comp.id === limitingComp.id,
        diyFriendly: comp.diyFriendly,
    }));

    // Sort by score (worst first for visibility)
    repairabilityComponents.sort((a, b) => a.score - b.score);

    const getRepairabilityLabel = (score: number): 'Fácil Reparo' | 'Reparo Moderado' | 'Risco de Descarte' => {
        if (score >= 7) return 'Fácil Reparo';
        if (score >= 4) return 'Reparo Moderado';
        return 'Risco de Descarte';
    };

    const repairabilityMap: RepairabilityMap = {
        overallScore: baseMetrics.maintenanceRiskScore,
        label: getRepairabilityLabel(baseMetrics.maintenanceRiskScore),
        // Category average for context - typically TVs score 3.5-4.5, ACs 4.0-5.0, etc.
        categoryAverage: getCategoryAverageRepairability(facts.categoryId),
        components: repairabilityComponents,
        summary: {
            totalComponents: repairabilityComponents.length,
            repairableCount: repairabilityComponents.filter(c => c.status === 'repairable').length,
            criticalCount: repairabilityComponents.filter(c => c.status === 'critical').length,
            avgRepairCost: repairabilityComponents.length > 0
                ? Math.round(repairabilityComponents.reduce((sum, c) => sum + c.repairCost, 0) / repairabilityComponents.length)
                : 0,
        },
    };

    return {
        ...baseMetrics,
        tcoBreakdown,
        lifespanExplanation,
        repairabilityMap,
    };
}

// ============================================
// HELPER: ENRICH PRODUCT WITH SHADOW METRICS
// ============================================

/**
 * Enriches a ProductFactsV2 object with computed Shadow Metrics.
 * 
 * @description Pure function that returns a new object with computed values added.
 * Does not mutate the original object.
 * 
 * @param facts - Raw product facts
 * @returns New object with computed shadow metrics
 */
export function enrichWithShadowMetrics(facts: ProductFactsV2): ProductFactsV2 {
    return {
        ...facts,
        computed: computeShadowMetrics(facts),
    };
}

// ============================================
// EXPORT CONFIGURATION (for testing/extension)
// ============================================

export const SHADOW_ENGINE_CONFIG = {
    MAINTENANCE_RATIO_THRESHOLDS,
    DEFAULTS,
} as const;

