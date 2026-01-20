'use client';

import dynamic from 'next/dynamic';

// Re-export types for consumers
export type {
    // Add any exported types from BattleModeModal here if needed
} from './BattleModeModal';

// Loading placeholder - invisible since modal starts hidden
function BattleModalPlaceholder() {
    return null;
}

// Lazy load the actual modal component - framer-motion is heavy
export const LazyBattleModeModal = dynamic(
    () => import('./BattleModeModal').then(mod => ({ default: mod.BattleModeModal })),
    {
        loading: () => <BattleModalPlaceholder />,
        ssr: false, // Modal only shows on client interaction
    }
);

// Default export for convenience
export default LazyBattleModeModal;
