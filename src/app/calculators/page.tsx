import Link from 'next/link';
import type { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'เครื่องมือคำนวณการเงิน — CalqlyHub',
  description: 'รวมเครื่องมือคำนวณการเงินส่วนบุคคล คำนวณภาษี สินเชื่อ วางแผนเกษียณ ROI เปรียบเทียบบัตรเครดิต',
};

const TOOLS = [
  { href: '/calculators/tax', icon: '📋', title: 'คำนวณภาษีเงินได้', desc: 'คำนวณภาษีเงินได้บุคคลธรรมดา พ.ศ. 2569 อัตราก้าวหน้า ค่าลดหย่อนทุกรายการ พร้อมคำแนะนำประหยัดภาษี', badge: 'ยอดนิยม', color: '#6366F1' },
  { href: '/calculators/loan', icon: '🏠', title: 'สินเชื่อ / ผ่อนชำระ', desc: 'คำนวณค่างวดรายเดือน ดอกเบี้ยรวม ตารางผ่อนชำระ รองรับสินเชื่อบ้าน รถ ส่วนบุคคล พร้อมเปรียบเทียบ', badge: 'แนะนำ', color: '#10B981' },
  { href: '/calculators/retirement', icon: '🏖️', title: 'วางแผนเกษียณ', desc: 'วิเคราะห์เงินที่ต้องมีเมื่อเกษียณ Gap Analysis พร้อมกราฟ projection ปรับเงินเฟ้อ', badge: '', color: '#F59E0B' },
  { href: '/calculators/roi', icon: '📈', title: 'ROI การลงทุน', desc: 'คำนวณผลตอบแทนการลงทุน ทั้งแบบก้อนเดียวและ DCA เปรียบเทียบกับฝากธนาคาร', badge: '', color: '#8B5CF6' },
  { href: '/calculators/credit-cards', icon: '💳', title: 'เปรียบเทียบบัตรเครดิต', desc: 'เปรียบเทียบบัตรเครดิตจากธนาคารชั้นนำ Cashback Miles Points เลือกให้เหมาะกับไลฟ์สไตล์', badge: '', color: '#EC4899' },
];

export default function CalculatorsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>🧮 เครื่องมือ<span className={styles.accent}>คำนวณการเงิน</span></h1>
          <p>ทุกเครื่องมือที่คุณต้องการสำหรับวางแผนการเงินส่วนบุคคล คำนวณแบบ Real-time อิงข้อมูลปี พ.ศ. 2569</p>
        </div>
        <div className={styles.grid}>
          {TOOLS.map((tool, i) => (
            <Link href={tool.href} key={i} className={styles.card} style={{ '--accent': tool.color } as React.CSSProperties}>
              <div className={styles.cardTop}>
                <span className={styles.icon}>{tool.icon}</span>
                {tool.badge && <span className={styles.badge}>{tool.badge}</span>}
              </div>
              <h3>{tool.title}</h3>
              <p>{tool.desc}</p>
              <div className={styles.cardAction}>เริ่มคำนวณ →</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
