/**
 * @file unknown-unknowns-data.ts
 * @description Dados estáticos de Unknown Unknowns por categoria
 * 
 * São problemas técnicos ocultos que o consumidor geralmente só
 * descobre depois da compra. Levantados por engenharia reversa.
 * 
 * @version 1.0.0
 */

import type { CategoryUnknownUnknowns } from '@/types/engineering-schema';

// ============================================
// ROBÔS ASPIRADORES
// ============================================

export const ROBOT_VACUUM_UNKNOWN_UNKNOWNS: CategoryUnknownUnknowns = {
    categoryId: 'robot-vacuum',
    categoryName: 'Robôs Aspiradores',
    lastUpdated: '2026-01-18',
    items: [
        {
            id: 'region-lock',
            severity: 'CRITICAL',
            topic: 'Bloqueio Regional (Region Lock)',
            userQuestion: 'Comprei um Xiaomi versão chinesa, funciona no Brasil?',
            technicalFact: 'Fabricantes validam a região do produto na primeira conexão. Versões CN (China) são configuradas para servidores chineses, que podem rejeitar conexões de IPs brasileiros. O resultado: o robô não consegue ativar ou configurar pelo app.',
            riskAnalysis: 'Produto pode não ativar ou configurar devido a restrições de região. Há relatos de dificuldade em revender unidades sem funcionalidade plena.',
            mitigationStrategy: 'RECOMENDAÇÃO: Comprar versão Global (GL) de vendedor que especifique "versão global" na descrição ou embalagem. Verificar SKU antes da compra: GL = Global, CN = China.',
            fixabilityScore: 3,
            systemFlag: 'IF sku_region == "CN" THEN alert_hard_lock',
            affectedBrands: ['Xiaomi', 'Roborock', 'Dreame', 'Ecovacs'],
        },
        {
            id: 'dark-floor-bug',
            severity: 'WARNING',
            topic: 'Limitação em Pisos Escuros',
            userQuestion: 'O robô trava no tapete preto e não passa.',
            technicalFact: 'Sensores anti-queda usam infravermelho para detectar desníveis. Superfícies pretas absorvem a luz, não refletindo o sinal de volta. O robô interpreta isso como "abismo" (degrau ou escada) e evita a área.',
            riskAnalysis: 'Limitação de movimentação em casas com piso escuro ou tapetes pretos. O robô pode recusar limpar áreas específicas, reduzindo a área útil de limpeza.',
            mitigationStrategy: 'SOLUÇÃO OFICIAL: Configurar zonas de exclusão no app para áreas problemáticas, ou ajustar os limites do mapeamento.',
            safetyWarning: '⚠️ CUIDADO: Fóruns sugerem cobrir sensores anti-queda com fita, mas isso DESATIVA a proteção contra quedas em escadas. Não recomendamos esta prática.',
            fixabilityScore: 8,
            systemFlag: 'IF floor_color == "dark" AND sensor_type == "IR" THEN warn_cliff',
            affectedBrands: ['WAP', 'Electrolux', 'Mondial', 'Multilaser'],
            sources: ['https://reddit.com/r/RobotVacuums/comments/dark_floor'],
        },
        {
            id: 'lidar-reflection',
            severity: 'WARNING',
            topic: 'LiDAR vs Espelhos e Vidros',
            userQuestion: 'O robô bate no vidro da mesa e não mapeia o espelho.',
            technicalFact: 'LiDAR emite laser que reflete em superfícies opacas. Vidros e espelhos transmitem ou refletem o laser em ângulos inesperados, criando "buracos" no mapa ou obstáculos fantasma.',
            riskAnalysis: 'Colisões frequentes com portas de vidro, mesas de vidro, espelhos de corpo inteiro. Pode riscar móveis ou danificar o próprio robô.',
            mitigationStrategy: 'Usar zonas de exclusão no app para áreas com vidro. Para portas de vidro transparente: barreiras virtuais ou fita magnética própria para robôs.',
            fixabilityScore: 7,
            systemFlag: 'IF navigation == "LiDAR" THEN warn_glass_surfaces',
            affectedBrands: ['Xiaomi', 'Roborock', 'Dreame', 'Ecovacs', 'iRobot'],
        },
        {
            id: 'mop-damage',
            severity: 'INFO',
            topic: 'Mop em Madeira Não Selada',
            userQuestion: 'Posso usar a função mop no meu piso de madeira?',
            technicalFact: 'Robôs com função mop liberam água continuamente. Pisos de madeira não selados (ou com selante desgastado) absorvem umidade, causando empenamento e manchas.',
            riskAnalysis: 'Dano estético e estrutural ao piso. Tábuas podem inchar, desgrudar ou criar gaps. Reparo custa R$150-300/m².',
            mitigationStrategy: 'Testar selante com gota de água antes de usar mop. Se absorver em <5min, piso não está selado. Usar apenas função aspiração ou aplicar impermeabilizante.',
            fixabilityScore: 9,
            affectedBrands: [],
        },
        {
            id: 'wifi-2ghz-only',
            severity: 'INFO',
            topic: 'Só Conecta em Wi-Fi 2.4GHz',
            userQuestion: 'Por que o robô não encontra minha rede Wi-Fi?',
            technicalFact: 'Maioria dos robôs usa chip Wi-Fi de baixo custo que só suporta 2.4GHz. Roteadores modernos com "band steering" podem forçar dispositivos para 5GHz.',
            riskAnalysis: 'Falha na configuração inicial. Usuário acha que robô está com defeito.',
            mitigationStrategy: 'Criar rede separada 2.4GHz no roteador ou desativar "band steering" temporariamente. Verificar se SSID está visível (não hidden).',
            fixabilityScore: 10,
            systemFlag: 'IF wifi_issue THEN check_24ghz_only',
        },
    ],
};

// ============================================
// SMART TVs (Placeholder for future)
// ============================================

export const TV_UNKNOWN_UNKNOWNS: CategoryUnknownUnknowns = {
    categoryId: 'tv',
    categoryName: 'Smart TVs',
    lastUpdated: '2026-01-18',
    items: [
        {
            id: 'panel-lottery',
            severity: 'WARNING',
            topic: 'Loteria de Painéis (Panel Lottery)',
            userQuestion: 'Por que minha TV tem mais banding que a do review?',
            technicalFact: 'Fabricantes usam painéis de diferentes fornecedores (AUO, BOE, Innolux) no mesmo modelo. Qualidade varia significativamente entre lotes.',
            riskAnalysis: 'Uniformidade de preto (banding), bleeding, DSE podem variar drasticamente. Você pode receber painel inferior ao visto em reviews.',
            mitigationStrategy: 'Testar TV na loja ou em casa com tela cinza 5%. Trocar dentro do prazo de arrependimento (7 dias) se insatisfeito.',
            fixabilityScore: 4,
            systemFlag: 'IF model_has_multiple_panels THEN warn_lottery',
            affectedBrands: ['Samsung', 'LG', 'TCL', 'Hisense'],
        },
    ],
};

// ============================================
// REGISTRY BY CATEGORY
// ============================================

const UNKNOWN_UNKNOWNS_REGISTRY: Record<string, CategoryUnknownUnknowns> = {
    'robot-vacuum': ROBOT_VACUUM_UNKNOWN_UNKNOWNS,
    'robo-aspirador': ROBOT_VACUUM_UNKNOWN_UNKNOWNS,
    'tv': TV_UNKNOWN_UNKNOWNS,
    'smart-tv': TV_UNKNOWN_UNKNOWNS,
};

/**
 * Busca dados de Unknown Unknowns por categoryId
 */
export function getUnknownUnknowns(categoryId: string): CategoryUnknownUnknowns | null {
    const normalizedId = categoryId.toLowerCase().trim();
    return UNKNOWN_UNKNOWNS_REGISTRY[normalizedId] ?? null;
}

/**
 * Verifica se categoria tem Unknown Unknowns cadastrados
 */
export function hasUnknownUnknowns(categoryId: string): boolean {
    return getUnknownUnknowns(categoryId) !== null;
}
