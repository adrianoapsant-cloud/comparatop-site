/**
 * @file tv.ts
 * @description Schema Zod para input raw de Smart TV
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EnergyInputSchema, EvidenceMapSchema } from './common';

// ============================================
// TV SPECS
// ============================================

export const TVSpecsInputSchema = z.object({
    // Obrigatórios
    screenSize: z.number().positive(),  // polegadas
    panelType: z.string().min(1),  // OLED, QLED, LED, Mini LED, Neo QLED, etc.
    resolution: z.string().min(1),  // 4K, 8K, Full HD

    // Recomendados
    refreshRate: z.number().optional(),  // 60, 120, 144
    hdmiPorts: z.number().optional(),
    hdmi21Ports: z.number().optional(),
    hasVRR: z.boolean().optional(),
    hasALLM: z.boolean().optional(),
    hasDolbyVision: z.boolean().optional(),
    hasHDR10Plus: z.boolean().optional(),
    smartPlatform: z.string().optional(),  // Tizen, webOS, Google TV, etc.
    brightness: z.number().optional(),  // nits
});

// ============================================
// OPUS RAW INPUT (tv)
// ============================================

export const TVOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('tv'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    energy: EnergyInputSchema.optional(),  // TV usa energia para TCO
    specs: TVSpecsInputSchema,
    evidence: EvidenceMapSchema,  // P5.5: Evidence tracking
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
        revisadoPor: z.string().optional(),
        notas: z.string().optional(),
    }).optional(),
});

export type TVOpusRawInput = z.infer<typeof TVOpusRawInputSchema>;
