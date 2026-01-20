#!/usr/bin/env node
/**
 * Price Reference Validator
 * 
 * This internal script validates that REFERENCE_PRICES in categories.ts
 * are properly calibrated against actual product prices in the database.
 * 
 * Run with: npm run validate:prices
 */

const fs = require('fs');
const path = require('path');

// Colors for terminal output
const COLORS = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
    dim: '\x1b[2m',
};

function log(color, symbol, message) {
    console.log(`${color}${symbol}${COLORS.reset} ${message}`);
}

// Get median of an array of numbers
function median(arr) {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

// Get average of an array of numbers
function average(arr) {
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// Format price in BRL
function formatPrice(price) {
    return `R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

async function main() {
    console.log('\n══════════════════════════════════════════════════════════════');
    console.log('  📊 ComparaTop - Price Reference Validator');
    console.log('══════════════════════════════════════════════════════════════\n');

    // Read products data
    const productsPath = path.join(__dirname, '..', 'src', 'data', 'products.ts');
    const categoriesPath = path.join(__dirname, '..', 'src', 'config', 'categories.ts');

    if (!fs.existsSync(productsPath)) {
        log(COLORS.red, '✗', `Products file not found: ${productsPath}`);
        process.exit(1);
    }

    if (!fs.existsSync(categoriesPath)) {
        log(COLORS.red, '✗', `Categories file not found: ${categoriesPath}`);
        process.exit(1);
    }

    // Parse products (simplified approach - extract prices from ts file)
    const productsContent = fs.readFileSync(productsPath, 'utf8');
    const categoriesContent = fs.readFileSync(categoriesPath, 'utf8');

    // Extract reference prices from categories.ts
    const refPricesMatch = categoriesContent.match(/REFERENCE_PRICES[^{]+{([^}]+)}/s);
    if (!refPricesMatch) {
        log(COLORS.red, '✗', 'Could not find REFERENCE_PRICES in categories.ts');
        process.exit(1);
    }

    const referencePrices = {};
    const refPricesLines = refPricesMatch[1].split('\n');
    for (const line of refPricesLines) {
        const match = line.match(/(\w+):\s*(\d+)/);
        if (match) {
            referencePrices[match[1]] = parseInt(match[2], 10);
        }
    }

    // Extract product prices by category from products.ts
    const productsByCategory = {};

    // Find all products with their categoryId and price
    const productRegex = /categoryId:\s*['"](\w+)['"]/g;
    const priceRegex = /price:\s*(\d+(?:\.\d+)?)/g;

    let categoryMatches = [];
    let priceMatches = [];
    let match;

    while ((match = productRegex.exec(productsContent)) !== null) {
        categoryMatches.push({ index: match.index, categoryId: match[1] });
    }

    while ((match = priceRegex.exec(productsContent)) !== null) {
        priceMatches.push({ index: match.index, price: parseFloat(match[1]) });
    }

    // Associate each category match with the nearest following price
    for (const catMatch of categoryMatches) {
        const nearestPrice = priceMatches.find(p => p.index > catMatch.index);
        if (nearestPrice) {
            if (!productsByCategory[catMatch.categoryId]) {
                productsByCategory[catMatch.categoryId] = [];
            }
            productsByCategory[catMatch.categoryId].push(nearestPrice.price);
        }
    }

    // Analyze each category
    let hasWarnings = false;
    const results = [];

    for (const [categoryId, prices] of Object.entries(productsByCategory)) {
        const count = prices.length;
        const medianPrice = median(prices);
        const avgPrice = average(prices);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const referencePrice = referencePrices[categoryId];

        // Calculate ratio of reference to median
        const ratio = referencePrice ? referencePrice / medianPrice : 0;

        let status = 'ok';
        let statusSymbol = '✓';
        let statusColor = COLORS.green;
        let suggestion = '';

        if (!referencePrice) {
            status = 'missing';
            statusSymbol = '⚠';
            statusColor = COLORS.yellow;
            hasWarnings = true;
            suggestion = `Adicionar: ${categoryId}: ${Math.round(maxPrice * 1.5)},`;
        } else if (ratio > 5) {
            // Reference is 5x higher than median - way too high
            status = 'too_high';
            statusSymbol = '⚠';
            statusColor = COLORS.yellow;
            hasWarnings = true;
            suggestion = `Considerar reduzir para ~${formatPrice(Math.round(maxPrice * 1.2))}`;
        } else if (ratio < 1.2) {
            // Reference is less than 1.2x median - too low
            status = 'too_low';
            statusSymbol = '⚠';
            statusColor = COLORS.yellow;
            hasWarnings = true;
            suggestion = `Considerar aumentar para ~${formatPrice(Math.round(maxPrice * 1.5))}`;
        }

        results.push({
            categoryId,
            count,
            minPrice,
            maxPrice,
            avgPrice,
            medianPrice,
            referencePrice,
            ratio,
            status,
            statusSymbol,
            statusColor,
            suggestion,
        });
    }

    // Check for categories without products
    for (const [categoryId, refPrice] of Object.entries(referencePrices)) {
        if (!productsByCategory[categoryId]) {
            results.push({
                categoryId,
                count: 0,
                referencePrice: refPrice,
                status: 'no_products',
                statusSymbol: '○',
                statusColor: COLORS.dim,
                suggestion: 'Nenhum produto cadastrado',
            });
        }
    }

    // Display results
    for (const r of results) {
        log(r.statusColor, r.statusSymbol, `${r.categoryId.toUpperCase()}`);

        if (r.count > 0) {
            console.log(`   Produtos: ${r.count}`);
            console.log(`   Preços: ${formatPrice(r.minPrice)} - ${formatPrice(r.maxPrice)}`);
            console.log(`   Média: ${formatPrice(Math.round(r.avgPrice))} | Mediana: ${formatPrice(Math.round(r.medianPrice))}`);
            console.log(`   Reference Price: ${r.referencePrice ? formatPrice(r.referencePrice) : 'NÃO DEFINIDO'}`);
            if (r.ratio) {
                console.log(`   Ratio (ref/mediana): ${r.ratio.toFixed(1)}x`);
            }
        } else {
            console.log(`   Reference Price: ${formatPrice(r.referencePrice)}`);
        }

        if (r.suggestion) {
            console.log(`   ${COLORS.yellow}→ ${r.suggestion}${COLORS.reset}`);
        }
        console.log('');
    }

    // Summary
    console.log('══════════════════════════════════════════════════════════════');
    if (hasWarnings) {
        log(COLORS.yellow, '⚠', 'Alguns ajustes podem ser necessários. Verifique as sugestões acima.');
        log(COLORS.dim, '  ', 'Ideal: reference price = 1.5x a 3x o preço máximo da categoria');
    } else {
        log(COLORS.green, '✓', 'Todos os preços de referência estão calibrados!');
    }
    console.log('');
}

main().catch(console.error);
