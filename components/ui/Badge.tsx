import { cn } from "@/lib/utils";

const variants = {
  default: "bg-brand-gold/20 text-brand-gold border-brand-gold/30",
  tech: "bg-brand-darker text-brand-muted border-white/10 text-xs",
  level: {
    beginner: "bg-green-500/20 text-green-400 border-green-500/30",
    intermediate: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    advanced: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
  category: {
    healthcare: "bg-red-500/20 text-red-400 border-red-500/30",
    government: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    finance: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    education: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    ngo: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    infrastructure: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  },
} as const;

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "tech";
  level?: keyof typeof variants.level;
  category?: keyof typeof variants.category;
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  level,
  category,
  className,
}: BadgeProps) {
  const colorClass = level
    ? variants.level[level]
    : category
      ? variants.category[category]
      : variants[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full border text-xs font-mono",
        colorClass,
        className
      )}
    >
      {children}
    </span>
  );
}
