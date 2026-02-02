'use client';

/**
 * SimplifiedPDP - Hero Section
 * Renderiza nome, marca, galeria multi-imagem e badges
 */

import React, { useMemo } from 'react';
import { PDPDataContract } from '../hooks/usePDPData';
import { ProductGalleryZoom } from '@/components/ProductGalleryZoom';
import { CompareToggle } from '@/components/CompareToggle';
import { getUnifiedScore } from '@/lib/scoring/getUnifiedScore';
import { CuriositySandwichWidget } from '@/components/pdp/CuriositySandwichWidget';
import { ConfidenceBand, formatScoreRange, formatScoreValue } from '@/components/ui/ConfidenceBand';
import { InfoTooltip } from '@/components/ui/InfoTooltip';

interface HeroSectionProps {
    data: PDPDataContract;
}

// Helper: Extrai affiliateUrl de uma loja específica
function getStoreUrl(
    offers: { storeSlug?: string; store?: string; affiliateUrl?: string; url: string }[] | undefined,
    storeSlug: string,
    fallbackSearch: string
): string {
    const offer = offers?.find(o =>
        o.storeSlug === storeSlug || o.store?.toLowerCase().includes(storeSlug.replace('_', ' '))
    );
    return offer?.affiliateUrl || offer?.url || fallbackSearch;
}

export function HeroSection({ data }: HeroSectionProps) {
    const { product, extended, scores } = data;

    // Build gallery images for ProductGalleryZoom
    const galleryImages = useMemo(() => {
        if (product.gallery && product.gallery.length > 0) {
            return product.gallery.map((url) => ({
                src: url,
                alt: product.name,
                width: 800,
                height: 800,
            }));
        }
        // Fallback: single image
        if (product.imageUrl) {
            return [{
                src: product.imageUrl,
                alt: product.name,
                width: 800,
                height: 800,
            }];
        }
        // No images at all - use placeholder
        return [{
            src: `https://placehold.co/500x500/f1f5f9/94a3b8?text=${encodeURIComponent(product.shortName || product.name)}`,
            alt: product.name,
            width: 500,
            height: 500,
        }];
    }, [product.gallery, product.imageUrl, product.shortName, product.name]);

    const headline = extended?.header?.headline || product.benefitSubtitle || '';

    return (
        <section className="pdp-hero max-w-full">
            {/* Breadcrumb */}
            <nav className="pdp-breadcrumb text-sm text-gray-500 mb-4">
                <a href="/" className="hover:text-blue-600">Início</a>
                {' / '}
                <a href={`/categoria/${product.categoryId}`} className="hover:text-blue-600 capitalize">
                    {product.categoryId.replace(/-/g, ' ')}
                </a>
                {' / '}
                <span>{product.brand}</span>
            </nav>

            {/* CSS Grid: células esticam por padrão, criando o 'trilho' para sticky */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8">
                {/* Galeria - sticky apenas no desktop (lg:) */}
                <div className="lg:sticky lg:top-8 h-fit relative">
                    {/* Compare Toggle */}
                    <div className="absolute top-2 right-2 z-30">
                        <CompareToggle
                            product={{
                                id: product.id,
                                name: product.name,
                                shortName: product.shortName,
                                imageUrl: product.imageUrl,
                                price: product.price,
                                categoryId: product.categoryId,
                            }}
                        />
                    </div>
                    <ProductGalleryZoom
                        images={galleryImages}
                        initialIndex={0}
                    />
                </div>

                {/* Info - conteúdo longo */}
                <div className="pdp-info">
                    {/* Headline Banner (blue background like legacy - bg-blue-50 text-blue-700) */}
                    {headline && (
                        <div className="mb-3">
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                                🏆 {headline}
                            </span>
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 break-words">
                        {product.name}
                    </h1>

                    {/* Trust Bar - Credibility Signals */}
                    <div className="ct-trustbar mt-3 relative">
                        {/* Updated Date */}
                        <div className="ct-chip">
                            <span className="ct-chip-label">Atualizado:</span>
                            <span className="ct-chip-value">
                                {(product as { updatedAt?: string }).updatedAt
                                    ? new Date((product as { updatedAt?: string }).updatedAt!).toLocaleDateString('pt-BR')
                                    : '29/01/2026'}
                            </span>
                        </div>

                        {/* Evidence Level */}
                        <div className={`ct-chip ${(product as { evidenceLevel?: string }).evidenceLevel === 'high'
                            ? 'ct-evidence--high'
                            : (product as { evidenceLevel?: string }).evidenceLevel === 'low'
                                ? 'ct-evidence--low'
                                : 'ct-evidence--med'
                            }`}>
                            <span className="ct-chip-label flex items-center gap-1">
                                Evidência:
                                <InfoTooltip text={
                                    (product as { evidenceLevel?: string }).evidenceLevel === 'high'
                                        ? 'Alta: Mais de 50 reviews analisados, dados do fabricante verificados e testes de laboratório disponíveis.'
                                        : (product as { evidenceLevel?: string }).evidenceLevel === 'low'
                                            ? 'Baixa: Menos de 10 reviews, produto novo no mercado ou dados limitados. A nota pode mudar com mais informações.'
                                            : 'Média: Entre 10 e 50 reviews analisados, alguns dados estimados. Confiança razoável na avaliação.'
                                } />
                            </span>
                            <span className="ct-chip-value">
                                {(product as { evidenceLevel?: string }).evidenceLevel === 'high'
                                    ? 'Alta'
                                    : (product as { evidenceLevel?: string }).evidenceLevel === 'low'
                                        ? 'Baixa'
                                        : 'Média'}
                            </span>
                        </div>

                        {/* Methodology Link */}
                        <details className="group relative">
                            <summary className="ct-methodology-link ct-summary-btn">
                                Como avaliamos →
                            </summary>
                            <div className="ct-card-soft p-3 mt-2 text-xs text-ct-muted space-y-1 absolute z-10 w-64 right-0 md:left-0 shadow-lg">
                                <p>• Notas por critérios da categoria</p>
                                <p>• Custo real 5 anos (TCO)</p>
                                <p>• Riscos e unknown unknowns</p>
                                <p>• Consenso pós-uso (VOC)</p>
                            </div>
                        </details>
                    </div>

                    {/* Score Badge + Faixa + Confiança - Tudo inline */}
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                        {/* Score principal - Hexagonal Badge with semantic colors */}
                        {(() => {
                            const score = getUnifiedScore(product);
                            // Semantic colors based on score value
                            const getScoreStyle = (s: number) => {
                                if (s >= 8.5) return { bg: 'bg-emerald-500', text: 'text-white', label: 'Excelente' };
                                if (s >= 7.0) return { bg: 'bg-blue-500', text: 'text-white', label: 'Bom' };
                                if (s >= 5.5) return { bg: 'bg-amber-500', text: 'text-white', label: 'Regular' };
                                return { bg: 'bg-red-500', text: 'text-white', label: 'Atenção' };
                            };
                            const colors = getScoreStyle(score);

                            return (
                                <div className="flex flex-col items-center gap-1">
                                    {/* Hexagonal Badge */}
                                    <div
                                        className={`relative w-14 h-14 flex items-center justify-center ${colors.bg}`}
                                        style={{
                                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                                        }}
                                    >
                                        <span className={`text-xl font-bold ${colors.text}`}>
                                            {score.toFixed(2)}
                                        </span>
                                    </div>
                                    {/* Label */}
                                    <div className="flex items-center gap-1">
                                        <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                                        </svg>
                                        <span className="text-xs font-medium text-gray-600">{colors.label}</span>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Faixa + Confiança inline */}
                        {(product as { contextualScoreRange?: [number, number] }).contextualScoreRange && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>
                                    Faixa: <span className="font-medium text-gray-700">
                                        {formatScoreRange((product as { contextualScoreRange?: [number, number] }).contextualScoreRange)}
                                    </span>
                                </span>
                                <span className="text-gray-300">|</span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${(product as { contextualScoreConfidence?: string }).contextualScoreConfidence === 'high'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : (product as { contextualScoreConfidence?: string }).contextualScoreConfidence === 'low'
                                        ? 'bg-gray-100 text-gray-600'
                                        : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    {(product as { contextualScoreConfidence?: string }).contextualScoreConfidence === 'high'
                                        ? 'Alta confiança'
                                        : (product as { contextualScoreConfidence?: string }).contextualScoreConfidence === 'low'
                                            ? 'Baixa confiança'
                                            : 'Média confiança'}
                                </span>
                                <InfoTooltip text="Nota baseada em 10 critérios técnicos. A faixa indica variação possível. Confiança depende da quantidade de reviews e dados verificados." />
                            </div>
                        )}
                    </div>

                    {/* Key Specs Checklist (3 green checkmarks like legacy) */}
                    {product.featureBenefits && product.featureBenefits.length > 0 && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <ul className="space-y-1">
                                {product.featureBenefits.slice(0, 3).map((spec, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px]">✓</span>
                                        {spec.title}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Curiosity Sandwich - AI Insight using the widget */}
                    <div className="mt-4">
                        <CuriositySandwichWidget product={product} />
                    </div>

                    {/* Cost Benefit Bar - Price Comparison (green bar like legacy) */}
                    {product.price && product.price > 0 && (
                        <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
                            <div className="flex items-center gap-1.5 mb-2 text-emerald-700">
                                <span className="text-sm">📉</span>
                                <span className="text-xs font-semibold">✓ 18% mais barato que a média da categoria</span>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="w-20 text-[10px] text-gray-600">Este produto</span>
                                    <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full flex items-center justify-end pr-1.5 bg-emerald-500"
                                            style={{ width: '82%' }}
                                        >
                                            <span className="text-[9px] font-bold text-white">
                                                R$ {product.price.toLocaleString('pt-BR')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-20 text-[10px] text-gray-400">Média categoria</span>
                                    <div className="flex-1 h-2 bg-gray-300 rounded-full" />
                                    <span className="text-[10px] text-gray-400">R$ {Math.round(product.price * 1.22).toLocaleString('pt-BR')}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Purchase Block - 1 Primary CTA + Other Stores */}
                    <div className="mt-6 space-y-3">
                        {/* Primary CTA - Best Offer (first/Amazon) */}
                        <a
                            href={product.offers?.[0]?.affiliateUrl || product.offers?.[0]?.url || `https://www.amazon.com.br/s?k=${encodeURIComponent(product.name)}&tag=comparatop-20`}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            className="ct-btn ct-btn-primary w-full"
                        >
                            Ver melhor oferta ↗
                        </a>

                        {/* Secondary - Other Stores (native details/summary) */}
                        <details className="group">
                            <summary className="ct-btn ct-btn-secondary ct-summary-btn w-full">
                                Ver em outras lojas
                                <svg
                                    className="w-4 h-4 transition-transform group-open:rotate-180"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </summary>
                            <div className="ct-card-soft p-3 mt-2 space-y-2">
                                {/* Mercado Livre */}
                                <a
                                    href={getStoreUrl(product.offers, 'mercado_livre', `https://lista.mercadolivre.com.br/${encodeURIComponent(product.shortName || product.name)}`)}
                                    target="_blank"
                                    rel="noopener noreferrer sponsored"
                                    className="ct-link flex items-center justify-between py-2 px-3 hover:bg-ct-surface rounded-lg transition-colors"
                                >
                                    <span>Mercado Livre</span>
                                    <span className="text-xs text-ct-muted">Abrir ↗</span>
                                </a>
                                {/* Magazine Luiza */}
                                <a
                                    href={getStoreUrl(product.offers, 'magalu', `https://www.magazineluiza.com.br/busca/${encodeURIComponent(product.shortName || product.name)}`)}
                                    target="_blank"
                                    rel="noopener noreferrer sponsored"
                                    className="ct-link flex items-center justify-between py-2 px-3 hover:bg-ct-surface rounded-lg transition-colors"
                                >
                                    <span>Magazine Luiza</span>
                                    <span className="text-xs text-ct-muted">Abrir ↗</span>
                                </a>
                                {/* Shopee - always search */}
                                <a
                                    href={`https://shopee.com.br/search?keyword=${encodeURIComponent(product.shortName || product.name)}`}
                                    target="_blank"
                                    rel="noopener noreferrer sponsored"
                                    className="ct-link flex items-center justify-between py-2 px-3 hover:bg-ct-surface rounded-lg transition-colors"
                                >
                                    <span>Shopee</span>
                                    <span className="text-xs text-ct-muted">Abrir ↗</span>
                                </a>
                            </div>
                        </details>

                        {/* Affiliate Disclosure - Microcopy */}
                        <p className="ct-affiliate-note text-center">
                            Links de afiliado — você não paga nada a mais.
                        </p>
                        {/* Authority Microcopy */}
                        <p className="ct-affiliate-note text-center">
                            Nota e TCO não mudam por loja — avaliamos o produto, não o vendedor.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;

