import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { COMPANY_NAME } from "@/lib/brand";

export const LOGO_PATH = "/afrimind_logo.png";
export const LOGO_ALT = COMPANY_NAME;

const heights = {
  sm: 32,
  md: 40,
  lg: 52,
  xl: 64,
} as const;

type LogoSize = keyof typeof heights;

interface LogoProps {
  size?: LogoSize;
  className?: string;
  href?: string | null;
  priority?: boolean;
}

export function Logo({
  size = "md",
  className,
  href = "/",
  priority = false,
}: LogoProps) {
  const height = heights[size];
  const width = Math.round(height * 2.35);

  const image = (
    <Image
      src={LOGO_PATH}
      alt={LOGO_ALT}
      width={width}
      height={height}
      priority={priority}
      className={cn("w-auto object-contain", className)}
      style={{ height, width: "auto", maxWidth: width }}
    />
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center shrink-0">
        {image}
      </Link>
    );
  }

  return <span className="inline-flex items-center shrink-0">{image}</span>;
}
