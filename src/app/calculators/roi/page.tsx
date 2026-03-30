'use client';
import { useState, useMemo } from 'react';
import { calculateROI, defaultROIInput } from '@/utils/roiCalculations';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import styles from './page.module.css';

export const metadata = {
  title: 'คำนวณผลตอบแทนการลงทุน (ROI & DCA)',
  description: 'เครื่องคิดเลขคำนวณผลตอบแทนการลงทุนแบบก้อนเดียวและรายเดือน (DCA) เปรียบเทียบกับดอกเบี้ยเงินฝากธนาคาร ใช้งานฟรี 100% ที่ CalqlyHub',
  alternates: {
    canonical: '/calculators/roi',
  },
};

export default function ROIPage() {
  const [input, setInput] = useState(defaultROIInput);
  const update = (k: string, v: number) => setInput(p => ({ ...p, [k]: v }));
  const result = useMemo(() => calculateROI(input), [input]);
  const maxVal = Math.max(...result.yearlyData.map(d => d.portfolioValue), 1);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'เครื่องคิดเลขคำนวณผลตอบแทนการลงทุน ROI',
    applicationCategory: 'FinanceApplication',
    description: 'คำนวณผลตอบแทนการลงทุนแบบก้อนเดียวและ DCA พร้อมเปรียบเทียบดอกเบี้ยเงินฝากธนาคาร',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'THB' }
  };

  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>📈 คำนวณ<span className={styles.accent}>ROI การลงทุน</span></h1>
          <p>คำนวณผลตอบแทนการลงทุนทั้งแบบก้อนเดียวและ DCA พร้อมเปรียบเทียบกับฝากธนาคาร</p>
        </div>
        <div className={styles.layout}>
          <div className={styles.formPanel}>
            <h3>💰 ข้อมูลการลงทุน</h3>
            <div className={styles.inputGroup}><label>เงินลงทุนเริ่มต้น (บาท)</label><input type="number" className="input-field" value={input.initialInvestment || ''} onChange={e => update('initialInvestment', +e.target.value)} /></div>
            <div className={styles.inputGroup}><label>ลงทุนเพิ่มต่อเดือน — DCA (บาท)</label><input type="number" className="input-field" value={input.monthlyInvestment || ''} onChange={e => update('monthlyInvestment', +e.target.value)} /></div>
            <div className={styles.inputGroup}>
              <label>ผลตอบแทนคาดหวัง (%/ปี)</label>
              <input type="number" className="input-field" step="0.5" value={input.annualReturn} onChange={e => update('annualReturn', +e.target.value)} />
              <input type="range" className="range-slider" min={0} max={20} step={0.5} value={input.annualReturn} onChange={e => update('annualReturn', +e.target.value)} />
            </div>
            <div className={styles.inputGroup}><label>ระยะเวลาลงทุน (ปี)</label><input type="number" className="input-field" min={1} max={50} value={input.investmentYears} onChange={e => update('investmentYears', +e.target.value)} /></div>

            <div className={styles.benchmarks}>
              <h4>📊 ผลตอบแทนเฉลี่ยอ้างอิง</h4>
              <div className={styles.bmGrid}>
                <span className={styles.bmItem} onClick={() => update('annualReturn', 1.5)}>ฝากธนาคาร ~1.5%</span>
                <span className={styles.bmItem} onClick={() => update('annualReturn', 4)}>ตราสารหนี้ ~4%</span>
                <span className={styles.bmItem} onClick={() => update('annualReturn', 7)}>กองทุนรวมผสม ~7%</span>
                <span className={styles.bmItem} onClick={() => update('annualReturn', 10)}>หุ้นไทย ~10%</span>
              </div>
            </div>
          </div>

          <div className={styles.resultPanel}>
            <div className={styles.mainResult}>
              <div className={styles.resultLabel}>มูลค่าเมื่อสิ้นสุด</div>
              <div className={styles.resultValue}>{formatCurrency(result.finalValue)}</div>
            </div>
            <div className={styles.resultGrid}>
              <div className={styles.mr}><span>เงินลงทุนรวม</span><strong>{formatCurrency(result.totalInvested)}</strong></div>
              <div className={styles.mr}><span>กำไรรวม</span><strong style={{color:'var(--success-400)'}}>+{formatCurrency(result.totalReturns)}</strong></div>
              <div className={styles.mr}><span>ผลตอบแทนรวม</span><strong style={{color:'var(--success-400)'}}>+{formatPercent(result.totalReturnPercent)}</strong></div>
              <div className={styles.mr}><span>CAGR</span><strong>{formatPercent(result.cagr)}</strong></div>
            </div>

            <div className={styles.comparison}>
              <h4>เปรียบเทียบกับฝากธนาคาร (1.5%)</h4>
              <div className={styles.compRow}><span>ลงทุน {formatPercent(input.annualReturn, 1)}</span><strong className={styles.compGood}>{formatCurrency(result.finalValue)}</strong></div>
              <div className={styles.compRow}><span>ฝากธนาคาร 1.5%</span><strong className={styles.compNeutral}>{formatCurrency(result.bankComparison)}</strong></div>
              <div className={styles.compRow}><span>ส่วนต่าง</span><strong className={styles.compGood}>+{formatCurrency(result.finalValue - result.bankComparison)}</strong></div>
            </div>

            {/* Bar Chart */}
            <div className={styles.chartSection}>
              <h4>📈 การเติบโตของเงินลงทุน</h4>
              <div className={styles.barChart}>
                {result.yearlyData.map((d, i) => (
                  <div key={i} className={styles.barGroup}>
                    <div className={styles.barContainer}>
                      <div className={styles.barReturns} style={{height: `${(d.returns / maxVal) * 100}%`}} />
                      <div className={styles.barInvested} style={{height: `${(d.totalInvested / maxVal) * 100}%`}} />
                    </div>
                    <span className={styles.barLabel}>ปี{d.year}</span>
                  </div>
                ))}
              </div>
              <div className={styles.chartLegend}>
                <span><span className={styles.dotInvested}/>เงินลงทุน</span>
                <span><span className={styles.dotReturns}/>ผลตอบแทน</span>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Section */}
        <div style={{ marginTop: '3rem', background: 'var(--c-surface, #fff)', padding: '2rem', borderRadius: '1.25rem', border: '1px solid var(--c-border, rgba(0,0,0,0.07))', color: 'var(--c-text-2, #4a4a42)' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--c-text, #1a1a18)', marginBottom: '1rem', borderBottom: '2px solid var(--c-primary-pale, #e8f5ef)', paddingBottom: '0.75rem', fontWeight: 800 }}>💡 เกร็ดความรู้เรื่องการลงทุน (ROI &amp; DCA)</h2>
          
          <h3 style={{ fontSize: '1.05rem', color: 'var(--c-primary-dark, #1f5942)', marginTop: '1.5rem', marginBottom: '0.5rem', fontWeight: 700 }}>ROI (Return on Investment) คืออะไร?</h3>
          <p style={{ lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.925rem' }}>
            <strong>ROI</strong> คือ &quot;อัตราส่วนผลตอบแทนจากการลงทุน&quot; เป็นตัวชี้วัดที่บอกว่าเราได้กำไรหรือขาดทุนเป็นสัดส่วนกี่เปอร์เซ็นต์เมื่อเทียบกับ &quot;เงินต้นที่ลงทุนไป&quot; 
            ยิ่ง ROI สูงก็แปลว่าพอร์ตของเราเติบโตได้ดี คุ้มค่าแก่การลงทุนนั้นๆ อย่างไรก็ตามเครื่องคิดเลขนี้ไม่เพียงแต่ให้ค่า ROI รวม แต่ยังคำนวณอัตราการเติบโตเฉลี่ยแบบทบต้นต่อปี (CAGR) ที่สะท้อนผลลัพธ์รายปีได้แม่นยำกว่าด้วย 
          </p>

          <h3 style={{ fontSize: '1.05rem', color: 'var(--c-primary-dark, #1f5942)', marginTop: '1.5rem', marginBottom: '0.5rem', fontWeight: 700 }}>ความมหัศจรรย์ของดอกเบี้ยทบต้น (Compound Interest)</h3>
          <p style={{ lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.925rem' }}>
            อัลเบิร์ต ไอน์สไตน์ เคยกล่าวไว้ว่า <i>&quot;ดอกเบี้ยทบต้นคือสิ่งมหัศจรรย์อันดับที่ 8 ของโลก&quot;</i> มันคือการที่เรานำ &quot;กำไร&quot; หรือ &quot;ผลตอบแทน&quot; ที่ได้ในแต่ละรอบปี 
            ไปผนวกกลับเป็นการลงทุนต่อตั้งต้นสำหรับรอบถัดไปซ้ำๆ เมื่อกาลเวลาผ่านไป ฐานเงินทุนที่มีขนาดใหญ่ขึ้นก็จะผลิตกำไรออกมาในอัตราที่ก้าวกระโดดทวีคูณ ไม่ได้เพิ่มเป็นเพียงกราฟเส้นตรง 
            เพราะดอกเบี้ยที่เกิดขึ้นใหม่สามารถงอกเงยนำไปสร้างดอกเบี้ยเพิ่มเติมซ้อนกันได้ต่อไปอย่างมหาศาล!
          </p>

          <h3 style={{ fontSize: '1.05rem', color: 'var(--c-primary-dark, #1f5942)', marginTop: '1.5rem', marginBottom: '0.5rem', fontWeight: 700 }}>DCA (Dollar-Cost Averaging) ดีกว่าการลงทุนแบบก้อนเดียวยังไง?</h3>
          <p style={{ lineHeight: 1.7, marginBottom: '0.5rem', fontSize: '0.925rem' }}>
            <strong>DCA</strong> คือการทยอยลงทุนด้วยเงินจำนวนเท่าๆ กันอย่างสม่ำเสมอเป็นประจำ (เช่น ทุกๆ เดือน) โดยไม่ต้องสนใจว่าตลาดช่วงนั้นราคาหุ้นจะขึ้นหรือลง:
          </p>
          <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.7, fontSize: '0.925rem' }}>
            <li style={{ marginBottom: '0.5rem' }}><strong>ไม่ต้องคอยกะจังหวะ (Timing the Market):</strong> เราไม่ต้องมากังวลว่าตอนนี้ของแพงไปไหม อาจะเข้าซื้อทันทีหรือรอดี เพราะการพยายามจับจังหวะมักผิดพลาดเสมอ</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>เฉลี่ยต้นทุนให้ถูกลง:</strong> ตอนที่ราคาหุ้นตกหนัก เราจะได้ปริมาณสินทรัพย์ (หน่วยลงทุน) เพิ่มขึ้นโดยอัตโนมัติจากเงินก้อนเดิม ทำให้ต้นทุนระยะยาวเฉลี่ยของเราต่ำลง ช่วยลดความเสี่ยงจากวิกฤตความผันผวน</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>สร้างวินัยการออม:</strong> ทำได้ง่าย เป็นระบบ และช่วยให้เงินออมกลายเป็นการสร้างความมั่งคั่งระยะยาวได้ทันทีแม้ไม่ได้มีเงินก้อนใหญ่</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
