'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/l10n';
import { useComparison } from '@/contexts/ComparisonContext';
import { MatchScoreOverlay, DualScoreDisplay } from '@/components/MatchDonutChart';
import type { ScoredProduct } from '@/types/category';
import type { MatchResult } from '@/core/match/types';

// ============================================
// ANIMATED PRODUCT CARD
// ============================================

interface AnimatedProductCardProps {
    product: ScoredProduct;
    matchResult?: MatchResult;
    index: number;
}

export function AnimatedProductCard({
    product,
    matchResult,
    index,
}: AnimatedProductCardProps) {
    const { addProduct, removeProduct, isSelected } = useComparison();
    const selected = isSelected(product.id);

    const handleCompareToggle = () => {
        if (selected) {
            removeProduct(product.id);
        } else {
            addProduct({
                id: product.id,
                name: product.name,
                shortName: product.shortName,
                imageUrl: product.imageUrl,
                price: product.price,
                categoryId: product.categoryId,
            });
        }
    };

    return (
        <motion.div
            layout
            layoutId={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
                layout: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
            }}
            className={cn(
                'flex items-center gap-4 p-4',
                'bg-white rounded-xl border border-gray-100',
                'hover:border-brand-core/30 hover:shadow-md',
                'transition-shadow'
            )}
        >
            {/* Rank Badge */}
            {matchResult && (
                <motion.div
                    key={`rank-${product.id}-${index}`}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center',
                        'font-bold text-sm flex-shrink-0',
                        index === 0 ? 'bg-amber-100 text-amber-700' :
                            index === 1 ? 'bg-gray-200 text-gray-700' :
                                index === 2 ? 'bg-orange-100 text-orange-700' :
                                    'bg-gray-100 text-gray-500'
                    )}
                >
                    {index + 1}º
                </motion.div>
            )}

            {/* Image with Match Overlay */}
            <Link href={`/produto/${product.id}`} className="flex-shrink-0 relative">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden"
                >
                    {product.imageUrl ? (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-contain p-2"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            {product.shortName?.substring(0, 3)}
                        </div>
                    )}
                </motion.div>

                {/* Match Score Overlay */}
                {matchResult && (
                    <MatchScoreOverlay
                        result={matchResult}
                        position="top-right"
                        className="-top-2 -right-2"
                    />
                )}
            </Link>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <span className="text-[10px] font-medium text-text-muted uppercase">
                    {product.brand}
                </span>
                <Link href={`/produto/${product.id}`}>
                    <h3 className="font-body font-semibold text-sm text-text-primary truncate hover:text-brand-core">
                        {product.shortName || product.name}
                    </h3>
                </Link>

                {/* Micro-Verdicts (Blemishing Badges) */}
                <div className="flex flex-wrap gap-1 mt-1">
                    {/* Positive badges */}
                    {product.badges?.includes('premium-pick') && (
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-semibold rounded">
                            ⭐ Premium Pick
                        </span>
                    )}
                    {product.badges?.includes('best-value') && (
                        <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-semibold rounded">
                            💰 Melhor Custo-Benefício
                        </span>
                    )}
                    {product.badges?.includes('gamer') && (
                        <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[9px] font-semibold rounded">
                            🎮 Melhor para Games
                        </span>
                    )}
                    {/* Attention badges (Blemishing) */}
                    {product.badges?.includes('attention-battery') && (
                        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-semibold rounded">
                            ⚠️ Bateria Média
                        </span>
                    )}
                    {product.badges?.includes('attention-support') && (
                        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-semibold rounded">
                            ⚠️ Pós-Venda Fraco
                        </span>
                    )}
                </div>

                {/* Dual Score Display */}
                {matchResult ? (
                    <DualScoreDisplay
                        editorialScore={product.scores?.quality ?? 0}
                        matchScore={matchResult.matchScore}
                        matchResult={matchResult}
                        compact
                        className="mt-1"
                    />
                ) : (
                    <div className="flex items-center gap-2 mt-1">
                        <span className={cn(
                            'px-1.5 py-0.5 rounded text-[10px] font-bold',
                            (product.computed?.overall ?? 0) >= 8 ? 'bg-emerald-100 text-emerald-700' :
                                (product.computed?.overall ?? 0) >= 6 ? 'bg-amber-100 text-amber-700' :
                                    'bg-red-100 text-red-700'
                        )}>
                            {(product.computed?.overall ?? 0).toFixed(1)}
                        </span>
                        <span className="text-xs text-text-muted">Nota IE</span>
                    </div>
                )}
            </div>

            {/* Price & Actions */}
            <div className="flex items-center gap-3">
                <span className="font-data font-bold text-lg text-text-primary">
                    {formatPrice(product.price)}
                </span>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCompareToggle}
                    className={cn(
                        'px-3 py-2 rounded-lg text-xs font-semibold transition-colors',
                        selected
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                            : 'bg-gray-100 text-text-secondary hover:bg-brand-core/10 hover:text-brand-core'
                    )}
                >
                    {selected ? '✓ Adicionado' : '+ Comparar'}
                </motion.button>
            </div>
        </motion.div>
    );
}

// ============================================
// ANIMATED PRODUCT LIST
// ============================================

interface AnimatedProductListProps {
    products: ScoredProduct[];
    matchResults: Map<string, MatchResult>;
    hasMatchFilters: boolean;
    className?: string;
}

export function AnimatedProductList({
    products,
    matchResults,
    hasMatchFilters,
    className,
}: AnimatedProductListProps) {
    return (
        <motion.div layout className={cn('space-y-3', className)}>
            <AnimatePresence mode="popLayout">
                {products.map((product, index) => (
                    <AnimatedProductCard
                        key={product.id}
                        product={product}
                        matchResult={hasMatchFilters ? matchResults.get(product.id) : undefined}
                        index={index}
                    />
                ))}
            </AnimatePresence>
        </motion.div>
    );
}
