'use client';

/**
 * SimplifiedPDP - Verdict Section
 * Renderiza veredito da redação com prós e contras
 */

import React from 'react';
import { PDPDataContract } from '../hooks/usePDPData';

interface VerdictSectionProps {
    data: PDPDataContract;
}

export function VerdictSection({ data }: VerdictSectionProps) {
    const { extended, product } = data;
    const verdict = extended?.verdict;

    if (!verdict?.headline) {
        if (process.env.NODE_ENV === 'development') {
            console.debug('[VerdictSection] Hidden: missing verdict.headline for', product.id);
        }
        return null;
    }

    // Extract pros and cons
    const pros = verdict.prosExpanded || [];
    const cons = verdict.consExpanded || [];

    const hasContent = pros.length > 0 || cons.length > 0;

    return (
        <section className="pdp-verdict py-8 border-t">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
                ✍️ Veredito da Redação
            </h2>

            {/* Headline */}
            <p className="text-lg text-gray-700 mb-6">
                {verdict.headline}
            </p>

            {/* Pros and Cons Grid */}
            {hasContent && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pros */}
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <h3 className="flex items-center gap-2 font-semibold text-green-800 mb-3">
                            <span className="text-lg">✅</span> Pontos Fortes
                        </h3>
                        {pros.length > 0 ? (
                            <ul className="space-y-2">
                                {pros.map((pro, i) => {
                                    const text = typeof pro === 'string' ? pro : (pro.text || pro.title || '');
                                    return (
                                        <li key={i} className="flex items-start gap-2 text-sm text-green-900">
                                            <span className="text-green-500 mt-0.5">•</span>
                                            {text}
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className="text-sm text-green-700 italic">Em análise</p>
                        )}
                    </div>

                    {/* Cons */}
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                        <h3 className="flex items-center gap-2 font-semibold text-red-800 mb-3">
                            <span className="text-lg">⚠️</span> Pontos de Atenção
                        </h3>
                        {cons.length > 0 ? (
                            <ul className="space-y-2">
                                {cons.map((con, i) => {
                                    const text = typeof con === 'string' ? con : (con.text || con.title || '');
                                    return (
                                        <li key={i} className="flex items-start gap-2 text-sm text-red-900">
                                            <span className="text-red-500 mt-0.5">•</span>
                                            {text}
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className="text-sm text-red-700 italic">Em análise</p>
                        )}
                    </div>
                </div>
            )}

            {/* Empty state if no content */}
            {!hasContent && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50/50 rounded-lg p-4 border border-green-200/50">
                        <h3 className="flex items-center gap-2 font-semibold text-green-800/70 mb-3">
                            <span className="text-lg">✅</span> Pontos Fortes
                        </h3>
                        <p className="text-sm text-green-700/70 italic">Análise em andamento...</p>
                    </div>
                    <div className="bg-red-50/50 rounded-lg p-4 border border-red-200/50">
                        <h3 className="flex items-center gap-2 font-semibold text-red-800/70 mb-3">
                            <span className="text-lg">⚠️</span> Pontos de Atenção
                        </h3>
                        <p className="text-sm text-red-700/70 italic">Análise em andamento...</p>
                    </div>
                </div>
            )}
        </section>
    );
}

export default VerdictSection;
