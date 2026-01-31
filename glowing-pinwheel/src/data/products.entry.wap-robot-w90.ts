/**
 * WAP Robot W90 - Robot Vacuum Entry
 * Generated: 2026-01-29
 * Category: robot-vacuum
 */

import type { Product } from '@/types/category';

export const wap_robot_w90: Product = {
    // ============================================
    // IDENTIFICAÇÃO BÁSICA
    // ============================================
    id: 'wap-robot-w90',
    categoryId: 'robot-vacuum',
    name: 'WAP Aspirador de Pó Robô ROBOT W90 3 em 1 — Automático, 250 ml, sensores antiqueda/anticolisão',
    shortName: 'WAP Robot W90',
    brand: 'WAP',
    model: 'ROBOT W90',
    price: 319.90,
    imageUrl: '/images/products/wap-robot-w90.svg',
    gallery: ['/images/products/wap-robot-w90.svg'],
    status: 'published',
    lastUpdated: '2026-01-29',
    useSimplifiedPDP: true,

    // ============================================
    // CONFIANÇA
    // ============================================
    evidenceLevel: 'high',
    contextualScoreRange: [3.8, 4.7],
    tcoTotalRange: [650, 1100],
    tcoConfidence: 'low',

    // ============================================
    // SCORES PARR-BR (c1 a c10)
    // ============================================
    scores: {
        c1: 3.5, c2: 2.0, c3: 4.0, c4: 4.0, c5: 8.5,
        c6: 6.0, c7: 6.5, c8: 6.0, c9: 2.0, c10: 0.5,
    },

    scoreReasons: {
        c1: 'Limpeza aleatória/por padrões simples (sem mapeamento): cobre a casa, mas pode repetir áreas e deixar outras para depois.',
        c2: 'Sem app e sem agendamento: controle é por botão (sem zonas, sem rotina automática, sem comandos por voz).',
        c3: 'MOP em microfibra (pano de arrasto): ótimo para manutenção e poeira fina; fraco para manchas antigas.',
        c4: '1 escova giratória + 1 escova lateral: funciona bem em poeira/migalhas, exige manutenção se houver fios/pelos longos.',
        c5: 'Altura de 8 cm: excelente para passar embaixo de móveis e sofá.',
        c6: 'Consumíveis e peças originais/compatíveis existem no Brasil (filtro, bateria, placa, motor), mas ainda exige pesquisa por código da peça.',
        c7: 'Bateria 3,6V 2600mAh com autonomia anunciada de até 1h40: suficiente para manutenção em casas pequenas/médias.',
        c8: '72 dB: ruído típico de robôs de entrada; ok para uso diurno, pode incomodar em home office.',
        c9: 'Sem base carregadora/dock: carregamento tende a ser manual, sem retorno automático e sem retomar de onde parou.',
        c10: 'Sem IA/câmera para reconhecer objetos: depende de sensores antiqueda/impacto.',
    },

    // ============================================
    // SPECS TÉCNICAS
    // ============================================
    specs: {
        suctionPower: 0,
        batteryCapacity: 2600,
        dustbinCapacity: 250,
        waterTankCapacity: 0,
        noiseLevel: 72,
        width: 28.5,
        height: 8,
        depth: 27,
    },

    // Structured specs for scoring module
    structuredSpecs: {
        navigationType: 'random',
        mopType: 'static',
        brushType: 'bristle',
        dockType: 'basic',
        obstacleDetection: 'infrared',
        heightCm: 8,
        noiseDb: 72,
        runtimeMinutes: 100,
        batteryMah: 2600,
    },

    attributes: {
        navigationType: 'random',
        hasMop: true,
        mopType: 'pano-arrasto',
        hasAutoEmpty: false,
        hasMapping: false,
        hasNoGoZones: false,
        hasRechargeResume: false,
        hasAppControl: false,
        voiceAssistants: [],
        wifiBand: 'none',
        climbHeight: 0,
        brushType: 'single_rotating',
        batteryMah: 2600,
        chargingTimeHours: 4,
        runtimeMinutes: 100,
    },

    technicalSpecs: {
        suctionPower: 0,
        dustbinCapacity: 250,
        waterTankCapacity: 0,
        mopType: 'pano de microfibra (arrasto)',
        brushType: 'escova giratória + escova lateral',
        filterType: 'lavável (tecido)',
        navigation: 'aleatória (sensores antiqueda/anticolisão)',
        mapping: false,
        lidar: false,
        camera: false,
        obstacleDetection: 'sensores infravermelho antiqueda + sensores de impacto (anticolisão)',
        climbHeight: 0,
        runtime: 'até 1h40 (variável por piso e modo)',
        batteryCapacity: 2600,
        chargingTime: 'até 4 horas',
        autoRecharge: false,
        rechargeResume: false,
        wifi: false,
        appControl: false,
        voiceControl: 'Não',
        scheduling: false,
        multiFloorMapping: false,
        dockType: 'sem dock (carregamento manual)',
        autoEmpty: false,
        autoMopWash: false,
        autoRefill: false,
        height: 8,
        diameter: 28.5,
        weight: 1.2,
        noiseLevel: 72,
    },

    productDimensions: { diameter: 28.5, height: 8 },

    // ============================================
    // PRODUCT DNA (10 Dimensões Radar)
    // ============================================
    productDna: {
        title: 'DNA do Produto',
        subtitle: 'Perfil técnico em 10 dimensões',
        dimensions: [
            { id: 'c1', name: 'Navegação', shortName: 'Navegação', score: 3.5, weight: 25, icon: 'Radar', color: '#06B6D4', description: 'Sem mapeamento: limpeza aleatória, com cobertura variável.' },
            { id: 'c2', name: 'Software/App', shortName: 'Software', score: 2.0, weight: 15, icon: 'Smartphone', color: '#8B5CF6', description: 'Sem app/rotinas/comandos por voz: operação por botão.' },
            { id: 'c3', name: 'Sistema de Mop', shortName: 'Mop', score: 4.0, weight: 15, icon: 'Droplets', color: '#3B82F6', description: 'Pano de microfibra (arrasto): manutenção leve, não "esfrega".' },
            { id: 'c4', name: 'Escovas', shortName: 'Escovas', score: 4.0, weight: 10, icon: 'Brush', color: '#10B981', description: 'Escova giratória + lateral; precisa limpar fios/pelos.' },
            { id: 'c5', name: 'Altura/Perfil', shortName: 'Altura', score: 8.5, weight: 10, icon: 'Ruler', color: '#F59E0B', description: '8 cm: excelente para vãos baixos.' },
            { id: 'c6', name: 'Manutenibilidade', shortName: 'Manutenção', score: 6.0, weight: 8, icon: 'Wrench', color: '#64748B', description: 'Peças e consumíveis por código (WAP/lojas de peças).' },
            { id: 'c7', name: 'Bateria', shortName: 'Bateria', score: 6.5, weight: 5, icon: 'Battery', color: '#22C55E', description: '2600mAh e até 1h40: suficiente para manutenção em áreas pequenas/médias.' },
            { id: 'c8', name: 'Acústica', shortName: 'Ruído', score: 6.0, weight: 5, icon: 'Volume2', color: '#F59E0B', description: '72 dB: razoável para uso diurno.' },
            { id: 'c9', name: 'Base/Dock', shortName: 'Base', score: 2.0, weight: 5, icon: 'Home', color: '#EF4444', description: 'Sem dock: reduz automação e conveniência.' },
            { id: 'c10', name: 'IA/Desvio', shortName: 'IA Desvio', score: 0.5, weight: 2, icon: 'Brain', color: '#EC4899', description: 'Sem reconhecimento por câmera/IA; apenas sensores.' },
        ],
    },

    // ============================================
    // VEREDITO DE AUDITORIA
    // ============================================
    auditVerdict: {
        solution: {
            title: '✅ O W90 resolve bem',
            icon: 'CheckCircle',
            color: 'green',
            items: [
                '3 em 1: varre, aspira e passa pano automaticamente',
                'Altura de 8 cm para alcançar embaixo de móveis',
                'Sensores antiqueda/anticolisão para operar sozinho',
                'Reservatório de 250 ml e filtro lavável',
                'Peças e consumíveis disponíveis no Brasil',
            ],
        },
        attentionPoint: {
            title: '⚠️ Pontos de atenção',
            icon: 'AlertTriangle',
            color: 'yellow',
            items: [
                'Sem app e sem mapeamento: limpeza menos previsível',
                'Sem dock/base: carregamento tende a ser manual',
                'Mop é pano de arrasto (não vibratório/rotativo)',
                'Sucção em Pa não é informada pelo anúncio',
            ],
        },
        technicalConclusion: {
            title: '🔬 Conclusão técnica',
            icon: 'Microscope',
            color: 'blue',
            text: 'O W90 é uma escolha pragmática para quem quer reduzir a poeira do dia a dia gastando pouco e sem depender de Wi‑Fi/app. Ele ganha em simplicidade e altura baixa, mas perde em previsibilidade (sem mapa) e automação (sem dock).',
        },
        dontBuyIf: {
            title: '❌ Não compre se',
            icon: 'XCircle',
            color: 'red',
            items: [
                'Você quer mapeamento, zonas de exclusão e rotas em zigue-zague',
                'Você precisa de automação total (dock, retorno automático e retomada)',
                'Sua casa tem muitos fios/pelos longos e você quer antiembaraço avançado',
                'Você espera remoção de manchas (mop vibratório/rotativo)',
            ],
        },
    },

    // ============================================
    // CONTEÚDO EDITORIAL
    // ============================================
    benefitSubtitle: 'Robô de entrada 3 em 1 para manutenção diária: varre, aspira e passa pano com 1 clique',

    featureBenefits: [
        { icon: 'Sparkles', title: '3 em 1 (varre/aspira/passa pano)', description: 'Resolve manutenção leve do dia a dia com operação "um clique".' },
        { icon: 'Ruler', title: 'Altura baixa (8 cm)', description: 'Facilita limpeza sob móveis, camas e sofás, onde poeira costuma acumular.' },
        { icon: 'Shield', title: 'Sensores antiqueda e anticolisão', description: 'Redireciona o trajeto ao detectar obstáculos e degraus.' },
        { icon: 'Wrench', title: 'Peças e consumíveis no Brasil', description: 'Há oferta de filtro, bateria, escova e placa por código de peça.' },
    ],

    badges: ['best-value'],

    // ============================================
    // OFERTAS
    // ============================================
    offers: [
        {
            store: 'Amazon',
            storeSlug: 'amazon',
            price: 319.90,
            url: 'https://www.amazon.com.br/dp/B0B9PSBNYL',
            affiliateUrl: 'https://www.amazon.com.br/dp/B0B9PSBNYL?tag=comparatop-20',
            inStock: true,
            lastChecked: '2026-01-29',
        },
        {
            store: 'WAP Oficial',
            storeSlug: 'wap',
            price: 359.90,
            url: 'https://www.wap.com.br/robot-w90',
            affiliateUrl: 'https://www.wap.com.br/robot-w90',
            inStock: true,
            lastChecked: '2026-01-29',
        },
    ],

    // ============================================
    // MAIN COMPETITOR
    // ============================================
    mainCompetitor: {
        id: 'multilaser-eclipse-ho410',
        name: 'Robô Aspirador Multilaser Eclipse HO410 (3 em 1)',
        shortName: 'Multilaser HO410',
        imageUrl: '/images/products/multilaser-eclipse-ho410.svg',
        price: 559.99,
        score: 4.8,
        keyDifferences: [
            { label: 'Preço', current: 'R$ 319,90', rival: 'R$ 559,99', winner: 'current' },
            { label: 'Ecossistema de peças', current: 'WAP por código', rival: 'Depende do canal', winner: 'current' },
            { label: 'Volume base usuarios', current: '13.424 reviews', rival: 'Menor base', winner: 'current' },
        ],
    },

    // ============================================
    // ACESSÓRIO RECOMENDADO
    // ============================================
    recommendedAccessory: {
        asin: 'FW007700',
        name: 'Filtro de entrada original (compatível) para WAP Robot W90 — código FW007700',
        shortName: 'Filtro FW007700',
        price: 21.89,
        imageUrl: '/images/products/acessorio.svg',
        reason: 'Filtro entupido derruba sucção e aumenta ruído; trocar/lavar periodicamente mantém a performance.',
        affiliateUrl: 'https://www.nsshop.com.br/filtro-entrada-original-aspirador-wap-robot-w90-w100c-id52197-p8709',
    },

    // ============================================
    // VOC - Voz do Consumidor
    // ============================================
    voc: {
        totalReviews: 13424,
        averageRating: 4.3,
        consensusScore: 86, // Corrigido de 8.6 para percentual
        oneLiner: 'Entrega o básico 3 em 1 com preço agressivo; o ponto fraco é não ter mapa/app e depender de limpeza aleatória.',
        summary: 'O W90 é um robô "entry-level" focado em praticidade: um clique e ele varre, aspira e passa pano, entrando bem sob móveis por ter 8 cm. Em troca, abre mão de mapeamento, app e base carregadora, o que reduz previsibilidade e automação.',
        pros: [
            '3 em 1 (varre, aspira e passa pano) com operação simples',
            'Altura de 8 cm: alcança áreas sob móveis com facilidade',
            'Sensores antiqueda/anticolisão para trabalhar sozinho',
        ],
        cons: [
            'Sem mapeamento/app: limpeza menos previsível e sem zonas',
            'Sem dock/base: carregamento e retomada não são automáticos',
        ],
        sources: [
            { name: 'Amazon Brasil', url: 'https://www.amazon.com.br/dp/B0B9PSBNYL', count: 13424 },
        ],
    },

    extendedVoc: {
        consensusScore: 86, // Corrigido de 8.6 para percentual
        totalReviews: '13.424 avaliações',
        acceptableFlaw: 'A limpeza é aleatória e sem mapa: pode demorar mais e não é tão previsível.',
        realWorldScenario: 'Apartamento pequeno/médio com piso frio/madeira: rodar 3–5x/semana para manutenção.',
        goldenTip: 'Antes de rodar, recolha fios/cabos e tapetes leves; esvazie o reservatório após 1–2 ciclos.',
    },

    // ============================================
    // TCO - Custo Total de Propriedade
    // ============================================
    tcoData: {
        purchasePrice: 319.90,
        energyCost5y: 30.00,
        maintenanceCost5y: 400.00,
        totalCost5y: 749.90,
        monthlyReserve: 12.50,
        lifespanYears: 4,
    },

    extendedTco: {
        purchasePrice: 319.90,
        energyCost5y: 30.00,
        maintenanceCost5y: 400.00,
        totalCost5y: 749.90,
        monthlyReserve: 12.50,
        lifespan: {
            years: 4,
            limitingComponent: 'Bateria',
            limitingComponentLife: 2.5,
            weibullExplanation: 'Em robôs de entrada, falhas de longo prazo costumam concentrar em bateria e motores (desgaste), além de sensores expostos a poeira. Consumíveis são previsíveis; eletrônica é o "pico" de custo quando falha.',
        },
        repairability: {
            score: 6,
            level: 'Moderado',
            components: [
                {
                    name: 'Placa Eletrônica',
                    score: 4,
                    price: 255,
                    availability: 'Limitada - lojas de peças WAP',
                    failureSymptoms: ['Não liga', 'Reinicia sozinho', 'Falhas recorrentes'],
                    repairAdvice: 'Se a placa custar >40% do valor do robô, normalmente compensa substituir o robô.',
                },
                {
                    name: 'Motor de Sucção',
                    score: 5,
                    price: 74,
                    availability: 'Disponível - código WAP',
                    failureSymptoms: ['Perda brusca de sucção', 'Barulho anormal', 'Cheiro de queimado'],
                    repairAdvice: 'Troque/lave filtro antes; se persistir, o motor costuma resolver.',
                },
                {
                    name: 'Bateria 3,6V 2600mAh',
                    score: 7,
                    price: 120,
                    availability: 'Disponível - código WAP',
                    failureSymptoms: ['Autonomia despenca', 'Desliga longe do carregador', 'Não completa ciclo'],
                    repairAdvice: 'Após ~2–3 anos pode precisar troca dependendo do uso e temperatura.',
                },
                {
                    name: 'Carregador Bivolt',
                    score: 9,
                    price: 64,
                    availability: 'Disponível - FW009133',
                    failureSymptoms: ['Não carrega', 'LED do carregador falha'],
                    repairAdvice: 'Verifique tomada e conector; geralmente é troca simples.',
                },
                {
                    name: 'Filtro de Entrada',
                    score: 10,
                    price: 22,
                    availability: 'Disponível - FW007700',
                    failureSymptoms: ['Sucção fraca', 'Ruído aumenta', 'Poeira retorna'],
                    repairAdvice: 'Lave e seque totalmente; substitua quando perder integridade.',
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
            message: 'Altura de 8 cm: tende a passar sob a maioria dos móveis (ideal 6–9 cm).',
            idealRange: { min: 6, max: 9 },
        },
        soundAlert: {
            status: 'moderate',
            message: 'Ruído 72 dB: preferível rodar fora do horário de sono/home office.',
        },
        energyAlert: {
            rating: 'A',
            message: 'Potência de 30W: consumo baixo para uso recorrente.',
        },
    },

    // ============================================
    // HEADER
    // ============================================
    header: {
        overallScore: 4.2,
        scoreLabel: 'Regular',
        title: 'WAP W90: Entrada 3 em 1, simples, baixo e barato',
        subtitle: 'Para manutenção diária em pisos duros, sem app e sem mapeamento.',
        badges: [
            { type: 'feature', label: 'Altura 8 cm', icon: 'Ruler' },
            { type: 'feature', label: '3 em 1', icon: 'Sparkles' },
        ],
    },

    // ============================================
    // DECISION FAQ
    // ============================================
    decisionFAQ: [
        {
            id: 'p1',
            icon: 'AlertTriangle',
            question: 'Ele faz limpeza "certinha" por cômodo?',
            answer: 'Não. Sem mapeamento/app, o trajeto é aleatório: ele limpa, mas não garante cobertura perfeita por cômodo em cada ciclo.',
        },
        {
            id: 'p2',
            icon: 'Battery',
            question: 'A autonomia dá para uma casa inteira?',
            answer: 'Para casas pequenas/médias, sim na maioria dos casos (até 1h40). Em casas grandes, pode faltar bateria e exigirá recarga manual.',
        },
        {
            id: 'p3',
            icon: 'Wrench',
            question: 'O que manter em dia?',
            answer: 'Filtro, escovas e pano de mop. Isso evita queda de sucção, aumenta vida útil e reduz ruído.',
        },
    ],

    // ============================================
    // INTERACTIVE TOOLS
    // ============================================
    interactiveTools: [
        {
            id: 'dimension-check',
            icon: 'ruler',
            title: 'Será que passa?',
            badge: 'Teste Rápido',
            badgeColor: 'orange',
            description: 'Verifique o vão livre sob seus móveis',
            toolType: 'geometry',
            configRef: 'robo-passa-movel',
        },
    ],
};

export default wap_robot_w90;
