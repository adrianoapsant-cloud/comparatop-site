
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Carregar variáveis de ambiente localmente
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Usar service role para bypass RLS se necessário, ou anon

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateTcoData() {
    const tcoData = {
        "product": { "name": "Xiaomi Robot Vacuum X10", "brand": "Xiaomi", "model": "B102GL", "category": "robo-aspirador" },
        "acquisition": { "price": 2500, "retailer": "Amazon", "affiliateUrl": "https://www.amazon.com.br/dp/B0BW4LVTTD?tag=comparatop-20" },
        "tco": {
            "horizonYears": 5,
            "acquisition": 2500,
            "energy": 270,
            "consumables": 1250,
            "maintenance": 900,
            "residualValue": 300,
            "totalTco": 5120, // (2500+270+1250+900) - 300 = 4620?? Espere.
            // Calculo Report: R$ 5.420 NOMINAL - 300 RESIDUAL = 5.120 FINAL.
            // (2500 + 270 + 1250 + 900) = 4920 Nominal
            // + 500 Custo Oportunidade = 5420 Nominal
            // - 300 Residual = 5120.
            // O relatório inclui Custo de Oportunidade. Meu modelo de dados atual não tem campo explícito para isso na estrutura simplificada,
            // mas o "total" deve bater. Vou ajustar para incluir o custo de oportunidade no breakdown se possível ou ajustar os outros valores.
            // O relatório diz: "TCO FINAL (REAL) R$ 5.120,00".
            // Se somarmos (2500+270+1250+900) - 300 = 4620.
            // Faltam R$ 500. Isso é o Custo de Oportunidade.
            // Vou adicionar "Custo de Oportunidade" como um item de "Outros" ou somar na "Aquisição" com nota?
            // Melhor: Adicionar campo "opportunityCost" no JSON ou somar no maintenance com label "Custo Financeiro".
            // O relatório coloca separado. Vou adicionar em 'maintenance' como "Custo de Oportunidade (CDI)" para fechar a conta visual.
            "monthlyAverage": 85.33
        },
        "breakdown": {
            "energy": { "description": "Standby + Operação (4.5 kWh/mês)", "annual": 54 },
            "consumables": [
                { "name": "Sacos de Pó", "cost": 625, "frequency": "10-12 unidades/ano" },
                { "name": "Kit Filtros e Escovas", "cost": 625, "frequency": "Manutenção periódica" }
            ],
            "maintenance": [
                { "component": "Bateria Li-ion (Troca)", "cost": 550, "year": 3, "probability": 1.0 },
                { "component": "Módulo LiDAR (Reparo)", "cost": 350, "year": 4, "probability": 1.0 }
            ],
            "opportunityCost": { "description": "Rendimento perdido do capital (CDI)", "cost": 500 }
        },
        "insights": {
            "limitingComponent": "Bateria Li-ion",
            "estimatedLifespan": 5,
            "recommendation": "A bateria é o componente limitante. Considere substituição proativa no ano 3."
        }
    };

    const { data, error } = await supabase
        .from('products_tco')
        .update({ tco_data: tcoData })
        .ilike('product_name', '%Xiaomi%')
        .select();

    if (error) {
        console.error('Error updating:', error);
    } else {
        console.log('Update success:', data);
    }
}

updateTcoData();
