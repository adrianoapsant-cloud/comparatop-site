/**
 * @file product.ts
 * @description Product Schema (Zod) - Single Source of Truth
 * 
 * Este schema define o contrato canônico para produtos no ComparaTop.
 * Todas as superfícies (home, categoria, PDP, comparações) devem 
 * consumir dados que passem por este schema.
 * 
 * @see src/lib/viewmodels/productVM.ts - ViewModel que consome este schema
 * @see src/lib/services/productService.ts - Serviço que valida contra este schema
 */

import { z } from 'zod';

// ============================================
// SUB-SCHEMAS
// ============================================

/**
 * Oferta de produto em uma loja
 */
export const ProductOfferSchema = z.object({
    store: z.string().min(1),
    storeSlug: z.string().min(1),
    price: z.number().positive(),
    originalPrice: z.number().positive().optional(),
    url: z.string().url(),
    affiliateUrl: z.string().optional(),
    inStock: z.boolean(),
    lastChecked: z.string(), // ISO date
});

/**
 * Voice of Customer synthesis
 */
export const VoCSchema = z.object({
    totalReviews: z.number().nonnegative(),
    averageRating: z.number().min(0).max(5),
    oneLiner: z.string(),
    summary: z.string(),
    pros: z.array(z.string()),
    cons: z.array(z.string()),
    sources: z.array(z.object({
        name: z.string(),
        url: z.string(),
        count: z.number(),
    })),
});

/**
 * Feature-Benefit mapping para PDP
 */
export const FeatureBenefitSchema = z.object({
    icon: z.string(),
    title: z.string(),
    description: z.string(),
});

/**
 * Benchmark score para gráficos de comparação
 */
export const BenchmarkScoreSchema = z.object({
    label: z.string(),
    productValue: z.number(),
    categoryAverage: z.number(),
    unit: z.string(),
    higherIsBetter: z.boolean().optional(),
});

/**
 * Ponto de histórico de preço
 */
export const PricePointSchema = z.object({
    date: z.string(),
    price: z.number().positive(),
});

/**
 * Diferença chave entre produtos
 */
export const KeyDifferenceSchema = z.object({
    label: z.string(),
    current: z.string(),
    rival: z.string(),
    winner: z.enum(['current', 'rival', 'draw']),
});

/**
 * Competidor principal para comparação on-page
 */
export const MainCompetitorSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    shortName: z.string().optional(),
    image: z.string().optional(),
    imageUrl: z.string().optional(),
    price: z.number().positive(),
    score: z.number().min(0).max(10).optional(),
    keyDifferences: z.array(KeyDifferenceSchema).length(3),
});

/**
 * Badges editoriais disponíveis
 */
export const ProductBadgeSchema = z.enum([
    'editors-choice',
    'best-value',
    'premium-pick',
    'budget-pick',
    'most-popular',
    'gamer',
    'attention-battery',
    'attention-support',
    'attention-noise',
    'attention-durability',
]);

/**
 * Scores por critério (c1-c10)
 */
export const ScoresSchema = z.object({
    c1: z.number().min(0).max(10),
    c2: z.number().min(0).max(10),
    c3: z.number().min(0).max(10),
    c4: z.number().min(0).max(10),
    c5: z.number().min(0).max(10),
    c6: z.number().min(0).max(10),
    c7: z.number().min(0).max(10),
    c8: z.number().min(0).max(10),
    c9: z.number().min(0).max(10),
    c10: z.number().min(0).max(10),
}).catchall(z.number().min(0).max(10)); // Permite campos extras como 'gaming', 'imageQuality'

// ============================================
// MAIN PRODUCT SCHEMA
// ============================================

/**
 * Schema completo do produto
 * 
 * Campos OBRIGATÓRIOS:
 * - id: Slug único do produto
 * - categoryId: ID da categoria
 * - name: Nome completo
 * - brand: Marca
 * - price: Preço atual
 * - scores: Notas c1-c10
 */
export const ProductSchema = z.object({
    // === CAMPOS OBRIGATÓRIOS ===
    id: z.string().min(1, 'ID é obrigatório'),
    categoryId: z.string().min(1, 'categoryId é obrigatório'),
    name: z.string().min(1, 'Nome é obrigatório'),
    brand: z.string().min(1, 'Marca é obrigatória'),
    price: z.number().positive('Preço deve ser positivo'),
    scores: ScoresSchema,

    // === CAMPOS OPCIONAIS (Identificação) ===
    shortName: z.string().optional(),
    model: z.string().optional(),
    imageUrl: z.string().optional(),
    asin: z.string().optional(),

    // === CAMPOS OPCIONAIS (Especificações) ===
    specs: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
    technicalSpecs: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
    attributes: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.array(z.string())])).optional(),

    // === CAMPOS OPCIONAIS (Editorial) ===
    scoreReasons: z.record(z.string(), z.string()).optional(),
    painPointsSolved: z.array(z.string()).optional(),
    badges: z.array(ProductBadgeSchema).optional(),
    lastUpdated: z.string().optional(),

    // === CAMPOS OPCIONAIS (Comercial) ===
    voc: VoCSchema.optional(),
    offers: z.array(ProductOfferSchema).optional(),

    // === CAMPOS OPCIONAIS (PDP) ===
    lifestyleImage: z.string().optional(),
    featureBenefits: z.array(FeatureBenefitSchema).optional(),
    benchmarks: z.array(BenchmarkScoreSchema).optional(),
    priceHistory: z.array(PricePointSchema).optional(),
    gallery: z.array(z.string()).optional(),
    benefitSubtitle: z.string().optional(),
    mainCompetitor: MainCompetitorSchema.optional(),

    // === CAMPOS OPCIONAIS (Contextual Scoring) ===
    scoring_facts: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.array(z.string()), z.null()])).optional(),
    scoring_category: z.string().optional(),

    // === STATUS DE PUBLICAÇÃO ===
    /** 
     * Status do produto:
     * - 'draft': Produto em construção, campos faltantes geram WARNING (não bloqueia CI)
     * - 'published': Produto publicado, campos críticos faltantes geram FAIL (bloqueia CI)
     */
    status: z.enum(['draft', 'published']).default('draft'),
});

// ============================================
// TIPOS DERIVADOS
// ============================================

/** Tipo inferido do schema - para dados já validados */
export type ProductValidated = z.infer<typeof ProductSchema>;

/** Tipo para input (antes da validação) */
export type ProductInput = z.input<typeof ProductSchema>;

/** Resultado de validação */
export interface ProductValidationResult {
    success: boolean;
    data?: ProductValidated;
    errors?: string[];
}

// ============================================
// FUNÇÕES DE VALIDAÇÃO
// ============================================

/**
 * Valida um produto contra o schema
 */
export function validateProduct(data: unknown): ProductValidationResult {
    const result = ProductSchema.safeParse(data);

    if (result.success) {
        return { success: true, data: result.data };
    }

    const errors = result.error.issues.map((e) =>
        `[${String(e.path.join('.'))}] ${e.message}`
    );

    return { success: false, errors };
}

/**
 * Valida múltiplos produtos
 */
export function validateProducts(products: unknown[]): {
    valid: ProductValidated[];
    invalid: Array<{ index: number; errors: string[] }>;
} {
    const valid: ProductValidated[] = [];
    const invalid: Array<{ index: number; errors: string[] }> = [];

    products.forEach((product, index) => {
        const result = validateProduct(product);
        if (result.success && result.data) {
            valid.push(result.data);
        } else {
            invalid.push({ index, errors: result.errors || ['Unknown error'] });
        }
    });

    return { valid, invalid };
}

/**
 * Parse seguro - retorna null se inválido
 */
export function safeParseProduct(data: unknown): ProductValidated | null {
    const result = ProductSchema.safeParse(data);
    return result.success ? result.data : null;
}
