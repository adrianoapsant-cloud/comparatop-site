/**
 * Accessories Database & Bundle Configuration
 * 
 * @description Defines complementary products (accessories) for each category
 * and rules for matching them to main products.
 * 
 * To add a new accessory:
 * 1. Add it to the ACCESSORIES array with proper categoryId and compatibleWith
 * 2. The bundle-matcher will automatically pick the best match
 */

import type { Product } from '@/types/category';

// ============================================
// ACCESSORY TYPE DEFINITION
// ============================================

export interface Accessory {
    id: string;
    name: string;
    shortName: string;
    brand: string;
    /** Category this accessory belongs to */
    accessoryCategoryId: string;
    /** Categories of MAIN products this accessory complements */
    compatibleWithCategories: string[];
    /** Brands this accessory works best with (empty = universal) */
    preferredBrands: string[];
    price: number;
    asin: string;
    imageUrl: string;
    /** Description of why this accessory is recommended */
    benefit: string;
    /** Product attributes that make this accessory unnecessary */
    skipIfProductHas?: {
        attribute: string;
        minValue?: number;
        containsValue?: string;
    }[];
    /** Priority for selection (higher = preferred) */
    priority: number;
}

// ============================================
// ACCESSORY CATEGORY TYPES
// ============================================

export type AccessoryCategoryId =
    | 'soundbar'
    | 'suporte_tv'
    | 'cabo_hdmi'
    | 'protetor_surto'
    | 'organizador_geladeira'
    | 'filtro_agua'
    | 'suporte_ac'
    | 'controle_universal'
    | 'escova_robo'
    | 'pano_mop'
    | 'fita_balizadora';

// ============================================
// ACCESSORIES DATABASE
// ============================================

export const ACCESSORIES: Accessory[] = [
    // ============================================
    // SOUNDBARS - For TVs
    // ============================================
    // Samsung Q-Series: Q-Symphony compatible (TV speakers work WITH soundbar)
    {
        id: 'samsung-hw-q990c-soundbar',
        name: 'Soundbar Samsung HW-Q990C 11.1.4ch Dolby Atmos',
        shortName: 'Samsung HW-Q990C',
        brand: 'Samsung',
        accessoryCategoryId: 'soundbar',
        compatibleWithCategories: ['tv'],
        preferredBrands: ['Samsung'], // Q-Symphony: TV + Soundbar tocam juntos!
        price: 4999,
        asin: 'B0BQ990C01',
        imageUrl: 'https://m.media-amazon.com/images/I/31samsung-q990c.jpg',
        benefit: 'Q-Symphony: TV e soundbar tocam JUNTOS! Som 11.1.4ch com subwoofer e surround wireless.',
        skipIfProductHas: [],
        priority: 15, // Highest priority for Samsung TVs
    },
    {
        id: 'samsung-hw-q800c-soundbar',
        name: 'Soundbar Samsung HW-Q800C 5.1.2ch Dolby Atmos',
        shortName: 'Samsung HW-Q800C',
        brand: 'Samsung',
        accessoryCategoryId: 'soundbar',
        compatibleWithCategories: ['tv'],
        preferredBrands: ['Samsung'], // Q-Symphony compatible
        price: 2499,
        asin: 'B0BQ800C01',
        imageUrl: 'https://m.media-amazon.com/images/I/31samsung-q800c.jpg',
        benefit: 'Q-Symphony: áudio imersivo 5.1.2ch. Melhor custo-benefício para TVs Samsung.',
        skipIfProductHas: [],
        priority: 12, // High priority for Samsung TVs
    },
    {
        id: 'lg-sp8ya-soundbar',
        name: 'Soundbar LG SP8YA 3.1.2ch Dolby Atmos',
        shortName: 'LG SP8YA',
        brand: 'LG',
        accessoryCategoryId: 'soundbar',
        compatibleWithCategories: ['tv'],
        preferredBrands: ['LG'], // WOW Orchestra compatible
        price: 1799,
        asin: 'B0BSOUNDBAR2',
        imageUrl: 'https://m.media-amazon.com/images/I/21soundbar-lg.jpg',
        benefit: 'WOW Orchestra: sincroniza com TVs LG para som envolvente 3.1.2ch com Atmos.',
        skipIfProductHas: [
            { attribute: 'speakers', containsValue: '60W' },
        ],
        priority: 10,
    },
    {
        id: 'jbl-bar-5.0',
        name: 'JBL Bar 5.0 MultiBeam Soundbar',
        shortName: 'JBL Bar 5.0',
        brand: 'JBL',
        accessoryCategoryId: 'soundbar',
        compatibleWithCategories: ['tv'],
        preferredBrands: ['TCL', 'Philco', 'AOC', 'Philips', 'Sony'], // Marcas SEM ecossistema de áudio próprio
        price: 999,
        asin: 'B0BSOUNDBAR3',
        imageUrl: 'https://m.media-amazon.com/images/I/21soundbar-jbl.jpg',
        benefit: 'Som virtual 5.0 com MultiBeam. Compatível com qualquer TV via HDMI ARC.',
        priority: 3, // Low priority - fallback for non-Samsung/LG TVs
    },

    // ============================================
    // SUPORTES TV - For TVs
    // ============================================
    {
        id: 'elg-suporte-articulado-65',
        name: 'Suporte Articulado ELG P600 32-65"',
        shortName: 'Suporte ELG P600',
        brand: 'ELG',
        accessoryCategoryId: 'suporte_tv',
        compatibleWithCategories: ['tv'],
        preferredBrands: [],
        price: 179,
        asin: 'B0SUPORTE1',
        imageUrl: 'https://m.media-amazon.com/images/I/21suporte-elg.jpg',
        benefit: 'Suporte articulado para TVs até 65". Ajuste de inclinação e distância da parede.',
        priority: 5,
    },

    // ============================================
    // CABOS HDMI - For TVs and Consoles
    // ============================================
    {
        id: 'cabo-hdmi-2.1-2m',
        name: 'Cabo HDMI 2.1 8K 2m Certificado',
        shortName: 'HDMI 2.1 2m',
        brand: 'Amazon Basics',
        accessoryCategoryId: 'cabo_hdmi',
        compatibleWithCategories: ['tv', 'console', 'monitor'],
        preferredBrands: [],
        price: 89,
        asin: 'B0CABOHDMI1',
        imageUrl: 'https://m.media-amazon.com/images/I/21cabo-hdmi.jpg',
        benefit: 'HDMI 2.1 certificado para 4K@120Hz e 8K. Essencial para PS5/Xbox Series X.',
        skipIfProductHas: [
            { attribute: 'hdmi21Ports', minValue: 4 }, // Already has plenty of HDMI 2.1
        ],
        priority: 3,
    },

    // ============================================
    // PROTETORES DE SURTO - Universal
    // ============================================
    {
        id: 'protetor-surto-clamper',
        name: 'Protetor Contra Surtos Clamper iClamper',
        shortName: 'iClamper',
        brand: 'Clamper',
        accessoryCategoryId: 'protetor_surto',
        compatibleWithCategories: ['tv', 'fridge', 'air_conditioner'],
        preferredBrands: [],
        price: 79,
        asin: 'B0PROTETOR1',
        imageUrl: 'https://m.media-amazon.com/images/I/21iclamper.jpg',
        benefit: 'Protege contra raios e picos de energia. Garantia de R$10.000 em danos.',
        skipIfProductHas: [
            { attribute: 'technology', containsValue: 'POWERvolt' }, // Already protected
        ],
        priority: 4,
    },

    // ============================================
    // ORGANIZADORES GELADEIRA - For Fridges
    // ============================================
    {
        id: 'organizador-geladeira-kit',
        name: 'Kit Organizadores para Geladeira 6 peças',
        shortName: 'Kit Organizadores',
        brand: 'Ordene',
        accessoryCategoryId: 'organizador_geladeira',
        compatibleWithCategories: ['fridge'],
        preferredBrands: [],
        price: 129,
        asin: 'B0ORGANIZ1',
        imageUrl: 'https://m.media-amazon.com/images/I/21organizador.jpg',
        benefit: 'Maximize o espaço interno. 6 peças transparentes para frutas, legumes e ovos.',
        priority: 5,
    },

    // ============================================
    // FILTROS DE ÁGUA - For Fridges with dispenser
    // ============================================
    {
        id: 'filtro-refil-universal',
        name: 'Refil Filtro de Água Universal Geladeira',
        shortName: 'Filtro Universal',
        brand: 'Acqua Pure',
        accessoryCategoryId: 'filtro_agua',
        compatibleWithCategories: ['fridge'],
        preferredBrands: [],
        price: 69,
        asin: 'B0FILTRO1',
        imageUrl: 'https://m.media-amazon.com/images/I/21filtro.jpg',
        benefit: 'Troca semestral recomendada. Compatível com a maioria das geladeiras.',
        // Skip if fridge doesn't have dispenser (would need attribute check)
        priority: 4,
    },

    // ============================================
    // AR CONDICIONADO ACESSÓRIOS
    // ============================================
    {
        id: 'suporte-ar-condicionado',
        name: 'Suporte para Ar Condicionado Split Universal',
        shortName: 'Suporte AC',
        brand: 'Sulfort',
        accessoryCategoryId: 'suporte_ac',
        compatibleWithCategories: ['air_conditioner'],
        preferredBrands: [],
        price: 89,
        asin: 'B0SUPORTEAC1',
        imageUrl: 'https://m.media-amazon.com/images/I/21suporte-ac.jpg',
        benefit: 'Suporte metálico para unidade externa. Inclui parafusos e buchas.',
        priority: 5,
    },
    {
        id: 'controle-universal-ar',
        name: 'Controle Remoto Universal para Ar Condicionado',
        shortName: 'Controle Universal',
        brand: 'Chunghop',
        accessoryCategoryId: 'controle_universal',
        compatibleWithCategories: ['air_conditioner'],
        preferredBrands: [],
        price: 39,
        asin: 'B0CONTROLE1',
        imageUrl: 'https://m.media-amazon.com/images/I/21controle-ac.jpg',
        benefit: 'Compatível com +1000 marcas. Backup perfeito caso perca o original.',
        skipIfProductHas: [
            { attribute: 'inverterType', containsValue: 'WiFi' }, // Has app control
        ],
        priority: 3,
    },

    // ============================================
    // ROBÔ ASPIRADOR ACESSÓRIOS
    // ============================================
    {
        id: 'kit-escovas-robo-universal',
        name: 'Kit Escovas de Reposição para Robô Aspirador',
        shortName: 'Kit Escovas',
        brand: 'Accessories',
        accessoryCategoryId: 'escova_robo',
        compatibleWithCategories: ['robot-vacuum'],
        preferredBrands: [],
        price: 49,
        asin: 'B0ESCOVAROBO1',
        imageUrl: 'https://m.media-amazon.com/images/I/21escovas-robo.jpg',
        benefit: '4 escovas laterais + 1 escova central. Troque a cada 3-6 meses para manter sucção.',
        priority: 8,
    },
    {
        id: 'pano-mop-robo-universal',
        name: 'Panos de Mop para Robô Aspirador (6 unidades)',
        shortName: 'Panos de Mop',
        brand: 'Accessories',
        accessoryCategoryId: 'pano_mop',
        compatibleWithCategories: ['robot-vacuum'],
        preferredBrands: [],
        price: 39,
        asin: 'B0PANOMOP1',
        imageUrl: 'https://m.media-amazon.com/images/I/21pano-mop.jpg',
        benefit: '6 panos laváveis de microfibra. Compatível com maioria dos robôs 3-em-1.',
        skipIfProductHas: [
            { attribute: 'mopType', containsValue: 'none' }, // Robô sem mop
        ],
        priority: 7,
    },
    {
        id: 'fita-balizadora-robo',
        name: 'Fita Balizadora Magnética 5m para Robô',
        shortName: 'Fita Balizadora',
        brand: 'WAP',
        accessoryCategoryId: 'fita_balizadora',
        compatibleWithCategories: ['robot-vacuum'],
        preferredBrands: ['WAP', 'Xiaomi', 'Dreame'],
        price: 59,
        asin: 'B0FITAROBO1',
        imageUrl: 'https://m.media-amazon.com/images/I/21fita-balizadora.jpg',
        benefit: 'Delimita áreas proibidas sem app. Ideal para comedouros de pet e tapetes.',
        skipIfProductHas: [
            { attribute: 'hasVirtualWall', containsValue: 'true' }, // Já tem
            { attribute: 'hasMapping', containsValue: 'true' }, // Pode usar app
        ],
        priority: 6,
    },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get all accessories compatible with a specific main category
 */
export function getAccessoriesForCategory(mainCategoryId: string): Accessory[] {
    return ACCESSORIES.filter(acc =>
        acc.compatibleWithCategories.includes(mainCategoryId)
    );
}

/**
 * Get accessories by their own category
 */
export function getAccessoriesByType(accessoryCategoryId: AccessoryCategoryId): Accessory[] {
    return ACCESSORIES.filter(acc => acc.accessoryCategoryId === accessoryCategoryId);
}
