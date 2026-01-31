'use client';

/**
 * CostBenefitWidget - Price advantage visualization
 * Shows "X% mais barato que a média" with visual bar comparison
 * Extracted from legacy ProductDetailPage for SimplifiedPDP
 */

import { TrendingDown, Star } from 'lucide-react';
import { formatPrice } from '@/lib/l10n';
import { getCategoryPriceStats } from '@/lib/category-prices';
import type { Product } from '@/types/category';

interface CostBenefitWidgetProps {
    product: Product;
}

export function CostBenefitWidget({ product }: CostBenefitWidgetProps) {
    // Get dynamic category price stats
    const categoryStats = getCategoryPriceStats(product.categoryId);
    const categoryMedian = categoryStats.median || product.price * 1.2;

    const isBelow = product.price < categoryMedian;
    const priceDiff = Math.abs(((categoryMedian - product.price) / categoryMedian * 100));

    // Category-specific advantage labels
    const categoryLabels: Record<string, Record<string, string>> = {
        tv: {
            c2: 'Processamento de imagem superior',
            c5: 'Perfeito para gaming',
            c6: 'Ótimo brilho/anti-reflexo',
        },
        'robot-vacuum': {
            c1: 'Navegação inteligente',
            c4: 'Escovas anti-emaranhamento',
            c7: 'Boa autonomia de bateria',
        },
    };

    const labels = categoryLabels[product.categoryId] || categoryLabels.tv;

    // Find best score to highlight
    const scores = product.scores || {};
    const scoreEntries = Object.entries(scores)
        .filter(([key]) => key.startsWith('c') && key !== 'c1')
        .filter(([, val]) => typeof val === 'number');

    const bestScore = scoreEntries.length > 0
        ? scoreEntries.reduce((best, curr) => (curr[1] as number) > (best[1] as number) ? curr : best)
        : null;

    // Determine advantage message
    let advantageMessage: string;

    if (isBelow && priceDiff >= 10) {
        advantageMessage = `${priceDiff.toFixed(0)}% mais barato que a média da categoria`;
    } else if (bestScore && (bestScore[1] as number) >= 8.5) {
        advantageMessage = `${labels[bestScore[0]] || 'Destaque'}: nota ${(bestScore[1] as number).toFixed(1)}`;
    } else {
        advantageMessage = `Produto ${product.brand} com qualidade comprovada`;
    }

    return (
        <div className="mb-3 p-3 rounded-lg bg-emerald-50">
            <div className="flex items-center gap-1.5 mb-2 text-emerald-700">
                {isBelow && priceDiff >= 10 ? <TrendingDown size={14} /> : <Star size={14} />}
                <span className="text-xs font-semibold">
                    ✓ {advantageMessage}
                </span>
            </div>

            {/* Visual comparison bar - only show for significant price advantage */}
            {isBelow && priceDiff >= 10 && (
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="w-20 text-[10px] text-gray-600">Este produto</span>
                        <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full flex items-center justify-end pr-1.5 bg-emerald-500"
                                style={{ width: `${Math.min((product.price / categoryMedian) * 100, 100)}%` }}
                            >
                                <span className="text-[9px] font-bold text-white">
                                    {formatPrice(product.price)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-20 text-[10px] text-gray-400">Média categoria</span>
                        <div className="flex-1 h-2 bg-gray-300 rounded-full" />
                        <span className="text-[10px] text-gray-400">{formatPrice(categoryMedian)}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CostBenefitWidget;
