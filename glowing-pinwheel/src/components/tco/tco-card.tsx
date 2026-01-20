'use client';

// ============================================================================
// TCO CARD - Compact TCO Summary Card
// ============================================================================
// Simple mobile-friendly card showing total TCO with delta comparison
// Uses semantic colors for the delta indicator
// ============================================================================

import { TrendingUp, TrendingDown, Minus, AlertTriangle, Sparkles } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { ProductTcoData, UsagePersona } from '@/types/tco';
import { calculateTotalTco, formatBRL } from '@/lib/tco';

// ============================================
// CVA VARIANTS
// ============================================

const tcoCardVariants = cva(
    // Base styles
    [
        'relative overflow-hidden',
        'rounded-2xl border',
        'transition-all duration-200',
    ],
    {
        variants: {
            /** Efficiency rating based on TCO delta */
            efficiency: {
                excellent: 'bg-emerald-50 border-emerald-200',
                good: 'bg-blue-50 border-blue-200',
                moderate: 'bg-amber-50 border-amber-200',
                poor: 'bg-red-50 border-red-200',
            },
            /** Size variant */
            size: {
                sm: 'p-3',
                md: 'p-4',
                lg: 'p-5',
            },
            /** Interactive state */
            interactive: {
                true: 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer',
                false: '',
            },
        },
        defaultVariants: {
            efficiency: 'moderate',
            size: 'md',
            interactive: false,
        },
    }
);

// ============================================
// TYPES
// ============================================

interface TcoCardProps extends VariantProps<typeof tcoCardVariants> {
    /** Product data */
    product: ProductTcoData;
    /** Current persona */
    persona: UsagePersona;
    /** Number of years */
    years?: number;
    /** Additional class names */
    className?: string;
    /** Show breakdown details */
    showBreakdown?: boolean;
    /** Callback on click */
    onClick?: () => void;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

type EfficiencyLevel = 'excellent' | 'good' | 'moderate' | 'poor';

interface EfficiencyConfig {
    level: EfficiencyLevel;
    label: string;
    icon: React.ReactNode;
    deltaColor: string;
}

function getEfficiencyConfig(deltaPercent: number): EfficiencyConfig {
    if (deltaPercent <= 20) {
        return {
            level: 'excellent',
            label: 'Muito Eficiente',
            icon: <Sparkles className="w-4 h-4 text-emerald-500" />,
            deltaColor: 'text-emerald-600',
        };
    }

    if (deltaPercent <= 40) {
        return {
            level: 'good',
            label: 'Eficiente',
            icon: <TrendingDown className="w-4 h-4 text-blue-500" />,
            deltaColor: 'text-blue-600',
        };
    }

    if (deltaPercent <= 70) {
        return {
            level: 'moderate',
            label: 'Moderado',
            icon: <Minus className="w-4 h-4 text-amber-500" />,
            deltaColor: 'text-amber-600',
        };
    }

    return {
        level: 'poor',
        label: 'Alto Custo Oculto',
        icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
        deltaColor: 'text-red-600',
    };
}

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * TcoCard - Compact card showing TCO summary with delta
 * 
 * Uses semantic colors based on efficiency:
 * - Excellent (≤20%): Green - Very efficient
 * - Good (21-40%): Blue - Efficient
 * - Moderate (41-70%): Amber - Average
 * - Poor (>70%): Red - High hidden costs
 * 
 * @example
 * ```tsx
 * <TcoCard product={product} persona="gamer" years={5} />
 * <TcoCard product={product} persona="eco" showBreakdown />
 * ```
 */
export function TcoCard({
    product,
    persona,
    years = 5,
    size,
    interactive,
    className,
    showBreakdown = false,
    onClick,
}: TcoCardProps) {
    // Calculate TCO
    const tco = calculateTotalTco(product, { years, persona });
    const config = getEfficiencyConfig(tco.priceVsTcoPercent);

    return (
        <div
            onClick={onClick}
            className={cn(
                tcoCardVariants({ efficiency: config.level, size, interactive: !!onClick }),
                className
            )}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        TCO {years} Anos
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-0.5">
                        {formatBRL(tco.totalTco)}
                    </h3>
                </div>

                {/* Efficiency Badge */}
                <div className={cn(
                    'flex items-center gap-1.5 px-2 py-1 rounded-lg',
                    'bg-white/80 border',
                    config.level === 'excellent' && 'border-emerald-200',
                    config.level === 'good' && 'border-blue-200',
                    config.level === 'moderate' && 'border-amber-200',
                    config.level === 'poor' && 'border-red-200',
                )}>
                    {config.icon}
                    <span className="text-xs font-medium text-gray-700">
                        {config.label}
                    </span>
                </div>
            </div>

            {/* Delta Comparison */}
            <div className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-xl',
                'bg-white/60 border border-white/80'
            )}>
                <TrendingUp className={cn('w-4 h-4', config.deltaColor)} />
                <span className="text-sm text-gray-600">
                    vs Preço de Loja:
                </span>
                <span className={cn('text-sm font-bold', config.deltaColor)}>
                    +{tco.priceVsTcoPercent.toFixed(0)}%
                </span>
                <span className="text-sm text-gray-400">
                    (+{formatBRL(tco.priceVsTcoDelta)})
                </span>
            </div>

            {/* Monthly Cost */}
            <div className="mt-3 pt-3 border-t border-white/50">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                        Custo mensal:
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                        {formatBRL(tco.tcoPerMonth)}/mês
                    </span>
                </div>
            </div>

            {/* Breakdown (optional) */}
            {showBreakdown && (
                <div className="mt-3 pt-3 border-t border-white/50 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Preço</span>
                        <span className="font-medium text-gray-700">{formatBRL(tco.capex)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Energia ({years}a)</span>
                        <span className="font-medium text-amber-600">+{formatBRL(tco.totalEnergyCost)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Manutenção ({years}a)</span>
                        <span className="font-medium text-red-600">+{formatBRL(tco.totalMaintenanceCost)}</span>
                    </div>
                    {tco.resaleValue > 0 && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Revenda</span>
                            <span className="font-medium text-emerald-600">-{formatBRL(tco.resaleValue)}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Persona indicator */}
            <div className="mt-3 text-xs text-gray-400 text-right">
                Perfil: {persona === 'gamer' ? '🎮 Gamer' : persona === 'eco' ? '🌱 Eco' : '👨‍👩‍👧‍👦 Família'}
            </div>
        </div>
    );
}

// ============================================
// COMPACT VARIANT
// ============================================

/**
 * TcoCardCompact - Minimal inline version
 */
export function TcoCardCompact({
    product,
    persona,
    years = 5,
    className,
}: {
    product: ProductTcoData;
    persona: UsagePersona;
    years?: number;
    className?: string;
}) {
    const tco = calculateTotalTco(product, { years, persona });
    const config = getEfficiencyConfig(tco.priceVsTcoPercent);

    return (
        <div className={cn(
            'inline-flex items-center gap-3 px-4 py-2 rounded-xl',
            'bg-gray-50 border border-gray-200',
            className
        )}>
            <div>
                <span className="text-xs text-gray-500">TCO {years}a:</span>
                <span className="ml-1 font-bold text-gray-900">{formatBRL(tco.totalTco)}</span>
            </div>
            <div className={cn('text-sm font-medium', config.deltaColor)}>
                +{tco.priceVsTcoPercent.toFixed(0)}%
            </div>
        </div>
    );
}

// ============================================
// COMPARISON VARIANT
// ============================================

/**
 * TcoCardVs - Side-by-side comparison of two products
 */
export function TcoCardVs({
    productA,
    productB,
    persona,
    years = 5,
    className,
}: {
    productA: ProductTcoData;
    productB: ProductTcoData;
    persona: UsagePersona;
    years?: number;
    className?: string;
}) {
    const tcoA = calculateTotalTco(productA, { years, persona });
    const tcoB = calculateTotalTco(productB, { years, persona });

    const winner = tcoA.totalTco <= tcoB.totalTco ? 'a' : 'b';
    const savings = Math.abs(tcoA.totalTco - tcoB.totalTco);

    return (
        <div className={cn('grid grid-cols-2 gap-4', className)}>
            {/* Product A */}
            <div className={cn(
                'p-4 rounded-xl border-2',
                winner === 'a'
                    ? 'border-emerald-300 bg-emerald-50'
                    : 'border-gray-200 bg-white'
            )}>
                {winner === 'a' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 mb-2 text-xs font-medium text-emerald-700 bg-emerald-100 rounded-full">
                        🏆 Menor TCO
                    </span>
                )}
                <p className="text-sm font-medium text-gray-600">{productA.brand}</p>
                <p className="text-xl font-bold text-gray-900">{formatBRL(tcoA.totalTco)}</p>
                <p className="text-xs text-gray-500">{years} anos</p>
            </div>

            {/* Product B */}
            <div className={cn(
                'p-4 rounded-xl border-2',
                winner === 'b'
                    ? 'border-emerald-300 bg-emerald-50'
                    : 'border-gray-200 bg-white'
            )}>
                {winner === 'b' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 mb-2 text-xs font-medium text-emerald-700 bg-emerald-100 rounded-full">
                        🏆 Menor TCO
                    </span>
                )}
                <p className="text-sm font-medium text-gray-600">{productB.brand}</p>
                <p className="text-xl font-bold text-gray-900">{formatBRL(tcoB.totalTco)}</p>
                <p className="text-xs text-gray-500">{years} anos</p>
            </div>

            {/* Savings Banner */}
            <div className="col-span-2 px-4 py-2 bg-emerald-100 rounded-xl text-center">
                <p className="text-sm text-emerald-700">
                    Economia de <strong>{formatBRL(savings)}</strong> escolhendo {winner === 'a' ? productA.brand : productB.brand}
                </p>
            </div>
        </div>
    );
}

// ============================================
// EXPORTS
// ============================================

export default TcoCard;
export { tcoCardVariants, getEfficiencyConfig };
export type { EfficiencyLevel, EfficiencyConfig };
