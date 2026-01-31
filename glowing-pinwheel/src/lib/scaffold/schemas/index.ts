/**
 * @file index.ts
 * @description Registry unificado de schemas por categoria (P8: 53 categorias)
 * 
 * ARQUITETURA DATA-DRIVEN:
 * - Categorias "production": schemas específicos e rigorosos
 * - Categorias "stub": fallback para schema genérico
 */

import { z, type ZodSchema } from 'zod';

// Import schemas por categoria (11 production)
import { RobotVacuumOpusRawInputSchema, type RobotVacuumOpusRawInput } from './robot-vacuum';
import { TVOpusRawInputSchema, type TVOpusRawInput } from './tv';
import { FridgeOpusRawInputSchema, type FridgeOpusRawInput } from './fridge';
import { AirConditionerOpusRawInputSchema, type AirConditionerOpusRawInput } from './air-conditioner';
import { SmartwatchOpusRawInputSchema, type SmartwatchOpusRawInput } from './smartwatch';
import { SmartphoneOpusRawInputSchema, type SmartphoneOpusRawInput } from './smartphone';
import { LaptopOpusRawInputSchema, type LaptopOpusRawInput } from './laptop';
import { WasherOpusRawInputSchema, type WasherOpusRawInput } from './washer';
import { MonitorOpusRawInputSchema, type MonitorOpusRawInput } from './monitor';
import { TabletOpusRawInputSchema, type TabletOpusRawInput } from './tablet';
import { SoundbarOpusRawInputSchema, type SoundbarOpusRawInput } from './soundbar';

// Common schemas
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema, EnergyInputSchema } from './common';

// Re-export common
export * from './common';

// Re-export category schemas
export { RobotVacuumOpusRawInputSchema, type RobotVacuumOpusRawInput } from './robot-vacuum';
export { TVOpusRawInputSchema, type TVOpusRawInput } from './tv';
export { FridgeOpusRawInputSchema, type FridgeOpusRawInput } from './fridge';
export { AirConditionerOpusRawInputSchema, type AirConditionerOpusRawInput } from './air-conditioner';
export { SmartwatchOpusRawInputSchema, type SmartwatchOpusRawInput } from './smartwatch';
export { SmartphoneOpusRawInputSchema, type SmartphoneOpusRawInput } from './smartphone';
export { LaptopOpusRawInputSchema, type LaptopOpusRawInput } from './laptop';
export { WasherOpusRawInputSchema, type WasherOpusRawInput } from './washer';
export { MonitorOpusRawInputSchema, type MonitorOpusRawInput } from './monitor';
export { TabletOpusRawInputSchema, type TabletOpusRawInput } from './tablet';
export { SoundbarOpusRawInputSchema, type SoundbarOpusRawInput } from './soundbar';

// ============================================
// FALLBACK SCHEMA (P8 Stub Categories)
// ============================================

/**
 * Schema genérico para categorias stub
 * Aceita specs flexíveis, mas requer product/price/sources
 */
export const GenericOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.string().min(1),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    energy: EnergyInputSchema.optional(),
    specs: z.record(z.string(), z.unknown()),  // Aceita qualquer spec
    evidence: z.record(z.string(), z.object({
        sourceUrl: z.string().url(),
        note: z.string().optional(),
    })).optional(),
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type GenericOpusRawInput = z.infer<typeof GenericOpusRawInputSchema>;

// ============================================
// SUPPORTED CATEGORIES (53 total)
// ============================================

export const PRODUCTION_CATEGORIES = [
    'robot-vacuum', 'tv', 'fridge', 'air_conditioner', 'smartwatch',
    'smartphone', 'laptop', 'washer', 'monitor', 'tablet', 'soundbar',
] as const;

export const STUB_CATEGORIES = [
    // Tier 2: Mobile
    'tws', 'bluetooth-speaker',
    // Tier 3: Gaming
    'console', 'headset-gamer', 'gamepad', 'chair',
    // Tier 4: Video/Audio
    'projector', 'tvbox',
    // Tier 5: Computing
    'printer', 'router',
    // Tier 6: Components
    'cpu', 'gpu', 'motherboard', 'ram', 'ssd', 'psu', 'case',
    // Tier 7: Refrigeration
    'freezer', 'minibar', 'wine-cooler', 'fan',
    // Tier 8: Kitchen
    'stove', 'builtin-oven', 'microwave', 'air-fryer', 'range-hood',
    'dishwasher', 'espresso-machine', 'mixer', 'water-purifier', 'food-mixer',
    // Tier 9: Cleaning
    'washer-dryer', 'stick-vacuum', 'pressure-washer',
    // Tier 10: Security/Home
    'security-camera', 'smart-lock',
    // Tier 11: Utilities
    'ups', 'power-strip', 'camera',
    // Tier 12: Auto/Tools
    'tire', 'car-battery', 'drill',
] as const;

export const SUPPORTED_SCAFFOLD_CATEGORIES = [
    ...PRODUCTION_CATEGORIES,
    ...STUB_CATEGORIES,
] as const;

export type SupportedScaffoldCategory = typeof SUPPORTED_SCAFFOLD_CATEGORIES[number];

// ============================================
// SCHEMA REGISTRY
// ============================================

const PRODUCTION_SCHEMA_MAP: Record<string, ZodSchema> = {
    'robot-vacuum': RobotVacuumOpusRawInputSchema,
    'tv': TVOpusRawInputSchema,
    'fridge': FridgeOpusRawInputSchema,
    'air_conditioner': AirConditionerOpusRawInputSchema,
    'smartwatch': SmartwatchOpusRawInputSchema,
    'smartphone': SmartphoneOpusRawInputSchema,
    'laptop': LaptopOpusRawInputSchema,
    'washer': WasherOpusRawInputSchema,
    'monitor': MonitorOpusRawInputSchema,
    'tablet': TabletOpusRawInputSchema,
    'soundbar': SoundbarOpusRawInputSchema,
};

/**
 * Obtém o schema para uma categoria
 * Retorna schema específico para production, genérico para stubs
 */
export function getSchemaForCategory(categoryId: string): ZodSchema | null {
    if (PRODUCTION_SCHEMA_MAP[categoryId]) {
        return PRODUCTION_SCHEMA_MAP[categoryId];
    }
    if (STUB_CATEGORIES.includes(categoryId as typeof STUB_CATEGORIES[number])) {
        return GenericOpusRawInputSchema;
    }
    return null;
}

/**
 * Verifica se uma categoria usa schema de produção ou stub
 */
export function getCategorySchemaType(categoryId: string): 'production' | 'stub' | 'unsupported' {
    if (PRODUCTION_CATEGORIES.includes(categoryId as typeof PRODUCTION_CATEGORIES[number])) {
        return 'production';
    }
    if (STUB_CATEGORIES.includes(categoryId as typeof STUB_CATEGORIES[number])) {
        return 'stub';
    }
    return 'unsupported';
}

// ============================================
// UNIFIED TYPE
// ============================================

export type OpusRawInput =
    | RobotVacuumOpusRawInput
    | TVOpusRawInput
    | FridgeOpusRawInput
    | AirConditionerOpusRawInput
    | SmartwatchOpusRawInput
    | SmartphoneOpusRawInput
    | LaptopOpusRawInput
    | WasherOpusRawInput
    | MonitorOpusRawInput
    | TabletOpusRawInput
    | SoundbarOpusRawInput
    | GenericOpusRawInput;

// ============================================
// PARSE FUNCTION
// ============================================

export interface ParseResult<T = OpusRawInput> {
    success: boolean;
    data?: T;
    errors?: string[];
    categoryId?: string;
    schemaType?: 'production' | 'stub';
}

/**
 * Valida input raw com o schema correto para a categoria
 */
export function parseOpusRawInput(
    categoryId: string,
    data: unknown
): ParseResult {
    const schemaType = getCategorySchemaType(categoryId);

    if (schemaType === 'unsupported') {
        return {
            success: false,
            errors: [`Categoria '${categoryId}' não suportada pelo scaffolder. Categorias disponíveis: ${SUPPORTED_SCAFFOLD_CATEGORIES.join(', ')}`],
            categoryId,
        };
    }

    const schema = getSchemaForCategory(categoryId);
    if (!schema) {
        return {
            success: false,
            errors: [`Schema não encontrado para categoria '${categoryId}'`],
            categoryId,
        };
    }

    const result = schema.safeParse(data);

    if (result.success) {
        return {
            success: true,
            data: result.data as OpusRawInput,
            categoryId,
            schemaType,
        };
    }

    return {
        success: false,
        errors: result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`),
        categoryId,
        schemaType,
    };
}

/**
 * Verifica se uma categoria é suportada pelo scaffolder
 */
export function isSupportedCategory(categoryId: string): categoryId is SupportedScaffoldCategory {
    return SUPPORTED_SCAFFOLD_CATEGORIES.includes(categoryId as SupportedScaffoldCategory);
}

/**
 * Lista categorias suportadas
 */
export function listSupportedCategories(): string[] {
    return [...SUPPORTED_SCAFFOLD_CATEGORIES];
}
