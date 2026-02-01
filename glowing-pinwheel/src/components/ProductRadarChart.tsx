'use client';

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

// ============================================
// PRODUCT DNA RADAR CHART
// ============================================

export interface ProductDNAData {
    /** Label for the dimension */
    dimension: string;
    /** Score 0-10 */
    score: number;
    /** Full score for chart */
    fullMark: number;
    /** Optional reason/justification for this score */
    reason?: string;
}

interface ProductRadarChartProps {
    /** Product name for legend */
    productName: string;
    /** Data points for radar */
    data: ProductDNAData[];
    /** Optional comparison product */
    comparisonData?: ProductDNAData[];
    /** Comparison product name */
    comparisonName?: string;
    /** Custom class */
    className?: string;
}

/**
 * Product DNA Radar Chart
 * 
 * Visual representation of product strengths across 10 key dimensions.
 * Users can "bater o olho" and understand if a product is balanced or focused.
 */
export function ProductRadarChart({
    productName,
    data,
    comparisonData,
    comparisonName,
    className,
}: ProductRadarChartProps) {
    // Custom tooltip - Enhanced for Unified Voice (exibe justificativas da IA)
    const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; payload: ProductDNAData }> }) => {
        if (active && payload && payload.length) {
            const p = payload[0].payload;
            return (
                <div className="bg-white px-4 py-3 rounded-lg shadow-xl border border-gray-200 max-w-xs">
                    <p className="font-semibold text-text-primary text-sm mb-1">{p.dimension}</p>
                    <div className="flex items-center gap-2 mb-2">
                        <span className={cn(
                            'text-lg font-bold',
                            payload[0].value >= 8 ? 'text-emerald-600' :
                                payload[0].value >= 6 ? 'text-amber-600' : 'text-red-600'
                        )}>
                            {payload[0].value.toFixed(1)}
                        </span>
                        <span className="text-text-muted text-xs">/10</span>
                    </div>
                    {p.reason && (
                        <p className="text-xs text-text-secondary leading-relaxed border-t border-gray-100 pt-2">
                            {p.reason}
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <section className={cn('py-8', className)}>
            {/* Section Header */}
            <div className="mb-4">
                <h2 className="font-display text-xl font-semibold text-text-primary flex items-center gap-2">
                    🧬 DNA do Produto
                </h2>
                <p className="text-sm text-text-muted mt-1">
                    Visão geral das forças e fraquezas em 10 dimensões
                </p>
            </div>

            {/* Radar Chart Container */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6">
                <div className="h-[320px] md:h-[380px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={data} cx="50%" cy="50%" outerRadius="80%">
                            {/* Grid */}
                            <PolarGrid
                                stroke="#e5e7eb"
                                strokeDasharray="3 3"
                            />

                            {/* Dimension Labels */}
                            <PolarAngleAxis
                                dataKey="dimension"
                                tick={{
                                    fill: '#64748b',
                                    fontSize: 11,
                                    fontWeight: 500,
                                }}
                                tickLine={false}
                            />

                            {/* Score Scale (hidden numbers) */}
                            <PolarRadiusAxis
                                angle={90}
                                domain={[0, 10]}
                                tick={false}
                                axisLine={false}
                            />

                            {/* Note: Comparison feature requires merged data approach */}

                            {/* Main Product */}
                            <Radar
                                name={productName}
                                dataKey="score"
                                stroke="#3b82f6"
                                fill="url(#radarGradient)"
                                fillOpacity={0.6}
                                strokeWidth={2}
                                dot={{ r: 4, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                                activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                            />

                            {/* Gradient Definition */}
                            <defs>
                                <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                </linearGradient>
                            </defs>

                            {/* Tooltip */}
                            <Tooltip content={<CustomTooltip />} />

                            {/* Legend (only if comparison) */}
                            {comparisonData && (
                                <Legend
                                    wrapperStyle={{ fontSize: '12px' }}
                                    iconType="circle"
                                />
                            )}
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                {/* Subtle interaction hint */}
                <p className="text-center text-xs text-text-muted mt-2">
                    💡 Passe o mouse sobre os pontos para ver detalhes
                </p>
            </div>
        </section>
    );
}

// ============================================
// HELPER: Generate default DNA from scores
// ============================================

export function generateProductDNA(scores: Record<string, number>): ProductDNAData[] {
    const dimensionLabels: Record<string, string> = {
        'costBenefit': '💰 Custo-Benefício',
        'performance': '⚡ Desempenho',
        'display': '🖥️ Tela/Imagem',
        'build': '🔧 Construção',
        'features': '⚙️ Funcionalidades',
    };

    return Object.entries(dimensionLabels).map(([key, label]) => ({
        dimension: label,
        score: scores[key] ?? 7,
        fullMark: 10,
    }));
}

// ============================================
// HELPER: Extract DNA from product benchmarks
// ============================================

export function extractDNAFromProduct(product: {
    categoryId?: string;
    brand?: string;
    computed?: { qs?: number; vs?: number; gs?: number; overall?: number };
    scores?: Record<string, number>;
    scoreReasons?: Record<string, string>;
    specs?: Record<string, unknown>;
    attributes?: Record<string, unknown>;
    price?: number;
}): ProductDNAData[] {
    // Category-specific dimension labels (c1-c10)
    // IMPORTANT: These MUST match the criteria order in src/data/products.ts
    const categoryLabels: Record<string, Record<string, string>> = {
        tv: {
            // TV criteria matching products.ts definitions
            c1: '💰 Custo-Benefício',
            c2: '🔲 Processamento',
            c3: '🛡️ Confiabilidade',
            c4: '📱 Fluidez Sistema',
            c5: '🎮 Gaming',
            c6: '☀️ Brilho',
            c7: '🔧 Pós-Venda',
            c8: '🔊 Som',
            c9: '🔌 Conectividade',
            c10: '✨ Design',
        },
        fridge: {
            // FRIDGE criteria matching products.ts definitions
            c1: '💰 Custo-Benefício',
            c2: '⚡ Eficiência Energética',
            c3: '📦 Capacidade',
            c4: '❄️ Refrigeração',
            c5: '🛡️ Confiabilidade',
            c6: '🔇 Nível de Ruído',
            c7: '🔧 Pós-Venda',
            c8: '📱 Recursos Smart',
            c9: '✨ Design',
            c10: '⚙️ Funcionalidades',
        },
        geladeira: {
            // Alias for fridge - same mapping
            c1: '💰 Custo-Benefício',
            c2: '⚡ Eficiência Energética',
            c3: '📦 Capacidade',
            c4: '❄️ Refrigeração',
            c5: '🛡️ Confiabilidade',
            c6: '🔇 Nível de Ruído',
            c7: '🔧 Pós-Venda',
            c8: '📱 Recursos Smart',
            c9: '✨ Design',
            c10: '⚙️ Funcionalidades',
        },
        air_conditioner: {
            // AC criteria matching products.ts definitions
            c1: '💰 Custo-Benefício',
            c2: '⚡ Eficiência',
            c3: '❄️ Capacidade BTU',
            c4: '🛡️ Durabilidade',
            c5: '🔇 Silêncio',
            c6: '🔄 Inverter',
            c7: '🔧 Pós-Venda',
            c8: '🛡️ Filtros',
            c9: '📱 Conectividade',
            c10: '✨ Design',
        },
        laptop: {
            // LAPTOP_CATEGORY criteria from categories.ts
            c1: '💻 Desempenho CPU',
            c2: '🎮 Desempenho GPU',
            c3: '🖥️ Qualidade da Tela',
            c4: '🔋 Bateria',
            c5: '📐 Construção',
            c6: '⌨️ Teclado/Trackpad',
            c7: '💰 Custo-Benefício',
            c8: '💾 Armazenamento/RAM',
            c9: '🌡️ Ruído/Temperatura',
            c10: '🔌 Conectividade',
        },
        'robot-vacuum': {
            // PARR-BR criteria for Robot Vacuums
            c1: 'Navegação',           // Navegação & Mapeamento
            c2: 'Aplicativo',          // Software & Conectividade
            c3: 'Limpeza Úmida',       // Eficiência de Mop
            c4: 'Escovas',             // Engenharia de Escovas
            c5: 'Altura',              // Restrições Físicas
            c6: 'Manutenção',          // Manutenibilidade
            c7: 'Bateria',             // Autonomia
            c8: 'Silêncio',            // Acústica
            c9: 'Base',                // Automação/Docks
            c10: 'Inteligência',       // Recursos IA
        },
        smartphone: {
            // 10 Dores Brasil - Smartphones (Jan 2026)
            c1: '🔋 Autonomia Real',    // IARSE 20%
            c2: '📱 Software',          // ESMI 15%
            c3: '💰 Custo-Benefício',   // RCBIRV 15%
            c4: '📸 Câmera Social',     // QFSR 10%
            c5: '🛡️ Resiliência',       // RFCT 10%
            c6: '🖥️ Tela',              // QDAE 8%
            c7: '🔧 Pós-Venda',         // EPST 8%
            c8: '📡 Conectividade',     // CPI 7%
            c9: '💾 Armazenamento',     // AGD 5%
            c10: '✨ Recursos',         // IFM 2%
        },
        air_fryer: {
            // 10 Critérios Air Fryer Brasil (Jan 2026)
            c1: '🍳 Capacidade',        // Litros/kg – quantas porções de alimento
            c2: '⚡ Potência',            // Watts – velocidade de preparo
            c3: '🔥 Fritura Uniforme',   // Qualidade de cozimento
            c4: '🛡️ Construção',        // Durabilidade dos materiais
            c5: '👌 Facilidade de Uso', // Controles, display, usabilidade
            c6: '🍽️ Acessórios',         // Grelhas extras, separadores
            c7: '🔇 Ruído',              // dB durante operação
            c8: '💰 Custo-Benefício',   // Valor x recursos
            c9: '✨ Design',            // Estética e compacidade
            c10: '🧹 Limpeza',           // Antiaderente, lava-louças
        },
    };

    // Get labels for this category (fallback to TV)
    const labels = categoryLabels[product.categoryId || 'tv'] || categoryLabels.tv;
    const scores = product.scores || {};
    const reasons = product.scoreReasons || {};
    const specs = product.specs || {};
    const attrs = product.attributes || {};
    const brand = product.brand || '';
    const price = product.price || 0;
    const categoryId = product.categoryId || 'tv';

    // Smart reason generator based on actual product data
    // RULE: All messages must be INFORMATIVE STATEMENTS, never calls to action
    const getSmartReason = (criteriaId: string, score: number): string => {
        // TV-specific smart reasons
        if (categoryId === 'tv') {
            switch (criteriaId) {
                case 'c1': // Custo-Benefício
                    if (score >= 9) return `Preço competitivo de R$${price.toLocaleString('pt-BR')} para os recursos oferecidos.`;
                    if (score >= 8) return `Boa relação custo-benefício na categoria.`;
                    return `Posicionado no segmento premium da categoria.`;
                case 'c2': // Processamento
                    return `Processador ${brand} para upscaling e otimização de imagem.`;
                case 'c3': // Confiabilidade
                    return `${brand} com histórico sólido. Garantia de fábrica inclusa.`;
                case 'c4': // Sistema
                    const platform = attrs.smartPlatform || specs.smartPlatform || 'Sistema Smart';
                    return `${platform} com apps integrados e atualizações.`;
                case 'c5': // Gaming
                    const inputLag = attrs.responseTime || specs.responseTime;
                    const hdmi21 = Number(attrs.hdmi21Ports) || 0;
                    if (hdmi21 > 0) return `${hdmi21}x HDMI 2.1 para PS5/Xbox. Input lag de ${inputLag || '<10'}ms.`;
                    return `Adequado para jogos casuais. Sem suporte HDMI 2.1.`;
                case 'c6': // Brilho
                    const brightness = attrs.brightness || specs.brightness;
                    if (brightness) return `Brilho de ${brightness} nits. ${Number(brightness) >= 1000 ? 'Ótimo para salas claras.' : 'Ideal para ambientes escuros.'}`;
                    return `Brilho adequado para uso geral.`;
                case 'c7': // Pós-Venda
                    return `${brand} com rede de assistência técnica no Brasil.`;
                case 'c8': // Som
                    const speakers = attrs.speakers || specs.speakers;
                    if (speakers) return `Sistema de som ${speakers}.`;
                    return `Som integrado para uso básico.`;
                case 'c9': // Conectividade
                    const hdmiPorts = specs.hdmiPorts || attrs.hdmiPorts;
                    if (hdmiPorts) return `${hdmiPorts} portas HDMI disponíveis.`;
                    return `Conectividade completa com WiFi e Bluetooth.`;
                case 'c10': // Design
                    const panelType = specs.panelType || attrs.panelType;
                    if (panelType === 'OLED') return `Design ultrafino OLED premium.`;
                    return `Acabamento ${brand} com bordas reduzidas.`;
            }
        }

        // Fridge-specific smart reasons
        if (categoryId === 'fridge') {
            switch (criteriaId) {
                case 'c1': return price > 10000 ? `Produto premium com recursos avançados.` : `Preço competitivo de R$${price.toLocaleString('pt-BR')}.`;
                case 'c2': // Eficiência
                    const energia = attrs.energyClass || specs.energyClass;
                    if (energia) return `Classificação energética ${energia}.`;
                    return `Consumo energético dentro da média da categoria.`;
                case 'c3': // Capacidade
                    const cap = specs.capacity || attrs.capacity;
                    if (cap) return `Capacidade de ${cap}L para armazenamento.`;
                    return `Capacidade adequada para famílias médias.`;
                case 'c4': return `Sistema de refrigeração ${brand}.`;
                case 'c5': return `${brand} com histórico de durabilidade.`;
                case 'c6': return `Ruído operacional dentro dos padrões.`;
                case 'c7': return `${brand} com assistência técnica no Brasil.`;
                case 'c8':
                    if (attrs.smartFeatures || attrs.wifi) return `Recursos smart com conectividade WiFi.`;
                    return `Modelo convencional sem recursos smart.`;
                case 'c9': return `Design ${brand} moderno.`;
                case 'c10': return `Inclui dispenser e prateleiras ajustáveis.`;
            }
        }

        // Air Conditioner smart reasons
        if (categoryId === 'air_conditioner') {
            switch (criteriaId) {
                case 'c1': return `Preço de R$${price.toLocaleString('pt-BR')} para a capacidade oferecida.`;
                case 'c2':
                    const inverter = attrs.inverter || specs.inverter;
                    if (inverter) return `Tecnologia Inverter para economia de até 60%.`;
                    return `Modelo convencional com consumo padrão.`;
                case 'c3':
                    const btus = specs.btus || attrs.btus;
                    if (btus) return `Capacidade de ${btus} BTUs.`;
                    return `Capacidade adequada para ambientes médios.`;
                case 'c4': return `${brand} com durabilidade comprovada.`;
                case 'c5':
                    const decibels = attrs.noiseLevel || specs.noiseLevel;
                    if (decibels) return `Nível de ruído de ${decibels}dB.`;
                    return `Ruído operacional normal para a categoria.`;
                case 'c6': return attrs.inverter ? `Compressor Inverter silencioso.` : `Compressor convencional.`;
                case 'c7': return `Filtros antibacterianos inclusos.`;
                case 'c8': return `Instalação padrão split.`;
                case 'c9': return attrs.wifi ? `Controle via app WiFi.` : `Controle por controle remoto incluso.`;
                case 'c10': return `Design compacto ${brand}.`;
            }
        }

        // Robot Vacuum smart reasons (PARR-BR criteria)
        if (categoryId === 'robot-vacuum') {
            switch (criteriaId) {
                case 'c1': // Navegação
                    const navType = attrs.navigationType || specs.navigationType;
                    if (navType === 'random') return `Navegação aleatória "bate-volta". Ineficiente para casas >50m².`;
                    if (navType === 'lidar') return `LiDAR: padrão ouro em navegação. Mapeia e planeja rotas eficientes.`;
                    if (navType === 'camera') return `VSLAM (câmera): navegação inteligente sem torre externa.`;
                    return `Score baseado no tipo de navegação e mapeamento.`;
                case 'c2': // App/Voz
                    const alexa = attrs.alexaSupport || attrs.hasAlexa;
                    const google = attrs.googleSupport || attrs.hasGoogle;
                    if (alexa && google) return `Compatível com Alexa e Google. Controle por voz facilitado.`;
                    if (alexa || google) return `Integração com assistente de voz disponível.`;
                    return `App de controle básico disponível.`;
                case 'c3': // Mop
                    const mopType = attrs.mopType || specs.mopType;
                    if (mopType === 'vibrating' || mopType === 'sonic') return `Mop vibratório: esfrega manchas ativamente.`;
                    if (mopType === 'rotating') return `Mop rotativo duplo: boa remoção de sujeira.`;
                    if (mopType === 'passive_drag') return `Mop passivo: apenas arrasta pano úmido, não esfrega.`;
                    return `Sistema de mop incluso para limpeza úmida.`;
                case 'c4': // Escovas
                    const brushType = attrs.brushType || specs.brushType;
                    if (brushType === 'rubber' || brushType === 'silicone') return `Escova 100% borracha: não enrola cabelo/pelo.`;
                    if (brushType === 'mixed_bristle') return `Escova de cerdas: enrola cabelo, exige limpeza frequente.`;
                    return `Design de escova padrão para aspiração.`;
                case 'c5': // Altura
                    const height = attrs.height || specs.height;
                    if (height && Number(height) < 8) return `Perfil baixo de ${height}cm: passa sob móveis baixos.`;
                    if (height && Number(height) > 9.5) return `Altura de ${height}cm: pode travar sob sofás.`;
                    return `Altura adequada para maioria dos ambientes.`;
                case 'c6': // Peças
                    if (brand === 'WAP' || brand === 'Electrolux') return `${brand}: marca nacional com peças fáceis de encontrar.`;
                    return `Verifique disponibilidade de peças de reposição no Brasil.`;
                case 'c7': // Bateria
                    const battery = attrs.batteryLife || specs.batteryLife;
                    const resume = attrs.hasRechargeResume || specs.hasRechargeResume;
                    if (resume) return `Função Recharge & Resume: carrega e volta a limpar.`;
                    if (battery) return `Autonomia de ${battery} minutos por ciclo.`;
                    return `Bateria padrão para limpeza de áreas médias.`;
                case 'c8': // Ruído
                    const dbLevel = attrs.noiseLevel || specs.noiseLevel;
                    if (dbLevel) return `Nível de ruído: ${dbLevel}dB durante operação.`;
                    return `Ruído operacional dentro da média da categoria.`;
                case 'c9': // Base
                    const autoEmpty = attrs.hasAutoEmpty || specs.hasAutoEmpty;
                    const mopWash = attrs.hasMopWash || specs.hasMopWash;
                    if (autoEmpty && mopWash) return `Base completa: auto-esvaziamento + lavagem de mop.`;
                    if (autoEmpty) return `Base auto-esvaziante: semanas sem esvaziar.`;
                    return `Base básica: requer esvaziamento manual.`;
                case 'c10': // IA
                    const hasAI = attrs.hasAIDetection || specs.hasAIDetection;
                    if (hasAI) return `IA frontal: detecta obstáculos como cabos e fezes.`;
                    return `Detecção básica de obstáculos por sensores.`;
            }
        }

        // Generic fallback - informative statements only
        const cleanLabel = labels[criteriaId]?.replace(/^[^\s]+ /, '') || 'Este critério';
        if (score >= 9) return `Excelente ${cleanLabel.toLowerCase()}: nota ${score.toFixed(1)}.`;
        if (score >= 8) return `${cleanLabel} acima da média da categoria.`;
        if (score >= 7) return `${cleanLabel} adequado para uso geral.`;
        return `${cleanLabel} na média do segmento.`;
    };

    // Helper to get reason (explicit or smart-generated)
    const getReason = (criteriaId: string, score: number): string => {
        return reasons[criteriaId] || getSmartReason(criteriaId, score);
    };

    // Generate all 10 criteria with reasons
    const c1Score = Math.min(10, Math.max(0, scores.c1 ?? 7));
    const c2Score = Math.min(10, Math.max(0, scores.c2 ?? 7));
    const c3Score = Math.min(10, Math.max(0, scores.c3 ?? 7));
    const c4Score = Math.min(10, Math.max(0, scores.c4 ?? 7));
    const c5Score = Math.min(10, Math.max(0, scores.c5 ?? 7));
    const c6Score = Math.min(10, Math.max(0, scores.c6 ?? 7));
    const c7Score = Math.min(10, Math.max(0, scores.c7 ?? 7));
    const c8Score = Math.min(10, Math.max(0, scores.c8 ?? 7));
    const c9Score = Math.min(10, Math.max(0, scores.c9 ?? 7));
    const c10Score = Math.min(10, Math.max(0, scores.c10 ?? 7));

    return [
        { dimension: labels.c1, score: c1Score, fullMark: 10, reason: getReason('c1', c1Score) },
        { dimension: labels.c2, score: c2Score, fullMark: 10, reason: getReason('c2', c2Score) },
        { dimension: labels.c3, score: c3Score, fullMark: 10, reason: getReason('c3', c3Score) },
        { dimension: labels.c4, score: c4Score, fullMark: 10, reason: getReason('c4', c4Score) },
        { dimension: labels.c5, score: c5Score, fullMark: 10, reason: getReason('c5', c5Score) },
        { dimension: labels.c6, score: c6Score, fullMark: 10, reason: getReason('c6', c6Score) },
        { dimension: labels.c7, score: c7Score, fullMark: 10, reason: getReason('c7', c7Score) },
        { dimension: labels.c8, score: c8Score, fullMark: 10, reason: getReason('c8', c8Score) },
        { dimension: labels.c9, score: c9Score, fullMark: 10, reason: getReason('c9', c9Score) },
        { dimension: labels.c10, score: c10Score, fullMark: 10, reason: getReason('c10', c10Score) },
    ];
}

