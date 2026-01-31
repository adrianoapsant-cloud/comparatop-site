/**
 * @file washer.ts
 * @description Normalizador para Máquina de Lavar
 */

import { createChange, coerceToBoolean, type NormalizationResult } from './index';
import { normalizeVoltage, parseNumberLoose } from './numbers';

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

export function normalizeWasher(rawSpecs: Record<string, unknown>): NormalizationResult {
    const normalizedSpecs = { ...rawSpecs };
    const changes: NormalizationResult['changes'] = [];
    const warnings: string[] = [];

    // Normalize voltage
    if (rawSpecs.voltage) {
        const normalized = normalizeVoltage(rawSpecs.voltage);
        if (normalized && normalized !== rawSpecs.voltage) {
            normalizedSpecs.voltage = normalized;
            changes.push(createChange('voltage', rawSpecs.voltage, normalized, 'Voltagem padronizada'));
        }
    }

    // Normalize capacityKg to number
    if (rawSpecs.capacityKg !== undefined && typeof rawSpecs.capacityKg === 'string') {
        const normalized = parseNumberLoose(rawSpecs.capacityKg);
        if (normalized !== null) {
            normalizedSpecs.capacityKg = normalized;
            changes.push(createChange('capacityKg', rawSpecs.capacityKg, normalized, 'Extraído número'));
        }
    }

    // Boolean coercion
    for (const field of ['hasInverter', 'hasDryer', 'hasWifi']) {
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
