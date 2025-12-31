---
description: Como adicionar imagens de novos produtos com SEO otimizado
---

# Workflow: Adicionar Imagens de Produto com SEO

## Passo 1: Preparar Imagens
1. Crie pasta: `tools/input_images/{produto_slug}/`
   - Exemplo: `tools/input_images/tf55/`
2. Coloque todas as imagens brutas nessa pasta

## Passo 2: Primeira Execução (Cria Template)
```bash
python tools/image_seo_optimizer.py {produto_slug} {marca} "{modelo}"
```
Exemplo:
```bash
python tools/image_seo_optimizer.py tf55 Electrolux "TF55 431L"
```

Isso cria um arquivo `image_mapping.json` na pasta de input.

## Passo 3: Editar Mapeamento
Abra `tools/input_images/{produto}/image_mapping.json` e defina o tipo de cada imagem:

```json
{
  "Image-0.jpg": { "type": "frontal", "description": "" },
  "Image-1.jpg": { "type": "aberta", "description": "" },
  "Image-2.jpg": { "type": "freezer", "description": "" }
}
```

### Tipos Disponíveis:
- `frontal` - Visão frontal fechada
- `aberta` - Porta aberta mostrando interior
- `freezer` - Detalhe do freezer/congelador
- `prateleiras` - Prateleiras internas
- `gaveta` - Gaveta de legumes/verduras
- `porta` - Compartimentos na porta
- `painel` - Painel de controle/display
- `dimensoes` - Diagrama de dimensões
- `lateral` - Visão lateral
- `traseira` - Visão traseira
- `detalhe` - Detalhe de acabamento
- `selo` - Selo Procel

## Passo 4: Segunda Execução (Processa)
// turbo
```bash
python tools/image_seo_optimizer.py {produto_slug} {marca} "{modelo}"
```

Resultado:
- ✅ Imagens renomeadas com SEO
- ✅ Copiadas para `dist/assets/images/products/`
- ✅ Arquivo `images.json` com alt texts
- ✅ Snippet JSON para copiar no produto

## Passo 5: Atualizar JSON do Produto
Copie o snippet gerado para o arquivo JSON do produto em `data/`.
