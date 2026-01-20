// ============================================================================
// TCO COMPONENTS - PUBLIC API
// ============================================================================
// Re-exports all TCO control components for clean imports
// ============================================================================

// Reality Switch (View Toggle)
export {
    RealitySwitch,
    RealitySwitchPill,
    default as RealitySwitchDefault
} from './reality-switch';

// Persona Selector
export {
    PersonaSelector,
    PersonaSelectorCompact,
    PERSONA_CONFIG,
    default as PersonaSelectorDefault
} from './persona-selector';

// Controls Bar (Container)
export {
    TcoControlsBar,
    ShareButton,
    default as TcoControlsBarDefault
} from './tco-controls-bar';

// ============================================================================
// VISUALIZATION COMPONENTS
// ============================================================================

// Iceberg Chart (Stacked Bar)
export {
    IcebergChart,
    ICEBERG_COLORS,
    default as IcebergChartDefault
} from './iceberg-chart';

// Risk Shield (SCRS Badge)
export {
    RiskShield,
    RiskShieldCompact,
    RiskShieldInline,
    riskShieldVariants,
    getRiskConfig,
    default as RiskShieldDefault
} from './risk-shield';
export type { RiskLevel, RiskConfig } from './risk-shield';

// TCO Card
export {
    TcoCard,
    TcoCardCompact,
    TcoCardVs,
    tcoCardVariants,
    getEfficiencyConfig,
    default as TcoCardDefault
} from './tco-card';
export type { EfficiencyLevel, EfficiencyConfig } from './tco-card';

// ============================================================================
// DATA TABLE (MUTANT TABLE)
// ============================================================================

// Mutant Table (Dual-rendering: Table on Desktop, Cards on Mobile)
export {
    DataTable,
    MutantCard,
    createColumns,
} from './mutant-table';
export type { ColumnConfig } from './mutant-table';

// ============================================================================
// CATEGORY FILTER
// ============================================================================

export {
    CategoryFilter,
    useCategory,
    CATEGORIES,
    DEFAULT_CATEGORY,
    PARAM_CATEGORY,
} from './category-filter';
export type { TcoCategory, UseCategoryReturn } from './category-filter';

// ============================================================================
// TCO ENGINE SECTION (Embeddable)
// ============================================================================

export { TcoEngineSection } from './tco-engine-section';

// ============================================================================
// VIEW SWITCHER (Display Mode Toggle)
// ============================================================================

export {
    ViewSwitcher,
    ViewSwitcherEnhanced,
    ViewSwitcherPill,
    default as ViewSwitcherDefault
} from './view-switcher';

// ============================================================================
// TCO TOOLBAR (Command Island Container)
// ============================================================================

export { TcoToolbar } from './tco-toolbar';
