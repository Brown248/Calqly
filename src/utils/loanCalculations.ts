export interface InterestStep {
  year: number;
  rate: number;
}

export interface LoanInput {
  type: 'home' | 'car' | 'personal';
  amount: number;
  years: number;
  months: number;
  interestRate: number; // Flat for car, Effective for home/personal
  isStepUp: boolean;
  steps: InterestStep[];
  extraPayment: number;
  yearlyExtraPayment: number;
  
  // Advanced Logic
  refinanceMode: boolean;
  refinanceYear: number;
  refinanceRate: number;
  stressTest: 'none' | 'interest-hike' | 'income-shock';
}

export interface AmortizationRow {
  month: number;
  year: number;
  payment: number;
  principal: number;
  interest: number;
  extraPayment: number;
  remainingBalance: number;
  totalInterest: number;
}

export interface ChartDataPoint {
  month: number;
  balanceNormal: number;
  balanceExtra: number;
  principalPaid: number;
  interestPaid: number;
}

export interface RefinanceResult {
  originalTotalInterest: number;
  newTotalInterest: number;
  netSavings: number;
  newMonthlyPayment: number;
}

export interface StressTestResult {
  impactMonthlyPayment: number;
  impactTotalInterest: number;
  warningMessage: string;
}

export interface LoanResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  totalDurationMonths: number;
  
  // Pain Number & Comparisons
  effectiveRateForCar: number | null; 
  
  // Magic of Extra Pay (Comparing Normal vs Extra)
  interestSaved: number;
  timeSavedMonths: number;
  
  // Schedules
  amortization: AmortizationRow[];
  chartData: ChartDataPoint[];

  // Analysis
  refinanceWarningYear: number | null;
  refinanceResult?: RefinanceResult;
  stressTestResult?: StressTestResult;
}

export const defaultLoanInput: LoanInput = {
  type: 'home',
  amount: 3000000,
  years: 30,
  months: 0,
  interestRate: 3.5, // Used if not step-up
  isStepUp: true,
  steps: [
    { year: 1, rate: 2.9 },
    { year: 2, rate: 2.9 },
    { year: 3, rate: 2.9 },
    { year: 4, rate: 5.75 } // MRR
  ],
  extraPayment: 3000,
  yearlyExtraPayment: 0,
  refinanceMode: false,
  refinanceYear: 3,
  refinanceRate: 3.0,
  stressTest: 'none',
};

// Calculate effective rate from flat rate (Excel RATE approximation using Newton-Raphson)
function calculateEffectiveRate(nper: number, pmt: number, pv: number): number {
  let guess = 0.1 / 12; // Initial guess 10% annual
  for (let i = 0; i < 20; i++) {
    const f = pv * guess * Math.pow(1 + guess, nper) / (Math.pow(1 + guess, nper) - 1) - pmt;
    const df = pv * (Math.pow(1 + guess, nper + 1) - (nper + 1) * guess - 1) / Math.pow(Math.pow(1 + guess, nper) - 1, 2);
    const nextGuess = guess - f / df;
    if (Math.abs(nextGuess - guess) < 1e-7) return nextGuess * 12 * 100;
    guess = nextGuess;
  }
  return guess * 12 * 100;
}

function runSimulation(
  input: LoanInput, 
  totalMonthsInput: number, 
  baseMonthlyPayment: number, 
  useExtra: boolean
): { 
  totalInterest: number, 
  monthsTaken: number, 
  amortization: AmortizationRow[], 
  chartData: Partial<ChartDataPoint>[] 
} {
  let remainingBalance = input.amount;
  let totalInterestPaid = 0;
  let currentMonth = 0;
  const amortization: AmortizationRow[] = [];
  const chartData: Partial<ChartDataPoint>[] = [];

  const getRate = (m: number) => {
    if (input.type === 'car') return input.interestRate; // Flat rate handling is different, but not used here for effective loop
    if (input.type === 'home' && input.isStepUp) {
      const year = Math.floor(m / 12) + 1;
      const step = [...input.steps].reverse().find(s => year >= s.year);
      return step ? step.rate : input.interestRate;
    }
    return input.interestRate;
  };

  while (remainingBalance > 0 && currentMonth < 1200) { // Max 100 years safeguard
    currentMonth++;
    const currentYear = Math.ceil(currentMonth / 12);
    
    // Daily interest simulation for personal loan, standard for home
    const annualRate = getRate(currentMonth - 1);
    const ratePerMonth = input.type === 'personal' 
      ? (annualRate / 100) * (30 / 365) // Personal is often calculated daily, avg 30 days
      : (annualRate / 100) / 12; // Home is monthly effective

    const interestMonth = remainingBalance * ratePerMonth;
    let extraThisMonth = 0;
    
    if (useExtra) {
      extraThisMonth += input.extraPayment;
      if (currentMonth % 12 === 0) {
        extraThisMonth += input.yearlyExtraPayment;
      }
    }

    let principalMonth = baseMonthlyPayment - interestMonth;
    
    if (input.type === 'personal') {
      // In personal loan, standard payment might cover less principal initially if terms are weird, 
      // but usually PMT is fixed.
    } else if (input.type === 'home' && input.isStepUp) {
      // Re-amortize slightly or use PMT for current rate? 
      // For true accuracy, banks recalculate PMT when rate changes.
      // To simplify, we keep baseMonthlyPayment fixed unless it doesn't cover interest.
      if (principalMonth < 0) {
        principalMonth = 0; // Negative amortization safeguard (very simplistic)
      }
    }

    let actualPrincipalPaid = principalMonth + extraThisMonth;

    if (actualPrincipalPaid > remainingBalance) {
      actualPrincipalPaid = remainingBalance;
    }

    const totalPaymentThisMonth = actualPrincipalPaid + interestMonth;
    remainingBalance -= actualPrincipalPaid;
    totalInterestPaid += interestMonth;

    // Save every month for true detailed schedule
    amortization.push({
      month: currentMonth,
      year: currentYear,
      payment: totalPaymentThisMonth,
      principal: actualPrincipalPaid,
      interest: interestMonth,
      extraPayment: extraThisMonth,
      remainingBalance: Math.max(0, remainingBalance),
      totalInterest: totalInterestPaid
    });
      
    // Save chart data point (we can sample every X months for performance, but 360 is fine for frontend)
    chartData.push({
      month: currentMonth,
      interestPaid: totalInterestPaid,
      principalPaid: input.amount - remainingBalance,
    });

    if (remainingBalance <= 0.01) break;
  }

  return { totalInterest: totalInterestPaid, monthsTaken: currentMonth, amortization, chartData };
}

function hasExtraPayments(input: LoanInput): boolean {
  return input.extraPayment > 0 || input.yearlyExtraPayment > 0;
}

export function calculateLoan(input: LoanInput): LoanResult {
  const totalMonthsInput = Math.max(1, (input.years * 12) + input.months);
  const amount = Math.max(0, input.amount);
  const { type } = input;
  
  if (type === 'car') {
    // Car Loan is Flat Rate
    const annualInterestAmount = amount * (input.interestRate / 100);
    const totalInterestNormal = annualInterestAmount * (totalMonthsInput / 12);
    const totalPaymentNormal = amount + totalInterestNormal;
    const monthlyPayment = totalPaymentNormal / totalMonthsInput;
    
    // Convert Flat to Effective Rate
    const effectiveRate = calculateEffectiveRate(totalMonthsInput, monthlyPayment, amount);

    // Car loans don't benefit from extra payments natively (usually you pay flat total anyway, unless refinancing)
    // We will show identical lines for extra payment to keep it honest.
    const amortization: AmortizationRow[] = [];
    const chartData: ChartDataPoint[] = [];
    let remBal = amount;
    let accInt = 0;

    for (let m = 1; m <= totalMonthsInput; m++) {
      const intPart = totalInterestNormal / totalMonthsInput;
      const prinPart = monthlyPayment - intPart;
      remBal -= prinPart;
      accInt += intPart;
      
      amortization.push({
        month: m, year: Math.ceil(m/12), payment: monthlyPayment, principal: prinPart, 
        interest: intPart, extraPayment: 0, remainingBalance: Math.max(0, remBal), totalInterest: accInt
      });
      chartData.push({ month: m, balanceNormal: Math.max(0, remBal), balanceExtra: Math.max(0, remBal), principalPaid: amount - remBal, interestPaid: accInt });
    }

    return {
      monthlyPayment,
      totalInterest: totalInterestNormal,
      totalPayment: totalPaymentNormal,
      totalDurationMonths: totalMonthsInput,
      effectiveRateForCar: effectiveRate,
      interestSaved: 0,
      timeSavedMonths: 0,
      amortization,
      chartData,
      refinanceWarningYear: null
    };
  }

  // Home or Personal Loan (Effective Rate)
  
  // Calculate Initial Base Monthly Payment (PMT)
  const initialAnnualRate = type === 'home' && input.isStepUp && input.steps.length > 0 
      ? input.steps[0].rate 
      : input.interestRate;
      
  const ratePerMonth = type === 'personal'
      ? (initialAnnualRate / 100) * (30/365)
      : (initialAnnualRate / 100) / 12;

  const baseMonthlyPayment = ratePerMonth === 0 
      ? amount / totalMonthsInput 
      : amount * ratePerMonth / (1 - Math.pow(1 + ratePerMonth, -totalMonthsInput));

  // Run Double Loop Simulation
  const normalSim = runSimulation(input, totalMonthsInput, baseMonthlyPayment, false);
  const extraSim = runSimulation(input, totalMonthsInput, baseMonthlyPayment, true);

  // Merge Chart Data
  const chartData: ChartDataPoint[] = [];
  const maxMonths = Math.max(normalSim.monthsTaken, extraSim.monthsTaken);
  
  for (let m = 1; m <= maxMonths; m++) {
    const norm = normalSim.chartData[m-1];
    const ext = extraSim.chartData[m-1];
    
    // Balance drops to 0 if finished early
    const balNormal = norm ? amount - norm.principalPaid! : 0;
    const balExtra = ext ? amount - ext.principalPaid! : 0;

    chartData.push({
      month: m,
      balanceNormal: balNormal,
      balanceExtra: balExtra,
      principalPaid: ext ? ext.principalPaid! : (norm ? norm.principalPaid! : amount),
      interestPaid: ext ? ext.interestPaid! : (norm ? norm.interestPaid! : normalSim.totalInterest),
    });
  }

  // Refinance Trigger Array finding
  let refinanceWarningYear = null;
  if (type === 'home' && input.isStepUp) {
    // Find the first jump in interest rate
    let previousRate = input.steps.length > 0 ? input.steps[0].rate : -1;
    for (let i = 1; i < input.steps.length; i++) {
        if (input.steps[i].rate > previousRate + 1.0) { // arbitrary threshold for "jump"
            refinanceWarningYear = input.steps[i].year - 1; // Warn in the year before the jump
            break;
        }
        previousRate = input.steps[i].rate;
    }
    // Default to year 3 if no steps provided but isStepUp is true
    if (refinanceWarningYear === null && input.steps.length > 0) {
      refinanceWarningYear = 3; 
    }
  }

  // Refinance Simulation
  let refinanceResult: RefinanceResult | undefined;
  if (input.refinanceMode && input.type === 'home') {
    const refStartMonth = input.refinanceYear * 12;
    const originalAmort = normalSim.amortization;
    
    // Find balance at refinance point
    const balanceAtRef = refStartMonth < originalAmort.length 
      ? originalAmort[refStartMonth - 1].remainingBalance 
      : 0;
      
    const monthsRemaining = Math.max(0, totalMonthsInput - refStartMonth);
    
    if (balanceAtRef > 0 && monthsRemaining > 0) {
      const refRatePerMonth = (input.refinanceRate / 100) / 12;
      const newMonthlyPayment = refRatePerMonth === 0
        ? balanceAtRef / monthsRemaining
        : balanceAtRef * refRatePerMonth / (1 - Math.pow(1 + refRatePerMonth, -monthsRemaining));
        
      // Interest on old plan from ref point to end
      const oldInterestRemaining = originalAmort
        .slice(refStartMonth)
        .reduce((sum, row) => sum + row.interest, 0);
        
      // Simplified interest calculation for new plan
      const newTotalPayment = newMonthlyPayment * monthsRemaining;
      const newInterestTotal = newTotalPayment - balanceAtRef;
      
      refinanceResult = {
        originalTotalInterest: normalSim.totalInterest,
        newTotalInterest: (normalSim.totalInterest - oldInterestRemaining) + newInterestTotal,
        netSavings: oldInterestRemaining - newInterestTotal,
        newMonthlyPayment
      };
    }
  }

  // Stress Test Simulation
  let stressTestResult: StressTestResult | undefined;
  if (input.stressTest === 'interest-hike') {
    const hikeRate = initialAnnualRate + 1.0;
    const hikeRatePerMonth = (hikeRate / 100) / 12;
    const impactMonthlyPayment = hikeRatePerMonth === 0 
      ? amount / totalMonthsInput 
      : amount * hikeRatePerMonth / (1 - Math.pow(1 + hikeRatePerMonth, -totalMonthsInput));
    
    stressTestResult = {
      impactMonthlyPayment,
      impactTotalInterest: (impactMonthlyPayment * totalMonthsInput) - amount,
      warningMessage: "If interest rates rise by 1%, your monthly payment will increase."
    };
  } else if (input.stressTest === 'income-shock') {
    stressTestResult = {
      impactMonthlyPayment: baseMonthlyPayment,
      impactTotalInterest: normalSim.totalInterest,
      warningMessage: "If you lose income for 3 months, interest will still accrue. Ensure you have 3-6 months of emergency fund."
    };
  }

  return {
    monthlyPayment: baseMonthlyPayment,
    totalInterest: hasExtraPayments(input) ? extraSim.totalInterest : normalSim.totalInterest,
    totalPayment: amount + (hasExtraPayments(input) ? extraSim.totalInterest : normalSim.totalInterest),
    totalDurationMonths: hasExtraPayments(input) ? extraSim.monthsTaken : normalSim.monthsTaken,
    effectiveRateForCar: null,
    interestSaved: Math.max(0, normalSim.totalInterest - extraSim.totalInterest),
    timeSavedMonths: Math.max(0, normalSim.monthsTaken - extraSim.monthsTaken),
    amortization: hasExtraPayments(input) ? extraSim.amortization : normalSim.amortization,
    chartData,
    refinanceWarningYear,
    refinanceResult,
    stressTestResult
  };
}
