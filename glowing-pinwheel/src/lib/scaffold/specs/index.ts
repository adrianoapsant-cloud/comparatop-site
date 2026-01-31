/**
 * @file index.ts
 * @description Registry unificado de scaffold specs por categoria (P8: 53 categorias)
 * 
 * ARQUITETURA DATA-DRIVEN:
 * - Categorias "production": specs específicos com regras reais
 * - Categorias "stub": fallback para spec genérico (sem regras determinísticas)
 */

import type { CategoryScaffoldSpec } from './types';

// Lista de categorias stub (definida inline para evitar dependência circular)
const STUB_CATEGORIES = [
    'tws', 'bluetooth-speaker', 'console', 'headset-gamer', 'gamepad', 'chair',
    'projector', 'tvbox', 'printer', 'router',
    'cpu', 'gpu', 'motherboard', 'ram', 'ssd', 'psu', 'case',
    'freezer', 'minibar', 'wine-cooler', 'fan',
    'stove', 'builtin-oven', 'microwave', 'air-fryer', 'range-hood',
    'dishwasher', 'espresso-machine', 'mixer', 'water-purifier', 'food-mixer',
    'washer-dryer', 'stick-vacuum', 'pressure-washer',
    'security-camera', 'smart-lock', 'ups', 'power-strip', 'camera',
    'tire', 'car-battery', 'drill',
] as const;

// Import specs por categoria (11 production)
import { ROBOT_VACUUM_SCAFFOLD_SPEC } from './robot-vacuum';
import { TV_SCAFFOLD_SPEC } from './tv';
import { FRIDGE_SCAFFOLD_SPEC } from './fridge';
import { AIR_CONDITIONER_SCAFFOLD_SPEC } from './air-conditioner';
import { SMARTWATCH_SCAFFOLD_SPEC } from './smartwatch';
import { SMARTPHONE_SCAFFOLD_SPEC } from './smartphone';
import { LAPTOP_SCAFFOLD_SPEC } from './laptop';
import { WASHER_SCAFFOLD_SPEC } from './washer';
import { MONITOR_SCAFFOLD_SPEC } from './monitor';
import { TABLET_SCAFFOLD_SPEC } from './tablet';
import { SOUNDBAR_SCAFFOLD_SPEC } from './soundbar';

// Re-export types
export * from './types';

// Re-export specs
export { ROBOT_VACUUM_SCAFFOLD_SPEC } from './robot-vacuum';
export { TV_SCAFFOLD_SPEC } from './tv';
export { FRIDGE_SCAFFOLD_SPEC } from './fridge';
export { AIR_CONDITIONER_SCAFFOLD_SPEC } from './air-conditioner';
export { SMARTWATCH_SCAFFOLD_SPEC } from './smartwatch';
export { SMARTPHONE_SCAFFOLD_SPEC } from './smartphone';
export { LAPTOP_SCAFFOLD_SPEC } from './laptop';
export { WASHER_SCAFFOLD_SPEC } from './washer';
export { MONITOR_SCAFFOLD_SPEC } from './monitor';
export { TABLET_SCAFFOLD_SPEC } from './tablet';
export { SOUNDBAR_SCAFFOLD_SPEC } from './soundbar';

// ============================================
// GENERIC SPEC FOR STUB CATEGORIES (P8)
// ============================================

/**
 * Spec genérico para categorias stub
 * - Energia baseline conservador
 * - Scores 7.0 como default
 * - SEM regras determinísticas (evita alucinar)
 */
function createGenericSpec(categoryId: string): CategoryScaffoldSpec {
    return {
        categoryId,
        energy: {
            baseline: {
                defaultKwhMonth: 10,  // Conservador
                lifespanYears: 5,
                maintenanceRate: 0.02,
            },
            consumptionPriority: ['inmetro', 'label', 'wattsUsage', 'baseline'],
            bounds: {
                hardMin: 0,
                hardMax: 1000,
                softMin: 1,
                softMax: 500,
            },
        },
        specs: {},  // Sem bounds restritivos para stubs
        defaultScores: {
            c1: 7.0, c2: 7.0, c3: 7.0, c4: 7.0, c5: 7.0,
            c6: 7.0, c7: 7.0, c8: 7.0, c9: 7.0, c10: 7.0,
        },
        deterministicRules: [],  // Sem regras - apenas scores default
    };
}

// ============================================
// PRODUCTION SPEC REGISTRY (11 categories)
// ============================================

const PRODUCTION_SPEC_MAP: Record<string, CategoryScaffoldSpec> = {
    'robot-vacuum': ROBOT_VACUUM_SCAFFOLD_SPEC,
    'tv': TV_SCAFFOLD_SPEC,
    'fridge': FRIDGE_SCAFFOLD_SPEC,
    'air_conditioner': AIR_CONDITIONER_SCAFFOLD_SPEC,
    'smartwatch': SMARTWATCH_SCAFFOLD_SPEC,
    'smartphone': SMARTPHONE_SCAFFOLD_SPEC,
    'laptop': LAPTOP_SCAFFOLD_SPEC,
    'washer': WASHER_SCAFFOLD_SPEC,
    'monitor': MONITOR_SCAFFOLD_SPEC,
    'tablet': TABLET_SCAFFOLD_SPEC,
    'soundbar': SOUNDBAR_SCAFFOLD_SPEC,
};

// Pre-generate stub specs for all stub categories
const STUB_SPEC_MAP: Record<string, CategoryScaffoldSpec> = {};
for (const categoryId of STUB_CATEGORIES) {
    STUB_SPEC_MAP[categoryId] = createGenericSpec(categoryId);
}

// ============================================
// LEGACY REGISTRY (backwards compatibility)
// ============================================

export const SCAFFOLD_SPEC_BY_CATEGORY: Record<string, CategoryScaffoldSpec> = {
    ...PRODUCTION_SPEC_MAP,
    ...STUB_SPEC_MAP,
};

// ============================================
// HELPERS
// ============================================

/**
 * Obtém spec de scaffold para uma categoria
 * Retorna spec específico para production, genérico para stubs
 */
export function getSpec(categoryId: string): CategoryScaffoldSpec | null {
    if (PRODUCTION_SPEC_MAP[categoryId]) {
        return PRODUCTION_SPEC_MAP[categoryId];
    }
    if (STUB_SPEC_MAP[categoryId]) {
        return STUB_SPEC_MAP[categoryId];
    }
    return null;
}

/**
 * Verifica se uma categoria tem spec definida
 */
export function hasSpec(categoryId: string): boolean {
    return categoryId in PRODUCTION_SPEC_MAP || categoryId in STUB_SPEC_MAP;
}

/**
 * Verifica se uma categoria usa spec de produção ou stub
 */
export function getSpecType(categoryId: string): 'production' | 'stub' | 'none' {
    if (categoryId in PRODUCTION_SPEC_MAP) return 'production';
    if (categoryId in STUB_SPEC_MAP) return 'stub';
    return 'none';
}

/**
 * Lista categorias com specs definidas
 */
export function listCategoriesWithSpecs(): string[] {
    return [...Object.keys(PRODUCTION_SPEC_MAP), ...Object.keys(STUB_SPEC_MAP)];
}
