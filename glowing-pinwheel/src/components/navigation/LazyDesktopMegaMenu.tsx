'use client';

import dynamic from 'next/dynamic';

// Loading placeholder - invisible since menu starts hidden
function MegaMenuPlaceholder() {
    return null;
}

// Lazy load the mega menu - framer-motion is heavy (~150KB)
export const LazyDesktopMegaMenu = dynamic(
    () => import('./DesktopMegaMenu').then(mod => ({ default: mod.DesktopMegaMenu })),
    {
        loading: () => <MegaMenuPlaceholder />,
        ssr: false, // Menu only shows on client interaction
    }
);

// Default export for convenience
export default LazyDesktopMegaMenu;
