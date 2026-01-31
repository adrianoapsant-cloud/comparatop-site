/**
 * @file monitor.ts
 * @description Schema Zod para input raw de Monitor
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EnergyInputSchema, EvidenceMapSchema } from './common';

export const MonitorSpecsInputSchema = z.object({
    screenSize: z.number().positive(),  // REQUIRED (polegadas)
    resolution: z.string().min(1),       // REQUIRED (1920x1080, 2560x1440, 3840x2160)

    // Recommended
    refreshRate: z.number().optional(),  // 60, 144, 165, 240
    panelType: z.string().optional(),    // IPS, VA, TN, OLED
    responseTimeMs: z.number().optional(),
    hasHdr: z.boolean().optional(),
    hasVrr: z.boolean().optional(),  // FreeSync, G-Sync
    hasPivot: z.boolean().optional(),
    hasHeightAdjust: z.boolean().optional(),
    hasUsbc: z.boolean().optional(),
    speakersWatts: z.number().optional(),
    contrastRatio: z.string().optional(),  // 1000:1, 3000:1
});

export const MonitorOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('monitor'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    energy: EnergyInputSchema.optional(),
    specs: MonitorSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
        revisadoPor: z.string().optional(),
        notas: z.string().optional(),
    }).optional(),
});

export type MonitorOpusRawInput = z.infer<typeof MonitorOpusRawInputSchema>;
