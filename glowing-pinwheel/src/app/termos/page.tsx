import { FileText } from 'lucide-react';

export const metadata = {
    title: 'Termos de Uso | ComparaTop',
    description: 'Termos e condições de uso do site ComparaTop.',
};

export default function TermosPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-3xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium mb-4">
                        <FileText size={16} />
                        Legal
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Termos de Uso
                    </h1>
                    <p className="text-gray-600">
                        Última atualização: Janeiro de 2026
                    </p>
                </div>

                {/* Content */}
                <div className="prose prose-gray max-w-none">
                    <h2>1. Aceitação dos Termos</h2>
                    <p>
                        Ao acessar e usar o ComparaTop, você concorda com estes termos de uso.
                        Se você não concordar, por favor não utilize nosso site.
                    </p>

                    <h2>2. Natureza do Serviço</h2>
                    <p>
                        O ComparaTop é um site de comparação de produtos que oferece análises
                        e recomendações editoriais. Nossas opiniões são baseadas em pesquisa,
                        mas são opiniões - não garantias.
                    </p>

                    <h2>3. Links de Afiliados</h2>
                    <p>
                        Alguns links em nosso site são links de afiliados. Quando você clica
                        e faz uma compra, podemos receber uma comissão. Isso não afeta o preço
                        que você paga nem nossas análises.
                    </p>

                    <h2>4. Precisão das Informações</h2>
                    <p>
                        Fazemos nosso melhor para manter as informações precisas e atualizadas,
                        mas preços, disponibilidade e especificações podem mudar. Sempre
                        verifique as informações diretamente com o vendedor antes de comprar.
                    </p>

                    <h2>5. Propriedade Intelectual</h2>
                    <p>
                        Todo o conteúdo do ComparaTop (textos, gráficos, logos, metodologia)
                        é protegido por direitos autorais. Você pode compartilhar links,
                        mas não copiar nosso conteúdo sem autorização.
                    </p>

                    <h2>6. Isenção de Responsabilidade</h2>
                    <p>
                        O ComparaTop não é responsável por:
                    </p>
                    <ul>
                        <li>Decisões de compra baseadas em nossas recomendações</li>
                        <li>Problemas com produtos comprados através de nossos links</li>
                        <li>Indisponibilidade temporária do site</li>
                    </ul>

                    <h2>7. Modificações</h2>
                    <p>
                        Podemos atualizar estes termos a qualquer momento. Alterações
                        significativas serão comunicadas no site.
                    </p>

                    <h2>8. Contato</h2>
                    <p>
                        Dúvidas sobre os termos? Email:
                        <a href="mailto:contato@comparatop.com.br" className="text-blue-600"> contato@comparatop.com.br</a>
                    </p>
                </div>
            </div>
        </main>
    );
}
