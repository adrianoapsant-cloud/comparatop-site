'use client';

/**
 * DataCorrectionModal
 * 
 * Modal for submitting data corrections from PDP sections.
 * Follows the SmartAlertModal pattern for consistent UX.
 */

import { useState, useEffect } from 'react';
import { X, Send, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/contexts/ToastContext';

// ============================================
// TYPES
// ============================================

export interface DataCorrectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    elementId: string;
    sectionLabel: string;
    productSlug?: string;
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

// ============================================
// COMPONENT
// ============================================

export function DataCorrectionModal({
    isOpen,
    onClose,
    elementId,
    sectionLabel,
    productSlug,
}: DataCorrectionModalProps) {
    const [comment, setComment] = useState('');
    const [suggestedFix, setSuggestedFix] = useState('');
    const [submitState, setSubmitState] = useState<SubmitState>('idle');
    const { showToast } = useToast();

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setComment('');
            setSuggestedFix('');
            setSubmitState('idle');
        }
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Submit handler
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!comment.trim()) {
            showToast('Por favor, descreva o problema encontrado.', 'error');
            return;
        }

        setSubmitState('submitting');

        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    feedbackType: 'content_error',
                    elementId,
                    comment: comment.trim(),
                    suggestedFix: suggestedFix.trim() || undefined,
                    productSlug,
                    pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
                }),
            });

            const result = await response.json();

            if (result.ok) {
                setSubmitState('success');
                showToast(result.message || 'Obrigado! Vamos revisar e corrigir.', 'success');
                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                setSubmitState('error');
                showToast(result.message || 'Erro ao enviar. Tente novamente.', 'error');
            }
        } catch {
            setSubmitState('error');
            showToast('Erro de conexão. Tente novamente.', 'error');
        }
    }

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className={cn(
                        'relative w-full max-w-md bg-white rounded-2xl shadow-2xl',
                        'animate-in fade-in zoom-in-95 duration-200'
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-amber-500" />
                            <h2 className="text-lg font-display font-semibold text-gray-900">
                                Corrigir Informação
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-4 space-y-4">
                        {/* Context badge */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                            <span>Seção:</span>
                            <span className="font-medium">{sectionLabel}</span>
                        </div>

                        {/* Comment field (required) */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700">
                                O que está errado ou faltando? *
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Ex: A potência de sucção está incorreta, o valor correto é 5000Pa..."
                                maxLength={1000}
                                rows={3}
                                required
                                disabled={submitState === 'submitting' || submitState === 'success'}
                                className={cn(
                                    'w-full px-3 py-2 rounded-lg border border-gray-200',
                                    'text-sm text-gray-900 placeholder:text-gray-400',
                                    'focus:ring-2 focus:ring-amber-400 focus:border-amber-400',
                                    'disabled:opacity-50 disabled:cursor-not-allowed',
                                    'resize-none'
                                )}
                            />
                            <div className="text-right text-xs text-gray-400">
                                {comment.length}/1000
                            </div>
                        </div>

                        {/* Suggested fix field (optional) */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700">
                                Como deveria ficar? (opcional)
                            </label>
                            <textarea
                                value={suggestedFix}
                                onChange={(e) => setSuggestedFix(e.target.value)}
                                placeholder="Ex: Potência de sucção: 5000Pa (fonte: site oficial)"
                                maxLength={1000}
                                rows={2}
                                disabled={submitState === 'submitting' || submitState === 'success'}
                                className={cn(
                                    'w-full px-3 py-2 rounded-lg border border-gray-200',
                                    'text-sm text-gray-900 placeholder:text-gray-400',
                                    'focus:ring-2 focus:ring-amber-400 focus:border-amber-400',
                                    'disabled:opacity-50 disabled:cursor-not-allowed',
                                    'resize-none'
                                )}
                            />
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={submitState === 'submitting' || submitState === 'success' || !comment.trim()}
                            className={cn(
                                'flex items-center justify-center gap-2 w-full py-3 rounded-xl',
                                'text-sm font-medium transition-all',
                                submitState === 'success'
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-amber-500 text-white hover:bg-amber-600',
                                'disabled:opacity-50 disabled:cursor-not-allowed'
                            )}
                        >
                            {submitState === 'submitting' && (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Enviando...
                                </>
                            )}
                            {submitState === 'success' && (
                                <>
                                    <CheckCircle className="w-4 h-4" />
                                    Enviado!
                                </>
                            )}
                            {(submitState === 'idle' || submitState === 'error') && (
                                <>
                                    <Send className="w-4 h-4" />
                                    Enviar Correção
                                </>
                            )}
                        </button>

                        {/* Privacy note */}
                        <p className="text-xs text-gray-400 text-center">
                            Seu feedback é anônimo. Vamos revisar e corrigir em até 48h.
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}

export default DataCorrectionModal;
