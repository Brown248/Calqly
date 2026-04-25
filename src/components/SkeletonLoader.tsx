'use client';

import { m } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
  style?: React.CSSProperties;
}

export default function SkeletonLoader({ className = '', variant = 'rect', style }: SkeletonProps) {
  const baseClasses = "bg-slate-200/60 animate-pulse relative overflow-hidden";
  const variantClasses = {
    rect: "rounded-2xl",
    circle: "rounded-full",
    text: "rounded-md h-4 w-full"
  };

  return (
    <m.div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ 
        repeat: Infinity, 
        duration: 1.5, 
        ease: "easeInOut" 
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
    </m.div>
  );
}

export function CalculatorSkeleton() {
  return (
    <div className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm space-y-6">
      <SkeletonLoader variant="circle" className="w-16 h-16" />
      <SkeletonLoader variant="text" className="w-3/4 h-8" />
      <SkeletonLoader variant="text" className="w-full h-4" />
      <SkeletonLoader variant="text" className="w-5/6 h-4" />
      <div className="pt-4">
        <SkeletonLoader variant="rect" className="w-32 h-10 rounded-xl" />
      </div>
    </div>
  );
}

const CHART_BAR_HEIGHTS = [45, 72, 33, 88, 55, 63, 40, 78, 50, 67, 35, 80];

export function ChartSkeleton() {
  return (
    <div className="w-full h-[300px] flex items-end gap-2 px-4 pb-4">
      {CHART_BAR_HEIGHTS.map((h, i) => (
        <SkeletonLoader 
          key={i} 
          className="flex-1" 
          style={{ height: `${h}%` }} 
        />
      ))}
    </div>
  );
}
