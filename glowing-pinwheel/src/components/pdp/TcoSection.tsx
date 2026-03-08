'use client';

import { useState, useEffect } from 'react';
import { TcoUniversalDisplay, type TcoProductData } from '@/components/tco/TcoUniversalDisplay';
import type { Product } from '@/types/category';

interface TcoSectionProps {
    product: Product;
    fallback?: React.ReactNode;
}

interface ApiResponse {
    success: boolean;
    results: TcoProductData[];
}

export function TcoSection({ product, fallback }: TcoSectionProps) {
    const [tcoData, setTcoData] = useState<TcoProductData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasAttempted, setHasAttempted] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchTco = async () => {
            // Avoid re-fetching if we already have data or attempted
            // But if product changes, we should reset. 
            // The dependency array [product.id] ensures this.

            setIsLoading(true);
            setTcoData(null); // Clear previous data

            try {
                // Try to find identifiers
                const query = product.asin || product.name;

                if (!query) {
                    if (isMounted) setIsLoading(false);
                    return;
                }

                const res = await fetch(`/api/tco/lookup?q=${encodeURIComponent(query)}`);
                const data: ApiResponse = await res.json();

                if (isMounted) {
                    if (data.success && data.results.length > 0) {
                        // Use the best match (first one)
                        setTcoData(data.results[0]);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch TCO data', error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                    setHasAttempted(true);
                }
            }
        };

        fetchTco();

        return () => {
            isMounted = false;
        };
    }, [product.id, product.name, product.asin]); // Re-run if product identity changes

    // Loading state: render fallback or skeleton? 
    // To avoid layout shift, we might want to render fallback initially 
    // and then swap? Or render nothing?
    // For now, let's keep it simple: while loading, render fallback (or nothing).
    // Actually, if we are replacing an existing section, we might want to wait.

    if (isLoading) {
        // While loading, we can show a skeleton OR the fallback
        // If we show fallback, users might see a flicker if TCO loads fast.
        // Let's return a simple skeleton wrapper around the fallback area to reserve space?
        // Or just return null/fallback.
        return <>{fallback}</>;
    }

    if (tcoData) {
        return (
            <section className="mt-8 mb-8 animate-in fade-in duration-500">
                <h2 className="font-display text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
                    📊 Análise Forense de Custos (TCO)
                    <span className="text-xs font-normal text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                        Gold Standard
                    </span>
                </h2>
                <TcoUniversalDisplay data={tcoData} />

                {/* Debug info if needed */}
                {/* <p className="text-xs text-gray-400 mt-2">Source: FIPE-Eletro Universal Registry</p> */}
            </section>
        );
    }

    // If no data found, return fallback
    return <>{fallback}</>;
}
