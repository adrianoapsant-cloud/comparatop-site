/**
 * @file _baseUrl.ts
 * @description Helper centralizado para resolução de BASE_URL em scripts de integridade.
 * 
 * Prioridade:
 * 1. INTEGRITY_BASE_URL (definido via cross-env)
 * 2. NEXT_PUBLIC_SITE_URL (do .env)
 * 3. Fallback: http://localhost:3000
 */

export function resolveBaseUrl(): string {
    return (
        process.env.INTEGRITY_BASE_URL ||
        process.env.NEXT_PUBLIC_SITE_URL ||
        'http://localhost:3000'
    );
}

/**
 * Converte uma URL absoluta de produção para a BASE_URL atual.
 * Usado para validar sitemap que contém URLs de produção.
 * 
 * @example
 * // Com BASE_URL=http://localhost:3000
 * normalizeUrl('https://comparatop.com.br/produto/x')
 * // Retorna: 'http://localhost:3000/produto/x'
 */
export function normalizeUrl(url: string): string {
    const baseUrl = resolveBaseUrl();

    // Lista de hosts de produção conhecidos
    const prodHosts = [
        'https://comparatop.com.br',
        'https://www.comparatop.com.br',
        'http://comparatop.com.br',
    ];

    for (const prodHost of prodHosts) {
        if (url.startsWith(prodHost)) {
            const path = url.substring(prodHost.length);
            return `${baseUrl}${path}`;
        }
    }

    // Se já é uma URL local ou desconhecida, retorna como está
    return url;
}

/**
 * Extrai apenas o path de uma URL absoluta.
 * 
 * @example
 * extractPath('https://comparatop.com.br/produto/x')
 * // Retorna: '/produto/x'
 */
export function extractPath(url: string): string {
    try {
        const parsed = new URL(url);
        return parsed.pathname;
    } catch {
        // Se não é uma URL válida, assume que já é um path
        return url.startsWith('/') ? url : `/${url}`;
    }
}
