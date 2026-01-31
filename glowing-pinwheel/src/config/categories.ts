/**
 * Category Configurations - Rules Database
 * 
 * @description Each category defines its exact "10 Pain Criteria" with weights.
 * This is the source of truth for all scoring calculations.
 * 
 * IMPORTANT: Weights within each category must sum to 1.0
 */

import type { CategoryDefinition } from '@/types/category';

// ============================================
// SMART TVs - Based on Strategy Table
// ============================================

export const TV_CATEGORY: CategoryDefinition = {
    id: 'tv',
    name: 'Smart TVs',
    nameSingular: 'Smart TV',
    slug: 'smart-tvs',
    description: 'Compare as melhores Smart TVs 4K e 8K do mercado brasileiro.',
    icon: 'Tv',
    criteria: [
        {
            id: 'c1',
            label: 'Custo-Benefício Real',
            weight: 0.15,  // Reduced from 0.20 to fix weight sum
            group: 'VS', // Special flag for VS calculation
            description: 'Relação entre preço e qualidade entregue.',
            icon: 'PiggyBank',
        },
        {
            id: 'c2',
            label: 'Processamento de Imagem',
            weight: 0.15,
            group: 'QS',
            description: 'Upscaling, redução de ruído e tecnologias de IA.',
            icon: 'Cpu',
        },
        {
            id: 'c3',
            label: 'Confiabilidade/Hardware',
            weight: 0.10,  // Reduced from 0.15 to fix weight sum
            group: 'GS',
            description: 'Qualidade de construção e durabilidade.',
            icon: 'Shield',
        },
        {
            id: 'c4',
            label: 'Fluidez do Sistema',
            weight: 0.15,
            group: 'QS',
            description: 'Velocidade do SO, responsividade e apps.',
            icon: 'Zap',
        },
        {
            id: 'c5',
            label: 'Desempenho Game',
            weight: 0.10,
            group: 'QS',
            description: 'Input lag, VRR, ALLM e recursos gaming.',
            icon: 'Gamepad2',
        },
        {
            id: 'c6',
            label: 'Brilho e Reflexo',
            weight: 0.10,
            group: 'QS',
            description: 'Brilho máximo e tratamento anti-reflexo.',
            icon: 'Sun',
        },
        {
            id: 'c7',
            label: 'Pós-Venda e Reputação',
            weight: 0.10,
            group: 'GS',
            description: 'Garantia, assistência técnica e reputação da marca.',
            icon: 'HeadphonesIcon',
        },
        {
            id: 'c8',
            label: 'Qualidade de Som',
            weight: 0.05,
            group: 'QS',
            description: 'Áudio embutido, potência e tecnologias.',
            icon: 'Volume2',
        },
        {
            id: 'c9',
            label: 'Conectividade',
            weight: 0.05,
            group: 'QS',
            description: 'Portas HDMI/USB, Wi-Fi e recursos smart.',
            icon: 'Plug',
        },
        {
            id: 'c10',
            label: 'Design e Instalação',
            weight: 0.05,
            group: 'GS',
            description: 'Estética, acabamento e facilidade de instalação.',
            icon: 'Palette',
        },
    ],
    profiles: [
        {
            id: 'balanced',
            name: 'Equilibrado',
            description: 'Para quem busca o melhor de tudo.',
            icon: '⚖️',
            weightOverrides: {},
        },
        {
            id: 'gamer',
            name: 'Gamer',
            description: 'Prioriza input lag baixo e VRR.',
            icon: '🎮',
            weightOverrides: {
                c5: 0.25, // Gaming +
                c4: 0.15, // Fluidez =
                c2: 0.12, // Processamento -
                c8: 0.03, // Som -
            },
        },
        {
            id: 'cinema',
            name: 'Cinéfilo',
            description: 'Foco em qualidade de imagem e HDR.',
            icon: '🎬',
            weightOverrides: {
                c2: 0.22, // Processamento +
                c6: 0.15, // Brilho +
                c5: 0.05, // Gaming -
            },
        },
        {
            id: 'budget',
            name: 'Econômico',
            description: 'Máximo custo-benefício.',
            icon: '💰',
            weightOverrides: {
                c1: 0.30, // Custo-benefício +
                c7: 0.12, // Pós-venda +
                c2: 0.10, // Processamento -
            },
        },
    ],
};

// ============================================
// GELADEIRAS / REFRIGERADORES - Example Category
// ============================================

export const FRIDGE_CATEGORY: CategoryDefinition = {
    id: 'fridge',
    name: 'Geladeiras',
    nameSingular: 'Geladeira',
    slug: 'geladeiras',
    description: 'Compare as melhores geladeiras e refrigeradores do Brasil.',
    icon: 'Refrigerator',
    criteria: [
        {
            id: 'c1',
            label: 'Custo-Benefício Real',
            weight: 0.20,
            group: 'VS',
            description: 'Preço vs. recursos e qualidade.',
            icon: 'PiggyBank',
        },
        {
            id: 'c2',
            label: 'Eficiência Energética',
            weight: 0.18,
            group: 'QS',
            description: 'Selo Procel, consumo em kWh/mês.',
            icon: 'Leaf',
        },
        {
            id: 'c3',
            label: 'Capacidade e Espaço',
            weight: 0.15,
            group: 'QS',
            description: 'Litros totais, organização interna e flexibilidade.',
            icon: 'Package',
        },
        {
            id: 'c4',
            label: 'Sistema de Refrigeração',
            weight: 0.12,
            group: 'QS',
            description: 'Frost Free, Twin Cooling, tecnologia inverter.',
            icon: 'Snowflake',
        },
        {
            id: 'c5',
            label: 'Confiabilidade',
            weight: 0.10,
            group: 'GS',
            description: 'Durabilidade, histórico de falhas e garantia.',
            icon: 'Shield',
        },
        {
            id: 'c6',
            label: 'Nível de Ruído',
            weight: 0.05,
            group: 'QS',
            description: 'Decibéis em operação normal.',
            icon: 'VolumeX',
        },
        {
            id: 'c7',
            label: 'Pós-Venda e Suporte',
            weight: 0.08,
            group: 'GS',
            description: 'Rede de assistência e reputação.',
            icon: 'HeadphonesIcon',
        },
        {
            id: 'c8',
            label: 'Recursos Smart',
            weight: 0.02,
            group: 'QS',
            description: 'Conectividade, display e recursos inteligentes.',
            icon: 'Wifi',
        },
        {
            id: 'c9',
            label: 'Design e Acabamento',
            weight: 0.05,
            group: 'GS',
            description: 'Estética, material e integração na cozinha.',
            icon: 'Sparkles',
        },
        {
            id: 'c10',
            label: 'Funcionalidades Extras',
            weight: 0.05,
            group: 'GS',
            description: 'Dispenser, gavetas especiais, zona flexível.',
            icon: 'Settings',
        },
    ],
    profiles: [
        {
            id: 'balanced',
            name: 'Equilibrado',
            description: 'Para quem busca o melhor de tudo.',
            icon: '⚖️',
            weightOverrides: {},
        },
        {
            id: 'eco',
            name: 'Econômico',
            description: 'Foco em eficiência energética e custo.',
            icon: '🌱',
            weightOverrides: {
                c2: 0.25, // Eficiência +
                c1: 0.25, // Custo-benefício +
                c8: 0.01, // Smart -
                c9: 0.02, // Design -
            },
        },
        {
            id: 'family',
            name: 'Família Grande',
            description: 'Máxima capacidade e organização.',
            icon: '👨‍👩‍👧‍👦',
            weightOverrides: {
                c3: 0.25, // Capacidade +
                c4: 0.18, // Refrigeração +
                c8: 0.01, // Smart -
            },
        },
    ],
};

// ============================================
// CATEGORY REGISTRY
// ============================================

// ============================================
// AR CONDICIONADO - Tier 1 Category
// ============================================

export const AC_CATEGORY: CategoryDefinition = {
    id: 'air_conditioner',
    name: 'Ar Condicionado',
    nameSingular: 'Ar Condicionado',
    slug: 'ar-condicionados',
    description: 'Compare os melhores ar condicionados Split e Inverter do Brasil.',
    icon: 'Wind',
    criteria: [
        { id: 'c1', label: 'Custo-Benefício', weight: 0.18, group: 'VS', description: 'Preço vs. BTUs e recursos.', icon: 'PiggyBank' },
        { id: 'c2', label: 'Eficiência Energética', weight: 0.18, group: 'QS', description: 'Selo Procel, economia na conta de luz.', icon: 'Leaf' },
        { id: 'c3', label: 'Capacidade de Refrigeração', weight: 0.12, group: 'QS', description: 'BTUs e cobertura de área.', icon: 'Snowflake' },
        { id: 'c4', label: 'Durabilidade', weight: 0.10, group: 'GS', description: 'Qualidade de materiais e compressor.', icon: 'Shield' },
        { id: 'c5', label: 'Nível de Ruído', weight: 0.10, group: 'QS', description: 'Decibéis da unidade interna.', icon: 'Volume' },
        { id: 'c6', label: 'Tecnologia Inverter', weight: 0.10, group: 'QS', description: 'Inverter, Dual Inverter, convencional.', icon: 'Cpu' },
        { id: 'c7', label: 'Filtros de Ar', weight: 0.06, group: 'QS', description: 'Anti-bacteriano, ionizador, HEPA.', icon: 'Wind' },
        { id: 'c8', label: 'Facilidade de Instalação', weight: 0.06, group: 'GS', description: 'Peso, dimensões, complexidade.', icon: 'Wrench' },
        { id: 'c9', label: 'Conectividade', weight: 0.05, group: 'QS', description: 'WiFi, app, controle por voz.', icon: 'Wifi' },
        { id: 'c10', label: 'Design', weight: 0.05, group: 'GS', description: 'Estética e acabamento.', icon: 'Palette' },
    ],
};

// ============================================
// SMARTPHONES - 10 Dores Brasil (Jan 2026)
// ============================================

export const SMARTPHONE_CATEGORY: CategoryDefinition = {
    id: 'smartphone',
    name: 'Smartphones',
    nameSingular: 'Smartphone',
    slug: 'smartphones',
    description: 'Compare os melhores smartphones com foco em autonomia real, custo-benefício e câmera social.',
    icon: 'Smartphone',
    criteria: [
        { id: 'c1', label: 'Autonomia Real', weight: 0.20, group: 'QS', description: 'Duração real da bateria, eficiência e carregamento.', icon: 'Battery' },
        { id: 'c2', label: 'Software', weight: 0.15, group: 'QS', description: 'Interface fluida, updates e ausência de bloatware.', icon: 'Cpu' },
        { id: 'c3', label: 'Custo-Benefício', weight: 0.15, group: 'VS', description: 'Retenção de valor e liquidez de revenda.', icon: 'TrendingUp' },
        { id: 'c4', label: 'Câmera Social', weight: 0.10, group: 'QS', description: 'Qualidade para Instagram/TikTok, OIS e noturnas.', icon: 'Camera' },
        { id: 'c5', label: 'Resiliência', weight: 0.10, group: 'QS', description: 'IP67/68, Gorilla Glass e construção robusta.', icon: 'Shield' },
        { id: 'c6', label: 'Tela', weight: 0.08, group: 'QS', description: 'Brilho para sol forte, 120Hz AMOLED.', icon: 'MonitorSmartphone' },
        { id: 'c7', label: 'Pós-Venda', weight: 0.08, group: 'VS', description: 'Garantia nacional e rede de assistência.', icon: 'HeadphonesIcon' },
        { id: 'c8', label: 'Conectividade', weight: 0.07, group: 'GS', description: 'NFC obrigatório, 5G/4G estável, eSIM.', icon: 'Wifi' },
        { id: 'c9', label: 'Armazenamento', weight: 0.05, group: 'GS', description: 'Mínimo 128GB, UFS rápida, MicroSD.', icon: 'HardDrive' },
        { id: 'c10', label: 'Recursos', weight: 0.02, group: 'GS', description: 'IA útil, som estéreo, modo desktop.', icon: 'Sparkles' },
    ],
    profiles: [
        { id: 'balanced', name: 'Equilibrado', description: 'Uso geral versátil.', icon: '⚖️', weightOverrides: {} },
        { id: 'social', name: 'Redes Sociais', description: 'Foco em câmera.', icon: '📸', weightOverrides: { c4: 0.20, c6: 0.12, c1: 0.15 } },
        { id: 'battery', name: 'Bateria', description: 'Máxima autonomia.', icon: '🔋', weightOverrides: { c1: 0.30, c4: 0.06 } },
        { id: 'budget', name: 'Econômico', description: 'Custo-benefício.', icon: '💰', weightOverrides: { c3: 0.25, c7: 0.12, c4: 0.05 } },
    ],
};

// ============================================
// ROBÔS ASPIRADORES - PARR-BR Criteria (Jan 2026)
// Baseado em roborock-q7-l5.json e wap-robot-w400
// ============================================

export const ROBOT_VACUUM_CATEGORY: CategoryDefinition = {
    id: 'robot-vacuum',
    name: 'Robôs Aspiradores',
    nameSingular: 'Robô Aspirador',
    slug: 'robos-aspiradores',
    description: 'Compare os melhores robôs aspiradores com LiDAR, mop e autoesvaziamento.',
    icon: 'Bot',
    criteria: [
        // Critérios baseados em roborock-q7-l5.json productDna
        { id: 'c1', label: 'Navegação & Mapeamento', weight: 0.25, group: 'QS', description: 'LiDAR, vSLAM ou aleatória. Mapeamento 3D e zonas.', icon: 'Radar' },
        { id: 'c2', label: 'Software & Conectividade', weight: 0.15, group: 'QS', description: 'App, Alexa/Google, agendamento e controle.', icon: 'Smartphone' },
        { id: 'c3', label: 'Sistema de Mop', weight: 0.15, group: 'QS', description: 'Estático, vibratório, controle de fluxo.', icon: 'Droplet' },
        { id: 'c4', label: 'Engenharia de Escovas', weight: 0.10, group: 'QS', description: 'Anti-emaranhamento, borracha ou cerdas.', icon: 'Sparkles' },
        { id: 'c5', label: 'Altura e Acessibilidade', weight: 0.10, group: 'QS', description: 'Altura em cm, passa sob móveis.', icon: 'Ruler' },
        { id: 'c6', label: 'Manutenibilidade', weight: 0.08, group: 'VS', description: 'Disponibilidade de peças no Brasil.', icon: 'Wrench' },
        { id: 'c7', label: 'Bateria e Autonomia', weight: 0.05, group: 'QS', description: 'Minutos de operação, Recharge & Resume.', icon: 'Battery' },
        { id: 'c8', label: 'Acústica', weight: 0.05, group: 'GS', description: 'Ruído em dB durante operação.', icon: 'Volume2' },
        { id: 'c9', label: 'Base de Carregamento', weight: 0.05, group: 'QS', description: 'Autoesvaziamento, lavagem de mop.', icon: 'Home' },
        { id: 'c10', label: 'Recursos de IA', weight: 0.02, group: 'GS', description: 'Detecção de objetos, câmera, sensores 3D.', icon: 'Brain' },
    ],
    profiles: [
        { id: 'balanced', name: 'Equilibrado', description: 'Uso geral.', icon: '⚖️', weightOverrides: {} },
        { id: 'pets', name: 'Donos de Pets', description: 'Foco em escovas anti-emaranhamento.', icon: '🐕', weightOverrides: { c4: 0.20, c1: 0.20, c7: 0.08 } },
        { id: 'hands-off', name: 'Zero Manutenção', description: 'Autoesvaziamento e autonomia.', icon: '🙌', weightOverrides: { c9: 0.15, c7: 0.10, c3: 0.10 } },
        { id: 'budget', name: 'Econômico', description: 'Custo-benefício básico.', icon: '💰', weightOverrides: { c6: 0.15, c1: 0.15, c9: 0.02 } },
    ],
};

// ============================================
// SMARTWATCH - P6: CategoryDefinition
// ============================================

export const SMARTWATCH_CATEGORY: CategoryDefinition = {
    id: 'smartwatch',
    name: 'Smartwatches',
    nameSingular: 'Smartwatch',
    slug: 'smartwatches',
    description: 'Compare os melhores smartwatches com foco em saúde, fitness e integração.',
    icon: 'Watch',
    criteria: [
        { id: 'c1', label: 'Bateria', weight: 0.15, group: 'QS', description: 'Autonomia em dias de uso real.', icon: 'Battery' },
        { id: 'c2', label: 'Precisão Fitness', weight: 0.15, group: 'QS', description: 'GPS, sensores e rastreamento.', icon: 'Activity' },
        { id: 'c3', label: 'Sensores de Saúde', weight: 0.12, group: 'QS', description: 'ECG, SpO2, frequência cardíaca.', icon: 'Heart' },
        { id: 'c4', label: 'Tela', weight: 0.10, group: 'QS', description: 'AMOLED, brilho e Always-On.', icon: 'MonitorSmartphone' },
        { id: 'c5', label: 'Ecossistema', weight: 0.10, group: 'GS', description: 'Integração com apps e smartphones.', icon: 'Smartphone' },
        { id: 'c6', label: 'Construção', weight: 0.10, group: 'GS', description: 'Materiais e resistência à água.', icon: 'Shield' },
        { id: 'c7', label: 'Software', weight: 0.08, group: 'QS', description: 'Sistema operacional e apps.', icon: 'Cpu' },
        { id: 'c8', label: 'Custo-Benefício', weight: 0.08, group: 'VS', description: 'Preço vs recursos.', icon: 'PiggyBank' },
        { id: 'c9', label: 'Design', weight: 0.07, group: 'GS', description: 'Estética e pulseiras.', icon: 'Palette' },
        { id: 'c10', label: 'Pagamentos', weight: 0.05, group: 'GS', description: 'NFC e carteiras digitais.', icon: 'CreditCard' },
    ],
};

// ============================================
// LAPTOP - P6: CategoryDefinition
// ============================================

export const LAPTOP_CATEGORY: CategoryDefinition = {
    id: 'laptop',
    name: 'Notebooks',
    nameSingular: 'Notebook',
    slug: 'notebooks',
    description: 'Compare os melhores notebooks para trabalho, estudos e entretenimento.',
    icon: 'Laptop',
    criteria: [
        { id: 'c1', label: 'Desempenho', weight: 0.18, group: 'QS', description: 'CPU, RAM e velocidade geral.', icon: 'Cpu' },
        { id: 'c2', label: 'Portabilidade', weight: 0.12, group: 'QS', description: 'Peso e dimensões.', icon: 'Feather' },
        { id: 'c3', label: 'Tela', weight: 0.12, group: 'QS', description: 'Resolução, cores e brilho.', icon: 'Monitor' },
        { id: 'c4', label: 'Bateria', weight: 0.12, group: 'QS', description: 'Autonomia real de uso.', icon: 'Battery' },
        { id: 'c5', label: 'Teclado', weight: 0.08, group: 'QS', description: 'Conforto de digitação.', icon: 'Keyboard' },
        { id: 'c6', label: 'Construção', weight: 0.08, group: 'GS', description: 'Materiais e durabilidade.', icon: 'Shield' },
        { id: 'c7', label: 'Custo-Benefício', weight: 0.10, group: 'VS', description: 'Preço vs specs.', icon: 'PiggyBank' },
        { id: 'c8', label: 'Conectividade', weight: 0.08, group: 'GS', description: 'USB-C, Thunderbolt, HDMI.', icon: 'Plug' },
        { id: 'c9', label: 'Armazenamento', weight: 0.07, group: 'QS', description: 'SSD rápido e capacidade.', icon: 'HardDrive' },
        { id: 'c10', label: 'Suporte', weight: 0.05, group: 'GS', description: 'Garantia e assistência.', icon: 'HeadphonesIcon' },
    ],
};

// ============================================
// WASHER - P6: CategoryDefinition
// ============================================

export const WASHER_CATEGORY: CategoryDefinition = {
    id: 'washer',
    name: 'Máquinas de Lavar',
    nameSingular: 'Máquina de Lavar',
    slug: 'maquinas-de-lavar',
    description: 'Compare as melhores máquinas de lavar para sua casa.',
    icon: 'Shirt',
    criteria: [
        { id: 'c1', label: 'Capacidade', weight: 0.15, group: 'QS', description: 'Quilos de roupa por ciclo.', icon: 'Package' },
        { id: 'c2', label: 'Eficiência Energética', weight: 0.15, group: 'QS', description: 'Consumo de energia.', icon: 'Leaf' },
        { id: 'c3', label: 'Qualidade de Lavagem', weight: 0.12, group: 'QS', description: 'Limpeza e cuidado com roupas.', icon: 'Sparkles' },
        { id: 'c4', label: 'Centrifugação', weight: 0.10, group: 'QS', description: 'RPM e extração de água.', icon: 'RefreshCw' },
        { id: 'c5', label: 'Ruído', weight: 0.08, group: 'QS', description: 'Nível de barulho.', icon: 'VolumeX' },
        { id: 'c6', label: 'Durabilidade', weight: 0.10, group: 'GS', description: 'Vida útil esperada.', icon: 'Shield' },
        { id: 'c7', label: 'Custo-Benefício', weight: 0.10, group: 'VS', description: 'Preço vs recursos.', icon: 'PiggyBank' },
        { id: 'c8', label: 'Praticidade', weight: 0.08, group: 'GS', description: 'Facilidade de uso.', icon: 'Hand' },
        { id: 'c9', label: 'Conectividade', weight: 0.05, group: 'GS', description: 'WiFi e app.', icon: 'Wifi' },
        { id: 'c10', label: 'Suporte', weight: 0.07, group: 'GS', description: 'Garantia e assistência.', icon: 'HeadphonesIcon' },
    ],
};

// ============================================
// MONITOR - P6: CategoryDefinition
// ============================================

export const MONITOR_CATEGORY: CategoryDefinition = {
    id: 'monitor',
    name: 'Monitores',
    nameSingular: 'Monitor',
    slug: 'monitores',
    description: 'Compare os melhores monitores para trabalho, gaming e criação.',
    icon: 'Monitor',
    criteria: [
        { id: 'c1', label: 'Qualidade de Imagem', weight: 0.18, group: 'QS', description: 'Cores, contraste e resolução.', icon: 'Image' },
        { id: 'c2', label: 'Gaming', weight: 0.12, group: 'QS', description: 'Refresh rate e tempo de resposta.', icon: 'Gamepad2' },
        { id: 'c3', label: 'Ergonomia', weight: 0.10, group: 'GS', description: 'Ajustes de altura e pivot.', icon: 'Move' },
        { id: 'c4', label: 'Conectividade', weight: 0.10, group: 'GS', description: 'USB-C, HDMI, DisplayPort.', icon: 'Plug' },
        { id: 'c5', label: 'Construção', weight: 0.08, group: 'GS', description: 'Design e materiais.', icon: 'Shield' },
        { id: 'c6', label: 'Custo-Benefício', weight: 0.12, group: 'VS', description: 'Preço vs specs.', icon: 'PiggyBank' },
        { id: 'c7', label: 'HDR', weight: 0.08, group: 'QS', description: 'Suporte e certificação HDR.', icon: 'Sun' },
        { id: 'c8', label: 'Brilho', weight: 0.07, group: 'QS', description: 'Nits e uniformidade.', icon: 'Lightbulb' },
        { id: 'c9', label: 'Precisão de Cores', weight: 0.08, group: 'QS', description: 'Delta E e cobertura sRGB.', icon: 'Palette' },
        { id: 'c10', label: 'Design', weight: 0.07, group: 'GS', description: 'Estética e bordas.', icon: 'Sparkles' },
    ],
};

// ============================================
// TABLET - P6: CategoryDefinition
// ============================================

export const TABLET_CATEGORY: CategoryDefinition = {
    id: 'tablet',
    name: 'Tablets',
    nameSingular: 'Tablet',
    slug: 'tablets',
    description: 'Compare os melhores tablets para entretenimento e produtividade.',
    icon: 'Tablet',
    criteria: [
        { id: 'c1', label: 'Tela', weight: 0.15, group: 'QS', description: 'Tamanho, resolução e qualidade.', icon: 'MonitorSmartphone' },
        { id: 'c2', label: 'Desempenho', weight: 0.15, group: 'QS', description: 'Processador e RAM.', icon: 'Cpu' },
        { id: 'c3', label: 'Bateria', weight: 0.12, group: 'QS', description: 'Autonomia de uso.', icon: 'Battery' },
        { id: 'c4', label: 'Produtividade', weight: 0.12, group: 'QS', description: 'Suporte a caneta e teclado.', icon: 'PenTool' },
        { id: 'c5', label: 'Construção', weight: 0.08, group: 'GS', description: 'Materiais e peso.', icon: 'Shield' },
        { id: 'c6', label: 'Software', weight: 0.10, group: 'QS', description: 'Sistema e apps.', icon: 'Layout' },
        { id: 'c7', label: 'Custo-Benefício', weight: 0.10, group: 'VS', description: 'Preço vs recursos.', icon: 'PiggyBank' },
        { id: 'c8', label: 'Ecossistema', weight: 0.08, group: 'GS', description: 'Integração com outros dispositivos.', icon: 'Smartphone' },
        { id: 'c9', label: 'Armazenamento', weight: 0.05, group: 'GS', description: 'Capacidade e expansão.', icon: 'HardDrive' },
        { id: 'c10', label: 'Acessórios', weight: 0.05, group: 'GS', description: 'Disponibilidade e qualidade.', icon: 'Package' },
    ],
};

// ============================================
// SOUNDBAR - P6: CategoryDefinition
// ============================================

export const SOUNDBAR_CATEGORY: CategoryDefinition = {
    id: 'soundbar',
    name: 'Soundbars',
    nameSingular: 'Soundbar',
    slug: 'soundbars',
    description: 'Compare as melhores soundbars para áudio de cinema em casa.',
    icon: 'Speaker',
    criteria: [
        { id: 'c1', label: 'Qualidade de Som', weight: 0.20, group: 'QS', description: 'Clareza e fidelidade.', icon: 'Music' },
        { id: 'c2', label: 'Graves', weight: 0.12, group: 'QS', description: 'Subwoofer e baixas frequências.', icon: 'Volume2' },
        { id: 'c3', label: 'Diálogos', weight: 0.10, group: 'QS', description: 'Clareza de vozes.', icon: 'MessageSquare' },
        { id: 'c4', label: 'Surround', weight: 0.12, group: 'QS', description: 'Dolby Atmos e DTS:X.', icon: 'Headphones' },
        { id: 'c5', label: 'Conectividade', weight: 0.10, group: 'GS', description: 'HDMI eARC, Bluetooth, WiFi.', icon: 'Plug' },
        { id: 'c6', label: 'Facilidade de Uso', weight: 0.08, group: 'GS', description: 'Configuração e controle.', icon: 'Settings' },
        { id: 'c7', label: 'Custo-Benefício', weight: 0.10, group: 'VS', description: 'Preço vs qualidade.', icon: 'PiggyBank' },
        { id: 'c8', label: 'Design', weight: 0.06, group: 'GS', description: 'Estética e integração.', icon: 'Palette' },
        { id: 'c9', label: 'Potência', weight: 0.07, group: 'QS', description: 'Watts e volume máximo.', icon: 'Zap' },
        { id: 'c10', label: 'Ecossistema', weight: 0.05, group: 'GS', description: 'Compatibilidade com outros dispositivos.', icon: 'Home' },
    ],
};

/**
 * All available categories indexed by ID (11 total)
 */

// ============================================
// FONES TWS - P8 Stub (maturity: stub)
// ============================================

export const TWS_CATEGORY: CategoryDefinition = {
    id: 'tws',
    name: 'Fones TWS',
    nameSingular: 'Fones TWS',
    slug: 'fones-tws',
    description: 'Compare os melhores fones tws.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.15, group: 'QS', description: 'Desempenho geral.' },
        { id: 'c2', label: 'Eficiência', weight: 0.12, group: 'QS', description: 'Eficiência energética/operacional.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Funcionalidades e features.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção e vida útil.' },
        { id: 'c5', label: 'Usabilidade', weight: 0.1, group: 'GS', description: 'Facilidade de uso.' },
        { id: 'c6', label: 'Ruído', weight: 0.08, group: 'QS', description: 'Nível de ruído.' },
        { id: 'c7', label: 'Conectividade', weight: 0.08, group: 'GS', description: 'Conexões e integração.' },
        { id: 'c8', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética e acabamento.' },
        { id: 'c9', label: 'Suporte', weight: 0.07, group: 'GS', description: 'Garantia e assistência.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor pelo preço.' },
    ],
};


// ============================================
// CAIXAS BLUETOOTH - P8 Stub (maturity: stub)
// ============================================

export const BLUETOOTH_SPEAKER_CATEGORY: CategoryDefinition = {
    id: 'bluetooth-speaker',
    name: 'Caixas Bluetooth',
    nameSingular: 'Caixas Bluetooth',
    slug: 'caixas-bluetooth',
    description: 'Compare os melhores caixas bluetooth.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.15, group: 'QS', description: 'Desempenho geral.' },
        { id: 'c2', label: 'Eficiência', weight: 0.12, group: 'QS', description: 'Eficiência energética/operacional.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Funcionalidades e features.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção e vida útil.' },
        { id: 'c5', label: 'Usabilidade', weight: 0.1, group: 'GS', description: 'Facilidade de uso.' },
        { id: 'c6', label: 'Ruído', weight: 0.08, group: 'QS', description: 'Nível de ruído.' },
        { id: 'c7', label: 'Conectividade', weight: 0.08, group: 'GS', description: 'Conexões e integração.' },
        { id: 'c8', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética e acabamento.' },
        { id: 'c9', label: 'Suporte', weight: 0.07, group: 'GS', description: 'Garantia e assistência.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor pelo preço.' },
    ],
};


// ============================================
// CONSOLES - P8 Stub (maturity: stub)
// ============================================

export const CONSOLE_CATEGORY: CategoryDefinition = {
    id: 'console',
    name: 'Consoles',
    nameSingular: 'Console',
    slug: 'consoles',
    description: 'Compare os melhores consoles.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.18, group: 'QS', description: 'Desempenho em jogos.' },
        { id: 'c2', label: 'Recursos Gaming', weight: 0.15, group: 'QS', description: 'Features para gamers.' },
        { id: 'c3', label: 'Conforto', weight: 0.12, group: 'QS', description: 'Ergonomia e conforto.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção robusta.' },
        { id: 'c5', label: 'Latência', weight: 0.1, group: 'QS', description: 'Tempo de resposta.' },
        { id: 'c6', label: 'Compatibilidade', weight: 0.08, group: 'GS', description: 'Suporte a plataformas.' },
        { id: 'c7', label: 'Conectividade', weight: 0.07, group: 'GS', description: 'Wireless/cabo.' },
        { id: 'c8', label: 'Design', weight: 0.07, group: 'GS', description: 'Estética gamer.' },
        { id: 'c9', label: 'Suporte', weight: 0.05, group: 'GS', description: 'Garantia.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.08, group: 'VS', description: 'Valor.' },
    ],
};


// ============================================
// HEADSETS GAMER - P8 Stub (maturity: stub)
// ============================================

export const HEADSET_GAMER_CATEGORY: CategoryDefinition = {
    id: 'headset-gamer',
    name: 'Headsets Gamer',
    nameSingular: 'Headsets Gamer',
    slug: 'headsets-gamer',
    description: 'Compare os melhores headsets gamer.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.18, group: 'QS', description: 'Desempenho em jogos.' },
        { id: 'c2', label: 'Recursos Gaming', weight: 0.15, group: 'QS', description: 'Features para gamers.' },
        { id: 'c3', label: 'Conforto', weight: 0.12, group: 'QS', description: 'Ergonomia e conforto.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção robusta.' },
        { id: 'c5', label: 'Latência', weight: 0.1, group: 'QS', description: 'Tempo de resposta.' },
        { id: 'c6', label: 'Compatibilidade', weight: 0.08, group: 'GS', description: 'Suporte a plataformas.' },
        { id: 'c7', label: 'Conectividade', weight: 0.07, group: 'GS', description: 'Wireless/cabo.' },
        { id: 'c8', label: 'Design', weight: 0.07, group: 'GS', description: 'Estética gamer.' },
        { id: 'c9', label: 'Suporte', weight: 0.05, group: 'GS', description: 'Garantia.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.08, group: 'VS', description: 'Valor.' },
    ],
};


// ============================================
// GAMEPADS - P8 Stub (maturity: stub)
// ============================================

export const GAMEPAD_CATEGORY: CategoryDefinition = {
    id: 'gamepad',
    name: 'Gamepads',
    nameSingular: 'Gamepad',
    slug: 'gamepads',
    description: 'Compare os melhores gamepads.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.18, group: 'QS', description: 'Desempenho em jogos.' },
        { id: 'c2', label: 'Recursos Gaming', weight: 0.15, group: 'QS', description: 'Features para gamers.' },
        { id: 'c3', label: 'Conforto', weight: 0.12, group: 'QS', description: 'Ergonomia e conforto.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção robusta.' },
        { id: 'c5', label: 'Latência', weight: 0.1, group: 'QS', description: 'Tempo de resposta.' },
        { id: 'c6', label: 'Compatibilidade', weight: 0.08, group: 'GS', description: 'Suporte a plataformas.' },
        { id: 'c7', label: 'Conectividade', weight: 0.07, group: 'GS', description: 'Wireless/cabo.' },
        { id: 'c8', label: 'Design', weight: 0.07, group: 'GS', description: 'Estética gamer.' },
        { id: 'c9', label: 'Suporte', weight: 0.05, group: 'GS', description: 'Garantia.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.08, group: 'VS', description: 'Valor.' },
    ],
};


// ============================================
// CADEIRAS - P8 Stub (maturity: stub)
// ============================================

export const CHAIR_CATEGORY: CategoryDefinition = {
    id: 'chair',
    name: 'Cadeiras',
    nameSingular: 'Cadeira',
    slug: 'cadeiras',
    description: 'Compare os melhores cadeiras.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.18, group: 'QS', description: 'Desempenho em jogos.' },
        { id: 'c2', label: 'Recursos Gaming', weight: 0.15, group: 'QS', description: 'Features para gamers.' },
        { id: 'c3', label: 'Conforto', weight: 0.12, group: 'QS', description: 'Ergonomia e conforto.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção robusta.' },
        { id: 'c5', label: 'Latência', weight: 0.1, group: 'QS', description: 'Tempo de resposta.' },
        { id: 'c6', label: 'Compatibilidade', weight: 0.08, group: 'GS', description: 'Suporte a plataformas.' },
        { id: 'c7', label: 'Conectividade', weight: 0.07, group: 'GS', description: 'Wireless/cabo.' },
        { id: 'c8', label: 'Design', weight: 0.07, group: 'GS', description: 'Estética gamer.' },
        { id: 'c9', label: 'Suporte', weight: 0.05, group: 'GS', description: 'Garantia.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.08, group: 'VS', description: 'Valor.' },
    ],
};


// ============================================
// PROJETORES - P8 Stub (maturity: stub)
// ============================================

export const PROJECTOR_CATEGORY: CategoryDefinition = {
    id: 'projector',
    name: 'Projetores',
    nameSingular: 'Projetore',
    slug: 'projetores',
    description: 'Compare os melhores projetores.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.15, group: 'QS', description: 'Desempenho geral.' },
        { id: 'c2', label: 'Eficiência', weight: 0.12, group: 'QS', description: 'Eficiência energética/operacional.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Funcionalidades e features.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção e vida útil.' },
        { id: 'c5', label: 'Usabilidade', weight: 0.1, group: 'GS', description: 'Facilidade de uso.' },
        { id: 'c6', label: 'Ruído', weight: 0.08, group: 'QS', description: 'Nível de ruído.' },
        { id: 'c7', label: 'Conectividade', weight: 0.08, group: 'GS', description: 'Conexões e integração.' },
        { id: 'c8', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética e acabamento.' },
        { id: 'c9', label: 'Suporte', weight: 0.07, group: 'GS', description: 'Garantia e assistência.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor pelo preço.' },
    ],
};


// ============================================
// TV BOX - P8 Stub (maturity: stub)
// ============================================

export const TVBOX_CATEGORY: CategoryDefinition = {
    id: 'tvbox',
    name: 'TV Box',
    nameSingular: 'TV Box',
    slug: 'tv-box',
    description: 'Compare os melhores tv box.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.15, group: 'QS', description: 'Desempenho geral.' },
        { id: 'c2', label: 'Eficiência', weight: 0.12, group: 'QS', description: 'Eficiência energética/operacional.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Funcionalidades e features.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção e vida útil.' },
        { id: 'c5', label: 'Usabilidade', weight: 0.1, group: 'GS', description: 'Facilidade de uso.' },
        { id: 'c6', label: 'Ruído', weight: 0.08, group: 'QS', description: 'Nível de ruído.' },
        { id: 'c7', label: 'Conectividade', weight: 0.08, group: 'GS', description: 'Conexões e integração.' },
        { id: 'c8', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética e acabamento.' },
        { id: 'c9', label: 'Suporte', weight: 0.07, group: 'GS', description: 'Garantia e assistência.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor pelo preço.' },
    ],
};


// ============================================
// IMPRESSORAS - P8 Stub (maturity: stub)
// ============================================

export const PRINTER_CATEGORY: CategoryDefinition = {
    id: 'printer',
    name: 'Impressoras',
    nameSingular: 'Impressora',
    slug: 'impressoras',
    description: 'Compare os melhores impressoras.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.15, group: 'QS', description: 'Desempenho geral.' },
        { id: 'c2', label: 'Eficiência', weight: 0.12, group: 'QS', description: 'Eficiência energética/operacional.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Funcionalidades e features.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção e vida útil.' },
        { id: 'c5', label: 'Usabilidade', weight: 0.1, group: 'GS', description: 'Facilidade de uso.' },
        { id: 'c6', label: 'Ruído', weight: 0.08, group: 'QS', description: 'Nível de ruído.' },
        { id: 'c7', label: 'Conectividade', weight: 0.08, group: 'GS', description: 'Conexões e integração.' },
        { id: 'c8', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética e acabamento.' },
        { id: 'c9', label: 'Suporte', weight: 0.07, group: 'GS', description: 'Garantia e assistência.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor pelo preço.' },
    ],
};


// ============================================
// ROTEADORES - P8 Stub (maturity: stub)
// ============================================

export const ROUTER_CATEGORY: CategoryDefinition = {
    id: 'router',
    name: 'Roteadores',
    nameSingular: 'Roteadore',
    slug: 'roteadores',
    description: 'Compare os melhores roteadores.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.15, group: 'QS', description: 'Desempenho geral.' },
        { id: 'c2', label: 'Eficiência', weight: 0.12, group: 'QS', description: 'Eficiência energética/operacional.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Funcionalidades e features.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção e vida útil.' },
        { id: 'c5', label: 'Usabilidade', weight: 0.1, group: 'GS', description: 'Facilidade de uso.' },
        { id: 'c6', label: 'Ruído', weight: 0.08, group: 'QS', description: 'Nível de ruído.' },
        { id: 'c7', label: 'Conectividade', weight: 0.08, group: 'GS', description: 'Conexões e integração.' },
        { id: 'c8', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética e acabamento.' },
        { id: 'c9', label: 'Suporte', weight: 0.07, group: 'GS', description: 'Garantia e assistência.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor pelo preço.' },
    ],
};


// ============================================
// PROCESSADORES - P8 Stub (maturity: stub)
// ============================================

export const CPU_CATEGORY: CategoryDefinition = {
    id: 'cpu',
    name: 'Processadores',
    nameSingular: 'Processadore',
    slug: 'processadores',
    description: 'Compare os melhores processadores.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.2, group: 'QS', description: 'Benchmark/velocidade.' },
        { id: 'c2', label: 'Eficiência', weight: 0.12, group: 'QS', description: 'Consumo/thermal.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Features técnicas.' },
        { id: 'c4', label: 'Compatibilidade', weight: 0.1, group: 'GS', description: 'Soquete/padrão.' },
        { id: 'c5', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção.' },
        { id: 'c6', label: 'Expansão', weight: 0.08, group: 'GS', description: 'Upgrade path.' },
        { id: 'c7', label: 'Garantia', weight: 0.08, group: 'GS', description: 'Suporte fabricante.' },
        { id: 'c8', label: 'Estética', weight: 0.05, group: 'GS', description: 'RGB/visual.' },
        { id: 'c9', label: 'Disponibilidade', weight: 0.05, group: 'GS', description: 'Estoque BR.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor.' },
    ],
};


// ============================================
// PLACAS DE VÍDEO - P8 Stub (maturity: stub)
// ============================================

export const GPU_CATEGORY: CategoryDefinition = {
    id: 'gpu',
    name: 'Placas de Vídeo',
    nameSingular: 'Placas de Vídeo',
    slug: 'placas-de-video',
    description: 'Compare os melhores placas de vídeo.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.2, group: 'QS', description: 'Benchmark/velocidade.' },
        { id: 'c2', label: 'Eficiência', weight: 0.12, group: 'QS', description: 'Consumo/thermal.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Features técnicas.' },
        { id: 'c4', label: 'Compatibilidade', weight: 0.1, group: 'GS', description: 'Soquete/padrão.' },
        { id: 'c5', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção.' },
        { id: 'c6', label: 'Expansão', weight: 0.08, group: 'GS', description: 'Upgrade path.' },
        { id: 'c7', label: 'Garantia', weight: 0.08, group: 'GS', description: 'Suporte fabricante.' },
        { id: 'c8', label: 'Estética', weight: 0.05, group: 'GS', description: 'RGB/visual.' },
        { id: 'c9', label: 'Disponibilidade', weight: 0.05, group: 'GS', description: 'Estoque BR.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor.' },
    ],
};


// ============================================
// PLACAS-MÃE - P8 Stub (maturity: stub)
// ============================================

export const MOTHERBOARD_CATEGORY: CategoryDefinition = {
    id: 'motherboard',
    name: 'Placas-Mãe',
    nameSingular: 'Placas-Mãe',
    slug: 'placas-mae',
    description: 'Compare os melhores placas-mãe.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.2, group: 'QS', description: 'Benchmark/velocidade.' },
        { id: 'c2', label: 'Eficiência', weight: 0.12, group: 'QS', description: 'Consumo/thermal.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Features técnicas.' },
        { id: 'c4', label: 'Compatibilidade', weight: 0.1, group: 'GS', description: 'Soquete/padrão.' },
        { id: 'c5', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção.' },
        { id: 'c6', label: 'Expansão', weight: 0.08, group: 'GS', description: 'Upgrade path.' },
        { id: 'c7', label: 'Garantia', weight: 0.08, group: 'GS', description: 'Suporte fabricante.' },
        { id: 'c8', label: 'Estética', weight: 0.05, group: 'GS', description: 'RGB/visual.' },
        { id: 'c9', label: 'Disponibilidade', weight: 0.05, group: 'GS', description: 'Estoque BR.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor.' },
    ],
};


// ============================================
// MEMÓRIA RAM - P8 Stub (maturity: stub)
// ============================================

export const RAM_CATEGORY: CategoryDefinition = {
    id: 'ram',
    name: 'Memória RAM',
    nameSingular: 'Memória RAM',
    slug: 'memoria-ram',
    description: 'Compare os melhores memória ram.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.2, group: 'QS', description: 'Benchmark/velocidade.' },
        { id: 'c2', label: 'Eficiência', weight: 0.12, group: 'QS', description: 'Consumo/thermal.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Features técnicas.' },
        { id: 'c4', label: 'Compatibilidade', weight: 0.1, group: 'GS', description: 'Soquete/padrão.' },
        { id: 'c5', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção.' },
        { id: 'c6', label: 'Expansão', weight: 0.08, group: 'GS', description: 'Upgrade path.' },
        { id: 'c7', label: 'Garantia', weight: 0.08, group: 'GS', description: 'Suporte fabricante.' },
        { id: 'c8', label: 'Estética', weight: 0.05, group: 'GS', description: 'RGB/visual.' },
        { id: 'c9', label: 'Disponibilidade', weight: 0.05, group: 'GS', description: 'Estoque BR.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor.' },
    ],
};


// ============================================
// SSDS - P8 Stub (maturity: stub)
// ============================================

export const SSD_CATEGORY: CategoryDefinition = {
    id: 'ssd',
    name: 'SSDs',
    nameSingular: 'SSD',
    slug: 'ssds',
    description: 'Compare os melhores ssds.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.2, group: 'QS', description: 'Benchmark/velocidade.' },
        { id: 'c2', label: 'Eficiência', weight: 0.12, group: 'QS', description: 'Consumo/thermal.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Features técnicas.' },
        { id: 'c4', label: 'Compatibilidade', weight: 0.1, group: 'GS', description: 'Soquete/padrão.' },
        { id: 'c5', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção.' },
        { id: 'c6', label: 'Expansão', weight: 0.08, group: 'GS', description: 'Upgrade path.' },
        { id: 'c7', label: 'Garantia', weight: 0.08, group: 'GS', description: 'Suporte fabricante.' },
        { id: 'c8', label: 'Estética', weight: 0.05, group: 'GS', description: 'RGB/visual.' },
        { id: 'c9', label: 'Disponibilidade', weight: 0.05, group: 'GS', description: 'Estoque BR.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor.' },
    ],
};


// ============================================
// FONTES - P8 Stub (maturity: stub)
// ============================================

export const PSU_CATEGORY: CategoryDefinition = {
    id: 'psu',
    name: 'Fontes',
    nameSingular: 'Fonte',
    slug: 'fontes',
    description: 'Compare os melhores fontes.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.2, group: 'QS', description: 'Benchmark/velocidade.' },
        { id: 'c2', label: 'Eficiência', weight: 0.12, group: 'QS', description: 'Consumo/thermal.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Features técnicas.' },
        { id: 'c4', label: 'Compatibilidade', weight: 0.1, group: 'GS', description: 'Soquete/padrão.' },
        { id: 'c5', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção.' },
        { id: 'c6', label: 'Expansão', weight: 0.08, group: 'GS', description: 'Upgrade path.' },
        { id: 'c7', label: 'Garantia', weight: 0.08, group: 'GS', description: 'Suporte fabricante.' },
        { id: 'c8', label: 'Estética', weight: 0.05, group: 'GS', description: 'RGB/visual.' },
        { id: 'c9', label: 'Disponibilidade', weight: 0.05, group: 'GS', description: 'Estoque BR.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor.' },
    ],
};


// ============================================
// GABINETES - P8 Stub (maturity: stub)
// ============================================

export const CASE_CATEGORY: CategoryDefinition = {
    id: 'case',
    name: 'Gabinetes',
    nameSingular: 'Gabinete',
    slug: 'gabinetes',
    description: 'Compare os melhores gabinetes.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.2, group: 'QS', description: 'Benchmark/velocidade.' },
        { id: 'c2', label: 'Eficiência', weight: 0.12, group: 'QS', description: 'Consumo/thermal.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Features técnicas.' },
        { id: 'c4', label: 'Compatibilidade', weight: 0.1, group: 'GS', description: 'Soquete/padrão.' },
        { id: 'c5', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção.' },
        { id: 'c6', label: 'Expansão', weight: 0.08, group: 'GS', description: 'Upgrade path.' },
        { id: 'c7', label: 'Garantia', weight: 0.08, group: 'GS', description: 'Suporte fabricante.' },
        { id: 'c8', label: 'Estética', weight: 0.05, group: 'GS', description: 'RGB/visual.' },
        { id: 'c9', label: 'Disponibilidade', weight: 0.05, group: 'GS', description: 'Estoque BR.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor.' },
    ],
};


// ============================================
// FREEZERS - P8 Stub (maturity: stub)
// ============================================

export const FREEZER_CATEGORY: CategoryDefinition = {
    id: 'freezer',
    name: 'Freezers',
    nameSingular: 'Freezer',
    slug: 'freezers',
    description: 'Compare os melhores freezers.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Capacidade', weight: 0.15, group: 'QS', description: 'Tamanho/volume.' },
        { id: 'c2', label: 'Eficiência', weight: 0.15, group: 'QS', description: 'Consumo energia.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Funcionalidades.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Vida útil.' },
        { id: 'c5', label: 'Praticidade', weight: 0.1, group: 'GS', description: 'Facilidade uso.' },
        { id: 'c6', label: 'Ruído', weight: 0.08, group: 'QS', description: 'Nível sonoro.' },
        { id: 'c7', label: 'Conectividade', weight: 0.05, group: 'GS', description: 'Smart/WiFi.' },
        { id: 'c8', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética.' },
        { id: 'c9', label: 'Suporte', weight: 0.07, group: 'GS', description: 'Assistência.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor.' },
    ],
};


// ============================================
// FRIGOBARES - P8 Stub (maturity: stub)
// ============================================

export const MINIBAR_CATEGORY: CategoryDefinition = {
    id: 'minibar',
    name: 'Frigobares',
    nameSingular: 'Frigobare',
    slug: 'frigobares',
    description: 'Compare os melhores frigobares.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Capacidade', weight: 0.15, group: 'QS', description: 'Tamanho/volume.' },
        { id: 'c2', label: 'Eficiência', weight: 0.15, group: 'QS', description: 'Consumo energia.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Funcionalidades.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Vida útil.' },
        { id: 'c5', label: 'Praticidade', weight: 0.1, group: 'GS', description: 'Facilidade uso.' },
        { id: 'c6', label: 'Ruído', weight: 0.08, group: 'QS', description: 'Nível sonoro.' },
        { id: 'c7', label: 'Conectividade', weight: 0.05, group: 'GS', description: 'Smart/WiFi.' },
        { id: 'c8', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética.' },
        { id: 'c9', label: 'Suporte', weight: 0.07, group: 'GS', description: 'Assistência.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor.' },
    ],
};


// ============================================
// ADEGAS - P8 Stub (maturity: stub)
// ============================================

export const WINE_COOLER_CATEGORY: CategoryDefinition = {
    id: 'wine-cooler',
    name: 'Adegas',
    nameSingular: 'Adega',
    slug: 'adegas',
    description: 'Compare os melhores adegas.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Capacidade', weight: 0.15, group: 'QS', description: 'Tamanho/volume.' },
        { id: 'c2', label: 'Eficiência', weight: 0.15, group: 'QS', description: 'Consumo energia.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Funcionalidades.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Vida útil.' },
        { id: 'c5', label: 'Praticidade', weight: 0.1, group: 'GS', description: 'Facilidade uso.' },
        { id: 'c6', label: 'Ruído', weight: 0.08, group: 'QS', description: 'Nível sonoro.' },
        { id: 'c7', label: 'Conectividade', weight: 0.05, group: 'GS', description: 'Smart/WiFi.' },
        { id: 'c8', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética.' },
        { id: 'c9', label: 'Suporte', weight: 0.07, group: 'GS', description: 'Assistência.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor.' },
    ],
};


// ============================================
// VENTILADORES - P8 Stub (maturity: stub)
// ============================================

export const FAN_CATEGORY: CategoryDefinition = {
    id: 'fan',
    name: 'Ventiladores',
    nameSingular: 'Ventiladore',
    slug: 'ventiladores',
    description: 'Compare os melhores ventiladores.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Capacidade', weight: 0.15, group: 'QS', description: 'Tamanho/volume.' },
        { id: 'c2', label: 'Eficiência', weight: 0.15, group: 'QS', description: 'Consumo energia.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Funcionalidades.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Vida útil.' },
        { id: 'c5', label: 'Praticidade', weight: 0.1, group: 'GS', description: 'Facilidade uso.' },
        { id: 'c6', label: 'Ruído', weight: 0.08, group: 'QS', description: 'Nível sonoro.' },
        { id: 'c7', label: 'Conectividade', weight: 0.05, group: 'GS', description: 'Smart/WiFi.' },
        { id: 'c8', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética.' },
        { id: 'c9', label: 'Suporte', weight: 0.07, group: 'GS', description: 'Assistência.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor.' },
    ],
};


// ============================================
// FOGÕES - P8 Stub (maturity: stub)
// ============================================

export const STOVE_CATEGORY: CategoryDefinition = {
    id: 'stove',
    name: 'Fogões',
    nameSingular: 'Fogõe',
    slug: 'fogoes',
    description: 'Compare os melhores fogões.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.15, group: 'QS', description: 'Potência/resultado.' },
        { id: 'c2', label: 'Capacidade', weight: 0.12, group: 'QS', description: 'Volume/tamanho.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Modos/programas.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção.' },
        { id: 'c5', label: 'Praticidade', weight: 0.12, group: 'GS', description: 'Limpeza/uso.' },
        { id: 'c6', label: 'Segurança', weight: 0.08, group: 'GS', description: 'Proteções.' },
        { id: 'c7', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética cozinha.' },
        { id: 'c8', label: 'Consumo', weight: 0.08, group: 'QS', description: 'Energia/gás.' },
        { id: 'c9', label: 'Suporte', weight: 0.05, group: 'GS', description: 'Garantia.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor.' },
    ],
};


// ============================================
// FORNOS - P8 Stub (maturity: stub)
// ============================================

export const BUILTIN_OVEN_CATEGORY: CategoryDefinition = {
    id: 'builtin-oven',
    name: 'Fornos',
    nameSingular: 'Forno',
    slug: 'fornos',
    description: 'Compare os melhores fornos.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.15, group: 'QS', description: 'Potência/resultado.' },
        { id: 'c2', label: 'Capacidade', weight: 0.12, group: 'QS', description: 'Volume/tamanho.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Modos/programas.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção.' },
        { id: 'c5', label: 'Praticidade', weight: 0.12, group: 'GS', description: 'Limpeza/uso.' },
        { id: 'c6', label: 'Segurança', weight: 0.08, group: 'GS', description: 'Proteções.' },
        { id: 'c7', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética cozinha.' },
        { id: 'c8', label: 'Consumo', weight: 0.08, group: 'QS', description: 'Energia/gás.' },
        { id: 'c9', label: 'Suporte', weight: 0.05, group: 'GS', description: 'Garantia.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor.' },
    ],
};


// ============================================
// MICRO-ONDAS - P8 Stub (maturity: stub)
// ============================================

export const MICROWAVE_CATEGORY: CategoryDefinition = {
    id: 'microwave',
    name: 'Micro-ondas',
    nameSingular: 'Micro-onda',
    slug: 'micro-ondas',
    description: 'Compare os melhores micro-ondas.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.15, group: 'QS', description: 'Potência/resultado.' },
        { id: 'c2', label: 'Capacidade', weight: 0.12, group: 'QS', description: 'Volume/tamanho.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Modos/programas.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção.' },
        { id: 'c5', label: 'Praticidade', weight: 0.12, group: 'GS', description: 'Limpeza/uso.' },
        { id: 'c6', label: 'Segurança', weight: 0.08, group: 'GS', description: 'Proteções.' },
        { id: 'c7', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética cozinha.' },
        { id: 'c8', label: 'Consumo', weight: 0.08, group: 'QS', description: 'Energia/gás.' },
        { id: 'c9', label: 'Suporte', weight: 0.05, group: 'GS', description: 'Garantia.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor.' },
    ],
};


// ============================================
// AIR FRYERS - P8 Stub (maturity: stub)
// ============================================

export const AIR_FRYER_CATEGORY: CategoryDefinition = {
    id: 'air-fryer',
    name: 'Air Fryers',
    nameSingular: 'Air Fryer',
    slug: 'air-fryers',
    description: 'Compare os melhores air fryers.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.15, group: 'QS', description: 'Potência/resultado.' },
        { id: 'c2', label: 'Capacidade', weight: 0.12, group: 'QS', description: 'Volume/tamanho.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Modos/programas.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção.' },
        { id: 'c5', label: 'Praticidade', weight: 0.12, group: 'GS', description: 'Limpeza/uso.' },
        { id: 'c6', label: 'Segurança', weight: 0.08, group: 'GS', description: 'Proteções.' },
        { id: 'c7', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética cozinha.' },
        { id: 'c8', label: 'Consumo', weight: 0.08, group: 'QS', description: 'Energia/gás.' },
        { id: 'c9', label: 'Suporte', weight: 0.05, group: 'GS', description: 'Garantia.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor.' },
    ],
};


// ============================================
// COIFAS - P8 Stub (maturity: stub)
// ============================================

export const RANGE_HOOD_CATEGORY: CategoryDefinition = {
    id: 'range-hood',
    name: 'Coifas',
    nameSingular: 'Coifa',
    slug: 'coifas',
    description: 'Compare os melhores coifas.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.15, group: 'QS', description: 'Potência/resultado.' },
        { id: 'c2', label: 'Capacidade', weight: 0.12, group: 'QS', description: 'Volume/tamanho.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Modos/programas.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção.' },
        { id: 'c5', label: 'Praticidade', weight: 0.12, group: 'GS', description: 'Limpeza/uso.' },
        { id: 'c6', label: 'Segurança', weight: 0.08, group: 'GS', description: 'Proteções.' },
        { id: 'c7', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética cozinha.' },
        { id: 'c8', label: 'Consumo', weight: 0.08, group: 'QS', description: 'Energia/gás.' },
        { id: 'c9', label: 'Suporte', weight: 0.05, group: 'GS', description: 'Garantia.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor.' },
    ],
};


// ============================================
// LAVA-LOUÇAS - P8 Stub (maturity: stub)
// ============================================

export const DISHWASHER_CATEGORY: CategoryDefinition = {
    id: 'dishwasher',
    name: 'Lava-Louças',
    nameSingular: 'Lava-Louça',
    slug: 'lava-loucas',
    description: 'Compare os melhores lava-louças.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.15, group: 'QS', description: 'Potência/resultado.' },
        { id: 'c2', label: 'Capacidade', weight: 0.12, group: 'QS', description: 'Volume/tamanho.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Modos/programas.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção.' },
        { id: 'c5', label: 'Praticidade', weight: 0.12, group: 'GS', description: 'Limpeza/uso.' },
        { id: 'c6', label: 'Segurança', weight: 0.08, group: 'GS', description: 'Proteções.' },
        { id: 'c7', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética cozinha.' },
        { id: 'c8', label: 'Consumo', weight: 0.08, group: 'QS', description: 'Energia/gás.' },
        { id: 'c9', label: 'Suporte', weight: 0.05, group: 'GS', description: 'Garantia.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor.' },
    ],
};


// ============================================
// CAFETEIRAS - P8 Stub (maturity: stub)
// ============================================

export const ESPRESSO_MACHINE_CATEGORY: CategoryDefinition = {
    id: 'espresso-machine',
    name: 'Cafeteiras',
    nameSingular: 'Cafeteira',
    slug: 'cafeteiras',
    description: 'Compare os melhores cafeteiras.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.15, group: 'QS', description: 'Potência/resultado.' },
        { id: 'c2', label: 'Capacidade', weight: 0.12, group: 'QS', description: 'Volume/tamanho.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Modos/programas.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção.' },
        { id: 'c5', label: 'Praticidade', weight: 0.12, group: 'GS', description: 'Limpeza/uso.' },
        { id: 'c6', label: 'Segurança', weight: 0.08, group: 'GS', description: 'Proteções.' },
        { id: 'c7', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética cozinha.' },
        { id: 'c8', label: 'Consumo', weight: 0.08, group: 'QS', description: 'Energia/gás.' },
        { id: 'c9', label: 'Suporte', weight: 0.05, group: 'GS', description: 'Garantia.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor.' },
    ],
};


// ============================================
// BATEDEIRAS - P8 Stub (maturity: stub)
// ============================================

export const MIXER_CATEGORY: CategoryDefinition = {
    id: 'mixer',
    name: 'Batedeiras',
    nameSingular: 'Batedeira',
    slug: 'batedeiras',
    description: 'Compare os melhores batedeiras.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.15, group: 'QS', description: 'Potência/resultado.' },
        { id: 'c2', label: 'Capacidade', weight: 0.12, group: 'QS', description: 'Volume/tamanho.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Modos/programas.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção.' },
        { id: 'c5', label: 'Praticidade', weight: 0.12, group: 'GS', description: 'Limpeza/uso.' },
        { id: 'c6', label: 'Segurança', weight: 0.08, group: 'GS', description: 'Proteções.' },
        { id: 'c7', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética cozinha.' },
        { id: 'c8', label: 'Consumo', weight: 0.08, group: 'QS', description: 'Energia/gás.' },
        { id: 'c9', label: 'Suporte', weight: 0.05, group: 'GS', description: 'Garantia.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor.' },
    ],
};


// ============================================
// PURIFICADORES - P8 Stub (maturity: stub)
// ============================================

export const WATER_PURIFIER_CATEGORY: CategoryDefinition = {
    id: 'water-purifier',
    name: 'Purificadores',
    nameSingular: 'Purificadore',
    slug: 'purificadores',
    description: 'Compare os melhores purificadores.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.15, group: 'QS', description: 'Potência/resultado.' },
        { id: 'c2', label: 'Capacidade', weight: 0.12, group: 'QS', description: 'Volume/tamanho.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Modos/programas.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção.' },
        { id: 'c5', label: 'Praticidade', weight: 0.12, group: 'GS', description: 'Limpeza/uso.' },
        { id: 'c6', label: 'Segurança', weight: 0.08, group: 'GS', description: 'Proteções.' },
        { id: 'c7', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética cozinha.' },
        { id: 'c8', label: 'Consumo', weight: 0.08, group: 'QS', description: 'Energia/gás.' },
        { id: 'c9', label: 'Suporte', weight: 0.05, group: 'GS', description: 'Garantia.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor.' },
    ],
};


// ============================================
// MIXERS - P8 Stub (maturity: stub)
// ============================================

export const FOOD_MIXER_CATEGORY: CategoryDefinition = {
    id: 'food-mixer',
    name: 'Mixers',
    nameSingular: 'Mixer',
    slug: 'mixers',
    description: 'Compare os melhores mixers.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.15, group: 'QS', description: 'Potência/resultado.' },
        { id: 'c2', label: 'Capacidade', weight: 0.12, group: 'QS', description: 'Volume/tamanho.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Modos/programas.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção.' },
        { id: 'c5', label: 'Praticidade', weight: 0.12, group: 'GS', description: 'Limpeza/uso.' },
        { id: 'c6', label: 'Segurança', weight: 0.08, group: 'GS', description: 'Proteções.' },
        { id: 'c7', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética cozinha.' },
        { id: 'c8', label: 'Consumo', weight: 0.08, group: 'QS', description: 'Energia/gás.' },
        { id: 'c9', label: 'Suporte', weight: 0.05, group: 'GS', description: 'Garantia.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor.' },
    ],
};


// ============================================
// LAVA E SECA - P8 Stub (maturity: stub)
// ============================================

export const WASHER_DRYER_CATEGORY: CategoryDefinition = {
    id: 'washer-dryer',
    name: 'Lava e Seca',
    nameSingular: 'Lava e Seca',
    slug: 'lava-e-seca',
    description: 'Compare os melhores lava e seca.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Capacidade', weight: 0.15, group: 'QS', description: 'Tamanho/volume.' },
        { id: 'c2', label: 'Eficiência', weight: 0.15, group: 'QS', description: 'Consumo energia.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Funcionalidades.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Vida útil.' },
        { id: 'c5', label: 'Praticidade', weight: 0.1, group: 'GS', description: 'Facilidade uso.' },
        { id: 'c6', label: 'Ruído', weight: 0.08, group: 'QS', description: 'Nível sonoro.' },
        { id: 'c7', label: 'Conectividade', weight: 0.05, group: 'GS', description: 'Smart/WiFi.' },
        { id: 'c8', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética.' },
        { id: 'c9', label: 'Suporte', weight: 0.07, group: 'GS', description: 'Assistência.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor.' },
    ],
};


// ============================================
// ASPIRADORES - P8 Stub (maturity: stub)
// ============================================

export const STICK_VACUUM_CATEGORY: CategoryDefinition = {
    id: 'stick-vacuum',
    name: 'Aspiradores',
    nameSingular: 'Aspiradore',
    slug: 'aspiradores',
    description: 'Compare os melhores aspiradores.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.15, group: 'QS', description: 'Desempenho geral.' },
        { id: 'c2', label: 'Eficiência', weight: 0.12, group: 'QS', description: 'Eficiência energética/operacional.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Funcionalidades e features.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção e vida útil.' },
        { id: 'c5', label: 'Usabilidade', weight: 0.1, group: 'GS', description: 'Facilidade de uso.' },
        { id: 'c6', label: 'Ruído', weight: 0.08, group: 'QS', description: 'Nível de ruído.' },
        { id: 'c7', label: 'Conectividade', weight: 0.08, group: 'GS', description: 'Conexões e integração.' },
        { id: 'c8', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética e acabamento.' },
        { id: 'c9', label: 'Suporte', weight: 0.07, group: 'GS', description: 'Garantia e assistência.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor pelo preço.' },
    ],
};


// ============================================
// LAVADORAS PRESSÃO - P8 Stub (maturity: stub)
// ============================================

export const PRESSURE_WASHER_CATEGORY: CategoryDefinition = {
    id: 'pressure-washer',
    name: 'Lavadoras Pressão',
    nameSingular: 'Lavadoras Pressão',
    slug: 'lavadoras-pressao',
    description: 'Compare os melhores lavadoras pressão.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.15, group: 'QS', description: 'Desempenho geral.' },
        { id: 'c2', label: 'Eficiência', weight: 0.12, group: 'QS', description: 'Eficiência energética/operacional.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Funcionalidades e features.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção e vida útil.' },
        { id: 'c5', label: 'Usabilidade', weight: 0.1, group: 'GS', description: 'Facilidade de uso.' },
        { id: 'c6', label: 'Ruído', weight: 0.08, group: 'QS', description: 'Nível de ruído.' },
        { id: 'c7', label: 'Conectividade', weight: 0.08, group: 'GS', description: 'Conexões e integração.' },
        { id: 'c8', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética e acabamento.' },
        { id: 'c9', label: 'Suporte', weight: 0.07, group: 'GS', description: 'Garantia e assistência.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor pelo preço.' },
    ],
};


// ============================================
// CÂMERAS SEGURANÇA - P8 Stub (maturity: stub)
// ============================================

export const SECURITY_CAMERA_CATEGORY: CategoryDefinition = {
    id: 'security-camera',
    name: 'Câmeras Segurança',
    nameSingular: 'Câmeras Segurança',
    slug: 'cameras-seguranca',
    description: 'Compare os melhores câmeras segurança.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.15, group: 'QS', description: 'Desempenho geral.' },
        { id: 'c2', label: 'Eficiência', weight: 0.12, group: 'QS', description: 'Eficiência energética/operacional.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Funcionalidades e features.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção e vida útil.' },
        { id: 'c5', label: 'Usabilidade', weight: 0.1, group: 'GS', description: 'Facilidade de uso.' },
        { id: 'c6', label: 'Ruído', weight: 0.08, group: 'QS', description: 'Nível de ruído.' },
        { id: 'c7', label: 'Conectividade', weight: 0.08, group: 'GS', description: 'Conexões e integração.' },
        { id: 'c8', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética e acabamento.' },
        { id: 'c9', label: 'Suporte', weight: 0.07, group: 'GS', description: 'Garantia e assistência.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor pelo preço.' },
    ],
};


// ============================================
// FECHADURAS DIGITAIS - P8 Stub (maturity: stub)
// ============================================

export const SMART_LOCK_CATEGORY: CategoryDefinition = {
    id: 'smart-lock',
    name: 'Fechaduras Digitais',
    nameSingular: 'Fechaduras Digitai',
    slug: 'fechaduras-digitais',
    description: 'Compare os melhores fechaduras digitais.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.15, group: 'QS', description: 'Desempenho geral.' },
        { id: 'c2', label: 'Eficiência', weight: 0.12, group: 'QS', description: 'Eficiência energética/operacional.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Funcionalidades e features.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção e vida útil.' },
        { id: 'c5', label: 'Usabilidade', weight: 0.1, group: 'GS', description: 'Facilidade de uso.' },
        { id: 'c6', label: 'Ruído', weight: 0.08, group: 'QS', description: 'Nível de ruído.' },
        { id: 'c7', label: 'Conectividade', weight: 0.08, group: 'GS', description: 'Conexões e integração.' },
        { id: 'c8', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética e acabamento.' },
        { id: 'c9', label: 'Suporte', weight: 0.07, group: 'GS', description: 'Garantia e assistência.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor pelo preço.' },
    ],
};


// ============================================
// NOBREAKS - P8 Stub (maturity: stub)
// ============================================

export const UPS_CATEGORY: CategoryDefinition = {
    id: 'ups',
    name: 'Nobreaks',
    nameSingular: 'Nobreak',
    slug: 'nobreaks',
    description: 'Compare os melhores nobreaks.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.15, group: 'QS', description: 'Desempenho geral.' },
        { id: 'c2', label: 'Eficiência', weight: 0.12, group: 'QS', description: 'Eficiência energética/operacional.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Funcionalidades e features.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção e vida útil.' },
        { id: 'c5', label: 'Usabilidade', weight: 0.1, group: 'GS', description: 'Facilidade de uso.' },
        { id: 'c6', label: 'Ruído', weight: 0.08, group: 'QS', description: 'Nível de ruído.' },
        { id: 'c7', label: 'Conectividade', weight: 0.08, group: 'GS', description: 'Conexões e integração.' },
        { id: 'c8', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética e acabamento.' },
        { id: 'c9', label: 'Suporte', weight: 0.07, group: 'GS', description: 'Garantia e assistência.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor pelo preço.' },
    ],
};


// ============================================
// FILTROS DE LINHA - P8 Stub (maturity: stub)
// ============================================

export const POWER_STRIP_CATEGORY: CategoryDefinition = {
    id: 'power-strip',
    name: 'Filtros de Linha',
    nameSingular: 'Filtros de Linha',
    slug: 'filtros-de-linha',
    description: 'Compare os melhores filtros de linha.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.15, group: 'QS', description: 'Desempenho geral.' },
        { id: 'c2', label: 'Eficiência', weight: 0.12, group: 'QS', description: 'Eficiência energética/operacional.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Funcionalidades e features.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção e vida útil.' },
        { id: 'c5', label: 'Usabilidade', weight: 0.1, group: 'GS', description: 'Facilidade de uso.' },
        { id: 'c6', label: 'Ruído', weight: 0.08, group: 'QS', description: 'Nível de ruído.' },
        { id: 'c7', label: 'Conectividade', weight: 0.08, group: 'GS', description: 'Conexões e integração.' },
        { id: 'c8', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética e acabamento.' },
        { id: 'c9', label: 'Suporte', weight: 0.07, group: 'GS', description: 'Garantia e assistência.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor pelo preço.' },
    ],
};


// ============================================
// CÂMERAS - P8 Stub (maturity: stub)
// ============================================

export const CAMERA_CATEGORY: CategoryDefinition = {
    id: 'camera',
    name: 'Câmeras',
    nameSingular: 'Câmera',
    slug: 'cameras',
    description: 'Compare os melhores câmeras.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.15, group: 'QS', description: 'Desempenho geral.' },
        { id: 'c2', label: 'Eficiência', weight: 0.12, group: 'QS', description: 'Eficiência energética/operacional.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Funcionalidades e features.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção e vida útil.' },
        { id: 'c5', label: 'Usabilidade', weight: 0.1, group: 'GS', description: 'Facilidade de uso.' },
        { id: 'c6', label: 'Ruído', weight: 0.08, group: 'QS', description: 'Nível de ruído.' },
        { id: 'c7', label: 'Conectividade', weight: 0.08, group: 'GS', description: 'Conexões e integração.' },
        { id: 'c8', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética e acabamento.' },
        { id: 'c9', label: 'Suporte', weight: 0.07, group: 'GS', description: 'Garantia e assistência.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor pelo preço.' },
    ],
};


// ============================================
// PNEUS - P8 Stub (maturity: stub)
// ============================================

export const TIRE_CATEGORY: CategoryDefinition = {
    id: 'tire',
    name: 'Pneus',
    nameSingular: 'Pneu',
    slug: 'pneus',
    description: 'Compare os melhores pneus.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.15, group: 'QS', description: 'Desempenho geral.' },
        { id: 'c2', label: 'Eficiência', weight: 0.12, group: 'QS', description: 'Eficiência energética/operacional.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Funcionalidades e features.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção e vida útil.' },
        { id: 'c5', label: 'Usabilidade', weight: 0.1, group: 'GS', description: 'Facilidade de uso.' },
        { id: 'c6', label: 'Ruído', weight: 0.08, group: 'QS', description: 'Nível de ruído.' },
        { id: 'c7', label: 'Conectividade', weight: 0.08, group: 'GS', description: 'Conexões e integração.' },
        { id: 'c8', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética e acabamento.' },
        { id: 'c9', label: 'Suporte', weight: 0.07, group: 'GS', description: 'Garantia e assistência.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor pelo preço.' },
    ],
};


// ============================================
// BATERIAS - P8 Stub (maturity: stub)
// ============================================

export const CAR_BATTERY_CATEGORY: CategoryDefinition = {
    id: 'car-battery',
    name: 'Baterias',
    nameSingular: 'Bateria',
    slug: 'baterias',
    description: 'Compare os melhores baterias.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.15, group: 'QS', description: 'Desempenho geral.' },
        { id: 'c2', label: 'Eficiência', weight: 0.12, group: 'QS', description: 'Eficiência energética/operacional.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Funcionalidades e features.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção e vida útil.' },
        { id: 'c5', label: 'Usabilidade', weight: 0.1, group: 'GS', description: 'Facilidade de uso.' },
        { id: 'c6', label: 'Ruído', weight: 0.08, group: 'QS', description: 'Nível de ruído.' },
        { id: 'c7', label: 'Conectividade', weight: 0.08, group: 'GS', description: 'Conexões e integração.' },
        { id: 'c8', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética e acabamento.' },
        { id: 'c9', label: 'Suporte', weight: 0.07, group: 'GS', description: 'Garantia e assistência.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor pelo preço.' },
    ],
};


// ============================================
// PARAFUSADEIRAS - P8 Stub (maturity: stub)
// ============================================

export const DRILL_CATEGORY: CategoryDefinition = {
    id: 'drill',
    name: 'Parafusadeiras',
    nameSingular: 'Parafusadeira',
    slug: 'parafusadeiras',
    description: 'Compare os melhores parafusadeiras.',
    icon: 'Package',
    maturity: 'stub', // P8: Categoria stub, aguardando playbook real
    criteria: [
        { id: 'c1', label: 'Performance', weight: 0.15, group: 'QS', description: 'Desempenho geral.' },
        { id: 'c2', label: 'Eficiência', weight: 0.12, group: 'QS', description: 'Eficiência energética/operacional.' },
        { id: 'c3', label: 'Recursos', weight: 0.12, group: 'QS', description: 'Funcionalidades e features.' },
        { id: 'c4', label: 'Durabilidade', weight: 0.1, group: 'GS', description: 'Construção e vida útil.' },
        { id: 'c5', label: 'Usabilidade', weight: 0.1, group: 'GS', description: 'Facilidade de uso.' },
        { id: 'c6', label: 'Ruído', weight: 0.08, group: 'QS', description: 'Nível de ruído.' },
        { id: 'c7', label: 'Conectividade', weight: 0.08, group: 'GS', description: 'Conexões e integração.' },
        { id: 'c8', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética e acabamento.' },
        { id: 'c9', label: 'Suporte', weight: 0.07, group: 'GS', description: 'Garantia e assistência.' },
        { id: 'c10', label: 'Custo-Benefício', weight: 0.1, group: 'VS', description: 'Valor pelo preço.' },
    ],
};

export const CATEGORIES: Record<string, CategoryDefinition> = {
    tv: TV_CATEGORY,
    fridge: FRIDGE_CATEGORY,
    air_conditioner: AC_CATEGORY,
    smartphone: SMARTPHONE_CATEGORY,
    'robot-vacuum': ROBOT_VACUUM_CATEGORY,
    // P6: 6 novas categorias
    smartwatch: SMARTWATCH_CATEGORY,
    laptop: LAPTOP_CATEGORY,
    washer: WASHER_CATEGORY,
    monitor: MONITOR_CATEGORY,
    tablet: TABLET_CATEGORY,
    soundbar: SOUNDBAR_CATEGORY,
    // P8: 42 stubs de categorias
    'tws': TWS_CATEGORY,
    'bluetooth-speaker': BLUETOOTH_SPEAKER_CATEGORY,
    'console': CONSOLE_CATEGORY,
    'headset-gamer': HEADSET_GAMER_CATEGORY,
    'gamepad': GAMEPAD_CATEGORY,
    'chair': CHAIR_CATEGORY,
    'projector': PROJECTOR_CATEGORY,
    'tvbox': TVBOX_CATEGORY,
    'printer': PRINTER_CATEGORY,
    'router': ROUTER_CATEGORY,
    'cpu': CPU_CATEGORY,
    'gpu': GPU_CATEGORY,
    'motherboard': MOTHERBOARD_CATEGORY,
    'ram': RAM_CATEGORY,
    'ssd': SSD_CATEGORY,
    'psu': PSU_CATEGORY,
    'case': CASE_CATEGORY,
    'freezer': FREEZER_CATEGORY,
    'minibar': MINIBAR_CATEGORY,
    'wine-cooler': WINE_COOLER_CATEGORY,
    'fan': FAN_CATEGORY,
    'stove': STOVE_CATEGORY,
    'builtin-oven': BUILTIN_OVEN_CATEGORY,
    'microwave': MICROWAVE_CATEGORY,
    'air-fryer': AIR_FRYER_CATEGORY,
    'range-hood': RANGE_HOOD_CATEGORY,
    'dishwasher': DISHWASHER_CATEGORY,
    'espresso-machine': ESPRESSO_MACHINE_CATEGORY,
    'mixer': MIXER_CATEGORY,
    'water-purifier': WATER_PURIFIER_CATEGORY,
    'food-mixer': FOOD_MIXER_CATEGORY,
    'washer-dryer': WASHER_DRYER_CATEGORY,
    'stick-vacuum': STICK_VACUUM_CATEGORY,
    'pressure-washer': PRESSURE_WASHER_CATEGORY,
    'security-camera': SECURITY_CAMERA_CATEGORY,
    'smart-lock': SMART_LOCK_CATEGORY,
    'ups': UPS_CATEGORY,
    'power-strip': POWER_STRIP_CATEGORY,
    'camera': CAMERA_CATEGORY,
    'tire': TIRE_CATEGORY,
    'car-battery': CAR_BATTERY_CATEGORY,
    'drill': DRILL_CATEGORY,
};

/**
 * Get a category by ID
 */
export function getCategoryById(id: string): CategoryDefinition | null {
    return CATEGORIES[id] ?? null;
}

/**
 * Get all category IDs
 */
export function getAllCategoryIds(): string[] {
    return Object.keys(CATEGORIES);
}

/**
 * Get all categories as array
 */
export function getAllCategories(): CategoryDefinition[] {
    return Object.values(CATEGORIES);
}

/**
 * Reference prices for VS calculation (normalized pricing)
 * These represent the "expensive" threshold for each category
 */
export const REFERENCE_PRICES: Record<string, number> = {
    tv: 15000,
    fridge: 12000,
    air_conditioner: 5000,
    smartphone: 5000,
    'robot-vacuum': 4000,
    // P6: 6 novas categorias
    smartwatch: 3000,
    laptop: 8000,
    washer: 4000,
    monitor: 4000,
    tablet: 4000,
    soundbar: 3000,
    // P8: 42 stubs
    'tws': 1500,
    'bluetooth-speaker': 1000,
    'console': 4000,
    'headset-gamer': 800,
    'gamepad': 400,
    'chair': 2000,
    'projector': 5000,
    'tvbox': 500,
    'printer': 1500,
    'router': 600,
    'cpu': 3000,
    'gpu': 5000,
    'motherboard': 2000,
    'ram': 600,
    'ssd': 800,
    'psu': 800,
    'case': 600,
    'freezer': 4000,
    'minibar': 1500,
    'wine-cooler': 3000,
    'fan': 400,
    'stove': 3000,
    'builtin-oven': 3500,
    'microwave': 800,
    'air-fryer': 600,
    'range-hood': 1500,
    'dishwasher': 4000,
    'espresso-machine': 2000,
    'mixer': 800,
    'water-purifier': 1500,
    'food-mixer': 400,
    'washer-dryer': 5000,
    'stick-vacuum': 2000,
    'pressure-washer': 1500,
    'security-camera': 800,
    'smart-lock': 1000,
    'ups': 1500,
    'power-strip': 150,
    'camera': 5000,
    'tire': 600,
    'car-battery': 600,
    'drill': 800,
};

/**
 * Get reference price for a category
 */
export function getReferencePrice(categoryId: string): number {
    return REFERENCE_PRICES[categoryId] ?? 10000;
}
