/**
 * Mock Data Loader for SimplifiedPDP
 * Server-side utility to load JSON mock data
 */

import * as fs from 'fs';
import * as path from 'path';

export interface MockData {
    product?: {
        id: string;
        name: string;
        brand: string;
        category: string;
    };
    header?: {
        overallScore: number;
        scoreLabel: string;
        title: string;
        subtitle: string;
        badges: Array<{ type: string; label: string; icon: string }>;
    };
    auditVerdict?: {
        solution?: { items: string[] };
        attentionPoint?: { items: string[] };
        technicalConclusion?: { text: string };
        dontBuyIf?: { items: string[] };
    };
    productDna?: {
        dimensions: Array<{
            id: string;
            name: string;
            shortName: string;
            score: number;
            weight: number;
            description: string;
        }>;
    };
    decisionFAQ?: Array<{
        id: string;
        question: string;
        answer: string;
    }>;
    tco?: {
        purchasePrice: number;
        energyCost5y: number;
        maintenanceCost5y: number;
        totalCost5y: number;
        monthlyReserve: number;
        lifespan: {
            years: number;
            categoryAverage: number;
            limitingComponent: string;
            limitingComponentLife: number;
            weibullExplanation?: string;
        };
        repairability: {
            score: number;
            level: 'easy' | 'moderate' | 'difficult';
            categoryAverage: number;
            components: Array<{
                name: string;
                score: number;
                price: number;
                availability: 'available' | 'limited' | 'scarce';
                failureSymptoms?: string[];
                repairAdvice?: string;
            }>;
        };
    };
    /** Interactive tools definitions */
    interactiveTools?: Array<{
        id: string;
        icon: 'ruler' | 'monitor' | 'zap' | 'maximize';
        title: string;
        badge?: string;
        badgeColor?: 'orange' | 'blue' | 'green' | 'purple';
        description: string;
        action?: string;
    }>;
    /** Product dimensions for pre-filling calculators */
    productDimensions?: {
        width?: number;
        height?: number;
        depth?: number;
        diameter?: number;
    };
    /** VOC data for CommunityConsensusCard */
    voc?: {
        consensusScore: number;
        totalReviews: string;
        acceptableFlaw: string;
        realWorldScenario: string;
        goldenTip: string;
        auditScore?: number;
    };
}

/**
 * Load mock data for a product by slug
 * Returns null if mock doesn't exist
 */
export function loadMockData(slug: string): MockData | null {
    try {
        // Path to mocks directory
        const mockPath = path.join(
            process.cwd(),
            'src',
            'data',
            'mocks',
            `${slug}.json`
        );

        if (!fs.existsSync(mockPath)) {
            console.log(`[MOCK] No mock found for: ${slug}`);
            return null;
        }

        const content = fs.readFileSync(mockPath, 'utf-8');
        const data = JSON.parse(content) as MockData;
        console.log(`[MOCK] Loaded mock for: ${slug}`);
        return data;
    } catch (error) {
        console.error(`[MOCK] Error loading mock for ${slug}:`, error);
        return null;
    }
}
