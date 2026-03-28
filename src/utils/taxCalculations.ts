/**
 * Thai Personal Income Tax Calculation Engine
 * อิงข้อมูลภาษี พ.ศ. 2569 จากกรมสรรพากร
 */

import { TAX_BRACKETS, EXPENSE_DEDUCTION, DEDUCTION_LIMITS } from '@/data/taxData';

export interface TaxInput {
  // รายได้
  monthlyIncome: number;
  otherIncome: number;
  
  // สถานะ
  hasSpouse: boolean;
  spouseHasIncome: boolean;
  numberOfChildren: number;
  childrenBornAfter2018: number;
  
  // บิดามารดา
  numberOfParents: number;
  numberOfDisabledDependents: number;
  
  // ประกัน
  lifeInsurance: number;
  healthInsurance: number;
  parentHealthInsurance: number;
  pensionInsurance: number;
  
  // การลงทุน
  socialSecurity: number;
  providentFund: number;
  rmf: number;
  thaiESG: number;
  
  // อื่นๆ
  homeLoanInterest: number;
  generalDonation: number;
  educationDonation: number;
  maternityExpense: number;
}

export interface TaxBreakdownItem {
  bracket: string;
  income: number;
  rate: number;
  tax: number;
}

export interface DeductionSummary {
  name: string;
  amount: number;
  maxAllowed: number;
  category: string;
}

export interface TaxResult {
  // รายได้
  annualIncome: number;
  expenseDeduction: number;
  totalDeductions: number;
  netIncome: number;
  
  // ภาษี
  totalTax: number;
  effectiveRate: number;
  monthlyTax: number;
  
  // รายละเอียด
  taxBreakdown: TaxBreakdownItem[];
  deductionDetails: DeductionSummary[];
  
  // คำแนะนำ
  savingTips: string[];
  unusedDeductions: { name: string; remaining: number; tip: string }[];
}

export function calculateTax(input: TaxInput): TaxResult {
  // 1. คำนวณรายได้รวมทั้งปี
  const annualIncome = (input.monthlyIncome * 12) + input.otherIncome;
  
  // 2. หักค่าใช้จ่ายเหมา (50% ไม่เกิน 100,000)
  const expenseDeduction = Math.min(
    annualIncome * EXPENSE_DEDUCTION.salary.rate,
    EXPENSE_DEDUCTION.salary.max
  );
  
  // 3. คำนวณค่าลดหย่อนทั้งหมด
  const deductionDetails: DeductionSummary[] = [];
  let totalDeductions = 0;
  
  // ส่วนตัว
  const personalDeduction = 60000;
  deductionDetails.push({ name: 'ค่าลดหย่อนส่วนตัว', amount: personalDeduction, maxAllowed: 60000, category: 'personal' });
  totalDeductions += personalDeduction;
  
  // คู่สมรส
  if (input.hasSpouse && !input.spouseHasIncome) {
    deductionDetails.push({ name: 'ค่าลดหย่อนคู่สมรส', amount: 60000, maxAllowed: 60000, category: 'personal' });
    totalDeductions += 60000;
  }
  
  // บุตร
  if (input.numberOfChildren > 0) {
    const normalChildren = Math.max(0, input.numberOfChildren - input.childrenBornAfter2018);
    const post2018Children = input.childrenBornAfter2018;
    const childDeduction = (normalChildren * 30000) + (post2018Children * 60000);
    deductionDetails.push({ name: `ค่าลดหย่อนบุตร (${input.numberOfChildren} คน)`, amount: childDeduction, maxAllowed: childDeduction, category: 'personal' });
    totalDeductions += childDeduction;
  }
  
  // บิดามารดา
  if (input.numberOfParents > 0) {
    const parentDeduction = Math.min(input.numberOfParents, 4) * 30000;
    deductionDetails.push({ name: `ค่าอุปการะบิดามารดา (${input.numberOfParents} คน)`, amount: parentDeduction, maxAllowed: 120000, category: 'personal' });
    totalDeductions += parentDeduction;
  }
  
  // คนพิการ
  if (input.numberOfDisabledDependents > 0) {
    const disabilityDeduction = input.numberOfDisabledDependents * 60000;
    deductionDetails.push({ name: `ค่าอุปการะคนพิการ (${input.numberOfDisabledDependents} คน)`, amount: disabilityDeduction, maxAllowed: disabilityDeduction, category: 'personal' });
    totalDeductions += disabilityDeduction;
  }
  
  // ค่าฝากครรภ์
  if (input.maternityExpense > 0) {
    const maternity = Math.min(input.maternityExpense, 60000);
    deductionDetails.push({ name: 'ค่าฝากครรภ์และคลอดบุตร', amount: maternity, maxAllowed: 60000, category: 'personal' });
    totalDeductions += maternity;
  }
  
  // ประกันชีวิต + สุขภาพ (รวมกันไม่เกิน 100,000)
  const lifeIns = Math.min(input.lifeInsurance, 100000);
  const healthIns = Math.min(input.healthInsurance, 25000);
  const combinedInsurance = Math.min(lifeIns + healthIns, DEDUCTION_LIMITS.lifeAndHealthInsurance);
  
  if (lifeIns > 0) {
    deductionDetails.push({ name: 'เบี้ยประกันชีวิตทั่วไป', amount: lifeIns, maxAllowed: 100000, category: 'insurance' });
  }
  if (healthIns > 0) {
    deductionDetails.push({ name: 'เบี้ยประกันสุขภาพ', amount: healthIns, maxAllowed: 25000, category: 'insurance' });
  }
  totalDeductions += combinedInsurance;
  
  // ประกันสุขภาพบิดามารดา
  if (input.parentHealthInsurance > 0) {
    const parentHealthIns = Math.min(input.parentHealthInsurance, 15000);
    deductionDetails.push({ name: 'ประกันสุขภาพบิดามารดา', amount: parentHealthIns, maxAllowed: 15000, category: 'insurance' });
    totalDeductions += parentHealthIns;
  }
  
  // กลุ่มเกษียณ (รวมไม่เกิน 500,000)
  let retirementTotal = 0;
  
  // ประกันสังคม
  const socialSec = Math.min(input.socialSecurity, 9000);
  if (socialSec > 0) {
    deductionDetails.push({ name: 'เงินประกันสังคม', amount: socialSec, maxAllowed: 9000, category: 'other' });
    totalDeductions += socialSec;
  }
  
  // ประกันบำนาญ
  const pensionIns = Math.min(input.pensionInsurance, 200000, annualIncome * 0.15);
  if (pensionIns > 0) {
    deductionDetails.push({ name: 'ประกันชีวิตแบบบำนาญ', amount: pensionIns, maxAllowed: 200000, category: 'insurance' });
    retirementTotal += pensionIns;
  }
  
  // กองทุนสำรองเลี้ยงชีพ
  if (input.providentFund > 0) {
    const pvd = Math.min(input.providentFund, 500000);
    deductionDetails.push({ name: 'กองทุนสำรองเลี้ยงชีพ (PVD)', amount: pvd, maxAllowed: 500000, category: 'investment' });
    retirementTotal += pvd;
  }
  
  // RMF
  const rmfMax = Math.min(input.rmf, annualIncome * 0.3, 500000);
  if (rmfMax > 0) {
    deductionDetails.push({ name: 'กองทุน RMF', amount: rmfMax, maxAllowed: 500000, category: 'investment' });
    retirementTotal += rmfMax;
  }
  
  // จำกัดกลุ่มเกษียณรวมไม่เกิน 500,000
  const retirementCapped = Math.min(retirementTotal, DEDUCTION_LIMITS.retirementGroup);
  totalDeductions += retirementCapped;
  
  // Thai ESG (แยกวงเงิน)
  const thaiESG = Math.min(input.thaiESG, annualIncome * 0.3, DEDUCTION_LIMITS.thaiESG);
  if (thaiESG > 0) {
    deductionDetails.push({ name: 'กองทุน Thai ESG', amount: thaiESG, maxAllowed: 300000, category: 'investment' });
    totalDeductions += thaiESG;
  }
  
  // ดอกเบี้ยบ้าน
  if (input.homeLoanInterest > 0) {
    const homeLoan = Math.min(input.homeLoanInterest, 100000);
    deductionDetails.push({ name: 'ดอกเบี้ยกู้ยืมเพื่อที่อยู่อาศัย', amount: homeLoan, maxAllowed: 100000, category: 'other' });
    totalDeductions += homeLoan;
  }
  
  // 4. คำนวณเงินได้สุทธิ
  const netIncome = Math.max(0, annualIncome - expenseDeduction - totalDeductions);
  
  // 5. เงินบริจาค (คำนวณหลังจากได้เงินได้สุทธิ)
  if (input.educationDonation > 0) {
    const eduDonation = Math.min(input.educationDonation * 2, netIncome * 0.1);
    deductionDetails.push({ name: 'บริจาคการศึกษา/กีฬา/รพ.รัฐ (2 เท่า)', amount: eduDonation, maxAllowed: netIncome * 0.1, category: 'donation' });
    totalDeductions += eduDonation;
  }
  
  if (input.generalDonation > 0) {
    const genDonation = Math.min(input.generalDonation, netIncome * 0.1);
    deductionDetails.push({ name: 'เงินบริจาคทั่วไป', amount: genDonation, maxAllowed: netIncome * 0.1, category: 'donation' });
    totalDeductions += genDonation;
  }
  
  // คำนวณเงินได้สุทธิใหม่ (หลังรวมบริจาค)
  const finalNetIncome = Math.max(0, annualIncome - expenseDeduction - totalDeductions);
  
  // 6. คำนวณภาษีตามขั้นบันได
  const taxBreakdown: TaxBreakdownItem[] = [];
  let totalTax = 0;
  let remainingIncome = finalNetIncome;
  
  for (const bracket of TAX_BRACKETS) {
    if (remainingIncome <= 0) break;
    
    const bracketSize = bracket.max !== null 
      ? bracket.max - bracket.min + 1 
      : remainingIncome;
    
    const taxableInBracket = Math.min(remainingIncome, bracketSize);
    const taxInBracket = taxableInBracket * (bracket.rate / 100);
    
    if (taxableInBracket > 0) {
      taxBreakdown.push({
        bracket: bracket.max !== null 
          ? `${bracket.min.toLocaleString()} - ${bracket.max.toLocaleString()}` 
          : `${bracket.min.toLocaleString()} ขึ้นไป`,
        income: taxableInBracket,
        rate: bracket.rate,
        tax: taxInBracket,
      });
    }
    
    totalTax += taxInBracket;
    remainingIncome -= taxableInBracket;
  }
  
  const effectiveRate = annualIncome > 0 ? (totalTax / annualIncome) * 100 : 0;
  
  // 7. คำแนะนำการประหยัดภาษี
  const savingTips: string[] = [];
  const unusedDeductions: { name: string; remaining: number; tip: string }[] = [];
  
  if (input.lifeInsurance < 100000) {
    unusedDeductions.push({
      name: 'ประกันชีวิต',
      remaining: 100000 - input.lifeInsurance,
      tip: 'ซื้อประกันชีวิตเพิ่มเพื่อลดหย่อนภาษีได้อีก',
    });
  }
  
  if (retirementTotal < DEDUCTION_LIMITS.retirementGroup && annualIncome * 0.3 > retirementTotal) {
    unusedDeductions.push({
      name: 'กองทุนเกษียณ (RMF/PVD)',
      remaining: Math.min(DEDUCTION_LIMITS.retirementGroup - retirementTotal, annualIncome * 0.3 - retirementTotal),
      tip: 'ลงทุนใน RMF เพิ่มเพื่อลดภาษีและออมเกษียณไปพร้อมกัน',
    });
  }
  
  if (thaiESG < Math.min(annualIncome * 0.3, DEDUCTION_LIMITS.thaiESG)) {
    unusedDeductions.push({
      name: 'กองทุน Thai ESG',
      remaining: Math.min(annualIncome * 0.3, DEDUCTION_LIMITS.thaiESG) - thaiESG,
      tip: 'ลงทุนใน Thai ESG ลดหย่อนได้แยกวงเงินจากกลุ่มเกษียณ (แนะนำสำหรับปี 2567-2569)',
    });
  }
  
  if (input.homeLoanInterest === 0) {
    savingTips.push('หากมีสินเชื่อบ้าน สามารถนำดอกเบี้ยมาลดหย่อนได้สูงสุด 100,000 บาท');
  }
  
  if (totalTax > 50000) {
    savingTips.push('พิจารณาวางแผนภาษีล่วงหน้าตั้งแต่ต้นปี เพื่อกระจายการลงทุนลดหย่อนภาษี');
  }
  
  if (finalNetIncome > 2000000) {
    savingTips.push('ควรปรึกษาผู้เชี่ยวชาญด้านภาษีเพื่อวางแผนภาษีอย่างครบถ้วน');
  }
  
  return {
    annualIncome,
    expenseDeduction,
    totalDeductions,
    netIncome: finalNetIncome,
    totalTax,
    effectiveRate,
    monthlyTax: totalTax / 12,
    taxBreakdown,
    deductionDetails,
    savingTips,
    unusedDeductions,
  };
}

export const defaultTaxInput: TaxInput = {
  monthlyIncome: 0,
  otherIncome: 0,
  hasSpouse: false,
  spouseHasIncome: false,
  numberOfChildren: 0,
  childrenBornAfter2018: 0,
  numberOfParents: 0,
  numberOfDisabledDependents: 0,
  lifeInsurance: 0,
  healthInsurance: 0,
  parentHealthInsurance: 0,
  pensionInsurance: 0,
  socialSecurity: 0,
  providentFund: 0,
  rmf: 0,
  thaiESG: 0,
  homeLoanInterest: 0,
  generalDonation: 0,
  educationDonation: 0,
  maternityExpense: 0,
};
