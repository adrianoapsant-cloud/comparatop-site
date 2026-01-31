/**
 * @file power-strip.ts
 * @description Schema Zod para input raw de PowerStrip
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const PowerStripSpecsInputSchema = z.object({
    outlets: z.string().min(1),
    hasSurgeProtection: z.boolean().optional(),
    joules: z.string().optional(),
    cableLengthM: z.string().optional(),
    hasIndividualSwitches: z.boolean().optional(),
});

export const PowerStripOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('power-strip'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: PowerStripSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type PowerStripOpusRawInput = z.infer<typeof PowerStripOpusRawInputSchema>;
