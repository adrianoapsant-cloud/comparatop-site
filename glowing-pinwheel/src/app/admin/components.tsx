'use client';

import { Copy, MessageSquare, ExternalLink } from 'lucide-react';
import Link from 'next/link';

// ============================================
// CLIENT COMPONENTS FOR ADMIN PAGE
// ============================================

interface ChatFunction {
    id: string;
    name: string;
    description: string;
    howToTest: string;
    testPrompt: string;
    icon: React.ReactNode;
}

export function ChatFunctionCard({ func }: { func: ChatFunction }) {
    const copyPrompt = async () => {
        try {
            await navigator.clipboard.writeText(func.testPrompt);
            alert('Prompt copiado!');
        } catch {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = func.testPrompt;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('Prompt copiado!');
        }
    };

    return (
        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-colors">
            <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-violet-500/20 rounded-lg text-violet-400">
                    {func.icon}
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-white">{func.name}</h3>
                    <p className="text-sm text-slate-400">{func.description}</p>
                </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-3 mb-3">
                <p className="text-xs text-slate-500 mb-1">Como testar:</p>
                <p className="text-sm text-slate-300">{func.howToTest}</p>
            </div>

            {func.testPrompt !== '(automático)' && (
                <div className="flex gap-2">
                    <button
                        onClick={copyPrompt}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 rounded-lg text-sm text-slate-300 hover:text-white transition-colors"
                    >
                        <Copy className="w-4 h-4" />
                        Copiar
                    </button>
                    <Link
                        href={`/categorias/smart-tvs?prefill=${encodeURIComponent(func.testPrompt)}`}
                        target="_blank"
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-violet-600/50 hover:bg-violet-500/50 border border-violet-500/50 rounded-lg text-sm text-white transition-colors"
                    >
                        <MessageSquare className="w-4 h-4" />
                        Testar
                    </Link>
                </div>
            )}
        </div>
    );
}

interface QuickLinkProps {
    label: string;
    href: string;
    icon: React.ReactNode;
}

export function QuickLinkCard({ label, href, icon }: QuickLinkProps) {
    return (
        <Link
            href={href}
            target="_blank"
            className="flex flex-col items-center gap-2 p-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/50 rounded-xl transition-colors text-center"
        >
            <div className="text-violet-400">{icon}</div>
            <span className="text-sm text-slate-300">{label}</span>
        </Link>
    );
}

interface StatusCardData {
    status: 'ok' | 'warning' | 'error' | 'loading';
    title: string;
    description: string;
    detail?: string;
    link?: string;
}

export function StatusCard({ data }: { data: StatusCardData }) {
    const statusBg = {
        ok: 'bg-emerald-500/10 border-emerald-500/30',
        warning: 'bg-amber-500/10 border-amber-500/30',
        error: 'bg-red-500/10 border-red-500/30',
        loading: 'bg-slate-500/10 border-slate-500/30'
    };

    const statusLabel = {
        ok: '✅ Funcionando',
        warning: '⚠️ Atenção',
        error: '❌ Problema',
        loading: '⏳ Verificando...'
    };

    const statusIcon = {
        ok: '✓',
        warning: '!',
        error: '✗',
        loading: '...'
    };

    const iconColor = {
        ok: 'text-emerald-400',
        warning: 'text-amber-400',
        error: 'text-red-400',
        loading: 'text-slate-400'
    };

    return (
        <div className={`p-4 rounded-xl border ${statusBg[data.status]}`}>
            <div className="flex items-start justify-between mb-3">
                <span className={`text-2xl ${iconColor[data.status]}`}>{statusIcon[data.status]}</span>
                {data.link && (
                    <Link href={data.link} target="_blank" className="text-slate-400 hover:text-white">
                        <ExternalLink className="w-4 h-4" />
                    </Link>
                )}
            </div>
            <h3 className="font-semibold text-white mb-1">{data.title}</h3>
            <p className="text-sm text-slate-300">{data.description}</p>
            {data.detail && <p className="text-xs text-slate-500 mt-1">{data.detail}</p>}
            <p className="text-xs mt-2 font-medium" style={{ color: data.status === 'ok' ? '#34d399' : data.status === 'warning' ? '#fbbf24' : '#f87171' }}>
                {statusLabel[data.status]}
            </p>
        </div>
    );
}
