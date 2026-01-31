/**
 * @file smart-lock.ts
 * @description Schema Zod para input raw de SmartLock
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const SmartLockSpecsInputSchema = z.object({
    authMethods: z.string().min(1),
    batteryType: z.string().min(1),
    hasBiometric: z.boolean().optional(),
    hasKeyOverride: z.boolean().optional(),
    supportsApp: z.boolean().optional(),
});

export const SmartLockOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('smart-lock'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: SmartLockSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type SmartLockOpusRawInput = z.infer<typeof SmartLockOpusRawInputSchema>;
