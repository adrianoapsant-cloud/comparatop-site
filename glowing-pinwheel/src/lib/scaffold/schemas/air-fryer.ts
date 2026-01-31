/**
 * @file air-fryer.ts
 * @description Schema Zod para input raw de Air Fryers
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EnergyInputSchema, EvidenceMapSchema } from './common';

export const AirFryerSpecsInputSchema = z.object({
    // Obrigatórios
    capacityLiters: z.number().positive(),

    // Recomendados
    watts: z.number().optional(),
    hasDigitalDisplay: z.boolean().optional(),
    hasTimer: z.boolean().optional(),
    maxTemp: z.number().optional(),  // °C
    hasDoubleBasket: z.boolean().optional(),
    hasTurbo: z.boolean().optional(),
    voltage: z.string().optional(),
});

export const AirFryerOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('air-fryer'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    energy: EnergyInputSchema.optional(),
    specs: AirFryerSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type AirFryerOpusRawInput = z.infer<typeof AirFryerOpusRawInputSchema>;
