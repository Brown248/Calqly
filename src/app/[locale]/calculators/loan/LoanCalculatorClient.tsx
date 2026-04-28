'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { calculateLoan, defaultLoanInput, InterestStep, LoanInput, LoanResult } from '@/utils/loanCalculations';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { useTranslations } from 'next-intl';
import { NumericFormat } from 'react-number-format';
import { m, AnimatePresence } from 'framer-motion';



// Lazy load Recharts with skeleton fallback
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false, loading: () => <div className="w-full h-[300px] bg-slate-50/50 rounded-3xl animate-pulse" /> });
const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => mod.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Legend = dynamic(() => import('recharts').then(mod => mod.Legend), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then(mod => mod.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false });
const ChartTooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });

import AnimatedCounter from '@/components/AnimatedCounter';
import ShareButton from '@/components/ShareButton';
import ExportReport from '@/components/ExportReport';

import Tooltip from '@/components/Tooltip';
import BackButton from '@/components/layout/BackButton';
import { Home, Car, CreditCard, Plus, Trash2, TrendingDown, Sparkles, ChevronDown, Calendar, ShieldCheck, AlertTriangle, Info, BellRing } from 'lucide-react';

import SavedProjectsManager from '@/components/SavedProjectsManager';
import ComparisonRow from '@/components/ComparisonRow';
import { SavedProject, useFinancialStore } from '@/hooks/useFinancialStore';
import { readSharedStateFromUrl } from '@/utils/shareState';
import RelatedArticlesSidebar from '@/components/calculators/RelatedArticlesSidebar';

export default function LoanCalculatorClient() {
  const t = useTranslations('LoanCalculator');
  const [input, setInput] = useState<LoanInput>(defaultLoanInput);

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [tenureUnit, setTenureUnit] = useState<'year' | 'month'>('year');
  const [amortizationPage, setAmortizationPage] = useState(1);

  const result = useMemo(() => calculateLoan(input), [input]);

  // 🧠 Sync to Global Brain
  const syncFromLoan = useFinancialStore((state) => state.syncFromLoan);
  useEffect(() => {
    syncFromLoan(result.monthlyPayment);
  }, [result.monthlyPayment, syncFromLoan]);

  useEffect(() => {
    const sharedInput = readSharedStateFromUrl<Partial<LoanInput>>();
    if (sharedInput) {
      const frame = requestAnimationFrame(() => {
        setInput((current) => ({ ...current, ...sharedInput as LoanInput }));
      });
      return () => cancelAnimationFrame(frame);
    }
  }, []);

  const loanCompareComponent = (p1: SavedProject, p2: SavedProject) => {
    const r1 = p1.result as unknown as LoanResult;
    const r2 = p2.result as unknown as LoanResult;
    const i1 = p1.input as unknown as LoanInput;
    const i2 = p2.input as unknown as LoanInput;

    // Merge chart data for Overlay comparison
    const maxMonths = Math.max(r1.chartData.length, r2.chartData.length);
    const overlayChartData = Array.from({ length: maxMonths }).map((_, i) => {
      const p1Balance = r1.chartData[i] ? (i1.extraPayment > 0 || i1.yearlyExtraPayment > 0 ? r1.chartData[i].balanceExtra : r1.chartData[i].balanceNormal) : 0;
      const p2Balance = r2.chartData[i] ? (i2.extraPayment > 0 || i2.yearlyExtraPayment > 0 ? r2.chartData[i].balanceExtra : r2.chartData[i].balanceNormal) : 0;
      return {
        month: i + 1,
        year: Math.ceil((i + 1) / 12),
        plan1: p1Balance,
        plan2: p2Balance,
      };
    });
    
    // Sample data to make chart render faster (1 point per year)
    const sampledOverlayData = overlayChartData.filter(d => d.month % 12 === 0 || d.month === maxMonths);

    return (
      <div className="space-y-0">
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="p-6 bg-slate-100 rounded-[32px] text-center border-b-4 border-slate-300">
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('current_plan')}</div>
            <div className="text-lg font-black text-slate-800">{p1.name}</div>
          </div>
          <div className="p-6 bg-teal-600 rounded-[32px] text-center text-white border-b-4 border-teal-800">
            <div className="text-[11px] font-black text-teal-100 uppercase tracking-widest mb-1">{t('saved_plan')}</div>
            <div className="text-lg font-black">{p2.name}</div>
          </div>
        </div>

        {/* Overlay Chart */}
        <div className="p-6 bg-slate-50 border border-slate-100 rounded-[32px] mb-8">
           <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 text-center">{t('balance_trajectory')}</h4>
           <div className="h-[250px] w-full">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sampledOverlayData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPlan1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPlan2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="year" tickFormatter={(v) => `Yr ${v}`} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <ChartTooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                    formatter={(v, name) => [formatCurrency(Number(v || 0)), name === 'plan1' ? p1.name : p2.name]}
                    labelFormatter={(l) => `Year ${l}`}
                  />
                  <Area type="monotone" dataKey="plan1" stroke="#94a3b8" strokeWidth={3} fillOpacity={1} fill="url(#colorPlan1)" activeDot={{ r: 6 }} />
                  <Area type="monotone" dataKey="plan2" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorPlan2)" activeDot={{ r: 6 }} />
                </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        <ComparisonRow 
          label={t('amount')} 
          v1={formatCurrency(i1.amount)} 
          v2={formatCurrency(i2.amount)} 
        />
        <ComparisonRow 
          label={t('monthly_pay')} 
          v1={formatCurrency(r1.monthlyPayment)} 
          v2={formatCurrency(r2.monthlyPayment)} 
          highlightClass="bg-teal-50/30"
        />
        <ComparisonRow 
          label={t('total_interest')} 
          v1={formatCurrency(r1.totalInterest)} 
          v2={formatCurrency(r2.totalInterest)} 
        />
        <ComparisonRow 
          label={t('total_pay')} 
          v1={formatCurrency(r1.totalPayment)} 
          v2={formatCurrency(r2.totalPayment)} 
        />
        <ComparisonRow 
          label={t('actual_duration')} 
          v1={`${Math.floor(r1.totalDurationMonths / 12)} ${t('yr')} ${r1.totalDurationMonths % 12} ${t('mo')}`} 
          v2={`${Math.floor(r2.totalDurationMonths / 12)} ${t('yr')} ${r2.totalDurationMonths % 12} ${t('mo')}`} 
          highlightClass="bg-teal-50/30"
        />
      </div>
    );
  };


  const addStep = () => {
    const lastYear = input.steps[input.steps.length - 1]?.year || 0;
    const newSteps = [...input.steps, { year: lastYear + 1, rate: input.interestRate }];
    setInput({ ...input, steps: newSteps });
  };

  const removeStep = (index: number) => {
    const newSteps = input.steps.filter((_, i) => i !== index);
    setInput({ ...input, steps: newSteps });
  };

  const updateStep = (index: number, field: keyof InterestStep, value: number) => {
    const newSteps = [...input.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setInput({ ...input, steps: newSteps });
  };

  const chartDataDonut = [
    { name: t('principal'), value: input.amount, color: '#10B981' },
    { name: t('interest'), value: result.totalInterest, color: '#f97316' }
  ];

  // Pagination for amortization
  const rowsPerPage = 12; // 1 year per page
  const totalPages = Math.ceil(result.amortization.length / rowsPerPage);
  const paginatedAmortization = result.amortization.slice((amortizationPage - 1) * rowsPerPage, amortizationPage * rowsPerPage);

  const hasExtra = input.extraPayment > 0 || input.yearlyExtraPayment > 0;

  return (
    <div className="bg-[#fcfdfd] min-h-screen pb-20 pt-32">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="mb-8">
          <BackButton href="/calculators" />
        </div>
        {/* TOP: Input Panel */}
        <m.section 
          className="zen-card mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <header className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-3">
              <span className="p-3 bg-teal-50 text-teal-600 rounded-2xl shadow-sm">🏡</span>
              {t('title')}
            </h2>
          </header>

        <div className="space-y-8">
          {/* Loan Type Toggle */}
          <div className="input-group">
            <label className="input-label">{t('loan_type')}</label>
            <div className="relative p-1 bg-slate-100 rounded-2xl flex flex-col md:flex-row gap-1 md:gap-0">
              <button 
                onClick={() => setInput({...input, type: 'home'})}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 rounded-xl transition-all ${input.type === 'home' ? 'bg-white text-teal-600 shadow-sm md:scale-105 z-10' : 'text-slate-500 hover:bg-white/50'}`}
              >
                <Home size={14} /> {t('home_loan')}
              </button>
              <button 
                onClick={() => setInput({...input, type: 'car'})}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 rounded-xl transition-all ${input.type === 'car' ? 'bg-white text-teal-600 shadow-sm md:scale-105 z-10' : 'text-slate-500 hover:bg-white/50'}`}
              >
                <Car size={14} /> {t('car_loan')}
              </button>
              <button 
                onClick={() => setInput({...input, type: 'personal'})}
                className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 rounded-xl transition-all ${input.type === 'personal' ? 'bg-white text-teal-600 shadow-sm md:scale-105 z-10' : 'text-slate-500 hover:bg-white/50'}`}
              >
                <CreditCard size={14} /> {t('personal_loan')}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">{t('amount')}</label>
            <NumericFormat 
              value={input.amount} 
              onValueChange={(v) => setInput(p => ({...p, amount: v.floatValue || 0}))} 
              onFocus={(e) => e.target.select()}
              thousandSeparator="," 
              className="input-field text-2xl font-black"
              inputMode="decimal"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="input-group">
              <label className="input-label flex justify-between">
                {t('tenure')}
                <button 
                  onClick={() => {
                    const newUnit = tenureUnit === 'year' ? 'month' : 'year';
                    setTenureUnit(newUnit);
                    if (newUnit === 'month') {
                      setInput(p => ({...p, months: p.years * 12, years: 0}));
                    } else {
                      setInput(p => ({...p, years: Math.floor(p.months / 12), months: 0}));
                    }
                  }} 
                  className="text-[11px] text-teal-600 underline font-bold uppercase"
                >
                  {tenureUnit === 'year' ? t('switch_to_month') : t('switch_to_year')}
                </button>
              </label>
              <NumericFormat 
                value={tenureUnit === 'year' ? input.years : input.months} 
                onValueChange={(v) => {
                  const val = v.floatValue || 0;
                  // Soft caps for sanity
                  const maxYears = input.type === 'home' ? 40 : 10;
                  const maxMonths = maxYears * 12;
                  
                  if (tenureUnit === 'year' && val > maxYears) {
                    // We allow it but maybe we should cap it? 
                    // Let's cap at 60 for extreme cases but warn
                  }
                  
                  setInput(p => tenureUnit === 'year' ? {...p, years: val, months: 0} : {...p, months: val, years: 0});
                }} 
                onFocus={(e) => e.target.select()}
                className={`input-field font-black ${(tenureUnit === 'year' ? input.years : input.months / 12) > (input.type === 'home' ? 40 : 10) ? 'border-orange-300 bg-orange-50/30' : ''}`}
                inputMode="decimal"
              />
              {(tenureUnit === 'year' ? input.years : input.months / 12) > (input.type === 'home' ? 40 : 10) && (
                <m.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] font-bold text-orange-600 mt-2 flex items-center gap-1">
                  <AlertTriangle size={10} /> {t('unrealistic_tenure_warning') || 'Unusually long tenure for this loan type'}
                </m.p>
              )}
            </div>
            <div className="input-group">
              <label className="input-label flex items-center gap-2">
                {t('interest_rate')} (%)
                <Tooltip content={input.type === 'car' ? "ดอกเบี้ยรถยนต์แบบ Flat Rate จะถูกคิดจากเงินต้นตั้งต้นตลอดสัญญา" : "ดอกเบี้ยแบบลดต้นลดดอก (Effective Rate) ยิ่งเงินต้นเหลือน้อย ดอกเบี้ยยิ่งลดลง"} />
              </label>
              <NumericFormat 
                value={input.interestRate} 
                onValueChange={(v) => setInput(p => ({...p, interestRate: v.floatValue || 0}))} 
                onFocus={(e) => e.target.select()}
                className="input-field font-black"
                inputMode="decimal"
              />
            </div>
          </div>

          {/* Step-up Interest (Home Only) */}
          {input.type === 'home' && (
            <div className="input-group border-t border-slate-50 pt-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-2">
                  <TrendingDown size={16} className="text-teal-500" />
                  {t('step_up_rate')}
                  <Tooltip content="โปรโมชั่นบ้านส่วนใหญ่มักมีดอกเบี้ยต่ำใน 3 ปีแรก และพุ่งสูงขึ้นเป็น MRR ในปีที่ 4" />
                </label>
                <button 
                  onClick={() => setInput({...input, isStepUp: !input.isStepUp})}
                  className={`w-10 h-6 rounded-full transition-colors relative ${input.isStepUp ? 'bg-teal-600' : 'bg-slate-200'}`}
                >
                  <m.div 
                    animate={{ x: input.isStepUp ? 18 : 2 }}
                    className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm" 
                  />
                </button>
              </div>

              <AnimatePresence>
                {input.isStepUp && (
                  <m.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-4"
                  >
                    {input.steps.map((step, i) => (
                      <m.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        key={i} 
                        className="grid grid-cols-12 gap-3 items-center"
                      >
                        <div className="col-span-5">
                          <label className="text-[11px] text-slate-400 font-black mb-1 block uppercase">{t('start_year')}</label>
                          <input 
                            type="number" 
                            value={step.year} 
                            onChange={(e) => updateStep(i, 'year', +e.target.value)}
                            onFocus={(e) => e.target.select()}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-teal-500/20"
                          />
                        </div>
                        <div className="col-span-5">
                          <label className="text-[11px] text-slate-400 font-black mb-1 block uppercase">{t('rate')} (%)</label>
                          <input 
                            type="number" 
                            step="0.1"
                            value={step.rate} 
                            onChange={(e) => updateStep(i, 'rate', +e.target.value)}
                            onFocus={(e) => e.target.select()}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-teal-500/20"
                          />
                        </div>
                        <button onClick={() => removeStep(i)} className="col-span-2 mt-5 text-red-300 hover:text-red-500 transition-colors p-2">
                          <Trash2 size={16} />
                        </button>
                      </m.div>
                    ))}
                    <button 
                      onClick={addStep}
                      className="w-full py-3 border-2 border-dashed border-slate-100 rounded-2xl text-[11px] font-black uppercase text-slate-400 hover:border-teal-200 hover:text-teal-600 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus size={14} /> {t('add_step')}
                    </button>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Refinance Comparison (Home Only) */}
          {input.type === 'home' && (
            <div className={`p-6 rounded-[32px] border transition-all ${input.refinanceMode ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100'}`}>
              <div className="flex items-center justify-between mb-4">
                <label className={`text-sm font-black flex items-center gap-2 ${input.refinanceMode ? 'text-indigo-700' : 'text-slate-700'}`}>
                  <ShieldCheck size={16} className={input.refinanceMode ? 'text-indigo-500' : 'text-slate-400'} />
                  {t('refinance_compare_title') || 'Refinance Comparison'}
                  <Tooltip content="เปรียบเทียบว่าการรีไฟแนนซ์ไปดอกเบี้ยที่ต่ำกว่า จะช่วยประหยัดเงินได้เท่าไหร่" />
                </label>
                <button 
                  onClick={() => setInput({...input, refinanceMode: !input.refinanceMode})}
                  className={`w-10 h-6 rounded-full transition-colors relative ${input.refinanceMode ? 'bg-indigo-600' : 'bg-slate-200'}`}
                >
                  <m.div 
                    animate={{ x: input.refinanceMode ? 18 : 2 }}
                    className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm" 
                  />
                </button>
              </div>

              <AnimatePresence>
                {input.refinanceMode && (
                  <m.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="input-group">
                        <label className="text-[11px] font-black text-slate-500 uppercase mb-2 block">{t('refinance_year') || 'Refinance at Year'}</label>
                          <input 
                            type="number" 
                            value={input.refinanceYear} 
                            onChange={(e) => setInput({...input, refinanceYear: +e.target.value})}
                            onFocus={(e) => e.target.select()}
                            className="w-full bg-white border border-indigo-200 rounded-2xl px-5 py-3 font-black outline-none focus:ring-4 focus:ring-indigo-500/10"
                          />
                      </div>
                      <div className="input-group">
                        <label className="text-[11px] font-black text-slate-500 uppercase mb-2 block">{t('new_rate') || 'New Rate (%)'}</label>
                        <input 
                          type="number" 
                          step="0.1"
                          value={input.refinanceRate} 
                          onChange={(e) => setInput({...input, refinanceRate: +e.target.value})}
                          onFocus={(e) => e.target.select()}
                          className="w-full bg-white border border-indigo-200 rounded-2xl px-5 py-3 font-black outline-none focus:ring-4 focus:ring-indigo-500/10"
                        />
                      </div>
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Extra Payment Section */}
          <div className={`p-6 rounded-[32px] border transition-all ${hasExtra ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
            <h4 className={`text-sm font-black mb-4 flex items-center gap-2 ${hasExtra ? 'text-emerald-700' : 'text-slate-700'}`}>
              <Sparkles size={16} className={hasExtra ? 'text-emerald-500' : 'text-slate-400'} />
              {t('extra_pay_weapon')}
              <Tooltip content="การจ่ายเพิ่มเพียงเล็กน้อยแต่ทำสม่ำเสมอ สามารถลดดอกเบี้ยบ้านได้เป็นหลักแสนถึงหลักล้าน!" />
            </h4>
            
            <div className="space-y-4">
              <div className="input-group">
                <label className="text-[11px] font-black text-slate-500 uppercase mb-2 block">{t('extra_payment')}</label>
                <NumericFormat 
                  value={input.extraPayment} 
                  onValueChange={(v) => setInput(p => ({...p, extraPayment: v.floatValue || 0}))} 
                  onFocus={(e) => e.target.select()}
                  thousandSeparator="," 
                  className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 font-black outline-none focus:ring-4 focus:ring-emerald-500/10"
                  placeholder="0"
                />
              </div>

              {/* What-if Quick Actions */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="w-full text-[9px] font-black text-emerald-600/60 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <Sparkles size={10} /> {t('what_if_quick')}
                </span>
                {[1000, 3000, 5000].map(amt => (
                  <button
                    key={amt}
                    onClick={() => setInput(p => ({ ...p, extraPayment: amt }))}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-black transition-all ${input.extraPayment === amt ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-emerald-600 border border-emerald-100 hover:bg-emerald-50'}`}
                  >
                    +{formatNumber(amt)}
                  </button>
                ))}
                <button
                  onClick={() => setInput(p => ({ ...p, extraPayment: Math.round(result.monthlyPayment) }))}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-black transition-all ${input.extraPayment === Math.round(result.monthlyPayment) ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-emerald-600 border border-emerald-100 hover:bg-emerald-50'}`}
                >
                  {t('pay_2x')}
                </button>
                <button
                  onClick={() => setInput(p => ({ ...p, extraPayment: 0 }))}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-black bg-white text-slate-400 border border-slate-100 hover:bg-slate-50"
                >
                  {t('clear')}
                </button>
              </div>
              
              {input.type !== 'car' && (
                <div className="input-group">
                  <label className="text-[11px] font-black text-slate-500 uppercase mb-2 flex justify-between">
                    {t('yearly_lump_sum')}
                    <div className="group relative cursor-pointer">
                      <Info size={12} className="text-slate-400" />
                      <div className="absolute bottom-full mb-2 right-0 w-48 p-2 bg-slate-800 text-white text-[11px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">{t('yearly_lump_sum_tip')}</div>
                    </div>
                  </label>
                  <NumericFormat 
                    value={input.yearlyExtraPayment} 
                    onValueChange={(v) => setInput(p => ({...p, yearlyExtraPayment: v.floatValue || 0}))} 
                    onFocus={(e) => e.target.select()}
                    thousandSeparator="," 
                    className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 font-black outline-none focus:ring-4 focus:ring-emerald-500/10"
                    placeholder="0"
                  />
                </div>
              )}
            </div>
            
            {/* Goal Seeker / Working Backwards */}
            {input.type === 'home' && (
              <div className="mt-8 pt-6 border-t border-emerald-100/50">
                <h5 className="text-[11px] font-black uppercase text-emerald-800 tracking-widest mb-3 flex items-center gap-2">
                  🎯 {t('goal_seeker_title') || 'Working Backwards'}
                </h5>
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <span className="text-xs font-bold text-slate-600 whitespace-nowrap">{t('goal_seeker_backward')}</span>
                  <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        min="1" 
                        max={tenureUnit === 'year' ? input.years : Math.floor(input.months / 12)}
                        placeholder={String(Math.max(1, (tenureUnit === 'year' ? input.years : input.months/12) - 5))}
                        className="w-20 bg-white border border-emerald-200 rounded-xl px-3 py-2 text-center font-black text-emerald-700 outline-none focus:ring-2 focus:ring-emerald-500"
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          const targetYears = +e.target.value;
                          const currentYears = tenureUnit === 'year' ? input.years : input.months / 12;
                          if (targetYears > 0 && targetYears < currentYears) {
                            const targetMonths = targetYears * 12;
                            // Exact formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
                            // We use a simplified delta approach for the extra payment
                            const ratePerMonth = (input.interestRate / 100) / 12;
                            const requiredPayment = input.amount * (ratePerMonth * Math.pow(1 + ratePerMonth, targetMonths)) / (Math.pow(1 + ratePerMonth, targetMonths) - 1);
                            const extraNeeded = requiredPayment - result.monthlyPayment;
                            setInput(p => ({ ...p, extraPayment: Math.max(0, Math.round(extraNeeded / 100) * 100) }));
                          }
                        }}
                      />
                    <span className="text-xs font-bold text-slate-600">{t('goal_seeker_years_label')}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  {t('goal_seeker_note')}
                </p>
              </div>
            )}

            <p className="mt-4 text-[11px] font-bold text-slate-500 leading-relaxed italic">
              &quot;{t('extra_payment_tip')}&quot;
            </p>
          </div>

          {/* Stress Test Section */}
          <div className="p-6 rounded-[32px] border border-rose-100 bg-rose-50/30">
            <h4 className="text-sm font-black text-rose-800 mb-4 flex items-center gap-2">
              <AlertTriangle size={16} className="text-rose-500" />
              {t('stress_test_title') || 'Stress Test Your Loan'}
              <Tooltip content="ทดสอบแผนการเงินของคุณว่าสามารถรับมือกับความเสี่ยงต่างๆ ได้หรือไม่" />
            </h4>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setInput({...input, stressTest: input.stressTest === 'interest-hike' ? 'none' : 'interest-hike'})}
                className={`flex-1 py-3 px-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${input.stressTest === 'interest-hike' ? 'bg-rose-600 text-white' : 'bg-white text-rose-600 border border-rose-100 hover:bg-rose-50'}`}
              >
                {t('interest_hike_test') || 'Rate Hike (+1%)'}
              </button>
              <button 
                onClick={() => setInput({...input, stressTest: input.stressTest === 'income-shock' ? 'none' : 'income-shock'})}
                className={`flex-1 py-3 px-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${input.stressTest === 'income-shock' ? 'bg-rose-600 text-white' : 'bg-white text-rose-600 border border-rose-100 hover:bg-rose-50'}`}
              >
                {t('income_shock_test') || 'Income Loss (3 Months)'}
              </button>
            </div>
            {input.stressTest !== 'none' && (
              <m.p 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="mt-4 text-[11px] font-bold text-rose-700 bg-white/50 p-3 rounded-xl border border-rose-100/50"
              >
                {result.stressTestResult?.warningMessage}
              </m.p>
            )}
          </div>
        </div>
        </m.section>

        {/* BOTTOM: Output Panel */}
        <m.section
          className="zen-card"
          id="result-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{t('view_results')}</h3>
              <p className="text-[11px] font-black text-slate-400 uppercase mt-1 tracking-widest">{t('analysis_subtitle')}</p>
            </div>
            <SavedProjectsManager 
              type="loan"
              currentInput={input as unknown as Record<string, unknown>}
              currentResult={result as unknown as Record<string, unknown>}
              onLoad={(p) => setInput(p.input as unknown as LoanInput)}
              compareComponent={loanCompareComponent}
            />
          </div>
          
          {/* Main Hero Metrics: Debt Truth Revealed */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
            <div className="md:col-span-8 p-8 bg-[#fcfdfd] border border-slate-100 rounded-[32px] shadow-sm flex flex-col justify-center overflow-hidden">
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">{t('monthly_pay')}</div>
              <div className="text-4xl md:text-5xl font-black text-slate-800 break-all w-full leading-tight">
                <AnimatedCounter value={result.monthlyPayment} /> <span className="text-xl text-slate-400">฿</span>
              </div>
            </div>
            
            <div className="md:col-span-4 p-8 bg-orange-50 border border-orange-100 rounded-[32px] shadow-sm flex flex-col justify-center relative overflow-hidden group">
              <TrendingDown className="absolute -bottom-4 -right-4 w-24 h-24 text-orange-500 opacity-10 group-hover:scale-110 transition-transform" />
              <div className="text-[11px] font-black text-orange-800 uppercase tracking-widest mb-3 relative z-10">{t('total_interest_label')}</div>
              <div className="text-2xl font-black text-orange-600 relative z-10 break-all">
                <AnimatedCounter value={result.totalInterest} /> ฿
              </div>
            </div>
          </div>

          {/* 🔄 Refinance Side-by-Side Comparison */}
          <AnimatePresence>
            {input.refinanceMode && result.refinanceResult && (
              <m.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                className="p-8 bg-indigo-600 rounded-[32px] mb-12 text-white shadow-xl shadow-indigo-500/20"
              >
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 bg-white/20 rounded-xl"><ShieldCheck size={20} /></div>
                   <h4 className="text-xl font-black uppercase tracking-tight">{t('refinance_summary') || 'Refinance Summary'}</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                   <div className="bg-white/10 p-6 rounded-[24px]">
                      <p className="text-[11px] font-black uppercase tracking-widest text-indigo-100 mb-2">{t('new_monthly_pay') || 'New Payment'}</p>
                      <p className="text-2xl font-black">{formatCurrency(result.refinanceResult.newMonthlyPayment)}</p>
                   </div>
                   <div className="bg-white/10 p-6 rounded-[24px]">
                      <p className="text-[11px] font-black uppercase tracking-widest text-indigo-100 mb-2">{t('interest_after_ref') || 'New Total Interest'}</p>
                      <p className="text-2xl font-black">{formatCurrency(result.refinanceResult.newTotalInterest)}</p>
                   </div>
                   <div className="bg-emerald-500 p-6 rounded-[24px] shadow-lg">
                      <p className="text-[11px] font-black uppercase tracking-widest text-emerald-100 mb-2">{t('net_ref_savings') || 'Net Savings'}</p>
                      <p className="text-2xl font-black">+{formatCurrency(result.refinanceResult.netSavings)}</p>
                   </div>
                </div>
              </m.div>
            )}
          </AnimatePresence>

          {/* 🌪️ Stress Test Impact */}
          <AnimatePresence>
            {input.stressTest === 'interest-hike' && result.stressTestResult && (
              <m.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="p-8 bg-rose-600 rounded-[32px] mb-12 text-white shadow-xl shadow-rose-500/20"
              >
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 bg-white/20 rounded-xl"><AlertTriangle size={20} /></div>
                   <h4 className="text-xl font-black uppercase tracking-tight">{t('stress_test_impact') || 'Rate Hike Impact (+1%)'}</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-rose-100 mb-1">{t('impact_monthly') || 'Impact on Monthly Payment'}</p>
                      <p className="text-3xl font-black">+{formatCurrency(result.stressTestResult.impactMonthlyPayment - result.monthlyPayment)}</p>
                   </div>
                   <div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-rose-100 mb-1">{t('impact_total_interest') || 'Impact on Total Interest'}</p>
                      <p className="text-3xl font-black">+{formatCurrency(result.stressTestResult.impactTotalInterest - result.totalInterest)}</p>
                   </div>
                </div>
              </m.div>
            )}
          </AnimatePresence>
          
          <div className="p-6 bg-slate-800 rounded-[24px] mb-12 flex justify-between items-center text-white">
             <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">{t('total_pay')} (Principal + Interest)</div>
             <div className="text-xl font-black">{formatCurrency(result.totalPayment)}</div>
          </div>

          {/* Car Flat Rate Warning */}
          <AnimatePresence>
            {input.type === 'car' && result.effectiveRateForCar && (
              <m.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="p-6 bg-amber-50 border border-amber-200 rounded-[24px] mb-12 flex items-start gap-4"
              >
                <AlertTriangle size={24} className="text-amber-500 shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-black text-amber-800 mb-1">{t('car_loan_truth_title')}</h4>
                  <p className="text-xs font-bold text-amber-700 leading-relaxed">
                    {t('car_loan_truth_desc', { rate: input.interestRate, effRate: result.effectiveRateForCar.toFixed(2) })}
                  </p>
                </div>
              </m.div>
            )}
          </AnimatePresence>

          {/* 💡 Dynamic Financial Insight Engine */}
          <m.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 bg-gradient-to-br from-slate-50 to-teal-50/30 border border-teal-100/50 rounded-[32px] mb-12 relative overflow-hidden group"
          >
            <Sparkles className="absolute -right-6 -top-6 w-24 h-24 text-teal-600/5 group-hover:rotate-12 transition-transform duration-700" />
            <h4 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
              <ShieldCheck size={18} className="text-teal-600" />
              {t('loan_health_check')}
            </h4>
            
            <div className="space-y-4 relative z-10">
              {result.totalInterest > input.amount * 0.5 ? (
                <div className="flex gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                   <p className="text-sm font-bold text-slate-600 leading-relaxed">
                     {t('insight_high_interest', { ratio: ((result.totalInterest / input.amount) * 100).toFixed(0) })}
                   </p>
                </div>
              ) : (
                <div className="flex gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                   <p className="text-sm font-bold text-slate-600 leading-relaxed">
                     {t('insight_good_structure')}
                   </p>
                </div>
              )}

              {result.timeSavedMonths > 0 && result.interestSaved > 10 && (
                <div className="flex gap-3 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/10">
                   <Sparkles size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                   <p className="text-sm font-black text-emerald-700 leading-relaxed">
                     {t('insight_extra_pay_success', { 
                       years: Math.floor(result.timeSavedMonths / 12), 
                       months: result.timeSavedMonths % 12,
                       savings: formatCurrency(result.interestSaved)
                     })}
                   </p>
                </div>
              )}
            </div>
          </m.div>

          {/* Refinance Trigger Banner */}
          <AnimatePresence>
            {input.type === 'home' && result.refinanceWarningYear && (
              <m.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="p-6 bg-rose-50 border border-rose-200 rounded-[24px] mb-12 flex items-start gap-4"
              >
                <BellRing size={24} className="text-rose-500 shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-black text-rose-800 mb-1">{t('refinance_warning_title')}</h4>
                  <p className="text-xs font-bold text-rose-700 leading-relaxed">
                    {t('refinance_warning_desc', { year: result.refinanceWarningYear })}
                  </p>
                </div>
              </m.div>
            )}
          </AnimatePresence>

          {/* The Magic of Extra Pay Celebration Banner */}
          <AnimatePresence>
            {(hasExtra && input.type !== 'car') && (
              <m.div 
                initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
                className="p-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[32px] mb-12 text-white shadow-xl shadow-emerald-500/20 text-center"
              >
                <h4 className="text-[11px] font-black uppercase tracking-widest text-emerald-100 mb-2">{t('extra_pay_victory_title')}</h4>
                <p className="text-sm md:text-base font-bold leading-relaxed">
                  {t('extra_pay_victory_desc', { interest: formatNumber(result.interestSaved), years: Math.floor(result.timeSavedMonths / 12), months: result.timeSavedMonths % 12 })}
                </p>
              </m.div>
            )}
          </AnimatePresence>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">
            
            {/* The Liberation Chart */}
            <div className="lg:col-span-8 flex flex-col p-6 border border-slate-100 rounded-[32px]">
              <h4 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2 text-center w-full justify-center">
                <TrendingDown size={18} className="text-teal-500" />
                {t('debt_journey')}
              </h4>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={result.chartData}>
                    <defs>
                      <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorBalanceExtra" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" hide />
                    <YAxis hide />
                    <ChartTooltip 
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                      formatter={(v, name) => [formatCurrency(Number(v)), name === 'balanceNormal' ? t('normal_balance') : t('extra_balance')]}
                      labelFormatter={(l) => `${t('month_label')} ${l}`}
                    />
                    
                    {/* Normal Balance Line */}
                    <Area type="monotone" name="balanceNormal" dataKey="balanceNormal" stroke="#cbd5e1" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
                    {/* Extra Pay Balance Line */}
                    {hasExtra && input.type !== 'car' && (
                      <Area type="monotone" name="balanceExtra" dataKey="balanceExtra" stroke="#10B981" strokeWidth={4} fillOpacity={1} fill="url(#colorBalanceExtra)" />
                    )}
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Principal vs Interest Donut */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-[32px]">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">{t('principal_vs_interest')}</h4>
              <div className="w-full h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartDataDonut}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {chartDataDonut.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <ChartTooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                      formatter={(v) => formatCurrency(Number(v))}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-3 mt-4 w-full">
                {chartDataDonut.map(c => (
                  <div key={c.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full" style={{background: c.color}} />
                       <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{c.name}</span>
                    </div>
                    <span className="text-xs font-black">{formatCurrency(c.value)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-4 mt-8">
              <RelatedArticlesSidebar category="loan" />
            </div>
          </div>



          {/* Amortization Accordion */}
          <div className="border-t border-slate-50 pt-10">
            <button 
              onClick={() => setIsAccordionOpen(!isAccordionOpen)}
              className="w-full py-6 px-8 bg-slate-50 hover:bg-white rounded-[24px] border border-slate-100 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                  <Calendar size={20} className="text-teal-500" />
                </div>
                <div className="text-left">
                  <span className="block text-sm font-black text-slate-700 uppercase tracking-widest">{t('view_details')}</span>
                  <span className="block text-[11px] text-slate-400 font-bold mt-1">{t('view_details_sub')}</span>
                </div>
              </div>
              <m.div animate={{ rotate: isAccordionOpen ? 180 : 0 }}>
                <ChevronDown size={20} className="text-slate-400" />
              </m.div>
            </button>

            <AnimatePresence>
              {isAccordionOpen && (
                <m.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-8 overflow-x-auto bg-white border border-slate-100 rounded-[24px] shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="py-4 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">{t('month_label')}</th>
                          <th className="py-4 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">{t('interest')}</th>
                          <th className="py-4 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">{t('principal')}</th>
                          {hasExtra && <th className="py-4 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-emerald-600">{t('extra_payment')}</th>}
                          <th className="py-4 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">{t('balance')}</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {paginatedAmortization.map((row, i) => (
                          <m.tr 
                            key={row.month}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: Math.min(i * 0.02, 0.5) }}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="py-4 px-6 font-black text-slate-400">{row.month} <span className="text-[11px] opacity-50 ml-1">({t('year_label')} {row.year})</span></td>
                            <td className="py-4 px-6 font-bold text-orange-500">{formatCurrency(row.interest)}</td>
                            <td className="py-4 px-6 font-bold text-slate-600">{formatCurrency(row.principal)}</td>
                            {hasExtra && <td className="py-4 px-6 font-bold text-emerald-600">{formatCurrency(row.extraPayment)}</td>}
                            <td className="py-4 px-6 font-black text-slate-800">{formatCurrency(row.remainingBalance)}</td>
                          </m.tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {/* Pagination */}
                    <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
                      <button 
                        onClick={() => setAmortizationPage(p => Math.max(1, p - 1))}
                        disabled={amortizationPage === 1}
                        className="px-4 py-2 text-xs font-black text-slate-500 bg-white rounded-lg disabled:opacity-50"
                      >
                        {t('prev_year')}
                      </button>
                      <span className="text-[11px] font-black text-slate-400">{t('year_of', { current: amortizationPage, total: totalPages })}</span>
                      <button 
                        onClick={() => setAmortizationPage(p => Math.min(totalPages, p + 1))}
                        disabled={amortizationPage === totalPages}
                        className="px-4 py-2 text-xs font-black text-slate-500 bg-white rounded-lg disabled:opacity-50"
                      >
                        {t('next_year')}
                      </button>
                    </div>

                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-4 border-t border-slate-50 mt-12 pt-10">
            <ExportReport elementId="result-panel" fileName="ultimate-debt-plan" csvData={result.amortization} />
            <ShareButton data={input as unknown as Record<string, unknown>} />
          </div>
        </m.section>
      </div>
    </div>
  );
}
