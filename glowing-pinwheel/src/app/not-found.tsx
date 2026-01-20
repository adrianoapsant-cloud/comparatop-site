/**
 * @file not-found.tsx
 * @description Página 404 customizada para recuperação de usuário perdido
 * 
 * Features:
 * - Design atraente com ilustração
 * - Links úteis para categorias populares
 * - Barra de busca
 * - Sugestões de produtos populares
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/not-found
 */

import Link from 'next/link';
import React from 'react';

// ============================================================================
// DADOS
// ============================================================================

const POPULAR_CATEGORIES = [
    { name: 'TVs', href: '/tvs', emoji: '📺' },
    { name: 'Geladeiras', href: '/geladeiras', emoji: '🧊' },
    { name: 'Notebooks', href: '/notebooks', emoji: '💻' },
    { name: 'Smartphones', href: '/smartphones', emoji: '📱' },
    { name: 'Ar Condicionado', href: '/ar-condicionado', emoji: '❄️' },
    { name: 'Fones de Ouvido', href: '/fones-de-ouvido', emoji: '🎧' },
];

const HELPFUL_LINKS = [
    { name: 'Página Inicial', href: '/', description: 'Voltar ao início' },
    { name: 'Calculadora de BTU', href: '/ferramentas/calculadora-btu', description: 'Calcule o ar ideal' },
    { name: 'Todas as Categorias', href: '/categorias', description: 'Explore produtos' },
    { name: 'Contato', href: '/contato', description: 'Fale conosco' },
];

// ============================================================================
// COMPONENTE
// ============================================================================

export default function NotFound(): React.ReactElement {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                {/* Header com ilustração */}
                <div className="text-center mb-12">
                    {/* Ilustração 404 em ASCII/Emoji */}
                    <div className="text-8xl mb-6 select-none" aria-hidden="true">
                        🔍
                    </div>

                    <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
                        404
                    </h1>

                    <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        Página não encontrada
                    </h2>

                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        Ops! Parece que você se perdeu. A página que você está procurando
                        não existe ou foi movida. Mas não se preocupe, temos muitas opções para você!
                    </p>
                </div>

                {/* Barra de busca */}
                <div className="max-w-xl mx-auto mb-12">
                    <form action="/busca" method="GET" className="relative">
                        <input
                            type="text"
                            name="q"
                            placeholder="Buscar produtos, marcas ou categorias..."
                            className="
                w-full py-4 px-6 pl-14
                bg-white dark:bg-gray-800
                border-2 border-gray-200 dark:border-gray-700
                rounded-2xl
                text-gray-900 dark:text-white
                placeholder-gray-400 dark:placeholder-gray-500
                focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20
                transition-all
              "
                        />
                        <svg
                            className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <button
                            type="submit"
                            className="
                absolute right-3 top-1/2 -translate-y-1/2
                px-4 py-2
                bg-emerald-500 hover:bg-emerald-600
                text-white font-medium
                rounded-xl
                transition-colors
              "
                        >
                            Buscar
                        </button>
                    </form>
                </div>

                {/* Categorias populares */}
                <section className="mb-12">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                        Categorias Populares
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                        {POPULAR_CATEGORIES.map((category) => (
                            <Link
                                key={category.href}
                                href={category.href}
                                className="
                  flex flex-col items-center justify-center
                  p-4
                  bg-white dark:bg-gray-800
                  border border-gray-200 dark:border-gray-700
                  rounded-xl
                  hover:border-emerald-500 hover:shadow-lg
                  transition-all
                  group
                "
                            >
                                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                                    {category.emoji}
                                </span>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {category.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Links úteis */}
                <section className="mb-12">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                        Links Úteis
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                        {HELPFUL_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="
                  flex items-center gap-4
                  p-4
                  bg-white dark:bg-gray-800
                  border border-gray-200 dark:border-gray-700
                  rounded-xl
                  hover:border-emerald-500
                  transition-colors
                "
                            >
                                <div className="
                  w-10 h-10
                  bg-emerald-100 dark:bg-emerald-900/30
                  text-emerald-600 dark:text-emerald-400
                  rounded-lg
                  flex items-center justify-center
                ">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {link.name}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {link.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Botão voltar */}
                <div className="text-center">
                    <Link
                        href="/"
                        className="
              inline-flex items-center gap-2
              px-6 py-3
              bg-gradient-to-r from-emerald-500 to-teal-600
              hover:from-emerald-600 hover:to-teal-700
              text-white font-semibold
              rounded-xl shadow-lg
              transition-all
              hover:shadow-xl hover:scale-[1.02]
            "
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Voltar para a Página Inicial
                    </Link>
                </div>
            </div>
        </main>
    );
}
