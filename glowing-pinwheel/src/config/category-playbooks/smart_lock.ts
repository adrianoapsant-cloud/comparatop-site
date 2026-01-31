/**
 * @file smart_lock.ts
 * @description Playbook de critérios para Fechaduras Digitais
 * Pesos: 15+15+10+10+10+10+10+10+5+5 = 100% ✓
 */
import type { CategoryPlaybook } from './tv';

export const SMART_LOCK_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'smart_lock',
    displayName: 'Fechaduras Digitais',
    market: 'Mercado Brasileiro',
    criteria: [
        { scoreKey: 'c1', label: 'Energia & Redundância', weight: 0.15, painTriggers: ['Uso de bateria recarregável', 'Alimentação 9V obsoleta', 'Vazamento de pilhas'], pleasureTriggers: ['Porta USB-C/Micro-USB de emergência', 'Aviso de bateria fraca antecipado', 'Autonomia > 12 meses'], implementationNotes: 'Se Emergência = "9V" → Penalizar. Alertar: "NUNCA usar pilhas recarregáveis".' },
        { scoreKey: 'c2', label: 'Tecnologia Biométrica', weight: 0.15, painTriggers: ['Sensor Óptico (Falha com dedo sujo/molhado)', 'Alta taxa de rejeição para idosos/crianças'], pleasureTriggers: ['Sensor Capacitivo', 'Redundância Tripla (Bio + Senha + Tag)', 'Leitura em < 0.5s'], implementationNotes: 'Se Família tem Idosos/Crianças → ELIMINAR Sensor Óptico.' },
        { scoreKey: 'c3', label: 'Conectividade & Rede', weight: 0.10, painTriggers: ['Wi-Fi Nativo instável', 'Bluetooth puro', 'Latência > 5s'], pleasureTriggers: ['Zigbee com Hub', 'Ecossistema Tuya', 'App proprietário robusto'], implementationNotes: 'Para automação séria, priorizar Zigbee.' },
        { scoreKey: 'c4', label: 'Instalação & Retrofit', weight: 0.10, painTriggers: ['Mortise fora do padrão ABNT', 'Incompatibilidade com porta Pivotante', 'Instalação em porta de vidro sem adaptador'], pleasureTriggers: ['Modelo de Sobrepor', 'Maçaneta reversível', 'Padrão ABNT 14913'], implementationNotes: 'Se Porta = "Fina" → Recomendar Sobrepor.' },
        { scoreKey: 'c5', label: 'Resistência Climática (IP)', weight: 0.10, painTriggers: ['Painel Touch plástico exposto ao sol', 'Instalação externa sem marquise'], pleasureTriggers: ['IP55+ Real', 'Teclado de Vidro Temperado', 'Proteção contra maresia'], implementationNotes: 'Se Sol Direto → ELIMINAR modelos plásticos comuns.' },
        { scoreKey: 'c6', label: 'UX de Software (Gestão)', weight: 0.10, painTriggers: ['App sem logs de entrada', 'Falta de Senha Temporária', 'App "White Label" mal traduzido'], pleasureTriggers: ['Senhas OTP', 'Agendamento de acesso', 'Notificação Push instantânea'], implementationNotes: 'Se Uso = "Airbnb" → Exigir Senhas Dinâmicas.' },
        { scoreKey: 'c7', label: 'Segurança Lógica/Física', weight: 0.10, painTriggers: ['Vulnerável a Bobina de Tesla', 'Lingueta simples', 'Plástico frágil'], pleasureTriggers: ['Proteção Eletromagnética', 'Travamento Multiponto ou Deadbolt', 'Função "Senha Falsa"'], implementationNotes: 'Penalizar modelos genéricos sem certificação.' },
        { scoreKey: 'c8', label: 'Suporte & Peças', weight: 0.10, painTriggers: ['Importação sem peças', 'Motor que falha em 6 meses'], pleasureTriggers: ['Garantia Nacional (1-2 anos)', 'Rede de assistência', 'Marca consolidada (Intelbras, Yale, Elsys)'], implementationNotes: 'Alertar: "Importado barato pode virar lixo eletrônico".' },
        { scoreKey: 'c9', label: 'Ergonomia & Design', weight: 0.05, painTriggers: ['Maçaneta dura', 'Feedback sonoro irritante'], pleasureTriggers: ['Sistema Push-Pull', 'Feedback vocal em Português', 'Design slim'], implementationNotes: 'Push-Pull é o padrão ouro para acessibilidade.' },
        { scoreKey: 'c10', label: 'Custo Total (TCO)', weight: 0.05, painTriggers: ['Custo oculto de marceneiro', 'Hub Zigbee vendido separadamente'], pleasureTriggers: ['Instalação DIY', 'Kit completo na caixa'], implementationNotes: 'Somar Preço Fechadura + Custo Instalação.' },
    ],
};
