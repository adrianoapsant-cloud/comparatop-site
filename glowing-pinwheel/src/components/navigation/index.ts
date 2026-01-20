/**
 * Navigation Components - Barrel Export
 * 
 * Dual-Track Hybrid Navigation System
 * - Desktop: Full-width Mega Menu with 3 zones
 * - Mobile: Drill-down slide-over navigation
 * 
 * Performance: Using lazy loading for framer-motion heavy components
 */

// Hook
export { useHoverIntent } from './useHoverIntent';

// Desktop (Lazy Loaded - framer-motion loaded on-demand)
export { LazyDesktopMegaMenu as DesktopMegaMenu } from './LazyDesktopMegaMenu';

// Mobile (Lazy Loaded - framer-motion loaded on-demand)
export { LazyMobileMenu as MobileMenu } from './LazyMobileMenu';
export { BottomNav } from './BottomNav';
