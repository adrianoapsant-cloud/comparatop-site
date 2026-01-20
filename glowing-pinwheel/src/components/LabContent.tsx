'use client';

import Link from 'next/link';
import DEMO_PRODUCTS, { getDemoProductsByCategory } from '@/data/scoring-mocks';

// Group icons by category type
const CATEGORY_ICONS: Record<string, string> = {
    'Ar Condicionado': '❄️',
    'Geladeira': '🧊',
    'Freezer': '🥶',
    'Frigobar': '🍺',
    'Adega': '🍷',
    'Máquina de Lavar': '🧺',
    'Lava e Seca': '🌀',
    'Lava-Louças': '🍽️',
    'Micro-ondas': '📡',
    'Fogão': '🔥',
    'Air Fryer': '🍟',
    'Cafeteira': '☕',
    'Batedeira': '🥄',
    'Purificador': '💧',
    'Coifa': '🌬️',
    'Forno de Embutir': '♨️',
    'Smartphone': '📱',
    'Smart TV': '📺',
    'Notebook': '💻',
    'Tablet': '📲',
    'Monitor': '🖥️',
    'Projetor': '🎥',
    'Câmera': '📷',
    'TV Box': '🎞️',
    'Soundbar': '🔊',
    'Fone TWS': '🎧',
    'Headset Gamer': '🎮',
    'Caixa de Som': '🔈',
    'Smartwatch': '⌚',
    'Processador': '⚙️',
    'Placa de Vídeo': '🎨',
    'Memória RAM': '💾',
    'Placa-Mãe': '🔌',
    'Fonte': '⚡',
    'SSD': '💿',
    'Gabinete': '🖳',
    'Nobreak': '🔋',
    'Filtro de Linha': '🔗',
    'Console': '🕹️',
    'Controle': '🎯',
    'Cadeira Gamer': '🪑',
    'Robô Aspirador': '🤖',
    'Aspirador Vertical': '🧹',
    'Ventilador': '🌪️',
    'Câmera de Segurança': '📹',
    'Fechadura Digital': '🔐',
    'Roteador': '📶',
    'Impressora': '🖨️',
    'Pneu': '🛞',
    'Bateria Automotiva': '🔌',
    'Lavadora de Pressão': '💦',
    'Furadeira': '🔧',
};

export function LabContent() {
    const groupedProducts = getDemoProductsByCategory();
    const categories = Object.keys(groupedProducts).sort();

    return (
        <div className="lab-page">
            <header className="lab-header">
                <h1>🧪 Laboratório de Validação</h1>
                <p className="lab-subtitle">
                    <strong>Consenso 360° - Scoring Contextual</strong>
                </p>
                <p className="lab-description">
                    Clique em qualquer categoria para testar o sistema de pontuação dinâmica.
                    Altere o contexto do usuário e veja a nota mudar em tempo real.
                </p>
                <div className="lab-stats">
                    <span className="stat">
                        <strong>{categories.length}</strong> Categorias
                    </span>
                    <span className="stat">
                        <strong>{DEMO_PRODUCTS.length}</strong> Produtos Demo
                    </span>
                </div>
            </header>

            <main className="lab-grid">
                {categories.map((category) => {
                    const products = groupedProducts[category];
                    const product = products[0];
                    const icon = CATEGORY_ICONS[category] || '📦';

                    return (
                        <Link
                            key={product.slug}
                            href={`/produto/${product.slug}`}
                            className="lab-card"
                        >
                            <span className="lab-card__icon">{icon}</span>
                            <span className="lab-card__category">{category}</span>
                            <span className="lab-card__product">{product.name}</span>
                            <span className="lab-card__arrow">→</span>
                        </Link>
                    );
                })}
            </main>

            <footer className="lab-footer">
                <p>
                    Cada produto demo tem especificações projetadas para ativar penalidades e
                    bônus específicos. Experimente selecionar diferentes contextos na página do produto.
                </p>
                <p>
                    Exemplo: No <strong>Ar Condicionado</strong>, selecione &quot;Litoral&quot; para ver
                    a penalidade de corrosão da serpentina de alumínio.
                </p>
            </footer>

            <style jsx>{`
                .lab-page {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #0f0f23 0%, #1a1a3a 100%);
                    padding: 2rem;
                    color: #e1e1e6;
                }

                .lab-header {
                    text-align: center;
                    margin-bottom: 3rem;
                    padding-bottom: 2rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .lab-header h1 {
                    font-size: 2.5rem;
                    font-weight: 800;
                    margin-bottom: 0.5rem;
                    background: linear-gradient(90deg, #a855f7, #6366f1);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .lab-subtitle {
                    font-size: 1.1rem;
                    color: #a855f7;
                    margin-bottom: 1rem;
                }

                .lab-description {
                    color: #a1a1aa;
                    max-width: 600px;
                    margin: 0 auto 1.5rem;
                }

                .lab-stats {
                    display: flex;
                    justify-content: center;
                    gap: 2rem;
                }

                .stat {
                    background: rgba(168, 85, 247, 0.1);
                    padding: 0.5rem 1rem;
                    border-radius: 9999px;
                    font-size: 0.9rem;
                }

                .stat strong {
                    color: #a855f7;
                    font-size: 1.1rem;
                }

                .lab-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 1rem;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .lab-card {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem 1.25rem;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 12px;
                    text-decoration: none;
                    color: inherit;
                    transition: all 0.2s ease;
                }

                .lab-card:hover {
                    background: rgba(168, 85, 247, 0.1);
                    border-color: rgba(168, 85, 247, 0.3);
                    transform: translateY(-2px);
                }

                .lab-card__icon {
                    font-size: 1.5rem;
                    flex-shrink: 0;
                }

                .lab-card__category {
                    font-weight: 600;
                    color: #f4f4f5;
                    flex-shrink: 0;
                }

                .lab-card__product {
                    flex: 1;
                    font-size: 0.85rem;
                    color: #71717a;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .lab-card__arrow {
                    color: #a855f7;
                    font-weight: 600;
                    opacity: 0;
                    transform: translateX(-5px);
                    transition: all 0.2s ease;
                }

                .lab-card:hover .lab-card__arrow {
                    opacity: 1;
                    transform: translateX(0);
                }

                .lab-footer {
                    text-align: center;
                    margin-top: 3rem;
                    padding-top: 2rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    color: #71717a;
                    font-size: 0.9rem;
                    max-width: 700px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .lab-footer p {
                    margin-bottom: 0.75rem;
                }

                .lab-footer strong {
                    color: #a855f7;
                }

                @media (max-width: 640px) {
                    .lab-page {
                        padding: 1rem;
                    }

                    .lab-header h1 {
                        font-size: 1.75rem;
                    }

                    .lab-grid {
                        grid-template-columns: 1fr;
                    }

                    .lab-card__product {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
}
