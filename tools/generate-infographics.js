/**
 * Infographic Generator - Create comparison infographics for Pinterest/Instagram
 * 
 * Generates visual comparison images with:
 * - Product A vs Product B
 * - Key specs comparison
 * - Prices
 * - Winner indicators
 * 
 * Output: SVG files (can be converted to PNG with sharp)
 * 
 * Usage: node tools/generate-infographics.js
 */

const fs = require('fs');
const path = require('path');

// Check for sharp
let sharp;
try {
    sharp = require('sharp');
} catch (e) {
    console.log('⚠️  sharp not installed. Will generate SVG only.');
}

const CONFIG = {
    catalogsDir: path.join(__dirname, '..', 'data', 'catalogs'),
    outputDir: path.join(__dirname, '..', 'dist', 'assets', 'infographics'),
    width: 1080,
    height: 1350 // Vertical for Pinterest/Instagram
};

function formatBRL(value) {
    if (!value) return 'N/A';
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
        .replace(/"/g, '&quot;');
}

function getWinner(valA, valB, higherIsBetter = true) {
    if (valA === valB) return 'tie';
    if (higherIsBetter) return valA > valB ? 'A' : 'B';
    return valA < valB ? 'A' : 'B';
}

function generateComparisonSVG(productA, productB) {
    const specsA = productA.specs || {};
    const specsB = productB.specs || {};

    const priceA = Math.min(...(productA.offers || []).filter(o => o.price).map(o => o.price)) || 0;
    const priceB = Math.min(...(productB.offers || []).filter(o => o.price).map(o => o.price)) || 0;

    const scoreA = productA.editorialScores?.overall || 0;
    const scoreB = productB.editorialScores?.overall || 0;

    // Determine winners for each category
    const winners = {
        capacity: getWinner(specsA.capacidade_total, specsB.capacidade_total, true),
        consumption: getWinner(specsA.consumo_kwh, specsB.consumo_kwh, false),
        price: getWinner(priceA, priceB, false),
        score: getWinner(scoreA, scoreB, true)
    };

    const overallWinner = scoreA > scoreB ? 'A' : scoreB > scoreA ? 'B' : 'tie';

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${CONFIG.width}" height="${CONFIG.height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a"/>
      <stop offset="100%" style="stop-color:#1e3a8a"/>
    </linearGradient>
    <linearGradient id="cardA" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6"/>
      <stop offset="100%" style="stop-color:#1d4ed8"/>
    </linearGradient>
    <linearGradient id="cardB" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#10b981"/>
      <stop offset="100%" style="stop-color:#059669"/>
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="100%" height="100%" fill="url(#bg)"/>
  
  <!-- Title -->
  <text x="540" y="70" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle">COMPARATIVO</text>
  <text x="540" y="110" font-family="Arial, sans-serif" font-size="24" fill="#94a3b8" text-anchor="middle">${escapeXml(productA.model)} vs ${escapeXml(productB.model)}</text>
  
  <!-- VS Badge -->
  <circle cx="540" cy="280" r="40" fill="#f59e0b"/>
  <text x="540" y="292" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">VS</text>
  
  <!-- Product A Card -->
  <rect x="40" y="150" width="450" height="220" rx="16" fill="url(#cardA)"/>
  <text x="265" y="200" font-family="Arial, sans-serif" font-size="18" fill="rgba(255,255,255,0.8)" text-anchor="middle">${escapeXml(productA.brand)}</text>
  <text x="265" y="240" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">${escapeXml(productA.model)}</text>
  <text x="265" y="290" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle">${formatBRL(priceA)}</text>
  <text x="265" y="340" font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.9)" text-anchor="middle">⭐ ${scoreA}/10</text>
  
  <!-- Product B Card -->
  <rect x="590" y="150" width="450" height="220" rx="16" fill="url(#cardB)"/>
  <text x="815" y="200" font-family="Arial, sans-serif" font-size="18" fill="rgba(255,255,255,0.8)" text-anchor="middle">${escapeXml(productB.brand)}</text>
  <text x="815" y="240" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">${escapeXml(productB.model)}</text>
  <text x="815" y="290" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle">${formatBRL(priceB)}</text>
  <text x="815" y="340" font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.9)" text-anchor="middle">⭐ ${scoreB}/10</text>
  
  <!-- Comparison Table -->
  <rect x="40" y="400" width="1000" height="400" rx="16" fill="rgba(255,255,255,0.05)"/>
  
  <!-- Table Header -->
  <text x="200" y="450" font-family="Arial, sans-serif" font-size="18" fill="#94a3b8" text-anchor="middle">ESPECIFICAÇÃO</text>
  <text x="540" y="450" font-family="Arial, sans-serif" font-size="18" fill="#3b82f6" text-anchor="middle">${escapeXml(productA.model)}</text>
  <text x="880" y="450" font-family="Arial, sans-serif" font-size="18" fill="#10b981" text-anchor="middle">${escapeXml(productB.model)}</text>
  
  <!-- Rows -->
  <line x1="60" y1="470" x2="1020" y2="470" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
  
  <!-- Capacity -->
  <text x="200" y="520" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle">📦 Capacidade</text>
  <text x="540" y="520" font-family="Arial, sans-serif" font-size="20" fill="${winners.capacity === 'A' ? '#10b981' : 'white'}" text-anchor="middle">${specsA.capacidade_total || '-'}L ${winners.capacity === 'A' ? '✓' : ''}</text>
  <text x="880" y="520" font-family="Arial, sans-serif" font-size="20" fill="${winners.capacity === 'B' ? '#10b981' : 'white'}" text-anchor="middle">${specsB.capacidade_total || '-'}L ${winners.capacity === 'B' ? '✓' : ''}</text>
  
  <!-- Consumption -->
  <text x="200" y="580" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle">⚡ Consumo</text>
  <text x="540" y="580" font-family="Arial, sans-serif" font-size="20" fill="${winners.consumption === 'A' ? '#10b981' : 'white'}" text-anchor="middle">${specsA.consumo_kwh || '-'} kWh ${winners.consumption === 'A' ? '✓' : ''}</text>
  <text x="880" y="580" font-family="Arial, sans-serif" font-size="20" fill="${winners.consumption === 'B' ? '#10b981' : 'white'}" text-anchor="middle">${specsB.consumo_kwh || '-'} kWh ${winners.consumption === 'B' ? '✓' : ''}</text>
  
  <!-- Dimensions -->
  <text x="200" y="640" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle">📐 Largura</text>
  <text x="540" y="640" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle">${specsA.largura_cm || '-'} cm</text>
  <text x="880" y="640" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle">${specsB.largura_cm || '-'} cm</text>
  
  <!-- Freezer -->
  <text x="200" y="700" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle">❄️ Freezer</text>
  <text x="540" y="700" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle">${specsA.capacidade_freezer || '-'}L</text>
  <text x="880" y="700" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle">${specsB.capacidade_freezer || '-'}L</text>
  
  <!-- Price Row -->
  <text x="200" y="760" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle">💰 Preço</text>
  <text x="540" y="760" font-family="Arial, sans-serif" font-size="20" fill="${winners.price === 'A' ? '#10b981' : 'white'}" text-anchor="middle">${formatBRL(priceA)} ${winners.price === 'A' ? '✓' : ''}</text>
  <text x="880" y="760" font-family="Arial, sans-serif" font-size="20" fill="${winners.price === 'B' ? '#10b981' : 'white'}" text-anchor="middle">${formatBRL(priceB)} ${winners.price === 'B' ? '✓' : ''}</text>
  
  <!-- Winner Section -->
  ${overallWinner !== 'tie' ? `
  <rect x="40" y="830" width="1000" height="100" rx="16" fill="${overallWinner === 'A' ? '#3b82f6' : '#10b981'}"/>
  <text x="540" y="870" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle">🏆 RECOMENDAÇÃO: ${escapeXml(overallWinner === 'A' ? productA.model : productB.model)}</text>
  <text x="540" y="905" font-family="Arial, sans-serif" font-size="18" fill="rgba(255,255,255,0.8)" text-anchor="middle">Melhor avaliação geral (${overallWinner === 'A' ? scoreA : scoreB}/10)</text>
  ` : `
  <rect x="40" y="830" width="1000" height="100" rx="16" fill="#f59e0b"/>
  <text x="540" y="880" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle">⚖️ EMPATE - Ambos são excelentes opções!</text>
  `}
  
  <!-- Footer / Branding -->
  <text x="540" y="990" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">ComparaTop</text>
  <text x="540" y="1020" font-family="Arial, sans-serif" font-size="16" fill="#94a3b8" text-anchor="middle">comparatop.com.br</text>
  
  <!-- CTA -->
  <rect x="390" y="1060" width="300" height="50" rx="25" fill="#f59e0b"/>
  <text x="540" y="1093" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">VER COMPARATIVO COMPLETO →</text>
  
  <!-- Decorative elements -->
  <circle cx="100" cy="1200" r="80" fill="rgba(59, 130, 246, 0.1)"/>
  <circle cx="980" cy="1250" r="60" fill="rgba(16, 185, 129, 0.1)"/>
  
</svg>`;

    return svg;
}

async function generateInfographics() {
    console.log('🖼️  Infographic Generator - Comparison Images\n');

    fs.mkdirSync(CONFIG.outputDir, { recursive: true });

    const catalogFiles = fs.readdirSync(CONFIG.catalogsDir).filter(f => f.endsWith('.json'));
    let generated = 0;

    for (const file of catalogFiles) {
        const catalog = JSON.parse(fs.readFileSync(path.join(CONFIG.catalogsDir, file), 'utf-8'));
        const products = Object.values(catalog.products || {});

        // Generate infographic for each pair of products
        for (let i = 0; i < products.length; i++) {
            for (let j = i + 1; j < products.length; j++) {
                const productA = products[i];
                const productB = products[j];

                // Canonical name (alphabetically sorted)
                const [first, second] = [productA.id, productB.id].sort();
                const filename = `${first}-vs-${second}`;

                console.log(`  Generating: ${filename}`);

                const svg = generateComparisonSVG(
                    first === productA.id ? productA : productB,
                    first === productA.id ? productB : productA
                );

                const svgPath = path.join(CONFIG.outputDir, `${filename}.svg`);
                fs.writeFileSync(svgPath, svg);

                // Convert to PNG if sharp available
                if (sharp) {
                    try {
                        const pngPath = path.join(CONFIG.outputDir, `${filename}.png`);
                        await sharp(Buffer.from(svg))
                            .png()
                            .toFile(pngPath);
                        console.log(`    ✅ PNG created`);
                    } catch (err) {
                        console.log(`    ⚠️  PNG failed: ${err.message}`);
                    }
                }

                generated++;
            }
        }
    }

    console.log(`\n✅ Generated ${generated} comparison infographics`);
    console.log(`📁 Output: ${CONFIG.outputDir}`);
    console.log('\n📌 Use these on Pinterest, Instagram, and social media!');
}

generateInfographics().catch(console.error);
