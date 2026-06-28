"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  placeholderDataUrl,
  type PlaceholderVariant,
} from "@/lib/placeholders";

interface SiteImageProps {
  src?: string;
  alt: string;
  title?: string;
  variant?: PlaceholderVariant;
  subtitle?: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
}

export function SiteImage({
  src,
  alt,
  title,
  variant = "blog",
  subtitle,
  className,
  fill = false,
  width = 1200,
  height = 675,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: SiteImageProps) {
  const imageSrc =
    src || placeholderDataUrl(title || alt, variant, subtitle);

  if (fill) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className={cn("object-cover", className)}
        priority={priority}
        sizes={sizes}
        unoptimized={imageSrc.startsWith("data:")}
      />
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={cn("object-cover w-full h-full", className)}
      priority={priority}
      sizes={sizes}
      unoptimized={imageSrc.startsWith("data:")}
    />
  );
}
