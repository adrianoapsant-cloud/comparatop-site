-- INSERÇÃO DE DADOS: Eufy X10 Pro Omni
-- Data do Relatório: 04/02/2026
-- Fonte: Relatório Técnico FIPE-Eletro Forense

INSERT INTO products_tco (
    asin,
    ean,
    product_name,
    category,
    brand,
    model,
    amazon_url,
    image_url,
    is_active,
    tco_data
) VALUES (
    'B0CPFBB117', -- ASIN aproximado (encontrado em listagens internacionais, placeholder se não confirmado)
    '194644186592', -- EAN aproximado
    'eufy X10 Pro Omni',
    'robo-aspirador',
    'eufy',
    'X10 Pro Omni',
    'https://www.amazon.com.br/dp/B0CPFBB117',
    'https://m.media-amazon.com/images/I/71J1x08+lSL._AC_SL1500_.jpg',
    true,
    '{
        "product": {
            "name": "eufy X10 Pro Omni",
            "brand": "eufy",
            "model": "X10 Pro Omni",
            "imageUrl": "https://m.media-amazon.com/images/I/71J1x08+lSL._AC_SL1500_.jpg",
            "category": "robo-aspirador"
        },
        "acquisition": {
            "price": 5500.00,
            "retailer": "Importação Consolidada/Revenda",
            "affiliateUrl": "https://www.amazon.com.br/s?k=eufy+x10+pro+omni"
        },
        "tco": {
            "horizonYears": 5,
            "acquisition": 5500.00,
            "energy": 918.84,
            "consumables": 5524.64,
            "maintenance": 750.00,
            "residualValue": 1305.00,
            "totalTco": 11388.48,
            "monthlyAverage": 189.80
        },
        "breakdown": {
            "energy": {
                "description": "Secagem Térmica (45°C) é o maior ofensor. 75% do consumo vem da estação base, não do robô.",
                "annual": 202.12
            },
            "consumables": [
                {
                    "name": "Kit Solução de Limpeza + Sacos (Omni)",
                    "cost": 650.00,
                    "frequency": "Anual (Recorrente)"
                },
                {
                    "name": "Peças de Desgaste (Filtros, Escovas, Mops)",
                    "cost": 454.00,
                    "frequency": "Anual (Recorrente)"
                }
            ],
            "maintenance": [
                {
                    "component": "Bateria Li-ion de Alta Densidade",
                    "cost": 350.00,
                    "year": 3,
                    "probability": 1.0
                },
                {
                    "component": "Módulo LIDAR ou Bomba D''água",
                    "cost": 400.00,
                    "year": 5,
                    "probability": 0.4
                }
            ],
            "opportunityCost": {
                "description": "Rendimento perdido (CDI Líquido ~8.5% a.a.)",
                "cost": 1500.00
            }
        },
        "insights": {
            "limitingComponent": "Disponibilidade de Peças (Placa-Mãe)",
            "estimatedLifespan": 5,
            "recommendation": "Alerta de Consumíveis: O custo de operação supera o valor do produto em 5 anos. Recomendado apenas como substituto de mão de obra humana."
        },
        "repairability": {
            "score": 4.9,
            "components": [
                {
                    "name": "Placa Principal",
                    "score": 2,
                    "price": 1200.00,
                    "availability": "scarce",
                    "repairAdvice": "Inviável reparar no Brasil sem importação direta."
                },
                {
                    "name": "Módulo LIDAR",
                    "score": 4,
                    "price": 500.00,
                    "availability": "limited",
                    "repairAdvice": "Exige desmontagem média."
                },
                {
                    "name": "Bateria",
                    "score": 8,
                    "price": 350.00,
                    "availability": "available",
                    "repairAdvice": "Fácil acesso pelo usuário."
                },
                {
                    "name": "Kit Consumíveis",
                    "score": 10,
                    "price": 1100.00,
                    "availability": "available",
                    "repairAdvice": "Alta disponibilidade, mas alto custo recorrente."
                }
            ]
        }
    }'::jsonb
);
