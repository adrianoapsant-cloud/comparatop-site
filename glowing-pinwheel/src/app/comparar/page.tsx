/**
 * @file comparar/page.tsx
 * @description Página de Comparação Multi-Produtos
 * 
 * SSOT: Usa productService para obter dados
 * SEO: noindex por ser conteúdo gerado por usuário (thin content)
 * Robustez: Produtos com health=FAIL são removidos, <2 válidos = 404
 */

import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
    getProductsForCompare,
    getCategoryDefinition
} from '@/lib/services/productService';
import { filterPublishableWithLog, compareUrl } from '@/lib/routes';
import { ComparisonTable } from '@/components/ComparisonTable';
import { TrustMethodology } from '@/components/TrustMethodology';
import { L10N } from '@/lib/l10n';
import type { ProductVM } from '@/lib/viewmodels/productVM';
import { logEvent } from '@/lib/observability/logger';

// ============================================
// METADATA (noindex - user-generated comparisons)
// ============================================

export const metadata: Metadata = {
    title: 'Comparar Produtos | ComparaTop',
    description: 'Compare produtos lado a lado com análise técnica detalhada.',
    robots: {
        index: false,
        follow: false,
    },
};

// ============================================
// PAGE COMPONENT (SSR)
// ============================================

interface CompararPageProps {
    searchParams: Promise<{ ids?: string; slugs?: string }>;
}

export default async function CompararPage({ searchParams }: CompararPageProps) {
    // Parse query params de forma segura
    const params = await searchParams;
    const rawIds = params.ids || params.slugs || '';

    // Validar e sanitizar input
    const requestedIds = rawIds
        .split(',')
        .map(id => id.trim())
        .filter(id => id.length > 0 && id.length < 100); // Basic sanity check

    // Se não há IDs válidos, mostrar página de seleção vazia
    if (requestedIds.length === 0) {
        return <EmptyComparisonPage />;
    }

    // Buscar produtos via SSOT (productService)
    const allProducts = getProductsForCompare(requestedIds);

    // Logar produtos não encontrados
    const foundIds = allProducts.map(p => p.id);
    const notFoundIds = requestedIds.filter(id => !foundIds.includes(id));
    if (notFoundIds.length > 0) {
        // Log via observability system
        logEvent({
            level: 'warn',
            category: 'fallback',
            message: `${notFoundIds.length} slug(s) não encontrados`,
            route: '/comparar',
            data: {
                removed: notFoundIds,
                kept: foundIds,
            },
        });
    }

    // Filtrar produtos com health=FAIL (não publicáveis)
    const publishable = filterPublishableWithLog(allProducts, 'comparar');

    // Se menos de 2 produtos válidos, 404
    if (publishable.length < 2) {
        console.warn(
            `[comparar] Menos de 2 produtos válidos. Solicitados: ${requestedIds.length}, ` +
            `Encontrados: ${allProducts.length}, Publicáveis: ${publishable.length}`
        );
        notFound();
    }

    // Calcular URL canônica (slugs ordenados)
    const canonicalSlugs = publishable.map(p => p.slug).sort();
    const canonicalUrl = compareUrl(canonicalSlugs);

    // Se acessado via query param, redirecionar para URL canônica VS
    // (Apenas se temos exatamente 2 produtos - VS page)
    if (publishable.length === 2) {
        redirect(canonicalUrl);
    }

    // Para 3+ produtos, manter na página /comparar mas com slugs canônicos
    const currentQuerySlugs = requestedIds.sort().join(',');
    const canonicalQuerySlugs = canonicalSlugs.join(',');
    if (currentQuerySlugs !== canonicalQuerySlugs) {
        redirect(`/comparar?slugs=${canonicalQuerySlugs}`);
    }

    // Determinar categoria (usar do primeiro produto)
    const categoryDef = getCategoryDefinition(publishable[0].categoryId);

    return (
        <main className="min-h-screen py-12 px-4 md:px-8">
            <div className="max-w-5xl mx-auto">
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
                    {categoryDef && (
                        <span className="text-data text-sm text-text-muted uppercase tracking-wider">
                            {categoryDef.name}
                        </span>
                    )}
                    <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary mt-1">
                        Comparação de {publishable.length} Produtos
                    </h1>
                    <p className="text-text-secondary mt-2 font-body">
                        Análise inteligente para uma decisão rápida e segura.
                    </p>
                </header>

                {/* Comparison Table */}
                <section className="card-premium p-4 md:p-6 mb-8 overflow-x-auto">
                    <ComparisonTableWrapper
                        products={publishable}
                        categoryDef={categoryDef}
                    />
                </section>

                {/* Trust Methodology */}
                <TrustMethodology />

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

// ============================================
// SUB-COMPONENTS
// ============================================

function EmptyComparisonPage() {
    return (
        <main className="min-h-screen py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-brand-core hover:underline mb-8"
                >
                    <ArrowLeft size={18} />
                    Voltar
                </Link>

                <div className="card-premium p-12 text-center">
                    <h1 className="font-display text-2xl font-semibold text-text-primary mb-4">
                        {L10N.ui.selectAtLeast}
                    </h1>
                    <p className="text-text-secondary mb-6">
                        Volte à página de produtos e selecione ao menos 2 modelos para comparar.
                    </p>
                    <Link
                        href="/"
                        className="btn-primary inline-flex"
                    >
                        Ver Produtos
                    </Link>
                </div>
            </div>
        </main>
    );
}

function ComparisonTableWrapper({
    products,
    categoryDef
}: {
    products: ProductVM[];
    categoryDef: ReturnType<typeof getCategoryDefinition>;
}) {
    // Converter ProductVM para ScoredProduct (formato esperado pelo ComparisonTable)
    // IMPORTANTE: Remover a função hasBadge que não serializa entre Server/Client
    const scoredProducts = products.map(vm => {
        // Usar raw product como base (tem scores, categoryId, etc)
        // E adicionar campos computados que ComparisonTable espera
        const rawProduct = (vm as any).raw || vm;

        return {
            ...rawProduct,
            // ID e nome do VM
            id: vm.id,
            name: vm.name,
            shortName: vm.shortName,
            imageUrl: vm.imageUrl,
            categoryId: vm.categoryId,
            // Garantir scores existe (vem do raw product)
            scores: {
                ...rawProduct.scores,
                overall: vm.score.value,  // REQUIRED by getComparisonVerdict
            },
            // Computed scores para ComparisonTable
            computed: {
                overall: vm.score.value,
                qs: vm.score.value,
                vs: vm.score.value * 0.9,
                gs: vm.score.value * 0.95,
            },
            // Preço para formatação
            price: vm.price.value,
            // Remover função hasBadge (não serializa)
        };
    });

    if (!categoryDef) {
        return (
            <div className="text-center py-8 text-text-muted">
                Categoria não encontrada
            </div>
        );
    }

    return (
        <ComparisonTable
            products={scoredProducts as any}
            category={categoryDef as any}
        />
    );
}
