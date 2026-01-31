/**
 * @file air-conditioner.ts
 * @description Normalizador para Ar Condicionado
 */

import { createChange, coerceToBoolean, type NormalizationResult } from './index';

// ============================================
// ALIASES
// ============================================

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

const CYCLE_ALIASES: Record<string, string> = {
    'frio': 'Frio',
    'cold': 'Frio',
    'cooling': 'Frio',
    'quente/frio': 'Quente/Frio',
    'quente-frio': 'Quente/Frio',
    'quentefrio': 'Quente/Frio',
    'hot/cold': 'Quente/Frio',
    'heating/cooling': 'Quente/Frio',
    'reverso': 'Quente/Frio',
    'reverse': 'Quente/Frio',
};

const AC_TYPE_ALIASES: Record<string, string> = {
    'split': 'Split',
    'window': 'Janela',
    'janela': 'Janela',
    'portable': 'Portátil',
    'portatil': 'Portátil',
    'portátil': 'Portátil',
    'cassete': 'Cassete',
    'cassette': 'Cassete',
    'piso-teto': 'Piso-Teto',
    'piso teto': 'Piso-Teto',
    'floor-ceiling': 'Piso-Teto',
};

const INVERTER_TYPE_ALIASES: Record<string, string> = {
    'dual inverter': 'Dual Inverter',
    'dual-inverter': 'Dual Inverter',
    'dualinverter': 'Dual Inverter',
    'inverter': 'Inverter',
    'convencional': 'Convencional',
    'conventional': 'Convencional',
    'on-off': 'Convencional',
    'on/off': 'Convencional',
};

// ============================================
// NORMALIZER
// ============================================

export function normalizeAirConditioner(rawSpecs: Record<string, unknown>): NormalizationResult {
    const normalizedSpecs = { ...rawSpecs };
    const changes: NormalizationResult['changes'] = [];
    const warnings: string[] = [];

    // voltage
    if (rawSpecs.voltage) {
        const raw = String(rawSpecs.voltage);
        const normalized = VOLTAGE_ALIASES[raw.toLowerCase()];
        if (normalized && normalized !== raw) {
            normalizedSpecs.voltage = normalized;
            changes.push(createChange('voltage', raw, normalized, 'Voltagem padronizada'));
        }
    }

    // cycle
    if (rawSpecs.cycle) {
        const raw = String(rawSpecs.cycle);
        const normalized = CYCLE_ALIASES[raw.toLowerCase()];
        if (normalized && normalized !== raw) {
            normalizedSpecs.cycle = normalized;
            changes.push(createChange('cycle', raw, normalized, 'Ciclo padronizado'));
        }
    }

    // acType
    if (rawSpecs.acType) {
        const raw = String(rawSpecs.acType);
        const normalized = AC_TYPE_ALIASES[raw.toLowerCase()];
        if (normalized && normalized !== raw) {
            normalizedSpecs.acType = normalized;
            changes.push(createChange('acType', raw, normalized, 'Tipo padronizado'));
        }
    }

    // inverterType
    if (rawSpecs.inverterType) {
        const raw = String(rawSpecs.inverterType);
        const normalized = INVERTER_TYPE_ALIASES[raw.toLowerCase()];
        if (normalized && normalized !== raw) {
            normalizedSpecs.inverterType = normalized;
            changes.push(createChange('inverterType', raw, normalized, 'Tipo inverter padronizado'));
        }
    }

    // Boolean coercion
    for (const field of ['hasInverter', 'hasWifi', 'hasHeating']) {
        if (rawSpecs[field] !== undefined && typeof rawSpecs[field] !== 'boolean') {
            const coerced = coerceToBoolean(rawSpecs[field]);
            if (coerced !== null) {
                normalizedSpecs[field] = coerced;
                changes.push(createChange(field, rawSpecs[field], coerced, 'Boolean coercion'));
            }
        }
    }

    // energyClass
    if (rawSpecs.energyClass) {
        const raw = String(rawSpecs.energyClass);
        const normalized = raw.toUpperCase();
        if (normalized !== raw) {
            normalizedSpecs.energyClass = normalized;
            changes.push(createChange('energyClass', raw, normalized, 'Uppercase'));
        }
    }

    return { normalizedSpecs, changes, warnings };
}
