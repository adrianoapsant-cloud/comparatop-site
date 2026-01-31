/**
 * @file dishwasher.ts
 * @description Schema Zod para input raw de Dishwasher
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EnergyInputSchema, EvidenceMapSchema } from './common';

export const DishwasherSpecsInputSchema = z.object({
    places: z.string().min(1),
    inmetroKwhYear: z.string().min(1),
    noiseDb: z.boolean().optional(),
    hasInverterMotor: z.boolean().optional(),
    hasAutoOpen: z.boolean().optional(),
    hasThirdRack: z.boolean().optional(),
});

export const DishwasherOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('dishwasher'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    energy: EnergyInputSchema.optional(),
    specs: DishwasherSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type DishwasherOpusRawInput = z.infer<typeof DishwasherOpusRawInputSchema>;
