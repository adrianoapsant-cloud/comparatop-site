'use client';

// ============================================================================
// MOBILE SORT CHIPS - Horizontal Scrollable Sort Pills
// ============================================================================
// Design System: Crystalline (Frosted Glass Light)
// Mobile-only component for quick sorting with visual feedback
// ============================================================================

import { Table } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import type { ProductTcoData } from '@/types/tco';
import type { ActiveSortMetric } from './SortDropdown';

// ============================================
// TYPES
// ============================================

interface SortChipConfig {
    id: ActiveSortMetric;
    label: string;
    icon: string;
    activeColors: {
        border: string;
        bg: string;
        text: string;
    };
}

interface MobileSortChipsProps {
    table: Table<ProductTcoData>;
    activeSort: ActiveSortMetric;
    onActiveSortChange: (metric: ActiveSortMetric) => void;
    className?: string;
}

// ============================================
// CHIP CONFIGURATIONS
// ============================================

const SORT_CHIPS: SortChipConfig[] = [
    {
        id: 'price',
        label: 'Preço',
        icon: '💰',
        activeColors: {
            border: 'border-slate-700',
            bg: 'bg-slate-50',
            text: 'text-slate-900 font-bold',
        },
    },
    {
        id: 'tco',
        label: 'Melhor TCO',
        icon: '🌿',
        activeColors: {
            border: 'border-emerald-500',
            bg: 'bg-emerald-50',
            text: 'text-emerald-800 font-bold',
        },
    },
    {
        id: 'score',
        label: 'Nota Técnica',
        icon: '⬡',
        activeColors: {
            border: 'border-blue-500',
            bg: 'bg-blue-50',
            text: 'text-blue-800 font-bold',
        },
    },
    {
        id: 'communityScore',
        label: 'Comunidade',
        icon: '⭐',
        activeColors: {
            border: 'border-yellow-500',
            bg: 'bg-yellow-50',
            text: 'text-yellow-800 font-bold',
        },
    },
];

// ============================================
// COMPONENT
// ============================================

export function MobileSortChips({
    table,
    activeSort,
    onActiveSortChange,
    className,
}: MobileSortChipsProps) {
    const handleChipClick = (chipId: ActiveSortMetric) => {
        if (!chipId) return;

        onActiveSortChange(chipId);

        // Also trigger TanStack Table sorting
        const column = table.getColumn(chipId);
        if (column) {
            // Toggle direction if same column, or set ascending for new column
            const isCurrentlySorted = column.getIsSorted();
            column.toggleSorting(isCurrentlySorted === 'asc');
        }
    };

    return (
        <div
            className={cn(
                'flex gap-2 overflow-x-auto pb-2 px-1',
                'scrollbar-hide',
                '-mx-1', // Compensate for chip padding
                className
            )}
        >
            {SORT_CHIPS.map((chip) => {
                const isActive = activeSort === chip.id;
                const column = table.getColumn(chip.id ?? '');
                const sortDirection = column?.getIsSorted();

                return (
                    <button
                        key={chip.id}
                        onClick={() => handleChipClick(chip.id)}
                        className={cn(
                            'flex-shrink-0 flex items-center gap-1.5',
                            'px-3 py-1.5 rounded-full',
                            'text-sm whitespace-nowrap',
                            'border transition-all duration-200',
                            isActive
                                ? [chip.activeColors.border, chip.activeColors.bg, chip.activeColors.text]
                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        )}
                    >
                        <span>{chip.icon}</span>
                        <span>{chip.label}</span>
                        {isActive && sortDirection && (
                            <span className="text-xs">
                                {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

export default MobileSortChips;
