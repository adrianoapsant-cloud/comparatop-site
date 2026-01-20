'use client';

import { useState } from 'react';
import { X, ArrowRight, BarChart3, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { L10N } from '@/lib/l10n';
import { useComparison } from '@/contexts/ComparisonContext';
import { useHaptic } from '@/hooks/useHaptic';

interface ComparisonTrayProps {
    /** URL for compare page */
    compareUrl?: string;
    /** Custom class name */
    className?: string;
}

/**
 * Mini-Tray comparison panel with Bottom Sheet expansion.
 * Collapsed: 60px height, shows count + compact button
 * Expanded: Full details with product avatars
 */
export function ComparisonTray({
    compareUrl = '/comparar',
    className
}: ComparisonTrayProps) {
    const { selectedProducts, removeProduct, clearAll, count } = useComparison();
    const [isExpanded, setIsExpanded] = useState(false);
    const haptic = useHaptic();

    const handleRemove = (productId: string) => {
        haptic.trigger('tap');
        removeProduct(productId);
    };

    const handleCompare = () => {
        haptic.trigger('impact');
        const ids = selectedProducts.map(p => p.id).join(',');
        window.location.href = `${compareUrl}?ids=${ids}`;
    };

    const toggleExpanded = () => {
        haptic.trigger('tap');
        setIsExpanded(!isExpanded);
    };

    if (count === 0) {
        return null;
    }

    return (
        <>
            {/* Backdrop when expanded */}
            {isExpanded && (
                <div
                    className="fixed inset-0 bg-black/30 z-30 md:hidden animate-in fade-in-0 duration-200"
                    onClick={() => setIsExpanded(false)}
                />
            )}

            <div
                className={cn(
                    // Position above mobile bottom nav
                    'fixed left-0 right-0 z-40',
                    'bottom-[68px] md:bottom-4',
                    'px-3',
                    'animate-slide-in-up',
                    className
                )}
            >
                <div className={cn(
                    'max-w-lg mx-auto',
                    // Glassmorphism effect
                    'bg-white/95 backdrop-blur-md',
                    'rounded-2xl',
                    'shadow-[0_-4px_30px_-4px_rgba(0,0,0,0.2)]',
                    'border border-white/50',
                    'overflow-hidden',
                    'transition-all duration-300 ease-out'
                )}>
                    {/* ============================================ */}
                    {/* COLLAPSED STATE - Mini Tray (60px) */}
                    {/* ============================================ */}
                    <div
                        className={cn(
                            'flex items-center justify-between',
                            'px-4 h-[60px]',
                            'cursor-pointer',
                            isExpanded && 'border-b border-gray-100'
                        )}
                        onClick={toggleExpanded}
                    >
                        {/* Left: Icon + Count */}
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-brand-core/10 flex items-center justify-center">
                                <BarChart3 size={18} className="text-brand-core" />
                            </div>
                            <div>
                                <span className="font-body text-sm font-semibold text-text-primary">
                                    {count} {count === 1 ? 'item' : 'itens'}
                                </span>
                                <span className="text-xs text-text-muted block">
                                    {count < 2 ? 'Adicione mais 1' : 'Pronto para comparar'}
                                </span>
                            </div>
                        </div>

                        {/* Right: CTA + Expand */}
                        <div className="flex items-center gap-2">
                            {/* Compare Button - Always visible */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCompare();
                                }}
                                disabled={count < 2}
                                className={cn(
                                    'px-4 py-2 rounded-xl',
                                    'font-body font-semibold text-sm',
                                    'flex items-center gap-1.5',
                                    'transition-all duration-150',
                                    count >= 2
                                        ? 'bg-brand-core text-white hover:bg-brand-core/90 active:scale-[0.98]'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                )}
                            >
                                Comparar
                                <ArrowRight size={14} />
                            </button>

                            {/* Expand/Collapse Toggle */}
                            <button
                                onClick={toggleExpanded}
                                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                            >
                                {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* ============================================ */}
                    {/* EXPANDED STATE - Bottom Sheet */}
                    {/* ============================================ */}
                    {isExpanded && (
                        <div className="px-4 pb-4 pt-2 animate-in slide-in-from-bottom-2 duration-200">
                            {/* Header with Clear All */}
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                                    Produtos Selecionados
                                </span>
                                <button
                                    onClick={clearAll}
                                    className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
                                >
                                    Limpar tudo
                                </button>
                            </div>

                            {/* Product Avatars */}
                            <div className="flex items-center gap-3 overflow-x-auto pb-2">
                                {selectedProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="relative flex-shrink-0 group"
                                    >
                                        {/* Avatar */}
                                        <div className={cn(
                                            'w-16 h-16 rounded-xl overflow-hidden',
                                            'bg-gradient-to-br from-gray-50 to-gray-100',
                                            'border-2 border-white shadow-md'
                                        )}>
                                            {product.imageUrl ? (
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.shortName || product.name}
                                                    className="w-full h-full object-contain p-1"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="text-data text-xs text-gray-400">
                                                        {(product.shortName || product.name).substring(0, 2)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => handleRemove(product.id)}
                                            className={cn(
                                                'absolute -top-1.5 -right-1.5',
                                                'w-6 h-6 rounded-full',
                                                'bg-gray-800 text-white',
                                                'flex items-center justify-center',
                                                'shadow-md',
                                                'hover:bg-red-500',
                                                'transition-colors'
                                            )}
                                            aria-label={`Remover ${product.shortName || product.name}`}
                                        >
                                            <X size={14} />
                                        </button>

                                        {/* Name Label */}
                                        <p className="text-[10px] text-text-secondary text-center mt-1.5 line-clamp-1 max-w-[64px]">
                                            {product.shortName || product.name.substring(0, 12)}
                                        </p>
                                    </div>
                                ))}

                                {/* Empty Slots */}
                                {Array.from({ length: Math.max(0, 2 - count) }).map((_, i) => (
                                    <div
                                        key={`empty-${i}`}
                                        className={cn(
                                            'w-16 h-16 rounded-xl flex-shrink-0',
                                            'border-2 border-dashed border-gray-200',
                                            'flex items-center justify-center',
                                            'bg-gray-50'
                                        )}
                                    >
                                        <span className="text-lg text-gray-300">+</span>
                                    </div>
                                ))}
                            </div>

                            {/* Hint */}
                            {count < 2 && (
                                <p className="text-xs text-center text-text-muted mt-2 bg-amber-50 py-2 px-3 rounded-lg">
                                    ☝️ Selecione pelo menos 2 produtos para comparar
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
