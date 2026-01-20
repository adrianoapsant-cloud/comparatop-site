// ============================================================================
// TCO MODULE - PUBLIC API
// ============================================================================

// Original TCO calculations (existing)
export { calculateTco, calculateQuickTco, formatTco, getDefaultEnergyConsumption, getDefaultLifespan } from './calculate-tco';
export type { TcoInput, TcoBreakdown } from './calculate-tco';
export { ENERGY_RATES, getEnergyRate, getStateOptions, DEFAULT_ENERGY_RATE } from './energy-rates';
export type { EnergyRate } from './energy-rates';

// ============================================================================
// VALUE ENGINEERING MODULE (NEW)
// ============================================================================

// Advanced TCO Calculations
export {
    calculateTotalTco,
    compareTco,
    calculateMonthlyEnergyCost,
    calculateMaintenanceFromScrs,
    getEnergyForPersona,
    formatBRL,
    formatBRLPrecise,
    calculateHiddenCostsPercent,
    rankByTco,
    getTcoSummaryText,
    DEFAULT_YEARS,
} from './calculations';

export type { CalculateTcoOptions } from './calculations';

// Mock Data Generator
export {
    generateMockProducts,
    getCuratedExampleProducts,
    getProductsForCategory,
    CATEGORY_CONFIGS,
} from './mock-data';
export type { TcoCategory } from './mock-data';

