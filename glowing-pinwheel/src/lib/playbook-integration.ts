/**
 * @file playbook-integration.ts
 * @description P15.1: Integração de Playbooks com CategoryDefinitions
 * 
 * Este módulo aplica os playbooks (labels/pesos do "10 dores.txt") às
 * CategoryDefinitions em runtime, substituindo labels e weights.
 * 
 * Compatibilidade retro: Categorias sem playbook mantêm comportamento original.
 */

import type { CategoryDefinition } from '@/types/category';
import { PLAYBOOKS, type CategoryPlaybook } from '@/config/category-playbooks';

// ============================================
// CORE INTEGRATION
// ============================================

/**
 * Aplica playbook a uma CategoryDefinition, substituindo labels/weights
 * dos criteria. Mantém outros campos intactos.
 */
export function applyCategoryPlaybook(
    category: CategoryDefinition,
    playbook: CategoryPlaybook
): CategoryDefinition {
    // Clone profundo para não mutar o original
    const result: CategoryDefinition = {
        ...category,
        criteria: category.criteria.map((criterion, index) => {
            const playbookCriterion = playbook.criteria[index];

            if (!playbookCriterion) {
                // Playbook não tem esse critério, manter original
                return { ...criterion };
            }

            // Override label e weight do playbook
            return {
                ...criterion,
                label: playbookCriterion.label,
                weight: playbookCriterion.weight,
                // Preservar outros campos do criterion original (group, icon, description)
            };
        }),
    };

    return result;
}

/**
 * Obtém CategoryDefinition com playbook aplicado (se existir)
 */
export function getCategoryWithPlaybook(
    category: CategoryDefinition
): CategoryDefinition {
    const playbook = PLAYBOOKS[category.id];

    if (!playbook) {
        // Sem playbook, retornar original
        return category;
    }

    return applyCategoryPlaybook(category, playbook);
}

/**
 * Aplica playbooks a um registro de categorias
 */
export function applyPlaybooksToCategories(
    categories: Record<string, CategoryDefinition>
): Record<string, CategoryDefinition> {
    const result: Record<string, CategoryDefinition> = {};

    for (const [id, category] of Object.entries(categories)) {
        result[id] = getCategoryWithPlaybook(category);
    }

    return result;
}

// ============================================
// EXTRACTED UTILITIES
// ============================================

/**
 * Extrai labels c1..c10 de uma CategoryDefinition
 */
export function extractCriteriaLabels(
    category: CategoryDefinition
): Record<string, string> {
    const labels: Record<string, string> = {};

    for (const criterion of category.criteria) {
        labels[criterion.id] = criterion.label;
    }

    return labels;
}

/**
 * Extrai weights c1..c10 de uma CategoryDefinition
 */
export function extractCriteriaWeights(
    category: CategoryDefinition
): Record<string, number> {
    const weights: Record<string, number> = {};

    for (const criterion of category.criteria) {
        weights[criterion.id] = criterion.weight;
    }

    return weights;
}

/**
 * Verifica se uma categoria tem playbook
 */
export function hasPlaybook(categoryId: string): boolean {
    return categoryId in PLAYBOOKS;
}

/**
 * Lista categorias com playbook disponível
 */
export function getCategoriesWithPlaybooks(): string[] {
    return Object.keys(PLAYBOOKS);
}

// ============================================
// DEBUG / SANITY CHECK
// ============================================

export interface PlaybookValidationResult {
    categoryId: string;
    hasPlaybook: boolean;
    labelsFromPlaybook: boolean;
    weightsFromPlaybook: boolean;
    labels: Record<string, string>;
    weights: Record<string, number>;
    weightSum: number;
}

/**
 * Valida que uma categoria está usando labels/pesos do playbook
 */
export function validatePlaybookIntegration(
    category: CategoryDefinition
): PlaybookValidationResult {
    const playbook = PLAYBOOKS[category.id];
    const labels = extractCriteriaLabels(category);
    const weights = extractCriteriaWeights(category);
    const weightSum = Object.values(weights).reduce((a, b) => a + b, 0);

    if (!playbook) {
        return {
            categoryId: category.id,
            hasPlaybook: false,
            labelsFromPlaybook: false,
            weightsFromPlaybook: false,
            labels,
            weights,
            weightSum: Math.round(weightSum * 100),
        };
    }

    // Verificar se labels batem com o playbook
    const labelsMatch = playbook.criteria.every((pc, i) => {
        const criterion = category.criteria[i];
        return criterion && criterion.label === pc.label;
    });

    // Verificar se weights batem com o playbook (tolerância de 0.001)
    const weightsMatch = playbook.criteria.every((pc, i) => {
        const criterion = category.criteria[i];
        return criterion && Math.abs(criterion.weight - pc.weight) < 0.001;
    });

    return {
        categoryId: category.id,
        hasPlaybook: true,
        labelsFromPlaybook: labelsMatch,
        weightsFromPlaybook: weightsMatch,
        labels,
        weights,
        weightSum: Math.round(weightSum * 100),
    };
}
