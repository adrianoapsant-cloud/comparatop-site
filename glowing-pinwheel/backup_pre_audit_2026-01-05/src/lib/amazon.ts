/**
 * Amazon Affiliate Utilities
 * 
 * @description Functions for generating Amazon affiliate links and cart URLs.
 * Uses Amazon's remote cart add functionality (no API required).
 */

// ============================================
// CART URL GENERATOR
// ============================================

interface CartItem {
    /** Amazon Standard Identification Number */
    asin: string;
    /** Quantity to add */
    quantity: number;
}

/**
 * Generate a URL that adds multiple products to Amazon's cart.
 * Uses Amazon's cart/add.html endpoint (works without API access).
 * 
 * @param items - Array of ASINs and quantities
 * @param associateTag - Your Amazon Associates tag
 * @returns URL that adds items to cart when visited
 * 
 * @example
 * const url = getAmazonCartUrl(
 *   [{ asin: 'B0ABCD1234', quantity: 1 }],
 *   'comparatop-20'
 * );
 */
export function getAmazonCartUrl(
    items: CartItem[],
    associateTag: string
): string {
    const baseUrl = 'https://www.amazon.com.br/gp/aws/cart/add.html';
    const params = new URLSearchParams();

    // Add associate tag
    params.append('AssociateTag', associateTag);

    // Add each item with index (1-based)
    items.forEach((item, index) => {
        params.append(`ASIN.${index + 1}`, item.asin);
        params.append(`Quantity.${index + 1}`, item.quantity.toString());
    });

    return `${baseUrl}?${params.toString()}`;
}

// ============================================
// SINGLE PRODUCT LINK GENERATOR
// ============================================

/**
 * Generate an affiliate link for a single product.
 * 
 * @param asin - Amazon Standard Identification Number
 * @param associateTag - Your Amazon Associates tag
 * @returns Product page URL with affiliate tag
 */
export function getAmazonProductUrl(
    asin: string,
    associateTag: string
): string {
    return `https://www.amazon.com.br/dp/${asin}?tag=${associateTag}`;
}

// ============================================
// BUNDLE/KIT GENERATOR
// ============================================

interface BundleItem {
    name: string;
    asin: string;
    quantity: number;
    price?: number;
}

interface Bundle {
    name: string;
    description: string;
    items: BundleItem[];
    associateTag: string;
}

/**
 * Generate a cart URL for a product bundle/kit.
 * 
 * @param bundle - Bundle configuration
 * @returns Object with URL and bundle metadata
 */
export function createBundleUrl(bundle: Bundle) {
    const cartItems = bundle.items.map(item => ({
        asin: item.asin,
        quantity: item.quantity,
    }));

    const url = getAmazonCartUrl(cartItems, bundle.associateTag);

    const totalPrice = bundle.items.reduce((sum, item) => {
        return sum + (item.price || 0) * item.quantity;
    }, 0);

    return {
        name: bundle.name,
        description: bundle.description,
        url,
        itemCount: bundle.items.length,
        totalPrice,
    };
}

// ============================================
// EXAMPLE BUNDLES (For Testing)
// ============================================

export const EXAMPLE_BUNDLES = {
    tvSoundbar: {
        name: 'Kit TV + Soundbar',
        description: 'Combo perfeito para cinema em casa',
        items: [
            {
                name: 'Samsung QN90C 65"',
                asin: 'B0C1H9K8ML', // Example ASIN
                quantity: 1,
                price: 4200,
            },
            {
                name: 'Samsung HW-Q600C Soundbar',
                asin: 'B0C5H7JKLM', // Example ASIN
                quantity: 1,
                price: 1500,
            },
        ],
        associateTag: 'comparatop-20',
    },
    tvComplete: {
        name: 'Kit Home Theater Completo',
        description: 'TV + Soundbar + Suporte de parede',
        items: [
            {
                name: 'LG OLED C3 65"',
                asin: 'B0C2K9L8MN', // Example ASIN
                quantity: 1,
                price: 5500,
            },
            {
                name: 'LG SP9YA Soundbar',
                asin: 'B09XYZ1234', // Example ASIN
                quantity: 1,
                price: 2200,
            },
            {
                name: 'Suporte Articulado ELG',
                asin: 'B08ABC5678', // Example ASIN
                quantity: 1,
                price: 199,
            },
        ],
        associateTag: 'comparatop-20',
    },
} as const;

/**
 * Get a bundle URL from predefined bundles
 */
export function getExampleBundleUrl(bundleKey: keyof typeof EXAMPLE_BUNDLES) {
    const bundle = EXAMPLE_BUNDLES[bundleKey];
    // Convert readonly to mutable by spreading
    return createBundleUrl({
        ...bundle,
        items: [...bundle.items] as BundleItem[],
    });
}
