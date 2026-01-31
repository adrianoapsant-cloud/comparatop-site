/**
 * @file laptop.ts
 * @description Normalizador para Laptop
 */

import { createChange, coerceToBoolean, type NormalizationResult } from './index';
import { normalizeStorageGb, normalizeVoltage } from './numbers';

export function normalizeLaptop(rawSpecs: Record<string, unknown>): NormalizationResult {
    const normalizedSpecs = { ...rawSpecs };
    const changes: NormalizationResult['changes'] = [];
    const warnings: string[] = [];

    // Normalize storage to GB number
    if (rawSpecs.storage !== undefined) {
        const normalized = normalizeStorageGb(rawSpecs.storage);
        if (normalized !== null && normalized !== rawSpecs.storage) {
            normalizedSpecs.storage = normalized;
            changes.push(createChange('storage', rawSpecs.storage, normalized, 'Normalizado para GB'));
        }
    }

    // Normalize RAM to number
    if (rawSpecs.ram !== undefined && typeof rawSpecs.ram === 'string') {
        const normalized = normalizeStorageGb(rawSpecs.ram);
        if (normalized !== null) {
            normalizedSpecs.ram = normalized;
            changes.push(createChange('ram', rawSpecs.ram, normalized, 'Normalizado para GB'));
        }
    }

    // Boolean coercion
    for (const field of ['hasTouchscreen', 'hasBacklitKeyboard', 'hasThunderbolt']) {
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
