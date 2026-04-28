'use client';

import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { m } from 'framer-motion';
import { BookOpen, ArrowRight, Sparkles, Clock } from 'lucide-react';

interface RelatedArticlesSidebarProps {
  category: 'tax' | 'loan' | 'retirement' | 'roi';
}

const ARTICLES_MAP = {
  tax: {
    slug: 'thai-tax-guide-2569',
    title: { th: 'วิธีลดหย่อนภาษี 2569', en: 'Thai Tax Guide 2026' },
    readTime: 8,
    icon: '📋'
  },
  loan: {
    slug: 'home-loan-guide-2569',
    title: { th: 'เทคนิคผ่อนบ้านให้หมดไว', en: 'Home Loan Guide' },
    readTime: 7,
    icon: '🏠'
  },
  retirement: {
    slug: 'retirement-planning-first-jobber',
    title: { th: 'วางแผนเกษียณฉบับเริ่มต้น', en: 'Retirement 101' },
    readTime: 6,
    icon: '🌴'
  },
  roi: {
    slug: 'compound-interest-power',
    title: { th: 'พลังของดอกเบี้ยทบต้น', en: 'Power of Compounding' },
    readTime: 5,
    icon: '📈'
  }
};

export default function RelatedArticlesSidebar({ category }: RelatedArticlesSidebarProps) {
  const t = useTranslations('Articles');
  const locale = useLocale() as 'th' | 'en';
  const article = ARTICLES_MAP[category];

  if (!article) return null;

  return (
    <m.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 px-2">
        <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shadow-sm border border-teal-100">
          <BookOpen size={16} />
        </div>
        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
          {t('related_articles') || 'Related Guides'}
        </h4>
      </div>

      <Link 
        href={`/articles/${article.slug}`}
        className="group block p-8 bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-teal-600/5 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden"
      >
        {/* Subtle Background Glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-teal-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{article.icon}</span>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Clock size={12} /> {t('read_time', { time: article.readTime })}
            </div>
          </div>
          
          <h5 className="text-lg font-black text-slate-800 group-hover:text-teal-600 transition-colors mb-3 leading-tight tracking-tight">
            {article.title[locale]}
          </h5>
          
          <div className="flex items-center gap-2 text-xs font-black text-teal-600 uppercase tracking-widest">
            {t('read_article') || 'Read Guide'}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>

      <div className="p-8 rounded-[32px] bg-slate-900/5 border border-slate-100 flex flex-col items-center text-center gap-4">
        <Sparkles size={24} className="text-teal-500 animate-pulse" />
        <p className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase tracking-widest">
          {category === 'tax' 
            ? (locale === 'th' ? 'อย่าพลาดสิทธิประหยัดภาษีในปีนี้!' : 'Don\'t miss out on tax savings this year!') 
            : (locale === 'th' ? 'อ่านเคล็ดลับเพิ่มเติมในคลังความรู้ของเรา' : 'Learn more expert tips in our knowledge hub.')}
        </p>
        <Link href="/articles" className="text-[10px] font-black text-teal-600 uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">
          {t('view_all') || 'View All Articles'}
        </Link>
      </div>
    </m.div>
  );
}
