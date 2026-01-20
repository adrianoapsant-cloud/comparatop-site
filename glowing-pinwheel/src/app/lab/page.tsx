import { Metadata } from 'next';
import { LabContent } from '@/components/LabContent';

export const metadata: Metadata = {
    title: 'Laboratório de Validação | Consenso 360',
    description: 'Teste o sistema de Scoring Contextual em todas as 52 categorias',
    robots: { index: false, follow: false },
};

export default function LabPage() {
    return <LabContent />;
}
