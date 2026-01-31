/**
 * Product Entry: eufy-omni-c20
 * Extracted from products.ts for modular architecture
 */
import type { Product } from '@/types/category';

export const eufy_omni_c20: Product = {
        id: 'eufy-omni-c20',
        categoryId: 'robot-vacuum',
        name: 'eufy Omni C20 Robô Aspirador e Mop 7.000 Pa com Estação Tudo-em-Um (220V)',
        shortName: 'Omni C20',
        brand: 'eufy',
        model: 'C20',
        price: 3419.10,
        asin: 'B0G6Z6PTJG',
        imageUrl: '/images/products/eufy-omni-c20.svg',
        status: 'published',
        benefitSubtitle: '7.000 Pa + estação que esvazia/lava/seca + corpo 8,5 cm por ~R$ 3.419 no Pix',

        useSimplifiedPDP: true,

        evidenceLevel: 'high',
        contextualScoreRange: [7.5, 7.9],
        contextualScoreConfidence: 'high',
        tcoTotalRange: [4500, 5600],
        tcoConfidence: 'medium',

        scores: {
            c1: 7.2,
            c2: 8.2,
            c3: 6.8,
            c4: 8.5,
            c5: 9.6,
            c6: 7.0,
            c7: 6.5,
            c8: 8.3,
            c9: 8.8,
            c10: 5.5,
        },

        specs: {
            suctionPower: 7000,
            batteryCapacity: 3200,
            dustbinCapacity: 250,
            waterTankCapacity: 0,
            noiseLevel: 56,
            width: 33.4,
            height: 8.5,
            depth: 32.8,
        },

    // Structured specs for scoring module
    structuredSpecs: {
        navigationType: 'lidar',
        mopType: 'rotating',
        brushType: 'bristle',
        dockType: 'auto-wash',
        obstacleDetection: 'bump-only',
        heightCm: 8.5,
        noiseDb: 56,
        runtimeMinutes: 132,
        batteryMah: 3200,
    },

        attributes: {
            navigationType: 'lidar',
            hasMop: true,
            mopType: 'rotativo',
            hasAutoEmpty: true,
            hasMapping: true,
            hasNoGoZones: true,
            hasRechargeResume: true,
            hasAppControl: true,
            voiceAssistants: ['alexa', 'google', 'siri'],
            wifiBand: '2.4ghz',
            climbHeight: 18,
            brushType: 'standard_bristle',
            batteryMah: 3200,
            chargingTimeHours: 3.3,
            runtimeMinutes: 132,
        },

        technicalSpecs: {
            suctionPower: 7000,
            dustbinCapacity: 250,
            waterTankCapacity: 0,
            mopType: 'Discos rotativos (Mop Master™) — 180 RPM e 6N de pressão',
            brushType: 'Escova principal com pente Pro-Detangle (antiembaraço) + escova lateral',
            filterType: 'Alto desempenho lavável',
            navigation: 'Map-based com sensor iPath + LiDAR estático (baixo perfil)',
            mapping: true,
            lidar: true,
            camera: false,
            obstacleDetection: 'bump-only',
            climbHeight: 18,
            runtime: '132 minutos',
            batteryCapacity: 3200,
            chargingTime: '~3h15',
            autoRecharge: true,
            rechargeResume: true,
            wifi: true,
            appControl: true,
            voiceControl: 'Alexa, Google Assistant e Siri',
            scheduling: true,
            multiFloorMapping: true,
            dockType: 'Omni Station Tudo-em-Um (auto-esvaziamento + lava + seca + refil de água)',
            autoEmpty: true,
            autoMopWash: true,
            autoRefill: true,
            height: 8.5,
            diameter: 33.4,
            weight: 3.3,
            noiseLevel: 56,
            voltage: 220,
        },

        scoreReasons: {
            c1: 'Mapeia e permite múltiplos mapas/zonas, porém o LiDAR estático e a falta de evasão robusta de objetos reduzem a consistência.',
            c2: 'App eufy Clean com agendamento, zonas proibidas e multiandar; integra com Alexa/Google/Siri.',
            c3: 'Mop rotativo com 180 RPM/6N e estação que lava/seca ajuda muito, mas sem tanque interno de água.',
            c4: 'Pente Pro-Detangle reduz emaranhamento e manutenção de pelos; bom para casas com pets.',
            c5: '8,5 cm é um diferencial real — entra sob móveis baixos onde robôs com torre LiDAR não passam.',
            c6: 'Base reduz trabalho diário (esvazia/lava/seca), mas há consumíveis e troca de bateria exige abrir base.',
            c7: 'Autonomia ok, porém não é campeã; em áreas grandes pode exigir recargas.',
            c8: '56 dB é um perfil acústico bom para uso diário.',
            c9: 'Omni Station completa (esvazia + lava + seca + tanques transparentes) entrega experiência hands-free.',
            c10: 'Tem recursos inteligentes e mapeamento, mas não oferece evasão de objetos avançada.',
        },

        voc: {
            totalReviews: 3029,
            averageRating: 4.1,
            consensusScore: 82.0,
            oneLiner: 'Potente no aspirado e muito conveniente pela estação, mas exige casa "organizada".',
            summary: 'Destaque para conveniência da estação e sucção forte em pisos. Usuários elogiam o perfil baixo e antiembaraço.',
            pros: ['Sucção forte (7.000 Pa)', 'Estação tudo-em-um', 'Perfil ultrafino (8,5 cm)'],
            cons: ['Evasão de obstáculos limitada', 'Desempenho mediano em carpetes densos'],
            sources: [],
        },

        painPointsSolved: ['Móveis baixos (robô passa com 8,5 cm)', 'Rotina corrida (estação reduz manutenção)', 'Pelos/cabelos (antiembaraço)'],
        badges: ['premium-pick'],

        offers: [
            {
                store: 'Amazon',
                storeSlug: 'amazon',
                price: 3419.10,
                url: 'https://www.amazon.com.br/dp/B0G6Z6PTJG',
                affiliateUrl: 'https://www.amazon.com.br/dp/B0G6Z6PTJG',
                inStock: true,
                lastChecked: '2026-01-29',
            },
        ],

        lastUpdated: '2026-01-29',

        tcoData: {
            purchasePrice: 3419,
            energyCost5y: 220,
            maintenanceCost5y: 1300,
            totalCost5y: 4939,
            monthlyReserve: 41,
            lifespanYears: 6,
        },

        gallery: ['/images/products/eufy-omni-c20.svg'],

        featureBenefits: [
            { icon: 'Radar', title: 'Mapeamento + Multiandar', description: 'Cria mapas, salva múltiplos andares e permite zonas proibidas.' },
            { icon: 'Zap', title: '7.000 Pa de sucção', description: 'Alta força de sucção para migalhas, poeira e pelos.' },
            { icon: 'Clock', title: 'Estação "sem mãos"', description: 'Auto-esvazia, lava e seca os panos do mop.' },
            { icon: 'Tag', title: 'Ultrafino (8,5 cm)', description: 'Entra sob camas, racks e sofás baixos.' },
        ],

        mainCompetitor: {
            id: 'roborock-qrevo-s',
            name: 'Roborock Qrevo S',
            shortName: 'Qrevo S',
            imageUrl: '/images/products/competidor.svg',
            price: 4999.00,
            score: 8.2,
            keyDifferences: [
                { label: 'Evasão de obstáculos', current: 'Limitada', rival: 'Mais robusta', winner: 'rival' },
                { label: 'Altura', current: '8,5 cm (excelente)', rival: 'Mais alto', winner: 'current' },
                { label: 'Preço', current: 'R$ 3.419', rival: 'R$ 4.999', winner: 'current' },
            ],
        },

        recommendedAccessory: {
            asin: 'B0FCSM21CJ',
            name: 'Kit de reposição C20 Omni (escovas + filtros + mop + sacos de pó)',
            shortName: 'Kit Reposição C20',
            price: 169.90,
            imageUrl: '/images/products/acessorio.svg',
            reason: 'O C20 usa consumíveis. Ter um kit reduz custo/tempo quando cair desempenho.',
            affiliateUrl: 'https://www.amazon.com.br/dp/B0FCSM21CJ',
        },

        productDimensions: {
            diameter: 33.4,
            height: 8.5,
        },

        header: {
            overallScore: 7.71,
            scoreLabel: 'Muito Bom',
            title: 'eufy Omni C20 — potência e estação completa em corpo ultrafino',
            subtitle: '7.000 Pa + estação tudo-em-um com 8,5 cm de altura.',
            badges: [
                { type: 'feature', label: '8,5 cm ultrafino', icon: 'radar' },
                { type: 'feature', label: '7.000 Pa', icon: 'zap' },
                { type: 'feature', label: 'Estação Tudo-em-Um', icon: 'brain' },
            ],
        },

        extendedVoc: {
            consensusScore: 82.0,
            totalReviews: '3.000+',
            acceptableFlaw: 'A comunidade aceita que ele pode enroscar em cabos/franjas — a solução é manter o chão limpo.',
            realWorldScenario: 'Uso diário em piso frio/madeira com manutenção mínima: agenda pelo app e deixa a estação cuidar.',
            goldenTip: 'Configure zonas proibidas para áreas com fios e tapetes felpudos.',
        },

        auditVerdict: {
            solution: {
                title: 'A Solução',
                icon: 'checkCircle',
                color: 'emerald',
                items: [
                    'Sucção de 7.000 Pa com boa coleta em pisos duros',
                    'Estação Tudo-em-Um reduz manutenção (auto-esvazia + mop care)',
                    'Mop rotativo com 180 RPM e pressão (6N)',
                    'Perfil de 8,5 cm excelente para móveis baixos',
                    'Antiembaraço (Pro-Detangle) economiza tempo',
                ],
            },
            attentionPoint: {
                title: 'Ponto de Atenção',
                icon: 'alertTriangle',
                color: 'amber',
                items: [
                    'Evasão de obstáculos limitada: cabos podem causar travamentos',
                    'Sem tanque interno de água',
                    'Em carpetes densos, sujeira fina pode exigir passadas extras',
                    'Consumíveis e sacos de pó entram no custo recorrente',
                ],
            },
            technicalConclusion: {
                title: 'Conclusão Técnica',
                icon: 'clipboard',
                color: 'blue',
                text: 'O Omni C20 é um robô "muito bom" para quem prioriza conveniência e limpeza diária em pisos duros, com o bônus do corpo ultrafino. Excelente quando você controla o ambiente (cabos/tapetes difíceis).',
            },
            dontBuyIf: {
                title: 'Não Compre Se',
                icon: 'xCircle',
                color: 'red',
                items: [
                    'Sua casa tem muitos cabos no chão',
                    'Precisa de mopping forte para manchas pesadas',
                    'Uso majoritário em carpetes altos/densos',
                    'Busca evasão de objetos nível "topo de linha"',
                ],
            },
        },

        productDna: {
            title: 'DNA do Produto',
            subtitle: '10 Dimensões de Avaliação',
            dimensions: [
                { id: 'c1', name: 'Navegação', shortName: 'Nav', score: 7.2, weight: 0.25, icon: 'radar', color: 'cyan', description: 'Bom mapeamento, mas sem evasão robusta.' },
                { id: 'c2', name: 'Software', shortName: 'App', score: 8.2, weight: 0.15, icon: 'smartphone', color: 'purple', description: 'App completo + voz.' },
                { id: 'c3', name: 'Sistema de Mop', shortName: 'Mop', score: 6.8, weight: 0.15, icon: 'droplet', color: 'blue', description: 'Rotativo com pressão, sem tanque interno.' },
                { id: 'c4', name: 'Escovas', shortName: 'Esc', score: 8.5, weight: 0.10, icon: 'sparkles', color: 'emerald', description: 'Antiembaraço Pro-Detangle.' },
                { id: 'c5', name: 'Altura', shortName: 'Alt', score: 9.6, weight: 0.10, icon: 'ruler', color: 'orange', description: '8,5 cm: vantagem real.' },
                { id: 'c6', name: 'Manutenção', shortName: 'Man', score: 7.0, weight: 0.08, icon: 'wrench', color: 'slate', description: 'Estação ajuda, mas há consumíveis.' },
                { id: 'c7', name: 'Bateria', shortName: 'Bat', score: 6.5, weight: 0.05, icon: 'battery', color: 'green', description: 'Autonomia ok.' },
                { id: 'c8', name: 'Ruído', shortName: 'dB', score: 8.3, weight: 0.05, icon: 'volume2', color: 'amber', description: '56 dB confortável.' },
                { id: 'c9', name: 'Base', shortName: 'Base', score: 8.8, weight: 0.05, icon: 'home', color: 'red', description: 'All-in-one: esvazia + lava + seca.' },
                { id: 'c10', name: 'IA', shortName: 'IA', score: 5.5, weight: 0.02, icon: 'brain', color: 'pink', description: 'Pouca evasão avançada.' },
            ],
        },

        simulators: {
            sizeAlert: {
                status: 'ok',
                message: 'Com 8,5 cm, tende a passar sob a maioria dos móveis com vão ≥ 9 cm.',
                idealRange: { min: 6, max: 9 },
            },
            soundAlert: {
                status: 'acceptable',
                message: '56 dB é um nível bom para rodar durante o dia.',
                suggestions: [
                    { condition: 'Se quer mais silêncio à noite', product: 'Robôs com modo ultra-silencioso', reason: 'Menos ruído sacrificando sucção.' },
                ],
            },
            energyAlert: {
                rating: 'A',
                message: 'Consumo típico baixo para uso diário.',
            },
        },

        extendedTco: {
            purchasePrice: 3419,
            energyCost5y: 220,
            maintenanceCost5y: 1300,
            totalCost5y: 4939,
            monthlyReserve: 41,
            lifespan: {
                years: 6,
                categoryAverage: 7,
                limitingComponent: 'Bateria e bombas/vedações do sistema de base',
                limitingComponentLife: 3.5,
                weibullExplanation: 'Uso diário leve a moderado. Bateria Li‑ion perde autonomia em ~3–4 anos; com troca de consumíveis, plataforma chega a ~6 anos.',
            },
            repairability: {
                score: 5.8,
                level: 'moderate',
                categoryAverage: 6.5,
                components: [
                    { name: 'Placa Principal', score: 5, price: 650, availability: 'scarce', failureSymptoms: ['Não liga', 'Reset constante', 'Falha Wi‑Fi'], repairAdvice: 'Confirmar fonte/base e bateria antes.' },
                    { name: 'Sensor Principal', score: 5, price: 280, availability: 'scarce', failureSymptoms: ['Mapeamento inconsistente', 'Bate em obstáculos'], repairAdvice: 'Limpar janelas/sensores e verificar atualizações.' },
                    { name: 'Motor de Sucção', score: 6, price: 420, availability: 'limited', failureSymptoms: ['Perda forte de sucção', 'Ruído anormal'], repairAdvice: 'Checar filtros/obstruções primeiro.' },
                    { name: 'Bateria', score: 7, price: 260, availability: 'limited', failureSymptoms: ['Autonomia caiu muito', 'Não completa ciclos'], repairAdvice: 'Troca possível. Preferir bateria 14.4V/3200mAh.' },
                    { name: 'Módulo de Roda', score: 6, price: 320, availability: 'limited', failureSymptoms: ['Patina', 'Erro de roda'], repairAdvice: 'Remover fios/cabelos presos.' },
                    { name: 'Kit Consumíveis', score: 10, price: 170, availability: 'available', failureSymptoms: ['Perda de desempenho'], repairAdvice: 'Consumível. Kits genéricos funcionam.' },
                ],
            },
        },

        decisionFAQ: [
            { id: 'c20-cabos', icon: 'AlertTriangle', question: 'Ele desvia bem de cabos e objetos pequenos?', answer: 'Ele faz mapeamento, mas a evasão é limitada. Para ciclos sem travar, prepare o ambiente e use zonas proibidas.' },
            { id: 'c20-mop', icon: 'Scale', question: 'O mop "lava de verdade"?', answer: 'Sistema rotativo (180 RPM/6N) ajuda bastante em manutenção. Para manchas pesadas, pode exigir passadas extras.' },
            { id: 'c20-casa-grande', icon: 'Wrench', question: 'Serve para casa grande?', answer: 'Serve, mas pode fazer recargas durante a rotina (dustbin 250 ml). Divida por cômodos no app.' },
        ],

        interactiveTools: [
            { id: 'dimension-check', icon: 'ruler', title: 'Será que cabe?', badge: 'Teste Rápido', badgeColor: 'orange', description: 'Verifique se o robô passa debaixo dos seus móveis', toolType: 'geometry', configRef: 'robo-passa-movel' },
        ],
    };
