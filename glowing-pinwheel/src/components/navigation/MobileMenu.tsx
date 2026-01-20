'use client';

import React, { memo, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Home, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
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

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

type NavigationLevel = 'root' | 'department' | 'solutions';

interface NavigationState {
    level: NavigationLevel;
    departmentId?: string;
}

// =============================================
// ANIMATION VARIANTS
// =============================================

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction < 0 ? '100%' : '-100%',
        opacity: 0,
    }),
};

const slideTransition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.25,
} as const;

// =============================================
// SUB-COMPONENTS
// =============================================

/**
 * Header do menu com botão voltar
 */
const MenuHeader = memo(function MenuHeader({
    title,
    showBack,
    onBack,
    onClose,
}: {
    title: string;
    showBack: boolean;
    onBack: () => void;
    onClose: () => void;
}) {
    return (
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-2">
                {showBack && (
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors"
                        aria-label="Voltar"
                    >
                        <ChevronLeft className="w-5 h-5 text-slate-600" />
                    </button>
                )}
                <h2 className="font-semibold text-slate-900">{title}</h2>
            </div>
            <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Fechar menu"
            >
                <X className="w-5 h-5 text-slate-400" />
            </button>
        </div>
    );
});

/**
 * Item do menu com seta para drill-down
 */
const MenuItem = memo(function MenuItem({
    label,
    icon: Icon,
    onClick,
    href,
    hasChildren,
    priority,
}: {
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    onClick?: () => void;
    href?: string;
    hasChildren?: boolean;
    priority?: 'high' | 'medium' | 'low';
}) {
    const content = (
        <>
            {Icon && <Icon className="w-5 h-5 text-slate-400 flex-shrink-0" />}
            <span className={cn(
                "flex-1 text-slate-700",
                priority === 'high' && "font-medium"
            )}>
                {label}
            </span>
            {hasChildren && (
                <ChevronRight className="w-5 h-5 text-slate-300" />
            )}
        </>
    );

    const className = cn(
        "flex items-center gap-3 w-full px-4 py-3.5",
        "hover:bg-slate-50 active:bg-slate-100",
        "transition-colors border-b border-slate-100 last:border-0"
    );

    if (href) {
        return (
            <Link href={href} className={className} onClick={onClick}>
                {content}
            </Link>
        );
    }

    return (
        <button className={className} onClick={onClick}>
            {content}
        </button>
    );
});

/**
 * Card de Solução mobile
 */
const SolutionCardMobile = memo(function SolutionCardMobile({
    cluster,
    onClick,
}: {
    cluster: SolutionCluster;
    onClick?: () => void;
}) {
    const Icon = cluster.icon;

    return (
        <Link
            href={`/solucoes/${cluster.id}`}
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 p-4 rounded-xl",
                "bg-gradient-to-r", cluster.gradient,
                "active:scale-[0.98] transition-transform"
            )}
        >
            <div className="p-2 bg-white/20 rounded-lg">
                <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
                <p className="font-semibold text-white text-sm">{cluster.name}</p>
                <p className="text-white/80 text-xs">{cluster.tagline}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-white/60" />
        </Link>
    );
});

// =============================================
// LEVEL VIEWS
// =============================================

/**
 * Nível raiz: Departamentos + Soluções
 */
const RootLevel = memo(function RootLevel({
    onNavigate,
    onClose,
}: {
    onNavigate: (state: NavigationState) => void;
    onClose: () => void;
}) {
    return (
        <div className="divide-y divide-slate-100">
            {/* Departamentos */}
            <div className="py-2">
                <p className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Departamentos
                </p>
                {CATEGORY_TAXONOMY.departments.map(dept => {
                    const Icon = dept.icon;
                    return (
                        <MenuItem
                            key={dept.id}
                            label={dept.name}
                            icon={Icon}
                            hasChildren
                            priority={dept.priority}
                            onClick={() => onNavigate({
                                level: 'department',
                                departmentId: dept.id,
                            })}
                        />
                    );
                })}
            </div>

            {/* Soluções */}
            <div className="py-4 px-4">
                <p className="mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Soluções
                </p>
                <div className="space-y-2">
                    {SOLUTIONS_CLUSTERS.filter(c => c.priority === 'high').map(cluster => (
                        <SolutionCardMobile
                            key={cluster.id}
                            cluster={cluster}
                            onClick={onClose}
                        />
                    ))}
                </div>
            </div>

            {/* Links Úteis */}
            <div className="py-2">
                <MenuItem
                    label="Todas as categorias"
                    icon={Home}
                    href="/categorias"
                    onClick={onClose}
                />
                <MenuItem
                    label="Metodologia"
                    icon={Sparkles}
                    href="/metodologia"
                    onClick={onClose}
                />
            </div>
        </div>
    );
});

/**
 * Nível de departamento: Categorias
 */
const DepartmentLevel = memo(function DepartmentLevel({
    department,
    onClose,
}: {
    department: Department;
    onClose: () => void;
}) {
    return (
        <div className="py-2">
            {department.categories.map(cat => (
                <MenuItem
                    key={cat.id}
                    label={cat.name}
                    href={`/categorias/${cat.slug}`}
                    priority={cat.priority}
                    onClick={onClose}
                />
            ))}
        </div>
    );
});

// =============================================
// MAIN COMPONENT
// =============================================

/**
 * MobileMenu - Navegação Drill-Down (Slide-Over)
 * 
 * Usa uma pilha de estados para navegar entre níveis.
 * Animação de slide para transições suaves.
 */
export const MobileMenu = memo(function MobileMenu({
    isOpen,
    onClose,
}: MobileMenuProps) {
    const [navStack, setNavStack] = useState<NavigationState[]>([{ level: 'root' }]);
    const [direction, setDirection] = useState(0);

    const currentState = navStack[navStack.length - 1];

    // Reset ao fechar
    useEffect(() => {
        if (!isOpen) {
            setNavStack([{ level: 'root' }]);
            setDirection(0);
        }
    }, [isOpen]);

    // Prevent body scroll quando aberto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const navigateTo = useCallback((state: NavigationState) => {
        setDirection(1); // Forward
        setNavStack(prev => [...prev, state]);
    }, []);

    const navigateBack = useCallback(() => {
        if (navStack.length > 1) {
            setDirection(-1); // Backward
            setNavStack(prev => prev.slice(0, -1));
        }
    }, [navStack.length]);

    const getTitle = useCallback((): string => {
        switch (currentState.level) {
            case 'root':
                return 'Menu';
            case 'department':
                const dept = CATEGORY_TAXONOMY.departments.find(d => d.id === currentState.departmentId);
                return dept?.name || 'Categorias';
            case 'solutions':
                return 'Soluções';
            default:
                return 'Menu';
        }
    }, [currentState]);

    const activeDepartment = currentState.departmentId
        ? CATEGORY_TAXONOMY.departments.find(d => d.id === currentState.departmentId)
        : null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={onClose}
                    />

                    {/* Menu Panel */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
                        className="fixed left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white z-50 flex flex-col shadow-2xl"
                    >
                        <MenuHeader
                            title={getTitle()}
                            showBack={navStack.length > 1}
                            onBack={navigateBack}
                            onClose={onClose}
                        />

                        {/* Content with slide animation */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
                            <AnimatePresence initial={false} custom={direction} mode="wait">
                                <motion.div
                                    key={JSON.stringify(currentState)}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={slideTransition}
                                    className="absolute inset-0 overflow-y-auto"
                                >
                                    {currentState.level === 'root' && (
                                        <RootLevel
                                            onNavigate={navigateTo}
                                            onClose={onClose}
                                        />
                                    )}

                                    {currentState.level === 'department' && activeDepartment && (
                                        <DepartmentLevel
                                            department={activeDepartment}
                                            onClose={onClose}
                                        />
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
});

export default MobileMenu;
