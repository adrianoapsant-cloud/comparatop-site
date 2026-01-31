/**
 * @file simulator-recommendations.ts
 * @description Generates product recommendations for Simulators section
 * 
 * Criteria:
 * 1. Same category
 * 2. Top by score (baseScore or computed.overall)
 * 3. Similar price range (±30%)
 * 4. Exclude current product
 * 
 * If no alternatives: returns explicit fallback message
 */

import { ALL_PRODUCTS } from '@/data/products';
import type { Product } from '@/types/category';

// Wrapper for consistency
function getAllProducts(): Product[] {
    return ALL_PRODUCTS;
}

// ============================================
// TYPES
// ============================================

export interface ProductRecommendation {
    id: string;
    name: string;
    brand: string;
    price: number;
    score: number;
    reason: string;
}

export interface SimulatorRecommendations {
    hasAlternatives: boolean;
    recommendations: ProductRecommendation[];
    fallbackMessage?: string;
}

// ============================================
// RECOMMENDATION GENERATOR
// ============================================

/**
 * Generate recommendations for a product
 * @param productId Current product ID to exclude
 * @param categoryId Category to filter by
 * @param price Current product price for range filtering
 * @param maxRecommendations Maximum number of recommendations (default: 3)
 */
export function generateRecommendations(
    productId: string,
    categoryId: string,
    price: number,
    maxRecommendations: number = 3
): SimulatorRecommendations {
    // Get all products
    const allProducts = getAllProducts();

    // Normalize category for comparison
    const normalizedCategory = categoryId.toLowerCase().replace(/-/g, '_');

    // Filter to same category, exclude current product
    const candidates = allProducts.filter(p => {
        const pCategory = (p.categoryId || '').toLowerCase().replace(/-/g, '_');
        return pCategory === normalizedCategory && p.id !== productId;
    });

    // No alternatives available
    if (candidates.length === 0) {
        return {
            hasAlternatives: false,
            recommendations: [],
            fallbackMessage: 'Primeiro produto da categoria — alternativas serão ativadas quando houver mais itens no catálogo.',
        };
    }

    // Score and rank candidates
    const scored = candidates.map(p => {
        const score = (p as any).computed?.overall || (p as any).baseScore || 7.0;
        const priceDiff = Math.abs(p.price - price) / price;
        const priceInRange = priceDiff <= 0.3;

        // Determine reason
        let reason = '';
        if (score > 8.5) {
            reason = 'Melhor avaliado da categoria';
        } else if (p.price < price * 0.8) {
            reason = 'Alternativa mais econômica';
        } else if (p.price > price * 1.2) {
            reason = 'Opção premium';
        } else {
            reason = 'Alternativa similar';
        }

        return {
            product: p,
            score,
            priceInRange,
            reason,
        };
    });

    // Sort by score descending, prefer products in price range
    scored.sort((a, b) => {
        // Prioritize products in price range
        if (a.priceInRange && !b.priceInRange) return -1;
        if (!a.priceInRange && b.priceInRange) return 1;
        // Then by score
        return b.score - a.score;
    });

    // Take top N
    const recommendations: ProductRecommendation[] = scored
        .slice(0, maxRecommendations)
        .map(s => ({
            id: s.product.id,
            name: s.product.shortName || s.product.name,
            brand: s.product.brand,
            price: s.product.price,
            score: s.score,
            reason: s.reason,
        }));

    return {
        hasAlternatives: recommendations.length > 0,
        recommendations,
    };
}

/**
 * Get recommendations as displayable cards for simulators
 */
export function getSimulatorRecommendationCards(
    productId: string,
    categoryId: string,
    price: number
): { title: string; items: { label: string; value: string; link?: string }[] } | null {
    const result = generateRecommendations(productId, categoryId, price);

    if (!result.hasAlternatives) {
        return {
            title: '🔍 Alternativas',
            items: [
                { label: 'Status', value: result.fallbackMessage || 'Sem alternativas disponíveis' },
            ],
        };
    }

    return {
        title: '🔍 Alternativas na Categoria',
        items: result.recommendations.map((r, i) => ({
            label: `Alternativa ${i + 1}`,
            value: `${r.brand} ${r.name} (${r.score.toFixed(1)}/10) - ${r.reason}`,
            link: `/produto/${r.id}`,
        })),
    };
}
