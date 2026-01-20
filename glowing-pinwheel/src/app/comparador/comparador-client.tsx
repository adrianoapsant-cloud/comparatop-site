'use client';

// ============================================================================
// COMPARADOR CLIENT - Interactive Dashboard UI
// ============================================================================
// Client component that renders all interactive TCO components
// NOW WITH CATEGORY FILTER - Only compare products within the same category
// ============================================================================

import { useRouter } from 'next/navigation';
import { Layers, TrendingUp, Shield, Sparkles, Trophy, Target, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductTcoData, UsagePersona, TcoViewMode } from '@/types/tco';
import { calculateTotalTco, formatBRL } from '@/lib/tco';
import type { TcoCategory } from '@/lib/tco/mock-data';

// Import TCO Components
import {
    RealitySwitch,
    PersonaSelector,
    TcoControlsBar,
    IcebergChart,
    RiskShield,
    DataTable,
} from '@/components/tco';

import { CategoryFilter, useCategory, CATEGORIES } from '@/components/tco/category-filter';
import { useTcoState, useScoreView } from '@/hooks/use-url-state';

// ============================================
// TYPES
// ============================================

interface WinnerHighlights {
    bestTco: ProductTcoData;
    lowestRisk: ProductTcoData;
    bestValue: ProductTcoData;
}

interface ComparadorClientProps {
    initialProducts: ProductTcoData[];
    initialWinners: WinnerHighlights;
    initialView: TcoViewMode;
    initialPersona: UsagePersona;
    initialYears: number;
    initialCategory: TcoCategory;
}

// ============================================
// CONSUMPTION MODEL DESCRIPTIONS
// ============================================

const CONSUMPTION_DESCRIPTIONS: Record<TcoCategory, string> = {
    'smart-tvs': 'TVs são calculadas por horas de tela ligada. Perfil Gamer usa ~6-7h/dia.',
    'geladeiras': 'Geladeiras funcionam 24h/dia. O consumo varia pelo compressor e abertura de portas.',
    'lavadoras': 'Lavadoras são calculadas por ciclos de lavagem. Família média: ~8 lavagens/semana.',
    'ar-condicionado': 'Ar-condicionado tem alto consumo variável. Inverter economiza até 60%.',
    'robo-aspiradores': 'Robôs têm consumo mínimo (~30W). O grande custo é manutenção: escovas, filtros e peças.',
};

// ============================================
// WINNER CARD COMPONENT
// ============================================

interface WinnerCardProps {
    title: string;
    icon: React.ReactNode;
    product: ProductTcoData;
    persona: UsagePersona;
    years: number;
    accentColor: string;
    badgeText: string;
}

function WinnerCard({
    title,
    icon,
    product,
    persona,
    years,
    accentColor,
    badgeText,
}: WinnerCardProps) {
    const tco = calculateTotalTco(product, { years, persona });
    const router = useRouter();

    return (
        <div className={cn(
            'relative p-4 rounded-2xl border-2 transition-all',
            'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer',
            accentColor
        )}
            onClick={() => router.push(`/produto/${product.id}`)}
        >
            {/* Badge */}
            <div className="absolute -top-3 left-4">
                <span className={cn(
                    'inline-flex items-center gap-1 px-2.5 py-1 rounded-full',
                    'text-xs font-bold text-white shadow-lg',
                    accentColor.includes('emerald') && 'bg-emerald-500',
                    accentColor.includes('blue') && 'bg-blue-500',
                    accentColor.includes('amber') && 'bg-amber-500',
                )}>
                    {icon}
                    {badgeText}
                </span>
            </div>

            {/* Content */}
            <div className="mt-3">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {title}
                </p>
                <h3 className="font-semibold text-gray-900 mt-1 truncate">
                    {product.name}
                </h3>

                <div className="flex items-baseline justify-between mt-2">
                    <div>
                        <span className="text-lg font-bold text-gray-900">
                            {formatBRL(tco.totalTco)}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                            TCO {years}a
                        </span>
                    </div>
                    <RiskShield
                        score={product.scrsScore}
                        brandName={product.brand}
                        size="sm"
                        showLabel={false}
                    />
                </div>
            </div>
        </div>
    );
}

// ============================================
// MAIN CLIENT COMPONENT
// ============================================

export function ComparadorClient({
    initialProducts,
    initialWinners,
    initialView,
    initialPersona,
    initialYears,
    initialCategory,
}: ComparadorClientProps) {
    const router = useRouter();
    const { persona, years, isTcoView } = useTcoState();
    const { scoreView } = useScoreView();
    const { category, categoryConfig } = useCategory();

    // Use URL state or fall back to initial
    const currentPersona = persona;
    const currentYears = years;
    const currentCategory = category;

    // Handle product detail navigation
    const handleViewDetails = (productId: string) => {
        router.push(`/produto/${productId}`);
    };

    // Select top products for chart (limit to 6 for visibility)
    const chartProducts = initialProducts.slice(0, 6);

    // Get category label
    const categoryLabel = CATEGORIES.find(c => c.id === currentCategory)?.label || 'Smart TVs';

    return (
        <>
            {/* ================================================================== */}
            {/* STICKY HEADER                                                      */}
            {/* ================================================================== */}
            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    {/* Title Section */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                                    <Layers className="w-5 h-5 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Engenharia de Valor
                                </h1>
                            </div>
                            <p className="text-sm text-gray-500 mt-1 ml-11">
                                Análise de TCO e Risco de Obsolescência
                            </p>
                        </div>

                        {/* Share button (desktop) */}
                        <div className="hidden md:block">
                            <TcoControlsBar variant="minimal" years={currentYears} />
                        </div>
                    </div>

                    {/* ============================================================ */}
                    {/* CATEGORY FILTER - FIRST AND MANDATORY                        */}
                    {/* ============================================================ */}
                    <div className="mt-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-gray-700">
                                Categoria:
                            </span>
                            <span className="text-xs text-gray-500">
                                (Compare apenas {categoryLabel} entre si)
                            </span>
                        </div>
                        <CategoryFilter variant="pills" />
                    </div>

                    {/* Controls Bar */}
                    <div className="pt-4 border-t border-gray-100">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                            {/* View Toggle */}
                            <RealitySwitch years={currentYears} />

                            {/* Separator (desktop) */}
                            <div className="hidden lg:block w-px h-10 bg-gray-200" />

                            {/* Persona Selector */}
                            <div className="flex-1 max-w-2xl">
                                <PersonaSelector variant="auto" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ================================================================== */}
            {/* MAIN CONTENT                                                       */}
            {/* ================================================================== */}
            <main className="container mx-auto px-4 py-8">

                {/* ============================================================== */}
                {/* CATEGORY CONTEXT BANNER                                        */}
                {/* ============================================================== */}
                <section className="mb-6">
                    <div className={cn(
                        'flex items-start gap-3 p-4 rounded-xl',
                        'bg-blue-50 border border-blue-200'
                    )}>
                        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-blue-700">
                                <strong>Comparando {categoryLabel}:</strong>{' '}
                                {CONSUMPTION_DESCRIPTIONS[currentCategory]}
                            </p>
                        </div>
                    </div>
                </section>

                {/* ============================================================== */}
                {/* HERO SECTION: Chart + Winner Cards                             */}
                {/* ============================================================== */}
                <section className="mb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Chart (Left 2/3) */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            {isTcoView ? 'Composição do Custo Real' : 'Comparativo de Preços'}
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            {isTcoView
                                                ? 'Preço + Energia + Manutenção - Revenda'
                                                : 'Preço de etiqueta dos produtos'
                                            }
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                                        <TrendingUp className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">
                                            {currentPersona === 'gamer' ? '🎮 Gamer' : currentPersona === 'eco' ? '🌱 Eco' : '👨‍👩‍👧‍👦 Família'}
                                        </span>
                                    </div>
                                </div>

                                <IcebergChart
                                    data={chartProducts}
                                    currentPersona={currentPersona}
                                    years={currentYears}
                                    height={350}
                                    showLegend
                                />
                            </div>
                        </div>

                        {/* Winner Cards (Right 1/3) */}
                        <div className="space-y-5">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                🏆 Destaques em {categoryLabel}
                            </h3>

                            <WinnerCard
                                title="Melhor Custo Total"
                                badgeText="Menor TCO"
                                icon={<Trophy className="w-3 h-3" />}
                                product={initialWinners.bestTco}
                                persona={currentPersona}
                                years={currentYears}
                                accentColor="border-emerald-200 bg-emerald-50 hover:border-emerald-300"
                            />

                            <WinnerCard
                                title="Menor Risco"
                                badgeText="Mais Confiável"
                                icon={<Shield className="w-3 h-3" />}
                                product={initialWinners.lowestRisk}
                                persona={currentPersona}
                                years={currentYears}
                                accentColor="border-blue-200 bg-blue-50 hover:border-blue-300"
                            />

                            <WinnerCard
                                title="Melhor Custo-Benefício"
                                badgeText="Recomendado"
                                icon={<Target className="w-3 h-3" />}
                                product={initialWinners.bestValue}
                                persona={currentPersona}
                                years={currentYears}
                                accentColor="border-amber-200 bg-amber-50 hover:border-amber-300"
                            />
                        </div>
                    </div>
                </section>

                {/* ============================================================== */}
                {/* TCO EXPLANATION BANNER                                         */}
                {/* ============================================================== */}
                {isTcoView && (
                    <section className="mb-8">
                        <div className={cn(
                            'p-4 rounded-2xl',
                            'bg-gradient-to-r from-emerald-50 to-teal-50',
                            'border border-emerald-200'
                        )}>
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-emerald-100">
                                    <Sparkles className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-emerald-800">
                                        Você está vendo o Custo Real
                                    </h3>
                                    <p className="text-sm text-emerald-700 mt-1">
                                        O TCO (Custo Total de Propriedade) inclui: <strong>Preço de compra</strong> +
                                        <strong> Energia</strong> ({currentYears} anos) +
                                        <strong> Manutenção</strong> (baseado no risco SCRS) -
                                        <strong> Valor de revenda</strong>.
                                        Produtos baratos na loja podem ser caros a longo prazo.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* ============================================================== */}
                {/* CATALOG: MutantTable                                           */}
                {/* ============================================================== */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Catálogo de {categoryLabel}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {initialProducts.length} produtos analisados
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 shadow-sm">
                        <DataTable
                            data={initialProducts}
                            persona={currentPersona}
                            years={currentYears}
                            scoreView={scoreView}
                            onViewDetails={handleViewDetails}
                            showSearch
                            emptyMessage="Nenhum produto encontrado com os filtros atuais"
                        />
                    </div>
                </section>

                {/* ============================================================== */}
                {/* FOOTER INFO                                                    */}
                {/* ============================================================== */}
                <footer className="mt-12 text-center text-sm text-gray-400">
                    <p>
                        Dados calculados com base em estimativas de consumo para {categoryLabel.toLowerCase()}.
                        Valores reais podem variar de acordo com o uso.
                    </p>
                    <p className="mt-1">
                        <a href="/metodologia" className="text-blue-500 hover:underline">
                            Saiba mais sobre nossa metodologia
                        </a>
                    </p>
                </footer>
            </main>
        </>
    );
}

// ============================================
// EXPORTS
// ============================================

export default ComparadorClient;
