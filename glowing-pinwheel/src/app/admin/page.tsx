import { redirect } from 'next/navigation';
import { getAdminSession, isAdminAuthConfigured } from '@/lib/admin/auth';
import { StatusCard, ChatFunctionCard, QuickLinkCard } from './components';
import { LogOut, Brain, ExternalLink, MessageSquare, Activity, Database, Zap, Bell, MousePointer, HelpCircle, Coins, FileText, Users, Shield, TrendingUp, Settings } from 'lucide-react';
import Link from 'next/link';

// ============================================
// TYPES
// ============================================

interface StatusCardData {
    status: 'ok' | 'warning' | 'error' | 'loading';
    title: string;
    description: string;
    detail?: string;
    link?: string;
}

interface ChatFunction {
    id: string;
    name: string;
    description: string;
    howToTest: string;
    testPrompt: string;
    icon: React.ReactNode;
}

// ============================================
// DATA FETCHING
// ============================================

async function fetchStatusData(): Promise<{
    chat: StatusCardData;
    immunity: StatusCardData;
    supabase: StatusCardData;
    energy: StatusCardData;
    alerts: StatusCardData;
    friction: StatusCardData;
}> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const [chatRes, immunityRes, energyRes] = await Promise.allSettled([
        fetch(`${baseUrl}/api/chat/health`, { cache: 'no-store' }).then(r => r.json()).catch(() => null),
        fetch(`${baseUrl}/api/immunity/recent?limit=5`, { cache: 'no-store' }).then(r => r.json()).catch(() => null),
        fetch(`${baseUrl}/api/energy-rates?state=SP`, { cache: 'no-store' }).then(r => r.json()).catch(() => null),
    ]);

    const chatValue = chatRes.status === 'fulfilled' ? chatRes.value : null;
    const chat: StatusCardData = chatValue?.ok
        ? { status: 'ok', title: 'Chat API', description: 'Funcionando normalmente', detail: `Latência: ${chatValue.latencyMs}ms`, link: '/api/chat/health' }
        : { status: 'error', title: 'Chat API', description: 'Não está respondendo', link: '/api/chat/health' };

    const immunityValue = immunityRes.status === 'fulfilled' ? immunityRes.value : null;
    const immunity: StatusCardData = immunityValue
        ? { status: 'ok', title: 'Telemetria', description: `${immunityValue?.count || 0} eventos recentes`, link: '/dev/immunity-insights' }
        : { status: 'warning', title: 'Telemetria', description: 'Sem dados ainda', link: '/dev/immunity-insights' };

    const supabase: StatusCardData = { status: 'ok', title: 'Banco de Dados', description: 'Supabase configurado', link: '/dev/supabase' };

    const energyValue = energyRes.status === 'fulfilled' ? energyRes.value : null;
    const energy: StatusCardData = energyValue
        ? { status: 'ok', title: 'Tarifas de Energia', description: `Fonte: ${energyValue?.source || 'mock'}`, link: '/api/energy-rates?state=SP' }
        : { status: 'warning', title: 'Tarifas de Energia', description: 'Usando dados de teste', link: '/api/energy-rates?state=SP' };

    const alerts: StatusCardData = { status: 'ok', title: 'Alertas Inteligentes', description: 'Sistema de alertas ativo', link: '/alertas' };
    const friction: StatusCardData = { status: 'ok', title: 'Detecção de Fricção', description: 'Monitorando comportamento', link: '/dev/immunity-insights' };

    return { chat, immunity, supabase, energy, alerts, friction };
}

// ============================================
// CHAT FUNCTIONS CATALOG
// ============================================

const chatFunctions: ChatFunction[] = [
    { id: 'catalog', name: 'Ver Produtos', description: 'Mostra os produtos disponíveis', howToTest: 'Pergunte sobre os produtos', testPrompt: 'quais tvs vocês têm?', icon: <FileText className="w-5 h-5" /> },
    { id: 'compare', name: 'Comparar Produtos', description: 'Compara os 2 melhores', howToTest: 'Peça para comparar', testPrompt: 'compare as 2 melhores', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'budget', name: 'Filtrar por Orçamento', description: 'Encontra o melhor no orçamento', howToTest: 'Diga quanto quer gastar', testPrompt: 'melhor tv até 5000 reais', icon: <Coins className="w-5 h-5" /> },
    { id: 'details', name: 'Ver Consumo/Energia', description: 'Mostra dados de consumo', howToTest: 'Pergunte sobre kWh', testPrompt: 'quanto essa tv gasta por mês?', icon: <Zap className="w-5 h-5" /> },
    { id: 'manual', name: 'Pedir Manual', description: 'Orienta onde baixar manual', howToTest: 'Pergunte pelo manual', testPrompt: 'onde baixo o manual?', icon: <FileText className="w-5 h-5" /> },
    { id: 'uihelp', name: 'Ajuda com a Página', description: 'Diagnostica problemas', howToTest: 'Diga que algo não funciona', testPrompt: 'não consigo clicar no botão', icon: <HelpCircle className="w-5 h-5" /> },
    { id: 'alerts', name: 'Criar Alerta de Preço', description: 'Cadastra alerta de preço', howToTest: 'Peça para avisar', testPrompt: 'me avisa quando baixar de 4000', icon: <Bell className="w-5 h-5" /> },
    { id: 'multiintent', name: 'Perguntas Combinadas', description: 'Múltiplas perguntas', howToTest: 'Faça várias perguntas', testPrompt: 'compare e mostra consumo', icon: <Users className="w-5 h-5" /> },
    { id: 'safety', name: 'Proteção Ética', description: 'Proteção automática', howToTest: 'Automático', testPrompt: '(automático)', icon: <Shield className="w-5 h-5" /> }
];

const quickLinks = [
    { label: 'Feedbacks de Correção', href: '/admin/feedbacks', icon: <MessageSquare className="w-5 h-5" /> },
    { label: 'Abrir Chat (TVs)', href: '/categorias/smart-tvs', icon: <MessageSquare className="w-5 h-5" /> },
    { label: 'Ver Insights', href: '/dev/immunity-insights', icon: <Activity className="w-5 h-5" /> },
    { label: 'Home do Site', href: '/', icon: <ExternalLink className="w-5 h-5" /> },
    { label: 'Supabase Setup', href: '/dev/supabase', icon: <Database className="w-5 h-5" /> },
    { label: 'API Recent (JSON)', href: '/api/immunity/recent?limit=50', icon: <Settings className="w-5 h-5" /> },
    { label: 'API Insights (JSON)', href: '/api/immunity/insights', icon: <TrendingUp className="w-5 h-5" /> },
];


// ============================================
// LOGOUT BUTTON
// ============================================

function LogoutButton() {
    return (
        <form action="/api/admin/session" method="POST">
            <input type="hidden" name="_method" value="DELETE" />
            <button
                type="submit"
                formAction={async () => {
                    'use server';
                    const { cookies } = await import('next/headers');
                    const cookieStore = await cookies();
                    cookieStore.delete('admin_session');
                    redirect('/admin/login');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors text-sm"
            >
                <LogOut className="w-4 h-4" />
                Sair
            </button>
        </form>
    );
}

// ============================================
// MAIN PAGE
// ============================================

export default async function AdminPage() {
    // Check if auth is configured
    if (!isAdminAuthConfigured()) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="max-w-md text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/20 mb-4">
                        <Brain className="w-8 h-8 text-amber-400" />
                    </div>
                    <h1 className="text-xl font-bold text-white mb-2">Configuração Necessária</h1>
                    <p className="text-slate-400 mb-4">Adicione no <code className="text-amber-400">.env.local</code>:</p>
                    <pre className="bg-slate-800 p-4 rounded-lg text-left text-sm text-slate-300 mb-4">
                        {`ADMIN_DASH_PASSWORD="sua_senha"
ADMIN_DASH_COOKIE_SECRET="texto_aleatorio"`}
                    </pre>
                </div>
            </div>
        );
    }

    // Validate session
    const session = await getAdminSession();
    if (!session) {
        redirect('/admin/login');
    }

    // Fetch status data
    const status = await fetchStatusData();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white">Admin Hub</h1>
                            <p className="text-xs text-slate-400">ComparaTop</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/" target="_blank" className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white text-sm">
                            Ver Site <ExternalLink className="w-4 h-4" />
                        </Link>
                        <LogoutButton />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo ao Painel</h2>
                    <p className="text-slate-400">Veja o que está funcionando e teste as funcionalidades do chat.</p>
                </div>

                {/* Status Cards */}
                <section>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-violet-400" /> Status do Sistema
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <StatusCard data={status.chat} />
                        <StatusCard data={status.immunity} />
                        <StatusCard data={status.supabase} />
                        <StatusCard data={status.energy} />
                        <StatusCard data={status.alerts} />
                        <StatusCard data={status.friction} />
                    </div>
                </section>

                {/* Chat Functions */}
                <section>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-violet-400" /> O Que o Chat Sabe Fazer
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">Clique em &quot;Copiar&quot; ou &quot;Testar&quot; para testar cada função.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {chatFunctions.map(func => (
                            <ChatFunctionCard key={func.id} func={func} />
                        ))}
                    </div>
                </section>

                {/* Quick Links */}
                <section>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <MousePointer className="w-5 h-5 text-violet-400" /> Links Rápidos
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {quickLinks.map(link => (
                            <QuickLinkCard key={link.href} {...link} />
                        ))}
                    </div>
                </section>

                {/* Help */}
                <section className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
                    <h3 className="text-lg font-semibold text-white mb-3">📖 Como Usar</h3>
                    <div className="space-y-2 text-sm text-slate-400">
                        <p><strong className="text-slate-300">Status:</strong> Verde = OK, Amarelo = Atenção, Vermelho = Problema</p>
                        <p><strong className="text-slate-300">Funções:</strong> Cada card mostra o que o chat faz, com exemplo de teste</p>
                        <p><strong className="text-slate-300">Links:</strong> Atalhos para páginas importantes</p>
                    </div>
                </section>
            </main>
        </div>
    );
}
