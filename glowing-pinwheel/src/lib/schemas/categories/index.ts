/**
 * @file index.ts
 * @description Agregador de schemas de atributos por categoria
 * 
 * Exporta CATEGORY_ATTRIBUTE_SPECS e helper validateCategoryAttributes
 */

import { z } from 'zod';
import { TV_ATTRIBUTE_SPEC } from './tv-attributes';
import { ROBOT_VACUUM_ATTRIBUTE_SPEC } from './robot-vacuum-attributes';
import { FRIDGE_ATTRIBUTE_SPEC } from './fridge-attributes';
import { AIR_CONDITIONER_ATTRIBUTE_SPEC } from './air-conditioner-attributes';

// ============================================
// TYPES
// ============================================

export interface AttributeSpec {
    categoryId: string;
    schema: z.ZodTypeAny;
    requiredKeys: readonly string[];
    recommendedKeys: readonly string[];
}

export interface AttributeIssue {
    path: string;
    msg: string;
}

export interface CategoryAttributesValidationResult {
    errors: AttributeIssue[];
    warnings: AttributeIssue[];
}

// ============================================
// CATEGORY ATTRIBUTE SPECS REGISTRY
// ============================================

export const CATEGORY_ATTRIBUTE_SPECS: Record<string, AttributeSpec> = {
    'tv': TV_ATTRIBUTE_SPEC,
    'robot-vacuum': ROBOT_VACUUM_ATTRIBUTE_SPEC,
    'fridge': FRIDGE_ATTRIBUTE_SPEC,
    'air_conditioner': AIR_CONDITIONER_ATTRIBUTE_SPEC,
};

// ============================================
// VALIDATION HELPER
// ============================================

/**
 * Valida atributos de um produto contra o schema da categoria
 * 
 * @param categoryId - ID da categoria
 * @param attributes - Objeto de atributos do produto (pode ser undefined)
 * @param specs - Objeto de specs técnicos do produto (opcional, mesclado com attributes)
 * @returns Erros e warnings de validação
 */
export function validateCategoryAttributes(
    categoryId: string,
    attributes: unknown,
    specs?: unknown
): CategoryAttributesValidationResult {
    const result: CategoryAttributesValidationResult = {
        errors: [],
        warnings: [],
    };

    // Se categoria não tem spec definido, retorna vazio (não bloqueia)
    const spec = CATEGORY_ATTRIBUTE_SPECS[categoryId];
    if (!spec) {
        return result;
    }

    // Mescla specs + attributes (attributes tem precedência)
    const specsObj = (typeof specs === 'object' && specs !== null) ? specs as Record<string, unknown> : {};
    const attrsObj = (typeof attributes === 'object' && attributes !== null) ? attributes as Record<string, unknown> : {};
    const mergedData = { ...specsObj, ...attrsObj };

    // Se merge está vazio, todos os required são errors
    if (Object.keys(mergedData).length === 0) {
        for (const key of spec.requiredKeys) {
            result.errors.push({
                path: `attributes.${key}`,
                msg: `Campo obrigatório ausente`,
            });
        }
        for (const key of spec.recommendedKeys) {
            result.warnings.push({
                path: `attributes.${key}`,
                msg: `Campo recomendado ausente`,
            });
        }
        return result;
    }

    // Tenta validar contra o schema
    const parseResult = spec.schema.safeParse(mergedData);

    if (!parseResult.success) {
        // Processa erros do Zod
        for (const issue of parseResult.error.issues) {
            const path = `attributes.${issue.path.join('.')}`;
            const fieldName = issue.path[0]?.toString() || '';

            // Determina se é ERROR ou WARN baseado se é campo obrigatório
            if (spec.requiredKeys.includes(fieldName)) {
                result.errors.push({
                    path,
                    msg: issue.message,
                });
            } else {
                result.warnings.push({
                    path,
                    msg: issue.message,
                });
            }
        }
    }

    // Verifica campos recomendados ausentes (não cobertos pelo Zod partial)
    for (const key of spec.recommendedKeys) {
        if (!(key in mergedData) || mergedData[key] === undefined) {
            // Só adiciona warning se não já foi adicionado pelo Zod
            const alreadyWarned = result.warnings.some(w => w.path === `attributes.${key}`);
            if (!alreadyWarned) {
                result.warnings.push({
                    path: `attributes.${key}`,
                    msg: `Campo recomendado ausente`,
                });
            }
        }
    }

    return result;
}

// Re-export specs individuais
export { TV_ATTRIBUTE_SPEC } from './tv-attributes';
export { ROBOT_VACUUM_ATTRIBUTE_SPEC } from './robot-vacuum-attributes';
export { FRIDGE_ATTRIBUTE_SPEC } from './fridge-attributes';
export { AIR_CONDITIONER_ATTRIBUTE_SPEC } from './air-conditioner-attributes';
export type { TvAttributes } from './tv-attributes';
export type { RobotVacuumAttributes } from './robot-vacuum-attributes';
export type { FridgeAttributes } from './fridge-attributes';
export type { AirConditionerAttributes } from './air-conditioner-attributes';
