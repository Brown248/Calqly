'use client'

import { useState, useCallback, useEffect } from 'react'
import { calcRetirement, type RetirementResult } from '@/lib/calculators'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import { sanitizeNumber, formatInputNumber } from '@/lib/utils'
import { trackCalculatorUse } from '@/lib/analytics'
import { ShareButton, PrintButton } from '@/components/ui/ShareButton'
import { AdInContent } from '@/components/ads/AdUnit'

interface RetirementCalculatorProps {
  lang?: 'th' | 'en'
}

export function RetirementCalculator({ lang = 'th' }: RetirementCalculatorProps) {
  const [currentAge, setCurrentAge] = useState('30')
  const [retirementAge, setRetirementAge] = useState('60')
  const [currentSavings, setCurrentSavings] = useState('100,000')
  const [monthlyContrib, setMonthlyContrib] = useState('5,000')
  const [annualReturn, setAnnualReturn] = useState('7')
  const [inflation, setInflation] = useState('3')
  const [monthlyExpense, setMonthlyExpense] = useState('30,000')
  const [lifeExpectancy, setLifeExpectancy] = useState('85')
  const [result, setResult] = useState<RetirementResult | null>(null)

  const calculate = useCallback(() => {
    const input = {
      currentAge: parseInt(currentAge) || 30,
      retirementAge: parseInt(retirementAge) || 60,
      currentSavings: sanitizeNumber(currentSavings),
      monthlyContribution: sanitizeNumber(monthlyContrib),
      annualReturn: parseFloat(annualReturn) || 7,
      inflationRate: parseFloat(inflation) || 3,
      monthlyExpenseAtRetirement: sanitizeNumber(monthlyExpense),
      lifeExpectancy: parseInt(lifeExpectancy) || 85,
    }
    if (input.retirementAge <= input.currentAge) return
    const res = calcRetirement(input)
    setResult(res)
    trackCalculatorUse('retirement', { current_age: input.currentAge, retirement_age: input.retirementAge })
  }, [currentAge, retirementAge, currentSavings, monthlyContrib, annualReturn, inflation, monthlyExpense, lifeExpectancy])

  useEffect(() => { calculate() }, [calculate])

  const t = lang === 'th'
    ? {
        currentAge: 'อายุปัจจุบัน',
        retirementAge: 'อายุเกษียณ',
        currentSavings: 'เงินออมปัจจุบัน',
        monthly: 'ออมต่อเดือน',
        return: 'ผลตอบแทนต่อปี (%)',
        inflation: 'อัตราเงินเฟ้อ (%)',
        expense: 'ค่าใช้จ่ายต่อเดือนหลังเกษียณ',
        lifeExp: 'อายุขัยที่คาดหวัง',
        atRetirement: 'เงินที่จะมีตอนเกษียณ',
        totalNeeded: 'เงินที่ต้องการทั้งหมด',
        canSustain: 'เงินอยู่ได้กี่ปี',
        inflationExpense: 'ค่าใช้จ่าย (ปรับเงินเฟ้อ)',
        enough: 'เงินพอ',
        notEnough: 'เงินไม่พอ',
        years: 'ปี',
        projection: 'แผนภาพคาดการณ์',
      }
    : {
        currentAge: 'Current Age',
        retirementAge: 'Retirement Age',
        currentSavings: 'Current Savings',
        monthly: 'Monthly Contribution',
        return: 'Annual Return (%)',
        inflation: 'Inflation Rate (%)',
        expense: 'Monthly Expense at Retirement',
        lifeExp: 'Life Expectancy',
        atRetirement: 'Savings at Retirement',
        totalNeeded: 'Total Needed',
        canSustain: 'Funds Last (years)',
        inflationExpense: 'Inflation-adj. Expense',
        enough: 'On Track',
        notEnough: 'Shortfall',
        years: 'years',
        projection: 'Projection Chart',
      }

  const SliderInput = ({
    label, value, onChange, min, max, step = 1, unit = '',
  }: {
    label: string; value: string; onChange: (v: string) => void
    min: number; max: number; step?: number; unit?: string
  }) => (
    <div>
      <div className="flex justify-between mb-1">
        <label className="calc-label mb-0">{label}</label>
        <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={parseFloat(value) || min}
        onChange={(e) => onChange(e.target.value)}
        className="w-full accent-brand-600"
      />
      <div className="flex justify-between text-xs text-slate-400 mt-0.5">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  )

  // Build mini bar chart from projection
  const chartData = result?.yearlyProjection.filter((_, i) => i % 5 === 0) ?? []
  const maxSavings = Math.max(...chartData.map((d) => d.savings), 1)

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Inputs */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="calc-label">{t.currentAge}</label>
              <input type="number" className="calc-input" value={currentAge}
                onChange={(e) => setCurrentAge(e.target.value)} min={18} max={70} />
            </div>
            <div>
              <label className="calc-label">{t.retirementAge}</label>
              <input type="number" className="calc-input" value={retirementAge}
                onChange={(e) => setRetirementAge(e.target.value)} min={40} max={80} />
            </div>
          </div>

          <div>
            <label className="calc-label">{t.currentSavings}</label>
            <input type="text" inputMode="numeric" className="calc-input"
              value={currentSavings} onChange={(e) => setCurrentSavings(formatInputNumber(e.target.value))} />
          </div>

          <div>
            <label className="calc-label">{t.monthly}</label>
            <input type="text" inputMode="numeric" className="calc-input"
              value={monthlyContrib} onChange={(e) => setMonthlyContrib(formatInputNumber(e.target.value))} />
          </div>

          <div>
            <label className="calc-label">{t.expense}</label>
            <input type="text" inputMode="numeric" className="calc-input"
              value={monthlyExpense} onChange={(e) => setMonthlyExpense(formatInputNumber(e.target.value))} />
          </div>

          <SliderInput label={t.return} value={annualReturn} onChange={setAnnualReturn}
            min={1} max={15} step={0.5} unit="%" />
          <SliderInput label={t.inflation} value={inflation} onChange={setInflation}
            min={1} max={8} step={0.5} unit="%" />
          <SliderInput label={t.lifeExp} value={lifeExpectancy} onChange={setLifeExpectancy}
            min={65} max={100} unit={lang === 'th' ? ' ปี' : ' yrs'} />
        </div>

        {/* Results */}
        <div className="space-y-4">
          {result && (
            <>
              {/* Status Banner */}
              <div className={`rounded-2xl p-5 ${result.isEnough
                ? 'bg-green-50 border border-green-100 dark:bg-green-950/20 dark:border-green-900/30'
                : 'bg-red-50 border border-red-100 dark:bg-red-950/20 dark:border-red-900/30'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-lg ${result.isEnough ? 'text-green-600' : 'text-red-500'}`}>
                    {result.isEnough ? '✓' : '✗'}
                  </span>
                  <p className={`text-sm font-semibold ${result.isEnough
                    ? 'text-green-700 dark:text-green-400'
                    : 'text-red-700 dark:text-red-400'}`}>
                    {result.isEnough ? t.enough : t.notEnough}
                  </p>
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(result.totalSavingsAtRetirement, lang)}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {t.atRetirement} (อายุ {retirementAge} ปี)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-xs text-slate-500 mb-1">{t.totalNeeded}</p>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(result.totalNeeded, lang)}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-xs text-slate-500 mb-1">{t.canSustain}</p>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">
                    {isFinite(result.monthsCanSustain)
                      ? `${(result.monthsCanSustain / 12).toFixed(1)} ${t.years}`
                      : '∞'}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs text-slate-500 mb-1">{t.inflationExpense}</p>
                <p className="text-base font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(result.inflationAdjustedExpense, lang)} / {lang === 'th' ? 'เดือน' : 'month'}
                </p>
              </div>

              {/* Mini Chart */}
              {chartData.length > 0 && (
                <div className="rounded-xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4">
                    {t.projection}
                  </p>
                  <div className="flex items-end gap-1.5 h-28">
                    {chartData.map((d) => (
                      <div key={d.age} className="flex flex-1 flex-col items-center gap-1">
                        <div
                          className="w-full rounded-t-md bg-brand-500 dark:bg-brand-600 transition-all duration-300"
                          style={{ height: `${(d.savings / maxSavings) * 96}px` }}
                        />
                        <span className="text-[10px] text-slate-400">{d.age}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-slate-400 text-center">
                    {lang === 'th' ? 'อายุ (ปี)' : 'Age (years)'}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-2 print:hidden">
                <ShareButton
                  calculatorName="retirement"
                  params={{ age: currentAge, ret: retirementAge, sav: sanitizeNumber(currentSavings) }}
                  lang={lang}
                />
                <PrintButton lang={lang} />
              </div>
            </>
          )}
        </div>
      </div>

      <AdInContent />
    </div>
  )
}
