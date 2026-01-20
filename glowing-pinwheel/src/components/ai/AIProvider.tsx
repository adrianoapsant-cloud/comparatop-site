'use client';

import { AI } from '@/lib/ai/actions';

// ===========================================================
// AI PROVIDER COMPONENT
// ===========================================================

/**
 * AIProvider wraps components that need access to AI SDK hooks.
 * 
 * This component provides the AI context from createAI, enabling:
 * - useUIState: Access to UI message history
 * - useAIState: Access to server-side message history
 * - useActions: Access to server actions like submitUserMessage
 * 
 * Usage:
 * ```tsx
 * import { AIProvider } from '@/components/ai/AIProvider';
 * 
 * export default function Layout({ children }) {
 *   return (
 *     <AIProvider>
 *       {children}
 *     </AIProvider>
 *   );
 * }
 * ```
 */
export function AIProvider({ children }: { children: React.ReactNode }) {
    return <AI>{children}</AI>;
}

export default AIProvider;
