export interface CreditCard {
  id: string;
  name: string;
  bank: string;
  type: 'cashback' | 'travel' | 'points' | 'student' | 'premium';
  annualFee: number;
  feeWaiver: string;
  minIncome: number;
  cashbackRate: string;
  pointsRate: string;
  benefits: string[];
  color: string;
  gradient: string;
}

export const CREDIT_CARDS: CreditCard[] = [
  {
    id: 'ktc-cashback',
    name: 'KTC Cash Back Visa Platinum',
    bank: 'กรุงไทย (KTC)',
    type: 'cashback',
    annualFee: 2000,
    feeWaiver: 'ยกเว้นปีแรก / ใช้จ่ายครบ 12 ครั้ง ยกเว้นปีถัดไป',
    minIncome: 15000,
    cashbackRate: '1% ทุกการใช้จ่าย',
    pointsRate: 'ไม่มี (เป็น cashback)',
    benefits: ['เงินคืน 1% ทุกการใช้จ่าย', 'ประกันอุบัติเหตุ', 'ผ่อน 0% สูงสุด 10 เดือน', 'คืนสูงสุด 5,000/เดือน'],
    color: '#1E40AF',
    gradient: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
  },
  {
    id: 'scb-m-luxe',
    name: 'SCB M LUXE',
    bank: 'ไทยพาณิชย์ (SCB)',
    type: 'premium',
    annualFee: 5000,
    feeWaiver: 'ใช้จ่าย 250,000/ปี ยกเว้นค่าธรรมเนียม',
    minIncome: 50000,
    cashbackRate: 'สะสมแต้ม M Point',
    pointsRate: '25 บาท = 1 M Point (สูงสุด x5)',
    benefits: ['Lounge สนามบิน 4 ครั้ง/ปี', 'ประกันการเดินทาง', 'ส่วนลดร้านอาหารพรีเมียม', 'คอนเซียร์จ 24 ชม.'],
    color: '#7C3AED',
    gradient: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
  },
  {
    id: 'kbank-happymiles',
    name: 'KBank Happy Miles',
    bank: 'กสิกรไทย (KBank)',
    type: 'travel',
    annualFee: 3000,
    feeWaiver: 'ยกเว้นปีแรก / ใช้จ่ายครบ 300,000/ปี',
    minIncome: 30000,
    cashbackRate: 'ไม่มี (เป็น Miles)',
    pointsRate: '15 บาท = 1 ไมล์',
    benefits: ['สะสมไมล์ทุกการใช้จ่าย', 'แลกตั๋วเครื่องบินได้', 'ประกันการเดินทาง 5 ล้าน', 'สิทธิ์ Fast Track สนามบิน'],
    color: '#059669',
    gradient: 'linear-gradient(135deg, #059669, #34D399)',
  },
  {
    id: 'bbl-firstcard',
    name: 'Bangkok Bank Be1st Digital',
    bank: 'กรุงเทพ (BBL)',
    type: 'cashback',
    annualFee: 0,
    feeWaiver: 'ฟรีตลอดชีพ',
    minIncome: 15000,
    cashbackRate: '0.5% ทุกการใช้จ่าย',
    pointsRate: '-',
    benefits: ['ฟรีค่าธรรมเนียมตลอดชีพ', 'เงินคืน 0.5%', 'ผ่อน 0% ร้านค้าที่ร่วมรายการ', 'แจ้งเตือนทุกรายการ'],
    color: '#1D4ED8',
    gradient: 'linear-gradient(135deg, #1D4ED8, #60A5FA)',
  },
  {
    id: 'citibank-rewards',
    name: 'UOB Preferred Platinum',
    bank: 'UOB',
    type: 'points',
    annualFee: 2500,
    feeWaiver: 'ใช้จ่ายครบ 200,000/ปี',
    minIncome: 30000,
    cashbackRate: 'สะสมแต้ม UOB Reward',
    pointsRate: '25 บาท = 1 คะแนน (x5 หมวดท่องเที่ยว)',
    benefits: ['สะสมแต้มเพิ่ม 5x หมวดท่องเที่ยว', 'ส่วนลดร้านอาหาร', 'ผ่อน 0%', 'ประกันอุบัติเหตุ'],
    color: '#DC2626',
    gradient: 'linear-gradient(135deg, #DC2626, #F87171)',
  },
  {
    id: 'ttb-sofast',
    name: 'ttb so fast',
    bank: 'ทีทีบี (ttb)',
    type: 'cashback',
    annualFee: 0,
    feeWaiver: 'ฟรีตลอดชีพ',
    minIncome: 15000,
    cashbackRate: '1% ร้านอาหาร / 0.5% อื่นๆ',
    pointsRate: '-',
    benefits: ['ฟรีค่าธรรมเนียมตลอดชีพ', 'เงินคืน 1% ร้านอาหาร', 'สมัครง่ายผ่านแอป', 'ผ่อน 0% ร้านค้าร่วมรายการ'],
    color: '#0EA5E9',
    gradient: 'linear-gradient(135deg, #0EA5E9, #38BDF8)',
  },
];

export const CARD_TYPES = [
  { id: 'all', name: 'ทั้งหมด' },
  { id: 'cashback', name: 'เงินคืน (Cashback)' },
  { id: 'travel', name: 'ท่องเที่ยว (Travel)' },
  { id: 'points', name: 'สะสมคะแนน (Points)' },
  { id: 'premium', name: 'พรีเมียม (Premium)' },
  { id: 'student', name: 'นักศึกษา/First Job' },
];
