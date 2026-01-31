/**
 * @file pdp-completeness-spec.ts
 * @description PDP Completeness Specification
 * 
 * Defines REQUIRED, REQUIRED_WHEN_MATURE, and OPTIONAL modules for PDP.
 * "Maturity" = category has >= MATURITY_THRESHOLD published products.
 * 
 * @version 1.0.0
 */

// ============================================
// MATURITY THRESHOLD
// ============================================

/** Category is "mature" if it has >= this many products */
export const MATURITY_THRESHOLD = 2;

// ============================================
// MODULE STATUS TYPES
// ============================================

export type ModuleRequirement =
    | 'REQUIRED'           // Must exist always
    | 'REQUIRED_WHEN_MATURE' // Must exist if category >= MATURITY_THRESHOLD products
    | 'OPTIONAL';          // Nice to have, can be coming_soon

export type ModuleStatus = 'PASS' | 'WARN' | 'FAIL';

// ============================================
// PDP COMPLETENESS SPEC
// ============================================

export interface ModuleSpec {
    id: string;
    name: string;
    requirement: ModuleRequirement;
    /** When allowed to be coming_soon */
    allowedComingSoon: boolean;
    /** Validation rules */
    rules: {
        /** Field must exist and be non-empty */
        requiredFields?: string[];
        /** Minimum number of items if array */
        minItems?: number;
        /** Custom validator function name */
        customValidator?: string;
    };
    /** Reason shown when module is allowed as coming_soon */
    immmatureReason?: string;
}

/**
 * Complete PDP Modules Specification
 * Based on gold standard: roborock-q7-l5
 */
export const PDP_MODULES_SPEC: ModuleSpec[] = [
    // ============================================
    // REQUIRED UNIVERSAL (must exist for ALL products)
    // ============================================
    {
        id: 'header',
        name: 'Header (Score + Title)',
        requirement: 'REQUIRED',
        allowedComingSoon: false,
        rules: {
            requiredFields: ['overallScore', 'title', 'subtitle'],
        },
    },
    {
        id: 'audit_verdict',
        name: 'Veredito da Auditoria',
        requirement: 'REQUIRED',
        allowedComingSoon: false,
        rules: {
            requiredFields: ['solution', 'attentionPoint', 'technicalConclusion'],
            minItems: 3, // solution.items >= 3
        },
    },
    {
        id: 'product_dna',
        name: 'DNA do Produto (Radar)',
        requirement: 'REQUIRED',
        allowedComingSoon: false,
        rules: {
            requiredFields: ['dimensions'],
            minItems: 10, // 10 dimensions
        },
    },
    {
        id: 'decision_faq',
        name: 'Perguntas Decisivas',
        requirement: 'REQUIRED',
        allowedComingSoon: false,
        rules: {
            minItems: 3, // At least 3 FAQ items
        },
    },

    // ============================================
    // REQUIRED WHEN CATEGORY SUPPORTS
    // ============================================
    {
        id: 'simulators',
        name: 'Simuladores Inteligentes',
        requirement: 'REQUIRED',
        allowedComingSoon: false,
        rules: {
            requiredFields: ['sizeAlert', 'energyAlert'],
        },
    },
    {
        id: 'simulator_recommendations',
        name: 'Recomendações nos Simuladores',
        requirement: 'REQUIRED_WHEN_MATURE',
        allowedComingSoon: true,
        immmatureReason: 'Primeiro produto da categoria — alternativas serão ativadas quando houver mais itens',
        rules: {
            customValidator: 'hasRecommendedProducts',
        },
    },
    {
        id: 'context_score',
        name: 'Score Contextual (HMUM)',
        requirement: 'REQUIRED_WHEN_MATURE',
        allowedComingSoon: true,
        immmatureReason: 'HMUM em fase de calibração para esta categoria',
        rules: {
            customValidator: 'supportsContextualScoring',
        },
    },
    {
        id: 'community_consensus',
        name: 'Consenso da Comunidade',
        requirement: 'REQUIRED_WHEN_MATURE',
        allowedComingSoon: true,
        immmatureReason: 'Dados de comunidade sendo coletados',
        rules: {
            requiredFields: ['rating', 'bullets'],
            minItems: 3, // At least 3 community bullets
        },
    },
    {
        id: 'interactive_tools',
        name: 'Ferramentas Interativas',
        requirement: 'REQUIRED_WHEN_MATURE',
        allowedComingSoon: true,
        immmatureReason: 'Ferramentas em desenvolvimento para esta categoria',
        rules: {
            customValidator: 'categorySupportsTools',
        },
    },

    // ============================================
    // OPTIONAL (nice to have)
    // ============================================
    {
        id: 'manual_link',
        name: 'Link do Manual',
        requirement: 'OPTIONAL',
        allowedComingSoon: true,
        rules: {
            customValidator: 'hasValidManualLink',
        },
    },
    {
        id: 'hidden_engineering',
        name: 'Engenharia Oculta',
        requirement: 'OPTIONAL',
        allowedComingSoon: true,
        rules: {
            minItems: 1,
        },
    },
    {
        id: 'tco_analysis',
        name: 'Análise TCO',
        requirement: 'OPTIONAL',
        allowedComingSoon: true,
        rules: {
            customValidator: 'categoryHasTcoConfig',
        },
    },
];

// ============================================
// CATEGORY PRODUCT COUNTS (runtime populated)
// ============================================

export interface CategoryMaturity {
    categoryId: string;
    productCount: number;
    isMature: boolean;
}

// ============================================
// VALIDATION RESULT
// ============================================

export interface ModuleValidationResult {
    moduleId: string;
    moduleName: string;
    requirement: ModuleRequirement;
    status: ModuleStatus;
    reason?: string;
    details?: string[];
}

export interface ProductValidationResult {
    productId: string;
    categoryId: string;
    isCategoryMature: boolean;
    categoryProductCount: number;
    modules: ModuleValidationResult[];
    overallStatus: ModuleStatus;
    failCount: number;
    warnCount: number;
    passCount: number;
}

// ============================================
// EXIT CODES
// ============================================

export const EXIT_CODES = {
    PASS: 0,      // All modules PASS or acceptable WARN
    WARN: 1,      // Has WARNs but no FAILs
    FAIL: 2,      // Has FAILs (REQUIRED modules missing)
};
