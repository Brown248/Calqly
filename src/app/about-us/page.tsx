import { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'เกี่ยวกับเรา / ติดต่อ (About & Contact)',
  description: 'ทำความรู้จักกับ CalqlyHub ผู้ช่วยคำนวณการเงินส่วนบุคคลสำหรับคนไทย และช่องทางการติดต่อทีมงาน',
};

export default function AboutUsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerGlass}>
          <h1 className={styles.title}>เกี่ยวกับ CalqlyHub</h1>
          <p className={styles.subtitle}>
            ภารกิจของเราคือการทำให้เรื่องการเงินและภาษีของคนไทย เป็นเรื่องง่าย เข้าถึงได้ฟรี และแม่นยำที่สุด
          </p>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.section}>
          <div className="glass-card">
            <h2>🚀 จุดเริ่มต้นของเรา</h2>
            <p>
              <strong>CalqlyHub</strong> เกิดขึ้นจากความตั้งใจที่อยากให้คนไทยทุกคนมีเครื่องมือช่วยวางแผนการเงินที่ใช้งานง่าย ไม่ซับซ้อน และสะท้อนข้อมูลกฎหมายภาษี ดอกเบี้ย และข้อบังคับทางการเงินของไทยที่อัปเดตแบบเรียลไทม์
            </p>
            <p>
              เราเชื่อว่า "ความรู้ทางการเงิน (Financial Literacy)" คือรากฐานสำคัญสู่ความมั่นคงของชีวิต ทุกคนควรคำนวณภาษีเป็น วางแผนเกษียณได้ และเปรียบเทียบดอกเบี้ยบ้านได้อย่างครบถ้วนก่อนตัดสินใจกู้ยืม
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className="glass-card">
            <h2>💡 สิ่งที่เรามุ่งหวัง</h2>
            <ul className={styles.list}>
              <li>สร้างเครื่องมือคำนวณที่ <strong>แม่นยำ</strong> ตามกฎหมาย (เช่น ภาษีขั้นบันได 2568/2569)</li>
              <li>สร้างเนื้อหาที่อ่านแล้ว <strong>เข้าใจง่าย</strong> ไม่ต้องเป็นนักบัญชีก็รู้เรื่อง</li>
              <li>พัฒนาเว็บไซต์ที่ <strong>สะอาดตา ใช้งานได้จริง ไม่มีป๊อปอัปโฆษณาน่ารำคาญ</strong></li>
            </ul>
          </div>
        </section>

        <section id="contact" className={styles.section}>
          <div className="glass-card" style={{ textAlign: "center", borderTop: "4px solid var(--c-primary)" }}>
            <h2>📬 ติดต่อทีมงาน (Contact Us)</h2>
            <p style={{ marginBottom: "1.5rem" }}>
              หากมีข้อเสนอแนะ แจ้งปัญหาการใช้งาน สอบถามข้อมูล หรือต้องการติดต่อเพื่อเป็นพาร์ทเนอร์ สามารถส่งอีเมลมาหาเราได้โดยตรงที่:
            </p>
            <a href="mailto:support@calqlyhub.com" className={styles.contactBtn}>
              📩 support@calqlyhub.com
            </a>
            <p style={{ marginTop: "1.5rem", fontSize: "0.85rem", color: "var(--c-text-3)" }}>
              เราตั้งใจอ่านทุกข้อความและจะรีบตอบกลับคุณให้เร็วที่สุดครับ!
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
