#!/usr/bin/env node
/**
 * ComparaTop - Production Validation Script
 * 
 * Validates that the production site meets SEO requirements:
 * - 404 real for non-existent routes
 * - HTML contains SEO content (title, canonical, OG, JSON-LD, H1)
 * - Sitemap is consistent with canonicals
 * 
 * Usage: node tools/validate-prod.js [domain]
 * Example: node tools/validate-prod.js https://comparatop.com.br
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Configuration
const DEFAULT_DOMAIN = 'https://comparatop.com.br';
const DOMAIN = process.argv[2] || DEFAULT_DOMAIN;

// Colors for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

function log(type, message) {
    const prefix = {
        pass: `${colors.green}✅ PASS${colors.reset}`,
        fail: `${colors.red}❌ FAIL${colors.reset}`,
        info: `${colors.cyan}ℹ️  INFO${colors.reset}`,
        warn: `${colors.yellow}⚠️  WARN${colors.reset}`
    };
    console.log(`${prefix[type] || ''} ${message}`);
}

// HTTP request helper
function request(url, options = {}) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const protocol = parsedUrl.protocol === 'https:' ? https : http;

        const req = protocol.request(url, {
            method: options.method || 'GET',
            headers: options.headers || {}
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    body: data
                });
            });
        });

        req.on('error', reject);
        req.end();
    });
}

// Test 1: 404 Real
async function test404Real() {
    console.log('\n' + colors.bold + '=== TESTE 1: 404 Real ===' + colors.reset);

    const url = `${DOMAIN}/produto/geladeira/nao-existe-xyz123`;
    console.log(`URL: ${url}`);

    try {
        const res = await request(url, { method: 'HEAD' });
        console.log(`Status: HTTP ${res.status}`);

        if (res.status === 404) {
            log('pass', '404 real retornado para rota inexistente');
            return { pass: true, status: res.status };
        } else {
            log('fail', `Esperado 404, recebido ${res.status}`);
            return { pass: false, status: res.status };
        }
    } catch (err) {
        log('fail', `Erro de conexão: ${err.message}`);
        return { pass: false, error: err.message };
    }
}

// Test 2: Product page HTML
async function testProductPage() {
    console.log('\n' + colors.bold + '=== TESTE 2: Página de Produto ===' + colors.reset);

    const url = `${DOMAIN}/produto/geladeira/brm44hb/`;
    console.log(`URL: ${url}`);

    try {
        const res = await request(url);
        const html = res.body;

        const checks = {
            status200: res.status === 200,
            hasTitle: /<title>.*BRM44HB.*<\/title>/i.test(html),
            hasCanonical: /rel="canonical".*brm44hb\//i.test(html),
            hasOgTitle: /og:title/i.test(html),
            hasOgUrl: /og:url/i.test(html),
            hasJsonLd: /application\/ld\+json/i.test(html),
            hasH1: /<h1[^>]*>.*[^<]+<\/h1>/i.test(html)
        };

        console.log('\nVerificações:');
        log(checks.status200 ? 'pass' : 'fail', `Status 200: ${res.status}`);
        log(checks.hasTitle ? 'pass' : 'fail', `<title> com nome do produto`);
        log(checks.hasCanonical ? 'pass' : 'fail', `Canonical com trailing slash`);
        log(checks.hasOgTitle ? 'pass' : 'fail', `og:title presente`);
        log(checks.hasOgUrl ? 'pass' : 'fail', `og:url presente`);
        log(checks.hasJsonLd ? 'pass' : 'fail', `JSON-LD presente`);
        log(checks.hasH1 ? 'pass' : 'fail', `<h1> no HTML inicial`);

        const allPassed = Object.values(checks).every(v => v);
        return { pass: allPassed, checks, html: html.substring(0, 500) };
    } catch (err) {
        log('fail', `Erro de conexão: ${err.message}`);
        return { pass: false, error: err.message };
    }
}

// Test 3: Comparison page HTML
async function testComparisonPage() {
    console.log('\n' + colors.bold + '=== TESTE 3: Página de Comparação ===' + colors.reset);

    const url = `${DOMAIN}/comparar/brm44hb-vs-tf55/`;
    console.log(`URL: ${url}`);

    try {
        const res = await request(url);
        const html = res.body;

        const checks = {
            status200: res.status === 200,
            hasTitle: /<title>.*vs.*<\/title>/i.test(html),
            hasCanonical: /rel="canonical".*brm44hb-vs-tf55\//i.test(html),
            hasOgTitle: /og:title/i.test(html),
            hasJsonLd: /application\/ld\+json/i.test(html),
            hasH1: /<h1[^>]*>.*vs.*<\/h1>/i.test(html)
        };

        console.log('\nVerificações:');
        log(checks.status200 ? 'pass' : 'fail', `Status 200: ${res.status}`);
        log(checks.hasTitle ? 'pass' : 'fail', `<title> com "vs"`);
        log(checks.hasCanonical ? 'pass' : 'fail', `Canonical com trailing slash`);
        log(checks.hasOgTitle ? 'pass' : 'fail', `og:title presente`);
        log(checks.hasJsonLd ? 'pass' : 'fail', `JSON-LD presente`);
        log(checks.hasH1 ? 'pass' : 'fail', `<h1> com comparação no HTML`);

        const allPassed = Object.values(checks).every(v => v);
        return { pass: allPassed, checks };
    } catch (err) {
        log('fail', `Erro de conexão: ${err.message}`);
        return { pass: false, error: err.message };
    }
}

// Test 4: Sitemap
async function testSitemap() {
    console.log('\n' + colors.bold + '=== TESTE 4: Sitemap ===' + colors.reset);

    const url = `${DOMAIN}/sitemap.xml`;
    console.log(`URL: ${url}`);

    try {
        const res = await request(url);
        const xml = res.body;

        const urls = xml.match(/<loc>([^<]+)<\/loc>/g) || [];
        const urlList = urls.map(u => u.replace(/<\/?loc>/g, ''));

        const checks = {
            status200: res.status === 200,
            isXml: xml.includes('<?xml'),
            hasUrls: urlList.length > 0,
            hasTrailingSlash: urlList.every(u => u.endsWith('/') || u === DOMAIN),
            hasProducts: urlList.some(u => u.includes('/produto/')),
            hasComparisons: urlList.some(u => u.includes('/comparar/'))
        };

        console.log('\nVerificações:');
        log(checks.status200 ? 'pass' : 'fail', `Status 200: ${res.status}`);
        log(checks.isXml ? 'pass' : 'fail', `É XML válido`);
        log(checks.hasUrls ? 'pass' : 'fail', `Contém ${urlList.length} URLs`);
        log(checks.hasTrailingSlash ? 'pass' : 'fail', `Todas URLs com trailing slash`);
        log(checks.hasProducts ? 'pass' : 'fail', `Inclui páginas de produtos`);
        log(checks.hasComparisons ? 'pass' : 'fail', `Inclui páginas de comparação`);

        console.log('\nURLs encontradas:');
        urlList.slice(0, 10).forEach(u => console.log(`  - ${u}`));
        if (urlList.length > 10) console.log(`  ... e mais ${urlList.length - 10}`);

        const allPassed = Object.values(checks).every(v => v);
        return { pass: allPassed, checks, urls: urlList };
    } catch (err) {
        log('fail', `Erro de conexão: ${err.message}`);
        return { pass: false, error: err.message };
    }
}

// Main
async function main() {
    console.log(colors.bold + '\n🔍 ComparaTop - Validação de Produção' + colors.reset);
    console.log(`Domínio: ${DOMAIN}`);
    console.log(`Data: ${new Date().toISOString()}`);

    const results = {
        test404: await test404Real(),
        testProduct: await testProductPage(),
        testComparison: await testComparisonPage(),
        testSitemap: await testSitemap()
    };

    // Summary
    console.log('\n' + colors.bold + '=== RESUMO ===' + colors.reset);

    const allPassed = Object.values(results).every(r => r.pass);

    console.log(`\nTeste 404 Real:     ${results.test404.pass ? '✅' : '❌'}`);
    console.log(`Página Produto:     ${results.testProduct.pass ? '✅' : '❌'}`);
    console.log(`Página Comparação:  ${results.testComparison.pass ? '✅' : '❌'}`);
    console.log(`Sitemap:            ${results.testSitemap.pass ? '✅' : '❌'}`);

    console.log('\n' + colors.bold + '=== VEREDITO FINAL ===' + colors.reset);
    if (allPassed) {
        console.log(colors.green + '🟢 APROVADO - Site pronto para produção!' + colors.reset);
    } else {
        console.log(colors.red + '🔴 REPROVADO - Verifique os itens falhos acima' + colors.reset);
    }

    process.exit(allPassed ? 0 : 1);
}

main().catch(err => {
    console.error('Erro fatal:', err);
    process.exit(1);
});
