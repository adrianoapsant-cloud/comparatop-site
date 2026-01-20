/**
 * @file unknown-unknowns-filter.ts
 * @description Filtra Unknown Unknowns baseado nas specs específicas do produto
 * 
 * Esta função analisa as technicalSpecs e attributes do produto para
 * determinar AUTOMATICAMENTE quais problemas se aplicam a ele.
 * 
 * Elimina a necessidade de pesquisar cada modelo manualmente!
 * 
 * @version 1.0.0
 */

import type { Product } from '@/types/category';
import type { UnknownUnknownItem, CategoryUnknownUnknowns } from '@/types/engineering-schema';
import { getUnknownUnknowns } from './unknown-unknowns-data';

/**
 * Resultado da filtragem com contexto específico do produto
 */
export interface ProductUnknownUnknown extends UnknownUnknownItem {
    /** Se aplica ao produto específico */
    appliesTo: boolean;
    /** Razão personalizada de porque se aplica (ou não) */
    applicationReason?: string;
    /** Risco ajustado para este produto específico */
    adjustedSeverity?: 'CRITICAL' | 'WARNING' | 'INFO';
}

/**
 * Verifica se um Unknown Unknown se aplica ao produto baseado em suas specs
 */
function checkApplicability(
    item: UnknownUnknownItem,
    product: Product
): { applies: boolean; reason?: string; adjustedSeverity?: 'CRITICAL' | 'WARNING' | 'INFO' } {
    const specs = product.technicalSpecs || {};
    const attrs = product.attributes || {};
    const brand = product.brand?.toLowerCase() || '';

    switch (item.id) {
        // ============================================
        // ROBÔS ASPIRADORES
        // ============================================

        case 'region-lock': {
            // Só se aplica a marcas chinesas importadas
            const chineseBrands = ['xiaomi', 'roborock', 'dreame', 'ecovacs', 'mijia'];
            const isChineseBrand = chineseBrands.some(b => brand.includes(b));
            const isBrazilianBrand = ['wap', 'electrolux', 'mondial', 'multilaser', 'philco'].some(b => brand.includes(b));

            if (isBrazilianBrand) {
                return { applies: false, reason: `${product.brand} é marca nacional, sem risco de Region Lock.` };
            }
            if (isChineseBrand) {
                return {
                    applies: true,
                    reason: `${product.brand} possui versões regionais. Procure "Global" ou "GL" no anúncio/caixa. Evite versões "China" ou "CN".`,
                    adjustedSeverity: 'CRITICAL'
                };
            }
            return { applies: false, reason: 'Marca não chinesa, sem risco de Region Lock.' };
        }

        case 'dark-floor-bug': {
            // Se aplica a robôs com sensores IR anti-queda (maioria sem LiDAR de chão)
            const hasLidar = specs.lidar === true || String(specs.navigation).toLowerCase().includes('lidar');
            const hasCamera = specs.camera === true || String(specs.navigation).toLowerCase().includes('vslam');
            const hasToFFloorSensor = String(specs.obstacleDetection || '').toLowerCase().includes('tof');

            // LiDAR no topo não protege contra bug do piso escuro - precisa de ToF no chão
            if (hasToFFloorSensor) {
                return { applies: false, reason: 'Possui sensor ToF de chão - não afetado pelo bug do piso escuro.' };
            }

            // Robôs básicos com IR anti-queda são vulneráveis
            if (!hasLidar && !hasCamera) {
                return {
                    applies: true,
                    reason: `${product.shortName || product.name} usa sensores infravermelhos anti-queda. Pisos/tapetes pretos podem ser interpretados como "abismo".`,
                    adjustedSeverity: 'WARNING'
                };
            }

            // Mesmo robôs LiDAR/VSLAM podem ter IR anti-queda
            return {
                applies: true,
                reason: 'Sensores anti-queda infravermelhos podem ter dificuldade com pisos escuros.',
                adjustedSeverity: 'INFO'  // Menor severidade para robôs modernos
            };
        }

        case 'lidar-reflection': {
            // Só se aplica a robôs com LiDAR
            const hasLidar = specs.lidar === true || String(specs.navigation).toLowerCase().includes('lidar');

            if (!hasLidar) {
                return { applies: false, reason: `${product.shortName || product.name} não usa LiDAR - não afetado por reflexos em espelhos.` };
            }
            return {
                applies: true,
                reason: 'Robôs LiDAR podem ter dificuldade com espelhos e superfícies de vidro.',
                adjustedSeverity: 'WARNING'
            };
        }

        case 'mop-damage': {
            // Se aplica a robôs com função mop
            const hasMop = attrs.hasMop === true || specs.mopType !== undefined;

            if (!hasMop) {
                return { applies: false, reason: 'Este robô não possui função mop.' };
            }

            // Mop passivo tem mais risco de deixar água parada
            const isPassiveMop = String(specs.mopType || attrs.mopType || '').toLowerCase().includes('estático') ||
                String(specs.mopType || attrs.mopType || '').toLowerCase().includes('passiv');

            return {
                applies: true,
                reason: isPassiveMop
                    ? 'Mop estático (não vibratório) libera água constantemente. Cuidado com pisos de madeira não selados.'
                    : 'Função mop pode danificar pisos de madeira não selados.',
                adjustedSeverity: isPassiveMop ? 'WARNING' : 'INFO'
            };
        }

        case 'wifi-2ghz-only': {
            // Verifica banda Wi-Fi
            const wifiBand = String(attrs.wifiBand || specs.wifiBand || specs.wifi || '').toLowerCase();
            const is24GhzOnly = wifiBand.includes('2.4') && !wifiBand.includes('5');
            const hasWifi = attrs.hasAppControl === true || specs.wifi === true || specs.appControl === true;

            if (!hasWifi) {
                return { applies: false, reason: 'Este robô não possui conectividade Wi-Fi.' };
            }

            if (is24GhzOnly) {
                return {
                    applies: true,
                    reason: `${product.shortName || product.name} só conecta em Wi-Fi 2.4GHz. Se seu Wi-Fi junta 2.4 e 5GHz no mesmo nome, crie uma rede 2.4GHz separada.`,
                    adjustedSeverity: 'INFO'
                };
            }

            return { applies: false, reason: 'Suporta Wi-Fi 5GHz ou dual-band.' };
        }

        // ============================================
        // SMART TVs
        // ============================================

        case 'panel-lottery': {
            // Se aplica a TVs de marcas conhecidas por usar múltiplos fornecedores
            const affectedBrands = ['samsung', 'lg', 'tcl', 'hisense', 'aoc'];
            const isAffected = affectedBrands.some(b => brand.includes(b));

            if (isAffected) {
                return {
                    applies: true,
                    reason: `${product.brand} pode usar painéis de diferentes fornecedores. Qualidade pode variar entre unidades.`,
                    adjustedSeverity: 'WARNING'
                };
            }
            return { applies: false, reason: 'Marca com menor variação de painéis.' };
        }

        default:
            // Para itens sem regra específica, verifica affectedBrands
            if (item.affectedBrands && item.affectedBrands.length > 0) {
                const isAffectedBrand = item.affectedBrands.some(
                    b => brand.includes(b.toLowerCase())
                );
                return {
                    applies: isAffectedBrand,
                    reason: isAffectedBrand
                        ? `${product.brand} está na lista de marcas afetadas.`
                        : `${product.brand} não está na lista de marcas afetadas.`
                };
            }

            // Se não tem affectedBrands, assume que pode se aplicar
            return { applies: true };
    }
}

/**
 * Filtra Unknown Unknowns para um produto específico
 * 
 * @param product - Produto com technicalSpecs e attributes
 * @returns Lista filtrada de issues que SE APLICAM ao produto
 */
export function getProductUnknownUnknowns(product: Product): ProductUnknownUnknown[] {
    const categoryData = getUnknownUnknowns(product.categoryId);
    if (!categoryData) return [];

    return categoryData.items
        .map(item => {
            const check = checkApplicability(item, product);
            return {
                ...item,
                appliesTo: check.applies,
                applicationReason: check.reason,
                adjustedSeverity: check.adjustedSeverity,
            };
        })
        .filter(item => item.appliesTo)  // Só retorna os que se aplicam
        .sort((a, b) => {
            // Ordena por severidade (ajustada se disponível)
            const severityOrder = { 'CRITICAL': 0, 'WARNING': 1, 'INFO': 2 };
            const sevA = a.adjustedSeverity || a.severity;
            const sevB = b.adjustedSeverity || b.severity;
            return severityOrder[sevA] - severityOrder[sevB];
        });
}

/**
 * Retorna dados de Unknown Unknowns com contexto do produto
 * Útil para componentes que precisam exibir todos (aplicáveis ou não)
 */
export function getProductUnknownUnknownsWithContext(product: Product): {
    category: CategoryUnknownUnknowns | null;
    items: ProductUnknownUnknown[];
} {
    const categoryData = getUnknownUnknowns(product.categoryId);
    if (!categoryData) return { category: null, items: [] };

    const items = categoryData.items.map(item => {
        const check = checkApplicability(item, product);
        return {
            ...item,
            appliesTo: check.applies,
            applicationReason: check.reason,
            adjustedSeverity: check.adjustedSeverity,
        };
    });

    return { category: categoryData, items };
}

/**
 * Verifica se um produto tem Unknown Unknowns aplicáveis
 */
export function hasApplicableUnknownUnknowns(product: Product): boolean {
    return getProductUnknownUnknowns(product).length > 0;
}
