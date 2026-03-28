// ข้อมูลภาษีเงินได้บุคคลธรรมดา ประเทศไทย พ.ศ. 2569
// อ้างอิง: กรมสรรพากร (rd.go.th)

export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
  label: string;
}

export interface Deduction {
  id: string;
  name: string;
  nameTh: string;
  maxAmount: number;
  description: string;
  descriptionTh: string;
  category: 'personal' | 'insurance' | 'investment' | 'donation' | 'other';
  note?: string;
  noteTh?: string;
}

// อัตราภาษีแบบก้าวหน้า (Progressive Tax)
export const TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 150000, rate: 0, label: 'ยกเว้นภาษี' },
  { min: 150001, max: 300000, rate: 5, label: '5%' },
  { min: 300001, max: 500000, rate: 10, label: '10%' },
  { min: 500001, max: 750000, rate: 15, label: '15%' },
  { min: 750001, max: 1000000, rate: 20, label: '20%' },
  { min: 1000001, max: 2000000, rate: 25, label: '25%' },
  { min: 2000001, max: 5000000, rate: 30, label: '30%' },
  { min: 5000001, max: null, rate: 35, label: '35%' },
];

// ค่าใช้จ่ายเหมา
export const EXPENSE_DEDUCTION = {
  salary: { rate: 0.5, max: 100000 }, // 50% ไม่เกิน 100,000
};

// ค่าลดหย่อนทั้งหมด
export const DEDUCTIONS: Deduction[] = [
  // ส่วนตัวและครอบครัว
  {
    id: 'personal',
    name: 'Personal Allowance',
    nameTh: 'ค่าลดหย่อนส่วนตัว',
    maxAmount: 60000,
    description: 'Every taxpayer can deduct 60,000 THB',
    descriptionTh: 'ผู้เสียภาษีทุกคนหักได้ 60,000 บาท โดยอัตโนมัติ',
    category: 'personal',
  },
  {
    id: 'spouse',
    name: 'Spouse Allowance',
    nameTh: 'ค่าลดหย่อนคู่สมรส',
    maxAmount: 60000,
    description: 'Legally married spouse with no income: 60,000 THB',
    descriptionTh: 'คู่สมรสที่จดทะเบียนสมรสถูกต้องตามกฎหมาย และไม่มีรายได้ หักได้ 60,000 บาท',
    category: 'personal',
  },
  {
    id: 'child',
    name: 'Child Allowance',
    nameTh: 'ค่าลดหย่อนบุตร',
    maxAmount: 30000,
    description: '30,000 THB per child. 2nd child onwards (born 2018+): 60,000 THB',
    descriptionTh: 'บุตรคนละ 30,000 บาท บุตรคนที่ 2 เป็นต้นไป (เกิดตั้งแต่ พ.ศ. 2561) ได้ 60,000 บาท',
    category: 'personal',
    noteTh: 'บุตรต้องอายุไม่เกิน 20 ปี หรือไม่เกิน 25 ปี และกำลังศึกษา',
  },
  {
    id: 'parent_care',
    name: 'Parent Care Allowance',
    nameTh: 'ค่าอุปการะบิดามารดา',
    maxAmount: 30000,
    description: '30,000 THB per parent (max 4 persons = 120,000 THB)',
    descriptionTh: 'บิดามารดาคนละ 30,000 บาท (สูงสุด 4 คน = 120,000 บาท) อายุ 60 ปีขึ้นไป รายได้ไม่เกิน 30,000 บาท/ปี',
    category: 'personal',
  },
  {
    id: 'disability',
    name: 'Disability Care',
    nameTh: 'ค่าอุปการะคนพิการ',
    maxAmount: 60000,
    description: '60,000 THB per disabled/incapacitated person',
    descriptionTh: 'คนพิการหรือทุพพลภาพ คนละ 60,000 บาท',
    category: 'personal',
  },
  {
    id: 'maternity',
    name: 'Prenatal & Delivery',
    nameTh: 'ค่าฝากครรภ์และคลอดบุตร',
    maxAmount: 60000,
    description: 'Actual amount, up to 60,000 THB per pregnancy',
    descriptionTh: 'ตามที่จ่ายจริง ไม่เกิน 60,000 บาทต่อการตั้งครรภ์',
    category: 'personal',
  },

  // ประกัน
  {
    id: 'life_insurance',
    name: 'Life Insurance Premium',
    nameTh: 'เบี้ยประกันชีวิตทั่วไป',
    maxAmount: 100000,
    description: 'Actual amount, up to 100,000 THB (policy 10+ years)',
    descriptionTh: 'ตามที่จ่ายจริง ไม่เกิน 100,000 บาท (กรมธรรม์อายุ 10 ปีขึ้นไป)',
    category: 'insurance',
    noteTh: 'หมายเหตุ: รวมกับเบี้ยประกันสุขภาพต้องไม่เกิน 100,000 บาท',
  },
  {
    id: 'health_insurance',
    name: 'Health Insurance Premium',
    nameTh: 'เบี้ยประกันสุขภาพ',
    maxAmount: 25000,
    description: 'Actual amount, up to 25,000 THB (combined with life insurance ≤ 100,000)',
    descriptionTh: 'ตามที่จ่ายจริง ไม่เกิน 25,000 บาท (รวมกับประกันชีวิตทั่วไปต้องไม่เกิน 100,000 บาท)',
    category: 'insurance',
  },
  {
    id: 'parent_health_insurance',
    name: 'Parent Health Insurance',
    nameTh: 'ประกันสุขภาพบิดามารดา',
    maxAmount: 15000,
    description: 'Actual amount, up to 15,000 THB',
    descriptionTh: 'ตามที่จ่ายจริง ไม่เกิน 15,000 บาท (บิดามารดารายได้ไม่เกิน 30,000 บาท/ปี)',
    category: 'insurance',
  },
  {
    id: 'pension_insurance',
    name: 'Pension Insurance',
    nameTh: 'ประกันชีวิตแบบบำนาญ',
    maxAmount: 200000,
    description: '15% of taxable income, up to 200,000 THB',
    descriptionTh: 'ลดหย่อนได้ 15% ของเงินได้ที่ต้องเสียภาษี ไม่เกิน 200,000 บาท',
    category: 'insurance',
    noteTh: 'นับรวมในวงเงินกลุ่มเกษียณ 500,000 บาท',
  },

  // การลงทุน
  {
    id: 'social_security',
    name: 'Social Security',
    nameTh: 'เงินประกันสังคม',
    maxAmount: 9000,
    description: 'Actual contribution amount',
    descriptionTh: 'ตามที่จ่ายจริง (สูงสุดประมาณ 9,000 บาท/ปี สำหรับ ม.33)',
    category: 'other',
  },
  {
    id: 'provident_fund',
    name: 'Provident Fund (PVD)',
    nameTh: 'กองทุนสำรองเลี้ยงชีพ',
    maxAmount: 500000,
    description: 'Actual contribution, part of 500,000 THB retirement group',
    descriptionTh: 'ตามที่จ่ายจริง (นับรวมในวงเงินกลุ่มเกษียณ 500,000 บาท)',
    category: 'investment',
    noteTh: 'กลุ่มเกษียณ = PVD + RMF + กบข. + ประกันบำนาญ + กอช. รวมกันไม่เกิน 500,000 บาท',
  },
  {
    id: 'rmf',
    name: 'RMF (Retirement Mutual Fund)',
    nameTh: 'กองทุน RMF',
    maxAmount: 500000,
    description: '30% of taxable income, combined retirement group ≤ 500,000 THB',
    descriptionTh: 'ไม่เกิน 30% ของเงินได้ที่ต้องเสียภาษี รวมกลุ่มเกษียณไม่เกิน 500,000 บาท',
    category: 'investment',
    noteTh: 'ต้องถือไม่น้อยกว่า 5 ปี และถือจนอายุ 55 ปีบริบูรณ์',
  },
  {
    id: 'thai_esg',
    name: 'Thai ESG Fund',
    nameTh: 'กองทุน Thai ESG',
    maxAmount: 300000,
    description: '30% of taxable income, up to 300,000 THB (separate from retirement group)',
    descriptionTh: 'ไม่เกิน 30% ของเงินได้ สูงสุด 300,000 บาท (แยกวงเงินจากกลุ่มเกษียณ)',
    category: 'investment',
    noteTh: 'สิทธิ์ปี 2567-2569 ถือไม่น้อยกว่า 5 ปี (นับวันชนวัน)',
  },

  // อื่นๆ
  {
    id: 'home_loan_interest',
    name: 'Home Loan Interest',
    nameTh: 'ดอกเบี้ยกู้ยืมเพื่อที่อยู่อาศัย',
    maxAmount: 100000,
    description: 'Actual amount, up to 100,000 THB',
    descriptionTh: 'ตามที่จ่ายจริง ไม่เกิน 100,000 บาท',
    category: 'other',
  },
  {
    id: 'donation_general',
    name: 'General Donation',
    nameTh: 'เงินบริจาคทั่วไป',
    maxAmount: 0, // 10% of net income (calculated dynamically)
    description: 'Actual amount, up to 10% of net income',
    descriptionTh: 'ตามที่จ่ายจริง ไม่เกิน 10% ของเงินได้สุทธิ (หลังหักค่าลดหย่อนอื่น)',
    category: 'donation',
    noteTh: 'วงเงินจะคำนวณจากเงินได้สุทธิหลังหักค่าลดหย่อนอื่นแล้ว',
  },
  {
    id: 'donation_education',
    name: 'Education/Sports/Hospital Donation',
    nameTh: 'บริจาคการศึกษา/กีฬา/รพ.รัฐ',
    maxAmount: 0, // 2x actual, max 10% of net income
    description: '2x actual amount, up to 10% of net income',
    descriptionTh: 'ลดหย่อนได้ 2 เท่าของที่บริจาคจริง ไม่เกิน 10% ของเงินได้สุทธิ',
    category: 'donation',
    noteTh: 'บริจาคผ่านระบบ e-Donation ไม่ต้องเก็บหลักฐานกระดาษ',
  },
];

// สรุปกลุ่มวงเงินลดหย่อน
export const DEDUCTION_LIMITS = {
  retirementGroup: 500000, // PVD + RMF + กบข. + ประกันบำนาญ + กอช.
  lifeAndHealthInsurance: 100000, // ประกันชีวิต + ประกันสุขภาพ รวมกัน
  thaiESG: 300000, // แยกวงเงิน
};

// ข้อมูลเพิ่มเติมสำหรับอ้างอิง
export const TAX_INFO = {
  year: 2569,
  yearCE: 2026,
  filingDeadline: '31 มีนาคม 2570',
  filingDeadlineOnline: 'อาจขยายถึง 8 เมษายน 2570 (ยื่นออนไลน์)',
  source: 'กรมสรรพากร (www.rd.go.th)',
  minIncomeToFile: 120000, // เงินเดือนเกิน 120,000/ปี ต้องยื่น
  disclaimer: 'ข้อมูลนี้เป็นข้อมูลทั่วไปเพื่อการศึกษา ไม่ถือเป็นคำแนะนำทางภาษี กรุณาปรึกษาผู้เชี่ยวชาญด้านภาษีหรือตรวจสอบข้อมูลล่าสุดจากกรมสรรพากร',
};
