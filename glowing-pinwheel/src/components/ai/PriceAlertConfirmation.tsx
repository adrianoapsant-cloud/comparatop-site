'use client';

/**
 * Price Alert Confirmation Component (Lead Capture)
 * 
 * Two-state component:
 * 1. CONFIGURE: Shows email input form
 * 2. SUCCESS: Shows confirmation message
 * 
 * Transforms AI intent into captured Zero-Party Data lead.
 */

import { useState } from 'react';
import { Bell, ExternalLink, TrendingDown, Gift, Loader2, Mail, CheckCircle2 } from 'lucide-react';
import { saveAlertSubscription } from '@/app/actions/alert-subscription';

// ===========================================================
// TYPES
// ===========================================================

export interface PriceAlertConfirmationProps {
    /** Product name */
    productName: string;
    /** Product ID for linking */
    productId?: string;
    /** Target price (null for Amazon) */
    targetPrice: number | null;
    /** Platform: amazon uses "Deal Watch", others use "Price Tracker" */
    platform: 'amazon' | 'mercadolivre' | 'shopee' | 'geral';
    /** Initial alert ID (from tool) */
    alertId?: string;
}

type ComponentState = 'configure' | 'loading' | 'success' | 'error';

// ===========================================================
// PLATFORM DISPLAY CONFIG
// ===========================================================

const PLATFORM_CONFIG = {
    amazon: {
        label: 'Amazon',
        color: 'from-orange-500 to-amber-500',
        icon: Gift,
        alertType: 'Deal Watch',
        message: 'Ofertas relâmpago e listas curadas.',
        disclaimer: 'Monitoramos tendências e oportunidades, não preços específicos.',
    },
    mercadolivre: {
        label: 'Mercado Livre',
        color: 'from-yellow-500 to-amber-500',
        icon: TrendingDown,
        alertType: 'Alerta de Preço',
        message: 'Alerta quando atingir o preço alvo.',
        disclaimer: null,
    },
    shopee: {
        label: 'Shopee',
        color: 'from-orange-600 to-red-500',
        icon: TrendingDown,
        alertType: 'Alerta de Preço',
        message: 'Alerta quando atingir o preço alvo.',
        disclaimer: null,
    },
    geral: {
        label: 'Todas as Lojas',
        color: 'from-purple-500 to-indigo-500',
        icon: TrendingDown,
        alertType: 'Monitoramento',
        message: 'Acompanhamento de ofertas.',
        disclaimer: null,
    },
};

// ===========================================================
// MAIN COMPONENT
// ===========================================================

export function PriceAlertConfirmation({
    productName,
    productId,
    targetPrice,
    platform,
    alertId: initialAlertId,
}: PriceAlertConfirmationProps) {
    const [state, setState] = useState<ComponentState>('configure');
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [savedEmail, setSavedEmail] = useState<string | null>(null);

    const config = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.geral;
    const IconComponent = config.icon;
    const isAmazon = platform === 'amazon';

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Basic validation
        if (!email || !email.includes('@')) {
            setError('Por favor, insira um e-mail válido');
            return;
        }

        setState('loading');

        try {
            const result = await saveAlertSubscription(
                email,
                productName,
                targetPrice,
                platform,
                productId
            );

            if (result.success) {
                setSavedEmail(email);
                setState('success');
            } else {
                setError(result.error || 'Erro ao salvar. Tente novamente.');
                setState('configure');
            }
        } catch (err) {
            setError('Erro de conexão. Tente novamente.');
            setState('configure');
        }
    };

    // =========================================================
    // SUCCESS STATE
    // =========================================================
    if (state === 'success') {
        return (
            <div className="w-full max-w-md border border-emerald-200 rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Success Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold">Tudo Certo!</h3>
                            <p className="text-white/80 text-sm">{config.alertType} ativado</p>
                        </div>
                    </div>
                </div>

                {/* Success Body */}
                <div className="p-4 bg-white space-y-3">
                    <p className="text-gray-700">
                        Avisaremos em <span className="font-medium text-emerald-600">{savedEmail}</span> quando
                        {isAmazon ? (
                            <> surgir uma oportunidade para </>
                        ) : targetPrice ? (
                            <> o preço de </>
                        ) : (
                            <> houver novidades sobre </>
                        )}
                        <span className="font-medium text-purple-600">{productName}</span>
                        {!isAmazon && targetPrice && (
                            <> cair para <span className="font-medium text-green-600">R$ {targetPrice.toLocaleString('pt-BR')}</span> ou menos</>
                        )}.
                    </p>

                    {/* Platform badge */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${config.color} text-white`}>
                            {config.label}
                        </span>
                        <span>será monitorado</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
                    <a
                        href="/meus-alertas"
                        className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors"
                    >
                        <Bell className="w-4 h-4" />
                        <span>Gerenciar Meus Alertas</span>
                    </a>
                </div>
            </div>
        );
    }

    // =========================================================
    // CONFIGURE STATE (with email input)
    // =========================================================
    return (
        <div className="w-full max-w-md border border-gray-200 rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Header */}
            <div className={`bg-gradient-to-r ${config.color} p-4`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Bell className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold">Configurar Alerta</h3>
                        <p className="text-white/80 text-sm">{config.alertType}</p>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-4 bg-white space-y-4">
                {/* Product info */}
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-gray-900 font-medium">
                            Monitorar <span className="text-purple-600">{productName}</span>
                        </p>
                        <p className="text-gray-500 text-sm">{config.message}</p>
                    </div>
                </div>

                {/* Target price (only for non-Amazon) */}
                {!isAmazon && targetPrice && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                            <TrendingDown className="w-4 h-4 text-green-600" />
                            <span className="text-green-700 font-medium">
                                Alvo: R$ {targetPrice.toLocaleString('pt-BR')} ou menor
                            </span>
                        </div>
                    </div>
                )}

                {/* Amazon disclaimer */}
                {isAmazon && config.disclaimer && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-amber-700 text-sm">
                            ⚡ {config.disclaimer}
                        </p>
                    </div>
                )}

                {/* Email Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label htmlFor="alert-email" className="block text-sm font-medium text-gray-700 mb-1">
                            Seu e-mail para receber o alerta
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                id="alert-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                disabled={state === 'loading'}
                                required
                            />
                        </div>
                        {error && (
                            <p className="mt-1 text-sm text-red-600">{error}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={state === 'loading'}
                        className={`
                            w-full py-2.5 px-4 rounded-lg font-medium text-white
                            bg-gradient-to-r ${config.color}
                            hover:opacity-90 transition-all
                            disabled:opacity-50 disabled:cursor-not-allowed
                            flex items-center justify-center gap-2
                        `}
                    >
                        {state === 'loading' ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Salvando...</span>
                            </>
                        ) : (
                            <>
                                <Bell className="w-4 h-4" />
                                <span>Confirmar Monitoramento</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Privacy note */}
                <p className="text-xs text-gray-400 text-center">
                    Não enviamos spam. Apenas alertas relevantes sobre este produto.
                </p>
            </div>
        </div>
    );
}

export default PriceAlertConfirmation;
