import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { ReviewProvider } from "@/contexts/ReviewContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { RegionProvider } from "@/contexts/RegionContext";
import { Header, MobileBottomNav } from "@/components/Header";
import { GlobalComparisonBar } from "@/components/GlobalComparisonBar";
// DISABLED: Chat temporarily hidden from site
// import { EngineerAssistant } from "@/components/chat/EngineerAssistant";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { FrictionNudge } from "@/components/FrictionNudge";
import { WebVitalsReporter } from "@/components/WebVitalsReporter";

// ============================================
// AUDIT EDITORIAL - Font Configuration
// ============================================
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ComparaTop | Comparativos Premium de Tecnologia",
  description: "Compare os melhores produtos de tecnologia com análises editoriais e scores de qualidade e custo-benefício.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}>
      {/* Preconnect to image CDNs for faster LCP */}
      <head>
        <link rel="preconnect" href="https://m.media-amazon.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://m.media-amazon.com" />
        <link rel="preconnect" href="https://images-na.ssl-images-amazon.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images-na.ssl-images-amazon.com" />
      </head>
      <body className="bg-noise antialiased min-h-screen font-sans text-ct-text">
        <ReviewProvider>
          <ComparisonProvider>
            <ToastProvider>
              <RegionProvider>
                <ChatProvider>
                  <LayoutShell
                    header={<Header />}
                    comparisonBar={<GlobalComparisonBar />}
                    mobileNav={<MobileBottomNav />}
                    chatAssistant={null} // DISABLED: Chat temporarily hidden from site
                  >
                    {children}
                  </LayoutShell>
                  <FrictionNudge />
                </ChatProvider>
              </RegionProvider>
            </ToastProvider>
          </ComparisonProvider>
        </ReviewProvider>
        <WebVitalsReporter />
      </body>
    </html>
  );
}
