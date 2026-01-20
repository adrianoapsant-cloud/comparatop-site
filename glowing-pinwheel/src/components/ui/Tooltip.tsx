'use client';

// ============================================================================
// TOOLTIP COMPONENT - v3.0 CSS-Only
// ============================================================================
// Versão simplificada usando apenas CSS para máxima estabilidade
// Sem portals, sem JavaScript timing issues
// ============================================================================

import React from 'react';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================

export interface TooltipProps {
    /** Conteúdo do tooltip */
    content: React.ReactNode;
    /** Elemento trigger que ativa o tooltip */
    children: React.ReactNode;
    /** Posição preferida do tooltip */
    position?: 'top' | 'bottom' | 'left' | 'right';
    /** Largura máxima do tooltip */
    maxWidth?: number;
    /** Classe CSS adicional para o tooltip */
    className?: string;
    /** Se deve mostrar seta */
    arrow?: boolean;
    /** Desabilitar tooltip */
    disabled?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export function Tooltip({
    content,
    children,
    position = 'top',
    maxWidth = 320,
    className,
    arrow = true,
    disabled = false,
}: TooltipProps) {
    if (disabled || !content) {
        return <>{children}</>;
    }

    // Posicionamento baseado em CSS
    const positionStyles = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    const arrowStyles = {
        top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800',
        left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-800',
        right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-800',
    };

    return (
        <span className="relative inline-flex group">
            {/* Trigger */}
            {children}

            {/* Tooltip - CSS visibility via group-hover */}
            <span
                role="tooltip"
                className={cn(
                    // Posicionamento
                    'absolute z-[9999]',
                    positionStyles[position],
                    // Estilo base - tamanho mais quadrado
                    'px-4 py-3 rounded-xl',
                    'bg-gray-800 text-white',
                    'text-sm font-medium leading-relaxed',
                    'shadow-2xl',
                    // Largura mínima para evitar tooltip muito estreito
                    'min-w-[200px]',
                    // VISIBILIDADE - escondido por padrão, mostra no hover
                    'invisible opacity-0',
                    'group-hover:visible group-hover:opacity-100',
                    // Transição suave
                    'transition-all duration-200 ease-out',
                    // Evita quebra de linha indesejada
                    'whitespace-normal',
                    // Pointer events para permitir hover no tooltip
                    'pointer-events-none group-hover:pointer-events-auto',
                    className
                )}
                style={{ maxWidth }}
            >
                {content}

                {/* Seta */}
                {arrow && (
                    <span
                        className={cn(
                            'absolute w-0 h-0',
                            'border-[6px] border-solid',
                            arrowStyles[position]
                        )}
                    />
                )}
            </span>
        </span>
    );
}

// ============================================
// EXPORTS
// ============================================

export default Tooltip;
