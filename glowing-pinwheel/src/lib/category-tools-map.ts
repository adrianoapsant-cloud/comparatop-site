/**
 * Category Tools Mapping
 * 
 * Mapeia cada categoria de produto às suas ferramentas interativas padrão.
 * Isso elimina a necessidade de configurar manualmente cada ferramenta no JSON.
 * 
 * COMO USAR:
 * 1. No mock JSON, apenas defina "interactiveTools": true
 * 2. O sistema auto-seleciona as ferramentas corretas baseado na categoria
 */

import {
    ROBO_PASSA_MOVEL,
    ROBO_COBERTURA_LIMPEZA,
    TV_CABE_ESTANTE,
    GELADEIRA_PASSA_PORTA,
    MONITOR_CABE_MESA,
    NOTEBOOK_CABE_MOCHILA,
    LAVADORA_PASSA_PORTA,
    CALCULADORA_BTU,
    OLED_VS_LED,
    type GeometryEngineConfig,
    type RateEngineConfig,
    type ComparisonEngineConfig,
} from './tools-config';

export interface AutoTool {
    id: string;
    icon: 'ruler' | 'monitor' | 'zap' | 'maximize' | 'calculator';
    title: string;
    badge?: string;
    badgeColor?: 'orange' | 'blue' | 'green' | 'purple';
    description: string;
    toolType: 'geometry' | 'calculator' | 'comparison';
    configRef: string;
}

type ToolConfig = GeometryEngineConfig | RateEngineConfig | ComparisonEngineConfig;

// Helper to create tool entry from config
function createToolEntry(
    config: ToolConfig,
    icon: AutoTool['icon'],
    badge?: string,
    badgeColor?: AutoTool['badgeColor']
): AutoTool {
    return {
        id: config.id,
        icon,
        title: config.title,
        badge,
        badgeColor,
        description: config.description || '',
        toolType: config.engine === 'GeometryEngine' ? 'geometry' :
            config.engine === 'RateEngine' ? 'calculator' : 'comparison',
        configRef: config.id,
    };
}

/**
 * Mapeamento de categoria → ferramentas padrão
 * 
 * Adicione novas categorias aqui conforme necessário.
 */
export const CATEGORY_TOOLS_MAP: Record<string, AutoTool[]> = {
    'robot-vacuum': [
        createToolEntry(ROBO_PASSA_MOVEL, 'ruler', 'Teste Rápido', 'orange'),
        createToolEntry(ROBO_COBERTURA_LIMPEZA, 'maximize', 'Simulador', 'blue'),
    ],

    'tv': [
        createToolEntry(TV_CABE_ESTANTE, 'ruler', 'Teste Rápido', 'orange'),
        createToolEntry(OLED_VS_LED, 'monitor', 'Comparador', 'purple'),
    ],

    'fridge': [
        createToolEntry(GELADEIRA_PASSA_PORTA, 'ruler', 'Teste Rápido', 'orange'),
    ],

    'monitor': [
        createToolEntry(MONITOR_CABE_MESA, 'ruler', 'Teste Rápido', 'orange'),
    ],

    'notebook': [
        createToolEntry(NOTEBOOK_CABE_MOCHILA, 'ruler', 'Teste Rápido', 'orange'),
    ],

    'lavadora': [
        createToolEntry(LAVADORA_PASSA_PORTA, 'ruler', 'Teste Rápido', 'orange'),
    ],

    'air-conditioner': [
        createToolEntry(CALCULADORA_BTU, 'calculator', 'Calculadora', 'green'),
    ],
};

/**
 * Retorna as ferramentas interativas para uma categoria de produto.
 * 
 * @param category - Slug da categoria (ex: 'robot-vacuum', 'tv')
 * @returns Array de ferramentas ou array vazio se categoria não mapeada
 */
export function getToolsForCategory(category: string): AutoTool[] {
    return CATEGORY_TOOLS_MAP[category] || [];
}

/**
 * Verifica se uma categoria tem ferramentas interativas disponíveis.
 */
export function categoryHasTools(category: string): boolean {
    return category in CATEGORY_TOOLS_MAP && CATEGORY_TOOLS_MAP[category].length > 0;
}
