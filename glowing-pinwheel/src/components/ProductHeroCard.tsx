'use client';

import { ArrowRight, Award, Star } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useHaptic } from '@/hooks/useHaptic';
import { CompareToggle } from '@/components/CompareToggle';
import { BuyBox } from '@/components/BuyBox';
import { L10N, getBadgeLabel, formatPrice } from '@/lib/l10n';
import type { ScoredProduct, CategoryDefinition, RatingCriteria } from '@/types/category';
import { getUnifiedScore } from '@/lib/scoring/getUnifiedScore';

// ============================================
// SCORE BAR COMPONENT
// ============================================

interface ScoreBarProps {
    label: string;
    score: number;
    maxScore?: number;
    variant: 'qs' | 'vs' | 'gs';
}

function ScoreBar({ label, score, maxScore = 10, variant }: ScoreBarProps) {
    const percentage = (score / maxScore) * 100;

    const variantStyles = {
        qs: 'bg-gradient-to-r from-violet-500 to-purple-400',
        vs: 'bg-gradient-to-r from-emerald-500 to-green-400',
        gs: 'bg-gradient-to-r from-amber-500 to-yellow-400',
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-secondary font-body">
                    {label}
                </span>
                <span className="text-data text-lg font-bold text-text-primary">
                    {score.toFixed(1)}
                </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={cn('h-full rounded-full transition-all duration-500', variantStyles[variant])}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

// ============================================
// CRITERION ITEM COMPONENT
// ============================================

interface CriterionItemProps {
    criterion: RatingCriteria;
    score: number;
}

function CriterionItem({ criterion, score }: CriterionItemProps) {
    const percentage = (score / 10) * 100;

    const groupColors = {
        QS: 'bg-violet-500',
        VS: 'bg-emerald-500',
        GS: 'bg-amber-500',
    };

    return (
        <div className="flex items-center gap-3 py-2">
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-text-secondary truncate pr-2">
                        {criterion.label}
                    </span>
                    <span className="text-data text-sm font-semibold text-text-primary">
                        {score.toFixed(1)}
                    </span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={cn('h-full rounded-full', groupColors[criterion.group])}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================

interface ProductHeroCardProps {
    /** Product with computed scores */
    product: ScoredProduct;
    /** Category definition for criteria labels */
    category: CategoryDefinition;
    /** Show detailed criteria breakdown */
    showBreakdown?: boolean;
    /** Custom ID for IntersectionObserver */
    id?: string;
    /** CTA button text */
    ctaText?: string;
    /** CTA button URL */
    ctaUrl?: string;
}

export function ProductHeroCard({
    product,
    category,
    showBreakdown = false,
    id = 'product-hero-card',
    ctaText = 'Ver Melhor Oferta na Amazon',
    ctaUrl = '#',
}: ProductHeroCardProps) {
    const haptic = useHaptic();

    const { computed } = product;

    // Calculate discount if original price exists
    const originalPrice = product.offers?.[0]?.originalPrice;
    const discount = originalPrice
        ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
        : null;

    const formatPrice = (value: number) => {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    };

    // getBadgeLabel imported from @/lib/l10n

    return (
        <article
            id={id}
            className="card-premium rounded-2xl p-6 md:p-8 h-full flex flex-col"
        >
            {/* Badge */}
            {product.badges && product.badges.length > 0 && (
                <div className="mb-4">
                    <span className="badge-editor">
                        <Award size={14} />
                        {getBadgeLabel(product.badges[0])}
                    </span>
                </div>
            )}

            {/* Title & Subtitle - ZONA A: Link para PDP */}
            <header className="mb-6">
                <Link href={`/produto/${product.id}`} className="group">
                    <h2 className="font-display text-2xl md:text-3xl font-semibold text-text-primary leading-tight mb-1 group-hover:text-brand-core transition-colors">
                        {product.name}
                    </h2>
                </Link>
                <p className="text-text-secondary font-body text-sm">
                    {product.brand} • {product.model}
                </p>
            </header>

            {/* Product Image - ZONA A: Link para PDP */}
            <Link href={`/produto/${product.id}`} className="block mb-6 relative aspect-[4/3] rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 group">
                {/* Compare Toggle Overlay */}
                <CompareToggle
                    product={{
                        id: product.id,
                        name: product.name,
                        shortName: product.shortName,
                        price: product.price,
                        imageUrl: product.imageUrl,
                        categoryId: product.categoryId,
                    }}
                />

                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain p-4"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-24 h-24 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
                                <Star className="w-10 h-10 text-gray-400" />
                            </div>
                            <span className="text-sm text-text-muted font-body">
                                {category.nameSingular}
                            </span>
                        </div>
                    </div>
                )}
            </Link>

            {/* Main Score - Simplified (Only Global Score) */}
            <div className="mb-6 p-4 bg-bg-ground rounded-lg">
                {/* Overall Score - Prominent */}
                <div className="flex items-center justify-between">
                    <span className="font-body font-semibold text-text-primary">
                        {L10N.scores.overall.full}
                    </span>
                    <span className="text-data text-3xl font-bold text-brand-core">
                        {getUnifiedScore(product).toFixed(2)}
                    </span>
                </div>
            </div>

            {/* Criteria Breakdown - Expandable */}
            <div className="mb-6">
                <button
                    type="button"
                    onClick={() => {
                        const el = document.getElementById(`breakdown-${id}`);
                        if (el) el.classList.toggle('hidden');
                    }}
                    className="w-full flex items-center justify-between p-3 bg-bg-ground rounded-lg hover:bg-gray-100 transition-colors text-sm"
                >
                    <span className="font-body font-medium text-text-secondary">
                        Ver Análise Detalhada (10 Critérios)
                    </span>
                    <svg className="w-5 h-5 text-text-muted transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Collapsible Breakdown */}
                <div id={`breakdown-${id}`} className="hidden mt-3 p-4 bg-bg-ground rounded-lg">
                    <h3 className="font-body font-semibold text-text-primary mb-4 text-sm">
                        Detalhamento por Critério de Dor
                    </h3>
                    <div className="space-y-3">
                        {category.criteria.map((criterion) => (
                            <CriterionItem
                                key={criterion.id}
                                criterion={criterion}
                                score={product.scores[criterion.id] ?? 0}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* BuyBox - Price + CTA using new unified component */}
            <div className="mb-4">
                <BuyBox
                    price={product.price}
                    originalPrice={originalPrice}
                    url={ctaUrl}
                    storeName="Amazon"
                    fullWidth
                />
                <p className="text-sm text-text-secondary mt-2 text-center font-body">
                    Preço por ponto: <span className="text-data font-medium">R$ {computed.pricePerPoint}</span>
                </p>
            </div>

            {/* Trust Indicator */}
            <p className="text-center text-xs text-text-muted mt-4 font-body">
                Conteúdo revisado em {product.lastUpdated || new Date().toLocaleDateString('pt-BR')}
            </p>
        </article>
    );
}
