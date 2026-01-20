# Protocolo Versus 1x1 - Ativação do pSEO Completo

## 📦 Arquivos Criados

| Arquivo | Descrição |
|---------|-----------|
| `src/lib/nlg-engine.ts` | Motor de narrativa baseado nos 10 pontos de dor |
| `src/components/VersusComponents.tsx` | Componentes visuais (tabela de dores, specs, veredito) |
| `src/app/comparar/[slug]/page.tsx` | Rota de comparação com exemplos hardcoded |

## ⚙️ Estado Atual (Desenvolvimento)

Atualmente o sistema está configurado com **apenas 3 páginas de exemplo** para não impactar a performance em dev:

- `/comparar/samsung-qn90c-65-vs-lg-c3-65`
- `/comparar/samsung-rf23-family-hub-vs-consul-crm50-410`
- `/comparar/lg-c3-65-vs-tcl-c735-65`

## 🚀 Como Ativar o Sistema Completo

### Passo 1: Atualizar `generateStaticParams`

No arquivo `src/app/comparar/[slug]/page.tsx`, substitua a função `generateStaticParams`:

```typescript
export function generateStaticParams() {
    // Gerar todas as combinações possíveis
    const params: { slug: string }[] = [];
    
    for (const productA of products) {
        for (const productB of products) {
            // Evitar comparar consigo mesmo
            if (productA.id === productB.id) continue;
            
            // Apenas comparar produtos da mesma categoria
            if (productA.categoryId !== productB.categoryId) continue;
            
            // Evitar duplicatas (A vs B = B vs A)
            if (productA.id > productB.id) continue;
            
            params.push({
                slug: `${productA.id}-vs-${productB.id}`,
            });
        }
    }
    
    return params;
}
```

### Passo 2: Rodar o Build de Produção

```bash
npm run build
```

Isso vai gerar todas as páginas estáticas de uma vez.

### Passo 3: Verificar Geração

O build vai mostrar quantas páginas foram geradas:

```
✓ Generating static pages (X/Y)
```

## 📊 Estimativa de Páginas

| Produtos por Categoria | Combinações Versus |
|-----------------------|-------------------|
| 3 TVs | 3 páginas |
| 3 Geladeiras | 3 páginas |
| 2 ACs | 1 página |
| **Total** | **7 páginas** |

Quando escalar para 20 produtos por categoria:
- 20 × 19 / 2 = **190 páginas por categoria**

## 🔧 Adicionando Novos Produtos

1. Adicione o produto em `src/data/products.ts`
2. Preencha os campos `scores` (c1-c10) e `attributes`
3. Rode `npm run build` para gerar as novas páginas

## 📝 Campos Obrigatórios por Produto

```typescript
{
    id: 'produto-slug',
    categoryId: 'tv' | 'fridge' | 'air_conditioner',
    name: 'Nome Completo',
    shortName: 'Nome Curto',
    brand: 'Marca',
    price: 1999,
    scores: {
        c1: 8.5, // Custo-Benefício
        c2: 9.0, // Processamento/Eficiência
        c3: 8.0, // Confiabilidade/Capacidade
        c4: 8.5, // Sistema/Refrigeração
        c5: 9.5, // Gaming/Silêncio
        c6: 9.0, // Brilho/Ruído
        c7: 8.0, // Pós-Venda
        c8: 7.5, // Som/Smart
        c9: 9.0, // Conectividade
        c10: 8.5, // Design
    },
    specs: { ... },
    attributes: { ... },
}
```

## ⚠️ Considerações de Performance

- **Em DEV**: Cada página é compilada sob demanda (pode demorar)
- **Em PRODUÇÃO**: Todas as páginas são estáticas (muito rápido)
- **Recomendação**: Use o sistema completo apenas em builds de produção

---

*Última atualização: 2026-01-06*
