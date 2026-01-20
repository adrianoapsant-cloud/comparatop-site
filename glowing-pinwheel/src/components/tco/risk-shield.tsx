'use client';

// ============================================================================
// RISK SHIELD - SCRS (Supply Chain Risk Score) Badge
// ============================================================================
// Visual indicator of product reliability based on parts availability,
// service network, repairability, and brand reliability
// ============================================================================

import { ShieldCheck, ShieldAlert, ShieldX, HelpCircle } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// ============================================
// CVA VARIANTS
// ============================================

const riskShieldVariants = cva(
    // Base styles
    [
        'inline-flex items-center gap-2 px-3 py-2 rounded-xl',
        'font-medium text-sm',
        'border-2 transition-all duration-200',
    ],
    {
        variants: {
            /** Risk level based on SCRS score */
            level: {
                safe: [
                    'bg-emerald-50 border-emerald-200 text-emerald-700',
                    'hover:bg-emerald-100 hover:border-emerald-300',
                ],
                warning: [
                    'bg-amber-50 border-amber-200 text-amber-700',
                    'hover:bg-amber-100 hover:border-amber-300',
                ],
                critical: [
                    'bg-red-50 border-red-200 text-red-700',
                    'hover:bg-red-100 hover:border-red-300',
                ],
            },
            /** Size variant */
            size: {
                sm: 'px-2 py-1 text-xs gap-1.5',
                md: 'px-3 py-2 text-sm gap-2',
                lg: 'px-4 py-2.5 text-base gap-2.5',
            },
            /** Display mode */
            display: {
                badge: '',
                card: 'w-full flex-col items-start p-4 rounded-2xl',
            },
        },
        defaultVariants: {
            level: 'warning',
            size: 'md',
            display: 'badge',
        },
    }
);

// ============================================
// TYPES
// ============================================

interface RiskShieldProps extends VariantProps<typeof riskShieldVariants> {
    /** SCRS score (0-10) */
    score: number;
    /** Brand name for context */
    brandName: string;
    /** Show score number */
    showScore?: boolean;
    /** Show explanatory label */
    showLabel?: boolean;
    /** Additional class names */
    className?: string;
    /** Callback on click (for detailed view) */
    onClick?: () => void;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

type RiskLevel = 'safe' | 'warning' | 'critical';

interface RiskConfig {
    level: RiskLevel;
    label: string;
    description: string;
    icon: React.ReactNode;
}

function getRiskConfig(score: number): RiskConfig {
    if (score >= 8) {
        return {
            level: 'safe',
            label: 'Baixo Risco',
            description: 'Boa disponibilidade de peças e rede de assistência',
            icon: <ShieldCheck className="w-5 h-5" />,
        };
    }

    if (score >= 4) {
        return {
            level: 'warning',
            label: 'Risco Moderado',
            description: 'Disponibilidade de peças pode variar por região',
            icon: <ShieldAlert className="w-5 h-5" />,
        };
    }

    return {
        level: 'critical',
        label: 'Alto Risco',
        description: 'Dificuldade para encontrar peças e assistência técnica',
        icon: <ShieldX className="w-5 h-5 animate-pulse" />,
    };
}

// ============================================
// TOOLTIP WRAPPER
// ============================================

interface TooltipWrapperProps {
    children: React.ReactNode;
    content: string;
    brandName: string;
}

function TooltipWrapper({ children, content, brandName }: TooltipWrapperProps) {
    return (
        <div className="group relative inline-block">
            {children}

            {/* Tooltip */}
            <div className={cn(
                'absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2',
                'px-3 py-2 max-w-[280px]',
                'bg-gray-900 text-white text-xs rounded-lg',
                'opacity-0 invisible group-hover:opacity-100 group-hover:visible',
                'transition-all duration-200',
                'shadow-xl'
            )}>
                <p className="leading-relaxed">
                    <strong>Risco de Manutenção:</strong> {content}
                </p>
                <p className="mt-1 text-gray-400">
                    Calculado com base na disponibilidade de peças da {brandName} no Brasil.
                </p>

                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                    <div className="border-4 border-transparent border-t-gray-900" />
                </div>
            </div>
        </div>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * RiskShield - Badge indicating supply chain risk level
 * 
 * Uses cva for variant management:
 * - Safe (8-10): Green, ShieldCheck icon
 * - Warning (4-7): Amber, ShieldAlert icon
 * - Critical (0-3): Red, ShieldX with pulse animation
 * 
 * @example
 * ```tsx
 * <RiskShield score={8.5} brandName="Samsung" />
 * <RiskShield score={3.2} brandName="Multilaser" showScore />
 * ```
 */
export function RiskShield({
    score,
    brandName,
    showScore = true,
    showLabel = true,
    size,
    display,
    className,
    onClick,
}: RiskShieldProps) {
    const config = getRiskConfig(score);

    const content = (
        <button
            onClick={onClick}
            className={cn(
                riskShieldVariants({ level: config.level, size, display }),
                onClick && 'cursor-pointer',
                !onClick && 'cursor-default',
                className
            )}
        >
            {/* Icon */}
            <span className="flex-shrink-0">
                {config.icon}
            </span>

            {/* Content */}
            <div className={cn(
                'flex items-center gap-2',
                display === 'card' && 'flex-col items-start gap-1'
            )}>
                {/* Label */}
                {showLabel && (
                    <span className={display === 'card' ? 'font-semibold' : ''}>
                        {config.label}
                    </span>
                )}

                {/* Score */}
                {showScore && (
                    <span className={cn(
                        'px-1.5 py-0.5 rounded-md text-xs font-bold',
                        'bg-white/50'
                    )}>
                        {score.toFixed(1)}
                    </span>
                )}
            </div>

            {/* Card mode: extra description */}
            {display === 'card' && (
                <>
                    <p className="text-xs opacity-80 mt-1">
                        {config.description}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-xs opacity-60">
                        <HelpCircle className="w-3 h-3" />
                        Baseado no SCRS da {brandName}
                    </div>
                </>
            )}
        </button>
    );

    // Wrap with tooltip for badge mode
    if (display !== 'card') {
        return (
            <TooltipWrapper content={config.description} brandName={brandName}>
                {content}
            </TooltipWrapper>
        );
    }

    return content;
}

// ============================================
// COMPACT VARIANT
// ============================================

/**
 * RiskShieldCompact - Icon-only version for tight spaces
 */
export function RiskShieldCompact({
    score,
    brandName,
    className
}: {
    score: number;
    brandName: string;
    className?: string;
}) {
    const config = getRiskConfig(score);

    const colorClasses = {
        safe: 'text-emerald-500',
        warning: 'text-amber-500',
        critical: 'text-red-500 animate-pulse',
    };

    return (
        <TooltipWrapper content={config.description} brandName={brandName}>
            <div
                className={cn(
                    'inline-flex items-center justify-center',
                    'w-8 h-8 rounded-lg',
                    'bg-gray-100 hover:bg-gray-200',
                    'transition-colors',
                    colorClasses[config.level],
                    className
                )}
                title={`${config.label}: ${score.toFixed(1)}`}
            >
                {config.icon}
            </div>
        </TooltipWrapper>
    );
}

// ============================================
// INLINE VARIANT
// ============================================

/**
 * RiskShieldInline - Text-based version for inline use
 */
export function RiskShieldInline({
    score,
    brandName
}: {
    score: number;
    brandName: string;
}) {
    const config = getRiskConfig(score);

    const colorClasses = {
        safe: 'text-emerald-600',
        warning: 'text-amber-600',
        critical: 'text-red-600',
    };

    return (
        <span className={cn('inline-flex items-center gap-1', colorClasses[config.level])}>
            {config.icon}
            <span className="font-medium">{config.label}</span>
            <span className="text-gray-400">({score.toFixed(1)})</span>
        </span>
    );
}

// ============================================
// EXPORTS
// ============================================

export default RiskShield;
export { riskShieldVariants, getRiskConfig };
export type { RiskLevel, RiskConfig };
