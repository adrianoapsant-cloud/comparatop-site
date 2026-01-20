/**
 * Catalog Offers Helper
 * 
 * Extracts primary offer (purchase link) from product data.
 * Single source of truth for offer URLs.
 */

import type { Product, ProductOffer } from '@/types/category';

export interface PrimaryOffer {
    /** Primary purchase URL (affiliate preferred, fallback to direct) */
    url?: string;
    /** Store/merchant name */
    merchant?: string;
    /** Current price at this merchant */
    price?: number;
    /** Whether the product is in stock */
    inStock?: boolean;
}

/**
 * Get the primary offer for a product.
 * 
 * Priority:
 * 1. First offer with affiliateUrl
 * 2. First offer with url
 * 3. undefined if no offers
 * 
 * @param product - Product to get offer for
 * @returns Primary offer with URL, merchant, and price
 */
export function getPrimaryOffer(product: Product): PrimaryOffer {
    if (!product.offers || product.offers.length === 0) {
        return {};
    }

    // Find first offer with affiliate URL
    const affiliateOffer = product.offers.find(o => o.affiliateUrl && o.inStock !== false);
    if (affiliateOffer) {
        return {
            url: affiliateOffer.affiliateUrl,
            merchant: affiliateOffer.store,
            price: affiliateOffer.price,
            inStock: affiliateOffer.inStock
        };
    }

    // Fallback to first offer with direct URL
    const directOffer = product.offers.find(o => o.url && o.inStock !== false);
    if (directOffer) {
        return {
            url: directOffer.url,
            merchant: directOffer.store,
            price: directOffer.price,
            inStock: directOffer.inStock
        };
    }

    // No valid offers found
    return {};
}

/**
 * Get all available offers for a product (sorted by price)
 */
export function getAllOffers(product: Product): PrimaryOffer[] {
    if (!product.offers || product.offers.length === 0) {
        return [];
    }

    return product.offers
        .filter(o => o.inStock !== false && (o.affiliateUrl || o.url))
        .sort((a, b) => (a.price || 0) - (b.price || 0))
        .map(o => ({
            url: o.affiliateUrl || o.url,
            merchant: o.store,
            price: o.price,
            inStock: o.inStock
        }));
}

/**
 * Check if a product has any valid offer
 */
export function hasOffer(product: Product): boolean {
    return getPrimaryOffer(product).url !== undefined;
}
