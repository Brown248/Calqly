'use client';

import { Link } from '@/i18n/routing';
import { getArticles } from '@/data/articles';
import { useTranslations, useLocale } from 'next-intl';
import { Clock, ArrowRight, Search, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import BackButton from '@/components/layout/BackButton';

export default function ArticlesPage() {
  const t = useTranslations('Articles');
  const locale = useLocale();
  const allArticles = useMemo(() => getArticles(locale), [locale]);
  
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return allArticles;
    
    const query = searchQuery.toLowerCase().trim();
    return allArticles.filter(article => 
      article.title.toLowerCase().includes(query) || 
      article.excerpt.toLowerCase().includes(query) ||
      article.category.toLowerCase().includes(query)
    );
  }, [allArticles, searchQuery]);

  return (
    <div className="min-h-screen bg-[#fcfdfd] pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Abstract background shapes */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-50/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-50/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-12">
          <BackButton href="/" />
        </div>
        
        <header className="mb-20 text-center max-w-2xl mx-auto">
          <m.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="text-4xl md:text-6xl font-black text-slate-800 mb-6 tracking-tight leading-tight uppercase"
          >
            {t('title')}<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600"> {t('subtitle')}</span>
          </m.h1>
          <m.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-slate-500 text-lg md:text-xl leading-relaxed mb-12 font-medium"
          >
            {t('desc')}
          </m.p>

          {/* Search Input with improved styling */}
          <m.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-md mx-auto group"
          >
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none group-focus-within:text-teal-500 transition-colors">
              <Search size={20} className="text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_placeholder')}
              className="w-full pl-16 pr-14 py-5 bg-white border border-slate-100 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus:shadow-[0_20px_40px_rgba(13,148,136,0.08)] focus:border-teal-500/30 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-300"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-6 flex items-center text-slate-300 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </m.div>
        </header>

        <AnimatePresence mode="popLayout">
          {filteredArticles.length > 0 ? (
            <m.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredArticles.map((article, i) => (
                <m.div
                  layout
                  key={article.slug}
                  initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                  transition={{ 
                    delay: i * 0.05,
                    type: "spring",
                    stiffness: 260,
                    damping: 24
                  }}
                >
                  <Link 
                    href={`/articles/${article.slug}`} 
                    className="group flex flex-col h-full bg-white rounded-[40px] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-teal-600/5 transition-all duration-700 hover:-translate-y-2"
                  >
                    <div className="p-10 pb-0">
                      <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-3xl mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm border border-slate-50">
                        {article.icon}
                      </div>
                      <div className="flex items-center gap-4 mb-6">
                        <span className="px-4 py-1.5 rounded-full bg-teal-50 text-teal-600 text-[10px] font-black uppercase tracking-[0.2em] border border-teal-100/50">
                          {article.category}
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <Clock size={12} /> {t('read_time', { time: article.readTime || 5 })}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-slate-800 mb-4 group-hover:text-teal-600 transition-colors line-clamp-2 tracking-tight">
                        {article.title}
                      </h3>
                      <p className="text-slate-500 text-base leading-relaxed line-clamp-3 font-medium mb-12">
                        {article.excerpt}
                      </p>
                    </div>
                    <div className="mt-auto p-10 pt-8 border-t border-slate-50 flex items-center justify-between group-hover:bg-slate-50/30 transition-colors">
                      <span className="text-teal-600 font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                        {t('read_article')}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center group-hover:translate-x-2 transition-transform">
                        <ArrowRight size={16} className="text-teal-600" />
                      </div>
                    </div>
                  </Link>
                </m.div>
              ))}
            </m.div>
          ) : (
            <m.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-32"
            >
              <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner border border-slate-100">
                <Search size={36} className="text-slate-300" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">
                {t('no_results', { query: searchQuery })}
              </h3>
              <p className="text-slate-500 text-lg font-medium mb-10">
                {locale === 'th' ? 'ลองค้นหาด้วยคำสำคัญอื่นๆ' : 'Try searching with different keywords'}
              </p>
              <button 
                onClick={() => setSearchQuery('')}
                className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/10"
              >
                {locale === 'th' ? 'ล้างการค้นหา' : 'Clear search'}
              </button>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
