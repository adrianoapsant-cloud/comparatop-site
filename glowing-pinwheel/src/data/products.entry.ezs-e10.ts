/**
 * Product Entry: ezs-e10
 * Extracted from products.ts for modular architecture
 */
import type { Product } from '@/types/category';

export const ezs_e10: Product = {
        id: 'ezs-e10',
        categoryId: 'robot-vacuum',
        name: 'Aspirador Robô EZS E10 5.500 Pa Laser iPath (AI.Map 2.0)',
        shortName: 'EZS E10',
        brand: 'EZS',
        model: 'E10',
        price: 1599.98,
        asin: 'B0DW9X5QQ9',
        imageUrl: '/images/products/ezs-e10.svg',
        status: 'published',
        benefitSubtitle: 'LiDAR iPath + AI.Map 2.0 com 5.500Pa por menos de R$ 1.600',

        // SimplifiedPDP is the default PDP for this product
        useSimplifiedPDP: true,

        // === CONFIDENCE BAND FIELDS ===
        evidenceLevel: 'medium',
        contextualScoreRange: [6.3, 7.2],
        contextualScoreConfidence: 'medium',
        tcoTotalRange: [3100, 3900],
        tcoConfidence: 'low',

        // Scores calibrados via Roborock Q7 L5 (LiDAR, ~R$2.100)
        scores: {
            c1: 9,  // Navegação & Mapeamento: LiDAR iPath + AI.Map 2.0
            c2: 8,  // Software & Conectividade: App robusto, map editing
            c3: 5,  // Eficiência de Mop: pano arrasto padrão
            c4: 6,  // Engenharia de Escovas: padrão
            c5: 5,  // Altura: 10cm (torre LiDAR)
            c6: 5,  // Manutenibilidade: marca desconhecida no BR
            c7: 8,  // Bateria: 150min autonomia
            c8: 6,  // Acústica: não especificado
            c9: 4,  // Base: sem auto-esvaziamento
            c10: 6, // Recursos: LiDAR
        },

        specs: {
            suctionPower: 5500,
            batteryCapacity: 5200,
            dustbinCapacity: 500,
            waterTankCapacity: 380,
            noiseLevel: 65,
            width: 35,
            height: 10,
            depth: 35,
        },

    // Structured specs for scoring module
    structuredSpecs: {
        navigationType: 'lidar',
        mopType: 'static',
        brushType: 'bristle',
        dockType: 'basic',
        obstacleDetection: 'infrared',
        heightCm: 10,
        noiseDb: 65,
        runtimeMinutes: 150,
        batteryMah: 5200,
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
            climbHeight: 20,
            brushType: 'standard_bristle',
            batteryMah: 5200,
            chargingTimeHours: 4,
            runtimeMinutes: 150,
        },

        technicalSpecs: {
            suctionPower: 5500,
            dustbinCapacity: 500,
            waterTankCapacity: 380,
            mopType: 'Pano arrasto',
            brushType: 'Escova Principal + Laterais',
            filterType: 'HEPA',
            navigation: 'LiDAR iPath + AI.Map 2.0',
            mapping: true,
            lidar: true,
            camera: false,
            obstacleDetection: 'infrared',
            climbHeight: 20,
            runtime: '150 minutos',
            batteryCapacity: 5200,
            chargingTime: '4 horas',
            autoRecharge: true,
            rechargeResume: true,
            wifi: true,
            appControl: true,
            voiceControl: 'Alexa, Google Assistente',
            scheduling: true,
            multiFloorMapping: true,
            dockType: 'basic',
            autoEmpty: false,
            autoMopWash: false,
            autoRefill: false,
            height: 10,
            diameter: 35,
            weight: 3.5,
            noiseLevel: 65,
            voltage: 127,
        },

        scoreReasons: {
            c1: 'PREMIUM: LiDAR iPath com AI.Map 2.0. Mapeamento multi-andares e zonas de restrição.',
            c2: 'BOM: App com edição de mapa, zonas, agendamento. Alexa e Google funcionam.',
            c3: 'BÁSICO: Mop estático apenas arrasta pano úmido. NÃO é vibratório.',
            c4: 'PADRÃO: Não menciona escovas de silicone anti-emaranhamento.',
            c5: 'ALTURA PADRÃO: 10cm por causa da torre LiDAR.',
            c6: 'CAUTELA: Marca desconhecida no Brasil. Peças incertas.',
            c7: 'EXCELENTE: 150min de autonomia + Recharge & Resume.',
            c9: 'BÁSICO: Base apenas carrega. Sem autoesvaziamento.',
            c10: 'BOM: LiDAR é o diferencial.',
        },

        voc: {
            totalReviews: 50,
            averageRating: 4.1, // 82% / 20 = 4.1 stars
            consensusScore: 82, // Original approval percentage
            oneLiner: 'LiDAR premium com 5.500Pa por preço agressivo',
            summary: 'Usuários elogiam a eficiência na remoção de cabelos e pelos de pets em uma única passada. O LiDAR cria mapas precisos evitando que o robô se perca ou bata em móveis.',
            pros: [
                'Navegação LiDAR com AI.Map 2.0',
                '5.500Pa de sucção',
                'Preço agressivo',
                '150min de autonomia',
                'Alexa e Google',
            ],
            cons: [
                'Marca desconhecida no Brasil',
                'Mop passivo',
                'Sem autoesvaziamento',
                'Peças incertas',
            ],
            sources: [],
        },

        painPointsSolved: ['Navegação inteligente', 'Casas grandes', 'Mapeamento preciso', 'Custo-benefício LiDAR'],
        badges: ['best-value'],

        offers: [
            {
                store: 'Amazon',
                storeSlug: 'amazon',
                price: 1599.98,
                url: 'https://www.amazon.com.br/dp/B0DW9X5QQ9',
                affiliateUrl: 'https://www.amazon.com.br/dp/B0DW9X5QQ9',
                inStock: true,
                lastChecked: '2026-01-29',
            },
        ],

        lastUpdated: '2026-01-29',

        // Real TCO data from engineering analysis
        tcoData: {
            purchasePrice: 1600,
            energyCost5y: 270,          // R$ 270 in 5 years (30W × ~0.63kWh/month × R$0.85)
            maintenanceCost5y: 1600,    // R$ 1.600 in 5 years (marca desconhecida, peças escassas)
            totalCost5y: 3470,
            monthlyReserve: 31,         // Reserve R$ 31/month for maintenance
            lifespanYears: 3,           // Component-limited lifespan
        },

        gallery: ['/images/products/ezs-e10.svg'],

        featureBenefits: [
            { icon: 'Radar', title: 'LiDAR iPath', description: 'Navegação laser precisa com mapeamento 3D multi-andares.' },
            { icon: 'Zap', title: '5.500Pa Sucção', description: 'Potência máxima para carpetes e sujeira pesada.' },
            { icon: 'Clock', title: '150min Autonomia', description: 'Limpa casas grandes. Recarrega e continua.' },
            { icon: 'Tag', title: 'Preço Agressivo', description: 'Specs de R$2.000+ por menos de R$1.600.' },
        ],

        mainCompetitor: {
            id: 'roborock-q7-l5',
            name: 'Roborock Q7 L5 LiDAR',
            shortName: 'Roborock Q7 L5',
            imageUrl: '/images/products/roborock-q7-l5.svg',
            price: 2106,
            score: 8.11,
            keyDifferences: [
                { label: 'Sucção', current: '5.500Pa', rival: '8.000Pa', winner: 'rival' },
                { label: 'Preço', current: 'R$ 1.600', rival: 'R$ 2.106', winner: 'current' },
                { label: 'Marca BR', current: 'Desconhecida', rival: 'Roborock', winner: 'rival' },
            ],
        },

        recommendedAccessory: {
            asin: 'B0DW9X5QQ9-KIT',
            name: 'Kit de Reposição 22 Peças Compatível EZS E10 / Xiaomi E10 (Escovas + Filtros HEPA + Panos MOP)',
            shortName: 'Kit Reposição E10',
            price: 79.90,
            imageUrl: '/images/products/kit-reposicao-ezs-e10.svg',
            reason: '4 escovas laterais + 1 escova central + filtros HEPA + panos MOP. Compatível com Xiaomi E10/B112. Troque a cada 3-6 meses para manter sucção.',
            affiliateUrl: 'https://www.mercadolivre.com.br/s?q=kit+acessorios+robo+aspirador+e10',
        },

        // ============================================
        // EXTENDED PDP DATA (migrated from mock JSON)
        // ============================================

        productDimensions: {
            diameter: 35,
            height: 10,
        },

        header: {
            overallScore: 6.72,
            scoreLabel: 'Bom',
            title: 'EZS E10',
            subtitle: 'LiDAR iPath com 5.500Pa de sucção por preço agressivo',
            badges: [
                { type: 'feature', label: 'LiDAR iPath', icon: 'radar' },
                { type: 'feature', label: '5.500Pa Sucção', icon: 'zap' },
                { type: 'feature', label: 'AI.Map 2.0', icon: 'brain' },
            ],
        },

        extendedVoc: {
            consensusScore: 82,
            totalReviews: '50+',
            acceptableFlaw: 'Marca desconhecida no Brasil — disponibilidade de peças de reposição incerta. Um usuário no Pelando expressou preocupação com pouca informação sobre a marca na internet',
            realWorldScenario: 'Usuários elogiam a eficiência na remoção de cabelos e pelos de pets em uma única passada. O LiDAR cria mapas precisos evitando que o robô se perca ou bata em móveis. Preço promocional de ~R$999 no ML torna atrativo vs concorrentes',
            goldenTip: 'Use o Boost-EZS para tapetes — ele ajusta sucção automaticamente. Configure zonas proibidas no app para proteger fios e áreas sensíveis',
        },

        auditVerdict: {
            solution: {
                title: 'A Solução',
                icon: 'checkCircle',
                color: 'emerald',
                items: [
                    'Navegação LiDAR iPath com AI.Map 2.0 de alta precisão',
                    '5.500Pa de sucção — potência competitiva para tapetes',
                    '150min de autonomia + Recharge & Resume',
                    'Zonas de restrição inteligentes via app',
                    'Preço agressivo: specs de R$2.000+ por R$1.600',
                ],
            },
            attentionPoint: {
                title: 'Ponto de Atenção',
                icon: 'alertTriangle',
                color: 'amber',
                items: [
                    'Marca DESCONHECIDA no Brasil: suporte pós-venda incerto',
                    'Mop ESTÁTICO: apenas arrasta pano úmido',
                    'Altura de 10cm: pode travar em móveis baixos',
                    'Sem autoesvaziamento: base simples',
                ],
            },
            technicalConclusion: {
                title: 'Conclusão Técnica',
                icon: 'clipboard',
                color: 'blue',
                text: 'O EZS E10 entrega especificações competitivas com robôs de R$2.000+ por preço agressivo. A navegação LiDAR e mapeamento AI são diferenciais reais. O risco está no pós-venda: marca desconhecida significa incerteza em peças e assistência. Vale para quem aceita esse trade-off por economia.',
            },
            dontBuyIf: {
                title: 'Não Compre Se',
                icon: 'xCircle',
                color: 'red',
                items: [
                    'Valoriza suporte pós-venda e peças fáceis',
                    'Quer marca estabelecida (Roborock, Xiaomi, iRobot)',
                    'Precisa de mop que esfregue manchas',
                    'Seus móveis têm vão menor que 10cm',
                ],
            },
        },

        productDna: {
            title: 'DNA do Produto',
            subtitle: '10 Dimensões PARR-BR para Robôs Aspiradores',
            dimensions: [
                { id: 'c1', name: 'Navegação & Mapeamento', shortName: 'Navegação', score: 9, weight: 0.25, icon: 'radar', color: 'cyan', description: 'PREMIUM: LiDAR iPath com AI.Map 2.0. Mapeamento multi-andares e zonas de restrição.' },
                { id: 'c2', name: 'Software & Conectividade', shortName: 'App/Voz', score: 8, weight: 0.15, icon: 'smartphone', color: 'purple', description: 'BOM: App com edição de mapa, zonas, agendamento. Alexa e Google funcionam.' },
                { id: 'c3', name: 'Sistema de Mop', shortName: 'Mop', score: 5, weight: 0.15, icon: 'droplet', color: 'blue', description: 'BÁSICO: Mop estático apenas arrasta pano úmido. NÃO é vibratório.' },
                { id: 'c4', name: 'Engenharia de Escovas', shortName: 'Escovas', score: 6, weight: 0.10, icon: 'sparkles', color: 'emerald', description: 'PADRÃO: Não menciona escovas de silicone anti-emaranhamento.' },
                { id: 'c5', name: 'Altura e Acessibilidade', shortName: 'Altura', score: 5, weight: 0.10, icon: 'ruler', color: 'orange', description: 'ALTURA PADRÃO: 10cm por causa da torre LiDAR.' },
                { id: 'c6', name: 'Manutenibilidade', shortName: 'Peças', score: 5, weight: 0.08, icon: 'wrench', color: 'slate', description: 'CAUTELA: Marca desconhecida no Brasil. Peças incertas.' },
                { id: 'c7', name: 'Bateria e Autonomia', shortName: 'Bateria', score: 8, weight: 0.05, icon: 'battery', color: 'green', description: 'EXCELENTE: 150min de autonomia + Recharge & Resume.' },
                { id: 'c8', name: 'Acústica', shortName: 'Ruído', score: 6, weight: 0.05, icon: 'volume2', color: 'amber', description: 'NÃO ESPECIFICADO: Valor padrão estimado ~65dB.' },
                { id: 'c9', name: 'Base de Carregamento', shortName: 'Base', score: 4, weight: 0.05, icon: 'home', color: 'red', description: 'BÁSICO: Base apenas carrega. Sem autoesvaziamento.' },
                { id: 'c10', name: 'Recursos de IA', shortName: 'IA', score: 6, weight: 0.02, icon: 'brain', color: 'pink', description: 'BOM: LiDAR é o diferencial. Não menciona câmera ou IA frontal.' },
            ],
        },

        simulators: {
            sizeAlert: {
                status: 'warning',
                message: 'Com 10cm de altura (torre LiDAR), o EZS E10 precisa de vãos de pelo menos 10.5cm para passar sob móveis. Meça seus sofás e camas antes de comprar.',
                idealRange: { min: 6, max: 9 },
            },
            soundAlert: {
                status: 'acceptable',
                message: 'O mop do EZS E10 é estático: apenas arrasta um pano úmido. Para manchas secas, você ainda precisará de mop manual. Ideal para manutenção diária.',
                suggestions: [
                    { condition: 'Para manchas pesadas', product: 'Roborock S7/S8 com Sonic Mop', reason: 'Vibração de 3000rpm remove sujeira incrustada' },
                    { condition: 'Para pisos de madeira', product: "Usar modo 'baixo fluxo' no app", reason: 'Evita excesso de água que danifica madeira' },
                ],
            },
            energyAlert: {
                rating: 'A',
                message: 'Consumo de ~30W durante operação. Custo mensal estimado de R$ 2-3 na conta de luz com uso diário.',
            },
        },

        extendedTco: {
            purchasePrice: 1600,
            energyCost5y: 270,
            maintenanceCost5y: 1600,
            totalCost5y: 3470,
            monthlyReserve: 31,
            lifespan: {
                years: 3,
                categoryAverage: 7,
                limitingComponent: 'Bateria Li-ion Premium (5200mAh)',
                limitingComponentLife: 3.5,
                weibullExplanation: 'Baseado em uso médio de 4h/dia (1.460h/ano), a bateria Li-ion de 5200mAh tem vida útil estimada de 3.5 anos segundo a distribuição Weibull (η=3.5, 90% dos aparelhos chegam a essa marca). O componente limitante define a vida útil total do produto.',
            },
            repairability: {
                score: 4.8,
                level: 'moderate',
                categoryAverage: 6.5,
                components: [
                    { name: 'Placa Principal Smart (com LiDAR)', score: 2, price: 450, availability: 'scarce', failureSymptoms: ['Robô não liga / não dá sinal', 'Reinicia sozinho / trava', 'Não conecta Wi-Fi / some do app'], repairAdvice: 'Custo alto frequentemente inviabiliza reparo. Marca desconhecida agrava disponibilidade.' },
                    { name: 'Sensor LiDAR (Torre LDS)', score: 4, price: 500, availability: 'scarce', failureSymptoms: ['Anda em círculos', 'Mapa não fecha / erro de mapa', 'Erro LDS / torre não gira', 'Perde localização constantemente'], repairAdvice: 'Peça crítica. Disponibilidade incerta para marca desconhecida.' },
                    { name: 'Motor de Sucção Brushless Premium (Nidec)', score: 4, price: 350, availability: 'limited', failureSymptoms: ['Perda de sucção mesmo com filtro limpo', 'Barulho anormal', 'Superaquece e desliga'], repairAdvice: 'Reparo possível se encontrar peça compatível.' },
                    { name: 'Bateria Li-ion Premium (5200mAh)', score: 6, price: 550, availability: 'limited', failureSymptoms: ['Autonomia reduziu muito', 'Não completa a limpeza', 'Desliga quando aumenta sucção'], repairAdvice: 'Componente limitante. Buscar bateria compatível em marketplaces.' },
                    { name: 'Módulo de Roda (Motor + Engrenagem)', score: 7, price: 180, availability: 'limited', failureSymptoms: ['Anda torto', 'Patina / não sobe desnível', 'Fica travado'], repairAdvice: 'Peça relativamente genérica. Buscar compatível.' },
                    { name: 'Kit Escovas (Central + Laterais + Filtro)', score: 10, price: 90, availability: 'available', failureSymptoms: ['Perda de desempenho', 'Cabelo enrolado travando escova'], repairAdvice: 'Consumível. Kits genéricos funcionam bem.' },
                ],
            },
        },

        decisionFAQ: [
            { id: 'brand_risk', icon: 'AlertTriangle', question: 'Nunca ouvi falar da marca EZS. É confiável?', answer: 'Sendo honesto: não há histórico no Brasil. A EZS aparenta ser uma marca chinesa OEM sem representação oficial. As specs são reais (LiDAR, 5500Pa), mas o risco está no pós-venda. Se a bateria ou LiDAR falharem, você dependerá de peças genéricas. Recomendamos apenas para quem aceita esse trade-off pela economia de ~R$500 vs Roborock.' },
            { id: 'comparison', icon: 'Scale', question: 'EZS E10 vs Roborock Q7 L5: Qual eu devo escolher?', answer: 'Resumo prático: O E10 oferece specs similares (LiDAR, mapeamento, 150min) por R$500 menos. A diferença está na marca: Roborock tem ecossistema Xiaomi, peças disponíveis e reputação. EZS é aposta. Se seu orçamento é apertado e você aceita o risco, E10 é opção. Se valoriza segurança pós-compra, pague mais pelo Q7 L5.' },
            { id: 'maintenance', icon: 'Wrench', question: 'E se precisar de peças de reposição?', answer: 'Este é o maior risco. Não há assistência técnica oficial EZS no Brasil. Você dependerá de: (1) Peças genéricas em AliExpress/Shopee com prazo de 30-60 dias; (2) Técnicos independentes que aceitem trabalhar com a marca. Bateria e escovas são mais fáceis de encontrar. LiDAR e placa são problemáticos.' },
        ],

        interactiveTools: [
            { id: 'dimension-check', icon: 'ruler', title: 'Será que cabe?', badge: 'Teste Rápido', badgeColor: 'orange', description: 'Verifique se o robô passa debaixo dos seus móveis', toolType: 'geometry', configRef: 'robo-passa-movel' },
            { id: 'cleaning-area-calc', icon: 'maximize', title: 'Cobertura de Limpeza', badge: 'Simulador', badgeColor: 'blue', description: 'Calcule quantos cômodos o robô consegue limpar por carga', toolType: 'calculator', configRef: 'robo-cobertura-limpeza' },
        ],
    };
