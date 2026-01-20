'use client';

import { CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// AUDIT VERDICT - SANDWICH FORMAT
// ============================================

interface AuditVerdictProps {
    /** What problem this product solves */
    solution: string;
    /** Key weakness/blemish to highlight */
    attention: string;
    /** Final technical conclusion */
    conclusion: string;
    /** Overall score for visual indicator */
    score?: number;
}

export function AuditVerdict({
    solution,
    attention,
    conclusion,
    score,
}: AuditVerdictProps) {
    return (
        <div className="space-y-3">
            {/* Section Title */}
            <div className="flex items-center gap-2 mb-4">
                <FileText size={20} className="text-slate-600" />
                <h2 className="font-display text-lg font-bold text-text-primary">
                    Veredito da Auditoria
                </h2>
                {score && (
                    <span className={cn(
                        'ml-auto px-2 py-1 rounded-full text-xs font-bold',
                        score >= 8 ? 'bg-emerald-100 text-emerald-700' :
                            score >= 6 ? 'bg-amber-100 text-amber-700' :
                                'bg-red-100 text-red-700'
                    )}>
                        {score.toFixed(1)}/10
                    </span>
                )}
            </div>

            {/* Green Block - The Solution */}
            <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg p-4">
                <div className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-emerald-800 text-sm mb-1">
                            ✓ A Solução
                        </h3>
                        <p className="text-sm text-emerald-700">
                            {solution}
                        </p>
                    </div>
                </div>
            </div>

            {/* Orange/Yellow Block - Attention Point (Blemish) */}
            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-4 shadow-sm">
                <div className="flex items-start gap-3">
                    <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-amber-800 text-sm mb-1">
                            ⚠️ Ponto de Atenção
                        </h3>
                        <p className="text-sm text-amber-700 font-medium">
                            {attention}
                        </p>
                    </div>
                </div>
            </div>

            {/* Grey Block - Technical Conclusion */}
            <div className="bg-slate-100 border-l-4 border-slate-400 rounded-r-lg p-4">
                <div className="flex items-start gap-3">
                    <FileText size={20} className="text-slate-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-slate-700 text-sm mb-1">
                            Conclusão Técnica
                        </h3>
                        <p className="text-sm text-slate-600">
                            {conclusion}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
