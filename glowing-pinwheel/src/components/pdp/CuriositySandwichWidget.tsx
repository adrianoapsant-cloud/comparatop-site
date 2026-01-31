'use client';

/**
 * CuriositySandwichWidget
 * 
 * AI-generated insights based on product characteristics. Extracted from legacy PDP.
 * Uses product attributes, scores, and category data to generate contextual insights.
 */

import type { Product } from '@/types/category';
import { getCategoryPriceStats } from '@/lib/category-prices';
import { getBaseScore } from '@/lib/getBaseScore';

export interface CuriositySandwichWidgetProps {
    product: Product;
    geminiData?: { icon: string; text: string };
}

export function CuriositySandwichWidget({ product, geminiData }: CuriositySandwichWidgetProps) {
    const overallScore = getBaseScore(product);
    const categoryStats = getCategoryPriceStats(product.categoryId);
    const categoryMedian = categoryStats.median || product.price * 1.2;

    // If Gemini provided the insight, use it directly
    if (geminiData?.text) {
        const displayIcon = geminiData.icon === '🤖' ? '📊' : (geminiData.icon || '📊');
        const displayText = geminiData.text
            .replace(/unified_score/gi, 'nota geral')
            .replace(/Com um nota geral/gi, 'Com uma nota geral');
        return (
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                <div className="flex gap-2">
                    <span className="text-lg flex-shrink-0">{displayIcon}</span>
                    <p className="text-xs text-blue-800 leading-relaxed">
                        {displayText}
                    </p>
                </div>
            </div>
        );
    }

    // Fallback: Generate locally
    const attrs = (product.attributes || {}) as Record<string, unknown>;
    const specs = (product.specs || {}) as Record<string, unknown>;
    const scores = product.scores || {};
    const categoryId = product.categoryId;
    const price = product.price;

    const scoreEntries = Object.entries(scores)
        .filter(([key]) => key.startsWith('c'))
        .filter(([, val]) => typeof val === 'number') as [string, number][];

    const bestScore = scoreEntries.reduce((best, curr) => curr[1] > best[1] ? curr : best, ['', 0]);
    const worstScore = scoreEntries.reduce((worst, curr) => curr[1] < worst[1] ? curr : worst, ['', 10]);

    // Generate insight based on product characteristics
    const generateInsight = (): { icon: string; text: string } | null => {
        // LOW PRICE + HIGH SCORE (Best Value)
        if (price < categoryMedian * 0.8 && overallScore >= 7.5) {
            return {
                icon: '🎯',
                text: `Aqui está uma descoberta interessante: esta ${product.brand} entrega nota ${overallScore.toFixed(2)} por apenas R$${price.toLocaleString('pt-BR')}, bem abaixo da média da categoria. É a combinação ideal de qualidade e economia.`
            };
        }

        // PREMIUM PRICE JUSTIFICATION
        if (price > categoryMedian * 1.3 && overallScore < 8.5) {
            return {
                icon: '💡',
                text: `Esta ${product.brand} está no segmento premium, o que reflete na nota de custo-benefício. A qualidade e os recursos são de alto nível. Para quem busca performance sem compromisso, é uma escolha certeira.`
            };
        }

        // SPECIFIC WEAKNESS BUT OVERALL GOOD
        if (overallScore >= 8 && worstScore[1] < 7) {
            // Category-specific weakness labels
            const weaknessLabels: Record<string, Record<string, string>> = {
                'robot-vacuum': { c1: 'sucção', c2: 'navegação', c3: 'bateria', c4: 'mapeamento', c5: 'ruído', c6: 'manutenção', c7: 'app', c8: 'design', c9: 'custo-benefício', c10: 'durabilidade' },
                'tv': { c1: 'qualidade de imagem', c2: 'som', c3: 'smart features', c4: 'gaming', c5: 'design', c6: 'brilho', c7: 'pós-venda', c8: 'conectividade' },
                'fridge': { c1: 'capacidade', c2: 'eficiência', c3: 'organização', c4: 'temperatura', c5: 'design', c6: 'ruído', c7: 'durabilidade', c8: 'recursos smart' },
                'air-conditioner': { c1: 'refrigeração', c2: 'eficiência', c3: 'ruído', c4: 'controle', c5: 'instalação', c6: 'filtros', c7: 'durabilidade' },
                'smartphone': { c1: 'desempenho', c2: 'câmera', c3: 'bateria', c4: 'tela', c5: 'armazenamento', c6: 'conectividade', c7: 'resistência', c8: 'software' },
            };
            const categoryLabels = weaknessLabels[categoryId] || {};
            const weakLabel = categoryLabels[worstScore[0]] || 'um critério específico';

            return {
                icon: '📊',
                text: `Esta ${product.brand} com nota ${overallScore.toFixed(2)} é excelente na maioria dos aspectos. O ${weakLabel} (${worstScore[1].toFixed(1)}) ficou um pouco abaixo da média, mas não compromete a experiência geral. Para a maioria dos usuários, os pontos fortes superam esse detalhe.`
            };
        }

        // DEFAULT: Good balanced product
        if (overallScore >= 7.5) {
            return {
                icon: '✨',
                text: `Esta ${product.brand} com nota ${overallScore.toFixed(2)} oferece um bom equilíbrio entre recursos, qualidade e preço. É uma escolha segura para quem busca confiabilidade.`
            };
        }

        return null;
    };

    const insight = generateInsight();
    if (!insight) return null;

    return (
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
            <div className="flex gap-2">
                <span className="text-lg flex-shrink-0">{insight.icon}</span>
                <p className="text-xs text-blue-800 leading-relaxed">
                    {insight.text}
                </p>
            </div>
        </div>
    );
}

export default CuriositySandwichWidget;
