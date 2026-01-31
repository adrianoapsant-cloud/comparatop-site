/**
 * @file fridge.ts
 * @description Schema Zod para input raw de Geladeira/Refrigerador
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EnergyInputSchema, EvidenceMapSchema } from './common';

// ============================================
// FRIDGE SPECS
// ============================================

export const FridgeSpecsInputSchema = z.object({
    // Obrigatórios
    capacityLiters: z.number().positive(),  // Capacidade total em litros

    // Recomendados
    freezerCapacityLiters: z.number().positive().optional(),
    doorType: z.string().optional(),  // french-door, side-by-side, top-freezer, bottom-freezer
    hasFrostFree: z.boolean().optional(),
    hasInverter: z.boolean().optional(),
    voltage: z.string().optional(),  // 110v, 220v, bivolt
    energyClass: z.string().optional(),  // A, B, C, D, E
    hasIceMaker: z.boolean().optional(),
    hasWaterDispenser: z.boolean().optional(),
    noiseLevel: z.number().optional(),  // dB
    width: z.number().optional(),  // cm
    height: z.number().optional(),  // cm
    depth: z.number().optional(),  // cm
});

// ============================================
// OPUS RAW INPUT (fridge)
// ============================================

export const FridgeOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('fridge'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    energy: EnergyInputSchema.optional(),  // Fridge usa energia para TCO
    specs: FridgeSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
        revisadoPor: z.string().optional(),
        notas: z.string().optional(),
    }).optional(),
});

export type FridgeOpusRawInput = z.infer<typeof FridgeOpusRawInputSchema>;
