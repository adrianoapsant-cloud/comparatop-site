/**
 * @file getUnifiedScore.ts
 * @description Cálculo de score unificado (média ponderada c1..c10).
 * 
 * Regras:
 * - TypeScript puro, sem dependências externas
 * - Sem HMUM, sem header.overallScore, sem computed.overall
 * - Usa apenas product.scores como SSOT
 * - Robusto: fallback 7.5 para scores ausentes
 * - Sempre retorna 2 casas decimais
 */

import type { Product, ScoredProduct } from '@/types/category';
import {
    CATEGORY_WEIGHTS,
    CATEGORY_ALIASES,
    DEFAULT_WEIGHTS,
    type CriteriaKey,
    type Weights,
} from './category-weights';

// ============================================
// CONSTANTS
// ============================================

/** Score padrão quando não há dados */
const FALLBACK_SCORE = 7.5;

/** Todas as chaves de critério */
const ALL_CRITERIA: CriteriaKey[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10'];

// ============================================
// CATEGORY NORMALIZATION
// ============================================

/**
 * Normaliza categoryId para formato canônico.
 * 
 * @param input - categoryId do produto (pode ser undefined ou alias)
 * @returns categoryId canônico (lowercase)
 * 
 * Fallback: 'smart-tv' (categoria mais comum no projeto)
 */
export function normalizeCategoryId(input?: string): string {
    if (!input) {
        return 'smart-tv'; // fallback seguro - categoria mais populada
    }

    const lowered = input.toLowerCase().trim();

    // Tenta resolver alias
    const resolved = CATEGORY_ALIASES[lowered];
    if (resolved) {
        return resolved;
    }

    // Retorna como está (já pode ser canônico)
    return lowered;
}

// ============================================
// SCORE HELPERS
// ============================================

/**
 * Clamp um valor para o intervalo [min, max].
 */
function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

/**
 * Obtém o score de um critério, com fallback e clamp.
 * 
 * @param scores - Objeto de scores do produto
 * @param key - Chave do critério (c1..c10)
 * @returns Score normalizado (0-10) ou FALLBACK_SCORE se ausente
 */
function getCriterionScore(
    scores: Record<string, number> | undefined,
    key: CriteriaKey
): number {
    if (!scores) {
        return FALLBACK_SCORE;
    }

    const raw = scores[key];

    // Score ausente ou inválido
    if (raw === undefined || raw === null || typeof raw !== 'number' || isNaN(raw)) {
        return FALLBACK_SCORE;
    }

    // Clamp para 0-10
    return clamp(raw, 0, 10);
}

// ============================================
// MAIN FUNCTION
// ============================================

/**
 * Calcula o score unificado PARR ponderado para um produto.
 * 
 * @param product - Produto com scores (c1-c10)
 * @returns Score como number com 2 casas decimais (0.00-10.00)
 * 
 * Comportamento:
 * - Sem scores: retorna 7.50
 * - Score ausente em ci: usa 7.5 para esse critério
 * - Categoria com alias: resolve antes de buscar pesos
 * - Categoria sem pesos definidos: usa DEFAULT_WEIGHTS
 */
export function getUnifiedScore(product: Product | ScoredProduct): number {
    // Sem produto ou sem scores -> fallback
    if (!product || !product.scores || Object.keys(product.scores).length === 0) {
        return Number(FALLBACK_SCORE.toFixed(2));
    }

    // Normaliza categoria e obtém pesos
    const categoryId = normalizeCategoryId(product.categoryId);
    const weights: Weights = CATEGORY_WEIGHTS[categoryId] ?? DEFAULT_WEIGHTS;

    // Calcula média ponderada
    let weightedSum = 0;
    let totalWeight = 0;

    for (const key of ALL_CRITERIA) {
        const score = getCriterionScore(product.scores, key);
        const weight = weights[key];

        weightedSum += score * weight;
        totalWeight += weight;
    }

    // Evita divisão por zero (não deveria acontecer, mas safe)
    if (totalWeight === 0) {
        return Number(FALLBACK_SCORE.toFixed(2));
    }

    const result = weightedSum / totalWeight;

    // Retorna com exatamente 2 casas decimais
    return Number(result.toFixed(2));
}

// ============================================
// RE-EXPORTS (for convenience)
// ============================================

export { CATEGORY_WEIGHTS, CATEGORY_ALIASES, DEFAULT_WEIGHTS };
export type { CriteriaKey, Weights };
