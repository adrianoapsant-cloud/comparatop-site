'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAllCategories } from '@/config/categories';

// Import criteria (in real app, would be dynamic)
import tvCriteria from '@/core/match/config/tv-criteria.json';
import type { CriteriaConfig } from '@/core/match/types';

// ============================================
// CATEGORY OPTIONS
// ============================================

const CATEGORIES = [
    { id: 'tv', label: 'Smart TV', slug: 'smart-tvs', icon: '📺' },
    { id: 'fridge', label: 'Geladeira', slug: 'geladeiras', icon: '🧊' },
    { id: 'air_conditioner', label: 'Ar-Condicionado', slug: 'ar-condicionados', icon: '❄️' },
    { id: 'notebook', label: 'Notebook', slug: 'notebooks', icon: '💻' },
    { id: 'smartphone', label: 'Smartphone', slug: 'smartphones', icon: '📱' },
];

// ============================================
// PRICE RANGES
// ============================================

const PRICE_RANGES = [
    { id: 'budget', label: 'até R$ 2.000', max: 2000 },
    { id: 'mid', label: 'até R$ 5.000', max: 5000 },
    { id: 'premium', label: 'até R$ 10.000', max: 10000 },
    { id: 'luxury', label: 'sem limite', max: 999999 },
];

// ============================================
// CRITERIA MAP BY CATEGORY
// ============================================

const CRITERIA_BY_CATEGORY: Record<string, CriteriaConfig[]> = {
    tv: tvCriteria as CriteriaConfig[],
    // Add other categories as needed
};

// ============================================
// STYLED DROPDOWN
// ============================================

interface StyledDropdownProps {
    value: string;
    options: { id: string; label: string; icon?: string }[];
    onChange: (id: string) => void;
    placeholder: string;
    accentColor?: 'blue' | 'amber' | 'emerald';
}

function StyledDropdown({
    value,
    options,
    onChange,
    placeholder,
    accentColor = 'blue',
}: StyledDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const selected = options.find(o => o.id === value);

    const colorClasses = {
        blue: 'border-blue-300 bg-blue-50 text-blue-700 hover:border-blue-400',
        amber: 'border-amber-300 bg-amber-50 text-amber-700 hover:border-amber-400',
        emerald: 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:border-emerald-400',
    };

    return (
        <div className="relative inline-block">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'inline-flex items-center gap-2 px-4 py-2',
                    'rounded-xl border-2 transition-all',
                    'font-display font-semibold text-lg md:text-xl',
                    selected ? colorClasses[accentColor] : 'border-gray-300 bg-white text-text-muted hover:border-brand-core'
                )}
            >
                {selected?.icon && <span>{selected.icon}</span>}
                <span className="underline decoration-2 decoration-dotted underline-offset-4">
                    {selected?.label || placeholder}
                </span>
                <ChevronDown size={18} className={cn(
                    'transition-transform',
                    isOpen && 'rotate-180'
                )} />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={cn(
                            'absolute top-full left-0 mt-2 z-50',
                            'bg-white rounded-xl shadow-xl border border-gray-200',
                            'p-2 min-w-[200px]',
                            'text-base font-body font-normal' // Reset font size!
                        )}
                    >
                        {options.map(option => (
                            <button
                                key={option.id}
                                onClick={() => { onChange(option.id); setIsOpen(false); }}
                                className={cn(
                                    'w-full flex items-center gap-2 px-4 py-3 rounded-lg text-left',
                                    'transition-colors text-sm', // Normal text size
                                    value === option.id
                                        ? 'bg-brand-core/10 text-brand-core font-semibold'
                                        : 'hover:bg-gray-100 text-text-primary'
                                )}
                            >
                                {option.icon && <span className="text-lg">{option.icon}</span>}
                                <span>{option.label}</span>
                            </button>
                        ))}
                    </motion.div>
                </>
            )}
        </div>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================

interface NaturalLanguageSearchProps {
    className?: string;
}

export function NaturalLanguageSearch({ className }: NaturalLanguageSearchProps) {
    const router = useRouter();

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedUse, setSelectedUse] = useState('');
    const [selectedPrice, setSelectedPrice] = useState('');

    // Get criteria for selected category
    const availableCriteria = useMemo(() => {
        if (!selectedCategory) return [];
        return (CRITERIA_BY_CATEGORY[selectedCategory] || []).map(c => ({
            id: c.id,
            label: c.label,
            icon: c.icon,
        }));
    }, [selectedCategory]);

    // Reset use when category changes
    const handleCategoryChange = (id: string) => {
        setSelectedCategory(id);
        setSelectedUse('');
    };

    // Handle CTA click
    const handleSearch = () => {
        const category = CATEGORIES.find(c => c.id === selectedCategory);
        if (!category) return;

        // Build URL with query params for pre-applied filters
        let url = `/categorias/${category.slug}`;

        const params = new URLSearchParams();
        if (selectedUse) params.set('gold', selectedUse);
        if (selectedPrice) params.set('maxPrice', PRICE_RANGES.find(p => p.id === selectedPrice)?.max.toString() || '');

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        router.push(url);
    };

    const isComplete = selectedCategory && selectedUse && selectedPrice;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cn(
                'relative overflow-hidden',
                'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
                'rounded-3xl p-8 md:p-12',
                className
            )}
        >
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-core/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6"
                >
                    <Sparkles size={16} className="text-amber-400" />
                    <span className="text-white/90 text-sm font-medium">ComparaMatch AI</span>
                </motion.div>

                {/* Mad Libs Sentence */}
                <div className="font-display text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight md:leading-snug">
                    <span className="text-white/70">Estou procurando</span>
                    <br className="md:hidden" />
                    <span> o melhor </span>

                    <StyledDropdown
                        value={selectedCategory}
                        options={CATEGORIES}
                        onChange={handleCategoryChange}
                        placeholder="escolha"
                        accentColor="blue"
                    />

                    <br className="hidden md:block" />

                    <span className="text-white/70"> para </span>

                    <StyledDropdown
                        value={selectedUse}
                        options={availableCriteria}
                        onChange={setSelectedUse}
                        placeholder={selectedCategory ? "qual uso" : "primeiro escolha acima"}
                        accentColor="amber"
                    />

                    <br className="hidden md:block" />

                    <span className="text-white/70"> com orçamento </span>

                    <StyledDropdown
                        value={selectedPrice}
                        options={PRICE_RANGES}
                        onChange={setSelectedPrice}
                        placeholder="quanto"
                        accentColor="emerald"
                    />
                </div>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isComplete ? 1 : 0.5 }}
                    className="mt-8"
                >
                    <button
                        onClick={handleSearch}
                        disabled={!isComplete}
                        className={cn(
                            'group inline-flex items-center gap-3 px-8 py-4',
                            'bg-gradient-to-r from-brand-core to-blue-600',
                            'rounded-2xl font-display font-bold text-xl text-white',
                            'shadow-lg shadow-brand-core/30',
                            'transition-all duration-300',
                            isComplete
                                ? 'hover:shadow-xl hover:shadow-brand-core/40 hover:scale-105'
                                : 'cursor-not-allowed opacity-50'
                        )}
                    >
                        <Sparkles size={20} />
                        <span>Ver Recomendações</span>
                        <ArrowRight
                            size={20}
                            className="transition-transform group-hover:translate-x-1"
                        />
                    </button>

                    {!isComplete && (
                        <p className="mt-3 text-white/50 text-sm">
                            Complete as seleções acima para continuar
                        </p>
                    )}
                </motion.div>

                {/* Helper text */}
                <p className="mt-6 text-white/40 text-sm max-w-xl">
                    Nosso algoritmo analisará {selectedCategory ? CATEGORIES.find(c => c.id === selectedCategory)?.label + 's' : 'produtos'} e
                    ordenará pelo seu perfil de uso. Sem propaganda, apenas dados.
                </p>
            </div>
        </motion.section>
    );
}
