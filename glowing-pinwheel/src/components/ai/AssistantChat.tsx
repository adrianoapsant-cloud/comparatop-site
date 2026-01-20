'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUIState, useActions } from '@ai-sdk/rsc';
import { Bot, User, Sparkles, MessageCircle, X, ChevronUp, Loader2 } from 'lucide-react';
import { VoiceSearchInput } from '@/components/VoiceSearchInput';
import { ComparisonTableSkeleton } from './ComparisonTableSkeleton';
import type { AI } from '@/lib/ai/actions';
import type { UIMessage, ActionResponse } from '@/lib/ai/actions';

// ===========================================================
// HELPERS
// ===========================================================

/**
 * Detect if user message is a comparison request
 * Returns extracted product names if detected
 */
function detectComparisonIntent(message: string): { isComparison: boolean; products: string[] } {
    const lowerMessage = message.toLowerCase();

    // Comparison keywords
    const comparisonKeywords = [
        'compare', 'comparar', 'compara', 'comparação', 'comparativo',
        'vs', 'versus', 'ou', 'melhor', 'diferença', 'diferenças',
        'qual é melhor', 'qual melhor', 'escolher entre',
    ];

    const hasComparisonKeyword = comparisonKeywords.some(k => lowerMessage.includes(k));

    if (!hasComparisonKeyword) {
        return { isComparison: false, products: [] };
    }

    // Try to extract product names
    // Pattern: "Compare X com/vs/ou Y"
    const patterns = [
        /compare\s+(.+?)\s+(?:com|vs|versus|e|ou)\s+(.+)/i,
        /(.+?)\s+(?:vs|versus)\s+(.+)/i,
        /(?:qual|quem)\s+é\s+melhor[,:]?\s+(.+?)\s+ou\s+(.+)/i,
        /(.+?)\s+ou\s+(.+?)\s*\?/i,
    ];

    for (const pattern of patterns) {
        const match = message.match(pattern);
        if (match) {
            const products = [match[1].trim(), match[2].trim()];
            return { isComparison: true, products };
        }
    }

    // Fallback: just flag as comparison without extracting names
    return { isComparison: true, products: ['Produto 1', 'Produto 2'] };
}

// ===========================================================
// TYPES
// ===========================================================

interface AssistantChatProps {
    /** Initial collapsed state */
    initialCollapsed?: boolean;
    /** Position on screen */
    position?: 'bottom-right' | 'bottom-center' | 'inline';
    /** Show voice input */
    showVoiceInput?: boolean;
    /** Placeholder text */
    placeholder?: string;
    /** Initial query to process automatically (from URL param or voice redirect) */
    initialQuery?: string;
}

// ===========================================================
// MESSAGE BUBBLE COMPONENT
// ===========================================================

function MessageBubble({
    message,
    isUser,
}: {
    message: UIMessage;
    isUser: boolean;
}) {
    return (
        <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser
                    ? 'bg-purple-100 text-purple-600'
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                    }`}
            >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Message Content */}
            <div
                className={`flex-1 ${isUser ? 'text-right' : ''}`}
            >
                <div
                    className={`inline-block max-w-full ${isUser
                        ? 'bg-purple-100 text-purple-900 rounded-2xl rounded-tr-md px-4 py-2'
                        : ''
                        }`}
                >
                    {message.display}
                </div>
            </div>
        </div>
    );
}

// ===========================================================
// LOADING INDICATOR
// ===========================================================

function ThinkingIndicator() {
    return (
        <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Analisando sua pergunta...</span>
            </div>
        </div>
    );
}

// ===========================================================
// MAIN COMPONENT
// ===========================================================

export function AssistantChat({
    initialCollapsed = true,
    position = 'bottom-right',
    showVoiceInput = true,
    placeholder = 'Pergunte algo ou compare produtos...',
    initialQuery,
}: AssistantChatProps) {
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
    const [isLoading, setIsLoading] = useState(false);
    const [textInput, setTextInput] = useState('');
    const [localMessages, setLocalMessages] = useState<UIMessage[]>([]);
    const [hasProcessedInitialQuery, setHasProcessedInitialQuery] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // AI SDK hooks
    const [messages, setMessages] = useUIState<typeof AI>();
    const actions = useActions<typeof AI>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const submitUserMessage = (actions as any).submitUserMessage as (message: string) => Promise<ActionResponse>;

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [localMessages, messages]);


    // Handle message submission with OPTIMISTIC UI
    const handleSubmit = useCallback(
        async (content: string) => {
            if (!content.trim() || isLoading) return;

            setIsLoading(true);
            setIsCollapsed(false);

            // Add user message to local state immediately
            const userMessage: UIMessage = {
                id: crypto.randomUUID(),
                role: 'user',
                display: <span>{content}</span>,
            };

            // OPTIMISTIC UI: Detect comparison intent and show skeleton IMMEDIATELY
            const { isComparison, products } = detectComparisonIntent(content);
            const skeletonId = crypto.randomUUID();

            if (isComparison) {
                // Show skeleton immediately (optimistic UI)
                const skeletonMessage: UIMessage = {
                    id: skeletonId,
                    role: 'assistant',
                    display: <ComparisonTableSkeleton productNames={products} />,
                };
                setLocalMessages((prev) => [...prev, userMessage, skeletonMessage]);
            } else {
                setLocalMessages((prev) => [...prev, userMessage]);
            }

            setTextInput('');

            try {
                // Call the server action
                const result: ActionResponse = await submitUserMessage(content);

                console.log('[AssistantChat] Action result:', result.type);

                // Handle based on response type
                if (result.type === 'REDIRECT') {
                    // Standard search - redirect to search page
                    // Remove skeleton if it was shown
                    if (isComparison) {
                        setLocalMessages((prev) => prev.filter(m => m.id !== skeletonId));
                    }
                    console.log('[AssistantChat] Redirecting to:', result.url);
                    router.push(result.url);
                } else if (result.type === 'GENERATIVE_UI') {
                    // AI response - REPLACE skeleton with real content
                    if (isComparison) {
                        setLocalMessages((prev) =>
                            prev.map(m => m.id === skeletonId ? result.message : m)
                        );
                    } else {
                        setLocalMessages((prev) => [...prev, result.message]);
                    }
                    // Also update the global UI state
                    setMessages((prev: UIMessage[]) => [...prev, result.message]);
                }
            } catch (error) {
                console.error('[AssistantChat] Error:', error);
                // Add error message - replace skeleton if present
                const errorMessage: UIMessage = {
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    display: (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                            Desculpe, ocorreu um erro. Por favor, tente novamente.
                        </div>
                    ),
                };
                if (isComparison) {
                    setLocalMessages((prev) =>
                        prev.map(m => m.id === skeletonId ? errorMessage : m)
                    );
                } else {
                    setLocalMessages((prev) => [...prev, errorMessage]);
                }
            } finally {
                setIsLoading(false);
            }
        },
        [isLoading, router, submitUserMessage, setMessages]
    );

    // Auto-process initial query (from URL param or voice redirect)
    useEffect(() => {
        if (initialQuery && !hasProcessedInitialQuery && !isLoading) {
            console.log('[AssistantChat] Auto-processing initial query:', initialQuery);
            setHasProcessedInitialQuery(true);
            // Small delay to ensure component is fully mounted
            const timer = setTimeout(() => {
                handleSubmit(initialQuery);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [initialQuery, hasProcessedInitialQuery, isLoading, handleSubmit]);

    // Handle voice search
    const handleVoiceSearch = useCallback(
        (query: string) => {
            handleSubmit(query);
        },
        [handleSubmit]
    );

    // Handle text form submission
    const handleTextSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit(textInput);
    };

    // Position styles
    const positionStyles = {
        'bottom-right': 'fixed bottom-4 right-4 z-50',
        'bottom-center': 'fixed bottom-4 left-1/2 -translate-x-1/2 z-50',
        inline: 'relative',
    };

    // Collapsed FAB view
    if (isCollapsed && position !== 'inline') {
        return (
            <button
                onClick={() => setIsCollapsed(false)}
                className={`
                    ${positionStyles[position]}
                    w-14 h-14 rounded-full
                    bg-gradient-to-br from-purple-600 to-indigo-600
                    text-white shadow-xl shadow-purple-200
                    flex items-center justify-center
                    hover:scale-110 transition-transform
                    animate-bounce-slow
                `}
                aria-label="Abrir assistente"
            >
                <MessageCircle className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-2.5 h-2.5 text-white" />
                </span>
            </button>
        );
    }

    return (
        <div
            className={`
                ${position !== 'inline' ? positionStyles[position] : ''}
                w-full ${position !== 'inline' ? 'max-w-md' : ''}
            `}
        >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold">Consultor Técnico</h3>
                            <p className="text-purple-200 text-xs">Especialista em produtos</p>
                        </div>
                    </div>
                    {position !== 'inline' && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsCollapsed(true)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                aria-label="Minimizar"
                            >
                                <ChevronUp className="w-5 h-5 text-white" />
                            </button>
                            <button
                                onClick={() => setIsCollapsed(true)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                aria-label="Fechar"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Messages Area */}
                <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {/* Welcome message if empty */}
                    {localMessages.length === 0 && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                                <Sparkles className="w-8 h-8 text-purple-600" />
                            </div>
                            <h4 className="font-bold text-gray-800 mb-2">
                                👋 Olá! Sou o Consultor Técnico.
                            </h4>
                            <p className="text-gray-500 text-sm max-w-xs mx-auto">
                                Diferente de um chatbot comum, minha função é te ajudar a evitar erros de compra — não a empurrar produtos.
                            </p>

                            {/* Quick suggestions */}
                            <div className="mt-4 flex flex-wrap gap-2 justify-center">
                                {[
                                    'Preciso de uma TV para sala com muita luz',
                                    'Qual geladeira gasta menos energia?',
                                    'Compare Samsung QN90C vs LG C3',
                                ].map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => handleSubmit(suggestion)}
                                        className="px-3 py-1.5 bg-white border border-purple-200 text-purple-700 text-xs rounded-full hover:bg-purple-50 transition-colors"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    {localMessages.map((message) => (
                        <MessageBubble
                            key={message.id}
                            message={message}
                            isUser={message.role === 'user'}
                        />
                    ))}

                    {/* Loading indicator */}
                    {isLoading && <ThinkingIndicator />}

                    {/* Scroll anchor */}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-200 bg-white">
                    {showVoiceInput ? (
                        <VoiceSearchInput
                            onSearch={handleVoiceSearch}
                            placeholder={placeholder}
                            className="w-full"
                        />
                    ) : (
                        <form onSubmit={handleTextSubmit} className="flex gap-2">
                            <input
                                type="text"
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                placeholder={placeholder}
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !textInput.trim()}
                                className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Enviar
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div >
    );
}

export default AssistantChat;
