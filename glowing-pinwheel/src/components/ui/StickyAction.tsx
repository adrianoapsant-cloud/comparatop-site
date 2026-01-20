'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ExternalLink, Check, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// STICKY ACTION BAR (Price Masked + Smart Hide)
// ============================================
// Appears when scrolling - NO static prices shown.
// Features:
// - Smart Hide: hides on scroll down, shows on scroll up
// - Upsell toggle with delta price only
// - Multi-ASIN cart generation
// - Amazon compliance (nofollow sponsored)

export interface StickyUpsellItem {
    id: string;
    label: string;
    price: number; // Delta price for accessory (shown as "+R$ X")
    asin?: string;
}

export interface StickyActionProps {
    /** Main product ASIN */
    mainProductAsin?: string;
    /** Product name for search fallback */
    productName?: string;
    /** Optional upsell items */
    upsellItems?: StickyUpsellItem[];
    /** Custom CTA text */
    ctaText?: string;
    /** Direct affiliate URL (overrides ASIN) */
    affiliateUrl?: string;
    className?: string;
}

export function StickyAction({
    mainProductAsin,
    productName,
    upsellItems = [],
    ctaText = 'Ver Melhor Oferta',
    affiliateUrl,
    className,
}: StickyActionProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [selectedUpsells, setSelectedUpsells] = useState<Set<string>>(new Set());
    const lastScrollY = useRef(0);
    const ticking = useRef(false);

    // Toggle upsell selection
    const toggleUpsell = (id: string) => {
        setSelectedUpsells(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    // Generate URL based on selections
    const generateUrl = () => {
        const selectedItems = upsellItems.filter(item => selectedUpsells.has(item.id));

        // If we have ASINs and upsells selected, create multi-cart URL
        if (mainProductAsin && selectedItems.length > 0 && selectedItems.some(i => i.asin)) {
            const params = new URLSearchParams();
            params.append('ASIN.1', mainProductAsin);
            params.append('Quantity.1', '1');

            selectedItems.forEach((item, idx) => {
                if (item.asin) {
                    params.append(`ASIN.${idx + 2}`, item.asin);
                    params.append(`Quantity.${idx + 2}`, '1');
                }
            });

            params.append('tag', 'comparatop-20');
            return `https://www.amazon.com.br/gp/aws/cart/add.html?${params.toString()}`;
        }

        // Single product
        if (affiliateUrl) return affiliateUrl;
        if (mainProductAsin) return `https://www.amazon.com.br/dp/${mainProductAsin}?tag=comparatop-20`;
        if (productName) return `https://www.amazon.com.br/s?k=${encodeURIComponent(productName)}&tag=comparatop-20`;
        return 'https://www.amazon.com.br?tag=comparatop-20';
    };

    // Calculate total delta for upsells
    const totalDelta = upsellItems
        .filter(item => selectedUpsells.has(item.id))
        .reduce((sum, item) => sum + item.price, 0);

    // Smart Hide: Observer for scroll with direction detection
    useEffect(() => {
        const SCROLL_THRESHOLD = 300; // Appear after 300px
        const HIDE_DELTA = 10; // Minimum scroll delta to trigger hide

        const handleScroll = () => {
            if (ticking.current) return;

            ticking.current = true;
            requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
                const delta = currentScrollY - lastScrollY.current;

                // Show bar after scrolling past hero
                if (currentScrollY > SCROLL_THRESHOLD) {
                    setIsVisible(true);

                    // Smart Hide logic
                    if (delta > HIDE_DELTA) {
                        // Scrolling DOWN - hide the bar
                        setIsHidden(true);
                    } else if (delta < -HIDE_DELTA) {
                        // Scrolling UP - show the bar
                        setIsHidden(false);
                    }
                } else {
                    setIsVisible(false);
                    setIsHidden(false);
                }

                lastScrollY.current = currentScrollY;
                ticking.current = false;
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Determine final visibility (visible AND not hidden)
    const showBar = isVisible && !isHidden;

    return (
        <AnimatePresence>
            {showBar && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    className={cn(
                        'fixed bottom-0 left-0 right-0 z-50',
                        'bg-white/95 backdrop-blur-lg border-t border-gray-200',
                        'shadow-[0_-4px_20px_rgba(0,0,0,0.1)]',
                        'pb-safe', // Safe area for iPhone notch
                        className
                    )}
                >
                    <div className="max-w-7xl mx-auto px-4 py-3">
                        <div className="flex items-center gap-4">
                            {/* Left Section - No price, just message (Desktop only) */}
                            <div className="flex-shrink-0 hidden sm:block">
                                <div className="text-xs text-text-muted">Preço atualizado</div>
                                <div className="font-display text-sm font-semibold text-amber-600 flex items-center gap-1">
                                    <Search size={14} />
                                    Checar na Amazon
                                </div>
                            </div>

                            {/* Upsell Toggles - Center/Left on mobile */}
                            {upsellItems.length > 0 && (
                                <div className="flex-1 overflow-x-auto scrollbar-hide">
                                    <div className="flex gap-2 min-w-max">
                                        {upsellItems.map(item => (
                                            <button
                                                key={item.id}
                                                onClick={() => toggleUpsell(item.id)}
                                                className={cn(
                                                    'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all',
                                                    'border whitespace-nowrap',
                                                    selectedUpsells.has(item.id)
                                                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                                        : 'bg-gray-50 border-gray-200 text-text-secondary hover:border-gray-300'
                                                )}
                                            >
                                                <div className={cn(
                                                    'w-4 h-4 rounded border-2 flex items-center justify-center transition-colors',
                                                    selectedUpsells.has(item.id)
                                                        ? 'bg-emerald-500 border-emerald-500'
                                                        : 'border-gray-300'
                                                )}>
                                                    {selectedUpsells.has(item.id) && (
                                                        <Check size={10} className="text-white" />
                                                    )}
                                                </div>
                                                <span>+ {item.label}</span>
                                                <span className="text-emerald-600 font-semibold">
                                                    +R$ {item.price.toLocaleString('pt-BR')}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CTA Button - Right */}
                            <a
                                href={generateUrl()}
                                target="_blank"
                                rel="nofollow sponsored noopener noreferrer"
                                className={cn(
                                    'flex items-center justify-center gap-2',
                                    'px-6 py-3 rounded-xl',
                                    'bg-gradient-to-r from-amber-500 to-orange-500',
                                    'hover:from-amber-400 hover:to-orange-400',
                                    'text-white font-bold text-sm',
                                    'shadow-lg shadow-amber-500/30',
                                    'transition-all whitespace-nowrap',
                                    'flex-shrink-0'
                                )}
                            >
                                <ShoppingCart size={18} />
                                <span>
                                    {selectedUpsells.size > 0
                                        ? `Ver Kit (+R$ ${totalDelta.toLocaleString('pt-BR')})`
                                        : ctaText}
                                </span>
                                <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ============================================
// STICKY ACTION MOBILE (Simplified + Smart Hide)
// ============================================

interface StickyActionMobileProps {
    productName: string;
    mainProductAsin?: string;
    accessoryLabel?: string;
    accessoryPrice?: number;
    accessoryAsin?: string;
    className?: string;
}

export function StickyActionMobile({
    productName,
    mainProductAsin,
    accessoryLabel = 'Soundbar',
    accessoryPrice = 1200,
    accessoryAsin,
    className,
}: StickyActionMobileProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [includeAccessory, setIncludeAccessory] = useState(false);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);

    // Generate URL
    const generateUrl = () => {
        if (includeAccessory && mainProductAsin && accessoryAsin) {
            return `https://www.amazon.com.br/gp/aws/cart/add.html?ASIN.1=${mainProductAsin}&Quantity.1=1&ASIN.2=${accessoryAsin}&Quantity.2=1&tag=comparatop-20`;
        }
        if (mainProductAsin) {
            return `https://www.amazon.com.br/dp/${mainProductAsin}?tag=comparatop-20`;
        }
        return `https://www.amazon.com.br/s?k=${encodeURIComponent(productName)}&tag=comparatop-20`;
    };

    // Smart Hide scroll behavior
    useEffect(() => {
        const SCROLL_THRESHOLD = 300;
        const HIDE_DELTA = 8;

        const handleScroll = () => {
            if (ticking.current) return;

            ticking.current = true;
            requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
                const delta = currentScrollY - lastScrollY.current;

                if (currentScrollY > SCROLL_THRESHOLD) {
                    setIsVisible(true);

                    if (delta > HIDE_DELTA) {
                        setIsHidden(true);
                    } else if (delta < -HIDE_DELTA) {
                        setIsHidden(false);
                    }
                } else {
                    setIsVisible(false);
                    setIsHidden(false);
                }

                lastScrollY.current = currentScrollY;
                ticking.current = false;
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const showBar = isVisible && !isHidden;

    return (
        <AnimatePresence>
            {showBar && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    className={cn(
                        'fixed bottom-0 left-0 right-0 z-50 md:hidden',
                        'bg-white/95 backdrop-blur-lg border-t border-gray-200',
                        'shadow-[0_-4px_20px_rgba(0,0,0,0.1)]',
                        'pb-safe',
                        className
                    )}
                >
                    <div className="flex items-center gap-3 p-3">
                        {/* Accessory Toggle */}
                        <button
                            onClick={() => setIncludeAccessory(!includeAccessory)}
                            className={cn(
                                'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all flex-1',
                                'border whitespace-nowrap',
                                includeAccessory
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                    : 'bg-gray-50 border-gray-200 text-text-secondary'
                            )}
                        >
                            <div className={cn(
                                'w-4 h-4 rounded border-2 flex items-center justify-center transition-colors',
                                includeAccessory
                                    ? 'bg-emerald-500 border-emerald-500'
                                    : 'border-gray-300'
                            )}>
                                {includeAccessory && <Check size={10} className="text-white" />}
                            </div>
                            <span>+ {accessoryLabel}</span>
                            <span className="text-emerald-600 font-semibold">
                                +R$ {accessoryPrice.toLocaleString('pt-BR')}
                            </span>
                        </button>

                        {/* CTA */}
                        <a
                            href={generateUrl()}
                            target="_blank"
                            rel="nofollow sponsored noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-lg flex-shrink-0"
                        >
                            <ShoppingCart size={16} />
                            {includeAccessory ? 'Ver Kit' : 'Ver Oferta'}
                            <ExternalLink size={12} />
                        </a>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
