'use client';

// ============================================================================
// MUTANT TABLE - Column Definitions
// ============================================================================
// TanStack Table v8 column definitions for ProductTcoData
// Includes custom cell renderers for each column type
// ============================================================================

import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { ArrowUpDown, ExternalLink, Zap, Leaf, Users, Award, Eye, Star, Shield, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductTcoData, UsagePersona } from '@/types/tco';
import type { ScoreViewMode } from '@/hooks/use-url-state';
import { calculateTotalTco, formatBRL } from '@/lib/tco';
import { RiskShield } from '../risk-shield';
import { Tooltip } from '@/components/ui/Tooltip';
import { SmartAlertButton } from '../smart-alert-button';

// ============================================
// TYPES
// ============================================

export interface ColumnConfig {
    persona: UsagePersona;
    years: number;
    scoreView?: ScoreViewMode;
    onViewDetails?: (productId: string) => void;
}

// ============================================
// CELL COMPONENTS
// ============================================

// Feature Badge Component
function FeatureBadge({
    show,
    icon,
    label,
    color
}: {
    show: boolean;
    icon: React.ReactNode;
    label: string;
    color: string;
}) {
    if (!show) return null;

    return (
        <span
            className={cn(
                'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium',
                color
            )}
            title={label}
        >
            {icon}
        </span>
    );
}

// Product Cell - Name + Brand + Features
function ProductCell({ product }: { product: ProductTcoData }) {
    // Use product.id as slug for the product page
    const productSlug = product.id;

    return (
        <div className="flex flex-col gap-1 py-1">
            {/* Brand */}
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {product.brand}
            </span>

            {/* Name - Clickable Link */}
            <Link
                href={`/produto/${productSlug}`}
                className="font-medium text-gray-900 hover:text-blue-600 hover:underline transition-colors"
            >
                {product.name}
            </Link>

            {/* Feature badges */}
            <div className="flex gap-1 mt-0.5">
                <FeatureBadge
                    show={product.features.gaming}
                    icon={<Zap className="w-3 h-3" />}
                    label="Gaming"
                    color="bg-violet-100 text-violet-700"
                />
                <FeatureBadge
                    show={product.features.energyEfficient}
                    icon={<Leaf className="w-3 h-3" />}
                    label="Eco"
                    color="bg-emerald-100 text-emerald-700"
                />
                <FeatureBadge
                    show={product.features.familyFriendly}
                    icon={<Users className="w-3 h-3" />}
                    label="Família"
                    color="bg-blue-100 text-blue-700"
                />
                <FeatureBadge
                    show={product.features.premiumBrand}
                    icon={<Award className="w-3 h-3" />}
                    label="Premium"
                    color="bg-amber-100 text-amber-700"
                />
            </div>
        </div>
    );
}

// Price Cell - Capex value
function PriceCell({ price }: { price: number }) {
    return (
        <div className="text-right">
            <span className="font-semibold text-gray-900">
                {formatBRL(price)}
            </span>
        </div>
    );
}

// TCO Cell - Calculated value with semantic coloring
function TcoCell({
    product,
    persona,
    years
}: {
    product: ProductTcoData;
    persona: UsagePersona;
    years: number;
}) {
    const tco = calculateTotalTco(product, { years, persona });
    const deltaPercent = tco.priceVsTcoPercent;

    // Semantic colors based on efficiency
    const colorClass = deltaPercent <= 30
        ? 'text-emerald-600'
        : deltaPercent <= 60
            ? 'text-amber-600'
            : 'text-red-600';

    const bgClass = deltaPercent <= 30
        ? 'bg-emerald-50'
        : deltaPercent <= 60
            ? 'bg-amber-50'
            : 'bg-red-50';

    return (
        <div className="text-right space-y-1">
            <span className={cn('font-semibold', colorClass)}>
                {formatBRL(tco.totalTco)}
            </span>
            <span className={cn(
                'block text-xs font-medium px-1.5 py-0.5 rounded-md w-fit ml-auto',
                bgClass, colorClass
            )}>
                +{deltaPercent.toFixed(0)}%
            </span>
        </div>
    );
}

// Score Cell - Dynamic rendering based on scoreView
function ScoreCell({
    product,
    scoreView,
}: {
    product: ProductTcoData;
    scoreView: ScoreViewMode;
}) {
    // Community View: Yellow stars (0-5) + review count
    if (scoreView === 'community') {
        const rating = product.communityRating ?? 4.0;
        const reviews = product.communityReviews ?? 0;
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        // Format review count (e.g., 12345 -> "12k")
        const formatReviews = (count: number) => {
            if (count >= 1000) {
                return `(${(count / 1000).toFixed(1).replace('.0', '')}k)`;
            }
            return `(${count})`;
        };

        return (
            <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={cn(
                                'w-4 h-4',
                                i < fullStars
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : i === fullStars && hasHalfStar
                                        ? 'fill-yellow-400/50 text-yellow-400'
                                        : 'text-gray-300'
                            )}
                        />
                    ))}
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-gray-900">{rating.toFixed(1)}</span>
                    <span className="text-xs text-gray-500">{formatReviews(reviews)}</span>
                </div>
            </div>
        );
    }

    // Technical View: Hexagonal badge (0-10) with semantic color
    const score = product.technicalScore ?? product.editorialScore ?? 7.0;

    // Semantic colors
    const getScoreColor = (s: number) => {
        if (s >= 8.5) return { bg: 'bg-emerald-500', text: 'text-white', label: 'Excelente' };
        if (s >= 7.0) return { bg: 'bg-blue-500', text: 'text-white', label: 'Bom' };
        if (s >= 5.5) return { bg: 'bg-amber-500', text: 'text-white', label: 'Regular' };
        return { bg: 'bg-red-500', text: 'text-white', label: 'Atenção' };
    };

    const colors = getScoreColor(score);

    return (
        <Tooltip
            content={
                <div className="space-y-2">
                    <p className="font-semibold">Nota Técnica ComparaTop</p>
                    <p className="text-gray-300">
                        Auditoria baseada em durabilidade, custos ocultos e vícios conhecidos.
                        Não considera reviews de unboxing.
                    </p>
                </div>
            }
            position="top"
        >
            <div className="flex flex-col items-center gap-1 cursor-help">
                {/* Hexagonal Badge */}
                <div className={cn(
                    'relative w-12 h-12 flex items-center justify-center',
                    'clip-hexagon',
                    colors.bg
                )}
                    style={{
                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    }}
                >
                    <span className={cn('text-lg font-bold', colors.text)}>
                        {score.toFixed(1)}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-blue-500" />
                    <span className="text-xs font-medium text-gray-600">{colors.label}</span>
                </div>
            </div>
        </Tooltip>
    );
}

// ============================================
// COLUMN FACTORY
// ============================================

/**
 * Creates column definitions with dynamic config
 * 
 * @param config Column configuration (persona, years, callbacks)
 * @returns TanStack Table column definitions
 */
export function createColumns(config: ColumnConfig): ColumnDef<ProductTcoData>[] {
    const { persona, years, scoreView = 'community', onViewDetails } = config;

    return [
        // Column: Product
        {
            id: 'product',
            accessorKey: 'name',
            header: ({ column }) => (
                <button
                    className="flex items-center gap-1 font-semibold text-gray-700 hover:text-gray-900"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Produto
                    <ArrowUpDown className="w-4 h-4 text-gray-400" />
                </button>
            ),
            cell: ({ row }) => <ProductCell product={row.original} />,
            enableSorting: true,
            enableGlobalFilter: true,
        },

        // Column: Score (Community Stars or Technical Badge)
        {
            id: 'score',
            accessorFn: (row) => scoreView === 'community'
                ? (row.communityRating ?? 4.0)
                : (row.technicalScore ?? row.editorialScore ?? 7.0),
            header: ({ column }) => (
                <button
                    className="flex items-center gap-1 font-semibold text-gray-700 hover:text-gray-900"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    {scoreView === 'community' ? (
                        <>
                            <Star className="w-4 h-4 text-yellow-500" />
                            Nota
                        </>
                    ) : (
                        <>
                            <Shield className="w-4 h-4 text-blue-500" />
                            Auditoria
                        </>
                    )}
                    <ArrowUpDown className="w-4 h-4 text-gray-400" />
                </button>
            ),
            cell: ({ row }) => (
                <ScoreCell
                    product={row.original}
                    scoreView={scoreView}
                />
            ),
            enableSorting: true,
        },

        // Column: Price (Capex)
        {
            id: 'price',
            accessorKey: 'price',
            header: ({ column }) => (
                <button
                    className="flex items-center gap-1 font-semibold text-gray-700 hover:text-gray-900 ml-auto"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Preço
                    <ArrowUpDown className="w-4 h-4 text-gray-400" />
                </button>
            ),
            cell: ({ row }) => <PriceCell price={row.original.price} />,
            enableSorting: true,
        },

        // Column: TCO (calculated)
        {
            id: 'tco',
            accessorFn: (row) => {
                const tco = calculateTotalTco(row, { years, persona });
                return tco.totalTco;
            },
            header: ({ column }) => (
                <button
                    className="flex items-center gap-1 font-semibold text-gray-700 hover:text-gray-900 ml-auto"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    TCO {years}a
                    <ArrowUpDown className="w-4 h-4 text-gray-400" />
                </button>
            ),
            cell: ({ row }) => (
                <TcoCell
                    product={row.original}
                    persona={persona}
                    years={years}
                />
            ),
            enableSorting: true,
        },

        // Column: Risk (SCRS)
        {
            id: 'risk',
            accessorKey: 'scrsScore',
            header: ({ column }) => (
                <button
                    className="flex items-center gap-1 font-semibold text-gray-700 hover:text-gray-900"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Risco
                    <ArrowUpDown className="w-4 h-4 text-gray-400" />
                </button>
            ),
            cell: ({ row }) => (
                <RiskShield
                    score={row.original.scrsScore}
                    brandName={row.original.brand}
                    size="sm"
                    showLabel={false}
                />
            ),
            enableSorting: true,
        },

        // Column: Actions
        {
            id: 'actions',
            header: () => <span className="sr-only">Ações</span>,
            cell: ({ row }) => {
                const product = row.original;
                const tco = calculateTotalTco(product, { years, persona });
                const productSlug = product.id;

                return (
                    <div className="flex items-center gap-2">
                        {/* Smart Alert Button */}
                        <SmartAlertButton
                            productSku={product.id}
                            productName={product.name}
                            currentPrice={product.price}
                            currentTco={tco.totalTco}
                            size="icon"
                        />

                        {/* Details Link */}
                        <Link
                            href={`/produto/${productSlug}`}
                            className={cn(
                                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg',
                                'bg-gray-100 hover:bg-blue-100 hover:text-blue-700',
                                'text-sm font-medium text-gray-700',
                                'transition-colors'
                            )}
                        >
                            <Eye className="w-4 h-4" />
                            <span className="hidden lg:inline">Detalhes</span>
                        </Link>
                    </div>
                );
            },
            enableSorting: false,
        },
    ];
}

// ============================================
// EXPORTS
// ============================================

export { ProductCell, PriceCell, TcoCell, ScoreCell };
