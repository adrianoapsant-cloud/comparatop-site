
/**
 * Telegram Notification Client
 * 
 * Sends messages to a configured Telegram chat/channel.
 * Falls back to console logging in development if no API credentials.
 */

// ============================================
// CONFIGURATION
// ============================================

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// ============================================
// TYPES
// ============================================

export interface SendTelegramResult {
    success: boolean;
    mode: 'sent' | 'logged' | 'failed';
    error?: string;
}

// ============================================
// SEND FUNCTIONS
// ============================================

/**
 * Send a message to the configured Telegram chat.
 * 
 * @param message The message text to send. Supports Markdown.
 * @returns Result with success status.
 */
export async function sendTelegramMessage(message: string): Promise<SendTelegramResult> {
    // Dev mode: Log to console if no credentials
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.log('━'.repeat(60));
        console.log('[TELEGRAM DEV MODE] Would send message:');
        console.log(message);
        console.log('━'.repeat(60));

        return {
            success: true,
            mode: 'logged',
        };
    }

    // Production: Send via Telegram API
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        const body = {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'Markdown',
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.description || 'Unknown Telegram API error');
        }

        console.log(`[TELEGRAM] Message sent to ${TELEGRAM_CHAT_ID}`);
        return {
            success: true,
            mode: 'sent',
        };

    } catch (err) {
        console.error('[TELEGRAM] Error:', err);
        return {
            success: false,
            mode: 'failed',
            error: err instanceof Error ? err.message : 'Unknown error',
        };
    }
}
