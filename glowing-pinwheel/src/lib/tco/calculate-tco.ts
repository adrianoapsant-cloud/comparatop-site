/**
 * TCO (Total Cost of Ownership) Calculator
 * 
 * Implements the actuarial model for calculating the true cost of ownership
 * considering acquisition price, energy consumption, and maintenance.
 * 
 * Formula: TCO = P_acq + Σ[(E_month × 12 × rate × (1+i)^t) / (1+d)^t] + M
 * Where:
 *   P_acq = Acquisition price
 *   E_month = Monthly energy consumption (kWh)
 *   rate = Energy rate (R$/kWh)
 *   i = Energy inflation rate (5% p.a.)
 *   d = Discount rate (2% p.a. - SELIC real)
 *   M = Maintenance costs
 *   t = Year
 */

// Constants for actuarial calculations
const ENERGY_INFLATION_RATE = 0.05; // 5% annual energy price increase
const DISCOUNT_RATE = 0.02; // 2% annual discount rate (real SELIC)
const DEFAULT_LIFESPAN_YEARS = 5; // Default period for TCO calculation
const DEFAULT_MAINTENANCE_RATE = 0.02; // 2% of price per year for maintenance

export interface TcoInput {
    /** Acquisition price in R$ */
    price: number;
    /** Monthly energy consumption in kWh */
    energyKwhMonth: number;
    /** Energy rate in R$/kWh */
    energyRate: number;
    /** Product lifespan in years (default: 5) */
    lifespanYears?: number;
    /** Annual maintenance rate as decimal (default: 0.02) */
    maintenanceRate?: number;
}

export interface TcoBreakdown {
    /** Original acquisition price */
    acquisitionCost: number;
    /** Total energy cost over lifespan (NPV) */
    energyCost: number;
    /** Total maintenance cost over lifespan */
    maintenanceCost: number;
    /** Total Cost of Ownership */
    totalTco: number;
    /** TCO per year */
    tcoPerYear: number;
    /** TCO per month */
    tcoPerMonth: number;
    /** Lifespan used in calculation */
    lifespanYears: number;
    /** Energy rate used */
    energyRate: number;
}

/**
 * Calculate the Total Cost of Ownership with full breakdown
 */
export function calculateTco(input: TcoInput): TcoBreakdown {
    const {
        price,
        energyKwhMonth,
        energyRate,
        lifespanYears = DEFAULT_LIFESPAN_YEARS,
        maintenanceRate = DEFAULT_MAINTENANCE_RATE
    } = input;

    // Calculate energy cost with inflation and discounting (NPV)
    let totalEnergyCost = 0;
    for (let year = 1; year <= lifespanYears; year++) {
        // Annual energy cost with inflation
        const annualEnergyCost = energyKwhMonth * 12 * energyRate
            * Math.pow(1 + ENERGY_INFLATION_RATE, year);

        // Present Value (discounted)
        const presentValue = annualEnergyCost / Math.pow(1 + DISCOUNT_RATE, year);

        totalEnergyCost += presentValue;
    }

    // Maintenance cost (simple annual rate on price)
    const maintenanceCost = price * maintenanceRate * lifespanYears;

    // Total TCO
    const totalTco = price + totalEnergyCost + maintenanceCost;

    return {
        acquisitionCost: price,
        energyCost: Math.round(totalEnergyCost),
        maintenanceCost: Math.round(maintenanceCost),
        totalTco: Math.round(totalTco),
        tcoPerYear: Math.round(totalTco / lifespanYears),
        tcoPerMonth: Math.round(totalTco / (lifespanYears * 12)),
        lifespanYears,
        energyRate
    };
}

/**
 * Quick TCO calculation (just returns the total)
 */
export function calculateQuickTco(
    price: number,
    energyKwhMonth: number,
    energyRate: number,
    lifespanYears: number = DEFAULT_LIFESPAN_YEARS
): number {
    return calculateTco({
        price,
        energyKwhMonth,
        energyRate,
        lifespanYears
    }).totalTco;
}

/**
 * Format TCO value for display
 */
export function formatTco(tco: number): string {
    return `R$ ${tco.toLocaleString('pt-BR')}`;
}

/**
 * Get default energy consumption by product category
 * These are typical monthly kWh values
 */
export function getDefaultEnergyConsumption(category: string): number {
    const categoryDefaults: Record<string, number> = {
        'tv': 15, // 55" LED TV ~15 kWh/month
        'fridge': 40, // Average fridge ~40 kWh/month
        'washer': 8, // Washing machine ~8 kWh/month (based on usage)
        'dryer': 30, // Dryer ~30 kWh/month
        'air_conditioner': 90, // 12000 BTU ~90 kWh/month (moderate use)
        'microwave': 5, // Microwave ~5 kWh/month
        'dishwasher': 20, // Dishwasher ~20 kWh/month
        'freezer': 35, // Freezer ~35 kWh/month
        'notebook': 10, // Laptop ~10 kWh/month
        'desktop': 30, // Desktop PC ~30 kWh/month
        'monitor': 8, // Monitor ~8 kWh/month
        'smartphone': 0.5, // Charging ~0.5 kWh/month
    };

    return categoryDefaults[category] ?? 20; // Default 20 kWh/month
}

/**
 * Get default lifespan by product category (years)
 */
export function getDefaultLifespan(category: string): number {
    const categoryLifespans: Record<string, number> = {
        'tv': 7,
        'fridge': 12,
        'washer': 10,
        'dryer': 10,
        'air_conditioner': 12,
        'microwave': 8,
        'dishwasher': 10,
        'freezer': 12,
        'notebook': 5,
        'desktop': 6,
        'monitor': 7,
        'smartphone': 3,
    };

    return categoryLifespans[category] ?? 5; // Default 5 years
}
