/**
 * @file soundbar.ts
 * @description Normalizador para Soundbar
 */

import { createChange, coerceToBoolean, type NormalizationResult } from './index';
import { parseNumberLoose } from './numbers';

export function normalizeSoundbar(rawSpecs: Record<string, unknown>): NormalizationResult {
    const normalizedSpecs = { ...rawSpecs };
    const changes: NormalizationResult['changes'] = [];
    const warnings: string[] = [];

    // Normalize watts
    if (rawSpecs.watts !== undefined && typeof rawSpecs.watts === 'string') {
        const normalized = parseNumberLoose(rawSpecs.watts);
        if (normalized !== null) {
            normalizedSpecs.watts = normalized;
            changes.push(createChange('watts', rawSpecs.watts, normalized, 'Extraído número'));
        }
    }

    // Normalize channels (ex: "2.1" stays as string)

    // Boolean coercion
    for (const field of ['hasDolbyAtmos', 'hasDts', 'hasSubwoofer', 'hasHdmiArc', 'hasHdmiEarc', 'hasBluetooth', 'hasWifi', 'hasVoiceAssistant']) {
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
