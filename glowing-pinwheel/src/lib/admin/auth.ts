/**
 * Admin Hub Authentication
 * 
 * Simple password-based auth with HMAC-signed cookies.
 * For single-admin scenarios - not suitable for multi-user production.
 */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// ============================================
// CONSTANTS
// ============================================

export const ADMIN_COOKIE_NAME = 'admin_session';
export const ADMIN_TTL_HOURS = parseInt(process.env.ADMIN_DASH_TTL_HOURS || '12', 10);

// ============================================
// TOKEN SIGNING (HMAC-SHA256)
// ============================================

/**
 * Sign a payload with HMAC-SHA256
 */
async function signPayload(payload: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    return Buffer.from(signature).toString('base64url');
}

/**
 * Verify HMAC signature
 */
async function verifySignature(payload: string, signature: string, secret: string): Promise<boolean> {
    const expectedSig = await signPayload(payload, secret);
    return expectedSig === signature;
}

// ============================================
// TOKEN CREATION/VERIFICATION
// ============================================

interface TokenPayload {
    iat: number; // issued at (unix timestamp)
    exp: number; // expiration (unix timestamp)
}

/**
 * Create a signed admin token
 */
export async function createAdminToken(): Promise<string> {
    const secret = process.env.ADMIN_DASH_COOKIE_SECRET;
    if (!secret) throw new Error('ADMIN_DASH_COOKIE_SECRET not configured');

    const now = Math.floor(Date.now() / 1000);
    const payload: TokenPayload = {
        iat: now,
        exp: now + (ADMIN_TTL_HOURS * 60 * 60)
    };

    const payloadStr = JSON.stringify(payload);
    const payloadB64 = Buffer.from(payloadStr).toString('base64url');
    const signature = await signPayload(payloadB64, secret);

    return `${payloadB64}.${signature}`;
}

/**
 * Verify and decode an admin token
 */
export async function verifyAdminToken(token: string): Promise<TokenPayload | null> {
    const secret = process.env.ADMIN_DASH_COOKIE_SECRET;
    if (!secret) return null;

    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [payloadB64, signature] = parts;

    // Verify signature
    const isValid = await verifySignature(payloadB64, signature, secret);
    if (!isValid) return null;

    // Decode and check expiration
    try {
        const payloadStr = Buffer.from(payloadB64, 'base64url').toString('utf-8');
        const payload: TokenPayload = JSON.parse(payloadStr);

        const now = Math.floor(Date.now() / 1000);
        if (payload.exp < now) return null; // Expired

        return payload;
    } catch {
        return null;
    }
}

// ============================================
// SESSION MANAGEMENT
// ============================================

/**
 * Validate password against env var
 */
export function validatePassword(password: string): boolean {
    const correctPassword = process.env.ADMIN_DASH_PASSWORD;
    if (!correctPassword) return false;
    return password === correctPassword;
}

/**
 * Check if admin auth is configured
 */
export function isAdminAuthConfigured(): boolean {
    return !!(process.env.ADMIN_DASH_PASSWORD && process.env.ADMIN_DASH_COOKIE_SECRET);
}

/**
 * Get current admin session from cookies (server-side)
 */
export async function getAdminSession(): Promise<TokenPayload | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME);
    if (!sessionCookie?.value) return null;

    return verifyAdminToken(sessionCookie.value);
}

/**
 * Require admin session - redirects to login if not authenticated
 * Use in server components/actions
 */
export async function requireAdmin(): Promise<TokenPayload> {
    const session = await getAdminSession();
    if (!session) {
        redirect('/admin/login');
    }
    return session;
}

/**
 * Get cookie options for setting admin session
 */
export function getAdminCookieOptions() {
    const isProduction = process.env.NODE_ENV === 'production';
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax' as const,
        path: '/',
        maxAge: ADMIN_TTL_HOURS * 60 * 60
    };
}
