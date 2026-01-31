#!/usr/bin/env npx tsx
/**
 * @file generate-bootstrap-categories.ts
 * @description P7-4: Gera schemas, specs, normalizers, samples para 42 categorias do BOOTSTRAP SPECS v1
 * 
 * Execute: npx tsx scripts/generate-bootstrap-categories.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SCHEMAS_DIR = path.join(PROJECT_ROOT, 'src', 'lib', 'scaffold', 'schemas');
const SPECS_DIR = path.join(PROJECT_ROOT, 'src', 'lib', 'scaffold', 'specs');
const NORMALIZE_DIR = path.join(PROJECT_ROOT, 'src', 'lib', 'scaffold', 'normalize');
const SAMPLES_DIR = path.join(PROJECT_ROOT, 'samples');

// BOOTSTRAP SPECS from ChatGPT
const BOOTSTRAP_SPECS = [
    {
        "categoryId": "tws",
        "specsRequired": ["batteryHoursTotal"],
        "specsRecommended": ["hasANC", "bluetoothVersion", "codec", "waterResistance", "hasMultipoint"],
        "rules": [
            { "id": "anc-bonus", "condition": "specs.hasANC === true", "scoreKey": "c3", "delta": 1.0, "description": "ANC melhora conforto/isolamento" },
            { "id": "battery-30h-bonus", "condition": "specs.batteryHoursTotal >= 30", "scoreKey": "c1", "delta": 0.7, "description": "Bateria total alta" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "bluetooth-speaker",
        "specsRequired": ["powerWattsRms", "batteryHours"],
        "specsRecommended": ["waterResistance", "hasStereoPairing", "hasPartyMode"],
        "rules": [
            { "id": "ip67-bonus", "condition": "typeof specs.waterResistance==='string' && specs.waterResistance.includes('IP67')", "scoreKey": "c4", "delta": 0.6, "description": "Maior robustez" },
            { "id": "battery-12h-bonus", "condition": "specs.batteryHours >= 12", "scoreKey": "c1", "delta": 0.5, "description": "Autonomia sólida" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "console",
        "specsRequired": ["storageGb", "maxResolution", "maxFps"],
        "specsRecommended": ["hasDiscDrive", "hasRayTracing", "supports120hz"],
        "rules": [
            { "id": "disc-drive-bonus", "condition": "specs.hasDiscDrive === true", "scoreKey": "c3", "delta": 0.6, "description": "Mídia física" },
            { "id": "4k-bonus", "condition": "specs.maxResolution === '4K' || specs.maxResolution==='8K'", "scoreKey": "c1", "delta": 0.6, "description": "Resolução alta" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "headset-gamer",
        "specsRequired": ["isWireless", "driverSizeMm"],
        "specsRecommended": ["hasSurround", "micType", "batteryHours"],
        "rules": [
            { "id": "wireless-bonus", "condition": "specs.isWireless === true", "scoreKey": "c5", "delta": 0.5, "description": "Usabilidade sem fio" },
            { "id": "surround-bonus", "condition": "specs.hasSurround === true", "scoreKey": "c1", "delta": 0.5, "description": "Imersão/posicionamento" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "gamepad",
        "specsRequired": ["platform", "isWireless"],
        "specsRecommended": ["hasRumble", "hasAdaptiveTriggers", "hasHallEffectSticks"],
        "rules": [
            { "id": "wireless-bonus", "condition": "specs.isWireless === true", "scoreKey": "c5", "delta": 0.4, "description": "Conveniência" },
            { "id": "hall-effect-bonus", "condition": "specs.hasHallEffectSticks === true", "scoreKey": "c4", "delta": 0.8, "description": "Menos drift" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "chair",
        "specsRequired": ["maxWeightKg", "hasLumbarSupport", "material"],
        "specsRecommended": ["hasAdjustableArmrests", "seatWidthCm", "reclineDegrees"],
        "rules": [
            { "id": "150kg-bonus", "condition": "specs.maxWeightKg >= 150", "scoreKey": "c4", "delta": 0.6, "description": "Estrutura robusta" },
            { "id": "adjustable-armrests-bonus", "condition": "specs.hasAdjustableArmrests === true", "scoreKey": "c5", "delta": 0.4, "description": "Ergonomia" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "projector",
        "specsRequired": ["lumensAnsi", "nativeResolution", "technology"],
        "specsRecommended": ["throwRatio", "hasKeystone", "inputLagMs"],
        "rules": [
            { "id": "1080p-bonus", "condition": "specs.nativeResolution === '1080p' || specs.nativeResolution === '4K'", "scoreKey": "c1", "delta": 0.5, "description": "Resolução nativa adequada" },
            { "id": "2000lm-bonus", "condition": "specs.lumensAnsi >= 2000", "scoreKey": "c1", "delta": 0.5, "description": "Brilho útil" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "tvbox",
        "specsRequired": ["ramGb", "storageGb", "os", "maxResolution"],
        "specsRecommended": ["hasEthernet", "wifiStandard", "supportsDolbyVision"],
        "rules": [
            { "id": "4k-bonus", "condition": "specs.maxResolution === '4K'", "scoreKey": "c1", "delta": 0.6, "description": "Suporte 4K" },
            { "id": "ethernet-bonus", "condition": "specs.hasEthernet === true", "scoreKey": "c7", "delta": 0.4, "description": "Estabilidade de rede" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "printer",
        "specsRequired": ["type", "ppmBlack", "hasWifi"],
        "specsRecommended": ["hasDuplex", "costPerPage", "hasScanner"],
        "rules": [
            { "id": "duplex-bonus", "condition": "specs.hasDuplex === true", "scoreKey": "c5", "delta": 0.4, "description": "Praticidade" },
            { "id": "laser-bonus", "condition": "specs.type === 'laser'", "scoreKey": "c1", "delta": 0.4, "description": "Velocidade" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "router",
        "specsRequired": ["wifiStandard", "maxSpeedMbps"],
        "specsRecommended": ["hasMesh", "hasWifi6e", "lanPorts", "antennasCount"],
        "rules": [
            { "id": "wifi6-bonus", "condition": "specs.wifiStandard.includes('6') || specs.wifiStandard.includes('7')", "scoreKey": "c7", "delta": 0.6, "description": "Padrão moderno" },
            { "id": "mesh-bonus", "condition": "specs.hasMesh === true", "scoreKey": "c7", "delta": 0.5, "description": "Cobertura" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "cpu",
        "specsRequired": ["cores", "threads", "boostClockGhz", "tdpW", "socket"],
        "specsRecommended": ["hasIntegratedGpu", "cacheMb"],
        "rules": [
            { "id": "8c-bonus", "condition": "specs.cores >= 8", "scoreKey": "c1", "delta": 0.6, "description": "Mais fôlego" },
            { "id": "low-tdp-bonus", "condition": "specs.tdpW <= 65", "scoreKey": "c2", "delta": 0.5, "description": "Eficiência" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "gpu",
        "specsRequired": ["vramGb", "tdpW", "hasRayTracing"],
        "specsRecommended": ["supportsFrameGen", "memoryBusBit"],
        "rules": [
            { "id": "12gb-bonus", "condition": "specs.vramGb >= 12", "scoreKey": "c1", "delta": 0.6, "description": "VRAM para jogos atuais" },
            { "id": "rt-bonus", "condition": "specs.hasRayTracing === true", "scoreKey": "c3", "delta": 0.4, "description": "Recursos modernos" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "motherboard",
        "specsRequired": ["socket", "chipset", "ramType", "m2Slots"],
        "specsRecommended": ["wifiOnboard", "pcieVersion", "formFactor"],
        "rules": [
            { "id": "ddr5-bonus", "condition": "specs.ramType === 'DDR5'", "scoreKey": "c1", "delta": 0.4, "description": "Plataforma mais nova" },
            { "id": "m2-2plus-bonus", "condition": "specs.m2Slots >= 2", "scoreKey": "c3", "delta": 0.4, "description": "Expansão" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "ram",
        "specsRequired": ["capacityGb", "speedMtps", "type"],
        "specsRecommended": ["latencyCl", "modulesCount"],
        "rules": [
            { "id": "32gb-bonus", "condition": "specs.capacityGb >= 32", "scoreKey": "c1", "delta": 0.4, "description": "Capacidade multitarefa" },
            { "id": "ddr5-bonus", "condition": "specs.type === 'DDR5'", "scoreKey": "c1", "delta": 0.4, "description": "Geração nova" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "ssd",
        "specsRequired": ["capacityGb", "interface", "readMbps", "writeMbps"],
        "specsRecommended": ["tbwTb", "hasDramCache"],
        "rules": [
            { "id": "pcie4-bonus", "condition": "specs.interface.includes('4.0') || specs.interface.includes('5.0')", "scoreKey": "c1", "delta": 0.5, "description": "Interface rápida" },
            { "id": "dram-bonus", "condition": "specs.hasDramCache === true", "scoreKey": "c4", "delta": 0.3, "description": "Consistência" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "psu",
        "specsRequired": ["watts", "efficiencyRating"],
        "specsRecommended": ["isModular", "hasAtx30", "warrantyYears"],
        "rules": [
            { "id": "gold-bonus", "condition": "specs.efficiencyRating.includes('Gold') || specs.efficiencyRating.includes('Platinum')", "scoreKey": "c2", "delta": 0.6, "description": "Eficiência melhor" },
            { "id": "full-modular-bonus", "condition": "specs.isModular === 'full'", "scoreKey": "c5", "delta": 0.4, "description": "Montagem/cabos" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "case",
        "specsRequired": ["formFactorSupport", "maxGpuLengthMm", "includedFans"],
        "specsRecommended": ["hasMeshFront", "hasRadiatorSupport", "hasDustFilters"],
        "rules": [
            { "id": "mesh-front-bonus", "condition": "specs.hasMeshFront === true", "scoreKey": "c2", "delta": 0.4, "description": "Melhor airflow" },
            { "id": "3fans-bonus", "condition": "specs.includedFans >= 3", "scoreKey": "c3", "delta": 0.4, "description": "Valor inicial melhor" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "freezer",
        "specsRequired": ["capacityLiters", "type"],
        "specsRecommended": ["hasFrostFree", "inmetroKwhYear", "noiseDb"],
        "rules": [
            { "id": "frostfree-bonus", "condition": "specs.hasFrostFree === true", "scoreKey": "c5", "delta": 0.6, "description": "Menos manutenção" },
            { "id": "low-kwh-bonus", "condition": "typeof specs.inmetroKwhYear==='number' && specs.inmetroKwhYear <= 300", "scoreKey": "c2", "delta": 0.7, "description": "Consumo anual baixo" }
        ],
        "usesEnergy": true,
        "energySource": "inmetroKwhYear",
        "baselineKwhMonth": 40
    },
    {
        "categoryId": "minibar",
        "specsRequired": ["capacityLiters"],
        "specsRecommended": ["inmetroKwhYear", "noiseDb", "hasFreezerCompartment"],
        "rules": [
            { "id": "low-noise-bonus", "condition": "typeof specs.noiseDb==='number' && specs.noiseDb <= 38", "scoreKey": "c6", "delta": 0.5, "description": "Mais silencioso" },
            { "id": "low-kwh-bonus", "condition": "typeof specs.inmetroKwhYear==='number' && specs.inmetroKwhYear <= 220", "scoreKey": "c2", "delta": 0.6, "description": "Consumo anual baixo" }
        ],
        "usesEnergy": true,
        "energySource": "inmetroKwhYear",
        "baselineKwhMonth": 20
    },
    {
        "categoryId": "wine-cooler",
        "specsRequired": ["bottleCount", "zones"],
        "specsRecommended": ["noiseDb", "hasDualZone", "inmetroKwhYear"],
        "rules": [
            { "id": "dual-zone-bonus", "condition": "specs.zones >= 2 || specs.hasDualZone === true", "scoreKey": "c3", "delta": 0.7, "description": "Duas zonas é diferencial" },
            { "id": "low-noise-bonus", "condition": "typeof specs.noiseDb==='number' && specs.noiseDb <= 39", "scoreKey": "c6", "delta": 0.4, "description": "Conforto acústico" }
        ],
        "usesEnergy": true,
        "energySource": "inmetroKwhYear",
        "baselineKwhMonth": 15
    },
    {
        "categoryId": "fan",
        "specsRequired": ["diameterCm", "speeds", "hasOscillation"],
        "specsRecommended": ["noiseDb", "powerWatts", "hasRemote"],
        "rules": [
            { "id": "50cm-bonus", "condition": "specs.diameterCm >= 50", "scoreKey": "c1", "delta": 0.4, "description": "Maior vazão" },
            { "id": "remote-bonus", "condition": "specs.hasRemote === true", "scoreKey": "c5", "delta": 0.3, "description": "Conveniência" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "stove",
        "specsRequired": ["type", "burners", "hasOven"],
        "specsRecommended": ["ovenCapacityLiters", "hasInduction", "voltage"],
        "rules": [
            { "id": "induction-bonus", "condition": "specs.type === 'induction' || specs.hasInduction === true", "scoreKey": "c1", "delta": 0.7, "description": "Controle e potência" },
            { "id": "5burners-bonus", "condition": "specs.burners >= 5", "scoreKey": "c3", "delta": 0.3, "description": "Flexibilidade" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "builtin-oven",
        "specsRequired": ["capacityLiters", "voltage"],
        "specsRecommended": ["hasConvection", "maxTempC", "hasSteam"],
        "rules": [
            { "id": "convection-bonus", "condition": "specs.hasConvection === true", "scoreKey": "c3", "delta": 0.6, "description": "Convecção melhora uniformidade" },
            { "id": "70l-bonus", "condition": "specs.capacityLiters >= 70", "scoreKey": "c1", "delta": 0.4, "description": "Capacidade" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "microwave",
        "specsRequired": ["capacityLiters", "powerWatts"],
        "specsRecommended": ["hasGrill", "hasInverter", "hasAutoMenus"],
        "rules": [
            { "id": "1200w-bonus", "condition": "specs.powerWatts >= 1200", "scoreKey": "c1", "delta": 0.4, "description": "Aquece mais rápido" },
            { "id": "inverter-bonus", "condition": "specs.hasInverter === true", "scoreKey": "c5", "delta": 0.5, "description": "Controle de potência" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "air-fryer",
        "specsRequired": ["capacityLiters", "powerWatts"],
        "specsRecommended": ["hasDigital", "hasDualBasket", "hasWindow"],
        "rules": [
            { "id": "5l-bonus", "condition": "specs.capacityLiters >= 5", "scoreKey": "c1", "delta": 0.4, "description": "Capacidade útil" },
            { "id": "dual-basket-bonus", "condition": "specs.hasDualBasket === true", "scoreKey": "c3", "delta": 0.6, "description": "Versatilidade" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "range-hood",
        "specsRequired": ["flowRateM3h", "noiseDb", "widthCm"],
        "specsRecommended": ["mode", "hasBaffleFilter", "ductDiameterMm"],
        "rules": [
            { "id": "600m3h-bonus", "condition": "specs.flowRateM3h >= 600", "scoreKey": "c1", "delta": 0.5, "description": "Vazão relevante" },
            { "id": "60db-bonus", "condition": "specs.noiseDb <= 60", "scoreKey": "c6", "delta": 0.6, "description": "Menos ruído" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "dishwasher",
        "specsRequired": ["places", "inmetroKwhYear", "noiseDb"],
        "specsRecommended": ["hasInverterMotor", "hasAutoOpen", "hasThirdRack"],
        "rules": [
            { "id": "14places-bonus", "condition": "specs.places >= 14", "scoreKey": "c1", "delta": 0.5, "description": "Capacidade maior" },
            { "id": "49db-bonus", "condition": "specs.noiseDb <= 49", "scoreKey": "c6", "delta": 0.6, "description": "Mais silenciosa" }
        ],
        "usesEnergy": true,
        "energySource": "inmetroKwhYear",
        "baselineKwhMonth": 25
    },
    {
        "categoryId": "espresso-machine",
        "specsRequired": ["type", "pressureBar"],
        "specsRecommended": ["hasMilkFrother", "hasGrinder", "waterTankLiters"],
        "rules": [
            { "id": "15bar-bonus", "condition": "specs.pressureBar >= 15", "scoreKey": "c1", "delta": 0.4, "description": "Pressão padrão mercado" },
            { "id": "grinder-bonus", "condition": "specs.hasGrinder === true", "scoreKey": "c3", "delta": 0.6, "description": "Moedor agrega valor" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "mixer",
        "specsRequired": ["powerWatts", "speeds", "hasPlanetaryAction"],
        "specsRecommended": ["bowlLiters", "hasPulse", "attachmentsCount"],
        "rules": [
            { "id": "planetary-bonus", "condition": "specs.hasPlanetaryAction === true", "scoreKey": "c1", "delta": 0.6, "description": "Mistura uniforme" },
            { "id": "600w-bonus", "condition": "specs.powerWatts >= 600", "scoreKey": "c1", "delta": 0.4, "description": "Motor mais forte" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "water-purifier",
        "specsRequired": ["flowRateLh", "filterType"],
        "specsRecommended": ["hasRefrigeration", "coolingTech", "inmetroClass", "hasBacteriologicalEfficiency"],
        "rules": [
            { "id": "bacterio-bonus", "condition": "specs.hasBacteriologicalEfficiency === true", "scoreKey": "c4", "delta": 0.8, "description": "Segurança sanitária" },
            { "id": "compressor-bonus", "condition": "specs.hasRefrigeration === true && specs.coolingTech === 'compressor'", "scoreKey": "c1", "delta": 0.6, "description": "Refrigeração eficiente" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "food-mixer",
        "specsRequired": ["powerWatts", "hasVariableSpeed"],
        "specsRecommended": ["attachmentsCount", "isImmersion", "hasChopper"],
        "rules": [
            { "id": "variable-speed-bonus", "condition": "specs.hasVariableSpeed === true", "scoreKey": "c5", "delta": 0.4, "description": "Mais controle" },
            { "id": "800w-bonus", "condition": "specs.powerWatts >= 800", "scoreKey": "c1", "delta": 0.4, "description": "Potência maior" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "washer-dryer",
        "specsRequired": ["capacityKg", "spinRpm", "hasInverter"],
        "specsRecommended": ["inmetroKwhYear", "steamFeature", "noiseDb"],
        "rules": [
            { "id": "inverter-bonus", "condition": "specs.hasInverter === true", "scoreKey": "c2", "delta": 0.6, "description": "Eficiência/ruído" },
            { "id": "1200rpm-bonus", "condition": "specs.spinRpm >= 1200", "scoreKey": "c1", "delta": 0.4, "description": "Centrifugação forte" }
        ],
        "usesEnergy": true,
        "energySource": "inmetroKwhYear",
        "baselineKwhMonth": 45
    },
    {
        "categoryId": "stick-vacuum",
        "specsRequired": ["type", "hasHepa"],
        "specsRecommended": ["batteryMinutes", "suctionPa", "weightKg"],
        "rules": [
            { "id": "hepa-bonus", "condition": "specs.hasHepa === true", "scoreKey": "c4", "delta": 0.6, "description": "Filtragem melhor" },
            { "id": "45min-bonus", "condition": "typeof specs.batteryMinutes==='number' && specs.batteryMinutes >= 45", "scoreKey": "c1", "delta": 0.5, "description": "Autonomia" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "pressure-washer",
        "specsRequired": ["psi", "flowLmin", "powerWatts"],
        "specsRecommended": ["hasDetergentTank", "hoseLengthM"],
        "rules": [
            { "id": "2000psi-bonus", "condition": "specs.psi >= 2000", "scoreKey": "c1", "delta": 0.5, "description": "Pressão maior" },
            { "id": "detergent-bonus", "condition": "specs.hasDetergentTank === true", "scoreKey": "c5", "delta": 0.3, "description": "Praticidade" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "security-camera",
        "specsRequired": ["videoResolution", "hasNightVision", "storageType"],
        "specsRecommended": ["hasAI", "isWeatherproof", "powerType"],
        "rules": [
            { "id": "2kplus-bonus", "condition": "specs.videoResolution === '2K' || specs.videoResolution === '4K'", "scoreKey": "c1", "delta": 0.5, "description": "Mais detalhe" },
            { "id": "poe-bonus", "condition": "specs.powerType === 'poe'", "scoreKey": "c4", "delta": 0.4, "description": "Confiabilidade" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "smart-lock",
        "specsRequired": ["authMethods", "batteryType"],
        "specsRecommended": ["hasBiometric", "hasKeyOverride", "supportsApp"],
        "rules": [
            { "id": "biometric-bonus", "condition": "specs.hasBiometric === true", "scoreKey": "c5", "delta": 0.6, "description": "Acesso rápido" },
            { "id": "key-override-bonus", "condition": "specs.hasKeyOverride === true", "scoreKey": "c4", "delta": 0.5, "description": "Fail-safe" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "ups",
        "specsRequired": ["va", "watts", "batteryMinutes", "outlets"],
        "specsRecommended": ["hasPureSineWave", "hasAvr", "warrantyYears"],
        "rules": [
            { "id": "pure-sine-bonus", "condition": "specs.hasPureSineWave === true", "scoreKey": "c4", "delta": 0.8, "description": "Compatibilidade fontes/APFC" },
            { "id": "15min-bonus", "condition": "specs.batteryMinutes >= 15", "scoreKey": "c1", "delta": 0.4, "description": "Autonomia útil" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "power-strip",
        "specsRequired": ["outlets", "hasSurgeProtection"],
        "specsRecommended": ["joules", "cableLengthM", "hasIndividualSwitches"],
        "rules": [
            { "id": "1000j-bonus", "condition": "typeof specs.joules==='number' && specs.joules >= 1000", "scoreKey": "c4", "delta": 0.6, "description": "Proteção melhor" },
            { "id": "8outlets-bonus", "condition": "specs.outlets >= 8", "scoreKey": "c5", "delta": 0.4, "description": "Mais tomadas" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "camera",
        "specsRequired": ["sensorSize", "megapixels", "videoResolution"],
        "specsRecommended": ["hasStabilization", "maxIso", "hasMicInput"],
        "rules": [
            { "id": "aps-c-bonus", "condition": "specs.sensorSize === 'APS-C' || specs.sensorSize === 'Full Frame'", "scoreKey": "c1", "delta": 0.6, "description": "Sensor maior" },
            { "id": "4k-bonus", "condition": "specs.videoResolution.includes('4K')", "scoreKey": "c3", "delta": 0.4, "description": "Vídeo melhor" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "tire",
        "specsRequired": ["width", "profile", "diameter", "loadIndex", "speedRating"],
        "specsRecommended": ["wetGripRating", "treadwear", "warrantyMonths"],
        "rules": [
            { "id": "wet-a-bonus", "condition": "specs.wetGripRating === 'A'", "scoreKey": "c4", "delta": 0.7, "description": "Aderência no molhado" },
            { "id": "treadwear-400-bonus", "condition": "typeof specs.treadwear==='number' && specs.treadwear >= 400", "scoreKey": "c4", "delta": 0.4, "description": "Durabilidade" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "car-battery",
        "specsRequired": ["ampereHours", "cca", "voltage"],
        "specsRecommended": ["warrantyMonths", "technology"],
        "rules": [
            { "id": "cca-600-bonus", "condition": "specs.cca >= 600", "scoreKey": "c1", "delta": 0.5, "description": "Partida mais forte" },
            { "id": "agm-bonus", "condition": "specs.technology === 'agm'", "scoreKey": "c4", "delta": 0.4, "description": "Tecnologia superior" }
        ],
        "usesEnergy": false
    },
    {
        "categoryId": "drill",
        "specsRequired": ["voltageV", "torqueNm", "isImpact", "hasBrushless"],
        "specsRecommended": ["batteryAh", "hasHammerMode", "speedSettings"],
        "rules": [
            { "id": "brushless-bonus", "condition": "specs.hasBrushless === true", "scoreKey": "c4", "delta": 0.7, "description": "Eficiência e durabilidade" },
            { "id": "50nm-bonus", "condition": "specs.torqueNm >= 50", "scoreKey": "c1", "delta": 0.5, "description": "Torque alto" }
        ],
        "usesEnergy": false
    }
];

// ============================================
// GENERATORS
// ============================================

function toTitleCase(str: string): string {
    return str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

function generateSchema(cat: typeof BOOTSTRAP_SPECS[0]): string {
    const className = toTitleCase(cat.categoryId);
    const allSpecs = [...cat.specsRequired, ...cat.specsRecommended];

    const specsFields = allSpecs.map(f => {
        if (f.includes('has') || f.includes('is') || f.includes('supports')) {
            return `    ${f}: z.boolean().optional(),`;
        } else if (f.includes('Gb') || f.includes('Kg') || f.includes('Cm') || f.includes('Mm') ||
            f.includes('Watts') || f.includes('Hours') || f.includes('Liters') ||
            f.includes('Rpm') || f.includes('Hz') || f.includes('Db') || f.includes('Bar') ||
            f.includes('Count') || f.includes('Years') || f.includes('Months') ||
            f.includes('Minutes') || f.includes('Index') || f.includes('slots')) {
            const isRequired = cat.specsRequired.includes(f);
            return `    ${f}: z.number()${isRequired ? '.positive()' : '.optional()'},`;
        } else {
            const isRequired = cat.specsRequired.includes(f);
            return `    ${f}: z.${isRequired ? 'string().min(1)' : 'string().optional()'},`;
        }
    }).join('\n');

    return `/**
 * @file ${cat.categoryId}.ts
 * @description Schema Zod para input raw de ${className}
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema${cat.usesEnergy ? ', EnergyInputSchema' : ''}, EvidenceMapSchema } from './common';

export const ${className}SpecsInputSchema = z.object({
${specsFields}
});

export const ${className}OpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('${cat.categoryId}'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),${cat.usesEnergy ? '\n    energy: EnergyInputSchema.optional(),' : ''}
    specs: ${className}SpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type ${className}OpusRawInput = z.infer<typeof ${className}OpusRawInputSchema>;
`;
}

function generateSampleInput(cat: typeof BOOTSTRAP_SPECS[0]): string {
    const sampleObj: Record<string, unknown> = {
        product: {
            name: `Sample ${toTitleCase(cat.categoryId)} Product`,
            brand: "SampleBrand",
            model: "Model-001",
            categoryId: cat.categoryId,
            asin: "B0SAMPLE01"
        },
        price: {
            valueBRL: 999.00,
            observedAt: "2026-01-22",
            sourceUrl: "https://amazon.com.br/dp/B0SAMPLE01"
        },
        sources: [
            { url: "https://amazon.com.br/dp/B0SAMPLE01", type: "amazon" },
            { url: "https://manufacturer.com/sample", type: "manufacturer" }
        ],
        specs: {},
        meta: { cadastradoPor: "opus", cadastradoEm: "2026-01-22" }
    };

    // Add sample spec values
    const specs: Record<string, unknown> = {};
    for (const field of [...cat.specsRequired, ...cat.specsRecommended.slice(0, 2)]) {
        if (field.includes('has') || field.includes('is') || field.includes('supports')) {
            specs[field] = true;
        } else if (field.includes('Gb') || field.includes('Liters') || field.includes('Watts')) {
            specs[field] = 100;
        } else if (field.includes('Hours') || field.includes('Minutes')) {
            specs[field] = 30;
        } else {
            specs[field] = "standard";
        }
    }
    sampleObj.specs = specs;

    if (cat.usesEnergy) {
        (sampleObj as Record<string, unknown>).energy = { inmetroKwhYear: 300 };
    }

    return JSON.stringify(sampleObj, null, 4);
}

function generateSampleEvidence(cat: typeof BOOTSTRAP_SPECS[0]): string {
    const sample = JSON.parse(generateSampleInput(cat));

    // Add evidence for required specs
    const evidence: Record<string, { sourceUrl: string; note: string }> = {};
    for (const field of cat.specsRequired) {
        evidence[`specs.${field}`] = {
            sourceUrl: "https://manufacturer.com/sample",
            note: "Especificação oficial"
        };
    }
    sample.evidence = evidence;

    return JSON.stringify(sample, null, 4);
}

// ============================================
// MAIN
// ============================================

console.log('🚀 Gerando schemas para 42 categorias...\n');

let schemasCreated = 0;
let samplesCreated = 0;

for (const cat of BOOTSTRAP_SPECS) {
    // Skip if already exists (the 11 original categories)
    const schemaPath = path.join(SCHEMAS_DIR, `${cat.categoryId}.ts`);
    if (fs.existsSync(schemaPath)) {
        console.log(`⏭️  ${cat.categoryId}: schema já existe, pulando`);
        continue;
    }

    // Generate schema
    const schema = generateSchema(cat);
    fs.writeFileSync(schemaPath, schema, 'utf-8');
    schemasCreated++;

    // Generate samples
    const samplePath = path.join(SAMPLES_DIR, `${cat.categoryId}.input.json`);
    if (!fs.existsSync(samplePath)) {
        fs.writeFileSync(samplePath, generateSampleInput(cat), 'utf-8');
        samplesCreated++;
    }

    const evidencePath = path.join(SAMPLES_DIR, `${cat.categoryId}.evidence.input.json`);
    if (!fs.existsSync(evidencePath)) {
        fs.writeFileSync(evidencePath, generateSampleEvidence(cat), 'utf-8');
        samplesCreated++;
    }

    console.log(`✅ ${cat.categoryId}: schema + samples criados`);
}

console.log(`\n📊 Resumo:`);
console.log(`   Schemas criados: ${schemasCreated}`);
console.log(`   Samples criados: ${samplesCreated}`);
console.log(`   Total categorias no pack: ${BOOTSTRAP_SPECS.length}`);
