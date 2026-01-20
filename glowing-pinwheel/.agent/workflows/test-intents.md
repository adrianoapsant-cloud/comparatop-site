---
description: Rodar testes de regressão de intent detection
---

# Test Intent Detection

Testa se o regex de detecção de intents está funcionando corretamente.

## Passos

// turbo
1. Rodar os smoke tests:
```powershell
cd "C:\Users\Adriano Antonio\Desktop\Projeto_ComparaTop_Oficial\glowing-pinwheel\roundtrips-v6-poc"
npx tsx scripts/intent-smoke.ts
```

## Resultado Esperado

- 12 testes devem passar
- Exit code 0

## Casos Cobertos

- Consumo: "quanto gastam por mês?", "kWh/mês", etc.
- Manual: "tem manual?", "PDF", "ficha técnica"
- Multi-intent: "tem manual? quais TVs vocês têm?"
- Catálogo: "quais TVs", "mostra geladeiras"
- Comparação: "compare as 2 melhores"
