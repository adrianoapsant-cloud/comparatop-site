'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trophy, Medal, Check, X, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { L10N, formatPrice } from '@/lib/l10n';
import { getComparisonVerdict, getAttributeDifferences, type VerdictBadge, type AttributeDifference } from '@/lib/comparison';
import type { ScoredProduct, CategoryDefinition } from '@/types/category';
import { getBaseScore } from '@/lib/getBaseScore';

// ============================================
// ATTRIBUTE CONFIG
// ============================================

const TV_ATTRIBUTES = [
    { id: 'brightness', label: 'Brilho (nits)', higherIsBetter: true, unit: 'nits' },
    { id: 'responseTime', label: 'Tempo Resposta', higherIsBetter: false, unit: 'ms' },
    { id: 'hdmi21', label: 'HDMI 2.1', higherIsBetter: true },
    { id: 'hdmi21Ports', label: 'Portas HDMI 2.1', higherIsBetter: true },
    { id: 'dolbyVision', label: 'Dolby Vision', higherIsBetter: true },
    { id: 'hdr10Plus', label: 'HDR10+', higherIsBetter: true },
    { id: 'vrr', label: 'VRR', higherIsBetter: true },
    { id: 'allm', label: 'ALLM', higherIsBetter: true },
    { id: 'smartPlatform', label: 'Sistema', higherIsBetter: undefined },
    { id: 'speakers', label: 'Alto-falantes', higherIsBetter: undefined },
];

// ============================================
// BADGE COMPONENT
// ============================================

interface VerdictBadgeDisplayProps {
    badge: VerdictBadge;
    size?: 'sm' | 'md' | 'lg';
}

function VerdictBadgeDisplay({ badge, size = 'md' }: VerdictBadgeDisplayProps) {
    const colors = {
        gold: 'bg-amber-100 text-amber-800 border-amber-300',
        green: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        blue: 'bg-blue-100 text-blue-800 border-blue-300',
        purple: 'bg-purple-100 text-purple-800 border-purple-300',
    };

    const sizes = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-3 py-1',
        lg: 'text-base px-4 py-2',
    };

    return (
        <span className={cn(
            'inline-flex items-center gap-1.5 rounded-full border font-medium',
            colors[badge.color],
            sizes[size]
        )}>
            <span>{badge.icon}</span>
            <span>{badge.label}</span>
        </span>
    );
}

// ============================================
// DIFFERENCE CELL
// ============================================

interface DifferenceCellProps {
    value: string | number | boolean;
    isWinner: boolean;
    productId: string;
}

function DifferenceCell({ value, isWinner }: DifferenceCellProps) {
    const displayValue = typeof value === 'boolean'
        ? (value ? <Check size={16} className="text-emerald-600" /> : <X size={16} className="text-gray-400" />)
        : String(value);

    return (
        <td className={cn(
            'text-center py-3 px-3 transition-colors',
            isWinner ? 'bg-emerald-50' : 'bg-white'
        )}>
            <span className={cn(
                'text-data font-medium',
                isWinner ? 'text-emerald-700' : 'text-text-primary'
            )}>
                {displayValue}
            </span>
        </td>
    );
}

// ============================================
// MAIN COMPARISON TABLE COMPONENT
// ============================================

interface ComparisonTableProps {
    products: ScoredProduct[];
    category: CategoryDefinition;
}

/**
 * ComparisonTable - "Veredito Instantâneo" Protocol
 * 
 * 3-Layer Visual Hierarchy:
 * 1. Top Decision Layer (System 1) - Badges, Verdict, Winner highlight
 * 2. Smart Highlighting - Green cells for winners
 * 3. Progressive Disclosure - Show only differences toggle
 */
export function ComparisonTable({ products, category }: ComparisonTableProps) {
    const [showOnlyDifferences, setShowOnlyDifferences] = useState(true);
    const [showDetails, setShowDetails] = useState(false);

    if (products.length < 2) {
        return (
            <div className="text-center py-12">
                <p className="text-text-secondary">
                    {L10N.ui.selectAtLeast}
                </p>
            </div>
        );
    }

    // For 2-product comparison, use verdict engine
    // For 3+ products, rank by overall score
    const [productA, productB] = products;
    const verdict = getComparisonVerdict(productA, productB);

    // Rank all products by overall score
    const rankedProducts = [...products].sort((a, b) => getBaseScore(b) - getBaseScore(a));
    const winnerId = rankedProducts[0].id;

    // Get attribute differences (using first 2 for comparison)
    const attributeDiffs = getAttributeDifferences(productA, productB, TV_ATTRIBUTES);
    const significantDiffs = attributeDiffs.filter(d => d.isSignificant);
    const displayedDiffs = showOnlyDifferences ? significantDiffs : attributeDiffs;

    // Winner styling - winner is highest ranked
    const isWinner = (productId: string) => productId === winnerId;
    const getRank = (productId: string) => rankedProducts.findIndex(p => p.id === productId) + 1;

    // Dynamic grid classes based on product count
    const gridCols = {
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-3',
        4: 'grid-cols-2 md:grid-cols-4',
    }[Math.min(products.length, 4)] || 'grid-cols-2 md:grid-cols-4';

    return (
        <div className="space-y-6">
            {/* ============================================ */}
            {/* LAYER 1: TOP DECISION (SYSTEM 1) */}
            {/* ============================================ */}

            <div className={cn('grid gap-4', gridCols)}>
                {products.map((product) => {
                    // Use verdict badges for first 2 products, otherwise just show rank
                    const productVerdict = verdict.verdicts[product.id];
                    const winner = isWinner(product.id);
                    const rank = getRank(product.id);

                    return (
                        <Link
                            key={product.id}
                            href={`/produto/${product.id}`}
                            className={cn(
                                'p-4 rounded-xl border-2 transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer block',
                                winner
                                    ? 'bg-amber-50/50 border-amber-400 shadow-lg shadow-amber-100'
                                    : 'bg-white border-gray-200 hover:border-brand-core/50'
                            )}
                        >
                            {/* Winner Crown */}
                            {winner && (
                                <div className="flex items-center gap-2 mb-3 text-amber-600">
                                    <Trophy size={20} />
                                    <span className="font-body font-bold text-sm uppercase tracking-wide">
                                        {L10N.comparison.winner}
                                    </span>
                                </div>
                            )}

                            {/* Product Info */}
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 overflow-hidden">
                                    {product.imageUrl ? (
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-contain p-1"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                                            {(product.shortName || product.name).substring(0, 3)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-display font-semibold text-text-primary truncate">
                                        {product.shortName || product.name}
                                    </h3>
                                    {/* Amazon Compliance: No fixed prices - only badges and scores */}
                                </div>
                            </div>

                            {/* Badges - only for products with verdicts */}
                            {productVerdict?.badges && productVerdict.badges.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {productVerdict.badges.map((badge) => (
                                        <VerdictBadgeDisplay key={badge.id} badge={badge} size="md" />
                                    ))}
                                </div>
                            )}

                            {/* Rank indicator for 3rd+ products */}
                            {!productVerdict && rank > 0 && (
                                <div className="flex items-center gap-2 mb-4">
                                    <Medal size={16} className="text-gray-400" />
                                    <span className="text-sm text-text-muted">#{rank} no ranking</span>
                                </div>
                            )}

                            {/* Main Score */}
                            <div className={cn(
                                'p-3 rounded-lg text-center',
                                winner ? 'bg-amber-100' : 'bg-gray-100'
                            )}>
                                <p className="text-xs text-text-muted uppercase tracking-wide mb-1">
                                    {L10N.scores.overall.full}
                                </p>
                                <p className={cn(
                                    'text-data text-3xl font-bold',
                                    winner ? 'text-amber-700' : 'text-text-primary'
                                )}>
                                    {getBaseScore(product).toFixed(2)}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Verdict Summary */}
            <div className="p-5 bg-gradient-to-r from-brand-core/5 to-brand-core/10 rounded-xl border border-brand-core/20">
                <h3 className="font-display font-semibold text-text-primary mb-2">
                    {L10N.comparison.recommendation}
                </h3>
                <p className="text-text-secondary font-body leading-relaxed">
                    {verdict.summary}
                </p>
                <p className="text-sm text-text-muted mt-2 italic">
                    {verdict.keyDifference}
                </p>
            </div>

            {/* ============================================ */}
            {/* ANÁLISE POR CRITÉRIO - Editorial Scores Table */}
            {/* ============================================ */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-display font-semibold text-text-primary uppercase tracking-wide text-sm">
                        Análise por Critério
                    </h3>
                </div>

                <div className="divide-y divide-gray-100 min-w-max">
                    {category.criteria.map((criterion) => {
                        // Get scores for all products
                        const allScores = products.map(p => p.scores[criterion.id] ?? 0);
                        const maxScore = Math.max(...allScores);

                        // Color based on group
                        const groupColor = {
                            'QS': 'bg-violet-500',
                            'VS': 'bg-emerald-500',
                            'GS': 'bg-amber-500',
                        }[criterion.group] || 'bg-gray-500';

                        return (
                            <div
                                key={criterion.id}
                                className="flex items-center hover:bg-gray-50 transition-colors"
                                style={{ display: 'grid', gridTemplateColumns: `1fr repeat(${products.length}, minmax(100px, 150px))` }}
                            >
                                {/* Criterion Label */}
                                <div className="p-4 flex items-center gap-3">
                                    <span className={cn('w-2 h-2 rounded-full flex-shrink-0', groupColor)} />
                                    <span className="font-body text-sm text-text-secondary">
                                        {criterion.label}
                                    </span>
                                </div>

                                {/* Score columns for each product */}
                                {products.map((product, idx) => {
                                    const score = allScores[idx];
                                    const isWinner = score === maxScore && allScores.filter(s => s === maxScore).length === 1;
                                    const reason = product.scoreReasons?.[criterion.id];
                                    // Fallback message when no specific reason
                                    const displayReason = reason || `Nota ${score.toFixed(1)}/10 baseada na análise técnica do ${criterion.label.toLowerCase()} deste produto.`;

                                    return (
                                        <div
                                            key={product.id}
                                            className={cn(
                                                'p-4 text-center relative group',
                                                isWinner ? 'bg-amber-50' : ''
                                            )}
                                        >
                                            <span className="text-data font-semibold text-text-primary">
                                                {score.toFixed(1)}
                                            </span>
                                            {isWinner && (
                                                <span className="ml-1 text-amber-500">★</span>
                                            )}
                                            {/* Always show info icon with tooltip */}
                                            <span className="ml-1.5 text-xs text-text-muted cursor-help">ⓘ</span>
                                            {/* Tooltip */}
                                            <div className="hidden group-hover:block absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-white rounded-lg shadow-xl border border-gray-200 text-left">
                                                <p className="text-xs font-semibold text-text-primary mb-1">
                                                    Justificativa ({product.shortName || product.name})
                                                </p>
                                                <p className="text-xs text-text-secondary leading-relaxed">
                                                    {displayReason}
                                                </p>
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-gray-200 rotate-45 -mt-1" />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}

                    {/* Price Row - Amazon Compliance: No fixed prices, link to check price */}
                    <div
                        className="flex items-center bg-gray-50"
                        style={{ display: 'grid', gridTemplateColumns: `1fr repeat(${products.length}, minmax(100px, 150px))` }}
                    >
                        <div className="p-4">
                            <span className="font-body font-semibold text-text-primary">
                                Preço
                            </span>
                        </div>
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="p-4 text-center"
                            >
                                <Link
                                    href={`/produto/${product.id}`}
                                    className="text-xs font-medium text-amber-600 hover:text-amber-700 flex items-center justify-center gap-1"
                                >
                                    Verificar Preço →
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ============================================ */}
            {/* LAYER 2 & 3: SMART HIGHLIGHTING + PROGRESSIVE DISCLOSURE */}
            {/* ============================================ */}

            {/* Toggle Controls */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                    {showDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    <span>{showDetails ? 'Ocultar Detalhes' : 'Ver Detalhes Técnicos'}</span>
                </button>

                {showDetails && (
                    <button
                        onClick={() => setShowOnlyDifferences(!showOnlyDifferences)}
                        className={cn(
                            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all',
                            showOnlyDifferences
                                ? 'bg-brand-core text-white'
                                : 'bg-gray-100 text-text-secondary'
                        )}
                    >
                        {showOnlyDifferences ? <Eye size={16} /> : <EyeOff size={16} />}
                        <span>Mostrar apenas diferenças</span>
                    </button>
                )}
            </div>

            {/* Detailed Comparison Table */}
            {showDetails && (
                <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                    <table className="w-full min-w-[500px]">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="text-left py-3 px-3 text-sm font-body font-medium text-text-muted w-1/3">
                                    Atributo
                                </th>
                                <th className={cn(
                                    'text-center py-3 px-3 text-sm font-body font-semibold',
                                    isWinner(productA.id) ? 'text-amber-700' : 'text-text-primary'
                                )}>
                                    {productA.shortName || productA.name}
                                </th>
                                <th className={cn(
                                    'text-center py-3 px-3 text-sm font-body font-semibold',
                                    isWinner(productB.id) ? 'text-amber-700' : 'text-text-primary'
                                )}>
                                    {productB.shortName || productB.name}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Price Row - Amazon Compliance: Link to check prices */}
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <td className="py-3 px-3 font-body font-medium text-text-primary">
                                    Preço
                                </td>
                                <td className="text-center py-3 px-3">
                                    <Link
                                        href={`/produto/${productA.id}`}
                                        className="text-xs font-medium text-amber-600 hover:text-amber-700"
                                    >
                                        Verificar Preço
                                    </Link>
                                </td>
                                <td className="text-center py-3 px-3">
                                    <Link
                                        href={`/produto/${productB.id}`}
                                        className="text-xs font-medium text-amber-600 hover:text-amber-700"
                                    >
                                        Verificar Preço
                                    </Link>
                                </td>
                            </tr>

                            {/* Score Rows */}
                            {['qs', 'vs', 'gs'].map((scoreKey) => {
                                const scoreA = productA.computed[scoreKey as keyof typeof productA.computed] as number;
                                const scoreB = productB.computed[scoreKey as keyof typeof productB.computed] as number;
                                const label = scoreKey === 'qs'
                                    ? L10N.scores.qs.short
                                    : scoreKey === 'vs'
                                        ? L10N.scores.vs.short
                                        : L10N.scores.gs.short;

                                return (
                                    <tr key={scoreKey} className="border-b border-gray-100">
                                        <td className="py-3 px-3 font-body text-text-secondary">
                                            {label}
                                        </td>
                                        <DifferenceCell
                                            value={scoreA.toFixed(1)}
                                            isWinner={scoreA > scoreB}
                                            productId={productA.id}
                                        />
                                        <DifferenceCell
                                            value={scoreB.toFixed(1)}
                                            isWinner={scoreB > scoreA}
                                            productId={productB.id}
                                        />
                                    </tr>
                                );
                            })}

                            {/* Attribute Rows (from differences) */}
                            {displayedDiffs.map((diff) => (
                                <tr key={diff.id} className="border-b border-gray-100">
                                    <td className="py-3 px-3 font-body text-text-secondary">
                                        {diff.label}
                                    </td>
                                    <DifferenceCell
                                        value={diff.valueA ?? '-'}
                                        isWinner={diff.winnerId === productA.id}
                                        productId={productA.id}
                                    />
                                    <DifferenceCell
                                        value={diff.valueB ?? '-'}
                                        isWinner={diff.winnerId === productB.id}
                                        productId={productB.id}
                                    />
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Difference count indicator */}
                    {showOnlyDifferences && attributeDiffs.length > significantDiffs.length && (
                        <p className="text-xs text-text-muted text-center mt-3">
                            {attributeDiffs.length - significantDiffs.length} atributos idênticos ocultos
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
