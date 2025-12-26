#!/usr/bin/env node
/**
 * ComparaTop QA de PRODUÇÃO
 * Valida que o site em produção está servindo o build correto
 * 
 * Uso: node qa-prod.js
 * 
 * Exit codes:
 *   0 = Todos os testes passaram
 *   1 = Falha crítica (P0)
 */

const https = require('https');

const BASE_URL = 'https://comparatop.com.br';
const EXPECTED_COMMIT = '0cecaa1';
const ERRORS = [];
const PASSES = [];

function fetch(path) {
    return new Promise((resolve, reject) => {
        const url = BASE_URL + path;
        https.get(url, { headers: { 'Cache-Control': 'no-cache' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: data, headers: res.headers }));
        }).on('error', reject);
    });
}

async function run() {
    console.log('🔍 ComparaTop QA de PRODUÇÃO\n');
    console.log(`Base URL: ${BASE_URL}`);
    console.log(`Expected commit: ${EXPECTED_COMMIT}\n`);

    // AÇÃO 0: Build fingerprint
    console.log('=== AÇÃO 0: Build Fingerprint ===');
    try {
        const buildTxt = await fetch('/build.txt');
        if (buildTxt.status === 200 && buildTxt.body.includes(EXPECTED_COMMIT)) {
            PASSES.push('build.txt contém commit esperado');
            console.log(`✅ build.txt: commit ${EXPECTED_COMMIT} encontrado`);
        } else {
            ERRORS.push(`build.txt não contém commit ${EXPECTED_COMMIT}`);
            console.log(`❌ build.txt: commit incorreto ou não encontrado`);
            console.log(`   Status: ${buildTxt.status}`);
            console.log(`   Conteúdo: ${buildTxt.body.substring(0, 200)}`);
        }
    } catch (e) {
        ERRORS.push('build.txt não acessível');
        console.log(`❌ build.txt: erro ao acessar - ${e.message}`);
    }

    // AÇÃO 1: "Carregando catálogo" 
    console.log('\n=== AÇÃO 1: "Carregando catálogo" ===');
    const pagesToCheck = [
        { path: '/', name: 'Home' },
        { path: '/categoria/geladeira/', name: 'Categoria' },
        { path: '/comparar/brm44hb-vs-tf55/', name: 'Comparação' }
    ];

    for (const page of pagesToCheck) {
        try {
            const res = await fetch(page.path);
            if (res.body.includes('Carregando catálogo')) {
                ERRORS.push(`${page.name} contém "Carregando catálogo"`);
                console.log(`❌ ${page.name}: contém "Carregando catálogo"`);
            } else {
                PASSES.push(`${page.name} sem "Carregando catálogo"`);
                console.log(`✅ ${page.name}: OK`);
            }
        } catch (e) {
            ERRORS.push(`${page.name}: erro ao acessar`);
            console.log(`❌ ${page.name}: erro - ${e.message}`);
        }
    }

    // AÇÃO 2: Ofertas sem nome
    console.log('\n=== AÇÃO 2: Ofertas sem nome ===');
    try {
        const compare = await fetch('/comparar/brm44hb-vs-tf55/');
        const emptyStrong = (compare.body.match(/<strong><\/strong>/g) || []).length;
        const colonPrice = (compare.body.match(/<li>:\s*R\$/g) || []).length;

        if (emptyStrong === 0 && colonPrice === 0) {
            PASSES.push('Comparação: todas ofertas têm nome');
            console.log('✅ Comparação: todas ofertas têm nome de loja');
        } else {
            ERRORS.push(`Comparação: ofertas sem nome (empty: ${emptyStrong}, colon: ${colonPrice})`);
            console.log(`❌ Comparação: ofertas sem nome (empty: ${emptyStrong}, colon: ${colonPrice})`);
        }
    } catch (e) {
        ERRORS.push('Comparação: erro ao verificar ofertas');
    }

    // AÇÃO 3: /geladeiras/
    console.log('\n=== AÇÃO 3: /geladeiras/ ===');
    try {
        const geladeiras = await fetch('/geladeiras/');
        if (geladeiras.status === 200) {
            PASSES.push('/geladeiras/ retorna 200');
            console.log('✅ /geladeiras/: 200 OK');
        } else if (geladeiras.status === 301 || geladeiras.status === 302) {
            PASSES.push(`/geladeiras/ redireciona (${geladeiras.status})`);
            console.log(`✅ /geladeiras/: ${geladeiras.status} redirect`);
        } else {
            ERRORS.push(`/geladeiras/ retorna ${geladeiras.status}`);
            console.log(`❌ /geladeiras/: ${geladeiras.status}`);
        }
    } catch (e) {
        ERRORS.push('/geladeiras/: erro ao acessar');
        console.log(`❌ /geladeiras/: erro - ${e.message}`);
    }

    // AÇÃO 4: robots.txt
    console.log('\n=== AÇÃO 4: robots.txt ===');
    try {
        const robots = await fetch('/robots.txt');
        console.log(`Status: ${robots.status}`);

        const hasCloudflareManaged = robots.body.includes('Cloudflare');
        const hasGPTBotDisallow = robots.body.includes('GPTBot') && robots.body.includes('Disallow');
        const hasSitemap = robots.body.includes('Sitemap:');

        if (hasCloudflareManaged) {
            console.log('⚠️ Cloudflare está injetando conteúdo no robots.txt');
            console.log('   Primeiro 500 chars:');
            console.log(robots.body.substring(0, 500));
        } else {
            console.log('✅ Sem injeção Cloudflare');
        }

        if (hasSitemap) {
            PASSES.push('robots.txt contém Sitemap');
            console.log('✅ Contém referência ao Sitemap');
        }
    } catch (e) {
        console.log(`❌ robots.txt: erro - ${e.message}`);
    }

    // P1: Arquivos essenciais
    console.log('\n=== P1: Arquivos essenciais ===');
    const essentials = ['/robots.txt', '/sitemap.xml', '/llms.txt', '/metodologia/', '/sobre/'];
    for (const path of essentials) {
        try {
            const res = await fetch(path);
            if (res.status === 200) {
                console.log(`✅ ${path}: 200`);
            } else {
                console.log(`⚠️ ${path}: ${res.status}`);
            }
        } catch (e) {
            console.log(`❌ ${path}: erro`);
        }
    }

    // Resultado
    console.log('\n========================================');
    console.log(`✅ Passou: ${PASSES.length}`);
    console.log(`❌ Falhou: ${ERRORS.length}`);

    if (ERRORS.length > 0) {
        console.log('\nERROS:');
        ERRORS.forEach(e => console.log(`  - ${e}`));
        console.log('\n❌ QA DE PRODUÇÃO FALHOU');
        process.exit(1);
    } else {
        console.log('\n✅ QA DE PRODUÇÃO PASSOU');
        process.exit(0);
    }
}

run().catch(e => {
    console.error('Erro fatal:', e);
    process.exit(1);
});
