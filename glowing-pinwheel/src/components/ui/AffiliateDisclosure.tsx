'use client';

/**
 * @file AffiliateDisclosure.tsx
 * @description Componente de disclosure de afiliados obrigatório
 * 
 * Amazon Associates Program Operating Agreement requer disclosure conspícuo
 * antes de links de afiliados. Este componente deve ser inserido ANTES
 * do bloco "Onde Comprar" em páginas de produto.
 * 
 * @see https://affiliate-program.amazon.com/help/operating/agreement
 * @version 1.0.0
 */

import { Info } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface AffiliateDisclosureProps {
    /** Variante visual do disclosure */
    variant?: 'default' | 'compact' | 'minimal';
    /** Classe CSS adicional */
    className?: string;
}

// ============================================================================
// TEXTO OBRIGATÓRIO
// ============================================================================

const DISCLOSURE_TEXT = {
    full: 'Este site participa do Programa de Associados da Amazon e outros programas de afiliados. Compras feitas pelos nossos links podem gerar comissão, sem custo extra para você.',
    compact: 'Links de compra podem gerar comissão para o ComparaTop, sem custo extra para você.',
    minimal: 'Participamos de programas de afiliados.',
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Disclosure de afiliados conspícuo
 * 
 * Deve aparecer ANTES do primeiro CTA de compra em páginas de produto.
 * 
 * @example
 * <AffiliateDisclosure />
 * <WhereToBySection ... />
 */
export function AffiliateDisclosure({
    variant = 'default',
    className = '',
}: AffiliateDisclosureProps) {
    const text = variant === 'minimal'
        ? DISCLOSURE_TEXT.minimal
        : variant === 'compact'
            ? DISCLOSURE_TEXT.compact
            : DISCLOSURE_TEXT.full;

    if (variant === 'minimal') {
        return (
            <p className={`text-[10px] text-slate-400 dark:text-slate-500 ${className}`}>
                {text}
            </p>
        );
    }

    return (
        <div
            className={`
                flex items-start gap-2 
                text-xs text-slate-500 dark:text-slate-400 
                border-l-2 border-amber-400 dark:border-amber-500
                bg-amber-50/50 dark:bg-amber-900/10
                pl-3 pr-4 py-2 rounded-r-md
                ${className}
            `}
            role="note"
            aria-label="Nota de transparência sobre links de afiliados"
        >
            <Info
                className="w-4 h-4 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5"
                aria-hidden="true"
            />
            <div>
                <strong className="text-slate-600 dark:text-slate-300">
                    Nota de Transparência:
                </strong>{' '}
                {text}
            </div>
        </div>
    );
}

/**
 * Disclosure inline para uso em cards menores
 */
export function AffiliateDisclosureInline({ className = '' }: { className?: string }) {
    return (
        <span className={`text-[10px] text-slate-400 dark:text-slate-500 ${className}`}>
            Link de afiliado
        </span>
    );
}

export default AffiliateDisclosure;
