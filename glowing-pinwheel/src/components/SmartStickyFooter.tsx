'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
    ShoppingCart, ArrowRight, X, ChevronUp, ChevronDown,
    BarChart3, Sparkles, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useComparison } from '@/contexts/ComparisonContext';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useHaptic } from '@/hooks/useHaptic';
import { generateAmazonSearchLink } from '@/lib/safe-links';
import { trackConversion } from '@/app/actions/bandit-reward';

// ============================================
// TYPES
// ============================================

type FooterState = 'HIDDEN' | 'ANCHOR' | 'UPSELL' | 'SELECTION';

interface SmartStickyFooterProps {
    /** Product page context - current product info */
    currentProduct?: {
        id: string;
        name: string;
        shortName?: string;
        price: number;
        imageUrl?: string;
        score?: number;
        amazonUrl?: string;
    };
    /** Main rival product for VS comparison */
    rivalProduct?: {
        id: string;
        name: string;
        shortName?: string;
        price: number;
        imageUrl?: string;
        score?: number;
    };
    /** Alternative products for upsell */
    alternatives?: {
        id: string;
        name: string;
        shortName?: string;
        price: number;
        imageUrl?: string;
    }[];
    /** Compare page URL */
    compareUrl?: string;
    /** Custom class name */
    className?: string;
    /** MAB Layout ID for conversion tracking */
    layoutId?: string;
}

// ============================================================================
// VS BATTLE BAR COMPONENT - Floating Dock Style
// ============================================================================
// Design Philosophy:
// 1. Clear visual clusters: [Product A] | [VS + Compare] | [Product B + CTA]
// 2. Floating dock with rounded corners for modern, premium feel
// 3. Consistent thumbnails on both products for visual balance
// 4. Soft VS badge that doesn't compete with action buttons
// 5. Perfect vertical alignment

interface VsBattleBarProps {
    currentProduct: SmartStickyFooterProps['currentProduct'];
    rivalProduct: SmartStickyFooterProps['rivalProduct'];
    onCompare: () => void;
    onViewOffer: () => void;
    onDismiss: () => void;
}

/** 
 * Product thumbnail component for consistency
 * Always shows either image or branded fallback
 */
function ProductThumbnail({
    imageUrl,
    name,
    variant
}: {
    imageUrl?: string;
    name: string;
    variant: 'current' | 'rival';
}) {
    const colors = variant === 'current'
        ? 'from-emerald-100 to-emerald-50 text-emerald-600 border-emerald-200'
        : 'from-blue-100 to-blue-50 text-blue-600 border-blue-200';

    return (
        <div className={cn(
            'w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden',
            'border shadow-sm',
            imageUrl ? 'bg-white border-gray-200' : `bg-gradient-to-br ${colors}`
        )}>
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-contain p-1"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <span className="text-[10px] font-bold">
                        {name.substring(0, 2).toUpperCase()}
                    </span>
                </div>
            )}
        </div>
    );
}

function VsBattleBar({ currentProduct, rivalProduct, onCompare, onViewOffer, onDismiss }: VsBattleBarProps) {
    if (!currentProduct || !rivalProduct) return null;

    return (
        <div className="flex items-center justify-center h-[72px] px-2">
            {/* Floating Dock Container - responsive for zoom */}
            <div className={cn(
                // Floating dock style
                'flex items-center gap-1 sm:gap-2',
                'bg-white/98 backdrop-blur-md',
                'border border-gray-200/80',
                'rounded-2xl',
                'shadow-[0_8px_32px_-8px_rgba(0,0,0,0.15)]',
                'px-2 sm:px-3 py-2',
                // Responsive max-width to prevent overflow at high zoom
                'max-w-[95vw] sm:max-w-xl lg:max-w-2xl w-auto',
                'overflow-hidden'
            )}>

                {/* ========================================== */}
                {/* CLUSTER 1: Current Product (Left) */}
                {/* ========================================== */}
                <Link
                    href={`/produto/${currentProduct.id}`}
                    className={cn(
                        'flex items-center gap-1 sm:gap-2',
                        'px-1 sm:px-2 py-1.5 rounded-xl',
                        'hover:bg-gray-50 transition-colors',
                        'group min-w-0 shrink'
                    )}
                >
                    <ProductThumbnail
                        imageUrl={currentProduct.imageUrl}
                        name={currentProduct.shortName || currentProduct.name}
                        variant="current"
                    />
                    <div className="min-w-0 hidden sm:block">
                        <p className="text-xs font-semibold text-gray-900 truncate max-w-[80px] group-hover:text-emerald-600 transition-colors">
                            {currentProduct.shortName || currentProduct.name.split(' ').slice(0, 2).join(' ')}
                        </p>
                        {currentProduct.score && (
                            <div className="flex items-center gap-1">
                                <span className="text-[10px] text-emerald-600 font-bold">
                                    {currentProduct.score.toFixed(2)}
                                </span>
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={cn(
                                                'w-1 h-1 rounded-full mx-px',
                                                i < Math.round(currentProduct.score! / 2)
                                                    ? 'bg-emerald-500'
                                                    : 'bg-gray-200'
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Link>

                {/* ========================================== */}
                {/* CLUSTER 2: VS + Compare (Center) */}
                {/* ========================================== */}
                <div className="flex items-center gap-1 sm:gap-1.5 px-1 sm:px-2 border-x border-gray-100 flex-shrink-0">
                    {/* Softer VS Badge */}
                    <div className={cn(
                        'w-7 h-7 rounded-full',
                        'bg-gray-100 border border-gray-200',
                        'flex items-center justify-center',
                        'flex-shrink-0'
                    )}>
                        <span className="text-[9px] font-bold text-gray-500 tracking-tight">
                            VS
                        </span>
                    </div>

                    {/* Compare Button - Secondary prominence */}
                    <button
                        onClick={onCompare}
                        className={cn(
                            'px-3 py-1.5 rounded-lg',
                            'bg-violet-600 hover:bg-violet-700',
                            'text-white font-semibold text-xs',
                            'transition-all duration-150',
                            'active:scale-[0.97]',
                            'flex items-center gap-1.5',
                            'shadow-sm'
                        )}
                    >
                        <BarChart3 size={14} />
                        <span>1x1</span>
                    </button>
                </div>

                {/* ========================================== */}
                {/* CLUSTER 3: Rival Product + CTA (Right) */}
                {/* ========================================== */}
                <div className="flex items-center gap-1 sm:gap-2 min-w-0 justify-end shrink">
                    {/* Rival Product */}
                    <Link
                        href={`/produto/${rivalProduct.id}`}
                        className={cn(
                            'flex items-center gap-2',
                            'px-2 py-1.5 rounded-xl',
                            'hover:bg-gray-50 transition-colors',
                            'group'
                        )}
                    >
                        <div className="min-w-0 text-right hidden sm:block">
                            <p className="text-xs font-semibold text-gray-900 truncate max-w-[80px] group-hover:text-blue-600 transition-colors">
                                {rivalProduct.shortName || rivalProduct.name.split(' ').slice(0, 2).join(' ')}
                            </p>
                            {rivalProduct.score && (
                                <div className="flex items-center justify-end gap-1">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={cn(
                                                    'w-1 h-1 rounded-full mx-px',
                                                    i < Math.round(rivalProduct.score! / 2)
                                                        ? 'bg-blue-500'
                                                        : 'bg-gray-200'
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[10px] text-blue-600 font-bold">
                                        {rivalProduct.score.toFixed(2)}
                                    </span>
                                </div>
                            )}
                        </div>
                        <ProductThumbnail
                            imageUrl={rivalProduct.imageUrl}
                            name={rivalProduct.shortName || rivalProduct.name}
                            variant="rival"
                        />
                    </Link>

                    {/* Divider */}
                    <div className="w-px h-8 bg-gray-200 hidden sm:block" />

                    {/* Primary CTA - Ver Oferta */}
                    <button
                        onClick={onViewOffer}
                        className={cn(
                            'px-3 sm:px-4 py-2 rounded-xl',
                            'bg-gradient-to-r from-[#FF9900] to-[#FFB347]',
                            'hover:from-[#E8890A] hover:to-[#FF9900]',
                            'text-white font-bold text-xs',
                            'shadow-md shadow-orange-500/20',
                            'transition-all duration-150',
                            'active:scale-[0.97]',
                            'flex items-center gap-1.5',
                            'flex-shrink-0'
                        )}
                    >
                        <ShoppingCart size={14} />
                        <span className="hidden sm:inline">Ver Oferta</span>
                        <ExternalLink size={10} className="hidden sm:block opacity-70" />
                    </button>

                    {/* Close Button (X) */}
                    <button
                        onClick={onDismiss}
                        className={cn(
                            'w-8 h-8 rounded-full ml-1',
                            'bg-gray-100 hover:bg-gray-200',
                            'flex items-center justify-center',
                            'text-gray-400 hover:text-gray-600',
                            'transition-all duration-150',
                            'flex-shrink-0'
                        )}
                        aria-label="Fechar barra de comparação"
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}

// ============================================
// UPSELL TOAST COMPONENT
// ============================================

interface UpsellToastProps {
    alternatives: SmartStickyFooterProps['alternatives'];
    onDismiss: () => void;
    isVisible: boolean;
}

function UpsellToast({ alternatives, onDismiss, isVisible }: UpsellToastProps) {
    if (!alternatives?.length || !isVisible) return null;

    return (
        <div
            className={cn(
                'absolute bottom-full left-0 right-0 mb-2 px-3',
                'transition-all duration-400',
                isVisible
                    ? 'opacity-100 translate-y-0 animate-spring-in'
                    : 'opacity-0 translate-y-4'
            )}
        >
            <div className={cn(
                'bg-white rounded-xl shadow-lg border border-gray-100 p-3',
                'max-w-lg mx-auto'
            )}>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-text-muted flex items-center gap-1">
                        <Sparkles size={12} className="text-amber-500" />
                        Alternativas Populares
                    </span>
                    <button
                        onClick={onDismiss}
                        className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600"
                    >
                        <X size={14} />
                    </button>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                    {alternatives.slice(0, 3).map((alt) => (
                        <Link
                            key={alt.id}
                            href={`/produto/${alt.id}`}
                            className={cn(
                                'flex-shrink-0 flex items-center gap-2 p-2 rounded-lg',
                                'bg-gray-50 hover:bg-gray-100 transition-colors',
                                'min-w-[140px]'
                            )}
                        >
                            {alt.imageUrl && (
                                <div className="w-10 h-10 rounded-lg bg-white overflow-hidden flex-shrink-0">
                                    <img
                                        src={alt.imageUrl}
                                        alt={alt.shortName || alt.name}
                                        className="w-full h-full object-contain p-1"
                                    />
                                </div>
                            )}
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-text-primary truncate">
                                    {alt.shortName || alt.name}
                                </p>
                                <p className="text-xs text-emerald-600 font-semibold">
                                    R$ {alt.price.toLocaleString('pt-BR')}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function SmartStickyFooter({
    currentProduct,
    rivalProduct,
    alternatives = [],
    compareUrl = '/comparar',
    className,
    layoutId,
}: SmartStickyFooterProps) {
    const { selectedProducts, removeProduct, count } = useComparison();
    const scrollState = useScrollDirection({ showThreshold: 300 });
    const haptic = useHaptic();

    const [footerState, setFooterState] = useState<FooterState>('HIDDEN');
    const [showUpsell, setShowUpsell] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [hasSeenUpsell, setHasSeenUpsell] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    // ============================================
    // STATE MACHINE LOGIC
    // ============================================

    useEffect(() => {
        // Check sessionStorage for upsell frequency capping
        const seen = sessionStorage.getItem('smartFooter_upsellSeen');
        if (seen) setHasSeenUpsell(true);
    }, []);

    useEffect(() => {
        // Determine footer state based on conditions
        const determineState = (): FooterState => {
            // Priority 1: If products are selected for comparison
            if (count > 0) {
                return 'SELECTION';
            }

            // Priority 2: If scrolled past threshold, show anchor
            if (scrollState.isPastThreshold) {
                return 'ANCHOR';
            }

            // Default: Hidden
            return 'HIDDEN';
        };

        setFooterState(determineState());
    }, [count, scrollState.isPastThreshold]);

    // Upsell trigger: scroll UP rapidly
    useEffect(() => {
        if (
            scrollState.direction === 'up' &&
            scrollState.isPastThreshold &&
            !hasSeenUpsell &&
            alternatives.length > 0 &&
            count === 0 && // Only show upsell when not comparing
            footerState === 'ANCHOR'
        ) {
            setShowUpsell(true);
            setHasSeenUpsell(true);
            sessionStorage.setItem('smartFooter_upsellSeen', 'true');

            // Auto-dismiss after 8 seconds
            const timer = setTimeout(() => setShowUpsell(false), 8000);
            return () => clearTimeout(timer);
        }
    }, [scrollState.direction, scrollState.isPastThreshold, hasSeenUpsell, alternatives.length, count, footerState]);

    // ============================================
    // HANDLERS
    // ============================================

    const handleCompare = useCallback(() => {
        haptic.trigger('impact');
        const ids = selectedProducts.map(p => p.id).join(',');
        window.location.href = `${compareUrl}?ids=${ids}`;
    }, [haptic, selectedProducts, compareUrl]);

    const handleViewOffer = useCallback(() => {
        haptic.trigger('impact');

        // Track MAB conversion (non-blocking)
        if (layoutId) {
            trackConversion(layoutId).catch((err) => {
                console.error('[MAB] Failed to track conversion:', err);
            });
        }

        if (currentProduct?.amazonUrl) {
            window.open(currentProduct.amazonUrl, '_blank', 'noopener,noreferrer');
        } else if (currentProduct?.name) {
            // Fallback: Safe Amazon search URL with Prime/New/4★ filters
            const safeUrl = generateAmazonSearchLink(currentProduct.name, 'comparatop-20');
            window.open(safeUrl, '_blank', 'noopener,noreferrer');
        }
    }, [haptic, currentProduct, layoutId]);

    const handleVsCompare = useCallback(() => {
        haptic.trigger('impact');
        if (currentProduct && rivalProduct) {
            window.location.href = `${compareUrl}?ids=${currentProduct.id},${rivalProduct.id}`;
        }
    }, [haptic, currentProduct, rivalProduct, compareUrl]);

    const handleDismissUpsell = useCallback(() => {
        setShowUpsell(false);
    }, []);

    const toggleExpanded = useCallback(() => {
        haptic.trigger('tap');
        setIsExpanded(prev => !prev);
    }, [haptic]);

    const handleDismissFooter = useCallback(() => {
        haptic.trigger('tap');
        setIsDismissed(true);
        // Store in sessionStorage so it stays dismissed during page session
        sessionStorage.setItem('smartFooter_vsDismissed', 'true');
    }, [haptic]);

    // Check if footer was previously dismissed in this session
    useEffect(() => {
        const wasDismissed = sessionStorage.getItem('smartFooter_vsDismissed');
        if (wasDismissed) setIsDismissed(true);
    }, []);

    // ============================================
    // RENDER CONDITIONS
    // ============================================

    if (footerState === 'HIDDEN') {
        return null;
    }

    // ============================================
    // RENDER
    // ============================================

    return (
        <>
            {/* Backdrop when expanded */}
            {isExpanded && (
                <div
                    className="fixed inset-0 bg-black/30 z-[99] animate-in fade-in-0 duration-200"
                    onClick={() => setIsExpanded(false)}
                />
            )}

            <div
                className={cn(
                    // Fixed positioning with safe area
                    'fixed left-0 right-0 z-[100]',
                    'bottom-0 pb-[env(safe-area-inset-bottom)]',
                    // Animation
                    'transition-all duration-300 ease-out translate-y-0 opacity-100',
                    className
                )}
            >
                {/* Upsell Toast (appears above footer) */}
                <UpsellToast
                    alternatives={alternatives}
                    onDismiss={handleDismissUpsell}
                    isVisible={showUpsell}
                />

                {/* ============================================ */}
                {/* STATE: ANCHOR with VS Battle Bar (Floating Dock - NO white background) */}
                {/* ============================================ */}
                {footerState === 'ANCHOR' && rivalProduct && !isDismissed && (
                    <VsBattleBar
                        currentProduct={currentProduct}
                        rivalProduct={rivalProduct}
                        onCompare={handleVsCompare}
                        onViewOffer={handleViewOffer}
                        onDismiss={handleDismissFooter}
                    />
                )}

                {/* ============================================ */}
                {/* STATE: SELECTION - COMPACT FLOATING DOCK     */}
                {/* REGRA: A BARRA DEVE SER SEMPRE PEQUENA!      */}
                {/* ============================================ */}
                {footerState === 'SELECTION' && (
                    <div className="flex items-center justify-center h-[72px] px-2">
                        {/* Floating Dock Container - ALWAYS COMPACT */}
                        <div className={cn(
                            'relative',
                            'flex items-center gap-2 sm:gap-3',
                            'bg-white/98 backdrop-blur-md',
                            'border border-gray-200/80',
                            'rounded-2xl',
                            'shadow-[0_8px_32px_-8px_rgba(0,0,0,0.2)]',
                            'px-3 py-2',
                            'max-w-lg'
                        )}>
                            {/* X Close Button - Top Right Corner */}
                            <button
                                onClick={() => selectedProducts.forEach(p => removeProduct(p.id))}
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
                )}

                {/* ============================================ */}
                {/* STATE: ANCHOR without rival - COMPACT DOCK   */}
                {/* ============================================ */}
                {footerState === 'ANCHOR' && !rivalProduct && (
                    <div className="flex items-center justify-center h-[72px] px-2">
                        <div className={cn(
                            'flex items-center gap-2 sm:gap-3',
                            'bg-white/98 backdrop-blur-md',
                            'border border-gray-200/80',
                            'rounded-2xl',
                            'shadow-[0_8px_32px_-8px_rgba(0,0,0,0.2)]',
                            'px-3 py-2',
                            'max-w-md'
                        )}>
                            <button
                                onClick={() => setShowUpsell(!showUpsell)}
                                className={cn(
                                    'flex items-center gap-2 px-3 py-2 rounded-xl',
                                    'bg-gray-100 hover:bg-gray-200 transition-colors',
                                    'text-xs font-medium text-text-secondary'
                                )}
                            >
                                <Sparkles size={14} className="text-amber-500" />
                                <span className="hidden sm:inline">Alternativas</span>
                            </button>

                            <button
                                onClick={handleViewOffer}
                                className={cn(
                                    'flex items-center justify-center gap-2',
                                    'px-4 py-2 rounded-xl',
                                    'bg-gradient-to-r from-[#FF9900] to-[#FFAD33]',
                                    'hover:from-[#E8890A] hover:to-[#FF9900]',
                                    'text-white font-bold text-xs',
                                    'shadow-md',
                                    'transition-all duration-200',
                                    'active:scale-[0.97]'
                                )}
                            >
                                <ShoppingCart size={14} />
                                <span>Ver Oferta</span>
                                <ExternalLink size={10} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
