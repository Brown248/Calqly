'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { calcLoan, type LoanResult } from '@/lib/calculators'
import { formatCurrency, formatNumber, formatMonths } from '@/lib/formatters'
import { sanitizeNumber, formatInputNumber } from '@/lib/utils'
import { trackCalculatorUse } from '@/lib/analytics'
import { ShareButton, PrintButton } from '@/components/ui/ShareButton'
import { AdInContent } from '@/components/ads/AdUnit'

interface LoanCalculatorProps {
  lang?: 'th' | 'en'
}

const T = {
  th: {
    title: 'คำนวณสินเชื่อ / ผ่อนชำระ',
    principal: 'วงเงินกู้ (บาท)',
    rate: 'ดอกเบี้ยต่อปี (%)',
    term: 'ระยะเวลา (เดือน)',
    termYears: 'หรือ',
    years: 'ปี',
    monthly: 'ผ่อนต่อเดือน',
    totalPayment: 'จ่ายรวมทั้งหมด',
    totalInterest: 'ดอกเบี้ยรวม',
    scheduleTitle: 'ตารางผ่อนชำระ',
    month: 'เดือน',
    payment: 'ยอดผ่อน',
    principalPaid: 'เงินต้น',
    interestPaid: 'ดอกเบี้ย',
    balance: 'เงินต้นคงเหลือ',
    showSchedule: 'ดูตารางผ่อน',
    hideSchedule: 'ซ่อนตาราง',
  },
  en: {
    title: 'Loan Calculator',
    principal: 'Loan Amount (THB)',
    rate: 'Annual Interest Rate (%)',
    term: 'Loan Term (months)',
    termYears: 'or',
    years: 'years',
    monthly: 'Monthly Payment',
    totalPayment: 'Total Payment',
    totalInterest: 'Total Interest',
    scheduleTitle: 'Amortization Schedule',
    month: 'Month',
    payment: 'Payment',
    principalPaid: 'Principal',
    interestPaid: 'Interest',
    balance: 'Balance',
    showSchedule: 'View Schedule',
    hideSchedule: 'Hide Schedule',
  },
}

export function LoanCalculator({ lang = 'th' }: LoanCalculatorProps) {
  const t = T[lang]
  const searchParams = useSearchParams()
  const router = useRouter()

  // State — initialize from URL params ถ้ามี (feature: share via URL)
  const [principal, setPrincipal] = useState(
    searchParams.get('p') ? formatInputNumber(searchParams.get('p')!) : '2,000,000'
  )
  const [rate, setRate] = useState(searchParams.get('r') ?? '6.5')
  const [termMonths, setTermMonths] = useState(searchParams.get('t') ?? '360')
  const [result, setResult] = useState<LoanResult | null>(null)
  const [showSchedule, setShowSchedule] = useState(false)
  const [scheduleRows, setScheduleRows] = useState(12)

  // คำนวณ real-time ทุกครั้งที่ input เปลี่ยน
  const calculate = useCallback(() => {
    const p = sanitizeNumber(principal)
    const r = parseFloat(rate) || 0
    const t = parseInt(termMonths) || 0

    if (p <= 0 || t <= 0) return

    const res = calcLoan({ principal: p, annualRate: r, termMonths: t })
    setResult(res)

    trackCalculatorUse('loan', { principal: p, annual_rate: r, term_months: t })

    // อัปเดต URL params เพื่อ share
    const url = new URL(window.location.href)
    url.searchParams.set('p', String(p))
    url.searchParams.set('r', String(r))
    url.searchParams.set('t', String(t))
    router.replace(url.pathname + url.search, { scroll: false })
  }, [principal, rate, termMonths])

  useEffect(() => {
    calculate()
  }, [calculate])

  const shareParams = {
    p: sanitizeNumber(principal),
    r: parseFloat(rate) || 0,
    t: parseInt(termMonths) || 0,
  }

  const resultText = result
    ? `${t.title}\n${t.monthly}: ${formatCurrency(result.monthlyPayment, lang)}\n${t.totalInterest}: ${formatCurrency(result.totalInterest, lang)}`
    : ''

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Input Panel */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="space-y-5">
            {/* Principal */}
            <div>
              <label className="calc-label">{t.principal}</label>
              <input
                type="text"
                inputMode="numeric"
                className="calc-input"
                value={principal}
                onChange={(e) => setPrincipal(formatInputNumber(e.target.value))}
                placeholder="2,000,000"
              />
              <input
                type="range"
                min="100000"
                max="10000000"
                step="100000"
                value={sanitizeNumber(principal)}
                onChange={(e) => setPrincipal(formatInputNumber(e.target.value))}
                className="mt-2 w-full accent-brand-600"
              />
              <div className="mt-1 flex justify-between text-xs text-slate-400">
                <span>100K</span>
                <span>10M</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <label className="calc-label">{t.rate}</label>
              <input
                type="number"
                inputMode="decimal"
                className="calc-input"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                step="0.1"
                min="0"
                max="30"
                placeholder="6.5"
              />
              <input
                type="range"
                min="1"
                max="20"
                step="0.25"
                value={parseFloat(rate) || 6.5}
                onChange={(e) => setRate(e.target.value)}
                className="mt-2 w-full accent-brand-600"
              />
              <div className="mt-1 flex justify-between text-xs text-slate-400">
                <span>1%</span>
                <span>20%</span>
              </div>
            </div>

            {/* Term */}
            <div>
              <label className="calc-label">{t.term}</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  inputMode="numeric"
                  className="calc-input"
                  value={termMonths}
                  onChange={(e) => setTermMonths(e.target.value)}
                  placeholder="360"
                />
                <span className="flex items-center text-sm text-slate-400 whitespace-nowrap">
                  {t.termYears}
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  className="calc-input w-24"
                  value={Math.round(parseInt(termMonths) / 12) || ''}
                  onChange={(e) => setTermMonths(String(parseInt(e.target.value) * 12 || 0))}
                  placeholder="30"
                />
                <span className="flex items-center text-sm text-slate-400">{t.years}</span>
              </div>
              <input
                type="range"
                min="12"
                max="480"
                step="12"
                value={parseInt(termMonths) || 360}
                onChange={(e) => setTermMonths(e.target.value)}
                className="mt-2 w-full accent-brand-600"
              />
              <div className="mt-1 flex justify-between text-xs text-slate-400">
                <span>1 {t.years}</span>
                <span>40 {t.years}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Result Panel */}
        <div className="space-y-4">
          {result && (
            <>
              {/* Summary Cards */}
              <div className="result-card">
                <p className="text-sm font-medium text-brand-700 dark:text-brand-400 mb-1">
                  {t.monthly}
                </p>
                <p className="text-4xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(result.monthlyPayment, lang)}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {formatMonths(parseInt(termMonths), lang)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{t.totalPayment}</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(result.totalPayment, lang)}
                  </p>
                </div>
                <div className="rounded-xl border border-red-100 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-950/20">
                  <p className="text-xs font-medium text-red-500 dark:text-red-400 mb-1">{t.totalInterest}</p>
                  <p className="text-lg font-semibold text-red-700 dark:text-red-400">
                    {formatCurrency(result.totalInterest, lang)}
                  </p>
                </div>
              </div>

              {/* Interest vs Principal Ratio Bar */}
              <div className="rounded-xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-2 flex justify-between text-xs text-slate-500">
                  <span>{lang === 'th' ? 'เงินต้น' : 'Principal'}</span>
                  <span>{lang === 'th' ? 'ดอกเบี้ย' : 'Interest'}</span>
                </div>
                <div className="flex h-3 overflow-hidden rounded-full">
                  <div
                    className="bg-brand-500 transition-all duration-500"
                    style={{
                      width: `${(sanitizeNumber(principal) / result.totalPayment) * 100}%`,
                    }}
                  />
                  <div className="flex-1 bg-red-400" />
                </div>
                <div className="mt-1 flex justify-between text-xs font-medium">
                  <span className="text-brand-600">
                    {((sanitizeNumber(principal) / result.totalPayment) * 100).toFixed(1)}%
                  </span>
                  <span className="text-red-500">
                    {((result.totalInterest / result.totalPayment) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 print:hidden">
                <ShareButton calculatorName="loan" params={shareParams} lang={lang} />
                <PrintButton lang={lang} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Ad after main result */}
      <AdInContent />

      {/* Amortization Schedule */}
      {result && (
        <div className="mt-6">
          <button
            onClick={() => setShowSchedule(!showSchedule)}
            className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <TableIcon className="h-4 w-4" />
            {showSchedule ? t.hideSchedule : t.showSchedule}
          </button>

          {showSchedule && (
            <div className="mt-4 animate-slide-up overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    {[t.month, t.payment, t.principalPaid, t.interestPaid, t.balance].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {result.schedule.slice(0, scheduleRows).map((row) => (
                    <tr key={row.month} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">{row.month}</td>
                      <td className="px-4 py-3 text-slate-900 dark:text-slate-100">{formatCurrency(row.payment, lang)}</td>
                      <td className="px-4 py-3 text-brand-600 dark:text-brand-400">{formatCurrency(row.principal, lang)}</td>
                      <td className="px-4 py-3 text-red-500">{formatCurrency(row.interest, lang)}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{formatCurrency(row.balance, lang)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {scheduleRows < result.schedule.length && (
                <div className="border-t border-slate-100 dark:border-slate-800 p-3 text-center">
                  <button
                    onClick={() => setScheduleRows(Math.min(scheduleRows + 12, result.schedule.length))}
                    className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                  >
                    {lang === 'th'
                      ? `ดูอีก 12 เดือน (เหลือ ${result.schedule.length - scheduleRows} เดือน)`
                      : `Show 12 more (${result.schedule.length - scheduleRows} remaining)`}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function TableIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  )
}
