/**
 * @file common.ts
 * @description Schemas Zod comuns para todos os inputs raw do Opus
 */

import { z } from 'zod';

// ============================================
// SCHEMAS COMUNS
// ============================================

/**
 * Fonte de dado (URL obrigatória)
 */
export const SourceSchema = z.object({
    url: z.string().url(),
    accessedAt: z.string().optional(),
    type: z.enum(['amazon', 'manufacturer', 'review', 'marketplace', 'inmetro', 'other']).optional(),
});

/**
 * Informação de preço com fonte
 */
export const PriceInfoSchema = z.object({
    valueBRL: z.number().positive(),
    observedAt: z.string(),
    sourceUrl: z.string().url(),
    currency: z.literal('BRL').default('BRL'),
});

/**
 * Energia: aceita múltiplos formatos com precedência
 * INMETRO > labelKwhMonth > wattsTypical+usageHoursPerDay > baseline
 */
export const EnergyInputSchema = z.object({
    inmetroKwhYear: z.number().positive().optional(),
    labelKwhMonth: z.number().positive().optional(),
    wattsTypical: z.number().positive().optional(),
    usageHoursPerDay: z.number().positive().optional(),
    sourceUrl: z.string().url().optional(),
});

// ============================================
// EVIDENCE TRACKING (P5-1)
// ============================================

/**
 * Evidência para um campo específico
 * sourceUrl deve apontar para uma URL presente em sources[] ou price.sourceUrl
 */
export const EvidenceSchema = z.object({
    sourceUrl: z.string().url(),
    note: z.string().optional(),
});

/**
 * Mapa de evidências por fieldPath
 * Ex: { "specs.btus": { sourceUrl: "https://...", note: "Ficha técnica oficial" } }
 */
export const EvidenceMapSchema = z.record(z.string(), EvidenceSchema).optional();

// ============================================
// TYPES
// ============================================

export type Source = z.infer<typeof SourceSchema>;
export type PriceInfo = z.infer<typeof PriceInfoSchema>;
export type EnergyInput = z.infer<typeof EnergyInputSchema>;
export type Evidence = z.infer<typeof EvidenceSchema>;
export type EvidenceMap = z.infer<typeof EvidenceMapSchema>;
