'use client';

import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHaptic } from '@/hooks/useHaptic';
import { useScrollVisibility } from '@/hooks/useScrollVisibility';

interface StickyProductFooterProps {
    productName: string;
    price: number;
    ctaText?: string;
    ctaUrl?: string;
    /** ID of the element to observe - footer shows after scrolling past this element */
    observeTargetId?: string;
}

/**
 * Sticky footer bar that appears on mobile when user scrolls past the main product card.
 * Provides quick access to product info and CTA without scrolling back up.
 */
export function StickyProductFooter({
    productName,
    price,
    ctaText = "Ver na Amazon",
    ctaUrl = "#",
    observeTargetId = "product-hero-card",
}: StickyProductFooterProps) {
    const haptic = useHaptic();
    const isVisible = useScrollVisibility({ targetId: observeTargetId });

    const formatPrice = (value: number) => {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    };

    // Truncate product name smartly
    const truncatedName = productName.length > 20
        ? productName.substring(0, 20) + '...'
        : productName;

    return (
        <div
            className={cn(
                // Base styles
                "fixed bottom-0 left-0 w-full z-50",
                "bg-bg-card border-t border-gray-200",
                "shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]",
                "px-4 py-3",
                // Mobile only
                "md:hidden",
                // Animation
                "transition-transform duration-300 ease-out",
                isVisible ? "translate-y-0" : "translate-y-full"
            )}
            aria-hidden={!isVisible}
        >
            <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
                {/* Left: Product Info */}
                <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-medium text-text-primary truncate">
                        {truncatedName}
                    </p>
                    <p className="text-data text-lg font-bold text-text-primary">
                        {formatPrice(price)}
                    </p>
                </div>

                {/* Right: Compact CTA */}
                <a
                    href={ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onPointerDown={() => haptic.trigger('impact')}
                    className={cn(
                        // Base button styles
                        "inline-flex items-center justify-center gap-2",
                        "bg-action-primary text-white",
                        "font-body font-semibold text-sm",
                        "px-4 py-2.5 rounded-lg",
                        "shadow-[0_4px_14px_-3px_rgba(217,93,57,0.4)]",
                        // Micro-interaction: physical button feel
                        "active:scale-[0.98]",
                        "transition-transform duration-75",
                        // Hover
                        "hover:bg-action-primary-hover"
                    )}
                >
                    {ctaText}
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </a>
            </div>
        </div>
    );
}
