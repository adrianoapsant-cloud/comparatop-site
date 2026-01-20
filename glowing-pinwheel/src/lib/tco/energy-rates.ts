/**
 * Energy rates per state (R$/kWh)
 * Source: ANEEL averages 2025
 * 
 * This data would ideally come from Supabase, but we maintain
 * a client-side copy for instant calculations without network latency.
 */

export interface EnergyRate {
    stateCode: string;
    stateName: string;
    rateKwh: number;
}

export const ENERGY_RATES: Record<string, EnergyRate> = {
    'AC': { stateCode: 'AC', stateName: 'Acre', rateKwh: 0.82 },
    'AL': { stateCode: 'AL', stateName: 'Alagoas', rateKwh: 0.88 },
    'AP': { stateCode: 'AP', stateName: 'Amapá', rateKwh: 0.75 },
    'AM': { stateCode: 'AM', stateName: 'Amazonas', rateKwh: 0.90 },
    'BA': { stateCode: 'BA', stateName: 'Bahia', rateKwh: 0.86 },
    'CE': { stateCode: 'CE', stateName: 'Ceará', rateKwh: 0.84 },
    'DF': { stateCode: 'DF', stateName: 'Distrito Federal', rateKwh: 0.88 },
    'ES': { stateCode: 'ES', stateName: 'Espírito Santo', rateKwh: 0.87 },
    'GO': { stateCode: 'GO', stateName: 'Goiás', rateKwh: 0.83 },
    'MA': { stateCode: 'MA', stateName: 'Maranhão', rateKwh: 0.85 },
    'MT': { stateCode: 'MT', stateName: 'Mato Grosso', rateKwh: 0.86 },
    'MS': { stateCode: 'MS', stateName: 'Mato Grosso do Sul', rateKwh: 0.84 },
    'MG': { stateCode: 'MG', stateName: 'Minas Gerais', rateKwh: 0.89 },
    'PA': { stateCode: 'PA', stateName: 'Pará', rateKwh: 0.88 },
    'PB': { stateCode: 'PB', stateName: 'Paraíba', rateKwh: 0.87 },
    'PR': { stateCode: 'PR', stateName: 'Paraná', rateKwh: 0.85 },
    'PE': { stateCode: 'PE', stateName: 'Pernambuco', rateKwh: 0.86 },
    'PI': { stateCode: 'PI', stateName: 'Piauí', rateKwh: 0.83 },
    'RJ': { stateCode: 'RJ', stateName: 'Rio de Janeiro', rateKwh: 1.05 },
    'RN': { stateCode: 'RN', stateName: 'Rio Grande do Norte', rateKwh: 0.88 },
    'RS': { stateCode: 'RS', stateName: 'Rio Grande do Sul', rateKwh: 0.87 },
    'RO': { stateCode: 'RO', stateName: 'Rondônia', rateKwh: 0.81 },
    'RR': { stateCode: 'RR', stateName: 'Roraima', rateKwh: 0.78 },
    'SC': { stateCode: 'SC', stateName: 'Santa Catarina', rateKwh: 0.82 },
    'SP': { stateCode: 'SP', stateName: 'São Paulo', rateKwh: 0.92 },
    'SE': { stateCode: 'SE', stateName: 'Sergipe', rateKwh: 0.85 },
    'TO': { stateCode: 'TO', stateName: 'Tocantins', rateKwh: 0.84 },
};

export const DEFAULT_ENERGY_RATE = 0.85; // National average

export function getEnergyRate(stateCode: string): number {
    return ENERGY_RATES[stateCode]?.rateKwh ?? DEFAULT_ENERGY_RATE;
}

export function getStateOptions() {
    return Object.values(ENERGY_RATES).map(rate => ({
        value: rate.stateCode,
        label: `${rate.stateCode} - ${rate.stateName}`,
        rate: rate.rateKwh
    }));
}
