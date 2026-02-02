'use client';

// ============================================================================
// FILTER BOTTOM SHEET - Full Screen Filter Modal
// ============================================================================
// Design System: Crystalline (Frosted Glass Light)
// Slides up from bottom, contains all filter options
// ============================================================================

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================

interface FilterBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    resultCount: number;
    onApply?: () => void;
}

// ============================================
// COMPONENT
// ============================================

export function FilterBottomSheet({
    isOpen,
    onClose,
    children,
    resultCount,
    onApply,
}: FilterBottomSheetProps) {
    if (!isOpen) return null;

    const handleApply = () => {
        onApply?.();
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 z-50 lg:hidden"
                onClick={onClose}
            />

            {/* Full Screen Sheet */}
            <div className={cn(
                'fixed inset-x-0 bottom-0 top-12 z-50 lg:hidden',
                'bg-white rounded-t-3xl shadow-2xl',
                'flex flex-col',
                'animate-in slide-in-from-bottom duration-300'
            )}>
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                    <div className="w-10 h-1 bg-slate-300 rounded-full" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-shrink-0">
                    <h3 className="font-semibold text-lg text-slate-900">
                        Filtros
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {children}
                </div>

                {/* Sticky Footer */}
                <div className="flex-shrink-0 p-4 border-t border-slate-100 bg-white safe-area-pb">
                    <button
                        onClick={handleApply}
                        className={cn(
                            'w-full py-4 rounded-xl',
                            'bg-indigo-600 text-white',
                            'font-semibold text-base',
                            'hover:bg-indigo-700 active:bg-indigo-800',
                            'transition-colors',
                            'flex items-center justify-center gap-2'
                        )}
                    >
                        Ver {resultCount} {resultCount === 1 ? 'produto' : 'produtos'}
                    </button>
                </div>
            </div>
        </>
    );
}

export default FilterBottomSheet;
