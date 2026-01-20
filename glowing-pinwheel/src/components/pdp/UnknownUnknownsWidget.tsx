/**
 * @file UnknownUnknownsWidget.tsx
 * @description Server Component para "Engenharia Oculta"
 * 
 * Exibe falhas de design, riscos de compatibilidade e detalhes técnicos
 * ocultos que o marketing não revela. Padrão "Divulgação Mitigada".
 * 
 * Renderização: Static Data Injection (dados vêm prontos do servidor)
 * Localização: Após "Veredito da Auditoria", antes de "Metodologia/Specs"
 * 
 * @version 1.0.0
 */

import { AlertTriangle, FileSearch, ShieldAlert } from 'lucide-react';
import type { CategoryUnknownUnknowns } from '@/types/engineering-schema';
import { UnknownUnknownsAccordion } from './UnknownUnknownsAccordion';

// ============================================
// PROPS
// ============================================

interface UnknownUnknownsWidgetProps {
    /** Dados de Unknown Unknowns da categoria */
    data: CategoryUnknownUnknowns | null;
    /** Filtrar por marcas específicas (opcional) */
    filterBrands?: string[];
    /** Mostrar apenas severidades específicas */
    filterSeverity?: ('CRITICAL' | 'WARNING' | 'INFO')[];
}

// ============================================
// MAIN COMPONENT (RSC)
// ============================================

export function UnknownUnknownsWidget({
    data,
    filterBrands,
    filterSeverity,
}: UnknownUnknownsWidgetProps) {
    // No data = don't render
    if (!data || data.items.length === 0) {
        return null;
    }

    // Apply filters
    let filteredItems = data.items;

    if (filterBrands && filterBrands.length > 0) {
        filteredItems = filteredItems.filter(item => {
            // Include items that either have no brand restriction OR match the filter
            if (!item.affectedBrands || item.affectedBrands.length === 0) return true;
            return item.affectedBrands.some(brand =>
                filterBrands.some(fb => brand.toLowerCase().includes(fb.toLowerCase()))
            );
        });
    }

    if (filterSeverity && filterSeverity.length > 0) {
        filteredItems = filteredItems.filter(item =>
            filterSeverity.includes(item.severity)
        );
    }

    // No items after filtering
    if (filteredItems.length === 0) {
        return null;
    }

    // Count by severity for summary
    const criticalCount = filteredItems.filter(i => i.severity === 'CRITICAL').length;
    const warningCount = filteredItems.filter(i => i.severity === 'WARNING').length;
    const infoCount = filteredItems.filter(i => i.severity === 'INFO').length;

    return (
        <section className="unknown-unknowns-widget bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                                🔍 Engenharia Oculta
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                O que o marketing não conta sobre {data.categoryName}
                            </p>
                        </div>
                    </div>

                    {/* Summary Badges */}
                    <div className="hidden sm:flex items-center gap-2">
                        {criticalCount > 0 && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                                {criticalCount} crítico{criticalCount > 1 ? 's' : ''}
                            </span>
                        )}
                        {warningCount > 0 && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                                {warningCount} alerta{warningCount > 1 ? 's' : ''}
                            </span>
                        )}
                        {infoCount > 0 && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                {infoCount} info
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Content: Accordion */}
            <div className="p-4">
                <UnknownUnknownsAccordion items={filteredItems} />
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <FileSearch className="w-3.5 h-3.5" />
                    Dados levantados por engenharia reversa • Última atualização: {data.lastUpdated}
                </p>
            </div>
        </section>
    );
}

export default UnknownUnknownsWidget;
