'use client';

import { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// FILTER TYPES
// ============================================

export interface FilterState {
    priceRange: [number, number];
    brands: string[];
    dynamicFilters: Record<string, string[]>;
}

interface CategoryFiltersProps {
    /** Available brands in category */
    brands: string[];
    /** Price range [min, max] */
    priceRange: [number, number];
    /** Dynamic filter options (e.g., sizes for TVs) */
    dynamicOptions?: {
        label: string;
        key: string;
        options: { value: string; label: string }[];
    }[];
    /** Current filter state */
    filters: FilterState;
    /** Filter change handler */
    onFilterChange: (filters: FilterState) => void;
    /** Product count after filtering */
    resultCount: number;
    /** Custom class */
    className?: string;
}

// ============================================
// MOBILE FILTER DRAWER
// ============================================

function MobileFilterDrawer({
    isOpen,
    onClose,
    children,
    resultCount,
}: {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    resultCount: number;
}) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 z-50 md:hidden"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={cn(
                'fixed inset-y-0 left-0 w-[85%] max-w-sm z-50 md:hidden',
                'bg-white shadow-2xl',
                'animate-in slide-in-from-left duration-300'
            )}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="font-display font-semibold text-lg text-text-primary">
                        Filtros
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X size={20} className="text-text-secondary" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto max-h-[calc(100vh-140px)]">
                    {children}
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
                    <button
                        onClick={onClose}
                        className={cn(
                            'w-full py-3 rounded-xl',
                            'bg-brand-core text-white font-semibold',
                            'hover:bg-brand-core/90 transition-colors'
                        )}
                    >
                        Ver {resultCount} resultados
                    </button>
                </div>
            </div>
        </>
    );
}

// ============================================
// FILTER SECTION (COLLAPSIBLE)
// ============================================

function FilterSection({
    title,
    defaultOpen = true,
    children,
}: {
    title: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-gray-100 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-2"
            >
                <span className="font-body font-semibold text-sm text-text-primary">
                    {title}
                </span>
                {isOpen ? (
                    <ChevronUp size={16} className="text-text-muted" />
                ) : (
                    <ChevronDown size={16} className="text-text-muted" />
                )}
            </button>

            {isOpen && (
                <div className="mt-2 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                    {children}
                </div>
            )}
        </div>
    );
}

// ============================================
// MAIN FILTERS COMPONENT
// ============================================

export function CategoryFilters({
    brands,
    priceRange,
    dynamicOptions = [],
    filters,
    onFilterChange,
    resultCount,
    className,
}: CategoryFiltersProps) {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handlePriceChange = (type: 'min' | 'max', value: number) => {
        const newRange: [number, number] = [...filters.priceRange];
        if (type === 'min') {
            newRange[0] = Math.min(value, newRange[1]);
        } else {
            newRange[1] = Math.max(value, newRange[0]);
        }
        onFilterChange({ ...filters, priceRange: newRange });
    };

    const handleBrandToggle = (brand: string) => {
        const newBrands = filters.brands.includes(brand)
            ? filters.brands.filter(b => b !== brand)
            : [...filters.brands, brand];
        onFilterChange({ ...filters, brands: newBrands });
    };

    const handleDynamicFilter = (key: string, value: string) => {
        const current = filters.dynamicFilters[key] || [];
        const newValues = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];
        onFilterChange({
            ...filters,
            dynamicFilters: {
                ...filters.dynamicFilters,
                [key]: newValues,
            },
        });
    };

    const clearAllFilters = () => {
        onFilterChange({
            priceRange,
            brands: [],
            dynamicFilters: {},
        });
    };

    const hasActiveFilters =
        filters.brands.length > 0 ||
        filters.priceRange[0] !== priceRange[0] ||
        filters.priceRange[1] !== priceRange[1] ||
        Object.values(filters.dynamicFilters).some(v => v.length > 0);

    // Filter content (shared between desktop sidebar and mobile drawer)
    const FilterContent = () => (
        <>
            {/* Price Range - Tier Buttons instead of exact slider */}
            <FilterSection title="💰 Faixa de Preço">
                <div className="space-y-2">
                    {[
                        { id: 'all', label: 'Qualquer Preço', min: 0, max: Infinity },
                        { id: 'entry', label: 'Até R$ 2.000 (Entrada)', min: 0, max: 2000 },
                        { id: 'mid', label: 'R$ 2.000 - R$ 5.000', min: 2000, max: 5000 },
                        { id: 'premium', label: 'Acima de R$ 5.000', min: 5000, max: Infinity },
                    ].map((tier) => {
                        const isSelected =
                            (tier.id === 'all' && filters.priceRange[0] === priceRange[0] && filters.priceRange[1] === priceRange[1]) ||
                            (tier.id !== 'all' && filters.priceRange[0] === tier.min && filters.priceRange[1] === (tier.max === Infinity ? priceRange[1] : tier.max));

                        return (
                            <button
                                key={tier.id}
                                onClick={() => {
                                    const newMax = tier.max === Infinity ? priceRange[1] : tier.max;
                                    onFilterChange({
                                        ...filters,
                                        priceRange: tier.id === 'all' ? priceRange : [tier.min, newMax]
                                    });
                                }}
                                className={cn(
                                    'w-full px-3 py-2 rounded-lg text-sm text-left transition-all',
                                    'border',
                                    isSelected
                                        ? 'bg-brand-core/10 border-brand-core text-brand-core font-medium'
                                        : 'bg-white border-gray-200 text-text-secondary hover:border-gray-300'
                                )}
                            >
                                {tier.label}
                            </button>
                        );
                    })}
                </div>
            </FilterSection>

            {/* Brands */}
            <FilterSection title="🏷️ Marca">
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    {brands.map((brand) => (
                        <label
                            key={brand}
                            className="flex items-center gap-2 cursor-pointer group"
                        >
                            <input
                                type="checkbox"
                                checked={filters.brands.includes(brand)}
                                onChange={() => handleBrandToggle(brand)}
                                className="w-4 h-4 rounded border-gray-300 text-brand-core focus:ring-brand-core"
                            />
                            <span className="text-sm text-text-secondary group-hover:text-text-primary">
                                {brand}
                            </span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Dynamic Filters */}
            {dynamicOptions.map((option) => (
                <FilterSection key={option.key} title={option.label}>
                    <div className="flex flex-wrap gap-2">
                        {option.options.map((opt) => {
                            const isSelected = (filters.dynamicFilters[option.key] || []).includes(opt.value);
                            return (
                                <button
                                    key={opt.value}
                                    onClick={() => handleDynamicFilter(option.key, opt.value)}
                                    className={cn(
                                        'px-3 py-1.5 rounded-full text-xs font-medium',
                                        'border transition-colors',
                                        isSelected
                                            ? 'bg-brand-core text-white border-brand-core'
                                            : 'bg-white text-text-secondary border-gray-200 hover:border-brand-core'
                                    )}
                                >
                                    {opt.label}
                                </button>
                            );
                        })}
                    </div>
                </FilterSection>
            ))}

            {/* Clear Filters */}
            {hasActiveFilters && (
                <button
                    onClick={clearAllFilters}
                    className="w-full py-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                    ✕ Limpar todos os filtros
                </button>
            )}
        </>
    );

    return (
        <>
            {/* Mobile Filter Button */}
            <div className="md:hidden mb-4">
                <button
                    onClick={() => setMobileOpen(true)}
                    className={cn(
                        'w-full py-3 px-4 rounded-xl',
                        'bg-white border border-gray-200',
                        'flex items-center justify-center gap-2',
                        'font-body font-medium text-text-primary',
                        'hover:bg-gray-50 transition-colors'
                    )}
                >
                    <Filter size={18} />
                    Filtrar
                    {hasActiveFilters && (
                        <span className="ml-1 px-1.5 py-0.5 bg-brand-core text-white text-[10px] font-bold rounded-full">
                            {filters.brands.length + Object.values(filters.dynamicFilters).flat().length}
                        </span>
                    )}
                </button>
            </div>

            {/* Mobile Drawer */}
            <MobileFilterDrawer
                isOpen={mobileOpen}
                onClose={() => setMobileOpen(false)}
                resultCount={resultCount}
            >
                <FilterContent />
            </MobileFilterDrawer>

            {/* Desktop Sidebar */}
            <aside className={cn(
                'hidden md:block w-64 flex-shrink-0',
                className
            )}>
                <div className="sticky top-24 bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display font-semibold text-text-primary">
                            Filtros
                        </h3>
                        {hasActiveFilters && (
                            <button
                                onClick={clearAllFilters}
                                className="text-xs text-red-500 hover:text-red-600"
                            >
                                Limpar
                            </button>
                        )}
                    </div>
                    <FilterContent />
                </div>
            </aside>
        </>
    );
}
