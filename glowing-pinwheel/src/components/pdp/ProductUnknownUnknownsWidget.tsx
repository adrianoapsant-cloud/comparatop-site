/**
 * @file ProductUnknownUnknownsWidget.tsx
 * @description Server Component para "Engenharia Oculta" ESPECÍFICA do produto
 * 
 * Diferente do UnknownUnknownsWidget genérico, este componente:
 * 1. Recebe o produto completo (com technicalSpecs)
 * 2. Filtra automaticamente quais issues se aplicam
 * 3. Exibe razões personalizadas ("Este robô usa sensores IR...")
 * 
 * @version 1.0.0
 */

import { AlertTriangle, FileSearch, ShieldAlert, CheckCircle, Info } from 'lucide-react';
import type { Product } from '@/types/category';
import { getProductUnknownUnknowns, type ProductUnknownUnknown } from '@/data/unknown-unknowns-filter';
import { getUnknownUnknowns } from '@/data/unknown-unknowns-data';
import { ProductUnknownUnknownsAccordion } from './ProductUnknownUnknownsAccordion';

// ============================================
// PROPS
// ============================================

interface ProductUnknownUnknownsWidgetProps {
    /** Produto com technicalSpecs para filtragem automática */
    product: Product;
    /** Mostrar seção mesmo sem issues aplicáveis? */
    showEvenIfEmpty?: boolean;
}

// ============================================
// MAIN COMPONENT (RSC)
// ============================================

export function ProductUnknownUnknownsWidget({
    product,
    showEvenIfEmpty = false,
}: ProductUnknownUnknownsWidgetProps) {
    // Get filtered issues for this specific product
    const applicableItems = getProductUnknownUnknowns(product);
    const categoryData = getUnknownUnknowns(product.categoryId);

    // No category data = don't render
    if (!categoryData) {
        return null;
    }

    // No applicable items
    if (applicableItems.length === 0 && !showEvenIfEmpty) {
        return null;
    }

    // Count by severity (using adjusted severity if available)
    const criticalCount = applicableItems.filter(
        i => (i.adjustedSeverity || i.severity) === 'CRITICAL'
    ).length;
    const warningCount = applicableItems.filter(
        i => (i.adjustedSeverity || i.severity) === 'WARNING'
    ).length;
    const infoCount = applicableItems.filter(
        i => (i.adjustedSeverity || i.severity) === 'INFO'
    ).length;

    // Total issues in category (for context)
    const totalCategoryIssues = categoryData.items.length;
    const notApplicableCount = totalCategoryIssues - applicableItems.length;

    return (
        <section className="product-unknown-unknowns-widget bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
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
                                Problemas técnicos específicos do <span className="font-medium">{product.shortName || product.name}</span>
                            </p>
                        </div>
                    </div>

                    {/* Summary Badges */}
                    <div className="hidden sm:flex items-center gap-2 flex-wrap justify-end">
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

            {/* Content */}
            <div className="p-4">
                {applicableItems.length > 0 ? (
                    <ProductUnknownUnknownsAccordion
                        items={applicableItems}
                        productName={product.shortName || product.name}
                    />
                ) : (
                    <div className="text-center py-6 text-slate-500 dark:text-slate-400">
                        <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                        <p className="font-medium">Nenhum problema técnico identificado</p>
                        <p className="text-xs mt-1">
                            Das {totalCategoryIssues} armadilhas comuns em {categoryData.categoryName},
                            nenhuma se aplica a este modelo.
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                        <FileSearch className="w-3.5 h-3.5" />
                        Análise baseada nas specs do produto
                    </span>
                    {notApplicableCount > 0 && (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle className="w-3 h-3" />
                            {notApplicableCount} problema{notApplicableCount > 1 ? 's' : ''} não se aplica{notApplicableCount > 1 ? 'm' : ''}
                        </span>
                    )}
                </div>
            </div>
        </section>
    );
}

export default ProductUnknownUnknownsWidget;
