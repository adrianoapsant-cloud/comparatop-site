import type { Metadata } from "next";
import "./globals.css";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { Header, MobileBottomNav } from "@/components/Header";
import { ComparisonTray } from "@/components/ComparisonTray";

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
    <html lang="pt-BR">
      <body className="bg-noise antialiased min-h-screen">
        <ComparisonProvider>
          <ToastProvider>
            <Header />
            {children}
            <ComparisonTray compareUrl="/comparar" />
            <MobileBottomNav />
          </ToastProvider>
        </ComparisonProvider>
      </body>
    </html>
  );
}
