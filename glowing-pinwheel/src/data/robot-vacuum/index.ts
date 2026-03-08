/**
 * @file src/data/robot-vacuum/index.ts
 * @description Robot Vacuum Category Module
 * Pattern: Category Module Pattern (CMP)
 */

import { electrolux_erb30 } from './products/products.entry.electrolux-erb30';
import { eufy_omni_c20 } from './products/products.entry.eufy-omni-c20';
import { eufy_x10_pro_omni } from './products/products.entry.eufy-x10-pro-omni';
import { ezs_e10 } from './products/products.entry.ezs-e10';
import { kabum_smart_700 } from './products/products.entry.kabum-smart-700';
import { liectroux_l200_robo_aspirador_3em1_app_alexa_google } from './products/products.entry.liectroux-l200-robo-aspirador-3em1-app-alexa-google';
import { liectroux_xr500_pro } from './products/products.entry.liectroux-xr500-pro';
import { product as philco_pas26p } from './products/products.entry.philco-pas26p';
import { roborock_q7_l5 } from './products/products.entry.roborock-q7-l5';
import { samsung_vr5000rm } from './products/products.entry.samsung-vr5000rm';
import { wap_robot_w400 } from './products/products.entry.wap-robot-w400';
import { wap_robot_w90 } from './products/products.entry.wap-robot-w90';
import { wkjwqwhy_a6s } from './products/products.entry.wkjwqwhy-a6s';
import { xiaomi_robot_vacuum_s20_plus_white } from './products/products.entry.xiaomi-robot-vacuum-s20-plus-white';
import { xiaomi_robot_vacuum_s40c } from './products/products.entry.xiaomi-robot-vacuum-s40c';
import { xiaomi_robot_vacuum_x20_pro } from './products/products.entry.xiaomi-robot-vacuum-x20-pro';
import { xiaomi_robot_x10 } from './products/products.entry.xiaomi-robot-x10';

import type { Product } from '@/types/category';

export const ROBOT_VACUUM_PRODUCTS: Product[] = [
    electrolux_erb30,
    eufy_x10_pro_omni,
    eufy_omni_c20,
    ezs_e10,
    kabum_smart_700,
    liectroux_l200_robo_aspirador_3em1_app_alexa_google,
    liectroux_xr500_pro,
    philco_pas26p as unknown as Product, // Cast legacy structure if needed
    roborock_q7_l5,
    samsung_vr5000rm,
    wap_robot_w400,
    wap_robot_w90,
    wkjwqwhy_a6s,
    xiaomi_robot_vacuum_s20_plus_white,
    xiaomi_robot_vacuum_s40c,
    xiaomi_robot_vacuum_x20_pro,
    xiaomi_robot_x10,
];

export default ROBOT_VACUUM_PRODUCTS;
