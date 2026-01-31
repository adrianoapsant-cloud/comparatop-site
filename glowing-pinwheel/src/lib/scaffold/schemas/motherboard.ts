/**
 * @file motherboard.ts
 * @description Schema Zod para input raw de Motherboard
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const MotherboardSpecsInputSchema = z.object({
    socket: z.string().min(1),
    chipset: z.string().min(1),
    ramType: z.string().min(1),
    m2Slots: z.string().min(1),
    wifiOnboard: z.string().optional(),
    pcieVersion: z.string().optional(),
    formFactor: z.string().optional(),
});

export const MotherboardOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('motherboard'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: MotherboardSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type MotherboardOpusRawInput = z.infer<typeof MotherboardOpusRawInputSchema>;
