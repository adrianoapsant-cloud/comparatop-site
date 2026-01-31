/**
 * @file index.ts
 * @description Category Playbooks Registry - 53 categorias (52 de "10 dores.txt" + keyboard)
 * 
 * Normalizações aplicadas:
 * - bluetooth_speaker: 122% → 100%
 * - tablet: 77% → 100%
 * - air_fryer: 103% → 100%
 */

// Type exports
export { TV_PLAYBOOK, type CategoryPlaybook, type CriterionPlaybook } from './tv';

// Playbook exports (52 categorias)
export { SMARTPHONE_PLAYBOOK } from './smartphone';
export { FRIDGE_PLAYBOOK } from './fridge';
export { LAPTOP_PLAYBOOK } from './laptop';
export { AIR_CONDITIONER_PLAYBOOK } from './air_conditioner';
export { WASHER_PLAYBOOK } from './washer';
export { SSD_PLAYBOOK } from './ssd';
export { WATER_PURIFIER_PLAYBOOK } from './water_purifier';
export { RANGE_HOOD_PLAYBOOK } from './range_hood';
export { WASHER_DRYER_PLAYBOOK } from './washer_dryer';
export { STOVE_PLAYBOOK } from './stove';
export { MICROWAVE_PLAYBOOK } from './microwave';
export { FREEZER_PLAYBOOK } from './freezer';
export { DISHWASHER_PLAYBOOK } from './dishwasher';
export { MONITOR_PLAYBOOK } from './monitor';
export { CONSOLE_PLAYBOOK } from './console';
export { ROBOT_VACUUM_PLAYBOOK } from './robot_vacuum';
export { SOUNDBAR_PLAYBOOK } from './soundbar';
export { TWS_PLAYBOOK } from './tws';
export { HEADSET_GAMER_PLAYBOOK } from './headset_gamer';
export { BLUETOOTH_SPEAKER_PLAYBOOK } from './bluetooth_speaker';
export { TABLET_PLAYBOOK } from './tablet';
export { SMARTWATCH_PLAYBOOK } from './smartwatch';
export { ROUTER_PLAYBOOK } from './router';
export { PRINTER_PLAYBOOK } from './printer';
export { UPS_PLAYBOOK } from './ups';
export { CAMERA_PLAYBOOK } from './camera';
export { SECURITY_CAMERA_PLAYBOOK } from './security_camera';
export { SMART_LOCK_PLAYBOOK } from './smart_lock';
export { WINE_COOLER_PLAYBOOK } from './wine_cooler';
export { AIR_FRYER_PLAYBOOK } from './air_fryer';
export { ESPRESSO_PLAYBOOK } from './espresso';
export { MIXER_PLAYBOOK } from './mixer';
export { MOTHERBOARD_PLAYBOOK } from './motherboard';
export { CPU_PLAYBOOK } from './cpu';
export { RAM_PLAYBOOK } from './ram';
export { PSU_PLAYBOOK } from './psu';
export { CASE_PLAYBOOK } from './case';
export { GAMEPAD_PLAYBOOK } from './gamepad';
export { POWER_STRIP_PLAYBOOK } from './power_strip';
export { TIRE_PLAYBOOK } from './tire';
export { CAR_BATTERY_PLAYBOOK } from './car_battery';
export { FAN_PLAYBOOK } from './fan';
export { PRESSURE_WASHER_PLAYBOOK } from './pressure_washer';
export { DRILL_PLAYBOOK } from './drill';
export { CHAIR_PLAYBOOK } from './chair';
export { GPU_PLAYBOOK } from './gpu';
export { PROJECTOR_PLAYBOOK } from './projector';
export { TVBOX_PLAYBOOK } from './tvbox';
export { MINIBAR_PLAYBOOK } from './minibar';
export { BUILTIN_OVEN_PLAYBOOK } from './builtin_oven';
export { STICK_VACUUM_PLAYBOOK } from './stick_vacuum';
export { KEYBOARD_PLAYBOOK } from './keyboard';

// Imports for Registry
import { TV_PLAYBOOK, type CategoryPlaybook } from './tv';
import { SMARTPHONE_PLAYBOOK } from './smartphone';
import { FRIDGE_PLAYBOOK } from './fridge';
import { LAPTOP_PLAYBOOK } from './laptop';
import { AIR_CONDITIONER_PLAYBOOK } from './air_conditioner';
import { WASHER_PLAYBOOK } from './washer';
import { SSD_PLAYBOOK } from './ssd';
import { WATER_PURIFIER_PLAYBOOK } from './water_purifier';
import { RANGE_HOOD_PLAYBOOK } from './range_hood';
import { WASHER_DRYER_PLAYBOOK } from './washer_dryer';
import { STOVE_PLAYBOOK } from './stove';
import { MICROWAVE_PLAYBOOK } from './microwave';
import { FREEZER_PLAYBOOK } from './freezer';
import { DISHWASHER_PLAYBOOK } from './dishwasher';
import { MONITOR_PLAYBOOK } from './monitor';
import { CONSOLE_PLAYBOOK } from './console';
import { ROBOT_VACUUM_PLAYBOOK } from './robot_vacuum';
import { SOUNDBAR_PLAYBOOK } from './soundbar';
import { TWS_PLAYBOOK } from './tws';
import { HEADSET_GAMER_PLAYBOOK } from './headset_gamer';
import { BLUETOOTH_SPEAKER_PLAYBOOK } from './bluetooth_speaker';
import { TABLET_PLAYBOOK } from './tablet';
import { SMARTWATCH_PLAYBOOK } from './smartwatch';
import { ROUTER_PLAYBOOK } from './router';
import { PRINTER_PLAYBOOK } from './printer';
import { UPS_PLAYBOOK } from './ups';
import { CAMERA_PLAYBOOK } from './camera';
import { SECURITY_CAMERA_PLAYBOOK } from './security_camera';
import { SMART_LOCK_PLAYBOOK } from './smart_lock';
import { WINE_COOLER_PLAYBOOK } from './wine_cooler';
import { AIR_FRYER_PLAYBOOK } from './air_fryer';
import { ESPRESSO_PLAYBOOK } from './espresso';
import { MIXER_PLAYBOOK } from './mixer';
import { MOTHERBOARD_PLAYBOOK } from './motherboard';
import { CPU_PLAYBOOK } from './cpu';
import { RAM_PLAYBOOK } from './ram';
import { PSU_PLAYBOOK } from './psu';
import { CASE_PLAYBOOK } from './case';
import { GAMEPAD_PLAYBOOK } from './gamepad';
import { POWER_STRIP_PLAYBOOK } from './power_strip';
import { TIRE_PLAYBOOK } from './tire';
import { CAR_BATTERY_PLAYBOOK } from './car_battery';
import { FAN_PLAYBOOK } from './fan';
import { PRESSURE_WASHER_PLAYBOOK } from './pressure_washer';
import { DRILL_PLAYBOOK } from './drill';
import { CHAIR_PLAYBOOK } from './chair';
import { GPU_PLAYBOOK } from './gpu';
import { PROJECTOR_PLAYBOOK } from './projector';
import { TVBOX_PLAYBOOK } from './tvbox';
import { MINIBAR_PLAYBOOK } from './minibar';
import { BUILTIN_OVEN_PLAYBOOK } from './builtin_oven';
import { STICK_VACUUM_PLAYBOOK } from './stick_vacuum';
import { KEYBOARD_PLAYBOOK } from './keyboard';

export const PLAYBOOKS: Record<string, CategoryPlaybook> = {
    'tv': TV_PLAYBOOK,
    'smartphone': SMARTPHONE_PLAYBOOK,
    'fridge': FRIDGE_PLAYBOOK,
    'laptop': LAPTOP_PLAYBOOK,
    'air_conditioner': AIR_CONDITIONER_PLAYBOOK,
    'washer': WASHER_PLAYBOOK,
    'ssd': SSD_PLAYBOOK,
    'water_purifier': WATER_PURIFIER_PLAYBOOK,
    'range_hood': RANGE_HOOD_PLAYBOOK,
    'washer_dryer': WASHER_DRYER_PLAYBOOK,
    'stove': STOVE_PLAYBOOK,
    'microwave': MICROWAVE_PLAYBOOK,
    'freezer': FREEZER_PLAYBOOK,
    'dishwasher': DISHWASHER_PLAYBOOK,
    'monitor': MONITOR_PLAYBOOK,
    'console': CONSOLE_PLAYBOOK,
    'robot-vacuum': ROBOT_VACUUM_PLAYBOOK,
    'soundbar': SOUNDBAR_PLAYBOOK,
    'tws': TWS_PLAYBOOK,
    'headset_gamer': HEADSET_GAMER_PLAYBOOK,
    'bluetooth_speaker': BLUETOOTH_SPEAKER_PLAYBOOK,
    'tablet': TABLET_PLAYBOOK,
    'smartwatch': SMARTWATCH_PLAYBOOK,
    'router': ROUTER_PLAYBOOK,
    'printer': PRINTER_PLAYBOOK,
    'ups': UPS_PLAYBOOK,
    'camera': CAMERA_PLAYBOOK,
    'security_camera': SECURITY_CAMERA_PLAYBOOK,
    'smart_lock': SMART_LOCK_PLAYBOOK,
    'wine_cooler': WINE_COOLER_PLAYBOOK,
    'air_fryer': AIR_FRYER_PLAYBOOK,
    'espresso': ESPRESSO_PLAYBOOK,
    'mixer': MIXER_PLAYBOOK,
    'motherboard': MOTHERBOARD_PLAYBOOK,
    'cpu': CPU_PLAYBOOK,
    'ram': RAM_PLAYBOOK,
    'psu': PSU_PLAYBOOK,
    'case': CASE_PLAYBOOK,
    'gamepad': GAMEPAD_PLAYBOOK,
    'power_strip': POWER_STRIP_PLAYBOOK,
    'tire': TIRE_PLAYBOOK,
    'car_battery': CAR_BATTERY_PLAYBOOK,
    'fan': FAN_PLAYBOOK,
    'pressure_washer': PRESSURE_WASHER_PLAYBOOK,
    'drill': DRILL_PLAYBOOK,
    'chair': CHAIR_PLAYBOOK,
    'gpu': GPU_PLAYBOOK,
    'projector': PROJECTOR_PLAYBOOK,
    'tvbox': TVBOX_PLAYBOOK,
    'minibar': MINIBAR_PLAYBOOK,
    'builtin_oven': BUILTIN_OVEN_PLAYBOOK,
    'stick_vacuum': STICK_VACUUM_PLAYBOOK,
    'keyboard': KEYBOARD_PLAYBOOK,
};

/** Retorna o playbook para uma categoria */
export function getPlaybook(categoryId: string): CategoryPlaybook | null {
    return PLAYBOOKS[categoryId] ?? null;
}

/** Lista categorias com playbook disponível */
export function getPlaybookCategories(): string[] {
    return Object.keys(PLAYBOOKS);
}

/** Valida que os pesos de um playbook somam 100% */
export function validatePlaybookWeights(playbook: CategoryPlaybook): { valid: boolean; sum: number } {
    const sum = playbook.criteria.reduce((acc, c) => acc + c.weight, 0);
    return { valid: Math.abs(sum - 1.0) < 0.01, sum: Math.round(sum * 100) };
}

/** Total de playbooks disponíveis */
export const PLAYBOOK_COUNT = Object.keys(PLAYBOOKS).length;
