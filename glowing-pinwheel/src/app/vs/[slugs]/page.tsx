import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ComparisonTable } from '@/components/ComparisonTable';
import { L10N } from '@/lib/l10n';
import { scoreProduct } from '@/lib/scoring';
import { getCategoryById } from '@/config/categories';
// SSOT: Migrated from @/data/products to productService
import { getProductBySlug } from '@/lib/services/productService';
import type { ScoredProduct, CategoryDefinition, Product } from '@/types/category';
import { logEvent } from '@/lib/observability/logger';

interface VsPageProps {
    params: Promise<{ slugs: string }>;
}

/**
 * Parse "productA-vs-productB" slug
 * Always normalize to alphabetical order to prevent duplicates
 */
function parseVsSlug(slugs: string): { productAId: string; productBId: string } | null {
    const match = slugs.match(/^(.+)-vs-(.+)$/);
    if (!match) return null;

    const [, a, b] = match;
    // Alphabetical ordering prevents duplicate content (A vs B = B vs A)
    const sorted = [a, b].sort();
    return { productAId: sorted[0], productBId: sorted[1] };
}

/**
 * Get canonical slug (alphabetically sorted)
 */
function getCanonicalSlug(productAId: string, productBId: string): string {
    const sorted = [productAId, productBId].sort();
    return `${sorted[0]}-vs-${sorted[1]}`;
}

// ============================================
// METADATA (SEO) - Battle Engine Integration
// ============================================

import {
    calculateBattleScore,
    toBattleProduct,
    canBattle,
    ROBOTS_INDEX_BATTLE,
    ROBOTS_NOINDEX_BATTLE,
    ROBOTS_CATEGORY_MISMATCH,
} from '@/lib/seo/battle-engine';

export async function generateMetadata({ params }: VsPageProps): Promise<Metadata> {
    const { slugs } = await params;
    const parsed = parseVsSlug(slugs);

    if (!parsed) {
        return { title: 'Comparação não encontrada' };
    }

    // SSOT: Uses getProductBySlug from productService
    const productVMA = getProductBySlug(parsed.productAId);
    const productVMB = getProductBySlug(parsed.productBId);

    if (!productVMA || !productVMB) {
        return { title: 'Comparação não encontrada' };
    }

    // Extract raw products for compatibility
    const productA = productVMA.raw as Product;
    const productB = productVMB.raw as Product;

    // =========================================
    // VALIDAÇÃO DE CATEGORIA (Kill Switch)
    // =========================================
    // Se as categorias forem diferentes, forçar noindex
    // Isso previne URLs forjadas manualmente pelo usuário

    const battleProductA = toBattleProduct(productA);
    const battleProductB = toBattleProduct(productB);

    if (!canBattle(battleProductA, battleProductB)) {
        console.warn('[SEO] ⚠️ Tentativa de comparar categorias diferentes:', {
            productA: productA.id,
            categoryA: productA.categoryId,
            productB: productB.id,
            categoryB: productB.categoryId,
        });

        return {
            title: 'Comparação Inválida | ComparaTop',
            description: 'Esta comparação não está disponível.',
            robots: ROBOTS_CATEGORY_MISMATCH,
        };
    }

    // =========================================
    // BATTLE SCORE - Indexação Dinâmica
    // =========================================
    const battleResult = calculateBattleScore(battleProductA, battleProductB);

    // Log para debug (remover em produção)
    console.log('[SEO] Battle Score for', slugs, ':', {
        score: battleResult.score.toFixed(1),
        shouldIndex: battleResult.shouldIndex,
        reason: battleResult.reason,
        categoryId: battleResult.categoryId,
    });

    // =========================================
    // 🔌 PONTO DE INTEGRAÇÃO FUTURA: Analytics
    // =========================================
    // Conectar dados reais de analytics aqui:
    //
    // const realViewsA = await getPageViewsFromGA4(productA.id);
    // const realViewsB = await getPageViewsFromGA4(productB.id);
    // 
    // Ou usando Vercel KV:
    // const viewsA = await kv.get(`product:${productA.id}:views`) || 0;
    // const viewsB = await kv.get(`product:${productB.id}:views`) || 0;
    // =========================================

    const title = `${productA.shortName || productA.name} vs ${productB.shortName || productB.name} - Comparativo Completo`;
    const description = `Compare ${productA.name} e ${productB.name}. Análise detalhada de especificações, preços e avaliações editoriais para ajudar na sua escolha.`;

    return {
        title,
        description,
        // Robots tag baseada na decisão do Battle Score
        robots: battleResult.shouldIndex ? ROBOTS_INDEX_BATTLE : ROBOTS_NOINDEX_BATTLE,
        alternates: {
            canonical: `/vs/${getCanonicalSlug(parsed.productAId, parsed.productBId)}`,
        },
        openGraph: {
            title,
            description,
            type: 'article',
        },
    };
}


// ============================================
// STATIC GENERATION
// ============================================

// Generate static paths for popular comparisons
// In production, this would come from analytics/database
export async function generateStaticParams() {
    // Pre-generate top comparison pages
    return [
        { slugs: 'lg-c3-65-vs-samsung-qn90c-65' },
        { slugs: 'samsung-qn90c-65-vs-tcl-c735-65' },
        { slugs: 'lg-c3-65-vs-tcl-c735-65' },
        // Add more as needed
    ];
}

// ============================================
// PAGE COMPONENT
// ============================================

export default async function VsPage({ params }: VsPageProps) {
    const { slugs } = await params;
    const parsed = parseVsSlug(slugs);

    if (!parsed) {
        notFound();
    }

    // Check if URL is canonical (alphabetically sorted)
    const canonicalSlug = getCanonicalSlug(parsed.productAId, parsed.productBId);
    if (slugs !== canonicalSlug) {
        // Could redirect here, but for now just use canonical in metadata
    }

    // Fetch products
    // SSOT: Uses getProductBySlug from productService
    const productVMA = getProductBySlug(parsed.productAId);
    const productVMB = getProductBySlug(parsed.productBId);

    if (!productVMA || !productVMB) {
        // Log via observability system
        logEvent({
            level: 'warn',
            category: 'route_error',
            message: 'Produto não encontrado para comparação VS',
            route: '/vs/[slugs]',
            data: {
                productAId: parsed.productAId,
                productBId: parsed.productBId,
                foundA: !!productVMA,
                foundB: !!productVMB,
            },
        });
        notFound();
    }

    // Extract raw products for compatibility
    const productA = productVMA.raw as Product;
    const productB = productVMB.raw as Product;

    // Get category
    const category = getCategoryById(productA.categoryId);
    if (!category) {
        notFound();
    }

    // Score products
    const scoredA = scoreProduct(productA, category);
    const scoredB = scoreProduct(productB, category);
    const products: ScoredProduct[] = [scoredA, scoredB];

    return (
        <main className="min-h-screen py-12 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Back Link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-brand-core hover:underline mb-8"
                >
                    <ArrowLeft size={18} />
                    Voltar aos produtos
                </Link>

                {/* Header */}
                <header className="mb-8">
                    <span className="text-data text-sm text-text-muted uppercase tracking-wider">
                        {category.name}
                    </span>
                    <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary mt-1">
                        {scoredA.shortName || scoredA.name} vs {scoredB.shortName || scoredB.name}
                    </h1>
                    <p className="text-text-secondary mt-2 font-body">
                        Análise comparativa detalhada para te ajudar a escolher.
                    </p>
                </header>

                {/* Comparison Table */}
                <section className="card-premium p-4 md:p-6 mb-8">
                    <ComparisonTable products={products} category={category} />
                </section>

                {/* Trust Footer */}
                <footer className="text-center py-8">
                    <p className="text-xs text-text-muted">
                        {L10N.trust.pricesMayVary} • Última verificação: {new Date().toLocaleDateString('pt-BR')}
                    </p>
                </footer>
            </div>
        </main>
    );
}
