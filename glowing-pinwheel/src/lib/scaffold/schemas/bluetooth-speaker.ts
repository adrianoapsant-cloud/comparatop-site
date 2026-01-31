/**
 * @file bluetooth-speaker.ts
 * @description Schema Zod para input raw de BluetoothSpeaker
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const BluetoothSpeakerSpecsInputSchema = z.object({
    powerWattsRms: z.number().positive(),
    batteryHours: z.number().positive(),
    waterResistance: z.boolean().optional(),
    hasStereoPairing: z.boolean().optional(),
    hasPartyMode: z.boolean().optional(),
});

export const BluetoothSpeakerOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('bluetooth-speaker'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: BluetoothSpeakerSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type BluetoothSpeakerOpusRawInput = z.infer<typeof BluetoothSpeakerOpusRawInputSchema>;
