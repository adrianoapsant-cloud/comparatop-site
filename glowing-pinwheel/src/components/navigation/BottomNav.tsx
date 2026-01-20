'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid3X3, Search, ArrowLeftRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// =============================================
// TYPES
// =============================================

interface BottomNavProps {
    onCategoriesClick: () => void;
    onSearchClick?: () => void;
}

interface NavItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    href?: string;
    action?: 'categories' | 'search';
    activePattern?: RegExp;
}

// =============================================
// CONSTANTS
// =============================================

const NAV_ITEMS: NavItem[] = [
    {
        id: 'home',
        label: 'Início',
        icon: Home,
        href: '/',
        activePattern: /^\/$/,
    },
    {
        id: 'categories',
        label: 'Categorias',
        icon: Grid3X3,
        action: 'categories',
        activePattern: /^\/categorias/,
    },
    {
        id: 'search',
        label: 'Busca',
        icon: Search,
        action: 'search',
    },
    {
        id: 'compare',
        label: 'Comparar',
        icon: ArrowLeftRight,
        href: '/comparar',
        activePattern: /^\/comparar|^\/vs\//,
    },
];

// =============================================
// SUB-COMPONENTS
// =============================================

const NavButton = memo(function NavButton({
    item,
    isActive,
    onClick,
}: {
    item: NavItem;
    isActive: boolean;
    onClick?: () => void;
}) {
    const Icon = item.icon;

    const content = (
        <div className={cn(
            "flex flex-col items-center justify-center gap-1 py-2 px-3",
            "min-w-[60px] transition-colors duration-150",
            isActive
                ? "text-primary"
                : "text-slate-400 active:text-slate-600"
        )}>
            <Icon className={cn(
                "w-5 h-5 transition-transform",
                isActive && "scale-110"
            )} />
            <span className={cn(
                "text-[10px] font-medium",
                isActive && "font-semibold"
            )}>
                {item.label}
            </span>
            {/* Active indicator */}
            {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
            )}
        </div>
    );

    if (item.href) {
        return (
            <Link
                href={item.href}
                className="relative flex-1 flex items-center justify-center"
            >
                {content}
            </Link>
        );
    }

    return (
        <button
            onClick={onClick}
            className="relative flex-1 flex items-center justify-center"
        >
            {content}
        </button>
    );
});

// =============================================
// MAIN COMPONENT
// =============================================

/**
 * BottomNav - Barra de navegação fixa no rodapé mobile.
 * 
 * Posicionada na "thumb zone" para fácil acesso.
 * Itens: Home, Categorias (abre menu), Busca, Comparar.
 */
export const BottomNav = memo(function BottomNav({
    onCategoriesClick,
    onSearchClick,
}: BottomNavProps) {
    const pathname = usePathname();

    const isActive = (item: NavItem): boolean => {
        if (item.activePattern) {
            return item.activePattern.test(pathname);
        }
        return false;
    };

    const handleClick = (item: NavItem) => {
        switch (item.action) {
            case 'categories':
                onCategoriesClick();
                break;
            case 'search':
                onSearchClick?.();
                break;
        }
    };

    return (
        <nav className={cn(
            "fixed bottom-0 left-0 right-0 z-40",
            "bg-white/95 backdrop-blur-lg",
            "border-t border-slate-200/60",
            "safe-area-inset-bottom", // For iPhone notch
            "md:hidden" // Hide on desktop
        )}>
            <div className="flex items-stretch justify-around h-16">
                {NAV_ITEMS.map(item => (
                    <NavButton
                        key={item.id}
                        item={item}
                        isActive={isActive(item)}
                        onClick={item.action ? () => handleClick(item) : undefined}
                    />
                ))}
            </div>
        </nav>
    );
});

export default BottomNav;
