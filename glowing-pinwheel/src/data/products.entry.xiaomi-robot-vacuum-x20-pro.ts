/**
 * Product Entry: xiaomi-robot-vacuum-x20-pro
 * Extracted from products.ts for modular architecture
 */
import type { Product } from '@/types/category';

export const xiaomi_robot_vacuum_x20_pro: Product = {
        id: 'xiaomi-robot-vacuum-x20-pro',
        categoryId: 'robot-vacuum',
        name: 'XIAOMI Robot Vacuum X20 Pro — robô aspirador e limpa-chão com navegação a laser (LDS), sucção 7000 Pa, base all-in-one, branco (versão ES)',
        shortName: 'Xiaomi X20 Pro',
        brand: 'XIAOMI',
        model: 'Xiaomi Robot Vacuum X20 Pro (BHR8859EU)',
        price: 4110.00,
        asin: 'B0DFJGKW2L',
        imageUrl: '/images/products/xiaomi-robot-vacuum-x20-pro.svg',
        status: 'published',
        benefitSubtitle: '7000 Pa + base all‑in‑one: esvazia o pó, lava e seca os mops automaticamente',
        useSimplifiedPDP: true,

        evidenceLevel: 'high',
        contextualScoreRange: [7.9, 8.5],
        contextualScoreConfidence: 'high',
        tcoTotalRange: [5100, 6500],
        tcoConfidence: 'medium',

        scores: {
            c1: 8.8, c2: 8.2, c3: 8.3, c4: 7.8, c5: 8.0,
            c6: 7.2, c7: 8.0, c8: 7.5, c9: 9.0, c10: 7.5,
        },

        scoreReasons: {
            c1: 'Navegação LDS (LiDAR) com sistema de desvio de obstáculos por luz estruturada, bom mapeamento e rotas em zigue‑zague.',
            c2: 'Controle por app (Xiaomi Home/Mi Home), modos e agendamentos; suporte a Google/Alexa para automações básicas.',
            c3: 'Sistema de esfregação com 2 mops rotativos, elevação automática em tapetes e base que lava e seca com ar quente.',
            c4: 'Conjunto padrão de escova principal + lateral; bom no geral, porém não é o foco "anti‑embaraço" mais agressivo da categoria.',
            c5: 'Altura ~97 mm: costuma passar sob muitos móveis, mas pode ficar no limite em sofás/armários muito baixos.',
            c6: 'Consumíveis fáceis (mops, filtros, sacos); peças eletrônicas costumam ter disponibilidade limitada e preço mais alto.',
            c7: 'Bateria 5200 mAh (nominal) com até ~160 min em modo padrão — adequada para casas médias/grandes.',
            c8: 'Ruído informado em torno de ~60 dB (varia por modo); aceitável para uso diurno.',
            c9: 'Base "omni" completa (auto‑esvaziamento, lavagem dos mops, secagem em ~3h, reabastecimento) com tanques grandes.',
            c10: 'Detecção de obstáculos por luz estruturada e sensores; bom para o dia a dia, mas sem câmera/IA avançada top-tier.',
        },

        specs: {
            suctionPower: 7000,
            batteryCapacity: 5200,
            dustbinCapacity: 290,
            waterTankCapacity: 200,
            noiseLevel: 60,
            width: 35,
            height: 9.7,
            depth: 35,
        },

    // Structured specs for scoring module
    structuredSpecs: {
        navigationType: 'lidar',
        mopType: 'rotating',
        brushType: 'bristle',
        dockType: 'all-in-one',
        obstacleDetection: '3d-structured',
        heightCm: 9.7,
        noiseDb: 60,
        runtimeMinutes: 160,
        batteryMah: 5200,
    },

        attributes: {
            navigationType: 'lidar',
            hasMop: true,
            mopType: 'mop-rotativo-duplo',
            hasAutoEmpty: true,
            hasMapping: true,
            hasNoGoZones: true,
            hasRechargeResume: true,
            hasAppControl: true,
            voiceAssistants: ['alexa', 'google'],
            wifiBand: '2.4ghz',
            climbHeight: 2.0,
            brushType: 'standard_bristle',
            batteryMah: 5200,
            chargingTimeHours: 4.5,
            runtimeMinutes: 160,
        },

        technicalSpecs: {
            suctionPower: 7000,
            dustbinCapacity: 290,
            waterTankCapacity: 200,
            mopType: '2 mops rotativos (auto‑lifting)',
            brushType: 'Escova principal + escova lateral',
            filterType: 'HEPA',
            navigation: 'LDS (LiDAR) + luz estruturada (desvio de obstáculos)',
            mapping: true,
            lidar: true,
            camera: false,
            obstacleDetection: 'Luz estruturada (wide‑area structured light)',
            climbHeight: 2.0,
            runtime: 'Até 160 min (modo padrão)',
            batteryCapacity: 5200,
            chargingTime: '≈ 4–5 h',
            autoRecharge: true,
            rechargeResume: true,
            wifi: true,
            appControl: true,
            voiceControl: 'Google Assistant e Amazon Alexa',
            scheduling: true,
            multiFloorMapping: true,
            dockType: 'Omni Station (all‑in‑one)',
            autoEmpty: true,
            autoMopWash: true,
            autoRefill: true,
            height: 9.7,
            diameter: 35.0,
            weight: 3.7,
            noiseLevel: 60,
            voltage: 230,
        },

        voc: {
            totalReviews: 440,
            averageRating: 4.3,
            consensusScore: 8.4,
            oneLiner: 'Entrega uma experiência "quase mãos‑livres" com base completa e boa navegação — o ponto fraco costuma ser o custo e o tamanho da estação.',
            summary: 'A percepção geral é de limpeza forte (7000 Pa) e praticidade alta por causa da base all‑in‑one (auto‑esvaziamento, lavagem e secagem dos mops). O mapa e a rota tendem a ser consistentes graças ao LDS + desvio por luz estruturada. As principais queixas costumam orbitar preço, espaço ocupado pela estação e ajustes finos no app/firmware dependendo do ambiente.',
            pros: [
                'Sucção muito forte e rotas consistentes com LDS',
                'Base completa: auto‑esvaziamento, lavagem e secagem dos mops (menos manutenção diária)',
                'Tanques grandes (4L água limpa / 3.8L suja) + saco de pó 2.5L',
            ],
            cons: [
                'Estação ocupa espaço e exige área dedicada',
                'Custo inicial alto para a categoria',
            ],
            sources: [{ name: 'Amazon', url: 'https://www.amazon.com.br/dp/B0DFJGKW2L', count: 440 }],
        },

        painPointsSolved: [
            'Limpeza diária sem intervenção (auto‑esvaziamento + auto‑lavagem/auto‑secagem dos mops)',
            'Boa cobertura em cantos e bordas com navegação LDS',
            'Rotina para casas grandes com autonomia alta e tanques grandes',
        ],

        badges: ['best-value'],

        offers: [{
            store: 'Amazon',
            storeSlug: 'amazon',
            price: 4110.00,
            url: 'https://www.amazon.com.br/dp/B0DFJGKW2L',
            affiliateUrl: 'https://www.amazon.com.br/dp/B0DFJGKW2L',
            inStock: true,
            lastChecked: '2026-01-29',
        }],

        lastUpdated: '2026-01-29',

        tcoData: {
            purchasePrice: 4110.00,
            energyCost5y: 150.00,
            maintenanceCost5y: 1100.00,
            totalCost5y: 5360.00,
            monthlyReserve: 90.00,
            lifespanYears: 5,
        },

        gallery: ['/images/products/xiaomi-robot-vacuum-x20-pro.svg'],

        featureBenefits: [
            { icon: 'Radar', title: 'Navegação LDS precisa', description: 'Mapeamento e rotas em zigue‑zague para cobrir o ambiente com consistência e menos repetição.' },
            { icon: 'Zap', title: 'Sucção 7000 Pa', description: 'Quatro níveis de sucção para adaptar potência e ruído ao tipo de piso e sujeira.' },
            { icon: 'Clock', title: 'Até 160 min por ciclo', description: 'Bateria 5200 mAh (nominal) para limpar áreas maiores antes de recarregar.' },
            { icon: 'Tag', title: 'Base all‑in‑one', description: 'Auto‑esvaziamento (saco 2.5L), lavagem dos mops e secagem com ar quente (~3h), com tanques grandes.' },
        ],

        mainCompetitor: {
            id: 'eufy-x10-pro-omni',
            name: 'eufy X10 Pro Omni',
            shortName: 'eufy X10 Pro',
            imageUrl: '/images/products/competidor.svg',
            price: 4679.10,
            score: 8.1,
            keyDifferences: [
                { label: 'Base all‑in‑one', current: 'Tanques grandes e secagem por ar quente', rival: 'Base omni completa (varia por configuração)', winner: 'current' },
                { label: 'Ecossistema/App', current: 'Xiaomi Home/Mi Home + Google/Alexa', rival: 'App eufy Clean + integrações', winner: 'rival' },
                { label: 'Preço', current: 'R$ 4.110', rival: 'R$ 4.679', winner: 'current' },
            ],
        },

        recommendedAccessory: {
            asin: 'B0F7GW4RSH',
            name: 'Kit 2 Refil Saco Coletor Compatível (linha Xiaomi X20 / X20 Pro)',
            shortName: 'Refil saco coletor (2 un.)',
            price: 65.99,
            imageUrl: '/images/products/acessorio.svg',
            reason: 'Mantém a base operando por semanas sem perda de eficiência no auto‑esvaziamento.',
            affiliateUrl: 'https://www.amazon.com.br/dp/B0F7GW4RSH',
        },

        productDimensions: { diameter: 35.0, height: 9.7 },

        header: {
            overallScore: 8.2,
            scoreLabel: 'Muito Bom',
            title: 'Xiaomi X20 Pro: forte, inteligente e com base completa',
            subtitle: 'Um "all‑in‑one" equilibrado: navegação LDS + 7000 Pa + mops rotativos com lavagem/ secagem na base.',
            badges: [
                { type: 'feature', label: 'LDS + desvio de obstáculos', icon: 'radar' },
                { type: 'feature', label: 'Base all‑in‑one', icon: 'zap' },
            ],
        },

        extendedVoc: {
            consensusScore: 84,
            totalReviews: '440',
            acceptableFlaw: 'A estação ocupa espaço e o conjunto é mais caro, mas entrega autonomia real no dia a dia.',
            realWorldScenario: 'Para quem quer rodar limpeza diária sem ficar lavando pano e esvaziando reservatório toda hora.',
            goldenTip: 'Se você tem tapetes, use o modo com detecção/elevação do mop e ajuste as zonas "no‑go" perto de fios.',
        },

        auditVerdict: {
            solution: {
                title: 'A Solução',
                icon: 'checkCircle',
                color: 'emerald',
                items: [
                    'Sucção 7000 Pa para sujeira fina e partículas em tapetes',
                    'Navegação LDS com rotas consistentes e bom mapeamento',
                    'Mops rotativos com elevação automática em tapetes',
                    'Base completa: auto‑esvazia, lava e seca os mops',
                    'Tanques grandes: menos reabastecimento/limpeza da base',
                ],
            },
            attentionPoint: {
                title: 'Ponto de Atenção',
                icon: 'alertTriangle',
                color: 'amber',
                items: [
                    'Estação precisa de espaço dedicado (dimensões grandes)',
                    'Custo inicial acima da média',
                    'Peças eletrônicas podem ter disponibilidade limitada',
                    'Ruído/potência variam bastante por modo (ajuste conforme horário)',
                ],
            },
            technicalConclusion: {
                title: 'Conclusão Técnica',
                icon: 'clipboard',
                color: 'blue',
                text: 'O X20 Pro é um robô "muito bom" quando a prioridade é autonomia real (base all‑in‑one) sem abrir mão de navegação precisa (LDS) e desempenho (7000 Pa). Se você aceita o tamanho da estação e o preço, ele tende a entregar a experiência mais próxima de "mãos‑livres" dentro do custo-benefício do segmento intermediário‑premium.',
            },
            dontBuyIf: {
                title: 'Não Compre Se',
                icon: 'xCircle',
                color: 'red',
                items: [
                    'Você não tem espaço para a estação (ou quer algo discreto)',
                    'Seu foco é o menor preço possível',
                    'Sua casa tem muitos degraus/soleiras altas (acima de ~2 cm)',
                    'Você quer IA com câmera e reconhecimento avançado de objetos',
                ],
            },
        },

        productDna: {
            title: 'DNA do Produto',
            subtitle: '10 Dimensões de Avaliação',
            dimensions: [
                { id: 'c1', name: 'Navegação', shortName: 'Nav', score: 8.8, weight: 0.25, icon: 'radar', color: 'cyan', description: 'LDS (LiDAR) + desvio por luz estruturada.' },
                { id: 'c2', name: 'Software', shortName: 'App', score: 8.2, weight: 0.15, icon: 'smartphone', color: 'purple', description: 'Xiaomi Home/Mi Home, mapas e agendamentos.' },
                { id: 'c3', name: 'Sistema de Mop', shortName: 'Mop', score: 8.3, weight: 0.15, icon: 'droplet', color: 'blue', description: '2 mops rotativos, elevação em tapetes, base lava e seca.' },
                { id: 'c4', name: 'Escovas', shortName: 'Esc', score: 7.8, weight: 0.10, icon: 'sparkles', color: 'emerald', description: 'Escova principal + lateral (boa, mas não "anti‑tangle" extrema).' },
                { id: 'c5', name: 'Altura', shortName: 'Alt', score: 8.0, weight: 0.10, icon: 'ruler', color: 'orange', description: '≈ 9,7 cm — passa sob muitos móveis.' },
                { id: 'c6', name: 'Manutenção', shortName: 'Man', score: 7.2, weight: 0.08, icon: 'wrench', color: 'slate', description: 'Consumíveis fáceis; módulos eletrônicos mais caros/difíceis.' },
                { id: 'c7', name: 'Bateria', shortName: 'Bat', score: 8.0, weight: 0.05, icon: 'battery', color: 'green', description: '5200 mAh (nominal), até ~160 min.' },
                { id: 'c8', name: 'Ruído', shortName: 'dB', score: 7.5, weight: 0.05, icon: 'volume2', color: 'amber', description: '≈ 60 dB (varia por potência).' },
                { id: 'c9', name: 'Base', shortName: 'Base', score: 9.0, weight: 0.05, icon: 'home', color: 'red', description: 'Omni Station: esvazia pó + lava e seca mops + tanques grandes.' },
                { id: 'c10', name: 'IA', shortName: 'IA', score: 7.5, weight: 0.02, icon: 'brain', color: 'pink', description: 'Desvio por sensores/luz estruturada (sem câmera).' },
            ],
        },

        simulators: {
            sizeAlert: {
                status: 'warning',
                message: 'Verifique se há pelo menos ~10 cm de vão livre nos móveis onde você quer que ele entre.',
                idealRange: { min: 10, max: 14 },
            },
            soundAlert: {
                status: 'acceptable',
                message: 'Em modo padrão tende a ser confortável; no turbo pode incomodar em home office/salas pequenas.',
                suggestions: [{ condition: 'Horário de trabalho', product: 'Potência média', reason: 'Menos ruído' }, { condition: 'Pisos frios', product: 'Potência média', reason: 'Eficiência' }],
            },
            energyAlert: {
                rating: 'A',
                message: 'Consumo tende a ser baixo para a função: o custo maior está nos consumíveis (mops/filtros/sacos).',
            },
        },

        extendedTco: {
            purchasePrice: 4110.00,
            energyCost5y: 150.00,
            maintenanceCost5y: 1100.00,
            totalCost5y: 5360.00,
            monthlyReserve: 90.00,
            lifespan: {
                years: 5,
                limitingComponent: 'Bateria Li‑ion 5200 mAh',
                limitingComponentLife: 3.5,
                weibullExplanation: 'O desgaste típico acelera após ~3–4 anos por perda de capacidade da bateria e fadiga de motores/vedações; consumíveis trocados regularmente mitigam queda de performance.',
            },
            repairability: {
                score: 6.8,
                level: 'moderate',
                components: [
                    { name: 'Placa Principal', score: 5, price: 850.00, availability: 'scarce', failureSymptoms: ['Falhas aleatórias', 'Não liga', 'Desconexões no app'], repairAdvice: 'Priorize garantia/assistência; troca costuma ser o caminho mais rápido.' },
                    { name: 'Sensor Principal (LDS/obstáculos)', score: 6, price: 420.00, availability: 'scarce', failureSymptoms: ['Mapa "torto"', 'Gira em círculos', 'Erros de navegação'], repairAdvice: 'Limpeza preventiva do topo/sensores; se persistir, substituição do módulo.' },
                    { name: 'Motor de Sucção', score: 6, price: 380.00, availability: 'limited', failureSymptoms: ['Perda de sucção', 'Ruído alto', 'Cheiro de queimado'], repairAdvice: 'Trocar filtro/limpar dutos; se não resolver, substituição do motor.' },
                    { name: 'Bateria', score: 7, price: 360.00, availability: 'limited', failureSymptoms: ['Autonomia caiu muito', 'Não completa a rotina', 'Desliga cedo'], repairAdvice: 'Substituição da bateria tende a recuperar o desempenho e estender a vida útil.' },
                    { name: 'Módulo de Roda', score: 7, price: 260.00, availability: 'limited', failureSymptoms: ['Patina', 'Erro de locomoção', 'Barulho em um lado'], repairAdvice: 'Verifique fios/cabelos presos; se persistir, troque o módulo do lado afetado.' },
                    { name: 'Kit Consumíveis (mops/filtros/sacos)', score: 10, price: 220.00, availability: 'available', failureSymptoms: ['Perda de desempenho', 'Cheiro', 'Pano não limpa bem'], repairAdvice: 'Troca periódica mantém performance; lave mops e troque filtros conforme uso.' },
                ],
            },
        },

        decisionFAQ: [
            { id: 'p1', icon: 'AlertTriangle', question: 'Ele dá conta de casa grande sem ficar parando?', answer: 'Em modo padrão, a autonomia anunciada chega a ~160 min e a base ajuda a manter o robô operando com menos intervenção (pó/água/panos).' },
            { id: 'p2', icon: 'Scale', question: 'Vale pagar mais por uma base all‑in‑one?', answer: 'Se você quer reduzir manutenção diária (lavar pano e esvaziar reservatório), a base completa é justamente o diferencial que muda a experiência.' },
            { id: 'p3', icon: 'Wrench', question: 'Como fica a manutenção e peças?', answer: 'Consumíveis são simples de achar (mops, filtros, sacos). Componentes eletrônicos tendem a ser mais caros e com disponibilidade limitada, então a garantia pesa.' },
        ],

        interactiveTools: [
            { id: 'dimension-check', icon: 'ruler', title: 'Será que cabe?', badge: 'Teste Rápido', badgeColor: 'orange', description: 'Verifique se o robô passa debaixo dos seus móveis (mín. ~10 cm recomendado).', toolType: 'geometry', configRef: 'robo-passa-movel' },
        ],
    };
