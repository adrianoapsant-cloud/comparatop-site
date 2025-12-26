#!/usr/bin/env node
/**
 * ComparaTop - Smoke Tests
 * 
 * Validates the build output (dist/) or production site.
 * 
 * Usage:
 *   node tools/smoke-test.js           # Test dist/ locally
 *   node tools/smoke-test.js --prod    # Test production
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

// Configuration
const CONFIG = {
    distDir: path.join(__dirname, '..', 'dist'),
    prodUrl: 'https://comparatop.com.br',
    localPort: 3000,
    // Golden paths to test
    paths: {
        home: '/',
        categoryCanonical: '/geladeiras/',           // URL canônica (deve retornar 200)
        categoryAlias: '/categoria/geladeira/',      // Alias (deve retornar 301)
        product: '/produto/geladeira/brm44hb/',
        comparison: '/comparar/brm44hb-vs-tf55/',
        notFound: '/pagina-que-nao-existe-12345/',
        sitemap: '/sitemap.xml',
        robots: '/robots.txt'
    },
    // Redirects esperados (from → to)
    expectedRedirects: {
        '/categoria/geladeira/': '/geladeiras/'
    }
};

// Colors
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

let passed = 0;
let failed = 0;

function log(type, message) {
    const prefix = {
        pass: `${colors.green}✅${colors.reset}`,
        fail: `${colors.red}❌${colors.reset}`,
        info: `${colors.cyan}ℹ️${colors.reset}`,
        warn: `${colors.yellow}⚠️${colors.reset}`
    };
    console.log(`${prefix[type] || ''} ${message}`);

    if (type === 'pass') passed++;
    if (type === 'fail') failed++;
}

// Check if file exists in dist
function checkDistFile(relativePath) {
    let filePath = relativePath;
    if (filePath.endsWith('/')) {
        filePath += 'index.html';
    }

    const fullPath = path.join(CONFIG.distDir, filePath);
    return fs.existsSync(fullPath);
}

// Read file from dist
function readDistFile(relativePath) {
    let filePath = relativePath;
    if (filePath.endsWith('/')) {
        filePath += 'index.html';
    }

    const fullPath = path.join(CONFIG.distDir, filePath);
    try {
        return fs.readFileSync(fullPath, 'utf-8');
    } catch (err) {
        return null;
    }
}

// HTTP request helper (doesn't follow redirects)
function httpGet(url, followRedirects = false) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const options = { timeout: 10000 };

        const req = client.get(url, options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: body
                });
            });
        });
        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
    });
}

// Test dist/ locally
async function testDist() {
    console.log(`\n${colors.bold}=== Testing dist/ ===${colors.reset}`);
    console.log(`Directory: ${CONFIG.distDir}`);

    if (!fs.existsSync(CONFIG.distDir)) {
        log('fail', 'dist/ não existe. Execute npm run build primeiro.');
        return;
    }

    // Test 200 pages exist
    console.log('\n--- Pages that should exist (200) ---');

    const shouldExist = ['home', 'categoryCanonical', 'product', 'comparison', 'sitemap', 'robots'];
    for (const key of shouldExist) {
        const urlPath = CONFIG.paths[key];
        const exists = checkDistFile(urlPath);
        if (exists) {
            log('pass', `${key}: ${urlPath} existe`);
        } else {
            log('fail', `${key}: ${urlPath} NÃO existe`);
        }
    }

    // Test that alias path does NOT exist in dist (redirect handled by server)
    console.log('\n--- Alias paths (should NOT exist in dist) ---');
    const aliasExists = checkDistFile(CONFIG.paths.categoryAlias);
    if (!aliasExists) {
        log('pass', `categoryAlias: ${CONFIG.paths.categoryAlias} NÃO existe (correto, redirect via servidor)`);
    } else {
        log('warn', `categoryAlias: ${CONFIG.paths.categoryAlias} EXISTE (pode causar duplicação)`);
    }

    // Test 404 page exists but random path doesn't
    console.log('\n--- 404 handling ---');
    const notFoundExists = checkDistFile(CONFIG.paths.notFound);
    const page404Exists = checkDistFile('/404.html');

    if (!notFoundExists && page404Exists) {
        log('pass', '404.html existe e página inválida não existe');
    } else if (notFoundExists) {
        log('fail', 'Página inválida NÃO deveria existir');
    } else if (!page404Exists) {
        log('fail', '404.html não existe');
    }

    // Test sitemap content
    console.log('\n--- Sitemap validation ---');
    const sitemapContent = readDistFile('/sitemap.xml');
    if (sitemapContent) {
        if (sitemapContent.includes('<?xml')) {
            log('pass', 'sitemap.xml é XML válido');
        } else {
            log('fail', 'sitemap.xml não parece ser XML');
        }

        // Check for canonical URL (should be present)
        if (sitemapContent.includes('/geladeiras/')) {
            log('pass', 'sitemap contém URL canônica /geladeiras/');
        } else {
            log('fail', 'sitemap NÃO contém URL canônica /geladeiras/');
        }

        if (!sitemapContent.includes('/categoria/')) {
            log('pass', 'sitemap NÃO contém paths legados /categoria/ (correto)');
        } else {
            log('fail', 'sitemap CONTÉM paths legados /categoria/ (deveria usar canônica)');
        }

        if (sitemapContent.includes('/produto/geladeira/brm44hb/')) {
            log('pass', 'sitemap contém produto golden (brm44hb)');
        } else {
            log('fail', 'sitemap NÃO contém produto golden');
        }

        const urlCount = (sitemapContent.match(/<url>/g) || []).length;
        log('info', `sitemap contém ${urlCount} URLs`);
    } else {
        log('fail', 'Não foi possível ler sitemap.xml');
    }

    // Test canonical tags
    console.log('\n--- Canonical tags ---');
    const productHtml = readDistFile(CONFIG.paths.product);
    if (productHtml) {
        if (productHtml.includes('rel="canonical"')) {
            log('pass', 'produto tem tag canonical');
        } else {
            log('fail', 'produto NÃO tem tag canonical');
        }

        if (productHtml.includes('<h1')) {
            log('pass', 'produto tem tag H1');
        } else {
            log('fail', 'produto NÃO tem tag H1');
        }

        // Check for pre-rendered content
        if (productHtml.includes('prerendered-content') || productHtml.includes('itemprop="name"')) {
            log('pass', 'produto tem conteúdo pré-renderizado');
        } else {
            log('fail', 'produto pode NÃO ter conteúdo pré-renderizado');
        }
    } else {
        log('fail', 'Não foi possível ler página de produto');
    }

    // Test JSON-LD
    console.log('\n--- JSON-LD validation ---');
    if (productHtml) {
        // Extract all JSON-LD blocks
        const jsonLdMatches = productHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];

        if (jsonLdMatches.length > 0) {
            log('pass', `produto tem ${jsonLdMatches.length} bloco(s) JSON-LD`);

            let hasProduct = false;
            let hasBreadcrumb = false;
            let allValid = true;

            for (const match of jsonLdMatches) {
                const jsonContent = match.replace(/<script type="application\/ld\+json">/, '').replace(/<\/script>/, '');
                try {
                    const parsed = JSON.parse(jsonContent);

                    if (!parsed['@context'] || !parsed['@type']) {
                        log('fail', 'JSON-LD sem @context ou @type');
                        allValid = false;
                    }

                    if (parsed['@type'] === 'Product') hasProduct = true;
                    if (parsed['@type'] === 'BreadcrumbList') hasBreadcrumb = true;

                    // Check we're NOT inventing ratings
                    if (parsed.aggregateRating && !parsed.aggregateRating.reviewCount) {
                        log('fail', 'aggregateRating sem reviewCount (dados inventados?)');
                        allValid = false;
                    }
                } catch (err) {
                    log('fail', `JSON-LD inválido: ${err.message}`);
                    allValid = false;
                }
            }

            if (allValid) {
                log('pass', 'todos os JSON-LD são válidos');
            }
            if (hasProduct) {
                log('pass', 'JSON-LD contém @type Product');
            } else {
                log('fail', 'JSON-LD NÃO contém @type Product');
            }
            if (hasBreadcrumb) {
                log('pass', 'JSON-LD contém @type BreadcrumbList');
            } else {
                log('fail', 'JSON-LD NÃO contém @type BreadcrumbList');
            }
        } else {
            log('fail', 'produto NÃO tem JSON-LD');
        }
    }

    // Test category JSON-LD
    const categoryHtml = readDistFile(CONFIG.paths.categoryCanonical);
    if (categoryHtml) {
        const jsonLdMatches = categoryHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];

        if (jsonLdMatches.length > 0) {
            let hasItemList = false;
            for (const match of jsonLdMatches) {
                const jsonContent = match.replace(/<script type="application\/ld\+json">/, '').replace(/<\/script>/, '');
                try {
                    const parsed = JSON.parse(jsonContent);
                    if (parsed['@type'] === 'ItemList') hasItemList = true;
                } catch (err) { /* ignore */ }
            }
            if (hasItemList) {
                log('pass', 'categoria tem JSON-LD ItemList');
            } else {
                log('fail', 'categoria NÃO tem JSON-LD ItemList');
            }
        }
    }
}

// Test production site
async function testProd() {
    console.log(`\n${colors.bold}=== Testing Production ===${colors.reset}`);
    console.log(`URL: ${CONFIG.prodUrl}`);

    // Test 200 responses
    console.log('\n--- Pages that should return 200 ---');

    const shouldReturn200 = ['home', 'categoryCanonical', 'product', 'sitemap', 'robots'];
    for (const key of shouldReturn200) {
        const urlPath = CONFIG.paths[key];
        const fullUrl = CONFIG.prodUrl + urlPath;

        try {
            const response = await httpGet(fullUrl);
            if (response.statusCode === 200) {
                log('pass', `${key}: ${urlPath} → 200`);
            } else {
                log('fail', `${key}: ${urlPath} → ${response.statusCode} (esperado 200)`);
            }
        } catch (err) {
            log('fail', `${key}: ${urlPath} → Erro: ${err.message}`);
        }
    }

    // Test redirects (301)
    console.log('\n--- Redirects (301) ---');
    for (const [fromPath, toPath] of Object.entries(CONFIG.expectedRedirects)) {
        const fullUrl = CONFIG.prodUrl + fromPath;

        try {
            const response = await httpGet(fullUrl);
            if (response.statusCode === 301 || response.statusCode === 302) {
                const location = response.headers.location || '';
                // Check if location ends with expected path
                if (location.endsWith(toPath) || location === toPath) {
                    log('pass', `${fromPath} → ${response.statusCode} → ${toPath}`);
                } else {
                    log('fail', `${fromPath} → ${response.statusCode} mas Location: ${location} (esperado ${toPath})`);
                }
            } else {
                log('fail', `${fromPath} → ${response.statusCode} (esperado 301)`);
            }
        } catch (err) {
            log('fail', `${fromPath} → Erro: ${err.message}`);
        }
    }

    // Test 404
    console.log('\n--- 404 response ---');
    try {
        const response = await httpGet(CONFIG.prodUrl + CONFIG.paths.notFound);
        if (response.statusCode === 404) {
            log('pass', 'Página inexistente → 404');
        } else {
            log('fail', `Página inexistente → ${response.statusCode} (esperado 404)`);
        }
    } catch (err) {
        log('fail', `Erro ao testar 404: ${err.message}`);
    }

    // Test sitemap content
    console.log('\n--- Sitemap validation ---');
    try {
        const response = await httpGet(CONFIG.prodUrl + '/sitemap.xml');
        if (response.body.includes('<?xml')) {
            log('pass', 'sitemap.xml é XML válido');
        } else {
            log('fail', 'sitemap.xml não parece ser XML');
        }

        // Check for canonical URL
        if (response.body.includes('/geladeiras/')) {
            log('pass', 'sitemap contém URL canônica /geladeiras/');
        } else {
            log('fail', 'sitemap NÃO contém URL canônica');
        }

        if (!response.body.includes('/categoria/')) {
            log('pass', 'sitemap NÃO contém paths legados /categoria/');
        } else {
            log('fail', 'sitemap CONTÉM paths legados (deveria usar canônica)');
        }

        if (response.body.includes('/produto/')) {
            log('pass', 'sitemap contém páginas de produto');
        } else {
            log('fail', 'sitemap NÃO contém produtos');
        }

        const urlCount = (response.body.match(/<url>/g) || []).length;
        log('info', `sitemap contém ${urlCount} URLs`);
    } catch (err) {
        log('fail', `Erro ao verificar sitemap: ${err.message}`);
    }

    // Test canonical and SEO
    console.log('\n--- Canonical and SEO ---');
    try {
        const response = await httpGet(CONFIG.prodUrl + CONFIG.paths.product);

        if (response.body.includes('rel="canonical"')) {
            log('pass', 'produto tem tag canonical');
        } else {
            log('fail', 'produto NÃO tem tag canonical');
        }

        if (response.body.includes('application/ld+json')) {
            log('pass', 'produto tem JSON-LD');
        } else {
            log('fail', 'produto NÃO tem JSON-LD');
        }
    } catch (err) {
        log('fail', `Erro ao verificar SEO: ${err.message}`);
    }
}

async function main() {
    console.log(colors.bold + '\n🧪 ComparaTop - Smoke Tests' + colors.reset);
    console.log(`Data: ${new Date().toISOString()}`);

    const isProd = process.argv.includes('--prod');

    if (isProd) {
        await testProd();
    } else {
        await testDist();
    }

    // Summary
    console.log('\n' + colors.bold + '=== RESUMO ===' + colors.reset);
    console.log(`Passou: ${passed}`);
    console.log(`Falhou: ${failed}`);

    console.log('\n' + colors.bold + '=== VEREDITO ===' + colors.reset);
    if (failed === 0) {
        console.log(colors.green + '🟢 TODOS OS TESTES PASSARAM' + colors.reset);
        process.exit(0);
    } else {
        console.log(colors.red + `🔴 ${failed} TESTE(S) FALHOU(RAM)` + colors.reset);
        process.exit(1);
    }
}

main().catch(err => {
    console.error('Erro fatal:', err);
    process.exit(1);
});
