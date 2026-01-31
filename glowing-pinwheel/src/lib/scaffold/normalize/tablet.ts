/**
 * @file tablet.ts
 * @description Normalizador para Tablet
 */

import { createChange, coerceToBoolean, type NormalizationResult } from './index';
import { normalizeStorageGb, normalizeInches, normalizeBatteryMah } from './numbers';

export function normalizeTablet(rawSpecs: Record<string, unknown>): NormalizationResult {
    const normalizedSpecs = { ...rawSpecs };
    const changes: NormalizationResult['changes'] = [];
    const warnings: string[] = [];

    // Normalize storage
    if (rawSpecs.storage !== undefined) {
        const normalized = normalizeStorageGb(rawSpecs.storage);
        if (normalized !== null && normalized !== rawSpecs.storage) {
            normalizedSpecs.storage = normalized;
            changes.push(createChange('storage', rawSpecs.storage, normalized, 'Normalizado para GB'));
        }
    }

    // Normalize displaySize
    if (rawSpecs.displaySize !== undefined) {
        const normalized = normalizeInches(rawSpecs.displaySize);
        if (normalized !== null && normalized !== rawSpecs.displaySize) {
            normalizedSpecs.displaySize = normalized;
            changes.push(createChange('displaySize', rawSpecs.displaySize, normalized, 'Polegadas normalizadas'));
        }
    }

    // Normalize battery
    if (rawSpecs.battery !== undefined) {
        const normalized = normalizeBatteryMah(rawSpecs.battery);
        if (normalized !== null && normalized !== rawSpecs.battery) {
            normalizedSpecs.battery = normalized;
            changes.push(createChange('battery', rawSpecs.battery, normalized, 'mAh normalizado'));
        }
    }

    // Boolean coercion
    for (const field of ['hasPenSupport', 'hasLte', 'hasFaceId']) {
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
