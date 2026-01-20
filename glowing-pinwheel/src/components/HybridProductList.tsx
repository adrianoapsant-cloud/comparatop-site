'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useComparison } from '@/contexts/ComparisonContext';
import { MatchScoreOverlay, DualScoreDisplay } from '@/components/MatchDonutChart';
import type { ScoredProduct } from '@/types/category';
import type { MatchResult } from '@/core/match/types';

// ============================================
// HYBRID LIST VIEW - PLP OPTIMIZED
// Desktop: 30% image, 70% specs (horizontal)
// Mobile: Single column stacked cards
// ============================================

interface HybridProductCardProps {
    product: ScoredProduct;
    matchResult?: MatchResult;
    index: number;
}

export function HybridProductCard({
    product,
    matchResult,
    index,
}: HybridProductCardProps) {
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

    // Extract key specs from product data for display
    const keySpecs = extractKeySpecs(product);

    return (
        <motion.article
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
                // Mobile: stacked layout
                'flex flex-col',
                // Desktop: horizontal hybrid layout (30% img / 70% content)
                'md:flex-row md:items-stretch',
                'bg-white rounded-xl border border-gray-100',
                'hover:border-brand-core/30 hover:shadow-lg',
                'transition-all duration-200',
                'overflow-hidden'
            )}
        >
            {/* ============================================ */}
            {/* IMAGE SECTION - 30% on desktop */}
            {/* ============================================ */}
            <Link
                href={`/produto/${product.id}`}
                className={cn(
                    'relative flex-shrink-0',
                    // Mobile: full width, aspect ratio maintained
                    'w-full aspect-[4/3]',
                    // Desktop: 30% width, minimum 200px
                    'md:w-[30%] md:min-w-[200px] md:aspect-auto',
                    'bg-gradient-to-br from-gray-50 to-gray-100',
                    'group'
                )}
            >
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        {product.shortName?.substring(0, 3)}
                    </div>
                )}

                {/* Match Score Overlay */}
                {matchResult && (
                    <MatchScoreOverlay
                        result={matchResult}
                        position="top-right"
                        className="absolute top-2 right-2"
                    />
                )}

                {/* Rank Badge for matched results */}
                {matchResult && index < 3 && (
                    <div className={cn(
                        'absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center',
                        'font-bold text-sm shadow-md',
                        index === 0 ? 'bg-amber-400 text-amber-900' :
                            index === 1 ? 'bg-gray-300 text-gray-700' :
                                'bg-orange-300 text-orange-800'
                    )}>
                        {index + 1}º
                    </div>
                )}
            </Link>

            {/* ============================================ */}
            {/* CONTENT SECTION - 70% on desktop */}
            {/* ============================================ */}
            <div className={cn(
                'flex-1 p-4',
                // Desktop: more padding, flex column for vertical distribution
                'md:p-5 md:flex md:flex-col'
            )}>
                {/* Header: Brand + Name */}
                <div className="mb-3">
                    <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                        {product.brand}
                    </span>
                    <Link href={`/produto/${product.id}`}>
                        <h3 className="font-display font-semibold text-base md:text-lg text-text-primary hover:text-brand-core transition-colors line-clamp-2">
                            {product.shortName || product.name}
                        </h3>
                    </Link>
                </div>

                {/* ============================================ */}
                {/* KEY SPECS GRID - The "70% specs" content */}
                {/* ============================================ */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3 flex-1">
                    {keySpecs.map((spec, i) => (
                        <div
                            key={i}
                            className="px-2 py-1.5 bg-gray-50 rounded-lg"
                        >
                            <span className="text-[10px] text-text-muted block">{spec.label}</span>
                            <span className="text-xs font-semibold text-text-primary">{spec.value}</span>
                        </div>
                    ))}
                </div>

                {/* Badges Row */}
                <div className="flex flex-wrap gap-1 mb-3">
                    {product.badges?.includes('premium-pick') && (
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-semibold rounded">
                            ⭐ Premium Pick
                        </span>
                    )}
                    {product.badges?.includes('best-value') && (
                        <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-semibold rounded">
                            💰 Custo-Benefício
                        </span>
                    )}
                    {product.badges?.includes('gamer') && (
                        <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[9px] font-semibold rounded">
                            🎮 Melhor p/ Games
                        </span>
                    )}
                </div>

                {/* Score + CTA Row */}
                <div className="flex items-center justify-between gap-3 mt-auto pt-3 border-t border-gray-100">
                    {/* Score Display */}
                    {matchResult ? (
                        <DualScoreDisplay
                            editorialScore={product.scores?.quality ?? 0}
                            matchScore={matchResult.matchScore}
                            matchResult={matchResult}
                            compact
                        />
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className={cn(
                                'px-2 py-1 rounded-lg text-sm font-bold',
                                (product.computed?.overall ?? 0) >= 8 ? 'bg-emerald-100 text-emerald-700' :
                                    (product.computed?.overall ?? 0) >= 6 ? 'bg-amber-100 text-amber-700' :
                                        'bg-red-100 text-red-700'
                            )}>
                                {(product.computed?.overall ?? 0).toFixed(1)}
                            </span>
                            <span className="text-xs text-text-muted">Nota IE</span>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/produto/${product.id}`}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition-colors"
                        >
                            Conferir Preço Atual
                        </Link>
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
                            {selected ? '✓' : '+'}
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.article>
    );
}

// ============================================
// HYBRID PRODUCT LIST
// ============================================

interface HybridProductListProps {
    products: ScoredProduct[];
    matchResults: Map<string, MatchResult>;
    hasMatchFilters: boolean;
    className?: string;
}

export function HybridProductList({
    products,
    matchResults,
    hasMatchFilters,
    className,
}: HybridProductListProps) {
    return (
        <motion.div layout className={cn('space-y-4', className)}>
            <AnimatePresence mode="popLayout">
                {products.map((product, index) => (
                    <HybridProductCard
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

// ============================================
// HELPER: Extract key specs from product
// ============================================

interface KeySpec {
    label: string;
    value: string;
}

function extractKeySpecs(product: ScoredProduct): KeySpec[] {
    const specs: KeySpec[] = [];
    const data = product.specs || {};

    // Common specs by category
    const categorySpecs: Record<string, { key: string; label: string }[]> = {
        tv: [
            { key: 'screenSize', label: 'Tela' },
            { key: 'resolution', label: 'Resolução' },
            { key: 'panelType', label: 'Painel' },
            { key: 'refreshRate', label: 'Taxa Hz' },
        ],
        fridge: [
            { key: 'capacity', label: 'Capacidade' },
            { key: 'doorType', label: 'Portas' },
            { key: 'frostFree', label: 'Frost Free' },
            { key: 'energyClass', label: 'Energia' },
        ],
        air_conditioner: [
            { key: 'btus', label: 'BTUs' },
            { key: 'type', label: 'Tipo' },
            { key: 'inverter', label: 'Inverter' },
            { key: 'energyClass', label: 'Energia' },
        ],
        washer: [
            { key: 'capacity', label: 'Capacidade' },
            { key: 'type', label: 'Tipo' },
            { key: 'rpm', label: 'Rotação' },
            { key: 'energyClass', label: 'Energia' },
        ],
        smartphone: [
            { key: 'screenSize', label: 'Tela' },
            { key: 'storage', label: 'Armazen.' },
            { key: 'ram', label: 'RAM' },
            { key: 'battery', label: 'Bateria' },
        ],
        notebook: [
            { key: 'processor', label: 'Processador' },
            { key: 'ram', label: 'RAM' },
            { key: 'storage', label: 'SSD' },
            { key: 'screenSize', label: 'Tela' },
        ],
    };

    const catSpecs = categorySpecs[product.categoryId] || [];

    for (const { key, label } of catSpecs) {
        const value = data[key];
        if (value !== undefined && value !== null && value !== '') {
            specs.push({
                label,
                value: formatSpecValue(value),
            });
        }
    }

    // If no category-specific specs, show generic ones
    if (specs.length === 0) {
        // Try to extract from scores
        if (product.computed?.overall) {
            specs.push({ label: 'Nota Geral', value: product.computed.overall.toFixed(1) });
        }
        if (product.computed?.vs) {
            specs.push({ label: 'Custo-Benef.', value: product.computed.vs.toFixed(1) });
        }
    }

    // Limit to 6 specs max
    return specs.slice(0, 6);
}

function formatSpecValue(value: unknown): string {
    if (typeof value === 'boolean') {
        return value ? 'Sim' : 'Não';
    }
    if (typeof value === 'number') {
        return value.toLocaleString('pt-BR');
    }
    return String(value);
}
