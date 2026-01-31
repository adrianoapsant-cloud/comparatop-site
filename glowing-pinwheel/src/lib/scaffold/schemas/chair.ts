/**
 * @file chair.ts
 * @description Schema Zod para input raw de Chair
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const ChairSpecsInputSchema = z.object({
    maxWeightKg: z.number().positive(),
    hasLumbarSupport: z.boolean().optional(),
    material: z.string().min(1),
    hasAdjustableArmrests: z.boolean().optional(),
    seatWidthCm: z.number().optional(),
    reclineDegrees: z.string().optional(),
});

export const ChairOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('chair'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: ChairSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type ChairOpusRawInput = z.infer<typeof ChairOpusRawInputSchema>;
