/**
 * @file laptop.ts
 * @description Schema Zod para input raw de Laptop/Notebook
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EnergyInputSchema, EvidenceMapSchema } from './common';

export const LaptopSpecsInputSchema = z.object({
    processor: z.string().min(1),  // REQUIRED
    ram: z.number().positive(),     // REQUIRED (GB)
    storage: z.number().positive(), // REQUIRED (GB)

    // Recommended
    screenSize: z.number().positive().optional(),  // polegadas
    resolution: z.string().optional(),  // 1920x1080, 2560x1600
    displayType: z.string().optional(),  // IPS, OLED, TN
    gpu: z.string().optional(),
    batteryWh: z.number().optional(),
    weightKg: z.number().optional(),
    hasTouchscreen: z.boolean().optional(),
    hasBacklitKeyboard: z.boolean().optional(),
    hasThunderbolt: z.boolean().optional(),
    os: z.string().optional(),  // Windows 11, macOS
});

export const LaptopOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('laptop'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    energy: EnergyInputSchema.optional(),
    specs: LaptopSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
        revisadoPor: z.string().optional(),
        notas: z.string().optional(),
    }).optional(),
});

export type LaptopOpusRawInput = z.infer<typeof LaptopOpusRawInputSchema>;
