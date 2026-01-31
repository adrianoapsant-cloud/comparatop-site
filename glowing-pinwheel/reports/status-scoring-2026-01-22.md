# Status Scoring ComparaTop - 2026-01-22

## 1) Fonte Canônica de Categorias

### Arquivo
- **Path**: `src/data/categories.ts`
- **Export**: `RAW_CATEGORIES` → `CATEGORIES` (via `applyPlaybooksToCategories`)

### Contagem
- **Total: 53 categoryIds**

### Lista Completa de categoryIds

| # | categoryId | Const Name |
|---|------------|------------|
| 1 | tv | TV_CATEGORY |
| 2 | fridge | FRIDGE_CATEGORY |
| 3 | laptop | LAPTOP_CATEGORY |
| 4 | smartphone | SMARTPHONE_CATEGORY |
| 5 | air_conditioner | AC_CATEGORY |
| 6 | washer | WASHER_CATEGORY |
| 7 | monitor | MONITOR_CATEGORY |
| 8 | tablet | TABLET_CATEGORY |
| 9 | soundbar | SOUNDBAR_CATEGORY |
| 10 | tws | TWS_CATEGORY |
| 11 | headset_gamer | HEADSET_CATEGORY |
| 12 | bluetooth_speaker | BLUETOOTH_SPEAKER_CATEGORY |
| 13 | console | CONSOLE_CATEGORY |
| 14 | gamepad | GAMEPAD_CATEGORY |
| 15 | chair | CHAIR_CATEGORY |
| 16 | keyboard | KEYBOARD_CATEGORY |
| 17 | cpu | CPU_CATEGORY |
| 18 | gpu | GPU_CATEGORY |
| 19 | ram | RAM_CATEGORY |
| 20 | motherboard | MOTHERBOARD_CATEGORY |
| 21 | ssd | SSD_CATEGORY |
| 22 | psu | PSU_CATEGORY |
| 23 | case | CASE_CATEGORY |
| 24 | projector | PROJECTOR_CATEGORY |
| 25 | tvbox | TVBOX_CATEGORY |
| 26 | smartwatch | SMARTWATCH_CATEGORY |
| 27 | robot-vacuum | ROBOT_VACUUM_CATEGORY |
| 28 | stick_vacuum | STICK_VACUUM_CATEGORY |
| 29 | fan | FAN_CATEGORY |
| 30 | security_camera | SECURITY_CAMERA_CATEGORY |
| 31 | smart_lock | SMART_LOCK_CATEGORY |
| 32 | router | ROUTER_CATEGORY |
| 33 | freezer | FREEZER_CATEGORY |
| 34 | minibar | MINIBAR_CATEGORY |
| 35 | wine_cooler | WINE_COOLER_CATEGORY |
| 36 | ups | UPS_CATEGORY |
| 37 | power_strip | POWER_STRIP_CATEGORY |
| 38 | washer_dryer | WASHER_DRYER_CATEGORY |
| 39 | dishwasher | DISHWASHER_CATEGORY |
| 40 | microwave | MICROWAVE_CATEGORY |
| 41 | stove | STOVE_CATEGORY |
| 42 | air_fryer | AIR_FRYER_CATEGORY |
| 43 | espresso | ESPRESSO_CATEGORY |
| 44 | mixer | MIXER_CATEGORY |
| 45 | water_purifier | WATER_PURIFIER_CATEGORY |
| 46 | range_hood | RANGE_HOOD_CATEGORY |
| 47 | builtin_oven | BUILTIN_OVEN_CATEGORY |
| 48 | printer | PRINTER_CATEGORY |
| 49 | camera | CAMERA_CATEGORY |
| 50 | tire | TIRE_CATEGORY |
| 51 | car_battery | CAR_BATTERY_CATEGORY |
| 52 | pressure_washer | PRESSURE_WASHER_CATEGORY |
| 53 | drill | DRILL_CATEGORY |

> **ATENÇÃO**: Total é 53, não 54. `coffee_maker` não existe em RAW_CATEGORIES.

---

## 2) Unknown Unknowns

### Arquivo Canônico
- **Path**: `src/data/unknown-unknowns-data.ts`
- **Total de linhas**: 3808

### Contagem de Constantes UU
- **Total: 53 constantes** (padrão `const *_UNKNOWN_UNKNOWNS`)

### Confirmação Específica

| categoryId | Itens | Verificação |
|------------|-------|-------------|
| **smartwatch** | 5 | ✅ Linha 1107: `categoryId: 'smartwatch'` |
| **teclado / keyboard** | 5 | ✅ Registry alias `'teclado': KEYBOARD_UNKNOWN_UNKNOWNS` |

### Observação
- Registry tem ~150 aliases mapeando para 53 constantes
- Existe `TWS` e `TWS_EARBUDS` como constantes separadas (possível redundância)

---

## 3) 10 Dores / HMUM Configs

### Diretório
- **Path**: `src/lib/scoring/hmum/configs/`

### Arquivos Existentes (11 arquivos, 10 configs)
| Arquivo | Tipo |
|---------|------|
| `ar-condicionado.ts` | Config |
| `cafeteira.ts` | Config |
| `fone-ouvido.ts` | Config |
| `geladeira.ts` | Config |
| `index.ts` | Registry (não conta) |
| `lavadora.ts` | Config |
| `monitor.ts` | Config |
| `notebook.ts` | Config |
| `robo-aspirador.ts` | Config |
| `smart-tv.ts` | Config |
| `smartphone.ts` | Config |

### Registry HMUM_CONFIGS (index.ts)
```typescript
'smart-tv', 'monitor', 'fone-ouvido',
'geladeira', 'ar-condicionado', 'lavadora', 'cafeteira',
'robo-aspirador', 'notebook', 'smartphone'
```
**Total: 10 entries no registry**

### missing_scoring_configs (43 categorias)
```json
[
  "tv", "fridge", "laptop", "air_conditioner", "washer", "tablet", "soundbar",
  "tws", "headset_gamer", "bluetooth_speaker", "console", "gamepad", "chair",
  "keyboard", "cpu", "gpu", "ram", "motherboard", "ssd", "psu", "case",
  "projector", "tvbox", "smartwatch", "robot-vacuum", "stick_vacuum", "fan",
  "security_camera", "smart_lock", "router", "freezer", "minibar", "wine_cooler",
  "ups", "power_strip", "washer_dryer", "dishwasher", "microwave", "stove",
  "air_fryer", "espresso", "mixer", "water_purifier", "range_hood", "builtin_oven",
  "printer", "camera", "tire", "car_battery", "pressure_washer", "drill"
]
```

### orphan_scoring_configs (configs sem categoryId canônico)
```json
[]
```
> Nota: HMUM usa slugs (`'smart-tv'`) enquanto RAW_CATEGORIES usa (`'tv'`). Isso não é orfandade, é problema de mapeamento.

---

## 4) Gates

### Build
```
npm run build
```

**Resultado**: ✅ **PASS**
```
Exit code: 0
✓ Compiled successfully
```

---

## Resumo Executivo

| Componente | Esperado | Encontrado | Status |
|------------|----------|------------|--------|
| RAW_CATEGORIES | 54 | **53** | ⚠️ Falta coffee_maker |
| UU Constantes | 54 | **53** | ⚠️ Confere com categories |
| HMUM Configs | 11 | **10** | ✅ 10 configs + 1 index |
| Build | PASS | **PASS** | ✅ |

---

## PRECISO DO ADRIANO PARA:

1. **Confirmar se são 53 ou 54 categorias** - RAW_CATEGORIES tem 53, não existe `coffee_maker` mas existe `espresso`. São a mesma coisa?

2. **Resolver mapeamento HMUM** - O registry HMUM usa slugs (`smart-tv`, `fone-ouvido`) diferentes dos categoryIds canônicos (`tv`, `tws`). Devo usar qual padrão ao criar novos?
