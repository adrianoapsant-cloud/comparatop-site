/**
 * Multi-Category Scoring System - Type Definitions
 * 
 * @description Polymorphic architecture where each category defines its own
 * "10 Pain Criteria". The scoring engine is category-agnostic.
 * 
 * Arquitetura: CategoryDefinition -> Product -> ScoringEngine
 */

// ============================================
// TIER 1 CATEGORY TYPES
// ============================================

/**
 * Supported product categories (Tier 1)
 * Used for type-safe category identification
 */
export type CategoryType = 'tv' | 'fridge' | 'air_conditioner' | 'washer';

/**
 * Category-specific technical specifications (Polymorphic)
 * Each category has different required/optional fields
 */

/** TV Technical Specifications */
export interface TVSpecs {
    screenSize: number; // inches
    panelType: 'OLED' | 'QLED' | 'Mini LED' | 'LED' | 'NeoQLED';
    resolution: '4K' | '8K' | 'Full HD';
    refreshRate: 60 | 120 | 144;
    hdmiPorts: number;
    hdmi21Ports?: number;
    hasVRR?: boolean;
    hasALLM?: boolean;
    hasDolbyVision?: boolean;
    hasHDR10Plus?: boolean;
    smartPlatform: 'Tizen' | 'webOS' | 'Google TV' | 'Fire TV' | 'Roku' | 'Vidaa';
}

/** Refrigerator/Fridge Technical Specifications */
export interface FridgeSpecs {
    capacityLitres: number;
    type: 'french-door' | 'side-by-side' | 'top-freezer' | 'bottom-freezer' | 'single-door';
    inverterTechnology: boolean;
    frostFree: boolean;
    voltage: '110v' | '220v' | 'bivolt';
    energyRating: 'A' | 'B' | 'C' | 'D' | 'E';
    hasIceMaker?: boolean;
    hasWaterDispenser?: boolean;
    freezerCapacity?: number;
    dimensions?: { width: number; height: number; depth: number };
}

/** Air Conditioner Technical Specifications */
export interface AirConditionerSpecs {
    btus: number;
    inverterType: 'dual-inverter' | 'inverter' | 'conventional';
    type: 'split' | 'window' | 'portable' | 'cassette';
    voltage: '110v' | '220v';
    idrsScore?: number; // Energy efficiency score
    energyRating: 'A' | 'B' | 'C' | 'D' | 'E';
    hasWifi?: boolean;
    hasHeating?: boolean;
    noiseLevel?: number; // dB
    coverageArea?: number; // m²
}

/** Washer/Dryer Technical Specifications */
export interface WasherSpecs {
    washCapacity: number; // kg
    dryCapacity?: number; // kg (for washer-dryer combos)
    type: 'front-load' | 'top-load' | 'washer-dryer';
    voltage: '110v' | '220v' | 'bivolt';
    inverterMotor: boolean;
    aiTechnology: boolean;
    steamWash?: boolean;
    spinSpeed: number; // RPM
    energyRating: 'A' | 'B' | 'C' | 'D' | 'E';
    waterConsumption?: number; // litres per cycle
}

/**
 * Union type for all category-specific specs
 */
export type CategorySpecificSpecs = TVSpecs | FridgeSpecs | AirConditionerSpecs | WasherSpecs;

// ============================================
// CRITERIA & CATEGORY DEFINITIONS
// ============================================

/**
 * Score contribution group.
 * Determines which final score a criterion affects.
 */
export type ScoreGroup = 'QS' | 'VS' | 'GS';

/**
 * A single rating criterion within a category.
 * Each category has exactly 10 criteria.
 */
export interface RatingCriteria {
    /** Unique criterion ID within the category (e.g., "c1", "c2") */
    id: string;

    /** Human-readable label (e.g., "Qualidade de Imagem", "Eficiência Energética") */
    label: string;

    /** Default weight for this criterion (0.0 to 1.0, sum of all weights = 1.0) */
    weight: number;

    /** Which final score this criterion contributes to */
    group: ScoreGroup;

    /** Optional description for tooltips/help */
    description?: string;

    /** Icon identifier (Lucide icon name) */
    icon?: string;
}

/**
 * Complete definition of a product category.
 * Controls all scoring rules for products within this category.
 */
export interface CategoryDefinition {
    /** Unique category identifier (slug format: "tv", "fridge", "laptop") */
    id: string;

    /** Display name (e.g., "Smart TVs", "Geladeiras") */
    name: string;

    /** Singular name for product labels */
    nameSingular: string;

    /** URL-friendly slug */
    slug: string;

    /** Category description for SEO/UI */
    description?: string;

    /** Category icon (Lucide icon name) */
    icon?: string;

    /** Exactly 10 rating criteria for this category */
    criteria: RatingCriteria[];

    /** Maturity level: 'production' (default) or 'stub' (P8 placeholder) */
    maturity?: 'production' | 'stub';

    /** User profiles available for this category */
    profiles?: UserProfile[];
}

// ============================================
// USER PROFILES (Per-Category)
// ============================================

/**
 * User profile that adjusts criterion weights.
 * Each category can define its own profiles.
 */
export interface UserProfile {
    /** Profile ID (e.g., "gamer", "cinema", "balanced") */
    id: string;

    /** Display name */
    name: string;

    /** Short description */
    description: string;

    /** Emoji or icon */
    icon: string;

    /** Weight overrides: criterion ID -> new weight */
    weightOverrides: Record<string, number>;
}

// ============================================
// PRODUCT DATA MODEL
// ============================================

/**
 * Product offer from a retailer
 */
export interface ProductOffer {
    store: string;
    storeSlug: string;
    price: number;
    originalPrice?: number;
    url: string;
    affiliateUrl?: string;
    inStock: boolean;
    lastChecked: string; // ISO date
}

/**
 * Voice of Customer synthesis
 */
export interface VoC {
    totalReviews: number;
    averageRating: number;
    /** Approval percentage from community consensus (0-100). Stars = consensusScore / 20 */
    consensusScore?: number;
    oneLiner: string;
    summary: string;
    pros: string[];
    cons: string[];
    sources: Array<{
        name: string;
        url: string;
        count: number;
    }>;
}

/**
 * Core Product entity.
 * Category-agnostic: scores are keyed by criterion ID.
 * 
 * Multi-Category Architecture:
 * - Base fields (id, name, brand, etc.) are common to all categories
 * - technicalSpecs holds category-specific technical data (dynamic keys)
 * - painPointsSolved links to common consumer pain points
 * - attributes is for comparison engine boolean/numeric comparisons
 */
export interface Product {
    /** Unique product identifier (slug format) */
    id: string;

    /** Category this product belongs to */
    categoryId: string;

    /** Full product name */
    name: string;

    /** Short display name for compact UI */
    shortName?: string;

    /** Brand name */
    brand: string;

    /** Model identifier */
    model: string;

    /** Current best price */
    price: number;

    /** Main product image URL */
    imageUrl?: string;

    /** Amazon Standard Identification Number for direct product linking */
    asin?: string;

    /** 
     * Publication status:
     * - 'draft': Product in progress, missing fields generate WARNING only
     * - 'published': Production ready, missing critical fields generate FAIL
     */
    status?: 'draft' | 'published';

    /** 
     * Editorial scores: Criterion ID -> Score (0-10)
     * Keys must match criteria IDs from CategoryDefinition
     */
    scores: Record<string, number>;

    /** 
     * Technical specifications - Category-specific dynamic fields
     * 
     * @example TV: { screenSize: 65, panelType: "OLED", refreshRate: 120 }
     * @example Fridge: { capacity: "400L", type: "inverter", voltage: "220v" }
     * @example Laptop: { processor: "i7-13700H", ram: "16GB", storage: "512GB SSD" }
     */
    technicalSpecs?: Record<string, string | number | boolean>;

    /**
     * Consumer pain points this product solves.
     * Used for filtering and "best for X" recommendations.
     * 
     * @example TV: ["gaming-4k", "home-cinema", "smart-apps"]
     * @example Fridge: ["conta-de-luz", "comida-estragando", "espaco-pequeno"]
     * @example Laptop: ["trabalho-remoto", "jogos-leves", "portabilidade"]
     */
    painPointsSolved?: string[];

    /**
     * Context-specific score modifiers for contextual scoring.
     * Keys correspond to context profile IDs (e.g., 'large_home', 'pet_owners').
     * Values are score adjustments (-2.0 to +2.0).
     * When present, these override global category modifiers.
     * 
     * @example Robot vacuum for small homes: { daily_maintenance: +0.5, large_home: -1.0, pet_owners: -0.3 }
     */
    contextModifiers?: Record<string, number>;

    /**
     * Enhanced attributes for comparison engine.
     * Used by verdict engine for feature comparisons.
     * Boolean/numeric values for direct A vs B comparisons.
     */
    attributes?: Record<string, string | number | boolean | string[]>;

    /**
     * Editorial justifications for each score.
     * Explains WHY a criterion received its score.
     * 
     * @example { "c3": "Perde pontos devido a relatos frequentes de ruído após 12 meses." }
     */
    scoreReasons?: Record<string, string>;

    /** 
     * Legacy specs field - prefer technicalSpecs for new data
     * @deprecated Use technicalSpecs instead
     */
    specs?: Record<string, string | number | boolean>;

    /**
     * Category-specific structured specs (Zod-validated)
     * Used by category modules for type-safe scoring and tag derivation
     */
    structuredSpecs?: unknown;

    /** Voice of Customer data */
    voc?: VoC;

    /** Available offers */
    offers?: ProductOffer[];

    /** Editorial badges */
    badges?: ProductBadge[];

    /** Last editorial update */
    lastUpdated?: string; // ISO date

    /** Real TCO (Total Cost of Ownership) data from engineering analysis */
    tcoData?: {
        purchasePrice: number;
        energyCost5y: number;
        maintenanceCost5y: number;
        totalCost5y: number;
        monthlyReserve: number;
        lifespanYears: number;
    };

    // ============================================
    // PDP (Product Detail Page) Fields
    // ============================================

    /** Lifestyle image showing product in use */
    lifestyleImage?: string;

    /** Feature-benefit mapping for persuasion copy */
    featureBenefits?: FeatureBenefit[];

    /** Benchmark scores for comparison charts */
    benchmarks?: BenchmarkScore[];

    /** Price history for sparkline chart */
    priceHistory?: PricePoint[];

    /** Product gallery images */
    gallery?: string[];

    /** Hero subtitle for PDP */
    benefitSubtitle?: string;

    /** Direct rival for on-page comparison */
    mainCompetitor?: MainCompetitor;

    /** When true, this product uses SimplifiedPDP as default (links include ?simplified=true) */
    useSimplifiedPDP?: boolean;

    /** Direct PDF manual URL (e.g., from Samsung Download Center) */
    manualUrl?: string;

    // ============================================
    // CONTEXTUAL SCORING FIELDS
    // ============================================

    /** Product facts for contextual scoring (from demo mocks or real data) */
    scoring_facts?: Record<string, string | number | boolean | string[] | null>;

    /** Category slug for contextual scoring rules lookup */
    scoring_category?: string;

    // ============================================
    // RECOMMENDED ACCESSORY (Auto-found during scaffolding)
    // ============================================

    /** Recommended accessory product found during scaffolding */
    recommendedAccessory?: {
        /** Amazon ASIN of the accessory */
        asin: string;
        /** Full product name */
        name: string;
        /** Short display name */
        shortName: string;
        /** Current price */
        price: number;
        /** Product image URL */
        imageUrl: string;
        /** Reason for recommendation */
        reason: string;
        /** Persuasive bundle message for this product category */
        bundleMessage?: string;
        /** Affiliate URL for purchase */
        affiliateUrl?: string;
    };

    // ============================================
    // CONFIDENCE BAND / UNCERTAINTY FIELDS
    // ============================================

    /** Evidence level for trust display (product-level) */
    evidenceLevel?: 'high' | 'medium' | 'low';

    /** Last data update timestamp */
    updatedAt?: string;

    /** Contextual Score range (min, max) */
    contextualScoreRange?: [number, number];

    /** Contextual Score confidence level */
    contextualScoreConfidence?: 'high' | 'medium' | 'low';

    /** Contextual Score confidence note */
    contextualScoreConfidenceNote?: string;

    /** TCO total range (min, max) */
    tcoTotalRange?: [number, number];

    /** TCO confidence level */
    tcoConfidence?: 'high' | 'medium' | 'low';

    /** TCO confidence note */
    tcoConfidenceNote?: string;

    // ============================================
    // EXTENDED PDP DATA (consolidated from mock JSON)
    // ============================================

    /** Product physical dimensions */
    productDimensions?: {
        diameter?: number;
        height?: number;
        width?: number;
        depth?: number;
    };

    /** Header display data */
    header?: {
        overallScore: number;
        scoreLabel: string;
        title: string;
        subtitle: string;
        badges: Array<{ type: string; label: string; icon: string }>;
    };

    /** Extended Voice of Customer data */
    extendedVoc?: {
        consensusScore: number;
        totalReviews: string;
        acceptableFlaw: string;
        realWorldScenario: string;
        goldenTip: string;
    };

    /** Audit verdict sections */
    auditVerdict?: {
        solution: { title: string; icon: string; color: string; items: string[] };
        attentionPoint: { title: string; icon: string; color: string; items: string[] };
        technicalConclusion: { title: string; icon: string; color: string; text: string };
        dontBuyIf: { title: string; icon: string; color: string; items: string[] };
    };

    /** Product DNA radar chart data */
    productDna?: {
        title: string;
        subtitle: string;
        dimensions: Array<{
            id: string;
            name: string;
            shortName: string;
            score: number;
            weight: number;
            icon: string;
            color: string;
            description: string;
        }>;
    };

    /** Simulator alerts */
    simulators?: {
        sizeAlert?: { status: string; message: string; idealRange: { min: number; max: number } };
        soundAlert?: { status: string; message: string; suggestions?: Array<{ condition: string; product: string; reason: string }> };
        energyAlert?: { rating: string; message: string };
    };

    /** Extended TCO data with repairability */
    extendedTco?: {
        purchasePrice: number;
        energyCost5y: number;
        maintenanceCost5y: number;
        totalCost5y: number;
        monthlyReserve: number;
        lifespan: {
            years: number;
            categoryAverage?: number;  // Optional - auto-fetched from category-constants.ts
            limitingComponent: string;
            limitingComponentLife: number;
            weibullExplanation: string;
        };
        repairability: {
            score: number;
            level: string;
            categoryAverage?: number;  // Optional - auto-fetched from category-constants.ts
            components: Array<{
                name: string;
                score: number;
                price: number;
                availability: string;
                failureSymptoms: string[];
                repairAdvice: string;
            }>;
        };
    };

    /** Decision FAQ items */
    decisionFAQ?: Array<{
        id: string;
        icon: string;
        question: string;
        answer: string;
    }>;

    /** Interactive tools configuration */
    interactiveTools?: Array<{
        id: string;
        icon: string;
        title: string;
        badge: string;
        badgeColor: string;
        description: string;
        toolType: string;
        configRef: string;
    }>;
}

/**
 * Feature-Benefit Mapping for PDP
 */
export interface FeatureBenefit {
    icon: string;
    title: string;
    description: string;
}

/**
 * Benchmark score for comparison charts
 */
export interface BenchmarkScore {
    label: string;
    productValue: number;
    categoryAverage: number;
    unit: string;
    higherIsBetter?: boolean;
}

/**
 * Price history point for sparkline
 */
export interface PricePoint {
    date: string;
    price: number;
}

/**
 * Available product badges
 */
export type ProductBadge =
    | 'editors-choice'
    | 'best-value'
    | 'premium-pick'
    | 'budget-pick'
    | 'most-popular'
    | 'gamer'
    | 'attention-battery'
    | 'attention-support'
    | 'attention-noise'
    | 'attention-durability';

// ============================================
// ON-PAGE COMPARISON TYPES
// ============================================

/**
 * Key difference between current product and rival
 * Used in mobile Battle Card for quick comparison
 */
export interface KeyDifference {
    /** Spec label (e.g., "Brilho de Pico") */
    label: string;
    /** Current product value */
    current: string;
    /** Rival product value */
    rival: string;
    /** Winner indicator */
    winner: 'current' | 'rival' | 'draw';
}

/**
 * Main competitor data for on-page comparison
 * Shows ONE direct rival to help users decide without leaving the page
 */
export interface MainCompetitor {
    /** Rival product ID (slug) */
    id: string;
    /** Rival product name (e.g., "LG C3 OLED 65\"") */
    name: string;
    /** Rival product short name for compact UI */
    shortName?: string;
    /** Rival product image URL */
    image?: string;
    /** Rival product image URL (preferred) */
    imageUrl?: string;
    /** Rival product price */
    price: number;
    /** Rival product score (0-10) */
    score?: number;
    /** Top 2-3 key differences for mobile Battle Card */
    keyDifferences: KeyDifference[];
}

// ============================================
// COMPUTED SCORES (Engine Output)
// ============================================

/**
 * Breakdown of how a score was calculated
 */
export interface ScoreBreakdown {
    criterionId: string;
    criterionLabel: string;
    rawScore: number;
    weight: number;
    weightedScore: number;
    group: ScoreGroup;
}

/**
 * Final computed scores for a product.
 * 
 * NOTE (2026): The legacy QS/VS/GS grouping has been deprecated.
 * All scoring now uses direct weighted sums (PARR-BR architecture).
 * The qs, vs, gs fields are kept for backward compatibility but
 * now all equal the 'overall' score.
 */
export interface ComputedScores {
    /** @deprecated Legacy field - now equals 'overall' */
    qs: number;

    /** @deprecated Legacy field - now equals 'overall' */
    vs: number;

    /** @deprecated Legacy field - now equals 'overall' */
    gs: number;

    /** Overall Score (0-10) - Weighted sum using category-specific PARR-BR weights */
    overall: number;

    /** Price per quality point (lower is better) */
    pricePerPoint: number;

    /** Detailed breakdown of each criterion */
    breakdown: ScoreBreakdown[];

    /** Profile used for calculation (null = default weights) */
    profileId: string | null;
}

/**
 * Product with computed scores attached
 */
export interface ScoredProduct extends Product {
    computed: ComputedScores;
}

// ============================================
// COMPARISON TYPES
// ============================================

/**
 * Criterion-level comparison result
 */
export interface CriterionComparison {
    criterionId: string;
    label: string;
    scoreA: number;
    scoreB: number;
    winner: 'A' | 'B' | 'tie';
    difference: number;
}

/**
 * Full comparison between two products
 */
export interface ProductComparison {
    productA: ScoredProduct;
    productB: ScoredProduct;

    /** Per-criterion comparison */
    criteria: CriterionComparison[];

    /** Score comparisons */
    scores: {
        qs: { winner: 'A' | 'B' | 'tie'; difference: number };
        vs: { winner: 'A' | 'B' | 'tie'; difference: number };
        overall: { winner: 'A' | 'B' | 'tie'; difference: number };
    };

    /** Price comparison */
    price: {
        cheaper: 'A' | 'B' | 'tie';
        difference: number;
        percentDifference: number;
    };

    /** AI-generated recommendation */
    recommendation: {
        winner: 'A' | 'B' | 'tie';
        reason: string;
        bestFor: Record<string, 'A' | 'B'>;
    };
}

// ============================================
// HELPER TYPES
// ============================================

/**
 * Validation result for category/product data
 */
export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}

/**
 * Category registry type
 */
export type CategoryRegistry = Record<string, CategoryDefinition>;
