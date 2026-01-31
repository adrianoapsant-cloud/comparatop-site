/**
 * @file builtin-oven.ts
 * @description Schema Zod para input raw de BuiltinOven
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const BuiltinOvenSpecsInputSchema = z.object({
    capacityLiters: z.number().positive(),
    voltage: z.string().min(1),
    hasConvection: z.boolean().optional(),
    maxTempC: z.string().optional(),
    hasSteam: z.boolean().optional(),
});

export const BuiltinOvenOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('builtin-oven'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: BuiltinOvenSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type BuiltinOvenOpusRawInput = z.infer<typeof BuiltinOvenOpusRawInputSchema>;
