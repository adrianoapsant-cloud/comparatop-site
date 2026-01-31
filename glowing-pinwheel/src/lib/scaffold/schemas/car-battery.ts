/**
 * @file car-battery.ts
 * @description Schema Zod para input raw de CarBattery
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const CarBatterySpecsInputSchema = z.object({
    ampereHours: z.number().positive(),
    cca: z.string().min(1),
    voltage: z.string().min(1),
    warrantyMonths: z.number().optional(),
    technology: z.string().optional(),
});

export const CarBatteryOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('car-battery'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: CarBatterySpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type CarBatteryOpusRawInput = z.infer<typeof CarBatteryOpusRawInputSchema>;
