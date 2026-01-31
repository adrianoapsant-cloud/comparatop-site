/**
 * Context Profiles by Category
 * 
 * Defines user context profiles per product category.
 * Used by SimplifiedContextScoreSection to show relevant use cases.
 */

export interface ContextProfile {
    id: string;
    name: string;
    icon: string;
    /** Score modifier when this context is selected (-1.0 to +1.0) */
    modifier: number;
}

export interface ExclusionRule {
    contexts: [string, string];
    message: string;
}

export interface CategoryContextConfig {
    profiles: ContextProfile[];
    exclusionRules?: ExclusionRule[];
}

// ===========================================
// CONTEXT PROFILES PER CATEGORY
// ===========================================

export const CONTEXT_PROFILES: Record<string, CategoryContextConfig> = {
    // Robot Vacuums
    'robot-vacuum': {
        profiles: [
            { id: 'daily_maintenance', name: 'Manutenção Diária (Apartamento)', icon: '🏠', modifier: -0.2 },
            { id: 'large_home', name: 'Casas Grandes (>100m²)', icon: '🏡', modifier: +0.3 },
            { id: 'pet_owners', name: 'Donos de Pets', icon: '🐕', modifier: +0.1 },
        ],
        exclusionRules: [
            {
                contexts: ['daily_maintenance', 'large_home'],
                message: 'Você marcou "Casas Grandes (>100m²)" e "Manutenção Diária (Apartamento)" ao mesmo tempo. Esses usos são opostos — escolha apenas um.'
            }
        ]
    },

    // TVs
    'tv': {
        profiles: [
            { id: 'movies_dark', name: 'Filmes em Sala Escura', icon: '🎬', modifier: +0.2 },
            { id: 'bright_room', name: 'Sala Iluminada', icon: '☀️', modifier: -0.1 },
            { id: 'gaming', name: 'Gaming / eSports', icon: '🎮', modifier: +0.3 },
            { id: 'sports', name: 'Esportes ao Vivo', icon: '⚽', modifier: +0.1 },
        ],
        exclusionRules: [
            {
                contexts: ['movies_dark', 'bright_room'],
                message: 'Sala escura e sala iluminada são contextos opostos — escolha apenas um.'
            }
        ]
    },

    // Air Conditioners
    'air-conditioner': {
        profiles: [
            { id: 'bedroom_night', name: 'Quarto (Uso Noturno)', icon: '🛏️', modifier: +0.2 },
            { id: 'living_room', name: 'Sala de Estar', icon: '🛋️', modifier: 0 },
            { id: 'home_office', name: 'Home Office', icon: '💻', modifier: +0.1 },
            { id: 'energy_saver', name: 'Economia de Energia', icon: '⚡', modifier: -0.2 },
        ]
    },

    // Refrigerators
    'fridge': {
        profiles: [
            { id: 'small_family', name: 'Família Pequena (2-3 pessoas)', icon: '👨‍👩‍👦', modifier: 0 },
            { id: 'large_family', name: 'Família Grande (5+ pessoas)', icon: '👨‍👩‍👧‍👦', modifier: +0.2 },
            { id: 'meal_prep', name: 'Meal Prep / Batch Cooking', icon: '🥗', modifier: +0.1 },
            { id: 'compact_space', name: 'Espaço Compacto', icon: '📐', modifier: -0.1 },
        ]
    },

    // Smartphones
    'smartphone': {
        profiles: [
            { id: 'photography', name: 'Fotografia / Vídeo', icon: '📸', modifier: +0.3 },
            { id: 'mobile_gaming', name: 'Jogos Mobile', icon: '🎮', modifier: +0.2 },
            { id: 'work_productivity', name: 'Trabalho / Produtividade', icon: '💼', modifier: +0.1 },
            { id: 'basic_use', name: 'Uso Básico (Redes Sociais)', icon: '📱', modifier: -0.2 },
        ]
    },

    // Smartwatches
    'smartwatch': {
        profiles: [
            { id: 'fitness', name: 'Fitness / Academia', icon: '🏋️', modifier: +0.3 },
            { id: 'outdoor_sports', name: 'Esportes Outdoor', icon: '🏃', modifier: +0.2 },
            { id: 'business', name: 'Uso Corporativo', icon: '👔', modifier: 0 },
            { id: 'health_monitoring', name: 'Monitoramento de Saúde', icon: '❤️', modifier: +0.2 },
        ]
    },

    // Headphones
    'headphone': {
        profiles: [
            { id: 'commute', name: 'Transporte / Commute', icon: '🚇', modifier: +0.2 },
            { id: 'home_music', name: 'Música em Casa', icon: '🎵', modifier: +0.1 },
            { id: 'gaming_headset', name: 'Gaming Competitivo', icon: '🎮', modifier: +0.3 },
            { id: 'calls_wfh', name: 'Reuniões / WFH', icon: '💻', modifier: +0.1 },
        ]
    },
};

/**
 * Get context profiles for a category
 * Returns default profiles if category not found
 */
export function getContextProfiles(categoryId: string): CategoryContextConfig {
    return CONTEXT_PROFILES[categoryId] || {
        profiles: [
            { id: 'general_use', name: 'Uso Geral', icon: '📦', modifier: 0 },
            { id: 'heavy_use', name: 'Uso Intensivo', icon: '⚡', modifier: +0.2 },
            { id: 'occasional', name: 'Uso Ocasional', icon: '🌙', modifier: -0.1 },
        ]
    };
}
