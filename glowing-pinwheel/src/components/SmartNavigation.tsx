'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Grid3X3 } from 'lucide-react';
import {
    SOLUTIONS_CLUSTERS,
    CATEGORY_TAXONOMY,
    getRecommendedCluster,
    type SolutionCluster
} from '@/config/category-taxonomy';
import { cn } from '@/lib/utils';

// =============================================
// CLUSTER CARD COMPONENT
// =============================================

function ClusterCard({
    cluster,
    isHighlighted
}: {
    cluster: SolutionCluster;
    isHighlighted: boolean;
}) {
    const Icon = cluster.icon;

    // TODO: Re-habilitar Link quando páginas /solucoes/* forem implementadas
    // Por enquanto, usar div para evitar 404
    return (
        <div
            className={cn(
                'group relative overflow-hidden rounded-2xl p-5 text-center transition-all duration-300 cursor-pointer',
                'bg-gradient-to-br', cluster.gradient,
                'hover:scale-105 hover:shadow-xl',
                isHighlighted && 'ring-4 ring-white/50 scale-105 shadow-lg'
            )}
        >
            {/* Badge "Para você" se highlighted */}
            {isHighlighted && (
                <span className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                    ✨ Para você
                </span>
            )}

            <Icon className="w-8 h-8 md:w-10 md:h-10 text-white/90 mx-auto mb-2 md:mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-white text-xs md:text-sm">
                {cluster.name}
            </h3>
            <p className="text-white/70 text-[10px] md:text-xs mt-1 hidden md:block">
                {cluster.tagline}
            </p>
            <span className="absolute bottom-1 right-2 text-white/40 text-[8px]">Em breve</span>
        </div>
    );
}

// =============================================
// DEPARTMENTS MENU (PROGRESSIVE DISCLOSURE)
// =============================================

// Slugs de categorias que estão registradas (SSOT)
// TODO: Importar dinamicamente de categories.ts quando mais categorias forem adicionadas
const REGISTERED_CATEGORY_SLUGS = new Set(['smart-tvs', 'geladeiras', 'ar-condicionados']);

function DepartmentsMenu({ isOpen }: { isOpen: boolean }) {
    if (!isOpen) return null;

    // Filtra departamentos que têm pelo menos uma categoria registrada
    const filteredDepartments = CATEGORY_TAXONOMY.departments
        .map(dept => ({
            ...dept,
            categories: dept.categories.filter(cat => REGISTERED_CATEGORY_SLUGS.has(cat.slug))
        }))
        .filter(dept => dept.categories.length > 0);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-bg-ground rounded-xl mt-2 animate-in slide-in-from-top-2 duration-200">
            {filteredDepartments.map((dept) => {
                const Icon = dept.icon;
                return (
                    <div key={dept.id}>
                        <h4 className="font-semibold text-text-primary flex items-center gap-2 mb-3 text-sm">
                            <Icon size={16} className="text-brand-core" />
                            {dept.name}
                        </h4>
                        <ul className="space-y-1.5">
                            {dept.categories.slice(0, 5).map((cat) => (
                                <li key={cat.id}>
                                    <Link
                                        href={`/categorias/${cat.slug}`}
                                        className="text-xs md:text-sm text-text-secondary hover:text-brand-core transition-colors"
                                    >
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}
            {filteredDepartments.length === 0 && (
                <p className="text-text-muted text-sm col-span-full text-center py-4">
                    Mais categorias em breve...
                </p>
            )}
        </div>
    );
}


// =============================================
// MAIN SMART NAVIGATION COMPONENT
// =============================================

interface SmartNavigationProps {
    userAffinity?: string | null;
    className?: string;
}

export function SmartNavigation({ userAffinity, className }: SmartNavigationProps) {
    const [showDepartments, setShowDepartments] = useState(false);
    const [highlightedCluster, setHighlightedCluster] = useState<string | null>(null);

    // Smart Shelf: Destaca cluster baseado em afinidade do usuário
    useEffect(() => {
        if (userAffinity) {
            const recommended = getRecommendedCluster(userAffinity);
            setHighlightedCluster(recommended);
        }
    }, [userAffinity]);

    // Ordena clusters: highlighted primeiro
    const sortedClusters = [...SOLUTIONS_CLUSTERS].sort((a, b) => {
        if (a.id === highlightedCluster) return -1;
        if (b.id === highlightedCluster) return 1;
        // Depois por prioridade
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    return (
        <nav className={cn('w-full', className)}>
            {/* TRACK 1: Clusters (Sempre visível) */}
            <section className="py-6 md:py-8">
                <h2 className="text-center text-xs md:text-sm font-medium text-text-muted uppercase tracking-wider mb-4 md:mb-6">
                    O que você está montando?
                </h2>

                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 max-w-6xl mx-auto px-4">
                    {sortedClusters.map((cluster) => (
                        <ClusterCard
                            key={cluster.id}
                            cluster={cluster}
                            isHighlighted={highlightedCluster === cluster.id}
                        />
                    ))}
                </div>
            </section>

            {/* TRACK 2: Departamentos (Progressive Disclosure) */}
            <section className="border-t border-gray-200 pt-2">
                <button
                    onClick={() => setShowDepartments(!showDepartments)}
                    className="flex items-center justify-center gap-2 w-full py-3 text-xs md:text-sm text-text-secondary hover:text-brand-core transition-colors"
                >
                    <Grid3X3 size={16} />
                    Explorar por Departamento
                    <ChevronDown
                        size={16}
                        className={cn('transition-transform duration-200', showDepartments && 'rotate-180')}
                    />
                </button>

                <DepartmentsMenu isOpen={showDepartments} />
            </section>
        </nav>
    );
}

// =============================================
// HERO WITH VISUAL PEEKING
// =============================================

interface HeroWithPeekProps {
    userAffinity?: string | null;
}

export function HeroWithPeek({ userAffinity }: HeroWithPeekProps) {
    return (
        <section className="relative">
            {/* Banner Principal - Altura reduzida */}
            <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 pt-12 md:pt-16 pb-28 md:pb-32">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white/80 mb-4">
                        🔬 Auditoria de Sobrevivência 360™
                    </span>

                    <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-3 md:mb-4">
                        Decida em 1 Minuto
                    </h1>
                    <p className="text-base md:text-lg text-white/70 mb-6 md:mb-8 max-w-2xl mx-auto">
                        Análise técnica que você entende. Notas que mudam com o seu contexto.
                    </p>

                    {/* CTA do Quiz */}
                    <Link
                        href="/assistente"
                        className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-brand-core text-white rounded-xl font-semibold hover:bg-brand-core/90 transition-all hover:scale-105 shadow-lg"
                    >
                        <span>🤖</span>
                        Começar Auditoria
                    </Link>
                </div>

                {/* Indicador de Scroll */}
                <div className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 animate-bounce">
                    <ChevronDown className="w-6 h-6 md:w-8 md:h-8 text-white/50" />
                </div>
            </div>

            {/* VISUAL PEEKING: Grid que "corta" o banner */}
            <div className="relative -mt-14 md:-mt-16 z-10">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Fundo branco com sombra que "sobrepõe" */}
                    <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-8">
                        <SmartNavigation userAffinity={userAffinity} />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SmartNavigation;
