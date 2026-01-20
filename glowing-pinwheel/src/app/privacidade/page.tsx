import { Lock } from 'lucide-react';

export const metadata = {
    title: 'Política de Privacidade | ComparaTop',
    description: 'Saiba como tratamos seus dados pessoais no ComparaTop.',
};

export default function PrivacidadePage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-3xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium mb-4">
                        <Lock size={16} />
                        Legal
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Política de Privacidade
                    </h1>
                    <p className="text-gray-600">
                        Última atualização: Janeiro de 2026
                    </p>
                </div>

                {/* Content */}
                <div className="prose prose-gray max-w-none">
                    <h2>1. Informações que Coletamos</h2>
                    <p>
                        O ComparaTop coleta informações de forma limitada para melhorar sua experiência:
                    </p>
                    <ul>
                        <li><strong>Dados de navegação:</strong> páginas visitadas, tempo de permanência</li>
                        <li><strong>Dados técnicos:</strong> tipo de dispositivo, navegador, sistema operacional</li>
                        <li><strong>Preferências:</strong> produtos comparados, alertas de preço configurados</li>
                    </ul>

                    <h2>2. Como Usamos Suas Informações</h2>
                    <p>Utilizamos as informações para:</p>
                    <ul>
                        <li>Melhorar nosso conteúdo e recomendações</li>
                        <li>Enviar alertas de preço (quando você solicitar)</li>
                        <li>Entender como nosso site é usado (analytics)</li>
                    </ul>

                    <h2>3. Cookies</h2>
                    <p>
                        Utilizamos cookies essenciais para funcionamento do site e cookies
                        de analytics (Google Analytics) para entender o uso do site.
                    </p>

                    <h2>4. Compartilhamento de Dados</h2>
                    <p>
                        <strong>Não vendemos seus dados.</strong> Compartilhamos apenas com:
                    </p>
                    <ul>
                        <li>Google Analytics (analytics anônimos)</li>
                        <li>Parceiros afiliados (apenas quando você clica em links de compra)</li>
                    </ul>

                    <h2>5. Seus Direitos (LGPD)</h2>
                    <p>Você tem direito a:</p>
                    <ul>
                        <li>Acessar seus dados</li>
                        <li>Solicitar correção</li>
                        <li>Solicitar exclusão</li>
                        <li>Revogar consentimento</li>
                    </ul>

                    <h2>6. Contato</h2>
                    <p>
                        Para questões sobre privacidade, entre em contato pelo email:
                        <a href="mailto:privacidade@comparatop.com.br" className="text-blue-600"> privacidade@comparatop.com.br</a>
                    </p>
                </div>
            </div>
        </main>
    );
}
