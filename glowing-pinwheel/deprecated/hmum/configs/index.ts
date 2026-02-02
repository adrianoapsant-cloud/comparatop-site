/**
 * @file index.ts
 * @description Export all HMUM category configurations
 * 
 * P18: Added alias layer to resolve canonical categoryIds (from RAW_CATEGORIES)
 * to HMUM config slugs. This allows incremental migration without breaking existing code.
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
// P18 Batch 01 - New configs
import { WASHER_DRYER_CONFIG } from './washer_dryer';
import { STOVE_CONFIG } from './stove';
import { MICROWAVE_CONFIG } from './microwave';
// P18 Batch 02 - New configs
import { FREEZER_CONFIG } from './freezer';
import { DISHWASHER_CONFIG } from './dishwasher';
import { AIR_FRYER_CONFIG } from './air_fryer';
// P18 Batch 03 - New configs
import { TABLET_CONFIG } from './tablet';
import { BLUETOOTH_SPEAKER_CONFIG } from './bluetooth_speaker';
import { CONSOLE_CONFIG } from './console';
// P18 Batch 04 - New configs
import { KEYBOARD_CONFIG } from './keyboard';
import { SMARTWATCH_CONFIG } from './smartwatch';
import { ROUTER_CONFIG } from './router';
// P18 Batch 05 - New configs
import { SSD_CONFIG } from './ssd';
import { UPS_CONFIG } from './ups';
import { SECURITY_CAMERA_CONFIG } from './security_camera';
// P18 Batch 06 - New configs
import { SMART_LOCK_CONFIG } from './smart_lock';
import { FAN_CONFIG } from './fan';
import { STICK_VACUUM_CONFIG } from './stick_vacuum';
// P18 Batch 07 - New configs
import { CHAIR_CONFIG } from './chair';
import { GAMEPAD_CONFIG } from './gamepad';
// P18 Batch 08 - New configs
import { PROJECTOR_CONFIG } from './projector';
import { TVBOX_CONFIG } from './tvbox';
import { HEADSET_GAMER_CONFIG } from './headset_gamer';
// P18 Batch 09 - New configs
import { TWS_CONFIG } from './tws';
import { SOUNDBAR_CONFIG } from './soundbar';
import { CPU_CONFIG } from './cpu';
// P18 Batch 10 - New configs
import { GPU_CONFIG } from './gpu';
import { RAM_CONFIG } from './ram';
import { MOTHERBOARD_CONFIG } from './motherboard';
// P18 Batch 11 - New configs
import { PSU_CONFIG } from './psu';
import { CASE_CONFIG } from './case';
import { MINIBAR_CONFIG } from './minibar';
// P18 Batch 12 - New configs
import { WINE_COOLER_CONFIG } from './wine_cooler';
import { POWER_STRIP_CONFIG } from './power_strip';
import { RANGE_HOOD_CONFIG } from './range_hood';
// P18 Batch 13 - New configs
import { WATER_PURIFIER_CONFIG } from './water_purifier';
import { BUILTIN_OVEN_CONFIG } from './builtin_oven';
import { ESPRESSO_CONFIG } from './espresso';
// P18 Batch 14 - FINAL configs
import { MIXER_CONFIG } from './mixer';
import { PRINTER_CONFIG } from './printer';
import { CAMERA_CONFIG } from './camera';
import { TIRE_CONFIG } from './tire';
import { CAR_BATTERY_CONFIG } from './car_battery';
// P18 Closeout - Gap configs
import { PRESSURE_WASHER_CONFIG } from './pressure_washer';
import { DRILL_CONFIG } from './drill';

import type { CategoryHMUMConfig } from '../types';

// ============================================
// REGISTRY OF ALL CONFIGS (by slug/legacy key)
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

    // P18 Batch 01 - New configs (using canonical categoryIds)
    'washer_dryer': WASHER_DRYER_CONFIG,
    'stove': STOVE_CONFIG,
    'microwave': MICROWAVE_CONFIG,

    // P18 Batch 02 - New configs (using canonical categoryIds)
    'freezer': FREEZER_CONFIG,
    'dishwasher': DISHWASHER_CONFIG,
    'air_fryer': AIR_FRYER_CONFIG,

    // P18 Batch 03 - New configs (using canonical categoryIds)
    'tablet': TABLET_CONFIG,
    'bluetooth_speaker': BLUETOOTH_SPEAKER_CONFIG,
    'console': CONSOLE_CONFIG,

    // P18 Batch 04 - New configs (using canonical categoryIds)
    'keyboard': KEYBOARD_CONFIG,
    'smartwatch': SMARTWATCH_CONFIG,
    'router': ROUTER_CONFIG,

    // P18 Batch 05 - New configs (using canonical categoryIds)
    'ssd': SSD_CONFIG,
    'ups': UPS_CONFIG,
    'security_camera': SECURITY_CAMERA_CONFIG,

    // P18 Batch 06 - New configs (using canonical categoryIds)
    'smart_lock': SMART_LOCK_CONFIG,
    'fan': FAN_CONFIG,
    'stick_vacuum': STICK_VACUUM_CONFIG,

    // P18 Batch 07 - New configs (using canonical categoryIds)
    'chair': CHAIR_CONFIG,
    'gamepad': GAMEPAD_CONFIG,

    // P18 Batch 08 - New configs (using canonical categoryIds)
    'projector': PROJECTOR_CONFIG,
    'tvbox': TVBOX_CONFIG,
    'headset_gamer': HEADSET_GAMER_CONFIG,

    // P18 Batch 09 - New configs (using canonical categoryIds)
    'tws': TWS_CONFIG,
    'soundbar': SOUNDBAR_CONFIG,
    'cpu': CPU_CONFIG,

    // P18 Batch 10 - New configs (using canonical categoryIds)
    'gpu': GPU_CONFIG,
    'ram': RAM_CONFIG,
    'motherboard': MOTHERBOARD_CONFIG,

    // P18 Batch 11 - New configs (using canonical categoryIds)
    'psu': PSU_CONFIG,
    'case': CASE_CONFIG,
    'minibar': MINIBAR_CONFIG,

    // P18 Batch 12 - New configs (using canonical categoryIds)
    'wine_cooler': WINE_COOLER_CONFIG,
    'power_strip': POWER_STRIP_CONFIG,
    'range_hood': RANGE_HOOD_CONFIG,

    // P18 Batch 13 - New configs (using canonical categoryIds)
    'water_purifier': WATER_PURIFIER_CONFIG,
    'builtin_oven': BUILTIN_OVEN_CONFIG,
    'espresso': ESPRESSO_CONFIG,

    // P18 Batch 14 - FINAL configs (using canonical categoryIds)
    'mixer': MIXER_CONFIG,
    'printer': PRINTER_CONFIG,
    'camera': CAMERA_CONFIG,
    'tire': TIRE_CONFIG,
    'car_battery': CAR_BATTERY_CONFIG,

    // P18 Closeout - Gap configs
    'pressure_washer': PRESSURE_WASHER_CONFIG,
    'drill': DRILL_CONFIG,
};

// ============================================
// P18: ALIAS LAYER - Canonical categoryId → HMUM slug
// Maps RAW_CATEGORIES categoryIds to HMUM config slugs
// ============================================

export const HMUM_CONFIG_ALIASES: Record<string, string> = {
    // Canonical categoryId → HMUM legacy slug (PT-BR configs)
    // P18 Closeout: Removed obsolete aliases for espresso/tws (direct configs exist)
    'robot-vacuum': 'robo-aspirador',
    'tv': 'smart-tv',
    'fridge': 'geladeira',
    'air_conditioner': 'ar-condicionado',
    'washer': 'lavadora',
    'laptop': 'notebook',
    // 1:1 mappings (exist with same key in both)
    'monitor': 'monitor',
    'smartphone': 'smartphone',
};

// ============================================
// LOOKUP FUNCTIONS
// ============================================

/**
 * P18: Get HMUM config for a category using canonical categoryId
 * Resolves via alias layer if direct key not found
 * @param categoryId - The canonical categoryId from RAW_CATEGORIES/products.ts
 * @returns Config or undefined if not found
 */
export function getHmumConfigForCategory(categoryId: string): CategoryHMUMConfig | undefined {
    // 1. Try direct lookup (for new configs using canonical IDs)
    if (categoryId in HMUM_CONFIGS) {
        return HMUM_CONFIGS[categoryId];
    }

    // 2. Try alias resolution (canonical → legacy slug)
    const aliasedSlug = HMUM_CONFIG_ALIASES[categoryId];
    if (aliasedSlug && aliasedSlug in HMUM_CONFIGS) {
        return HMUM_CONFIGS[aliasedSlug];
    }

    // 3. Not found
    return undefined;
}

/**
 * P18: Check if a category has HMUM config (direct or via alias)
 */
export function hasHmumConfigForCategory(categoryId: string): boolean {
    return getHmumConfigForCategory(categoryId) !== undefined;
}

/**
 * @deprecated Use getHmumConfigForCategory for canonical categoryId support
 * Get HMUM config for a category (legacy - direct key lookup only)
 * @returns Config or undefined if not found
 */
export function getHMUMConfig(categoryId: string): CategoryHMUMConfig | undefined {
    return HMUM_CONFIGS[categoryId];
}

/**
 * @deprecated Use hasHmumConfigForCategory for canonical categoryId support
 * Check if a category has HMUM config (legacy - direct key only)
 */
export function hasHMUMConfig(categoryId: string): boolean {
    return categoryId in HMUM_CONFIGS;
}

/**
 * Get list of all configured category IDs (slugs)
 */
export function getConfiguredCategories(): string[] {
    return Object.keys(HMUM_CONFIGS);
}

/**
 * Get list of all canonical categoryIds that have HMUM configs
 */
export function getCanonicalCategoriesWithConfig(): string[] {
    return Object.keys(HMUM_CONFIG_ALIASES).filter(
        categoryId => hasHmumConfigForCategory(categoryId)
    );
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
    // P18 Batch 01
    WASHER_DRYER_CONFIG,
    STOVE_CONFIG,
    MICROWAVE_CONFIG,
};
