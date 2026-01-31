/**
 * @file stick-vacuum.ts
 * @description Schema Zod para input raw de StickVacuum
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const StickVacuumSpecsInputSchema = z.object({
    type: z.string().min(1),
    hasHepa: z.boolean().optional(),
    batteryMinutes: z.number().optional(),
    suctionPa: z.string().optional(),
    weightKg: z.number().optional(),
});

export const StickVacuumOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('stick-vacuum'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: StickVacuumSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type StickVacuumOpusRawInput = z.infer<typeof StickVacuumOpusRawInputSchema>;
