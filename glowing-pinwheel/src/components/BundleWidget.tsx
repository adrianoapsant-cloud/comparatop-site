'use client';

import { ShoppingCart, Plus, ExternalLink, Sparkles, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAmazonCartUrl } from '@/lib/amazon';
import { useHaptic } from '@/hooks/useHaptic';

interface BundleItem {
    name: string;
    shortName?: string;
    asin: string;
    price: number;
    imageUrl?: string;
    affiliateUrl: string; // REQUIRED: Link de afiliado (Amazon, ML, etc)
}

interface BundleWidgetProps {
    mainProduct: BundleItem;
    accessory: BundleItem;
    associateTag?: string;
    title?: string;
    subtitle?: string;
    persuasiveText?: string;
    categoryId?: string;
    savings?: number;
    className?: string;
}

// Category-based persuasive text mapping
const CATEGORY_PERSUASIVE_TEXT: Record<string, string> = {
    'robot-vacuum': 'Mantenha seu robô sempre com sucção máxima',
    'tv': 'Complete sua experiência de cinema perfeita',
    'smart_tv': 'Complete sua experiência de cinema perfeita',
    'fridge': 'Mantenha sua geladeira funcionando perfeitamente',
    'air_conditioner': 'Garanta o máximo desempenho do ar',
    'washer': 'Mantenha sua lavadora em perfeitas condições',
};

function getPersuasiveText(categoryId?: string, explicit?: string): string {
    if (explicit) return explicit;
    if (categoryId && CATEGORY_PERSUASIVE_TEXT[categoryId]) {
        return CATEGORY_PERSUASIVE_TEXT[categoryId];
    }
    return 'Complete sua experiência com o pacote perfeito';
}

/**
 * Bundle Widget - Price Masked Version
 * 
 * Key Changes for Amazon Compliance:
 * - Main product shows "Checar Preço" instead of price
 * - Only accessory price is shown (as delta: "+ R$ X")
 * - No total calculation displayed
 * - CTA: "Montar Kit na Amazon" - adds BOTH products to cart
 */
export function BundleWidget({
    mainProduct,
    accessory,
    associateTag = 'comparatop-20',
    title = '🔊 Complete sua Experiência',
    subtitle,
    persuasiveText,
    categoryId,
    className,
}: BundleWidgetProps) {
    const haptic = useHaptic();
    const finalPersuasiveText = getPersuasiveText(categoryId, persuasiveText);

    // Monthly price for accessory only (the upgrade)
    const monthlyPrice = Math.round((accessory.price / 12));

    // Build Amazon cart URL that adds BOTH products to cart with affiliate tag
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

    // Main Product Card
    const MainProductCard = () => (
        <a
            href={mainProduct.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex-1 max-w-[140px]"
        >
            <div className={cn(
                'relative flex flex-col items-center p-3 rounded-xl transition-all',
                'bg-white border-2 border-brand-core/30',
                'hover:border-brand-core hover:shadow-md cursor-pointer'
            )}>
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-brand-core text-white text-[9px] font-bold rounded-full whitespace-nowrap">
                    PRINCIPAL
                </span>
                <div className="w-20 h-20 md:w-24 md:h-24 mb-2 flex items-center justify-center">
                    {mainProduct.imageUrl ? (
                        <img src={mainProduct.imageUrl} alt={mainProduct.name} className="w-full h-full object-contain" />
                    ) : (
                        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-2xl">📺</div>
                    )}
                </div>
                <p className="text-xs font-medium text-text-primary text-center line-clamp-2 h-8">
                    {mainProduct.shortName || mainProduct.name}
                </p>
                <span className="mt-1 text-xs font-medium text-amber-600 flex items-center gap-1">
                    <Search size={12} /> Verificar Preço
                </span>
            </div>
        </a>
    );

    // Accessory Card
    const AccessoryCard = () => (
        <a
            href={accessory.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex-1 max-w-[140px]"
        >
            <div className={cn(
                'relative flex flex-col items-center p-3 rounded-xl transition-all',
                'bg-white border-2 border-emerald-300',
                'hover:border-emerald-500 hover:shadow-md cursor-pointer'
            )}>
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-bold rounded-full whitespace-nowrap">
                    UPGRADE
                </span>
                <div className="w-20 h-20 md:w-24 md:h-24 mb-2 flex items-center justify-center">
                    {accessory.imageUrl ? (
                        <img src={accessory.imageUrl} alt={accessory.name} className="w-full h-full object-contain" />
                    ) : (
                        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-2xl">🔊</div>
                    )}
                </div>
                <p className="text-xs font-medium text-text-primary text-center line-clamp-2 h-8">
                    {accessory.shortName || accessory.name}
                </p>
                <span className="mt-1 text-xs font-medium text-emerald-600">Adicional</span>
            </div>
        </a>
    );

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

                {/* Visual Equation: Product A + Product B */}
                <div className="px-4 py-4">
                    <div className="flex items-center justify-center gap-3 md:gap-6">
                        {/* Main Product */}
                        <MainProductCard />

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
                        <AccessoryCard />
                    </div>

                    {/* Persuasive Copy & CTA */}
                    <div className="px-6 pb-6">
                        {/* Amazon Compliance: No fixed prices or monthly calculations */}
                        <p className="text-center text-sm text-text-secondary mb-4">
                            <span className="font-semibold text-text-primary">
                                {finalPersuasiveText.includes(' ') ? (
                                    <>
                                        {finalPersuasiveText.split(' ').slice(0, -2).join(' ')}{' '}
                                        <span className="text-emerald-600 font-bold">
                                            {finalPersuasiveText.split(' ').slice(-2).join(' ')}
                                        </span>
                                    </>
                                ) : finalPersuasiveText}
                            </span>
                        </p>

                        {/* Single Large CTA - Uses affiliate URL directly */}
                        <button
                            type="button"
                            onClick={handleBuyClick}
                            className={cn(
                                'w-full py-4 rounded-xl',
                                'bg-gradient-to-r from-amber-500 to-orange-500',
                                'hover:from-amber-400 hover:to-orange-400',
                                'text-white font-body font-bold text-lg',
                                'flex items-center justify-center gap-3',
                                'shadow-lg shadow-orange-200',
                                'hover:shadow-xl hover:scale-[1.01]',
                                'active:scale-[0.99]',
                                'transition-all duration-150'
                            )}
                        >
                            <ShoppingCart size={22} />
                            Montar Kit na Amazon
                            <ExternalLink size={16} />
                        </button>

                        {/* Compliance Note */}
                        <p className="text-xs text-text-muted text-center mt-3">
                            Adicione a experiência completa. O valor final será confirmado no carrinho da Amazon.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
