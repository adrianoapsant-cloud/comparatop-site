'use client';

import Link from 'next/link';
import { Trophy, Award, Star, Crown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PriceBadge } from '@/components/ui/PriceRevealButton';
import type { ScoredProduct } from '@/types/category';
import { useComparison } from '@/contexts/ComparisonContext';

// ============================================
// WINNER CARD COMPONENT
// ============================================

interface WinnerCardProps {
    product: ScoredProduct;
    rank: 'gold' | 'silver' | 'bronze';
    title: string;
    subtitle: string;
    reason: string;
}

function WinnerCard({ product, rank, title, subtitle, reason }: WinnerCardProps) {
    const { addProduct, removeProduct, isSelected } = useComparison();
    const selected = isSelected(product.id);

    const rankConfig = {
        gold: {
            badge: '🥇',
            borderColor: 'border-amber-400',
            bgGradient: 'from-amber-50 to-orange-50',
            iconBg: 'bg-gradient-to-br from-amber-400 to-yellow-500',
            textColor: 'text-amber-700',
        },
        silver: {
            badge: '🥈',
            borderColor: 'border-gray-300',
            bgGradient: 'from-gray-50 to-slate-100',
            iconBg: 'bg-gradient-to-br from-gray-400 to-slate-500',
            textColor: 'text-gray-600',
        },
        bronze: {
            badge: '🥉',
            borderColor: 'border-orange-300',
            bgGradient: 'from-orange-50 to-amber-50',
            iconBg: 'bg-gradient-to-br from-orange-400 to-amber-600',
            textColor: 'text-orange-700',
        },
    };

    const config = rankConfig[rank];

    const handleCompareToggle = () => {
        if (selected) {
            removeProduct(product.id);
        } else {
            addProduct({
                id: product.id,
                name: product.name,
                shortName: product.shortName,
                imageUrl: product.imageUrl,
                price: product.price,
                categoryId: product.categoryId,
            });
        }
    };

    return (
        <div className={cn(
            'relative rounded-2xl border-2 overflow-hidden',
            'bg-gradient-to-br',
            config.borderColor,
            config.bgGradient,
            'transition-all duration-200',
            'hover:shadow-lg hover:scale-[1.02]'
        )}>
            {/* Rank Badge */}
            <div className="absolute top-3 left-3 z-10">
                <span className="text-2xl">{config.badge}</span>
            </div>

            {/* Category Badge */}
            <div className="absolute top-3 right-3 z-10">
                <span className={cn(
                    'px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
                    config.iconBg,
                    'text-white shadow-md'
                )}>
                    {title}
                </span>
            </div>

            {/* Product Image */}
            <div className="pt-12 px-4 pb-4">
                <Link href={`/produto/${product.id}`}>
                    <div className="relative h-36 md:h-44 flex items-center justify-center">
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="max-h-full max-w-full object-contain hover:scale-105 transition-transform"
                            />
                        ) : (
                            <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-gray-400 text-sm">{product.shortName?.substring(0, 3)}</span>
                            </div>
                        )}
                    </div>
                </Link>
            </div>

            {/* Content */}
            <div className="px-4 pb-4">
                {/* Brand */}
                <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
                    {product.brand}
                </span>

                {/* Name */}
                <Link href={`/produto/${product.id}`}>
                    <h3 className="font-display font-semibold text-sm md:text-base text-text-primary line-clamp-2 hover:text-brand-core transition-colors">
                        {product.shortName || product.name}
                    </h3>
                </Link>

                {/* Subtitle */}
                <p className={cn('text-xs font-medium mt-1', config.textColor)}>
                    {subtitle}
                </p>

                <div className="flex items-center gap-2 mt-3">
                    <div className={cn(
                        'px-2 py-1 rounded-lg text-xs font-bold',
                        (product.computed?.overall ?? 0) >= 8 ? 'bg-emerald-100 text-emerald-700' :
                            'bg-amber-100 text-amber-700'
                    )}>
                        {(product.computed?.overall ?? 0).toFixed(2)}
                    </div>
                    <span className="text-[10px] text-text-muted">Nota IE</span>
                </div>

                {/* Why it won */}
                <div className="mt-3 p-2 bg-white/50 rounded-lg">
                    <p className="text-xs text-text-secondary">
                        <span className={cn('font-semibold', config.textColor)}>Por que ganhou:</span>{' '}
                        {reason}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-3">
                    {/* Primary CTA: Affiliate/Price Check (Orange) */}
                    <PriceBadge
                        productName={product.shortName || product.name}
                        className="w-full py-2 text-xs font-semibold justify-center"
                        label="Verificar Preço Atualizado"
                    />

                    {/* Secondary Row: Analysis + Compare */}
                    <div className="flex gap-2">
                        <Link
                            href={`/produto/${product.id}`}
                            className={cn(
                                'flex-1 py-2 rounded-lg text-center text-xs font-semibold',
                                'bg-slate-800 text-white',
                                'hover:bg-slate-700 transition-colors'
                            )}
                        >
                            Ver Análise
                        </Link>
                        <button
                            onClick={handleCompareToggle}
                            className={cn(
                                'px-3 py-2 rounded-lg text-xs font-semibold border-2',
                                selected
                                    ? 'bg-emerald-100 border-emerald-500 text-emerald-700'
                                    : 'bg-white border-gray-200 text-text-secondary hover:border-brand-core'
                            )}
                        >
                            {selected ? '✓' : '+'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// EDITORIAL WINNERS SECTION
// ============================================

interface EditorialWinnersProps {
    /** Products sorted by quality score */
    products: ScoredProduct[];
    /** Category name for display */
    categoryName: string;
    /** Custom class */
    className?: string;
}

export function EditorialWinners({ products, categoryName, className }: EditorialWinnersProps) {
    if (products.length === 0) return null;

    // Calculate winners
    const sortedByQuality = [...products].sort((a, b) =>
        (b.computed?.overall ?? 0) - (a.computed?.overall ?? 0)
    );

    const sortedByValue = [...products].sort((a, b) =>
        (b.computed?.vs ?? 0) - (a.computed?.vs ?? 0)
    );

    // Premium: High quality + above average price
    const avgPrice = products.reduce((acc, p) => acc + p.price, 0) / products.length;
    const premiumCandidates = products.filter(p => p.price >= avgPrice);
    const sortedPremium = [...premiumCandidates].sort((a, b) =>
        (b.computed?.overall ?? 0) - (a.computed?.overall ?? 0)
    );

    // Select winners (avoiding duplicates)
    const bestOverall = sortedByQuality[0];
    const bestValue = sortedByValue.find(p => p.id !== bestOverall?.id) || sortedByValue[0];
    const bestPremium = sortedPremium.find(p =>
        p.id !== bestOverall?.id && p.id !== bestValue?.id
    ) || sortedPremium[0];

    // Generate reasons based on product data
    const getOverallReason = (p: ScoredProduct) => {
        const topScores = Object.entries(p.scores || {})
            .filter(([key]) => key.startsWith('c'))
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .slice(0, 2);
        return `Nota ${(p.computed?.overall ?? 0).toFixed(1)} em qualidade, líder em ${topScores.length} critérios técnicos.`;
    };

    const getValueReason = (p: ScoredProduct) => {
        return `Melhor relação qualidade/preço: nota ${(p.computed?.vs ?? 0).toFixed(1)} em valor.`;
    };

    const getPremiumReason = (p: ScoredProduct) => {
        return `Qualidade máxima sem compromissos. Para quem quer o melhor.`;
    };

    return (
        <section className={cn('mb-10', className)}>
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                    <Trophy size={20} className="text-white" />
                </div>
                <div>
                    <h2 className="font-display text-xl font-bold text-text-primary">
                        🏆 Campeões de {categoryName}
                    </h2>
                    <p className="text-sm text-text-muted">
                        Os 3 melhores escolhidos pela nossa equipe editorial
                    </p>
                </div>
            </div>

            {/* Winners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {/* Best Overall */}
                {bestOverall && (
                    <WinnerCard
                        product={bestOverall}
                        rank="gold"
                        title="Melhor Geral"
                        subtitle="A escolha da redação"
                        reason={getOverallReason(bestOverall)}
                    />
                )}

                {/* Best Value */}
                {bestValue && (
                    <WinnerCard
                        product={bestValue}
                        rank="silver"
                        title="Custo-Benefício"
                        subtitle="A escolha racional"
                        reason={getValueReason(bestValue)}
                    />
                )}

                {/* Best Premium */}
                {bestPremium && (
                    <WinnerCard
                        product={bestPremium}
                        rank="bronze"
                        title="Premium"
                        subtitle="Sem limites de orçamento"
                        reason={getPremiumReason(bestPremium)}
                    />
                )}
            </div>
        </section>
    );
}
