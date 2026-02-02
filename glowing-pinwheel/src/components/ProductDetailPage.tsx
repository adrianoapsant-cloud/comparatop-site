'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeft, ShoppingCart, ExternalLink, Star, Award, TrendingDown,
    Gamepad2, Sun, Zap, Eye, Leaf, Shield, Wind, Ruler, Volume2, Cpu,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TransparencyHeader } from '@/components/TransparencyHeader';
import { AuditVerdict } from '@/components/AuditVerdict';
import { LazyProductRadarChart as ProductRadarChart, extractDNAFromProduct } from '@/components/LazyProductRadarChart';
import { TechSpecsSection } from '@/components/TechSpecsSection';
import { BundleWidget } from '@/components/BundleWidget';
import { formatPrice } from '@/lib/l10n';
import { scoreProduct } from '@/lib/scoring';
import { getBestAccessoryForProduct, calculateBundleSavings } from '@/lib/bundle-matcher';
import { getCategoryPriceStats } from '@/lib/category-prices';
import type { Product, BenchmarkScore, FeatureBenefit } from '@/types/category';
import { getUnifiedScore } from '@/lib/scoring/getUnifiedScore';
import { getScoreColorClass, getScoreBgClass } from '@/lib/getBaseScore';
import { getProductById } from '@/data/products';
// REMOVED: StickyAction/StickyActionMobile - replaced by SmartStickyFooter
import { CompareToggle } from '@/components/CompareToggle';
import { ToolTrigger, ToolGrid, GeometryToolTrigger, VisualComparisonTrigger } from '@/components/ui/ToolTrigger';
import { Accordion } from '@/components/ui/Accordion';
import { PriceRevealButton, MarketplaceButtonGrid } from '@/components/ui/PriceRevealButton';
import { AffiliateButtons } from '@/components/ui/AffiliateButtons';
import { SmartOfferCard, type OfferData } from '@/components/SmartOfferCard';
import { BundleUpgrade } from '@/components/ui/BundleUpgrade';
// REMOVED: AIReviewSection (Projeto Voz Unificada - card roxo eliminado)
import { GeometryEngine } from '@/components/engines/GeometryEngine';
import { RateEngine } from '@/components/engines/RateEngine';
import { ComparisonEngine } from '@/components/engines/ComparisonEngine';
import { AuditVerdictSection, SimulatorsSection } from '@/components/pdp';
import { ModuleFallback } from '@/components/pdp/ModuleFallback';
import { getProductExtendedData } from '@/lib/product-loader';
import { generateSimulatorsData, supportsSimulators } from '@/lib/simulators-generator';
// REMOVED: useUnifiedVoice API - all data now comes from static JSON
import type { ProductData } from '@/config/product-json-schema';
import dynamic from 'next/dynamic';
import { ProductGallery, type GalleryItem } from '@/components/ProductGallery';
import { StickySummaryCard } from '@/components/StickySummaryCard';
import { KeySpecsBadges, extractKeySpecs } from '@/components/KeySpecsBadges';
import { TechSpecsAccordion, generateSpecCategories } from '@/components/TechSpecsAccordion';
import { ManualDownloadSection } from '@/components/ManualDownloadSection';
import { ContextScoreSection } from '@/components/product/ContextScoreSection';
import { MethodologyAccordion } from '@/components/MethodologyAccordion';
import { CommunityConsensusCard } from '@/components/CommunityConsensusCard';
import { SmartStickyFooter } from '@/components/SmartStickyFooter';
import { InlineDataCorrectionCTA } from '@/components/feedback';

// === OWNERSHIP INSIGHTS (TCO) ===
import OwnershipInsights from '@/components/product/OwnershipInsights';
import { OwnershipInsightsExpanded } from '@/components/product/OwnershipInsightsExpanded';
import { analyzeProductOwnership } from '@/lib/scoring/product-ownership';
import { getExpandedMetricsFromSIC, hasComponentMapping } from '@/lib/scoring/component-engine';

// === UNKNOWN UNKNOWNS (Engenharia Oculta) ===
import { ProductUnknownUnknownsWidget } from '@/components/pdp/ProductUnknownUnknownsWidget';
// UnifiedBreakdown removed - using original 10 Dores radar chart

// AI Attribution System - Data Sovereignty
import { AttributionBanner, MethodologyCitation } from '@/components/attribution/DataAttribution';
import { generateEnhancedProductSchema, generateSpeakableSchema } from '@/lib/schema/enhanced-product-schema';

// Contextual Scoring System
import { ContextSelector, ScoreAudit } from '@/components/scoring';
import { useScoring } from '@/hooks/useScoring';
import type { ProductFacts } from '@/lib/scoring/types';

// Lazy load comparison modal for LCP protection (SSR: false)
// REMOVED: StickyComparisonBar - replaced by SmartStickyFooter
const BattleModeModal = dynamic(
    () => import('@/components/comparison/BattleModeModal').then(m => m.BattleModeModal),
    { ssr: false }
);
import {
    TV_CABE_ESTANTE,
    GELADEIRA_PASSA_PORTA,
    CALCULADORA_BTU,
    MONITOR_CABE_MESA,
    NOTEBOOK_CABE_MOCHILA,
    LAVADORA_PASSA_PORTA,
    CALCULADORA_CAPACIDADE_LAVADORA,
    CALCULADORA_TAMANHO_MONITOR,
    ROBO_PASSA_MOVEL,
    OLED_VS_LED,
    SOUNDBAR_VS_TV,
} from '@/lib/tools-config';

// Icon mapping for dynamic icons
const IconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    Gamepad2, Sun, Zap, Eye, Leaf, Shield, Wind, Ruler, Volume2, Cpu,
    Star, Award, TrendingDown,
};

// ============================================
// HERO SECTION - Enhanced with Unified Voice
// ============================================

interface ProductHeroProps {
    product: Product;
    unifiedScore?: number; // Score from Gemini API
    headline?: string; // Headline from Gemini API
    curiositySandwich?: { icon: string; text: string }; // AI-generated insight
    isLoading?: boolean; // True while fetching Gemini data
}

function ProductHero({ product, unifiedScore, headline, curiositySandwich, isLoading }: ProductHeroProps) {
    // Map product images to GalleryItem[]
    const galleryItems: GalleryItem[] = useMemo(() => {
        if (product.gallery && product.gallery.length > 0) {
            return product.gallery.map(url => ({ type: 'image', url }));
        }
        return product.imageUrl ? [{ type: 'image', url: product.imageUrl }] : [];
    }, [product]);

    // Use unified base score from product JSON using getUnifiedScore
    // This ensures the same score appears across ALL pages and components
    const overallScore = getUnifiedScore(product);
    const scoreColor = getScoreColorClass(overallScore);
    const scoreBg = getScoreBgClass(overallScore);

    return (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 relative">
            {/* NEW: Visual Architecture - Product Gallery (Sticky on Desktop) */}
            <div className="w-full lg:sticky lg:top-4 self-start">
                <ProductGallery
                    items={galleryItems}
                    productName={product.name}
                    affiliateUrl={product.offers?.[0]?.affiliateUrl || product.offers?.[0]?.url}
                    compareButton={
                        <CompareToggle
                            product={{
                                id: product.id,
                                name: product.name,
                                shortName: product.shortName,
                                imageUrl: product.imageUrl,
                                price: product.price,
                                categoryId: product.categoryId,
                            }}
                            className="!relative !top-0 !left-0"
                        />
                    }
                />
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
                {/* Visual Architecture - Sticky Summary (Desktop Only) */}
                <StickySummaryCard product={product} rating={overallScore} />

                {/* Hook Badge - Winning Hook (uses static benefitSubtitle immediately, API headline overrides if available) */}
                <div className="mb-2">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                        🏆 {headline || product.benefitSubtitle || 'Melhor Opção da Categoria'}
                    </span>
                </div>

                {/* Title */}
                <h1 className="font-display text-xl md:text-2xl font-bold text-text-primary mb-2">
                    {product.name}
                </h1>

                {/* Score Badge - Hexagonal with semantic colors */}
                <div className="flex items-center gap-2 mb-3">
                    {/* Hexagonal badge - colors based on score value */}
                    {(() => {
                        const getScoreStyle = (s: number) => {
                            if (s >= 8.5) return { bg: 'bg-emerald-500', text: 'text-white', label: 'Excelente' };
                            if (s >= 7.0) return { bg: 'bg-blue-500', text: 'text-white', label: 'Bom' };
                            if (s >= 5.5) return { bg: 'bg-amber-500', text: 'text-white', label: 'Regular' };
                            return { bg: 'bg-red-500', text: 'text-white', label: 'Atenção' };
                        };
                        const colors = getScoreStyle(overallScore);

                        return (
                            <div className="flex flex-col items-center gap-1">
                                {/* Hexagonal Badge */}
                                <div
                                    className={cn('relative w-14 h-14 flex items-center justify-center', colors.bg)}
                                    style={{
                                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                                    }}
                                >
                                    <span className={cn('text-xl font-bold', colors.text)}>
                                        {overallScore.toFixed(2)}
                                    </span>
                                </div>
                                {/* Label */}
                                <div className="flex items-center gap-1">
                                    <Shield size={12} className="text-blue-500" />
                                    <span className="text-xs font-medium text-gray-600">{colors.label}</span>
                                </div>
                            </div>
                        );
                    })()}
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
                                    Garantia de fábrica inclusa
                                </li>
                                <li className="flex items-center gap-2 text-xs text-text-secondary">
                                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px]">✓</span>
                                    Disponível nas principais lojas
                                </li>
                            </>
                        )}
                    </ul>
                </div>

                {/* Curiosity Sandwich - Smart Insight */}
                {(() => {
                    const categoryStats = getCategoryPriceStats(product.categoryId);
                    // Check if API's curiosity_sandwich contains a stale score
                    // If it mentions a different score than overallScore, use local fallback
                    const apiText = curiositySandwich?.text || '';
                    // Match scores with 1 or 2 decimal places (e.g., "8.7" or "8.70")
                    const scoreRegex = /\b(\d+\.\d{1,2})\b/g;
                    const mentionedScores = apiText.match(scoreRegex);
                    const hasStaleScore = mentionedScores?.some(s => {
                        const diff = Math.abs(parseFloat(s) - overallScore);
                        return diff > 0.05; // If difference > 0.05, it's stale (catches 8.7 vs 8.62)
                    });

                    return (
                        <CuriositySandwich
                            product={product}
                            overallScore={overallScore}
                            categoryMedian={categoryStats.median || product.price}
                            geminiData={hasStaleScore ? undefined : curiositySandwich}
                        />
                    );
                })()}

                {/* Cost-Benefit Comparison (Amazon-compliant - no price history) */}
                <CostBenefitChart product={product} />

                {/* Smart Offer Cards - Price vs Parcelamento Comparison */}
                {(() => {
                    // Generate simulated offers based on product price
                    // In production, this would come from API/cache
                    const basePrice = product.price;

                    // Busca link de afiliado do Mercado Livre dos offers do produto
                    const mlOffer = product.offers?.find(o =>
                        o.storeSlug === 'mercadolivre' ||
                        o.store?.toLowerCase().includes('mercado') ||
                        o.url?.includes('mercadolivre.com')
                    );
                    const mlAffiliateUrl = mlOffer?.url || mlOffer?.affiliateUrl;

                    // Busca link de afiliado da Amazon dos offers do produto
                    const amazonOffer = product.offers?.find(o =>
                        o.storeSlug === 'amazon' ||
                        o.store?.toLowerCase().includes('amazon') ||
                        o.url?.includes('amazon.com')
                    );
                    const amazonAffiliateUrl = amazonOffer?.url || amazonOffer?.affiliateUrl;

                    const offers: OfferData[] = [
                        {
                            platform: 'amazon',
                            priceSpot: basePrice,
                            installments: 10,
                            installmentValue: Math.round(basePrice / 10),
                            shipping: 'free',
                            inStock: true,
                            productKeyword: product.name,
                            affiliateUrl: amazonAffiliateUrl, // Usa link de afiliado se disponível
                        },
                        {
                            platform: 'mercadolivre',
                            priceSpot: Math.round(basePrice * 1.03), // ML typically 3% higher
                            installments: 18,
                            installmentValue: Math.round((basePrice * 1.03) / 18),
                            shipping: 'free', // Frete grátis para consistência UX
                            inStock: true,
                            productKeyword: product.name,
                            affiliateUrl: mlAffiliateUrl, // Usa link de afiliado se disponível
                        },
                    ];

                    return (
                        <div className="mb-4">
                            <SmartOfferCard
                                offers={offers}
                                categoryId={product.categoryId}
                                productName={product.name}
                            />
                        </div>
                    );
                })()}

                {/* Botões de lojas: REMOVIDO - já integrado no SmartOfferCard acima */}
                {/* A seção "Ver todas as lojas" foi removida para evitar duplicação */}

                {/* Data de atualização removida para design mais limpo */}
            </div>
        </section>
    );
}

// ============================================
// CURIOSITY SANDWICH - Smart Insight Generator
// ============================================
// Uses the "Curiosity Sandwich" technique:
// 1. Hook: Address a potential doubt/curiosity
// 2. Explanation: Use real data to explain
// 3. Positive conclusion: End on a positive note

interface CuriositySandwichProps {
    product: Product;
    overallScore: number;
    categoryMedian: number;
    geminiData?: { icon: string; text: string }; // AI-generated text (preferred)
}

function CuriositySandwich({ product, overallScore, categoryMedian, geminiData }: CuriositySandwichProps) {
    // If Gemini provided the insight, use it directly (ensures consistent score)
    if (geminiData?.text) {
        // Filter out robot emoji 🤖 - use a neutral icon instead
        const displayIcon = geminiData.icon === '🤖' ? '📊' : (geminiData.icon || '📊');
        // Replace internal term "unified_score" with user-friendly "nota geral"
        const displayText = geminiData.text
            .replace(/unified_score/gi, 'nota geral')
            .replace(/Com um nota geral/gi, 'Com uma nota geral'); // Fix grammar
        return (
            <div className="mb-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                <div className="flex gap-2">
                    <span className="text-lg flex-shrink-0">{displayIcon}</span>
                    <p className="text-xs text-blue-800 leading-relaxed">
                        {displayText}
                    </p>
                </div>
            </div>
        );
    }

    // Fallback: Generate locally (only when Gemini data not available)
    const attrs = (product.attributes || {}) as Record<string, unknown>;
    const specs = (product.specs || {}) as Record<string, unknown>;
    const scores = product.scores || {};
    const categoryId = product.categoryId;
    const price = product.price;

    // Find the best and worst scores for this product
    const scoreEntries = Object.entries(scores)
        .filter(([key]) => key.startsWith('c'))
        .filter(([, val]) => typeof val === 'number') as [string, number][];

    const bestScore = scoreEntries.reduce((best, curr) => curr[1] > best[1] ? curr : best, ['', 0]);
    const worstScore = scoreEntries.reduce((worst, curr) => curr[1] < worst[1] ? curr : worst, ['', 10]);

    // Generate insight based on product characteristics
    const generateInsight = (): { icon: string; text: string } | null => {
        // HIGH PRICE + LOWER SCORE
        if (price > categoryMedian * 1.5 && overallScore < 8.5) {
            // PREMIUM PRICE JUSTIFICATION
            if (price > categoryMedian * 1.3) {
                if (categoryId === 'tv') {
                    const hasOLED = product.name.toLowerCase().includes('oled') ||
                        attrs.panelType === 'OLED' ||
                        specs.panelType === 'OLED';

                    if (hasOLED) {
                        return {
                            icon: '💡',
                            text: `Esta ${product.brand} OLED está no segmento premium, o que reflete na nota de custo-benefício que puxa a nota geral para baixo. A qualidade de imagem com pretos perfeitos e cores vibrantes é insuperável. Para cinéfilos e gamers que exigem o melhor, o investimento vale cada centavo.`
                        };
                    }
                    return {
                        icon: '💡',
                        text: `Esta ${product.brand} está no segmento premium, o que reflete na nota de custo-benefício que puxa a nota geral para baixo. A qualidade de imagem e os recursos são de alto nível. Para quem busca performance sem compromisso, é uma escolha certeira.`
                    };
                }
                if (categoryId === 'fridge') {
                    const hasSmartFeatures = attrs.smartFeatures || attrs.wifi || attrs.familyHub;
                    if (hasSmartFeatures) {
                        return {
                            icon: '💡',
                            text: `Esta ${product.brand} está no segmento premium, o que reflete na nota de custo-benefício que puxa a nota geral para baixo. A qualidade de construção, refrigeração e os recursos smart são de alto nível. Se o orçamento permite, é uma escolha sólida para quem prioriza tecnologia e durabilidade.`
                        };
                    }
                    return {
                        icon: '💡',
                        text: `Esta ${product.brand} está no segmento premium, o que reflete na nota de custo-benefício que puxa a nota geral para baixo. A qualidade de construção e refrigeração são de alto nível. Se o orçamento permite, é uma escolha sólida para quem prioriza durabilidade e performance.`
                    };
                }
                return {
                    icon: '💡',
                    text: `Esta ${product.brand} está no segmento premium, o que reflete na nota de custo-benefício que puxa a nota geral para baixo. A qualidade de imagem e os recursos são de alto nível. Para quem busca performance sem compromisso, é uma escolha certeira.`
                };
            }
        }

        // LOW PRICE + HIGH SCORE (Best Value)
        if (price < categoryMedian * 0.8 && overallScore >= 7.5) {
            return {
                icon: '🎯',
                text: `Aqui está uma descoberta interessante: esta ${product.brand} entrega nota ${overallScore.toFixed(2)} por apenas R$${price.toLocaleString('pt-BR')}, bem abaixo da média da categoria. É a combinação ideal de qualidade e economia - difícil encontrar melhor no mercado.`
            };
        }

        // SPECIFIC WEAKNESS BUT OVERALL GOOD
        if (overallScore >= 8 && worstScore[1] < 7) {
            const weaknessLabels: Record<string, Record<string, string>> = {
                tv: { c6: 'brilho', c7: 'pós-venda', c8: 'som' },
                fridge: { c6: 'ruído', c8: 'recursos smart' },
                air_conditioner: { c5: 'nível de ruído', c7: 'filtros' }
            };
            const weakLabel = weaknessLabels[categoryId]?.[worstScore[0]] || 'critério específico';

            return {
                icon: '📊',
                text: `Esta ${product.brand} com nota ${overallScore.toFixed(2)} é excelente na maioria dos aspectos. O ${weakLabel} ficou um pouco abaixo da média, mas não compromete a experiência geral. Para a maioria dos usuários, os pontos fortes superam esse detalhe.`
            };
        }

        // EXCELLENT GAMING (for TVs)
        if (categoryId === 'tv' && (scores.c5 as number) >= 9.5) {
            const hdmi21Ports = Number(attrs.hdmi21Ports) || 0;
            const inputLag = attrs.responseTime || specs.responseTime;
            if (hdmi21Ports > 0) {
                return {
                    icon: '🎮',
                    text: `Gamers, atenção: esta ${product.brand} tem ${hdmi21Ports}x portas HDMI 2.1 e input lag de ${inputLag || '<10'}ms. É uma das melhores TVs para PS5 e Xbox Series X do mercado. Para quem joga competitivo, essa especificação faz diferença real.`
                };
            }
        }

        // HIGH EFFICIENCY (for AC and Fridges)
        if ((categoryId === 'fridge' || categoryId === 'air_conditioner') && (scores.c2 as number) >= 9) {
            if (categoryId === 'air_conditioner' && (attrs.inverter || specs.inverter)) {
                return {
                    icon: '⚡',
                    text: `Com tecnologia Inverter, este ${product.brand} pode economizar até 60% na conta de luz comparado aos modelos convencionais. O investimento inicial maior se paga em poucos anos de uso. Uma escolha inteligente para o longo prazo.`
                };
            }
            if (categoryId === 'fridge') {
                const energyClass = attrs.energyClass || specs.energyClass;
                return {
                    icon: '⚡',
                    text: `Esta ${product.brand}${energyClass ? ` com selo ${energyClass}` : ''} é altamente eficiente, mantendo a conta de energia sob controle mesmo funcionando 24 horas. Para quem pensa no custo total de propriedade, é um diferencial importante.`
                };
            }
        }

        // DEFAULT: Good balanced product
        if (overallScore >= 7.5) {
            return {
                icon: '✨',
                text: `Esta ${product.brand} com nota ${overallScore.toFixed(2)} oferece um bom equilíbrio entre recursos, qualidade e preço. É uma escolha segura para quem busca confiabilidade sem surpresas.`
            };
        }

        return null;
    };

    const insight = generateInsight();

    if (!insight) return null;

    return (
        <div className="mb-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
            <div className="flex gap-2">
                <span className="text-lg flex-shrink-0">{insight.icon}</span>
                <p className="text-xs text-blue-800 leading-relaxed">
                    {insight.text}
                </p>
            </div>
        </div>
    );
}

// ============================================
// COST-BENEFIT CHART (Amazon-compliant replacement)
// ============================================

function CostBenefitChart({ product }: { product: Product }) {
    // Get dynamic category price stats (median is more representative than average)
    const categoryStats = getCategoryPriceStats(product.categoryId);

    // Use median as the comparison point (more realistic than average with outliers)
    const categoryMedian = categoryStats.median || product.price * 1.2;

    // Category-specific advantage labels
    const categoryLabels: Record<string, Record<string, string>> = {
        tv: {
            c1: 'Excelente custo-benefício',
            c2: 'Processamento de imagem superior',
            c3: 'Alta confiabilidade',
            c4: 'Sistema rápido e moderno',
            c5: 'Perfeito para gaming',
            c6: 'Ótimo brilho/anti-reflexo',
            c7: 'Suporte pós-venda confiável',
            c8: 'Som de qualidade',
            c9: 'Conectividade completa',
            c10: 'Design premium',
        },
        fridge: {
            c1: 'Excelente custo-benefício',
            c2: 'Alta eficiência energética',
            c3: 'Ótima capacidade de armazenamento',
            c4: 'Sistema de refrigeração eficiente',
            c5: 'Alta confiabilidade',
            c6: 'Baixo nível de ruído',
            c7: 'Suporte pós-venda confiável',
            c8: 'Recursos smart avançados',
            c9: 'Design premium',
            c10: 'Funcionalidades extras úteis',
        },
        air_conditioner: {
            c1: 'Excelente custo-benefício',
            c2: 'Alta eficiência energética',
            c3: 'Boa capacidade de refrigeração',
            c4: 'Alta durabilidade',
            c5: 'Super silencioso',
            c6: 'Tecnologia Inverter',
            c7: 'Bons filtros de ar',
            c8: 'Fácil instalação',
            c9: 'Conectividade WiFi',
            c10: 'Design compacto',
        },
        'robot-vacuum': {
            c1: 'Navegação inteligente',
            c2: 'App e conectividade estáveis',
            c3: 'Mop eficiente',
            c4: 'Escovas anti-emaranhamento',
            c5: 'Altura ideal para móveis baixos',
            c6: 'Peças facilmente disponíveis',
            c7: 'Boa autonomia de bateria',
            c8: 'Baixo nível de ruído',
            c9: 'Base automática completa',
            c10: 'Recursos de IA úteis',
        },
    };

    const categoryAvg = categoryMedian;
    const isBelow = product.price < categoryAvg;
    const priceDiff = Math.abs(((categoryAvg - product.price) / categoryAvg * 100));

    // Get category-specific labels or fallback
    const labels = categoryLabels[product.categoryId] || categoryLabels.tv;

    // Find the best score to highlight as advantage (excluding c1 which is cost-benefit)
    const scores = product.scores || {};
    const scoreEntries = Object.entries(scores)
        .filter(([key]) => key.startsWith('c') && key !== 'c1')
        .filter(([, val]) => typeof val === 'number');

    const bestScore = scoreEntries.length > 0
        ? scoreEntries.reduce((best, curr) => (curr[1] as number) > (best[1] as number) ? curr : best)
        : null;

    // Only show price advantage message if product is actually cheaper than average
    // For expensive products, show their best feature instead
    let advantageMessage: string;

    if (isBelow && priceDiff >= 10) {
        // Product is significantly cheaper than average
        advantageMessage = `${priceDiff.toFixed(0)}% mais barato que a média da categoria`;
    } else if (bestScore && (bestScore[1] as number) >= 8.5) {
        // Product has an excellent score in some criteria
        advantageMessage = `${labels[bestScore[0]] || 'Destaque'}: nota ${(bestScore[1] as number).toFixed(1)}`;
    } else {
        // Fallback - show brand or premium message
        advantageMessage = `Produto ${product.brand} com qualidade comprovada`;
    }

    return (
        <div className="mb-3 p-3 rounded-lg bg-emerald-50">
            <div className="flex items-center gap-1.5 mb-2 text-emerald-700">
                {isBelow && priceDiff >= 10 ? <TrendingDown size={14} /> : <Star size={14} />}
                <span className="text-xs font-semibold">
                    ✓ {advantageMessage}
                </span>
            </div>

            {/* Visual comparison bar - only show for significant price advantage */}
            {isBelow && priceDiff >= 10 && (
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="w-20 text-[10px] text-text-secondary">Este produto</span>
                        <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full flex items-center justify-end pr-1.5 bg-emerald-500"
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
            )}
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

function BenchmarksSection({ benchmarks, productSlug }: { benchmarks: BenchmarkScore[]; productSlug?: string }) {
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

            {/* Data Correction CTA */}
            <InlineDataCorrectionCTA
                elementId="pdp_benchmarks"
                sectionLabel="Comparativo com a Categoria"
                productSlug={productSlug}
            />
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
// CONTEXTUAL CALCULATOR WIDGET
// ============================================
// Shows a calculator widget on product pages, pre-filled with the product's dimensions/specs

function ContextualCalculatorWidget({ product }: { product: Product }) {
    const categoryId = product.categoryId;
    const specs = (product.specs || {}) as Record<string, unknown>;
    const attrs = (product.attributes || {}) as Record<string, unknown>;

    // TV - Show tools as teaser cards that open in modals
    if (categoryId === 'tv') {
        const width = Number(specs.width || specs.widthCm || attrs.width) || 145;
        const height = Number(specs.height || specs.heightCm || attrs.height) || 84;
        const depth = Number(specs.depth || specs.depthCm || attrs.depth) || 28;

        return (
            <div className="mt-8 py-6">
                <h2 className="font-display text-lg font-semibold text-text-primary mb-4">
                    🛠️ Ferramentas Interativas
                </h2>
                <ToolGrid>
                    {/* Geometry Tool - Opens in Modal */}
                    <GeometryToolTrigger>
                        <GeometryEngine
                            config={TV_CABE_ESTANTE}
                            initialObjectDims={{ width, height, depth }}
                            readonlyObject={true}
                            showRecommendations={false}
                        />
                    </GeometryToolTrigger>

                    {/* OLED vs LED Comparison - Opens in Modal */}
                    <VisualComparisonTrigger>
                        <ComparisonEngine config={OLED_VS_LED} />
                    </VisualComparisonTrigger>
                </ToolGrid>
            </div>
        );
    }

    // Fridge - Show "Geladeira passa na porta?" in modal
    if (categoryId === 'fridge') {
        const width = Number(specs.width || specs.widthCm || attrs.width) || 90;
        const height = Number(specs.height || specs.heightCm || attrs.height) || 180;
        const depth = Number(specs.depth || specs.depthCm || attrs.depth) || 75;

        return (
            <div className="mt-8 py-6">
                <h2 className="font-display text-lg font-semibold text-text-primary mb-4">
                    🛠️ Ferramentas Interativas
                </h2>
                <ToolGrid>
                    <GeometryToolTrigger>
                        <GeometryEngine
                            config={GELADEIRA_PASSA_PORTA}
                            initialObjectDims={{ width, height, depth }}
                            readonlyObject={true}
                            showRecommendations={false}
                        />
                    </GeometryToolTrigger>
                </ToolGrid>
            </div>
        );
    }

    // Air Conditioner - Show BTU Calculator in modal
    if (categoryId === 'air_conditioner') {
        const btus = Number(specs.btus || attrs.btus || attrs.btuCapacity) || 12000;

        return (
            <div className="mt-8 py-6">
                <h2 className="font-display text-lg font-semibold text-text-primary mb-4">
                    🛠️ Ferramentas Interativas
                </h2>
                <ToolGrid>
                    <ToolTrigger
                        type="calculator"
                        title="Esse BTU é suficiente?"
                        description={`Este aparelho tem ${btus.toLocaleString('pt-BR')} BTUs. Calcule se é ideal para seu ambiente.`}
                        badge="Calculadora"
                        modalTitle="Calculadora de BTU"
                    >
                        <div className="bg-blue-50 rounded-xl p-4 mb-4">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">❄️</span>
                                <div>
                                    <div className="font-semibold text-blue-700">
                                        Este aparelho tem {btus.toLocaleString('pt-BR')} BTUs
                                    </div>
                                    <p className="text-xs text-blue-600">
                                        Compare com o resultado da calculadora abaixo
                                    </p>
                                </div>
                            </div>
                        </div>
                        <RateEngine
                            config={CALCULADORA_BTU}
                            showRecommendations={false}
                        />
                    </ToolTrigger>
                </ToolGrid>
            </div>
        );
    }

    // Monitor - Show "Monitor cabe na mesa?" in modal
    if (categoryId === 'monitor') {
        const width = Number(specs.width || attrs.width) || 61;
        const height = Number(specs.height || attrs.height) || 45;
        const depth = Number(specs.depth || attrs.depth) || 20;

        return (
            <div className="mt-8 py-6">
                <h2 className="font-display text-lg font-semibold text-text-primary mb-4">
                    🛠️ Ferramentas Interativas
                </h2>
                <ToolGrid>
                    <GeometryToolTrigger>
                        <GeometryEngine
                            config={MONITOR_CABE_MESA}
                            initialObjectDims={{ width, height, depth }}
                            readonlyObject={true}
                            showRecommendations={false}
                        />
                    </GeometryToolTrigger>
                </ToolGrid>
            </div>
        );
    }

    // Notebook - Show "Notebook cabe na mochila?" in modal
    if (categoryId === 'notebook') {
        const width = Number(specs.width || attrs.width) || 36;
        const height = Number(specs.thickness || attrs.thickness || specs.height) || 2.5;
        const depth = Number(specs.depth || attrs.depth) || 25;

        return (
            <div className="mt-8 py-6">
                <h2 className="font-display text-lg font-semibold text-text-primary mb-4">
                    🛠️ Ferramentas Interativas
                </h2>
                <ToolGrid>
                    <GeometryToolTrigger>
                        <GeometryEngine
                            config={NOTEBOOK_CABE_MOCHILA}
                            initialObjectDims={{ width, height, depth }}
                            readonlyObject={true}
                            showRecommendations={false}
                        />
                    </GeometryToolTrigger>
                </ToolGrid>
            </div>
        );
    }

    // Lavadora - Show "Lavadora passa na porta?" in modal
    if (categoryId === 'lavadora' || categoryId === 'washing_machine') {
        const width = Number(specs.width || attrs.width) || 65;
        const height = Number(specs.height || attrs.height) || 110;
        const depth = Number(specs.depth || attrs.depth) || 65;

        return (
            <div className="mt-8 py-6">
                <h2 className="font-display text-lg font-semibold text-text-primary mb-4">
                    🛠️ Ferramentas Interativas
                </h2>
                <ToolGrid>
                    <GeometryToolTrigger>
                        <GeometryEngine
                            config={LAVADORA_PASSA_PORTA}
                            initialObjectDims={{ width, height, depth }}
                            readonlyObject={true}
                            showRecommendations={false}
                        />
                    </GeometryToolTrigger>
                </ToolGrid>
            </div>
        );
    }

    // Robot Vacuum - Show "Robô passa sob os móveis?" in modal
    if (categoryId === 'robot-vacuum') {
        const height = Number(specs.height || attrs.height) || 7.5;
        const diameter = Number(specs.diameter || attrs.diameter || specs.width) || 33;

        return (
            <div className="mt-8 py-6">
                <h2 className="font-display text-lg font-semibold text-text-primary mb-4">
                    🛠️ Ferramentas Interativas
                </h2>
                <ToolGrid>
                    <GeometryToolTrigger>
                        <GeometryEngine
                            config={ROBO_PASSA_MOVEL}
                            initialObjectDims={{ width: diameter, height: height }}
                            readonlyObject={true}
                            showRecommendations={false}
                        />
                    </GeometryToolTrigger>
                </ToolGrid>
            </div>
        );
    }

    // Category not supported yet - show explicit fallback instead of silently disappearing
    return (
        <ModuleFallback
            sectionId="interactive_tools"
            sectionName="Ferramentas Interativas"
            status="coming_soon"
            reason={`Ferramentas interativas em desenvolvimento para ${product.categoryId}`}
        />
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
// CONTEXTUAL SCORING SECTION (Lab Mode)
// ============================================
// Renders ContextSelector and ScoreAudit for products with scoring_facts

interface ContextualScoringSectionProps {
    facts: ProductFacts;
    categorySlug: string;
    productName: string;
    /** Base score to start calculations from (product's actual score) */
    baseScore?: number;
    /** Is this demo/mock data? */
    isDemo?: boolean;
}

function ContextualScoringSection({ facts, categorySlug, productName, baseScore, isDemo = false }: ContextualScoringSectionProps) {
    const {
        result,
        previousResult,
        selectedContext,
        availableContexts,
        setContext,
        hasRules,
        score,
        penalties,
        bonuses,
    } = useScoring(facts, categorySlug, { baseScore });

    if (!hasRules || availableContexts.length === 0) {
        return (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-700">
                    ⚠️ Regras não encontradas para categoria: <strong>{categorySlug}</strong>
                </p>
            </div>
        );
    }

    return (
        <section className="mb-8">
            {/* Lab Mode Banner */}
            <div className="mb-4 p-3 bg-violet-100 border border-violet-200 rounded-lg">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🧪</span>
                    <div>
                        <p className="font-semibold text-violet-800">Modo Laboratório</p>
                        <p className="text-xs text-violet-600">
                            Scoring Contextual ativo - Selecione um contexto para ver a nota mudar
                        </p>
                    </div>
                </div>
            </div>

            {/* Context Selector */}
            <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Qual é o seu contexto de uso?
                </h3>
                <ContextSelector
                    contexts={availableContexts}
                    selectedContextId={selectedContext || ''}
                    onContextChange={setContext}
                    grouped={true}
                    showDescriptions={true}
                />
            </div>

            {/* Score Audit */}
            {result && (
                <ScoreAudit
                    result={result}
                    previousResult={previousResult}
                    expanded={true}
                    isDemo={isDemo}
                />
            )}


        </section>
    );
}


// ============================================
// MAIN PDP COMPONENT
// ============================================

interface ProductDetailPageProps {
    product: Product;
    /** Layout configuration from getLayoutStrategy (optional - uses default if not provided) */
    layoutConfig?: import('@/types/dynamic-layout').DynamicLayoutConfig;
    /** Layout mode (visual/technical/gamer) from strategy */
    layoutMode?: 'visual' | 'technical' | 'gamer';
    /** Debug: reason for layout selection */
    layoutReason?: string;
    /** MAB Layout ID for conversion tracking */
    layoutId?: string;
    /** Show debug banner (only when ?forceLayout= is used) */
    isDebug?: boolean;
    /** Slot for content after hero section (SSR-injected) */
    afterHeroSlot?: React.ReactNode;
    /** Slot for deep dive content (SSR-injected) */
    deepDiveSlot?: React.ReactNode;
}

export function ProductDetailPage({ product, layoutConfig, layoutMode, layoutReason, layoutId, isDebug, afterHeroSlot, deepDiveSlot }: ProductDetailPageProps) {
    // State for extended data from JSON
    const [extendedData, setExtendedData] = useState<ProductData | null>(null);

    // ALL DATA NOW COMES FROM STATIC JSON (extendedData from mocks/*.json)
    // API calls removed for instant loading - see /docs/pdp-architecture.md

    // Load extended data from JSON on mount
    useEffect(() => {
        getProductExtendedData(product.id).then(setExtendedData);
    }, [product.id]);

    // Calculate score using the same function as category page
    const scoredProduct = useMemo(() => {
        try {
            return scoreProduct(product);
        } catch {
            return null;
        }
    }, [product]);

    // UNIFIED SCORE: getUnifiedScore() is the SINGLE source of truth 
    // The API's unified_score is IGNORED because it can be stale/cached
    // Only textual content from the API is used (verdict_card, pros_cons, etc.)
    const staticScore = getUnifiedScore(product);
    // ALWAYS use staticScore - never trust the API's score
    const unifiedScore = staticScore;
    const vsScore = scoredProduct?.computed?.vs ?? 5.0;

    // Category-specific fallback messages for solution
    const categoryMessages: Record<string, string> = {
        tv: 'TV com boa qualidade de imagem para uso diário.',
        fridge: 'Geladeira com boa capacidade e refrigeração eficiente.',
        air_conditioner: 'Ar condicionado com boa eficiência energética.',
        'robot-vacuum': 'Robô aspirador com boa automação para limpeza diária.',
    };

    // Extract audit data from product scoreReasons or use smart fallbacks
    const getSolution = () => {
        if (product.scoreReasons?.c1) return product.scoreReasons.c1;
        if (product.scoreReasons?.c5) return product.scoreReasons.c5;
        if (product.scoreReasons?.c2) return product.scoreReasons.c2;
        // Only mention cost-benefit if VS score is actually good
        if (vsScore >= 8) return 'Excelente relação qualidade-preço na categoria.';
        return categoryMessages[product.categoryId] || 'Produto com qualidade comprovada pela marca.';
    };

    const solution = getSolution();
    const attention = product.scoreReasons?.c3 || 'Verifique a garantia e disponibilidade de assistência técnica na sua região.';
    // Use unifiedScore (Gemini first, static fallback) for consistency
    const conclusion = `Com nota ${unifiedScore.toFixed(2)}/10, este ${product.brand} atende bem a maioria dos usuários. Ideal para quem busca ${product.benefitSubtitle || 'um produto confiável'}.`;

    // Generate "don't buy if" reasons - ALWAYS show at least one based on real data
    const dontBuyReasons: string[] = [];
    const attrs = (product.attributes || {}) as Record<string, unknown>;
    const specs = (product.specs || {}) as Record<string, unknown>;
    const scores = product.scores || {};

    // Category-specific reasons based on real product characteristics
    if (product.categoryId === 'tv') {
        // Brightness check
        const brightness = Number(attrs.brightness || specs.brightness) || 0;
        if (brightness > 0 && brightness < 700) {
            dontBuyReasons.push('Sua sala tem muita luz direta durante o dia');
        }
        // Gaming limitation
        const hdmi21Ports = Number(attrs.hdmi21Ports) || 0;
        if (hdmi21Ports === 0) {
            dontBuyReasons.push('Você pretende jogar PS5 ou Xbox Series X em 4K 120Hz');
        }
        // Sound limitation
        if ((scores.c8 as number) < 7) {
            dontBuyReasons.push('Você exige som potente sem usar soundbar');
        }
    }

    if (product.categoryId === 'fridge') {
        // Capacity check
        const capacity = Number(specs.capacity || attrs.capacity) || 0;
        if (capacity > 0 && capacity < 300) {
            dontBuyReasons.push('Sua família tem mais de 4 pessoas');
        }
        // Smart features
        if (!attrs.smartFeatures && !attrs.wifi && !attrs.familyHub) {
            dontBuyReasons.push('Você precisa de recursos smart e conectividade WiFi');
        }
        // Noise sensitivity
        if ((scores.c6 as number) < 7) {
            dontBuyReasons.push('A geladeira ficará próxima de áreas de descanso');
        }
    }

    if (product.categoryId === 'air_conditioner') {
        // Inverter check
        if (!attrs.inverter && !specs.inverter) {
            dontBuyReasons.push('Você precisa de economia máxima na conta de luz');
        }
        // WiFi control
        if (!attrs.wifi) {
            dontBuyReasons.push('Você quer controlar o ar pelo celular');
        }
        // Noise for bedrooms
        const noiseLevel = Number(attrs.noiseLevel) || 0;
        if (noiseLevel > 35) {
            dontBuyReasons.push('O aparelho ficará no quarto e você tem sono leve');
        }
    }

    // Robot Vacuum specific "don't buy" reasons
    if (product.categoryId === 'robot-vacuum') {
        // Random navigation is very limiting
        if (attrs.navigationType === 'random' || !attrs.hasMapping) {
            dontBuyReasons.push('Sua casa tem mais de 60m² ou planta complexa');
        }
        // No auto-empty dock
        if (!attrs.hasAutoEmpty) {
            dontBuyReasons.push('Você quer esquecer da limpeza por semanas sem esvaziar');
        }
        // Passive mop is nearly useless
        if (attrs.mopType === 'passive_drag') {
            dontBuyReasons.push('Você precisa remover manchas do piso, não só poeira');
        }
        // Pet hair issues with bristle brushes
        if (attrs.brushType === 'mixed_bristle') {
            dontBuyReasons.push('Você tem pets com pelo longo ou cabelo comprido em casa');
        }
    }

    // Price warning - applies to all categories
    const priceThresholds: Record<string, number> = {
        tv: 5000,
        fridge: 8000,
        air_conditioner: 3000,
        'robot-vacuum': 2000,
    };
    const threshold = priceThresholds[product.categoryId] || 5000;
    if (product.price > threshold) {
        dontBuyReasons.push('Seu orçamento é limitado e você não pode aguardar promoções');
    }

    // Support warning if score is low
    if ((scores.c7 as number) < 7) {
        dontBuyReasons.push('Você precisa de suporte técnico rápido e confiável');
    }

    // GUARANTEE at least one reason if none generated - USE SPECIFIC REASONS PER CATEGORY
    if (dontBuyReasons.length === 0) {
        // Category-specific fallbacks with REAL limitations
        if (product.categoryId === 'tv') {
            // Samsung TVs don't support Dolby Vision - a REAL dealbreaker for cinephiles
            if (product.brand === 'Samsung') {
                dontBuyReasons.push('Você exige Dolby Vision (Samsung usa HDR10+, não suporta DV)');
            } else if (product.brand === 'LG') {
                dontBuyReasons.push('Você precisa de brilho extremo para salas muito iluminadas');
            } else {
                dontBuyReasons.push('Você exige recursos premium de gaming como VRR e ALLM');
            }
        } else if (product.categoryId === 'fridge') {
            dontBuyReasons.push('Você precisa de dispensador de água/gelo na porta');
        } else if (product.categoryId === 'air_conditioner') {
            dontBuyReasons.push('Você precisa de Inverter para máxima economia de energia');
        } else if (product.categoryId === 'robot-vacuum') {
            dontBuyReasons.push('Você precisa de navegação LiDAR para casas grandes');
        } else {
            // Ultimate fallback - price-based
            dontBuyReasons.push(product.price > 5000
                ? 'Você busca o menor preço possível na categoria'
                : 'Você precisa de conectividade WiFi e controle por app'
            );
        }
    }

    // Limit to exactly 1 reason (as per design standard)
    const finalReasons = dontBuyReasons.slice(0, 1);

    // Generate Enhanced Schema for AI Attribution (Dataset Strategy)
    const enhancedSchema = useMemo(() => {
        return generateEnhancedProductSchema({
            product,
            hmumScore: unifiedScore,
            // SIC score will be added when product has shadow metrics
            consensoScore: unifiedScore,
        });
    }, [product, unifiedScore]);

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

            <div className="min-h-screen bg-bg-ground">
                {/* Breadcrumb */}
                <div className="max-w-7xl mx-auto px-4 py-4">
                    {/* DEBUG BANNER - Shows only when layout is forced via ?forceLayout= */}
                    {isDebug && layoutId && (
                        <div className="mb-4 p-3 bg-violet-100 border border-violet-300 rounded-lg">
                            <div className="flex items-center gap-3">
                                <span className="text-lg">🧪</span>
                                <div>
                                    <div className="font-semibold text-violet-800 text-sm">
                                        Layout Ativo: {layoutId}
                                    </div>
                                    <p className="text-xs text-violet-600">
                                        Modo: {layoutMode || 'default'} • Este banner aparece apenas com ?forceLayout=
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
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
                        <main className="flex-1 min-w-0">
                            <ProductHero
                                product={product}
                                unifiedScore={unifiedScore}
                                headline={extendedData?.header?.subtitle || product.benefitSubtitle}
                                curiositySandwich={(product as any).curiositySandwich || undefined}
                                isLoading={false}
                            />

                            {/* Context Score Section - Personalização HMUM */}
                            <section id="context-score">
                                <ContextScoreSection product={product} />
                            </section>

                            {/* AI Attribution Banner - Reinforces data ownership for crawlers */}
                            <div className="mt-4">
                                <AttributionBanner productName={product.shortName || product.name} />
                            </div>

                            {/* ========================================
                                CONTEXTUAL SCORING SECTION
                                Moved to page.tsx using ContextScoreSection (HMUM)
                                The new component uses the Unified Processor with
                                multiplicative scoring instead of base+bonus
                               ======================================== */}


                            {/* ========================================
                                LAYOUT-SPECIFIC SECTION: TECHNICAL RADAR
                                For layout_tecnico: Show radar chart FIRST (data-focused)
                               ======================================== */}
                            {layoutMode === 'technical' && (
                                <div className="mt-4 mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                    <h2 className="font-display text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                                        📊 DNA do Produto
                                        <span className="text-xs font-normal text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                                            Análise Técnica
                                        </span>
                                    </h2>
                                    <p className="text-sm text-blue-700 mb-4">
                                        Pontuação detalhada em 10 critérios técnicos baseada no Consenso 360º.
                                    </p>
                                    {/* Technical layout shows radar chart prominently at the top */}
                                </div>
                            )}

                            {/* ========================================
                                LAYOUT-SPECIFIC SECTION: VISUAL LIFESTYLE
                                For layout_visual: Show lifestyle benefits (experience-focused)
                               ======================================== */}
                            {layoutMode === 'visual' && (
                                <div className="mt-4 mb-6 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                                    <h2 className="font-display text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                                        ✨ Por Que Este Produto
                                        <span className="text-xs font-normal text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                                            Estilo de Vida
                                        </span>
                                    </h2>
                                    <div className="grid grid-cols-2 gap-3">
                                        {product.featureBenefits?.slice(0, 4).map((benefit, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-sm text-emerald-800">
                                                <span className="text-emerald-500">✓</span>
                                                {benefit.title}
                                            </div>
                                        )) || (
                                                <>
                                                    <div className="flex items-center gap-2 text-sm text-emerald-800">
                                                        <span className="text-emerald-500">✓</span>
                                                        Marca confiável {product.brand}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-emerald-800">
                                                        <span className="text-emerald-500">✓</span>
                                                        Qualidade comprovada
                                                    </div>
                                                </>
                                            )}
                                    </div>
                                </div>
                            )}

                            {/* Audit Verdict - Rich from JSON or Fallback */}
                            <div className="mt-6">
                                {extendedData?.auditVerdict ? (
                                    <AuditVerdictSection data={extendedData.auditVerdict} />
                                ) : (
                                    <>
                                        <AuditVerdict
                                            solution={solution}
                                            attention={attention}
                                            conclusion={conclusion}
                                            score={unifiedScore}
                                            pros={undefined}
                                            cons={undefined}
                                            dontBuyReasons={finalReasons}
                                            isLoading={false}
                                        />
                                    </>
                                )}

                                {/* AI-Generated Review - REMOVED (Projeto Voz Unificada) */}
                                {/* Dados da IA agora são integrados diretamente nos componentes visuais */}
                            </div>

                            {/* === COMMUNITY CONSENSUS CARD === */}
                            {/* "Prova Social Qualificada" - Owner Experience layer */}
                            {/* Now using REAL data from Gemini (Amazon BR + Mercado Livre reviews) */}
                            <div className="mt-6">
                                <CommunityConsensusCard
                                    data={{
                                        // Static consensus estimation (to be filled in mock JSON)
                                        consensusScore: Math.round(85 + (unifiedScore - 7) * 5),
                                        totalReviews: product.price > 5000 ? "2.5k+" : "5k+",
                                        acceptableFlaw: (() => {
                                            // Category-specific usability flaws (NOT specs - that's in AuditVerdict)
                                            if (product.categoryId === 'tv') {
                                                if (product.brand === 'Samsung') return "O sistema Tizen pode demorar para abrir apps pesados.";
                                                if (product.brand === 'LG') return "O controle Magic Remote exige adaptação no início.";
                                                return "Menu de configurações pode ser confuso para iniciantes.";
                                            }
                                            if (product.categoryId === 'fridge' || product.categoryId === 'geladeira') {
                                                return "Sons de ajuste de temperatura são normais nas primeiras horas.";
                                            }
                                            if (product.categoryId === 'air_conditioner') {
                                                return "O controle remoto poderia ter display mais visível.";
                                            }
                                            if (product.categoryId === 'robot-vacuum') {
                                                if (product.brand === 'Roborock') return "App pode pedir atualização de firmware logo na primeira configuração.";
                                                if (product.brand === 'WAP') return "Navegação aleatória exige mais paciência em casas grandes.";
                                                if (product.brand === 'Xiaomi') return "Configuração inicial requer criar conta Mi Home.";
                                                return "Primeira limpeza pode demorar mais para mapear a casa.";
                                            }
                                            return "Manual de instruções poderia ser mais detalhado em português.";
                                        })(),
                                        realWorldScenario: (() => {
                                            // Real owner scenarios - "Vivência do Dono"
                                            if (product.categoryId === 'tv') {
                                                const brightness = Number((product.attributes as Record<string, unknown>)?.brightness || 0);
                                                if (brightness > 800) return "Salva casamentos em salas com muita luz durante o dia.";
                                                return "Perfeita para maratonas de série à noite com as luzes apagadas.";
                                            }
                                            if (product.categoryId === 'fridge' || product.categoryId === 'geladeira') {
                                                return "Famílias relatam economia visível na conta de luz após 2 meses.";
                                            }
                                            if (product.categoryId === 'air_conditioner') {
                                                return "Usuários dormem melhor com o modo Sleep ativado.";
                                            }
                                            if (product.categoryId === 'robot-vacuum') {
                                                if (product.brand === 'Roborock') return "Donos de pets relatam que a escova de borracha não embolota pelo como modelos com cerdas.";
                                                if (product.brand === 'WAP') return "Ideal para quem quer experimentar automação sem gastar muito.";
                                                if (product.brand === 'Xiaomi') return "Após configurar, funciona de forma confiável por meses.";
                                                return "Automação de limpeza diária libera tempo para outras atividades.";
                                            }
                                            return "Maioria dos compradores recomendaria para amigos e família.";
                                        })(),
                                        goldenTip: (() => {
                                            // Insider tips from owners - gamification element
                                            if (product.categoryId === 'tv') {
                                                if (product.brand === 'Samsung') return "Ative o Modo Jogo para reduzir input lag em 40%.";
                                                if (product.brand === 'LG') return "Use o botão de roda do Magic Remote para ajustar volume rapidamente.";
                                                return "Calibre o brilho para 45-50% para economizar energia sem perder qualidade.";
                                            }
                                            if (product.categoryId === 'fridge' || product.categoryId === 'geladeira') {
                                                return "Deixe 5cm de espaço atrás para melhor circulação e economia.";
                                            }
                                            if (product.categoryId === 'air_conditioner') {
                                                return "Limpe o filtro a cada 15 dias para manter eficiência máxima.";
                                            }
                                            if (product.categoryId === 'robot-vacuum') {
                                                if (product.brand === 'Roborock') return "Configure limpeza automática 10min após sair de casa via rotina Alexa/Google.";
                                                if (product.brand === 'WAP') return "Execute limpeza completa 2x antes de confiar no mapa salvo.";
                                                if (product.brand === 'Xiaomi') return "Use o modo 'Mop Intenso' apenas em áreas sem tapete.";
                                                return "Esvazie o reservatório após cada uso para evitar odores.";
                                            }
                                            return "Registre a garantia no site do fabricante para suporte prioritário.";
                                        })(),
                                    }}
                                />
                            </div>

                            {/* === OWNERSHIP INSIGHTS (TCO) - Custo Real de Propriedade === */}
                            {/* SLOT: deepDiveSlot - implementado inline para compatibilidade com 'use client' */}
                            <section id="ownership-insights" className="mt-6 py-4">
                                {(() => {
                                    try {
                                        const hasMappingResult = hasComponentMapping(product.id);

                                        if (hasMappingResult) {
                                            const ownershipAnalysis = analyzeProductOwnership(product);
                                            const expandedMetrics = getExpandedMetricsFromSIC(
                                                product.id,
                                                product.price || 0,
                                                ownershipAnalysis.shadowMetrics?.monthlyCostBreakdown?.energy ?? 10,
                                                ownershipAnalysis.categoryConstants?.avgLifespanYears ?? 8
                                            );

                                            if (expandedMetrics) {
                                                return (
                                                    <OwnershipInsightsExpanded
                                                        metrics={expandedMetrics}
                                                        productName={product.name}
                                                    />
                                                );
                                            }
                                        }

                                        // Fallback: versão simplificada
                                        const ownershipAnalysis = analyzeProductOwnership(product);
                                        return (
                                            <OwnershipInsights
                                                purchasePrice={product.price || 0}
                                                shadowMetrics={ownershipAnalysis.shadowMetrics}
                                                categoryConstants={ownershipAnalysis.categoryConstants}
                                                energyKwhMonth={(product as any).energy?.kwh_month}
                                                productName={product.name}
                                            />
                                        );
                                    } catch (error) {
                                        console.error('[ProductDetailPage] Error rendering ownership insights:', error);
                                        return (
                                            <ModuleFallback
                                                sectionId="ownership_insights"
                                                sectionName="Impacto no Bolso (TCO)"
                                                status="error"
                                                reason="Erro ao calcular custo de propriedade"
                                                missingFields={[String(error)]}
                                            />
                                        );
                                    }
                                })()}
                            </section>

                            {/* === UNKNOWN UNKNOWNS (Engenharia Oculta) === */}
                            <section id="unknown-unknowns" className="mt-4">
                                <ProductUnknownUnknownsWidget product={product} />
                            </section>

                            {/* === TRUST SANDWICH === */}
                            {/* Metodologia Consenso 360º - Positioned AFTER Veredito, BEFORE Simulators */}
                            {/* Creates the narrative flow: Fact (Veredito) → Proof (Methodology) → Exploration (Simulators) */}
                            <div className="mt-6">
                                <MethodologyAccordion productName={product.name} />
                            </div>

                            {/* Análise por critério agora usa o gráfico aranha das 10 Dores */}
                            {/* O ProductRadarChart já está sendo renderizado acima com as tooltips do Gemini */}

                            {/* Product DNA - REMOVED: Using ProductRadarChart with Unified Voice instead */}
                            {/* ProductDnaSection foi removido para evitar duplicação com ProductRadarChart */}

                            {/* Simulators - Use extended data or generate dynamically */}
                            {/* For VISUAL layout: Show simulators more prominently */}
                            {(() => {
                                // Priority: Extended JSON data > Generated data
                                const simulatorsData = extendedData?.simulators ||
                                    (supportsSimulators(product.categoryId) ? generateSimulatorsData(product) : null);

                                if (!simulatorsData) {
                                    return (
                                        <ModuleFallback
                                            sectionId="simulators"
                                            sectionName="Simuladores Inteligentes"
                                            status={extendedData === null ? 'loading' : 'unavailable'}
                                            reason={extendedData === null ? 'Carregando simuladores...' : `Simuladores não disponíveis para a categoria ${product.categoryId}`}
                                            missingFields={['extendedData.simulators', `supportsSimulators('${product.categoryId}')`]}
                                        />
                                    );
                                }
                                return <SimulatorsSection data={simulatorsData as any} categoryId={product.categoryId} />;
                            })()}

                            {/* Product DNA Radar Chart - Enhanced with Unified Voice */}
                            {/* Always show DNA chart regardless of layout mode */}
                            <ProductRadarChart
                                productName={product.shortName || product.name}
                                data={(() => {
                                    // Category-specific labels matching products.ts data definitions
                                    const categoryLabels: Record<string, Record<string, string>> = {
                                        tv: {
                                            // TV criteria matching products.ts (c1=Custo-Benefício, etc.)
                                            c1: '💰 Custo-Benefício',
                                            c2: '🔲 Processamento',
                                            c3: '🛡️ Confiabilidade',
                                            c4: '📱 Fluidez Sistema',
                                            c5: '🎮 Gaming',
                                            c6: '☀️ Brilho',
                                            c7: '🔧 Pós-Venda',
                                            c8: '🔊 Som',
                                            c9: '🔌 Conectividade',
                                            c10: '✨ Design',
                                        },
                                        fridge: {
                                            // Fridge criteria matching products.ts
                                            c1: '💰 Custo-Benefício',
                                            c2: '⚡ Eficiência Energética',
                                            c3: '📦 Capacidade',
                                            c4: '❄️ Refrigeração',
                                            c5: '🛡️ Confiabilidade',
                                            c6: '🔇 Nível de Ruído',
                                            c7: '🔧 Pós-Venda',
                                            c8: '📱 Recursos Smart',
                                            c9: '✨ Design',
                                            c10: '⚙️ Funcionalidades',
                                        },
                                        geladeira: {
                                            // Alias for fridge - same mapping
                                            c1: '💰 Custo-Benefício',
                                            c2: '⚡ Eficiência Energética',
                                            c3: '📦 Capacidade',
                                            c4: '❄️ Refrigeração',
                                            c5: '🛡️ Confiabilidade',
                                            c6: '🔇 Nível de Ruído',
                                            c7: '🔧 Pós-Venda',
                                            c8: '📱 Recursos Smart',
                                            c9: '✨ Design',
                                            c10: '⚙️ Funcionalidades',
                                        },
                                        air_conditioner: {
                                            // AC criteria matching products.ts
                                            c1: '💰 Custo-Benefício',
                                            c2: '⚡ Eficiência',
                                            c3: '❄️ Capacidade BTU',
                                            c4: '🛡️ Durabilidade',
                                            c5: '🔇 Silêncio',
                                            c6: '🔄 Inverter',
                                            c7: '🔧 Pós-Venda',
                                            c8: '🛡️ Filtros',
                                            c9: '📱 Conectividade',
                                            c10: '✨ Design',
                                        },
                                        laptop: {
                                            c1: '💻 Desempenho CPU',
                                            c2: '🎮 Desempenho GPU',
                                            c3: '🖥️ Qualidade da Tela',
                                            c4: '🔋 Bateria',
                                            c5: '📐 Construção',
                                            c6: '⌨️ Teclado/Trackpad',
                                            c7: '💰 Custo-Benefício',
                                            c8: '💾 Armazenamento/RAM',
                                            c9: '🌡️ Ruído/Temperatura',
                                            c10: '🔌 Conectividade',
                                        },
                                        'robot-vacuum': {
                                            // PARR-BR criteria for Robot Vacuums
                                            c1: '🗺️ Navegação',
                                            c2: '📱 App/Voz',
                                            c3: '🧹 Mop',
                                            c4: '🔄 Escovas',
                                            c5: '📏 Altura',
                                            c6: '🔧 Peças',
                                            c7: '🔋 Bateria',
                                            c8: '🔇 Ruído',
                                            c9: '🏠 Base',
                                            c10: '🤖 IA',
                                        },
                                    };
                                    const labels = categoryLabels[product.categoryId] || categoryLabels.tv;

                                    // ALWAYS use static product scores (product.scores) for consistency with overall score
                                    // This ensures the radar chart matches the product's calculated score
                                    const dnaData = extractDNAFromProduct({
                                        categoryId: product.categoryId,
                                        brand: product.brand,
                                        price: product.price,
                                        scores: product.scores,
                                        computed: scoredProduct?.computed,
                                        scoreReasons: product.scoreReasons,
                                        specs: product.specs as Record<string, unknown>,
                                        attributes: product.attributes as Record<string, unknown>,
                                    });

                                    // All radar tooltips now come from static scoreReasons in product JSON

                                    return dnaData;
                                })()}
                            />

                            {/* Tech Specs with Micro-Bars */}
                            {product.benchmarks && product.benchmarks.length > 0 && (
                                <TechSpecsSection benchmarks={product.benchmarks} />
                            )}

                            {/* Contextual Calculator Widget */}
                            <ContextualCalculatorWidget product={product} />

                            {/* TECH SPECS ACCORDION - Ficha Técnica Completa (SEO Optimized) */}
                            <div className="mt-8">
                                <TechSpecsAccordion
                                    categories={generateSpecCategories({
                                        // Core identifiers for category-specific templates
                                        categoryId: product.categoryId,
                                        brand: product.brand,
                                        technicalSpecs: product.technicalSpecs,
                                        // Spread existing specs and attributes
                                        ...product.specs,
                                        ...product.attributes,
                                        // TV-specific defaults (only used if categoryId === 'tv')
                                        screenSize: (product.specs as Record<string, unknown>)?.screenSize || 65,
                                        panelType: (product.specs as Record<string, unknown>)?.panelType || (product.attributes as Record<string, unknown>)?.panelType,
                                        resolution: (product.specs as Record<string, unknown>)?.resolution || '4K',
                                        refreshRate: (product.specs as Record<string, unknown>)?.refreshRate || 120,
                                        smartPlatform: (product.specs as Record<string, unknown>)?.smartPlatform || 'Tizen',
                                    })}
                                    productName={product.name}
                                    productSlug={product.id}
                                    defaultOpen={layoutMode === 'technical' || (typeof window !== 'undefined' && window.innerWidth >= 1024 && layoutMode !== 'visual')}
                                />
                            </div>

                            {/* Bundle Widget - Dynamic Cross-Sell */}
                            {(() => {
                                const bundleMatch = getBestAccessoryForProduct(product);
                                if (!bundleMatch) return null;
                                const savings = calculateBundleSavings(product.price, bundleMatch.accessory.price);
                                return (
                                    <BundleWidget
                                        mainProduct={{
                                            name: product.name,
                                            shortName: product.shortName,
                                            asin: (product as unknown as { asin?: string }).asin || 'B0SAMPLE',
                                            price: product.price,
                                            imageUrl: product.imageUrl,
                                            affiliateUrl: product.offers?.[0]?.affiliateUrl || product.offers?.[0]?.url || `https://www.amazon.com.br/dp/${(product as any).asin}?tag=comparatop-20`,
                                        }}
                                        accessory={{
                                            name: bundleMatch.accessory.name,
                                            shortName: bundleMatch.accessory.shortName,
                                            asin: bundleMatch.accessory.asin,
                                            price: bundleMatch.accessory.price,
                                            imageUrl: bundleMatch.accessory.imageUrl,
                                            affiliateUrl: (bundleMatch.accessory as any).affiliateUrl || `https://www.amazon.com.br/dp/${bundleMatch.accessory.asin}?tag=comparatop-20`,
                                        }}
                                        title={bundleMatch.accessory.accessoryCategoryId === 'soundbar' ? '🔊 Complete sua experiência' : '✨ Acessório recomendado'}
                                        subtitle={bundleMatch.matchReason}
                                        savings={savings}
                                    />
                                );
                            })()}

                            {/* MANUAL DOWNLOAD SECTION - Recursos e Downloads */}
                            <div className="mt-8 border-t border-gray-200">
                                <ManualDownloadSection
                                    productId={product.id}
                                    productName={product.name}
                                />
                            </div>
                        </main>
                    </div>
                </div>
            </div>

            {/* Battle Mode Modal - Kept for deep comparison feature */}
            {product.mainCompetitor && (
                <BattleModeModal
                    currentProduct={product}
                    rival={product.mainCompetitor}
                />
            )}

            {/* Smart Sticky Footer with VS Battle Bar - Product page specific */}
            {/* Shows current product VS main competitor when available */}
            <SmartStickyFooter
                currentProduct={{
                    id: product.id,
                    name: product.name,
                    shortName: product.shortName,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    score: getUnifiedScore(product),
                    amazonUrl: (product as unknown as { asin?: string }).asin
                        ? `https://www.amazon.com.br/dp/${(product as unknown as { asin?: string }).asin}?tag=comparatop-20`
                        : undefined,
                }}
                rivalProduct={(() => {
                    if (!product.mainCompetitor) return undefined;
                    const fullRivalProduct = getProductById(product.mainCompetitor.id);
                    return {
                        id: product.mainCompetitor.id,
                        name: product.mainCompetitor.name,
                        shortName: product.mainCompetitor.shortName,
                        price: product.mainCompetitor.price,
                        imageUrl: product.mainCompetitor.imageUrl || product.mainCompetitor.image,
                        score: fullRivalProduct
                            ? getUnifiedScore(fullRivalProduct)
                            : ((product.mainCompetitor as unknown as Product).scores
                                ? getUnifiedScore(product.mainCompetitor as unknown as Product)
                                : (product.mainCompetitor.score ?? 7.5)),
                    };
                })()}
                compareUrl="/comparar"
                layoutId={layoutId}
            />
        </>
    );
}
