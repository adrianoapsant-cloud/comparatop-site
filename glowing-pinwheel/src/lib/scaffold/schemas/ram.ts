/**
 * @file ram.ts
 * @description Schema Zod para input raw de Ram
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const RamSpecsInputSchema = z.object({
    capacityGb: z.number().positive(),
    speedMtps: z.string().min(1),
    type: z.string().min(1),
    latencyCl: z.string().optional(),
    modulesCount: z.number().optional(),
});

export const RamOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('ram'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: RamSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type RamOpusRawInput = z.infer<typeof RamOpusRawInputSchema>;
