/**
 * AI Bot Detection and Blocking
 * 
 * Identifies and blocks known AI crawlers/bots from accessing internal routes.
 * Returns 404 (not 403) to hide existence of routes.
 */

// Known AI bot user agent patterns (case-insensitive matching)
const AI_BOT_PATTERNS = [
    // OpenAI
    'gptbot',
    'chatgpt-user',
    'chatgpt',
    'openai',

    // Google AI
    'google-extended',
    'googleother',

    // Anthropic
    'claudebot',
    'claude-web',
    'anthropic-ai',
    'anthropic',

    // Other AI services
    'perplexitybot',
    'perplexity',
    'you.com',
    'youbot',

    // Data scrapers often used for AI training
    'ccbot',           // Common Crawl
    'bytespider',      // ByteDance/TikTok
    'amazonbot',       // Amazon
    'meta-externalagent', // Meta/Facebook
    'facebookexternalhit',

    // Generic AI/ML crawlers
    'diffbot',
    'cohere-ai',
    'ai2bot',
    'omgilibot',
    'applebot-extended',
];

// Additional suspicious patterns
const SUSPICIOUS_PATTERNS = [
    'bot',
    'crawler',
    'spider',
    'scraper',
];

/**
 * Check if User-Agent belongs to a known AI bot
 */
export function isAIBot(userAgent: string | null): boolean {
    if (!userAgent) return false;

    const ua = userAgent.toLowerCase();

    // Check against known AI bot patterns
    for (const pattern of AI_BOT_PATTERNS) {
        if (ua.includes(pattern)) {
            return true;
        }
    }

    return false;
}

/**
 * Check if User-Agent is any kind of bot (for stricter blocking)
 */
export function isAnyBot(userAgent: string | null): boolean {
    if (!userAgent) return false;

    const ua = userAgent.toLowerCase();

    // First check AI bots
    if (isAIBot(userAgent)) return true;

    // Check general bot patterns
    for (const pattern of SUSPICIOUS_PATTERNS) {
        if (ua.includes(pattern)) {
            return true;
        }
    }

    return false;
}

/**
 * Get list of AI bot names for robots.txt
 */
export function getAIBotNames(): string[] {
    return [
        'GPTBot',
        'ChatGPT-User',
        'Google-Extended',
        'CCBot',
        'ClaudeBot',
        'Claude-Web',
        'anthropic-ai',
        'PerplexityBot',
        'Bytespider',
        'Amazonbot',
        'Meta-ExternalAgent',
        'FacebookExternalHit',
        'Diffbot',
        'Cohere-ai',
        'AI2Bot',
        'Omgilibot',
        'Applebot-Extended',
        'YouBot',
    ];
}
