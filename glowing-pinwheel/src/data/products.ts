/**
 * Sample Product Data - For Development/Testing
 * 
 * @description Example products with scores matching category criteria IDs.
 * In production, this would come from a CMS or database.
 */

import type { Product, MainCompetitor } from '@/types/category';

// ============================================
// SMART TVs - Scores match TV_CATEGORY criteria
// ============================================

export const SAMPLE_TVS: Product[] = [
    {
        id: 'samsung-qn90c-65',
        categoryId: 'tv',
        name: 'Samsung QN90C Neo QLED 65"',
        shortName: 'Samsung QN90C',
        brand: 'Samsung',
        model: 'QN90C',
        price: 4200,
        imageUrl: '/images/products/samsung-qn90c.svg',
        status: 'published',
        scores: {
            c1: 8.0,  // Custo-Benefício - Preço competitivo para gaming premium
            c2: 9.0,  // Processamento - Neural Quantum excelente
            c3: 8.0,  // Confiabilidade - Maioria funciona bem
            c4: 8.5,  // Sistema - Tizen elogiado como fluido
            c5: 9.5,  // Gaming - Referência absoluta
            c6: 8.5,  // Brilho - Ótimo para salas claras
            c7: 7.0,  // Pós-Venda - Samsung estrutura nacional
            c8: 8.0,  // Som - 60W elogiado nos reviews BR
            c9: 9.0,  // Conectividade - 4x HDMI 2.1 destaque
            c10: 8.5, // Design - Premium
            gaming: 9.5,
            imageQuality: 9.0,
            connectivity: 9.0,
        },
        specs: {
            screenSize: 65,
            resolution: '4K',
            panelType: 'Neo QLED',
            refreshRate: 120,
            hdrFormats: 'HDR10+, HLG',
            hdmiPorts: 4,
            releaseYear: 2023,
            // Physical dimensions (cm)
            width: 145,
            height: 83,
            depth: 3,
        },
        attributes: {
            hdmi21: true,
            hdmi21Ports: 4,
            brightness: 1500,
            contrastRatio: '1000000:1',
            responseTime: 1,
            vrr: true,
            allm: true,
            dolbyVision: false,
            hdr10Plus: true,
            speakers: '2.2ch 60W',
            smartPlatform: 'Tizen',
            voiceAssistants: ['Bixby', 'Alexa', 'Google'],
        },
        scoreReasons: {
            c1: 'Excelente custo-benefício para gamers. Sempre teste nos primeiros 7 dias por segurança.',
            c3: 'Tecnologia robusta. Como toda TV, verificar pixels na entrega é boa prática.',
            c5: 'Referência absoluta para PS5/Xbox: 5.8ms, VRR, 4x HDMI 2.1. Compra certa para gamers.',
            c6: 'Brilho de 1500 nits ideal para salas claras. Blooming mínimo em cenas escuras.',
            c7: 'Samsung tem rede nacional de suporte. Guarde nota fiscal para garantia.',
        },
        badges: ['editors-choice'],
        offers: [
            {
                store: 'Amazon',
                storeSlug: 'amazon',
                price: 4199,
                url: 'https://www.amazon.com.br/dp/B0C1J5VKXK',
                affiliateUrl: 'https://amzn.to/samsung-qn90c-65',
                inStock: true,
                lastChecked: '2026-01-17'
            },
            {
                store: 'Magazine Luiza',
                storeSlug: 'magalu',
                price: 4299,
                url: 'https://www.magazineluiza.com.br/samsung-qn90c-65',
                inStock: true,
                lastChecked: '2026-01-17'
            }
        ],
        lastUpdated: '2026-01-17',
        // PDP Fields
        benefitSubtitle: 'A TV gamer mais completa do mercado brasileiro',
        lifestyleImage: '/images/lifestyle/samsung-qn90c-living-room.jpg',
        gallery: ['/images/products/samsung-qn90c.svg', '/images/products/samsung-qn90c-side.svg'],
        featureBenefits: [
            { icon: 'Gamepad2', title: 'Input Lag 5.8ms', description: 'Reação instantânea para jogos competitivos. Você vê antes do adversário.' },
            { icon: 'Sun', title: '1500 nits de Brilho', description: 'Perfeita para salas claras. O HDR aparece mesmo com sol entrando.' },
            { icon: 'Zap', title: '4x HDMI 2.1', description: 'Conecte PS5, Xbox e PC ao mesmo tempo sem desconectar nada.' },
            { icon: 'Eye', title: 'Anti-Reflexo', description: 'Tecnologia Matte Display elimina reflexos de janelas e lâmpadas.' },
        ],
        benchmarks: [
            { label: 'Brilho Máximo', productValue: 1500, categoryAverage: 800, unit: 'nits', higherIsBetter: true },
            { label: 'Input Lag', productValue: 5.8, categoryAverage: 12, unit: 'ms', higherIsBetter: false },
            { label: 'Refresh Rate', productValue: 120, categoryAverage: 60, unit: 'Hz', higherIsBetter: true },
        ],
        priceHistory: [
            { date: '2025-12-01', price: 4800 },
            { date: '2025-12-15', price: 4500 },
            { date: '2025-12-25', price: 4200 },
            { date: '2026-01-01', price: 4400 },
            { date: '2026-01-04', price: 4200 },
        ],
        // On-Page Comparison: Direct Rival
        mainCompetitor: {
            id: 'lg-c3-65',
            name: 'LG C3 OLED 65"',
            shortName: 'LG C3',
            imageUrl: '/images/products/lg-c3.svg',
            price: 5500,
            keyDifferences: [
                { label: 'Brilho de Pico', current: '2000 nits', rival: '800 nits', winner: 'current' },
                { label: 'Contraste', current: 'Alto (Mini LED)', rival: 'Infinito (OLED)', winner: 'rival' },
                { label: 'Risco de Burn-in', current: 'Nenhum', rival: 'Baixo', winner: 'current' },
            ],
        },
    },
    {
        id: 'lg-c3-65',
        categoryId: 'tv',
        name: 'LG OLED C3 65"',
        shortName: 'LG C3 OLED',
        brand: 'LG',
        model: 'OLED65C3',
        price: 5500,
        imageUrl: '/images/products/lg-c3.svg',
        scores: {
            c1: 7.5,  // Custo-Benefício - Premium mas entrega qualidade OLED
            c2: 9.5,  // Processamento - α9 Gen6 imbatível
            c3: 9.0,  // Confiabilidade - OLED comprovado, LG garantia forte
            c4: 9.0,  // Sistema - webOS excelente
            c5: 9.8,  // Gaming - Melhor do mercado
            c6: 7.5,  // Brilho - Ideal para salas escuras
            c7: 8.5,  // Pós-Venda - LG tem RA1000 e suporte nacional
            c8: 7.5,  // Som - 40W Dolby Atmos satisfatório
            c9: 9.0,  // Conectividade - 4x HDMI 2.1
            c10: 9.5, // Design - OLED ultrafino
            gaming: 9.8,
            imageQuality: 9.5,
            connectivity: 9.0,
        },
        specs: {
            screenSize: 65,
            resolution: '4K',
            panelType: 'OLED',
            refreshRate: 120,
            hdrFormats: 'Dolby Vision, HDR10, HLG',
            hdmiPorts: 4,
            releaseYear: 2023,
            // Physical dimensions (cm)
            width: 145,
            height: 83,
            depth: 5,
        },
        attributes: {
            hdmi21: true,
            hdmi21Ports: 4,
            brightness: 850,
            contrastRatio: 'Infinito',
            responseTime: 0.1,
            vrr: true,
            allm: true,
            dolbyVision: true,
            hdr10Plus: false,
            speakers: '2.2ch 40W',
            smartPlatform: 'webOS 23',
            voiceAssistants: ['ThinQ', 'Alexa', 'Google'],
        },
        scoreReasons: {
            c2: 'Processador α9 Gen6 é o melhor do mercado em cores e upscaling. Imagem de cinema.',
            c3: 'OLED dura anos para uso normal como TV. Evite uso prolongado como monitor de trabalho.',
            c5: 'A melhor TV para gaming: 0.1ms, G-Sync/FreeSync, Dolby Vision. Perfeita para PS5.',
            c6: 'OLED brilha ~850 nits. Ideal para salas escuras ou controladas.',
            c7: 'LG Brasil tem selo RA1000. Garantia estendida é investimento inteligente (R$200-400).',
        },
        badges: ['premium-pick'],
        offers: [
            {
                store: 'Amazon',
                storeSlug: 'amazon',
                price: 5399,
                url: 'https://www.amazon.com.br/dp/B0BVXF72HV',
                affiliateUrl: 'https://amzn.to/lg-c3-65',
                inStock: true,
                lastChecked: '2026-01-17'
            },
            {
                store: 'Casas Bahia',
                storeSlug: 'casasbahia',
                price: 5599,
                url: 'https://www.casasbahia.com.br/lg-c3-oled-65',
                inStock: true,
                lastChecked: '2026-01-17'
            }
        ],
        lastUpdated: '2026-01-17',
        mainCompetitor: {
            id: 'samsung-qn90c-65',
            name: 'Samsung QN90C Neo QLED 65"',
            shortName: 'Samsung QN90C',
            imageUrl: '/images/products/samsung-qn90c.svg',
            price: 4200,
            score: 8.37,
            keyDifferences: [
                { label: 'Tecnologia', current: 'OLED', rival: 'Mini LED', winner: 'current' },
                { label: 'Brilho', current: '800 nits', rival: '2000 nits', winner: 'rival' },
                { label: 'Burn-in', current: 'Possível', rival: 'Sem risco', winner: 'rival' },
            ],
        },
    },
    {
        id: 'tcl-c735-65',
        categoryId: 'tv',
        name: 'TCL C735 QLED 65"',
        shortName: 'TCL C735',
        brand: 'TCL',
        model: 'C735',
        price: 2800,
        imageUrl: '/images/products/tcl-c735.svg',
        scores: {
            c1: 9.0,  // Custo-Benefício - Imbatível na faixa
            c2: 7.0,  // Processamento - Bom para o preço
            c3: 7.5,  // Confiabilidade - Normal para categoria
            c4: 7.5,  // Sistema - Google TV funciona bem
            c5: 7.5,  // Gaming - Sem HDMI 2.1 real limita consoles
            c6: 7.0,  // Brilho - 330 nits é limitante
            c7: 8.5,  // Pós-Venda - TCL Semp tem RA1000 e nota 8.3!
            c8: 7.0,  // Som - Onkyo satisfatório
            c9: 7.5,  // Conectividade - Adequado
            c10: 7.5, // Design - Clean
            gaming: 7.5,
            imageQuality: 7.0,
            connectivity: 7.5,
        },
        specs: {
            screenSize: 65,
            resolution: '4K',
            panelType: 'QLED',
            refreshRate: 120,
            hdrFormats: 'HDR10, HLG',
            hdmiPorts: 3,
            releaseYear: 2023,
            // Physical dimensions (cm)
            width: 145,
            height: 84,
            depth: 7,
        },
        // Enhanced attributes for comparison
        attributes: {
            hdmi21: false,
            hdmi21Ports: 0,
            brightness: 600,
            contrastRatio: '5000:1',
            responseTime: 6,
            vrr: true,
            allm: true,
            dolbyVision: false,
            hdr10Plus: false,
            speakers: '2.0ch 20W',
            smartPlatform: 'Google TV',
            voiceAssistants: ['Google'],
        },
        badges: ['best-value', 'budget-pick'],
        scoreReasons: {
            c1: 'Imbatível até R$3.000. Entrega 70-80% da experiência premium por metade do preço.',
            c3: 'Boa qualidade para a faixa de preço. Verifique uniformidade na entrega, prática comum.',
            c4: 'Google TV fluido para streaming. Atualizações frequentes melhoram a experiência.',
            c5: '144Hz nativo é ótimo para PC gaming. Para consoles, sem HDMI 2.1 real.',
            c7: 'Destaque: TCL Semp tem selo RA1000 e nota 8.3 no Reclame Aqui. Suporte confiável.',
        },
        offers: [
            {
                store: 'Amazon',
                storeSlug: 'amazon',
                price: 2799,
                url: 'https://www.amazon.com.br/dp/B0C3K5MXQY',
                affiliateUrl: 'https://amzn.to/tcl-c735-65',
                inStock: true,
                lastChecked: '2026-01-17'
            }
        ],
        lastUpdated: '2026-01-17',
        mainCompetitor: {
            id: 'lg-c3-65',
            name: 'LG OLED C3 65"',
            shortName: 'LG C3 OLED',
            imageUrl: '/images/products/lg-c3.svg',
            price: 5500,
            score: 8.62,
            keyDifferences: [
                { label: 'Preço', current: 'R$ 2.800', rival: 'R$ 5.500', winner: 'current' },
                { label: 'Qualidade de Imagem', current: 'QLED 600nits', rival: 'OLED Infinito', winner: 'rival' },
                { label: 'Pós-Venda Brasil', current: 'RA1000 8.3', rival: 'RA1000', winner: 'draw' },
            ],
        },
    },
];

// ============================================
// GELADEIRAS - Scores match FRIDGE_CATEGORY criteria
// ============================================

export const SAMPLE_FRIDGES: Product[] = [
    {
        id: 'samsung-rf23-family-hub',
        categoryId: 'fridge',
        name: 'Samsung RF23A9771SR Family Hub',
        shortName: 'Samsung Family Hub',
        brand: 'Samsung',
        model: 'RF23A9771SR',
        price: 18999,
        specs: {
            capacity: 614,
            // Physical dimensions (cm)
            width: 91,
            height: 178,
            depth: 72,
        },
        scores: {
            c1: 6.5,  // Custo-Benefício Real (VS)
            c2: 8.0,  // Eficiência Energética (QS)
            c3: 9.5,  // Capacidade e Espaço (QS)
            c4: 9.2,  // Sistema de Refrigeração (QS)
            c5: 9.0,  // Confiabilidade (GS)
            c6: 7.5,  // Nível de Ruído (QS)
            c7: 8.5,  // Pós-Venda e Suporte (GS)
            c8: 9.8,  // Recursos Smart (QS)
            c9: 9.5,  // Design e Acabamento (GS)
            c10: 9.5, // Funcionalidades Extras (GS)
        },
        badges: ['premium-pick'],
        lastUpdated: '2026-01-04',
        mainCompetitor: {
            id: 'panasonic-bb71-black',
            name: 'Panasonic BB71 Inverter Black Glass',
            shortName: 'Panasonic BB71',
            imageUrl: '/images/products/panasonic-bb71.svg',
            price: 5200,
            score: 8.61,
            keyDifferences: [
                { label: 'Capacidade', current: '614L', rival: '480L', winner: 'current' },
                { label: 'Recursos Smart', current: 'Family Hub', rival: 'Econavi', winner: 'current' },
                { label: 'Preço', current: 'R$ 18.999', rival: 'R$ 5.200', winner: 'rival' },
            ],
        },
    },
    {
        id: 'brastemp-inverse-460',
        categoryId: 'fridge',
        name: 'Brastemp Inverse BRE59AK 460L',
        shortName: 'Brastemp Inverse',
        brand: 'Brastemp',
        model: 'BRE59AK',
        price: 4599,
        specs: {
            capacity: 460,
            width: 70,
            height: 186,
            depth: 72,
        },
        scores: {
            c1: 8.5,  // Custo-Benefício Real (VS)
            c2: 8.5,  // Eficiência Energética (QS)
            c3: 8.0,  // Capacidade e Espaço (QS)
            c4: 8.5,  // Sistema de Refrigeração (QS)
            c5: 8.5,  // Confiabilidade (GS)
            c6: 8.0,  // Nível de Ruído (QS)
            c7: 9.0,  // Pós-Venda e Suporte (GS)
            c8: 5.0,  // Recursos Smart (QS)
            c9: 8.0,  // Design e Acabamento (GS)
            c10: 7.5, // Funcionalidades Extras (GS)
        },
        badges: ['editors-choice'],
        lastUpdated: '2026-01-04',
        mainCompetitor: {
            id: 'samsung-rt53-evolution',
            name: 'Samsung Evolution RT53 com POWERvolt',
            shortName: 'Samsung RT53',
            imageUrl: '/images/products/samsung-rt53.svg',
            price: 4300,
            score: 8.24,
            keyDifferences: [
                { label: 'Pós-Venda', current: 'Excelente', rival: 'Bom', winner: 'current' },
                { label: 'Capacidade', current: '460L', rival: '518L', winner: 'rival' },
                { label: 'Proteção Elétrica', current: 'Não', rival: 'POWERvolt', winner: 'rival' },
            ],
        },
    },
    {
        id: 'consul-crm50-410',
        categoryId: 'fridge',
        name: 'Consul CRM50 Frost Free 410L',
        shortName: 'Consul CRM50',
        brand: 'Consul',
        model: 'CRM50',
        price: 2299,
        specs: {
            capacity: 410,
            width: 68,
            height: 176,
            depth: 65,
        },
        scores: {
            c1: 9.5,  // Custo-Benefício Real (VS) - Best value!
            c2: 9.0,  // Eficiência Energética (QS)
            c3: 7.0,  // Capacidade e Espaço (QS)
            c4: 7.5,  // Sistema de Refrigeração (QS)
            c5: 8.0,  // Confiabilidade (GS)
            c6: 7.5,  // Nível de Ruído (QS)
            c7: 8.5,  // Pós-Venda e Suporte (GS)
            c8: 3.0,  // Recursos Smart (QS)
            c9: 6.5,  // Design e Acabamento (GS)
            c10: 5.5, // Funcionalidades Extras (GS)
        },
        badges: ['best-value', 'budget-pick'],
        lastUpdated: '2026-01-04',
        mainCompetitor: {
            id: 'brastemp-inverse-460',
            name: 'Brastemp Inverse BRE59AK 460L',
            shortName: 'Brastemp Inverse',
            imageUrl: '/images/products/brastemp-inverse.svg',
            price: 4599,
            score: 7.95,
            keyDifferences: [
                { label: 'Preço', current: 'R$ 2.299', rival: 'R$ 4.599', winner: 'current' },
                { label: 'Capacidade', current: '410L', rival: '460L', winner: 'rival' },
                { label: 'Sistema Frost Free', current: 'Sim', rival: 'Sim', winner: 'draw' },
            ],
        },
    },
    // NEW: User provided seed data
    {
        id: 'panasonic-bb71-black',
        categoryId: 'fridge',
        name: 'Panasonic BB71 Inverter Black Glass',
        shortName: 'Panasonic BB71',
        brand: 'Panasonic',
        model: 'BB71',
        price: 5200,
        scores: {
            c1: 8.5,  // Custo-Benefício
            c2: 9.2,  // Eficiência Energética A+++
            c3: 8.8,  // Capacidade 480L
            c4: 9.0,  // Tecnologia Econavi
            c5: 9.0,  // Confiabilidade
            c6: 8.5,  // Nível de Ruído
            c7: 8.0,  // Pós-Venda
            c8: 7.0,  // Recursos Smart
            c9: 9.0,  // Design Premium Black Glass
            c10: 8.5, // Funcionalidades (FreshZone LED)
        },
        technicalSpecs: {
            capacityLitres: 480,
            voltage: 'Bivolt',
            technology: 'Inverter Econavi',
            finish: 'Black Glass',
            consumption: '40.9 kWh/mês',
        },
        scoreReasons: {
            c2: 'Eficiência A+++ - economia de até 40% na conta de luz',
            c9: 'Design premium Black Glass moderno e elegante',
            c10: 'Gaveta FreshZone com LED azul mantém legumes frescos por mais tempo',
        },
        painPointsSolved: ['Conta de luz alta', 'Legumes estragando'],
        badges: ['premium-pick'],
        lastUpdated: '2026-01-04',
        mainCompetitor: {
            id: 'samsung-rf23-family-hub',
            name: 'Samsung RF23A9771SR Family Hub',
            shortName: 'Samsung Family Hub',
            imageUrl: '/images/products/samsung-family-hub.svg',
            price: 18999,
            score: 8.58,
            keyDifferences: [
                { label: 'Preço', current: 'R$ 5.200', rival: 'R$ 18.999', winner: 'current' },
                { label: 'Eficiência', current: 'A+++', rival: 'A++', winner: 'current' },
                { label: 'Recursos Smart', current: 'Econavi', rival: 'Family Hub', winner: 'rival' },
            ],
        },
    },
    {
        id: 'samsung-rt53-evolution',
        categoryId: 'fridge',
        name: 'Samsung Evolution RT53 com POWERvolt',
        shortName: 'Samsung RT53',
        brand: 'Samsung',
        model: 'RT53',
        price: 4300,
        scores: {
            c1: 9.1,  // Melhor custo por litro
            c2: 8.8,  // Digital Inverter
            c3: 9.2,  // 518L SpaceMax
            c4: 8.8,  // Digital Inverter
            c5: 9.0,  // POWERvolt protege
            c6: 8.0,  // Nível de Ruído
            c7: 7.5,  // Pós-Venda
            c8: 6.0,  // Recursos Smart básicos
            c9: 7.5,  // Design Inox
            c10: 8.5, // SpaceMax
        },
        technicalSpecs: {
            capacityLitres: 518,
            voltage: 'Bivolt (90V-310V)',
            technology: 'Digital Inverter',
            finish: 'Inox',
            consumption: '42.0 kWh/mês',
        },
        scoreReasons: {
            c1: 'Melhor custo por litro do mercado: R$8,30/L',
            c3: 'Tecnologia SpaceMax: paredes finas = mais litros internos',
            c5: 'POWERvolt protege contra picos de energia (90V-310V)',
        },
        painPointsSolved: ['Risco de queimar com picos de energia', 'Espaço interno insuficiente'],
        badges: ['best-value'],
        lastUpdated: '2026-01-04',
        // On-Page Comparison: Direct Rival
        mainCompetitor: {
            id: 'brastemp-inverse-460',
            name: 'Brastemp Inverse BRE59AK 460L',
            shortName: 'Brastemp Inverse',
            imageUrl: '/images/products/brastemp-inverse.svg',
            price: 4599,
            score: 7.9,
            keyDifferences: [
                { label: 'Capacidade', current: '518L', rival: '460L', winner: 'current' },
                { label: 'Proteção POWERvolt', current: 'Sim', rival: 'Não', winner: 'current' },
                { label: 'Pós-Venda Brasil', current: 'Bom', rival: 'Excelente', winner: 'rival' },
            ],
        },
    },
    {
        id: 'electrolux-if43b',
        categoryId: 'fridge',
        name: 'Geladeira Electrolux Frost Free Inverter 390L Efficient AutoSense (IF43B)',
        shortName: 'Electrolux IF43B',
        brand: 'Electrolux',
        model: 'IF43B',
        price: 3399,
        imageUrl: '/images/products/electrolux-if43b.svg',
        asin: 'B0C6R7327B',
        specs: {
            capacity: 390,
            width: 60,
            height: 176,
            depth: 71,
            // Campos para Simuladores Inteligentes
            energyClass: 'A',
            inverter: true,
            noiseLevel: 38,
        },
        technicalSpecs: {
            capacityLitres: 390,
            voltage: '220V',
            technology: 'Frost Free Inverter',
            finish: 'Black Inox Look',
        },
        scores: {
            c1: 9.0,  // Custo-Benefício - Excelente preço para Inverter A+++
            c2: 9.2,  // Eficiência Energética - A+++, economia de 30%
            c3: 7.5,  // Capacidade - 390L, médio
            c4: 8.5,  // Refrigeração - Frost Free Inverter
            c5: 8.5,  // Confiabilidade - Electrolux boa reputação
            c6: 8.0,  // Nível de Ruído - Inverter silencioso
            c7: 7.5,  // Pós-Venda - Rede Electrolux Brasil
            c8: 8.5,  // Recursos Smart - AutoSense com IA
            c9: 8.5,  // Design - Black Inox Look premium
            c10: 8.0, // Funcionalidades - HortiNatura, MoveAdapt
        },
        scoreReasons: {
            c1: 'Melhor custo-benefício: Inverter A+++ por R$3.399',
            c2: 'Eficiência A+++ economiza até 30% na conta de luz',
            c8: 'AutoSense usa IA para controlar temperatura automaticamente',
        },
        painPointsSolved: ['Conta de luz alta', 'Alimentos estragando rápido'],
        badges: ['best-value'],
        lastUpdated: '2026-01-12',
        mainCompetitor: {
            id: 'consul-crm50-410',
            name: 'Consul CRM50 Frost Free 410L',
            shortName: 'Consul CRM50',
            imageUrl: '/images/products/consul-crm50.svg',
            price: 2299,
            score: 7.58,
            keyDifferences: [
                { label: 'Eficiência', current: 'A+++ Inverter', rival: 'A', winner: 'current' },
                { label: 'Capacidade', current: '390L', rival: '410L', winner: 'rival' },
                { label: 'AutoSense IA', current: 'Sim', rival: 'Não', winner: 'current' },
            ],
        },
    },
    {
        id: 'panasonic-bb64',
        categoryId: 'fridge',
        name: 'Geladeira Panasonic BB64 Aço Escovado Inverse Frost Free 460L Inverter A+++ (NR-BB64PV1X)',
        shortName: 'Panasonic BB64',
        brand: 'Panasonic',
        model: 'NR-BB64PV1X',
        price: 4367,
        imageUrl: '/images/products/panasonic-bb64.svg',
        asin: 'B0DGQSDTT4',
        specs: {
            capacity: 460,
            width: 70,
            height: 186,
            depth: 75,
            // Campos para Simuladores Inteligentes
            energyClass: 'A',
            inverter: true,
            noiseLevel: 36,
        },
        technicalSpecs: {
            capacityLitres: 460,
            voltage: '220V',
            technology: 'Inverse Frost Free Inverter',
            finish: 'Aço Escovado',
            energyClass: 'A+++',
        },
        scores: {
            c1: 8.5,  // Custo-Benefício
            c2: 9.5,  // Eficiência Energética A+++
            c3: 8.5,  // Capacidade 460L
            c4: 9.0,  // Refrigeração Inverter
            c5: 9.0,  // Confiabilidade Panasonic
            c6: 8.5,  // Nível de Ruído
            c7: 8.0,  // Pós-Venda
            c8: 7.0,  // Recursos Smart
            c9: 8.5,  // Design Aço Escovado
            c10: 8.0, // Funcionalidades
        },
        scoreReasons: {},
        painPointsSolved: [],
        badges: [],
        lastUpdated: '2026-01-12',
        mainCompetitor: {
            id: 'brastemp-inverse-460',
            name: 'Brastemp Inverse BRE59AK 460L',
            shortName: 'Brastemp Inverse',
            imageUrl: '/images/products/brastemp-inverse.svg',
            price: 4599,
            score: 7.95,
            keyDifferences: [
                { label: 'Eficiência', current: 'A+++ Inverter', rival: 'A++', winner: 'current' },
                { label: 'Capacidade', current: '460L', rival: '460L', winner: 'draw' },
                { label: 'Sistema', current: 'Inverse', rival: 'Inverse', winner: 'draw' },
            ],
        },
    },
    {
        id: 'hq-150rdf',
        categoryId: 'fridge',
        name: 'Geladeira Refrigerador Compacto HQ Defrost 150 Litros Preto (HQ-150RDF)',
        shortName: 'HQ Compacta 150L',
        brand: 'HQ',
        model: 'HQ-150RDF',
        price: 1489,
        imageUrl: '/images/products/hq-150rdf.svg',
        asin: 'B0G1TSGJW1',
        specs: {
            capacity: 150,
            width: 46,
            height: 129,
            depth: 49,
            // Campos para Simuladores Inteligentes
            energyClass: 'C',  // Defrost manual = menos eficiente
            inverter: false,
            noiseLevel: 42,
        },
        technicalSpecs: {
            capacityLitres: 150,
            voltage: '220V',
            technology: 'Defrost Manual',
            finish: 'Preto',
            doors: 2,
        },
        scores: {
            c1: 9.0,  // Custo-Benefício - Excelente preço para compacta
            c2: 6.5,  // Eficiência Energética - Defrost manual menos eficiente
            c3: 6.0,  // Capacidade - 150L compacta
            c4: 7.0,  // Refrigeração - Básica
            c5: 7.0,  // Confiabilidade - Marca menos conhecida
            c6: 7.5,  // Nível de Ruído - Compacta silenciosa
            c7: 5.5,  // Pós-Venda - Rede limitada
            c8: 3.0,  // Recursos Smart - Nenhum
            c9: 7.0,  // Design - Simples
            c10: 5.0, // Funcionalidades - Básica
        },
        scoreReasons: {},
        painPointsSolved: ['Espaço limitado', 'Segundo refrigerador'],
        badges: ['budget-pick'],
        lastUpdated: '2026-01-12',
        mainCompetitor: {
            id: 'consul-crm50-410',
            name: 'Consul CRM50 Frost Free 410L',
            shortName: 'Consul CRM50',
            imageUrl: '/images/products/consul-crm50.svg',
            price: 2299,
            score: 7.58,
            keyDifferences: [
                { label: 'Preço', current: 'R$ 1.489', rival: 'R$ 2.299', winner: 'current' },
                { label: 'Capacidade', current: '150L', rival: '410L', winner: 'rival' },
                { label: 'Frost Free', current: 'Não', rival: 'Sim', winner: 'rival' },
            ],
        },
    },
];

// ============================================
// ALL PRODUCTS
// ============================================

// ============================================
// AR CONDICIONADO - Tier 1 Category
// ============================================

export const SAMPLE_AIR_CONDITIONERS: Product[] = [
    {
        id: 'lg-dual-inverter-12000',
        categoryId: 'air_conditioner',
        name: 'LG Dual Inverter Voice 12000 BTUs',
        shortName: 'LG Dual Inverter',
        brand: 'LG',
        model: 'S4-Q12JA31A',
        price: 2599,
        scores: {
            c1: 9.0, c2: 9.5, c3: 8.5, c4: 9.0, c5: 9.0,
            c6: 9.5, c7: 8.5, c8: 8.0, c9: 9.0, c10: 8.5,
        },
        technicalSpecs: {
            btus: 12000,
            inverterType: 'dual-inverter',
            noiseLevel: 19,
        },
        scoreReasons: {
            c2: 'Tecnologia Dual Inverter oferece até 70% de economia de energia comparado a modelos convencionais.',
            c5: 'Apenas 19dB - um dos mais silenciosos do mercado, ideal para quartos.',
        },
        badges: ['editors-choice'],
        lastUpdated: '2026-01-04',
        mainCompetitor: {
            id: 'samsung-windfree-12000',
            name: 'Samsung WindFree 12000 BTUs',
            shortName: 'Samsung WindFree',
            imageUrl: '/images/products/samsung-windfree.svg',
            price: 2899,
            score: 8.80,
            keyDifferences: [
                { label: 'Preço', current: 'R$ 2.599', rival: 'R$ 2.899', winner: 'current' },
                { label: 'Ruído', current: '19dB', rival: '21dB', winner: 'current' },
                { label: 'Tecnologia', current: 'Dual Inverter', rival: 'WindFree', winner: 'draw' },
            ],
        },
    },
    {
        id: 'samsung-windfree-12000',
        categoryId: 'air_conditioner',
        name: 'Samsung WindFree 12000 BTUs',
        shortName: 'Samsung WindFree',
        brand: 'Samsung',
        model: 'AR12CVFAMWK',
        price: 2899,
        scores: {
            c1: 8.5, c2: 9.5, c3: 9.0, c4: 8.5, c5: 9.5,
            c6: 9.0, c7: 8.5, c8: 8.0, c9: 9.0, c10: 9.0,
        },
        technicalSpecs: {
            btus: 12000,
            inverterType: 'inverter',
            noiseLevel: 21,
        },
        scoreReasons: {
            c3: 'Tecnologia WindFree distribui ar através de 23.000 micro-furos, eliminando o vento direto.',
            c9: 'Integração SmartThings com controle por voz Bixby e Google.',
        },
        badges: ['premium-pick'],
        lastUpdated: '2026-01-04',
        mainCompetitor: {
            id: 'lg-dual-inverter-12000',
            name: 'LG Dual Inverter Voice 12000 BTUs',
            shortName: 'LG Dual Inverter',
            imageUrl: '/images/products/lg-dual-inverter.svg',
            price: 2599,
            score: 8.90,
            keyDifferences: [
                { label: 'Tecnologia', current: 'WindFree', rival: 'Dual Inverter', winner: 'draw' },
                { label: 'Ruído', current: '21dB', rival: '19dB', winner: 'rival' },
                { label: 'Recursos Smart', current: 'SmartThings', rival: 'ThinQ', winner: 'current' },
            ],
        },
    },
    {
        id: 'electrolux-eco-9000',
        categoryId: 'air_conditioner',
        name: 'Electrolux Eco Turbo 9000 BTUs',
        shortName: 'Electrolux Eco',
        brand: 'Electrolux',
        model: 'EI09F',
        price: 1699,
        scores: {
            c1: 9.5, c2: 8.0, c3: 7.5, c4: 7.5, c5: 7.0,
            c6: 7.0, c7: 7.5, c8: 8.5, c9: 6.0, c10: 7.5,
        },
        technicalSpecs: {
            btus: 9000,
            inverterType: 'conventional',
            noiseLevel: 38,
        },
        scoreReasons: {
            c1: 'Melhor preço do segmento de entrada. Ideal para quem busca economia inicial.',
            c5: '38dB é ruidoso - não recomendado para quartos de dormir.',
        },
        badges: ['budget-pick'],
        lastUpdated: '2026-01-04',
        mainCompetitor: {
            id: 'consul-inverter-12000',
            name: 'Consul Inverter 12000 BTUs',
            shortName: 'Consul Inverter',
            imageUrl: '/images/products/consul-inverter.svg',
            price: 2199,
            score: 8.10,
            keyDifferences: [
                { label: 'Preço', current: 'R$ 1.699', rival: 'R$ 2.199', winner: 'current' },
                { label: 'Tecnologia', current: 'Convencional', rival: 'Inverter', winner: 'rival' },
                { label: 'Economia', current: 'Normal', rival: 'Até 60%', winner: 'rival' },
            ],
        },
    },
    {
        id: 'consul-inverter-12000',
        categoryId: 'air_conditioner',
        name: 'Consul Inverter 12000 BTUs',
        shortName: 'Consul Inverter',
        brand: 'Consul',
        model: 'CBN12CBBNA',
        price: 2199,
        scores: {
            c1: 9.0, c2: 8.5, c3: 8.0, c4: 8.0, c5: 8.0,
            c6: 8.5, c7: 8.0, c8: 8.5, c9: 7.0, c10: 7.5,
        },
        technicalSpecs: {
            btus: 12000,
            inverterType: 'inverter',
            noiseLevel: 28,
        },
        scoreReasons: {
            c1: 'Melhor custo-benefício para quem quer Inverter sem pagar premium LG/Samsung.',
        },
        badges: ['best-value'],
        lastUpdated: '2026-01-04',
        mainCompetitor: {
            id: 'lg-dual-inverter-12000',
            name: 'LG Dual Inverter Voice 12000 BTUs',
            shortName: 'LG Dual Inverter',
            imageUrl: '/images/products/lg-dual-inverter.svg',
            price: 2599,
            score: 8.90,
            keyDifferences: [
                { label: 'Preço', current: 'R$ 2.199', rival: 'R$ 2.599', winner: 'current' },
                { label: 'Marca', current: 'Consul', rival: 'LG', winner: 'rival' },
                { label: 'Ruído', current: '28dB', rival: '19dB', winner: 'rival' },
            ],
        },
    },
    // NEW: User provided seed data
    {
        id: 'lg-dual-inverter-voice-ai',
        categoryId: 'air_conditioner',
        name: 'LG Dual Inverter Voice + AI 12000 BTUs',
        shortName: 'LG Voice + AI',
        brand: 'LG',
        model: 'S4-Q12JA3WC',
        price: 2400,
        scores: {
            c1: 8.8,  // Custo-Benefício
            c2: 9.5,  // Eficiência IDRS 6.0 Classe A
            c3: 8.5,  // 12000 BTUs
            c4: 9.0,  // Durabilidade Dual Inverter
            c5: 9.5,  // Super Silencioso 19dB Sleep
            c6: 9.5,  // Dual Inverter
            c7: 8.5,  // Filtros
            c8: 8.0,  // Instalação
            c9: 9.0,  // WiFi + Voice
            c10: 8.0, // Design
        },
        technicalSpecs: {
            btus: 12000,
            cycle: 'Frio',
            noiseLevel: 19,
            efficiency: 'IDRS 6.0 (Classe A)',
        },
        scoreReasons: {
            c5: 'Apenas 19dB no modo Sleep - super silencioso, ideal para dormir',
            c2: 'Economia de até 70% na conta de luz com Dual Inverter',
            c6: 'Tecnologia Dual Inverter: resfria 40% mais rápido',
        },
        painPointsSolved: ['Barulho ao dormir', 'Conta de luz no verão'],
        badges: ['editors-choice'],
        lastUpdated: '2026-01-04',
        mainCompetitor: {
            id: 'samsung-windfree-connect',
            name: 'Samsung WindFree Connect Sem Vento',
            shortName: 'WindFree Connect',
            imageUrl: '/images/products/samsung-windfree-connect.svg',
            price: 2600,
            score: 8.70,
            keyDifferences: [
                { label: 'Preço', current: 'R$ 2.400', rival: 'R$ 2.600', winner: 'current' },
                { label: 'Tecnologia', current: 'Dual Inverter', rival: 'WindFree', winner: 'draw' },
                { label: 'Ruído', current: '19dB', rival: '22dB', winner: 'current' },
            ],
        },
    },
    {
        id: 'samsung-windfree-connect',
        categoryId: 'air_conditioner',
        name: 'Samsung WindFree Connect Sem Vento',
        shortName: 'WindFree Connect',
        brand: 'Samsung',
        model: 'AR12CVFAMWK',
        price: 2600,
        scores: {
            c1: 8.2,  // Custo-Benefício
            c2: 9.4,  // IDRS 6.2
            c3: 8.5,  // 12000 BTUs
            c4: 9.0,  // Durabilidade
            c5: 9.0,  // 22dB
            c6: 9.0,  // Inverter
            c7: 8.5,  // Filtros
            c8: 8.0,  // Instalação
            c9: 9.5,  // SmartThings App - Fator Uau
            c10: 9.5, // Design WindFree
        },
        technicalSpecs: {
            btus: 12000,
            cycle: 'Quente/Frio',
            noiseLevel: 22,
            efficiency: 'IDRS 6.2',
        },
        scoreReasons: {
            c3: 'Modo WindFree: 23.000 micro-furos distribuem ar sem vento direto',
            c9: 'App SmartThings com controle remoto, timer e modo IA',
            c10: 'Design premiado - elimina sensação de vento gelado incomodando',
        },
        painPointsSolved: ['Vento gelado incomodando', 'Controle difícil'],
        badges: ['premium-pick'],
        lastUpdated: '2026-01-04',
        mainCompetitor: {
            id: 'lg-dual-inverter-voice-ai',
            name: 'LG Dual Inverter Voice + AI 12000 BTUs',
            shortName: 'LG Voice + AI',
            imageUrl: '/images/products/lg-dual-inverter-ai.svg',
            price: 2400,
            score: 8.80,
            keyDifferences: [
                { label: 'Design', current: 'WindFree', rival: 'Tradicional', winner: 'current' },
                { label: 'Preço', current: 'R$ 2.600', rival: 'R$ 2.400', winner: 'rival' },
                { label: 'Ruído', current: '22dB', rival: '19dB', winner: 'rival' },
            ],
        },
    },
];

// ============================================
// ROBÔS ASPIRADORES - Tier 2 Category
// ============================================

export const SAMPLE_ROBOT_VACUUMS: Product[] = [
    {
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
    },
    // ============================================
    // ROBOROCK Q7 L5 - LiDAR Premium (Cadastrado 18/01/2026)
    // ============================================
    {
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
            dockType: 'Carregamento Simples',
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
    },
    // ============================================
    // XIAOMI ROBOT VACUUM X10 - LiDAR + Auto-Empty (Cadastrado 18/01/2026)
    // ============================================
    {
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
                affiliateUrl: 'https://amzn.to/xiaomi-x10',
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
    },
];


// ============================================
// SMARTWATCHES - Nova Categoria (Cadastrado 18/01/2026)
// ============================================

export const SAMPLE_SMARTWATCHES: Product[] = [
    {
        id: 'samsung-galaxy-watch7-44mm-lte',
        categoryId: 'smartwatch',
        name: 'Samsung Galaxy Watch7 44mm LTE com Galaxy AI',
        shortName: 'Galaxy Watch7 44mm',
        brand: 'Samsung',
        model: 'SM-L315F',
        price: 2199,
        asin: 'B0D96TWWRD',
        imageUrl: '/images/products/galaxy-watch7.svg',
        status: 'published',
        benefitSubtitle: 'O smartwatch Samsung mais inteligente com Galaxy AI e processador 3nm',
        scores: {
            // Critérios de Smartwatch - Cadastrado 18/01/2026
            // c1: Tela (14%), c2: Bateria (14%), c3: Sensores Saúde (14%), c4: Fitness (12%)
            // c5: Ecossistema (10%), c6: Custo-Benefício (14%), c7: Design (8%)
            // c8: Resistência (6%), c9: Notificações (4%), c10: Pagamentos (4%)
            c1: 9.5,  // Tela - AMOLED 1.5" com cristal de safira, brilho excelente
            c2: 7.0,  // Bateria - ~30h típico com LTE, precisa carregar diário
            c3: 9.5,  // Sensores Saúde - HR, SpO2, ECG, detecção queda, sono avançado
            c4: 9.0,  // Fitness - GPS dupla frequência, 100+ modos esporte
            c5: 8.5,  // Ecossistema - Wear OS + One UI, melhor com Galaxy, funciona Android
            c6: 7.5,  // Custo-Benefício - R$ 2.199 é premium, mas entrega muito
            c7: 9.0,  // Design - Premium, pulseiras intercambiáveis, safira
            c8: 9.0,  // Resistência - 5ATM + IP68, natação OK
            c9: 9.0,  // Notificações - Resposta inteligente com Galaxy AI
            c10: 9.5, // Pagamentos - Samsung Pay + Google Wallet = completo
        },
        specs: {
            screenSize: 44,  // mm
            batteryCapacity: 425,  // mAh
            width: 44,
            height: 44,
            depth: 9.7,
        },
        attributes: {
            displayType: 'Super AMOLED',
            displayMaterial: 'Cristal de Safira',
            processor: 'Exynos W1000 (3nm)',
            connectivity: 'LTE + Bluetooth 5.3 + Wi-Fi',
            storage: '32GB',
            ram: '2GB',
            waterResistance: '5ATM + IP68',
            gps: 'Dupla Frequência',
            sensors: ['HR', 'SpO2', 'ECG', 'BIA', 'Temperatura Pele'],
            os: 'Wear OS 5 + One UI Watch 6',
            voiceAssistants: ['Bixby', 'Google'],
            nfc: true,
        },
        technicalSpecs: {
            // Display
            displaySize: '1.5"',
            displayResolution: '480x480',
            displayType: 'Super AMOLED Always On',
            displayProtection: 'Cristal de Safira',
            // Performance
            processor: 'Exynos W1000 3nm',
            ram: '2GB',
            storage: '32GB',
            // Bateria
            batteryCapacity: 425,  // mAh
            typicalBattery: '30 horas',
            chargingTime: '30 min para 45%',
            wirelessCharging: true,
            // Conectividade
            bluetooth: '5.3',
            wifi: 'b/g/n 2.4GHz',
            lte: true,
            nfc: true,
            gps: 'L1+L5 Dupla Frequência',
            // Sensores
            heartRate: true,
            spo2: true,
            ecg: true,
            bia: true,  // Composição corporal
            skinTemperature: true,
            accelerometer: true,
            gyroscope: true,
            barometer: true,
            // Resistência
            waterResistance: '5ATM + IP68',
            militaryGrade: 'MIL-STD-810H',
            // Dimensões
            diameter: 44,  // mm
            thickness: 9.7,  // mm
            weight: 33.8,  // g (sem pulseira)
        },
        scoreReasons: {
            c1: 'PREMIUM: Tela Super AMOLED 1.5" com cristal de safira (durabilidade máxima). Always On Display eficiente.',
            c2: 'ATENÇÃO: ~30h de bateria típica com LTE. Precisa carregar todo dia. Carregamento rápido ajuda.',
            c3: 'DESTAQUE: Sensores mais completos do mercado - HR, SpO2, ECG, BIA, temp de pele. Galaxy AI analisa sono.',
            c4: 'EXCELENTE: GPS dupla frequência (L1+L5) = precisão máxima. 100+ modos de esporte com detecção automática.',
            c5: 'ECOSSISTEMA: Funciona com qualquer Android, mas brilha com Galaxy. ECG/PA só com Samsung.',
            c7: 'DESIGN: Corpo em alumínio, safira e pulseiras intercambiáveis. Estilo premium.',
            c10: 'COMPLETO: Samsung Pay + Google Wallet. NFC para pagamentos por aproximação em qualquer bandeira.',
        },
        voc: {
            totalReviews: 1827,
            averageRating: 4.7,
            oneLiner: 'O smartwatch Android mais completo com Galaxy AI e sensores avançados',
            summary: 'Compradores elogiam muito a qualidade de construção, sensores de saúde completos e integração com Samsung. Principais críticas são sobre a bateria que dura ~1 dia e funcionalidades limitadas com iPhones. Ideal para donos de Samsung Galaxy.',
            pros: [
                'Galaxy AI com análise de sono e Pontuação de Energia inovadora',
                'Sensores de saúde mais completos (ECG, BIA, SpO2, temp pele)',
                'GPS dupla frequência = precisão máxima em corridas',
                'Design premium com cristal de safira',
                'Carregamento rápido (30min para 45%)',
            ],
            cons: [
                'Bateria ~30h com LTE, precisa carregar diariamente',
                'ECG e pressão arterial só funcionam com Samsung Galaxy',
                'Não compatível com iPhone',
                'Preço premium de R$ 2.199',
            ],
            sources: [
                { name: 'Amazon Brasil', url: 'https://www.amazon.com.br/dp/B0D96TWWRD', count: 1827 },
            ],
        },
        painPointsSolved: ['Monitoramento avançado de saúde', 'GPS impreciso em corridas', 'Pagamento sem celular', 'Notificações inteligentes'],
        badges: ['premium-pick', 'editors-choice'],
        offers: [
            {
                store: 'Amazon',
                storeSlug: 'amazon',
                price: 2199,
                url: 'https://www.amazon.com.br/dp/B0D96TWWRD',
                affiliateUrl: 'https://amzn.to/galaxy-watch7-44mm',
                inStock: true,
                lastChecked: '2026-01-18',
            },
        ],
        lastUpdated: '2026-01-18',
        gallery: ['/images/products/galaxy-watch7.svg'],
        featureBenefits: [
            { icon: 'Brain', title: 'Galaxy AI', description: 'Pontuação de Energia e análise de sono com IA. Sabe quando você precisa descansar.' },
            { icon: 'Heart', title: 'Saúde Completa', description: 'ECG, SpO2, composição corporal e temperatura de pele em um dispositivo.' },
            { icon: 'MapPin', title: 'GPS L1+L5', description: 'Dupla frequência = precisão de 1 metro. Ideal para corredores exigentes.' },
            { icon: 'CreditCard', title: 'Pagamento Total', description: 'Samsung Pay + Google Wallet. Deixe a carteira em casa.' },
        ],
        mainCompetitor: {
            id: 'apple-watch-series-9',
            name: 'Apple Watch Series 9 45mm',
            shortName: 'Apple Watch 9',
            imageUrl: '/images/products/apple-watch-9.svg',
            price: 4499,
            score: 8.8,
            keyDifferences: [
                { label: 'Compatibilidade', current: 'Android + Samsung', rival: 'Apenas iPhone', winner: 'current' },
                { label: 'Preço', current: 'R$ 2.199', rival: 'R$ 4.499', winner: 'current' },
                { label: 'Ecossistema', current: 'Wear OS', rival: 'watchOS', winner: 'rival' },
            ],
        },
    },
];

// ============================================
// SMARTPHONES - Scores match SMARTPHONE_CATEGORY criteria
// ============================================

export const SAMPLE_SMARTPHONES: Product[] = [
    {
        id: 'samsung-galaxy-a56-5g',
        categoryId: 'smartphone',
        name: 'Samsung Galaxy A56 5G 128GB',
        shortName: 'Galaxy A56',
        brand: 'Samsung',
        model: 'SM-A566E',
        price: 1845,
        imageUrl: 'https://m.media-amazon.com/images/I/51lPd9IOAVL._AC_SL1200_.jpg',
        asin: 'B0DYVPJ8KZ',
        status: 'published',
        specs: {
            // Dimensões físicas (mm)
            width: 77.2,
            height: 165.2,
            depth: 7.4,
            weight: 195,
        },
        technicalSpecs: {
            displaySize: 6.7,
            displayType: 'Super AMOLED',
            refreshRate: 120,
            processor: 'Exynos 1580',
            ram: 8,
            storage: 128,
            battery: 5000,
            chargingSpeed: 45,
            mainCamera: 50,
            certification: 'IP67',
            os: 'Android 15',
            nfc: true,
            esim: true,
            fiveG: true,
        },
        scores: {
            // Critérios 10 Dores para Smartphones
            c1: 8.5,  // Autonomia Real (IARSE) - 5000mAh, Exynos eficiente, 45W
            c2: 8.8,  // Estabilidade de Software (ESMI) - One UI 7, 6 anos updates
            c3: 8.5,  // Custo-Benefício & Revenda (RCBIRV) - Galaxy A = alta revenda
            c4: 7.5,  // Câmera Social (QFSR) - 50MP OIS, bom mas não flagship
            c5: 8.5,  // Resiliência Física (RFCT) - IP67, Gorilla Glass Victus+
            c6: 9.0,  // Qualidade de Tela (QDAE) - Super AMOLED 120Hz, Vision Booster
            c7: 9.0,  // Pós-Venda & Peças (EPST) - Samsung Brasil = RA1000, 6 anos updates
            c8: 9.0,  // Conectividade (CPI) - NFC, 5G, eSIM
            c9: 8.0,  // Armazenamento (AGD) - 128GB UFS, sem MicroSD
            c10: 8.0, // Recursos Úteis (IFM) - Galaxy AI, som estéreo, sem DeX
        },
        scoreReasons: {
            c1: 'Bateria de 5000mAh com Exynos 1580 eficiente. Carregador 45W incluso entrega 70% em 30min.',
            c2: 'One UI 7 limpo, sem bloatware. Samsung prometeu 6 anos de updates de sistema e segurança.',
            c3: 'Linha Galaxy A tem excelente retenção de valor no Brasil. Revenda facilitada.',
            c5: 'IP67 real (30min até 1m) + Gorilla Glass Victus+. Aguenta chuva e quedas leves.',
            c6: 'Super AMOLED 120Hz com Vision Booster para sol forte brasileiro. Top para tela nessa faixa.',
            c7: 'Samsung Brasil tem selo RA1000 e rede nacional de assistências autorizadas.',
        },
        voc: {
            averageRating: 4.8,
            totalReviews: 2835,
            oneLiner: 'O intermediário Samsung mais equilibrado de 2025',
            summary: 'O Galaxy A56 5G impressiona pela combinação de tela Super AMOLED de alta qualidade, bateria de longa duração e promessa de 6 anos de atualizações. Ideal para quem quer um Samsung com ótimo custo-benefício.',
            sources: [
                { name: 'Amazon BR', url: 'https://www.amazon.com.br/dp/B0DYVPJ8KZ', count: 2835 },
                { name: 'YouTube BR', url: 'https://youtube.com/results?search_query=galaxy+a56+review', count: 50 },
            ],
            pros: [
                'Tela AMOLED excelente, cores vibrantes',
                'Bateria dura o dia todo com folga',
                'Câmera noturna surpreendente',
                'Design premium, acabamento de vidro',
                'IP67 - pode usar na chuva tranquilo',
            ],
            cons: [
                'Sem carregador na caixa (cabo apenas)',
                'Exynos aquece um pouco em jogos pesados',
                'Não tem MicroSD',
            ],
        },
        badges: ['editors-choice'],
        offers: [
            {
                store: 'Amazon',
                storeSlug: 'amazon',
                price: 1845,
                url: 'https://www.amazon.com.br/dp/B0DYVPJ8KZ',
                affiliateUrl: 'https://amzn.to/galaxy-a56-5g',
                inStock: true,
                lastChecked: '2026-01-19',
            },
        ],
        lastUpdated: '2026-01-19',
        gallery: ['https://m.media-amazon.com/images/I/51lPd9IOAVL._AC_SL1200_.jpg'],
        featureBenefits: [
            { icon: 'Shield', title: 'IP67 Certificado', description: 'Resistente à água e poeira. Use na chuva sem medo.' },
            { icon: 'Battery', title: '5000mAh + 45W', description: 'Bateria que dura o dia. Carrega 70% em 30 minutos.' },
            { icon: 'Cpu', title: '6 Anos de Updates', description: 'Samsung promete atualizações até 2031. Investimento de longo prazo.' },
            { icon: 'MonitorSmartphone', title: 'Super AMOLED 120Hz', description: 'Tela vibrante visível até no sol forte brasileiro.' },
        ],
        mainCompetitor: {
            id: 'motorola-edge-50-neo',
            name: 'Motorola Edge 50 Neo',
            shortName: 'Edge 50 Neo',
            imageUrl: '/images/products/motorola-edge-50-neo.svg',
            price: 1999,
            score: 8.2,
            keyDifferences: [
                { label: 'Updates', current: '6 anos', rival: '4 anos', winner: 'current' },
                { label: 'Proteção', current: 'IP67', rival: 'IP68', winner: 'rival' },
                { label: 'Revenda', current: 'Alta (Samsung)', rival: 'Média', winner: 'current' },
            ],
        },
    },
];

// ============================================
// ALL PRODUCTS - Combined Export
// ============================================

export const ALL_PRODUCTS: Product[] = [
    ...SAMPLE_TVS,
    ...SAMPLE_FRIDGES,
    ...SAMPLE_AIR_CONDITIONERS,
    ...SAMPLE_ROBOT_VACUUMS,
    ...SAMPLE_SMARTWATCHES,
    ...SAMPLE_SMARTPHONES,
];

/**
 * Get products by category ID
 */
export function getProductsByCategory(categoryId: string): Product[] {
    return ALL_PRODUCTS.filter(p => p.categoryId === categoryId);
}

/**
 * Get a single product by ID
 */
export function getProductById(productId: string): Product | null {
    return ALL_PRODUCTS.find(p => p.id === productId) ?? null;
}
