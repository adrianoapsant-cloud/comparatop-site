/**
 * @file tire.ts
 * @description Schema Zod para input raw de Tire
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const TireSpecsInputSchema = z.object({
    width: z.string().min(1),
    profile: z.string().min(1),
    diameter: z.string().min(1),
    loadIndex: z.number().positive(),
    speedRating: z.string().min(1),
    wetGripRating: z.string().optional(),
    treadwear: z.string().optional(),
    warrantyMonths: z.number().optional(),
});

export const TireOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('tire'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: TireSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type TireOpusRawInput = z.infer<typeof TireOpusRawInputSchema>;
