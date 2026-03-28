// lib/calculators.ts
// Logic การคำนวณทั้งหมด — แยกออกจาก UI ชัดเจน

// ============================================================
// LOAN CALCULATOR (สินเชื่อ / ผ่อน)
// ============================================================

export interface LoanInput {
  principal: number     // เงินต้น (บาท)
  annualRate: number    // ดอกเบี้ยต่อปี (%)
  termMonths: number    // ระยะเวลา (เดือน)
}

export interface LoanResult {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  schedule: AmortizationRow[]
}

export interface AmortizationRow {
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
}

export function calcLoan(input: LoanInput): LoanResult {
  const { principal, annualRate, termMonths } = input
  const monthlyRate = annualRate / 100 / 12

  let monthlyPayment: number
  if (monthlyRate === 0) {
    monthlyPayment = principal / termMonths
  } else {
    monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1)
  }

  const schedule: AmortizationRow[] = []
  let balance = principal

  for (let month = 1; month <= termMonths; month++) {
    const interest = balance * monthlyRate
    const principalPaid = monthlyPayment - interest
    balance = Math.max(0, balance - principalPaid)

    schedule.push({
      month,
      payment: monthlyPayment,
      principal: principalPaid,
      interest,
      balance,
    })
  }

  const totalPayment = monthlyPayment * termMonths
  const totalInterest = totalPayment - principal

  return { monthlyPayment, totalPayment, totalInterest, schedule }
}

// ============================================================
// THAI INCOME TAX CALCULATOR (ภาษีเงินได้บุคคลธรรมดา)
// ============================================================

export interface TaxInput {
  income: number           // รายได้ต่อปี (บาท)
  incomeType: 'employee' | 'freelance' | 'business'
  hasSpouse: boolean       // มีคู่สมรส (ลดหย่อน 60,000)
  children: number         // จำนวนบุตร (คนละ 30,000)
  parentCount: number      // จำนวนพ่อแม่ที่ดูแล (คนละ 30,000)
  lifeInsurance: number    // ประกันชีวิต (สูงสุด 100,000)
  healthInsurance: number  // ประกันสุขภาพ (สูงสุด 25,000)
  providentFund: number    // กองทุนสำรองเลี้ยงชีพ (สูงสุด 15% ของรายได้ หรือ 500,000)
  rmf: number              // กองทุน RMF (สูงสุด 30% ของรายได้ หรือ 500,000)
  ssf: number              // กองทุน SSF (สูงสุด 30% ของรายได้ หรือ 200,000)
  donation: number         // เงินบริจาค (ไม่เกิน 10% ของรายได้สุทธิ)
}

export interface TaxResult {
  netIncome: number
  totalDeduction: number
  taxableIncome: number
  tax: number
  effectiveRate: number
  breakdown: TaxBracketRow[]
  deductionBreakdown: DeductionItem[]
}

export interface TaxBracketRow {
  bracket: string
  rate: number
  taxableAmount: number
  tax: number
}

export interface DeductionItem {
  label: string
  amount: number
}

// อัตราภาษีเงินได้บุคคลธรรมดา ปี 2566
const TAX_BRACKETS = [
  { min: 0,        max: 150_000,   rate: 0   },
  { min: 150_001,  max: 300_000,   rate: 0.05 },
  { min: 300_001,  max: 500_000,   rate: 0.10 },
  { min: 500_001,  max: 750_000,   rate: 0.15 },
  { min: 750_001,  max: 1_000_000, rate: 0.20 },
  { min: 1_000_001,max: 2_000_000, rate: 0.25 },
  { min: 2_000_001,max: 5_000_000, rate: 0.30 },
  { min: 5_000_001,max: Infinity,  rate: 0.35 },
]

export function calcThaiTax(input: TaxInput): TaxResult {
  const {
    income, incomeType, hasSpouse, children, parentCount,
    lifeInsurance, healthInsurance, providentFund, rmf, ssf, donation,
  } = input

  // 1. ค่าใช้จ่าย
  let expenseDeduction: number
  if (incomeType === 'employee') {
    expenseDeduction = Math.min(income * 0.5, 100_000)
  } else if (incomeType === 'freelance') {
    expenseDeduction = Math.min(income * 0.3, income)
  } else {
    expenseDeduction = Math.min(income * 0.6, income)
  }

  // 2. ค่าลดหย่อนส่วนตัว
  const personalDeduction = 60_000
  const spouseDeduction = hasSpouse ? 60_000 : 0
  const childrenDeduction = Math.min(children, 3) * 30_000
  const parentDeduction = Math.min(parentCount, 4) * 30_000

  // 3. ค่าลดหย่อนการลงทุน/ประกัน
  const lifeInsuranceCapped = Math.min(lifeInsurance, 100_000)
  const healthInsuranceCapped = Math.min(healthInsurance, 25_000)
  const pvfCapped = Math.min(providentFund, income * 0.15, 500_000)
  const rmfCapped = Math.min(rmf, income * 0.30, 500_000)
  const ssfCapped = Math.min(ssf, income * 0.30, 200_000)

  const netBeforeDonation =
    income - expenseDeduction - personalDeduction - spouseDeduction -
    childrenDeduction - parentDeduction - lifeInsuranceCapped -
    healthInsuranceCapped - pvfCapped - rmfCapped - ssfCapped

  const donationCapped = Math.min(donation, netBeforeDonation * 0.10)
  const taxableIncome = Math.max(0, netBeforeDonation - donationCapped)
  const totalDeduction = income - taxableIncome

  // 4. คำนวณภาษีตาม brackets
  const breakdown: TaxBracketRow[] = []
  let remainingIncome = taxableIncome
  let totalTax = 0

  for (const bracket of TAX_BRACKETS) {
    if (remainingIncome <= 0) break
    const bracketSize = bracket.max === Infinity
      ? remainingIncome
      : Math.min(bracket.max - bracket.min + 1, remainingIncome)
    const taxableInBracket = Math.min(bracketSize, remainingIncome)
    const taxInBracket = taxableInBracket * bracket.rate

    if (taxableInBracket > 0) {
      breakdown.push({
        bracket: bracket.max === Infinity
          ? `${(bracket.min / 1000000).toFixed(1)}M+`
          : `${(bracket.min / 1000).toFixed(0)}K - ${(bracket.max / 1000).toFixed(0)}K`,
        rate: bracket.rate * 100,
        taxableAmount: taxableInBracket,
        tax: taxInBracket,
      })
    }

    totalTax += taxInBracket
    remainingIncome -= taxableInBracket
  }

  const deductionBreakdown: DeductionItem[] = [
    { label: 'ค่าใช้จ่าย', amount: expenseDeduction },
    { label: 'ส่วนตัว', amount: personalDeduction },
    ...(hasSpouse ? [{ label: 'คู่สมรส', amount: spouseDeduction }] : []),
    ...(children > 0 ? [{ label: `บุตร (${children} คน)`, amount: childrenDeduction }] : []),
    ...(parentCount > 0 ? [{ label: `พ่อแม่ (${parentCount} คน)`, amount: parentDeduction }] : []),
    ...(lifeInsurance > 0 ? [{ label: 'ประกันชีวิต', amount: lifeInsuranceCapped }] : []),
    ...(healthInsurance > 0 ? [{ label: 'ประกันสุขภาพ', amount: healthInsuranceCapped }] : []),
    ...(providentFund > 0 ? [{ label: 'กองทุนสำรองฯ', amount: pvfCapped }] : []),
    ...(rmf > 0 ? [{ label: 'RMF', amount: rmfCapped }] : []),
    ...(ssf > 0 ? [{ label: 'SSF', amount: ssfCapped }] : []),
    ...(donation > 0 ? [{ label: 'เงินบริจาค', amount: donationCapped }] : []),
  ]

  return {
    netIncome: income,
    totalDeduction,
    taxableIncome,
    tax: totalTax,
    effectiveRate: income > 0 ? (totalTax / income) * 100 : 0,
    breakdown,
    deductionBreakdown,
  }
}

// ============================================================
// COMPOUND INTEREST / RETIREMENT CALCULATOR
// ============================================================

export interface RetirementInput {
  currentAge: number
  retirementAge: number
  currentSavings: number   // เงินที่มีอยู่แล้ว
  monthlyContribution: number
  annualReturn: number     // ผลตอบแทนต่อปี (%)
  inflationRate: number    // อัตราเงินเฟ้อ (%)
  monthlyExpenseAtRetirement: number  // ค่าใช้จ่ายต่อเดือนหลังเกษียณ (ราคาปัจจุบัน)
  lifeExpectancy: number   // อายุขัย
}

export interface RetirementResult {
  yearsToRetirement: number
  totalSavingsAtRetirement: number
  inflationAdjustedExpense: number
  totalNeeded: number
  monthsCanSustain: number
  isEnough: boolean
  yearlyProjection: YearlyProjection[]
}

export interface YearlyProjection {
  age: number
  savings: number
  totalContributed: number
}

export function calcRetirement(input: RetirementInput): RetirementResult {
  const {
    currentAge, retirementAge, currentSavings, monthlyContribution,
    annualReturn, inflationRate, monthlyExpenseAtRetirement, lifeExpectancy,
  } = input

  const yearsToRetirement = retirementAge - currentAge
  const monthlyReturn = annualReturn / 100 / 12

  // คำนวณเงินออมที่เวลาเกษียณ (FV)
  // FV = PV(1+r)^n + PMT × [(1+r)^n - 1] / r
  const n = yearsToRetirement * 12
  const pvGrowth = currentSavings * Math.pow(1 + monthlyReturn, n)
  const contributionGrowth =
    monthlyReturn > 0
      ? monthlyContribution * ((Math.pow(1 + monthlyReturn, n) - 1) / monthlyReturn)
      : monthlyContribution * n

  const totalSavingsAtRetirement = pvGrowth + contributionGrowth

  // ค่าใช้จ่ายหลังเกษียณ ปรับด้วยเงินเฟ้อ
  const inflationAdjustedMonthly =
    monthlyExpenseAtRetirement * Math.pow(1 + inflationRate / 100, yearsToRetirement)

  const retirementYears = lifeExpectancy - retirementAge
  const totalNeeded = inflationAdjustedMonthly * 12 * retirementYears

  // กี่เดือนที่เงินพอ (ลดลงตาม withdrawal rate)
  const monthsCanSustain =
    monthlyReturn > 0
      ? Math.log(1 - (totalSavingsAtRetirement * monthlyReturn) / inflationAdjustedMonthly) /
        Math.log(1 + monthlyReturn) * -1
      : totalSavingsAtRetirement / inflationAdjustedMonthly

  // Yearly projection
  const yearlyProjection: YearlyProjection[] = []
  let runningBalance = currentSavings
  let totalContributed = currentSavings

  for (let year = 0; year <= yearsToRetirement; year++) {
    yearlyProjection.push({
      age: currentAge + year,
      savings: runningBalance,
      totalContributed,
    })

    if (year < yearsToRetirement) {
      runningBalance =
        runningBalance * Math.pow(1 + monthlyReturn, 12) +
        monthlyContribution * ((Math.pow(1 + monthlyReturn, 12) - 1) / monthlyReturn)
      totalContributed += monthlyContribution * 12
    }
  }

  return {
    yearsToRetirement,
    totalSavingsAtRetirement,
    inflationAdjustedExpense: inflationAdjustedMonthly,
    totalNeeded,
    monthsCanSustain,
    isEnough: totalSavingsAtRetirement >= totalNeeded,
    yearlyProjection,
  }
}

// ============================================================
// CALCULATOR METADATA (สำหรับ listing page)
// ============================================================

export interface CalculatorMeta {
  slug: string
  title: { th: string; en: string }
  description: { th: string; en: string }
  category: 'loan' | 'tax' | 'investment' | 'insurance'
  keywords: string[]
  relatedArticles: string[]
}

export const CALCULATORS: CalculatorMeta[] = [
  {
    slug: 'loan',
    title: { th: 'คำนวณสินเชื่อ / ผ่อนชำระ', en: 'Loan Calculator' },
    description: {
      th: 'คำนวณยอดผ่อนต่อเดือน ดอกเบี้ย และตารางผ่อนชำระครบถ้วน',
      en: 'Calculate monthly payments, total interest, and full amortization schedule',
    },
    category: 'loan',
    keywords: ['ผ่อนบ้าน', 'สินเชื่อ', 'ดอกเบี้ย', 'loan calculator'],
    relatedArticles: ['how-to-choose-mortgage', 'refinancing-guide'],
  },
  {
    slug: 'tax',
    title: { th: 'คำนวณภาษีเงินได้บุคคลธรรมดา', en: 'Thai Income Tax Calculator' },
    description: {
      th: 'คำนวณภาษีพร้อมค่าลดหย่อนทุกรายการ ปีภาษี 2566',
      en: 'Calculate Thai personal income tax with all deductions, tax year 2023',
    },
    category: 'tax',
    keywords: ['ภาษีเงินได้', 'ลดหย่อนภาษี', 'ภ.ง.ด.90', 'income tax'],
    relatedArticles: ['tax-deduction-guide', 'rmf-ssf-explained'],
  },
  {
    slug: 'retirement',
    title: { th: 'วางแผนเกษียณ', en: 'Retirement Planner' },
    description: {
      th: 'คำนวณเงินที่ต้องออมเพื่อเกษียณสุขสบาย พร้อมกราฟคาดการณ์',
      en: 'Calculate how much you need to save for a comfortable retirement',
    },
    category: 'investment',
    keywords: ['เกษียณ', 'วางแผนการเงิน', 'retirement planning', 'เงินออม'],
    relatedArticles: ['retirement-planning-101', 'provident-fund-guide'],
  },
]
