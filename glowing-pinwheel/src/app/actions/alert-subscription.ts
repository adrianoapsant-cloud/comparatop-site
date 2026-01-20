'use server';

/**
 * Alert Subscription Server Action
 * 
 * Saves price alert subscriptions as Zero-Party Data leads.
 * Currently simulates database save - replace with Vercel KV in production.
 */

// ===========================================================
// TYPES
// ===========================================================

export interface AlertSubscription {
    id: string;
    email: string;
    productName: string;
    productId?: string;
    targetPrice: number | null;
    platform: 'amazon' | 'mercadolivre' | 'shopee' | 'geral';
    alertType: 'DEAL_WATCH' | 'PRICE_TRACKER';
    createdAt: string;
    status: 'active' | 'notified' | 'expired';
}

export interface SaveAlertResult {
    success: boolean;
    alertId?: string;
    error?: string;
}

// ===========================================================
// MOCK DATABASE (Replace with Vercel KV in production)
// ===========================================================

// In production, use:
// import { kv } from '@vercel/kv';

const MOCK_ALERTS_DB: AlertSubscription[] = [];

// ===========================================================
// SERVER ACTION
// ===========================================================

/**
 * Save a price alert subscription (Lead Capture)
 * 
 * This action captures the user's email and intent to monitor a product.
 * Zero-Party Data: User explicitly shares their purchase intent.
 */
export async function saveAlertSubscription(
    email: string,
    productName: string,
    targetPrice: number | null,
    platform: 'amazon' | 'mercadolivre' | 'shopee' | 'geral',
    productId?: string
): Promise<SaveAlertResult> {
    try {
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return { success: false, error: 'E-mail inválido' };
        }

        // Validate product name
        if (!productName || productName.trim().length < 2) {
            return { success: false, error: 'Nome do produto inválido' };
        }

        // Generate alert ID
        const alertId = crypto.randomUUID();

        // Determine alert type based on platform
        const alertType = platform === 'amazon' ? 'DEAL_WATCH' : 'PRICE_TRACKER';

        // Create subscription record
        const subscription: AlertSubscription = {
            id: alertId,
            email: email.toLowerCase().trim(),
            productName: productName.trim(),
            productId: productId || undefined,
            targetPrice,
            platform,
            alertType,
            createdAt: new Date().toISOString(),
            status: 'active',
        };

        // Simulate database delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Log structured data (for analytics/debugging)
        console.log('[LeadCapture] New Alert Subscription:', {
            ...subscription,
            _source: 'price_alert_tool',
            _event: 'lead_captured',
        });

        // Mock: Save to in-memory DB
        MOCK_ALERTS_DB.push(subscription);

        // In production, use Vercel KV:
        // await kv.set(`alert:${alertId}`, subscription);
        // await kv.sadd(`alerts:email:${email}`, alertId);
        // await kv.sadd(`alerts:product:${productId}`, alertId);

        console.log('[LeadCapture] Total alerts in mock DB:', MOCK_ALERTS_DB.length);

        return { success: true, alertId };

    } catch (error) {
        console.error('[LeadCapture] Error saving subscription:', error);
        return {
            success: false,
            error: 'Erro ao salvar alerta. Tente novamente.'
        };
    }
}

/**
 * Get all alerts for an email (for "Meus Alertas" page)
 */
export async function getAlertsByEmail(email: string): Promise<AlertSubscription[]> {
    // In production, fetch from Vercel KV
    return MOCK_ALERTS_DB.filter(a => a.email === email.toLowerCase().trim());
}
