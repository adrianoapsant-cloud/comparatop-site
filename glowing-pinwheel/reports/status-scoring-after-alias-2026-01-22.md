# Status Scoring After Alias Layer - 2026-01-22

## P18 PARTE 2: Re-Census

### 1) Alias Layer Implementada

**Arquivo**: `src/lib/scoring/hmum/configs/index.ts`

**Novos exports**:
- `HMUM_CONFIG_ALIASES: Record<string, string>` - Mapeia categoryId canônico → slug HMUM
- `getHmumConfigForCategory(categoryId)` - Resolve config via alias layer
- `hasHmumConfigForCategory(categoryId)` - Verifica existência via alias
- `getCanonicalCategoriesWithConfig()` - Lista categoryIds canônicos com config

### 2) Mapeamento Implementado

| categoryId (canônico) | slug HMUM | Config |
|-----------------------|-----------|--------|
| robot-vacuum | robo-aspirador | ✅ |
| tv | smart-tv | ✅ |
| fridge | geladeira | ✅ |
| air_conditioner | ar-condicionado | ✅ |
| washer | lavadora | ✅ |
| laptop | notebook | ✅ |
| espresso | cafeteira | ✅ |
| tws | fone-ouvido | ✅ (temp) |
| monitor | monitor | ✅ |
| smartphone | smartphone | ✅ |

**Total de categoryIds canônicos com HMUM config: 10**

### 3) Contagens

| Métrica | Valor |
|---------|-------|
| Total categoryIds (RAW_CATEGORIES) | **53** |
| CategoryIds com HMUM via alias | **10** |
| **missing_scoring_configs** | **43** |

### 4) Lista de missing_scoring_configs (43 categorias)

```json
[
  "tablet",
  "soundbar",
  "headset_gamer",
  "bluetooth_speaker",
  "console",
  "gamepad",
  "chair",
  "keyboard",
  "cpu",
  "gpu",
  "ram",
  "motherboard",
  "ssd",
  "psu",
  "case",
  "projector",
  "tvbox",
  "smartwatch",
  "stick_vacuum",
  "fan",
  "security_camera",
  "smart_lock",
  "router",
  "freezer",
  "minibar",
  "wine_cooler",
  "ups",
  "power_strip",
  "washer_dryer",
  "dishwasher",
  "microwave",
  "stove",
  "air_fryer",
  "mixer",
  "water_purifier",
  "range_hood",
  "builtin_oven",
  "printer",
  "camera",
  "tire",
  "car_battery",
  "pressure_washer",
  "drill"
]
```

### 5) Build Gate

```
npm run build
Exit code: 0
✓ PASS
```

**Últimas linhas do build**:
```
├ ○ /metodologia/hmum
├ ○ /metodologia/sic
├ ○ /politica-independencia
├ ○ /privacidade
├ ƒ /produto/[slug]
├ ○ /robots.txt
├ ○ /sitemap.xml
├ ○ /termos
├ ○ /test-tco
└ ● /vs/[slugs]
  ├ /vs/lg-c3-65-vs-samsung-qn90c-65
  ├ /vs/samsung-qn90c-65-vs-tcl-c735-65
  └ /vs/lg-c3-65-vs-tcl-c735-65

ƒ Proxy (Middleware)

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
Exit code: 0
```

---

## Próximo: PARTE 3 - Batch 01 (3 categorias)

Categorias a converter:
1. washer_dryer
2. stove
3. microwave
