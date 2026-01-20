# Link Contracts

> Política de controle de links internos para garantir Zero Dead Links.

## Regra Geral

**Todo `<a href="...">` interno é obrigatório e será verificado pelo CI.**

Se um link aparecer no HTML, ele DEVE resolver para 200 (ou redirect para 200).

---

## Link Obrigatório vs Coming Soon

### ✅ Link Obrigatório
Destino existe e deve ser verificado:
```tsx
<Link href="/categorias/smart-tvs">Smart TVs</Link>
```

### 🔒 Coming Soon - SEM Link
Destino não existe ainda. **Preferir NÃO usar `<a>`**:
```tsx
// ✅ CORRETO: Usar div/span com visual de disabled
<div className="opacity-50 cursor-not-allowed">
    🔜 Em breve
</div>

// ✅ CORRETO: Usar button disabled
<button disabled className="text-muted">
    Notebooks (em breve)
</button>
```

### ⚠️ Coming Soon - Com Link (RARO)
Casos onde layout/acessibilidade exige `<a>`:
```tsx
// Marcar explicitamente para o crawler ignorar
<a
    href="#"
    data-integrity="ignore"
    aria-disabled="true"
    onClick={(e) => e.preventDefault()}
    className="cursor-not-allowed opacity-50"
>
    Smartphones (em breve)
</a>
```

---

## Marcação `data-integrity="ignore"`

| Atributo | Efeito |
|----------|--------|
| `data-integrity="ignore"` | Crawler ignora completamente |
| `aria-disabled="true"` | Crawler ignora + acessibilidade |
| Sem `href` ou `href="#"` | Não é coletado |

### Quando usar `data-integrity="ignore"`

1. ❌ **NÃO** para esconder links quebrados
2. ❌ **NÃO** para placeholders temporários
3. ✅ **SIM** para features futuras com data de lançamento
4. ✅ **SIM** para links de preview/staging

---

## Fluxo do Crawler

```
┌─────────────────────────────────────────────┐
│  Página HTML                                │
│                                             │
│  <a href="/produto/x">                      │
│  <a href="/futuro" data-integrity="ignore"> │
│  <a href="#" aria-disabled="true">          │
│  <a href="/api/...">                        │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│  Extração                                   │
│                                             │
│  ✅ /produto/x → VERIFICAR                  │
│  ⏭️ /futuro → IGNORAR (data-integrity)      │
│  ⏭️ # → IGNORAR (sem destino)               │
│  ⏭️ /api → IGNORAR (rota interna)           │
└─────────────────────────────────────────────┘
                    │
                    ▼
          Verificação HTTP
          200 → ✅ OK
          3xx → seguir até 200
          4xx/5xx → ❌ FALHA
```

---

## Exemplos de Componentes

### ClusterCard (Correto)
```tsx
// Usa <div> em vez de <Link> quando rota não existe
<div className="cursor-pointer ...">
    <span>Em breve</span>
</div>
```

### DepartmentsMenu (Correto)
```tsx
// Filtra categorias por REGISTERED_CATEGORY_SLUGS
const filteredDepartments = CATEGORY_TAXONOMY.departments
    .map(dept => ({
        ...dept,
        categories: dept.categories.filter(cat => 
            REGISTERED_CATEGORY_SLUGS.has(cat.slug)
        )
    }));
```

---

## Verificação

```bash
npm run integrity:links
```

Output esperado:
```
🔗 INTEGRITY:LINKS (Attribute-Based Contracts)
============================================================
📋 LINKS IGNORADOS POR MARCAÇÃO:
  data-integrity="ignore": 0
  aria-disabled="true": 0
  Total ignorados: 0

✅ TODOS OS LINKS OK!
```
