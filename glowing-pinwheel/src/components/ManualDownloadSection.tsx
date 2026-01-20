'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, Download, ExternalLink, BookOpen, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================

interface ManualInfo {
    type: 'user' | 'quick-start' | 'installation' | 'warranty';
    title: string;
    language?: string;
    fileSize?: string;
    pdfUrl?: string; // Direct PDF URL (for download)
    wrapperUrl?: string; // Wrapper page URL (for viewing)
}

interface ManualDownloadSectionProps {
    productId: string;
    productName: string;
    manuals?: ManualInfo[];
    className?: string;
    /** If true, accordion starts open (default: false for minimal funnel interruption) */
    defaultOpen?: boolean;
}

// ============================================
// COMPONENT
// ============================================

/**
 * ManualDownloadSection - Seção "Recursos e Downloads"
 * 
 * Implementado como ACCORDION FECHADO por padrão para não interromper o funil de vendas.
 * Os manuais são informação de apoio, não decisão de compra.
 */
export function ManualDownloadSection({
    productId,
    productName,
    manuals,
    className,
    defaultOpen = false
}: ManualDownloadSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    // Default manuals if none provided
    const displayManuals: ManualInfo[] = manuals || [
        { type: 'user', title: 'Manual do Usuário', language: 'PT-BR' }
    ];

    return (
        <section
            className={cn('py-4', className)}
            aria-label={`Manuais e recursos para ${productName}`}
        >
            {/* Accordion Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'w-full flex items-center justify-between gap-3 py-3',
                    'text-left hover:opacity-80 transition-opacity'
                )}
                aria-expanded={isOpen}
            >
                <h3 className="text-base font-semibold text-text-muted flex items-center gap-2">
                    <BookOpen size={18} className="text-gray-400" />
                    Recursos e Downloads
                    <span className="text-xs text-gray-400 font-normal">
                        ({displayManuals.length})
                    </span>
                </h3>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-gray-400"
                >
                    <ChevronDown size={20} />
                </motion.div>
            </button>

            {/* Accordion Content */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-2 pb-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {displayManuals.map((manual, idx) => (
                                    <ManualCard
                                        key={idx}
                                        manual={manual}
                                        productId={productId}
                                        productName={productName}
                                    />
                                ))}
                            </div>

                            {/* Disclaimer */}
                            <p className="mt-4 text-xs text-text-muted">
                                Os manuais são fornecidos pelos fabricantes. O ComparaTop não se responsabiliza
                                pelo conteúdo dos documentos. Para suporte oficial, contate o fabricante.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function ManualCard({
    manual,
    productId,
    productName
}: {
    manual: ManualInfo;
    productId: string;
    productName: string;
}) {
    const wrapperUrl = manual.wrapperUrl || `/manual/${productId}`;
    const typeIcon = getTypeIcon(manual.type);
    const typeLabel = getTypeLabel(manual.type);

    return (
        <div className={cn(
            'flex items-center gap-3 p-4 rounded-xl',
            'bg-gray-50 border border-gray-200',
            'hover:border-brand-core/50 hover:bg-gray-100 transition-all'
        )}>
            {/* Icon */}
            <div className={cn(
                'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0',
                'bg-white border border-gray-200'
            )}>
                <FileText size={24} className="text-red-500" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-text-primary text-sm truncate">
                    {manual.title}
                </p>
                <p className="text-xs text-text-muted flex items-center gap-2">
                    <span>{typeLabel}</span>
                    {manual.language && (
                        <>
                            <span>•</span>
                            <span>{manual.language}</span>
                        </>
                    )}
                    {manual.fileSize && (
                        <>
                            <span>•</span>
                            <span>{manual.fileSize}</span>
                        </>
                    )}
                </p>
            </div>

            {/* Actions - Ghost Button (Secondary CTA) */}
            <Link
                href={wrapperUrl}
                className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-lg',
                    'border border-brand-core text-brand-core',
                    'bg-transparent hover:bg-brand-core hover:text-white',
                    'text-xs font-semibold transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-brand-core/50'
                )}
                aria-label={`Ver ${manual.title} de ${productName} - PDF`}
            >
                <ExternalLink size={14} />
                <span className="hidden sm:inline">Ver</span>
            </Link>
        </div>
    );
}

// ============================================
// HELPERS
// ============================================

function getTypeIcon(type: ManualInfo['type']) {
    switch (type) {
        case 'quick-start': return '🚀';
        case 'installation': return '🔧';
        case 'warranty': return '📜';
        default: return '📖';
    }
}

function getTypeLabel(type: ManualInfo['type']) {
    switch (type) {
        case 'quick-start': return 'Início Rápido';
        case 'installation': return 'Instalação';
        case 'warranty': return 'Garantia';
        default: return 'Manual';
    }
}
