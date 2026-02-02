/**
 * @file products.index.ts
 * @description Explicit registry of ALL products for baseline scripts.
 * 
 * This avoids glob dependencies and provides a stable import for scripts.
 */

// Robot Vacuum products
import { eufy_x10_pro_omni } from './products.entry.eufy-x10-pro-omni';
import { eufy_omni_c20 } from './products.entry.eufy-omni-c20';
import { ezs_e10 } from './products.entry.ezs-e10';
import { kabum_smart_700 } from './products.entry.kabum-smart-700';
import { liectroux_l200_robo_aspirador_3em1_app_alexa_google } from './products.entry.liectroux-l200-robo-aspirador-3em1-app-alexa-google';
import { liectroux_xr500_pro } from './products.entry.liectroux-xr500-pro';
import { product as philco_pas26p } from './products.entry.philco-pas26p';
import { roborock_q7_l5 } from './products.entry.roborock-q7-l5';
import { samsung_vr5000rm } from './products.entry.samsung-vr5000rm';
import { wap_robot_w400 } from './products.entry.wap-robot-w400';
import { wap_robot_w90 } from './products.entry.wap-robot-w90';
import { wkjwqwhy_a6s } from './products.entry.wkjwqwhy-a6s';
import { xiaomi_robot_vacuum_s20_plus_white } from './products.entry.xiaomi-robot-vacuum-s20-plus-white';
import { xiaomi_robot_vacuum_s40c } from './products.entry.xiaomi-robot-vacuum-s40c';
import { xiaomi_robot_vacuum_x20_pro } from './products.entry.xiaomi-robot-vacuum-x20-pro';
import { xiaomi_robot_x10 } from './products.entry.xiaomi-robot-x10';

// Fridge products
import { electrolux_erb20_home_control_experience } from './products.entry.electrolux-erb20-home-control-experience';

import type { Product } from '@/types/category';

/**
 * ALL_PRODUCTS - Complete registry of all products in the system.
 * Used by baseline scripts and scoring validation.
 */
export const ALL_PRODUCTS: Product[] = [
    // Robot Vacuums (16)
    eufy_x10_pro_omni,
    eufy_omni_c20,
    ezs_e10,
    kabum_smart_700,
    liectroux_l200_robo_aspirador_3em1_app_alexa_google,
    liectroux_xr500_pro,
    philco_pas26p as unknown as Product,
    roborock_q7_l5,
    samsung_vr5000rm,
    wap_robot_w400,
    wap_robot_w90,
    wkjwqwhy_a6s,
    xiaomi_robot_vacuum_s20_plus_white,
    xiaomi_robot_vacuum_s40c,
    xiaomi_robot_vacuum_x20_pro,
    xiaomi_robot_x10,
    // Fridge (1)
    electrolux_erb20_home_control_experience,
];

export default ALL_PRODUCTS;
