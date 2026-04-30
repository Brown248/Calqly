'use client';

import React, { useState, useMemo } from 'react';
import { useFinancialStore } from '@/hooks/useFinancialStore';
import { analyzeFinancialHealth } from '@/utils/financialIntelligence';
import { useTranslations } from 'next-intl';
import { m, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ShieldCheck, Zap, AlertCircle, BrainCircuit } from 'lucide-react';

export default function AIAdvisor() {
  const [isOpen, setIsOpen] = useState(false);
  const { projects } = useFinancialStore();
  
  const t = useTranslations('AIAdvisor');
  const tIntel = useTranslations('FinancialIntelligence');
  const insights = useMemo(() => analyzeFinancialHealth(projects, tIntel), [projects, tIntel]);

  return (
    <>
      {/* Floating Action Button */}
      <m.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        aria-label={t('badge')}
        className="fixed bottom-8 right-8 z-[90] w-16 h-16 bg-gradient-to-br from-teal-600 to-emerald-500 text-white rounded-full shadow-2xl shadow-teal-600/40 flex items-center justify-center border-4 border-white/20 backdrop-blur-md"
      >
        <Sparkles size={28} className="animate-pulse" />
      </m.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
            <m.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <m.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-[#fcfdfd] rounded-[48px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="p-8 md:p-12 border-b border-slate-100 bg-white relative">
                 <div className="absolute top-0 right-0 p-8">
                    <button onClick={() => setIsOpen(false)} aria-label="Close" className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-slate-800 transition-colors">
                      <X size={20} />
                    </button>
                 </div>
                 
                 <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 text-teal-600 rounded-full text-[11px] font-black uppercase tracking-widest mb-6">
                    <BrainCircuit size={14} /> {t('badge')}
                 </div>
                 <h2 className="text-3xl font-black text-slate-800 tracking-tight">{t('title')}</h2>
                 <p className="text-sm font-bold text-slate-400 mt-2">{t('subtitle', { count: projects.length })}</p>
              </div>

              {/* Insights List */}
              <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-6">
                 {insights.length === 0 ? (
                    <div className="text-center py-20">
                      <Zap size={48} className="mx-auto text-slate-100 mb-4" />
                      <p className="text-slate-400 font-bold">{t('waiting')}</p>
                   </div>
                 ) : (
                   insights.map((insight, i) => (
                     <m.div 
                       key={i} 
                       initial={{ opacity: 0, x: -20 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: i * 0.1 }}
                       className={`p-8 rounded-[32px] border relative overflow-hidden group transition-all hover:shadow-lg ${
                         insight.type === 'warning' ? 'bg-orange-50/50 border-orange-100' :
                         insight.type === 'opportunity' ? 'bg-teal-50/50 border-teal-100' :
                         'bg-white border-slate-100'
                       }`}
                     >
                        <div className="flex items-start gap-5 relative z-10">
                           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                             insight.type === 'warning' ? 'bg-orange-100 text-orange-600' :
                             insight.type === 'opportunity' ? 'bg-teal-100 text-teal-600' :
                             'bg-slate-100 text-slate-400'
                           }`}>
                              {insight.type === 'warning' ? <AlertCircle size={24} /> : <Zap size={24} />}
                           </div>
                           
                           <div>
                              <h4 className="text-lg font-black text-slate-800 mb-2">{insight.title}</h4>
                              <p className="text-sm font-bold text-slate-500 leading-relaxed">{insight.message}</p>
                              
                              {insight.impact && (
                                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-100 rounded-lg text-[11px] font-black uppercase text-teal-600">
                                   <ShieldCheck size={12} /> {insight.impact}
                                </div>
                              )}
                           </div>
                        </div>
                     </m.div>
                   ))
                 )}
              </div>

              {/* Footer Badge */}
              <div className="p-8 bg-slate-50 border-t border-slate-100 text-center">
                 <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                   <ShieldCheck size={12} className="text-teal-500" /> {t('privacy')}
                 </p>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
