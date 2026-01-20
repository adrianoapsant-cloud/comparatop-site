'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * useHoverIntent Hook
 * 
 * Implementa "Hover Intent" pattern:
 * - Delay de entrada (~300ms) para evitar disparos acidentais
 * - Grace Period para que o card não feche quando mouse move do link para o card
 */

interface UseHoverIntentOptions {
    /** Delay antes de mostrar o elemento (ms) */
    enterDelay?: number;
    /** Grace period antes de esconder (ms) */
    leaveDelay?: number;
    /** Callback quando hover intent é confirmado */
    onHoverStart?: () => void;
    /** Callback quando hover termina */
    onHoverEnd?: () => void;
}

interface UseHoverIntentReturn {
    /** Se deve mostrar o elemento */
    isHovering: boolean;
    /** Props para o elemento trigger (link) */
    triggerProps: {
        onMouseEnter: () => void;
        onMouseLeave: () => void;
    };
    /** Props para o elemento target (card/popover) */
    targetProps: {
        onMouseEnter: () => void;
        onMouseLeave: () => void;
    };
    /** Força fechar */
    close: () => void;
}

export function useHoverIntent(options: UseHoverIntentOptions = {}): UseHoverIntentReturn {
    const {
        enterDelay = 300,
        leaveDelay = 150,
        onHoverStart,
        onHoverEnd,
    } = options;

    const [isHovering, setIsHovering] = useState(false);
    const enterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isOverTrigger = useRef(false);
    const isOverTarget = useRef(false);

    // Limpa timeouts ao desmontar
    useEffect(() => {
        return () => {
            if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
            if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
        };
    }, []);

    const handleShow = useCallback(() => {
        // Cancela qualquer timeout de saída pendente
        if (leaveTimeoutRef.current) {
            clearTimeout(leaveTimeoutRef.current);
            leaveTimeoutRef.current = null;
        }

        // Se já está mostrando, não faz nada
        if (isHovering) return;

        // Inicia timeout de entrada
        enterTimeoutRef.current = setTimeout(() => {
            setIsHovering(true);
            onHoverStart?.();
        }, enterDelay);
    }, [isHovering, enterDelay, onHoverStart]);

    const handleHide = useCallback(() => {
        // Cancela qualquer timeout de entrada pendente
        if (enterTimeoutRef.current) {
            clearTimeout(enterTimeoutRef.current);
            enterTimeoutRef.current = null;
        }

        // Inicia grace period
        leaveTimeoutRef.current = setTimeout(() => {
            // Só esconde se não estiver sobre trigger NEM target
            if (!isOverTrigger.current && !isOverTarget.current) {
                setIsHovering(false);
                onHoverEnd?.();
            }
        }, leaveDelay);
    }, [leaveDelay, onHoverEnd]);

    const triggerMouseEnter = useCallback(() => {
        isOverTrigger.current = true;
        handleShow();
    }, [handleShow]);

    const triggerMouseLeave = useCallback(() => {
        isOverTrigger.current = false;
        handleHide();
    }, [handleHide]);

    const targetMouseEnter = useCallback(() => {
        isOverTarget.current = true;
        // Cancela timeout de saída quando entrar no target
        if (leaveTimeoutRef.current) {
            clearTimeout(leaveTimeoutRef.current);
            leaveTimeoutRef.current = null;
        }
    }, []);

    const targetMouseLeave = useCallback(() => {
        isOverTarget.current = false;
        handleHide();
    }, [handleHide]);

    const close = useCallback(() => {
        if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
        if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
        isOverTrigger.current = false;
        isOverTarget.current = false;
        setIsHovering(false);
        onHoverEnd?.();
    }, [onHoverEnd]);

    return {
        isHovering,
        triggerProps: {
            onMouseEnter: triggerMouseEnter,
            onMouseLeave: triggerMouseLeave,
        },
        targetProps: {
            onMouseEnter: targetMouseEnter,
            onMouseLeave: targetMouseLeave,
        },
        close,
    };
}
