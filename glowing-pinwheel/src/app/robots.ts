/**
 * @file robots.ts
 * @description Robots.txt dinâmico para Next.js App Router
 * 
 * ATUALIZADO: Bloqueia rotas internas (/admin, /dev, /api/immunity, /api/supabase)
 * e bots de IA que fazem scraping para treinamento.
 * 
 * Permite bots de busca e IA citarem conteúdo público.
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */

import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://comparatop.com.br';

// Internal routes that should NEVER be indexed
const INTERNAL_DISALLOW = [
    '/admin/',
    '/admin',
    '/dev/',
    '/dev',
    '/api/immunity/',
    '/api/immunity',
    '/api/supabase/',
    '/api/supabase',
    '/api/admin/',
    '/api/admin',
    '/_next/',
    '/private/',
    '/*.json$',
    '/search?*',
];

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            // =========================================
            // REGRAS PARA TODOS OS BOTS
            // =========================================
            {
                userAgent: '*',
                allow: '/',
                disallow: INTERNAL_DISALLOW,
            },

            // =========================================
            // BOTS DE IA - PERMITIR CONTEÚDO PÚBLICO
            // (mas bloquear rotas internas)
            // =========================================

            // OpenAI / ChatGPT / SearchGPT
            {
                userAgent: 'GPTBot',
                allow: '/',
                disallow: INTERNAL_DISALLOW,
            },
            {
                userAgent: 'ChatGPT-User',
                allow: '/',
                disallow: INTERNAL_DISALLOW,
            },

            // Anthropic / Claude
            {
                userAgent: 'anthropic-ai',
                allow: '/',
                disallow: INTERNAL_DISALLOW,
            },
            {
                userAgent: 'ClaudeBot',
                allow: '/',
                disallow: INTERNAL_DISALLOW,
            },
            {
                userAgent: 'Claude-Web',
                allow: '/',
                disallow: INTERNAL_DISALLOW,
            },

            // Google Bard / Gemini
            {
                userAgent: 'Google-Extended',
                allow: '/',
                disallow: INTERNAL_DISALLOW,
            },

            // Perplexity AI
            {
                userAgent: 'PerplexityBot',
                allow: '/',
                disallow: INTERNAL_DISALLOW,
            },

            // Microsoft Copilot / Bing AI
            {
                userAgent: 'Bingbot',
                allow: '/',
                disallow: INTERNAL_DISALLOW,
            },

            // =========================================
            // BOTS DE SCRAPING/TRAINING - BLOQUEAR TUDO
            // =========================================

            // Common Crawl (usado para treinar LLMs)
            {
                userAgent: 'CCBot',
                disallow: '/',
            },

            // ByteDance/TikTok
            {
                userAgent: 'Bytespider',
                disallow: '/',
            },

            // Amazon
            {
                userAgent: 'Amazonbot',
                disallow: '/',
            },

            // Meta/Facebook scraper
            {
                userAgent: 'Meta-ExternalAgent',
                disallow: '/',
            },

            // SEO tools (não queremos competidores)
            {
                userAgent: 'SemrushBot',
                disallow: '/',
            },
            {
                userAgent: 'AhrefsBot',
                disallow: '/',
            },
            {
                userAgent: 'MJ12bot',
                disallow: '/',
            },
            {
                userAgent: 'DotBot',
                disallow: '/',
            },

            // Generic scrapers
            {
                userAgent: 'Diffbot',
                disallow: '/',
            },
            {
                userAgent: 'Omgilibot',
                disallow: '/',
            },
        ],

        // Referência ao sitemap
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
