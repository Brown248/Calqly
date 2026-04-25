'use client';
import { m } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import React, { memo } from 'react';

interface CalculatorCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  badge?: string;
  color: string;
  ctaText: string;
}

function CalculatorCard({ href, icon, title, desc, badge, color, ctaText }: CalculatorCardProps) {
  return (
    <Link href={href} className="block h-full group">
      <m.div
        whileHover={{ 
          y: -12,
          transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
        }}
        className="relative bg-white/70 backdrop-blur-xl rounded-[40px] p-10 border border-white/60 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] hover:shadow-[0_32px_64px_-16px_rgba(13,148,136,0.16)] transition-all duration-700 overflow-hidden flex flex-col h-full"
      >
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent pointer-events-none" />
        
        {/* Accent Background Glow */}
        <div 
          className="absolute -top-32 -right-32 w-72 h-72 rounded-full opacity-[0.04] group-hover:opacity-[0.12] group-hover:scale-150 transition-all duration-1000 blur-3xl"
          style={{ backgroundColor: color }}
        />
        
        {/* Bottom accent line */}
        <div 
          className="absolute bottom-0 left-10 right-10 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700"
          style={{ background: `linear-gradient(90deg, transparent, ${color}80, transparent)` }}
        />

        <div className="flex justify-between items-start mb-10 relative z-10">
          <div 
            className="w-16 h-16 rounded-[24px] flex items-center justify-center shadow-sm border border-black/[0.03] transition-all duration-700 group-hover:scale-110 group-hover:-rotate-6 group-hover:shadow-lg"
            style={{ background: `linear-gradient(135deg, ${color}15, white)`, color: color }}
          >
            {icon}
          </div>
          {badge && (
            <m.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.15em] border shadow-sm"
              style={{ 
                backgroundColor: `${color}08`, 
                color: color, 
                borderColor: `${color}20` 
              }}
            >
              {badge}
            </m.span>
          )}
        </div>

        <h3 className="text-2xl font-black text-slate-800 mb-5 group-hover:text-slate-900 transition-colors relative z-10 tracking-tight">
          {title}
        </h3>
        
        <p className="text-slate-500 text-base leading-relaxed mb-10 flex-grow relative z-10 font-medium opacity-90 group-hover:opacity-100 transition-opacity">
          {desc}
        </p>

        <div 
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-black text-sm transition-all duration-500 relative z-10 self-start border shadow-sm group-hover:shadow-md"
          style={{ 
            backgroundColor: `${color}08`,
            color: color,
            borderColor: `${color}15`,
          }}
        >
          <span className="group-hover:mr-1 transition-all duration-300">{ctaText}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-500" />
        </div>
      </m.div>
    </Link>
  );
}

export default memo(CalculatorCard);
