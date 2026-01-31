/**
 * @file schemas.ts
 * @description Schemas Zod para input "cru" do Opus (scaffolder)
 * 
 * OpusRawInput: formato stricto que o Opus deve preencher
 * Limita o Opus ao mínimo necessário + fontes, evitando "delírios"
 */

import { z } from 'zod';

// ============================================
// ENUMS E TIPOS BASE
// ============================================

/**
 * Fonte de dado (URL obrigatória)
 */
export const SourceSchema = z.object({
    url: z.string().url(),
    accessedAt: z.string().optional(),  // ISO date
    type: z.enum(['amazon', 'manufacturer', 'review', 'marketplace', 'other']).optional(),
});

/**
 * Informação de preço com fonte
 */
export const PriceInfoSchema = z.object({
    valueBRL: z.number().positive(),
    observedAt: z.string(),  // ISO date
    sourceUrl: z.string().url(),
    currency: z.literal('BRL').default('BRL'),
});

/**
 * Energia: aceita múltiplos formatos com precedência
 * INMETRO > labelKwhMonth > wattsTypical+usageHoursPerDay > baseline
 */
export const EnergyInputSchema = z.object({
    // Fonte primária: selo INMETRO (kWh/ano)
    inmetroKwhYear: z.number().positive().optional(),
    // Fonte secundária: etiqueta (kWh/mês)
    labelKwhMonth: z.number().positive().optional(),
    // Fonte terciária: cálculo manual (W x horas/dia)
    wattsTypical: z.number().positive().optional(),
    usageHoursPerDay: z.number().positive().optional(),
    // Fonte de onde veio a informação
    sourceUrl: z.string().url().optional(),
});

// ============================================
// ROBOT VACUUM SPECS (mínimo para scaffolder)
// ============================================

export const RobotVacuumSpecsInputSchema = z.object({
    // Navegação (obrigatório)
    navigationType: z.enum(['LiDAR', 'lidar', 'VSLAM', 'vslam', 'random', 'gyroscope']),
    // Sucção (obrigatório: um ou outro)
    suctionPa: z.number().positive().optional(),
    suctionPower: z.number().positive().optional(),
    // Dock/Base
    hasSelfEmpty: z.boolean().optional(),
    hasAutoEmpty: z.boolean().optional(),  // Alias
    // Mop
    hasMop: z.boolean().optional(),
    mopType: z.string().optional(),
    // Dimensões
    heightCm: z.number().positive().optional(),
    // Bateria
    batteryMah: z.number().positive().optional(),
    runtimeMinutes: z.number().positive().optional(),
}).refine(
    data => data.suctionPa !== undefined || data.suctionPower !== undefined,
    { message: 'suctionPa ou suctionPower é obrigatório', path: ['suctionPa'] }
);

// ============================================
// OPUS RAW INPUT (formato completo)
// ============================================

/**
 * Schema stricto para input do Opus
 * Campos críticos são obrigatórios; campos "deriváveis" são omitidos
 */
export const OpusRawInputSchema = z.object({
    // Identificação do produto
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('robot-vacuum'),  // Por enquanto só robot-vacuum
        asin: z.string().optional(),  // Amazon ASIN
    }),

    // Preço observado
    price: PriceInfoSchema,

    // Fontes consultadas (mínimo 1)
    sources: z.array(SourceSchema).min(1),

    // Dados de energia (opcional - usa baseline se ausente)
    energy: EnergyInputSchema.optional(),

    // Especificações técnicas do produto
    specs: RobotVacuumSpecsInputSchema,

    // Campos que o Opus NÃO deve preencher (serão derivados)
    // scores, attributes, badges, offers -> serão calculados pelo scaffolder

    // Metadados do cadastro
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),  // ISO date
        revisadoPor: z.string().optional(),
        notas: z.string().optional(),
    }).optional(),
});

// ============================================
// TYPES
// ============================================

export type Source = z.infer<typeof SourceSchema>;
export type PriceInfo = z.infer<typeof PriceInfoSchema>;
export type EnergyInput = z.infer<typeof EnergyInputSchema>;
export type RobotVacuumSpecsInput = z.infer<typeof RobotVacuumSpecsInputSchema>;
export type OpusRawInput = z.infer<typeof OpusRawInputSchema>;

// ============================================
// VALIDATION HELPER
// ============================================

export function validateOpusRawInput(input: unknown): {
    success: boolean;
    data?: OpusRawInput;
    errors?: string[];
} {
    const result = OpusRawInputSchema.safeParse(input);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return {
        success: false,
        errors: result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`),
    };
}
