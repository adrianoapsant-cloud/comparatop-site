'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ComparisonTable } from '@/components/ComparisonTable';
import { BundleWidget } from '@/components/BundleWidget';
import { TrustMethodology } from '@/components/TrustMethodology';
import { L10N } from '@/lib/l10n';
import { useComparison } from '@/contexts/ComparisonContext';
import { scoreProduct } from '@/lib/scoring';
import { getCategoryById } from '@/config/categories';
import { getProductById } from '@/data/products';
import type { ScoredProduct, CategoryDefinition } from '@/types/category';

function CompararContent() {
    const searchParams = useSearchParams();
    const { selectedProducts } = useComparison();
    const [products, setProducts] = useState<ScoredProduct[]>([]);
    const [category, setCategory] = useState<CategoryDefinition | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get product IDs from URL params or context
        const idsParam = searchParams.get('ids');
        const productIds = idsParam
            ? idsParam.split(',')
            : selectedProducts.map(p => p.id);

        if (productIds.length === 0) {
            setLoading(false);
            return;
        }

        // Fetch products and score them
        const fetchedProducts: ScoredProduct[] = [];
        let categoryDef: CategoryDefinition | null = null;

        for (const id of productIds) {
            const product = getProductById(id);
            if (product) {
                if (!categoryDef) {
                    categoryDef = getCategoryById(product.categoryId);
                }
                if (categoryDef) {
                    const scored = scoreProduct(product, categoryDef);
                    fetchedProducts.push(scored);
                }
            }
        }

        setProducts(fetchedProducts);
        setCategory(categoryDef);
        setLoading(false);
    }, [searchParams, selectedProducts]);

    if (loading) {
        return (
            <main className="min-h-screen py-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-text-secondary">Carregando comparação...</p>
                </div>
            </main>
        );
    }

    if (products.length < 2 || !category) {
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
                        {L10N.comparison.title}
                    </h1>
                    <p className="text-text-secondary mt-2 font-body">
                        Análise inteligente para uma decisão rápida e segura.
                    </p>
                </header>

                {/* Comparison Table with Verdict Engine */}
                <section className="card-premium p-4 md:p-6 mb-8">
                    <ComparisonTable products={products} category={category} />
                </section>

                {/* Trust Methodology Accordion */}
                <TrustMethodology />

                {/* Bundle Widget Example */}
                {products.length >= 2 && (
                    <BundleWidget
                        mainProduct={{
                            name: products[0].name,
                            shortName: products[0].shortName,
                            price: products[0].price,
                            asin: 'B0C1H9K8ML',
                            imageUrl: products[0].imageUrl,
                            slug: products[0].id,
                        }}
                        accessory={{
                            name: 'Samsung HW-Q600C Soundbar',
                            shortName: 'Soundbar Q600C',
                            price: 1500,
                            asin: 'B0C5H7JKLM',
                            slug: 'samsung-hw-q600c',
                        }}
                        savings={200}
                        className="mb-8"
                    />
                )}

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

export default function CompararPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen py-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-text-secondary">Carregando...</p>
                </div>
            </main>
        }>
            <CompararContent />
        </Suspense>
    );
}
