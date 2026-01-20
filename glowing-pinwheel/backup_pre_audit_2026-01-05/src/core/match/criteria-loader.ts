/**
 * ComparaMatch - Criteria Loader
 * 
 * Maps category slugs to their respective criteria JSON files
 */

import type { CriteriaConfig } from './types';

// Import all criteria configs
import tvsCriteria from './config/tvs-criteria.json';
import geladeirasriteria from './config/geladeiras-criteria.json';
import smartphonesCriteria from './config/smartphones-criteria.json';
import notebooksCriteria from './config/notebooks-criteria.json';
import arCondicionadosCriteria from './config/ar-condicionados-criteria.json';
import maquinasLavarCriteria from './config/maquinas-lavar-criteria.json';
import lavaSecaCriteria from './config/lava-seca-criteria.json';
import fogoesCriteria from './config/fogoes-criteria.json';
import cooktopsCriteria from './config/cooktops-criteria.json';
import microOndasCriteria from './config/micro-ondas-criteria.json';
import freezersCriteria from './config/freezers-criteria.json';
import lavaLoucasCriteria from './config/lava-loucas-criteria.json';
import monitoresCriteria from './config/monitores-criteria.json';
import consolesCriteria from './config/consoles-criteria.json';
import aspiradoresRoboCriteria from './config/aspiradores-robo-criteria.json';
import soundbarsCriteria from './config/soundbars-criteria.json';
import homeTheaterCriteria from './config/home-theater-criteria.json';
import fonesTwsCriteria from './config/fones-tws-criteria.json';
import headsetsGamerCriteria from './config/headsets-gamer-criteria.json';
import projetoresCriteria from './config/projetores-criteria.json';
import streamingDevicesCriteria from './config/streaming-devices-criteria.json';

/**
 * Map of category slugs to their criteria configurations
 */
const criteriaMap: Record<string, CriteriaConfig[]> = {
    // TVs
    'smart-tvs': tvsCriteria as CriteriaConfig[],
    'tvs': tvsCriteria as CriteriaConfig[],
    'televisores': tvsCriteria as CriteriaConfig[],

    // Geladeiras
    'geladeiras': geladeirasriteria as CriteriaConfig[],
    'refrigeradores': geladeirasriteria as CriteriaConfig[],

    // Celulares
    'smartphones': smartphonesCriteria as CriteriaConfig[],
    'celulares': smartphonesCriteria as CriteriaConfig[],

    // Notebooks
    'notebooks': notebooksCriteria as CriteriaConfig[],
    'laptops': notebooksCriteria as CriteriaConfig[],

    // Ar-condicionados
    'ar-condicionados': arCondicionadosCriteria as CriteriaConfig[],
    'ar-condicionado': arCondicionadosCriteria as CriteriaConfig[],
    'acs': arCondicionadosCriteria as CriteriaConfig[],

    // Máquinas de Lavar
    'maquinas-de-lavar': maquinasLavarCriteria as CriteriaConfig[],
    'maquinas-lavar': maquinasLavarCriteria as CriteriaConfig[],
    'lavadoras': maquinasLavarCriteria as CriteriaConfig[],

    // Lava e Seca
    'lava-e-seca': lavaSecaCriteria as CriteriaConfig[],
    'lava-seca': lavaSecaCriteria as CriteriaConfig[],

    // Fogões
    'fogoes': fogoesCriteria as CriteriaConfig[],

    // Cooktops
    'cooktops': cooktopsCriteria as CriteriaConfig[],

    // Micro-ondas
    'micro-ondas': microOndasCriteria as CriteriaConfig[],
    'microondas': microOndasCriteria as CriteriaConfig[],

    // Freezers
    'freezers': freezersCriteria as CriteriaConfig[],
    'congeladores': freezersCriteria as CriteriaConfig[],

    // Lava-louças
    'lava-loucas': lavaLoucasCriteria as CriteriaConfig[],
    'lava-louca': lavaLoucasCriteria as CriteriaConfig[],

    // Monitores
    'monitores': monitoresCriteria as CriteriaConfig[],

    // Consoles
    'consoles': consolesCriteria as CriteriaConfig[],
    'videogames': consolesCriteria as CriteriaConfig[],

    // Aspiradores Robô
    'aspiradores-robo': aspiradoresRoboCriteria as CriteriaConfig[],
    'robos-aspiradores': aspiradoresRoboCriteria as CriteriaConfig[],

    // Soundbars
    'soundbars': soundbarsCriteria as CriteriaConfig[],

    // Home Theater
    'home-theater': homeTheaterCriteria as CriteriaConfig[],
    'receivers': homeTheaterCriteria as CriteriaConfig[],

    // Fones TWS
    'fones-tws': fonesTwsCriteria as CriteriaConfig[],
    'fones-bluetooth': fonesTwsCriteria as CriteriaConfig[],
    'earbuds': fonesTwsCriteria as CriteriaConfig[],

    // Headsets Gamer
    'headsets-gamer': headsetsGamerCriteria as CriteriaConfig[],
    'headsets': headsetsGamerCriteria as CriteriaConfig[],

    // Projetores
    'projetores': projetoresCriteria as CriteriaConfig[],

    // Streaming Devices
    'streaming-devices': streamingDevicesCriteria as CriteriaConfig[],
    'fire-tv': streamingDevicesCriteria as CriteriaConfig[],
    'chromecast': streamingDevicesCriteria as CriteriaConfig[],
    'roku': streamingDevicesCriteria as CriteriaConfig[],
    'apple-tv': streamingDevicesCriteria as CriteriaConfig[],
};

/**
 * Get criteria configuration for a category
 * @param categorySlug - The URL slug of the category
 * @returns Array of criteria configs, or empty array if not found
 */
export function getCriteriaForCategory(categorySlug: string): CriteriaConfig[] {
    const normalized = categorySlug.toLowerCase().trim();
    return criteriaMap[normalized] || [];
}

/**
 * Check if a category has criteria defined
 */
export function hasCriteria(categorySlug: string): boolean {
    return getCriteriaForCategory(categorySlug).length > 0;
}

/**
 * Get all available category slugs
 */
export function getAvailableCategories(): string[] {
    return Object.keys(criteriaMap);
}
