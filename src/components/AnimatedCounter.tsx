'use client';

import { useEffect, useRef } from 'react';
import { useMotionValue, useTransform, animate, MotionValue } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  direction?: 'up' | 'down';
  includeDecimals?: boolean;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function AnimatedCounter({
  value,
  direction = 'up',
  includeDecimals = false,
  prefix = '',
  suffix = '',
  className = '',
}: AnimatedCounterProps) {
  const count = useMotionValue(direction === 'up' ? 0 : value);
  const rounded = useTransform(count, (latest) => {
    const formatter = new Intl.NumberFormat('th-TH', {
      minimumFractionDigits: includeDecimals ? 2 : 0,
      maximumFractionDigits: includeDecimals ? 2 : 0,
    });
    return formatter.format(latest);
  });

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1], // Custom easeOutQuart-like for premium feel
    });
    return () => controls.stop();
  }, [value, count]);

  return (
    <span className={className}>
      {prefix}
      <AnimatedValue value={rounded} />
      {suffix}
    </span>
  );
}

function AnimatedValue({ value }: { value: MotionValue<string> }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = value.get();
    }
    return value.on('change', (latest: string) => {
      if (ref.current) {
        ref.current.textContent = latest;
      }
    });
  }, [value]);

  return <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>{value.get()}</span>;
}
