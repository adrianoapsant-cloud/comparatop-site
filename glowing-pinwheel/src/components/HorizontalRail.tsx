'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CompareToggle } from '@/components/CompareToggle';
import type { ScoredProduct } from '@/types/category';

// ============================================
// PRODUCT RAIL - For displaying product carousels
// ============================================

interface ProductRailProps {
    /** Section title with emoji support */
    title: string;
    /** Subtitle or description */
    subtitle?: string;
    /** Array of scored products */
    products: ScoredProduct[];
    /** Show rank badges */
    showRank?: boolean;
    /** Custom class for the container */
    className?: string;
    /** Link to view all */
    viewAllLink?: string;
    /** View all text */
    viewAllText?: string;
}

export function ProductRail({
    title,
    subtitle,
    products,
    showRank = true,
    className,
    viewAllLink,
    viewAllText = 'Ver todos',
}: ProductRailProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return;

        const container = scrollContainerRef.current;
        const scrollAmount = container.clientWidth * 0.8;

        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    if (products.length === 0) return null;

    return (
        <section className={cn('w-full', className)}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="font-display text-lg md:text-xl font-semibold text-text-primary">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-sm text-text-muted mt-0.5">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {viewAllLink && (
                        <Link
                            href={viewAllLink}
                            className="text-sm font-medium text-brand-core hover:underline hidden sm:block"
                        >
                            {viewAllText}
                        </Link>
                    )}

                    {/* Navigation Arrows */}
                    <div className="hidden md:flex items-center gap-1">
                        <button
                            onClick={() => scroll('left')}
                            className={cn(
                                'w-8 h-8 rounded-full',
                                'flex items-center justify-center',
                                'bg-white border border-gray-200',
                                'text-text-secondary hover:text-text-primary',
                                'hover:border-gray-300 hover:shadow-sm',
                                'transition-all'
                            )}
                            aria-label="Scroll left"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className={cn(
                                'w-8 h-8 rounded-full',
                                'flex items-center justify-center',
                                'bg-white border border-gray-200',
                                'text-text-secondary hover:text-text-primary',
                                'hover:border-gray-300 hover:shadow-sm',
                                'transition-all'
                            )}
                            aria-label="Scroll right"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Scrollable Container */}
            <div
                ref={scrollContainerRef}
                className={cn(
                    'flex gap-4 overflow-x-auto',
                    'scroll-smooth snap-x snap-mandatory',
                    'pb-2',
                    '[&::-webkit-scrollbar]:hidden',
                    '[-ms-overflow-style:none]',
                    '[scrollbar-width:none]'
                )}
            >
                {products.map((product, index) => (
                    <div
                        key={product.id}
                        className="flex-shrink-0 snap-start w-[260px] md:w-[280px]"
                    >
                        <Link
                            href={`/produto/${product.id}`}
                            className={cn(
                                'block h-full',
                                'bg-white rounded-xl',
                                'border border-gray-100',
                                'shadow-sm hover:shadow-md',
                                'transition-all duration-200',
                                'hover:border-brand-core/20',
                                'overflow-hidden'
                            )}
                        >
                            {/* Image Section */}
                            <div className="relative h-36 bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                                {/* Compare Toggle */}
                                <div onClick={(e) => e.preventDefault()}>
                                    <CompareToggle
                                        product={{
                                            id: product.id,
                                            name: product.name,
                                            shortName: product.shortName,
                                            price: product.price,
                                            imageUrl: product.imageUrl,
                                            categoryId: product.categoryId,
                                        }}
                                        className="top-2 right-2 left-auto"
                                    />
                                </div>

                                {/* Rank Badge */}
                                {showRank && (
                                    <div className={cn(
                                        'absolute top-2 left-2',
                                        'w-7 h-7 rounded-full',
                                        'flex items-center justify-center',
                                        'text-xs font-bold',
                                        index === 0 ? 'bg-amber-400 text-amber-900' :
                                            index === 1 ? 'bg-gray-300 text-gray-700' :
                                                index === 2 ? 'bg-amber-600 text-white' :
                                                    'bg-gray-200 text-gray-600'
                                    )}>
                                        {index + 1}º
                                    </div>
                                )}

                                {/* Product Image */}
                                {product.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-2xl text-gray-300">📦</span>
                                    </div>
                                )}
                            </div>

                            {/* Content Section */}
                            <div className="p-3">
                                {/* Brand */}
                                <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
                                    {product.brand}
                                </span>

                                {/* Name */}
                                <h3 className="font-body font-semibold text-sm text-text-primary line-clamp-2 mt-0.5 leading-tight">
                                    {product.shortName || product.name}
                                </h3>

                                {/* Score + Price Row */}
                                <div className="flex items-center justify-between mt-2">
                                    {/* Score Badge */}
                                    <div className="flex items-center gap-1">
                                        <div className={cn(
                                            'px-1.5 py-0.5 rounded text-xs font-bold',
                                            (product.scores?.quality ?? 0) >= 8 ? 'bg-emerald-100 text-emerald-700' :
                                                (product.scores?.quality ?? 0) >= 6 ? 'bg-amber-100 text-amber-700' :
                                                    'bg-red-100 text-red-700'
                                        )}>
                                            {(product.scores?.quality ?? 0).toFixed(1)}
                                        </div>
                                        <span className="text-[10px] text-text-muted">IE</span>
                                    </div>

                                    {/* CTA Text instead of price */}
                                    <span className="text-xs font-semibold text-amber-600 hover:text-amber-700">
                                        Ver Oferta →
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
}

// ============================================
// GUIDE RAIL - For displaying guide carousels
// ============================================

interface Guide {
    id: string;
    title: string;
    description: string;
    category?: string;
    href: string;
    imageUrl?: string;
}

interface GuideRailProps {
    /** Section title */
    title: string;
    /** Subtitle */
    subtitle?: string;
    /** Array of guides */
    guides: Guide[];
    /** Custom class */
    className?: string;
    /** View all link */
    viewAllLink?: string;
    /** View all text */
    viewAllText?: string;
}

export function GuideRail({
    title,
    subtitle,
    guides,
    className,
    viewAllLink,
    viewAllText = 'Ver todos',
}: GuideRailProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return;

        const container = scrollContainerRef.current;
        const scrollAmount = container.clientWidth * 0.8;

        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    if (guides.length === 0) return null;

    return (
        <section className={cn('w-full', className)}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="font-display text-lg md:text-xl font-semibold text-text-primary">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-sm text-text-muted mt-0.5">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {viewAllLink && (
                        <Link
                            href={viewAllLink}
                            className="text-sm font-medium text-brand-core hover:underline hidden sm:block"
                        >
                            {viewAllText}
                        </Link>
                    )}

                    <div className="hidden md:flex items-center gap-1">
                        <button
                            onClick={() => scroll('left')}
                            className={cn(
                                'w-8 h-8 rounded-full',
                                'flex items-center justify-center',
                                'bg-white border border-gray-200',
                                'text-text-secondary hover:text-text-primary',
                                'hover:border-gray-300 hover:shadow-sm',
                                'transition-all'
                            )}
                            aria-label="Scroll left"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className={cn(
                                'w-8 h-8 rounded-full',
                                'flex items-center justify-center',
                                'bg-white border border-gray-200',
                                'text-text-secondary hover:text-text-primary',
                                'hover:border-gray-300 hover:shadow-sm',
                                'transition-all'
                            )}
                            aria-label="Scroll right"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Scrollable Container */}
            <div
                ref={scrollContainerRef}
                className={cn(
                    'flex gap-4 overflow-x-auto',
                    'scroll-smooth snap-x snap-mandatory',
                    'pb-2',
                    '[&::-webkit-scrollbar]:hidden',
                    '[-ms-overflow-style:none]',
                    '[scrollbar-width:none]'
                )}
            >
                {guides.map((guide) => (
                    <div
                        key={guide.id}
                        className="flex-shrink-0 snap-start w-[280px] md:w-[320px]"
                    >
                        <Link
                            href={guide.href}
                            className={cn(
                                'block h-full',
                                'bg-gradient-to-br from-brand-core to-violet-600',
                                'rounded-xl overflow-hidden',
                                'shadow-sm hover:shadow-lg',
                                'transition-all duration-200',
                                'hover:scale-[1.02]',
                                'text-white'
                            )}
                        >
                            <div className="p-4 h-full flex flex-col min-h-[140px]">
                                {/* Category Tag */}
                                {guide.category && (
                                    <span className="inline-block px-2 py-0.5 bg-white/20 rounded text-[10px] font-medium mb-2 w-fit">
                                        {guide.category}
                                    </span>
                                )}

                                {/* Title */}
                                <h3 className="font-display font-semibold text-base leading-tight mb-1">
                                    {guide.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-white/80 line-clamp-2 flex-1">
                                    {guide.description}
                                </p>

                                {/* Read More */}
                                <span className="text-xs font-medium mt-3 flex items-center gap-1">
                                    Ler guia
                                    <ChevronRight size={14} />
                                </span>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
}
