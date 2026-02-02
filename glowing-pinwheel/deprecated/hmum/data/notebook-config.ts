/**
 * @file notebook-config.ts
 * @description HMUM Configuration for Notebook/Laptop Category
 * 
 * Second category migrated to HMUM architecture.
 * Focuses on performance, portability, and use-case contexts.
 * 
 * @version 1.0.0
 * @created 2026-01-11
 */

import type {
    CategoryHMUMConfig,
    AttributeDefinition,
    ContextConfig,
    ConstraintDefinition,
} from '@/lib/scoring/hmum-types';

// ============================================
// ATTRIBUTE DEFINITIONS
// ============================================

const NOTEBOOK_ATTRIBUTES: AttributeDefinition[] = [
    // ========================================
    // PERFORMANCE
    // ========================================
    {
        id: 'cpu_score',
        label: 'Desempenho CPU (PassMark)',
        specPath: 'specs.cpu_passmark_score',
        defaultValue: 10000,
        group: 'performance',
        description: 'CPU benchmark score based on PassMark. Higher = faster multitasking.',
        curve: {
            type: 'sigmoid',
            /**
             * Midpoint: 15000 (PassMark score)
             * 
             * @rationale (Brazilian Market 2026)
             * - Entry Intel Celeron/Pentium: 3000-6000 → utility ~0.20-0.35
             * - Budget i3/Ryzen 3: 8000-12000 → utility ~0.40-0.55
             * - Mainstream i5/Ryzen 5: 15000-20000 → utility ~0.55-0.75
             * - Performance i7/Ryzen 7: 22000-30000 → utility ~0.80-0.92
             * - Workstation i9/Ryzen 9: 35000+ → utility ~0.95+
             */
            midpoint: 15000,
            steepness: 0.00012,
            limit: 0.98,
        },
        defaultWeight: 0.18,
    },
    {
        id: 'gpu_class',
        label: 'Classe da GPU',
        specPath: 'specs.gpu_class',
        defaultValue: 1,
        group: 'performance',
        description: 'GPU classification: 0=Integrated, 1=Entry Dedicated, 2=Mid Dedicated, 3=High-End',
        curve: {
            type: 'linear',
            /**
             * GPU Class Scale:
             * 0 = Integrated (Intel UHD, AMD Vega) → utility ~0.0
             * 1 = Entry Dedicated (GTX 1650, RTX 3050) → utility ~0.33
             * 2 = Mid Dedicated (RTX 3060, RTX 4060) → utility ~0.66
             * 3 = High-End (RTX 3080, RTX 4080+) → utility ~1.0
             */
            min: 0,
            max: 3,
            invert: false,
        },
        defaultWeight: 0.12,
    },
    {
        id: 'ram_gb',
        label: 'Memória RAM (GB)',
        specPath: 'specs.ram_gb',
        defaultValue: 8,
        group: 'performance',
        description: 'RAM capacity in GB. Critical for multitasking and development.',
        curve: {
            type: 'sigmoid',
            /**
             * Midpoint: 12GB
             * 
             * @rationale
             * - 4GB: utility ~0.15 (barely usable in 2026)
             * - 8GB: utility ~0.40 (acceptable)
             * - 16GB: utility ~0.80 (good)
             * - 32GB: utility ~0.95 (excellent)
             * - 64GB+: utility ~0.98
             */
            midpoint: 12,
            steepness: 0.15,
            limit: 0.98,
        },
        defaultWeight: 0.10,
    },

    // ========================================
    // DISPLAY
    // ========================================
    {
        id: 'screen_resolution_score',
        label: 'Resolução da Tela',
        specPath: 'specs.screen_resolution_score',
        defaultValue: 1,
        group: 'display',
        description: 'Resolution score: 0=HD, 1=FHD, 2=2K/QHD, 3=4K/UHD',
        curve: {
            type: 'linear',
            min: 0,
            max: 3,
            invert: false,
        },
        defaultWeight: 0.08,
    },
    {
        id: 'screen_size',
        label: 'Tamanho da Tela (polegadas)',
        specPath: 'specs.screen_size_inches',
        defaultValue: 15.6,
        group: 'display',
        description: 'Screen diagonal in inches.',
        curve: {
            type: 'sigmoid',
            /**
             * Midpoint: 14" (sweet spot for portability vs usability)
             * 
             * Note: This is context-dependent:
             * - Mobility users prefer 13-14" (lower midpoint = higher utility for smaller)
             * - Workstation users prefer 15-17" (higher midpoint)
             */
            midpoint: 14,
            steepness: 0.3,
            limit: 0.95,
        },
        defaultWeight: 0.05,
    },

    // ========================================
    // PORTABILITY
    // ========================================
    {
        id: 'weight_kg',
        label: 'Peso (kg)',
        specPath: 'specs.weight_kg',
        defaultValue: 2.0,
        group: 'portability',
        description: 'Device weight in kilograms. Lower is better for mobility.',
        curve: {
            type: 'linear',
            /**
             * INVERTED: Lower weight = higher utility
             * 
             * - Ultralight: 0.9-1.2kg → utility ~0.85-0.95
             * - Light: 1.3-1.6kg → utility ~0.70-0.80
             * - Standard: 1.7-2.2kg → utility ~0.50-0.65
             * - Heavy: 2.3-3.0kg → utility ~0.25-0.45
             * - Desktop Replacement: 3.0+kg → utility ~0.0-0.20
             */
            min: 0.9,
            max: 3.5,
            invert: true,
        },
        defaultWeight: 0.10,
    },
    {
        id: 'battery_hours',
        label: 'Duração de Bateria (horas)',
        specPath: 'specs.battery_hours',
        defaultValue: 6,
        group: 'portability',
        description: 'Estimated real-world battery life in hours.',
        curve: {
            type: 'sigmoid',
            /**
             * Midpoint: 7 hours
             * 
             * - Poor: 3-4h → utility ~0.25-0.35
             * - Acceptable: 5-6h → utility ~0.40-0.50
             * - Good: 7-10h → utility ~0.55-0.80
             * - Excellent: 12-15h → utility ~0.90-0.95
             * - All-day: 18h+ → utility ~0.97
             */
            midpoint: 7,
            steepness: 0.2,
            limit: 0.98,
        },
        defaultWeight: 0.10,
    },

    // ========================================
    // STORAGE
    // ========================================
    {
        id: 'storage_gb',
        label: 'Armazenamento (GB)',
        specPath: 'specs.storage_gb',
        defaultValue: 256,
        group: 'storage',
        description: 'Primary storage capacity in GB.',
        curve: {
            type: 'sigmoid',
            /**
             * Midpoint: 400GB
             * 
             * - 128GB: utility ~0.25 (barely usable)
             * - 256GB: utility ~0.40
             * - 512GB: utility ~0.70
             * - 1TB: utility ~0.90
             * - 2TB+: utility ~0.97
             */
            midpoint: 400,
            steepness: 0.005,
            limit: 0.98,
        },
        defaultWeight: 0.06,
    },
    {
        id: 'storage_type',
        label: 'Tipo de Armazenamento',
        specPath: 'specs.storage_is_ssd',
        defaultValue: true,
        group: 'storage',
        description: 'SSD vs HDD. SSD is vastly superior for performance.',
        curve: {
            type: 'boolean',
            presentUtility: 0.95, // SSD
            absentUtility: 0.30, // HDD - severe penalty in 2026
        },
        defaultWeight: 0.05,
    },

    // ========================================
    // VALUE & RELIABILITY
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
             * Brazilian Market Range: R$2.000 - R$20.000
             * 
             * - Budget: R$2.000-3.000 → utility ~0.85-0.75
             * - Entry: R$3.500-5.000 → utility ~0.65-0.50
             * - Mid: R$5.500-8.000 → utility ~0.45-0.30
             * - Premium: R$10.000-15.000 → utility ~0.20-0.12
             * - Ultra: R$18.000+ → utility ~0.08
             */
            minPrice: 2000,
            maxPrice: 20000,
        },
        defaultWeight: 0.10,
    },
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
            max: 3,
            invert: false,
        },
        defaultWeight: 0.06,
    },
];

// ============================================
// CONTEXT CONFIGURATIONS
// ============================================

const NOTEBOOK_CONTEXTS: ContextConfig[] = [
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
         * Calibrated to match legacy editorial average expectations.
         * Sum = 1.00
         */
        weights: {
            // Performance (40%)
            cpu_score: 0.16,
            gpu_class: 0.10,
            ram_gb: 0.10,
            // Display (15%)
            screen_resolution_score: 0.08,
            screen_size: 0.05,
            // Portability (20%)
            weight_kg: 0.10,
            battery_hours: 0.10,
            // Storage (10%)
            storage_gb: 0.06,
            storage_type: 0.05,
            // Value & Reliability (15%)
            price: 0.12,
            warranty_years: 0.08,
        },
        constraints: [],
    },

    // ========================================
    // OFFICE & PRODUCTIVITY
    // ========================================
    {
        id: 'office_mobility',

        name: 'Escritório Mobile',
        description: 'Profissionais que precisam trabalhar em qualquer lugar.',
        icon: '💼',
        group: 'uso',
        weights: {
            // Portability is paramount
            weight_kg: 0.22,
            battery_hours: 0.20,
            // Moderate performance needs
            cpu_score: 0.12,
            ram_gb: 0.10,
            gpu_class: 0.02, // Don't need dedicated GPU
            // Screen
            screen_resolution_score: 0.08,
            screen_size: 0.06,
            // Storage
            storage_gb: 0.06,
            storage_type: 0.04,
            // Value
            price: 0.06,
            warranty_years: 0.04,
        },
        constraints: [],
    },
    {
        id: 'home_office',
        name: 'Home Office',
        description: 'Trabalho remoto em casa, menos foco em portabilidade.',
        icon: '🏠',
        group: 'uso',
        weights: {
            // Performance more important than portability
            cpu_score: 0.18,
            ram_gb: 0.14,
            gpu_class: 0.04,
            // Screen quality matters for long hours
            screen_resolution_score: 0.12,
            screen_size: 0.10,
            // Portability less critical
            weight_kg: 0.04,
            battery_hours: 0.06,
            // Storage
            storage_gb: 0.10,
            storage_type: 0.06,
            // Value
            price: 0.10,
            warranty_years: 0.06,
        },
        constraints: [],
    },

    // ========================================
    // GAMING
    // ========================================
    {
        id: 'gamer_laptop',
        name: 'Gamer Laptop',
        description: 'Gaming portátil com máxima performance gráfica.',
        icon: '🎮',
        group: 'uso',
        weights: {
            // GPU is king
            gpu_class: 0.28,
            cpu_score: 0.18,
            ram_gb: 0.12,
            // Display quality
            screen_resolution_score: 0.10,
            screen_size: 0.06,
            // Portability secondary
            weight_kg: 0.04,
            battery_hours: 0.04,
            // Storage
            storage_gb: 0.08,
            storage_type: 0.04,
            // Value
            price: 0.04,
            warranty_years: 0.02,
        },
        constraints: [
            // FATAL: Cannot game AAA titles on integrated graphics
            {
                type: 'fatal',
                condition: '(specs.gpu_class ?? 0) < 1',
                reason: 'INCOMPATÍVEL: GPU integrada não suporta jogos AAA - precisa de GPU dedicada',
            } as ConstraintDefinition,
        ],
    },
    {
        id: 'gamer_casual',
        name: 'Gamer Casual / E-Sports',
        description: 'Jogos leves como LoL, Valorant, CS2.',
        icon: '🎯',
        group: 'uso',
        weights: {
            // Entry GPU is fine for e-sports
            gpu_class: 0.18,
            cpu_score: 0.16,
            ram_gb: 0.10,
            // Display
            screen_resolution_score: 0.08,
            screen_size: 0.06,
            // Portability balanced
            weight_kg: 0.08,
            battery_hours: 0.08,
            // Storage
            storage_gb: 0.08,
            storage_type: 0.06,
            // Value matters for casuals
            price: 0.08,
            warranty_years: 0.04,
        },
        constraints: [],
    },

    // ========================================
    // STUDENT & BUDGET
    // ========================================
    {
        id: 'student_budget',
        name: 'Estudante / Orçamento Limitado',
        description: 'Máximo valor com custo acessível.',
        icon: '🎓',
        group: 'uso',
        weights: {
            // Value is paramount
            price: 0.24,
            warranty_years: 0.08,
            // Basic performance
            cpu_score: 0.12,
            ram_gb: 0.10,
            gpu_class: 0.02,
            // Portability for commute
            weight_kg: 0.10,
            battery_hours: 0.12,
            // Storage
            storage_gb: 0.08,
            storage_type: 0.06,
            // Screen
            screen_resolution_score: 0.04,
            screen_size: 0.04,
        },
        constraints: [],
    },

    // ========================================
    // CREATOR & DEVELOPMENT
    // ========================================
    {
        id: 'content_creator',
        name: 'Criador de Conteúdo',
        description: 'Edição de vídeo, design gráfico, streaming.',
        icon: '🎨',
        group: 'uso',
        weights: {
            // Heavy performance needs
            cpu_score: 0.20,
            gpu_class: 0.18,
            ram_gb: 0.16,
            // Display quality critical
            screen_resolution_score: 0.14,
            screen_size: 0.06,
            // Large storage for projects
            storage_gb: 0.10,
            storage_type: 0.04,
            // Portability less critical (studio work)
            weight_kg: 0.02,
            battery_hours: 0.04,
            // Value
            price: 0.04,
            warranty_years: 0.02,
        },
        constraints: [
            {
                type: 'soft',
                condition: '(specs.ram_gb ?? 8) < 16',
                factor: 0.85,
                reason: 'Memória RAM abaixo de 16GB - limitado para edição de vídeo',
                severity: 'medium',
            } as ConstraintDefinition,
        ],
    },
    {
        id: 'developer',
        name: 'Desenvolvedor / Programação',
        description: 'IDEs, Docker, compilação, múltiplas VMs.',
        icon: '💻',
        group: 'uso',
        weights: {
            // RAM and CPU are critical for dev work
            cpu_score: 0.22,
            ram_gb: 0.20,
            gpu_class: 0.04, // Not needed unless ML/AI
            // Large SSD for builds
            storage_gb: 0.12,
            storage_type: 0.08,
            // Good screen for long coding sessions
            screen_resolution_score: 0.10,
            screen_size: 0.06,
            // Some portability for coffee shops
            weight_kg: 0.06,
            battery_hours: 0.06,
            // Value
            price: 0.04,
            warranty_years: 0.02,
        },
        constraints: [
            {
                type: 'soft',
                condition: '(specs.ram_gb ?? 8) < 16',
                factor: 0.80,
                reason: 'Memória RAM abaixo de 16GB - Docker e VMs serão lentos',
                severity: 'high',
            } as ConstraintDefinition,
        ],
    },
];

// ============================================
// GLOBAL CONSTRAINTS
// ============================================

const GLOBAL_CONSTRAINTS: ConstraintDefinition[] = [
    // Voltage (less common for laptops with universal adapters, but possible)
    {
        type: 'fatal',
        condition: 'user.voltage === 110 && specs.voltage === 220',
        reason: 'INCOMPATÍVEL: Carregador é apenas 220V mas sua rede é 110V',
    },
    {
        type: 'fatal',
        condition: 'user.voltage === 220 && specs.voltage === 110',
        reason: 'INCOMPATÍVEL: Carregador é apenas 110V mas sua rede é 220V',
    },
];

// ============================================
// FINAL CONFIGURATION EXPORT
// ============================================

export const notebookConfig: CategoryHMUMConfig = {
    categoryId: 'notebook',
    categoryName: 'Notebook / Laptop',

    attributes: NOTEBOOK_ATTRIBUTES,
    contexts: NOTEBOOK_CONTEXTS,
    globalConstraints: GLOBAL_CONSTRAINTS,

    /**
     * Editorial Integration
     * 
     * Editorial score from computed.overall contributes 30%.
     */
    editorialIntegration: {
        weight: 0.30,
        sourcePath: 'computed.overall',
    },

    priceConfig: {
        minPrice: 2000,
        maxPrice: 20000,
    },
};

// ============================================
// HELPER EXPORTS
// ============================================

export const NOTEBOOK_CONTEXT_IDS = NOTEBOOK_CONTEXTS.map(c => c.id);
export const NOTEBOOK_ATTRIBUTE_IDS = NOTEBOOK_ATTRIBUTES.map(a => a.id);

export default notebookConfig;
