/**
 * @file category-completeness.ts
 * @description P9-A: Completeness Contract por categoria
 * 
 * Define campos obrigatórios para:
 * 1) Entry em products.ts (requiredFieldsProducts)
 * 2) Mock JSON para PDP (requiredFieldsMock)
 * 3) Campos que exigem evidence (evidenceRequiredFields)
 * 
 * Categorias stub usam template por tier.
 */

// ============================================
// TYPES
// ============================================

export interface CompletenessContract {
    categoryId: string;
    maturity: 'production' | 'stub';

    /** Campos obrigatórios no entry products.ts */
    requiredFieldsProducts: string[];

    /** Campos obrigatórios no mock JSON da PDP */
    requiredFieldsMock: string[];

    /** Campos que exigem sourceUrl/evidence */
    evidenceRequiredFields: string[];

    /** Campos recomendados (warning se ausentes) */
    recommendedFields: string[];
}

// ============================================
// BASE TEMPLATES BY TIER
// ============================================

const BASE_PRODUCT_FIELDS = [
    'product.name',
    'product.brand',
    'product.model',
    'product.categoryId',
    'price.valueBRL',
    'price.sourceUrl',
    'sources',
];

const BASE_ENTRY_FIELDS = [
    'id',
    'categoryId',
    'name',
    'shortName',
    'brand',
    'model',
    'price',
    'imageUrl',
    'status',
    'scores.c1',
    'scores.c2',
    'scores.c3',
    'scores.c4',
    'scores.c5',
    'scores.c6',
    'scores.c7',
    'scores.c8',
    'scores.c9',
    'scores.c10',
    'specs',
];

const BASE_EVIDENCE_FIELDS = [
    'product.brand',
    'product.model',
    'price.valueBRL',
];

const BASE_RECOMMENDED_FIELDS = [
    'scoreReasons.c1',
    'scoreReasons.c2',
    'scoreReasons.c3',
    'badges',
    'offers',
    'mainCompetitor',
];

// ============================================
// PRODUCTION CONTRACTS (11 categories)
// ============================================

const TV_CONTRACT: CompletenessContract = {
    categoryId: 'tv',
    maturity: 'production',
    requiredFieldsProducts: [
        ...BASE_ENTRY_FIELDS,
        'specs.screenSize',
        'specs.resolution',
        'specs.panelType',
        'specs.refreshRate',
    ],
    requiredFieldsMock: [
        ...BASE_PRODUCT_FIELDS,
        'specs.screenSize',
        'specs.resolution',
        'specs.panelType',
        'specs.refreshRate',
    ],
    evidenceRequiredFields: [
        ...BASE_EVIDENCE_FIELDS,
        'specs.screenSize',
        'specs.resolution',
        'specs.panelType',
        'specs.refreshRate',
    ],
    recommendedFields: [
        ...BASE_RECOMMENDED_FIELDS,
        'specs.hdmiPorts',
        'specs.hdrFormats',
        'attributes.hdmi21',
        'attributes.brightness',
    ],
};

const FRIDGE_CONTRACT: CompletenessContract = {
    categoryId: 'fridge',
    maturity: 'production',
    requiredFieldsProducts: [
        ...BASE_ENTRY_FIELDS,
        'specs.capacityLiters',
        'specs.hasFrostFree',
    ],
    requiredFieldsMock: [
        ...BASE_PRODUCT_FIELDS,
        'specs.capacityLiters',
        'specs.hasFrostFree',
        'energy.inmetroKwhYear',
    ],
    evidenceRequiredFields: [
        ...BASE_EVIDENCE_FIELDS,
        'specs.capacityLiters',
        'energy.inmetroKwhYear',
    ],
    recommendedFields: [
        ...BASE_RECOMMENDED_FIELDS,
        'specs.hasInverter',
        'specs.voltage',
    ],
};

const AIR_CONDITIONER_CONTRACT: CompletenessContract = {
    categoryId: 'air_conditioner',
    maturity: 'production',
    requiredFieldsProducts: [
        ...BASE_ENTRY_FIELDS,
        'specs.btus',
        'specs.hasInverter',
    ],
    requiredFieldsMock: [
        ...BASE_PRODUCT_FIELDS,
        'specs.btus',
        'specs.hasInverter',
        'energy.labelKwhMonth',
    ],
    evidenceRequiredFields: [
        ...BASE_EVIDENCE_FIELDS,
        'specs.btus',
        'energy.labelKwhMonth',
    ],
    recommendedFields: [
        ...BASE_RECOMMENDED_FIELDS,
        'specs.noiseDb',
        'specs.voltage',
    ],
};

const SMARTPHONE_CONTRACT: CompletenessContract = {
    categoryId: 'smartphone',
    maturity: 'production',
    requiredFieldsProducts: [
        ...BASE_ENTRY_FIELDS,
        'specs.storage',
        'specs.ram',
        'specs.displaySize',
    ],
    requiredFieldsMock: [
        ...BASE_PRODUCT_FIELDS,
        'specs.storage',
        'specs.ram',
        'specs.displaySize',
        'specs.processor',
    ],
    evidenceRequiredFields: [
        ...BASE_EVIDENCE_FIELDS,
        'specs.storage',
        'specs.ram',
    ],
    recommendedFields: [
        ...BASE_RECOMMENDED_FIELDS,
        'specs.battery',
        'specs.certification',
    ],
};

const ROBOT_VACUUM_CONTRACT: CompletenessContract = {
    categoryId: 'robot-vacuum',
    maturity: 'production',
    requiredFieldsProducts: [
        ...BASE_ENTRY_FIELDS,
        'specs.navigationType',
        'specs.suctionPa',
    ],
    requiredFieldsMock: [
        ...BASE_PRODUCT_FIELDS,
        'specs.navigationType',
        'specs.suctionPa',
        'specs.hasSelfEmpty',
    ],
    evidenceRequiredFields: [
        ...BASE_EVIDENCE_FIELDS,
        'specs.suctionPa',
        'specs.navigationType',
    ],
    recommendedFields: [
        ...BASE_RECOMMENDED_FIELDS,
        'specs.hasMop',
        'specs.batteryMah',
    ],
};

const SMARTWATCH_CONTRACT: CompletenessContract = {
    categoryId: 'smartwatch',
    maturity: 'production',
    requiredFieldsProducts: [
        ...BASE_ENTRY_FIELDS,
        'specs.displaySize',
        'specs.batteryDays',
    ],
    requiredFieldsMock: [
        ...BASE_PRODUCT_FIELDS,
        'specs.displaySize',
        'specs.batteryDays',
        'specs.hasGps',
    ],
    evidenceRequiredFields: [
        ...BASE_EVIDENCE_FIELDS,
        'specs.displaySize',
        'specs.batteryDays',
    ],
    recommendedFields: [
        ...BASE_RECOMMENDED_FIELDS,
        'specs.hasNfc',
        'specs.os',
    ],
};

const LAPTOP_CONTRACT: CompletenessContract = {
    categoryId: 'laptop',
    maturity: 'production',
    requiredFieldsProducts: [
        ...BASE_ENTRY_FIELDS,
        'specs.processor',
        'specs.ram',
        'specs.storage',
    ],
    requiredFieldsMock: [
        ...BASE_PRODUCT_FIELDS,
        'specs.processor',
        'specs.ram',
        'specs.storage',
        'specs.screenSize',
    ],
    evidenceRequiredFields: [
        ...BASE_EVIDENCE_FIELDS,
        'specs.processor',
        'specs.ram',
        'specs.storage',
    ],
    recommendedFields: [
        ...BASE_RECOMMENDED_FIELDS,
        'specs.resolution',
        'specs.weightKg',
    ],
};

const WASHER_CONTRACT: CompletenessContract = {
    categoryId: 'washer',
    maturity: 'production',
    requiredFieldsProducts: [
        ...BASE_ENTRY_FIELDS,
        'specs.capacityKg',
        'specs.hasInverter',
    ],
    requiredFieldsMock: [
        ...BASE_PRODUCT_FIELDS,
        'specs.capacityKg',
        'specs.hasInverter',
        'energy.inmetroKwhYear',
    ],
    evidenceRequiredFields: [
        ...BASE_EVIDENCE_FIELDS,
        'specs.capacityKg',
        'energy.inmetroKwhYear',
    ],
    recommendedFields: [
        ...BASE_RECOMMENDED_FIELDS,
        'specs.spinRpm',
        'specs.voltage',
    ],
};

const MONITOR_CONTRACT: CompletenessContract = {
    categoryId: 'monitor',
    maturity: 'production',
    requiredFieldsProducts: [
        ...BASE_ENTRY_FIELDS,
        'specs.screenSize',
        'specs.resolution',
        'specs.refreshRate',
    ],
    requiredFieldsMock: [
        ...BASE_PRODUCT_FIELDS,
        'specs.screenSize',
        'specs.resolution',
        'specs.refreshRate',
    ],
    evidenceRequiredFields: [
        ...BASE_EVIDENCE_FIELDS,
        'specs.screenSize',
        'specs.resolution',
    ],
    recommendedFields: [
        ...BASE_RECOMMENDED_FIELDS,
        'specs.panelType',
        'specs.hasHdr',
    ],
};

const TABLET_CONTRACT: CompletenessContract = {
    categoryId: 'tablet',
    maturity: 'production',
    requiredFieldsProducts: [
        ...BASE_ENTRY_FIELDS,
        'specs.storage',
        'specs.displaySize',
    ],
    requiredFieldsMock: [
        ...BASE_PRODUCT_FIELDS,
        'specs.storage',
        'specs.displaySize',
    ],
    evidenceRequiredFields: [
        ...BASE_EVIDENCE_FIELDS,
        'specs.storage',
        'specs.displaySize',
    ],
    recommendedFields: [
        ...BASE_RECOMMENDED_FIELDS,
        'specs.ram',
        'specs.hasPenSupport',
    ],
};

const SOUNDBAR_CONTRACT: CompletenessContract = {
    categoryId: 'soundbar',
    maturity: 'production',
    requiredFieldsProducts: [
        ...BASE_ENTRY_FIELDS,
        'specs.watts',
        'specs.channels',
    ],
    requiredFieldsMock: [
        ...BASE_PRODUCT_FIELDS,
        'specs.watts',
        'specs.channels',
    ],
    evidenceRequiredFields: [
        ...BASE_EVIDENCE_FIELDS,
        'specs.watts',
    ],
    recommendedFields: [
        ...BASE_RECOMMENDED_FIELDS,
        'specs.hasDolbyAtmos',
        'specs.hasSubwoofer',
    ],
};

// ============================================
// STUB TEMPLATE BY TIER
// ============================================

function createStubContract(
    categoryId: string,
    tier: 'electronics' | 'appliance' | 'components' | 'gaming' | 'generic',
    specificSpecs: string[] = []
): CompletenessContract {
    const tierSpecificEvidence: Record<string, string[]> = {
        electronics: ['specs.batteryHours', 'specs.bluetooth'],
        appliance: ['specs.capacityLiters', 'energy.inmetroKwhYear'],
        components: ['specs.tdpW', 'specs.cores'],
        gaming: ['specs.isWireless', 'specs.driverSizeMm'],
        generic: [],
    };

    return {
        categoryId,
        maturity: 'stub',
        requiredFieldsProducts: [...BASE_ENTRY_FIELDS, ...specificSpecs],
        requiredFieldsMock: [...BASE_PRODUCT_FIELDS, ...specificSpecs],
        evidenceRequiredFields: [
            ...BASE_EVIDENCE_FIELDS,
            ...tierSpecificEvidence[tier].slice(0, 2),
            ...specificSpecs.slice(0, 2),
        ],
        recommendedFields: BASE_RECOMMENDED_FIELDS,
    };
}

// ============================================
// STUB CONTRACTS (42 categories)
// ============================================

const STUB_CONTRACTS: CompletenessContract[] = [
    // Mobile
    createStubContract('tws', 'electronics', ['specs.batteryHoursTotal', 'specs.hasANC']),
    createStubContract('bluetooth-speaker', 'electronics', ['specs.powerWattsRms', 'specs.batteryHours']),
    createStubContract('camera', 'electronics', ['specs.megapixels', 'specs.sensorSize']),

    // Gaming
    createStubContract('console', 'gaming', ['specs.storageGb', 'specs.maxResolution']),
    createStubContract('headset-gamer', 'gaming', ['specs.driverSizeMm', 'specs.isWireless']),
    createStubContract('gamepad', 'gaming', ['specs.platform', 'specs.isWireless']),
    createStubContract('chair', 'gaming', ['specs.maxWeightKg', 'specs.hasLumbarSupport']),

    // Video/Audio
    createStubContract('projector', 'electronics', ['specs.lumensAnsi', 'specs.nativeResolution']),
    createStubContract('tvbox', 'electronics', ['specs.ramGb', 'specs.maxResolution']),

    // Computing
    createStubContract('printer', 'electronics', ['specs.type', 'specs.ppmBlack']),
    createStubContract('router', 'electronics', ['specs.wifiStandard', 'specs.maxSpeedMbps']),

    // Components
    createStubContract('cpu', 'components', ['specs.cores', 'specs.threads', 'specs.tdpW']),
    createStubContract('gpu', 'components', ['specs.vramGb', 'specs.tdpW', 'specs.hasRayTracing']),
    createStubContract('motherboard', 'components', ['specs.socket', 'specs.chipset']),
    createStubContract('ram', 'components', ['specs.capacityGb', 'specs.speedMtps']),
    createStubContract('ssd', 'components', ['specs.capacityGb', 'specs.readMbps']),
    createStubContract('psu', 'components', ['specs.watts', 'specs.efficiencyRating']),
    createStubContract('case', 'components', ['specs.formFactorSupport', 'specs.maxGpuLengthMm']),

    // Appliance - Refrigeration
    createStubContract('freezer', 'appliance', ['specs.capacityLiters', 'specs.type']),
    createStubContract('minibar', 'appliance', ['specs.capacityLiters']),
    createStubContract('wine-cooler', 'appliance', ['specs.bottleCount', 'specs.zones']),
    createStubContract('fan', 'appliance', ['specs.diameterCm', 'specs.speeds']),

    // Kitchen
    createStubContract('stove', 'appliance', ['specs.type', 'specs.burners']),
    createStubContract('builtin-oven', 'appliance', ['specs.capacityLiters', 'specs.hasConvection']),
    createStubContract('microwave', 'appliance', ['specs.capacityLiters', 'specs.powerWatts']),
    createStubContract('air-fryer', 'appliance', ['specs.capacityLiters', 'specs.powerWatts']),
    createStubContract('range-hood', 'appliance', ['specs.flowRateM3h', 'specs.noiseDb']),
    createStubContract('dishwasher', 'appliance', ['specs.places', 'specs.noiseDb']),
    createStubContract('espresso-machine', 'appliance', ['specs.type', 'specs.pressureBar']),
    createStubContract('mixer', 'appliance', ['specs.powerWatts', 'specs.speeds']),
    createStubContract('water-purifier', 'appliance', ['specs.flowRateLh', 'specs.filterType']),
    createStubContract('food-mixer', 'appliance', ['specs.powerWatts', 'specs.hasVariableSpeed']),

    // Cleaning
    createStubContract('washer-dryer', 'appliance', ['specs.capacityKg', 'specs.spinRpm']),
    createStubContract('stick-vacuum', 'appliance', ['specs.type', 'specs.hasHepa']),
    createStubContract('pressure-washer', 'appliance', ['specs.psi', 'specs.flowLmin']),

    // Security/Home
    createStubContract('security-camera', 'electronics', ['specs.videoResolution', 'specs.hasNightVision']),
    createStubContract('smart-lock', 'electronics', ['specs.authMethods', 'specs.batteryType']),

    // Utilities
    createStubContract('ups', 'electronics', ['specs.va', 'specs.watts']),
    createStubContract('power-strip', 'generic', ['specs.outlets', 'specs.hasSurgeProtection']),

    // Auto/Tools
    createStubContract('tire', 'generic', ['specs.width', 'specs.diameter']),
    createStubContract('car-battery', 'generic', ['specs.ampereHours', 'specs.cca']),
    createStubContract('drill', 'generic', ['specs.voltageV', 'specs.torqueNm']),
];

// ============================================
// REGISTRY
// ============================================

const PRODUCTION_CONTRACTS: CompletenessContract[] = [
    TV_CONTRACT,
    FRIDGE_CONTRACT,
    AIR_CONDITIONER_CONTRACT,
    SMARTPHONE_CONTRACT,
    ROBOT_VACUUM_CONTRACT,
    SMARTWATCH_CONTRACT,
    LAPTOP_CONTRACT,
    WASHER_CONTRACT,
    MONITOR_CONTRACT,
    TABLET_CONTRACT,
    SOUNDBAR_CONTRACT,
];

export const ALL_CONTRACTS: Record<string, CompletenessContract> = {};

for (const contract of [...PRODUCTION_CONTRACTS, ...STUB_CONTRACTS]) {
    ALL_CONTRACTS[contract.categoryId] = contract;
}

// ============================================
// HELPERS
// ============================================

export function getContract(categoryId: string): CompletenessContract | null {
    return ALL_CONTRACTS[categoryId] || null;
}

export function hasContract(categoryId: string): boolean {
    return categoryId in ALL_CONTRACTS;
}

export function listContractedCategories(): string[] {
    return Object.keys(ALL_CONTRACTS);
}

export function getContractStats(): { total: number; production: number; stub: number } {
    const contracts = Object.values(ALL_CONTRACTS);
    return {
        total: contracts.length,
        production: contracts.filter(c => c.maturity === 'production').length,
        stub: contracts.filter(c => c.maturity === 'stub').length,
    };
}
