/**
 * Smart Links Preview API - Next.js Route Handler
 * 
 * Endpoint: GET /api/preview?url=...
 * 
 * Features:
 * - Cheerio para extração de OG tags (compatível com Turbopack)
 * - Proteção SSRF (bloqueia IPs privados)
 * - Blacklist anti-concorrência
 * - Cache em memória com TTL
 */

import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

// ============================================
// CONFIGURAÇÃO
// ============================================

// Domínios de concorrentes bloqueados
const COMPETITOR_DOMAINS = [
    'zoom.com.br',
    'buscape.com.br',
    'bondfaro.com.br',
    'jacotei.com.br',
    'pelando.com.br',
    'promobit.com.br',
];

// Padrões de IPs privados (proteção SSRF)
const PRIVATE_IP_PATTERNS = [
    /^127\./,
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[01])\./,
    /^192\.168\./,
    /^0\./,
    /^localhost$/i,
    /^::1$/,
    /^fc00:/i,
    /^fe80:/i,
];

// Cache em memória simples
const metadataCache = new Map<string, { data: MetadataResult; timestamp: number }>();
const CACHE_TTL = 3600000; // 1 hora

// ============================================
// TYPES
// ============================================

interface MetadataResult {
    title: string;
    description: string;
    image: string | null;
    logo: string;
    domain: string;
    url: string;
    fetchError?: boolean;
}

interface PreviewResponse extends Partial<MetadataResult> {
    isCompetitor: boolean;
    isBlocked: boolean;
    fromCache?: boolean;
    error?: string;
    message?: string;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function isPrivateOrLocalhost(hostname: string): boolean {
    return PRIVATE_IP_PATTERNS.some(pattern => pattern.test(hostname));
}

function isCompetitorDomain(hostname: string): boolean {
    const normalizedHost = hostname.toLowerCase().replace(/^www\./, '');
    return COMPETITOR_DOMAINS.some(comp =>
        normalizedHost === comp || normalizedHost.endsWith('.' + comp)
    );
}

async function fetchMetadata(url: string): Promise<MetadataResult> {
    const urlObj = new URL(url);

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; ComparaTopBot/1.0)',
            },
            signal: AbortSignal.timeout(5000),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Extrai Open Graph tags
        const title =
            $('meta[property="og:title"]').attr('content') ||
            $('meta[name="twitter:title"]').attr('content') ||
            $('title').text() ||
            urlObj.hostname;

        const description =
            $('meta[property="og:description"]').attr('content') ||
            $('meta[name="twitter:description"]').attr('content') ||
            $('meta[name="description"]').attr('content') ||
            '';

        const image =
            $('meta[property="og:image"]').attr('content') ||
            $('meta[name="twitter:image"]').attr('content') ||
            null;

        const logo =
            $('link[rel="icon"]').attr('href') ||
            $('link[rel="shortcut icon"]').attr('href') ||
            `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;

        return {
            title: title.slice(0, 200),
            description: description.slice(0, 300),
            image: image ? new URL(image, url).href : null,
            logo: logo.startsWith('http') ? logo : `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`,
            domain: urlObj.hostname,
            url: url,
        };
    } catch (error) {
        console.error('Fetch metadata error:', error);
        return {
            title: urlObj.hostname,
            description: 'Não foi possível carregar a descrição',
            image: null,
            logo: `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`,
            domain: urlObj.hostname,
            url: url,
            fetchError: true,
        };
    }
}

// ============================================
// ROUTE HANDLER
// ============================================

export async function GET(request: NextRequest): Promise<NextResponse<PreviewResponse>> {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    // Validação básica
    if (!url) {
        return NextResponse.json({
            error: 'URL parameter is required',
            isCompetitor: false,
            isBlocked: false,
        }, { status: 400 });
    }

    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;

        // Proteção SSRF
        if (isPrivateOrLocalhost(hostname)) {
            return NextResponse.json({
                error: 'Access to private addresses is forbidden',
                isCompetitor: false,
                isBlocked: true,
            }, { status: 403 });
        }

        // Verificação anti-concorrência
        if (isCompetitorDomain(hostname)) {
            return NextResponse.json({
                isCompetitor: true,
                isBlocked: true,
                domain: hostname,
                message: 'Este domínio foi identificado como concorrente.',
            });
        }

        // Verifica cache
        const cacheKey = url.toLowerCase();
        const cached = metadataCache.get(cacheKey);

        if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
            return NextResponse.json({
                ...cached.data,
                isCompetitor: false,
                isBlocked: false,
                fromCache: true,
            });
        }

        // Fetch metadados
        const metadata = await fetchMetadata(url);

        // Salva no cache
        metadataCache.set(cacheKey, {
            data: metadata,
            timestamp: Date.now(),
        });

        return NextResponse.json({
            ...metadata,
            isCompetitor: false,
            isBlocked: false,
            fromCache: false,
        });

    } catch (error) {
        console.error('Preview API error:', error);
        return NextResponse.json({
            error: 'Failed to fetch preview',
            message: error instanceof Error ? error.message : 'Unknown error',
            isCompetitor: false,
            isBlocked: false,
        }, { status: 500 });
    }
}
