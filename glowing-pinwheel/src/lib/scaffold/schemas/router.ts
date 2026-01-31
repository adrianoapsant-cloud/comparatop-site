/**
 * @file router.ts
 * @description Schema Zod para input raw de Router
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const RouterSpecsInputSchema = z.object({
    wifiStandard: z.string().min(1),
    maxSpeedMbps: z.string().min(1),
    hasMesh: z.boolean().optional(),
    hasWifi6e: z.boolean().optional(),
    lanPorts: z.string().optional(),
    antennasCount: z.number().optional(),
});

export const RouterOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('router'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: RouterSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type RouterOpusRawInput = z.infer<typeof RouterOpusRawInputSchema>;
