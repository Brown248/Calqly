'use client';

import { m } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ExternalLink, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

interface SincereAffiliateBoxProps {
  title: string;
  description: string;
  ctaText: string;
  link: string;
  colorTheme?: 'teal' | 'indigo' | 'rose' | 'amber' | 'purple';
  disclaimer?: string;
}

export default function SincereAffiliateBox({ 
  title, 
  description, 
  ctaText, 
  link,
  colorTheme = 'teal',
  disclaimer
}: SincereAffiliateBoxProps) {
  const t = useTranslations('Common');

  const themes = {
    teal: { 
      bg: 'bg-gradient-to-br from-teal-500/5 to-teal-500/10', 
      border: 'border-teal-500/20', 
      text: 'text-slate-800', 
      sub: 'text-teal-700', 
      btn: 'bg-gradient-to-r from-teal-600 to-teal-500 shadow-teal-500/30 hover:shadow-teal-500/50', 
      icon: 'text-teal-500',
      badge: 'bg-teal-100 text-teal-700 border-teal-200',
      hoverShadow: 'hover:shadow-teal-500/10',
      glow: 'bg-teal-400/20 group-hover:bg-teal-400/30'
    },
    indigo: { 
      bg: 'bg-gradient-to-br from-indigo-500/5 to-indigo-500/10', 
      border: 'border-indigo-500/20', 
      text: 'text-slate-800', 
      sub: 'text-indigo-700', 
      btn: 'bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-indigo-500/30 hover:shadow-indigo-500/50', 
      icon: 'text-indigo-500',
      badge: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      hoverShadow: 'hover:shadow-indigo-500/10',
      glow: 'bg-indigo-400/20 group-hover:bg-indigo-400/30'
    },
    rose: { 
      bg: 'bg-gradient-to-br from-rose-500/5 to-rose-500/10', 
      border: 'border-rose-500/20', 
      text: 'text-slate-800', 
      sub: 'text-rose-700', 
      btn: 'bg-gradient-to-r from-rose-600 to-rose-500 shadow-rose-500/30 hover:shadow-rose-500/50', 
      icon: 'text-rose-500',
      badge: 'bg-rose-100 text-rose-700 border-rose-200',
      hoverShadow: 'hover:shadow-rose-500/10',
      glow: 'bg-rose-400/20 group-hover:bg-rose-400/30'
    },
    amber: { 
      bg: 'bg-gradient-to-br from-amber-500/5 to-amber-500/10', 
      border: 'border-amber-500/20', 
      text: 'text-slate-800', 
      sub: 'text-amber-700', 
      btn: 'bg-gradient-to-r from-amber-500 to-amber-400 shadow-amber-500/30 hover:shadow-amber-500/50', 
      icon: 'text-amber-500',
      badge: 'bg-amber-100 text-amber-700 border-amber-200',
      hoverShadow: 'hover:shadow-amber-500/10',
      glow: 'bg-amber-400/20 group-hover:bg-amber-400/30'
    },
    purple: { 
      bg: 'bg-gradient-to-br from-purple-500/5 to-purple-500/10', 
      border: 'border-purple-500/20', 
      text: 'text-slate-800', 
      sub: 'text-purple-700', 
      btn: 'bg-gradient-to-r from-purple-600 to-purple-500 shadow-purple-500/30 hover:shadow-purple-500/50', 
      icon: 'text-purple-500',
      badge: 'bg-purple-100 text-purple-700 border-purple-200',
      hoverShadow: 'hover:shadow-purple-500/10',
      glow: 'bg-purple-400/20 group-hover:bg-purple-400/30'
    },
  };

  const theme = themes[colorTheme] || themes.teal;

  return (
    <m.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className={`relative overflow-hidden rounded-[32px] border ${theme.border} ${theme.bg} p-8 md:p-10 group transition-all duration-700 hover:shadow-2xl ${theme.hoverShadow} hover:-translate-y-1 backdrop-blur-xl`}
    >
      {/* Premium Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      
      {/* Decorative Blur Orbs */}
      <div className={`absolute -top-32 -right-32 w-80 h-80 ${theme.glow} rounded-full blur-[80px] transition-colors duration-700`} />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/60 rounded-full blur-[80px]" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-stretch gap-8 lg:gap-12">
        
        {/* Left: Content */}
        <div className="flex-1 text-center lg:text-left flex flex-col justify-center space-y-5">
          <div className="flex justify-center lg:justify-start">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${theme.badge} border shadow-sm text-[11px] font-black uppercase tracking-[0.2em] transform group-hover:scale-105 transition-transform duration-300`}>
              <Sparkles size={14} className={theme.icon} />
              {t('aff_curated') || 'Curated Recommendation'}
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className={`text-2xl md:text-4xl font-black ${theme.text} tracking-tight leading-tight`}>
              {title}
            </h3>
            <p className={`text-base md:text-lg font-semibold ${theme.sub} leading-relaxed max-w-2xl opacity-90`}>
              {description}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
            <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-slate-500 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/80 shadow-sm">
              <ShieldCheck size={14} className="text-emerald-500" />
              {t('aff_secure') || 'Secure Link'}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-slate-500 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/80 shadow-sm">
              <ExternalLink size={14} />
              {t('aff_verified') || 'Verified Partner'}
            </div>
          </div>
          
          {disclaimer && (
            <p className="text-[11px] font-bold text-slate-400 leading-relaxed max-w-xl">
              {disclaimer}
            </p>
          )}
        </div>

        {/* Right: CTA Button Box */}
        <div className="shrink-0 w-full lg:w-[340px] flex flex-col justify-center">
          <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[32px] border-2 border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center gap-5 group-hover:border-white/90 group-hover:shadow-[0_20px_50px_rgb(0,0,0,0.06)] transition-all duration-500 relative overflow-hidden">
            {/* Subtle inner highlight */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white to-transparent opacity-60 pointer-events-none" />
            
            <m.a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full flex items-center justify-center gap-3 px-8 py-5 sm:py-6 ${theme.btn} text-white rounded-2xl font-black text-[14px] sm:text-[16px] uppercase tracking-widest transition-all group/btn relative z-10`}
            >
              {ctaText}
              <ArrowRight size={18} className="group-hover/btn:translate-x-1.5 transition-transform" />
            </m.a>
            <p className="text-[9px] text-center font-black text-slate-400 uppercase tracking-widest opacity-60 px-2 leading-relaxed relative z-10">
              {t('aff_disclaimer') || 'Commission may be earned from this link'}
            </p>
          </div>
        </div>
      </div>
    </m.div>
  );
}
