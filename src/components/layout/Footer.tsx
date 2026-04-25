'use client';

import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import Magnetic from '@/components/animations/Magnetic';
import { 
  CircleDollarSign, 
  ShieldCheck, 
  Globe, 
  Zap,
  TrendingUp,
  CreditCard,
  Receipt,
  Palmtree,
  Home as HomeIcon,
  ChevronRight
} from 'lucide-react';

export default function Footer() {
  const t = useTranslations('Footer');
  const locale = useLocale();
  const isTh = locale === 'th';
  const year = new Date().getFullYear() + (isTh ? 543 : 0);

  const FOOTER_SECTIONS = [
    {
      title: t('tools'),
      links: [
        { href: '/calculators/tax', label: t('tax'), icon: <Receipt size={14} /> },
        { href: '/calculators/loan', label: t('loan'), icon: <HomeIcon size={14} /> },
        { href: '/calculators/retirement', label: t('retirement'), icon: <Palmtree size={14} /> },
        { href: '/calculators/roi', label: t('roi'), icon: <TrendingUp size={14} /> },
        { href: '/calculators/credit-cards', label: t('credit_cards'), icon: <CreditCard size={14} /> },
      ]
    },
    {
      title: t('articles'),
      links: [
        { href: '/articles', label: t('art_tax') },
        { href: '/articles', label: t('art_loan') },
        { href: '/articles', label: t('art_save') },
        { href: '/articles', label: t('art_tax_summary') },
      ]
    }
  ];

  return (
    <footer className="bg-zen-muted pt-32 pb-16 relative overflow-hidden">
      {/* Footer background accent */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-500/10 to-transparent" />
      
      <div className="max-w-6xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-24">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-10">
            <Magnetic strength={0.2}>
              <Link href="/" className="flex items-center gap-3.5 group inline-flex">
                <div className="w-12 h-12 rounded-[20px] bg-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-600/20 group-hover:rotate-3 transition-transform duration-500">
                  <CircleDollarSign size={28} strokeWidth={2.5} />
                </div>
                <span className="text-2xl font-extrabold tracking-tight text-slate-800">
                  Calqly<span className="text-teal-600">Hub</span>
                </span>
              </Link>
            </Magnetic>
            <p className="text-lg text-slate-500 leading-relaxed font-medium max-w-sm">
              {t('desc')}
            </p>
            <div className="flex flex-wrap gap-6 items-center">
               <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-100 text-xs font-bold text-teal-600 hover:shadow-md transition-shadow cursor-default">
                  <Zap size={14} fill="currentColor" />
                  <span>{t('fast_calc')}</span>
               </div>
               <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-100 text-xs font-bold text-blue-500 hover:shadow-md transition-shadow cursor-default">
                  <ShieldCheck size={14} fill="currentColor" opacity={0.2} />
                  <span>{t('secure_data')}</span>
               </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-12">
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.title} className="space-y-8">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  {section.title}
                </h4>
                <ul className="space-y-5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link 
                        href={link.href} 
                        className="text-[15px] font-bold text-slate-600 hover:text-teal-600 transition-colors flex items-center gap-3 group"
                      >
                        <span className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300">
                          <ChevronRight size={14} />
                        </span>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer Area - Floating Card */}
        <div className="bg-white rounded-[32px] p-8 shadow-[0_15px_40px_-15px_rgba(30,41,59,0.03)] border border-white mb-20">
          <div className="flex flex-col md:flex-row gap-6 items-center text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div className="space-y-1">
              <h5 className="text-sm font-black text-slate-800 uppercase tracking-wider">{t('warning')}</h5>
              <p className="text-xs font-medium text-slate-400 leading-relaxed">
                {t('disclaimer')}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-slate-200/50">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-teal-500/50" />
              <span>Thailand</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <span suppressHydrationWarning>© {year} CalqlyHub — {t('made_with')}</span>
          </div>
          
          <div className="flex gap-8">
            <Link href="/terms" className="text-[11px] font-black text-slate-400 hover:text-teal-600 transition-colors uppercase tracking-widest">{t('terms')}</Link>
            <Link href="/privacy" className="text-[11px] font-black text-slate-400 hover:text-teal-600 transition-colors uppercase tracking-widest">{t('privacy')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
