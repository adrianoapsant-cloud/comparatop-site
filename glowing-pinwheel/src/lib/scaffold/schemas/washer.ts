/**
 * @file washer.ts
 * @description Schema Zod para input raw de Máquina de Lavar
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EnergyInputSchema, EvidenceMapSchema } from './common';

export const WasherSpecsInputSchema = z.object({
    capacityKg: z.number().positive(),  // REQUIRED (kg)

    // Recommended
    hasInverter: z.boolean().optional(),
    voltage: z.string().optional(),  // 110V, 220V, Bivolt
    spinRpm: z.number().optional(),  // RPM de centrifugação
    washPrograms: z.number().optional(),  // qtd de programas
    hasDryer: z.boolean().optional(),  // lava e seca?
    hasWifi: z.boolean().optional(),
    noiseDb: z.number().optional(),
    energyClass: z.string().optional(),  // A, B, C
    waterConsumptionL: z.number().optional(),  // litros por ciclo
});

export const WasherOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('washer'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    energy: EnergyInputSchema.optional(),
    specs: WasherSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
        revisadoPor: z.string().optional(),
        notas: z.string().optional(),
    }).optional(),
});

export type WasherOpusRawInput = z.infer<typeof WasherOpusRawInputSchema>;
