import { calculateTax, defaultTaxInput, TaxInput } from './src/utils/taxCalculations';
import { calculateLoan, defaultLoanInput, LoanInput } from './src/utils/loanCalculations';
import { calculateRetirement, defaultRetirementInput } from './src/utils/retirementCalc';
import { calculateROI, defaultROIInput } from './src/utils/roiCalculations';
import { calculateRealCost, defaultRealCostInput } from './src/utils/realCostCalculations';
import { analyzeFinancialHealth } from './src/utils/financialIntelligence';
import { SavedProject } from './src/hooks/useFinancialStore';

console.log("=========================================");
console.log("🚀 STARTING EXHAUSTIVE DEEP DIVE TESTS 🚀");
console.log("=========================================\n");

let passed = 0;
let failed = 0;
let suites = 0;

function suite(name: string) {
  console.log(`\n\n🔹 [SUITE] ${name} 🔹`);
  console.log(`-----------------------------------------`);
  suites++;
}

function test(description: string, fn: () => void) {
  try {
    fn();
    console.log(`   ✅ PASS: ${description}`);
    passed++;
  } catch (e: any) {
    console.error(`   ❌ FAIL: ${description}`);
    console.error(`      -> ${e.message}`);
    failed++;
  }
}

function expect(actual: any) {
  return {
    toBe: (expected: any) => {
      if (actual !== expected) throw new Error(`Expected ${expected}, but got ${actual}`);
    },
    toBeGreaterThan: (expected: number) => {
      if (actual <= expected) throw new Error(`Expected > ${expected}, but got ${actual}`);
    },
    toBeLessThan: (expected: number) => {
      if (actual >= expected) throw new Error(`Expected < ${expected}, but got ${actual}`);
    },
    toBeCloseTo: (expected: number, delta: number = 0.01) => {
      if (Math.abs(actual - expected) > delta) throw new Error(`Expected ${expected} ±${delta}, but got ${actual}`);
    },
    toBeDefined: () => {
      if (actual === undefined || actual === null) throw new Error(`Expected defined value, but got ${actual}`);
    }
  };
}

// ==========================================
// 1. TAX CALCULATOR TESTS (Deep Dive)
// ==========================================
suite("Tax Calculator Logic & Edge Cases");

test("Tax brackets boundary calculation (150k limit)", () => {
  const t = calculateTax({ ...defaultTaxInput, incomeType: 'yearly', salary: 150000, bonus: 0, deductions: defaultTaxInput.deductions });
  expect(t.taxToPay).toBe(0);
});

test("Expense cap works correctly (max 100k)", () => {
  const t = calculateTax({ ...defaultTaxInput, incomeType: 'yearly', salary: 300000, bonus: 0 }); 
  expect(t.expenses).toBe(100000);
});

test("Life and Health Insurance caps (Max 100k total, 25k health)", () => {
  const t = calculateTax({
    ...defaultTaxInput,
    incomeType: 'yearly',
    salary: 500000,
    deductions: {
      ...defaultTaxInput.deductions,
      healthInsurance: 30000,
      lifeInsurance: 90000    
    }
  });
  expect(t.usage.lifeAndHealthTotal).toBe(115000);
  expect(t.usage.isLifeExceeded).toBe(true);
});

test("Group Investment Capped at 500k (SSF + RMF + PVD + Annuity)", () => {
  const t = calculateTax({
    ...defaultTaxInput,
    incomeType: 'yearly',
    salary: 2000000, 
    deductions: {
      ...defaultTaxInput.deductions,
      rmf: 300000,
      ssf: 200000,
      pvd: 100000,
      annuityInsurance: 100000,
      socialSecurity: 9000 // Ensure basic allowance is deterministic
    }
  });
  expect(t.usage.groupInvestmentTotal).toBe(700000);
  expect(t.usage.isGroupExceeded).toBe(true);
  
  // Net before donation = 2000000 - 100k(exp) - 69k(basic) - 500k(group) = 1,331,000
  expect(t.netIncome).toBe(1331000);
});

test("Donation limit logic (10% of base after all allowances)", () => {
  const t = calculateTax({
    ...defaultTaxInput,
    incomeType: 'yearly',
    salary: 1000000,
    deductions: {
      ...defaultTaxInput.deductions,
      socialSecurity: 0,
      donation1x: 1000000 
    }
  });
  expect(t.limits.donationMax).toBe(84000);
  expect(t.netIncome).toBe(840000 - 84000);
});

test("Donation 2x calculation", () => {
  const t = calculateTax({
    ...defaultTaxInput,
    incomeType: 'yearly',
    salary: 1000000, 
    deductions: {
      ...defaultTaxInput.deductions,
      socialSecurity: 0,
      donation2x: 20000 
    }
  });
  expect(t.netIncome).toBe(840000 - 40000);
});

test("Thai ESG and Easy E-Receipt limits", () => {
  const t = calculateTax({
    ...defaultTaxInput,
    incomeType: 'yearly',
    salary: 1000000, 
    deductions: {
      ...defaultTaxInput.deductions,
      thaiESG: 400000, 
      easyEReceipt: 60000 
    }
  });
  expect(t.limits.thaiESGMax).toBe(300000);
});

test("Married spouse no income deduction", () => {
  const t = calculateTax({
    ...defaultTaxInput,
    incomeType: 'yearly',
    salary: 500000,
    deductions: {
      ...defaultTaxInput.deductions,
      maritalStatus: 'married_no_income'
    }
  });
  expect(t.totalAllowances).toBeGreaterThan(120000);
});


// ==========================================
// 2. LOAN CALCULATOR TESTS (Deep Dive)
// ==========================================
suite("Loan Calculator Logic & Edge Cases");

test("Effective Rate Conversion using Newton-Raphson", () => {
  const l = calculateLoan({
    ...defaultLoanInput,
    type: 'car',
    amount: 500000,
    years: 4,
    interestRate: 2.5 
  });
  expect(l.effectiveRateForCar).toBeDefined();
  expect(l.effectiveRateForCar!).toBeGreaterThan(4.5);
  expect(l.effectiveRateForCar!).toBeLessThan(5.0);
});

test("Step-up Interest Rates for Home Loan", () => {
  const l = calculateLoan({
    ...defaultLoanInput,
    type: 'home',
    amount: 1000000,
    years: 5,
    isStepUp: true,
    extraPayment: 0,
    steps: [
      { year: 1, rate: 1.0 },
      { year: 2, rate: 5.0 }, 
    ]
  });
  const month1 = l.amortization.find(a => a.month === 1);
  const month13 = l.amortization.find(a => a.month === 13);
  expect(month1).toBeDefined();
  expect(month13).toBeDefined();
  expect(month13!.interest).toBeGreaterThan(month1!.interest * 2);
  expect(l.refinanceWarningYear).toBe(1);
});

test("Extra Payments shorten the loan duration significantly", () => {
  const normal = calculateLoan({
    ...defaultLoanInput,
    amount: 1000000,
    years: 10,
    interestRate: 5,
    isStepUp: false,
    extraPayment: 0
  });
  const extra = calculateLoan({
    ...defaultLoanInput,
    amount: 1000000,
    years: 10,
    interestRate: 5,
    isStepUp: false,
    extraPayment: 5000 
  });
  expect(extra.totalDurationMonths).toBeLessThan(normal.totalDurationMonths);
  expect(extra.interestSaved).toBeGreaterThan(0);
});

test("Refinance Simulation Math", () => {
  const l = calculateLoan({
    ...defaultLoanInput,
    amount: 2000000,
    years: 20,
    interestRate: 5, 
    isStepUp: false,
    refinanceMode: true,
    refinanceYear: 3,
    refinanceRate: 3 
  });
  expect(l.refinanceResult).toBeDefined();
  expect(l.refinanceResult!.netSavings).toBeGreaterThan(0);
  expect(l.refinanceResult!.newTotalInterest).toBeLessThan(l.refinanceResult!.originalTotalInterest);
});

test("Stress Test: Interest Hike (+1%)", () => {
  const l = calculateLoan({
    ...defaultLoanInput,
    amount: 1000000,
    years: 20,
    interestRate: 3,
    isStepUp: false,
    stressTest: 'interest-hike'
  });
  expect(l.stressTestResult).toBeDefined();
  expect(l.stressTestResult!.impactMonthlyPayment).toBeGreaterThan(l.monthlyPayment);
});


// ==========================================
// 3. RETIREMENT CALCULATOR TESTS
// ==========================================
suite("Retirement Calculator Rules (SWR & Inflation)");

test("Inflation compounding works correctly", () => {
  const r = calculateRetirement({
    ...defaultRetirementInput,
    currentAge: 30,
    retirementAge: 60, 
    monthlyExpensesToday: 50000,
    inflationRate: 3
  });
  expect(r.magicNumber).toBeGreaterThan(10000000); 
  expect(r.gap).toBeGreaterThan(0);
});

test("Safe Withdrawal Rate (SWR) logic", () => {
  const safe = calculateRetirement({
    ...defaultRetirementInput,
    currentAge: 60,
    retirementAge: 60,
    startingSavings: 20000000, 
    monthlyExpensesToday: 50000, 
    passiveIncomeRetire: 0,
    inflationRate: 0 
  });
  expect(safe.swr).toBeCloseTo(3);
  expect(safe.swrStatus).toBe("safe");

  const danger = calculateRetirement({
    ...defaultRetirementInput,
    currentAge: 60,
    retirementAge: 60,
    startingSavings: 10000000, 
    monthlyExpensesToday: 60000, 
    passiveIncomeRetire: 0,
    inflationRate: 0
  });
  expect(danger.swr).toBeCloseTo(7.2);
  expect(danger.swrStatus).toBe("danger");
});

test("Sufficient funds triggers isEnough", () => {
  const r = calculateRetirement({
    ...defaultRetirementInput,
    startingSavings: 50000000, 
    monthlyExpensesToday: 30000,
  });
  expect(r.isEnough).toBe(true);
  expect(r.gap).toBe(0);
});


// ==========================================
// 4. ROI CALCULATOR TESTS
// ==========================================
suite("ROI Calculator (Compounding Frequency)");

test("Monthly vs Annual Compounding difference", () => {
  const annual = calculateROI({
    ...defaultROIInput,
    initialInvestment: 100000,
    annualReturn: 10,
    investmentYears: 10,
    compoundingFrequency: 1,
    monthlyInvestment: 0,
    inflationAdjusted: false
  });
  expect(annual.finalValue).toBeCloseTo(259374.24, 1);

  const monthly = calculateROI({
    ...defaultROIInput,
    initialInvestment: 100000,
    annualReturn: 10,
    investmentYears: 10,
    compoundingFrequency: 12,
    monthlyInvestment: 0,
    inflationAdjusted: false
  });
  expect(monthly.finalValue).toBeGreaterThan(annual.finalValue);
  expect(monthly.finalValue).toBeCloseTo(270704.14, 1);
});

test("Crossover Year detection (Profit > Contribution)", () => {
  const r = calculateROI({
    ...defaultROIInput,
    initialInvestment: 0,
    monthlyInvestment: 10000,
    annualReturn: 10,
    investmentYears: 20
  });
  expect(r.crossoverYear).toBeDefined();
  expect(r.crossoverYear!).toBeGreaterThan(1);
  expect(r.crossoverYear!).toBeLessThan(20);
});


// ==========================================
// 5. REAL COST CALCULATOR TESTS
// ==========================================
suite("Real Cost (Opportunity Cost Matrix)");

test("Opportunity Cost impact is massive over time", () => {
  const cashNoOpp = calculateRealCost({
    ...defaultRealCostInput,
    price: 1000000,
    downPayment: 1000000,
    opportunityCostRate: 0,
    loanTermYears: 0,
    usageYears: 5,
    ongoingCostsAnnual: 0
  });
  expect(cashNoOpp.opportunityCost).toBe(0);

  const cashWithOpp = calculateRealCost({
    ...defaultRealCostInput,
    price: 1000000,
    downPayment: 1000000,
    opportunityCostRate: 10, 
    loanTermYears: 0,
    usageYears: 5,
    ongoingCostsAnnual: 0
  });
  // 1M * (1+0.1/12)^60 - 1M = 645,308.93
  expect(cashWithOpp.opportunityCost).toBeCloseTo(645308.93, 1);
  expect(cashWithOpp.realCost).toBeCloseTo(1000000 + 645308.93, 1);
});


// ==========================================
// 6. AI FINANCIAL INTELLIGENCE TESTS
// ==========================================
suite("AI Advisor Intelligence Engine");

test("High-interest debt warning vs investments", () => {
  const dummyProjects: SavedProject[] = [
    {
      id: '1', type: 'loan', name: 'Car Loan', timestamp: 0,
      input: { type: 'car', amount: 500000, interestRate: 8, years: 5 } as any, 
      result: {}
    },
    {
      id: '2', type: 'roi', name: 'Stocks', timestamp: 0,
      input: { annualReturn: 5 } as any,
      result: {}
    }
  ];
  const insights = analyzeFinancialHealth(dummyProjects, (k) => k);
  
  const investWarning = insights.find(i => i.category === 'investment' && i.type === 'warning');
  expect(investWarning).toBeDefined();
});

test("Tax optimization opportunity detection", () => {
  const dummyProjects: SavedProject[] = [
    {
      id: '1', type: 'tax', name: 'Tax 2024', timestamp: 0,
      input: {} as any,
      result: { taxToPay: 15000, effectiveRate: 12, brackets: [{rate: 15, taxableAmount: 50000}] } as any
    }
  ];
  const insights = analyzeFinancialHealth(dummyProjects, (k) => k);
  
  const taxOpp = insights.find(i => i.category === 'tax' && i.type === 'opportunity');
  expect(taxOpp).toBeDefined();
});

test("Refinance warning detection", () => {
  const dummyProjects: SavedProject[] = [
    {
      id: '1', type: 'loan', name: 'Home Loan', timestamp: 0,
      input: {} as any,
      result: { refinanceWarningYear: 2 } as any
    }
  ];
  const insights = analyzeFinancialHealth(dummyProjects, (k) => k);
  
  const refOpp = insights.find(i => i.title === 'refinance_title');
  expect(refOpp).toBeDefined();
});


console.log("\n=========================================");
console.log(`🎯 TOTAL RESULTS: ${passed} Passed, ${failed} Failed`);
console.log("=========================================\n");
if (failed > 0) process.exit(1);
