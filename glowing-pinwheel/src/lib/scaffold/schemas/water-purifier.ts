/**
 * @file water-purifier.ts
 * @description Schema Zod para input raw de WaterPurifier
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const WaterPurifierSpecsInputSchema = z.object({
    flowRateLh: z.string().min(1),
    filterType: z.string().min(1),
    hasRefrigeration: z.boolean().optional(),
    coolingTech: z.string().optional(),
    inmetroClass: z.string().optional(),
    hasBacteriologicalEfficiency: z.boolean().optional(),
});

export const WaterPurifierOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('water-purifier'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: WaterPurifierSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type WaterPurifierOpusRawInput = z.infer<typeof WaterPurifierOpusRawInputSchema>;
