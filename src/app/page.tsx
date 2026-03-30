import Link from 'next/link';
import styles from './page.module.css';
import AnimatedCounter from '@/components/AnimatedCounter';

const CALCULATORS = [
  { href: '/calculators/tax', icon: '📋', title: 'คำนวณภาษีเงินได้', desc: 'คำนวณภาษีบุคคลธรรมดา พ.ศ. 2569 พร้อมค่าลดหย่อนทุกรายการ', color: '#6366F1' },
  { href: '/calculators/loan', icon: '🏠', title: 'สินเชื่อ / ผ่อนชำระ', desc: 'คำนวณค่างวด ดอกเบี้ย พร้อมตารางผ่อนชำระแบบละเอียด', color: '#10B981' },
  { href: '/calculators/retirement', icon: '🏖️', title: 'วางแผนเกษียณ', desc: 'วิเคราะห์เงินออม Gap Analysis พร้อมกราฟ projection', color: '#F59E0B' },
  { href: '/calculators/roi', icon: '📈', title: 'ROI การลงทุน', desc: 'คำนวณผลตอบแทน DCA เปรียบเทียบกับฝากธนาคาร', color: '#8B5CF6' },
  { href: '/calculators/credit-cards', icon: '💳', title: 'เปรียบเทียบบัตรเครดิต', desc: 'เปรียบเทียบบัตรเครดิตจากธนาคารชั้นนำ เลือกให้เหมาะกับคุณ', color: '#EC4899' },
];

const STATS = [
  { value: 5, suffix: '+', label: 'เครื่องมือคำนวณ' },
  { value: 8, suffix: '+', label: 'บทความคุณภาพ' },
  { value: 100, suffix: '%', label: 'ฟรี ไม่มีค่าใช้จ่าย' },
  { value: 2569, suffix: '', label: 'ข้อมูลปีล่าสุด' },
];

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGrid} />
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>🇹🇭 สำหรับคนไทย • ข้อมูลปี พ.ศ. 2569</div>
          <h1 className={styles.heroTitle}>
            เครื่องมือ<span className={styles.gradientText}>คำนวณการเงิน</span><br />
            ส่วนบุคคลที่ดีที่สุด
          </h1>
          <p className={styles.heroSub}>
            คำนวณภาษี วางแผนผ่อนชำระ ออมเกษียณ เช็คผลตอบแทน<br />
            พร้อมบทความอธิบายง่ายๆ อิงข้อมูลจากกรมสรรพากรและ BOT
          </p>
          <div className={styles.heroCTA}>
            <Link href="/calculators" className="btn btn-primary btn-lg">
              เริ่มใช้งานเลย →
            </Link>
            <Link href="/articles" className="btn btn-secondary btn-lg">
              อ่านบทความ
            </Link>
          </div>
        </div>
        <div className={styles.heroFloats}>
          <span className={styles.float1}>💰</span>
          <span className={styles.float2}>📊</span>
          <span className={styles.float3}>🏠</span>
          <span className={styles.float4}>📋</span>
        </div>
      </section>

      {/* Calculator Cards */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>เครื่องมือ<span className={styles.gradientText}>คำนวณการเงิน</span></h2>
            <p>ทุกเครื่องมือที่คุณต้องการสำหรับวางแผนการเงิน คำนวณแบบ Real-time ใช้งานฟรี</p>
          </div>
          <div className={styles.calcGrid}>
            {CALCULATORS.map((calc, i) => (
              <Link href={calc.href} key={i} className={styles.calcCard} style={{ '--card-color': calc.color } as React.CSSProperties}>
                <div className={styles.calcIcon}>{calc.icon}</div>
                <h3>{calc.title}</h3>
                <p>{calc.desc}</p>
                <span className={styles.calcArrow}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.statsSection}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            {STATS.map((stat, i) => (
              <div key={i} className={styles.statCard}>
                <div className={styles.statValue}>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.trustSection}>
            <h2>ข้อมูลน่าเชื่อถือ จากแหล่งที่เชื่อถือได้</h2>
            <div className={styles.trustGrid}>
              <div className={styles.trustCard}>
                <span>📊</span>
                <h4>กรมสรรพากร</h4>
                <p>อัตราภาษีและค่าลดหย่อนอ้างอิงจาก rd.go.th</p>
              </div>
              <div className={styles.trustCard}>
                <span>🏦</span>
                <h4>ธนาคารแห่งประเทศไทย</h4>
                <p>อัตราดอกเบี้ยอ้างอิงจาก bot.or.th</p>
              </div>
              <div className={styles.trustCard}>
                <span>🔒</span>
                <h4>ปลอดภัย</h4>
                <p>ข้อมูลคำนวณบนเครื่องคุณ ไม่ส่งไปที่ไหน</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
