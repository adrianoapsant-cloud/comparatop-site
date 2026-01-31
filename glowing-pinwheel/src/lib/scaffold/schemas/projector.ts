/**
 * @file projector.ts
 * @description Schema Zod para input raw de Projector
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const ProjectorSpecsInputSchema = z.object({
    lumensAnsi: z.string().min(1),
    nativeResolution: z.string().min(1),
    technology: z.string().min(1),
    throwRatio: z.string().optional(),
    hasKeystone: z.boolean().optional(),
    inputLagMs: z.string().optional(),
});

export const ProjectorOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('projector'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: ProjectorSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type ProjectorOpusRawInput = z.infer<typeof ProjectorOpusRawInputSchema>;
