/**
 * =============================================================================
 * FIPE-Eletro: Parser de Relatórios Markdown
 * =============================================================================
 *
 * Extrai dados estruturados de relatórios narrativos do Gemini Deep Research.
 * O parser usa regex e heurísticas para identificar valores-chave.
 */

import type { FipeEletroCategory } from '@/types/fipe-eletro';

/**
 * Dados extraídos do relatório markdown.
 */
export interface ParsedReportData {
    metadata: {
        productName: string;
        category: string;
        dataConfidence: number;
        estimated_lifespan_years: number;
        researchDate: string;
    };
    market_price_brl: {
        lowestPrice: number | null;
        retailer: string;
        productUrl: string;
        installationCost: number;
        shippingCost: number;
        best_retailer_name: string;
        best_offer_url: string;
    };
    energyConsumption: {
        nominalKwhMonth: number | null;
        realKwhMonth: number | null;
        correctionFactor: number | null;
        dailyUsageHours: number | null;
    };
    waterConsumption: {
        litersPerCycle: number | null;
        cyclesPerMonth: number | null;
        waterTariffPerCubicMeter: number;
    };
    gasConsumption: {
        gasType: string;
        monthlyConsumptionKg: number | null;
        currentGasPrice: number;
    };
    maintenanceProfile: {
        commonFailures: Array<{
            component: string;
            partCostMarketplace: number | null;
            laborCost: number | null;
        }>;
        totalMaintenanceCost5Years: number | null;
    };
    consumables: {
        totalAnnualCostModerate: number | null;
        items: Array<{
            name: string;
            unitPriceOriginal: number | null;
            replacementFrequencyMonths: number | null;
        }>;
    };
    depreciation: {
        calculatedDeltaRate: number | null;
        kBrandFactor: number | null;
        priceHistory: Array<{
            ageYears: number;
            averagePrice: number | null;
        }>;
    };
    tcoSummary: {
        acquisitionCost: number | null;
        energyCost5Years: number | null;
        consumablesCost5Years: number | null;
        maintenanceCost5Years: number | null;
        residualValue: number | null;
        tcoTotal: number | null;
    };
}

/**
 * Extrai um número de uma string (remove R$, pontos, vírgulas).
 */
function extractNumber(text: string): number | null {
    if (!text) return null;
    // Remove R$, espaços, e converte vírgula para ponto
    const cleaned = text
        .replace(/R\$\s*/gi, '')
        .replace(/\./g, '')        // Remove ponto de milhar
        .replace(',', '.')         // Converte vírgula decimal para ponto
        .replace(/[^\d.-]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
}

/**
 * Extrai número que pode usar ponto OU vírgula como decimal.
 * Exemplo: 4.0 ou 4,0 → 4.0
 */
function extractDecimalNumber(text: string): number | null {
    if (!text) return null;
    // Substitui vírgula por ponto e limpa
    const cleaned = text
        .replace(',', '.')
        .replace(/[^\d.]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
}

/**
 * Busca um padrão no texto e retorna o primeiro grupo capturado.
 */
function findPattern(text: string, pattern: RegExp): string | null {
    const match = text.match(pattern);
    return match ? match[1] : null;
}

/**
 * Busca todos os valores monetários após um termo específico.
 */
function findAllMoneyAfter(text: string, term: string): number[] {
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(escapedTerm + '[^R]*R\\$\\s*([\\d.,]+)', 'gi');
    const matches = [...text.matchAll(pattern)];
    return matches.map(m => extractNumber(m[1]) || 0).filter(n => n > 0);
}

/**
 * Extrai dados da tabela TCO do relatório.
 * A tabela tem formato:
 * | Categoria | Detalhe | Custo | % |
 * |-----------|---------|-------|---|
 * | Aquisição | ... | R$ 2.500,00 | 46% |
 */
function parseTcoTable(text: string): ParsedReportData['tcoSummary'] {
    const result: ParsedReportData['tcoSummary'] = {
        acquisitionCost: null,
        energyCost5Years: null,
        consumablesCost5Years: null,
        maintenanceCost5Years: null,
        residualValue: null,
        tcoTotal: null,
    };

    // ─── Extração da Tabela TCO ─────────────────────────────────────────────────
    // Padrões que capturam valores após termos específicos na tabela
    const tablePatterns = [
        // Aquisição (CAPEX)
        {
            key: 'acquisitionCost', patterns: [
                /Aquisição[^\r\n|]*\|[^\r\n|]*\|[^\r\n]*R\$\s*([\d.,]+)/i,
                /Aquisição.*?R\$\s*([\d.,]+)/i,
                /CAPEX.*?R\$\s*([\d.,]+)/i,
            ]
        },
        // Energia
        {
            key: 'energyCost5Years', patterns: [
                /Energia[^\r\n|]*\|[^\r\n|]*\|[^\r\n]*R\$\s*([\d.,]+)/i,
                /Energia.*?OPEX.*?R\$\s*([\d.,]+)/i,
                /Energia\s*\([^)]*\).*?R\$\s*([\d.,]+)/i,
            ]
        },
        // Consumíveis
        {
            key: 'consumablesCost5Years', patterns: [
                /Consumíveis[^\r\n|]*\|[^\r\n|]*\|[^\r\n]*R\$\s*([\d.,]+)/i,
                /Consumíveis.*?R\$\s*([\d.,]+)/i,
            ]
        },
        // Manutenção
        {
            key: 'maintenanceCost5Years', patterns: [
                /Manutenção[^\r\n|]*\|[^\r\n|]*\|[^\r\n]*R\$\s*([\d.,]+)/i,
                /Manutenção\s*Corretiva.*?R\$\s*([\d.,]+)/i,
                /Manutenção.*?R\$\s*([\d.,]+)/i,
            ]
        },
        // Residual
        {
            key: 'residualValue', patterns: [
                /Residual[^\r\n|]*\|[^\r\n|]*\|[^\r\n]*\(R\$\s*([\d.,]+)\)/i,
                /Valor\s*Residual.*?R\$\s*([\d.,]+)/i,
            ]
        },
        // TCO Total
        {
            key: 'tcoTotal', patterns: [
                /TCO\s*(?:FINAL|REAL)[^\r\n|]*\|[^\r\n|]*\|[^\r\n]*R\$\s*([\d.,]+)/i,
                /TCO\s*(?:FINAL|REAL|NOMINAL).*?R\$\s*([\d.,]+)/i,
            ]
        },
    ];

    for (const { key, patterns } of tablePatterns) {
        for (const pattern of patterns) {
            const match = findPattern(text, pattern);
            if (match) {
                const value = extractNumber(match);
                if (value && value > 0) {
                    result[key as keyof typeof result] = value;
                    break;
                }
            }
        }
    }

    return result;
}

/**
 * Extrai dados de depreciação do relatório.
 */
function parseDepreciation(text: string): ParsedReportData['depreciation'] {
    const result: ParsedReportData['depreciation'] = {
        calculatedDeltaRate: null,
        kBrandFactor: null,
        priceHistory: [],
    };

    // Taxa de depreciação (25%, 30%, etc.)
    const deltaPatterns = [
        /taxa\s*de\s*depreciação.*?(\d+(?:[.,]\d+)?)\s*%/i,
        /depreciação.*?(\d+(?:[.,]\d+)?)\s*%\s*(?:ao\s*ano|a\.a\.)/i,
        /deprecia\s*(?:cerca\s*de\s*)?(\d+(?:[.,]\d+)?)\s*%/i,
    ];

    for (const pattern of deltaPatterns) {
        const match = text.match(pattern);
        if (match) {
            result.calculatedDeltaRate = parseFloat(match[1].replace(',', '.')) / 100;
            break;
        }
    }

    // Valores por ano
    const pricePatterns = [
        { pattern: /Valor\s*Novo.*?R\$\s*([\d.,]+)/i, year: 0 },
        { pattern: /Ano\s*0.*?R\$\s*([\d.,]+)/i, year: 0 },
        { pattern: /Ano\s*1.*?R\$\s*([\d.,]+)/i, year: 1 },
        { pattern: /Ano\s*2.*?R\$\s*([\d.,]+)/i, year: 2 },
        { pattern: /Ano\s*4.*?R\$\s*([\d.,]+)/i, year: 4 },
        { pattern: /Sucata.*?R\$\s*([\d.,]+)/i, year: 5 },
    ];

    for (const { pattern, year } of pricePatterns) {
        const priceStr = findPattern(text, pattern);
        if (priceStr) {
            result.priceHistory.push({
                ageYears: year,
                averagePrice: extractNumber(priceStr),
            });
        }
    }

    return result;
}

/**
 * Extrai componentes de manutenção do relatório.
 */
function parseMaintenanceComponents(text: string): ParsedReportData['maintenanceProfile'] {
    const components: Array<{
        component: string;
        partCostMarketplace: number | null;
        laborCost: number | null;
    }> = [];

    // Padrões para extrair custos de manutenção
    // Exemplo no relatório: "bateria original ou de primeira linha custa entre R$ 499,00 e R$ 550,00"
    const componentPatterns = [
        {
            name: 'Bateria',
            patterns: [
                /bateria.*?R\$\s*([\d.,]+)(?:\s*(?:a|e)\s*R\$\s*([\d.,]+))?/gi,
                /bateria.*?(?:custo|custa|preço).*?R\$\s*([\d.,]+)/gi,
            ]
        },
        {
            name: 'Sensor LiDAR',
            patterns: [
                /(?:lidar|lds|sensor.*?laser).*?R\$\s*([\d.,]+)/gi,
                /peça.*?completa.*?R\$\s*([\d.,]+)/gi,
            ]
        },
        {
            name: 'Roda/Motor',
            patterns: [
                /roda.*?R\$\s*([\d.,]+)/gi,
                /motor.*?roda.*?R\$\s*([\d.,]+)/gi,
            ]
        },
    ];

    for (const { name, patterns } of componentPatterns) {
        let maxCost = 0;
        for (const pattern of patterns) {
            const matches = [...text.matchAll(pattern)];
            for (const match of matches) {
                // Pega o segundo valor se houver intervalo (ex: R$ 499 e R$ 550 → pega 550)
                const cost1 = extractNumber(match[1]) || 0;
                const cost2 = match[2] ? extractNumber(match[2]) || 0 : 0;
                const cost = Math.max(cost1, cost2);
                if (cost > maxCost) maxCost = cost;
            }
        }
        if (maxCost > 0) {
            components.push({
                component: name,
                partCostMarketplace: maxCost,
                laborCost: 150,
            });
        }
    }

    // Tenta extrair custo total de manutenção da tabela
    // Exemplo: "Manutenção Corretiva | 1 Bateria + 1 LiDAR | R$ 900,00"
    let totalMaintenanceCost5Years: number | null = null;
    const maintenanceTableMatch = text.match(/Manutenção.*?R\$\s*([\d.,]+)/i);
    if (maintenanceTableMatch) {
        totalMaintenanceCost5Years = extractNumber(maintenanceTableMatch[1]);
    }

    return { commonFailures: components, totalMaintenanceCost5Years };
}

/**
 * Extrai consumíveis do relatório.
 */
function parseConsumables(text: string): ParsedReportData['consumables'] {
    const items: Array<{
        name: string;
        unitPriceOriginal: number | null;
        replacementFrequencyMonths: number | null;
    }> = [];

    // Busca custo total anual de consumíveis PRIMEIRO
    // Exemplo: "R$ 250,00 a R$ 300,00 anuais" ou "R$ 250,00 e R$ 300,00 anuais"
    let totalAnnualCostModerate: number | null = null;

    const annualPatterns = [
        // "deve orçar entre R$ 250,00 e R$ 300,00 anuais"
        /orçar.*?(?:entre\s*)?R\$\s*([\d.,]+)(?:\s*(?:a|e)\s*R\$\s*([\d.,]+))?\s*anua/i,
        // "R$ 250,00 e R$ 300,00 anuais" ou "R$ 250,00 a R$ 300,00 anuais"
        /R\$\s*([\d.,]+)(?:\s*(?:a|e)\s*R\$\s*([\d.,]+))?\s*anua/i,
        // "consumíveis...R$ 250,00 anuais"
        /(?:consumíveis|custo.*?anual)[^R]*?R\$\s*([\d.,]+)(?:\s*(?:a|e)\s*R\$\s*([\d.,]+))?\s*anua/i,
        // "R$ 250,00 por ano"
        /R\$\s*([\d.,]+)(?:\s*(?:a|e)\s*R\$\s*([\d.,]+))?\s*(?:por\s*ano)/i,
    ];

    for (const pattern of annualPatterns) {
        const match = text.match(pattern);
        if (match) {
            const cost1 = extractNumber(match[1]) || 0;
            const cost2 = match[2] ? extractNumber(match[2]) || 0 : cost1;
            totalAnnualCostModerate = Math.max(cost1, cost2);
            break;
        }
    }

    // Se não encontrou, busca na tabela TCO
    if (!totalAnnualCostModerate) {
        const tableMatch = text.match(/Consumíveis[^\r\n|]*\|[^\r\n|]*\|[^\r\n]*R\$\s*([\d.,]+)/i);
        if (tableMatch) {
            const tableCost = extractNumber(tableMatch[1]);
            if (tableCost) {
                // Divide por 5 anos para obter custo anual
                totalAnnualCostModerate = tableCost / 5;
            }
        }
    }

    // Fallback: soma custos da tabela diretamente
    if (!totalAnnualCostModerate) {
        // Busca padrão "R$ X.XXX" na linha de consumíveis da tabela
        const fallbackMatch = text.match(/Consumíveis.*?R\$\s*([\d.,]+)/i);
        if (fallbackMatch) {
            const cost = extractNumber(fallbackMatch[1]);
            if (cost && cost > 100) {
                totalAnnualCostModerate = cost / 5; // Assumindo 5 anos
            }
        }
    }

    // Busca itens individuais de consumíveis
    const consumablePatterns = [
        { name: 'Sacos de Pó', patterns: [/saco.*?R\$\s*([\d.,]+)/i, /kit.*?saco.*?R\$\s*([\d.,]+)/i], months: 2 },
        { name: 'Filtro HEPA', patterns: [/filtro.*?hepa.*?R\$\s*([\d.,]+)/i, /filtro.*?R\$\s*([\d.,]+)/i], months: 4 },
        { name: 'Escova Lateral', patterns: [/escova\s*lateral.*?R\$\s*([\d.,]+)/i], months: 4 },
        { name: 'Escova Central', patterns: [/escova\s*central.*?R\$\s*([\d.,]+)/i, /rolo.*?R\$\s*([\d.,]+)/i], months: 9 },
        { name: 'Mop/Pano', patterns: [/mop.*?R\$\s*([\d.,]+)/i, /pano.*?R\$\s*([\d.,]+)/i], months: 4 },
    ];

    for (const { name, patterns, months } of consumablePatterns) {
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                items.push({
                    name,
                    unitPriceOriginal: extractNumber(match[1]),
                    replacementFrequencyMonths: months,
                });
                break;
            }
        }
    }

    return { items, totalAnnualCostModerate };
}

/**
 * Parser principal: converte relatório Markdown em dados estruturados.
 */
export function parseMarkdownReport(markdown: string): ParsedReportData {
    const text = markdown;

    // ─── Metadata ────────────────────────────────────────────────────────────────
    const productNameMatch = text.match(/(?:Análise|Relatório).*?:\s*(.+?)(?:\n|$)/i);
    const productName = productNameMatch ? productNameMatch[1].trim() : 'Produto Desconhecido';

    // Vida útil
    const lifespanMatch = text.match(/(?:vida útil|estimated_lifespan|lifespan).*?(\d+)\s*(?:anos|years)/i);
    const estimated_lifespan_years = lifespanMatch ? parseInt(lifespanMatch[1]) : 5;

    // ─── Preço de Aquisição ──────────────────────────────────────────────────────
    const pricePatterns = [
        /Menor\s*Preço.*?R\$\s*([\d.,]+)/i,
        /Preço.*?Vista.*?R\$\s*([\d.,]+)/i,
        /lowestPrice.*?R\$\s*([\d.,]+)/i,
    ];

    let lowestPrice: number | null = null;
    for (const pattern of pricePatterns) {
        const match = findPattern(text, pattern);
        if (match) {
            lowestPrice = extractNumber(match);
            if (lowestPrice && lowestPrice > 100) break;
        }
    }

    // Varejista
    const retailerMatch = text.match(/(?:Varejista|Loja).*?:\s*(.+?)(?:\n|\.)/i);
    const retailer = retailerMatch ? retailerMatch[1].trim() : 'Mercado Livre';

    // URL
    const urlMatch = text.match(/(https?:\/\/[^\s\)]+)/);
    const productUrl = urlMatch ? urlMatch[1] : '';

    // ─── Energia ─────────────────────────────────────────────────────────────────
    // Padrões melhorados para capturar formatos como:
    // "consumo mensal total estimado entre 4.0 kWh e 5.0 kWh"
    // "4.0 kWh a 5.0 kWh"
    const energyPatterns = [
        /consumo.*?(?:mensal|total)[^0-9]*(\d+(?:[.,]\d+)?)\s*(?:kWh)?(?:\s*(?:a|e)\s*)?(\d+(?:[.,]\d+)?)?\s*kWh/i,
        /entre\s*(\d+(?:[.,]\d+)?)\s*(?:kWh)?(?:\s*(?:a|e)\s*)?(\d+(?:[.,]\d+)?)\s*kWh/i,
        /(\d+(?:[.,]\d+)?)\s*(?:a|e)\s*(\d+(?:[.,]\d+)?)\s*kWh/i,
        /(\d+(?:[.,]\d+)?)\s*kWh.*?(?:mês|mensal)/i,
    ];

    let nominalKwhMonth: number | null = null;
    let realKwhMonth: number | null = null;

    for (const pattern of energyPatterns) {
        const match = text.match(pattern);
        if (match) {
            nominalKwhMonth = extractDecimalNumber(match[1]);
            realKwhMonth = match[2] ? extractDecimalNumber(match[2]) : (nominalKwhMonth ? nominalKwhMonth * 1.1 : null);
            if (nominalKwhMonth && nominalKwhMonth > 0) break;
        }
    }

    // Custo mensal de energia como fallback
    // Exemplo: "Custo Mensal Estimado: R$ 4,50"
    if (!nominalKwhMonth) {
        const energyCostPatterns = [
            /Custo\s*Mensal.*?R\$\s*([\d.,]+)/i,
            /R\$\s*([\d.,]+).*?(?:por\s*)?mês/i,
        ];
        for (const pattern of energyCostPatterns) {
            const match = text.match(pattern);
            if (match) {
                const monthlyCost = extractNumber(match[1]);
                if (monthlyCost && monthlyCost > 0 && monthlyCost < 100) {
                    // Estima kWh baseado em R$ 0.90/kWh
                    realKwhMonth = monthlyCost / 0.90;
                    nominalKwhMonth = realKwhMonth / 1.1;
                    break;
                }
            }
        }
    }

    // ─── Parse sub-seções ────────────────────────────────────────────────────────
    const maintenanceData = parseMaintenanceComponents(text);
    const consumablesData = parseConsumables(text);
    const tcoData = parseTcoTable(text);

    // ─── Usar dados da tabela TCO se disponíveis ─────────────────────────────────
    // A tabela TCO é a fonte MAIS CONFIÁVEL pois contém os valores finais calculados
    // Prioridade: tcoData > consumablesData (fallback)
    if (tcoData.consumablesCost5Years && tcoData.consumablesCost5Years > 0) {
        // Tabela TCO tem o valor de 5 anos - converter para anual
        consumablesData.totalAnnualCostModerate = tcoData.consumablesCost5Years / 5;
    }

    // Sobrescrever manutenção também se tcoData tiver valor
    if (tcoData.maintenanceCost5Years && tcoData.maintenanceCost5Years > 0) {
        maintenanceData.totalMaintenanceCost5Years = tcoData.maintenanceCost5Years;
    }

    // ─── Construção do Resultado ─────────────────────────────────────────────────
    const result: ParsedReportData = {
        metadata: {
            productName,
            category: 'robo-aspirador' as string,
            dataConfidence: 0.75,
            estimated_lifespan_years,
            researchDate: new Date().toISOString().split('T')[0],
        },
        market_price_brl: {
            lowestPrice,
            retailer,
            productUrl,
            installationCost: 0,
            shippingCost: 0,
            best_retailer_name: retailer,
            best_offer_url: productUrl,
        },
        energyConsumption: {
            nominalKwhMonth,
            realKwhMonth,
            correctionFactor: realKwhMonth && nominalKwhMonth ? realKwhMonth / nominalKwhMonth : 1.1,
            dailyUsageHours: 1,
        },
        waterConsumption: {
            litersPerCycle: null,
            cyclesPerMonth: null,
            waterTariffPerCubicMeter: 12.5,
        },
        gasConsumption: {
            gasType: 'N/A',
            monthlyConsumptionKg: null,
            currentGasPrice: 110,
        },
        maintenanceProfile: maintenanceData,
        consumables: consumablesData,
        depreciation: parseDepreciation(text),
        tcoSummary: tcoData,
    };

    // ─── Inferir categoria do produto ────────────────────────────────────────────
    const categoryPatterns: Array<{ pattern: RegExp; category: FipeEletroCategory }> = [
        { pattern: /rob[ôo].*?aspira/i, category: 'robo-aspirador' },
        { pattern: /geladeira|refrigerador/i, category: 'geladeira' },
        { pattern: /lava.*?seca/i, category: 'lava-seca' },
        { pattern: /lavadora|máquina.*?lavar/i, category: 'lavadora-roupas' },
        { pattern: /ar.*?condicionado|split/i, category: 'ar-condicionado' },
        { pattern: /tv|televisor|smart\s*tv/i, category: 'tv' },
        { pattern: /smartphone|celular/i, category: 'smartphone' },
        { pattern: /notebook|laptop/i, category: 'notebook' },
        { pattern: /gpu|placa.*?v[ií]deo/i, category: 'gpu' },
        { pattern: /ssd|disco.*?s[oó]lido/i, category: 'ssd' },
        { pattern: /soundbar/i, category: 'soundbar' },
        { pattern: /air\s*fryer|fritadeira/i, category: 'air-fryer' },
        { pattern: /cafeteira.*?espresso/i, category: 'cafeteira-espresso' },
    ];

    for (const { pattern, category } of categoryPatterns) {
        if (pattern.test(text)) {
            result.metadata.category = category;
            break;
        }
    }

    return result;
}

/**
 * Detecta se o input é JSON ou Markdown.
 */
export function detectInputFormat(input: string): 'json' | 'markdown' {
    const trimmed = input.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        try {
            JSON.parse(trimmed);
            return 'json';
        } catch {
            // Não é JSON válido, trata como markdown
        }
    }
    return 'markdown';
}

/**
 * Converte ParsedReportData para o formato esperado pelo simulador (ParsedResearchData).
 */
export function convertReportToResearchData(report: ParsedReportData): Record<string, unknown> {
    // Calcula custos de manutenção a partir dos componentes se não tiver da tabela
    let maintenanceCost = report.maintenanceProfile.totalMaintenanceCost5Years || 0;
    if (!maintenanceCost) {
        maintenanceCost = report.maintenanceProfile.commonFailures.reduce(
            (sum, f) => sum + (f.partCostMarketplace || 0) + (f.laborCost || 0),
            0
        );
    }

    // Calcula custo de consumíveis em 5 anos
    const consumablesCost5Years = (report.consumables.totalAnnualCostModerate || 0) * 5;

    return {
        metadata: {
            productName: report.metadata.productName,
            category: report.metadata.category,
            dataConfidence: report.metadata.dataConfidence,
            estimated_lifespan_years: report.metadata.estimated_lifespan_years,
        },
        market_price_brl: {
            lowestPrice: report.market_price_brl.lowestPrice,
            retailer: report.market_price_brl.retailer,
            productUrl: report.market_price_brl.productUrl,
            installationCost: report.market_price_brl.installationCost,
            shippingCost: report.market_price_brl.shippingCost,
            best_retailer_name: report.market_price_brl.best_retailer_name,
            best_offer_url: report.market_price_brl.best_offer_url,
        },
        energyConsumption: {
            nominalKwhMonth: report.energyConsumption.nominalKwhMonth,
            realKwhMonth: report.energyConsumption.realKwhMonth,
            correctionFactor: report.energyConsumption.correctionFactor,
            dailyUsageHours: report.energyConsumption.dailyUsageHours,
        },
        waterConsumption: report.waterConsumption,
        gasConsumption: report.gasConsumption,
        maintenanceProfile: {
            commonFailures: report.maintenanceProfile.commonFailures.map(f => ({
                component: f.component,
                partCostMarketplace: f.partCostMarketplace,
                laborCost: f.laborCost,
                failureRate5Years: 0.2,
            })),
            estimatedTotal5Years: maintenanceCost,
        },
        consumables: {
            items: report.consumables.items.map(i => ({
                name: i.name,
                unitPriceOriginal: i.unitPriceOriginal,
                replacementFrequencyMonths: i.replacementFrequencyMonths,
            })),
            totalAnnualCostModerate: report.consumables.totalAnnualCostModerate,
            total5Years: consumablesCost5Years,
        },
        depreciation: {
            priceHistory: report.depreciation.priceHistory,
            calculatedDeltaRate: report.depreciation.calculatedDeltaRate,
            kBrandFactor: report.depreciation.kBrandFactor,
        },
        tcoSummary: report.tcoSummary,
    };
}

export default parseMarkdownReport;
