'use client';

import dynamic from 'next/dynamic';

// Loading placeholder - invisible since menu starts hidden
function MobileMenuPlaceholder() {
    return null;
}

// Lazy load the mobile menu - framer-motion is heavy
export const LazyMobileMenu = dynamic(
    () => import('./MobileMenu').then(mod => ({ default: mod.MobileMenu })),
    {
        loading: () => <MobileMenuPlaceholder />,
        ssr: false, // Menu only shows on client interaction
    }
);

// Default export for convenience
export default LazyMobileMenu;
