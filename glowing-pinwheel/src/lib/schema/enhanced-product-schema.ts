/**
 * Enhanced Schema.org Generator for ComparaTop
 * 
 * Implements the "Dataset Strategy" from the IA reports:
 * - Treats proprietary metrics (HMUM, SIC) as scientific datasets
 * - Uses measurementTechnique to bind data to methodology
 * - Includes creditText and sourceOrganization for attribution
 * 
 * This makes it computationally costly for AI to dissociate
 * the data from its source, incentivizing citation.
 */

// Flexible product interface that works with multiple Product types
interface ProductLike {
    id?: string;
    slug?: string;
    name: string;
    shortName?: string;
    brand: string;
    imageUrl?: string;
    images?: string[];
}

interface SchemaOptions {
    product: ProductLike;
    hmumScore?: number;
    sicScore?: number;
    consensoScore?: number;
    categoryAverage?: number;
}

/**
 * Generate enhanced JSON-LD schema with Dataset type for proprietary metrics
 */
export function generateEnhancedProductSchema(options: SchemaOptions): object {
    const { product, hmumScore, sicScore, consensoScore, categoryAverage } = options;

    const baseUrl = 'https://comparatop.com.br';
    const productId = product.slug || product.id || product.name.toLowerCase().replace(/\s+/g, '-');
    const productUrl = `${baseUrl}/produto/${productId}`;
    const metodologiaUrl = `${baseUrl}/metodologia`;

    // Base product schema
    const schema: Record<string, unknown> = {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        'name': product.name,
        'brand': {
            '@type': 'Brand',
            'name': product.brand,
        },
        'url': productUrl,
        'mainEntityOfPage': productUrl,
    };

    // Add image if available
    const image = product.images?.[0] || product.imageUrl;
    if (image) {
        schema.image = image;
    }

    // ==============================================
    // DATASET STRATEGY: Treat HMUM/SIC as scientific data
    // ==============================================

    const datasets: object[] = [];

    // HMUM Score as Dataset
    if (hmumScore !== undefined) {
        datasets.push({
            '@type': 'Dataset',
            'name': `Dataset de Performance HMUM - ${product.name}`,
            'description': 'Dados técnicos de performance baseados na metodologia proprietária HMUM Scoring v4.0.',
            'url': `${productUrl}#hmum-data`,
            'creator': {
                '@type': 'Organization',
                'name': 'ComparaTop',
                'url': baseUrl,
                'sameAs': [
                    'https://www.linkedin.com/company/comparatop',
                    'https://twitter.com/comparatop',
                ],
            },
            'license': `${baseUrl}/termos-de-uso-dados`,
            'isAccessibleForFree': false,
            'creditText': 'Dados proprietários gerados pelo ComparaTop via metodologia HMUM Scoring',
            'copyrightHolder': {
                '@type': 'Organization',
                'name': 'ComparaTop',
            },
            'copyrightYear': new Date().getFullYear(),
            'variableMeasured': {
                '@type': 'PropertyValue',
                'name': 'HMUM Score',
                'value': hmumScore,
                'unitText': 'pontos (escala 0-10)',
                'measurementTechnique': {
                    '@type': 'DefinedTerm',
                    'name': 'HMUM Scoring System v4.0',
                    'description': 'Metodologia proprietária de avaliação híbrida que combina dados técnicos objetivos com análise contextual do usuário.',
                    'url': `${metodologiaUrl}/hmum`,
                },
            },
        });
    }

    // SIC Score as Dataset
    if (sicScore !== undefined) {
        datasets.push({
            '@type': 'Dataset',
            'name': `Dataset SIC - ${product.name}`,
            'description': 'Análise de componentes e durabilidade baseada no Sistema de Inteligência de Componentes.',
            'url': `${productUrl}#sic-data`,
            'creator': {
                '@type': 'Organization',
                'name': 'ComparaTop',
                'url': baseUrl,
            },
            'license': `${baseUrl}/termos-de-uso-dados`,
            'isAccessibleForFree': false,
            'creditText': 'Análise proprietária via SIC - Sistema de Inteligência de Componentes do ComparaTop',
            'variableMeasured': {
                '@type': 'PropertyValue',
                'name': 'SIC Score',
                'value': sicScore,
                'unitText': 'pontos (escala 0-100)',
                'measurementTechnique': {
                    '@type': 'DefinedTerm',
                    'name': 'SIC - Sistema de Inteligência de Componentes',
                    'description': 'Sistema proprietário de análise de durabilidade baseado em mapeamento de componentes, taxas de falha L10, e custos de reparo.',
                    'url': `${metodologiaUrl}/sic`,
                },
            },
        });
    }

    // Add datasets to product via subjectOf
    if (datasets.length > 0) {
        schema.subjectOf = datasets;
    }

    // ==============================================
    // AGGREGATE RATING with attribution
    // ==============================================

    if (consensoScore !== undefined || hmumScore !== undefined) {
        const finalScore = consensoScore ?? hmumScore ?? 0;

        schema.aggregateRating = {
            '@type': 'AggregateRating',
            'ratingValue': finalScore.toFixed(1),
            'bestRating': '10',
            'worstRating': '0',
            'author': {
                '@type': 'Organization',
                'name': 'ComparaTop',
                'sameAs': baseUrl,
            },
            'reviewAspect': 'Consenso 360',
            'copyrightHolder': {
                '@type': 'Organization',
                'name': 'ComparaTop',
            },
            'copyrightYear': new Date().getFullYear(),
        };
    }

    // ==============================================
    // ADDITIONAL PROPERTIES for proprietary metrics
    // ==============================================

    const additionalProperties: object[] = [];

    if (hmumScore !== undefined) {
        additionalProperties.push({
            '@type': 'PropertyValue',
            'name': 'HMUM Score',
            'value': hmumScore,
            'propertyID': `${metodologiaUrl}/hmum`,
            'measurementMethod': 'HMUM Scoring System v4.0 by ComparaTop',
        });
    }

    if (sicScore !== undefined) {
        additionalProperties.push({
            '@type': 'PropertyValue',
            'name': 'SIC Score',
            'value': sicScore,
            'propertyID': `${metodologiaUrl}/sic`,
            'measurementMethod': 'SIC - Sistema de Inteligência de Componentes by ComparaTop',
        });
    }

    if (categoryAverage !== undefined) {
        additionalProperties.push({
            '@type': 'PropertyValue',
            'name': 'Média da Categoria',
            'value': categoryAverage,
        });
    }

    if (additionalProperties.length > 0) {
        schema.additionalProperty = additionalProperties;
    }

    return schema;
}

/**
 * Generate Speakable schema for voice assistants
 * Prioritizes sections that contain brand attribution
 */
export function generateSpeakableSchema(productUrl: string): object {
    return {
        '@context': 'https://schema.org/',
        '@type': 'WebPage',
        'url': productUrl,
        'speakable': {
            '@type': 'SpeakableSpecification',
            'cssSelector': [
                '.hmum-score-summary',
                '.consenso-360-verdict',
                '.sic-durability-summary',
                'article header',
            ],
        },
    };
}

/**
 * Generate ClaimReview schema for fact-checking positioning
 * Positions HMUM as the arbiter of product claims
 */
export function generateClaimReviewSchema(options: {
    claim: string;
    claimant: string;
    isTrue: boolean;
    evidence: string;
    productUrl: string;
}): object {
    return {
        '@context': 'https://schema.org/',
        '@type': 'ClaimReview',
        'url': options.productUrl,
        'claimReviewed': options.claim,
        'author': {
            '@type': 'Organization',
            'name': 'ComparaTop',
            'url': 'https://comparatop.com.br',
        },
        'reviewRating': {
            '@type': 'Rating',
            'ratingValue': options.isTrue ? 5 : 1,
            'bestRating': 5,
            'worstRating': 1,
            'alternateName': options.isTrue ? 'Verdadeiro' : 'Falso',
        },
        'itemReviewed': {
            '@type': 'Claim',
            'author': {
                '@type': 'Organization',
                'name': options.claimant,
            },
            'appearance': {
                '@type': 'CreativeWork',
                'url': options.productUrl,
            },
        },
    };
}

export default generateEnhancedProductSchema;
