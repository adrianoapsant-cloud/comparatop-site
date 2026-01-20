import { DepartmentGrid } from '@/components/DepartmentGrid';
import { ProductRail, GuideRail } from '@/components/HorizontalRail';
import { NaturalLanguageSearch } from '@/components/NaturalLanguageSearch';
import { GlobalFooter } from '@/components/GlobalFooter';
import { scoreProduct } from '@/lib/scoring';
import { getAllCategories } from '@/config/categories';
import { getProductsByCategory } from '@/data/products';
import type { ScoredProduct } from '@/types/category';

// ============================================
// EDITORIAL PICKS DATA
// ============================================

const EDITOR_PICKS = [
  {
    id: 'guide-tv-ps5',
    title: 'Melhor TV para PS5 em 2024',
    description: 'Análise completa: VRR, 120Hz, HDMI 2.1 e input lag testados.',
    category: 'Smart TVs',
    href: '/guias/melhor-tv-ps5',
  },
  {
    id: 'guide-ac-economia',
    title: 'Ar Condicionado que Economiza Luz',
    description: 'Como escolher um inverter que realmente reduz a conta de energia.',
    category: 'Ar Condicionado',
    href: '/guias/ar-condicionado-economia',
  },
  {
    id: 'guide-geladeira-familia',
    title: 'Geladeira para Família Grande',
    description: 'Frost Free, French Door ou Side by Side? Descubra a ideal.',
    category: 'Geladeiras',
    href: '/guias/geladeira-familia-grande',
  },
];

// ============================================
// HOME PAGE COMPONENT
// ============================================

export default function Home() {
  // Get all categories and score products
  const allCategories = getAllCategories();

  // Collect ALL scored products across categories
  const allScoredProducts: ScoredProduct[] = allCategories.flatMap(category => {
    const products = getProductsByCategory(category.id);
    return products.map(p => scoreProduct(p, category));
  });

  // Sort by quality score (descending) for "Most Popular"
  const popularProducts = [...allScoredProducts]
    .sort((a, b) => b.scores.quality - a.scores.quality)
    .slice(0, 8);

  // Sort by value score for "Best Value"
  const bestValueProducts = [...allScoredProducts]
    .sort((a, b) => b.scores.value - a.scores.value)
    .slice(0, 8);

  return (
    <>
      <main className="min-h-screen">
        {/* ============================================ */}
        {/* HERO SECTION - AUDIT AUTHORITY */}
        {/* ============================================ */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 md:py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-white/90">
                Auditoria Independente • 9 Fontes Verificadas
              </span>
            </div>

            {/* Main headline */}
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Não compre no escuro.
              <span className="block text-brand-core">
                Auditorias técnicas independentes baseadas em dados.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              Cruzamos testes de laboratório com a realidade do mercado brasileiro.
              Sem publicidade paga. Sem patrocínio. Apenas mérito.
            </p>

            {/* Mad Libs Search Widget */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl max-w-3xl mx-auto">
              <p className="text-slate-600 text-sm font-medium mb-4">
                🔬 Decida em 1 Minuto
              </p>
              <NaturalLanguageSearch />
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* METHODOLOGY PILLARS */}
        {/* ============================================ */}
        <section className="py-12 px-4 bg-gradient-to-b from-slate-50 to-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔬</span>
                </div>
                <h3 className="font-display font-bold text-text-primary mb-2">
                  Metodologia Consenso 360º
                </h3>
                <p className="text-sm text-text-secondary">
                  Cruzamos RTINGS, YouTube BR, Reclame Aqui e mais 6 fontes antes de emitir veredito.
                </p>
              </div>

              <div className="text-center p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🇧🇷</span>
                </div>
                <h3 className="font-display font-bold text-text-primary mb-2">
                  Foco no Mercado Brasileiro
                </h3>
                <p className="text-sm text-text-secondary">
                  Custo de reparo, pós-venda local e apps nacionais pesam na nota final.
                </p>
              </div>

              <div className="text-center p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="font-display font-bold text-text-primary mb-2">
                  Sem Publicidade Paga
                </h3>
                <p className="text-sm text-text-secondary">
                  Rankings baseados em mérito técnico, não em patrocínio ou comissão.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* DEPARTMENT GRID - Hub Navigation */}
        {/* ============================================ */}
        <section className="py-10 px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold text-text-primary mb-2">
                Laboratório de Testes
              </h2>
              <p className="text-text-muted">
                Escolha uma categoria para ver nossas auditorias
              </p>
            </div>
            <DepartmentGrid />
          </div>
        </section>

        {/* ============================================ */}
        {/* HORIZONTAL RAILS */}
        {/* ============================================ */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-10 py-6">
          {/* 🔥 Most Popular Products */}
          <ProductRail
            title="🏆 Aprovados na Auditoria"
            subtitle="Produtos que passaram em todos os critérios técnicos"
            products={popularProducts}
            showRank={true}
            viewAllLink="/populares"
            viewAllText="Ver ranking completo"
          />

          {/* 🏆 Editor's Picks (Guides) */}
          <GuideRail
            title="📋 Protocolos de Teste"
            subtitle="Guias técnicos curados pela nossa equipe de auditoria"
            guides={EDITOR_PICKS}
            viewAllLink="/guias"
            viewAllText="Ver todos os protocolos"
          />

          {/* 💰 Best Value Products */}
          <ProductRail
            title="💰 Melhor Custo-Benefício"
            subtitle="Alta performance por real investido"
            products={bestValueProducts}
            showRank={true}
            viewAllLink="/custo-beneficio"
            viewAllText="Ver mais ofertas"
          />
        </div>
      </main>

      {/* ============================================ */}
      {/* GLOBAL FOOTER */}
      {/* ============================================ */}
      <GlobalFooter />
    </>
  );
}
