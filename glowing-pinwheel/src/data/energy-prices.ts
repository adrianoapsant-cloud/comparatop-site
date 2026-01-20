/**
 * Brazilian Energy Pricing by State
 * 
 * Average residential kWh prices (in BRL) by state.
 * Data based on ANEEL tariffs - Updated Jan 2026
 * 
 * Note: These are averages. Actual prices vary by distributor and consumption tier.
 */

export interface StateEnergyData {
    uf: string;
    name: string;
    kwhPrice: number; // Price per kWh in BRL
    distributor: string;
}

export const BRAZIL_ENERGY_PRICES: StateEnergyData[] = [
    // North Region
    { uf: 'AC', name: 'Acre', kwhPrice: 0.89, distributor: 'Energisa' },
    { uf: 'AM', name: 'Amazonas', kwhPrice: 0.91, distributor: 'Amazonas Energia' },
    { uf: 'AP', name: 'Amapá', kwhPrice: 0.75, distributor: 'CEA' },
    { uf: 'PA', name: 'Pará', kwhPrice: 0.87, distributor: 'Equatorial' },
    { uf: 'RO', name: 'Rondônia', kwhPrice: 0.82, distributor: 'Energisa' },
    { uf: 'RR', name: 'Roraima', kwhPrice: 0.78, distributor: 'Roraima Energia' },
    { uf: 'TO', name: 'Tocantins', kwhPrice: 0.84, distributor: 'Energisa' },

    // Northeast Region
    { uf: 'AL', name: 'Alagoas', kwhPrice: 0.85, distributor: 'Equatorial' },
    { uf: 'BA', name: 'Bahia', kwhPrice: 0.88, distributor: 'Neonergia Coelba' },
    { uf: 'CE', name: 'Ceará', kwhPrice: 0.79, distributor: 'Enel' },
    { uf: 'MA', name: 'Maranhão', kwhPrice: 0.83, distributor: 'Equatorial' },
    { uf: 'PB', name: 'Paraíba', kwhPrice: 0.86, distributor: 'Energisa' },
    { uf: 'PE', name: 'Pernambuco', kwhPrice: 0.87, distributor: 'Neoenergia' },
    { uf: 'PI', name: 'Piauí', kwhPrice: 0.81, distributor: 'Equatorial' },
    { uf: 'RN', name: 'Rio Grande do Norte', kwhPrice: 0.85, distributor: 'Neoenergia' },
    { uf: 'SE', name: 'Sergipe', kwhPrice: 0.84, distributor: 'Energisa' },

    // Midwest Region
    { uf: 'DF', name: 'Distrito Federal', kwhPrice: 0.76, distributor: 'Neoenergia' },
    { uf: 'GO', name: 'Goiás', kwhPrice: 0.79, distributor: 'Equatorial' },
    { uf: 'MT', name: 'Mato Grosso', kwhPrice: 0.82, distributor: 'Energisa' },
    { uf: 'MS', name: 'Mato Grosso do Sul', kwhPrice: 0.80, distributor: 'Energisa' },

    // Southeast Region
    { uf: 'ES', name: 'Espírito Santo', kwhPrice: 0.81, distributor: 'EDP' },
    { uf: 'MG', name: 'Minas Gerais', kwhPrice: 0.89, distributor: 'Cemig' },
    { uf: 'RJ', name: 'Rio de Janeiro', kwhPrice: 0.94, distributor: 'Enel' },
    { uf: 'SP', name: 'São Paulo', kwhPrice: 0.78, distributor: 'Enel/CPFL/Elektro' },

    // South Region
    { uf: 'PR', name: 'Paraná', kwhPrice: 0.73, distributor: 'Copel' },
    { uf: 'RS', name: 'Rio Grande do Sul', kwhPrice: 0.82, distributor: 'CEEE/RGE' },
    { uf: 'SC', name: 'Santa Catarina', kwhPrice: 0.76, distributor: 'Celesc' },
];

// Helper to get price by UF
export function getKwhPriceByState(uf: string): number {
    const state = BRAZIL_ENERGY_PRICES.find(s => s.uf === uf);
    return state?.kwhPrice ?? 0.80; // Default to national average
}

// National average
export const BRAZIL_AVERAGE_KWH = 0.82;

// Options for select inputs
export const BRAZIL_STATE_OPTIONS = BRAZIL_ENERGY_PRICES.map(state => ({
    value: state.uf,
    label: `${state.name} (R$ ${state.kwhPrice.toFixed(2)}/kWh)`,
}));
