/**
 * @file productCardVM.ts
 * @description Selector para ProductCard - sincronismo total
 * 
 * Garante que todos os cards (Home/PLP/VS) usem o mesmo subset de dados.
 */

import type { ProductVM } from '@/lib/viewmodels/productVM';
import { productUrl, categoryUrl, isLinkable } from '@/lib/routes';

// ============================================
// TYPES
// ============================================

/**
 * ViewModel mínimo para cards de produto
 * Usado em Home, PLP e VS para garantir consistência
 */
export interface ProductCardVM {
    /** ID/slug do produto */
    id: string;
    /** Nome completo */
    name: string;
    /** Nome curto para display */
    shortName: string;
    /** Marca */
    brand: string;
    /** URL da imagem */
    imageUrl: string;

    /** Preço formatado */
    price: string;
    /** Preço numérico (para ordenação) */
    priceValue: number;

    /** Score formatado */
    score: string;
    /** Score numérico (para ordenação) */
    scoreValue: number;
    /** Label do score */
    scoreLabel: string;
    /** Cor do score */
    scoreColor: string;

    /** Badges */
    badges: string[];

    /** URLs canônicas */
    urls: {
        pdp: string;
        category: string;
    };

    /** Pode renderizar link? */
    isLinkable: boolean;

    /** Category ID para agrupamento */
    categoryId: string;
}

// ============================================
// SELECTOR
// ============================================

/**
 * Extrai ProductCardVM do ProductVM completo
 * 
 * @param vm ProductVM completo
 * @returns ProductCardVM para uso em cards
 */
export function selectProductCardVM(vm: ProductVM): ProductCardVM {
    return {
        id: vm.id,
        name: vm.name,
        shortName: vm.shortName,
        brand: vm.brand,
        imageUrl: vm.imageUrl || '/images/placeholder.jpg',

        price: vm.price.current,
        priceValue: vm.price.value,

        score: vm.score.display,
        scoreValue: vm.score.value,
        scoreLabel: vm.score.label,
        scoreColor: vm.score.colorClass,

        badges: vm.badges,

        urls: {
            pdp: productUrl(vm),
            category: categoryUrl(vm.categorySlug),
        },

        isLinkable: isLinkable(vm),
        categoryId: vm.raw.categoryId,
    };
}

/**
 * Transforma array de ProductVM em ProductCardVM
 */
export function selectProductCards(vms: ProductVM[]): ProductCardVM[] {
    return vms.map(selectProductCardVM);
}

/**
 * Filtra e transforma produtos publicáveis
 */
export function selectPublishableCards(vms: ProductVM[]): ProductCardVM[] {
    return vms
        .filter(vm => vm.health !== 'FAIL')
        .map(selectProductCardVM);
}
