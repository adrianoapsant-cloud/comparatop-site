'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, RefreshCw, Check, Eye, X, Archive } from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface Feedback {
    id: string;
    product_sku?: string;  // Coluna real do DB (não product_slug)
    element_id?: string;
    feedback_type?: string;
    reason_text?: string;  // Coluna real do DB (não comment)
    suggested_fix?: string;
    status?: string;
    rating?: number;
    created_at: string;
    updated_at?: string;
}

// ============================================
// FEEDBACK TABLE COMPONENT
// ============================================

export function FeedbacksTable() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('all');
    const [updating, setUpdating] = useState<string | null>(null);

    // Fetch feedbacks
    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const url = filter === 'all'
                ? '/api/admin/feedbacks?limit=100'
                : `/api/admin/feedbacks?status=${filter}&limit=100`;

            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed to fetch');

            const data = await res.json();
            setFeedbacks(data.feedbacks || []);
        } catch (err) {
            setError('Erro ao carregar feedbacks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filter]);

    // Update status
    const updateStatus = async (id: string, newStatus: string) => {
        setUpdating(id);

        try {
            const res = await fetch('/api/admin/feedbacks', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });

            if (!res.ok) throw new Error('Failed to update');

            // Refresh data
            await fetchData();
        } catch (err) {
            alert('Erro ao atualizar status');
        } finally {
            setUpdating(null);
        }
    };

    // Status badge
    const StatusBadge = ({ status }: { status: string }) => {
        const styles: Record<string, string> = {
            new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            reviewed: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
            fixed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
            wont_fix: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
        };

        const labels: Record<string, string> = {
            new: 'Novo',
            reviewed: 'Revisado',
            fixed: 'Corrigido',
            wont_fix: 'Não corrigir'
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[status] || styles.new}`}>
                {labels[status] || status}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    {['all', 'new', 'reviewed', 'fixed', 'wont_fix'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === status
                                ? 'bg-violet-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            {status === 'all' ? 'Todos' :
                                status === 'new' ? 'Novos' :
                                    status === 'reviewed' ? 'Revisados' :
                                        status === 'fixed' ? 'Corrigidos' : 'Não corrigir'}
                        </button>
                    ))}
                </div>

                <button
                    onClick={fetchData}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Atualizar
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="text-center py-12 text-slate-400">
                    Carregando feedbacks...
                </div>
            )}

            {/* Empty state */}
            {!loading && feedbacks.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                    Nenhum feedback encontrado.
                </div>
            )}

            {/* Table */}
            {!loading && feedbacks.length > 0 && (
                <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-900/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Produto
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Elemento
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Comentário
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Sugestão
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Data
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {feedbacks.map((fb) => (
                                    <tr key={fb.id} className="hover:bg-slate-800/50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-white font-medium">
                                                    {fb.product_sku || '-'}
                                                </span>
                                                {fb.product_sku && (
                                                    <a
                                                        href={`/produto/${fb.product_sku}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-violet-400 hover:text-violet-300"
                                                    >
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-slate-300 font-mono">
                                                {fb.element_id || '-'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 max-w-xs">
                                            <p className="text-sm text-slate-300 truncate" title={fb.reason_text}>
                                                {fb.reason_text || '-'}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 max-w-xs">
                                            <p className="text-sm text-emerald-300 truncate" title={fb.suggested_fix}>
                                                {fb.suggested_fix || '-'}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={fb.status || 'new'} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs text-slate-500">
                                                {new Date(fb.created_at).toLocaleDateString('pt-BR')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                {fb.status !== 'reviewed' && (
                                                    <button
                                                        onClick={() => updateStatus(fb.id, 'reviewed')}
                                                        disabled={updating === fb.id}
                                                        className="p-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded transition-colors"
                                                        title="Marcar como revisado"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {fb.status !== 'fixed' && (
                                                    <button
                                                        onClick={() => updateStatus(fb.id, 'fixed')}
                                                        disabled={updating === fb.id}
                                                        className="p-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded transition-colors"
                                                        title="Marcar como corrigido"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {fb.status !== 'wont_fix' && (
                                                    <button
                                                        onClick={() => updateStatus(fb.id, 'wont_fix')}
                                                        disabled={updating === fb.id}
                                                        className="p-1.5 bg-slate-500/20 hover:bg-slate-500/30 text-slate-400 rounded transition-colors"
                                                        title="Não corrigir"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
