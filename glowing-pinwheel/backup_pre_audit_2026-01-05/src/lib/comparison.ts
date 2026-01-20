/**
 * Comparison Verdict Engine
 * 
 * @description Generates instant verdicts for product comparisons to reduce
 * "Choice Overload" by providing clear, actionable recommendations.
 */

import type { ScoredProduct } from '@/types/category';

// ============================================
// TYPES
// ============================================

export interface VerdictBadge {
    id: string;
    label: string;
    icon: string;
    color: 'gold' | 'green' | 'blue' | 'purple';
    description?: string;
}

export interface ProductVerdict {
    productId: string;
    badges: VerdictBadge[];
    isWinner: boolean;
    rank: number;
    winReason?: string;
}

export interface ComparisonVerdict {
    winnerId: string;
    winnerName: string;
    verdicts: Record<string, ProductVerdict>;
    summary: string;
    keyDifference: string;
}

/**
 * Multi-product comparison result
 * Supports 2-4 products with rankings
 */
export interface MultiProductVerdict {
    products: ScoredProduct[];
    rankings: ProductVerdict[];
    winnerId: string;
    winnerName: string;
    summary: string;
}

// ============================================
// BADGE DEFINITIONS
// ============================================

const BADGE_CATALOG: Record<string, Omit<VerdictBadge, 'id'>> = {
    'best-gaming': {
        label: 'Melhor para Games',
        icon: '🎮',
        color: 'purple',
        description: 'Performance excepcional para jogos',
    },
    'rational-choice': {
        label: 'Escolha Racional',
        icon: '💰',
        color: 'green',
        description: 'Melhor custo-benefício',
    },
    'premium-experience': {
        label: 'Experiência Premium',
        icon: '✨',
        color: 'gold',
        description: 'Qualidade superior em todos os aspectos',
    },
    'best-image': {
        label: 'Melhor Imagem',
        icon: '🖼️',
        color: 'blue',
        description: 'Qualidade de imagem superior',
    },
    'future-proof': {
        label: 'À Prova de Futuro',
        icon: '🚀',
        color: 'purple',
        description: 'Recursos e conexões mais avançados',
    },
    'best-audio': {
        label: 'Melhor Áudio',
        icon: '🔊',
        color: 'blue',
        description: 'Som integrado superior',
    },
};

// ============================================
// VERDICT ENGINE
// ============================================

/**
 * Get attribute value from product
 */
function getAttr(product: ScoredProduct, key: string): unknown {
    return product.attributes?.[key];
}

/**
 * Get score value from product
 */
function getScore(product: ScoredProduct, scoreId: string): number {
    return product.scores[scoreId] ?? 0;
}

/**
 * Generate verdict for two products
 */
export function getComparisonVerdict(
    productA: ScoredProduct,
    productB: ScoredProduct
): ComparisonVerdict {
    // Determine overall winner first for rank assignment
    const overallA = productA.computed.overall;
    const overallB = productB.computed.overall;
    const aIsWinner = overallA >= overallB;

    const verdictA: ProductVerdict = {
        productId: productA.id,
        badges: [],
        isWinner: aIsWinner,
        rank: aIsWinner ? 1 : 2,
        winReason: aIsWinner ? 'Pontuação editorial superior' : undefined,
    };

    const verdictB: ProductVerdict = {
        productId: productB.id,
        badges: [],
        isWinner: !aIsWinner,
        rank: aIsWinner ? 2 : 1,
        winReason: !aIsWinner ? 'Pontuação editorial superior' : undefined,
    };

    const winner = aIsWinner ? productA : productB;
    const loser = aIsWinner ? productB : productA;

    // ============================================
    // BADGE LOGIC
    // ============================================

    // Gaming Badge
    const gameA = getScore(productA, 'gaming') ?? getScore(productA, 'inputLag');
    const gameB = getScore(productB, 'gaming') ?? getScore(productB, 'inputLag');

    if (gameA > 9 && gameA > gameB) {
        verdictA.badges.push({ id: 'best-gaming', ...BADGE_CATALOG['best-gaming'] });
    } else if (gameB > 9 && gameB > gameA) {
        verdictB.badges.push({ id: 'best-gaming', ...BADGE_CATALOG['best-gaming'] });
    }

    // Rational Choice Badge (value + cheaper)
    const vsA = productA.computed.vs;
    const vsB = productB.computed.vs;

    if (productA.price < productB.price && vsA > 8) {
        verdictA.badges.push({ id: 'rational-choice', ...BADGE_CATALOG['rational-choice'] });
    } else if (productB.price < productA.price && vsB > 8) {
        verdictB.badges.push({ id: 'rational-choice', ...BADGE_CATALOG['rational-choice'] });
    }

    // Premium Experience Badge
    const qsA = productA.computed.qs;
    const qsB = productB.computed.qs;

    if (qsA > 9 && qsA > qsB + 0.3) {
        verdictA.badges.push({ id: 'premium-experience', ...BADGE_CATALOG['premium-experience'] });
    } else if (qsB > 9 && qsB > qsA + 0.3) {
        verdictB.badges.push({ id: 'premium-experience', ...BADGE_CATALOG['premium-experience'] });
    }

    // Best Image Badge
    const imageA = getScore(productA, 'imageQuality') ?? getScore(productA, 'contrast');
    const imageB = getScore(productB, 'imageQuality') ?? getScore(productB, 'contrast');

    if (imageA > 8.5 && imageA > imageB + 0.5) {
        verdictA.badges.push({ id: 'best-image', ...BADGE_CATALOG['best-image'] });
    } else if (imageB > 8.5 && imageB > imageA + 0.5) {
        verdictB.badges.push({ id: 'best-image', ...BADGE_CATALOG['best-image'] });
    }

    // Future-proof Badge (based on connectivity/features)
    const connectA = getScore(productA, 'connectivity');
    const connectB = getScore(productB, 'connectivity');
    const hdmi21A = getAttr(productA, 'hdmi21') === true;
    const hdmi21B = getAttr(productB, 'hdmi21') === true;

    if (hdmi21A && !hdmi21B && connectA > 8) {
        verdictA.badges.push({ id: 'future-proof', ...BADGE_CATALOG['future-proof'] });
    } else if (hdmi21B && !hdmi21A && connectB > 8) {
        verdictB.badges.push({ id: 'future-proof', ...BADGE_CATALOG['future-proof'] });
    }

    // ============================================
    // SUMMARY GENERATION
    // ============================================

    const winnerName = winner.shortName || winner.name;
    const loserName = loser.shortName || loser.name;

    // Determine key differences
    const priceDiff = Math.abs(productA.price - productB.price);
    const priceDiffPercent = (priceDiff / Math.max(productA.price, productB.price)) * 100;

    let summary = '';
    let keyDifference = '';

    // Price-focused summary
    if (priceDiffPercent > 15) {
        const cheaper = productA.price < productB.price ? productA : productB;
        const moreExpensive = cheaper === productA ? productB : productA;

        if (winner === cheaper) {
            summary = `${winnerName} oferece performance superior por um preço mais acessível. A diferença de R$ ${priceDiff.toLocaleString('pt-BR')} não se justifica pelas funcionalidades extras do ${loserName}.`;
            keyDifference = `${winnerName} é ${priceDiffPercent.toFixed(0)}% mais barato e ainda assim superior`;
        } else {
            summary = `${winnerName} justifica o investimento adicional com qualidade significativamente superior. Ideal para quem busca a melhor experiência possível.`;
            keyDifference = `${winnerName} vale os R$ ${priceDiff.toLocaleString('pt-BR')} extras`;
        }
    }
    // Quality-focused summary
    else if (Math.abs(qsA - qsB) > 0.5) {
        summary = `${winnerName} se destaca pela qualidade técnica superior, especialmente em ${qsA > qsB ? 'processamento de imagem' : 'recursos premium'}. ${loserName} é uma alternativa sólida para orçamentos mais restritos.`;
        keyDifference = 'Diferença significativa na qualidade técnica';
    }
    // Close match summary
    else {
        const winnerBadges = (winner === productA ? verdictA : verdictB).badges;
        const badgeHighlight = winnerBadges.length > 0
            ? `se destaca como ${winnerBadges[0].label}`
            : 'tem melhor pontuação geral';

        summary = `Modelos muito próximos em qualidade. ${winnerName} ${badgeHighlight}. Escolha baseado no preço atual e disponibilidade.`;
        keyDifference = 'Modelos equivalentes, diferença mínima';
    }

    return {
        winnerId: winner.id,
        winnerName,
        verdicts: {
            [productA.id]: verdictA,
            [productB.id]: verdictB,
        },
        summary,
        keyDifference,
    };
}

// ============================================
// ATTRIBUTE COMPARISON
// ============================================

export interface AttributeDifference {
    id: string;
    label: string;
    valueA: string | number | boolean;
    valueB: string | number | boolean;
    winnerId: string | null;
    differencePercent: number;
    isSignificant: boolean;
}

/**
 * Compare attributes between two products
 */
export function getAttributeDifferences(
    productA: ScoredProduct,
    productB: ScoredProduct,
    attributeKeys: { id: string; label: string; higherIsBetter?: boolean }[]
): AttributeDifference[] {
    const differences: AttributeDifference[] = [];

    for (const attr of attributeKeys) {
        const valueA = getAttr(productA, attr.id) ?? getScore(productA, attr.id);
        const valueB = getAttr(productB, attr.id) ?? getScore(productB, attr.id);

        // Skip if both undefined
        if (valueA === undefined && valueB === undefined) continue;

        let winnerId: string | null = null;
        let differencePercent = 0;

        // Numeric comparison
        if (typeof valueA === 'number' && typeof valueB === 'number') {
            const max = Math.max(valueA, valueB);
            differencePercent = max > 0 ? Math.abs(valueA - valueB) / max * 100 : 0;

            const higherIsBetter = attr.higherIsBetter !== false;
            if (valueA !== valueB) {
                winnerId = higherIsBetter
                    ? (valueA > valueB ? productA.id : productB.id)
                    : (valueA < valueB ? productA.id : productB.id);
            }
        }
        // Boolean comparison
        else if (typeof valueA === 'boolean' || typeof valueB === 'boolean') {
            if (valueA === true && valueB !== true) winnerId = productA.id;
            else if (valueB === true && valueA !== true) winnerId = productB.id;
            differencePercent = valueA !== valueB ? 100 : 0;
        }
        // String comparison
        else if (valueA !== valueB) {
            differencePercent = 100;
        }

        differences.push({
            id: attr.id,
            label: attr.label,
            valueA: valueA as string | number | boolean,
            valueB: valueB as string | number | boolean,
            winnerId,
            differencePercent,
            isSignificant: differencePercent >= 5,
        });
    }

    return differences;
}

/**
 * Filter to only significant differences
 */
export function getSignificantDifferences(diffs: AttributeDifference[]): AttributeDifference[] {
    return diffs.filter(d => d.isSignificant);
}
