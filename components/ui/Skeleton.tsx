import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-white/5 border border-white/5",
        className
      )}
    />
  );
}

export function CanvasSkeleton({ className }: SkeletonProps) {
  return (
    <Skeleton className={cn("w-full h-full min-h-[400px]", className)} />
  );
}
