'use client';

/**
 * Comparison Table Skeleton
 * 
 * Optimistic UI skeleton shown immediately after voice/text input
 * while waiting for AI response. Uses Tailwind animate-pulse.
 */

interface ComparisonTableSkeletonProps {
    /** Product names being compared (for display) */
    productNames?: string[];
    /** Number of product columns to show */
    columns?: 2 | 3;
}

export function ComparisonTableSkeleton({
    productNames = ['Produto 1', 'Produto 2'],
    columns = 2,
}: ComparisonTableSkeletonProps) {
    return (
        <div className="w-full border border-gray-200 rounded-xl overflow-hidden animate-in fade-in duration-200">
            {/* Header Skeleton */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-white/30 rounded animate-pulse" />
                    <div className="h-5 bg-white/30 rounded w-48 animate-pulse" />
                </div>
            </div>

            {/* Products Grid Skeleton */}
            <div className={`grid grid-cols-1 md:grid-cols-${columns} divide-y md:divide-y-0 md:divide-x divide-gray-200`}>
                {productNames.slice(0, columns).map((name, idx) => (
                    <div key={idx} className="p-4 space-y-4">
                        {/* Product Header */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <div className="h-5 bg-gray-200 rounded w-36 animate-pulse" />
                                <div className="h-3 bg-gray-100 rounded w-20 animate-pulse" />
                            </div>
                            <div className="text-right space-y-1">
                                <div className="h-8 bg-purple-100 rounded w-12 animate-pulse" />
                                <div className="h-3 bg-gray-100 rounded w-10 animate-pulse" />
                            </div>
                        </div>

                        {/* Price Skeleton */}
                        <div className="h-6 bg-green-50 rounded w-28 animate-pulse" />

                        {/* Specs Skeleton - 4 rows */}
                        <div className="space-y-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex justify-between">
                                    <div className="h-4 bg-gray-100 rounded w-20 animate-pulse" />
                                    <div className="h-4 bg-gray-200 rounded w-28 animate-pulse" />
                                </div>
                            ))}
                        </div>

                        {/* Pros/Cons Skeleton */}
                        <div className="flex gap-4">
                            <div className="flex-1 space-y-1">
                                <div className="h-3 bg-green-100 rounded w-16 animate-pulse" />
                                <div className="h-3 bg-gray-100 rounded w-full animate-pulse" />
                                <div className="h-3 bg-gray-100 rounded w-3/4 animate-pulse" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="h-3 bg-red-100 rounded w-16 animate-pulse" />
                                <div className="h-3 bg-gray-100 rounded w-full animate-pulse" />
                                <div className="h-3 bg-gray-100 rounded w-3/4 animate-pulse" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Winner Banner Skeleton */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 flex justify-center items-center gap-2">
                <div className="h-4 bg-white/30 rounded w-6 animate-pulse" />
                <div className="h-4 bg-white/30 rounded w-32 animate-pulse" />
            </div>

            {/* Loading indicator */}
            <div className="p-3 bg-purple-50 border-t border-purple-100 flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
                <span className="text-sm text-purple-600 font-medium">
                    Analisando {productNames.join(' vs ')}...
                </span>
            </div>
        </div>
    );
}

export default ComparisonTableSkeleton;
