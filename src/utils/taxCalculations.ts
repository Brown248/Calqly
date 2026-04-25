export interface TaxDeduction {
  maritalStatus: 'single' | 'married_no_income' | 'married_with_income';
  hasChildren: boolean;
  childrenPre61: number;
  childrenPost61: number;
  careParents: boolean;
  parentsCareCount: number;
  socialSecurity: number;
  lifeInsurance: number;
  healthInsurance: number;
  annuityInsurance: number;
  pvd: number; // Provident Fund (Manual if rate is 0)
  ssf: number;
  rmf: number;
  thaiESG: number;
  homeLoanInterest: number;
  easyEReceipt: number;
  donation2x: number;
  donation1x: number;
}

export interface TaxInput {
  incomeType: 'monthly' | 'yearly';
  salary: number;
  bonus: number;
  freelance: number;
  otherIncome: number;
  withholdingTax: number;
  pvdRate: number; // %
  deductions: TaxDeduction;
}

export interface TaxBracketResult {
  range: string;
  rate: number;
  taxableAmount: number;
  tax: number;
  limit: number;
}

export interface TaxResult {
  totalIncome: number;
  expenses: number;
  totalAllowances: number;
  netIncome: number;
  grossTax: number;
  taxToPay: number; 
  effectiveRate: number;
  marginalRate: number;
  brackets: TaxBracketResult[];
  
  // Accountants Insights (เพดานสิทธิ)
  limits: {
    ssfMax: number;
    rmfMax: number;
    thaiESGMax: number;
    groupMax: number;
    donationMax: number;
    lifeAndHealthMax: number;
  };
  
  // ยอดที่ถูก Cap จริง (เพื่อโชว์ Error/Warning)
  usage: {
    lifeAndHealthTotal: number;
    isLifeExceeded: boolean;
    isGroupExceeded: boolean;
    isDonationExceeded: boolean;
    groupInvestmentTotal: number;
  };
}

export const defaultTaxInput: TaxInput = {
  incomeType: 'monthly',
  salary: 50000,
  bonus: 0,
  freelance: 0,
  otherIncome: 0,
  withholdingTax: 0,
  pvdRate: 0,
  deductions: {
    maritalStatus: 'single',
    hasChildren: false,
    childrenPre61: 0,
    childrenPost61: 0,
    careParents: false,
    parentsCareCount: 0,
    socialSecurity: 9000,
    lifeInsurance: 0,
    healthInsurance: 0,
    annuityInsurance: 0,
    pvd: 0,
    ssf: 0,
    rmf: 0,
    thaiESG: 0,
    homeLoanInterest: 0,
    easyEReceipt: 0,
    donation2x: 0,
    donation1x: 0,
  }
};

export function calculateTax(input: TaxInput): TaxResult {
  const annualSalary = input.incomeType === 'monthly' ? input.salary * 12 : input.salary;
  const totalIncome = annualSalary + input.bonus + input.freelance + input.otherIncome;

  // 1. ค่าใช้จ่าย (Expenses) - 40(1)+40(2) 50% max 100k
  const income1And2 = annualSalary + input.bonus + input.freelance;
  const expenses = Math.min(income1And2 * 0.5, 100000);

  // 2. ลดหย่อนพื้นฐาน
  const personal = 60000;
  const spouse = input.deductions.maritalStatus === 'married_no_income' ? 60000 : 0;
  const children = (input.deductions.childrenPre61 * 30000) + (input.deductions.childrenPost61 * 60000);
  const parents = input.deductions.parentsCareCount * 30000;
  const socialSecurity = Math.min(input.deductions.socialSecurity, 9000);
  const basicAllowances = personal + spouse + children + parents + socialSecurity;

  // 3. ประกัน (Life + Health max 100k, Health max 25k)
  const healthMax = 25000;
  const lifeAndHealthMax = 100000;
  const healthActual = Math.min(input.deductions.healthInsurance, healthMax);
  const lifeAndHealthTotal = input.deductions.lifeInsurance + healthActual;
  const lifeAndHealthCapped = Math.min(lifeAndHealthTotal, lifeAndHealthMax);

  // 4. กลุ่มเกษียณ (SSF, RMF, PVD, บำนาญ - เพดานรวม 500k)
  const ssfLimit = Math.min(totalIncome * 0.3, 200000);
  const rmfLimit = Math.min(totalIncome * 0.3, 500000);
  const annuityLimit = Math.min(totalIncome * 0.15, 200000);
  const pvdLimit = Math.min(totalIncome * 0.15, 500000);

  const actualPvd = Math.min((annualSalary * (input.pvdRate / 100)) || input.deductions.pvd, pvdLimit);
  const actualSSF = Math.min(input.deductions.ssf, ssfLimit);
  const actualRMF = Math.min(input.deductions.rmf, rmfLimit);
  const actualAnnuity = Math.min(input.deductions.annuityInsurance, annuityLimit);

  const groupInvestmentTotal = actualPvd + actualSSF + actualRMF + actualAnnuity;
  const groupInvestmentCapped = Math.min(groupInvestmentTotal, 500000);

  // 5. พิเศษ & กระตุ้น
  const thaiESGMax = Math.min(totalIncome * 0.3, 300000);
  const actualThaiESG = Math.min(input.deductions.thaiESG, thaiESGMax);
  const actualHomeLoan = Math.min(input.deductions.homeLoanInterest, 100000);
  const actualEasy = Math.min(input.deductions.easyEReceipt, 50000);

  // 6. บริจาค (ต้องคำนวณหลังหักทุกอย่างแล้ว)
  const totalAllowancesBeforeDonation = basicAllowances + lifeAndHealthCapped + groupInvestmentCapped + actualThaiESG + actualHomeLoan + actualEasy;
  const baseBeforeDonation = Math.max(totalIncome - expenses - totalAllowancesBeforeDonation, 0);
  const donationLimit = baseBeforeDonation * 0.1;

  const actualDonation2x = Math.min(input.deductions.donation2x * 2, donationLimit);
  const actualDonation1x = Math.min(input.deductions.donation1x, Math.max(0, donationLimit - actualDonation2x));
  const totalDonation = actualDonation2x + actualDonation1x;

  const netIncome = Math.max(baseBeforeDonation - totalDonation, 0);

  // 7. ขั้นบันไดภาษี
  const brackets = [
    { limit: 150000, rate: 0, range: "0 - 150,000" },
    { limit: 300000, rate: 5, range: "150,001 - 300,000" },
    { limit: 500000, rate: 10, range: "300,001 - 500,000" },
    { limit: 750000, rate: 15, range: "500,001 - 750,000" },
    { limit: 1000000, rate: 20, range: "750,001 - 1,000,000" },
    { limit: 2000000, rate: 25, range: "1,000,001 - 2,000,000" },
    { limit: 5000000, rate: 30, range: "2,000,001 - 5,000,000" },
    { limit: Infinity, rate: 35, range: "> 5,000,000" },
  ];

  let remainingIncome = netIncome;
  let grossTax = 0;
  let previousLimit = 0;
  let marginalRate = 0;
  const bracketResults: TaxBracketResult[] = [];

  for (const b of brackets) {
    const size = b.limit - previousLimit;
    const taxableInBracket = Math.min(remainingIncome, size);
    const taxInBracket = taxableInBracket * (b.rate / 100);
    if (taxableInBracket > 0) marginalRate = b.rate;

    bracketResults.push({
      range: b.range,
      rate: b.rate,
      taxableAmount: taxableInBracket,
      tax: taxInBracket,
      limit: b.limit
    });

    grossTax += taxInBracket;
    remainingIncome -= taxableInBracket;
    previousLimit = b.limit;
    if (remainingIncome <= 0) break;
  }

  return {
    totalIncome,
    expenses,
    totalAllowances: totalAllowancesBeforeDonation + totalDonation,
    netIncome,
    grossTax,
    taxToPay: grossTax - input.withholdingTax,
    effectiveRate: totalIncome > 0 ? (grossTax / totalIncome) * 100 : 0,
    marginalRate,
    brackets: bracketResults,
    limits: {
      ssfMax: ssfLimit,
      rmfMax: rmfLimit,
      thaiESGMax,
      groupMax: 500000,
      donationMax: donationLimit,
      lifeAndHealthMax: 100000
    },
    usage: {
      lifeAndHealthTotal,
      isLifeExceeded: lifeAndHealthTotal > 100000,
      groupInvestmentTotal,
      isGroupExceeded: groupInvestmentTotal > 500000,
      isDonationExceeded: (input.deductions.donation2x * 2 + input.deductions.donation1x) > donationLimit
    }
  };
}
