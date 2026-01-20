/**
 * AI State Types
 * 
 * IMPORTANT: This file is separated from actions.tsx to avoid
 * Type Erasure conflicts with Next.js 16 Turbopack + 'use server'.
 * 
 * The bundler was treating TypeScript types as runtime values,
 * causing "ReferenceError: AIState is not defined".
 * 
 * By isolating types here (without 'use server'), we ensure proper
 * type-only imports in actions.tsx.
 */

import type { ReactNode } from 'react';

// ===========================================================
// AI STATE (Server-side message history)
// ===========================================================

export interface AIMessage {
    id: string;
    role: 'user' | 'assistant' | 'system' | 'tool';
    content: string;
    toolInvocations?: ToolInvocation[];
}

export interface ToolInvocation {
    toolName: string;
    toolCallId: string;
    args: Record<string, unknown>;
    result?: unknown;
}

export type AIState = {
    chatId: string;
    messages: AIMessage[];
};

// ===========================================================
// UI STATE (Client-side component history)
// ===========================================================

export interface UIMessage {
    id: string;
    role: 'user' | 'assistant';
    display: ReactNode;
}

export type UIState = UIMessage[];

// ===========================================================
// ACTION RESPONSE TYPES
// ===========================================================

// Re-export IntentResult from intent-router to avoid duplication
export type { IntentResult, IntentType } from './intent-router';

import type { IntentResult } from './intent-router';

export type ActionResponse =
    | { type: 'GENERATIVE_UI'; message: UIMessage }
    | { type: 'REDIRECT'; url: string; query: string; intent: IntentResult };
