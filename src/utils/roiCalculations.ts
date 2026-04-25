export interface ROIInput {
  initialInvestment: number;
  monthlyInvestment: number;
  investmentYears: number;
  annualReturn: number;
  compoundingFrequency: 1 | 12 | 365;
  inflationAdjusted: boolean;
  inflationRate: number;
}

export interface ROIYearlyData {
  year: number;
  principal: number;
  returns: number;
  total: number;
  annualReturnAmount: number; // Profit earned in that specific year
}

export interface ROIResult {
  finalValue: number;
  totalInvested: number;
  totalReturns: number;
  yearlyData: ROIYearlyData[];
  crossoverYear: number | null;
  costOfWaiting5Years: number; // Extra monthly saving needed if starting 5 years late
  scenarios: {
    worst: number;
    average: number;
    best: number;
  };
}

export const defaultROIInput: ROIInput = {
  initialInvestment: 100000,
  monthlyInvestment: 5000,
  investmentYears: 20,
  annualReturn: 8,
  compoundingFrequency: 12,
  inflationAdjusted: false,
  inflationRate: 3,
};

export function calculateROI(input: ROIInput): ROIResult {
  const { 
    initialInvestment, 
    monthlyInvestment, 
    investmentYears, 
    compoundingFrequency, 
    inflationAdjusted,
    inflationRate
  } = input;

  // 1. Adjust return for inflation if enabled
  // Real Rate = (1 + nominal) / (1 + inflation) - 1
  const nominalRate = input.annualReturn / 100;
  const inflation = inflationRate / 100;
  const effectiveAnnualRate = inflationAdjusted 
    ? (1 + nominalRate) / (1 + inflation) - 1 
    : nominalRate;

  const ratePerPeriod = effectiveAnnualRate / compoundingFrequency;
  const totalPeriods = investmentYears * compoundingFrequency;
  const periodsPerYear = compoundingFrequency;

  const yearlyData: ROIYearlyData[] = [];
  let currentBalance = initialInvestment;
  let totalInvested = initialInvestment;
  let crossoverYear: number | null = null;

  for (let year = 1; year <= investmentYears; year++) {
    const startOfYearBalance = currentBalance;
    
    for (let p = 1; p <= periodsPerYear; p++) {
      currentBalance = (currentBalance + (monthlyInvestment * (12 / periodsPerYear))) * (1 + ratePerPeriod);
      totalInvested += (monthlyInvestment * (12 / periodsPerYear));
    }

    const annualProfit = currentBalance - startOfYearBalance - (monthlyInvestment * 12);
    
    // Crossover Point: When annual profit > annual contribution
    if (crossoverYear === null && annualProfit > (monthlyInvestment * 12)) {
      crossoverYear = year;
    }

    yearlyData.push({
      year,
      principal: Math.round(totalInvested),
      returns: Math.round(currentBalance - totalInvested),
      total: Math.round(currentBalance),
      annualReturnAmount: Math.round(annualProfit)
    });
  }

  // 2. Cost of Waiting (5 years late)
  // Target is 'currentBalance'. What monthly investment is needed if we only have (Years - 5)?
  let costOfWaiting5Years = 0;
  if (investmentYears > 5) {
    const remainingYears = investmentYears - 5;
    const remainingPeriods = remainingYears * compoundingFrequency;
    // FV = P(1+r)^n + PMT [ ((1+r)^n - 1) / r ]
    // PMT = (FV - P(1+r)^n) / [ ((1+r)^n - 1) / r ]
    const fv = currentBalance;
    const p = initialInvestment;
    const r = ratePerPeriod;
    const n = remainingPeriods;
    
    const futureValueOfInitial = p * Math.pow(1 + r, n);
    const neededFromPMT = fv - futureValueOfInitial;
    const pmtFactor = (Math.pow(1 + r, n) - 1) / r;
    const neededMonthly = neededFromPMT / pmtFactor / (12 / periodsPerYear);
    costOfWaiting5Years = Math.max(0, Math.round(neededMonthly - monthlyInvestment));
  }

  // 3. Scenarios
  const calcFinal = (rate: number) => {
    let bal = initialInvestment;
    const r = rate / compoundingFrequency;
    for (let i = 0; i < totalPeriods; i++) {
      bal = (bal + (monthlyInvestment * (12 / periodsPerYear))) * (1 + r);
    }
    return Math.round(bal);
  };

  return {
    finalValue: Math.round(currentBalance),
    totalInvested: Math.round(totalInvested),
    totalReturns: Math.round(currentBalance - totalInvested),
    yearlyData,
    crossoverYear,
    costOfWaiting5Years,
    scenarios: {
      worst: calcFinal(Math.max(0, effectiveAnnualRate - 0.04)), // Extreme downside (-4%)
      average: Math.round(currentBalance),
      best: calcFinal(effectiveAnnualRate + 0.03), // Upside (+3%)
    }
  };
}
