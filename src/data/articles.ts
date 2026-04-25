export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  date: string;
  lastUpdated: string;
  author: {
    name: string;
    role: string;
    verified?: boolean;
  };
  icon: string;
  relatedCalc: string;
  content: ArticleSection[];
}

export interface ArticleSection {
  heading: string;
  body: string;
}

export function getArticles(locale: string): Article[] {
  return locale === 'en' ? ARTICLES_EN : ARTICLES_TH;
}

export const ARTICLES_TH: Article[] = [
  {
    slug: 'thai-tax-guide-2569',
    title: 'ภาษีเงินได้บุคคลธรรมดา 2569 แบบเข้าใจง่าย',
    excerpt: 'สรุปวิธีคำนวณภาษี ค่าลดหย่อนหลัก และสิ่งที่ควรรู้ก่อนยื่นแบบในปีภาษี 2569',
    category: 'ภาษี',
    readTime: 8,
    date: '2569-01-15',
    lastUpdated: '2569-03-20',
    author: {
      name: 'Calqly Editorial Team',
      role: 'ตรวจสอบโดยที่ปรึกษาภาษี',
      verified: true
    },
    icon: '📋',
    relatedCalc: '/calculators/tax',
    content: [
      {
        heading: 'ภาษีเงินได้บุคคลธรรมดาคืออะไร',
        body: 'ภาษีเงินได้บุคคลธรรมดาคือภาษีที่จัดเก็บจากรายได้ของบุคคล เช่น เงินเดือน โบนัส รายได้อิสระ และรายได้อื่นตามกฎหมายภาษี\n\nระบบภาษีไทยใช้โครงสร้างแบบก้าวหน้า หมายความว่ารายได้สุทธิยิ่งสูง อัตราภาษีที่ต้องชำระก็จะสูงขึ้นตามขั้นบันได',
      },
      {
        heading: 'คำนวณภาษีแบบสั้นที่สุด',
        body: '1. รวมรายได้ทั้งปี\n2. หักค่าใช้จ่ายตามประเภทเงินได้\n3. หักค่าลดหย่อน\n4. นำเงินได้สุทธิไปเทียบอัตราภาษี\n\nหัวใจสำคัญคือ “เงินได้สุทธิ” ไม่ใช่รายได้รวม',
      },
      {
        heading: 'ค่าลดหย่อนหลักที่คนทำงานมักใช้',
        body: 'ค่าลดหย่อนส่วนตัว 60,000 บาท ประกันสังคมไม่เกิน 9,000 บาท ดอกเบี้ยบ้านไม่เกิน 100,000 บาท และกองทุนลดหย่อนภาษี เช่น RMF หรือ Thai ESG ตามเพดานที่กฎหมายกำหนด\n\nก่อนซื้อกองทุนเพิ่ม ควรเช็กก่อนว่าตัวเองใช้สิทธิเต็มแล้วหรือยัง',
      },
      {
        heading: 'กำหนดยื่นแบบ',
        body: 'โดยทั่วไปการยื่นภาษีของรายได้ปี 2569 จะอยู่ในช่วงต้นปี 2570 และการยื่นออนไลน์มักได้เวลายืดหยุ่นมากกว่าการยื่นกระดาษ\n\nควรเก็บเอกสารรายได้และหลักฐานลดหย่อนให้ครบตั้งแต่ระหว่างปี จะช่วยลดความผิดพลาดตอนยื่นแบบได้มาก',
      },
    ],
  },
  {
    slug: 'home-loan-guide-2569',
    title: 'เลือกสินเชื่อบ้านปี 2569 ยังไงไม่ให้ผ่อนเหนื่อยเกิน',
    excerpt: 'แนวคิดเปรียบเทียบดอกเบี้ยบ้าน โปรโมชั่นช่วงแรก และวิธีดูค่างวดให้เหมาะกับรายได้จริง',
    category: 'สินเชื่อ',
    readTime: 7,
    date: '2569-02-01',
    lastUpdated: '2569-03-15',
    author: {
      name: 'ศิรภพ วงศ์วิวัฒน์',
      role: 'ผู้เชี่ยวชาญด้านสินเชื่อที่อยู่อาศัย',
      verified: true
    },
    icon: '🏠',
    relatedCalc: '/calculators/loan',
    content: [
      {
        heading: 'อย่าดูแค่ดอกเบี้ยปีแรก',
        body: 'โปรโมชันปีแรกที่ดูสวยมากอาจทำให้ตัดสินใจเร็วเกินไป สิ่งที่ควรดูจริงคือดอกเบี้ยเฉลี่ย 3 ปีแรก ค่าธรรมเนียม และอัตราหลังหมดโปร\n\nถ้าดูเฉพาะตัวเลขหน้าโฆษณา คุณอาจได้ค่างวดระยะยาวที่สูงกว่าที่คิดมาก',
      },
      {
        heading: 'ค่างวดที่ปลอดภัยควรอยู่ระดับไหน',
        body: 'แนวทางที่คนส่วนใหญ่ใช้คือให้ภาระหนี้ที่อยู่อาศัยอยู่ในช่วงประมาณ 30 ถึง 40 เปอร์เซ็นต์ของรายได้สุทธิครัวเรือน\n\nหากค่างวดสูงกว่านี้มาก ชีวิตจริงจะเริ่มตึง ทั้งเรื่องเงินสำรอง ฉุกเฉิน และค่าใช้จ่ายประจำวัน',
      },
      {
        heading: 'ผ่อนเพิ่มเดือนละนิดช่วยได้จริง',
        body: 'การโปะเพิ่มแม้เดือนละ 1,000 ถึง 3,000 บาท มีผลกับดอกเบี้ยรวมและระยะเวลาผ่อนมากกว่าที่หลายคนคิด โดยเฉพาะในช่วงต้นสัญญา\n\nถ้ามีรายได้พิเศษเป็นบางเดือน การโปะอย่างมีวินัยมักคุ้มกว่าปล่อยเงินนอนอยู่เฉยๆ',
      },
      {
        heading: 'รีไฟแนนซ์ควรคิดเมื่อไร',
        body: 'จังหวะที่คนมักเริ่มพิจารณารีไฟแนนซ์คือก่อนหมดช่วงดอกเบี้ยโปรโมชัน หรือเมื่อดอกเบี้ยลอยตัวกระโดดขึ้นชัดเจน\n\nแต่ต้องเอาค่าใช้จ่ายประกอบ เช่น ค่าจดจำนอง ค่าประเมิน และระยะเวลาที่จะอยู่บ้านหลังนั้นต่อไป มาคิดด้วยเสมอ',
      },
    ],
  },
  {
    slug: 'retirement-planning-first-jobber',
    title: 'เริ่มวางแผนเกษียณตั้งแต่เงินเดือนแรก',
    excerpt: 'หลักคิดง่ายๆ สำหรับคนเพิ่งเริ่มทำงาน ว่าควรเริ่มออมเท่าไร และทำไมเวลาเป็นตัวแปรที่สำคัญที่สุด',
    category: 'เกษียณ',
    readTime: 6,
    date: '2569-01-20',
    lastUpdated: '2569-02-28',
    author: {
      name: 'ทีมเนื้อหา Calqly',
      role: 'กองบรรณาธิการการเงิน',
      verified: true
    },
    icon: '🌴',
    relatedCalc: '/calculators/retirement',
    content: [
      {
        heading: 'ข้อได้เปรียบของคนที่เริ่มเร็ว',
        body: 'คนที่เริ่มออมเร็วไม่ได้ชนะเพราะเก่งกว่าเสมอไป แต่ชนะเพราะมีเวลาให้ผลตอบแทนทบต้นทำงานนานกว่า\n\nยิ่งเริ่มเร็ว คุณยิ่งต้องใส่เงินน้อยลงต่อเดือนเพื่อไปถึงเป้าหมายเดียวกัน',
      },
      {
        heading: 'ตั้งเป้ายังไงไม่ให้ไกลเกินจริง',
        body: 'เริ่มจากค่าใช้จ่ายที่อยากมีต่อเดือนหลังเกษียณ แล้วคูณด้วยจำนวนปีที่คาดว่าจะใช้ชีวิตหลังเกษียณ พร้อมเผื่อเงินเฟ้อและค่ารักษาพยาบาล\n\nเป้าหมายที่ดีไม่จำเป็นต้องดูสวย แต่ต้องสะท้อนชีวิตจริงที่คุณอยากอยู่',
      },
      {
        heading: 'เริ่มต้นแบบไม่กดดันตัวเอง',
        body: 'วิธีที่ทำต่อเนื่องได้มักดีกว่าวิธีที่ดูสมบูรณ์แบบแต่ทำได้ไม่เกินสองเดือน\n\nเริ่มจากสัดส่วนออมที่ไหวจริง เช่น 10 ถึง 20 เปอร์เซ็นต์ของรายได้ แล้วค่อยขยับเมื่อรายได้โตขึ้น',
      },
    ],
  },
  {
    slug: 'compound-interest-power',
    title: 'ดอกเบี้ยทบต้นทำงานยังไง และทำไมควรกลัวมันตอนเป็นหนี้',
    excerpt: 'อธิบายแบบตรงไปตรงมาว่าดอกเบี้ยทบต้นช่วยคนลงทุนยังไง และทำร้ายคนมีหนี้ยังไง',
    category: 'การลงทุน',
    readTime: 5,
    date: '2569-03-01',
    lastUpdated: '2569-03-25',
    author: {
      name: 'ธนัตถ์ จิตอาภรณ์, CFP®',
      role: 'นักวางแผนการเงินอิสระ',
      verified: true
    },
    icon: '📈',
    relatedCalc: '/calculators/roi',
    content: [
      {
        heading: 'ฝั่งดีของดอกเบี้ยทบต้น',
        body: 'เมื่อผลตอบแทนที่ได้ถูกนำกลับไปลงทุนต่อ เงินก้อนเดิมจะเริ่มโตบนฐานที่ใหญ่ขึ้นเรื่อยๆ\n\nช่วงแรกอาจดูช้า แต่ช่วงหลังผลต่างจะชัดมาก นี่คือเหตุผลว่าทำไมเวลาจึงสำคัญกว่าการพยายามจับจังหวะที่สมบูรณ์แบบ',
      },
      {
        heading: 'ฝั่งที่อันตรายเมื่อเป็นหนี้',
        body: 'ถ้าคุณเป็นหนี้ดอกเบี้ยสูง เช่น หนี้บัตรเครดิต ดอกเบี้ยทบต้นจะทำงานกับคุณในทางลบ ยิ่งจ่ายขั้นต่ำ ยิ่งใช้เวลาหลุดจากหนี้นาน\n\nในหลายกรณี การปิดหนี้ดอกเบี้ยสูงให้เร็วที่สุดคุ้มกว่าการรีบไปลงทุน',
      },
      {
        heading: 'สรุปแบบใช้งานได้จริง',
        body: 'ถ้าผลตอบแทนจากการลงทุนที่คาดหวังต่ำกว่าดอกเบี้ยหนี้ ควรจัดการหนี้ก่อน\n\nถ้าไม่มีหนี้ดอกเบี้ยสูงแล้ว การเริ่มลงทุนเร็วและสม่ำเสมอคือทางที่ดีที่สุดสำหรับคนส่วนใหญ่',
      },
    ],
  },
];

export const ARTICLES_EN: Article[] = [
  {
    slug: 'thai-tax-guide-2569',
    title: 'Thai Personal Income Tax 2026 Made Simple',
    excerpt: 'A practical summary of how to calculate tax, use core deductions, and prepare for filing in the 2026 tax year.',
    category: 'Tax',
    readTime: 8,
    date: '2026-01-15',
    lastUpdated: '2026-03-20',
    author: {
      name: 'Calqly Editorial Team',
      role: 'Verified by Tax Consultants',
      verified: true
    },
    icon: '📋',
    relatedCalc: '/calculators/tax',
    content: [
      {
        heading: 'What personal income tax means',
        body: 'Personal income tax applies to salary, bonuses, freelance income, and other taxable income sources.\n\nThailand uses a progressive tax system, so your effective burden increases as your net taxable income moves up the brackets.',
      },
      {
        heading: 'The shortest way to think about tax',
        body: '1. Add annual income\n2. Deduct eligible expenses\n3. Deduct allowances and deductions\n4. Apply the tax brackets\n\nThe number that matters most is net income, not gross income.',
      },
      {
        heading: 'Common deductions salaried workers use',
        body: 'The most common ones include the personal allowance, social security, home-loan interest, and tax-saving investments such as RMF or Thai ESG within legal limits.\n\nBefore buying extra funds, check whether you still have unused deduction room.',
      },
    ],
  },
  {
    slug: 'home-loan-guide-2569',
    title: 'How to Choose a Home Loan Without Overstretching Yourself',
    excerpt: 'A practical framework for comparing teaser rates, long-term loan costs, and monthly payments against real income.',
    category: 'Loan',
    readTime: 7,
    date: '2026-02-01',
    lastUpdated: '2026-03-15',
    author: {
      name: 'Siraphop Wongwiwat',
      role: 'Mortgage Loan Specialist',
      verified: true
    },
    icon: '🏠',
    relatedCalc: '/calculators/loan',
    content: [
      {
        heading: 'Do not judge a loan by year-one rate alone',
        body: 'A low first-year teaser rate may hide a much more expensive structure later. The more useful number is the average cost across the first few years, plus fees and post-promo pricing.',
      },
      {
        heading: 'A payment ratio that still feels livable',
        body: 'Many households aim to keep housing debt around 30 to 40 percent of net household income.\n\nOnce you go far above that range, daily life usually starts to feel tight very quickly.',
      },
      {
        heading: 'Small extra payments matter',
        body: 'Even modest extra payments can noticeably reduce total interest and shorten the payoff period, especially early in the loan.',
      },
    ],
  },
  {
    slug: 'retirement-planning-first-jobber',
    title: 'Start Retirement Planning From Your First Paycheck',
    excerpt: 'Simple principles for early-career workers who want a realistic retirement plan without overcomplicating it.',
    category: 'Retirement',
    readTime: 6,
    date: '2026-01-20',
    lastUpdated: '2026-02-28',
    author: {
      name: 'Calqly Content Team',
      role: 'Financial Editorial',
      verified: true
    },
    icon: '🌴',
    relatedCalc: '/calculators/retirement',
    content: [
      {
        heading: 'Why starting early matters',
        body: 'People who start earlier do not necessarily win because they save more. They win because compounding gets more time to work.',
      },
      {
        heading: 'How to set a retirement target',
        body: 'Start with the monthly spending you want in retirement, estimate how long that phase may last, and then layer in inflation and healthcare risk.',
      },
      {
        heading: 'A plan you can actually sustain',
        body: 'A modest plan you can keep for years is better than an ambitious plan you abandon after two months.',
      },
    ],
  },
  {
    slug: 'compound-interest-power',
    title: 'Compound Interest: Great for Investing, Dangerous for Debt',
    excerpt: 'A direct explanation of why compounding helps investors and punishes people who carry high-interest debt.',
    category: 'Investing',
    readTime: 5,
    date: '2026-03-01',
    lastUpdated: '2026-03-25',
    author: {
      name: 'Thanat Jitaporn, CFP®',
      role: 'Independent Financial Planner',
      verified: true
    },
    icon: '📈',
    relatedCalc: '/calculators/roi',
    content: [
      {
        heading: 'The upside of compounding',
        body: 'When returns are reinvested, money starts growing on an expanding base.\n\nEarly growth feels slow, but later-stage growth can become dramatic.',
      },
      {
        heading: 'The dangerous side of compounding',
        body: 'The same mechanism works against you when you carry expensive debt. Minimum payments and high interest rates can keep you trapped much longer than expected.',
      },
      {
        heading: 'A practical rule',
        body: 'If your debt costs more than your realistic expected investment return, paying down that debt first is often the better move.',
      },
    ],
  },
];

export const ARTICLES = ARTICLES_TH;
