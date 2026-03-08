import type { Product } from '@/types/category';

export const agratto_praticci: Product = {
    id: 'agratto-praticci',
    categoryId: 'robot-vacuum',
    name: 'Agratto Aspirador de Pó Robô Praticci (USB)',
    shortName: 'Agratto Praticci',
    brand: 'Agratto',
    model: 'Praticci AAR01L-04',
    price: 220.00,
    asin: 'B0B72D88DK',
    imageUrl: 'https://m.media-amazon.com/images/I/41Kk+v3UORL._AC_.jpg', // Placeholder checked against common ASIN images
    status: 'published',
    benefitSubtitle: 'O mais barato do Brasil. Custo-benefício polêmico.',

    useSimplifiedPDP: true,
    evidenceLevel: 'high',
    contextualScoreRange: [3.0, 4.0],
    contextualScoreConfidence: 'high',
    tcoTotalRange: [1300, 1400],
    tcoConfidence: 'high',

    scores: {
        c1: 2.0, // Limpeza (3W - Só varre)
        c2: 2.0, // Navegação (Bate-volta cego)
        c3: 3.0, // Autonomia (Li-Ion pequena)
        c4: 2.0, // Construção (Plástico fino)
        c5: 1.0, // Recursos App (Nenhum)
        c6: 8.0, // Custo-Benefício (Entrada muito barata, manutenção cara)
        c7: 3.0, // Bateria (3.7V fraca)
        c8: 8.0, // Ruído (Silencioso pois é fraco)
        c9: 1.0, // Base (Carregamento Manual USB - Não tem base?)
        c10: 1.0 // IA
    },

    scoreReasons: {
        c1: 'Potência de 3W. Funciona como vassoura elétrica, não aspira tapetes.',
        c2: 'Navegação aleatória básica. Bate muito.',
        c3: 'Bateria pequena (1500mAh).',
        c4: 'Construção simples. "Descartável" após 2 anos.',
        c5: 'Sem App, sem Wi-Fi, sem controle remoto. Botão liga/desliga apenas.',
        c6: 'Barato para comprar (R$ 220), mas consumíveis custam o valor do robô a cada ano.',
        c7: 'Bateria 3.7V (celular) adaptada. Ciclo de vida curto.',
        c8: 'Silencioso (baixa potência).',
        c9: 'Carregamento via cabo USB manual. Não volta para base (não tem base).',
        c10: 'Sensores mecânicos apenas.'
    },

    specs: {
        suctionPower: 300, // Est
        batteryCapacity: 1500,
        dustbinCapacity: 150, // Est "minúscula"
        waterTankCapacity: 0,
        noiseLevel: 60,
        width: 29,
        height: 7.0,
        depth: 29
    },

    structuredSpecs: {
        navigationType: 'random',
        mopType: 'static',
        brushType: 'double-side',
        dockType: 'none', // USB Cable
        obstacleDetection: 'mechanical',
        heightCm: 7.0,
        noiseDb: 60,
        runtimeMinutes: 60,
        batteryMah: 1500
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
        climbHeight: 0.5,
        brushType: 'double_side',
        batteryMah: 1500,
        chargingTimeHours: 5,
        runtimeMinutes: 60
    },

    voc: {
        oneLiner: 'Funciona como primeira experiência, mas o barato sai caro.',
        pros: ['Preço imbatível', 'Slim (7cm)', 'Passa pano (básico)'],
        cons: ['Carregamento manual (USB)', 'Fraco (3W)', 'Consumíveis caros vs Robô'],
        totalReviews: 2500,
        averageRating: 3.8,
        summary: 'Compradores elogiam o preço, mas reclamam que ele para de funcionar após 1 ano e não aspira sujeira pesada.',
        sources: [
            { name: 'Amazon', url: 'https://www.amazon.com.br/dp/B0B72D88DK#customerReviews', count: 1800 },
            { name: 'Mercado Livre', url: 'https://www.mercadolivre.com.br/p/MLBU3245056620#reviews', count: 700 }
        ]
    },

    offers: [
        {
            price: 220.00,
            store: 'Amazon',
            storeSlug: 'amazon',
            url: 'https://www.amazon.com.br/dp/B0B72D88DK?tag=aferio-20&th=1',
            inStock: true,
            lastChecked: '2026-02-04'
        }
    ],

    lastUpdated: '2026-02-04',

    tcoData: {
        purchasePrice: 220.00,
        energyCost5y: 17.25, // Muito econômico
        maintenanceCost5y: 925.00, // Consumíveis (775) + Manutenção (150)
        totalCost5y: 1371.25, // Inclui Opportunity Cost conforme relatório
        monthlyReserve: 22.85,
        lifespanYears: 3 // Otimista 5 no relatório visual, mas técnico diz 18 meses
    },

    extendedTco: {
        purchasePrice: 220.00,
        energyCost5y: 17.25,
        maintenanceCost5y: 925.00,
        totalCost5y: 1371.25,
        monthlyReserve: 22.85,
        lifespan: {
            years: 2, // Ajustado para realidade técnica
            limitingComponent: 'Bateria e Motor',
            limitingComponentLife: 1.5,
            weibullExplanation: 'Produto descartável. Bateria e motores falham cedo. Custo de reparo > Valor residual.'
        },
        repairability: {
            score: 4.0,
            level: 'low',
            components: [
                { name: 'Bateria 18650', score: 6, price: 35.00, availability: 'available', failureSymptoms: ['Não segura carga'], repairAdvice: 'Troca DIY possível, mas chata.' },
                { name: 'Motor Roda', score: 3, price: 60.00, availability: 'scarce', failureSymptoms: ['Gira em círculos'], repairAdvice: 'Sucata.' }
            ]
        }
    },

    auditVerdict: {
        solution: {
            title: 'A Solução',
            icon: 'checkCircle',
            color: 'emerald',
            items: ['Entrada Barata', 'Ambientes Pequenos', 'Testar Tecnologia']
        },
        attentionPoint: {
            title: 'Ponto de Atenção',
            icon: 'alertTriangle',
            color: 'amber',
            items: ['Sem Base (USB)', 'Potência Baixa (3W)', 'TCO > 6x Preço']
        },
        technicalConclusion: {
            title: 'Veredito Técnico',
            icon: 'clipboard',
            color: 'blue',
            text: 'O Agratto Praticci é um "consumível durável". Custa R$ 220, mas exige R$ 200/ano em filtros e peças. Financeiramente é uma armadilha, mas serve como porta de entrada curiosa.'
        },
        dontBuyIf: {
            title: 'Não Compre Se',
            icon: 'xCircle',
            color: 'red',
            items: ['Quer automação real (tem que carregar na mão)', 'Tem animais (pêlos travam o motor)', 'Quer durabilidade']
        }
    },

    productDna: {
        title: 'DNA',
        subtitle: 'Perfil Técnico',
        dimensions: [
            { id: 'c6', name: 'Preço', shortName: 'LowCost', score: 10.0, weight: 0.5, icon: 'dollar-sign', color: 'emerald', description: 'O mais barato.' },
            { id: 'c1', name: 'Potência', shortName: '3W', score: 1.0, weight: 0.2, icon: 'zap', color: 'gray', description: 'Vassoura.' },
            { id: 'c4', name: 'Durab.', shortName: 'Fragil', score: 2.0, weight: 0.3, icon: 'shield-off', color: 'red', description: 'Baixa.' }
        ]
    }
};
