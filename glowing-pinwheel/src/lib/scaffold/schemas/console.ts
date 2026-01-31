/**
 * @file console.ts
 * @description Schema Zod para input raw de Consoles de Videogame
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const ConsoleSpecsInputSchema = z.object({
    // Obrigatórios
    storage: z.number().positive(),  // GB

    // Recomendados
    generation: z.string().optional(),  // 9th, current
    hasDiscDrive: z.boolean().optional(),
    resolution: z.string().optional(),  // 4K, 1080p, 1440p
    fps: z.number().optional(),  // 60, 120
    hasRayTracing: z.boolean().optional(),
    controller: z.string().optional(),
    exclusives: z.array(z.string()).optional(),
});

export const ConsoleOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('console'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: ConsoleSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type ConsoleOpusRawInput = z.infer<typeof ConsoleOpusRawInputSchema>;
