'use client';

// ============================================================================
// MUTANT TABLE - Data Table Component
// ============================================================================
// Dual-rendering table: Desktop shows <table>, Mobile shows cards
// Uses CSS-controlled DOM structure to avoid hydration mismatches
// ============================================================================

import { useState, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    SortingState,
    PaginationState,
    Row,
    FilterFn,
} from '@tanstack/react-table';
import { Search, X, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductTcoData, UsagePersona } from '@/types/tco';
import type { ScoreViewMode } from '@/hooks/use-url-state';
import { createColumns } from './columns';
import { MutantCard } from './mutant-card';

// ============================================
// TYPES
// ============================================

interface DataTableProps {
    /** Product data array */
    data: ProductTcoData[];
    /** Current persona for TCO calculation */
    persona: UsagePersona;
    /** Number of years for TCO */
    years?: number;
    /** Score view mode (community stars or technical badge) */
    scoreView?: ScoreViewMode;
    /** Callback when viewing product details */
    onViewDetails?: (productId: string) => void;
    /** Additional class names */
    className?: string;
    /** Show search input */
    showSearch?: boolean;
    /** Empty state message */
    emptyMessage?: string;
}

// ============================================
// GLOBAL FILTER
// ============================================

const globalFilterFn: FilterFn<ProductTcoData> = (
    row: Row<ProductTcoData>,
    columnId: string,
    filterValue: string
): boolean => {
    const searchValue = String(filterValue).toLowerCase();
    const product = row.original;

    // Search in name, brand
    return (
        product.name.toLowerCase().includes(searchValue) ||
        product.brand.toLowerCase().includes(searchValue)
    );
};

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * MutantTable - Dual-rendering data table
 * 
 * Renders differently based on screen size:
 * - Desktop (md+): Traditional table with headers and rows
 * - Mobile (<md): Grid of cards
 * 
 * This approach uses CSS (hidden/block classes) to control visibility,
 * avoiding React hydration mismatches that would occur with JS-based
 * responsive rendering.
 * 
 * @example
 * ```tsx
 * <MutantTable 
 *   data={products}
 *   persona="gamer"
 *   years={5}
 *   onViewDetails={(id) => router.push(`/produto/${id}`)}
 * />
 * ```
 */
export function DataTable({
    data,
    persona,
    years = 5,
    scoreView = 'community',
    onViewDetails,
    className,
    showSearch = true,
    emptyMessage = 'Nenhum produto encontrado',
}: DataTableProps) {
    // Table state
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');

    // Create columns with current config
    const columns = useMemo(
        () => createColumns({ persona, years, scoreView, onViewDetails }),
        [persona, years, scoreView, onViewDetails]
    );

    // Initialize TanStack Table with pagination
    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        globalFilterFn,
    });

    const filteredRows = table.getRowModel().rows;

    return (
        <div className={cn('w-full', className)}>
            {/* Toolbar: Search + Filters */}
            {showSearch && (
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou marca..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className={cn(
                                'w-full pl-10 pr-10 py-2.5 rounded-xl',
                                'border border-gray-200 bg-white',
                                'text-sm text-gray-900 placeholder-gray-400',
                                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                                'transition-all'
                            )}
                        />
                        {globalFilter && (
                            <button
                                onClick={() => setGlobalFilter('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Results count */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-sm text-gray-600">
                        <span>{filteredRows.length}</span>
                        <span className="text-gray-400">produtos</span>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {filteredRows.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">{emptyMessage}</p>
                    {globalFilter && (
                        <button
                            onClick={() => setGlobalFilter('')}
                            className="mt-2 text-sm text-blue-600 hover:underline"
                        >
                            Limpar busca
                        </button>
                    )}
                </div>
            )}

            {/* ================================================================== */}
            {/* DESKTOP VIEW: Traditional Table (hidden on mobile)                */}
            {/* ================================================================== */}
            {filteredRows.length > 0 && (
                <div className="hidden md:block">
                    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
                        <table className="w-full">
                            {/* Table Header */}
                            <thead className="bg-gray-50 border-b border-gray-200">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                className={cn(
                                                    'px-4 py-3 text-left text-sm',
                                                    header.column.getCanSort() && 'cursor-pointer select-none'
                                                )}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>

                            {/* Table Body */}
                            <tbody className="divide-y divide-gray-100">
                                {filteredRows.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="px-4 py-3">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ================================================================== */}
            {/* MOBILE VIEW: Card Grid (hidden on desktop)                        */}
            {/* ================================================================== */}
            {filteredRows.length > 0 && (
                <div className="md:hidden">
                    {/* Mobile Sort Controls */}
                    <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
                        <span className="text-xs font-medium text-gray-500 flex-shrink-0">
                            Ordenar:
                        </span>
                        {[
                            { id: 'price', label: 'Preço' },
                            { id: 'tco', label: 'Custo Total' },
                            { id: 'risk', label: 'Risco' },
                        ].map((option) => {
                            const column = table.getColumn(option.id);
                            const isSorted = column?.getIsSorted();

                            return (
                                <button
                                    key={option.id}
                                    onClick={() => column?.toggleSorting(isSorted === 'asc')}
                                    className={cn(
                                        'flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium',
                                        'transition-colors flex-shrink-0',
                                        isSorted
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    )}
                                >
                                    {option.label}
                                    <ArrowUpDown className="w-3 h-3" />
                                </button>
                            );
                        })}
                    </div>

                    {/* Cards Grid */}
                    <div className="space-y-4">
                        {filteredRows.map((row) => (
                            <MutantCard
                                key={row.id}
                                product={row.original}
                                persona={persona}
                                years={years}
                                onViewDetails={onViewDetails}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Pagination Controls */}
            {(table.getPageCount() > 1 || data.length > 10) && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-200">
                    {/* Page info + Page size selector */}
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Mostrar:</span>
                            <select
                                value={table.getState().pagination.pageSize}
                                onChange={(e) => table.setPageSize(Number(e.target.value))}
                                className="px-2 py-1 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {[10, 20, 50, 100].map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Prev/Next buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className={cn(
                                'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium',
                                table.getCanPreviousPage()
                                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                            )}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Anterior
                        </button>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className={cn(
                                'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium',
                                table.getCanNextPage()
                                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                            )}
                        >
                            Próxima
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ============================================
// EXPORTS
// ============================================

export default DataTable;
export { MutantCard } from './mutant-card';
export { createColumns } from './columns';
