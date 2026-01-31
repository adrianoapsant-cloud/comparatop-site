/**
 * @file security-camera.ts
 * @description Schema Zod para input raw de SecurityCamera
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const SecurityCameraSpecsInputSchema = z.object({
    videoResolution: z.string().min(1),
    hasNightVision: z.boolean().optional(),
    storageType: z.string().min(1),
    hasAI: z.boolean().optional(),
    isWeatherproof: z.boolean().optional(),
    powerType: z.string().optional(),
});

export const SecurityCameraOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('security-camera'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: SecurityCameraSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type SecurityCameraOpusRawInput = z.infer<typeof SecurityCameraOpusRawInputSchema>;
