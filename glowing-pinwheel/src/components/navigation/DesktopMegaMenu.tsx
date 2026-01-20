'use client';

import React, { memo, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHoverIntent } from './useHoverIntent';
import {
    CATEGORY_TAXONOMY,
    SOLUTIONS_CLUSTERS,
    type Department,
    type CategoryItem,
    type SolutionCluster,
} from '@/config/category-taxonomy';

// =============================================
// TYPES
// =============================================

interface DesktopMegaMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SolutionCardProps {
    cluster: SolutionCluster;
    onClick?: () => void;
}

// =============================================
// SUB-COMPONENTS
// =============================================

/**
 * Card visual para Soluções na Zona C
 */
const SolutionCard = memo(function SolutionCard({ cluster, onClick }: SolutionCardProps) {
    const Icon = cluster.icon;

    return (
        <Link
            href={`/solucoes/${cluster.id}`}
            onClick={onClick}
            className={cn(
                "group relative block p-4 rounded-xl overflow-hidden",
                "bg-gradient-to-br", cluster.gradient,
                "hover:scale-[1.02] transition-transform duration-200",
                "shadow-md hover:shadow-lg"
            )}
        >
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-bold text-sm">{cluster.name}</span>
                </div>
                <p className="text-white/90 text-xs leading-relaxed">
                    {cluster.tagline}
                </p>
                <div className="mt-3 flex items-center gap-1 text-white/80 text-xs">
                    <span>Explorar</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
        </Link>
    );
});

/**
 * Item da lista de departamentos (Zona A)
 */
const DepartmentItem = memo(function DepartmentItem({
    department,
    isActive,
    isPending,
    onHover,
}: {
    department: Department;
    isActive: boolean;
    isPending: boolean;
    onHover: () => void;
}) {
    const Icon = department.icon;

    return (
        <button
            onMouseEnter={onHover}
            className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-150",
                isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : isPending
                        ? "bg-slate-100 text-slate-700"
                        : "text-slate-600 hover:bg-slate-50"
            )}
        >
            <Icon className={cn(
                "w-5 h-5 flex-shrink-0",
                isActive ? "text-primary" : "text-slate-400"
            )} />
            <span className="text-sm">{department.name}</span>
            <ChevronRight className={cn(
                "w-4 h-4 ml-auto transition-transform",
                isActive && "translate-x-1"
            )} />
        </button>
    );
});

/**
 * Item de categoria (Zona B)
 */
const CategoryLink = memo(function CategoryLink({
    category,
    onClick,
}: {
    category: CategoryItem;
    onClick?: () => void;
}) {
    return (
        <Link
            href={`/categorias/${category.slug}`}
            onClick={onClick}
            className={cn(
                "block px-3 py-2 rounded-lg text-sm",
                "text-slate-600 hover:text-slate-900",
                "hover:bg-primary/5 transition-colors",
                category.priority === 'high' && "font-medium"
            )}
        >
            {category.name}
        </Link>
    );
});

// =============================================
// MAIN COMPONENT
// =============================================

/**
 * DesktopMegaMenu - Menu Full-Width com 3 Zonas
 * 
 * Zona A (20%): Lista de Departamentos com hover intent
 * Zona B (50%): Grid de categorias do departamento selecionado
 * Zona C (30%): Cards de Soluções/Lifestyle
 */
export const DesktopMegaMenu = memo(function DesktopMegaMenu({
    isOpen,
    onClose,
}: DesktopMegaMenuProps) {
    const {
        activeItem: activeDeptId,
        pendingItem,
        handleMouseEnter,
        handleMenuLeave,
        setActive,
    } = useHoverIntent<string>(150);

    // Inicializa com o primeiro departamento
    useEffect(() => {
        if (isOpen && !activeDeptId) {
            const firstDept = CATEGORY_TAXONOMY.departments[0];
            if (firstDept) setActive(firstDept.id);
        }
    }, [isOpen, activeDeptId, setActive]);

    // Reset ao fechar
    useEffect(() => {
        if (!isOpen) {
            handleMenuLeave();
        }
    }, [isOpen, handleMenuLeave]);

    const activeDepartment = CATEGORY_TAXONOMY.departments.find(d => d.id === activeDeptId);

    // Mapeia departamentos para clusters relevantes
    const getRelevantClusters = useCallback((deptId: string): SolutionCluster[] => {
        const deptCategoryIds = CATEGORY_TAXONOMY.departments
            .find(d => d.id === deptId)
            ?.categories.map(c => c.id) || [];

        return SOLUTIONS_CLUSTERS.filter(cluster =>
            cluster.categories.some(catId => deptCategoryIds.includes(catId))
        ).slice(0, 2); // Max 2 cards
    }, []);

    const relevantClusters = activeDeptId ? getRelevantClusters(activeDeptId) : [];

    // Handle ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 bg-black/20 z-40"
                        onClick={onClose}
                    />

                    {/* Menu Container */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className={cn(
                            "fixed left-0 right-0 top-16 z-50",
                            "mx-4 lg:mx-8 xl:mx-auto xl:max-w-7xl",
                            "bg-white rounded-xl shadow-2xl",
                            "border border-slate-200/60"
                        )}
                        onMouseLeave={handleMenuLeave}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 p-2 rounded-lg hover:bg-slate-100 transition-colors z-10"
                            aria-label="Fechar menu"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>

                        <div className="grid grid-cols-12 min-h-[400px]">
                            {/* ZONA A: Departamentos (20%) */}
                            <div className="col-span-3 bg-slate-50/50 p-4 rounded-l-xl border-r border-slate-100">
                                <h3 className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Departamentos
                                </h3>
                                <nav className="space-y-1">
                                    {CATEGORY_TAXONOMY.departments.map(dept => (
                                        <DepartmentItem
                                            key={dept.id}
                                            department={dept}
                                            isActive={activeDeptId === dept.id}
                                            isPending={pendingItem === dept.id}
                                            onHover={() => handleMouseEnter(dept.id)}
                                        />
                                    ))}
                                </nav>
                            </div>

                            {/* ZONA B: Categorias (50%) */}
                            <div className="col-span-5 p-6">
                                <AnimatePresence mode="wait">
                                    {activeDepartment && (
                                        <motion.div
                                            key={activeDepartment.id}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                                                <activeDepartment.icon className="w-5 h-5 text-primary" />
                                                {activeDepartment.name}
                                            </h3>

                                            <div className="grid grid-cols-2 gap-1">
                                                {activeDepartment.categories.map(cat => (
                                                    <CategoryLink
                                                        key={cat.id}
                                                        category={cat}
                                                        onClick={onClose}
                                                    />
                                                ))}
                                            </div>

                                            {/* Ver todas as categorias */}
                                            <div className="mt-4 pt-4 border-t border-slate-100">
                                                <Link
                                                    href="/categorias"
                                                    onClick={onClose}
                                                    className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium"
                                                >
                                                    Ver todas as categorias
                                                    <ChevronRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* ZONA C: Soluções & Lifestyle (30%) */}
                            <div className="col-span-4 bg-slate-50/80 p-6 rounded-r-xl">
                                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                                    Soluções Relacionadas
                                </h3>

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeDeptId || 'default'}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                        className="space-y-3"
                                    >
                                        {relevantClusters.length > 0 ? (
                                            relevantClusters.map(cluster => (
                                                <SolutionCard
                                                    key={cluster.id}
                                                    cluster={cluster}
                                                    onClick={onClose}
                                                />
                                            ))
                                        ) : (
                                            // Fallback: mostrar clusters de alta prioridade
                                            SOLUTIONS_CLUSTERS
                                                .filter(c => c.priority === 'high')
                                                .slice(0, 2)
                                                .map(cluster => (
                                                    <SolutionCard
                                                        key={cluster.id}
                                                        cluster={cluster}
                                                        onClick={onClose}
                                                    />
                                                ))
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                {/* Quick Links */}
                                <div className="mt-4 pt-4 border-t border-slate-200/60">
                                    <Link
                                        href="/metodologia"
                                        onClick={onClose}
                                        className="block text-xs text-slate-500 hover:text-primary transition-colors"
                                    >
                                        🧪 Como avaliamos produtos
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
});

export default DesktopMegaMenu;
