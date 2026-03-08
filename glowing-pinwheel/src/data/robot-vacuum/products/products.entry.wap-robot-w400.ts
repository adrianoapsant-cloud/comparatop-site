import type { Product } from '@/types/category';

export const wap_robot_w400: Product = {
    id: 'wap-robot-w400',
    categoryId: 'robot-vacuum',
    name: 'WAP Aspirador de Pó Robô ROBOT W400 3 em 1',
    shortName: 'WAP Robot W400',
    brand: 'WAP',
    model: 'ROBOT W400',
    price: 899.00, // Price updated to R$ 899 (User Request)
    asin: 'B0CGBR6QFC',
    imageUrl: 'https://m.media-amazon.com/images/I/61y8g+dZ+OL._AC_SL1500_.jpg', // Enhanced Image
    status: 'published',
    benefitSubtitle: 'Robô de entrada com compatibilidade Alexa/Google.',

    useSimplifiedPDP: true,
    evidenceLevel: 'high',
    contextualScoreRange: [6.0, 7.0],
    contextualScoreConfidence: 'high',
    tcoTotalRange: [2200, 2400],
    tcoConfidence: 'high',

    scores: {
        c1: 4.0, // Limpeza (30W motor, 1400Pa)
        c2: 7.5, // Navegação (Aleatória + App Control)
        c3: 6.0, // Autonomia (100min)
        c4: 5.5, // Construção
        c5: 8.0, // Recursos App (Diferecial: App + Voz)
        c6: 9.0, // Custo-Benefício (Baixo Capex)
        c7: 6.0, // Bateria
        c8: 7.0, // Ruído
        c9: 1.0, // Base
        c10: 2.0 // IA
    },

    scoreReasons: {
        c1: 'Limpeza básica (30W/1400Pa). Destaque para escova central "Turbo Brush", mas sucção é modesta.',
        c2: 'Navegação "Bate-e-Volta" aleatória. Mas vence concorrentes por ter App e Controle de Voz.',
        c3: '100 minutos de autonomia (teórica). Bateria Li-Ion 2600mAh é ponto positivo vs Ni-MH.',
        c4: 'Construção plástica padrão. Rodas e escovas acumulam sujeira fácil.',
        c5: 'App WAP Connect funciona bem. Integração Alexa/Google é o grande diferencial.',
        c6: 'Preço de R$ 899 é agressivo. TCO penalizado por manutenção e consumíveis.',
        c7: 'Bateria Li-Ion 2600mAh 11.1V. Ciclo de vida ~2 anos (500 ciclos).',
        c8: 'Nível de ruído aceitável (65dB). Modo padrão não incomoda.',
        c9: 'Base simples de contato. Sem auto-esvaziamento.',
        c10: 'Sensores IR antiqueda e colisão básicos. Sem mapeamento ou IA visual.',
    },

    specs: {
        suctionPower: 1400, // Pa
        batteryCapacity: 2600, // mAh
        dustbinCapacity: 300,
        waterTankCapacity: 200, // Estático
        noiseLevel: 65,
        width: 32,
        height: 7.5,
        depth: 32,
    },

    structuredSpecs: {
        navigationType: 'random',
        mopType: 'static',
        brushType: 'bristle',
        dockType: 'basic',
        obstacleDetection: 'infrared',
        heightCm: 7.5,
        noiseDb: 65,
        runtimeMinutes: 100,
        batteryMah: 2600,
    },

    attributes: {
        navigationType: 'random',
        hasMop: true,
        mopType: 'pano-estatico',
        hasAutoEmpty: false,
        hasMapping: false,
        hasNoGoZones: false,
        hasRechargeResume: false,
        hasAppControl: true,
        voiceAssistants: ['alexa', 'google'],
        wifiBand: '2.4ghz',
        climbHeight: 1.5,
        brushType: 'bristle',
        batteryMah: 2600,
        chargingTimeHours: 4,
        runtimeMinutes: 100,
    },

    voc: {
        oneLiner: 'O "inteligente" mais barato do mercado. Alexa funciona, mas ele se perde.',
        pros: ['Comando de voz (Alexa/Google)', 'Preço < R$ 1000', 'Bateria Li-Ion'],
        cons: ['Navegação burra (aleatória)', 'Reservatório pequeno (300ml)', 'Enrosca em fios'],
        totalReviews: 1433,
        averageRating: 4.2,
        summary: 'Usuários valorizam a conectividade rara nessa faixa de preço. A frustração vem da navegação aleatória que exige supervisão.',
        sources: [
            { name: 'Amazon', url: 'https://www.amazon.com.br/dp/B0CGBR6QFC#customerReviews', count: 1433 }
        ]
    },

    offers: [
        {
            price: 899.00,
            store: 'Amazon',
            storeSlug: 'amazon',
            url: 'https://www.amazon.com.br/dp/B0CGBR6QFC?tag=aferio-20&th=1',
            inStock: true,
            lastChecked: '2026-02-04'
        },
        {
            price: 920.00,
            store: 'Mercado Livre',
            storeSlug: 'mercadolivre',
            url: 'https://lista.mercadolivre.com.br/wap-robot-w400#D[A:wap-robot-w400]',
            inStock: true,
            lastChecked: '2026-02-04'
        }
    ],

    lastUpdated: '2026-02-04',

    tcoData: {
        purchasePrice: 899.00,
        energyCost5y: 160.00, // Alto custo de standby e ineficiência
        maintenanceCost5y: 350.00, // Falhas mecânicas
        totalCost5y: 2269.00, // Inclui consumíveis
        monthlyReserve: 38.00,
        lifespanYears: 5,
    },

    extendedTco: {
        purchasePrice: 899.00,
        energyCost5y: 160.00,
        maintenanceCost5y: 350.00,
        totalCost5y: 2269.00,
        monthlyReserve: 38.00,
        lifespan: {
            years: 5,
            limitingComponent: 'Bateria Li-Ion',
            limitingComponentLife: 2, // 500 ciclos
            weibullExplanation: 'Bateria degrada rápido (2 anos) devido ao uso ineficiente (navegação aleatória consome mais ciclos).',
        },
        repairability: {
            score: 7.0,
            level: 'high',
            components: [
                { name: 'Bateria', score: 9, price: 180.00, availability: 'available', failureSymptoms: ['Não volta pra base'], repairAdvice: 'Troca fácil (bateria plug-and-play).' },
                { name: 'Placa Mãe', score: 4, price: 400.00, availability: 'scarce', failureSymptoms: ['Morte súbita'], repairAdvice: 'Inviabiliza reparo (custo > 50% do valor residual).' }
            ]
        }
    },

    auditVerdict: {
        solution: {
            title: 'A Solução',
            icon: 'checkCircle',
            color: 'emerald',
            items: ['Conectividade Alexa/Google', 'Preço Acessível', 'Manutenção Simples']
        },
        attentionPoint: {
            title: 'Ponto de Atenção',
            icon: 'alertTriangle',
            color: 'amber',
            items: ['Navegação Aleatória', 'Custo Oculto (Consumíveis)', 'Autonomia Limitada']
        },
        technicalConclusion: {
            title: 'Veredito Técnico',
            icon: 'clipboard',
            color: 'blue',
            text: 'O W400 é a porta de entrada para automação conectada. Financeiramente perigoso no longo prazo (Consumíveis + Bateria), mas entrega a conveniência de voz que nenhum concorrente nessa faixa tem.'
        },
        dontBuyIf: {
            title: 'Não Compre Se',
            icon: 'xCircle',
            color: 'red',
            items: ['Casa grande (>60m²)', 'Muitos obstáculos/tapetes', 'Quer limpeza rápida']
        }
    },

    productDna: {
        title: 'DNA',
        subtitle: 'Perfil Técnico',
        dimensions: [
            { id: 'c2', name: 'Smart', shortName: 'App', score: 8.0, weight: 0.3, icon: 'smartphone', color: 'purple', description: 'Alexa/Google nativo.' },
            { id: 'c6', name: 'Custo', shortName: 'R$', score: 9.0, weight: 0.3, icon: 'dollar-sign', color: 'emerald', description: 'Baixo investimento.' },
            { id: 'c1', name: 'Nav', shortName: 'Nav', score: 3.0, weight: 0.4, icon: 'radar', color: 'red', description: 'Aleatória.' }
        ]
    }
};
