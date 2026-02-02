// ============================================================================
// CRYSTALLINE DESIGN SYSTEM - Public API
// ============================================================================
// Frosted Glass Light components for Product Listing Page
// ============================================================================

export { HexagonScore } from './HexagonScore';
export { MatchDonut } from './MatchDonut';
export { ProductRowCard } from './ProductRowCard';
export { HybridTableHeader, HYBRID_GRID_COLS } from './HybridTableHeader';
export { SortDropdown, type ActiveSortMetric } from './SortDropdown';
export { MobileSortChips } from './MobileSortChips';
export { FloatingActionBar, SortBottomSheet } from './FloatingActionBar';
export { FilterBottomSheet } from './FilterBottomSheet';
export { AdvancedSortSheet, getSortLabel, isCustomSort } from './AdvancedSortSheet';
export { PriceAlertModal } from './PriceAlertModal';

// Glassmorphism utility classes
export const crystallineClasses = {
    /** Card with frosted glass effect */
    card: 'bg-white/80 backdrop-blur-md border border-white/40 shadow-lg shadow-indigo-500/10 rounded-2xl',
    /** Page backdrop */
    backdrop: 'bg-slate-50',
    /** Hover state for cards */
    cardHover: 'hover:shadow-xl hover:shadow-indigo-500/15 hover:bg-white/90',
} as const;
