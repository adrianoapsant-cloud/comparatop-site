import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Consultor Técnico | ComparaTop Lab",
    description: "Tire suas dúvidas técnicas com o Engenheiro Sênior do ComparaTop. Análise profunda de produtos e recomendações personalizadas.",
};

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
