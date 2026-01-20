/**
 * @file integrity-links.ts
 * @description Rastreia links internos e valida que não há 404s
 * 
 * LINK CONTRACTS:
 * - Links são ignorados APENAS via marcação explícita no HTML:
 *   - data-integrity="ignore"
 *   - aria-disabled="true"
 *   - href vazio/ausente/#
 * 
 * Roda: npx tsx scripts/integrity-links.ts
 * Requer: servidor rodando no BASE_URL (padrão localhost:3000)
 * 
 * @see docs/LINK_CONTRACTS.md
 */

import { resolveBaseUrl } from './_baseUrl';

const BASE_URL = resolveBaseUrl();

// Páginas raiz para começar o crawl
const SEED_PAGES = [
    '/',
    '/categorias/smart-tvs',
    '/categorias/geladeiras',
    '/comparar',
];

// NOTA: Regex patterns foram REMOVIDOS intencionalmente
// Links opcionais agora são marcados via data-integrity="ignore" no HTML
// Ver docs/LINK_CONTRACTS.md

interface LinkResult {
    valid: boolean;
    totalLinks: number;
    brokenLinks: Array<{ from: string; to: string; status: number | string }>;
    checkedPages: number;
    ignoredByAttribute: number;
}

interface ExtractedLink {
    href: string;
    ignored: boolean;
    ignoreReason?: 'data-integrity' | 'aria-disabled' | 'no-href';
}

/**
 * Extrai links internos do HTML, marcando quais devem ser ignorados
 */
async function extractInternalLinks(url: string): Promise<ExtractedLink[]> {
    try {
        const response = await fetch(url);
        if (!response.ok) return [];

        const html = await response.text();
        const links: ExtractedLink[] = [];

        // Regex aprimorado para capturar tags <a> completas
        // Captura: <a ...attributes...>
        const anchorTagRegex = /<a\s+([^>]*)>/gi;
        let match;

        while ((match = anchorTagRegex.exec(html)) !== null) {
            const attributes = match[1];

            // Verifica se deve ser ignorado
            const hasDataIntegrityIgnore = /data-integrity\s*=\s*["']ignore["']/i.test(attributes);
            const hasAriaDisabled = /aria-disabled\s*=\s*["']true["']/i.test(attributes);

            // Extrai href
            const hrefMatch = attributes.match(/href\s*=\s*["']([^"'#][^"']*)["']/);
            const href = hrefMatch ? hrefMatch[1] : null;

            // Sem href ou href="#" = ignorar
            if (!href || href === '#' || href.startsWith('#')) {
                continue; // Não adiciona links sem destino
            }

            // Só processa links internos (começam com /)
            if (!href.startsWith('/')) continue;

            // Ignora rotas internas/API/admin
            if (
                href.startsWith('/_next') ||
                href.startsWith('/api') ||
                href.startsWith('/admin') ||
                href.startsWith('/dev')
            ) {
                continue;
            }

            // Determina se deve ser ignorado por marcação
            let ignored = false;
            let ignoreReason: ExtractedLink['ignoreReason'];

            if (hasDataIntegrityIgnore) {
                ignored = true;
                ignoreReason = 'data-integrity';
            } else if (hasAriaDisabled) {
                ignored = true;
                ignoreReason = 'aria-disabled';
            }

            links.push({
                href,
                ignored,
                ignoreReason,
            });
        }

        // Remove duplicatas mantendo info de ignore
        const uniqueLinks = new Map<string, ExtractedLink>();
        for (const link of links) {
            const existing = uniqueLinks.get(link.href);
            // Se já existe e o novo não é ignorado, sobrescreve
            if (!existing || (!link.ignored && existing.ignored)) {
                uniqueLinks.set(link.href, link);
            }
        }

        return Array.from(uniqueLinks.values());
    } catch {
        return [];
    }
}

async function checkLink(url: string): Promise<{ status: number | string; ok: boolean; responseTime: number }> {
    const start = Date.now();
    try {
        const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
        const responseTime = Date.now() - start;
        return { status: response.status, ok: response.ok, responseTime };
    } catch {
        return { status: 'NETWORK_ERROR', ok: false, responseTime: Date.now() - start };
    }
}

async function crawlAndValidate(): Promise<LinkResult> {
    const result: LinkResult = {
        valid: true,
        totalLinks: 0,
        brokenLinks: [],
        checkedPages: 0,
        ignoredByAttribute: 0,
    };

    const checkedUrls = new Set<string>();
    const toCheck = new Set<string>(SEED_PAGES);
    const allLinks = new Map<string, { sources: Set<string>; ignored: boolean; ignoreReason?: string }>();
    const linkTimes: Array<{ url: string; time: number }> = [];

    console.log('\n🔗 INTEGRITY:LINKS (Attribute-Based Contracts)');
    console.log('='.repeat(60));
    console.log(`BASE_URL: ${BASE_URL}`);
    console.log('Crawling a partir das páginas raiz...\n');

    // Crawl fase 1: coletar todos os links
    while (toCheck.size > 0 && checkedUrls.size < 50) { // Limite de 50 páginas
        const page = [...toCheck][0];
        toCheck.delete(page);

        if (checkedUrls.has(page)) continue;
        checkedUrls.add(page);

        const fullUrl = `${BASE_URL}${page}`;
        const links = await extractInternalLinks(fullUrl);

        for (const link of links) {
            if (!allLinks.has(link.href)) {
                allLinks.set(link.href, {
                    sources: new Set(),
                    ignored: link.ignored,
                    ignoreReason: link.ignoreReason,
                });
            }

            const entry = allLinks.get(link.href)!;
            entry.sources.add(page);

            // Se já estava marcado como ignorado mas este não é, atualiza
            if (!link.ignored && entry.ignored) {
                entry.ignored = false;
                entry.ignoreReason = undefined;
            }

            if (!checkedUrls.has(link.href) && link.href !== page && !link.ignored) {
                toCheck.add(link.href);
            }
        }

        result.checkedPages++;
        process.stdout.write(`Páginas: ${result.checkedPages}, Links: ${allLinks.size}\r`);
    }

    console.log(`\n\nEncontrados ${allLinks.size} links únicos em ${result.checkedPages} páginas`);

    // Contagem de ignorados por tipo
    const ignoredStats = { 'data-integrity': 0, 'aria-disabled': 0 };
    for (const [, info] of allLinks) {
        if (info.ignored && info.ignoreReason) {
            ignoredStats[info.ignoreReason as keyof typeof ignoredStats]++;
            result.ignoredByAttribute++;
        }
    }

    console.log('\n📋 LINKS IGNORADOS POR MARCAÇÃO:');
    console.log(`  data-integrity="ignore": ${ignoredStats['data-integrity']}`);
    console.log(`  aria-disabled="true": ${ignoredStats['aria-disabled']}`);
    console.log(`  Total ignorados: ${result.ignoredByAttribute}`);
    console.log('\nVerificando links obrigatórios...\n');

    // Fase 2: verificar cada link NÃO ignorado
    result.totalLinks = allLinks.size;
    let checked = 0;

    for (const [link, info] of allLinks) {
        if (info.ignored) {
            process.stdout.write('~');
            checked++;
            if (checked % 50 === 0) {
                process.stdout.write(` [${checked}/${result.totalLinks}]\n`);
            }
            continue;
        }

        const fullUrl = `${BASE_URL}${link}`;
        const check = await checkLink(fullUrl);

        linkTimes.push({ url: link, time: check.responseTime });

        if (!check.ok) {
            result.brokenLinks.push({
                from: [...info.sources][0],
                to: link,
                status: check.status,
            });
            result.valid = false;
            process.stdout.write('x');
        } else {
            process.stdout.write('.');
        }

        checked++;
        if (checked % 50 === 0) {
            process.stdout.write(` [${checked}/${result.totalLinks}]\n`);
        }
    }

    console.log('\n\n' + '='.repeat(60));
    console.log(`Total links encontrados: ${result.totalLinks}`);
    console.log(`Links ignorados por marcação: ${result.ignoredByAttribute}`);
    console.log(`Links verificados: ${result.totalLinks - result.ignoredByAttribute}`);
    console.log(`Links quebrados: ${result.brokenLinks.length}`);
    console.log('='.repeat(60));

    // Top 10 links mais lentos
    const slowest = linkTimes.sort((a, b) => b.time - a.time).slice(0, 10);
    if (slowest.length > 0 && slowest[0].time > 500) {
        console.log('\n⏱️ TOP 10 LINKS MAIS LENTOS:');
        slowest.forEach((l, i) => console.log(`  ${i + 1}. ${l.time}ms - ${l.url}`));
    }

    if (result.brokenLinks.length > 0) {
        console.log('\n❌ LINKS QUEBRADOS:');
        result.brokenLinks.forEach(b =>
            console.log(`  ${b.status} - ${b.to} (referenciado em ${b.from})`)
        );
    }

    if (result.valid) {
        console.log('\n✅ TODOS OS LINKS OK!');
    } else {
        console.log('\n❌ FALHOU - Corrija os links quebrados');
        process.exit(1);
    }

    return result;
}

crawlAndValidate().catch(err => {
    console.error('Erro:', err.message);
    console.log('\n⚠️ Certifique-se de que o servidor está rodando: npm run dev');
    process.exit(1);
});
