/**
 * OG Image Generator - Create social media preview images
 * 
 * Generates 1200x630 images for Open Graph (Facebook, Twitter, Pinterest)
 * with product image, price, and branding
 * 
 * This uses SVG templates that can be converted to PNG
 * For PNG conversion: requires sharp (npm install sharp)
 * 
 * Usage: node tools/generate-og-images.js
 */

const fs = require('fs');
const path = require('path');

// Check for sharp
let sharp;
try {
    sharp = require('sharp');
} catch (e) {
    console.log('⚠️  sharp module not installed. Will generate SVG only.');
    console.log('   For PNG: npm install sharp');
}

const CONFIG = {
    catalogsDir: path.join(__dirname, '..', 'data', 'catalogs'),
    outputDir: path.join(__dirname, '..', 'dist', 'assets', 'og-images'),
    width: 1200,
    height: 630
};

function formatBRL(value) {
    if (!value) return '';
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function escapeXml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function generateOGImageSVG(product, category) {
    const offers = (product.offers || []).filter(o => o.price && o.price > 0);
    const bestPrice = offers.length > 0 ? Math.min(...offers.map(o => o.price)) : null;
    const priceText = bestPrice ? formatBRL(bestPrice) : '';

    // Simple clean design
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${CONFIG.width}" height="${CONFIG.height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background gradient -->
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e3a8a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="card" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f8fafc;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="100%" height="100%" fill="url(#bg)"/>
  
  <!-- White card area -->
  <rect x="40" y="40" width="1120" height="550" rx="16" fill="url(#card)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"/>
  
  <!-- Product image placeholder area -->
  <rect x="60" y="60" width="400" height="400" rx="12" fill="#f1f5f9"/>
  <text x="260" y="270" font-family="Arial, sans-serif" font-size="48" fill="#94a3b8" text-anchor="middle">📷</text>
  
  <!-- Product info -->
  <text x="500" y="120" font-family="Arial, sans-serif" font-size="18" fill="#64748b">${escapeXml(product.brand)}</text>
  <text x="500" y="175" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#1e293b">${escapeXml(product.model)}</text>
  <text x="500" y="220" font-family="Arial, sans-serif" font-size="20" fill="#475569">${escapeXml(category?.name || 'Produto')}</text>
  
  <!-- Price -->
  ${priceText ? `
  <text x="500" y="300" font-family="Arial, sans-serif" font-size="18" fill="#64748b">A partir de</text>
  <text x="500" y="360" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#10b981">${escapeXml(priceText)}</text>
  ` : ''}
  
  <!-- Score if available -->
  ${product.editorialScores?.overall ? `
  <rect x="500" y="400" width="120" height="50" rx="8" fill="#1e40af"/>
  <text x="560" y="432" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle">⭐ ${product.editorialScores.overall}/10</text>
  ` : ''}
  
  <!-- ComparaTop branding -->
  <text x="1080" y="560" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#1e40af" text-anchor="end">ComparaTop</text>
  <text x="1080" y="540" font-family="Arial, sans-serif" font-size="14" fill="#64748b" text-anchor="end">Compare antes de comprar</text>
  
</svg>`;

    return svg;
}

async function generateOGImages() {
    console.log('🖼️  OG Image Generator\n');

    // Ensure output directory exists
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });

    // Load catalogs
    const catalogFiles = fs.readdirSync(CONFIG.catalogsDir).filter(f => f.endsWith('.json'));

    let generated = 0;

    for (const file of catalogFiles) {
        const catalog = JSON.parse(fs.readFileSync(path.join(CONFIG.catalogsDir, file), 'utf-8'));
        const category = catalog.category;

        for (const [productId, product] of Object.entries(catalog.products || {})) {
            console.log(`  Generating: ${productId}`);

            const svg = generateOGImageSVG(product, category);
            const svgPath = path.join(CONFIG.outputDir, `${productId}.svg`);
            const pngPath = path.join(CONFIG.outputDir, `${productId}.png`);

            // Always save SVG
            fs.writeFileSync(svgPath, svg);

            // Convert to PNG if sharp is available
            if (sharp) {
                try {
                    await sharp(Buffer.from(svg))
                        .png()
                        .toFile(pngPath);
                    console.log(`    ✅ Created PNG`);
                } catch (err) {
                    console.log(`    ⚠️  PNG conversion failed: ${err.message}`);
                }
            }

            generated++;
        }
    }

    console.log(`\n✅ Generated ${generated} OG images`);
    console.log(`📁 Output: ${CONFIG.outputDir}`);
}

generateOGImages().catch(console.error);
