---
description: Pesquisar produto seguindo metodologia Brasil Primeiro padronizada
---

# Workflow: Pesquisa de Produto Padronizada

// turbo-all

## Pré-requisitos
- Nome do produto a pesquisar
- Categoria (TV, Geladeira, Notebook, etc.)
- Critérios da categoria definidos em criteria.json

## Etapas

### 1. Pesquisa Web - Fontes Técnicas
```
Buscar: "[modelo] RTINGS" OR "[modelo] NotebookCheck"
Extrair: specs, medições, notas técnicas
```

### 2. Pesquisa Web - Reviews BR
```
Buscar: "[modelo] review TechTudo Canaltech Tecnoblog Brasil"
Extrair: pontos positivos, negativos, veredicto
```

### 3. Pesquisa Web - Experiência Real BR
```
Buscar: "[modelo] YouTube Brasil 1 ano depois problemas defeitos"
Extrair: relatos de donos, red flags, green flags
```

### 4. Pesquisa Web - Pós-Venda BR
```
Buscar: "[marca] Reclame Aqui nota atendimento RA1000 Brasil"
Extrair: nota RA, selo RA1000, índice de resolução
```

### 5. Criar Documento de Pesquisa
Salvar em: Desktop/PESQUISA_[MODELO].md

Formato:
- Fontes utilizadas (por camada)
- Pontos positivos (com fontes)
- Pontos de atenção (com frequência)
- Notas calibradas (antes/depois)
- scoreReasons (tom equilibrado)
- Conclusão editorial

### 6. Atualizar products.ts
- Importar notas calibradas
- Adicionar scoreReasons
- Atualizar lastUpdated

## REGRA DE CONFIDENCIALIDADE

⚠️ PODE usar fontes de concorrentes afiliados para pesquisa
❌ NÃO citar nomes de concorrentes no site público

Exemplo:
- ❌ "Segundo o canal TechReview..."
- ✅ "Reviews de usuários brasileiros indicam..."

## Output Esperado
- PESQUISA_[MODELO].md no Desktop
- products.ts atualizado
- scoreReasons com fontes BR (sem citar concorrentes)
