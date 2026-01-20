/**
 * @file product-intake.ts
 * @description Product Intake Schema - Pipeline escalável de cadastro
 * 
 * Define o contrato de entrada para produtos, com:
 * - BaseProductInput: campos universais obrigatórios
 * - CategoryExtension: campos específicos por categoria
 * - Evidence: rastreabilidade de dados
 * 
 * O ProductSchema final (usado pelo site) é derivado/validado a partir deste intake.
 * 
 * @see src/lib/schemas/product.ts - Schema final do produto
 * @see src/lib/schemas/categories/ - Extensões por categoria
 */

import { z } from 'zod';

// ============================================
// EVIDENCE (Rastreabilidade)
// ============================================

/**
 * Evidência/fonte de dados
 * Permite rastrear de onde veio cada informação
 */
export const EvidenceSchema = z.object({
    /** URL fonte da informação */
    sourceUrl: z.string().url().optional(),
    /** Descrição da afirmação */
    claim: z.string(),
    /** Data de captura */
    capturedAt: z.string(), // ISO date
    /** Confiança na informação (0-1) */
    confidence: z.number().min(0).max(1).default(0.8),
    /** Tipo de fonte */
    sourceType: z.enum(['official', 'review', 'benchmark', 'manual', 'ai-generated']).default('manual'),
});

export type Evidence = z.infer<typeof EvidenceSchema>;

// ============================================
// BASE PRODUCT INPUT (Universal)
// ============================================

/**
 * Campos universais obrigatórios para QUALQUER produto
 */
export const BaseProductInputSchema = z.object({
    // === IDENTIFICAÇÃO ===
    /** Slug único (usado como ID) */
    id: z.string().min(1, 'ID é obrigatório'),
    /** ID da categoria (discriminante) */
    categoryId: z.string().min(1, 'Categoria é obrigatória'),
    /** Nome completo do produto */
    name: z.string().min(1, 'Nome é obrigatório'),
    /** Nome curto para cards */
    shortName: z.string().optional(),
    /** Marca */
    brand: z.string().min(1, 'Marca é obrigatória'),
    /** Modelo */
    model: z.string().optional(),

    // === COMERCIAL ===
    /** Preço referência (BRL) */
    price: z.number().positive('Preço deve ser positivo'),
    /** ASIN Amazon (se houver) */
    asin: z.string().optional(),

    // === MÍDIA ===
    /** URL da imagem principal */
    imageUrl: z.string().optional(),
    /** Galeria de imagens */
    gallery: z.array(z.string()).optional(),

    // === SCORES (c1-c10) ===
    scores: z.object({
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
    }).catchall(z.number().min(0).max(10)),

    // === EDITORIAL ===
    /** Subtítulo de benefício (PDP) */
    benefitSubtitle: z.string().optional(),
    /** Badges editoriais */
    badges: z.array(z.enum([
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
    ])).optional(),

    // === EVIDÊNCIAS ===
    /** Fontes e rastreabilidade */
    evidence: z.array(EvidenceSchema).optional(),

    // === METADADOS ===
    /** Data de última atualização */
    lastUpdated: z.string().optional(),
});

export type BaseProductInput = z.infer<typeof BaseProductInputSchema>;

// ============================================
// CATEGORY EXTENSIONS
// ============================================

/**
 * Extensão para TVs
 */
export const TvExtensionSchema = z.object({
    categoryId: z.literal('tv'),
    technicalSpecs: z.object({
        screenSize: z.number(), // polegadas
        panelType: z.enum(['LED', 'QLED', 'OLED', 'Mini-LED']),
        resolution: z.enum(['HD', 'FHD', '4K', '8K']),
        refreshRate: z.number(), // Hz
        hdmiPorts: z.number(),
        hasHDMI21: z.boolean(),
        hasVRR: z.boolean(),
        hasFreesync: z.boolean().optional(),
        hasGSync: z.boolean().optional(),
    }).partial(),
});

/**
 * Extensão para Geladeiras
 */
export const FridgeExtensionSchema = z.object({
    categoryId: z.literal('fridge'),
    technicalSpecs: z.object({
        capacityLiters: z.number(),
        doorType: z.enum(['single', 'double', 'french', 'sidebyside']),
        hasFrostFree: z.boolean(),
        hasInverter: z.boolean(),
        energyClass: z.string(),
        dimensions: z.object({
            width: z.number(),
            height: z.number(),
            depth: z.number(),
        }).optional(),
    }).partial(),
});

/**
 * Extensão para Ar-Condicionado
 */
export const AirConditionerExtensionSchema = z.object({
    categoryId: z.literal('air_conditioner'),
    technicalSpecs: z.object({
        btus: z.number(),
        type: z.enum(['split', 'inverter', 'portatil', 'janela']),
        hasInverter: z.boolean(),
        noiseDb: z.number().optional(),
        energyClass: z.string(),
        voltage: z.enum(['110', '220', 'bivolt']),
    }).partial(),
});

/**
 * Extensão genérica (para categorias sem extensão específica)
 */
export const GenericExtensionSchema = z.object({
    categoryId: z.string(),
    technicalSpecs: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
});

// ============================================
// PRODUCT INTAKE (União Discriminada)
// ============================================

/**
 * Product Intake completo
 * Usa discriminated union por categoryId
 */
export const ProductIntakeSchema = z.discriminatedUnion('categoryId', [
    BaseProductInputSchema.merge(TvExtensionSchema),
    BaseProductInputSchema.merge(FridgeExtensionSchema),
    BaseProductInputSchema.merge(AirConditionerExtensionSchema),
]).or(BaseProductInputSchema.merge(GenericExtensionSchema));

export type ProductIntake = z.infer<typeof ProductIntakeSchema>;

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Valida intake de produto
 */
export function validateProductIntake(data: unknown): {
    success: boolean;
    data?: ProductIntake;
    errors?: string[];
} {
    // Primeiro tentar parse específico
    const result = ProductIntakeSchema.safeParse(data);

    if (result.success) {
        return { success: true, data: result.data };
    }

    // Fallback para base schema
    const baseResult = BaseProductInputSchema.safeParse(data);
    if (baseResult.success) {
        return { success: true, data: baseResult.data as ProductIntake };
    }

    const errors = result.error.issues.map((e) =>
        `[${String(e.path.join('.'))}] ${e.message}`
    );

    return { success: false, errors };
}

/**
 * Converte ProductIntake para ProductInput (schema final)
 */
export function intakeToProductInput(intake: ProductIntake): Record<string, unknown> {
    const { technicalSpecs, ...rest } = intake as ProductIntake & { technicalSpecs?: Record<string, unknown> };

    return {
        ...rest,
        technicalSpecs: technicalSpecs || {},
    };
}
