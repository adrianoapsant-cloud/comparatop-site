'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, X, ExternalLink, Trophy, Star, Zap } from 'lucide-react';

// ===========================================================
// TYPES
// ===========================================================

export interface ProductSpec {
    [key: string]: string | number;
}

export interface ComparisonProduct {
    id: string;
    name: string;
    brand: string;
    category: string;
    price: number;
    specs: ProductSpec;
    score: number;
    pros: string[];
    cons: string[];
    imageUrl?: string;
    affiliateUrl?: string;
}

interface DynamicComparisonTableProps {
    products: ComparisonProduct[];
    isLoading?: boolean;
    title?: string;
}

// ===========================================================
// SKELETON COMPONENT
// ===========================================================

function ComparisonSkeleton() {
    return (
        <div className="border border-gray-200 rounded-2xl overflow-hidden animate-pulse">
            {/* Header Skeleton */}
            <div className="bg-gradient-to-r from-purple-200 to-indigo-200 p-4">
                <div className="h-6 bg-purple-300 rounded w-2/3" />
            </div>

            {/* Products Grid Skeleton */}
            <div className="grid grid-cols-2 divide-x divide-gray-200">
                {[1, 2].map((i) => (
                    <div key={i} className="p-4 space-y-4">
                        <div className="flex justify-between">
                            <div className="space-y-2">
                                <div className="h-5 bg-gray-200 rounded w-32" />
                                <div className="h-4 bg-gray-100 rounded w-20" />
                            </div>
                            <div className="h-12 w-12 bg-gray-200 rounded-full" />
                        </div>
                        <div className="h-6 bg-gray-200 rounded w-24" />
                        <div className="space-y-2">
                            {[1, 2, 3, 4].map((j) => (
                                <div key={j} className="flex justify-between">
                                    <div className="h-4 bg-gray-100 rounded w-16" />
                                    <div className="h-4 bg-gray-200 rounded w-24" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ===========================================================
// SPEC COMPARISON HELPER
// ===========================================================

/**
 * Determine which product wins for a specific spec
 * Returns the winning product ID or null if tie/incomparable
 */
function getSpecWinner(
    spec: string,
    products: ComparisonProduct[]
): string | null {
    if (products.length !== 2) return null;

    const [p1, p2] = products;
    const v1 = p1.specs[spec];
    const v2 = p2.specs[spec];

    // If both values are numbers, higher is better (with exceptions)
    if (typeof v1 === 'number' && typeof v2 === 'number') {
        // Price: lower is better
        if (spec.toLowerCase().includes('preço') || spec.toLowerCase() === 'price') {
            return v1 < v2 ? p1.id : v1 > v2 ? p2.id : null;
        }
        // Otherwise: higher is better
        return v1 > v2 ? p1.id : v1 < v2 ? p2.id : null;
    }

    // For string values, we can't determine a winner automatically
    return null;
}

// ===========================================================
// MAIN COMPONENT
// ===========================================================

export function DynamicComparisonTable({
    products,
    isLoading = false,
    title,
}: DynamicComparisonTableProps) {
    const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

    // Show skeleton while loading
    if (isLoading) {
        return <ComparisonSkeleton />;
    }

    // No products found
    if (products.length === 0) {
        return (
            <div className="p-6 border-2 border-dashed border-amber-300 rounded-2xl bg-amber-50 text-center">
                <span className="text-3xl mb-2 block">🔍</span>
                <p className="text-amber-800 font-medium">
                    Produtos não encontrados no nosso catálogo.
                </p>
                <p className="text-amber-600 text-sm mt-1">
                    Tente pesquisar por outros modelos ou marcas.
                </p>
            </div>
        );
    }

    // Determine overall winner
    const winner = products.reduce((a, b) => (a.score > b.score ? a : b));

    // Get all unique specs across products
    const allSpecs = [...new Set(products.flatMap(p => Object.keys(p.specs)))];

    return (
        <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-lg bg-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 p-4 md:p-5">
                <h3 className="text-white font-bold text-lg md:text-xl flex items-center gap-3">
                    <span className="text-2xl">⚖️</span>
                    {title || `Comparativo: ${products.map(p => p.name).join(' vs ')}`}
                </h3>
            </div>

            {/* Products Grid */}
            <div className={`grid grid-cols-1 md:grid-cols-${products.length} divide-y md:divide-y-0 md:divide-x divide-gray-200`}>
                {products.map((product) => {
                    const isWinner = product.id === winner.id;
                    const isHovered = product.id === hoveredProduct;

                    return (
                        <div
                            key={product.id}
                            className={`p-4 md:p-5 transition-all ${isHovered ? 'bg-purple-50/50' : ''}`}
                            onMouseEnter={() => setHoveredProduct(product.id)}
                            onMouseLeave={() => setHoveredProduct(null)}
                        >
                            {/* Product Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                        {product.name}
                                        {isWinner && products.length > 1 && (
                                            <Trophy className="w-5 h-5 text-amber-500" />
                                        )}
                                    </h4>
                                    <p className="text-sm text-gray-500">{product.brand}</p>
                                </div>
                                <div className="text-right">
                                    <div className={`text-2xl md:text-3xl font-black ${isWinner && products.length > 1
                                            ? 'text-purple-600'
                                            : 'text-gray-700'
                                        }`}>
                                        {product.score.toFixed(1)}
                                    </div>
                                    <div className="text-xs text-gray-500 flex items-center justify-end gap-1">
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                        Score
                                    </div>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="mb-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
                                <div className="text-xl md:text-2xl font-bold text-emerald-600">
                                    R$ {product.price.toLocaleString('pt-BR')}
                                </div>
                                <p className="text-xs text-emerald-700">Melhor preço encontrado</p>
                            </div>

                            {/* Specs */}
                            <div className="space-y-2 mb-4">
                                <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                    <Zap className="w-3 h-3" />
                                    Especificações
                                </h5>
                                {allSpecs.map((spec) => {
                                    const value = product.specs[spec];
                                    const specWinner = getSpecWinner(spec, products);
                                    const isSpecWinner = specWinner === product.id;

                                    return (
                                        <div
                                            key={spec}
                                            className={`flex justify-between text-sm py-1 px-2 rounded ${isSpecWinner
                                                    ? 'bg-green-50 border border-green-200'
                                                    : 'bg-gray-50'
                                                }`}
                                        >
                                            <span className="text-gray-600 capitalize flex items-center gap-1">
                                                {isSpecWinner && (
                                                    <Check className="w-3 h-3 text-green-600" />
                                                )}
                                                {spec}:
                                            </span>
                                            <span className={`font-medium ${isSpecWinner ? 'text-green-700' : 'text-gray-900'
                                                }`}>
                                                {value ?? '—'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Pros/Cons */}
                            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                                <div>
                                    <span className="text-green-600 font-semibold flex items-center gap-1 mb-1">
                                        <Check className="w-4 h-4" />
                                        Prós
                                    </span>
                                    <ul className="space-y-0.5 text-gray-600">
                                        {product.pros.slice(0, 3).map((pro, i) => (
                                            <li key={i} className="text-xs">• {pro}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <span className="text-red-600 font-semibold flex items-center gap-1 mb-1">
                                        <X className="w-4 h-4" />
                                        Contras
                                    </span>
                                    <ul className="space-y-0.5 text-gray-600">
                                        {product.cons.slice(0, 3).map((con, i) => (
                                            <li key={i} className="text-xs">• {con}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <Link
                                href={product.affiliateUrl || `/produto/${product.id}`}
                                className={`
                                    w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                                    font-bold text-white transition-all
                                    ${isWinner && products.length > 1
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-200'
                                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                                    }
                                `}
                            >
                                <ExternalLink className="w-4 h-4" />
                                {isWinner && products.length > 1 ? '🏆 Ver Oferta do Vencedor' : 'Ver Oferta'}
                            </Link>
                        </div>
                    );
                })}
            </div>

            {/* Winner Banner */}
            {products.length === 2 && (
                <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 p-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                        <Trophy className="w-6 h-6 text-amber-300" />
                        <span className="text-white font-bold text-lg">
                            Vencedor: {winner.name}
                        </span>
                        <span className="bg-white/20 px-2 py-0.5 rounded text-white text-sm">
                            Score {winner.score.toFixed(1)}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DynamicComparisonTable;
