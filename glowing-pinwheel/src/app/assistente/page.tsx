'use client';

/**
 * TEMPORARILY DISABLED - Assistente IA
 * 
 * Problema: @ai-sdk/rsc v2.x tem bug fundamental de compatibilidade com
 * Next.js 16 React Server Components.
 * 
 * Erro: "Could not find InternalAIProvider in React Client Manifest"
 * Este erro ocorre tanto com Turbopack quanto com Webpack.
 * 
 * Solução Necessária: Migrar para nova arquitetura recomendada
 * - Backend: Route Handler com streamText (em vez de Server Action com streamUI)
 * - Frontend: useChat (em vez de useActions/useUIState)
 */

export default function AssistentePage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Hero */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                            Assistente IA
                        </span>
                    </h1>
                </div>

                {/* Maintenance Notice */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🔧</span>
                    </div>
                    <h2 className="text-xl font-bold text-amber-800 mb-2">
                        Em Atualização
                    </h2>
                    <p className="text-amber-700 mb-4">
                        Estamos migrando para uma nova arquitetura de IA.
                        O Assistente estará disponível em breve.
                    </p>
                </div>

                {/* Alternative Actions */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="/" className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors text-center">
                        Ir para Home
                    </a>
                    <a href="/categorias/smart-tvs" className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-center">
                        Ver Smart TVs
                    </a>
                </div>
            </div>
        </main>
    );
}
