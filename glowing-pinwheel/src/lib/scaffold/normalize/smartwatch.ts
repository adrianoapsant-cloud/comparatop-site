/**
 * @file smartwatch.ts
 * @description Normalizador para Smartwatch
 */

import { createChange, coerceToBoolean, type NormalizationResult } from './index';

// ============================================
// ALIASES
// ============================================

const DISPLAY_TYPE_ALIASES: Record<string, string> = {
    'amoled': 'AMOLED',
    'AMOLED': 'AMOLED',
    'super amoled': 'Super AMOLED',
    'superamoled': 'Super AMOLED',
    'oled': 'OLED',
    'OLED': 'OLED',
    'lcd': 'LCD',
    'LCD': 'LCD',
    'ips': 'IPS LCD',
    'ips lcd': 'IPS LCD',
    'ltpo': 'LTPO OLED',
    'ltpo oled': 'LTPO OLED',
    'oled ltpo': 'LTPO OLED',
};

const WATER_RESISTANCE_ALIASES: Record<string, string> = {
    '5atm': '5ATM',
    '5 atm': '5ATM',
    '3atm': '3ATM',
    '3 atm': '3ATM',
    '10atm': '10ATM',
    '10 atm': '10ATM',
    'ip68': 'IP68',
    'IP68': 'IP68',
    'ip67': 'IP67',
    'IP67': 'IP67',
    '50m': '5ATM',
    '50 metros': '5ATM',
};

// ============================================
// NORMALIZER
// ============================================

export function normalizeSmartwatch(rawSpecs: Record<string, unknown>): NormalizationResult {
    const normalizedSpecs = { ...rawSpecs };
    const changes: NormalizationResult['changes'] = [];
    const warnings: string[] = [];

    // displayType
    if (rawSpecs.displayType) {
        const raw = String(rawSpecs.displayType);
        const normalized = DISPLAY_TYPE_ALIASES[raw.toLowerCase()];
        if (normalized && normalized !== raw) {
            normalizedSpecs.displayType = normalized;
            changes.push(createChange('displayType', raw, normalized, 'Tipo display padronizado'));
        }
    }

    // waterResistance
    if (rawSpecs.waterResistance) {
        const raw = String(rawSpecs.waterResistance);
        const normalized = WATER_RESISTANCE_ALIASES[raw.toLowerCase()];
        if (normalized && normalized !== raw) {
            normalizedSpecs.waterResistance = normalized;
            changes.push(createChange('waterResistance', raw, normalized, 'Resistência padronizada'));
        }
    }

    // Boolean coercion for all has* fields
    for (const field of ['hasGps', 'hasNfc', 'hasLte', 'hasEcg', 'hasSpO2', 'hasHeartRate']) {
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
