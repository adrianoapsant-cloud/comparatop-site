'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAllCategories } from '@/config/categories';

// Import all criteria files (21 categories)
import tvCriteria from '@/core/match/config/tvs-criteria.json';
import geladeirasCriteria from '@/core/match/config/geladeiras-criteria.json';
import arCondicionadosCriteria from '@/core/match/config/ar-condicionados-criteria.json';
import notebooksCriteria from '@/core/match/config/notebooks-criteria.json';
import smartphonesCriteria from '@/core/match/config/smartphones-criteria.json';
import soundbarsCriteria from '@/core/match/config/soundbars-criteria.json';
import monitoresCriteria from '@/core/match/config/monitores-criteria.json';
import consolesCriteria from '@/core/match/config/consoles-criteria.json';
import fonesTwsCriteria from '@/core/match/config/fones-tws-criteria.json';
import headsetsCriteria from '@/core/match/config/headsets-gamer-criteria.json';
import homeTheaterCriteria from '@/core/match/config/home-theater-criteria.json';
import projetoresCriteria from '@/core/match/config/projetores-criteria.json';
import streamingCriteria from '@/core/match/config/streaming-devices-criteria.json';
import aspiradoresCriteria from '@/core/match/config/aspiradores-robo-criteria.json';
import maquinasLavarCriteria from '@/core/match/config/maquinas-lavar-criteria.json';
import lavaSecaCriteria from '@/core/match/config/lava-seca-criteria.json';
import lavaLoucasCriteria from '@/core/match/config/lava-loucas-criteria.json';
import freezersCriteria from '@/core/match/config/freezers-criteria.json';
import microOndasCriteria from '@/core/match/config/micro-ondas-criteria.json';
import fogoesCriteria from '@/core/match/config/fogoes-criteria.json';
import cooktopsCriteria from '@/core/match/config/cooktops-criteria.json';
import type { CriteriaConfig } from '@/core/match/types';

// ============================================
// CATEGORY OPTIONS (50 categories)
// ============================================

const CATEGORIES = [
    // === Áudio & Vídeo ===
    { id: 'tv', label: 'Smart TV', slug: 'smart-tvs', icon: '📺' },
    { id: 'soundbar', label: 'Soundbar', slug: 'soundbars', icon: '🔊' },
    { id: 'home_theater', label: 'Home Theater', slug: 'home-theaters', icon: '🎬' },
    { id: 'projetor', label: 'Projetor', slug: 'projetores', icon: '📽️' },
    { id: 'streaming', label: 'Fire TV / Streaming', slug: 'streaming-devices', icon: '📡' },
    { id: 'caixa_som', label: 'Caixa de Som Bluetooth', slug: 'caixas-som', icon: '🔈' },

    // === Gaming ===
    { id: 'monitor', label: 'Monitor', slug: 'monitores', icon: '🖥️' },
    { id: 'console', label: 'Console', slug: 'consoles', icon: '🎮' },
    { id: 'headset', label: 'Headset Gamer', slug: 'headsets-gamer', icon: '🎧' },
    { id: 'controle', label: 'Controle / Acessórios Console', slug: 'controles', icon: '🕹️' },
    { id: 'cadeira_gamer', label: 'Cadeira Gamer', slug: 'cadeiras-gamer', icon: '💺' },

    // === Mobile & Portátil ===
    { id: 'smartphone', label: 'Smartphone', slug: 'smartphones', icon: '📱' },
    { id: 'notebook', label: 'Notebook', slug: 'notebooks', icon: '💻' },
    { id: 'tablet', label: 'Tablet', slug: 'tablets', icon: '📲' },
    { id: 'fones_tws', label: 'Fones TWS', slug: 'fones-tws', icon: '🎵' },
    { id: 'smartwatch', label: 'Smartwatch', slug: 'smartwatches', icon: '⌚' },

    // === Climatização ===
    { id: 'air_conditioner', label: 'Ar-Condicionado', slug: 'ar-condicionados', icon: '❄️' },
    { id: 'purificador', label: 'Purificador / Bebedouro', slug: 'purificadores', icon: '💧' },

    // === Cozinha - Refrigeração ===
    { id: 'fridge', label: 'Geladeira', slug: 'geladeiras', icon: '🧊' },
    { id: 'freezer', label: 'Freezer', slug: 'freezers', icon: '🥶' },
    { id: 'frigobar', label: 'Frigobar', slug: 'frigobares', icon: '🍺' },
    { id: 'adega', label: 'Adega Climatizada', slug: 'adegas', icon: '🍷' },

    // === Cozinha - Cocção ===
    { id: 'fogao', label: 'Fogão', slug: 'fogoes', icon: '🔥' },
    { id: 'cooktop', label: 'Cooktop', slug: 'cooktops', icon: '♨️' },
    { id: 'micro_ondas', label: 'Micro-ondas', slug: 'micro-ondas', icon: '📻' },
    { id: 'forno_embutir', label: 'Forno Elétrico de Embutir', slug: 'fornos-embutir', icon: '🍞' },
    { id: 'air_fryer', label: 'Air Fryer Premium', slug: 'air-fryers', icon: '🍟' },
    { id: 'cafeteira', label: 'Cafeteira Espresso', slug: 'cafeteiras', icon: '☕' },
    { id: 'processador', label: 'Processador / Mixer', slug: 'processadores', icon: '🥤' },
    { id: 'coifa', label: 'Coifa / Depurador', slug: 'coifas', icon: '💨' },

    // === Cozinha - Limpeza ===
    { id: 'lava_loucas', label: 'Lava-Louças', slug: 'lava-loucas', icon: '🍽️' },

    // === Lavanderia ===
    { id: 'maquina_lavar', label: 'Máquina de Lavar', slug: 'maquinas-lavar', icon: '🧺' },
    { id: 'lava_seca', label: 'Lava e Seca', slug: 'lava-seca', icon: '👕' },

    // === Limpeza ===
    { id: 'aspirador', label: 'Aspirador Robô', slug: 'aspiradores-robo', icon: '🤖' },
    { id: 'aspirador_vertical', label: 'Aspirador Vertical', slug: 'aspiradores-vertical', icon: '🧹' },

    // === Segurança & Casa Inteligente ===
    { id: 'camera_seguranca', label: 'Câmera de Segurança', slug: 'cameras-seguranca', icon: '📹' },
    { id: 'fechadura', label: 'Fechadura Digital', slug: 'fechaduras', icon: '🔐' },
    { id: 'roteador', label: 'Roteador / Mesh Wi-Fi', slug: 'roteadores', icon: '📶' },

    // === Peças para PC ===
    { id: 'gpu', label: 'Placa de Vídeo (GPU)', slug: 'placas-video', icon: '🎴' },
    { id: 'cpu', label: 'Processador (CPU)', slug: 'processadores-cpu', icon: '🧠' },
    { id: 'placa_mae', label: 'Placa-Mãe', slug: 'placas-mae', icon: '🔌' },
    { id: 'memoria_ram', label: 'Memória RAM', slug: 'memorias-ram', icon: '💾' },
    { id: 'ssd', label: 'SSD', slug: 'ssds', icon: '💿' },
    { id: 'fonte_pc', label: 'Fonte para PC', slug: 'fontes-pc', icon: '⚡' },
    { id: 'gabinete', label: 'Gabinete Premium', slug: 'gabinetes', icon: '🖥️' },

    // === Energia & Proteção ===
    { id: 'nobreak', label: 'Nobreak', slug: 'nobreaks', icon: '🔋' },
    { id: 'estabilizador', label: 'Estabilizador / Filtro de Linha', slug: 'estabilizadores', icon: '🔌' },

    // === Impressão & Escritório ===
    { id: 'impressora', label: 'Impressora', slug: 'impressoras', icon: '🖨️' },

    // === Fotografia ===
    { id: 'camera', label: 'Câmera (Mirrorless/DSLR)', slug: 'cameras', icon: '📷' },
    { id: 'action_cam', label: 'Action Cam', slug: 'action-cams', icon: '📸' },

    // === Automotivo (opcional) ===
    { id: 'pneu', label: 'Pneus', slug: 'pneus', icon: '🛞' },
    { id: 'bateria_auto', label: 'Bateria Automotiva', slug: 'baterias-auto', icon: '🔋' },
];

// ============================================
// DYNAMIC PRICE TIERS BY CATEGORY
// Dividido em 3 faixas onde ~1/3 dos produtos cai em cada
// Última faixa sempre "sem limite"
// ============================================

const CATEGORY_PRICE_TIERS: Record<string, { id: string; label: string; max: number }[]> = {
    // === Áudio & Vídeo ===
    tv: [
        { id: 'budget', label: 'até R$ 2.500', max: 2500 },
        { id: 'mid', label: 'até R$ 5.000', max: 5000 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    soundbar: [
        { id: 'budget', label: 'até R$ 800', max: 800 },
        { id: 'mid', label: 'até R$ 2.000', max: 2000 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    home_theater: [
        { id: 'budget', label: 'até R$ 1.500', max: 1500 },
        { id: 'mid', label: 'até R$ 4.000', max: 4000 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    projetor: [
        { id: 'budget', label: 'até R$ 2.000', max: 2000 },
        { id: 'mid', label: 'até R$ 5.000', max: 5000 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    streaming: [
        { id: 'budget', label: 'até R$ 300', max: 300 },
        { id: 'mid', label: 'até R$ 600', max: 600 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    caixa_som: [
        { id: 'budget', label: 'até R$ 500', max: 500 },
        { id: 'mid', label: 'até R$ 1.500', max: 1500 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],

    // === Gaming ===
    monitor: [
        { id: 'budget', label: 'até R$ 1.200', max: 1200 },
        { id: 'mid', label: 'até R$ 2.500', max: 2500 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    console: [
        { id: 'budget', label: 'até R$ 2.500', max: 2500 },
        { id: 'mid', label: 'até R$ 4.000', max: 4000 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    headset: [
        { id: 'budget', label: 'até R$ 300', max: 300 },
        { id: 'mid', label: 'até R$ 800', max: 800 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    controle: [
        { id: 'budget', label: 'até R$ 250', max: 250 },
        { id: 'mid', label: 'até R$ 500', max: 500 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    cadeira_gamer: [
        { id: 'budget', label: 'até R$ 800', max: 800 },
        { id: 'mid', label: 'até R$ 2.000', max: 2000 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],

    // === Mobile & Portátil ===
    smartphone: [
        { id: 'budget', label: 'até R$ 1.500', max: 1500 },
        { id: 'mid', label: 'até R$ 4.000', max: 4000 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    notebook: [
        { id: 'budget', label: 'até R$ 3.000', max: 3000 },
        { id: 'mid', label: 'até R$ 6.000', max: 6000 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    tablet: [
        { id: 'budget', label: 'até R$ 1.500', max: 1500 },
        { id: 'mid', label: 'até R$ 4.000', max: 4000 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    fones_tws: [
        { id: 'budget', label: 'até R$ 300', max: 300 },
        { id: 'mid', label: 'até R$ 800', max: 800 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    smartwatch: [
        { id: 'budget', label: 'até R$ 500', max: 500 },
        { id: 'mid', label: 'até R$ 2.000', max: 2000 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],

    // === Climatização ===
    air_conditioner: [
        { id: 'budget', label: 'até R$ 2.000', max: 2000 },
        { id: 'mid', label: 'até R$ 3.500', max: 3500 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    purificador: [
        { id: 'budget', label: 'até R$ 600', max: 600 },
        { id: 'mid', label: 'até R$ 1.500', max: 1500 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],

    // === Cozinha - Refrigeração ===
    fridge: [
        { id: 'budget', label: 'até R$ 3.000', max: 3000 },
        { id: 'mid', label: 'até R$ 6.000', max: 6000 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    freezer: [
        { id: 'budget', label: 'até R$ 2.000', max: 2000 },
        { id: 'mid', label: 'até R$ 4.000', max: 4000 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    frigobar: [
        { id: 'budget', label: 'até R$ 1.000', max: 1000 },
        { id: 'mid', label: 'até R$ 2.000', max: 2000 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    adega: [
        { id: 'budget', label: 'até R$ 1.500', max: 1500 },
        { id: 'mid', label: 'até R$ 4.000', max: 4000 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],

    // === Cozinha - Cocção ===
    fogao: [
        { id: 'budget', label: 'até R$ 1.500', max: 1500 },
        { id: 'mid', label: 'até R$ 3.500', max: 3500 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    cooktop: [
        { id: 'budget', label: 'até R$ 800', max: 800 },
        { id: 'mid', label: 'até R$ 2.500', max: 2500 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    micro_ondas: [
        { id: 'budget', label: 'até R$ 500', max: 500 },
        { id: 'mid', label: 'até R$ 1.200', max: 1200 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    forno_embutir: [
        { id: 'budget', label: 'até R$ 2.000', max: 2000 },
        { id: 'mid', label: 'até R$ 5.000', max: 5000 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    air_fryer: [
        { id: 'budget', label: 'até R$ 400', max: 400 },
        { id: 'mid', label: 'até R$ 1.000', max: 1000 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    cafeteira: [
        { id: 'budget', label: 'até R$ 1.000', max: 1000 },
        { id: 'mid', label: 'até R$ 3.000', max: 3000 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    processador: [
        { id: 'budget', label: 'até R$ 400', max: 400 },
        { id: 'mid', label: 'até R$ 1.000', max: 1000 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    coifa: [
        { id: 'budget', label: 'até R$ 800', max: 800 },
        { id: 'mid', label: 'até R$ 2.500', max: 2500 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],

    // === Cozinha - Limpeza ===
    lava_loucas: [
        { id: 'budget', label: 'até R$ 2.500', max: 2500 },
        { id: 'mid', label: 'até R$ 5.000', max: 5000 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],

    // === Lavanderia ===
    maquina_lavar: [
        { id: 'budget', label: 'até R$ 2.000', max: 2000 },
        { id: 'mid', label: 'até R$ 4.000', max: 4000 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    lava_seca: [
        { id: 'budget', label: 'até R$ 3.500', max: 3500 },
        { id: 'mid', label: 'até R$ 6.000', max: 6000 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],

    // === Limpeza ===
    aspirador: [
        { id: 'budget', label: 'até R$ 1.500', max: 1500 },
        { id: 'mid', label: 'até R$ 3.500', max: 3500 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    aspirador_vertical: [
        { id: 'budget', label: 'até R$ 800', max: 800 },
        { id: 'mid', label: 'até R$ 2.000', max: 2000 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],

    // === Segurança & Casa Inteligente ===
    camera_seguranca: [
        { id: 'budget', label: 'até R$ 500', max: 500 },
        { id: 'mid', label: 'até R$ 1.500', max: 1500 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    fechadura: [
        { id: 'budget', label: 'até R$ 500', max: 500 },
        { id: 'mid', label: 'até R$ 1.500', max: 1500 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    roteador: [
        { id: 'budget', label: 'até R$ 400', max: 400 },
        { id: 'mid', label: 'até R$ 1.000', max: 1000 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],

    // === Peças para PC ===
    gpu: [
        { id: 'budget', label: 'até R$ 2.000', max: 2000 },
        { id: 'mid', label: 'até R$ 5.000', max: 5000 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    cpu: [
        { id: 'budget', label: 'até R$ 1.000', max: 1000 },
        { id: 'mid', label: 'até R$ 2.500', max: 2500 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    placa_mae: [
        { id: 'budget', label: 'até R$ 800', max: 800 },
        { id: 'mid', label: 'até R$ 2.000', max: 2000 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    memoria_ram: [
        { id: 'budget', label: 'até R$ 300', max: 300 },
        { id: 'mid', label: 'até R$ 600', max: 600 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    ssd: [
        { id: 'budget', label: 'até R$ 400', max: 400 },
        { id: 'mid', label: 'até R$ 1.000', max: 1000 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    fonte_pc: [
        { id: 'budget', label: 'até R$ 400', max: 400 },
        { id: 'mid', label: 'até R$ 1.000', max: 1000 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    gabinete: [
        { id: 'budget', label: 'até R$ 400', max: 400 },
        { id: 'mid', label: 'até R$ 1.000', max: 1000 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],

    // === Energia & Proteção ===
    nobreak: [
        { id: 'budget', label: 'até R$ 600', max: 600 },
        { id: 'mid', label: 'até R$ 1.500', max: 1500 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    estabilizador: [
        { id: 'budget', label: 'até R$ 200', max: 200 },
        { id: 'mid', label: 'até R$ 500', max: 500 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],

    // === Impressão ===
    impressora: [
        { id: 'budget', label: 'até R$ 1.000', max: 1000 },
        { id: 'mid', label: 'até R$ 3.000', max: 3000 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],

    // === Fotografia ===
    camera: [
        { id: 'budget', label: 'até R$ 5.000', max: 5000 },
        { id: 'mid', label: 'até R$ 15.000', max: 15000 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    action_cam: [
        { id: 'budget', label: 'até R$ 1.000', max: 1000 },
        { id: 'mid', label: 'até R$ 3.000', max: 3000 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],

    // === Automotivo ===
    pneu: [
        { id: 'budget', label: 'até R$ 400', max: 400 },
        { id: 'mid', label: 'até R$ 800', max: 800 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
    bateria_auto: [
        { id: 'budget', label: 'até R$ 400', max: 400 },
        { id: 'mid', label: 'até R$ 700', max: 700 },
        { id: 'premium', label: 'sem limite', max: 999999 },
    ],
};

// Default fallback for categories not yet mapped
const DEFAULT_PRICE_TIERS = [
    { id: 'budget', label: 'até R$ 1.000', max: 1000 },
    { id: 'mid', label: 'até R$ 3.000', max: 3000 },
    { id: 'premium', label: 'sem limite', max: 999999 },
];

// Helper function to get price tiers for a category
function getPriceTiersForCategory(categoryId: string) {
    return CATEGORY_PRICE_TIERS[categoryId] || DEFAULT_PRICE_TIERS;
}

// ============================================
// FRIENDLY PAIN POINT LABELS (all 21 categories, 10 each = 210 total)
// ============================================

const PAIN_POINT_LABELS: Record<string, Record<string, string>> = {
    tv: {
        custo_beneficio: 'economizar sem perder qualidade',
        processamento: 'melhorar imagem de TV aberta',
        confiabilidade: 'evitar problemas e defeitos',
        fluidez_sistema: 'ter um sistema rápido',
        gaming: 'jogar PS5/Xbox',
        brilho_reflexo: 'assistir em sala clara',
        pos_venda: 'ter bom suporte',
        som: 'ouvir diálogos sem soundbar',
        conectividade: 'conectar vários aparelhos',
        design: 'ter visual bonito na parede',
    },
    soundbar: {
        custo_beneficio: 'preço justo com qualidade',
        potencia: 'som alto e potente',
        graves: 'graves profundos (subwoofer)',
        dialogos: 'entender diálogos claramente',
        conectividade: 'conectar facilmente na TV',
        espacial: 'ter som surround/Atmos',
        design: 'combinar com minha TV',
        app: 'ajustar pelo celular',
        musica: 'ouvir música também',
        confiabilidade: 'durar muitos anos',
    },
    home_theater: {
        custo_beneficio: 'kit completo bom e barato',
        potencia: 'som de cinema em casa',
        graves: 'sentir explosões no peito',
        canais: 'ter 5.1 ou 7.1 reais',
        instalacao: 'instalar sem técnico',
        qualidade: 'fidelidade de áudio',
        conectividade: 'funcionar com streaming',
        design: 'caixas discretas',
        ambiente: 'preencher sala grande',
        confiabilidade: 'marca confiável',
    },
    projetor: {
        custo_beneficio: 'bom preço para uso doméstico',
        brilho: 'usar com luz acesa',
        resolucao: 'imagem nítida (4K)',
        contraste: 'preto profundo',
        ruido: 'funcionar silencioso',
        lampada: 'lâmpada durável',
        distancia: 'usar em sala pequena',
        conectividade: 'streaming nativo',
        gaming: 'jogar com baixo lag',
        portabilidade: 'levar para outros lugares',
    },
    streaming: {
        custo_beneficio: 'barato e funcional',
        velocidade: 'abrir apps rápido',
        qualidade: 'rodar 4K HDR',
        compatibilidade: 'ter todos os apps BR',
        controle: 'controle com busca por voz',
        atualizacoes: 'receber updates',
        aquecimento: 'não esquentar muito',
        audio: 'passar som Atmos pro receiver',
        setup: 'configurar fácil',
        confiabilidade: 'não travar',
    },
    monitor: {
        custo_beneficio: 'bom preço para trabalho/jogo',
        painel: 'cores precisas (IPS)',
        taxa: 'alta taxa de atualização (144Hz+)',
        resposta: 'resposta rápida para FPS',
        resolucao: 'alta resolução (4K/1440p)',
        ergonomia: 'ajustar altura e inclinação',
        olhos: 'não cansar a vista',
        conectividade: 'várias entradas',
        hdr: 'HDR real',
        curvo: 'imersão com tela curva',
    },
    console: {
        custo_beneficio: 'melhor preço pelo hardware',
        desempenho: 'rodar jogos em 4K/60fps',
        biblioteca: 'ter os jogos que quero',
        online: 'melhor serviço online',
        retrocompatibilidade: 'jogar jogos antigos',
        armazenamento: 'espaço para muitos jogos',
        exclusivos: 'ter exclusivos importantes',
        vrr: 'suporte a VRR/120Hz',
        barulho: 'funcionar silencioso',
        midia: 'ter leitor de discos',
    },
    headset: {
        custo_beneficio: 'bom e barato para jogar',
        som: 'som posicional preciso',
        microfone: 'mic claro para chat',
        conforto: 'usar horas sem dor',
        sem_fio: 'liberdade wireless',
        bateria: 'bateria longa',
        compatibilidade: 'funcionar em PC e console',
        software: 'controle via app',
        construcao: 'material resistente',
        rgb: 'ter iluminação RGB',
    },
    smartphone: {
        custo_beneficio: 'bom preço sem perder recursos',
        camera: 'tirar fotos incríveis',
        bateria: 'durar o dia inteiro',
        desempenho: 'usar apps sem travar',
        tela: 'tela bonita e fluida',
        atualizacoes: 'receber updates por anos',
        armazenamento: 'guardar muitas fotos/apps',
        durabilidade: 'resistir a quedas/água',
        audio: 'ouvir música com qualidade',
        design: 'ter visual premium',
    },
    notebook: {
        custo_beneficio: 'bom preço vs performance',
        desempenho: 'trabalhar sem travamentos',
        bateria: 'usar longe da tomada',
        tela: 'tela boa para trabalho',
        gaming: 'rodar jogos pesados',
        portabilidade: 'carregar para todo lugar',
        confiabilidade: 'durar anos sem problema',
        teclado: 'digitar confortavelmente',
        conectividade: 'conectar monitores',
        armazenamento: 'SSD grande',
    },
    fones_tws: {
        custo_beneficio: 'qualidade por preço justo',
        som: 'som equilibrado e nítido',
        anc: 'cancelamento de ruído',
        bateria: 'muitas horas de uso',
        conforto: 'não cair da orelha',
        microfone: 'chamadas claras',
        conectividade: 'parear fácil',
        resistencia: 'usar na academia (suor)',
        latencia: 'assistir vídeos sem delay',
        controles: 'toques funcionais',
    },
    air_conditioner: {
        custo_beneficio: 'economizar na compra',
        eficiencia: 'não aumentar conta de luz',
        potencia: 'gelar rápido',
        ruido: 'dormir com ele ligado',
        confiabilidade: 'não dar manutenção',
        pos_venda: 'instalação fácil',
        tecnologia: 'ter inverter e Wi-Fi',
        alcance: 'gelar ambiente grande',
        filtragem: 'melhorar qualidade do ar',
        design: 'ser discreto',
    },
    fridge: {
        custo_beneficio: 'economizar na compra',
        eficiencia: 'reduzir conta de luz',
        confiabilidade: 'durar muitos anos',
        capacidade: 'família grande',
        conservacao: 'conservar alimentos',
        ruido: 'funcionar silencioso',
        pos_venda: 'assistência confiável',
        tecnologia: 'frost free, inverter',
        organizacao: 'organizar alimentos',
        design: 'combinar com cozinha',
    },
    freezer: {
        custo_beneficio: 'bom preço por litro',
        capacidade: 'guardar muita coisa',
        eficiencia: 'consumo baixo',
        organizacao: 'cestos e gavetas',
        degelo: 'frost free ou fácil',
        confiabilidade: 'durar muitos anos',
        ruido: 'silencioso',
        temperatura: 'gelar rápido',
        fechadura: 'ter trava de segurança',
        adaptabilidade: 'virar refrigerador',
    },
    micro_ondas: {
        custo_beneficio: 'preço justo',
        potencia: 'aquecer rápido',
        capacidade: 'caber pratos grandes',
        funcoes: 'receitas prontas',
        limpeza: 'fácil de limpar',
        design: 'combinar com cozinha',
        painel: 'controles intuitivos',
        seguranca: 'trava para crianças',
        durabilidade: 'durar anos',
        espelho: 'tela espelhada',
    },
    fogao: {
        custo_beneficio: 'preço acessível',
        queimadores: 'potência das bocas',
        forno: 'forno eficiente',
        limpeza: 'fácil de limpar',
        design: 'bonito na cozinha',
        tamanho: '4 ou 5 bocas',
        acendimento: 'acendimento automático',
        seguranca: 'válvula de segurança',
        grade: 'grade resistente',
        durabilidade: 'material durável',
    },
    cooktop: {
        custo_beneficio: 'bom preço',
        tipo: 'indução, elétrico ou gás',
        potencia: 'aquecer rápido',
        limpeza: 'superfície lisa',
        design: 'visual moderno',
        seguranca: 'não esquentar bordas',
        queimadores: 'quantidade de bocas',
        controle: 'ajuste preciso',
        durabilidade: 'vidro resistente',
        instalacao: 'instalar fácil',
    },
    lava_loucas: {
        custo_beneficio: 'economia vs lavar na mão',
        capacidade: 'quantos serviços',
        consumo: 'água e energia',
        ciclos: 'programas úteis',
        limpeza: 'lavar bem panelas',
        ruido: 'silenciosa',
        instalacao: 'fácil de instalar',
        secagem: 'secar bem',
        design: 'caber na cozinha',
        durabilidade: 'durar anos',
    },
    maquina_lavar: {
        custo_beneficio: 'preço vs capacidade',
        capacidade: 'quantos kg',
        eficiencia: 'economizar água/luz',
        ciclos: 'programas variados',
        centrifugacao: 'roupa menos molhada',
        ruido: 'funcionar silencioso',
        durabilidade: 'motor durável',
        tecnologia: 'inverter, smart',
        limpeza: 'remover manchas',
        design: 'caber na lavanderia',
    },
    lava_seca: {
        custo_beneficio: '2 em 1 que vale a pena',
        capacidade: 'kg para lavar e secar',
        secagem: 'secar bem',
        eficiencia: 'não gastar muito',
        ciclos: 'programas úteis',
        ruido: 'funcionar silencioso',
        durabilidade: 'durar muitos anos',
        tecnologia: 'inverter, steam',
        instalacao: 'não precisar de duto',
        design: 'caber em apartamento',
    },
    aspirador: {
        custo_beneficio: 'robô que vale o preço',
        succao: 'aspirar bem',
        mapeamento: 'mapear a casa',
        bateria: 'limpar casa toda',
        base: 'esvaziar sozinho',
        pelos: 'pegar pelos de pet',
        mopping: 'passar pano também',
        app: 'controlar pelo celular',
        obstaculos: 'evitar fios e móveis',
        ruido: 'funcionar silencioso',
    },
};

// ============================================
// CRITERIA MAP BY CATEGORY (with raw data)
// ============================================

const CRITERIA_BY_CATEGORY: Record<string, CriteriaConfig[]> = {
    tv: tvCriteria as CriteriaConfig[],
    fridge: geladeirasCriteria as CriteriaConfig[],
    air_conditioner: arCondicionadosCriteria as CriteriaConfig[],
    notebook: notebooksCriteria as CriteriaConfig[],
    smartphone: smartphonesCriteria as CriteriaConfig[],
    soundbar: soundbarsCriteria as CriteriaConfig[],
    monitor: monitoresCriteria as CriteriaConfig[],
    console: consolesCriteria as CriteriaConfig[],
    fones_tws: fonesTwsCriteria as CriteriaConfig[],
    headset: headsetsCriteria as CriteriaConfig[],
    home_theater: homeTheaterCriteria as CriteriaConfig[],
    projetor: projetoresCriteria as CriteriaConfig[],
    streaming: streamingCriteria as CriteriaConfig[],
    aspirador: aspiradoresCriteria as CriteriaConfig[],
    maquina_lavar: maquinasLavarCriteria as CriteriaConfig[],
    lava_seca: lavaSecaCriteria as CriteriaConfig[],
    lava_loucas: lavaLoucasCriteria as CriteriaConfig[],
    freezer: freezersCriteria as CriteriaConfig[],
    micro_ondas: microOndasCriteria as CriteriaConfig[],
    fogao: fogoesCriteria as CriteriaConfig[],
    cooktop: cooktopsCriteria as CriteriaConfig[],
};

// ============================================
// STYLED DROPDOWN
// ============================================

interface StyledDropdownProps {
    value: string;
    options: { id: string; label: string; icon?: string }[];
    onChange: (id: string) => void;
    placeholder: string;
    accentColor?: 'blue' | 'amber' | 'emerald';
}

function StyledDropdown({
    value,
    options,
    onChange,
    placeholder,
    accentColor = 'blue',
}: StyledDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const selected = options.find(o => o.id === value);

    const colorClasses = {
        blue: 'border-blue-300 bg-blue-50 text-blue-700 hover:border-blue-400',
        amber: 'border-amber-300 bg-amber-50 text-amber-700 hover:border-amber-400',
        emerald: 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:border-emerald-400',
    };

    return (
        <div className="relative inline-block">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'inline-flex items-center gap-2 px-4 py-2',
                    'rounded-xl border-2 transition-all',
                    'font-display font-semibold text-lg md:text-xl',
                    selected ? colorClasses[accentColor] : 'border-gray-300 bg-white text-text-muted hover:border-brand-core'
                )}
            >
                {selected?.icon && <span>{selected.icon}</span>}
                <span className="underline decoration-2 decoration-dotted underline-offset-4">
                    {selected?.label || placeholder}
                </span>
                <ChevronDown size={18} className={cn(
                    'transition-transform',
                    isOpen && 'rotate-180'
                )} />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={cn(
                            'absolute top-full left-0 mt-2 z-50',
                            'bg-white rounded-xl shadow-xl border border-gray-200',
                            'p-2 min-w-[200px]',
                            'text-base font-body font-normal' // Reset font size!
                        )}
                    >
                        {options.map(option => (
                            <button
                                key={option.id}
                                onClick={() => { onChange(option.id); setIsOpen(false); }}
                                className={cn(
                                    'w-full flex items-center gap-2 px-4 py-3 rounded-lg text-left',
                                    'transition-colors text-sm', // Normal text size
                                    value === option.id
                                        ? 'bg-brand-core/10 text-brand-core font-semibold'
                                        : 'hover:bg-gray-100 text-text-primary'
                                )}
                            >
                                {option.icon && <span className="text-lg">{option.icon}</span>}
                                <span>{option.label}</span>
                            </button>
                        ))}
                    </motion.div>
                </>
            )}
        </div>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================

interface NaturalLanguageSearchProps {
    className?: string;
}

export function NaturalLanguageSearch({ className }: NaturalLanguageSearchProps) {
    const router = useRouter();

    const [selectedCategory, setSelectedCategory] = useState('');
    const [goldCriteria, setGoldCriteria] = useState('');
    const [silverCriteria, setSilverCriteria] = useState<string[]>([]);
    const [selectedPrice, setSelectedPrice] = useState('');

    // Get criteria for selected category with friendly pain point labels
    const availableCriteria = useMemo(() => {
        if (!selectedCategory) return [];
        const categoryLabels = PAIN_POINT_LABELS[selectedCategory] || {};
        return (CRITERIA_BY_CATEGORY[selectedCategory] || []).map(c => ({
            id: c.id,
            label: categoryLabels[c.id] || c.label, // Use friendly label if available
            icon: c.icon,
        }));
    }, [selectedCategory]);

    // Reset criteria when category changes
    const handleCategoryChange = (id: string) => {
        setSelectedCategory(id);
        setGoldCriteria('');
        setSilverCriteria([]);
        setSelectedPrice(''); // Reset price since tiers are different per category
    };

    // Handle CTA click
    const handleSearch = () => {
        const category = CATEGORIES.find(c => c.id === selectedCategory);
        if (!category) return;

        // Build URL with query params for pre-applied filters
        let url = `/categorias/${category.slug}`;

        const params = new URLSearchParams();
        if (goldCriteria) params.set('gold', goldCriteria);
        if (silverCriteria.length > 0) params.set('silver', silverCriteria.join(','));

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        router.push(url);
    };

    // Handle silver criteria toggle (max 2)
    const handleSilverToggle = (criteriaId: string) => {
        if (silverCriteria.includes(criteriaId)) {
            // Remove if already selected
            setSilverCriteria(prev => prev.filter(id => id !== criteriaId));
        } else if (silverCriteria.length < 2) {
            // Add if under limit
            setSilverCriteria(prev => [...prev, criteriaId]);
        } else {
            // Replace oldest if at limit
            setSilverCriteria(prev => [...prev.slice(1), criteriaId]);
        }
    };

    // Available silver options (exclude gold)
    const availableSilverOptions = availableCriteria.filter(c => c.id !== goldCriteria);

    const isComplete = selectedCategory && goldCriteria;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cn(
                'relative overflow-hidden',
                'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
                'rounded-3xl p-8 md:p-12',
                className
            )}
        >
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-core/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6"
                >
                    <Sparkles size={16} className="text-amber-400" />
                    <span className="text-white/90 text-sm font-medium">ComparaMatch AI</span>
                </motion.div>

                {/* Mad Libs Sentence */}
                <div className="space-y-4">
                    {/* Line 1: Category selection */}
                    <div className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                        <span className="text-white/70">Estou procurando o melhor </span>
                        <StyledDropdown
                            value={selectedCategory}
                            options={CATEGORIES}
                            onChange={handleCategoryChange}
                            placeholder="escolha"
                            accentColor="blue"
                        />
                    </div>

                    {/* Line 2: Gold Criteria (Essential) */}
                    {selectedCategory && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-wrap items-center gap-2"
                        >
                            <span className="px-3 py-1.5 bg-amber-500/20 text-amber-400 rounded-full text-sm font-semibold flex items-center gap-1.5">
                                🔒 Essencial:
                            </span>
                            <StyledDropdown
                                value={goldCriteria}
                                options={availableCriteria}
                                onChange={setGoldCriteria}
                                placeholder="o que não pode faltar"
                                accentColor="amber"
                            />
                        </motion.div>
                    )}

                    {/* Line 3: Silver Criteria (Nice to Have) */}
                    {goldCriteria && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-2"
                        >
                            <span className="inline-flex px-3 py-1.5 bg-gray-500/20 text-gray-300 rounded-full text-sm font-semibold items-center gap-1.5">
                                ⭐ Seria bom (escolha até 2):
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {availableSilverOptions.map(criteria => {
                                    const isSelected = silverCriteria.includes(criteria.id);
                                    return (
                                        <button
                                            key={criteria.id}
                                            onClick={() => handleSilverToggle(criteria.id)}
                                            className={cn(
                                                'px-3 py-2 rounded-full text-sm font-medium transition-all',
                                                'border-2',
                                                isSelected
                                                    ? 'bg-gray-400 border-gray-300 text-white shadow-md'
                                                    : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20 hover:border-white/40'
                                            )}
                                        >
                                            <span className="mr-1.5">{criteria.icon}</span>
                                            {criteria.label}
                                            {isSelected && <span className="ml-1.5">✓</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                </div>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isComplete ? 1 : 0.5 }}
                    className="mt-8"
                >
                    <button
                        onClick={handleSearch}
                        disabled={!isComplete}
                        className={cn(
                            'group inline-flex items-center gap-3 px-8 py-4',
                            'bg-gradient-to-r from-brand-core to-blue-600',
                            'rounded-2xl font-display font-bold text-xl text-white',
                            'shadow-lg shadow-brand-core/30',
                            'transition-all duration-300',
                            isComplete
                                ? 'hover:shadow-xl hover:shadow-brand-core/40 hover:scale-105'
                                : 'cursor-not-allowed opacity-50'
                        )}
                    >
                        <Sparkles size={20} />
                        <span>Ver Recomendações</span>
                        <ArrowRight
                            size={20}
                            className="transition-transform group-hover:translate-x-1"
                        />
                    </button>

                    {!isComplete && (
                        <p className="mt-3 text-white/50 text-sm">
                            Complete as seleções acima para continuar
                        </p>
                    )}
                </motion.div>

                {/* Helper text */}
                <p className="mt-6 text-white/40 text-sm max-w-xl">
                    Nosso algoritmo analisará {selectedCategory ? CATEGORIES.find(c => c.id === selectedCategory)?.label + 's' : 'produtos'} e
                    ordenará pelo seu perfil de uso. Sem propaganda, apenas dados.
                </p>
            </div>
        </motion.section>
    );
}
