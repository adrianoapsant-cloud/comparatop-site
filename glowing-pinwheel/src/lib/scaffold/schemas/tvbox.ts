/**
 * @file tvbox.ts
 * @description Schema Zod para input raw de Tvbox
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const TvboxSpecsInputSchema = z.object({
    ramGb: z.number().positive(),
    storageGb: z.number().positive(),
    os: z.string().min(1),
    maxResolution: z.string().min(1),
    hasEthernet: z.boolean().optional(),
    wifiStandard: z.string().optional(),
    supportsDolbyVision: z.boolean().optional(),
});

export const TvboxOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('tvbox'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: TvboxSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type TvboxOpusRawInput = z.infer<typeof TvboxOpusRawInputSchema>;
