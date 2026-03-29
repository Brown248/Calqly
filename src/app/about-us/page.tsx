import styles from './page.module.css';
import Link from 'next/link';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'เกี่ยวกับเรา / ติดต่อเรา (About & Contact) | CalqlyHub',
  description: 'ทำความรู้จักกับ CalqlyHub แพลตฟอร์มเครื่องมือคำนวณการเงิน วางแผนภาษี สินเชื่อ และเเกษียณที่ดีที่สุดสำหรับคนไทย พร้อมช่องทางการติดต่อทีมงาน',
  keywords: ['เครื่องมือคำนวณการเงิน', 'คำนวณภาษี', 'วางแผนเกษียณ', 'ติดต่อเรา CalqlyHub', 'เกี่ยวกับเรา CalqlyHub'],
  openGraph: {
    title: 'เกี่ยวกับเรา / ติดต่อเรา | CalqlyHub',
    description: 'ทำความรู้จักกับ CalqlyHub และแพลตฟอร์มเครื่องมือคำนวณการเงินคุณภาพ พร้อมช่องทางการติดต่อทีมงาน',
    url: '/about-us',
    type: 'website',
  },
};

export default function AboutUsPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1>เกี่ยวกับ <span className="gradient-text">CalqlyHub</span></h1>
          <p>เครื่องมือคำนวณการเงินส่วนบุคคลที่พัฒนาเพื่อคนไทยโดยเฉพาะ</p>
        </div>

        <section className={styles.section}>
          <div className="glass-card">
            <h2>จุดเริ่มต้นของเรา</h2>
            <p>
              CalqlyHub เกิดขึ้นจากความตั้งใจที่จะทำให้เรื่องการเงินและการวางแผนภาษีเป็นเรื่องง่ายสำหรับทุกคน 
              เราเข้าใจดีว่าในแต่ละปี กฎหมายภาษีและโครงสร้างทางการเงินมีการเปลี่ยนแปลงอยู่เสมอ 
              การคำนวณเหล่านั้นด้วยตัวเองอาจจะเป็นเรื่องที่ซับซ้อนและน่าปวดหัว
            </p>
            <p className={styles.marginTop}>
              เราจึงได้รวบรวมเครื่องมือคำนวณที่จำเป็นทั้งหมด ตั้งแต่ <strong>การคำนวณภาษีเงินได้บุคคลธรรมดา</strong>, 
              <strong>การคำนวณสินเชื่อ/เงินกู้</strong>, ไปจนถึง <strong>การวางแผนเกษียณอายุ</strong> และ <strong>ผลตอบแทนการลงทุน</strong> มาไว้ในที่เดียว 
              เพื่อให้คุณสามารถวางแผนเป้าหมายทางการเงินได้อย่างแม่นยำ ปลอดภัย และใช้งานได้ฟรี!
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className="grid-3">
            <div className="glass-card text-center">
              <div className={styles.icon}>🎯</div>
              <h3>ภารกิจของเรา</h3>
              <p>ให้คนไทยทุกคนเข้าถึงเครื่องมือการบริการจัดการเงินที่มีประสิทธิภาพและวางแผนอนาคตได้อย่างมั่นคง</p>
            </div>
            <div className="glass-card text-center">
              <div className={styles.icon}>🛡️</div>
              <h3>ความโปร่งใส ปลอดภัย</h3>
              <p>การคำนวณทั้งหมดเกิดขึ้นและทำงานบนเครื่องของคุณ (Client-side) ข้อมูลรายได้จะไม่ถูกส่งไปเก็บที่เซิร์ฟเวอร์ของเรา</p>
            </div>
            <div className="glass-card text-center">
              <div className={styles.icon}>💡</div>
              <h3>อัปเดตเสมอ</h3>
              <p>ข้อมูลอัตราตัวเลขและนโยบายเราอ้างอิงจากแหล่งที่เชื่อถือได้ระดับประเทศ เช่น กรมสรรพากร และ ธนาคารแห่งประเทศไทย</p>
            </div>
          </div>
        </section>

        <section id="contact" className={styles.section}>
          <div className="glass-card" style={{ textAlign: "center" }}>
            <h2>ติดต่อเรา</h2>
            <p>หากมีข้อเสนอแนะ แจ้งปัญหาการใช้งาน หรือต้องการติดต่อทีมงานแบบตรงไปตรงมา สามารถส่งอีเมลมาหาเราได้ที่</p>
            <div className={styles.marginTop} style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--primary-600)" }}>
              📧 <a href="mailto:invioly01@gmail.com" style={{ textDecoration: "none" }}>invioly01@gmail.com</a>

            </div>
          </div>
        </section>

        <div className={styles.cta}>
          <h2>พร้อมเริ่มวางแผนการเงินหรือยัง?</h2>
          <div className={styles.ctaButtons}>
            <Link href="/calculators" className="btn btn-primary btn-lg">
              ดูเครื่องมือคำนวณทั้งหมด
            </Link>
            <Link href="/articles" className="btn btn-secondary btn-lg">
              อ่านบทความความรู้
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
