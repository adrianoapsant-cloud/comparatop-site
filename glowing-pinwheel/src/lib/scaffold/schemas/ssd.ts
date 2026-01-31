/**
 * @file ssd.ts
 * @description Schema Zod para input raw de Ssd
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const SsdSpecsInputSchema = z.object({
    capacityGb: z.number().positive(),
    interface: z.string().min(1),
    readMbps: z.string().min(1),
    writeMbps: z.string().min(1),
    tbwTb: z.string().optional(),
    hasDramCache: z.boolean().optional(),
});

export const SsdOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('ssd'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: SsdSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type SsdOpusRawInput = z.infer<typeof SsdOpusRawInputSchema>;
