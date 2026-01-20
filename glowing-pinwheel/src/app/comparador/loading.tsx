// ============================================================================
// COMPARADOR - Loading Skeleton
// ============================================================================
// Skeleton UI shown while the page is loading
// ============================================================================

export default function ComparadorLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header Skeleton */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    {/* Title */}
                    <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse mb-2" />
                    <div className="h-4 w-96 bg-gray-200 rounded-lg animate-pulse mb-4" />

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <div className="h-12 w-64 bg-gray-200 rounded-xl animate-pulse" />
                        <div className="h-12 flex-1 max-w-md bg-gray-200 rounded-xl animate-pulse" />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Hero Section Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Chart placeholder */}
                    <div className="lg:col-span-2 h-[400px] bg-white rounded-2xl border border-gray-200 animate-pulse" />

                    {/* Winner cards */}
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-28 bg-white rounded-2xl border border-gray-200 animate-pulse"
                            />
                        ))}
                    </div>
                </div>

                {/* Table Skeleton */}
                <div className="bg-white rounded-2xl border border-gray-200 p-4">
                    {/* Search bar */}
                    <div className="h-12 w-full max-w-md bg-gray-200 rounded-xl animate-pulse mb-6" />

                    {/* Table rows */}
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="h-16 bg-gray-100 rounded-xl animate-pulse"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
