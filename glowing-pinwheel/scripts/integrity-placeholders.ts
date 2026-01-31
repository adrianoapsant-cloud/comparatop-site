#!/usr/bin/env npx tsx
/**
 * @file integrity-placeholders.ts
 * @description P14: Scanner de placeholders __CT_TODO__ para evitar deploy de conteúdo incompleto
 * 
 * O scanner verifica:
 * 1. Produtos em runtime (ALL_PRODUCTS + GENERATED_PRODUCTS)
 * 2. Mocks associados (quando existirem)
 * 
 * Política:
 * - Se isPublished(produto) e encontrou placeholder → ERROR (exit 2)
 * - Se NÃO published e encontrou placeholder → WARNING (exit 0)
 * 
 * O que é "published":
 * - Produtos com status === 'published' são considerados publicados
 * - Produtos sem status ou com status !== 'published' são drafts
 */

import * as fs from 'fs';
import * as path from 'path';

const PROJECT_ROOT = path.resolve(__dirname, '..');
const PLACEHOLDER_TOKEN = '__CT_TODO__';

// ============================================
// TYPES
// ============================================

interface PlaceholderHit {
    productId: string;
    source: 'product' | 'mock';
    paths: string[];
    isPublished: boolean;
}

interface ScanResult {
    errors: PlaceholderHit[];     // Published products with placeholders
    warnings: PlaceholderHit[];   // Draft products with placeholders
    scannedProducts: number;
    scannedMocks: number;
}

// ============================================
// IS PUBLISHED LOGIC
// ============================================

/**
 * Determina se um produto é considerado "published".
 * 
 * Regra atual: product.status === 'published'
 * 
 * Se o campo status não existir, considera como draft (não published).
 */
function isPublished(product: Record<string, unknown>): boolean {
    return product.status === 'published';
}

// ============================================
// DEEP TRAVERSE / PLACEHOLDER DETECTION
// ============================================

/**
 * Deep-traverse em um objeto e encontra todos os paths que contêm o placeholder token.
 */
function findPlaceholderPaths(obj: unknown, currentPath: string = ''): string[] {
    const hits: string[] = [];

    if (obj === null || obj === undefined) {
        return hits;
    }

    if (typeof obj === 'string') {
        if (obj.includes(PLACEHOLDER_TOKEN)) {
            hits.push(currentPath || '(root)');
        }
        return hits;
    }

    if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
            const itemHits = findPlaceholderPaths(item, `${currentPath}[${index}]`);
            hits.push(...itemHits);
        });
        return hits;
    }

    if (typeof obj === 'object') {
        for (const [key, value] of Object.entries(obj)) {
            const nestedPath = currentPath ? `${currentPath}.${key}` : key;
            const nestedHits = findPlaceholderPaths(value, nestedPath);
            hits.push(...nestedHits);
        }
        return hits;
    }

    return hits;
}

// ============================================
// LOAD PRODUCTS
// ============================================

interface ProductLike {
    id: string;
    status?: string;
    [key: string]: unknown;
}

function loadAllProducts(): ProductLike[] {
    const products: ProductLike[] = [];

    // Load from products.ts exports
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const productsModule = require('../src/data/products');

        // Collect all exported arrays that look like product arrays
        for (const [key, value] of Object.entries(productsModule)) {
            if (Array.isArray(value) && value.length > 0 && value[0] && typeof value[0] === 'object' && 'id' in value[0]) {
                products.push(...(value as ProductLike[]));
            }
        }

        // Also check ALL_PRODUCTS if it exists
        if (productsModule.ALL_PRODUCTS && Array.isArray(productsModule.ALL_PRODUCTS)) {
            // Avoid duplicates
            const existingIds = new Set(products.map(p => p.id));
            for (const p of productsModule.ALL_PRODUCTS as ProductLike[]) {
                if (!existingIds.has(p.id)) {
                    products.push(p);
                    existingIds.add(p.id);
                }
            }
        }
    } catch (e) {
        console.error('⚠️ Não foi possível carregar products:', e);
    }

    // Load from generated/index.ts
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const generatedModule = require('../src/data/generated');

        if (generatedModule.GENERATED_PRODUCTS && Array.isArray(generatedModule.GENERATED_PRODUCTS)) {
            const existingIds = new Set(products.map(p => p.id));
            for (const p of generatedModule.GENERATED_PRODUCTS as ProductLike[]) {
                if (!existingIds.has(p.id)) {
                    products.push(p);
                    existingIds.add(p.id);
                }
            }
        }
    } catch {
        // Generated module may not exist
    }

    return products;
}

// ============================================
// MOCK SCANNER
// ============================================

function scanMockFile(mockPath: string): string[] {
    if (!fs.existsSync(mockPath)) {
        return [];
    }

    try {
        const content = fs.readFileSync(mockPath, 'utf-8');

        // Quick text search first
        if (!content.includes(PLACEHOLDER_TOKEN)) {
            return [];
        }

        // Parse and deep-traverse for precise paths
        const mockData = JSON.parse(content);
        return findPlaceholderPaths(mockData);
    } catch {
        return [];
    }
}

function getMockPaths(productId: string): string[] {
    const paths: string[] = [];

    // Standard mocks location
    const standardMock = path.join(PROJECT_ROOT, 'src', 'data', 'mocks', `${productId}.json`);
    if (fs.existsSync(standardMock)) {
        paths.push(standardMock);
    }

    // Generated mocks location
    const generatedMock = path.join(PROJECT_ROOT, 'src', 'data', 'generated', 'mocks', `${productId}.json`);
    if (fs.existsSync(generatedMock)) {
        paths.push(generatedMock);
    }

    return paths;
}

// ============================================
// MAIN SCANNER
// ============================================

function scanAllProducts(): ScanResult {
    const result: ScanResult = {
        errors: [],
        warnings: [],
        scannedProducts: 0,
        scannedMocks: 0,
    };

    const products = loadAllProducts();
    result.scannedProducts = products.length;

    for (const product of products) {
        const published = isPublished(product as Record<string, unknown>);

        // Scan product object
        const productPaths = findPlaceholderPaths(product);

        // Scan associated mocks
        const mockPaths = getMockPaths(product.id);
        let allMockHitPaths: string[] = [];

        for (const mockPath of mockPaths) {
            result.scannedMocks++;
            const mockHits = scanMockFile(mockPath);
            if (mockHits.length > 0) {
                allMockHitPaths.push(...mockHits.map(p => `mock:${p}`));
            }
        }

        // Combine hits
        if (productPaths.length > 0 || allMockHitPaths.length > 0) {
            const hit: PlaceholderHit = {
                productId: product.id,
                source: productPaths.length > 0 ? 'product' : 'mock',
                paths: [...productPaths, ...allMockHitPaths],
                isPublished: published,
            };

            if (published) {
                result.errors.push(hit);
            } else {
                result.warnings.push(hit);
            }
        }
    }

    return result;
}

// ============================================
// REPORTING
// ============================================

function printReport(result: ScanResult): void {
    console.log('# Placeholder Integrity Check (P14)\n');
    console.log(`**Token**: \`${PLACEHOLDER_TOKEN}\``);
    console.log(`**Scanned Products**: ${result.scannedProducts}`);
    console.log(`**Scanned Mocks**: ${result.scannedMocks}`);
    console.log('');

    if (result.errors.length === 0 && result.warnings.length === 0) {
        console.log('✅ No placeholders found. All clear!\n');
        return;
    }

    // Errors (published products with placeholders) - CRITICAL
    if (result.errors.length > 0) {
        console.log(`## ❌ ERRORS (${result.errors.length} published products with placeholders)\n`);
        console.log('These products are PUBLISHED but contain incomplete placeholder content.');
        console.log('**This will BLOCK deployment.**\n');

        for (const hit of result.errors) {
            console.log(`### \`${hit.productId}\` (${hit.source})`);
            console.log(`Paths with placeholders:`);
            hit.paths.slice(0, 10).forEach(p => console.log(`  - \`${p}\``));
            if (hit.paths.length > 10) {
                console.log(`  ... and ${hit.paths.length - 10} more`);
            }
            console.log('');
        }
    }

    // Warnings (draft products with placeholders) - acceptable
    if (result.warnings.length > 0) {
        console.log(`## ⚠️ WARNINGS (${result.warnings.length} draft products with placeholders)\n`);
        console.log('These products are DRAFTS/GENERATED and placeholders are acceptable during development.\n');

        for (const hit of result.warnings) {
            console.log(`- \`${hit.productId}\`: ${hit.paths.length} placeholder(s)`);
        }
        console.log('');
    }
}

// ============================================
// MAIN
// ============================================

console.log('🔍 Running placeholder integrity check...\n');

const result = scanAllProducts();
printReport(result);

// Exit codes
if (result.errors.length > 0) {
    console.log('🔴 FAIL: Published products contain placeholders. Remove __CT_TODO__ before publishing.\n');
    process.exit(2);
} else if (result.warnings.length > 0) {
    console.log('🟡 PASS with warnings: Draft products contain placeholders (acceptable during development).\n');
    process.exit(0);
} else {
    console.log('🟢 PASS: No placeholders found.\n');
    process.exit(0);
}
