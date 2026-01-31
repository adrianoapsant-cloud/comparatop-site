# P19 - HMUM 54 vs 53 Reconciliação
**Data:** 2026-01-22 22:38  
**Status:** ✅ RESOLVIDO

---

## Diagnóstico

| Métrica | Antes (relatório) | Depois (código real) |
|---------|-------------------|----------------------|
| RAW_CATEGORIES | "54" (erro) | **53** (correto) |
| validate:hmum | 53/53 | 53/53 |

### Causa Raiz

A discrepância "54 vs 53" era um **erro de contagem nos relatórios P18**, não no código. A contagem real de `RAW_CATEGORIES` em `src/data/categories.ts` sempre foi **53 categoryIds**.

---

## Lista Canônica (53 categoryIds)

```
tv, fridge, laptop, smartphone, air_conditioner, washer, monitor, tablet,
soundbar, tws, headset_gamer, bluetooth_speaker, console, gamepad, chair,
keyboard, cpu, gpu, ram, motherboard, ssd, psu, case, projector, tvbox,
smartwatch, robot-vacuum, stick_vacuum, fan, security_camera, smart_lock,
router, freezer, minibar, wine_cooler, ups, power_strip, washer_dryer,
dishwasher, microwave, stove, air_fryer, espresso, mixer, water_purifier,
range_hood, builtin_oven, printer, camera, tire, car_battery, pressure_washer, drill
```

---

## Mapeamento CategoryId → Config HMUM

| CategoryId | Resolução | Config |
|------------|-----------|--------|
| `tv` | alias | `smart-tv` |
| `fridge` | alias | `geladeira` |
| `laptop` | alias | `notebook` |
| `air_conditioner` | alias | `ar-condicionado` |
| `washer` | alias | `lavadora` |
| `robot-vacuum` | alias | `robo-aspirador` |
| `monitor` | direto | `monitor` |
| `smartphone` | direto | `smartphone` |
| (outros 45) | direto | `{categoryId}` |

---

## Aliases Ativos (8)

| Canonical → Legacy Slug |
|-------------------------|
| `robot-vacuum` → `robo-aspirador` |
| `tv` → `smart-tv` |
| `fridge` → `geladeira` |
| `air_conditioner` → `ar-condicionado` |
| `washer` → `lavadora` |
| `laptop` → `notebook` |
| `monitor` → `monitor` |
| `smartphone` → `smartphone` |

---

## Gaps

| Gap | Status |
|-----|--------|
| Missing configs | 0 |
| Extra configs | 0 |
| Redundant aliases | 0 |

---

## Gates

### `npm run build`
```
✅ PASSED (exit 0)
```

### `npx tsx scripts/validate-hmum-coverage.ts`
```
📊 RAW_CATEGORIES: 53 categoryIds
  Total categoryIds:     53
  Configs found:         53
  Missing/Invalid:       0
  Aliases:               8
  Redundant aliases:     0

✅ ALL VALIDATIONS PASSED!
```

---

## Abordagem Adotada

**Abordagem A** — O validator deriva diretamente de `getAllCategoryIds()` (que vem do SSOT `RAW_CATEGORIES`), validando **53/53** categorias.

Não há exclusões. A discrepância era apenas um erro de documentação.

---

## Conclusão

**✅ 100% coberto por categoryId canônico.** Não existem gaps nem inconsistências entre SSOT e validator.
