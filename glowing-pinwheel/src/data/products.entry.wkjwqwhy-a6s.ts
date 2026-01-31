/**
 * WKJWQWHY A6S - Robot Vacuum Entry
 * Generated: 2026-01-29
 * Category: robot-vacuum
 */

import type { Product } from '@/types/category';

export const wkjwqwhy_a6s: Product = {
    // ============================================
    // IDENTIFICAÇÃO BÁSICA
    // ============================================
    id: 'wkjwqwhy-a6s',
    categoryId: 'robot-vacuum',
    name: 'Robô Aspirador 2 em 1 WKJWQWHY A6S (Aspira e Passa Pano) com Wi‑Fi - Bivolt',
    shortName: 'WKJWQWHY A6S',
    brand: 'WKJWQWHY',
    model: 'A6S',
    price: 599.00,
    imageUrl: '/images/products/wkjwqwhy-a6s.svg',
    gallery: ['/images/products/wkjwqwhy-a6s.svg'],
    status: 'published',
    lastUpdated: '2026-01-29',
    useSimplifiedPDP: true,

    // ============================================
    // CONFIANÇA
    // ============================================
    evidenceLevel: 'low',
    contextualScoreRange: [5.8, 6.6],
    tcoTotalRange: [1100, 1600],
    tcoConfidence: 'low',

    // ============================================
    // SCORES PARR-BR (c1 a c10)
    // ============================================
    scores: {
        c1: 6.5, c2: 6.0, c3: 6.5, c4: 5.5, c5: 8.5,
        c6: 4.5, c7: 6.0, c8: 6.0, c9: 3.0, c10: 2.0,
    },

    scoreReasons: {
        c1: 'Giroscópio 3 eixos + padrões de limpeza (serpentino/borda/rotativo) entregam cobertura melhor que "aleatório", mas sem LiDAR/mapeamento real.',
        c2: 'App TUYA (opcional) + controle remoto: modos, automação e ajustes básicos; integração com assistentes não fica clara.',
        c3: 'Mop de arrasto com tanque eletrônico e pressão reforçada (modo molhado), bom para manutenção diária; não é mop vibratório/rotativo.',
        c4: 'Escova central + laterais; há função de levantamento automático da escova no modo mop, mas não há indicação de antiemaranhamento avançado.',
        c5: 'Altura baixa (~8 cm) tende a passar sob muitos móveis e facilita a limpeza embaixo de sofás/armários.',
        c6: 'Marca pouco difundida: tende a ter mais risco de reposição/assistência. Consumíveis podem ser genéricos, mas peças "core" podem ser escassas.',
        c7: '90 min e bateria 2600 mAh atendem bem casas/apês pequenos a médios, com retorno à base quando a carga baixa.',
        c8: 'Ruído declarado ~65 dB é mediano para a categoria: aceitável de dia, pode incomodar em ambientes muito silenciosos.',
        c9: 'Base simples: sem autoesvaziamento, sem lavagem/secagem de mop e sem reabastecimento automático.',
        c10: 'Sem evidências de visão computacional/IA de desvio de objetos; prevenção de obstáculos é básica (sensores/gyro).',
    },

    // ============================================
    // SPECS TÉCNICAS
    // ============================================
    specs: {
        suctionPower: 0,
        batteryCapacity: 2600,
        dustbinCapacity: 0,
        waterTankCapacity: 0,
        noiseLevel: 65,
        width: 32.5,
        height: 8,
        depth: 32.5,
    },

    // Structured specs for scoring module
    structuredSpecs: {
        navigationType: 'gyro',
        mopType: 'static',
        brushType: 'bristle',
        dockType: 'basic',
        obstacleDetection: 'bump-only',
        heightCm: 8,
        noiseDb: 65,
        runtimeMinutes: 90,
        batteryMah: 2600,
    },

    attributes: {
        navigationType: 'gyro',
        hasMop: true,
        mopType: 'pano-arrasto',
        hasAutoEmpty: false,
        hasMapping: false,
        hasNoGoZones: false,
        hasRechargeResume: false,
        hasAppControl: true,
        voiceAssistants: [],
        wifiBand: '2.4ghz',
        climbHeight: 1.5,
        brushType: 'standard_bristle',
        batteryMah: 2600,
        chargingTimeHours: 6,
        runtimeMinutes: 90,
    },

    technicalSpecs: {
        suctionPower: 0,
        dustbinCapacity: 0,
        waterTankCapacity: 0,
        mopType: 'Pano de arrasto (arrasto úmido)',
        brushType: 'Escova central + escovas laterais',
        filterType: 'HEPA',
        navigation: 'Giroscópio 3 eixos + padrões serpentino/borda/rotativo',
        mapping: false,
        lidar: false,
        camera: false,
        obstacleDetection: 'Antiqueda/anti-colisão básico (giroscópio 3 eixos + sensores)',
        climbHeight: 1.5,
        runtime: 'Até 90 min',
        batteryCapacity: 2600,
        chargingTime: '≈6 horas',
        autoRecharge: true,
        rechargeResume: false,
        wifi: true,
        appControl: true,
        voiceControl: 'Não especificado (descrição cita "controle por voz" no título)',
        scheduling: true,
        multiFloorMapping: false,
        dockType: 'Base de recarga simples',
        autoEmpty: false,
        autoMopWash: false,
        autoRefill: false,
        height: 8,
        diameter: 32.5,
        weight: 3.2,
        noiseLevel: 65,
    },

    productDimensions: { diameter: 32.5, height: 8 },

    // ============================================
    // PRODUCT DNA (10 Dimensões Radar)
    // ============================================
    productDna: {
        title: 'DNA do Produto',
        subtitle: 'Perfil técnico em 10 dimensões',
        dimensions: [
            { id: 'c1', name: 'Navegação', shortName: 'Navegação', score: 6.5, weight: 25, icon: 'Radar', color: '#06B6D4', description: 'Giroscópio 3 eixos com padrões de limpeza; sem LiDAR.' },
            { id: 'c2', name: 'Software/App', shortName: 'Software', score: 6.0, weight: 15, icon: 'Smartphone', color: '#8B5CF6', description: 'App TUYA + controle remoto; recursos básicos e automação.' },
            { id: 'c3', name: 'Sistema de Mop', shortName: 'Mop', score: 6.5, weight: 15, icon: 'Droplets', color: '#3B82F6', description: 'Pano de arrasto com tanque eletrônico e modo molhado.' },
            { id: 'c4', name: 'Escovas', shortName: 'Escovas', score: 5.5, weight: 10, icon: 'Brush', color: '#10B981', description: 'Escova central + laterais; sem evidência de antiemaranhamento premium.' },
            { id: 'c5', name: 'Altura/Perfil', shortName: 'Altura', score: 8.5, weight: 10, icon: 'Ruler', color: '#F59E0B', description: 'Altura ~8 cm: bom para passar sob móveis comuns.' },
            { id: 'c6', name: 'Manutenibilidade', shortName: 'Manutenção', score: 4.5, weight: 8, icon: 'Wrench', color: '#64748B', description: 'Maior risco de peças por marca pouco difundida.' },
            { id: 'c7', name: 'Bateria', shortName: 'Bateria', score: 6.0, weight: 5, icon: 'Battery', color: '#22C55E', description: '2600 mAh / 90 min: adequado para rotinas curtas.' },
            { id: 'c8', name: 'Acústica', shortName: 'Ruído', score: 6.0, weight: 5, icon: 'Volume2', color: '#F59E0B', description: '65 dB: mediano; tende a ser ok em horário comercial.' },
            { id: 'c9', name: 'Base/Dock', shortName: 'Base', score: 3.0, weight: 5, icon: 'Home', color: '#EF4444', description: 'Base simples, sem automações de manutenção.' },
            { id: 'c10', name: 'IA/Desvio', shortName: 'IA Desvio', score: 2.0, weight: 2, icon: 'Brain', color: '#EC4899', description: 'Sem evidência de IA/visão para desvio de objetos.' },
        ],
    },

    // ============================================
    // VEREDITO DE AUDITORIA
    // ============================================
    auditVerdict: {
        solution: {
            title: '✅ O A6S resolve bem',
            icon: 'CheckCircle',
            color: 'green',
            items: [
                '2 em 1 para rotina diária (aspira + passa pano)',
                'Padrões de limpeza (serpentino/borda/rotativo) para boa cobertura',
                'App TUYA e controle remoto para operação simples',
                'Retorno automático à base quando a bateria baixa',
                'Perfil baixo (~8 cm) para limpar sob móveis',
            ],
        },
        attentionPoint: {
            title: '⚠️ Pontos de atenção',
            icon: 'AlertTriangle',
            color: 'yellow',
            items: [
                'Sem LiDAR/mapeamento real e sem zonas proibidas',
                'Base simples: sem autoesvaziamento e sem lavagem de mop',
                'Peças "core" podem ser mais difíceis por ser marca pouco difundida',
                'Mop é de arrasto: remove sujeira leve, não substitui esfregão pesado',
            ],
        },
        technicalConclusion: {
            title: '🔬 Conclusão técnica',
            icon: 'Microscope',
            color: 'blue',
            text: 'O WKJWQWHY A6S é um robô de entrada focado em "manutenção diária": aspira e passa pano com um conjunto simples (gyro + padrões de limpeza + base de recarga). Para quem não precisa de mapas/zonas e quer automatizar o básico em pisos frios, entrega uma proposta coerente. O risco está mais em pós-venda/peças e na ausência de recursos premium (LiDAR, estação completa).',
        },
        dontBuyIf: {
            title: '❌ Não compre se',
            icon: 'XCircle',
            color: 'red',
            items: [
                'Você quer mapeamento preciso, múltiplos mapas e zonas proibidas',
                'Você tem muitos tapetes altos/peludos e precisa de alto desempenho específico',
                'Você quer base com autoesvaziamento e manutenção mínima',
                'Você prioriza marca consolidada e fácil reposição de peças',
            ],
        },
    },

    // ============================================
    // CONTEÚDO EDITORIAL
    // ============================================
    benefitSubtitle: '2 em 1 (aspira + passa pano) com app TUYA e caminho serpentino para manter pisos frios em dia',

    featureBenefits: [
        { icon: 'Radar', title: 'Caminho mais previsível', description: 'Padrões serpentino/borda/rotativo aumentam a cobertura vs. robôs aleatórios.' },
        { icon: 'Zap', title: 'App TUYA + controle remoto', description: 'Modos, automação e controle simples pelo celular ou controle dedicado.' },
        { icon: 'Clock', title: 'Até 90 min', description: 'Autonomia para apês/casas pequenas a médias, com retorno automático à base.' },
        { icon: 'Tag', title: 'Tanque eletrônico 2 em 1', description: 'Aspira e passa pano em uma rotina só, com ajuste/controle de água.' },
    ],

    badges: ['best-value'],

    // ============================================
    // OFERTAS
    // ============================================
    offers: [{
        store: 'Amazon',
        storeSlug: 'amazon',
        price: 599.00,
        url: 'https://www.amazon.com.br/dp/B0F9PRD1L2',
        affiliateUrl: 'https://www.amazon.com.br/dp/B0F9PRD1L2?tag=comparatop-20',
        inStock: true,
        lastChecked: '2026-01-29',
    }],

    // ============================================
    // MAIN COMPETITOR
    // ============================================
    mainCompetitor: {
        id: 'wap-robot-w100',
        name: 'WAP Aspirador de Pó Robô ROBOT W100 3 em 1 (Automático, 250ml)',
        shortName: 'WAP W100',
        imageUrl: '/images/products/wap-w100.svg',
        price: 549.90,
        score: 5.7,
        keyDifferences: [
            { label: 'Navegação', current: 'Giroscópio 3 eixos + serpentino', rival: 'Padrões básicos', winner: 'current' },
            { label: 'Autonomia', current: '90 min', rival: '~100 min', winner: 'rival' },
            { label: 'Preço', current: 'R$ 599', rival: 'R$ 549', winner: 'rival' },
        ],
    },

    // ============================================
    // ACESSÓRIO RECOMENDADO
    // ============================================
    recommendedAccessory: {
        asin: 'B09647XBBW',
        name: 'WAP Refil Pano MOP (microfibra) para Robô Aspirador ROBOT W100/W100C',
        shortName: 'Refil Pano MOP',
        price: 35.00,
        imageUrl: '/images/products/refil-pano-mop.svg',
        reason: 'Ter panos extras ajuda a alternar uso/lavagem e manter o desempenho do mop; confira compatibilidade de fixação/medidas antes de comprar.',
        affiliateUrl: 'https://www.amazon.com.br/dp/B09647XBBW?tag=comparatop-20',
    },

    // ============================================
    // VOC - Voz do Consumidor
    // ============================================
    voc: {
        totalReviews: 7,
        averageRating: 4.4,
        consensusScore: 88,
        oneLiner: 'Um "2 em 1" simples com app TUYA e pano de arrasto para manter o chão em dia.',
        summary: 'A proposta agrada quem quer rotina automática (aspirar + passar pano) em pisos frios e tapetes baixos, sem pagar por LiDAR/estação. O ponto crítico é a base simples e a incerteza de pós-venda/peças por ser marca pouco difundida.',
        pros: [
            '2 em 1 (aspira + passa pano) com tanque eletrônico',
            'Padrões de limpeza (serpentino/borda/rotativo) e retorno à base',
            'Altura baixa (~8 cm) ajuda a limpar embaixo de móveis',
        ],
        cons: [
            'Sem mapeamento avançado (LiDAR) e sem zonas proibidas',
            'Peças e suporte podem ser incertos; consumíveis podem exigir adaptação',
        ],
        sources: [
            { name: 'Amazon Brasil', url: 'https://www.amazon.com.br/dp/B0F9PRD1L2', count: 7 },
        ],
    },

    extendedVoc: {
        consensusScore: 8.8,
        totalReviews: '7 avaliações',
        acceptableFlaw: 'Não ter mapeamento LiDAR nem estação (autoesvaziamento/lavagem) — é um "2 em 1" de entrada.',
        realWorldScenario: 'Bom para rotina diária em piso frio (poeira + pano leve) e alguns tapetes baixos; não é a melhor escolha para casa grande ou muita obstrução.',
        goldenTip: 'Use pouca água/controle do tanque e lave o pano com frequência para evitar odor e marcas no piso.',
    },

    // ============================================
    // TCO - Custo Total de Propriedade
    // ============================================
    tcoData: {
        purchasePrice: 599.00,
        energyCost5y: 250.00,
        maintenanceCost5y: 450.00,
        totalCost5y: 1299.00,
        monthlyReserve: 21.65,
        lifespanYears: 4,
    },

    extendedTco: {
        purchasePrice: 599.00,
        energyCost5y: 250.00,
        maintenanceCost5y: 450.00,
        totalCost5y: 1299.00,
        monthlyReserve: 21.65,
        lifespan: {
            years: 4,
            limitingComponent: 'Bateria',
            limitingComponentLife: 3,
            weibullExplanation: 'Robôs de entrada tendem a concentrar falhas precoces em bateria, escovas e sensores; manter filtros/panos limpos e evitar água em excesso reduz risco de falha.',
        },
        repairability: {
            score: 4,
            level: 'Baixo',
            components: [
                {
                    name: 'Placa Principal',
                    score: 3,
                    price: 250,
                    availability: 'Escassa - assistência multimarcas',
                    failureSymptoms: ['Não liga', 'Trava/reinicia', 'Não conecta ao Wi‑Fi'],
                    repairAdvice: 'Priorize garantia; se fora, busque assistência multimarcas (reparo de placa) antes de troca.',
                },
                {
                    name: 'Sensor Principal',
                    score: 4,
                    price: 120,
                    availability: 'Escassa - peças genéricas',
                    failureSymptoms: ['Bate em obstáculos', 'Cai em degraus', 'Gira sem sair do lugar'],
                    repairAdvice: 'Limpeza dos sensores e testes antes de substituir; peças podem ser genéricas/compatíveis.',
                },
                {
                    name: 'Motor de Sucção',
                    score: 5,
                    price: 180,
                    availability: 'Limitada',
                    failureSymptoms: ['Perda forte de sucção', 'Cheiro de queimado', 'Ruído anormal'],
                    repairAdvice: 'Troque filtros antes; se persistir, motor pode exigir substituição.',
                },
                {
                    name: 'Bateria',
                    score: 6,
                    price: 150,
                    availability: 'Limitada - baterias genéricas',
                    failureSymptoms: ['Autonomia cai rápido', 'Não carrega', 'Desliga no meio da limpeza'],
                    repairAdvice: 'Evite descarregar a 0%; se inchada, substitua imediatamente.',
                },
                {
                    name: 'Módulo de Roda',
                    score: 5,
                    price: 120,
                    availability: 'Limitada',
                    failureSymptoms: ['Erro de roda', 'Patina', 'Não sobe pequenos desníveis'],
                    repairAdvice: 'Remova cabelos/linha; se engrenagem gasta, troca do módulo.',
                },
            ],
        },
    },

    // ============================================
    // SIMULADORES
    // ============================================
    simulators: {
        sizeAlert: {
            status: 'ok',
            message: 'Altura ~8 cm: costuma passar sob móveis com vão ≥ 9 cm.',
            idealRange: { min: 6, max: 9 },
        },
        soundAlert: {
            status: 'moderate',
            message: 'Ruído declarado ~65 dB: aceitável para uso diurno; evite rodar em ambientes silenciosos à noite.',
        },
        energyAlert: {
            rating: 'A',
            message: 'Consumo tende a ser baixo/moderado em robôs dessa categoria; custo energético é pequeno no TCO.',
        },
    },

    // ============================================
    // HEADER
    // ============================================
    header: {
        overallScore: 6.1,
        scoreLabel: 'Bom',
        title: 'WKJWQWHY A6S: 2 em 1 de entrada com app TUYA',
        subtitle: 'Robô 2 em 1 com mop de arrasto para manutenção diária em pisos frios',
        badges: [
            { type: 'feature', label: 'Caminho serpentino', icon: 'Radar' },
            { type: 'feature', label: 'App TUYA', icon: 'Zap' },
        ],
    },

    // ============================================
    // DECISION FAQ
    // ============================================
    decisionFAQ: [
        {
            id: 'p1',
            icon: 'AlertTriangle',
            question: 'Ele serve para tapetes?',
            answer: 'Funciona melhor em tapetes baixos ("cabelo curto"). Em tapetes altos/peludos, robôs de entrada tendem a perder eficiência e podem travar no pano/mop.',
        },
        {
            id: 'p2',
            icon: 'Scale',
            question: 'Vale pagar mais por um modelo com LiDAR?',
            answer: 'Se você quer mapa preciso, zonas proibidas e rotas consistentes (especialmente em casas maiores), LiDAR costuma valer. Se o objetivo é só manutenção diária em áreas simples, este tipo de gyro costuma resolver.',
        },
        {
            id: 'p3',
            icon: 'Wrench',
            question: 'O que dá mais problema nesse tipo de robô?',
            answer: 'Bateria e consumíveis (filtro/escovas/pano) são os itens mais comuns. Faça manutenção preventiva (limpeza de filtro, remoção de cabelos, lavagem do pano) e evite excesso de água no tanque.',
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

export default wkjwqwhy_a6s;
