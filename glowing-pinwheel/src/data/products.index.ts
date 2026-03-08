/**
 * @file products.index.ts
 * @description Explicit registry of ALL products for baseline scripts.
 * 
 * This avoids glob dependencies and provides a stable import for scripts.
 */

// Robot Vacuum products (Modular Import)
import { ROBOT_VACUUM_PRODUCTS } from './robot-vacuum';
import type { Product } from '@/types/category';

// Re-export individually for backward compatibility if needed (or just use the array)
// Note: We are flattening the array below.

// Legacy Imports (Non-Robot)
import { electrolux_erb20_home_control_experience } from './products.entry.electrolux-erb20-home-control-experience';

/**
 * ALL_PRODUCTS - Complete registry of all products in the system.
 * Used by baseline scripts and scoring validation.
 */
export const ALL_PRODUCTS: Product[] = [
    // Robot Vacuums (Modular)
    ...ROBOT_VACUUM_PRODUCTS,

    // Fridge (1)
    electrolux_erb20_home_control_experience,
];

export default ALL_PRODUCTS;
