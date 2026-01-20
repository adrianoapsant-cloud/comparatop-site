/**
 * @file getBaseScore.ts
 * @description Função utilitária centralizada para obter o score base de um produto.
 * 
 * HIERARQUIA DE SCORING (2026):
 * 0. HMUM Score (Hybrid Multiplicative Utility Model) - Cobb-Douglas based
 * 1. header.overallScore (Gemini pre-calculated)
 * 2. computed.overall (legacy scored products)
 * 3. Calculate from product.scores (weighted sum)
 * 4. 7.5 (fallback)
 * 
 * O HMUM é o novo padrão para categorias configuradas. Usa modelo multiplicativo
 * que penaliza produtos com critérios muito fracos (deal breakers).
 * 
 * @example
 * import { getBaseScore } from '@/lib/getBaseScore';
 * const score = getBaseScore(product); // 8.4
 */

import type { Product, ScoredProduct } from '@/types/category';
import { getHMUMScore, hasHMUMSupport } from './getHMUMBreakdown';

/**
 * Extended product type with header containing Gemini-calculated score
 */
interface ProductWithHeader extends Product {
    header?: {
        overallScore?: number;
        scoreLabel?: string;
        title?: string;
        subtitle?: string;
    };
}

/**
 * Get the base score for a product.
 * 
 * This function calculates/retrieves the product score using a hierarchy:
 * 
 * Hierarchy:
 * 0. HMUM Score (if category has config) - Cobb-Douglas multiplicative model
 * 1. header.overallScore (preferred - saved by Gemini)
 * 2. computed.overall (legacy scored products)
 * 3. Calculate from product.scores using standard weights
 * 4. 7.5 (final fallback)
 * 
 * @param product - The product to get the score for
 * @returns The base score (0-10), typically with 1 decimal place
 */
export function getBaseScore(product: Product | ScoredProduct): number {
    // 0. NEW: Try HMUM calculation (Cobb-Douglas multiplicative model)
    // This is the preferred method for categories with HMUM config
    if (hasHMUMSupport(product)) {
        const hmumScore = getHMUMScore(product);
        if (hmumScore !== null) {
            return hmumScore;
        }
    }

    // 1. Try header.overallScore (preferred - saved by Gemini)
    const productWithHeader = product as ProductWithHeader;
    if (productWithHeader.header?.overallScore !== undefined) {
        return productWithHeader.header.overallScore;
    }

    // 2. Fallback: computed.overall (for legacy scored products)
    const scoredProduct = product as ScoredProduct;
    if (scoredProduct.computed?.overall !== undefined) {
        return scoredProduct.computed.overall;
    }

    // 3. Calculate from product.scores if available
    // Uses category-specific weights for the 10 criteria
    if (product.scores && Object.keys(product.scores).length > 0) {
        // Category-specific weights
        const CATEGORY_WEIGHTS: Record<string, Record<string, number>> = {
            // TV weights (default)
            tv: {
                c1: 0.15,  // Custo-Benefício
                c2: 0.08,  // Design
                c3: 0.12,  // Processamento
                c4: 0.18,  // Qualidade de Imagem
                c5: 0.08,  // Áudio
                c6: 0.10,  // Gaming
                c7: 0.08,  // Smart TV
                c8: 0.07,  // Conectividade
                c9: 0.07,  // Durabilidade
                c10: 0.07, // Suporte
            },
            // Robot Vacuum weights (PARR-BR)
            'robot-vacuum': {
                c1: 0.25,  // Navegação & Mapeamento (25%)
                c2: 0.15,  // Software & Conectividade (15%)
                c3: 0.15,  // Eficiência de Mop (15%)
                c4: 0.10,  // Engenharia de Escovas (10%)
                c5: 0.10,  // Restrições Físicas/Altura (10%)
                c6: 0.08,  // Manutenibilidade/Peças (8%)
                c7: 0.05,  // Autonomia/Bateria (5%)
                c8: 0.05,  // Acústica/Ruído (5%)
                c9: 0.05,  // Automação/Docks/Base (5%)
                c10: 0.02, // Recursos vs Gimmicks/IA (2%)
            },
            // Smartphone weights (10 Dores Brasil)
            smartphone: {
                c1: 0.20,  // Autonomia Real (IARSE)
                c2: 0.15,  // Estabilidade de Software (ESMI)
                c3: 0.15,  // Custo-Benefício & Revenda (RCBIRV)
                c4: 0.10,  // Câmera Social (QFSR)
                c5: 0.10,  // Resiliência Física (RFCT)
                c6: 0.08,  // Qualidade de Tela (QDAE)
                c7: 0.08,  // Pós-Venda & Peças (EPST)
                c8: 0.07,  // Conectividade (CPI)
                c9: 0.05,  // Armazenamento (AGD)
                c10: 0.02, // Recursos Úteis (IFM)
            },
        };

        // Get weights for this category (fallback to TV)
        const categoryId = product.categoryId || 'tv';
        const weights = CATEGORY_WEIGHTS[categoryId] || CATEGORY_WEIGHTS.tv;

        let weightedSum = 0;
        let totalWeight = 0;

        for (const [criterionId, score] of Object.entries(product.scores)) {
            // Only process c1-c10 criteria
            if (criterionId.match(/^c\d+$/) && typeof score === 'number') {
                const weight = weights[criterionId] ?? 0.1;
                weightedSum += score * weight;
                totalWeight += weight;
            }
        }

        if (totalWeight > 0) {
            // Round to 2 decimal places
            return Math.round((weightedSum / totalWeight) * 100) / 100;
        }
    }

    // 4. Final fallback - neutral score
    return 7.5;
}

/**
 * Get the score label for a product (e.g., "Muito Bom", "Excelente")
 * 
 * @param product - The product to get the label for
 * @returns The score label or a generated one based on score value
 */
export function getScoreLabel(product: Product | ScoredProduct): string {
    const productWithHeader = product as ProductWithHeader;
    if (productWithHeader.header?.scoreLabel) {
        return productWithHeader.header.scoreLabel;
    }

    // Generate label based on score
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
 * 
 * @param score - The score value (0-10)
 * @returns Tailwind CSS classes for text color
 */
export function getScoreColorClass(score: number): string {
    if (score >= 8) return 'text-emerald-600';
    if (score >= 6) return 'text-amber-600';
    return 'text-red-600';
}

/**
 * Get the background color class for a score badge
 * 
 * @param score - The score value (0-10)
 * @returns Tailwind CSS classes for background color
 */
export function getScoreBgClass(score: number): string {
    if (score >= 8) return 'bg-emerald-100';
    if (score >= 6) return 'bg-amber-100';
    return 'bg-red-100';
}

export default getBaseScore;
