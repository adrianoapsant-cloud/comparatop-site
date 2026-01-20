import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';

import { ALL_PRODUCTS } from '@/data/products';
import { generateVersusComparison } from '@/lib/nlg-engine';
import { VersusDolorTable, SpecsComparisonTable, VersusVerdict } from '@/components/VersusComponents';
import { TransparencyHeader } from '@/components/TransparencyHeader';

// ============================================
// HARDCODED EXAMPLES (for development)
// When ready to scale, see PROTOCOL_VERSUS.md
// ============================================

const EXAMPLE_COMPARISONS = [
    { slugA: 'samsung-qn90c-65', slugB: 'lg-c3-65' },
    { slugA: 'samsung-rf23-family-hub', slugB: 'consul-crm50-410' },
    { slugA: 'lg-c3-65', slugB: 'tcl-c735-65' },
];

// ============================================
// STATIC PARAMS (limited for dev performance)
// ============================================

export function generateStaticParams() {
    // Only generate example pages to avoid slow dev builds
    return EXAMPLE_COMPARISONS.map(({ slugA, slugB }) => ({
        slug: `${slugA}-vs-${slugB}`,
    }));
}

// ============================================
// METADATA
// ============================================

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const parts = slug.split('-vs-');
    if (parts.length !== 2) return { title: 'Comparação não encontrada' };

    const [slugA, slugB] = parts;
    const productA = ALL_PRODUCTS.find(p => p.id === slugA);
    const productB = ALL_PRODUCTS.find(p => p.id === slugB);

    if (!productA || !productB) return { title: 'Comparação não encontrada' };

    const nameA = productA.shortName || productA.name;
    const nameB = productB.shortName || productB.name;

    return {
        title: `${nameA} vs ${nameB} - Qual Comprar? | ComparaTop`,
        description: `Comparação detalhada entre ${nameA} e ${nameB}. Descubra qual é melhor para você baseado em 10 critérios de análise. Veredito imparcial.`,
    };
}

// ============================================
// PAGE COMPONENT
// ============================================

export default async function VersusPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const parts = slug.split('-vs-');

    if (parts.length !== 2) {
        notFound();
    }

    const [slugA, slugB] = parts;
    const productA = ALL_PRODUCTS.find(p => p.id === slugA);
    const productB = ALL_PRODUCTS.find(p => p.id === slugB);

    if (!productA || !productB) {
        notFound();
    }

    // Ensure same category
    if (productA.categoryId !== productB.categoryId) {
        notFound();
    }

    // Generate comparison using NLG Engine
    const versusResult = generateVersusComparison(productA, productB);

    const nameA = productA.shortName || productA.name;
    const nameB = productB.shortName || productB.name;

    return (
        <>
            <TransparencyHeader />

            <div className="min-h-screen bg-bg-ground">
                {/* Breadcrumb */}
                <div className="max-w-5xl mx-auto px-4 py-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-brand-core transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Voltar
                    </Link>
                </div>

                {/* Hero Section */}
                <section className="max-w-5xl mx-auto px-4 py-8">
                    <div className="text-center mb-8">
                        <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-4">
                            {nameA} <span className="text-brand-core">vs</span> {nameB}
                        </h1>
                        <p className="text-text-muted max-w-2xl mx-auto">
                            Análise detalhada baseada em 10 critérios de avaliação.
                            Descubra qual produto é melhor para o seu perfil de uso.
                        </p>
                    </div>

                    {/* Product Cards Side by Side */}
                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        <ProductVersusCard product={productA} label="A" color="blue" />
                        <ProductVersusCard product={productB} label="B" color="orange" />
                    </div>
                </section>

                {/* Verdict Section */}
                <section className="max-w-5xl mx-auto px-4">
                    <VersusVerdict versusResult={versusResult} />
                </section>

                {/* Pain Points Battle */}
                <section className="max-w-5xl mx-auto px-4">
                    <VersusDolorTable versusResult={versusResult} />
                </section>

                {/* Narrative Section */}
                <section className="max-w-5xl mx-auto px-4 py-8">
                    <h2 className="font-display text-xl font-semibold text-text-primary mb-4">
                        📝 Análise Detalhada
                    </h2>
                    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                        {versusResult.criteriaResults.map(result => (
                            <div key={result.criteriaId} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg">{result.criteriaEmoji}</span>
                                    <h3 className="font-semibold text-text-primary">{result.criteriaName}</h3>
                                    {result.winner !== 'tie' && (
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${result.winner === 'A' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                                            {result.winner === 'A' ? nameA : nameB} vence
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-text-secondary leading-relaxed">
                                    {result.narrative}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Specs Table */}
                <section className="max-w-5xl mx-auto px-4">
                    <SpecsComparisonTable productA={productA} productB={productB} />
                </section>

                {/* CTA Section */}
                <section className="max-w-5xl mx-auto px-4 py-12">
                    <div className="bg-gradient-to-r from-brand-core to-purple-600 rounded-2xl p-8 text-white text-center">
                        <h2 className="font-display text-2xl font-bold mb-4">
                            Pronto para Decidir?
                        </h2>
                        <p className="mb-6 opacity-90">
                            Veja as melhores ofertas para cada produto
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href={`/produto/${productA.id}`}
                                className="inline-flex items-center justify-center gap-2 bg-white text-brand-core px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Ver {nameA}
                                <ExternalLink size={16} />
                            </a>
                            <a
                                href={`/produto/${productB.id}`}
                                className="inline-flex items-center justify-center gap-2 bg-white/20 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-colors"
                            >
                                Ver {nameB}
                                <ExternalLink size={16} />
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

// ============================================
// PRODUCT VERSUS CARD
// ============================================

import { Product } from '@/types/category';
import { PriceBadge } from '@/components/ui/PriceRevealButton';
import { scoreProduct } from '@/lib/scoring';

function ProductVersusCard({
    product,
    label,
    color
}: {
    product: Product;
    label: 'A' | 'B';
    color: 'blue' | 'orange';
}) {
    const scoredProduct = scoreProduct(product);
    const overallScore = scoredProduct?.computed?.overall ?? 7.5;
    const name = product.shortName || product.name;

    const borderColor = color === 'blue' ? 'border-blue-500' : 'border-orange-500';
    const bgColor = color === 'blue' ? 'bg-blue-500' : 'bg-orange-500';

    return (
        <div className={`bg-white rounded-xl border-2 ${borderColor} p-6 relative`}>
            {/* Label Badge */}
            <div className={`absolute -top-3 left-4 ${bgColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                Produto {label}
            </div>

            {/* Product Image */}
            <div className="w-32 h-32 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                {product.imageUrl ? (
                    <img src={product.imageUrl} alt={name} className="w-28 h-28 object-contain" />
                ) : (
                    <div className="text-gray-400 text-4xl">📺</div>
                )}
            </div>

            {/* Product Info */}
            <div className="text-center">
                <h3 className="font-display font-semibold text-text-primary mb-1">{name}</h3>
                <p className="text-sm text-text-muted mb-3">{product.brand}</p>

                {/* Score */}
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full mb-3">
                    <span className="text-sm font-semibold">{overallScore.toFixed(2)}/10</span>
                </div>

                {/* CTA instead of static price */}
                <div className="mt-2">
                    <PriceBadge productName={name} />
                </div>
            </div>
        </div>
    );
}
