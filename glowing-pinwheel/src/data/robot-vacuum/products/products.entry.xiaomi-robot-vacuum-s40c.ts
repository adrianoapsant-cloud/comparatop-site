/**
 * Xiaomi Robot Vacuum S40C - Robot Vacuum Entry
 * Generated: 2026-01-29
 * Category: robot-vacuum
 */

import type { Product } from '@/types/category';

export const xiaomi_robot_vacuum_s40c: Product = {
    // ============================================
    // IDENTIFICAÇÃO BÁSICA
    // ============================================
    id: 'xiaomi-robot-vacuum-s40c',
    categoryId: 'robot-vacuum',
    name: 'XIAOMI Xiaomi Robot Vacuum S40C (E101) — Robô aspirador e passa pano com navegação LiDAR (LDS)',
    shortName: 'Xiaomi S40C',
    brand: 'XIAOMI',
    model: 'Xiaomi Robot Vacuum S40C',
    price: 1480.00,
    imageUrl: '/images/products/xiaomi-robot-vacuum-s40c.svg',
    gallery: ['/images/products/xiaomi-robot-vacuum-s40c.svg'],
    status: 'published',
    lastUpdated: '2026-01-29',
    useSimplifiedPDP: true,

    // ============================================
    // CONFIANÇA
    // ============================================
    evidenceLevel: 'high',
    contextualScoreRange: [6.6, 7.3],
    tcoTotalRange: [2000, 2600],
    tcoConfidence: 'low',

    // ============================================
    // SCORES PARR-BR (c1 a c10)
    // ============================================
    scores: {
        c1: 8.5, c2: 8.0, c3: 6.5, c4: 6.0, c5: 7.0,
        c6: 6.0, c7: 6.5, c8: 5.5, c9: 4.0, c10: 3.0,
    },

    scoreReasons: {
        c1: 'Navegação LiDAR (LDS) com varredura 360° + mapeamento rápido e zonas de exclusão.',
        c2: 'Controle por app (Mi Home/Xiaomi Home), agendamento e compatibilidade com Alexa/Google.',
        c3: 'Aspira + passa pano com controle eletrônico de água; mop é do tipo pano de arrasto (não vibratório/rotativo).',
        c4: 'Escova principal padrão + escova lateral; não há destaque de antiemaranhamento avançado.',
        c5: 'Altura de 9,6 cm: entra sob muitos móveis, mas pode falhar em vãos bem baixos (<10 cm).',
        c6: 'Consumíveis são fáceis de repor; peças eletrônicas tendem a ter disponibilidade mais limitada no Brasil.',
        c7: 'Bateria de 2600 mAh e autonomia em torno de ~110 min (variável por modo); suficiente para apartamentos médios.',
        c8: 'Ruído informado em torno de 75 dB: aceitável, mas perceptível (melhor agendar fora do horário de trabalho).',
        c9: 'Base é de carregamento simples (sem autoesvaziamento, sem lavagem do mop, sem reabastecimento).',
        c10: 'Sem câmera/IA dedicada para reconhecimento de objetos; depende de sensores e do mapa.',
    },

    // ============================================
    // SPECS TÉCNICAS
    // ============================================
    specs: {
        suctionPower: 5000,
        batteryCapacity: 2600,
        dustbinCapacity: 520,
        waterTankCapacity: 260,
        noiseLevel: 75,
        width: 34,
        height: 9.6,
        depth: 34,
    },

    // Structured specs for scoring module
    structuredSpecs: {
        navigationType: 'lidar',
        mopType: 'static',
        brushType: 'bristle',
        dockType: 'basic',
        obstacleDetection: 'ai-camera',
        heightCm: 9.6,
        noiseDb: 75,
        runtimeMinutes: 110,
        batteryMah: 2600,
    },

    attributes: {
        navigationType: 'lidar',
        hasMop: true,
        mopType: 'pano-arrasto',
        hasAutoEmpty: false,
        hasMapping: true,
        hasNoGoZones: true,
        hasRechargeResume: true,
        hasAppControl: true,
        voiceAssistants: ['alexa', 'google'],
        wifiBand: '2.4ghz',
        climbHeight: 2.0,
        brushType: 'standard_bristle',
        batteryMah: 2600,
        chargingTimeHours: 5,
        runtimeMinutes: 110,
    },

    technicalSpecs: {
        suctionPower: 5000,
        dustbinCapacity: 520,
        waterTankCapacity: 260,
        mopType: 'pano-arrasto (controle eletrônico de água)',
        brushType: 'escova principal padrão + escova lateral',
        filterType: 'HEPA',
        navigation: 'LiDAR (LDS) com varredura 360°',
        mapping: true,
        lidar: true,
        camera: false,
        obstacleDetection: 'sensores antiqueda/anticolisão (sem reconhecimento por câmera)',
        climbHeight: 2.0,
        runtime: 'até ~110 min (varia por modo de sucção)',
        batteryCapacity: 2600,
        chargingTime: 'aprox. 4–6 horas',
        autoRecharge: true,
        rechargeResume: true,
        wifi: true,
        appControl: true,
        voiceControl: 'Alexa e Google Assistant',
        scheduling: true,
        multiFloorMapping: true,
        dockType: 'base de carregamento (docking station) padrão',
        autoEmpty: false,
        autoMopWash: false,
        autoRefill: false,
        height: 9.6,
        diameter: 34,
        weight: 3.81,
        noiseLevel: 75,
    },

    productDimensions: { diameter: 34, height: 9.6 },

    // ============================================
    // PRODUCT DNA (10 Dimensões Radar)
    // ============================================
    productDna: {
        title: 'DNA do Produto',
        subtitle: 'Perfil técnico em 10 dimensões',
        dimensions: [
            { id: 'c1', name: 'Navegação', shortName: 'Navegação', score: 8.5, weight: 25, icon: 'Radar', color: '#06B6D4', description: 'LiDAR (LDS) com mapa e zonas de exclusão: rota previsível e cobertura consistente.' },
            { id: 'c2', name: 'Software/App', shortName: 'Software', score: 8.0, weight: 15, icon: 'Smartphone', color: '#8B5CF6', description: 'Mi Home/Xiaomi Home com agendamento e controle remoto + Alexa/Google.' },
            { id: 'c3', name: 'Sistema de Mop', shortName: 'Mop', score: 6.5, weight: 15, icon: 'Droplets', color: '#3B82F6', description: 'Passa pano com tanque eletrônico: bom para manutenção; não é vibratório/rotativo.' },
            { id: 'c4', name: 'Escovas', shortName: 'Escovas', score: 6.0, weight: 10, icon: 'Brush', color: '#10B981', description: 'Conjunto padrão de escovas; exige manutenção regular em casas com pets.' },
            { id: 'c5', name: 'Altura/Perfil', shortName: 'Altura', score: 7.0, weight: 10, icon: 'Ruler', color: '#F59E0B', description: '9,6 cm: bom equilíbrio entre LiDAR e acesso sob móveis.' },
            { id: 'c6', name: 'Manutenibilidade', shortName: 'Manutenção', score: 6.0, weight: 8, icon: 'Wrench', color: '#64748B', description: 'Consumíveis ok; eletrônica pode ter reposição mais chata dependendo do canal.' },
            { id: 'c7', name: 'Bateria', shortName: 'Bateria', score: 6.5, weight: 5, icon: 'Battery', color: '#22C55E', description: '2600 mAh e ~110 min: atende áreas médias; para áreas grandes depende de recarga.' },
            { id: 'c8', name: 'Acústica', shortName: 'Ruído', score: 5.5, weight: 5, icon: 'Volume2', color: '#F59E0B', description: '75 dB: ok para uso diurno; pode incomodar em ambiente silencioso.' },
            { id: 'c9', name: 'Base/Dock', shortName: 'Base', score: 4.0, weight: 5, icon: 'Home', color: '#EF4444', description: 'Dock simples: carrega, mas não autoesvazia nem lava mop.' },
            { id: 'c10', name: 'IA/Desvio', shortName: 'IA Desvio', score: 3.0, weight: 2, icon: 'Brain', color: '#EC4899', description: 'Sem câmera/IA para evitar objetos; depende do mapa e sensores.' },
        ],
    },

    // ============================================
    // VEREDITO DE AUDITORIA
    // ============================================
    auditVerdict: {
        solution: {
            title: '✅ O S40C resolve bem',
            icon: 'CheckCircle',
            color: 'green',
            items: [
                'LiDAR (LDS) com mapeamento 360° e rotas em zigue-zague',
                'Sucção de 5000Pa: acima da média para a faixa',
                'Depósito de pó grande (520 ml) + tanque de água (260 ml)',
                'Zonas de exclusão para controle fino por cômodo',
                'App Mi Home/Xiaomi Home com agendamento e controle remoto',
            ],
        },
        attentionPoint: {
            title: '⚠️ Pontos de atenção',
            icon: 'AlertTriangle',
            color: 'yellow',
            items: [
                'Base simples: sem autoesvaziamento, sem lavagem/recarga de água',
                'Mop de arrasto: manutenção leve, não substitui esfregão',
                'Ruído em torno de 75 dB é perceptível em home office',
                'Altura 9,6 cm: confira o vão de móveis antes',
            ],
        },
        technicalConclusion: {
            title: '🔬 Conclusão técnica',
            icon: 'Microscope',
            color: 'blue',
            text: 'O S40C é um "LiDAR honesto": faz o básico avançado (mapa, rotas, no-go zones, sucção forte) e corta custo onde pesa (base omni e mop sofisticado). Se sua prioridade é previsibilidade de navegação e boa aspiração, ele entrega. Se você quer automação total (autoesvaziar e lavar mop), procure uma linha Omni.',
        },
        dontBuyIf: {
            title: '❌ Não compre se',
            icon: 'XCircle',
            color: 'red',
            items: [
                'Você quer autoesvaziamento/lavagem automática do mop',
                'Sua casa tem muitos tapetes altos e você depende de reconhecimento por câmera',
                'Você precisa de limpeza pesada de manchas (mop vibratório/rotativo)',
                'Seu mobiliário tem vãos menores que ~10 cm',
            ],
        },
    },

    // ============================================
    // CONTEÚDO EDITORIAL
    // ============================================
    benefitSubtitle: 'LiDAR com zonas de exclusão + 5000Pa para limpeza rápida e previsível',

    featureBenefits: [
        { icon: 'Radar', title: 'LiDAR com zonas de exclusão', description: 'Mapeia rápido em 360° e permite bloquear áreas (fios, tapetes específicos, cantos delicados).' },
        { icon: 'Zap', title: '5000Pa de sucção', description: 'Potência alta para poeira fina, migalhas e pelos em pisos e tapetes baixos.' },
        { icon: 'Clock', title: 'Agendamento no app', description: 'Controle pelo Mi Home/Xiaomi Home: horários, modos e áreas por cômodo.' },
        { icon: 'Tag', title: 'Depósito grande + tanque eletrônico', description: '520 ml de pó e 260 ml de água com controle eletrônico para passar pano no dia a dia.' },
    ],

    badges: ['best-value'],

    // ============================================
    // OFERTAS
    // ============================================
    offers: [
        {
            store: 'Amazon',
            storeSlug: 'amazon',
            price: 1480.00,
            url: 'https://www.amazon.com.br/dp/B0F4K1H6X5',
            affiliateUrl: 'https://www.amazon.com.br/dp/B0F4K1H6X5?tag=aferio-20',
            inStock: true,
            lastChecked: '2026-01-29',
        },
        {
            store: 'Xiaomi Brasil',
            storeSlug: 'xiaomi',
            price: 1599.00,
            url: 'https://www.mi.com.br/robot-vacuum-s40c',
            affiliateUrl: 'https://www.mi.com.br/robot-vacuum-s40c',
            inStock: true,
            lastChecked: '2026-01-29',
        },
    ],

    // ============================================
    // MAIN COMPETITOR
    // ============================================
    mainCompetitor: {
        id: 'xiaomi-robot-vacuum-s20',
        name: 'Xiaomi Robot Vacuum S20',
        shortName: 'Xiaomi S20',
        imageUrl: '/images/products/xiaomi-robot-vacuum-s20.svg',
        price: 2850.00,
        score: 7.6,
        keyDifferences: [
            { label: 'Preço', current: 'R$ 1.480', rival: 'R$ 2.850', winner: 'current' },
            { label: 'Plataforma', current: 'Base simples', rival: 'Linha acima', winner: 'rival' },
            { label: 'Custo-benefício', current: 'LiDAR por menos', rival: 'Mais recursos', winner: 'current' },
        ],
    },

    // ============================================
    // ACESSÓRIO RECOMENDADO
    // ============================================
    recommendedAccessory: {
        asin: 'B0FX529TCS',
        name: 'Kit de acessórios de substituição (escovas, filtros e panos) compatível com Xiaomi S40C/E101',
        shortName: 'Kit consumíveis S40C',
        price: 199.00,
        imageUrl: '/images/products/acessorio.svg',
        reason: 'Mantém a performance (filtro/escovas/panos) e reduz queda de sucção ao longo dos meses.',
        affiliateUrl: 'https://www.amazon.com.br/dp/B0FX529TCS?tag=aferio-20',
    },

    // ============================================
    // VOC - Voz do Consumidor
    // ============================================
    voc: {
        totalReviews: 111,
        averageRating: 4.7,
        consensusScore: 94,
        oneLiner: 'Mapeia com precisão e aspira forte pelo preço; o passa-pano é básico e a base é simples.',
        summary: 'O S40C é um robô "LiDAR de entrada premium": entrega rota previsível (mapa + zigue-zague), boa sucção (5000Pa) e zonas de exclusão. Em troca, não traz base avançada (autoesvaziamento/lavagem) e o mop é do tipo arrasto — resolve manutenção leve, não substitui esfregão pesado.',
        pros: [
            'Navegação LiDAR (LDS) com mapeamento rápido e zonas de exclusão',
            'Sucção forte (5000Pa) e depósito de pó grande (520 ml)',
            'App Mi Home/Xiaomi Home com agendamento + Alexa/Google',
        ],
        cons: [
            'Sem autoesvaziamento e sem lavagem automática do mop',
            'Ruído em torno de 75 dB pode incomodar em ambientes silenciosos',
        ],
        sources: [
            { name: 'Amazon Brasil', url: 'https://www.amazon.com.br/dp/B0F4K1H6X5', count: 111 },
        ],
    },

    extendedVoc: {
        consensusScore: 94, // Multiplicado por 10 conforme instrução (9.4 → 94)
        totalReviews: '111 avaliações',
        acceptableFlaw: 'O passa-pano é do tipo arrasto: ótimo para manutenção, fraco para sujeira pesada e manchas antigas.',
        realWorldScenario: 'Apartamento/casa com piso frio ou madeira transformada, pets e rotina de limpeza 3–5x/semana.',
        goldenTip: 'Use "zonas de exclusão" para áreas com fios e reduza água no modo mop em pisos sensíveis.',
    },

    // ============================================
    // TCO - Custo Total de Propriedade
    // ============================================
    tcoData: {
        purchasePrice: 1480.00,
        energyCost5y: 90.00,
        maintenanceCost5y: 600.00,
        totalCost5y: 2170.00,
        monthlyReserve: 36.17,
        lifespanYears: 5,
    },

    extendedTco: {
        purchasePrice: 1480.00,
        energyCost5y: 90.00,
        maintenanceCost5y: 600.00,
        totalCost5y: 2170.00,
        monthlyReserve: 36.17,
        lifespan: {
            years: 5,
            limitingComponent: 'Bateria',
            limitingComponentLife: 3,
            weibullExplanation: 'Falhas de longo prazo tendem a concentrar em bateria/rodas (desgaste) e eletrônica exposta a poeira/umidade; consumíveis são previsíveis e baratos, enquanto eletrônica tem variação de disponibilidade.',
        },
        repairability: {
            score: 6,
            level: 'Moderado',
            components: [
                {
                    name: 'Placa Principal',
                    score: 4,
                    price: 350,
                    availability: 'Escassa - assistência técnica',
                    failureSymptoms: ['Não liga', 'Reinicia sozinho', 'Erros recorrentes no app'],
                    repairAdvice: 'Vale orçamento com assistência; se passar de ~40% do preço do robô, costuma não compensar.',
                },
                {
                    name: 'Sensor LiDAR',
                    score: 5,
                    price: 280,
                    availability: 'Escassa - importação',
                    failureSymptoms: ['Mapa falha', 'Gira em círculos', 'Erros de navegação/posicionamento'],
                    repairAdvice: 'Limpe cúpula e cavidade do LiDAR; persistindo, é peça mais cara e nem sempre fácil de achar.',
                },
                {
                    name: 'Motor de Sucção',
                    score: 5,
                    price: 200,
                    availability: 'Limitada',
                    failureSymptoms: ['Perda brusca de sucção', 'Barulho anormal', 'Cheiro de queimado'],
                    repairAdvice: 'Troque filtro/escovas antes; se for motor, avalie custo vs troca do robô.',
                },
                {
                    name: 'Bateria',
                    score: 7,
                    price: 180,
                    availability: 'Limitada - genéricas disponíveis',
                    failureSymptoms: ['Autonomia despenca', 'Não completa ciclo', 'Desliga longe da base'],
                    repairAdvice: 'Bateria é o "limitante" típico: após ~2–3 anos pode precisar troca dependendo do uso.',
                },
                {
                    name: 'Módulo de Roda',
                    score: 6,
                    price: 150,
                    availability: 'Limitada',
                    failureSymptoms: ['Trava em desníveis', 'Roda patinando', 'Erro de locomoção'],
                    repairAdvice: 'Remova fios/cabelos; se desgaste, módulo pode exigir troca.',
                },
            ],
        },
    },

    // ============================================
    // SIMULADORES
    // ============================================
    simulators: {
        sizeAlert: {
            status: 'moderate',
            message: 'Altura de 9,6 cm: confirme se seus móveis têm pelo menos ~10 cm de vão livre.',
            idealRange: { min: 6, max: 9 },
        },
        soundAlert: {
            status: 'moderate',
            message: 'Ruído ~75 dB: agende para horários fora do home office ou use potência média.',
        },
        energyAlert: {
            rating: 'A',
            message: 'Potência nominal baixa (≈55W) tende a ter impacto pequeno na conta, mesmo com uso frequente.',
        },
    },

    // ============================================
    // HEADER
    // ============================================
    header: {
        overallScore: 6.9,
        scoreLabel: 'Bom',
        title: 'Xiaomi S40C: LiDAR + 5000Pa para limpar com rota previsível',
        subtitle: 'Bom custo-benefício para quem quer mapeamento sério sem pagar por base "omni".',
        badges: [
            { type: 'feature', label: 'LiDAR (LDS) 360°', icon: 'Radar' },
            { type: 'feature', label: 'Zonas de exclusão', icon: 'Zap' },
        ],
    },

    // ============================================
    // DECISION FAQ
    // ============================================
    decisionFAQ: [
        {
            id: 'p1',
            icon: 'AlertTriangle',
            question: 'Ele substitui um mop "de verdade"?',
            answer: 'Não. O S40C usa pano de arrasto com controle eletrônico de água: excelente para manutenção e poeira fina, fraco para manchas antigas e sujeira grudada.',
        },
        {
            id: 'p2',
            icon: 'Scale',
            question: 'Vale mais que um robô barato sem mapa?',
            answer: 'Se você quer rota previsível e evitar repetição/batidas, sim: LiDAR + zonas de exclusão mudam a experiência. Se você só quer "quebrar um galho", um modelo aleatório pode bastar.',
        },
        {
            id: 'p3',
            icon: 'Wrench',
            question: 'O que dá mais problema com o tempo?',
            answer: 'Consumíveis (filtro/escovas/panos) são manutenção normal. Em 2–4 anos, bateria e rodas costumam ser os limitantes mais comuns em robôs dessa classe.',
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

export default xiaomi_robot_vacuum_s40c;
