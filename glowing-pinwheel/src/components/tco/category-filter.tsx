'use client';

// ============================================================================
// CATEGORY FILTER - Filter products by category for valid TCO comparison
// ============================================================================
// Ensures TCO is compared within the same category ("apples to apples")
// Different categories have different consumption models
// ============================================================================

import { useCallback, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Tv, Refrigerator, WashingMachine, Wind, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================

export type TcoCategory =
    | 'smart-tvs'
    | 'geladeiras'
    | 'lavadoras'
    | 'ar-condicionado'
    | 'robo-aspiradores';

interface CategoryConfig {
    id: TcoCategory;
    label: string;
    shortLabel: string;
    icon: React.ReactNode;
    description: string;
    consumptionModel: string;
}

interface CategoryFilterProps {
    /** Additional class names */
    className?: string;
    /** Variant: pills, tabs, or dropdown */
    variant?: 'pills' | 'tabs' | 'dropdown';
}

// ============================================
// CATEGORY CONFIGURATION
// ============================================

export const CATEGORIES: CategoryConfig[] = [
    {
        id: 'smart-tvs',
        label: 'Smart TVs',
        shortLabel: 'TVs',
        icon: <Tv className="w-4 h-4" />,
        description: 'Calculado por horas de tela ligada',
        consumptionModel: 'hours',
    },
    {
        id: 'geladeiras',
        label: 'Geladeiras',
        shortLabel: 'Geladeiras',
        icon: <Refrigerator className="w-4 h-4" />,
        description: 'Calculado por eficiência 24h',
        consumptionModel: 'continuous',
    },
    {
        id: 'lavadoras',
        label: 'Lavadoras',
        shortLabel: 'Lavadoras',
        icon: <WashingMachine className="w-4 h-4" />,
        description: 'Calculado por ciclos de lavagem',
        consumptionModel: 'cycles',
    },
    {
        id: 'ar-condicionado',
        label: 'Ar-Condicionado',
        shortLabel: 'Ar-Cond.',
        icon: <Wind className="w-4 h-4" />,
        description: 'Calculado por horas de uso diário',
        consumptionModel: 'hours',
    },
    {
        id: 'robo-aspiradores',
        label: 'Robôs Aspiradores',
        shortLabel: 'Robôs',
        icon: <Bot className="w-4 h-4" />,
        description: 'Custo é manutenção, não energia',
        consumptionModel: 'cycles',
    },
];

const DEFAULT_CATEGORY: TcoCategory = 'smart-tvs';
const PARAM_CATEGORY = 'category';

// ============================================
// HOOK: useCategory
// ============================================

export interface UseCategoryReturn {
    /** Current category */
    category: TcoCategory;
    /** Current category config */
    categoryConfig: CategoryConfig;
    /** Set category */
    setCategory: (category: TcoCategory) => void;
    /** All available categories */
    allCategories: CategoryConfig[];
}

export function useCategory(): UseCategoryReturn {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const category = useMemo((): TcoCategory => {
        const param = searchParams.get(PARAM_CATEGORY);
        const valid = CATEGORIES.find(c => c.id === param);
        return valid ? (param as TcoCategory) : DEFAULT_CATEGORY;
    }, [searchParams]);

    const categoryConfig = useMemo(
        () => CATEGORIES.find(c => c.id === category) || CATEGORIES[0],
        [category]
    );

    const setCategory = useCallback((newCategory: TcoCategory) => {
        const newParams = new URLSearchParams(searchParams.toString());

        if (newCategory === DEFAULT_CATEGORY) {
            newParams.delete(PARAM_CATEGORY);
        } else {
            newParams.set(PARAM_CATEGORY, newCategory);
        }

        const queryString = newParams.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

        router.push(newUrl, { scroll: false });
    }, [searchParams, pathname, router]);

    return {
        category,
        categoryConfig,
        setCategory,
        allCategories: CATEGORIES,
    };
}

// ============================================
// PILLS VARIANT
// ============================================

function CategoryPills({ className }: { className?: string }) {
    const { category, setCategory, allCategories } = useCategory();

    return (
        <div
            className={cn(
                'flex items-center gap-2 overflow-x-auto pb-2',
                'scrollbar-hide',
                className
            )}
            role="tablist"
            aria-label="Filtrar por categoria"
        >
            {allCategories.map((config) => {
                const isActive = category === config.id;

                return (
                    <button
                        key={config.id}
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setCategory(config.id)}
                        className={cn(
                            'flex items-center gap-2 px-4 py-2.5 rounded-xl',
                            'text-sm font-medium whitespace-nowrap',
                            'border-2 transition-all duration-200',
                            'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500',
                            isActive
                                ? 'bg-blue-500 border-blue-500 text-white shadow-md'
                                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        )}
                    >
                        {config.icon}
                        <span className="hidden sm:inline">{config.label}</span>
                        <span className="sm:hidden">{config.shortLabel}</span>
                    </button>
                );
            })}
        </div>
    );
}

// ============================================
// TABS VARIANT
// ============================================

function CategoryTabs({ className }: { className?: string }) {
    const { category, setCategory, allCategories, categoryConfig } = useCategory();

    return (
        <div className={cn('space-y-2', className)}>
            {/* Tabs */}
            <div
                className="flex border-b border-gray-200"
                role="tablist"
            >
                {allCategories.map((config) => {
                    const isActive = category === config.id;

                    return (
                        <button
                            key={config.id}
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => setCategory(config.id)}
                            className={cn(
                                'flex items-center gap-2 px-4 py-3',
                                'text-sm font-medium',
                                'border-b-2 -mb-px transition-all',
                                'focus:outline-none',
                                isActive
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            )}
                        >
                            {config.icon}
                            <span className="hidden md:inline">{config.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Description */}
            <p className="text-xs text-gray-500 pl-1">
                💡 {categoryConfig.description}
            </p>
        </div>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * CategoryFilter - Filter products by category for valid TCO comparison
 * 
 * TCO models are category-specific:
 * - TVs: Calculated by hours of screen time
 * - Refrigerators: Calculated by 24h efficiency
 * - Washers: Calculated by wash cycles
 * - AC: Calculated by daily usage hours
 * 
 * @example
 * ```tsx
 * <CategoryFilter variant="pills" />
 * <CategoryFilter variant="tabs" />
 * ```
 */
export function CategoryFilter({ className, variant = 'pills' }: CategoryFilterProps) {
    if (variant === 'tabs') {
        return <CategoryTabs className={className} />;
    }

    return <CategoryPills className={className} />;
}

// ============================================
// EXPORTS
// ============================================

export default CategoryFilter;
export { DEFAULT_CATEGORY, PARAM_CATEGORY };
