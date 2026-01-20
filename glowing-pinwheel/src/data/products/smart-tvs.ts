/**
 * Smart TVs - SIC-Enhanced Product Data
 * 
 * @description Products with full SIC (Sistema de Inteligência de Componentes) profiles
 * for Shadow Engine and UnifiedProcessor consumption.
 * 
 * Data Sources:
 * - INMETRO/ENCE: Energy consumption (official)
 * - Manufacturer specs: Panel tech, refresh rate, ports
 * - RTINGS/YouTube BR: Real-world measurements
 */

import type { Product } from '@/types/category';

// ============================================
// SIC TYPES
// ============================================

export interface SICProfile {
    /** Brand tier: S (1.2), A (1.0), B (0.9), C (0.8) */
    brand_tier: 'S' | 'A' | 'B' | 'C';
    /** Panel technology classification */
    panel_tech: 'OLED_EMISSIVE' | 'QD_OLED_EMISSIVE' | 'QUANTUM_DOT_LCD' | 'STANDARD_LCD';
    /** Component quality factors (0-1 scale) */
    component_quality: {
        panel: number;
        backlight?: number;
        processor: number;
        construction: number;
        power_supply: number;
    };
    /** Gaming penalty if 120Hz+ but input lag > 15ms */
    gaming_penalty: boolean;
    /** Burn-in risk level */
    burn_in_risk: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
    /** Shadow Engine calculates this */
    estimated_lifespan: number;
    /** French repairability index (if available) */
    repairability_index: number | null;
}

export interface EnergyProfile {
    /** Monthly consumption in kWh */
    kwh_month: number;
    /** Typical power consumption in watts */
    typical_watts: number;
    /** Maximum power consumption in watts */
    max_watts: number;
    /** Standby power in watts */
    standby_watts: number;
    /** Data source */
    source: 'INMETRO_REAL' | 'ESTIMADO_AUTO' | 'FABRICANTE';
    /** Procel rating */
    procel_rating?: 'A' | 'B' | 'C' | 'D' | 'E';
}

export interface EditorialNotes {
    /** For "Não Compre Se" section */
    dealbreakers: string[];
    /** For "Veredito" section */
    verdict_points: string[];
    /** Anti-redundância: Usability issues (NOT specs) */
    usability_notes: string[];
    /** Insider tips for CommunityConsensus */
    golden_tips: string[];
}

export interface SICProduct extends Product {
    sic_profile: SICProfile;
    energy: EnergyProfile;
    editorial_notes: EditorialNotes;
}

// ============================================
// SMART TVs - SIC Enhanced
// ============================================

export const SMART_TVS: SICProduct[] = [
    {
        id: 'samsung-qn90c-65',
        categoryId: 'tv',
        name: 'Samsung QN90C Neo QLED 65"',
        shortName: 'Samsung QN90C',
        brand: 'Samsung',
        model: 'QN65QN90CAGXZD',
        price: 6499, // Updated Jan 2026
        imageUrl: '/images/products/samsung-qn90c.svg',

        specs: {
            screenSize: 65,
            resolution: '4K',
            panelType: 'Neo QLED',
            refreshRate: 144,
            hdrFormats: 'HDR10+, HLG',
            hdmiPorts: 4,
            releaseYear: 2023,
            width: 145,
            height: 83,
            depth: 3,
        },

        attributes: {
            hdmi21: true,
            hdmi21Ports: 4,
            brightness: 2000,
            contrastRatio: '1000000:1',
            responseTime: 1,
            inputLag: 5.8,
            vrr: true,
            allm: true,
            freesync: 'Premium Pro',
            dolbyVision: false,  // Samsung não suporta - usa HDR10+
            hdr10Plus: true,
            speakers: '4.2.2ch 60W',
            smartPlatform: 'Tizen',
            voiceAssistants: ['Bixby', 'Alexa', 'Google'],
            dolbyAtmos: true,
        },

        scores: {
            c1: 8.0,  // Custo-Benefício
            c2: 9.0,  // Processamento - Neural Quantum 4K excelente
            c3: 8.0,  // Confiabilidade
            c4: 8.5,  // Sistema - Tizen
            c5: 9.5,  // Gaming - Referência absoluta
            c6: 9.0,  // Brilho - 2000 nits
            c7: 7.0,  // Pós-Venda Samsung
            c8: 8.5,  // Som - 60W 4.2.2 Dolby Atmos
            c9: 9.0,  // Conectividade - 4x HDMI 2.1
            c10: 8.5, // Design - Neoslim
            gaming: 9.5,
            imageQuality: 9.0,
            connectivity: 9.0,
        },

        scoreReasons: {
            c1: 'Excelente custo-benefício para gamers. Sempre teste nos primeiros 7 dias.',
            c5: 'Referência absoluta para PS5/Xbox: 5.8ms, VRR, 4x HDMI 2.1. Compra certa para gamers.',
            c6: 'Brilho de 2000 nits (pico) ideal para salas muito iluminadas.',
        },

        // ============================================
        // SIC PROFILE - Shadow Engine Input
        // ============================================
        sic_profile: {
            brand_tier: 'A',  // Samsung = Linha Premium (não atinge Tier S)
            panel_tech: 'QUANTUM_DOT_LCD',  // Neo QLED = Mini LED + Quantum Dots
            component_quality: {
                panel: 0.95,        // Mini LED = alta durabilidade, zero burn-in
                backlight: 0.93,    // Mini LED zones = mais confiável que edge-lit
                processor: 0.90,    // Neural Quantum 4K IA
                construction: 0.92, // Neoslim + base metal
                power_supply: 0.88, // 285W pico = PSU robusto necessário
            },
            gaming_penalty: false,  // Input lag 5.8ms < 15ms threshold ✓
            burn_in_risk: 'NONE',   // LCD não tem burn-in
            estimated_lifespan: 0,  // Shadow Engine calcula
            repairability_index: null, // Índice francês não disponível para TVs BR
        },

        // ============================================
        // ENERGY - TCO Input
        // ============================================
        energy: {
            kwh_month: 18.5,
            typical_watts: 110,
            max_watts: 285,
            standby_watts: 0.5,
            source: 'INMETRO_REAL',  // Selo ENCE oficial
            procel_rating: 'A',
        },

        // ============================================
        // EDITORIAL NOTES - Anti-Redundância
        // ============================================
        editorial_notes: {
            dealbreakers: [
                'Você exige Dolby Vision (Samsung usa HDR10+, não suporta DV)',
                'Você precisa de som premium sem soundbar (60W é bom, mas não premium)',
            ],
            verdict_points: [
                'Gaming: Excelente - 5.8ms input lag + 144Hz + 4x HDMI 2.1 + FreeSync Premium Pro',
                'Consumo Eficiente: 18.5 kWh/mês para 65" (Classe A ENCE)',
                'Mini LED: Sem risco de burn-in (diferente do OLED)',
            ],
            usability_notes: [
                'O sistema Tizen pode demorar para abrir apps pesados',
                'Configurações avançadas podem confundir iniciantes',
            ],
            golden_tips: [
                'Ative o Modo Jogo para reduzir input lag em 40%',
                'Use HDR10+ Dynamic para filmes - melhor que HDR10 padrão',
                'Calibre brilho para 45-50% para economia sem perder qualidade',
            ],
        },

        badges: ['editors-choice'],
        lastUpdated: '2026-01-17',

        featureBenefits: [
            { icon: 'Gamepad2', title: 'Input Lag 5.8ms', description: 'Reação instantânea para jogos competitivos.' },
            { icon: 'Sun', title: '2000 nits de Brilho', description: 'Perfeita para salas muito claras com HDR.' },
            { icon: 'Zap', title: '4x HDMI 2.1', description: 'Conecte PS5, Xbox e PC simultaneamente.' },
            { icon: 'Eye', title: 'Anti-Reflexo', description: 'Tecnologia Matte Display elimina reflexos.' },
        ],

        benchmarks: [
            { label: 'Brilho Máximo', productValue: 2000, categoryAverage: 800, unit: 'nits', higherIsBetter: true },
            { label: 'Input Lag', productValue: 5.8, categoryAverage: 12, unit: 'ms', higherIsBetter: false },
            { label: 'Refresh Rate', productValue: 144, categoryAverage: 60, unit: 'Hz', higherIsBetter: true },
            { label: 'Consumo Mensal', productValue: 18.5, categoryAverage: 25, unit: 'kWh', higherIsBetter: false },
        ],

        mainCompetitor: {
            id: 'lg-c3-65',
            name: 'LG C3 OLED 65"',
            shortName: 'LG C3',
            imageUrl: '/images/products/lg-c3.svg',
            price: 5500,
            keyDifferences: [
                { label: 'Brilho de Pico', current: '2000 nits', rival: '800 nits', winner: 'current' as const },
                { label: 'Contraste', current: 'Alto (Mini LED)', rival: 'Infinito (OLED)', winner: 'rival' as const },
                { label: 'Risco de Burn-in', current: 'Nenhum', rival: 'Baixo', winner: 'current' as const },
            ],
        },
    },
];

// ============================================
// EXPORTS
// ============================================

export function getSmartTVById(id: string): SICProduct | undefined {
    return SMART_TVS.find(tv => tv.id === id);
}

export function getAllSmartTVs(): SICProduct[] {
    return SMART_TVS;
}

export function getSmartTVsBySICTier(tier: 'S' | 'A' | 'B' | 'C'): SICProduct[] {
    return SMART_TVS.filter(tv => tv.sic_profile.brand_tier === tier);
}
