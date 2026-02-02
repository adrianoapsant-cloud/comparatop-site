'use client';

// ============================================================================
// TCO ENGINE SECTION - Integratable TCO Analysis for Category Pages
// ============================================================================
// A collapsible section that shows TCO analysis within a category page
// Uses real product data from the category, converted to TCO format
// ============================================================================

import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Layers, TrendingUp, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ScoredProduct } from '@/types/category';
import type { ProductTcoData, UsagePersona, TcoViewMode, EnergyProfile } from '@/types/tco';
import { calculateTotalTco, rankByTco, formatBRL } from '@/lib/tco';
import { CATEGORY_CONFIGS } from '@/lib/tco/mock-data';
import type { TcoCategory } from '@/lib/tco/mock-data';

// Import TCO Components
import { RealitySwitch, PersonaSelector, IcebergChart, DataTable } from '@/components/tco';
import { FeedbackWidget } from './feedback-widget';
import { useTcoState, useScoreView } from '@/hooks/use-url-state';
import { ModuleFallback } from '@/components/pdp/ModuleFallback';

// Robot vacuum scoring module (SSOT for tags/scores)
import { getRobotVacuumDerived, type RobotVacuumDerived } from '@/categories/robot-vacuums';

// Score calculation - SINGLE SOURCE OF TRUTH
import { getUnifiedScore } from '@/lib/scoring/getUnifiedScore';
import type { Product } from '@/types/category';

// ============================================
// TYPES
// ============================================

interface TcoEngineSectionProps {
    /** Products from the category (ScoredProduct format) */
    products: ScoredProduct[];
    /** Category slug for mapping consumption model */
    categorySlug: string;
    /** Category name for display */
    categoryName: string;
    /** Additional class names */
    className?: string;
    /** Initially expanded? */
    defaultExpanded?: boolean;
}

// ============================================
// CATEGORY SLUG MAPPING
// ============================================

const SLUG_TO_TCO_CATEGORY: Record<string, TcoCategory> = {
    'smart-tvs': 'smart-tvs',
    'tv': 'smart-tvs',
    'geladeiras': 'geladeiras',
    'fridge': 'geladeiras',
    'lavadoras': 'lavadoras',
    'washer': 'lavadoras',
    'ar-condicionados': 'ar-condicionado',
    'air_conditioner': 'ar-condicionado',
    'robo-aspiradores': 'robo-aspiradores',
    'robos-aspiradores': 'robo-aspiradores',
    'robot-vacuum': 'robo-aspiradores',
};

// ============================================
// DETERMINISTIC SEED FUNCTION
// ============================================
// Generates a stable 0-1 value from a string (product ID)
// Ensures TCO values don't change on re-render
function deterministicSeed(str: string, salt: number = 0): number {
    let hash = salt;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash; // Convert to 32-bit integer
    }
    // Normalize to 0-1 range
    return Math.abs(hash % 1000) / 1000;
}

// ============================================
// PRODUCT CONVERSION
// ============================================

/**
 * Converts a ScoredProduct to ProductTcoData format
 * Uses category-specific consumption models
 */
function convertToTcoProduct(
    product: ScoredProduct,
    tcoCategory: TcoCategory
): ProductTcoData {
    const config = CATEGORY_CONFIGS[tcoCategory];

    // ============================================================
    // PRIORITY: Use REAL tcoData when available (from engineering analysis)
    // ============================================================
    const tcoData = (product as any).tcoData;
    const hasRealTcoData = tcoData && tcoData.energyCost5y !== undefined;

    // Robot vacuum: derive specs, tags, and scores from SSOT module
    const robotVacuumDerived: RobotVacuumDerived | null =
        tcoCategory === 'robo-aspiradores' ? getRobotVacuumDerived(product) : null;

    // Energy profile: use real data or fallback to category model
    let energyKwh: EnergyProfile;
    let energyCost: EnergyProfile;

    if (hasRealTcoData) {
        // Real data: convert 5-year cost to monthly
        const annualEnergyCost = tcoData.energyCost5y / 5;
        const monthlyEnergyCost = annualEnergyCost / 12;
        energyCost = {
            eco: Math.round(monthlyEnergyCost * 0.6 * 100) / 100,  // 60% of average
            family: Math.round(monthlyEnergyCost * 100) / 100,     // 100% (base case)
            gamer: Math.round(monthlyEnergyCost * 1.5 * 100) / 100, // 150% intensive
        };
        // Estimate kWh from cost (R$ 0.85/kWh)
        const energyRate = 0.85;
        energyKwh = {
            eco: Math.round(energyCost.eco / energyRate * 10) / 10,
            family: Math.round(energyCost.family / energyRate * 10) / 10,
            gamer: Math.round(energyCost.gamer / energyRate * 10) / 10,
        };
    } else {
        // Fallback: Generate energy profile based on category consumption model
        // Use deterministic seed based on product ID for stable values
        const baseMultiplier = 1 + (deterministicSeed(product.id) - 0.5) * 0.3; // ±15% variance
        energyKwh = {
            eco: Math.round(config.baseMonthlyKwh.eco * baseMultiplier * 10) / 10,
            family: Math.round(config.baseMonthlyKwh.family * baseMultiplier * 10) / 10,
            gamer: Math.round(config.baseMonthlyKwh.gamer * baseMultiplier * 10) / 10,
        };
        // Energy cost (R$ 0.85/kWh average)
        const energyRate = 0.85;
        energyCost = {
            eco: Math.round(energyKwh.eco * energyRate * 100) / 100,
            family: Math.round(energyKwh.family * energyRate * 100) / 100,
            gamer: Math.round(energyKwh.gamer * energyRate * 100) / 100,
        };
    }

    // SCRS based on brand tier (more realistic than productScore × multiplier)
    // Premium brands: 7.5-8.5, Mainstream: 5.5-7.0, Budget: 3.5-5.0
    const BRAND_SCRS_TIERS: Record<string, { base: number; max: number }> = {
        'Samsung': { base: 8.0, max: 8.5 },
        'LG': { base: 7.5, max: 8.2 },
        'Sony': { base: 7.0, max: 7.8 },
        'Apple': { base: 8.5, max: 9.0 },
        'Brastemp': { base: 7.5, max: 8.2 },
        'Electrolux': { base: 6.5, max: 7.2 },
        'Daikin': { base: 8.5, max: 9.0 },
        'TCL': { base: 5.5, max: 6.5 },
        'Philco': { base: 3.5, max: 4.5 },
        'Multilaser': { base: 3.0, max: 4.0 },
        'Consul': { base: 6.0, max: 6.8 },
        'Midea': { base: 4.5, max: 5.5 },
        // Robot vacuum brands
        'Roborock': { base: 7.5, max: 8.5 },
        'Xiaomi': { base: 7.0, max: 7.8 },
        'Dreame': { base: 7.3, max: 8.2 },
        'iRobot': { base: 8.5, max: 9.2 },
        'WAP': { base: 6.5, max: 7.5 },
    };

    const brandTier = BRAND_SCRS_TIERS[product.brand] || { base: 5.0, max: 6.0 };
    // Use deterministic seed with different salt for SCRS to get different but stable variance
    const scrsVariance = deterministicSeed(product.id, 42) * (brandTier.max - brandTier.base);
    const scrsScore = Math.round((brandTier.base + scrsVariance) * 10) / 10;

    // Maintenance cost: use real data or fallback to formula
    let annualMaintenance: number;
    if (hasRealTcoData && tcoData.maintenanceCost5y !== undefined) {
        // Real data: convert 5-year cost to annual
        annualMaintenance = tcoData.maintenanceCost5y / 5;
    } else {
        // Fallback: 2-8% of price based on SCRS
        const riskFactor = 10 - scrsScore;
        annualMaintenance = product.price * (0.02 + riskFactor * 0.006);
    }

    // Resale value (30-50% of price based on brand tier)
    const PREMIUM_BRANDS = ['Samsung', 'LG', 'Sony', 'Apple', 'Brastemp', 'Daikin', 'Roborock', 'iRobot', 'Dreame', 'XIAOMI', 'Xiaomi', 'eufy'];
    const isPremiumBrand = PREMIUM_BRANDS.includes(product.brand);
    const resalePercentage = isPremiumBrand ? 40 : 25;

    // Lifespan: use real data or fallback to category config
    let lifespanYears: number;
    if (hasRealTcoData && tcoData.lifespanYears !== undefined) {
        lifespanYears = tcoData.lifespanYears;
    } else {
        lifespanYears = Math.round((config.lifespanRange.min + config.lifespanRange.max) / 2);
    }

    // Technical score (different from SCRS - this is overall editorial)
    const productScore = product.computed?.overall ?? 7;

    // ============================================================
    // COMMUNITY vs TECHNICAL RATINGS - Business Logic
    // ============================================================
    // Priority: Use REAL data from product.voc when available
    // Fallback: Use DETERMINISTIC formula matching PDP consensus
    // 
    // Formula: approval_percentage = 85 + (productScore - 7) * 5
    //          star_rating = approval_percentage / 20
    // ============================================================

    let communityRating: number;
    let communityReviews: number;
    let technicalScore: number;

    // Technical score - USE CENTRAL FUNCTION (SSOT)
    // getUnifiedScore handles all fallbacks: PARR weighted → product.scores → 7.5
    technicalScore = getUnifiedScore(product as Product);

    // Check if product has VoC (Voice of Customer) data
    // Support both formats: consensusScore (0-100%) or averageRating (0-5)
    const vocData = product.voc as any;
    const hasVocData = vocData && (vocData.averageRating !== undefined || vocData.consensusScore !== undefined);

    if (hasVocData) {
        // ✅ USE REAL DATA from VoC
        if (vocData.consensusScore !== undefined) {
            // Convert percentage to 5-star scale: 82% → 4.1 stars
            communityRating = vocData.consensusScore / 20;
        } else {
            communityRating = vocData.averageRating;
        }

        // Parse totalReviews (may be string like "50+" or number)
        const rawReviews = vocData.totalReviews;
        if (typeof rawReviews === 'string') {
            communityReviews = parseInt(rawReviews.replace(/[^0-9]/g, ''), 10) || 0;
        } else {
            communityReviews = rawReviews || 0;
        }
    } else {
        // ⚠️ FALLBACK: Use DETERMINISTIC formula (same as PDP)
        // This ensures consistency between PDP CommunityConsensusCard and MutantTable
        const approvalPercentage = Math.round(85 + (productScore - 7) * 5); // 0-100%
        communityRating = approvalPercentage / 20; // Convert to 0-5 stars

        // Estimate review count based on price tier (deterministic by product)
        // Premium products tend to have fewer reviews, budget products more
        const priceHash = product.price % 1000; // Pseudo-random but deterministic
        const baseReviews = product.price > 3000 ? 1500 : product.price > 1500 ? 3500 : 6000;
        communityReviews = Math.round(baseReviews + priceHash);
    }

    // Round community rating only (technicalScore already rounded by getUnifiedScore)
    communityRating = Math.round(communityRating * 10) / 10;

    return {
        id: product.id,
        name: product.name,
        brand: product.brand,
        categoryId: tcoCategory,
        price: product.price,
        energyCost,
        energyKwh,
        maintenanceCost: Math.round(annualMaintenance),
        resaleValue: Math.round(product.price * (resalePercentage / 100)),
        resalePercentage,
        scrsScore,
        scrsBreakdown: {
            partsAvailability: Math.min(10, scrsScore + (deterministicSeed(product.id, 1) - 0.5)),
            serviceNetwork: Math.min(10, scrsScore * 0.9 + (deterministicSeed(product.id, 2) - 0.5)),
            repairability: Math.min(10, scrsScore * 0.85 + (deterministicSeed(product.id, 3) - 0.5)),
            brandReliability: Math.min(10, scrsScore * 1.05 + (deterministicSeed(product.id, 4) - 0.5)),
        },
        lifespanYears,
        features: {
            gaming: ((product as any).scores?.c1 ?? 0) > 7,
            energyEfficient: ((product as any).scores?.c2 ?? 0) > 7,
            familyFriendly: ((product as any).scores?.c3 ?? 0) > 7,
            premiumBrand: ((product as any).scores?.c4 ?? 0) > 7,
            smart: true,
            extendedWarranty: isPremiumBrand,
        },
        // 10 PARR-BR criteria badges - use derived scores for robot vacuums, raw scores for others
        profileBadges: robotVacuumDerived
            ? {
                c1: robotVacuumDerived.scores.c1 > 7,   // 🏠 Casa Grande (Navegação)
                c2: robotVacuumDerived.scores.c2 > 7,   // 📱 Smart (App/Conectividade)
                c3: robotVacuumDerived.scores.c3 > 7,   // 💧 Mop (Eficiência de Mop)
                c4: robotVacuumDerived.scores.c4 > 7,   // 🐕 Pets (Escovas)
                c5: robotVacuumDerived.scores.c5 > 7,   // 📐 Compacto (Altura)
                c6: robotVacuumDerived.scores.c6 > 7,   // 🔧 Fácil Manut (Peças)
                c7: robotVacuumDerived.scores.c7 > 7,   // 🔋 Bateria+ (Autonomia)
                c8: robotVacuumDerived.scores.c8 > 7,   // 🔇 Silencioso (Ruído)
                c9: robotVacuumDerived.scores.c9 > 7,   // 🏠 Auto-Dock (Base)
                c10: robotVacuumDerived.scores.c10 > 7, // 🤖 IA (Detecção)
            }
            : {
                c1: ((product as any).scores?.c1 ?? 0) > 7,
                c2: ((product as any).scores?.c2 ?? 0) > 7,
                c3: ((product as any).scores?.c3 ?? 0) > 7,
                c4: ((product as any).scores?.c4 ?? 0) > 7,
                c5: ((product as any).scores?.c5 ?? 0) > 7,
                c6: ((product as any).scores?.c6 ?? 0) > 7,
                c7: ((product as any).scores?.c7 ?? 0) > 7,
                c8: ((product as any).scores?.c8 ?? 0) > 7,
                c9: ((product as any).scores?.c9 ?? 0) > 7,
                c10: ((product as any).scores?.c10 ?? 0) > 7,
            },
        specs: {},
        imageUrl: (product as any).imageUrl || undefined,
        editorialScore: productScore,
        communityRating,
        communityReviews,
        technicalScore,
        matchScore: (product as any).matchScore,
    };
}

// ============================================
// CONSUMPTION MODEL DESCRIPTIONS
// ============================================

const CONSUMPTION_DESCRIPTIONS: Record<TcoCategory, string> = {
    'smart-tvs': 'Consumo calculado por horas de tela ligada. Perfil Gamer (~6h/dia), Família (~5h/dia), Eco (~3h/dia).',
    'geladeiras': 'Funcionam 24h/dia. Valores baseados em eficiência energética e frequência de abertura.',
    'lavadoras': 'Consumo por ciclos de lavagem. Família média usa ~8 lavagens/semana.',
    'ar-condicionado': 'Alto consumo variável. Inverter pode economizar até 60% vs convencional.',
    'robo-aspiradores': 'Consumo mínimo (~30W por ciclo). O grande custo é manutenção: escovas, filtros e peças de reposição.',
};

// ============================================
// MAIN COMPONENT
// ============================================

export function TcoEngineSection({
    products,
    categorySlug,
    categoryName,
    className,
    defaultExpanded = true,
}: TcoEngineSectionProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);
    const { persona, years, isTcoView } = useTcoState();
    const { scoreView } = useScoreView();

    // Map category slug to TCO category
    const tcoCategory = SLUG_TO_TCO_CATEGORY[categorySlug] || 'smart-tvs';

    // Check if TCO is supported for this category
    const isTcoSupported = tcoCategory in CATEGORY_CONFIGS;

    // Convert products to TCO format (limit to 100 for page size options)
    const tcoProducts = useMemo(() => {
        if (!isTcoSupported) return [];
        return products.slice(0, 100).map(p => convertToTcoProduct(p, tcoCategory));
    }, [products, tcoCategory, isTcoSupported]);

    // Calculate winners
    const winners = useMemo(() => {
        if (tcoProducts.length === 0) return null;

        const ranked = rankByTco(tcoProducts, { persona, years });
        const byRisk = [...tcoProducts].sort((a, b) => b.scrsScore - a.scrsScore);

        return {
            bestTco: ranked[0]?.product,
            lowestRisk: byRisk[0],
        };
    }, [tcoProducts, persona, years]);

    // Don't render if no TCO support - show explicit fallback
    if (!isTcoSupported || tcoProducts.length < 2) {
        return (
            <ModuleFallback
                sectionId="tco_engine"
                sectionName="Engenharia de Valor (TCO)"
                status="unavailable"
                reason={!isTcoSupported
                    ? `Análise TCO não disponível para categoria ${categorySlug}`
                    : 'Necessário mínimo de 2 produtos para comparação TCO'
                }
            />
        );
    }

    return (
        <section className={cn('mb-8', className)}>
            {/* Collapsible Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                    'w-full flex items-center justify-between gap-4 p-4 rounded-2xl',
                    'bg-gradient-to-r from-blue-50 to-indigo-50',
                    'border border-blue-200 hover:border-blue-300',
                    'transition-all group'
                )}
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                        <Layers className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold text-gray-900">
                            🔬 Engenharia de Valor
                        </h3>
                        <p className="text-sm text-gray-600">
                            Análise de TCO: Custo Total de Propriedade em {years} anos
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className={cn(
                        'px-3 py-1 rounded-full text-xs font-medium',
                        isTcoView
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-600'
                    )}>
                        {isTcoView ? '✨ Custo Real Ativo' : '💰 Preço de Etiqueta'}
                    </span>
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    )}
                </div>
            </button>

            {/* Expandable Content */}
            {isExpanded && (
                <div className="mt-4 space-y-4">
                    {/* Controls Row */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 p-4 bg-white rounded-xl border border-gray-200">
                        <div className="flex-shrink-0">
                            <RealitySwitch years={years} compact />
                        </div>
                        {/* Only show PersonaSelector for categories where energy consumption varies by usage pattern (e.g., TVs)
                            Robot vacuums have minimal, consistent energy consumption - the persona doesn't affect TCO significantly */}
                        {tcoCategory === 'smart-tvs' && (
                            <>
                                <div className="hidden lg:block w-px h-8 bg-gray-200" />
                                <div className="flex-1">
                                    <PersonaSelector variant="auto" />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Consumption Model Info */}
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <TrendingUp className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-700">
                            <strong>{categoryName}:</strong> {CONSUMPTION_DESCRIPTIONS[tcoCategory]}
                        </p>
                    </div>

                    {/* Chart */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-4">
                            {isTcoView ? 'Composição do Custo Real' : 'Comparativo de Preços'} - Top 6
                        </h4>
                        <IcebergChart
                            data={tcoProducts.slice(0, 6)}
                            currentPersona={persona}
                            years={years}
                            height={300}
                            showLegend
                        />
                    </div>

                    {/* Product Table with Score Column */}
                    <div className="bg-slate-50 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-4">
                            Catálogo Completo - {tcoProducts.length} produtos
                        </h4>
                        <DataTable
                            data={tcoProducts}
                            persona={persona}
                            years={years}
                            scoreView={scoreView}
                            showSearch
                            emptyMessage="Nenhum produto encontrado"
                        />
                    </div>

                    {/* Winner Highlights */}
                    {winners && isTcoView && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Best TCO */}
                            {winners.bestTco && (
                                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">🏆</span>
                                        <span className="text-sm font-semibold text-emerald-800">Menor TCO</span>
                                    </div>
                                    <p className="font-medium text-gray-900">{winners.bestTco.name}</p>
                                    <p className="text-lg font-bold text-emerald-600">
                                        {formatBRL(calculateTotalTco(winners.bestTco, { persona, years }).totalTco)}
                                        <span className="text-sm font-normal text-gray-500 ml-1">em {years} anos</span>
                                    </p>
                                </div>
                            )}

                            {/* Lowest Risk */}
                            {winners.lowestRisk && (
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">🛡️</span>
                                        <span className="text-sm font-semibold text-blue-800">Menor Risco</span>
                                    </div>
                                    <p className="font-medium text-gray-900">{winners.lowestRisk.name}</p>
                                    <p className="text-lg font-bold text-blue-600">
                                        SCRS {winners.lowestRisk.scrsScore.toFixed(1)}
                                        <span className="text-sm font-normal text-gray-500 ml-1">de 10</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TCO Explanation (when active) */}
                    {isTcoView && (
                        <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                            <div className="flex items-start gap-3">
                                <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-emerald-800">Como funciona o Custo Real?</h4>
                                    <p className="text-sm text-emerald-700 mt-1">
                                        <strong>TCO = Preço</strong> + <strong>Energia</strong> ({years} anos) +
                                        <strong> Manutenção</strong> (risco SCRS) − <strong>Revenda</strong>.
                                        Produtos baratos podem custar mais a longo prazo!
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Feedback Widget - Crowdsourced Data Auditing */}
                    <FeedbackWidget
                        categorySlug={categorySlug}
                    />
                </div>
            )
            }
        </section >
    );
}

// ============================================
// EXPORTS
// ============================================

export default TcoEngineSection;
