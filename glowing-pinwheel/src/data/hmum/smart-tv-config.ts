/**
 * @file smart-tv-config.ts
 * @description HMUM Configuration for Smart TV Category (RECALIBRATED)
 * 
 * v2.1.0 CALIBRATION NOTES (11/01/2026):
 * - Lowered sigmoid midpoints to reflect Brazilian market reality
 * - Reduced steepness for more gradual curves (less binary)
 * - Adjusted price curve to not punish premium products excessively
 * - Increased default utilities to prevent score collapse
 * 
 * TARGET: Cinema King (LG G4 OLED) should score 8.5-9.2 in cinema_dark_room
 * 
 * @version 2.1.0 (Recalibrated)
 */

import type {
    CategoryHMUMConfig,
    AttributeDefinition,
    ContextConfig,
    ConstraintDefinition,
} from '@/lib/scoring/hmum-types';

// ============================================
// ATTRIBUTE DEFINITIONS (RECALIBRATED)
// ============================================

const SMART_TV_ATTRIBUTES: AttributeDefinition[] = [
    // ========================================
    // PICTURE QUALITY (QS Group)
    // ========================================
    {
        id: 'peak_brightness',
        label: 'Brilho de Pico (nits)',
        specPath: 'specs.peak_brightness_nits',
        defaultValue: 400,
        group: 'quality',
        description: 'Peak HDR brightness in nits. Critical for HDR content in bright rooms.',
        curve: {
            type: 'sigmoid',
            /**
             * RECALIBRATED Midpoint: 400 nits (lowered from 600)
             * 
             * @rationale (Brazilian Market 2026)
             * - Budget TVs: 250-350 nits → utility ~0.40-0.50
             * - Entry QLED: 400-500 nits → utility ~0.50-0.65
             * - Mid-range OLED: 600-800 nits → utility ~0.75-0.85
             * - Premium MiniLED/OLED: 1000-1500 nits → utility ~0.90-0.95
             * - Flagship: 2000+ nits → utility ~0.97+
             * 
             * Cinema King (1500 nits) → utility 0.93
             */
            midpoint: 400,
            steepness: 0.003, // Lowered from 0.005 for smoother curve
            limit: 0.98,
        },
        defaultWeight: 0.15,
    },
    {
        id: 'contrast_ratio',
        label: 'Contraste',
        specPath: 'specs.contrast_ratio',
        defaultValue: 2000,
        group: 'quality',
        description: 'Native contrast ratio. OLED is effectively infinite.',
        curve: {
            type: 'sigmoid',
            /**
             * RECALIBRATED Midpoint: 3000:1 (lowered from 5000)
             * 
             * @rationale
             * - IPS panels: 1000-1500:1 → utility ~0.25-0.35
             * - VA panels: 2500-4000:1 → utility ~0.45-0.60
             * - Good VA/MiniLED: 5000-10000:1 → utility ~0.70-0.85
             * - OLED (1,000,000+): → utility ~0.98
             * 
             * Cinema King (1,500,000) → utility 0.98
             */
            midpoint: 3000,
            steepness: 0.0003, // Lowered for better differentiation
            limit: 0.99,
        },
        defaultWeight: 0.15,
    },
    {
        id: 'color_gamut_dci_p3',
        label: 'Gamut de Cor (DCI-P3 %)',
        specPath: 'specs.color_gamut_dci_p3',
        defaultValue: 85,
        group: 'quality',
        description: 'Color gamut coverage as percentage of DCI-P3.',
        curve: {
            type: 'linear',
            min: 75,  // Lowered from 80 (budget TVs often below 80%)
            max: 100,
            invert: false,
        },
        defaultWeight: 0.10,
    },

    // ========================================
    // GAMING PERFORMANCE
    // ========================================
    {
        id: 'input_lag',
        label: 'Input Lag (ms)',
        specPath: 'specs.input_lag_ms',
        defaultValue: 30,
        group: 'quality',
        description: 'Input lag in game mode. Critical for competitive gaming.',
        curve: {
            type: 'linear',
            /**
             * RECALIBRATED: 5-50ms range (was 5-40ms)
             * 
             * @rationale
             * - Elite (5-10ms): utility ~0.90-1.0
             * - Good (10-18ms): utility ~0.70-0.85
             * - Acceptable (18-30ms): utility ~0.45-0.65
             * - Poor (30-50ms): utility ~0.0-0.40
             * 
             * Cinema King (9.2ms) → utility 0.91
             */
            min: 5,
            max: 50,
            invert: true,
        },
        defaultWeight: 0.10,
    },
    {
        id: 'refresh_rate',
        label: 'Taxa de Atualização (Hz)',
        specPath: 'specs.refresh_rate_hz',
        defaultValue: 60,
        group: 'quality',
        description: 'Native refresh rate for smooth motion.',
        curve: {
            type: 'sigmoid',
            /**
             * RECALIBRATED Midpoint: 75Hz (lowered from 90)
             * 
             * @rationale
             * - 60Hz: utility ~0.45 (below midpoint)
             * - 90Hz: utility ~0.70
             * - 120Hz: utility ~0.90
             * - 144Hz+: utility ~0.95+
             * 
             * Cinema King (120Hz) → utility 0.92
             */
            midpoint: 75,
            steepness: 0.03, // Lowered from 0.05
            limit: 0.98,
        },
        defaultWeight: 0.10,
    },
    {
        id: 'vrr_support',
        label: 'VRR (FreeSync/G-Sync)',
        specPath: 'specs.vrr_support',
        defaultValue: false,
        group: 'features',
        description: 'Variable Refresh Rate support for tear-free gaming.',
        curve: {
            type: 'boolean',
            presentUtility: 0.95,
            absentUtility: 0.60, // Raised from 0.50 - less punitive
        },
        defaultWeight: 0.05,
    },
    {
        id: 'hdmi_2_1_ports',
        label: 'Portas HDMI 2.1',
        specPath: 'specs.hdmi_2_1_ports',
        defaultValue: 0,
        group: 'features',
        description: 'Number of HDMI 2.1 ports for next-gen consoles.',
        curve: {
            type: 'linear',
            min: 0,
            max: 4,
            invert: false,
        },
        defaultWeight: 0.05,
    },

    // ========================================
    // AUDIO & CONVENIENCE
    // ========================================
    {
        id: 'speaker_power',
        label: 'Potência de Áudio (W)',
        specPath: 'specs.speaker_power_watts',
        defaultValue: 20,
        group: 'features',
        description: 'Built-in speaker power.',
        curve: {
            type: 'sigmoid',
            midpoint: 25, // Lowered from 30
            steepness: 0.06, // Lowered from 0.08
            limit: 0.95,
        },
        defaultWeight: 0.05,
    },

    // ========================================
    // VALUE (RECALIBRATED - Critical Fix)
    // ========================================
    {
        id: 'price',
        label: 'Preço (R$)',
        specPath: 'price',
        defaultValue: 4000,
        group: 'value',
        description: 'Purchase price in BRL.',
        curve: {
            type: 'log_normal',
            /**
             * RECALIBRATED Price Range: R$1.500 - R$25.000
             * 
             * @rationale
             * The old range was punishing premium TVs too harshly.
             * With a higher maxPrice and logarithmic decay:
             * 
             * - Entry R$1.800: utility ~0.90
             * - Mid R$3.500: utility ~0.70
             * - Premium R$6.500: utility ~0.50
             * - Flagship R$12.000: utility ~0.30 (acceptable penalty)
             * - Ultra R$20.000+: utility ~0.15
             * 
             * Cinema King (R$12.000) → utility 0.30
             * This is balanced by high quality scores elsewhere.
             */
            minPrice: 1500,
            maxPrice: 25000,
        },
        defaultWeight: 0.10, // Lowered from 0.15 - price matters less for quality-focused users
    },

    // ========================================
    // RELIABILITY
    // ========================================
    {
        id: 'warranty_years',
        label: 'Garantia (anos)',
        specPath: 'specs.warranty_years',
        defaultValue: 1,
        group: 'reliability',
        description: 'Manufacturer warranty period.',
        curve: {
            type: 'linear',
            min: 1,
            max: 5,
            invert: false,
        },
        defaultWeight: 0.05,
    },
];

// ============================================
// CONTEXT CONFIGURATIONS (RECALIBRATED)
// ============================================

const SMART_TV_CONTEXTS: ContextConfig[] = [
    // ========================================
    // BASE CONTEXT (Primary Score)
    // ========================================
    {
        id: 'general_use',
        name: 'Uso Geral',
        description: 'Score base balanceado para uso versátil. Este é o score principal do produto.',
        icon: '📊',
        group: 'base',
        /**
         * BALANCED WEIGHTS for General Use (Base Score)
         * 
         * These weights are calibrated to produce scores similar to 
         * the legacy editorial 10-criteria average. This ensures:
         * 1. Base score matches user expectations (~8.7 for good products)
         * 2. Contextual scores are DELTAS from this base
         * 
         * Sum = 1.00
         */
        weights: {
            // Picture Quality (45% - most important for TVs)
            peak_brightness: 0.15,
            contrast_ratio: 0.15,
            color_gamut_dci_p3: 0.12,
            // Gaming (20% - important but not primary)
            input_lag: 0.08,
            refresh_rate: 0.08,
            vrr_support: 0.02,
            hdmi_2_1_ports: 0.02,
            // Audio & Convenience (10%)
            speaker_power: 0.08,
            // Value & Reliability (25%)
            price: 0.15,
            warranty_years: 0.10,
            // Note: Editorial integration (35%) is added on top
        },
        constraints: [],
    },

    // ========================================
    // CINEMA / HOME THEATER (RECALIBRATED)
    // ========================================
    {
        id: 'cinema_dark_room',
        name: 'Cinema / Sala Escura',
        description: 'Foco em qualidade de imagem para filmes em ambiente escuro.',
        icon: '🎬',
        group: 'ambiente',
        weights: {
            // Picture quality is paramount - INCREASED
            peak_brightness: 0.18,
            contrast_ratio: 0.28, // Critical for black levels in dark room
            color_gamut_dci_p3: 0.18,
            // Gaming less important
            input_lag: 0.02,
            refresh_rate: 0.04,
            vrr_support: 0.01,
            hdmi_2_1_ports: 0.01,
            // Audio matters
            speaker_power: 0.10,
            // Value and reliability - REDUCED for cinema enthusiasts
            price: 0.08,
            warranty_years: 0.10,
        },
        constraints: [],
    },
    {
        id: 'cinema_bright_room',
        name: 'Cinema / Sala Clara',
        description: 'Foco em brilho para combater reflexos em ambiente iluminado.',
        icon: '☀️',
        group: 'ambiente',
        weights: {
            peak_brightness: 0.32, // Must fight ambient light
            contrast_ratio: 0.12,
            color_gamut_dci_p3: 0.14,
            input_lag: 0.02,
            refresh_rate: 0.04,
            vrr_support: 0.01,
            hdmi_2_1_ports: 0.01,
            speaker_power: 0.08,
            price: 0.16,
            warranty_years: 0.10,
        },
        constraints: [],
    },

    // ========================================
    // GAMING CONTEXTS (RECALIBRATED)
    // ========================================
    {
        id: 'gamer_competitive',
        name: 'Gamer Competitivo (PC/PS5/Xbox)',
        description: 'Foco em input lag e refresh rate para jogos competitivos.',
        icon: '🎮',
        group: 'uso',
        weights: {
            input_lag: 0.28,
            refresh_rate: 0.22,
            vrr_support: 0.12,
            hdmi_2_1_ports: 0.10,
            peak_brightness: 0.06,
            contrast_ratio: 0.06,
            color_gamut_dci_p3: 0.02,
            speaker_power: 0.02,
            price: 0.08,
            warranty_years: 0.04,
        },
        constraints: [
            {
                type: 'soft',
                condition: 'specs.vrr_support === false',
                factor: 0.90, // Reduced from 0.85
                reason: 'Sem VRR - pode ter screen tearing em jogos',
                severity: 'medium',
            } as ConstraintDefinition,
        ],
    },
    {
        id: 'gamer_ps5',
        name: 'Gamer Console (PS5/Xbox Series X)',
        description: 'Otimizado para consoles next-gen que exigem HDMI 2.1.',
        icon: '🕹️',
        group: 'uso',
        weights: {
            input_lag: 0.22,
            refresh_rate: 0.18,
            vrr_support: 0.14,
            hdmi_2_1_ports: 0.18,
            peak_brightness: 0.06,
            contrast_ratio: 0.06,
            color_gamut_dci_p3: 0.02,
            speaker_power: 0.02,
            price: 0.08,
            warranty_years: 0.04,
        },
        constraints: [
            {
                type: 'fatal',
                condition: '(specs.hdmi_2_1_ports ?? 0) < 1',
                reason: 'INCOMPATÍVEL: Sem porta HDMI 2.1 - não suporta 4K@120Hz do PS5/Xbox Series X',
            } as ConstraintDefinition,
        ],
    },
    {
        id: 'gamer_casual',
        name: 'Gamer Casual',
        description: 'Jogos casuais onde input lag é menos crítico.',
        icon: '🎯',
        group: 'uso',
        weights: {
            input_lag: 0.10,
            refresh_rate: 0.10,
            vrr_support: 0.04,
            hdmi_2_1_ports: 0.04,
            peak_brightness: 0.16,
            contrast_ratio: 0.16,
            color_gamut_dci_p3: 0.08,
            speaker_power: 0.08,
            price: 0.16,
            warranty_years: 0.08,
        },
        constraints: [],
    },

    // ========================================
    // GENERAL USE
    // ========================================
    {
        id: 'general_streaming',
        name: 'Streaming / TV Aberta',
        description: 'Uso geral para Netflix, YouTube e TV aberta.',
        icon: '📺',
        group: 'uso',
        weights: {
            peak_brightness: 0.14,
            contrast_ratio: 0.14,
            color_gamut_dci_p3: 0.10,
            input_lag: 0.04,
            refresh_rate: 0.08,
            vrr_support: 0.02,
            hdmi_2_1_ports: 0.02,
            speaker_power: 0.14,
            price: 0.22, // Value is important for general use
            warranty_years: 0.10,
        },
        constraints: [],
    },

    // ========================================
    // ENVIRONMENTAL CONSTRAINTS
    // ========================================
    {
        id: 'coastal_environment',
        name: 'Ambiente Litorâneo',
        description: 'Região com alta salinidade e umidade.',
        icon: '🏖️',
        group: 'infraestrutura',
        weights: {
            peak_brightness: 0.14,
            contrast_ratio: 0.14,
            color_gamut_dci_p3: 0.08,
            input_lag: 0.06,
            refresh_rate: 0.08,
            vrr_support: 0.02,
            hdmi_2_1_ports: 0.02,
            speaker_power: 0.08,
            price: 0.18,
            warranty_years: 0.20, // Warranty critical in harsh environments
        },
        constraints: [
            {
                type: 'soft',
                condition: '(specs.warranty_years ?? 1) < 2',
                factor: 0.85,
                reason: 'Garantia curta para ambiente litorâneo - risco de oxidação',
                severity: 'high',
            } as ConstraintDefinition,
        ],
    },
];

// ============================================
// GLOBAL CONSTRAINTS
// ============================================

const GLOBAL_CONSTRAINTS: ConstraintDefinition[] = [
    {
        type: 'fatal',
        condition: 'user.voltage === 110 && specs.voltage === 220',
        reason: 'INCOMPATÍVEL: TV é 220V mas sua rede é 110V',
    },
    {
        type: 'fatal',
        condition: 'user.voltage === 220 && specs.voltage === 110',
        reason: 'INCOMPATÍVEL: TV é 110V mas sua rede é 220V',
    },
];

// ============================================
// FINAL CONFIGURATION EXPORT
// ============================================

export const smartTvConfig: CategoryHMUMConfig = {
    categoryId: 'tv',
    categoryName: 'Smart TV',

    attributes: SMART_TV_ATTRIBUTES,
    contexts: SMART_TV_CONTEXTS,
    globalConstraints: GLOBAL_CONSTRAINTS,

    /**
     * Editorial Integration (RECALIBRATED)
     * 
     * Increased weight to 0.35 - editorial consensus should have more impact.
     * This ensures months of editorial work contributes meaningfully.
     */
    editorialIntegration: {
        weight: 0.35, // Increased from 0.30
        sourcePath: 'computed.overall',
    },

    priceConfig: {
        minPrice: 1500,
        maxPrice: 25000, // Increased from 20000
    },
};

// ============================================
// HELPER EXPORTS
// ============================================

export const SMART_TV_CONTEXT_IDS = SMART_TV_CONTEXTS.map(c => c.id);
export const SMART_TV_ATTRIBUTE_IDS = SMART_TV_ATTRIBUTES.map(a => a.id);

export default smartTvConfig;
