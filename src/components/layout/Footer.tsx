import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* ... (ส่วนประกอบอื่นๆ ของ Footer ด้านบนคงเดิม) ... */}
          <div className={styles.brand}>
            <div className={styles.logo}>💰 Thai Calqly<span className={styles.accent}>Hub</span></div>
            <p className={styles.desc}>เครื่องมือคำนวณการเงินส่วนบุคคลสำหรับคนไทย พร้อมบทความอธิบายเรื่องเงินให้เข้าใจง่าย</p>
          </div>
          <div className={styles.linkGroup}>
            <h4>เครื่องมือ</h4>
            <Link href="/calculators/tax">คำนวณภาษี</Link>
            <Link href="/calculators/loan">สินเชื่อ/ผ่อนชำระ</Link>
            <Link href="/calculators/retirement">วางแผนเกษียณ</Link>
            <Link href="/calculators/roi">ROI ลงทุน</Link>
            <Link href="/calculators/credit-cards">เปรียบเทียบบัตรเครดิต</Link>
          </div>
          <div className={styles.linkGroup}>
            <h4>บทความ</h4>
            <Link href="/articles/thai-tax-guide-2569">ภาษี 2569</Link>
            <Link href="/articles/home-loan-guide-2569">สินเชื่อบ้าน</Link>
            <Link href="/articles/retirement-planning-first-jobber">วางแผนเกษียณ</Link>
            <Link href="/articles/thai-labor-law-finance-2569">กฎหมายแรงงาน</Link>
            <Link href="/articles/consumer-protection-law-2569">คุ้มครองผู้บริโภค</Link>
            <Link href="/articles/digital-asset-tax-law-2569">ภาษีคริปโต</Link>
          </div>
          <div className={styles.linkGroup}>
            <h4>แหล่งอ้างอิง</h4>
            <a href="https://www.rd.go.th" target="_blank" rel="noopener noreferrer">กรมสรรพากร</a>
            <a href="https://www.bot.or.th" target="_blank" rel="noopener noreferrer">ธนาคารแห่งประเทศไทย</a>
            <a href="https://www.sec.or.th" target="_blank" rel="noopener noreferrer">ก.ล.ต.</a>
          </div>
        </div>
        
        <div className={styles.disclaimer}>
          <p>⚠️ <strong>คำเตือน:</strong> ข้อมูลในเว็บไซต์นี้จัดทำเพื่อการศึกษาเท่านั้น ไม่ถือเป็นคำแนะนำทางการเงินหรือภาษี กรุณาปรึกษาผู้เชี่ยวชาญก่อนตัดสินใจทางการเงิน ข้อมูลอ้างอิงจากกรมสรรพากรและธนาคารแห่งประเทศไทย อาจมีการเปลี่ยนแปลง</p>
        </div>

        {/* 👇 ส่วนที่แก้ไข: เพิ่ม flexbox และลิงก์นโยบาย 👇 */}
        <div className={styles.bottom}>
          <p>© {new Date().getFullYear() + 543} Thai Calqly — All rights reserved</p>
          <div className={styles.legalLinks}>
            <Link href="/about-us">เกี่ยวกับเรา / ติดต่อทีมงาน</Link>
            <span className={styles.dot}>•</span>
            <Link href="/terms">ข้อตกลงการใช้งาน</Link>
            <span className={styles.dot}>•</span>
            <Link href="/privacy">นโยบายความเป็นส่วนตัว</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}