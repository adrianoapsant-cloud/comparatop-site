/**
 * Product Entry: wap-robot-w400
 * Extracted from products.ts for modular architecture
 */
import type { Product } from '@/types/category';

export const wap_robot_w400: Product = {
        id: 'wap-robot-w400',
        categoryId: 'robot-vacuum',
        name: 'WAP Aspirador de Pó Robô ROBOT W400 3 em 1',
        shortName: 'WAP Robot W400',
        brand: 'WAP',
        model: 'ROBOT W400',
        price: 989,  // ATUALIZADO 18/01/2026 (era 1099)
        asin: 'B0CGBR6QFC',
        imageUrl: '/images/products/wap-robot-w400.svg',
        status: 'published',
        benefitSubtitle: 'Automação básica com Alexa/Google por menos de R$ 1.200',
        scores: {
            // PARR-BR Scoring Framework AUDITADO 18/01/2026
            // Metodologia: Réguas de Calibração + Evidências YouTube BR/Amazon BR
            c1: 2.5,  // Navegação (25%) - ALEATÓRIA CONFIRMADA (bate-e-volta). NÃO é giroscópico! W1000/W3000 sim, W400 NÃO.
            c2: 7.5,  // App/Conectividade (15%) - App WAP CONNECT funcional + Alexa/Google. Diferencial na faixa.
            c3: 7.0,  // Mop (15%) - Mop estático com reservatório. Controle de fluxo básico (não vibratório).
            c4: 5.5,  // Escovas (10%) - Escova central padrão + laterais. 1400Pa sucção (baixo vs 2000-3000Pa atuais).
            c5: 9.5,  // Altura (10%) - 7.5cm CONFIRMADO = Ultra-slim. Passa sob móveis planejados BR.
            c6: 9.0,  // Peças BR (8%) - WAP marca nacional. ML e Shopee com filtros, escovas, reservatórios disponíveis.
            c7: 4.0,  // Bateria (5%) - 100min autonomia. PENALIDADE -3.0: SEM Recharge & Resume.
            c8: 6.0,  // Ruído (5%) - Sem especificação oficial. Reviews não reclamam = nota neutra.
            c9: 5.0,  // Base (5%) - Base de carregamento simples inclusa. Sem autoesvaziamento.
            c10: 2.0, // IA (2%) - SEM detecção de objetos. Apenas bate e desvia. Zero IA.
        },
        specs: {
            suctionPower: 30,
            batteryCapacity: 2600,
            dustbinCapacity: 300,
            waterTankCapacity: 200,
            noiseLevel: 65,
            width: 32,
            height: 7.5,  // CORRIGIDO: 7.5cm confirmado (era 8)
            depth: 32,
        },

    // Structured specs for scoring module
    structuredSpecs: {
        navigationType: 'random',
        mopType: 'static',
        brushType: 'bristle',
        dockType: 'basic',
        obstacleDetection: 'bump-only',
        heightCm: 7.5,
        noiseDb: 65,
        runtimeMinutes: 100,
        batteryMah: 2600,
    },
        attributes: {
            navigationType: 'random',  // CRÍTICO: Navegação aleatória
            hasMop: true,
            mopType: 'passive_drag',   // Mop estático
            hasAutoEmpty: false,
            hasMapping: false,          // Sem mapeamento
            hasNoGoZones: false,        // Sem barreiras virtuais
            hasRechargeResume: false,   // Não volta para continuar
            hasAppControl: true,
            voiceAssistants: ['Alexa', 'Google'],
            wifiBand: '2.4GHz',
            climbHeight: 15,            // mm
            brushType: 'mixed_bristle', // Cerdas mistas = enrola
            batteryMah: 2600,
            chargingTimeHours: 4,
            runtimeMinutes: 100,  // CORRIGIDO: 100min confirmado (era 90)
        },
        technicalSpecs: {
            // Limpeza
            suctionPower: 1400,  // Pa
            dustbinCapacity: 300,  // ml
            waterTankCapacity: 200,  // ml
            mopType: 'Estático com Reservatório',
            brushType: 'Cerdas Mistas',
            filterType: 'HEPA',
            // Navegação
            navigation: 'Aleatória (Bate-e-Volta)',
            mapping: false,
            lidar: false,
            camera: false,
            obstacleDetection: 'Apenas Sensores de Colisão',
            climbHeight: 15,  // mm
            // Bateria
            runtime: '100 minutos',
            batteryCapacity: 2600,  // mAh
            chargingTime: '4 horas',
            autoRecharge: true,
            rechargeResume: false,
            // Conectividade
            wifi: true,
            appControl: true,
            voiceControl: 'Alexa, Google Assistente',
            scheduling: true,
            // Base/Dock
            dockType: 'Carregamento Simples',
            autoEmpty: false,
            autoMopWash: false,
            autoRefill: false,
            // Dimensões
            height: 7.5,  // cm
            diameter: 32,  // cm
            weight: 2.6,  // kg
            noiseLevel: 65,  // dB
            power: 30,  // W
        },
        scoreReasons: {
            c1: 'PENALIDADE: Navegação aleatória "bate-volta" é ineficiente. Limpa mesmos lugares várias vezes e esquece outros. Para casas >50m², considere LiDAR.',
            c2: 'DIFERENCIAL: Integração Alexa e Google é RARA nessa faixa de preço. Diga "Alexa, ligue o robô" sem precisar do celular.',
            c3: 'LIMITAÇÃO: Mop passivo apenas arrasta um pano úmido. Remove poeira fina, mas NÃO esfrega manchas. Para piso encardido, use mop manual.',
            c4: 'ATENÇÃO PETS: Escova de cerdas mistas enrola cabelo e pelos. Se tiver cachorro/gato, prepare-se para limpar a escova semanalmente.',
            c5: 'DESTAQUE: Com 7.5cm de altura (ultra-slim), passa facilmente sob sofás e camas baixas. Muitos robôs LiDAR têm torre que trava em móveis.',
            c6: 'GARANTIA BR: WAP é marca nacional com peças vendidas no Mercado Livre (filtros, escovas). Evita o risco de importado sem peça.',
            c9: 'SEM DOCK: Não tem base auto-esvaziante nem lavagem de mop. Você precisa esvaziar o reservatório de 300ml manualmente a cada uso.',
        },
        // ============================================
        // VOC - Voice of Customer (Dados da Amazon)
        // ============================================
        voc: {
            totalReviews: 1433,
            averageRating: 4.2,
            oneLiner: 'Custo-benefício imbatível para limpeza básica automatizada',
            summary: 'Compradores elogiam a facilidade de uso, integração com Alexa/Google e o preço acessível. Principais críticas são sobre a navegação aleatória e capacidade limitada do reservatório. Ideal para apartamentos pequenos e manutenção diária.',
            pros: [
                'Controle por voz com Alexa e Google funciona perfeitamente',
                'Preço acessível para entrada no mundo dos robôs',
                '3 em 1: aspira, varre e passa pano',
                'Retorna automaticamente à base para carregar',
                'Silencioso comparado a aspiradores tradicionais',
            ],
            cons: [
                'Navegação aleatória pode repetir áreas e esquecer outras',
                'Reservatório de 300ml enche rápido em casas com pets',
                'Mop não remove manchas pesadas, só poeira leve',
                'Wi-Fi apenas 2.4GHz pode dar problema em roteadores mesh',
            ],
            sources: [
                { name: 'Amazon Brasil', url: 'https://www.amazon.com.br/dp/B0CGBR6QFC', count: 1433 },
            ],
        },
        painPointsSolved: ['Falta de tempo para varrer diariamente', 'Acúmulo de poeira debaixo de móveis', 'Automatizar limpeza de rotina'],
        badges: ['best-value', 'budget-pick'],
        offers: [
            {
                store: 'Amazon',
                storeSlug: 'amazon',
                price: 989,
                originalPrice: 1099,  // Preço anterior
                url: 'https://www.amazon.com.br/dp/B0CGBR6QFC',
                affiliateUrl: 'https://amzn.to/wap-robot-w400',
                inStock: true,
                lastChecked: '2026-01-18'
            },
            {
                store: 'Mercado Livre',
                storeSlug: 'mercadolivre',
                price: 1149,
                url: 'https://www.mercadolivre.com.br/wap-robot-w400',
                inStock: true,
                lastChecked: '2026-01-18'
            },
        ],
        lastUpdated: '2026-01-18',
        gallery: ['/images/products/wap-robot-w400.svg', '/images/products/wap-robot-w400-dock.svg'],
        featureBenefits: [
            { icon: 'Mic', title: 'Alexa & Google', description: 'Diga "Alexa, ligue o robô". Controle por voz sem precisar do celular.' },
            { icon: 'Droplets', title: '3 em 1', description: 'Aspira, varre e passa pano em uma passada. Limpeza completa automatizada.' },
            { icon: 'Clock', title: '100 min de Autonomia', description: 'Limpa apartamentos de até 60m² em uma carga. Volta sozinho para base.' },
            { icon: 'TrendingDown', title: '-35% de Desconto', description: 'De R$ 1.699 por R$ 1.099. Mais de 300 vendas no mês passado.' },
        ],
        benchmarks: [
            { label: 'Potência de Sucção', productValue: 30, categoryAverage: 45, unit: 'W', higherIsBetter: true },
            { label: 'Autonomia', productValue: 100, categoryAverage: 120, unit: 'min', higherIsBetter: true },
            { label: 'Reservatório', productValue: 300, categoryAverage: 400, unit: 'ml', higherIsBetter: true },
            { label: 'Altura (Passa Móveis)', productValue: 7.5, categoryAverage: 9.5, unit: 'cm', higherIsBetter: false },
        ],
        priceHistory: [
            { date: '2025-10-01', price: 1699 },
            { date: '2025-11-01', price: 1499 },
            { date: '2025-12-01', price: 1299 },
            { date: '2025-12-25', price: 999 },
            { date: '2026-01-18', price: 1099 },
        ],
        mainCompetitor: {
            id: 'electrolux-robo-er',
            name: 'Electrolux Robô ER 2h20min',
            shortName: 'Electrolux ER',
            imageUrl: '/images/products/electrolux-robo-er.svg',
            price: 732,
            score: 6.8,
            keyDifferences: [
                { label: 'Controle de Voz', current: 'Alexa + Google', rival: 'Apenas controle remoto', winner: 'current' },
                { label: 'Preço', current: 'R$ 989', rival: 'R$ 732', winner: 'rival' },
                { label: 'Autonomia', current: '100 min', rival: '140 min', winner: 'rival' },
            ],
        },
    };
