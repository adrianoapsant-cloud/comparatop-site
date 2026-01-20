'use client';

import { useState, useEffect } from 'react';

interface HealthData {
    ok: boolean;
    timestamp: string;
    environment: string;
    supabase: {
        configured: boolean;
        canConnect: boolean;
        tablesOk: boolean;
    };
    energyRates: {
        source: string;
    };
    smartAlerts: {
        mode: string;
    };
    llm: {
        provider: string;
        model: string;
        configured: boolean;
    };
    immunity: {
        recentOk: boolean;
    };
    errors: string[];
}

interface CheckItem {
    label: string;
    ok: boolean;
    detail?: string;
}

export default function ChecklistPage() {
    const [health, setHealth] = useState<HealthData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [chatTestResult, setChatTestResult] = useState<string | null>(null);
    const [chatTestLoading, setChatTestLoading] = useState(false);

    const fetchHealth = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/health/prod');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setHealth(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHealth();
    }, []);

    const runChatTest = async () => {
        setChatTestLoading(true);
        setChatTestResult(null);
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: 'melhor TV até 5000' }],
                    sessionId: 'health-check-test'
                })
            });
            if (res.ok) {
                setChatTestResult('✅ Chat respondeu OK');
            } else {
                setChatTestResult(`❌ HTTP ${res.status}`);
            }
        } catch (err) {
            setChatTestResult(`❌ ${err instanceof Error ? err.message : 'Error'}`);
        } finally {
            setChatTestLoading(false);
        }
    };

    const checks: CheckItem[] = health ? [
        {
            label: 'Supabase Configurado',
            ok: health.supabase.configured,
            detail: health.supabase.configured ? 'Env vars OK' : 'Missing env vars'
        },
        {
            label: 'Supabase Conexão',
            ok: health.supabase.canConnect,
            detail: health.supabase.canConnect ? 'Conectado' : 'Falha na conexão'
        },
        {
            label: 'Tabelas OK',
            ok: health.supabase.tablesOk,
            detail: health.supabase.tablesOk ? 'energy_rates, smart_alerts, energy_profiles' : 'Tabelas faltando'
        },
        {
            label: 'Energy Rates Source',
            ok: health.energyRates.source === 'supabase',
            detail: health.energyRates.source
        },
        {
            label: 'Smart Alerts Mode',
            ok: health.smartAlerts.mode === 'db',
            detail: health.smartAlerts.mode
        },
        {
            label: 'LLM Configurado',
            ok: health.llm.configured,
            detail: health.llm.configured ? `${health.llm.provider}/${health.llm.model}` : 'Missing API key'
        },
        {
            label: 'Status Geral',
            ok: health.ok,
            detail: health.ok ? 'Pronto para produção' : 'Verificar erros'
        }
    ] : [];

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">🚀 Production Checklist</h1>

            <div className="mb-6 flex gap-4">
                <button
                    onClick={fetchHealth}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Carregando...' : '🔄 Atualizar'}
                </button>
                <button
                    onClick={runChatTest}
                    disabled={chatTestLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                    {chatTestLoading ? 'Testando...' : '💬 Testar Chat'}
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded">
                    <strong>Erro:</strong> {error}
                </div>
            )}

            {chatTestResult && (
                <div className={`mb-6 p-4 rounded ${chatTestResult.includes('✅') ? 'bg-green-900/50 border border-green-500' : 'bg-red-900/50 border border-red-500'}`}>
                    <strong>Chat Test:</strong> {chatTestResult}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
                {checks.map((check, i) => (
                    <div
                        key={i}
                        className={`p-4 rounded-lg border ${check.ok ? 'bg-green-900/30 border-green-500' : 'bg-red-900/30 border-red-500'}`}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">{check.ok ? '✅' : '❌'}</span>
                            <span className="font-semibold">{check.label}</span>
                        </div>
                        {check.detail && (
                            <div className="text-sm text-gray-400 ml-7">{check.detail}</div>
                        )}
                    </div>
                ))}
            </div>

            {health?.errors && health.errors.length > 0 && (
                <div className="mt-6 p-4 bg-yellow-900/30 border border-yellow-500 rounded">
                    <h3 className="font-bold mb-2">⚠️ Erros Detectados</h3>
                    <ul className="list-disc list-inside text-sm">
                        {health.errors.map((err, i) => (
                            <li key={i}>{err}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="mt-8 p-4 bg-gray-800 rounded">
                <h3 className="font-bold mb-2">📋 Próximos Passos</h3>
                <ol className="list-decimal list-inside text-sm space-y-1">
                    <li>Configurar env vars na Vercel (ver PROD_SETUP.md)</li>
                    <li>Rodar migrations no Supabase SQL Editor</li>
                    <li>Executar seed: POST /api/supabase/seed-energy-rates</li>
                    <li>Verificar todos os checks acima ficarem verdes</li>
                    <li>Testar chat com mensagem real</li>
                </ol>
            </div>

            {health && (
                <div className="mt-4 text-xs text-gray-500">
                    Última verificação: {new Date(health.timestamp).toLocaleString('pt-BR')}
                    {' | '}Ambiente: {health.environment}
                </div>
            )}
        </div>
    );
}
