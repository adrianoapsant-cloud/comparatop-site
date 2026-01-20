/**
 * Products Mock Database
 * 
 * Sample products for testing recommendation engine.
 * In production, this would come from an API or CMS.
 */

export interface MockProduct {
    id: string;
    name: string;
    shortName: string;
    brand: string;
    category: 'air_conditioner' | 'tv' | 'fridge';
    price: number;
    imageUrl?: string;
    specs: {
        btus?: number;
        inverter?: boolean;
        screenSize?: number; // inches
        width?: number; // cm
        height?: number; // cm
        depth?: number; // cm
        capacity?: number; // liters
    };
    affiliateUrl?: string;
    score: number;
}

export const MOCK_PRODUCTS: MockProduct[] = [
    // Air Conditioners
    {
        id: 'lg-dual-inverter-9000',
        name: 'LG Dual Inverter 9000 BTUs',
        shortName: 'LG 9000 BTU',
        brand: 'LG',
        category: 'air_conditioner',
        price: 1899,
        specs: {
            btus: 9000,
            inverter: true,
        },
        score: 8.7,
        affiliateUrl: '/produto/lg-dual-inverter-9000',
    },
    {
        id: 'lg-dual-inverter-12000',
        name: 'LG Dual Inverter 12000 BTUs',
        shortName: 'LG 12000 BTU',
        brand: 'LG',
        category: 'air_conditioner',
        price: 2599,
        specs: {
            btus: 12000,
            inverter: true,
        },
        score: 9.0,
        affiliateUrl: '/produto/lg-dual-inverter-12000',
    },
    {
        id: 'samsung-windfree-12000',
        name: 'Samsung WindFree 12000 BTUs',
        shortName: 'Samsung WindFree',
        brand: 'Samsung',
        category: 'air_conditioner',
        price: 2899,
        specs: {
            btus: 12000,
            inverter: true,
        },
        score: 8.8,
        affiliateUrl: '/produto/samsung-windfree-12000',
    },
    {
        id: 'midea-inverter-18000',
        name: 'Midea Inverter 18000 BTUs',
        shortName: 'Midea 18000 BTU',
        brand: 'Midea',
        category: 'air_conditioner',
        price: 3299,
        specs: {
            btus: 18000,
            inverter: true,
        },
        score: 8.5,
        affiliateUrl: '/produto/midea-inverter-18000',
    },
    {
        id: 'consul-24000',
        name: 'Consul 24000 BTUs',
        shortName: 'Consul 24000 BTU',
        brand: 'Consul',
        category: 'air_conditioner',
        price: 3899,
        specs: {
            btus: 24000,
            inverter: false,
        },
        score: 7.8,
        affiliateUrl: '/produto/consul-24000',
    },

    // TVs
    {
        id: 'samsung-tu7000-50',
        name: 'Samsung TU7000 50"',
        shortName: 'Samsung 50"',
        brand: 'Samsung',
        category: 'tv',
        price: 2199,
        specs: {
            screenSize: 50,
            width: 112,
            height: 65,
            depth: 6,
        },
        score: 7.5,
        affiliateUrl: '/produto/samsung-tu7000-50',
    },
    {
        id: 'lg-ur8750-55',
        name: 'LG UR8750 55"',
        shortName: 'LG 55"',
        brand: 'LG',
        category: 'tv',
        price: 2799,
        specs: {
            screenSize: 55,
            width: 124,
            height: 72,
            depth: 7,
        },
        score: 8.0,
        affiliateUrl: '/produto/lg-ur8750-55',
    },
    {
        id: 'samsung-qn90c-65',
        name: 'Samsung QN90C 65"',
        shortName: 'Samsung QN90C',
        brand: 'Samsung',
        category: 'tv',
        price: 4200,
        specs: {
            screenSize: 65,
            width: 145,
            height: 84,
            depth: 3,
        },
        score: 8.2,
        affiliateUrl: '/produto/samsung-qn90c-65',
    },
    {
        id: 'lg-c3-65',
        name: 'LG C3 OLED 65"',
        shortName: 'LG C3 OLED',
        brand: 'LG',
        category: 'tv',
        price: 5500,
        specs: {
            screenSize: 65,
            width: 145,
            height: 83,
            depth: 5,
        },
        score: 8.2,
        affiliateUrl: '/produto/lg-c3-65',
    },
    {
        id: 'tcl-p755-75',
        name: 'TCL P755 75"',
        shortName: 'TCL 75"',
        brand: 'TCL',
        category: 'tv',
        price: 4999,
        specs: {
            screenSize: 75,
            width: 168,
            height: 97,
            depth: 8,
        },
        score: 7.8,
        affiliateUrl: '/produto/tcl-p755-75',
    },

    // Fridges
    {
        id: 'consul-crm50',
        name: 'Consul CRM50 Frost Free 410L',
        shortName: 'Consul 410L',
        brand: 'Consul',
        category: 'fridge',
        price: 2299,
        specs: {
            capacity: 410,
            width: 68,
            height: 176,
            depth: 65,
        },
        score: 8.0,
        affiliateUrl: '/produto/consul-crm50-410',
    },
    {
        id: 'brastemp-brm56',
        name: 'Brastemp BRM56 Frost Free 462L',
        shortName: 'Brastemp 462L',
        brand: 'Brastemp',
        category: 'fridge',
        price: 3299,
        specs: {
            capacity: 462,
            width: 70,
            height: 178,
            depth: 68,
        },
        score: 8.3,
        affiliateUrl: '/produto/brastemp-brm56',
    },
];

/**
 * Get products filtered by category
 */
export function getProductsByCategory(category: MockProduct['category']): MockProduct[] {
    return MOCK_PRODUCTS.filter(p => p.category === category);
}

/**
 * Get AC products that meet or exceed BTU requirement
 */
export function getACProductsForBTU(requiredBTU: number): MockProduct[] {
    return MOCK_PRODUCTS
        .filter(p => p.category === 'air_conditioner')
        .filter(p => (p.specs.btus ?? 0) >= requiredBTU)
        .sort((a, b) => (a.specs.btus ?? 0) - (b.specs.btus ?? 0)); // Smallest fitting first
}

/**
 * Get TVs that fit in given width
 */
export function getTVsForWidth(maxWidth: number): MockProduct[] {
    return MOCK_PRODUCTS
        .filter(p => p.category === 'tv')
        .filter(p => (p.specs.width ?? 0) <= maxWidth)
        .sort((a, b) => (b.specs.width ?? 0) - (a.specs.width ?? 0)); // Largest fitting first
}

/**
 * Get fridges that fit through given door width
 */
export function getFridgesForDoorWidth(doorWidth: number): MockProduct[] {
    return MOCK_PRODUCTS
        .filter(p => p.category === 'fridge')
        .filter(p => (p.specs.width ?? 0) <= doorWidth - 5) // 5cm margin
        .sort((a, b) => (b.specs.capacity ?? 0) - (a.specs.capacity ?? 0)); // Largest capacity first
}
