/**
 * @file espresso-machine.ts
 * @description Schema Zod para input raw de EspressoMachine
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const EspressoMachineSpecsInputSchema = z.object({
    type: z.string().min(1),
    pressureBar: z.number().positive(),
    hasMilkFrother: z.boolean().optional(),
    hasGrinder: z.boolean().optional(),
    waterTankLiters: z.number().optional(),
});

export const EspressoMachineOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('espresso-machine'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: EspressoMachineSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type EspressoMachineOpusRawInput = z.infer<typeof EspressoMachineOpusRawInputSchema>;
