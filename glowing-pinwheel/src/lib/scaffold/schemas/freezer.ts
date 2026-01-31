/**
 * @file freezer.ts
 * @description Schema Zod para input raw de Freezer
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EnergyInputSchema, EvidenceMapSchema } from './common';

export const FreezerSpecsInputSchema = z.object({
    capacityLiters: z.number().positive(),
    type: z.string().min(1),
    hasFrostFree: z.boolean().optional(),
    inmetroKwhYear: z.string().optional(),
    noiseDb: z.boolean().optional(),
});

export const FreezerOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('freezer'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    energy: EnergyInputSchema.optional(),
    specs: FreezerSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type FreezerOpusRawInput = z.infer<typeof FreezerOpusRawInputSchema>;
