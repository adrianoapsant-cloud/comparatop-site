/**
 * Rate Limiting for Admin Login
 * 
 * Protects against brute-force attacks with:
 * - Sliding window rate limiting
 * - Lockout after excessive failures
 * - IP hashing for privacy
 */

import { createHash } from 'crypto';

// ============================================
// TYPES
// ============================================

interface AttemptRecord {
    attempts: number[];  // timestamps of attempts
    failures: number[];  // timestamps of failures
    lockedUntil: number | null;
}

interface RateLimitResult {
    allowed: boolean;
    reason: 'ok' | 'rate_limited' | 'locked_out';
    retryAfterSec: number | null;
    attemptsRemaining: number;
}

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    // Rate limit: max attempts in window
    MAX_ATTEMPTS: 5,
    ATTEMPT_WINDOW_MS: 10 * 60 * 1000, // 10 minutes

    // Lockout: failures before lockout
    MAX_FAILURES: 10,
    FAILURE_WINDOW_MS: 60 * 60 * 1000, // 60 minutes
    LOCKOUT_DURATION_MS: 15 * 60 * 1000, // 15 minutes

    // Cleanup: remove old records periodically
    CLEANUP_INTERVAL_MS: 5 * 60 * 1000, // 5 minutes
};

// ============================================
// IN-MEMORY STORAGE
// ============================================

const records = new Map<string, AttemptRecord>();
let lastCleanup = Date.now();

// ============================================
// HELPERS
// ============================================

/**
 * Hash an IP address for privacy-preserving logging
 */
export function hashIP(ip: string): string {
    const salt = process.env.ADMIN_LOG_SALT || 'comparatop-default-salt';
    return createHash('sha256').update(ip + salt).digest('hex').substring(0, 16);
}

/**
 * Hash a User-Agent for privacy-preserving logging
 */
export function hashUA(ua: string): string {
    const salt = process.env.ADMIN_LOG_SALT || 'comparatop-default-salt';
    return createHash('sha256').update(ua + salt).digest('hex').substring(0, 12);
}

/**
 * Extract IP from request headers
 */
export function extractIP(headers: Headers): string {
    // Try common headers in order of preference
    const cfIP = headers.get('cf-connecting-ip');
    if (cfIP) return cfIP;

    const xForwarded = headers.get('x-forwarded-for');
    if (xForwarded) {
        // Take the first IP in the chain
        return xForwarded.split(',')[0].trim();
    }

    const xRealIP = headers.get('x-real-ip');
    if (xRealIP) return xRealIP;

    return 'unknown';
}

/**
 * Timing-safe string comparison to prevent timing attacks
 */
export function timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) {
        // Still do the comparison to maintain constant time
        const dummy = Buffer.from(a);
        const dummyB = Buffer.from(a); // Compare with itself
        require('crypto').timingSafeEqual(dummy, dummyB);
        return false;
    }

    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    return require('crypto').timingSafeEqual(bufA, bufB);
}

/**
 * Cleanup old records to prevent memory leaks
 */
function cleanup(): void {
    const now = Date.now();

    if (now - lastCleanup < CONFIG.CLEANUP_INTERVAL_MS) {
        return;
    }

    lastCleanup = now;
    const cutoff = now - CONFIG.FAILURE_WINDOW_MS;

    for (const [key, record] of records.entries()) {
        // Remove if no recent activity and not locked
        const hasRecentAttempts = record.attempts.some(t => t > cutoff);
        const hasRecentFailures = record.failures.some(t => t > cutoff);
        const isLocked = record.lockedUntil && record.lockedUntil > now;

        if (!hasRecentAttempts && !hasRecentFailures && !isLocked) {
            records.delete(key);
        }
    }
}

// ============================================
// MAIN FUNCTIONS
// ============================================

/**
 * Check if a login attempt should be allowed
 */
export function checkRateLimit(ipHash: string): RateLimitResult {
    cleanup();

    const now = Date.now();
    let record = records.get(ipHash);

    // Initialize if not exists
    if (!record) {
        record = { attempts: [], failures: [], lockedUntil: null };
        records.set(ipHash, record);
    }

    // Check lockout first
    if (record.lockedUntil && record.lockedUntil > now) {
        const retryAfterSec = Math.ceil((record.lockedUntil - now) / 1000);
        return {
            allowed: false,
            reason: 'locked_out',
            retryAfterSec,
            attemptsRemaining: 0
        };
    } else if (record.lockedUntil) {
        // Lockout expired, reset
        record.lockedUntil = null;
        record.failures = [];
    }

    // Filter to recent attempts only
    const attemptCutoff = now - CONFIG.ATTEMPT_WINDOW_MS;
    record.attempts = record.attempts.filter(t => t > attemptCutoff);

    // Check rate limit
    if (record.attempts.length >= CONFIG.MAX_ATTEMPTS) {
        const oldestAttempt = Math.min(...record.attempts);
        const retryAfterSec = Math.ceil((oldestAttempt + CONFIG.ATTEMPT_WINDOW_MS - now) / 1000);
        return {
            allowed: false,
            reason: 'rate_limited',
            retryAfterSec: Math.max(1, retryAfterSec),
            attemptsRemaining: 0
        };
    }

    // Add this attempt
    record.attempts.push(now);

    return {
        allowed: true,
        reason: 'ok',
        retryAfterSec: null,
        attemptsRemaining: CONFIG.MAX_ATTEMPTS - record.attempts.length
    };
}

/**
 * Record a failed login attempt (call this AFTER password check fails)
 */
export function recordFailure(ipHash: string): void {
    const now = Date.now();
    let record = records.get(ipHash);

    if (!record) {
        record = { attempts: [], failures: [], lockedUntil: null };
        records.set(ipHash, record);
    }

    // Filter to recent failures only
    const failureCutoff = now - CONFIG.FAILURE_WINDOW_MS;
    record.failures = record.failures.filter(t => t > failureCutoff);

    // Add this failure
    record.failures.push(now);

    // Check for lockout
    if (record.failures.length >= CONFIG.MAX_FAILURES) {
        record.lockedUntil = now + CONFIG.LOCKOUT_DURATION_MS;
    }
}

/**
 * Clear failures for an IP (call this on successful login)
 */
export function clearFailures(ipHash: string): void {
    const record = records.get(ipHash);
    if (record) {
        record.failures = [];
        record.lockedUntil = null;
    }
}

/**
 * Get current stats for debugging (only in dev)
 */
export function getStats(): { totalRecords: number; lockedIPs: number } | null {
    if (process.env.NODE_ENV === 'production') {
        return null;
    }

    let lockedIPs = 0;
    const now = Date.now();

    for (const record of records.values()) {
        if (record.lockedUntil && record.lockedUntil > now) {
            lockedIPs++;
        }
    }

    return {
        totalRecords: records.size,
        lockedIPs
    };
}
