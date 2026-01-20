'use client';

import { ShoppingCart, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/l10n';
import { useHaptic } from '@/hooks/useHaptic';

// ============================================
// AMAZON BRAND COLORS (DEFINITIVE)
// ============================================

const AMAZON_STYLES = {
    // Primary button - Solid Orange #FF9900
    primary: {
        bg: 'bg-[#FF9900]',
        hover: 'hover:bg-[#E8890A]',
        text: 'text-white',
        border: 'border-[#CC7A00]',
    },
    // Alternative - Yellow gradient
    gradient: {
        bg: 'bg-gradient-to-b from-[#F7DFA5] to-[#F0C14B]',
        hover: 'hover:from-[#F5D78E] hover:to-[#EEB933]',
        text: 'text-[#111]',
        border: 'border-[#A88734]',
    },
};

// ============================================
// TYPES
// ============================================

export interface BuyBoxProps {
    /** Product price */
    price: number;
    /** Original price (for strikethrough) */
    originalPrice?: number;
    /** Amazon URL */
    url: string;
    /** Store name (default: Amazon) */
    storeName?: string;
    /** Use gradient style instead of solid orange */
    useGradient?: boolean;
    /** Compact mode for smaller cards */
    compact?: boolean;
    /** Full width */
    fullWidth?: boolean;
    /** Custom class name */
    className?: string;
}

// ============================================
// MAIN BUYBOX COMPONENT
// ============================================

/**
 * BuyBox - Definitive Amazon-Style Purchase Component
 * 
 * Design Pattern:
 * - Large price displayed prominently
 * - Clear "Ver na Amazon" CTA button
 * - #FF9900 Orange (Amazon official) or yellow gradient
 * - No confusing "Ver disponibilidade" text
 */
export function BuyBox({
    price,
    originalPrice,
    url,
    storeName = 'Amazon',
    useGradient = false,
    compact = false,
    fullWidth = true,
    className,
}: BuyBoxProps) {
    const haptic = useHaptic();
    const styles = useGradient ? AMAZON_STYLES.gradient : AMAZON_STYLES.primary;

    const handleClick = () => {
        haptic.trigger('impact');
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const discount = originalPrice && originalPrice > price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : null;

    return (
        <div className={cn('space-y-3', className)}>
            {/* Price Display - Clear and Prominent */}
            <div className="flex items-baseline gap-2 flex-wrap">
                {originalPrice && originalPrice > price && (
                    <span className="text-sm text-text-muted line-through">
                        {formatPrice(originalPrice)}
                    </span>
                )}
                <span className={cn(
                    'font-bold text-text-primary',
                    compact ? 'text-xl' : 'text-2xl md:text-3xl'
                )}>
                    {formatPrice(price)}
                </span>
                {discount && (
                    <span className="text-sm font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">
                        -{discount}%
                    </span>
                )}
            </div>

            {/* CTA Button - Amazon Orange */}
            <button
                type="button"
                onClick={handleClick}
                className={cn(
                    'rounded-lg border',
                    'font-body font-bold',
                    'flex items-center justify-center gap-2',
                    'cursor-pointer',
                    'active:scale-[0.98]',
                    'transition-all duration-150',
                    'shadow-sm hover:shadow-md',
                    // Amazon styles
                    styles.bg,
                    styles.hover,
                    styles.text,
                    styles.border,
                    // Sizing
                    fullWidth ? 'w-full' : 'px-6',
                    compact ? 'py-2.5 text-sm' : 'py-3.5 text-base'
                )}
            >
                <ShoppingCart size={compact ? 18 : 20} />
                <span>Ver na {storeName}</span>
                <ExternalLink size={compact ? 14 : 16} className="opacity-70" />
            </button>
        </div>
    );
}

// ============================================
// INLINE BUYBOX (For Comparison Table Columns)
// ============================================

interface InlineBuyBoxProps {
    price: number;
    url: string;
    storeName?: string;
}

/**
 * Compact inline version for comparison table columns
 */
export function InlineBuyBox({ price, url, storeName = 'Amazon' }: InlineBuyBoxProps) {
    const haptic = useHaptic();

    const handleClick = () => {
        haptic.trigger('impact');
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="space-y-2">
            <p className="text-lg font-bold text-text-primary text-center">
                {formatPrice(price)}
            </p>
            <button
                type="button"
                onClick={handleClick}
                className={cn(
                    'w-full py-2 px-3 rounded-md',
                    'bg-[#FF9900] hover:bg-[#E8890A]',
                    'border border-[#CC7A00]',
                    'text-white font-semibold text-sm',
                    'flex items-center justify-center gap-1.5',
                    'cursor-pointer active:scale-[0.98]',
                    'transition-all duration-150'
                )}
            >
                <ShoppingCart size={14} />
                Ver na {storeName}
            </button>
        </div>
    );
}

// ============================================
// STICKY MOBILE FOOTER
// ============================================

interface StickyBuyFooterProps {
    productName: string;
    productImage?: string;
    price: number;
    url: string;
}

/**
 * Sticky Buy Footer for Mobile
 * Fixed bar at bottom of screen with product info + buy button
 */
export function StickyBuyFooter({ productName, productImage, price, url }: StickyBuyFooterProps) {
    const haptic = useHaptic();

    const handleClick = () => {
        haptic.trigger('impact');
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 shadow-2xl p-3">
            <div className="flex items-center gap-3">
                {/* Product Mini */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    {productImage && (
                        <img
                            src={productImage}
                            alt={productName}
                            className="w-10 h-10 object-contain rounded"
                        />
                    )}
                    <div className="min-w-0 flex-1">
                        <p className="text-xs text-text-muted truncate">{productName}</p>
                        <p className="text-sm font-bold text-text-primary">{formatPrice(price)}</p>
                    </div>
                </div>

                {/* Buy Button - Amazon Orange */}
                <button
                    type="button"
                    onClick={handleClick}
                    className={cn(
                        'px-4 py-2.5 rounded-lg',
                        'bg-[#FF9900] hover:bg-[#E8890A]',
                        'border border-[#CC7A00]',
                        'text-white font-bold text-sm',
                        'flex items-center gap-1.5',
                        'cursor-pointer active:scale-[0.98]',
                        'transition-all duration-150'
                    )}
                >
                    <ShoppingCart size={16} />
                    Ver na Amazon
                </button>
            </div>
        </div>
    );
}
