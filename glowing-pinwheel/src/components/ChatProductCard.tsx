'use client';

import Link from 'next/link';
import { ExternalLink, Star, ShoppingCart } from 'lucide-react';

// ============================================
// CHAT PRODUCT CARD
// Simplified product card for chat interface
// - Photo/Title: Internal link to product page
// - CTA Button: External link to store
// ============================================

interface ChatProductCardProps {
    id: string;
    name: string;
    brand: string;
    price: number;
    priceFormatted: string;
    score: number;
    internalUrl?: string;
    amazonUrl: string;
    tcoInfo?: {
        monthlyEnergy: string;
        total5Years: string;
    };
}

export function ChatProductCard({
    id,
    name,
    brand,
    price,
    priceFormatted,
    score,
    internalUrl,
    amazonUrl,
    tcoInfo
}: ChatProductCardProps) {
    return (
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-xl p-4 my-3 max-w-sm backdrop-blur-sm shadow-lg">
            {/* Main clickable area - internal link (with fallback) */}
            <Link
                href={internalUrl || `/produto/${id}`}
                className="block group cursor-pointer"
            >
                <div className="flex items-start gap-3">
                    {/* Product Image Placeholder */}
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-slate-600 group-hover:to-slate-700 transition-colors">
                        <span className="text-2xl">📦</span>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-400 uppercase tracking-wide">{brand}</p>
                        <h4 className="text-white font-semibold text-sm leading-tight group-hover:text-emerald-400 transition-colors line-clamp-2">
                            {name}
                        </h4>

                        {/* Score Badge */}
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-xs font-medium">
                                <Star className="w-3 h-3 fill-current" />
                                <span>{score.toFixed(1)}</span>
                            </div>
                            <span className="text-emerald-400 font-bold text-sm">{priceFormatted}</span>
                        </div>
                    </div>
                </div>

                {/* TCO Info if available */}
                {tcoInfo && (
                    <div className="mt-3 pt-3 border-t border-slate-700/50">
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Custo mensal energia:</span>
                            <span className="text-amber-400 font-medium">{tcoInfo.monthlyEnergy}</span>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                            <span className="text-slate-400">Custo total 5 anos:</span>
                            <span className="text-white font-medium">{tcoInfo.total5Years}</span>
                        </div>
                    </div>
                )}
            </Link>

            {/* CTA Button - External link */}
            <a
                href={amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 font-semibold py-2.5 px-4 rounded-lg transition-all group shadow-lg shadow-amber-500/20"
            >
                <ShoppingCart className="w-4 h-4" />
                <span>Ver oferta na Amazon</span>
                <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100" />
            </a>
        </div>
    );
}

export default ChatProductCard;
