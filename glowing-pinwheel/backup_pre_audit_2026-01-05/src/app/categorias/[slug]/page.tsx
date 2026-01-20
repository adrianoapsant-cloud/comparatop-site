'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Grid3X3, List, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MethodologyCard } from '@/components/MethodologyCard';
import { EditorialWinners } from '@/components/EditorialWinners';
import { CategoryFilters, FilterState } from '@/components/CategoryFilters';
import { MatchFilterRibbon, useMatchFilters } from '@/components/MatchFilterRibbon';
import { AnimatedProductList } from '@/components/AnimatedProductList';
import { formatPrice } from '@/lib/l10n';
import { scoreProduct } from '@/lib/scoring';
import { calculateMatchScore, rankProductsByMatch, getCriteriaForCategory } from '@/core/match';
import type { CriteriaConfig, MatchResult } from '@/core/match/types';
import { getCategoryById, getAllCategories } from '@/config/categories';
import { getProductsByCategory } from '@/data/products';
import { useComparison } from '@/contexts/ComparisonContext';
import type { ScoredProduct } from '@/types/category';

// ============================================
// CATEGORY SLUGS MAPPING
// ============================================

const SLUG_TO_CATEGORY: Record<string, string> = {
    'smart-tvs': 'tv',
    'geladeiras': 'fridge',
    'ar-condicionados': 'air_conditioner',
    'notebooks': 'notebook',
    'smartphones': 'smartphone',
    'fones-bluetooth': 'headphones',
    'smartwatches': 'smartwatch',
    'cafeteiras': 'coffee_maker',
    'aspiradores': 'vacuum',
    'lavadoras': 'washer',
    'monitores': 'monitor',
    'soundbars': 'soundbar',
};

const CATEGORY_TO_SLUG: Record<string, string> = Object.fromEntries(
    Object.entries(SLUG_TO_CATEGORY).map(([k, v]) => [v, k])
);

// ============================================
// DYNAMIC FILTER OPTIONS BY CATEGORY
// ============================================

const DYNAMIC_FILTERS: Record<string, { label: string; key: string; options: { value: string; label: string }[] }[]> = {
    tv: [
        {
            label: '📺 Tamanho',
            key: 'size',
            options: [
                { value: '43', label: '43"' },
                { value: '50', label: '50"' },
                { value: '55', label: '55"' },
                { value: '65', label: '65"' },
                { value: '75+', label: '75"+' },
            ],
        },
        {
            label: '🖥️ Tecnologia',
            key: 'panelType',
            options: [
                { value: 'led', label: 'LED' },
                { value: 'qled', label: 'QLED' },
                { value: 'oled', label: 'OLED' },
                { value: 'miniled', label: 'Mini-LED' },
            ],
        },
    ],
    air_conditioner: [
        {
            label: '❄️ Capacidade (BTUs)',
            key: 'btus',
            options: [
                { value: '9000', label: '9.000' },
                { value: '12000', label: '12.000' },
                { value: '18000', label: '18.000' },
                { value: '24000+', label: '24.000+' },
            ],
        },
        {
            label: '⚡ Tipo',
            key: 'type',
            options: [
                { value: 'split', label: 'Split' },
                { value: 'inverter', label: 'Inverter' },
                { value: 'portatil', label: 'Portátil' },
            ],
        },
    ],
    fridge: [
        {
            label: '📏 Capacidade',
            key: 'capacity',
            options: [
                { value: '300', label: 'Até 300L' },
                { value: '400', label: '300-400L' },
                { value: '500', label: '400-500L' },
                { value: '600+', label: '500L+' },
            ],
        },
        {
            label: '🚪 Configuração',
            key: 'doorType',
            options: [
                { value: 'single', label: '1 Porta' },
                { value: 'double', label: '2 Portas' },
                { value: 'french', label: 'French Door' },
                { value: 'sidebyside', label: 'Side by Side' },
            ],
        },
    ],
};

// ============================================
// MAIN CATEGORY PAGE
// ============================================

export default function CategoryPage() {
    const params = useParams();
    const slug = params.slug as string;

    // Get category data
    const categoryId = SLUG_TO_CATEGORY[slug] || slug;
    const category = getCategoryById(categoryId);

    // State
    const [visibleCount, setVisibleCount] = useState(6);
    const [sortBy, setSortBy] = useState<'quality' | 'price' | 'value'>('quality');
    const [filters, setFilters] = useState<FilterState>({
        priceRange: [0, 20000],
        brands: [],
        dynamicFilters: {},
    });

    // Get and score products
    const rawProducts = getProductsByCategory(categoryId);
    const scoredProducts: ScoredProduct[] = useMemo(() => {
        if (!category) return [];
        return rawProducts.map(p => scoreProduct(p, category));
    }, [rawProducts, category]);

    // Extract brands and price range
    const allBrands = useMemo(() =>
        [...new Set(scoredProducts.map(p => p.brand))].sort(),
        [scoredProducts]
    );

    const priceRange: [number, number] = useMemo(() => {
        if (scoredProducts.length === 0) return [0, 10000];
        const prices = scoredProducts.map(p => p.price);
        return [Math.min(...prices), Math.max(...prices)];
    }, [scoredProducts]);

    // Apply filters
    const filteredProducts = useMemo(() => {
        return scoredProducts.filter(p => {
            // Price filter
            if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) {
                return false;
            }
            // Brand filter
            if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) {
                return false;
            }
            return true;
        });
    }, [scoredProducts, filters]);

    // Sort products
    const sortedProducts = useMemo(() => {
        return [...filteredProducts].sort((a, b) => {
            switch (sortBy) {
                case 'price':
                    return a.price - b.price;
                case 'value':
                    return (b.scores?.value ?? 0) - (a.scores?.value ?? 0);
                case 'quality':
                default:
                    return (b.scores?.quality ?? 0) - (a.scores?.quality ?? 0);
            }
        });
    }, [filteredProducts, sortBy]);

    // ============================================
    // COMPARAMATCH INTEGRATION
    // ============================================

    // Get criteria config for this category (dynamic loading)
    const matchCriteria = useMemo(() => {
        return getCriteriaForCategory(slug);
    }, [slug]);

    // Match filter state
    const { chips, setChips, preferences, hasActiveFilters: hasMatchFilters } = useMatchFilters(
        matchCriteria,
        categoryId
    );

    // Calculate match scores for all products
    const matchResults = useMemo(() => {
        if (!hasMatchFilters || matchCriteria.length === 0) return new Map<string, MatchResult>();

        const results = new Map<string, MatchResult>();
        for (const product of filteredProducts) {
            const result = calculateMatchScore(
                product as unknown as Record<string, unknown>,
                preferences,
                matchCriteria
            );
            results.set(product.id, result);
        }
        return results;
    }, [filteredProducts, preferences, hasMatchFilters, matchCriteria]);

    // Sort by match score if filters are active
    const finalProducts = useMemo(() => {
        if (!hasMatchFilters) return sortedProducts;

        return [...sortedProducts].sort((a, b) => {
            const matchA = matchResults.get(a.id)?.matchScore ?? 0;
            const matchB = matchResults.get(b.id)?.matchScore ?? 0;
            return matchB - matchA; // Higher match first
        });
    }, [sortedProducts, hasMatchFilters, matchResults]);

    // Visible products
    const visibleProducts = finalProducts.slice(0, visibleCount);
    const hasMore = visibleCount < finalProducts.length;

    // Handle load more
    const loadMore = () => {
        setVisibleCount(prev => Math.min(prev + 6, finalProducts.length));
    };

    // Category name
    const categoryName = category?.name || slug.replace(/-/g, ' ');

    // Dynamic filters for this category
    const dynamicOptions = DYNAMIC_FILTERS[categoryId] || [];

    if (!category) {
        return (
            <div className="min-h-screen bg-bg-ground py-12 px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="font-display text-2xl font-bold text-text-primary mb-4">
                        Categoria não encontrada
                    </h1>
                    <p className="text-text-secondary mb-6">
                        Não encontramos a categoria "{slug}".
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-brand-core text-white rounded-lg"
                    >
                        <ArrowLeft size={16} />
                        Voltar para Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-ground">
            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 py-4">
                <nav className="flex items-center gap-2 text-sm text-text-muted">
                    <Link href="/" className="hover:text-brand-core transition-colors">
                        Home
                    </Link>
                    <span>/</span>
                    <span className="text-text-primary font-medium">{categoryName}</span>
                </nav>
            </div>

            {/* Category Header */}
            <header className="max-w-7xl mx-auto px-4 mb-6">
                <div className="flex items-center gap-3 mb-2">
                    {category.icon && (
                        <div className="w-10 h-10 rounded-xl bg-brand-core/10 flex items-center justify-center text-brand-core">
                            <span className="text-xl">📦</span>
                        </div>
                    )}
                    <div>
                        <h1 className="font-display text-2xl md:text-3xl font-bold text-text-primary">
                            {categoryName}
                        </h1>
                        <p className="text-sm text-text-muted">
                            {scoredProducts.length} produtos analisados
                        </p>
                    </div>
                </div>
            </header>

            {/* Audit Methodology Card */}
            <div className="max-w-7xl mx-auto px-4 mb-4">
                <MethodologyCard categoryName={categoryName} categorySlug={categoryId} />
            </div>

            {/* ComparaMatch Filter Ribbon */}
            {matchCriteria.length > 0 && (
                <MatchFilterRibbon
                    criteria={matchCriteria}
                    chips={chips}
                    onChipsChange={setChips}
                    className="max-w-7xl mx-auto mb-6"
                />
            )}

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 pb-24">
                <div className="flex gap-8">
                    {/* Filters Sidebar */}
                    <CategoryFilters
                        brands={allBrands}
                        priceRange={priceRange}
                        dynamicOptions={dynamicOptions}
                        filters={filters}
                        onFilterChange={setFilters}
                        resultCount={filteredProducts.length}
                    />

                    {/* Main Column */}
                    <main className="flex-1 min-w-0">
                        {/* Editorial Winners */}
                        <EditorialWinners
                            products={sortedProducts}
                            categoryName={categoryName}
                        />

                        {/* Rest of Products */}
                        <section>
                            {/* Section Header */}
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-display text-lg font-semibold text-text-primary">
                                    📋 Todos os Produtos ({filteredProducts.length})
                                </h2>

                                {/* Sort Dropdown */}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-text-muted hidden sm:inline">Ordenar:</span>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as 'quality' | 'price' | 'value')}
                                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                                    >
                                        <option value="quality">Melhor Avaliados</option>
                                        <option value="value">Custo-Benefício</option>
                                        <option value="price">Menor Preço</option>
                                    </select>
                                </div>
                            </div>

                            {/* Animated Product List */}
                            <AnimatedProductList
                                products={visibleProducts}
                                matchResults={matchResults}
                                hasMatchFilters={hasMatchFilters}
                            />

                            {/* Load More */}
                            {hasMore && (
                                <div className="mt-6 text-center">
                                    <button
                                        onClick={loadMore}
                                        className={cn(
                                            'px-6 py-3 rounded-xl',
                                            'bg-white border border-gray-200',
                                            'font-body font-semibold text-text-primary',
                                            'hover:bg-gray-50 hover:border-gray-300',
                                            'transition-colors'
                                        )}
                                    >
                                        Carregar Mais ({sortedProducts.length - visibleCount} restantes)
                                    </button>
                                </div>
                            )}

                            {/* Empty State */}
                            {filteredProducts.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-lg text-text-muted mb-4">
                                        Nenhum produto encontrado com esses filtros.
                                    </p>
                                    <button
                                        onClick={() => setFilters({
                                            priceRange,
                                            brands: [],
                                            dynamicFilters: {},
                                        })}
                                        className="text-brand-core font-medium hover:underline"
                                    >
                                        Limpar filtros
                                    </button>
                                </div>
                            )}
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
}
