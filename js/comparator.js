/**
 * ComparaTop 2.0 - Comparator Module
 * Handles N-way product comparisons (2-5 products)
 */

const Comparator = (function () {
    'use strict';

    const MIN_PRODUCTS = 2;
    const MAX_PRODUCTS = 5;

    /**
     * Compare multiple products
     * @param {Object} catalog - The catalog object
     * @param {Array<string>} productIds - Array of product IDs to compare
     * @returns {Object} Comparison result with specs, scores, winners, etc.
     */
    function compare(catalog, productIds) {
        // Validate
        if (!productIds || productIds.length < MIN_PRODUCTS) {
            throw new Error(`Mínimo ${MIN_PRODUCTS} produtos para comparar`);
        }
        if (productIds.length > MAX_PRODUCTS) {
            throw new Error(`Máximo ${MAX_PRODUCTS} produtos para comparar`);
        }

        // Get products
        const products = productIds
            .map(id => catalog.products[id])
            .filter(Boolean);

        if (products.length < MIN_PRODUCTS) {
            throw new Error('Produtos não encontrados');
        }

        return {
            products,
            productCount: products.length,
            specComparison: compareSpecs(products, catalog.specDefinitions),
            editorialComparison: compareEditorial(products, catalog.scoringTopics),
            featureComparison: compareFeatures(products),
            priceComparison: comparePrices(products),
            vocSummary: summarizeVoC(products),
            overallWinner: determineOverallWinner(products),
            keyDifferences: findKeyDifferences(products, catalog),
            generatedAt: new Date().toISOString()
        };
    }

    /**
     * Compare specs across products
     */
    function compareSpecs(products, specDefinitions) {
        const specs = {};
        const firstProduct = products[0];

        if (!firstProduct.specs) return specs;

        Object.keys(firstProduct.specs).forEach(specKey => {
            const def = specDefinitions?.[specKey] || {};
            const values = products.map(p => ({
                productId: p.id,
                productName: p.name,
                value: p.specs[specKey],
                formatted: formatSpec(p.specs[specKey], def)
            }));

            const winner = determineSpecWinner(values, def.higherIsBetter);

            specs[specKey] = {
                key: specKey,
                label: def.label || specKey,
                unit: def.unit,
                higherIsBetter: def.higherIsBetter,
                values,
                winnerId: winner?.productId || null,
                isDraw: winner === null
            };
        });

        return specs;
    }

    /**
     * Determine winner for a spec
     */
    function determineSpecWinner(values, higherIsBetter) {
        const numericValues = values.filter(v => typeof v.value === 'number');
        if (numericValues.length < 2) return null;
        if (higherIsBetter === null || higherIsBetter === undefined) return null;

        const sorted = [...numericValues].sort((a, b) => {
            return higherIsBetter ? b.value - a.value : a.value - b.value;
        });

        // Check for draw
        if (sorted[0].value === sorted[1].value) return null;

        return sorted[0];
    }

    /**
     * Format spec value for display
     */
    function formatSpec(value, def) {
        if (value === null || value === undefined) return 'N/A';
        if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
        if (Array.isArray(value)) return value.join(', ');
        if (typeof value === 'number' && def?.unit) {
            return `${value.toLocaleString('pt-BR')} ${def.unit}`;
        }
        return String(value);
    }

    /**
     * Compare editorial scores
     */
    function compareEditorial(products, topics) {
        const comparison = {};

        topics.forEach(topic => {
            const values = products.map(p => ({
                productId: p.id,
                productName: p.name,
                score: p.editorialScores?.[topic.id] ?? null
            }));

            const validScores = values.filter(v => v.score !== null);
            let winner = null;

            if (validScores.length >= 2) {
                const sorted = [...validScores].sort((a, b) => b.score - a.score);
                if (sorted[0].score !== sorted[1].score) {
                    winner = sorted[0];
                }
            }

            comparison[topic.id] = {
                topic: topic.id,
                label: topic.label,
                icon: topic.icon,
                values,
                winnerId: winner?.productId || null,
                isDraw: validScores.length >= 2 && winner === null
            };
        });

        // Add overall comparison
        const overallValues = products.map(p => ({
            productId: p.id,
            productName: p.name,
            score: p.editorialScores?.overall ?? null
        }));

        const validOverall = overallValues.filter(v => v.score !== null);
        let overallWinner = null;

        if (validOverall.length >= 2) {
            const sorted = [...validOverall].sort((a, b) => b.score - a.score);
            if (sorted[0].score !== sorted[1].score) {
                overallWinner = sorted[0];
            }
        }

        comparison.overall = {
            topic: 'overall',
            label: 'Nota Geral',
            icon: '🏆',
            values: overallValues,
            winnerId: overallWinner?.productId || null,
            isDraw: validOverall.length >= 2 && overallWinner === null
        };

        return comparison;
    }

    /**
     * Compare features across products
     */
    function compareFeatures(products) {
        const allFeatureIds = new Set();
        products.forEach(p => {
            (p.features || []).forEach(f => allFeatureIds.add(f.id));
        });

        const comparison = [];

        allFeatureIds.forEach(featureId => {
            const values = products.map(p => {
                const feature = (p.features || []).find(f => f.id === featureId);
                return {
                    productId: p.id,
                    productName: p.name,
                    has: feature?.value === true,
                    label: feature?.label || featureId
                };
            });

            // Check if there's a difference
            const hasValues = values.map(v => v.has);
            const allSame = hasValues.every(v => v === hasValues[0]);

            if (!allSame) {
                comparison.push({
                    featureId,
                    label: values.find(v => v.label)?.label || featureId,
                    values,
                    winnerId: values.find(v => v.has)?.productId || null
                });
            }
        });

        return comparison;
    }

    /**
     * Compare prices
     */
    function comparePrices(products) {
        const values = products.map(p => ({
            productId: p.id,
            productName: p.name,
            bestPrice: p.bestPrice,
            bestOffer: p.bestOffer,
            formatted: p.bestPrice ? formatBRL(p.bestPrice) : 'N/A'
        }));

        const validPrices = values.filter(v => v.bestPrice !== null);
        let cheapest = null;

        if (validPrices.length >= 2) {
            const sorted = [...validPrices].sort((a, b) => a.bestPrice - b.bestPrice);
            cheapest = sorted[0];
        }

        return {
            values,
            cheapestId: cheapest?.productId || null,
            priceDifference: validPrices.length >= 2
                ? Math.abs(validPrices[0].bestPrice - validPrices[1].bestPrice)
                : null
        };
    }

    /**
     * Summarize VoC for comparison
     */
    function summarizeVoC(products) {
        return products.map(p => ({
            productId: p.id,
            productName: p.name,
            sentiment: p.voc?.sentiment || 'Desconhecido',
            sentimentClass: p.voc?.sentimentClass || 'neutral',
            oneLiner: p.voc?.oneLiner || null,
            topPro: p.voc?.pros?.[0] || null,
            topCon: p.voc?.cons?.[0] || null,
            sampleSize: p.voc?.sample?.totalApprox || null
        }));
    }

    /**
     * Determine overall winner
     */
    function determineOverallWinner(products) {
        const sorted = [...products]
            .filter(p => p.editorialScores?.overall != null)
            .sort((a, b) => b.editorialScores.overall - a.editorialScores.overall);

        if (sorted.length < 2) return null;
        if (sorted[0].editorialScores.overall === sorted[1].editorialScores.overall) {
            return null; // Draw
        }

        return {
            productId: sorted[0].id,
            productName: sorted[0].name,
            score: sorted[0].editorialScores.overall,
            margin: Math.round((sorted[0].editorialScores.overall - sorted[1].editorialScores.overall) * 10) / 10
        };
    }

    /**
     * Find key differences between products
     */
    function findKeyDifferences(products, catalog) {
        const differences = [];

        // Check width difference
        const widths = products.map(p => p.specs?.largura_cm).filter(Boolean);
        if (widths.length >= 2) {
            const diff = Math.max(...widths) - Math.min(...widths);
            if (diff >= 5) {
                differences.push({
                    type: 'spec',
                    field: 'largura_cm',
                    label: 'Largura',
                    icon: '📐',
                    description: `Diferença de ${diff.toFixed(1)} cm na largura`
                });
            }
        }

        // Check freezer difference
        const freezers = products.map(p => p.specs?.capacidade_freezer).filter(Boolean);
        if (freezers.length >= 2) {
            const diff = Math.max(...freezers) - Math.min(...freezers);
            if (diff >= 20) {
                differences.push({
                    type: 'spec',
                    field: 'capacidade_freezer',
                    label: 'Freezer',
                    icon: '❄️',
                    description: `Diferença de ${diff}L no freezer`
                });
            }
        }

        // Check consumption difference
        const consumptions = products.map(p => p.specs?.consumo_kwh).filter(Boolean);
        if (consumptions.length >= 2) {
            const diff = Math.max(...consumptions) - Math.min(...consumptions);
            if (diff >= 3) {
                differences.push({
                    type: 'spec',
                    field: 'consumo_kwh',
                    label: 'Consumo',
                    icon: '⚡',
                    description: `Diferença de ${diff.toFixed(1)} kWh/mês`
                });
            }
        }

        // Check feature differences
        const hasDigitalPanel = products.map(p =>
            (p.features || []).find(f => f.id === 'painel_digital')?.value
        );
        if (hasDigitalPanel.some(v => v === true) && hasDigitalPanel.some(v => v !== true)) {
            differences.push({
                type: 'feature',
                field: 'painel_digital',
                label: 'Painel Digital',
                icon: '📱',
                description: 'Nem todos têm painel digital'
            });
        }

        return differences;
    }

    /**
     * Generate comparison URL
     */
    function generateUrl(categorySlug, productIds) {
        const sorted = [...productIds].sort();
        if (sorted.length === 2) {
            return `/${categorySlug}/${sorted[0]}-vs-${sorted[1]}/`;
        }
        return `/${categorySlug}/comparar/?p=${sorted.join(',')}`;
    }

    /**
     * Parse comparison URL
     */
    function parseUrl(url) {
        const match = url.match(/\/comparar\/\?p=(.+)/);
        if (match) {
            return match[1].split(',').filter(Boolean);
        }

        const vsMatch = url.match(/\/([a-z0-9-]+)-vs-([a-z0-9-]+)\/?$/);
        if (vsMatch) {
            return [vsMatch[1], vsMatch[2]];
        }

        return [];
    }

    // Utility
    function formatBRL(value) {
        if (value == null) return 'N/A';
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }

    // Public API
    return {
        compare,
        generateUrl,
        parseUrl,
        MIN_PRODUCTS,
        MAX_PRODUCTS
    };
})();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Comparator;
}
