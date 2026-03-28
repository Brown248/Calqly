/**
 * Loan & Mortgage Calculation Utilities
 * คำนวณสินเชื่อ / ผ่อนชำระ
 */

export interface LoanInput {
  principal: number;           // เงินต้น
  annualRate: number;          // อัตราดอกเบี้ยต่อปี (%)
  termYears: number;           // ระยะเวลาผ่อน (ปี)
  extraPayment?: number;       // ผ่อนเพิ่มต่อเดือน
  promoRate?: number;          // ดอกเบี้ยโปรโมชั่นช่วงแรก (%)
  promoYears?: number;         // ระยะเวลาโปรโมชั่น (ปี)
}

export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  totalPrincipalPaid: number;
  totalInterestPaid: number;
}

export interface LoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  totalPrincipal: number;
  interestRatio: number;       // สัดส่วนดอกเบี้ยต่อเงินกู้ (%)
  amortization: AmortizationRow[];
  
  // ข้อมูลเพิ่มเติมสำหรับ step rate
  monthlyPaymentPromo?: number;
  monthlyPaymentNormal?: number;
  savings?: number;            // ประหยัดจากผ่อนเพิ่ม
  monthsSaved?: number;        // เดือนที่ประหยัดจากผ่อนเพิ่ม
}

/**
 * คำนวณค่างวดรายเดือน (PMT)
 */
export function calculateMonthlyPayment(principal: number, annualRate: number, termMonths: number): number {
  if (annualRate === 0) return principal / termMonths;
  const monthlyRate = annualRate / 100 / 12;
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
         (Math.pow(1 + monthlyRate, termMonths) - 1);
}

/**
 * คำนวณสินเชื่อพร้อมตารางผ่อนชำระ
 */
export function calculateLoan(input: LoanInput): LoanResult {
  const { principal, annualRate, termYears, extraPayment = 0, promoRate, promoYears = 0 } = input;
  const termMonths = termYears * 12;
  const promoMonths = promoYears * 12;
  
  // คำนวณค่างวดรายเดือน
  let monthlyPayment: number;
  let monthlyPaymentPromo: number | undefined;
  let monthlyPaymentNormal: number | undefined;
  
  if (promoRate !== undefined && promoYears > 0) {
    // มีดอกเบี้ยโปรโมชั่น: คำนวณแบบ 2 ช่วง
    monthlyPaymentPromo = calculateMonthlyPayment(principal, promoRate, termMonths);
    monthlyPaymentNormal = calculateMonthlyPayment(principal, annualRate, termMonths);
    monthlyPayment = monthlyPaymentPromo; // เริ่มด้วย promo rate
  } else {
    monthlyPayment = calculateMonthlyPayment(principal, annualRate, termMonths);
  }
  
  // สร้างตารางผ่อนชำระ
  const amortization: AmortizationRow[] = [];
  let balance = principal;
  let totalPrincipalPaid = 0;
  let totalInterestPaid = 0;
  
  for (let month = 1; month <= termMonths && balance > 0; month++) {
    // กำหนดอัตราดอกเบี้ยตามช่วงเวลา
    const currentRate = (promoRate !== undefined && month <= promoMonths) 
      ? promoRate : annualRate;
    const monthlyRate = currentRate / 100 / 12;
    
    // คำนวณค่างวดสำหรับช่วงนี้
    let currentPayment: number;
    if (promoRate !== undefined && month === promoMonths + 1) {
      // เปลี่ยนจาก promo เป็น normal rate - คำนวณค่างวดใหม่
      const remainingMonths = termMonths - month + 1;
      currentPayment = calculateMonthlyPayment(balance, annualRate, remainingMonths);
      monthlyPayment = currentPayment;
    } else if (promoRate !== undefined && month <= promoMonths) {
      currentPayment = monthlyPaymentPromo!;
    } else {
      currentPayment = monthlyPayment;
    }
    
    // เพิ่ม extra payment
    currentPayment += extraPayment;
    
    const interest = balance * monthlyRate;
    let principalPayment = currentPayment - interest;
    
    // ถ้าเงินต้นที่จ่ายมากกว่ายอดคงเหลือ
    if (principalPayment > balance) {
      principalPayment = balance;
      currentPayment = principalPayment + interest;
    }
    
    balance -= principalPayment;
    totalPrincipalPaid += principalPayment;
    totalInterestPaid += interest;
    
    amortization.push({
      month,
      payment: currentPayment,
      principal: principalPayment,
      interest,
      balance: Math.max(0, balance),
      totalPrincipalPaid,
      totalInterestPaid,
    });
    
    if (balance <= 0) break;
  }
  
  const totalPayment = totalPrincipalPaid + totalInterestPaid;
  const interestRatio = (totalInterestPaid / principal) * 100;
  
  // คำนวณส่วนที่ประหยัดจากผ่อนเพิ่ม
  let savings: number | undefined;
  let monthsSaved: number | undefined;
  
  if (extraPayment > 0) {
    const normalResult = calculateLoan({ ...input, extraPayment: 0 });
    savings = normalResult.totalInterest - totalInterestPaid;
    monthsSaved = normalResult.amortization.length - amortization.length;
  }
  
  return {
    monthlyPayment: monthlyPaymentPromo || monthlyPayment,
    totalPayment,
    totalInterest: totalInterestPaid,
    totalPrincipal: principal,
    interestRatio,
    amortization,
    monthlyPaymentPromo,
    monthlyPaymentNormal,
    savings,
    monthsSaved,
  };
}

// ข้อมูลอ้างอิงอัตราดอกเบี้ย มี.ค. 2569
export const REFERENCE_RATES = {
  mrr: { min: 6.0, max: 6.8, label: 'MRR (อัตราดอกเบี้ยลูกค้ารายย่อย)' },
  mlr: { min: 5.8, max: 6.5, label: 'MLR (อัตราดอกเบี้ยลูกค้ารายใหญ่)' },
  promoFirstThreeYears: { min: 2.6, max: 3.5, label: 'โปรโมชั่น 3 ปีแรก' },
  personalLoan: { min: 8.0, max: 25.0, label: 'สินเชื่อส่วนบุคคล' },
  carLoan: { min: 2.5, max: 5.0, label: 'สินเชื่อรถยนต์' },
};

export const LOAN_TYPES = [
  { id: 'home', name: 'สินเชื่อบ้าน', nameEn: 'Home Loan', defaultRate: 6.5, defaultTerm: 30 },
  { id: 'car', name: 'สินเชื่อรถยนต์', nameEn: 'Car Loan', defaultRate: 3.5, defaultTerm: 5 },
  { id: 'personal', name: 'สินเชื่อส่วนบุคคล', nameEn: 'Personal Loan', defaultRate: 15.0, defaultTerm: 5 },
  { id: 'custom', name: 'กำหนดเอง', nameEn: 'Custom', defaultRate: 5.0, defaultTerm: 10 },
];
