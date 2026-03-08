
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
// Try to use service role key if available for writing, otherwise fallback to anon (might fail if RLS blocks insert)
// But usually for admin scripts we want service role.
// Let's check if we have a service role key in env, usually SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const tcoData = {
    product: {
        name: "eufy X10 Pro Omni",
        brand: "eufy",
        model: "X10 Pro Omni",
        imageUrl: "https://m.media-amazon.com/images/I/71J1x08+lSL._AC_SL1500_.jpg",
        category: "robo-aspirador"
    },
    acquisition: {
        price: 5500.00,
        retailer: "Importação Consolidada/Revenda",
        affiliateUrl: "https://www.amazon.com.br/s?k=eufy+x10+pro+omni"
    },
    tco: {
        horizonYears: 5,
        acquisition: 5500.00,
        energy: 918.84,
        consumables: 5524.64,
        maintenance: 750.00,
        residualValue: 1305.00,
        totalTco: 11388.48,
        monthlyAverage: 189.80
    },
    breakdown: {
        energy: {
            description: "Secagem Térmica (45°C) é o maior ofensor. 75% do consumo vem da estação base, não do robô.",
            annual: 202.12
        },
        consumables: [
            {
                name: "Kit Solução de Limpeza + Sacos (Omni)",
                cost: 650.00,
                frequency: "Anual (Recorrente)"
            },
            {
                name: "Peças de Desgaste (Filtros, Escovas, Mops)",
                cost: 454.00,
                frequency: "Anual (Recorrente)"
            }
        ],
        maintenance: [
            {
                component: "Bateria Li-ion de Alta Densidade",
                cost: 350.00,
                year: 3,
                probability: 1.0
            },
            {
                component: "Módulo LIDAR ou Bomba D'água",
                cost: 400.00,
                year: 5,
                probability: 0.4
            }
        ],
        opportunityCost: {
            description: "Rendimento perdido (CDI Líquido ~8.5% a.a.)",
            cost: 1500.00
        }
    },
    insights: {
        limitingComponent: "Disponibilidade de Peças (Placa-Mãe)",
        estimatedLifespan: 5,
        recommendation: "Alerta de Consumíveis: O custo de operação supera o valor do produto em 5 anos. Recomendado apenas como substituto de mão de obra humana."
    },
    repairability: {
        score: 4.9,
        components: [
            {
                name: "Placa Principal",
                score: 2,
                price: 1200.00,
                availability: "scarce",
                repairAdvice: "Inviável reparar no Brasil sem importação direta."
            },
            {
                name: "Módulo LIDAR",
                score: 4,
                price: 500.00,
                availability: "limited",
                repairAdvice: "Exige desmontagem média."
            },
            {
                name: "Bateria",
                score: 8,
                price: 350.00,
                availability: "available",
                repairAdvice: "Fácil acesso pelo usuário."
            },
            {
                name: "Kit Consumíveis",
                score: 10,
                price: 1100.00,
                availability: "available",
                repairAdvice: "Alta disponibilidade, mas alto custo recorrente."
            }
        ]
    }
};

async function run() {
    console.log('Inserting Eufy X10 Pro Omni...');

    // First delete if exists to avoid dupes/errors
    await supabase.from('products_tco').delete().eq('asin', 'B0CPFBB117');

    const { data, error } = await supabase
        .from('products_tco')
        .insert({
            asin: 'B0CPFBB117',
            ean: '194644186592',
            product_name: 'eufy X10 Pro Omni',
            category: 'robo-aspirador',
            brand: 'eufy',
            model: 'X10 Pro Omni',
            amazon_url: 'https://www.amazon.com.br/dp/B0CPFBB117',
            image_url: 'https://m.media-amazon.com/images/I/71J1x08+lSL._AC_SL1500_.jpg',
            is_active: true,
            tco_data: tcoData
        })
        .select();

    if (error) {
        console.error('Insert Failed:', error);
    } else {
        console.log('Insert Success:', data);
    }
}

run();
