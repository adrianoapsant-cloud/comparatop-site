"use client";

import { useState, useEffect } from "react";
import {
    CheckCircle2,
    XCircle,
    RefreshCw,
    Database,
    Zap,
    Copy,
    AlertTriangle,
    Server
} from "lucide-react";

interface StatusData {
    configured: boolean;
    canConnect: boolean;
    tables: {
        energy_rates: boolean;
        smart_alerts: boolean;
        energy_profiles: boolean;
    };
    functions: {
        calculate_dynamic_tco: boolean;
    };
    lastError?: string;
}

interface EnergyRateData {
    stateCode: string;
    rateKwh: number;
    stateName: string;
    source: string;
}

export default function SupabaseSetupPage() {
    const [status, setStatus] = useState<StatusData | null>(null);
    const [energyRate, setEnergyRate] = useState<EnergyRateData | null>(null);
    const [loading, setLoading] = useState(true);
    const [seeding, setSeeding] = useState(false);
    const [seedResult, setSeedResult] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    // Check if we're in production (shouldn't render)
    const isProduction = process.env.NODE_ENV === 'production';

    const fetchStatus = async () => {
        setLoading(true);
        try {
            const [statusRes, rateRes] = await Promise.all([
                fetch('/api/supabase/status'),
                fetch('/api/energy-rates?state=SP')
            ]);

            if (statusRes.ok) {
                setStatus(await statusRes.json());
            }
            if (rateRes.ok) {
                setEnergyRate(await rateRes.json());
            }
        } catch (err) {
            console.error('Failed to fetch status:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSeed = async () => {
        setSeeding(true);
        setSeedResult(null);
        try {
            const res = await fetch('/api/supabase/seed-energy-rates', {
                method: 'POST'
            });
            const data = await res.json();

            if (res.ok) {
                setSeedResult(`✅ Seed concluído: ${data.upserted} estados`);
                fetchStatus(); // Refresh
            } else {
                setSeedResult(`❌ Erro: ${data.message || data.error}`);
            }
        } catch (err) {
            setSeedResult(`❌ Erro: ${err instanceof Error ? err.message : 'Unknown'}`);
        } finally {
            setSeeding(false);
        }
    };

    const copyMigrationPath = () => {
        navigator.clipboard.writeText('supabase/migrations/20260114_smart_value_tco.sql');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    if (isProduction) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center text-gray-500">
                    <p>404 - Page Not Found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Database className="w-8 h-8 text-emerald-400" />
                        Supabase Setup Wizard
                    </h1>
                    <p className="text-slate-400 mt-2">
                        Configure e verifique a conexão com o Supabase
                    </p>
                </div>

                {/* Refresh Button */}
                <button
                    onClick={fetchStatus}
                    disabled={loading}
                    className="mb-6 flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Atualizar Status
                </button>

                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {/* Configured */}
                    <StatusCard
                        title="Variáveis de Ambiente"
                        status={status?.configured ?? false}
                        icon={<Server className="w-5 h-5" />}
                        description={status?.configured
                            ? "NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY configurados"
                            : "Configure as variáveis no .env.local"
                        }
                    />

                    {/* Connection */}
                    <StatusCard
                        title="Conexão com Supabase"
                        status={status?.canConnect ?? false}
                        icon={<Zap className="w-5 h-5" />}
                        description={status?.canConnect
                            ? "Conexão estabelecida com sucesso"
                            : status?.lastError || "Não foi possível conectar"
                        }
                    />

                    {/* Tables */}
                    <StatusCard
                        title="Tabela: energy_rates"
                        status={status?.tables?.energy_rates ?? false}
                        icon={<Database className="w-5 h-5" />}
                        description={status?.tables?.energy_rates
                            ? "Tabela encontrada e acessível"
                            : "Tabela não encontrada - rode a migration"
                        }
                    />

                    <StatusCard
                        title="Tabela: smart_alerts"
                        status={status?.tables?.smart_alerts ?? false}
                        icon={<Database className="w-5 h-5" />}
                        description={status?.tables?.smart_alerts
                            ? "Tabela encontrada e acessível"
                            : "Tabela não encontrada - rode a migration"
                        }
                    />

                    <StatusCard
                        title="Tabela: energy_profiles"
                        status={status?.tables?.energy_profiles ?? false}
                        icon={<Zap className="w-5 h-5" />}
                        description={status?.tables?.energy_profiles
                            ? "Tabela encontrada e acessível"
                            : "Tabela não encontrada - rode a migration"
                        }
                    />
                </div>

                {/* Energy Rate Source */}
                <div className="bg-slate-800 rounded-xl p-6 mb-8">
                    <h2 className="text-lg font-semibold text-white mb-4">
                        Fonte das Tarifas de Energia
                    </h2>
                    {energyRate ? (
                        <div className="flex items-center gap-4">
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${energyRate.source === 'supabase'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : energyRate.source === 'mock'
                                    ? 'bg-amber-500/20 text-amber-400'
                                    : 'bg-blue-500/20 text-blue-400'
                                }`}>
                                {energyRate.source.toUpperCase()}
                            </div>
                            <span className="text-slate-300">
                                {energyRate.stateName}: R$ {energyRate.rateKwh.toFixed(2)}/kWh
                            </span>
                        </div>
                    ) : (
                        <p className="text-slate-400">Carregando...</p>
                    )}
                </div>

                {/* Migration Instructions */}
                {status?.configured && !status?.tables?.energy_rates && (
                    <div className="bg-amber-900/30 border border-amber-500/50 rounded-xl p-6 mb-8">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0" />
                            <div>
                                <h3 className="text-lg font-semibold text-amber-400 mb-2">
                                    Migration Necessária
                                </h3>
                                <p className="text-slate-300 mb-4">
                                    As tabelas não foram encontradas. Acesse o Supabase Dashboard → SQL Editor
                                    e execute o arquivo de migration:
                                </p>
                                <div className="flex items-center gap-2">
                                    <code className="bg-slate-900 px-3 py-2 rounded text-sm text-emerald-400 flex-1">
                                        supabase/migrations/20260114_smart_value_tco.sql
                                    </code>
                                    <button
                                        onClick={copyMigrationPath}
                                        className="px-3 py-2 bg-slate-700 text-white rounded hover:bg-slate-600"
                                    >
                                        {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Seed Button */}
                {status?.tables?.energy_rates && (
                    <div className="bg-slate-800 rounded-xl p-6 mb-8">
                        <h2 className="text-lg font-semibold text-white mb-4">
                            Seed de Dados
                        </h2>
                        <p className="text-slate-400 mb-4">
                            Popula a tabela energy_rates com as tarifas dos principais estados (SP, RJ, MG, etc.)
                        </p>
                        <button
                            onClick={handleSeed}
                            disabled={seeding}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 disabled:opacity-50"
                        >
                            {seeding ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <Database className="w-4 h-4" />
                            )}
                            Seed energy_rates
                        </button>
                        {seedResult && (
                            <p className="mt-3 text-sm text-slate-300">{seedResult}</p>
                        )}
                    </div>
                )}

                {/* Smart Alerts Status */}
                <div className="bg-slate-800 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">
                        Smart Alerts
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${status?.tables?.smart_alerts
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                            }`}>
                            {status?.tables?.smart_alerts ? 'DATABASE' : 'LOCAL STORAGE'}
                        </div>
                        <span className="text-slate-300">
                            {status?.tables?.smart_alerts
                                ? "Alertas sendo salvos no Supabase"
                                : "Alertas salvos no localStorage (fallback)"
                            }
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusCard({
    title,
    status,
    icon,
    description
}: {
    title: string;
    status: boolean;
    icon: React.ReactNode;
    description: string;
}) {
    return (
        <div className={`rounded-xl p-5 border ${status
            ? 'bg-emerald-900/20 border-emerald-500/30'
            : 'bg-red-900/20 border-red-500/30'
            }`}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-slate-200">
                    {icon}
                    <span className="font-medium">{title}</span>
                </div>
                {status ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                )}
            </div>
            <p className="text-sm text-slate-400">{description}</p>
        </div>
    );
}
