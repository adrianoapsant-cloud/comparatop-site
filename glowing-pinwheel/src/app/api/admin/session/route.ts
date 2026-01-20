/**
 * Admin Session API
 * 
 * POST: Login with password → set HttpOnly cookie
 * DELETE: Logout → remove cookie
 * 
 * Security:
 * - Rate limiting (5 attempts/10min)
 * - Lockout after 10 failures
 * - Timing-safe password comparison
 * - IP hashing for privacy in logs
 */

import { NextRequest, NextResponse } from 'next/server';
import {
    validatePassword,
    createAdminToken,
    isAdminAuthConfigured,
    ADMIN_COOKIE_NAME,
    getAdminCookieOptions
} from '@/lib/admin/auth';
import {
    checkRateLimit,
    recordFailure,
    clearFailures,
    extractIP,
    hashIP,
    hashUA,
    timingSafeEqual
} from '@/lib/security/rate-limit';
import { checkIPAllowlist } from '@/lib/security/ip-allowlist';
import { logImmunityEvent } from '@/lib/immunity/ingest';

export const runtime = 'nodejs';

// ============================================
// POST - Login
// ============================================

export async function POST(request: NextRequest) {
    const ip = extractIP(request.headers);
    const ua = request.headers.get('user-agent') || 'unknown';
    const ipHash = hashIP(ip);
    const uaHash = hashUA(ua);
    const ts = new Date().toISOString();

    // Check if auth is configured
    if (!isAdminAuthConfigured()) {
        return NextResponse.json(
            {
                error: 'Admin auth not configured',
                message: 'Please set ADMIN_DASH_PASSWORD and ADMIN_DASH_COOKIE_SECRET in .env.local'
            },
            { status: 503 }
        );
    }

    // Check IP allowlist (production only)
    const ipCheck = checkIPAllowlist(ip);
    if (!ipCheck.allowed) {
        // Log denied access (no IP in clear)
        logImmunityEvent({
            type: 'admin_access_denied',
            ts,
            ipHash,
            uaHash,
            reason: 'ip_not_allowed'
        });

        // Return 403 without revealing reason
        return NextResponse.json(
            { error: 'Access denied' },
            { status: 403 }
        );
    }

    // Check rate limit BEFORE processing password
    const rateCheck = checkRateLimit(ipHash);

    if (!rateCheck.allowed) {
        // Log rate limited/locked out attempt
        logImmunityEvent({
            type: 'admin_login',
            ts,
            success: false,
            rateLimited: rateCheck.reason === 'rate_limited',
            lockout: rateCheck.reason === 'locked_out',
            ipHash,
            uaHash,
            retryAfterSec: rateCheck.retryAfterSec
        });

        const message = rateCheck.reason === 'locked_out'
            ? 'Bloqueado temporariamente por segurança.'
            : `Muitas tentativas. Tente novamente em ${rateCheck.retryAfterSec}s.`;

        return NextResponse.json(
            {
                error: message,
                retryAfterSec: rateCheck.retryAfterSec
            },
            {
                status: 429,
                headers: rateCheck.retryAfterSec
                    ? { 'Retry-After': String(rateCheck.retryAfterSec) }
                    : {}
            }
        );
    }

    try {
        const body = await request.json();
        const { password } = body;

        if (!password || typeof password !== 'string') {
            return NextResponse.json(
                { error: 'Password required' },
                { status: 400 }
            );
        }

        // Validate password using timing-safe comparison
        const expectedPassword = process.env.ADMIN_DASH_PASSWORD || '';
        const isValid = timingSafeEqual(password, expectedPassword);

        if (!isValid) {
            // Record failure for rate limiting
            recordFailure(ipHash);

            // Log failed attempt (no password in logs!)
            logImmunityEvent({
                type: 'admin_login',
                ts,
                success: false,
                rateLimited: false,
                lockout: false,
                ipHash,
                uaHash,
                attemptsRemaining: rateCheck.attemptsRemaining - 1
            });

            // Add small delay to further slow brute force
            await new Promise(resolve => setTimeout(resolve, 500));

            return NextResponse.json(
                { error: 'Senha incorreta' },
                { status: 401 }
            );
        }

        // Success! Clear failures and create session
        clearFailures(ipHash);

        // Create token and set cookie
        const token = await createAdminToken();
        const cookieOptions = getAdminCookieOptions();

        const response = NextResponse.json({ success: true });
        response.cookies.set(ADMIN_COOKIE_NAME, token, cookieOptions);

        // Log successful login
        logImmunityEvent({
            type: 'admin_login',
            ts,
            success: true,
            rateLimited: false,
            lockout: false,
            ipHash,
            uaHash
        });

        return response;

    } catch (error) {
        console.error('[admin/session] Login error:', error);
        return NextResponse.json(
            { error: 'Login failed' },
            { status: 500 }
        );
    }
}

// ============================================
// DELETE - Logout
// ============================================

export async function DELETE(request: NextRequest) {
    const ip = extractIP(request.headers);
    const ipHash = hashIP(ip);
    const ts = new Date().toISOString();

    const response = NextResponse.json({ success: true });

    // Remove cookie by setting it with immediate expiration
    response.cookies.set(ADMIN_COOKIE_NAME, '', {
        httpOnly: true,
        path: '/',
        maxAge: 0
    });

    // Log logout
    logImmunityEvent({
        type: 'admin_logout',
        ts,
        ipHash
    });

    return response;
}
