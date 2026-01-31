/**
 * @file headset-gamer.ts
 * @description Schema Zod para input raw de Headsets Gamer
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const HeadsetGamerSpecsInputSchema = z.object({
    // Obrigatórios
    driverSize: z.number().positive(),  // mm

    // Recomendados
    isWireless: z.boolean().optional(),
    hasSurround: z.boolean().optional(),  // 7.1, Dolby Atmos
    hasRGB: z.boolean().optional(),
    micType: z.string().optional(),  // boom, internal, detachable
    hasMicMonitor: z.boolean().optional(),
    connection: z.string().optional(),  // USB, 3.5mm, 2.4GHz
    weight: z.number().optional(),  // gramas
    impedance: z.number().optional(),  // Ohms
    frequencyRange: z.string().optional(),  // 20Hz-20kHz
});

export const HeadsetGamerOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('headset-gamer'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: HeadsetGamerSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type HeadsetGamerOpusRawInput = z.infer<typeof HeadsetGamerOpusRawInputSchema>;
