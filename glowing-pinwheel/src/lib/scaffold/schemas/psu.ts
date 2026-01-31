/**
 * @file psu.ts
 * @description Schema Zod para input raw de Psu
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const PsuSpecsInputSchema = z.object({
    watts: z.string().min(1),
    efficiencyRating: z.string().min(1),
    isModular: z.boolean().optional(),
    hasAtx30: z.boolean().optional(),
    warrantyYears: z.number().optional(),
});

export const PsuOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('psu'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: PsuSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type PsuOpusRawInput = z.infer<typeof PsuOpusRawInputSchema>;
