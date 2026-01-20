'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Plus } from 'lucide-react';

// ===========================================================
// TYPES
// ===========================================================

interface DiscoveryProduct {
    id: string;
    name: string;
    reasonForRecommendation: string;
    imageUrl: string;
    price?: number;
    score?: number;
    category?: string;
}

interface DiscoveryCarouselProps {
    queryContext: string;
    products: DiscoveryProduct[];
    onViewDetails?: (productId: string) => void;
    onAddToCompare?: (product: DiscoveryProduct) => void;
}

// ===========================================================
// DISCOVERY CAROUSEL COMPONENT
// ===========================================================

export function DiscoveryCarousel({
    queryContext,
    products,
    onViewDetails,
    onAddToCompare,
}: DiscoveryCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [compareList, setCompareList] = useState<string[]>([]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % products.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    };

    const handleAddToCompare = (product: DiscoveryProduct) => {
        if (!compareList.includes(product.id)) {
            setCompareList([...compareList, product.id]);
            onAddToCompare?.(product);
        }
    };

    const isInCompareList = (id: string) => compareList.includes(id);

    if (products.length === 0) {
        return (
            <div className="p-6 bg-gray-50 rounded-xl text-center text-gray-500">
                Nenhum produto encontrado para essa busca.
            </div>
        );
    }

    return (
        <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-lg">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">✨</span>
                    <div>
                        <h3 className="text-white font-bold text-lg">
                            Inspirações para você
                        </h3>
                        <p className="text-white/80 text-sm">
                            Baseado em: &quot;{queryContext}&quot;
                        </p>
                    </div>
                </div>
            </div>

            {/* Carousel Container */}
            <div className="relative">
                {/* Navigation Arrows */}
                {products.length > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                            aria-label="Anterior"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                            aria-label="Próximo"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-700" />
                        </button>
                    </>
                )}

                {/* Cards Container */}
                <div className="overflow-hidden">
                    <div
                        className="flex transition-transform duration-300 ease-in-out"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="w-full flex-shrink-0 p-6"
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Image */}
                                    <div className="md:w-1/2">
                                        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
                                            {product.imageUrl ? (
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain p-4"
                                                />
                                            ) : (
                                                <div className="text-6xl text-gray-300">📺</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="md:w-1/2 flex flex-col justify-center">
                                        {product.category && (
                                            <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide mb-2">
                                                {product.category}
                                            </span>
                                        )}

                                        <h4 className="text-2xl font-bold text-gray-900 mb-3">
                                            {product.name}
                                        </h4>

                                        {/* Recommendation Reason - The Key Selling Point */}
                                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-4">
                                            <p className="text-amber-900 font-medium italic">
                                                &quot;{product.reasonForRecommendation}&quot;
                                            </p>
                                        </div>

                                        {/* Price & Score */}
                                        <div className="flex items-center gap-4 mb-6">
                                            {product.price && (
                                                <div className="text-2xl font-bold text-green-600">
                                                    R$ {product.price.toLocaleString('pt-BR')}
                                                </div>
                                            )}
                                            {product.score && (
                                                <div className="flex items-center gap-1 bg-purple-100 px-3 py-1 rounded-full">
                                                    <span className="text-purple-700 font-bold">
                                                        {product.score.toFixed(1)}
                                                    </span>
                                                    <span className="text-purple-500 text-xs">/ 10</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <a
                                                href={`/produto/${product.id}`}
                                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                                                onClick={(e) => {
                                                    if (onViewDetails) {
                                                        e.preventDefault();
                                                        onViewDetails(product.id);
                                                    }
                                                }}
                                            >
                                                Ver Detalhes
                                                <ArrowRight className="w-4 h-4" />
                                            </a>
                                            <button
                                                onClick={() => handleAddToCompare(product)}
                                                disabled={isInCompareList(product.id)}
                                                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${isInCompareList(product.id)
                                                        ? 'bg-green-100 text-green-700 cursor-default'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {isInCompareList(product.id) ? (
                                                    <>✓ Adicionado</>
                                                ) : (
                                                    <>
                                                        <Plus className="w-4 h-4" />
                                                        Comparar este
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dots Indicator */}
                {products.length > 1 && (
                    <div className="flex justify-center gap-2 pb-4">
                        {products.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex
                                        ? 'bg-indigo-600 w-6'
                                        : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                aria-label={`Ir para slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Compare Bar - Shows when items are added */}
            {compareList.length >= 2 && (
                <div className="border-t border-gray-200 p-4 bg-gradient-to-r from-purple-50 to-indigo-50">
                    <div className="flex items-center justify-between">
                        <span className="text-indigo-700 font-medium">
                            {compareList.length} produtos selecionados para comparar
                        </span>
                        <a
                            href={`/vs/${compareList.join('-vs-')}`}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm"
                        >
                            Ver Comparação →
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}

// ===========================================================
// LOADING SKELETON
// ===========================================================

export function DiscoveryCarouselSkeleton() {
    return (
        <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white animate-pulse">
            <div className="bg-gradient-to-r from-indigo-400 to-purple-400 p-4 h-16" />
            <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/2">
                        <div className="aspect-square bg-gray-200 rounded-xl" />
                    </div>
                    <div className="md:w-1/2 space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                        <div className="h-8 bg-gray-200 rounded w-3/4" />
                        <div className="h-20 bg-amber-100 rounded-xl" />
                        <div className="h-8 bg-gray-200 rounded w-1/3" />
                        <div className="flex gap-3">
                            <div className="flex-1 h-12 bg-indigo-200 rounded-xl" />
                            <div className="flex-1 h-12 bg-gray-200 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DiscoveryCarousel;
