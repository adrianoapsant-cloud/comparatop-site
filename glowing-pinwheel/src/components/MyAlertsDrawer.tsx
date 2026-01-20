"use client";

import { useState, useEffect } from "react";
import { Bell, X, Mail, Trash2, RefreshCw, AlertCircle, CloudOff, Cloud } from "lucide-react";
import { cn } from "@/lib/utils";

// Local storage key (same as SmartAlertModal)
const LOCAL_ALERTS_KEY = "comparatop_smart_alerts_local";

interface Alert {
    id: string;
    userEmail?: string;
    user_email?: string;
    productSku?: string;
    product_sku?: string;
    alertType?: string;
    alert_type?: string;
    targetPrice?: number;
    target_price?: number;
    targetTco?: number;
    target_tco?: number;
    stateCode?: string;
    state_code?: string;
    createdAt?: string;
    created_at?: string;
    isActive?: boolean;
    is_active?: boolean;
    source?: 'db' | 'local';
}

// Normalize DB vs local format
function normalizeAlert(alert: Alert, source: 'db' | 'local'): Alert & { source: 'db' | 'local' } {
    return {
        ...alert,
        userEmail: alert.userEmail || alert.user_email,
        productSku: alert.productSku || alert.product_sku,
        alertType: alert.alertType || alert.alert_type,
        targetPrice: alert.targetPrice || alert.target_price,
        targetTco: alert.targetTco || alert.target_tco,
        stateCode: alert.stateCode || alert.state_code,
        createdAt: alert.createdAt || alert.created_at,
        isActive: alert.isActive ?? alert.is_active ?? true,
        source
    };
}

interface MyAlertsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MyAlertsDrawer({ isOpen, onClose }: MyAlertsDrawerProps) {
    const [email, setEmail] = useState("");
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(false);
    const [source, setSource] = useState<'db' | 'local' | 'none'>('none');
    const [error, setError] = useState<string | null>(null);

    const fetchAlerts = async () => {
        if (!email || !email.includes('@')) {
            setError("Digite um email válido");
            return;
        }

        setLoading(true);
        setError(null);
        setAlerts([]);

        try {
            const res = await fetch(`/api/smart-alerts?email=${encodeURIComponent(email)}`);

            if (res.status === 501) {
                // Supabase not configured - use localStorage
                const localAlerts = getLocalAlerts(email);
                setAlerts(localAlerts.map(a => normalizeAlert(a, 'local')));
                setSource('local');
            } else if (res.ok) {
                const data = await res.json();
                if (data.alerts && data.alerts.length > 0) {
                    setAlerts(data.alerts.map((a: Alert) => normalizeAlert(a, 'db')));
                    setSource('db');
                } else {
                    // No DB alerts, check local
                    const localAlerts = getLocalAlerts(email);
                    if (localAlerts.length > 0) {
                        setAlerts(localAlerts.map(a => normalizeAlert(a, 'local')));
                        setSource('local');
                    } else {
                        setAlerts([]);
                        setSource('none');
                    }
                }
            } else {
                throw new Error('Erro ao buscar alertas');
            }
        } catch (err) {
            // Fallback to localStorage
            const localAlerts = getLocalAlerts(email);
            if (localAlerts.length > 0) {
                setAlerts(localAlerts.map(a => normalizeAlert(a, 'local')));
                setSource('local');
            } else {
                setError(err instanceof Error ? err.message : 'Erro desconhecido');
            }
        } finally {
            setLoading(false);
        }
    };

    const getLocalAlerts = (userEmail: string): Alert[] => {
        if (typeof window === 'undefined') return [];
        try {
            const stored = localStorage.getItem(LOCAL_ALERTS_KEY);
            if (!stored) return [];
            const all = JSON.parse(stored) as Alert[];
            return all.filter(a =>
                (a.userEmail || a.user_email)?.toLowerCase() === userEmail.toLowerCase()
            );
        } catch {
            return [];
        }
    };

    const removeLocalAlert = (alertId: string) => {
        if (typeof window === 'undefined') return;
        try {
            const stored = localStorage.getItem(LOCAL_ALERTS_KEY);
            if (!stored) return;
            const all = JSON.parse(stored) as Alert[];
            const filtered = all.filter(a => a.id !== alertId);
            localStorage.setItem(LOCAL_ALERTS_KEY, JSON.stringify(filtered));
            setAlerts(prev => prev.filter(a => a.id !== alertId));
        } catch {
            // Ignore errors
        }
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '-';
        try {
            return new Date(dateStr).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="px-6 py-5 bg-gradient-to-r from-violet-600 to-purple-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Bell className="w-6 h-6 text-white" />
                        <h2 className="text-lg font-semibold text-white">
                            Meus Alertas
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Email Input */}
                <div className="p-4 border-b">
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">
                        Digite seu email para buscar alertas
                    </label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && fetchAlerts()}
                                placeholder="seu@email.com"
                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                            />
                        </div>
                        <button
                            onClick={fetchAlerts}
                            disabled={loading}
                            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 disabled:opacity-50"
                        >
                            {loading ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                "Buscar"
                            )}
                        </button>
                    </div>
                    {error && (
                        <p className="text-xs text-red-600 mt-1">{error}</p>
                    )}
                </div>

                {/* Source Badge */}
                {source !== 'none' && !loading && (
                    <div className="px-4 py-2 bg-gray-50 border-b flex items-center gap-2">
                        {source === 'db' ? (
                            <>
                                <Cloud className="w-4 h-4 text-emerald-500" />
                                <span className="text-xs text-emerald-700 font-medium">
                                    Sincronizado (Supabase)
                                </span>
                            </>
                        ) : (
                            <>
                                <CloudOff className="w-4 h-4 text-amber-500" />
                                <span className="text-xs text-amber-700 font-medium">
                                    Modo Local (este navegador)
                                </span>
                            </>
                        )}
                    </div>
                )}

                {/* Alerts List */}
                <div className="flex-1 overflow-y-auto p-4">
                    {alerts.length === 0 && !loading && source !== 'none' && (
                        <div className="text-center py-8 text-gray-500">
                            <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p>Nenhum alerta encontrado</p>
                        </div>
                    )}

                    {alerts.length === 0 && !loading && source === 'none' && (
                        <div className="text-center py-8 text-gray-500">
                            <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p>Digite seu email para buscar alertas</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        {alerts.map((alert) => (
                            <div
                                key={alert.id}
                                className={cn(
                                    "p-4 rounded-xl border",
                                    alert.source === 'local'
                                        ? "bg-amber-50 border-amber-200"
                                        : "bg-white border-gray-200"
                                )}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 text-sm">
                                            {alert.productSku}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {alert.alertType === 'SMART_VALUE'
                                                ? `⚡ TCO: R$ ${alert.targetTco?.toLocaleString('pt-BR') || '-'}`
                                                : `📉 Preço: R$ ${alert.targetPrice?.toLocaleString('pt-BR') || '-'}`
                                            }
                                            {alert.stateCode && ` • ${alert.stateCode}`}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Criado em: {formatDate(alert.createdAt)}
                                        </p>
                                    </div>
                                    {alert.source === 'local' && (
                                        <button
                                            onClick={() => removeLocalAlert(alert.id)}
                                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                                            title="Remover alerta"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
