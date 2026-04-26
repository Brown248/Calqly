'use client';

import { useEffect, useState, useMemo } from 'react';
import { calculateRealCost, defaultRealCostInput, RealCostInput, RealCostResult } from '@/utils/realCostCalculations';
import { formatCurrency } from '@/utils/formatters';
import { useTranslations, useLocale } from 'next-intl';
import { NumericFormat } from 'react-number-format';
import dynamic from 'next/dynamic';
import { m, AnimatePresence } from 'framer-motion';

const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then(mod => mod.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false });
const RechartsTooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const Legend = dynamic(() => import('recharts').then(mod => mod.Legend), { ssr: false });

import AnimatedCounter from '@/components/AnimatedCounter';
import ShareButton from '@/components/ShareButton';
import ExportReport from '@/components/ExportReport';
import { Wallet, TrendingDown, Sparkles, ShieldAlert, History } from 'lucide-react';
import BackButton from '@/components/layout/BackButton';

import SavedProjectsManager from '@/components/SavedProjectsManager';
import { SavedProject } from '@/hooks/useFinancialStore';
import { readSharedStateFromUrl } from '@/utils/shareState';


export default function RealCostCalculatorClient() {
  const t = useTranslations('RealCostCalculator');
  const locale = useLocale();
  const isTh = locale === 'th';

  const [input, setInput] = useState<RealCostInput>(defaultRealCostInput);

  const result = useMemo(() => calculateRealCost(input), [input]);

  useEffect(() => {
    const sharedInput = readSharedStateFromUrl<Partial<RealCostInput>>();
    if (sharedInput) {
      const frame = requestAnimationFrame(() => {
        setInput((current) => ({ ...current, ...sharedInput }));
      });
      return () => cancelAnimationFrame(frame);
    }
  }, []);

  const realCostCompareComponent = (p1: SavedProject, p2: SavedProject) => {
    const r1 = p1.result as unknown as RealCostResult;
    const r2 = p2.result as unknown as RealCostResult;
    
    const ComparisonRow = ({ label, v1, v2, highlight }: { label: string, v1: string, v2: string, highlight?: boolean }) => (
      <div className={`grid grid-cols-2 gap-8 py-4 border-b border-slate-100 ${highlight ? 'bg-indigo-50/30' : ''}`}>
        <div className="px-4">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
          <div className="text-lg font-black text-slate-800">{v1}</div>
        </div>
        <div className="px-4 border-l border-slate-100">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
          <div className="text-lg font-black text-slate-800">{v2}</div>
        </div>
      </div>
    );

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-8">
          <div className="p-4 bg-slate-100 rounded-2xl text-center">
             <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Current</div>
             <div className="font-black text-slate-700">{p1.name}</div>
          </div>
          <div className="p-4 bg-indigo-600 rounded-2xl text-center text-white">
             <div className="text-[9px] font-black text-indigo-100 uppercase mb-1">Saved</div>
             <div className="font-black">{p2.name}</div>
          </div>
        </div>
        
        <ComparisonRow label={t('wealth_lost')} v1={formatCurrency(r1.realCost)} v2={formatCurrency(r2.realCost)} highlight />
        <ComparisonRow label={t('total_out_of_pocket')} v1={formatCurrency(r1.totalOutofPocket)} v2={formatCurrency(r2.totalOutofPocket)} />
        <ComparisonRow label={t('opportunity_cost')} v1={formatCurrency(r1.opportunityCost)} v2={formatCurrency(r2.opportunityCost)} />
      </div>
    );
  };

  const chartData = [
    { name: t('price'), value: result.breakdown.price, color: '#6366F1' },
    { name: t('total_interest'), value: result.breakdown.interest, color: '#F59E0B' },
    { name: t('total_ongoing'), value: result.breakdown.ongoing, color: '#EC4899' },
    { name: t('opportunity_cost'), value: result.breakdown.opportunity, color: '#10B981' }
  ];

  return (
    <div className="bg-[#fcfdfd] min-h-screen pb-20 pt-32">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="mb-8">
           <BackButton href="/calculators" />
        </div>
        <m.section 
          className="zen-card mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <header className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-3">
              <span className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-sm">💰</span>
              {t('title')}
            </h2>
          </header>

          <div className="space-y-8">
            <div className="input-group">
              <label className="input-label">{t('price')}</label>
              <NumericFormat 
                value={input.price} 
                onValueChange={(v) => setInput(p => ({...p, price: v.floatValue || 0}))} 
                onFocus={(e) => e.target.select()}
                thousandSeparator="," 
                className="input-field text-2xl font-black"
                inputMode="decimal"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="input-group">
                <label className="input-label">{t('down_payment')}</label>
                <NumericFormat 
                  value={input.downPayment} 
                  onValueChange={(v) => setInput(p => ({...p, downPayment: v.floatValue || 0}))} 
                  onFocus={(e) => e.target.select()}
                  thousandSeparator="," 
                  className="input-field font-black"
                  inputMode="decimal"
                />
              </div>
              <div className="input-group">
                <label className="input-label">{t('loan_interest')}</label>
                <NumericFormat 
                  value={input.interestRate} 
                  onValueChange={(v) => setInput(p => ({...p, interestRate: v.floatValue || 0}))} 
                  onFocus={(e) => e.target.select()}
                  className="input-field font-black"
                  inputMode="decimal"
                />
              </div>
              <div className="input-group">
                <label className="input-label">{t('loan_term')}</label>
                <NumericFormat 
                  value={input.loanTermYears} 
                  onValueChange={(v) => setInput(p => ({...p, loanTermYears: v.floatValue || 0}))} 
                  onFocus={(e) => e.target.select()}
                  className="input-field font-black"
                  inputMode="decimal"
                />
              </div>
              <div className="input-group">
                <label className="input-label">{t('usage_years')}</label>
                <NumericFormat 
                  value={input.usageYears} 
                  onValueChange={(v) => setInput(p => ({...p, usageYears: v.floatValue || 0}))} 
                  onFocus={(e) => e.target.select()}
                  className="input-field font-black"
                  inputMode="decimal"
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">{t('ongoing_costs')}</label>
              <NumericFormat 
                value={input.ongoingCostsAnnual} 
                onValueChange={(v) => setInput(p => ({...p, ongoingCostsAnnual: v.floatValue || 0}))} 
                onFocus={(e) => e.target.select()}
                thousandSeparator="," 
                className="input-field font-black"
                inputMode="decimal"
              />
            </div>

            <div className="p-6 rounded-[32px] bg-emerald-50 border border-emerald-100 transition-all">
              <h4 className="text-sm font-black mb-4 flex items-center gap-2 text-emerald-700">
                <TrendingDown size={16} className="text-emerald-500" />
                {t('opp_rate')}
              </h4>
              <div className="space-y-4">
                <NumericFormat 
                  value={input.opportunityCostRate} 
                  onValueChange={(v) => setInput(p => ({...p, opportunityCostRate: v.floatValue || 0}))} 
                  onFocus={(e) => e.target.select()}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 font-black outline-none focus:ring-4 focus:ring-emerald-500/10"
                />
                <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic">
                  {t('opp_desc')}
                </p>
              </div>
            </div>
          </div>
        </m.section>

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
              <p className="text-[10px] font-black text-slate-400 uppercase mt-1 tracking-widest">{t('analysis_period', { years: input.usageYears })}</p>
            </div>
            <SavedProjectsManager 
              type="real-cost"
              currentInput={input as unknown as Record<string, unknown>}
              currentResult={result as unknown as Record<string, unknown>}
              onLoad={(p) => setInput(p.input as unknown as RealCostInput)}
              compareComponent={realCostCompareComponent}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
            <div className="md:col-span-12 p-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[40px] shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <ShieldAlert size={120} className="text-white" />
              </div>
              <div className="relative z-10">
                <div className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-3">{t('wealth_lost')}</div>
                <div className="text-5xl md:text-7xl font-black text-white break-all leading-tight mb-4">
                  <AnimatedCounter value={result.realCost} /> <span className="text-2xl text-slate-400">฿</span>
                </div>
                <p className="text-indigo-200/60 text-xs font-bold max-w-md leading-relaxed">
                  {t('real_cost_desc')}
                </p>
              </div>
            </div>

            <div className="md:col-span-6 p-8 bg-white border border-slate-100 rounded-[32px] shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <Wallet className="w-4 h-4 text-indigo-500" />
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('total_out_of_pocket')}</div>
              </div>
              <div className="text-3xl font-black text-slate-800 break-all">
                <AnimatedCounter value={result.totalOutofPocket} /> ฿
              </div>
              <p className="text-[10px] text-slate-400 font-bold mt-2">{t('total_spent_desc')}</p>
            </div>
            
            <div className="md:col-span-6 p-8 bg-emerald-50 border border-emerald-100 rounded-[32px] shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="w-4 h-4 text-emerald-500" />
                <div className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">{t('opportunity_cost')}</div>
              </div>
              <div className="text-3xl font-black text-emerald-600 break-all">
                <AnimatedCounter value={result.opportunityCost} /> ฿
              </div>
              <p className="text-[10px] text-emerald-600/60 font-bold mt-2">{t('opp_cost_desc')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-slate-50 rounded-[24px] border border-slate-100">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('monthly_payment')}</div>
              <div className="text-xl font-black text-slate-800">{formatCurrency(result.monthlyLoanPayment)}</div>
            </div>
            <div className="p-6 bg-slate-50 rounded-[24px] border border-slate-100">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('total_interest')}</div>
              <div className="text-xl font-black text-slate-800">{formatCurrency(result.totalInterest)}</div>
            </div>
            <div className="p-6 bg-slate-50 rounded-[24px] border border-slate-100">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('total_ongoing')}</div>
              <div className="text-xl font-black text-slate-800">{formatCurrency(result.totalOngoingCosts)}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">
            <div className="lg:col-span-7 flex flex-col p-8 border border-slate-100 rounded-[32px] bg-[#fcfdfd]">
              <h4 className="text-sm font-black text-slate-800 mb-8 flex items-center gap-2">
                <History size={18} className="text-indigo-500" />
                {t('breakdown')}
              </h4>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                      formatter={(v) => formatCurrency(Number(v))}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              {chartData.map((item) => (
                <div key={item.name} className="p-5 bg-white border border-slate-100 rounded-[24px] flex items-center justify-between group hover:border-indigo-100 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-slate-800">{formatCurrency(item.value)}</div>
                    <div className="text-[10px] font-bold text-slate-400">{((item.value / result.realCost) * 100).toFixed(1)}%</div>
                  </div>
                </div>
              ))}
              
              <div className="mt-8 p-6 bg-indigo-50 rounded-[24px] border border-indigo-100">
                <div className="flex items-start gap-3">
                  <Sparkles size={18} className="text-indigo-500 shrink-0 mt-1" />
                  <p className="text-xs font-bold text-indigo-700 leading-relaxed">
                    {isTh 
                      ? "การคำนวณนี้ช่วยให้คุณเห็นมูลค่าความมั่งคั่งที่จะหายไปจริงในอนาคต หากคุณนำเงินก้อนนี้ไปลงทุนแทนการซื้อของชิ้นนี้" 
                      : "This calculation helps you visualize the actual wealth you're sacrificing by choosing this purchase over investing the same amount."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 border-t border-slate-50 pt-10">
            <ExportReport elementId="result-panel" fileName="real-cost-analysis" />
            <ShareButton data={input as unknown as Record<string, unknown>} />
          </div>
        </m.section>
      </div>
    </div>
  );
}
