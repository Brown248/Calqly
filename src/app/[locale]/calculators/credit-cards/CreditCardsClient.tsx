'use client';
import { useState, useMemo } from 'react';
import { CREDIT_CARDS, CARD_TYPES } from '@/data/creditCards';
import { formatNumber } from '@/utils/formatters';
import { useTranslations, useLocale } from 'next-intl';
import { m, AnimatePresence } from 'framer-motion';
import BackButton from '@/components/layout/BackButton';
import { CreditCard, Check, Sparkles, Filter, RefreshCw, AlertTriangle } from 'lucide-react';

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
    <div className="min-h-screen bg-[#fcfdfd] pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <BackButton href="/calculators" />
        </div>
        
        <header className="mb-12 text-center">
          <m.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-800 mb-6 tracking-tight"
          >
            💳 {t('title')}
          </m.h1>
          <m.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg max-w-2xl mx-auto"
          >
            {t('subtitle')}
          </m.p>
        </header>



        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-12 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="flex flex-wrap gap-2 justify-center">
            {CARD_TYPES.map(cardType => (
              <button 
                key={cardType.id} 
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  filter === cardType.id 
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`} 
                onClick={() => setFilter(cardType.id)}
              >
                {isTh ? cardType.name : cardType.name_en}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <label className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Filter size={14} /> {t('min_income')}
            </label>
            <select 
              className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 font-bold text-sm text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/20" 
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
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-6"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
            >
              <div className="bg-slate-800 text-white p-4 rounded-[24px] shadow-2xl flex items-center justify-between gap-4 border border-white/10 backdrop-blur-xl">
                <span className="text-sm font-bold ml-2">
                  {t('selected_count', { count: compareIds.length })}
                </span>
                <div className="flex gap-2">
                  {compareIds.length >= 2 && (
                    <button 
                      className="btn btn-primary btn-sm px-6 py-2.5"
                      onClick={() => {
                        document.getElementById('compare-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {t('compare_now_btn')}
                    </button>
                  )}
                  <button 
                    className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-white transition-colors" 
                    onClick={() => setCompareIds([])}
                  >
                    {t('clear_btn')}
                  </button>
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <AnimatePresence>
            {filtered.map(card => (
              <m.div 
                key={card.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className={`group flex flex-col bg-white rounded-[32px] border transition-all duration-500 overflow-hidden ${
                  compareIds.includes(card.id) 
                    ? 'border-teal-500 ring-4 ring-teal-500/5' 
                    : 'border-slate-100 hover:border-teal-200 hover:shadow-2xl hover:shadow-teal-600/5'
                }`}
              >
                <div className="p-8 h-32 flex flex-col justify-end relative" style={{background: card.gradient}}>
                  <div className="absolute top-6 right-8 text-white/20"><CreditCard size={48} /></div>
                  <div className="relative z-10">
                    <div className="text-white text-xl font-black tracking-tight leading-tight mb-1">{isTh ? card.name : card.name_en}</div>
                    <div className="text-white/80 text-xs font-bold uppercase tracking-widest">{isTh ? card.bank : card.bank_en}</div>
                  </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('annual_fee')}</div>
                      <div className="text-xs font-bold text-slate-700">
                        {card.annualFee === 0 ? t('free_lifetime') : `${formatNumber(card.annualFee)} ${t('thb')}`}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('min_income')}</div>
                      <div className="text-xs font-bold text-slate-700">{formatNumber(card.minIncome)} {t('thb')}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-6 mb-8 flex-1">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                        <Sparkles size={12} /> {t('pros')}
                      </div>
                      <ul className="space-y-2">
                        {(isTh ? card.pros : card.pros_en).map((p, i) => (
                          <li key={i} className="text-xs text-slate-500 leading-relaxed flex gap-2">
                            <span className="text-emerald-500 font-bold">•</span> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex">
                      <button
                        className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                          compareIds.includes(card.id) 
                            ? 'bg-teal-50 text-teal-600 border border-teal-100' 
                            : 'bg-slate-50 text-slate-500 border border-slate-100 hover:bg-slate-100'
                        }`}
                        onClick={() => toggleCompare(card.id)}
                      >
                        {compareIds.includes(card.id) ? <Check size={14} /> : '+'}
                        {t('compare')}
                      </button>
                      <a 
                        href={card.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3 bg-teal-600 text-white rounded-xl font-bold text-xs text-center hover:bg-teal-700 transition-colors"
                      >
                        {t('apply_now')}
                      </a>
                    </div>
                </div>
              </m.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[40px] border border-slate-100 shadow-sm mb-20">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🔍</div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">{t('no_match_title')}</h3>
            <p className="text-slate-500 mb-8">{t('no_match_desc')}</p>
            <button className="btn btn-secondary px-8 py-3.5" onClick={() => { setFilter('all'); setMinIncome(0); }}>
              <RefreshCw size={18} className="mr-2" />
              {t('reset_filters')}
            </button>
          </div>
        )}

        {/* Compare Section */}
        <AnimatePresence>
          {compareCards.length >= 2 && (
            <m.div 
              id="compare-section" 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[40px] p-8 md:p-12 border border-slate-100 shadow-xl mb-20 overflow-hidden"
            >
              <header className="mb-12">
                <h3 className="text-3xl font-black text-slate-800 mb-2">📊 {t('total_cards', { count: compareCards.length })}</h3>
                <p className="text-slate-500 font-medium">{t('deep_dive_label')}</p>
              </header>
              
              <div className="overflow-x-auto -mx-8 px-8">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr>
                      <th className="py-6 px-4 border-b border-slate-100 text-xs font-black text-slate-400 uppercase tracking-widest">{t('features_label')}</th>
                      {compareCards.map(c => (
                        <th key={c.id} className="py-6 px-4 border-b border-slate-100 text-lg font-black text-slate-800">{isTh ? c.name : c.name_en}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-sm font-bold text-slate-600">
                    <tr>
                      <td className="py-6 px-4 border-b border-slate-50 text-slate-400">{t('bank')}</td>
                      {compareCards.map(c => <td key={c.id} className="py-6 px-4 border-b border-slate-50 text-teal-600">{isTh ? c.bank : c.bank_en}</td>)}
                    </tr>
                    <tr>
                      <td className="py-6 px-4 border-b border-slate-50 text-slate-400">{t('min_income')}</td>
                      {compareCards.map(c => <td key={c.id} className="py-6 px-4 border-b border-slate-50 font-black">{formatNumber(c.minIncome)} ฿</td>)}
                    </tr>
                    <tr>
                      <td className="py-6 px-4 border-b border-slate-50 text-slate-400">{t('annual_fee')}</td>
                      {compareCards.map(c => <td key={c.id} className="py-6 px-4 border-b border-slate-50">{c.annualFee === 0 ? (isTh ? 'ฟรีตลอดชีพ' : 'Free for life') : `${formatNumber(c.annualFee)} ฿`}</td>)}
                    </tr>
                    <tr>
                      <td className="py-6 px-4 border-b border-slate-50 text-slate-400">{t('fee_waiver')}</td>
                      {compareCards.map(c => <td key={c.id} className="py-6 px-4 border-b border-slate-50 text-xs">{isTh ? c.feeWaiver : c.feeWaiver_en}</td>)}
                    </tr>
                    <tr>
                      <td className="py-6 px-4 border-b border-slate-50 text-slate-400">{t('cashback_rate')}</td>
                      {compareCards.map(c => <td key={c.id} className="py-6 px-4 border-b border-slate-50">{isTh ? c.cashbackRate : c.cashbackRate_en}</td>)}
                    </tr>
                    <tr>
                      <td className="py-6 px-4 border-b border-slate-50 text-slate-400">{t('points_rate')}</td>
                      {compareCards.map(c => <td key={c.id} className="py-6 px-4 border-b border-slate-50">{isTh ? c.pointsRate : c.pointsRate_en}</td>)}
                    </tr>

                    <tr>
                      <td className="py-6 px-4 border-b border-slate-50 text-slate-400 align-top">{t('key_benefits_label')}</td>
                      {compareCards.map(c => (
                        <td key={c.id} className="py-6 px-4 border-b border-slate-50 align-top">
                          <ul className="space-y-3">
                            {(isTh ? c.benefits : c.benefits_en).map((b, i) => <li key={i} className="text-xs text-slate-600 leading-relaxed max-w-[250px]">• {b}</li>)}
                          </ul>
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="py-6 px-4 border-b border-emerald-50 text-emerald-600 align-top">{t('pros_label')}</td>
                      {compareCards.map(c => (
                        <td key={c.id} className="py-6 px-4 border-b border-emerald-50 align-top bg-emerald-50/30">
                          <ul className="space-y-3">
                            {(isTh ? c.pros : c.pros_en).map((p, i) => <li key={i} className="text-xs text-emerald-800 leading-relaxed max-w-[250px]">✓ {p}</li>)}
                          </ul>
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="py-6 px-4 border-b border-rose-50 text-rose-600 align-top">{t('cons_label')}</td>
                      {compareCards.map(c => (
                        <td key={c.id} className="py-6 px-4 border-b border-rose-50 align-top bg-rose-50/30">
                          <ul className="space-y-3">
                            {(isTh ? c.cons : c.cons_en).map((p, i) => <li key={i} className="text-xs text-rose-800 leading-relaxed max-w-[250px]">✕ {p}</li>)}
                          </ul>
                        </td>
                      ))}
                    </tr>

                    <tr className="bg-amber-50/50">
                      <td className="py-6 px-4 font-black text-amber-600 align-top">{t('warning_label')}</td>
                      {compareCards.map(c => <td key={c.id} className="py-6 px-4 text-xs text-amber-800 font-bold leading-relaxed max-w-[250px] align-top">{isTh ? c.warning : c.warning_en}</td>)}
                    </tr>

                    <tr>
                      <td className="py-8 px-4"></td>
                      {compareCards.map(c => (
                        <td key={c.id} className="py-8 px-4 text-center">
                          <a 
                            href={c.officialUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn btn-primary w-full text-xs py-3"
                          >
                            {t('apply_now')}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-8 rounded-[32px] bg-red-50 border border-red-100">
            <h4 className="text-lg font-black text-red-800 mb-4 flex items-center gap-2">
              <AlertTriangle size={20} /> {t('debt_warning_title')}
            </h4>
            <p className="text-sm text-red-700 leading-relaxed font-medium">{t('debt_warning_text')}</p>
          </div>
          <div className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm">
            <h4 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
              <Sparkles size={20} className="text-teal-500" /> {t('how_to_choose_title')}
            </h4>
            <ul className="space-y-4">
              {[1, 2, 3].map(i => (
                <li key={i} className="text-sm text-slate-500 font-medium flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center text-[10px] font-black shrink-0">{i}</span>
                  {t(`how_to_choose_${i}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>



        <div className="mt-12 p-6 rounded-[32px] bg-slate-50 border border-slate-100 text-[10px] font-medium text-slate-400 leading-relaxed">
          <p className="mb-2 uppercase font-black tracking-widest text-slate-500">KTC Disclosure & Disclaimer:</p>
          {isTh ? (
            <>
              * กู้เท่าที่จำเป็นและชำระคืนได้เต็มจำนวนตามกำหนด จะได้ไม่เสียดอกเบี้ย 16% ต่อปี<br/>
              * ข้อมูลบัตรเครดิตที่แสดงบนหน้านี้เป็นการรวบรวมเพื่อความสะดวกในการเปรียบเทียบเท่านั้น เงื่อนไขและสิทธิประโยชน์อาจเปลี่ยนแปลงตามประกาศของธนาคาร/สถาบันการเงิน โปรดตรวจสอบรายละเอียดล่าสุดที่เว็บไซต์ทางการของผู้ออกบัตรก่อนการสมัคร
            </>
          ) : (
            <>
              * Borrow only as much as you need and can afford to repay in full to avoid 16% p.a. interest.<br/>
              * Credit card information shown on this page is for comparison purposes only. Terms and benefits are subject to change by the issuer. Please verify the latest details on the official issuer website before applying.
            </>
          )}
        </div>
      </div>
    </div>
  );
}
