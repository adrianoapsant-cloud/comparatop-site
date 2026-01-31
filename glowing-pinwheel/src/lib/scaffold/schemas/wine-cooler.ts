/**
 * @file wine-cooler.ts
 * @description Schema Zod para input raw de WineCooler
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EnergyInputSchema, EvidenceMapSchema } from './common';

export const WineCoolerSpecsInputSchema = z.object({
    bottleCount: z.number().positive(),
    zones: z.string().min(1),
    noiseDb: z.boolean().optional(),
    hasDualZone: z.boolean().optional(),
    inmetroKwhYear: z.string().optional(),
});

export const WineCoolerOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('wine-cooler'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    energy: EnergyInputSchema.optional(),
    specs: WineCoolerSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type WineCoolerOpusRawInput = z.infer<typeof WineCoolerOpusRawInputSchema>;
