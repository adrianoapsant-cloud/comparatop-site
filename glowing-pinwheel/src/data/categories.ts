/**
 * Category Definitions - Server Data
 * 
 * @description Each category defines its own "10 Pain Criteria".
 * This is the source of truth for scoring rules.
 * 
 * IMPORTANT: Weights within each category must sum to 1.0
 */

import type { CategoryDefinition } from '@/types/category';

// ============================================
// SMART TVs
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
            label: 'Qualidade de Imagem',
            weight: 0.18,
            group: 'QS',
            description: 'Contraste, cores, HDR e processamento de imagem.',
            icon: 'Image',
        },
        {
            id: 'c2',
            label: 'Processamento de Imagem',
            weight: 0.12,
            group: 'QS',
            description: 'Upscaling, redução de ruído e tecnologias de IA.',
            icon: 'Cpu',
        },
        {
            id: 'c3',
            label: 'Confiabilidade do Hardware',
            weight: 0.10,
            group: 'QS',
            description: 'Qualidade de construção e durabilidade.',
            icon: 'Shield',
        },
        {
            id: 'c4',
            label: 'Fluidez do Sistema',
            weight: 0.08,
            group: 'QS',
            description: 'Velocidade do SO, responsividade e apps.',
            icon: 'Zap',
        },
        {
            id: 'c5',
            label: 'Desempenho em Games',
            weight: 0.10,
            group: 'QS',
            description: 'Input lag, VRR, ALLM e recursos gaming.',
            icon: 'Gamepad2',
        },
        {
            id: 'c6',
            label: 'Brilho e Reflexo',
            weight: 0.08,
            group: 'QS',
            description: 'Brilho máximo e tratamento anti-reflexo.',
            icon: 'Sun',
        },
        {
            id: 'c7',
            label: 'Custo-Benefício',
            weight: 0.14,
            group: 'VS',
            description: 'Relação entre preço e qualidade entregue.',
            icon: 'PiggyBank',
        },
        {
            id: 'c8',
            label: 'Pós-Venda e Suporte',
            weight: 0.06,
            group: 'VS',
            description: 'Garantia, assistência técnica e reputação.',
            icon: 'HeadphonesIcon',
        },
        {
            id: 'c9',
            label: 'Qualidade de Som',
            weight: 0.06,
            group: 'GS',
            description: 'Áudio embutido, potência e tecnologias.',
            icon: 'Volume2',
        },
        {
            id: 'c10',
            label: 'Design e Conectividade',
            weight: 0.08,
            group: 'GS',
            description: 'Estética, portas HDMI/USB e recursos smart.',
            icon: 'MonitorSmartphone',
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
                c4: 0.12, // Fluidez +
                c1: 0.15, // Imagem -
                c9: 0.04, // Som -
            },
        },
        {
            id: 'cinema',
            name: 'Cinéfilo',
            description: 'Foco em qualidade de imagem e HDR.',
            icon: '🎬',
            weightOverrides: {
                c1: 0.25, // Imagem +
                c2: 0.15, // Processamento +
                c6: 0.12, // Brilho +
                c5: 0.05, // Gaming -
            },
        },
        {
            id: 'budget',
            name: 'Econômico',
            description: 'Máximo custo-benefício.',
            icon: '💰',
            weightOverrides: {
                c7: 0.25, // Custo-benefício +
                c8: 0.10, // Pós-venda +
                c1: 0.12, // Imagem -
                c5: 0.05, // Gaming -
            },
        },
    ],
};

// ============================================
// GELADEIRAS / REFRIGERADORES
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
            label: 'Capacidade e Espaço',
            weight: 0.15,
            group: 'QS',
            description: 'Litros totais, organização interna e flexibilidade.',
            icon: 'Package',
        },
        {
            id: 'c2',
            label: 'Eficiência Energética',
            weight: 0.18,
            group: 'VS',
            description: 'Selo Procel, consumo em kWh/mês.',
            icon: 'Leaf',
        },
        {
            id: 'c3',
            label: 'Sistema de Refrigeração',
            weight: 0.14,
            group: 'QS',
            description: 'Frost Free, Twin Cooling, tecnologia inverter.',
            icon: 'Snowflake',
        },
        {
            id: 'c4',
            label: 'Confiabilidade',
            weight: 0.10,
            group: 'QS',
            description: 'Durabilidade, histórico de falhas e garantia.',
            icon: 'Shield',
        },
        {
            id: 'c5',
            label: 'Nível de Ruído',
            weight: 0.06,
            group: 'GS',
            description: 'Decibéis em operação normal.',
            icon: 'VolumeX',
        },
        {
            id: 'c6',
            label: 'Recursos Smart',
            weight: 0.05,
            group: 'GS',
            description: 'Conectividade, display e recursos inteligentes.',
            icon: 'Wifi',
        },
        {
            id: 'c7',
            label: 'Custo-Benefício',
            weight: 0.14,
            group: 'VS',
            description: 'Preço vs. recursos e qualidade.',
            icon: 'PiggyBank',
        },
        {
            id: 'c8',
            label: 'Pós-Venda e Suporte',
            weight: 0.06,
            group: 'VS',
            description: 'Rede de assistência e reputação.',
            icon: 'HeadphonesIcon',
        },
        {
            id: 'c9',
            label: 'Design e Acabamento',
            weight: 0.06,
            group: 'GS',
            description: 'Estética, material e integração na cozinha.',
            icon: 'Sparkles',
        },
        {
            id: 'c10',
            label: 'Funcionalidades Extras',
            weight: 0.06,
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
                c7: 0.20, // Custo-benefício +
                c6: 0.02, // Smart -
                c9: 0.03, // Design -
            },
        },
        {
            id: 'family',
            name: 'Família Grande',
            description: 'Máxima capacidade e organização.',
            icon: '👨‍👩‍👧‍👦',
            weightOverrides: {
                c1: 0.25, // Capacidade +
                c3: 0.18, // Refrigeração +
                c6: 0.02, // Smart -
            },
        },
    ],
};

// ============================================
// NOTEBOOKS / LAPTOPS
// ============================================

export const LAPTOP_CATEGORY: CategoryDefinition = {
    id: 'laptop',
    name: 'Notebooks',
    nameSingular: 'Notebook',
    slug: 'notebooks',
    description: 'Compare os melhores notebooks para trabalho, estudo e games.',
    icon: 'Laptop',
    criteria: [
        {
            id: 'c1',
            label: 'Desempenho (CPU)',
            weight: 0.16,
            group: 'QS',
            description: 'Processador, núcleos e velocidade.',
            icon: 'Cpu',
        },
        {
            id: 'c2',
            label: 'Desempenho (GPU)',
            weight: 0.12,
            group: 'QS',
            description: 'Placa de vídeo dedicada ou integrada.',
            icon: 'Monitor',
        },
        {
            id: 'c3',
            label: 'Qualidade da Tela',
            weight: 0.12,
            group: 'QS',
            description: 'Resolução, brilho, cores e taxa de atualização.',
            icon: 'MonitorSmartphone',
        },
        {
            id: 'c4',
            label: 'Bateria',
            weight: 0.10,
            group: 'QS',
            description: 'Duração real e velocidade de recarga.',
            icon: 'Battery',
        },
        {
            id: 'c5',
            label: 'Construção e Portabilidade',
            weight: 0.08,
            group: 'GS',
            description: 'Material, peso e espessura.',
            icon: 'Briefcase',
        },
        {
            id: 'c6',
            label: 'Teclado e Trackpad',
            weight: 0.06,
            group: 'GS',
            description: 'Qualidade de digitação e precisão do touchpad.',
            icon: 'Keyboard',
        },
        {
            id: 'c7',
            label: 'Custo-Benefício',
            weight: 0.14,
            group: 'VS',
            description: 'Preço vs. especificações e qualidade.',
            icon: 'PiggyBank',
        },
        {
            id: 'c8',
            label: 'Armazenamento e RAM',
            weight: 0.08,
            group: 'QS',
            description: 'SSD, expansibilidade e memória.',
            icon: 'HardDrive',
        },
        {
            id: 'c9',
            label: 'Ruído e Temperatura',
            weight: 0.06,
            group: 'GS',
            description: 'Sistema de resfriamento e ruído do cooler.',
            icon: 'Fan',
        },
        {
            id: 'c10',
            label: 'Conectividade',
            weight: 0.08,
            group: 'GS',
            description: 'Portas USB-C, HDMI, Wi-Fi 6 e Bluetooth.',
            icon: 'Plug',
        },
    ],
    profiles: [
        {
            id: 'balanced',
            name: 'Equilibrado',
            description: 'Uso geral versátil.',
            icon: '⚖️',
            weightOverrides: {},
        },
        {
            id: 'gamer',
            name: 'Gamer',
            description: 'Máximo desempenho em jogos.',
            icon: '🎮',
            weightOverrides: {
                c2: 0.22, // GPU +
                c1: 0.18, // CPU +
                c3: 0.14, // Tela +
                c4: 0.05, // Bateria -
                c5: 0.04, // Portabilidade -
            },
        },
        {
            id: 'professional',
            name: 'Profissional',
            description: 'Para produtividade e criação de conteúdo.',
            icon: '💼',
            weightOverrides: {
                c3: 0.16, // Tela +
                c4: 0.14, // Bateria +
                c5: 0.12, // Portabilidade +
                c2: 0.08, // GPU -
            },
        },
        {
            id: 'student',
            name: 'Estudante',
            description: 'Custo-benefício e portabilidade.',
            icon: '📚',
            weightOverrides: {
                c7: 0.22, // Custo-benefício +
                c4: 0.14, // Bateria +
                c5: 0.12, // Portabilidade +
                c2: 0.06, // GPU -
            },
        },
    ],
};

// ============================================
// SMARTPHONES
// ============================================

export const SMARTPHONE_CATEGORY: CategoryDefinition = {
    id: 'smartphone',
    name: 'Smartphones',
    nameSingular: 'Smartphone',
    slug: 'smartphones',
    description: 'Compare os melhores smartphones com foco em autonomia real, custo-benefício e câmera social.',
    icon: 'Smartphone',
    criteria: [
        {
            id: 'c1',
            label: 'Autonomia Real (IARSE)',
            weight: 0.20,
            group: 'QS',
            description: 'Duração real da bateria, eficiência energética e carregamento rápido.',
            icon: 'Battery',
        },
        {
            id: 'c2',
            label: 'Estabilidade de Software (ESMI)',
            weight: 0.15,
            group: 'QS',
            description: 'Interface fluida, política de updates e ausência de bloatware.',
            icon: 'Cpu',
        },
        {
            id: 'c3',
            label: 'Custo-Benefício & Revenda (RCBIRV)',
            weight: 0.15,
            group: 'VS',
            description: 'Retenção de valor, liquidez de revenda e preço justo.',
            icon: 'TrendingUp',
        },
        {
            id: 'c4',
            label: 'Câmera Social (QFSR)',
            weight: 0.10,
            group: 'QS',
            description: 'Qualidade para Instagram/TikTok, OIS e fotos noturnas.',
            icon: 'Camera',
        },
        {
            id: 'c5',
            label: 'Resiliência Física (RFCT)',
            weight: 0.10,
            group: 'QS',
            description: 'Certificação IP67/68, Gorilla Glass e construção robusta.',
            icon: 'Shield',
        },
        {
            id: 'c6',
            label: 'Qualidade de Tela (QDAE)',
            weight: 0.08,
            group: 'QS',
            description: 'Brilho alto (sol forte), 120Hz AMOLED e conforto ocular.',
            icon: 'MonitorSmartphone',
        },
        {
            id: 'c7',
            label: 'Pós-Venda & Peças (EPST)',
            weight: 0.08,
            group: 'VS',
            description: 'Garantia nacional, rede de assistência e disponibilidade de peças.',
            icon: 'HeadphonesIcon',
        },
        {
            id: 'c8',
            label: 'Conectividade (CPI)',
            weight: 0.07,
            group: 'GS',
            description: 'NFC obrigatório, 5G/4G estável e suporte a eSIM.',
            icon: 'Wifi',
        },
        {
            id: 'c9',
            label: 'Armazenamento (AGD)',
            weight: 0.05,
            group: 'GS',
            description: 'Mínimo 128GB, memória UFS rápida e slot MicroSD.',
            icon: 'HardDrive',
        },
        {
            id: 'c10',
            label: 'Recursos Úteis (IFM)',
            weight: 0.02,
            group: 'GS',
            description: 'IA útil, som estéreo e modo desktop (DeX).',
            icon: 'Sparkles',
        },
    ],
    profiles: [
        {
            id: 'balanced',
            name: 'Equilibrado',
            description: 'Uso geral versátil.',
            icon: '⚖️',
            weightOverrides: {},
        },
        {
            id: 'social',
            name: 'Redes Sociais',
            description: 'Foco em câmera e integração social.',
            icon: '📸',
            weightOverrides: {
                c4: 0.20, // Câmera Social +
                c6: 0.12, // Tela +
                c1: 0.15, // Autonomia -
            },
        },
        {
            id: 'battery',
            name: 'Bateria',
            description: 'Máxima autonomia para uso intenso.',
            icon: '🔋',
            weightOverrides: {
                c1: 0.30, // Autonomia +
                c4: 0.06, // Câmera -
                c10: 0.01, // Recursos -
            },
        },
        {
            id: 'budget',
            name: 'Econômico',
            description: 'Máximo custo-benefício.',
            icon: '💰',
            weightOverrides: {
                c3: 0.25, // Custo-benefício +
                c7: 0.12, // Pós-venda +
                c4: 0.05, // Câmera -
            },
        },
        {
            id: 'clumsy',
            name: 'Desastrado',
            description: 'Resistência a quedas e água.',
            icon: '💪',
            weightOverrides: {
                c5: 0.22, // Resiliência +
                c7: 0.12, // Pós-venda +
                c10: 0.01, // Recursos -
            },
        },
    ],
};

// ============================================
// AR-CONDICIONADO
// ============================================

export const AC_CATEGORY: CategoryDefinition = {
    id: 'air_conditioner',
    name: 'Ar-Condicionados',
    nameSingular: 'Ar-Condicionado',
    slug: 'ar-condicionados',
    description: 'Compare os melhores ar-condicionados split inverter e convencionais.',
    icon: 'Wind',
    criteria: [
        {
            id: 'c1',
            label: 'Eficiência Energética',
            weight: 0.18,
            group: 'VS',
            description: 'Selo Procel, IDRS e tecnologia Inverter.',
            icon: 'Leaf',
        },
        {
            id: 'c2',
            label: 'Qualidade de Refrigeração',
            weight: 0.16,
            group: 'QS',
            description: 'Capacidade BTU, alcance e uniformidade.',
            icon: 'Snowflake',
        },
        {
            id: 'c3',
            label: 'Nível de Ruído',
            weight: 0.12,
            group: 'QS',
            description: 'Decibéis da unidade interna e externa.',
            icon: 'VolumeX',
        },
        {
            id: 'c4',
            label: 'Durabilidade/Corrosão',
            weight: 0.12,
            group: 'QS',
            description: 'Material da serpentina, proteção Gold/Blue Fin.',
            icon: 'Shield',
        },
        {
            id: 'c5',
            label: 'Recursos Smart',
            weight: 0.08,
            group: 'GS',
            description: 'Wi-Fi, app, comandos de voz e programação.',
            icon: 'Wifi',
        },
        {
            id: 'c6',
            label: 'Custo-Benefício',
            weight: 0.12,
            group: 'VS',
            description: 'Preço de compra e custo operacional.',
            icon: 'PiggyBank',
        },
        {
            id: 'c7',
            label: 'Pós-Venda',
            weight: 0.08,
            group: 'VS',
            description: 'Garantia, assistência e disponibilidade de peças.',
            icon: 'HeadphonesIcon',
        },
        {
            id: 'c8',
            label: 'Qualidade do Ar',
            weight: 0.06,
            group: 'GS',
            description: 'Filtros, ionização e funções de limpeza.',
            icon: 'Wind',
        },
        {
            id: 'c9',
            label: 'Facilidade de Instalação',
            weight: 0.04,
            group: 'GS',
            description: 'Peso, dimensões e complexidade.',
            icon: 'Wrench',
        },
        {
            id: 'c10',
            label: 'Acessibilidade',
            weight: 0.04,
            group: 'GS',
            description: 'Interface simples, controle intuitivo.',
            icon: 'Users',
        },
    ],
    profiles: [
        {
            id: 'balanced',
            name: 'Equilibrado',
            description: 'Uso residencial padrão.',
            icon: '⚖️',
            weightOverrides: {},
        },
        {
            id: 'coastal',
            name: 'Litoral',
            description: 'Resistência à maresia é crítica.',
            icon: '🏖️',
            weightOverrides: {
                c4: 0.28, // Durabilidade/Corrosão +
                c1: 0.12, // Eficiência -
            },
        },
        {
            id: 'bedroom',
            name: 'Quarto',
            description: 'Silêncio para dormir.',
            icon: '🛏️',
            weightOverrides: {
                c3: 0.25, // Ruído +
                c2: 0.12, // Refrigeração -
            },
        },
        {
            id: 'economy',
            name: 'Econômico',
            description: 'Foco em reduzir conta de luz.',
            icon: '💡',
            weightOverrides: {
                c1: 0.28, // Eficiência +
                c5: 0.04, // Smart -
            },
        },
    ],
};

// ============================================
// MÁQUINAS DE LAVAR
// ============================================

export const WASHER_CATEGORY: CategoryDefinition = {
    id: 'washer',
    name: 'Máquinas de Lavar',
    nameSingular: 'Máquina de Lavar',
    slug: 'maquinas-de-lavar',
    description: 'Compare as melhores lavadoras de roupas automáticas.',
    icon: 'Waves',
    criteria: [
        {
            id: 'c1',
            label: 'Eficiência de Lavagem',
            weight: 0.18,
            group: 'QS',
            description: 'Remoção de manchas e limpeza geral.',
            icon: 'Sparkles',
        },
        {
            id: 'c2',
            label: 'Capacidade',
            weight: 0.14,
            group: 'QS',
            description: 'Quilos de roupa seca e tamanho do cesto.',
            icon: 'Package',
        },
        {
            id: 'c3',
            label: 'Eficiência Energética',
            weight: 0.12,
            group: 'VS',
            description: 'Consumo de água e energia.',
            icon: 'Leaf',
        },
        {
            id: 'c4',
            label: 'Durabilidade',
            weight: 0.12,
            group: 'QS',
            description: 'Motor, tambor e placa eletrônica.',
            icon: 'Shield',
        },
        {
            id: 'c5',
            label: 'Nível de Ruído',
            weight: 0.10,
            group: 'QS',
            description: 'Decibéis em lavagem e centrifugação.',
            icon: 'VolumeX',
        },
        {
            id: 'c6',
            label: 'Custo-Benefício',
            weight: 0.12,
            group: 'VS',
            description: 'Preço vs. recursos e durabilidade.',
            icon: 'PiggyBank',
        },
        {
            id: 'c7',
            label: 'Ciclos Especiais',
            weight: 0.08,
            group: 'GS',
            description: 'Delicados, rápido, pesado, pet.',
            icon: 'Settings',
        },
        {
            id: 'c8',
            label: 'Pós-Venda',
            weight: 0.06,
            group: 'VS',
            description: 'Garantia e rede de assistência.',
            icon: 'HeadphonesIcon',
        },
        {
            id: 'c9',
            label: 'Conectividade',
            weight: 0.04,
            group: 'GS',
            description: 'Wi-Fi, app e diagnóstico remoto.',
            icon: 'Wifi',
        },
        {
            id: 'c10',
            label: 'Ergonomia',
            weight: 0.04,
            group: 'GS',
            description: 'Altura de abertura e facilidade de uso.',
            icon: 'Users',
        },
    ],
    profiles: [
        {
            id: 'balanced',
            name: 'Equilibrado',
            description: 'Uso residencial padrão.',
            icon: '⚖️',
            weightOverrides: {},
        },
        {
            id: 'family',
            name: 'Família Grande',
            description: 'Capacidade máxima.',
            icon: '👨‍👩‍👧‍👦',
            weightOverrides: {
                c2: 0.24, // Capacidade +
                c1: 0.20, // Eficiência +
                c9: 0.02, // Conectividade -
            },
        },
        {
            id: 'apartment',
            name: 'Apartamento',
            description: 'Silêncio e baixa vibração.',
            icon: '🏢',
            weightOverrides: {
                c5: 0.22, // Ruído +
                c2: 0.10, // Capacidade -
            },
        },
        {
            id: 'pet',
            name: 'Dono de Pet',
            description: 'Remoção de pelos.',
            icon: '🐕',
            weightOverrides: {
                c7: 0.16, // Ciclos especiais +
                c1: 0.20, // Eficiência +
            },
        },
    ],
};

// ============================================
// MONITORES
// ============================================

export const MONITOR_CATEGORY: CategoryDefinition = {
    id: 'monitor',
    name: 'Monitores',
    nameSingular: 'Monitor',
    slug: 'monitores',
    description: 'Compare os melhores monitores para games, trabalho e criação.',
    icon: 'Monitor',
    criteria: [
        {
            id: 'c1',
            label: 'Qualidade de Imagem',
            weight: 0.18,
            group: 'QS',
            description: 'Painel, contraste, HDR e uniformidade.',
            icon: 'Image',
        },
        {
            id: 'c2',
            label: 'Taxa de Atualização',
            weight: 0.14,
            group: 'QS',
            description: 'Hz máximo e adaptive sync.',
            icon: 'Zap',
        },
        {
            id: 'c3',
            label: 'Tempo de Resposta',
            weight: 0.12,
            group: 'QS',
            description: 'GTG, MPRT e ghosting.',
            icon: 'Timer',
        },
        {
            id: 'c4',
            label: 'Precisão de Cores',
            weight: 0.10,
            group: 'QS',
            description: 'Delta E, sRGB, Adobe RGB e DCI-P3.',
            icon: 'Palette',
        },
        {
            id: 'c5',
            label: 'Ergonomia',
            weight: 0.10,
            group: 'GS',
            description: 'Ajuste de altura, inclinação e giro.',
            icon: 'Move',
        },
        {
            id: 'c6',
            label: 'Custo-Benefício',
            weight: 0.12,
            group: 'VS',
            description: 'Preço vs. especificações.',
            icon: 'PiggyBank',
        },
        {
            id: 'c7',
            label: 'Conectividade',
            weight: 0.08,
            group: 'GS',
            description: 'HDMI 2.1, DisplayPort, USB-C PD.',
            icon: 'Plug',
        },
        {
            id: 'c8',
            label: 'Construção',
            weight: 0.06,
            group: 'GS',
            description: 'Material, bordas e estética.',
            icon: 'Box',
        },
        {
            id: 'c9',
            label: 'Pós-Venda',
            weight: 0.06,
            group: 'VS',
            description: 'Garantia e política de pixels defeituosos.',
            icon: 'HeadphonesIcon',
        },
        {
            id: 'c10',
            label: 'Recursos Gaming',
            weight: 0.04,
            group: 'GS',
            description: 'Crosshair, contadores FPS, Black Equalizer.',
            icon: 'Gamepad2',
        },
    ],
    profiles: [
        {
            id: 'balanced',
            name: 'Equilibrado',
            description: 'Uso geral versátil.',
            icon: '⚖️',
            weightOverrides: {},
        },
        {
            id: 'gamer',
            name: 'Gamer Competitivo',
            description: 'Taxa máxima e resposta mínima.',
            icon: '🎮',
            weightOverrides: {
                c2: 0.24, // Taxa +
                c3: 0.18, // Resposta +
                c4: 0.06, // Cores -
            },
        },
        {
            id: 'creator',
            name: 'Criador/Designer',
            description: 'Precisão de cores absoluta.',
            icon: '🎨',
            weightOverrides: {
                c4: 0.24, // Cores +
                c1: 0.20, // Imagem +
                c2: 0.08, // Taxa -
            },
        },
        {
            id: 'office',
            name: 'Escritório',
            description: 'Ergonomia e conforto.',
            icon: '💼',
            weightOverrides: {
                c5: 0.18, // Ergonomia +
                c6: 0.18, // Custo-benefício +
                c10: 0.02, // Gaming -
            },
        },
    ],
};

// ============================================
// TABLETS
// ============================================

export const TABLET_CATEGORY: CategoryDefinition = {
    id: 'tablet',
    name: 'Tablets',
    nameSingular: 'Tablet',
    slug: 'tablets',
    description: 'Compare os melhores tablets para produtividade, desenho e entretenimento.',
    icon: 'Tablet',
    criteria: [
        {
            id: 'c1',
            label: 'Desempenho',
            weight: 0.16,
            group: 'QS',
            description: 'Processador, RAM e fluidez geral.',
            icon: 'Cpu',
        },
        {
            id: 'c2',
            label: 'Qualidade de Tela',
            weight: 0.14,
            group: 'QS',
            description: 'Resolução, brilho, cores e taxa de atualização.',
            icon: 'MonitorSmartphone',
        },
        {
            id: 'c3',
            label: 'Produtividade',
            weight: 0.12,
            group: 'QS',
            description: 'Modo desktop, multitarefa e compatibilidade.',
            icon: 'Briefcase',
        },
        {
            id: 'c4',
            label: 'Bateria',
            weight: 0.12,
            group: 'QS',
            description: 'Duração real e velocidade de carregamento.',
            icon: 'Battery',
        },
        {
            id: 'c5',
            label: 'Ecossistema',
            weight: 0.10,
            group: 'GS',
            description: 'Apps otimizados e integração com outros devices.',
            icon: 'Layers',
        },
        {
            id: 'c6',
            label: 'Custo-Benefício',
            weight: 0.12,
            group: 'VS',
            description: 'Preço vs. recursos.',
            icon: 'PiggyBank',
        },
        {
            id: 'c7',
            label: 'Construção',
            weight: 0.08,
            group: 'GS',
            description: 'Material, peso e acabamento.',
            icon: 'Box',
        },
        {
            id: 'c8',
            label: 'Câmera',
            weight: 0.06,
            group: 'GS',
            description: 'Qualidade para videochamadas e fotos.',
            icon: 'Camera',
        },
        {
            id: 'c9',
            label: 'Pós-Venda',
            weight: 0.06,
            group: 'VS',
            description: 'Atualizações e suporte.',
            icon: 'HeadphonesIcon',
        },
        {
            id: 'c10',
            label: 'Acessórios',
            weight: 0.04,
            group: 'GS',
            description: 'Caneta, teclado e capas oficiais.',
            icon: 'PenTool',
        },
    ],
    profiles: [
        {
            id: 'balanced',
            name: 'Equilibrado',
            description: 'Uso geral versátil.',
            icon: '⚖️',
            weightOverrides: {},
        },
        {
            id: 'productivity',
            name: 'Produtividade',
            description: 'Substituto de notebook.',
            icon: '💼',
            weightOverrides: {
                c3: 0.22, // Produtividade +
                c1: 0.18, // Desempenho +
                c8: 0.04, // Câmera -
            },
        },
        {
            id: 'artist',
            name: 'Artista/Designer',
            description: 'Desenho com caneta.',
            icon: '🎨',
            weightOverrides: {
                c2: 0.20, // Tela +
                c10: 0.12, // Acessórios +
                c8: 0.04, // Câmera -
            },
        },
        {
            id: 'media',
            name: 'Entretenimento',
            description: 'Streaming e leitura.',
            icon: '📺',
            weightOverrides: {
                c2: 0.20, // Tela +
                c4: 0.16, // Bateria +
                c3: 0.08, // Produtividade -
            },
        },
    ],
};

// ============================================
// SOUNDBAR
// ============================================

export const SOUNDBAR_CATEGORY: CategoryDefinition = {
    id: 'soundbar',
    name: 'Soundbars',
    nameSingular: 'Soundbar',
    slug: 'soundbars',
    description: 'Compare as melhores soundbars para TV e home theater.',
    icon: 'Speaker',
    criteria: [
        { id: 'c1', label: 'Qualidade de Áudio', weight: 0.20, group: 'QS', description: 'Clareza, graves e equilíbrio.', icon: 'Music' },
        { id: 'c2', label: 'Potência', weight: 0.12, group: 'QS', description: 'Watts RMS e volume máximo.', icon: 'Volume2' },
        { id: 'c3', label: 'Subwoofer', weight: 0.12, group: 'QS', description: 'Presença e qualidade do sub.', icon: 'Radio' },
        { id: 'c4', label: 'Conectividade', weight: 0.10, group: 'GS', description: 'HDMI eARC, Bluetooth, Wi-Fi.', icon: 'Plug' },
        { id: 'c5', label: 'Surround Virtual', weight: 0.10, group: 'QS', description: 'Dolby Atmos, DTS:X.', icon: 'Surround' },
        { id: 'c6', label: 'Custo-Benefício', weight: 0.14, group: 'VS', description: 'Preço vs. qualidade.', icon: 'PiggyBank' },
        { id: 'c7', label: 'Integração TV', weight: 0.08, group: 'GS', description: 'CEC, controle único.', icon: 'Tv' },
        { id: 'c8', label: 'Design', weight: 0.06, group: 'GS', description: 'Tamanho e estética.', icon: 'Box' },
        { id: 'c9', label: 'Pós-Venda', weight: 0.04, group: 'VS', description: 'Garantia e suporte.', icon: 'HeadphonesIcon' },
        { id: 'c10', label: 'Smart Features', weight: 0.04, group: 'GS', description: 'Assistentes de voz.', icon: 'Mic' },
    ],
    profiles: [
        { id: 'balanced', name: 'Equilibrado', description: 'Uso geral.', icon: '⚖️', weightOverrides: {} },
        { id: 'cinema', name: 'Home Theater', description: 'Imersão cinematográfica.', icon: '🎬', weightOverrides: { c5: 0.18, c3: 0.16 } },
        { id: 'music', name: 'Música', description: 'Qualidade musical.', icon: '🎵', weightOverrides: { c1: 0.26, c2: 0.14 } },
    ],
};

// ============================================
// FONES TWS
// ============================================

export const TWS_CATEGORY: CategoryDefinition = {
    id: 'tws',
    name: 'Fones TWS',
    nameSingular: 'Fone TWS',
    slug: 'fones-tws',
    description: 'Compare os melhores fones de ouvido sem fio true wireless.',
    icon: 'Headphones',
    criteria: [
        { id: 'c1', label: 'Qualidade de Som', weight: 0.18, group: 'QS', description: 'Drivers, codec e equalização.', icon: 'Music' },
        { id: 'c2', label: 'ANC', weight: 0.14, group: 'QS', description: 'Cancelamento de ruído ativo.', icon: 'VolumeX' },
        { id: 'c3', label: 'Bateria', weight: 0.12, group: 'QS', description: 'Duração e recarga.', icon: 'Battery' },
        { id: 'c4', label: 'Conforto', weight: 0.12, group: 'GS', description: 'Encaixe e peso.', icon: 'Heart' },
        { id: 'c5', label: 'Microfone', weight: 0.08, group: 'GS', description: 'Qualidade em chamadas.', icon: 'Mic' },
        { id: 'c6', label: 'Custo-Benefício', weight: 0.14, group: 'VS', description: 'Preço vs. recursos.', icon: 'PiggyBank' },
        { id: 'c7', label: 'Resistência', weight: 0.08, group: 'QS', description: 'IP rating, durabilidade.', icon: 'Shield' },
        { id: 'c8', label: 'Conectividade', weight: 0.06, group: 'GS', description: 'Bluetooth, multipoint.', icon: 'Bluetooth' },
        { id: 'c9', label: 'App', weight: 0.04, group: 'GS', description: 'Equalização e controles.', icon: 'Smartphone' },
        { id: 'c10', label: 'Latência', weight: 0.04, group: 'GS', description: 'Atraso para gaming/vídeo.', icon: 'Zap' },
    ],
    profiles: [
        { id: 'balanced', name: 'Equilibrado', description: 'Uso geral.', icon: '⚖️', weightOverrides: {} },
        { id: 'commuter', name: 'Transporte', description: 'ANC e bateria.', icon: '🚇', weightOverrides: { c2: 0.22, c3: 0.16 } },
        { id: 'sport', name: 'Esporte', description: 'Resistência e encaixe.', icon: '🏃', weightOverrides: { c7: 0.18, c4: 0.16 } },
    ],
};

// ============================================
// HEADSET GAMER
// ============================================

export const HEADSET_CATEGORY: CategoryDefinition = {
    id: 'headset_gamer',
    name: 'Headsets Gamer',
    nameSingular: 'Headset Gamer',
    slug: 'headsets-gamer',
    description: 'Compare os melhores headsets para gaming.',
    icon: 'Headphones',
    criteria: [
        { id: 'c1', label: 'Qualidade de Som', weight: 0.16, group: 'QS', description: 'Drivers e som espacial.', icon: 'Music' },
        { id: 'c2', label: 'Microfone', weight: 0.14, group: 'QS', description: 'Clareza e cancelamento.', icon: 'Mic' },
        { id: 'c3', label: 'Conforto', weight: 0.14, group: 'GS', description: 'Almofadas e peso.', icon: 'Heart' },
        { id: 'c4', label: 'Som Espacial', weight: 0.12, group: 'QS', description: '7.1 virtual, posicionamento.', icon: 'Surround' },
        { id: 'c5', label: 'Construção', weight: 0.10, group: 'QS', description: 'Material e durabilidade.', icon: 'Shield' },
        { id: 'c6', label: 'Custo-Benefício', weight: 0.12, group: 'VS', description: 'Preço vs. recursos.', icon: 'PiggyBank' },
        { id: 'c7', label: 'Conectividade', weight: 0.08, group: 'GS', description: 'USB, P2, wireless.', icon: 'Plug' },
        { id: 'c8', label: 'RGB', weight: 0.04, group: 'GS', description: 'Iluminação e sincronização.', icon: 'Lightbulb' },
        { id: 'c9', label: 'Software', weight: 0.06, group: 'GS', description: 'Equalização e perfis.', icon: 'Settings' },
        { id: 'c10', label: 'Bateria', weight: 0.04, group: 'GS', description: 'Para modelos wireless.', icon: 'Battery' },
    ],
    profiles: [
        { id: 'balanced', name: 'Equilibrado', description: 'Uso geral.', icon: '⚖️', weightOverrides: {} },
        { id: 'competitive', name: 'Competitivo', description: 'Posicionamento preciso.', icon: '🎯', weightOverrides: { c4: 0.20, c2: 0.16 } },
        { id: 'streaming', name: 'Streaming', description: 'Mic e conforto.', icon: '📺', weightOverrides: { c2: 0.20, c3: 0.18 } },
    ],
};

// ============================================
// CAIXA BLUETOOTH
// ============================================

export const BLUETOOTH_SPEAKER_CATEGORY: CategoryDefinition = {
    id: 'bluetooth_speaker',
    name: 'Caixas Bluetooth',
    nameSingular: 'Caixa Bluetooth',
    slug: 'caixas-bluetooth',
    description: 'Compare as melhores caixas de som portáteis.',
    icon: 'Speaker',
    criteria: [
        { id: 'c1', label: 'Qualidade de Som', weight: 0.20, group: 'QS', description: 'Clareza e graves.', icon: 'Music' },
        { id: 'c2', label: 'Potência', weight: 0.12, group: 'QS', description: 'Volume e distorção.', icon: 'Volume2' },
        { id: 'c3', label: 'Bateria', weight: 0.14, group: 'QS', description: 'Duração e recarga.', icon: 'Battery' },
        { id: 'c4', label: 'Resistência', weight: 0.12, group: 'QS', description: 'IP rating, quedas.', icon: 'Shield' },
        { id: 'c5', label: 'Portabilidade', weight: 0.10, group: 'GS', description: 'Tamanho e peso.', icon: 'Package' },
        { id: 'c6', label: 'Custo-Benefício', weight: 0.12, group: 'VS', description: 'Preço vs. qualidade.', icon: 'PiggyBank' },
        { id: 'c7', label: 'Pareamento', weight: 0.06, group: 'GS', description: 'Stereo pair, party mode.', icon: 'Link' },
        { id: 'c8', label: 'Conectividade', weight: 0.06, group: 'GS', description: 'Bluetooth, aux, USB.', icon: 'Bluetooth' },
        { id: 'c9', label: 'Design', weight: 0.04, group: 'GS', description: 'Estética e cores.', icon: 'Palette' },
        { id: 'c10', label: 'Power Bank', weight: 0.04, group: 'GS', description: 'Carregar celular.', icon: 'Zap' },
    ],
    profiles: [
        { id: 'balanced', name: 'Equilibrado', description: 'Uso geral.', icon: '⚖️', weightOverrides: {} },
        { id: 'outdoor', name: 'Outdoor', description: 'Resistência e bateria.', icon: '🏕️', weightOverrides: { c4: 0.20, c3: 0.18 } },
        { id: 'party', name: 'Festa', description: 'Potência e pareamento.', icon: '🎉', weightOverrides: { c2: 0.18, c7: 0.12 } },
    ],
};

// ============================================
// CONSOLE
// ============================================

export const CONSOLE_CATEGORY: CategoryDefinition = {
    id: 'console',
    name: 'Consoles',
    nameSingular: 'Console',
    slug: 'consoles',
    description: 'Compare os consoles de videogame.',
    icon: 'Gamepad2',
    criteria: [
        { id: 'c1', label: 'Desempenho', weight: 0.18, group: 'QS', description: 'GPU, CPU e resolução.', icon: 'Cpu' },
        { id: 'c2', label: 'Biblioteca de Jogos', weight: 0.18, group: 'QS', description: 'Exclusivos e catálogo.', icon: 'Library' },
        { id: 'c3', label: 'Armazenamento', weight: 0.10, group: 'QS', description: 'SSD e expansão.', icon: 'HardDrive' },
        { id: 'c4', label: 'Online/Services', weight: 0.10, group: 'GS', description: 'Game Pass, PS Plus.', icon: 'Cloud' },
        { id: 'c5', label: 'Retrocompatibilidade', weight: 0.08, group: 'GS', description: 'Jogar gerações anteriores.', icon: 'History' },
        { id: 'c6', label: 'Custo-Benefício', weight: 0.14, group: 'VS', description: 'Preço vs. valor.', icon: 'PiggyBank' },
        { id: 'c7', label: 'Mídia Física', weight: 0.06, group: 'GS', description: 'Leitor de disco.', icon: 'Disc' },
        { id: 'c8', label: 'Controle', weight: 0.08, group: 'GS', description: 'DualSense, recursos.', icon: 'Gamepad' },
        { id: 'c9', label: 'Ruído/Consumo', weight: 0.04, group: 'GS', description: 'Silêncio e eficiência.', icon: 'VolumeX' },
        { id: 'c10', label: 'Portabilidade', weight: 0.04, group: 'GS', description: 'Para Switch.', icon: 'Package' },
    ],
    profiles: [
        { id: 'balanced', name: 'Equilibrado', description: 'Uso geral.', icon: '⚖️', weightOverrides: {} },
        { id: 'exclusive', name: 'Exclusivos', description: 'Biblioteca única.', icon: '🎮', weightOverrides: { c2: 0.26, c1: 0.14 } },
        { id: 'value', name: 'Custo-Benefício', description: 'Melhor valor.', icon: '💰', weightOverrides: { c6: 0.22, c4: 0.14 } },
    ],
};

// ============================================
// GAMEPAD
// ============================================

export const GAMEPAD_CATEGORY: CategoryDefinition = {
    id: 'gamepad',
    name: 'Gamepads',
    nameSingular: 'Gamepad',
    slug: 'gamepads',
    description: 'Compare os melhores controles para games.',
    icon: 'Gamepad2',
    criteria: [
        { id: 'c1', label: 'Ergonomia', weight: 0.18, group: 'GS', description: 'Conforto e grip.', icon: 'Hand' },
        { id: 'c2', label: 'Responsividade', weight: 0.16, group: 'QS', description: 'Latência e precisão.', icon: 'Zap' },
        { id: 'c3', label: 'Construção', weight: 0.12, group: 'QS', description: 'Material e durabilidade.', icon: 'Shield' },
        { id: 'c4', label: 'Compatibilidade', weight: 0.12, group: 'GS', description: 'PC, consoles, mobile.', icon: 'Plug' },
        { id: 'c5', label: 'Bateria', weight: 0.10, group: 'QS', description: 'Duração wireless.', icon: 'Battery' },
        { id: 'c6', label: 'Custo-Benefício', weight: 0.12, group: 'VS', description: 'Preço vs. qualidade.', icon: 'PiggyBank' },
        { id: 'c7', label: 'Recursos Pro', weight: 0.08, group: 'GS', description: 'Paddles, triggers ajustáveis.', icon: 'Settings' },
        { id: 'c8', label: 'Feedback Tátil', weight: 0.06, group: 'GS', description: 'Vibração e triggers.', icon: 'Hand' },
        { id: 'c9', label: 'Personalização', weight: 0.04, group: 'GS', description: 'Botões remapeáveis.', icon: 'Palette' },
        { id: 'c10', label: 'Conectividade', weight: 0.02, group: 'GS', description: 'USB, Bluetooth, dongle.', icon: 'Bluetooth' },
    ],
    profiles: [
        { id: 'balanced', name: 'Equilibrado', description: 'Uso geral.', icon: '⚖️', weightOverrides: {} },
        { id: 'competitive', name: 'Competitivo', description: 'Resposta rápida.', icon: '🎯', weightOverrides: { c2: 0.24, c7: 0.12 } },
        { id: 'casual', name: 'Casual', description: 'Conforto e preço.', icon: '🛋️', weightOverrides: { c1: 0.22, c6: 0.18 } },
    ],
};

// ============================================
// CADEIRA
// ============================================

export const CHAIR_CATEGORY: CategoryDefinition = {
    id: 'chair',
    name: 'Cadeiras',
    nameSingular: 'Cadeira',
    slug: 'cadeiras',
    description: 'Compare cadeiras gamer e de escritório.',
    icon: 'Armchair',
    criteria: [
        { id: 'c1', label: 'Ergonomia', weight: 0.22, group: 'QS', description: 'Suporte lombar e ajustes.', icon: 'User' },
        { id: 'c2', label: 'Conforto', weight: 0.18, group: 'QS', description: 'Espuma e respirabilidade.', icon: 'Heart' },
        { id: 'c3', label: 'Construção', weight: 0.14, group: 'QS', description: 'Material e peso suportado.', icon: 'Shield' },
        { id: 'c4', label: 'Ajustes', weight: 0.12, group: 'GS', description: 'Altura, braços, recline.', icon: 'Settings' },
        { id: 'c5', label: 'Custo-Benefício', weight: 0.12, group: 'VS', description: 'Preço vs. qualidade.', icon: 'PiggyBank' },
        { id: 'c6', label: 'Durabilidade', weight: 0.08, group: 'QS', description: 'Garantia e vida útil.', icon: 'Clock' },
        { id: 'c7', label: 'Base/Rodízios', weight: 0.06, group: 'GS', description: 'Estabilidade e rolamento.', icon: 'Circle' },
        { id: 'c8', label: 'Design', weight: 0.04, group: 'GS', description: 'Estética e cores.', icon: 'Palette' },
        { id: 'c9', label: 'Montagem', weight: 0.02, group: 'GS', description: 'Facilidade de montar.', icon: 'Wrench' },
        { id: 'c10', label: 'Acessórios', weight: 0.02, group: 'GS', description: 'Almofadas inclusas.', icon: 'Package' },
    ],
    profiles: [
        { id: 'balanced', name: 'Equilibrado', description: 'Uso geral.', icon: '⚖️', weightOverrides: {} },
        { id: 'ergonomic', name: 'Ergonômico', description: 'Saúde postural.', icon: '🧘', weightOverrides: { c1: 0.30, c4: 0.16 } },
        { id: 'gamer', name: 'Gamer', description: 'Estilo e conforto.', icon: '🎮', weightOverrides: { c2: 0.22, c8: 0.08 } },
    ],
};

// ============================================
// TECLADO
// ============================================

export const KEYBOARD_CATEGORY: CategoryDefinition = {
    id: 'keyboard',
    name: 'Teclados',
    nameSingular: 'Teclado',
    slug: 'teclados',
    description: 'Compare teclados mecânicos e gamer.',
    icon: 'Keyboard',
    criteria: [
        { id: 'c1', label: 'Switches', weight: 0.18, group: 'QS', description: 'Tipo, atuação e tato.', icon: 'Zap' },
        { id: 'c2', label: 'Construção', weight: 0.14, group: 'QS', description: 'Material e peso.', icon: 'Shield' },
        { id: 'c3', label: 'Digitação', weight: 0.14, group: 'QS', description: 'Conforto e feedback.', icon: 'Type' },
        { id: 'c4', label: 'Layout', weight: 0.10, group: 'GS', description: 'Full, TKL, 60%.', icon: 'Layout' },
        { id: 'c5', label: 'Iluminação', weight: 0.08, group: 'GS', description: 'RGB e efeitos.', icon: 'Lightbulb' },
        { id: 'c6', label: 'Custo-Benefício', weight: 0.14, group: 'VS', description: 'Preço vs. qualidade.', icon: 'PiggyBank' },
        { id: 'c7', label: 'Conectividade', weight: 0.08, group: 'GS', description: 'USB, wireless, Bluetooth.', icon: 'Bluetooth' },
        { id: 'c8', label: 'Software', weight: 0.06, group: 'GS', description: 'Macros e perfis.', icon: 'Settings' },
        { id: 'c9', label: 'Ruído', weight: 0.04, group: 'GS', description: 'Silencioso ou clicky.', icon: 'VolumeX' },
        { id: 'c10', label: 'Hot-Swap', weight: 0.04, group: 'GS', description: 'Trocar switches.', icon: 'Repeat' },
    ],
    profiles: [
        { id: 'balanced', name: 'Equilibrado', description: 'Uso geral.', icon: '⚖️', weightOverrides: {} },
        { id: 'gamer', name: 'Gamer', description: 'Resposta rápida.', icon: '🎮', weightOverrides: { c1: 0.24, c5: 0.12 } },
        { id: 'typing', name: 'Digitação', description: 'Conforto e precisão.', icon: '⌨️', weightOverrides: { c3: 0.22, c1: 0.20 } },
    ],
};

// ============================================
// CPU
// ============================================

export const CPU_CATEGORY: CategoryDefinition = {
    id: 'cpu',
    name: 'Processadores',
    nameSingular: 'Processador',
    slug: 'processadores',
    description: 'Compare CPUs Intel e AMD.',
    icon: 'Cpu',
    criteria: [
        { id: 'c1', label: 'Performance Multi', weight: 0.18, group: 'QS', description: 'Núcleos e threads.', icon: 'Layers' },
        { id: 'c2', label: 'Performance Single', weight: 0.16, group: 'QS', description: 'Clock e IPC.', icon: 'Zap' },
        { id: 'c3', label: 'Gaming', weight: 0.14, group: 'QS', description: 'FPS em jogos.', icon: 'Gamepad2' },
        { id: 'c4', label: 'Eficiência', weight: 0.12, group: 'QS', description: 'TDP e consumo.', icon: 'Leaf' },
        { id: 'c5', label: 'Custo-Benefício', weight: 0.14, group: 'VS', description: 'Preço vs. performance.', icon: 'PiggyBank' },
        { id: 'c6', label: 'Plataforma', weight: 0.08, group: 'GS', description: 'Socket e upgrades.', icon: 'Grid' },
        { id: 'c7', label: 'iGPU', weight: 0.06, group: 'GS', description: 'GPU integrada.', icon: 'Monitor' },
        { id: 'c8', label: 'Overclock', weight: 0.06, group: 'GS', description: 'Potencial de OC.', icon: 'TrendingUp' },
        { id: 'c9', label: 'Temperatura', weight: 0.04, group: 'GS', description: 'Térmica e cooler incluso.', icon: 'Thermometer' },
        { id: 'c10', label: 'Longevidade', weight: 0.02, group: 'GS', description: 'Suporte futuro.', icon: 'Clock' },
    ],
    profiles: [
        { id: 'balanced', name: 'Equilibrado', description: 'Uso geral.', icon: '⚖️', weightOverrides: {} },
        { id: 'gamer', name: 'Gaming', description: 'Máximo FPS.', icon: '🎮', weightOverrides: { c3: 0.24, c2: 0.20 } },
        { id: 'workstation', name: 'Workstation', description: 'Renderização e produtividade.', icon: '💼', weightOverrides: { c1: 0.26, c3: 0.10 } },
    ],
};

// ============================================
// GPU
// ============================================

export const GPU_CATEGORY: CategoryDefinition = {
    id: 'gpu',
    name: 'Placas de Vídeo',
    nameSingular: 'Placa de Vídeo',
    slug: 'placas-de-video',
    description: 'Compare GPUs NVIDIA e AMD.',
    icon: 'Monitor',
    criteria: [
        { id: 'c1', label: 'Performance Gaming', weight: 0.22, group: 'QS', description: 'FPS em jogos AAA.', icon: 'Gamepad2' },
        { id: 'c2', label: 'Ray Tracing', weight: 0.10, group: 'QS', description: 'Performance em RT.', icon: 'Sun' },
        { id: 'c3', label: 'VRAM', weight: 0.12, group: 'QS', description: 'Quantidade e velocidade.', icon: 'Chip' },
        { id: 'c4', label: 'Eficiência', weight: 0.10, group: 'QS', description: 'TDP e consumo.', icon: 'Leaf' },
        { id: 'c5', label: 'Custo-Benefício', weight: 0.16, group: 'VS', description: 'Preço vs. performance.', icon: 'PiggyBank' },
        { id: 'c6', label: 'Resfriamento', weight: 0.08, group: 'GS', description: 'Cooler e temperaturas.', icon: 'Fan' },
        { id: 'c7', label: 'Tamanho', weight: 0.06, group: 'GS', description: 'Compatibilidade com case.', icon: 'Ruler' },
        { id: 'c8', label: 'Features', weight: 0.06, group: 'GS', description: 'DLSS, FSR, encoders.', icon: 'Sparkles' },
        { id: 'c9', label: 'Ruído', weight: 0.06, group: 'GS', description: 'Decibéis sob carga.', icon: 'VolumeX' },
        { id: 'c10', label: 'Conectores', weight: 0.04, group: 'GS', description: 'HDMI, DP, USB-C.', icon: 'Plug' },
    ],
    profiles: [
        { id: 'balanced', name: 'Equilibrado', description: 'Uso geral.', icon: '⚖️', weightOverrides: {} },
        { id: 'competitive', name: '1080p Competitivo', description: 'Máximo FPS.', icon: '🎯', weightOverrides: { c1: 0.28, c5: 0.18 } },
        { id: 'ultra', name: '4K Ultra', description: 'Qualidade máxima.', icon: '🎬', weightOverrides: { c1: 0.26, c3: 0.16, c2: 0.14 } },
    ],
};

// ============================================
// RAM
// ============================================

export const RAM_CATEGORY: CategoryDefinition = {
    id: 'ram',
    name: 'Memória RAM',
    nameSingular: 'Memória RAM',
    slug: 'memoria-ram',
    description: 'Compare kits de memória DDR4 e DDR5.',
    icon: 'Chip',
    criteria: [
        { id: 'c1', label: 'Velocidade', weight: 0.20, group: 'QS', description: 'MHz e latência.', icon: 'Zap' },
        { id: 'c2', label: 'Capacidade', weight: 0.18, group: 'QS', description: 'GB por kit.', icon: 'Package' },
        { id: 'c3', label: 'Latência', weight: 0.14, group: 'QS', description: 'CL e timings.', icon: 'Clock' },
        { id: 'c4', label: 'Compatibilidade', weight: 0.12, group: 'GS', description: 'DDR4/DDR5, XMP.', icon: 'Check' },
        { id: 'c5', label: 'Custo-Benefício', weight: 0.16, group: 'VS', description: 'Preço vs. specs.', icon: 'PiggyBank' },
        { id: 'c6', label: 'RGB', weight: 0.06, group: 'GS', description: 'Iluminação.', icon: 'Lightbulb' },
        { id: 'c7', label: 'Dissipador', weight: 0.06, group: 'GS', description: 'Qualidade térmica.', icon: 'Thermometer' },
        { id: 'c8', label: 'Perfil', weight: 0.04, group: 'GS', description: 'Altura e clearance.', icon: 'Ruler' },
        { id: 'c9', label: 'Garantia', weight: 0.02, group: 'VS', description: 'Cobertura.', icon: 'Shield' },
        { id: 'c10', label: 'Overclock', weight: 0.02, group: 'GS', description: 'Headroom para OC.', icon: 'TrendingUp' },
    ],
    profiles: [
        { id: 'balanced', name: 'Equilibrado', description: 'Uso geral.', icon: '⚖️', weightOverrides: {} },
        { id: 'gamer', name: 'Gaming', description: 'Velocidade.', icon: '🎮', weightOverrides: { c1: 0.24, c3: 0.16 } },
        { id: 'budget', name: 'Orçamento', description: 'Melhor preço.', icon: '💰', weightOverrides: { c5: 0.26, c2: 0.20 } },
    ],
};

// ============================================
// MOTHERBOARD
// ============================================

export const MOTHERBOARD_CATEGORY: CategoryDefinition = {
    id: 'motherboard',
    name: 'Placas-Mãe',
    nameSingular: 'Placa-Mãe',
    slug: 'placas-mae',
    description: 'Compare motherboards Intel e AMD.',
    icon: 'CircuitBoard',
    criteria: [
        { id: 'c1', label: 'VRM', weight: 0.16, group: 'QS', description: 'Fases e qualidade.', icon: 'Zap' },
        { id: 'c2', label: 'Conectividade', weight: 0.14, group: 'GS', description: 'USB, rede, Wi-Fi.', icon: 'Plug' },
        { id: 'c3', label: 'Slots', weight: 0.12, group: 'GS', description: 'PCIe, M.2, RAM.', icon: 'Layers' },
        { id: 'c4', label: 'Áudio', weight: 0.08, group: 'GS', description: 'Codec e qualidade.', icon: 'Music' },
        { id: 'c5', label: 'BIOS/Recursos', weight: 0.10, group: 'GS', description: 'Interface e opções.', icon: 'Settings' },
        { id: 'c6', label: 'Custo-Benefício', weight: 0.16, group: 'VS', description: 'Preço vs. recursos.', icon: 'PiggyBank' },
        { id: 'c7', label: 'Construção', weight: 0.10, group: 'QS', description: 'PCB e componentes.', icon: 'Shield' },
        { id: 'c8', label: 'Form Factor', weight: 0.06, group: 'GS', description: 'ATX, mATX, ITX.', icon: 'Ruler' },
        { id: 'c9', label: 'RGB', weight: 0.04, group: 'GS', description: 'Headers e sincronização.', icon: 'Lightbulb' },
        { id: 'c10', label: 'Overclock', weight: 0.04, group: 'GS', description: 'Suporte e estabilidade.', icon: 'TrendingUp' },
    ],
    profiles: [
        { id: 'balanced', name: 'Equilibrado', description: 'Uso geral.', icon: '⚖️', weightOverrides: {} },
        { id: 'enthusiast', name: 'Entusiasta', description: 'OC e VRM.', icon: '🔥', weightOverrides: { c1: 0.24, c10: 0.10 } },
        { id: 'budget', name: 'Orçamento', description: 'Essencial.', icon: '💰', weightOverrides: { c6: 0.26, c1: 0.12 } },
    ],
};

// ============================================
// SSD
// ============================================

export const SSD_CATEGORY: CategoryDefinition = {
    id: 'ssd',
    name: 'SSDs',
    nameSingular: 'SSD',
    slug: 'ssds',
    description: 'Compare SSDs SATA e NVMe.',
    icon: 'HardDrive',
    criteria: [
        { id: 'c1', label: 'Velocidade Leitura', weight: 0.18, group: 'QS', description: 'MB/s sequencial.', icon: 'ArrowDown' },
        { id: 'c2', label: 'Velocidade Escrita', weight: 0.16, group: 'QS', description: 'MB/s sequencial.', icon: 'ArrowUp' },
        { id: 'c3', label: 'Capacidade', weight: 0.14, group: 'QS', description: 'GB/TB.', icon: 'Package' },
        { id: 'c4', label: 'Durabilidade', weight: 0.12, group: 'QS', description: 'TBW e garantia.', icon: 'Shield' },
        { id: 'c5', label: 'Custo-Benefício', weight: 0.16, group: 'VS', description: 'R$/GB.', icon: 'PiggyBank' },
        { id: 'c6', label: 'Interface', weight: 0.08, group: 'GS', description: 'NVMe Gen4, SATA.', icon: 'Plug' },
        { id: 'c7', label: 'Cache', weight: 0.06, group: 'GS', description: 'DRAM e SLC cache.', icon: 'Chip' },
        { id: 'c8', label: 'Temperatura', weight: 0.04, group: 'GS', description: 'Dissipador e throttling.', icon: 'Thermometer' },
        { id: 'c9', label: 'Software', weight: 0.04, group: 'GS', description: 'Clonagem e monitoramento.', icon: 'Settings' },
        { id: 'c10', label: 'Form Factor', weight: 0.02, group: 'GS', description: 'M.2, 2.5".', icon: 'Ruler' },
    ],
    profiles: [
        { id: 'balanced', name: 'Equilibrado', description: 'Uso geral.', icon: '⚖️', weightOverrides: {} },
        { id: 'speed', name: 'Velocidade', description: 'Máximo MB/s.', icon: '⚡', weightOverrides: { c1: 0.24, c2: 0.20 } },
        { id: 'storage', name: 'Armazenamento', description: 'Capacidade.', icon: '💾', weightOverrides: { c3: 0.24, c5: 0.20 } },
    ],
};

// ============================================
// PSU
// ============================================

export const PSU_CATEGORY: CategoryDefinition = {
    id: 'psu',
    name: 'Fontes',
    nameSingular: 'Fonte',
    slug: 'fontes',
    description: 'Compare fontes de alimentação.',
    icon: 'Plug',
    criteria: [
        { id: 'c1', label: 'Potência', weight: 0.18, group: 'QS', description: 'Watts reais.', icon: 'Zap' },
        { id: 'c2', label: 'Eficiência', weight: 0.16, group: 'QS', description: '80 Plus rating.', icon: 'Leaf' },
        { id: 'c3', label: 'Qualidade', weight: 0.16, group: 'QS', description: 'Componentes e ripple.', icon: 'Shield' },
        { id: 'c4', label: 'Modularidade', weight: 0.10, group: 'GS', description: 'Full, semi, não.', icon: 'Settings' },
        { id: 'c5', label: 'Custo-Benefício', weight: 0.14, group: 'VS', description: 'Preço vs. specs.', icon: 'PiggyBank' },
        { id: 'c6', label: 'Ruído', weight: 0.08, group: 'GS', description: 'Fan e modo fanless.', icon: 'VolumeX' },
        { id: 'c7', label: 'Garantia', weight: 0.08, group: 'VS', description: 'Anos de cobertura.', icon: 'Clock' },
        { id: 'c8', label: 'Conectores', weight: 0.06, group: 'GS', description: 'PCIe, SATA, Molex.', icon: 'Plug' },
        { id: 'c9', label: 'Proteções', weight: 0.02, group: 'GS', description: 'OVP, OCP, SCP.', icon: 'AlertTriangle' },
        { id: 'c10', label: 'Tamanho', weight: 0.02, group: 'GS', description: 'ATX, SFX.', icon: 'Ruler' },
    ],
    profiles: [
        { id: 'balanced', name: 'Equilibrado', description: 'Uso geral.', icon: '⚖️', weightOverrides: {} },
        { id: 'highend', name: 'High-End', description: 'Qualidade máxima.', icon: '🔥', weightOverrides: { c3: 0.24, c2: 0.20 } },
        { id: 'budget', name: 'Orçamento', description: 'Custo acessível.', icon: '💰', weightOverrides: { c5: 0.24, c1: 0.20 } },
    ],
};

// ============================================
// GABINETE
// ============================================

export const CASE_CATEGORY: CategoryDefinition = {
    id: 'case',
    name: 'Gabinetes',
    nameSingular: 'Gabinete',
    slug: 'gabinetes',
    description: 'Compare gabinetes para PC.',
    icon: 'Box',
    criteria: [
        { id: 'c1', label: 'Airflow', weight: 0.18, group: 'QS', description: 'Fluxo de ar e mesh.', icon: 'Wind' },
        { id: 'c2', label: 'Espaço', weight: 0.14, group: 'GS', description: 'GPU, cooler, radiadores.', icon: 'Ruler' },
        { id: 'c3', label: 'Construção', weight: 0.12, group: 'QS', description: 'Material e acabamento.', icon: 'Shield' },
        { id: 'c4', label: 'Design', weight: 0.10, group: 'GS', description: 'Estética e vidro.', icon: 'Palette' },
        { id: 'c5', label: 'Custo-Benefício', weight: 0.16, group: 'VS', description: 'Preço vs. recursos.', icon: 'PiggyBank' },
        { id: 'c6', label: 'Fans Inclusos', weight: 0.10, group: 'GS', description: 'Quantidade e RGB.', icon: 'Fan' },
        { id: 'c7', label: 'Cable Management', weight: 0.08, group: 'GS', description: 'Espaço e velcros.', icon: 'Layers' },
        { id: 'c8', label: 'I/O Frontal', weight: 0.06, group: 'GS', description: 'USB-C, áudio.', icon: 'Plug' },
        { id: 'c9', label: 'Filtros', weight: 0.04, group: 'GS', description: 'Anti-poeira.', icon: 'Filter' },
        { id: 'c10', label: 'Form Factor', weight: 0.02, group: 'GS', description: 'ATX, mATX, ITX.', icon: 'Box' },
    ],
    profiles: [
        { id: 'balanced', name: 'Equilibrado', description: 'Uso geral.', icon: '⚖️', weightOverrides: {} },
        { id: 'performance', name: 'Performance', description: 'Airflow máximo.', icon: '💨', weightOverrides: { c1: 0.26, c6: 0.14 } },
        { id: 'showcase', name: 'Showcase', description: 'Estética e RGB.', icon: '✨', weightOverrides: { c4: 0.18, c6: 0.16 } },
    ],
};

// ============================================
// PROJETOR
// ============================================

export const PROJECTOR_CATEGORY: CategoryDefinition = {
    id: 'projector',
    name: 'Projetores',
    nameSingular: 'Projetor',
    slug: 'projetores',
    description: 'Compare projetores para home theater e apresentações.',
    icon: 'Projector',
    criteria: [
        { id: 'c1', label: 'Qualidade de Imagem', weight: 0.20, group: 'QS', description: 'Resolução e cores.', icon: 'Image' },
        { id: 'c2', label: 'Brilho', weight: 0.16, group: 'QS', description: 'Lumens e ambiente.', icon: 'Sun' },
        { id: 'c3', label: 'Contraste', weight: 0.12, group: 'QS', description: 'Níveis de preto.', icon: 'Contrast' },
        { id: 'c4', label: 'Conectividade', weight: 0.10, group: 'GS', description: 'HDMI, USB, smart.', icon: 'Plug' },
        { id: 'c5', label: 'Custo-Benefício', weight: 0.14, group: 'VS', description: 'Preço vs. qualidade.', icon: 'PiggyBank' },
        { id: 'c6', label: 'Ruído', weight: 0.08, group: 'GS', description: 'Decibéis da ventoinha.', icon: 'VolumeX' },
        { id: 'c7', label: 'Lâmpada/LED', weight: 0.08, group: 'QS', description: 'Vida útil e custo.', icon: 'Lightbulb' },
        { id: 'c8', label: 'Instalação', weight: 0.06, group: 'GS', description: 'Keystone e throw ratio.', icon: 'Settings' },
        { id: 'c9', label: 'Portabilidade', weight: 0.04, group: 'GS', description: 'Tamanho e peso.', icon: 'Package' },
        { id: 'c10', label: 'Áudio', weight: 0.02, group: 'GS', description: 'Alto-falante embutido.', icon: 'Volume2' },
    ],
    profiles: [
        { id: 'balanced', name: 'Equilibrado', description: 'Uso geral.', icon: '⚖️', weightOverrides: {} },
        { id: 'cinema', name: 'Home Theater', description: 'Qualidade máxima.', icon: '🎬', weightOverrides: { c1: 0.26, c3: 0.16 } },
        { id: 'business', name: 'Apresentações', description: 'Brilho e portabilidade.', icon: '💼', weightOverrides: { c2: 0.24, c9: 0.10 } },
    ],
};

// ============================================
// TVBOX
// ============================================

export const TVBOX_CATEGORY: CategoryDefinition = {
    id: 'tvbox',
    name: 'TV Box/Sticks',
    nameSingular: 'TV Box',
    slug: 'tv-box',
    description: 'Compare TV Boxes e streaming sticks.',
    icon: 'Tv',
    criteria: [
        { id: 'c1', label: 'Desempenho', weight: 0.16, group: 'QS', description: 'CPU/RAM e fluidez.', icon: 'Cpu' },
        { id: 'c2', label: 'Qualidade de Vídeo', weight: 0.16, group: 'QS', description: '4K, HDR, Dolby Vision.', icon: 'Image' },
        { id: 'c3', label: 'Apps/Plataforma', weight: 0.14, group: 'GS', description: 'Google TV, Fire OS.', icon: 'Layers' },
        { id: 'c4', label: 'Controle Remoto', weight: 0.10, group: 'GS', description: 'Voz, ergonomia.', icon: 'Zap' },
        { id: 'c5', label: 'Custo-Benefício', weight: 0.16, group: 'VS', description: 'Preço vs. recursos.', icon: 'PiggyBank' },
        { id: 'c6', label: 'Armazenamento', weight: 0.08, group: 'GS', description: 'GB e expansão.', icon: 'HardDrive' },
        { id: 'c7', label: 'Conectividade', weight: 0.08, group: 'GS', description: 'Wi-Fi, Ethernet, BT.', icon: 'Wifi' },
        { id: 'c8', label: 'Áudio', weight: 0.06, group: 'GS', description: 'Dolby Atmos passthrough.', icon: 'Volume2' },
        { id: 'c9', label: 'Tamanho', weight: 0.04, group: 'GS', description: 'Compacto ou discreto.', icon: 'Package' },
        { id: 'c10', label: 'Atualizações', weight: 0.02, group: 'GS', description: 'Suporte a longo prazo.', icon: 'RefreshCw' },
    ],
    profiles: [
        { id: 'balanced', name: 'Equilibrado', description: 'Uso geral.', icon: '⚖️', weightOverrides: {} },
        { id: 'streaming', name: 'Streaming', description: 'Qualidade de vídeo.', icon: '📺', weightOverrides: { c2: 0.24, c3: 0.16 } },
        { id: 'budget', name: 'Orçamento', description: 'Melhor preço.', icon: '💰', weightOverrides: { c5: 0.26, c1: 0.14 } },
    ],
};

// ============================================
// SMARTWATCH
// ============================================

export const SMARTWATCH_CATEGORY: CategoryDefinition = {
    id: 'smartwatch',
    name: 'Smartwatches',
    nameSingular: 'Smartwatch',
    slug: 'smartwatches',
    description: 'Compare smartwatches e fitness trackers.',
    icon: 'Watch',
    criteria: [
        { id: 'c1', label: 'Tela', weight: 0.14, group: 'QS', description: 'AMOLED, brilho, tamanho.', icon: 'MonitorSmartphone' },
        { id: 'c2', label: 'Bateria', weight: 0.14, group: 'QS', description: 'Dias de autonomia.', icon: 'Battery' },
        { id: 'c3', label: 'Sensores de Saúde', weight: 0.14, group: 'QS', description: 'HR, SpO2, ECG.', icon: 'Heart' },
        { id: 'c4', label: 'Fitness', weight: 0.12, group: 'GS', description: 'GPS, esportes, precisão.', icon: 'Activity' },
        { id: 'c5', label: 'Ecossistema', weight: 0.10, group: 'GS', description: 'iOS/Android, apps.', icon: 'Smartphone' },
        { id: 'c6', label: 'Custo-Benefício', weight: 0.14, group: 'VS', description: 'Preço vs. recursos.', icon: 'PiggyBank' },
        { id: 'c7', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética e pulseiras.', icon: 'Palette' },
        { id: 'c8', label: 'Resistência', weight: 0.06, group: 'QS', description: 'IP, natação.', icon: 'Shield' },
        { id: 'c9', label: 'Notificações', weight: 0.04, group: 'GS', description: 'Respostas e integração.', icon: 'Bell' },
        { id: 'c10', label: 'Pagamentos', weight: 0.04, group: 'GS', description: 'NFC pay.', icon: 'CreditCard' },
    ],
    profiles: [
        { id: 'balanced', name: 'Equilibrado', description: 'Uso geral.', icon: '⚖️', weightOverrides: {} },
        { id: 'fitness', name: 'Fitness', description: 'Treinos e saúde.', icon: '🏃', weightOverrides: { c3: 0.20, c4: 0.18 } },
        { id: 'style', name: 'Estilo', description: 'Design e notificações.', icon: '⌚', weightOverrides: { c7: 0.16, c1: 0.18 } },
    ],
};

// ============================================
// ROBOT VACUUM
// ============================================

export const ROBOT_VACUUM_CATEGORY: CategoryDefinition = {
    id: 'robot-vacuum',
    name: 'Robôs Aspiradores',
    nameSingular: 'Robô Aspirador',
    slug: 'robos-aspiradores',
    description: 'Compare robôs aspiradores com foco em navegação inteligente, manutenibilidade e eficiência real no Brasil (PARR-BR).',
    icon: 'Bot',
    criteria: [
        {
            id: 'c1',
            label: 'Navegação & Mapeamento',
            weight: 0.25,
            group: 'QS',
            description: 'LiDAR vs. VSLAM vs. Aleatório. Barreiras virtuais, multi-andares e eficiência de cobertura.',
            icon: 'Map',
        },
        {
            id: 'c2',
            label: 'Software & Conectividade',
            weight: 0.15,
            group: 'QS',
            description: 'Estabilidade do App, qualidade do ecossistema (Mi Home, Roborock vs. Tuya genérico), integração Alexa/Google.',
            icon: 'Smartphone',
        },
        {
            id: 'c3',
            label: 'Eficiência de Mop',
            weight: 0.15,
            group: 'QS',
            description: 'Mop Ativo (vibra/gira) vs. Estático. Controle eletrônico de água para pisos de madeira.',
            icon: 'Droplet',
        },
        {
            id: 'c4',
            label: 'Engenharia de Escovas (Pets)',
            weight: 0.10,
            group: 'QS',
            description: 'Escova de silicone anti-emaranhamento vs. cerdas que enrolam cabelo. Facilidade de limpeza.',
            icon: 'Scissors',
        },
        {
            id: 'c5',
            label: 'Restrições Físicas (Altura)',
            weight: 0.10,
            group: 'GS',
            description: 'Altura do robô (<8cm passa sob sofás). Capacidade de escalar soleiras (>20mm).',
            icon: 'Ruler',
        },
        {
            id: 'c6',
            label: 'Manutenibilidade (Peças)',
            weight: 0.08,
            group: 'VS',
            description: 'Disponibilidade de peças no Brasil, custo de filtros/escovas, design modular para troca DIY.',
            icon: 'Wrench',
        },
        {
            id: 'c7',
            label: 'Autonomia (Bateria)',
            weight: 0.05,
            group: 'QS',
            description: 'Função Recharge & Resume, qualidade do BMS, capacidade mAh para casas grandes.',
            icon: 'Battery',
        },
        {
            id: 'c8',
            label: 'Acústica (Ruído)',
            weight: 0.05,
            group: 'GS',
            description: 'Nível de ruído (dB), motor brushless silencioso, modo Não Perturbe eficaz.',
            icon: 'VolumeX',
        },
        {
            id: 'c9',
            label: 'Automação (Docks)',
            weight: 0.05,
            group: 'GS',
            description: 'Base Auto-Empty com saco de pó, lavagem e secagem de mop com ar quente.',
            icon: 'Home',
        },
        {
            id: 'c10',
            label: 'Recursos vs. Gimmicks',
            weight: 0.02,
            group: 'GS',
            description: 'IA frontal para desviar de obstáculos/fezes. Controle remoto físico para idosos. UV é gimmick.',
            icon: 'Eye',
        },
    ],
    profiles: [
        {
            id: 'balanced',
            name: 'Equilibrado',
            description: 'Para uso geral em apartamentos.',
            icon: '⚖️',
            weightOverrides: {},
        },
        {
            id: 'pet',
            name: 'Dono de Pet',
            description: 'Prioriza escovas anti-emaranhamento e sucção.',
            icon: '🐕',
            weightOverrides: {
                c4: 0.18, // Escovas +
                c3: 0.12, // Mop -
                c9: 0.08, // Docks +
            },
        },
        {
            id: 'large-home',
            name: 'Casa Grande',
            description: 'Prioriza navegação e bateria para áreas >80m².',
            icon: '🏠',
            weightOverrides: {
                c1: 0.30, // Navegação +
                c7: 0.10, // Bateria +
                c5: 0.05, // Altura -
            },
        },
        {
            id: 'low-maintenance',
            name: 'Zero Manutenção',
            description: 'Foco em bases auto-limpantes.',
            icon: '🦥',
            weightOverrides: {
                c9: 0.15, // Docks +
                c6: 0.12, // Peças +
                c1: 0.18, // Navegação -
            },
        },
    ],
};

// ============================================
// STICK VACUUM
// ============================================

export const STICK_VACUUM_CATEGORY: CategoryDefinition = {
    id: 'stick_vacuum', name: 'Aspiradores Verticais', nameSingular: 'Aspirador Vertical',
    slug: 'aspiradores-verticais', description: 'Compare aspiradores verticais.', icon: 'Zap',
    criteria: [
        { id: 'c1', label: 'Sucção', weight: 0.20, group: 'QS', description: 'Pa.', icon: 'Wind' },
        { id: 'c2', label: 'Bateria', weight: 0.16, group: 'QS', description: 'Minutos.', icon: 'Battery' },
        { id: 'c3', label: 'Peso', weight: 0.12, group: 'GS', description: 'Ergonomia.', icon: 'Feather' },
        { id: 'c4', label: 'Acessórios', weight: 0.10, group: 'GS', description: 'Bocais.', icon: 'Package' },
        { id: 'c5', label: 'Capacidade', weight: 0.10, group: 'QS', description: 'Litros.', icon: 'Box' },
        { id: 'c6', label: 'Custo-Benefício', weight: 0.14, group: 'VS', description: 'Preço.', icon: 'PiggyBank' },
        { id: 'c7', label: 'Ruído', weight: 0.08, group: 'GS', description: 'dB.', icon: 'VolumeX' },
        { id: 'c8', label: 'Filtro', weight: 0.06, group: 'GS', description: 'HEPA.', icon: 'Filter' },
        { id: 'c9', label: 'Recarga', weight: 0.02, group: 'GS', description: 'Tempo.', icon: 'Zap' },
        { id: 'c10', label: 'Display', weight: 0.02, group: 'GS', description: 'Info.', icon: 'Monitor' },
    ],
    profiles: [
        { id: 'balanced', name: 'Equilibrado', description: 'Geral.', icon: '⚖️', weightOverrides: {} },
    ],
};

// ============================================
// FAN
// ============================================

export const FAN_CATEGORY: CategoryDefinition = {
    id: 'fan', name: 'Ventiladores', nameSingular: 'Ventilador',
    slug: 'ventiladores', description: 'Compare ventiladores.', icon: 'Fan',
    criteria: [
        { id: 'c1', label: 'Vazão', weight: 0.20, group: 'QS', description: 'm³/min.', icon: 'Wind' },
        { id: 'c2', label: 'Ruído', weight: 0.16, group: 'QS', description: 'dB.', icon: 'VolumeX' },
        { id: 'c3', label: 'Velocidades', weight: 0.12, group: 'GS', description: 'Níveis.', icon: 'Gauge' },
        { id: 'c4', label: 'Oscilação', weight: 0.10, group: 'GS', description: 'Ângulo.', icon: 'Repeat' },
        { id: 'c5', label: 'Custo-Benefício', weight: 0.16, group: 'VS', description: 'Preço.', icon: 'PiggyBank' },
        { id: 'c6', label: 'Consumo', weight: 0.10, group: 'VS', description: 'Watts.', icon: 'Leaf' },
        { id: 'c7', label: 'Construção', weight: 0.08, group: 'QS', description: 'Material.', icon: 'Shield' },
        { id: 'c8', label: 'Controle', weight: 0.04, group: 'GS', description: 'Remoto.', icon: 'Zap' },
        { id: 'c9', label: 'Timer', weight: 0.02, group: 'GS', description: 'Programar.', icon: 'Clock' },
        { id: 'c10', label: 'Tipo', weight: 0.02, group: 'GS', description: 'Coluna/Mesa.', icon: 'Box' },
    ],
    profiles: [
        { id: 'balanced', name: 'Equilibrado', description: 'Geral.', icon: '⚖️', weightOverrides: {} },
        { id: 'silent', name: 'Silencioso', description: 'Quarto.', icon: '🛏️', weightOverrides: { c2: 0.28 } },
    ],
};

// ============================================
// SECURITY CAMERA
// ============================================

export const SECURITY_CAMERA_CATEGORY: CategoryDefinition = {
    id: 'security_camera', name: 'Câmeras de Segurança', nameSingular: 'Câmera de Segurança',
    slug: 'cameras-seguranca', description: 'Compare câmeras IP.', icon: 'Camera',
    criteria: [
        { id: 'c1', label: 'Resolução', weight: 0.18, group: 'QS', description: '1080p/4K.', icon: 'Image' },
        { id: 'c2', label: 'Visão Noturna', weight: 0.14, group: 'QS', description: 'IR/Color.', icon: 'Moon' },
        { id: 'c3', label: 'Detecção', weight: 0.14, group: 'QS', description: 'Movimento/Pessoa.', icon: 'Eye' },
        { id: 'c4', label: 'Armazenamento', weight: 0.12, group: 'GS', description: 'Cloud/SD.', icon: 'Cloud' },
        { id: 'c5', label: 'Custo-Benefício', weight: 0.14, group: 'VS', description: 'Preço.', icon: 'PiggyBank' },
        { id: 'c6', label: 'App', weight: 0.10, group: 'GS', description: 'Interface.', icon: 'Smartphone' },
        { id: 'c7', label: 'Áudio', weight: 0.08, group: 'GS', description: 'Bidirecional.', icon: 'Mic' },
        { id: 'c8', label: 'Instalação', weight: 0.06, group: 'GS', description: 'Interna/Externa.', icon: 'Home' },
        { id: 'c9', label: 'Conectividade', weight: 0.02, group: 'GS', description: 'Wi-Fi.', icon: 'Wifi' },
        { id: 'c10', label: 'PTZ', weight: 0.02, group: 'GS', description: 'Pan/Tilt.', icon: 'Move' },
    ],
    profiles: [
        { id: 'balanced', name: 'Equilibrado', description: 'Geral.', icon: '⚖️', weightOverrides: {} },
    ],
};

// ============================================
// SMART LOCK
// ============================================

export const SMART_LOCK_CATEGORY: CategoryDefinition = {
    id: 'smart_lock', name: 'Fechaduras Digitais', nameSingular: 'Fechadura Digital',
    slug: 'fechaduras-digitais', description: 'Compare fechaduras smart.', icon: 'Lock',
    criteria: [
        { id: 'c1', label: 'Segurança', weight: 0.22, group: 'QS', description: 'Criptografia.', icon: 'Shield' },
        { id: 'c2', label: 'Métodos', weight: 0.16, group: 'GS', description: 'Digital/App/Chave.', icon: 'Key' },
        { id: 'c3', label: 'Bateria', weight: 0.12, group: 'QS', description: 'Duração.', icon: 'Battery' },
        { id: 'c4', label: 'Construção', weight: 0.14, group: 'QS', description: 'Material.', icon: 'Box' },
        { id: 'c5', label: 'Custo-Benefício', weight: 0.14, group: 'VS', description: 'Preço.', icon: 'PiggyBank' },
        { id: 'c6', label: 'App', weight: 0.08, group: 'GS', description: 'Controle.', icon: 'Smartphone' },
        { id: 'c7', label: 'Instalação', weight: 0.06, group: 'GS', description: 'DIY.', icon: 'Wrench' },
        { id: 'c8', label: 'Biometria', weight: 0.04, group: 'GS', description: 'Digital.', icon: 'Fingerprint' },
        { id: 'c9', label: 'Histórico', weight: 0.02, group: 'GS', description: 'Logs.', icon: 'History' },
        { id: 'c10', label: 'Alarme', weight: 0.02, group: 'GS', description: 'Anti-arrombamento.', icon: 'Bell' },
    ],
    profiles: [
        { id: 'balanced', name: 'Equilibrado', description: 'Geral.', icon: '⚖️', weightOverrides: {} },
    ],
};

// ============================================
// ROUTER
// ============================================

export const ROUTER_CATEGORY: CategoryDefinition = {
    id: 'router', name: 'Roteadores', nameSingular: 'Roteador',
    slug: 'roteadores', description: 'Compare roteadores Wi-Fi.', icon: 'Wifi',
    criteria: [
        { id: 'c1', label: 'Velocidade', weight: 0.18, group: 'QS', description: 'Mbps.', icon: 'Zap' },
        { id: 'c2', label: 'Cobertura', weight: 0.16, group: 'QS', description: 'm².', icon: 'Radio' },
        { id: 'c3', label: 'Wi-Fi', weight: 0.14, group: 'QS', description: '6/6E/7.', icon: 'Wifi' },
        { id: 'c4', label: 'Portas', weight: 0.10, group: 'GS', description: 'Gigabit.', icon: 'Plug' },
        { id: 'c5', label: 'Custo-Benefício', weight: 0.16, group: 'VS', description: 'Preço.', icon: 'PiggyBank' },
        { id: 'c6', label: 'Mesh', weight: 0.10, group: 'GS', description: 'Expansível.', icon: 'Grid' },
        { id: 'c7', label: 'Segurança', weight: 0.08, group: 'QS', description: 'WPA3.', icon: 'Shield' },
        { id: 'c8', label: 'QoS', weight: 0.04, group: 'GS', description: 'Gaming.', icon: 'Gamepad2' },
        { id: 'c9', label: 'App', weight: 0.02, group: 'GS', description: 'Config.', icon: 'Smartphone' },
        { id: 'c10', label: 'USB', weight: 0.02, group: 'GS', description: 'NAS.', icon: 'HardDrive' },
    ],
    profiles: [
        { id: 'balanced', name: 'Equilibrado', description: 'Geral.', icon: '⚖️', weightOverrides: {} },
        { id: 'gamer', name: 'Gaming', description: 'Latência.', icon: '🎮', weightOverrides: { c1: 0.24, c8: 0.10 } },
    ],
};

// ============================================
// FREEZER
// ============================================

export const FREEZER_CATEGORY: CategoryDefinition = {
    id: 'freezer', name: 'Freezers', nameSingular: 'Freezer',
    slug: 'freezers', description: 'Compare freezers verticais e horizontais.', icon: 'Snowflake',
    criteria: [
        { id: 'c1', label: 'Capacidade', weight: 0.18, group: 'QS', description: 'Litros.', icon: 'Package' },
        { id: 'c2', label: 'Eficiência', weight: 0.16, group: 'VS', description: 'Selo Procel.', icon: 'Leaf' },
        { id: 'c3', label: 'Frost Free', weight: 0.14, group: 'QS', description: 'Degelo.', icon: 'Snowflake' },
        { id: 'c4', label: 'Custo-Benefício', weight: 0.16, group: 'VS', description: 'Preço.', icon: 'PiggyBank' },
        { id: 'c5', label: 'Durabilidade', weight: 0.12, group: 'QS', description: 'Construção.', icon: 'Shield' },
        { id: 'c6', label: 'Ruído', weight: 0.08, group: 'GS', description: 'dB.', icon: 'VolumeX' },
        { id: 'c7', label: 'Tipo', weight: 0.06, group: 'GS', description: 'Vertical/Horizontal.', icon: 'Box' },
        { id: 'c8', label: 'Organização', weight: 0.06, group: 'GS', description: 'Gavetas.', icon: 'Layers' },
        { id: 'c9', label: 'Pós-Venda', weight: 0.02, group: 'VS', description: 'Garantia.', icon: 'HeadphonesIcon' },
        { id: 'c10', label: 'Alarme', weight: 0.02, group: 'GS', description: 'Porta aberta.', icon: 'Bell' },
    ],
    profiles: [{ id: 'balanced', name: 'Equilibrado', description: 'Geral.', icon: '⚖️', weightOverrides: {} }],
};

// ============================================
// MINIBAR
// ============================================

export const MINIBAR_CATEGORY: CategoryDefinition = {
    id: 'minibar', name: 'Frigobares', nameSingular: 'Frigobar',
    slug: 'frigobares', description: 'Compare frigobares e minibars.', icon: 'Refrigerator',
    criteria: [
        { id: 'c1', label: 'Capacidade', weight: 0.18, group: 'QS', description: 'Litros.', icon: 'Package' },
        { id: 'c2', label: 'Eficiência', weight: 0.16, group: 'VS', description: 'Consumo.', icon: 'Leaf' },
        { id: 'c3', label: 'Ruído', weight: 0.14, group: 'QS', description: 'dB.', icon: 'VolumeX' },
        { id: 'c4', label: 'Custo-Benefício', weight: 0.16, group: 'VS', description: 'Preço.', icon: 'PiggyBank' },
        { id: 'c5', label: 'Compacto', weight: 0.12, group: 'GS', description: 'Tamanho.', icon: 'Box' },
        { id: 'c6', label: 'Resfriamento', weight: 0.10, group: 'QS', description: 'Temperatura.', icon: 'Snowflake' },
        { id: 'c7', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética.', icon: 'Palette' },
        { id: 'c8', label: 'Durabilidade', weight: 0.04, group: 'QS', description: 'Construção.', icon: 'Shield' },
        { id: 'c9', label: 'Prateleiras', weight: 0.01, group: 'GS', description: 'Organização.', icon: 'Layers' },
        { id: 'c10', label: 'Porta', weight: 0.01, group: 'GS', description: 'Reversível.', icon: 'Door' },
    ],
    profiles: [{ id: 'balanced', name: 'Equilibrado', description: 'Geral.', icon: '⚖️', weightOverrides: {} }],
};

// ============================================
// WINE COOLER
// ============================================

export const WINE_COOLER_CATEGORY: CategoryDefinition = {
    id: 'wine_cooler', name: 'Adegas', nameSingular: 'Adega',
    slug: 'adegas', description: 'Compare adegas climatizadas.', icon: 'Wine',
    criteria: [
        { id: 'c1', label: 'Capacidade', weight: 0.18, group: 'QS', description: 'Garrafas.', icon: 'Package' },
        { id: 'c2', label: 'Zonas', weight: 0.14, group: 'QS', description: 'Temperaturas.', icon: 'Thermometer' },
        { id: 'c3', label: 'Ruído', weight: 0.12, group: 'QS', description: 'dB.', icon: 'VolumeX' },
        { id: 'c4', label: 'Custo-Benefício', weight: 0.16, group: 'VS', description: 'Preço.', icon: 'PiggyBank' },
        { id: 'c5', label: 'Precisão', weight: 0.12, group: 'QS', description: 'Controle temp.', icon: 'Target' },
        { id: 'c6', label: 'Design', weight: 0.10, group: 'GS', description: 'Vidro/LED.', icon: 'Palette' },
        { id: 'c7', label: 'Eficiência', weight: 0.08, group: 'VS', description: 'Consumo.', icon: 'Leaf' },
        { id: 'c8', label: 'Vibração', weight: 0.06, group: 'QS', description: 'Compressor.', icon: 'Activity' },
        { id: 'c9', label: 'UV', weight: 0.02, group: 'GS', description: 'Proteção.', icon: 'Sun' },
        { id: 'c10', label: 'Trava', weight: 0.02, group: 'GS', description: 'Segurança.', icon: 'Lock' },
    ],
    profiles: [{ id: 'balanced', name: 'Equilibrado', description: 'Geral.', icon: '⚖️', weightOverrides: {} }],
};

// ============================================
// UPS / NOBREAK
// ============================================

export const UPS_CATEGORY: CategoryDefinition = {
    id: 'ups', name: 'Nobreaks', nameSingular: 'Nobreak',
    slug: 'nobreaks', description: 'Compare nobreaks e estabilizadores.', icon: 'Zap',
    criteria: [
        { id: 'c1', label: 'Potência', weight: 0.20, group: 'QS', description: 'VA.', icon: 'Zap' },
        { id: 'c2', label: 'Autonomia', weight: 0.18, group: 'QS', description: 'Minutos.', icon: 'Clock' },
        { id: 'c3', label: 'Tomadas', weight: 0.12, group: 'GS', description: 'Quantidade.', icon: 'Plug' },
        { id: 'c4', label: 'Custo-Benefício', weight: 0.16, group: 'VS', description: 'Preço.', icon: 'PiggyBank' },
        { id: 'c5', label: 'Proteções', weight: 0.12, group: 'QS', description: 'Surto/Sobretensão.', icon: 'Shield' },
        { id: 'c6', label: 'Bateria', weight: 0.10, group: 'QS', description: 'Tipo/Vida.', icon: 'Battery' },
        { id: 'c7', label: 'USB', weight: 0.06, group: 'GS', description: 'Gerenciamento.', icon: 'Usb' },
        { id: 'c8', label: 'Ruído', weight: 0.04, group: 'GS', description: 'dB.', icon: 'VolumeX' },
        { id: 'c9', label: 'Display', weight: 0.01, group: 'GS', description: 'Info.', icon: 'Monitor' },
        { id: 'c10', label: 'Tamanho', weight: 0.01, group: 'GS', description: 'Compacto.', icon: 'Box' },
    ],
    profiles: [{ id: 'balanced', name: 'Equilibrado', description: 'Geral.', icon: '⚖️', weightOverrides: {} }],
};

// ============================================
// POWER STRIP
// ============================================

export const POWER_STRIP_CATEGORY: CategoryDefinition = {
    id: 'power_strip', name: 'Filtros de Linha', nameSingular: 'Filtro de Linha',
    slug: 'filtros-linha', description: 'Compare filtros de linha e estabilizadores.', icon: 'Plug',
    criteria: [
        { id: 'c1', label: 'Proteção', weight: 0.22, group: 'QS', description: 'Surto/DPS.', icon: 'Shield' },
        { id: 'c2', label: 'Tomadas', weight: 0.18, group: 'GS', description: 'Quantidade.', icon: 'Plug' },
        { id: 'c3', label: 'Custo-Benefício', weight: 0.18, group: 'VS', description: 'Preço.', icon: 'PiggyBank' },
        { id: 'c4', label: 'Construção', weight: 0.14, group: 'QS', description: 'Material.', icon: 'Box' },
        { id: 'c5', label: 'USB', weight: 0.10, group: 'GS', description: 'Carregamento.', icon: 'Usb' },
        { id: 'c6', label: 'Cabo', weight: 0.08, group: 'GS', description: 'Comprimento.', icon: 'Cable' },
        { id: 'c7', label: 'Disjuntor', weight: 0.06, group: 'QS', description: 'Reset.', icon: 'ToggleRight' },
        { id: 'c8', label: 'LED', weight: 0.02, group: 'GS', description: 'Status.', icon: 'Lightbulb' },
        { id: 'c9', label: 'Garantia', weight: 0.01, group: 'VS', description: 'Cobertura.', icon: 'Clock' },
        { id: 'c10', label: 'Base', weight: 0.01, group: 'GS', description: 'Fixação.', icon: 'Anchor' },
    ],
    profiles: [{ id: 'balanced', name: 'Equilibrado', description: 'Geral.', icon: '⚖️', weightOverrides: {} }],
};

// ============================================
// WASHER DRYER (Lava e Seca)
// ============================================

export const WASHER_DRYER_CATEGORY: CategoryDefinition = {
    id: 'washer_dryer', name: 'Lava e Secas', nameSingular: 'Lava e Seca',
    slug: 'lava-e-secas', description: 'Compare lava e secas.', icon: 'Waves',
    criteria: [
        { id: 'c1', label: 'Lavagem', weight: 0.16, group: 'QS', description: 'Eficiência.', icon: 'Sparkles' },
        { id: 'c2', label: 'Secagem', weight: 0.16, group: 'QS', description: 'Qualidade.', icon: 'Sun' },
        { id: 'c3', label: 'Capacidade', weight: 0.14, group: 'QS', description: 'Kg.', icon: 'Package' },
        { id: 'c4', label: 'Consumo', weight: 0.12, group: 'VS', description: 'Água/Energia.', icon: 'Leaf' },
        { id: 'c5', label: 'Custo-Benefício', weight: 0.14, group: 'VS', description: 'Preço.', icon: 'PiggyBank' },
        { id: 'c6', label: 'Ruído', weight: 0.10, group: 'QS', description: 'dB.', icon: 'VolumeX' },
        { id: 'c7', label: 'Ciclos', weight: 0.08, group: 'GS', description: 'Programas.', icon: 'Settings' },
        { id: 'c8', label: 'Durabilidade', weight: 0.06, group: 'QS', description: 'Construção.', icon: 'Shield' },
        { id: 'c9', label: 'Smart', weight: 0.02, group: 'GS', description: 'App.', icon: 'Wifi' },
        { id: 'c10', label: 'Pós-Venda', weight: 0.02, group: 'VS', description: 'Assistência.', icon: 'HeadphonesIcon' },
    ],
    profiles: [{ id: 'balanced', name: 'Equilibrado', description: 'Geral.', icon: '⚖️', weightOverrides: {} }],
};

// ============================================
// DISHWASHER
// ============================================

export const DISHWASHER_CATEGORY: CategoryDefinition = {
    id: 'dishwasher', name: 'Lava-Louças', nameSingular: 'Lava-Louça',
    slug: 'lava-loucas', description: 'Compare lava-louças.', icon: 'Utensils',
    criteria: [
        { id: 'c1', label: 'Lavagem', weight: 0.18, group: 'QS', description: 'Limpeza.', icon: 'Sparkles' },
        { id: 'c2', label: 'Capacidade', weight: 0.14, group: 'QS', description: 'Serviços.', icon: 'Package' },
        { id: 'c3', label: 'Consumo', weight: 0.14, group: 'VS', description: 'Água/Energia.', icon: 'Leaf' },
        { id: 'c4', label: 'Custo-Benefício', weight: 0.16, group: 'VS', description: 'Preço.', icon: 'PiggyBank' },
        { id: 'c5', label: 'Ruído', weight: 0.10, group: 'QS', description: 'dB.', icon: 'VolumeX' },
        { id: 'c6', label: 'Ciclos', weight: 0.10, group: 'GS', description: 'Programas.', icon: 'Settings' },
        { id: 'c7', label: 'Secagem', weight: 0.08, group: 'QS', description: 'Qualidade.', icon: 'Sun' },
        { id: 'c8', label: 'Organização', weight: 0.06, group: 'GS', description: 'Racks.', icon: 'Layers' },
        { id: 'c9', label: 'Durabilidade', weight: 0.02, group: 'QS', description: 'Construção.', icon: 'Shield' },
        { id: 'c10', label: 'Smart', weight: 0.02, group: 'GS', description: 'App.', icon: 'Wifi' },
    ],
    profiles: [{ id: 'balanced', name: 'Equilibrado', description: 'Geral.', icon: '⚖️', weightOverrides: {} }],
};

// ============================================
// MICROWAVE
// ============================================

export const MICROWAVE_CATEGORY: CategoryDefinition = {
    id: 'microwave', name: 'Micro-ondas', nameSingular: 'Micro-ondas',
    slug: 'micro-ondas', description: 'Compare micro-ondas.', icon: 'Microwave',
    criteria: [
        { id: 'c1', label: 'Potência', weight: 0.18, group: 'QS', description: 'Watts.', icon: 'Zap' },
        { id: 'c2', label: 'Capacidade', weight: 0.16, group: 'QS', description: 'Litros.', icon: 'Package' },
        { id: 'c3', label: 'Uniformidade', weight: 0.14, group: 'QS', description: 'Aquecimento.', icon: 'Flame' },
        { id: 'c4', label: 'Custo-Benefício', weight: 0.16, group: 'VS', description: 'Preço.', icon: 'PiggyBank' },
        { id: 'c5', label: 'Funções', weight: 0.12, group: 'GS', description: 'Grill/Convecção.', icon: 'Settings' },
        { id: 'c6', label: 'Interface', weight: 0.08, group: 'GS', description: 'Painel.', icon: 'MonitorSmartphone' },
        { id: 'c7', label: 'Design', weight: 0.06, group: 'GS', description: 'Estética.', icon: 'Palette' },
        { id: 'c8', label: 'Durabilidade', weight: 0.06, group: 'QS', description: 'Construção.', icon: 'Shield' },
        { id: 'c9', label: 'Limpeza', weight: 0.02, group: 'GS', description: 'Interno.', icon: 'Sparkles' },
        { id: 'c10', label: 'Receitas', weight: 0.02, group: 'GS', description: 'Pré-programas.', icon: 'Book' },
    ],
    profiles: [{ id: 'balanced', name: 'Equilibrado', description: 'Geral.', icon: '⚖️', weightOverrides: {} }],
};

// ============================================
// STOVE / COOKTOP
// ============================================

export const STOVE_CATEGORY: CategoryDefinition = {
    id: 'stove', name: 'Fogões/Cooktops', nameSingular: 'Fogão',
    slug: 'fogoes-cooktops', description: 'Compare fogões e cooktops.', icon: 'Flame',
    criteria: [
        { id: 'c1', label: 'Queimadores', weight: 0.18, group: 'QS', description: 'Potência/Bocas.', icon: 'Flame' },
        { id: 'c2', label: 'Forno', weight: 0.16, group: 'QS', description: 'Capacidade/Funções.', icon: 'Box' },
        { id: 'c3', label: 'Tipo', weight: 0.12, group: 'GS', description: 'Gás/Indução/Vitro.', icon: 'Zap' },
        { id: 'c4', label: 'Custo-Benefício', weight: 0.16, group: 'VS', description: 'Preço.', icon: 'PiggyBank' },
        { id: 'c5', label: 'Segurança', weight: 0.12, group: 'QS', description: 'Válvula/Trava.', icon: 'Shield' },
        { id: 'c6', label: 'Durabilidade', weight: 0.10, group: 'QS', description: 'Construção.', icon: 'Box' },
        { id: 'c7', label: 'Limpeza', weight: 0.08, group: 'GS', description: 'Superfície.', icon: 'Sparkles' },
        { id: 'c8', label: 'Design', weight: 0.04, group: 'GS', description: 'Estética.', icon: 'Palette' },
        { id: 'c9', label: 'Timer', weight: 0.02, group: 'GS', description: 'Programar.', icon: 'Clock' },
        { id: 'c10', label: 'Garantia', weight: 0.02, group: 'VS', description: 'Cobertura.', icon: 'Clock' },
    ],
    profiles: [{ id: 'balanced', name: 'Equilibrado', description: 'Geral.', icon: '⚖️', weightOverrides: {} }],
};

// ============================================
// AIR FRYER
// ============================================

export const AIR_FRYER_CATEGORY: CategoryDefinition = {
    id: 'air_fryer', name: 'Air Fryers', nameSingular: 'Air Fryer',
    slug: 'air-fryers', description: 'Compare fritadeiras sem óleo.', icon: 'Wind',
    criteria: [
        { id: 'c1', label: 'Capacidade', weight: 0.18, group: 'QS', description: 'Litros.', icon: 'Package' },
        { id: 'c2', label: 'Potência', weight: 0.16, group: 'QS', description: 'Watts.', icon: 'Zap' },
        { id: 'c3', label: 'Resultado', weight: 0.14, group: 'QS', description: 'Crocância.', icon: 'Flame' },
        { id: 'c4', label: 'Custo-Benefício', weight: 0.16, group: 'VS', description: 'Preço.', icon: 'PiggyBank' },
        { id: 'c5', label: 'Funções', weight: 0.10, group: 'GS', description: 'Programas.', icon: 'Settings' },
        { id: 'c6', label: 'Limpeza', weight: 0.10, group: 'GS', description: 'Antiaderente.', icon: 'Sparkles' },
        { id: 'c7', label: 'Design', weight: 0.06, group: 'GS', description: 'Estética.', icon: 'Palette' },
        { id: 'c8', label: 'Timer', weight: 0.04, group: 'GS', description: 'Digital.', icon: 'Clock' },
        { id: 'c9', label: 'Durabilidade', weight: 0.04, group: 'QS', description: 'Construção.', icon: 'Shield' },
        { id: 'c10', label: 'Receitas', weight: 0.02, group: 'GS', description: 'Livro.', icon: 'Book' },
    ],
    profiles: [{ id: 'balanced', name: 'Equilibrado', description: 'Geral.', icon: '⚖️', weightOverrides: {} }],
};

// ============================================
// ESPRESSO MACHINE
// ============================================

export const ESPRESSO_CATEGORY: CategoryDefinition = {
    id: 'espresso', name: 'Cafeteiras', nameSingular: 'Cafeteira',
    slug: 'cafeteiras', description: 'Compare cafeteiras espresso e cápsulas.', icon: 'Coffee',
    criteria: [
        { id: 'c1', label: 'Qualidade', weight: 0.20, group: 'QS', description: 'Extração/Crema.', icon: 'Coffee' },
        { id: 'c2', label: 'Pressão', weight: 0.14, group: 'QS', description: 'Bar.', icon: 'Gauge' },
        { id: 'c3', label: 'Tipo', weight: 0.12, group: 'GS', description: 'Cápsula/Grão/Pó.', icon: 'Settings' },
        { id: 'c4', label: 'Custo-Benefício', weight: 0.16, group: 'VS', description: 'Preço.', icon: 'PiggyBank' },
        { id: 'c5', label: 'Vaporizador', weight: 0.10, group: 'GS', description: 'Leite.', icon: 'Droplet' },
        { id: 'c6', label: 'Reservatório', weight: 0.08, group: 'GS', description: 'Água.', icon: 'Droplet' },
        { id: 'c7', label: 'Limpeza', weight: 0.08, group: 'GS', description: 'Manutenção.', icon: 'Sparkles' },
        { id: 'c8', label: 'Aquecimento', weight: 0.06, group: 'QS', description: 'Velocidade.', icon: 'Flame' },
        { id: 'c9', label: 'Design', weight: 0.04, group: 'GS', description: 'Estética.', icon: 'Palette' },
        { id: 'c10', label: 'Custo Cápsula', weight: 0.02, group: 'VS', description: 'Operação.', icon: 'DollarSign' },
    ],
    profiles: [{ id: 'balanced', name: 'Equilibrado', description: 'Geral.', icon: '⚖️', weightOverrides: {} }],
};

// ============================================
// MIXER / BATEDEIRA
// ============================================

export const MIXER_CATEGORY: CategoryDefinition = {
    id: 'mixer', name: 'Batedeiras/Mixers', nameSingular: 'Batedeira',
    slug: 'batedeiras-mixers', description: 'Compare batedeiras e mixers.', icon: 'Utensils',
    criteria: [
        { id: 'c1', label: 'Potência', weight: 0.20, group: 'QS', description: 'Watts.', icon: 'Zap' },
        { id: 'c2', label: 'Velocidades', weight: 0.14, group: 'GS', description: 'Níveis.', icon: 'Gauge' },
        { id: 'c3', label: 'Capacidade', weight: 0.14, group: 'QS', description: 'Tigela.', icon: 'Package' },
        { id: 'c4', label: 'Custo-Benefício', weight: 0.16, group: 'VS', description: 'Preço.', icon: 'PiggyBank' },
        { id: 'c5', label: 'Acessórios', weight: 0.12, group: 'GS', description: 'Batedores.', icon: 'Package' },
        { id: 'c6', label: 'Durabilidade', weight: 0.10, group: 'QS', description: 'Motor.', icon: 'Shield' },
        { id: 'c7', label: 'Ergonomia', weight: 0.06, group: 'GS', description: 'Peso/Pega.', icon: 'Hand' },
        { id: 'c8', label: 'Tipo', weight: 0.04, group: 'GS', description: 'Planetária/Manual.', icon: 'Settings' },
        { id: 'c9', label: 'Limpeza', weight: 0.02, group: 'GS', description: 'Lavável.', icon: 'Sparkles' },
        { id: 'c10', label: 'Garantia', weight: 0.02, group: 'VS', description: 'Cobertura.', icon: 'Clock' },
    ],
    profiles: [{ id: 'balanced', name: 'Equilibrado', description: 'Geral.', icon: '⚖️', weightOverrides: {} }],
};

// ============================================
// WATER PURIFIER
// ============================================

export const WATER_PURIFIER_CATEGORY: CategoryDefinition = {
    id: 'water_purifier', name: 'Purificadores', nameSingular: 'Purificador',
    slug: 'purificadores', description: 'Compare purificadores de água.', icon: 'Droplet',
    criteria: [
        { id: 'c1', label: 'Filtragem', weight: 0.22, group: 'QS', description: 'Qualidade.', icon: 'Filter' },
        { id: 'c2', label: 'Refrigeração', weight: 0.16, group: 'QS', description: 'Gelada.', icon: 'Snowflake' },
        { id: 'c3', label: 'Custo-Benefício', weight: 0.16, group: 'VS', description: 'Preço.', icon: 'PiggyBank' },
        { id: 'c4', label: 'Custo Refil', weight: 0.12, group: 'VS', description: 'Manutenção.', icon: 'DollarSign' },
        { id: 'c5', label: 'Vazão', weight: 0.10, group: 'QS', description: 'L/hora.', icon: 'Droplet' },
        { id: 'c6', label: 'Vida Filtro', weight: 0.10, group: 'QS', description: 'Duração.', icon: 'Clock' },
        { id: 'c7', label: 'Design', weight: 0.06, group: 'GS', description: 'Estética.', icon: 'Palette' },
        { id: 'c8', label: 'Instalação', weight: 0.04, group: 'GS', description: 'Fácil.', icon: 'Wrench' },
        { id: 'c9', label: 'Consumo', weight: 0.02, group: 'VS', description: 'Energia.', icon: 'Leaf' },
        { id: 'c10', label: 'Bactericida', weight: 0.02, group: 'QS', description: 'UV.', icon: 'Shield' },
    ],
    profiles: [{ id: 'balanced', name: 'Equilibrado', description: 'Geral.', icon: '⚖️', weightOverrides: {} }],
};

// ============================================
// RANGE HOOD / COIFA
// ============================================

export const RANGE_HOOD_CATEGORY: CategoryDefinition = {
    id: 'range_hood', name: 'Coifas/Depuradores', nameSingular: 'Coifa',
    slug: 'coifas-depuradores', description: 'Compare coifas e depuradores.', icon: 'Wind',
    criteria: [
        { id: 'c1', label: 'Vazão', weight: 0.20, group: 'QS', description: 'm³/h.', icon: 'Wind' },
        { id: 'c2', label: 'Ruído', weight: 0.16, group: 'QS', description: 'dB.', icon: 'VolumeX' },
        { id: 'c3', label: 'Custo-Benefício', weight: 0.16, group: 'VS', description: 'Preço.', icon: 'PiggyBank' },
        { id: 'c4', label: 'Tipo', weight: 0.12, group: 'GS', description: 'Parede/Ilha/Depurador.', icon: 'Box' },
        { id: 'c5', label: 'Iluminação', weight: 0.10, group: 'GS', description: 'LED.', icon: 'Lightbulb' },
        { id: 'c6', label: 'Filtros', weight: 0.10, group: 'QS', description: 'Lavável/Carvão.', icon: 'Filter' },
        { id: 'c7', label: 'Design', weight: 0.08, group: 'GS', description: 'Estética.', icon: 'Palette' },
        { id: 'c8', label: 'Velocidades', weight: 0.04, group: 'GS', description: 'Níveis.', icon: 'Gauge' },
        { id: 'c9', label: 'Tamanho', weight: 0.02, group: 'GS', description: 'cm.', icon: 'Ruler' },
        { id: 'c10', label: 'Garantia', weight: 0.02, group: 'VS', description: 'Cobertura.', icon: 'Clock' },
    ],
    profiles: [{ id: 'balanced', name: 'Equilibrado', description: 'Geral.', icon: '⚖️', weightOverrides: {} }],
};

// ============================================
// BUILTIN OVEN
// ============================================

export const BUILTIN_OVEN_CATEGORY: CategoryDefinition = {
    id: 'builtin_oven', name: 'Fornos de Embutir', nameSingular: 'Forno',
    slug: 'fornos-embutir', description: 'Compare fornos de embutir.', icon: 'Flame',
    criteria: [
        { id: 'c1', label: 'Capacidade', weight: 0.18, group: 'QS', description: 'Litros.', icon: 'Package' },
        { id: 'c2', label: 'Uniformidade', weight: 0.16, group: 'QS', description: 'Aquecimento.', icon: 'Flame' },
        { id: 'c3', label: 'Funções', weight: 0.14, group: 'GS', description: 'Convecção/Grill.', icon: 'Settings' },
        { id: 'c4', label: 'Custo-Benefício', weight: 0.16, group: 'VS', description: 'Preço.', icon: 'PiggyBank' },
        { id: 'c5', label: 'Tipo', weight: 0.10, group: 'GS', description: 'Elétrico/Gás.', icon: 'Zap' },
        { id: 'c6', label: 'Limpeza', weight: 0.10, group: 'GS', description: 'Pirolítico.', icon: 'Sparkles' },
        { id: 'c7', label: 'Design', weight: 0.08, group: 'GS', description: 'Acabamento.', icon: 'Palette' },
        { id: 'c8', label: 'Timer', weight: 0.04, group: 'GS', description: 'Programar.', icon: 'Clock' },
        { id: 'c9', label: 'Segurança', weight: 0.02, group: 'QS', description: 'Porta fria.', icon: 'Shield' },
        { id: 'c10', label: 'Garantia', weight: 0.02, group: 'VS', description: 'Cobertura.', icon: 'Clock' },
    ],
    profiles: [{ id: 'balanced', name: 'Equilibrado', description: 'Geral.', icon: '⚖️', weightOverrides: {} }],
};

// ============================================
// PRINTER
// ============================================

export const PRINTER_CATEGORY: CategoryDefinition = {
    id: 'printer', name: 'Impressoras', nameSingular: 'Impressora',
    slug: 'impressoras', description: 'Compare impressoras.', icon: 'Printer',
    criteria: [
        { id: 'c1', label: 'Qualidade', weight: 0.18, group: 'QS', description: 'DPI/Foto.', icon: 'Image' },
        { id: 'c2', label: 'Velocidade', weight: 0.14, group: 'QS', description: 'PPM.', icon: 'Zap' },
        { id: 'c3', label: 'Custo Página', weight: 0.16, group: 'VS', description: 'Tinta/Toner.', icon: 'DollarSign' },
        { id: 'c4', label: 'Custo-Benefício', weight: 0.14, group: 'VS', description: 'Preço.', icon: 'PiggyBank' },
        { id: 'c5', label: 'Funções', weight: 0.12, group: 'GS', description: 'Scanner/Cópia.', icon: 'Settings' },
        { id: 'c6', label: 'Conectividade', weight: 0.10, group: 'GS', description: 'Wi-Fi/USB.', icon: 'Wifi' },
        { id: 'c7', label: 'Tipo', weight: 0.06, group: 'GS', description: 'Jato/Laser/Tank.', icon: 'Printer' },
        { id: 'c8', label: 'Bandeja', weight: 0.04, group: 'GS', description: 'Capacidade.', icon: 'Package' },
        { id: 'c9', label: 'Duplex', weight: 0.04, group: 'GS', description: 'Frente/Verso.', icon: 'Repeat' },
        { id: 'c10', label: 'App', weight: 0.02, group: 'GS', description: 'Mobile.', icon: 'Smartphone' },
    ],
    profiles: [{ id: 'balanced', name: 'Equilibrado', description: 'Geral.', icon: '⚖️', weightOverrides: {} }],
};

// ============================================
// CAMERA (Photo)
// ============================================

export const CAMERA_CATEGORY: CategoryDefinition = {
    id: 'camera', name: 'Câmeras', nameSingular: 'Câmera',
    slug: 'cameras', description: 'Compare câmeras fotográficas.', icon: 'Camera',
    criteria: [
        { id: 'c1', label: 'Sensor', weight: 0.20, group: 'QS', description: 'MP/Tamanho.', icon: 'Image' },
        { id: 'c2', label: 'Vídeo', weight: 0.14, group: 'QS', description: '4K/8K.', icon: 'Video' },
        { id: 'c3', label: 'Autofoco', weight: 0.14, group: 'QS', description: 'Velocidade.', icon: 'Target' },
        { id: 'c4', label: 'Custo-Benefício', weight: 0.14, group: 'VS', description: 'Corpo.', icon: 'PiggyBank' },
        { id: 'c5', label: 'ISO', weight: 0.10, group: 'QS', description: 'Baixa luz.', icon: 'Moon' },
        { id: 'c6', label: 'Estabilização', weight: 0.08, group: 'QS', description: 'IBIS.', icon: 'Activity' },
        { id: 'c7', label: 'Lentes', weight: 0.08, group: 'GS', description: 'Ecossistema.', icon: 'Circle' },
        { id: 'c8', label: 'Ergonomia', weight: 0.06, group: 'GS', description: 'Peso/Grip.', icon: 'Hand' },
        { id: 'c9', label: 'Tela', weight: 0.04, group: 'GS', description: 'Flip/Touch.', icon: 'MonitorSmartphone' },
        { id: 'c10', label: 'Conectividade', weight: 0.02, group: 'GS', description: 'Wi-Fi/BT.', icon: 'Wifi' },
    ],
    profiles: [{ id: 'balanced', name: 'Equilibrado', description: 'Geral.', icon: '⚖️', weightOverrides: {} }],
};

// ============================================
// TIRE
// ============================================

export const TIRE_CATEGORY: CategoryDefinition = {
    id: 'tire', name: 'Pneus', nameSingular: 'Pneu',
    slug: 'pneus', description: 'Compare pneus automotivos.', icon: 'Circle',
    criteria: [
        { id: 'c1', label: 'Aderência', weight: 0.22, group: 'QS', description: 'Seco/Molhado.', icon: 'Shield' },
        { id: 'c2', label: 'Durabilidade', weight: 0.18, group: 'QS', description: 'Km.', icon: 'Clock' },
        { id: 'c3', label: 'Custo-Benefício', weight: 0.18, group: 'VS', description: 'Preço.', icon: 'PiggyBank' },
        { id: 'c4', label: 'Ruído', weight: 0.12, group: 'GS', description: 'dB.', icon: 'VolumeX' },
        { id: 'c5', label: 'Economia', weight: 0.10, group: 'VS', description: 'Combustível.', icon: 'Leaf' },
        { id: 'c6', label: 'Conforto', weight: 0.08, group: 'GS', description: 'Absorção.', icon: 'Heart' },
        { id: 'c7', label: 'Performance', weight: 0.06, group: 'QS', description: 'Curvas.', icon: 'TrendingUp' },
        { id: 'c8', label: 'Garantia', weight: 0.04, group: 'VS', description: 'Cobertura.', icon: 'Clock' },
        { id: 'c9', label: 'Run Flat', weight: 0.01, group: 'GS', description: 'Emergência.', icon: 'AlertCircle' },
        { id: 'c10', label: 'Marca', weight: 0.01, group: 'GS', description: 'Reputação.', icon: 'Award' },
    ],
    profiles: [{ id: 'balanced', name: 'Equilibrado', description: 'Geral.', icon: '⚖️', weightOverrides: {} }],
};

// ============================================
// CAR BATTERY
// ============================================

export const CAR_BATTERY_CATEGORY: CategoryDefinition = {
    id: 'car_battery', name: 'Baterias Automotivas', nameSingular: 'Bateria',
    slug: 'baterias-automotivas', description: 'Compare baterias de carro.', icon: 'Battery',
    criteria: [
        { id: 'c1', label: 'Capacidade', weight: 0.20, group: 'QS', description: 'Ah.', icon: 'Battery' },
        { id: 'c2', label: 'CCA', weight: 0.18, group: 'QS', description: 'Partida fria.', icon: 'Snowflake' },
        { id: 'c3', label: 'Vida Útil', weight: 0.16, group: 'QS', description: 'Anos.', icon: 'Clock' },
        { id: 'c4', label: 'Custo-Benefício', weight: 0.18, group: 'VS', description: 'Preço.', icon: 'PiggyBank' },
        { id: 'c5', label: 'Garantia', weight: 0.12, group: 'VS', description: 'Cobertura.', icon: 'Shield' },
        { id: 'c6', label: 'Tipo', weight: 0.08, group: 'GS', description: 'Selada/EFB/AGM.', icon: 'Settings' },
        { id: 'c7', label: 'Marca', weight: 0.04, group: 'GS', description: 'Reputação.', icon: 'Award' },
        { id: 'c8', label: 'Compatibilidade', weight: 0.02, group: 'GS', description: 'Veículo.', icon: 'Car' },
        { id: 'c9', label: 'Peso', weight: 0.01, group: 'GS', description: 'Kg.', icon: 'Scale' },
        { id: 'c10', label: 'Amperagem', weight: 0.01, group: 'QS', description: 'Reserva.', icon: 'Zap' },
    ],
    profiles: [{ id: 'balanced', name: 'Equilibrado', description: 'Geral.', icon: '⚖️', weightOverrides: {} }],
};

// ============================================
// PRESSURE WASHER
// ============================================

export const PRESSURE_WASHER_CATEGORY: CategoryDefinition = {
    id: 'pressure_washer', name: 'Lavadoras de Pressão', nameSingular: 'Lavadora',
    slug: 'lavadoras-pressao', description: 'Compare lavadoras de alta pressão.', icon: 'Droplet',
    criteria: [
        { id: 'c1', label: 'Pressão', weight: 0.22, group: 'QS', description: 'PSI/Bar.', icon: 'Gauge' },
        { id: 'c2', label: 'Vazão', weight: 0.16, group: 'QS', description: 'L/h.', icon: 'Droplet' },
        { id: 'c3', label: 'Potência', weight: 0.14, group: 'QS', description: 'Watts.', icon: 'Zap' },
        { id: 'c4', label: 'Custo-Benefício', weight: 0.16, group: 'VS', description: 'Preço.', icon: 'PiggyBank' },
        { id: 'c5', label: 'Acessórios', weight: 0.10, group: 'GS', description: 'Bicos.', icon: 'Package' },
        { id: 'c6', label: 'Durabilidade', weight: 0.10, group: 'QS', description: 'Motor.', icon: 'Shield' },
        { id: 'c7', label: 'Mangueira', weight: 0.06, group: 'GS', description: 'Metros.', icon: 'Link' },
        { id: 'c8', label: 'Portabilidade', weight: 0.04, group: 'GS', description: 'Peso/Rodas.', icon: 'Move' },
        { id: 'c9', label: 'Garantia', weight: 0.01, group: 'VS', description: 'Cobertura.', icon: 'Clock' },
        { id: 'c10', label: 'Ruído', weight: 0.01, group: 'GS', description: 'dB.', icon: 'VolumeX' },
    ],
    profiles: [{ id: 'balanced', name: 'Equilibrado', description: 'Geral.', icon: '⚖️', weightOverrides: {} }],
};

// ============================================
// DRILL
// ============================================

export const DRILL_CATEGORY: CategoryDefinition = {
    id: 'drill', name: 'Furadeiras', nameSingular: 'Furadeira',
    slug: 'furadeiras', description: 'Compare furadeiras e parafusadeiras.', icon: 'Wrench',
    criteria: [
        { id: 'c1', label: 'Potência', weight: 0.20, group: 'QS', description: 'Watts/Volts.', icon: 'Zap' },
        { id: 'c2', label: 'Torque', weight: 0.16, group: 'QS', description: 'Nm.', icon: 'RotateCw' },
        { id: 'c3', label: 'Bateria', weight: 0.14, group: 'QS', description: 'Ah/Autonomia.', icon: 'Battery' },
        { id: 'c4', label: 'Custo-Benefício', weight: 0.16, group: 'VS', description: 'Preço.', icon: 'PiggyBank' },
        { id: 'c5', label: 'Funções', weight: 0.10, group: 'GS', description: 'Impacto/Martelete.', icon: 'Settings' },
        { id: 'c6', label: 'Velocidades', weight: 0.08, group: 'GS', description: 'RPM.', icon: 'Gauge' },
        { id: 'c7', label: 'Ergonomia', weight: 0.06, group: 'GS', description: 'Peso/Grip.', icon: 'Hand' },
        { id: 'c8', label: 'Maleta', weight: 0.04, group: 'GS', description: 'Acessórios.', icon: 'Package' },
        { id: 'c9', label: 'Mandril', weight: 0.04, group: 'GS', description: 'mm.', icon: 'Circle' },
        { id: 'c10', label: 'Garantia', weight: 0.02, group: 'VS', description: 'Cobertura.', icon: 'Clock' },
    ],
    profiles: [{ id: 'balanced', name: 'Equilibrado', description: 'Geral.', icon: '⚖️', weightOverrides: {} }],
};

// ============================================
// CATEGORY REGISTRY
// ============================================

/**
 * All available categories indexed by ID
 */
export const CATEGORIES: Record<string, CategoryDefinition> = {
    tv: TV_CATEGORY,
    fridge: FRIDGE_CATEGORY,
    laptop: LAPTOP_CATEGORY,
    smartphone: SMARTPHONE_CATEGORY,
    air_conditioner: AC_CATEGORY,
    washer: WASHER_CATEGORY,
    monitor: MONITOR_CATEGORY,
    tablet: TABLET_CATEGORY,
    soundbar: SOUNDBAR_CATEGORY,
    tws: TWS_CATEGORY,
    headset_gamer: HEADSET_CATEGORY,
    bluetooth_speaker: BLUETOOTH_SPEAKER_CATEGORY,
    console: CONSOLE_CATEGORY,
    gamepad: GAMEPAD_CATEGORY,
    chair: CHAIR_CATEGORY,
    keyboard: KEYBOARD_CATEGORY,
    cpu: CPU_CATEGORY,
    gpu: GPU_CATEGORY,
    ram: RAM_CATEGORY,
    motherboard: MOTHERBOARD_CATEGORY,
    ssd: SSD_CATEGORY,
    psu: PSU_CATEGORY,
    case: CASE_CATEGORY,
    projector: PROJECTOR_CATEGORY,
    tvbox: TVBOX_CATEGORY,
    smartwatch: SMARTWATCH_CATEGORY,
    'robot-vacuum': ROBOT_VACUUM_CATEGORY,
    stick_vacuum: STICK_VACUUM_CATEGORY,
    fan: FAN_CATEGORY,
    security_camera: SECURITY_CAMERA_CATEGORY,
    smart_lock: SMART_LOCK_CATEGORY,
    router: ROUTER_CATEGORY,
    freezer: FREEZER_CATEGORY,
    minibar: MINIBAR_CATEGORY,
    wine_cooler: WINE_COOLER_CATEGORY,
    ups: UPS_CATEGORY,
    power_strip: POWER_STRIP_CATEGORY,
    washer_dryer: WASHER_DRYER_CATEGORY,
    dishwasher: DISHWASHER_CATEGORY,
    microwave: MICROWAVE_CATEGORY,
    stove: STOVE_CATEGORY,
    air_fryer: AIR_FRYER_CATEGORY,
    espresso: ESPRESSO_CATEGORY,
    mixer: MIXER_CATEGORY,
    water_purifier: WATER_PURIFIER_CATEGORY,
    range_hood: RANGE_HOOD_CATEGORY,
    builtin_oven: BUILTIN_OVEN_CATEGORY,
    printer: PRINTER_CATEGORY,
    camera: CAMERA_CATEGORY,
    tire: TIRE_CATEGORY,
    car_battery: CAR_BATTERY_CATEGORY,
    pressure_washer: PRESSURE_WASHER_CATEGORY,
    drill: DRILL_CATEGORY,
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
