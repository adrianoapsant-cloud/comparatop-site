'use client';

/**
 * Energy Profiles Admin UI
 * 
 * Admin-only page for managing SKU-specific energy consumption data.
 * Allows setting kWh/month values independent of product catalog.
 */

import { useState, useEffect, useCallback } from 'react';
import { getAllProducts } from '@/lib/ai/data-retrieval';

interface EnergyProfile {
    sku: string;
    categorySlug?: string;
    kwhMonth: number;
    source: string;
    notes?: string;
    updatedAt: string;
    storage: 'supabase' | 'local';
}

interface Product {
    id: string;
    name: string;
    category: string;
}

const CATEGORIES = [
    { slug: 'smart-tvs', label: 'Smart TVs' },
    { slug: 'geladeiras', label: 'Geladeiras' },
    { slug: 'ar-condicionado', label: 'Ar Condicionado' }
];

const SOURCES = [
    { value: 'manual', label: 'Manual' },
    { value: 'inmetro', label: 'INMETRO' },
    { value: 'fabricante', label: 'Fabricante' },
    { value: 'medicao', label: 'Medição Real' }
];

export default function EnergyProfilesPage() {
    const [selectedCategory, setSelectedCategory] = useState('smart-tvs');
    const [profiles, setProfiles] = useState<Record<string, EnergyProfile>>({});
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Form state per SKU
    const [formState, setFormState] = useState<Record<string, {
        kwhMonth: string;
        source: string;
        notes: string;
    }>>({});

    // Load products from catalog
    useEffect(() => {
        try {
            const allProducts = getAllProducts();
            const mapped = allProducts.map(p => ({
                id: p.id,
                name: p.name,
                category: getCategoryForProduct(p.name)
            }));
            setProducts(mapped);
        } catch (e) {
            console.error('Failed to load products:', e);
        }
    }, []);

    // Load energy profiles
    const loadProfiles = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/energy-profiles?category=${selectedCategory}`);
            if (res.ok) {
                const data = await res.json();
                const map: Record<string, EnergyProfile> = {};
                for (const p of data.profiles || []) {
                    map[p.sku] = p;
                }
                setProfiles(map);
            }
        } catch (e) {
            console.error('Failed to load profiles:', e);
        } finally {
            setLoading(false);
        }
    }, [selectedCategory]);

    useEffect(() => {
        loadProfiles();
    }, [loadProfiles]);

    // Initialize form state when profiles or products change
    useEffect(() => {
        const newFormState: typeof formState = {};
        for (const product of filteredProducts) {
            const profile = profiles[product.id];
            newFormState[product.id] = {
                kwhMonth: profile?.kwhMonth?.toString() || '',
                source: profile?.source || 'manual',
                notes: profile?.notes || ''
            };
        }
        setFormState(newFormState);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profiles, selectedCategory]);

    function getCategoryForProduct(name: string): string {
        const n = name.toLowerCase();
        if (/tv|oled|qled|led/.test(n)) return 'smart-tvs';
        if (/geladeira|refrigerador|frost/.test(n)) return 'geladeiras';
        if (/ar|split|btu/.test(n)) return 'ar-condicionado';
        return 'outros';
    }

    const filteredProducts = products.filter(p => p.category === selectedCategory);

    async function handleSave(sku: string) {
        const form = formState[sku];
        if (!form || !form.kwhMonth) {
            setError('Valor kWh/mês é obrigatório');
            return;
        }

        const kwhMonth = parseFloat(form.kwhMonth);
        if (isNaN(kwhMonth) || kwhMonth < 0) {
            setError('Valor kWh/mês deve ser um número positivo');
            return;
        }

        try {
            setSaving(sku);
            setError(null);

            const res = await fetch('/api/energy-profiles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sku,
                    categorySlug: selectedCategory,
                    kwhMonth,
                    source: form.source,
                    notes: form.notes
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Falha ao salvar');
            }

            // Reload profiles
            await loadProfiles();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Erro ao salvar');
        } finally {
            setSaving(null);
        }
    }

    function updateForm(sku: string, field: 'kwhMonth' | 'source' | 'notes', value: string) {
        setFormState(prev => ({
            ...prev,
            [sku]: {
                ...prev[sku],
                [field]: value
            }
        }));
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <h1 className="text-3xl font-bold mb-2">⚡ Energia por SKU</h1>
            <p className="text-slate-400 mb-6">
                Configure kWh/mês real por produto. Dados independentes do catálogo.
            </p>

            {/* Category Selector */}
            <div className="mb-6">
                <label className="text-sm text-slate-400 block mb-2">Categoria:</label>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700"
                >
                    {CATEGORIES.map(cat => (
                        <option key={cat.slug} value={cat.slug}>{cat.label}</option>
                    ))}
                </select>
            </div>

            {/* Error Display */}
            {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
                    {error}
                </div>
            )}

            {/* Products Table */}
            {loading ? (
                <div className="text-slate-400">Carregando...</div>
            ) : (
                <div className="bg-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-700">
                            <tr>
                                <th className="text-left p-4 text-slate-300">Status</th>
                                <th className="text-left p-4 text-slate-300">SKU / Produto</th>
                                <th className="text-left p-4 text-slate-300">kWh/mês</th>
                                <th className="text-left p-4 text-slate-300">Fonte</th>
                                <th className="text-left p-4 text-slate-300">Notas</th>
                                <th className="text-left p-4 text-slate-300">Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => {
                                const profile = profiles[product.id];
                                const form = formState[product.id] || { kwhMonth: '', source: 'manual', notes: '' };
                                const isReal = profile && profile.source !== 'estimado';
                                const isSaving = saving === product.id;

                                return (
                                    <tr key={product.id} className="border-t border-slate-700">
                                        <td className="p-4">
                                            {isReal ? (
                                                <span className="text-green-400 font-medium">✅ REAL</span>
                                            ) : (
                                                <span className="text-amber-400 font-medium">⚠️ EST.</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-mono text-sm text-slate-400">{product.id}</div>
                                            <div className="text-sm text-white">{product.name.slice(0, 40)}</div>
                                        </td>
                                        <td className="p-4">
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                value={form.kwhMonth}
                                                onChange={(e) => updateForm(product.id, 'kwhMonth', e.target.value)}
                                                placeholder="0.0"
                                                className="w-24 bg-slate-700 text-white px-2 py-1 rounded border border-slate-600"
                                            />
                                        </td>
                                        <td className="p-4">
                                            <select
                                                value={form.source}
                                                onChange={(e) => updateForm(product.id, 'source', e.target.value)}
                                                className="bg-slate-700 text-white px-2 py-1 rounded border border-slate-600"
                                            >
                                                {SOURCES.map(s => (
                                                    <option key={s.value} value={s.value}>{s.label}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-4">
                                            <input
                                                type="text"
                                                value={form.notes}
                                                onChange={(e) => updateForm(product.id, 'notes', e.target.value)}
                                                placeholder="Opcional..."
                                                className="w-32 bg-slate-700 text-white px-2 py-1 rounded border border-slate-600"
                                                maxLength={100}
                                            />
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleSave(product.id)}
                                                disabled={isSaving || !form.kwhMonth}
                                                className="px-3 py-1 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-600 disabled:cursor-not-allowed rounded text-sm"
                                            >
                                                {isSaving ? 'Salvando...' : 'Salvar'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-400">
                                        Nenhum produto nesta categoria
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Storage Info */}
            <div className="mt-6 text-sm text-slate-500">
                Storage: {Object.values(profiles)[0]?.storage || 'local'}
            </div>
        </div>
    );
}
