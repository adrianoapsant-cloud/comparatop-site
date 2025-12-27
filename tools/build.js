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
function generateProductJsonLd(product, categorySlug, category) {
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
function generateProductContent(product, category) {
    const specs = product.specs || {};
    const offers = product.offers || [];
    const bestOffer = offers.sort((a, b) => a.price - b.price)[0];
    const editorial = product.editorialScores || {};
    const overall = editorial.overall || 0;

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
                        <span itemprop="ratingValue">${overall}</span>/10
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
                            <strong>${escapeHtml(o.retailer)}</strong>: 
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
    
    <style>
        .prerendered-seo-content { display: none; }
        /* Note: This content is hidden visually but readable by bots */
        /* JavaScript will render the interactive version */
    </style>
    `;
}

// Generate comparison page content
function generateComparisonContent(productA, productB, category) {
    const specsA = productA.specs || {};
    const specsB = productB.specs || {};

    return `
    <!-- Pre-rendered comparison content for SEO -->
    <div id="prerendered-content" class="prerendered-seo-content">
        <nav aria-label="Breadcrumb" class="breadcrumb-nav">
            <a href="/">Início</a> › 
            <a href="/categoria/${category.slug}">${category.name}</a> › 
            <span>${productA.model} vs ${productB.model}</span>
        </nav>
        
        <article>
            <h1>${escapeHtml(productA.name)} vs ${escapeHtml(productB.name)}</h1>
            
            <div class="comparison-intro">
                <p>
                    Compare as duas geladeiras mais populares: ${productA.name} e ${productB.name}. 
                    Veja as diferenças de capacidade, consumo, preço e avaliações para decidir qual é a melhor para você.
                </p>
            </div>
            
            <section class="comparison-table-section">
                <h2>Comparativo de Especificações</h2>
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Especificação</th>
                            <th>${escapeHtml(productA.model)}</th>
                            <th>${escapeHtml(productB.model)}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Capacidade Total</td>
                            <td>${specsA.capacidade_total || '-'}L</td>
                            <td>${specsB.capacidade_total || '-'}L</td>
                        </tr>
                        <tr>
                            <td>Capacidade Freezer</td>
                            <td>${specsA.capacidade_freezer || '-'}L</td>
                            <td>${specsB.capacidade_freezer || '-'}L</td>
                        </tr>
                        <tr>
                            <td>Consumo Mensal</td>
                            <td>${specsA.consumo_kwh || '-'} kWh</td>
                            <td>${specsB.consumo_kwh || '-'} kWh</td>
                        </tr>
                        <tr>
                            <td>Dimensões (LxAxP)</td>
                            <td>${specsA.largura_cm}×${specsA.altura_cm}×${specsA.profundidade_cm} cm</td>
                            <td>${specsB.largura_cm}×${specsB.altura_cm}×${specsB.profundidade_cm} cm</td>
                        </tr>
                        <tr>
                            <td>Selo Procel</td>
                            <td>${specsA.selo_procel || '-'}</td>
                            <td>${specsB.selo_procel || '-'}</td>
                        </tr>
                        <tr>
                            <td>Nota Editorial</td>
                            <td>${productA.editorialScores?.overall || '-'}/10</td>
                            <td>${productB.editorialScores?.overall || '-'}/10</td>
                        </tr>
                    </tbody>
                </table>
            </section>
            
            <section class="offers-comparison">
                <h2>Onde Comprar</h2>
                <div class="offers-grid">
                    <div class="product-offers">
                        <h3>${escapeHtml(productA.model)}</h3>
                        <ul>
                            ${(productA.offers || []).map(o => `<li>${escapeHtml(o.retailer)}: ${formatBRL(o.price)}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="product-offers">
                        <h3>${escapeHtml(productB.model)}</h3>
                        <ul>
                            ${(productB.offers || []).map(o => `<li>${escapeHtml(o.retailer)}: ${formatBRL(o.price)}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </section>

            <section class="decision-section">
                <h2>🎯 Decida em 30 Segundos</h2>
                <ul>
                    <li><strong>Escolha ${productA.model}</strong> se: você prioriza ${specsA.capacidade_total > specsB.capacidade_total ? 'maior capacidade' : 'menor consumo'}</li>
                    <li><strong>Escolha ${productB.model}</strong> se: você prioriza ${specsB.capacidade_total > specsA.capacidade_total ? 'maior capacidade' : 'menor consumo'}</li>
                </ul>
            </section>
        </article>
    </div>
    
    <style>
        .prerendered-seo-content { display: none; }
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

            // JSON-LD com category para contexto
            const productJsonLd = generateProductJsonLd(product, slug, category);

            // Breadcrumb JSON-LD
            const canonicalPath = category.canonicalPath || `/${slug}s/`;
            const breadcrumbJsonLd = generateBreadcrumbJsonLd([
                { name: 'Início', url: CONFIG.baseUrl + '/' },
                { name: category.name, url: CONFIG.baseUrl + canonicalPath },
                { name: product.name }
            ]);

            const jsonLd = productJsonLd + '\n' + breadcrumbJsonLd;
            const bodyContent = generateProductContent(product, category);

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
        const products = Object.values(catalog.products || {});

        // Use canonical path if available (e.g., /geladeiras/), fallback to slug
        const canonicalPath = category.canonicalPath || `/${slug}s/`;
        console.log(`Generating: ${canonicalPath}index.html`);

        const meta = generateMetaTags({
            title: `${category.name} - Compare as Melhores | ComparaTop`,
            description: `Compare as melhores ${category.namePlural.toLowerCase()} do Brasil. Análise de ${products.length} modelos com preços, especificações e avaliações.`,
            url: `${CONFIG.baseUrl}${canonicalPath}`,
            type: 'website'
        });

        const bodyContent = `
        <div id="prerendered-content" class="prerendered-seo-content">
            <nav aria-label="Breadcrumb"><a href="/">Início</a> › <span>${category.name}</span></nav>
            <h1>${category.name} - Compare as Melhores</h1>
            <p>${category.description}</p>
            <section>
                <h2>Produtos</h2>
                <ul>
                    ${products.map(p => `
                        <li><a href="/produto/${slug}/${p.id}">${p.name}</a> - Nota: ${p.editorialScores?.overall || '-'}/10</li>
                    `).join('')}
                </ul>
            </section>
        </div>
        <style>.prerendered-seo-content { display: none; }</style>
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
        html = html.replace(/<body>/, '<body>\n' + bodyContent);

        // Write to canonical path (e.g., /geladeiras/index.html)
        const destPath = path.join(CONFIG.distDir, canonicalPath.substring(1), 'index.html');
        ensureDir(path.dirname(destPath));
        fs.writeFileSync(destPath, html);
    }
}

// Generate comparison pages
function generateComparisonPages(template, catalogs) {
    for (const [slug, catalog] of Object.entries(catalogs)) {
        const category = catalog.category;
        const products = Object.entries(catalog.products || {});

        // Generate all pairwise comparisons
        for (let i = 0; i < products.length; i++) {
            for (let j = i + 1; j < products.length; j++) {
                const [idA, productA] = products[i];
                const [idB, productB] = products[j];

                const comparisonSlug = `${idA}-vs-${idB}`;
                console.log(`Generating: /comparar/${comparisonSlug}/index.html`);

                const meta = generateMetaTags({
                    title: `${productA.model} vs ${productB.model} - Qual escolher? | ComparaTop`,
                    description: `Comparativo completo entre ${productA.name} e ${productB.name}. Veja diferenças de preço, capacidade, consumo e avaliações.`,
                    url: `${CONFIG.baseUrl}/comparar/${comparisonSlug}`,
                    type: 'article'
                });

                const jsonLd = generateComparisonJsonLd(productA, productB, slug);
                const bodyContent = generateComparisonContent(productA, productB, category);

                let html = template;
                html = html.replace(/<title>.*?<\/title>[\s\S]*?(<link href="https:\/\/fonts\.googleapis)/, meta + '\n    $1');
                html = html.replace('</head>', jsonLd + '\n</head>');
                html = html.replace(/<body>/, '<body>\n' + bodyContent);

                const destPath = path.join(CONFIG.distDir, 'comparar', comparisonSlug, 'index.html');
                ensureDir(path.dirname(destPath));
                fs.writeFileSync(destPath, html);
            }
        }
    }
}

// Generate sitemap
function generateSitemap(catalogs) {
    console.log('Generating: /sitemap.xml');

    const today = new Date().toISOString().split('T')[0];
    const urls = [
        { loc: CONFIG.baseUrl + '/', priority: '1.0', changefreq: 'weekly' }
    ];

    for (const [slug, catalog] of Object.entries(catalogs)) {
        // Category - use canonicalPath if available, otherwise fallback
        const canonicalPath = catalog.category?.canonicalPath || `/${slug}s/`;
        urls.push({
            loc: `${CONFIG.baseUrl}${canonicalPath}`,
            priority: '0.9',
            changefreq: 'weekly'
        });

        const products = Object.entries(catalog.products || {});

        // Products
        for (const [productId, product] of products) {
            urls.push({
                loc: `${CONFIG.baseUrl}/produto/${slug}/${productId}/`,
                priority: '0.8',
                changefreq: 'weekly'
            });
        }

        // Comparisons
        for (let i = 0; i < products.length; i++) {
            for (let j = i + 1; j < products.length; j++) {
                const [idA] = products[i];
                const [idB] = products[j];
                urls.push({
                    loc: `${CONFIG.baseUrl}/comparar/${idA}-vs-${idB}/`,
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

    const assetDirs = ['js', 'data', 'assets'];
    const assetFiles = ['robots.txt', 'llms.txt', 'politica-privacidade.html', 'termos-uso.html'];

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

        // Update category-card-tag count (home page cards)
        html = html.replace(
            /(<span class="category-card-tag available">Geladeiras \()\d+(\)<\/span>)/g,
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
