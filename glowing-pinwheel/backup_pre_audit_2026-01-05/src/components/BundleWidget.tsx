'use client';

import Link from 'next/link';
import { ShoppingCart, Plus, Equal, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/l10n';
import { getAmazonCartUrl } from '@/lib/amazon';
import { useHaptic } from '@/hooks/useHaptic';

interface BundleItem {
    name: string;
    shortName?: string;
    asin: string;
    price: number;
    imageUrl?: string;
    slug?: string;
}

interface BundleWidgetProps {
    mainProduct: BundleItem;
    accessory: BundleItem;
    associateTag?: string;
    title?: string;
    subtitle?: string;
    savings?: number;
    className?: string;
}

/**
 * Bundle Widget - Amazon Equation Style
 * 
 * Visual equation: Product A + Product B = Kit
 * Single prominent CTA button
 */
export function BundleWidget({
    mainProduct,
    accessory,
    associateTag = 'comparatop-20',
    title = '🔊 Melhore sua experiência',
    subtitle,
    savings,
    className,
}: BundleWidgetProps) {
    const haptic = useHaptic();

    const totalPrice = mainProduct.price + accessory.price;
    const monthlyPrice = Math.round((accessory.price / 12));

    const cartUrl = getAmazonCartUrl(
        [
            { asin: mainProduct.asin, quantity: 1 },
            { asin: accessory.asin, quantity: 1 },
        ],
        associateTag
    );

    const handleBuyClick = () => {
        haptic.trigger('impact');
        window.open(cartUrl, '_blank', 'noopener,noreferrer');
    };

    // Product Card Component
    const ProductCard = ({ item, isMain }: { item: BundleItem; isMain?: boolean }) => {
        const content = (
            <div className={cn(
                'relative flex flex-col items-center p-3 rounded-xl transition-all',
                'bg-white border-2',
                isMain ? 'border-brand-core/30' : 'border-gray-200',
                item.slug && 'hover:border-brand-core hover:shadow-md cursor-pointer'
            )}>
                {/* Image */}
                <div className="w-20 h-20 md:w-24 md:h-24 mb-2 flex items-center justify-center">
                    {item.imageUrl ? (
                        <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                            {(item.shortName || item.name).substring(0, 3)}
                        </div>
                    )}
                </div>

                {/* Name */}
                <p className="text-xs font-medium text-text-primary text-center line-clamp-2 h-8">
                    {item.shortName || item.name}
                </p>

                {/* Price */}
                <p className="text-sm font-bold text-text-primary mt-1">
                    {formatPrice(item.price)}
                </p>

                {/* Main badge */}
                {isMain && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-brand-core text-white text-[9px] font-bold rounded-full">
                        PRINCIPAL
                    </span>
                )}
            </div>
        );

        if (item.slug) {
            return (
                <Link href={`/produto/${item.slug}`} className="flex-1 max-w-[140px]">
                    {content}
                </Link>
            );
        }
        return <div className="flex-1 max-w-[140px]">{content}</div>;
    };

    return (
        <section className={cn('py-8', className)}>
            <div className={cn(
                'rounded-2xl overflow-hidden',
                'bg-gradient-to-br from-emerald-50 via-white to-blue-50',
                'border border-emerald-200/50',
                'shadow-lg shadow-emerald-100/50'
            )}>
                {/* Header */}
                <div className="px-6 pt-5 pb-3">
                    <div className="flex items-center gap-2 mb-1">
                        <Sparkles size={18} className="text-emerald-600" />
                        <h3 className="font-display text-lg font-semibold text-text-primary">
                            {title}
                        </h3>
                    </div>
                    {subtitle && (
                        <p className="text-sm text-text-secondary">{subtitle}</p>
                    )}
                </div>

                {/* Visual Equation: Product A + Product B = Bundle */}
                <div className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2 md:gap-4">
                        {/* Main Product */}
                        <ProductCard item={mainProduct} isMain />

                        {/* Plus Icon */}
                        <div className={cn(
                            'w-10 h-10 rounded-full',
                            'bg-gradient-to-br from-amber-400 to-orange-500',
                            'flex items-center justify-center',
                            'shadow-md',
                            'flex-shrink-0'
                        )}>
                            <Plus size={20} className="text-white" strokeWidth={3} />
                        </div>

                        {/* Accessory */}
                        <ProductCard item={accessory} />

                        {/* Equals Icon */}
                        <div className={cn(
                            'w-8 h-8 rounded-full',
                            'bg-gray-200',
                            'flex items-center justify-center',
                            'flex-shrink-0',
                            'hidden md:flex'
                        )}>
                            <Equal size={16} className="text-gray-600" strokeWidth={3} />
                        </div>

                        {/* Bundle Price (Desktop) */}
                        <div className="hidden md:flex flex-col items-center px-4">
                            <span className="text-xs text-text-muted">Total</span>
                            <span className="text-2xl font-bold text-text-primary">
                                {formatPrice(totalPrice)}
                            </span>
                            {savings && savings > 0 && (
                                <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                                    Economize {formatPrice(savings)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Persuasive Copy & CTA */}
                <div className="px-6 pb-6">
                    {/* Monthly Payment Pitch */}
                    <p className="text-center text-sm text-text-secondary mb-4">
                        <span className="font-semibold text-text-primary">
                            Melhore seu som por apenas{' '}
                            <span className="text-emerald-600 font-bold">
                                +R$ {monthlyPrice}/mês
                            </span>
                            {' '}no cartão
                        </span>
                    </p>

                    {/* Mobile Total */}
                    <div className="md:hidden flex items-center justify-center gap-3 mb-4">
                        <span className="text-sm text-text-muted">Total:</span>
                        <span className="text-xl font-bold text-text-primary">
                            {formatPrice(totalPrice)}
                        </span>
                        {savings && savings > 0 && (
                            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                                -{formatPrice(savings)}
                            </span>
                        )}
                    </div>

                    {/* Single Large CTA */}
                    <button
                        type="button"
                        onClick={handleBuyClick}
                        className={cn(
                            'w-full py-4 rounded-xl',
                            'bg-[#FF9900] hover:bg-[#E8890A]',
                            'text-white font-body font-bold text-lg',
                            'flex items-center justify-center gap-3',
                            'shadow-lg shadow-orange-200',
                            'hover:shadow-xl hover:scale-[1.01]',
                            'active:scale-[0.99]',
                            'transition-all duration-150'
                        )}
                    >
                        <ShoppingCart size={22} />
                        Adicionar o Kit à Amazon
                    </button>

                    {/* Trust Note */}
                    <p className="text-xs text-text-muted text-center mt-3">
                        ✓ Abre Amazon.com.br com ambos no carrinho
                    </p>
                </div>
            </div>
        </section>
    );
}
