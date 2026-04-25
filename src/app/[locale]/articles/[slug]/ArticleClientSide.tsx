'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Article, ArticleSection } from '@/data/articles';
import styles from './page.module.css';
import BackButton from '@/components/layout/BackButton';

import SincereAffiliateBox from '@/components/SincereAffiliateBox';

export function AffiliateManager({ article }: { article: Article }) {
  const t = useTranslations('Articles');
  
  const category = article.category;
  
  if (category === 'ภาษี' || category === 'Tax') {
    return (
      <SincereAffiliateBox 
        title={t('aff_tax_title') || 'Plan your Tax Strategy'}
        description={t('aff_tax_desc') || 'Expert advice on Thai Tax saving funds and personal allowance optimization.'}
        ctaText={t('aff_tax_cta') || 'Explore Tax Planning'}
        link="/go/tax-plan"
        colorTheme="teal"
      />
    );
  }

  if (category === 'สินเชื่อ' || category === 'Loan') {
    return (
      <SincereAffiliateBox 
        title={t('aff_loan_title') || 'Refinance & Save'}
        description={t('aff_loan_desc') || 'Check if you can lower your monthly mortgage payments with our bank partners.'}
        ctaText={t('aff_loan_cta') || 'Check Rates'}
        link="/go/refinance"
        colorTheme="indigo"
      />
    );
  }

  return null;
}

export function ArticleBackButton() {
  return (
    <div className="mb-8">
      <BackButton href="/articles" />
    </div>
  );
}

export function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <div className={styles.progressBar} style={{ width: `${progress}%` }} />;
}

export function TOC({ article }: { article: Article }) {
  const [activeSection, setActiveSection] = useState(0);
  const t = useTranslations('Articles');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section]');
      let currentActive = 0;
      sections.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < 200) currentActive = i;
      });
      setActiveSection(currentActive);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <aside className="hidden lg:block w-80 shrink-0">
      <div className="sticky top-32 p-8 bg-white rounded-[32px] border border-slate-100 shadow-sm">
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
          {t('toc')}
        </h4>
        <nav className="space-y-4">
          {article.content.map((section: ArticleSection, i: number) => (
            <a
              key={i}
              href={`#section-${i}`}
              className={`block text-[15px] font-bold transition-all duration-300 ${
                activeSection === i 
                  ? 'text-teal-600 translate-x-2' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {section.heading}
            </a>
          ))}
        </nav>
        <div className="my-8 border-t border-slate-50" />
        <Link 
          href={article.relatedCalc} 
          className="btn btn-primary w-full text-sm py-3.5"
        >
          🧮 {t('start_calc')}
        </Link>
      </div>
    </aside>
  );
}
