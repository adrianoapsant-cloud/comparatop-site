'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Re-export types for consumers
export type {
    ProductDNAData,
} from './ProductRadarChart';

// Re-export helper functions (these are lightweight, no recharts dependency)
export { generateProductDNA, extractDNAFromProduct } from './ProductRadarChart';

// Loading skeleton for the radar chart
function RadarChartSkeleton() {
    return (
        <section className="py-8">
            <div className="mb-4">
                <h2 className="font-display text-xl font-semibold text-text-primary flex items-center gap-2">
                    🧬 DNA do Produto
                </h2>
                <p className="text-sm text-text-muted mt-1">
                    Carregando análise...
                </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6">
                <div className="h-[320px] md:h-[380px] flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full border-4 border-gray-200 border-dashed animate-pulse" />
                </div>
            </div>
        </section>
    );
}

// Lazy load the actual chart component - recharts is heavy (~400KB)
export const LazyProductRadarChart = dynamic(
    () => import('./ProductRadarChart').then(mod => ({ default: mod.ProductRadarChart })),
    {
        loading: () => <RadarChartSkeleton />,
        ssr: false, // Disable SSR for recharts (it's client-only anyway)
    }
);

// Default export for convenience
export default LazyProductRadarChart;
