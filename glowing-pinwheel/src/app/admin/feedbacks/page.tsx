import { redirect } from 'next/navigation';
import { getAdminSession, isAdminAuthConfigured } from '@/lib/admin/auth';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, RefreshCw } from 'lucide-react';
import { FeedbacksTable } from './components';

// ============================================
// DATA FETCHING
// ============================================

async function fetchFeedbacks() {
    // This runs on the server, so we need to construct the full URL
    const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000';

    try {
        const res = await fetch(`${baseUrl}/api/admin/feedbacks?limit=100`, {
            cache: 'no-store',
            headers: {
                // Pass auth cookie from server context
                Cookie: '',
            }
        });

        if (!res.ok) {
            return { feedbacks: [], total: 0, error: 'Failed to fetch' };
        }

        return await res.json();
    } catch (error) {
        console.error('[admin/feedbacks] Fetch error:', error);
        return { feedbacks: [], total: 0, error: 'Connection failed' };
    }
}

// ============================================
// MAIN PAGE
// ============================================

export default async function FeedbacksPage() {
    // Check auth configuration
    if (!isAdminAuthConfigured()) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-slate-800 rounded-2xl p-8 text-center">
                    <p className="text-slate-300">Sistema não configurado.</p>
                </div>
            </div>
        );
    }

    // Verify session
    const session = await getAdminSession();
    if (!session) {
        redirect('/admin/login');
    }

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Header */}
            <header className="bg-slate-800/50 border-b border-slate-700/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/admin"
                                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-slate-400" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold text-white">Feedbacks de Correção</h1>
                                <p className="text-sm text-slate-400">Gerencie os feedbacks enviados pelos usuários</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <FeedbacksTable />
            </main>
        </div>
    );
}
