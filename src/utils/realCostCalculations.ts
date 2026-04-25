
export interface RealCostInput {
  price: number;
  downPayment: number;
  interestRate: number; // Annual interest rate for loan (%)
  loanTermYears: number;
  ongoingCostsAnnual: number;
  opportunityCostRate: number; // Annual investment return (%)
  usageYears: number;
}

export interface RealCostResult {
  totalOutofPocket: number;
  totalInterest: number;
  totalOngoingCosts: number;
  opportunityCost: number;
  realCost: number; // totalOutofPocket + opportunityCost
  monthlyLoanPayment: number;
  breakdown: {
    price: number;
    interest: number;
    ongoing: number;
    opportunity: number;
  };
}

/**
 * Calculates the "Real Cost" of an item including interest, ongoing costs, and opportunity cost.
 */
export function calculateRealCost(input: RealCostInput): RealCostResult {
  const {
    price,
    downPayment,
    interestRate,
    loanTermYears,
    ongoingCostsAnnual,
    opportunityCostRate,
    usageYears
  } = input;

  const loanAmount = Math.max(0, price - downPayment);
  let totalInterest = 0;
  let monthlyLoanPayment = 0;

  if (loanAmount > 0 && interestRate > 0) {
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTermYears * 12;
    
    if (monthlyRate > 0) {
      monthlyLoanPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                           (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    } else {
      monthlyLoanPayment = loanAmount / numberOfPayments;
    }
    
    totalInterest = (monthlyLoanPayment * numberOfPayments) - loanAmount;
  } else if (loanAmount > 0) {
    monthlyLoanPayment = loanAmount / (loanTermYears * 12 || 1);
    totalInterest = 0;
  }

  const totalOngoingCosts = ongoingCostsAnnual * usageYears;
  const totalOutofPocket = price + totalInterest + totalOngoingCosts;

  // Opportunity Cost Calculation
  // We assume the alternative is investing:
  // 1. The initial down payment
  // 2. The monthly loan payments (during loan term)
  // 3. The monthly ongoing costs
  
  const annualOppRate = opportunityCostRate / 100;
  const monthlyOppRate = annualOppRate / 12;

  // FV of Down Payment
  const fvDownPayment = downPayment * Math.pow(1 + monthlyOppRate, usageYears * 12);
  
  // FV of Monthly Loan Payments
  let fvLoanPayments = 0;
  const loanMonths = loanTermYears * 12;
  const totalMonths = usageYears * 12;
  
  if (monthlyOppRate > 0) {
    // If loan term is shorter than usage years, the money is already "spent" and continues to grow in FV terms
    // But wait, the opportunity cost is about what ELSE you could have done with the money you spent.
    // If you spend $P at month M, its FV at month T is P * (1+r)^(T-M).
    
    for (let m = 1; m <= loanMonths; m++) {
      if (m <= totalMonths) {
        fvLoanPayments += monthlyLoanPayment * Math.pow(1 + monthlyOppRate, totalMonths - m);
      }
    }
    // If usageYears > loanTermYears, the loan payments made in the first few years 
    // are already gone. They don't accrue more "opportunity cost" relative to the price? 
    // No, every dollar spent is a dollar that could have been invested until the end of 'usageYears'.
  } else {
    fvLoanPayments = monthlyLoanPayment * Math.min(loanMonths, totalMonths);
  }

  // FV of Ongoing Costs (assumed monthly)
  let fvOngoingCosts = 0;
  const monthlyOngoing = ongoingCostsAnnual / 12;
  if (monthlyOppRate > 0) {
    for (let m = 1; m <= totalMonths; m++) {
      fvOngoingCosts += monthlyOngoing * Math.pow(1 + monthlyOppRate, totalMonths - m);
    }
  } else {
    fvOngoingCosts = monthlyOngoing * totalMonths;
  }

  const totalFutureValue = fvDownPayment + fvLoanPayments + fvOngoingCosts;
  const opportunityCost = Math.max(0, totalFutureValue - totalOutofPocket);

  return {
    totalOutofPocket,
    totalInterest,
    totalOngoingCosts,
    opportunityCost,
    realCost: totalFutureValue,
    monthlyLoanPayment,
    breakdown: {
      price,
      interest: totalInterest,
      ongoing: totalOngoingCosts,
      opportunity: opportunityCost
    }
  };
}

export const defaultRealCostInput: RealCostInput = {
  price: 1000000,
  downPayment: 200000,
  interestRate: 2.5,
  loanTermYears: 5,
  ongoingCostsAnnual: 30000,
  opportunityCostRate: 5,
  usageYears: 5,
};
