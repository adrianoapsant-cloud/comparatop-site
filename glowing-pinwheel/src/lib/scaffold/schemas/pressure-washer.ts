/**
 * @file pressure-washer.ts
 * @description Schema Zod para input raw de PressureWasher
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const PressureWasherSpecsInputSchema = z.object({
    psi: z.string().min(1),
    flowLmin: z.string().min(1),
    powerWatts: z.number().positive(),
    hasDetergentTank: z.boolean().optional(),
    hoseLengthM: z.string().optional(),
});

export const PressureWasherOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('pressure-washer'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: PressureWasherSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type PressureWasherOpusRawInput = z.infer<typeof PressureWasherOpusRawInputSchema>;
