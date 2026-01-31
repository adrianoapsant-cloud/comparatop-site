'use client';

/**
 * SimplifiedPDP - Score Section
 * Renderiza radar chart visual (DNA do Produto)
 * 
 * SIMPLIFIED: Uses data.dna from mockData when available.
 * Falls back to extractDNAFromProduct only if mockData doesn't have DNA.
 */

import React, { useMemo } from 'react';
import { PDPDataContract } from '../hooks/usePDPData';
import { LazyProductRadarChart, extractDNAFromProduct } from '@/components/LazyProductRadarChart';

interface ScoreSectionProps {
    data: PDPDataContract;
}

export function ScoreSection({ data }: ScoreSectionProps) {
    const { product, dna } = data;

    // PRIORITY 1: Use data.dna from mockData (simple, easy to replicate)
    // PRIORITY 2: Fall back to extractDNAFromProduct for products without mockData
    const radarData = useMemo(() => {
        // If we have DNA from mockData, use it directly (simple format)
        if (dna && dna.length > 0) {
            return dna.map(d => ({
                dimension: d.name,
                score: d.score,
                fullMark: 10,
                reason: d.tooltip,
            }));
        }

        // Fallback: use complex extraction (for products without mockData)
        return extractDNAFromProduct(product);
    }, [dna, product]);

    // If no valid data, don't render
    if (radarData.length === 0) {
        if (process.env.NODE_ENV === 'development') {
            console.debug('[ScoreSection] Hidden: no radarData for', product.id);
        }
        return null;
    }

    return (
        <section className="pdp-scores py-8">
            {/* Radar Chart - DNA do Produto */}
            <LazyProductRadarChart
                productName={product.shortName || product.name}
                data={radarData}
            />
        </section>
    );
}

export default ScoreSection;


