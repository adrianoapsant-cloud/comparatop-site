"use client";

import { useState } from "react";
import { Bell, Zap, TrendingDown, X, Mail, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { useRegion } from "@/contexts/RegionContext";
import { TcoBreakdown, formatTco } from "@/lib/tco";
import { cn } from "@/lib/utils";

interface SmartAlertModalProps {
    /** Whether the modal is open */
    isOpen: boolean;
    /** Close handler */
    onClose: () => void;
    /** Product information */
    product: {
        id: string;
        name: string;
        price: number;
        tco?: TcoBreakdown;
    };
}

type AlertType = "PRICE" | "SMART_VALUE";

// Local storage key for fallback alerts
const LOCAL_ALERTS_KEY = "comparatop_smart_alerts_local";

interface LocalAlert {
    id: string;
    userEmail: string;
    productSku: string;
    alertType: AlertType;
    targetPrice?: number;
    targetTco?: number;
    stateCode: string;
    createdAt: string;
}

/**
 * Save alert to localStorage (fallback when Supabase unavailable)
 */
function saveLocalAlert(alert: Omit<LocalAlert, 'id' | 'createdAt'>): string {
    const id = `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const fullAlert: LocalAlert = {
        ...alert,
        id,
        createdAt: new Date().toISOString()
    };

    if (typeof window !== 'undefined') {
        const existing = JSON.parse(localStorage.getItem(LOCAL_ALERTS_KEY) || '[]');
        existing.push(fullAlert);
        localStorage.setItem(LOCAL_ALERTS_KEY, JSON.stringify(existing));
    }

    return id;
}

/**
 * SmartAlertModal - Lead capture modal for price and TCO alerts
 * 
 * Offers two types of alerts:
 * 1. Standard Price Alert - Notify when price drops below target
 * 2. Smart Value Alert - Notify when TCO becomes optimal (AI-calculated)
 */
export function SmartAlertModal({ isOpen, onClose, product }: SmartAlertModalProps) {
    const { stateCode, stateName } = useRegion();
    const [email, setEmail] = useState("");
    const [alertType, setAlertType] = useState<AlertType>("SMART_VALUE");
    const [targetPrice, setTargetPrice] = useState(Math.round(product.price * 0.9)); // 10% discount default
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLocalMode, setIsLocalMode] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !email.includes("@")) {
            setError("Por favor, insira um email válido.");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setIsLocalMode(false);

        const alertData = {
            userEmail: email,
            productSku: product.id,
            alertType,
            targetTco: alertType === "SMART_VALUE" ? product.tco?.totalTco : undefined,
            targetPrice: alertType === "PRICE" ? targetPrice : undefined,
            currentTcoAtSignup: product.tco?.totalTco,
            stateCode
        };

        try {
            const response = await fetch('/api/smart-alerts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(alertData)
            });

            const data = await response.json();

            if (response.status === 501) {
                // Supabase not configured - fallback to localStorage
                console.log("[SmartAlertModal] Supabase not configured, saving locally");
                saveLocalAlert({
                    userEmail: email,
                    productSku: product.id,
                    alertType,
                    targetPrice: alertType === "PRICE" ? targetPrice : undefined,
                    targetTco: alertType === "SMART_VALUE" ? product.tco?.totalTco : undefined,
                    stateCode
                });
                setIsLocalMode(true);
                setIsSuccess(true);
                return;
            }

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao criar alerta');
            }

            console.log("[SmartAlertModal] Alert created:", data.alertId);
            setIsSuccess(true);

        } catch (err) {
            console.error("[SmartAlertModal] Error:", err);

            // Fallback to localStorage on any error
            saveLocalAlert({
                userEmail: email,
                productSku: product.id,
                alertType,
                targetPrice: alertType === "PRICE" ? targetPrice : undefined,
                targetTco: alertType === "SMART_VALUE" ? product.tco?.totalTco : undefined,
                stateCode
            });
            setIsLocalMode(true);
            setIsSuccess(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setIsSuccess(false);
        setIsLocalMode(false);
        setError(null);
        setEmail("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200">
                {/* Header */}
                <div className="relative px-6 py-5 bg-gradient-to-r from-violet-600 to-purple-700">
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                            <Bell className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Alertas Inteligentes
                            </h2>
                            <p className="text-sm text-violet-200">
                                {product.name}
                            </p>
                        </div>
                    </div>
                </div>

                {isSuccess ? (
                    /* Success State */
                    <div className="p-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Alerta Criado com Sucesso!
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Você receberá um email em <strong>{email}</strong> quando
                            {alertType === "SMART_VALUE"
                                ? " o custo-benefício for otimizado."
                                : ` o preço cair abaixo de ${formatTco(targetPrice)}.`
                            }
                        </p>

                        {/* Local mode warning */}
                        {isLocalMode && (
                            <div className="mb-4 p-3 bg-amber-50 rounded-lg flex items-start gap-2 text-left">
                                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-800">
                                    <strong>Modo local:</strong> Alerta salvo no seu navegador.
                                    Quando nosso sistema estiver disponível, sincronizaremos automaticamente.
                                </p>
                            </div>
                        )}

                        <button
                            onClick={handleClose}
                            className="px-6 py-2 bg-brand-core text-white rounded-lg hover:bg-brand-core/90 transition-colors"
                        >
                            Entendido
                        </button>
                    </div>
                ) : (
                    /* Form */
                    <form onSubmit={handleSubmit} className="p-6">
                        {/* Alert Type Selection */}
                        <div className="space-y-3 mb-6">
                            <label className="text-sm font-medium text-gray-700">
                                Tipo de Alerta
                            </label>

                            {/* Smart Value Alert */}
                            <button
                                type="button"
                                onClick={() => setAlertType("SMART_VALUE")}
                                className={cn(
                                    "w-full p-4 rounded-xl border-2 text-left transition-all",
                                    alertType === "SMART_VALUE"
                                        ? "border-violet-500 bg-violet-50"
                                        : "border-gray-200 hover:border-gray-300"
                                )}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                                        alertType === "SMART_VALUE"
                                            ? "bg-violet-500 text-white"
                                            : "bg-gray-100 text-gray-500"
                                    )}>
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className={cn(
                                            "font-semibold",
                                            alertType === "SMART_VALUE" ? "text-violet-900" : "text-gray-900"
                                        )}>
                                            ⚡ Alerta de Oportunidade (Smart)
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1">
                                            Aviso quando a eficiência compensar o preço (TCO Otimizado)
                                        </p>
                                        {alertType === "SMART_VALUE" && (
                                            <div className="mt-3 p-2 bg-violet-100 rounded-lg">
                                                <p className="text-xs text-violet-800">
                                                    💡 <strong>Produtos mais caros podem ser mais baratos no longo prazo.</strong> Nossa IA calcula energia + manutenção para {stateName} e avisa quando o custo total for vantajoso.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </button>

                            {/* Standard Price Alert */}
                            <button
                                type="button"
                                onClick={() => setAlertType("PRICE")}
                                className={cn(
                                    "w-full p-4 rounded-xl border-2 text-left transition-all",
                                    alertType === "PRICE"
                                        ? "border-emerald-500 bg-emerald-50"
                                        : "border-gray-200 hover:border-gray-300"
                                )}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                                        alertType === "PRICE"
                                            ? "bg-emerald-500 text-white"
                                            : "bg-gray-100 text-gray-500"
                                    )}>
                                        <TrendingDown className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className={cn(
                                            "font-semibold",
                                            alertType === "PRICE" ? "text-emerald-900" : "text-gray-900"
                                        )}>
                                            📉 Alerta de Preço Padrão
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1">
                                            Aviso quando o preço cair abaixo do valor definido
                                        </p>
                                        {alertType === "PRICE" && (
                                            <div className="mt-3">
                                                <label className="text-xs text-gray-600 block mb-1">
                                                    Avisar quando custar menos de:
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-500">R$</span>
                                                    <input
                                                        type="number"
                                                        value={targetPrice}
                                                        onChange={(e) => setTargetPrice(Number(e.target.value))}
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </button>
                        </div>

                        {/* Email Input */}
                        <div className="mb-6">
                            <label className="text-sm font-medium text-gray-700 block mb-1.5">
                                Seu Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seu@email.com"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                                    required
                                />
                            </div>
                            {error && (
                                <p className="text-xs text-red-600 mt-1">{error}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-xl font-medium hover:from-violet-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Criando...
                                </>
                            ) : (
                                <>
                                    Criar Alerta
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        {/* Privacy note */}
                        <p className="text-[10px] text-gray-500 text-center mt-4">
                            Seus dados estão seguros. Não compartilhamos seu email com terceiros.
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}
