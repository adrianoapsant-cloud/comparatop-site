# 📋 Guia: Como Adicionar/Editar Produtos no ComparaTop

## 📁 Arquivo Principal
Todos os produtos ficam em: `data/catalogs/geladeira.json`

---

## 🆕 Adicionar Novo Produto

Copie o template abaixo e cole dentro de `"products": { ... }`:

```json
"modelo-slug": {
    "id": "modelo-slug",
    "brand": "Brastemp",
    "model": "BRM44HB",
    "name": "Geladeira Brastemp Frost Free 375L Inox",
    "imageUrl": "https://seu-link-da-imagem.com/foto.webp",
    
    "specs": {
        "capacidade_total": 375,
        "capacidade_freezer": 83,
        "tipo": "Frost Free",
        "voltagem": "220V",
        "largura_cm": 60,
        "altura_cm": 170,
        "profundidade_cm": 67,
        "consumo_kwh": 39,
        "peso_kg": 68
    },
    
    "editorialScores": {
        "durabilidade": 8.5,
        "capacidade_interna": 7.0,
        "eficiencia_energetica": 8.0,
        "ruido": 6.5,
        "congelamento": 7.5,
        "organizacao_interna": 8.0,
        "custo_beneficio": 7.0,
        "design": 8.5,
        "tecnologia": 7.0,
        "pos_venda": 6.0
    },
    
    "offers": [
        {
            "retailerName": "Amazon",
            "price": 3299.00,
            "url": "https://amzn.to/SEU_LINK_AFILIADO"
        },
        {
            "retailerName": "Magazine Luiza",
            "price": 3499.00,
            "url": "https://www.magazinevoce.com.br/...?partner_id=comparatop"
        }
    ],
    
    "voc": {
        "sentimentClass": "positive",
        "oneLiner": "Geladeira espaçosa com bom acabamento, mas consumo acima da média.",
        "summary30s": "A BRM44HB agrada pela capacidade interna e design moderno. Pontos fortes: prateleiras ajustáveis e freezer amplo. Pontos de atenção: ruído noturno e consumo de energia.",
        "pros": [
            {"topic": "Capacidade", "detail": "Freezer amplo e gavetas bem dimensionadas", "mentions": 245},
            {"topic": "Design", "detail": "Acabamento inox de qualidade", "mentions": 180}
        ],
        "cons": [
            {"topic": "Ruído", "detail": "Motor ruidoso durante a noite", "mentions": 89},
            {"topic": "Consumo", "detail": "Conta de luz aumentou 15%", "mentions": 67}
        ],
        "sources": [
            {"name": "Amazon", "url": "https://amzn.to/...", "count": 1500},
            {"name": "Reclame Aqui", "url": "https://...", "count": 342}
        ],
        "sample": {"totalApprox": 2500}
    }
}
```

---

## 🔗 Atualizar Link de Afiliado

1. Abra `data/catalogs/geladeira.json`
2. Encontre o produto pelo `"model":`
3. Localize a seção `"offers"`
4. Edite o campo `"url":`

**Exemplo:**
```json
"offers": [
    {
        "retailerName": "Amazon",
        "price": 3299.00,
        "url": "https://amzn.to/SEU_NOVO_LINK"  // ← Edite aqui
    }
]
```

---

## 🖼️ Adicionar Imagens

### Opção 1: GitHub (Grátis)
1. Faça upload da imagem no repositório
2. Clique com botão direito → "Copiar endereço da imagem"
3. Cole no campo `"imageUrl"`

### Opção 2: Cloudinary (Recomendado)
1. Crie conta grátis em cloudinary.com
2. Upload da imagem
3. Copie a URL e cole no JSON

**Formato recomendado:** WebP, 800x800px

---

## ⭐ Atualizar Notas Editoriais

As notas vão de **0 a 10**. Edite em `"editorialScores"`:

```json
"editorialScores": {
    "durabilidade": 8.5,      // Vida útil do produto
    "capacidade_interna": 7.0, // Espaço interno
    "eficiencia_energetica": 8.0, // Consumo de energia
    "ruido": 6.5,             // Quanto maior, mais silencioso
    "congelamento": 7.5,      // Velocidade de congelar
    "organizacao_interna": 8.0, // Prateleiras e gavetas
    "custo_beneficio": 7.0,   // Preço vs qualidade
    "design": 8.5,            // Aparência
    "tecnologia": 7.0,        // Recursos smart
    "pos_venda": 6.0          // Assistência técnica
}
```

---

## 💬 Atualizar VoC (Voz do Cliente)

| Campo | O que colocar |
|-------|---------------|
| `sentimentClass` | `"positive"`, `"negative"` ou `"mixed"` |
| `oneLiner` | Resumo de 1 frase |
| `summary30s` | Resumo em 2-3 frases |
| `pros` | Lista de pontos positivos |
| `cons` | Lista de pontos negativos |

---

## ✅ Checklist Antes de Publicar

- [ ] ID único (sem espaços, use hífen)
- [ ] Imagem com URL válida
- [ ] Pelo menos 1 oferta com link
- [ ] Notas de 0 a 10
- [ ] JSON válido (use jsonlint.com para verificar)

---

## 🆘 Precisa de Ajuda?

Me envie:
- Nome do produto
- Links de reviews (Amazon, Reclame Aqui, etc.)
- Links de afiliados

E eu atualizo para você!
