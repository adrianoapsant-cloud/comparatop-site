/**
 * KaBuM! Smart 700 (KBSF003) - Robot Vacuum Entry
 * Generated: 2026-01-30
 * Category: robot-vacuum
 */

import type { Product } from '@/types/category';

export const kabum_smart_700: Product = {
    // ===========================================================
    // 🏷️ Identificação
    // ===========================================================
    id: 'kabum-smart-700-kbsf003-preto',
    categoryId: 'robot-vacuum',
    name: 'Robô Aspirador e Passa Pano KaBuM! Smart 700 (KBSF003) — Laser 3D, App, Alexa/Google, Bivolt',
    shortName: 'KaBuM! Smart 700',
    brand: 'KaBuM! Smart',
    model: 'Smart 700 (KBSF003)',

    // ===========================================================
    // 📸 Mídia (Amazon CDN)
    // ===========================================================
    imageUrl: 'https://m.media-amazon.com/images/I/518Bkg9dPlL._AC_SY300_SX300_QL70_ML2_.jpg',
    gallery: [
        'https://m.media-amazon.com/images/I/518Bkg9dPlL._AC_SY300_SX300_QL70_ML2_.jpg',
    ],

    // ===========================================================
    // 💰 Preço
    // ===========================================================
    price: 799.9,

    // ===========================================================
    // 📊 Status
    // ===========================================================
    lastUpdated: '2026-01-30',
    status: 'published',
    useSimplifiedPDP: true,

    // ===========================================================
    // 📄 Manual (PDF funcional verificado)
    // ===========================================================
    manualUrl: 'https://www.kabum.com.br/hotsite/manuais/155321-Aspirador-KaBuM-Smart%20700-Branco.pdf',

    // ===========================================================
    // 🎯 Confiança
    // ===========================================================
    evidenceLevel: 'high',
    contextualScoreRange: [5.8, 6.6] as [number, number],
    contextualScoreConfidence: 'high',
    tcoTotalRange: [1300, 1750] as [number, number],
    tcoConfidence: 'medium',

    // ===========================================================
    // 🧠 Scores (PARR-BR Framework)
    // ===========================================================
    scores: {
        c1: 7.0,  // Navegação - Laser 3D + giroscópio
        c2: 7.0,  // Software/App
        c3: 5.0,  // Sistema de Mop
        c4: 5.0,  // Escovas
        c5: 7.0,  // Altura
        c6: 6.0,  // Manutenibilidade
        c7: 6.5,  // Bateria
        c8: 5.0,  // Acústica
        c9: 6.0,  // Base
        c10: 3.0, // IA
    },

    scoreReasons: {
        c1: 'Laser 3D + giroscópio com mapeamento e modos por cômodo/ponto; bom para cobertura consistente.',
        c2: 'App KaBuM! Smart com mapa, agendamento e controle remoto; voz via Alexa/Google.',
        c3: 'Passa pano por arrasto com reservatório e 3 níveis de água — ajuda na manutenção, não substitui esfregão pesado.',
        c4: 'Escova central + escovas laterais padrão; funciona bem em pó/pelos, mas não é "anti-embolo" avançado.',
        c5: 'Altura ~9,6 cm: costuma entrar sob sofás/camas comuns (ver vão livre).',
        c6: 'Consumíveis e kits de reposição existem no mercado nacional (KaBuM!/terceiros). Peças eletrônicas tendem a ser mais difíceis.',
        c7: 'Autonomia anunciada ~140 min e recarga automática com retorno ao ponto — bom para ambientes médios/grandes.',
        c8: 'Fabricante cita "baixo ruído", mas sem dB oficial; assumido como nível médio para categoria.',
        c9: 'Base simples de carregamento com retorno automático; sem autoesvaziamento.',
        c10: 'Sem IA de visão/câmera; desvio de obstáculos é por sensores (antiqueda/anticolisão).',
    },

    // ===========================================================
    // 🔎 Specs Técnicas
    // ===========================================================
    specs: {
        suctionPower: 2000,
        batteryCapacity: 3000,
        dustbinCapacity: 300,
        waterTankCapacity: 200,
        noiseLevel: 0,
        width: 33,
        height: 9.6,
        depth: 33,
    },

    // Structured specs for scoring module
    structuredSpecs: {
        navigationType: 'lidar',
        mopType: 'static',
        brushType: 'bristle',
        dockType: 'basic',
        obstacleDetection: 'bump-only',
        heightCm: 9.6,
        runtimeMinutes: 140,
        batteryMah: 3000,
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
        climbHeight: 1.5,
        brushType: 'standard_bristle',
        batteryMah: 3000,
        chargingTimeHours: 6.67,
        runtimeMinutes: 140,
    },

    technicalSpecs: {
        suctionPower: 2000,
        dustbinCapacity: 300,
        waterTankCapacity: 200,
        mopType: 'Pano por arrasto (3 níveis de água)',
        brushType: 'Escova central + 2 escovas laterais',
        filterType: 'HEPA',
        navigation: 'Laser 3D + giroscópio (mapeamento do ambiente)',
        mapping: true,
        lidar: true,
        camera: false,
        obstacleDetection: 'Sensores anticolisão + antiqueda; para-choque frontal',
        climbHeight: 1.5,
        runtime: 'Até ~140 min (dependendo do modo)',
        batteryCapacity: 3000,
        chargingTime: '≈ 400 min (~6.67 h)',
        autoRecharge: true,
        rechargeResume: true,
        wifi: true,
        appControl: true,
        voiceControl: 'Compatível com Alexa e Google Assistant (via app)',
        scheduling: true,
        multiFloorMapping: false,
        dockType: 'basic',
        autoEmpty: false,
        autoMopWash: false,
        autoRefill: false,
        height: 9.6,
        diameter: 33,
        weight: 3.0,
        noiseLevel: 0,
        voltage: 110,
    },

    productDimensions: { diameter: 33, height: 9.6 },

    // ===========================================================
    // 🧬 DNA do Produto (Radar Chart)
    // ===========================================================
    productDna: {
        title: 'DNA do Produto',
        subtitle: '10 Dimensões de Avaliação',
        dimensions: [
            { id: 'c1', name: 'Navegação', shortName: 'Nav', score: 7.0, weight: 0.25, icon: 'radar', color: 'cyan', description: 'Laser 3D + giroscópio com mapa e modos por área/ponto.' },
            { id: 'c2', name: 'Software', shortName: 'App', score: 7.0, weight: 0.15, icon: 'smartphone', color: 'purple', description: 'App com mapa, agendamento e controle; voz Alexa/Google.' },
            { id: 'c3', name: 'Sistema de Mop', shortName: 'Mop', score: 5.0, weight: 0.15, icon: 'droplet', color: 'blue', description: 'Arrasto com 3 níveis de água: ótimo para "manter", não para "lavar".' },
            { id: 'c4', name: 'Escovas', shortName: 'Esc', score: 5.0, weight: 0.10, icon: 'sparkles', color: 'emerald', description: 'Conjunto padrão (central + laterais), funciona bem com manutenção.' },
            { id: 'c5', name: 'Altura', shortName: 'Alt', score: 7.0, weight: 0.10, icon: 'ruler', color: 'orange', description: '9,6 cm é um bom equilíbrio para passar sob móveis comuns.' },
            { id: 'c6', name: 'Manutenção', shortName: 'Man', score: 6.0, weight: 0.08, icon: 'wrench', color: 'slate', description: 'Consumíveis acessíveis; eletrônica tende a ser mais difícil.' },
            { id: 'c7', name: 'Bateria', shortName: 'Bat', score: 6.5, weight: 0.05, icon: 'battery', color: 'green', description: 'Autonomia forte (até ~140 min) com recarga e retomada.' },
            { id: 'c8', name: 'Ruído', shortName: 'dB', score: 5.0, weight: 0.05, icon: 'volume2', color: 'amber', description: 'Sem dB oficial; tratado como ruído médio de categoria.' },
            { id: 'c9', name: 'Base', shortName: 'Base', score: 6.0, weight: 0.05, icon: 'home', color: 'red', description: 'Base simples e confiável; sem recursos automáticos.' },
            { id: 'c10', name: 'IA', shortName: 'IA', score: 3.0, weight: 0.02, icon: 'brain', color: 'pink', description: 'Sem visão/câmera; decisões por sensores.' },
        ],
    },

    // ===========================================================
    // ⚖️ Veredito Técnico
    // ===========================================================
    auditVerdict: {
        solution: {
            title: 'A Solução',
            icon: 'checkCircle',
            color: 'emerald',
            items: [
                'Mapeamento com Laser 3D + giroscópio para cobrir o ambiente com menos "idas e vindas"',
                'Recarga automática e retoma de onde parou (ótimo para casas maiores)',
                'App com mapa, agendamento e modos por cômodo/ponto',
                'Compatível com Alexa e Google Assistant',
                'Filtro HEPA ajuda a segurar poeira fina e alérgenos',
            ],
        },
        attentionPoint: {
            title: 'Ponto de Atenção',
            icon: 'alertTriangle',
            color: 'amber',
            items: [
                'Sucção 2000 Pa é de entrada/intermediário — em tapete alto ou sujeira pesada pode ficar abaixo do esperado',
                'Mop é por arrasto (manutenção), não é sistema de esfregação pressurizada',
                'Ruído (dB) não é informado oficialmente — expectativa realista: nível médio',
                'Recursos como "no-go zones" podem variar por versão/lote (ver no app antes de decidir)',
            ],
        },
        technicalConclusion: {
            title: 'Conclusão Técnica',
            icon: 'clipboard',
            color: 'blue',
            text: 'Tecnicamente, o Smart 700 se posiciona como "mapeador acessível": navegação por Laser 3D + giroscópio, autonomia forte e retorno inteligente, entregando o essencial para manutenção diária. Ele não é premium (sem estação/IA por câmera), mas é uma opção sólida quando a prioridade é praticidade com mapa.',
        },
        dontBuyIf: {
            title: 'Não Compre Se',
            icon: 'xCircle',
            color: 'red',
            items: [
                'Você quer esfregar sujeira pesada (mop por arrasto não resolve)',
                'Você precisa de autoesvaziamento/estação (não tem)',
                'Seu foco é tapete alto e muita sujeira pesada (2000 Pa pode limitar)',
                'Você quer IA de desvio por câmera/3D com reconhecimento de objetos',
            ],
        },
    },

    // ===========================================================
    // 📝 Editorial
    // ===========================================================
    benefitSubtitle: 'Mapeamento com retorno inteligente + controle por app/voz para limpar sem esforço',

    featureBenefits: [
        {
            icon: 'Radar',
            title: 'Mapa e limpeza inteligente',
            description: 'Laser 3D + giroscópio para mapear e limpar por cômodo, bordas ou pontos específicos.',
        },
        {
            icon: 'Zap',
            title: 'Controle por app e voz',
            description: 'App KaBuM! Smart para agendar, ajustar sucção e acompanhar o mapa; Alexa/Google para comandos rápidos.',
        },
        {
            icon: 'Clock',
            title: 'Autonomia com retorno ao ponto',
            description: 'Até ~140 min; quando a bateria baixa, volta à base e retoma de onde parou.',
        },
        {
            icon: 'Tag',
            title: 'Bom custo-benefício com mapa',
            description: 'Entrega recursos de "robô mapeador" sem ir para a faixa premium com estação automática.',
        },
    ],

    badges: ['best-value'] as const,

    // ===========================================================
    // 🛒 Ofertas (Amazon + Magalu + ML)
    // ===========================================================
    offers: [
        {
            store: 'Amazon',
            storeSlug: 'amazon',
            price: 1429.99,
            url: 'https://www.amazon.com.br/dp/B0D79J1V2T',
            affiliateUrl: 'https://www.amazon.com.br/dp/B0D79J1V2T?tag=comparatop-20',
            inStock: true,
            lastChecked: '2026-01-30',
        },
        {
            store: 'Magalu',
            storeSlug: 'magalu',
            price: 1199.00,
            url: 'https://www.magazineluiza.com.br/robo-aspirador-e-passa-pano-kabum-smart-700-5-modos-de-limpeza-mapeamento-a-laser-3d-base-de-carregamento-bivolt-preto-kbsf003/p/abj767dff6/ep/eprb/',
            affiliateUrl: 'https://www.magazinevoce.com.br/magazinecomparatop/robo-aspirador-e-passa-pano-kabum-smart-700-5-modos-de-limpeza-mapeamento-a-laser-3d-base-de-carregamento-bivolt-preto-kbsf003/p/abj767dff6/ep/eprb/',
            inStock: true,
            lastChecked: '2026-01-30',
        },
        {
            store: 'Mercado Livre',
            storeSlug: 'mercado_livre',
            price: 899.00,
            url: 'https://produto.mercadolivre.com.br/MLB-3663326431-robo-aspirador-de-po-kabum-700-passa-pano-mapeamento-_JM',
            affiliateUrl: 'https://produto.mercadolivre.com.br/MLB-3663326431-robo-aspirador-de-po-kabum-700-passa-pano-mapeamento-_JM',
            inStock: true,
            lastChecked: '2026-01-30',
        },
    ],

    // ===========================================================
    // ⚔️ Competidor Principal
    // ===========================================================
    mainCompetitor: {
        id: 'liectroux-xr500-pro',
        name: 'Liectroux XR500 Pro (3 em 1, mapeamento e app)',
        shortName: 'Liectroux XR500',
        imageUrl: '/images/products/liectroux-xr500-pro.svg',
        price: 1889.00,
        score: 7.5,
        keyDifferences: [
            {
                label: 'Ecossistema/Reposição',
                current: 'Kits e peças com boa oferta no Brasil (KaBuM!/terceiros)',
                rival: 'Depende mais de importação/marketplace',
                winner: 'current',
            },
            {
                label: 'Plataforma',
                current: 'Laser 3D + giroscópio; app KaBuM! Smart',
                rival: 'Varia por lote; normalmente app TUYA/derivados',
                winner: 'current',
            },
            {
                label: 'Preço',
                current: 'R$ 799 a R$ 1.199',
                rival: 'R$ 1.889',
                winner: 'current',
            },
        ],
    },

    // ===========================================================
    // 🔧 Acessório Recomendado
    // ===========================================================
    recommendedAccessory: {
        asin: 'B0D57FGWNH',
        name: 'Escovas de Reposição para Robôs Aspiradores KaBuM! Smart 500 e Smart 700 (par)',
        shortName: 'Escovas laterais (par)',
        price: 25.00,
        imageUrl: 'https://m.media-amazon.com/images/I/51rLne6tSBL._AC_SX300_SY300_QL70_ML2_.jpg',
        reason: 'Escovas laterais são consumível que mais "cansa" e derruba a eficiência nos cantos — manter um par reserva evita queda de performance.',
        affiliateUrl: 'https://www.amazon.com.br/dp/B0D57FGWNH?tag=comparatop-20',
    },

    // ===========================================================
    // 🗣️ VOC - Voz do Consumidor
    // ===========================================================
    voc: {
        totalReviews: 2614,
        averageRating: 4.4,
        consensusScore: 88,
        oneLiner: 'Robô "custo-benefício" com mapa e retorno ao ponto — ideal para manutenção diária, sem luxo de estação.',
        summary: 'O Smart 700 agrada principalmente pela praticidade (mapa, agendamento, controle por app e voz) e por conseguir manter o chão "em dia". As críticas mais comuns tendem a aparecer quando o usuário espera sucção de topo ou esfregação pesada: o mop é por arrasto e a sucção é de entrada/intermediário (2000 Pa).',
        pros: [
            'Mapeamento + limpeza por cômodo/ponto e agendamento',
            'Recarga automática com "retoma de onde parou"',
            'Compatível com Alexa/Google e filtro HEPA',
        ],
        cons: [
            'Mop por arrasto: não remove sujeira pesada incrustada',
            'Sem autoesvaziamento e sem IA por câmera',
        ],
        sources: [
            { name: 'KaBuM!', url: 'https://www.kabum.com.br/produto/155444/robo-aspirador-e-passa-pano-kabum-smart-700-5-modos-de-limpeza-mapeamento-a-laser-3d-base-de-carregamento-bivolt-preto-kbsf003', count: 1000 },
            { name: 'Magalu', url: 'https://www.magazineluiza.com.br/robo-aspirador-e-passa-pano-kabum-smart-700-5-modos-de-limpeza-mapeamento-a-laser-3d-base-de-carregamento-bivolt-preto-kbsf003/p/abj767dff6/ep/eprb/', count: 2614 },
            { name: 'Amazon', url: 'https://www.amazon.com.br/dp/B0D79J1V2T', count: 10 },
        ],
    },

    extendedVoc: {
        consensusScore: 88,
        totalReviews: '2614',
        acceptableFlaw: 'A sucção (2000 Pa) e o mop por arrasto são "suficientes" para manutenção, mas não substituem limpeza pesada.',
        realWorldScenario: 'Você deixa o robô rodar 3x/semana em zigue-zague e cantos; no dia a dia ele segura poeira e pelos, e você faz faxina pesada só 1x por semana.',
        goldenTip: 'Para o "passa pano" funcionar bem: pano sempre limpo, pouca água (nível baixo/médio) e rota em zigue-zague — não espere esfregar sujeira grudada.',
    },

    // ===========================================================
    // 💰 TCO - Custo Total de Propriedade (5 anos)
    // ===========================================================
    tcoData: {
        purchasePrice: 799.9,
        energyCost5y: 20.75,
        maintenanceCost5y: 650.0,
        totalCost5y: 1470.65,
        monthlyReserve: 24.51,
        lifespanYears: 4,
    },

    extendedTco: {
        purchasePrice: 799.9,
        energyCost5y: 20.75,
        maintenanceCost5y: 650.0,
        totalCost5y: 1470.65,
        monthlyReserve: 24.51,
        lifespan: {
            years: 4,
            limitingComponent: 'Bateria (Li-ion) e sensores de navegação',
            limitingComponentLife: 3.5,
            weibullExplanation: 'Falhas em robôs aspiradores costumam acelerar após 3–5 anos por desgaste de bateria, motores e sensores. Manter filtros/escovas em dia reduz carga no motor.',
        },
        repairability: {
            score: 6,
            level: 'moderate',
            components: [
                {
                    name: 'Kit Consumíveis',
                    score: 10,
                    price: 80,
                    availability: 'available',
                    failureSymptoms: ['Perda de desempenho'],
                    repairAdvice: 'Troque filtros/escovas/pano periodicamente (consumível).',
                },
                {
                    name: 'Bateria',
                    score: 6,
                    price: 250,
                    availability: 'limited',
                    failureSymptoms: ['Autonomia cai rápido', 'Não completa limpeza', 'Desliga fora da base'],
                    repairAdvice: 'Substituição costuma "reviver" o robô após 2–4 anos, dependendo do uso.',
                },
                {
                    name: 'Motor de Sucção',
                    score: 5,
                    price: 0,
                    availability: 'limited',
                    failureSymptoms: ['Perda de sucção', 'Ruído anormal', 'Cheiro de queimado'],
                    repairAdvice: 'Trocar filtro e escovas primeiro; se continuar, motor/assistência.',
                },
                {
                    name: 'Módulo de Roda',
                    score: 5,
                    price: 0,
                    availability: 'limited',
                    failureSymptoms: ['Não sobe pequenos desníveis', 'Trava em rota', 'Faz "clique" ao andar'],
                    repairAdvice: 'Limpeza de cabelos e sujeira; se persistir, troca do módulo.',
                },
                {
                    name: 'Sensor de Navegação (Laser/IR)',
                    score: 4,
                    price: 0,
                    availability: 'scarce',
                    failureSymptoms: ['Mapa "enlouquece"', 'Bate mais que o normal', 'Não encontra a base'],
                    repairAdvice: 'Limpeza do módulo/sensores e reset do mapa; se persistir, assistência.',
                },
                {
                    name: 'Placa Principal',
                    score: 3,
                    price: 0,
                    availability: 'scarce',
                    failureSymptoms: ['Não liga', 'Perde Wi‑Fi', 'Erros intermitentes'],
                    repairAdvice: 'Se fora da garantia, o caminho mais realista é assistência/placa compatível por marketplace.',
                },
            ],
        },
    },

    // ===========================================================
    // 🛠️ Simuladores
    // ===========================================================
    simulators: {
        sizeAlert: {
            status: 'warning',
            message: 'Altura ~9,6 cm: normalmente passa sob móveis com vão ≥ 10,5 cm. Meça o menor vão antes de comprar.',
            idealRange: { min: 6, max: 9 },
        },
        soundAlert: {
            status: 'acceptable',
            message: 'Sem dB oficial. Se ruído for crítico, use modo mais baixo e programe para horários em que não incomode.',
            suggestions: [],
        },
        energyAlert: {
            rating: 'A',
            message: 'Potência nominal 28W. Em uso típico (3x/semana), o custo de energia em 5 anos é baixo (premissa: R$0,95/kWh).',
        },
    },

    // ===========================================================
    // 🎯 Header
    // ===========================================================
    header: {
        overallScore: 62,
        scoreLabel: 'Bom',
        title: 'KaBuM! Smart 700: robô com mapa "de verdade" sem custo premium',
        subtitle: 'Laser 3D + retorno inteligente + app/voz — perfeito para manter a casa em dia',
        badges: [
            { type: 'feature', label: 'Laser 3D + mapa', icon: 'radar' },
            { type: 'feature', label: 'Retoma após recarga', icon: 'zap' },
        ],
    },

    // ===========================================================
    // ❓ FAQ
    // ===========================================================
    decisionFAQ: [
        {
            id: 'p1',
            icon: 'AlertTriangle',
            question: 'É Laser 3D ou "IR 360°"?',
            answer: 'Existe variação de nomenclatura nas lojas. A própria KaBuM! descreve como navegação a Laser 3D + giroscópio, enquanto alguns anúncios chamam de "IR 360°". O que importa: ele mapeia o ambiente, retorna sozinho à base e consegue limpar por áreas/pontos (não é "aleatório").',
        },
        {
            id: 'p2',
            icon: 'Scale',
            question: 'Dá para bloquear áreas (no-go zones)?',
            answer: 'Algumas listagens citam versão 2.0 com "paredes virtuais" e "áreas restritas". Se isso for decisivo, confirme no app KaBuM! Smart após parear e verifique se há opção de no-go.',
        },
        {
            id: 'p3',
            icon: 'Wrench',
            question: 'O que mais "dá defeito" e o que devo trocar primeiro?',
            answer: 'Consumíveis (filtro HEPA, escovas e pano) são o primeiro gargalo de performance. Troca preventiva melhora sucção e cantos. Em 2–4 anos, a bateria costuma ser o limitante.',
        },
    ],

    // ===========================================================
    // 🔧 Ferramentas Interativas
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

export default kabum_smart_700;
