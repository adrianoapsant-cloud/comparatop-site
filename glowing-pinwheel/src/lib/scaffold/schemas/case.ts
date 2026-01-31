/**
 * @file case.ts
 * @description Schema Zod para input raw de Case
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const CaseSpecsInputSchema = z.object({
    formFactorSupport: z.string().min(1),
    maxGpuLengthMm: z.number().positive(),
    includedFans: z.string().min(1),
    hasMeshFront: z.boolean().optional(),
    hasRadiatorSupport: z.boolean().optional(),
    hasDustFilters: z.boolean().optional(),
});

export const CaseOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('case'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: CaseSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type CaseOpusRawInput = z.infer<typeof CaseOpusRawInputSchema>;
