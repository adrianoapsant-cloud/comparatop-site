// ============================================================================
// COMPARADOR - Value Engineering Dashboard
// ============================================================================
// Main integration page for TCO analysis and comparison
// Server Component that reads URL params and renders client components
// NOW WITH CATEGORY FILTERING - Only compare "apples to apples"
// ============================================================================

import { Suspense } from 'react';
import { Metadata } from 'next';
import type { UsagePersona, TcoViewMode, ProductTcoData } from '@/types/tco';
import { getProductsForCategory, getCuratedExampleProducts, calculateTotalTco, rankByTco } from '@/lib/tco';
import type { TcoCategory } from '@/lib/tco/mock-data';

// Client Components
import { ComparadorClient } from './comparador-client';

// ============================================
// METADATA
// ============================================

export const metadata: Metadata = {
    title: 'Engenharia de Valor | ComparaTop',
    description: 'Análise de TCO (Custo Total de Propriedade) e Risco de Obsolescência. Compare o custo real de produtos além do preço de etiqueta.',
    openGraph: {
        title: 'Engenharia de Valor - Análise de TCO | ComparaTop',
        description: 'Descubra o custo REAL dos produtos. TCO inclui energia, manutenção e revenda.',
    },
};

// ============================================
// TYPES
// ============================================

interface PageProps {
    searchParams: Promise<{
        view?: string;
        persona?: string;
        years?: string;
        category?: string;
    }>;
}

interface WinnerHighlights {
    bestTco: ProductTcoData;
    lowestRisk: ProductTcoData;
    bestValue: ProductTcoData;
}

// ============================================
// VALID CATEGORIES
// ============================================

const VALID_CATEGORIES: TcoCategory[] = ['smart-tvs', 'geladeiras', 'lavadoras', 'ar-condicionado'];
const DEFAULT_CATEGORY: TcoCategory = 'smart-tvs';

// ============================================
// SERVER-SIDE DATA FUNCTIONS
// ============================================

type ParsedParams = {
    view: TcoViewMode;
    persona: UsagePersona;
    years: number;
    category: TcoCategory;
};

function parseSearchParams(params: PageProps['searchParams'] extends Promise<infer T> ? T : never): ParsedParams {
    // Parse view mode
    const view: TcoViewMode = params.view === 'tco' ? 'tco' : 'price';

    // Parse persona
    const validPersonas: UsagePersona[] = ['gamer', 'eco', 'family'];
    const persona: UsagePersona = validPersonas.includes(params.persona as UsagePersona)
        ? (params.persona as UsagePersona)
        : 'family';

    // Parse years
    const years = parseInt(params.years || '5', 10);
    const validYears = isNaN(years) || years < 1 || years > 15 ? 5 : years;

    // Parse category - MANDATORY, defaults to smart-tvs
    const category: TcoCategory = VALID_CATEGORIES.includes(params.category as TcoCategory)
        ? (params.category as TcoCategory)
        : DEFAULT_CATEGORY;

    return { view, persona, years: validYears, category };
}

function calculateWinners(
    products: ProductTcoData[],
    persona: UsagePersona,
    years: number
): WinnerHighlights {
    if (products.length === 0) {
        throw new Error('No products to calculate winners');
    }

    // Rank by TCO
    const ranked = rankByTco(products, { persona, years });
    const bestTco = ranked[0].product;

    // Lowest Risk (highest SCRS score)
    const byRisk = [...products].sort((a, b) => b.scrsScore - a.scrsScore);
    const lowestRisk = byRisk[0];

    // Best Value (best TCO among products with good SCRS >= 6)
    const goodRisk = products.filter(p => p.scrsScore >= 6);
    const rankedGood = rankByTco(goodRisk.length > 0 ? goodRisk : products, { persona, years });
    const bestValue = rankedGood[0].product;

    return { bestTco, lowestRisk, bestValue };
}

// ============================================
// PAGE COMPONENT (Server)
// ============================================

export default async function ComparadorPage({ searchParams }: PageProps) {
    // Await the searchParams promise (Next.js 15+ pattern)
    const params = await searchParams;

    // Parse URL parameters (including category)
    const { view, persona, years, category } = parseSearchParams(params);

    // Generate products FOR THIS CATEGORY ONLY
    const products = getProductsForCategory(category, 10);

    // Calculate winners within the category
    const winners = calculateWinners(products, persona, years);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
            <Suspense fallback={<ComparadorSkeleton />}>
                <ComparadorClient
                    initialProducts={products}
                    initialWinners={winners}
                    initialView={view}
                    initialPersona={persona}
                    initialYears={years}
                    initialCategory={category}
                />
            </Suspense>
        </div>
    );
}

// ============================================
// INLINE SKELETON
// ============================================

function ComparadorSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse mb-8" />
            <div className="h-12 w-full max-w-2xl bg-gray-200 rounded-xl animate-pulse mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-[400px] bg-gray-200 rounded-2xl animate-pulse" />
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-28 bg-gray-200 rounded-2xl animate-pulse" />
                    ))}
                </div>
            </div>
        </div>
    );
}
