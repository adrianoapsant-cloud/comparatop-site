/**
 * @file soundbar.ts
 * @description Schema Zod para input raw de Soundbar
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const SoundbarSpecsInputSchema = z.object({
    watts: z.number().positive(),  // REQUIRED (potência total)

    // Recommended
    channels: z.string().optional(),  // 2.1, 3.1, 5.1, 7.1.4
    hasDolbyAtmos: z.boolean().optional(),
    hasDts: z.boolean().optional(),
    hasSubwoofer: z.boolean().optional(),  // subwoofer incluído
    subwooferType: z.string().optional(),  // wireless, wired
    hasHdmiArc: z.boolean().optional(),
    hasHdmiEarc: z.boolean().optional(),
    hasBluetooth: z.boolean().optional(),
    hasWifi: z.boolean().optional(),
    hasVoiceAssistant: z.boolean().optional(),
    lengthCm: z.number().optional(),  // comprimento em cm
});

export const SoundbarOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('soundbar'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: SoundbarSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
        revisadoPor: z.string().optional(),
        notas: z.string().optional(),
    }).optional(),
});

export type SoundbarOpusRawInput = z.infer<typeof SoundbarOpusRawInputSchema>;
