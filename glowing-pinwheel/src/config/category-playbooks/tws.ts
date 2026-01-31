/**
 * @file tws.ts
 * @description Playbook de critérios para Fones TWS importado de "10 dores.txt"
 * 
 * Pesos: 20+15+15+10+10+10+8+5+5+2 = 100% ✓
 */

import type { CategoryPlaybook } from './tv';

export const TWS_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'tws',
    displayName: 'Fones TWS',
    market: 'Mercado Brasileiro',
    criteria: [
        {
            scoreKey: 'c1',
            label: 'Ergonomia & Estabilidade (Conforto)',
            weight: 0.20,
            painTriggers: [
                'Dor na cartilagem após 30min (Design volumoso)',
                'Fone que cai no treino ou ao mastigar',
                'Peso excessivo que causa fadiga',
            ],
            pleasureTriggers: [
                'Design de haste (Stem) para equilíbrio',
                'Pontas de espuma/silicone variadas',
                'Fixação segura sem pressão no canal',
            ],
            implementationNotes: 'Filtro Físico: Se Uso = "Esporte" → ELIMINAR modelos que caem fácil. Conforto é o maior motivo de devolução.',
        },
        {
            scoreKey: 'c2',
            label: 'Microfone em Ambiente Hostil',
            weight: 0.15,
            painTriggers: [
                'Voz robótica/metálica com cancelamento de ruído agressivo',
                'Amplificação de vento (Inutilizável na rua)',
                'Necessidade de desligar o fone para falar',
            ],
            pleasureTriggers: [
                'Haste com microfone direcional (Beamforming)',
                'Resistência ao vento eficaz',
                'Voz natural em chamadas no metrô/rua',
            ],
            implementationNotes: 'Teste de Chamada: Ignorar testes em sala silenciosa. Avaliar performance com ruído de fundo (ônibus/vento).',
        },
        {
            scoreKey: 'c3',
            label: 'Autonomia Real (Bateria)',
            weight: 0.15,
            painTriggers: [
                'Drenagem assimétrica (Um lado descarrega antes)',
                'Autonomia < 4h com ANC ligado',
                'Estojo que perde carga sozinho',
            ],
            pleasureTriggers: [
                'Carga Rápida (5min = 1h)',
                'Autonomia > 6h com ANC',
                'Degradação baixa após 1 ano',
            ],
            implementationNotes: 'Longevidade: Penalizar marcas com histórico de "morte súbita" de bateria (ex: Sony XM4).',
        },
        {
            scoreKey: 'c4',
            label: 'Qualidade de Som & EQ',
            weight: 0.10,
            painTriggers: [
                'Som "sem graça" (Falta de sub-graves)',
                'Agudos estridentes/sibilantes',
                'App sem equalizador ou com presets fixos',
            ],
            pleasureTriggers: [
                'Assinatura "Divertida" (V-Shape bem feito)',
                'App com EQ Gráfico Personalizável',
                'Palco sonoro amplo',
            ],
            implementationNotes: 'Perfil Sonoro: Não exigir "neutralidade audiófila" para público geral. Valorizar graves controlados e EQ.',
        },
        {
            scoreKey: 'c5',
            label: 'Conectividade (Multiponto)',
            weight: 0.10,
            painTriggers: [
                'Falta de Multiponto (Não conecta PC + Celular)',
                'Latência alta em vídeos/jogos (Desync labial)',
                'Quedas de conexão frequentes',
            ],
            pleasureTriggers: [
                'Bluetooth Multiponto Real',
                'Modo Jogo (Baixa Latência < 80ms)',
                'Troca rápida entre dispositivos',
            ],
            implementationNotes: 'Produtividade: Para "Trabalho", Multiponto é obrigatório (Teams + Celular).',
        },
        {
            scoreKey: 'c6',
            label: 'ANC & Transparência',
            weight: 0.10,
            painTriggers: [
                'Efeito "Vácuo" (Pressão no ouvido/Náusea)',
                'Modo Transparência artificial (Chiado/Vento)',
                'ANC que muda o som da música',
            ],
            pleasureTriggers: [
                'ANC que filtra ruído de motor (Ônibus)',
                'Modo Transparência Natural (Voz clara)',
                'Sem pressão excessiva nos ouvidos',
            ],
            implementationNotes: 'Qualidade do Silêncio: ANC bom não é só dB, é conforto. Transparência natural é vital para segurança na rua.',
        },
        {
            scoreKey: 'c7',
            label: 'Durabilidade & IP',
            weight: 0.08,
            painTriggers: [
                'Oxidação dos contatos de carga (Suor)',
                'Estojo frágil que abre ao cair',
                'Plástico liso e escorregadio',
            ],
            pleasureTriggers: [
                'Classificação IPX4 ou superior',
                'Estojo robusto com ímã forte',
                'Contatos resistentes à corrosão',
            ],
            implementationNotes: 'Resistência: Para uso em academia, proteção contra suor é mandatória.',
        },
        {
            scoreKey: 'c8',
            label: 'Usabilidade (Controles)',
            weight: 0.05,
            painTriggers: [
                'Toques acidentais (Travesseiro/Cabelo)',
                'Comandos não personalizáveis',
                'Sensor de uso falho (Pausa sozinho)',
            ],
            pleasureTriggers: [
                'Controles por "Aperto" (Pinch) ou Botão Físico',
                'App completo com remapeamento total',
                'Detecção de uso precisa',
            ],
            implementationNotes: 'Interação: Touch capacitivo sensível demais é falha de design. Botão físico/Pinch é superior.',
        },
        {
            scoreKey: 'c9',
            label: 'Custo-Benefício & Garantia',
            weight: 0.05,
            painTriggers: [
                'Importado sem garantia no Brasil',
                'Preço Premium com bateria descartável',
                'Risco de tributação alta (Remessa Conforme)',
            ],
            pleasureTriggers: [
                'Garantia Nacional de 1 ano',
                'Representação oficial (Peças/Troca)',
                'Preço justo pela performance',
            ],
            implementationNotes: 'Segurança: Alerta para importados caros sem suporte local. Valorizar garantia oficial.',
        },
        {
            scoreKey: 'c10',
            label: 'Inovação (Extras)',
            weight: 0.02,
            painTriggers: [
                'Áudio Espacial artificial (Soa estranho)',
                'Carregamento apenas por cabo',
            ],
            pleasureTriggers: [
                'Carregamento Sem Fio (Qi)',
                'Função "Find My" (Encontrar fone perdido)',
                'Áudio Espacial com Head Tracking real',
            ],
            implementationNotes: 'Conveniência: Carregamento sem fio fideliza o usuário. "Find My" salva o investimento.',
        },
    ],
};
