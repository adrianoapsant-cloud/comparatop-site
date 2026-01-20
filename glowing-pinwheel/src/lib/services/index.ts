/**
 * @file index.ts
 * @description Re-export do ProductService para facilitar migração gradual
 * 
 * Este arquivo permite que páginas importem de '@/lib/services' 
 * em vez de diretamente do productService.
 */

export {
    getProductBySlug,
    getProductById,
    getProductsByCategory,
    getProductsForCompare,
    getAllProducts,
    searchProducts,
    getFilteredProducts,
    getCategoryDefinition,
    getProductStats,
    invalidateProductCache,
    type ProductFilters,
    type ProductStats,
} from './productService';

// Supabase-backed products service (async)
export {
    getProductsByCategoryFromDB,
    getScoredProductsByCategoryFromDB,
    getProductBySlugFromDB,
    getAllProductsFromDB,
    getProductCountByCategory,
    mapProductDBToScoredProduct,
    mapProductDBToTcoData,
} from './products';

// Alert Monitor Service
export {
    checkActiveAlerts,
    getAlertStats,
    mockCurrentPrices,
    type AlertCheckResult,
    type AlertMonitorReport,
} from './alert-monitor';
