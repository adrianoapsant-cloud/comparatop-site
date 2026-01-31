/**
 * @file air-conditioner.ts
 * @description Schema Zod para input raw de Ar Condicionado
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EnergyInputSchema, EvidenceMapSchema } from './common';

// ============================================
// AIR CONDITIONER SPECS
// ============================================

export const AirConditionerSpecsInputSchema = z.object({
    // Obrigatórios
    btus: z.number().positive(),  // Capacidade em BTUs

    // Recomendados
    hasInverter: z.boolean().optional(),
    inverterType: z.string().optional(),  // dual-inverter, inverter, conventional
    acType: z.string().optional(),  // split, window, portable, cassette
    voltage: z.string().optional(),  // 110v, 220v
    energyClass: z.string().optional(),  // A, B, C, D, E
    noiseDb: z.number().optional(),  // dB interno
    noiseDbExternal: z.number().optional(),  // dB externo
    coverageArea: z.number().optional(),  // m²
    hasWifi: z.boolean().optional(),
    hasHeating: z.boolean().optional(),  // Quente/Frio
    cycle: z.string().optional(),  // frio, quente-frio
});

// ============================================
// OPUS RAW INPUT (air_conditioner)
// ============================================

export const AirConditionerOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('air_conditioner'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    energy: EnergyInputSchema.optional(),  // AC usa energia para TCO
    specs: AirConditionerSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
        revisadoPor: z.string().optional(),
        notas: z.string().optional(),
    }).optional(),
});

export type AirConditionerOpusRawInput = z.infer<typeof AirConditionerOpusRawInputSchema>;
