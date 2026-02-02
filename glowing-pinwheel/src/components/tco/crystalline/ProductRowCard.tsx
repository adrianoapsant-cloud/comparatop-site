'use client';

// ============================================================================
// PRODUCT ROW CARD - Crystalline Design System
// ============================================================================
// Design: Frosted Glass Light (glassmorphism)
// Layout: 5 zonas responsivas (Row no Desktop, Grid 2x2 no Mobile)
// ============================================================================

import { useState } from 'react';
import { Row, flexRender } from '@tanstack/react-table';
import Link from 'next/link';
import { Eye, Shield, Star, Bell, GitCompare } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductTcoData, UsagePersona } from '@/types/tco';
import type { ScoreViewMode } from '@/hooks/use-url-state';
import { formatBRL, calculateTotalTco } from '@/lib/tco';
import { HexagonScore } from './HexagonScore';
import { MatchDonut } from './MatchDonut';
import { HYBRID_GRID_COLS } from './HybridTableHeader';
import type { ActiveSortMetric } from './SortDropdown';
import { PriceAlertModal } from './PriceAlertModal';

// ============================================
// TYPES
// ============================================

interface ProductRowCardProps {
    row: Row<ProductTcoData>;
    scoreView: ScoreViewMode;
    persona?: UsagePersona;
    years?: number;
    activeSort?: ActiveSortMetric;
    className?: string;
}

// ============================================
// GLASSMORPHISM CLASSES
// ============================================

const glassCard = cn(
    'bg-white/80 backdrop-blur-md',
    'border border-white/40',
    'shadow-lg shadow-indigo-500/10', // Sombra colorida índigo
    'rounded-2xl',
    'transition-all duration-200',
    'hover:shadow-xl hover:shadow-indigo-500/15',
    'hover:bg-white/90'
);

// ============================================
// SUB-COMPONENTS
// ============================================

/** Feature badge pill */
function FeatureBadge({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <span className={cn(
            'inline-flex items-center px-1.5 py-0.5 rounded-full',
            'bg-slate-100 text-slate-600 text-xs font-medium',
            className
        )}>
            {children}
        </span>
    );
}

/** TCO Badge - emerald pill with tooltip */
function TcoBadge({ value }: { value: number }) {
    return (
        <span
            className={cn(
                'inline-flex items-center px-2 py-0.5 rounded-full',
                'bg-emerald-50 text-emerald-700',
                'text-xs font-semibold cursor-help'
            )}
            title="Custo Total de Propriedade: soma do preço de compra + energia + manutenção em 5 anos"
        >
            TCO: {formatBRL(value)}
        </span>
    );
}

/** Risk shield icon with semantic color */
function RiskIcon({ score }: { score: number }) {
    const color = score >= 7 ? 'text-emerald-500' : score >= 5 ? 'text-amber-500' : 'text-red-500';
    return (
        <div className="flex items-center gap-1">
            <Shield className={cn('w-4 h-4', color)} />
            <span className={cn('text-xs font-bold', color)}>{score.toFixed(1)}</span>
        </div>
    );
}

/** Risk badge with numeric score and label */
function RiskBadge({ score }: { score: number }) {
    const getConfig = (s: number) => {
        if (s >= 7) return { label: 'Baixo', bg: 'bg-emerald-100', text: 'text-emerald-700', icon: 'text-emerald-500' };
        if (s >= 5) return { label: 'Médio', bg: 'bg-amber-100', text: 'text-amber-700', icon: 'text-amber-500' };
        return { label: 'Alto', bg: 'bg-red-100', text: 'text-red-700', icon: 'text-red-500' };
    };
    const config = getConfig(score);
    return (
        <div
            className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-lg cursor-help', config.bg)}
            title="Nível de Risco SCRS: avalia segurança da marca, suporte pós-venda e disponibilidade de peças"
        >
            <Shield className={cn('w-3.5 h-3.5', config.icon)} />
            <span className={cn('text-sm font-bold', config.text)}>{score.toFixed(1)}</span>
            <span className={cn('text-xs font-medium', config.text)}>{config.label}</span>
        </div>
    );
}

/** Community stars with tooltip */
function CommunityStars({ rating, reviews }: { rating: number; reviews: number }) {
    const formatReviews = (count: number) => {
        if (count >= 1000) return `${(count / 1000).toFixed(1).replace('.0', '')}k`;
        return count.toString();
    };

    return (
        <div
            className="flex items-center gap-1 text-slate-400 cursor-help"
            title="Nota da Comunidade: média das avaliações de compradores reais em lojas online"
        >
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs">{rating.toFixed(1)}</span>
            <span className="text-xs">({formatReviews(reviews)})</span>
        </div>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function ProductRowCard({
    row,
    scoreView,
    persona = 'family',
    years = 5,
    activeSort,
    className
}: ProductRowCardProps) {
    const product = row.original;
    const tco = calculateTotalTco(product, { persona, years });
    const score = product.technicalScore ?? product.editorialScore ?? 7.0;
    const matchScore = product.matchScore ?? 0;
    const productSlug = product.id;

    // Price Alert Modal state
    const [priceAlertOpen, setPriceAlertOpen] = useState(false);

    // Visual highlighting based on activeSort
    const isPriceActive = activeSort === 'price';
    const isTcoActive = activeSort === 'tco';
    const isScoreActive = activeSort === 'score';
    const isCommunityActive = activeSort === 'communityScore';
    const isRiskActive = activeSort === 'risk';
    const isMatchActive = activeSort === 'match';

    return (
        <article className={cn(glassCard, 'p-4', className)}>
            {/* ============================================ */}
            {/* DESKTOP LAYOUT (≥768px) - Hybrid Table Row */}
            {/* Uses HYBRID_GRID_COLS for alignment with header */}
            {/* ============================================ */}
            <div className={cn(
                'hidden md:grid gap-4 items-center',
                HYBRID_GRID_COLS
            )}>
                {/* ZONA 1: Identidade */}
                <div className="flex items-center gap-3 min-w-0">
                    {/* Imagem clicável com botão de comparação */}
                    <div className="relative flex-shrink-0 w-14 h-14">
                        <Link
                            href={`/produto/${productSlug}`}
                            className="block w-full h-full rounded-xl overflow-hidden bg-slate-50 hover:ring-2 hover:ring-indigo-300 transition-all"
                        >
                            {product.imageUrl ? (
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-contain mix-blend-multiply"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    📦
                                </div>
                            )}
                        </Link>
                        {/* Botão de Comparação - canto superior direito */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // TODO: Adicionar lógica de comparação
                                console.log('Adicionar à comparação:', product.id);
                            }}
                            className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md transition-colors z-10"
                            title="Adicionar à comparação"
                        >
                            <GitCompare className="w-3 h-3 text-white" />
                        </button>
                    </div>

                    {/* Título + Badges */}
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            {product.brand}
                        </p>
                        <Link
                            href={`/produto/${productSlug}`}
                            className="block font-semibold text-slate-800 truncate hover:text-indigo-600 transition-colors"
                        >
                            {product.name}
                        </Link>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {(product as any).hasApp && <FeatureBadge>📱 App</FeatureBadge>}
                            {(product as any).hasMop && <FeatureBadge>🧹 Mop</FeatureBadge>}
                            {(product as any).hasLidar && <FeatureBadge>📡 LiDAR</FeatureBadge>}
                        </div>
                    </div>
                </div>

                {/* ZONA 2: Autoridade Técnica */}
                <div className={cn(
                    'flex flex-col items-center transition-opacity',
                    isCommunityActive && 'opacity-60'
                )}>
                    <div
                        className="cursor-help"
                        title="Nota Técnica ComparaTop: avaliação especialista de 0-10 baseada em especificações, construção e custo-benefício"
                    >
                        <HexagonScore score={score} size={48} />
                    </div>
                    {scoreView === 'community' && (
                        <div className={cn(
                            'transition-opacity',
                            isScoreActive && 'opacity-60'
                        )}>
                            <CommunityStars
                                rating={product.communityRating ?? 0}
                                reviews={product.communityReviews ?? 0}
                            />
                        </div>
                    )}
                </div>

                {/* ZONA 3: Inteligência Financeira */}
                <div className="flex flex-col items-center gap-1.5">
                    {/* Preço - highlighted when active */}
                    <span
                        className={cn(
                            'text-xl text-slate-900 transition-all cursor-help',
                            isPriceActive ? 'font-bold' : 'font-semibold',
                            isTcoActive && 'opacity-60'
                        )}
                        title="Preço de Compra: menor preço encontrado em lojas parceiras"
                    >
                        {formatBRL(product.price)}
                    </span>
                    {/* TCO Badge - highlighted when active */}
                    <span
                        className={cn(
                            'inline-flex items-center px-2.5 py-1 rounded-md transition-all cursor-help',
                            isTcoActive ? 'text-sm font-bold' : 'text-sm font-semibold',
                            isPriceActive && 'opacity-60',
                            tco.priceVsTcoPercent <= 30
                                ? 'bg-emerald-100 text-emerald-800'
                                : tco.priceVsTcoPercent <= 60
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-red-100 text-red-800'
                        )}
                        title="TCO (Custo Total de Propriedade): preço + energia + manutenção em 5 anos. Verde = economia, Vermelho = custo alto"
                    >
                        TCO: {formatBRL(tco.totalTco)}
                    </span>
                </div>

                {/* ZONA 4: Match & Risco */}
                <div className="flex flex-col items-center gap-2">
                    {/* Match Donut - highlighted when active */}
                    <div
                        className={cn(
                            'transition-opacity cursor-help',
                            isRiskActive && 'opacity-60'
                        )}
                        title="Match %: compatibilidade com seu perfil de uso selecionado"
                    >
                        {matchScore > 0 ? (
                            <MatchDonut percentage={matchScore} size={38} />
                        ) : (
                            <span className="text-slate-300 text-xs">—</span>
                        )}
                    </div>
                    {/* Risk Badge - highlighted when active */}
                    <div className={cn(
                        'transition-opacity',
                        isMatchActive && 'opacity-60'
                    )}>
                        <RiskBadge score={product.scrsScore} />
                    </div>
                </div>

                {/* ZONA 5: Ações */}
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => setPriceAlertOpen(true)}
                        className="p-2 rounded-lg hover:bg-amber-100 hover:text-amber-600 transition-colors group"
                        title="Criar alerta de preço"
                    >
                        <Bell className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
                    </button>
                    <Link
                        href={`/produto/${productSlug}`}
                        className={cn(
                            'flex items-center gap-1 px-3 py-1.5 rounded-lg',
                            'bg-slate-100 hover:bg-indigo-100 hover:text-indigo-700',
                            'text-sm font-medium text-slate-700',
                            'transition-colors'
                        )}
                    >
                        <Eye className="w-4 h-4" />
                        <span className="hidden lg:inline">Ver</span>
                    </Link>
                </div>
            </div>

            {/* ============================================ */}
            {/* MOBILE LAYOUT (<768px) - Compact Data Strip */}
            {/* ============================================ */}
            <div className="md:hidden flex flex-col gap-3">
                {/* HEADER: Compact Image + Title/Brand */}
                <div className="flex items-center gap-3">
                    {/* Small Image clicável com botão de comparação */}
                    <div className="relative flex-shrink-0 w-16 h-16">
                        <Link
                            href={`/produto/${productSlug}`}
                            className="block w-full h-full rounded-xl overflow-hidden bg-slate-50 active:ring-2 active:ring-indigo-300 transition-all"
                        >
                            {product.imageUrl ? (
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-contain mix-blend-multiply"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300 text-2xl">
                                    📦
                                </div>
                            )}
                        </Link>
                        {/* Botão de Comparação - canto superior direito */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // TODO: Adicionar lógica de comparação
                                console.log('Adicionar à comparação:', product.id);
                            }}
                            className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-indigo-600 active:bg-indigo-700 rounded-full shadow-md transition-colors z-10"
                            title="Adicionar à comparação"
                        >
                            <GitCompare className="w-3 h-3 text-white" />
                        </button>
                    </div>
                    {/* Title + Brand */}
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            {product.brand}
                        </p>
                        <Link
                            href={`/produto/${productSlug}`}
                            className="font-semibold text-slate-800 text-sm leading-tight line-clamp-2 active:text-indigo-600 transition-colors"
                        >
                            {product.name}
                        </Link>
                    </div>
                </div>

                {/* DATA STRIP: 3-column metrics grid */}
                <div className="bg-slate-50 rounded-xl p-3">
                    <div className="grid grid-cols-3 gap-2">
                        {/* Col 1: Hexágono Nota */}
                        <div className={cn(
                            'flex flex-col items-center justify-center',
                            'transition-opacity',
                            isCommunityActive && 'opacity-60'
                        )}>
                            <HexagonScore score={score} size={44} />
                            <span className="text-xs text-slate-500 mt-1">Nota</span>
                        </div>

                        {/* Col 2: Risco/Escudo */}
                        <div className={cn(
                            'flex flex-col items-center justify-center',
                            'border-x border-slate-200',
                            'transition-opacity',
                            isMatchActive && 'opacity-60'
                        )}>
                            <RiskBadge score={product.scrsScore} />
                            <span className="text-xs text-slate-500 mt-1">Risco</span>
                        </div>

                        {/* Col 3: Match Donut */}
                        <div className={cn(
                            'flex flex-col items-center justify-center',
                            'transition-opacity',
                            isRiskActive && 'opacity-60'
                        )}>
                            {matchScore > 0 ? (
                                <MatchDonut percentage={matchScore} size={40} />
                            ) : (
                                <div className="w-10 h-10 flex items-center justify-center text-slate-300">
                                    —
                                </div>
                            )}
                            <span className="text-xs text-slate-500 mt-1">Match</span>
                        </div>
                    </div>
                </div>

                {/* FINANCEIRO: Preço + TCO Badge - Prominent */}
                <div className="flex items-center justify-between gap-3">
                    {/* Price - Large and prominent */}
                    <div className="flex flex-col">
                        <span className={cn(
                            'text-2xl text-slate-900',
                            isPriceActive ? 'font-bold' : 'font-semibold',
                            isTcoActive && 'opacity-60'
                        )}>
                            {formatBRL(product.price)}
                        </span>
                    </div>

                    {/* TCO Badge - Visible and highlighted */}
                    <span className={cn(
                        'inline-flex items-center px-3 py-1.5 rounded-lg transition-all',
                        isTcoActive ? 'font-bold' : 'font-semibold',
                        isPriceActive && 'opacity-60',
                        tco.priceVsTcoPercent <= 30
                            ? 'bg-emerald-100 text-emerald-800'
                            : tco.priceVsTcoPercent <= 60
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                    )}>
                        TCO: {formatBRL(tco.totalTco)}
                    </span>
                </div>

                {/* CTA Row: Bell + Ver Detalhes */}
                <div className="flex items-center gap-2">
                    {/* Alert Button */}
                    <button
                        onClick={() => setPriceAlertOpen(true)}
                        className={cn(
                            'flex items-center justify-center p-3 rounded-xl',
                            'bg-amber-50 border border-amber-200',
                            'hover:bg-amber-100 active:scale-95 transition-all'
                        )}
                        title="Criar alerta de preço"
                    >
                        <Bell className="w-5 h-5 text-amber-600" />
                    </button>

                    {/* Ver Detalhes Button */}
                    <Link
                        href={`/produto/${productSlug}`}
                        className={cn(
                            'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl',
                            'bg-indigo-600 text-white',
                            'text-sm font-semibold',
                            'hover:bg-indigo-700 active:bg-indigo-800 transition-colors'
                        )}
                    >
                        <Eye className="w-4 h-4" />
                        Ver Detalhes
                    </Link>
                </div>
            </div>

            {/* Price Alert Modal - Rendered for both layouts */}
            <PriceAlertModal
                isOpen={priceAlertOpen}
                onClose={() => setPriceAlertOpen(false)}
                productName={product.name}
                productId={product.id}
                currentPrice={product.price}
            />
        </article>
    );
}

export default ProductRowCard;
