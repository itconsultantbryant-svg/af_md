"use client";

import { cn } from "@/lib/utils";
import { categories } from "@/lib/data/portfolio";

interface FilterBarProps {
  active: string;
  onChange: (category: string) => void;
}

export function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-12">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={cn(
            "px-5 py-2 rounded-full text-sm font-medium transition-all cursor-hover",
            active === cat.id
              ? "bg-brand-gold text-brand-dark"
              : "bg-white/5 text-brand-muted border border-white/10 hover:border-brand-gold/30"
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
