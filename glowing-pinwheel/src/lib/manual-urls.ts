/**
 * Manual URLs Mapping
 * 
 * Maps product IDs to official manufacturer support pages where
 * users can download the actual PDF manuals.
 * 
 * Strategy: Link to official support pages instead of hosting PDFs locally.
 * This ensures users always get the latest version and avoids copyright issues.
 */

export interface ManualData {
    pdfUrl?: string;         // Direct PDF download URL (if available)
    supportUrl: string;      // Official support/manual page
    language: string;
    pages?: number;
    fileSize?: string;
    lastUpdated?: string;
}

/**
 * Brand-specific support base URLs
 */
const BRAND_SUPPORT_URLS: Record<string, string> = {
    samsung: 'https://www.samsung.com/br/support/model/',
    lg: 'https://www.lg.com/br/suporte/produto/',
    sony: 'https://www.sony.com.br/suporte/',
    panasonic: 'https://www.panasonic.com/br/suporte/',
    philco: 'https://www.philco.com.br/suporte/',
    consul: 'https://www.consul.com.br/suporte/',
    brastemp: 'https://www.brastemp.com.br/suporte/',
    electrolux: 'https://www.electrolux.com.br/suporte/',
    midea: 'https://www.midea.com/br/suporte/',
    gree: 'https://www.gree.com.br/suporte/',
    fujitsu: 'https://www.fujitsu-general.com/br/support/',
    carrier: 'https://www.carrierdobrasil.com.br/suporte/',
    springer: 'https://www.springer.com.br/suporte/',
    tcl: 'https://www.tcl.com/br/pt/support/',
    aoc: 'https://www.aoc.com/br/support/',
    philips: 'https://www.philips.com.br/c-w/support-home.html',
    dell: 'https://www.dell.com/support/home/pt-br',
    asus: 'https://www.asus.com/br/support/',
    lenovo: 'https://support.lenovo.com/br/pt/',
    apple: 'https://support.apple.com/pt-br/manuals',
};

/**
 * Product-specific manual data
 * Key: product ID (slug)
 */
export const MANUAL_DATA: Record<string, ManualData> = {
    // ============================================
    // TVs - Samsung
    // ============================================
    'samsung-qn90c-65': {
        supportUrl: 'https://www.samsung.com/br/support/model/QN65QN90CAGXZD/',
        pdfUrl: 'https://downloadcenter.samsung.com/content/UM/202303/20230324090441098/BN68-15016C-00_WEBMANUAL_BRAZIL_POR.pdf',
        language: 'Português (Brasil)',
        pages: 228,
        fileSize: '15.2 MB',
        lastUpdated: '2024-01',
    },
    'samsung-qn85c-65': {
        supportUrl: 'https://www.samsung.com/br/support/model/QN65QN85CAGXZD/',
        language: 'Português (Brasil)',
        lastUpdated: '2024-01',
    },
    'samsung-cu8000-55': {
        supportUrl: 'https://www.samsung.com/br/support/model/UN55CU8000GXZD/',
        language: 'Português (Brasil)',
        lastUpdated: '2024-01',
    },
    'samsung-au7700-50': {
        supportUrl: 'https://www.samsung.com/br/support/model/UN50AU7700GXZD/',
        language: 'Português (Brasil)',
        lastUpdated: '2023-06',
    },

    // ============================================
    // TVs - LG
    // ============================================
    'lg-c3-65': {
        supportUrl: 'https://www.lg.com/br/suporte/produto/lg-OLED65C3PSA',
        pdfUrl: 'https://gscs-b2c.lge.com/downloadFile?fileId=VOSZUv1P5gMOqO5Z6k5IjQ',
        language: 'Português (Brasil)',
        pages: 312,
        fileSize: '18.5 MB',
        lastUpdated: '2024-01',
    },
    'lg-c2-55': {
        supportUrl: 'https://www.lg.com/br/suporte/produto/lg-OLED55C2PSA',
        language: 'Português (Brasil)',
        lastUpdated: '2023-06',
    },
    'lg-b3-55': {
        supportUrl: 'https://www.lg.com/br/suporte/produto/lg-OLED55B3PSA',
        language: 'Português (Brasil)',
        lastUpdated: '2024-01',
    },
    'lg-ur8750-50': {
        supportUrl: 'https://www.lg.com/br/suporte/produto/lg-50UR8750PSA',
        language: 'Português (Brasil)',
        lastUpdated: '2024-01',
    },

    // ============================================
    // TVs - Sony
    // ============================================
    'sony-x90l-65': {
        supportUrl: 'https://www.sony.com.br/electronics/suporte/televisions-projectors-lcd-tv',
        language: 'Português (Brasil)',
        lastUpdated: '2024-01',
    },
    'sony-a80l-55': {
        supportUrl: 'https://www.sony.com.br/electronics/suporte/televisions-projectors-oled-tvs',
        language: 'Português (Brasil)',
        lastUpdated: '2024-01',
    },

    // ============================================
    // Geladeiras - Panasonic
    // ============================================
    'panasonic-bb71-black': {
        supportUrl: 'https://www.panasonic.com/br/suporte/produto/nr-bb71gvfb.html',
        language: 'Português (Brasil)',
        pages: 48,
        fileSize: '8.2 MB',
        lastUpdated: '2024-01',
    },
    'panasonic-bb53': {
        supportUrl: 'https://www.panasonic.com/br/suporte/produto/nr-bb53gv3b.html',
        language: 'Português (Brasil)',
        lastUpdated: '2024-01',
    },

    // ============================================
    // Geladeiras - Brastemp/Consul
    // ============================================
    'brastemp-brm54': {
        supportUrl: 'https://www.brastemp.com.br/suporte/produto/brm54jbana',
        language: 'Português (Brasil)',
        lastUpdated: '2024-01',
    },
    'consul-crm50': {
        supportUrl: 'https://www.consul.com.br/suporte/produto/crm50abana',
        language: 'Português (Brasil)',
        lastUpdated: '2024-01',
    },

    // ============================================
    // Geladeiras - Electrolux
    // ============================================
    'electrolux-if55': {
        supportUrl: 'https://www.electrolux.com.br/support/product/if55/',
        language: 'Português (Brasil)',
        lastUpdated: '2024-01',
    },
    'electrolux-df56': {
        supportUrl: 'https://www.electrolux.com.br/support/product/df56/',
        language: 'Português (Brasil)',
        lastUpdated: '2024-01',
    },

    // ============================================
    // Ar Condicionado - LG
    // ============================================
    'lg-dual-inverter-18000': {
        supportUrl: 'https://www.lg.com/br/suporte/produto/lg-S4-W18KL31A',
        language: 'Português (Brasil)',
        lastUpdated: '2024-01',
    },
    'lg-dual-inverter-12000': {
        supportUrl: 'https://www.lg.com/br/suporte/produto/lg-S4-W12JA31A',
        language: 'Português (Brasil)',
        lastUpdated: '2024-01',
    },

    // ============================================
    // Ar Condicionado - Samsung
    // ============================================
    'samsung-windfree-12000': {
        supportUrl: 'https://www.samsung.com/br/support/model/AR12CVFAMWKNAZ/',
        language: 'Português (Brasil)',
        lastUpdated: '2024-01',
    },
    'samsung-digital-inverter-9000': {
        supportUrl: 'https://www.samsung.com/br/support/model/AR09TVHZDWKNAZ/',
        language: 'Português (Brasil)',
        lastUpdated: '2024-01',
    },
};

/**
 * Get manual data for a product
 * Falls back to brand support page if product not mapped
 */
export function getManualData(productId: string, brand?: string): ManualData {
    // Check if we have specific data for this product
    if (MANUAL_DATA[productId]) {
        return MANUAL_DATA[productId];
    }

    // Fallback to brand support page
    const brandLower = brand?.toLowerCase() || 'samsung';
    const brandSupportUrl = BRAND_SUPPORT_URLS[brandLower] || 'https://www.google.com/search?q=manual+' + productId;

    return {
        supportUrl: brandSupportUrl,
        language: 'Português (Brasil)',
    };
}

/**
 * Check if a product has a direct PDF download available
 */
export function hasDirectPdfDownload(productId: string): boolean {
    return Boolean(MANUAL_DATA[productId]?.pdfUrl);
}
