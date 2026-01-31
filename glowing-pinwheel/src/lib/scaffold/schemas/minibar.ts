/**
 * @file minibar.ts
 * @description Schema Zod para input raw de Minibar
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EnergyInputSchema, EvidenceMapSchema } from './common';

export const MinibarSpecsInputSchema = z.object({
    capacityLiters: z.number().positive(),
    inmetroKwhYear: z.string().optional(),
    noiseDb: z.boolean().optional(),
    hasFreezerCompartment: z.boolean().optional(),
});

export const MinibarOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('minibar'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    energy: EnergyInputSchema.optional(),
    specs: MinibarSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type MinibarOpusRawInput = z.infer<typeof MinibarOpusRawInputSchema>;
