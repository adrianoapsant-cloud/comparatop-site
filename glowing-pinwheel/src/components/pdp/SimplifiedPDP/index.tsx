'use client';

/**
 * SimplifiedPDP - Main Container
 * Componente principal que orquestra todas as seções
 * 
 * Phase 6: Paridade total com PDP legado
 */

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { Product } from '@/types/category';
import { usePDPData, type PDPDataContract } from './hooks/usePDPData';
import type { MockData } from '@/lib/pdp/load-mock-data';
import { formatPrice } from '@/lib/l10n';
import { ExternalLink, ShoppingCart } from 'lucide-react';
import { SmartOfferCard, type OfferData } from '@/components/SmartOfferCard';
import { SmartStickyFooter } from '@/components/SmartStickyFooter';
import { getUnifiedScore } from '@/lib/scoring/getUnifiedScore';
import { TransparencyHeader } from '@/components/TransparencyHeader';
import { generateEnhancedProductSchema, generateSpeakableSchema } from '@/lib/schema/enhanced-product-schema';

// Above-the-fold sections (loaded immediately)
import { HeroSection } from './sections/HeroSection';
import { SimplifiedContextScoreSection } from './sections/SimplifiedContextScoreSection';
import { VerdictSection } from './sections/VerdictSection';
import { AuditVerdictSection } from '@/components/pdp/AuditVerdictSection';
import { FeatureBenefitsWidget } from '@/components/pdp/FeatureBenefitsWidget';
import { ManualDownloadSection } from '@/components/ManualDownloadSection';
import { InlineDataCorrectionCTA } from '@/components/feedback/InlineDataCorrectionCTA';
import { BundleWidget } from '@/components/BundleWidget';
import { extractRadarDimensions, hasValidRadarDimensions } from '@/lib/pdp/extract-radar-dimensions';
import { generateAuditVerdict, canGenerateAuditVerdict } from '@/lib/pdp/audit-verdict-generator';
import { generateFeatureBenefits, canGenerateFeatureBenefits } from '@/lib/pdp/generate-feature-benefits';

// Below-the-fold sections (lazy loaded for performance)
const ScoreSection = dynamic(() => import('./sections/ScoreSection').then(m => ({ default: m.ScoreSection })), { ssr: false });
const FAQSection = dynamic(() => import('./sections/FAQSection').then(m => ({ default: m.FAQSection })), { ssr: false });
const TechSpecsSection = dynamic(() => import('./sections/TechSpecsSection').then(m => ({ default: m.TechSpecsSection })), { ssr: false });
const TCOSection = dynamic(() => import('./sections/TCOSection').then(m => ({ default: m.TCOSection })), { ssr: false });
const HiddenEngineeringSection = dynamic(() => import('./sections/HiddenEngineeringSection').then(m => ({ default: m.HiddenEngineeringSection })), { ssr: false });
const SimplifiedTCOSection = dynamic(() => import('./sections/SimplifiedTCOSection').then(m => ({ default: m.SimplifiedTCOSection })), { ssr: false });
const CalculatorsSection = dynamic(() => import('./sections/CalculatorsSection').then(m => ({ default: m.CalculatorsSection })), { ssr: false });
const CommunityConsensusCard = dynamic(() => import('@/components/CommunityConsensusCard').then(m => ({ default: m.CommunityConsensusCard })), { ssr: false });
const MethodologyAccordion = dynamic(() => import('@/components/MethodologyAccordion').then(m => ({ default: m.MethodologyAccordion })), { ssr: false });
const SmartAlertsSection = dynamic(() => import('@/components/pdp/SmartAlertsSection').then(m => ({ default: m.SmartAlertsSection })), { ssr: false });
const ProductUnknownUnknownsWidget = dynamic(() => import('@/components/pdp/ProductUnknownUnknownsWidget').then(m => ({ default: m.ProductUnknownUnknownsWidget })), { ssr: false });
const BenchmarksWidget = dynamic(() => import('@/components/pdp/BenchmarksWidget').then(m => ({ default: m.BenchmarksWidget })), { ssr: false });

// External components (passed via slots for RSC compatibility)
interface SimplifiedPDPProps {
    product: Product;
    mockData?: MockData | null;
    // TRUE ZERO-SLOT: All modules now rendered internally, no slots needed
}

export function SimplifiedPDP({
    product,
    mockData,  // Legacy prop - kept for backwards compatibility but no longer used
}: SimplifiedPDPProps) {
    // Get base data from hook
    const { data: baseData, validation } = usePDPData(product);

    // ============================================
    // SIMPLIFIED: Read extended data directly from product fields
    // No more complex effectiveMockData layer needed!
    // ============================================
    const data: PDPDataContract = React.useMemo(() => {
        // Merge product's extended data into the contract
        return {
            ...baseData,
            // Override scores with productDna if available
            scores: product.productDna?.dimensions ? {
                final: product.header?.overallScore || baseData.scores?.final || 0,
                dimensions: product.productDna.dimensions.map(d => ({
                    name: d.id,
                    score: d.score,
                    weight: d.weight,
                    label: d.name, // Add the readable label
                    description: d.description,
                })),
                hmumMatch: 75, // TODO: calculate from HMUM
                categoryAverage: baseData.scores?.categoryAverage ?? 7.0,
            } : baseData.scores,
            // Enhanced extended data from product
            extended: {
                header: {
                    headline: product.header?.subtitle || baseData.extended?.header?.headline,
                },
                verdict: {
                    headline: product.auditVerdict?.technicalConclusion?.text?.substring(0, 150) + '...' || 'Análise editorial',
                    prosExpanded: product.auditVerdict?.solution?.items?.map(text => ({ text })) || [],
                    consExpanded: product.auditVerdict?.attentionPoint?.items?.map(text => ({ text })) || [],
                },
            },
            // FAQ from product
            faq: product.decisionFAQ?.map(f => ({
                question: f.question,
                answer: f.answer,
            })) || null,
            // DNA dimensions for radar - use full name (not shortName)
            dna: product.productDna?.dimensions?.map(d => ({
                name: d.name,
                score: d.score,
                tooltip: d.description,
            })) || null,
        };
    }, [baseData, product]);

    // Show validation warnings in dev mode
    const showDevWarnings = process.env.NODE_ENV === 'development' && validation.warnings.length > 0;

    // Build offers for SmartOfferCard from product.offers
    const smartOffers: OfferData[] = React.useMemo(() => {
        if (!product.offers || product.offers.length === 0) return [];

        // Map product offers to OfferData format
        return product.offers.map((offer) => {
            // Determine platform from store name or slug
            let platform: 'amazon' | 'mercadolivre' | 'magalu' | 'shopee' = 'amazon';
            const storeLower = (offer.store || offer.storeSlug || '').toLowerCase();
            if (storeLower.includes('mercado') || storeLower.includes('ml')) platform = 'mercadolivre';
            else if (storeLower.includes('magalu') || storeLower.includes('magazine')) platform = 'magalu';
            else if (storeLower.includes('shopee')) platform = 'shopee';

            return {
                platform,
                priceSpot: offer.price || product.price,
                shipping: 'free' as const,
                inStock: offer.inStock,
                affiliateUrl: offer.url || offer.affiliateUrl,
                productKeyword: product.name,
            };
        });
    }, [product.offers, product.name, product.price]);

    // ============================================
    // DERIVED VARIABLES (eliminates repeated calculations)
    // ============================================
    const primaryOffer = product.offers?.[0];
    const hasPrice = product.price && product.price > 0;
    const categoryId = mockData?.product?.category || product.categoryId;
    const displayName = product.shortName || product.name;
    const baseScore = getUnifiedScore(product);

    // Score for schema (alias for clarity)

    // JSON-LD Schema Generation (SEO parity with legacy PDP)
    const enhancedSchema = useMemo(() => {
        return generateEnhancedProductSchema({
            product,
            hmumScore: baseScore,
            consensoScore: baseScore,
        });
    }, [product, baseScore]);

    const speakableSchema = useMemo(() => {
        const productUrl = `https://comparatop.com.br/produto/${product.id}`;
        return generateSpeakableSchema(productUrl);
    }, [product.id]);

    return (
        <>
            {/* Transparency Header - Compliance */}
            <TransparencyHeader />

            {/* AI Attribution: Enhanced JSON-LD Schemas for Data Sovereignty */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(enhancedSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }}
            />

            {/* Main Article - Audit Report Layout */}
            <article className="simplified-pdp ct-container py-8 pb-24 lg:pb-8 bg-ct-bg">
                {/* Hero: Image + Info (includes CuriositySandwich, CostBenefitBar, and Marketplace Buttons) */}
                <HeroSection data={data} />

                {/* ============================================
                    SEÇÕES NA ORDEM ESPECIFICADA PELO USUÁRIO
                   ============================================ */}

                {/* 1. Score Contextual - baseScore uses getUnifiedScore() like HeroSection */}
                <SimplifiedContextScoreSection
                    data={data}
                    baseScore={baseScore}
                />

                {/* 1.5. Por Que Escolher Este Produto (Feature Benefits) - reads from product */}
                {((product as any)?.featureBenefits || canGenerateFeatureBenefits(product)) && (
                    <section className="ct-section">
                        <FeatureBenefitsWidget
                            features={((product as any)?.featureBenefits || generateFeatureBenefits(product))}
                        />
                    </section>
                )}

                {/* 2. Veredito da Auditoria - SIMPLIFIED: reads from product.auditVerdict first */}
                {(product.auditVerdict || canGenerateAuditVerdict(product)) && (
                    <section className="ct-section">
                        <AuditVerdictSection
                            data={(product.auditVerdict || generateAuditVerdict(product)) as any}
                        />
                    </section>
                )}

                {/* 3. Consenso da Comunidade - SIMPLIFIED: reads directly from product.extendedVoc */}
                {product.extendedVoc && (
                    <section className="ct-section">
                        <CommunityConsensusCard data={product.extendedVoc as any} />
                    </section>
                )}

                {/* 4 & 5. Custo Real de Propriedade - SIMPLIFIED: reads directly from product.extendedTco */}
                {product.extendedTco && (
                    <SimplifiedTCOSection
                        tco={product.extendedTco as any}
                        productName={displayName}
                        categoryId={product.categoryId}
                        tcoTotalRange={product.tcoTotalRange}
                        tcoConfidence={product.tcoConfidence}
                        tcoConfidenceNote={product.tcoConfidenceNote}
                    />
                )}

                {/* 6. 🔍 Engenharia Oculta (auto via ProductUnknownUnknownsWidget) */}
                <section className="ct-section">
                    <ProductUnknownUnknownsWidget product={product} />
                </section>

                {/* 7. Metodologia Consenso 360º */}
                <div className="ct-section">
                    <MethodologyAccordion productName={displayName} />
                </div>

                {/* 7.5. Simuladores Inteligentes - SIMPLIFIED: reads directly from product.simulators */}
                {product.simulators && (
                    <SmartAlertsSection
                        data={product.simulators as any}
                        categoryId={categoryId}
                    />
                )}

                {/* 8. DNA do Produto (Radar Chart) - Auto-extracted from product.scores */}
                {((data.scores?.dimensions?.length ?? 0) > 0 || hasValidRadarDimensions(product)) && (
                    <ScoreSection
                        data={{
                            ...data,
                            scores: (data.scores?.dimensions?.length ?? 0) > 0
                                ? data.scores!
                                : {
                                    final: baseScore,
                                    dimensions: extractRadarDimensions(product),
                                }
                        }}
                    />
                )}

                {/* 9. Calculadoras Interativas (auto-selecionadas por categoria) */}
                <CalculatorsSection
                    category={categoryId}
                    productDimensions={product.productDimensions}
                />

                {/* 10. 📋 Ficha Técnica Completa */}
                {data.technicalSpecs && Object.keys(data.technicalSpecs).length > 0 && (
                    <TechSpecsSection data={data} />
                )}

                {/* CTA para correção de dados */}
                <p className="text-xs text-gray-400 mt-2">
                    * Especificações podem variar conforme região e versão do produto. Consulte o fabricante para informações oficiais.
                </p>
                <InlineDataCorrectionCTA
                    elementId="pdp_specs"
                    sectionLabel="Ficha Técnica"
                    productSlug={product.id}
                />

                {/* Acessório Recomendado */}
                {product.recommendedAccessory?.affiliateUrl && product.offers?.[0] && (() => {
                    // Extract ASIN from Amazon URL (format: /dp/XXXXXXXXXX or /gp/product/XXXXXXXXXX)
                    const amazonOffer = product.offers.find(o => o.storeSlug === 'amazon' || o.store?.toLowerCase() === 'amazon');
                    const amazonUrl = amazonOffer?.affiliateUrl || amazonOffer?.url || '';
                    const asinMatch = amazonUrl.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
                    const mainProductAsin = asinMatch?.[1] || (product as unknown as { asin?: string }).asin || '';

                    // Only render if we have valid ASINs for both products
                    if (!mainProductAsin || !product.recommendedAccessory.asin) {
                        if (process.env.NODE_ENV === 'development') {
                            console.debug('[BundleWidget] Hidden: missing ASIN', { mainProductAsin, accessoryAsin: product.recommendedAccessory.asin });
                        }
                        return null;
                    }

                    return (
                        <BundleWidget
                            mainProduct={{
                                name: product.name,
                                shortName: product.shortName,
                                asin: mainProductAsin,
                                price: product.price,
                                imageUrl: product.imageUrl,
                                affiliateUrl: amazonOffer?.affiliateUrl || product.offers[0].affiliateUrl || product.offers[0].url,
                            }}
                            accessory={{
                                name: product.recommendedAccessory.name,
                                shortName: product.recommendedAccessory.shortName,
                                asin: product.recommendedAccessory.asin,
                                price: product.recommendedAccessory.price,
                                imageUrl: product.recommendedAccessory.imageUrl,
                                affiliateUrl: product.recommendedAccessory.affiliateUrl,
                            }}
                            title="✨ Acessório recomendado"
                            subtitle={product.recommendedAccessory.reason}
                            categoryId={categoryId}
                            savings={Math.round((product.price + product.recommendedAccessory.price) * 0.05)}
                        />
                    );
                })()}

                {/* Benchmarks (lê do product.benchmarks) */}
                {product.benchmarks && product.benchmarks.length > 0 && (
                    <section className="ct-section">
                        <BenchmarksWidget benchmarks={product.benchmarks} productName={displayName} />
                    </section>
                )}

                {/* ============================================
                    SEÇÕES EXTRAS (FAQs, Downloads, etc.)
                   ============================================ */}

                {/* FAQ (lê do mock - zero config para novos produtos) */}
                {data.faq && data.faq.length >= 3 && (
                    <FAQSection data={data} />
                )}

                {/* Manual Download Section (renders internally) */}
                <div className="ct-section border-t border-ct-border">
                    <ManualDownloadSection
                        productId={product.id}
                        productName={displayName}
                        manuals={product.manualUrl ? [
                            { type: 'user', title: 'Manual do Usuário', language: 'PT-BR', pdfUrl: product.manualUrl }
                        ] : undefined}
                    />
                </div>



                {/* SmartStickyFooter - Full parity with legacy PDP */}
                <SmartStickyFooter
                    currentProduct={{
                        id: product.id,
                        name: product.name,
                        shortName: product.shortName,
                        price: product.price,
                        imageUrl: product.imageUrl,
                        score: baseScore,
                        amazonUrl: primaryOffer?.url,
                    }}
                />
            </article>
        </>
    );
}

export default SimplifiedPDP;
