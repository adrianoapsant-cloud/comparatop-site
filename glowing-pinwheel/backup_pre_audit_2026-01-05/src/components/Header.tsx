'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
    Search, Menu, X, ChevronDown, ChevronRight,
    Tv, Refrigerator, Wind, Laptop,
    Gamepad2, Palette, Leaf, Ruler, Shield,
    Home, Grid3X3, Scale, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useComparison } from '@/contexts/ComparisonContext';

// ============================================
// CATEGORY DATA
// ============================================

const CATEGORIES = [
    { id: 'tv', name: 'Smart TVs', icon: Tv, slug: '/categorias/smart-tvs', count: 3 },
    { id: 'fridge', name: 'Geladeiras', icon: Refrigerator, slug: '/categorias/geladeiras', count: 5 },
    { id: 'air_conditioner', name: 'Ar Condicionado', icon: Wind, slug: '/categorias/ar-condicionados', count: 6 },
    { id: 'notebook', name: 'Notebooks', icon: Laptop, slug: '/categorias/notebooks', count: 0 },
];

// Jobs to be Done - Solutions mapping
const SOLUTIONS = [
    { id: 'gaming', name: 'Para Gamers', icon: Gamepad2, filter: 'gaming', description: 'TVs 120Hz, low input lag' },
    { id: 'design', name: 'Para Arquitetos', icon: Palette, filter: 'design', description: 'Monitores 4K, notebooks potentes' },
    { id: 'economy', name: 'Economia de Energia', icon: Leaf, filter: 'energia', description: 'Selo A++, Inverter, economizadores' },
    { id: 'small', name: 'Ambientes Pequenos', icon: Ruler, filter: 'compacto', description: '9000 BTUs, geladeiras compactas' },
    { id: 'durability', name: 'Durabilidade Extrema', icon: Shield, filter: 'durabilidade', description: 'Garantia estendida, marcas premium' },
];

// Common problems for search suggestions
const COMMON_PROBLEMS = [
    'Conta de luz muito alta',
    'Barulho do ar condicionado',
    'TV travando em apps',
    'Geladeira não gela bem',
    'Notebook esquentando muito',
];

const BUYING_GUIDES = [
    'Como escolher TV para PS5',
    'Inverter vs Convencional',
    'Geladeira Frost Free vale a pena?',
    'Melhor notebook para trabalho',
];

// ============================================
// MEGA MENU COMPONENT
// ============================================

function MegaMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    if (!isOpen) return null;

    return (
        <div
            className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50"
            onMouseLeave={onClose}
        >
            <div className="max-w-7xl mx-auto p-8">
                <div className="grid grid-cols-2 gap-12">
                    {/* Pilar A: Categorias */}
                    <div>
                        <h3 className="font-display text-xs font-bold text-text-muted uppercase tracking-wider mb-4">
                            Navegar por Categoria
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {CATEGORIES.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={cat.slug}
                                    className={cn(
                                        'flex items-center gap-3 p-3 rounded-lg',
                                        'bg-bg-ground hover:bg-brand-core/5',
                                        'border border-transparent hover:border-brand-core/20',
                                        'transition-all group'
                                    )}
                                    onClick={onClose}
                                >
                                    <div className="w-10 h-10 rounded-lg bg-brand-core/10 flex items-center justify-center group-hover:bg-brand-core/20 transition-colors">
                                        <cat.icon size={20} className="text-brand-core" />
                                    </div>
                                    <div>
                                        <p className="font-body font-semibold text-text-primary">
                                            {cat.name}
                                        </p>
                                        {cat.count > 0 && (
                                            <p className="text-xs text-text-muted">
                                                {cat.count} produtos
                                            </p>
                                        )}
                                    </div>
                                    <ChevronRight size={16} className="ml-auto text-text-muted group-hover:text-brand-core transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Pilar B: Soluções */}
                    <div>
                        <h3 className="font-display text-xs font-bold text-text-muted uppercase tracking-wider mb-4">
                            Soluções e Usos
                        </h3>
                        <div className="space-y-2">
                            {SOLUTIONS.map((sol) => (
                                <Link
                                    key={sol.id}
                                    href={`/solucoes/${sol.id}`}
                                    className={cn(
                                        'flex items-center gap-3 p-3 rounded-lg',
                                        'hover:bg-gradient-to-r hover:from-amber-50 hover:to-transparent',
                                        'transition-all group'
                                    )}
                                    onClick={onClose}
                                >
                                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                                        <sol.icon size={16} className="text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="font-body font-medium text-text-primary">
                                            {sol.name}
                                        </p>
                                        <p className="text-xs text-text-muted">
                                            {sol.description}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// SEARCH BAR COMPONENT WITH PRODUCT SEARCH
// ============================================

import { ALL_PRODUCTS } from '@/data/products';
import { useRouter } from 'next/navigation';

function SearchBar() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Search products by name, category, painPoints
    const searchResults = query.length >= 2
        ? ALL_PRODUCTS.filter(product => {
            const searchLower = query.toLowerCase();
            const nameMatch = product.name.toLowerCase().includes(searchLower);
            const shortNameMatch = product.shortName?.toLowerCase().includes(searchLower);
            const categoryMatch = product.categoryId.toLowerCase().includes(searchLower);
            const painPointMatch = product.painPointsSolved?.some(p =>
                p.toLowerCase().includes(searchLower)
            );
            const brandMatch = product.brand?.toLowerCase().includes(searchLower);
            return nameMatch || shortNameMatch || categoryMatch || painPointMatch || brandMatch;
        }).slice(0, 5)
        : [];

    const handleProductClick = (productId: string) => {
        setQuery('');
        setIsOpen(false);
        router.push(`/produto/${productId}`);
    };

    return (
        <div className="relative flex-1 max-w-xl">
            <div
                className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-full',
                    'bg-bg-ground border-2',
                    isOpen ? 'border-brand-core' : 'border-transparent',
                    'transition-all'
                )}
            >
                <Search size={18} className="text-text-muted flex-shrink-0" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                    placeholder="Cole um link ou descreva seu problema (ex: 'notebook que não esquenta')..."
                    className="flex-1 bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted font-body min-w-[300px]"
                />
            </div>

            {/* Rich Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50 max-h-[400px] overflow-y-auto">
                    {/* Product Search Results */}
                    {searchResults.length > 0 && (
                        <div className="mb-4">
                            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                                📦 Produtos
                            </h4>
                            <div className="space-y-1">
                                {searchResults.map(product => (
                                    <Link
                                        key={product.id}
                                        href={`/produto/${product.id}`}
                                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-bg-ground transition-colors text-left"
                                        onClick={() => {
                                            setQuery('');
                                            setIsOpen(false);
                                        }}
                                    >
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                            {product.imageUrl ? (
                                                <img
                                                    src={product.imageUrl}
                                                    alt=""
                                                    className="w-full h-full object-contain p-1"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                                    {product.shortName?.substring(0, 2)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-text-primary truncate">
                                                {product.name}
                                            </p>
                                            <p className="text-xs text-text-muted">
                                                R$ {product.price.toLocaleString('pt-BR')}
                                            </p>
                                        </div>
                                        <ChevronRight size={16} className="text-text-muted" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No results message */}
                    {query.length >= 2 && searchResults.length === 0 && (
                        <div className="text-center py-4 text-text-muted text-sm">
                            Nenhum produto encontrado para "{query}"
                        </div>
                    )}

                    {/* Problemas Comuns */}
                    {query.length < 2 && (
                        <>
                            <div className="mb-4">
                                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Sparkles size={12} />
                                    Problemas Comuns
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {COMMON_PROBLEMS.map((problem, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setQuery(problem);
                                                inputRef.current?.focus();
                                            }}
                                            className="px-3 py-1.5 bg-red-50 text-red-700 text-xs rounded-full hover:bg-red-100 transition-colors"
                                        >
                                            {problem}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Guias de Compra */}
                            <div>
                                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                                    📚 Guias de Compra
                                </h4>
                                <div className="space-y-1">
                                    {BUYING_GUIDES.map((guide, idx) => (
                                        <Link
                                            key={idx}
                                            href={`/guias/${guide.toLowerCase().replace(/ /g, '-')}`}
                                            className="block px-3 py-2 text-sm text-text-secondary hover:bg-bg-ground rounded-lg transition-colors"
                                        >
                                            {guide}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

// ============================================
// MAIN HEADER COMPONENT
// ============================================

export function Header() {
    const [megaMenuOpen, setMegaMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between h-16 gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <span className="font-display text-2xl font-bold text-brand-core">
                            ComparaTop
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        {/* Mega Menu Trigger */}
                        <button
                            onMouseEnter={() => setMegaMenuOpen(true)}
                            className={cn(
                                'flex items-center gap-1 px-3 py-2 rounded-lg',
                                'text-sm font-body font-medium text-text-secondary',
                                'hover:bg-bg-ground hover:text-text-primary',
                                'transition-colors',
                                megaMenuOpen && 'bg-bg-ground text-text-primary'
                            )}
                        >
                            <Grid3X3 size={16} />
                            Categorias
                            <ChevronDown size={14} className={cn('transition-transform', megaMenuOpen && 'rotate-180')} />
                        </button>

                        {/* Quick Links */}
                        <Link href="/comparar" className="text-sm font-body font-medium text-text-secondary hover:text-brand-core transition-colors">
                            Comparador
                        </Link>
                        <Link href="/guias" className="text-sm font-body font-medium text-text-secondary hover:text-brand-core transition-colors">
                            Guias
                        </Link>
                    </nav>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:block">
                        <SearchBar />
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2 rounded-lg hover:bg-bg-ground transition-colors">
                        <Menu size={24} className="text-text-primary" />
                    </button>
                </div>
            </div>

            {/* Mega Menu */}
            <MegaMenu isOpen={megaMenuOpen} onClose={() => setMegaMenuOpen(false)} />
        </header>
    );
}

// ============================================
// MOBILE BOTTOM NAVIGATION
// ============================================

export function MobileBottomNav() {
    const { selectedProducts } = useComparison();
    const [searchOpen, setSearchOpen] = useState(false);
    const [categoriesOpen, setCategoriesOpen] = useState(false);

    return (
        <>
            {/* Bottom Navigation Bar */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 shadow-lg">
                <div className="grid grid-cols-4 h-16">
                    {/* Home */}
                    <Link
                        href="/"
                        className="flex flex-col items-center justify-center gap-0.5 text-text-muted hover:text-brand-core transition-colors"
                    >
                        <Home size={22} />
                        <span className="text-[10px] font-medium">Home</span>
                    </Link>

                    {/* Search */}
                    <button
                        onClick={() => setSearchOpen(true)}
                        className="flex flex-col items-center justify-center gap-0.5 text-text-muted hover:text-brand-core transition-colors"
                    >
                        <Search size={22} />
                        <span className="text-[10px] font-medium">Busca</span>
                    </button>

                    {/* Categories */}
                    <button
                        onClick={() => setCategoriesOpen(true)}
                        className="flex flex-col items-center justify-center gap-0.5 text-text-muted hover:text-brand-core transition-colors"
                    >
                        <Grid3X3 size={22} />
                        <span className="text-[10px] font-medium">Categorias</span>
                    </button>

                    {/* Comparator */}
                    <Link
                        href="/comparar"
                        className="relative flex flex-col items-center justify-center gap-0.5 text-text-muted hover:text-brand-core transition-colors"
                    >
                        <Scale size={22} />
                        <span className="text-[10px] font-medium">Comparar</span>
                        {selectedProducts.length > 0 && (
                            <span className="absolute top-1 right-4 w-5 h-5 bg-brand-core text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                {selectedProducts.length}
                            </span>
                        )}
                    </Link>
                </div>
            </nav>

            {/* Search Overlay */}
            {searchOpen && (
                <div className="fixed inset-0 z-[60] bg-white md:hidden">
                    <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                        <button onClick={() => setSearchOpen(false)}>
                            <X size={24} className="text-text-primary" />
                        </button>
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Cole um link ou descreva seu problema..."
                                autoFocus
                                className="w-full px-4 py-3 bg-bg-ground rounded-full text-sm outline-none border-2 border-transparent focus:border-brand-core transition-colors"
                            />
                        </div>
                    </div>
                    <div className="p-4">
                        <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
                            Problemas Comuns
                        </h4>
                        <div className="space-y-2">
                            {COMMON_PROBLEMS.map((problem, idx) => (
                                <button
                                    key={idx}
                                    className="block w-full text-left px-4 py-3 bg-red-50 text-red-700 text-sm rounded-lg"
                                >
                                    {problem}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Categories Overlay */}
            {categoriesOpen && (
                <div className="fixed inset-0 z-[60] bg-white md:hidden overflow-y-auto">
                    <div className="flex items-center gap-3 p-4 border-b border-gray-200 sticky top-0 bg-white">
                        <button onClick={() => setCategoriesOpen(false)}>
                            <X size={24} className="text-text-primary" />
                        </button>
                        <h2 className="font-display text-lg font-semibold text-text-primary">
                            Categorias
                        </h2>
                    </div>

                    {/* Categories Accordion */}
                    <div className="p-4 space-y-2">
                        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
                            Por Produto
                        </h3>
                        {CATEGORIES.map((cat) => (
                            <Link
                                key={cat.id}
                                href={cat.slug}
                                onClick={() => setCategoriesOpen(false)}
                                className="flex items-center gap-3 p-4 bg-bg-ground rounded-xl"
                            >
                                <div className="w-10 h-10 rounded-lg bg-brand-core/10 flex items-center justify-center">
                                    <cat.icon size={20} className="text-brand-core" />
                                </div>
                                <span className="font-body font-medium text-text-primary">
                                    {cat.name}
                                </span>
                                <ChevronRight size={18} className="ml-auto text-text-muted" />
                            </Link>
                        ))}
                    </div>

                    <div className="p-4 space-y-2">
                        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
                            Por Necessidade
                        </h3>
                        {SOLUTIONS.map((sol) => (
                            <Link
                                key={sol.id}
                                href={`/solucoes/${sol.id}`}
                                onClick={() => setCategoriesOpen(false)}
                                className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl"
                            >
                                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                    <sol.icon size={18} className="text-amber-600" />
                                </div>
                                <div>
                                    <span className="font-body font-medium text-text-primary block">
                                        {sol.name}
                                    </span>
                                    <span className="text-xs text-text-muted">
                                        {sol.description}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Spacer for bottom nav */}
                    <div className="h-20" />
                </div>
            )}

            {/* Spacer to prevent content from being hidden behind bottom nav */}
            <div className="h-16 md:hidden" />
        </>
    );
}
