/**
 * @file range-hood.ts
 * @description Schema Zod para input raw de RangeHood
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const RangeHoodSpecsInputSchema = z.object({
    flowRateM3h: z.string().min(1),
    noiseDb: z.boolean().optional(),
    widthCm: z.number().positive(),
    mode: z.string().optional(),
    hasBaffleFilter: z.boolean().optional(),
    ductDiameterMm: z.number().optional(),
});

export const RangeHoodOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('range-hood'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: RangeHoodSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type RangeHoodOpusRawInput = z.infer<typeof RangeHoodOpusRawInputSchema>;
