/**
 * Product Entry: roborock-q7-l5
 * Extracted from products.ts for modular architecture
 */
import type { Product } from '@/types/category';

export const roborock_q7_l5: Product = {
        id: 'roborock-q7-l5',
        categoryId: 'robot-vacuum',
        name: 'Roborock Q7 L5 Robô Aspirador e Esfregão com LiDAR',
        shortName: 'Roborock Q7 L5',
        brand: 'Roborock',
        model: 'Q7 L5',
        price: 2105.95,
        asin: 'B0F3337BV7',
        imageUrl: '/images/products/roborock-q7-l5.svg',
        status: 'published',
        benefitSubtitle: 'LiDAR preciso com 8000Pa de sucção e escovas anti-emaranhamento para pets',

        // === CONFIDENCE BAND FIELDS (Gold Standard - High Confidence) ===
        evidenceLevel: 'high',
        contextualScoreRange: [7.8, 8.4],
        contextualScoreConfidence: 'high',
        tcoTotalRange: [3600, 4200],
        tcoConfidence: 'medium',

        scores: {
            // PARR-BR Scoring Framework - Cadastrado 18/01/2026
            // Metodologia: Réguas de Calibração + Pesquisa Amazon BR + Web Search
            c1: 9.5,  // Navegação (25%) - LiDAR + Mapeamento 3D + Zonas de Restrição. Premium.
            c2: 9.0,  // App/Conectividade (15%) - Roborock App estável + mapa interativo + Alexa/Google
            c3: 7.0,  // Mop (15%) - Mop estático com reservatório (NÃO vibratório como S7/S8)
            c4: 9.0,  // Escovas (10%) - Dual anti-emaranhamento! Ideal para pets.
            c5: 7.5,  // Altura (10%) - 9.8cm (LiDAR padrão, não ultra-slim)
            c6: 6.0,  // Peças BR (8%) - Importadas (Roborock China). Mais difícil que WAP nacional.
            c7: 9.0,  // Bateria (5%) - 150min + Recharge & Resume ✓
            c8: 7.0,  // Ruído (5%) - Nível médio (~65dB estimado)
            c9: 5.0,  // Base (5%) - Base simples. Q7 Max+ tem autoesvaziamento, Q7 L5 NÃO.
            c10: 8.0, // IA (2%) - Boa detecção de obstáculos via sensores 3D
        },
        specs: {
            suctionPower: 8000,  // Pa
            batteryCapacity: 5200,  // mAh
            dustbinCapacity: 470,  // ml
            waterTankCapacity: 350,  // ml
            noiseLevel: 65,  // dB estimado
            width: 35,  // cm (diâmetro)
            height: 9.8,  // cm (altura LiDAR padrão)
            depth: 35,
        },

    // Structured specs for scoring module
    structuredSpecs: {
        navigationType: 'lidar',
        mopType: 'static',
        brushType: 'anti-tangle',
        dockType: 'basic',
        obstacleDetection: '3d-structured',
        heightCm: 9.8,
        noiseDb: 65,
        runtimeMinutes: 150,
        batteryMah: 5200,
    },
        attributes: {
            navigationType: 'lidar',  // LiDAR Navigation
            hasMop: true,
            mopType: 'static_tank',  // Mop estático com reservatório
            hasAutoEmpty: false,  // Q7 L5 não tem autoesvaziamento
            hasMapping: true,  // Mapeamento 3D
            hasNoGoZones: true,  // Zonas de restrição ✓
            hasRechargeResume: true,  // Recharge & Resume ✓
            hasAppControl: true,
            voiceAssistants: ['Alexa', 'Google'],
            wifiBand: '2.4GHz',
            climbHeight: 20,  // mm
            brushType: 'dual_rubber_anti_tangle',  // Escovas anti-emaranhamento
            batteryMah: 5200,
            chargingTimeHours: 4,
            runtimeMinutes: 150,
        },
        technicalSpecs: {
            // Limpeza
            suctionPower: 8000,  // Pa
            dustbinCapacity: 470,  // ml
            waterTankCapacity: 350,  // ml
            mopType: 'Estático com Reservatório',
            brushType: 'Dual Anti-Emaranhamento',
            filterType: 'HEPA E11',
            // Navegação
            navigation: 'LiDAR + Mapeamento 3D',
            mapping: true,
            lidar: true,
            camera: false,
            obstacleDetection: 'Sensores 3D Estruturados',
            climbHeight: 20,  // mm
            // Bateria
            runtime: '150 minutos',
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
            dockType: 'basic',
            autoEmpty: false,  // Q7 L5 NÃO tem
            autoMopWash: false,
            autoRefill: false,
            // Dimensões
            height: 9.8,  // cm
            diameter: 35,  // cm
            weight: 3.2,  // kg
            noiseLevel: 65,  // dB
            voltage: 120,  // V (conforme Amazon)
        },
        scoreReasons: {
            c1: 'PREMIUM: LiDAR de alta precisão com mapeamento 3D. Zonas de restrição inteligentes. Navegação eficiente sem repetições.',
            c2: 'EXCELENTE: App Roborock é referência do mercado. Mapa interativo, agendamento, controle de voz Alexa/Google.',
            c3: 'LIMITAÇÃO: Mop estático apenas arrasta pano úmido. NÃO é vibratório como Roborock S7/S8. Para manchas pesadas, insuficiente.',
            c4: 'DESTAQUE PETS: Escovas duplas de borracha anti-emaranhamento! Não enrola pelos como escovas de cerdas.',
            c5: 'ALTURA PADRÃO: 9.8cm por causa da torre LiDAR. Pode travar em alguns móveis planejados. Robôs vSLAM são mais baixos.',
            c6: 'ATENÇÃO: Marca chinesa importada. Peças disponíveis via AliExpress, não Mercado Livre. Prazo maior.',
            c7: 'EXCELENTE: 150min de autonomia + Recharge & Resume. Limpa casas grandes, recarrega e continua automaticamente.',
            c9: 'BÁSICO: Base apenas carrega. Para autoesvaziamento, considere Q7 Max+ (mais caro).',
            c10: 'BOA IA: Sensores 3D detectam obstáculos. Não é câmera como S8 Pro Ultra, mas funciona bem.',
        },
        voc: {
            totalReviews: 3512,
            averageRating: 4.2,
            oneLiner: 'LiDAR premium com sucção potente e anti-emaranhamento para pets',
            summary: 'Compradores elogiam a navegação LiDAR precisa, mapeamento multi-andares e escovas que não enrolam pelos. Principais críticas são sobre o mop básico (não vibratório) e a altura que trava em alguns móveis. Ideal para casas com pets e múltiplos cômodos.',
            pros: [
                'Navegação LiDAR extremamente precisa',
                '8000Pa de sucção para sujeira pesada',
                'Escovas anti-emaranhamento excelentes para pets',
                'Mapeamento de múltiplos andares',
                'Recharge & Resume funciona perfeitamente',
            ],
            cons: [
                'Mop estático não remove manchas pesadas',
                'Altura 9.8cm pode travar em móveis baixos',
                'Peças importadas (demora para chegar)',
                'Base simples, sem autoesvaziamento',
            ],
            sources: [
                { name: 'Amazon Brasil', url: 'https://www.amazon.com.br/dp/B0F3337BV7', count: 3512 },
            ],
        },
        painPointsSolved: ['Casa com pets (pelos)', 'Múltiplos cômodos', 'Limpeza profunda de carpetes', 'Automação avançada'],
        badges: ['premium-pick'],
        offers: [
            {
                store: 'Amazon',
                storeSlug: 'amazon',
                price: 2105.95,
                url: 'https://www.amazon.com.br/dp/B0F3337BV7',
                affiliateUrl: 'https://amzn.to/roborock-q7-l5',
                inStock: true,
                lastChecked: '2026-01-18',
            },
        ],
        lastUpdated: '2026-01-18',
        gallery: ['/images/products/roborock-q7-l5.svg'],
        featureBenefits: [
            { icon: 'Radar', title: 'LiDAR de Precisão', description: 'Mapeia sua casa em 3D e limpa de forma eficiente, sem repetir áreas.' },
            { icon: 'Dog', title: 'Anti-Emaranhamento', description: 'Escovas duplas de borracha não enrolam pelos de pets. Zero manutenção.' },
            { icon: 'Zap', title: '8000Pa de Sucção', description: 'Potência máxima para carpetes, tapetes e sujeira pesada.' },
            { icon: 'Clock', title: 'Casas Grandes', description: '150min de autonomia + volta para carregar e continua automaticamente.' },
        ],
        mainCompetitor: {
            id: 'wap-robot-w400',
            name: 'WAP Robot W400 3 em 1',
            shortName: 'WAP W400',
            imageUrl: '/images/products/wap-robot-w400.svg',
            price: 989,
            score: 5.81,
            keyDifferences: [
                { label: 'Navegação', current: 'LiDAR 3D', rival: 'Aleatória', winner: 'current' },
                { label: 'Sucção', current: '8000Pa', rival: '1400Pa', winner: 'current' },
                { label: 'Preço', current: 'R$ 2.105', rival: 'R$ 989', winner: 'rival' },
            ],
        },
    };
