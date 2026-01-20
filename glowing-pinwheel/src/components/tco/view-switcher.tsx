'use client';

// ============================================================================
// VIEW SWITCHER - Display Mode Toggle (Grid / Table)
// ============================================================================
// A toggle component that switches between Gallery (Grid) and Engineering (Table) views
// Uses URL state for SEO-friendly shareable links
// ============================================================================

import { LayoutGrid, TableProperties, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDisplayView } from '@/hooks/use-url-state';
import type { DisplayViewMode } from '@/hooks/use-url-state';

// ============================================
// TYPES
// ============================================

interface ViewSwitcherProps {
    /** Additional class names */
    className?: string;
    /** Compact mode for tight spaces */
    compact?: boolean;
    /** Show labels */
    showLabels?: boolean;
}

// ============================================
// VIEW CONFIGURATIONS
// ============================================

interface ViewConfig {
    value: DisplayViewMode;
    label: string;
    shortLabel: string;
    icon: React.ReactNode;
    activeStyles: string;
    description: string;
}

const VIEW_CONFIGS: ViewConfig[] = [
    {
        value: 'grid',
        label: 'Galeria',
        shortLabel: '🖼️',
        icon: <LayoutGrid className="w-4 h-4" />,
        activeStyles: 'bg-white text-gray-900 shadow-sm border-gray-300',
        description: 'Visualização em cards com imagens',
    },
    {
        value: 'table',
        label: 'Engenharia',
        shortLabel: '📊',
        icon: <TableProperties className="w-4 h-4" />,
        activeStyles: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md border-transparent',
        description: 'Tabela técnica com TCO e métricas',
    },
];

// ============================================
// MAIN COMPONENT (Original)
// ============================================

/**
 * ViewSwitcher - Toggle between Grid (Gallery) and Table (Engineering) views
 * 
 * - Grid: Visual product cards with images (default for casual browsing)
 * - Table: Engineering view with TCO data, risk scores, and technical metrics
 * 
 * @example
 * ```tsx
 * <ViewSwitcher />
 * <ViewSwitcher compact />
 * <ViewSwitcher showLabels={false} />
 * ```
 */
export function ViewSwitcher({
    className,
    compact = false,
    showLabels = true,
}: ViewSwitcherProps) {
    const { displayView, setDisplayView } = useDisplayView();

    return (
        <div
            className={cn(
                'flex items-center gap-2',
                className
            )}
            role="toolbar"
            aria-label="Modo de visualização"
        >
            {/* Label */}
            {showLabels && (
                <span className={cn(
                    'text-xs font-semibold text-gray-500 uppercase tracking-wider',
                    compact && 'hidden sm:inline'
                )}>
                    <Eye className="w-3.5 h-3.5 inline mr-1" />
                    Modo:
                </span>
            )}

            {/* Toggle Group */}
            <div
                className={cn(
                    'inline-flex items-center gap-1 p-1 rounded-xl',
                    'bg-gray-100 border border-gray-200'
                )}
                role="tablist"
            >
                {VIEW_CONFIGS.map((config) => {
                    const isActive = displayView === config.value;

                    return (
                        <button
                            key={config.value}
                            role="tab"
                            aria-selected={isActive}
                            title={config.description}
                            onClick={() => setDisplayView(config.value)}
                            className={cn(
                                'relative flex items-center gap-2 px-4 py-2 rounded-lg',
                                'text-sm font-medium border',
                                'transition-all duration-200',
                                'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500',
                                isActive
                                    ? config.activeStyles
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 border-transparent',
                                compact && 'px-3 py-1.5 text-xs'
                            )}
                        >
                            <span className="flex-shrink-0">
                                {config.icon}
                            </span>
                            {showLabels && (
                                <span className={cn(
                                    'whitespace-nowrap',
                                    compact && 'hidden sm:inline'
                                )}>
                                    {config.label}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ============================================
// ENHANCED VARIANT (Prominent UI)
// ============================================

/**
 * ViewSwitcherEnhanced - Prominent toggle with larger buttons and NOVO badge
 * 
 * Designed for maximum visibility and discoverability.
 * Features:
 * - Larger buttons (h-11)
 * - Strong active state (blue gradient)
 * - Pulsing "NOVO" badge on Engineering option
 */
export function ViewSwitcherEnhanced({ className }: { className?: string }) {
    const { setDisplayView, isGridView, isTableView } = useDisplayView();

    return (
        <div
            className={cn(
                'flex items-center gap-1 p-1.5 rounded-2xl',
                'bg-white border border-gray-200 shadow-sm',
                className
            )}
            role="tablist"
            aria-label="Modo de visualização"
        >
            {/* Galeria Button */}
            <button
                role="tab"
                aria-selected={isGridView}
                onClick={() => setDisplayView('grid')}
                className={cn(
                    'relative flex items-center gap-2.5 h-11 px-5 rounded-xl',
                    'text-sm font-semibold',
                    'transition-all duration-200 ease-out',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500',
                    isGridView
                        ? 'bg-gray-900 text-white shadow-md'
                        : 'bg-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
            >
                <LayoutGrid className="w-5 h-5" />
                <span>Galeria</span>
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-200 mx-1" />

            {/* Engenharia Button (with NOVO badge) */}
            <button
                role="tab"
                aria-selected={isTableView}
                onClick={() => setDisplayView('table')}
                className={cn(
                    'relative flex items-center gap-2.5 h-11 px-5 rounded-xl',
                    'text-sm font-semibold',
                    'transition-all duration-200 ease-out',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500',
                    isTableView
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-transparent text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                )}
            >
                <TableProperties className="w-5 h-5" />
                <span>Engenharia</span>

                {/* NOVO Badge - Pulsing animation */}
                {!isTableView && (
                    <span className={cn(
                        'absolute -top-2 -right-2',
                        'px-1.5 py-0.5 rounded-full',
                        'text-[10px] font-bold uppercase tracking-wider',
                        'bg-gradient-to-r from-amber-400 to-orange-500 text-white',
                        'shadow-sm shadow-orange-500/30',
                        'animate-pulse'
                    )}>
                        NOVO
                    </span>
                )}
            </button>
        </div>
    );
}

// ============================================
// PILL VARIANT
// ============================================

/**
 * ViewSwitcherPill - Compact pill-style toggle
 */
export function ViewSwitcherPill({ className }: { className?: string }) {
    const { isGridView, toggleDisplayView } = useDisplayView();

    return (
        <button
            onClick={toggleDisplayView}
            className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full',
                'text-sm font-medium border',
                'transition-all duration-200',
                isGridView
                    ? 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    : 'bg-blue-50 border-blue-200 text-blue-700',
                className
            )}
        >
            {isGridView ? (
                <>
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Galeria</span>
                </>
            ) : (
                <>
                    <TableProperties className="w-3.5 h-3.5" />
                    <span>Engenharia</span>
                </>
            )}
        </button>
    );
}

// ============================================
// EXPORTS
// ============================================

export default ViewSwitcher;
