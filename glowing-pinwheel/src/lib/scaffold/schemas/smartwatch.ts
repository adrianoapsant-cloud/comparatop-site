/**
 * @file smartwatch.ts
 * @description Schema Zod para input raw de Smartwatch
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

// ============================================
// SMARTWATCH SPECS
// ============================================

export const SmartwatchSpecsInputSchema = z.object({
    // Obrigatórios
    displaySize: z.number().positive(),  // polegadas (ex: 1.4)

    // Recomendados
    displayType: z.string().optional(),  // AMOLED, LCD, etc.
    batteryDays: z.number().optional(),  // autonomia em dias
    batteryMah: z.number().optional(),
    hasGps: z.boolean().optional(),
    hasNfc: z.boolean().optional(),
    hasLte: z.boolean().optional(),
    hasEcg: z.boolean().optional(),
    hasSpO2: z.boolean().optional(),
    hasHeartRate: z.boolean().optional(),
    waterResistance: z.string().optional(),  // 5ATM, IP68, etc.
    os: z.string().optional(),  // Wear OS, watchOS, Amazfit OS, etc.
    compatibility: z.string().optional(),  // android, ios, both
    caseMaterial: z.string().optional(),  // aluminum, stainless steel, titanium
    weight: z.number().optional(),  // gramas
});

// ============================================
// OPUS RAW INPUT (smartwatch)
// ============================================

export const SmartwatchOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('smartwatch'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    // Energia opcional para smartwatch (não é crítica para TCO)
    specs: SmartwatchSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
        revisadoPor: z.string().optional(),
        notas: z.string().optional(),
    }).optional(),
});

export type SmartwatchOpusRawInput = z.infer<typeof SmartwatchOpusRawInputSchema>;
