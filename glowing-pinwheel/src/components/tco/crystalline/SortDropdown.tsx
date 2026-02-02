'use client';

// ============================================================================
// SORT DROPDOWN - Popover Menu for Granular Sorting
// ============================================================================
// Design System: Crystalline (Frosted Glass Light)
// Allows granular sorting within grouped columns (e.g., Price OR TCO)
// ============================================================================

import { useState, useRef, useEffect } from 'react';
import { Table } from '@tanstack/react-table';
import { ChevronDown, Check, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductTcoData } from '@/types/tco';

// ============================================
// TYPES
// ============================================

export type SortOption = {
    id: string;
    label: string;
    description?: string;
};

export type ActiveSortMetric =
    | 'price'
    | 'tco'
    | 'score'
    | 'communityScore'
    | 'risk'
    | 'match'
    | null;

interface SortDropdownProps {
    label: string;
    options: SortOption[];
    activeOption: string;
    onSelect: (optionId: string) => void;
    table: Table<ProductTcoData>;
    icon?: React.ReactNode;
    className?: string;
}

// ============================================
// COMPONENT
// ============================================

export function SortDropdown({
    label,
    options,
    activeOption,
    onSelect,
    table,
    icon,
    className
}: SortDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const column = table.getColumn(activeOption);
    const isSorted = column?.getIsSorted();

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionId: string) => {
        onSelect(optionId);
        // Toggle sorting on the selected column
        const col = table.getColumn(optionId);
        if (col) {
            col.toggleSorting(col.getIsSorted() === 'asc');
        }
        setIsOpen(false);
    };

    const activeLabel = options.find(o => o.id === activeOption)?.label ?? label;

    return (
        <div ref={dropdownRef} className={cn('relative', className)}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'flex items-center gap-1.5 px-2 py-1.5 rounded-lg',
                    'text-sm font-semibold transition-all',
                    'hover:bg-white/60',
                    isOpen || isSorted
                        ? 'text-indigo-700 bg-white/50'
                        : 'text-slate-600'
                )}
            >
                {icon}
                <span>{label}</span>
                <ChevronDown className={cn(
                    'w-3.5 h-3.5 transition-transform',
                    isOpen && 'rotate-180'
                )} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className={cn(
                    'absolute top-full left-0 mt-1 z-20',
                    'min-w-[200px] p-1',
                    'bg-white/95 backdrop-blur-lg',
                    'rounded-xl border border-white/60',
                    'shadow-xl shadow-indigo-500/10'
                )}>
                    <div className="text-xs font-medium text-slate-400 px-3 py-2">
                        Ordenar por:
                    </div>
                    {options.map((option) => {
                        const isActive = activeOption === option.id;
                        const col = table.getColumn(option.id);
                        const sortDir = col?.getIsSorted();

                        return (
                            <button
                                key={option.id}
                                onClick={() => handleSelect(option.id)}
                                className={cn(
                                    'w-full flex items-center gap-2 px-3 py-2 rounded-lg',
                                    'text-left text-sm transition-colors',
                                    isActive
                                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                        : 'text-slate-700 hover:bg-slate-50'
                                )}
                            >
                                <div className="flex-1">
                                    <div className="font-medium">{option.label}</div>
                                    {option.description && (
                                        <div className="text-xs text-slate-400">{option.description}</div>
                                    )}
                                </div>
                                {isActive && (
                                    <div className="flex items-center gap-1">
                                        <ArrowUpDown className={cn(
                                            'w-3.5 h-3.5',
                                            sortDir === 'asc' ? 'rotate-180' : ''
                                        )} />
                                        <Check className="w-4 h-4 text-indigo-500" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default SortDropdown;
