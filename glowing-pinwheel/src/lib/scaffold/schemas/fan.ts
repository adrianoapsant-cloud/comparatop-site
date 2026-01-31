/**
 * @file fan.ts
 * @description Schema Zod para input raw de Fan
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const FanSpecsInputSchema = z.object({
    diameterCm: z.number().positive(),
    speeds: z.string().min(1),
    hasOscillation: z.boolean().optional(),
    noiseDb: z.boolean().optional(),
    powerWatts: z.number().optional(),
    hasRemote: z.boolean().optional(),
});

export const FanOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('fan'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: FanSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type FanOpusRawInput = z.infer<typeof FanOpusRawInputSchema>;
