/**
 * Internal Routes Configuration
 * 
 * Define which routes should be protected from:
 * - Search engine indexing
 * - AI bot access
 * - Unauthorized access
 */

// Routes that require admin auth and should be hidden from all bots
export const INTERNAL_PATH_PREFIXES = [
    '/admin',
    '/dev',
    '/api/immunity',
    '/api/supabase',
    '/api/admin',
];

// Exact paths that are internal (not for public consumption)
export const INTERNAL_EXACT_PATHS: string[] = [
    // Add any specific internal endpoints here
    // '/api/energy-rates', // Keep public if used by frontend
    // '/api/smart-alerts', // Keep public if used by frontend
];

/**
 * Check if a path is internal (should be protected)
 */
export function isInternalPath(pathname: string): boolean {
    // Check prefix matches
    for (const prefix of INTERNAL_PATH_PREFIXES) {
        if (pathname.startsWith(prefix)) {
            return true;
        }
    }

    // Check exact matches
    if (INTERNAL_EXACT_PATHS.includes(pathname)) {
        return true;
    }

    return false;
}

/**
 * Check if path requires admin authentication
 */
export function requiresAdminAuth(pathname: string): boolean {
    return pathname.startsWith('/admin') || pathname.startsWith('/dev');
}

/**
 * Check if path is an internal API (needs protection but different auth)
 */
export function isInternalApi(pathname: string): boolean {
    return pathname.startsWith('/api/immunity') ||
        pathname.startsWith('/api/supabase') ||
        pathname.startsWith('/api/admin');
}
