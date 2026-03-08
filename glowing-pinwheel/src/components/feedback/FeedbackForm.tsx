"use client";

import { useState, useEffect } from 'react';
import { Send, Loader2, MessageSquarePlus, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackFormProps {
    className?: string;
    contextData?: {
        productName?: string;
        [key: string]: any;
    };
    initialValues?: {
        acquisition: number;
        consumables: number;
        maintenance: number;
        opportunityCost: number;
        energyRate: number;
        residualValue: number;
    };
    calculationBasis?: {
        horizonYears: number;
        annualKwh: number;
    };
}

const fmt = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

export function FeedbackForm({ className, contextData, initialValues, calculationBasis }: FeedbackFormProps) {
    const [message, setMessage] = useState('');
    const [contact, setContact] = useState('');
    const [values, setValues] = useState({
        acquisition: initialValues?.acquisition?.toString() || '',
        consumables: initialValues?.consumables?.toString() || '',
        maintenance: initialValues?.maintenance?.toString() || '',
        opportunityCost: initialValues?.opportunityCost?.toString() || '',
        energyRate: initialValues?.energyRate?.toString() || '',
        residualValue: initialValues?.residualValue?.toString() || '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Calculated TCO
    const simulatedTco = (() => {
        if (!calculationBasis) return null;
        const acq = parseFloat(values.acquisition) || 0;
        const cons = parseFloat(values.consumables) || 0;
        const maint = parseFloat(values.maintenance) || 0;
        const opp = parseFloat(values.opportunityCost) || 0;
        const rate = parseFloat(values.energyRate) || 0;
        const resid = parseFloat(values.residualValue) || 0;

        const energyCost = calculationBasis.annualKwh * calculationBasis.horizonYears * rate;

        return (acq + cons + maint + opp + energyCost) - resid;
    })();

    // Update values if initialValues change
    useEffect(() => {
        if (initialValues) {
            setValues({
                acquisition: initialValues.acquisition?.toString() || '',
                consumables: initialValues.consumables?.toString() || '',
                maintenance: initialValues.maintenance?.toString() || '',
                opportunityCost: initialValues.opportunityCost?.toString() || '',
                energyRate: initialValues.energyRate?.toString() || '',
                residualValue: initialValues.residualValue?.toString() || '',
            });
        }
    }, [initialValues]);

    const handleValueChange = (field: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Message is optional if correcting values, but user must provide at least something?
        // Let's enforce message for context.
        if (!message.trim()) {
            setError('Por favor, digite uma justificativa ou mensagem.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    feedbackType: 'general',
                    contact: contact.trim(),
                    pageUrl: window.location.href,
                    message: message.trim(),
                    contextData: {
                        ...contextData,
                        correctionValues: values
                    },
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao enviar feedback');
            }

            setIsSuccess(true);
            setMessage('');
            setContact('');

            setTimeout(() => setIsSuccess(false), 5000);

        } catch (err) {
            setError('Ocorreu um erro ao enviar. Tente novamente.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className={cn("p-6 bg-green-900/20 border border-green-800 rounded-xl text-center animate-in fade-in zoom-in duration-300", className)}>
                <div className="flex justify-center mb-3">
                    <div className="bg-green-900/50 p-3 rounded-full">
                        <CheckCircle2 className="w-8 h-8 text-green-400" />
                    </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1" style={{ color: '#ffffff' }}>Mensagem Enviada!</h3>
                <p className="text-green-300">Obrigado pela sua contribuição. Vamos analisar o mais rápido possível.</p>
                <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-4 text-sm text-green-400 hover:text-green-300 font-medium hover:underline"
                >
                    Enviar outra mensagem
                </button>
            </div>
        );
    }

    return (
        <div className={cn("bg-slate-900 rounded-xl shadow-sm border border-slate-700 overflow-hidden", className)}>
            <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex items-center gap-3">
                <div className="bg-indigo-500/10 p-2 rounded-lg">
                    <MessageSquarePlus className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                    <h3 className="font-semibold text-white" style={{ color: '#ffffff' }}>Solicitar Produto ou Sugerir Melhorias</h3>
                    <p className="text-xs text-slate-300">Não achou o que procurava? Nos avise aqui que cadastramos pra você.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5">
                {/* Simulator Display */}
                {simulatedTco !== null && calculationBasis && (
                    <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-4 text-center animate-in fade-in">
                        <p className="text-xs text-emerald-400 uppercase tracking-widest font-semibold mb-1">
                            TCO Estimado ({calculationBasis.horizonYears} anos)
                        </p>
                        <div className="text-3xl font-bold text-emerald-400 drop-shadow-sm">
                            {fmt(simulatedTco)}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                            ≈ {fmt(simulatedTco / (calculationBasis.horizonYears * 12))}/mês
                        </p>
                    </div>
                )}

                {/* Data Correction Fields */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            Simular Valores Personalizados
                        </label>
                    </div>

                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Preço Aquisição (R$)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={values.acquisition}
                            onChange={handleValueChange('acquisition')}
                            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-white focus:border-indigo-500 hover:border-slate-600 transition-all font-mono"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Tarifa Energia (R$/kWh)</label>
                        <input
                            type="number"
                            step="0.001"
                            value={values.energyRate}
                            onChange={handleValueChange('energyRate')}
                            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-white focus:border-indigo-500 hover:border-slate-600 transition-all font-mono"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Consumíveis (5 anos)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={values.consumables}
                            onChange={handleValueChange('consumables')}
                            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-white focus:border-indigo-500 hover:border-slate-600 transition-all font-mono"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Manutenção (5 anos)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={values.maintenance}
                            onChange={handleValueChange('maintenance')}
                            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-white focus:border-indigo-500 hover:border-slate-600 transition-all font-mono"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Custo Oportunidade</label>
                        <input
                            type="number"
                            step="0.01"
                            value={values.opportunityCost}
                            onChange={handleValueChange('opportunityCost')}
                            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-white focus:border-indigo-500 hover:border-slate-600 transition-all font-mono"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Valor Revenda (-)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={values.residualValue}
                            onChange={handleValueChange('residualValue')}
                            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-emerald-400 focus:border-emerald-500 hover:border-slate-600 transition-all font-mono"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="feedback-message" className="block text-sm font-medium text-white mb-1">
                        Sua Mensagem / Justificativa
                    </label>
                    <textarea
                        id="feedback-message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ex: 'Encontrei por R$ 3.000 na loja X...', 'A manutenção dessa peça é mais barata...'"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[80px] text-sm text-slate-100 placeholder:text-slate-500 resize-y"
                        disabled={isSubmitting}
                    />
                </div>

                <div>
                    <label htmlFor="feedback-contact" className="block text-sm font-medium text-white mb-1">
                        Seu Contato (Opcional)
                    </label>
                    <input
                        id="feedback-contact"
                        type="text"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="Telegram, Email ou WhatsApp (para te avisarmos)"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-100 placeholder:text-slate-500"
                        disabled={isSubmitting}
                    />
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting || !message.trim()}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Enviando...
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            Enviar para o Time
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
