/**
 * @file integrity-sitemap.ts
 * @description Valida que todas as URLs do sitemap respondem 200
 * 
 * Roda: npx tsx scripts/integrity-sitemap.ts
 * Requer: servidor rodando no BASE_URL (padrão localhost:3000)
 * 
 * Suporta validação local mesmo com sitemap contendo URLs de produção.
 */

import { resolveBaseUrl, normalizeUrl } from './_baseUrl';

const BASE_URL = resolveBaseUrl();

interface SitemapResult {
    valid: boolean;
    totalUrls: number;
    successUrls: number;
    failedUrls: Array<{ url: string; status: number | string }>;
    privateUrls: string[];
}

async function fetchSitemap(): Promise<string[]> {
    const response = await fetch(`${BASE_URL}/sitemap.xml`);
    if (!response.ok) {
        throw new Error(`Sitemap não acessível: ${response.status}`);
    }

    const xml = await response.text();

    // Extrai URLs do XML (regex simples)
    const urlMatches = xml.match(/<loc>([^<]+)<\/loc>/g) || [];
    return urlMatches.map(match => match.replace(/<\/?loc>/g, ''));
}

async function checkUrl(url: string): Promise<{ status: number | string; ok: boolean }> {
    try {
        const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
        return { status: response.status, ok: response.ok };
    } catch (error) {
        return { status: 'NETWORK_ERROR', ok: false };
    }
}

async function validateSitemap(): Promise<SitemapResult> {
    const result: SitemapResult = {
        valid: true,
        totalUrls: 0,
        successUrls: 0,
        failedUrls: [],
        privateUrls: [],
    };

    console.log('\n🗺️ INTEGRITY:SITEMAP');
    console.log('='.repeat(50));
    console.log(`BASE_URL: ${BASE_URL}`);
    console.log(`Buscando sitemap de ${BASE_URL}/sitemap.xml...`);

    const rawUrls = await fetchSitemap();
    result.totalUrls = rawUrls.length;
    console.log(`Encontradas ${rawUrls.length} URLs\n`);

    // Normaliza URLs de produção para BASE_URL local
    const urls = rawUrls.map(url => normalizeUrl(url));

    // Verificar se há URLs privadas no sitemap (não deveria haver)
    const privatePatterns = ['/admin', '/dev', '/api/immunity', '/api/admin', '/api/supabase'];
    for (const url of urls) {
        for (const pattern of privatePatterns) {
            if (url.includes(pattern)) {
                result.privateUrls.push(url);
                result.valid = false;
            }
        }
    }

    // Verificar cada URL (com rate limiting)
    const BATCH_SIZE = 10;
    for (let i = 0; i < urls.length; i += BATCH_SIZE) {
        const batch = urls.slice(i, i + BATCH_SIZE);
        const results = await Promise.all(batch.map(async url => {
            const check = await checkUrl(url);
            return { url, ...check };
        }));

        for (const r of results) {
            if (r.ok) {
                result.successUrls++;
                process.stdout.write('.');
            } else {
                result.failedUrls.push({ url: r.url, status: r.status });
                result.valid = false;
                process.stdout.write('x');
            }
        }
    }

    console.log('\n\n' + '='.repeat(50));
    console.log(`Total: ${result.totalUrls}`);
    console.log(`Sucesso (200): ${result.successUrls}`);
    console.log(`Falhas: ${result.failedUrls.length}`);
    console.log(`URLs privadas no sitemap: ${result.privateUrls.length}`);
    console.log('='.repeat(50));

    if (result.failedUrls.length > 0) {
        console.log('\n❌ URLs com FALHA:');
        result.failedUrls.forEach(f => console.log(`  ${f.status} - ${f.url}`));
    }

    if (result.privateUrls.length > 0) {
        console.log('\n🔒 URLs PRIVADAS no sitemap (ERRO!):');
        result.privateUrls.forEach(u => console.log(`  ${u}`));
    }

    if (result.valid) {
        console.log('\n✅ SITEMAP VÁLIDO!');
    } else {
        console.log('\n❌ FALHOU - Corrija os erros acima');
        process.exit(1);
    }

    return result;
}

validateSitemap().catch(err => {
    console.error('Erro:', err.message);
    console.log('\n⚠️ Certifique-se de que o servidor está rodando: npm run dev');
    process.exit(1);
});
