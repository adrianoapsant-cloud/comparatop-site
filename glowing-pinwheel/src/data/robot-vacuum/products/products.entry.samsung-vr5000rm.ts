/**
 * Samsung POWERbot-E VR5000RM (VR05R5050WK/AZ)
 * Cadastrado: 30/01/2026
 * Fonte: samsung-vr5000rm-vr05r5050wk-az.product.ts (v2 - corrigido)
 */
import type { Product } from '@/types/category';

export const samsung_vr5000rm: Product = {
    // ===========================================================
    // 🏷️ Identificação
    // ===========================================================
    id: 'samsung-vr5000rm-vr05r5050wk-az',
    categoryId: 'robot-vacuum',
    name: 'Samsung Robô Aspirador 2 em 1 Preto VR5000RM (VR05R5050WK/AZ) — Aspira e Passa Pano, Wi-Fi SmartThings',
    shortName: 'Samsung VR5000RM',
    brand: 'Samsung',
    model: 'VR05R5050WK/AZ',

    // ===========================================================
    // 📸 Mídia (Magazine Luiza CDN - já permitido no next.config)
    // ===========================================================
    imageUrl: 'https://a-static.mlcdn.com.br/800x560/robo-aspirador-2-em-1-samsung-powerbot-e-vr5000rm-aspira-e-passa-pano-wi-fi-app-smart-things-preto-vr05r5050wk-az/kabum/369840/74029013cbd979bf9f8d959fbe22bd1b.jpeg',
    gallery: [
        'https://a-static.mlcdn.com.br/800x560/robo-aspirador-2-em-1-samsung-powerbot-e-vr5000rm-aspira-e-passa-pano-wi-fi-app-smart-things-preto-vr05r5050wk-az/kabum/369840/74029013cbd979bf9f8d959fbe22bd1b.jpeg',
        'https://a-static.mlcdn.com.br/800x560/robo-aspirador-2-em-1-samsung-powerbot-e-vr5000rm-aspira-e-passa-pano-wi-fi-app-smart-things-preto-vr05r5050wk-az/kabum/369840/4b5eccee284192652baf4cc2dfaa660e.jpeg',
        'https://a-static.mlcdn.com.br/800x560/robo-aspirador-2-em-1-samsung-powerbot-e-vr5000rm-aspira-e-passa-pano-wi-fi-app-smart-things-preto-vr05r5050wk-az/kabum/369840/4680f996471af7da03193bceed64a451.jpeg',
        'https://a-static.mlcdn.com.br/800x560/robo-aspirador-2-em-1-samsung-powerbot-e-vr5000rm-aspira-e-passa-pano-wi-fi-app-smart-things-preto-vr05r5050wk-az/kabum/369840/2eeff8f7f3a9dba2e309334f3cb4b183.jpeg',
        'https://a-static.mlcdn.com.br/800x560/robo-aspirador-2-em-1-samsung-powerbot-e-vr5000rm-aspira-e-passa-pano-wi-fi-app-smart-things-preto-vr05r5050wk-az/kabum/369840/c7d2ed0aed1aedcb3eb8a9625fe0a50a.jpeg',
    ],

    // ===========================================================
    // 💰 Preço
    // ===========================================================
    price: 1186.55,

    // ===========================================================
    // 📊 Status
    // ===========================================================
    lastUpdated: '2026-01-30',
    status: 'published',
    useSimplifiedPDP: true,
    manualUrl: 'https://www.samsung.com/br/support/model/VR05R5050WK/AZ/',

    // ===========================================================
    // 🎯 Confiança
    // ===========================================================
    evidenceLevel: 'high',
    contextualScoreRange: [6.0, 7.4] as [number, number],
    contextualScoreConfidence: 'medium',
    tcoTotalRange: [1900, 2600] as [number, number],
    tcoConfidence: 'medium',

    // ===========================================================
    // 📊 Scores PARR-BR (c1 a c10)
    // ===========================================================
    scores: {
        c1: 6.0,  // Navegação (Giroscópio, sem mapa)
        c2: 7.0,  // Software/App (SmartThings)
        c3: 4.5,  // Mop (pano arrastado, básico)
        c4: 6.0,  // Escovas
        c5: 8.8,  // Altura (8,5 cm ultrafino)
        c6: 7.0,  // Manutenção (filtro lavável)
        c7: 7.5,  // Bateria (150 min)
        c8: 6.5,  // Ruído (~70 dB)
        c9: 6.0,  // Dock/Base (padrão)
        c10: 2.0, // IA Obstáculos (sem IA)
    },
    scoreReasons: {
        c1: 'Giroscópio (Smart Sensing) cobre melhor que aleatório, mas não otimiza como LiDAR/vSLAM.',
        c2: 'SmartThings robusto para agendamento e controle remoto.',
        c3: 'Mop por arrasto serve para manutenção, não para manchas difíceis.',
        c4: 'Escova central + 2 laterais — adequadas para poeira fina.',
        c5: '8,5 cm ultrafino — entra em áreas baixas com facilidade.',
        c6: 'Filtro lavável reduz custo recorrente; exige esvaziar pó manualmente.',
        c7: 'Até 150 min em modo eco — bom para ambientes médios.',
        c8: '~70 dB perceptível em silêncio; adequado para uso diurno.',
        c9: 'Base padrão de carregamento, sem autoesvaziamento.',
        c10: 'Sem IA/3D; depende de sensores de colisão e antiqueda.',
    },

    // ===========================================================
    // 📋 Specs Técnicas
    // ===========================================================
    specs: {
        suctionPower: 55, // W (Pa não divulgado)
        batteryCapacity: 3400,
        dustbinCapacity: 200, // ml
        waterTankCapacity: 300, // ml estimado
        noiseLevel: 70,
        width: 340,
        height: 85,
        depth: 340,
        weight: 3.0,
        chargingTime: 4,
        runtime: 150,
    },

    // Structured specs for scoring module
    structuredSpecs: {
        navigationType: 'gyroscope',
        mopType: 'static',
        brushType: 'bristle',
        dockType: 'basic',
        obstacleDetection: 'bump-only',
        heightCm: 8.5,
        noiseDb: 70,
        batteryMah: 3400,
    },
    attributes: {
        priceRange: 'Budget',
        navigationType: 'gyroscope',
        moppingSystem: 'Pano arrastado (básico)',
        hasMapping: false,
        hasNoGoZones: false,
        hasAutoEmptyDock: false,
        batteryMinutes: 150,
        batteryMah: 3400,
        dustbinCapacityL: 0.2,
        waterTankCapacityL: 0.3,
        heightCm: 8.5,
        diameterCm: 34.0,
        weightKg: 3.0,
        noiseDb: 70,
        warrantyMonths: 12,
    },
    technicalSpecs: {
        // Limpeza
        suctionPower: '55W (Pa não divulgado)',
        dustbinCapacity: 200,
        waterTankCapacity: 300,
        mopType: 'Pano de arrasto (manutenção)',
        brushType: 'Escova central + 2 escovas laterais',
        filterType: 'Filtro lavável (pré-filtro + filtro)',
        // Navegação
        navigation: 'Giroscópio + sensores anticolisão/antiqueda',
        mapping: false,
        lidar: false,
        camera: false,
        obstacleDetection: 'Sensores anti-colisão + anti-queda',
        // Bateria
        runtime: 'Aprox. 150 minutos',
        batteryCapacity: 3400,
        chargingTime: 'Aprox. 240 minutos (4h)',
        autoRecharge: true,
        rechargeResume: false,
        // Conectividade
        wifi: true,
        appControl: true,
        voiceControl: 'Não informado',
        scheduling: true,
        multiFloorMapping: false,
        // Base
        dockType: 'basic',
        autoEmpty: false,
        autoMopWash: false,
        autoRefill: false,
        // Dimensões
        height: 8.5,
        diameter: 34.0,
        weight: 3.0,
        climbHeight: 1.3,
        noiseLevel: '~70 dB (estimativa)',
    },
    productDimensions: {
        diameter: 340,
        height: 85,
    },

    // ===========================================================
    // 🧬 Product DNA (10 dimensões radar chart)
    // ===========================================================
    productDna: {
        title: 'DNA do Samsung VR5000RM',
        subtitle: 'Ultrafino + SmartThings',
        dimensions: [
            { id: 'navigation', name: 'Navegação e Cobertura', shortName: 'Navegação', score: 6.0, weight: 0.25, icon: 'Map', color: '#3B82F6', description: 'Giroscópio, sem mapa' },
            { id: 'app', name: 'App e Automação', shortName: 'App', score: 7.0, weight: 0.15, icon: 'Smartphone', color: '#8B5CF6', description: 'SmartThings robusto' },
            { id: 'mopping', name: 'Mop (Passa Pano)', shortName: 'Mop', score: 4.5, weight: 0.15, icon: 'Droplets', color: '#06B6D4', description: 'Arrasto básico' },
            { id: 'suction', name: 'Escovas', shortName: 'Escovas', score: 6.0, weight: 0.10, icon: 'Wind', color: '#10B981', description: 'Central + 2 laterais' },
            { id: 'clearance', name: 'Passa Sob Móveis', shortName: 'Altura', score: 8.8, weight: 0.10, icon: 'MoveVertical', color: '#F59E0B', description: '≈8,5 cm ultrafino' },
            { id: 'parts', name: 'Manutenção', shortName: 'Peças', score: 7.0, weight: 0.08, icon: 'Settings', color: '#EF4444', description: 'Filtro lavável' },
            { id: 'battery', name: 'Autonomia', shortName: 'Bateria', score: 7.5, weight: 0.05, icon: 'BatteryFull', color: '#22C55E', description: 'Até 150 min' },
            { id: 'noise', name: 'Nível de Ruído', shortName: 'Ruído', score: 6.5, weight: 0.05, icon: 'Volume2', color: '#A855F7', description: '~70 dB perceptível' },
            { id: 'dock', name: 'Base de Carregamento', shortName: 'Base', score: 6.0, weight: 0.05, icon: 'Home', color: '#EC4899', description: 'Base padrão' },
            { id: 'obstacle', name: 'IA Obstáculos', shortName: 'IA', score: 2.0, weight: 0.02, icon: 'Eye', color: '#6366F1', description: 'Sem IA/3D' },
        ],
    },

    // ===========================================================
    // ⚖️ Veredito de Auditoria
    // ===========================================================
    auditVerdict: {
        solution: {
            title: 'A Solução',
            icon: 'CheckCircle',
            color: 'green',
            items: [
                'Perfil baixo (≈8,5 cm) — alcança pontos que muitos robôs não passam',
                'Controle via SmartThings + agendamento (bom para rotina)',
                'Filtro lavável: manutenção simples e menor custo recorrente',
                'Boa autonomia para a categoria sem base automática',
                'Suporte Samsung no Brasil (melhor que marcas importadas "sem peça")',
            ],
        },
        attentionPoint: {
            title: 'Ponto de Atenção',
            icon: 'AlertTriangle',
            color: 'amber',
            items: [
                'Sem mapeamento/no-go zones: pode perder tempo em áreas repetidas',
                'Mop por arrasto: serve para manutenção, não para manchas difíceis',
                'Desempenho em tapetes grossos é limitado',
                'Sem auto-esvaziamento: exige esvaziar reservatório com frequência',
            ],
        },
        technicalConclusion: {
            title: 'Conclusão Técnica',
            icon: 'FileText',
            color: 'blue',
            text: 'Robô "pé no chão": excelente em passar sob móveis e manter poeira sob controle com app/agenda. Em troca, abre mão de mapa, zonas proibidas e base automática — o que aumenta a necessidade de organização do ambiente.',
        },
        dontBuyIf: {
            title: 'Não Compre Se',
            icon: 'XCircle',
            color: 'red',
            items: [
                'Você exige mapeamento com seleção de cômodos e zonas proibidas',
                'Seu piso tem muitos tapetes altos ou desníveis frequentes',
                'Quer esfregar manchas (mop vibratório/pressão) ou base lava-mop',
                'Quer zero manutenção (autoesvaziamento + base completa)',
            ],
        },
    },

    // ===========================================================
    // ✨ Conteúdo Editorial
    // ===========================================================
    benefitSubtitle: 'Ultrafino (8,5 cm) + SmartThings — bom para manutenção diária, limitado por não ter mapeamento',
    featureBenefits: [
        { icon: 'Ruler', title: 'Navegação Giroscópica', description: 'Caminhos mais organizados que robôs aleatórios — porém sem mapa e sem zonas proibidas.' },
        { icon: 'Zap', title: 'Motor Digital Inverter', description: 'Força adequada para poeira diária e carpetes baixos (55W).' },
        { icon: 'Clock', title: 'Até 150 min', description: 'Autonomia acima da média em robôs sem base automática — bom para apartamentos e casas médias.' },
        { icon: 'Filter', title: 'Filtro Lavável', description: 'Reduz custo recorrente e facilita a manutenção semanal.' },
    ],

    // ===========================================================
    // 🏷️ Badges
    // ===========================================================
    badges: ['best-value'],

    // ===========================================================
    // 💰 Ofertas (2 lojas)
    // ===========================================================
    offers: [
        {
            store: 'Amazon',
            storeSlug: 'amazon',
            price: 1186.55,
            originalPrice: 1399,
            url: 'https://www.amazon.com.br/dp/B08NFN1C1C',
            affiliateUrl: 'https://www.amazon.com.br/dp/B08NFN1C1C?tag=aferio-20',
            inStock: true,
            lastChecked: '2026-01-30',
        },
        {
            store: 'Magazine Luiza',
            storeSlug: 'magalu',
            price: 2799.90,
            url: 'https://www.magazineluiza.com.br/robo-aspirador-2-em-1-samsung-powerbot-e-vr5000rm-aspira-e-passa-pano-wi-fi-app-smart-things-preto-vr05r5050wk-az/p/ajge874a1k/ep/eprb/',
            affiliateUrl: 'https://www.magazinevoce.com.br/magazineaferio/robo-aspirador-2-em-1-samsung-powerbot-e-vr5000rm-aspira-e-passa-pano-wi-fi-app-smart-things-preto-vr05r5050wk-az/p/ajge874a1k/ep/eprb/',
            inStock: false,
            lastChecked: '2026-01-30',
        },
        {
            store: 'Mercado Livre',
            storeSlug: 'mercado_livre',
            price: 1186.55,
            url: 'https://produto.mercadolivre.com.br/MLB-4166561074-samsung-powerbot-e-vr5000rm-potente-e-inteligente-aspirador-cor-preto-_JM',
            affiliateUrl: 'https://produto.mercadolivre.com.br/MLB-4166561074-samsung-powerbot-e-vr5000rm-potente-e-inteligente-aspirador-cor-preto-_JM',
            inStock: true,
            lastChecked: '2026-01-30',
        },
    ],

    // ===========================================================
    // ⚔️ Main Competitor (máx 3 keyDifferences)
    // ===========================================================
    mainCompetitor: {
        id: 'ezs-e10',
        name: 'EZS E10 (Laser iPath, 5.500 Pa)',
        shortName: 'EZS E10',
        imageUrl: '/images/products/ezs-e10.svg',
        price: 1599.98,
        score: 7.4,
        keyDifferences: [
            { label: 'Navegação/Mapa', current: 'Giroscópio (sem mapa)', rival: 'LiDAR com mapeamento', winner: 'rival' },
            { label: 'Altura', current: '≈8,5 cm (ultrafino)', rival: '≈9–10 cm', winner: 'current' },
            { label: 'Esfregão', current: 'Pano arrastado (básico)', rival: 'Mais controle/pressão', winner: 'rival' },
        ],
    },

    // ===========================================================
    // 🔧 Acessório Recomendado
    // ===========================================================
    recommendedAccessory: {
        asin: 'B0FXXLY8NW',
        name: 'Bateria de substituição 3400mAh compatível com Samsung PowerBot-E VR5000RM',
        shortName: 'Bateria 3400mAh VR5000RM',
        price: 329.99,
        imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_2X_920825-MLU77779627809_072024-F.webp',
        reason: 'A bateria é o componente limitante mais comum após 2–4 anos. Ter reposição estende a vida útil e melhora o TCO.',
        bundleMessage: 'Já inclua a bateria reserva e economize em frete depois',
        affiliateUrl: 'https://www.amazon.com.br/dp/B0FXXLY8NW?tag=aferio-20',
    },

    // ===========================================================
    // 👥 Voice of Customer
    // ===========================================================
    voc: {
        totalReviews: 369,
        averageRating: 4.0,
        consensusScore: 80,
        oneLiner: 'Bom para manutenção diária e para passar sob móveis; limitado por não ter mapeamento/no-go zones.',
        summary: 'Relatos enfatizam praticidade, perfil baixo e controle por app; críticas focam em ausência de mapa, navegação simples e desempenho do esfregão apenas para manutenção.',
        pros: [
            'Perfil ultrafino (≈8,5 cm) — alcança áreas sob móveis',
            'Controle via SmartThings + agendamento',
            'Filtro lavável e manutenção simples',
        ],
        cons: [
            'Sem mapeamento/no-go zones — depende mais de preparação do ambiente',
            'Mop por arrasto — não substitui esfregação pesada',
        ],
        sources: [
            { name: 'Amazon', url: 'https://www.amazon.com.br/dp/B08NFN1C1C', count: 369 },
        ],
    },

    // ===========================================================
    // 📊 Extended VOC
    // ===========================================================
    extendedVoc: {
        consensusScore: 80,
        totalReviews: '369 avaliações',
        acceptableFlaw: 'Ausência de mapeamento/no-go zones (exige organização do ambiente).',
        realWorldScenario: 'Melhor em apartamentos e casas com poucos obstáculos e tapetes baixos; ótimo para "poeira diária".',
        goldenTip: 'Para melhorar a eficiência: retire fios/cordões e eleve tapetes leves; isso reduz travamentos e melhora a cobertura.',
    },

    // ===========================================================
    // 💵 TCO Básico
    // ===========================================================
    tcoData: {
        purchasePrice: 1186.55,
        energyCost5y: 70,
        maintenanceCost5y: 850,
        totalCost5y: 2106.55,
        monthlyReserve: 35.11,
        lifespanYears: 5,
    },

    // ===========================================================
    // 📊 TCO Completo (extendedTco)
    // ===========================================================
    extendedTco: {
        purchasePrice: 1186.55,
        energyCost5y: 70,
        maintenanceCost5y: 850,
        totalCost5y: 2106.55,
        monthlyReserve: 35.11,
        lifespan: {
            years: 5,
            categoryAverage: 4.5,
            limitingComponent: 'Bateria Li-ion',
            limitingComponentLife: 3.5,
            weibullExplanation: 'Falhas crescem após 24–36 meses; bateria e módulos de tração tendem a limitar. Limpeza semanal de escovas/filtro aumenta a vida útil.',
        },
        repairability: {
            score: 6.5,
            level: 'Moderada',
            categoryAverage: 6.5,
            components: [
                { name: 'Bateria 3400mAh', score: 7, price: 330, availability: 'alta', failureSymptoms: ['Autonomia caiu', 'Não carrega completamente'], repairAdvice: 'Substituir quando autonomia cair para menos de 60 min.' },
                { name: 'Filtro + escovas (kit)', score: 8, price: 180, availability: 'alta', failureSymptoms: ['Queda de sucção', 'Ruído e vibração'], repairAdvice: 'Substituir a cada 12 meses de uso regular.' },
                { name: 'Roda/módulo de tração', score: 6, price: 240, availability: 'média', failureSymptoms: ['Travando', 'Erro de movimento'], repairAdvice: 'Limpar regularmente. Troca pode exigir assistência.' },
                { name: 'Motor de sucção', score: 6, price: 320, availability: 'média', failureSymptoms: ['Sucção fraca', 'Cheiro de queimado'], repairAdvice: 'Defeito raro. Verificar obstruções antes de trocar.' },
                { name: 'Placa principal', score: 4, price: 650, availability: 'baixa', failureSymptoms: ['Não liga', 'Desconecta do Wi-Fi'], repairAdvice: 'Verificar com assistência Samsung antes de trocar.' },
            ],
        },
    },

    // ===========================================================
    // 🎮 Simuladores
    // ===========================================================
    simulators: {
        sizeAlert: {
            status: 'success',
            message: 'Com ~8,5 cm de altura, costuma passar sob sofás/armários baixos; confirme folga mínima (ideal ≥ 9 cm).',
            idealRange: { min: 6, max: 9 },
        },
        soundAlert: {
            status: 'warning',
            message: 'Tende a ser perceptível em ambientes silenciosos; prefira rodar fora do horário de descanso.',
        },
        energyAlert: {
            rating: 'A',
            message: 'Potência de ~55 W: consumo baixo por ciclo; o custo no longo prazo depende da frequência de uso.',
        },
    },

    // ===========================================================
    // 🎯 Header
    // ===========================================================
    header: {
        overallScore: 6.3,
        scoreLabel: 'Bom',
        title: 'Samsung VR5000RM: ultrafino e competente no básico',
        subtitle: 'Excelente para rotina diária e áreas sob móveis — sem mapeamento e com mop de manutenção.',
        badges: [
            { type: 'feature', label: '8,5 cm ultrafino', icon: 'Ruler' },
            { type: 'feature', label: 'SmartThings (Wi-Fi)', icon: 'Smartphone' },
        ],
    },

    // ===========================================================
    // ❓ Decision FAQ (3 perguntas)
    // ===========================================================
    decisionFAQ: [
        {
            id: 'pets',
            icon: 'PawPrint',
            question: 'Serve para casa com pets?',
            answer: 'Sim para manutenção diária de pelos em piso frio e tapete baixo; para muito pelo + tapete alto, prefira LiDAR + maior potência e escova anti-embaraço.',
        },
        {
            id: 'mapping',
            icon: 'Map',
            question: 'Ele mapeia a casa e cria zonas proibidas?',
            answer: 'Não. A navegação é por giroscópio e sensores; você controla por app/agenda, mas sem mapa e sem no-go zones.',
        },
        {
            id: 'mopping',
            icon: 'Droplets',
            question: 'O pano substitui passar pano de verdade?',
            answer: 'Não. É "mop de manutenção" (arrasto) — ótimo para poeira fina e marcas leves, mas não para manchas difíceis.',
        },
    ],

    // ===========================================================
    // 🛠️ Interactive Tools
    // ===========================================================
    interactiveTools: [
        {
            id: 'dimension-check',
            icon: 'Ruler',
            title: 'Será que passa embaixo?',
            badge: 'Teste Rápido',
            badgeColor: 'orange',
            description: 'Verifique se o robô (8,5 cm) cabe no vão dos seus móveis.',
            toolType: 'geometry',
            configRef: 'robo-passa-movel',
        },
    ],
};
