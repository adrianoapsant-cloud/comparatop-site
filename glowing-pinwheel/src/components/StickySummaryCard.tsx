'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import type { Product } from '@/types/category';

interface StickySummaryCardProps {
    product: Product;
    rating?: number;
    className?: string;
}

export function StickySummaryCard({ product, rating = 4.5, className }: StickySummaryCardProps) {
    const scrollState = useScrollDirection({ showThreshold: 800 });
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        // Show only when scrolled past the hero section (approx 800px)
        if (scrollState.scrollY > 800 && !isDismissed) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [scrollState.scrollY, isDismissed]);

    if (!isVisible || isDismissed) return null;

    return (
        <aside
            className={cn(
                'hidden lg:block fixed right-4 top-24 z-30',
                'w-[280px]',
                'transition-all duration-500 ease-out',
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[20px] opacity-0',
                className
            )}
        >
            <div className="relative bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 p-4 overflow-hidden">
                {/* Close Button - Top Right */}
                <button
                    onClick={() => setIsDismissed(true)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors group"
                    aria-label="Fechar"
                >
                    <X size={14} className="text-gray-500 group-hover:text-gray-700" />
                </button>

                <div className="flex items-start gap-3 mb-3 pr-6">
                    {/* Tiny Thumbnail */}
                    <div className="w-14 h-14 rounded-lg bg-gray-50 flex-shrink-0 p-1 border border-gray-100">
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-contain mix-blend-multiply"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-text-primary line-clamp-2 leading-tight">
                            {product.shortName || product.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                            <span className="text-yellow-400 text-xs">★</span>
                            <span className="text-xs font-bold text-text-primary">{rating.toFixed(2)}</span>
                            <span className="text-[10px] text-text-muted">/ 10</span>
                        </div>
                    </div>
                </div>

                {/* CTA Button - Full width, no price */}
                <a
                    href="#"
                    className={cn(
                        'flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg',
                        'bg-[#FF9900] hover:bg-[#E8890A]',
                        'text-white text-xs font-bold shadow-md shadow-orange-100',
                        'transition-all hover:-translate-y-0.5'
                    )}
                >
                    <ShoppingCart size={14} />
                    Ver Melhor Oferta
                </a>
            </div>
        </aside>
    );
}

