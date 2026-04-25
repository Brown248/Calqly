import { calculateTax, defaultTaxInput } from './src/utils/taxCalculations';
import { calculateLoan, defaultLoanInput } from './src/utils/loanCalculations';
import { calculateRetirement, defaultRetirementInput } from './src/utils/retirementCalc';
import { calculateROI, defaultROIInput } from './src/utils/roiCalculations';
import { calculateRealCost, defaultRealCostInput } from './src/utils/realCostCalculations';

console.log("=== STARTING STRESS TESTS ===");

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++;
    console.log(`✅ PASS: ${message}`);
  } else {
    failed++;
    console.error(`❌ FAIL: ${message}`);
  }
}

try {
  // 1. Tax Calculator Tests
  console.log("\n-- Tax Calculator --");
  const taxZero = calculateTax({ ...defaultTaxInput, salary: 0, bonus: 0 });
  assert(!isNaN(taxZero.taxToPay), "Handles zero income without NaN");
  assert(taxZero.taxToPay === 0, "Zero income = Zero tax");

  const taxHuge = calculateTax({ ...defaultTaxInput, salary: 10000000 }); // 120M per year
  assert(!isNaN(taxHuge.taxToPay), "Handles 120M annual income without NaN");
  assert(taxHuge.marginalRate === 35, "Hits max marginal bracket (35%)");
  assert(taxHuge.effectiveRate > 0 && taxHuge.effectiveRate < 35, "Effective rate is logical");

  // 2. Loan Calculator Tests
  console.log("\n-- Loan Calculator --");
  const loanZeroInterest = calculateLoan({ ...defaultLoanInput, interestRate: 0, isStepUp: false, steps: [] });
  assert(!isNaN(loanZeroInterest.monthlyPayment), "Handles zero interest rate without NaN");
  assert(loanZeroInterest.totalInterest === 0, "Zero interest = Zero total interest");
  assert(loanZeroInterest.monthlyPayment === 3000000 / (30 * 12), "Monthly payment is just amount / months");

  const loanExtraPayOnly = calculateLoan({ ...defaultLoanInput, amount: 100000, extraPayment: 100000 });
  assert(loanExtraPayOnly.totalDurationMonths === 1, "Huge extra payment clears loan in 1 month");

  const carLoan = calculateLoan({ ...defaultLoanInput, type: 'car', amount: 500000, years: 5, interestRate: 3 });
  assert(carLoan.effectiveRateForCar !== null && carLoan.effectiveRateForCar > 3, "Car effective rate is higher than flat rate");

  // 3. Retirement Calculator Tests
  console.log("\n-- Retirement Calculator --");
  const retZero = calculateRetirement({ ...defaultRetirementInput, startingSavings: 0, currentMonthlySaving: 0 });
  assert(!isNaN(retZero.magicNumber), "Handles zero savings without NaN");
  assert(retZero.gap > 0, "Shows a gap when savings are zero");

  const retAlreadyRich = calculateRetirement({ ...defaultRetirementInput, startingSavings: 100000000 });
  assert(retAlreadyRich.isEnough === true, "Correctly identifies sufficient funds");
  assert(retAlreadyRich.gap === 0, "Gap is zero when funds are sufficient");

  // 4. ROI Calculator Tests
  console.log("\n-- ROI Calculator --");
  const roiZero = calculateROI({ ...defaultROIInput, initialInvestment: 0, monthlyInvestment: 0, annualReturn: 0 });
  assert(roiZero.finalValue === 0, "Zero everything = Zero final value");
  
  const roiNegative = calculateROI({ ...defaultROIInput, annualReturn: -50, investmentYears: 1 });
  assert(!isNaN(roiNegative.finalValue) && roiNegative.finalValue < defaultROIInput.initialInvestment + (defaultROIInput.monthlyInvestment * 12), "Handles negative returns gracefully");

  // 5. Real Cost Calculator Tests
  console.log("\n-- Real Cost Calculator --");
  const rcCash = calculateRealCost({ ...defaultRealCostInput, downPayment: 1000000, price: 1000000, ongoingCostsAnnual: 0, opportunityCostRate: 0 });
  assert(rcCash.totalInterest === 0, "100% down payment means 0 interest");
  assert(rcCash.opportunityCost === 0, "0% opportunity rate means 0 opportunity cost");
  assert(rcCash.realCost === 1000000, "Cash buying with 0% opp rate = exact price");

  const rcZeroTerm = calculateRealCost({ ...defaultRealCostInput, loanTermYears: 0 });
  assert(!isNaN(rcZeroTerm.realCost), "Handles 0 loan term (division by zero safeguard)");

  console.log(`\n=== TEST SUMMARY: ${passed} Passed, ${failed} Failed ===`);

} catch (error) {
  console.error("❌ CRITICAL FAILURE DURING TESTS:", error);
}