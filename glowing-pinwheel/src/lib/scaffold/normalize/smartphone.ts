/**
 * @file smartphone.ts
 * @description Normalizador para Smartphone
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
    'dynamic amoled': 'Dynamic AMOLED',
    'oled': 'OLED',
    'OLED': 'OLED',
    'lcd': 'LCD',
    'LCD': 'LCD',
    'ips': 'IPS LCD',
    'ips lcd': 'IPS LCD',
    'ltpo': 'LTPO AMOLED',
    'ltpo amoled': 'LTPO AMOLED',
    'retina': 'Retina',
    'super retina': 'Super Retina XDR',
};

const CERTIFICATION_ALIASES: Record<string, string> = {
    'ip68': 'IP68',
    'IP68': 'IP68',
    'ip67': 'IP67',
    'IP67': 'IP67',
    'ip65': 'IP65',
    'IP65': 'IP65',
    'ip54': 'IP54',
    'IP54': 'IP54',
    'splash': 'Splash Resistant',
    'splash resistant': 'Splash Resistant',
    'nenhuma': 'Nenhuma',
    'none': 'Nenhuma',
};

// ============================================
// NORMALIZER
// ============================================

export function normalizeSmartphone(rawSpecs: Record<string, unknown>): NormalizationResult {
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

    // certification (IP68, etc.)
    if (rawSpecs.certification) {
        const raw = String(rawSpecs.certification);
        const normalized = CERTIFICATION_ALIASES[raw.toLowerCase()];
        if (normalized && normalized !== raw) {
            normalizedSpecs.certification = normalized;
            changes.push(createChange('certification', raw, normalized, 'Certificação padronizada'));
        }
    }

    // Boolean coercion
    for (const field of ['nfc', 'esim', 'fiveG', 'wirelessCharging', 'hasMicroSD']) {
        if (rawSpecs[field] !== undefined && typeof rawSpecs[field] !== 'boolean') {
            const coerced = coerceToBoolean(rawSpecs[field]);
            if (coerced !== null) {
                normalizedSpecs[field] = coerced;
                changes.push(createChange(field, rawSpecs[field], coerced, 'Boolean coercion'));
            }
        }
    }

    // Normalize storage/ram to numbers
    for (const field of ['storage', 'ram', 'battery', 'mainCamera']) {
        if (rawSpecs[field] && typeof rawSpecs[field] === 'string') {
            const match = String(rawSpecs[field]).match(/(\d+)/);
            if (match) {
                const normalized = parseInt(match[1], 10);
                normalizedSpecs[field] = normalized;
                changes.push(createChange(field, rawSpecs[field], normalized, 'Extraído número'));
            }
        }
    }

    return { normalizedSpecs, changes, warnings };
}
