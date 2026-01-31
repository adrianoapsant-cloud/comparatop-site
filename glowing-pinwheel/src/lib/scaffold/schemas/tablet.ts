/**
 * @file tablet.ts
 * @description Schema Zod para input raw de Tablet
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const TabletSpecsInputSchema = z.object({
    storage: z.number().positive(),      // REQUIRED (GB)
    displaySize: z.number().positive(),  // REQUIRED (polegadas)

    // Recommended
    ram: z.number().optional(),
    resolution: z.string().optional(),
    displayType: z.string().optional(),  // LCD, OLED
    refreshRate: z.number().optional(),
    processor: z.string().optional(),
    battery: z.number().optional(),  // mAh
    hasPenSupport: z.boolean().optional(),
    hasLte: z.boolean().optional(),
    hasFaceId: z.boolean().optional(),
    os: z.string().optional(),  // iPadOS, Android
});

export const TabletOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('tablet'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: TabletSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
        revisadoPor: z.string().optional(),
        notas: z.string().optional(),
    }).optional(),
});

export type TabletOpusRawInput = z.infer<typeof TabletOpusRawInputSchema>;
