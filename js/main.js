
let catalog = null;
let assistantConfig = null;
let currentCategory = null;


// Labels amigáveis
const SPEC_LABELS = {
    capacidade_total: 'Capacidade Total',
    capacidade_refrigerador: 'Refrigerador',
    capacidade_freezer: 'Freezer',
    consumo_kwh: 'Consumo Mensal',
    largura_cm: 'Largura',
    altura_cm: 'Altura',
    profundidade_cm: 'Profundidade',
    peso_kg: 'Peso',
    dispenser_agua: 'Dispenser de Água',
    tipo: 'Tipo',
    frost_free: 'Frost Free',
    cor: 'Cor',
    selo_procel: 'Selo Procel'
};

const SPEC_UNITS = {
    capacidade_total: 'L',
    capacidade_refrigerador: 'L',
    capacidade_freezer: 'L',
    consumo_kwh: 'kWh/mês',
    largura_cm: 'cm',
    altura_cm: 'cm',
    profundidade_cm: 'cm',
    peso_kg: 'kg'
};

// Sidebar functions - EXPLICIT STATE MANAGEMENT
function openSidebar(categoryToExpand) {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const isMobile = window.innerWidth <= 1024;

    if (isMobile) {
        // Mobile: open sidebar with overlay
        sidebar.classList.add('open');
        if (overlay) overlay.classList.add('open');
        document.body.style.overflow = 'hidden'; // Lock scroll
    }
    // Desktop: sidebar is already visible, no need for overlay

    // Expand category after a small delay (works for both mobile and desktop)
    if (categoryToExpand) {
        setTimeout(() => {
            toggleCategory(categoryToExpand);

            // Scroll the sidebar to show the category
            const categoryEl = document.querySelector(`[onclick*="toggleCategory('${categoryToExpand}')"]`);
            if (categoryEl && sidebar) {
                categoryEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, isMobile ? 300 : 100);
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = ''; // Unlock scroll
}

// Font size zoom for comparison table
let currentTableFontSize = 12; // base size in px
function changeTableFontSize(delta) {
    const table = document.querySelector('.compare-table');
    if (!table) {
        console.log('changeTableFontSize: table not found');
        return;
    }

    currentTableFontSize = Math.max(8, Math.min(20, currentTableFontSize + delta));
    table.style.fontSize = currentTableFontSize + 'px';

    // Also adjust cell padding proportionally
    const cells = table.querySelectorAll('th, td');
    const padding = Math.max(3, Math.min(12, currentTableFontSize / 3));
    cells.forEach(cell => {
        cell.style.padding = `${padding}px ${padding * 1.2}px`;
    });
    console.log('Font size changed to:', currentTableFontSize);
}

// Hide the compare counter badge
function hideCompareCounter() {
    const counter = document.getElementById('compare-counter');
    if (counter) {
        counter.style.display = 'none';
        counter.classList.remove('show');
    }
}

// Combined Toggle function (referenced by HTML onclick)
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar && sidebar.classList.contains('open')) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

// Handle overlay click - just closes the sidebar
function handleOverlayClick() {
    closeSidebar();
    hideCompareToast();
}

// Show the compare toast (small notification in bottom right)
function showComparePrompt() {
    const prompt = document.getElementById('compare-prompt');
    const productsContainer = document.getElementById('compare-prompt-products');
    const hint = document.getElementById('compare-prompt-hint');
    const compareBtn = document.getElementById('compare-prompt-btn-compare');
    const counter = document.getElementById('compare-counter');

    if (!prompt || !productsContainer || compareList.length === 0) {
        hideCompareToast();
        return;
    }

    // Hide counter while toast is visible (using inline style to override any previous inline display)
    if (counter) {
        counter.classList.remove('show');
        counter.style.display = 'none';
    }

    // Render selected products
    productsContainer.innerHTML = compareList.map(p => {
        const scoreText = p.editorialScores?.overall ? `${p.editorialScores.overall}/10` : '';
        return `
                <div class="compare-prompt-product">
                    <span>✓ ${p.brand} ${p.model}</span>
                    <span style="color:#10b981;font-weight:600">${scoreText}</span>
                </div>
            `;
    }).join('');

    // Update hint and button state
    const remaining = 4 - compareList.length;
    if (compareList.length < 2) {
        hint.textContent = `+${2 - compareList.length} para comparar`;
        hint.style.color = '#f59e0b';
        compareBtn.classList.add('disabled');
        compareBtn.disabled = true;
    } else {
        hint.textContent = remaining > 0 ? `+${remaining} disponível` : 'Máximo atingido';
        hint.style.color = '#64748b';
        compareBtn.classList.remove('disabled');
        compareBtn.disabled = false;
    }

    prompt.style.display = 'block';
}

// Hide the compare toast and show counter if there are products
function hideCompareToast() {
    const prompt = document.getElementById('compare-prompt');
    const counter = document.getElementById('compare-counter');

    if (prompt) prompt.style.display = 'none';

    // Show counter with updated count when toast is hidden
    if (counter && compareList.length > 0) {
        const numberEl = counter.querySelector('.compare-counter-number');
        const textEl = counter.querySelector('.compare-counter-text');
        if (numberEl) numberEl.textContent = compareList.length;
        if (textEl) textEl.textContent = compareList.length === 1 ? 'produto' : 'produtos';
        counter.style.display = 'flex';
        counter.classList.add('show');
    }
}

// Close the compare prompt modal
function closeComparePrompt() {
    hideCompareToast();
}

// Start comparison from the prompt
function startComparisonFromPrompt() {
    hideCompareToast();
    closeSidebar();

    // Call existing comparison function if available
    if (typeof showComparison === 'function') {
        showComparison();
    }
}

// Safety: Attach listeners on load to ensure buttons work even if inline onclick fails
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            toggleSidebar();
        });
    }
});

// Global Router Helper that closes sidebar on mobile
window.navigate = function (path) {
    if (window.innerWidth <= 1024) closeSidebar();
    Router.navigate(path);
};

// Navigate to product page from sidebar
function navigateToProduct(categorySlug, productId) {
    // Use the existing showProduct function which handles everything
    showProduct(categorySlug, productId);

    // Update URL without reload
    const url = `/produto/${categorySlug}/${productId}`;
    history.pushState({ page: 'product', category: categorySlug, product: productId }, '', url);
}

function toggleCategory(el) {
    el.classList.toggle('open');
}

function showHome() {
    document.getElementById('page-home').style.display = 'block';
    document.getElementById('page-category').style.display = 'none';
    document.getElementById('page-product').style.display = 'none';
    document.getElementById('page-comparison').style.display = 'none';
    document.getElementById('header-title').textContent = 'Bem-vindo ao ComparaTop';
    document.getElementById('breadcrumb').innerHTML = '<a href="#" onclick="showHome(); return false;">Início</a>';

    // Update active states - clear all selections
    document.querySelectorAll('.nav-subcategory').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-category-header').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-product-item').forEach(el => el.classList.remove('active'));
    document.querySelector('.sidebar-nav > .nav-category-header').classList.add('active');

    if (window.innerWidth <= 1024) closeSidebar();
}

async function showCategory(categoryId) {

    // Map plural URLs to singular catalog filenames
    const catalogFileMap = {
        geladeiras: 'geladeira',
        freezers: 'freezer',
        frigobares: 'frigobar'
    };
    const catalogFileName = catalogFileMap[categoryId] || categoryId;

    currentCategory = catalogFileName;

    // Scroll to top when navigating to category
    window.scrollTo(0, 0);
    document.querySelector('.main-content')?.scrollTo(0, 0);

    document.getElementById('page-home').style.display = 'none';
    document.getElementById('page-category').style.display = 'block';
    document.getElementById('page-product').style.display = 'none';
    document.getElementById('page-comparison').style.display = 'none';
    document.getElementById('loading').style.display = 'block';
    document.getElementById('products-grid').innerHTML = '';
    document.getElementById('error').style.display = 'none';

    const categoryNames = {
        geladeira: 'Geladeiras',
        geladeiras: 'Geladeiras',
        freezer: 'Freezers',
        freezers: 'Freezers',
        frigobar: 'Frigobares',
        frigobares: 'Frigobares'
    };

    const categoryName = categoryNames[categoryId] || categoryId;
    document.getElementById('header-title').textContent = categoryName;
    document.getElementById('category-title').textContent = categoryName;
    document.getElementById('breadcrumb').innerHTML = `
                <a href="#" onclick="showHome(); return false;">Início</a> / 
                <a href="#" onclick="showCategory('${catalogFileName}'); return false;">${categoryName}</a>
            `;

    // Update active states
    document.querySelectorAll('.nav-subcategory').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-category-header').forEach(el => el.classList.remove('active'));

    if (window.innerWidth <= 1024) closeSidebar();

    try {
        // Load catalog directly via fetch (more reliable than module)
        const catalogResp = await fetch(`/data/catalogs/${catalogFileName}.json`);
        if (!catalogResp.ok) {
            throw new Error(`Catalog fetch failed: ${catalogResp.status}`);
        }
        currentCatalog = await catalogResp.json();
        catalog = currentCatalog;

        // Load assistant config (optional, don't fail if missing)
        try {
            const assistantResp = await fetch(`/data/assistant/${categoryId}.json`);
            if (assistantResp.ok) {
                assistantConfig = await assistantResp.json();
            }
        } catch (e) {
            console.warn('Assistant config not available:', e);
        }

        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').style.display = 'none';
        renderProducts();

    } catch (err) {
        document.getElementById('loading').style.display = 'none';
        // Don't show error to user - sidebar still works for navigation
        console.error('showCategory error:', err);
    }
}

function formatSpec(key, value) {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
    if (Array.isArray(value)) return value.join(', ');
    const unit = SPEC_UNITS[key] || '';
    return `${value}${unit ? ' ' + unit : ''}`;
}

function renderProducts() {
    // Get products directly from currentCatalog
    const products = currentCatalog && currentCatalog.products
        ? Object.values(currentCatalog.products).filter(p => p.status === 'active')
        : [];
    const container = document.getElementById('products-grid');

    container.innerHTML = products.map(product => `
                <article class="product-card">
                    <div class="product-header">
                        <div>
                            <div class="product-brand">${product.brand}</div>
                            <div class="product-name">${product.model}</div>
                        </div>
                        <div class="product-score">${product.editorialScores?.overall || 'N/A'}/10</div>
                    </div>
                    
                    <!-- Specs principais -->
                    <div class="specs-grid">
                        ${['capacidade_total', 'capacidade_freezer', 'consumo_kwh', 'largura_cm'].map(key => `
                            <div class="spec-item">
                                <span class="spec-label">${SPEC_LABELS[key] || key}</span>
                                <span class="spec-value">${formatSpec(key, product.specs[key])}</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- Todas as ofertas -->
                    <h4 style="font-size:0.95rem;margin:1rem 0 0.5rem;color:var(--c-primary-dark);">🛒 Onde comprar (menor → maior)</h4>
                    <div class="offers-list">
                        ${renderOffers(product)}
                    </div>
                    
                    <!-- Editorial Scores -->
                    <details style="margin-top:1rem;">
                        <summary style="cursor:pointer;font-weight:600;font-size:0.9rem;color:var(--c-primary);">📊 Notas Editoriais (0-10)</summary>
                        <div class="editorial-scores">
                            ${renderEditorialScores(product)}
                        </div>
                    </details>
                    
                    <!-- VoC Section -->
                    <details style="margin-top:1rem;" open>
                        <summary style="cursor:pointer;font-weight:600;font-size:0.9rem;color:var(--c-primary);">🗣️ Voz do Cliente (síntese de ${product.voc?.sample?.totalApprox?.toLocaleString('pt-BR') || '?'} avaliações)</summary>
                        <div class="voc-section" style="margin-top:0.5rem;box-shadow:none;padding:1rem;">
                            ${renderVoC(product)}
                        </div>
                    </details>
                    
                    <!-- Compare Button - PROMINENT -->
                    <button class="compare-btn" data-product-id="${product.id}" onclick="toggleCompare('${product.id}', '${product.name}')">
                        ⚖️ Comparar este produto
                    </button>
                    
                    <!-- View Product Details Button -->
                    <a href="/produto/geladeira/${product.id}" 
                       onclick="event.preventDefault(); navigateToProduct('geladeira', '${product.id}');" 
                       class="btn" 
                       style="display:block;text-align:center;margin-top:0.5rem;background:var(--c-primary);color:#fff;text-decoration:none;">
                        📋 Ver Ficha Técnica Completa
                    </a>
                </article>
            `).join('');
}

function renderOffers(product) {
    if (!product.offers || !product.offers.length) {
        return '<p style="color:var(--c-muted);font-size:0.9rem;">Sem ofertas disponíveis</p>';
    }

    const sorted = [...product.offers]
        .filter(o => o.url)
        .sort((a, b) => {
            if (a.price == null) return 1;
            if (b.price == null) return -1;
            return a.price - b.price;
        });

    let latestUpdate = '';
    const html = sorted.map(offer => {
        const priceText = offer.price ? Utils.formatBRL(offer.price) : 'Ver preço';
        if (offer.lastUpdated && (!latestUpdate || offer.lastUpdated > latestUpdate)) {
            latestUpdate = offer.lastUpdated;
        }
        return `
                    <a href="${offer.url}" class="offer-btn ${offer.retailerId}" target="_blank" rel="sponsored nofollow noopener"
                       aria-label="Ver oferta na ${offer.retailerName} por ${priceText}">
                        <span class="retailer">${offer.retailerName}</span>
                        <span class="price">${priceText}</span>
                    </a>
                `;
    }).join('');

    const updateText = latestUpdate
        ? `<div class="offers-updated">Atualizado: ${Utils.formatDateTime(latestUpdate)}</div>`
        : '';

    return html + updateText;
}

function renderEditorialScores(product) {
    const scores = product.editorialScores;
    if (!scores) return '<p style="color:var(--c-muted);">Notas editoriais não disponíveis.</p>';

    const topics = catalog.scoringTopics || [];

    return topics.map(topic => {
        const scoreData = scores[topic.id];
        if (scoreData == null) return '';

        // Support both object {score, note} and direct number format
        const score = typeof scoreData === 'object' ? scoreData.score : scoreData;
        const note = typeof scoreData === 'object' ? scoreData.note : null;

        if (score == null) return '';

        const barWidth = score * 10;
        let barClass = 'medium';
        if (score >= 8) barClass = 'high';
        else if (score < 6) barClass = 'low';

        return `
                    <div class="editorial-topic" onclick="toggleScoreNote(this)">
                        <span style="font-size:1rem;">${topic.icon || '📊'}</span>
                        <span class="editorial-topic-label">${topic.label}</span>
                        <span class="editorial-topic-score">${score.toFixed(1)}</span>
                        <div class="editorial-topic-bar">
                            <div class="editorial-topic-bar-fill ${barClass}" style="width:${barWidth}%"></div>
                        </div>
                        ${note ? `<div class="score-note-inline" style="display:none;">${note}</div>` : ''}
                    </div>
                `;
    }).join('');
}

function renderVoC(product) {
    const voc = product.voc;
    if (!voc) {
        return '<p style="color:var(--c-muted);">Dados de VoC não disponíveis.</p>';
    }

    let html = '';

    // Badge de sentimento
    html += `<span class="voc-badge ${voc.sentimentClass || 'mixed'}">${voc.sentiment}</span>`;

    // One-liner
    html += `<div class="voc-oneliner">${voc.oneLiner}</div>`;

    // Resumo 30s
    if (voc.summary30s) {
        html += `<div class="voc-summary"><strong>📖 Resumo em 30s:</strong> ${voc.summary30s}</div>`;
    }

    // Pros e Cons
    html += '<div class="voc-lists">';

    // Pros
    html += '<div class="voc-list">';
    html += '<div class="voc-list-title pros">👍 Elogios mais recorrentes</div>';
    html += '<ul>';
    (voc.pros || []).slice(0, 4).forEach(pro => {
        html += `<li>
                    <span class="topic">${pro.topic}</span>
                    <span class="freq">${pro.freq}</span>
                    <span class="detail">${pro.detail}</span>
                </li>`;
    });
    html += '</ul></div>';

    // Cons
    html += '<div class="voc-list">';
    html += '<div class="voc-list-title cons">👎 Reclamações mais recorrentes</div>';
    html += '<ul>';
    (voc.cons || []).slice(0, 4).forEach(con => {
        html += `<li>
                    <span class="topic">${con.topic}</span>
                    <span class="freq">${con.freq}</span>
                    <span class="detail">${con.detail}</span>
                </li>`;
    });
    html += '</ul></div>';

    html += '</div>';

    // Sample e Sources
    html += '<div class="voc-sample">';
    html += `<strong>📊 Amostra analisada:</strong> ~${voc.sample?.totalApprox?.toLocaleString('pt-BR') || '?'} avaliações`;
    if (voc.sample?.breakdown) {
        html += '<br><small>';
        html += voc.sample.breakdown.map(b => `${b.source}: ~${(b.count || b.countApprox || 0).toLocaleString('pt-BR')}`).join(' · ');
        html += '</small>';
    }
    html += '</div>';

    if (voc.sources && voc.sources.length) {
        html += '<div class="voc-sources"><strong>🔗 Fontes:</strong> ';
        html += voc.sources.slice(0, 5).map(s => `<a href="${s.url}" target="_blank" rel="nofollow noopener">${s.name}</a>`).join('');
        html += '</div>';
    }

    return html;
}

function runAssistant() {
    if (!catalog) return;

    const answers = {
        niche_width: parseFloat(document.getElementById('q-niche').value) || null,
        budget_min: parseFloat(document.getElementById('q-budget-min').value) || null,
        budget_max: parseFloat(document.getElementById('q-budget-max').value) || null,
        freezer_usage: document.getElementById('q-freezer').value,
        priority: document.getElementById('q-priority').value,
        noise_sensitive: document.getElementById('q-noise').value
    };

    const products = Catalog.getProducts(catalog);
    const scored = products.map(product => {
        let score = (product.editorialScores?.overall || 5) * 10;
        const reasons = [];
        const warnings = [];

        // Verifica nicho
        if (answers.niche_width) {
            const gap = 4;
            const needed = product.specs.largura_cm + gap;
            if (answers.niche_width >= needed) {
                reasons.push(`Cabe no seu nicho de ${answers.niche_width} cm`);
                score += 20;
            } else {
                warnings.push(`Não cabe no espaço (precisa ${needed} cm)`);
                score -= 100;
            }
        }

        // Verifica orçamento
        if (answers.budget_max && product.bestPrice) {
            if (product.bestPrice > answers.budget_max) {
                warnings.push(`Acima do orçamento máximo (${Utils.formatBRL(product.bestPrice)})`);
                score -= 50;
            } else if (answers.budget_min && product.bestPrice < answers.budget_min) {
                // Dentro do range
            } else {
                const savings = answers.budget_max - product.bestPrice;
                if (savings > 200) {
                    reasons.push(`${Utils.formatBRL(savings)} abaixo do orçamento`);
                }
            }
        }

        // Prioridade
        switch (answers.priority) {
            case 'consumo':
                const consumoScore = product.editorialScores.consumo || 5;
                score += consumoScore * 3;
                if (consumoScore >= 8) reasons.push(`Destaque em consumo energético`);
                break;
            case 'freezer':
                const freezerL = product.specs.capacidade_freezer || 0;
                score += freezerL * 0.5;
                if (freezerL >= 100) reasons.push(`Freezer grande (${freezerL}L)`);
                break;
            case 'funcoes':
                const funcScore = product.editorialScores.funcionalidades || 5;
                score += funcScore * 3;
                if (funcScore >= 8) reasons.push(`Destaque em funcionalidades`);
                break;
            case 'espaco':
                score += (100 - product.specs.largura_cm) * 0.5;
                reasons.push(`Largura: ${product.specs.largura_cm} cm`);
                break;
            case 'custo':
                if (product.bestPrice) {
                    score += (10000 / product.bestPrice) * 10;
                }
                break;
        }

        // Freezer usage
        if (answers.freezer_usage === 'muito') {
            score += (product.specs.capacidade_freezer || 0) * 0.3;
        }

        // Ruído
        if (answers.noise_sensitive === 'sim') {
            const ruidoScore = product.editorialScores.ruido || 5;
            score += ruidoScore * 2;
            if (ruidoScore < 6) {
                warnings.push(`VoC indica reclamações frequentes de ruído`);
            }
        }

        // IdealFor como bônus
        (product.idealFor || []).slice(0, 2).forEach(ideal => {
            if (!reasons.some(r => r.includes(ideal.label))) {
                reasons.push(ideal.label);
            }
        });

        return { product, score, reasons: reasons.slice(0, 4), warnings };
    });

    scored.sort((a, b) => b.score - a.score);

    const container = document.getElementById('assistant-results');

    let html = '<h4 style="margin-bottom:1rem;color:var(--c-primary-dark);">📋 Recomendações para você:</h4>';

    scored.forEach((item, index) => {
        const isWinner = index === 0;
        html += `
                    <div class="result-card ${isWinner ? 'winner' : ''}">
                        <div class="result-header">
                            <div>
                                <h4 style="margin:0;">${index + 1}. ${item.product.name}</h4>
                                <p style="color:var(--c-muted);font-size:0.9rem;margin:0.25rem 0;">
                                    Nota geral: ${item.product.editorialScores.overall}/10 · 
                                    Score personalizado: ${item.score.toFixed(0)} pts
                                </p>
                            </div>
                        </div>
                        
                        ${item.reasons.length ? `
                            <ul class="result-reasons">
                                ${item.reasons.map(r => `<li>${r}</li>`).join('')}
                            </ul>
                        ` : ''}
                        
                        ${item.warnings.length ? `
                            <div class="result-warnings">
                                ⚠️ ${item.warnings.join(' · ')}
                            </div>
                        ` : ''}
                        
                        <!-- TODAS as ofertas, ordenadas -->
                        <h5 style="margin:1rem 0 0.5rem;font-size:0.9rem;">🛒 Onde comprar:</h5>
                        <div class="offers-list">
                            ${renderOffers(item.product)}
                        </div>
                    </div>
                `;
    });

    container.innerHTML = html;
    container.classList.add('show');

    // Scroll to results
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ==================== SEARCH ====================
let searchTimeout = null;
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();

    if (query.length < 1) {
        searchResults.classList.remove('show');
        return;
    }

    searchTimeout = setTimeout(() => performSearch(query), 300);
});

searchInput.addEventListener('focus', () => {
    if (searchInput.value.length >= 1) {
        searchResults.classList.add('show');
    }
});

// Handle Enter key to go to first result
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const firstResult = searchResults.querySelector('.search-result-item');
        if (firstResult) {
            firstResult.click();
        } else if (searchInput.value.trim().length >= 1) {
            // Trigger search and wait for results
            performSearch(searchInput.value.trim()).then(() => {
                const result = searchResults.querySelector('.search-result-item');
                if (result) result.click();
            });
        }
    }
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
        searchResults.classList.remove('show');
    }
});

// Keyboard shortcut
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
    if (e.key === 'Escape') {
        searchResults.classList.remove('show');
        searchInput.blur();
    }
});

async function performSearch(query) {
    // Search across all categories
    const categories = ['geladeira'];
    let allProducts = [];

    for (const cat of categories) {
        try {
            const catCatalog = await Catalog.load(cat);
            const products = Catalog.getProducts(catCatalog);
            allProducts = allProducts.concat(products.map(p => ({ ...p, category: cat })));
        } catch (e) {
            // Category not available
        }
    }

    const q = query.toLowerCase();
    const results = allProducts.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.model.toLowerCase().includes(q) ||
        (p.tags || []).some(t => t.toLowerCase().includes(q))
    ).slice(0, 8);

    renderSearchResults(results, query);
}

function renderSearchResults(results, query) {
    if (results.length === 0) {
        searchResults.innerHTML = `
                    <div class="search-no-results">
                        <p>Nenhum produto encontrado para "${query}"</p>
                    </div>
                `;
    } else {
        searchResults.innerHTML = results.map(p => `
                    <div class="search-result-item" onclick="goToProduct('${p.category}', '${p.id}')">
                        <div class="search-result-info">
                            <div class="search-result-name">${p.brand} ${p.model}</div>
                            <div class="search-result-brand">${p.name}</div>
                        </div>
                        <span class="search-result-score">${p.editorialScores?.overall || '?'}/10</span>
                    </div>
                `).join('');
    }
    searchResults.classList.add('show');
}

function goToProduct(category, productId) {
    searchResults.classList.remove('show');
    searchInput.value = '';
    showProduct(category, productId);
}

// ==================== N-WAY COMPARISON ====================
let compareList = [];
const MAX_COMPARE = 4;

// toggleProductCompare is defined later in the file

function toggleCompare(productId, productName) {
    const index = compareList.findIndex(p => p.id === productId);

    if (index > -1) {
        compareList.splice(index, 1);
    } else {
        if (compareList.length >= MAX_COMPARE) {
            alert(`Máximo de ${MAX_COMPARE} produtos para comparação`);
            return;
        }
        const products = Catalog.getProducts(catalog);
        const product = products.find(p => p.id === productId);
        if (product) {
            compareList.push(product);
        }
    }

    updateCompareUI();
}

function updateCompareUI() {
    // Update buttons
    document.querySelectorAll('.compare-btn').forEach(el => {
        const id = el.dataset.productId;
        const isSelected = compareList.some(p => p.id === id);
        el.classList.toggle('selected', isSelected);
        el.textContent = isSelected ? '✓ Selecionado para comparação' : '⚖️ Comparar este produto';
    });

    // Update floating bar and counter
    const bar = document.getElementById('compare-bar');
    const productsContainer = document.getElementById('compare-bar-products');
    const counter = document.getElementById('compare-counter');

    if (compareList.length > 0) {
        if (bar) bar.classList.add('show');

        // Show and update counter
        if (counter) {
            counter.classList.add('show');
            const numberEl = counter.querySelector('.compare-counter-number');
            const textEl = counter.querySelector('.compare-counter-text');
            if (numberEl) numberEl.textContent = compareList.length;
            if (textEl) textEl.textContent = compareList.length === 1 ? 'produto' : 'produtos';
        }

        if (productsContainer) {
            productsContainer.innerHTML = compareList.map(p => `
                        <div class="compare-bar-product">
                            <span class="compare-bar-product-name">${p.brand} ${p.model}</span>
                            <button class="compare-bar-remove" onclick="toggleCompare('${p.id}', '${p.name}')">✕</button>
                        </div>
                    `).join('');
        }
    } else {
        if (bar) bar.classList.remove('show');
        if (counter) counter.classList.remove('show');
    }
}

function clearComparison() {
    compareList = [];
    updateCompareUI();
}

// Open comparison modal with specific products
async function openFeaturedComparison(productId1, productId2) {
    // Load catalog if needed
    if (!currentCatalog) {
        try {
            const response = await fetch('/data/catalogs/geladeira.json');
            currentCatalog = await response.json();
        } catch (e) {
            console.error('Failed to load catalog:', e);
            alert('Erro ao carregar catálogo');
            return;
        }
    }

    // Get products from catalog
    const product1 = currentCatalog.products[productId1];
    const product2 = currentCatalog.products[productId2];

    if (!product1 || !product2) {
        alert('Produtos não encontrados');
        return;
    }

    // Set compareList with these products
    compareList = [
        { id: productId1, name: product1.name, ...product1 },
        { id: productId2, name: product2.name, ...product2 }
    ];

    // Open modal
    const modal = document.getElementById('compare-modal');
    const body = document.getElementById('compare-modal-body');
    body.innerHTML = renderComparisonTable();
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function showComparison() {
    if (compareList.length < 2) {
        alert('Selecione pelo menos 2 produtos para comparar');
        return;
    }

    const modal = document.getElementById('compare-modal');
    const body = document.getElementById('compare-modal-body');

    body.innerHTML = renderComparisonTable();
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeCompareModal() {
    document.getElementById('compare-modal').classList.remove('show');
    document.body.style.overflow = '';
}

function renderComparisonTable() {
    const products = compareList;
    const specsToCompare = [
        'capacidade_total', 'capacidade_freezer', 'consumo_kwh',
        'largura_cm', 'altura_cm', 'profundidade_cm', 'peso_kg'
    ];
    const topics = currentCatalog?.scoringTopics || [];

    // Find winners for each spec
    function findWinner(spec, higherIsBetter = true) {
        const values = products.map(p => p.specs[spec] || 0);
        const best = higherIsBetter ? Math.max(...values) : Math.min(...values);
        return products.filter(p => (p.specs[spec] || 0) === best).map(p => p.id);
    }

    function findScoreWinner(topicId) {
        const values = products.map(p => {
            const val = p.editorialScores?.[topicId];
            return typeof val === 'object' ? val?.score : val;
        });
        const best = Math.max(...values.filter(v => typeof v === 'number'));
        return products.filter(p => {
            const val = p.editorialScores?.[topicId];
            const score = typeof val === 'object' ? val?.score : val;
            return score === best;
        }).map(p => p.id);
    }

    let html = '<table class="compare-table">';

    // Header with product names
    html += '<thead><tr><th></th>';
    products.forEach(p => {
        html += `<th class="product-cell">
                    <div class="product-brand">${p.brand}</div>
                    <div class="product-name">${p.model}</div>
                    <span class="score-badge">${p.editorialScores?.overall || '?'}/10</span>
                </th>`;
    });
    html += '</tr></thead>';

    html += '<tbody>';

    // Price row - clickable with affiliate link + marketplace name
    const priceWinners = products.filter(p => p.bestPrice === Math.min(...products.map(x => x.bestPrice || Infinity))).map(p => p.id);
    html += '<tr><td><strong>💰 Melhor Preço</strong></td>';
    products.forEach(p => {
        const isWinner = priceWinners.includes(p.id);
        const bestOffer = p.offers?.filter(o => o.url).sort((a, b) => (a.price || Infinity) - (b.price || Infinity))[0];
        const marketplace = bestOffer?.retailerName || bestOffer?.vendor || 'Loja';
        const priceHtml = p.bestPrice
            ? (bestOffer?.url
                ? `<a href="${bestOffer.url}" target="_blank" rel="sponsored nofollow noopener" style="color:inherit;text-decoration:underline;font-weight:700;">${Utils.formatBRL(p.bestPrice)}</a><br><small style="font-size:0.75rem;color:var(--c-muted);">via ${marketplace}</small>`
                : `${Utils.formatBRL(p.bestPrice)}<br><small style="font-size:0.75rem;color:var(--c-muted);">via ${marketplace}</small>`)
            : 'N/A';
        html += `<td class="${isWinner ? 'winner' : ''}">${priceHtml}</td>`;
    });
    html += '</tr>';

    // Specs section
    html += '<tr class="compare-section-header"><td colspan="' + (products.length + 1) + '">📐 Especificações</td></tr>';

    specsToCompare.forEach(spec => {
        const higherBetter = ['capacidade_total', 'capacidade_freezer'].includes(spec);
        const lowerBetter = ['consumo_kwh', 'peso_kg'].includes(spec);
        const winners = lowerBetter ? findWinner(spec, false) : (higherBetter ? findWinner(spec, true) : []);

        html += `<tr><td>${SPEC_LABELS[spec] || spec}</td>`;
        products.forEach(p => {
            const isWinner = winners.includes(p.id);
            html += `<td class="${isWinner ? 'winner' : ''}">${formatSpec(spec, p.specs[spec])}</td>`;
        });
        html += '</tr>';
    });

    // Editorial scores section
    html += '<tr class="compare-section-header"><td colspan="' + (products.length + 1) + '">📊 Notas Editoriais</td></tr>';

    topics.forEach(topic => {
        const winners = findScoreWinner(topic.id);
        html += `<tr><td>${topic.icon || '📊'} ${topic.label}</td>`;
        products.forEach(p => {
            const scoreData = p.editorialScores?.[topic.id];
            const score = typeof scoreData === 'object' ? scoreData?.score : scoreData;
            const isWinner = winners.includes(p.id);
            html += `<td class="${isWinner ? 'winner' : ''}">${score ? score.toFixed(1) : 'N/A'}</td>`;
        });
        html += '</tr>';
    });

    // VoC summary
    html += '<tr class="compare-section-header"><td colspan="' + (products.length + 1) + '">🗣️ Voz do Cliente</td></tr>';

    // VoC Overall Score
    html += '<tr><td>📊 Nota Geral VoC</td>';
    products.forEach(p => {
        // Calculate VoC score from pros/cons balance + sentiment
        let vocScore = 5; // Base
        if (p.voc) {
            const prosCount = p.voc.pros?.length || 0;
            const consCount = p.voc.cons?.length || 0;
            const balance = prosCount - consCount;
            vocScore += balance * 0.5;
            if (p.voc.sentimentClass === 'positive') vocScore += 1.5;
            else if (p.voc.sentimentClass === 'negative') vocScore -= 1.5;
            vocScore = Math.max(1, Math.min(10, vocScore));
        }
        html += `<td>${vocScore.toFixed(1)}/10</td>`;
    });
    html += '</tr>';

    html += '<tr><td>Sentimento</td>';
    products.forEach(p => {
        html += `<td>${p.voc?.sentiment || 'N/A'}</td>`;
    });
    html += '</tr>';

    html += '</tbody></table>';

    return html;
}
// ==================== CALCULATORS ====================

function calculateEnergy() {
    if (!catalog) {
        alert('Por favor, selecione uma categoria primeiro');
        return;
    }

    const tariff = parseFloat(document.getElementById('calc-tariff').value) || 0.85;
    const voltage = document.getElementById('calc-voltage').value;
    const products = Catalog.getProducts(catalog);

    const container = document.getElementById('energy-results');

    let html = '<div style="background:#f0f9ff;padding:1rem;border-radius:var(--radius-sm);margin-top:1rem;">';
    html += '<h4 style="margin-bottom:0.75rem;font-size:0.95rem;color:var(--c-primary-dark);">💡 Custo Estimado de Energia</h4>';
    html += '<table style="width:100%;font-size:0.85rem;border-collapse:collapse;">';
    html += '<tr style="border-bottom:1px solid var(--c-border);">';
    html += '<th style="text-align:left;padding:0.5rem;">Produto</th>';
    html += '<th style="text-align:right;padding:0.5rem;">kWh/mês</th>';
    html += '<th style="text-align:right;padding:0.5rem;">R$/mês</th>';
    html += '<th style="text-align:right;padding:0.5rem;">R$/ano</th>';
    html += '</tr>';

    // Sort by consumption (lowest first)
    const sorted = [...products].sort((a, b) =>
        (a.specs.consumo_kwh || 999) - (b.specs.consumo_kwh || 999)
    );

    sorted.forEach((p, i) => {
        let consumption = p.specs.consumo_kwh || 0;
        // Voltage adjustment (~5% difference)
        if (voltage === '220') consumption *= 0.95;
        else if (voltage === '110') consumption *= 1.02;

        const monthly = consumption * tariff;
        const yearly = monthly * 12;
        const isBest = i === 0;

        html += `<tr style="border-bottom:1px solid var(--c-border);${isBest ? 'background:#dcfce7;' : ''}">`;
        html += `<td style="padding:0.5rem;${isBest ? 'font-weight:600;' : ''}">${p.model}${isBest ? ' ⭐' : ''}</td>`;
        html += `<td style="text-align:right;padding:0.5rem;">${consumption.toFixed(1)}</td>`;
        html += `<td style="text-align:right;padding:0.5rem;font-weight:500;">R$ ${monthly.toFixed(2)}</td>`;
        html += `<td style="text-align:right;padding:0.5rem;">R$ ${yearly.toFixed(2)}</td>`;
        html += '</tr>';
    });

    html += '</table>';
    html += `<p style="font-size:0.75rem;color:var(--c-muted);margin-top:0.5rem;">Tarifa: R$ ${tariff.toFixed(2)}/kWh | Voltagem: ${voltage === 'both' ? 'Bivolt' : voltage + 'V'}</p>`;
    html += '</div>';

    container.innerHTML = html;
    container.style.display = 'block';
}

function checkNicheFit() {
    if (!catalog) {
        alert('Por favor, selecione uma categoria primeiro');
        return;
    }

    const nicheWidth = parseFloat(document.getElementById('niche-width').value);
    const nicheHeight = parseFloat(document.getElementById('niche-height').value);
    const nicheDepth = parseFloat(document.getElementById('niche-depth').value);
    const gap = parseFloat(document.getElementById('niche-gap').value) || 4;

    if (!nicheWidth && !nicheHeight && !nicheDepth) {
        alert('Por favor, informe pelo menos uma medida');
        return;
    }

    const products = Catalog.getProducts(catalog);
    const container = document.getElementById('niche-results');

    let html = '<div style="margin-top:1rem;">';

    products.forEach(p => {
        const specs = p.specs;
        const fits = {
            width: !nicheWidth || (specs.largura_cm + gap <= nicheWidth),
            height: !nicheHeight || (specs.altura_cm <= nicheHeight),
            depth: !nicheDepth || (specs.profundidade_cm + gap <= nicheDepth)
        };
        const allFit = fits.width && fits.height && fits.depth;

        const bgColor = allFit ? '#dcfce7' : '#fee2e2';
        const icon = allFit ? '✅' : '❌';
        const textColor = allFit ? '#166534' : '#991b1b';

        html += `<div style="background:${bgColor};padding:1rem;border-radius:var(--radius-sm);margin-bottom:0.5rem;">`;
        html += `<div style="display:flex;justify-content:space-between;align-items:center;">`;
        html += `<strong style="color:${textColor};">${icon} ${p.model}</strong>`;
        html += `<span style="font-size:0.85rem;color:var(--c-muted);">${allFit ? 'CABE!' : 'NÃO CABE'}</span>`;
        html += `</div>`;

        html += `<div style="font-size:0.85rem;margin-top:0.5rem;color:var(--c-text);">`;
        html += `<span style="margin-right:1rem;">${fits.width ? '✓' : '✗'} Largura: ${specs.largura_cm} cm ${nicheWidth ? `(precisa ${specs.largura_cm + gap} cm)` : ''}</span>`;
        html += `<span style="margin-right:1rem;">${fits.height ? '✓' : '✗'} Altura: ${specs.altura_cm} cm</span>`;
        html += `<span>${fits.depth ? '✓' : '✗'} Profundidade: ${specs.profundidade_cm} cm ${nicheDepth ? `(precisa ${specs.profundidade_cm + gap} cm)` : ''}</span>`;
        html += `</div>`;
        html += `</div>`;
    });

    html += '</div>';

    container.innerHTML = html;
    container.style.display = 'block';
}

// ==================== SHARE COMPARISON ====================
function getShareUrl() {
    const productIds = compareList.map(p => p.id).join(',');
    return `${window.location.origin}${window.location.pathname}?compare=${productIds}`;
}

function getShareText() {
    const names = compareList.map(p => p.model).join(' vs ');
    return `🏆 Confira minha comparação de ${names} no ComparaTop!`;
}

function shareToSocial(platform) {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(getShareText());
    const title = encodeURIComponent('Comparação de Eletrodomésticos - ComparaTop');

    let shareUrl = '';

    switch (platform) {
        case 'whatsapp':
            shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
            break;
        case 'telegram':
            shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
            break;
        case 'email':
            shareUrl = `mailto:?subject=${title}&body=${text}%20${url}`;
            break;
        case 'copy':
            copyToClipboard(getShareUrl());
            return;
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast();
    }).catch(() => {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast();
    });
}

function showToast() {
    const toast = document.getElementById('share-toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ==================== NEWSLETTER ====================
function subscribeNewsletter() {
    const email = document.getElementById('newsletter-email').value.trim();
    const priceAlerts = document.getElementById('nl-price').checked;
    const newComparisons = document.getElementById('nl-new').checked;
    const weeklyPromos = document.getElementById('nl-promo').checked;

    // Validate email
    if (!email || !email.includes('@')) {
        alert('Por favor, insira um email válido.');
        return;
    }

    // At least one preference
    if (!priceAlerts && !newComparisons && !weeklyPromos) {
        alert('Selecione pelo menos uma preferência de comunicação.');
        return;
    }

    // Store in localStorage (in production, would send to backend)
    const subscription = {
        email,
        preferences: {
            priceAlerts,
            newComparisons,
            weeklyPromos
        },
        subscribedAt: new Date().toISOString()
    };

    // Save to localStorage
    const subscribers = JSON.parse(localStorage.getItem('comparatop_subscribers') || '[]');
    const existingIndex = subscribers.findIndex(s => s.email === email);
    if (existingIndex > -1) {
        subscribers[existingIndex] = subscription;
    } else {
        subscribers.push(subscription);
    }
    localStorage.setItem('comparatop_subscribers', JSON.stringify(subscribers));

    // Show success message
    document.getElementById('newsletter-form-container').style.display = 'none';
    document.getElementById('newsletter-success').style.display = 'block';

    console.log('Newsletter subscription:', subscription);
}

// Track channel clicks and open share link
function trackChannel(channel) {
    const clicks = JSON.parse(localStorage.getItem('comparatop_channel_clicks') || '[]');
    clicks.push({
        channel,
        clickedAt: new Date().toISOString()
    });
    localStorage.setItem('comparatop_channel_clicks', JSON.stringify(clicks));
    console.log(`Channel clicked: ${channel}`);

    // Get current page URL and title for sharing
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const text = encodeURIComponent('Confira essa análise de produtos no ComparaTop!');

    // Open share link based on channel
    const links = {
        whatsapp: `https://wa.me/?text=${text}%20${url}`,
        telegram: `https://t.me/share/url?url=${url}&text=${text}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        instagram: `https://instagram.com`, // Instagram doesn't have direct share URL
        email: `mailto:?subject=${title}&body=${text}%20${url}`,
        x: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`
    };

    if (links[channel]) {
        window.open(links[channel], '_blank', 'noopener,noreferrer');
    }
}

// ==================== PRODUCT NAVIGATION ====================
function toggleProductGroup(element) {
    element.classList.toggle('open');
}

function populateProductNav() {
    // Populate Geladeiras products in nav, sorted by editorial score (highest first)
    const geladeirasList = document.getElementById('nav-geladeiras-products');
    if (geladeirasList && currentCatalog && currentCatalog.products) {
        // Sort products by editorial score (highest first)
        const sortedProducts = Object.values(currentCatalog.products)
            .sort((a, b) => {
                const scoreA = a.editorialScores?.overall || 0;
                const scoreB = b.editorialScores?.overall || 0;
                return scoreB - scoreA;
            });

        let html = '';
        sortedProducts.forEach(p => {
            const score = p.editorialScores?.overall || 0;
            const scoreColor = score >= 8 ? '#22c55e' : score >= 6 ? '#eab308' : '#ef4444';
            const altText = `Geladeira ${p.brand} ${p.model} ${p.specs?.capacidade_total || ''}L ${p.specs?.tipo || ''} Frost Free - Nota ${score}/10`;
            // Click on name navigates; checkbox toggles compare
            html += `<div class="nav-product-item" data-product-id="${p.id}" style="display:flex;align-items:center;gap:0.5rem;">
                        <input type="checkbox" class="nav-compare-checkbox" onclick="event.stopPropagation(); toggleSidebarCompare('${p.id}', this.parentElement)" title="Adicionar à comparação" style="cursor:pointer;width:16px;height:16px;">
                        <a href="/produto/geladeira/${p.id}" onclick="event.preventDefault(); navigateToProduct('geladeira', '${p.id}'); closeSidebar();" title="${altText}" style="flex:1;display:flex;align-items:center;gap:0.5rem;text-decoration:none;color:inherit;cursor:pointer;">
                            <img src="${p.imageUrl}" alt="${altText}" class="nav-product-item-img" onerror="this.style.display='none'" loading="lazy" width="32" height="32">
                            <span>${p.brand} ${p.model}</span>
                        </a>
                        <span class="nav-product-score" style="background:${scoreColor};color:#fff;padding:0.1rem 0.4rem;border-radius:10px;font-size:0.65rem;font-weight:600;">${score}</span>
                    </div>`;
        });
        geladeirasList.innerHTML = html;
        // Update visual state for already selected products
        updateSidebarProductStates();
    }
}

// Toggle compare from sidebar - adds/removes product without closing menu
function toggleSidebarCompare(productId, element) {
    if (!currentCatalog || !currentCatalog.products) return;

    const product = currentCatalog.products[productId];
    if (!product) return;

    const score = product.editorialScores?.overall || 0;

    // Check if already in compare list
    const existingIndex = compareList.findIndex(p => p.id === productId);

    if (existingIndex >= 0) {
        // Remove from list
        compareList.splice(existingIndex, 1);
        element.classList.remove('selected');
        element.style.background = '';
    } else {
        // Add to list (max 4)
        if (compareList.length >= 4) {
            alert('Máximo de 4 produtos para comparação. Remova um antes de adicionar outro.');
            return;
        }
        compareList.push({
            ...product,
            id: productId,
            score: score
        });
        element.classList.add('selected');
        element.style.background = 'rgba(16, 185, 129, 0.15)';
    }

    // Update compare counter UI
    updateCompareUI();

    // Show compare toast
    showComparePrompt();

    // Save to localStorage for persistence
    try {
        localStorage.setItem('compareList', JSON.stringify(compareList));
    } catch (e) { }
}

// Update sidebar product visual states based on compareList
function updateSidebarProductStates() {
    const items = document.querySelectorAll('#nav-geladeiras-products .nav-product-item');
    items.forEach(item => {
        const productId = item.dataset.productId;
        const isSelected = compareList.some(p => p.id === productId);
        const checkbox = item.querySelector('.nav-compare-checkbox');
        if (isSelected) {
            item.classList.add('selected');
            item.style.background = 'rgba(16, 185, 129, 0.15)';
            if (checkbox) checkbox.checked = true;
        } else {
            item.classList.remove('selected');
            item.style.background = '';
            if (checkbox) checkbox.checked = false;
        }
    });
}

// Toggle score note visibility inline (shows directly below item)
function toggleScoreNote(noteId, color) {
    const noteEl = document.getElementById(noteId);
    if (!noteEl) return;

    // Close all other notes
    document.querySelectorAll('.score-note-inline').forEach(el => {
        if (el.id !== noteId) el.style.display = 'none';
    });

    // Toggle this note
    if (noteEl.style.display === 'none' || noteEl.style.display === '') {
        noteEl.style.display = 'block';
        noteEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        noteEl.style.display = 'none';
    }
}

// Legacy function for backwards compatibility
function showScoreTooltip(element) {
    const noteId = element.dataset.noteId;
    const color = element.dataset.color;
    if (noteId) {
        toggleScoreNote(noteId, color);
    }
}

// Show individual product page
let currentProduct = null;
function showProduct(categorySlug, productId) {
    // Load catalog first if needed
    if (!currentCatalog || currentCatalog.category.slug !== categorySlug) {
        fetch(`/data/catalogs/${categorySlug}.json`)
            .then(r => r.json())
            .then(data => {
                currentCatalog = data;
                displayProduct(productId);
            });
    } else {
        displayProduct(productId);
    }
}

function displayProduct(productId) {
    const product = currentCatalog.products[productId];
    if (!product) return;

    currentProduct = product;

    // Update nav active state
    document.querySelectorAll('.nav-product-item').forEach(el => el.classList.remove('active'));
    const navItem = document.querySelector(`.nav-product-item[data-product-id="${productId}"]`);
    if (navItem) navItem.classList.add('active');

    // Update breadcrumb
    document.getElementById('breadcrumb').innerHTML = `
                <a href="#" onclick="showHome(); return false;">Início</a> › 
                <a href="#" onclick="showCategory('${currentCatalog.category.slug}'); return false;">${currentCatalog.category.name}</a> › 
                ${product.model}
            `;
    document.getElementById('header-title').textContent = product.name;

    // Hide other pages, show product page
    document.getElementById('page-home').style.display = 'none';
    document.getElementById('page-category').style.display = 'none';
    document.getElementById('page-comparison').style.display = 'none';
    document.getElementById('page-product').style.display = 'block';

    // Check if in compare list
    const isInCompare = compareList.some(p => p.id === product.id);
    const compareButtonText = isInCompare ? '✓ Na comparação' : '➕ Adicionar ao comparador';
    const compareButtonClass = isInCompare ? 'btn-compare-active' : '';

    // Get all offers sorted by price (lowest first)
    const sortedOffers = (product.offers || []).filter(o => o.price).sort((a, b) => a.price - b.price);
    const bestPrice = sortedOffers[0]?.price;

    // Calculate overall editorial score (average of scoring topics only)
    const scoringTopicIds = currentCatalog.scoringTopics?.map(t => t.id) || [];
    const editorialScoreValues = scoringTopicIds
        .map(id => {
            const val = product.editorialScores?.[id];
            // Handle both old format (number) and new format (object with score)
            return typeof val === 'object' ? val?.score : val;
        })
        .filter(v => typeof v === 'number');
    const overallScore = editorialScoreValues.length > 0
        ? (editorialScoreValues.reduce((a, b) => a + b, 0) / editorialScoreValues.length)
        : null;
    const overallScoreColor = overallScore >= 8 ? '#22c55e' : overallScore >= 6 ? '#eab308' : '#ef4444';

    // Helper to format spec labels (remove underscores)
    const formatLabel = (key) => {
        const specDef = currentCatalog.specDefinitions?.[key];
        if (specDef?.label) return specDef.label;
        return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    // Pre-compute offers HTML to avoid nested template issues
    const retailerColors = {
        'amazon': '#FF9900',
        'mercado livre': '#FFE600',
        'magazine luiza': '#0086FF',
        'shopee': '#EE4D2D'
    };

    const offersHtml = sortedOffers.map((offer, idx) => {
        const isBest = offer.price === bestPrice;
        const retailerKey = offer.retailerName.toLowerCase();
        const color = retailerColors[retailerKey] || '#6b7280';
        const badgeHtml = isBest ? '<span class="offer-badge">🏆 Melhor Preço</span>' : '';
        return `<a href="${offer.url}" target="_blank" rel="sponsored nofollow noopener" 
                           class="offer-item ${isBest ? 'offer-best' : ''}" 
                           style="border-left: 4px solid ${color};"
                           aria-label="Comprar na ${offer.retailerName} por ${Utils.formatBRL(offer.price)}">
                            <div class="offer-retailer">
                                ${badgeHtml}
                                <span class="offer-store">${offer.retailerName}</span>
                            </div>
                            <div class="offer-price-action">
                                <span class="offer-price">${Utils.formatBRL(offer.price)}</span>
                                <span class="offer-btn-small">Ver Oferta →</span>
                            </div>
                        </a>`;
    }).join('');

    // Pre-compute specs HTML
    const specsHtml = Object.entries(product.specs || {}).map(([key, val]) => {
        const specDef = currentCatalog.specDefinitions?.[key];
        const label = formatLabel(key);
        const unit = specDef?.unit || '';
        const displayVal = (typeof val === 'boolean') ? (val ? 'Sim' : 'Não') : val;
        return `<div class="spec-item"><span class="spec-label">${label}</span><span class="spec-value">${displayVal}${unit ? ' ' + unit : ''}</span></div>`;
    }).join('');

    // Pre-compute scores HTML with clickable items
    const scoreNotes = product.editorialScores?.notes || '';
    const scoresHtml = (currentCatalog.scoringTopics || []).map((topic, idx) => {
        const scoreData = product.editorialScores?.[topic.id];
        // Handle both old format (number) and new format (object with score/note)
        const score = typeof scoreData === 'object' ? scoreData?.score : scoreData;
        const noteText = typeof scoreData === 'object' ? scoreData?.note : topic.description;
        if (!score) return '';
        const color = score >= 8 ? '#22c55e' : score >= 6 ? '#eab308' : '#ef4444';
        const finalNote = noteText || 'Avaliação baseada em análise editorial detalhada.';
        const itemId = `score-note-${topic.id}`;
        return `<div class="score-item-wrapper">
                    <div class="score-item score-item-clickable" data-note-id="${itemId}" data-color="${color}" onclick="toggleScoreNote('${itemId}', '${color}')" style="cursor:pointer;">
                        <span class="score-icon">${topic.icon}</span>
                        <span class="score-label">${topic.label} <span style="font-size:0.7rem;color:#94a3b8;">ⓘ</span></span>
                        <span class="score-value" style="color:${color}">${score.toFixed(1)}</span>
                    </div>
                    <div id="${itemId}" class="score-note-inline" style="display:none;background:#f1f5f9;padding:0.75rem;border-radius:var(--radius-sm);margin-top:0.25rem;font-size:0.85rem;color:#475569;border-left:4px solid ${color};">
                        📝 <strong>Por que essa nota:</strong> ${finalNote}
                    </div>
                </div>`;
    }).join('');

    // Pre-compute VoC HTML parts
    const prosHtml = (product.voc?.pros || []).map(p =>
        `<li><strong>${p.topic}</strong>: ${p.detail}${p.mentions ? ` <em style="color:var(--c-muted);font-size:0.8rem;">(${p.mentions} menções)</em>` : ''}</li>`
    ).join('');

    const consHtml = (product.voc?.cons || []).map(c =>
        `<li><strong>${c.topic}</strong>: ${c.detail}${c.mentions ? ` <em style="color:var(--c-muted);font-size:0.8rem;">(${c.mentions} menções)</em>` : ''}</li>`
    ).join('');

    const sourcesHtml = (product.voc?.sources || []).map(src =>
        `<a href="${src.url}" target="_blank" rel="nofollow noopener" style="display:inline-flex;align-items:center;gap:0.25rem;padding:0.25rem 0.5rem;background:#e5e7eb;border-radius:var(--radius-sm);text-decoration:none;color:var(--c-text);font-size:0.8rem;">${src.name} <span style="color:var(--c-muted);">(${src.count || '~'})</span></a>`
    ).join('');

    // Pre-compute Energy Calculator HTML
    const energyCalcHtml = `
                <section class="product-section" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:var(--radius);">
                    <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;">
                        <span style="background:linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);color:white;padding:0.5rem;border-radius:var(--radius-sm);font-size:1.25rem;">⚡</span>
                        <div>
                            <h3 style="margin:0;font-size:1.1rem;color:var(--c-primary-dark);">Calculadora de Consumo</h3>
                            <p style="margin:0;font-size:0.8rem;color:var(--c-muted);">Quanto vai custar na conta de luz?</p>
                        </div>
                    </div>
                    <div class="calculator-grid" style="display:grid;grid-template-columns:1fr auto;gap:1rem;align-items:end;">
                        <div>
                            <label style="font-size:0.85rem;font-weight:500;color:#475569;">Tarifa (R$/kWh):</label>
                            <input type="number" id="energy-tariff-${product.id}" value="0.75" step="0.01" min="0"
                                style="width:100%;padding:0.6rem;border:1px solid #cbd5e1;border-radius:var(--radius-sm);margin-top:0.25rem;font-size:0.95rem;">
                        </div>
                        <button class="btn" onclick="calculateEnergy('${product.id}', ${product.specs?.consumo_kwh || 0})"
                            style="padding:0.6rem 1.5rem;">Calcular</button>
                    </div>
                    <div id="energy-result-${product.id}" style="margin-top:1rem;display:none;"></div>
                </section>`;

    // Pre-compute Niche Calculator HTML
    const nicheCalcHtml = `
                <section class="product-section" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:var(--radius);">
                    <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;">
                        <span style="background:linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);color:white;padding:0.5rem;border-radius:var(--radius-sm);font-size:1.25rem;">📐</span>
                        <div>
                            <h3 style="margin:0;font-size:1.1rem;color:var(--c-primary-dark);">Verificar Encaixe no Nicho</h3>
                            <p style="margin:0;font-size:0.8rem;color:var(--c-muted);">Produto: ${product.specs?.largura_cm || '?'} × ${product.specs?.altura_cm || '?'} × ${product.specs?.profundidade_cm || '?'} cm (L×A×P)</p>
                        </div>
                    </div>
                    <p style="font-size:0.85rem;color:#64748b;margin-bottom:0.75rem;">Suas medidas do nicho:</p>
                    <div class="calculator-grid" style="display:grid;grid-template-columns:repeat(3, 1fr) auto;gap:0.75rem;align-items:end;">
                        <div>
                            <label style="font-size:0.8rem;font-weight:500;color:#475569;">Largura</label>
                            <input type="number" id="niche-w-${product.id}" placeholder="${(product.specs?.largura_cm || 0) + 5}" min="0"
                                style="width:100%;padding:0.5rem;border:1px solid #cbd5e1;border-radius:var(--radius-sm);margin-top:0.25rem;font-size:0.9rem;">
                        </div>
                        <div>
                            <label style="font-size:0.8rem;font-weight:500;color:#475569;">Altura</label>
                            <input type="number" id="niche-h-${product.id}" placeholder="${(product.specs?.altura_cm || 0) + 5}" min="0"
                                style="width:100%;padding:0.5rem;border:1px solid #cbd5e1;border-radius:var(--radius-sm);margin-top:0.25rem;font-size:0.9rem;">
                        </div>
                        <div>
                            <label style="font-size:0.8rem;font-weight:500;color:#475569;">Profundidade</label>
                            <input type="number" id="niche-d-${product.id}" placeholder="${(product.specs?.profundidade_cm || 0) + 5}" min="0"
                                style="width:100%;padding:0.5rem;border:1px solid #cbd5e1;border-radius:var(--radius-sm);margin-top:0.25rem;font-size:0.9rem;">
                        </div>
                        <button class="btn" onclick="checkNicheFitSingle('${product.id}')" 
                            style="padding:0.5rem 1.25rem;">Verificar</button>
                    </div>
                    <div id="niche-result-${product.id}" style="margin-top:1rem;display:none;"></div>
                </section>`;

    // Pre-compute overall score box
    const overallScoreHtml = overallScore ? `
                <div class="overall-score-box" style="background:linear-gradient(135deg, ${overallScoreColor}20, ${overallScoreColor}10);border:2px solid ${overallScoreColor};border-radius:var(--radius);padding:1rem;margin-bottom:1rem;display:flex;align-items:center;justify-content:space-between;">
                    <div>
                        <strong style="font-size:1.1rem;color:var(--c-primary-dark);">⭐ Nota Geral</strong>
                        <p style="margin:0.25rem 0 0;color:var(--c-muted);font-size:0.85rem;">Média de ${editorialScoreValues.length} critérios avaliados</p>
                    </div>
                    <div style="font-size:2rem;font-weight:700;color:${overallScoreColor};">${overallScore.toFixed(1)}</div>
                </div>` : '';

    // Pre-compute VoC section
    let vocSectionHtml = '';
    if (product.voc) {
        const sentimentStyle = product.voc.sentimentClass === 'positive' ? 'background:#dcfce7;color:#166534;'
            : product.voc.sentimentClass === 'negative' ? 'background:#fee2e2;color:#991b1b;'
                : 'background:#fef3c7;color:#92400e;';
        const sentimentText = product.voc.sentimentClass === 'positive' ? '👍 Geralmente Positivo'
            : product.voc.sentimentClass === 'negative' ? '👎 Geralmente Negativo'
                : '⚖️ Misto';
        const sampleText = product.voc.sample?.totalApprox
            ? `<span style="color:var(--c-muted);font-size:0.85rem;">📊 Baseado em ${product.voc.sample.totalApprox.toLocaleString('pt-BR')}+ avaliações</span>`
            : '';
        const summary30sHtml = product.voc.summary30s ? `
                    <div class="voc-30s" style="background:#f8fafc;padding:1rem;border-radius:var(--radius-sm);margin-bottom:1rem;">
                        <h4 style="margin:0 0 0.5rem;font-size:0.9rem;">📝 Resumo em 30 segundos</h4>
                        <p style="margin:0;line-height:1.6;">${product.voc.summary30s}</p>
                    </div>` : '';
        const sourcesSection = product.voc.sources?.length > 0 ? `
                    <div class="voc-sources" style="margin-top:1rem;padding-top:1rem;border-top:1px solid var(--c-border);">
                        <h4 style="font-size:0.85rem;color:var(--c-muted);margin-bottom:0.5rem;">📚 Fontes consultadas</h4>
                        <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">${sourcesHtml}</div>
                    </div>` : '';

        vocSectionHtml = `
                    <section class="product-section">
                        <h3>🗣️ Opinião dos Compradores</h3>
                        <div class="voc-header" style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem;">
                            <span class="voc-sentiment ${product.voc.sentimentClass || 'neutral'}" style="padding:0.5rem 1rem;border-radius:var(--radius-sm);font-weight:600;${sentimentStyle}">${sentimentText}</span>
                            ${sampleText}
                        </div>
                        <p class="voc-summary">${product.voc.oneLiner}</p>
                        ${summary30sHtml}
                        <div class="voc-pros-cons">
                            <div class="voc-pros">
                                <h4>✅ Pontos Positivos</h4>
                                <ul>${prosHtml}</ul>
                            </div>
                            <div class="voc-cons">
                                <h4>⚠️ Pontos de Atenção</h4>
                                <ul>${consHtml}</ul>
                            </div>
                        </div>
                        ${sourcesSection}
                    </section>`;
    }

    // Render single product view
    let html = `
                <div class="product-detail">
                    <div class="product-detail-grid">
                        <div class="product-detail-image">
                            <img src="${product.imageUrl}" alt="${product.model}" onerror="this.style.display='none'">
                        </div>
                        <div class="product-detail-info">
                            <h2 class="product-detail-model">${product.brand} ${product.model}</h2>
                            
                            <!-- All Marketplace Offers -->
                            ${sortedOffers.length > 0 ? `
                                <div class="offers-section">
                                    <h4 style="margin-bottom:0.75rem;color:var(--c-primary-dark);">💰 Onde Comprar (menor → maior preço)</h4>
                                    <div class="offers-list-vertical">
                                        ${offersHtml}
                                    </div>
                                </div>
                            ` : ''}
                            
                            <button class="btn btn-compare-large ${compareButtonClass}" onclick="toggleProductCompare('${product.id}')" id="compare-btn-${product.id}">
                                ${compareButtonText}
                            </button>
                        </div>
                    </div>

                    <!-- Ver outros modelos - Carrossel -->
                    ${(() => {
            const otherProds = Object.values(currentCatalog.products)
                .filter(p => p.id !== product.id)
                .sort((a, b) => (b.editorialScores?.overall || 0) - (a.editorialScores?.overall || 0))
                .slice(0, 10);

            if (otherProds.length === 0) return '';

            const catSlug = currentCatalog.category.slug;
            const items = otherProds.map(other => {
                const [slugFirst, slugSecond] = [product.id, other.id].sort();
                const url = `/comparar/${catSlug}/${slugFirst}-vs-${slugSecond}/`;
                const score = other.editorialScores?.overall;
                const scoreHtml = score ? `<span class="carousel-score">${score.toFixed(1)}</span>` : '';
                return `<a href="${url}" class="carousel-item">
                                <div class="carousel-item-content">
                                    <span class="carousel-model">${other.model}</span>
                                    <span class="carousel-brand">${other.brand}</span>
                                    ${scoreHtml}
                                </div>
                                <span class="carousel-cta">Comparar →</span>
                            </a>`;
            }).join('');

            return `
                    <section class="product-section compare-carousel-section">
                        <h3>🔄 Ver outros modelos</h3>
                        <div class="compare-carousel-wrapper">
                            <button class="carousel-btn carousel-prev" onclick="scrollCarousel(-1)">‹</button>
                            <div class="compare-carousel" id="compare-carousel">
                                ${items}
                            </div>
                            <button class="carousel-btn carousel-next" onclick="scrollCarousel(1)">›</button>
                        </div>
                    </section>`;
        })()}

                    <div class="product-detail-sections">
                        <!-- Specs Section -->
                        <section class="product-section">
                            <h3>📋 Especificações</h3>
                            <div class="specs-grid">
                                ${specsHtml}
                            </div>
                        </section>

                        <!-- Editorial Scores -->
                        <section class="product-section">
                            <h3>📊 Notas Editoriais</h3>
                            ${overallScoreHtml}
                            <div class="scores-grid">
                                ${scoresHtml}
                            </div>
                        </section>

                        <!-- VoC Section -->
                        ${vocSectionHtml}

                        <!-- 5-Question Quick Decision Quiz -->
                        <section class="product-section quiz-section" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:var(--radius);">
                            <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;">
                                <span style="background:linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);color:white;padding:0.5rem;border-radius:var(--radius-sm);font-size:1.25rem;">🎯</span>
                                <div>
                                    <h3 style="margin:0;font-size:1.1rem;color:var(--c-primary-dark);">Decida em 30 Segundos</h3>
                                    <p style="margin:0;font-size:0.8rem;color:var(--c-muted);">Este produto é ideal para você?</p>
                                </div>
                            </div>
                            
                            <div id="quiz-container-${product.id}" class="quiz-container"
                                 data-product-id="${product.id}"
                                 data-capacity="${product.specs?.capacidade_total || 0}"
                                 data-freezer="${product.specs?.capacidade_freezer || 0}"
                                 data-width="${product.specs?.largura_cm || 0}"
                                 data-noise="${product.editorialScores?.ruido || 5}"
                                 data-value="${product.editorialScores?.custo_beneficio || 5}"
                                 data-best-offer="${sortedOffers[0]?.url || '#'}"
                                 data-best-price="${sortedOffers[0]?.price || 0}">
                                <div class="quiz-questions" id="quiz-questions-${product.id}"></div>
                                <div class="quiz-result" id="quiz-result-${product.id}" style="display:none;"></div>
                            </div>
                        </section>
                        ${energyCalcHtml}
                        ${nicheCalcHtml}
                    </div>
                </div>
            `;

    document.getElementById('product-content').innerHTML = html;

    // Initialize quiz for this product
    initQuiz(product.id);

    // Update SEO meta tags and Schema.org
    updateMetaTags(product);
    generateSchemaOrg(product);
}

// Carousel scroll function
function scrollCarousel(direction) {
    const carousel = document.getElementById('compare-carousel');
    if (!carousel) return;
    const scrollAmount = 200;
    carousel.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

// Initialize 5-question quiz for product decision
function initQuiz(productId) {
    const container = document.getElementById(`quiz-container-${productId}`);
    if (!container) return;

    const data = container.dataset;
    const capacity = parseFloat(data.capacity) || 0;
    const freezer = parseFloat(data.freezer) || 0;
    const width = parseFloat(data.width) || 0;
    const noise = parseFloat(data.noise) || 5;
    const value = parseFloat(data.value) || 5;
    const bestOffer = data.bestOffer || '#';
    const bestPrice = parseFloat(data.bestPrice) || 0;

    const questions = [
        {
            q: "Qual o tamanho da sua família/quantidade de pessoas?",
            options: ["1-2 pessoas", "3-4 pessoas", "5+ pessoas"],
            ideal: capacity >= 400 ? [2] : [0, 1]
        },
        {
            q: "Você usa muito o freezer (congela muita comida)?",
            options: ["Pouco uso", "Uso moderado", "Uso intenso"],
            ideal: freezer >= 100 ? [1, 2] : [0, 1]
        },
        {
            q: "Qual a largura do espaço disponível (nicho)?",
            options: ["Até 65cm", "65-75cm", "Mais de 75cm"],
            ideal: width <= 65 ? [0, 1, 2] : width <= 72 ? [1, 2] : [2]
        },
        {
            q: "Você é sensível a ruídos de eletrodomésticos?",
            options: ["Muito sensível", "Um pouco", "Não me incomoda"],
            ideal: noise >= 7 ? [0, 1, 2] : [1, 2]
        },
        {
            q: "O que é mais importante para você?",
            options: ["Menor preço possível", "Melhor custo-benefício", "Mais funcionalidades"],
            ideal: value >= 8 ? [0, 1] : [1, 2]
        }
    ];

    const userAnswers = [];
    const questionsDiv = document.getElementById(`quiz-questions-${productId}`);
    const resultDiv = document.getElementById(`quiz-result-${productId}`);

    function renderQuestions() {
        let html = '';
        questions.forEach((q, i) => {
            html += `
                        <div class="quiz-question ${i === 0 ? 'active' : ''}" data-question="${i}">
                            <div class="quiz-progress">Pergunta ${i + 1} de 5</div>
                            <p class="quiz-q-text">${q.q}</p>
                            <div class="quiz-options">
                                ${q.options.map((opt, j) => `
                                    <button class="quiz-option" data-q="${i}" data-opt="${j}">${opt}</button>
                                `).join('')}
                            </div>
                        </div>
                    `;
        });
        questionsDiv.innerHTML = html;

        // Add click handlers
        questionsDiv.querySelectorAll('.quiz-option').forEach(btn => {
            btn.addEventListener('click', function () {
                const qIndex = parseInt(this.dataset.q);
                const optIndex = parseInt(this.dataset.opt);
                selectOption(qIndex, optIndex);
            });
        });
    }

    function selectOption(qIndex, optIndex) {
        userAnswers[qIndex] = optIndex;

        const questionDiv = questionsDiv.querySelector(`[data-question="${qIndex}"]`);
        questionDiv.querySelectorAll('.quiz-option').forEach((btn, idx) => {
            btn.classList.toggle('selected', idx === optIndex);
        });

        setTimeout(() => {
            if (qIndex < 4) {
                questionDiv.classList.remove('active');
                questionsDiv.querySelector(`[data-question="${qIndex + 1}"]`).classList.add('active');
            } else {
                showResult();
            }
        }, 300);
    }

    function showResult() {
        let score = 0;
        questions.forEach((q, i) => {
            if (q.ideal.includes(userAnswers[i])) score++;
        });

        const percent = (score / 5) * 100;
        let verdict, color, icon;

        if (percent >= 80) {
            verdict = 'PERFEITO para você!';
            color = '#22c55e';
            icon = '✅';
        } else if (percent >= 60) {
            verdict = 'Boa opção, vale considerar!';
            color = '#eab308';
            icon = '👍';
        } else {
            verdict = 'Talvez não seja a melhor escolha';
            color = '#ef4444';
            icon = '⚠️';
        }

        questionsDiv.style.display = 'none';
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
                    <div style="text-align:center;padding:1.5rem;background:linear-gradient(135deg, ${color}20, ${color}10);border:2px solid ${color};border-radius:var(--radius);">
                        <div style="font-size:3rem;margin-bottom:0.5rem;">${icon}</div>
                        <div style="font-size:1.5rem;font-weight:700;color:${color};margin-bottom:0.5rem;">${verdict}</div>
                        <div style="font-size:1rem;color:var(--c-muted);">Compatibilidade: ${percent.toFixed(0)}% (${score}/5 critérios)</div>
                        ${percent >= 60 ? `
                            <a href="${bestOffer}" target="_blank" rel="sponsored nofollow noopener" 
                               class="btn btn-buy" style="margin-top:1rem;display:inline-block;">
                                🛒 Comprar Agora - ${Utils.formatBRL(bestPrice)}
                            </a>
                        ` : `
                            <button onclick="showCategory('geladeira');" class="btn" style="margin-top:1rem;">
                                🔍 Ver Outras Opções
                            </button>
                        `}
                        <button class="quiz-reset-btn" style="display:block;margin:1rem auto 0;background:none;border:none;color:var(--c-muted);cursor:pointer;text-decoration:underline;">
                            Refazer quiz
                        </button>
                    </div>
                `;

        resultDiv.querySelector('.quiz-reset-btn').addEventListener('click', resetQuiz);
    }

    function resetQuiz() {
        userAnswers.length = 0;
        resultDiv.style.display = 'none';
        questionsDiv.style.display = 'block';
        questionsDiv.querySelectorAll('.quiz-question').forEach((q, i) => {
            q.classList.toggle('active', i === 0);
            q.querySelectorAll('.quiz-option').forEach(btn => btn.classList.remove('selected'));
        });
    }

    renderQuestions();
}

// Category selector for global quiz
document.addEventListener('DOMContentLoaded', function () {
    const categorySelect = document.getElementById('quiz-category-select');
    const startBtn = document.getElementById('start-global-quiz-btn');

    if (categorySelect && startBtn) {
        categorySelect.addEventListener('change', function () {
            if (this.value) {
                startBtn.style.display = 'inline-block';
            } else {
                startBtn.style.display = 'none';
            }
        });
    }
});

// Global Product Recommender - ranks ALL products
function startGlobalQuiz() {
    const categorySelect = document.getElementById('quiz-category-select');
    const selectedCategory = categorySelect ? categorySelect.value : 'geladeira';

    if (!selectedCategory) {
        alert('Por favor, selecione uma categoria primeiro.');
        return;
    }

    // Hide category selector during quiz
    const categorySelector = document.getElementById('quiz-category-selector');
    if (categorySelector) categorySelector.style.display = 'none';

    const catalogFile = `/data/catalogs/${selectedCategory}.json`;

    fetch(catalogFile)
        .then(r => r.json())
        .then(data => {
            currentCatalog = data;
            runGlobalQuiz(selectedCategory);
        })
        .catch(err => {
            alert('Categoria ainda não disponível. Em breve!');
            if (categorySelector) categorySelector.style.display = 'block';
        });
}

function runGlobalQuiz() {
    const startBtn = document.getElementById('start-global-quiz-btn');
    // Try hero container first, fallback to global container
    let questionsDiv = document.getElementById('hero-quiz-container');
    if (!questionsDiv || questionsDiv.offsetParent === null) {
        questionsDiv = document.getElementById('global-quiz-questions');
    }
    const resultDiv = document.getElementById('global-quiz-result');

    if (startBtn) startBtn.style.display = 'none';

    const questions = [
        {
            q: "Qual o tamanho da sua família/quantidade de pessoas?",
            options: ["1-2 pessoas", "3-4 pessoas", "5+ pessoas"],
            key: "familySize"
        },
        {
            q: "Você usa muito o freezer (congela muita comida)?",
            options: ["Pouco uso", "Uso moderado", "Uso intenso"],
            key: "freezerUse"
        },
        {
            q: "Qual a largura do espaço disponível (nicho)?",
            options: ["Até 65cm", "65-75cm", "Mais de 75cm"],
            key: "width"
        },
        {
            q: "Você é sensível a ruídos de eletrodomésticos?",
            options: ["Muito sensível", "Um pouco", "Não me incomoda"],
            key: "noise"
        },
        {
            q: "Qual seu orçamento máximo?",
            options: ["Até R$ 2.500", "R$ 2.500 - 4.000", "Acima de R$ 4.000"],
            key: "budget"
        }
    ];

    const userAnswers = {};
    let currentQ = 0;

    function renderQuestion(index) {
        const q = questions[index];
        questionsDiv.innerHTML = `
                    <div class="global-quiz-question" style="background:rgba(255,255,255,0.15);padding:1.5rem;border-radius:var(--radius);">
                        <div style="font-size:0.85rem;opacity:0.8;margin-bottom:0.5rem;color:#ffffff;">Pergunta ${index + 1} de 5</div>
                        <p style="font-size:1.1rem;font-weight:600;margin-bottom:1rem;color:#ffffff;">${q.q}</p>
                        <div style="display:flex;flex-direction:column;gap:0.5rem;">
                            ${q.options.map((opt, j) => `
                                <button class="global-quiz-opt" data-opt="${j}" 
                                    style="background:rgba(255,255,255,0.9);color:#1d4ed8;padding:0.75rem 1rem;border:none;border-radius:var(--radius-sm);cursor:pointer;font-size:1rem;text-align:left;transition:all 0.2s;">
                                    ${opt}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                `;

        questionsDiv.querySelectorAll('.global-quiz-opt').forEach(btn => {
            btn.addEventListener('click', function () {
                userAnswers[q.key] = parseInt(this.dataset.opt);
                if (currentQ < 4) {
                    currentQ++;
                    renderQuestion(currentQ);
                } else {
                    showGlobalResult();
                }
            });
        });
    }

    function showGlobalResult() {
        // Use questionsDiv instead of resultDiv since we're in hero-quiz-container

        // Score each product
        const products = Object.values(currentCatalog.products);
        const scoredProducts = products.map(p => {
            let score = 0;
            const specs = p.specs || {};
            const offers = p.offers || [];
            const lowestPrice = offers.length > 0 ? Math.min(...offers.map(o => o.price || 99999)) : 99999;

            // Family size vs capacity
            const capacity = specs.capacidade_total || 0;
            if (userAnswers.familySize === 0 && capacity <= 350) score++;
            else if (userAnswers.familySize === 1 && capacity >= 300 && capacity <= 450) score++;
            else if (userAnswers.familySize === 2 && capacity >= 400) score++;

            // Freezer use
            const freezer = specs.capacidade_freezer || 0;
            if (userAnswers.freezerUse === 0 && freezer <= 80) score++;
            else if (userAnswers.freezerUse === 1 && freezer >= 60 && freezer <= 120) score++;
            else if (userAnswers.freezerUse === 2 && freezer >= 100) score++;

            // Width
            const width = specs.largura_cm || 0;
            if (userAnswers.width === 0 && width <= 65) score++;
            else if (userAnswers.width === 1 && width <= 72) score++;
            else if (userAnswers.width === 2) score++; // Any fits

            // Noise sensitivity
            const noiseScore = p.editorialScores?.ruido || 5;
            if (userAnswers.noise === 0 && noiseScore >= 7) score++;
            else if (userAnswers.noise === 1 && noiseScore >= 5) score++;
            else if (userAnswers.noise === 2) score++; // Doesn't care

            // Budget
            if (userAnswers.budget === 0 && lowestPrice <= 2500) score++;
            else if (userAnswers.budget === 1 && lowestPrice >= 2000 && lowestPrice <= 4000) score++;
            else if (userAnswers.budget === 2 && lowestPrice >= 3000) score++;

            return { product: p, score, percent: (score / 5) * 100, lowestPrice };
        });

        // Sort by score (highest first)
        scoredProducts.sort((a, b) => b.score - a.score);

        // Build result HTML with close button
        const topProducts = scoredProducts.slice(0, 3);
        let html = `
                    <div style="background:rgba(255,255,255,0.95);padding:1.5rem;border-radius:var(--radius);color:#1e293b;position:relative;">
                        <button onclick="closeQuizResult()" style="position:absolute;top:0.5rem;right:0.5rem;background:none;border:none;font-size:1.5rem;cursor:pointer;color:#64748b;padding:0.25rem;">&times;</button>
                        <h3 style="margin:0 0 1rem;color:#1d4ed8;">🏆 Nossas Recomendações para Você</h3>
                        ${topProducts.map((item, idx) => {
            const color = item.percent >= 80 ? '#22c55e' : item.percent >= 60 ? '#eab308' : '#ef4444';
            const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';
            const bestOffer = item.product.offers?.sort((a, b) => a.price - b.price)[0];
            return `
                                <div style="display:flex;align-items:center;gap:1rem;padding:1rem;margin-bottom:0.5rem;background:#f8fafc;border-radius:var(--radius-sm);border-left:4px solid ${color};">
                                    <span style="font-size:1.5rem;">${medal}</span>
                                    <div style="flex:1;">
                                        <div style="font-weight:600;">${item.product.brand} ${item.product.model}</div>
                                        <div style="font-size:0.85rem;color:#64748b;">Compatibilidade: ${item.percent.toFixed(0)}% • ${Utils.formatBRL(item.lowestPrice)}</div>
                                    </div>
                                    <a href="/produto/geladeira/${item.product.id}/" 
                                       onclick="closeQuizResult(); return true;" 
                                        style="background:#1d4ed8;color:white;padding:0.5rem 1rem;border-radius:var(--radius-sm);text-decoration:none;font-size:0.85rem;">
                                        Ver Detalhes
                                    </a>
                                </div>
                            `;
        }).join('')}
                        <div style="display:flex;gap:1rem;margin-top:1rem;justify-content:center;">
                            <button onclick="closeQuizResult()" style="background:#22c55e;color:white;border:none;padding:0.75rem 1.5rem;border-radius:var(--radius-sm);cursor:pointer;font-size:0.95rem;">
                                ✓ Fechar
                            </button>
                            <button onclick="restartQuizFromResult()" style="background:#64748b;color:white;border:none;padding:0.75rem 1.5rem;border-radius:var(--radius-sm);cursor:pointer;font-size:0.95rem;">
                                🔄 Refazer Quiz
                            </button>
                        </div>
                    </div>
                `;
        questionsDiv.innerHTML = html;
    }

    renderQuestion(0);
}

function resetGlobalQuiz() {
    const startBtn = document.getElementById('start-global-quiz-btn');
    const questionsDiv = document.getElementById('global-quiz-questions');
    const resultDiv = document.getElementById('global-quiz-result');
    const categorySelector = document.getElementById('quiz-category-selector');
    const categorySelect = document.getElementById('quiz-category-select');

    // Reset category selector
    if (categorySelector) categorySelector.style.display = 'block';
    if (categorySelect) categorySelect.value = '';

    if (startBtn) startBtn.style.display = 'none';
    if (questionsDiv) {
        questionsDiv.style.display = 'block';
        questionsDiv.innerHTML = '';
    }
    if (resultDiv) {
        resultDiv.style.display = 'none';
        resultDiv.innerHTML = '';
    }
}

// Close quiz result and reset hero container
function closeQuizResult() {
    const heroQuizContainer = document.getElementById('hero-quiz-container');
    const categorySelectHero = document.getElementById('quiz-category-select-hero');

    if (heroQuizContainer) {
        heroQuizContainer.innerHTML = '';
    }
    if (categorySelectHero) {
        categorySelectHero.value = '';
    }
}

// Restart quiz from result screen
function restartQuizFromResult() {
    const categorySelectHero = document.getElementById('quiz-category-select-hero');
    if (categorySelectHero && categorySelectHero.value) {
        startGlobalQuiz();
    } else {
        closeQuizResult();
    }
}

// Toggle product in compare list from product page
function toggleProductCompare(productId) {
    const product = currentCatalog.products[productId];
    if (!product) return;

    const existingIndex = compareList.findIndex(p => p.id === productId);
    if (existingIndex > -1) {
        compareList.splice(existingIndex, 1);
    } else {
        if (compareList.length < 4) {
            compareList.push({ id: productId, ...product });
        } else {
            showToast('Máximo de 4 produtos na comparação');
            return;
        }
    }

    // Update button state
    const btn = document.getElementById(`compare-btn-${productId}`);
    if (btn) {
        const isNowInCompare = compareList.some(p => p.id === productId);
        btn.textContent = isNowInCompare ? '✓ Na comparação' : '➕ Adicionar ao comparador';
        btn.classList.toggle('btn-compare-active', isNowInCompare);
    }

    updateCompareUI();
    showComparePrompt();
}

// Energy calculator for single product page
function calculateEnergy(productId, monthlyKwh) {
    const tariff = parseFloat(document.getElementById(`energy-tariff-${productId}`).value) || 0.75;
    const monthlyCost = monthlyKwh * tariff;
    const annualCost = monthlyCost * 12;

    const resultDiv = document.getElementById(`energy-result-${productId}`);
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div style="background:#f0fdf4;border:1px solid #22c55e;border-radius:var(--radius-sm);padding:1rem;">
            <div style="display:grid;grid-template-columns:repeat(2, 1fr);gap:1rem;text-align:center;">
                <div>
                    <div style="font-size:0.85rem;color:var(--c-muted);">Consumo Mensal</div>
                    <div style="font-size:1.25rem;font-weight:700;color:var(--c-primary-dark);">${monthlyKwh} kWh</div>
                </div>
                <div>
                    <div style="font-size:0.85rem;color:var(--c-muted);">Custo Mensal</div>
                    <div style="font-size:1.25rem;font-weight:700;color:var(--c-success);">
                        ${Utils.formatBRL(monthlyCost)}</div>
                </div>
                <div style="grid-column:span 2;padding-top:0.5rem;border-top:1px solid #22c55e40;">
                    <div style="font-size:0.85rem;color:var(--c-muted);">Custo Anual Estimado</div>
                    <div style="font-size:1.5rem;font-weight:700;color:var(--c-success);">${Utils.formatBRL(annualCost)}
                    </div>
                </div>
            </div>
        </div>
        `;
}

// Niche fit calculator for single product page
function checkNicheFitSingle(productId) {
    const product = currentCatalog.products[productId];
    if (!product) return;

    const nicheW = parseFloat(document.getElementById(`niche-w-${productId}`).value);
    const nicheH = parseFloat(document.getElementById(`niche-h-${productId}`).value);
    const nicheD = parseFloat(document.getElementById(`niche-d-${productId}`).value);

    const prodW = product.specs?.largura_cm || 0;
    const prodH = product.specs?.altura_cm || 0;
    const prodD = product.specs?.profundidade_cm || 0;

    const gap = 4; // Recommended gap for ventilation

    const fitsW = !nicheW || (prodW + gap <= nicheW); const fitsH = !nicheH || (prodH + gap <= nicheH); const
        fitsD = !nicheD || (prodD + gap <= nicheD); const allFit = fitsW && fitsH && fitsD; const
            resultDiv = document.getElementById(`niche-result-${productId}`); resultDiv.style.display = 'block'; const
                bgColor = allFit ? '#dcfce7' : '#fee2e2'; const borderColor = allFit ? '#22c55e' : '#ef4444'; const
                    icon = allFit ? '✅' : '❌'; const message = allFit ? 'O produto CABE no seu espaço!'
                        : 'O produto NÃO CABE no espaço informado'; resultDiv.innerHTML = ` <div
            style="background:${bgColor};border:1px solid ${borderColor};border-radius:var(--radius-sm);padding:1rem;">
            <div style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;">${icon} ${message}</div>
            <div
                style="font-size:0.9rem;display:grid;grid-template-columns:repeat(3, 1fr);gap:0.5rem;margin-top:0.75rem;">
                <div
                    style="text-align:center;padding:0.5rem;background:rgba(255,255,255,0.5);border-radius:var(--radius-sm);">
                    <div style="font-size:0.75rem;color:var(--c-muted);">Largura</div>
                    <div>${fitsW ? '✓' : '✗'} ${prodW} cm ${nicheW ? `→ ${nicheW} cm` : ''}</div>
                </div>
                <div
                    style="text-align:center;padding:0.5rem;background:rgba(255,255,255,0.5);border-radius:var(--radius-sm);">
                    <div style="font-size:0.75rem;color:var(--c-muted);">Altura</div>
                    <div>${fitsH ? '✓' : '✗'} ${prodH} cm ${nicheH ? `→ ${nicheH} cm` : ''}</div>
                </div>
                <div
                    style="text-align:center;padding:0.5rem;background:rgba(255,255,255,0.5);border-radius:var(--radius-sm);">
                    <div style="font-size:0.75rem;color:var(--c-muted);">Profundidade</div>
                    <div>${fitsD ? '✓' : '✗'} ${prodD} cm ${nicheD ? `→ ${nicheD} cm` : ''}</div>
                </div>
            </div>
            <p style="font-size:0.75rem;color:var(--c-muted);margin-top:0.5rem;">* Considerando folga mínima de ${gap}cm
                para ventilação</p>
            </div>
            `;
}

// Update meta tags dynamically for SEO
function updateMetaTags(product) {
    if (!product) return;

    const title = `${product.brand} ${product.model} - Análise Completa | ComparaTop`;
    const description = `Análise ${product.name}: compare preços em ${product.offers?.length || 0} lojas, veja avaliações reais de ${product.voc?.sample?.totalApprox?.toLocaleString('pt-BR') || 'milhares'} de compradores. Nota ${product.editorialScores?.overall || 'N/A'}/10.`;

    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    // Open Graph
    updateOrCreateMeta('og:title', title);
    updateOrCreateMeta('og:description', description);
    updateOrCreateMeta('og:url', window.location.href);
}

function updateOrCreateMeta(property, content) {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
    }
    meta.content = content;
}

// Generate Schema.org structured data for product
function generateSchemaOrg(product) {
    if (!product) return;

    const sortedOffers = [...(product.offers || [])].sort((a, b) => a.price - b.price);
    const lowestPrice = sortedOffers[0]?.price || 0;
    const highestPrice = sortedOffers[sortedOffers.length - 1]?.price || 0;

    const schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": `${product.brand} ${product.model}`,
        "description": product.voc?.oneLiner || `${product.name} - Geladeira ${product.specs?.tipo || ''} ${product.specs?.capacidade_total}L`,
        "brand": {
            "@type": "Brand",
            "name": product.brand
        },
        "sku": product.model,
        "image": product.imageUrl,
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": product.editorialScores?.overall || 0,
            "bestRating": 10,
            "worstRating": 0,
            "ratingCount": product.voc?.sample?.totalApprox || 1
        },
        "offers": {
            "@type": "AggregateOffer",
            "lowPrice": lowestPrice,
            "highPrice": highestPrice,
            "priceCurrency": "BRL",
            "offerCount": sortedOffers.length,
            "availability": "https://schema.org/InStock"
        }
    };

    // Remove existing schema and add new one
    let existingSchema = document.getElementById('product-schema');
    if (existingSchema) existingSchema.remove();

    const script = document.createElement('script');
    script.id = 'product-schema';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
}

// Init - integrate router with handlers
document.addEventListener('DOMContentLoaded', () => {
    // Load default catalog for navigation first (using absolute path)
    fetch('/data/catalogs/geladeira.json')
        .then(r => r.json())
        .then(data => {
            currentCatalog = data;
            populateProductNav();

            // Register route handlers AFTER catalog is loaded
            Router.on('home', () => {
                showHome();
                Utils.updateMetaTags({
                    title: 'ComparaTop - Compare antes de comprar',
                    description: 'Compare eletrodomésticos antes de comprar. Análise transparente com síntese de milhares de avaliações reais.',
                    url: 'https://comparatop.com.br/',
                    image: 'https://comparatop.com.br/assets/og-image.png'
                });
            });

            Router.on('category', ({ categoryId }) => {
                showCategory(categoryId);
                const categoryNames = { geladeira: 'Geladeiras', freezer: 'Freezers', frigobar: 'Frigobares' };
                const name = categoryNames[categoryId] || categoryId;
                Utils.updateMetaTags({
                    title: `${name} - Compare as Melhores | ComparaTop`,
                    description: `Compare as melhores ${name.toLowerCase()} do Brasil. Análise baseada em milhares de avaliações reais.`,
                    url: `https://comparatop.com.br/categoria/${categoryId}`,
                    image: 'https://comparatop.com.br/assets/og-image.png'
                });
            });

            Router.on('product', ({ categoryId, productId }) => {
                // Load product details and render
                showProduct(categoryId, productId);

                // After a brief delay (for catalog to load), update meta tags
                Catalog.load(categoryId).then(cat => {
                    const product = Catalog.getProduct(cat, productId);
                    if (product) {
                        Utils.updateMetaTags({
                            title: `${product.name} - Review e Preços | ComparaTop`,
                            description: product.editorialScores?.notes || `Análise completa do ${product.name} com prós, contras e comparativo de preços.`,
                            url: `https://comparatop.com.br/produto/${categoryId}/${productId}`,
                            image: product.imageUrl?.startsWith('/') ? `https://comparatop.com.br${product.imageUrl}` : product.imageUrl,
                            type: 'product'
                        });
                        // Inject Schema.org
                        if (typeof injectProductSchema === 'function') {
                            injectProductSchema(product);
                        }
                    }
                });
            });

            Router.on('comparison', async (params) => {
                const comparisonId = params.comparisonId;
                if (comparisonId && comparisonId.includes('-vs-')) {
                    // Load catalog if needed
                    if (!currentCatalog) {
                        try {
                            const response = await fetch('/data/catalogs/geladeira.json');
                            currentCatalog = await response.json();
                        } catch (e) {
                            console.error('Failed to load catalog:', e);
                            showCategory('geladeira');
                            return;
                        }
                    }
                    // Parse product IDs from URL
                    const [productId1, productId2] = comparisonId.split('-vs-');
                    const product1 = currentCatalog.products[productId1];
                    const product2 = currentCatalog.products[productId2];

                    if (product1 && product2) {
                        compareList = [
                            { id: productId1, ...product1 },
                            { id: productId2, ...product2 }
                        ];
                        showComparison();
                    } else {
                        showCategory('geladeira');
                    }
                } else {
                    showComparison();
                }
            });

            // Initialize router (handles current URL)
            Router.init();
        })
        .catch(() => {
            // Fallback if catalog fails to load
            Router.on('home', showHome);
            Router.init();
        });
});
// Force close sidebar on mobile load (Guardrail)
document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth <= 1024) {
        closeSidebar();
    }
    // Aggressive Compare Counter Fix
    const compareCounter = document.querySelector('.compare-counter');
    if (compareCounter) {
        if (!compareList || compareList.length === 0) {
            compareCounter.style.display = 'none';
        }
    }

    // ========== ML-LIKE HEADER FUNCTIONALITY ==========
    initMLHeader();
});

// ML Header initialization
function initMLHeader() {
    const mlSearchInput = document.getElementById('ml-search-input');
    const mlSearchBtn = document.getElementById('ml-search-btn');
    const mlSearchResults = document.getElementById('ml-search-results');
    const originalSearchInput = document.getElementById('search-input');

    if (mlSearchInput) {
        // Sync ML search with original search functionality
        mlSearchInput.addEventListener('input', function (e) {
            // Trigger the same search as original
            if (originalSearchInput) {
                originalSearchInput.value = e.target.value;
                originalSearchInput.dispatchEvent(new Event('input'));
            }
            // Show results in ML search dropdown
            performMLSearch(e.target.value);
        });

        mlSearchInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performMLSearch(this.value, true);
            }
        });

        // Close search results when clicking outside
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.ml-search-wrapper')) {
                if (mlSearchResults) mlSearchResults.classList.remove('show');
            }
        });
    }

    if (mlSearchBtn) {
        mlSearchBtn.addEventListener('click', function () {
            if (mlSearchInput) {
                performMLSearch(mlSearchInput.value, true);
            }
        });
    }

    // Category buttons - for now just log, will add mega-menu in Phase 2
    const catButtons = document.querySelectorAll('.ml-cat-btn');
    catButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const category = this.dataset.category;
            console.log('Category clicked:', category);

            // Toggle aria-expanded
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            // Close all other buttons
            catButtons.forEach(b => b.setAttribute('aria-expanded', 'false'));

            if (!isExpanded) {
                this.setAttribute('aria-expanded', 'true');
                // Phase 2 will add dropdown/mega-menu here
                handleCategoryClick(category);
            }
        });
    });
}

// ML Search function
function performMLSearch(query, navigate = false) {
    const mlSearchResults = document.getElementById('ml-search-results');

    if (!query || query.length < 2) {
        if (mlSearchResults) mlSearchResults.classList.remove('show');
        return;
    }

    // Search in current catalog
    if (!currentCatalog || !currentCatalog.products) {
        // Try to load geladeira catalog for search
        fetch('/data/catalogs/geladeira.json')
            .then(r => r.json())
            .then(data => {
                searchInCatalog(data, query, mlSearchResults, navigate);
            })
            .catch(() => {
                if (mlSearchResults) {
                    mlSearchResults.innerHTML = '<div style="padding:1rem;color:var(--c-muted);">Nenhum resultado</div>';
                    mlSearchResults.classList.add('show');
                }
            });
    } else {
        searchInCatalog(currentCatalog, query, mlSearchResults, navigate);
    }
}

function searchInCatalog(catalog, query, resultsContainer, navigate) {
    const q = query.toLowerCase();
    const products = Object.values(catalog.products || {});

    const matches = products.filter(p =>
        p.model?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.name?.toLowerCase().includes(q)
    ).slice(0, 5);

    if (navigate && matches.length > 0) {
        // Navigate to first result
        Router.navigate(`/produto/${catalog.category.slug}/${matches[0].id}/`);
        resultsContainer.classList.remove('show');
        return;
    }

    if (matches.length === 0) {
        resultsContainer.innerHTML = '<div style="padding:1rem;color:var(--c-muted);">Nenhum produto encontrado</div>';
    } else {
        resultsContainer.innerHTML = matches.map(p => `
            <a href="/produto/${catalog.category.slug}/${p.id}/" 
               onclick="Router.navigate('/produto/${catalog.category.slug}/${p.id}/'); document.getElementById('ml-search-results').classList.remove('show'); return false;"
               style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem 1rem;text-decoration:none;color:var(--c-text);border-bottom:1px solid var(--c-border);">
                <img src="${p.imageUrl || ''}" alt="" style="width:40px;height:40px;object-fit:contain;background:#f8fafc;border-radius:4px;">
                <div>
                    <div style="font-weight:500;">${p.brand} ${p.model}</div>
                    <div style="font-size:0.8rem;color:var(--c-muted);">${catalog.category.name}</div>
                </div>
            </a>
        `).join('');
    }

    resultsContainer.classList.add('show');
}

// Handle category button clicks - Opens mega-menu or dropdown
function handleCategoryClick(category) {
    if (category === 'all') {
        openMegaMenu();
    } else {
        openDropdown(category);
    }
}

// Open Mega-Menu "Tudo"
function openMegaMenu() {
    const megaMenu = document.getElementById('ml-mega-all');
    const overlay = document.getElementById('ml-mega-overlay');

    // Close any open dropdowns first
    closeAllDropdowns();

    if (megaMenu && overlay) {
        megaMenu.setAttribute('aria-hidden', 'false');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('menu-open');

        // Add ESC key listener
        document.addEventListener('keydown', handleEscKey);
    }
}

// Close Mega-Menu
function closeMegaMenu() {
    const megaMenu = document.getElementById('ml-mega-all');
    const overlay = document.getElementById('ml-mega-overlay');

    if (megaMenu) megaMenu.setAttribute('aria-hidden', 'true');
    if (overlay) overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');

    // Reset category button states
    document.querySelectorAll('.ml-cat-btn').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
    });

    // Remove ESC listener
    document.removeEventListener('keydown', handleEscKey);
}

// Open individual category dropdown
function openDropdown(category) {
    const dropdown = document.getElementById(`ml-dropdown-${category}`);
    const btn = document.querySelector(`.ml-cat-btn[data-category="${category}"]`);

    // Close mega-menu and other dropdowns
    closeMegaMenu();
    closeAllDropdowns();

    if (dropdown && btn) {
        // Position dropdown below the button
        const btnRect = btn.getBoundingClientRect();
        dropdown.style.left = `${btnRect.left}px`;
        dropdown.style.top = `${btnRect.bottom}px`;

        dropdown.setAttribute('aria-hidden', 'false');

        // Add click outside listener
        setTimeout(() => {
            document.addEventListener('click', handleClickOutsideDropdown);
        }, 10);
    }
}

// Close all dropdowns
function closeAllDropdowns() {
    document.querySelectorAll('.ml-dropdown').forEach(dd => {
        dd.setAttribute('aria-hidden', 'true');
    });
    document.removeEventListener('click', handleClickOutsideDropdown);

    // Reset button states
    document.querySelectorAll('.ml-cat-btn').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
    });
}

// Handle ESC key
function handleEscKey(e) {
    if (e.key === 'Escape') {
        closeMegaMenu();
        closeAllDropdowns();
    }
}

// Handle click outside dropdown
function handleClickOutsideDropdown(e) {
    if (!e.target.closest('.ml-dropdown') && !e.target.closest('.ml-cat-btn')) {
        closeAllDropdowns();
    }
}

// Navigate and close menus
function navigateAndClose(url) {
    closeMegaMenu();
    closeAllDropdowns();
    Router.navigate(url);
}

// Setup overlay click handler
document.addEventListener('DOMContentLoaded', function () {
    const overlay = document.getElementById('ml-mega-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeMegaMenu);
    }
});

// updateCompareUI is defined earlier - no need to redefine
