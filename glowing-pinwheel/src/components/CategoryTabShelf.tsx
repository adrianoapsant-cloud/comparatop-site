'use client';

// ============================================================================
// CATEGORY TAB SHELF - Home Page Section with Category Tabs
// ============================================================================
// Solves the "Fadiga Cognitiva" problem by organizing products by category
// Uses tabs to filter instead of mixing TVs, Fridges, and ACs together
// ============================================================================

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Tv, Refrigerator, Wind, Smartphone, Laptop, ShoppingCart, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ScoredProduct } from '@/types/category';
import { getBaseScore } from '@/lib/getBaseScore';
import { useComparison } from '@/contexts/ComparisonContext';

// ============================================
// TYPES
// ============================================

interface CategoryTab {
    id: string;
    label: string;
    icon: React.ReactNode;
    categorySlug: string;
}

interface CategoryTabShelfProps {
    /** Título da seção */
    title: string;
    /** Subtítulo */
    subtitle: string;
    /** Ícone emoji */
    icon: string;
    /** Todos os produtos scored */
    allProducts: ScoredProduct[];
    /** Limite de produtos por tab */
    limit?: number;
    /** Classe CSS adicional */
    className?: string;
}

// ============================================
// AVAILABLE CATEGORY TABS
// ============================================

const CATEGORY_TABS: CategoryTab[] = [
    { id: 'tv', label: 'Smart TVs', icon: <Tv size={16} />, categorySlug: 'smart-tvs' },
    { id: 'fridge', label: 'Geladeiras', icon: <Refrigerator size={16} />, categorySlug: 'geladeiras' },
    { id: 'air_conditioner', label: 'Ar Condicionado', icon: <Wind size={16} />, categorySlug: 'ar-condicionados' },
    { id: 'smartphone', label: 'Smartphones', icon: <Smartphone size={16} />, categorySlug: 'smartphones' },
    { id: 'notebook', label: 'Notebooks', icon: <Laptop size={16} />, categorySlug: 'notebooks' },
];

// ============================================
// MINI PRODUCT CARD (No Prices)
// ============================================

interface MiniProductCardProps {
    product: ScoredProduct;
    rank: number;
}

function MiniProductCard({ product, rank }: MiniProductCardProps) {
    const score = getBaseScore(product);
    const { addProduct, removeProduct, isSelected } = useComparison();
    const selected = isSelected(product.id);

    const handleCompareToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (selected) {
            removeProduct(product.id);
        } else {
            addProduct(product);
        }
    };

    return (
        <Link
            href={`/produto/${product.id}`}
            className={cn(
                'group relative flex-shrink-0',
                'w-[160px] md:w-[180px]',
                'bg-white rounded-xl overflow-hidden',
                'border border-gray-100 hover:border-brand-core/30',
                'shadow-sm hover:shadow-md',
                'transition-all duration-200',
                'hover:-translate-y-0.5'
            )}
        >
            {/* Rank Badge */}
            <div className="absolute top-2 left-2 z-10 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold shadow">
                {rank}
            </div>

            {/* Image */}
            <div className="aspect-square p-3 bg-gradient-to-br from-gray-50 to-gray-100">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl opacity-50">📦</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-3">
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                    {product.brand}
                </p>
                <h3 className="font-semibold text-xs text-gray-900 line-clamp-2 mb-2 group-hover:text-brand-core transition-colors">
                    {product.shortName || product.name}
                </h3>

                {/* Score Badge */}
                <div className="flex items-center gap-1 mb-2">
                    <span className={cn(
                        'text-sm font-bold',
                        score >= 8 ? 'text-emerald-600' :
                            score >= 7 ? 'text-blue-600' :
                                'text-gray-600'
                    )}>
                        {score.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-gray-400">/10</span>
                </div>

                {/* CTA Buttons Stack */}
                <div className="space-y-1.5 mt-auto">
                    {/* PRIMARY CTA: Ver Oferta (Affiliate Link) - LARANJA VIBRANTE */}
                    {product.offers && product.offers.length > 0 && product.offers[0].url ? (
                        <a
                            href={product.offers[0].url}
                            target="_blank"
                            rel="nofollow noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className={cn(
                                'w-full flex items-center justify-center gap-1 py-2 rounded-lg',
                                'bg-gradient-to-r from-orange-500 to-amber-500',
                                'hover:brightness-110 hover:scale-[1.02]',
                                'text-white text-xs font-bold',
                                'transition-all duration-200 shadow-md hover:shadow-lg',
                                'active:scale-[0.98]'
                            )}
                        >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            Ver Oferta
                            <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                        </a>
                    ) : (
                        <span
                            className={cn(
                                'w-full flex items-center justify-center gap-1 py-2 rounded-lg',
                                'bg-gradient-to-r from-orange-500 to-amber-500',
                                'text-white text-xs font-bold',
                                'shadow-md'
                            )}
                        >
                            Ir à Loja
                            <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                        </span>
                    )}

                    {/* SECONDARY: Ler Review (ghost/underline style) */}
                    <span className="flex items-center justify-center text-[10px] font-medium text-brand-core group-hover:underline">
                        Ler Review →
                    </span>
                </div>

                {/* Compare Button */}
                <div className="mt-1.5 pt-1.5 border-t border-gray-100">
                    <button
                        onClick={handleCompareToggle}
                        className={cn(
                            'w-full flex items-center justify-center gap-1 py-1 rounded-lg',
                            'text-[10px] font-medium',
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
        </Link>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function CategoryTabShelf({
    title,
    subtitle,
    icon,
    allProducts,
    limit = 6,
    className,
}: CategoryTabShelfProps) {
    // State for active tab
    const [activeTab, setActiveTab] = useState<string>('tv');

    // Filter products to only include those with available categories
    const availableTabs = useMemo(() => {
        const productCategories = new Set(allProducts.map(p => p.categoryId));
        return CATEGORY_TABS.filter(tab => productCategories.has(tab.id));
    }, [allProducts]);

    // Get products for active tab (sorted by value score)
    const filteredProducts = useMemo(() => {
        return allProducts
            .filter(p => p.categoryId === activeTab)
            .sort((a, b) => (b.scores?.value ?? 0) - (a.scores?.value ?? 0))
            .slice(0, limit);
    }, [allProducts, activeTab, limit]);

    // Get current tab's slug for "View All" link
    const currentTabSlug = availableTabs.find(t => t.id === activeTab)?.categorySlug || '';

    // If no tabs available, don't render
    if (availableTabs.length === 0) return null;

    // Auto-select first available tab if current is not available
    if (!availableTabs.some(t => t.id === activeTab) && availableTabs.length > 0) {
        setActiveTab(availableTabs[0].id);
    }

    return (
        <section className={cn('', className)}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="font-display text-xl font-bold text-text-primary flex items-center gap-2">
                        <span>{icon}</span>
                        {title}
                    </h2>
                    <p className="text-sm text-text-muted mt-0.5">
                        {subtitle}
                    </p>
                </div>

                {/* View All Link */}
                <Link
                    href={`/categorias/${currentTabSlug}?sort=value`}
                    className={cn(
                        'hidden sm:flex items-center gap-1',
                        'text-sm font-medium text-brand-core',
                        'hover:text-brand-core/80 transition-colors'
                    )}
                >
                    Ver mais ofertas
                    <ArrowRight size={14} />
                </Link>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
                {availableTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap',
                            'transition-all duration-200',
                            activeTab === tab.id
                                ? 'bg-brand-core text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        )}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Products Scroll */}
            <div className="relative -mx-4 px-4 md:-mx-8 md:px-8">
                <div className={cn(
                    'flex gap-3 overflow-x-auto pb-4',
                    'scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent',
                    'snap-x snap-mandatory'
                )}>
                    {filteredProducts.map((product, index) => (
                        <div key={product.id} className="snap-start">
                            <MiniProductCard
                                product={product}
                                rank={index + 1}
                            />
                        </div>
                    ))}

                    {/* Empty State */}
                    {filteredProducts.length === 0 && (
                        <div className="w-full text-center py-8 text-gray-500">
                            Nenhum produto encontrado nesta categoria.
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile View All */}
            <div className="sm:hidden mt-2">
                <Link
                    href={`/categorias/${currentTabSlug}?sort=value`}
                    className={cn(
                        'flex items-center justify-center gap-1 w-full',
                        'py-3 rounded-xl',
                        'bg-gray-50 text-gray-600',
                        'text-sm font-medium',
                        'hover:bg-gray-100 transition-colors'
                    )}
                >
                    Ver mais ofertas
                    <ArrowRight size={14} />
                </Link>
            </div>
        </section>
    );
}

export default CategoryTabShelf;
