'use client';

import { useState } from 'react';
import { ChevronDown, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// PRICE RANGE DROPDOWN
// ============================================
// Replaces exact price slider with predefined ranges
// for Amazon compliance (no exact prices promised)

export interface PriceRange {
    id: string;
    label: string;
    min: number;
    max: number;
    tier: 'entry' | 'mid' | 'premium' | 'all';
}

// Default ranges for electronics
export const DEFAULT_PRICE_RANGES: PriceRange[] = [
    { id: 'all', label: 'Qualquer Preço', min: 0, max: Infinity, tier: 'all' },
    { id: 'entry', label: 'Até R$ 2.000 (Entrada)', min: 0, max: 2000, tier: 'entry' },
    { id: 'mid', label: 'R$ 2.000 - R$ 5.000 (Intermediário)', min: 2000, max: 5000, tier: 'mid' },
    { id: 'premium', label: 'Acima de R$ 5.000 (Premium)', min: 5000, max: Infinity, tier: 'premium' },
];

// Category-specific ranges
export const CATEGORY_PRICE_RANGES: Record<string, PriceRange[]> = {
    tv: [
        { id: 'all', label: 'Qualquer Preço', min: 0, max: Infinity, tier: 'all' },
        { id: 'entry', label: 'Até R$ 2.500 (Compactas)', min: 0, max: 2500, tier: 'entry' },
        { id: 'mid', label: 'R$ 2.500 - R$ 6.000 (Intermediárias)', min: 2500, max: 6000, tier: 'mid' },
        { id: 'premium', label: 'Acima de R$ 6.000 (Premium)', min: 6000, max: Infinity, tier: 'premium' },
    ],
    fridge: [
        { id: 'all', label: 'Qualquer Preço', min: 0, max: Infinity, tier: 'all' },
        { id: 'entry', label: 'Até R$ 3.000 (Básicas)', min: 0, max: 3000, tier: 'entry' },
        { id: 'mid', label: 'R$ 3.000 - R$ 8.000 (Médias)', min: 3000, max: 8000, tier: 'mid' },
        { id: 'premium', label: 'Acima de R$ 8.000 (Side-by-Side)', min: 8000, max: Infinity, tier: 'premium' },
    ],
    air_conditioner: [
        { id: 'all', label: 'Qualquer Preço', min: 0, max: Infinity, tier: 'all' },
        { id: 'entry', label: 'Até R$ 1.500 (9.000 BTU)', min: 0, max: 1500, tier: 'entry' },
        { id: 'mid', label: 'R$ 1.500 - R$ 3.000 (12-18k BTU)', min: 1500, max: 3000, tier: 'mid' },
        { id: 'premium', label: 'Acima de R$ 3.000 (Inverter)', min: 3000, max: Infinity, tier: 'premium' },
    ],
    notebook: [
        { id: 'all', label: 'Qualquer Preço', min: 0, max: Infinity, tier: 'all' },
        { id: 'entry', label: 'Até R$ 3.000 (Básico)', min: 0, max: 3000, tier: 'entry' },
        { id: 'mid', label: 'R$ 3.000 - R$ 6.000 (Trabalho)', min: 3000, max: 6000, tier: 'mid' },
        { id: 'premium', label: 'Acima de R$ 6.000 (Gamer/Pro)', min: 6000, max: Infinity, tier: 'premium' },
    ],
    smartphone: [
        { id: 'all', label: 'Qualquer Preço', min: 0, max: Infinity, tier: 'all' },
        { id: 'entry', label: 'Até R$ 1.500 (Entrada)', min: 0, max: 1500, tier: 'entry' },
        { id: 'mid', label: 'R$ 1.500 - R$ 4.000 (Intermediário)', min: 1500, max: 4000, tier: 'mid' },
        { id: 'premium', label: 'Acima de R$ 4.000 (Flagship)', min: 4000, max: Infinity, tier: 'premium' },
    ],
};

interface PriceRangeDropdownProps {
    /** Currently selected range ID */
    value?: string;
    /** Callback when range changes */
    onChange: (range: PriceRange) => void;
    /** Category ID for specific ranges */
    categoryId?: string;
    /** Custom ranges (overrides defaults) */
    customRanges?: PriceRange[];
    /** Compact mode for mobile */
    compact?: boolean;
    className?: string;
}

export function PriceRangeDropdown({
    value = 'all',
    onChange,
    categoryId,
    customRanges,
    compact = false,
    className,
}: PriceRangeDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Get ranges for category or use defaults
    const ranges = customRanges ||
        (categoryId && CATEGORY_PRICE_RANGES[categoryId]) ||
        DEFAULT_PRICE_RANGES;

    const selectedRange = ranges.find(r => r.id === value) || ranges[0];

    const handleSelect = (range: PriceRange) => {
        onChange(range);
        setIsOpen(false);
    };

    const tierColors = {
        all: 'bg-gray-100 text-gray-700',
        entry: 'bg-emerald-100 text-emerald-700',
        mid: 'bg-amber-100 text-amber-700',
        premium: 'bg-purple-100 text-purple-700',
    };

    return (
        <div className={cn('relative', className)}>
            <label className="block text-xs font-medium text-text-muted mb-1.5">
                💰 Faixa de Preço
            </label>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'w-full flex items-center justify-between gap-2',
                    'px-3 py-2.5 rounded-lg',
                    'bg-white border border-gray-200',
                    'hover:border-gray-300 focus:border-brand-core focus:ring-2 focus:ring-brand-core/20',
                    'transition-all',
                    compact ? 'text-sm' : 'text-base'
                )}
            >
                <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-gray-400" />
                    <span className="font-medium text-text-primary truncate">
                        {compact ? selectedRange.label.split(' (')[0] : selectedRange.label}
                    </span>
                </div>
                <ChevronDown
                    size={16}
                    className={cn(
                        'text-gray-400 transition-transform',
                        isOpen && 'rotate-180'
                    )}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Menu */}
                    <div className={cn(
                        'absolute z-50 top-full left-0 right-0 mt-1',
                        'bg-white rounded-lg border border-gray-200 shadow-lg',
                        'overflow-hidden'
                    )}>
                        {ranges.map((range) => (
                            <button
                                key={range.id}
                                onClick={() => handleSelect(range)}
                                className={cn(
                                    'w-full px-3 py-2.5 text-left',
                                    'flex items-center justify-between gap-2',
                                    'hover:bg-gray-50 transition-colors',
                                    range.id === value && 'bg-brand-core/5'
                                )}
                            >
                                <span className={cn(
                                    'text-sm',
                                    range.id === value ? 'font-semibold text-brand-core' : 'text-text-primary'
                                )}>
                                    {range.label}
                                </span>
                                <span className={cn(
                                    'text-[10px] font-medium px-2 py-0.5 rounded-full',
                                    tierColors[range.tier]
                                )}>
                                    {range.tier === 'all' ? 'Todos' :
                                        range.tier === 'entry' ? 'Econômico' :
                                            range.tier === 'mid' ? 'Médio' : 'Alto'}
                                </span>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

// ============================================
// FILTER HELPER - Returns filtered products
// ============================================

export function filterByPriceRange<T extends { price: number }>(
    products: T[],
    rangeId: string,
    categoryId?: string
): T[] {
    const ranges = (categoryId && CATEGORY_PRICE_RANGES[categoryId]) || DEFAULT_PRICE_RANGES;
    const range = ranges.find(r => r.id === rangeId);

    if (!range || range.id === 'all') {
        return products;
    }

    return products.filter(p => p.price >= range.min && p.price < range.max);
}
