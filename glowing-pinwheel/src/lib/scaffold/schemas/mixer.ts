/**
 * @file mixer.ts
 * @description Schema Zod para input raw de Mixer
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const MixerSpecsInputSchema = z.object({
    powerWatts: z.number().positive(),
    speeds: z.string().min(1),
    hasPlanetaryAction: z.boolean().optional(),
    bowlLiters: z.number().optional(),
    hasPulse: z.boolean().optional(),
    attachmentsCount: z.number().optional(),
});

export const MixerOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('mixer'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: MixerSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type MixerOpusRawInput = z.infer<typeof MixerOpusRawInputSchema>;
