/**
 * IP Allowlist for Production Admin Access
 * 
 * Restricts admin access to specific IPs in production.
 * Disabled by default - must be explicitly enabled via env.
 */

import { hashIP } from './rate-limit';

// ============================================
// CONFIGURATION
// ============================================

/**
 * Check if IP allowlist is enabled
 */
export function isIPAllowlistEnabled(): boolean {
    // Only enabled if explicitly set AND in production
    return (
        process.env.NODE_ENV === 'production' &&
        process.env.ADMIN_IP_ALLOWLIST_ENABLED === 'true' &&
        !!process.env.ADMIN_ALLOWED_IPS
    );
}

/**
 * Get the list of allowed IPs
 */
function getAllowedIPs(): string[] {
    const ips = process.env.ADMIN_ALLOWED_IPS || '';
    return ips.split(',').map(ip => ip.trim()).filter(Boolean);
}

/**
 * Check if an IP is in the allowlist
 */
export function isIPAllowed(ip: string): boolean {
    // If not enabled, all IPs are allowed
    if (!isIPAllowlistEnabled()) {
        return true;
    }

    const allowedIPs = getAllowedIPs();

    // If no IPs configured (but enabled), block all
    if (allowedIPs.length === 0) {
        return false;
    }

    // Check exact match
    return allowedIPs.includes(ip);
}

/**
 * Check IP allowlist and return result with logging info
 */
export function checkIPAllowlist(ip: string): {
    allowed: boolean;
    ipHash: string;
    reason: 'allowlist_disabled' | 'ip_allowed' | 'ip_denied';
} {
    const ipHash = hashIP(ip);

    if (!isIPAllowlistEnabled()) {
        return {
            allowed: true,
            ipHash,
            reason: 'allowlist_disabled'
        };
    }

    const allowed = isIPAllowed(ip);

    return {
        allowed,
        ipHash,
        reason: allowed ? 'ip_allowed' : 'ip_denied'
    };
}
