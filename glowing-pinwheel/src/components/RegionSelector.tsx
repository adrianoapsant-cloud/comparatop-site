"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, ChevronDown, Check } from "lucide-react";
import { useRegion } from "@/contexts/RegionContext";
import { getStateOptions } from "@/lib/tco/energy-rates";
import { cn } from "@/lib/utils";

interface RegionSelectorProps {
    /** Display variant */
    variant?: "compact" | "full";
    /** Additional class names */
    className?: string;
}

/**
 * RegionSelector - Dropdown to select user's state (UF)
 * 
 * This affects energy rate calculations across the site.
 * The selection is persisted in localStorage.
 */
export function RegionSelector({ variant = "compact", className }: RegionSelectorProps) {
    const { stateCode, stateName, energyRate, setRegion } = useRegion();
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const stateOptions = getStateOptions();

    // Filter states based on search
    const filteredStates = stateOptions.filter(state =>
        state.label.toLowerCase().includes(search.toLowerCase()) ||
        state.value.toLowerCase().includes(search.toLowerCase())
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearch("");
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (state: string) => {
        setRegion(state);
        setIsOpen(false);
        setSearch("");
    };

    if (variant === "compact") {
        return (
            <div ref={dropdownRef} className={cn("relative", className)}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-1.5 px-2 py-1 text-xs text-text-muted hover:text-text-primary transition-colors rounded-lg hover:bg-bg-ground"
                >
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="font-medium">{stateCode}</span>
                    <ChevronDown className={cn("w-3 h-3 transition-transform", isOpen && "rotate-180")} />
                </button>

                {isOpen && (
                    <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                        {/* Search */}
                        <div className="p-2 border-b border-gray-100">
                            <input
                                type="text"
                                placeholder="Buscar estado..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-core"
                                autoFocus
                            />
                        </div>

                        {/* States list */}
                        <div className="max-h-48 overflow-y-auto">
                            {filteredStates.map((state) => (
                                <button
                                    key={state.value}
                                    onClick={() => handleSelect(state.value)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-gray-50 transition-colors",
                                        state.value === stateCode && "bg-brand-core/5 text-brand-core"
                                    )}
                                >
                                    <span>{state.label}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-text-muted">R$ {state.rate.toFixed(2)}/kWh</span>
                                        {state.value === stateCode && (
                                            <Check className="w-3.5 h-3.5 text-brand-core" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Footer info */}
                        <div className="p-2 bg-gray-50 border-t border-gray-100">
                            <p className="text-[10px] text-text-muted text-center">
                                Tarifa afeta o cálculo de Custo Real
                            </p>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Full variant - Card style
    return (
        <div ref={dropdownRef} className={cn("relative", className)}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-brand-core/30 transition-all w-full"
            >
                <div className="w-10 h-10 rounded-full bg-brand-core/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-brand-core" />
                </div>
                <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-text-primary">{stateName}</p>
                    <p className="text-xs text-text-muted">Tarifa: R$ {energyRate.toFixed(2)}/kWh</p>
                </div>
                <ChevronDown className={cn("w-5 h-5 text-text-muted transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                    {/* Search */}
                    <div className="p-3 border-b border-gray-100">
                        <input
                            type="text"
                            placeholder="Buscar estado..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-core/20"
                            autoFocus
                        />
                    </div>

                    {/* States list */}
                    <div className="max-h-64 overflow-y-auto">
                        {filteredStates.map((state) => (
                            <button
                                key={state.value}
                                onClick={() => handleSelect(state.value)}
                                className={cn(
                                    "w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors",
                                    state.value === stateCode && "bg-brand-core/5"
                                )}
                            >
                                <span className="text-sm font-medium">{state.label}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-text-muted">R$ {state.rate.toFixed(2)}/kWh</span>
                                    {state.value === stateCode && (
                                        <Check className="w-4 h-4 text-brand-core" />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
