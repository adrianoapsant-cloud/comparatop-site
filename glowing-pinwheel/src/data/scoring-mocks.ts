/**
 * Scoring Mocks - Demo Products for Testing
 * 
 * Each product has facts designed to trigger interesting penalties/bonuses
 * when different contexts are selected.
 */

import type { ProductFacts } from '@/lib/scoring/types';

export interface DemoProduct {
    slug: string;
    name: string;
    category: string;
    categorySlug: string;
    price: number;
    image?: string;
    facts: ProductFacts;
}

/**
 * Demo products for each category.
 * Facts are designed to trigger specific rules.
 */
export const DEMO_PRODUCTS: DemoProduct[] = [
    // ============================================
    // CLIMATIZAÇÃO
    // ============================================
    {
        slug: 'demo-ac',
        name: 'LG Dual Inverter 12000 BTUs',
        category: 'Ar Condicionado',
        categorySlug: 'ar-condicionado',
        price: 2499,
        facts: {
            coil_material: 'aluminum', // Penalidade: litoral
            has_anticorrosive_protection: false, // Penalidade: litoral
            noise_indoor_db: 28, // Penalidade: quarto_silencio
            compressor_type: 'dual_inverter', // Bônus: economico
            idrs: 6.8, // Bônus: economico
            gas_type: 'R-32', // Bônus: economico
            voltage_protection: false, // Penalidade: rede_instavel
            display_can_turn_off: true,
            has_mute_beep: true,
            remote_buttons: 15,
            voice_control: false,
            has_uv_sterilization: false,
            has_ion_generator: false,
            filter_type: 'basic_mesh', // Penalidade: saude_respiratoria
        },
    },

    // ============================================
    // REFRIGERAÇÃO
    // ============================================
    {
        slug: 'demo-geladeira',
        name: 'Samsung French Door 470L',
        category: 'Geladeira',
        categorySlug: 'geladeira',
        price: 5999,
        facts: {
            capacity_liters: 470,
            energy_consumption_kwh: 45, // Penalidade: economico
            has_water_dispenser: true,
            has_ice_maker: true,
            frost_free: true,
            energy_rating: 'A',
            door_type: 'french_door',
            has_smart_diagnosis: true,
        },
    },
    {
        slug: 'demo-freezer',
        name: 'Brastemp Frost Free 228L',
        category: 'Freezer',
        categorySlug: 'freezer',
        price: 2299,
        facts: {
            capacity_liters: 228,
            energy_consumption_kwh: 35,
            has_fast_freeze: true,
            defrost_type: 'frost_free',
            energy_rating: 'A',
            autonomy_hours: 48, // Médio para rede_instavel
        },
    },
    {
        slug: 'demo-frigobar',
        name: 'Consul CRC08 117L',
        category: 'Frigobar',
        categorySlug: 'minibar',
        price: 899,
        facts: {
            capacity_liters: 117,
            noise_db: 42, // Penalidade: quarto
            energy_consumption_kwh: 22,
            has_freezer_compartment: true,
            door_shelves: 3,
            energy_rating: 'B',
        },
    },
    {
        slug: 'demo-adega',
        name: 'Electrolux ACS24 24 Garrafas',
        category: 'Adega',
        categorySlug: 'adega',
        price: 1499,
        facts: {
            capacity_bottles: 24,
            zones: 1, // Penalidade: colecionador
            has_humidity_control: false, // Penalidade: colecionador
            noise_db: 38,
            has_uv_protection: true,
            compressor_type: 'thermoelectric', // Penalidade: colecionador
        },
    },

    // ============================================
    // LAVANDERIA
    // ============================================
    {
        slug: 'demo-maquina-lavar',
        name: 'Electrolux Premium Care 11kg',
        category: 'Máquina de Lavar',
        categorySlug: 'maquina-lavar',
        price: 2199,
        facts: {
            capacity_kg: 11,
            has_inverter: true,
            spin_rpm: 1200,
            water_consumption_liters: 120, // Penalidade: economia_agua
            program_count: 12,
            has_steam: false,
        },
    },
    {
        slug: 'demo-lava-seca',
        name: 'LG CV9011 11kg',
        category: 'Lava e Seca',
        categorySlug: 'lava-seca',
        price: 3999,
        facts: {
            wash_capacity_kg: 11,
            dry_capacity_kg: 7,
            has_inverter: true,
            has_steam: true,
            program_count: 14,
            has_wifi: true,
        },
    },
    {
        slug: 'demo-lava-loucas',
        name: 'Brastemp 14 Serviços',
        category: 'Lava-Louças',
        categorySlug: 'lava-loucas',
        price: 2899,
        facts: {
            capacity_services: 14,
            program_count: 6,
            has_third_rack: true,
            noise_db: 44,
            water_consumption_liters: 12,
        },
    },

    // ============================================
    // COZINHA
    // ============================================
    {
        slug: 'demo-micro-ondas',
        name: 'Panasonic 32L Inverter',
        category: 'Micro-ondas',
        categorySlug: 'micro-ondas',
        price: 899,
        facts: {
            capacity_liters: 32,
            power_watts: 1000,
            has_inverter: true,
            has_grill: true,
            preset_count: 10,
        },
    },
    {
        slug: 'demo-fogao',
        name: 'Electrolux 5 Bocas Inox',
        category: 'Fogão',
        categorySlug: 'fogao',
        price: 1299,
        facts: {
            burner_count: 5,
            has_timer: true,
            oven_capacity_liters: 84,
            has_self_cleaning: false,
            ignition_type: 'automatic',
        },
    },
    {
        slug: 'demo-air-fryer',
        name: 'Philips Walita XXL 7.3L',
        category: 'Air Fryer',
        categorySlug: 'air-fryer',
        price: 799,
        facts: {
            capacity_liters: 7.3, // Bônus: familia_grande
            width_cm: 32,
            preset_count: 12, // Bônus: iniciante
            has_dual_basket: false,
            has_rotation: true,
        },
    },
    {
        slug: 'demo-cafeteira',
        name: 'Nespresso Vertuo Next',
        category: 'Cafeteira',
        categorySlug: 'cafeteira',
        price: 599,
        facts: {
            type: 'capsule_only', // Penalidade: barista
            water_tank_ml: 1100,
            pressure_bar: 19,
            capsule_cost_per_unit: 3.5, // Penalidade: economia
            accepts_compatible_capsules: false, // Penalidade: economia
        },
    },
    {
        slug: 'demo-batedeira',
        name: 'KitchenAid Artisan 4.8L',
        category: 'Batedeira',
        categorySlug: 'batedeira',
        price: 2999,
        facts: {
            power_watts: 300, // Penalidade: confeitaria
            movement_type: 'planetary', // Bônus: confeitaria
            bowl_capacity_liters: 4.8,
            weight_kg: 10, // Penalidade: espaco_limitado
            attachment_count: 3,
            is_portable: false,
        },
    },
    {
        slug: 'demo-purificador',
        name: 'IBBL FR600 Expert',
        category: 'Purificador',
        categorySlug: 'purificador',
        price: 599,
        facts: {
            has_activated_carbon: true,
            flow_rate_lph: 80,
            refill_cost: 60,
            refill_lifespan_liters: 2000,
            has_uv_sterilization: false, // Penalidade: agua_dura
            width_cm: 25,
            is_compact: true,
        },
    },
    {
        slug: 'demo-coifa',
        name: 'Fischer Island 90cm',
        category: 'Coifa',
        categorySlug: 'coifa',
        price: 1999,
        facts: {
            suction_m3h: 800,
            noise_db_max: 58,
            has_charcoal_filter: true,
            has_grease_filter: true,
            filter_washable: true,
            has_led_lighting: true,
        },
    },
    {
        slug: 'demo-forno',
        name: 'Brastemp BOC84 84L',
        category: 'Forno de Embutir',
        categorySlug: 'forno',
        price: 2499,
        facts: {
            capacity_liters: 84, // Bônus: carnes
            has_convection: true, // Bônus: confeitaria, carnes
            has_self_cleaning: false, // Penalidade: praticidade
            preset_count: 8,
            power_watts: 2800,
            has_grill: true,
        },
    },

    // ============================================
    // ELETRÔNICOS
    // ============================================
    {
        slug: 'demo-smartphone',
        name: 'Samsung Galaxy S24 Ultra',
        category: 'Smartphone',
        categorySlug: 'smartphone',
        price: 7999,
        facts: {
            screen_brightness_nits: 1200, // Penalidade se <800: uso_externo
            battery_mah: 5000,
            water_resistance: 'IP68',
            has_esim: true,
            storage_gb: 256,
            has_wireless_charging: true,
        },
    },
    {
        slug: 'demo-tv',
        name: 'LG OLED C3 55"',
        category: 'Smart TV',
        categorySlug: 'tv',
        price: 4999,
        facts: {
            panel_type: 'OLED', // Bônus: cinema
            size_inches: 55,
            has_dolby_vision: true, // Bônus: cinema
            has_vrr: true, // Bônus: gaming
            refresh_rate_hz: 120, // Bônus: gaming
            hdmi_21_ports: 4,
            brightness_nits: 800, // Penalidade: sala_clara
        },
    },
    {
        slug: 'demo-notebook',
        name: 'MacBook Pro M3 14"',
        category: 'Notebook',
        categorySlug: 'notebook',
        price: 14999,
        facts: {
            processor_type: 'arm',
            ram_gb: 18,
            storage_gb: 512,
            battery_hours: 17, // Bônus: viagem
            weight_kg: 1.55,
            has_touchscreen: false,
            display_type: 'Liquid Retina XDR',
        },
    },
    {
        slug: 'demo-tablet',
        name: 'iPad Pro 12.9" M2',
        category: 'Tablet',
        categorySlug: 'tablet',
        price: 9999,
        facts: {
            screen_inches: 12.9,
            stylus_supported: true, // Para criacao
            stylus_latency_ms: 7, // Bônus: criacao
            keyboard_available: true,
            has_desktop_mode: true, // Bônus: produtividade
            has_cellular: true,
            display_type: 'OLED',
        },
    },
    {
        slug: 'demo-monitor',
        name: 'Dell Alienware AW3423DW',
        category: 'Monitor',
        categorySlug: 'monitor',
        price: 5499,
        facts: {
            size_inches: 34,
            refresh_rate_hz: 175, // Bônus: gaming
            response_time_ms: 0.1,
            srgb_coverage: 99.3,
            has_hdmi_21: true,
            height_adjustable: true,
            has_usb_c_pd: false,
            has_vrr: true,
            factory_calibrated: false, // Penalidade: criacao
        },
    },
    {
        slug: 'demo-projetor',
        name: 'BenQ TK700STi',
        category: 'Projetor',
        categorySlug: 'projetor',
        price: 6999,
        facts: {
            lumens: 3000, // Bônus: sala_clara
            resolution: '4K',
            input_lag_ms: 16, // Bônus: gaming
            has_speaker: true,
            light_source: 'lamp', // Penalidade: home_cinema (durabilidade)
            weight_kg: 3.1,
            has_battery: false, // Penalidade: portatil
        },
    },
    {
        slug: 'demo-camera',
        name: 'Sony A7 IV',
        category: 'Câmera',
        categorySlug: 'camera',
        price: 14999,
        facts: {
            body_type: 'pro',
            card_slots: 2, // Bônus: profissional
            max_video: '4K60', // Bônus: video
            weight_g: 658,
            burst_fps: 10,
            has_ibis: true, // Bônus: video, viagem
            weather_sealed: true,
            has_touchscreen: true,
            af_points: 759, // Bônus: esportes
        },
    },
    {
        slug: 'demo-tvbox',
        name: 'Apple TV 4K',
        category: 'TV Box',
        categorySlug: 'tvbox',
        price: 1299,
        facts: {
            supports_4k: true,
            supports_dolby_vision: true, // Bônus: 4k_hdr
            supports_atmos: true, // Bônus: audio
            ram_gb: 4,
            allows_sideload: false, // Penalidade: iptv
            controller_included: false, // Penalidade: gaming
            has_voice_remote: true, // Bônus: simplicidade
            interface_complexity: 'low',
        },
    },

    // ============================================
    // ÁUDIO
    // ============================================
    {
        slug: 'demo-soundbar',
        name: 'Samsung Q990C',
        category: 'Soundbar',
        categorySlug: 'soundbar',
        price: 4999,
        facts: {
            has_dolby_atmos: true, // Bônus: home_cinema
            has_subwoofer: true, // Bônus: musica
            subwoofer_wireless: true, // Bônus: espaco_pequeno
            has_earc: true, // Bônus: home_cinema
            has_game_mode: true,
            has_center_channel: true, // Bônus: dialogos
            has_dialog_mode: true,
            width_cm: 90,
        },
    },
    {
        slug: 'demo-tws',
        name: 'Sony WF-1000XM5',
        category: 'Fone TWS',
        categorySlug: 'tws',
        price: 1999,
        facts: {
            has_anc: true, // Bônus: transporte
            battery_hours: 8, // Bom para bateria_longa
            ip_rating: 'IPX4', // Penalidade: exercicios
            has_multipoint: true, // Bônus: chamadas
            supports_ldac: true, // Bônus: audiofilo
            mic_count: 3,
            has_ear_hooks: false, // Penalidade: exercicios
            has_wing_tips: false,
        },
    },
    {
        slug: 'demo-headset',
        name: 'SteelSeries Arctis Nova Pro',
        category: 'Headset Gamer',
        categorySlug: 'headset-gamer',
        price: 1999,
        facts: {
            has_surround: true, // Bônus: fps
            weight_g: 338,
            is_wireless: true,
            battery_hours: 22,
            mic_detachable: true,
            mic_quality_rating: 9, // Bônus: streaming
            earcup_material: 'memory_foam', // Bônus: longas_sessoes
            connection_type: '2.4ghz', // Bônus: wireless, fps
            console_compatible: true,
        },
    },
    {
        slug: 'demo-caixa-som',
        name: 'JBL Boombox 3',
        category: 'Caixa de Som',
        categorySlug: 'caixa-som',
        price: 2499,
        facts: {
            power_watts: 80, // Bônus: festa
            battery_hours: 24, // Bônus: bateria_longa
            ip_rating: 'IP67', // Bônus: outdoor
            weight_kg: 6.7, // Penalidade: portatil
            is_stereo: true,
            has_tws_pairing: true, // Bônus: festa
        },
    },

    // ============================================
    // WEARABLES
    // ============================================
    {
        slug: 'demo-smartwatch',
        name: 'Apple Watch Ultra 2',
        category: 'Smartwatch',
        categorySlug: 'smartwatch',
        price: 6999,
        facts: {
            has_gps: true,
            gps_type: 'multiband', // Bônus: fitness
            has_ecg: true, // Bônus: saude
            has_spo2: true, // Bônus: saude
            battery_days: 3, // Bônus: bateria_longa?
            water_resistance_atm: 10, // Bônus: natacao
            has_lte: true, // Bônus: fitness, notificacoes
            app_store_size: 50000,
        },
    },

    // ============================================
    // PC COMPONENTS
    // ============================================
    {
        slug: 'demo-cpu',
        name: 'AMD Ryzen 7 7800X3D',
        category: 'Processador',
        categorySlug: 'cpu',
        price: 2499,
        facts: {
            core_count: 8,
            boost_clock_ghz: 5.0, // Bônus: gaming
            tdp_watts: 120, // Penalidade: economia_energia
            has_igpu: false, // Penalidade: produtividade
            socket_year: 2023,
            has_3d_vcache: true, // Bônus: gaming
        },
    },
    {
        slug: 'demo-gpu',
        name: 'NVIDIA RTX 4080 Super',
        category: 'Placa de Vídeo',
        categorySlug: 'gpu',
        price: 7999,
        facts: {
            vram_gb: 16, // Bônus: gaming_4k, criacao
            tdp_watts: 320, // Penalidade: silencioso
            length_mm: 304, // Penalidade: gabinete_pequeno
            rt_generation: 4, // Bônus: ray_tracing
            has_dlss: true, // Bônus: gaming_4k
            encoder_quality: 9, // Bônus: criacao
            performance_tier: 9,
        },
    },
    {
        slug: 'demo-ram',
        name: 'G.Skill Trident Z5 RGB DDR5-6000',
        category: 'Memória RAM',
        categorySlug: 'ram',
        price: 899,
        facts: {
            capacity_gb: 32,
            speed_mhz: 6000, // Bônus: gaming, overclocking
            cas_latency: 30, // Penalidade: gaming
            has_xmp: true,
            has_heatsink: true,
            has_rgb: true, // Bônus: estetica
            die_type: 'hynix',
        },
    },
    {
        slug: 'demo-placa-mae',
        name: 'ASUS ROG Strix X670E-E',
        category: 'Placa-Mãe',
        categorySlug: 'motherboard',
        price: 3499,
        facts: {
            vrm_phases: 18, // Bônus: overclocking
            has_pcie5: true,
            usb_ports: 12, // Bônus: workstation
            has_wifi: true,
            has_thunderbolt: false, // Penalidade: workstation
            has_debug_display: true, // Bônus: overclocking
            form_factor: 'ATX', // Penalidade: compacto
        },
    },
    {
        slug: 'demo-fonte',
        name: 'Corsair RM1000x',
        category: 'Fonte',
        categorySlug: 'psu',
        price: 1299,
        facts: {
            wattage: 1000, // Bônus: gaming_high
            efficiency_rating: 'gold', // Bônus: confiabilidade
            fan_mode: 'semi_passive', // Bônus: silencioso
            modular: 'full', // Bônus: estetica
            form_factor: 'ATX', // Penalidade: compacto
        },
    },
    {
        slug: 'demo-ssd',
        name: 'Samsung 990 Pro 2TB',
        category: 'SSD',
        categorySlug: 'ssd',
        price: 999,
        facts: {
            capacity_gb: 2000,
            interface: 'PCIe4', // Bônus: gaming, criacao
            nand_type: 'TLC', // Bônus: criacao, nas
            has_dram: true,
            tbw: 1200, // Bônus: nas
            form_factor: 'M.2_2280',
            has_heatsink: false, // Penalidade: gaming
        },
    },
    {
        slug: 'demo-gabinete',
        name: 'Lian Li O11 Dynamic',
        category: 'Gabinete',
        categorySlug: 'gabinete',
        price: 999,
        facts: {
            front_panel: 'glass', // Penalidade: airflow
            has_tempered_glass: true, // Bônus: showcase
            has_sound_dampening: false, // Penalidade: silencioso
            size: 'mid_tower',
            max_radiator_mm: 360, // Bônus: custom_loop
            included_fans: 0, // Penalidade: airflow
            is_dual_chamber: true, // Bônus: airflow, showcase
        },
    },
    {
        slug: 'demo-nobreak',
        name: 'APC Back-UPS 2200VA',
        category: 'Nobreak',
        categorySlug: 'nobreak',
        price: 1499,
        facts: {
            va_rating: 2200, // Bônus: gaming_pc
            runtime_minutes: 15,
            has_avr: true, // Bônus: rede_instavel
            topology: 'line_interactive', // Bônus: rede_instavel
            has_usb_monitoring: true, // Bônus: servidor
            noise_db: 35,
        },
    },
    {
        slug: 'demo-filtro-linha',
        name: 'Clamper iClamper Energia 8',
        category: 'Filtro de Linha',
        categorySlug: 'filtro-linha',
        price: 129,
        facts: {
            surge_protection_joules: 1440, // Médio
            has_emi_filter: true,
            outlet_count: 8, // Bônus: muitos_aparelhos
            usb_ports: 2,
            has_usb_c: false, // Penalidade: usb
            max_amps: 10,
            has_individual_switches: false,
        },
    },

    // ============================================
    // GAMING
    // ============================================
    {
        slug: 'demo-console',
        name: 'PlayStation 5',
        category: 'Console',
        categorySlug: 'console',
        price: 3999,
        facts: {
            has_disc_drive: true, // Bônus: multimidia
            storage_gb: 825,
            supports_120fps: true, // Bônus: performance
            supports_4k_uhd: true,
            has_vr_support: true, // Bônus: exclusivos
            is_portable: false, // Penalidade: portatil
            backward_compatible: true, // Bônus: exclusivos
            has_subscription_service: true, // Bônus: exclusivos
            family_game_catalog: 200,
        },
    },
    {
        slug: 'demo-controle',
        name: '8BitDo Ultimate Controller',
        category: 'Controle',
        categorySlug: 'controle',
        price: 349,
        facts: {
            stick_type: 'hall_effect', // Bônus: fps, longa_duracao
            battery_hours: 25,
            supports_xinput: true,
            has_bluetooth: true,
            has_back_paddles: true, // Bônus: fps
            has_wired_mode: true, // Bônus: fps, pc
            price: 349,
        },
    },
    {
        slug: 'demo-cadeira',
        name: 'Secretlab Titan Evo 2022',
        category: 'Cadeira Gamer',
        categorySlug: 'cadeira-gamer',
        price: 3999,
        facts: {
            has_lumbar_support: true,
            lumbar_adjustable: true, // Bônus: ergonomia
            armrest_type: '4D', // Bônus: longas_sessoes
            armrest_adjustable: true,
            max_weight_kg: 130,
            base_diameter_cm: 65,
            material: 'leatherette',
        },
    },

    // ============================================
    // LIMPEZA
    // ============================================
    {
        slug: 'demo-robo-aspirador',
        name: 'Roborock S8 Pro Ultra',
        category: 'Robô Aspirador',
        categorySlug: 'robo-aspirador',
        price: 5999,
        facts: {
            has_tangle_free_brush: true, // Bônus: pets
            suction_pa: 6000, // Bônus: pets, tapetes
            battery_minutes: 180, // Bônus: casa_grande
            has_auto_empty: true, // Bônus: autonomo
            navigation: 'lidar', // Bônus: casa_grande
            has_mop: true,
            has_mop_lift: true, // Bônus: mop, tapetes
        },
    },
    {
        slug: 'demo-aspirador-vertical',
        name: 'Dyson V15 Detect',
        category: 'Aspirador Vertical',
        categorySlug: 'aspirador-vertical',
        price: 4999,
        facts: {
            has_motorized_brush: true,
            has_tangle_free_brush: true, // Bônus: pets
            battery_minutes: 60, // Bônus: casa_grande
            suction_aw: 230, // Bônus: tapetes, pets
            weight_kg: 3.1,
            filter_type: 'HEPA', // Bônus: pets
            needs_wall_mount: true,
            has_floor_dock: true,
        },
    },
    {
        slug: 'demo-ventilador',
        name: 'Dyson Pure Cool TP07',
        category: 'Ventilador',
        categorySlug: 'ventilador',
        price: 3499,
        facts: {
            blade_type: 'bladeless', // Bônus: criancas, quarto
            noise_db_min: 28, // Bônus: quarto
            airflow_m3h: 290, // Bônus: sala_grande
            has_humidifier: false, // Penalidade: umidificar
            power_watts: 40, // Bônus: economia
            type: 'tower',
            oscillates: true,
        },
    },

    // ============================================
    // SMART HOME
    // ============================================
    {
        slug: 'demo-camera-seguranca',
        name: 'eufy S330 eufyCam',
        category: 'Câmera de Segurança',
        categorySlug: 'camera-seguranca',
        price: 999,
        facts: {
            ip_rating: 'IP67', // Bônus: externo
            night_vision_range_m: 15, // Bônus: noturno
            has_color_night_vision: true, // Bônus: noturno
            local_storage: true, // Bônus: privacidade
            supports_nas: true, // Bônus: privacidade
            homekit_compatible: true, // Bônus: integracao
            matter_compatible: false,
            is_battery_powered: true, // Bônus: sem_fio
            has_solar_option: true, // Bônus: sem_fio, externo
        },
    },
    {
        slug: 'demo-fechadura',
        name: 'Yale Assure Lock 2',
        category: 'Fechadura Digital',
        categorySlug: 'fechadura',
        price: 1499,
        facts: {
            max_users: 100, // Bônus: familia, airbnb
            has_temporary_codes: true, // Bônus: airbnb
            has_physical_key: true,
            has_wifi: true,
            has_fingerprint: true, // Bônus: familia
            has_remote_unlock: true, // Bônus: airbnb, integracao
            replaces_entire_lock: false,
            is_retrofit_compatible: true, // Bônus: retrofit
        },
    },
    {
        slug: 'demo-roteador',
        name: 'ASUS RT-AX86U Pro',
        category: 'Roteador',
        categorySlug: 'roteador',
        price: 1499,
        facts: {
            wifi_standard: 'wifi6', // Bônus: gaming, muitos_dispositivos
            has_qos: true,
            bands: 2,
            coverage_sqm: 230, // Bônus: casa_grande
            is_mesh: false, // Penalidade: casa_grande
            has_gaming_mode: true, // Bônus: gaming
            has_security_suite: true,
            has_parental_control: true, // Bônus: seguranca
        },
    },

    // ============================================
    // EQUIPAMENTOS
    // ============================================
    {
        slug: 'demo-impressora',
        name: 'Epson EcoTank L3250',
        category: 'Impressora',
        categorySlug: 'impressora',
        price: 999,
        facts: {
            ink_system: 'tank', // Bônus: alto_volume, economico
            max_dpi: 5760,
            has_wifi: true,
            has_scanner: true,
            has_duplex: false, // Penalidade: alto_volume
            has_adf: false, // Penalidade: alto_volume
            ppm: 10, // Penalidade: alto_volume
            color_count: 4,
        },
    },
    {
        slug: 'demo-pneu',
        name: 'Michelin Primacy 4',
        category: 'Pneu',
        categorySlug: 'pneu',
        price: 599,
        facts: {
            compound: 'soft', // Bônus: chuva
            has_silica_compound: true, // Bônus: chuva, cidade
            noise_db: 68, // Bônus: estrada, cidade
            treadwear: 380, // Médio
            rolling_resistance: 'low', // Bônus: economia
            type: 'street', // Penalidade: offroad
        },
    },
    {
        slug: 'demo-bateria-carro',
        name: 'Moura AGM Start-Stop',
        category: 'Bateria Automotiva',
        categorySlug: 'bateria-carro',
        price: 699,
        facts: {
            type: 'AGM', // Bônus: start_stop, acessorios
            ampere_hours: 70,
            cca: 760, // Bônus: caminhonete
            warranty_months: 24, // Bônus: economia
            extreme_temp_rated: true,
        },
    },
    {
        slug: 'demo-lavadora-pressao',
        name: 'Karcher K5 Power Control',
        category: 'Lavadora de Pressão',
        categorySlug: 'lavadora-pressao',
        price: 1299,
        facts: {
            pressure_bar: 145, // Bônus: profissional
            hose_length_m: 8,
            supports_hot_water: false, // Penalidade: agua_quente
            weight_kg: 13,
            flow_lpm: 8.3, // Penalidade: economia_agua
            motor_type: 'induction', // Bônus: profissional
            has_wheels: true, // Bônus: portatil
        },
    },
    {
        slug: 'demo-furadeira',
        name: 'Bosch GSB 18V-50',
        category: 'Furadeira',
        categorySlug: 'furadeira',
        price: 899,
        facts: {
            has_hammer: true, // Para concreto
            torque_nm: 50,
            battery_ah: 4.0,
            weight_kg: 1.8,
            is_cordless: true,
            motor_type: 'brushless', // Bônus: profissional
            is_compact: true, // Bônus: espacos_apertados
            batteries_included: 2, // Bônus: profissional
        },
    },
];

/**
 * Get a demo product by slug.
 */
export function getDemoProduct(slug: string): DemoProduct | undefined {
    return DEMO_PRODUCTS.find(p => p.slug === slug);
}

/**
 * Check if a slug is a demo product.
 */
export function isDemoSlug(slug: string): boolean {
    return slug.startsWith('demo-');
}

/**
 * Get all demo products grouped by category.
 */
export function getDemoProductsByCategory(): Record<string, DemoProduct[]> {
    const grouped: Record<string, DemoProduct[]> = {};

    for (const product of DEMO_PRODUCTS) {
        if (!grouped[product.category]) {
            grouped[product.category] = [];
        }
        grouped[product.category].push(product);
    }

    return grouped;
}

export default DEMO_PRODUCTS;
