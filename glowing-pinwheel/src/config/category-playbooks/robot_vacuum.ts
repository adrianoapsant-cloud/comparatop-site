/**
 * @file robot_vacuum.ts
 * @description Playbook de critérios para Robôs Aspiradores importado de "10 dores.txt"
 * 
 * Pesos: 25+15+15+10+10+8+5+5+5+2 = 100% ✓
 */

import type { CategoryPlaybook } from './tv';

export const ROBOT_VACUUM_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'robot-vacuum',
    displayName: 'Robôs Aspiradores',
    market: 'Mercado Brasileiro',
    criteria: [
        {
            scoreKey: 'c1',
            label: 'Navegação & Mapeamento',
            weight: 0.25,
            painTriggers: [
                'Navegação Aleatória/Estocástica ("Bate-Volta" ineficiente)',
                'Falta de retorno à base (perde-se na casa)',
                'Tempo de limpeza excessivo (>1h para 40m²)',
            ],
            pleasureTriggers: [
                'LiDAR (Laser) ou VSLAM (Câmera)',
                'Mapeamento com Barreiras Virtuais (No-Go Zones)',
                'Gestão de múltiplos andares',
            ],
            implementationNotes: 'Filtro de Área: Se Área > 50m² ou Planta Complexa → ELIMINAR Navegação Aleatória (Ineficiente). LiDAR é o padrão ouro.',
        },
        {
            scoreKey: 'c2',
            label: 'Software & Conectividade',
            weight: 0.15,
            painTriggers: [
                'App "White-Label" genérico (Tuya/SmartLife) com desconexões frequentes',
                'Perda de mapa constante',
                'Tradução ruim ("Português de Tradutor")',
            ],
            pleasureTriggers: [
                'Ecossistema Proprietário Robusto (Mi Home, Roborock, iRobot)',
                'Estabilidade de conexão',
                'Integração Alexa/Google avançada',
            ],
            implementationNotes: 'Confiabilidade: Penalizar marcas que dependem de servidores instáveis. O software define a experiência.',
        },
        {
            scoreKey: 'c3',
            label: 'Eficiência de Mop (Pano)',
            weight: 0.15,
            painTriggers: [
                'Mop Passivo (Pano estático que só arrasta sujeira)',
                'Tanque por gravidade (Risco de estufar piso de madeira)',
                'Pano que precisa ser lavado a cada 10m²',
            ],
            pleasureTriggers: [
                'Mop Ativo (Vibratório ou Rotativo Duplo)',
                'Controle Eletrônico de Água (Bomba)',
                'Base de lavagem de mop (Self-cleaning)',
            ],
            implementationNotes: 'Higiene: Mop estático apenas "pole". Mop ativo limpa manchas. Se piso = Madeira, exigir controle eletrônico.',
        },
        {
            scoreKey: 'c4',
            label: 'Engenharia de Escovas (Pets)',
            weight: 0.10,
            painTriggers: [
                'Escova de cerdas mistas (Vira "velcro" de cabelo)',
                'Necessidade de cortar cabelos com lâmina semanalmente',
            ],
            pleasureTriggers: [
                'Escova 100% Silicone (Anti-Tangle)',
                'Lâminas trituradoras internas',
                'Facilidade de desmontagem das pontas',
            ],
            implementationNotes: 'Teste do Pet: Se Usuário = "Dono de Pet/Cabelo Longo" → Exigir escova de silicone ou tecnologia anti-emaranhamento.',
        },
        {
            scoreKey: 'c5',
            label: 'Restrições Físicas (Altura)',
            weight: 0.10,
            painTriggers: [
                'Torre LiDAR que trava embaixo do sofá/cama',
                'Robô alto (> 9.5cm) em mobília baixa',
            ],
            pleasureTriggers: [
                'Perfil Baixo (< 8cm - VSLAM/Inercial)',
                'Capacidade de escalada > 20mm (Soleiras)',
            ],
            implementationNotes: 'Geometria: Alertar: "Meça a altura do seu sofá". Se Móvel Baixo → Recomendar VSLAM ou Inercial Slim.',
        },
        {
            scoreKey: 'c6',
            label: 'Manutenibilidade (Peças)',
            weight: 0.08,
            painTriggers: [
                'Importado "exótico" sem peça no Brasil',
                'Bateria proprietária não substituível',
                'Custo de reparo > 50% do novo',
            ],
            pleasureTriggers: [
                'Marca Nacional/Oficial (WAP, Electrolux) com peças fáceis',
                'Design modular (Troca fácil DIY)',
                'Filtros HEPA e escovas baratos',
            ],
            implementationNotes: 'TCO (Custo Total): Se não acha a escova lateral no Mercado Livre, penalizar severamente.',
        },
        {
            scoreKey: 'c7',
            label: 'Autonomia (Bateria)',
            weight: 0.05,
            painTriggers: [
                'Bateria viciada em 1 ano (BMS ruim)',
                'Robô que morre no meio da limpeza sem voltar',
            ],
            pleasureTriggers: [
                'Função "Recharge & Resume" (Carrega o necessário e volta)',
                'Bateria > 5200mAh para casas grandes',
            ],
            implementationNotes: 'Eficiência: mAh sozinho não importa. A gestão inteligente de recarga é o diferencial.',
        },
        {
            scoreKey: 'c8',
            label: 'Acústica (Ruído)',
            weight: 0.05,
            painTriggers: [
                'Som agudo/estridente de motor barato',
                'Base de auto-esvaziamento ensurdecedora à noite',
            ],
            pleasureTriggers: [
                'Motor Brushless (Ruído grave/branco)',
                'Modo "Não Perturbe" eficaz',
            ],
            implementationNotes: 'Conforto: Avisar sobre o barulho da base Auto-Empty (turbina de avião por 10s).',
        },
        {
            scoreKey: 'c9',
            label: 'Automação (Docks)',
            weight: 0.05,
            painTriggers: [
                'Reservatório de pó pequeno (400ml) que enche rápido',
                'Mop que fica úmido e cheira mal na base',
            ],
            pleasureTriggers: [
                'Base Auto-Empty (Saco de pó)',
                'Secagem de Mop com ar quente',
            ],
            implementationNotes: 'Independência: Para quem quer "esquecer" da limpeza por semanas, a Dock é mandatória.',
        },
        {
            scoreKey: 'c10',
            label: 'Recursos vs. Gimmicks',
            weight: 0.02,
            painTriggers: [
                'Lâmpada UV fraca (Marketing sem eficácia)',
                'Funções de voz que não funcionam',
            ],
            pleasureTriggers: [
                'Controle Remoto Físico (Acessibilidade para idosos)',
                'IA Frontal para desviar de fezes/cabos',
            ],
            implementationNotes: 'Utilidade: Descartar UV como critério de saúde. Valorizar IA que evita acidentes com pets ("Poopcalypse").',
        },
    ],
};
