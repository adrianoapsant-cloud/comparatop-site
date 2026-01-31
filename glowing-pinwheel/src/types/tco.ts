// ============================================================================
// TCO (Total Cost of Ownership) TYPE DEFINITIONS
// ============================================================================
// Core types for the Value Engineering module
// Supports comparison between "Sticker Price" vs "TCO" views
// ============================================================================

/**
 * Usage Persona - Different usage profiles that affect energy consumption
 * and feature relevance in TCO calculations
 */
export type UsagePersona = 'gamer' | 'eco' | 'family';

/**
 * View Mode - Toggle between simple price view and full TCO analysis
 */
export type TcoViewMode = 'price' | 'tco';

/**
 * Product feature flags for filtering and persona matching
 */
export interface ProductFeatures {
    /** High refresh rate, low input lag - relevant for gamers */
    gaming: boolean;
    /** Energy efficient, inverter tech - relevant for eco-conscious */
    energyEfficient: boolean;
    /** Large capacity, durability - relevant for families */
    familyFriendly: boolean;
    /** Premium brand with good after-sales */
    premiumBrand: boolean;
    /** Has smart/connectivity features */
    smart: boolean;
    /** Extended warranty available */
    extendedWarranty: boolean;
}

/**
 * SCRS (Supply Chain Risk Score) breakdown
 * Lower score = higher risk = higher maintenance costs
 */
export interface ScrsBreakdown {
    /** Parts availability score (0-10) */
    partsAvailability: number;
    /** Service network coverage score (0-10) */
    serviceNetwork: number;
    /** Repair complexity score (0-10, higher = easier to repair) */
    repairability: number;
    /** Brand reliability history score (0-10) */
    brandReliability: number;
}

/**
 * Energy consumption profile by usage persona
 * Different personas use products differently, affecting energy costs
 */
export interface EnergyProfile {
    /** Average monthly kWh for eco/light usage */
    eco: number;
    /** Average monthly kWh for family/moderate usage */
    family: number;
    /** Average monthly kWh for gamer/heavy usage */
    gamer: number;
}

/**
 * Core TCO data structure for a product
 */
export interface ProductTcoData {
    /** Unique product identifier (slug) */
    id: string;

    /** Product display name */
    name: string;

    /** Brand name */
    brand: string;

    /** Category slug */
    categoryId: string;

    // ==========================================
    // CAPEX (Capital Expenditure)
    // ==========================================

    /** Purchase price in BRL (sticker price) */
    price: number;

    // ==========================================
    // OPEX (Operational Expenditure)
    // ==========================================

    /** Monthly energy cost in BRL by persona */
    energyCost: EnergyProfile;

    /** Monthly energy consumption in kWh by persona */
    energyKwh: EnergyProfile;

    /** Annual maintenance cost estimate in BRL (based on SCRS) */
    maintenanceCost: number;

    // ==========================================
    // VALUE RETENTION
    // ==========================================

    /** Estimated resale value after 5 years in BRL */
    resaleValue: number;

    /** Resale value as percentage of original price (0-100) */
    resalePercentage: number;

    // ==========================================
    // RISK ASSESSMENT
    // ==========================================

    /** Overall SCRS score (0-10, higher = lower risk) */
    scrsScore: number;

    /** Detailed SCRS breakdown */
    scrsBreakdown: ScrsBreakdown;

    /** Estimated useful life in years */
    lifespanYears: number;

    // ==========================================
    // FEATURES & METADATA
    // ==========================================

    /** Product feature flags */
    features: ProductFeatures;

    /** Key specifications for display */
    specs: Record<string, string | number>;

    /** Product image URL */
    imageUrl?: string;

    /** Editorial score (0-10) - ComparaTop technical analysis */
    editorialScore?: number;

    // ==========================================
    // DUAL SCORING: Community vs Technical
    // ==========================================

    /** Community rating (1-5 stars from Amazon/ML) */
    communityRating?: number;

    /** Number of community reviews */
    communityReviews?: number;

    /** Technical score (0-10) - ComparaTop's 10 Dores analysis */
    technicalScore?: number;

    /** Match score from filter chips (0-100) */
    matchScore?: number;

    /** PARR-BR profile badges (c1-c10) - true if score > 7 */
    profileBadges?: {
        c1?: boolean;  // Casa Grande (Navegação)
        c2?: boolean;  // Smart (App/Conectividade)
        c3?: boolean;  // Mop (Eficiência de Mop)
        c4?: boolean;  // Pets (Escovas)
        c5?: boolean;  // Compacto (Altura)
        c6?: boolean;  // Fácil Manut (Peças)
        c7?: boolean;  // Bateria+ (Autonomia)
        c8?: boolean;  // Silencioso (Ruído)
        c9?: boolean;  // Auto-Dock (Base)
        c10?: boolean; // IA (Detecção)
    };
}

/**
 * Calculated TCO result for a specific timeframe and persona
 */
export interface TcoCalculationResult {
    /** Product ID reference */
    productId: string;

    /** Persona used for calculation */
    persona: UsagePersona;

    /** Timeframe in years */
    years: number;

    // ==========================================
    // COST BREAKDOWN
    // ==========================================

    /** Initial purchase price */
    capex: number;

    /** Total energy cost over period */
    totalEnergyCost: number;

    /** Total maintenance cost over period */
    totalMaintenanceCost: number;

    /** Resale value (negative = savings) */
    resaleValue: number;

    // ==========================================
    // TOTALS
    // ==========================================

    /** Grand total TCO */
    totalTco: number;

    /** TCO per year */
    tcoPerYear: number;

    /** TCO per month */
    tcoPerMonth: number;

    /** Difference from sticker price (positive = more expensive) */
    priceVsTcoDelta: number;

    /** Percentage difference from sticker price */
    priceVsTcoPercent: number;
}

/**
 * Comparison result between two products
 */
export interface TcoComparisonResult {
    /** Product A calculation */
    productA: TcoCalculationResult;

    /** Product B calculation */
    productB: TcoCalculationResult;

    /** Winner product ID */
    winnerId: string;

    /** Amount saved by choosing winner */
    savings: number;

    /** Savings as percentage */
    savingsPercent: number;

    /** Key differentiators */
    differentiators: {
        field: string;
        label: string;
        productAValue: number;
        productBValue: number;
        winner: 'a' | 'b' | 'tie';
    }[];
}

/**
 * URL state for TCO view
 */
export interface TcoUrlState {
    view: TcoViewMode;
    persona: UsagePersona;
    years?: number;
    compareIds?: string[];
}

/**
 * Energy rate configuration by region
 */
export interface EnergyRateConfig {
    /** Rate in BRL per kWh */
    ratePerKwh: number;
    /** Region/state identifier */
    region: string;
    /** Rate tier (residential, commercial) */
    tier: 'residential' | 'commercial';
}
