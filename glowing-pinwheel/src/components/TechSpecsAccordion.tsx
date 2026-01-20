'use client';

import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface SpecItem {
    name: string;
    value: string | number | boolean;
    unit?: string;
}

export interface SpecCategory {
    title: string;
    icon?: React.ReactNode;
    specs: SpecItem[];
}

interface TechSpecsAccordionProps {
    categories: SpecCategory[];
    productName: string;
    className?: string;
    defaultOpen?: boolean; // Open by default on desktop
}

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * TechSpecsAccordion - Fichas Técnicas Completas
 * 
 * Implementado seguindo o Relatório Estratégico:
 * - HTML5 <details>/<summary> para SEO (conteúdo indexável)
 * - CSS content-visibility: auto para Core Web Vitals
 * - Tabelas acessíveis com scope="row"
 * - Agrupamento por categorias
 */
export function TechSpecsAccordion({
    categories,
    productName,
    className,
    defaultOpen = false
}: TechSpecsAccordionProps) {

    if (categories.length === 0) return null;

    return (
        <section
            className={cn('tech-specs-accordion', className)}
            aria-label={`Especificações técnicas de ${productName}`}
        >
            {/* SEO: H2 for section */}
            <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                📋 Ficha Técnica Completa
            </h2>

            <div className="space-y-3">
                {categories.map((category, idx) => (
                    <details
                        key={idx}
                        className={cn(
                            'group rounded-xl border border-gray-200 bg-white overflow-hidden',
                            'transition-shadow hover:shadow-sm',
                            '[&[open]]:shadow-md [&[open]]:border-brand-core/30'
                        )}
                        open={defaultOpen && idx === 0} // First one open on desktop
                    >
                        {/* Summary - Clickable Header */}
                        <summary
                            className={cn(
                                'flex items-center justify-between p-4 cursor-pointer',
                                'bg-gray-50 hover:bg-gray-100 transition-colors',
                                'list-none [&::-webkit-details-marker]:hidden',
                                'select-none'
                            )}
                        >
                            <span className="flex items-center gap-2 font-semibold text-text-primary">
                                {category.icon}
                                {category.title}
                            </span>
                            <ChevronDown
                                size={20}
                                className="text-text-muted transition-transform group-open:rotate-180"
                            />
                        </summary>

                        {/* Content - Specification Table */}
                        <div
                            className="p-4 border-t border-gray-100"
                            style={{ contentVisibility: 'auto' }} // Core Web Vitals optimization
                        >
                            <table
                                className="w-full text-sm"
                                role="table"
                                aria-label={`${category.title} de ${productName}`}
                            >
                                <tbody>
                                    {category.specs.map((spec, specIdx) => (
                                        <tr
                                            key={specIdx}
                                            className={cn(
                                                'border-b border-gray-50 last:border-0',
                                                specIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                            )}
                                        >
                                            {/* Label - Accessible header */}
                                            <th
                                                scope="row"
                                                className="py-2.5 px-3 text-left font-medium text-text-secondary w-1/2"
                                            >
                                                {spec.name}
                                            </th>
                                            {/* Value */}
                                            <td className="py-2.5 px-3 text-right font-semibold text-text-primary">
                                                {formatSpecValue(spec.value)}
                                                {spec.unit && (
                                                    <span className="text-text-muted ml-1 text-xs">
                                                        {spec.unit}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </details>
                ))}
            </div>

            {/* Disclaimer - Data Governance (as per GSMArena best practice) */}
            <p className="mt-4 text-xs text-text-muted italic">
                * Especificações podem variar conforme região e versão do produto.
                Consulte o fabricante para informações oficiais.
            </p>
        </section>
    );
}

// ============================================
// HELPERS
// ============================================

function formatSpecValue(value: string | number | boolean): string {
    if (typeof value === 'boolean') {
        return value ? 'Sim' : 'Não';
    }
    return String(value);
}

// ============================================
// HELPER: Generate Categories from Product Data
// ============================================

export function generateSpecCategories(product: Record<string, unknown>): SpecCategory[] {
    const categories: SpecCategory[] = [];
    const categoryId = product.categoryId as string;
    const techSpecs = (product.technicalSpecs || {}) as Record<string, unknown>;

    // ============================================
    // FRIDGE SPECS (categoryId === 'fridge')
    // ============================================
    if (categoryId === 'fridge') {
        // Refrigeration Category
        const refrigerationSpecs: SpecItem[] = [];
        if (techSpecs.capacityLitres) refrigerationSpecs.push({ name: 'Capacidade Total', value: techSpecs.capacityLitres as number, unit: 'litros' });
        if (techSpecs.freezerCapacity) refrigerationSpecs.push({ name: 'Capacidade do Freezer', value: techSpecs.freezerCapacity as number, unit: 'litros' });
        if (techSpecs.fridgeCapacity) refrigerationSpecs.push({ name: 'Capacidade do Refrigerador', value: techSpecs.fridgeCapacity as number, unit: 'litros' });
        if (techSpecs.technology) refrigerationSpecs.push({ name: 'Tecnologia', value: techSpecs.technology as string });
        if (techSpecs.coolingType) refrigerationSpecs.push({ name: 'Tipo de Refrigeração', value: techSpecs.coolingType as string });
        if (techSpecs.frostFree) refrigerationSpecs.push({ name: 'Frost Free', value: techSpecs.frostFree as boolean });

        if (refrigerationSpecs.length > 0) {
            categories.push({ title: 'Refrigeração', icon: '❄️', specs: refrigerationSpecs });
        }

        // Energy Category
        const energySpecs: SpecItem[] = [];
        if (techSpecs.consumption) energySpecs.push({ name: 'Consumo', value: techSpecs.consumption as string });
        if (techSpecs.energyClass) energySpecs.push({ name: 'Selo Procel', value: techSpecs.energyClass as string });
        if (techSpecs.voltage) energySpecs.push({ name: 'Voltagem', value: techSpecs.voltage as string });
        if (techSpecs.inverter) energySpecs.push({ name: 'Compressor Inverter', value: techSpecs.inverter as boolean });

        if (energySpecs.length > 0) {
            categories.push({ title: 'Energia', icon: '⚡', specs: energySpecs });
        }

        // Features Category
        const featureSpecs: SpecItem[] = [];
        if (techSpecs.finish) featureSpecs.push({ name: 'Acabamento', value: techSpecs.finish as string });
        if (techSpecs.icemaker) featureSpecs.push({ name: 'Fabricador de Gelo', value: techSpecs.icemaker as boolean });
        if (techSpecs.waterDispenser) featureSpecs.push({ name: 'Dispenser de Água', value: techSpecs.waterDispenser as boolean });
        if (techSpecs.twinCooling) featureSpecs.push({ name: 'Twin Cooling', value: techSpecs.twinCooling as boolean });
        if (techSpecs.flexZone) featureSpecs.push({ name: 'Flex Zone', value: techSpecs.flexZone as boolean });
        if (techSpecs.smartFeatures) featureSpecs.push({ name: 'Recursos Smart', value: techSpecs.smartFeatures as boolean });

        if (featureSpecs.length > 0) {
            categories.push({ title: 'Recursos', icon: '✨', specs: featureSpecs });
        }

        // Dimensions Category
        const dimensionSpecs: SpecItem[] = [];
        if (techSpecs.height) dimensionSpecs.push({ name: 'Altura', value: techSpecs.height as number, unit: 'cm' });
        if (techSpecs.width) dimensionSpecs.push({ name: 'Largura', value: techSpecs.width as number, unit: 'cm' });
        if (techSpecs.depth) dimensionSpecs.push({ name: 'Profundidade', value: techSpecs.depth as number, unit: 'cm' });
        if (techSpecs.weight) dimensionSpecs.push({ name: 'Peso', value: techSpecs.weight as number, unit: 'kg' });

        if (dimensionSpecs.length > 0) {
            categories.push({ title: 'Dimensões', icon: '📐', specs: dimensionSpecs });
        }

        return categories;
    }

    // ============================================
    // AIR CONDITIONER SPECS (categoryId === 'air_conditioner')
    // ============================================
    if (categoryId === 'air_conditioner') {
        // Cooling Category
        const coolingSpecs: SpecItem[] = [];
        if (techSpecs.btus) coolingSpecs.push({ name: 'Capacidade', value: techSpecs.btus as number, unit: 'BTUs' });
        if (techSpecs.cycleType) coolingSpecs.push({ name: 'Ciclo', value: techSpecs.cycleType as string });
        if (techSpecs.inverter) coolingSpecs.push({ name: 'Inverter', value: techSpecs.inverter as boolean });
        if (techSpecs.voltage) coolingSpecs.push({ name: 'Voltagem', value: techSpecs.voltage as string });

        if (coolingSpecs.length > 0) {
            categories.push({ title: 'Refrigeração', icon: '❄️', specs: coolingSpecs });
        }

        // Energy Category
        const energySpecs: SpecItem[] = [];
        if (techSpecs.consumption) energySpecs.push({ name: 'Consumo', value: techSpecs.consumption as string });
        if (techSpecs.energyClass) energySpecs.push({ name: 'Selo Procel', value: techSpecs.energyClass as string });
        if (techSpecs.seer) energySpecs.push({ name: 'SEER', value: techSpecs.seer as number });

        if (energySpecs.length > 0) {
            categories.push({ title: 'Energia', icon: '⚡', specs: energySpecs });
        }

        // Noise Category
        const noiseSpecs: SpecItem[] = [];
        if (techSpecs.noiseLevel) noiseSpecs.push({ name: 'Nível de Ruído', value: techSpecs.noiseLevel as number, unit: 'dB' });
        if (techSpecs.airFlow) noiseSpecs.push({ name: 'Vazão de Ar', value: techSpecs.airFlow as number, unit: 'm³/h' });

        if (noiseSpecs.length > 0) {
            categories.push({ title: 'Ruído & Desempenho', icon: '🔊', specs: noiseSpecs });
        }

        // Features Category
        const featureSpecs: SpecItem[] = [];
        if (techSpecs.wifi) featureSpecs.push({ name: 'Wi-Fi', value: techSpecs.wifi as boolean });
        if (techSpecs.filter) featureSpecs.push({ name: 'Tipo de Filtro', value: techSpecs.filter as string });
        if (techSpecs.timer) featureSpecs.push({ name: 'Timer', value: techSpecs.timer as boolean });

        if (featureSpecs.length > 0) {
            categories.push({ title: 'Recursos', icon: '✨', specs: featureSpecs });
        }

        return categories;
    }

    // ============================================
    // ROBOT VACUUM SPECS (categoryId === 'robot-vacuum')
    // ============================================
    if (categoryId === 'robot-vacuum') {
        // Cleaning Performance Category
        const cleaningSpecs: SpecItem[] = [];
        if (techSpecs.suctionPower) cleaningSpecs.push({ name: 'Potência de Sucção', value: techSpecs.suctionPower as number, unit: 'Pa' });
        if (techSpecs.dustbinCapacity) cleaningSpecs.push({ name: 'Capacidade do Reservatório (pó)', value: techSpecs.dustbinCapacity as number, unit: 'ml' });
        if (techSpecs.waterTankCapacity) cleaningSpecs.push({ name: 'Capacidade do Reservatório (água)', value: techSpecs.waterTankCapacity as number, unit: 'ml' });
        if (techSpecs.mopType) cleaningSpecs.push({ name: 'Tipo de Mop', value: techSpecs.mopType as string });
        if (techSpecs.brushType) cleaningSpecs.push({ name: 'Tipo de Escova', value: techSpecs.brushType as string });
        if (techSpecs.filterType) cleaningSpecs.push({ name: 'Filtro', value: techSpecs.filterType as string });

        if (cleaningSpecs.length > 0) {
            categories.push({ title: 'Limpeza', icon: '🧹', specs: cleaningSpecs });
        }

        // Navigation Category
        const navigationSpecs: SpecItem[] = [];
        if (techSpecs.navigation) navigationSpecs.push({ name: 'Tipo de Navegação', value: techSpecs.navigation as string });
        if (techSpecs.mapping) navigationSpecs.push({ name: 'Mapeamento', value: techSpecs.mapping as boolean });
        if (techSpecs.lidar) navigationSpecs.push({ name: 'LiDAR', value: techSpecs.lidar as boolean });
        if (techSpecs.camera) navigationSpecs.push({ name: 'Câmera', value: techSpecs.camera as boolean });
        if (techSpecs.obstacleDetection) navigationSpecs.push({ name: 'Detecção de Obstáculos', value: techSpecs.obstacleDetection as string });
        if (techSpecs.climbHeight) navigationSpecs.push({ name: 'Transpõe Obstáculos', value: techSpecs.climbHeight as number, unit: 'mm' });

        if (navigationSpecs.length > 0) {
            categories.push({ title: 'Navegação', icon: '🗺️', specs: navigationSpecs });
        }

        // Battery Category
        const batterySpecs: SpecItem[] = [];
        if (techSpecs.runtime) batterySpecs.push({ name: 'Autonomia', value: techSpecs.runtime as string });
        if (techSpecs.batteryCapacity) batterySpecs.push({ name: 'Capacidade da Bateria', value: techSpecs.batteryCapacity as number, unit: 'mAh' });
        if (techSpecs.chargingTime) batterySpecs.push({ name: 'Tempo de Carga', value: techSpecs.chargingTime as string });
        if (techSpecs.autoRecharge) batterySpecs.push({ name: 'Recarga Automática', value: techSpecs.autoRecharge as boolean });
        if (techSpecs.rechargeResume) batterySpecs.push({ name: 'Recharge & Resume', value: techSpecs.rechargeResume as boolean });

        if (batterySpecs.length > 0) {
            categories.push({ title: 'Bateria', icon: '🔋', specs: batterySpecs });
        }

        // Connectivity Category
        const connectivitySpecs: SpecItem[] = [];
        if (techSpecs.wifi) connectivitySpecs.push({ name: 'Wi-Fi', value: techSpecs.wifi as boolean });
        if (techSpecs.appControl) connectivitySpecs.push({ name: 'Controle por App', value: techSpecs.appControl as boolean });
        if (techSpecs.voiceControl) connectivitySpecs.push({ name: 'Controle por Voz', value: techSpecs.voiceControl as string });
        if (techSpecs.scheduling) connectivitySpecs.push({ name: 'Agendamento', value: techSpecs.scheduling as boolean });

        if (connectivitySpecs.length > 0) {
            categories.push({ title: 'Conectividade', icon: '📱', specs: connectivitySpecs });
        }

        // Dock Category
        const dockSpecs: SpecItem[] = [];
        if (techSpecs.dockType) dockSpecs.push({ name: 'Tipo de Base', value: techSpecs.dockType as string });
        if (techSpecs.autoEmpty) dockSpecs.push({ name: 'Auto-Esvaziamento', value: techSpecs.autoEmpty as boolean });
        if (techSpecs.autoMopWash) dockSpecs.push({ name: 'Lavagem Automática do Mop', value: techSpecs.autoMopWash as boolean });
        if (techSpecs.autoRefill) dockSpecs.push({ name: 'Reabastecimento Automático', value: techSpecs.autoRefill as boolean });

        if (dockSpecs.length > 0) {
            categories.push({ title: 'Base/Dock', icon: '🏠', specs: dockSpecs });
        }

        // Dimensions Category
        const dimensionSpecs: SpecItem[] = [];
        if (techSpecs.height) dimensionSpecs.push({ name: 'Altura', value: techSpecs.height as number, unit: 'cm' });
        if (techSpecs.diameter) dimensionSpecs.push({ name: 'Diâmetro', value: techSpecs.diameter as number, unit: 'cm' });
        if (techSpecs.weight) dimensionSpecs.push({ name: 'Peso', value: techSpecs.weight as number, unit: 'kg' });
        if (techSpecs.noiseLevel) dimensionSpecs.push({ name: 'Nível de Ruído', value: techSpecs.noiseLevel as number, unit: 'dB' });
        if (techSpecs.power) dimensionSpecs.push({ name: 'Potência', value: techSpecs.power as number, unit: 'W' });

        if (dimensionSpecs.length > 0) {
            categories.push({ title: 'Dimensões', icon: '📐', specs: dimensionSpecs });
        }

        return categories;
    }

    // ============================================
    // TV SPECS (default - including categoryId === 'tv')
    // ============================================

    // Display Category
    const displaySpecs: SpecItem[] = [];
    if (product.screenSize) displaySpecs.push({ name: 'Tamanho da Tela', value: product.screenSize as number, unit: 'polegadas' });
    if (product.resolution) displaySpecs.push({ name: 'Resolução', value: product.resolution as string });
    if (product.panelType) {
        // Add panel type with SIZE VARIATION WARNING for Samsung Neo QLED
        const panelNote = (product.brand === 'Samsung' && product.panelType === 'ADS')
            ? `${product.panelType} (Nota: modelos 43"/50" usam VA)`
            : product.panelType as string;
        displaySpecs.push({ name: 'Tipo de Painel', value: panelNote });
    }
    if (product.refreshRate) {
        // Qualify refresh rate for console vs PC
        const refreshNote = Number(product.refreshRate) >= 144
            ? `${product.refreshRate}Hz (PC) / 120Hz (Consoles)`
            : `${product.refreshRate}Hz`;
        displaySpecs.push({ name: 'Taxa de Atualização', value: refreshNote });
    }
    if (product.brightness) displaySpecs.push({ name: 'Brilho Máximo', value: product.brightness as number, unit: 'nits' });
    if (product.contrastRatio) displaySpecs.push({ name: 'Contraste', value: product.contrastRatio as string });

    if (displaySpecs.length > 0) {
        categories.push({ title: 'Display', icon: '🖥️', specs: displaySpecs });
    }

    // HDR & Color
    const hdrSpecs: SpecItem[] = [];
    if (product.hdrSupport) {
        const hdrFormats = Array.isArray(product.hdrSupport) ? product.hdrSupport.join(', ') : product.hdrSupport;
        hdrSpecs.push({ name: 'Formatos HDR', value: hdrFormats as string });
    }
    if (product.colorGamut) hdrSpecs.push({ name: 'Gamut de Cores', value: product.colorGamut as string });
    if (product.localDimming) hdrSpecs.push({ name: 'Local Dimming', value: product.localDimming as boolean });

    if (hdrSpecs.length > 0) {
        categories.push({ title: 'HDR & Cores', icon: '🎨', specs: hdrSpecs });
    }

    // Connectivity
    const connectivitySpecs: SpecItem[] = [];
    if (product.hdmiPorts) connectivitySpecs.push({ name: 'Portas HDMI', value: product.hdmiPorts as number });
    if (product.hdmi21Ports) connectivitySpecs.push({ name: 'HDMI 2.1', value: product.hdmi21Ports as number });
    if (product.usbPorts) connectivitySpecs.push({ name: 'Portas USB', value: product.usbPorts as number });
    if (product.wifi) connectivitySpecs.push({ name: 'Wi-Fi', value: product.wifi as string });
    if (product.bluetooth) connectivitySpecs.push({ name: 'Bluetooth', value: product.bluetooth as string });
    if (product.ethernet) connectivitySpecs.push({ name: 'Ethernet', value: product.ethernet as boolean });

    if (connectivitySpecs.length > 0) {
        categories.push({ title: 'Conectividade', icon: '🔌', specs: connectivitySpecs });
    }

    // Smart Features
    const smartSpecs: SpecItem[] = [];
    if (product.smartPlatform) smartSpecs.push({ name: 'Plataforma Smart', value: product.smartPlatform as string });
    if (product.voiceAssistants) {
        const assistants = Array.isArray(product.voiceAssistants) ? product.voiceAssistants.join(', ') : product.voiceAssistants;
        smartSpecs.push({ name: 'Assistentes de Voz', value: assistants as string });
    }
    if (product.airPlay) smartSpecs.push({ name: 'AirPlay', value: product.airPlay as boolean });
    if (product.chromecast) smartSpecs.push({ name: 'Chromecast', value: product.chromecast as boolean });

    if (smartSpecs.length > 0) {
        categories.push({ title: 'Smart Features', icon: '📱', specs: smartSpecs });
    }

    // Audio
    const audioSpecs: SpecItem[] = [];
    if (product.speakerPower) audioSpecs.push({ name: 'Potência dos Alto-falantes', value: product.speakerPower as number, unit: 'W' });
    if (product.speakerConfig) audioSpecs.push({ name: 'Configuração', value: product.speakerConfig as string });
    if (product.dolbyAtmos) audioSpecs.push({ name: 'Dolby Atmos', value: product.dolbyAtmos as boolean });
    if (product.eARC) audioSpecs.push({ name: 'eARC', value: product.eARC as boolean });

    if (audioSpecs.length > 0) {
        categories.push({ title: 'Áudio', icon: '🔊', specs: audioSpecs });
    }

    // Physical
    const physicalSpecs: SpecItem[] = [];
    if (product.weight) physicalSpecs.push({ name: 'Peso (sem base)', value: product.weight as number, unit: 'kg' });
    if (product.dimensions) physicalSpecs.push({ name: 'Dimensões (L×A×P)', value: product.dimensions as string, unit: 'cm' });
    if (product.vesaMount) physicalSpecs.push({ name: 'VESA', value: product.vesaMount as string });
    if (product.powerConsumption) physicalSpecs.push({ name: 'Consumo de Energia', value: product.powerConsumption as number, unit: 'W' });
    if (product.energyClass) physicalSpecs.push({ name: 'Classe Energética', value: product.energyClass as string });

    if (physicalSpecs.length > 0) {
        categories.push({ title: 'Físico & Energia', icon: '📐', specs: physicalSpecs });
    }

    // Gaming
    const gamingSpecs: SpecItem[] = [];
    if (product.vrr) gamingSpecs.push({ name: 'VRR (Variable Refresh Rate)', value: product.vrr as boolean });
    if (product.allm) gamingSpecs.push({ name: 'ALLM (Auto Low Latency)', value: product.allm as boolean });
    if (product.inputLag) {
        // QUALIFY Input Lag: the marketed ~6ms is only for 120Hz
        // Real 60Hz values are typically 9-10ms
        const inputLagValue = Number(product.inputLag);
        let inputLagNote: string;
        if (inputLagValue <= 6) {
            // Marketing value is for 120Hz - show both
            inputLagNote = `~${inputLagValue}ms (120Hz) / ~10ms (60Hz)`;
        } else {
            // If higher, just show the value
            inputLagNote = `${inputLagValue}ms`;
        }
        gamingSpecs.push({ name: 'Input Lag (Game Mode)', value: inputLagNote });
    }
    if (product.gaming120Hz) gamingSpecs.push({ name: '4K@120Hz Gaming', value: product.gaming120Hz as boolean });

    if (gamingSpecs.length > 0) {
        categories.push({ title: 'Gaming', icon: '🎮', specs: gamingSpecs });
    }

    return categories;
}
