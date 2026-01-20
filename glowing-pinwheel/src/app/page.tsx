import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { DepartmentGrid } from '@/components/DepartmentGrid';
import { GuideRail } from '@/components/HorizontalRail';
import { NaturalLanguageSearch } from '@/components/NaturalLanguageSearch';
import { GlobalFooter } from '@/components/GlobalFooter';
import { SmartShelf, WelcomeMessage } from '@/components/SmartShelf';
import { CategoryTabShelf } from '@/components/CategoryTabShelf';
import { HeroWithPeek } from '@/components/SmartNavigation';
import { scoreProduct } from '@/lib/scoring';
import { getAllCategories } from '@/config/categories';
// SSOT: Migrated from @/data/products to productService
import { getProductsByCategory as getProductsByCategorySST } from '@/lib/services/productService';
import {
  getHomePersonalization,
  parseHistoryCookie,
  HISTORY_COOKIE_NAME
} from '@/lib/home-personalization';
import type { ScoredProduct, Product } from '@/types/category';
// SEO: Metadata e JSON-LD
import { homeMetadata } from '@/lib/seo/metadata';
import { websiteJsonLd, organizationJsonLd, homeBreadcrumb, combineJsonLd } from '@/lib/seo/jsonld';

// ============================================
// METADATA (SEO)
// ============================================

export const metadata: Metadata = homeMetadata();

// ============================================
// EDITORIAL PICKS DATA (INVARIANT)
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

export default async function Home() {
  // ========================================
  // DATA LOADING
  // ========================================

  // Get all categories and score products
  const allCategories = getAllCategories();

  // Collect ALL scored products across categories
  // SSOT: Uses productService with compatibility layer
  const allScoredProducts: ScoredProduct[] = allCategories.flatMap(category => {
    const productVMs = getProductsByCategorySST(category.id);
    // Filter: Only show products with health OK or WARN (not FAIL)
    // This prevents broken links to draft products with placeholder images
    const healthyVMs = productVMs.filter(vm => vm.health !== 'FAIL');
    // Extract raw products for scoring compatibility
    const products = healthyVMs.map(vm => vm.raw as Product);
    return products.map(p => scoreProduct(p, category));
  });

  // ========================================
  // PERSONALIZATION (Smart Shelves)
  // ========================================

  // Read user's browsing history from cookies
  const cookieStore = await cookies();
  const historyCookie = cookieStore.get(HISTORY_COOKIE_NAME)?.value;
  const categoryHistory = parseHistoryCookie(historyCookie);

  // Get personalized home configuration
  const homeConfig = getHomePersonalization(categoryHistory);

  // Log for debugging (remove in production)
  console.log('[HomePersonalization]', {
    strategy: homeConfig.strategy,
    reason: homeConfig.reason,
    primaryShelf: homeConfig.primaryShelf.title,
    secondaryShelf: homeConfig.secondaryShelf.title,
    hasWelcome: Boolean(homeConfig.welcomeMessage),
    totalProducts: allScoredProducts.length,
    productCategories: [...new Set(allScoredProducts.map(p => p.categoryId))],
  });

  // ========================================
  // RENDER
  // ========================================

  // Prepare JSON-LD for SEO
  const jsonLd = combineJsonLd(websiteJsonLd(), organizationJsonLd(), homeBreadcrumb());

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen">
        {/* ============================================ */}
        {/* HERO WITH VISUAL PEEKING + SMART NAVIGATION */}
        {/* ============================================ */}
        <HeroWithPeek userAffinity={categoryHistory?.categories?.[0] || null} />

        {/* ============================================ */}
        {/* SMART SHELVES - DYNAMIC CONTENT */}
        {/* ============================================ */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-10 py-6">

          {/* Personalized Welcome (if returning user with interest) */}
          {homeConfig.welcomeMessage && (
            <WelcomeMessage
              message={homeConfig.welcomeMessage}
              className="max-w-md mx-auto"
            />
          )}

          {/* 🎯 PRIMARY SHELF - Personalized based on history */}
          <SmartShelf
            config={homeConfig.primaryShelf}
            allProducts={allScoredProducts}
            showPersonalizationBadge={homeConfig.strategy !== 'default'}
            limit={8}
          />

          {/* 
           * 📋 EDITOR'S PICKS - INVARIANT (Guides)
           * DESABILITADO: Páginas /guias/* ainda não implementadas
           * TODO: Habilitar quando as páginas de guias forem criadas
          \u003cGuideRail
            title="📋 Protocolos de Teste"
            subtitle="Guias técnicos curados pela nossa equipe de auditoria"
            guides={EDITOR_PICKS}
            viewAllLink="/guias"
            viewAllText="Ver todos os protocolos"
          /\u003e
          */}

          {/* 💰 CATEGORY TAB SHELF - Custo-Benefício com abas por categoria */}
          {/* Resolve: Fadiga Cognitiva - não mistura mais categorias diferentes */}
          <CategoryTabShelf
            title="Melhor Custo-Benefício"
            subtitle="Alta performance por real investido"
            icon="💰"
            allProducts={allScoredProducts}
            limit={6}
          />
        </div>
      </main>

      {/* ============================================ */}
      {/* GLOBAL FOOTER - INVARIANT */}
      {/* ============================================ */}
      <GlobalFooter />
    </>
  );
}

