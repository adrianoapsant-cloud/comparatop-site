/**
 * ComparaTop 2.0 - Catalog Core Module
 * Handles loading, caching, and querying product catalogs
 */

const Catalog = (function () {
    'use strict';

    const cache = {};
    const BASE_PATH = '/data/catalogs/';

    /**
     * Load a category catalog
     * @param {string} categoryId - e.g., 'geladeira'
     * @returns {Promise<Object>} The catalog object
     */
    async function load(categoryId) {
        if (cache[categoryId]) {
            return cache[categoryId];
        }

        try {
            const response = await fetch(`${BASE_PATH}${categoryId}.json`);
            if (!response.ok) throw new Error(`Catalog not found: ${categoryId}`);

            const catalog = await response.json();

            // Enrich products with computed fields
            Object.values(catalog.products).forEach(product => {
                enrichProduct(product, catalog);
            });

            cache[categoryId] = catalog;
            return catalog;
        } catch (error) {
            console.error(`[Catalog] Failed to load ${categoryId}:`, error);
            throw error;
        }
    }

    /**
     * Add computed fields to a product
     */
    function enrichProduct(product, catalog) {
        // Compute overall score if not present
        if (!product.editorialScores) {
            product.editorialScores = {};
        }
        if (product.editorialScores.overall == null) {
            product.editorialScores.overall = computeOverall(product.editorialScores, catalog.scoringTopics);
        }

        // Compute best price
        product.bestPrice = getBestPrice(product);
        product.bestOffer = getBestOffer(product);

        // Compute average third-party rating
        product.avgRating = computeAvgRating(product);
    }

    /**
     * Compute overall editorial score
     */
    function computeOverall(scores, topics) {
        const totalWeight = validTopics.reduce((sum, topic) => sum + (topic.weight || 1), 0);
        return Math.round((weightedSum / totalWeight) * 10) / 10;
    }

    /**
     * Get best (lowest) price from offers
     */
    function getBestPrice(product) {
        if (!product.offers || !product.offers.length) return null;

        const prices = product.offers
            .filter(o => o.price != null && o.inStock !== false)
            .map(o => o.price);

        return prices.length ? Math.min(...prices) : null;
    }

    /**
     * Get best offer object
     */
    function getBestOffer(product) {
        if (!product.offers || !product.offers.length) return null;

        const validOffers = product.offers
            .filter(o => o.price != null && o.url && o.inStock !== false)
            .sort((a, b) => a.price - b.price);

        return validOffers.length ? validOffers[0] : null;
    }

    /**
     * Compute average third-party rating
     */
    function computeAvgRating(product) {
        if (!product.thirdPartyRatings || !product.thirdPartyRatings.length) return null;

        const sum = product.thirdPartyRatings.reduce((acc, r) => acc + r.ratingValue, 0);
        return Math.round((sum / product.thirdPartyRatings.length) * 10) / 10;
    }

    /**
     * Get all products as array
     */
    function getProducts(catalog) {
        return Object.values(catalog.products).filter(p => p.status === 'active');
    }

    /**
     * Get a single product by ID
     */
    function getProduct(catalog, productId) {
        return catalog.products[productId] || null;
    }

    /**
     * Get multiple products by IDs
     */
    function getProductsByIds(catalog, productIds) {
        return productIds
            .map(id => catalog.products[id])
            .filter(Boolean);
    }

    /**
     * Search products by text query
     */
    function searchProducts(catalog, query) {
        const q = query.toLowerCase().trim();
        if (!q) return getProducts(catalog);

        return getProducts(catalog).filter(product => {
            const searchable = [
                product.name,
                product.brand,
                product.model,
                ...(product.tags || [])
            ].join(' ').toLowerCase();

            return searchable.includes(q);
        });
    }

    /**
     * Filter products by criteria
     */
    function filterProducts(catalog, filters) {
        let products = getProducts(catalog);

        if (filters.brand) {
            products = products.filter(p => p.brand.toLowerCase() === filters.brand.toLowerCase());
        }

        if (filters.minPrice != null) {
            products = products.filter(p => p.bestPrice && p.bestPrice >= filters.minPrice);
        }

        if (filters.maxPrice != null) {
            products = products.filter(p => p.bestPrice && p.bestPrice <= filters.maxPrice);
        }

        if (filters.minCapacity != null) {
            products = products.filter(p => p.specs.capacidade_total >= filters.minCapacity);
        }

        if (filters.maxWidth != null) {
            products = products.filter(p => p.specs.largura_cm <= filters.maxWidth);
        }

        if (filters.minScore != null) {
            products = products.filter(p => p.editorialScores.overall >= filters.minScore);
        }

        if (filters.features && filters.features.length) {
            products = products.filter(p => {
                return filters.features.every(featureId => {
                    const feature = (p.features || []).find(f => f.id === featureId);
                    return feature && feature.value === true;
                });
            });
        }

        if (filters.tags && filters.tags.length) {
            products = products.filter(p => {
                return filters.tags.some(tag => (p.tags || []).includes(tag));
            });
        }

        return products;
    }

    /**
     * Get unique brands from catalog
     */
    function getBrands(catalog) {
        const brands = new Set(getProducts(catalog).map(p => p.brand));
        return Array.from(brands).sort();
    }

    /**
     * Get price range from catalog
     */
    function getPriceRange(catalog) {
        const prices = getProducts(catalog)
            .map(p => p.bestPrice)
            .filter(p => p != null);

        if (!prices.length) return { min: 0, max: 0 };

        return {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };
    }

    /**
     * Get all unique features from catalog
     */
    function getAllFeatures(catalog) {
        const featuresMap = {};

        getProducts(catalog).forEach(product => {
            (product.features || []).forEach(feature => {
                if (!featuresMap[feature.id]) {
                    featuresMap[feature.id] = {
                        id: feature.id,
                        label: feature.label,
                        count: 0
                    };
                }
                if (feature.value === true) {
                    featuresMap[feature.id].count++;
                }
            });
        });

        return Object.values(featuresMap).sort((a, b) => b.count - a.count);
    }

    // Public API
    return {
        load,
        getProducts,
        getProduct,
        getProductsByIds,
        searchProducts,
        filterProducts,
        getBrands,
        getPriceRange,
        getAllFeatures,
        computeOverall
    };
})();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Catalog;
}
