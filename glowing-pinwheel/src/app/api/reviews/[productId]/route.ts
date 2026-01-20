import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getCategoryById } from '@/config/categories';

// ============================================
// API ROUTE: Unified Voice Pipeline (Projeto Voz Unificada)
// ============================================
// GET /api/reviews/[productId] - Returns structured verdict data
// The AI is INVISIBLE - returns pure structured JSON for visual components

// Simple in-memory cache for development (replace with Prisma in production)
const reviewCache = new Map<string, { data: unknown; timestamp: number }>();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

// ============================================
// UNIFIED VOICE PROMPT - Base Template
// ============================================
const UNIFIED_VOICE_PROMPT_BASE = `
# Role
Você é o Editor Chefe Técnico do ComparaTop. Sua função é analisar Specs + Reviews e preencher os campos de veredicto de forma direta, crítica e humana.

# Regras de Ouro
1. NÃO escreva textos longos ou genéricos. Seja cirúrgico.
2. O "unified_score" deve ser a ÚNICA nota do produto - use EXATAMENTE esse valor em todos os textos.
3. Preencha os "radar_tooltips" com justificativas curtas para cada nota.
4. Use APENAS dados reais de fontes verificáveis.
5. Seja honesto sobre pontos fracos - o usuário precisa confiar.
6. CRÍTICO: Quando mencionar a nota em qualquer texto, use EXATAMENTE o valor de unified_score.
`;

// ============================================
// CATEGORY-SPECIFIC SCHEMAS
// ============================================

// TV Schema - Gaming, Imagem, Som, etc.
const TV_SCHEMA = `
# JSON OUTPUT SCHEMA (Strict - retorne APENAS este JSON, sem markdown)
{
  "unified_score": (Number 0-10, ex: 8.8),
  "verdict_card": {
    "headline": "(String, max 60 chars. Ex: 'A OLED Definitiva para Gamers PS5')",
    "target_audience": "(String, max 40 chars. Ex: 'Ideal para salas escuras e cinema')",
    "dealbreaker": "(String, max 50 chars. Ex: 'Evite se sua sala tem janelas de frente')"
  },
  "curiosity_sandwich": {
    "icon": "(String emoji, ex: '📊' ou '🎯' ou '💡')",
    "text": "(String, max 200 chars. Insight sobre o produto usando EXATAMENTE o unified_score)"
  },
  "pros_cons": {
    "pros": ["(max 5 palavras)", "(max 5 palavras)", "(max 5 palavras)"],
    "cons": ["(max 5 palavras)", "(max 5 palavras)", "(max 5 palavras)"]
  },
  "radar_tooltips": {
    "custo_beneficio": "(max 15 palavras - justificativa da nota c1)",
    "processamento": "(max 15 palavras - nota c2 processador/upscaling)",
    "confiabilidade": "(max 15 palavras - nota c3 durabilidade/garantia)",
    "sistema": "(max 15 palavras - nota c4 Tizen/webOS/Google TV)",
    "gaming": "(max 15 palavras - nota c5 input lag, VRR, HDMI 2.1)",
    "brilho": "(max 15 palavras - nota c6 nits, HDR, anti-reflexo)",
    "pos_venda": "(max 15 palavras - nota c7 suporte técnico no Brasil)",
    "som": "(max 15 palavras - nota c8 potência, Dolby Atmos)",
    "conectividade": "(max 15 palavras - nota c9 portas HDMI, WiFi)",
    "design": "(max 15 palavras - nota c10 acabamento, bordas)"
  },
  "dimension_scores": {
    "custo_beneficio": (Number 0-10),
    "processamento": (Number 0-10),
    "confiabilidade": (Number 0-10),
    "sistema": (Number 0-10),
    "gaming": (Number 0-10),
    "brilho": (Number 0-10),
    "pos_venda": (Number 0-10),
    "som": (Number 0-10),
    "conectividade": (Number 0-10),
    "design": (Number 0-10)
  },
  "community_consensus": {
    "approval_percentage": (Number 0-100, porcentagem de reviews 4-5 estrelas na Amazon BR e Mercado Livre),
    "total_reviews": "(String formatada, ex: '5.8k', '2.3k', '890')",
    "star_rating": (Number 1.0-5.0, média de estrelas dos compradores),
    "sources": ["Amazon BR", "Mercado Livre"]
  }
}
`;

// Fridge Schema - Eficiência, Capacidade, Ruído, etc.
const FRIDGE_SCHEMA = `
# JSON OUTPUT SCHEMA (Strict - retorne APENAS este JSON, sem markdown)
{
  "unified_score": (Number 0-10, ex: 8.5),
  "verdict_card": {
    "headline": "(String, max 60 chars. Ex: 'A Geladeira Mais Silenciosa do Mercado')",
    "target_audience": "(String, max 40 chars. Ex: 'Ideal para famílias de 4+ pessoas')",
    "dealbreaker": "(String, max 50 chars. Ex: 'Evite se espaço na cozinha é limitado')"
  },
  "curiosity_sandwich": {
    "icon": "(String emoji, ex: '❄️' ou '⚡' ou '🔇')",
    "text": "(String, max 200 chars. Insight sobre o produto usando EXATAMENTE o unified_score)"
  },
  "pros_cons": {
    "pros": ["(max 5 palavras)", "(max 5 palavras)", "(max 5 palavras)"],
    "cons": ["(max 5 palavras)", "(max 5 palavras)", "(max 5 palavras)"]
  },
  "radar_tooltips": {
    "custo_beneficio": "(max 15 palavras - nota c1 preço vs recursos)",
    "eficiencia_energetica": "(max 15 palavras - nota c2 selo Procel, kWh/mês)",
    "capacidade": "(max 15 palavras - nota c3 litros, organização interna)",
    "refrigeracao": "(max 15 palavras - nota c4 frost free, inverter)",
    "confiabilidade": "(max 15 palavras - nota c5 compressor, histórico marca)",
    "ruido": "(max 15 palavras - nota c6 decibéis, funcionamento silencioso)",
    "pos_venda": "(max 15 palavras - nota c7 assistência técnica Brasil)",
    "recursos_smart": "(max 15 palavras - nota c8 WiFi, painel digital)",
    "design": "(max 15 palavras - nota c9 acabamento, cor, estilo)",
    "funcionalidades": "(max 15 palavras - nota c10 dispenser, gavetas especiais)"
  },
  "dimension_scores": {
    "custo_beneficio": (Number 0-10),
    "eficiencia_energetica": (Number 0-10),
    "capacidade": (Number 0-10),
    "refrigeracao": (Number 0-10),
    "confiabilidade": (Number 0-10),
    "ruido": (Number 0-10),
    "pos_venda": (Number 0-10),
    "recursos_smart": (Number 0-10),
    "design": (Number 0-10),
    "funcionalidades": (Number 0-10)
  },
  "community_consensus": {
    "approval_percentage": (Number 0-100, porcentagem de reviews 4-5 estrelas na Amazon BR e Mercado Livre),
    "total_reviews": "(String formatada, ex: '5.8k', '2.3k', '890')",
    "star_rating": (Number 1.0-5.0, média de estrelas dos compradores),
    "sources": ["Amazon BR", "Mercado Livre"]
  }
}
`;

// Air Conditioner Schema - BTU, Silêncio, Inverter, etc.
const AC_SCHEMA = `
# JSON OUTPUT SCHEMA (Strict - retorne APENAS este JSON, sem markdown)
{
  "unified_score": (Number 0-10, ex: 8.7),
  "verdict_card": {
    "headline": "(String, max 60 chars. Ex: 'O Mais Silencioso da Categoria')",
    "target_audience": "(String, max 40 chars. Ex: 'Ideal para quartos e home office')",
    "dealbreaker": "(String, max 50 chars. Ex: 'Evite se não tem instalação elétrica 220V')"
  },
  "curiosity_sandwich": {
    "icon": "(String emoji, ex: '❄️' ou '🔇' ou '⚡')",
    "text": "(String, max 200 chars. Insight sobre o produto usando EXATAMENTE o unified_score)"
  },
  "pros_cons": {
    "pros": ["(max 5 palavras)", "(max 5 palavras)", "(max 5 palavras)"],
    "cons": ["(max 5 palavras)", "(max 5 palavras)", "(max 5 palavras)"]
  },
  "radar_tooltips": {
    "custo_beneficio": "(max 15 palavras - nota c1 preço vs eficiência)",
    "eficiencia": "(max 15 palavras - nota c2 selo Procel, economia)",
    "capacidade_btu": "(max 15 palavras - nota c3 BTUs, potência refrigeração)",
    "durabilidade": "(max 15 palavras - nota c4 compressor, vida útil)",
    "silencio": "(max 15 palavras - nota c5 decibéis modo sleep)",
    "inverter": "(max 15 palavras - nota c6 tecnologia compressor)",
    "pos_venda": "(max 15 palavras - nota c7 assistência técnica Brasil)",
    "filtros": "(max 15 palavras - nota c8 antibacteriano, qualidade ar)",
    "conectividade": "(max 15 palavras - nota c9 WiFi, controle app)",
    "design": "(max 15 palavras - nota c10 aparência, tamanho)"
  },
  "dimension_scores": {
    "custo_beneficio": (Number 0-10),
    "eficiencia": (Number 0-10),
    "capacidade_btu": (Number 0-10),
    "durabilidade": (Number 0-10),
    "silencio": (Number 0-10),
    "inverter": (Number 0-10),
    "pos_venda": (Number 0-10),
    "filtros": (Number 0-10),
    "conectividade": (Number 0-10),
    "design": (Number 0-10)
  },
  "community_consensus": {
    "approval_percentage": (Number 0-100, porcentagem de reviews 4-5 estrelas na Amazon BR e Mercado Livre),
    "total_reviews": "(String formatada, ex: '5.8k', '2.3k', '890')",
    "star_rating": (Number 1.0-5.0, média de estrelas dos compradores),
    "sources": ["Amazon BR", "Mercado Livre"]
  }
}
`;

// Robot Vacuum Schema - PARR-BR (Practical Robot Rating - Brasil)
const ROBOT_VACUUM_SCHEMA = `
# JSON OUTPUT SCHEMA (Strict - retorne APENAS este JSON, sem markdown)
{
  "unified_score": (Number 0-10, ex: 5.9),
  "verdict_card": {
    "headline": "(String, max 60 chars. Ex: 'Entrada Básica para Automação Residencial')",
    "target_audience": "(String, max 40 chars. Ex: 'Ideal para apartamentos pequenos e pisos frios')",
    "dealbreaker": "(String, max 50 chars. Ex: 'Evite se tem casa grande ou muitos móveis baixos')"
  },
  "curiosity_sandwich": {
    "icon": "(String emoji, ex: '🤖' ou '🗺️' ou '🧹')",
    "text": "(String, max 200 chars. Insight sobre o produto usando EXATAMENTE o unified_score)"
  },
  "pros_cons": {
    "pros": ["(max 5 palavras)", "(max 5 palavras)", "(max 5 palavras)"],
    "cons": ["(max 5 palavras)", "(max 5 palavras)", "(max 5 palavras)"]
  },
  "radar_tooltips": {
    "navegacao": "(max 15 palavras - nota c1 tipo navegação: LiDAR/VSLAM/aleatória, mapeamento)",
    "app_voz": "(max 15 palavras - nota c2 app proprietário, Alexa/Google, estabilidade)",
    "mop": "(max 15 palavras - nota c3 mop ativo/passivo, controle de água)",
    "escovas": "(max 15 palavras - nota c4 borracha/cerdas, anti-emaranhamento pets)",
    "altura": "(max 15 palavras - nota c5 altura em cm, passa sob móveis baixos)",
    "pecas": "(max 15 palavras - nota c6 disponibilidade peças no Brasil, marca nacional)",
    "bateria": "(max 15 palavras - nota c7 autonomia minutos, recharge & resume)",
    "ruido": "(max 15 palavras - nota c8 decibéis, motor brushless)",
    "base": "(max 15 palavras - nota c9 auto-esvaziamento, lavagem mop, secagem)",
    "ia": "(max 15 palavras - nota c10 detecção obstáculos, câmera frontal, IA)"
  },
  "dimension_scores": {
    "navegacao": (Number 0-10),
    "app_voz": (Number 0-10),
    "mop": (Number 0-10),
    "escovas": (Number 0-10),
    "altura": (Number 0-10),
    "pecas": (Number 0-10),
    "bateria": (Number 0-10),
    "ruido": (Number 0-10),
    "base": (Number 0-10),
    "ia": (Number 0-10)
  },
  "community_consensus": {
    "approval_percentage": (Number 0-100, porcentagem de reviews 4-5 estrelas na Amazon BR e Mercado Livre),
    "total_reviews": "(String formatada, ex: '5.8k', '2.3k', '890')",
    "star_rating": (Number 1.0-5.0, média de estrelas dos compradores),
    "sources": ["Amazon BR", "Mercado Livre"]
  }
}
`;

// Schema selector by category
const CATEGORY_SCHEMAS: Record<string, string> = {
  tv: TV_SCHEMA,
  fridge: FRIDGE_SCHEMA,
  air_conditioner: AC_SCHEMA,
  'robot-vacuum': ROBOT_VACUUM_SCHEMA,
};

// ============================================
// SOURCE PROTOCOL - Consenso 360º
// ============================================
const SOURCE_PROTOCOL: Record<string, string> = {
  tv: `
FONTES PARA ANÁLISE (TVs):
- RTINGS.com: medições de contraste, brilho HDR, input lag
- YouTube Brasil: Tecnoblog, Canaltech, TecMundo, Adrenaline
- Reclame Aqui: nota da marca nos últimos 12 meses
- Reddit r/brtvgaming: testes de VRR, 120Hz
`,
  fridge: `
FONTES PARA ANÁLISE (Geladeiras):
- Selo Procel e consumo kWh/mês
- Reclame Aqui: problemas com compressor, vedação, ruído
- YouTube Brasil: Zoom, Compara Aí, TechTudo
- Especificações do fabricante: capacidade real, dimensões
`,
  air_conditioner: `
FONTES PARA ANÁLISE (Ar Condicionado):
- Selo Procel, BTUs, ruído em dB
- Reclame Aqui: problemas com instalação e suporte
- YouTube Brasil: reviews de técnicos de refrigeração
- Especificações: consumo W, voltagem, dimensões
`,
  'robot-vacuum': `
FONTES PARA ANÁLISE (Robôs Aspiradores - PARR-BR):
- YouTube Brasil: Daniel Cube, Sala Tech, Jacquin Robô Aspirador
- Reddit r/RobotVacuums: problemas de mapeamento, peeling de borracha
- Reclame Aqui: suporte de marca, disponibilidade de peças
- Amazon BR reviews: problemas com app, WiFi, navegação
- Especificações: tipo navegação (LiDAR/VSLAM/aleatória), mop (ativo/passivo), altura cm
- CRITÉRIOS PARR-BR: Navegação 25%, App/Voz 15%, Mop 15%, Escovas 10%, Altura 10%, Peças 8%, Bateria 5%, Ruído 5%, Base 5%, IA 2%
`,
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const forceUpdate = request.nextUrl.searchParams.get('force') === 'true';

  // Check cache first
  const cached = reviewCache.get(productId);
  const cacheAge = cached ? Date.now() - cached.timestamp : Infinity;
  const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

  if (cached && cacheAge < CACHE_TTL && !forceUpdate) {
    return NextResponse.json({
      productId,
      ...cached.data as object,
      metadata: {
        fromCache: true,
        latencyMs: 1,
      },
    });
  }

  // Determine category from productId pattern
  // Note: Order matters - check more specific patterns first
  let categoryId = 'tv'; // Default

  // FRIDGE detection - includes brand names commonly used in product IDs
  const fridgePatterns = [
    'geladeira', 'fridge', 'refrigerador',
    'brastemp', 'consul', 'panasonic-bb', 'samsung-rf', 'samsung-rt',
    'electrolux-if', 'electrolux-df', 'electrolux-db', // Electrolux fridge models
    'hq-', // HQ compact fridges
    'frost-free', 'inverse'
  ];

  // AC detection - includes brand patterns for air conditioners
  const acPatterns = [
    'ar-condicionado', 'split', 'windfree', 'btu',
    'dual-inverter', 'lg-dual', 'samsung-wind', 'electrolux-eco'
  ];

  // Robot Vacuum detection - PARR-BR category
  const robotVacuumPatterns = [
    'robot', 'robo', 'aspirador-robo', 'robot-vacuum',
    'wap-robot', 'xiaomi-mi', 'roborock', 'roomba', 'ecovacs',
    'dreame', 'neato', 'eufy', 'ilife', 'w400', 'w300'
  ];

  // Check fridge patterns first (more specific)
  if (fridgePatterns.some(pattern => productId.includes(pattern))) {
    categoryId = 'fridge';
  }
  // Then check AC patterns
  else if (acPatterns.some(pattern => productId.includes(pattern))) {
    categoryId = 'air_conditioner';
  }
  // Then check robot vacuum patterns
  else if (robotVacuumPatterns.some(pattern => productId.toLowerCase().includes(pattern))) {
    categoryId = 'robot-vacuum';
  }
  // Default: TV (for samsung-qn, lg-c3, tcl-c735, etc.)

  // Get category info
  const category = getCategoryById(categoryId);
  const categoryName = category?.name || 'Produto';

  // Get source protocol
  const sourceProtocol = SOURCE_PROTOCOL[categoryId] || SOURCE_PROTOCOL.tv;

  // Generate new review using Gemini
  try {
    const startTime = Date.now();

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 4096,
      },
    });

    // Get category-specific schema
    const categorySchema = CATEGORY_SCHEMAS[categoryId] || CATEGORY_SCHEMAS.tv;

    const prompt = `${UNIFIED_VOICE_PROMPT_BASE}

${categorySchema}

═══════════════════════════════════════════════════
PRODUTO A ANALISAR: ${productId}
CATEGORIA: ${categoryName}
═══════════════════════════════════════════════════
${sourceProtocol}

INSTRUÇÕES FINAIS:
- Retorne APENAS o JSON válido, sem explicações
- unified_score deve refletir a média ponderada das 10 dimensões
- Seja específico e honesto nas justificativas`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text().trim();

    // Clean markdown if present
    if (text.startsWith('```')) {
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    }

    const reviewData = JSON.parse(text);
    const latency = Date.now() - startTime;

    // Cache the result
    reviewCache.set(productId, {
      data: reviewData,
      timestamp: Date.now(),
    });

    return NextResponse.json({
      productId,
      categoryId,
      ...reviewData,
      metadata: {
        fromCache: false,
        latencyMs: latency,
        tokensUsed: response.usageMetadata?.totalTokenCount,
        model: 'gemini-2.5-flash',
        protocol: 'unified-voice',
      },
    });

  } catch (error) {
    console.error('[API] Unified Voice generation failed:', error);

    // Fallback response with default values
    return NextResponse.json({
      productId,
      categoryId,
      unified_score: 7.5,
      verdict_card: {
        headline: 'Análise em Processamento',
        target_audience: 'Usuário geral',
        dealbreaker: 'Aguarde a análise completa',
      },
      pros_cons: {
        pros: ['Análise pendente', 'Aguarde', 'Em breve'],
        cons: ['Dados em geração', 'Tente novamente', 'Processando'],
      },
      radar_tooltips: {
        custo_beneficio: 'Análise em andamento',
        design: 'Análise em andamento',
        processamento: 'Análise em andamento',
        imagem: 'Análise em andamento',
        som: 'Análise em andamento',
        gaming: 'Análise em andamento',
        smart: 'Análise em andamento',
        conectividade: 'Análise em andamento',
        durabilidade: 'Análise em andamento',
        suporte: 'Análise em andamento',
      },
      dimension_scores: {
        custo_beneficio: 7,
        design: 7,
        processamento: 7,
        imagem: 7,
        som: 7,
        gaming: 7,
        smart: 7,
        conectividade: 7,
        durabilidade: 7,
        suporte: 7,
      },
      metadata: {
        fromCache: false,
        error: true,
        errorMessage: String(error),
      },
    }, { status: 200 });
  }
}
