/**
 * @file index.ts
 * @description Sistema de normalização de valores por categoria
 * 
 * Objetivo: Reduzir variância/delírio padronizando aliases e formatos
 */

// ============================================
// TYPES
// ============================================

export interface NormalizationChange {
    fieldPath: string;
    rawValue: unknown;
    normalizedValue: unknown;
    reason: string;
}

export interface NormalizationResult {
    normalizedSpecs: Record<string, unknown>;
    changes: NormalizationChange[];
    warnings: string[];
}

export type NormalizerFunction = (rawSpecs: Record<string, unknown>) => NormalizationResult;

// ============================================
// UTILITY FUNCTIONS (defined before imports to avoid circular deps)
// ============================================

/**
 * Cria um change record
 */
export function createChange(
    fieldPath: string,
    rawValue: unknown,
    normalizedValue: unknown,
    reason: string
): NormalizationChange {
    return { fieldPath, rawValue, normalizedValue, reason };
}

/**
 * Converte string para boolean (para flags como hasGps, hasNfc, etc.)
 */
export function coerceToBoolean(value: unknown): boolean | null {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;
    if (typeof value === 'string') {
        const lower = value.toLowerCase().trim();
        if (['true', 'yes', 'sim', '1', 'on'].includes(lower)) return true;
        if (['false', 'no', 'não', 'nao', '0', 'off'].includes(lower)) return false;
    }
    return null;
}

/**
 * Normaliza case (título ou uppercase conforme regra)
 */
export function normalizeCase(value: string, style: 'title' | 'upper' | 'lower'): string {
    switch (style) {
        case 'title':
            return value.replace(/\w\S*/g, txt =>
                txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
            );
        case 'upper':
            return value.toUpperCase();
        case 'lower':
            return value.toLowerCase();
        default:
            return value;
    }
}

// ============================================
// IMPORT NORMALIZERS (after utility functions)
// ============================================

import { normalizeRobotVacuum } from './robot-vacuum';
import { normalizeTV } from './tv';
import { normalizeFridge } from './fridge';
import { normalizeAirConditioner } from './air-conditioner';
import { normalizeSmartwatch } from './smartwatch';
import { normalizeSmartphone } from './smartphone';
// P5-4: +5 categories
import { normalizeLaptop } from './laptop';
import { normalizeWasher } from './washer';
import { normalizeMonitor } from './monitor';
import { normalizeTablet } from './tablet';
import { normalizeSoundbar } from './soundbar';

// ============================================
// NORMALIZER REGISTRY (11 categories)
// ============================================

const NORMALIZER_BY_CATEGORY: Record<string, NormalizerFunction> = {
    'robot-vacuum': normalizeRobotVacuum,
    'tv': normalizeTV,
    'fridge': normalizeFridge,
    'air_conditioner': normalizeAirConditioner,
    'smartwatch': normalizeSmartwatch,
    'smartphone': normalizeSmartphone,
    'laptop': normalizeLaptop,
    'washer': normalizeWasher,
    'monitor': normalizeMonitor,
    'tablet': normalizeTablet,
    'soundbar': normalizeSoundbar,
};

// ============================================
// MAIN FUNCTION
// ============================================

/**
 * Normaliza specs de input raw para uma categoria
 * 
 * @param categoryId - ID da categoria
 * @param rawSpecs - Specs originais do input
 * @returns Specs normalizados + lista de mudanças + warnings
 */
export function normalizeByCategory(
    categoryId: string,
    rawSpecs: Record<string, unknown>
): NormalizationResult {
    const normalizer = NORMALIZER_BY_CATEGORY[categoryId];

    if (!normalizer) {
        // Categoria sem normalizador - retorna specs originais
        return {
            normalizedSpecs: { ...rawSpecs },
            changes: [],
            warnings: [],
        };
    }

    return normalizer(rawSpecs);
}

// Re-export category normalizers
export { normalizeRobotVacuum } from './robot-vacuum';
export { normalizeTV } from './tv';
export { normalizeFridge } from './fridge';
export { normalizeAirConditioner } from './air-conditioner';
export { normalizeSmartwatch } from './smartwatch';
export { normalizeSmartphone } from './smartphone';
export { normalizeLaptop } from './laptop';
export { normalizeWasher } from './washer';
export { normalizeMonitor } from './monitor';
export { normalizeTablet } from './tablet';
export { normalizeSoundbar } from './soundbar';
