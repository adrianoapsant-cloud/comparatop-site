'use client';

/**
 * StickyComparisonBar - Desktop On-Page Comparison
 * 
 * A fixed bottom bar that appears after 30% scroll, inviting users to compare
 * the current product with its main rival. Uses glassmorphism design.
 * 
 * Features:
 * - Appears after scrolling past hero (30%)
 * - Slide-up animation via Framer Motion
 * - Shows current product vs rival mini cards
 * - Dismissible with X button (persists in sessionStorage)
 * - Hidden on mobile (md:flex)
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Scale, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Product, MainCompetitor } from '@/types/category';

interface StickyComparisonBarProps {
    currentProduct: Product;
    rival: MainCompetitor;
    className?: string;
    /** Optional: ID for the full comparison table to scroll to */
    comparisonTableId?: string;
}

const STORAGE_KEY = 'comparison-bar-dismissed';

export function StickyComparisonBar({
    currentProduct,
    rival,
    className,
    comparisonTableId = 'comparison-table',
}: StickyComparisonBarProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const scrollRef = useRef<number>(0);

    // Check if dismissed on mount
    useEffect(() => {
        const dismissed = sessionStorage.getItem(`${STORAGE_KEY}-${currentProduct.id}`);
        if (dismissed === 'true') {
            setIsDismissed(true);
        }
    }, [currentProduct.id]);

    // Scroll detection (30% threshold)
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

            // Show after 30% scroll
            setIsVisible(scrollPercent > 30);
            scrollRef.current = scrollTop;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Dismiss handler
    const handleDismiss = useCallback(() => {
        setIsDismissed(true);
        sessionStorage.setItem(`${STORAGE_KEY}-${currentProduct.id}`, 'true');
    }, [currentProduct.id]);

    // Scroll to comparison table
    const handleCompare = useCallback(() => {
        const element = document.getElementById(comparisonTableId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [comparisonTableId]);

    // Format price
    const formatPrice = (price: number) => `R$ ${price.toLocaleString('pt-BR')}`;

    // Don't render if dismissed or not visible
    const shouldShow = isVisible && !isDismissed;

    return (
        <AnimatePresence>
            {shouldShow && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    className={cn(
                        // Positioning
                        'fixed bottom-0 left-0 right-0 z-40',
                        // Hide on mobile, show on desktop
                        'hidden md:flex',
                        // Glassmorphism
                        'bg-white/90 backdrop-blur-xl',
                        // Shadow pointing UP
                        'shadow-[0_-8px_30px_rgba(0,0,0,0.12)]',
                        // Border
                        'border-t border-gray-200/50',
                        className
                    )}
                >
                    <div className="max-w-7xl mx-auto w-full px-6 py-4">
                        <div className="flex items-center justify-between gap-6">
                            {/* LEFT: Current Product */}
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                    {currentProduct.imageUrl && (
                                        <Image
                                            src={currentProduct.imageUrl}
                                            alt={currentProduct.name}
                                            fill
                                            className="object-contain"
                                            sizes="48px"
                                        />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <div className="text-[10px] uppercase tracking-wide text-gray-500 font-medium">
                                        Você está vendo
                                    </div>
                                    <div className="font-semibold text-sm text-gray-900 truncate">
                                        {currentProduct.shortName || currentProduct.name}
                                    </div>
                                    <div className="text-xs text-emerald-600 font-medium">
                                        {formatPrice(currentProduct.price)}
                                    </div>
                                </div>
                            </div>

                            {/* CENTER: Rival */}
                            <div className="flex items-center gap-4 flex-1 justify-center">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Scale className="w-4 h-4" />
                                    <span className="text-sm font-medium">
                                        Dúvida? Compare com a principal rival:
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2">
                                    <div className="relative w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden bg-white">
                                        <Image
                                            src={rival.image || '/images/placeholder.png'}
                                            alt={rival.name}
                                            fill
                                            className="object-contain"
                                            sizes="40px"
                                        />
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm text-gray-900">
                                            {rival.name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {formatPrice(rival.price)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT: CTA & Dismiss */}
                            <div className="flex items-center gap-3 flex-shrink-0">
                                <button
                                    onClick={handleCompare}
                                    className={cn(
                                        'flex items-center gap-2 px-5 py-2.5 rounded-xl',
                                        'bg-gradient-to-r from-indigo-500 to-purple-600',
                                        'hover:from-indigo-600 hover:to-purple-700',
                                        'text-white font-semibold text-sm',
                                        'shadow-lg shadow-indigo-500/30',
                                        'transition-all duration-200'
                                    )}
                                >
                                    Comparar Lado a Lado
                                    <ArrowRight className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={handleDismiss}
                                    aria-label="Fechar barra de comparação"
                                    className={cn(
                                        'p-2 rounded-lg',
                                        'text-gray-400 hover:text-gray-600',
                                        'hover:bg-gray-100',
                                        'transition-colors duration-200'
                                    )}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default StickyComparisonBar;
