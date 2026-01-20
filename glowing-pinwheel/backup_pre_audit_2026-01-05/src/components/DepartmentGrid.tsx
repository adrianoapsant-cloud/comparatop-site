'use client';

import Link from 'next/link';
import {
    Tv, Refrigerator, Wind, Laptop, Smartphone, Headphones,
    Speaker, Gamepad2, Camera, Coffee, Microwave, Sparkles,
    type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// DEPARTMENT DATA
// ============================================

export interface Department {
    id: string;
    name: string;
    icon: LucideIcon;
    slug: string;
    color: string; // Tailwind color class
    productCount?: number;
}

// Full list of departments for scaling to 50+ categories
export const DEPARTMENTS: Department[] = [
    { id: 'tv', name: 'Smart TVs', icon: Tv, slug: '/categorias/smart-tvs', color: 'bg-blue-500' },
    { id: 'fridge', name: 'Geladeiras', icon: Refrigerator, slug: '/categorias/geladeiras', color: 'bg-cyan-500' },
    { id: 'ac', name: 'Ar Condicionado', icon: Wind, slug: '/categorias/ar-condicionados', color: 'bg-sky-500' },
    { id: 'notebook', name: 'Notebooks', icon: Laptop, slug: '/categorias/notebooks', color: 'bg-violet-500' },
    { id: 'smartphone', name: 'Celulares', icon: Smartphone, slug: '/categorias/celulares', color: 'bg-purple-500' },
    { id: 'headphones', name: 'Fones', icon: Headphones, slug: '/categorias/fones', color: 'bg-pink-500' },
    { id: 'speaker', name: 'Caixas de Som', icon: Speaker, slug: '/categorias/caixas-de-som', color: 'bg-rose-500' },
    { id: 'gaming', name: 'Games', icon: Gamepad2, slug: '/categorias/games', color: 'bg-red-500' },
    { id: 'camera', name: 'Câmeras', icon: Camera, slug: '/categorias/cameras', color: 'bg-orange-500' },
    { id: 'coffee', name: 'Cafeteiras', icon: Coffee, slug: '/categorias/cafeteiras', color: 'bg-amber-600' },
    { id: 'microwave', name: 'Micro-ondas', icon: Microwave, slug: '/categorias/micro-ondas', color: 'bg-yellow-500' },
    { id: 'more', name: 'Ver Mais', icon: Sparkles, slug: '/categorias', color: 'bg-gray-400' },
];

// ============================================
// DEPARTMENT CARD COMPONENT
// ============================================

function DepartmentCard({ department }: { department: Department }) {
    const IconComponent = department.icon;

    return (
        <Link
            href={department.slug}
            className={cn(
                'group flex flex-col items-center justify-center',
                'p-4 rounded-2xl',
                'bg-white border border-gray-100',
                'shadow-sm hover:shadow-md',
                'transition-all duration-200',
                'hover:scale-[1.02] hover:border-brand-core/20',
                'active:scale-[0.98]'
            )}
        >
            {/* Icon Circle */}
            <div className={cn(
                'w-12 h-12 md:w-14 md:h-14 rounded-full',
                'flex items-center justify-center',
                'mb-2',
                department.color,
                'text-white',
                'group-hover:scale-110 transition-transform'
            )}>
                <IconComponent size={24} className="md:w-7 md:h-7" />
            </div>

            {/* Name */}
            <span className="text-xs md:text-sm font-medium text-text-primary text-center line-clamp-1">
                {department.name}
            </span>

            {/* Product count (optional) */}
            {department.productCount && department.productCount > 0 && (
                <span className="text-[10px] text-text-muted mt-0.5">
                    {department.productCount} produtos
                </span>
            )}
        </Link>
    );
}

// ============================================
// MAIN GRID COMPONENT
// ============================================

interface DepartmentGridProps {
    departments?: Department[];
    className?: string;
}

export function DepartmentGrid({
    departments = DEPARTMENTS,
    className
}: DepartmentGridProps) {
    return (
        <section className={cn('w-full', className)}>
            {/* Section Title */}
            <div className="mb-4">
                <h2 className="font-display text-lg md:text-xl font-semibold text-text-primary">
                    Explore por Categoria
                </h2>
                <p className="text-sm text-text-muted mt-0.5">
                    Encontre o produto ideal para sua necessidade
                </p>
            </div>

            {/* Grid: 4x3 on mobile, 6x2 on desktop */}
            <div className={cn(
                'grid gap-3',
                'grid-cols-4', // Mobile: 4 columns
                'md:grid-cols-6', // Desktop: 6 columns
            )}>
                {departments.map((dept) => (
                    <DepartmentCard key={dept.id} department={dept} />
                ))}
            </div>
        </section>
    );
}
