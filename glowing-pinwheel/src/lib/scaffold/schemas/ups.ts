/**
 * @file ups.ts
 * @description Schema Zod para input raw de Ups
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const UpsSpecsInputSchema = z.object({
    va: z.string().min(1),
    watts: z.string().min(1),
    batteryMinutes: z.number().positive(),
    outlets: z.string().min(1),
    hasPureSineWave: z.boolean().optional(),
    hasAvr: z.boolean().optional(),
    warrantyYears: z.number().optional(),
});

export const UpsOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('ups'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: UpsSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type UpsOpusRawInput = z.infer<typeof UpsOpusRawInputSchema>;
