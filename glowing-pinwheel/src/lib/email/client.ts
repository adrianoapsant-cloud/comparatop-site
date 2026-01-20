/**
 * Email Client
 * 
 * Configures Resend SDK for sending transactional emails.
 * Falls back to console logging in development if no API key.
 */

import { Resend } from 'resend';
import { SmartAlertEmail, type SmartAlertEmailProps } from '@/components/email/smart-alert-template';

// ============================================
// CONFIGURATION
// ============================================

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.EMAIL_FROM || 'alertas@comparatop.com.br';
const FROM_NAME = process.env.EMAIL_FROM_NAME || 'ComparaTop Alertas';

// Resend client (null if not configured)
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

/**
 * Check if email sending is configured
 */
export function isEmailConfigured(): boolean {
    return !!resend;
}

// ============================================
// TYPES
// ============================================

export interface SendSmartAlertParams {
    email: string;
    productName: string;
    productSku: string;
    productUrl: string;
    alertType: 'PRICE' | 'SMART_VALUE';
    previousPrice: number;
    currentPrice: number;
    priceDropPercent: number;
    previousTco?: number;
    currentTco?: number;
    projectedSavings5Years?: number;
    stateCode?: string;
    userName?: string;
}

export interface SendEmailResult {
    success: boolean;
    messageId?: string;
    error?: string;
    mode: 'sent' | 'logged' | 'failed';
}

// ============================================
// SEND FUNCTIONS
// ============================================

/**
 * Send a Smart Alert email notification.
 * 
 * - In production: Sends via Resend
 * - In dev without API key: Logs to console
 * 
 * @param params Alert email parameters
 * @returns Result with success status and message ID
 */
export async function sendSmartAlert(params: SendSmartAlertParams): Promise<SendEmailResult> {
    const {
        email,
        productName,
        productSku,
        productUrl,
        alertType,
        previousPrice,
        currentPrice,
        priceDropPercent,
        previousTco,
        currentTco,
        projectedSavings5Years,
        stateCode = 'SP',
        userName,
    } = params;

    // Build email props
    const emailProps: SmartAlertEmailProps = {
        userName,
        productName,
        productSku,
        productUrl,
        alertType,
        previousPrice,
        currentPrice,
        priceDropPercent,
        previousTco,
        currentTco,
        projectedSavings5Years,
        stateCode,
    };

    // Subject line
    const subjectType = alertType === 'SMART_VALUE' ? 'TCO' : 'Preço';
    const subject = `📉 ${subjectType} do ${productName} caiu ${priceDropPercent}%!`;

    // Dev mode: Log to console if no Resend API key
    if (!resend) {
        console.log('━'.repeat(60));
        console.log('[EMAIL DEV MODE] Would send email:');
        console.log(`  To: ${email}`);
        console.log(`  Subject: ${subject}`);
        console.log(`  Product: ${productName} (${productSku})`);
        console.log(`  Alert Type: ${alertType}`);
        console.log(`  Price: ${previousPrice} → ${currentPrice} (-${priceDropPercent}%)`);
        if (alertType === 'SMART_VALUE') {
            console.log(`  TCO: ${previousTco} → ${currentTco}`);
            console.log(`  Savings (5yr): ${projectedSavings5Years}`);
        }
        console.log(`  URL: ${productUrl}`);
        console.log('━'.repeat(60));

        return {
            success: true,
            mode: 'logged',
            messageId: `dev-${Date.now()}`,
        };
    }

    // Production: Send via Resend
    try {
        const { data, error } = await resend.emails.send({
            from: `${FROM_NAME} <${FROM_EMAIL}>`,
            to: email,
            subject,
            react: SmartAlertEmail(emailProps),
        });

        if (error) {
            console.error('[EMAIL] Resend error:', error);
            return {
                success: false,
                mode: 'failed',
                error: error.message,
            };
        }

        console.log(`[EMAIL] Sent to ${email}: ${data?.id}`);
        return {
            success: true,
            mode: 'sent',
            messageId: data?.id,
        };

    } catch (err) {
        console.error('[EMAIL] Error:', err);
        return {
            success: false,
            mode: 'failed',
            error: err instanceof Error ? err.message : 'Unknown error',
        };
    }
}

/**
 * Send a test email (for debugging)
 */
export async function sendTestEmail(email: string): Promise<SendEmailResult> {
    return sendSmartAlert({
        email,
        productName: 'Roborock S8 Pro Ultra',
        productSku: 'ROBOROCK-S8-PRO-ULTRA',
        productUrl: 'https://comparatop.com.br/produto/roborock-s8-pro-ultra?display=table',
        alertType: 'SMART_VALUE',
        previousPrice: 7499,
        currentPrice: 6374,
        priceDropPercent: 15,
        previousTco: 9500,
        currentTco: 8075,
        projectedSavings5Years: 1425,
        stateCode: 'SP',
        userName: 'Usuário Teste',
    });
}
