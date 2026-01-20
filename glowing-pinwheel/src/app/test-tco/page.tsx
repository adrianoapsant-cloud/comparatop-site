'use client';

/**
 * @file Página de teste para o novo OwnershipInsightsExpanded
 */

import { OwnershipInsightsExpanded } from '@/components/product/OwnershipInsightsExpanded';
import type { ExpandedShadowMetrics } from '@/lib/scoring/types';

// Dados de exemplo baseados no Samsung QN90C
const mockMetrics: ExpandedShadowMetrics = {
    estimatedLifespanYears: 11,
    totalCostOfOwnership5Years: 6528,
    maintenanceRiskScore: 5.7,
    computedConfidence: 0.85,
    monthlyCostBreakdown: {
        energy: 11,
        consumables: 0,
        maintenanceReserve: 28,
    },
    tcoBreakdown: {
        capex: 4200,
        energyCost: 660,
        energyDetails: {
            monthlyKwh: 11,
            tariffPerKwh: 1.0,
            monthlyAmount: 11,
            totalMonths: 60,
        },
        maintenanceCost: 1680,
        maintenanceDetails: {
            annualFailureProbability: 0.05,
            avgRepairCost: 700,
            yearsProjected: 5,
        },
        resaleValue: 756,
        depreciationRate: 0.15,
    },
    lifespanExplanation: {
        years: 11,
        categoryAverageYears: 8,
        percentageVsAverage: 38,
        limitingComponent: {
            name: 'Backlight Mini-LED FALD',
            category: 'backlight',
            l10Hours: 60000,
            failureModes: ['zonas_apagadas', 'zonas_travadas', 'blooming'],
        },
        usageAssumptions: {
            dailyHours: 5.5,
            annualHours: 2000,
            source: 'category_default',
        },
        qualityMultipliers: {
            brand: { name: 'Samsung Premium', factor: 1.05 },
            technology: { name: 'Mini-LED', factor: 1.05 },
        },
        calculationBreakdown: {
            baseLifeYears: 10,
            afterBrandMultiplier: 10.5,
            afterTechMultiplier: 11,
            finalEstimate: 11,
        },
    },
    repairabilityMap: {
        overallScore: 5.7,
        label: 'Reparo Moderado',
        components: [
            {
                name: 'Painel Mini-LED Samsung Neo QLED',
                id: 'panel_miniled_samsung_neo_qled',
                category: 'panel',
                score: 2,
                status: 'critical',
                repairCost: 3300,
                partsAvailability: 'scarce',
                symptoms: ['Áreas do backlight não acendem', 'Halos brancos ao redor de objetos brilhantes'],
                recommendation: 'Se esse componente falhar, o custo do reparo pode ser alto — depende da região e assistência',
                isLimitingComponent: false,
                diyFriendly: false,
            },
            {
                name: 'Backlight Mini-LED FALD',
                id: 'backlight_miniled_fald',
                category: 'backlight',
                score: 4,
                status: 'moderate',
                repairCost: 1100,
                partsAvailability: 'limited',
                symptoms: ['Tela escura com som', 'Zonas apagadas'],
                recommendation: 'Reparo possível, avaliar custo-benefício',
                isLimitingComponent: true,
                diyFriendly: false,
            },
            {
                name: 'Main Board Smart TV',
                id: 'board_main_smart_tv',
                category: 'board',
                score: 7,
                status: 'repairable',
                repairCost: 800,
                partsAvailability: 'good',
                symptoms: ['WiFi não conecta ou desconecta', 'Portas HDMI param de funcionar'],
                recommendation: 'Conserto viável e econômico',
                isLimitingComponent: false,
                diyFriendly: true,
            },
            {
                name: 'Fonte de Alimentação Integrada',
                id: 'board_psu_integrated',
                category: 'power_supply',
                score: 8,
                status: 'repairable',
                repairCost: 550,
                partsAvailability: 'good',
                symptoms: ['TV não liga (LED standby apagado)', 'TV desliga sozinha após minutos', 'Ruído de "click" repetitivo'],
                recommendation: 'Conserto viável e econômico',
                isLimitingComponent: false,
                diyFriendly: true,
            },
            {
                name: 'T-CON Board Independente',
                id: 'board_tcon_independent',
                category: 'board',
                score: 8,
                status: 'repairable',
                repairCost: 500,
                partsAvailability: 'good',
                symptoms: ['Linhas verticais coloridas na tela', 'Imagem solarizada ou negativa', 'Tela branca com áudio funcionando'],
                recommendation: 'Conserto viável e econômico',
                isLimitingComponent: false,
                diyFriendly: true,
            },
        ],
        summary: {
            totalComponents: 5,
            repairableCount: 3,
            criticalCount: 1,
            avgRepairCost: 1250,
        },
    },
};

export default function TestOwnershipPage() {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                    Teste: OwnershipInsightsExpanded
                </h1>

                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Esta página testa o novo componente com dados mockados do Samsung QN90C.
                </p>

                <OwnershipInsightsExpanded
                    metrics={mockMetrics}
                    productName="Samsung QN90C Neo QLED 65&quot;"
                />
            </div>
        </div>
    );
}
