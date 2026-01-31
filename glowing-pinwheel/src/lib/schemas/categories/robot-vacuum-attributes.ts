/**
 * @file robot-vacuum-attributes.ts
 * @description Schema Zod para atributos específicos de Robôs Aspiradores
 * 
 * ERROR fields: obrigatórios para produtos published
 * WARN fields: recomendados, geram warning se ausentes
 */

import { z } from 'zod';

// ============================================
// ROBOT VACUUM ATTRIBUTES SCHEMA
// ============================================

/**
 * Campos obrigatórios (ERROR se ausentes em published)
 * NOTA: Aceita tanto suctionPa quanto suctionPower como campo de sucção
 * NOTA: navigationType aceita variações de case (LiDAR, lidar, etc.)
 */
const RobotVacuumRequiredSchema = z.object({
    navigationType: z.enum(['LiDAR', 'lidar', 'VSLAM', 'vslam', 'random', 'gyroscope']).optional(),
    suctionPa: z.number().positive().optional(),
    suctionPower: z.number().positive().optional(),
}).refine(
    data => data.suctionPa !== undefined || data.suctionPower !== undefined,
    { message: 'suctionPa ou suctionPower é obrigatório', path: ['suctionPa'] }
);

/**
 * Campos recomendados (WARN se ausentes)
 * TODO: Normalizar mopType e brushType quando houver mais produtos cadastrados
 * Valores encontrados no inventário 2026-01-22:
 * - mopType: passive_drag, Estático com Reservatório, static_tank, static_electronic, Estático com Controle Eletrônico
 * - brushType: mixed_bristle, Cerdas Mistas, dual_rubber_anti_tangle, Dual Anti-Emaranhamento, standard_bristle, Escova Principal + Laterais
 */
const RobotVacuumRecommendedSchema = z.object({
    mopType: z.string().min(1),  // TODO: normalizar para enum após padronização
    hasSelfEmpty: z.boolean(),
    hasAutoEmpty: z.boolean(),  // Alias de hasSelfEmpty usado em alguns produtos
    hasSelfWash: z.boolean(),
    batteryMah: z.number().positive(),
    heightCm: z.number().positive(),
    height: z.number().positive(),  // Alias para heightCm em alguns produtos (specs.height)
    noiseLevelDb: z.number().positive(),
    noiseLevel: z.number().positive(),  // Alias para noiseLevelDb em alguns produtos
    brushType: z.string().min(1),  // TODO: normalizar para enum após padronização
});

/**
 * Schema completo com passthrough para campos extras
 */
export const RobotVacuumAttributesSchema = RobotVacuumRequiredSchema
    .merge(RobotVacuumRecommendedSchema.partial())
    .passthrough();

// ============================================
// ROBOT VACUUM ATTRIBUTE SPEC
// ============================================

export const ROBOT_VACUUM_ATTRIBUTE_SPEC = {
    categoryId: 'robot-vacuum' as const,
    schema: RobotVacuumAttributesSchema,
    requiredKeys: ['navigationType', 'suctionPa'] as const,
    recommendedKeys: [
        'mopType',
        'hasSelfEmpty',
        'hasSelfWash',
        'batteryMah',
        'heightCm',
        'noiseLevelDb',
        'brushType',
    ] as const,
};

export type RobotVacuumAttributes = z.infer<typeof RobotVacuumAttributesSchema>;
