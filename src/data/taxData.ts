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

export const TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 150000, rate: 0, label: 'ยกเว้นภาษี' },
  { min: 150000, max: 300000, rate: 5, label: '5%' },
  { min: 300000, max: 500000, rate: 10, label: '10%' },
  { min: 500000, max: 750000, rate: 15, label: '15%' },
  { min: 750000, max: 1000000, rate: 20, label: '20%' },
  { min: 1000000, max: 2000000, rate: 25, label: '25%' },
  { min: 2000000, max: 5000000, rate: 30, label: '30%' },
  { min: 5000000, max: null, rate: 35, label: '35%' },
];

export const EXPENSE_DEDUCTION = {
  salary: { rate: 0.5, max: 100000 },
};

export const DEDUCTIONS: Deduction[] = [
  {
    id: 'personal',
    name: 'Personal allowance',
    nameTh: 'ค่าลดหย่อนส่วนตัว',
    maxAmount: 60000,
    description: 'Every taxpayer can deduct 60,000 THB.',
    descriptionTh: 'ผู้เสียภาษีทุกคนใช้สิทธิได้ 60,000 บาท',
    category: 'personal',
  },
  {
    id: 'spouse',
    name: 'Spouse allowance',
    nameTh: 'ค่าลดหย่อนคู่สมรส',
    maxAmount: 60000,
    description: 'For a legally married spouse with no income.',
    descriptionTh: 'สำหรับคู่สมรสที่ไม่มีรายได้',
    category: 'personal',
  },
  {
    id: 'child',
    name: 'Child allowance',
    nameTh: 'ค่าลดหย่อนบุตร',
    maxAmount: 60000,
    description: '30,000 THB per child, with special rules for later children.',
    descriptionTh: 'บุตรคนละ 30,000 บาท และบางกรณีใช้สิทธิได้ 60,000 บาท',
    category: 'personal',
  },
  {
    id: 'social_security',
    name: 'Social security',
    nameTh: 'ประกันสังคม',
    maxAmount: 9000,
    description: 'Actual contribution paid.',
    descriptionTh: 'ใช้ตามยอดที่จ่ายจริง',
    category: 'other',
  },
  {
    id: 'life_insurance',
    name: 'Life insurance',
    nameTh: 'เบี้ยประกันชีวิต',
    maxAmount: 100000,
    description: 'Subject to policy conditions and legal limits.',
    descriptionTh: 'เป็นไปตามเงื่อนไขกรมธรรม์และเพดานตามกฎหมาย',
    category: 'insurance',
  },
  {
    id: 'health_insurance',
    name: 'Health insurance',
    nameTh: 'เบี้ยประกันสุขภาพ',
    maxAmount: 25000,
    description: 'Combined with life insurance under legal limits.',
    descriptionTh: 'ใช้สิทธิร่วมกับประกันชีวิตตามเพดานที่กฎหมายกำหนด',
    category: 'insurance',
  },
  {
    id: 'rmf',
    name: 'RMF',
    nameTh: 'กองทุน RMF',
    maxAmount: 500000,
    description: 'Part of the retirement deduction group.',
    descriptionTh: 'เป็นส่วนหนึ่งของกลุ่มลดหย่อนเพื่อการเกษียณ',
    category: 'investment',
    noteTh: 'ต้องถือครบตามเกณฑ์ของกฎหมาย',
  },
  {
    id: 'thai_esg',
    name: 'Thai ESG',
    nameTh: 'กองทุน Thai ESG',
    maxAmount: 300000,
    description: 'Separate deduction bucket subject to current rules.',
    descriptionTh: 'เป็นวงเงินลดหย่อนแยก ตามเงื่อนไขของปีภาษีนั้น',
    category: 'investment',
  },
  {
    id: 'home_loan_interest',
    name: 'Home loan interest',
    nameTh: 'ดอกเบี้ยกู้ซื้อบ้าน',
    maxAmount: 100000,
    description: 'Actual amount paid, subject to limit.',
    descriptionTh: 'ใช้ตามที่จ่ายจริง ไม่เกินเพดาน',
    category: 'other',
  },
  {
    id: 'donation_general',
    name: 'General donation',
    nameTh: 'เงินบริจาคทั่วไป',
    maxAmount: 0,
    description: 'Limited as a percentage of net income.',
    descriptionTh: 'จำกัดตามสัดส่วนของเงินได้สุทธิ',
    category: 'donation',
  },
];

export const DEDUCTION_LIMITS = {
  retirementGroup: 500000,
  lifeAndHealthInsurance: 100000,
  thaiESG: 300000,
};

export const TAX_INFO = {
  year: 2569,
  yearCE: 2026,
  filingDeadline: '31 มีนาคม 2570',
  filingDeadlineOnline: 'อาจขยายเวลาได้สำหรับการยื่นออนไลน์',
  source: 'กรมสรรพากร (rd.go.th)',
  minIncomeToFile: 120000,
  disclaimer: 'ข้อมูลนี้มีไว้เพื่อการศึกษาและการวางแผนเบื้องต้น ควรตรวจสอบข้อมูลล่าสุดกับกรมสรรพากรหรือผู้เชี่ยวชาญก่อนตัดสินใจ',
};
