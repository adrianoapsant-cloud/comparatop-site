/**
 * Seed Data - Multi-Category Products
 * 
 * Complete mock data for:
 * - Smart TVs (4 products)
 * - Geladeiras (4 products)
 * - Ar Condicionado (4 products)
 * - Notebooks (4 products)
 */

import type { Product } from '@/types/category';

// ============================================
// SMART TVs
// ============================================

export const SEED_TVS: Product[] = [
    {
        id: 'samsung-qn90c-65',
        categoryId: 'tv',
        name: 'Samsung QN90C Neo QLED 65"',
        shortName: 'Samsung QN90C',
        brand: 'Samsung',
        model: 'QN90C',
        price: 4200,
        imageUrl: '/images/products/samsung-qn90c.svg',
        scores: {
            c1: 7.8, c2: 9.0, c3: 8.8, c4: 8.5, c5: 9.5,
            c6: 9.0, c7: 8.0, c8: 7.5, c9: 8.5, c10: 8.8,
        },
        technicalSpecs: {
            screenSize: 65,
            panelType: 'Neo QLED',
            resolution: '4K',
            refreshRate: 120,
        },
        badges: ['editors-choice'],
        lastUpdated: '2026-01-04',
    },
    {
        id: 'lg-c3-65',
        categoryId: 'tv',
        name: 'LG OLED C3 65"',
        shortName: 'LG C3 OLED',
        brand: 'LG',
        model: 'OLED65C3',
        price: 5500,
        imageUrl: '/images/products/lg-c3.svg',
        scores: {
            c1: 7.0, c2: 9.5, c3: 8.5, c4: 9.0, c5: 9.8,
            c6: 8.5, c7: 8.5, c8: 8.0, c9: 9.0, c10: 9.5,
        },
        technicalSpecs: {
            screenSize: 65,
            panelType: 'OLED',
            resolution: '4K',
            refreshRate: 120,
        },
        badges: ['most-popular'],
        lastUpdated: '2026-01-04',
    },
    {
        id: 'tcl-c735-65',
        categoryId: 'tv',
        name: 'TCL C735 QLED 65"',
        shortName: 'TCL C735',
        brand: 'TCL',
        model: 'C735',
        price: 2800,
        imageUrl: '/images/products/tcl-c735.svg',
        scores: {
            c1: 9.0, c2: 7.5, c3: 7.0, c4: 7.5, c5: 8.0,
            c6: 7.0, c7: 7.0, c8: 7.0, c9: 8.0, c10: 7.5,
        },
        technicalSpecs: {
            screenSize: 65,
            panelType: 'QLED',
            resolution: '4K',
            refreshRate: 120,
        },
        badges: ['best-value'],
        lastUpdated: '2026-01-04',
    },
    {
        id: 'sony-x90k-55',
        categoryId: 'tv',
        name: 'Sony X90K 55"',
        shortName: 'Sony X90K',
        brand: 'Sony',
        model: 'X90K',
        price: 3999,
        imageUrl: '/images/products/sony-x90k.svg',
        scores: {
            c1: 8.0, c2: 9.2, c3: 9.0, c4: 8.0, c5: 8.5,
            c6: 8.5, c7: 9.0, c8: 8.5, c9: 8.0, c10: 8.5,
        },
        technicalSpecs: {
            screenSize: 55,
            panelType: 'LED',
            resolution: '4K',
            refreshRate: 120,
        },
        badges: ['premium-pick'],
        lastUpdated: '2026-01-04',
    },
];

// ============================================
// GELADEIRAS (REFRIGERATORS)
// ============================================

export const SEED_FRIDGES: Product[] = [
    {
        id: 'brastemp-brm56-462',
        categoryId: 'fridge',
        name: 'Brastemp Frost Free BRM56 462L',
        shortName: 'Brastemp BRM56',
        brand: 'Brastemp',
        model: 'BRM56',
        price: 3899,
        imageUrl: '/images/products/brastemp-brm56.svg',
        scores: {
            c1: 8.5, c2: 9.0, c3: 8.8, c4: 8.0, c5: 7.5,
            c6: 9.0, c7: 8.5, c8: 8.0, c9: 7.0, c10: 8.5,
        },
        technicalSpecs: {
            capacityLitres: 462,
            type: 'bottom-freezer',
            inverterTechnology: true,
            frostFree: true,
        },
        badges: ['editors-choice'],
        lastUpdated: '2026-01-04',
    },
    {
        id: 'samsung-rf23-470',
        categoryId: 'fridge',
        name: 'Samsung French Door RF23 470L',
        shortName: 'Samsung RF23',
        brand: 'Samsung',
        model: 'RF23',
        price: 7499,
        imageUrl: '/images/products/samsung-rf23.svg',
        scores: {
            c1: 7.0, c2: 9.5, c3: 9.5, c4: 9.0, c5: 9.0,
            c6: 9.5, c7: 9.5, c8: 8.5, c9: 9.0, c10: 9.5,
        },
        technicalSpecs: {
            capacityLitres: 470,
            type: 'french-door',
            inverterTechnology: true,
            frostFree: true,
        },
        badges: ['premium-pick'],
        lastUpdated: '2026-01-04',
    },
    {
        id: 'lg-gsb395-395',
        categoryId: 'fridge',
        name: 'LG Inverter Linear GS-B395 395L',
        shortName: 'LG GS-B395',
        brand: 'LG',
        model: 'GS-B395',
        price: 3199,
        imageUrl: '/images/products/lg-gsb395.svg',
        scores: {
            c1: 9.0, c2: 9.0, c3: 8.0, c4: 8.5, c5: 9.5,
            c6: 9.0, c7: 8.0, c8: 8.0, c9: 7.5, c10: 8.0,
        },
        technicalSpecs: {
            capacityLitres: 395,
            type: 'top-freezer',
            inverterTechnology: true,
            frostFree: true,
        },
        badges: ['best-value'],
        lastUpdated: '2026-01-04',
    },
    {
        id: 'panasonic-nr-bt55-483',
        categoryId: 'fridge',
        name: 'Panasonic NR-BT55 Econavi 483L',
        shortName: 'Panasonic NR-BT55',
        brand: 'Panasonic',
        model: 'NR-BT55',
        price: 4299,
        imageUrl: '/images/products/panasonic-nr-bt55.svg',
        scores: {
            c1: 8.0, c2: 9.5, c3: 9.0, c4: 8.5, c5: 8.5,
            c6: 9.0, c7: 8.5, c8: 8.0, c9: 7.5, c10: 8.0,
        },
        technicalSpecs: {
            capacityLitres: 483,
            type: 'bottom-freezer',
            inverterTechnology: true,
            frostFree: true,
        },
        badges: [],
        lastUpdated: '2026-01-04',
    },
];

// ============================================
// AR CONDICIONADO
// ============================================

export const SEED_AIR_CONDITIONERS: Product[] = [
    {
        id: 'lg-dual-inverter-12000',
        categoryId: 'air_conditioner',
        name: 'LG Dual Inverter Voice 12000 BTUs',
        shortName: 'LG Dual Inverter',
        brand: 'LG',
        model: 'S4-Q12JA31A',
        price: 2599,
        imageUrl: '/images/products/lg-dual-inverter.svg',
        scores: {
            c1: 9.0, c2: 9.5, c3: 8.5, c4: 9.0, c5: 9.0,
            c6: 9.5, c7: 8.5, c8: 8.0, c9: 9.0, c10: 8.5,
        },
        technicalSpecs: {
            btus: 12000,
            inverterType: 'dual-inverter',
            type: 'split',
            noiseLevel: 19,
        },
        badges: ['editors-choice'],
        lastUpdated: '2026-01-04',
    },
    {
        id: 'samsung-windfree-12000',
        categoryId: 'air_conditioner',
        name: 'Samsung WindFree 12000 BTUs',
        shortName: 'Samsung WindFree',
        brand: 'Samsung',
        model: 'AR12CVFAMWK',
        price: 2899,
        imageUrl: '/images/products/samsung-windfree.svg',
        scores: {
            c1: 8.5, c2: 9.5, c3: 9.0, c4: 8.5, c5: 9.5,
            c6: 9.0, c7: 8.5, c8: 8.0, c9: 9.0, c10: 9.0,
        },
        technicalSpecs: {
            btus: 12000,
            inverterType: 'inverter',
            type: 'split',
            noiseLevel: 21,
        },
        badges: ['premium-pick'],
        lastUpdated: '2026-01-04',
    },
    {
        id: 'electrolux-eco-9000',
        categoryId: 'air_conditioner',
        name: 'Electrolux Eco Turbo 9000 BTUs',
        shortName: 'Electrolux Eco',
        brand: 'Electrolux',
        model: 'EI09F',
        price: 1699,
        imageUrl: '/images/products/electrolux-eco.svg',
        scores: {
            c1: 9.5, c2: 8.0, c3: 7.5, c4: 7.5, c5: 7.0,
            c6: 7.0, c7: 7.5, c8: 8.5, c9: 6.0, c10: 7.5,
        },
        technicalSpecs: {
            btus: 9000,
            inverterType: 'conventional',
            type: 'split',
            noiseLevel: 38,
        },
        badges: ['budget-pick'],
        lastUpdated: '2026-01-04',
    },
    {
        id: 'consul-inverter-12000',
        categoryId: 'air_conditioner',
        name: 'Consul Inverter 12000 BTUs',
        shortName: 'Consul Inverter',
        brand: 'Consul',
        model: 'CBN12CBBNA',
        price: 2199,
        imageUrl: '/images/products/consul-inverter.svg',
        scores: {
            c1: 9.0, c2: 8.5, c3: 8.0, c4: 8.0, c5: 8.0,
            c6: 8.5, c7: 8.0, c8: 8.5, c9: 7.0, c10: 7.5,
        },
        technicalSpecs: {
            btus: 12000,
            inverterType: 'inverter',
            type: 'split',
            noiseLevel: 28,
        },
        badges: ['best-value'],
        lastUpdated: '2026-01-04',
    },
];

// ============================================
// NOTEBOOKS
// ============================================

export const SEED_NOTEBOOKS: Product[] = [
    {
        id: 'dell-xps-15',
        categoryId: 'notebook',
        name: 'Dell XPS 15 (2024)',
        shortName: 'Dell XPS 15',
        brand: 'Dell',
        model: 'XPS 15 9530',
        price: 12999,
        imageUrl: '/images/products/dell-xps-15.svg',
        scores: {
            c1: 7.0, c2: 9.5, c3: 9.5, c4: 9.0, c5: 9.0,
            c6: 9.5, c7: 9.0, c8: 8.5, c9: 9.0, c10: 9.5,
        },
        technicalSpecs: {
            processor: 'Intel Core i7-13700H',
            ram: '16GB DDR5',
            storage: '512GB SSD NVMe',
            screenSize: 15.6,
            graphicsCard: 'RTX 4050',
        },
        badges: ['premium-pick'],
        lastUpdated: '2026-01-04',
    },
    {
        id: 'macbook-air-m3',
        categoryId: 'notebook',
        name: 'MacBook Air M3 13"',
        shortName: 'MacBook Air M3',
        brand: 'Apple',
        model: 'MacBook Air M3',
        price: 10999,
        imageUrl: '/images/products/macbook-air-m3.svg',
        scores: {
            c1: 7.5, c2: 9.5, c3: 9.0, c4: 9.5, c5: 0.0, // Not for gaming
            c6: 9.5, c7: 9.5, c8: 9.0, c9: 9.5, c10: 9.5,
        },
        technicalSpecs: {
            processor: 'Apple M3 8-core',
            ram: '8GB Unified',
            storage: '256GB SSD',
            screenSize: 13.6,
            graphicsCard: 'M3 GPU 8-core',
        },
        badges: ['editors-choice'],
        lastUpdated: '2026-01-04',
    },
    {
        id: 'lenovo-ideapad-3',
        categoryId: 'notebook',
        name: 'Lenovo IdeaPad 3 15.6"',
        shortName: 'Lenovo IdeaPad 3',
        brand: 'Lenovo',
        model: 'IdeaPad 3 15ALC6',
        price: 2899,
        imageUrl: '/images/products/lenovo-ideapad-3.svg',
        scores: {
            c1: 9.5, c2: 7.5, c3: 7.0, c4: 7.5, c5: 5.0,
            c6: 7.0, c7: 7.0, c8: 7.5, c9: 7.0, c10: 7.0,
        },
        technicalSpecs: {
            processor: 'AMD Ryzen 5 5500U',
            ram: '8GB DDR4',
            storage: '256GB SSD',
            screenSize: 15.6,
            graphicsCard: 'Radeon Vega 7',
        },
        badges: ['budget-pick'],
        lastUpdated: '2026-01-04',
    },
    {
        id: 'acer-nitro-5',
        categoryId: 'notebook',
        name: 'Acer Nitro 5 Gaming',
        shortName: 'Acer Nitro 5',
        brand: 'Acer',
        model: 'AN515-58',
        price: 5499,
        imageUrl: '/images/products/acer-nitro-5.svg',
        scores: {
            c1: 8.5, c2: 8.0, c3: 8.0, c4: 8.0, c5: 9.0,
            c6: 8.0, c7: 7.5, c8: 8.0, c9: 8.5, c10: 7.5,
        },
        technicalSpecs: {
            processor: 'Intel Core i5-12500H',
            ram: '16GB DDR4',
            storage: '512GB SSD NVMe',
            screenSize: 15.6,
            graphicsCard: 'RTX 3050',
        },
        badges: ['most-popular'],
        lastUpdated: '2026-01-04',
    },
];

// ============================================
// CATEGORY DEFINITIONS (For display in Home)
// ============================================

export const CATEGORY_DISPLAY_CONFIG = {
    tv: {
        name: 'Smart TVs',
        icon: 'Tv',
        specLabels: {
            screenSize: 'Polegadas',
            panelType: 'Painel',
            resolution: 'Resolução',
            refreshRate: 'Hz',
        },
    },
    fridge: {
        name: 'Geladeiras',
        icon: 'Refrigerator',
        specLabels: {
            capacityLitres: 'Litros',
            type: 'Tipo',
            inverterTechnology: 'Inverter',
            frostFree: 'Frost Free',
        },
    },
    air_conditioner: {
        name: 'Ar Condicionado',
        icon: 'Wind',
        specLabels: {
            btus: 'BTUs',
            inverterType: 'Tecnologia',
            type: 'Tipo',
            noiseLevel: 'Ruído (dB)',
        },
    },
    notebook: {
        name: 'Notebooks',
        icon: 'Laptop',
        specLabels: {
            processor: 'Processador',
            ram: 'RAM',
            storage: 'Armazenamento',
            screenSize: 'Tela',
            graphicsCard: 'GPU',
        },
    },
};

// ============================================
// COMBINED EXPORTS
// ============================================

export const ALL_SEED_PRODUCTS: Product[] = [
    ...SEED_TVS,
    ...SEED_FRIDGES,
    ...SEED_AIR_CONDITIONERS,
    ...SEED_NOTEBOOKS,
];

/**
 * Get products by category ID
 */
export function getSeedProductsByCategory(categoryId: string): Product[] {
    return ALL_SEED_PRODUCTS.filter(p => p.categoryId === categoryId);
}

/**
 * Get all category IDs with products
 */
export function getAvailableCategories(): string[] {
    return [...new Set(ALL_SEED_PRODUCTS.map(p => p.categoryId))];
}
