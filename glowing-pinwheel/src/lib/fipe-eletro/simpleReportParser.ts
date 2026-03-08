/**
 * =============================================================================
 * PARSER SIMPLIFICADO PARA RELATÓRIOS FIPE-ELETRO
 * =============================================================================
 * 
 * Extrai dados diretamente da tabela TCO do relatório Gemini.
 * Sem regex complexos - busca valores específicos de forma direta.
 */

export interface SimpleParsedReport {
    // Identificação
    productName: string;
    category: string;

    // Valores da Tabela TCO (5 anos)
    acquisitionCost: number;      // Custo de Aquisição
    energyCost5y: number;         // Custo de Energia em 5 anos
    consumablesCost5y: number;    // Custo de Consumíveis em 5 anos
    maintenanceCost5y: number;    // Custo de Manutenção em 5 anos
    residualValue5y: number;      // Valor Residual em 5 anos
    totalTco5y: number;           // TCO Total em 5 anos

    // Detalhes de Consumíveis (para breakdown)
    consumablesBreakdown: Array<{
        item: string;
        unitPrice: number;
        frequencyMonths: number;
        annualCost: number;
    }>;

    // Detalhes de Manutenção
    maintenanceBreakdown: Array<{
        component: string;
        estimatedCost: number;
        probability5y: number;
    }>;

    // Metadados
    lifespan: number;
    dataConfidence: number;
}

/**
 * Extrai um valor monetário de uma string.
 * Exemplos: "R$ 2.500,00" → 2500, "2500" → 2500
 */
function extractMoney(text: string): number {
    if (!text) return 0;

    // Remove R$, espaços, pontos de milhar
    const cleaned = text
        .replace(/R\$\s*/gi, '')
        .replace(/\./g, '')  // Remove pontos de milhar
        .replace(/,/g, '.')  // Vírgula decimal → ponto
        .trim();

    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
}

/**
 * Busca um valor monetário próximo a uma label no texto.
 * Ex: findValueNearLabel(text, "Energia") → encontra "R$ 270,00" na linha de energia
 */
function findValueNearLabel(text: string, label: string): number {
    const regex = new RegExp(label + '[^\\d]*R\\$\\s*([\\d.,]+)', 'i');
    const match = text.match(regex);
    if (match) {
        return extractMoney(match[1]);
    }
    return 0;
}

/**
 * Parser principal - extrai dados do relatório Gemini.
 */
export function parseSimpleReport(reportText: string): SimpleParsedReport {
    const text = reportText;

    // ─── 1. Extrair nome do produto ─────────────────────────────────────────────
    let productName = 'Produto Analisado';
    const namePatterns = [
        /(?:análise|relatório|avaliação).*?(?:do|da|para)\s+(.+?)(?:\n|$)/i,
        /^#\s*(.+?)$/m,
        /produto:\s*(.+?)(?:\n|$)/i,
    ];
    for (const pattern of namePatterns) {
        const match = text.match(pattern);
        if (match) {
            productName = match[1].trim();
            break;
        }
    }

    // ─── 2. Extrair valores da tabela TCO ───────────────────────────────────────
    // Busca padrões comuns de tabela TCO

    // Preço/Aquisição
    let acquisitionCost = 0;
    const pricePatterns = [
        /Aquisi[çc][ãa]o[^R]*R\$\s*([\d.,]+)/i,
        /Pre[çc]o[^R]*R\$\s*([\d.,]+)/i,
        /Investimento[^R]*R\$\s*([\d.,]+)/i,
        /R\$\s*([\d.,]+).*?novo/i,
    ];
    for (const pattern of pricePatterns) {
        const match = text.match(pattern);
        if (match) {
            acquisitionCost = extractMoney(match[1]);
            if (acquisitionCost > 0) break;
        }
    }

    // Energia (5 anos)
    let energyCost5y = 0;
    const energyPatterns = [
        /Energia[^R]*R\$\s*([\d.,]+)/i,
        /El[ée]tric[ao][^R]*R\$\s*([\d.,]+)/i,
        /Consumo.*?R\$\s*([\d.,]+)/i,
    ];
    for (const pattern of energyPatterns) {
        const match = text.match(pattern);
        if (match) {
            energyCost5y = extractMoney(match[1]);
            if (energyCost5y > 0) break;
        }
    }

    // Consumíveis (5 anos)
    let consumablesCost5y = 0;
    const consumablesPatterns = [
        /Consum[ií]veis[^R]*R\$\s*([\d.,]+)/i,
        /Filtros?[^R]*R\$\s*([\d.,]+)/i,
    ];
    for (const pattern of consumablesPatterns) {
        const match = text.match(pattern);
        if (match) {
            consumablesCost5y = extractMoney(match[1]);
            if (consumablesCost5y > 0) break;
        }
    }

    // Manutenção (5 anos)
    let maintenanceCost5y = 0;
    const maintenancePatterns = [
        /Manuten[çc][ãa]o[^R]*R\$\s*([\d.,]+)/i,
        /Reparos?[^R]*R\$\s*([\d.,]+)/i,
    ];
    for (const pattern of maintenancePatterns) {
        const match = text.match(pattern);
        if (match) {
            maintenanceCost5y = extractMoney(match[1]);
            if (maintenanceCost5y > 0) break;
        }
    }

    // Valor Residual
    let residualValue5y = 0;
    const residualPatterns = [
        /Residual[^R]*R\$\s*([\d.,]+)/i,
        /Revenda[^R]*R\$\s*([\d.,]+)/i,
    ];
    for (const pattern of residualPatterns) {
        const match = text.match(pattern);
        if (match) {
            residualValue5y = extractMoney(match[1]);
            if (residualValue5y > 0) break;
        }
    }

    // TCO Total
    let totalTco5y = 0;
    const tcoPatterns = [
        /TCO[^R]*R\$\s*([\d.,]+)/i,
        /Custo\s+Total[^R]*R\$\s*([\d.,]+)/i,
        /Total\s+Real[^R]*R\$\s*([\d.,]+)/i,
    ];
    for (const pattern of tcoPatterns) {
        const match = text.match(pattern);
        if (match) {
            totalTco5y = extractMoney(match[1]);
            if (totalTco5y > 0) break;
        }
    }

    // Se não encontrou TCO, calcula
    if (totalTco5y === 0) {
        totalTco5y = acquisitionCost + energyCost5y + consumablesCost5y + maintenanceCost5y - residualValue5y;
    }

    // ─── 3. Extrair breakdown de consumíveis ────────────────────────────────────
    const consumablesBreakdown: SimpleParsedReport['consumablesBreakdown'] = [];

    // Busca itens de consumíveis com preço
    const consumableItemPatterns = [
        /(?:filtro|escova|saco|mop|refil|pano)[^R\n]*R\$\s*([\d.,]+)/gi,
    ];

    for (const pattern of consumableItemPatterns) {
        let match;
        while ((match = pattern.exec(text)) !== null) {
            const fullMatch = match[0].toLowerCase();
            let itemName = 'Consumível';

            if (fullMatch.includes('filtro')) itemName = 'Filtro HEPA';
            else if (fullMatch.includes('escova lateral')) itemName = 'Escova Lateral';
            else if (fullMatch.includes('escova central')) itemName = 'Escova Central';
            else if (fullMatch.includes('escova')) itemName = 'Escova';
            else if (fullMatch.includes('saco')) itemName = 'Saco de Pó';
            else if (fullMatch.includes('mop') || fullMatch.includes('pano')) itemName = 'Mop/Pano';
            else if (fullMatch.includes('refil')) itemName = 'Refil';

            const unitPrice = extractMoney(match[1]);
            if (unitPrice > 0 && unitPrice < 500) {  // Sanidade: consumíveis < R$ 500
                consumablesBreakdown.push({
                    item: itemName,
                    unitPrice,
                    frequencyMonths: 6,  // Default: 6 meses
                    annualCost: unitPrice * 2,  // 2x por ano
                });
            }
        }
    }

    // ─── 4. Extrair breakdown de manutenção ─────────────────────────────────────
    const maintenanceBreakdown: SimpleParsedReport['maintenanceBreakdown'] = [];

    const maintenanceItemPatterns = [
        /(?:bateria|motor|lidar|placa|sensor)[^R\n]*R\$\s*([\d.,]+)/gi,
    ];

    for (const pattern of maintenanceItemPatterns) {
        let match;
        while ((match = pattern.exec(text)) !== null) {
            const fullMatch = match[0].toLowerCase();
            let componentName = 'Componente';

            if (fullMatch.includes('bateria')) componentName = 'Bateria';
            else if (fullMatch.includes('motor')) componentName = 'Motor';
            else if (fullMatch.includes('lidar')) componentName = 'Sensor LiDAR';
            else if (fullMatch.includes('placa')) componentName = 'Placa Eletrônica';
            else if (fullMatch.includes('sensor')) componentName = 'Sensor';

            const estimatedCost = extractMoney(match[1]);
            if (estimatedCost > 0 && estimatedCost < 2000) {  // Sanidade: peças < R$ 2000
                maintenanceBreakdown.push({
                    component: componentName,
                    estimatedCost,
                    probability5y: 0.20,  // Default: 20% de chance em 5 anos
                });
            }
        }
    }

    // ─── 5. Vida útil ───────────────────────────────────────────────────────────
    let lifespan = 5;  // Default
    const lifespanMatch = text.match(/vida\s+[úu]til[^\d]*(\d+)\s*anos?/i);
    if (lifespanMatch) {
        lifespan = parseInt(lifespanMatch[1]);
    }

    // ─── 6. Categoria ───────────────────────────────────────────────────────────
    let category = 'eletrodomestico';
    if (/rob[ôo].*?aspira/i.test(text)) category = 'robo-aspirador';
    else if (/geladeira|refrigerador/i.test(text)) category = 'geladeira';
    else if (/lavadora|lava.*?roupa/i.test(text)) category = 'lavadora';
    else if (/ar.*?condicionado|split/i.test(text)) category = 'ar-condicionado';
    else if (/tv|televis/i.test(text)) category = 'tv';

    return {
        productName,
        category,
        acquisitionCost,
        energyCost5y,
        consumablesCost5y,
        maintenanceCost5y,
        residualValue5y,
        totalTco5y,
        consumablesBreakdown,
        maintenanceBreakdown,
        lifespan,
        dataConfidence: 0.75,
    };
}

/**
 * Detecta se a entrada é JSON ou Markdown.
 */
export function isJsonInput(input: string): boolean {
    const trimmed = input.trim();
    return trimmed.startsWith('{') || trimmed.startsWith('[');
}
