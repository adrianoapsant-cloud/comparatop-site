'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft, ShoppingCart, ExternalLink, Star, Award, TrendingDown,
    Gamepad2, Sun, Zap, Eye, Leaf, Shield, Wind, Ruler, Volume2, Cpu,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TransparencyHeader } from '@/components/TransparencyHeader';
import { AuditVerdict } from '@/components/AuditVerdict';
import { DontBuyIf } from '@/components/DontBuyIf';
import { ProductRadarChart, extractDNAFromProduct } from '@/components/ProductRadarChart';
import { TechSpecsSection } from '@/components/TechSpecsSection';
import { BundleWidget } from '@/components/BundleWidget';
import { formatPrice } from '@/lib/l10n';
import type { Product, BenchmarkScore, FeatureBenefit } from '@/types/category';

// Icon mapping for dynamic icons
const IconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    Gamepad2, Sun, Zap, Eye, Leaf, Shield, Wind, Ruler, Volume2, Cpu,
    Star, Award, TrendingDown,
};

// ============================================
// HERO SECTION
// ============================================

function ProductHero({ product }: { product: Product }) {
    const [activeImage, setActiveImage] = useState(0);
    // Use placeholder if no valid image
    const fallbackImage = 'https://placehold.co/500x500?text=' + encodeURIComponent(product.shortName || 'Product');
    const images = product.gallery?.length ? product.gallery : [product.imageUrl || fallbackImage];

    // Calculate overall score (mock - in production use scoreProduct)
    const overallScore = 8.4;
    const scoreColor = overallScore >= 8 ? 'text-emerald-600' : overallScore >= 6 ? 'text-amber-600' : 'text-red-600';
    const scoreBg = overallScore >= 8 ? 'bg-emerald-100' : overallScore >= 6 ? 'bg-amber-100' : 'bg-red-100';

    return (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gallery */}
            <div className="space-y-3">
                {/* Main Image */}
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden relative">
                    <img
                        src={images[activeImage] || fallbackImage}
                        alt={product.name}
                        className="w-full h-full object-contain p-6"
                        onError={(e) => { (e.target as HTMLImageElement).src = fallbackImage; }}
                    />


                    {/* Image Navigation */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={() => setActiveImage(i => (i - 1 + images.length) % images.length)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={() => setActiveImage(i => (i + 1) % images.length)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </>
                    )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(idx)}
                                className={cn(
                                    'w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors',
                                    activeImage === idx ? 'border-brand-core' : 'border-gray-200 hover:border-gray-300'
                                )}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
                {/* Hook Badge - Winning Hook */}
                <div className="mb-2">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                        🏆 {product.benefitSubtitle || 'Melhor Opção da Categoria'}
                    </span>
                </div>

                {/* Title */}
                <h1 className="font-display text-xl md:text-2xl font-bold text-text-primary mb-2">
                    {product.name}
                </h1>

                {/* Score Badge */}
                <div className="flex items-center gap-2 mb-3">
                    <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full', scoreBg)}>
                        <span className={cn('font-data text-lg font-bold', scoreColor)}>
                            {overallScore.toFixed(1)}
                        </span>
                        <Star size={16} className={scoreColor} fill="currentColor" />
                    </div>
                    {product.badges?.includes('editors-choice') && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-100 text-violet-700 rounded-full">
                            <Award size={14} />
                            <span className="text-xs font-semibold">Escolha do Editor</span>
                        </div>
                    )}
                </div>

                {/* Key Specs List */}
                <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                    <ul className="space-y-1">
                        {product.featureBenefits && product.featureBenefits.slice(0, 3).map((spec, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-xs text-text-secondary">
                                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px]">✓</span>
                                {spec.title}
                            </li>
                        ))}
                        {(!product.featureBenefits || product.featureBenefits.length === 0) && (
                            <>
                                <li className="flex items-center gap-2 text-xs text-text-secondary">
                                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px]">✓</span>
                                    {product.brand} - Marca Confiável
                                </li>
                                <li className="flex items-center gap-2 text-xs text-text-secondary">
                                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px]">✓</span>
                                    Garantia de 12 meses
                                </li>
                                <li className="flex items-center gap-2 text-xs text-text-secondary">
                                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px]">✓</span>
                                    Entrega rápida Prime
                                </li>
                            </>
                        )}
                    </ul>
                </div>

                {/* Cost-Benefit Comparison (Amazon-compliant - no price history) */}
                <CostBenefitChart product={product} />

                {/* Price & Vertical Button Stack */}
                <div>
                    <div className="flex items-baseline gap-2 mb-3">
                        <span className="font-data text-3xl font-bold text-text-primary">
                            {formatPrice(product.price)}
                        </span>
                        <span className="text-xs text-text-muted">à vista</span>
                    </div>

                    {/* Vertical Button Stack */}
                    <div className="flex flex-col gap-3">
                        {/* Primary CTA - Amazon */}
                        <a
                            href="https://amazon.com.br"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                'w-full py-4 rounded-xl',
                                'bg-[#FF9900] hover:bg-[#E8890A]',
                                'text-white font-body font-bold text-lg',
                                'flex items-center justify-between px-6',
                                'shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300',
                                'transition-all'
                            )}
                        >
                            <div className="flex flex-col text-left">
                                <span className="flex items-center gap-2">
                                    <ShoppingCart size={20} />
                                    Ver Oferta Atualizada
                                </span>
                                <span className="text-xs font-normal opacity-90">Comparar Preço em Tempo Real</span>
                            </div>
                            <ExternalLink size={18} />
                        </a>

                        {/* Secondary CTA - Mercado Livre */}
                        <a
                            href={`https://lista.mercadolivre.com.br/${encodeURIComponent(product.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                'w-full py-3 rounded-xl',
                                'bg-white hover:bg-gray-50',
                                'text-blue-600 font-body font-semibold',
                                'border-2 border-blue-200 hover:border-blue-400',
                                'flex items-center justify-center gap-2',
                                'transition-all'
                            )}
                        >
                            🔍 Comparar no Mercado Livre
                        </a>
                    </div>

                    <p className="text-xs text-text-muted text-center mt-4">
                        Atualizado em {product.lastUpdated}
                    </p>
                </div>
            </div>
        </section>
    );
}

// ============================================
// COST-BENEFIT CHART (Amazon-compliant replacement)
// ============================================

function CostBenefitChart({ product }: { product: Product }) {
    // Reference prices by category
    const categoryAverages: Record<string, number> = {
        tv: 5000,
        fridge: 4500,
        air_conditioner: 2500,
        notebook: 4000,
    };

    const categoryAvg = categoryAverages[product.categoryId] || product.price * 1.2;
    const difference = ((categoryAvg - product.price) / categoryAvg * 100);
    const isBelow = product.price < categoryAvg;

    return (
        <div className={cn('mb-3 p-3 rounded-lg', isBelow ? 'bg-emerald-50' : 'bg-amber-50')}>
            <div className={cn('flex items-center gap-1.5 mb-2', isBelow ? 'text-emerald-700' : 'text-amber-700')}>
                {isBelow ? <TrendingDown size={14} /> : <Star size={14} />}
                <span className="text-xs font-semibold">
                    {isBelow
                        ? `${Math.abs(difference).toFixed(0)}% abaixo da média da categoria`
                        : 'Produto Premium'
                    }
                </span>
            </div>

            {/* Visual comparison bar */}
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <span className="w-20 text-[10px] text-text-secondary">Este produto</span>
                    <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className={cn(
                                'h-full rounded-full flex items-center justify-end pr-1.5',
                                isBelow ? 'bg-emerald-500' : 'bg-amber-500'
                            )}
                            style={{ width: `${Math.min((product.price / categoryAvg) * 100, 100)}%` }}
                        >
                            <span className="text-[9px] font-bold text-white">
                                {formatPrice(product.price)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-20 text-[10px] text-text-muted">Média categoria</span>
                    <div className="flex-1 h-2 bg-gray-300 rounded-full" />
                    <span className="text-[10px] text-text-muted">{formatPrice(categoryAvg)}</span>
                </div>
            </div>
        </div>
    );
}

// ============================================
// FEATURE BENEFITS SECTION
// ============================================

function FeatureBenefitsSection({ features }: { features: FeatureBenefit[] }) {
    return (
        <section className="py-12">
            <h2 className="font-display text-xl font-semibold text-text-primary mb-6">
                Por Que Escolher Este Produto?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, idx) => {
                    const Icon = IconMap[feature.icon] || Zap;
                    return (
                        <div
                            key={idx}
                            className="p-5 bg-white rounded-xl border border-gray-200 hover:border-brand-core/30 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-brand-core/10 flex items-center justify-center flex-shrink-0">
                                    <Icon size={24} className="text-brand-core" />
                                </div>
                                <div>
                                    <h3 className="font-body font-semibold text-text-primary mb-1">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-text-secondary leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

// ============================================
// BENCHMARK CHARTS SECTION
// ============================================

function BenchmarksSection({ benchmarks }: { benchmarks: BenchmarkScore[] }) {
    return (
        <section className="py-12">
            <h2 className="font-display text-xl font-semibold text-text-primary mb-6">
                Comparativo com a Categoria
            </h2>
            <div className="space-y-6">
                {benchmarks.map((benchmark, idx) => {
                    const productPercentage = benchmark.higherIsBetter !== false
                        ? (benchmark.productValue / Math.max(benchmark.productValue, benchmark.categoryAverage)) * 100
                        : (benchmark.categoryAverage / Math.max(benchmark.productValue, benchmark.categoryAverage)) * 100;

                    const avgPercentage = benchmark.higherIsBetter !== false
                        ? (benchmark.categoryAverage / Math.max(benchmark.productValue, benchmark.categoryAverage)) * 100
                        : (benchmark.productValue / Math.max(benchmark.productValue, benchmark.categoryAverage)) * 100;

                    const isBetter = benchmark.higherIsBetter !== false
                        ? benchmark.productValue > benchmark.categoryAverage
                        : benchmark.productValue < benchmark.categoryAverage;

                    const difference = benchmark.higherIsBetter !== false
                        ? ((benchmark.productValue - benchmark.categoryAverage) / benchmark.categoryAverage * 100).toFixed(0)
                        : ((benchmark.categoryAverage - benchmark.productValue) / benchmark.categoryAverage * 100).toFixed(0);

                    return (
                        <div key={idx} className="bg-white rounded-xl p-5 border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-body font-medium text-text-primary">
                                    {benchmark.label}
                                </span>
                                {isBetter && Number(difference) > 0 && (
                                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">
                                        +{difference}% melhor
                                    </span>
                                )}
                            </div>

                            {/* Product Bar */}
                            <div className="mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-20 text-xs text-text-secondary">Este produto</div>
                                    <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full flex items-center justify-end pr-3"
                                            style={{ width: `${productPercentage}%` }}
                                        >
                                            <span className="text-xs font-bold text-white">
                                                {benchmark.productValue} {benchmark.unit}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Average Bar */}
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="w-20 text-xs text-text-muted">Média</div>
                                    <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gray-400 rounded-full flex items-center justify-end pr-2"
                                            style={{ width: `${avgPercentage}%` }}
                                        >
                                            <span className="text-[10px] font-medium text-white">
                                                {benchmark.categoryAverage} {benchmark.unit}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

// ============================================
// STICKY SIDEBAR (DESKTOP)
// ============================================

function StickySidebar({ product }: { product: Product }) {
    return (
        <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 p-6 bg-white rounded-xl border border-gray-200 shadow-lg">
                {/* Mini Image */}
                <div className="w-20 h-20 bg-gray-100 rounded-lg mx-auto mb-4 overflow-hidden">
                    {product.imageUrl ? (
                        <img src={product.imageUrl} alt="" className="w-full h-full object-contain p-2" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            {product.shortName?.substring(0, 2)}
                        </div>
                    )}
                </div>

                <h3 className="font-display font-semibold text-center text-text-primary mb-1 text-sm">
                    {product.shortName || product.name}
                </h3>

                <p className="text-center text-2xl font-bold text-text-primary mb-4">
                    {formatPrice(product.price)}
                </p>

                <a
                    href="https://amazon.com.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                        'w-full py-3 rounded-lg',
                        'bg-[#FF9900] hover:bg-[#E8890A]',
                        'text-white font-body font-bold text-sm',
                        'flex items-center justify-center gap-2',
                        'transition-all'
                    )}
                >
                    <ShoppingCart size={18} />
                    Ver na Amazon
                </a>
            </div>
        </aside>
    );
}

// ============================================
// STICKY FOOTER (MOBILE)
// ============================================

function StickyMobileFooter({ product }: { product: Product }) {
    return (
        <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-gray-200 shadow-lg p-4">
            <div className="flex items-center gap-4 max-w-2xl mx-auto">
                <div className="flex-1">
                    <p className="text-xs text-text-muted">{product.shortName}</p>
                    <p className="font-bold text-lg text-text-primary">{formatPrice(product.price)}</p>
                </div>
                <a
                    href="https://amazon.com.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                        'px-6 py-3 rounded-lg',
                        'bg-[#FF9900] hover:bg-[#E8890A]',
                        'text-white font-body font-bold',
                        'flex items-center gap-2',
                        'transition-all'
                    )}
                >
                    <ShoppingCart size={18} />
                    Ver Oferta
                </a>
            </div>
        </div>
    );
}

// ============================================
// MAIN PDP COMPONENT
// ============================================

interface ProductDetailPageProps {
    product: Product;
}

export function ProductDetailPage({ product }: ProductDetailPageProps) {
    // Extract audit data from product scoreReasons
    const computed = (product as unknown as { computed?: { overall: number } }).computed;
    const solution = product.scoreReasons?.c1 || 'Produto com bom custo-benefício na categoria.';
    const attention = product.scoreReasons?.c3 || 'Verifique a garantia e disponibilidade de assistência técnica na sua região.';
    const conclusion = `Com nota ${(computed?.overall ?? 7.5).toFixed(1)}/10, este ${product.brand} atende bem a maioria dos usuários. Ideal para quem busca ${product.benefitSubtitle || 'um produto confiável'}.`;

    // Generate "don't buy if" reasons from scoreReasons
    const dontBuyReasons: string[] = [];
    if (product.scoreReasons?.c8?.includes('sala clara') || product.scoreReasons?.c6?.includes('reflexo')) {
        dontBuyReasons.push('Sua sala tem muita luz direta durante o dia');
    }
    if (product.scoreReasons?.c7?.includes('ReclameAqui') || product.scoreReasons?.c7?.includes('pós-venda')) {
        dontBuyReasons.push('Você precisa de suporte técnico rápido e confiável');
    }
    if (product.price > 5000) {
        dontBuyReasons.push('Seu orçamento é limitado e você não pode aguardar promoções');
    }

    return (
        <>
            {/* Transparency Header - Compliance */}
            <TransparencyHeader />

            <div className="min-h-screen bg-bg-ground">
                {/* Breadcrumb */}
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-brand-core transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Voltar
                    </Link>
                </div>

                {/* Main Content with Sidebar */}
                <div className="max-w-7xl mx-auto px-4 pb-32 lg:pb-12">
                    <div className="flex gap-8">
                        {/* Main Column */}
                        <main className="flex-1 min-w-0">
                            <ProductHero product={product} />

                            {/* Audit Verdict - Sandwich Format */}
                            <div className="mt-6">
                                <AuditVerdict
                                    solution={solution}
                                    attention={attention}
                                    conclusion={conclusion}
                                    score={computed?.overall ?? 7.5}
                                />

                                {/* Don't Buy If - Anti-Sale */}
                                <DontBuyIf reasons={dontBuyReasons} />
                            </div>

                            {/* Product DNA Radar Chart */}
                            <ProductRadarChart
                                productName={product.shortName || product.name}
                                data={extractDNAFromProduct({
                                    scores: product.scores,
                                    computed: (product as unknown as { computed?: { qs: number; vs: number; gs: number; overall: number } }).computed,
                                    scoreReasons: product.scoreReasons,
                                })}
                            />

                            {/* Tech Specs with Micro-Bars */}
                            {product.benchmarks && product.benchmarks.length > 0 && (
                                <TechSpecsSection benchmarks={product.benchmarks} />
                            )}

                            {/* Bundle Widget - Cross-Sell */}
                            <BundleWidget
                                mainProduct={{
                                    name: product.name,
                                    shortName: product.shortName,
                                    asin: (product as unknown as { asin?: string }).asin || 'B0SAMPLE',
                                    price: product.price,
                                    imageUrl: product.imageUrl,
                                    slug: product.id,
                                }}
                                accessory={{
                                    name: 'Soundbar Samsung Q600C',
                                    shortName: 'Soundbar Q600C',
                                    asin: 'B0BSAMPLE',
                                    price: 1499,
                                    imageUrl: 'https://m.media-amazon.com/images/I/31dZGxvxY-L._AC_SL1000_.jpg',
                                    slug: 'samsung-q600c-soundbar',
                                }}
                                title="🔊 Complete sua experiência"
                                subtitle="Sinergia verificada: Q-Symphony compatível"
                                savings={200}
                            />
                        </main>
                    </div>
                </div>
            </div>

            {/* Sticky Footer - Mobile */}
            <StickyMobileFooter product={product} />
        </>
    );
}
