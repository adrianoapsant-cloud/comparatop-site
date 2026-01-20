'use client';

/**
 * @file CategoryPageClient.tsx
 * @description Client component para página de categoria (PLP)
 * 
 * Mantém toda lógica interativa:
 * - Filtros (marca, preço, dinâmicos)
 * - ComparaMatch (chips, preferences)
 * - Ordenação
 * - Paginação com pushState
 * - Chat context snapshot
 */

import { useState, useMemo, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MethodologyCard } from '@/components/MethodologyCard';
import { EditorialWinners } from '@/components/EditorialWinners';
import { CategoryFilters, FilterState } from '@/components/CategoryFilters';
import { MatchFilterRibbon, useMatchFilters } from '@/components/MatchFilterRibbon';
import { HybridProductList } from '@/components/HybridProductList';
import { useResponsivePagination } from '@/hooks/useIsMobile';
import { scoreProduct } from '@/lib/scoring';
import { calculateMatchScore, getCriteriaForCategory } from '@/core/match';
import type { MatchResult } from '@/core/match/types';
import { getCategoryById } from '@/config/categories';
import { getProductsByCategory } from '@/data/products';
import { useChat } from '@/contexts/ChatContext';
import type { ScoredProduct } from '@/types/category';
import type { ProductCardVM } from '@/lib/viewmodels/productCardVM';
import { TcoEngineSection, TcoToolbar } from '@/components/tco';
import { useDisplayView } from '@/hooks/use-url-state';

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
// COMPONENT PROPS
// ============================================

export interface CategoryPageClientProps {
    categoryId: string;
    categorySlug: string;
    categoryName: string;
    initialCards: ProductCardVM[];
    /** Products fetched from Supabase (DB source of truth) */
    initialProducts?: ScoredProduct[];
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function CategoryPageClient({
    categoryId,
    categorySlug,
    categoryName,
    initialCards,
    initialProducts,
}: CategoryPageClientProps) {
    // Get category data (for icon and other metadata)
    const category = getCategoryById(categoryId);

    // State
    const { initialCount, loadMoreCount, isMobile } = useResponsivePagination();
    const [visibleCount, setVisibleCount] = useState(initialCount);
    const [sortBy, setSortBy] = useState<'quality' | 'price' | 'value'>('quality');
    const [filters, setFilters] = useState<FilterState>({
        priceRange: [0, 20000],
        brands: [],
        dynamicFilters: {},
    });

    // Display view state (Grid vs Table)
    const { isGridView, isTableView } = useDisplayView();

    // ============================================
    // PRODUCTS: Prefer Supabase (initialProducts), fallback to file data
    // ============================================
    const rawProducts = getProductsByCategory(categoryId);
    const scoredProducts: ScoredProduct[] = useMemo(() => {
        // If we have Supabase products, use them (already scored)
        if (initialProducts && initialProducts.length > 0) {
            console.log(`[CategoryPageClient] Using ${initialProducts.length} products from Supabase`);
            return initialProducts;
        }

        // Fallback to file-based products (need scoring)
        if (!category) return [];
        console.log(`[CategoryPageClient] Fallback: Using ${rawProducts.length} products from file`);
        return rawProducts.map(p => scoreProduct(p, category));
    }, [initialProducts, rawProducts, category]);

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

    // Sort products by overall score (highest first by default)
    const sortedProducts = useMemo(() => {
        return [...filteredProducts].sort((a, b) => {
            switch (sortBy) {
                case 'price':
                    return a.price - b.price;
                case 'value':
                    return (b.computed?.vs ?? 0) - (a.computed?.vs ?? 0);
                case 'quality':
                default:
                    return (b.computed?.overall ?? 0) - (a.computed?.overall ?? 0);
            }
        });
    }, [filteredProducts, sortBy]);

    // ============================================
    // COMPARAMATCH INTEGRATION
    // ============================================

    // Get criteria config for this category (dynamic loading)
    const matchCriteria = useMemo(() => {
        return getCriteriaForCategory(categorySlug);
    }, [categorySlug]);

    // Match filter state
    const { chips, setChips, preferences, hasActiveFilters: hasMatchFilters } = useMatchFilters(
        matchCriteria,
        categoryId
    );

    // Read URL params from quiz navigation (Suspended)
    // This needs to be in a Suspense boundary for Next.js 16+ prerender
    function SearchParamsHandler() {
        const searchParams = useSearchParams();
        const goldParam = searchParams.get('gold');
        const silverParam = searchParams.get('silver');

        // Apply URL params to chips on mount
        useEffect(() => {
            if (!goldParam && !silverParam) return;
            if (chips.length === 0) return;

            const silverIds = silverParam?.split(',').filter(Boolean) || [];

            setChips(prevChips => prevChips.map(chip => {
                if (chip.criteriaId === goldParam) {
                    return { ...chip, level: 'gold' as const };
                }
                if (silverIds.includes(chip.criteriaId)) {
                    return { ...chip, level: 'silver' as const };
                }
                return chip;
            }));
        }, [goldParam, silverParam]);

        return null; // This component only handles side effects
    }

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

    // Update catalog snapshot for chat context
    const { updateCatalogSnapshot } = useChat();
    const lastSnapshotKeyRef = useRef<string>('');

    useEffect(() => {
        if (visibleProducts.length === 0) return;

        const snapshotKey = visibleProducts.map(p => p.id).join(',');

        if (snapshotKey === lastSnapshotKeyRef.current) return;
        lastSnapshotKeyRef.current = snapshotKey;

        updateCatalogSnapshot(visibleProducts.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            score: p.computed?.overall ?? 0,
            category: categoryId
        })));
    }, [visibleProducts, categoryId, updateCatalogSnapshot]);

    // Calculate current page for SEO fallback
    const currentPage = Math.ceil(visibleCount / loadMoreCount);
    const nextPage = currentPage + 1;

    // Handle load more with pushState for SEO
    const loadMore = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const newCount = Math.min(visibleCount + loadMoreCount, finalProducts.length);
        setVisibleCount(newCount);

        // Update URL for browser history (SEO-friendly)
        const newPage = Math.ceil(newCount / loadMoreCount);
        if (typeof window !== 'undefined') {
            window.history.pushState(
                { page: newPage, count: newCount },
                '',
                `?page=${newPage}`
            );
        }
    };

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
                        Não encontramos a categoria "{categorySlug}".
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
            {/* Search Params Handler (Suspended for SSR) */}
            <Suspense fallback={null}>
                <SearchParamsHandler />
            </Suspense>

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

            {/* TCO Engine Section - ONLY visible in Grid mode as a bonus section */}
            {isGridView && (
                <div className="max-w-7xl mx-auto px-4">
                    <TcoEngineSection
                        products={sortedProducts}
                        categorySlug={categorySlug}
                        categoryName={categoryName}
                        defaultExpanded={false}
                    />
                </div>
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
                            {/* TCO Toolbar - Command Island */}
                            <TcoToolbar
                                productCount={filteredProducts.length}
                                sticky={false}
                                className="mb-6"
                            />

                            {/* Section Header */}
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-display text-lg font-semibold text-text-primary">
                                    {isTableView ? '📊 Análise de Engenharia' : '📋 Todos os Produtos'} ({filteredProducts.length})
                                </h2>

                                {/* Sort Dropdown - Only visible in Grid mode */}
                                {isGridView && (
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
                                )}
                            </div>

                            {/* CONDITIONAL RENDERING: Grid or Table */}
                            {isTableView ? (
                                // TABLE VIEW: Full Engineering Analysis with TCO
                                <div className="bg-white rounded-xl border border-gray-200 p-4">
                                    <TcoEngineSection
                                        products={sortedProducts}
                                        categorySlug={categorySlug}
                                        categoryName={categoryName}
                                        defaultExpanded={true}
                                    />
                                </div>
                            ) : (
                                // GRID VIEW: Visual Product Cards
                                <>
                                    <HybridProductList
                                        products={visibleProducts}
                                        matchResults={matchResults}
                                        hasMatchFilters={hasMatchFilters}
                                    />

                                    {/* Load More - SEO-friendly anchor with pushState */}
                                    {hasMore && (
                                        <div className="mt-8 text-center">
                                            <a
                                                href={`/categorias/${categorySlug}?page=${nextPage}`}
                                                onClick={loadMore}
                                                className={cn(
                                                    'inline-flex items-center gap-2 px-8 py-4 rounded-xl',
                                                    'bg-white border border-gray-200',
                                                    'font-body font-semibold text-text-primary',
                                                    'hover:bg-gray-50 hover:border-brand-core',
                                                    'transition-all shadow-sm hover:shadow-md'
                                                )}
                                            >
                                                <span>Carregar Mais Produtos</span>
                                                <span className="text-sm text-text-muted">({finalProducts.length - visibleCount} restantes)</span>
                                            </a>
                                            <p className="mt-2 text-xs text-text-muted">
                                                Página {currentPage} de {Math.ceil(finalProducts.length / loadMoreCount)}
                                            </p>
                                        </div>
                                    )}
                                </>
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
