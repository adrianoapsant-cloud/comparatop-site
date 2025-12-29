/**
 * ComparaTop 2.0 - Ranking Module
 * Generates rankings and sorted product lists
 */

const Ranking = (function () {
    'use strict';

    /**
     * Generate a ranking of products
     * @param {Object} catalog - The catalog object
     * @param {Object} options - Ranking options
     * @returns {Array} Sorted array of products with ranking metadata
     */
    function generate(catalog, options = {}) {
        const {
            sortBy = 'overall',        // 'overall', topic id, 'price', 'capacity', 'reviews'
            order = 'desc',            // 'asc' or 'desc'
            limit = 10,                // Max products to return
            filters = {},              // Optional filters to apply first
            includeReasons = false     // Include why this ranking position
        } = options;

        // Get filtered products
        let products = typeof Catalog !== 'undefined'
            ? Catalog.filterProducts(catalog, filters)
            : Object.values(catalog.products).filter(p => p.status === 'active');

        // Sort by criteria
        products = products.map(product => ({
            product,
            score: getScore(product, sortBy, catalog),
            sortField: sortBy
        }));

        products.sort((a, b) => {
            if (a.score === null && b.score === null) return 0;
            if (a.score === null) return 1;
            if (b.score === null) return -1;
            return order === 'desc' ? b.score - a.score : a.score - b.score;
        });

        // Apply limit
        products = products.slice(0, limit);

        // Add ranking position and optional reasons
        return products.map((item, index) => {
            const result = {
                rank: index + 1,
                product: item.product,
                score: item.score,
                sortField: item.sortField
            };

            if (includeReasons) {
                result.reasons = generateReasons(item.product, sortBy, index, catalog);
            }

            return result;
        });
    }

    /**
     * Get sortable score for a product
     */
    function getScore(product, sortBy, catalog) {
        switch (sortBy) {
            case 'overall':
                return product.editorialScores?.overall ?? null;

            case 'price':
                return product.bestPrice ?? null;

            case 'capacity':
                return product.specs?.capacidade_total ?? null;

            case 'freezer':
                return product.specs?.capacidade_freezer ?? null;

            case 'consumption':
                // Lower is better, but we invert for sorting
                const consumption = product.specs?.consumo_kwh;
                return consumption ? (100 - consumption) : null;

            case 'reviews':
                return product.avgRating ?? null;

            case 'width':
                // Smaller is better for fitting, invert
                const width = product.specs?.largura_cm;
                return width ? (100 - width) : null;

            default:
                // Assume it's a topic ID
                return product.editorialScores?.[sortBy] ?? null;
        }
    }

    /**
     * Generate human-readable reasons for ranking position
     */
    function generateReasons(product, sortBy, position, catalog) {
        const reasons = [];

        if (position === 0) {
            switch (sortBy) {
                case 'overall':
                    reasons.push(`Melhor nota geral: ${product.editorialScores.overall}/10`);
                    break;
                case 'price':
                    reasons.push(`Menor preço: ${formatBRL(product.bestPrice)}`);
                    break;
                case 'capacity':
                    reasons.push(`Maior capacidade: ${product.specs.capacidade_total}L`);
                    break;
                case 'custo_beneficio':
                    reasons.push(`Melhor custo-benefício: ${product.editorialScores.custo_beneficio}/10`);
                    break;
                case 'consumo':
                    reasons.push(`Menor consumo: ${product.specs.consumo_kwh} kWh/mês`);
                    break;
            }
        }

        // Add standout features
        const standouts = getStandoutFeatures(product, catalog);
        standouts.slice(0, 2).forEach(s => reasons.push(s));

        return reasons;
    }

    /**
     * Find standout features of a product
     */
    function getStandoutFeatures(product, catalog) {
        const standouts = [];
        const scores = product.editorialScores;

        // Find highest scores
        const topScores = Object.entries(scores)
            .filter(([key, val]) => key !== 'overall' && key !== 'notes' && key !== 'updatedAt' && typeof val === 'number')
            .sort((a, b) => b[1] - a[1])
            .slice(0, 2);

        topScores.forEach(([topic, score]) => {
            if (score >= 8.5) {
                const label = catalog.scoringTopics.find(t => t.id === topic)?.label || topic;
                standouts.push(`Destaque em ${label.toLowerCase()}: ${score}/10`);
            }
        });

        return standouts;
    }

    /**
     * Generate multiple ranking lists for a category page
     */
    function generateMultiple(catalog, configs) {
        const results = {};

        configs.forEach(config => {
            results[config.id] = {
                title: config.title,
                description: config.description,
                icon: config.icon,
                products: generate(catalog, config.options)
            };
        });

        return results;
    }

    /**
     * Preset ranking configurations for geladeiras
     */
    const PRESETS = {
        geladeira: [
            {
                id: 'top10',
                title: 'Top 10 Geladeiras',
                description: 'Melhores geladeiras por nota geral',
                icon: '🏆',
                options: { sortBy: 'overall', limit: 10, includeReasons: true }
            },
            {
                id: 'best_value',
                title: 'Melhor Custo-Benefício',
                description: 'Geladeiras com melhor relação preço/qualidade',
                icon: '💰',
                options: { sortBy: 'custo_beneficio', limit: 5, includeReasons: true }
            },
            {
                id: 'most_efficient',
                title: 'Mais Econômicas',
                description: 'Menor consumo de energia',
                icon: '⚡',
                options: { sortBy: 'consumo', limit: 5, includeReasons: true }
            },
            {
                id: 'largest_freezer',
                title: 'Maior Freezer',
                description: 'Para quem congela muito',
                icon: '🧊',
                options: { sortBy: 'freezer', limit: 5, includeReasons: true }
            },
            {
                id: 'most_compact',
                title: 'Mais Compactas',
                description: 'Para nichos estreitos',
                icon: '📐',
                options: { sortBy: 'width', limit: 5, includeReasons: true }
            },
            {
                id: 'lowest_price',
                title: 'Menores Preços',
                description: 'Opções mais acessíveis',
                icon: '🏷️',
                options: { sortBy: 'price', order: 'asc', limit: 5, includeReasons: true }
            }
        ]
    };

    /**
     * Get preset configurations for a category
     */
    function getPresets(categoryId) {
        return PRESETS[categoryId] || PRESETS.geladeira;
    }

    // Utility function
    function formatBRL(value) {
        if (value == null) return 'N/A';
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }

    // Public API
    return {
        generate,
        generateMultiple,
        getPresets,
        getScore
    };
})();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Ranking;
}
