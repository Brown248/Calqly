'use client';

import { useEffect, useState, useMemo } from 'react';
import { calculateROI, defaultROIInput, ROIInput, ROIResult } from '@/utils/roiCalculations';
import { formatCurrency, formatNumber, formatCompactNumber } from '@/utils/formatters';
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
const Label = dynamic(() => import('recharts').then(mod => mod.Label), { ssr: false });

import AnimatedCounter from '@/components/AnimatedCounter';
import ShareButton from '@/components/ShareButton';
import ExportReport from '@/components/ExportReport';

import BackButton from '@/components/layout/BackButton';
import { 
  TrendingUp, 
  Coins, 
  Clock, 
  Zap, 
  ShieldCheck,
  BarChart3,
  Globe,
  Flame,
  Database
} from 'lucide-react';

import SavedProjectsManager from '@/components/SavedProjectsManager';
import { SavedProject } from '@/hooks/useFinancialStore';
import { readSharedStateFromUrl } from '@/utils/shareState';
import ComparisonRow from '@/components/ComparisonRow';

export default function ROICalculatorClient() {
  const t = useTranslations('ROICalculator');
  const locale = useLocale();
  const isTh = locale === 'th';

  const [input, setInput] = useState<ROIInput>(defaultROIInput);
  const [activeStep, setActiveStep] = useState(1);

  const result = useMemo(() => calculateROI(input), [input]);

  useEffect(() => {
    const sharedInput = readSharedStateFromUrl<Partial<ROIInput>>();
    if (sharedInput) {
      const frame = requestAnimationFrame(() => {
        setInput((current) => ({ ...current, ...sharedInput }));
      });
      return () => cancelAnimationFrame(frame);
    }
  }, []);

  const roiCompareComponent = (p1: SavedProject, p2: SavedProject) => {
    const r1 = p1.result as unknown as ROIResult;
    const r2 = p2.result as unknown as ROIResult;
    
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-8">
          <div className="p-4 bg-slate-100 rounded-2xl text-center">
             <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Current</div>
             <div className="font-black text-slate-700">{p1.name}</div>
          </div>
          <div className="p-4 bg-purple-600 rounded-2xl text-center text-white">
             <div className="text-[9px] font-black text-purple-100 uppercase mb-1">Saved</div>
             <div className="font-black">{p2.name}</div>
          </div>
        </div>
        
        <ComparisonRow label={t('result_final_value')} v1={formatCurrency(r1.finalValue)} v2={formatCurrency(r2.finalValue)} highlightClass="bg-purple-50/30" />
        <ComparisonRow label={t('result_profit')} v1={formatCurrency(r1.totalReturns)} v2={formatCurrency(r2.totalReturns)} />
        <ComparisonRow label={t('result_total_inv')} v1={formatCurrency(r1.totalInvested)} v2={formatCurrency(r2.totalInvested)} />
        <ComparisonRow label={t('crossover_year_label')} v1={r1.crossoverYear?.toString() || '-'} v2={r2.crossoverYear?.toString() || '-'} />
      </div>
    );
  };

  const updateInput = (key: keyof ROIInput, value: unknown) => {
    setInput(p => ({ ...p, [key]: value }));
  };

  const ASSETS = [
    { id: 'digital', label: t('preset_digital'), rate: 2, icon: <Database size={16} /> },
    { id: 'bonds', label: t('preset_bonds'), rate: 3.5, icon: <ShieldCheck size={16} /> },
    { id: 'stocks', label: t('preset_stocks'), rate: 10, icon: <Globe size={16} /> },
    { id: 'gold', label: t('preset_gold'), rate: 7, icon: <Flame size={16} /> },
    { id: 'crypto', label: t('preset_crypto'), rate: 20, icon: <Zap size={16} /> },
  ];

  const STEPS = [
    { id: 1, label: t('step_capital'), icon: <Coins size={16} /> },
    { id: 2, label: t('step_asset'), icon: <BarChart3 size={16} /> },
    { id: 3, label: t('step_reality'), icon: <ShieldCheck size={16} /> },
  ];

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
          <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-3">
              <span className="p-3 bg-purple-50 text-purple-600 rounded-2xl shadow-sm">📈</span>
              {t('title')}
            </h2>
            <p className="text-slate-400 font-bold mt-2 text-sm">{t('subtitle')}</p>
          </div>

        {/* Wizard Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-2xl mb-8 overflow-x-auto no-scrollbar">
          {STEPS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveStep(s.id)}
              className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                activeStep === s.id ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-400'
              }`}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        <div className="min-h-[380px]">
          <AnimatePresence mode="wait">
            {activeStep === 1 && (
              <m.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="input-group">
                  <label className="input-label">{t('initial_inv')}</label>
                  <NumericFormat 
                    value={input.initialInvestment ?? 0} 
                    onValueChange={(v) => updateInput('initialInvestment', v.floatValue || 0)} 
                    onFocus={(e) => e.target.select()}
                    thousandSeparator="," 
                    className="input-field text-xl font-black" 
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">{t('monthly_inv')}</label>
                  <NumericFormat 
                    value={input.monthlyInvestment ?? 0} 
                    onValueChange={(v) => updateInput('monthlyInvestment', v.floatValue || 0)} 
                    onFocus={(e) => e.target.select()}
                    thousandSeparator="," 
                    className="input-field text-xl font-black text-purple-600" 
                  />
                </div>
                <div className="input-group">
                  <div className="flex justify-between mb-4">
                    <label className="input-label">{t('years')}</label>
                    <span className="text-purple-600 font-black">{input.investmentYears}</span>
                  </div>
                  <input type="range" min="1" max="50" value={input.investmentYears} onChange={(e) => updateInput('investmentYears', +e.target.value)} className="w-full accent-purple-600" />
                </div>
              </m.div>
            )}

            {activeStep === 2 && (
              <m.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                <div className="grid grid-cols-1 gap-2">
                  {ASSETS.map(asset => (
                    <button
                      key={asset.id}
                      onClick={() => updateInput('annualReturn', asset.rate)}
                      className={`p-4 rounded-2xl border text-left flex items-center justify-between group transition-all ${input.annualReturn === asset.rate ? 'bg-purple-600 border-purple-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-600 hover:border-purple-200'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${input.annualReturn === asset.rate ? 'bg-white/20' : 'bg-slate-50 text-purple-500'}`}>{asset.icon}</div>
                        <span className="text-sm font-black uppercase tracking-tight">{asset.label}</span>
                      </div>
                      <span className="font-black">{asset.rate}%</span>
                    </button>
                  ))}
                </div>
                <div className="input-group pt-4 border-t border-slate-50">
                  <label className="input-label">{t('custom_return_label')} (%)</label>
                  <NumericFormat 
                    value={input.annualReturn} 
                    onValueChange={(v) => updateInput('annualReturn', v.floatValue || 0)} 
                    onFocus={(e) => e.target.select()}
                    className="input-field font-black" 
                  />
                </div>
              </m.div>
            )}

            {activeStep === 3 && (
              <m.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="input-group">
                  <label className="input-label">{t('compounding')}</label>
                  <select 
                    value={input.compoundingFrequency} 
                    onChange={(e) => updateInput('compoundingFrequency', +e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-black text-slate-700 outline-none focus:ring-4 focus:ring-purple-500/10"
                  >
                    <option value={1}>{t('freq_annual')}</option>
                    <option value={12}>{t('freq_monthly')}</option>
                    <option value={365}>{t('freq_daily')}</option>
                  </select>
                </div>

                <div className={`p-6 rounded-[2.5rem] border transition-all ${input.inflationAdjusted ? 'bg-purple-50 border-purple-100' : 'bg-slate-50 border-slate-100'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${input.inflationAdjusted ? 'bg-white text-purple-600 shadow-sm' : 'bg-slate-200 text-slate-400'}`}><ShieldCheck size={20} /></div>
                      <div>
                        <h4 className={`text-xs font-black uppercase tracking-widest ${input.inflationAdjusted ? 'text-purple-800' : 'text-slate-500'}`}>{t('inflation_adj')}</h4>
                        <p className="text-[11px] text-slate-400 font-bold">{t('inflation_tip')}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => updateInput('inflationAdjusted', !input.inflationAdjusted)}
                      className={`w-10 h-6 rounded-full relative transition-all ${input.inflationAdjusted ? 'bg-purple-600' : 'bg-slate-300'}`}
                    >
                      <m.div animate={{ x: input.inflationAdjusted ? 18 : 2 }} className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm" />
                    </button>
                  </div>
                  {input.inflationAdjusted && (
                    <div className="input-group">
                      <label className="text-[11px] font-black text-purple-400 uppercase mb-2">{t('inflation_rate_label')} (%)</label>
                      <NumericFormat 
                        value={input.inflationRate} 
                        onValueChange={(v) => updateInput('inflationRate', v.floatValue || 0)} 
                        onFocus={(e) => e.target.select()}
                        className="w-full bg-white/50 border-none rounded-xl px-4 py-2 font-black text-purple-600 outline-none" 
                      />
                    </div>
                  )}
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-3 mt-10 pt-10 border-t border-slate-50">
          {activeStep > 1 && (
            <button onClick={() => setActiveStep(p => p - 1)} className="btn btn-secondary flex-1 py-4 text-xs font-black uppercase tracking-widest">{t('back')}</button>
          )}
          {activeStep < 3 ? (
            <button onClick={() => setActiveStep(p => p + 1)} className="btn btn-primary flex-[2] py-4 text-xs font-black uppercase tracking-widest">{t('next')}</button>
          ) : (
            <button onClick={() => document.getElementById('result-panel')?.scrollIntoView({ behavior: 'smooth' })} className="btn btn-primary flex-[2] py-4 text-xs font-black uppercase tracking-widest">{t('view_results')}</button>
          )}
        </div>
        </m.section>

        {/* BOTTOM: Output Dashboard */}
        <m.section
          className="zen-card relative z-10"
          id="result-panel"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 20,
            delay: 0.1 
          }}
        >
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{t('result_summary_label')}</h3>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">{t('compound_interest_projection')}</p>
            </div>
            <SavedProjectsManager 
              type="roi"
              currentInput={input as unknown as Record<string, unknown>}
              currentResult={result as unknown as Record<string, unknown>}
              onLoad={(p) => setInput(p.input as unknown as ROIInput)}
              compareComponent={roiCompareComponent}
            />
          </div>
          
          {/* Main Numbers */}
          <div className="text-center mb-12">
            <div className="highlight-label mb-2">{t('result_final_value')}</div>
            <div className="highlight-value text-purple-600 mb-8 w-full break-all px-4">
              <AnimatedCounter value={result.finalValue} suffix=" ฿" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 md:p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col justify-center">
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{t('result_total_inv')}</div>
                <div className="text-lg md:text-xl font-black text-slate-600 break-all">{formatCurrency(result.totalInvested)}</div>
              </div>
              <div className="p-4 md:p-6 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 flex flex-col justify-center">
                <div className="text-[9px] font-black text-emerald-600/70 uppercase tracking-[0.2em] mb-2">{t('result_profit')}</div>
                <div className="text-lg md:text-xl font-black text-emerald-600 break-all">+{formatCurrency(result.totalReturns)}</div>
              </div>
            </div>
          </div>

          {/* The Wealth Mountain Chart */}
          <div className="mb-12 p-8 bg-white border border-slate-100 rounded-[32px] shadow-sm relative overflow-hidden">
            <h3 className="text-sm font-black text-slate-800 mb-8 flex items-center gap-2">
              <TrendingUp size={18} className="text-purple-500" /> {t('wealth_mountain')}
            </h3>
            
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.yearlyData}>
                  <defs>
                    <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                    formatter={(v) => formatCurrency(Number(v))}
                    labelFormatter={(l) => `${isTh ? 'ปีที่' : 'Year'} ${l}`}
                  />
                  {result.crossoverYear && (
                    <ReferenceLine x={result.crossoverYear} stroke="#8b5cf6" strokeDasharray="5 5">
                      <Label value={t('crossover_title')} position="top" fill="#8b5cf6" style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }} />
                    </ReferenceLine>
                  )}
                  <Area name={t('principal_label')} type="monotone" dataKey="principal" stackId="1" stroke="#94a3b8" strokeWidth={2} fillOpacity={1} fill="url(#colorPrincipal)" />
                  <Area name={t('returns_label')} type="monotone" dataKey="returns" stackId="1" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorReturns)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Life-Changing Point Insight */}
          {result.crossoverYear && (
           <m.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-8 p-10 bg-gradient-to-br from-teal-600 to-emerald-700 rounded-[3rem] text-white shadow-[0_20px_50px_rgba(13,148,136,0.2)] relative overflow-hidden group border border-teal-500/30">
             <div className="absolute top-0 right-0 p-8 text-white/5 opacity-20 pointer-events-none transform translate-x-1/4 -translate-y-1/4"><Zap size={200} /></div>
             <h4 className="text-xl font-black mb-4 flex items-center gap-3"><Zap size={24} className="text-yellow-300 fill-yellow-300/30" /> {t('crossover_title')}</h4>
             <p className="text-base font-bold text-teal-50 leading-relaxed max-w-2xl">
               {t('crossover_desc', { 
                 year: result.crossoverYear, 
                 profit: formatNumber(result.yearlyData[result.crossoverYear-1].annualReturnAmount),
                 contribution: formatNumber(input.monthlyInvestment * 12)
               })}
             </p>
           </m.div>
          )}

          {/* Cost of Waiting Insight */}
          <div className="mb-12">
            <div className="p-8 bg-orange-50 border border-orange-100 rounded-[2.5rem] w-full overflow-hidden">
              <h4 className="text-[11px] font-black text-orange-800 uppercase tracking-widest mb-4 flex items-center gap-2"><Clock size={14} /> {t('waiting_title')}</h4>
              <p className="text-sm font-bold text-orange-700 leading-relaxed mb-4">{t('waiting_desc', { amount: formatCompactNumber(result.costOfWaiting5Years) })}</p>
              <div className="text-3xl font-black text-orange-600 break-all w-full leading-tight">+{formatCompactNumber(result.costOfWaiting5Years)} <span className="text-sm opacity-60">฿ / {t('mo')}</span></div>
            </div>
          </div>

          <div className="flex gap-4 border-t border-slate-50 pt-10">
            <ExportReport elementId="result-panel" fileName="roi-simulator" />
            <ShareButton data={input as unknown as Record<string, unknown>} />
          </div>
        </m.section>
      </div>
    </div>
  );
}
