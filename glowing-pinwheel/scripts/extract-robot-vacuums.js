#!/usr/bin/env node
/**
 * Extract Robot Vacuum Products from products.ts to individual entry files
 * 
 * This script:
 * 1. Reads products.ts
 * 2. Extracts each robot-vacuum product block
 * 3. Creates products.entry.{slug}.ts for each
 * 4. Updates products.ts to import from entry files
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '../src/data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.ts');

// Read products.ts
const content = fs.readFileSync(PRODUCTS_FILE, 'utf-8');

// Find SAMPLE_ROBOT_VACUUMS array
const rvStartMatch = content.match(/export const SAMPLE_ROBOT_VACUUMS:\s*Product\[\]\s*=\s*\[/);
if (!rvStartMatch) {
    console.error('Could not find SAMPLE_ROBOT_VACUUMS array');
    process.exit(1);
}

const arrayStartIdx = rvStartMatch.index + rvStartMatch[0].length;

// Find matching closing bracket
let braceCount = 1;
let arrayEndIdx = arrayStartIdx;
for (let i = arrayStartIdx; i < content.length; i++) {
    if (content[i] === '[') braceCount++;
    if (content[i] === ']') {
        braceCount--;
        if (braceCount === 0) {
            arrayEndIdx = i;
            break;
        }
    }
}

const arrayContent = content.substring(arrayStartIdx, arrayEndIdx);

// Extract individual products (find each { id: '...' block)
const productBlocks = [];
let currentBlockStart = null;
let braceLevel = 0;

for (let i = 0; i < arrayContent.length; i++) {
    if (arrayContent[i] === '{') {
        if (braceLevel === 0) {
            currentBlockStart = i;
        }
        braceLevel++;
    }
    if (arrayContent[i] === '}') {
        braceLevel--;
        if (braceLevel === 0 && currentBlockStart !== null) {
            const block = arrayContent.substring(currentBlockStart, i + 1);
            // Only include robot-vacuum products
            if (block.includes("categoryId: 'robot-vacuum'")) {
                const idMatch = block.match(/id:\s*['"]([^'"]+)['"]/);
                if (idMatch) {
                    productBlocks.push({
                        id: idMatch[1],
                        content: block,
                    });
                }
            }
            currentBlockStart = null;
        }
    }
}

console.log(`Found ${productBlocks.length} robot vacuum products:\n`);
productBlocks.forEach(p => console.log(`  - ${p.id}`));
console.log('');

// Generate entry files
const entryImports = [];
const entryExportNames = [];

for (const product of productBlocks) {
    const slug = product.id;
    const varName = slug.replace(/-/g, '_');
    const fileName = `products.entry.${slug}.ts`;
    const filePath = path.join(DATA_DIR, fileName);

    // Check if entry file already exists
    if (fs.existsSync(filePath)) {
        console.log(`[SKIP] ${fileName} already exists`);
        continue;
    }

    const fileContent = `/**
 * Product Entry: ${slug}
 * Extracted from products.ts for modular architecture
 */
import type { Product } from '@/types/category';

export const ${varName}: Product = ${product.content};
`;

    fs.writeFileSync(filePath, fileContent, 'utf-8');
    console.log(`[CREATED] ${fileName}`);

    entryImports.push(`import { ${varName} } from './${fileName.replace('.ts', '')}';`);
    entryExportNames.push(varName);
}

console.log('\n=== Add these imports to products.ts ===\n');
entryImports.forEach(i => console.log(i));

console.log('\n=== Update SAMPLE_ROBOT_VACUUMS to ===\n');
console.log(`export const SAMPLE_ROBOT_VACUUMS: Product[] = [`);
entryExportNames.forEach(n => console.log(`    ${n},`));
console.log(`];`);
