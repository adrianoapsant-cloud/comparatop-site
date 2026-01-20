/**
 * @file WebVitalsReporter.tsx
 * @description Cliente leve para reportar Core Web Vitals
 * 
 * Usa a lib `web-vitals` para medir LCP, CLS, INP, FCP, TTFB
 * e envia para `/api/vitals` para logging.
 * 
 * Sem PII - apenas rota + métrica + valor + timestamp.
 */

'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface Metric {
    name: string;
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
    id: string;
}

/**
 * Reporter de Web Vitals - componente leve para layout
 */
export function WebVitalsReporter() {
    const pathname = usePathname();

    useEffect(() => {
        // Importar web-vitals dinamicamente para não bloquear
        import('web-vitals').then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
            const reportMetric = (metric: Metric) => {
                // Log local para debug
                console.log('[WebVitals]', {
                    name: metric.name,
                    value: Math.round(metric.value),
                    rating: metric.rating,
                    path: pathname,
                });

                // Enviar para API (fire and forget)
                if (process.env.NODE_ENV === 'production') {
                    fetch('/api/vitals', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: metric.name,
                            value: Math.round(metric.value),
                            rating: metric.rating,
                            path: pathname,
                            timestamp: Date.now(),
                        }),
                    }).catch(() => {
                        // Silently fail - não bloquear UX por telemetria
                    });
                }
            };

            // Registrar todos os vitals
            onCLS(reportMetric as any);
            onINP(reportMetric as any);
            onLCP(reportMetric as any);
            onFCP(reportMetric as any);
            onTTFB(reportMetric as any);
        }).catch(() => {
            // web-vitals não disponível
        });
    }, [pathname]);

    // Componente invisível
    return null;
}
