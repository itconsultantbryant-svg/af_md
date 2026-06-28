"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-brand-gold text-brand-dark hover:bg-brand-gold-light border border-brand-gold",
  secondary:
    "bg-transparent text-white border border-white/40 hover:bg-white hover:text-brand-dark",
  ghost: "bg-transparent text-white border border-transparent hover:border-white/30",
  gold: "bg-transparent text-brand-gold border border-brand-gold hover:bg-brand-gold hover:text-brand-dark",
  danger: "bg-red-600 text-white hover:bg-red-700 border border-red-600",
} as const;

type Variant = keyof typeof variants;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  href?: string;
  className?: string;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", href, className, children, ...props }, ref) => {
    const classes = cn(
      "inline-flex items-center justify-center px-6 py-3 rounded-lg font-body text-sm font-medium transition-all duration-300 cursor-hover",
      variants[variant],
      className
    );

    if (href) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
