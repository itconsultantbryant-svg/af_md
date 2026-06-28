"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import CountUpLib from "react-countup";

interface CountUpProps {
  end: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

export function CountUp({
  end,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 2,
  className,
}: CountUpProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (inView) setStart(true);
  }, [inView]);

  return (
    <span ref={ref} className={className}>
      {start ? (
        <CountUpLib
          start={0}
          end={end}
          duration={duration}
          suffix={suffix}
          prefix={prefix}
          decimals={decimals}
        />
      ) : (
        `0${suffix}`
      )}
    </span>
  );
}
