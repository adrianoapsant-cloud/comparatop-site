# Inventário de Categorias ComparaTop

## Resumo Executivo

| Métrica | Status |
|---------|--------|
| **Total de Categorias** | 54 |
| **10 Dores (Scoring)** | 11 implementados em TypeScript / 54 definidos em TXT |
| **5 Unknown Unknowns** | 54 implementados em TypeScript ✅ |

---

## Legenda

| Símbolo | Significado |
|---------|-------------|
| ✅ | Implementado em TypeScript |
| 📋 | Definido em TXT (aguardando implementação) |
| ❌ | Não existe / Não disponível |

---

## Tabela de Inventário por Categoria

| # | Categoria | 10 Dores (Scoring) | 5 Unknown Unknowns |
|---|-----------|-------------------|-------------------|
| 1 | Smart TV | ✅ `smart-tv.ts` | ✅ |
| 2 | Smartphone | ✅ `smartphone.ts` | ✅ |
| 3 | Refrigerador | ✅ `geladeira.ts` | ✅ |
| 4 | Notebook | ✅ `notebook.ts` | ✅ |
| 5 | Ar-Condicionado | ✅ `ar-condicionado.ts` | ✅ |
| 6 | Lavadora | ✅ `lavadora.ts` | ✅ |
| 7 | Robô Aspirador | ✅ `robo-aspirador.ts` | ✅ |
| 8 | Monitor | ✅ `monitor.ts` | ✅ |
| 9 | Cafeteira | ✅ `cafeteira.ts` | ✅ |
| 10 | Fone de Ouvido | ✅ `fone-ouvido.ts` | ✅ |
| 11 | Lava e Seca | 📋 TXT | ✅ |
| 12 | Fogão/Cooktop | 📋 TXT | ✅ |
| 13 | Micro-ondas | 📋 TXT | ✅ |
| 14 | Freezer | 📋 TXT | ✅ |
| 15 | Lava-Louças | 📋 TXT | ✅ |
| 16 | Console | 📋 TXT | ✅ |
| 17 | Soundbar | 📋 TXT | ✅ |
| 18 | Fones TWS | 📋 TXT | ✅ |
| 19 | Headset Gamer | 📋 TXT | ✅ |
| 20 | Caixa Bluetooth | 📋 TXT | ✅ |
| 21 | Tablet | 📋 TXT | ✅ |
| 22 | Smartwatch | 📋 TXT | ✅ |
| 23 | Roteador | 📋 TXT | ✅ |
| 24 | Impressora | 📋 TXT | ✅ |
| 25 | Nobreak | 📋 TXT | ✅ |
| 26 | SSD | 📋 TXT | ✅ |
| 27 | Câmera Digital | 📋 TXT | ✅ |
| 28 | Câmera de Segurança | 📋 TXT | ✅ |
| 29 | Fechadura Digital | 📋 TXT | ✅ |
| 30 | Adega | 📋 TXT | ✅ |
| 31 | Purificador de Água | 📋 TXT | ✅ |
| 32 | Coifa/Depurador | 📋 TXT | ✅ |
| 33 | Air Fryer | 📋 TXT | ✅ |
| 34 | Projetor | 📋 TXT | ✅ |
| 35 | GPU | 📋 TXT | ✅ |
| 36 | CPU | 📋 TXT | ✅ |
| 37 | RAM | 📋 TXT | ✅ |
| 38 | Fonte PSU | 📋 TXT | ✅ |
| 39 | Placa-Mãe | 📋 TXT | ✅ |
| 40 | Gabinete | 📋 TXT | ✅ |
| 41 | Teclado | 📋 TXT | ✅ |
| 42 | Controle Gamer | 📋 TXT | ✅ |
| 43 | Cadeira Gamer | 📋 TXT | ✅ |
| 44 | Filtro de Linha | 📋 TXT | ✅ |
| 45 | TV Box | 📋 TXT | ✅ |
| 46 | Aspirador Vertical | 📋 TXT | ✅ |
| 47 | Forno de Embutir | 📋 TXT | ✅ |
| 48 | Batedeira | 📋 TXT | ✅ |
| 49 | Lavadora de Pressão | 📋 TXT | ✅ |
| 50 | Frigobar | 📋 TXT | ✅ |
| 51 | Furadeira | 📋 TXT | ✅ |
| 52 | Pneu | 📋 TXT | ✅ |
| 53 | Bateria Automotiva | 📋 TXT | ✅ |
| 54 | Cafeteira Espresso | 📋 TXT | ✅ |

---

## Próximos Passos

### 10 Dores - Pendente de Conversão TXT → TypeScript
- **43 categorias** têm as tabelas definidas no `10 dores.txt` mas **não** implementadas em código TypeScript
- Localização: `src/lib/scoring/hmum/configs/`
- Exemplo de estrutura já implementada: `robo-aspirador.ts`, `smart-tv.ts`

### 5 Unknown Unknowns - ✅ Completo
- **54 categorias** implementadas em `src/data/unknown-unknowns-data.ts`
- ~270 itens totais (54 categorias × 5 itens cada)
- Priorização por severidade: CRITICAL > WARNING > INFO

---

## Arquivos de Referência

| Arquivo | Descrição |
|---------|-----------|
| `10 dores.txt` | Definições de scoring em formato Markdown |
| `src/lib/scoring/hmum/configs/*.ts` | 11 configs implementados |
| `src/data/unknown-unknowns-data.ts` | 54 categorias de Unknown Unknowns |
