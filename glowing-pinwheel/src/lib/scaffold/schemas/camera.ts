/**
 * @file camera.ts
 * @description Schema Zod para input raw de Camera
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const CameraSpecsInputSchema = z.object({
    sensorSize: z.string().min(1),
    megapixels: z.string().min(1),
    videoResolution: z.string().min(1),
    hasStabilization: z.boolean().optional(),
    maxIso: z.string().optional(),
    hasMicInput: z.boolean().optional(),
});

export const CameraOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('camera'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: CameraSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type CameraOpusRawInput = z.infer<typeof CameraOpusRawInputSchema>;
