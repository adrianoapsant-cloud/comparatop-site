'use client';

/**
 * Smart Alert Button
 * 
 * Button + Modal for subscribing to price/TCO alerts.
 * Persists email in localStorage for convenience.
 */

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Bell, TrendingDown, Calculator, Loader2, Check, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/contexts/ToastContext';
import type { AlertSubscribeResponse } from '@/types/db';

// ============================================
// TYPES
// ============================================

export interface SmartAlertButtonProps {
    /** Product identifier */
    productSku: string;
    /** Product display name */
    productName: string;
    /** Current product price */
    currentPrice: number;
    /** Current calculated TCO (optional) */
    currentTco?: number;
    /** User's state for energy calculation */
    stateCode?: string;
    /** Button size variant */
    size?: 'default' | 'sm' | 'icon';
    /** Additional CSS classes */
    className?: string;
}

type AlertType = 'PRICE' | 'SMART_VALUE';

// ============================================
// LOCAL STORAGE
// ============================================

const EMAIL_STORAGE_KEY = 'comparatop_alert_email';

function getStoredEmail(): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(EMAIL_STORAGE_KEY) || '';
}

function setStoredEmail(email: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(EMAIL_STORAGE_KEY, email);
}

// ============================================
// COMPONENT
// ============================================

export function SmartAlertButton({
    productSku,
    productName,
    currentPrice,
    currentTco,
    stateCode = 'SP',
    size = 'default',
    className,
}: SmartAlertButtonProps) {
    const [open, setOpen] = useState(false);
    const [alertType, setAlertType] = useState<AlertType>('SMART_VALUE');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const { showToast } = useToast();
    const modalRef = useRef<HTMLDivElement>(null);

    // Load stored email on mount
    useEffect(() => {
        setEmail(getStoredEmail());
    }, []);

    // Close on escape key
    useEffect(() => {
        function handleEscape(e: KeyboardEvent) {
            if (e.key === 'Escape' && open) {
                setOpen(false);
            }
        }
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [open]);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [open]);

    // Handle form submission
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            showToast('Por favor, insira um email válido.', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/alerts/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    productSku,
                    alertType,
                    targetPrice: alertType === 'PRICE' ? currentPrice * 0.9 : undefined,
                    targetTco: alertType === 'SMART_VALUE' ? (currentTco || currentPrice * 1.3) : undefined,
                    currentTcoAtSignup: currentTco,
                    stateCode,
                }),
            });

            const result: AlertSubscribeResponse = await response.json();

            if (result.ok) {
                setStoredEmail(email);
                setSuccess(true);
                showToast('✅ Monitoramento iniciado!', 'success');
                // Close after success
                setTimeout(() => {
                    setOpen(false);
                    setSuccess(false);
                }, 1500);
            } else {
                showToast(result.message || 'Erro ao criar alerta', 'error');
            }
        } catch (error) {
            showToast('Erro de conexão. Tente novamente.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    }

    // Button content based on size
    const buttonContent = size === 'icon' ? (
        <Bell className="w-4 h-4" />
    ) : (
        <>
            <Bell className="w-4 h-4" />
            <span>Monitorar</span>
        </>
    );

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setOpen(true)}
                className={cn(
                    'inline-flex items-center justify-center gap-1.5 rounded-lg',
                    'font-medium transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                    size === 'icon' && 'w-9 h-9 p-0',
                    size === 'sm' && 'h-8 px-3 text-xs',
                    size === 'default' && 'h-10 px-4 text-sm',
                    'bg-blue-50 hover:bg-blue-100 text-blue-700',
                    'border border-blue-200',
                    className
                )}
                title="Monitorar preço e TCO"
            >
                {buttonContent}
            </button>

            {/* Modal Backdrop */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in">
                    {/* Modal Content */}
                    <div
                        ref={modalRef}
                        className={cn(
                            'bg-white rounded-2xl shadow-2xl w-full max-w-[400px]',
                            'animate-in zoom-in-95 slide-in-from-bottom-4',
                            'max-h-[90vh] overflow-y-auto'
                        )}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <Bell className="w-5 h-5 text-blue-600" />
                                <h2 className="font-semibold text-gray-900">
                                    Monitorar
                                </h2>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Product Name */}
                        <div className="px-4 pt-3">
                            <p className="text-sm text-gray-600 truncate">
                                {productName}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            {/* Alert Type Selection */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Tipo de Alerta
                                </label>

                                {/* SMART_VALUE Option (Recommended) */}
                                <label
                                    className={cn(
                                        'flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all',
                                        alertType === 'SMART_VALUE'
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    )}
                                >
                                    <input
                                        type="radio"
                                        name="alertType"
                                        value="SMART_VALUE"
                                        checked={alertType === 'SMART_VALUE'}
                                        onChange={() => setAlertType('SMART_VALUE')}
                                        className="mt-1"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Calculator className="w-4 h-4 text-blue-600" />
                                            <span className="font-medium text-gray-900 text-sm">
                                                TCO Melhorar
                                            </span>
                                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-medium rounded">
                                                Recomendado
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-1">
                                            Avise-me se o custo-total ficar mais vantajoso
                                        </p>
                                    </div>
                                </label>

                                {/* Educational Tip for SMART_VALUE */}
                                {alertType === 'SMART_VALUE' && (
                                    <div className="flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                                        <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                        <p className="text-[11px] text-amber-800">
                                            <strong>Diferencial:</strong> Monitoramos preço, energia e peças.
                                            Avisaremos se o custo real total cair.
                                        </p>
                                    </div>
                                )}

                                {/* PRICE Option */}
                                <label
                                    className={cn(
                                        'flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all',
                                        alertType === 'PRICE'
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    )}
                                >
                                    <input
                                        type="radio"
                                        name="alertType"
                                        value="PRICE"
                                        checked={alertType === 'PRICE'}
                                        onChange={() => setAlertType('PRICE')}
                                        className="mt-1"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <TrendingDown className="w-4 h-4 text-emerald-600" />
                                            <span className="font-medium text-gray-900 text-sm">
                                                Preço Cair
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-1">
                                            Avise-me se o preço de etiqueta cair
                                        </p>
                                    </div>
                                </label>
                            </div>

                            {/* Email Input */}
                            <div className="space-y-1.5">
                                <label htmlFor="alert-email" className="text-sm font-medium text-gray-700">
                                    Seu e-mail
                                </label>
                                <input
                                    id="alert-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seu@email.com"
                                    required
                                    className={cn(
                                        'w-full px-3 py-2.5 rounded-lg border border-gray-300',
                                        'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                                        'text-gray-900 placeholder:text-gray-400 text-sm'
                                    )}
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting || success}
                                className={cn(
                                    'w-full flex items-center justify-center gap-2 py-3 rounded-lg',
                                    'font-semibold text-white text-sm transition-all',
                                    success
                                        ? 'bg-emerald-500'
                                        : 'bg-blue-600 hover:bg-blue-700',
                                    'disabled:opacity-70 disabled:cursor-not-allowed'
                                )}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Criando...
                                    </>
                                ) : success ? (
                                    <>
                                        <Check className="w-4 h-4" />
                                        Monitoramento Ativo!
                                    </>
                                ) : (
                                    <>
                                        <Bell className="w-4 h-4" />
                                        Criar Alerta
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default SmartAlertButton;
