#!/usr/bin/env node
/**
 * ComparaTop - Catalog Validator
 * 
 * Validates catalog JSON files for data consistency before build:
 * - Required fields present
 * - Data types correct
 * - URLs valid
 * - No duplicate IDs
 * 
 * Usage: node tools/validate-catalog.js
 * 
 * Run this BEFORE build to catch data issues early!
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CATALOGS_DIR = path.join(__dirname, '..', 'data', 'catalogs');

// Colors for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

let totalErrors = 0;
let totalWarnings = 0;

function log(type, message, file = '') {
    const prefix = {
        pass: `${colors.green}✅${colors.reset}`,
        fail: `${colors.red}❌${colors.reset}`,
        warn: `${colors.yellow}⚠️${colors.reset}`,
        info: `${colors.cyan}ℹ️${colors.reset}`
    };
    const filePrefix = file ? `[${file}] ` : '';
    console.log(`${prefix[type] || ''} ${filePrefix}${message}`);

    if (type === 'fail') totalErrors++;
    if (type === 'warn') totalWarnings++;
}

// Validate category object
function validateCategory(category, filename) {
    const required = ['id', 'name', 'slug'];
    const errors = [];

    for (const field of required) {
        if (!category[field]) {
            errors.push(`category.${field} ausente`);
        }
    }

    if (category.slug && !/^[a-z0-9-]+$/.test(category.slug)) {
        errors.push(`category.slug inválido: "${category.slug}" (usar apenas a-z, 0-9, -)`);
    }

    return errors;
}

// Validate product object
function validateProduct(productId, product, filename) {
    const errors = [];
    const warnings = [];

    // Required fields
    const required = ['id', 'name', 'brand', 'model'];
    for (const field of required) {
        if (!product[field]) {
            errors.push(`products.${productId}.${field} ausente`);
        }
    }

    // ID consistency
    if (product.id && product.id !== productId) {
        errors.push(`products.${productId}.id não confere: "${product.id}"`);
    }

    // Specs
    if (!product.specs || typeof product.specs !== 'object') {
        errors.push(`products.${productId}.specs ausente ou inválido`);
    } else {
        // Check important specs
        const importantSpecs = ['capacidade_total'];
        for (const spec of importantSpecs) {
            if (product.specs[spec] === undefined) {
                warnings.push(`products.${productId}.specs.${spec} recomendado mas ausente`);
            }
        }
    }

    // Offers
    if (!product.offers || !Array.isArray(product.offers)) {
        warnings.push(`products.${productId}.offers ausente (sem ofertas para exibir)`);
    } else if (product.offers.length === 0) {
        warnings.push(`products.${productId}.offers vazio`);
    } else {
        // Validate each offer
        product.offers.forEach((offer, idx) => {
            // Accept retailer, retailerId, retailerName, or store
            const hasRetailer = offer.retailer || offer.retailerId || offer.retailerName || offer.store;
            if (!hasRetailer) {
                errors.push(`products.${productId}.offers[${idx}].retailer ausente`);
            }
            if (typeof offer.price !== 'number' || offer.price <= 0) {
                errors.push(`products.${productId}.offers[${idx}].price inválido: ${offer.price}`);
            }
            if (!offer.url) {
                warnings.push(`products.${productId}.offers[${idx}].url ausente`);
            }
        });
    }

    // Editorial scores
    if (product.editorialScores) {
        if (typeof product.editorialScores.overall !== 'number') {
            warnings.push(`products.${productId}.editorialScores.overall não é número`);
        } else if (product.editorialScores.overall < 0 || product.editorialScores.overall > 10) {
            errors.push(`products.${productId}.editorialScores.overall fora do range 0-10: ${product.editorialScores.overall}`);
        }
    }

    // Image URL
    if (!product.imageUrl) {
        warnings.push(`products.${productId}.imageUrl ausente`);
    }

    // VoC (Voice of Customer)
    if (product.voc) {
        if (!product.voc.oneLiner && !product.voc.summary30s && !product.voc.thirtySecondSummary) {
            warnings.push(`products.${productId}.voc sem resumo`);
        }
    }

    return { errors, warnings };
}

// Validate entire catalog
function validateCatalog(filename) {
    const filepath = path.join(CATALOGS_DIR, filename);

    console.log(`\n${colors.bold}=== Validando: ${filename} ===${colors.reset}`);

    let data;
    try {
        const content = fs.readFileSync(filepath, 'utf-8');
        data = JSON.parse(content);
    } catch (err) {
        log('fail', `Erro ao ler/parsear: ${err.message}`, filename);
        return;
    }

    // Validate category
    if (!data.category) {
        log('fail', 'category ausente', filename);
    } else {
        const catErrors = validateCategory(data.category, filename);
        catErrors.forEach(e => log('fail', e, filename));
        if (catErrors.length === 0) {
            log('pass', `category válido: ${data.category.name}`, filename);
        }
    }

    // Validate products
    if (!data.products || typeof data.products !== 'object') {
        log('fail', 'products ausente ou inválido', filename);
    } else {
        const productIds = Object.keys(data.products);
        log('info', `${productIds.length} produto(s) encontrado(s)`, filename);

        // Check for duplicate IDs (shouldn't happen with object structure, but check internal id field)
        const internalIds = productIds.map(k => data.products[k].id).filter(Boolean);
        const uniqueIds = new Set(internalIds);
        if (internalIds.length !== uniqueIds.size) {
            log('fail', 'IDs duplicados detectados', filename);
        }

        // Validate each product
        for (const [productId, product] of Object.entries(data.products)) {
            const { errors, warnings } = validateProduct(productId, product, filename);

            errors.forEach(e => log('fail', e, filename));
            warnings.forEach(w => log('warn', w, filename));

            if (errors.length === 0 && warnings.length === 0) {
                log('pass', `${productId}: ${product.name}`, filename);
            }
        }
    }

    // Validate meta
    if (!data.meta) {
        log('warn', 'meta ausente (opcional)', filename);
    } else {
        if (!data.meta.lastUpdated) {
            log('warn', 'meta.lastUpdated ausente', filename);
        }
    }
}

// Main
function main() {
    console.log(colors.bold + '\n🔍 ComparaTop - Validação de Catálogos' + colors.reset);
    console.log(`Diretório: ${CATALOGS_DIR}`);
    console.log(`Data: ${new Date().toISOString()}`);

    // Find all catalog files
    let files;
    try {
        files = fs.readdirSync(CATALOGS_DIR).filter(f => f.endsWith('.json'));
    } catch (err) {
        console.error(`Erro ao ler diretório: ${err.message}`);
        process.exit(1);
    }

    if (files.length === 0) {
        console.log('\nNenhum arquivo .json encontrado em data/catalogs/');
        process.exit(1);
    }

    console.log(`\nArquivos encontrados: ${files.join(', ')}`);

    // Validate each catalog
    files.forEach(validateCatalog);

    // Summary
    console.log('\n' + colors.bold + '=== RESUMO ===' + colors.reset);
    console.log(`Catálogos validados: ${files.length}`);
    console.log(`Erros: ${totalErrors}`);
    console.log(`Avisos: ${totalWarnings}`);

    console.log('\n' + colors.bold + '=== VEREDITO ===' + colors.reset);
    if (totalErrors === 0) {
        console.log(colors.green + '🟢 APROVADO - Catálogos válidos para build!' + colors.reset);
        if (totalWarnings > 0) {
            console.log(colors.yellow + `   (${totalWarnings} aviso(s) - considere corrigir)` + colors.reset);
        }
        process.exit(0);
    } else {
        console.log(colors.red + `🔴 REPROVADO - ${totalErrors} erro(s) encontrado(s)` + colors.reset);
        console.log('   Corrija os erros antes de rodar o build.');
        process.exit(1);
    }
}

main();
