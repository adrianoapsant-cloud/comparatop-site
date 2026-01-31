import type { NextConfig } from "next";
import { generateNextRedirects } from "./src/config/redirects";

// Bundle Analyzer - ativar com ANALYZE=true
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  devIndicators: false,
  // Porta fixa para o glowing-pinwheel (Loja Principal)
  // warped-equinox usa porta 3001

  // Allow external images for products (draft placeholders, etc.)
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'm.media-amazon.com' },
      { protocol: 'https', hostname: '*.amazon.com' },
      { protocol: 'https', hostname: 'http2.mlstatic.com' },
      { protocol: 'https', hostname: 'm.magazineluiza.com.br' },
      { protocol: 'https', hostname: 'a-static.mlcdn.com.br' },
    ],
  },

  // Redirects canônicos para slugs antigos (308 Permanent)
  async redirects() {
    return generateNextRedirects();
  },

  async rewrites() {
    return [];
  },
};

export default withBundleAnalyzer(nextConfig);
