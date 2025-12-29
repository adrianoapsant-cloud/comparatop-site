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
