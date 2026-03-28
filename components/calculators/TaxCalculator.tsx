'use client'

import { useState, useCallback, useEffect } from 'react'
import { calcThaiTax, type TaxInput, type TaxResult } from '@/lib/calculators'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatters'
import { sanitizeNumber, formatInputNumber } from '@/lib/utils'
import { trackCalculatorUse } from '@/lib/analytics'
import { ShareButton, PrintButton } from '@/components/ui/ShareButton'
import { AdInContent } from '@/components/ads/AdUnit'

interface TaxCalculatorProps {
  lang?: 'th' | 'en'
}

const INCOME_TYPES = {
  employee:  { th: 'พนักงาน/ลูกจ้าง (หักได้ 50%, สูงสุด 100,000)', en: 'Employee (50% deduction, max 100K)' },
  freelance: { th: 'ฟรีแลนซ์ (หักได้ 30%)', en: 'Freelancer (30% deduction)' },
  business:  { th: 'ธุรกิจ (หักได้ 60%)', en: 'Business Owner (60% deduction)' },
}

export function TaxCalculator({ lang = 'th' }: TaxCalculatorProps) {
  const [income, setIncome] = useState('600,000')
  const [incomeType, setIncomeType] = useState<TaxInput['incomeType']>('employee')
  const [hasSpouse, setHasSpouse] = useState(false)
  const [children, setChildren] = useState(0)
  const [parentCount, setParentCount] = useState(0)
  const [lifeInsurance, setLifeInsurance] = useState('0')
  const [healthInsurance, setHealthInsurance] = useState('0')
  const [providentFund, setProvidentFund] = useState('0')
  const [rmf, setRmf] = useState('0')
  const [ssf, setSsf] = useState('0')
  const [donation, setDonation] = useState('0')
  const [result, setResult] = useState<TaxResult | null>(null)
  const [showBreakdown, setShowBreakdown] = useState(false)

  const calculate = useCallback(() => {
    const input: TaxInput = {
      income: sanitizeNumber(income),
      incomeType,
      hasSpouse,
      children,
      parentCount,
      lifeInsurance: sanitizeNumber(lifeInsurance),
      healthInsurance: sanitizeNumber(healthInsurance),
      providentFund: sanitizeNumber(providentFund),
      rmf: sanitizeNumber(rmf),
      ssf: sanitizeNumber(ssf),
      donation: sanitizeNumber(donation),
    }

    const res = calcThaiTax(input)
    setResult(res)
    trackCalculatorUse('tax', { income: input.income })
  }, [income, incomeType, hasSpouse, children, parentCount, lifeInsurance, healthInsurance, providentFund, rmf, ssf, donation])

  useEffect(() => { calculate() }, [calculate])

  const t = lang === 'th'
    ? {
        income: 'รายได้ต่อปี (บาท)',
        incomeType: 'ประเภทรายได้',
        deductions: 'ค่าลดหย่อน',
        spouse: 'มีคู่สมรส (+60,000)',
        children: 'จำนวนบุตร',
        parents: 'พ่อแม่ที่ดูแล',
        lifeIns: 'ประกันชีวิต',
        healthIns: 'ประกันสุขภาพ',
        pvf: 'กองทุนสำรองเลี้ยงชีพ',
        rmfLabel: 'กองทุน RMF',
        ssfLabel: 'กองทุน SSF',
        donationLabel: 'เงินบริจาค',
        taxResult: 'ภาษีที่ต้องจ่าย',
        taxableIncome: 'รายได้สุทธิ',
        totalDeduction: 'ลดหย่อนรวม',
        effectiveRate: 'อัตราภาษีจริง',
        bracketTitle: 'คำนวณตาม brackets',
        deductionDetail: 'รายละเอียดค่าลดหย่อน',
        showDetail: 'ดูรายละเอียด',
        hideDetail: 'ซ่อนรายละเอียด',
        bracket: 'ช่วงรายได้',
        rate: 'อัตรา',
        taxableAmt: 'รายได้ในช่วง',
        taxAmt: 'ภาษี',
      }
    : {
        income: 'Annual Income (THB)',
        incomeType: 'Income Type',
        deductions: 'Deductions',
        spouse: 'Spouse (+60,000)',
        children: 'Number of Children',
        parents: 'Parents Supported',
        lifeIns: 'Life Insurance',
        healthIns: 'Health Insurance',
        pvf: 'Provident Fund',
        rmfLabel: 'RMF Fund',
        ssfLabel: 'SSF Fund',
        donationLabel: 'Donations',
        taxResult: 'Tax Due',
        taxableIncome: 'Net Income',
        totalDeduction: 'Total Deductions',
        effectiveRate: 'Effective Rate',
        bracketTitle: 'Bracket Breakdown',
        deductionDetail: 'Deduction Details',
        showDetail: 'Show Details',
        hideDetail: 'Hide Details',
        bracket: 'Income Range',
        rate: 'Rate',
        taxableAmt: 'Taxable Amount',
        taxAmt: 'Tax',
      }

  const NumberInput = ({
    label, value, onChange, max, placeholder = '0',
  }: {
    label: string; value: string; onChange: (v: string) => void; max?: string; placeholder?: string
  }) => (
    <div>
      <label className="calc-label">{label} {max && <span className="text-slate-400 font-normal">(สูงสุด {max})</span>}</label>
      <input
        type="text"
        inputMode="numeric"
        className="calc-input"
        value={value}
        onChange={(e) => onChange(formatInputNumber(e.target.value))}
        placeholder={placeholder}
      />
    </div>
  )

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-6">
          {/* Main Income */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-4 text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {lang === 'th' ? 'ข้อมูลรายได้' : 'Income'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="calc-label">{t.income}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  className="calc-input"
                  value={income}
                  onChange={(e) => setIncome(formatInputNumber(e.target.value))}
                />
              </div>
              <div>
                <label className="calc-label">{t.incomeType}</label>
                <select
                  className="calc-input"
                  value={incomeType}
                  onChange={(e) => setIncomeType(e.target.value as TaxInput['incomeType'])}
                >
                  {Object.entries(INCOME_TYPES).map(([key, label]) => (
                    <option key={key} value={key}>{label[lang]}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-4 text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {t.deductions}
            </h3>
            <div className="space-y-4">
              {/* Spouse Toggle */}
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 px-4 py-3 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 transition-colors">
                <span className="text-sm text-slate-700 dark:text-slate-300">{t.spouse}</span>
                <button
                  role="switch"
                  aria-checked={hasSpouse}
                  onClick={() => setHasSpouse(!hasSpouse)}
                  className={`relative h-5 w-9 rounded-full transition-colors ${hasSpouse ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${hasSpouse ? 'translate-x-4' : ''}`} />
                </button>
              </label>

              {/* Children & Parents */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="calc-label">{t.children}</label>
                  <input
                    type="number"
                    className="calc-input"
                    value={children}
                    onChange={(e) => setChildren(Math.max(0, parseInt(e.target.value) || 0))}
                    min={0} max={10}
                  />
                </div>
                <div>
                  <label className="calc-label">{t.parents}</label>
                  <input
                    type="number"
                    className="calc-input"
                    value={parentCount}
                    onChange={(e) => setParentCount(Math.max(0, parseInt(e.target.value) || 0))}
                    min={0} max={4}
                  />
                </div>
              </div>

              <NumberInput label={t.lifeIns} value={lifeInsurance} onChange={setLifeInsurance} max="100,000" />
              <NumberInput label={t.healthIns} value={healthInsurance} onChange={setHealthInsurance} max="25,000" />
              <NumberInput label={t.pvf} value={providentFund} onChange={setProvidentFund} max="500,000" />
              <NumberInput label={t.rmfLabel} value={rmf} onChange={setRmf} max="500,000" />
              <NumberInput label={t.ssfLabel} value={ssf} onChange={setSsf} max="200,000" />
              <NumberInput label={t.donationLabel} value={donation} onChange={setDonation} />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {result && (
            <>
              {/* Main Result */}
              <div className="result-card">
                <p className="text-sm font-medium text-brand-700 dark:text-brand-400">{t.taxResult}</p>
                <p className="mt-1 text-4xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(result.tax, lang)}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {t.effectiveRate}: <strong className="text-slate-700 dark:text-slate-300">{formatPercent(result.effectiveRate)}</strong>
                </p>
              </div>

              {/* Summary row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t.taxableIncome}</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(result.taxableIncome, lang)}
                  </p>
                </div>
                <div className="rounded-xl border border-green-100 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-950/20">
                  <p className="text-xs text-green-600 dark:text-green-400 mb-1">{t.totalDeduction}</p>
                  <p className="text-lg font-semibold text-green-700 dark:text-green-400">
                    {formatCurrency(result.totalDeduction, lang)}
                  </p>
                </div>
              </div>

              {/* Deduction Details */}
              <div className="rounded-xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
                <button
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  {showBreakdown ? t.hideDetail : t.showDetail}
                  <ChevronIcon className={`h-4 w-4 transition-transform ${showBreakdown ? 'rotate-180' : ''}`} />
                </button>

                {showBreakdown && (
                  <div className="border-t border-slate-100 dark:border-slate-800 px-4 pb-4 pt-3 space-y-2">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
                      {t.deductionDetail}
                    </p>
                    {result.deductionBreakdown.map((item) => (
                      <div key={item.label} className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {formatCurrency(item.amount, lang)}
                        </span>
                      </div>
                    ))}
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-2 mt-2 flex justify-between text-sm font-semibold">
                      <span className="text-slate-700 dark:text-slate-300">{lang === 'th' ? 'รวม' : 'Total'}</span>
                      <span className="text-green-600 dark:text-green-400">{formatCurrency(result.totalDeduction, lang)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bracket Table */}
              <div className="overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    {t.bracketTitle}
                  </p>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-slate-50/50 dark:bg-slate-800/30">
                    <tr>
                      {[t.bracket, t.rate, t.taxableAmt, t.taxAmt].map((h) => (
                        <th key={h} className="px-3 py-2 text-left text-xs text-slate-500 dark:text-slate-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {result.breakdown.map((row) => (
                      <tr key={row.bracket}>
                        <td className="px-3 py-2.5 text-slate-600 dark:text-slate-400">{row.bracket}</td>
                        <td className="px-3 py-2.5 font-medium text-slate-800 dark:text-slate-200">{formatPercent(row.rate, 0)}</td>
                        <td className="px-3 py-2.5 text-slate-600 dark:text-slate-400">{formatNumber(row.taxableAmount, 0)}</td>
                        <td className="px-3 py-2.5 font-medium text-red-600 dark:text-red-400">{formatNumber(row.tax, 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 print:hidden">
                <ShareButton calculatorName="tax" params={{ income: sanitizeNumber(income) }} lang={lang} />
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

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}
