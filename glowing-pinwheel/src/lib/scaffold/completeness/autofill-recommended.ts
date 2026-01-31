/**
 * @file autofill-recommended.ts
 * @description P13: Auto-fill recommended fields para production categories
 * 
 * REGRA DE OURO: Não inventar fatos, apenas preencher com placeholders neutros __CT_TODO__
 */

import { getContract, type CompletenessContract } from '../../../config/category-completeness';
import type { CategoryDefinition } from '../../../types/category';

// ============================================
// CONSTANTS
// ============================================

export const PRODUCTION_CATEGORIES = [
    'tv', 'fridge', 'air_conditioner', 'smartphone', 'robot-vacuum',
    'smartwatch', 'laptop', 'washer', 'monitor', 'tablet', 'soundbar',
] as const;

export type ProductionCategoryId = typeof PRODUCTION_CATEGORIES[number];

export function isProductionCategory(categoryId: string): boolean {
    return (PRODUCTION_CATEGORIES as readonly string[]).includes(categoryId);
}

// ============================================
// TYPES
// ============================================

export interface AutofillResult {
    categoryId: string;
    isProduction: boolean;
    fieldsAutofilled: string[];
    placeholdersCreated: number;
}

// ============================================
// PLACEHOLDER GENERATORS
// ============================================

function generateScoreReasonPlaceholder(
    criterionKey: string,
    criterionLabel: string,
    score: number
): string {
    return `__CT_TODO__: Justificar nota ${score.toFixed(1)}/10 em '${criterionLabel}' usando evidenceMap e fontes oficiais`;
}

function generateBadgePlaceholder(): { id: string; label: string; variant: string } {
    return {
        id: '__CT_TODO__',
        label: '__CT_TODO__: adicionar badge relevante',
        variant: 'neutral',
    };
}

function generateOfferPlaceholder(): { store: string; price: number; url: string } {
    return {
        store: '__CT_TODO__',
        price: 0,
        url: '__CT_TODO__: usar URL real de oferta',
    };
}

function generateMainCompetitorPlaceholder(): string {
    return '__CT_TODO__: identificar concorrente principal com base em preço/specs similares';
}

// ============================================
// AUTOFILL LOGIC
// ============================================

function setNestedValue(
    obj: Record<string, unknown>,
    fieldPath: string,
    value: unknown
): void {
    const parts = fieldPath.split('.');
    let current: Record<string, unknown> = obj;

    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!(part in current)) {
            current[part] = {};
        }
        current = current[part] as Record<string, unknown>;
    }

    const lastPart = parts[parts.length - 1];
    current[lastPart] = value;
}

function getNestedValue(obj: unknown, fieldPath: string): unknown {
    const parts = fieldPath.split('.');
    let current: unknown = obj;

    for (const part of parts) {
        if (current === null || current === undefined) return undefined;
        if (typeof current !== 'object') return undefined;
        current = (current as Record<string, unknown>)[part];
    }

    return current;
}

function isValuePresent(value: unknown): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
}

/**
 * Auto-fills recommended fields ONLY for production categories.
 * 
 * Uses neutral placeholders (__CT_TODO__) to avoid inventing facts.
 * Stubs are left as-is (can continue to exit 1).
 */
export function applyProductionRecommendedDefaults(
    data: Record<string, unknown>,
    categoryId: string,
    scores?: Record<string, number>,
    criteriaLabels?: Record<string, string>
): AutofillResult {
    const result: AutofillResult = {
        categoryId,
        isProduction: isProductionCategory(categoryId),
        fieldsAutofilled: [],
        placeholdersCreated: 0,
    };

    // Only auto-fill for production categories
    if (!result.isProduction) {
        return result;
    }

    const contract = getContract(categoryId);
    if (!contract) {
        return result;
    }

    // Process each recommended field
    for (const fieldPath of contract.recommendedFields) {
        const currentValue = getNestedValue(data, fieldPath);

        // Skip if already present
        if (isValuePresent(currentValue)) {
            continue;
        }

        let placeholderValue: unknown;

        // Handle different field types
        if (fieldPath.startsWith('scoreReasons.c')) {
            const criterionKey = fieldPath.replace('scoreReasons.', '');
            const score = scores?.[criterionKey] ?? 7.0;
            const label = criteriaLabels?.[criterionKey] ?? criterionKey.toUpperCase();
            placeholderValue = generateScoreReasonPlaceholder(criterionKey, label, score);
        } else if (fieldPath === 'badges') {
            placeholderValue = [generateBadgePlaceholder()];
        } else if (fieldPath === 'offers') {
            placeholderValue = [generateOfferPlaceholder()];
        } else if (fieldPath === 'mainCompetitor') {
            placeholderValue = generateMainCompetitorPlaceholder();
        } else {
            // Generic placeholder for other fields
            placeholderValue = `__CT_TODO__: preencher ${fieldPath}`;
        }

        setNestedValue(data, fieldPath, placeholderValue);
        result.fieldsAutofilled.push(fieldPath);
        result.placeholdersCreated++;
    }

    return result;
}

/**
 * Generates the report section for auto-filled fields
 */
export function generateAutofillReportSection(autofillResult: AutofillResult): string {
    if (!autofillResult.isProduction) {
        return '';
    }

    if (autofillResult.fieldsAutofilled.length === 0) {
        return '';
    }

    return `
## Auto-filled Recommended (Production Defaults)

**Category**: \`${autofillResult.categoryId}\` (production)
**Placeholders Created**: ${autofillResult.placeholdersCreated}

${autofillResult.fieldsAutofilled.map(f => `- \`${f}\``).join('\n')}

> ⚠️ These fields contain __CT_TODO__ placeholders and must be reviewed before publishing.
`;
}
