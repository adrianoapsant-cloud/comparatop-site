'use client';

// ============================================================================
// SMART SHELF COMPONENT
// ============================================================================
// Prateleira inteligente que adapta conteúdo baseado na estratégia
// Mantém estrutura visual consistente, personaliza apenas conteúdo
// ============================================================================

import React, { useMemo, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Bell, Zap, ShoppingCart, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ScoredProduct } from '@/types/category';
import type { ShelfConfig } from '@/lib/home-personalization';
import { getProductsForShelf } from '@/lib/home-personalization';
import { getUnifiedScore } from '@/lib/scoring/getUnifiedScore';
import { useComparison } from '@/contexts/ComparisonContext';
import { useRegion } from '@/contexts/RegionContext';
import { calculateTco, getDefaultEnergyConsumption, formatTco } from '@/lib/tco';
import { SmartAlertModal } from '@/components/SmartAlertModal';
// ============================================
// TYPES
// ============================================

export interface SmartShelfProps {
    /** Configuração da shelf (de getHomePersonalization) */
    config: ShelfConfig;
    /** Todos os produtos scored disponíveis */
    allProducts: ScoredProduct[];
    /** Número máximo de produtos */
    limit?: number;
    /** Mostrar badge de personalização */
    showPersonalizationBadge?: boolean;
    /** Classe CSS adicional */
    className?: string;
}

// ============================================
// PRODUCT CARD COMPONENT
// ============================================

interface ProductCardProps {
    product: ScoredProduct;
    rank?: number;
    showRank?: boolean;
    accentColor?: string;
}

function ProductCard({ product, rank, showRank, accentColor }: ProductCardProps) {
    // ScoredProduct extends Product, so all Product props are at top level
    const p = product;
    const { addProduct, removeProduct, isSelected } = useComparison();
    const { energyRate } = useRegion();
    const selected = isSelected(p.id);
    const [showAlertModal, setShowAlertModal] = useState(false);

    // Calculate TCO for this product
    const tco = useMemo(() => {
        const price = p.price ?? p.offers?.[0]?.price ?? 0;
        if (!price) return null;

        // Get energy consumption (from product data or default by category)
        const energyKwhMonth = (p as any).energyKwhMonth ?? getDefaultEnergyConsumption(p.categoryId || 'default');

        return calculateTco({
            price,
            energyKwhMonth,
            energyRate,
            lifespanYears: 5
        });
    }, [p, energyRate]);

    const handleCompareToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (selected) {
            removeProduct(p.id);
        } else {
            addProduct(p);
        }
    };

    const handleAlertClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowAlertModal(true);
    };

    const accentClasses: Record<string, string> = {
        violet: 'bg-violet-500',
        amber: 'bg-amber-500',
        blue: 'bg-blue-500',
        cyan: 'bg-cyan-500',
        sky: 'bg-sky-500',
        indigo: 'bg-indigo-500',
        default: 'bg-brand-core',
    };

    const badgeColor = accentClasses[accentColor || 'default'];
    const productPrice = p.price ?? p.offers?.[0]?.price ?? 0;

    return (
        <>
            <div
                className={cn(
                    'group relative flex-shrink-0',
                    'w-[180px] md:w-[220px]',
                    'bg-white rounded-2xl overflow-hidden',
                    'border border-gray-100 hover:border-gray-200',
                    'shadow-sm hover:shadow-lg',
                    'transition-all duration-300',
                )}
            >
                {/* Rank Badge */}
                {showRank && rank && (
                    <div className={cn(
                        'absolute top-3 left-3 z-10',
                        'w-7 h-7 rounded-full',
                        badgeColor,
                        'flex items-center justify-center',
                        'text-white text-xs font-bold',
                        'shadow-md'
                    )}>
                        {rank}
                    </div>
                )}

                {/* Alert Bell Button */}
                <button
                    onClick={handleAlertClick}
                    className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-amber-50 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Criar Alerta de Preço"
                >
                    <Bell className="w-3.5 h-3.5 text-amber-600" />
                </button>

                {/* Image - Clickable */}
                <Link href={`/produto/${p.id}`} className="block">
                    <div className="aspect-square p-4 bg-gradient-to-br from-gray-50 to-gray-100 group-hover:-translate-y-0.5 transition-transform relative">
                        {p.imageUrl ? (
                            <Image
                                src={p.imageUrl}
                                alt={p.name}
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-4xl opacity-50">📦</span>
                            </div>
                        )}
                    </div>
                </Link>

                {/* Content */}
                <div className="p-4">
                    {/* Brand */}
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                        {p.brand}
                    </p>

                    {/* Name - Clickable */}
                    <Link href={`/produto/${p.id}`}>
                        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-2 hover:text-brand-core transition-colors">
                            {p.shortName || p.name}
                        </h3>
                    </Link>

                    {/* Score Badge */}
                    <div className="flex items-center gap-1 mb-3">
                        {(() => {
                            const score = getUnifiedScore(p);
                            return (
                                <span className={cn(
                                    'text-sm font-bold',
                                    score >= 8 ? 'text-emerald-600' :
                                        score >= 7 ? 'text-blue-600' :
                                            'text-gray-600'
                                )}>
                                    {score.toFixed(2)}
                                </span>
                            );
                        })()}
                        <span className="text-xs text-gray-400">/10</span>
                    </div>

                    {/* CTA Buttons Stack */}
                    <div className="space-y-2 mt-auto">
                        {/* PRIMARY CTA: Ver Oferta (Affiliate Link) - LARANJA VIBRANTE */}
                        {p.offers && p.offers.length > 0 && p.offers[0].url ? (
                            <a
                                href={p.offers[0].url}
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                                className={cn(
                                    'w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg',
                                    'bg-gradient-to-r from-orange-500 to-amber-500',
                                    'hover:brightness-110 hover:scale-[1.02]',
                                    'text-white text-sm font-bold',
                                    'transition-all duration-200 shadow-md hover:shadow-lg',
                                    'active:scale-[0.98]'
                                )}
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Ver Oferta
                                <ExternalLink className="w-3 h-3 opacity-80" />
                            </a>
                        ) : (
                            <Link
                                href={`/produto/${p.id}`}
                                className={cn(
                                    'w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg',
                                    'bg-gradient-to-r from-orange-500 to-amber-500',
                                    'hover:brightness-110 hover:scale-[1.02]',
                                    'text-white text-sm font-bold',
                                    'transition-all duration-200 shadow-md hover:shadow-lg',
                                    'active:scale-[0.98]'
                                )}
                            >
                                Ir à Loja
                                <ExternalLink className="w-3 h-3 opacity-80" />
                            </Link>
                        )}

                        {/* SECONDARY: Ler Review (ghost/underline style) */}
                        <Link
                            href={`/produto/${p.id}`}
                            className="w-full flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-gray-400 hover:text-gray-600 hover:underline transition-colors"
                        >
                            Ler Review Completo →
                        </Link>

                        {/* TERTIARY: Compare Toggle */}
                        <button
                            onClick={handleCompareToggle}
                            className={cn(
                                'w-full flex items-center justify-center gap-1 py-1.5 rounded-lg',
                                'text-xs font-medium',
                                'transition-colors',
                                selected
                                    ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-700'
                                    : 'border border-gray-200 text-gray-600 hover:border-brand-core hover:text-brand-core hover:bg-brand-core/5'
                            )}
                        >
                            {selected ? '✓ Adicionado' : '+ Comparar'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Smart Alert Modal */}
            <SmartAlertModal
                isOpen={showAlertModal}
                onClose={() => setShowAlertModal(false)}
                product={{
                    id: p.id,
                    name: p.shortName || p.name,
                    price: productPrice,
                    tco: tco ?? undefined
                }}
            />
        </>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function SmartShelf({
    config,
    allProducts,
    limit = 8,
    showPersonalizationBadge = false,
    className,
}: SmartShelfProps) {

    // Get filtered and sorted products based on config
    const products = useMemo(() =>
        getProductsForShelf(allProducts, config, limit),
        [allProducts, config, limit]
    );

    // If no products for this config, don't render
    if (products.length === 0) {
        return null;
    }

    return (
        <section className={cn('', className)}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="font-display text-xl font-bold text-text-primary flex items-center gap-2">
                            <span>{config.icon}</span>
                            {config.title}
                        </h2>

                        {/* Personalization badge */}
                        {showPersonalizationBadge && (
                            <span className={cn(
                                'inline-flex items-center gap-1',
                                'px-2 py-0.5 rounded-full',
                                'bg-violet-100 text-violet-600',
                                'text-xs font-medium'
                            )}>
                                <Sparkles size={10} />
                                Para você
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-text-muted mt-0.5">
                        {config.subtitle}
                    </p>
                </div>

                {/* View All Link */}
                <Link
                    href={config.viewAllLink}
                    className={cn(
                        'hidden sm:flex items-center gap-1',
                        'text-sm font-medium text-brand-core',
                        'hover:text-brand-core/80 transition-colors'
                    )}
                >
                    {config.viewAllText}
                    <ArrowRight size={14} />
                </Link>
            </div>

            {/* Products Scroll */}
            <div className="relative -mx-4 px-4 md:-mx-8 md:px-8">
                <div className={cn(
                    'flex gap-4 overflow-x-auto pb-4',
                    'scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent',
                    'snap-x snap-mandatory'
                )}>
                    {products.map((product, index) => (
                        <div key={product.id} className="snap-start">
                            <ProductCard
                                product={product}
                                rank={config.showRank ? index + 1 : undefined}
                                showRank={config.showRank}
                                accentColor={config.accentColor}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile View All */}
            <div className="sm:hidden mt-2">
                <Link
                    href={config.viewAllLink}
                    className={cn(
                        'flex items-center justify-center gap-1 w-full',
                        'py-3 rounded-xl',
                        'bg-gray-50 text-gray-600',
                        'text-sm font-medium',
                        'hover:bg-gray-100 transition-colors'
                    )}
                >
                    {config.viewAllText}
                    <ArrowRight size={14} />
                </Link>
            </div>
        </section>
    );
}

// ============================================
// WELCOME MESSAGE COMPONENT
// ============================================

interface WelcomeMessageProps {
    message: string;
    className?: string;
}

export function WelcomeMessage({ message, className }: WelcomeMessageProps) {
    return (
        <div className={cn(
            'flex items-center gap-2 px-4 py-2',
            'bg-violet-50 border border-violet-100 rounded-xl',
            'text-sm text-violet-700 font-medium',
            className
        )}>
            <Sparkles size={14} className="text-violet-500" />
            {message}
        </div>
    );
}

// ============================================
// CATEGORY TRACKING HOOK
// ============================================

/**
 * Hook para rastrear visita a uma categoria
 * Chame isso nas páginas de categoria para alimentar o histórico
 */
export function useCategoryTracking(categoryId: string | undefined) {
    useEffect(() => {
        if (!categoryId || typeof window === 'undefined') return;

        // Import dynamically to avoid server-side import issues
        import('@/lib/home-personalization').then(({ updateCategoryHistory }) => {
            updateCategoryHistory(categoryId);
        });
    }, [categoryId]);
}

// ============================================
// EXPORTS
// ============================================

export default SmartShelf;
