/**
 * @file getBaseScore.ts
 * @description Função utilitária centralizada para obter o score base de um produto.
 * 
 * ARQUITETURA DE SCORING (2026-02-02):
 * 1. PARR Ponderado via getUnifiedScore() - SSOT para produtos com scores c1-c10
 * 2. header.overallScore (Gemini pre-calculated)
 * 3. computed.overall (legacy scored products)
 * 4. 7.5 (fallback final)
 * 
 * @example
 * import { getBaseScore } from '@/lib/getBaseScore';
 * const score = getBaseScore(product); // 8.4
 */

import type { Product, ScoredProduct } from '@/types/category';
import {
    getUnifiedScore,
    normalizeCategoryId,
} from './scoring/getUnifiedScore';

// Re-export normalizeCategoryId for backward compatibility
export { normalizeCategoryId };

/**
 * Extended product type with header containing Gemini-calculated score
 */
type ProductWithHeader = Product & {
    header?: {
        overallScore?: number;
        scoreLabel?: string;
        title?: string;
        subtitle?: string;
    };
};

/**
 * Normalize a score to 0-10 scale.
 */
export function normalizeScore(score: number): number {
    if (typeof score !== 'number' || isNaN(score)) return 7.5;
    if (score > 10) {
        return Math.round((score / 10) * 100) / 100;
    }
    return score;
}

/**
 * Get the base score for a product.
 * 
 * Uses PARR Ponderado (via getUnifiedScore) as the primary scoring method.
 * Falls back to header.overallScore or computed.overall for legacy support.
 * 
 * @param product - The product to get the score for
 * @returns The base score (0-10), with 2 decimal places
 */
export function getBaseScore(product: Product | ScoredProduct): number {
    // 1. PRIMARY: Use PARR Ponderado via getUnifiedScore if product has scores
    if (product.scores && Object.keys(product.scores).length > 0) {
        // Check if we have c1-c10 scores (not just derived scores like 'gaming')
        const hasCriteriaScores = Object.keys(product.scores).some(k => /^c\d+$/.test(k));
        if (hasCriteriaScores) {
            return getUnifiedScore(product);
        }
    }

    // 2. FALLBACK: Try header.overallScore (saved by Gemini)
    const productWithHeader = product as ProductWithHeader;
    if (productWithHeader.header?.overallScore !== undefined) {
        return normalizeScore(productWithHeader.header.overallScore);
    }

    // 3. FALLBACK: computed.overall (for legacy scored products)
    const scoredProduct = product as ScoredProduct;
    if (scoredProduct.computed?.overall !== undefined) {
        return normalizeScore(scoredProduct.computed.overall);
    }

    // 4. FINAL FALLBACK - neutral score
    return 7.5;
}

/**
 * Get the score label for a product (e.g., "Muito Bom", "Excelente")
 */
export function getScoreLabel(product: Product | ScoredProduct): string {
    const productWithHeader = product as ProductWithHeader;
    if (productWithHeader.header?.scoreLabel) {
        return productWithHeader.header.scoreLabel;
    }

    const score = getBaseScore(product);
    if (score >= 9.0) return 'Excepcional';
    if (score >= 8.0) return 'Muito Bom';
    if (score >= 7.0) return 'Bom';
    if (score >= 6.0) return 'Regular';
    if (score >= 5.0) return 'Abaixo da Média';
    return 'Fraco';
}

/**
 * Get the color class for a score badge
 */
export function getScoreColorClass(score: number): string {
    if (score >= 8) return 'text-emerald-600';
    if (score >= 6) return 'text-amber-600';
    return 'text-red-600';
}

/**
 * Get the background color class for a score badge
 */
export function getScoreBgClass(score: number): string {
    if (score >= 8) return 'bg-emerald-100';
    if (score >= 6) return 'bg-amber-100';
    return 'bg-red-100';
}

export default getBaseScore;
