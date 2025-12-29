/**
 * ComparaTop 2.0 - Assistant Module
 * Bidirectional intelligent recommendation system
 */

const Assistant = (function () {
    'use strict';

    /**
     * Load assistant configuration for a category
     */
    async function loadConfig(categoryId) {
        const response = await fetch(`/data/assistant/${categoryId}.json`);
        if (!response.ok) throw new Error(`Assistant config not found: ${categoryId}`);
        return response.json();
    }

    /**
     * FLOW A: Answers → Recommended Products
     * @param {Object} catalog - The product catalog
     * @param {Object} config - Assistant configuration
     * @param {Object} answers - User answers { questionId: value }
     * @returns {Array} Scored and sorted products with reasons
     */
    function getRecommendations(catalog, config, answers) {
        const products = Object.values(catalog.products).filter(p => p.status === 'active');

        const scored = products.map(product => {
            const { score, reasons, warnings } = calculateScore(product, config.questions, answers, catalog);
            return {
                product,
                score,
                reasons,
                warnings
            };
        });

        // Sort by score descending
        scored.sort((a, b) => b.score - a.score);

        // Take top N
        const topN = config.resultConfig?.showTop || 3;
        const recommendations = scored.slice(0, topN);

        // Mark winner
        if (recommendations.length > 0) {
            recommendations[0].isWinner = true;
        }

        return {
            recommendations,
            alternatives: config.resultConfig?.showAlternatives
                ? scored.slice(topN, topN + (config.resultConfig?.maxAlternatives || 2))
                : [],
            answersUsed: answers,
            generatedAt: new Date().toISOString()
        };
    }

    /**
     * Calculate score for a product based on answers
     */
    function calculateScore(product, questions, answers, catalog) {
        // Base score from overall editorial score
        let score = (product.editorialScores?.overall || 5) * 10;
        const reasons = [];
        const warnings = [];

        questions.forEach(question => {
            const answer = answers[question.id];
            if (answer === undefined || answer === null || answer === '') return;

            const scoring = getScoring(question, answer);
            if (!scoring) return;

            // Apply scoring rules
            if (scoring.rule === 'fit_check' && typeof answer === 'number') {
                const fieldValue = getNestedValue(product, scoring.field);
                if (fieldValue) {
                    const gap = scoring.gap || 0;
                    const fits = answer >= (fieldValue + gap);

                    if (!fits) {
                        score += scoring.penaltyIfNotFit || -100;
                        warnings.push(`Não cabe no espaço de ${answer} cm (precisa ${fieldValue + gap} cm)`);
                    } else {
                        score += 10;
                        reasons.push(`Cabe no seu espaço de ${answer} cm`);
                    }
                }
            }

            if (scoring.rule === 'budget_check' && typeof answer === 'number') {
                const price = product.bestPrice;
                if (price) {
                    if (price > answer) {
                        score += scoring.penaltyIfOver || -50;
                        warnings.push(`Acima do orçamento (${formatBRL(price)} > ${formatBRL(answer)})`);
                    } else {
                        score += 5;
                        const savings = answer - price;
                        if (savings > 200) {
                            reasons.push(`${formatBRL(savings)} abaixo do orçamento`);
                        }
                    }
                }
            }

            if (scoring.boost_topic) {
                const topicScore = product.editorialScores?.[scoring.boost_topic] || 5;
                const boost = topicScore * (scoring.factor || 1);
                score += boost;

                if (topicScore >= 8) {
                    const topicLabel = catalog.scoringTopics.find(t => t.id === scoring.boost_topic)?.label;
                    reasons.push(`Destaque em ${topicLabel?.toLowerCase() || scoring.boost_topic}`);
                }
            }

            if (scoring.boost_field) {
                const fieldValue = getNestedValue(product, scoring.boost_field);
                if (typeof fieldValue === 'number') {
                    score += fieldValue * (scoring.factor || 0.1);
                }
            }

            if (scoring.penalty_field) {
                const fieldValue = getNestedValue(product, scoring.penalty_field);
                if (typeof fieldValue === 'number') {
                    score += fieldValue * (scoring.factor || -0.1);
                }
            }

            if (scoring.boost_field_inverse) {
                const fieldValue = getNestedValue(product, scoring.boost_field_inverse);
                if (typeof fieldValue === 'number' && fieldValue > 0) {
                    score += (1 / fieldValue) * (scoring.factor || 1) * 10000;
                }
            }
        });

        // Add reason for best price if applicable
        if (product.bestPrice) {
            const allPrices = Object.values(catalog.products)
                .filter(p => p.bestPrice)
                .map(p => p.bestPrice);

            if (product.bestPrice === Math.min(...allPrices)) {
                reasons.push(`Menor preço: ${formatBRL(product.bestPrice)}`);
            }
        }

        // Add reasons from idealFor if match answers
        (product.idealFor || []).slice(0, 2).forEach(ideal => {
            if (!reasons.some(r => r.includes(ideal.label))) {
                reasons.push(ideal.label);
            }
        });

        return { score, reasons: reasons.slice(0, 3), warnings };
    }

    /**
     * Get scoring rules for a question/answer
     */
    function getScoring(question, answer) {
        // For number inputs, use question-level scoring
        if (question.type === 'number') {
            return question.scoring;
        }

        // For choice inputs, find the selected option's scoring
        if (question.options) {
            const option = question.options.find(o => o.value === answer);
            return option?.scoring || null;
        }

        return question.scoring || null;
    }

    /**
     * FLOW B: Selected Products → Contextual Questions
     * @param {Object} catalog - The product catalog
     * @param {Object} config - Assistant configuration
     * @param {Array<string>} productIds - Products being compared
     * @returns {Array} Relevant questions for these products
     */
    function getComparisonQuestions(catalog, config, productIds) {
        const products = productIds.map(id => catalog.products[id]).filter(Boolean);
        if (products.length < 2) return config.questions;

        const differences = findProductDifferences(products);

        // Filter questions to those relevant to the differences
        const relevantQuestions = config.questions.filter(q => {
            // Always include niche/budget questions
            if (q.id === 'niche_width' || q.id === 'budget') return true;

            // Check if question's scoring fields relate to differences
            if (q.scoring?.field && differences.some(d => q.scoring.field.includes(d))) {
                return true;
            }

            if (q.options) {
                return q.options.some(opt => {
                    if (!opt.scoring) return false;
                    if (opt.scoring.boost_topic && differences.includes(opt.scoring.boost_topic)) return true;
                    if (opt.scoring.boost_field && differences.some(d => opt.scoring.boost_field.includes(d))) return true;
                    return false;
                });
            }

            return false;
        });

        return relevantQuestions.length >= 2 ? relevantQuestions : config.questions;
    }

    /**
     * Find key differences between products
     */
    function findProductDifferences(products) {
        const differences = [];

        // Check specs
        const specKeys = ['largura_cm', 'capacidade_freezer', 'consumo_kwh', 'capacidade_total'];
        specKeys.forEach(key => {
            const values = products.map(p => p.specs?.[key]).filter(v => v != null);
            if (values.length >= 2) {
                const range = Math.max(...values) - Math.min(...values);
                const avg = values.reduce((a, b) => a + b, 0) / values.length;
                if (range / avg > 0.1) { // >10% difference
                    differences.push(key);
                }
            }
        });

        // Check editorial topics
        const topicKeys = ['ruido', 'consumo', 'funcionalidades', 'encaixe'];
        topicKeys.forEach(key => {
            const scores = products.map(p => p.editorialScores?.[key]).filter(v => v != null);
            if (scores.length >= 2) {
                const range = Math.max(...scores) - Math.min(...scores);
                if (range >= 1.5) { // >= 1.5 point difference
                    differences.push(key);
                }
            }
        });

        // Check features
        const allFeatures = new Set();
        products.forEach(p => (p.features || []).forEach(f => allFeatures.add(f.id)));

        allFeatures.forEach(featureId => {
            const hasFeature = products.map(p =>
                (p.features || []).find(f => f.id === featureId)?.value === true
            );
            if (hasFeature.some(v => v) && hasFeature.some(v => !v)) {
                differences.push(featureId);
            }
        });

        return differences;
    }

    /**
     * Generate recommendation with comparison context
     */
    function recommendFromComparison(catalog, config, productIds, answers) {
        const products = productIds.map(id => catalog.products[id]).filter(Boolean);

        const scored = products.map(product => {
            const { score, reasons, warnings } = calculateScore(product, config.questions, answers, catalog);
            return { product, score, reasons, warnings };
        });

        scored.sort((a, b) => b.score - a.score);

        const winner = scored[0];
        const runnerUp = scored[1];

        return {
            winner: winner ? {
                ...winner,
                isWinner: true,
                margin: runnerUp ? Math.round((winner.score - runnerUp.score) * 10) / 10 : null
            } : null,
            others: scored.slice(1),
            answersUsed: answers,
            generatedAt: new Date().toISOString()
        };
    }

    /**
     * Get nested value from object using dot notation
     */
    function getNestedValue(obj, path) {
        if (!obj || !path) return undefined;
        return path.split('.').reduce((curr, key) => curr?.[key], obj);
    }

    /**
     * Format BRL currency
     */
    function formatBRL(value) {
        if (value == null) return 'N/A';
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }

    // Public API
    return {
        loadConfig,
        getRecommendations,
        getComparisonQuestions,
        recommendFromComparison,
        calculateScore
    };
})();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Assistant;
}
