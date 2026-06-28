import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "glass-card p-6",
        hover &&
          "transition-all duration-300 hover:-translate-y-2 hover:border-brand-gold/60 hover:shadow-[0_8px_40px_rgba(212,160,23,0.15)]",
        className
      )}
    >
      {children}
    </div>
  );
}
