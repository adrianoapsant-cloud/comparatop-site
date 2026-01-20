'use client';

import { useRef, useCallback, useState } from 'react';

/**
 * Hook customizado para "Hover Intent" - evita flickering em Mega Menus.
 * 
 * Adiciona um delay antes de trocar o item ativo, permitindo que o usuário
 * mova o mouse na diagonal sem acionar itens intermediários.
 * 
 * @param delay - Delay em ms antes de considerar hover válido (default: 150ms)
 * @returns Objeto com handlers e estado
 * 
 * @example
 * const { activeItem, handleMouseEnter, handleMouseLeave, cancelIntent } = useHoverIntent<string>();
 * 
 * <div 
 *   onMouseEnter={() => handleMouseEnter('item-id')}
 *   onMouseLeave={handleMouseLeave}
 * >
 */
export function useHoverIntent<T = string>(delay: number = 150) {
    const [activeItem, setActiveItem] = useState<T | null>(null);
    const [pendingItem, setPendingItem] = useState<T | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const cancelIntent = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setPendingItem(null);
    }, []);

    const handleMouseEnter = useCallback((item: T) => {
        // Cancela qualquer intent pendente
        cancelIntent();

        // Se já é o item ativo, não faz nada
        if (activeItem === item) return;

        // Marca como pendente
        setPendingItem(item);

        // Agenda a ativação após o delay
        timeoutRef.current = setTimeout(() => {
            setActiveItem(item);
            setPendingItem(null);
            timeoutRef.current = null;
        }, delay);
    }, [activeItem, delay, cancelIntent]);

    const handleMouseLeave = useCallback(() => {
        cancelIntent();
    }, [cancelIntent]);

    const handleMenuLeave = useCallback(() => {
        cancelIntent();
        setActiveItem(null);
    }, [cancelIntent]);

    const setActive = useCallback((item: T | null) => {
        cancelIntent();
        setActiveItem(item);
    }, [cancelIntent]);

    return {
        /** Item atualmente ativo */
        activeItem,
        /** Item pendente (hover recente, aguardando delay) */
        pendingItem,
        /** Handler para onMouseEnter */
        handleMouseEnter,
        /** Handler para onMouseLeave de um item */
        handleMouseLeave,
        /** Handler para onMouseLeave do menu inteiro */
        handleMenuLeave,
        /** Cancela intent pendente sem limpar activeItem */
        cancelIntent,
        /** Define item ativo programaticamente (sem delay) */
        setActive,
        /** Limpa tudo (activeItem e pending) */
        reset: handleMenuLeave,
    };
}

export default useHoverIntent;
