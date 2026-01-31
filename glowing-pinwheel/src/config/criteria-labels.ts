/**
 * @file criteria-labels.ts
 * @description SSOT (Single Source of Truth) para labels e mappings de c1..c10
 * 
 * Centraliza:
 * - getCategoryCriteriaLabels: busca labels da categoria de categories.ts
 * - CATEGORY_FIELD_MAPS: mapping para UnifiedVoice/API (antes disperso em useUnifiedVoice.ts)
 */

import { CATEGORIES } from '@/data/categories';

// ============================================
// TYPES
// ============================================

export type ScoreKey = 'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6' | 'c7' | 'c8' | 'c9' | 'c10';

export type CriteriaLabels = Record<ScoreKey, string>;

// ============================================
// GET LABELS FROM CATEGORIES.TS
// ============================================

/**
 * Obtém labels de c1..c10 da categoria
 * Lê diretamente de CATEGORIES (categories.ts) como fonte de verdade
 * 
 * @param categoryId - ID da categoria
 * @returns Labels por scoreKey ou null se categoria não existe
 */
export function getCategoryCriteriaLabels(categoryId: string): CriteriaLabels | null {
    const category = CATEGORIES[categoryId];
    if (!category) return null;

    const labels: Partial<CriteriaLabels> = {};

    for (const criterion of category.criteria) {
        const key = criterion.id as ScoreKey;
        if (key.startsWith('c') && parseInt(key.slice(1)) >= 1 && parseInt(key.slice(1)) <= 10) {
            labels[key] = criterion.label;
        }
    }

    // Garantir que todos os c1..c10 existem
    const allKeys: ScoreKey[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10'];
    for (const key of allKeys) {
        if (!labels[key]) {
            labels[key] = `Critério ${key.toUpperCase()}`;
        }
    }

    return labels as CriteriaLabels;
}

// ============================================
// CATEGORY FIELD MAPS (UnifiedVoice / API)
// ============================================

/**
 * Mapping de c1..c10 para nomes de campos da API/UnifiedVoice
 * SSOT para evitar drift entre useUnifiedVoice.ts e API routes
 */
export const CATEGORY_FIELD_MAPS: Record<string, Record<string, string>> = {
    tv: {
        c1: 'custo_beneficio',
        c2: 'processamento',
        c3: 'confiabilidade',
        c4: 'sistema',
        c5: 'gaming',
        c6: 'brilho',
        c7: 'pos_venda',
        c8: 'som',
        c9: 'conectividade',
        c10: 'design',
    },
    fridge: {
        c1: 'custo_beneficio',
        c2: 'eficiencia_energetica',
        c3: 'capacidade',
        c4: 'refrigeracao',
        c5: 'confiabilidade',
        c6: 'ruido',
        c7: 'pos_venda',
        c8: 'recursos_smart',
        c9: 'design',
        c10: 'funcionalidades',
    },
    air_conditioner: {
        c1: 'custo_beneficio',
        c2: 'eficiencia',
        c3: 'capacidade_btu',
        c4: 'durabilidade',
        c5: 'silencio',
        c6: 'inverter',
        c7: 'pos_venda',
        c8: 'filtros',
        c9: 'conectividade',
        c10: 'design',
    },
    'robot-vacuum': {
        c1: 'navegacao',
        c2: 'app_voz',
        c3: 'mop',
        c4: 'escovas',
        c5: 'altura',
        c6: 'pecas',
        c7: 'bateria',
        c8: 'ruido',
        c9: 'base',
        c10: 'ia',
    },
};

/**
 * Obtém o field map para uma categoria
 * Fallback para tv se categoria não tiver mapping específico
 */
export function getCategoryFieldMap(categoryId: string): Record<string, string> {
    return CATEGORY_FIELD_MAPS[categoryId] || CATEGORY_FIELD_MAPS.tv;
}

/**
 * Inverte o field map (field -> scoreKey)
 */
export function getInvertedFieldMap(categoryId: string): Record<string, string> {
    const fieldMap = getCategoryFieldMap(categoryId);
    const inverted: Record<string, string> = {};
    for (const [key, value] of Object.entries(fieldMap)) {
        inverted[value] = key;
    }
    return inverted;
}
