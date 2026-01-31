'use client';

// ============================================================================
// REALITY SWITCH - Dual Command Bar
// ============================================================================
// A dual-section command bar with two toggle groups:
// LEFT (Financial):  [ 💲 Preço Etiqueta ] [ 📉 Custo Real 5a ]
// RIGHT (Quality):   [ ⭐ Comunidade ] [ 🛡️ Consenso 360º ]
// ============================================================================

import { Tag, TrendingUp, Zap, Star, ShieldCheck, Microscope } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTcoView, useScoreView } from '@/hooks/use-url-state';
import type { TcoViewMode } from '@/types/tco';
import type { ScoreViewMode } from '@/hooks/use-url-state';

// ============================================
// TYPES
// ============================================

interface RealitySwitchProps {
    /** Additional class names */
    className?: string;
    /** Compact mode for tight spaces */
    compact?: boolean;
    /** Number of years for TCO label */
    years?: number;
    /** Show only financial section */
    financialOnly?: boolean;
    /** Show only quality section */
    qualityOnly?: boolean;
}

// ============================================
// TAB CONFIGURATIONS
// ============================================

interface TabConfig<T extends string> {
    value: T;
    label: string;
    shortLabel: string;
    icon: React.ReactNode;
    activeStyles: string;
}

// Financial tabs (left side)
const FINANCIAL_TABS: TabConfig<TcoViewMode>[] = [
    {
        value: 'price',
        label: 'Preço Etiqueta',
        shortLabel: 'Etiqueta',
        icon: <Tag className="w-4 h-4" />,
        activeStyles: 'bg-white text-gray-900 shadow-sm border-gray-300',
    },
    {
        value: 'tco',
        label: 'Custo Real',
        shortLabel: 'Real',
        icon: <TrendingUp className="w-4 h-4" />,
        activeStyles: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md border-transparent',
    },
];

// Quality tabs (right side)
const QUALITY_TABS: TabConfig<ScoreViewMode>[] = [
    {
        value: 'community',
        label: 'Comunidade',
        shortLabel: 'Comunidade',
        icon: <Star className="w-4 h-4" />,
        activeStyles: 'bg-white text-gray-900 shadow-sm border-gray-300',
    },
    {
        value: 'technical',
        label: 'Consenso 360°',
        shortLabel: 'Técnico',
        icon: <ShieldCheck className="w-4 h-4" />,
        activeStyles: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md border-transparent',
    },
];

// ============================================
// TOGGLE GROUP COMPONENT
// ============================================

interface ToggleGroupProps<T extends string> {
    tabs: TabConfig<T>[];
    value: T;
    onChange: (value: T) => void;
    compact?: boolean;
    years?: number;
    showYearsFor?: T;
    className?: string;
}

function ToggleGroup<T extends string>({
    tabs,
    value,
    onChange,
    compact = false,
    years = 5,
    showYearsFor,
    className,
}: ToggleGroupProps<T>) {
    return (
        <div
            className={cn(
                'inline-flex items-center gap-1 p-1 rounded-xl',
                'bg-gray-100 border border-gray-200',
                className
            )}
            role="tablist"
        >
            {tabs.map((tab) => {
                const isActive = value === tab.value;
                const showYears = showYearsFor === tab.value && isActive;
                const labelText = showYears
                    ? `${compact ? tab.shortLabel : tab.label} (${years}a)`
                    : (compact ? tab.shortLabel : tab.label);

                return (
                    <button
                        key={tab.value}
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => onChange(tab.value)}
                        className={cn(
                            'relative flex items-center gap-2 px-4 py-2 rounded-lg',
                            'text-sm font-medium border',
                            'transition-all duration-200',
                            'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500',
                            isActive
                                ? tab.activeStyles
                                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 border-transparent',
                            compact && 'px-3 py-1.5 text-xs'
                        )}
                    >
                        <span className={cn(
                            'flex-shrink-0',
                            isActive && tab.value === 'tco' && 'animate-pulse',
                            isActive && tab.value === 'technical' && 'animate-pulse'
                        )}>
                            {tab.icon}
                        </span>
                        <span className="whitespace-nowrap">
                            {labelText}
                        </span>
                        {isActive && (tab.value === 'tco' || tab.value === 'technical') && (
                            <Zap className="w-3 h-3 ml-0.5 animate-pulse" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}

// ============================================
// DUAL COMMAND BAR
// ============================================

/**
 * RealitySwitch - Dual Command Bar for Financial + Quality views
 * 
 * LEFT (Financial): Price vs TCO
 * RIGHT (Quality): Community Stars vs Technical Score (10 Dores)
 * 
 * @example
 * ```tsx
 * <RealitySwitch years={5} />
 * <RealitySwitch financialOnly />
 * <RealitySwitch qualityOnly />
 * <RealitySwitch compact />
 * ```
 */
export function RealitySwitch({
    className,
    compact = false,
    years = 5,
    financialOnly = false,
    qualityOnly = false,
}: RealitySwitchProps) {
    const { view, setView } = useTcoView();
    const { scoreView, setScoreView } = useScoreView();

    const showFinancial = !qualityOnly;
    const showQuality = !financialOnly;

    return (
        <div
            className={cn(
                'flex flex-wrap items-center gap-3',
                className
            )}
            role="toolbar"
            aria-label="Controles de visualização"
        >
            {/* Financial Toggle */}
            {showFinancial && (
                <div className="flex items-center gap-2">
                    <span className={cn(
                        'text-xs font-semibold text-gray-500 uppercase tracking-wider',
                        compact && 'hidden sm:inline'
                    )}>
                        💰 Valor:
                    </span>
                    <ToggleGroup
                        tabs={FINANCIAL_TABS}
                        value={view}
                        onChange={setView}
                        compact={compact}
                        years={years}
                        showYearsFor="tco"
                    />
                </div>
            )}

            {/* Separator */}
            {showFinancial && showQuality && (
                <div className="hidden sm:block w-px h-8 bg-gray-300" />
            )}

            {/* Quality Toggle */}
            {showQuality && (
                <div className="flex items-center gap-2">
                    <span className={cn(
                        'text-xs font-semibold text-gray-500 uppercase tracking-wider',
                        compact && 'hidden sm:inline'
                    )}>
                        📊 Nota:
                    </span>
                    <ToggleGroup
                        tabs={QUALITY_TABS}
                        value={scoreView}
                        onChange={setScoreView}
                        compact={compact}
                    />
                </div>
            )}
        </div>
    );
}

// ============================================
// FINANCIAL ONLY VARIANT
// ============================================

/**
 * RealitySwitchFinancial - Only the financial toggle (Price vs TCO)
 */
export function RealitySwitchFinancial({
    className,
    compact = false,
    years = 5
}: Omit<RealitySwitchProps, 'financialOnly' | 'qualityOnly'>) {
    return (
        <RealitySwitch
            className={className}
            compact={compact}
            years={years}
            financialOnly
        />
    );
}

// ============================================
// QUALITY ONLY VARIANT
// ============================================

/**
 * RealitySwitchQuality - Only the quality toggle (Community vs Technical)
 */
export function RealitySwitchQuality({
    className,
    compact = false
}: Omit<RealitySwitchProps, 'financialOnly' | 'qualityOnly' | 'years'>) {
    return (
        <RealitySwitch
            className={className}
            compact={compact}
            qualityOnly
        />
    );
}

// ============================================
// PILL STYLE VARIANT
// ============================================

/**
 * RealitySwitchPill - Smaller pill-style variant (financial only)
 */
export function RealitySwitchPill({ className, years = 5 }: { className?: string; years?: number }) {
    const { view, setView, isTcoView } = useTcoView();

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <span className="text-sm text-gray-500">Mostrar:</span>
            <button
                onClick={() => setView(isTcoView ? 'price' : 'tco')}
                className={cn(
                    'relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full',
                    'text-sm font-medium',
                    'transition-all duration-200',
                    'border',
                    isTcoView
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                )}
            >
                {isTcoView ? (
                    <>
                        <TrendingUp className="w-3.5 h-3.5" />
                        Custo Real ({years}a)
                    </>
                ) : (
                    <>
                        <Tag className="w-3.5 h-3.5" />
                        Preço Etiqueta
                    </>
                )}
            </button>
        </div>
    );
}

// ============================================
// STATUS BADGES
// ============================================

/**
 * RealityStatusBadge - Shows current reality states as badges
 */
export function RealityStatusBadge({ className }: { className?: string }) {
    const { isTcoView } = useTcoView();
    const { isTechnicalView } = useScoreView();

    return (
        <div className={cn('flex items-center gap-2', className)}>
            {/* Financial Badge */}
            <span className={cn(
                'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                isTcoView
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-100 text-gray-600'
            )}>
                {isTcoView ? <TrendingUp className="w-3 h-3" /> : <Tag className="w-3 h-3" />}
                {isTcoView ? 'Custo Real' : 'Preço'}
            </span>

            {/* Quality Badge */}
            <span className={cn(
                'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                isTechnicalView
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600'
            )}>
                {isTechnicalView ? <ShieldCheck className="w-3 h-3" /> : <Star className="w-3 h-3" />}
                {isTechnicalView ? '360°' : 'Comunidade'}
            </span>
        </div>
    );
}

// ============================================
// EXPORTS
// ============================================

export default RealitySwitch;
