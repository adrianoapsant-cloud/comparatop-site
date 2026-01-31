/**
 * SimplifiedPDP - Unit Tests
 * Based on pdp-test-specification.md
 * 
 * Tests written without @testing-library/react dependency
 */

import { describe, it, expect } from 'vitest';
import {
    validatePDPContract,
    type PDPDataContract,
    type HiddenEngineeringItem,
    type FAQItem,
    type ScoresData,
    type TCOData,
} from '../hooks/usePDPData';

// ============================================
// MOCK DATA
// ============================================

const mockRawScores = {
    costBenefit: 8.5,
    imageProcessing: 7.0,
    reliability: 8.0,
    systemFluidity: 7.5,
    gamePerformance: 6.0,
    brightness: 7.0,
    support: 6.5,
    sound: 7.0,
    connectivity: 8.0,
    design: 8.5,
};

const mockScores: ScoresData = {
    final: 7.4,
    dimensions: Object.entries(mockRawScores).map(([key, value]) => ({
        name: key,
        score: value,
        weight: 1,
    })),
    hmumMatch: 75,
    categoryAverage: 7.0,
};

const mockTCO: TCOData = {
    purchasePrice: 2499,
    maintenanceCost5y: Math.round(2499 * 0.15),
    totalCost5y: Math.round(2499 * 1.15),
    monthlyReserve: Math.round((2499 * 0.15) / 60),
};

const mockHEItems: HiddenEngineeringItem[] = [
    { title: 'Battery Degradation', severity: 'warning', resolvability: 7, specific: 'Q7 L5', technicalFact: 'Li-ion degrades over time', riskAnalysis: 'May need replacement in 3-4 years', mitigation: 'Replaceable battery available' },
    { title: 'Motor Burnout', severity: 'critical', resolvability: 3, specific: 'All models', technicalFact: 'BLDC motors can fail', riskAnalysis: 'High cost repair', mitigation: 'Keep clean and maintain' },
    { title: 'Sensor Drift', severity: 'info', resolvability: 9, specific: 'LiDAR models', technicalFact: 'Calibration may drift', riskAnalysis: 'Minor navigation issues', mitigation: 'Software update usually fixes' },
];

const mockFAQ: FAQItem[] = [
    { question: 'O barulho atrapalha assistir TV?', answer: 'No modo Turbo sim, no Silencioso não.' },
    { question: 'Tenho pets peludos. Vou ter que limpar a escova todo dia?', answer: 'Não todo dia, mas toda semana.' },
    { question: 'A nota de reparabilidade é 5.7. Isso é ruim?', answer: 'É uma nota de realidade, não há assistência oficial no Brasil.' },
];

// ============================================
// 1. VALIDATION TESTS
// ============================================

describe('validatePDPContract', () => {
    it('deve validar produto com campos obrigatórios', () => {
        const data: Partial<PDPDataContract> = {
            product: { id: 'test', name: 'Test Product', category: 'other', currentPrice: 100, rawScores: mockRawScores },
            scores: mockScores,
        };

        const result = validatePDPContract(data);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    it('deve falhar sem product.name', () => {
        const data: Partial<PDPDataContract> = {
            product: { id: 'test', name: '', category: 'other', currentPrice: 100, rawScores: mockRawScores },
            scores: mockScores,
        };

        const result = validatePDPContract(data);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('product.name required');
    });

    it('deve falhar sem product.id', () => {
        const data: Partial<PDPDataContract> = {
            product: { id: '', name: 'Test', category: 'other', currentPrice: 100, rawScores: mockRawScores },
            scores: mockScores,
        };

        const result = validatePDPContract(data);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('product.id required');
    });

    it('deve falhar sem scores.final', () => {
        const data: Partial<PDPDataContract> = {
            product: { id: 'test', name: 'Test Product', category: 'other', currentPrice: 100, rawScores: mockRawScores },
            scores: null,
        };

        const result = validatePDPContract(data);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('scores.final required');
    });

    it('deve gerar warnings para dados opcionais faltantes', () => {
        const data: Partial<PDPDataContract> = {
            product: { id: 'test', name: 'Test Product', category: 'other', currentPrice: 100, rawScores: mockRawScores },
            scores: mockScores,
            faq: [],
            dna: [],
        };

        const result = validatePDPContract(data);
        expect(result.warnings.length).toBeGreaterThan(0);
        expect(result.warnings).toContain('faq has less than 3 items');
        expect(result.warnings).toContain('dna has less than 5 dimensions');
    });
});

// ============================================
// 2. TCO CALCULATION TESTS
// ============================================

describe('TCO Calculation', () => {
    it('deve calcular custo total = compra + manutenção', () => {
        const expectedTotal = mockTCO.purchasePrice + mockTCO.maintenanceCost5y;
        expect(mockTCO.totalCost5y).toBe(expectedTotal);
    });

    it('deve calcular reserva mensal = manutenção / 60', () => {
        const expectedMonthly = Math.round(mockTCO.maintenanceCost5y / 60);
        expect(mockTCO.monthlyReserve).toBe(expectedMonthly);
    });

    it('deve ter preço de compra positivo', () => {
        expect(mockTCO.purchasePrice).toBeGreaterThan(0);
    });

    it('custo total deve ser maior que preço de compra', () => {
        expect(mockTCO.totalCost5y).toBeGreaterThan(mockTCO.purchasePrice);
    });
});

// ============================================
// 3. SCORES DIMENSION TESTS
// ============================================

describe('Scores Dimensions', () => {
    it('deve ter 10 dimensões (uma por critério)', () => {
        expect(mockScores.dimensions.length).toBe(10);
    });

    it('cada dimensão deve ter score entre 0-10', () => {
        mockScores.dimensions.forEach(dim => {
            expect(dim.score).toBeGreaterThanOrEqual(0);
            expect(dim.score).toBeLessThanOrEqual(10);
        });
    });

    it('deve ter score final entre 0-10', () => {
        expect(mockScores.final).toBeGreaterThanOrEqual(0);
        expect(mockScores.final).toBeLessThanOrEqual(10);
    });

    it('deve ter hmumMatch entre 0-100', () => {
        expect(mockScores.hmumMatch).toBeGreaterThanOrEqual(0);
        expect(mockScores.hmumMatch).toBeLessThanOrEqual(100);
    });
});

// ============================================
// 4. HIDDEN ENGINEERING TESTS
// ============================================

describe('Hidden Engineering', () => {
    it('deve ter pelo menos 1 item', () => {
        expect(mockHEItems.length).toBeGreaterThanOrEqual(1);
    });

    it('deve ter severidade válida', () => {
        const validSeverities = ['critical', 'warning', 'info'];
        mockHEItems.forEach(item => {
            expect(validSeverities).toContain(item.severity);
        });
    });

    it('deve ter resolubilidade entre 1-10', () => {
        mockHEItems.forEach(item => {
            expect(item.resolvability).toBeGreaterThanOrEqual(1);
            expect(item.resolvability).toBeLessThanOrEqual(10);
        });
    });

    it('deve ter 4 subseções completas', () => {
        mockHEItems.forEach(item => {
            expect(item.specific).toBeDefined();
            expect(item.specific.length).toBeGreaterThan(0);
            expect(item.technicalFact).toBeDefined();
            expect(item.technicalFact.length).toBeGreaterThan(0);
            expect(item.riskAnalysis).toBeDefined();
            expect(item.riskAnalysis.length).toBeGreaterThan(0);
            expect(item.mitigation).toBeDefined();
            expect(item.mitigation.length).toBeGreaterThan(0);
        });
    });

    it('deve ordenar por severidade (critical > warning > info)', () => {
        const severityOrder = { critical: 0, warning: 1, info: 2 };
        const sorted = [...mockHEItems].sort((a, b) =>
            severityOrder[a.severity] - severityOrder[b.severity]
        );

        expect(sorted[0].severity).toBe('critical');
        expect(sorted[sorted.length - 1].severity).toBe('info');
    });
});

// ============================================
// 5. FAQ TESTS
// ============================================

describe('FAQ', () => {
    it('deve ter mínimo 3 perguntas', () => {
        expect(mockFAQ.length).toBeGreaterThanOrEqual(3);
    });

    it('deve ter pergunta não vazia', () => {
        mockFAQ.forEach(item => {
            expect(item.question.length).toBeGreaterThan(0);
        });
    });

    it('deve ter resposta não vazia', () => {
        mockFAQ.forEach(item => {
            expect(item.answer.length).toBeGreaterThan(0);
        });
    });
});

// ============================================
// 6. DATA CONTRACT COMPLETENESS TESTS
// ============================================

describe('Data Contract Completeness', () => {
    it('validação completa deve passar com todos os dados', () => {
        const completeData: Partial<PDPDataContract> = {
            product: { id: 'test', name: 'Test Product', category: 'other', currentPrice: 100, rawScores: mockRawScores },
            scores: mockScores,
            tco: mockTCO,
            hiddenEngineering: mockHEItems,
            faq: mockFAQ,
            dna: [
                { name: 'Limpeza', score: 8 },
                { name: 'Navegação', score: 7 },
                { name: 'Autonomia', score: 8.5 },
                { name: 'Ruído', score: 6 },
                { name: 'Manutenção', score: 7 },
            ],
            extended: {
                verdict: {
                    headline: 'Excelente custo-benefício',
                    prosExpanded: ['Pro 1', 'Pro 2', 'Pro 3'],
                    consExpanded: ['Con 1', 'Con 2', 'Con 3'],
                },
            },
        };

        const result = validatePDPContract(completeData);
        expect(result.valid).toBe(true);
        expect(result.warnings).toHaveLength(0);
    });
});
