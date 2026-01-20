'use client';

import { useState } from 'react';
import { ExternalLink, ShoppingCart, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// PRICE REVEAL BUTTON
// ============================================
// Replaces static prices with a CTA button for Amazon compliance.
// This increases CTR and complies with affiliate program rules.
//
// Features:
// - Attractive "Check Price" button (emoji only, no duplicate icon)
// - Hover state changes to "View Offer"
// - Compliance micro-copy
// - nofollow sponsored rel tags

interface PriceRevealButtonProps {
    /** Amazon affiliate URL or product search URL */
    affiliateUrl?: string;
    /** Product name for search fallback */
    productName?: string;
    /** Product ASIN for direct linking */
    asin?: string;
    /** Button size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Visual variant */
    variant?: 'primary' | 'secondary' | 'outline';
    /** Show compliance text below */
    showCompliance?: boolean;
    /** Custom CTA text (with emoji) */
    ctaText?: string;
    /** Custom hover text */
    hoverText?: string;
    className?: string;
}

export function PriceRevealButton({
    affiliateUrl,
    productName,
    asin,
    size = 'md',
    variant = 'primary',
    showCompliance = true,
    ctaText = '🔎 Verificar Menor Preço de Hoje',
    hoverText = 'Conferir Desconto →',
    className,
}: PriceRevealButtonProps) {
    const [isHovered, setIsHovered] = useState(false);

    // Generate URL: priority is affiliateUrl > ASIN > search
    const generateUrl = () => {
        if (affiliateUrl) return affiliateUrl;
        if (asin) return `https://www.amazon.com.br/dp/${asin}?tag=comparatop-20`;
        if (productName) return `https://www.amazon.com.br/s?k=${encodeURIComponent(productName)}&tag=comparatop-20`;
        return 'https://www.amazon.com.br?tag=comparatop-20';
    };

    const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    const variantClasses = {
        primary: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-lg shadow-amber-500/30',
        secondary: 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-600/30',
        outline: 'bg-white border-2 border-amber-500 text-amber-600 hover:bg-amber-50',
    };

    return (
        <div className={cn('flex flex-col items-center w-full', className)}>
            <a
                href={generateUrl()}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={cn(
                    'flex items-center justify-center gap-2 rounded-xl font-bold transition-all w-full',
                    sizeClasses[size],
                    variantClasses[variant],
                    'hover:scale-[1.02] active:scale-[0.98]'
                )}
            >
                {isHovered ? (
                    <>
                        <ShoppingCart size={size === 'sm' ? 16 : 20} />
                        <span>{hoverText}</span>
                    </>
                ) : (
                    <span>{ctaText}</span>
                )}
            </a>

            {/* Compliance Micro-copy */}
            {showCompliance && (
                <p className="mt-2 text-[10px] text-text-muted text-center max-w-xs">
                    Vendido e entregue por Amazon/Parceiros. Preços podem variar.
                </p>
            )}
        </div>
    );
}

// ============================================
// MARKETPLACE BUTTON GRID
// ============================================
// Shows multiple marketplace buttons with dynamic highlighting
// based on which has the best price. Ready for API integration.

export interface MarketplaceOffer {
    id: string;
    name: string;
    icon: string; // Emoji icon
    url: string;
    price?: number; // Will come from API - if undefined, show "Checar"
    available?: boolean;
    // Brand styling
    brandColor?: string;
    bgGradient?: string;
    hoverGradient?: string;
    textColor?: string; // For light backgrounds like ML yellow
}

interface MarketplaceButtonGridProps {
    productName: string;
    offers?: MarketplaceOffer[];
    className?: string;
}

// Default marketplace configs with brand-specific styling
const DEFAULT_MARKETPLACES = (productName: string): MarketplaceOffer[] => [
    {
        id: 'amazon',
        name: 'Amazon',
        icon: '🛒',
        url: `https://www.amazon.com.br/s?k=${encodeURIComponent(productName)}&tag=comparatop-20`,
        brandColor: '#FF9900', // Amazon Orange
        bgGradient: 'from-[#FF9900] to-[#FF6600]',
        hoverGradient: 'hover:from-[#FFB347] hover:to-[#FF9900]',
    },
    {
        id: 'mercadolivre',
        name: 'Mercado Livre',
        icon: '🤝',
        url: `https://lista.mercadolivre.com.br/${encodeURIComponent(productName)}_Frete_Gratis_NoIndex_True`,
        brandColor: '#FFE600', // ML Yellow
        bgGradient: 'from-[#FFE600] to-[#FFC800]',
        hoverGradient: 'hover:from-[#FFEB3B] hover:to-[#FFE600]',
        textColor: 'text-gray-900', // Dark text on yellow
    },
    {
        id: 'shopee',
        name: 'Shopee',
        icon: '🛍️',
        url: `https://shopee.com.br/search?keyword=${encodeURIComponent(productName)}&official_mall=1&rating_star=4`,
        brandColor: '#EE4D2D', // Shopee Orange-Red
        bgGradient: 'from-[#EE4D2D] to-[#D0011B]',
        hoverGradient: 'hover:from-[#FF6B4A] hover:to-[#EE4D2D]',
    },
    {
        id: 'magalu',
        name: 'Magazine Luiza',
        icon: '💙',
        url: `https://www.magazineluiza.com.br/busca/${encodeURIComponent(productName)}/?seller=magazineluiza`,
        brandColor: '#0086FF', // Magalu Blue
        bgGradient: 'from-[#0086FF] to-[#0066CC]',
        hoverGradient: 'hover:from-[#3399FF] hover:to-[#0086FF]',
    },
];

export function MarketplaceButtonGrid({
    productName,
    offers,
    className,
}: MarketplaceButtonGridProps) {
    // Use provided offers or defaults
    const marketplaces = offers || DEFAULT_MARKETPLACES(productName);

    // Find the best offer (lowest price) - will be used when APIs are connected
    const bestOfferId = marketplaces.reduce((best, current) => {
        if (!current.price) return best;
        if (!best || (current.price < (marketplaces.find(m => m.id === best)?.price || Infinity))) {
            return current.id;
        }
        return best;
    }, null as string | null);

    // Sort: best price first, then available, then unavailable
    const sortedMarketplaces = [...marketplaces].sort((a, b) => {
        if (a.id === bestOfferId) return -1;
        if (b.id === bestOfferId) return 1;
        if (a.price && !b.price) return -1;
        if (!a.price && b.price) return 1;
        if (a.price && b.price) return a.price - b.price;
        return 0;
    });

    return (
        <div className={cn('flex flex-col gap-3', className)}>
            {sortedMarketplaces.map((marketplace, idx) => {
                const isBest = marketplace.id === bestOfferId || (idx === 0 && !bestOfferId);
                const isUnavailable = marketplace.available === false;

                return (
                    <a
                        key={marketplace.id}
                        href={marketplace.url}
                        target="_blank"
                        rel="nofollow sponsored noopener noreferrer"
                        className={cn(
                            'flex items-center justify-between gap-3 px-5 py-4 rounded-xl font-semibold transition-all',
                            isUnavailable && 'opacity-50 pointer-events-none',
                            // Use brand-specific gradient or fallback
                            marketplace.bgGradient
                                ? `bg-gradient-to-r ${marketplace.bgGradient} ${marketplace.hoverGradient || ''} ${marketplace.textColor || 'text-white'} shadow-lg hover:shadow-xl hover:scale-[1.02]`
                                : (isBest
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 hover:shadow-xl'
                                    : 'bg-white border-2 border-gray-200 text-text-primary hover:border-gray-300 hover:bg-gray-50')
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-xl">{marketplace.icon}</span>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span>{marketplace.price ? 'Ver Melhor Oferta' : 'Conferir Desconto'}</span>
                                    {isBest && marketplace.price && (
                                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                                            Melhor Preço
                                        </span>
                                    )}
                                </div>
                                <div className={cn(
                                    'text-xs opacity-80',
                                    marketplace.textColor ? 'text-gray-700' : 'text-white/90'
                                )}>
                                    {marketplace.name}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {marketplace.price && (
                                <span className={cn(
                                    'font-bold',
                                    isBest ? 'text-white' : 'text-emerald-600'
                                )}>
                                    R$ {marketplace.price.toLocaleString('pt-BR')}
                                </span>
                            )}
                            <ExternalLink size={16} className={isBest ? 'text-white/80' : 'text-gray-400'} />
                        </div>
                    </a>
                );
            })}

            <p className="text-[10px] text-text-muted text-center">
                Vendido por parceiros. Preços atualizados em tempo real quando disponíveis.
            </p>
        </div>
    );
}

// ============================================
// PRICE BADGE (For Product Cards)
// ============================================

interface PriceBadgeProps {
    affiliateUrl?: string;
    productName?: string;
    asin?: string;
    /** Custom label for the button */
    label?: string;
    className?: string;
}

export function PriceBadge({
    affiliateUrl,
    productName,
    asin,
    label = 'Ver Melhor Oferta',
    className,
}: PriceBadgeProps) {
    const generateUrl = () => {
        if (affiliateUrl) return affiliateUrl;
        if (asin) return `https://www.amazon.com.br/dp/${asin}?tag=comparatop-20`;
        if (productName) return `https://www.amazon.com.br/s?k=${encodeURIComponent(productName)}&tag=comparatop-20`;
        return 'https://www.amazon.com.br?tag=comparatop-20';
    };

    return (
        <a
            href={generateUrl()}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
                'bg-gradient-to-r from-amber-500 to-orange-500',
                'text-white font-bold text-sm',
                'hover:from-amber-400 hover:to-orange-400',
                'transition-all shadow-md',
                className
            )}
        >
            <Sparkles size={14} />
            <span>{label}</span>
            <ExternalLink size={12} />
        </a>
    );
}
