/**
 * ROI (Return on Investment) Calculator
 */

export interface ROIInput {
  initialInvestment: number;
  monthlyInvestment: number;
  annualReturn: number;
  investmentYears: number;
  taxRate?: number;
}

export interface ROIYearData {
  year: number;
  totalInvested: number;
  portfolioValue: number;
  returns: number;
}

export interface ROIResult {
  totalInvested: number;
  finalValue: number;
  totalReturns: number;
  totalReturnPercent: number;
  cagr: number;
  afterTax: number;
  yearlyData: ROIYearData[];
  bankComparison: number; // vs 1.5% bank deposit
}

export function calculateROI(input: ROIInput): ROIResult {
  const { initialInvestment, monthlyInvestment, annualReturn, investmentYears, taxRate = 0 } = input;
  const mr = annualReturn / 100 / 12;
  const tm = investmentYears * 12;

  const yearlyData: ROIYearData[] = [];
  let balance = initialInvestment;
  let totalInvested = initialInvestment;

  for (let year = 1; year <= investmentYears; year++) {
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + mr) + monthlyInvestment;
      totalInvested += monthlyInvestment;
    }
    yearlyData.push({
      year,
      totalInvested,
      portfolioValue: balance,
      returns: balance - totalInvested,
    });
  }

  const totalReturns = balance - totalInvested;
  const totalReturnPercent = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;
  const cagr = totalInvested > 0 ? (Math.pow(balance / initialInvestment, 1 / investmentYears) - 1) * 100 : 0;
  const taxAmount = totalReturns * (taxRate / 100);
  const afterTax = balance - taxAmount;

  // Bank comparison at 1.5%
  const bankMr = 0.015 / 12;
  let bankBalance = initialInvestment;
  for (let m = 0; m < tm; m++) {
    bankBalance = bankBalance * (1 + bankMr) + monthlyInvestment;
  }

  return { totalInvested, finalValue: balance, totalReturns, totalReturnPercent,
    cagr: isFinite(cagr) ? cagr : 0, afterTax, yearlyData, bankComparison: bankBalance };
}

export const defaultROIInput: ROIInput = {
  initialInvestment: 100000, monthlyInvestment: 5000,
  annualReturn: 8, investmentYears: 10, taxRate: 0,
};
