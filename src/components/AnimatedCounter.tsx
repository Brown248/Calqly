'use client';

import { useEffect, useState, useRef } from 'react';
import { animate, useInView } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  direction?: 'up' | 'down';
  includeComma?: boolean;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

export default function AnimatedCounter({ 
  value, 
  direction = 'up', 
  includeComma = true,
  suffix = '',
  prefix = '',
  decimals = 0
}: AnimatedCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10px" });
  const [display, setDisplay] = useState(
    new Intl.NumberFormat('th-TH', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: includeComma,
    }).format(direction === 'up' ? 0 : value)
  );

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(direction === 'up' ? 0 : value, value, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(latest) {
        setDisplay(new Intl.NumberFormat('th-TH', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
          useGrouping: includeComma,
        }).format(latest));
      }
    });

    return controls.stop;
  }, [value, decimals, includeComma, direction, isInView]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{display}{suffix}
    </span>
  );
}
