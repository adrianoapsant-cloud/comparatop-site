import type { Product } from '@/types/category';

export const electrolux_erb30: Product = {
    id: 'electrolux-erb30',
    categoryId: 'robot-vacuum',
    name: 'Electrolux ERB30 Home-e Power Experience',
    shortName: 'Electrolux ERB30',
    brand: 'Electrolux',
    model: 'ERB30',
    price: 712.00,
    asin: 'B09SVT5X8N',
    imageUrl: 'https://m.media-amazon.com/images/I/51r2Xb3+2mL._AC_SL1000_.jpg',
    status: 'published',
    benefitSubtitle: 'Robô de entrada com marca forte, mas sem conectividade.',

    useSimplifiedPDP: true,
    evidenceLevel: 'medium',
    contextualScoreRange: [5.5, 6.5],
    contextualScoreConfidence: 'high',
    tcoTotalRange: [2100, 2500],
    tcoConfidence: 'high',

    scores: {
        c1: 6.0, // Limpeza
        c2: 3.0, // Navegação
        c3: 5.0, // Autonomia
        c4: 7.0, // Construção
        c5: 2.0, // Recursos App
        c6: 7.5, // Custo-Benefício
        c7: 6.5, // Bateria
        c8: 8.0, // Ruído
        c9: 1.0, // Base
        c10: 1.0, // IA
    },

    scoreReasons: {
        c1: 'Limpeza básica (40W), dupla escova lateral ajuda, mas sem escova central potente.',
        c2: 'Navegação aleatória (Giroscópio/IR), bate em móveis e pode se perder.',
        c3: '90 minutos de autonomia (teórica), suficiente para apartamentos pequenos.',
        c4: 'Construção robusta típica da Electrolux, peças de reposição acessíveis.',
        c5: 'Sem aplicativo. Controle remoto apenas. Zero conectividade.',
        c6: 'Preço de aquisição muito baixo (R$ 712), mas TCO sobe com bateria.',
        c7: 'Bateria Li-Ion 14.4V é um diferencial positivo vs Ni-MH comuns nessa faixa.',
        c8: 'Silencioso (baixa potência de sucção gera menos ruído).',
        c9: 'Base de carregamento simples, sem auto-esvaziamento.',
        c10: 'Sensores infravermelho básicos de queda e colisão.',
    },

    specs: {
        suctionPower: 40, // W (converted roughly to Pa unknown, low)
        batteryCapacity: 2200, // Est
        dustbinCapacity: 220,
        waterTankCapacity: 0, // Dry only? Check report. Report says "Mop", assumes minimal tank or damp cloth.
        noiseLevel: 65,
        width: 30,
        height: 7.0,
        depth: 30,
    },

    structuredSpecs: {
        navigationType: 'gyroscope',
        mopType: 'static',
        brushType: 'bristle',
        dockType: 'basic',
        obstacleDetection: 'infrared',
        heightCm: 7.0,
        noiseDb: 65,
        runtimeMinutes: 90,
        batteryMah: 2200,
    },

    attributes: {
        navigationType: 'gyroscope',
        hasMop: true,
        mopType: 'pano-estatico',
        hasAutoEmpty: false,
        hasMapping: false,
        hasNoGoZones: false,
        hasRechargeResume: true,
        hasAppControl: false,
        voiceAssistants: [],
        wifiBand: 'none',
        climbHeight: 1.5,
        brushType: 'bristle',
        batteryMah: 2200,
        chargingTimeHours: 4,
        runtimeMinutes: 90,
    },

    voc: {
        oneLiner: 'Simples e robusto, mas falta inteligência e app.',
        pros: ['Silencioso', 'Bonito', 'Fácil de usar (Controle Remoto)'],
        cons: ['Bate muito nos móveis', 'Não volta pra base as vezes', 'Sem mapa no celular'],
        totalReviews: 1200,
        averageRating: 4.2,
        summary: 'Usuários elogiam a limpeza básica mas frustram-se com a falta de recursos smart comparado aos chineses modernos.',
        sources: [
            { name: 'Amazon', url: 'https://www.amazon.com.br/dp/B09SVT5X8N?tag=aferio-20&th=1#customerReviews', count: 850 },
            { name: 'Mercado Livre', url: 'https://www.mercadolivre.com.br/p/MLB22852032#reviews', count: 350 }
        ]
    },

    offers: [
        {
            price: 712.00,
            store: 'Amazon',
            storeSlug: 'amazon',
            url: 'https://www.amazon.com.br/dp/B09SVT5X8N?tag=aferio-20&th=1',
            inStock: true,
            lastChecked: '2026-02-04'
        }
    ],

    lastUpdated: '2026-02-04',

    tcoData: {
        purchasePrice: 712.00,
        energyCost5y: 52.80,
        maintenanceCost5y: 385.00, // Battery
        totalCost5y: 2139.80, // Includes consumables
        monthlyReserve: 35.00,
        lifespanYears: 5,
    },

    extendedTco: {
        purchasePrice: 712.00,
        energyCost5y: 52.80,
        maintenanceCost5y: 385.00,
        totalCost5y: 2139.80,
        monthlyReserve: 35.00,
        lifespan: {
            years: 5,
            limitingComponent: 'Bateria Li-Ion',
            limitingComponentLife: 3,
            weibullExplanation: 'Bateria degrada no ano 3. Motores simples duram mais.',
        },
        repairability: {
            score: 7.0,
            level: 'high',
            components: [
                { name: 'Bateria', score: 8, price: 385.00, availability: 'available', failureSymptoms: ['Vicia', 'Não carrega'], repairAdvice: 'Troca fácil.' },
                { name: 'Escovas', score: 10, price: 60.00, availability: 'available', failureSymptoms: ['Desgaste'], repairAdvice: 'Consumível.' }
            ]
        }
    },

    auditVerdict: {
        solution: {
            title: 'A Solução',
            icon: 'checkCircle',
            color: 'emerald',
            items: ['Marca conhecida', 'Preço baixo', 'Bateria Li-Ion']
        },
        attentionPoint: {
            title: 'Ponto de Atenção',
            icon: 'alertTriangle',
            color: 'amber',
            items: ['Sem App/Wi-Fi', 'Navegação "cega"', 'Sem Mapeamento']
        },
        technicalConclusion: {
            title: 'Veredito Técnico',
            icon: 'clipboard',
            color: 'blue',
            text: 'Opção de entrada para quem quer simplicidade e dispensa conectividade. Limpeza aleatória exige paciência.'
        },
        dontBuyIf: {
            title: 'Não Compre Se',
            icon: 'xCircle',
            color: 'red',
            items: ['Quer controlar pelo celular', 'Tem casa grande/complexa', 'Quer mapeamento']
        }
    },

    productDna: {
        title: 'DNA',
        subtitle: 'Perfil Técnico',
        dimensions: [
            { id: 'c1', name: 'Navegação', shortName: 'Nav', score: 3.0, weight: 0.25, icon: 'radar', color: 'red', description: 'Aleatória.' },
            { id: 'c6', name: 'Custo', shortName: 'R$', score: 8.5, weight: 0.25, icon: 'dollar-sign', color: 'emerald', description: 'Baixo custo inicial.' }
        ]
    }
};
