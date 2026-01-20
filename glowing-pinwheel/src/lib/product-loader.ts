/**
 * Product Extended Data Loader
 * 
 * Loads rich PDP data from JSON files in /src/data/mocks/
 * Falls back gracefully when no extended data exists
 */

import type { ProductData } from '@/config/product-json-schema';

// Cache for loaded extended data
const extendedDataCache = new Map<string, ProductData | null>();

/**
 * Load extended product data from JSON file
 * Returns null if no extended data exists for this product
 */
export async function getProductExtendedData(productId: string): Promise<ProductData | null> {
    // Check cache first
    if (extendedDataCache.has(productId)) {
        return extendedDataCache.get(productId) ?? null;
    }

    try {
        // Dynamic import of JSON file
        const data = await import(`@/data/mocks/${productId}.json`);
        const extendedData = data.default as ProductData;

        // Cache the result
        extendedDataCache.set(productId, extendedData);
        return extendedData;
    } catch {
        // No extended data for this product - cache null to avoid repeated attempts
        extendedDataCache.set(productId, null);
        return null;
    }
}

/**
 * Synchronous getter for SSR/SSG - uses require for static analysis
 * Only use for build-time data fetching
 */
export function getProductExtendedDataSync(productId: string): ProductData | null {
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const data = require(`@/data/mocks/${productId}.json`);
        return data as ProductData;
    } catch {
        return null;
    }
}

/**
 * Check if extended data exists for a product
 */
export function hasExtendedData(productId: string): boolean {
    return extendedDataCache.has(productId) && extendedDataCache.get(productId) !== null;
}

/**
 * Preload extended data for multiple products (useful for SSG)
 */
export async function preloadExtendedData(productIds: string[]): Promise<void> {
    await Promise.all(productIds.map(id => getProductExtendedData(id)));
}

/**
 * Map of available extended data files
 * Update this when adding new product JSONs
 * 
 * NOTE: Products not in this list will use automatic generators
 * from src/lib/pdp-generators.ts for auditVerdict and simulators
 */
export const AVAILABLE_EXTENDED_DATA = [
    'lg-oled-c3-55',
    'lg-c3-65',
    'wap-robot-w400',
    'roborock-q7-l5',  // GOLD STANDARD - Reference for all new products
    'xiaomi-robot-x10',
    'samsung-galaxy-watch7-44mm-lte',
    'samsung-galaxy-a56-5g',
    // Add more product IDs as JSONs are created
] as const;

export type AvailableExtendedProduct = typeof AVAILABLE_EXTENDED_DATA[number];
