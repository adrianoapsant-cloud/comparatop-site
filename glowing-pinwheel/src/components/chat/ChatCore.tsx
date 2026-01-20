"use client";

import { useState, useRef, useEffect } from "react";
import { Brain, Send, Sparkles, RotateCcw, Package, Bell, Shield, Bot } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { ChatProductCard } from "@/components/ChatProductCard";
import { BundleCard } from "@/components/BundleCard";
import { MyAlertsDrawer } from "@/components/MyAlertsDrawer";
import { FrictionBadge } from "@/components/chat/FrictionBadge";

// ============================================
// MARKDOWN TEXT RENDERER (lightweight, no deps)
// ============================================

/**
 * MarkdownText - Lightweight markdown renderer
 * 
 * Supports:
 * - Paragraphs (split by double newline)
 * - Lists (- or 1.)
 * - Bold (**text**)
 * - Headings (## text)
 * - Code (`text`)
 * - Separators (---)
 */
function MarkdownText({ content }: { content: string }) {
    // Split into paragraphs by double newline
    const paragraphs = content.split(/\n\n+/);

    return (
        <div className="space-y-3">
            {paragraphs.map((para, pIdx) => {
                // Check if paragraph is a list
                const lines = para.split('\n');
                const isList = lines.every(line =>
                    line.trim() === '' ||
                    /^[-•]\s/.test(line.trim()) ||
                    /^\d+\.\s/.test(line.trim())
                );

                // Check if it's a separator
                if (para.trim() === '---') {
                    return <hr key={pIdx} className="border-slate-600/50 my-2" />;
                }

                // Render list
                if (isList) {
                    const isOrdered = /^\d+\.\s/.test(lines[0]?.trim() || '');
                    const ListTag = isOrdered ? 'ol' : 'ul';
                    return (
                        <ListTag key={pIdx} className={`${isOrdered ? 'list-decimal' : 'list-disc'} pl-5 space-y-1`}>
                            {lines
                                .filter(line => line.trim())
                                .map((line, lIdx) => {
                                    const text = line.replace(/^[-•]\s*|\d+\.\s*/, '').trim();
                                    return (
                                        <li key={lIdx} className="text-sm">
                                            <InlineMarkdown text={text} />
                                        </li>
                                    );
                                })}
                        </ListTag>
                    );
                }

                // Check if heading
                const headingMatch = para.match(/^(#{1,3})\s+(.+)/);
                if (headingMatch) {
                    const level = headingMatch[1].length;
                    const text = headingMatch[2];
                    const HeadingClass = level === 1 ? 'text-lg font-bold' :
                        level === 2 ? 'text-base font-semibold' :
                            'text-sm font-medium';
                    return (
                        <p key={pIdx} className={HeadingClass}>
                            <InlineMarkdown text={text} />
                        </p>
                    );
                }

                // Regular paragraph - handle single line breaks
                return (
                    <p key={pIdx} className="text-sm leading-relaxed whitespace-pre-wrap">
                        {lines.map((line, lIdx) => (
                            <span key={lIdx}>
                                <InlineMarkdown text={line} />
                                {lIdx < lines.length - 1 && <br />}
                            </span>
                        ))}
                    </p>
                );
            })}
        </div>
    );
}

/**
 * InlineMarkdown - Handle bold, code, and links inline
 */
function InlineMarkdown({ text }: { text: string }) {
    // Process bold (**text**), code (`text`)
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
        // Check for bold
        const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
        // Check for code
        const codeMatch = remaining.match(/`([^`]+)`/);

        // Find earliest match
        const boldIdx = boldMatch ? remaining.indexOf(boldMatch[0]) : Infinity;
        const codeIdx = codeMatch ? remaining.indexOf(codeMatch[0]) : Infinity;

        if (boldIdx === Infinity && codeIdx === Infinity) {
            parts.push(<span key={key++}>{remaining}</span>);
            break;
        }

        if (boldIdx < codeIdx && boldMatch) {
            // Add text before bold
            if (boldIdx > 0) {
                parts.push(<span key={key++}>{remaining.slice(0, boldIdx)}</span>);
            }
            // Add bold
            parts.push(<strong key={key++} className="font-semibold text-white">{boldMatch[1]}</strong>);
            remaining = remaining.slice(boldIdx + boldMatch[0].length);
        } else if (codeMatch) {
            // Add text before code
            if (codeIdx > 0) {
                parts.push(<span key={key++}>{remaining.slice(0, codeIdx)}</span>);
            }
            // Add code
            parts.push(
                <code key={key++} className="px-1 py-0.5 bg-slate-700 rounded text-xs font-mono text-emerald-300">
                    {codeMatch[1]}
                </code>
            );
            remaining = remaining.slice(codeIdx + codeMatch[0].length);
        }
    }

    return <>{parts}</>;
}

interface ChatCoreProps {
    /** Whether to show the header with avatar */
    showHeader?: boolean;
    /** Additional class names for the container */
    className?: string;
    /** Callback when user wants to expand to immersive mode */
    onExpand?: () => void;
    /** Callback when user wants to minimize to sidebar */
    onMinimize?: () => void;
}

/**
 * ChatCore - The reusable chat UI component
 * 
 * This component is container-agnostic: it works inside both
 * the Sheet sidebar and the immersive /chat page.
 */
export function ChatCore({
    showHeader = true,
    className = "",
    onExpand,
    onMinimize
}: ChatCoreProps) {
    const { messages, isLoading, sendMessage, clearMessages, catalogSnapshot, ethicalBrake } = useChat();
    const [inputValue, setInputValue] = useState("");
    const [alertsDrawerOpen, setAlertsDrawerOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Handle prefill from URL query param (for Admin Hub testing)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const prefill = params.get('prefill');
            if (prefill && !inputValue) {
                setInputValue(prefill);
                // Clear the prefill param from URL without reload
                const newUrl = window.location.pathname + window.location.hash;
                window.history.replaceState({}, '', newUrl);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run on mount

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        sendMessage(inputValue);
        setInputValue("");
    };

    const handleSuggestionClick = (suggestion: string) => {
        sendMessage(suggestion);
    };

    // Get focus product names for badge display
    const focusProductNames = catalogSnapshot?.focusIds
        .map(id => catalogSnapshot.lastResults.find(p => p.id === id)?.name?.split(' ')[0])
        .filter(Boolean)
        .join(', ') || '';

    return (
        <div className={`flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-950 ${className}`}>
            {/* AI Disclosure + Protective Mode Badge */}
            <div className="px-4 py-2 bg-slate-800/50 border-b border-slate-700/30 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Bot className="w-3.5 h-3.5" />
                    <span>Assistente de IA</span>
                </div>
                {ethicalBrake && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-900/30 px-2 py-1 rounded-full">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Modo Protetivo</span>
                    </div>
                )}
            </div>

            {/* Catalog Snapshot Badge */}
            {catalogSnapshot && catalogSnapshot.lastResults.length > 0 && (
                <div className="px-4 py-2 bg-emerald-900/30 border-b border-emerald-700/30">
                    <div className="flex items-center gap-2 text-xs text-emerald-400">
                        <Package className="w-3.5 h-3.5" />
                        <span className="font-medium">
                            📦 {catalogSnapshot.lastResults.length} produtos
                        </span>
                        {focusProductNames && (
                            <span className="text-emerald-500">
                                | Top: {focusProductNames}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Friction Detection Badge */}
            <FrictionBadge onHelp={(msg) => sendMessage(msg)} />

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600/20 to-purple-700/20 flex items-center justify-center mb-6">
                            <Sparkles className="w-10 h-10 text-violet-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                            👋 Sou o Engenheiro Técnico
                        </h3>
                        <p className="text-sm text-slate-400 mb-8 max-w-md">
                            Minha função é te ajudar a evitar erros de compra — não a empurrar produtos.
                            Faça perguntas sobre especificações, comparações ou problemas técnicos.
                        </p>

                        {/* Suggestions */}
                        <div className="space-y-3 w-full max-w-md">
                            <p className="text-xs text-slate-500 uppercase tracking-wider">Sugestões</p>
                            {[
                                "TV para sala com muita luz solar",
                                "Qual geladeira consome menos energia?",
                                "Compare Samsung QN90C vs LG C3 OLED",
                                "Ar condicionado inverter vale a pena?",
                            ].map((suggestion) => (
                                <button
                                    key={suggestion}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="w-full px-4 py-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 rounded-xl text-sm text-slate-300 transition-colors text-left hover:border-violet-500/30"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === "user"
                                    ? "bg-violet-600"
                                    : "bg-gradient-to-br from-emerald-500 to-teal-600"
                                    }`}>
                                    {message.role === "user" ? (
                                        <span className="text-xs text-white font-bold">EU</span>
                                    ) : (
                                        <Brain className="w-5 h-5 text-white" />
                                    )}
                                </div>
                                <div className={`max-w-[75%] px-4 py-3 rounded-2xl ${message.role === "user"
                                    ? "bg-violet-600 text-white rounded-br-sm"
                                    : "bg-slate-800 text-slate-100 rounded-bl-sm"
                                    }`}>
                                    {message.role === "assistant" ? (
                                        <MarkdownText content={message.content} />
                                    ) : (
                                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                                    )}

                                    {/* Render UI Components if present */}
                                    {message.role === "assistant" && message.uiComponents && message.uiComponents.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            {message.uiComponents.map((ui, uiIndex) => {
                                                if (ui.__ui === 'product_card') {
                                                    return (
                                                        <ChatProductCard
                                                            key={`${ui.id}-${uiIndex}`}
                                                            id={ui.id}
                                                            name={ui.name}
                                                            brand={ui.brand}
                                                            price={ui.price}
                                                            priceFormatted={ui.priceFormatted}
                                                            score={ui.score}
                                                            internalUrl={ui.internalUrl}
                                                            amazonUrl={ui.amazonUrl}
                                                        />
                                                    );
                                                } else if (ui.__ui === 'bundle_card') {
                                                    return (
                                                        <BundleCard
                                                            key={`bundle-${ui.mainProduct.id}-${uiIndex}`}
                                                            bundleType={ui.bundleType}
                                                            bundleName={ui.bundleName}
                                                            weakness={ui.weakness}
                                                            mainProduct={ui.mainProduct}
                                                            accessory={ui.accessory}
                                                            totalPrice={ui.totalPrice}
                                                            totalPriceFormatted={ui.totalPriceFormatted}
                                                            accessoryPercentage={ui.accessoryPercentage}
                                                            amazonUrl={ui.amazonUrl}
                                                        />
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Loading indicator */}
                        {isLoading && (
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                                    <Brain className="w-5 h-5 text-white" />
                                </div>
                                <div className="px-4 py-3 bg-slate-800 rounded-2xl rounded-bl-sm">
                                    <div className="flex gap-1.5">
                                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-700/50 bg-slate-900/80 backdrop-blur">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Pergunte sobre qualquer produto..."
                        className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !inputValue.trim()}
                        className="p-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
                    >
                        <Send className="w-5 h-5 text-white" />
                    </button>
                </form>

                {/* Footer with actions */}
                <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-slate-500">
                        🛡️ Consenso 360 • Motor SIC v2.0
                    </p>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setAlertsDrawerOpen(true)}
                            className="text-xs text-slate-500 hover:text-violet-400 flex items-center gap-1 transition-colors"
                            title="Meus Alertas"
                        >
                            <Bell className="w-3 h-3" />
                            Alertas
                        </button>
                        {messages.length > 0 && (
                            <button
                                onClick={clearMessages}
                                className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
                            >
                                <RotateCcw className="w-3 h-3" />
                                Nova conversa
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* My Alerts Drawer */}
            <MyAlertsDrawer
                isOpen={alertsDrawerOpen}
                onClose={() => setAlertsDrawerOpen(false)}
            />
        </div>
    );
}
