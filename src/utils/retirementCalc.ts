/**
 * Retirement Planning Calculator
 * วางแผนเกษียณ
 */

export interface RetirementInput {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  monthlyIncome: number;
  currentSavings: number;
  monthlySaving: number;
  monthlyExpenseAfterRetire: number;
  expectedReturn: number;
  postRetireReturn: number;
  inflationRate: number;
}

export interface YearProjection {
  age: number;
  savings: number;
  isRetired: boolean;
}

export interface RetirementResult {
  requiredAtRetirement: number;
  projectedAtRetirement: number;
  gap: number;
  gapStatus: 'surplus' | 'deficit' | 'exact';
  adjustedMonthlyExpense: number;
  yearsToRetire: number;
  yearsInRetirement: number;
  moneyLastsUntilAge: number | null;
  additionalMonthlySavingNeeded: number;
  yearlyProjection: YearProjection[];
}

export function calculateRetirement(input: RetirementInput): RetirementResult {
  const { currentAge, retirementAge, lifeExpectancy, currentSavings, monthlySaving,
    monthlyExpenseAfterRetire, expectedReturn, postRetireReturn, inflationRate } = input;

  const yearsToRetire = retirementAge - currentAge;
  const yearsInRetirement = lifeExpectancy - retirementAge;
  const adjustedMonthlyExpense = monthlyExpenseAfterRetire * Math.pow(1 + inflationRate / 100, yearsToRetire);
  const adjustedAnnualExpense = adjustedMonthlyExpense * 12;

  const realRate = (postRetireReturn - inflationRate) / 100;
  const requiredAtRetirement = realRate === 0
    ? adjustedAnnualExpense * yearsInRetirement
    : adjustedAnnualExpense * (1 - Math.pow(1 + realRate, -yearsInRetirement)) / realRate;

  const mr = expectedReturn / 100 / 12;
  const tm = yearsToRetire * 12;
  const projectedAtRetirement = mr === 0
    ? currentSavings + monthlySaving * tm
    : currentSavings * Math.pow(1 + mr, tm) + monthlySaving * (Math.pow(1 + mr, tm) - 1) / mr;

  const gap = projectedAtRetirement - requiredAtRetirement;
  const gapStatus = gap > 1000 ? 'surplus' : gap < -1000 ? 'deficit' : 'exact';

  let moneyLastsUntilAge: number | null = null;
  if (gapStatus === 'deficit') {
    let bal = projectedAtRetirement;
    let age = retirementAge;
    while (bal > 0 && age < 120) {
      bal = bal * (1 + postRetireReturn / 100) - adjustedAnnualExpense * Math.pow(1 + inflationRate / 100, age - retirementAge);
      age++;
    }
    moneyLastsUntilAge = age;
  }

  let additionalMonthlySavingNeeded = 0;
  if (gapStatus === 'deficit' && tm > 0) {
    const fvCurrent = currentSavings * Math.pow(1 + mr, tm);
    const needed = requiredAtRetirement - fvCurrent;
    additionalMonthlySavingNeeded = mr === 0
      ? Math.max(0, needed / tm - monthlySaving)
      : Math.max(0, needed * mr / (Math.pow(1 + mr, tm) - 1) - monthlySaving);
  }

  const yearlyProjection: YearProjection[] = [];
  let balance = currentSavings;
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    const isRetired = age >= retirementAge;
    yearlyProjection.push({ age, savings: Math.max(0, balance), isRetired });
    if (!isRetired) {
      balance = balance * (1 + expectedReturn / 100) + monthlySaving * 12;
    } else {
      const yrs = age - retirementAge;
      balance = balance * (1 + postRetireReturn / 100) - adjustedMonthlyExpense * Math.pow(1 + inflationRate / 100, yrs) * 12;
    }
  }

  return { requiredAtRetirement, projectedAtRetirement, gap, gapStatus, adjustedMonthlyExpense,
    yearsToRetire, yearsInRetirement, moneyLastsUntilAge, additionalMonthlySavingNeeded, yearlyProjection };
}

export const defaultRetirementInput: RetirementInput = {
  currentAge: 30, retirementAge: 60, lifeExpectancy: 85,
  monthlyIncome: 40000, currentSavings: 200000, monthlySaving: 8000,
  monthlyExpenseAfterRetire: 30000, expectedReturn: 7, postRetireReturn: 4, inflationRate: 2.5,
};
