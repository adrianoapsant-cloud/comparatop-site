'use client';

// ============================================================================
// FLOATING ACTION BAR - Mobile Bottom Navigation
// ============================================================================
// Design System: Crystalline (Frosted Glass Light)
// Fixed at bottom, contains Filter and Sort buttons
// ============================================================================

import { useState } from 'react';
import { Filter, ArrowUpDown, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================

interface FloatingActionBarProps {
    onFilterClick: () => void;
    onSortClick: () => void;
    filterCount?: number;
    sortLabel?: string;
    /** Show indicator when non-default sort is active */
    isCustomSort?: boolean;
    className?: string;
}

interface SortOption {
    id: string;
    label: string;
    icon?: string;
}

interface SortBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    options: SortOption[];
    activeSort: string;
    onSelect: (sortId: string) => void;
}

// ============================================
// SORT BOTTOM SHEET
// ============================================

export function SortBottomSheet({
    isOpen,
    onClose,
    options,
    activeSort,
    onSelect,
}: SortBottomSheetProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 z-50 lg:hidden"
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div className={cn(
                'fixed inset-x-0 bottom-0 z-50 lg:hidden',
                'bg-white rounded-t-3xl shadow-2xl',
                'animate-in slide-in-from-bottom duration-300'
            )}>
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-2">
                    <div className="w-10 h-1 bg-slate-300 rounded-full" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-4 pb-3 border-b border-slate-100">
                    <h3 className="font-semibold text-lg text-slate-900">
                        Ordenar por
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Options */}
                <div className="p-4 space-y-1 max-h-[60vh] overflow-y-auto">
                    {options.map((option) => {
                        const isActive = activeSort === option.id;
                        return (
                            <button
                                key={option.id}
                                onClick={() => {
                                    onSelect(option.id);
                                    onClose();
                                }}
                                className={cn(
                                    'w-full flex items-center justify-between px-4 py-3 rounded-xl',
                                    'text-left transition-colors',
                                    isActive
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'text-slate-700 hover:bg-slate-50'
                                )}
                            >
                                <span className="flex items-center gap-3">
                                    {option.icon && (
                                        <span className="text-lg">{option.icon}</span>
                                    )}
                                    <span className={cn(
                                        'text-base',
                                        isActive && 'font-semibold'
                                    )}>
                                        {option.label}
                                    </span>
                                </span>
                                {isActive && (
                                    <Check className="w-5 h-5 text-indigo-600" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Safe area padding */}
                <div className="h-6" />
            </div>
        </>
    );
}

// ============================================
// FLOATING ACTION BAR
// ============================================

export function FloatingActionBar({
    onFilterClick,
    onSortClick,
    filterCount = 0,
    sortLabel = 'Ordenar',
    isCustomSort = false,
    className,
}: FloatingActionBarProps) {
    return (
        <div
            className={cn(
                // Colado no menu inferior (just above TabBar ~64px)
                'fixed bottom-16 left-1/2 -translate-x-1/2 z-40',
                'lg:hidden',
                // Frosted Glass "Vidro Gelo" - mais fino
                'flex items-center gap-0.5',
                'bg-white/80 backdrop-blur-xl',
                'border border-white/40',
                'rounded-full',
                'shadow-lg shadow-indigo-500/10',
                'px-1 py-0.5',
                'text-slate-800',
                className
            )}
        >
            {/* Filter Button */}
            <button
                onClick={onFilterClick}
                className={cn(
                    'flex items-center gap-1.5',
                    'py-2 px-4 rounded-full',
                    'text-slate-700 font-medium text-sm',
                    'hover:bg-slate-100 active:bg-slate-200 transition-colors'
                )}
            >
                <Filter className="w-4 h-4 text-slate-500" />
                <span>Filtrar</span>
                {filterCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-indigo-600 text-white text-xs font-bold rounded-full min-w-[20px] text-center">
                        {filterCount}
                    </span>
                )}
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-slate-200" />

            {/* Sort Button */}
            <button
                onClick={onSortClick}
                className={cn(
                    'relative flex items-center gap-1.5',
                    'py-2 px-4 rounded-full',
                    'text-slate-700 font-medium text-sm',
                    'hover:bg-slate-100 active:bg-slate-200 transition-colors',
                    isCustomSort && 'bg-indigo-50 text-indigo-700'
                )}
            >
                <ArrowUpDown className={cn(
                    'w-4 h-4',
                    isCustomSort ? 'text-indigo-500' : 'text-slate-500'
                )} />
                <span>{sortLabel}</span>
                {/* Active Sort Indicator Dot */}
                {isCustomSort && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                )}
            </button>
        </div>
    );
}

export default FloatingActionBar;
