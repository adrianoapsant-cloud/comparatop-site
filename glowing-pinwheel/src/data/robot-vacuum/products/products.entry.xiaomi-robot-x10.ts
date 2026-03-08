/**
 * Product Entry: xiaomi-robot-x10
 * Extracted from products.ts for modular architecture
 */
import type { Product } from '@/types/category';

export const xiaomi_robot_x10: Product = {
    id: 'xiaomi-robot-x10',
    categoryId: 'robot-vacuum',
    name: 'XIAOMI Robot Vacuum X10 com Auto-Esvaziamento',
    shortName: 'Xiaomi X10',
    brand: 'Xiaomi',
    model: 'Robot Vacuum X10',
    price: 3000,
    asin: 'B0BW4LVTTD',
    imageUrl: '/images/products/xiaomi-x10.svg',
    status: 'published',
    benefitSubtitle: 'LDS Premium com base auto-esvaziante e 4000Pa para casas grandes',
    scores: {
        // PARR-BR Scoring Framework - Cadastrado 18/01/2026
        // Metodologia: Réguas de Calibração + Pesquisa Amazon BR + Specs Oficiais
        c1: 9.5,  // Navegação (25%) - LDS Laser + Mapeamento Inteligente multi-andares. Premium.
        c2: 9.0,  // App/Conectividade (15%) - Xiaomi Home app estável + Alexa/Google. Ecossistema sólido.
        c3: 7.5,  // Mop (15%) - Mop estático com controle eletrônico de 3 níveis. Não vibratório.
        c4: 7.0,  // Escovas (10%) - Escova padrão (não anti-emaranhamento). Troca regular com pets.
        c5: 7.0,  // Altura (10%) - ~9.5cm padrão LiDAR. Não ultra-slim.
        c6: 7.0,  // Peças BR (8%) - Xiaomi tem peças no ML/Shopee. Melhor que Roborock puro.
        c7: 9.5,  // Bateria (5%) - 5200mAh = 180min autonomia! + Recharge & Resume.
        c8: 7.0,  // Ruído (5%) - Nível médio (~65dB)
        c9: 10.0, // Base (5%) - AUTO-ESVAZIAMENTO incluído! Coleta pó automática. Diferencial.
        c10: 7.5, // IA (2%) - Anti-colisão avançado + detecção básica.
    },
    specs: {
        suctionPower: 4000,  // Pa
        batteryCapacity: 5200,  // mAh
        dustbinCapacity: 400,  // ml
        waterTankCapacity: 200,  // ml
        noiseLevel: 65,  // dB estimado
        width: 35,  // cm (diâmetro)
        height: 9.5,  // cm (altura LiDAR padrão)
        depth: 35,
    },

    // Structured specs for scoring module
    structuredSpecs: {
        navigationType: 'lidar',
        mopType: 'static',
        brushType: 'bristle',
        dockType: 'auto-empty',
        obstacleDetection: 'bump-only',
        heightCm: 9.5,
        noiseDb: 65,
        runtimeMinutes: 180,
        batteryMah: 5200,
    },
    attributes: {
        navigationType: 'lidar',  // LDS Laser Navigation
        hasMop: true,
        mopType: 'static_electronic',  // Mop estático com controle eletrônico
        hasAutoEmpty: true,  // ✓ BASE AUTO-ESVAZIANTE!
        hasMapping: true,  // Mapeamento inteligente
        hasNoGoZones: true,  // Zonas de restrição ✓
        hasRechargeResume: true,  // Recharge & Resume ✓
        hasAppControl: true,
        voiceAssistants: ['Alexa', 'Google'],
        wifiBand: '2.4GHz',
        climbHeight: 20,  // mm
        brushType: 'standard_bristle',  // Escova padrão
        batteryMah: 5200,
        chargingTimeHours: 4,
        runtimeMinutes: 180,
    },
    technicalSpecs: {
        // Limpeza
        suctionPower: 4000,  // Pa (17000Pa na base)
        dustbinCapacity: 400,  // ml
        waterTankCapacity: 200,  // ml (controle 3 níveis)
        mopType: 'Estático com Controle Eletrônico',
        brushType: 'Escova Principal + Laterais',
        filterType: 'HEPA',
        // Navegação
        navigation: 'LDS (Laser Distance Sensor)',
        mapping: true,
        lidar: true,
        camera: false,
        obstacleDetection: 'Anticolisão + Antiqueda',
        climbHeight: 20,  // mm
        // Bateria
        runtime: '180 minutos',
        batteryCapacity: 5200,  // mAh
        chargingTime: '4 horas',
        autoRecharge: true,
        rechargeResume: true,  // ✓ Continua de onde parou
        // Conectividade
        wifi: true,
        appControl: true,
        voiceControl: 'Alexa, Google Assistente',
        scheduling: true,
        multiFloorMapping: true,  // Mapeamento multi-andares
        // Base/Dock
        dockType: 'Auto-Esvaziamento',
        autoEmpty: true,  // ✓ DIFERENCIAL!
        autoMopWash: false,
        autoRefill: false,
        // Dimensões
        height: 9.5,  // cm
        diameter: 35,  // cm
        weight: 3.5,  // kg
        noiseLevel: 65,  // dB
        voltage: 127,  // V
    },
    scoreReasons: {
        c1: 'PREMIUM: Navegação LDS (Laser) com mapeamento inteligente multi-andares. Zonas de restrição configuráveis pelo app.',
        c2: 'EXCELENTE: App Xiaomi Home integrado ao ecossistema. Alexa e Google funcionam nativamente. Boa estabilidade.',
        c3: 'LIMITAÇÃO: Mop estático com 3 níveis de água, mas NÃO vibratório. Limpa poeira fina, não esfrega manchas.',
        c4: 'ATENÇÃO PETS: Escova padrão com cerdas pode enrolar pelos. Limpeza semanal necessária com cachorros/gatos.',
        c5: 'PADRÃO LiDAR: 9.5cm de altura com torre laser. Verifique vão dos móveis antes de comprar.',
        c6: 'XIAOMI BRASIL: Peças disponíveis no ML/Shopee. Melhor suprimento que marcas 100% importadas.',
        c7: 'AUTONOMIA MÁXIMA: 5200mAh = 180min! A maior da categoria. + Recharge & Resume para casas grandes.',
        c9: 'DIFERENCIAL: Base AUTO-ESVAZIANTE inclusa! Coleta pó automaticamente. Zero trabalho manual por semanas.',
        c10: 'BOA IA: Sistema anticolisão e antiqueda funcionam bem. Não tem câmera para objetos pequenos.',
    },
    voc: {
        totalReviews: 6465,
        averageRating: 4.5,
        oneLiner: 'LDS Premium com auto-esvaziamento e mega autonomia para casas grandes',
        summary: 'Compradores elogiam muito a base auto-esvaziante, a autonomia de 180min e a integração com Alexa/Google. Principais críticas são sobre a escova que enrola cabelo e o mop básico. Ideal para quem quer esquecer que o robô existe.',
        pros: [
            'Base auto-esvaziante dispensa trabalho manual por semanas',
            '180 minutos de autonomia - a maior da categoria',
            'Integração perfeita com Alexa e Google',
            'Mapeamento multi-andares preciso',
            'Ecossistema Xiaomi confiável',
        ],
        cons: [
            'Escova padrão enrola cabelo/pelos de pets',
            'Mop estático não remove manchas pesadas',
            'Altura padrão pode travar em móveis baixos',
            'Wi-Fi apenas 2.4GHz',
        ],
        sources: [
            { name: 'Amazon Brasil', url: 'https://www.amazon.com.br/dp/B0BW4LVTTD', count: 6465 },
        ],
    },
    painPointsSolved: ['Esvaziar reservatório manualmente', 'Casas muito grandes', 'Automação total', 'Integração smart home'],
    badges: ['premium-pick', 'editors-choice'],
    offers: [
        {
            store: 'Amazon',
            storeSlug: 'amazon',
            price: 3000,
            url: 'https://www.amazon.com.br/dp/B0BW4LVTTD',
            affiliateUrl: 'https://www.amazon.com.br/dp/B0BW4LVTTD?tag=aferio-20',
            inStock: true,
            lastChecked: '2026-01-18',
        },
    ],
    lastUpdated: '2026-01-18',
    gallery: ['/images/products/xiaomi-x10.svg'],
    featureBenefits: [
        { icon: 'Trash2', title: 'Auto-Esvaziamento', description: 'Base coleta pó automaticamente. Esqueça que o robô existe por semanas.' },
        { icon: 'Radar', title: 'LDS Laser', description: 'Navegação precisa com mapeamento 3D de múltiplos andares.' },
        { icon: 'Battery', title: '180min Autonomia', description: 'A maior bateria da categoria. Limpa casas de até 200m² em uma carga.' },
        { icon: 'Mic', title: 'Alexa & Google', description: 'Diga "Alexa, mande o robô limpar a sala". Funciona nativamente.' },
    ],
    mainCompetitor: {
        id: 'roborock-q7-l5',
        name: 'Roborock Q7 L5 LiDAR',
        shortName: 'Roborock Q7 L5',
        imageUrl: '/images/products/roborock-q7-l5.svg',
        price: 2106,
        score: 8.11,
        keyDifferences: [
            { label: 'Auto-Esvaziamento', current: 'Sim ✓', rival: 'Não', winner: 'current' },
            { label: 'Autonomia', current: '180min', rival: '150min', winner: 'current' },
            { label: 'Escovas Anti-Tangle', current: 'Não', rival: 'Sim ✓', winner: 'rival' },
        ],
    },

    // ============================================
    // TCO - Custo Total de Propriedade (Dados Verificados Fipe_Eletro + NPV)
    // Metodologia: NPV com inflação energética 5%/ano, consumíveis 4%/ano, SELIC real 2%/ano
    // Fonte: tcoData auditado em Projeto_Fipe_Eletro (market-verified inputs)
    // ============================================
    extendedTco: {
        purchasePrice: 2580.00,
        energyCost5y: 382,        // NPV: 76.09 kWh/ano × R$0.92/kWh × 5 anos c/ inflação 5%/ano
        maintenanceCost5y: 2818,   // Consumíveis NPV R$2.243 + Manutenção EV R$575
        totalCost5y: 5780,         // Aquisição + Energia + Consumíveis + Manutenção (NPV)
        monthlyReserve: 96,        // R$5.780 / 60 meses
        lifespan: {
            years: 5,
            categoryAverage: 5,
            limitingComponent: 'Bateria Li-Ion Premium (5200mAh)',
            limitingComponentLife: 4,
            weibullExplanation: 'Bateria 5200mAh degrada ~20% após 500 ciclos (~4 anos de uso regular). Módulo LDS tem 30% de risco de falha no ano 3. Com troca de bateria no ano 4, o aparelho pode estender a vida útil para 5+ anos.',
        },
        repairability: {
            score: 5.7,
            level: 'moderate' as const,
            categoryAverage: 6.5,
            components: [
                {
                    name: 'Módulo Laser (LDS)',
                    score: 4,
                    price: 250,
                    availability: 'limited' as const,
                    failureSymptoms: ['Mapeamento errático', 'Anda em círculos', 'Erro de sensor no app'],
                    repairAdvice: 'Risco de 30% no ano 3. Peça importada; verifique compatibilidade antes de comprar.',
                },
                {
                    name: 'Bateria 5200mAh Li-Ion',
                    score: 7,
                    price: 500,
                    availability: 'available' as const,
                    failureSymptoms: ['Autonomia cai abruptamente', 'Não completa ciclos', 'Desliga longe da base'],
                    repairAdvice: 'Troca esperada no ano 4 (probabilidade ~100%). Bateria genérica compatível é mais barata.',
                },
                {
                    name: 'Sacos de Pó (consumível)',
                    score: 9,
                    price: 153,
                    availability: 'available' as const,
                    failureSymptoms: ['Lixeira cheia', 'Sucção reduzida', 'Mal cheiro na base'],
                    repairAdvice: 'R$153/ano (6 sacos bimestrais). Essencial para quem não quer contato com pó.',
                },
                {
                    name: 'Kit Filtros/Escovas/Mops',
                    score: 8,
                    price: 270,
                    availability: 'available' as const,
                    failureSymptoms: ['Sucção fraca', 'Rastros no chão', 'Escovas desgastadas'],
                    repairAdvice: 'R$270/ano. Kit completo com filtros HEPA, escovas laterais e panos de mop.',
                },
            ],
        },
    },
};
