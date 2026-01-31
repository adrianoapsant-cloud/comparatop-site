'use client';

import React from 'react';
import { AlertTriangle, Info, Loader2, Construction } from 'lucide-react';

/**
 * ModuleFallback - Fallback explícito para seções PDP indisponíveis
 * 
 * Implementa o padrão "No-Null UI" - nenhuma seção deve sumir silenciosamente.
 * Quando dados estão faltando, este componente renderiza um estado explícito.
 */

export type FallbackStatus = 'loading' | 'unavailable' | 'coming_soon' | 'error';

export interface ModuleFallbackProps {
    /** ID único da seção (usado para data-testid) */
    sectionId: string;
    /** Nome amigável da seção para display */
    sectionName: string;
    /** Status atual */
    status?: FallbackStatus;
    /** Razão explicativa (ex: "Categoria não suportada") */
    reason?: string;
    /** Campos específicos que estão faltando (apenas em dev mode) */
    missingFields?: string[];
    /** Ícone customizado */
    icon?: React.ReactNode;
    /** Mostrar detalhes técnicos (dev mode only) */
    showDevDetails?: boolean;
}

const STATUS_CONFIG: Record<FallbackStatus, { icon: typeof AlertTriangle; label: string; className: string }> = {
    loading: {
        icon: Loader2,
        label: 'Carregando...',
        className: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    unavailable: {
        icon: Info,
        label: 'Indisponível',
        className: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    coming_soon: {
        icon: Construction,
        label: 'Em breve',
        className: 'text-purple-600 bg-purple-50 border-purple-200',
    },
    error: {
        icon: AlertTriangle,
        label: 'Erro',
        className: 'text-red-600 bg-red-50 border-red-200',
    },
};

export function ModuleFallback({
    sectionId,
    sectionName,
    status = 'unavailable',
    reason,
    missingFields,
    icon,
    showDevDetails = process.env.NODE_ENV === 'development',
}: ModuleFallbackProps) {
    const config = STATUS_CONFIG[status];
    const StatusIcon = config.icon;

    return (
        <section
            data-testid={`pdp-section-${sectionId}`}
            data-section-status={status}
            className={`rounded-lg border p-4 my-4 ${config.className}`}
        >
            {/* Header */}
            <div className="flex items-center gap-2">
                {icon || <StatusIcon size={18} className={status === 'loading' ? 'animate-spin' : ''} />}
                <h3 className="font-medium text-sm">{sectionName}</h3>
                <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-white/50">
                    {config.label}
                </span>
            </div>

            {/* Reason */}
            {reason && (
                <p className="mt-2 text-sm opacity-80">{reason}</p>
            )}

            {/* Dev Mode: Technical Details */}
            {showDevDetails && missingFields && missingFields.length > 0 && (
                <details className="mt-3 text-xs opacity-70">
                    <summary className="cursor-pointer hover:opacity-100">
                        🔧 Debug Info
                    </summary>
                    <ul className="mt-1 ml-4 list-disc">
                        {missingFields.map((field) => (
                            <li key={field}><code>{field}</code></li>
                        ))}
                    </ul>
                </details>
            )}
        </section>
    );
}

export default ModuleFallback;
