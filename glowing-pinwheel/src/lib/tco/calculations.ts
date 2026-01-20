// ============================================================================
// TCO CALCULATIONS
// ============================================================================
// Pure functions for calculating Total Cost of Ownership
// Formula: TCO = Price + (Energy × Years) + (Maintenance × Years) - Resale
// ============================================================================

import type {
    ProductTcoData,
    TcoCalculationResult,
    TcoComparisonResult,
    UsagePersona,
    EnergyProfile
} from '@/types/tco';

// ============================================
// CONSTANTS
// ============================================

/** Default energy rate in BRL per kWh (can be overridden) */
export const DEFAULT_ENERGY_RATE = 0.85;

/** Default calculation period in years */
export const DEFAULT_YEARS = 5;

/** Months per year (for monthly calculations) */
const MONTHS_PER_YEAR = 12;

// ============================================
// CORE CALCULATION
// ============================================

export interface CalculateTcoOptions {
    /** Number of years for projection */
    years?: number;
    /** Usage persona (affects energy consumption) */
    persona?: UsagePersona;
    /** Override energy rate (BRL/kWh) */
    energyRateOverride?: number;
    /** Include resale value in calculation */
    includeResale?: boolean;
}

/**
 * Calculate Total Cost of Ownership for a product
 * 
 * Formula: TCO = CAPEX + OPEX - Resale
 * Where:
 *   CAPEX = Purchase Price
 *   OPEX = (Energy Cost × Years × 12) + (Maintenance × Years)
 *   Resale = Estimated resale value after period
 * 
 * @param product Product TCO data
 * @param options Calculation options
 * @returns Complete TCO breakdown
 * 
 * @example
 * ```ts
 * const result = calculateTotalTco(product, { years: 5, persona: 'gamer' });
 * console.log(result.totalTco); // Total cost over 5 years
 * console.log(result.tcoPerMonth); // Monthly cost
 * ```
 */
export function calculateTotalTco(
    product: ProductTcoData,
    options: CalculateTcoOptions = {}
): TcoCalculationResult {
    const {
        years = DEFAULT_YEARS,
        persona = 'family',
        includeResale = true,
    } = options;

    // CAPEX: Initial purchase price
    const capex = product.price;

    // OPEX: Energy costs (monthly cost × 12 months × years)
    const monthlyEnergyCost = product.energyCost[persona];
    const totalEnergyCost = monthlyEnergyCost * MONTHS_PER_YEAR * years;

    // OPEX: Maintenance costs (annual × years)
    const totalMaintenanceCost = product.maintenanceCost * years;

    // Resale: Depreciated value (only if within lifespan)
    let resaleValue = 0;
    if (includeResale && years <= product.lifespanYears) {
        // Linear depreciation: resale value decreases proportionally
        const depreciationFactor = 1 - (years / product.lifespanYears);
        resaleValue = Math.round(product.resaleValue * depreciationFactor);
    }

    // Total TCO
    const totalTco = capex + totalEnergyCost + totalMaintenanceCost - resaleValue;

    // Derived metrics
    const tcoPerYear = totalTco / years;
    const tcoPerMonth = totalTco / (years * MONTHS_PER_YEAR);

    // Comparison with sticker price
    const priceVsTcoDelta = totalTco - capex;
    const priceVsTcoPercent = ((totalTco - capex) / capex) * 100;

    return {
        productId: product.id,
        persona,
        years,
        capex,
        totalEnergyCost: Math.round(totalEnergyCost * 100) / 100,
        totalMaintenanceCost: Math.round(totalMaintenanceCost * 100) / 100,
        resaleValue,
        totalTco: Math.round(totalTco * 100) / 100,
        tcoPerYear: Math.round(tcoPerYear * 100) / 100,
        tcoPerMonth: Math.round(tcoPerMonth * 100) / 100,
        priceVsTcoDelta: Math.round(priceVsTcoDelta * 100) / 100,
        priceVsTcoPercent: Math.round(priceVsTcoPercent * 10) / 10,
    };
}

// ============================================
// COMPARISON
// ============================================

/**
 * Compare TCO between two products
 * 
 * @param productA First product
 * @param productB Second product
 * @param options Calculation options (applied to both)
 * @returns Comparison result with winner and savings
 */
export function compareTco(
    productA: ProductTcoData,
    productB: ProductTcoData,
    options: CalculateTcoOptions = {}
): TcoComparisonResult {
    const resultA = calculateTotalTco(productA, options);
    const resultB = calculateTotalTco(productB, options);

    const winnerId = resultA.totalTco <= resultB.totalTco ? productA.id : productB.id;
    const savings = Math.abs(resultA.totalTco - resultB.totalTco);
    const loserTco = Math.max(resultA.totalTco, resultB.totalTco);
    const savingsPercent = (savings / loserTco) * 100;

    // Build differentiators
    const differentiators: TcoComparisonResult['differentiators'] = [
        {
            field: 'price',
            label: 'Preço',
            productAValue: productA.price,
            productBValue: productB.price,
            winner: productA.price < productB.price ? 'a' : productA.price > productB.price ? 'b' : 'tie',
        },
        {
            field: 'energyCost',
            label: 'Custo Energia/mês',
            productAValue: resultA.totalEnergyCost / (options.years ?? DEFAULT_YEARS) / 12,
            productBValue: resultB.totalEnergyCost / (options.years ?? DEFAULT_YEARS) / 12,
            winner: resultA.totalEnergyCost < resultB.totalEnergyCost ? 'a' : resultA.totalEnergyCost > resultB.totalEnergyCost ? 'b' : 'tie',
        },
        {
            field: 'maintenance',
            label: 'Manutenção/ano',
            productAValue: productA.maintenanceCost,
            productBValue: productB.maintenanceCost,
            winner: productA.maintenanceCost < productB.maintenanceCost ? 'a' : productA.maintenanceCost > productB.maintenanceCost ? 'b' : 'tie',
        },
        {
            field: 'resale',
            label: 'Valor Revenda',
            productAValue: productA.resaleValue,
            productBValue: productB.resaleValue,
            winner: productA.resaleValue > productB.resaleValue ? 'a' : productA.resaleValue < productB.resaleValue ? 'b' : 'tie',
        },
        {
            field: 'scrs',
            label: 'SCRS (Confiabilidade)',
            productAValue: productA.scrsScore,
            productBValue: productB.scrsScore,
            winner: productA.scrsScore > productB.scrsScore ? 'a' : productA.scrsScore < productB.scrsScore ? 'b' : 'tie',
        },
        {
            field: 'lifespan',
            label: 'Vida Útil',
            productAValue: productA.lifespanYears,
            productBValue: productB.lifespanYears,
            winner: productA.lifespanYears > productB.lifespanYears ? 'a' : productA.lifespanYears < productB.lifespanYears ? 'b' : 'tie',
        },
    ];

    return {
        productA: resultA,
        productB: resultB,
        winnerId,
        savings: Math.round(savings * 100) / 100,
        savingsPercent: Math.round(savingsPercent * 10) / 10,
        differentiators,
    };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Calculate monthly energy cost from kWh consumption
 */
export function calculateMonthlyEnergyCost(
    monthlyKwh: number,
    ratePerKwh: number = DEFAULT_ENERGY_RATE
): number {
    return Math.round(monthlyKwh * ratePerKwh * 100) / 100;
}

/**
 * Calculate annual maintenance cost based on SCRS score
 * Lower SCRS = higher maintenance risk
 */
export function calculateMaintenanceFromScrs(
    productPrice: number,
    scrsScore: number
): number {
    const riskFactor = 10 - scrsScore;
    const annualRate = 0.02 + (riskFactor * 0.006); // 2% to 8%
    return Math.round(productPrice * annualRate);
}

/**
 * Get energy consumption for a specific persona
 */
export function getEnergyForPersona(
    energyProfile: EnergyProfile,
    persona: UsagePersona
): number {
    return energyProfile[persona];
}

/**
 * Format currency in Brazilian Real
 */
export function formatBRL(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

/**
 * Format currency with decimals for precision
 */
export function formatBRLPrecise(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

/**
 * Calculate "hidden costs" percentage
 * Shows how much more the TCO is compared to sticker price
 */
export function calculateHiddenCostsPercent(
    product: ProductTcoData,
    options: CalculateTcoOptions = {}
): number {
    const result = calculateTotalTco(product, options);
    return result.priceVsTcoPercent;
}

/**
 * Rank products by TCO (lowest first)
 */
export function rankByTco(
    products: ProductTcoData[],
    options: CalculateTcoOptions = {}
): Array<{ product: ProductTcoData; tco: TcoCalculationResult; rank: number }> {
    const withTco = products.map(product => ({
        product,
        tco: calculateTotalTco(product, options),
    }));

    // Sort by total TCO ascending
    withTco.sort((a, b) => a.tco.totalTco - b.tco.totalTco);

    return withTco.map((item, index) => ({
        ...item,
        rank: index + 1,
    }));
}

/**
 * Get TCO summary text for display
 */
export function getTcoSummaryText(result: TcoCalculationResult): string {
    const { years, totalTco, tcoPerMonth, priceVsTcoPercent } = result;

    const direction = priceVsTcoPercent > 0 ? 'a mais' : 'a menos';
    const percentText = Math.abs(priceVsTcoPercent).toFixed(0);

    return `Em ${years} anos, o custo real é ${formatBRL(totalTco)} (${formatBRLPrecise(tcoPerMonth)}/mês) — ${percentText}% ${direction} que o preço de etiqueta.`;
}
