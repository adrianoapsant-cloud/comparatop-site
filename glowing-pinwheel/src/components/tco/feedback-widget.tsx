'use client';

/**
 * Feedback Widget
 * 
 * Minimal "Was this helpful?" widget for TCO analysis.
 * Part of the "Auditor Comunitário" crowdsourced validation.
 */

import * as React from 'react';
import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Send, X, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/contexts/ToastContext';

// ============================================
// TYPES
// ============================================

export interface FeedbackWidgetProps {
    /** Category slug for context */
    categorySlug?: string;
    /** Product SKU if feedback is for specific product */
    productSku?: string;
    /** Additional CSS classes */
    className?: string;
}

type FeedbackState = 'idle' | 'submitting' | 'positive' | 'negative_reason' | 'done';

interface FeedbackReason {
    id: string;
    label: string;
    emoji: string;
}

const FEEDBACK_REASONS: FeedbackReason[] = [
    { id: 'price_wrong', label: 'Preço está errado', emoji: '💰' },
    { id: 'consumption_unrealistic', label: 'Consumo parece irreal', emoji: '⚡' },
    { id: 'missing_product', label: 'Faltou um produto importante', emoji: '📦' },
    { id: 'calculation_error', label: 'Erro no cálculo', emoji: '🔢' },
    { id: 'other', label: 'Outro motivo', emoji: '💬' },
];

// ============================================
// COMPONENT
// ============================================

export function FeedbackWidget({
    categorySlug,
    productSku,
    className,
}: FeedbackWidgetProps) {
    const [state, setState] = useState<FeedbackState>('idle');
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [otherText, setOtherText] = useState('');
    const { showToast } = useToast();

    // Submit feedback to API
    async function submitFeedback(rating: boolean, reason?: string, reasonText?: string) {
        setState('submitting');

        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rating,
                    categorySlug,
                    productSku,
                    pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
                    reason,
                    reasonText,
                }),
            });

            const result = await response.json();

            if (result.ok) {
                setState('done');
                showToast(result.message, 'success');
            } else {
                setState('idle');
                showToast('Erro ao enviar. Tente novamente.', 'error');
            }
        } catch {
            setState('idle');
            showToast('Erro de conexão.', 'error');
        }
    }

    // Handle positive rating
    function handlePositive() {
        submitFeedback(true);
    }

    // Handle negative rating - show reason selector
    function handleNegative() {
        setState('negative_reason');
    }

    // Submit negative feedback with reason
    function submitNegativeWithReason() {
        if (!selectedReason) return;

        const reasonText = selectedReason === 'other' ? otherText : undefined;
        submitFeedback(false, selectedReason, reasonText);
    }

    // Reset to idle
    function handleReset() {
        setState('idle');
        setSelectedReason(null);
        setOtherText('');
    }

    // ============================================
    // RENDER STATES
    // ============================================

    // Done state
    if (state === 'done') {
        return (
            <div className={cn(
                'flex items-center justify-center gap-2 p-4',
                'bg-emerald-50 border border-emerald-200 rounded-xl',
                className
            )}>
                <Check className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">
                    Obrigado pelo feedback!
                </span>
            </div>
        );
    }

    // Negative reason selector
    if (state === 'negative_reason') {
        return (
            <div className={cn(
                'p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3',
                className
            )}>
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-amber-800">
                        O que podemos melhorar?
                    </p>
                    <button
                        onClick={handleReset}
                        className="p-1 hover:bg-amber-100 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4 text-amber-600" />
                    </button>
                </div>

                {/* Reason buttons */}
                <div className="flex flex-wrap gap-2">
                    {FEEDBACK_REASONS.map((reason) => (
                        <button
                            key={reason.id}
                            onClick={() => setSelectedReason(reason.id)}
                            className={cn(
                                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm',
                                'border transition-all',
                                selectedReason === reason.id
                                    ? 'bg-amber-200 border-amber-400 text-amber-900'
                                    : 'bg-white border-amber-200 text-amber-700 hover:border-amber-300'
                            )}
                        >
                            <span>{reason.emoji}</span>
                            <span>{reason.label}</span>
                        </button>
                    ))}
                </div>

                {/* Other text input */}
                {selectedReason === 'other' && (
                    <input
                        type="text"
                        value={otherText}
                        onChange={(e) => setOtherText(e.target.value)}
                        placeholder="Descreva o problema..."
                        maxLength={200}
                        className={cn(
                            'w-full px-3 py-2 rounded-lg border border-amber-200',
                            'text-sm text-gray-900 placeholder:text-gray-400',
                            'focus:ring-2 focus:ring-amber-400 focus:border-amber-400'
                        )}
                    />
                )}

                {/* Submit button */}
                <button
                    onClick={submitNegativeWithReason}
                    disabled={!selectedReason || (selectedReason === 'other' && !otherText.trim())}
                    className={cn(
                        'flex items-center justify-center gap-2 w-full py-2 rounded-lg',
                        'text-sm font-medium transition-all',
                        'bg-amber-500 text-white hover:bg-amber-600',
                        'disabled:opacity-50 disabled:cursor-not-allowed'
                    )}
                >
                    <Send className="w-4 h-4" />
                    Enviar Feedback
                </button>
            </div>
        );
    }

    // Default idle state
    return (
        <div className={cn(
            'flex flex-col sm:flex-row items-center justify-center gap-4 p-4',
            'bg-gray-50 border border-gray-200 rounded-xl',
            className
        )}>
            <p className="text-sm text-gray-600">
                Essa análise ajudou você?
            </p>

            <div className="flex items-center gap-2">
                {/* Positive */}
                <button
                    onClick={handlePositive}
                    disabled={state === 'submitting'}
                    className={cn(
                        'flex items-center gap-1.5 px-4 py-2 rounded-lg',
                        'text-sm font-medium transition-all',
                        'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
                        'border border-emerald-200 hover:border-emerald-300',
                        'disabled:opacity-50'
                    )}
                >
                    {state === 'submitting' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <ThumbsUp className="w-4 h-4" />
                    )}
                    <span>Sim</span>
                </button>

                {/* Negative */}
                <button
                    onClick={handleNegative}
                    disabled={state === 'submitting'}
                    className={cn(
                        'flex items-center gap-1.5 px-4 py-2 rounded-lg',
                        'text-sm font-medium transition-all',
                        'bg-gray-100 text-gray-600 hover:bg-gray-200',
                        'border border-gray-200 hover:border-gray-300',
                        'disabled:opacity-50'
                    )}
                >
                    <ThumbsDown className="w-4 h-4" />
                    <span>Não</span>
                </button>
            </div>
        </div>
    );
}

export default FeedbackWidget;
