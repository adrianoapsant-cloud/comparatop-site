/**
 * @file fridge.ts
 * @description Normalizador para Geladeira
 */

import { createChange, coerceToBoolean, type NormalizationResult } from './index';

// ============================================
// ALIASES
// ============================================

const DOOR_TYPE_ALIASES: Record<string, string> = {
    'french door': 'French Door',
    'french-door': 'French Door',
    'frenchdoor': 'French Door',
    'side by side': 'Side-by-Side',
    'side-by-side': 'Side-by-Side',
    'sidebyside': 'Side-by-Side',
    'top freezer': 'Top Freezer',
    'top-freezer': 'Top Freezer',
    'topfreezer': 'Top Freezer',
    'bottom freezer': 'Bottom Freezer',
    'bottom-freezer': 'Bottom Freezer',
    'bottomfreezer': 'Bottom Freezer',
    'inverse': 'Bottom Freezer',
    'inversa': 'Bottom Freezer',
    'duplex': 'Top Freezer',
    'single door': 'Single Door',
    'porta única': 'Single Door',
    'porta unica': 'Single Door',
};

const ENERGY_CLASS_ALIASES: Record<string, string> = {
    'a+++': 'A',
    'a++': 'A',
    'a+': 'A',
    'a': 'A',
    'b': 'B',
    'c': 'C',
    'd': 'D',
    'e': 'E',
    // Brasil usava A3/A2/A1 antigamente
    'a3': 'A',
    'a2': 'A',
    'a1': 'A',
};

const VOLTAGE_ALIASES: Record<string, string> = {
    '110': '110V',
    '110v': '110V',
    '127': '127V',
    '127v': '127V',
    '220': '220V',
    '220v': '220V',
    'bivolt': 'Bivolt',
    'bi-volt': 'Bivolt',
};

// ============================================
// NORMALIZER
// ============================================

export function normalizeFridge(rawSpecs: Record<string, unknown>): NormalizationResult {
    const normalizedSpecs = { ...rawSpecs };
    const changes: NormalizationResult['changes'] = [];
    const warnings: string[] = [];

    // doorType
    if (rawSpecs.doorType) {
        const raw = String(rawSpecs.doorType);
        const normalized = DOOR_TYPE_ALIASES[raw.toLowerCase()];
        if (normalized && normalized !== raw) {
            normalizedSpecs.doorType = normalized;
            changes.push(createChange('doorType', raw, normalized, 'Alias padronizado'));
        }
    }

    // energyClass
    if (rawSpecs.energyClass) {
        const raw = String(rawSpecs.energyClass);
        const normalized = ENERGY_CLASS_ALIASES[raw.toLowerCase()];
        if (normalized && normalized !== raw) {
            normalizedSpecs.energyClass = normalized;
            changes.push(createChange('energyClass', raw, normalized, 'Classe energética normalizada'));
        }
    }

    // voltage
    if (rawSpecs.voltage) {
        const raw = String(rawSpecs.voltage);
        const normalized = VOLTAGE_ALIASES[raw.toLowerCase()];
        if (normalized && normalized !== raw) {
            normalizedSpecs.voltage = normalized;
            changes.push(createChange('voltage', raw, normalized, 'Voltagem padronizada'));
        }
    }

    // Boolean coercion
    for (const field of ['hasFrostFree', 'hasInverter', 'hasIceMaker', 'hasWaterDispenser']) {
        if (rawSpecs[field] !== undefined && typeof rawSpecs[field] !== 'boolean') {
            const coerced = coerceToBoolean(rawSpecs[field]);
            if (coerced !== null) {
                normalizedSpecs[field] = coerced;
                changes.push(createChange(field, rawSpecs[field], coerced, 'Boolean coercion'));
            }
        }
    }

    return { normalizedSpecs, changes, warnings };
}
