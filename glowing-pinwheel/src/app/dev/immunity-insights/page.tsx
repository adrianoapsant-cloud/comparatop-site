"use client";

import { useState, useEffect, useCallback } from "react";

interface ImmunityEvent {
    ts: string;
    requestId: string;
    sessionId: string;
    type?: string;  // admin_login, admin_logout, etc.
    chat?: {
        mode: 'deterministic' | 'llm';
        userMessage: string;
        assistantText: string;
    };
    nav?: {
        type: string;
        path: string;
    };
    friction?: {
        rageClicks: number;
        confusionScrolls: number;
        score: number;
    };
    pageContext?: {
        path?: string;
        categorySlug?: string;
        section?: string;
    };
    intents?: Record<string, boolean>;
    latency?: {
        totalMs: number;
    };
    questionHash?: string;
    llm?: {
        model?: string;
        usage?: {
            promptTokens?: number;
            completionTokens?: number;
            totalTokens?: number;
        };
        cost?: {
            usd: number | null;
            source: 'env' | 'unset_env' | 'error';
        };
    };
}

interface AggregatedData {
    avgFriction: number;
    maxFriction: number;
    topPaths: { path: string; count: number; avgScore: number }[];
    intentsByFriction: { intent: string; count: number; avgScore: number }[];
    // Token telemetry
    totalTokens: number;
    totalCostUsd: number | null;
    llmEventCount: number;
    deterministicEventCount: number;
}

interface Idea {
    id: string;
    type: 'UX_FIX' | 'CONTENT_GAP' | 'CATALOG_DATA' | 'CHAT_FLOW';
    title: string;
    why: string;
    whatToDo: string[];
    confidence: 'low' | 'med' | 'high';
    related: { path?: string; intent?: string; ct?: string };
}

// DEV-only check
const isDev = process.env.NODE_ENV === 'development';

export default function ImmunityInsightsPage() {
    const [events, setEvents] = useState<ImmunityEvent[]>([]);
    const [sessions, setSessions] = useState<string[]>([]);
    const [selectedSession, setSelectedSession] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    const [aggregated, setAggregated] = useState<AggregatedData | null>(null);
    const [ideas, setIdeas] = useState<Idea[]>([]);

    const fetchEvents = useCallback(async () => {
        try {
            // Fetch events
            const res = await fetch('/api/immunity/recent?limit=200');
            const data = await res.json();
            const fetchedEvents = data.events || [];
            setEvents(fetchedEvents);

            // Extract unique sessions
            const uniqueSessions = Array.from(new Set(fetchedEvents.map((e: ImmunityEvent) => e.sessionId))) as string[];
            setSessions(uniqueSessions.slice(0, 20));

            // Fetch insights & ideas
            try {
                const insightsRes = await fetch('/api/immunity/insights?limit=200');
                const insightsData = await insightsRes.json();
                setIdeas(insightsData.ideas || []);
            } catch (insightsError) {
                console.warn('Failed to fetch insights:', insightsError);
            }
        } catch (e) {
            console.error('Failed to fetch events:', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    // Filter and aggregate
    useEffect(() => {
        const filtered = selectedSession === 'all'
            ? events
            : events.filter(e => e.sessionId === selectedSession);

        // Only chat events
        const chatEvents = filtered.filter(e => e.chat);

        if (chatEvents.length === 0) {
            setAggregated(null);
            return;
        }

        // Avg/Max friction
        const frictionScores = chatEvents.map(e => e.friction?.score || 0);
        const avgFriction = frictionScores.reduce((a, b) => a + b, 0) / frictionScores.length;
        const maxFriction = Math.max(...frictionScores);

        // Top paths by friction
        const pathMap = new Map<string, { count: number; totalScore: number }>();
        chatEvents.forEach(e => {
            const path = e.pageContext?.path || 'unknown';
            const score = e.friction?.score || 0;
            const existing = pathMap.get(path) || { count: 0, totalScore: 0 };
            pathMap.set(path, { count: existing.count + 1, totalScore: existing.totalScore + score });
        });
        const topPaths = Array.from(pathMap.entries())
            .map(([path, data]) => ({ path, count: data.count, avgScore: data.totalScore / data.count }))
            .sort((a, b) => b.avgScore - a.avgScore)
            .slice(0, 5);

        // Intents by friction
        const intentMap = new Map<string, { count: number; totalScore: number }>();
        chatEvents.forEach(e => {
            const score = e.friction?.score || 0;
            if (e.intents) {
                Object.keys(e.intents).forEach(intent => {
                    if (e.intents?.[intent]) {
                        const existing = intentMap.get(intent) || { count: 0, totalScore: 0 };
                        intentMap.set(intent, { count: existing.count + 1, totalScore: existing.totalScore + score });
                    }
                });
            }
        });
        const intentsByFriction = Array.from(intentMap.entries())
            .map(([intent, data]) => ({ intent, count: data.count, avgScore: data.totalScore / data.count }))
            .sort((a, b) => b.avgScore - a.avgScore);

        // Token/cost aggregation
        let totalTokens = 0;
        let totalCostUsd: number | null = 0;
        let llmEventCount = 0;
        let deterministicEventCount = 0;

        chatEvents.forEach(e => {
            if (e.chat?.mode === 'llm') {
                llmEventCount++;
                if (e.llm?.usage?.totalTokens) {
                    totalTokens += e.llm.usage.totalTokens;
                }
                if (e.llm?.cost?.usd !== null && e.llm?.cost?.usd !== undefined) {
                    if (totalCostUsd !== null) totalCostUsd += e.llm.cost.usd;
                } else if (e.llm?.cost?.source === 'unset_env') {
                    totalCostUsd = null; // Can't calculate if any event has unset env
                }
            } else {
                deterministicEventCount++;
            }
        });

        setAggregated({
            avgFriction,
            maxFriction,
            topPaths,
            intentsByFriction,
            totalTokens,
            totalCostUsd,
            llmEventCount,
            deterministicEventCount
        });
    }, [events, selectedSession]);

    if (!isDev) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <p className="text-white text-xl">404 - Not Found</p>
            </div>
        );
    }

    const filteredEvents = selectedSession === 'all'
        ? events
        : events.filter(e => e.sessionId === selectedSession);

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <h1 className="text-3xl font-bold mb-6">🛡️ Immunity Insights</h1>

            {/* Session Selector */}
            <div className="mb-6">
                <label className="text-sm text-slate-400 block mb-2">Session:</label>
                <select
                    value={selectedSession}
                    onChange={(e) => setSelectedSession(e.target.value)}
                    className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700"
                >
                    <option value="all">Todos ({events.length} eventos)</option>
                    {sessions.filter(s => s).map(s => (
                        <option key={s} value={s}>{s?.slice(0, 8) ?? 'unknown'}...</option>
                    ))}
                </select>
                <button
                    onClick={fetchEvents}
                    className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm"
                >
                    Atualizar
                </button>
            </div>

            {loading ? (
                <p>Carregando...</p>
            ) : (
                <>
                    {/* Summary Cards */}
                    {aggregated && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                            <div className="bg-slate-800 rounded-xl p-6">
                                <p className="text-slate-400 text-sm">Fricção Média</p>
                                <p className="text-4xl font-bold text-amber-400">{aggregated.avgFriction.toFixed(1)}</p>
                            </div>
                            <div className="bg-slate-800 rounded-xl p-6">
                                <p className="text-slate-400 text-sm">Pico de Fricção</p>
                                <p className="text-4xl font-bold text-red-400">{aggregated.maxFriction}</p>
                            </div>
                            <div className="bg-slate-800 rounded-xl p-6">
                                <p className="text-slate-400 text-sm">Eventos Chat</p>
                                <p className="text-4xl font-bold text-emerald-400">{filteredEvents.filter(e => e.chat).length}</p>
                            </div>
                            <div className="bg-slate-800 rounded-xl p-6">
                                <p className="text-slate-400 text-sm">Tokens (sessão)</p>
                                <p className="text-4xl font-bold text-blue-400">{aggregated.totalTokens.toLocaleString()}</p>
                                <p className="text-xs text-slate-500 mt-1">LLM: {aggregated.llmEventCount} | Det: {aggregated.deterministicEventCount}</p>
                            </div>
                            <div className="bg-slate-800 rounded-xl p-6">
                                <p className="text-slate-400 text-sm">Custo (sessão)</p>
                                {aggregated.totalCostUsd !== null ? (
                                    <p className="text-4xl font-bold text-green-400">${aggregated.totalCostUsd.toFixed(4)}</p>
                                ) : (
                                    <p className="text-sm text-slate-500">env não config.</p>
                                )}
                            </div>
                            <div className="bg-slate-800 rounded-xl p-6">
                                <p className="text-slate-400 text-sm">Modo</p>
                                <p className="text-sm font-medium text-violet-400">
                                    {aggregated.deterministicEventCount > 0 && `📦 Det: ${aggregated.deterministicEventCount}`}
                                    {aggregated.deterministicEventCount > 0 && aggregated.llmEventCount > 0 && ' | '}
                                    {aggregated.llmEventCount > 0 && `🧠 LLM: ${aggregated.llmEventCount}`}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Top Paths */}
                    {aggregated && aggregated.topPaths.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">🔥 Top Páginas com Fricção</h2>
                            <div className="bg-slate-800 rounded-xl overflow-hidden">
                                {aggregated.topPaths.map((p, i) => (
                                    <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-slate-700 last:border-b-0">
                                        <span className="text-slate-300">{p.path}</span>
                                        <span className="text-amber-400 font-medium">score: {p.avgScore.toFixed(1)} ({p.count}x)</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Intents by Friction */}
                    {aggregated && aggregated.intentsByFriction.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">🎯 Intents sob Fricção</h2>
                            <div className="flex flex-wrap gap-3">
                                {aggregated.intentsByFriction.map((i, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 bg-violet-900/50 text-violet-300 rounded-full text-sm"
                                    >
                                        {i.intent}: {i.count}x (avg {i.avgScore.toFixed(0)})
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 💡 Ideas Prioritárias (v1) */}
                    {ideas.length > 0 && (
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">💡 Ideias Prioritárias (v1)</h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            const checklist = ideas.map(i =>
                                                `- [ ] **${i.title}** (${i.type})\n  - Por quê: ${i.why}\n  - Fazer: ${i.whatToDo.join('; ')}`
                                            ).join('\n\n');
                                            navigator.clipboard.writeText(checklist);
                                            alert('Checklist copiado!');
                                        }}
                                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs transition-colors"
                                    >
                                        📋 Copiar Checklist
                                    </button>
                                    <button
                                        onClick={() => {
                                            const blob = new Blob([JSON.stringify(ideas, null, 2)], { type: 'application/json' });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = `immunity-ideas-${new Date().toISOString().slice(0, 10)}.json`;
                                            a.click();
                                        }}
                                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs transition-colors"
                                    >
                                        📥 Exportar JSON
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {ideas.map((idea) => (
                                    <div key={idea.id} className="bg-slate-800 rounded-xl p-4 border-l-4 border-l-amber-500">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${idea.type === 'UX_FIX' ? 'bg-red-900/50 text-red-300' :
                                                        idea.type === 'CONTENT_GAP' ? 'bg-blue-900/50 text-blue-300' :
                                                            idea.type === 'CATALOG_DATA' ? 'bg-green-900/50 text-green-300' :
                                                                'bg-purple-900/50 text-purple-300'
                                                        }`}>
                                                        {idea.type}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded text-xs ${idea.confidence === 'high' ? 'bg-emerald-900/50 text-emerald-300' :
                                                        idea.confidence === 'med' ? 'bg-amber-900/50 text-amber-300' :
                                                            'bg-slate-700 text-slate-400'
                                                        }`}>
                                                        {idea.confidence === 'high' ? '🔥 Alta' : idea.confidence === 'med' ? '⚡ Média' : '💤 Baixa'}
                                                    </span>
                                                </div>
                                                <h3 className="text-white font-medium mb-1">{idea.title}</h3>
                                                <p className="text-slate-400 text-sm mb-2">{idea.why}</p>
                                                <ul className="space-y-1">
                                                    {idea.whatToDo.map((action, aIdx) => (
                                                        <li key={aIdx} className="text-emerald-400 text-sm flex items-start gap-2">
                                                            <span className="text-emerald-600">→</span>
                                                            {action}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Timeline Table */}
                    <h2 className="text-xl font-semibold mb-4">📋 Linha do Tempo</h2>
                    <div className="bg-slate-800 rounded-xl overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-700/50">
                                    <th className="text-left px-4 py-3 text-slate-400">Timestamp</th>
                                    <th className="text-left px-4 py-3 text-slate-400">Path</th>
                                    <th className="text-left px-4 py-3 text-slate-400">Mode</th>
                                    <th className="text-left px-4 py-3 text-slate-400">Intents</th>
                                    <th className="text-left px-4 py-3 text-slate-400">Friction</th>
                                    <th className="text-left px-4 py-3 text-slate-400">Tokens</th>
                                    <th className="text-left px-4 py-3 text-slate-400">Cost</th>
                                    <th className="text-left px-4 py-3 text-slate-400">Latency</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEvents.slice(0, 50).map((e, i) => (
                                    <tr key={i} className="border-t border-slate-700/50 hover:bg-slate-700/30">
                                        <td className="px-4 py-2 text-slate-400 font-mono text-xs">
                                            {new Date(e.ts).toLocaleTimeString()}
                                        </td>
                                        <td className="px-4 py-2">
                                            {e.type ? <span className="text-orange-400">{e.type}</span> : (e.pageContext?.path || e.nav?.path || '-')}
                                        </td>
                                        <td className="px-4 py-2">
                                            {e.chat?.mode || (e.nav ? 'nav' : e.type ? 'admin' : '-')}
                                        </td>
                                        <td className="px-4 py-2">
                                            {e.intents ? Object.keys(e.intents).filter(k => e.intents?.[k]).join(', ') : '-'}
                                        </td>
                                        <td className="px-4 py-2">
                                            {e.friction?.score !== undefined ? (
                                                <span className={`font-medium ${e.friction.score >= 60 ? 'text-red-400' : 'text-slate-400'}`}>
                                                    {e.friction.score}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td className="px-4 py-2 text-blue-400 font-mono text-xs">
                                            {e.llm?.usage?.totalTokens?.toLocaleString() || '-'}
                                        </td>
                                        <td className="px-4 py-2 text-green-400 font-mono text-xs">
                                            {e.llm?.cost?.usd !== null && e.llm?.cost?.usd !== undefined
                                                ? `$${e.llm.cost.usd.toFixed(6)}`
                                                : (e.chat?.mode === 'llm' ? '?' : '-')}
                                        </td>
                                        <td className="px-4 py-2 text-slate-400">
                                            {e.latency?.totalMs ? `${e.latency.totalMs}ms` : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
