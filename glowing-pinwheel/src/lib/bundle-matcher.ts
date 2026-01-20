/**
 * Bundle Matcher - Dynamic Accessory Recommendation Engine
 * 
 * @description Automatically matches the best accessory for a product based on:
 * 1. Category compatibility
 * 2. Brand affinity (prefer same brand when beneficial)
 * 3. Product attributes (skip if product already has the feature)
 * 4. Priority scoring
 * 
 * Usage:
 * ```
 * import { getBestAccessoryForProduct } from '@/lib/bundle-matcher';
 * const accessory = getBestAccessoryForProduct(product);
 * ```
 */

import type { Product } from '@/types/category';
import { ACCESSORIES, type Accessory } from '@/data/accessories';

export interface BundleMatch {
    accessory: Accessory;
    matchReason: string;
    matchScore: number;
}

/**
 * Check if a product has an attribute that should skip this accessory
 */
function shouldSkipAccessory(product: Product, accessory: Accessory): boolean {
    if (!accessory.skipIfProductHas || accessory.skipIfProductHas.length === 0) {
        return false;
    }

    const productAttrs = product.attributes || {};
    const productSpecs = product.specs || {};
    const productTechSpecs = (product as unknown as { technicalSpecs?: Record<string, unknown> }).technicalSpecs || {};

    // Merge all attribute sources
    const allAttrs = { ...productAttrs, ...productSpecs, ...productTechSpecs };

    for (const skipRule of accessory.skipIfProductHas) {
        const attrValue = allAttrs[skipRule.attribute];

        if (attrValue === undefined) continue;

        // Check minValue rule
        if (skipRule.minValue !== undefined && typeof attrValue === 'number') {
            if (attrValue >= skipRule.minValue) {
                return true; // Skip this accessory
            }
        }

        // Check containsValue rule
        if (skipRule.containsValue !== undefined) {
            const strValue = String(attrValue).toLowerCase();
            if (strValue.includes(skipRule.containsValue.toLowerCase())) {
                return true; // Skip this accessory
            }
        }
    }

    return false;
}

/**
 * Calculate match score for an accessory with a product
 */
function calculateMatchScore(product: Product, accessory: Accessory): number {
    let score = accessory.priority;

    // Brand affinity bonus (+5 if same brand or preferred brand)
    if (accessory.preferredBrands.length > 0) {
        if (accessory.preferredBrands.includes(product.brand)) {
            score += 5;
        }
    }

    // Same brand bonus (+3)
    if (accessory.brand === product.brand) {
        score += 3;
    }

    // Price ratio consideration - prefer accessories that are 10-30% of main product price
    const priceRatio = accessory.price / product.price;
    if (priceRatio >= 0.1 && priceRatio <= 0.3) {
        score += 2; // Good price ratio bonus
    } else if (priceRatio > 0.5) {
        score -= 2; // Accessory too expensive relative to main product
    }

    return score;
}

/**
 * Get the best matching accessory for a product
 * 
 * @param product - The main product
 * @returns BundleMatch with the best accessory, or null if none found
 */
export function getBestAccessoryForProduct(product: Product): BundleMatch | null {
    // 1. Filter accessories compatible with this product's category
    const compatibleAccessories = ACCESSORIES.filter(acc =>
        acc.compatibleWithCategories.includes(product.categoryId)
    );

    if (compatibleAccessories.length === 0) {
        return null;
    }

    // 2. Filter out accessories that should be skipped
    const eligibleAccessories = compatibleAccessories.filter(acc =>
        !shouldSkipAccessory(product, acc)
    );

    if (eligibleAccessories.length === 0) {
        // Fall back to any compatible accessory if all were skipped
        const fallback = compatibleAccessories[0];
        return {
            accessory: fallback,
            matchReason: 'Acessório recomendado para a categoria',
            matchScore: fallback.priority,
        };
    }

    // 3. Calculate scores and sort
    const scoredAccessories = eligibleAccessories.map(acc => ({
        accessory: acc,
        matchScore: calculateMatchScore(product, acc),
    })).sort((a, b) => b.matchScore - a.matchScore);

    // 4. Get the best match
    const best = scoredAccessories[0];

    // 5. Generate match reason
    let matchReason = best.accessory.benefit;

    // Add brand-specific reason if applicable
    if (best.accessory.preferredBrands.includes(product.brand)) {
        matchReason = `Compatibilidade ${product.brand}: ${best.accessory.benefit}`;
    } else if (best.accessory.brand === product.brand) {
        matchReason = `Mesma marca ${product.brand}: ${best.accessory.benefit}`;
    }

    return {
        accessory: best.accessory,
        matchReason,
        matchScore: best.matchScore,
    };
}

/**
 * Get multiple accessory suggestions for a product (for upsell grids)
 * 
 * @param product - The main product  
 * @param limit - Maximum number of suggestions
 * @returns Array of BundleMatch sorted by score
 */
export function getAccessorySuggestions(product: Product, limit: number = 3): BundleMatch[] {
    const compatibleAccessories = ACCESSORIES.filter(acc =>
        acc.compatibleWithCategories.includes(product.categoryId)
    );

    const eligibleAccessories = compatibleAccessories.filter(acc =>
        !shouldSkipAccessory(product, acc)
    );

    const scoredAccessories = eligibleAccessories.map(acc => ({
        accessory: acc,
        matchReason: acc.benefit,
        matchScore: calculateMatchScore(product, acc),
    })).sort((a, b) => b.matchScore - a.matchScore);

    // Return unique accessory categories (one per type)
    const seenCategories = new Set<string>();
    const uniqueSuggestions: BundleMatch[] = [];

    for (const match of scoredAccessories) {
        if (!seenCategories.has(match.accessory.accessoryCategoryId)) {
            seenCategories.add(match.accessory.accessoryCategoryId);
            uniqueSuggestions.push(match);
        }
        if (uniqueSuggestions.length >= limit) break;
    }

    return uniqueSuggestions;
}

/**
 * Calculate bundle savings (can be customized per retailer)
 */
export function calculateBundleSavings(mainPrice: number, accessoryPrice: number): number {
    // Standard 5% bundle discount
    const bundleDiscount = 0.05;
    return Math.round((mainPrice + accessoryPrice) * bundleDiscount);
}
