/**
 * @file gpu.ts
 * @description Schema Zod para input raw de Gpu
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const GpuSpecsInputSchema = z.object({
    vramGb: z.number().positive(),
    tdpW: z.string().min(1),
    hasRayTracing: z.boolean().optional(),
    supportsFrameGen: z.boolean().optional(),
    memoryBusBit: z.string().optional(),
});

export const GpuOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('gpu'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: GpuSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type GpuOpusRawInput = z.infer<typeof GpuOpusRawInputSchema>;
