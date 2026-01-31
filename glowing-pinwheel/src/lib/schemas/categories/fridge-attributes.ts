/**
 * @file fridge-attributes.ts
 * @description Schema Zod para atributos específicos de Geladeiras
 * 
 * Baseado no inventário 2026-01-22:
 * - energyClass: A, A+++, C (specs, technicalSpecs)
 * 
 * ERROR fields: obrigatórios para produtos published
 * WARN fields: recomendados, geram warning se ausentes
 */

import { z } from 'zod';

// ============================================
// FRIDGE ATTRIBUTES SCHEMA
// ============================================

/**
 * Campos obrigatórios (ERROR se ausentes em published)
 * Fridge: capacityLiters é crítico para decisão de compra
 */
const FridgeRequiredSchema = z.object({
    capacityLiters: z.number().positive().optional(),
    capacity: z.number().positive().optional(),  // Alias
}).refine(
    data => data.capacityLiters !== undefined || data.capacity !== undefined,
    { message: 'capacityLiters ou capacity é obrigatório', path: ['capacityLiters'] }
);

/**
 * Campos recomendados (WARN se ausentes)
 */
const FridgeRecommendedSchema = z.object({
    energyClass: z.string().min(1),  // A, A+++, C, etc.
    hasFrostFree: z.boolean(),
    hasInverter: z.boolean(),
    doorType: z.string().min(1),  // french-door, side-by-side, top-freezer, etc.
    noiseLevel: z.number().positive(),
});

/**
 * Schema completo com passthrough para campos extras
 */
export const FridgeAttributesSchema = FridgeRequiredSchema
    .merge(FridgeRecommendedSchema.partial())
    .passthrough();

// ============================================
// FRIDGE ATTRIBUTE SPEC
// ============================================

export const FRIDGE_ATTRIBUTE_SPEC = {
    categoryId: 'fridge' as const,
    schema: FridgeAttributesSchema,
    requiredKeys: ['capacityLiters'] as const,
    recommendedKeys: [
        'energyClass',
        'hasFrostFree',
        'hasInverter',
        'doorType',
        'noiseLevel',
    ] as const,
};

export type FridgeAttributes = z.infer<typeof FridgeAttributesSchema>;
