export interface RetirementInput {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  startingSavings: number;
  currentMonthlySaving: number;
  monthlyExpensesToday: number;
  dreamFund: number;
  passiveIncomeRetire: number;
  hasHealthInsurance: boolean;
  healthBufferAmount: number;
  inflationRate: number;
  returnPreRetire: number;
  returnPostRetire: number;
}

export interface RetirementResult {
  magicNumber: number;
  projectedWealth: number;
  gap: number;
  isEnough: boolean;
  additionalMonthlySavingNeeded: number;
  firstYearWithdrawal: number;
  swr: number;
  swrStatus: 'safe' | 'warning' | 'danger';
  yearlyProjection: {
    age: number;
    savings: number;
    isDepleted: boolean;
    phase: string;
  }[];
}

export const defaultRetirementInput: RetirementInput = {
  currentAge: 30,
  retirementAge: 60,
  lifeExpectancy: 90,
  startingSavings: 500000,
  currentMonthlySaving: 5000,
  monthlyExpensesToday: 30000,
  dreamFund: 500000,
  passiveIncomeRetire: 5000,
  hasHealthInsurance: false,
  healthBufferAmount: 2000000,
  inflationRate: 3,
  returnPreRetire: 7,
  returnPostRetire: 3,
};

export function calculateRetirement(input: RetirementInput): RetirementResult {
  const yearsToRetire = Math.max(0, input.retirementAge - input.currentAge);
  const inflation = input.inflationRate / 100;
  const rPre = input.returnPreRetire / 100;
  const rPost = input.returnPostRetire / 100;

  // Calculate Magic Number (Working backwards from life expectancy)
  let magicNumber = 0;
  for (let age = input.lifeExpectancy; age > input.retirementAge; age--) {
    const yearsFromToday = age - input.currentAge;
    const inflatedMonthlyExpense = input.monthlyExpensesToday * Math.pow(1 + inflation, yearsFromToday);
    
    // 3-Phase Logic
    let phaseMultiplier = 1.0; // Go-Go
    if (age >= input.retirementAge + 15) phaseMultiplier = 0.6; // No-Go
    else if (age >= input.retirementAge + 5) phaseMultiplier = 0.8; // Slow-Go

    const adjustedExpense = inflatedMonthlyExpense * phaseMultiplier;
    const netYearlyWithdrawal = Math.max(0, adjustedExpense - input.passiveIncomeRetire) * 12;

    magicNumber = (magicNumber + netYearlyWithdrawal) / (1 + rPost);
  }

  const healthBuffer = input.hasHealthInsurance ? 0 : input.healthBufferAmount;
  magicNumber += input.dreamFund + healthBuffer;

  // Calculate Projected Wealth at Retirement
  let projectedWealth = input.startingSavings;
  for (let age = input.currentAge; age < input.retirementAge; age++) {
    projectedWealth = (projectedWealth * (1 + rPre)) + (input.currentMonthlySaving * 12);
  }

  const gap = Math.max(0, magicNumber - projectedWealth);
  const isEnough = projectedWealth >= magicNumber;

  // Additional Monthly Saving Needed
  let additionalMonthlySavingNeeded = 0;
  if (gap > 0 && yearsToRetire > 0) {
    const monthlyRPre = Math.pow(1 + rPre, 1 / 12) - 1;
    const totalMonths = yearsToRetire * 12;
    if (monthlyRPre === 0) {
      additionalMonthlySavingNeeded = gap / totalMonths;
    } else {
      additionalMonthlySavingNeeded = gap / ((Math.pow(1 + monthlyRPre, totalMonths) - 1) / monthlyRPre);
    }
  }

  // Safe Withdrawal Rate (SWR)
  const firstYearInflatedExpense = input.monthlyExpensesToday * Math.pow(1 + inflation, yearsToRetire);
  const firstYearWithdrawal = Math.max(0, firstYearInflatedExpense - input.passiveIncomeRetire) * 12;
  
  let swr = 0;
  if (projectedWealth > 0) {
    swr = (firstYearWithdrawal / projectedWealth) * 100;
  } else {
    swr = 100; // Infinity essentially
  }

  let swrStatus: 'safe' | 'warning' | 'danger' = 'safe';
  if (swr > 6) swrStatus = 'danger';
  else if (swr > 4) swrStatus = 'warning';

  // Yearly Projection (Forward simulation)
  const yearlyProjection = [];
  let currentBalance = input.startingSavings;

  for (let age = input.currentAge; age <= input.lifeExpectancy; age++) {
    let phase = 'Accumulation';
    if (age >= input.retirementAge) {
      if (age >= input.retirementAge + 15) phase = 'No-Go';
      else if (age >= input.retirementAge + 5) phase = 'Slow-Go';
      else phase = 'Go-Go';
    }

    yearlyProjection.push({
      age,
      savings: Math.max(0, Math.round(currentBalance)),
      isDepleted: currentBalance <= 0 && age > input.retirementAge,
      phase
    });

    if (age < input.retirementAge) {
      currentBalance = (currentBalance * (1 + rPre)) + (input.currentMonthlySaving * 12);
    } else {
      const yearsFromToday = age - input.currentAge;
      const inflatedMonthlyExpense = input.monthlyExpensesToday * Math.pow(1 + inflation, yearsFromToday);
      
      let phaseMultiplier = 1.0;
      if (phase === 'No-Go') phaseMultiplier = 0.6;
      else if (phase === 'Slow-Go') phaseMultiplier = 0.8;

      const adjustedExpense = inflatedMonthlyExpense * phaseMultiplier;
      let netYearlyWithdrawal = Math.max(0, adjustedExpense - input.passiveIncomeRetire) * 12;

      if (age === input.retirementAge) {
        netYearlyWithdrawal += input.dreamFund + healthBuffer;
      }

      currentBalance = (currentBalance - netYearlyWithdrawal) * (1 + rPost);
    }
  }

  return {
    magicNumber: Math.round(magicNumber),
    projectedWealth: Math.round(projectedWealth),
    gap: Math.round(gap),
    isEnough,
    additionalMonthlySavingNeeded: Math.round(additionalMonthlySavingNeeded),
    firstYearWithdrawal: Math.round(firstYearWithdrawal),
    swr,
    swrStatus,
    yearlyProjection
  };
}
