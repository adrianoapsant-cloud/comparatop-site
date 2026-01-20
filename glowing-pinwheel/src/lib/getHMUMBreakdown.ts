/**
 * @file getHMUMBreakdown.ts
 * @description Utility to get HMUM breakdown for product scoring display
 * 
 * Use this in ProductDetailPage to show criterion contributions.
 * 
 * @example
 * const breakdown = getHMUMBreakdown(product);
 * if (breakdown) {
 *     breakdown.breakdown.forEach(item => console.log(item.label, item.contribution));
 * }
 */

import type { Product } from '@/types/category';
import {
    calculateHMUMScore,
    hasHMUMConfig,
    getHMUMConfig,
    type HMUMResult,
    type HMUMProduct,
} from './scoring/hmum';

/**
 * Get HMUM breakdown for a product
 * 
 * @param product - The product to calculate HMUM for
 * @returns HMUMResult with score and breakdown, or null if category has no config
 */
export function getHMUMBreakdown(product: Product): HMUMResult | null {
    const categoryId = normalizeCategoryId(product.categoryId);

    if (!hasHMUMConfig(categoryId)) {
        return null;
    }

    const config = getHMUMConfig(categoryId)!;

    // Convert Product to HMUMProduct format
    // Merge specs/technicalSpecs into a flat structure for data access
    const hmumProduct: HMUMProduct = {
        id: product.id,
        scores: product.scores,
        specs: { ...(product.specs || {}), ...(product.technicalSpecs || {}) },
    };

    return calculateHMUMScore(hmumProduct, config);
}

/**
 * Get HMUM score for a product (just the number)
 * 
 * @param product - The product to get score for
 * @returns HMUM score (0-10) or null if category has no config
 */
export function getHMUMScore(product: Product): number | null {
    const result = getHMUMBreakdown(product);
    return result ? result.score : null;
}

/**
 * Check if a product has HMUM support with complete data
 * Returns true only if the category has HMUM config AND has complete spec data mapping
 */
export function hasHMUMSupport(product: Product): boolean {
    const normalized = normalizeCategoryId(product.categoryId);
    return hasHMUMConfig(normalized) && hasCategoryCompleteData(normalized);
}

/**
 * Categories with incomplete spec data mapping.
 * These categories have HMUM configs but their product data doesn't match
 * the expected spec field names (e.g., config expects 'specs.capacidade_litros'
 * but products have 'specs.capacity').
 * 
 * Until the product data is updated or the HMUM configs are remapped,
 * fallback to using product.scores instead.
 */
const CATEGORIES_WITH_INCOMPLETE_DATA = new Set([
    'geladeira',       // Products have specs.capacity, not specs.capacidade_litros
    'ar-condicionado', // Products missing btus specs mapping
    'lavadora',        // Products missing capacity specs
    'robo-aspirador',  // Products have different field names (navigationType vs navegacao_tech)
    'smartphone',      // New category - use product.scores until HMUM config is created
    'smartwatch',      // New category - use product.scores until HMUM config is created
]);

/**
 * Normalize category ID to match HMUM config keys
 * Maps various category ID formats to the canonical HMUM config ID
 */
function normalizeCategoryId(categoryId: string): string {
    const mappings: Record<string, string> = {
        // TV variants
        'tv': 'smart-tv',
        'smart-tv': 'smart-tv',
        'smart_tv': 'smart-tv',
        'television': 'smart-tv',

        // Refrigerator variants
        'fridge': 'geladeira',
        'geladeira': 'geladeira',
        'refrigerador': 'geladeira',
        'refrigerator': 'geladeira',

        // Air Conditioner variants
        'ac': 'ar-condicionado',
        'ar-condicionado': 'ar-condicionado',
        'ar_condicionado': 'ar-condicionado',
        'air-conditioner': 'ar-condicionado',
        'air_conditioner': 'ar-condicionado',

        // Washer variants
        'washer': 'lavadora',
        'lavadora': 'lavadora',
        'washing-machine': 'lavadora',
        'maquina-lavar': 'lavadora',

        // Robot vacuum variants
        'robo-aspirador': 'robo-aspirador',
        'robot-vacuum': 'robo-aspirador',
        'aspirador-robo': 'robo-aspirador',

        // Notebook variants
        'notebook': 'notebook',
        'laptop': 'notebook',

        // Smartphone variants
        'smartphone': 'smartphone',
        'celular': 'smartphone',
        'phone': 'smartphone',

        // Monitor variants
        'monitor': 'monitor',

        // Headphones variants
        'fone-ouvido': 'fone-ouvido',
        'headphones': 'fone-ouvido',
        'fone': 'fone-ouvido',

        // Coffee maker variants
        'cafeteira': 'cafeteira',
        'coffee-maker': 'cafeteira',
    };

    return mappings[categoryId.toLowerCase()] || categoryId;
}

/**
 * Check if a category has complete spec data for HMUM scoring.
 * Returns false for categories with known incomplete data mappings.
 */
function hasCategoryCompleteData(categoryId: string): boolean {
    const normalized = normalizeCategoryId(categoryId);
    return !CATEGORIES_WITH_INCOMPLETE_DATA.has(normalized);
}

export { type HMUMResult };
