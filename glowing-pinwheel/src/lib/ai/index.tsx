/**
 * AI Registry - createAI Instance
 * 
 * IMPORTANT: This file does NOT have 'use server' directive.
 * This is intentional - createAI returns a React component (AI) that
 * cannot be exported from a 'use server' file.
 * 
 * The actions are imported from ./actions.tsx which has 'use server'.
 * This separation resolves the Turbopack boundary violation:
 * "Could not find InternalAIProvider in React Client Manifest"
 */

import { createAI } from '@ai-sdk/rsc';
import { submitUserMessage } from './actions';
import type { AIState, UIState } from './types';

// ===========================================================
// CREATE AI INSTANCE
// ===========================================================

export const AI = createAI<AIState, UIState>({
    actions: {
        submitUserMessage,
    },
    initialAIState: {
        chatId: crypto.randomUUID(),
        messages: [],
    },
    initialUIState: [],
});

// Re-export types for consumers
export type { AIState, UIState, AIMessage, UIMessage, ActionResponse } from './types';
