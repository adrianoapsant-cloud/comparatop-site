// ============================================================================
// DYNAMIC LAYOUT TYPES
// ============================================================================
// Sistema de Slots Dinâmicos para Engenharia de Sistemas Adaptativos
// Permite reordenação e variação de componentes baseado no contexto do usuário
// ============================================================================

// ============================================
// COMPONENT TYPES & VARIANTS
// ============================================

/**
 * Tipos de componentes dinâmicos disponíveis na Zona Variante
 */
export type DynamicComponentType =
    | 'dna_chart'      // Gráfico DNA/Radar de scores
    | 'verdict'        // Veredicto da análise (prós/contras)
    | 'simulators'     // Simuladores inteligentes
    | 'specs'          // Ficha técnica
    | 'bundle';        // Widget de bundle/cross-sell

/**
 * Variantes de exibição para cada tipo de componente
 */
export interface ComponentVariantMap {
    dna_chart: 'visual' | 'technical' | 'gamer';
    verdict: 'full' | 'summary';
    simulators: 'cards' | 'compact';
    specs: 'list' | 'table_interactive';
    bundle: 'horizontal' | 'modal';
}

/**
 * Configuração de um slot individual
 */
export interface SlotConfig<T extends DynamicComponentType = DynamicComponentType> {
    /** Tipo do componente a ser renderizado */
    type: T;
    /** Variante de exibição (tipado por componente) */
    variant: ComponentVariantMap[T];
    /** ID único do slot para anchor links */
    id?: string;
    /** Props extras específicos do componente */
    props?: Record<string, unknown>;
    /** Condição para exibir (ex: só se tiver bundle disponível) */
    condition?: boolean;
}

/**
 * Configuração completa do layout dinâmico
 */
export interface DynamicLayoutConfig {
    /** Ordem dos slots a serem renderizados */
    order: SlotConfig[];
    /** Metadados para analytics */
    layoutVariant?: string;
    /** ID do experimento A/B (se aplicável) */
    experimentId?: string;
}

// ============================================
// CONTEXT TYPES
// ============================================

/**
 * Contexto do usuário para decisão de layout
 */
export interface UserContext {
    /** Dispositivo do usuário */
    device: 'mobile' | 'tablet' | 'desktop';
    /** Preferência de visualização (detectada ou explícita) */
    viewerType?: 'casual' | 'technical' | 'gamer';
    /** Fonte de tráfego */
    trafficSource?: 'organic' | 'paid' | 'social' | 'direct';
    /** Histórico de navegação recente */
    recentCategories?: string[];
    /** Usuário retornando? */
    isReturningVisitor?: boolean;
}

/**
 * Contexto do produto para decisão de layout
 */
export interface ProductContext {
    /** ID da categoria */
    categoryId: string;
    /** Preço do produto */
    priceRange: 'budget' | 'mid' | 'premium';
    /** Tem bundle disponível? */
    hasBundle: boolean;
    /** Tem rival configurado? */
    hasRival: boolean;
    /** Badges do produto */
    badges: string[];
}

// ============================================
// LAYOUT PRESETS
// ============================================

/**
 * Layouts pré-configurados por categoria/contexto
 */
export type LayoutPreset =
    | 'default'           // Layout padrão balanceado
    | 'gamer_focused'     // Prioriza specs técnicos e gaming
    | 'budget_conscious'  // Prioriza custo-benefício e bundle
    | 'quick_decision'    // Resumido para mobile/decisão rápida
    | 'comparison_mode';  // Quando veio de comparativo

/**
 * Props do componente DynamicLayoutRenderer
 */
export interface DynamicLayoutRendererProps {
    /** Configuração do layout */
    config: DynamicLayoutConfig;
    /** Dados do produto (passados para cada componente) */
    productData: Record<string, unknown>;
    /** Classe CSS adicional para o container */
    className?: string;
}

// ============================================
// COMPONENT PROPS TYPES
// ============================================

export interface DnaChartProps {
    variant: ComponentVariantMap['dna_chart'];
    productData: Record<string, unknown>;
}

export interface VerdictProps {
    variant: ComponentVariantMap['verdict'];
    productData: Record<string, unknown>;
}

export interface SimulatorsProps {
    variant: ComponentVariantMap['simulators'];
    productData: Record<string, unknown>;
}

export interface SpecsProps {
    variant: ComponentVariantMap['specs'];
    productData: Record<string, unknown>;
}

export interface BundleProps {
    variant: ComponentVariantMap['bundle'];
    productData: Record<string, unknown>;
}
