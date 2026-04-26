'use client';

import { useEffect, useRef, useState } from 'react';
import { useMotionValue, useTransform, animate, MotionValue } from 'framer-motion';

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
  const [displayValue, setDisplayValue] = useState(direction === 'up' ? "0" : value.toLocaleString());

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
    });

    return controls.stop;
  }, [value, count]);

  useEffect(() => {
    return count.on('change', (latest) => {
      const formatted = new Intl.NumberFormat('th-TH', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: includeComma,
      }).format(latest);
      setDisplayValue(formatted);
    });
  }, [count, decimals, includeComma]);

  return (
    <span className="tabular-nums">
      {prefix}{displayValue}{suffix}
    </span>
  );
}
