#!/usr/bin/env node
/**
 * ComparaTop SEO QA Script
 * Roda após build para validar que não há regressões de SEO
 * 
 * Uso: node qa-seo.js
 * 
 * Exit codes:
 *   0 = Todos os testes passaram
 *   1 = Falha em testes críticos (P0)
 *   2 = Falha em testes importantes (P1)
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, 'dist');
const ERRORS = [];
const WARNINGS = [];

// Helpers
function readFile(filePath) {
    const fullPath = path.join(DIST_DIR, filePath);
    if (!fs.existsSync(fullPath)) return null;
    return fs.readFileSync(fullPath, 'utf8');
}

function findAllHtml(dir = DIST_DIR, files = []) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
            findAllHtml(fullPath, files);
        } else if (item.endsWith('.html')) {
            files.push(fullPath.replace(DIST_DIR, '').replace(/\\/g, '/'));
        }
    }
    return files;
}

console.log('🔍 ComparaTop SEO QA\n');

// P0.1 - "Carregando catálogo" não pode existir
console.log('=== P0.1: Verificando "Carregando catálogo" ===');
const htmlFiles = findAllHtml();
let catalogoCount = 0;
for (const file of htmlFiles) {
    const content = readFile(file);
    if (content && content.includes('Carregando catálogo')) {
        catalogoCount++;
        ERRORS.push(`P0.1 FAIL: "${file}" contém "Carregando catálogo"`);
    }
}
if (catalogoCount === 0) {
    console.log('✅ Nenhum arquivo contém "Carregando catálogo"');
} else {
    console.log(`❌ ${catalogoCount} arquivos contêm "Carregando catálogo"`);
}

// P0.2 - Ofertas sem nome de loja
console.log('\n=== P0.2: Verificando ofertas sem nome ===');
const productPages = htmlFiles.filter(f => f.includes('/produto/') || f.includes('/comparar/'));
let offerIssues = 0;
for (const file of productPages) {
    const content = readFile(file);
    if (content) {
        const emptyStrong = (content.match(/<strong><\/strong>/g) || []).length;
        const colonPrice = (content.match(/<li>:\s*R\$/g) || []).length;
        if (emptyStrong > 0 || colonPrice > 0) {
            offerIssues++;
            ERRORS.push(`P0.2 FAIL: "${file}" tem ofertas sem nome (strong vazio: ${emptyStrong}, ': R$': ${colonPrice})`);
        }
    }
}
if (offerIssues === 0) {
    console.log('✅ Todas as ofertas têm nome de loja');
} else {
    console.log(`❌ ${offerIssues} páginas têm ofertas sem nome`);
}

// P1.1 - Arquivos essenciais existem
console.log('\n=== P1.1: Arquivos essenciais ===');
const essentialFiles = ['robots.txt', 'sitemap.xml', 'llms.txt', 'metodologia/index.html', 'sobre/index.html', 'geladeiras/index.html'];
for (const file of essentialFiles) {
    const content = readFile(file);
    if (content) {
        console.log(`✅ ${file} existe`);
    } else {
        WARNINGS.push(`P1.1 WARN: "${file}" não existe`);
        console.log(`⚠️ ${file} não existe`);
    }
}

// P1.2 - Home tem links para produtos e comparações
console.log('\n=== P1.2: Links internos na home ===');
const homeContent = readFile('index.html');
if (homeContent) {
    const productLinks = (homeContent.match(/href="\/produto\//g) || []).length;
    const compareLinks = (homeContent.match(/href="\/comparar\//g) || []).length;

    if (productLinks >= 2) {
        console.log(`✅ Home tem ${productLinks} links /produto/`);
    } else {
        WARNINGS.push(`P1.2 WARN: Home tem apenas ${productLinks} links /produto/ (mínimo 2)`);
        console.log(`⚠️ Home tem apenas ${productLinks} links /produto/ (mínimo 2)`);
    }

    if (compareLinks >= 1) {
        console.log(`✅ Home tem ${compareLinks} links /comparar/`);
    } else {
        WARNINGS.push(`P1.2 WARN: Home tem apenas ${compareLinks} links /comparar/ (mínimo 1)`);
        console.log(`⚠️ Home tem apenas ${compareLinks} links /comparar/ (mínimo 1)`);
    }
}

// Resultado final
console.log('\n========================================');
if (ERRORS.length === 0 && WARNINGS.length === 0) {
    console.log('✅ TODOS OS TESTES PASSARAM!');
    process.exit(0);
} else {
    if (ERRORS.length > 0) {
        console.log(`\n❌ ${ERRORS.length} ERROS (P0):`);
        ERRORS.forEach(e => console.log(`   - ${e}`));
    }
    if (WARNINGS.length > 0) {
        console.log(`\n⚠️ ${WARNINGS.length} AVISOS (P1):`);
        WARNINGS.forEach(w => console.log(`   - ${w}`));
    }
    process.exit(ERRORS.length > 0 ? 1 : 2);
}
