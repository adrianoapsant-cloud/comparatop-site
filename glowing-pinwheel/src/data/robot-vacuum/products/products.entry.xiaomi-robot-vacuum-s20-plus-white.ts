/**
 * Xiaomi Robot Vacuum S20+ (Branco) - Robot Vacuum Entry
 * Generated: 2026-01-29
 * Category: robot-vacuum
 */

import type { Product } from '@/types/category';

export const xiaomi_robot_vacuum_s20_plus_white: Product = {
    // ============================================
    // IDENTIFICAÇÃO BÁSICA
    // ============================================
    id: 'xiaomi-robot-vacuum-s20-plus-white',
    categoryId: 'robot-vacuum',
    name: 'Xiaomi Robot Vacuum S20+ (Branco)',
    shortName: 'Xiaomi S20+',
    brand: 'Xiaomi',
    model: 'S20+',
    price: 2620.00,
    imageUrl: '/images/products/xiaomi-robot-vacuum-s20-plus-white.svg',
    gallery: ['/images/products/xiaomi-robot-vacuum-s20-plus-white.svg'],
    status: 'published',
    lastUpdated: '2026-01-29',
    useSimplifiedPDP: true,

    // ============================================
    // CONFIANÇA
    // ============================================
    evidenceLevel: 'high',
    contextualScoreRange: [7.2, 8.1],
    tcoTotalRange: [3200, 3900],
    tcoConfidence: 'low',

    // ============================================
    // SCORE CONTEXTUAL - Modifiers por contexto de uso
    // ============================================
    contextModifiers: {
        daily_maintenance: +0.2,   // 65 dB e 9,7 cm (ok para dia a dia; não é ultra-slim)
        large_home: +1.0,          // 170 min + LiDAR/mapeamento
        pet_owners: -0.3,          // escova principal padrão (pode enroscar cabelo)
    },

    // ============================================
    // SCORES PARR-BR (c1 a c10)
    // ============================================
    scores: {
        c1: 9.0, c2: 8.0, c3: 8.5, c4: 6.5, c5: 7.0,
        c6: 6.5, c7: 8.5, c8: 7.5, c9: 4.5, c10: 6.0,
    },

    scoreReasons: {
        c1: 'LiDAR (LDS) com mapeamento e rotas eficientes; boa navegação e cobertura.',
        c2: 'App Mi Home/Xiaomi Home com agendamento, zonas de exclusão e controle por voz (Alexa/Google).',
        c3: 'Mop rotativo duplo com elevação automática no carpete e boost em tapetes; esfrega melhor que "pano arrasto".',
        c4: 'Escova principal padrão (bristle) tende a enroscar mais cabelo que soluções "anti-emaranhamento" dedicadas.',
        c5: 'Altura de 9,7 cm: passa sob muitos móveis, mas pode falhar em vãos muito baixos.',
        c6: 'Consumíveis (filtro/escovas/mops) são comuns; peças grandes variam mais de disponibilidade no BR.',
        c7: 'Bateria 5200mAh e até 170 min no modo padrão: forte para apartamentos/casas grandes.',
        c8: 'Ruído máx. ~65 dB: aceitável para uso diário.',
        c9: 'Base apenas de carregamento (sem auto-esvaziamento / lavagem / refill).',
        c10: 'Evitamento de obstáculos por sensores (laser/ultrassônico/queda/borda), mas sem IA avançada por câmera.',
    },

    // ============================================
    // SPECS TÉCNICAS
    // ============================================
    specs: {
        suctionPower: 6000,
        batteryCapacity: 5200,
        dustbinCapacity: 450,
        waterTankCapacity: 290,
        noiseLevel: 65,
        width: 35,
        height: 9.7,
        depth: 35,
    },

    // Structured specs for scoring module
    structuredSpecs: {
        navigationType: 'lidar',
        mopType: 'rotating',
        brushType: 'bristle',
        dockType: 'auto-empty',
        obstacleDetection: 'bump-only',
        heightCm: 9.7,
        noiseDb: 65,
        runtimeMinutes: 170,
        batteryMah: 5200,
    },

    attributes: {
        navigationType: 'lidar',
        hasMop: true,
        mopType: 'rotativo-duplo',
        hasAutoEmpty: false,
        hasMapping: true,
        hasNoGoZones: true,
        hasRechargeResume: true,
        hasAppControl: true,
        voiceAssistants: ['alexa', 'google'],
        wifiBand: '2.4ghz',
        climbHeight: 0,
        brushType: 'standard_bristle',
        batteryMah: 5200,
        chargingTimeHours: 3.5,
        runtimeMinutes: 170,
    },

    technicalSpecs: {
        suctionPower: 6000,
        dustbinCapacity: 450,
        waterTankCapacity: 290,
        mopType: '2 esfregonas rotativas (mop duplo)',
        brushType: 'escova principal padrão (bristle) + escova lateral',
        filterType: 'HEPA',
        navigation: 'LiDAR (LDS) + mapeamento',
        mapping: true,
        lidar: true,
        camera: false,
        obstacleDetection: 'sensores de borda/queda + bumper + sensores laser (linha) + ultrassônico para carpete',
        climbHeight: 0,
        runtime: 'até 170 min (modo padrão)',
        batteryCapacity: 5200,
        chargingTime: 'aprox. 210 min',
        autoRecharge: true,
        rechargeResume: true,
        wifi: true,
        appControl: true,
        voiceControl: 'Alexa e Google Assistant',
        scheduling: true,
        multiFloorMapping: true,
        dockType: 'base de carregamento (sem auto-esvaziamento)',
        autoEmpty: false,
        autoMopWash: false,
        autoRefill: false,
        height: 9.7,
        diameter: 35,
        weight: 3.8,
        noiseLevel: 65,
    },

    productDimensions: { diameter: 35, height: 9.7 },

    // ============================================
    // PRODUCT DNA (10 Dimensões Radar)
    // ============================================
    productDna: {
        title: 'DNA do Produto',
        subtitle: 'Perfil técnico em 10 dimensões',
        dimensions: [
            { id: 'c1', name: 'Navegação', shortName: 'Navegação', score: 9.0, weight: 25, icon: 'Radar', color: '#06B6D4', description: 'LiDAR (LDS) com mapeamento consistente e rotas eficientes.' },
            { id: 'c2', name: 'Software/App', shortName: 'Software', score: 8.0, weight: 15, icon: 'Smartphone', color: '#8B5CF6', description: 'Mi Home/Xiaomi Home com agenda, zonas e controle por voz.' },
            { id: 'c3', name: 'Sistema de Mop', shortName: 'Mop', score: 8.5, weight: 15, icon: 'Droplets', color: '#3B82F6', description: 'Mop rotativo duplo com elevação no carpete (melhor esfregação).' },
            { id: 'c4', name: 'Escovas', shortName: 'Escovas', score: 6.5, weight: 10, icon: 'Brush', color: '#10B981', description: 'Escova padrão: funciona bem, mas exige limpeza com pelos/cabelos.' },
            { id: 'c5', name: 'Altura/Perfil', shortName: 'Altura', score: 7.0, weight: 10, icon: 'Ruler', color: '#F59E0B', description: '9,7 cm — passa sob muitos móveis, mas não é "ultra-slim".' },
            { id: 'c6', name: 'Manutenibilidade', shortName: 'Manutenção', score: 6.5, weight: 8, icon: 'Wrench', color: '#64748B', description: 'Consumíveis são fáceis; peças maiores variam por importação.' },
            { id: 'c7', name: 'Bateria', shortName: 'Bateria', score: 8.5, weight: 5, icon: 'Battery', color: '#22C55E', description: '5200mAh com até 170 min e retomada pós-recarga.' },
            { id: 'c8', name: 'Acústica', shortName: 'Ruído', score: 7.5, weight: 5, icon: 'Volume2', color: '#F59E0B', description: 'Máx. ~65 dB: bom para rodar durante o dia.' },
            { id: 'c9', name: 'Base/Dock', shortName: 'Base', score: 4.5, weight: 5, icon: 'Home', color: '#EF4444', description: 'Base simples: carrega, mas não lava nem esvazia automaticamente.' },
            { id: 'c10', name: 'IA/Desvio', shortName: 'IA Desvio', score: 6.0, weight: 2, icon: 'Brain', color: '#EC4899', description: 'Sensores evitam colisões/queda; sem reconhecimento por câmera.' },
        ],
    },

    // ============================================
    // VEREDITO DE AUDITORIA
    // ============================================
    auditVerdict: {
        solution: {
            title: '✅ O S20+ resolve bem',
            icon: 'CheckCircle',
            color: 'green',
            items: [
                'Sucção forte (6000Pa) para sujeira em frestas e tapetes',
                'Mop rotativo duplo melhora remoção de manchas leves vs. pano arrasto',
                'Elevação automática do mop em carpete reduz risco de "tapete molhado"',
                'Mapa LiDAR com limpeza por cômodo e zonas proibidas',
                'Autonomia alta (até 170 min) para áreas maiores',
            ],
        },
        attentionPoint: {
            title: '⚠️ Pontos de atenção',
            icon: 'AlertTriangle',
            color: 'yellow',
            items: [
                'Sem base automática: esvaziar lixeira e lavar mops é manual',
                'Escova principal padrão pode enroscar em cabelo/pelos',
                'Tanque de água (290ml) é ok, mas pode exigir reabastecer em casas grandes',
                'Altura 9,7 cm: confira vãos de móveis "baixos" (especialmente com rodapé)',
            ],
        },
        technicalConclusion: {
            title: '🔬 Conclusão técnica',
            icon: 'Microscope',
            color: 'blue',
            text: 'O S20+ entrega um pacote técnico muito sólido no mid-range: LiDAR bem competente, sucção alta e mop rotativo com elevação (um diferencial real). O custo fica mais baixo que modelos "omni" porque a base é simples — então é excelente para quem aceita manutenção manual e quer desempenho de limpeza, não automação total.',
        },
        dontBuyIf: {
            title: '❌ Não compre se',
            icon: 'XCircle',
            color: 'red',
            items: [
                'Você quer auto-esvaziamento e lavagem/secagem automática de mop',
                'Sua casa tem muitos tapetes altos (acima de ~7mm) ou com franjas',
                'Você precisa de um robô ultra-slim (<9 cm) para móveis muito baixos',
                'Você não quer lidar com limpeza de escova quando há muito cabelo/pelos',
            ],
        },
    },

    // ============================================
    // CONTEÚDO EDITORIAL
    // ============================================
    benefitSubtitle: '6000Pa + mop rotativo duplo com elevação automática (não molha tapetes)',

    featureBenefits: [
        { icon: 'Radar', title: 'Mapa LiDAR (LDS)', description: 'Escaneia o ambiente e planeja rotas eficientes, com limpeza por cômodo e zonas de exclusão no app.' },
        { icon: 'Zap', title: 'Sucção 6000Pa', description: 'Potência alta para poeira fina e sujeira em frestas, com reforço em tapetes quando detectados.' },
        { icon: 'Clock', title: 'Até 170 min', description: 'Autonomia para cobrir áreas grandes com uma carga, com recarga automática e retomada.' },
        { icon: 'Droplets', title: 'Mop rotativo com elevação', description: 'Duas almofadas rotativas "esfregam" o piso e sobem no carpete para evitar molhar tapetes.' },
    ],

    badges: ['best-value'],

    // ============================================
    // OFERTAS
    // ============================================
    offers: [
        {
            store: 'Amazon',
            storeSlug: 'amazon',
            price: 2620.00,
            url: 'https://www.amazon.com.br/dp/B0DCZGPGRX',
            affiliateUrl: 'https://www.amazon.com.br/dp/B0DCZGPGRX?tag=aferio-20',
            inStock: true,
            lastChecked: '2026-01-29',
        },
        {
            store: 'Xiaomi Brasil',
            storeSlug: 'xiaomi',
            price: 2799.00,
            url: 'https://www.mi.com/br/robot-vacuum-s20-plus',
            affiliateUrl: 'https://www.mi.com/br/robot-vacuum-s20-plus',
            inStock: true,
            lastChecked: '2026-01-29',
        },
    ],

    // ============================================
    // MAIN COMPETITOR
    // ============================================
    mainCompetitor: {
        id: 'roborock-q7-max',
        name: 'Roborock Q7 Max',
        shortName: 'Roborock Q7 Max',
        imageUrl: '/images/products/roborock-q7-max.svg',
        price: 2499.00,
        score: 7.5,
        keyDifferences: [
            { label: 'Sistema de mop', current: 'Rotativo duplo + elevação', rival: 'Pano arrasto (pressão)', winner: 'current' },
            { label: 'Ecossistema/app', current: 'Mi Home (bom)', rival: 'Roborock app (muito completo)', winner: 'rival' },
            { label: 'Preço', current: 'R$ 2.620', rival: 'R$ 2.499', winner: 'rival' },
        ],
    },

    // ============================================
    // ACESSÓRIO RECOMENDADO
    // ============================================
    recommendedAccessory: {
        asin: 'B0DHZL6X85',
        name: 'Kit de reposição (escova + filtros + mops) compatível com S20+ (B108GL)',
        shortName: 'Kit consumíveis S20+',
        price: 109.90,
        imageUrl: '/images/products/acessorio-consumiveis-s20plus.svg',
        reason: 'Mantém desempenho de sucção e esfregação com trocas periódicas de filtro/escovas/mops.',
        affiliateUrl: 'https://www.amazon.com.br/dp/B0DHZL6X85?tag=aferio-20',
    },

    // ============================================
    // VOC - Voz do Consumidor
    // ============================================
    voc: {
        totalReviews: 244,
        averageRating: 4.6,
        consensusScore: 92,
        oneLiner: 'Mapa LiDAR + sucção forte e mop rotativo que "esfrega", com elevação no tapete — mas sem base automática.',
        summary: 'Usuários tendem a elogiar a força de sucção, a navegação por mapa e o desempenho do mop rotativo em sujeiras do dia a dia. As críticas mais comuns aparecem quando a expectativa é ter base com auto-esvaziamento/lavagem ou quando há muito cabelo (enrosco em escova padrão).',
        pros: [
            'Sucção alta (6000Pa) e bom "boost" em tapetes',
            'Mop rotativo duplo com elevação automática no carpete',
            'Mapeamento LiDAR com zonas de exclusão e agendamento',
        ],
        cons: [
            'Não tem auto-esvaziamento nem lavagem/secagem de mop',
            'Escova padrão pode exigir limpeza manual com pets/cabelos longos',
        ],
        sources: [
            { name: 'Amazon Brasil', url: 'https://www.amazon.com.br/dp/B0DCZGPGRX', count: 244 },
        ],
    },

    extendedVoc: {
        consensusScore: 92,
        totalReviews: '244 avaliações',
        acceptableFlaw: 'Não ter base com auto-esvaziamento/lavagem — você faz a manutenção (lixeira/mop) manualmente.',
        realWorldScenario: 'Para quem quer aspirar + passar pano de verdade em piso frio/laminado e tem tapetes baixos: ele levanta o mop ao subir no carpete e segue a limpeza sem "molhar o tapete".',
        goldenTip: 'Se tiver pets/cabelos longos, faça a limpeza da escova principal 1–2x por semana para manter sucção e evitar travamentos.',
    },

    // ============================================
    // TCO - Custo Total de Propriedade
    // ============================================
    tcoData: {
        purchasePrice: 2620.00,
        energyCost5y: 110.00,
        maintenanceCost5y: 750.00,
        totalCost5y: 3480.00,
        monthlyReserve: 58.00,
        lifespanYears: 5,
    },

    extendedTco: {
        purchasePrice: 2620.00,
        energyCost5y: 110.00,
        maintenanceCost5y: 750.00,
        totalCost5y: 3480.00,
        monthlyReserve: 58.00,
        lifespan: {
            years: 5,
            limitingComponent: 'Bateria Li-ion (5200mAh)',
            limitingComponentLife: 4,
            weibullExplanation: 'Em robôs aspiradores, a taxa de falha costuma ser baixa no início (infant mortality) e cresce após alguns anos por desgaste: bateria perde capacidade, rodas/escovas acumulam esforço e sensores sofrem com poeira/impactos. Com manutenção de consumíveis em dia, o "ponto de virada" costuma ser a bateria.',
        },
        repairability: {
            score: 6,
            level: 'Moderado',
            components: [
                {
                    name: 'Placa Principal',
                    score: 3,
                    price: 650,
                    availability: 'Escassa - importação',
                    failureSymptoms: ['Não liga', 'Reinicia sozinho', 'Wi‑Fi não conecta'],
                    repairAdvice: 'Verifique fonte/base e bateria antes; placa costuma exigir assistência/peça importada.',
                },
                {
                    name: 'Sensor LiDAR (LDS)',
                    score: 5,
                    price: 175,
                    availability: 'Limitada - peça de reposição',
                    failureSymptoms: ['Mapa falha', 'Gira em círculos', 'Erro de navegação'],
                    repairAdvice: 'Limpe cúpula do LiDAR; se persistir, módulo LDS é substituível.',
                },
                {
                    name: 'Motor de Sucção',
                    score: 5,
                    price: 250,
                    availability: 'Limitada - assistência técnica',
                    failureSymptoms: ['Perda forte de sucção', 'Cheiro de queimado', 'Ruído anormal'],
                    repairAdvice: 'Troque filtro/escovas primeiro; se não resolver, o motor pode exigir substituição.',
                },
                {
                    name: 'Bateria 5200mAh',
                    score: 7,
                    price: 549,
                    availability: 'Limitada - pack compatível',
                    failureSymptoms: ['Autonomia caiu muito', 'Não completa limpeza', 'Desliga fora da base'],
                    repairAdvice: 'Quando a autonomia cair bastante, a troca do pack costuma "reviver" o robô.',
                },
                {
                    name: 'Módulo de Roda',
                    score: 6,
                    price: 220,
                    availability: 'Limitada - peça de reposição',
                    failureSymptoms: ['Não sobe pequenos desníveis', 'Patina', 'Erro de roda/travamento'],
                    repairAdvice: 'Remova fios/cabelos da roda; se o motor interno falhar, troca do módulo resolve.',
                },
            ],
        },
    },

    // ============================================
    // SIMULADORES
    // ============================================
    simulators: {
        sizeAlert: {
            status: 'warning',
            message: 'Altura de 9,7 cm: pode não passar em móveis com vão abaixo de ~10 cm (considerando irregularidades do piso).',
            idealRange: { min: 6, max: 9 },
        },
        soundAlert: {
            status: 'ok',
            message: 'Ruído máx. ~65 dB: geralmente aceitável para rodar durante o dia.',
        },
        energyAlert: {
            rating: 'A',
            message: 'Potência nominal 55W: custo de energia costuma ser baixo no TCO vs. consumíveis.',
        },
    },

    // ============================================
    // HEADER
    // ============================================
    header: {
        overallScore: 7.7,
        scoreLabel: 'Muito Bom',
        title: 'Xiaomi S20+ (Branco): LiDAR + Mop Rotativo com Elevação',
        subtitle: 'Mapa LiDAR + 6000Pa + mop rotativo com elevação — ótimo custo-benefício sem base automática',
        badges: [
            { type: 'feature', label: 'LiDAR (LDS)', icon: 'Radar' },
            { type: 'feature', label: 'Mop com elevação', icon: 'Droplets' },
        ],
    },

    // ============================================
    // DECISION FAQ
    // ============================================
    decisionFAQ: [
        {
            id: 'p1',
            icon: 'AlertTriangle',
            question: 'Ele molha tapetes?',
            answer: 'Em tapetes baixos, ele detecta o carpete e levanta o mop automaticamente; para tapetes altos/borlas, use o modo "evitar carpetes".',
        },
        {
            id: 'p2',
            icon: 'Scale',
            question: 'Vale mais que um modelo com pano arrasto na mesma faixa?',
            answer: 'Se você quer passar pano "de verdade", sim: o mop rotativo duplo melhora a esfregação e remove sujeira leve melhor que pano arrasto. Se seu foco é só aspirar, o ganho diminui.',
        },
        {
            id: 'p3',
            icon: 'Wrench',
            question: 'Qual manutenção devo esperar no mês a mês?',
            answer: 'Esvaziar lixeira, lavar os mops e limpar escova principal (principalmente com pets/cabelos). Troca de consumíveis (filtro/escovas) a cada alguns meses melhora desempenho.',
        },
    ],

    // ============================================
    // INTERACTIVE TOOLS
    // ============================================
    interactiveTools: [
        {
            id: 'dimension-check',
            icon: 'ruler',
            title: 'Será que cabe?',
            badge: 'Teste Rápido',
            badgeColor: 'orange',
            description: 'Verifique se o robô passa debaixo dos seus móveis',
            toolType: 'geometry',
            configRef: 'robo-passa-movel',
        },
    ],
};

export default xiaomi_robot_vacuum_s20_plus_white;
