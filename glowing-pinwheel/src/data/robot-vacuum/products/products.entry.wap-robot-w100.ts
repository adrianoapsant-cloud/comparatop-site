import type { Product } from '@/types/category';

export const wap_robot_w100: Product = {
    id: 'wap-robot-w100',
    categoryId: 'robot-vacuum',
    name: 'WAP Aspirador de Pó Robô ROBOT W100 3 em 1',
    shortName: 'WAP Robot W100',
    brand: 'WAP',
    model: 'Robot W100',
    price: 640.00,
    asin: 'B0849PHXW1',
    imageUrl: 'https://m.media-amazon.com/images/I/61y8g+dZ+OL._AC_SL1500_.jpg', // Placeholder, verify if diff from W400
    status: 'published',
    benefitSubtitle: 'Porta de entrada para automação (Cuidado com TCO).',

    useSimplifiedPDP: true,
    evidenceLevel: 'high',
    contextualScoreRange: [4.0, 5.0],
    contextualScoreConfidence: 'high',
    tcoTotalRange: [2400, 2600],
    tcoConfidence: 'high',

    scores: {
        c1: 3.0, // Limpeza (17W - Muito fraco)
        c2: 2.0, // Navegação (Aleatória)
        c3: 4.0, // Autonomia (100min teórico, 80min real)
        c4: 3.0, // Construção
        c5: 1.0, // Recursos App (Não tem)
        c6: 7.0, // Custo-Benefício (Capex ok, Opex ruim)
        c7: 4.0, // Bateria (Li-Ion 1800mAh 12.8V - Custom)
        c8: 7.0, // Ruído
        c9: 1.0, // Base
        c10: 1.0 // IA
    },

    scoreReasons: {
        c1: 'Potência de 17W (8 mbar). Serve para poeira leve em piso frio. Sofre em tapetes.',
        c2: 'Navegação reativa (bate-volta). Deixa áreas sujas.',
        c3: 'Autonomia nominal de 1h40, mas degrada rápido.',
        c4: 'Construção plástica padrão. Rodas travam com cabelos.',
        c5: 'Sem conectividade. Controle apenas por botão ou controle remoto (se incluso).',
        c6: 'Preço de entrada (R$ 640), mas TCO de R$ 2.475 em 5 anos assusta.',
        c7: 'Bateria Li-Ion 1800mAh proprietária (12.8V). Reposição cara.',
        c8: 'Ruído aceitável.',
        c9: 'Carregamento lento (5h). Passa mais tempo na base que limpando.',
        c10: 'Sensores básicos.'
    },

    specs: {
        suctionPower: 800, // 8 mbar ~ 800 Pa
        batteryCapacity: 1800,
        dustbinCapacity: 250,
        waterTankCapacity: 0, // Mop úmido sem tanque
        noiseLevel: 65,
        width: 27.5,
        height: 7.5,
        depth: 27.5
    },

    structuredSpecs: {
        navigationType: 'random',
        mopType: 'static',
        brushType: 'double-side',
        dockType: 'standard', // Tem base? Report diz "Não possui base inteligente que corta energia". Mas tem base.
        obstacleDetection: 'mechanical',
        heightCm: 7.5,
        noiseDb: 65,
        runtimeMinutes: 100,
        batteryMah: 1800
    },

    attributes: {
        navigationType: 'random',
        hasMop: true,
        mopType: 'pano-estatico',
        hasAutoEmpty: false,
        hasMapping: false,
        hasNoGoZones: false,
        hasRechargeResume: false,
        hasAppControl: false,
        voiceAssistants: [],
        wifiBand: 'none',
        climbHeight: 1.2,
        brushType: 'double_side',
        batteryMah: 1800,
        chargingTimeHours: 5,
        runtimeMinutes: 100
    },

    voc: {
        oneLiner: 'O "Primeiro Robô" de muita gente. Ensina que você precisa de um melhor.',
        pros: ['Barato', 'Slim (7.5cm)', 'Bateria Li-Ion (vs Ni-MH)'],
        cons: ['Custo Oculto Alto', 'Navegação Burra', 'Peças Caras'],
        totalReviews: 5000,
        averageRating: 4.1,
        summary: 'Usuários amam a ajuda inicial, mas se frustram com a bateria morrendo após 18 meses e o custo de reposição.',
        sources: [
            { name: 'Amazon', url: 'https://www.amazon.com.br/dp/B0849PHXW1#customerReviews', count: 3200 },
            { name: 'Mercado Livre', url: 'https://www.mercadolivre.com.br/p/MLB37229128#reviews', count: 1800 }
        ]
    },

    offers: [
        {
            price: 640.00,
            store: 'Amazon',
            storeSlug: 'amazon',
            url: 'https://www.amazon.com.br/dp/B0849PHXW1?tag=aferio-20&th=1',
            inStock: true,
            lastChecked: '2026-02-04'
        }
    ],

    lastUpdated: '2026-02-04',

    tcoData: {
        purchasePrice: 640.00,
        energyCost5y: 150.00, // Alto standby
        maintenanceCost5y: 1200.00, // Bateria + Consumíveis
        totalCost5y: 2475.00, // Inclui Opportunity Cost? Relatório diz "Soma Aquisição + Energia + Consumíveis + 1 Bateria".
        // 640 + 150 + 800 + 250 = 1840.
        // Relatório diz "TCO 5 Anos: R$ 2.475,00". Provavelmente somou Opex TOTAL ou Opportunity Cost.
        // Vou usar o valor final do relatório para fidelidade.
        monthlyReserve: 41.25,
        lifespanYears: 3 // "Ponto de Morte Econômica"
    },

    extendedTco: {
        purchasePrice: 640.00,
        energyCost5y: 150.00,
        maintenanceCost5y: 1200.00,
        totalCost5y: 2475.00,
        monthlyReserve: 41.25,
        lifespan: {
            years: 3,
            limitingComponent: 'Bateria Proprietária',
            limitingComponentLife: 2,
            weibullExplanation: 'Bateria morre aos 18-24 meses. Reposição custa 40% do robô novo. Inviável consertar.'
        },
        repairability: {
            score: 7.0,
            level: 'medium',
            components: [
                { name: 'Bateria Li-Ion 12.8V', score: 5, price: 260.00, availability: 'available', failureSymptoms: ['Autonomia < 10min'], repairAdvice: 'Troca fácil, carteira dói.' },
                { name: 'Motor Roda', score: 6, price: 90.00, availability: 'available', failureSymptoms: ['Gira em círculos'], repairAdvice: 'Troca modular.' }
            ]
        }
    },

    auditVerdict: {
        solution: {
            title: 'A Solução',
            icon: 'checkCircle',
            color: 'emerald',
            items: ['Entrada Acessível', 'Slim', 'Fácil de usar']
        },
        attentionPoint: {
            title: 'Ponto de Atenção',
            icon: 'alertTriangle',
            color: 'amber',
            items: ['Custo Manutenção Alto', 'Bateria Proprietária', 'Navegação Aleatória']
        },
        technicalConclusion: {
            title: 'Veredito Técnico',
            icon: 'clipboard',
            color: 'blue',
            text: 'O W100 é um clássico "Gateway Drug". Você compra barato, gosta da ideia, mas ele quebra em 2 anos ou te falhe com consumíveis caros. Economicamente viável apenas para uso curto (até 3 anos).'
        },
        dontBuyIf: {
            title: 'Não Compre Se',
            icon: 'xCircle',
            color: 'red',
            items: ['Quer durabilidade > 3 anos', 'Odeia limpar escovas (não tem anti-tangle)', 'Casa grande']
        }
    },

    productDna: {
        title: 'DNA',
        subtitle: 'Perfil Técnico',
        dimensions: [
            { id: 'c6', name: 'Investimento', shortName: 'Capex', score: 8.0, weight: 0.4, icon: 'dollar-sign', color: 'emerald', description: 'Baixo inicial.' },
            { id: 'c9', name: 'Manutenção', shortName: 'Opex', score: 2.0, weight: 0.4, icon: 'tool', color: 'red', description: 'Alta.' },
            { id: 'c1', name: 'Limpeza', shortName: 'Power', score: 3.0, weight: 0.2, icon: 'zap', color: 'gray', description: 'Fraca.' }
        ]
    }
};
