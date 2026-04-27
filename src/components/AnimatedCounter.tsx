'use client';

import { useEffect, useState } from 'react';
import { useMotionValue, useTransform, animate, useMotionValueEvent } from 'framer-motion';

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
  const count = useMotionValue(direction === 'up' ? 0 : value);
  const rounded = useTransform(count, (latest) => {
    return new Intl.NumberFormat('th-TH', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: includeComma,
    }).format(latest);
  });

  const [display, setDisplay] = useState(rounded.get());

  useMotionValueEvent(rounded, "change", (latest) => {
    setDisplay(latest);
  });

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
    });

    return controls.stop;
  }, [value, count]);

  return (
    <span className="tabular-nums">
      {prefix}{display}{suffix}
    </span>
  );
}
