'use client';
import { useState, useMemo } from 'react';
import { CREDIT_CARDS, CARD_TYPES } from '@/data/creditCards';
import { formatNumber } from '@/utils/formatters';
import { useTranslations, useLocale } from 'next-intl';
import { m, AnimatePresence } from 'framer-motion';
import BackButton from '@/components/layout/BackButton';
import { CreditCard, Check, Sparkles, Filter, RefreshCw, AlertTriangle, ArrowRight, ShieldCheck, X, Plus } from 'lucide-react';

export default function CreditCardsClient() {
  const t = useTranslations('CreditCards');
  const locale = useLocale();
  const isTh = locale === 'th';
  const [filter, setFilter] = useState('all');
  const [minIncome, setMinIncome] = useState(0);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return CREDIT_CARDS.filter(c => {
      const typeMatch = filter === 'all' || c.type === filter;
      const incomeMatch = minIncome === 0 || c.minIncome <= minIncome;
      return typeMatch && incomeMatch;
    });
  }, [filter, minIncome]);

  const toggleCompare = (id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length < 3) return [...prev, id];
      return prev;
    });
  };

  const compareCards = useMemo(() => 
    CREDIT_CARDS.filter(c => compareIds.includes(c.id)),
  [compareIds]);

  return (
    <div className="min-h-screen bg-[#fcfdfd] pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-50/50 rounded-full blur-[120px] -z-10 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-50/30 rounded-full blur-[100px] -z-10 translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <BackButton href="/calculators" />
        </div>
        
        <header className="mb-16 text-center max-w-3xl mx-auto">
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-teal-100 text-teal-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm"
          >
            <Sparkles size={14} /> {t('premium_badge')}
          </m.div>
          <m.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-slate-800 mb-8 tracking-tight leading-tight"
          >
            {t('page_title')}<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600"> {t('title_accent')}</span>
          </m.h1>
          <m.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed"
          >
            {t('subtitle')}
          </m.p>
        </header>

        {/* Filters Panel - Refined Zen Look */}
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-between mb-16 bg-white/60 backdrop-blur-2xl p-6 rounded-[32px] border border-white/80 shadow-[0_8px_40px_rgba(0,0,0,0.02)] sticky top-24 z-50">
          <div className="flex flex-wrap gap-2 justify-center">
            {CARD_TYPES.map(cardType => (
              <button 
                key={cardType.id} 
                className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-500 ${
                  filter === cardType.id 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10 scale-105' 
                    : 'bg-white/50 text-slate-400 hover:text-slate-800 hover:bg-white'
                }`} 
                onClick={() => setFilter(cardType.id)}
              >
                {isTh ? cardType.name : cardType.name_en}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 shrink-0 bg-slate-50/50 p-1.5 rounded-2xl border border-slate-100/50">
            <div className="flex items-center gap-2 pl-3">
              <Filter size={12} className="text-teal-500" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('min_income')}</span>
            </div>
            <select 
              className="pl-2 pr-8 py-2 rounded-xl bg-white border-none font-black text-[11px] text-slate-700 outline-none shadow-sm focus:ring-2 focus:ring-teal-500/10 transition-all appearance-none cursor-pointer uppercase tracking-widest" 
              value={minIncome} 
              onChange={e => setMinIncome(+e.target.value)}
            >
              <option value={0}>{t('filter_all')}</option>
              <option value={15000}>15,000+</option>
              <option value={30000}>30,000+</option>
              <option value={50000}>50,000+</option>
              <option value={100000}>100,000+</option>
            </select>
          </div>
        </div>

        {/* Floating Compare Bar */}
        <AnimatePresence>
          {compareIds.length > 0 && (
            <m.div 
              className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-6"
              initial={{ y: 50, opacity: 0, filter: 'blur(10px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: 50, opacity: 0, filter: 'blur(10px)' }}
            >
              <div className="bg-slate-950/90 text-white p-4 rounded-[28px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.4)] flex items-center justify-between gap-4 border border-white/10 backdrop-blur-3xl">
                <div className="flex items-center gap-3 ml-2">
                  <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center font-black text-xs text-slate-950">
                    {compareIds.length}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                    {t('selected_count', { count: compareIds.length })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    className="px-6 py-3 bg-white text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-teal-400 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                    disabled={compareIds.length < 2}
                    onClick={() => {
                      document.getElementById('compare-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {t('compare_now_btn')}
                  </button>
                  <button 
                    className="p-3 text-slate-500 hover:text-white transition-colors" 
                    onClick={() => setCompareIds([])}
                    title={t('clear_btn')}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>

        {/* Card Grid - Optimized for performance and looks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {filtered.map((card, i) => (
            <m.div 
              key={card.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.3), duration: 0.4 }}
              className={`group flex flex-col bg-white rounded-[40px] border transition-all duration-500 overflow-hidden relative ${
                compareIds.includes(card.id) 
                  ? 'border-teal-500 ring-4 ring-teal-500/10 shadow-2xl' 
                  : 'border-slate-100 hover:border-teal-200/50 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.04)] hover:-translate-y-1.5'
              }`}
            >
                {/* Visual Card Header - Premium Glass Look */}
                <div className="p-8 h-40 flex flex-col justify-end relative overflow-hidden" style={{background: card.gradient}}>
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-6 transition-transform duration-1000"><CreditCard size={100} /></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-3">
                       <div className="px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-[9px] font-black text-white uppercase tracking-widest">
                          {card.type}
                       </div>
                    </div>
                    <h3 className="text-white text-xl font-black tracking-tight leading-tight">{isTh ? card.name : card.name_en}</h3>
                    <div className="text-white/60 text-[9px] font-black uppercase tracking-[0.2em] mt-1">{isTh ? card.bank : card.bank_en}</div>
                  </div>
                </div>
                
                {/* Card Content */}
                <div className="p-8 flex-1 flex flex-col bg-white relative z-10">
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('annual_fee')}</div>
                      <div className="text-xs font-black text-slate-800">
                        {card.annualFee === 0 ? (
                          <span className="text-emerald-600 flex items-center gap-1"><Check size={12} strokeWidth={4} /> {isTh ? 'ฟรี' : 'Free'}</span>
                        ) : `${formatNumber(card.annualFee)} ฿`}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('min_income')}</div>
                      <div className="text-xs font-black text-slate-800">{formatNumber(card.minIncome)} <span className="text-[9px] opacity-40">฿</span></div>
                    </div>
                  </div>
                  
                  <div className="space-y-6 mb-8 flex-1">
                    <ul className="space-y-3">
                      {(isTh ? card.pros : card.pros_en).map((p, i) => (
                        <li key={i} className="text-[12px] text-slate-500 font-bold leading-relaxed flex gap-3">
                          <span className="w-1 h-1 rounded-full bg-teal-500/40 mt-1.5 shrink-0" /> {p}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* KTC Compliance Text - Closer to Action */}
                  {card.bank === 'เคทีซี' && (
                    <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-800 leading-tight text-center italic">
                        {isTh 
                          ? '“กู้เท่าที่จำเป็นและชำระคืนได้เต็มจำนวนตามกำหนด จะได้ไม่เสียดอกเบี้ย 16% ต่อปี”'
                          : '“Borrow only as much as you need and can afford to repay in full to avoid 16% p.a. interest.”'}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 mt-auto">
                      <button
                        className={`flex-1 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
                          compareIds.includes(card.id) 
                            ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' 
                            : 'bg-white text-slate-500 border border-slate-100 hover:border-teal-200 hover:text-teal-600'
                        }`}
                        onClick={() => toggleCompare(card.id)}
                      >
                        {compareIds.includes(card.id) ? <Check size={14} strokeWidth={3} /> : <Plus size={14} />}
                        {t('compare')}
                      </button>
                      <a 
                        href={card.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest text-center hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2 group/btn"
                      >
                        {t('apply_now')} <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                      </a>
                    </div>
                </div>
            </m.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <m.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32 bg-white rounded-[60px] border border-slate-100 shadow-sm mb-24"
          >
            <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-5xl shadow-inner border border-slate-100">🔍</div>
            <h3 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">{t('no_match_title')}</h3>
            <p className="text-slate-500 font-medium mb-12 max-w-sm mx-auto">{t('no_match_desc')}</p>
            <button className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-slate-900/10 flex items-center gap-3 mx-auto" onClick={() => { setFilter('all'); setMinIncome(0); }}>
              <RefreshCw size={20} />
              {t('reset_filters')}
            </button>
          </m.div>
        )}

        {/* Compare Section - Premium Dashboard Look */}
        <AnimatePresence>
          {compareCards.length >= 2 && (
            <m.div 
              id="compare-section" 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[60px] p-10 md:p-16 border border-slate-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] mb-24 relative overflow-hidden"
            >
              {/* Subtle grid background */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '40px 40px' }} />
              
              <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 rounded-lg text-teal-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-teal-100/50">
                    {t('side_by_side_label')}
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">{t('total_cards', { count: compareCards.length })} <span className="text-teal-500">{t('overview_label')}</span></h3>
                  <p className="text-slate-400 font-bold uppercase text-[11px] tracking-[0.2em] mt-3">{t('deep_dive_label')}</p>
                </div>
                <div className="flex gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                    <ShieldCheck className="text-emerald-500" size={24} />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">{t('verified_label')}</span>
                  </div>
                </div>
              </header>
              
              <div className="overflow-x-auto -mx-10 px-10 relative z-10 pb-8">
                <table className="w-full text-left border-separate border-spacing-x-4 min-w-[800px]">
                  <thead>
                    <tr>
                      <th className="py-6 px-6 bg-slate-50/50 rounded-3xl border border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('features_label')}</th>
                      {compareCards.map(c => (
                        <th key={c.id} className="py-6 px-8 bg-white rounded-3xl border border-slate-100 text-xl font-black text-slate-800 shadow-sm min-w-[240px] relative overflow-hidden group">
                           <div className="absolute top-0 left-0 w-full h-1" style={{background: c.gradient}} />
                           {isTh ? c.name : c.name_en}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-sm font-bold text-slate-600">
                    <tr>
                      <td className="py-8 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('bank')}</td>
                      {compareCards.map(c => <td key={c.id} className="py-8 px-8 text-teal-600 font-black text-lg">{isTh ? c.bank : c.bank_en}</td>)}
                    </tr>
                    <tr>
                      <td className="py-8 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-50">{t('min_income')}</td>
                      {compareCards.map(c => <td key={c.id} className="py-8 px-8 border-t border-slate-50 font-black text-xl text-slate-800">{formatNumber(c.minIncome)} <span className="text-xs text-slate-300">฿</span></td>)}
                    </tr>
                    <tr>
                      <td className="py-8 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-50">{t('annual_fee')}</td>
                      {compareCards.map(c => <td key={c.id} className="py-8 px-8 border-t border-slate-50">
                        {c.annualFee === 0 ? (
                          <span className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100 inline-block">{isTh ? 'ฟรีตลอดชีพ' : 'Free for life'}</span>
                        ) : `${formatNumber(c.annualFee)} ฿`}
                      </td>)}
                    </tr>
                    
                    {/* Benefits Row */}
                    <tr>
                      <td className="py-10 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest align-top border-t border-slate-50">{t('key_benefits_label')}</td>
                      {compareCards.map(c => (
                        <td key={c.id} className="py-10 px-8 align-top border-t border-slate-50">
                          <ul className="space-y-4">
                            {(isTh ? c.benefits : c.benefits_en).map((b, i) => (
                              <li key={i} className="text-[13px] text-slate-600 leading-relaxed font-semibold flex gap-3">
                                <Check size={14} className="text-teal-500 mt-1 shrink-0" /> {b}
                              </li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>

                    <tr className="bg-slate-50/30">
                      <td className="py-10 px-6 text-[10px] font-black text-emerald-600 uppercase tracking-widest align-top border-t border-emerald-100">{t('pros_label')}</td>
                      {compareCards.map(c => (
                        <td key={c.id} className="py-10 px-8 align-top border-t border-emerald-100 bg-emerald-50/20">
                          <ul className="space-y-4">
                            {(isTh ? c.pros : c.pros_en).map((p, i) => <li key={i} className="text-[13px] text-emerald-800 leading-relaxed font-bold flex gap-3">✓ {p}</li>)}
                          </ul>
                        </td>
                      ))}
                    </tr>

                    <tr className="bg-slate-50/30">
                      <td className="py-10 px-6 text-[10px] font-black text-rose-500 uppercase tracking-widest align-top border-t border-rose-100">{t('cons_label')}</td>
                      {compareCards.map(c => (
                        <td key={c.id} className="py-10 px-8 align-top border-t border-rose-100 bg-rose-50/20">
                          <ul className="space-y-4">
                            {(isTh ? c.cons : c.cons_en).map((p, i) => <li key={i} className="text-[13px] text-rose-800 leading-relaxed font-bold flex gap-3">✕ {p}</li>)}
                          </ul>
                        </td>
                      ))}
                    </tr>

                    <tr className="bg-amber-50/40">
                      <td className="py-10 px-6 text-[10px] font-black text-amber-600 uppercase tracking-widest align-top border-t border-amber-100">{t('warning_label')}</td>
                      {compareCards.map(c => <td key={c.id} className="py-10 px-8 text-[13px] text-amber-900 font-bold leading-relaxed border-t border-amber-100 italic">{isTh ? c.warning : c.warning_en}</td>)}
                    </tr>

                    <tr>
                      <td className="py-12 px-6"></td>
                      {compareCards.map(c => (
                        <td key={c.id} className="py-12 px-8 text-center">
                          <a 
                            href={c.officialUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 text-white rounded-[22px] font-black text-[12px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-900/10 group/btn"
                          >
                            {t('apply_now')} <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                          </a>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </m.div>
          )}
        </AnimatePresence>

        {/* Warnings & Guides */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 relative z-10">
          <m.div 
            whileHover={{ y: -5 }}
            className="p-10 rounded-[48px] bg-red-50 border border-red-100 shadow-xl shadow-red-500/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><AlertTriangle size={80} className="text-red-600" /></div>
            <h4 className="text-2xl font-black text-red-800 mb-6 flex items-center gap-3">
              <AlertTriangle size={24} strokeWidth={3} /> {t('debt_warning_title')}
            </h4>
            <p className="text-base text-red-700 leading-relaxed font-bold">{t('debt_warning_text')}</p>
          </m.div>
          
          <m.div 
            whileHover={{ y: -5 }}
            className="p-10 rounded-[48px] bg-white border border-slate-100 shadow-xl shadow-slate-500/5"
          >
            <h4 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
              <Sparkles size={24} className="text-teal-500" /> {t('how_to_choose_title')}
            </h4>
            <ul className="space-y-6">
              {[1, 2, 3].map(i => (
                <li key={i} className="text-base text-slate-600 font-bold flex gap-4 items-start">
                  <span className="w-8 h-8 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-[12px] font-black shrink-0 mt-1 shadow-sm border border-teal-100/50">{i}</span>
                  <span className="pt-1">{t(`how_to_choose_${i}`)}</span>
                </li>
              ))}
            </ul>
          </m.div>
        </div>

        {/* Final KTC Compliance Area */}
        <m.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="p-10 rounded-[48px] bg-slate-900 text-white relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center backdrop-blur-xl shrink-0 border border-white/20">
               <ShieldCheck size={40} className="text-teal-400" />
            </div>
            <div className="flex-1">
              <p className="mb-4 uppercase font-black tracking-[0.3em] text-teal-400 text-xs">KTC Disclosure & Compliance:</p>
              <div className="text-[13px] font-bold text-slate-300 leading-relaxed space-y-4">
                {isTh ? (
                  <>
                    <p className="text-white text-base font-black">“กู้เท่าที่จำเป็นและชำระคืนได้เต็มจำนวนตามกำหนด จะได้ไม่เสียดอกเบี้ย 16% ต่อปี”</p>
                    <p className="opacity-60 font-medium">* ข้อมูลบัตรเครดิตที่แสดงบนหน้านี้เป็นการรวบรวมเพื่อความสะดวกในการเปรียบเทียบเท่านั้น เงื่อนไขและสิทธิประโยชน์อาจเปลี่ยนแปลงตามประกาศของธนาคาร/สถาบันการเงิน โปรดตรวจสอบรายละเอียดล่าสุดที่เว็บไซต์ทางการของผู้ออกบัตรก่อนการสมัคร</p>
                  </>
                ) : (
                  <>
                    <p className="text-white text-base font-black">“Borrow only as much as you need and can afford to repay in full to avoid 16% p.a. interest.”</p>
                    <p className="opacity-60 font-medium">* Credit card information shown on this page is for comparison purposes only. Terms and benefits are subject to change by the issuer. Please verify the latest details on the official issuer website before applying.</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </m.div>

        {/* Floating Decorative Orbs for that Premium Feel */}
        <div className="fixed top-[20%] -left-64 w-[600px] h-[600px] bg-indigo-50/20 rounded-full blur-[120px] -z-20 pointer-events-none" />
        <div className="fixed bottom-[10%] -right-64 w-[500px] h-[500px] bg-teal-50/20 rounded-full blur-[120px] -z-20 pointer-events-none" />
      </div>
    </div>
  );
}
