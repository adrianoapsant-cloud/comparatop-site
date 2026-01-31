/**
 * @file stove.ts
 * @description Schema Zod para input raw de Stove
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const StoveSpecsInputSchema = z.object({
    type: z.string().min(1),
    burners: z.string().min(1),
    hasOven: z.boolean().optional(),
    ovenCapacityLiters: z.number().optional(),
    hasInduction: z.boolean().optional(),
    voltage: z.string().optional(),
});

export const StoveOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('stove'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: StoveSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type StoveOpusRawInput = z.infer<typeof StoveOpusRawInputSchema>;
