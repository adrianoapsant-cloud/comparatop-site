'use client';

import { useState } from 'react';
import { ExternalLink, Check, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// TRUST-OPTIMIZED PRODUCT CARD
// Implements "Trust Architecture" with:
// - Source Stack (Consenso de Especialistas)
// - Curiosity Click Price Strategy
// - Primary + Satellite Button Layout
// ============================================

interface TrustProductCardProps {
    product: {
        id: string;
        name: string;
        shortName?: string;
        imageUrl?: string;
        score: number;
        reviewCount: number;
        reclameAquiStatus: 'safe' | 'warning' | 'unknown';
        amazonUrl?: string;
        mlUrl?: string;
        magaluUrl?: string;
    };
    className?: string;
}

export function TrustProductCard({ product, className }: TrustProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    // Score color logic
    const scoreColor = product.score >= 8 ? 'bg-[#00C853]' : product.score >= 6 ? 'bg-amber-500' : 'bg-red-500';

    // Format review count (e.g., 5420 -> "5.420")
    const formatReviewCount = (count: number) => {
        return count.toLocaleString('pt-BR');
    };

    // Reclame Aqui status
    const reclameAquiLabel = {
        safe: { text: 'Vendedor Seguro', icon: '✅', color: 'text-emerald-600' },
        warning: { text: 'Verificar Avaliações', icon: '⚠️', color: 'text-amber-600' },
        unknown: { text: 'Sem Dados', icon: '❓', color: 'text-gray-500' },
    };

    const raStatus = reclameAquiLabel[product.reclameAquiStatus];

    return (
        <article
            className={cn(
                'bg-white rounded-2xl border border-gray-100 overflow-hidden',
                'shadow-sm hover:shadow-xl transition-all duration-300',
                'flex flex-col',
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Product Image */}
            <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                <img
                    src={product.imageUrl || `https://placehold.co/400x300?text=${encodeURIComponent(product.shortName || 'Produto')}`}
                    alt={product.name}
                    className={cn(
                        'w-full h-full object-contain p-6 transition-transform duration-500',
                        isHovered && 'scale-105'
                    )}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/400x300?text=${encodeURIComponent(product.shortName || 'Produto')}`;
                    }}
                />
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                {/* ============================================ */}
                {/* SOURCE STACK - Trust Badge Container */}
                {/* ============================================ */}
                <div className="flex items-start gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                    {/* Score Badge */}
                    <div className={cn(
                        'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
                        scoreColor
                    )}>
                        <span className="text-white font-bold text-lg">{product.score.toFixed(1)}</span>
                    </div>

                    {/* Trust Text */}
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900">Consenso de Especialistas</p>
                        <p className="text-xs text-gray-500">
                            Baseado em {formatReviewCount(product.reviewCount)} análises
                        </p>

                        {/* Visual Chain of Custody - Source Icons */}
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-400">Fontes:</span>
                            <div className="flex items-center gap-1.5">
                                {/* Amazon Icon */}
                                <span className="w-5 h-5 rounded bg-[#FF9900] flex items-center justify-center text-[10px] text-white font-bold" title="Amazon">
                                    A
                                </span>
                                {/* YouTube Icon */}
                                <span className="w-5 h-5 rounded bg-red-600 flex items-center justify-center text-[10px] text-white" title="YouTube Reviews">
                                    ▶
                                </span>
                                {/* Reclame Aqui Icon */}
                                <span className="w-5 h-5 rounded bg-green-600 flex items-center justify-center text-[10px] text-white font-bold" title="Reclame Aqui">
                                    RA
                                </span>
                                {/* TechTudo/Especialistas */}
                                <span className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-[10px] text-white" title="Reviews Técnicos">
                                    T
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Title */}
                <h3 className="font-display text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                </h3>

                {/* Reclame Aqui Status Badge */}
                <div className={cn('flex items-center gap-1.5 text-xs mb-4', raStatus.color)}>
                    <ShieldCheck size={14} />
                    <span className="font-medium">{raStatus.icon} {raStatus.text}</span>
                </div>

                {/* ============================================ */}
                {/* CURIOSITY CLICK - Price Strategy */}
                {/* ============================================ */}
                <div className="mt-auto">
                    <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Melhor oferta encontrada:
                    </p>

                    {/* ============================================ */}
                    {/* PRIMARY + SATELLITE BUTTON LAYOUT */}
                    {/* ============================================ */}

                    {/* Primary CTA - Amazon */}
                    <a
                        href={product.amazonUrl || 'https://amazon.com.br'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                            'w-full py-3.5 rounded-xl mb-3',
                            'bg-gradient-to-r from-[#FF9900] to-[#FFAD33]',
                            'hover:from-[#E8890A] hover:to-[#FF9900]',
                            'text-white font-bold text-base',
                            'flex items-center justify-center gap-2',
                            'shadow-lg shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-300/50',
                            'transition-all duration-300',
                            'group'
                        )}
                    >
                        Verificar Preço Atualizado
                        <span className="transition-transform group-hover:translate-x-1">➔</span>
                    </a>

                    {/* Satellite Row - Multi-Store Options */}
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-xs text-gray-400">Comparar também em:</span>

                        {/* Mercado Livre */}
                        <a
                            href={product.mlUrl || `https://lista.mercadolivre.com.br/${encodeURIComponent(product.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 text-xs font-medium text-[#FFE600] bg-[#2D3277] rounded-lg hover:opacity-90 transition-opacity"
                            title="Mercado Livre"
                        >
                            ML
                        </a>

                        {/* Magalu */}
                        <a
                            href={product.magaluUrl || `https://www.magazineluiza.com.br/busca/${encodeURIComponent(product.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 text-xs font-medium text-white bg-[#0086FF] rounded-lg hover:opacity-90 transition-opacity"
                            title="Magazine Luiza"
                        >
                            Magalu
                        </a>
                    </div>
                </div>
            </div>
        </article>
    );
}

// ============================================
// DEMO USAGE EXAMPLE
// ============================================
export function TrustProductCardDemo() {
    const mockProduct = {
        id: 'samsung-qn90c-65',
        name: 'Samsung QN90C Neo QLED 65" 4K 120Hz Gaming Hub',
        shortName: 'Samsung QN90C',
        imageUrl: 'https://placehold.co/400x300?text=Samsung+QN90C',
        score: 8.4,
        reviewCount: 5420,
        reclameAquiStatus: 'safe' as const,
        amazonUrl: 'https://amazon.com.br',
        mlUrl: 'https://lista.mercadolivre.com.br/samsung-qn90c',
        magaluUrl: 'https://www.magazineluiza.com.br/busca/samsung-qn90c',
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="max-w-sm mx-auto">
                <TrustProductCard product={mockProduct} />
            </div>
        </div>
    );
}
