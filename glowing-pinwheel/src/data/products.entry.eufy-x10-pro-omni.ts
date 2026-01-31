/**
 * Product Entry: eufy-x10-pro-omni
 * Extracted from products.ts for modular architecture
 */
import type { Product } from '@/types/category';

export const eufy_x10_pro_omni: Product = {
        id: 'eufy-x10-pro-omni',
        categoryId: 'robot-vacuum',
        name: 'eufy X10 Pro Omni Robô Aspirador 8.000 Pa com Omni Station (220V)',
        shortName: 'eufy X10 Pro Omni',
        brand: 'eufy',
        model: 'X10 Pro Omni',
        price: 4679.10,
        asin: 'B0CPFBBHP4',
        imageUrl: '/images/products/eufy-x10-pro-omni.svg',
        status: 'published',
        benefitSubtitle: 'Omni Station completa (esvazia, lava e seca mop) + 8.000 Pa + IA anti-obstáculos para pets',

        useSimplifiedPDP: true,

        evidenceLevel: 'high',
        contextualScoreRange: [7.3, 7.9],
        contextualScoreConfidence: 'high',
        tcoTotalRange: [6400, 7600],
        tcoConfidence: 'medium',

        scores: {
            c1: 9,  // Navegação: LiDAR + AI.Map 3.0
            c2: 9,  // App: Completo com Alexa/Google
            c3: 9,  // Mop: MopMaster 2.0 rotativo + lift
            c4: 9,  // Escovas: Híbrida anti-emaranhamento
            c5: 7,  // Altura: 11.35cm
            c6: 6,  // Manutenibilidade: peças específicas caras
            c7: 8,  // Bateria: 173min
            c8: 8,  // Ruído: <60dB
            c9: 10, // Base: Omni Station completa
            c10: 9, // IA: 100+ obstáculos
        },

        specs: {
            suctionPower: 8000,
            batteryCapacity: 5200,
            dustbinCapacity: 330,
            waterTankCapacity: 330,
            noiseLevel: 60,
            width: 35.3,
            height: 11.35,
            depth: 32.7,
        },

    // Structured specs for scoring module
    structuredSpecs: {
        navigationType: 'lidar',
        mopType: 'rotating',
        brushType: 'anti-tangle',
        dockType: 'auto-wash',
        obstacleDetection: 'ai-camera',
        heightCm: 11.35,
        noiseDb: 60,
        runtimeMinutes: 173,
        batteryMah: 5200,
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
            voiceAssistants: ['alexa', 'google'],
            wifiBand: '2.4ghz',
            climbHeight: 20,
            brushType: 'hybrid_detangle',
            batteryMah: 5200,
            chargingTimeHours: 4,
            runtimeMinutes: 173,
        },

        technicalSpecs: {
            suctionPower: 8000,
            dustbinCapacity: 330,
            waterTankCapacity: 330,
            mopType: 'MopMaster 2.0 (duas mopas rotativas, 180 RPM, 1 kg de pressão, lift 12 mm em tapetes)',
            brushType: 'Escova flutuante híbrida + lâmina pente anti-emaranhamento',
            filterType: 'HEPA',
            navigation: 'LiDAR iPath + luz estruturada (LED) + AI.Map 3.0',
            mapping: true,
            lidar: true,
            camera: false,
            obstacleDetection: 'IA (100+ tipos de obstáculos)',
            climbHeight: 20,
            runtime: '173 minutos (aspirar) | 136 min (aspirar + mop)',
            batteryCapacity: 5200,
            chargingTime: '≈ 4 horas',
            autoRecharge: true,
            rechargeResume: true,
            wifi: true,
            appControl: true,
            voiceControl: 'Alexa, Google Assistente',
            scheduling: true,
            multiFloorMapping: true,
            dockType: 'Omni Station: auto-esvaziamento + lavagem mop + secagem 45°C',
            autoEmpty: true,
            autoMopWash: true,
            autoRefill: true,
            height: 11.35,
            diameter: 35.3,
            weight: 4.56,
            noiseLevel: 60,
            voltage: 220,
        },

        scoreReasons: {
            c1: 'PREMIUM: LiDAR iPath + AI.Map 3.0 com multi-andares e rotas eficientes.',
            c2: 'EXCELENTE: App completo com agendamento por cômodo e Alexa/Google.',
            c3: 'TOPO: MopMaster 2.0 com 180 RPM, 1 kg de pressão e lift 12 mm.',
            c4: 'TOPO: Escova híbrida com anti-emaranhamento — excelente para pets.',
            c5: 'ATENÇÃO: Altura ~11,35 cm; exige folga de 13 cm para móveis.',
            c6: 'MÉDIO: Marca forte, mas peças específicas podem ser caras.',
            c7: 'MUITO BOM: Até 173 min e recarrega e retoma automaticamente.',
            c9: 'REFERÊNCIA: Omni Station faz tudo (esvazia + lava + seca + água).',
            c10: 'PREMIUM: IA evita 100+ tipos de obstáculos.',
        },

        voc: {
            totalReviews: 3029,
            averageRating: 4.1,
            consensusScore: 82,
            oneLiner: 'Autonomia real de "apertar o botão e esquecer" — forte para pets e limpeza completa',
            summary: 'Sucção muito forte em tapetes, excelente para pelos, e base mãos-livres (esvazia, lava e seca mop).',
            pros: [
                'Sucção forte (8.000 Pa) e ótimo para pelos de pets',
                'Mop rotativo com pressão + levantamento em tapetes (12 mm)',
                'Omni Station completa: esvazia, lava e seca mop (45°C)',
            ],
            cons: [
                'Base grande — exige espaço e manutenção de tanques',
                'Requer Wi‑Fi 2.4 GHz (5 GHz não funciona)',
            ],
            sources: [],
        },

        painPointsSolved: ['Pelos de pets e tapetes', 'Rotina mãos-livres', 'Casas grandes', 'Manchas com mop rotativo'],
        badges: ['premium-pick'],

        offers: [
            {
                store: 'Amazon',
                storeSlug: 'amazon',
                price: 4679.10,
                url: 'https://www.amazon.com.br/dp/B0CPFBBHP4',
                affiliateUrl: 'https://www.amazon.com.br/dp/B0CPFBBHP4',
                inStock: true,
                lastChecked: '2026-01-29',
            },
        ],

        lastUpdated: '2026-01-29',

        tcoData: {
            purchasePrice: 4680,
            energyCost5y: 350,
            maintenanceCost5y: 1800,
            totalCost5y: 6830,
            monthlyReserve: 57,
            lifespanYears: 5,
        },

        gallery: ['/images/products/eufy-x10-pro-omni.svg'],

        featureBenefits: [
            { icon: 'Radar', title: 'IA anti-obstáculos', description: 'LiDAR + luz estruturada identifica obstáculos e otimiza rotas.' },
            { icon: 'Zap', title: '8.000 Pa + anti-embaraço', description: 'Sucção forte em tapetes e escova com lâmina pente.' },
            { icon: 'Clock', title: 'Manutenção espaçada', description: 'Saco 2,5L + tanques grandes tornam rotina mais autônoma.' },
            { icon: 'Tag', title: 'Omni Station completa', description: 'Esvazia pó, lava mopas e seca com ar aquecido (45°C).' },
        ],

        mainCompetitor: {
            id: 'roborock-q7-l5',
            name: 'Roborock Q7 L5 (referência)',
            shortName: 'Roborock Q7 L5',
            imageUrl: '/images/products/roborock-q7-l5.svg',
            price: 2799,
            score: 7.10,
            keyDifferences: [
                { label: 'Base', current: 'Omni Station completa', rival: 'Base simples', winner: 'current' },
                { label: 'Mop', current: 'Duplo rotativo + pressão', rival: 'Mop arrasto', winner: 'current' },
                { label: 'Sucção', current: '8.000 Pa', rival: '~5.500 Pa', winner: 'current' },
            ],
        },

        recommendedAccessory: {
            asin: 'B0D25YJ41F',
            name: 'Sacos de pó de reposição compatíveis com eufy X10 Pro Omni',
            shortName: 'Sacos de pó X10',
            price: 149.90,
            imageUrl: '/images/products/eufy-x10-dust-bag.svg',
            reason: 'A base usa saco 2,5L — ter reposição evita interrupção da rotina.',
            affiliateUrl: 'https://www.amazon.com/dp/B0D25YJ41F',
        },

        productDimensions: {
            diameter: 35.3,
            height: 11.35,
        },

        header: {
            overallScore: 7.51,
            scoreLabel: 'Muito Bom',
            title: 'eufy X10 Pro Omni',
            subtitle: 'Base completa + mop rotativo com pressão + 8.000 Pa — perfeito para pets',
            badges: [
                { type: 'feature', label: '8.000 Pa', icon: 'radar' },
                { type: 'feature', label: 'Omni Station', icon: 'zap' },
                { type: 'feature', label: 'IA anti-obstáculos', icon: 'brain' },
            ],
        },

        extendedVoc: {
            consensusScore: 82,
            totalReviews: '3.000+',
            acceptableFlaw: 'Aceitam a base ocupar espaço e exigir limpeza periódica dos tanques, porque a autonomia compensa.',
            realWorldScenario: 'Rotina típica: varre/aspira todo dia e faz mop algumas vezes por semana; destaca desempenho em pelos e tapetes.',
            goldenTip: 'Crie zonas "No-Mop" em tapetes delicados e use agendamento por cômodo.',
        },

        auditVerdict: {
            solution: {
                title: 'A Solução',
                icon: 'checkCircle',
                color: 'emerald',
                items: [
                    'Omni Station completa: esvazia pó + lava + seca mop + gerencia água',
                    'Mop rotativo com pressão (1 kg) e lift 12 mm em tapetes',
                    'Sucção alta (8.000 Pa) e excelente tração em carpete',
                    'Escova híbrida com anti-emaranhamento — forte em pelos de pets',
                    'Mapa e rotas eficientes com IA e detecção de obstáculos',
                ],
            },
            attentionPoint: {
                title: 'Ponto de Atenção',
                icon: 'alertTriangle',
                color: 'amber',
                items: [
                    'Altura ~11,35 cm: móveis baixos podem bloquear',
                    'Base grande: precisa de espaço e ventilação',
                    'Requer Wi‑Fi 2.4 GHz (não funciona em 5 GHz)',
                    'Voltagem 220V: 110V precisa transformador de 1000VA+',
                ],
            },
            technicalConclusion: {
                title: 'Conclusão Técnica',
                icon: 'clipboard',
                color: 'blue',
                text: 'Se você quer um robô "mãos‑livres de verdade" e tem pets, o X10 Pro Omni entrega o pacote completo: sucção alta, mop rotativo com pressão e base que reduz manutenção ao mínimo. Custo/benefício excelente desde que tenha espaço para a Omni Station.',
            },
            dontBuyIf: {
                title: 'Não Compre Se',
                icon: 'xCircle',
                color: 'red',
                items: [
                    'Móveis com vão menor que ~13 cm',
                    'Não tem espaço para a Omni Station',
                    'Casa usa apenas Wi‑Fi 5 GHz',
                    'Precisa de 110V sem transformador',
                ],
            },
        },

        productDna: {
            title: 'DNA do Produto',
            subtitle: '10 Dimensões PARR-BR para Robôs Aspiradores',
            dimensions: [
                { id: 'c1', name: 'Navegação & Mapeamento', shortName: 'Mapa', score: 9, weight: 0.25, icon: 'radar', color: 'cyan', description: 'LiDAR + AI.Map 3.0, multi-andares, zonas e rotas eficientes.' },
                { id: 'c2', name: 'Software & Conectividade', shortName: 'App', score: 9, weight: 0.15, icon: 'smartphone', color: 'purple', description: 'App completo com agendamento por cômodo e Alexa/Google.' },
                { id: 'c3', name: 'Sistema de Mop', shortName: 'Mop', score: 9, weight: 0.15, icon: 'droplet', color: 'blue', description: 'Mop rotativo com pressão e lavagem/secagem na base.' },
                { id: 'c4', name: 'Engenharia de Escovas', shortName: 'Escovas', score: 9, weight: 0.10, icon: 'sparkles', color: 'emerald', description: 'Escova híbrida com lâmina anti-emaranhamento (pets friendly).' },
                { id: 'c5', name: 'Altura & Acessibilidade', shortName: 'Altura', score: 7, weight: 0.10, icon: 'ruler', color: 'orange', description: '11,35 cm de altura; precisa de folga em móveis.' },
                { id: 'c6', name: 'Manutenibilidade', shortName: 'Reparo', score: 6, weight: 0.08, icon: 'wrench', color: 'slate', description: 'Consumíveis ok, mas peças da base podem ser caras.' },
                { id: 'c7', name: 'Bateria & Autonomia', shortName: 'Bateria', score: 8, weight: 0.05, icon: 'battery', color: 'green', description: 'Até 173 min (aspirar) e recarrega e retoma.' },
                { id: 'c8', name: 'Acústica', shortName: 'Ruído', score: 8, weight: 0.05, icon: 'volume2', color: 'amber', description: 'Silencioso <55 dB no modo silencioso.' },
                { id: 'c9', name: 'Base de Carregamento', shortName: 'Base', score: 10, weight: 0.05, icon: 'home', color: 'red', description: 'Omni Station completa (esvazia + lava + seca).' },
                { id: 'c10', name: 'IA & Extras', shortName: 'IA', score: 9, weight: 0.02, icon: 'brain', color: 'pink', description: 'IA de obstáculos (100+) e foco em privacidade.' },
            ],
        },

        simulators: {
            sizeAlert: {
                status: 'warning',
                message: 'Altura do robô ~11,35 cm. Se seus móveis têm vão abaixo de 13 cm, ele pode não passar.',
                idealRange: { min: 6, max: 9 },
            },
            soundAlert: {
                status: 'acceptable',
                message: 'Ruído baixo para a categoria (silencioso <55 dB). Secagem da base pode ser perceptível.',
                suggestions: [
                    { condition: 'Extremamente sensível a ruído', product: 'Robô sem secagem aquecida', reason: 'Evita ciclo de ar aquecido.' },
                ],
            },
            energyAlert: {
                rating: 'B',
                message: 'Base usa ar aquecido (45°C) para secar mopas — consumo moderado na rotina semanal.',
            },
        },

        extendedTco: {
            purchasePrice: 4680,
            energyCost5y: 350,
            maintenanceCost5y: 1800,
            totalCost5y: 6830,
            monthlyReserve: 57,
            lifespan: {
                years: 5,
                categoryAverage: 6.5,
                limitingComponent: 'Bateria Li-ion + bombas/vedações da base',
                limitingComponentLife: 4.0,
                weibullExplanation: 'Robôs com base "all-in-one" concentram desgaste em bateria (ciclos) e circuito de água (bombas, vedações). Estimativa de 5 anos com ponto crítico em ~4 anos.',
            },
            repairability: {
                score: 5.8,
                level: 'moderate',
                categoryAverage: 6.5,
                components: [
                    { name: 'Placa Principal', score: 3, price: 650, availability: 'limited', failureSymptoms: ['Não liga', 'Reinicia', 'Falha Wi‑Fi'], repairAdvice: 'Cheque fonte e contato de carga antes.' },
                    { name: 'Módulo de Sensores (LiDAR/Frontal)', score: 4, price: 800, availability: 'limited', failureSymptoms: ['Erro de mapa', 'Não evita obstáculos'], repairAdvice: 'Limpeza e calibração resolvem muitos casos.' },
                    { name: 'Motor de Sucção', score: 5, price: 450, availability: 'limited', failureSymptoms: ['Perda de sucção', 'Barulho anormal'], repairAdvice: 'Cheque filtro/ductos antes de assumir falha de motor.' },
                    { name: 'Bateria', score: 6, price: 550, availability: 'limited', failureSymptoms: ['Autonomia cai', 'Desliga antes de terminar'], repairAdvice: 'Troca costuma resolver.' },
                    { name: 'Módulo de Roda', score: 7, price: 220, availability: 'limited', failureSymptoms: ['Anda torto', 'Patina'], repairAdvice: 'Substituição viável.' },
                    { name: 'Kit Consumíveis', score: 10, price: 150, availability: 'available', failureSymptoms: ['Perda de desempenho', 'Cheiro/umidade'], repairAdvice: 'Consumíveis. Manter troca regular.' },
                ],
            },
        },

        decisionFAQ: [
            { id: 'voltagem-110v', icon: 'AlertTriangle', question: 'Posso usar em 110V?', answer: 'Este modelo é 220V. Em 110V você precisa de transformador de no mínimo 1000VA (recomendado 1200VA+).' },
            { id: 'pets-pelos', icon: 'Scale', question: 'Lida bem com pelos de pets?', answer: 'Sim — 8.000 Pa ajuda muito, e a escova com anti-emaranhamento reduz pelo enrolado.' },
            { id: 'privacidade-wifi', icon: 'Wrench', question: 'E a privacidade / Wi‑Fi?', answer: 'Funciona em Wi‑Fi 2.4 GHz. Se sua casa usa apenas 5 GHz, habilite 2.4 GHz no roteador.' },
        ],

        interactiveTools: [
            { id: 'dimension-check', icon: 'ruler', title: 'Será que cabe?', badge: 'Teste Rápido', badgeColor: 'orange', description: 'Verifique se o robô passa debaixo dos seus móveis', toolType: 'geometry', configRef: 'robo-passa-movel' },
        ],
    };
