/**
 * Alert Monitor Service
 * 
 * The "Vigilante" - Automated monitoring of price and TCO alerts.
 * Designed to run as a daily cron job.
 */

import { getSupabaseAdminSafe } from '@/lib/supabase/server';
import { sendSmartAlert } from '@/lib/email/client';
import type { SmartAlertRow } from '@/types/db';

// ============================================
// TYPES
// ============================================

export interface AlertCheckResult {
    alertId: string;
    email: string;
    productSku: string;
    alertType: 'PRICE' | 'SMART_VALUE';
    triggered: boolean;
    emailSent?: boolean;
    reason?: string;
    currentPrice?: number;
    targetPrice?: number;
    currentTco?: number;
    targetTco?: number;
    previousPrice?: number;
}

export interface AlertMonitorReport {
    timestamp: string;
    totalAlerts: number;
    triggeredCount: number;
    emailsSent: number;
    failedCount: number;
    results: AlertCheckResult[];
    errors: string[];
}

// ============================================
// MOCK DATA (for testing without real crawler)
// ============================================

/**
 * Mock current prices for testing alert triggers.
 * In production, this would be replaced by real price fetching.
 */
export function mockCurrentPrices(): Map<string, number> {
    const prices = new Map<string, number>();

    // Simulate price changes - some lower, some higher
    const products = [
        { sku: 'ROBOROCK-S8-PRO-ULTRA', basePrice: 7499, variation: -0.15 },  // 15% drop
        { sku: 'ROBOROCK-QREVO-CURV', basePrice: 5999, variation: -0.08 },    // 8% drop
        { sku: 'ROBOROCK-S8-MAXV-ULTRA', basePrice: 8999, variation: 0.05 },  // 5% increase
        { sku: 'DREAME-X40-ULTRA', basePrice: 7299, variation: -0.20 },       // 20% drop!
        { sku: 'DREAME-L20-ULTRA', basePrice: 5499, variation: 0.02 },        // 2% increase
        { sku: 'XIAOMI-X10-PLUS', basePrice: 2799, variation: -0.10 },        // 10% drop
        { sku: 'ECOVACS-X2-OMNI', basePrice: 6499, variation: -0.05 },        // 5% drop
    ];

    products.forEach(p => {
        const currentPrice = Math.round(p.basePrice * (1 + p.variation));
        prices.set(p.sku, currentPrice);
    });

    // Add some random variation for unknown products
    return prices;
}

/**
 * Get mock price for a product SKU.
 * Returns a randomized price if SKU not in mock data.
 */
function getMockPrice(sku: string, mockPrices: Map<string, number>): number {
    if (mockPrices.has(sku)) {
        return mockPrices.get(sku)!;
    }
    // Random price between 1000 and 10000 for unknown products
    return Math.round(1000 + Math.random() * 9000);
}

/**
 * Get energy rate for a state
 */
async function getEnergyRate(
    supabase: NonNullable<ReturnType<typeof getSupabaseAdminSafe>>,
    stateCode: string
): Promise<number> {
    const { data } = await supabase
        .from('energy_rates')
        .select('rate_kwh')
        .eq('state_code', stateCode)
        .single();

    return data?.rate_kwh ?? 0.85; // Default SP rate
}

/**
 * Simple TCO calculation for alerts (server-side version)
 * Uses simplified formula to avoid importing heavy client code
 */
function calculateSimpleTco(
    price: number,
    energyRate: number,
    energyKwhMonth: number = 30, // Default consumption
    years: number = 5
): number {
    const monthlyEnergyCost = energyKwhMonth * energyRate;
    const totalEnergyCost = monthlyEnergyCost * 12 * years;
    const maintenanceCost = price * 0.02 * years; // 2% annual maintenance

    return Math.round(price + totalEnergyCost + maintenanceCost);
}

// ============================================
// MAIN SERVICE
// ============================================

/**
 * Check all active alerts and trigger those meeting conditions.
 * 
 * This is the "Vigilante" - runs daily to check if:
 * - PRICE alerts: current price <= target price
 * - SMART_VALUE alerts: current TCO <= target TCO
 * 
 * @param useMockPrices Whether to use mock prices (for testing)
 * @returns Detailed report of all checks and triggers
 */
export async function checkActiveAlerts(
    useMockPrices: boolean = true
): Promise<AlertMonitorReport> {
    const report: AlertMonitorReport = {
        timestamp: new Date().toISOString(),
        totalAlerts: 0,
        triggeredCount: 0,
        emailsSent: 0,
        failedCount: 0,
        results: [],
        errors: [],
    };

    const supabase = getSupabaseAdminSafe();
    if (!supabase) {
        report.errors.push('Supabase not configured');
        return report;
    }

    // Get mock prices for testing
    const mockPrices = useMockPrices ? mockCurrentPrices() : new Map();

    try {
        // 1. Fetch all active alerts
        const { data: alerts, error } = await supabase
            .from('smart_alerts')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: true });

        if (error) {
            report.errors.push(`Failed to fetch alerts: ${error.message}`);
            return report;
        }

        if (!alerts || alerts.length === 0) {
            return report;
        }

        report.totalAlerts = alerts.length;

        // 2. Process each alert
        for (const alert of alerts as SmartAlertRow[]) {
            const result: AlertCheckResult = {
                alertId: alert.id,
                email: alert.user_email,
                productSku: alert.product_sku,
                alertType: alert.alert_type,
                triggered: false,
            };

            try {
                // Get current price
                const currentPrice = getMockPrice(alert.product_sku, mockPrices);
                result.currentPrice = currentPrice;

                if (alert.alert_type === 'PRICE') {
                    // PRICE ALERT: Check if current price <= target
                    result.targetPrice = alert.target_price ?? 0;

                    if (currentPrice <= result.targetPrice) {
                        result.triggered = true;
                        result.reason = `Preço caiu para R$ ${currentPrice} (alvo: R$ ${result.targetPrice})`;
                    }

                } else if (alert.alert_type === 'SMART_VALUE') {
                    // SMART VALUE ALERT: Recalculate TCO and compare
                    const energyRate = await getEnergyRate(supabase, alert.state_code);
                    const currentTco = calculateSimpleTco(currentPrice, energyRate);

                    result.currentTco = currentTco;
                    result.targetTco = alert.target_tco ?? alert.current_tco_at_signup ?? 0;

                    if (currentTco <= result.targetTco) {
                        result.triggered = true;
                        result.reason = `TCO caiu para R$ ${currentTco} (alvo: R$ ${result.targetTco})`;
                    }
                }

                // 3. If triggered, mark as triggered in database and send email
                if (result.triggered) {
                    report.triggeredCount++;

                    // Calculate price drop percentage
                    const previousPrice = alert.alert_type === 'PRICE'
                        ? (result.targetPrice || 0) * 1.1  // Estimate 10% higher
                        : (result.targetTco || 0) * 1.1;
                    const priceDropPercent = Math.round(
                        ((previousPrice - (result.currentPrice || 0)) / previousPrice) * 100
                    );

                    result.previousPrice = previousPrice;

                    // Update database
                    await supabase
                        .from('smart_alerts')
                        .update({
                            is_active: false,
                            triggered_at: new Date().toISOString(),
                            triggered_price: result.currentPrice,
                        })
                        .eq('id', alert.id);

                    // Send email notification
                    try {
                        const emailResult = await sendSmartAlert({
                            email: alert.user_email,
                            productName: alert.product_sku.replace(/-/g, ' '),
                            productSku: alert.product_sku,
                            productUrl: `https://comparatop.com.br/produto/${alert.product_sku.toLowerCase()}?display=table`,
                            alertType: alert.alert_type,
                            previousPrice: previousPrice,
                            currentPrice: result.currentPrice || 0,
                            priceDropPercent,
                            previousTco: result.targetTco,
                            currentTco: result.currentTco,
                            projectedSavings5Years: result.targetTco ? (result.targetTco - (result.currentTco || 0)) : undefined,
                            stateCode: alert.state_code,
                        });

                        result.emailSent = emailResult.success;
                        if (emailResult.success) {
                            report.emailsSent++;
                        }
                    } catch (emailErr) {
                        console.error(`[AlertMonitor] Email failed for ${alert.user_email}:`, emailErr);
                        result.emailSent = false;
                    }

                    console.log(`[AlertMonitor] TRIGGERED: ${alert.user_email} - ${alert.product_sku} (email: ${result.emailSent ? 'sent' : 'failed'})`);
                }

            } catch (err) {
                report.failedCount++;
                result.reason = `Error: ${err instanceof Error ? err.message : 'Unknown error'}`;
                report.errors.push(`Alert ${alert.id}: ${result.reason}`);
            }

            report.results.push(result);
        }

    } catch (err) {
        report.errors.push(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown'}`);
    }

    return report;
}

/**
 * Get summary statistics for active alerts
 */
export async function getAlertStats(): Promise<{
    activeAlerts: number;
    priceAlerts: number;
    smartValueAlerts: number;
}> {
    const supabase = getSupabaseAdminSafe();
    if (!supabase) {
        return { activeAlerts: 0, priceAlerts: 0, smartValueAlerts: 0 };
    }

    const { data } = await supabase
        .from('smart_alerts')
        .select('alert_type')
        .eq('is_active', true);

    if (!data) {
        return { activeAlerts: 0, priceAlerts: 0, smartValueAlerts: 0 };
    }

    return {
        activeAlerts: data.length,
        priceAlerts: data.filter(a => a.alert_type === 'PRICE').length,
        smartValueAlerts: data.filter(a => a.alert_type === 'SMART_VALUE').length,
    };
}
