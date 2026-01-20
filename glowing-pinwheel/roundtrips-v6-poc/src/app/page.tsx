'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useEffect, useRef } from 'react';

// ==========================================
// TYPES
// ==========================================
interface Product {
  id: string;
  name: string;
  price: number;
  score: number;
  category: string;
}

interface CatalogSnapshot {
  lastResults: Product[];
  focusIds: string[];
  updatedAt: string;
}

// ==========================================
// COMPONENT
// ==========================================
export default function ChatPage() {
  const [catalogSnapshot, setCatalogSnapshot] = useState<CatalogSnapshot | null>(null);
  const snapshotRef = useRef<CatalogSnapshot | null>(null);
  const [input, setInput] = useState('');

  // Keep ref in sync
  useEffect(() => {
    snapshotRef.current = catalogSnapshot;
  }, [catalogSnapshot]);

  // Custom fetch that injects catalogSnapshot
  const customFetch = async (url: string | URL | Request, options?: RequestInit) => {
    if (options?.body && typeof options.body === 'string') {
      try {
        const body = JSON.parse(options.body);
        body.catalogSnapshot = snapshotRef.current;
        options = {
          ...options,
          body: JSON.stringify(body),
        };
      } catch {
        // Not JSON, send as-is
      }
    }
    return fetch(url, options);
  };

  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      fetch: customFetch,
    }),
  });

  // ==========================================
  // SNAPSHOT EXTRACTION: Watch for catalog results
  // ==========================================
  useEffect(() => {
    const lastAssistantMessage = messages.filter(m => m.role === 'assistant').pop();
    if (!lastAssistantMessage) return;

    for (const part of lastAssistantMessage.parts) {
      if (part.type === 'text') {
        const text = part.text;
        const priceMatches = text.match(/R\$\s*[\d.,]+/g);
        const scoreMatches = text.match(/(?:Nota|nota|score)[:.]?\s*[\d.,]+/gi);

        if (priceMatches && priceMatches.length >= 2 && scoreMatches && scoreMatches.length >= 2) {
          const mockProducts: Product[] = [
            { id: '1', name: 'TCL C735 55"', price: 2800, score: 7.8, category: 'smart-tvs' },
            { id: '2', name: 'Samsung QN90C 55"', price: 4500, score: 8.4, category: 'smart-tvs' },
            { id: '3', name: 'LG C3 OLED 55"', price: 5200, score: 9.1, category: 'smart-tvs' },
            { id: '4', name: 'Sony X90L 65"', price: 6500, score: 8.7, category: 'smart-tvs' },
            { id: '5', name: 'Hisense U7K 55"', price: 2200, score: 7.2, category: 'smart-tvs' },
          ];

          const sorted = [...mockProducts].sort((a, b) => b.score - a.score);
          const top2Ids = sorted.slice(0, 2).map(p => p.id);

          const newSnapshot: CatalogSnapshot = {
            lastResults: mockProducts,
            focusIds: top2Ids,
            updatedAt: new Date().toISOString(),
          };

          if (JSON.stringify(newSnapshot.lastResults) !== JSON.stringify(catalogSnapshot?.lastResults)) {
            setCatalogSnapshot(newSnapshot);
            console.log('[Frontend] Catalog snapshot updated:', newSnapshot);
          }
        }
      }
    }
  }, [messages, catalogSnapshot]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">🔄 Roundtrips v6 POC</h1>
            <p className="text-gray-400 text-sm">AI SDK 6.0 + Gemini 2.0 Flash + Catalog Memory</p>
          </div>
          {catalogSnapshot && (
            <div className="text-xs bg-green-900/50 border border-green-700 px-3 py-1 rounded">
              📦 {catalogSnapshot.lastResults.length} produtos | Top: {catalogSnapshot.focusIds.join(', ')}
            </div>
          )}
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-lg mb-2">👋 Olá! Pergunte algo para testar.</p>
            <p className="text-sm">Exemplo: &quot;quais TVs vocês têm?&quot;</p>
            <p className="text-xs text-gray-600 mt-4">Depois: &quot;compare as 2 melhores&quot; ou &quot;quanto gastam por mês?&quot;</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 ${message.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-100 border border-gray-700'
                }`}
            >
              <div className="text-xs font-medium mb-1 opacity-70">
                {message.role === 'user' ? '👤 Você' : '🤖 Assistente'}
              </div>

              {message.parts.map((part, index) => {
                if (part.type === 'text') {
                  return (
                    <div key={index} className="whitespace-pre-wrap">
                      {part.text}
                    </div>
                  );
                }

                if (part.type.startsWith('tool-')) {
                  const toolName = part.type.replace('tool-', '');
                  const toolPart = part as { state: string; input?: unknown; output?: unknown };

                  return (
                    <div key={index} className="mt-3 pt-3 border-t border-gray-600">
                      <div className="text-xs font-medium text-yellow-400 mb-2">
                        🔧 Tool: {toolName}
                      </div>
                      <div className="bg-gray-900 rounded p-2 text-xs">
                        <div className="text-green-400 font-mono">
                          Input: {JSON.stringify(toolPart.input, null, 2)}
                        </div>
                        {toolPart.state === 'output' && toolPart.output != null && (
                          <div className="text-cyan-400 mt-2">
                            Output: {JSON.stringify(toolPart.output as object, null, 2)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        ))}

        {status === 'submitted' && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-lg px-4 py-3 border border-gray-700">
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                <span className="text-gray-400">Enviando...</span>
              </div>
            </div>
          </div>
        )}

        {status === 'streaming' && (
          <div className="flex justify-center">
            <button
              onClick={() => stop()}
              className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg"
            >
              ⏹ Parar
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg px-4 py-3 mx-4">
            <div className="flex items-start gap-3">
              <div className="text-red-400 text-2xl">⚠️</div>
              <div className="flex-1">
                <div className="text-red-400 font-bold text-lg">Erro na API</div>
                <div className="text-red-300 text-sm mt-1 font-mono bg-red-950/50 p-2 rounded">
                  {error.message}
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 bg-red-700 hover:bg-red-600 text-white text-sm px-4 py-2 rounded"
                >
                  🔄 Recarregar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input });
            setInput('');
          }
        }}
        className="border-t border-gray-700 p-4 bg-gray-800"
      >
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={status !== 'ready'}
          />
          <button
            type="submit"
            disabled={status !== 'ready' || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}
