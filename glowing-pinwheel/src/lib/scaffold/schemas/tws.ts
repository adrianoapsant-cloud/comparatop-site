/**
 * @file tws.ts
 * @description Schema Zod para input raw de Fones TWS (True Wireless Stereo)
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const TWSSpecsInputSchema = z.object({
    // Obrigatórios
    batteryHoursBuds: z.number().positive().optional(),  // Autonomia dos fones
    batteryHoursCase: z.number().positive().optional(),  // Autonomia total com case

    // Recomendados
    driverSize: z.number().optional(),  // mm
    hasANC: z.boolean().optional(),     // Active Noise Cancellation
    hasTransparency: z.boolean().optional(),
    bluetooth: z.string().optional(),   // 5.0, 5.2, 5.3
    codec: z.string().optional(),       // AAC, aptX, LDAC
    waterResistance: z.string().optional(),  // IPX4, IPX5, IP54
    hasWirelessCharging: z.boolean().optional(),
    weight: z.number().optional(),      // gramas (cada fone)
});

export const TWSOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('tws'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: TWSSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type TWSOpusRawInput = z.infer<typeof TWSOpusRawInputSchema>;
