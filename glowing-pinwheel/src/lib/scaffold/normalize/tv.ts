/**
 * @file tv.ts
 * @description Normalizador para Smart TV
 */

import { createChange, coerceToBoolean, type NormalizationResult } from './index';

// ============================================
// ALIASES
// ============================================

const PANEL_TYPE_ALIASES: Record<string, string> = {
    'miniled': 'Mini-LED',
    'mini-led': 'Mini-LED',
    'mini led': 'Mini-LED',
    'MiniLED': 'Mini-LED',
    'Mini LED': 'Mini-LED',
    'neo qled': 'Neo QLED',
    'neoqled': 'Neo QLED',
    'Neo QLED': 'Neo QLED',
    'qled': 'QLED',
    'QLED': 'QLED',
    'oled': 'OLED',
    'OLED': 'OLED',
    'led': 'LED',
    'LED': 'LED',
    'lcd': 'LCD',
    'LCD': 'LCD',
    'nanocell': 'NanoCell',
    'NanoCell': 'NanoCell',
    'Nano Cell': 'NanoCell',
    'quantum dot': 'Quantum Dot',
    'quantumdot': 'Quantum Dot',
    'qd-oled': 'QD-OLED',
    'qdoled': 'QD-OLED',
    'QD-OLED': 'QD-OLED',
};

const RESOLUTION_ALIASES: Record<string, string> = {
    '3840x2160': '4K',
    '3840 x 2160': '4K',
    '4k': '4K',
    '4K': '4K',
    'uhd': '4K',
    'UHD': '4K',
    'ultra hd': '4K',
    'Ultra HD': '4K',
    '7680x4320': '8K',
    '7680 x 4320': '8K',
    '8k': '8K',
    '8K': '8K',
    '1920x1080': 'Full HD',
    '1920 x 1080': 'Full HD',
    'full hd': 'Full HD',
    'fullhd': 'Full HD',
    'FHD': 'Full HD',
    '1080p': 'Full HD',
    '2560x1440': 'QHD',
    '1440p': 'QHD',
    'qhd': 'QHD',
};

// ============================================
// NORMALIZER
// ============================================

export function normalizeTV(rawSpecs: Record<string, unknown>): NormalizationResult {
    const normalizedSpecs = { ...rawSpecs };
    const changes: NormalizationResult['changes'] = [];
    const warnings: string[] = [];

    // panelType
    if (rawSpecs.panelType) {
        const raw = String(rawSpecs.panelType);
        const normalized = PANEL_TYPE_ALIASES[raw] || PANEL_TYPE_ALIASES[raw.toLowerCase()];
        if (normalized && normalized !== raw) {
            normalizedSpecs.panelType = normalized;
            changes.push(createChange('panelType', raw, normalized, 'Alias padronizado'));
        }
    }

    // resolution
    if (rawSpecs.resolution) {
        const raw = String(rawSpecs.resolution);
        const normalized = RESOLUTION_ALIASES[raw] || RESOLUTION_ALIASES[raw.toLowerCase()];
        if (normalized && normalized !== raw) {
            normalizedSpecs.resolution = normalized;
            changes.push(createChange('resolution', raw, normalized, 'Resolução normalizada'));
        }
    }

    // Boolean coercion for hasVRR, hasALLM, hasDolbyVision, hasHDR10Plus
    for (const field of ['hasVRR', 'hasALLM', 'hasDolbyVision', 'hasHDR10Plus']) {
        if (rawSpecs[field] !== undefined && typeof rawSpecs[field] !== 'boolean') {
            const coerced = coerceToBoolean(rawSpecs[field]);
            if (coerced !== null) {
                normalizedSpecs[field] = coerced;
                changes.push(createChange(field, rawSpecs[field], coerced, 'Boolean coercion'));
            }
        }
    }

    // Normalize refreshRate to number
    if (rawSpecs.refreshRate && typeof rawSpecs.refreshRate === 'string') {
        const match = String(rawSpecs.refreshRate).match(/(\d+)/);
        if (match) {
            const normalized = parseInt(match[1], 10);
            normalizedSpecs.refreshRate = normalized;
            changes.push(createChange('refreshRate', rawSpecs.refreshRate, normalized, 'Extraído número'));
        }
    }

    return { normalizedSpecs, changes, warnings };
}
