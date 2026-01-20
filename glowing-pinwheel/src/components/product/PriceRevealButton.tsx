/**
 * @file PriceRevealButton.tsx
 * @description Componente Click-to-Reveal para proteção de dados (Data Moat)
 * 
 * Este componente implementa o padrão "Click-to-Reveal" que protege
 * preços e links de afiliado contra bots de IA. O HTML inicial não
 * contém nenhum preço ou link <a>, apenas um botão atrativo.
 * 
 * Estados:
 * 1. Idle: Botão "Verificar Melhor Preço" (sem dados sensíveis)
 * 2. Loading: Spinner enquanto chama Server Action
 * 3. Revealed: Preço + Botão de compra + "Verificado agora"
 * 4. Error: Mensagem de erro com retry
 */

'use client';

import React, { useState, useCallback } from 'react';
import { revealPrice, type PriceRevealResponse, type PriceRevealInput } from '@/actions/price-reveal';

// ============================================================================
// TIPOS
// ============================================================================

type RevealState = 'idle' | 'loading' | 'revealed' | 'error';

export interface PriceRevealButtonProps {
    /** ASIN do produto (Amazon) */
    asin?: string;
    /** ID do produto no sistema */
    productId?: string;
    /** Keyword para fallback de busca */
    keyword?: string;
    /** Plataforma preferida */
    platform?: 'amazon' | 'mercadolivre' | 'shopee' | 'magalu';
    /** Texto do botão inicial (default: "Verificar Melhor Preço") */
    buttonText?: string;
    /** Classe CSS adicional */
    className?: string;
    /** Callback quando preço é revelado */
    onReveal?: (data: PriceRevealResponse) => void;
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Formata preço para exibição em BRL
 */
function formatPrice(price: number, currency = 'BRL'): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency,
    }).format(price);
}

/**
 * Formata timestamp para exibição relativa
 */
function formatVerifiedTime(isoString: string): string {
    const now = new Date();
    const verified = new Date(isoString);
    const diffMs = now.getTime() - verified.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);

    if (diffSeconds < 5) return 'agora mesmo';
    if (diffSeconds < 60) return `há ${diffSeconds}s`;
    return `há ${Math.floor(diffSeconds / 60)}min`;
}

// ============================================================================
// COMPONENTES DE ESTADO
// ============================================================================

/** Botão inicial (estado idle) */
function IdleButton({
    onClick,
    onMouseEnter,
    buttonText
}: {
    onClick: () => void;
    onMouseEnter: () => void;
    buttonText: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            className="
        w-full py-4 px-6 
        bg-gradient-to-r from-emerald-500 to-teal-600
        hover:from-emerald-600 hover:to-teal-700
        text-white font-bold text-lg
        rounded-xl shadow-lg
        transform transition-all duration-200
        hover:scale-[1.02] hover:shadow-xl
        active:scale-[0.98]
        focus:outline-none focus:ring-4 focus:ring-emerald-500/30
      "
        >
            <span className="flex items-center justify-center gap-2">
                {/* Ícone de preço/tag */}
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                </svg>
                {buttonText}
            </span>
        </button>
    );
}

/** Estado de carregamento */
function LoadingState() {
    return (
        <div className="
      w-full py-4 px-6
      bg-gradient-to-r from-gray-100 to-gray-200
      dark:from-gray-800 dark:to-gray-700
      rounded-xl
      flex items-center justify-center gap-3
    ">
            {/* Spinner */}
            <svg
                className="animate-spin h-5 w-5 text-emerald-600 dark:text-emerald-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
            <span className="text-gray-600 dark:text-gray-300 font-medium">
                Verificando disponibilidade...
            </span>
        </div>
    );
}

/** Card com preço revelado */
function RevealedCard({
    data,
    onRetry
}: {
    data: PriceRevealResponse;
    onRetry: () => void;
}) {
    const hasDiscount = data.originalPrice && data.originalPrice > data.price;
    const discountPercent = hasDiscount
        ? Math.round((1 - data.price / data.originalPrice!) * 100)
        : 0;

    return (
        <div className="
      w-full p-4
      bg-white dark:bg-gray-800
      border-2 border-emerald-500/20
      rounded-xl shadow-lg
      space-y-3
    ">
            {/* Preço e desconto */}
            <div className="flex items-end justify-between">
                <div>
                    {hasDiscount && (
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-gray-500 line-through">
                                {formatPrice(data.originalPrice!, data.currency)}
                            </span>
                            <span className="
                text-xs font-bold text-white
                bg-red-500 px-2 py-0.5 rounded-full
              ">
                                -{discountPercent}%
                            </span>
                        </div>
                    )}
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {formatPrice(data.price, data.currency)}
                    </span>
                </div>

                {/* Badge de disponibilidade */}
                <div className={`
          text-xs font-semibold px-2 py-1 rounded-full
          ${data.inStock
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }
        `}>
                    {data.inStock ? '✓ Em estoque' : '✗ Indisponível'}
                </div>
            </div>

            {/* Botão de compra - Link com rel nofollow sponsored */}
            <a
                href={data.safeUrl}
                target="_blank"
                rel="nofollow sponsored noopener"
                className="
          block w-full py-3 px-6
          bg-gradient-to-r from-orange-500 to-amber-500
          hover:from-orange-600 hover:to-amber-600
          text-white font-bold text-center
          rounded-lg shadow-md
          transform transition-all duration-200
          hover:scale-[1.01] hover:shadow-lg
        "
            >
                Comprar na {data.sellerName} →
            </a>

            {/* Footer com verificação e retry */}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                    <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Verificado {formatVerifiedTime(data.verifiedAt)}
                </span>

                <button
                    type="button"
                    onClick={onRetry}
                    className="text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                    Atualizar preço
                </button>
            </div>
        </div>
    );
}

/** Estado de erro */
function ErrorState({
    message,
    onRetry
}: {
    message: string;
    onRetry: () => void;
}) {
    return (
        <div className="
      w-full p-4
      bg-red-50 dark:bg-red-900/20
      border border-red-200 dark:border-red-800
      rounded-xl
      text-center space-y-3
    ">
            <p className="text-red-600 dark:text-red-400 text-sm">
                {message}
            </p>
            <button
                type="button"
                onClick={onRetry}
                className="
          px-4 py-2
          bg-red-100 hover:bg-red-200
          dark:bg-red-900/40 dark:hover:bg-red-900/60
          text-red-700 dark:text-red-300
          font-medium text-sm
          rounded-lg
          transition-colors
        "
            >
                Tentar novamente
            </button>
        </div>
    );
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

/**
 * PriceRevealButton - Botão Click-to-Reveal para proteção de preços
 * 
 * O HTML inicial NÃO contém preços nem links <a>.
 * Dados são carregados apenas após interação do usuário.
 * 
 * @example
 * <PriceRevealButton
 *   asin="B09V3KXJPB"
 *   keyword="Samsung QN90C"
 *   platform="amazon"
 *   onReveal={(data) => console.log('Preço revelado:', data.price)}
 * />
 */
export function PriceRevealButton({
    asin,
    productId,
    keyword,
    platform = 'amazon',
    buttonText = 'Verificar Melhor Preço',
    className = '',
    onReveal,
}: PriceRevealButtonProps): React.ReactElement {
    const [state, setState] = useState<RevealState>('idle');
    const [priceData, setPriceData] = useState<PriceRevealResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

    // Flag para evitar múltiplas chamadas
    const [hasFetched, setHasFetched] = useState(false);

    /**
     * Busca o preço via Server Action
     */
    const fetchPrice = useCallback(async () => {
        // Evita chamadas duplicadas
        if (state === 'loading') return;

        setState('loading');
        setErrorMessage('');

        try {
            const input: PriceRevealInput = {
                asin,
                productId,
                keyword,
                platform,
            };

            const data = await revealPrice(input);

            if (data.error) {
                setState('error');
                setErrorMessage(data.error);
                return;
            }

            setPriceData(data);
            setState('revealed');
            setHasFetched(true);

            // Callback opcional
            onReveal?.(data);

        } catch (error) {
            console.error('[PriceRevealButton] Erro:', error);
            setState('error');
            setErrorMessage('Erro ao verificar preço. Tente novamente.');
        }
    }, [asin, productId, keyword, platform, state, onReveal]);

    /**
     * Handler para hover (pré-carrega no hover)
     */
    const handleMouseEnter = useCallback(() => {
        // Só faz prefetch se ainda não buscou
        if (!hasFetched && state === 'idle') {
            fetchPrice();
        }
    }, [hasFetched, state, fetchPrice]);

    /**
     * Handler para click
     */
    const handleClick = useCallback(() => {
        if (state === 'idle') {
            fetchPrice();
        }
    }, [state, fetchPrice]);

    /**
     * Handler para retry
     */
    const handleRetry = useCallback(() => {
        setState('idle');
        setHasFetched(false);
        fetchPrice();
    }, [fetchPrice]);

    // Renderiza baseado no estado atual
    return (
        <div className={`price-reveal-container ${className}`}>
            {state === 'idle' && (
                <IdleButton
                    onClick={handleClick}
                    onMouseEnter={handleMouseEnter}
                    buttonText={buttonText}
                />
            )}

            {state === 'loading' && <LoadingState />}

            {state === 'revealed' && priceData && (
                <RevealedCard data={priceData} onRetry={handleRetry} />
            )}

            {state === 'error' && (
                <ErrorState message={errorMessage} onRetry={handleRetry} />
            )}
        </div>
    );
}

// Export default
export default PriceRevealButton;
