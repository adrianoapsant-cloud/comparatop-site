/**
 * @file robot-vacuum.ts
 * @description Normalizador para Robot Vacuum
 */

import { createChange, coerceToBoolean, type NormalizationResult } from './index';

// ============================================
// ALIASES
// ============================================

const NAVIGATION_TYPE_ALIASES: Record<string, string> = {
    'lidar': 'LiDAR',
    'LIDAR': 'LiDAR',
    'Lidar': 'LiDAR',
    'vslam': 'VSLAM',
    'VSLAM': 'VSLAM',
    'camera': 'Camera',
    'gyroscope': 'Gyroscope',
    'random': 'Random',
    'giroscópio': 'Gyroscope',
    'giroscopio': 'Gyroscope',
    'aleatório': 'Random',
    'aleatorio': 'Random',
};

const MOP_TYPE_ALIASES: Record<string, string> = {
    'rotativo': 'Rotativo',
    'rotating': 'Rotativo',
    'rotary': 'Rotativo',
    'vibration': 'Vibração',
    'vibracao': 'Vibração',
    'vibratório': 'Vibração',
    'vibratorio': 'Vibração',
    'sonic': 'Sônico',
    'sonico': 'Sônico',
    'static': 'Estático',
    'estatico': 'Estático',
    'estático': 'Estático',
    'pad': 'Estático',
};

const BRUSH_TYPE_ALIASES: Record<string, string> = {
    'rubber': 'Borracha',
    'borracha': 'Borracha',
    'silicone': 'Silicone',
    'bristle': 'Cerdas',
    'cerdas': 'Cerdas',
    'combo': 'Combo',
    'dual': 'Dual',
    'anti-tangle': 'Anti-Emaranhamento',
    'anti-emaranhamento': 'Anti-Emaranhamento',
};

// ============================================
// NORMALIZER
// ============================================

export function normalizeRobotVacuum(rawSpecs: Record<string, unknown>): NormalizationResult {
    const normalizedSpecs = { ...rawSpecs };
    const changes: NormalizationResult['changes'] = [];
    const warnings: string[] = [];

    // navigationType
    if (rawSpecs.navigationType) {
        const raw = String(rawSpecs.navigationType);
        const normalized = NAVIGATION_TYPE_ALIASES[raw] || NAVIGATION_TYPE_ALIASES[raw.toLowerCase()];
        if (normalized && normalized !== raw) {
            normalizedSpecs.navigationType = normalized;
            changes.push(createChange('navigationType', raw, normalized, 'Alias padronizado'));
        } else if (!normalized && !['LiDAR', 'VSLAM', 'Camera', 'Gyroscope', 'Random'].includes(raw)) {
            warnings.push(`navigationType: valor '${raw}' não reconhecido, mantido original`);
        }
    }

    // mopType
    if (rawSpecs.mopType) {
        const raw = String(rawSpecs.mopType);
        const normalized = MOP_TYPE_ALIASES[raw.toLowerCase()];
        if (normalized && normalized !== raw) {
            normalizedSpecs.mopType = normalized;
            changes.push(createChange('mopType', raw, normalized, 'Alias PT/EN padronizado'));
        } else if (!normalized) {
            warnings.push(`mopType: valor '${raw}' não mapeado, mantido original`);
        }
    }

    // brushType
    if (rawSpecs.brushType) {
        const raw = String(rawSpecs.brushType);
        const normalized = BRUSH_TYPE_ALIASES[raw.toLowerCase()];
        if (normalized && normalized !== raw) {
            normalizedSpecs.brushType = normalized;
            changes.push(createChange('brushType', raw, normalized, 'Alias PT/EN padronizado'));
        } else if (!normalized) {
            warnings.push(`brushType: valor '${raw}' não mapeado, mantido original`);
        }
    }

    // Boolean coercion for hasSelfEmpty, hasMop, hasSelfWash
    for (const field of ['hasSelfEmpty', 'hasAutoEmpty', 'hasMop', 'hasSelfWash']) {
        if (rawSpecs[field] !== undefined && typeof rawSpecs[field] !== 'boolean') {
            const coerced = coerceToBoolean(rawSpecs[field]);
            if (coerced !== null) {
                normalizedSpecs[field] = coerced;
                changes.push(createChange(field, rawSpecs[field], coerced, 'Boolean coercion'));
            }
        }
    }

    // Unify hasAutoEmpty -> hasSelfEmpty
    if (normalizedSpecs.hasAutoEmpty !== undefined && normalizedSpecs.hasSelfEmpty === undefined) {
        normalizedSpecs.hasSelfEmpty = normalizedSpecs.hasAutoEmpty;
        changes.push(createChange('hasSelfEmpty', undefined, normalizedSpecs.hasAutoEmpty, 'Alias hasAutoEmpty -> hasSelfEmpty'));
    }

    return { normalizedSpecs, changes, warnings };
}
