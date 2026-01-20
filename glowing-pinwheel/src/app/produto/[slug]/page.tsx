import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { ProductDetailPage } from '@/components/ProductDetailPage';
import { ProductJsonLd, getCategoryInfo } from '@/components/ProductJsonLd';
// SSOT: Migrated from @/data/products to productService
import { getProductBySlug, getAllProducts } from '@/lib/services/productService';
import type { ProductVM } from '@/lib/viewmodels/productVM';
import { getLayoutStrategy, type LayoutMode } from '@/lib/layout-strategy';
import banditService from '@/lib/mab/bandit-service';
import { trackImpression } from '@/app/actions/bandit-reward';
import type { Metadata } from 'next';
import { getDemoProduct, isDemoSlug, DEMO_PRODUCTS } from '@/data/scoring-mocks';
import { enhanceProductWithScoring } from '@/lib/scoring/extract-facts';
import type { Product } from '@/types/category';

// ============================================
// OWNERSHIP INSIGHTS (Shadow Engine Integration)
// ============================================
import { analyzeProductOwnership } from '@/lib/scoring/product-ownership';
import OwnershipInsights from '@/components/product/OwnershipInsights';
import { OwnershipInsightsExpanded } from '@/components/product/OwnershipInsightsExpanded';
import { getExpandedMetricsFromSIC, hasComponentMapping } from '@/lib/scoring/component-engine';

// ============================================
// CONTEXTUAL SCORING (HMUM Integration)
// ============================================
import ContextScoreSection from '@/components/product/ContextScoreSection';

// ============================================
// UNKNOWN UNKNOWNS (Engenharia Oculta - Product-Specific)
// ============================================
import { ProductUnknownUnknownsWidget } from '@/components/pdp/ProductUnknownUnknownsWidget';

// ============================================
// DECISION FAQ (Quebra de Objeção Final)
// ============================================
import { DecisionFAQWrapper } from '@/components/pdp/DecisionFAQWrapper';

// ============================================
// TYPES
// ============================================

interface ProductPageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ forceLayout?: string }>;
}

// ============================================
// STATIC PARAMS
// ============================================

// Generate static params for all products
// SSOT: Uses getAllProducts() from productService
export async function generateStaticParams() {
    // Include both real products and demo products
    const allProducts = getAllProducts();
    const realProducts = allProducts.map((product) => ({
        slug: product.id,
    }));

    const demoProducts = DEMO_PRODUCTS.map((demo) => ({
        slug: demo.slug,
    }));

    return [...realProducts, ...demoProducts];
}

// ============================================
// METADATA
// ============================================

import {
    checkProductIndexing,
    ROBOTS_INDEX,
    ROBOTS_NOINDEX,
    type ProductIndexingMetrics,
} from '@/config/seo-strategy';

/**
 * Converte um produto para métricas de indexação
 * Simula score de popularidade baseado em dados disponíveis
 */
function toIndexingMetrics(product: Product): ProductIndexingMetrics {
    let popularityScore = 50;

    if (product.offers && product.offers.length > 0) {
        popularityScore += product.offers.length * 10;
    }
    if (product.price && product.price < 2000) {
        popularityScore += 15;
    } else if (product.price && product.price < 5000) {
        popularityScore += 10;
    }
    if (product.badges?.includes('editors-choice')) {
        popularityScore += 20;
    }
    if (product.badges?.includes('best-value')) {
        popularityScore += 15;
    }

    popularityScore = Math.min(100, Math.max(0, popularityScore));

    return {
        id: product.id,
        slug: product.id,
        popularityScore,
        hasFullContent: Boolean(product.benefitSubtitle && product.scores),
        offerCount: product.offers?.length || 0,
    };
}

// Generate metadata for SEO with Progressive Indexing
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { slug } = await params;

    // Check if this is a demo product
    if (isDemoSlug(slug)) {
        const demo = getDemoProduct(slug);
        if (demo) {
            return {
                title: `${demo.name} | Lab Demo | ComparaTop`,
                description: `Demo do sistema de Scoring Contextual para ${demo.category}`,
                robots: { index: false, follow: false },
            };
        }
    }

    // SSOT: Uses getProductBySlug from productService
    const productVM = getProductBySlug(slug);

    if (!productVM) {
        return { title: 'Produto não encontrado | ComparaTop' };
    }

    // Compatibility layer: extract raw product for legacy functions
    const product = productVM.raw;

    // =========================================
    // INDEXAÇÃO PROGRESSIVA
    // =========================================
    // Verificar se o produto deve ser indexado
    const allProducts = getAllProducts();
    const allProductMetrics = allProducts.map(p => toIndexingMetrics(p.raw as Product));
    const indexingDecision = checkProductIndexing(product.id, allProductMetrics);

    // Log para debug (remover em produção)
    console.log('[SEO] Indexing decision for', product.id, ':', indexingDecision);

    // Build OG Image URL with dynamic parameters
    const ogParams = new URLSearchParams({
        type: 'product',
        title: product.shortName || product.name,
        ...(product.price && { price: product.price.toString() }),
        ...(product.categoryId && { category: getCategoryDisplayName(product.categoryId) }),
    });

    // Add score if available
    if (product.scores) {
        const scoreValues = Object.values(product.scores);
        if (scoreValues.length > 0) {
            const avgScore = scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length;
            ogParams.set('score', avgScore.toFixed(1));
        }
    }

    // Add badge if product has special badges
    if (product.badges?.includes('editors-choice')) {
        ogParams.set('badge', 'Escolha dos Editores');
    } else if (product.badges?.includes('best-value')) {
        ogParams.set('badge', 'Melhor Custo-Benefício');
    }

    const ogImageUrl = `/api/og?${ogParams.toString()}`;

    return {
        title: `${product.name} | Análise Completa | ComparaTop`,
        description: product.benefitSubtitle || `Análise editorial completa do ${product.name}. Compare preços, especificações e veja se vale a pena.`,
        // Robots tag baseada na decisão de indexação progressiva
        robots: indexingDecision.shouldIndex ? ROBOTS_INDEX : ROBOTS_NOINDEX,
        openGraph: {
            title: product.name,
            description: product.benefitSubtitle || `Análise completa e preços de ${product.name}`,
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: `${product.name} - Análise ComparaTop`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: product.benefitSubtitle || `Análise editorial de ${product.name}`,
            images: [ogImageUrl],
        },
    };
}


// Helper to get category display name
function getCategoryDisplayName(categoryId: string): string {
    const names: Record<string, string> = {
        'tv': 'Smart TVs',
        'fridge': 'Geladeiras',
        'air_conditioner': 'Ar-Condicionado',
        'washer': 'Máquinas de Lavar',
    };
    return names[categoryId] || categoryId;
}

// ============================================
// MAB LAYOUT VARIANTS
// ============================================

// Define available layout variants for MAB testing
const LAYOUT_VARIANTS = ['layout_visual', 'layout_tecnico', 'layout_balanceado'] as const;
type LayoutVariant = typeof LAYOUT_VARIANTS[number];

// Map MAB variants to layout modes
const VARIANT_TO_MODE: Record<LayoutVariant, LayoutMode> = {
    'layout_visual': 'visual',
    'layout_tecnico': 'technical',
    'layout_balanceado': 'visual', // balanced uses visual as base
};

// ============================================
// PAGE COMPONENT
// ============================================

// Convert demo product to Product type for rendering
function demoToProduct(demo: ReturnType<typeof getDemoProduct>): Product | null {
    if (!demo) return null;

    // Default scores for demo products (c1-c10 format from category.ts)
    const defaultScores: Record<string, number> = {
        c1: 8, // Custo-Benefício
        c2: 8, // Eficiência/Qualidade
        c3: 8, // Confiabilidade
        c4: 8, // Performance
        c5: 8, // Recursos Especiais
        c6: 8, // Ruído/Brilho
        c7: 8, // Pós-Venda
        c8: 8, // Som/Recursos
        c9: 8, // Conectividade
        c10: 8, // Design
    };

    // Generate a mock competitor for the VS Battle Bar
    const rivalBrand = demo.name.includes('LG') ? 'Samsung' :
        demo.name.includes('Samsung') ? 'LG' :
            demo.name.includes('Brastemp') ? 'Electrolux' :
                demo.name.includes('Electrolux') ? 'Brastemp' : 'Concorrente';

    const rivalName = `${rivalBrand} ${demo.category} Premium`;
    const rivalPrice = Math.round(demo.price * (0.9 + Math.random() * 0.2)); // ±10% price

    return {
        id: demo.slug,
        categoryId: demo.categorySlug,
        name: demo.name,
        shortName: demo.name.split(' ').slice(0, 3).join(' '),
        brand: demo.name.split(' ')[0],
        model: demo.name,
        price: demo.price,
        imageUrl: demo.image || '/images/placeholder.jpg',
        scores: defaultScores,
        technicalSpecs: demo.facts as Record<string, string | number | boolean>,
        scoring_facts: demo.facts,
        scoring_category: demo.categorySlug,
        benefitSubtitle: `Demo do Scoring Contextual - ${demo.category}`,
        offers: [],
        lastUpdated: new Date().toISOString().split('T')[0],
        // Add mainCompetitor for VS Battle Bar
        mainCompetitor: {
            id: `rival-${demo.categorySlug}`,
            name: rivalName,
            shortName: rivalBrand,
            price: rivalPrice,
            score: 7.8,
            keyDifferences: [
                { label: 'Preço', current: `R$ ${demo.price.toLocaleString('pt-BR')}`, rival: `R$ ${rivalPrice.toLocaleString('pt-BR')}`, winner: demo.price < rivalPrice ? 'current' : 'rival' as const },
                { label: 'Nota', current: '8.0', rival: '7.8', winner: 'current' as const },
                { label: 'Contexto', current: 'Variável', rival: 'Fixo', winner: 'current' as const },
            ],
        },
    } as Product;
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
    const { slug } = await params;
    const { forceLayout } = await searchParams;

    // DEBUG: Log what product is being rendered
    console.log(`[PAGE DEBUG] Slug: ${slug}, isDemoSlug: ${isDemoSlug(slug)}`);

    // ========================================
    // DEMO PRODUCT INTERCEPTION (Lab Mode)
    // ========================================
    if (isDemoSlug(slug)) {
        const demoData = getDemoProduct(slug);
        const demoProduct = demoToProduct(demoData);

        if (!demoProduct) {
            notFound();
        }

        console.log('[LAB MODE] Rendering demo product:', slug, demoData?.categorySlug);

        return (
            <ProductDetailPage
                product={demoProduct}
                layoutMode="visual"
                layoutReason="Lab Demo Mode"
                layoutId="demo"
                isDebug={true}
            />
        );
    }

    // Normal product flow
    // SSOT: Uses getProductBySlug from productService
    const productVM = getProductBySlug(slug);

    if (!productVM) {
        notFound();
    }

    // Extract raw product for legacy components (compatibility layer)
    const rawProduct = productVM.raw as Product;

    // Enhance product with contextual scoring data
    const product = enhanceProductWithScoring(rawProduct);

    // ========================================
    // DEBUG: Force Layout Override
    // Usage: /produto/slug?forceLayout=layout_visual
    // ========================================
    let selectedLayoutId: LayoutVariant;
    let selectedArm: { id: string; conversionRate: number; impressions: number };
    let isForced = false;

    if (forceLayout && LAYOUT_VARIANTS.includes(forceLayout as LayoutVariant)) {
        // Debug mode: bypass MAB and use forced layout
        selectedLayoutId = forceLayout as LayoutVariant;
        selectedArm = { id: selectedLayoutId, conversionRate: 0, impressions: 0 };
        isForced = true;
        console.log('[MAB DEBUG] Forced layout override:', selectedLayoutId);
    } else {
        // Normal mode: use MAB for layout selection
        selectedArm = await banditService.selectArm([...LAYOUT_VARIANTS]);
        selectedLayoutId = selectedArm.id as LayoutVariant;

        // Track impression asynchronously (non-blocking)
        // Don't await - let it run in background
        trackImpression(selectedLayoutId).catch((err) => {
            console.error('[MAB] Failed to track impression:', err);
        });
    }

    const mabMode = VARIANT_TO_MODE[selectedLayoutId] || 'visual';

    // ========================================
    // FALLBACK: Deterministic Strategy (Fase 1)
    // ========================================
    // Still get referer-based strategy for fallback config
    const headersList = await headers();
    const referer = headersList.get('referer');
    const layoutStrategy = getLayoutStrategy(referer, product.categoryId || 'default');

    // Log for debugging (remove in production)
    console.log('[MAB + LayoutStrategy]', {
        mabSelectedLayout: selectedLayoutId,
        mabConversionRate: (selectedArm.conversionRate * 100).toFixed(2) + '%',
        mabImpressions: selectedArm.impressions,
        isForced: isForced,
        fallbackMode: layoutStrategy.mode,
        category: product.categoryId,
    });

    // ========================================
    // COMPUTE SCORE FOR JSON-LD
    // ========================================
    let computedScore: number | undefined;
    if (product.scores) {
        const scoreValues = Object.values(product.scores);
        if (scoreValues.length > 0) {
            computedScore = scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length;
        }
    }

    // Get category info for structured data
    const categoryInfo = getCategoryInfo(product.categoryId || 'default');

    // ========================================
    // OWNERSHIP INSIGHTS (Shadow Metrics)
    // ========================================
    const ownershipAnalysis = analyzeProductOwnership(rawProduct);

    // ========================================
    // RENDER
    // ========================================
    // Use MAB-selected mode, with fallback config if needed
    return (
        <>
            {/* JSON-LD Structured Data for SEO */}
            <ProductJsonLd
                product={product}
                categoryName={categoryInfo.name}
                categorySlug={categoryInfo.slug}
                computedScore={computedScore}
            />

            <ProductDetailPage
                product={product}
                layoutConfig={layoutStrategy.config}
                layoutMode={mabMode}
                layoutReason={`MAB selected: ${selectedLayoutId}`}
                layoutId={selectedLayoutId}
                isDebug={isForced}
                // ========================================
                // SALES FUNNEL SLOTS
                // These inject SSR components at correct positions
                // ========================================
                afterHeroSlot={
                    /* Score Contextual (HMUM) - Right after Hero for early engagement */
                    <ContextScoreSection
                        product={rawProduct}
                        userSettings={{ voltage: 110 }}
                    />
                }
                deepDiveSlot={
                    /* Deep Dive sections - After DNA analysis */
                    <>
                        {/* Ownership Insights - Custo Real de Propriedade */}
                        <section className="py-8">
                            {(() => {
                                try {
                                    // DEBUG: Log para verificar o ID do produto
                                    console.log(`[RENDER DEBUG] rawProduct.id = ${rawProduct.id}`);

                                    // Verificar se produto tem mapeamento E se os dados são válidos
                                    const hasMappingResult = hasComponentMapping(rawProduct.id);
                                    console.log(`[RENDER DEBUG] hasMappingResult = ${hasMappingResult}`);

                                    if (hasMappingResult) {
                                        console.log(`[RENDER DEBUG] Calling getExpandedMetricsFromSIC...`);
                                        const expandedMetrics = getExpandedMetricsFromSIC(
                                            rawProduct.id,
                                            rawProduct.price || 0,
                                            ownershipAnalysis.shadowMetrics?.monthlyCostBreakdown?.energy ?? 10,
                                            ownershipAnalysis.categoryConstants?.avgLifespanYears ?? 8
                                        );

                                        console.log(`[RENDER DEBUG] expandedMetrics = ${expandedMetrics ? 'VALID' : 'NULL'}`);

                                        if (expandedMetrics) {
                                            console.log(`[RENDER DEBUG] Rendering OwnershipInsightsExpanded`);
                                            return (
                                                <OwnershipInsightsExpanded
                                                    metrics={expandedMetrics}
                                                    productName={rawProduct.name}
                                                />
                                            );
                                        }
                                    }
                                } catch (error) {
                                    console.error(`[RENDER ERROR] Error rendering expanded metrics:`, error);
                                }

                                // Fallback para versão simplificada
                                console.log(`[RENDER DEBUG] Using fallback OwnershipInsights`);
                                return (
                                    <OwnershipInsights
                                        purchasePrice={rawProduct.price || 0}
                                        shadowMetrics={ownershipAnalysis.shadowMetrics}
                                        categoryConstants={ownershipAnalysis.categoryConstants}
                                        energyKwhMonth={(rawProduct as any).energy?.kwh_month}
                                        productName={rawProduct.name}
                                    />
                                );
                            })()}
                        </section>

                        {/* Unknown Unknowns - Engenharia Oculta */}
                        <section className="py-4">
                            <ProductUnknownUnknownsWidget product={rawProduct} />
                        </section>
                    </>
                }
            />

            {/* DECISION FAQ - "Perguntas de quem estava em dúvida" */}
            {/* FINAL OBJECTION BREAKER - última seção de conteúdo antes do footer */}
            <DecisionFAQWrapper productId={rawProduct.id} />
        </>
    );
}
