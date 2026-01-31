/**
 * Tools Configuration System
 * 
 * Central configuration for all 250+ interactive tools.
 * Each engine reads its config from here to auto-generate UI and logic.
 */

// ============================================
// TYPES
// ============================================

export type InputType = 'number' | 'slider' | 'boolean' | 'select' | 'range' | 'region-select';

export interface InputConfig {
    id: string;
    label: string;
    type: InputType;
    defaultValue?: number | boolean | string;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    options?: { value: string | number; label: string }[];
    // For formula calculation
    multiplier?: number;
    bonus?: number;
    condition?: string; // "sol === true"
}

export interface FormulaVariable {
    inputId: string;
    operation: 'multiply' | 'add' | 'subtract' | 'divide';
    value?: number; // Static value or use multiplier from input
}

export interface RateEngineConfig {
    id: string;
    engine: 'RateEngine';
    title: string;
    description: string;
    category: string;
    inputs: InputConfig[];
    formula: string; // e.g., "(area * 600) + (sol ? 800 : 0) + (pessoas * 600)"
    resultLabel: string;
    resultUnit: string;
    recommendations?: {
        threshold: number;
        operator: 'lt' | 'lte' | 'eq' | 'gte' | 'gt';
        text: string;
    }[];
    relatedProducts?: {
        categoryId: string;
        filterBy?: string; // e.g., "specs.btus >= result"
    };
}

export interface DimensionInput {
    id: string;
    label: string;
    unit: string;
    defaultValue?: number;
    min?: number;
    max?: number;
}

export interface GeometryEngineConfig {
    id: string;
    engine: 'GeometryEngine';
    title: string;
    description: string;
    category: string;
    object: {
        label: string;
        dimensions: DimensionInput[];
        color: string;
    };
    container: {
        label: string;
        dimensions: DimensionInput[];
        color: string;
    };
    marginRequired?: number; // Minimum margin in cm
    successMessage: string;
    failureMessage: string;
    relatedProducts?: {
        categoryId: string;
    };
    // Smart Fallback - shown when fit fails
    failAction?: {
        message: string;       // e.g., "Ficou grande demais para o seu espaço."
        buttonText: string;    // e.g., "Ver modelos menores compatíveis"
        // Template string with placeholders: {containerWidth}, {containerHeight}, {containerDepth}
        linkTemplate: string;  // e.g., "/categorias/smart-tvs?max_width={containerWidth}"
    };
}

export interface ComparisonEngineConfig {
    id: string;
    engine: 'ComparisonEngine';
    type: 'image-slider' | 'audio-switch';
    title: string;
    description?: string;
    category: string;
    media: {
        before: string;      // URL to before image/audio
        after: string;       // URL to after image/audio
        labelBefore: string; // e.g., "LED Comum"
        labelAfter: string;  // e.g., "OLED (Preto Infinito)"
    };
    cta?: {
        productName: string; // e.g., "OLED"
        url: string;         // Affiliate link
    };
    relatedProducts?: {
        categoryId: string;
    };
}

export interface LogicEngineConfig {
    id: string;
    engine: 'LogicEngine';
    title: string;
    description?: string;
    category: string;
    categories: {
        id: string;
        label: string;
        items: {
            id: string;
            name: string;
            subtitle?: string;
            specs: Record<string, string | number | boolean>;
        }[];
    }[];
    rules: {
        targetCategory: string;
        targetSpec: string;
        sourceCategory: string;
        sourceSpec: string;
        condition: 'equals' | 'notEquals' | 'greaterThan' | 'greaterThanOrEquals' | 'lessThan' | 'contains';
        errorMessage: string;
        severity?: 'error' | 'warning';
    }[];
}

export interface QuizEngineConfig {
    id: string;
    engine: 'QuizEngine';
    title: string;
    description?: string;
    category: string;
    questions: {
        id: string;
        text: string;
        subtitle?: string;
        options: {
            id: string;
            text: string;
            description?: string;
            emoji?: string;
            points?: Record<string, number>; // profileId -> points
        }[];
    }[];
    profiles: {
        id: string;
        name: string;
        emoji?: string;
        description?: string;
        recommendedProducts?: {
            name: string;
            url: string;
            imageUrl?: string;
            price?: number;
            reason?: string;
        }[];
    }[];
}

export type ToolConfig = RateEngineConfig | GeometryEngineConfig | ComparisonEngineConfig | LogicEngineConfig | QuizEngineConfig;

// ============================================
// RATE ENGINE CONFIGURATIONS
// ============================================

export const CALCULADORA_BTU: RateEngineConfig = {
    id: 'calculadora-btu',
    engine: 'RateEngine',
    title: 'Calculadora de BTU',
    description: 'Descubra a potência ideal do ar-condicionado para seu ambiente',
    category: 'ar-condicionado',
    inputs: [
        {
            id: 'area',
            label: 'Área do ambiente',
            type: 'slider',
            defaultValue: 15,
            min: 5,
            max: 100,
            step: 1,
            unit: 'm²',
            multiplier: 600,
        },
        {
            id: 'pessoas',
            label: 'Quantidade de pessoas',
            type: 'slider',
            defaultValue: 2,
            min: 1,
            max: 20,
            step: 1,
            multiplier: 600,
        },
        {
            id: 'sol',
            label: 'Recebe sol da tarde?',
            type: 'boolean',
            defaultValue: false,
            bonus: 800,
        },
        {
            id: 'eletronicos',
            label: 'Tem muitos eletrônicos?',
            type: 'boolean',
            defaultValue: false,
            bonus: 600,
        },
        {
            id: 'andar',
            label: 'Andar do apartamento',
            type: 'select',
            defaultValue: 'baixo',
            options: [
                { value: 'baixo', label: 'Térreo ou baixo' },
                { value: 'medio', label: 'Intermediário' },
                { value: 'alto', label: 'Último andar / Cobertura' },
            ],
        },
    ],
    formula: '(area * 600) + (pessoas * 600) + (sol ? 800 : 0) + (eletronicos ? 600 : 0) + (andar === "alto" ? 1000 : 0)',
    resultLabel: 'BTUs Recomendados',
    resultUnit: 'BTU/h',
    recommendations: [
        { threshold: 9000, operator: 'lte', text: 'Modelos de 9.000 BTU são suficientes para seu ambiente.' },
        { threshold: 12000, operator: 'lte', text: 'Recomendamos um modelo de 12.000 BTU.' },
        { threshold: 18000, operator: 'lte', text: 'Você precisa de um modelo de 18.000 BTU ou superior.' },
        { threshold: 24000, operator: 'lte', text: 'Considere um modelo de 24.000 BTU para melhor desempenho.' },
        { threshold: 24001, operator: 'gte', text: 'Para ambientes grandes, considere múltiplos aparelhos ou um modelo central.' },
    ],
    relatedProducts: {
        categoryId: 'air_conditioner',
    },
};

export const CALCULADORA_PSU: RateEngineConfig = {
    id: 'calculadora-fonte-pc',
    engine: 'RateEngine',
    title: 'Calculadora de Fonte/PSU',
    description: 'Calcule a potência necessária para sua fonte de PC',
    category: 'hardware',
    inputs: [
        {
            id: 'cpu',
            label: 'TDP do Processador',
            type: 'select',
            defaultValue: 65,
            options: [
                { value: 35, label: 'Intel i3/i5 low-power (35W)' },
                { value: 65, label: 'Intel i5/i7 ou AMD Ryzen 5 (65W)' },
                { value: 95, label: 'Intel i7/i9 ou AMD Ryzen 7 (95W)' },
                { value: 125, label: 'Intel i9 ou AMD Ryzen 9 (125W)' },
                { value: 170, label: 'Intel i9 Extreme (170W+)' },
            ],
        },
        {
            id: 'gpu',
            label: 'Placa de Vídeo',
            type: 'select',
            defaultValue: 150,
            options: [
                { value: 0, label: 'Integrada (sem GPU dedicada)' },
                { value: 75, label: 'GTX 1650 / RX 6500 (75W)' },
                { value: 150, label: 'RTX 3060 / RX 6600 (150W)' },
                { value: 220, label: 'RTX 3070 / RX 6700 (220W)' },
                { value: 320, label: 'RTX 3080 / RX 6800 (320W)' },
                { value: 450, label: 'RTX 4090 / RX 7900 (450W)' },
            ],
        },
        {
            id: 'ram',
            label: 'Quantidade de RAM',
            type: 'select',
            defaultValue: 16,
            options: [
                { value: 8, label: '8GB' },
                { value: 16, label: '16GB' },
                { value: 32, label: '32GB' },
                { value: 64, label: '64GB+' },
            ],
        },
        {
            id: 'storage',
            label: 'Armazenamento',
            type: 'select',
            defaultValue: 1,
            options: [
                { value: 1, label: '1 SSD NVMe' },
                { value: 2, label: '2 SSDs' },
                { value: 3, label: 'SSD + HDD' },
                { value: 4, label: 'Múltiplos drives (4+)' },
            ],
        },
        {
            id: 'margem',
            label: 'Margem de segurança (%)',
            type: 'slider',
            defaultValue: 20,
            min: 10,
            max: 50,
            step: 5,
            unit: '%',
        },
    ],
    formula: 'Math.round((cpu + gpu + (ram * 3) + (storage * 10) + 50) * (1 + margem / 100))',
    resultLabel: 'Fonte Recomendada',
    resultUnit: 'W',
    recommendations: [
        { threshold: 400, operator: 'lte', text: 'Uma fonte de 450W é suficiente.' },
        { threshold: 550, operator: 'lte', text: 'Recomendamos uma fonte de 550W ou 600W.' },
        { threshold: 750, operator: 'lte', text: 'Você precisa de uma fonte de 750W ou superior.' },
        { threshold: 850, operator: 'lte', text: 'Recomendamos uma fonte de 850W de qualidade.' },
        { threshold: 851, operator: 'gte', text: 'Para builds extremos, considere 1000W+ com certificação 80 Plus Gold.' },
    ],
};

// ============================================
// GEOMETRY ENGINE CONFIGURATIONS
// ============================================

export const TV_CABE_ESTANTE: GeometryEngineConfig = {
    id: 'tv-cabe-estante',
    engine: 'GeometryEngine',
    title: 'A TV cabe na estante?',
    description: 'Verifique se sua nova TV vai caber no móvel',
    category: 'tv',
    object: {
        label: 'TV',
        dimensions: [
            { id: 'width', label: 'Largura da TV', unit: 'cm', defaultValue: 145, min: 50, max: 250 },
            { id: 'height', label: 'Altura da TV', unit: 'cm', defaultValue: 84, min: 30, max: 150 },
            { id: 'depth', label: 'Profundidade (com base)', unit: 'cm', defaultValue: 28, min: 5, max: 50 },
        ],
        color: '#3B82F6', // blue
    },
    container: {
        label: 'Estante/Rack',
        dimensions: [
            { id: 'width', label: 'Largura do espaço', unit: 'cm', defaultValue: 160, min: 50, max: 300 },
            { id: 'height', label: 'Altura disponível', unit: 'cm', defaultValue: 100, min: 30, max: 200 },
            { id: 'depth', label: 'Profundidade', unit: 'cm', defaultValue: 40, min: 10, max: 80 },
        ],
        color: '#10B981', // emerald
    },
    marginRequired: 2, // 2cm de folga mínima
    successMessage: '✅ A TV cabe! Você terá {margin}cm de folga em cada lado.',
    failureMessage: '❌ A TV não cabe. Faltam {missing}cm de largura.',
    relatedProducts: {
        categoryId: 'tv',
    },
    failAction: {
        message: 'Esta TV é grande demais para o seu móvel.',
        buttonText: 'Ver TVs menores que cabem',
        linkTemplate: '/categorias/smart-tvs?max_width={containerWidth}',
    },
};

export const GELADEIRA_PASSA_PORTA: GeometryEngineConfig = {
    id: 'geladeira-passa-porta',
    engine: 'GeometryEngine',
    title: 'A geladeira passa na porta?',
    description: 'Verifique se consegue passar a geladeira pela entrada',
    category: 'geladeira',
    object: {
        label: 'Geladeira',
        dimensions: [
            { id: 'width', label: 'Largura da geladeira', unit: 'cm', defaultValue: 90, min: 50, max: 150 },
            { id: 'height', label: 'Altura da geladeira', unit: 'cm', defaultValue: 180, min: 100, max: 220 },
            { id: 'depth', label: 'Profundidade', unit: 'cm', defaultValue: 75, min: 40, max: 100 },
        ],
        color: '#6366F1', // indigo
    },
    container: {
        label: 'Porta/Passagem',
        dimensions: [
            { id: 'width', label: 'Largura da porta', unit: 'cm', defaultValue: 80, min: 60, max: 150 },
            { id: 'height', label: 'Altura da porta', unit: 'cm', defaultValue: 210, min: 180, max: 280 },
        ],
        color: '#F59E0B', // amber
    },
    marginRequired: 5, // 5cm de folga mínima para manobrar
    successMessage: '✅ A geladeira passa! Você terá {margin}cm de folga.',
    failureMessage: '❌ A geladeira não passa. A porta é {missing}cm mais estreita que necessário.',
    relatedProducts: {
        categoryId: 'fridge',
    },
    failAction: {
        message: 'Esta geladeira não passa na sua porta.',
        buttonText: 'Ver geladeiras mais estreitas',
        linkTemplate: '/categorias/geladeiras?max_width={containerWidth}',
    },
};

// ============================================
// ADDITIONAL GEOMETRY TOOLS
// ============================================

export const MONITOR_CABE_MESA: GeometryEngineConfig = {
    id: 'monitor-cabe-mesa',
    engine: 'GeometryEngine',
    title: 'O monitor cabe na mesa?',
    description: 'Verifique se o monitor cabe no seu espaço de trabalho',
    category: 'monitor',
    object: {
        label: 'Monitor',
        dimensions: [
            { id: 'width', label: 'Largura do monitor (com base)', unit: 'cm', defaultValue: 61, min: 40, max: 120 },
            { id: 'height', label: 'Altura do monitor', unit: 'cm', defaultValue: 45, min: 30, max: 80 },
            { id: 'depth', label: 'Profundidade (base)', unit: 'cm', defaultValue: 20, min: 10, max: 40 },
        ],
        color: '#3B82F6',
    },
    container: {
        label: 'Mesa',
        dimensions: [
            { id: 'width', label: 'Largura disponível', unit: 'cm', defaultValue: 120, min: 60, max: 200 },
            { id: 'height', label: 'Altura até prateleira', unit: 'cm', defaultValue: 50, min: 35, max: 100 },
            { id: 'depth', label: 'Profundidade', unit: 'cm', defaultValue: 60, min: 40, max: 100 },
        ],
        color: '#10B981',
    },
    marginRequired: 3,
    successMessage: '✅ O monitor cabe! Você terá {margin}cm de folga.',
    failureMessage: '❌ O monitor não cabe. Faltam {missing}cm.',
    relatedProducts: {
        categoryId: 'monitor',
    },
};

export const NOTEBOOK_CABE_MOCHILA: GeometryEngineConfig = {
    id: 'notebook-cabe-mochila',
    engine: 'GeometryEngine',
    title: 'O notebook cabe na mochila?',
    description: 'Verifique se o notebook cabe no compartimento da mochila',
    category: 'notebook',
    object: {
        label: 'Notebook',
        dimensions: [
            { id: 'width', label: 'Largura do notebook', unit: 'cm', defaultValue: 36, min: 28, max: 45 },
            { id: 'height', label: 'Altura (fechado)', unit: 'cm', defaultValue: 2.5, min: 1, max: 5 },
            { id: 'depth', label: 'Profundidade', unit: 'cm', defaultValue: 25, min: 18, max: 35 },
        ],
        color: '#6366F1',
    },
    container: {
        label: 'Compartimento da Mochila',
        dimensions: [
            { id: 'width', label: 'Largura do compartimento', unit: 'cm', defaultValue: 40, min: 30, max: 50 },
            { id: 'height', label: 'Espessura máxima', unit: 'cm', defaultValue: 5, min: 2, max: 10 },
            { id: 'depth', label: 'Altura do compartimento', unit: 'cm', defaultValue: 30, min: 25, max: 45 },
        ],
        color: '#F59E0B',
    },
    marginRequired: 1,
    successMessage: '✅ O notebook cabe! Você terá {margin}cm de folga.',
    failureMessage: '❌ O notebook não cabe. Faltam {missing}cm.',
    relatedProducts: {
        categoryId: 'notebook',
    },
};

export const LAVADORA_PASSA_PORTA: GeometryEngineConfig = {
    id: 'lavadora-passa-porta',
    engine: 'GeometryEngine',
    title: 'A lavadora passa na porta?',
    description: 'Verifique se consegue passar a lavadora pela entrada',
    category: 'lavadora',
    object: {
        label: 'Lavadora',
        dimensions: [
            { id: 'width', label: 'Largura da lavadora', unit: 'cm', defaultValue: 65, min: 50, max: 80 },
            { id: 'height', label: 'Altura da lavadora', unit: 'cm', defaultValue: 110, min: 80, max: 130 },
            { id: 'depth', label: 'Profundidade', unit: 'cm', defaultValue: 65, min: 50, max: 80 },
        ],
        color: '#8B5CF6',
    },
    container: {
        label: 'Porta/Passagem',
        dimensions: [
            { id: 'width', label: 'Largura da porta', unit: 'cm', defaultValue: 80, min: 60, max: 150 },
            { id: 'height', label: 'Altura da porta', unit: 'cm', defaultValue: 210, min: 180, max: 280 },
        ],
        color: '#F59E0B',
    },
    marginRequired: 3,
    successMessage: '✅ A lavadora passa! Você terá {margin}cm de folga.',
    failureMessage: '❌ A lavadora não passa. A porta é {missing}cm mais estreita.',
    relatedProducts: {
        categoryId: 'lavadora',
    },
};

export const ROBO_PASSA_MOVEL: GeometryEngineConfig = {
    id: 'robo-passa-movel',
    engine: 'GeometryEngine',
    title: 'Robô passa sob os móveis?',
    description: 'Verifique se o robô consegue limpar embaixo de sofás e camas',
    category: 'robot-vacuum',
    object: {
        label: 'Robô Aspirador',
        dimensions: [
            { id: 'width', label: 'Diâmetro do robô', unit: 'cm', defaultValue: 33, min: 25, max: 45 },
            { id: 'height', label: 'Altura do robô', unit: 'cm', defaultValue: 7.5, min: 5, max: 12 },
        ],
        color: '#10B981', // emerald
    },
    container: {
        label: 'Vão sob o Móvel',
        dimensions: [
            { id: 'width', label: 'Largura mínima de passagem', unit: 'cm', defaultValue: 40, min: 30, max: 100 },
            { id: 'height', label: 'Altura do vão', unit: 'cm', defaultValue: 10, min: 5, max: 25 },
        ],
        color: '#6366F1', // indigo
    },
    marginRequired: 0.5, // 0.5cm de folga mínima
    successMessage: '✅ O robô passa! Com {margin}cm de folga, ele limpa sob esse móvel.',
    failureMessage: '❌ O robô não passa. Faltam {missing}cm de altura no vão.',
    relatedProducts: {
        categoryId: 'robot-vacuum',
    },
    failAction: {
        message: 'Este robô é alto demais para seus móveis.',
        buttonText: 'Ver robôs mais baixos',
        linkTemplate: '/categorias/robo-aspirador?max_height={containerHeight}',
    },
};

export const ROBO_COBERTURA_LIMPEZA: RateEngineConfig = {
    id: 'robo-cobertura-limpeza',
    engine: 'RateEngine',
    title: 'Calculadora de Cobertura de Limpeza',
    description: 'Calcule quantos cômodos o robô consegue limpar por carga',
    category: 'robot-vacuum',
    inputs: [
        {
            id: 'autonomia',
            label: 'Autonomia do robô (minutos)',
            type: 'slider',
            defaultValue: 180,
            min: 60,
            max: 300,
            step: 10,
            unit: 'min',
        },
        {
            id: 'areaPorComodo',
            label: 'Área média por cômodo',
            type: 'slider',
            defaultValue: 15,
            min: 8,
            max: 30,
            step: 1,
            unit: 'm²',
        },
        {
            id: 'modoPotente',
            label: 'Modo potência máxima?',
            type: 'boolean',
            defaultValue: false,
            bonus: -0.5,
        },
        {
            id: 'obstaculo',
            label: 'Nível de obstáculos',
            type: 'select',
            defaultValue: 1,
            options: [
                { value: 1.2, label: 'Poucos (minimalista)' },
                { value: 1, label: 'Normal' },
                { value: 0.8, label: 'Muitos (casa cheia de móveis)' },
            ],
        },
    ],
    formula: 'Math.floor((autonomia * (modoPotente ? 0.5 : 1) * obstaculo) / areaPorComodo)',
    resultLabel: 'Cômodos por Carga',
    resultUnit: 'cômodos',
    recommendations: [
        { threshold: 3, operator: 'lte', text: 'O robô limpa poucos cômodos por carga. Considere recarregar entre usos.' },
        { threshold: 6, operator: 'lte', text: 'Cobertura moderada. Ideal para apartamentos médios.' },
        { threshold: 10, operator: 'lte', text: 'Boa cobertura! Limpa uma casa inteira em uma carga.' },
        { threshold: 11, operator: 'gte', text: 'Excelente autonomia! Limpa casas grandes sem recarregar.' },
    ],
    relatedProducts: {
        categoryId: 'robot-vacuum',
    },
};

// ============================================
// ADDITIONAL RATE ENGINE TOOLS
// ============================================

export const CALCULADORA_CAPACIDADE_LAVADORA: RateEngineConfig = {
    id: 'calculadora-capacidade-lavadora',
    engine: 'RateEngine',
    title: 'Calculadora de Capacidade de Lavadora',
    description: 'Descubra a capacidade ideal (kg) para sua família',
    category: 'lavadora',
    inputs: [
        {
            id: 'pessoas',
            label: 'Quantidade de pessoas',
            type: 'slider',
            defaultValue: 4,
            min: 1,
            max: 10,
            step: 1,
            multiplier: 2,
        },
        {
            id: 'frequencia',
            label: 'Lavagens por semana',
            type: 'select',
            defaultValue: 2,
            options: [
                { value: 1, label: '1x por semana' },
                { value: 2, label: '2x por semana' },
                { value: 3, label: '3x ou mais por semana' },
            ],
        },
        {
            id: 'roupasGrandes',
            label: 'Lava edredons/cobertores?',
            type: 'boolean',
            defaultValue: false,
            bonus: 4,
        },
        {
            id: 'animais',
            label: 'Tem animais de estimação?',
            type: 'boolean',
            defaultValue: false,
            bonus: 2,
        },
    ],
    formula: 'Math.max(8, Math.round((pessoas * 2) / (frequencia * 0.5) + (roupasGrandes ? 4 : 0) + (animais ? 2 : 0)))',
    resultLabel: 'Capacidade Recomendada',
    resultUnit: 'kg',
    recommendations: [
        { threshold: 10, operator: 'lte', text: 'Uma lavadora de 10kg é ideal para sua família.' },
        { threshold: 12, operator: 'lte', text: 'Recomendamos uma lavadora de 12kg.' },
        { threshold: 15, operator: 'lte', text: 'Uma lavadora de 15kg atende bem suas necessidades.' },
        { threshold: 16, operator: 'gte', text: 'Para famílias grandes, considere 17kg ou superior.' },
    ],
    relatedProducts: {
        categoryId: 'lavadora',
    },
};

export const CALCULADORA_TAMANHO_MONITOR: RateEngineConfig = {
    id: 'calculadora-tamanho-monitor',
    engine: 'RateEngine',
    title: 'Calculadora de Tamanho de Monitor',
    description: 'Descubra o tamanho ideal de monitor para sua distância',
    category: 'monitor',
    inputs: [
        {
            id: 'distancia',
            label: 'Distância dos olhos à tela',
            type: 'slider',
            defaultValue: 60,
            min: 40,
            max: 120,
            step: 5,
            unit: 'cm',
        },
        {
            id: 'uso',
            label: 'Uso principal',
            type: 'select',
            defaultValue: 1,
            options: [
                { value: 0.8, label: 'Programação/Texto' },
                { value: 1, label: 'Uso geral' },
                { value: 1.2, label: 'Design/Edição' },
                { value: 1.3, label: 'Gaming' },
            ],
        },
        {
            id: 'resolucao',
            label: 'Resolução desejada',
            type: 'select',
            defaultValue: 1,
            options: [
                { value: 0.9, label: 'Full HD (1080p)' },
                { value: 1, label: '2K (1440p)' },
                { value: 1.15, label: '4K (2160p)' },
            ],
        },
    ],
    formula: 'Math.round((distancia * 0.45) * uso * resolucao)',
    resultLabel: 'Tamanho Ideal',
    resultUnit: 'polegadas',
    recommendations: [
        { threshold: 24, operator: 'lte', text: 'Um monitor de 24" é ideal para seu espaço.' },
        { threshold: 27, operator: 'lte', text: 'Recomendamos um monitor de 27".' },
        { threshold: 32, operator: 'lte', text: 'Um monitor de 32" oferece boa imersão.' },
        { threshold: 33, operator: 'gte', text: 'Considere um monitor ultrawide ou 34"+.' },
    ],
    relatedProducts: {
        categoryId: 'monitor',
    },
};

// ============================================
// COMPARISON ENGINE CONFIGURATIONS
// ============================================

export const OLED_VS_LED: ComparisonEngineConfig = {
    id: 'oled-vs-led',
    engine: 'ComparisonEngine',
    type: 'image-slider',
    title: 'Diferença do Preto Real',
    description: 'Arraste para ver a diferença entre LED cinza e OLED com preto infinito',
    category: 'tv',
    media: {
        before: '/simulations/led-gray.jpg',
        after: '/simulations/oled-black.jpg',
        labelBefore: 'Modo Padrão (LED)',
        labelAfter: 'Modo Cinema (OLED)',
    },
    cta: {
        productName: 'OLED',
        url: '/categorias/smart-tvs?filter=oled',
    },
    relatedProducts: {
        categoryId: 'tv',
    },
};

export const HDR_COMPARISON: ComparisonEngineConfig = {
    id: 'hdr-vs-sdr',
    engine: 'ComparisonEngine',
    type: 'image-slider',
    title: 'HDR vs SDR: Veja a diferença',
    description: 'Compare o alcance dinâmico estendido em cenas com sol e sombra',
    category: 'tv',
    media: {
        before: '/simulations/sdr-landscape.jpg',
        after: '/simulations/hdr-landscape.jpg',
        labelBefore: 'Modo Padrão (SDR)',
        labelAfter: 'Modo Cinema (HDR10+)',
    },
    cta: {
        productName: 'HDR Premium',
        url: '/categorias/smart-tvs?filter=hdr',
    },
    relatedProducts: {
        categoryId: 'tv',
    },
};

export const SOUNDBAR_VS_TV: ComparisonEngineConfig = {
    id: 'soundbar-vs-tv',
    engine: 'ComparisonEngine',
    type: 'audio-switch',
    title: 'Som da TV vs Soundbar',
    description: 'Alterne entre os áudios para sentir a diferença de graves e clareza',
    category: 'soundbar',
    media: {
        before: '/simulations/audio-tv-speakers.mp3',
        after: '/simulations/audio-soundbar.mp3',
        labelBefore: 'Modo Compacto (TV 20W)',
        labelAfter: 'Modo Imersivo (Soundbar 300W)',
    },
    cta: {
        productName: 'Soundbar',
        url: '/categorias/soundbars',
    },
    relatedProducts: {
        categoryId: 'soundbar',
    },
};

export const ANC_HEADPHONES: ComparisonEngineConfig = {
    id: 'anc-vs-normal',
    engine: 'ComparisonEngine',
    type: 'audio-switch',
    title: 'Cancelamento de Ruído: Antes e Depois',
    description: 'Ouça como o ANC elimina o ruído ambiente',
    category: 'headphones',
    media: {
        before: '/simulations/audio-no-anc.mp3',
        after: '/simulations/audio-with-anc.mp3',
        labelBefore: 'Sem ANC',
        labelAfter: 'Com ANC Ativo',
    },
    cta: {
        productName: 'Fone ANC',
        url: '/categorias/fones-bluetooth?filter=anc',
    },
    relatedProducts: {
        categoryId: 'headphones',
    },
};

// ============================================
// LOGIC ENGINE CONFIGURATIONS
// ============================================

export const CPU_MOTHERBOARD_COMPATIBILITY: LogicEngineConfig = {
    id: 'cpu-motherboard-compatibility',
    engine: 'LogicEngine',
    title: 'Verificar Compatibilidade: CPU + Placa-Mãe',
    description: 'Verifique se o processador é compatível com sua placa-mãe',
    category: 'hardware',
    categories: [
        {
            id: 'cpu',
            label: 'Processador',
            items: [
                {
                    id: 'ryzen-5-5600x',
                    name: 'AMD Ryzen 5 5600X',
                    subtitle: '6 núcleos, 12 threads, 3.7GHz',
                    specs: { socket: 'AM4', tdp: 65, generation: 'Zen 3' },
                },
                {
                    id: 'ryzen-7-7800x3d',
                    name: 'AMD Ryzen 7 7800X3D',
                    subtitle: '8 núcleos, 16 threads, 4.2GHz',
                    specs: { socket: 'AM5', tdp: 120, generation: 'Zen 4' },
                },
                {
                    id: 'intel-i5-12400f',
                    name: 'Intel Core i5-12400F',
                    subtitle: '6 núcleos, 12 threads, 2.5GHz',
                    specs: { socket: 'LGA1700', tdp: 65, generation: '12th Gen' },
                },
                {
                    id: 'intel-i7-14700k',
                    name: 'Intel Core i7-14700K',
                    subtitle: '20 núcleos, 28 threads, 3.4GHz',
                    specs: { socket: 'LGA1700', tdp: 125, generation: '14th Gen' },
                },
            ],
        },
        {
            id: 'motherboard',
            label: 'Placa-Mãe',
            items: [
                {
                    id: 'b550-tomahawk',
                    name: 'MSI B550 Tomahawk',
                    subtitle: 'Socket AM4, DDR4',
                    specs: { socket: 'AM4', memoryType: 'DDR4', maxTdp: 105 },
                },
                {
                    id: 'x670e-hero',
                    name: 'ASUS ROG X670E Hero',
                    subtitle: 'Socket AM5, DDR5',
                    specs: { socket: 'AM5', memoryType: 'DDR5', maxTdp: 170 },
                },
                {
                    id: 'b660-mortar',
                    name: 'MSI MAG B660M Mortar',
                    subtitle: 'Socket LGA1700, DDR5',
                    specs: { socket: 'LGA1700', memoryType: 'DDR5', maxTdp: 125 },
                },
                {
                    id: 'z790-aorus',
                    name: 'Gigabyte Z790 Aorus Elite',
                    subtitle: 'Socket LGA1700, DDR5',
                    specs: { socket: 'LGA1700', memoryType: 'DDR5', maxTdp: 253 },
                },
            ],
        },
    ],
    rules: [
        {
            targetCategory: 'cpu',
            targetSpec: 'socket',
            sourceCategory: 'motherboard',
            sourceSpec: 'socket',
            condition: 'equals',
            errorMessage: '❌ Sockets incompatíveis: CPU usa {target} mas a placa-mãe usa {source}.',
            severity: 'error',
        },
        {
            targetCategory: 'cpu',
            targetSpec: 'tdp',
            sourceCategory: 'motherboard',
            sourceSpec: 'maxTdp',
            condition: 'lessThan',
            errorMessage: '⚠️ TDP do processador ({target}W) pode sobrecarregar a placa-mãe (suporta até {source}W).',
            severity: 'warning',
        },
    ],
};

// ============================================
// QUIZ ENGINE CONFIGURATIONS
// ============================================

export const QUIZ_COLCHAO_IDEAL: QuizEngineConfig = {
    id: 'quiz-colchao-ideal',
    engine: 'QuizEngine',
    title: 'Qual o Colchão Ideal para Você?',
    description: 'Responda 3 perguntas e descubra o tipo de colchão perfeito para sua noite de sono',
    category: 'colchoes',
    questions: [
        {
            id: 'posicao',
            text: 'Em qual posição você dorme mais?',
            options: [
                {
                    id: 'lado',
                    text: 'De lado',
                    emoji: '🛌',
                    description: 'Posição fetal ou esticado',
                    points: { 'macio': 3, 'medio': 2, 'firme': 0 },
                },
                {
                    id: 'costas',
                    text: 'De barriga para cima',
                    emoji: '😴',
                    description: 'Costas no colchão',
                    points: { 'macio': 1, 'medio': 3, 'firme': 2 },
                },
                {
                    id: 'brucos',
                    text: 'De bruços',
                    emoji: '🙃',
                    description: 'Barriga no colchão',
                    points: { 'macio': 0, 'medio': 1, 'firme': 3 },
                },
            ],
        },
        {
            id: 'peso',
            text: 'Qual é a sua faixa de peso?',
            options: [
                {
                    id: 'leve',
                    text: 'Até 60 kg',
                    emoji: '🪶',
                    points: { 'macio': 3, 'medio': 2, 'firme': 0 },
                },
                {
                    id: 'medio',
                    text: '60 a 90 kg',
                    emoji: '⚖️',
                    points: { 'macio': 1, 'medio': 3, 'firme': 2 },
                },
                {
                    id: 'pesado',
                    text: 'Acima de 90 kg',
                    emoji: '🏋️',
                    points: { 'macio': 0, 'medio': 1, 'firme': 3 },
                },
            ],
        },
        {
            id: 'dor',
            text: 'Você tem dores nas costas?',
            options: [
                {
                    id: 'nao',
                    text: 'Não tenho dores',
                    emoji: '😊',
                    points: { 'macio': 2, 'medio': 2, 'firme': 2 },
                },
                {
                    id: 'lombar',
                    text: 'Sim, dor lombar',
                    emoji: '🔻',
                    description: 'Na parte baixa das costas',
                    points: { 'macio': 0, 'medio': 2, 'firme': 3 },
                },
                {
                    id: 'cervical',
                    text: 'Sim, dor no pescoço',
                    emoji: '🔺',
                    description: 'Na região cervical',
                    points: { 'macio': 3, 'medio': 2, 'firme': 0 },
                },
            ],
        },
    ],
    profiles: [
        {
            id: 'macio',
            name: 'Colchão Macio',
            emoji: '☁️',
            description: 'Você precisa de um colchão que acomode seu corpo, ideal para quem dorme de lado ou tem peso mais leve.',
            recommendedProducts: [
                {
                    name: 'Colchão Ortobom Macio D33',
                    url: '/produto/colchao-ortobom-macio',
                    price: 899,
                    reason: 'Espuma D33 com camada pillow top',
                },
            ],
        },
        {
            id: 'medio',
            name: 'Colchão Médio',
            emoji: '⚖️',
            description: 'O equilíbrio perfeito entre conforto e suporte. Ideal para a maioria dos dormidores.',
            recommendedProducts: [
                {
                    name: 'Colchão Probel Pro Dormir Molas',
                    url: '/produto/colchao-probel-molas',
                    price: 1299,
                    reason: 'Sistema de molas ensacadas + espuma',
                },
            ],
        },
        {
            id: 'firme',
            name: 'Colchão Firme',
            emoji: '🏔️',
            description: 'Máximo suporte para sua coluna, recomendado para pessoas mais pesadas ou com dor lombar.',
            recommendedProducts: [
                {
                    name: 'Colchão Castor Firme D45',
                    url: '/produto/colchao-castor-firme',
                    price: 1099,
                    reason: 'Espuma D45 de alta densidade',
                },
            ],
        },
    ],
};

// ============================================
// TOOLS REGISTRY
// ============================================

export const TOOLS_REGISTRY: Record<string, ToolConfig> = {
    // Rate Engines
    'calculadora-btu': CALCULADORA_BTU,
    'calculadora-fonte-pc': CALCULADORA_PSU,
    'calculadora-capacidade-lavadora': CALCULADORA_CAPACIDADE_LAVADORA,
    'calculadora-tamanho-monitor': CALCULADORA_TAMANHO_MONITOR,
    // Geometry Engines
    'tv-cabe-estante': TV_CABE_ESTANTE,
    'geladeira-passa-porta': GELADEIRA_PASSA_PORTA,
    'monitor-cabe-mesa': MONITOR_CABE_MESA,
    'notebook-cabe-mochila': NOTEBOOK_CABE_MOCHILA,
    'lavadora-passa-porta': LAVADORA_PASSA_PORTA,
    // Comparison Engines
    'oled-vs-led': OLED_VS_LED,
    'hdr-vs-sdr': HDR_COMPARISON,
    'soundbar-vs-tv': SOUNDBAR_VS_TV,
    'anc-vs-normal': ANC_HEADPHONES,
    // Logic Engines
    'cpu-motherboard-compatibility': CPU_MOTHERBOARD_COMPATIBILITY,
    // Quiz Engines
    'quiz-colchao-ideal': QUIZ_COLCHAO_IDEAL,
};

export function getToolConfig(toolId: string): ToolConfig | null {
    return TOOLS_REGISTRY[toolId] || null;
}
