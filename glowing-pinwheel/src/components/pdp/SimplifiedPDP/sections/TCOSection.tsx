'use client';

/**
 * SimplifiedPDP - TCO Section
 * Renderiza Custo Total de Propriedade (5 anos)
 */

import React from 'react';
import { PDPDataContract } from '../hooks/usePDPData';

interface TCOSectionProps {
    data: PDPDataContract;
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

export function TCOSection({ data }: TCOSectionProps) {
    const { tco } = data;

    if (!tco || tco.totalCost5y <= 0) {
        if (process.env.NODE_ENV === 'development') {
            console.debug('[TCOSection] Hidden: no valid TCO for', data.product.id);
        }
        return null;
    }

    return (
        <section className="pdp-tco py-8 border-t">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
                💰 Custo Real de Propriedade (5 anos)
            </h2>

            {/* TCO Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Purchase Price */}
                <div className="bg-white rounded-lg p-4 border shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Preço de Compra</p>
                    <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(tco.purchasePrice)}
                    </p>
                </div>

                {/* Maintenance */}
                <div className="bg-white rounded-lg p-4 border shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Manutenção (5 anos)</p>
                    <p className="text-xl font-bold text-amber-600">
                        + {formatCurrency(tco.maintenanceCost5y)}
                    </p>
                </div>

                {/* Total Cost */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 shadow-sm">
                    <p className="text-sm text-blue-600 mb-1">Custo Total</p>
                    <p className="text-xl font-bold text-blue-700">
                        {formatCurrency(tco.totalCost5y)}
                    </p>
                </div>

                {/* Monthly Reserve */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-200 shadow-sm">
                    <p className="text-sm text-green-600 mb-1">⚡ Guarde/mês</p>
                    <p className="text-xl font-bold text-green-700">
                        {formatCurrency(tco.monthlyReserve)}
                    </p>
                </div>
            </div>

            {/* Explanation */}
            {tco.explanation && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                    {tco.explanation.limitingComponent && (
                        <p>
                            <strong>Componente limitante:</strong> {tco.explanation.limitingComponent}
                        </p>
                    )}
                    {tco.explanation.estimatedLifeYears && (
                        <p>
                            <strong>Vida útil estimada:</strong> {tco.explanation.estimatedLifeYears} anos
                        </p>
                    )}
                </div>
            )}
        </section>
    );
}

export default TCOSection;
