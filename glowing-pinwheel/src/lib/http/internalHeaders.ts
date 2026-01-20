/**
 * Internal Headers Helper
 * 
 * Adds security headers to prevent indexing, caching, and scraping
 * of internal routes and APIs.
 */

/**
 * Add headers that prevent indexing and caching for internal responses
 */
export function withInternalHeaders(headers: Headers = new Headers()): Headers {
    // Prevent all forms of indexing
    headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, noimageindex');

    // Prevent caching
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');

    // Additional privacy headers
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');

    return headers;
}

/**
 * Create a 404 response for blocked requests (hides existence)
 */
export function createBlockedResponse(): Response {
    const headers = withInternalHeaders(new Headers());
    headers.set('Content-Type', 'text/plain');

    return new Response('Not Found', {
        status: 404,
        headers
    });
}

/**
 * Check if request should be blocked based on environment
 */
export function shouldBlockInProduction(pathname: string): boolean {
    const isProduction = process.env.NODE_ENV === 'production';

    // Block /dev/* entirely in production
    if (isProduction && pathname.startsWith('/dev')) {
        return true;
    }

    return false;
}
