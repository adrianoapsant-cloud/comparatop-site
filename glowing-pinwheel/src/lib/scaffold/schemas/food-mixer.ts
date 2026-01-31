/**
 * @file food-mixer.ts
 * @description Schema Zod para input raw de FoodMixer
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const FoodMixerSpecsInputSchema = z.object({
    powerWatts: z.number().positive(),
    hasVariableSpeed: z.boolean().optional(),
    attachmentsCount: z.number().optional(),
    isImmersion: z.boolean().optional(),
    hasChopper: z.boolean().optional(),
});

export const FoodMixerOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('food-mixer'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: FoodMixerSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type FoodMixerOpusRawInput = z.infer<typeof FoodMixerOpusRawInputSchema>;
