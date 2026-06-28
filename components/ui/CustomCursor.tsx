"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@/lib/hooks/useWindowSize";

export function CustomCursor() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTouch = useMediaQuery("(hover: none)");
  const [dot, setDot] = useState({ x: 0, y: 0 });
  const [ring, setRing] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (isMobile || isTouch) return;

    let dotX = 0;
    let dotY = 0;
    let ringX = 0;
    let ringY = 0;
    let targetX = 0;
    let targetY = 0;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animate = () => {
      dotX += (targetX - dotX) * 0.35;
      dotY += (targetY - dotY) * 0.35;
      ringX += (targetX - ringX) * 0.15;
      ringY += (targetY - ringY) * 0.15;
      setDot({ x: dotX, y: dotY });
      setRing({ x: ringX, y: ringY });
      raf = requestAnimationFrame(animate);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a, button, [data-cursor-hover], .cursor-hover")
      ) {
        setHovering(true);
      }
    };

    const onOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a, button, [data-cursor-hover], .cursor-hover")
      ) {
        setHovering(false);
      }
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(raf);
    };
  }, [isMobile, isTouch]);

  if (isMobile || isTouch) return null;

  return (
    <>
      <div
        className="fixed top-0 left-0 w-3 h-3 rounded-full bg-brand-gold pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{ left: dot.x, top: dot.y }}
      />
      <div
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-brand-gold/60 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
        style={{
          left: ring.x,
          top: ring.y,
          transform: `translate(-50%, -50%) scale(${hovering ? 2 : 1})`,
          backgroundColor: hovering ? "rgba(212,160,23,0.1)" : "transparent",
        }}
      />
    </>
  );
}
