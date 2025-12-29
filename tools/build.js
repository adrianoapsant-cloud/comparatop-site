#!/usr/bin/env node
/**
 * ComparaTop - Static Pre-render Build Script
 * 
 * Generates static HTML pages from JSON data for SEO
 * 
 * Usage: node tools/build.js
 * 
 * Output: dist/ folder with pre-rendered pages
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    srcDir: path.join(__dirname, '..'),
    distDir: path.join(__dirname, '..', 'dist'),
    templateFile: path.join(__dirname, '..', 'index.html'),
    catalogsDir: path.join(__dirname, '..', 'data', 'catalogs'),
    baseUrl: 'https://comparatop.com.br',
    imageBaseUrl: 'https://img.comparatop.com.br', // R2 Bucket Domain
    siteName: 'ComparaTop'
};

// Utility functions
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function formatBRL(value) {
    if (value == null) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function resolveImageUrl(url) {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    // Remove base URL if it was already prepended by mistake
    if (url.startsWith(CONFIG.baseUrl)) return url.replace(CONFIG.baseUrl, CONFIG.imageBaseUrl);

    // Ensure we don't have double slash issues if url doesn't start with /
    const cleanUrl = url.startsWith('/') ? url : '/' + url;
    return CONFIG.imageBaseUrl + cleanUrl;
}

// Load template and catalogs
function loadTemplate() {
    return fs.readFileSync(CONFIG.templateFile, 'utf-8');
}

function loadCatalogs() {
    const catalogs = {};
    const files = fs.readdirSync(CONFIG.catalogsDir).filter(f => f.endsWith('.json'));

    for (const file of files) {
        const data = JSON.parse(fs.readFileSync(path.join(CONFIG.catalogsDir, file), 'utf-8'));
        catalogs[data.category.slug] = data;
    }

    return catalogs;
}

// Generate meta tags replacement
function generateMetaTags({ title, description, url, image, type = 'website' }) {
    // Default OG Image also goes to R2
    const defaultImage = resolveImageUrl('/assets/og-image.png');
    const finalImage = image ? resolveImageUrl(image) : defaultImage;

    return `
    <title>${escapeHtml(title)}</title>
    
    <!-- SEO Meta Tags -->
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${url.endsWith('/') ? url : url + '/'}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${type}">
    <meta property="og:url" content="${url.endsWith('/') ? url : url + '/'}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:image" content="${finalImage}">
    
    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${finalImage}">
    `;
}

// Generate JSON-LD for product (Schema.org)
// REGRAS: Não inventar dados - só incluir se presente no conteúdo
function generateProductJsonLd(product, categorySlug, category, otherProducts = []) {
    const offers = (product.offers || []).filter(o => o.price && o.price > 0);
    const sortedOffers = [...offers].sort((a, b) => a.price - b.price);
    const lowestPrice = sortedOffers[0]?.price;
    const highestPrice = sortedOffers[sortedOffers.length - 1]?.price;

    // ThirdParty ratings - SOMENTE de lojas externas, não inventamos
    const thirdParty = (product.thirdPartyRatings || [])
        .filter(r => r.ratingValue && r.reviewCount && r.reviewCount > 0);

    const avgRating = thirdParty.length > 0
        ? (thirdParty.reduce((sum, r) => sum + (r.ratingValue || 0), 0) / thirdParty.length).toFixed(1)
        : null;
    const totalReviews = thirdParty.reduce((sum, r) => sum + (r.reviewCount || 0), 0);

    // Base schema
    const schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "brand": {
            "@type": "Brand",
            "name": product.brand
        },
        "model": product.model,
        "sku": product.id
    };

    // alternateName - variações de nome para SEO (keywords)
    if (product.keywords && product.keywords.length > 0) {
        schema.alternateName = product.keywords;
    }

    // Description - só se existir VoC ou specs
    if (product.voc?.thirtySecondSummary) {
        schema.description = product.voc.thirtySecondSummary;
    } else if (product.specs?.capacidade_total) {
        schema.description = `${product.brand} ${product.model} - ${category?.name || 'Eletrodoméstico'} ${product.specs.capacidade_total}L`;
    }

    // Image - só se existir (USE R2)
    if (product.imageUrl) {
        schema.image = resolveImageUrl(product.imageUrl);
    }

    // Offers - SOMENTE se há ofertas com preço real
    if (sortedOffers.length > 0 && lowestPrice > 0) {
        schema.offers = {
            "@type": "AggregateOffer",
            "lowPrice": lowestPrice,
            "highPrice": highestPrice || lowestPrice,
            "priceCurrency": "BRL",
            "offerCount": sortedOffers.length
        };
        // Availability só se soubermos
        const hasStock = sortedOffers.some(o => o.inStock !== false);
        if (hasStock) {
            schema.offers.availability = "https://schema.org/InStock";
        }
    }

    // AggregateRating - SOMENTE de fontes terceiras com dados reais
    // NÃO inventamos rating, só usamos se thirdPartyRatings tiver dados
    if (avgRating && totalReviews > 0) {
        schema.aggregateRating = {
            "@type": "AggregateRating",
            "ratingValue": avgRating,
            "bestRating": "5",
            "worstRating": "1",
            "reviewCount": totalReviews
        };
    }

    // dateModified - se disponível
    if (product.lastUpdated || product.editorialScores?.updatedAt) {
        schema.dateModified = product.lastUpdated || product.editorialScores?.updatedAt;
    }

    // Review com positiveNotes e negativeNotes (VoC data)
    if (product.voc && (product.voc.pros?.length || product.voc.cons?.length)) {
        schema.review = {
            "@type": "Review",
            "author": {
                "@type": "Organization",
                "name": "ComparaTop"
            },
            "reviewBody": product.voc.thirtySecondSummary || product.voc.oneLiner || ""
        };

        // positiveNotes (Prós)
        if (product.voc.pros?.length > 0) {
            schema.review.positiveNotes = {
                "@type": "ItemList",
                "itemListElement": product.voc.pros.map((pro, idx) => ({
                    "@type": "ListItem",
                    "position": idx + 1,
                    "name": typeof pro === 'object' ? pro.topic : pro
                }))
            };
        }

        // negativeNotes (Contras)
        if (product.voc.cons?.length > 0) {
            schema.review.negativeNotes = {
                "@type": "ItemList",
                "itemListElement": product.voc.cons.map((con, idx) => ({
                    "@type": "ListItem",
                    "position": idx + 1,
                    "name": typeof con === 'object' ? con.topic : con
                }))
            };
        }
    }

    // relatedLink - URLs de comparação com outros produtos da mesma categoria
    if (otherProducts && otherProducts.length > 0) {
        const comparisonUrls = otherProducts
            .filter(other => other.id !== product.id)
            .map(other => {
                const [slugFirst, slugSecond] = [product.id, other.id].sort();
                return `${CONFIG.baseUrl}/comparar/${categorySlug}/${slugFirst}-vs-${slugSecond}/`;
            });

        if (comparisonUrls.length > 0) {
            schema.relatedLink = comparisonUrls;
        }
    }

    return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
}

// Generate BreadcrumbList JSON-LD
function generateBreadcrumbJsonLd(items) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            ...(item.url ? { "item": item.url } : {})
        }))
    };
    return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
}


// Generate JSON-LD for comparison
function generateComparisonJsonLd(productA, productB, categorySlug) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": `${productA.name} vs ${productB.name} - Comparativo`,
        "description": `Compare ${productA.name} e ${productB.name}. Veja diferenças de preço, capacidade, consumo e avaliações.`,
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Início", "item": CONFIG.baseUrl },
                { "@type": "ListItem", "position": 2, "name": "Comparar", "item": CONFIG.baseUrl + "/comparar" },
                { "@type": "ListItem", "position": 3, "name": `${productA.model} vs ${productB.model}` }
            ]
        }
    };

    return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
}

// Generate product page content (to inject in body)
function generateProductContent(product, category, otherProducts = [], categorySlug = '') {
    const specs = product.specs || {};
    const offers = product.offers || [];
    const bestOffer = offers.sort((a, b) => a.price - b.price)[0];
    const editorial = product.editorialScores || {};
    const overall = editorial.overall || 0;

    // Generate comparison links for other products in the same category
    const comparisonLinks = otherProducts
        .filter(p => p.id !== product.id)
        .map(other => {
            // Canonicalization: sort slugs alphabetically
            const [slugFirst, slugSecond] = [product.id, other.id].sort();
            const comparisonUrl = `/comparar/${categorySlug}/${slugFirst}-vs-${slugSecond}/`;
            return `<li><a href="${comparisonUrl}">${escapeHtml(product.model)} vs ${escapeHtml(other.model)}</a></li>`;
        })
        .join('');

    return `
    <!-- Pre-rendered content for SEO (bots will see this) -->
    <div id="prerendered-content" class="prerendered-seo-content">
        <nav aria-label="Breadcrumb" class="breadcrumb-nav">
            <a href="/">Início</a> › 
            <a href="/categoria/${category.slug}">${category.name}</a> › 
            <span>${product.name}</span>
        </nav>
        
        <article itemscope itemtype="https://schema.org/Product">
            <h1 itemprop="name">${escapeHtml(product.name)}</h1>
            
            <div class="product-summary">
                <p itemprop="description">
                    ${escapeHtml(product.voc?.thirtySecondSummary || `Geladeira ${product.brand} ${product.model} com ${specs.capacidade_total}L de capacidade, ${specs.frost_free ? 'Frost Free' : ''}, Selo Procel ${specs.selo_procel || 'A'}.`)}
                </p>
                
                <div class="product-rating">
                    <strong>Nota Editorial:</strong> 
                    <span itemprop="aggregateRating" itemscope itemtype="https://schema.org/AggregateRating">
                        <span itemprop="ratingValue">${overall}</span>/<span itemprop="bestRating">10</span>
                        <meta itemprop="worstRating" content="0">
                        <meta itemprop="ratingCount" content="${product.voc?.sample?.totalApprox || 1}">
                    </span>
                </div>
            </div>
            
            <section class="specs-section">
                <h2>Especificações Técnicas</h2>
                <table class="specs-table">
                    <tr><th>Capacidade Total</th><td>${specs.capacidade_total || '-'}L</td></tr>
                    <tr><th>Capacidade Freezer</th><td>${specs.capacidade_freezer || '-'}L</td></tr>
                    <tr><th>Consumo</th><td>${specs.consumo_kwh || '-'} kWh/mês</td></tr>
                    <tr><th>Dimensões (L×A×P)</th><td>${specs.largura_cm || '-'} × ${specs.altura_cm || '-'} × ${specs.profundidade_cm || '-'} cm</td></tr>
                    <tr><th>Peso</th><td>${specs.peso_kg || '-'} kg</td></tr>
                    <tr><th>Selo Procel</th><td>${specs.selo_procel || '-'}</td></tr>
                    <tr><th>Frost Free</th><td>${specs.frost_free ? 'Sim' : 'Não'}</td></tr>
                </table>
            </section>
            
            ${offers.length > 0 ? `
            <section class="offers-section" itemprop="offers" itemscope itemtype="https://schema.org/AggregateOffer">
                <h2>Onde Comprar</h2>
                <meta itemprop="priceCurrency" content="BRL">
                <meta itemprop="lowPrice" content="${bestOffer?.price || 0}">
                <ul class="offers-list">
                    ${offers.map(o => `
                        <li>
                            <strong>${escapeHtml(o.retailerName || o.retailer || 'Loja')}</strong>: 
                            ${formatBRL(o.price)}
                            ${o.installments ? ` (ou ${o.installments})` : ''}
                        </li>
                    `).join('')}
                </ul>
            </section>
            ` : ''}
            
            ${product.voc ? `
            <section class="voc-section">
                <h2>O que compradores dizem</h2>
                <p><strong>Resumo:</strong> ${escapeHtml(product.voc.oneLiner || '')}</p>
                
                ${product.voc.pros?.length ? `
                <div class="pros">
                    <h3>✅ Pontos Positivos</h3>
                    <ul>${product.voc.pros.map(p => `<li><strong>${escapeHtml(p.topic || p)}</strong>: ${escapeHtml(p.detail || '')}</li>`).join('')}</ul>
                </div>
                ` : ''}
                
                ${product.voc.cons?.length ? `
                <div class="cons">
                    <h3>❌ Pontos Negativos</h3>
                    <ul>${product.voc.cons.map(c => `<li><strong>${escapeHtml(c.topic || c)}</strong>: ${escapeHtml(c.detail || '')}</li>`).join('')}</ul>
                </div>
                ` : ''}
            </section>
            ` : ''}
        </article>
    </div>
    
    <!-- SEO Links for comparison pages (hidden, for crawlers) -->
    <nav class="seo-compare-links" aria-label="Comparações disponíveis">
        ${otherProducts.filter(p => p.id !== product.id).map(other => {
        const [slugFirst, slugSecond] = [product.id, other.id].sort();
        const comparisonUrl = `/comparar/${categorySlug}/${slugFirst}-vs-${slugSecond}/`;
        return `<a href="${comparisonUrl}">${escapeHtml(product.model)} vs ${escapeHtml(other.model)}</a>`;
    }).join(' ')}
    </nav>
    
    <style>
        .prerendered-seo-content { display: none; }
        .seo-compare-links { display: none; }
    </style>
    `;
}

// Generate comparison page content - RICH VERSION
function generateComparisonContent(productA, productB, category) {
    const specsA = productA.specs || {};
    const specsB = productB.specs || {};
    const scoresA = productA.editorialScores || {};
    const scoresB = productB.editorialScores || {};
    const vocA = productA.voc || {};
    const vocB = productB.voc || {};

    // Helper to determine winner for a spec
    const getWinner = (valA, valB, higherIsBetter = true) => {
        if (valA === valB) return 'tie';
        if (higherIsBetter) return valA > valB ? 'A' : 'B';
        return valA < valB ? 'A' : 'B';
    };

    // Generate automatic pros/cons based on specs comparison
    const autoComparison = [];

    // Capacity comparison
    if (specsA.capacidade_total && specsB.capacidade_total) {
        const diff = Math.abs(specsA.capacidade_total - specsB.capacidade_total);
        if (diff >= 20) {
            const winner = specsA.capacidade_total > specsB.capacidade_total ? productA : productB;
            autoComparison.push({
                topic: 'Capacidade',
                winner: winner.model,
                detail: `${winner.model} oferece ${diff}L a mais de capacidade total`
            });
        }
    }

    // Consumption comparison
    if (specsA.consumo_kwh && specsB.consumo_kwh) {
        const diff = Math.abs(specsA.consumo_kwh - specsB.consumo_kwh);
        if (diff >= 2) {
            const winner = specsA.consumo_kwh < specsB.consumo_kwh ? productA : productB;
            autoComparison.push({
                topic: 'Economia de Energia',
                winner: winner.model,
                detail: `${winner.model} consome ${diff.toFixed(1)} kWh/mês a menos`
            });
        }
    }

    // Width comparison
    if (specsA.largura_cm && specsB.largura_cm) {
        const diff = Math.abs(specsA.largura_cm - specsB.largura_cm);
        if (diff >= 5) {
            const winner = specsA.largura_cm < specsB.largura_cm ? productA : productB;
            autoComparison.push({
                topic: 'Espaços Estreitos',
                winner: winner.model,
                detail: `${winner.model} é ${diff}cm mais estreita`
            });
        }
    }

    // Price comparison
    const minPriceA = Math.min(...(productA.offers || []).map(o => o.price));
    const minPriceB = Math.min(...(productB.offers || []).map(o => o.price));
    const priceDiff = Math.abs(minPriceA - minPriceB);
    if (priceDiff >= 100) {
        const cheaper = minPriceA < minPriceB ? productA : productB;
        autoComparison.push({
            topic: 'Preço',
            winner: cheaper.model,
            detail: `${cheaper.model} é R$ ${priceDiff.toFixed(0)} mais barata`
        });
    }

    // Score topics
    const scoreTopics = ['refrigeracao', 'durabilidade', 'consumo', 'espaco', 'custo_beneficio', 'ruido', 'funcionalidades', 'encaixe', 'beleza'];
    const topicLabels = {
        refrigeracao: '🧊 Refrigeração',
        durabilidade: '🔧 Durabilidade',
        consumo: '⚡ Consumo',
        espaco: '📦 Espaço',
        custo_beneficio: '💰 Custo-Benefício',
        ruido: '🔇 Ruído',
        funcionalidades: '⚙️ Funcionalidades',
        encaixe: '📐 Encaixe',
        beleza: '✨ Design'
    };

    let winsA = 0, winsB = 0;
    scoreTopics.forEach(topic => {
        const scoreA = scoresA[topic]?.score || 0;
        const scoreB = scoresB[topic]?.score || 0;
        if (scoreA > scoreB) winsA++;
        else if (scoreB > scoreA) winsB++;
    });

    const overallWinner = scoresA.overall > scoresB.overall ? productA :
        scoresB.overall > scoresA.overall ? productB : null;

    return `
    <div id="comparison-content" class="comparison-page-content">
        <nav aria-label="Breadcrumb" class="breadcrumb-nav">
            <a href="/">Início</a> › 
            <a href="/geladeiras/">${category.name}</a> › 
            <span>${productA.model} vs ${productB.model}</span>
        </nav>
        
        <article>
            <h1>${escapeHtml(productA.name)} vs ${escapeHtml(productB.name)}</h1>
            
            <!-- Quick Summary -->
            <div class="comparison-summary-box">
                <div class="summary-cards">
                    <div class="summary-card ${overallWinner === productA ? 'winner' : ''}">
                        <div class="summary-brand">${productA.brand}</div>
                        <div class="summary-model">${productA.model}</div>
                        <div class="summary-score">${scoresA.overall || '-'}<span>/10</span></div>
                        <div class="summary-price">A partir de ${formatBRL(minPriceA)}</div>
                        ${overallWinner === productA ? '<div class="winner-badge">⭐ Melhor Nota</div>' : ''}
                    </div>
                    <div class="vs-divider">VS</div>
                    <div class="summary-card ${overallWinner === productB ? 'winner' : ''}">
                        <div class="summary-brand">${productB.brand}</div>
                        <div class="summary-model">${productB.model}</div>
                        <div class="summary-score">${scoresB.overall || '-'}<span>/10</span></div>
                        <div class="summary-price">A partir de ${formatBRL(minPriceB)}</div>
                        ${overallWinner === productB ? '<div class="winner-badge">⭐ Melhor Nota</div>' : ''}
                    </div>
                </div>
            </div>
            
            <!-- Automatic Comparison -->
            <section class="auto-comparison-section">
                <h2>⚖️ Análise Comparativa</h2>
                <div class="auto-comparison-grid">
                    ${autoComparison.map(item => `
                        <div class="auto-comparison-item">
                            <div class="comparison-topic">${item.topic}</div>
                            <div class="comparison-winner">🏆 ${item.winner}</div>
                            <div class="comparison-detail">${item.detail}</div>
                        </div>
                    `).join('')}
                </div>
            </section>
            
            <!-- Editorial Scores -->
            <section class="scores-comparison-section">
                <h2>📊 Notas Editoriais Lado a Lado</h2>
                <div class="scores-grid">
                    ${scoreTopics.map(topic => {
        const scoreA = scoresA[topic]?.score || 0;
        const scoreB = scoresB[topic]?.score || 0;
        const winnerClass = scoreA > scoreB ? 'winner-a' : scoreB > scoreA ? 'winner-b' : '';
        return `
                            <div class="score-row ${winnerClass}">
                                <div class="score-topic">${topicLabels[topic] || topic}</div>
                                <div class="score-bars">
                                    <div class="score-bar bar-a" style="width: ${scoreA * 10}%"><span>${scoreA}</span></div>
                                    <div class="score-bar bar-b" style="width: ${scoreB * 10}%"><span>${scoreB}</span></div>
                                </div>
                            </div>
                        `;
    }).join('')}
                </div>
                <div class="scores-summary">
                    <strong>Resumo:</strong> ${productA.model} vence em ${winsA} categorias, ${productB.model} vence em ${winsB} categorias.
                </div>
            </section>
            
            <!-- Specs Table -->
            <section class="comparison-table-section">
                <h2>📋 Especificações Completas</h2>
                <table class="comparison-table">
                    <thead>
                        <tr><th>Especificação</th><th>${productA.model}</th><th>${productB.model}</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>Capacidade Total</td><td>${specsA.capacidade_total}L</td><td>${specsB.capacidade_total}L</td></tr>
                        <tr><td>Capacidade Freezer</td><td>${specsA.capacidade_freezer}L</td><td>${specsB.capacidade_freezer}L</td></tr>
                        <tr><td>Consumo Mensal</td><td>${specsA.consumo_kwh} kWh</td><td>${specsB.consumo_kwh} kWh</td></tr>
                        <tr><td>Dimensões (LxAxP)</td><td>${specsA.largura_cm}×${specsA.altura_cm}×${specsA.profundidade_cm} cm</td><td>${specsB.largura_cm}×${specsB.altura_cm}×${specsB.profundidade_cm} cm</td></tr>
                        <tr><td>Peso</td><td>${specsA.peso_kg} kg</td><td>${specsB.peso_kg} kg</td></tr>
                        <tr><td>Selo Procel</td><td>${specsA.selo_procel}</td><td>${specsB.selo_procel}</td></tr>
                        <tr><td>Nota Editorial</td><td><strong>${scoresA.overall}/10</strong></td><td><strong>${scoresB.overall}/10</strong></td></tr>
                    </tbody>
                </table>
            </section>
            
            <!-- VoC -->
            <section class="voc-comparison-section">
                <h2>🗣️ Voz do Cliente</h2>
                <div class="voc-grid">
                    <div class="voc-card">
                        <h3>${productA.model}</h3>
                        <div class="voc-sentiment ${vocA.sentimentClass || 'neutral'}">${vocA.sentiment || 'Sem dados'}</div>
                        <p class="voc-oneliner">${vocA.oneLiner || ''}</p>
                        <h4>👍 Pontos Positivos</h4>
                        <ul class="voc-pros">
                            ${(vocA.pros || []).slice(0, 3).map(p => `<li><strong>${p.topic}</strong>: ${p.detail}</li>`).join('')}
                        </ul>
                        <h4>👎 Pontos de Atenção</h4>
                        <ul class="voc-cons">
                            ${(vocA.cons || []).slice(0, 3).map(c => `<li><strong>${c.topic}</strong>: ${c.detail}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="voc-card">
                        <h3>${productB.model}</h3>
                        <div class="voc-sentiment ${vocB.sentimentClass || 'neutral'}">${vocB.sentiment || 'Sem dados'}</div>
                        <p class="voc-oneliner">${vocB.oneLiner || ''}</p>
                        <h4>👍 Pontos Positivos</h4>
                        <ul class="voc-pros">
                            ${(vocB.pros || []).slice(0, 3).map(p => `<li><strong>${p.topic}</strong>: ${p.detail}</li>`).join('')}
                        </ul>
                        <h4>👎 Pontos de Atenção</h4>
                        <ul class="voc-cons">
                            ${(vocB.cons || []).slice(0, 3).map(c => `<li><strong>${c.topic}</strong>: ${c.detail}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </section>
            
            <!-- Offers -->
            <section class="offers-comparison">
                <h2>🛒 Onde Comprar</h2>
                <div class="offers-grid">
                    <div class="product-offers">
                        <h3>${productA.model}</h3>
                        <div class="best-price">A partir de ${formatBRL(minPriceA)}</div>
                        <ul>
                            ${(productA.offers || []).map(o => `
                                <li><a href="${o.url}" target="_blank" rel="noopener sponsored" class="offer-link">
                                    <span class="retailer">${o.retailerName}</span>
                                    <span class="price">${formatBRL(o.price)}</span>
                                    <span class="cta">Ver →</span>
                                </a></li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="product-offers">
                        <h3>${productB.model}</h3>
                        <div class="best-price">A partir de ${formatBRL(minPriceB)}</div>
                        <ul>
                            ${(productB.offers || []).map(o => `
                                <li><a href="${o.url}" target="_blank" rel="noopener sponsored" class="offer-link">
                                    <span class="retailer">${o.retailerName}</span>
                                    <span class="price">${formatBRL(o.price)}</span>
                                    <span class="cta">Ver →</span>
                                </a></li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </section>

            <!-- Verdict -->
            <section class="decision-section">
                <h2>🎯 Veredito Final</h2>
                <div class="verdict-grid">
                    <div class="verdict-item">
                        <strong>Escolha ${productA.model} se:</strong>
                        <ul>
                            ${specsA.largura_cm < specsB.largura_cm ? `<li>Tem nicho estreito (até ${specsA.largura_cm + 5}cm)</li>` : ''}
                            ${minPriceA < minPriceB ? '<li>Busca menor preço</li>' : ''}
                            ${specsA.consumo_kwh < specsB.consumo_kwh ? '<li>Quer economizar energia</li>' : ''}
                            ${scoresA.beleza?.score > scoresB.beleza?.score ? '<li>Valoriza design</li>' : ''}
                        </ul>
                    </div>
                    <div class="verdict-item">
                        <strong>Escolha ${productB.model} se:</strong>
                        <ul>
                            ${specsB.capacidade_total > specsA.capacidade_total ? `<li>Precisa de mais espaço (${specsB.capacidade_total}L)</li>` : ''}
                            ${specsB.capacidade_freezer > specsA.capacidade_freezer ? `<li>Usa muito o freezer (${specsB.capacidade_freezer}L)</li>` : ''}
                            ${scoresB.funcionalidades?.score > scoresA.funcionalidades?.score ? '<li>Quer mais funcionalidades</li>' : ''}
                        </ul>
                    </div>
                </div>
                ${overallWinner ? `<p class="verdict-conclusion"><strong>Recomendação:</strong> O ${overallWinner.model} leva vantagem geral com nota ${overallWinner === productA ? scoresA.overall : scoresB.overall}/10.</p>` : ''}
            </section>
            
            <section class="product-links-section">
                <h2>📄 Ver Análises Completas</h2>
                <div class="product-links">
                    <a href="/produto/${category.slug}/${productA.slug}/" class="product-link-btn">Análise ${productA.model} →</a>
                    <a href="/produto/${category.slug}/${productB.slug}/" class="product-link-btn">Análise ${productB.model} →</a>
                </div>
            </section>
        </article>
    </div>
    
    <style>
        .prerendered-seo-content { display: none !important; }
        #comparison-content { display: block !important; padding: 1.5rem; max-width: 1100px; margin: 0 auto; }
        #page-home, .home-hero, .usp-section, .recommender-section, .categories-grid, .popular-products-section, .newsletter-section { display: none !important; }
        
        .breadcrumb-nav { margin-bottom: 1.5rem; font-size: 0.9rem; color: #64748b; }
        .breadcrumb-nav a { color: #3b82f6; text-decoration: none; }
        #comparison-content h1 { font-size: 1.75rem; color: #1e40af; margin-bottom: 1.5rem; }
        
        .comparison-summary-box { background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem; }
        .summary-cards { display: flex; justify-content: center; align-items: center; gap: 1rem; flex-wrap: wrap; }
        .summary-card { background: white; border-radius: 12px; padding: 1.5rem; text-align: center; min-width: 180px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); position: relative; }
        .summary-card.winner { border: 3px solid #10b981; }
        .winner-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #10b981; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; }
        .summary-brand { color: #64748b; font-size: 0.85rem; }
        .summary-model { font-size: 1.2rem; font-weight: 700; color: #1e40af; }
        .summary-score { font-size: 2rem; font-weight: 700; color: #10b981; }
        .summary-score span { font-size: 1rem; color: #64748b; }
        .summary-price { color: #64748b; font-size: 0.9rem; margin-top: 0.5rem; }
        .vs-divider { font-size: 1.5rem; font-weight: 700; color: #3b82f6; }
        
        .auto-comparison-section, .scores-comparison-section, .comparison-table-section, .voc-comparison-section, .offers-comparison, .product-links-section { margin-bottom: 2rem; }
        .auto-comparison-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }
        .auto-comparison-item { background: #f8fafc; border-radius: 8px; padding: 1rem; border-left: 4px solid #10b981; }
        .comparison-topic { font-weight: 600; color: #1e40af; }
        .comparison-winner { color: #10b981; font-weight: 600; }
        .comparison-detail { color: #64748b; font-size: 0.9rem; }
        
        .scores-grid { display: flex; flex-direction: column; gap: 0.5rem; }
        .score-row { display: grid; grid-template-columns: 140px 1fr; align-items: center; gap: 1rem; padding: 0.5rem; border-radius: 6px; }
        .score-row.winner-a { background: rgba(59, 130, 246, 0.1); }
        .score-row.winner-b { background: rgba(16, 185, 129, 0.1); }
        .score-topic { font-size: 0.85rem; color: #334155; }
        .score-bars { display: flex; flex-direction: column; gap: 4px; }
        .score-bar { height: 18px; border-radius: 4px; display: flex; align-items: center; justify-content: flex-end; padding-right: 6px; font-size: 0.7rem; font-weight: 600; color: white; min-width: 25px; }
        .score-bar.bar-a { background: linear-gradient(90deg, #3b82f6, #1d4ed8); }
        .score-bar.bar-b { background: linear-gradient(90deg, #10b981, #059669); }
        .scores-summary { margin-top: 1rem; padding: 1rem; background: #f8fafc; border-radius: 8px; }
        
        .comparison-table { width: 100%; border-collapse: collapse; }
        .comparison-table th, .comparison-table td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
        .comparison-table th { background: #1e40af; color: white; }
        .comparison-table tr:nth-child(even) { background: #f8fafc; }
        
        .voc-grid, .offers-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
        .voc-card, .product-offers { background: #f8fafc; border-radius: 12px; padding: 1.5rem; }
        .voc-card h3, .product-offers h3 { color: #1e40af; margin-bottom: 0.5rem; }
        .voc-sentiment { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; margin-bottom: 0.5rem; }
        .voc-sentiment.positive { background: #dcfce7; color: #166534; }
        .voc-sentiment.mixed { background: #fef3c7; color: #92400e; }
        .voc-oneliner { font-style: italic; color: #64748b; font-size: 0.85rem; margin-bottom: 1rem; }
        .voc-card h4 { font-size: 0.9rem; margin: 0.75rem 0 0.5rem; }
        .voc-pros, .voc-cons { list-style: none; padding: 0; }
        .voc-pros li, .voc-cons li { padding: 0.4rem 0; border-bottom: 1px solid #e2e8f0; font-size: 0.85rem; }
        
        .best-price { color: #10b981; font-size: 1rem; margin-bottom: 0.75rem; font-weight: 600; }
        .product-offers ul { list-style: none; padding: 0; }
        .product-offers li { margin-bottom: 0.5rem; }
        .offer-link { display: flex; justify-content: space-between; align-items: center; padding: 0.6rem; background: white; border-radius: 6px; text-decoration: none; color: inherit; border: 1px solid #e2e8f0; }
        .offer-link:hover { border-color: #3b82f6; }
        .offer-link .retailer { font-weight: 500; }
        .offer-link .price { color: #10b981; font-weight: 700; }
        .offer-link .cta { color: #3b82f6; font-size: 0.8rem; }
        
        .decision-section { background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); color: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; }
        .verdict-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1rem; }
        .verdict-item { background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px; }
        .verdict-item ul { list-style: none; padding: 0; margin: 0.5rem 0 0; }
        .verdict-item li { padding: 0.25rem 0; padding-left: 1.2rem; position: relative; }
        .verdict-item li::before { content: '✓'; position: absolute; left: 0; color: #34d399; }
        .verdict-conclusion { background: rgba(255,255,255,0.15); padding: 1rem; border-radius: 8px; margin: 0; }
        
        .product-links { display: flex; gap: 1rem; flex-wrap: wrap; }
        .product-link-btn { display: inline-block; padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
        .product-link-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); }
        
        @media (max-width: 768px) {
            #comparison-content { padding: 1rem; }
            #comparison-content h1 { font-size: 1.3rem; }
            .summary-cards { flex-direction: column; }
            .score-row { grid-template-columns: 1fr; }
        }
    </style>
    `;
}


// Process template and inject content
function processTemplate(template, { metaTags, jsonLd, bodyContent }) {
    let html = template;

    // Replace meta tags section
    const metaPattern = /<title>.*?<\/title>[\s\S]*?<link href="https:\/\/fonts\.googleapis/;
    html = html.replace(metaPattern, metaTags + '\n    <link href="https://fonts.googleapis');

    // Inject JSON-LD before </head>
    html = html.replace('</head>', jsonLd + '\n</head>');

    // Inject body content after <body> tag
    html = html.replace(/<body>[\s\S]*?<!-- Skip to main content/, bodyContent + '\n    <!-- Skip to main content');

    return html;
}

// Generate home page
function generateHomePage(template, catalogs) {
    console.log('Generating: /index.html');

    const meta = generateMetaTags({
        title: 'ComparaTop - Compare antes de comprar',
        description: 'Compare eletrodomésticos antes de comprar. Análise transparente com síntese de milhares de avaliações reais de compradores.',
        url: CONFIG.baseUrl + '/',
        type: 'website'
    });

    const jsonLd = `<script type="application/ld+json">${JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "ComparaTop",
        "url": CONFIG.baseUrl,
        "description": "Compare eletrodomésticos antes de comprar",
        "potentialAction": {
            "@type": "SearchAction",
            "target": CONFIG.baseUrl + "/busca?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    }, null, 2)}</script>`;

    const bodyContent = `
    <div id="prerendered-content" class="prerendered-seo-content">
        <h1>ComparaTop - Compare Eletrodomésticos</h1>
        <p>Encontre o produto ideal comparando especificações, preços e avaliações reais de milhares de compradores.</p>
        <nav>
            <h2>Categorias</h2>
            <ul>
                ${Object.values(catalogs).map(cat => `
                    <li><a href="/categoria/${cat.category.slug}">${cat.category.name}</a></li>
                `).join('')}
            </ul>
        </nav>
    </div>
    <style>.prerendered-seo-content { display: none; }</style>
    `;

    let html = template;
    html = html.replace(/<title>.*?<\/title>[\s\S]*?(<link href="https:\/\/fonts\.googleapis)/, meta + '\n    $1');
    html = html.replace('</head>', jsonLd + '\n</head>');
    html = html.replace(/<body>/, '<body>\n' + bodyContent);

    const destPath = path.join(CONFIG.distDir, 'index.html');
    ensureDir(path.dirname(destPath));
    fs.writeFileSync(destPath, html);
}

// Generate product pages
function generateProductPages(template, catalogs) {
    for (const [slug, catalog] of Object.entries(catalogs)) {
        const category = catalog.category;
        const products = catalog.products || {};

        for (const [productId, product] of Object.entries(products)) {
            console.log(`Generating: /produto/${slug}/${productId}/index.html`);

            const meta = generateMetaTags({
                title: `${product.name} - Review e Preços | ComparaTop`,
                description: product.voc?.thirtySecondSummary || `Análise completa do ${product.name}. Compare preços, veja especificações e opiniões reais de compradores.`,
                url: `${CONFIG.baseUrl}/produto/${slug}/${productId}`,
                image: resolveImageUrl(product.imageUrl), // USE R2
                type: 'product'
            });

            // JSON-LD com category para contexto + relatedLink para comparações
            const allProductsInCategory = Object.values(products);
            const productJsonLd = generateProductJsonLd(product, slug, category, allProductsInCategory);

            // Breadcrumb JSON-LD
            const canonicalPath = category.canonicalPath || `/${slug}s/`;
            const breadcrumbJsonLd = generateBreadcrumbJsonLd([
                { name: 'Início', url: CONFIG.baseUrl + '/' },
                { name: category.name, url: CONFIG.baseUrl + canonicalPath },
                { name: product.name }
            ]);

            const jsonLd = productJsonLd + '\n' + breadcrumbJsonLd;

            // Pass all products in the category for "Compare with" section
            const bodyContent = generateProductContent(product, category, allProductsInCategory, slug);

            let html = template;
            html = html.replace(/<title>.*?<\/title>[\s\S]*?(<link href="https:\/\/fonts\.googleapis)/, meta + '\n    $1');
            html = html.replace('</head>', jsonLd + '\n</head>');
            html = html.replace(/<body>/, '<body>\n' + bodyContent);

            const destPath = path.join(CONFIG.distDir, 'produto', slug, productId, 'index.html');
            ensureDir(path.dirname(destPath));
            fs.writeFileSync(destPath, html);
        }
    }
}

// Generate category pages
function generateCategoryPages(template, catalogs) {
    for (const [slug, catalog] of Object.entries(catalogs)) {
        const category = catalog.category;
        const products = Object.values(catalog.products || {})
            .filter(p => p.status === 'active' || !p.status) // Only active products
            .sort((a, b) => (b.editorialScores?.overall || 0) - (a.editorialScores?.overall || 0)); // Sort by score

        // Use canonical path if available (e.g., /geladeiras/), fallback to slug
        const canonicalPath = category.canonicalPath || `/${slug}s/`;
        console.log(`Generating: ${canonicalPath}index.html`);

        const meta = generateMetaTags({
            title: `${category.name} - Compare as Melhores | ComparaTop`,
            description: `Compare as melhores ${category.namePlural.toLowerCase()} do Brasil. Análise de ${products.length} modelos com preços, especificações e avaliações.`,
            url: `${CONFIG.baseUrl}${canonicalPath}`,
            type: 'website'
        });

        // Generate visible product cards with compare button
        const productCardsHtml = products.map(p => {
            const score = p.editorialScores?.overall;
            const scoreHtml = score ? `<span class="ssg-product-score">${score.toFixed(1)}</span>` : '';
            const lowestPrice = p.offers && p.offers.length > 0
                ? Math.min(...p.offers.map(o => o.price).filter(pr => pr > 0))
                : null;
            const priceHtml = lowestPrice ? `<span class="ssg-product-price">A partir de ${formatBRL(lowestPrice)}</span>` : '';

            return `
                <div class="ssg-product-card">
                    <a href="/produto/${slug}/${p.id}/" class="ssg-product-link">
                        <div class="ssg-product-image">
                            <img src="${resolveImageUrl(p.imageUrl)}" alt="${escapeHtml(p.name)}" loading="lazy">
                        </div>
                        <div class="ssg-product-info">
                            <h3 class="ssg-product-name">${escapeHtml(p.brand)} ${escapeHtml(p.model)}</h3>
                            ${scoreHtml}
                            ${priceHtml}
                        </div>
                    </a>
                    <button class="ssg-compare-btn" onclick="toggleCategoryCompare('${p.id}', '${escapeHtml(p.model)}', '${escapeHtml(p.brand)}', ${score || 0}); event.stopPropagation();">
                        ➕ Adicionar à comparação
                    </button>
                </div>`;
        }).join('\n');

        // Main visible content
        const mainContent = `
        <!-- SSG Category Content - VISIBLE -->
        <div class="ssg-category-page">
            <nav class="ssg-breadcrumb" aria-label="Breadcrumb">
                <a href="/">Início</a> › <span>${escapeHtml(category.name)}</span>
            </nav>
            <header class="ssg-category-header">
                <h1>${escapeHtml(category.name)}</h1>
                <p class="ssg-category-description">${escapeHtml(category.description || '')}</p>
                <p class="ssg-category-count">${products.length} modelos disponíveis</p>
            </header>
            <section class="ssg-products-section">
                <h2>Modelos Disponíveis</h2>
                <div class="ssg-products-grid" id="ssg-products-grid">
                    ${productCardsHtml}
                </div>
            </section>
        </div>

        <!-- Hidden SEO content for crawlers -->
        <div id="prerendered-content" class="prerendered-seo-content">
            <ul>
                ${products.map(p => `<li><a href="/produto/${slug}/${p.id}/">${escapeHtml(p.name)}</a></li>`).join('')}
            </ul>
        </div>
        <style>
            .prerendered-seo-content { display: none; }
            
            /* SSG Category Page Styles */
            .ssg-category-page {
                max-width: 1200px;
                margin: 0 auto;
                padding: 1rem;
            }
            .ssg-breadcrumb {
                margin-bottom: 1rem;
                color: #64748b;
                font-size: 0.9rem;
            }
            .ssg-breadcrumb a {
                color: #1e40af;
                text-decoration: none;
            }
            .ssg-category-header {
                margin-bottom: 2rem;
                text-align: center;
            }
            .ssg-category-header h1 {
                font-size: 2rem;
                color: #1e3a8a;
                margin-bottom: 0.5rem;
            }
            .ssg-category-description {
                color: #64748b;
                max-width: 600px;
                margin: 0 auto 0.5rem;
            }
            .ssg-category-count {
                color: #10b981;
                font-weight: 600;
            }
            .ssg-products-section h2 {
                font-size: 1.5rem;
                color: #1e293b;
                margin-bottom: 1.5rem;
                padding-bottom: 0.5rem;
                border-bottom: 2px solid #e2e8f0;
            }
            .ssg-products-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 1.5rem;
            }
            .ssg-product-card {
                background: white;
                border-radius: 12px;
                padding: 1rem;
                text-decoration: none;
                color: inherit;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                transition: transform 0.2s, box-shadow 0.2s;
                display: flex;
                flex-direction: column;
            }
            .ssg-product-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 20px rgba(0,0,0,0.12);
            }
            .ssg-product-image {
                height: 160px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 1rem;
            }
            .ssg-product-image img {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
            }
            .ssg-product-info {
                text-align: center;
            }
            .ssg-product-name {
                font-size: 1rem;
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 0.5rem;
            }
            .ssg-product-score {
                display: inline-block;
                background: linear-gradient(135deg, #1e40af, #3b82f6);
                color: white;
                padding: 0.25rem 0.75rem;
                border-radius: 20px;
                font-weight: 700;
                font-size: 0.9rem;
                margin-bottom: 0.5rem;
            }
            .ssg-product-price {
                display: block;
                color: #10b981;
                font-weight: 600;
                font-size: 0.95rem;
            }
            .ssg-product-link {
                text-decoration: none;
                color: inherit;
                display: flex;
                flex-direction: column;
                flex: 1;
            }
            .ssg-compare-btn {
                width: 100%;
                padding: 0.5rem;
                margin-top: 0.75rem;
                background: #f1f5f9;
                color: #1e40af;
                border: 1px solid #cbd5e1;
                border-radius: 8px;
                font-size: 0.85rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
            }
            .ssg-compare-btn:hover {
                background: #1e40af;
                color: white;
                border-color: #1e40af;
            }
            .ssg-compare-btn.added {
                background: #10b981;
                color: white;
                border-color: #10b981;
            }
            @media (max-width: 600px) {
                .ssg-products-grid {
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                }
                .ssg-product-image {
                    height: 120px;
                }
                .ssg-product-name {
                    font-size: 0.9rem;
                }
                .ssg-compare-btn {
                    font-size: 0.75rem;
                    padding: 0.4rem;
                }
            }
        </style>
        `;

        // ItemList JSON-LD para categoria
        const itemListSchema = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": category.name,
            "description": category.description || `Compare as melhores ${category.namePlural?.toLowerCase() || 'opções'}`,
            "numberOfItems": products.length,
            "itemListElement": products.map((p, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": p.name,
                "url": `${CONFIG.baseUrl}/produto/${slug}/${p.id}/`
            }))
        };
        const itemListJsonLd = `<script type="application/ld+json">${JSON.stringify(itemListSchema, null, 2)}</script>`;

        // Breadcrumb JSON-LD para categoria
        const breadcrumbJsonLd = generateBreadcrumbJsonLd([
            { name: 'Início', url: CONFIG.baseUrl + '/' },
            { name: category.name }
        ]);

        const jsonLd = itemListJsonLd + '\n' + breadcrumbJsonLd;

        let html = template;
        html = html.replace(/<title>.*?<\/title>[\s\S]*?(<link href="https:\/\/fonts\.googleapis)/, meta + '\n    $1');
        html = html.replace('</head>', jsonLd + '\n</head>');
        // Inject content inside main-content, after the closing </header>
        html = html.replace(/<main class="main-content">([\s\S]*?)<\/header>/,
            '<main class="main-content">$1</header>\n' + mainContent);

        // Write to canonical path (e.g., /geladeiras/index.html)
        const destPath = path.join(CONFIG.distDir, canonicalPath.substring(1), 'index.html');
        ensureDir(path.dirname(destPath));
        fs.writeFileSync(destPath, html);
    }
}

// Generate comparison pages - FULL CATEGORY COVERAGE
// Strategy: Generate ALL intra-category comparisons (no cross-category comparisons)
// With 25 categories × 20 products each = 190 comparisons/category × 25 = 4,750 pages total (very manageable)
function generateComparisonPages(template, catalogs) {
    let totalGenerated = 0;

    for (const [categorySlug, catalog] of Object.entries(catalogs)) {
        const category = catalog.category;
        const products = Object.entries(catalog.products || {});

        // Calculate expected comparisons: n*(n-1)/2
        const expectedComparisons = (products.length * (products.length - 1)) / 2;
        console.log(`\n[${category.name}] Generating ${expectedComparisons} comparison pages (${products.length} products)`);

        // Generate ALL pairwise comparisons within this category
        for (let i = 0; i < products.length; i++) {
            for (let j = i + 1; j < products.length; j++) {
                const [idA, productA] = products[i];
                const [idB, productB] = products[j];

                // CANONICALIZATION: Sort slugs alphabetically to avoid duplicates (A-vs-B = B-vs-A)
                const [slugFirst, slugSecond] = [idA, idB].sort();
                const [productFirst, productSecond] = slugFirst === idA
                    ? [productA, productB]
                    : [productB, productA];

                // URL structure: /comparar/{category}/{slugA}-vs-{slugB}/
                const comparisonSlug = `${slugFirst}-vs-${slugSecond}`;
                const urlPath = `comparar/${categorySlug}/${comparisonSlug}`;

                console.log(`  Generating: /${urlPath}/index.html`);

                const meta = generateMetaTags({
                    title: `${productFirst.model} vs ${productSecond.model} - Qual escolher? | ComparaTop`,
                    description: `Comparativo completo entre ${productFirst.name} e ${productSecond.name}. Veja diferenças de preço, capacidade, consumo e avaliações.`,
                    url: `${CONFIG.baseUrl}/${urlPath}/`,
                    type: 'article'
                });

                const jsonLd = generateComparisonJsonLd(productFirst, productSecond, categorySlug);
                const bodyContent = generateComparisonContent(productFirst, productSecond, category);

                let html = template;
                html = html.replace(/<title>.*?<\/title>[\s\S]*?(<link href="https:\/\/fonts\.googleapis)/, meta + '\n    $1');
                html = html.replace('</head>', jsonLd + '\n</head>');
                html = html.replace(/<div id="page-home">/, bodyContent + '\n<div id="page-home" style="display:none;">');

                const destPath = path.join(CONFIG.distDir, urlPath, 'index.html');
                ensureDir(path.dirname(destPath));
                fs.writeFileSync(destPath, html);
                totalGenerated++;
            }
        }
    }

    console.log(`\n✅ Total comparison pages generated: ${totalGenerated}`);

    // Generate dynamic comparison template page for each category
    // This page handles /comparar/{category}/?ids=x,y,z URLs
    for (const [categorySlug, catalog] of Object.entries(catalogs)) {
        const category = catalog.category;
        const urlPath = `comparar/${categorySlug}`;

        console.log(`  Generating dynamic template: /${urlPath}/index.html`);

        const meta = generateMetaTags({
            title: `Comparar Geladeiras - Comparação Personalizada | ComparaTop`,
            description: `Compare até 4 geladeiras lado a lado. Veja diferenças de preço, capacidade, consumo e avaliações em uma tabela comparativa interativa.`,
            url: `${CONFIG.baseUrl}/${urlPath}/`,
            type: 'website'
        });

        // Add noindex for dynamic pages to avoid thin content issues
        const metaWithNoindex = meta + '\n    <meta name="robots" content="noindex, follow">';

        // Create dynamic comparison page content (container for JS to populate)
        const dynamicContent = `
        <!-- Dynamic Comparison Page -->
        <div id="page-comparison" style="display:block;">
            <div class="page-header">
                <h1 class="page-title" id="comparison-title">⚖️ Carregando comparação...</h1>
                <p class="page-desc">Veja lado a lado as diferenças entre os produtos selecionados</p>
            </div>
            <div id="comparison-content">
                <div style="text-align:center;padding:3rem;color:#64748b;">
                    <div style="font-size:2rem;margin-bottom:1rem;">⏳</div>
                    <p>Carregando produtos para comparação...</p>
                </div>
            </div>
        </div>
        `;

        let html = template;
        html = html.replace(/<title>.*?<\/title>[\s\S]*?(<link href="https:\/\/fonts\.googleapis)/, metaWithNoindex + '\n    $1');
        // Hide page-home and inject page-comparison before it
        html = html.replace(/<div id="page-home">/, dynamicContent + '\n<div id="page-home" style="display:none;">');

        const destPath = path.join(CONFIG.distDir, urlPath, 'index.html');
        ensureDir(path.dirname(destPath));
        fs.writeFileSync(destPath, html);
    }
}

// Generate sitemap
function generateSitemap(catalogs) {
    console.log('Generating: /sitemap.xml');

    const today = new Date().toISOString().split('T')[0];
    const urls = [
        { loc: CONFIG.baseUrl + '/', priority: '1.0', changefreq: 'weekly' }
    ];

    for (const [categorySlug, catalog] of Object.entries(catalogs)) {
        // Category - use canonicalPath if available, otherwise fallback
        const canonicalPath = catalog.category?.canonicalPath || `/${categorySlug}s/`;
        urls.push({
            loc: `${CONFIG.baseUrl}${canonicalPath}`,
            priority: '0.9',
            changefreq: 'weekly'
        });

        const products = Object.entries(catalog.products || {});

        // Products
        for (const [productId, product] of products) {
            urls.push({
                loc: `${CONFIG.baseUrl}/produto/${categorySlug}/${productId}/`,
                priority: '0.8',
                changefreq: 'weekly'
            });
        }

        // Comparisons - with category in URL and alphabetical canonicalization
        for (let i = 0; i < products.length; i++) {
            for (let j = i + 1; j < products.length; j++) {
                const [idA] = products[i];
                const [idB] = products[j];
                // Canonicalization: sort slugs alphabetically
                const [slugFirst, slugSecond] = [idA, idB].sort();
                urls.push({
                    loc: `${CONFIG.baseUrl}/comparar/${categorySlug}/${slugFirst}-vs-${slugSecond}/`,
                    priority: '0.7',
                    changefreq: 'monthly'
                });
            }
        }
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `    <url>
        <loc>${u.loc}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>${u.changefreq}</changefreq>
        <priority>${u.priority}</priority>
    </url>`).join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(CONFIG.distDir, 'sitemap.xml'), xml);
}

// Generate 404 page - lightweight standalone version
function generate404Page(template) {
    console.log('Generating: /404.html (lightweight)');

    // Create a minimal 404 page (< 5KB) instead of using full template
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Página não encontrada | ComparaTop</title>
    <meta name="robots" content="noindex">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            color: #1e293b;
        }
        .container {
            text-align: center;
            padding: 2rem;
            max-width: 500px;
        }
        .error-code {
            font-size: 8rem;
            font-weight: 700;
            color: #1e40af;
            line-height: 1;
            margin-bottom: 1rem;
        }
        h1 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
            color: #1e3a8a;
        }
        p {
            color: #64748b;
            margin-bottom: 2rem;
        }
        .btn {
            display: inline-block;
            padding: 0.875rem 2rem;
            background: #1e40af;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: background 0.2s;
        }
        .btn:hover { background: #1e3a8a; }
        .logo {
            margin-top: 3rem;
            color: #94a3b8;
            font-size: 0.9rem;
        }
        .logo a { color: #1e40af; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="error-code">404</div>
        <h1>Página não encontrada</h1>
        <p>A página que você procura não existe ou foi movida para outro endereço.</p>
        <a href="/" class="btn">← Voltar ao início</a>
        <div class="logo">
            <a href="/">⚡ ComparaTop</a> — Compare antes de comprar
        </div>
    </div>
</body>
</html>`;

    fs.writeFileSync(path.join(CONFIG.distDir, '404.html'), html);
}

// Copy static assets
function copyStaticAssets() {
    console.log('Copying static assets...');

    const assetDirs = ['css', 'js', 'data', 'assets'];
    const assetFiles = ['robots.txt', 'llms.txt', 'politica-privacidade.html', 'termos-uso.html', '_redirects'];

    // Copy from source (root/public for static files)
    const publicDir = path.join(__dirname, '..', 'public');

    for (const dir of assetDirs) {
        const srcPath = path.join(CONFIG.srcDir, dir);
        const destPath = path.join(CONFIG.distDir, dir);
        if (fs.existsSync(srcPath)) {
            copyRecursive(srcPath, destPath);
        }
    }

    // Copy asset files from source
    for (const file of assetFiles) {
        const srcPath = path.join(CONFIG.srcDir, file);
        const destPath = path.join(CONFIG.distDir, file);
        if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, destPath);
        }
    }

    // Copy llms.txt from public folder
    const llmsSrc = path.join(publicDir, 'llms.txt');
    const llmsDest = path.join(CONFIG.distDir, 'llms.txt');
    if (fs.existsSync(llmsSrc)) {
        fs.copyFileSync(llmsSrc, llmsDest);
    }

    // Copy public/categoria folder for redirects
    const categoriaSrc = path.join(publicDir, 'categoria');
    const categoriaDest = path.join(CONFIG.distDir, 'categoria');
    if (fs.existsSync(categoriaSrc)) {
        copyRecursive(categoriaSrc, categoriaDest);
    }

    // Copy public/metodologia folder for methodology pages
    const metodologiaSrc = path.join(publicDir, 'metodologia');
    const metodologiaDest = path.join(CONFIG.distDir, 'metodologia');
    if (fs.existsSync(metodologiaSrc)) {
        copyRecursive(metodologiaSrc, metodologiaDest);
    }
}

function copyRecursive(src, dest) {
    ensureDir(dest);
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Helper: Inject sidebar content (SSG)
function injectSidebar(html, catalogs) {
    // 1. Geladeiras
    if (catalogs.geladeira) {
        const allProducts = Object.values(catalogs.geladeira.products || {})
            .filter(p => p.status === 'active');

        const productsWithScore = allProducts
            .filter(p => (p.editorialScores?.overall || 0) > 0)
            .sort((a, b) => (b.editorialScores?.overall || 0) - (a.editorialScores?.overall || 0));

        const count = allProducts.length;

        // Update nav-subcategory-badge count
        html = html.replace(
            /(Geladeiras\s*<span class="nav-subcategory-badge">)\d+(<\/span>)/g,
            `$1${count}$2`
        );

        // Update category-card-tag count (home page cards) - now uses <a> tag
        html = html.replace(
            /(<a [^>]*class="category-card-tag available"[^>]*>Geladeiras \()\d+(\)<\/a>)/g,
            `$1${count}$2`
        );

        // Also update plain "Geladeiras 2" without parentheses
        html = html.replace(
            /(Geladeiras\s+)2(\s*<)/g,
            `$1${count}$2`
        );

        // Generate Links (SSG) - List ALL active products, sorted by score if available
        const sortedProducts = [...allProducts].sort((a, b) =>
            (b.editorialScores?.overall || 0) - (a.editorialScores?.overall || 0)
        );
        const listHtml = sortedProducts.map(p =>
            `<a href="/produto/geladeira/${p.id}" class="nav-subcategory" onclick="Router.navigate('/produto/geladeira/${p.id}'); closeSidebar(); return false;">${p.name}</a>`
        ).join('\n                                ');

        // Inject Links
        html = html.replace(
            /(<div class="nav-product-list" id="nav-geladeiras-products">)[\s\S]*?(<\/div>)/,
            `$1\n                                ${listHtml}\n                            $2`
        );
    }
    return html;
}

// Main build function
async function build() {
    console.log('🚀 ComparaTop Static Build Starting...\n');

    // Clean dist folder
    if (fs.existsSync(CONFIG.distDir)) {
        fs.rmSync(CONFIG.distDir, { recursive: true, force: true });
    }
    ensureDir(CONFIG.distDir);

    // Load template and catalogs
    let template = loadTemplate();
    const catalogs = loadCatalogs();

    // Inject Sidebar Content Globally (Server-Side Rendering for Sidebar)
    template = injectSidebar(template, catalogs);

    // 1. Generate Product Pages
    generateProductPages(template, catalogs);

    // 2. Generate Category Pages
    generateCategoryPages(template, catalogs);

    // 3. Generate Comparison Pages
    generateComparisonPages(template, catalogs);

    // 4. Generate Home Page
    generateHomePage(template, catalogs);

    // 5. Generate Sitemap
    generateSitemap(catalogs);

    // 6. Generate 404 Page (Lightweight)
    generate404Page(template);

    // 7. Copy Static Assets
    copyStaticAssets();

    console.log('\n🟢 Build complete!');
}

build().catch(console.error);
