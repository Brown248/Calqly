'use client';

import { useTranslations } from 'next-intl';
import CalculatorCard from '@/components/calculators/CalculatorCard';
import BackButton from '@/components/layout/BackButton';
import { m, Variants } from 'framer-motion';
import { 
  Receipt, 
  Home, 
  Palmtree, 
  TrendingUp, 
  CreditCard,
  Sparkles
} from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
  show: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { 
      type: "spring", 
      stiffness: 260, 
      damping: 24 
    } 
  }
};

export default function CalculatorsPage() {
  const t = useTranslations('Calculators');
  const th = useTranslations('Home');

  const TOOLS = [
    { 
      href: '/calculators/tax', 
      icon: <Receipt className="w-7 h-7" />, 
      title: th('calc_tax_title'), 
      desc: th('calc_tax_desc'), 
      badge: t('badge_popular'), 
      color: '#6366F1' 
    },
    { 
      href: '/calculators/loan', 
      icon: <Home className="w-7 h-7" />, 
      title: th('calc_loan_title'), 
      desc: th('calc_loan_desc'), 
      badge: t('badge_recommended'), 
      color: '#10B981' 
    },
    { 
      href: '/calculators/retirement', 
      icon: <Palmtree className="w-7 h-7" />, 
      title: th('calc_retirement_title'), 
      desc: th('calc_retirement_desc'), 
      badge: '', 
      color: '#F59E0B' 
    },
    { 
      href: '/calculators/roi', 
      icon: <TrendingUp className="w-7 h-7" />, 
      title: th('calc_roi_title'), 
      desc: th('calc_roi_desc'), 
      badge: '', 
      color: '#8B5CF6' 
    },
    { 
      href: '/calculators/credit-cards', 
      icon: <CreditCard className="w-7 h-7" />, 
      title: th('calc_credit_cards_title'), 
      desc: th('calc_credit_cards_desc'), 
      badge: '', 
      color: '#EC4899' 
    },
  ];

  return (
    <div className="min-h-screen bg-[#fcfdfd] pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Visual Depth Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
      <m.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-teal-50/40 to-transparent rounded-full blur-[100px] pointer-events-none" 
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-12">
          <BackButton href="/" />
        </div>
        
        <header className="mb-20 text-center max-w-3xl mx-auto">
          <m.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white shadow-sm text-teal-600 text-[11px] font-black tracking-widest uppercase mb-8 border border-teal-100"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            {t('badge_all_tools') || 'Expert Tools'}
          </m.div>
          
          <m.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-slate-800 mb-6 tracking-tight leading-tight uppercase"
          >
            {t('title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600">
              {t('title_accent')}
            </span>
          </m.h1>
          
          <m.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-slate-500 text-lg md:text-xl leading-relaxed font-medium"
          >
            {t('subtitle')}
          </m.p>
        </header>

        <m.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {TOOLS.map((tool) => (
            <m.div key={tool.href} variants={itemVariants}>
              <CalculatorCard 
                {...tool} 
                ctaText={t('cta') || 'เริ่มคำนวณ'} 
              />
            </m.div>
          ))}
        </m.div>
      </div>
    </div>
  );
}
