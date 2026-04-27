'use client';

import { Link } from '@/i18n/routing';
import AnimatedCounter from '@/components/AnimatedCounter';
import CharacterReveal from '@/components/animations/CharacterReveal';
import RevealText from '@/components/animations/RevealText';
import { useTranslations } from 'next-intl';
import { m, Variants, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useRef, useMemo } from 'react';
import { 
  Receipt, 
  Home as HomeIcon, 
  Palmtree, 
  TrendingUp, 
  CreditCard,
  ArrowRight,
  Sparkles,
  BarChart3,
  ShieldCheck,
  Building2,
  Activity
} from 'lucide-react';
import { useFinancialStore } from '@/hooks/useFinancialStore';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 200, 
      damping: 25 
    } 
  }
};

export default function Home() {
  const t = useTranslations('Home');
  const targetRef = useRef(null);
  const { scrollY } = useScroll();
  
  const projects = useFinancialStore((state) => state.projects);
  const summary = useMemo(() => {
    const totalDebt = projects
      .filter(p => p.type === 'loan' || p.type === 'credit-card')
      .reduce((sum, p) => {
        const input = p.input as Record<string, unknown>;
        return sum + (Number(input.amount || input.balance || 0));
      }, 0);
      
    const estRefund = projects
      .filter(p => p.type === 'tax')
      .reduce((sum, p) => {
        const res = p.result as Record<string, unknown>;
        return (res.taxToPay as number) < 0 ? sum + Math.abs(res.taxToPay as number) : sum;
      }, 0);

    const totalInvested = projects
      .filter(p => p.type === 'roi' || p.type === 'retirement')
      .reduce((sum, p) => {
        const input = p.input as Record<string, unknown>;
        const amount = Number(input.initialInvestment || input.startingSavings || input.amount || 0);
        return sum + amount;
      }, 0);

    return { totalDebt, estRefund, totalInvested, count: projects.length };
  }, [projects]);

  const trustCardClasses = {
    blue: 'bg-blue-50 text-blue-500 border border-blue-100/50',
    emerald: 'bg-emerald-50 text-emerald-500 border border-emerald-100/50',
    purple: 'bg-purple-50 text-purple-500 border border-purple-100/50',
  } as const;
  
  // Smoother, more subtle springs for parallax
  const y1 = useSpring(useTransform(scrollY, [0, 800], [0, 120]), { stiffness: 80, damping: 30 });
  const y2 = useSpring(useTransform(scrollY, [0, 800], [0, -80]), { stiffness: 80, damping: 30 });
  const rotate1 = useSpring(useTransform(scrollY, [0, 1500], [0, 30]), { stiffness: 80, damping: 30 });
  const opacityHero = useTransform(scrollY, [0, 400], [1, 0]);
  const scaleHero = useTransform(scrollY, [0, 400], [1, 0.98]);

  const CALCULATORS = [
    { href: '/calculators/tax', icon: <Receipt className="w-6 h-6" />, title: t('calc_tax_title'), desc: t('calc_tax_desc'), color: '#6366F1' },
    { href: '/calculators/loan', icon: <HomeIcon className="w-6 h-6" />, title: t('calc_loan_title'), desc: t('calc_loan_desc'), color: '#10B981' },
    { href: '/calculators/retirement', icon: <Palmtree className="w-6 h-6" />, title: t('calc_retirement_title'), desc: t('calc_retirement_desc'), color: '#F59E0B' },
    { href: '/calculators/roi', icon: <TrendingUp className="w-6 h-6" />, title: t('calc_roi_title'), desc: t('calc_roi_desc'), color: '#8B5CF6' },
    { href: '/calculators/credit-cards', icon: <CreditCard className="w-6 h-6" />, title: t('calc_credit_cards_title'), desc: t('calc_credit_cards_desc'), color: '#EC4899' },
  ];

  const STATS = [
    { value: 5, suffix: '+', label: t('stat_tools'), icon: <BarChart3 size={24} /> },
    { value: 4, suffix: '+', label: t('stat_articles'), icon: <Building2 size={24} /> },
    { value: 100, suffix: '%', label: t('stat_free').replace(' 100%', ''), icon: <ShieldCheck size={24} /> },
  ];

  return (
    <div className="min-h-screen bg-[#fcfdfd] overflow-hidden" ref={targetRef}>
      {/* Hero Section */}
      <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 overflow-hidden">
        {/* Multi-layered background */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.15]" />
        
        <m.div style={{ y: y1, rotate: rotate1 }} className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-teal-200/20 rounded-full blur-[140px] pointer-events-none" />
        <m.div style={{ y: y2 }} className="absolute top-60 right-1/4 w-[500px] h-[500px] bg-purple-200/15 rounded-full blur-[120px] pointer-events-none" />
        
        <m.div 
          style={{ opacity: opacityHero, scale: scaleHero }}
          className="max-w-5xl mx-auto px-6 relative z-10 text-center"
        >
          <m.div 
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/40 backdrop-blur-md text-teal-600 text-[9px] font-black uppercase tracking-[0.3em] mb-10 border border-white/50 shadow-sm"
          >
            <Sparkles size={12} className="text-teal-500" />
            {t('badge')}
          </m.div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-800 mb-8 tracking-[-0.03em] leading-[1.1]">

            <CharacterReveal text={t('title_1')} delay={0.1} />
            <br />
            <span className="relative whitespace-nowrap inline-block mt-2">
              <span className="relative z-10 bg-gradient-to-r from-teal-800 via-emerald-700 to-teal-800 bg-clip-text text-transparent italic px-4">
                <CharacterReveal text={t('title_2')} delay={0.6} />
              </span>
              <m.span 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                transition={{ delay: 1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-1 left-0 right-0 h-3 bg-teal-400/10 -z-10 -rotate-1 rounded-full blur-[2px]" 
              />
            </span>
            <br />
            <CharacterReveal text={t('title_3')} delay={1} />
          </h1>

          <RevealText 
            text={t('sub')}
            className="text-slate-500 text-base md:text-lg max-w-lg mx-auto mb-12 leading-relaxed font-medium opacity-80"
            delay={1.5}
          />

          <m.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, type: "spring", stiffness: 150, damping: 25 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24"
          >
            <m.div whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="/calculators" className="btn btn-primary btn-lg w-full sm:w-auto min-w-[240px] group text-lg px-8 py-5 rounded-2xl shadow-xl shadow-teal-500/20">
                {t('cta_calc')}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </m.div>
            <m.div whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="/articles" className="btn btn-secondary btn-lg w-full sm:w-auto min-w-[200px] text-lg px-8 py-5 rounded-2xl bg-white/80 backdrop-blur-md">
                {t('cta_articles')}
              </Link>
            </m.div>
          </m.div>

          {/* Floating decorative glass cards */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 1 }}
            className="relative max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-center gap-6">
              {[
                { icon: <Receipt size={22} />, color: '#6366F1', label: 'Tax' },
                { icon: <TrendingUp size={22} />, color: '#8B5CF6', label: 'ROI' },
                { icon: <Palmtree size={22} />, color: '#F59E0B', label: 'Retire' },
              ].map((item, i) => (
                <m.div 
                  key={i}
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, i % 2 === 0 ? 3 : -3, 0]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 4 + i, 
                    delay: i * 0.8, 
                    ease: "easeInOut" 
                  }}
                  className="px-8 py-4 bg-white/60 backdrop-blur-lg rounded-[24px] border border-white/80 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.08)] flex items-center gap-3 group hover:scale-105 transition-transform cursor-default"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform" style={{ color: item.color, backgroundColor: `${item.color}15` }}>
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-black text-slate-600 uppercase tracking-[0.2em]">{item.label}</span>
                </m.div>
              ))}
            </div>
          </m.div>
        </m.div>
      </section>

      {/* Financial Overview Dashboard (Conditional) - Zen Premium Edition */}
      <AnimatePresence>
        {summary.count > 0 && (
          <m.section 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="py-24 bg-[#fcfdfd] relative overflow-hidden"
          >
            {/* Ultra-soft sophisticated background textures */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,#0d948805,transparent_40%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_75%,#6366f103,transparent_40%)]" />
            
            <div className="max-w-6xl mx-auto px-6 relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-16">
                <div className="flex items-center gap-7">
                  <div className="relative">
                    <div className="absolute inset-0 bg-teal-500/10 blur-2xl rounded-full animate-pulse" />
                    <div className="w-16 h-16 bg-white border border-teal-50 rounded-3xl flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-teal-600 relative z-10">
                        <Activity size={32} strokeWidth={2.2} />
                    </div>
                  </div>
                  <div>
                      <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight leading-none">{t('my_overview_title') || 'My Financial Overview'}</h2>
                      <div className="flex items-center gap-2.5 mt-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">{t('my_overview_sub') || 'Personal Wealth Analysis'}</p>
                      </div>
                  </div>
                </div>
                <m.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/calculators" className="px-8 py-4 bg-white border border-slate-100 rounded-2xl text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] hover:text-teal-600 hover:border-teal-100 hover:bg-teal-50/30 transition-all shadow-sm">
                    {t('manage_projects')}
                  </Link>
                </m.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { label: t('total_debt_label') || 'Total Debt', value: summary.totalDebt, icon: <HomeIcon size={24} />, sub: t('total_debt_sub') || 'Active liabilities', color: 'rose', accent: '#f43f5e' },
                  { label: t('est_refund_label') || 'Potential Refund', value: summary.estRefund, icon: <Receipt size={24} />, sub: t('est_refund_sub') || 'Tax optimization', color: 'teal', accent: '#0d9488' },
                  { label: t('total_invest_label') || 'Total Assets', value: summary.totalInvested, icon: <TrendingUp size={24} />, sub: t('total_invest_sub') || 'Investment volume', color: 'emerald', accent: '#10b981' },
                ].map((item, i) => (
                  <m.div 
                    key={i} 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, type: "spring", stiffness: 100, damping: 20 }}
                    className="group relative h-full"
                  >
                    {/* Floating Glass Card */}
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-[44px] border border-white/80 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.03)] transition-all duration-700 group-hover:shadow-[0_48px_80px_-20px_rgba(0,0,0,0.06)] group-hover:-translate-y-2" />
                    
                    <div className="relative p-10 flex flex-col h-full z-10">
                      <div className="flex justify-between items-start mb-12">
                         <div className="w-14 h-14 rounded-[22px] flex items-center justify-center transition-all duration-700 group-hover:scale-110 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.02)]" style={{ color: item.accent, backgroundColor: `${item.accent}05`, border: `1.5px solid ${item.accent}10` }}>
                           {item.icon}
                         </div>
                         <div className="px-3 py-1 rounded-full bg-slate-50/50 border border-slate-100/50 text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</div>
                      </div>
                      
                      <div className="mt-auto">
                        <div className="text-4xl lg:text-5xl font-black text-slate-800 mb-4 tracking-tighter flex items-baseline gap-2">
                           <AnimatedCounter value={item.value} /> 
                           <span className="text-lg text-slate-300 font-bold">฿</span>
                        </div>
                        <p className="text-[12px] font-bold text-slate-400 leading-relaxed group-hover:text-slate-600 transition-colors uppercase tracking-wide">{item.sub}</p>
                      </div>

                      {/* Micro-interaction Line */}
                      <div className="absolute bottom-10 right-10 w-8 h-1 bg-slate-100 rounded-full overflow-hidden">
                         <m.div 
                           initial={{ x: '-100%' }}
                           whileHover={{ x: '0%' }}
                           className="h-full w-full"
                           style={{ backgroundColor: item.accent }}
                         />
                      </div>
                    </div>
                  </m.div>
                ))}
              </div>
            </div>
          </m.section>
        )}
      </AnimatePresence>

      {/* Calculator Cards */}
      <section className="py-28 relative overflow-hidden">
        {/* Section background with gradient fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/50 to-white" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/60 to-transparent" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <m.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 150, damping: 25 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-5 tracking-tight">
              {t('section_title_1')}
              <span className="bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent relative inline-block mx-2">
                {t('section_title_2')}
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-teal-200/40" viewBox="0 0 100 12" preserveAspectRatio="none">
                  <path d="M0,10 Q50,0 100,10" stroke="currentColor" strokeWidth="6" fill="none" />
                </svg>
              </span>
            </h2>
            <p className="text-slate-500 text-base md:text-lg font-medium max-w-xl mx-auto leading-relaxed">{t('section_desc')}</p>
          </m.div>

          <m.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {CALCULATORS.map((calc, i) => (
              <m.div key={i} variants={itemVariants} className="h-full">
                <Link 
                  href={calc.href} 
                  className="group block h-full p-8 rounded-[32px] bg-white/70 backdrop-blur-xl border border-white/60 hover:border-teal-200/50 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.03)] hover:shadow-[0_24px_48px_-12px_rgba(13,148,136,0.12)] hover:-translate-y-2 transition-all duration-700 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full opacity-[0.03] group-hover:opacity-[0.10] group-hover:scale-150 transition-all duration-1000 blur-3xl" style={{ backgroundColor: calc.color }} />
                  
                  <div className="w-16 h-16 rounded-[24px] flex items-center justify-center mb-8 transition-all duration-700 group-hover:scale-110 group-hover:-rotate-3 shadow-sm border border-black/[0.03] relative z-10 group-hover:shadow-md" style={{ color: calc.color, background: `linear-gradient(135deg, ${calc.color}15, white)` }}>
                    {calc.icon}
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-4 transition-colors relative z-10 tracking-tight">{calc.title}</h3>
                  <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-8 flex-grow relative z-10 font-medium">{calc.desc}</p>
                  
                  <div className="inline-flex items-center gap-2 text-xs font-black transition-all relative z-10 px-5 py-3 rounded-xl border shadow-sm group-hover:shadow-md" style={{ color: calc.color, backgroundColor: `${calc.color}08`, borderColor: `${calc.color}15` }}>
                    {t('cta_calc')} <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </Link>
              </m.div>
            ))}
          </m.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-6">
          <m.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {STATS.map((stat, i) => (
              <m.div 
                key={i} 
                variants={itemVariants} 
                className="group relative p-10 rounded-[40px] bg-white border border-slate-100 shadow-[0_8px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-20px_rgba(13,148,136,0.15)] hover:-translate-y-2 transition-all duration-700 overflow-hidden text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-teal-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative z-10 w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:bg-teal-50 group-hover:text-teal-500 transition-all duration-700">
                  {stat.icon}
                </div>

                <div className="relative z-10 text-4xl md:text-5xl font-black text-slate-800 mb-4 tracking-tighter">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                
                <div className="relative z-10 text-sm font-bold text-slate-500 uppercase tracking-widest group-hover:text-teal-600 transition-colors duration-500">
                  {stat.label}
                </div>
              </m.div>
            ))}
          </m.div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/30 to-[#fcfdfd]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/60 to-transparent" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <m.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-6 tracking-tight">{t('trust_title')}</h2>
            <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto">{t('trust_subtitle')}</p>
          </m.div>
          
          <m.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: <BarChart3 size={36} strokeWidth={2.5} />, color: 'blue', title: t('trust_rd_title'), desc: t('trust_rd_desc') },
              { icon: <Building2 size={36} strokeWidth={2.5} />, color: 'emerald', title: t('trust_bot_title'), desc: t('trust_bot_desc') },
              { icon: <ShieldCheck size={36} strokeWidth={2.5} />, color: 'purple', title: t('trust_safe_title'), desc: t('trust_safe_desc') },
            ].map((item, i) => (
              <m.div key={i} variants={itemVariants} className="p-10 rounded-[32px] bg-white/60 backdrop-blur-md border border-white/50 shadow-[0_8px_24px_-12px_rgba(30,41,59,0.06)] hover:shadow-[0_20px_40px_-15px_rgba(13,148,136,0.12)] hover:-translate-y-2 transition-all duration-500 text-center group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                <div className={`${trustCardClasses[item.color as keyof typeof trustCardClasses]} w-20 h-20 rounded-[20px] flex items-center justify-center mx-auto mb-8 shadow-sm group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 relative z-10`}>
                  {item.icon}
                </div>
                <h4 className="text-xl font-black text-slate-800 mb-4 tracking-tight relative z-10">{item.title}</h4>
                <p className="text-base text-slate-500 leading-relaxed font-medium relative z-10">{item.desc}</p>
              </m.div>
            ))}
          </m.div>
        </div>
      </section>
    </div>
  );
}
