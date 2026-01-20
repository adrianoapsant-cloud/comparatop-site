/**
 * @file index.ts
 * @description Export all HMUM category configurations
 * 
 * 10 priority categories implemented:
 * - Smart TV
 * - Robô Aspirador
 * - Geladeira
 * - Ar-Condicionado
 * - Lavadora
 * - Notebook
 * - Smartphone
 * - Monitor
 * - Fone de Ouvido
 * - Cafeteira
 */

import { ROBO_ASPIRADOR_CONFIG } from './robo-aspirador';
import { SMART_TV_CONFIG } from './smart-tv';
import { GELADEIRA_CONFIG } from './geladeira';
import { AR_CONDICIONADO_CONFIG } from './ar-condicionado';
import { LAVADORA_CONFIG } from './lavadora';
import { NOTEBOOK_CONFIG } from './notebook';
import { SMARTPHONE_CONFIG } from './smartphone';
import { MONITOR_CONFIG } from './monitor';
import { FONE_OUVIDO_CONFIG } from './fone-ouvido';
import { CAFETEIRA_CONFIG } from './cafeteira';

import type { CategoryHMUMConfig } from '../types';

// ============================================
// REGISTRY OF ALL CONFIGS
// ============================================

export const HMUM_CONFIGS: Record<string, CategoryHMUMConfig> = {
    // Entertainment
    'smart-tv': SMART_TV_CONFIG,
    'monitor': MONITOR_CONFIG,
    'fone-ouvido': FONE_OUVIDO_CONFIG,

    // Home Appliances
    'geladeira': GELADEIRA_CONFIG,
    'ar-condicionado': AR_CONDICIONADO_CONFIG,
    'lavadora': LAVADORA_CONFIG,
    'cafeteira': CAFETEIRA_CONFIG,

    // Smart Home
    'robo-aspirador': ROBO_ASPIRADOR_CONFIG,

    // Computing
    'notebook': NOTEBOOK_CONFIG,
    'smartphone': SMARTPHONE_CONFIG,
};

// ============================================
// LOOKUP FUNCTIONS
// ============================================

/**
 * Get HMUM config for a category
 * @returns Config or undefined if not found
 */
export function getHMUMConfig(categoryId: string): CategoryHMUMConfig | undefined {
    return HMUM_CONFIGS[categoryId];
}

/**
 * Check if a category has HMUM config
 */
export function hasHMUMConfig(categoryId: string): boolean {
    return categoryId in HMUM_CONFIGS;
}

/**
 * Get list of all configured category IDs
 */
export function getConfiguredCategories(): string[] {
    return Object.keys(HMUM_CONFIGS);
}

/**
 * Get count of configured categories
 */
export function getConfigCount(): number {
    return Object.keys(HMUM_CONFIGS).length;
}

// ============================================
// RE-EXPORTS
// ============================================

export {
    ROBO_ASPIRADOR_CONFIG,
    SMART_TV_CONFIG,
    GELADEIRA_CONFIG,
    AR_CONDICIONADO_CONFIG,
    LAVADORA_CONFIG,
    NOTEBOOK_CONFIG,
    SMARTPHONE_CONFIG,
    MONITOR_CONFIG,
    FONE_OUVIDO_CONFIG,
    CAFETEIRA_CONFIG,
};
