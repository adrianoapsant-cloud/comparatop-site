/**
 * Product Scoring System - TypeScript Interfaces
 * Based on the "10 Pain Criteria" methodology
 * 
 * @description Core data models for the ComparaTop scoring engine.
 * These types define the structure for editorial scoring and algorithmic recommendations.
 */

// ============================================
// CRITERIA DEFINITIONS
// ============================================

/**
 * The 10 Pain Criteria weights/scores.
 * Each criterion represents a key consumer pain point.
 * Values range from 0 to 10.
 */
export type CriteriaWeights = {
    /** 1. Custo-Benefício Real - Value for money considering market position */
    costBenefit: number;

    /** 2. Processamento de Imagem - Image processing quality (upscaling, AI, etc.) */
    imageProcessing: number;

    /** 3. Confiabilidade/Hardware - Hardware reliability and build quality */
    reliability: number;

    /** 4. Fluidez do Sistema - OS/UI responsiveness and smoothness */
    systemFluidity: number;

    /** 5. Desempenho Game - Gaming performance (input lag, VRR, etc.) */
    gamePerformance: number;

    /** 6. Brilho e Reflexo - Brightness and anti-reflective performance */
    brightness: number;

    /** 7. Pós-Venda e Reputação - After-sales support and brand reputation */
    support: number;

    /** 8. Qualidade de Som - Built-in audio quality */
    sound: number;

    /** 9. Conectividade - Ports, wireless, and smart features */
    connectivity: number;

    /** 10. Design e Instalação - Aesthetics and ease of installation */
    design: number;
};

/**
 * Criteria keys for iteration
 */
export type CriteriaKey = keyof CriteriaWeights;

/**
 * Human-readable labels for each criterion
 */
export const CRITERIA_LABELS: Record<CriteriaKey, string> = {
    costBenefit: 'Custo-Benefício',
    imageProcessing: 'Processamento de Imagem',
    reliability: 'Confiabilidade',
    systemFluidity: 'Fluidez do Sistema',
    gamePerformance: 'Desempenho em Games',
    brightness: 'Brilho e Reflexo',
    support: 'Pós-Venda',
    sound: 'Qualidade de Som',
    connectivity: 'Conectividade',
    design: 'Design e Instalação',
};

/**
 * All criteria keys in canonical order
 */
export const CRITERIA_KEYS: CriteriaKey[] = [
    'costBenefit',
    'imageProcessing',
    'reliability',
    'systemFluidity',
    'gamePerformance',
    'brightness',
    'support',
    'sound',
    'connectivity',
    'design',
];

// ============================================
// PRODUCT DATA MODELS
// ============================================

/**
 * Offer from a specific retailer
 */
export interface ProductOffer {
    store: string;
    storeUrl: string;
    price: number;
    originalPrice?: number;
    inStock: boolean;
    lastChecked: Date;
    affiliateUrl?: string;
}

/**
 * Voice of Customer data synthesized from reviews
 */
export interface VoiceOfCustomer {
    totalReviews: number;
    averageRating: number;
    summary: string;
    pros: string[];
    cons: string[];
    sources: Array<{
        name: string;
        url: string;
        reviewCount: number;
    }>;
}

/**
 * Product specifications
 */
export interface ProductSpecs {
    brand: string;
    model: string;
    screenSize?: number;       // inches
    resolution?: string;       // e.g., "4K", "8K"
    panelType?: string;        // e.g., "OLED", "QLED", "IPS"
    refreshRate?: number;      // Hz
    hdrFormats?: string[];     // e.g., ["HDR10", "Dolby Vision"]
    releaseYear?: number;
    [key: string]: unknown;    // Allow additional specs
}

/**
 * Core Product entity with editorial scores
 */
export interface Product {
    /** Unique identifier (slug format) */
    id: string;

    /** Full product name */
    name: string;

    /** Short display name for compact UI */
    shortName?: string;

    /** Product category */
    category: 'tv' | 'refrigerator' | 'smartphone' | 'laptop' | 'other';

    /** Current lowest price across all offers */
    currentPrice: number;

    /** Historical lowest price */
    lowestPrice?: number;

    /** Product image URL */
    imageUrl?: string;

    /** Raw editorial scores (0-10) for each criterion */
    rawScores: CriteriaWeights;

    /** Technical specifications */
    specs?: ProductSpecs;

    /** Voice of Customer synthesis */
    voc?: VoiceOfCustomer;

    /** Available offers from retailers */
    offers?: ProductOffer[];

    /** Editorial badges */
    badges?: Array<'editors-choice' | 'best-value' | 'premium-pick' | 'budget-pick'>;

    /** Last editorial review date */
    lastReviewedAt?: Date;
}

// ============================================
// COMPUTED SCORE TYPES
// ============================================

/**
 * Computed scores from the scoring engine
 */
export interface ComputedScores {
    /** Quality Score - Weighted average based on profile */
    qs: number;

    /** Value Score - Quality per price ratio */
    vs: number;

    /** Overall Score - Combined final score */
    overall: number;

    /** Individual weighted criterion scores */
    weightedScores: CriteriaWeights;

    /** Profile-specific recommendation strength (0-100) */
    recommendationScore: number;
}

/**
 * Product with computed scores attached
 */
export interface ScoredProduct extends Product {
    computed: ComputedScores;
}

// ============================================
// USER PROFILE TYPES
// ============================================

/**
 * User profile defining viewing priorities
 * Each value represents importance weight (0-1, sum should equal 1)
 */
export interface UserProfile {
    id: string;
    name: string;
    description: string;
    icon: string;
    weights: CriteriaWeights;
}

/**
 * Predefined user profiles
 */
export type ProfileId =
    | 'balanced'      // Perfil equilibrado
    | 'gamer'         // Foco em games
    | 'cinephile'     // Foco em filmes
    | 'casual'        // Uso básico
    | 'professional'; // Uso profissional

// ============================================
// COMPARISON TYPES
// ============================================

/**
 * Comparison between two products
 */
export interface ProductComparison {
    productA: ScoredProduct;
    productB: ScoredProduct;

    /** Winner for each criterion */
    criteriaWinners: Record<CriteriaKey, 'A' | 'B' | 'tie'>;

    /** Overall winner */
    overallWinner: 'A' | 'B' | 'tie';

    /** Price difference (A - B) */
    priceDifference: number;

    /** Generated recommendation text */
    recommendation: string;
}
