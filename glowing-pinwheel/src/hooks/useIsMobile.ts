'use client';

import { useState, useEffect } from 'react';

/**
 * Hook para detectar se o dispositivo é mobile
 * Breakpoint: 768px (md no Tailwind)
 */
export function useIsMobile(breakpoint: number = 768): boolean {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Função para verificar largura
        const checkMobile = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        // Verificar no mount
        checkMobile();

        // Listener para resize
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [breakpoint]);

    return isMobile;
}

/**
 * Hook para obter configurações de paginação responsivas
 * Desktop: 20 produtos iniciais, +10 por "Load More"
 * Mobile: 12 produtos iniciais, +10 por "Load More"
 */
export function useResponsivePagination() {
    const isMobile = useIsMobile();

    return {
        initialCount: isMobile ? 12 : 20,
        loadMoreCount: 10,
        isMobile,
    };
}
