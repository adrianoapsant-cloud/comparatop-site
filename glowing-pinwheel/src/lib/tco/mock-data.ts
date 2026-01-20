// ============================================================================
// TCO MOCK DATA GENERATOR - CATEGORY-SPECIFIC
// ============================================================================
// Generates realistic product data for testing the Value Engineering UI
// Products are generated PER CATEGORY to enable valid TCO comparisons
// Different categories have different consumption models
// ============================================================================

import type { ProductTcoData, ProductFeatures, ScrsBreakdown, EnergyProfile } from '@/types/tco';

// ============================================
// CATEGORY TYPES
// ============================================

export type TcoCategory = 'smart-tvs' | 'geladeiras' | 'lavadoras' | 'ar-condicionado' | 'robo-aspiradores';

// ============================================
// BRAND CONFIGURATIONS (per category)
// ============================================

interface BrandConfig {
    name: string;
    tier: 'premium' | 'mainstream' | 'budget';
    scrsBase: number;
    resaleRetention: number;
    priceMultiplier: number;
    categories: TcoCategory[];
}

const BRANDS: BrandConfig[] = [
    // TV/Electronics brands
    { name: 'Samsung', tier: 'premium', scrsBase: 8.5, resaleRetention: 45, priceMultiplier: 1.3, categories: ['smart-tvs', 'geladeiras', 'ar-condicionado'] },
    { name: 'LG', tier: 'premium', scrsBase: 8.0, resaleRetention: 42, priceMultiplier: 1.25, categories: ['smart-tvs', 'geladeiras', 'lavadoras', 'ar-condicionado'] },
    { name: 'Sony', tier: 'premium', scrsBase: 7.5, resaleRetention: 40, priceMultiplier: 1.4, categories: ['smart-tvs'] },
    { name: 'TCL', tier: 'mainstream', scrsBase: 6.0, resaleRetention: 25, priceMultiplier: 0.8, categories: ['smart-tvs', 'ar-condicionado'] },
    { name: 'Philco', tier: 'budget', scrsBase: 4.0, resaleRetention: 15, priceMultiplier: 0.6, categories: ['smart-tvs', 'geladeiras', 'lavadoras'] },
    { name: 'Multilaser', tier: 'budget', scrsBase: 3.5, resaleRetention: 10, priceMultiplier: 0.5, categories: ['smart-tvs'] },

    // Appliance brands
    { name: 'Brastemp', tier: 'premium', scrsBase: 8.2, resaleRetention: 38, priceMultiplier: 1.2, categories: ['geladeiras', 'lavadoras'] },
    { name: 'Electrolux', tier: 'mainstream', scrsBase: 7.0, resaleRetention: 32, priceMultiplier: 1.0, categories: ['geladeiras', 'lavadoras', 'ar-condicionado'] },
    { name: 'Consul', tier: 'mainstream', scrsBase: 6.5, resaleRetention: 28, priceMultiplier: 0.85, categories: ['geladeiras', 'lavadoras', 'ar-condicionado'] },
    { name: 'Midea', tier: 'budget', scrsBase: 5.0, resaleRetention: 20, priceMultiplier: 0.7, categories: ['geladeiras', 'ar-condicionado'] },
    { name: 'Daikin', tier: 'premium', scrsBase: 9.0, resaleRetention: 50, priceMultiplier: 1.5, categories: ['ar-condicionado'] },
    { name: 'Springer', tier: 'mainstream', scrsBase: 6.8, resaleRetention: 30, priceMultiplier: 0.9, categories: ['ar-condicionado'] },

    // Robot Vacuum brands
    { name: 'Roborock', tier: 'premium', scrsBase: 7.5, resaleRetention: 35, priceMultiplier: 1.3, categories: ['robo-aspiradores'] },
    { name: 'Xiaomi', tier: 'mainstream', scrsBase: 7.0, resaleRetention: 30, priceMultiplier: 1.0, categories: ['robo-aspiradores'] },
    { name: 'Dreame', tier: 'premium', scrsBase: 7.3, resaleRetention: 32, priceMultiplier: 1.2, categories: ['robo-aspiradores'] },
    { name: 'WAP', tier: 'mainstream', scrsBase: 7.5, resaleRetention: 25, priceMultiplier: 0.5, categories: ['robo-aspiradores'] },
    { name: 'Electrolux', tier: 'mainstream', scrsBase: 6.8, resaleRetention: 28, priceMultiplier: 0.7, categories: ['robo-aspiradores'] },
    { name: 'iRobot', tier: 'premium', scrsBase: 8.0, resaleRetention: 38, priceMultiplier: 1.4, categories: ['robo-aspiradores'] },
];

// ============================================
// CATEGORY-SPECIFIC CONFIGURATIONS
// ============================================

interface CategoryConfig {
    id: TcoCategory;
    consumptionModel: 'hours' | 'continuous' | 'cycles';
    baseMonthlyKwh: {
        eco: number;
        family: number;
        gamer: number;
    };
    priceRange: { min: number; max: number };
    lifespanRange: { min: number; max: number };
}

const CATEGORY_CONFIGS: Record<TcoCategory, CategoryConfig> = {
    'smart-tvs': {
        id: 'smart-tvs',
        consumptionModel: 'hours',
        // TVs: ~100-200W, calculated by screen-on hours
        baseMonthlyKwh: { eco: 15, family: 35, gamer: 80 },
        priceRange: { min: 1500, max: 12000 },
        lifespanRange: { min: 5, max: 10 },
    },
    'geladeiras': {
        id: 'geladeiras',
        consumptionModel: 'continuous',
        // Refrigerators: 24h operation, 30-60 kWh/month
        baseMonthlyKwh: { eco: 28, family: 38, gamer: 45 },
        priceRange: { min: 2000, max: 8000 },
        lifespanRange: { min: 8, max: 15 },
    },
    'lavadoras': {
        id: 'lavadoras',
        consumptionModel: 'cycles',
        // Washers: by cycles, ~2kWh per cycle
        baseMonthlyKwh: { eco: 8, family: 16, gamer: 24 },
        priceRange: { min: 1500, max: 6000 },
        lifespanRange: { min: 8, max: 12 },
    },
    'ar-condicionado': {
        id: 'ar-condicionado',
        consumptionModel: 'hours',
        // AC: High consumption, varies by daily usage
        baseMonthlyKwh: { eco: 80, family: 150, gamer: 250 },
        priceRange: { min: 1800, max: 7000 },
        lifespanRange: { min: 8, max: 15 },
    },
    'robo-aspiradores': {
        id: 'robo-aspiradores',
        consumptionModel: 'cycles',
        // Robot vacuums: ~30W, 100-180 min runtime, ~2-3 cycles/week
        // Monthly: 30W x 1.5h x 12 cycles = 0.54 kWh/month (very low)
        baseMonthlyKwh: { eco: 0.4, family: 0.6, gamer: 0.8 },
        priceRange: { min: 700, max: 6000 },
        lifespanRange: { min: 3, max: 6 },
    },
};

// ============================================
// PRODUCT TEMPLATES (per category)
// ============================================

interface ProductTemplate {
    suffix: string;
    category: TcoCategory;
    priceMultiplier: number;
    features: Partial<ProductFeatures>;
    energyMultiplier: number; // Relative to category base
    lifespanBonus: number;
    specs: Record<string, string | number>;
}

const PRODUCT_TEMPLATES: Record<TcoCategory, ProductTemplate[]> = {
    'smart-tvs': [
        {
            suffix: 'Gaming Pro 65"',
            category: 'smart-tvs',
            priceMultiplier: 1.4,
            features: { gaming: true, smart: true },
            energyMultiplier: 1.5,
            lifespanBonus: 1,
            specs: { size: '65"', resolution: '4K', refreshRate: '144Hz', vrr: 'Yes' },
        },
        {
            suffix: 'OLED 55"',
            category: 'smart-tvs',
            priceMultiplier: 1.6,
            features: { energyEfficient: true, premiumBrand: true },
            energyMultiplier: 0.8,
            lifespanBonus: 2,
            specs: { size: '55"', panel: 'OLED', resolution: '4K', hdr: 'Dolby Vision' },
        },
        {
            suffix: 'Family 55"',
            category: 'smart-tvs',
            priceMultiplier: 1.0,
            features: { familyFriendly: true, smart: true },
            energyMultiplier: 1.0,
            lifespanBonus: 0,
            specs: { size: '55"', resolution: '4K', refreshRate: '60Hz', kids: 'Parental Control' },
        },
        {
            suffix: 'Basic 43"',
            category: 'smart-tvs',
            priceMultiplier: 0.6,
            features: {},
            energyMultiplier: 1.2,
            lifespanBonus: -2,
            specs: { size: '43"', resolution: 'Full HD', refreshRate: '60Hz' },
        },
        {
            suffix: 'Smart 50"',
            category: 'smart-tvs',
            priceMultiplier: 0.8,
            features: { smart: true },
            energyMultiplier: 1.0,
            lifespanBonus: 0,
            specs: { size: '50"', resolution: '4K', smartOS: 'Google TV' },
        },
    ],
    'geladeiras': [
        {
            suffix: 'French Door 550L',
            category: 'geladeiras',
            priceMultiplier: 1.5,
            features: { familyFriendly: true, premiumBrand: true },
            energyMultiplier: 1.3,
            lifespanBonus: 2,
            specs: { capacity: '550L', doors: 'French Door', icemaker: 'Yes', inverter: 'Yes' },
        },
        {
            suffix: 'Inverter Plus 450L',
            category: 'geladeiras',
            priceMultiplier: 1.2,
            features: { energyEfficient: true },
            energyMultiplier: 0.7,
            lifespanBonus: 3,
            specs: { capacity: '450L', inverter: 'Yes', frostFree: 'Yes', energyClass: 'A' },
        },
        {
            suffix: 'Duplex 380L',
            category: 'geladeiras',
            priceMultiplier: 0.9,
            features: { familyFriendly: true },
            energyMultiplier: 1.0,
            lifespanBonus: 0,
            specs: { capacity: '380L', frostFree: 'Yes', energyClass: 'B' },
        },
        {
            suffix: 'Compacta 280L',
            category: 'geladeiras',
            priceMultiplier: 0.6,
            features: {},
            energyMultiplier: 1.4,
            lifespanBonus: -2,
            specs: { capacity: '280L', defrost: 'Manual', energyClass: 'C' },
        },
    ],
    'lavadoras': [
        {
            suffix: 'Lava e Seca 12kg',
            category: 'lavadoras',
            priceMultiplier: 1.8,
            features: { energyEfficient: true, premiumBrand: true },
            energyMultiplier: 1.5,
            lifespanBonus: 2,
            specs: { capacity: '12kg', type: 'Lava e Seca', motor: 'Inverter', cycles: '16' },
        },
        {
            suffix: 'Automática 11kg',
            category: 'lavadoras',
            priceMultiplier: 1.0,
            features: { familyFriendly: true },
            energyMultiplier: 1.0,
            lifespanBonus: 0,
            specs: { capacity: '11kg', type: 'Automática', cycles: '12' },
        },
        {
            suffix: 'Turbo 9kg',
            category: 'lavadoras',
            priceMultiplier: 0.7,
            features: {},
            energyMultiplier: 1.2,
            lifespanBonus: -1,
            specs: { capacity: '9kg', type: 'Automática', cycles: '8' },
        },
    ],
    'ar-condicionado': [
        {
            suffix: 'Inverter 18000 BTU',
            category: 'ar-condicionado',
            priceMultiplier: 1.4,
            features: { energyEfficient: true, premiumBrand: true },
            energyMultiplier: 0.6,
            lifespanBonus: 3,
            specs: { btu: '18000', type: 'Split Inverter', energyClass: 'A', silent: 'Yes' },
        },
        {
            suffix: 'Split 12000 BTU',
            category: 'ar-condicionado',
            priceMultiplier: 1.0,
            features: { familyFriendly: true },
            energyMultiplier: 1.0,
            lifespanBonus: 0,
            specs: { btu: '12000', type: 'Split', energyClass: 'B' },
        },
        {
            suffix: 'Portátil 9000 BTU',
            category: 'ar-condicionado',
            priceMultiplier: 0.6,
            features: {},
            energyMultiplier: 1.8,
            lifespanBonus: -3,
            specs: { btu: '9000', type: 'Portátil', energyClass: 'D' },
        },
    ],
    'robo-aspiradores': [
        {
            suffix: 'LiDAR Pro',
            category: 'robo-aspiradores',
            priceMultiplier: 1.4,
            features: { smart: true, premiumBrand: true },
            energyMultiplier: 1.0,
            lifespanBonus: 2,
            specs: { navigation: 'LiDAR', suction: '8000Pa', runtime: '150min', mop: 'Estático' },
        },
        {
            suffix: 'Auto-Empty Station',
            category: 'robo-aspiradores',
            priceMultiplier: 1.8,
            features: { smart: true, premiumBrand: true, familyFriendly: true },
            energyMultiplier: 1.2,
            lifespanBonus: 1,
            specs: { navigation: 'LiDAR', suction: '4000Pa', runtime: '180min', autoEmpty: 'Yes' },
        },
        {
            suffix: 'Basic Random',
            category: 'robo-aspiradores',
            priceMultiplier: 0.5,
            features: {},
            energyMultiplier: 0.8,
            lifespanBonus: -1,
            specs: { navigation: 'Aleatória', suction: '1400Pa', runtime: '100min', mop: 'Estático' },
        },
        {
            suffix: 'Sonic Mop',
            category: 'robo-aspiradores',
            priceMultiplier: 2.0,
            features: { smart: true, premiumBrand: true },
            energyMultiplier: 1.3,
            lifespanBonus: 2,
            specs: { navigation: 'LiDAR', suction: '6000Pa', runtime: '180min', mop: 'Vibratório' },
        },
    ],
};

// ============================================
// ENERGY COST CALCULATION
// ============================================

const ENERGY_RATE_PER_KWH = 0.85;

function generateEnergyProfile(
    category: TcoCategory,
    energyMultiplier: number
): EnergyProfile {
    const config = CATEGORY_CONFIGS[category];
    const variance = () => 1 + (Math.random() - 0.5) * 0.2; // ±10%

    return {
        eco: Math.round(config.baseMonthlyKwh.eco * energyMultiplier * variance() * 10) / 10,
        family: Math.round(config.baseMonthlyKwh.family * energyMultiplier * variance() * 10) / 10,
        gamer: Math.round(config.baseMonthlyKwh.gamer * energyMultiplier * variance() * 10) / 10,
    };
}

function generateEnergyCost(energyKwh: EnergyProfile): EnergyProfile {
    return {
        eco: Math.round(energyKwh.eco * ENERGY_RATE_PER_KWH * 100) / 100,
        family: Math.round(energyKwh.family * ENERGY_RATE_PER_KWH * 100) / 100,
        gamer: Math.round(energyKwh.gamer * ENERGY_RATE_PER_KWH * 100) / 100,
    };
}

// ============================================
// SCRS & MAINTENANCE
// ============================================

function generateScrsBreakdown(baseScore: number): ScrsBreakdown {
    const v = () => (Math.random() - 0.5) * 2;
    return {
        partsAvailability: Math.min(10, Math.max(0, baseScore + v())),
        serviceNetwork: Math.min(10, Math.max(0, baseScore + v() * 1.5)),
        repairability: Math.min(10, Math.max(0, baseScore + v())),
        brandReliability: Math.min(10, Math.max(0, baseScore + v() * 0.5)),
    };
}

function calculateMaintenanceCost(scrsScore: number, price: number): number {
    const riskFactor = 10 - scrsScore;
    const annualRate = 0.02 + (riskFactor * 0.006);
    return Math.round(price * annualRate);
}

// ============================================
// FEATURE MERGING
// ============================================

function mergeFeatures(base: Partial<ProductFeatures>, brandTier: string): ProductFeatures {
    const isPremium = brandTier === 'premium';
    return {
        gaming: base.gaming ?? false,
        energyEfficient: base.energyEfficient ?? false,
        familyFriendly: base.familyFriendly ?? false,
        premiumBrand: base.premiumBrand ?? isPremium,
        smart: base.smart ?? (Math.random() > 0.3),
        extendedWarranty: base.extendedWarranty ?? isPremium,
    };
}

// ============================================
// MAIN GENERATOR - BY CATEGORY
// ============================================

/**
 * Generates mock TCO product data for a SPECIFIC CATEGORY
 * 
 * @param category Category to generate products for
 * @param count Number of products to generate
 * @returns Array of ProductTcoData for that category only
 */
export function generateMockProducts(
    category: TcoCategory = 'smart-tvs',
    count: number = 8
): ProductTcoData[] {
    const products: ProductTcoData[] = [];
    const templates = PRODUCT_TEMPLATES[category];
    const config = CATEGORY_CONFIGS[category];

    // Get brands that sell in this category
    const categoryBrands = BRANDS.filter(b => b.categories.includes(category));

    for (let i = 0; i < count; i++) {
        const brand = categoryBrands[i % categoryBrands.length];
        const template = templates[i % templates.length];

        // Calculate price within category range
        const basePrice = config.priceRange.min +
            (config.priceRange.max - config.priceRange.min) * template.priceMultiplier;
        const price = Math.round(basePrice * brand.priceMultiplier);

        // Generate energy with category-specific values
        const energyKwh = generateEnergyProfile(category, template.energyMultiplier);
        const energyCost = generateEnergyCost(energyKwh);

        // SCRS with brand influence
        const scrsScore = Math.min(10, Math.max(0, brand.scrsBase + (Math.random() - 0.5)));
        const scrsBreakdown = generateScrsBreakdown(scrsScore);

        // Derived values
        const maintenanceCost = calculateMaintenanceCost(scrsScore, price);
        const resalePercentage = brand.resaleRetention + (Math.random() * 10 - 5);
        const resaleValue = Math.round(price * (resalePercentage / 100));

        // Lifespan based on category + brand + template
        const lifespanAdjust = brand.tier === 'premium' ? 2 : brand.tier === 'budget' ? -2 : 0;
        const lifespanYears = Math.max(
            config.lifespanRange.min,
            Math.min(
                config.lifespanRange.max,
                Math.round((config.lifespanRange.min + config.lifespanRange.max) / 2) +
                lifespanAdjust + template.lifespanBonus
            )
        );

        const id = `${brand.name.toLowerCase()}-${template.suffix.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`;

        // Generate community vs technical score with intentional discrepancy
        const technicalScore = Math.round((5 + scrsScore / 2) * 10) / 10;

        // Budget brands tend to have HIGHER community ratings (star illusion)
        // because reviews focus on "cheap and works" rather than long-term quality
        const communityBase = brand.tier === 'budget'
            ? 4.3 + Math.random() * 0.5  // Budget: 4.3-4.8 (inflated by hype)
            : brand.tier === 'premium'
                ? 4.0 + Math.random() * 0.8  // Premium: 4.0-4.8 (realistic)
                : 3.8 + Math.random() * 0.7; // Mainstream: 3.8-4.5

        const communityRating = Math.round(communityBase * 10) / 10;

        // Budget brands get MORE reviews (volume sellers)
        const reviewMultiplier = brand.tier === 'budget' ? 3 : brand.tier === 'mainstream' ? 1.5 : 1;
        const communityReviews = Math.round((500 + Math.random() * 2000) * reviewMultiplier);

        products.push({
            id,
            name: `${brand.name} ${template.suffix}`,
            brand: brand.name,
            categoryId: category,
            price,
            energyCost,
            energyKwh,
            maintenanceCost,
            resaleValue,
            resalePercentage: Math.round(resalePercentage),
            scrsScore: Math.round(scrsScore * 10) / 10,
            scrsBreakdown,
            lifespanYears,
            features: mergeFeatures(template.features, brand.tier),
            specs: { ...template.specs },
            editorialScore: technicalScore,
            communityRating,
            communityReviews,
            technicalScore,
        });
    }

    return products;
}

// ============================================
// CURATED PRODUCTS (per category)
// ============================================

const CURATED_PRODUCTS: Record<TcoCategory, ProductTcoData[]> = {
    'smart-tvs': [
        {
            id: 'samsung-neo-qled-gaming-65',
            name: 'Samsung Neo QLED Gaming 65"',
            brand: 'Samsung',
            categoryId: 'smart-tvs',
            price: 8999,
            energyCost: { eco: 12.75, family: 29.75, gamer: 68.00 },
            energyKwh: { eco: 15, family: 35, gamer: 80 },
            maintenanceCost: 180,
            resaleValue: 4050,
            resalePercentage: 45,
            scrsScore: 8.7,
            scrsBreakdown: { partsAvailability: 9.0, serviceNetwork: 8.5, repairability: 8.0, brandReliability: 9.3 },
            lifespanYears: 9,
            features: { gaming: true, energyEfficient: false, familyFriendly: true, premiumBrand: true, smart: true, extendedWarranty: true },
            specs: { size: '65"', resolution: '4K', refreshRate: '144Hz', vrr: 'FreeSync Premium Pro' },
            editorialScore: 9.2,
            // ✅ ALINHADO: Nota técnica alta, comunidade alta
            communityRating: 4.7,
            communityReviews: 2847,
            technicalScore: 9.2,
        },
        {
            id: 'lg-oled-55',
            name: 'LG OLED 55"',
            brand: 'LG',
            categoryId: 'smart-tvs',
            price: 6499,
            energyCost: { eco: 10.20, family: 23.80, gamer: 54.40 },
            energyKwh: { eco: 12, family: 28, gamer: 64 },
            maintenanceCost: 130,
            resaleValue: 2730,
            resalePercentage: 42,
            scrsScore: 8.2,
            scrsBreakdown: { partsAvailability: 8.5, serviceNetwork: 8.0, repairability: 7.8, brandReliability: 8.5 },
            lifespanYears: 10,
            features: { gaming: false, energyEfficient: true, familyFriendly: true, premiumBrand: true, smart: true, extendedWarranty: true },
            specs: { size: '55"', panel: 'OLED', resolution: '4K', hdr: 'Dolby Vision' },
            editorialScore: 8.8,
            // ✅ ALINHADO: Qualidade real alta
            communityRating: 4.8,
            communityReviews: 1923,
            technicalScore: 8.8,
        },
        {
            id: 'multilaser-basic-43',
            name: 'Multilaser Basic 43"',
            brand: 'Multilaser',
            categoryId: 'smart-tvs',
            price: 1799,
            energyCost: { eco: 15.30, family: 35.70, gamer: 81.60 },
            energyKwh: { eco: 18, family: 42, gamer: 96 },
            maintenanceCost: 144,
            resaleValue: 180,
            resalePercentage: 10,
            scrsScore: 3.2,
            scrsBreakdown: { partsAvailability: 2.5, serviceNetwork: 3.0, repairability: 4.0, brandReliability: 3.3 },
            lifespanYears: 4,
            features: { gaming: false, energyEfficient: false, familyFriendly: false, premiumBrand: false, smart: true, extendedWarranty: false },
            specs: { size: '43"', resolution: 'Full HD', refreshRate: '60Hz' },
            editorialScore: 5.5,
            // ⚠️ DISCREPÂNCIA: Comunidade alta (hype), Técnica baixa (peças raras, TCO alto)
            // Este é o "produto famosinho" que educa o usuário sobre a ilusão das estrelinhas
            communityRating: 4.6,  // "Barato e bonito!" - reviews focam no preço
            communityReviews: 15234,  // MUITOS reviews (popularidade)
            technicalScore: 4.2,  // Realidade: peças raras, vida útil curta, alto TCO
        },
        {
            id: 'tcl-family-55',
            name: 'TCL Family 55"',
            brand: 'TCL',
            categoryId: 'smart-tvs',
            price: 3299,
            energyCost: { eco: 12.75, family: 29.75, gamer: 68.00 },
            energyKwh: { eco: 15, family: 35, gamer: 80 },
            maintenanceCost: 132,
            resaleValue: 825,
            resalePercentage: 25,
            scrsScore: 6.0,
            scrsBreakdown: { partsAvailability: 6.0, serviceNetwork: 5.5, repairability: 6.5, brandReliability: 6.0 },
            lifespanYears: 7,
            features: { gaming: false, energyEfficient: false, familyFriendly: true, premiumBrand: false, smart: true, extendedWarranty: false },
            specs: { size: '55"', resolution: '4K', smartOS: 'Google TV' },
            editorialScore: 7.2,
            // 📊 MODERADO: Custo-benefício ok, mas escondido nas reviews
            communityRating: 4.2,
            communityReviews: 892,
            technicalScore: 7.2,
        },
        // 🆕 PRODUTO EXTRA: "Viral" com discrepância extrema
        {
            id: 'philco-smart-50',
            name: 'Philco Smart 50" Viral',
            brand: 'Philco',
            categoryId: 'smart-tvs',
            price: 1499,
            energyCost: { eco: 17.85, family: 41.65, gamer: 95.20 },
            energyKwh: { eco: 21, family: 49, gamer: 112 },
            maintenanceCost: 180,
            resaleValue: 150,
            resalePercentage: 10,
            scrsScore: 3.8,
            scrsBreakdown: { partsAvailability: 3.0, serviceNetwork: 3.5, repairability: 4.5, brandReliability: 4.2 },
            lifespanYears: 4,
            features: { gaming: false, energyEfficient: false, familyFriendly: false, premiumBrand: false, smart: true, extendedWarranty: false },
            specs: { size: '50"', resolution: '4K', smartOS: 'Linux' },
            editorialScore: 4.8,
            // 🚨 ARMADILHA: Super popular mas qualidade péssima
            communityRating: 4.8,  // "Chegou rápido!" "Funciona bem" - reviews superficiais
            communityReviews: 28456,  // VIRAL no marketplace
            technicalScore: 3.5,  // Realidade: queima fácil, sem peças, alto TCO
        },
    ],
    'geladeiras': [
        {
            id: 'brastemp-french-door-550',
            name: 'Brastemp French Door 550L',
            brand: 'Brastemp',
            categoryId: 'geladeiras',
            price: 7999,
            energyCost: { eco: 30.60, family: 41.65, gamer: 49.30 },
            energyKwh: { eco: 36, family: 49, gamer: 58 },
            maintenanceCost: 160,
            resaleValue: 3040,
            resalePercentage: 38,
            scrsScore: 8.2,
            scrsBreakdown: { partsAvailability: 8.5, serviceNetwork: 8.0, repairability: 7.8, brandReliability: 8.5 },
            lifespanYears: 14,
            features: { gaming: false, energyEfficient: false, familyFriendly: true, premiumBrand: true, smart: false, extendedWarranty: true },
            specs: { capacity: '550L', doors: 'French Door', icemaker: 'Yes', inverter: 'Yes' },
            editorialScore: 8.8,
        },
        {
            id: 'electrolux-inverter-450',
            name: 'Electrolux Inverter 450L',
            brand: 'Electrolux',
            categoryId: 'geladeiras',
            price: 4499,
            energyCost: { eco: 16.66, family: 22.61, gamer: 26.78 },
            energyKwh: { eco: 19.6, family: 26.6, gamer: 31.5 },
            maintenanceCost: 90,
            resaleValue: 1440,
            resalePercentage: 32,
            scrsScore: 7.0,
            scrsBreakdown: { partsAvailability: 7.0, serviceNetwork: 7.5, repairability: 6.5, brandReliability: 7.0 },
            lifespanYears: 12,
            features: { gaming: false, energyEfficient: true, familyFriendly: true, premiumBrand: false, smart: false, extendedWarranty: false },
            specs: { capacity: '450L', inverter: 'Yes', frostFree: 'Yes', energyClass: 'A' },
            editorialScore: 7.8,
        },
        {
            id: 'consul-duplex-380',
            name: 'Consul Duplex 380L',
            brand: 'Consul',
            categoryId: 'geladeiras',
            price: 2899,
            energyCost: { eco: 23.80, family: 32.30, gamer: 38.25 },
            energyKwh: { eco: 28, family: 38, gamer: 45 },
            maintenanceCost: 116,
            resaleValue: 812,
            resalePercentage: 28,
            scrsScore: 6.5,
            scrsBreakdown: { partsAvailability: 6.5, serviceNetwork: 7.0, repairability: 6.0, brandReliability: 6.5 },
            lifespanYears: 10,
            features: { gaming: false, energyEfficient: false, familyFriendly: true, premiumBrand: false, smart: false, extendedWarranty: false },
            specs: { capacity: '380L', frostFree: 'Yes', energyClass: 'B' },
            editorialScore: 7.0,
        },
        {
            id: 'midea-compacta-280',
            name: 'Midea Compacta 280L',
            brand: 'Midea',
            categoryId: 'geladeiras',
            price: 1799,
            energyCost: { eco: 33.32, family: 45.22, gamer: 53.55 },
            energyKwh: { eco: 39.2, family: 53.2, gamer: 63 },
            maintenanceCost: 108,
            resaleValue: 360,
            resalePercentage: 20,
            scrsScore: 5.0,
            scrsBreakdown: { partsAvailability: 5.0, serviceNetwork: 4.5, repairability: 5.5, brandReliability: 5.0 },
            lifespanYears: 8,
            features: { gaming: false, energyEfficient: false, familyFriendly: false, premiumBrand: false, smart: false, extendedWarranty: false },
            specs: { capacity: '280L', defrost: 'Manual', energyClass: 'C' },
            editorialScore: 6.0,
        },
    ],
    'lavadoras': [
        {
            id: 'lg-lava-seca-12',
            name: 'LG Lava e Seca 12kg',
            brand: 'LG',
            categoryId: 'lavadoras',
            price: 5499,
            energyCost: { eco: 10.20, family: 20.40, gamer: 30.60 },
            energyKwh: { eco: 12, family: 24, gamer: 36 },
            maintenanceCost: 110,
            resaleValue: 2310,
            resalePercentage: 42,
            scrsScore: 8.0,
            scrsBreakdown: { partsAvailability: 8.0, serviceNetwork: 8.5, repairability: 7.5, brandReliability: 8.0 },
            lifespanYears: 11,
            features: { gaming: false, energyEfficient: true, familyFriendly: true, premiumBrand: true, smart: true, extendedWarranty: true },
            specs: { capacity: '12kg', type: 'Lava e Seca', motor: 'Inverter', cycles: '16' },
            editorialScore: 8.5,
        },
        {
            id: 'brastemp-automatica-11',
            name: 'Brastemp Automática 11kg',
            brand: 'Brastemp',
            categoryId: 'lavadoras',
            price: 3299,
            energyCost: { eco: 6.80, family: 13.60, gamer: 20.40 },
            energyKwh: { eco: 8, family: 16, gamer: 24 },
            maintenanceCost: 66,
            resaleValue: 1254,
            resalePercentage: 38,
            scrsScore: 8.2,
            scrsBreakdown: { partsAvailability: 8.5, serviceNetwork: 8.0, repairability: 7.8, brandReliability: 8.5 },
            lifespanYears: 10,
            features: { gaming: false, energyEfficient: false, familyFriendly: true, premiumBrand: true, smart: false, extendedWarranty: false },
            specs: { capacity: '11kg', type: 'Automática', cycles: '12' },
            editorialScore: 8.0,
        },
        {
            id: 'consul-turbo-9',
            name: 'Consul Turbo 9kg',
            brand: 'Consul',
            categoryId: 'lavadoras',
            price: 1899,
            energyCost: { eco: 8.16, family: 16.32, gamer: 24.48 },
            energyKwh: { eco: 9.6, family: 19.2, gamer: 28.8 },
            maintenanceCost: 76,
            resaleValue: 532,
            resalePercentage: 28,
            scrsScore: 6.5,
            scrsBreakdown: { partsAvailability: 6.5, serviceNetwork: 7.0, repairability: 6.0, brandReliability: 6.5 },
            lifespanYears: 8,
            features: { gaming: false, energyEfficient: false, familyFriendly: false, premiumBrand: false, smart: false, extendedWarranty: false },
            specs: { capacity: '9kg', type: 'Automática', cycles: '8' },
            editorialScore: 6.8,
        },
    ],
    'ar-condicionado': [
        {
            id: 'daikin-inverter-18000',
            name: 'Daikin Inverter 18000 BTU',
            brand: 'Daikin',
            categoryId: 'ar-condicionado',
            price: 6499,
            energyCost: { eco: 40.80, family: 76.50, gamer: 127.50 },
            energyKwh: { eco: 48, family: 90, gamer: 150 },
            maintenanceCost: 65,
            resaleValue: 3250,
            resalePercentage: 50,
            scrsScore: 9.0,
            scrsBreakdown: { partsAvailability: 9.0, serviceNetwork: 9.5, repairability: 8.5, brandReliability: 9.0 },
            lifespanYears: 15,
            features: { gaming: false, energyEfficient: true, familyFriendly: true, premiumBrand: true, smart: true, extendedWarranty: true },
            specs: { btu: '18000', type: 'Split Inverter', energyClass: 'A', silent: 'Yes' },
            editorialScore: 9.2,
        },
        {
            id: 'lg-split-12000',
            name: 'LG Split 12000 BTU',
            brand: 'LG',
            categoryId: 'ar-condicionado',
            price: 2999,
            energyCost: { eco: 68.00, family: 127.50, gamer: 212.50 },
            energyKwh: { eco: 80, family: 150, gamer: 250 },
            maintenanceCost: 60,
            resaleValue: 1260,
            resalePercentage: 42,
            scrsScore: 8.0,
            scrsBreakdown: { partsAvailability: 8.0, serviceNetwork: 8.5, repairability: 7.5, brandReliability: 8.0 },
            lifespanYears: 12,
            features: { gaming: false, energyEfficient: false, familyFriendly: true, premiumBrand: true, smart: false, extendedWarranty: false },
            specs: { btu: '12000', type: 'Split', energyClass: 'B' },
            editorialScore: 8.0,
        },
        {
            id: 'midea-portatil-9000',
            name: 'Midea Portátil 9000 BTU',
            brand: 'Midea',
            categoryId: 'ar-condicionado',
            price: 1799,
            energyCost: { eco: 122.40, family: 229.50, gamer: 382.50 },
            energyKwh: { eco: 144, family: 270, gamer: 450 },
            maintenanceCost: 108,
            resaleValue: 360,
            resalePercentage: 20,
            scrsScore: 5.0,
            scrsBreakdown: { partsAvailability: 5.0, serviceNetwork: 4.5, repairability: 5.5, brandReliability: 5.0 },
            lifespanYears: 6,
            features: { gaming: false, energyEfficient: false, familyFriendly: false, premiumBrand: false, smart: false, extendedWarranty: false },
            specs: { btu: '9000', type: 'Portátil', energyClass: 'D' },
            editorialScore: 5.5,
        },
    ],
    // ============================================
    // ROBÔS ASPIRADORES - Produtos Curados com dados REAIS
    // Baseados em products.ts: roborock-q7-l5, wap-robot-w400, xiaomi-robot-x10
    // ============================================
    'robo-aspiradores': [
        {
            // ROBOROCK Q7 L5 - Dados reais de products.ts
            id: 'roborock-q7-l5',
            name: 'Roborock Q7 L5 LiDAR',
            brand: 'Roborock',
            categoryId: 'robo-aspiradores',
            price: 2106, // Real: R$ 2.105,95
            // Energia: 30W x 2.5h/uso x 12 ciclos/mês = ~0.9 kWh/mês (negligenciável)
            energyCost: { eco: 0.34, family: 0.51, gamer: 0.68 },
            energyKwh: { eco: 0.4, family: 0.6, gamer: 0.8 },
            // Manutenção: Peças importadas, troca de escovas/filtros anual ~R$ 150
            maintenanceCost: 150,
            // Revenda: Premium brand, 35% após 3 anos
            resaleValue: 737,
            resalePercentage: 35,
            // SCRS: Roborock é premium mas importado (peças via marketplace)
            scrsScore: 7.5,
            scrsBreakdown: { partsAvailability: 6.0, serviceNetwork: 5.5, repairability: 8.0, brandReliability: 8.5 },
            lifespanYears: 5,
            features: { gaming: false, energyEfficient: true, familyFriendly: true, premiumBrand: true, smart: true, extendedWarranty: false },
            specs: { navigation: 'LiDAR 3D', suction: '8000Pa', runtime: '150min', mop: 'Estático', brushType: 'Anti-emaranhamento' },
            editorialScore: 8.36, // Real score from products.ts
            // VOC Real: 3512 reviews, 4.2 stars
            communityRating: 4.2,
            communityReviews: 3512,
            technicalScore: 8.36,
        },
        {
            // WAP ROBOT W400 - Dados reais de products.ts
            id: 'wap-robot-w400',
            name: 'WAP Robot W400 3 em 1',
            brand: 'WAP',
            categoryId: 'robo-aspiradores',
            price: 989, // Real: R$ 989 (Amazon 18/01/2026)
            // Energia: 30W x 1.5h/uso x 12 ciclos/mês = ~0.54 kWh/mês
            energyCost: { eco: 0.26, family: 0.43, gamer: 0.60 },
            energyKwh: { eco: 0.3, family: 0.5, gamer: 0.7 },
            // Manutenção: Marca nacional! Peças no ML. ~R$ 80/ano
            maintenanceCost: 80,
            // Revenda: Budget, 25% após 3 anos (se funcionar)
            resaleValue: 247,
            resalePercentage: 25,
            // SCRS: WAP é NACIONAL = peças fáceis!
            scrsScore: 7.5,
            scrsBreakdown: { partsAvailability: 9.0, serviceNetwork: 8.0, repairability: 7.0, brandReliability: 6.0 },
            lifespanYears: 3, // Navegação aleatória = mais desgaste
            features: { gaming: false, energyEfficient: true, familyFriendly: false, premiumBrand: false, smart: true, extendedWarranty: false },
            specs: { navigation: 'Aleatória', suction: '1400Pa', runtime: '100min', mop: 'Estático', brushType: 'Cerdas mistas' },
            editorialScore: 5.81, // Real score from products.ts (weighted avg)
            // VOC Real: 1433 reviews, 4.2 stars
            // ⚠️ DISCREPÂNCIA: Rating alto mas score técnico baixo!
            communityRating: 4.2,
            communityReviews: 1433,
            technicalScore: 5.81,
        },
        {
            // XIAOMI X10 - Dados reais de products.ts
            id: 'xiaomi-robot-x10',
            name: 'Xiaomi X10 Auto-Empty',
            brand: 'Xiaomi',
            categoryId: 'robo-aspiradores',
            price: 3000, // Real: R$ 3.000 (Amazon)
            // Energia: 40W (com base) x 3h/semana = ~0.7 kWh/mês
            energyCost: { eco: 0.34, family: 0.60, gamer: 0.85 },
            energyKwh: { eco: 0.4, family: 0.7, gamer: 1.0 },
            // Manutenção: Xiaomi tem peças no ML/Shopee. ~R$ 120/ano
            maintenanceCost: 120,
            // Revenda: Mainstream, 30% após 3 anos
            resaleValue: 900,
            resalePercentage: 30,
            // SCRS: Xiaomi melhor que Roborock em peças BR
            scrsScore: 7.8,
            scrsBreakdown: { partsAvailability: 7.0, serviceNetwork: 7.5, repairability: 7.5, brandReliability: 8.2 },
            lifespanYears: 5,
            features: { gaming: false, energyEfficient: true, familyFriendly: true, premiumBrand: false, smart: true, extendedWarranty: false },
            specs: { navigation: 'LDS Laser', suction: '4000Pa', runtime: '180min', mop: 'Estático', autoEmpty: 'Sim' },
            editorialScore: 8.45, // Estimated from products.ts scores
            // VOC Real: 6465 reviews, 4.5 stars
            communityRating: 4.5,
            communityReviews: 6465,
            technicalScore: 8.45,
        },
        // ============================================
        // DISCREPÂNCIA: Armadilha (Popular mas Fraco)
        // ============================================
        {
            id: 'generico-robot-viral',
            name: 'GenéricoBot 2000 Viral',
            brand: 'GenéricoBot',
            categoryId: 'robo-aspiradores',
            price: 599, // Super barato = viral
            energyCost: { eco: 0.20, family: 0.35, gamer: 0.50 },
            energyKwh: { eco: 0.25, family: 0.4, gamer: 0.6 },
            maintenanceCost: 200, // Alto! Peças inexistentes
            resaleValue: 0, // Sem revenda
            resalePercentage: 0,
            scrsScore: 2.5, // Péssimo suporte
            scrsBreakdown: { partsAvailability: 1.0, serviceNetwork: 1.5, repairability: 3.0, brandReliability: 2.0 },
            lifespanYears: 1, // Queima em 1 ano
            features: { gaming: false, energyEfficient: false, familyFriendly: false, premiumBrand: false, smart: true, extendedWarranty: false },
            specs: { navigation: 'Aleatória', suction: '800Pa', runtime: '60min', mop: 'Não' },
            editorialScore: 5.2,
            // 🚨 ARMADILHA: Super bem avaliado por impulso (barato!)
            communityRating: 4.8,
            communityReviews: 18432, // Viral no marketplace
            technicalScore: 4.2, // Realidade: sem peças, vida curta, frustração garantida
        },
        // ============================================
        // DISCREPÂNCIA: Gema Oculta (Desconhecido mas Robusto)
        // ============================================
        {
            id: 'irobot-roomba-i3-plus',
            name: 'iRobot Roomba i3+ Auto-Empty',
            brand: 'iRobot',
            categoryId: 'robo-aspiradores',
            price: 3500, // Premium
            energyCost: { eco: 0.40, family: 0.65, gamer: 0.90 },
            energyKwh: { eco: 0.5, family: 0.8, gamer: 1.1 },
            maintenanceCost: 100, // Baixo! Peças oficiais disponíveis
            resaleValue: 1400, // 40% após 3 anos
            resalePercentage: 40,
            scrsScore: 9.2, // Excelente suporte global
            scrsBreakdown: { partsAvailability: 9.5, serviceNetwork: 9.0, repairability: 8.5, brandReliability: 9.8 },
            lifespanYears: 7, // Durabilidade excepcional
            features: { gaming: false, energyEfficient: true, familyFriendly: true, premiumBrand: true, smart: true, extendedWarranty: true },
            specs: { navigation: 'iAdapt 3.0', suction: '2000Pa', runtime: '75min', mop: 'Não', autoEmpty: 'Sim' },
            editorialScore: 8.8,
            // 💎 GEMA OCULTA: Pouco avaliado (preço alto assusta), mas qualidade top
            communityRating: 3.9, // Reviews reclamam do preço, não da qualidade
            communityReviews: 423, // Poucos reviews (nicho)
            technicalScore: 9.0, // Realidade: durável, peças fáceis, TCO excelente
        },
    ],
};

/**
 * Returns curated example products for a specific category
 */
export function getCuratedExampleProducts(category: TcoCategory = 'smart-tvs'): ProductTcoData[] {
    return CURATED_PRODUCTS[category] || CURATED_PRODUCTS['smart-tvs'];
}

/**
 * Returns all products for a category (curated + generated)
 */
export function getProductsForCategory(category: TcoCategory, count: number = 8): ProductTcoData[] {
    const curated = getCuratedExampleProducts(category);
    const generated = generateMockProducts(category, count);

    // Combine and dedupe
    const all = [...curated, ...generated];
    const seen = new Set<string>();

    return all.filter(p => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
    });
}

// ============================================
// EXPORTS
// ============================================

export { CATEGORY_CONFIGS, BRANDS, CURATED_PRODUCTS };
