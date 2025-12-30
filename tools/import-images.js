#!/usr/bin/env node
/**
 * ComparaTop - Import Product Images Script
 * 
 * Automatically imports product images and updates the catalog JSON.
 * 
 * Usage:
 *   node tools/import-images.js <category> <product-id> <source-folder>
 * 
 * Examples:
 *   node tools/import-images.js geladeira brm44hb "C:\Users\...\BRM44HB Images"
 *   node tools/import-images.js geladeira tf55 "D:\Fotos\TF55"
 * 
 * Or batch import (scans a folder structure):
 *   node tools/import-images.js --batch <category> <root-folder>
 * 
 * Expected folder structure for batch:
 *   root-folder/
 *   ├── produto-a/
 *   │   ├── Image-0.jpg
 *   │   ├── Image-1.jpg
 *   │   └── ...
 *   └── produto-b/
 *       ├── foto1.jpg
 *       └── ...
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    assetsDir: path.join(__dirname, '..', 'assets', 'images', 'products'),
    catalogsDir: path.join(__dirname, '..', 'data', 'catalogs'),
    supportedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
    maxImages: 20
};

// Utility: ensure directory exists
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// Utility: copy file
function copyFile(src, dest) {
    fs.copyFileSync(src, dest);
}

// Utility: get image files from folder
function getImageFiles(folderPath) {
    if (!fs.existsSync(folderPath)) {
        console.error(`❌ Folder not found: ${folderPath}`);
        return [];
    }

    const files = fs.readdirSync(folderPath);
    return files
        .filter(f => CONFIG.supportedExtensions.includes(path.extname(f).toLowerCase()))
        .sort((a, b) => {
            // Sort numerically if possible (Image-0, Image-1, etc.)
            const numA = parseInt(a.match(/\d+/)?.[0] || '999');
            const numB = parseInt(b.match(/\d+/)?.[0] || '999');
            return numA - numB;
        })
        .slice(0, CONFIG.maxImages);
}

// Load catalog JSON
function loadCatalog(category) {
    const catalogPath = path.join(CONFIG.catalogsDir, `${category}.json`);
    if (!fs.existsSync(catalogPath)) {
        console.error(`❌ Catalog not found: ${catalogPath}`);
        return null;
    }
    return JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
}

// Save catalog JSON
function saveCatalog(category, catalog) {
    const catalogPath = path.join(CONFIG.catalogsDir, `${category}.json`);
    fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf-8');
    console.log(`✅ Catalog updated: ${catalogPath}`);
}

// Import images for a single product
function importProductImages(category, productId, sourceFolder) {
    console.log(`\n📦 Importing images for ${category}/${productId}...`);
    console.log(`   Source: ${sourceFolder}`);

    // 1. Get image files
    const imageFiles = getImageFiles(sourceFolder);
    if (imageFiles.length === 0) {
        console.error(`❌ No images found in ${sourceFolder}`);
        return false;
    }
    console.log(`   Found ${imageFiles.length} images`);

    // 2. Create destination folder
    const destFolder = path.join(CONFIG.assetsDir, category, productId);
    ensureDir(destFolder);

    // 3. Copy images with standardized names
    const imagePaths = [];
    imageFiles.forEach((file, index) => {
        const ext = path.extname(file).toLowerCase();
        const newName = `Image-${index}${ext}`;
        const srcPath = path.join(sourceFolder, file);
        const destPath = path.join(destFolder, newName);

        copyFile(srcPath, destPath);
        console.log(`   📷 Copied: ${file} → ${newName}`);

        // Store relative URL path
        imagePaths.push(`/assets/images/products/${category}/${productId}/${newName}`);
    });

    // 4. Update catalog JSON
    const catalog = loadCatalog(category);
    if (!catalog) return false;

    const product = catalog.products?.[productId];
    if (!product) {
        console.error(`❌ Product not found in catalog: ${productId}`);
        console.log(`   Available products: ${Object.keys(catalog.products || {}).join(', ')}`);
        return false;
    }

    // Update product with image paths
    product.imageUrl = imagePaths[0]; // Main image
    product.images = imagePaths;       // Gallery
    product.lastUpdated = new Date().toISOString().split('T')[0];

    saveCatalog(category, catalog);

    console.log(`✅ Successfully imported ${imagePaths.length} images for ${productId}`);
    return true;
}

// Batch import from folder structure
function batchImport(category, rootFolder) {
    console.log(`\n🚀 Batch importing images for category: ${category}`);
    console.log(`   Root folder: ${rootFolder}\n`);

    if (!fs.existsSync(rootFolder)) {
        console.error(`❌ Root folder not found: ${rootFolder}`);
        return;
    }

    const catalog = loadCatalog(category);
    if (!catalog) return;

    const productIds = Object.keys(catalog.products || {});
    console.log(`   Products in catalog: ${productIds.join(', ')}\n`);

    // Scan subdirectories
    const subfolders = fs.readdirSync(rootFolder, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);

    let imported = 0;
    let skipped = 0;

    for (const folder of subfolders) {
        // Try to match folder name to a product ID
        const folderLower = folder.toLowerCase().replace(/[^a-z0-9]/g, '');

        const matchedProduct = productIds.find(id => {
            const idLower = id.toLowerCase().replace(/[^a-z0-9]/g, '');
            // Check if folder name contains product ID or vice versa
            return folderLower.includes(idLower) || idLower.includes(folderLower);
        });

        if (matchedProduct) {
            const folderPath = path.join(rootFolder, folder);
            if (importProductImages(category, matchedProduct, folderPath)) {
                imported++;
            }
        } else {
            console.log(`⚠️  Skipped folder (no match): ${folder}`);
            skipped++;
        }
    }

    console.log(`\n📊 Batch import complete:`);
    console.log(`   ✅ Imported: ${imported}`);
    console.log(`   ⚠️  Skipped: ${skipped}`);
}

// Main CLI
function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log(`
╔═══════════════════════════════════════════════════════════╗
║     ComparaTop - Product Image Import Tool                ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  Usage:                                                   ║
║    Single product:                                        ║
║      node tools/import-images.js <category> <product-id> <folder>   ║
║                                                           ║
║    Batch import:                                          ║
║      node tools/import-images.js --batch <category> <root-folder>   ║
║                                                           ║
║  Examples:                                                ║
║    node tools/import-images.js geladeira brm44hb "C:\\Fotos\\BRM44HB"║
║    node tools/import-images.js --batch geladeira "C:\\Produtos"     ║
║                                                           ║
║  Categories available:                                    ║
${fs.readdirSync(CONFIG.catalogsDir)
                .filter(f => f.endsWith('.json'))
                .map(f => `║    - ${f.replace('.json', '').padEnd(52)}║`)
                .join('\n')}
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
        `);
        return;
    }

    if (args[0] === '--batch') {
        if (args.length < 3) {
            console.error('Usage: node tools/import-images.js --batch <category> <root-folder>');
            return;
        }
        batchImport(args[1], args[2]);
    } else {
        if (args.length < 3) {
            console.error('Usage: node tools/import-images.js <category> <product-id> <source-folder>');
            return;
        }
        importProductImages(args[0], args[1], args[2]);
    }

    console.log('\n💡 Don\'t forget to run: node tools/build.js');
}

main();
