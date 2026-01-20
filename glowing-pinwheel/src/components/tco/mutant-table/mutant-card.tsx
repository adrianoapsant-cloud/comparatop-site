'use client';

// ============================================================================
// MUTANT CARD - Mobile-optimized product card
// ============================================================================
// Renders the same data as a table row, but stacked vertically
// Used in the MutantTable's mobile view (block md:hidden)
// ============================================================================

import Link from 'next/link';
import { ExternalLink, ChevronRight, Zap, Award, Leaf, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductTcoData, UsagePersona } from '@/types/tco';
import { calculateTotalTco, formatBRL } from '@/lib/tco';
import { RiskShieldCompact } from '../risk-shield';
import { SmartAlertButton } from '../smart-alert-button';

// ============================================
// TYPES
// ============================================

interface MutantCardProps {
    /** Product data */
    product: ProductTcoData;
    /** Current persona for TCO calculation */
    persona: UsagePersona;
    /** Number of years for TCO */
    years?: number;
    /** Callback when details are requested */
    onViewDetails?: (productId: string) => void;
    /** Additional class names */
    className?: string;
}

// ============================================
// FEATURE BADGES
// ============================================

interface FeatureBadgeProps {
    show: boolean;
    icon: React.ReactNode;
    label: string;
    color: string;
}

function FeatureBadge({ show, icon, label, color }: FeatureBadgeProps) {
    if (!show) return null;

    return (
        <span className={cn(
            'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-medium',
            color
        )}>
            {icon}
            <span className="sr-only sm:not-sr-only">{label}</span>
        </span>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * MutantCard - Mobile-optimized product card for the MutantTable
 * 
 * Layout:
 * - Header: Name + RiskShield (compact)
 * - Body: Price vs TCO side-by-side grid
 * - Footer: Action button
 * 
 * @example
 * ```tsx
 * <MutantCard 
 *   product={product} 
 *   persona="gamer"
 *   onViewDetails={(id) => router.push(`/produto/${id}`)}
 * />
 * ```
 */
export function MutantCard({
    product,
    persona,
    years = 5,
    onViewDetails,
    className,
}: MutantCardProps) {
    // Calculate TCO
    const tco = calculateTotalTco(product, { years, persona, includeResale: true });

    // Determine efficiency color
    const deltaPercent = tco.priceVsTcoPercent;
    const efficiencyColor = deltaPercent <= 30
        ? 'text-emerald-600'
        : deltaPercent <= 60
            ? 'text-amber-600'
            : 'text-red-600';

    return (
        <div className={cn(
            'bg-white rounded-2xl border border-gray-200',
            'shadow-sm hover:shadow-md transition-shadow',
            'overflow-hidden',
            className
        )}>
            {/* Header: Name + Brand + Risk */}
            <div className="flex items-start justify-between gap-3 p-4 border-b border-gray-100">
                <div className="flex-1 min-w-0">
                    {/* Brand */}
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {product.brand}
                    </p>

                    {/* Name - Clickable Link */}
                    <Link
                        href={`/produto/${product.id}`}
                        className="font-semibold text-gray-900 truncate hover:text-blue-600 hover:underline transition-colors"
                    >
                        {product.name}
                    </Link>

                    {/* Feature badges */}
                    <div className="flex flex-wrap gap-1 mt-2">
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

                {/* Risk Shield */}
                <RiskShieldCompact
                    score={product.scrsScore}
                    brandName={product.brand}
                />
            </div>

            {/* Body: Price vs TCO Grid */}
            <div className="grid grid-cols-2 divide-x divide-gray-100">
                {/* Price Column */}
                <div className="p-4 text-center">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preço
                    </p>
                    <p className="text-xl font-bold text-gray-900 mt-1">
                        {formatBRL(product.price)}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        na loja
                    </p>
                </div>

                {/* TCO Column */}
                <div className="p-4 text-center bg-gray-50">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        TCO {years}a
                    </p>
                    <p className={cn('text-xl font-bold mt-1', efficiencyColor)}>
                        {formatBRL(tco.totalTco)}
                    </p>
                    <p className={cn('text-xs mt-0.5', efficiencyColor)}>
                        +{deltaPercent.toFixed(0)}% vs preço
                    </p>
                </div>
            </div>

            {/* Footer: Actions */}
            <div className="p-3 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center gap-2">
                    {/* Smart Alert Button */}
                    <SmartAlertButton
                        productSku={product.id}
                        productName={product.name}
                        currentPrice={product.price}
                        currentTco={tco.totalTco}
                        size="default"
                        className="flex-shrink-0"
                    />

                    {/* Details Link */}
                    <Link
                        href={`/produto/${product.id}`}
                        className={cn(
                            'flex-1 flex items-center justify-center gap-2',
                            'px-4 py-2.5 rounded-xl',
                            'bg-gradient-to-r from-blue-500 to-indigo-500',
                            'text-white font-medium text-sm',
                            'hover:brightness-110 active:scale-[0.98]',
                            'transition-all duration-200',
                            'shadow-sm hover:shadow-md'
                        )}
                    >
                        Ver Detalhes
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

// ============================================
// EXPORTS
// ============================================

export default MutantCard;
