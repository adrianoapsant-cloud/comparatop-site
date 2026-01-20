// ===========================================================
// TYPES - Voice Navigation Actions
// ===========================================================

/**
 * Possible actions the AI can take based on voice input
 * 
 * Navigation actions: Navigate to specific pages
 * Agentic actions: Redirect to Assistant with initial prompt
 */
export type VoiceAction =
    | { type: 'NAVIGATE_PRODUCT'; productId: string; productName: string }
    | { type: 'NAVIGATE_CATEGORY'; categoryId: string; categoryName: string }
    | { type: 'COMPARE_PRODUCTS'; productIds: string[]; productNames: string[] }
    | { type: 'SEARCH'; query: string }
    | { type: 'SHOW_ASSISTANT'; message: string }
    | { type: 'REDIRECT_TO_ASSISTANT'; initialPrompt: string; reason: 'comparison' | 'price_alert' | 'complex_question' }
    | { type: 'UNKNOWN'; message: string };

/**
 * Check if an action is "agentic" (requires AI assistant tools)
 */
export function isAgenticAction(action: VoiceAction): boolean {
    return action.type === 'REDIRECT_TO_ASSISTANT' || action.type === 'SHOW_ASSISTANT';
}

/**
 * Helper function to convert VoiceAction to navigation URL
 */
export function getActionUrl(action: VoiceAction): string | null {
    switch (action.type) {
        case 'NAVIGATE_PRODUCT':
            return `/produto/${action.productId}`;

        case 'NAVIGATE_CATEGORY':
            const categoryPaths: Record<string, string> = {
                'tv': '/categorias/smart-tvs',
                'fridge': '/categorias/geladeiras',
                'air_conditioner': '/categorias/ar-condicionado',
            };
            return categoryPaths[action.categoryId] || `/categorias/${action.categoryId}`;

        case 'COMPARE_PRODUCTS':
            // Comparisons now go to assistant for Generative UI
            return `/assistente?q=${encodeURIComponent(`Compare ${action.productNames.join(' vs ')}`)}`;

        case 'SEARCH':
            return `/busca?q=${encodeURIComponent(action.query)}`;

        case 'SHOW_ASSISTANT':
            return `/assistente?q=${encodeURIComponent(action.message)}`;

        case 'REDIRECT_TO_ASSISTANT':
            return `/assistente?q=${encodeURIComponent(action.initialPrompt)}`;

        default:
            return null;
    }
}
