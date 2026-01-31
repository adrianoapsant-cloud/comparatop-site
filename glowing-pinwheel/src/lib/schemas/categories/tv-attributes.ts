/**
 * @file tv-attributes.ts
 * @description Schema Zod para atributos específicos de TVs
 * 
 * ERROR fields: obrigatórios para produtos published
 * WARN fields: recomendados, geram warning se ausentes
 */

import { z } from 'zod';

// ============================================
// TV ATTRIBUTES SCHEMA
// ============================================

/**
 * Campos obrigatórios (ERROR se ausentes em published)
 */
const TvRequiredSchema = z.object({
    panelType: z.enum(['LED', 'QLED', 'OLED', 'Mini-LED', 'Neo QLED']),
    screenSize: z.number().positive(),
    resolution: z.enum(['4K', '8K', 'FHD', 'HD']),
});

/**
 * Campos recomendados (WARN se ausentes)
 */
const TvRecommendedSchema = z.object({
    hdmi21: z.boolean(),
    hdmi21Ports: z.number().int().min(0),
    brightness: z.number().positive(),
    refreshRate: z.number().positive(),
    vrr: z.boolean(),
    allm: z.boolean(),
    dolbyVision: z.boolean(),
});

/**
 * Schema completo com passthrough para campos extras
 */
export const TvAttributesSchema = TvRequiredSchema
    .merge(TvRecommendedSchema.partial())
    .passthrough();

// ============================================
// TV ATTRIBUTE SPEC
// ============================================

export const TV_ATTRIBUTE_SPEC = {
    categoryId: 'tv' as const,
    schema: TvAttributesSchema,
    requiredKeys: ['panelType', 'screenSize', 'resolution'] as const,
    recommendedKeys: [
        'hdmi21',
        'hdmi21Ports',
        'brightness',
        'refreshRate',
        'vrr',
        'allm',
        'dolbyVision',
    ] as const,
};

export type TvAttributes = z.infer<typeof TvAttributesSchema>;
