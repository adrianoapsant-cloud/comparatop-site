'use server';

/**
 * @file bandit-reward.ts
 * @description Server Actions for MAB Conversion Tracking
 * 
 * These actions are called when a user completes a conversion event
 * (e.g., clicks the buy button, adds to cart, etc.)
 * 
 * @example
 * // In SmartCTA component:
 * import { trackConversion } from '@/app/actions/bandit-reward';
 * onClick={() => trackConversion(currentLayoutId)}
 */

import banditService from '@/lib/mab/bandit-service';

// ============================================================================
// SERVER ACTIONS
// ============================================================================

/**
 * Track a conversion event for a specific layout variant
 * Call this when a user performs a conversion action (CTA click, purchase, etc.)
 * 
 * @param layoutId - The ID of the layout variant that generated the conversion
 */
export async function trackConversion(layoutId: string): Promise<{ success: boolean }> {
    try {
        await banditService.updateArmStats(layoutId, 'conversion');

        console.log('[MAB] Conversion tracked:', {
            layoutId,
            timestamp: new Date().toISOString(),
        });

        return { success: true };
    } catch (error) {
        console.error('[MAB] Failed to track conversion:', error);
        return { success: false };
    }
}

/**
 * Track an impression event for a specific layout variant
 * Call this when a layout is displayed to a user
 * Note: Usually called from the page component, not from client
 * 
 * @param layoutId - The ID of the layout variant that was shown
 */
export async function trackImpression(layoutId: string): Promise<{ success: boolean }> {
    try {
        await banditService.updateArmStats(layoutId, 'impression');

        console.log('[MAB] Impression tracked:', {
            layoutId,
            timestamp: new Date().toISOString(),
        });

        return { success: true };
    } catch (error) {
        console.error('[MAB] Failed to track impression:', error);
        return { success: false };
    }
}

/**
 * Get performance summary for all layout variants
 * Useful for admin dashboards and debugging
 */
export async function getMABPerformance() {
    try {
        const summary = await banditService.getPerformanceSummary();
        return {
            success: true,
            data: summary,
        };
    } catch (error) {
        console.error('[MAB] Failed to get performance:', error);
        return {
            success: false,
            data: null,
        };
    }
}
