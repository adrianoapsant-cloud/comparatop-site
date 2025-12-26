/**
 * Tool to import products from CSV to the catalog JSON.
 * Usage: node tools/import-products.js path/to/products.csv
 * 
 * CSV Header Format Expected:
 * model,name,brand,capacity_total,capacity_freezer,tech,voltage,price,link
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const CATALOG_PATH = path.join(__dirname, '../data/catalogs/geladeira.json');

// Helper to slugify text
function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start
        .replace(/-+$/, '');            // Trim - from end
}

// Helper: Parse CSV Line correctly handling quotes
function parseCSVLine(header, line) {
    // Regex to match CSV fields: quoted values OR non-comma values
    const regex = /(?:^|,)(?:"([^"]*)"|([^",]*))/g;
    const values = [];
    let match;

    while ((match = regex.exec(line)) !== null) {
        // match[1] is quoted value, match[2] is unquoted
        let val = match[1] !== undefined ? match[1] : match[2];
        val = val ? val.trim() : '';
        values.push(val);
    }

    const obj = {};
    header.forEach((key, index) => {
        obj[key] = values[index] || '';
    });

    return obj;
}

// Update Catalog
function updateCatalog(newProducts) {
    let content = {};

    if (fs.existsSync(CATALOG_PATH)) {
        try {
            content = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
            console.log(`Loaded existing catalog: ${Object.keys(content.products || {}).length} products.`);
        } catch (e) {
            console.error("Error reading existing catalog. Starting fresh.");
        }
    }

    // Ensure products object exists
    if (!content.products || Array.isArray(content.products)) {
        content.products = content.products && !Array.isArray(content.products) ? content.products : {};
    }

    let added = 0;
    let updated = 0;
    let skipped = 0;

    newProducts.forEach(prod => {
        // Basic Validation
        if (!prod.model || !prod.brand) {
            console.warn(`Skipping invalid row: ${JSON.stringify(prod)}`);
            skipped++;
            return;
        }

        // Generate Base Slug
        let baseSlug = slugify(`${prod.brand}-${prod.model}`);
        let slug = baseSlug;
        let counter = 1;

        // Collision Detection:
        // If slug exists AND it's a different product (logic: we assume same model name means update, 
        // but if we want to support voltage variants as diff products, we'd need a stricter check. 
        // For now, if slug exists, we update it. 
        // OPTIONAL: If you want to FORCE unique entries for same names, uncomment loop below.
        /*
        while (content.products[slug] && content.products[slug].link !== prod.link) { 
             slug = `${baseSlug}-${++counter}`;
        }
        */

        // Implementation for "Prevent Overwrite of DIFFERENT products with SAME Slug":
        // We will assume that if the existing product has the same 'link', it's an update.
        // If the link is different, it's a collision (e.g. 110v vs 220v variant with same model code in text).

        while (content.products[slug]) {
            const existing = content.products[slug];
            // If explicit link matches, it's an update to the same product
            if (existing.offers && existing.offers.some(o => o.link === prod.link)) {
                break;
            }
            // If links differ, assume it's a collision/variant -> generate new slug
            slug = `${baseSlug}-${++counter}`;
        }

        const newEntry = {
            id: slug,
            model: prod.model,
            name: prod.name,
            brand: prod.brand,
            url: `/produto/geladeira/${slug}`,
            specs: {
                capacidade_total: parseInt(prod.capacity_total) || 0,
                capacidade_freezer: parseInt(prod.capacity_freezer) || 0,
                tipo_degelo: prod.tech || 'Frost Free',
                voltagem: prod.voltage || 'Bivolt'
            },
            offers: [
                {
                    retailer: "Amazon",
                    price: parseFloat(prod.price) || 0,
                    link: prod.link,
                    updated: new Date().toISOString()
                }
            ],
            lastUpdated: new Date().toISOString()
        };

        if (content.products[slug]) {
            // Update existing
            const existing = content.products[slug];
            content.products[slug] = {
                ...existing,
                ...newEntry,
                // Preserve content not in CSV
                editorialScores: existing.editorialScores,
                imageUrl: existing.imageUrl || newEntry.imageUrl,
                // Append new offer instead of replacing if from diff retailer? 
                // For this script, we just replace the Amazon offer or verify list. 
                // user logic: naive replace/merge.
            };
            updated++;
        } else {
            // New Entry
            content.products[slug] = newEntry;
            added++;
        }
    });

    // Update metadata
    if (!content.meta) content.meta = {};
    content.meta.totalProducts = Object.keys(content.products).length;
    content.meta.lastUpdated = new Date().toISOString().split('T')[0];

    fs.writeFileSync(CATALOG_PATH, JSON.stringify(content, null, 2));
    console.log(`\nImport Summary:`);
    console.log(`- Added: ${added}`);
    console.log(`- Updated: ${updated}`);
    console.log(`- Skipped: ${skipped}`);
    console.log(`- Total: ${content.meta.totalProducts}`);
}

// Main
const csvFile = process.argv[2];
if (!csvFile) {
    console.log("Please provide a CSV file path.");
    process.exit(1);
}

if (!fs.existsSync(csvFile)) {
    console.error(`File not found: ${csvFile}`);
    process.exit(1);
}

const fileContent = fs.readFileSync(csvFile, 'utf8');
const lines = fileContent.split('\n').filter(l => l.trim().length > 0);

if (lines.length > 0) {
    // Handle Header (remove crlf)
    const headerLine = lines[0].replace(/[\r]/g, '');
    const safeHeader = headerLine.split(',').map(h => h.trim());

    console.log(`Header found: ${safeHeader.join(', ')}`);

    const products = [];
    for (let i = 1; i < lines.length; i++) {
        // Skip empty lines
        if (!lines[i].trim()) continue;

        try {
            const p = parseCSVLine(safeHeader, lines[i]);
            if (p.model) {
                products.push(p);
            }
        } catch (err) {
            console.error(`Error parsing line ${i + 1}: ${err.message}`);
        }
    }

    console.log(`Parsed ${products.length} valid rows.`);
    updateCatalog(products);
}
