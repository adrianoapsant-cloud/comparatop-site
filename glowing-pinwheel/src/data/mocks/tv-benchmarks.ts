/**
 * @file tv-benchmarks.ts
 * @description Mock TV Products for HMUM Validation
 * 
 * These products represent archetypal market segments:
 * 1. Cinema King - OLED with perfect contrast, great for dark rooms
 * 2. Brightness Beast - MiniLED with peak brightness, wins in bright rooms
 * 3. Budget Trap - Entry-level that tests if cheap price can't save bad specs
 * 
 * @purpose Validate that:
 * - Ceiling Effect is eliminated (no product hits 10.0)
 * - Context switching changes rankings appropriately
 * - Bad specs can't be saved by good price
 * 
 * @version 2.0.0 (HMUM Architecture)
 */

import type { Product, ScoredProduct } from '@/types/category';

// ============================================
// BENCHMARK PRODUCTS
// ============================================

/**
 * The Cinema King - LG G4 OLED Archetype
 * 
 * Profile: Perfect blacks, excellent contrast, moderate brightness.
 * Expected behavior:
 * - Dominates in cinema_dark_room (contrast is king)
 * - Loses to MiniLED in bright_room (brightness matters more)
 * - High editorial score (9.5) should contribute positively
 */
export const CINEMA_KING: Product = {
    id: 'benchmark-cinema-king',
    name: 'LG G4 OLED 65" (Benchmark)',
    shortName: 'LG G4 OLED',
    model: 'G4 OLED 65',
    categoryId: 'tv',
    brand: 'LG',
    price: 12000,
    imageUrl: '/images/products/placeholder-tv.svg',
    scores: {
        // Legacy scores (used for editorial integration)
        c1: 9.8,  // Qualidade de Imagem
        c2: 9.5,  // Contraste
        c3: 8.5,  // Brilho (good but not extreme)
        c4: 9.0,  // Fidelidade de Cor
        c5: 9.2,  // Gaming (good input lag, VRR)
        c6: 8.0,  // Áudio
        c7: 6.5,  // Custo-Benefício (expensive)
        c8: 9.0,  // Design
        c9: 8.5,  // Smart Features
        c10: 9.0, // Confiabilidade
    },
    specs: {
        // Display
        peak_brightness_nits: 1500,
        contrast_ratio: 1500000, // Effectively infinite (OLED)
        color_gamut_dci_p3: 99,
        panel_type: 'OLED',
        screen_size_inches: 65,
        resolution: '4K',

        // Gaming
        input_lag_ms: 9.2,
        refresh_rate_hz: 120,
        vrr_support: true,
        hdmi_2_1_ports: 4,
        allm_support: true,

        // Audio
        speaker_power_watts: 60,
        dolby_atmos: true,

        // Other
        warranty_years: 2,
        voltage: 'bivolt',
        smart_platform: 'webOS',
    },
};

/**
 * The Brightness Beast - Samsung QN90 MiniLED Archetype
 * 
 * Profile: Extreme brightness, good contrast (but not OLED), competitive price.
 * Expected behavior:
 * - Dominates in cinema_bright_room (brightness fights ambient light)
 * - Loses to OLED in dark_room (contrast matters more)
 * - Better value proposition than OLED
 */
export const BRIGHTNESS_BEAST: Product = {
    id: 'benchmark-brightness-beast',
    name: 'Samsung QN90D 65" MiniLED (Benchmark)',
    shortName: 'Samsung QN90D',
    model: 'QN90D 65',
    categoryId: 'tv',
    brand: 'Samsung',
    price: 6500,
    imageUrl: '/images/products/placeholder-tv.svg',
    scores: {
        c1: 9.3,  // Qualidade de Imagem
        c2: 8.5,  // Contraste (good but not OLED)
        c3: 9.8,  // Brilho (extreme)
        c4: 9.0,  // Fidelidade de Cor
        c5: 9.4,  // Gaming (excellent)
        c6: 7.5,  // Áudio
        c7: 8.5,  // Custo-Benefício (better value)
        c8: 8.5,  // Design
        c9: 9.0,  // Smart Features (Tizen)
        c10: 9.0, // Confiabilidade
    },
    specs: {
        // Display
        peak_brightness_nits: 2200,
        contrast_ratio: 5000, // Good VA, but not infinite
        color_gamut_dci_p3: 95,
        panel_type: 'MiniLED',
        screen_size_inches: 65,
        resolution: '4K',

        // Gaming
        input_lag_ms: 9.8,
        refresh_rate_hz: 120,
        vrr_support: true,
        hdmi_2_1_ports: 4,
        allm_support: true,

        // Audio
        speaker_power_watts: 60,
        dolby_atmos: true,

        // Other
        warranty_years: 2,
        voltage: 'bivolt',
        smart_platform: 'Tizen',
    },
};

/**
 * The Budget Trap - Generic Entry-Level TV Archetype
 * 
 * Profile: Low specs across the board, very cheap price.
 * Expected behavior:
 * - NEVER approaches 10.0 even with best price
 * - Sigmoid punishes low brightness severely
 * - Gaming contexts should rate it very poorly (high input lag)
 * - Tests that Value for Money can't save fundamentally bad product
 */
export const BUDGET_TRAP: Product = {
    id: 'benchmark-budget-trap',
    name: 'GenericBrand X50 50" (Benchmark)',
    shortName: 'GenericBrand X50',
    model: 'X50',
    categoryId: 'tv',
    brand: 'GenericBrand',
    price: 1800,
    imageUrl: '/images/products/placeholder-tv.svg',
    scores: {
        c1: 6.0,  // Qualidade de Imagem (poor)
        c2: 5.5,  // Contraste (IPS bad)
        c3: 5.0,  // Brilho (very low)
        c4: 6.0,  // Fidelidade de Cor
        c5: 4.0,  // Gaming (terrible)
        c6: 5.0,  // Áudio
        c7: 8.0,  // Custo-Benefício (only saving grace)
        c8: 5.0,  // Design
        c9: 6.0,  // Smart Features
        c10: 6.0, // Confiabilidade
    },
    specs: {
        // Display - ALL BAD
        peak_brightness_nits: 280, // Should be punished by sigmoid
        contrast_ratio: 1000, // Terrible IPS
        color_gamut_dci_p3: 72, // Below minimum
        panel_type: 'IPS',
        screen_size_inches: 50,
        resolution: '4K',

        // Gaming - ALL BAD
        input_lag_ms: 45, // Terrible, should almost zero utility
        refresh_rate_hz: 60, // No high refresh
        vrr_support: false, // No VRR
        hdmi_2_1_ports: 0, // No HDMI 2.1 - FATAL for PS5 context!
        allm_support: false,

        // Audio
        speaker_power_watts: 16,
        dolby_atmos: false,

        // Other
        warranty_years: 1,
        voltage: 110, // Only 110V - could be fatal
        smart_platform: 'Generic',
    },
};

/**
 * The Gamer's Choice - Hypothetical Gaming-First TV
 * 
 * Profile: Best gaming specs, sacrifices some picture quality.
 * Expected behavior:
 * - Dominates in gamer_competitive context
 * - Acceptable in other contexts but doesn't excel
 */
export const GAMERS_CHOICE: Product = {
    id: 'benchmark-gamers-choice',
    name: 'ASUS ROG Swift PG48UQ 48" (Benchmark)',
    shortName: 'ASUS ROG PG48',
    model: 'ROG Swift PG48UQ',
    categoryId: 'tv',
    brand: 'ASUS',
    price: 8500,
    imageUrl: '/images/products/placeholder-tv.svg',
    scores: {
        c1: 8.8,  // Qualidade de Imagem
        c2: 9.5,  // Contraste (OLED)
        c3: 8.0,  // Brilho (moderate)
        c4: 8.5,  // Fidelidade de Cor
        c5: 9.9,  // Gaming (BEST)
        c6: 6.5,  // Áudio (weak)
        c7: 7.5,  // Custo-Benefício
        c8: 9.0,  // Design (gaming aesthetic)
        c9: 7.0,  // Smart Features (limited)
        c10: 8.5, // Confiabilidade
    },
    specs: {
        // Display
        peak_brightness_nits: 900,
        contrast_ratio: 1000000, // OLED
        color_gamut_dci_p3: 98,
        panel_type: 'OLED',
        screen_size_inches: 48,
        resolution: '4K',

        // Gaming - ALL EXCELLENT
        input_lag_ms: 5.5, // Best in class
        refresh_rate_hz: 138, // Above standard
        vrr_support: true,
        hdmi_2_1_ports: 2,
        allm_support: true,
        gsync_compatible: true,

        // Audio
        speaker_power_watts: 20,
        dolby_atmos: false,

        // Other
        warranty_years: 3,
        voltage: 'bivolt',
        smart_platform: 'Limited',
    },
};

// ============================================
// SCORED VERSIONS (with computed scores)
// ============================================

/**
 * Helper to add computed scores to products.
 * In real usage, this comes from the scoring engine.
 */
function addComputedScores(product: Product): ScoredProduct {
    const scores = Object.values(product.scores) as number[];
    const overall = scores.reduce((a, b) => a + b, 0) / scores.length;

    return {
        ...product,
        computed: {
            qs: overall,
            vs: overall * 0.9, // Simplified
            gs: overall * 0.95,
            overall: Math.round(overall * 10) / 10,
            pricePerPoint: Math.round(product.price / overall),
            breakdown: [],
            profileId: null,
        },
    };
}

// ============================================
// EXPORTS
// ============================================

/**
 * All benchmark products as simple Product type.
 */
export const TV_BENCHMARKS: Product[] = [
    CINEMA_KING,
    BRIGHTNESS_BEAST,
    BUDGET_TRAP,
    GAMERS_CHOICE,
];

/**
 * All benchmark products with computed scores.
 */
export const TV_BENCHMARKS_SCORED: ScoredProduct[] = TV_BENCHMARKS.map(addComputedScores);

/**
 * Benchmark map for quick lookup by ID.
 */
export const TV_BENCHMARK_MAP: Record<string, Product> = {
    'cinema-king': CINEMA_KING,
    'brightness-beast': BRIGHTNESS_BEAST,
    'budget-trap': BUDGET_TRAP,
    'gamers-choice': GAMERS_CHOICE,
};

export default TV_BENCHMARKS;
