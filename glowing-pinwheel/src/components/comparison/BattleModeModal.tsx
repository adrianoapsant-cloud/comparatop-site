'use client';

/**
 * BattleModeModal - Mobile On-Page Comparison
 * 
 * A Floating Action Button (FAB) that opens a full-screen "Battle Card" modal
 * showing the 3 key differences between the current product and its main rival.
 * 
 * Features:
 * - FAB appears after 30% scroll
 * - Full-screen modal with slide-up animation
 * - Shows 3 key differences with winner highlighting
 * - "Ver Comparativo Completo" CTA
 * - Visible only on mobile (md:hidden)
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, X, Trophy, ArrowRight, Minus } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Product, MainCompetitor, KeyDifference } from '@/types/category';

interface BattleModeModalProps {
    currentProduct: Product;
    rival: MainCompetitor;
    className?: string;
    /** Optional: ID for the full comparison table to scroll to */
    comparisonTableId?: string;
}

export function BattleModeModal({
    currentProduct,
    rival,
    className,
    comparisonTableId = 'comparison-table',
}: BattleModeModalProps) {
    const [showFab, setShowFab] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Scroll detection (30% threshold)
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

            // Show after 30% scroll
            setShowFab(scrollPercent > 30);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isModalOpen]);

    // Scroll to comparison table
    const handleFullComparison = useCallback(() => {
        setIsModalOpen(false);
        setTimeout(() => {
            const element = document.getElementById(comparisonTableId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 300);
    }, [comparisonTableId]);

    // Format price
    const formatPrice = (price: number) => `R$ ${price.toLocaleString('pt-BR')}`;

    // Winner icon
    const getWinnerIcon = (winner: KeyDifference['winner'], side: 'current' | 'rival') => {
        if (winner === 'draw') return <Minus className="w-4 h-4 text-gray-400" />;
        if (winner === side) return <Trophy className="w-4 h-4 text-emerald-500" />;
        return null;
    };

    return (
        <>
            {/* FAB - Mobile Only */}
            <AnimatePresence>
                {showFab && !isModalOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        onClick={() => setIsModalOpen(true)}
                        className={cn(
                            // Position
                            'fixed bottom-20 right-4 z-40',
                            // Mobile only
                            'md:hidden',
                            // Style
                            'flex items-center gap-2 px-4 py-3 rounded-full',
                            'bg-gradient-to-r from-indigo-500 to-purple-600',
                            'text-white font-semibold text-sm',
                            'shadow-xl shadow-indigo-500/40',
                            className
                        )}
                    >
                        <Scale className="w-5 h-5" />
                        <span>Dúvida?</span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Full-Screen Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                            onClick={(e) => e.stopPropagation()}
                            className={cn(
                                'absolute bottom-0 left-0 right-0',
                                'bg-white rounded-t-3xl',
                                'max-h-[90vh] overflow-y-auto',
                                'pb-safe'
                            )}
                        >
                            {/* Header */}
                            <div className="sticky top-0 bg-white px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-indigo-600">
                                    <Scale className="w-5 h-5" />
                                    <span className="font-bold">Veja a Diferença</span>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 -mr-2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Products Header Row */}
                            <div className="grid grid-cols-2 gap-4 px-5 py-4 border-b border-gray-100">
                                {/* Current Product */}
                                <div className="flex flex-col items-center text-center">
                                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 mb-2">
                                        {currentProduct.imageUrl && (
                                            <Image
                                                src={currentProduct.imageUrl}
                                                alt={currentProduct.name}
                                                fill
                                                className="object-contain"
                                                sizes="64px"
                                            />
                                        )}
                                    </div>
                                    <div className="text-[10px] uppercase tracking-wide text-indigo-600 font-bold mb-0.5">
                                        Você está vendo
                                    </div>
                                    <div className="font-semibold text-sm text-gray-900 line-clamp-2">
                                        {currentProduct.shortName || currentProduct.name}
                                    </div>
                                    <div className="text-sm text-emerald-600 font-bold mt-1">
                                        {formatPrice(currentProduct.price)}
                                    </div>
                                </div>

                                {/* Rival Product */}
                                <div className="flex flex-col items-center text-center">
                                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 mb-2">
                                        <Image
                                            src={rival.image || '/images/placeholder.png'}
                                            alt={rival.name}
                                            fill
                                            className="object-contain"
                                            sizes="64px"
                                        />
                                    </div>
                                    <div className="text-[10px] uppercase tracking-wide text-gray-500 font-bold mb-0.5">
                                        Principal Rival
                                    </div>
                                    <div className="font-semibold text-sm text-gray-900 line-clamp-2">
                                        {rival.name}
                                    </div>
                                    <div className="text-sm text-gray-600 font-bold mt-1">
                                        {formatPrice(rival.price)}
                                    </div>
                                </div>
                            </div>

                            {/* Key Differences */}
                            <div className="px-5 py-4">
                                <h3 className="text-xs uppercase tracking-wide text-gray-500 font-bold mb-4 text-center">
                                    3 Diferenças Decisivas
                                </h3>

                                <div className="space-y-3">
                                    {rival.keyDifferences.map((diff, index) => (
                                        <div
                                            key={index}
                                            className="bg-gray-50 rounded-xl p-4"
                                        >
                                            {/* Label */}
                                            <div className="text-xs font-bold text-gray-500 text-center mb-3 uppercase tracking-wide">
                                                {diff.label}
                                            </div>

                                            {/* Values */}
                                            <div className="grid grid-cols-2 gap-4">
                                                {/* Current */}
                                                <div className={cn(
                                                    'flex flex-col items-center text-center p-3 rounded-lg',
                                                    diff.winner === 'current' && 'bg-emerald-50 ring-2 ring-emerald-200'
                                                )}>
                                                    <div className="flex items-center gap-1 mb-1">
                                                        {getWinnerIcon(diff.winner, 'current')}
                                                    </div>
                                                    <div className={cn(
                                                        'font-bold text-sm',
                                                        diff.winner === 'current' ? 'text-emerald-700' : 'text-gray-700'
                                                    )}>
                                                        {diff.current}
                                                    </div>
                                                </div>

                                                {/* Rival */}
                                                <div className={cn(
                                                    'flex flex-col items-center text-center p-3 rounded-lg',
                                                    diff.winner === 'rival' && 'bg-emerald-50 ring-2 ring-emerald-200'
                                                )}>
                                                    <div className="flex items-center gap-1 mb-1">
                                                        {getWinnerIcon(diff.winner, 'rival')}
                                                    </div>
                                                    <div className={cn(
                                                        'font-bold text-sm',
                                                        diff.winner === 'rival' ? 'text-emerald-700' : 'text-gray-700'
                                                    )}>
                                                        {diff.rival}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* CTA Footer */}
                            <div className="px-5 pb-6 pt-2">
                                <button
                                    onClick={handleFullComparison}
                                    className={cn(
                                        'w-full flex items-center justify-center gap-2 py-4 rounded-xl',
                                        'bg-gradient-to-r from-indigo-500 to-purple-600',
                                        'text-white font-bold text-base',
                                        'shadow-lg shadow-indigo-500/30'
                                    )}
                                >
                                    Ver Comparativo Completo
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default BattleModeModal;
