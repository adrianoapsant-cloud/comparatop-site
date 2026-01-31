/**
 * @file smartphone.ts
 * @description Schema Zod para input raw de Smartphone
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

// ============================================
// SMARTPHONE SPECS
// ============================================

export const SmartphoneSpecsInputSchema = z.object({
    // Obrigatórios (pelo menos storage OU ram)
    storage: z.number().positive().optional(),  // GB
    ram: z.number().positive().optional(),  // GB

    // Recomendados
    displaySize: z.number().positive().optional(),  // polegadas
    displayType: z.string().optional(),  // AMOLED, LCD, etc.
    refreshRate: z.number().optional(),  // 60, 90, 120
    processor: z.string().optional(),
    battery: z.number().optional(),  // mAh
    chargingSpeed: z.number().optional(),  // W
    mainCamera: z.number().optional(),  // MP
    certification: z.string().optional(),  // IP68, IP67
    os: z.string().optional(),  // Android 15, iOS 18
    nfc: z.boolean().optional(),
    esim: z.boolean().optional(),
    fiveG: z.boolean().optional(),
    wirelessCharging: z.boolean().optional(),
}).refine(
    data => data.storage !== undefined || data.ram !== undefined,
    { message: 'storage ou ram é obrigatório', path: ['storage'] }
);

// ============================================
// OPUS RAW INPUT (smartphone)
// ============================================

export const SmartphoneOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('smartphone'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    // Energia opcional para smartphone (bateria é spec, não consumo elétrico)
    specs: SmartphoneSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
        revisadoPor: z.string().optional(),
        notas: z.string().optional(),
    }).optional(),
});

export type SmartphoneOpusRawInput = z.infer<typeof SmartphoneOpusRawInputSchema>;
