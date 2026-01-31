/**
 * @file washer-dryer.ts
 * @description Schema Zod para input raw de WasherDryer
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EnergyInputSchema, EvidenceMapSchema } from './common';

export const WasherDryerSpecsInputSchema = z.object({
    capacityKg: z.number().positive(),
    spinRpm: z.number().positive(),
    hasInverter: z.boolean().optional(),
    inmetroKwhYear: z.string().optional(),
    steamFeature: z.string().optional(),
    noiseDb: z.boolean().optional(),
});

export const WasherDryerOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('washer-dryer'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    energy: EnergyInputSchema.optional(),
    specs: WasherDryerSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type WasherDryerOpusRawInput = z.infer<typeof WasherDryerOpusRawInputSchema>;
