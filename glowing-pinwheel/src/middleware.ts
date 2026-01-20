import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for ComparaTop
 * 
 * Implements:
 * 1. AI Bot blocking for internal routes
 * 2. Admin/DEV route protection
 * 3. Security headers for internal routes
 * 4. TDM-Reservation headers for content pages
 */

const ADMIN_COOKIE_NAME = 'admin_session';

// ============================================
// AI BOT DETECTION (inline to avoid import issues in edge)
// ============================================

const AI_BOT_PATTERNS = [
    'gptbot', 'chatgpt-user', 'chatgpt', 'openai',
    'google-extended', 'googleother',
    'claudebot', 'claude-web', 'anthropic-ai', 'anthropic',
    'perplexitybot', 'perplexity', 'you.com', 'youbot',
    'ccbot', 'bytespider', 'amazonbot', 'meta-externalagent',
    'facebookexternalhit', 'diffbot', 'cohere-ai', 'ai2bot',
    'omgilibot', 'applebot-extended',
];

function isAIBot(userAgent: string | null): boolean {
    if (!userAgent) return false;
    const ua = userAgent.toLowerCase();
    return AI_BOT_PATTERNS.some(pattern => ua.includes(pattern));
}

// ============================================
// INTERNAL ROUTES (inline)
// ============================================

const INTERNAL_PREFIXES = ['/admin', '/dev', '/api/immunity', '/api/supabase', '/api/admin'];

function isInternalPath(pathname: string): boolean {
    return INTERNAL_PREFIXES.some(prefix => pathname.startsWith(prefix));
}

// ============================================
// MIDDLEWARE
// ============================================

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const userAgent = request.headers.get('user-agent');

    // ==============================================
    // 1. Block AI Bots on Internal Routes (return 404)
    // ==============================================

    if (isInternalPath(pathname) && isAIBot(userAgent)) {
        // Return 404 to hide existence of route
        return new NextResponse('Not Found', {
            status: 404,
            headers: {
                'Content-Type': 'text/plain',
                'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
                'Cache-Control': 'no-store',
            }
        });
    }

    // ==============================================
    // 2. Block /dev/* in Production
    // ==============================================

    if (pathname.startsWith('/dev') && process.env.NODE_ENV === 'production') {
        return new NextResponse('Not Found', {
            status: 404,
            headers: {
                'Content-Type': 'text/plain',
                'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
                'Cache-Control': 'no-store',
            }
        });
    }

    // ==============================================
    // 3. Admin/DEV Route Protection
    // ==============================================

    if (pathname.startsWith('/admin') || pathname.startsWith('/dev')) {
        // Allow access to login page
        const isLoginPage = pathname === '/admin/login' || pathname === '/admin/login/';

        if (!isLoginPage) {
            // Check for admin session cookie
            const adminCookie = request.cookies.get(ADMIN_COOKIE_NAME);

            if (!adminCookie?.value) {
                // For /admin without login: redirect to login
                if (pathname.startsWith('/admin')) {
                    const loginUrl = new URL('/admin/login', request.url);
                    return NextResponse.redirect(loginUrl);
                }
                // For /dev without login: return 404 (hide existence)
                return new NextResponse('Not Found', {
                    status: 404,
                    headers: {
                        'Content-Type': 'text/plain',
                        'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
                        'Cache-Control': 'no-store',
                    }
                });
            }
        }
    }

    // Create response
    const response = NextResponse.next();

    // ==============================================
    // 4. Add Security Headers for Internal Routes
    // ==============================================

    if (isInternalPath(pathname)) {
        response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, noimageindex');
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');
    }

    // ==============================================
    // 5. TDM Headers for Content Pages
    // ==============================================

    if (
        pathname.startsWith('/produto/') ||
        pathname.startsWith('/analises/') ||
        pathname.startsWith('/comparar/') ||
        pathname.startsWith('/categoria/') ||
        pathname.includes('/metodologia')
    ) {
        response.headers.set('TDM-Reservation', '1');
        response.headers.set('TDM-Policy', 'https://comparatop.com.br/licenciamento-ia');
        response.headers.set('X-Robots-Tag', 'noai, noimageai');
    }

    // ==============================================
    // 6. General Security Headers
    // ==============================================

    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Content-Security-Policy', "frame-ancestors 'self' http://localhost:3000 http://localhost:3001");

    return response;
}

// Configure which paths trigger the middleware
export const config = {
    matcher: [
        // Match all paths except static files
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
