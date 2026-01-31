/**
 * Accessory Finder - Auto search for compatible accessories during scaffolding
 * 
 * @description Searches Amazon for compatible accessories based on:
 * 1. Product category
 * 2. Product brand (prefer same brand)
 * 3. Category-specific accessory types
 * 
 * Usage: Called automatically by scaffold-product.ts after main product is processed
 */

// ============================================
// TYPES
// ============================================

export interface RecommendedAccessory {
    asin: string;
    name: string;
    shortName: string;
    price: number;
    imageUrl: string;
    reason: string;
    affiliateUrl?: string;
}

export interface AccessorySearchConfig {
    categoryId: string;
    queryTemplate: string;
    accessoryType: string;
    reasonTemplate: string;
}

// ============================================
// CATEGORY → ACCESSORY QUERY MAPPING
// ============================================

/**
 * Maps product categories to their recommended accessory search queries
 * {brand} will be replaced with the actual product brand
 */
export const ACCESSORY_SEARCH_CONFIG: Record<string, AccessorySearchConfig> = {
    'robot-vacuum': {
        categoryId: 'robot-vacuum',
        queryTemplate: '{brand} robô aspirador escova reposição kit',
        accessoryType: 'escova_robo',
        reasonTemplate: 'Escovas de reposição para manter a sucção. Troque a cada 3-6 meses.',
    },
    'tv': {
        categoryId: 'tv',
        queryTemplate: '{brand} soundbar bluetooth',
        accessoryType: 'soundbar',
        reasonTemplate: 'Melhore o áudio da sua TV com uma soundbar compatível.',
    },
    'air_conditioner': {
        categoryId: 'air_conditioner',
        queryTemplate: 'ar condicionado filtro reposição universal',
        accessoryType: 'filtro_ac',
        reasonTemplate: 'Filtro de reposição para manter a qualidade do ar.',
    },
    'fridge': {
        categoryId: 'fridge',
        queryTemplate: 'organizador geladeira kit',
        accessoryType: 'organizador_geladeira',
        reasonTemplate: 'Maximize o espaço interno da sua geladeira.',
    },
};

// ============================================
// SEARCH FUNCTIONS
// ============================================

/**
 * Build Amazon search URL for accessory
 */
export function buildAccessorySearchUrl(categoryId: string, brand: string): string | null {
    const config = ACCESSORY_SEARCH_CONFIG[categoryId];
    if (!config) {
        console.log(`[accessory-finder] No accessory config for category: ${categoryId}`);
        return null;
    }

    const query = config.queryTemplate.replace('{brand}', brand);
    const encodedQuery = encodeURIComponent(query);

    return `https://www.amazon.com.br/s?k=${encodedQuery}&ref=nb_sb_noss`;
}

/**
 * Get accessory config for a category
 */
export function getAccessoryConfig(categoryId: string): AccessorySearchConfig | null {
    return ACCESSORY_SEARCH_CONFIG[categoryId] || null;
}

/**
 * Parse accessory data from Amazon search results
 * This will be called after browser scraping
 */
export function parseAccessoryFromSearchResult(
    rawData: {
        asin: string;
        name: string;
        price: number;
        imageUrl: string;
    },
    categoryId: string,
    brand: string
): RecommendedAccessory {
    const config = ACCESSORY_SEARCH_CONFIG[categoryId];

    // Generate short name (first 40 chars)
    const shortName = rawData.name.length > 40
        ? rawData.name.substring(0, 40) + '...'
        : rawData.name;

    // Generate affiliate URL
    const affiliateUrl = `https://www.amazon.com.br/dp/${rawData.asin}?tag=comparatop06-20`;

    return {
        asin: rawData.asin,
        name: rawData.name,
        shortName,
        price: rawData.price,
        imageUrl: rawData.imageUrl,
        reason: config?.reasonTemplate || 'Acessório recomendado para complementar seu produto.',
        affiliateUrl,
    };
}

/**
 * Check if accessory price is reasonable relative to main product
 * Rule: accessory should be < 30% of main product price
 */
export function isReasonableAccessoryPrice(mainProductPrice: number, accessoryPrice: number): boolean {
    const maxAccessoryPrice = mainProductPrice * 0.30;
    return accessoryPrice <= maxAccessoryPrice;
}

/**
 * Generate the reason text for the accessory recommendation
 */
export function generateAccessoryReason(categoryId: string, brand: string): string {
    const config = ACCESSORY_SEARCH_CONFIG[categoryId];
    if (!config) return 'Acessório recomendado.';

    return config.reasonTemplate;
}
