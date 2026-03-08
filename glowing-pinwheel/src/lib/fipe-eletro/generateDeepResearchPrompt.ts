/**
 * =============================================================================
 * FIPE-Eletro: Gerador de Prompts para Deep Research
 * =============================================================================
 *
 * Gera prompts técnicos estruturados para extração de dados "ocultos"
 * via Gemini Deep Research. Foco em informações que NÃO estão na embalagem.
 */

import type { FipeEletroCategory } from '@/types/fipe-eletro';
import { getPromptContextForCategory, getExpectedLifespanForCategory, getDeltaRateForCategory } from './familyDefaults';

/**
 * Metadados específicos por categoria que enriquecem o prompt.
 */
const CATEGORY_CONTEXT: Record<string, {
  typicalFailures: string[];
  commonConsumables: string[];
  energyTestFocus: string;
  depreciationNotes: string;
}> = {
  // ─── Refrigeração ──────────────────────────────────────────────────────────
  'geladeira-frost-free': {
    typicalFailures: ['placa inversora', 'compressor', 'termostato', 'motor do ventilador'],
    commonConsumables: ['filtro de água interno', 'borracha de vedação (gaxeta)', 'lâmpada interna LED'],
    energyTestFocus: 'ciclos de degelo e frequência de abertura de porta',
    depreciationNotes: 'geladeiras Frost Free depreciam ~12% ao ano; modelos Inverse têm melhor retenção'
  },
  'geladeira-inverse': {
    typicalFailures: ['placa inversora', 'compressor inverter', 'sensor de temperatura'],
    commonConsumables: ['filtro de água', 'borracha de vedação'],
    energyTestFocus: 'eficiência do compressor inverter em carga parcial',
    depreciationNotes: 'modelos Inverse premium retêm 15-20% mais valor que convencionais'
  },
  'freezer-horizontal': {
    typicalFailures: ['termostato', 'compressor', 'vedação da tampa'],
    commonConsumables: ['borracha de vedação'],
    energyTestFocus: 'consumo em temperatura ambiente elevada (>30°C)',
    depreciationNotes: 'freezers comerciais depreciam mais lentamente que residenciais'
  },

  // ─── Lavanderia ────────────────────────────────────────────────────────────
  'lavadora-front-load': {
    typicalFailures: ['rolamento do tambor', 'bomba de drenagem', 'placa eletrônica', 'amortecedores'],
    commonConsumables: ['filtro de fiapos', 'borracha do mangote', 'limpador de tambor'],
    energyTestFocus: 'consumo real por ciclo vs etiqueta (incluir água quente se aplicável)',
    depreciationNotes: 'lavadoras front-load sofrem alta depreciação nos primeiros 2 anos (~25%)'
  },
  'lavadora-top-load': {
    typicalFailures: ['correia de transmissão', 'capacitor do motor', 'placa de controle', 'agitador'],
    commonConsumables: ['filtro de fiapos', 'mangueira de entrada'],
    energyTestFocus: 'consumo por kg de roupa e eficiência de centrifugação',
    depreciationNotes: 'modelos mecânicos retêm mais valor que eletrônicos por menor custo de reparo'
  },
  'lava-seca': {
    typicalFailures: ['resistência de secagem', 'sensor de umidade', 'bomba de drenagem', 'correia'],
    commonConsumables: ['filtro de fiapos do secador', 'limpador de tambor', 'borracha de vedação'],
    energyTestFocus: 'consumo do ciclo de secagem vs lavagem isolada',
    depreciationNotes: 'lava-secas depreciam rapidamente devido à complexidade mecânica'
  },

  // ─── Climatização ──────────────────────────────────────────────────────────
  'split-hi-wall-inverter': {
    typicalFailures: ['placa da condensadora', 'placa da evaporadora', 'sensor de temperatura', 'motor do fan'],
    commonConsumables: ['filtro de ar (lavável)', 'gás refrigerante (recarga)', 'hélice do ventilador'],
    energyTestFocus: 'SEER/SCOP real vs nominal, consumo em carga parcial (30-50%)',
    depreciationNotes: 'custo de instalação/desinstalação (R$300-600) afeta liquidez no mercado de usados'
  },
  'split-hi-wall-on-off': {
    typicalFailures: ['capacitor', 'compressor', 'placa eletrônica', 'motor do ventilador'],
    commonConsumables: ['filtro de ar', 'gás refrigerante'],
    energyTestFocus: 'consumo em partidas frequentes (ligar/desligar)',
    depreciationNotes: 'obsolescência tecnológica vs Inverter: K_tech = 0.75-0.85'
  },
  'ar-portatil': {
    typicalFailures: ['compressor', 'ventilador', 'placa de controle'],
    commonConsumables: ['filtro de ar', 'mangueira de exaustão'],
    energyTestFocus: 'eficiência real considerando ar quente na sala',
    depreciationNotes: 'alta depreciação (~20% ao ano) por ruído e ineficiência percebida'
  },

  // ─── Cocção ────────────────────────────────────────────────────────────────
  'cooktop-inducao': {
    typicalFailures: ['bobina de indução', 'placa de controle', 'ventilador de resfriamento'],
    commonConsumables: ['raspador de vidro', 'produto de limpeza específico'],
    energyTestFocus: 'eficiência de conversão (energia elétrica → calor na panela)',
    depreciationNotes: 'vidro trincado = depreciação catastrófica; modelos intactos retêm bem o valor'
  },
  'air-fryer': {
    typicalFailures: ['resistência de aquecimento', 'ventoinha', 'painel de controle touch'],
    commonConsumables: ['cesto antiaderente (substituição)', 'papel manteiga perfurado'],
    energyTestFocus: 'consumo médio por ciclo de 20-30 minutos',
    depreciationNotes: 'mercado de usados aquecido; depreciação ~15% ao ano'
  },

  // ─── Portáteis ─────────────────────────────────────────────────────────────
  'robo-aspirador': {
    typicalFailures: ['bateria de lítio', 'motor de sucção', 'sensores LiDAR/câmera', 'rodas/esteiras'],
    commonConsumables: ['escova lateral', 'escova central/rolo', 'filtro HEPA', 'mop descartável', 'saco de pó (se auto-esvaziamento)'],
    energyTestFocus: 'autonomia real vs especificada em diferentes pisos',
    depreciationNotes: 'obsolescência rápida por avanços em IA/navegação; bateria define vida útil'
  },
  'aspirador-vertical': {
    typicalFailures: ['bateria', 'motor', 'filtro entupido permanentemente'],
    commonConsumables: ['filtro HEPA', 'escova rotativa', 'bateria de reposição'],
    energyTestFocus: 'duração real da bateria em modo turbo vs eco',
    depreciationNotes: 'baterias não substituíveis pelo usuário aceleram depreciação'
  },
  'cafeteira-expresso': {
    typicalFailures: ['bomba de pressão', 'termobloco', 'válvula solenóide', 'moedor (se integrado)'],
    commonConsumables: ['descalcificante', 'filtro de água', 'anel de vedação do porta-filtro', 'cápsulas/grãos'],
    energyTestFocus: 'consumo em standby e tempo de aquecimento',
    depreciationNotes: 'marcas premium (Nespresso, DeLonghi) retêm mais valor'
  },

  // ─── Default para categorias não mapeadas ──────────────────────────────────
  'default': {
    typicalFailures: ['placa eletrônica', 'motor principal', 'componentes de desgaste mecânico'],
    commonConsumables: ['filtros', 'vedações', 'peças de desgaste'],
    energyTestFocus: 'consumo real em condições típicas de uso doméstico brasileiro',
    depreciationNotes: 'verificar histórico de preços em OLX, Mercado Livre e Facebook Marketplace'
  }
};

/**
 * Normaliza a categoria para encontrar o contexto mais adequado.
 * Primeiro busca contexto específico, depois fallback para família.
 */
function getCategoryContext(category: string) {
  const normalized = category.toLowerCase().replace(/\s+/g, '-');

  // Busca exata no contexto específico
  if (CATEGORY_CONTEXT[normalized]) {
    return CATEGORY_CONTEXT[normalized];
  }

  // Busca parcial no contexto específico
  for (const key of Object.keys(CATEGORY_CONTEXT)) {
    if (key !== 'default' && (normalized.includes(key) || key.includes(normalized))) {
      return CATEGORY_CONTEXT[key];
    }
  }

  // Fallback: usa os defaults da família (cobre todas as 53 categorias)
  try {
    return getPromptContextForCategory(normalized as FipeEletroCategory);
  } catch {
    // Se categoria inválida, usa default genérico
    return CATEGORY_CONTEXT['default'];
  }
}

/**
 * Retorna a vida útil esperada para uma categoria.
 * Primeiro tenta do familyDefaults, senão retorna 5 como fallback.
 */
function getExpectedLifespan(category: string): number {
  try {
    return getExpectedLifespanForCategory(category as FipeEletroCategory);
  } catch {
    return 5; // Fallback conservador
  }
}

/**
 * Retorna a taxa delta de depreciação para uma categoria.
 */
function getDeltaRate(category: string): number {
  try {
    return getDeltaRateForCategory(category as FipeEletroCategory);
  } catch {
    return 0.15; // Fallback: 15%
  }
}

/**
 * Gera um prompt técnico estruturado para Gemini Deep Research.
 *
 * Este prompt é otimizado para extrair dados "ocultos" que não aparecem
 * na embalagem do produto: consumo real, taxas de falha, custos de
 * manutenção e curvas de depreciação.
 *
 * @param productName - Nome completo do produto (ex: "Brastemp BRM44 Frost Free 375L")
 * @param category - Categoria do produto (ex: "geladeira-frost-free")
 * @returns Prompt formatado para colar no Gemini Deep Research
 *
 * @example
 * ```typescript
 * const prompt = generateDeepResearchPrompt(
 *   "Samsung Lava e Seca WD11M4453JW 11kg",
 *   "lava-seca"
 * );
 * // Cole o resultado no Gemini Deep Research
 * ```
 */
export function generateDeepResearchPrompt(
  productName: string,
  category: string
): string {
  const ctx = getCategoryContext(category);
  const today = new Date().toISOString().split('T')[0];

  return `
# 🔬 FIPE-Eletro Deep Research: Análise TCO

## Produto Alvo
**Nome:** ${productName}
**Categoria:** ${category}
**Data da Pesquisa:** ${today}

---

## 🎯 MISSÃO

Você é um analista de engenharia reversa especializado em eletrodomésticos. Sua tarefa é investigar os **custos ocultos** deste produto — informações que NÃO aparecem na caixa, manual ou site do fabricante.

O objetivo final é alimentar um modelo de TCO (Total Cost of Ownership) que calcula o custo REAL de possuir este equipamento por 5-10 anos.

---

### 0. PREÇO DE MERCADO ATUAL (OBRIGATÓRIO)
**Objetivo:** Encontrar o menor preço ATUAL (à vista) deste produto.

**Pesquise nos principais varejistas brasileiros:**
- Amazon BR
- Mercado Livre (vendedor oficial ou full)
- Magazine Luiza
- Casas Bahia / Ponto
- Fast Shop
- Americanas

**Retorne:**
- Menor preço encontrado (à vista, sem cashback)
- **Nome exato do varejista** com o menor preço (ex: "Amazon", "Mercado Livre", "Magazine Luiza")
- **URL DIRETA do produto** no site do varejista (não página de busca, mas link direto do produto)

**IMPORTANTE:** 
- Este valor é crítico para o cálculo do TCO
- A URL deve ser funcional e direta para a página do produto
- Se não encontrar o produto à venda, use o preço de lançamento ou MSRP

---

### 0.1. VIDA ÚTIL ESTIMADA (OBRIGATÓRIO)
**Objetivo:** Determinar a vida útil média esperada para esta CATEGORIA de produto.

**Investigue:**
- Dados de fabricantes sobre vida útil projetada
- Estudos de associações de consumidores (Proteste, Which?, Consumer Reports)
- Tempo médio até descarte em pesquisas de mercado
- Histórico de garantias estendidas (indicam expectativa de vida)

**Valores de referência por categoria:**
- Geladeiras/Freezers: 10-15 anos
- Lavadoras/Secadoras: 8-12 anos
- Ar Condicionado Split: 10-15 anos
- Robôs Aspiradores: 3-5 anos
- Air Fryers/Café: 4-7 anos

**Retorne:** O valor inteiro (em anos) no campo "estimated_lifespan_years".

---

### 0.2. CUSTOS DE AQUISIÇÃO (INSTALAÇÃO E FRETE)
**Objetivo:** Estimar custos adicionais além do preço do produto.

**Investigue:**
- **Custo de instalação profissional** (se aplicável):
  - Ar condicionado Split: R$ 300-600 (inclui tubulação básica)
  - Coifas/depuradores: R$ 150-300
  - Fogões com gás encanado: R$ 100-200
  - Lavadoras/lava-louças: R$ 80-150 (conexão hidráulica)
  - Plug and play (geladeiras, portáteis): R$ 0

- **Custo de frete estimado** para região Sudeste:
  - Linha branca grande: R$ 50-150
  - Portáteis/pequenos: R$ 20-50 ou grátis

**Retorne:** Valores nos campos "installationCost" e "shippingCost".

---

## 📋 INVESTIGAÇÕES REQUERIDAS

### 1. REALIDADE DE CONSUMO ENERGÉTICO
**Objetivo:** Descobrir o consumo REAL vs. o nominal da etiqueta INMETRO/Procel.

**Investigue:**
- Testes de laboratório independentes (Proteste, INMETRO real, reviews técnicos internacionais)
- Reviews de usuários que mediram consumo com wattímetro
- Variação de consumo em condições brasileiras: ${ctx.energyTestFocus}
- Fator de correção estimado (consumo real / consumo nominal)

**Exemplo de dado esperado:**
- Consumo nominal: 35 kWh/mês
- Consumo real medido: 42-48 kWh/mês (fator 1.2-1.4x)

**Retorne também:**
- Horas de uso diário típicas (24h para geladeiras, 4-8h para ACs, etc.)

---

### 1.1. CONSUMO DE ÁGUA (SE APLICÁVEL)
**Objetivo:** Para lavadoras, lava-louças e similares, estimar consumo de água.

**Investigue:**
- Litros por ciclo de lavagem (dado do INMETRO ou manual)
- Número médio de ciclos por mês para uma família de 4 pessoas
- Tarifa média de água + esgoto na sua região (R$/m³)

**Valores de referência:**
- Lavadora Front Load: 40-60L/ciclo, ~16 ciclos/mês
- Lavadora Top Load: 80-150L/ciclo, ~16 ciclos/mês
- Lava-Louças: 10-15L/ciclo, ~15-20 ciclos/mês

**Retorne:** Valores nos campos "waterConsumption".

---

### 1.2. CONSUMO DE GÁS (SE APLICÁVEL)
**Objetivo:** Para fogões, fornos e aquecedores, estimar consumo de gás.

**Investigue:**
- Tipo de gás: GLP (botijão 13kg) ou GN (gás natural encanado)
- Consumo mensal médio (kg/mês para GLP ou m³/mês para GN)
- Preço atual do gás na região

**Valores de referência:**
- Família de 4 pessoas com fogão 4 bocas: ~1 botijão 13kg a cada 45-60 dias
- Consumo médio: 0.25-0.35 kg/dia

**Retorne:** Valores nos campos "gasConsumption".

---

### 2. ENGENHARIA REVERSA DE MANUTENÇÃO
**Objetivo:** Identificar os componentes que mais falham e quanto custa repará-los.

**Componentes típicos desta categoria:**
${ctx.typicalFailures.map((f, i) => `${i + 1}. ${f}`).join('\n')}

**Para CADA componente, busque:**
- Taxa de falha estimada (% de unidades que falham em 5/7/10 anos)
- Preço da peça no Mercado Livre / AliExpress
- Preço da peça em assistência autorizada
- Custo médio de mão de obra para substituição (R$/hora técnico)
- Tempo médio de reparo (horas)

**Busque em:**
- Fóruns de técnicos (Clube do Técnico, iFixit Brasil)
- Reclamações no Reclame Aqui sobre defeitos
- Vídeos de reparo no YouTube (para estimar complexidade)
- Lojas de peças de reposição online

---

### 3. CUSTO DE CONSUMÍVEIS
**Objetivo:** Mapear todos os itens de reposição periódica e seu custo anual.

**Consumíveis típicos desta categoria:**
${ctx.commonConsumables.map((c, i) => `${i + 1}. ${c}`).join('\n')}

**Para CADA consumível, identifique:**
- Preço médio (original vs. compatível)
- Frequência de troca recomendada (meses ou ciclos de uso)
- Custo anual projetado (preço × frequência)

**Calcule:**
- Custo total anual de consumíveis para uso moderado
- Custo total anual de consumíveis para uso intenso (família grande)

---

### 4. DEPRECIAÇÃO DE MERCADO
**Objetivo:** Estimar a curva de desvalorização real do produto.

**Nota sobre esta categoria:** ${ctx.depreciationNotes}

**Investigue preços de usados em:**
- Mercado Livre (filtrar por "usado")
- OLX
- Facebook Marketplace
- Enjoei (para portáteis)

**Colete dados para:**
- Preço médio com 0-1 ano de uso (quase novo)
- Preço médio com 2 anos de uso
- Preço médio com 4 anos de uso
- Preço médio com 6+ anos de uso (se disponível)

**Calcule:**
- Taxa de depreciação anual (δ) usando: V(t) = V₀ × e^(-δt)
- Fator K_marca comparativo (este modelo vs. concorrentes)

---

## 📊 FORMATO DE SAÍDA OBRIGATÓRIO

Retorne sua pesquisa **EXCLUSIVAMENTE** no formato JSON abaixo. Não inclua texto adicional fora do JSON.

\`\`\`json
{
  "metadata": {
    "productName": "${productName}",
    "category": "${category}",
    "researchDate": "${today}",
    "dataConfidence": 0.0,
    "sourcesConsulted": [],
    "estimated_lifespan_years": 5
  },

  "market_price_brl": {
    "lowestPrice": null,
    "retailer": "",
    "productUrl": "",
    "priceDate": "${today}",
    "installationCost": null,
    "shippingCost": null,
    "best_retailer_name": "",
    "best_offer_url": "",
    "notes": ""
  },

  "energyConsumption": {
    "nominalKwhMonth": null,
    "realKwhMonth": null,
    "correctionFactor": null,
    "dailyUsageHours": null,
    "testConditions": "",
    "sources": []
  },

  "waterConsumption": {
    "litersPerCycle": null,
    "cyclesPerMonth": null,
    "waterTariffPerCubicMeter": 12.50,
    "notes": ""
  },

  "gasConsumption": {
    "gasType": "GLP",
    "monthlyConsumptionKg": null,
    "currentGasPrice": 110,
    "notes": ""
  },

  "maintenanceProfile": {
    "failureCurve": [
      { "year": 1, "probability": null },
      { "year": 2, "probability": null },
      { "year": 3, "probability": null },
      { "year": 5, "probability": null },
      { "year": 7, "probability": null },
      { "year": 10, "probability": null }
    ],
    "commonFailures": [
      {
        "component": "",
        "failureRate5Years": null,
        "partCostMarketplace": null,
        "partCostAuthorized": null,
        "laborCost": null,
        "repairTimeHours": null
      }
    ],
    "repairabilityIndex": null,
    "repairabilityNotes": ""
  },

  "consumables": {
    "items": [
      {
        "name": "",
        "type": "",
        "unitPriceOriginal": null,
        "unitPriceCompatible": null,
        "replacementFrequencyMonths": null,
        "replacementFrequencyCycles": null,
        "annualCost": null
      }
    ],
    "totalAnnualCostModerate": null,
    "totalAnnualCostIntense": null
  },

  "depreciation": {
    "priceHistory": [
      { "ageYears": 0, "averagePrice": null, "sampleSize": null },
      { "ageYears": 1, "averagePrice": null, "sampleSize": null },
      { "ageYears": 2, "averagePrice": null, "sampleSize": null },
      { "ageYears": 4, "averagePrice": null, "sampleSize": null },
      { "ageYears": 6, "averagePrice": null, "sampleSize": null }
    ],
    "calculatedDeltaRate": null,
    "kBrandFactor": null,
    "kTechFactor": null,
    "marketLiquidityNotes": ""
  },

  "additionalInsights": {
    "commonUserComplaints": [],
    "hiddenCosts": [],
    "buyingRecommendations": []
  }
}
\`\`\`

---

## ⚠️ INSTRUÇÕES CRÍTICAS

1. **PRIORIZE DADOS BRASILEIROS** - Preços em R$, contexto de uso brasileiro, tarifas de energia locais.

2. **CITE SUAS FONTES** - Inclua URLs ou nomes de publicações no array "sources" de cada seção.

3. **USE "null" PARA DADOS NÃO ENCONTRADOS** - Não invente números. É melhor ter null do que um dado falso.

4. **dataConfidence** - Avalie de 0.0 a 1.0 a confiança geral nos dados coletados:
   - 0.0-0.3: Poucos dados, muitas estimativas
   - 0.4-0.6: Dados parciais, algumas fontes confiáveis
   - 0.7-0.9: Dados robustos de múltiplas fontes
   - 1.0: Dados verificados em laboratório

5. **FOQUE NO OCULTO** - O cliente já tem os dados da etiqueta. Queremos o que NÃO está lá.

---

## 🚀 COMECE SUA INVESTIGAÇÃO

Lembre-se: você está construindo inteligência de mercado. Quanto mais preciso, mais valioso o índice FIPE-Eletro será para os consumidores brasileiros tomarem decisões financeiramente racionais.
`.trim();
}

/**
 * Gera prompt simplificado para pesquisa rápida (menos detalhado).
 */
export function generateQuickResearchPrompt(
  productName: string,
  category: string
): string {
  const today = new Date().toISOString().split('T')[0];

  return `
Pesquise dados de TCO para: **${productName}** (${category})

Retorne em JSON:
\`\`\`json
{
  "realKwhMonth": null,
  "top3Failures": [{ "part": "", "cost": null }],
  "annualConsumablesCost": null,
  "usedPrice2Years": null,
  "usedPrice4Years": null,
  "repairabilityScore": null
}
\`\`\`

Priorize dados brasileiros (R$). Data: ${today}
`.trim();
}

export default generateDeepResearchPrompt;
