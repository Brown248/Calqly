'use client';

import { useEffect, useState, useMemo } from 'react';
import { calculateTax, defaultTaxInput, TaxInput } from '@/utils/taxCalculations';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { useTranslations, useLocale } from 'next-intl';
import { NumericFormat } from 'react-number-format';
import { AnimatePresence, m } from 'framer-motion';
import AnimatedCounter from '@/components/AnimatedCounter';
import ShareButton from '@/components/ShareButton';
import ExportReport from '@/components/ExportReport';
import Tooltip from '@/components/Tooltip';
import BackButton from '@/components/layout/BackButton';
import { 
  ShieldCheck, 
  Wallet, 
  Users, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Lock,
  HeartHandshake,
  Plus,
  Minus,
  ArrowRight,
  TrendingUp,
  PieChart as PieIcon
} from 'lucide-react';

import SavedProjectsManager from '@/components/SavedProjectsManager';
import { readSharedStateFromUrl } from '@/utils/shareState';

export default function TaxCalculatorClient() {
  const t = useTranslations('TaxCalculator');
  const locale = useLocale();

  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [input, setInput] = useState<TaxInput>(defaultTaxInput);
  const [simulateInvestment, setSimulateInvestment] = useState(0);
  const [showLogic, setShowLogic] = useState(false);

  const baseResult = useMemo(() => calculateTax(input), [input]);
  const simulatedResult = useMemo(() => {
    if (simulateInvestment === 0) return baseResult;
    const mockInput = JSON.parse(JSON.stringify(input));
    mockInput.deductions.ssf += simulateInvestment;
    return calculateTax(mockInput);
  }, [input, simulateInvestment, baseResult]);

  const result = simulatedResult;

  useEffect(() => {
    const sharedInput = readSharedStateFromUrl<Partial<TaxInput>>();
    if (sharedInput) {
      const frame = requestAnimationFrame(() => {
        setInput((current) => ({
          ...current,
          ...sharedInput,
          deductions: {
            ...current.deductions,
            ...(sharedInput.deductions ?? {}),
          },
        }));
      });
      return () => cancelAnimationFrame(frame);
    }
  }, []);

  const updateDeduction = (key: keyof TaxInput['deductions'], value: unknown) => {
    setInput(prev => ({ ...prev, deductions: { ...prev.deductions, [key]: value } }));
  };

  const autoCalcSocialSecurity = () => {
    const monthlyIncome = input.incomeType === 'monthly' ? input.salary : input.salary / 12;
    const calculated = Math.min(monthlyIncome * 0.05, 750) * 12;
    updateDeduction('socialSecurity', calculated);
  };

  const STEPS = [
    { id: 1, label: t('step_family'), icon: <Users size={18} /> },
    { id: 2, label: t('step_income'), icon: <Wallet size={18} /> },
    { id: 3, label: t('step_insurance'), icon: <ShieldCheck size={18} /> },
    { id: 4, label: t('step_other'), icon: <HeartHandshake size={18} /> },
  ];

  return (
    <div className="bg-[#f8fafb] min-h-screen pb-20 pt-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8 flex justify-between items-center">
          <BackButton href="/calculators" />
          <SavedProjectsManager 
               type="tax"
               currentInput={input as unknown as Record<string, unknown>}
               currentResult={result as unknown as Record<string, unknown>}
               onLoad={(p) => setInput(p.input as unknown as TaxInput)}
          />
        </div>
        
        <header className="mb-12 text-center">
          <m.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white shadow-sm border border-slate-100 rounded-full text-[11px] font-black uppercase tracking-[0.2em] text-teal-600 mb-6"
          >
            <Lock size={12} className="text-teal-500" /> {t('privacy_banner')}
          </m.div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4 uppercase leading-none">
            {t('hero_title_1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">{t('hero_title_2')}</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg max-w-xl mx-auto">{t('subtitle_tip')}</p>
        </header>

        <section className="mb-16">
          <div className="bg-white rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
            <div className="flex p-3 bg-slate-50/50 gap-2 overflow-x-auto no-scrollbar">
              {STEPS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveStep(s.id as 1 | 2 | 3 | 4)}
                  className={`flex-1 min-w-[140px] flex items-center justify-center gap-3 py-4 rounded-[32px] text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                    activeStep === s.id 
                    ? 'bg-white text-teal-600 shadow-xl shadow-slate-200/50 scale-[1.02]' 
                    : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${activeStep === s.id ? 'bg-teal-50 text-teal-600' : 'bg-slate-100 text-slate-400'}`}>
                    {s.icon}
                  </span>
                  {s.label}
                </button>
              ))}
            </div>

            <div className="p-8 md:p-14 min-h-[400px]">
              <div className="mb-8 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <m.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(activeStep / 4) * 100}%` }}
                  className="h-full bg-teal-500"
                />
              </div>
              <AnimatePresence mode="wait">
                {activeStep === 1 && (
                  <m.div 
                    key="step1" 
                    initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }} 
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} 
                    exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    className="space-y-10"
                  >
                    <div>
                      <h2 className="text-2xl font-black text-slate-800 mb-2">{t('step_1_title')}</h2>
                      <p className="text-slate-500 font-medium">{t('step_family_desc')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('marital_status')}</label>
                        <div className="flex bg-slate-100 p-1.5 rounded-[24px] gap-1">
                          <button onClick={() => updateDeduction('maritalStatus', 'single')} className={`flex-1 py-3.5 rounded-[18px] text-[11px] font-black uppercase transition-all ${input.deductions.maritalStatus === 'single' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{t('single')}</button>
                          <button onClick={() => updateDeduction('maritalStatus', 'married_no_income')} className={`flex-1 py-3.5 rounded-[18px] text-[11px] font-black uppercase transition-all ${input.deductions.maritalStatus !== 'single' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{t('married')}</button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-6 bg-slate-50 rounded-[32px] flex items-center justify-between border border-transparent hover:border-slate-200 transition-all group">
                          <div className="flex flex-col">
                             <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">{t('has_children')}</span>
                             <span className="text-[11px] text-slate-400 font-bold">{t('child_deduction')}</span>
                          </div>
                          <button onClick={() => updateDeduction('hasChildren', !input.deductions.hasChildren)} className={`w-12 h-7 rounded-full relative transition-all duration-300 ${input.deductions.hasChildren ? 'bg-teal-600 shadow-lg shadow-teal-600/20' : 'bg-slate-300'}`}>
                            <m.div animate={{ x: input.deductions.hasChildren ? 22 : 4 }} className="absolute top-1 left-0 w-5 h-5 bg-white rounded-full shadow-sm" />
                          </button>
                        </div>
                        {input.deductions.hasChildren && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[11px] font-black text-slate-400 uppercase ml-1">{t('pre_61')}</label>
                              <input type="number" value={input.deductions.childrenPre61} onChange={(e) => updateDeduction('childrenPre61', +e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 font-black text-slate-700 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[11px] font-black text-slate-400 uppercase ml-1">{t('post_61')}</label>
                              <input type="number" value={input.deductions.childrenPost61} onChange={(e) => updateDeduction('childrenPost61', +e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 font-black text-slate-700 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all" />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="p-6 bg-slate-50 rounded-[32px] flex items-center justify-between border border-transparent hover:border-slate-200 transition-all">
                          <div className="flex flex-col">
                             <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">{t('care_parents')}</span>
                             <span className="text-[11px] text-slate-400 font-bold">{t('parental_care')}</span>
                          </div>
                          <button onClick={() => updateDeduction('careParents', !input.deductions.careParents)} className={`w-12 h-7 rounded-full relative transition-all duration-300 ${input.deductions.careParents ? 'bg-teal-600 shadow-lg shadow-teal-600/20' : 'bg-slate-300'}`}>
                            <m.div animate={{ x: input.deductions.careParents ? 22 : 4 }} className="absolute top-1 left-0 w-5 h-5 bg-white rounded-full shadow-sm" />
                          </button>
                        </div>
                        {input.deductions.careParents && (
                          <div className="flex items-center gap-4 bg-white rounded-[24px] p-2 border border-slate-100 shadow-sm">
                            <button onClick={() => updateDeduction('parentsCareCount', Math.max(0, input.deductions.parentsCareCount - 1))} className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-all"><Minus size={18} /></button>
                            <span className="flex-1 text-center font-black text-xl text-slate-800">{input.deductions.parentsCareCount}</span>
                            <button onClick={() => updateDeduction('parentsCareCount', Math.min(4, input.deductions.parentsCareCount + 1))} className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-all"><Plus size={18} /></button>
                          </div>
                        )}
                      </div>
                    </div>
                  </m.div>
                )}

                {activeStep === 2 && (
                  <m.div 
                    key="step2" 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: -20 }} 
                    className="space-y-10"
                  >
                    <div>
                      <h2 className="text-2xl font-black text-slate-800 mb-2">{t('step_2_title')}</h2>
                      <p className="text-slate-500 font-medium">{t('step_income_desc')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex justify-between">
                          {t('monthly_income')} 
                          <button onClick={() => setInput({...input, incomeType: input.incomeType === 'monthly' ? 'yearly' : 'monthly'})} className="text-teal-600 hover:underline">{input.incomeType === 'monthly' ? t('switch_to_year') : t('switch_to_month')}</button>
                        </label>
                        <div className="relative group">
                          <NumericFormat value={input.salary} onValueChange={(v) => setInput({...input, salary: v.floatValue || 0})} thousandSeparator="," className="w-full bg-slate-50 border border-slate-100 rounded-[24px] px-8 py-5 text-2xl font-black text-slate-800 outline-none focus:ring-8 focus:ring-teal-500/5 focus:bg-white focus:border-teal-200 transition-all" />
                          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black">฿</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('bonus')}</label>
                        <div className="relative group">
                          <NumericFormat value={input.bonus} onValueChange={(v) => setInput({...input, bonus: v.floatValue || 0})} thousandSeparator="," className="w-full bg-slate-50 border border-slate-100 rounded-[24px] px-8 py-5 text-2xl font-black text-slate-800 outline-none focus:ring-8 focus:ring-teal-500/5 focus:bg-white focus:border-teal-200 transition-all" />
                          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black">฿</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('other_income')}</label>
                        <div className="relative group">
                          <NumericFormat value={input.otherIncome} onValueChange={(v) => setInput({...input, otherIncome: v.floatValue || 0})} thousandSeparator="," className="w-full bg-slate-50 border border-slate-100 rounded-[24px] px-8 py-5 text-2xl font-black text-slate-800 outline-none focus:ring-8 focus:ring-teal-500/5 focus:bg-white focus:border-teal-200 transition-all" />
                          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black">฿</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                          {t('pvd_contribution')}
                          <Tooltip content="กองทุนสำรองเลี้ยงชีพที่บริษัทและคุณช่วยกันสะสม นำมาลดหย่อนภาษีได้ตามที่จ่ายจริง" />
                        </label>
                        <div className="p-6 bg-slate-50 rounded-[32px] space-y-4">
                          <div className="flex justify-between items-center">
                             <span className="text-sm font-black text-slate-700">{input.pvdRate}%</span>
                             <span className="text-[11px] font-black text-slate-400 uppercase">{t('of_salary')}</span>
                          </div>
                          <input type="range" min="0" max="15" value={input.pvdRate} onChange={(e) => setInput({...input, pvdRate: +e.target.value})} className="w-full accent-teal-600" />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 text-orange-600">{t('withheld')}</label>
                        <div className="relative">
                          <NumericFormat value={input.withholdingTax} onValueChange={(v) => setInput({...input, withholdingTax: v.floatValue || 0})} thousandSeparator="," className="w-full bg-orange-50/30 border border-orange-100 rounded-[24px] px-8 py-5 text-2xl font-black text-orange-700 outline-none focus:ring-8 focus:ring-orange-500/5 focus:bg-white focus:border-orange-200 transition-all" />
                          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-orange-200 font-black">฿</span>
                        </div>
                      </div>
                    </div>
                  </m.div>
                )}

                {activeStep === 3 && (
                  <m.div 
                    key="step3" 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: -20 }} 
                    className="space-y-10"
                  >
                    <div>
                      <h2 className="text-2xl font-black text-slate-800 mb-2">{t('step_3_title')}</h2>
                      <p className="text-slate-500 font-medium">{t('step_investment_desc')}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex justify-between">
                          {t('social_security')}
                          <button onClick={autoCalcSocialSecurity} className="text-[11px] bg-slate-800 text-white px-3 py-1 rounded-full hover:bg-slate-700 transition-all uppercase tracking-widest">{t('auto')}</button>
                        </label>
                        <NumericFormat value={input.deductions.socialSecurity} onValueChange={(v) => updateDeduction('socialSecurity', v.floatValue || 0)} className="w-full bg-slate-50 border border-slate-100 rounded-[20px] px-6 py-4 font-black text-slate-800 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('life_insurance')}</label>
                        <NumericFormat value={input.deductions.lifeInsurance} onValueChange={(v) => updateDeduction('lifeInsurance', v.floatValue || 0)} thousandSeparator="," className="w-full bg-slate-50 border border-slate-100 rounded-[20px] px-6 py-4 font-black text-slate-800 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('health_insurance')}</label>
                        <NumericFormat value={input.deductions.healthInsurance} onValueChange={(v) => updateDeduction('healthInsurance', v.floatValue || 0)} thousandSeparator="," className="w-full bg-slate-50 border border-slate-100 rounded-[20px] px-6 py-4 font-black text-slate-800 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-10 border-t border-slate-50">
                      {[
                        { id: 'ssf', label: 'SSF', max: result.limits.ssfMax, tip: t('ssf_tip') },
                        { id: 'rmf', label: 'RMF', max: result.limits.rmfMax, tip: t('rmf_tip') },
                        { id: 'thaiESG', label: 'Thai ESG', max: 300000, tip: t('tesg_tip') },
                        { id: 'annuityInsurance', label: t('annuity_insurance'), max: result.limits.groupMax, tip: t('annuity_tip') },
                      ].map((item) => (
                        <div key={item.id} className="space-y-2">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex justify-between items-center">
                            <span className="flex items-center gap-1.5">{item.label} <Tooltip content={item.tip} /></span>
                            <span className="text-[9px] text-teal-600 font-black">Max {formatNumber(item.max)}</span>
                          </label>
                          <NumericFormat 
                            value={input.deductions[item.id as keyof TaxInput['deductions']] as number} 
                            onValueChange={(v) => updateDeduction(item.id as keyof TaxInput['deductions'], v.floatValue || 0)} 
                            thousandSeparator="," 
                            className="w-full bg-slate-50 border border-slate-100 rounded-[20px] px-6 py-4 font-black text-slate-800 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all" 
                          />
                        </div>
                      ))}
                    </div>
                  </m.div>
                )}

                {activeStep === 4 && (
                  <m.div 
                    key="step4" 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: -20 }} 
                    className="space-y-10"
                  >
                    <div>
                      <h2 className="text-2xl font-black text-slate-800 mb-2">{t('step_4_title')}</h2>
                      <p className="text-slate-500 font-medium">{t('step_other_desc')}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                          {t('home_loan_interest')}
                          <Tooltip content="ดอกเบี้ยบ้านที่จ่ายจริงในปีนั้นๆ สามารถนำมาลดภาษีได้สูงสุด 100,000 บาท" />
                        </label>
                        <NumericFormat value={input.deductions.homeLoanInterest} onValueChange={(v) => updateDeduction('homeLoanInterest', v.floatValue || 0)} thousandSeparator="," className="w-full bg-slate-50 border border-slate-100 rounded-[20px] px-6 py-4 font-black text-slate-800 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                          {t('easy_e_receipt')}
                          <Tooltip content="มาตรการกระตุ้นเศรษฐกิจจากการซื้อสินค้าและบริการที่มีใบกำกับภาษีอิเล็กทรอนิกส์" />
                        </label>
                        <NumericFormat value={input.deductions.easyEReceipt} onValueChange={(v) => updateDeduction('easyEReceipt', v.floatValue || 0)} thousandSeparator="," className="w-full bg-slate-50 border border-slate-100 rounded-[20px] px-6 py-4 font-black text-slate-800 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 text-blue-600">{t('edu_donation')}</label>
                        <NumericFormat value={input.deductions.donation2x} onValueChange={(v) => updateDeduction('donation2x', v.floatValue || 0)} thousandSeparator="," className="w-full bg-blue-50/50 border border-blue-100 rounded-[20px] px-6 py-4 font-black text-blue-700 outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('gen_donation')}</label>
                        <NumericFormat value={input.deductions.donation1x} onValueChange={(v) => updateDeduction('donation1x', v.floatValue || 0)} thousandSeparator="," className="w-full bg-slate-50 border border-slate-100 rounded-[20px] px-6 py-4 font-black text-slate-800 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all" />
                      </div>
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
               <button 
                 disabled={activeStep === 1}
                 onClick={() => setActiveStep(p => (p - 1) as 1 | 2 | 3 | 4)}
                 className="px-8 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
               >
                 {t('back')}
               </button>
               <button 
                 onClick={() => {
                   if (activeStep < 4) setActiveStep(p => (p + 1) as 1 | 2 | 3 | 4);
                   else document.getElementById('result-panel')?.scrollIntoView({ behavior: 'smooth' });
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
        <section className="space-y-12" id="result-panel">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-slate-900 text-white rounded-[16px] flex items-center justify-center shadow-lg"><TrendingUp size={24} /></div>
             <div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{t('wealth_optimization')}</h3>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">{t('live_breakdown')}</p>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-7">
              <div className="bg-white rounded-[48px] overflow-hidden border border-slate-100 shadow-[0_40px_80px_-24px_rgba(0,0,0,0.06)]" id="receipt-panel">
                <div className="bg-slate-900 p-14 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#0d9488,transparent)] opacity-40" />
                  <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 space-y-4">
                    <p className="text-[11px] font-black text-teal-400 uppercase tracking-[0.4em]">{t('estimated_tax_label')}</p>
                    <div className="text-6xl md:text-8xl font-black tracking-tighter text-white">
                      <AnimatedCounter value={Math.abs(result.taxToPay)} suffix=" ฿" />
                    </div>
                    <div className={`inline-flex px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest ${result.taxToPay > 0 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/20' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'}`}>
                      {result.taxToPay > 0 ? t('tax_to_pay_add') : t('tax_refund_add')}
                    </div>
                  </m.div>
                </div>

                <div className="p-12 space-y-8">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                         <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('net_income')}</p>
                         <p className="text-xl font-black text-slate-900">{formatCurrency(result.netIncome)}</p>
                      </div>
                      <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                         <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('effective_rate')}</p>
                         <p className="text-xl font-black text-slate-900">{result.effectiveRate.toFixed(2)}%</p>
                      </div>
                   </div>

                  <div className="space-y-4 pt-4">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2"><PieIcon size={14} /> {t('tax_bracket_breakdown_label')}</h4>
                    {result.brackets.map((b, i) => (
                      <div key={i} className={`flex items-center gap-6 p-4 rounded-3xl transition-all ${b.taxableAmount > 0 ? 'bg-slate-50' : 'opacity-20'}`}>
                        <div className="w-12 font-black text-xs text-slate-400 text-center">{b.rate}%</div>
                        <div className="flex-1 h-3 bg-white rounded-full overflow-hidden border border-slate-100 shadow-inner">
                          <m.div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400" initial={{ width: 0 }} animate={{ width: `${(() => { const prevLimit = i > 0 ? result.brackets[i-1].limit : 0; const bracketRange = (b.limit === Infinity || !b.limit) ? b.taxableAmount || 1 : b.limit - prevLimit; return Math.min((b.taxableAmount / bracketRange) * 100, 100); })()}%` }} transition={{ duration: 1, delay: i * 0.1 }} />
                        </div>
                        <div className="w-24 text-right text-xs font-black text-slate-800">{formatNumber(b.tax)} ฿</div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setShowLogic(!showLogic)} 
                    className="w-full py-6 rounded-[24px] flex items-center justify-center gap-3 bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 hover:text-slate-800 transition-all border border-slate-100"
                  >
                    {showLogic ? <ChevronUp size={16} /> : <ChevronDown size={16} />} {t('view_logic')}
                  </button>
                  <AnimatePresence>
                    {showLogic && (
                      <m.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-4 pt-4 border-t border-slate-50">
                        <div className="flex justify-between text-sm font-bold text-slate-500"><span>{t('total_income_label')}</span><span>{formatNumber(result.totalIncome)}</span></div>
                        <div className="flex justify-between text-sm font-bold text-rose-500"><span>{t('expenses_label')}</span><span>-{formatNumber(result.expenses)}</span></div>
                        <div className="flex justify-between text-sm font-bold text-teal-600"><span>{t('deductions_label')}</span><span>-{formatNumber(result.totalAllowances)}</span></div>
                        <div className="h-px bg-slate-100" />
                        <div className="flex justify-between text-lg font-black text-slate-900 uppercase"><span>{t('net_income')}</span><span>{formatNumber(result.netIncome)}</span></div>
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-8">
              <m.div 
                whileHover={{ y: -5 }}
                className="p-10 bg-gradient-to-br from-teal-600 to-emerald-700 rounded-[48px] text-white shadow-[0_32px_64px_-16px_rgba(13,148,136,0.3)] relative overflow-hidden group"
              >
                <Sparkles className="absolute -top-10 -right-10 w-48 h-48 text-white/10 rotate-12 group-hover:scale-110 transition-transform duration-700" />
                <h4 className="font-black text-2xl mb-4 flex items-center gap-3"><Sparkles size={24} className="text-teal-300" /> {t('ai_title')}</h4>
                <p className="text-sm text-teal-50/80 font-medium leading-relaxed mb-10">{t('ai_desc')}</p>
                
                <div className="space-y-6 bg-black/20 p-8 rounded-[32px] backdrop-blur-md border border-white/10">
                  <div className="flex justify-between items-end">
                    <span className="text-[11px] font-black uppercase tracking-widest text-teal-200">{t('simulated_invest')}</span>
                    <span className="text-2xl font-black">+{formatNumber(simulateInvestment)} <span className="text-xs opacity-60">฿</span></span>
                  </div>
                  <input type="range" min="0" max="200000" step="1000" value={simulateInvestment} onChange={(e) => setSimulateInvestment(+e.target.value)} className="w-full accent-white h-2 bg-white/20 rounded-full appearance-none cursor-pointer" />
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                     <span className="text-[11px] font-black uppercase text-teal-100">{t('extra_tax_refund')}</span>
                     <span className="text-xl font-black text-teal-300">-{formatNumber(baseResult.grossTax - result.grossTax)} ฿</span>
                  </div>
                </div>
              </m.div>

              <div className="grid grid-cols-2 gap-4">
                <ExportReport elementId="receipt-panel" fileName="tax-report-2026" csvData={result.brackets} />
                <ShareButton data={input as unknown as Record<string, unknown>} />
              </div>

            </div>
          </div>
          

        </section>
      </div>
    </div>
  );
}
