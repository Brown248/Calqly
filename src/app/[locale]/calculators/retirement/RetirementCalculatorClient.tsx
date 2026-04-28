'use client';

import { useEffect, useState, useMemo } from 'react';
import { Link } from '@/i18n/routing';
import { calculateRetirement, defaultRetirementInput, RetirementInput } from '@/utils/retirementCalc';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { useTranslations, useLocale } from 'next-intl';

import { NumericFormat } from 'react-number-format';
import dynamic from 'next/dynamic';
import { AnimatePresence, m } from 'framer-motion';

const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => mod.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const ReferenceLine = dynamic(() => import('recharts').then(mod => mod.ReferenceLine), { ssr: false });

import AnimatedCounter from '@/components/AnimatedCounter';
import ShareButton from '@/components/ShareButton';
import ExportReport from '@/components/ExportReport';
import BackButton from '@/components/layout/BackButton';
import { 
  Info, 
  TrendingUp, 
  AlertTriangle, 
  HeartPulse, 
  Clock, 
  Palmtree, 
  Coins, 
  Settings,
  Target,
  Umbrella,
  Zap,
  Activity,
  ArrowRight,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

import RelatedArticlesSidebar from '@/components/calculators/RelatedArticlesSidebar';

import SavedProjectsManager from '@/components/SavedProjectsManager';
import { readSharedStateFromUrl } from '@/utils/shareState';

export default function RetirementCalculatorClient() {
  const t = useTranslations('RetirementCalculator');
  const locale = useLocale();
  const isTh = locale === 'th';

  const [input, setInput] = useState<RetirementInput>(defaultRetirementInput);
  const [activeStep, setActiveStep] = useState(1);

  const result = useMemo(() => calculateRetirement(input), [input]);

  useEffect(() => {
    const sharedInput = readSharedStateFromUrl<Partial<RetirementInput>>();
    if (sharedInput) {
      const frame = requestAnimationFrame(() => {
        setInput((current) => ({ ...current, ...sharedInput }));
      });
      return () => cancelAnimationFrame(frame);
    }
  }, []);

  const updateInput = <K extends keyof RetirementInput>(key: K, value: RetirementInput[K]) => {
    setInput(p => ({ ...p, [key]: value }));
  };

  const scrollToResult = () => {
    document.getElementById('result-panel')?.scrollIntoView({ behavior: 'smooth' });
  };

  const STEPS = [
    { id: 1, label: t('step_now'), icon: <Clock size={16} /> },
    { id: 2, label: t('step_dream'), icon: <Palmtree size={16} /> },
    { id: 3, label: t('step_reality'), icon: <Umbrella size={16} /> },
    { id: 4, label: t('step_engine'), icon: <Zap size={16} /> },
  ];

  return (
    <div className="bg-[#f8fafb] min-h-screen pb-20 pt-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8 flex justify-between items-center">
          <BackButton href="/calculators" />
          <SavedProjectsManager 
               type="retirement"
               currentInput={input as unknown as Record<string, unknown>}
               currentResult={result as unknown as Record<string, unknown>}
               onLoad={(p) => setInput(p.input as unknown as RetirementInput)}
          />
        </div>
        
        <header className="mb-12 text-center">
          <m.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-5 py-2 bg-white shadow-sm border border-slate-100 rounded-full text-[11px] font-black uppercase tracking-[0.2em] text-amber-600 mb-6">
            <Target size={14} className="text-amber-500" /> {t('header_badge')}
          </m.div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4 uppercase leading-none">
            {t('header_title_1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">{t('header_title_2')}</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
        </header>

        <section className="mb-16">
          <div className="bg-white rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
            <div className="flex p-3 bg-slate-50/50 gap-2 overflow-x-auto no-scrollbar">
              {STEPS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveStep(s.id)}
                  className={`flex-1 min-w-[150px] flex items-center justify-center gap-3 py-4 rounded-[32px] text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                    activeStep === s.id 
                    ? 'bg-white text-amber-600 shadow-xl shadow-slate-200/50 scale-[1.02]' 
                    : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${activeStep === s.id ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                    {s.icon}
                  </span>
                  {s.label}
                </button>
              ))}
            </div>

            <div className="p-8 md:p-14 min-h-[400px]">
              <AnimatePresence mode="wait">
                {activeStep === 1 && (
                  <m.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('current_age')}</label>
                      <NumericFormat value={input.currentAge} onValueChange={(v) => updateInput('currentAge', v.floatValue || 0)} className="w-full bg-slate-50 border border-slate-100 rounded-[20px] px-6 py-4 font-black text-slate-800 outline-none focus:ring-4 focus:ring-amber-500/10 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 text-teal-600">{t('retire_age')}</label>
                      <NumericFormat value={input.retirementAge} onValueChange={(v) => updateInput('retirementAge', v.floatValue || 0)} className="w-full bg-teal-50/30 border border-teal-100 rounded-[20px] px-6 py-4 font-black text-teal-700 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex justify-between">
                        {t('life_expectancy')}
                        <div className="group relative cursor-pointer">
                          <Info size={14} className="text-slate-300" />
                          <div className="absolute bottom-full mb-2 right-0 w-48 p-3 bg-slate-900 text-white text-[11px] font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">{t('life_expectancy_tip')}</div>
                        </div>
                      </label>
                      <NumericFormat value={input.lifeExpectancy ?? 90} onValueChange={(v) => updateInput('lifeExpectancy', v.floatValue || 0)} className="w-full bg-slate-50 border border-slate-100 rounded-[20px] px-6 py-4 font-black text-slate-800 outline-none focus:ring-4 focus:ring-amber-500/10 transition-all" />
                    </div>
                    <div className="lg:col-span-2 space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('starting_savings')}</label>
                      <div className="relative">
                        <NumericFormat 
                          value={input.startingSavings ?? 0} 
                          onValueChange={(v) => updateInput('startingSavings', v.floatValue || 0)} 
                          onFocus={(e) => e.target.select()}
                          thousandSeparator="," 
                          className="w-full bg-slate-50 border border-slate-100 rounded-[24px] px-8 py-5 text-2xl font-black text-slate-800 outline-none focus:ring-8 focus:ring-amber-500/5 focus:bg-white transition-all" 
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black text-xl">฿</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-teal-600 uppercase tracking-widest ml-1">{t('current_monthly_saving')}</label>
                      <div className="relative">
                        <NumericFormat 
                          value={input.currentMonthlySaving ?? 0} 
                          onValueChange={(v) => updateInput('currentMonthlySaving', v.floatValue || 0)} 
                          onFocus={(e) => e.target.select()}
                          thousandSeparator="," 
                          className="w-full bg-teal-50/30 border border-teal-100 rounded-[24px] px-8 py-5 text-2xl font-black text-teal-700 outline-none focus:ring-8 focus:ring-teal-500/5 focus:bg-white transition-all" 
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-teal-200 font-black text-xl">฿</span>
                      </div>
                    </div>
                  </m.div>
                )}

                {activeStep === 2 && (
                  <m.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="space-y-4">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('monthly_spend')}</label>
                        <div className="relative">
                          <NumericFormat 
                            value={input.monthlyExpensesToday ?? 0} 
                            onValueChange={(v) => updateInput('monthlyExpensesToday', v.floatValue || 0)} 
                            onFocus={(e) => e.target.select()}
                            thousandSeparator="," 
                            className="w-full bg-slate-50 border border-slate-100 rounded-[32px] px-10 py-8 text-4xl font-black text-amber-600 outline-none focus:ring-8 focus:ring-amber-500/5 transition-all" 
                          />
                          <span className="absolute right-8 top-1/2 -translate-y-1/2 text-amber-200 font-black text-2xl">฿</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { val: 15000, label: t('preset_modest') },
                            { val: 30000, label: t('preset_comfortable') },
                            { val: 50000, label: t('preset_luxury') },
                          ].map(item => (
                            <button key={item.val} onClick={() => updateInput('monthlyExpensesToday', item.val)} className={`py-3 rounded-[18px] text-[11px] font-black uppercase transition-all border ${input.monthlyExpensesToday === item.val ? 'bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-600/20 scale-105' : 'bg-white border-slate-100 text-slate-400 hover:border-amber-200 hover:text-amber-600'}`}>{item.label}</button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex justify-between">{t('dream_fund')} <Info size={14} className="text-slate-300" /></label>
                          <NumericFormat 
                            value={input.dreamFund ?? 0} 
                            onValueChange={(v) => updateInput('dreamFund', v.floatValue || 0)} 
                            onFocus={(e) => e.target.select()}
                            thousandSeparator="," 
                            className="w-full bg-slate-50 border border-slate-100 rounded-[20px] px-6 py-4 font-black text-slate-800 outline-none focus:ring-4 focus:ring-amber-500/10 transition-all" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex justify-between">{t('passive_income')} <Info size={14} className="text-slate-300" /></label>
                          <NumericFormat 
                            value={input.passiveIncomeRetire ?? 0} 
                            onValueChange={(v) => updateInput('passiveIncomeRetire', v.floatValue || 0)} 
                            onFocus={(e) => e.target.select()}
                            thousandSeparator="," 
                            className="w-full bg-slate-50 border border-slate-100 rounded-[20px] px-6 py-4 font-black text-slate-800 outline-none focus:ring-4 focus:ring-amber-500/10 transition-all" 
                          />
                        </div>
                      </div>
                    </div>
                  </m.div>
                )}

                {activeStep === 3 && (
                  <m.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 hover:border-teal-200 transition-all">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-white text-emerald-500 shadow-sm flex items-center justify-center border border-slate-100"><HeartPulse size={24} /></div>
                        <div>
                           <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{t('health_insurance')}</h4>
                           <p className="text-[11px] text-slate-400 font-bold uppercase">{t('health_insurance_status')}</p>
                        </div>
                      </div>
                      <div className="flex bg-slate-200/50 p-1.5 rounded-[24px] gap-1.5 mb-8">
                        <button onClick={() => updateInput('hasHealthInsurance', true)} className={`flex-1 py-3.5 rounded-[18px] text-[11px] font-black uppercase transition-all ${input.hasHealthInsurance ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{t('btn_yes')}</button>
                        <button onClick={() => updateInput('hasHealthInsurance', false)} className={`flex-1 py-3.5 rounded-[18px] text-[11px] font-black uppercase transition-all ${!input.hasHealthInsurance ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{t('btn_no')}</button>
                      </div>
                      <AnimatePresence>
                        {!input.hasHealthInsurance && (
                          <m.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="space-y-4">
                            <div className="space-y-2">
                               <label className="text-[11px] font-black text-rose-600 uppercase tracking-widest ml-1">{t('health_buffer')}</label>
                               <NumericFormat 
                                 value={input.healthBufferAmount ?? 0} 
                                 onValueChange={(v) => updateInput('healthBufferAmount', v.floatValue || 0)} 
                                 onFocus={(e) => e.target.select()}
                                 thousandSeparator="," 
                                 className="w-full bg-white border border-rose-100 rounded-[20px] px-6 py-4 font-black text-rose-700 outline-none focus:ring-8 focus:ring-rose-500/5 transition-all" 
                               />
                            </div>
                            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex gap-3">
                               <AlertTriangle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                               <p className="text-[11px] text-rose-800 font-bold leading-relaxed">{t('health_buffer_tip')}</p>
                            </div>
                          </m.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="p-8 bg-orange-50/50 rounded-[40px] border border-orange-100">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-white text-orange-500 shadow-sm flex items-center justify-center border border-orange-100"><TrendingUp size={24} /></div>
                        <div>
                           <h4 className="text-sm font-black text-orange-800 uppercase tracking-tight">{t('inflation_rate')}</h4>
                           <p className="text-[11px] text-orange-400 font-bold uppercase">{t('inflation_prediction')}</p>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="relative">
                          <NumericFormat 
                            value={input.inflationRate ?? 3} 
                            onValueChange={(v) => updateInput('inflationRate', v.floatValue || 0)} 
                            onFocus={(e) => e.target.select()}
                            className="w-full bg-white border border-orange-100 rounded-[24px] px-8 py-5 text-3xl font-black text-orange-600 outline-none focus:ring-8 focus:ring-orange-500/5 transition-all" 
                          />
                          <span className="absolute right-8 top-1/2 -translate-y-1/2 text-orange-200 font-black text-2xl">%</span>
                        </div>
                        <div className="p-5 bg-white/80 rounded-[24px] border border-orange-100/50 flex gap-4">
                          <Zap size={20} className="text-orange-500 shrink-0 mt-1" />
                          <p className="text-[11px] text-orange-900 font-bold leading-relaxed">{t('inflation_tip')}</p>
                        </div>
                      </div>
                    </div>
                  </m.div>
                )}

                {activeStep === 4 && (
                  <m.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 space-y-6">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-teal-500 text-white flex items-center justify-center shadow-lg"><TrendingUp size={20} /></div>
                         <h4 className="text-sm font-black text-slate-800 uppercase">{t('return_pre')}</h4>
                      </div>
                      <NumericFormat value={input.returnPreRetire ?? 7} onValueChange={(v) => updateInput('returnPreRetire', v.floatValue || 0)} className="w-full bg-white border border-slate-100 rounded-[24px] px-8 py-5 text-3xl font-black text-teal-600 outline-none transition-all" />
                      <div className="flex gap-2">
                        {[5, 7, 10].map(r => (
                          <button key={r} onClick={() => updateInput('returnPreRetire', r)} className={`flex-1 py-3 rounded-2xl text-[11px] font-black transition-all border ${input.returnPreRetire === r ? 'bg-teal-600 border-teal-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-teal-200 hover:text-teal-600'}`}>{r}%</button>
                        ))}
                      </div>
                    </div>
                    <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 space-y-6">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg"><Activity size={20} /></div>
                         <h4 className="text-sm font-black text-slate-800 uppercase">{t('return_post')}</h4>
                      </div>
                      <NumericFormat value={input.returnPostRetire ?? 3} onValueChange={(v) => updateInput('returnPostRetire', v.floatValue || 0)} className="w-full bg-white border border-slate-100 rounded-[24px] px-8 py-5 text-3xl font-black text-amber-600 outline-none transition-all" />
                      <div className="flex gap-2">
                        {[2, 3, 5].map(r => (
                          <button key={r} onClick={() => updateInput('returnPostRetire', r)} className={`flex-1 py-3 rounded-2xl text-[11px] font-black transition-all border ${input.returnPostRetire === r ? 'bg-amber-600 border-amber-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-amber-200 hover:text-amber-600'}`}>{r}%</button>
                        ))}
                      </div>
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
               <button 
                 disabled={activeStep === 1}
                 onClick={() => setActiveStep(p => p - 1)}
                 className="px-8 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-800 disabled:opacity-30 transition-all"
               >
                 {t('back')}
               </button>
               <div className="flex gap-2">
                {[1,2,3,4].map(step => (
                  <div key={step} className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${activeStep === step ? 'bg-amber-500 w-6' : activeStep > step ? 'bg-amber-200' : 'bg-slate-200'}`} />
                ))}
               </div>
               <button 
                 onClick={() => {
                   if (activeStep < 4) setActiveStep(p => p + 1);
                   else scrollToResult();
                 }}
                 className="flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all group"
               >
                 {activeStep === 4 ? t('view_results') : t('next')}
                 <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
          </div>
        </section>

        {/* 📊 Results Dashboard */}
        <section className="space-y-10" id="result-panel">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-amber-500 text-white rounded-[16px] flex items-center justify-center shadow-lg shadow-amber-500/20"><Coins size={24} /></div>
             <div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{t('magic_number')}</h3>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">{t('strategic_projection')}</p>
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-10 bg-slate-900 rounded-[48px] text-center shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#f59e0b,transparent)] opacity-20" />
                <h3 className="text-[11px] font-black text-amber-500 uppercase tracking-[0.3em] mb-4 relative z-10">{t('magic_number')}</h3>
                <div className="text-5xl font-black text-white relative z-10 flex flex-wrap items-baseline justify-center gap-2 w-full leading-tight">
                  <AnimatedCounter value={result.magicNumber} /> <span className="text-xl text-slate-500">฿</span>
                </div>
                <p className="text-[11px] text-slate-500 font-bold mt-6 uppercase tracking-widest relative z-10">{t('goal_needed_label')}</p>
              </div>
              
              <div className="p-10 bg-white border border-slate-100 rounded-[48px] text-center shadow-sm relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:scale-110 transition-transform"><Coins size={140} /></div>
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 relative z-10">{t('projected_wealth')}</h3>
                <div className="text-5xl font-black text-teal-600 relative z-10 flex flex-wrap items-baseline justify-center gap-2 w-full leading-tight">
                  <AnimatedCounter value={result.projectedWealth} /> <span className="text-xl text-slate-300">฿</span>
                </div>
                <p className="text-[11px] text-slate-400 font-bold mt-6 uppercase tracking-widest relative z-10">{t('projected_from_current')}</p>
              </div>

              <div className={`md:col-span-2 p-12 border rounded-[48px] shadow-sm relative overflow-hidden group flex flex-col md:flex-row items-center justify-between gap-8 ${result.isEnough ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                <div className="text-center md:text-left">
                  <h3 className={`text-[11px] font-black uppercase tracking-[0.3em] mb-2 ${result.isEnough ? 'text-emerald-600' : 'text-rose-600'}`}>{t('the_gap')}</h3>
                  <div className={`text-6xl font-black flex items-baseline gap-2 ${result.isEnough ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {result.isEnough ? '0' : <><AnimatedCounter value={result.gap} /> <span className="text-2xl opacity-40 font-black">฿</span></>}
                  </div>
                </div>
                <div className="max-w-[280px] text-center md:text-right">
                   <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest mb-3 ${result.isEnough ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                      {result.isEnough ? <ShieldCheck size={12} /> : <AlertTriangle size={12} />}
                      {result.isEnough ? t('financial_security') : t('deficit_alert')}
                   </div>
                   <p className={`text-xs font-bold leading-relaxed ${result.isEnough ? 'text-emerald-800/60' : 'text-rose-800/60'}`}>{result.isEnough ? t('plan_sufficient') : t('gap_warning')}</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 space-y-6">
              <div className="p-8 bg-slate-50 border border-slate-100 rounded-[40px] space-y-8">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2"><Settings size={14} /> {t('fix_it_title')}</h3>
                
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-[11px] font-black uppercase text-slate-500">{t('fix_it_retire_age')}</span>
                      <span className="text-xl font-black text-amber-600">{input.retirementAge} <span className="text-[11px] opacity-40 font-bold uppercase">{t('yr')}</span></span>
                    </div>
                    <input type="range" min={input.currentAge + 1} max="80" value={input.retirementAge ?? 60} onChange={(e) => updateInput('retirementAge', +e.target.value)} className="w-full accent-amber-500 h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-[11px] font-black uppercase text-slate-500">{t('fix_it_monthly_saving')}</span>
                      <span className="text-xl font-black text-teal-600">{formatNumber(input.currentMonthlySaving)} <span className="text-[11px] opacity-40 font-bold uppercase">฿</span></span>
                    </div>
                    <input type="range" min="0" max="200000" step="1000" value={input.currentMonthlySaving ?? 0} onChange={(e) => updateInput('currentMonthlySaving', +e.target.value)} className="w-full accent-teal-500 h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <ExportReport elementId="result-panel" fileName="retirement-blueprint" />
                <ShareButton data={input as unknown as Record<string, unknown>} />
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="p-10 bg-white border border-slate-100 rounded-[48px] shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
               <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                    <TrendingUp className="text-amber-500" /> {t('wealth_mountain')}
                  </h3>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">{t('growth_consumption_phase')}</p>
               </div>
               <div className="flex flex-wrap gap-4 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl shadow-sm border border-slate-100"><span className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-sm shadow-teal-500/20"></span><span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{t('phase_gogo')}</span></div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl shadow-sm border border-slate-100"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shadow-sm shadow-emerald-500/20"></span><span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{t('phase_slowgo')}</span></div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl shadow-sm border border-slate-100"><span className="w-2.5 h-2.5 rounded-full bg-slate-400 shadow-sm shadow-slate-500/20"></span><span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{t('phase_nogo')}</span></div>
              </div>
            </div>

            <div className="w-full h-[450px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.yearlyProjection}>
                  <defs>
                    <linearGradient id="colorGood" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="age" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 800}} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', fontWeight: '900', padding: '20px' }}
                    formatter={(v, name) => [formatCurrency(Number(v)), name === 'savings' ? t('chart_savings') : t('chart_depleted')]}
                    labelFormatter={(l) => `${isTh ? 'อายุ' : 'Age'} ${l}`}
                  />
                  <ReferenceLine x={input.retirementAge} stroke="#94a3b8" strokeDasharray="6 6" />
                  <Area type="monotone" dataKey="savings" stroke="#10B981" strokeWidth={5} fillOpacity={1} fill="url(#colorGood)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-8 mt-12 w-full">
              <div className={`p-10 border rounded-[48px] shadow-sm relative overflow-hidden transition-all hover:shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 ${result.swrStatus === 'safe' ? 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200' : result.swrStatus === 'warning' ? 'bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200' : 'bg-gradient-to-br from-rose-50 to-rose-100/50 border-rose-200'}`}>
                <div className="flex-1 w-full relative z-10">
                  <h3 className={`text-[11px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2 ${result.swrStatus === 'safe' ? 'text-emerald-700' : result.swrStatus === 'warning' ? 'text-amber-700' : 'text-rose-700'}`}>
                    <Activity size={16} /> {t('swr_title')}
                  </h3>
                  <div className="flex items-center gap-6">
                    <div className={`w-20 h-20 shrink-0 rounded-[24px] flex items-center justify-center font-black text-3xl bg-white shadow-xl shadow-black/5 ${result.swrStatus === 'safe' ? 'text-emerald-600' : result.swrStatus === 'warning' ? 'text-amber-600' : 'text-rose-600'}`}>
                      {result.swr.toFixed(1)}%
                    </div>
                    <div>
                      <div className={`text-2xl font-black leading-none mb-2 ${result.swrStatus === 'safe' ? 'text-emerald-800' : result.swrStatus === 'warning' ? 'text-amber-800' : 'text-rose-800'}`}>
                        {result.swrStatus === 'safe' ? t('status_safe') : result.swrStatus === 'warning' ? t('status_warning') : t('status_danger')}
                      </div>
                      <p className={`text-sm font-bold leading-relaxed max-w-md opacity-70 ${result.swrStatus === 'safe' ? 'text-emerald-900' : result.swrStatus === 'warning' ? 'text-amber-900' : 'text-rose-900'}`}>
                        {result.swrStatus === 'safe' ? t('swr_safe', { rate: result.swr.toFixed(1) }) : result.swrStatus === 'warning' ? t('swr_warning', { rate: result.swr.toFixed(1) }) : t('swr_danger', { rate: result.swr.toFixed(1) })}
                      </p>
                    </div>
                  </div>
                </div>
                
                <Link href="/articles/retirement-planning-first-jobber" className="shrink-0 w-full md:w-auto mt-6 md:mt-0 flex justify-center items-center gap-3 px-8 py-5 bg-white rounded-2xl font-black text-[12px] uppercase tracking-widest text-slate-800 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group/btn relative z-10">
                  {t('learn_swr_rule')} <ChevronRight size={16} className="text-slate-400 group-hover/btn:translate-x-1 transition-transform" />
                </Link>

                {/* Decorative background abstract element */}
                <div className={`absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-[80px] pointer-events-none opacity-50 ${result.swrStatus === 'safe' ? 'bg-emerald-300' : result.swrStatus === 'warning' ? 'bg-amber-300' : 'bg-rose-300'}`} />
              </div>
          </div>
        </section>
        {/* Related Articles Sidebar */}
        <RelatedArticlesSidebar category="retirement" />
      </div>
    </div>
  );
}
