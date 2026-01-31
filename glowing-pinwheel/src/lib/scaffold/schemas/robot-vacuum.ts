/**
 * @file robot-vacuum.ts
 * @description Schema Zod para input raw de Robot Vacuum
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EnergyInputSchema, EvidenceMapSchema } from './common';

// ============================================
// ROBOT VACUUM SPECS
// ============================================

export const RobotVacuumSpecsInputSchema = z.object({
    // Navegação (obrigatório)
    navigationType: z.enum(['LiDAR', 'lidar', 'VSLAM', 'vslam', 'random', 'gyroscope', 'camera']),
    // Sucção (obrigatório: um ou outro)
    suctionPa: z.number().positive().optional(),
    suctionPower: z.number().positive().optional(),
    // Dock/Base
    hasSelfEmpty: z.boolean().optional(),
    hasAutoEmpty: z.boolean().optional(),  // Alias
    hasSelfWash: z.boolean().optional(),
    // Mop
    hasMop: z.boolean().optional(),
    mopType: z.string().optional(),
    // Dimensões
    heightCm: z.number().positive().optional(),
    // Bateria
    batteryMah: z.number().positive().optional(),
    runtimeMinutes: z.number().positive().optional(),
    // Ruído
    noiseLevelDb: z.number().positive().optional(),
    // Escovas
    brushType: z.string().optional(),
}).refine(
    data => data.suctionPa !== undefined || data.suctionPower !== undefined,
    { message: 'suctionPa ou suctionPower é obrigatório', path: ['suctionPa'] }
);

// ============================================
// OPUS RAW INPUT (robot-vacuum)
// ============================================

export const RobotVacuumOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('robot-vacuum'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    energy: EnergyInputSchema.optional(),
    specs: RobotVacuumSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
        revisadoPor: z.string().optional(),
        notas: z.string().optional(),
    }).optional(),
});

export type RobotVacuumOpusRawInput = z.infer<typeof RobotVacuumOpusRawInputSchema>;
