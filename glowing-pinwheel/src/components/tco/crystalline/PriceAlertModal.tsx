'use client';

// ============================================================================
// PRICE ALERT MODAL - Email Capture for Price Drop Notifications
// ============================================================================
// Design System: Crystalline (Frosted Glass Light)
// Captures user email for price alerts on specific products
// Uses React Portal to escape card containment
// ============================================================================

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Bell, Mail, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================

interface PriceAlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    productId: string;
    currentPrice: number;
}

type SubmissionState = 'idle' | 'loading' | 'success' | 'error';

// ============================================
// FORMAT HELPERS
// ============================================

function formatBRL(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

// ============================================
// COMPONENT
// ============================================

export function PriceAlertModal({
    isOpen,
    onClose,
    productName,
    productId,
    currentPrice,
}: PriceAlertModalProps) {
    const [email, setEmail] = useState('');
    const [targetPrice, setTargetPrice] = useState(Math.round(currentPrice * 0.9));
    const [state, setState] = useState<SubmissionState>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [mounted, setMounted] = useState(false);

    // Ensure we're mounted (client-side) before using portal
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen || !mounted) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!email || !email.includes('@')) {
            setErrorMessage('Por favor, insira um email válido');
            setState('error');
            return;
        }

        setState('loading');

        try {
            // Future integration: Send to API
            // For now, simulate success after short delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // TODO: Integrate with actual price alert API
            // await fetch('/api/price-alerts', {
            //     method: 'POST',
            //     body: JSON.stringify({ email, productId, targetPrice }),
            // });

            setState('success');

            // Auto-close after success
            setTimeout(() => {
                onClose();
                setState('idle');
                setEmail('');
            }, 2000);

        } catch (error) {
            setErrorMessage('Erro ao criar alerta. Tente novamente.');
            setState('error');
        }
    };

    const discountPercent = Math.round((1 - targetPrice / currentPrice) * 100);

    const modalContent = (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-[100]"
                onClick={onClose}
            />

            {/* Modal */}
            <div className={cn(
                'fixed z-[101]',
                // Mobile: Bottom sheet
                'inset-x-4 bottom-4 md:inset-auto',
                // Desktop: Centered
                'md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2',
                'md:w-full md:max-w-md',
                // Visual
                'bg-white rounded-2xl shadow-2xl',
                'animate-in fade-in-0 zoom-in-95 duration-200'
            )}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-xl">
                            <Bell className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">
                                Alerta de Preço
                            </h3>
                            <p className="text-xs text-slate-500 truncate max-w-[200px]">
                                {productName}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">
                    {state === 'success' ? (
                        <div className="flex flex-col items-center py-6 text-center">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                                <Check className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h4 className="text-lg font-semibold text-slate-900 mb-2">
                                Alerta Criado! 🎉
                            </h4>
                            <p className="text-sm text-slate-600">
                                Você receberá um email quando o preço baixar para{' '}
                                <span className="font-semibold text-emerald-600">
                                    {formatBRL(targetPrice)}
                                </span>
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Current Price Info */}
                            <div className="bg-slate-50 rounded-xl p-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">Preço atual:</span>
                                    <span className="font-semibold text-slate-900">
                                        {formatBRL(currentPrice)}
                                    </span>
                                </div>
                            </div>

                            {/* Target Price Slider */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Me avise quando baixar para:
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="range"
                                        min={Math.round(currentPrice * 0.5)}
                                        max={Math.round(currentPrice * 0.95)}
                                        value={targetPrice}
                                        onChange={(e) => setTargetPrice(Number(e.target.value))}
                                        className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                    <div className="flex flex-col items-end">
                                        <span className="font-bold text-indigo-600">
                                            {formatBRL(targetPrice)}
                                        </span>
                                        <span className="text-xs text-emerald-600 font-medium">
                                            -{discountPercent}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Email Input */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Seu email:
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (state === 'error') setState('idle');
                                        }}
                                        placeholder="seu@email.com"
                                        className={cn(
                                            'w-full pl-11 pr-4 py-3 rounded-xl border transition-colors',
                                            'text-slate-900 placeholder:text-slate-400',
                                            'focus:outline-none focus:ring-2 focus:ring-indigo-500',
                                            state === 'error'
                                                ? 'border-red-300 bg-red-50'
                                                : 'border-slate-200 bg-white'
                                        )}
                                    />
                                </div>
                                {state === 'error' && (
                                    <div className="flex items-center gap-1.5 mt-2 text-sm text-red-600">
                                        <AlertCircle className="w-4 h-4" />
                                        {errorMessage}
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={state === 'loading'}
                                className={cn(
                                    'w-full py-3 rounded-xl font-semibold',
                                    'transition-all duration-200',
                                    state === 'loading'
                                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]'
                                )}
                            >
                                {state === 'loading' ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Criando alerta...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <Bell className="w-4 h-4" />
                                        Criar Alerta
                                    </span>
                                )}
                            </button>

                            {/* Privacy Note */}
                            <p className="text-xs text-slate-500 text-center">
                                Usamos seu email apenas para alertas de preço.
                                Sem spam, prometemos! 🤞
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </>
    );

    // Use portal to render modal at document.body level
    return createPortal(modalContent, document.body);
}

export default PriceAlertModal;
