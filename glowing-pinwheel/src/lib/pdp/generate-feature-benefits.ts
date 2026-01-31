/**
 * Feature Benefits Auto-Generator
 * 
 * Generates feature benefits from product specs and category.
 * Maps spec keys to user-friendly benefit descriptions.
 */

import type { Product } from '@/types/category';
import type { FeatureBenefit } from '@/types/category';

// Feature templates by category - maps spec keys to benefit descriptions
const FEATURE_TEMPLATES: Record<string, Record<string, {
    title: string;
    description: (value: any, specs: any) => string;
    icon: string;
}>> = {
    'robot-vacuum': {
        suctionPower: {
            title: 'Potência de Sucção',
            description: (v) => `${v}Pa de potência para remover sujeira profunda de carpetes e pisos`,
            icon: 'zap',
        },
        navigation: {
            title: 'Navegação Inteligente',
            description: (v) => v === 'LiDAR'
                ? 'LiDAR mapeia sua casa com precisão milimétrica, evitando obstáculos'
                : `Sistema ${v} para navegação eficiente pela casa`,
            icon: 'eye',
        },
        runtime: {
            title: 'Autonomia Estendida',
            description: (v) => `${v} minutos de limpeza contínua — ideal para casas grandes`,
            icon: 'leaf',
        },
        mop: {
            title: 'Sistema de Mop',
            description: (v) => v === 'Vibratório'
                ? 'Mop sônico vibratório esfrega 3000x/min para manchas difíceis'
                : 'Passa pano enquanto aspira para manutenção diária',
            icon: 'wind',
        },
        antiTangle: {
            title: 'Anti-Emaranhamento',
            description: () => 'Escovas de borracha não enrolam fios ou cabelos de pets',
            icon: 'shield',
        },
    },
    'tv': {
        resolution: {
            title: 'Resolução Ultra Nítida',
            description: (v) => `Painel ${v} com mais de 8 milhões de pixels para imagens incríveis`,
            icon: 'eye',
        },
        refreshRate: {
            title: 'Taxa de Atualização',
            description: (v) => `${v} para movimento suave em esportes e jogos`,
            icon: 'zap',
        },
        hdr: {
            title: 'HDR Cinematográfico',
            description: (v) => `Suporte ${v} para cores vibrantes e contraste de cinema`,
            icon: 'sun',
        },
        smartOS: {
            title: 'Sistema Smart',
            description: (v) => `${v} com milhares de apps e streaming integrado`,
            icon: 'cpu',
        },
        size: {
            title: 'Tela Grande',
            description: (v) => `${v} de diagonal para imersão total em filmes`,
            icon: 'ruler',
        },
    },
    'air-conditioner': {
        btu: {
            title: 'Capacidade Térmica',
            description: (v) => `${v} BTU/h para climatização eficiente do ambiente`,
            icon: 'wind',
        },
        inverter: {
            title: 'Tecnologia Inverter',
            description: () => 'Compressor inverter economiza até 60% de energia',
            icon: 'leaf',
        },
        energyClass: {
            title: 'Eficiência Energética',
            description: (v) => `Selo Procel ${v} — menor consumo na conta de luz`,
            icon: 'trendingdown',
        },
        silent: {
            title: 'Operação Silenciosa',
            description: () => 'Modo sleep ultra silencioso para noites tranquilas',
            icon: 'volume2',
        },
    },
    'fridge': {
        capacity: {
            title: 'Capacidade Generosa',
            description: (v) => `${v} de espaço interno para toda a família`,
            icon: 'ruler',
        },
        inverter: {
            title: 'Motor Inverter',
            description: () => 'Compressor inverter = economia de energia + menos ruído',
            icon: 'leaf',
        },
        frostFree: {
            title: 'Frost Free',
            description: () => 'Nunca mais precisa descongelar manualmente',
            icon: 'wind',
        },
        icemaker: {
            title: 'Fábrica de Gelo',
            description: () => 'Produz gelo automaticamente para bebidas geladas',
            icon: 'zap',
        },
    },
    'smartphone': {
        processor: {
            title: 'Performance Premium',
            description: (v) => `Processador ${v} para apps e jogos sem travamentos`,
            icon: 'cpu',
        },
        camera: {
            title: 'Câmera Profissional',
            description: (v) => `Sensor ${v} para fotos incríveis em qualquer luz`,
            icon: 'eye',
        },
        battery: {
            title: 'Bateria Duradoura',
            description: (v) => `${v} mAh para um dia inteiro de uso intenso`,
            icon: 'zap',
        },
        display: {
            title: 'Tela Imersiva',
            description: (v) => `Display ${v} com cores vibrantes e alta taxa de atualização`,
            icon: 'sun',
        },
    },
};

// Default templates for unknown categories
const DEFAULT_TEMPLATES: Record<string, {
    title: string;
    description: (value: any) => string;
    icon: string;
}> = {
    power: {
        title: 'Alta Potência',
        description: (v) => `${v}W de potência para performance superior`,
        icon: 'zap',
    },
    efficiency: {
        title: 'Eficiência Energética',
        description: () => 'Consome menos energia que modelos convencionais',
        icon: 'leaf',
    },
    quality: {
        title: 'Qualidade Premium',
        description: () => 'Materiais de alta qualidade para maior durabilidade',
        icon: 'award',
    },
};

/**
 * Extract price from product (handles both number and object types)
 */
function getProductPrice(product: Product): number | undefined {
    if (typeof product.price === 'number') {
        return product.price;
    } else if (product.price && typeof product.price === 'object') {
        return (product.price as any).current || (product.price as any).range?.min;
    }
    return undefined;
}

/**
 * Generate feature benefits from product specs
 */
export function generateFeatureBenefits(product: Product): FeatureBenefit[] {
    const categoryId = product.categoryId || 'robot-vacuum';
    const templates = FEATURE_TEMPLATES[categoryId] || {};
    const specs = product.specs || {};

    const benefits: FeatureBenefit[] = [];

    // Match specs to templates
    for (const [specKey, specValue] of Object.entries(specs)) {
        if (specValue === null || specValue === undefined || specValue === '') continue;

        // Check if we have a template for this spec
        const template = templates[specKey];
        if (template) {
            benefits.push({
                title: template.title,
                description: template.description(specValue, specs),
                icon: template.icon,
            });
        }
    }

    // Add price benefit if good value
    const price = getProductPrice(product);
    if (price && price < 2000) {
        benefits.push({
            title: 'Excelente Custo-Benefício',
            description: `Por menos de R$ ${price.toLocaleString('pt-BR')}, você leva qualidade sem pesar no bolso`,
            icon: 'award',
        });
    }

    // Ensure at least 3 benefits
    if (benefits.length < 3) {
        // Add generic benefits based on category
        if (categoryId === 'robot-vacuum') {
            benefits.push({
                title: 'Limpeza Automatizada',
                description: 'Limpa sua casa enquanto você descansa ou trabalha',
                icon: 'star',
            });
        } else if (categoryId === 'tv') {
            benefits.push({
                title: 'Entretenimento Completo',
                description: 'Streaming, games e muito mais em uma única tela',
                icon: 'star',
            });
        } else {
            benefits.push({
                title: 'Qualidade Garantida',
                description: 'Produto analisado e aprovado pela nossa equipe editorial',
                icon: 'award',
            });
        }
    }

    // Limit to 6 benefits max
    return benefits.slice(0, 6);
}

/**
 * Check if we can generate feature benefits
 */
export function canGenerateFeatureBenefits(product: Product): boolean {
    const specs = product.specs;
    return !!specs && Object.keys(specs).length > 0;
}
