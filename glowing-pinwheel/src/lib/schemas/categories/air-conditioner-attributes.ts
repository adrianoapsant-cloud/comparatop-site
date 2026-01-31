/**
 * @file air-conditioner-attributes.ts
 * @description Schema Zod para atributos específicos de Ar Condicionado
 * 
 * Baseado no inventário 2026-01-22:
 * - btus: 12000, 9000 (technicalSpecs)
 * 
 * ERROR fields: obrigatórios para produtos published
 * WARN fields: recomendados, geram warning se ausentes
 */

import { z } from 'zod';

// ============================================
// AIR CONDITIONER ATTRIBUTES SCHEMA
// ============================================

/**
 * Campos obrigatórios (ERROR se ausentes em published)
 * BTUs é crítico para dimensionamento e decisão de compra
 */
const AirConditionerRequiredSchema = z.object({
    btus: z.number().positive(),
});

/**
 * Campos recomendados (WARN se ausentes)
 */
const AirConditionerRecommendedSchema = z.object({
    hasInverter: z.boolean(),
    noiseDb: z.number().positive(),
    noiseLevel: z.number().positive(),  // Alias
    energyClass: z.string().min(1),
    voltage: z.number().positive(),  // 110, 220
    cycle: z.string().min(1),  // Frio, Quente/Frio
});

/**
 * Schema completo com passthrough para campos extras
 */
export const AirConditionerAttributesSchema = AirConditionerRequiredSchema
    .merge(AirConditionerRecommendedSchema.partial())
    .passthrough();

// ============================================
// AIR CONDITIONER ATTRIBUTE SPEC
// ============================================

export const AIR_CONDITIONER_ATTRIBUTE_SPEC = {
    categoryId: 'air_conditioner' as const,
    schema: AirConditionerAttributesSchema,
    requiredKeys: ['btus'] as const,
    recommendedKeys: [
        'hasInverter',
        'noiseDb',
        'energyClass',
        'voltage',
        'cycle',
    ] as const,
};

export type AirConditionerAttributes = z.infer<typeof AirConditionerAttributesSchema>;
