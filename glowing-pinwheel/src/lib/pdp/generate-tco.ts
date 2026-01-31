/**
 * TCO Auto-Generator for SimplifiedPDP
 * 
 * Generates TCO data from product price and category using
 * the existing actuarial model in calculate-tco.ts
 */

import type { Product } from '@/types/category';
import { calculateTco, getDefaultEnergyConsumption, getDefaultLifespan } from '@/lib/tco/calculate-tco';

// Energy rate R$/kWh (average Brazil 2024)
const ENERGY_RATE = 0.85;

// Category-specific configurations
const CATEGORY_TCO_CONFIG: Record<string, {
    energyKwhMonth: number;
    lifespanYears: number;
    maintenanceRate: number;
    categoryMediaLifespan: number;
}> = {
    'robot-vacuum': {
        energyKwhMonth: 0.6,     // 30W x 2h x 10 cycles/month
        lifespanYears: 3,        // Conservative estimate
        maintenanceRate: 0.07,   // 7%/year (filters, brushes, battery)
        categoryMediaLifespan: 7, // For comparison display
    },
    'tv': {
        energyKwhMonth: 35,      // 55" LED ~35 kWh/month (family use)
        lifespanYears: 7,
        maintenanceRate: 0.02,   // 2%/year
        categoryMediaLifespan: 8,
    },
    'air-conditioner': {
        energyKwhMonth: 150,     // 12000 BTU moderate use
        lifespanYears: 10,
        maintenanceRate: 0.03,   // 3%/year (cleaning, gas)
        categoryMediaLifespan: 12,
    },
    'fridge': {
        energyKwhMonth: 40,      // Average fridge
        lifespanYears: 10,
        maintenanceRate: 0.015,  // 1.5%/year
        categoryMediaLifespan: 12,
    },
    'smartphone': {
        energyKwhMonth: 0.5,     // Charging only
        lifespanYears: 3,
        maintenanceRate: 0.05,   // 5%/year (screen, battery)
        categoryMediaLifespan: 4,
    },
    'smartwatch': {
        energyKwhMonth: 0.2,     // Minimal charging
        lifespanYears: 3,
        maintenanceRate: 0.03,   // 3%/year
        categoryMediaLifespan: 4,
    },
    'headphone': {
        energyKwhMonth: 0.3,     // Battery charging
        lifespanYears: 4,
        maintenanceRate: 0.02,   // 2%/year
        categoryMediaLifespan: 5,
    },
};

// Default config for unknown categories
const DEFAULT_CONFIG = {
    energyKwhMonth: 20,
    lifespanYears: 5,
    maintenanceRate: 0.02,
    categoryMediaLifespan: 7,
};

export interface GeneratedTCOData {
    purchasePrice: number;
    maintenanceCost5y: number;
    energyCost5y: number;
    totalCost5y: number;
    monthlyReserve: number;
    estimatedLifeYears: number;
    categoryMediaLifespan: number;
    lifespanComparison: string;
}

/**
 * Generate TCO data from product
 */
export function generateTCO(product: Product): GeneratedTCOData | null {
    // Get price from product - handle both number and object types
    let price: number | undefined;
    if (typeof product.price === 'number') {
        price = product.price;
    } else if (product.price && typeof product.price === 'object') {
        price = (product.price as any).current || (product.price as any).range?.min;
    }

    if (!price || price <= 0) {
        return null;
    }

    // Get category config
    const categoryId = product.categoryId || 'robot-vacuum';
    const config = CATEGORY_TCO_CONFIG[categoryId] || DEFAULT_CONFIG;

    // Calculate TCO using actuarial model
    const tcoResult = calculateTco({
        price,
        energyKwhMonth: config.energyKwhMonth,
        energyRate: ENERGY_RATE,
        lifespanYears: 5, // Always calculate for 5 years
        maintenanceRate: config.maintenanceRate,
    });

    // Calculate lifespan comparison percentage
    const lifespanDiff = ((config.lifespanYears / config.categoryMediaLifespan) * 100) - 100;
    const lifespanComparison = lifespanDiff >= 0
        ? `+${Math.round(lifespanDiff)}% vs. média`
        : `${Math.round(lifespanDiff)}% vs. média (${config.categoryMediaLifespan} anos)`;

    return {
        purchasePrice: price,
        maintenanceCost5y: tcoResult.maintenanceCost,
        energyCost5y: tcoResult.energyCost,
        totalCost5y: tcoResult.totalTco,
        monthlyReserve: tcoResult.tcoPerMonth,
        estimatedLifeYears: config.lifespanYears,
        categoryMediaLifespan: config.categoryMediaLifespan,
        lifespanComparison,
    };
}

/**
 * Check if we can generate TCO for this product
 */
export function canGenerateTCO(product: Product): boolean {
    let price: number | undefined;
    if (typeof product.price === 'number') {
        price = product.price;
    } else if (product.price && typeof product.price === 'object') {
        price = (product.price as any).current || (product.price as any).range?.min;
    }
    return !!price && price > 0;
}
