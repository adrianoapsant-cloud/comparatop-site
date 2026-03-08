import type { Product } from '@/types/category';

export const electrolux_erb20: Product = {
    id: 'electrolux-erb20',
    categoryId: 'robot-vacuum',
    name: 'Robô Aspirador Electrolux ERB20 Home-e Control',
    shortName: 'Electrolux ERB20',
    brand: 'Electrolux',
    model: 'ERB20',
    price: 699.00,
    asin: 'B09SVS3DZM',
    imageUrl: 'https://m.media-amazon.com/images/I/61+9X-sV-mL._AC_SL1000_.jpg',
    status: 'published',
    benefitSubtitle: 'Controle remoto e bateria Li-Ion por preço acessível.',

    useSimplifiedPDP: true,
    evidenceLevel: 'medium',
    contextualScoreRange: [5.0, 6.0],
    contextualScoreConfidence: 'high',
    tcoTotalRange: [1900, 2100],
    tcoConfidence: 'high',

    scores: {
        c1: 5.0, // Limpeza (40W)
        c2: 4.0, // Navegação (Aleatória)
        c3: 5.5, // Autonomia (90min)
        c4: 6.0, // Construção
        c5: 4.0, // Recursos App (Não tem App, só controle)
        c6: 9.0, // Custo-Benefício (Capex baixo)
        c7: 6.0, // Bateria
        c8: 6.5, // Ruído
        c9: 1.0, // Base
        c10: 1.0 // IA
    },

    scoreReasons: {
        c1: 'Potência de 40W (aprox 1600Pa). Limpeza ok para pó, sofre com sujeira pesada.',
        c2: 'Navegação aleatória "Autonomous Technology". Não mapeia, repete áreas.',
        c3: '90 minutos de autonomia (Li-Ion). Adequado para apartamentos pequenos.',
        c4: 'Construção honesta, mas plástica. Escovas laterais deformam com o tempo.',
        c5: 'Sem conectividade Wi-Fi/App. Controle remoto infravermelho incluso.',
        c6: 'Bom preço de entrada, mas TCO sobe rápido com consumíveis.',
        c7: 'Bateria Li-Ion 2600mAh é um upgrade vs Ni-MH de concorrentes da faixa.',
        c8: 'Ruído padrão (~70dB). Não é silencioso, mas tolerável.',
        c9: 'Base simples. Ocupa pouco espaço.',
        c10: 'Sensores antiqueda básicos. Bate nos móveis frequentemente.'
    },

    specs: {
        suctionPower: 1600, // Est
        batteryCapacity: 2600,
        dustbinCapacity: 220, // Pequeno
        waterTankCapacity: 0, // Mop a seco/úmido sem tanque dedicado? "Pano MOP"
        noiseLevel: 70,
        width: 29,
        height: 7.0,
        depth: 29
    },

    structuredSpecs: {
        navigationType: 'random',
        mopType: 'static',
        brushType: 'bristle',
        dockType: 'basic',
        obstacleDetection: 'infrared',
        heightCm: 7.0,
        noiseDb: 70,
        runtimeMinutes: 90,
        batteryMah: 2600
    },

    attributes: {
        navigationType: 'random',
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
        batteryMah: 2600,
        chargingTimeHours: 4,
        runtimeMinutes: 90
    },

    voc: {
        oneLiner: 'O "Básico Bem Feito" da Electrolux, mas sem inteligência.',
        pros: ['Altura 7cm (passa em tudo)', 'Controle Remoto Incluso', 'Bateria Li-Ion'],
        cons: ['Caixa de pó minúscula (220ml)', 'Sem App', 'Se perde em casas grandes'],
        totalReviews: 850,
        averageRating: 4.1,
        summary: 'Usuários gostam da altura slim para limpar embaixo de sofás, mas reclamam que o reservatório enche muito rápido.',
        sources: [
            { name: 'Amazon', url: 'https://www.amazon.com.br/dp/B09SVS3DZM#customerReviews', count: 850 }
        ]
    },

    offers: [
        {
            price: 699.00,
            store: 'Amazon',
            storeSlug: 'amazon',
            url: 'https://www.amazon.com.br/dp/B09SVS3DZM?tag=aferio-20&th=1',
            inStock: true,
            lastChecked: '2026-02-04'
        }
    ],

    lastUpdated: '2026-02-04',

    tcoData: {
        purchasePrice: 699.00,
        energyCost5y: 212.00, // Standby alto (3W 24/7 = ~R$ 30/ano)
        maintenanceCost5y: 1130.00, // R$ 980 (Consumíveis + Bateria) + R$ 150 (Corretiva)
        totalCost5y: 2041.00,
        monthlyReserve: 34.00, // Guardar R$ 34/mês para manter
        lifespanYears: 5
    },

    extendedTco: {
        purchasePrice: 699.00,
        energyCost5y: 212.00,
        maintenanceCost5y: 1130.00,
        totalCost5y: 2041.00,
        monthlyReserve: 34.00,
        lifespan: {
            years: 5,
            limitingComponent: 'Bateria Li-Ion',
            limitingComponentLife: 2,
            weibullExplanation: 'Bateria degrada em 24 meses. Valor residual colapsa no ano 3.'
        },
        repairability: {
            score: 7.5,
            level: 'high',
            components: [
                { name: 'Bateria', score: 9, price: 280.00, availability: 'available', failureSymptoms: ['Autonomia < 10min'], repairAdvice: 'Troca fácil.' },
                { name: 'Filtro HEPA', score: 10, price: 40.00, availability: 'available', failureSymptoms: ['Sujo'], repairAdvice: 'Troca semestral.' }
            ]
        }
    },

    auditVerdict: {
        solution: {
            title: 'A Solução',
            icon: 'checkCircle',
            color: 'emerald',
            items: ['Marca Confiável', 'Slim (7cm)', 'Sem complicação de Wi-Fi']
        },
        attentionPoint: {
            title: 'Ponto de Atenção',
            icon: 'alertTriangle',
            color: 'amber',
            items: ['Reservatório 220ml (Muito Pequeno)', 'Custo Bateria (R$ 280)', 'Navegação Aleatória']
        },
        technicalConclusion: {
            title: 'Veredito Técnico',
            icon: 'clipboard',
            color: 'blue',
            text: 'O ERB20 é um "tanque" analógico. Ideal para idosos ou quem não quer configurar Wi-Fi. Mas seu TCO é trapaceiro: a bateria e filtros custam mais que o robô em 5 anos.'
        },
        dontBuyIf: {
            title: 'Não Compre Se',
            icon: 'xCircle',
            color: 'red',
            items: ['Tem casa grande', 'Quer programar pelo celular', 'Tem pets que soltam muito pelo (reservatório enche rápido)']
        }
    },

    productDna: {
        title: 'DNA',
        subtitle: 'Perfil Técnico',
        dimensions: [
            { id: 'c5', name: 'Slim', shortName: '7cm', score: 9.5, weight: 0.4, icon: 'ruler', color: 'purple', description: 'Passa sob tudo.' },
            { id: 'c6', name: 'Custo', shortName: 'R$', score: 9.0, weight: 0.3, icon: 'dollar-sign', color: 'emerald', description: 'Barato.' },
            { id: 'c1', name: 'Nav', shortName: 'Nav', score: 4.0, weight: 0.3, icon: 'radar', color: 'red', description: 'Básica.' }
        ]
    }
};
