/**
 * @file monitor.ts
 * @description Normalizador para Monitor
 */

import { createChange, coerceToBoolean, type NormalizationResult } from './index';
import { normalizeInches, normalizeRefreshRate } from './numbers';

const PANEL_TYPE_ALIASES: Record<string, string> = {
    'ips': 'IPS',
    'IPS': 'IPS',
    'va': 'VA',
    'VA': 'VA',
    'tn': 'TN',
    'TN': 'TN',
    'oled': 'OLED',
    'OLED': 'OLED',
    'mini-led': 'Mini-LED',
    'miniled': 'Mini-LED',
};

const RESOLUTION_ALIASES: Record<string, string> = {
    '1920x1080': 'Full HD',
    'fhd': 'Full HD',
    '2560x1440': 'QHD',
    'qhd': 'QHD',
    '1440p': 'QHD',
    '3840x2160': '4K',
    '4k': '4K',
    'uhd': '4K',
};

export function normalizeMonitor(rawSpecs: Record<string, unknown>): NormalizationResult {
    const normalizedSpecs = { ...rawSpecs };
    const changes: NormalizationResult['changes'] = [];
    const warnings: string[] = [];

    // Normalize screenSize
    if (rawSpecs.screenSize !== undefined) {
        const normalized = normalizeInches(rawSpecs.screenSize);
        if (normalized !== null && normalized !== rawSpecs.screenSize) {
            normalizedSpecs.screenSize = normalized;
            changes.push(createChange('screenSize', rawSpecs.screenSize, normalized, 'Polegadas normalizadas'));
        }
    }

    // Normalize refreshRate
    if (rawSpecs.refreshRate !== undefined) {
        const normalized = normalizeRefreshRate(rawSpecs.refreshRate);
        if (normalized !== null && normalized !== rawSpecs.refreshRate) {
            normalizedSpecs.refreshRate = normalized;
            changes.push(createChange('refreshRate', rawSpecs.refreshRate, normalized, 'Hz normalizado'));
        }
    }

    // Normalize panelType
    if (rawSpecs.panelType) {
        const raw = String(rawSpecs.panelType);
        const normalized = PANEL_TYPE_ALIASES[raw.toLowerCase()] || PANEL_TYPE_ALIASES[raw];
        if (normalized && normalized !== raw) {
            normalizedSpecs.panelType = normalized;
            changes.push(createChange('panelType', raw, normalized, 'Tipo padronizado'));
        }
    }

    // Boolean coercion
    for (const field of ['hasHdr', 'hasVrr', 'hasPivot', 'hasHeightAdjust', 'hasUsbc']) {
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
