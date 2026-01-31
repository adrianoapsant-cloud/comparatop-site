/**
 * @file microwave.ts
 * @description Schema Zod para input raw de Micro-ondas
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EnergyInputSchema, EvidenceMapSchema } from './common';

export const MicrowaveSpecsInputSchema = z.object({
    // Obrigatórios
    capacityLiters: z.number().positive(),

    // Recomendados
    watts: z.number().optional(),
    hasGrill: z.boolean().optional(),
    hasConvection: z.boolean().optional(),
    hasInverter: z.boolean().optional(),
    panelType: z.string().optional(),  // digital, mechanical
    voltage: z.string().optional(),
    turntableDiameter: z.number().optional(),  // cm
});

export const MicrowaveOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('microwave'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    energy: EnergyInputSchema.optional(),
    specs: MicrowaveSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type MicrowaveOpusRawInput = z.infer<typeof MicrowaveOpusRawInputSchema>;
