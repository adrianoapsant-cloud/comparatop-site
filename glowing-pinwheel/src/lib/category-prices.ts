/**
 * Category Price Statistics - Dynamic Pricing for Scoring
 * 
 * @description Calculates real-time price statistics for each category
 * to enable dynamic VS (Value Score) calculation.
 */

import { ALL_PRODUCTS, getProductsByCategory } from '@/data/products';

export interface CategoryPriceStats {
    categoryId: string;
    count: number;
    min: number;
    max: number;
    median: number;
    average: number;
}

/**
 * Calculate median of an array of numbers
 */
function calculateMedian(arr: number[]): number {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
        ? sorted[mid]
        : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Calculate average of an array of numbers
 */
function calculateAverage(arr: number[]): number {
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// Cache for price statistics to avoid recalculating
let cachedStats: Map<string, CategoryPriceStats> | null = null;

/**
 * Get price statistics for a specific category
 */
export function getCategoryPriceStats(categoryId: string): CategoryPriceStats {
    // Use cached stats if available
    if (cachedStats?.has(categoryId)) {
        return cachedStats.get(categoryId)!;
    }

    // Calculate stats
    const products = getProductsByCategory(categoryId);
    const prices = products.map(p => p.price).filter(p => p > 0);

    const stats: CategoryPriceStats = {
        categoryId,
        count: prices.length,
        min: prices.length > 0 ? Math.min(...prices) : 0,
        max: prices.length > 0 ? Math.max(...prices) : 10000,
        median: calculateMedian(prices),
        average: calculateAverage(prices),
    };

    // Initialize cache if needed
    if (!cachedStats) {
        cachedStats = new Map();
    }
    cachedStats.set(categoryId, stats);

    return stats;
}

/**
 * Get the dynamic reference price for VS calculation
 * 
 * Uses the MAX price in the category as reference.
 * This means:
 * - Product at max price → factor 0 (no bonus)
 * - Product at min price → factor approaching 1 (max bonus)
 * 
 * With a 10% buffer above max to avoid 0 factors for the most expensive product.
 */
export function getDynamicReferencePrice(categoryId: string): number {
    const stats = getCategoryPriceStats(categoryId);

    // Add 10% buffer above max to give even the most expensive product some factor
    // This prevents the most expensive product from getting a 0 score
    return Math.round(stats.max * 1.1);
}

/**
 * Get all category price statistics
 */
export function getAllCategoryPriceStats(): CategoryPriceStats[] {
    // Get unique category IDs from products
    const categoryIds = [...new Set(ALL_PRODUCTS.map(p => p.categoryId))];
    return categoryIds.map(id => getCategoryPriceStats(id));
}

/**
 * Clear the cache (useful for testing or when products are updated)
 */
export function clearPriceStatsCache(): void {
    cachedStats = null;
}
