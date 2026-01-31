/**
 * @file cpu.ts
 * @description Schema Zod para input raw de Cpu
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const CpuSpecsInputSchema = z.object({
    cores: z.string().min(1),
    threads: z.string().min(1),
    boostClockGhz: z.string().min(1),
    tdpW: z.string().min(1),
    socket: z.string().min(1),
    hasIntegratedGpu: z.boolean().optional(),
    cacheMb: z.string().optional(),
});

export const CpuOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('cpu'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: CpuSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type CpuOpusRawInput = z.infer<typeof CpuOpusRawInputSchema>;
