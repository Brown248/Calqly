'use client';
import { useState, useMemo } from 'react';
import { calculateLoan, LOAN_TYPES, REFERENCE_RATES } from '@/utils/loanCalculations';
import { formatCurrency } from '@/utils/formatters';
import styles from './page.module.css';

export const metadata = {
  title: 'คำนวณสินเชื่อบ้าน สินเชื่อรถ หนี้บัตรเครดิต',
  description: 'คำนวณค่างวดสินเชื่อ ดอกเบี้ย และตารางการผ่อนชำระต่อเดือนสำหรับสินเชื่อบ้าน รถ และหนี้บัตร ช่วยคุณวางแผนล้างหนี้ด้วย CalqlyHub',
  alternates: {
    canonical: '/calculators/loan',
  },
};

export default function LoanPage() {
  const [loanType, setLoanType] = useState('home');
  const [principal, setPrincipal] = useState(3000000);
  const [rate, setRate] = useState(6.5);
  const [termYears, setTermYears] = useState(30);
  const [extraPayment, setExtraPayment] = useState(0);
  const [promoRate, setPromoRate] = useState(3.0);
  const [promoYears, setPromoYears] = useState(3);
  const [usePromo, setUsePromo] = useState(true);
  const [showAmort, setShowAmort] = useState(false);


  const result = useMemo(() => calculateLoan({
    principal, annualRate: rate, termYears, extraPayment,
    promoRate: usePromo ? promoRate : undefined,
    promoYears: usePromo ? promoYears : undefined,
  }), [principal, rate, termYears, extraPayment, usePromo, promoRate, promoYears]);

  const handleTypeChange = (id: string) => {
    setLoanType(id);
    const t = LOAN_TYPES.find(x => x.id === id)!;
    setRate(t.defaultRate);
    setTermYears(t.defaultTerm);
    setUsePromo(id === 'home');
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'เครื่องคิดเลขคำนวณค่างวดสินเชื่อ',
    applicationCategory: 'FinanceApplication',
    description: 'คำนวณค่างวดสินเชื่อ ดอกเบี้ย และตารางการผ่อนชำระต่อเดือนสำหรับสินเชื่อบ้าน รถ',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'THB' }
  };

  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>🏠 คำนวณ<span className={styles.accent}>สินเชื่อ / ผ่อนชำระ</span></h1>
          <p>คำนวณค่างวดรายเดือน ดอกเบี้ยรวม ตารางผ่อนชำระ • ข้อมูลอ้างอิง พ.ศ. 2569</p>
        </div>

        <div className={styles.layout}>
          <div className={styles.formPanel}>
            {/* Loan Type */}
            <div className={styles.typeGrid}>
              {LOAN_TYPES.map(t => (
                <button key={t.id} className={`${styles.typeBtn} ${loanType === t.id ? styles.typeActive : ''}`} onClick={() => handleTypeChange(t.id)}>
                  {t.name}
                </button>
              ))}
            </div>

            <div className={styles.inputSection}>
              <div className={styles.inputGroup}>
                <label>จำนวนเงินกู้ (บาท)</label>
                <input type="number" className="input-field" value={principal} onChange={e => setPrincipal(+e.target.value)} />
                <input type="range" className="range-slider" min={100000} max={20000000} step={100000} value={principal} onChange={e => setPrincipal(+e.target.value)} />
                <div className={styles.rangeLabels}><span>100K</span><span>20M</span></div>
              </div>

              <div className={styles.row2}>
                <div className={styles.inputGroup}>
                  <label>อัตราดอกเบี้ย (%/ปี)</label>
                  <input type="number" className="input-field" step="0.1" value={rate} onChange={e => setRate(+e.target.value)} />
                </div>
                <div className={styles.inputGroup}>
                  <label>ระยะเวลาผ่อน (ปี)</label>
                  <input type="number" className="input-field" min={1} max={40} value={termYears} onChange={e => setTermYears(+e.target.value)} />
                </div>
              </div>

              {loanType === 'home' && (
                <div className={styles.promoSection}>
                  <div className={styles.toggleRow}>
                    <label>ดอกเบี้ยโปรโมชั่นช่วงแรก</label>
                    <button className={`${styles.toggleSwitch} ${usePromo ? styles.toggleOn : ''}`} onClick={() => setUsePromo(!usePromo)}>
                      <span className={styles.toggleDot} />
                    </button>
                  </div>
                  {usePromo && (
                    <div className={styles.row2}>
                      <div className={styles.inputGroup}>
                        <label>ดอกเบี้ยโปร (%/ปี)</label>
                        <input type="number" className="input-field" step="0.1" value={promoRate} onChange={e => setPromoRate(+e.target.value)} />
                      </div>
                      <div className={styles.inputGroup}>
                        <label>ระยะเวลาโปร (ปี)</label>
                        <input type="number" className="input-field" min={1} max={5} value={promoYears} onChange={e => setPromoYears(+e.target.value)} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className={styles.inputGroup}>
                <label>ผ่อนเพิ่มต่อเดือน (บาท) — <span style={{color:'var(--success-400)'}}>ช่วยประหยัดดอกเบี้ย!</span></label>
                <input type="number" className="input-field" value={extraPayment || ''} onChange={e => setExtraPayment(+e.target.value)} placeholder="0" />
              </div>
            </div>

            {/* Reference Rates */}
            <div className={styles.refSection}>
              <h4>📊 อัตราดอกเบี้ยอ้างอิง มี.ค. 2569</h4>
              <div className={styles.refGrid}>
                {Object.entries(REFERENCE_RATES).map(([key, val]) => (
                  <div key={key} className={styles.refCard}><span>{val.label}</span><strong>{val.min}% - {val.max}%</strong></div>
                ))}
              </div>
              <p className={styles.refNote}>อ้างอิง: ธนาคารแห่งประเทศไทย (bot.or.th), เว็บไซต์ธนาคารพาณิชย์</p>
            </div>
          </div>

          {/* Results */}
          <div className={styles.resultPanel}>
            <div className={styles.resultCard}>
              <div className={styles.resultLabel}>ค่างวดรายเดือน</div>
              <div className={styles.resultMain}>{formatCurrency(result.monthlyPayment)}</div>
              {result.monthlyPaymentNormal && usePromo && (
                <div className={styles.resultNote}>หลังโปร: {formatCurrency(result.monthlyPaymentNormal)}/เดือน</div>
              )}
            </div>

            <div className={styles.resultRow}>
              <div className={styles.miniResult}><span>ดอกเบี้ยรวม</span><strong style={{color:'var(--danger-400)'}}>{formatCurrency(result.totalInterest)}</strong></div>
              <div className={styles.miniResult}><span>จ่ายรวมทั้งหมด</span><strong>{formatCurrency(result.totalPayment)}</strong></div>
              <div className={styles.miniResult}><span>สัดส่วนดอกเบี้ย</span><strong>{result.interestRatio.toFixed(1)}%</strong></div>
            </div>

            {result.savings && result.savings > 0 && (
              <div className={styles.savingsCard}>
                ✅ ผ่อนเพิ่มเดือนละ {formatCurrency(extraPayment)} ประหยัดดอกเบี้ย <strong>{formatCurrency(result.savings)}</strong> หมดเร็วขึ้น <strong>{result.monthsSaved} เดือน</strong>
              </div>
            )}

            {/* Pie-like visual */}
            <div className={styles.pieSection}>
              <div className={styles.pieBar}>
                <div className={styles.piePrincipal} style={{width: `${(principal / result.totalPayment) * 100}%`}}>เงินต้น</div>
                <div className={styles.pieInterest} style={{width: `${(result.totalInterest / result.totalPayment) * 100}%`}}>ดอกเบี้ย</div>
              </div>
              <div className={styles.pieLegend}>
                <span><span className={styles.dotPrincipal}/>เงินต้น {formatCurrency(principal)}</span>
                <span><span className={styles.dotInterest}/>ดอกเบี้ย {formatCurrency(result.totalInterest)}</span>
              </div>
            </div>

            {/* Amortization Table */}
            <button className={styles.amortBtn} onClick={() => setShowAmort(!showAmort)}>
              {showAmort ? '🔼 ซ่อนตารางผ่อนชำระ' : '🔽 แสดงตารางผ่อนชำระ'}
            </button>
            {showAmort && (
              <div className={styles.amortTable}>
                <table className="data-table">
                  <thead><tr><th>เดือน</th><th>ค่างวด</th><th>เงินต้น</th><th>ดอกเบี้ย</th><th>ยอดคงเหลือ</th></tr></thead>
                  <tbody>
                    {result.amortization.filter((_, i) => i % 12 === 0 || i === result.amortization.length - 1).map(row => (
                      <tr key={row.month}>
                        <td>{row.month}</td>
                        <td>{formatCurrency(row.payment)}</td>
                        <td>{formatCurrency(row.principal)}</td>
                        <td>{formatCurrency(row.interest)}</td>
                        <td>{formatCurrency(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className={styles.amortNote}>* แสดงข้อมูลทุก 12 เดือน (ปีละ 1 แถว)</p>
              </div>
            )}

            {/* Advice */}
            <div className={styles.adviceSection}>
              <h4>💡 คำแนะนำ</h4>
              <ul>
                <li>ภาระผ่อนต่อเดือนไม่ควรเกิน 30-40% ของรายได้</li>
                <li>การผ่อนเพิ่มแม้เล็กน้อย สามารถประหยัดดอกเบี้ยได้มาก</li>
                <li>วางแผนรีไฟแนนซ์ทุก 3 ปี เมื่อหมดโปรโมชั่นดอกเบี้ย</li>
                <li>อย่าลืมนำดอกเบี้ยบ้านไปลดหย่อนภาษีได้สูงสุด 100,000 บาท/ปี</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Educational Section */}
        <div style={{ marginTop: '3rem', background: 'var(--c-surface, #fff)', padding: '2rem', borderRadius: '1.25rem', border: '1px solid var(--c-border, rgba(0,0,0,0.07))', color: 'var(--c-text-2, #4a4a42)' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--c-text, #1a1a18)', marginBottom: '1rem', borderBottom: '2px solid var(--c-primary-pale, #e8f5ef)', paddingBottom: '0.75rem', fontWeight: 800 }}>💡 เกร็ดความรู้เรื่องสินเชื่อบ้าน</h2>
          
          <h3 style={{ fontSize: '1.05rem', color: 'var(--c-primary-dark, #1f5942)', marginTop: '1.5rem', marginBottom: '0.5rem', fontWeight: 700 }}>ดอกเบี้ยแบบ &quot;ลดต้นลดดอก&quot; (Effective Rate) คืออะไร?</h3>
          <p style={{ lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.925rem' }}>
            สินเชื่อบ้านส่วนใหญ่จะคิดดอกเบี้ยแบบ <strong>ลดต้นลดดอก (Effective Rate)</strong> หมายความว่า ดอกเบี้ยในแต่ละเดือนจะถูกคำนวณจาก <b>&quot;เงินต้นคงเหลือจริง ณ ปัจจุบัน&quot;</b> เมื่อเราจ่ายค่างวดไป เงินส่วนหนึ่งจะถูกหักไปจ่ายดอกเบี้ยของเดือนนั้นก่อน ส่วนที่เหลือทั้งหมดจะนำไปหัก &quot;เงินต้น&quot; เมื่อเงินต้นลดลง ดอกเบี้ยในเดือนถัดไปก็จะลดลงตาม ทำให้เราผ่อนค่างวดต่อๆ ไปได้เบาขึ้นในระยะยาว
          </p>

          <h3 style={{ fontSize: '1.05rem', color: 'var(--c-primary-dark, #1f5942)', marginTop: '1.5rem', marginBottom: '0.5rem', fontWeight: 700 }}>ทำไมการ &quot;โปะบ้าน&quot; หรือผ่อนเพิ่มทุกเดือนถึงช่วยประหยัดดอกเบี้ยรวดเร็ว?</h3>
          <p style={{ lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.925rem' }}>
            เนื่องจากระบบคิดดอกเบี้ยตามเงินต้นคงเหลือ เงินที่คุณ <strong>&quot;จ่ายเกิน&quot; หรือ &quot;โปะเพิ่ม&quot;</strong> เข้าไปในแต่ละเดือนจะไม่ถูกนำไปคิดดอกเบี้ยซ้ำซ้อนแล้ว (เพราะดอกเบี้ยรอบเดือนนั้นถูกหักจากยอดชำระขั้นต่ำไปแล้ว) เงินชำระส่วนเกินนี้จึงวิ่งตรงไป <b>&quot;หักเงินต้นเต็มๆ 100%&quot;</b> ส่งผลให้ยอดหนี้ก้อนใหญ่ลดลงอย่างรวดเร็ว ทำให้อายุสัญญาการผ่อนสั้นลงหลายปี และประหยัดดอกเบี้ยสะสมได้อย่างมหาศาลดังที่เห็นในผลลัพธ์การคำนวณข้างต้น
          </p>
          
          <h3 style={{ fontSize: '1.05rem', color: 'var(--c-primary-dark, #1f5942)', marginTop: '1.5rem', marginBottom: '0.5rem', fontWeight: 700 }}>การรีไฟแนนซ์บ้าน (Refinance) คืออะไร และควรทำเมื่อไหร่?</h3>
          <p style={{ lineHeight: 1.7, marginBottom: '0.5rem', fontSize: '0.925rem' }}>
            <strong>รีไฟแนนซ์ (Refinance)</strong> คือการขอกู้เงินจากธนาคารแห่งใหม่เพื่อนำไปปิดหนี้กับธนาคารเดิมที่ผ่อนอยู่ โดยมีเป้าหมายคือการได้รับอัตราดอกเบี้ยที่ถูกลง (หรือบางกรณีอาจเป็นการเจรจาขอลดดอกเบี้ยกับธนาคารเดิมที่เรียกว่า <strong>รีเทนชัน - Retention</strong>)
          </p>
          <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.7, fontSize: '0.925rem' }}>
            <li><strong>ควรทำเมื่อไหร่?</strong> ปกติแล้วสัญญาสินเชื่อบ้านมักจะให้อัตราดอกเบี้ยต่ำเพียงช่วง 3 ปีแรก หลังจากนั้นจะลอยตัวตามอัตรา MRR ทำให้ดอกเบี้ยแพงขึ้นกระโดด เมื่อครบ 3 ปี (หรือเงื่อนไขห้ามปิดบัญชีก่อนกำหนดสิ้นสุดลง) ก็ถึงเวลาที่คุณควรเริ่มประเมินโปรถูกๆ เพื่อรีไฟแนนซ์ นำพาดอกเบี้ยให้กลับมาต่ำเหมือนใหม่</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
