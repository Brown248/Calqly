export interface CreditCard {
  id: string;
  name: string;
  name_en: string;
  bank: string;
  bank_en: string;
  type: 'cashback' | 'travel' | 'points' | 'student' | 'premium';
  annualFee: number;
  feeWaiver: string;
  feeWaiver_en: string;
  minIncome: number;
  cashbackRate: string;
  cashbackRate_en: string;
  pointsRate: string;
  pointsRate_en: string;
  benefits: string[];
  benefits_en: string[];
  pros: string[];
  pros_en: string[];
  cons: string[];
  cons_en: string[];
  warning?: string;
  warning_en?: string;
  officialUrl: string;
  affiliateUrl?: string;
  color: string;
  gradient: string;
}

export const CREDIT_CARDS: CreditCard[] = [
  {
    id: 'ktc-visa-platinum',
    name: 'KTC VISA PLATINUM',
    name_en: 'KTC VISA PLATINUM',
    bank: 'เคทีซี',
    bank_en: 'KTC',
    type: 'student',
    annualFee: 0,
    feeWaiver: 'ฟรีตลอดชีพ',
    feeWaiver_en: 'Free for life',
    minIncome: 15000,
    cashbackRate: 'ไม่มี cashback หลัก',
    cashbackRate_en: 'No base cashback',
    pointsRate: '25 บาท = 1 คะแนน',
    pointsRate_en: '25 THB = 1 point',
    benefits: [
      'ฟรีค่าธรรมเนียมรายปีแบบไม่ต้องลุ้นยอดใช้จ่าย',
      'คะแนนไม่มีวันหมดอายุ',
      'เหมาะกับผู้เริ่มต้นสร้างเครดิต',
    ],
    benefits_en: [
      'No annual fee without spending conditions',
      'Points do not expire',
      'Good starter card for building credit history',
    ],
    pros: [
      'โครงสร้างเรียบง่าย ใช้ง่าย',
      'เหมาะกับคนอยากมีบัตรใบแรกแบบต้นทุนต่ำ',
    ],
    pros_en: [
      'Simple structure and easy to understand',
      'Suitable as a low-risk first credit card',
    ],
    cons: [
      'ผลตอบแทนจากการใช้จ่ายทั่วไปไม่เด่น',
      'สิทธิพิเศษสายท่องเที่ยวมีไม่มาก',
    ],
    cons_en: [
      'Weak reward rate for general spending',
      'Limited travel-oriented perks',
    ],
    warning: 'เหมาะกับคนเน้นเรียบง่าย ไม่เหมาะกับสายล่าคืนเงินหรือปั่นไมล์หนักๆ',
    warning_en: 'Best for simplicity, not for heavy cashback or miles optimization.',
    officialUrl: 'https://www.ktc.co.th',
    affiliateUrl: '',
    color: '#0054A6',
    gradient: 'linear-gradient(135deg, #0054A6, #0076CE)',
  },
  {
    id: 'jcb-travel-card',
    name: 'KTC JCB PLATINUM',
    name_en: 'KTC JCB PLATINUM',
    bank: 'เคทีซี',
    bank_en: 'KTC',
    type: 'travel',
    annualFee: 0,
    feeWaiver: 'ฟรีตลอดชีพ',
    feeWaiver_en: 'Free for life',
    minIncome: 15000,
    cashbackRate: 'โปรเฉพาะหมวดและแคมเปญ',
    cashbackRate_en: 'Promo-based only',
    pointsRate: '25 บาท = 1 คะแนน',
    pointsRate_en: '25 THB = 1 point',
    benefits: [
      'เด่นเรื่องสิทธิร้านอาหารและทริปญี่ปุ่น',
      'มีสิทธิ lounge และแคมเปญเครือข่าย JCB บางช่วง',
      'ค่าธรรมเนียมรายปี 0 บาท',
    ],
    benefits_en: [
      'Good fit for Japan-focused travel and dining perks',
      'Selected lounge and JCB network promotions',
      'No annual fee',
    ],
    pros: [
      'คุ้มสำหรับคนเดินทางญี่ปุ่นหรือใช้ร้านอาหารญี่ปุ่นบ่อย',
      'มีคาแรกเตอร์ชัด เหมาะเป็นบัตรเสริมเฉพาะทาง',
    ],
    pros_en: [
      'Useful for Japan-related travel and dining',
      'Strong niche value as a secondary card',
    ],
    cons: [
      'เครือข่ายรับบัตรนอกเอเชียอาจไม่กว้างเท่า Visa/Mastercard',
      'ถ้าไม่ได้ใช้สิทธิทางเฉพาะ ความคุ้มค่าจะลดลงมาก',
    ],
    cons_en: [
      'Acceptance can be weaker than Visa or Mastercard outside Asia',
      'Value drops quickly if you do not use the niche benefits',
    ],
    warning: 'ควรพกคู่กับ Visa หรือ Mastercard เสมอเวลาเดินทาง',
    warning_en: 'Carry a Visa or Mastercard backup when traveling.',
    officialUrl: 'https://www.ktc.co.th',
    affiliateUrl: '',
    color: '#CC0000',
    gradient: 'linear-gradient(135deg, #CC0000, #FF4D4D)',
  },
  {
    id: 'cash-card-installment',
    name: 'KTC PROUD',
    name_en: 'KTC PROUD',
    bank: 'เคทีซี',
    bank_en: 'KTC',
    type: 'points',
    annualFee: 0,
    feeWaiver: 'ฟรีตลอดชีพ',
    feeWaiver_en: 'Free for life',
    minIncome: 12000,
    cashbackRate: 'ไม่มี',
    cashbackRate_en: 'None',
    pointsRate: 'ใช้ซื้อสินค้าได้และผ่อนบางร้าน',
    pointsRate_en: 'Usable for shopping and installments',
    benefits: [
      'เด่นเรื่องผ่อน 0% ตามร้านค้าที่ร่วมรายการ',
      'โอนเงินเข้าบัญชีได้สะดวก',
      'รายได้เริ่มต้นสมัครไม่สูงมาก',
    ],
    benefits_en: [
      'Useful for selected 0% installment plans',
      'Convenient cash transfer feature',
      'Accessible entry income threshold',
    ],
    pros: [
      'เหมาะเป็นเครื่องมือจัดการกระแสเงินสดระยะสั้น',
      'ใช้เป็นบัตรสำรองยามจำเป็นได้',
    ],
    pros_en: [
      'Useful for short-term cash-flow management',
      'Can work as an emergency backup product',
    ],
    cons: [
      'ถ้ากดเงินสด ดอกเบี้ยสูงและเสี่ยงเป็นหนี้เร็ว',
      'ไม่ใช่บัตรที่เด่นเรื่องรางวัลจากการใช้จ่าย',
    ],
    cons_en: [
      'Cash withdrawal can become expensive very quickly',
      'Not designed for reward maximization',
    ],
    warning: 'ไม่ควรใช้กดเงินสดถ้าไม่จำเป็นจริง',
    warning_en: 'Avoid cash withdrawals unless absolutely necessary.',
    officialUrl: 'https://www.ktc.co.th',
    affiliateUrl: '',
    color: '#E01A22',
    gradient: 'linear-gradient(135deg, #E01A22, #FF4D4D)',
  },
];

export const CARD_TYPES = [
  { id: 'all', name: 'ทั้งหมด', name_en: 'All' },
  { id: 'cashback', name: 'เงินคืน', name_en: 'Cashback' },
  { id: 'travel', name: 'ท่องเที่ยว', name_en: 'Travel' },
  { id: 'points', name: 'สะสมคะแนน', name_en: 'Points' },
  { id: 'student', name: 'เริ่มต้น', name_en: 'Starter' },
];
