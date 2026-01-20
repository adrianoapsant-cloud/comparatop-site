'use client';

// ============================================================================
// GLOBAL COMPARISON BAR - Compact Floating Dock Style
// ============================================================================
// Small, unobtrusive floating dock that shows selected products
// Matches the compact style shown on product detail pages
// Does NOT render on product pages (SmartStickyFooter handles those)
// ============================================================================

import { useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { BarChart3, X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useComparison } from '@/contexts/ComparisonContext';

export function GlobalComparisonBar() {
    const { selectedProducts, removeProduct, count } = useComparison();
    const pathname = usePathname();

    const handleCompare = useCallback(() => {
        const ids = selectedProducts.map(p => p.id).join(',');
        window.location.href = `/comparar?ids=${ids}`;
    }, [selectedProducts]);

    const handleDismissAll = useCallback(() => {
        selectedProducts.forEach(p => removeProduct(p.id));
    }, [selectedProducts, removeProduct]);

    // Don't render on product pages - SmartStickyFooter handles those
    const isProductPage = pathname?.startsWith('/produto/');
    if (isProductPage) return null;

    // Only show when there are products selected
    if (count === 0) return null;

    return (
        <div className="fixed bottom-4 left-0 right-0 z-[100] flex justify-center px-4 pb-[env(safe-area-inset-bottom)]">
            {/* Floating Dock Container - Compact */}
            <div className={cn(
                'relative',
                'flex items-center gap-2 sm:gap-3',
                'bg-white/98 backdrop-blur-md',
                'border border-gray-200/80',
                'rounded-2xl',
                'shadow-[0_8px_32px_-8px_rgba(0,0,0,0.2)]',
                'px-3 py-2',
                'max-w-lg animate-in slide-in-from-bottom-4 duration-300'
            )}>
                {/* X Close Button - Top Right Corner */}
                <button
                    onClick={handleDismissAll}
                    className={cn(
                        'absolute -top-2 -right-2',
                        'w-6 h-6 rounded-full',
                        'bg-gray-800 hover:bg-red-500',
                        'flex items-center justify-center',
                        'text-white',
                        'shadow-md',
                        'transition-colors'
                    )}
                    aria-label="Limpar seleção"
                >
                    <X size={12} />
                </button>

                {/* Product Thumbnails */}
                <div className="flex -space-x-2">
                    {selectedProducts.slice(0, 3).map((product) => (
                        <div
                            key={product.id}
                            className={cn(
                                'w-10 h-10 rounded-lg overflow-hidden',
                                'bg-white border-2 border-white shadow-md',
                                'relative group'
                            )}
                        >
                            {product.imageUrl ? (
                                <img
                                    src={product.imageUrl}
                                    alt={product.shortName || product.name}
                                    className="w-full h-full object-contain p-0.5"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <span className="text-[8px] font-bold text-gray-400">
                                        {(product.shortName || product.name).substring(0, 2)}
                                    </span>
                                </div>
                            )}
                            {/* Remove individual product on hover */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeProduct(product.id);
                                }}
                                className={cn(
                                    'absolute inset-0 bg-black/60 flex items-center justify-center',
                                    'opacity-0 group-hover:opacity-100 transition-opacity'
                                )}
                            >
                                <X size={12} className="text-white" />
                            </button>
                        </div>
                    ))}
                    {count > 3 && (
                        <div className={cn(
                            'w-10 h-10 rounded-lg',
                            'bg-gray-100 border-2 border-white shadow-md',
                            'flex items-center justify-center'
                        )}>
                            <span className="text-xs font-bold text-gray-500">
                                +{count - 3}
                            </span>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="w-px h-8 bg-gray-200" />

                {/* Count Badge */}
                <div className="flex items-center gap-1.5">
                    <BarChart3 size={14} className="text-brand-core" />
                    <span className="text-xs font-medium text-gray-600">
                        {count}
                    </span>
                </div>

                {/* Compare Button */}
                <button
                    onClick={handleCompare}
                    disabled={count < 2}
                    className={cn(
                        'px-4 py-2 rounded-xl',
                        'font-semibold text-xs',
                        'flex items-center gap-1.5',
                        'transition-all duration-150',
                        count >= 2
                            ? 'bg-violet-600 hover:bg-violet-700 text-white active:scale-[0.97] shadow-sm'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    )}
                >
                    Comparar
                    <ArrowRight size={12} />
                </button>
            </div>
        </div>
    );
}

export default GlobalComparisonBar;
