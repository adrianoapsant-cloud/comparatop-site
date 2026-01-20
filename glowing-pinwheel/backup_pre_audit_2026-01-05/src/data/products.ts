/**
 * Sample Product Data - For Development/Testing
 * 
 * @description Example products with scores matching category criteria IDs.
 * In production, this would come from a CMS or database.
 */

import type { Product } from '@/types/category';

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
        imageUrl: '/images/products/samsung-qn90c.jpg',
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
        lastUpdated: '2026-01-04',
        // PDP Fields
        benefitSubtitle: 'A TV gamer mais completa do mercado brasileiro',
        lifestyleImage: '/images/lifestyle/samsung-qn90c-living-room.jpg',
        gallery: ['/images/products/samsung-qn90c.jpg', '/images/products/samsung-qn90c-side.jpg'],
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
    },
    {
        id: 'lg-c3-65',
        categoryId: 'tv',
        name: 'LG OLED C3 65"',
        shortName: 'LG C3 OLED',
        brand: 'LG',
        model: 'OLED65C3',
        price: 5500,
        imageUrl: '/images/products/lg-c3.jpg',
        scores: {
            c1: 7.5,  // Custo-Benefício - Premium mas entrega qualidade OLED
            c2: 9.5,  // Processamento - α9 Gen6 imbatível
            c3: 8.5,  // Confiabilidade - OLED dura anos para uso normal
            c4: 9.0,  // Sistema - webOS excelente
            c5: 9.8,  // Gaming - Melhor do mercado
            c6: 7.5,  // Brilho - Ideal para salas escuras
            c7: 8.0,  // Pós-Venda - LG tem RA1000
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
        lastUpdated: '2026-01-05',
    },
    {
        id: 'tcl-c735-65',
        categoryId: 'tv',
        name: 'TCL C735 QLED 65"',
        shortName: 'TCL C735',
        brand: 'TCL',
        model: 'C735',
        price: 2800,
        imageUrl: '/images/products/tcl-c735.jpg',
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
        lastUpdated: '2026-01-05',
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
    },
    {
        id: 'brastemp-inverse-460',
        categoryId: 'fridge',
        name: 'Brastemp Inverse BRE59AK 460L',
        shortName: 'Brastemp Inverse',
        brand: 'Brastemp',
        model: 'BRE59AK',
        price: 4599,
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
    },
    {
        id: 'consul-crm50-410',
        categoryId: 'fridge',
        name: 'Consul CRM50 Frost Free 410L',
        shortName: 'Consul CRM50',
        brand: 'Consul',
        model: 'CRM50',
        price: 2299,
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
    },
];

// ============================================
// ALL PRODUCTS - Combined Export
// ============================================

export const ALL_PRODUCTS: Product[] = [
    ...SAMPLE_TVS,
    ...SAMPLE_FRIDGES,
    ...SAMPLE_AIR_CONDITIONERS,
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
