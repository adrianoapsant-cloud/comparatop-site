# FIPE-Eletro: Prompt Universal para Geração de TCO

Use este prompt no Gemini Deep Research para gerar dados de TCO de qualquer produto.

---

## Prompt Template

```markdown
# 📊 PESQUISA TCO: [NOME DO PRODUTO]

## OBJETIVO
Gerar dados estruturados de Custo Total de Propriedade (TCO) em 5 anos para o produto especificado. O resultado deve ser um JSON válido que pode ser importado diretamente no sistema FIPE-Eletro.

## PRODUTO
- **Nome**: [NOME COMPLETO DO PRODUTO]
- **Categoria**: [CATEGORIA - ex: smartphone, pneu, geladeira, notebook]
- **ASIN Amazon** (se disponível): [ASIN]
- **EAN** (se disponível): [CÓDIGO DE BARRAS]

## DADOS A PESQUISAR

### 1. AQUISIÇÃO
- Menor preço atual no Brasil (Amazon, Mercado Livre, Magalu, etc.)
- Nome da loja com melhor preço
- URL direta do produto

### 2. ENERGIA (se aplicável)
- Consumo em kWh/mês ou Watts
- Custo mensal estimado (tarifa média R$ 0.90/kWh)
- Custo em 5 anos

### 3. CONSUMÍVEIS (se aplicável)
- Lista de itens que precisam ser substituídos regularmente
- Custo de cada item
- Frequência de troca
- Custo total em 5 anos

### 4. MANUTENÇÃO
- Componentes que tipicamente falham
- Custo de cada reparo (peça + mão de obra)
- Ano típico de falha
- Probabilidade de ocorrência (0 a 1)
- Custo esperado em 5 anos

### 5. DEPRECIAÇÃO
- Valor de revenda em 1, 2, 3 e 5 anos
- Valor residual ao final do período

### 6. VIDA ÚTIL
- Expectativa de vida em anos
- Componente limitante (o que quebra primeiro)

## FORMATO DE RESPOSTA

Retorne APENAS um JSON válido no seguinte formato (sem markdown, sem explicações):

```json
{
  "metadata": {
    "productName": "Nome Completo do Produto",
    "asin": "BXXXXXXXXX",
    "ean": "7899999999999",
    "category": "categoria-slug",
    "brand": "Marca",
    "model": "Modelo",
    "researchDate": "2026-02-03"
  },
  "acquisition": {
    "price": 2500.00,
    "retailer": "Amazon",
    "productUrl": "https://www.amazon.com.br/dp/XXXXX"
  },
  "tco": {
    "horizonYears": 5,
    "acquisition": 2500.00,
    "energy": 270.00,
    "consumables": 1250.00,
    "maintenance": 900.00,
    "residualValue": 300.00,
    "totalTco": 5120.00,
    "monthlyAverage": 85.33
  },
  "breakdown": {
    "energy": {
      "kwhPerMonth": 5.0,
      "costPerMonth": 4.50,
      "annual": 54.00,
      "description": "Consumo em standby + operação"
    },
    "consumables": [
      {
        "name": "Filtro HEPA",
        "unitCost": 40.00,
        "frequencyMonths": 6,
        "costPerYear": 80.00,
        "cost5Years": 400.00
      }
    ],
    "maintenance": [
      {
        "component": "Bateria",
        "partCost": 550.00,
        "laborCost": 0,
        "totalCost": 550.00,
        "expectedYear": 3,
        "probability": 0.8,
        "expectedCost": 440.00
      }
    ],
    "depreciation": [
      { "year": 1, "value": 1800.00 },
      { "year": 2, "value": 1200.00 },
      { "year": 3, "value": 700.00 },
      { "year": 5, "value": 300.00 }
    ]
  },
  "insights": {
    "limitingComponent": "Bateria",
    "estimatedLifespan": 5,
    "recommendation": "Troca de bateria no 3º ano pode estender vida útil."
  }
}
```

## INSTRUÇÕES IMPORTANTES

1. Use APENAS valores numéricos (não strings como "R$ 2.500,00")
2. Todos os custos devem ser em R$ (Reais brasileiros)
3. O `totalTco` deve ser calculado como: aquisição + energia + consumíveis + manutenção - valorResidual
4. Se um campo não se aplica à categoria, use 0 ou omita
5. A `probability` de manutenção é a chance de acontecer em 5 anos (0.8 = 80%)
6. O `expectedCost` de manutenção = custo × probabilidade
```

---

## Exemplos por Categoria

### Smartphone
- Energia: baixo (carregamento)
- Consumíveis: película, capinha
- Manutenção: tela, bateria
- Depreciação: alta

### Pneu
- Energia: N/A
- Consumíveis: N/A
- Manutenção: balanceamento, alinhamento
- Depreciação: desgaste por km

### Geladeira
- Energia: alta (24/7)
- Consumíveis: filtro de água (se houver)
- Manutenção: compressor, vedação, gás
- Depreciação: baixa

---

## Como Usar

1. Copie o prompt template
2. Substitua [NOME DO PRODUTO] e demais campos
3. Cole no Gemini Deep Research
4. Receba o JSON
5. Insira no sistema via `/api/tco/generate` ou diretamente no Supabase
