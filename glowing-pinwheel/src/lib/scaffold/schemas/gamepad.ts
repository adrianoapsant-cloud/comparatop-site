/**
 * @file gamepad.ts
 * @description Schema Zod para input raw de Gamepad
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const GamepadSpecsInputSchema = z.object({
    platform: z.string().min(1),
    isWireless: z.boolean().optional(),
    hasRumble: z.boolean().optional(),
    hasAdaptiveTriggers: z.boolean().optional(),
    hasHallEffectSticks: z.boolean().optional(),
});

export const GamepadOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('gamepad'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: GamepadSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type GamepadOpusRawInput = z.infer<typeof GamepadOpusRawInputSchema>;
