/**
 * Liectroux XR500 Pro - Robot Vacuum Entry
 * Generated: 2026-01-29
 * Category: robot-vacuum
 */

import type { Product } from '@/types/category';

export const liectroux_xr500_pro: Product = {
    id: 'liectroux-xr500-pro',
    categoryId: 'robot-vacuum',

    name: 'Robô Aspirador Liectroux XR500 Pro 3 em 1 (LiDAR, App, Alexa/Google)',
    shortName: 'Liectroux XR500 Pro',
    brand: 'Liectroux',
    model: 'XR500 Pro',

    imageUrl: '/images/products/liectroux-xr500-pro.svg',
    gallery: ['/images/products/liectroux-xr500-pro.svg'],

    price: 1889.00,

    lastUpdated: '2026-01-29',
    status: 'published',
    useSimplifiedPDP: true,

    // Evidência e confiança
    evidenceLevel: 'high',
    contextualScoreRange: [7.0, 8.1],
    tcoTotalRange: [2700, 3400],
    tcoConfidence: 'low',

    // ===========================================================
    // 🧠 Scores (PARR-BR Framework)
    // ===========================================================
    scores: {
        c1: 8.9,  // Navegação - LiDAR com mapeamento
        c2: 8.0,  // Software/App
        c3: 7.0,  // Sistema de Mop
        c4: 7.0,  // Escovas
        c5: 7.2,  // Altura
        c6: 6.8,  // Manutenibilidade
        c7: 8.0,  // Bateria
        c8: 6.0,  // Acústica
        c9: 5.5,  // Base
        c10: 4.8, // IA
    },

    scoreReasons: {
        c1: 'LiDAR com mapeamento, divisão de cômodos, zonas proibidas e até 5 mapas salvos.',
        c2: 'App com agendamento, acompanhamento em tempo real, zonas/áreas e suporte a controle remoto.',
        c3: 'Mop de arrasto com padrão em Y: bom para manutenção, não substitui esfregação pesada.',
        c4: 'Conjunto padrão (escova central + laterais). Boa cobertura, mas não é um sistema anti-tangle avançado.',
        c5: '9,7 cm: passa sob boa parte de móveis, mas pode limitar em alguns sofás/camas mais baixos.',
        c6: 'Consumíveis e algumas peças disponíveis na loja oficial; peças eletrônicas tendem a exigir assistência.',
        c7: '≈150 min e 3200 mAh: acima da média do segmento mid-range.',
        c8: 'Nível de ruído não informado; assume-se padrão do segmento.',
        c9: 'Base simples (sem autoesvaziamento/auto-lavagem).',
        c10: 'Reconhecimento automático de tapetes; não possui desvio avançado de objetos por IA/câmera.',
    },

    // ===========================================================
    // 🔎 Specs Técnicas
    // ===========================================================
    specs: {
        suctionPower: 0,
        batteryCapacity: 3200,
        dustbinCapacity: 400,
        waterTankCapacity: 250,
        noiseLevel: 0,
        width: 34.5,
        height: 9.7,
        depth: 34.5,
    },

    // Structured specs for scoring module
    structuredSpecs: {
        navigationType: 'lidar',
        mopType: 'static',
        brushType: 'bristle',
        dockType: 'auto-empty',
        obstacleDetection: 'bump-only',
        heightCm: 9.7,
        runtimeMinutes: 150,
        batteryMah: 3200,
    },

    attributes: {
        navigationType: 'lidar',
        hasMop: true,
        mopType: 'passive_drag',
        hasAutoEmpty: false,
        hasMapping: true,
        hasNoGoZones: true,
        hasRechargeResume: true,
        hasAppControl: true,
        voiceAssistants: ['alexa', 'google'],
        wifiBand: '2.4ghz',
        climbHeight: 2.0,
        brushType: 'standard_bristle',
        batteryMah: 3200,
        chargingTimeHours: 5,
        runtimeMinutes: 150,
    },

    technicalSpecs: {
        suctionPower: 'Não informado (fabricante)',
        dustbinCapacity: 400,
        waterTankCapacity: 250,
        mopType: 'Pano de arrasto (padrão em "Y")',
        brushType: 'Escova central + escovas laterais',
        filterType: 'HEPA',
        navigation: 'Navegação a laser (LiDAR)',
        mapping: true,
        lidar: true,
        camera: false,
        obstacleDetection: 'Sensores anti-colisão + anti-queda (desníveis até 8 cm)',
        climbHeight: 2.0,
        runtime: 'Aprox. 150 minutos',
        batteryCapacity: 3200,
        chargingTime: 'Entre 240 e 360 minutos',
        autoRecharge: true,
        rechargeResume: true,
        wifi: true,
        appControl: true,
        voiceControl: 'Compatível com Alexa e Assistente do Google (via app)',
        scheduling: true,
        multiFloorMapping: true,
        dockType: 'Base de carregamento simples (sem autoesvaziamento)',
        autoEmpty: false,
        autoMopWash: false,
        autoRefill: false,
        height: 9.7,
        diameter: 34.5,
        weight: 3.0,
        noiseLevel: 'Não informado (fabricante)',
    },

    productDimensions: { diameter: 34.5, height: 9.7 },

    // ===========================================================
    // 🧬 Product DNA (Radar Chart) - 10 Dimensões PARR-BR
    // ===========================================================
    productDna: {
        title: 'DNA do Produto',
        subtitle: 'Perfil técnico em 10 dimensões',
        dimensions: [
            { id: 'c1', name: 'Navegação', shortName: 'Navegação', score: 8.9, weight: 12, icon: 'Radar', color: '#3B82F6', description: 'LiDAR com mapeamento, divisão de cômodos, zonas proibidas e até 5 mapas salvos.' },
            { id: 'c2', name: 'Software/App', shortName: 'Software', score: 8.0, weight: 10, icon: 'Smartphone', color: '#8B5CF6', description: 'App com agendamento, acompanhamento em tempo real, zonas/áreas e suporte a controle remoto.' },
            { id: 'c3', name: 'Sistema de Mop', shortName: 'Mop', score: 7.0, weight: 10, icon: 'Droplets', color: '#06B6D4', description: 'Mop de arrasto com padrão em Y: bom para manutenção, não substitui esfregação pesada.' },
            { id: 'c4', name: 'Escovas', shortName: 'Escovas', score: 7.0, weight: 10, icon: 'Brush', color: '#10B981', description: 'Conjunto padrão (escova central + laterais). Boa cobertura, mas não é anti-tangle avançado.' },
            { id: 'c5', name: 'Altura/Perfil', shortName: 'Altura', score: 7.2, weight: 8, icon: 'Ruler', color: '#F59E0B', description: '9,7 cm: passa sob boa parte de móveis, mas pode limitar em alguns sofás/camas mais baixos.' },
            { id: 'c6', name: 'Manutenibilidade', shortName: 'Manutenção', score: 6.8, weight: 10, icon: 'Wrench', color: '#EF4444', description: 'Consumíveis e algumas peças disponíveis na loja oficial; eletrônica exige assistência.' },
            { id: 'c7', name: 'Bateria', shortName: 'Bateria', score: 8.0, weight: 10, icon: 'Battery', color: '#22C55E', description: '≈150 min e 3200 mAh: acima da média do segmento mid-range.' },
            { id: 'c8', name: 'Acústica', shortName: 'Ruído', score: 6.0, weight: 8, icon: 'Volume2', color: '#A855F7', description: 'Nível de ruído não informado; assume-se padrão do segmento.' },
            { id: 'c9', name: 'Base/Dock', shortName: 'Base', score: 5.5, weight: 10, icon: 'Home', color: '#EC4899', description: 'Base simples (sem autoesvaziamento/auto-lavagem).' },
            { id: 'c10', name: 'IA/Desvio', shortName: 'IA Desvio', score: 4.8, weight: 12, icon: 'Brain', color: '#F97316', description: 'Reconhecimento automático de tapetes; não possui desvio avançado de objetos por IA/câmera.' },
        ],
    },

    // ===========================================================
    // ⚖️ Veredito de Auditoria
    // ===========================================================
    auditVerdict: {
        solution: {
            title: '✅ O XR500 Pro resolve bem',
            icon: 'CheckCircle',
            color: 'green',
            items: [
                'Manutenção diária do piso sem supervisão',
                'Navegação inteligente em apartamentos com múltiplos cômodos',
                'Mapeamento permanente para casas de 2+ andares',
                'Limpeza programada enquanto você trabalha',
            ],
        },
        attentionPoint: {
            title: '⚠️ Pontos de atenção',
            icon: 'AlertTriangle',
            color: 'yellow',
            items: [
                'Mop de arrasto é básico - não substitui esfregação pesada',
                'Base simples: você esvazia o reservatório manualmente',
                'App pode ter tradução incompleta para português',
            ],
        },
        technicalConclusion: {
            title: '🔬 Conclusão técnica',
            icon: 'Microscope',
            color: 'blue',
            text: 'O Liectroux XR500 Pro entrega navegação LiDAR de nível premium por preço mid-range. Ideal para quem quer inteligência de mapeamento sem pagar R$3.000+ em marcas como Roborock ou Ecovacs. A limitação é a base simples e o mop passivo.',
        },
        dontBuyIf: {
            title: '❌ Não compre se',
            icon: 'XCircle',
            color: 'red',
            items: [
                'Precisa de autoesvaziamento (base all-in-one)',
                'Quer esfregação com pressão (mop rotativo/vibratório)',
                'Casa tem muitos obstáculos pequenos (brinquedos, cabos) e você precisa de desvio por IA/câmera',
            ],
        },
    },

    // ===========================================================
    // 🧠 Conteúdo Editorial
    // ===========================================================
    benefitSubtitle: 'LiDAR + mapas salvos + aspira e passa pano ao mesmo tempo, com boa autonomia.',

    featureBenefits: [
        { icon: 'Radar', title: 'LiDAR com mapas e zonas', description: 'Mapeia, nomeia cômodos, define barreiras virtuais e salva até 5 mapas.' },
        { icon: 'Zap', title: 'Aspira + pano simultâneo', description: 'Reservatório 2 em 1 para manutenção rápida do piso no dia a dia.' },
        { icon: 'Clock', title: 'Autonomia e retomada', description: '≈150 min por carga, retorna para recarga e retoma do ponto de interrupção.' },
        { icon: 'Shield', title: 'Navegação segura', description: 'Sensores anti-colisão e anti-queda; detecção de desníveis até 8 cm.' },
    ],

    // ===========================================================
    // 🏷️ Badges
    // ===========================================================
    badges: ['best-value'],

    // ===========================================================
    // 💰 Ofertas
    // ===========================================================
    offers: [
        {
            store: 'Liectroux Brasil (Loja Oficial)',
            storeSlug: 'liectroux',
            price: 1889.00,
            originalPrice: 2499.00,
            url: 'https://www.liectroux.com.br/produtos/liectroux-xr500-pro/',
            affiliateUrl: 'https://www.liectroux.com.br/produtos/liectroux-xr500-pro/',
            inStock: true,
            lastChecked: '2026-01-29',
        },
        {
            store: 'Amazon.com.br',
            storeSlug: 'amazon',
            price: 1889.00,
            originalPrice: 2489.00,
            url: 'https://www.amazon.com.br/dp/B0F3G2JX4C',
            affiliateUrl: 'https://www.amazon.com.br/dp/B0F3G2JX4C?tag=comparatop-20',
            inStock: true,
            lastChecked: '2026-01-29',
        },
    ],

    // ===========================================================
    // 🔥 Main Competitor
    // ===========================================================
    mainCompetitor: {
        id: 'liectroux-xr500',
        name: 'Liectroux XR500',
        shortName: 'XR500',
        imageUrl: '/images/products/competidor.svg',
        price: 2799.00,
        score: 7.1,
        keyDifferences: [
            { label: 'Autonomia', current: '≈150 min', rival: '≈120 min', winner: 'current' },
            { label: 'Aspira + pano simultâneo', current: 'Sim', rival: 'Não', winner: 'current' },
            { label: 'Preço', current: 'R$ 1.889', rival: 'R$ 2.799', winner: 'current' },
        ],
    },

    // ===========================================================
    // 🧼 Acessório recomendado
    // ===========================================================
    recommendedAccessory: {
        asin: 'EXTERNAL',
        name: 'Kit Básico - Liectroux XR500 Pro',
        shortName: 'Kit Básico XR500 Pro',
        price: 193.99,
        imageUrl: '/images/products/acessorio-consumiveis.svg',
        reason: 'Inclui escovas e filtros para manter a performance e reduzir queda de sucção ao longo do tempo.',
        affiliateUrl: 'https://www.liectroux.com.br/produtos/kit-basico-liectroux-xr500-pro/',
    },

    // ===========================================================
    // 🗣️ Voice of Customer (VOC)
    // ===========================================================
    voc: {
        totalReviews: 198,
        averageRating: 4.7,
        consensusScore: 84,
        oneLiner: 'LiDAR preciso + ótimo custo-benefício, mas mop é básico.',
        summary: 'Usuários elogiam a navegação LiDAR precisa e a autonomia de ~150 min. Alguns reclamam do app em português incompleto e do mop básico.',
        pros: [
            'Navegação LiDAR muito precisa, não fica preso',
            'Mapeia a casa rápido e salva múltiplos andares',
            'Boa autonomia para apartamentos médios/grandes',
            'Custo-benefício excelente comparado a marcas premium',
        ],
        cons: [
            'App com tradução incompleta para português',
            'Mop de arrasto não remove manchas pesadas',
            'Suporte técnico pode demorar para responder',
        ],
        sources: [
            { name: 'Liectroux Brasil', url: 'https://www.liectroux.com.br', count: 198 },
        ],
    },

    extendedVoc: {
        consensusScore: 8.4,
        totalReviews: '198+ avaliações',
        acceptableFlaw: 'Mop de arrasto é básico - bom para manutenção diária, não substitui esfregação pesada.',
        realWorldScenario: 'Ideal para quem quer um robô com navegação inteligente (LiDAR) para manter o piso limpo no dia a dia, sem pagar o preço de marcas premium como Roborock ou Ecovacs.',
        goldenTip: 'Configure zonas proibidas para áreas com cabos ou tapetes felpudos. Salve mapas separados para cada andar.',
    },

    // ===========================================================
    // 💰 TCO (Custo Total de Propriedade)
    // ===========================================================
    tcoData: {
        purchasePrice: 1889,
        energyCost5y: 150,      // ~R$2.50/mês (consumo baixo, só quando opera)
        maintenanceCost5y: 600, // Filtros, escovas, panos de reposição
        totalCost5y: 2639,
        monthlyReserve: 12.50,  // Reserva mensal para manutenção
        lifespanYears: 5,
    },

    extendedTco: {
        purchasePrice: 1889,
        energyCost5y: 150,
        maintenanceCost5y: 600,
        totalCost5y: 2639,
        monthlyReserve: 12.50,
        lifespan: {
            years: 5,
            categoryAverage: 4,
            limitingComponent: 'Bateria',
            limitingComponentLife: 3,
            weibullExplanation: 'Baterias de LiFePO4 em robôs aspiradores tipicamente perdem capacidade significativa após 2-3 anos de uso intenso diário.',
        },
        repairability: {
            score: 6.5,
            level: 'Moderado',
            categoryAverage: 5.5,
            components: [
                {
                    name: 'Bateria',
                    score: 7,
                    price: 299,
                    availability: 'Disponível na loja oficial',
                    failureSymptoms: ['Autonomia reduzida', 'Não completa limpeza', 'Desliga antes de voltar à base'],
                    repairAdvice: 'Substituição simples - acessível pela tampa inferior com chave Phillips.',
                },
                {
                    name: 'Escova Central',
                    score: 9,
                    price: 49,
                    availability: 'Fácil - loja oficial e marketplaces',
                    failureSymptoms: ['Ruído excessivo', 'Cabelos enrolados', 'Limpeza desigual'],
                    repairAdvice: 'Peça mais trocada. Recomendado limpeza semanal e troca a cada 6-12 meses.',
                },
                {
                    name: 'Filtro HEPA',
                    score: 9,
                    price: 39,
                    availability: 'Fácil - kit de reposição',
                    failureSymptoms: ['Perda de sucção', 'Poeira escapando', 'Odor ao aspirar'],
                    repairAdvice: 'Lavar mensalmente, trocar a cada 3-6 meses.',
                },
                {
                    name: 'Sensor LiDAR',
                    score: 3,
                    price: 450,
                    availability: 'Difícil - só assistência técnica',
                    failureSymptoms: ['Mapeamento incorreto', 'Batidas frequentes', 'Anda em círculos'],
                    repairAdvice: 'Componente crítico. Se falhar, considerar enviar para assistência oficial.',
                },
                {
                    name: 'Rodas/Motor de Tração',
                    score: 6,
                    price: 129,
                    availability: 'Disponível na loja oficial',
                    failureSymptoms: ['Não sobe degraus', 'Anda torto', 'Ruído nas rodas'],
                    repairAdvice: 'Verificar se há cabelos ou detritos presos antes de trocar.',
                },
            ],
        },
    },

    // ===========================================================
    // 📐 Simuladores Inteligentes
    // ===========================================================
    simulators: {
        sizeAlert: {
            status: 'ok',
            message: 'Com 9,7 cm de altura, passa sob a maioria dos móveis com vão de 10 cm ou mais.',
            idealRange: { min: 10, max: 15 },
        },
        soundAlert: {
            status: 'moderate',
            message: 'Nível de ruído não informado pelo fabricante. Robôs LiDAR costumam operar entre 55-65 dB.',
        },
        energyAlert: {
            rating: 'A',
            message: 'Consumo estimado de ~30W durante operação. Impacto na conta de luz é mínimo (~R$2-3/mês com uso diário).',
        },
    },

    header: {
        overallScore: 7.5,
        scoreLabel: 'Muito Bom',
        title: 'XR500 Pro: LiDAR + aspira e passa pano ao mesmo tempo',
        subtitle: 'Mapas salvos (até 5), zonas proibidas e autonomia de ~150 min — com base simples e mop básico.',
        badges: [
            { type: 'feature', label: 'LiDAR + mapas (até 5)', icon: 'Radar' },
            { type: 'feature', label: 'Carpet Sense', icon: 'Zap' },
        ],
    },

    // ===========================================================
    // ✅ Decision FAQ
    // ===========================================================
    decisionFAQ: [
        {
            id: 'p1',
            icon: 'AlertTriangle',
            question: 'Ele sobe em tapetes e soleiras?',
            answer: 'Sim: atravessa degraus/soleiras de até 2 cm. No modo aspirar, reconhece tapetes e pode aumentar a sucção; no modo pano, a recomendação é evitar tapetes.',
        },
        {
            id: 'p2',
            icon: 'Scale',
            question: 'Dá para usar sem internet/app?',
            answer: 'Sim. O uso do aplicativo é opcional e o produto acompanha controle remoto. Internet só é necessária para controle remoto via app e integrações com voz.',
        },
        {
            id: 'p3',
            icon: 'Wrench',
            question: 'E manutenção / peças de reposição?',
            answer: 'A loja oficial vende consumíveis e algumas peças (ex.: kit básico, bateria e rodas). Para eletrônica/LiDAR, a rota mais segura é assistência técnica.',
        },
    ],

    // ===========================================================
    // 🧪 Interactive Tools
    // ===========================================================
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

export default liectroux_xr500_pro;
