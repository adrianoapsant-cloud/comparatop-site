'use client';

// ============================================================================
// TCO TOOLBAR - Command Island for View Controls
// ============================================================================
// A prominent, sticky container for the ViewSwitcher and related controls.
// Designed to stand out as the site's key differentiator.
// ============================================================================

import { cn } from '@/lib/utils';
import { ViewSwitcherEnhanced } from './view-switcher';
import { Sparkles } from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface TcoToolbarProps {
    /** Additional class names */
    className?: string;
    /** Category name for context */
    categoryName?: string;
    /** Number of products being analyzed */
    productCount?: number;
    /** Whether to enable sticky positioning */
    sticky?: boolean;
}

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * TcoToolbar - Command Island for TCO Controls
 * 
 * A prominent container that houses the ViewSwitcher and provides
 * visual hierarchy to make the Engineering mode discoverable.
 * 
 * Features:
 * - Subtle blue gradient background ("Command Island")
 * - Sticky positioning for easy access while scrolling
 * - Context info (product count)
 * 
 * @example
 * ```tsx
 * <TcoToolbar 
 *   categoryName="Robôs Aspiradores"
 *   productCount={12}
 *   sticky 
 * />
 * ```
 */
export function TcoToolbar({
    className,
    categoryName,
    productCount,
    sticky = true,
}: TcoToolbarProps) {
    return (
        <div
            className={cn(
                // Sticky positioning - top value accounts for header height
                sticky && 'sticky top-[72px] z-40',
                // Container styling - "Command Island"
                'relative overflow-hidden',
                'bg-gradient-to-r from-slate-50 via-blue-50/80 to-indigo-50/60',
                'border border-blue-100/80',
                'rounded-2xl shadow-sm',
                'p-4 sm:p-5',
                // Transition for smooth appearance
                'transition-shadow duration-300',
                'hover:shadow-md',
                className
            )}
        >
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-indigo-200/20 rounded-full blur-2xl" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Left: Context Info */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 rounded-lg border border-blue-100">
                        <Sparkles className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-700">
                            Escolha sua visão
                        </span>
                    </div>

                    {productCount !== undefined && (
                        <span className="text-sm text-gray-500 hidden sm:inline">
                            {productCount} produto{productCount !== 1 ? 's' : ''} disponíve{productCount !== 1 ? 'is' : 'l'}
                        </span>
                    )}
                </div>

                {/* Right: Enhanced ViewSwitcher */}
                <ViewSwitcherEnhanced />
            </div>
        </div>
    );
}

// ============================================
// EXPORTS
// ============================================

export default TcoToolbar;
