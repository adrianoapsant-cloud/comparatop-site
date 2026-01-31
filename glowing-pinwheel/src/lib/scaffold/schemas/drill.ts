/**
 * @file drill.ts
 * @description Schema Zod para input raw de Drill
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const DrillSpecsInputSchema = z.object({
    voltageV: z.string().min(1),
    torqueNm: z.string().min(1),
    isImpact: z.boolean().optional(),
    hasBrushless: z.boolean().optional(),
    batteryAh: z.string().optional(),
    hasHammerMode: z.boolean().optional(),
    speedSettings: z.string().optional(),
});

export const DrillOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('drill'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: DrillSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type DrillOpusRawInput = z.infer<typeof DrillOpusRawInputSchema>;
