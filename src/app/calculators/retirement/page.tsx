'use client';
import { useState, useMemo } from 'react';
import { calculateRetirement, defaultRetirementInput } from '@/utils/retirementCalc';
import { formatCurrency } from '@/utils/formatters';
import styles from './page.module.css';

export default function RetirementPage() {
  const [input, setInput] = useState(defaultRetirementInput);
  const update = (k: string, v: number) => setInput(p => ({ ...p, [k]: v }));
  const result = useMemo(() => calculateRetirement(input), [input]);

  const maxSavings = Math.max(...result.yearlyProjection.map(y => y.savings));

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>🏖️ วางแผน<span className={styles.accent}>เกษียณ</span></h1>
          <p>วิเคราะห์เงินที่ต้องมีเมื่อเกษียณ พร้อมแผนการออมที่เหมาะกับคุณ • อิงข้อมูล พ.ศ. 2569</p>
        </div>
        <div className={styles.layout}>
          <div className={styles.formPanel}>
            <h3>📝 ข้อมูลของคุณ</h3>
            <div className={styles.grid2}>
              <div className={styles.inputGroup}><label>อายุปัจจุบัน</label><input type="number" className="input-field" value={input.currentAge} onChange={e => update('currentAge', +e.target.value)} /></div>
              <div className={styles.inputGroup}><label>อายุเกษียณ</label><input type="number" className="input-field" value={input.retirementAge} onChange={e => update('retirementAge', +e.target.value)} /></div>
              <div className={styles.inputGroup}><label>อายุคาดหวัง</label><input type="number" className="input-field" value={input.lifeExpectancy} onChange={e => update('lifeExpectancy', +e.target.value)} /></div>
              <div className={styles.inputGroup}><label>รายได้ต่อเดือน (บาท)</label><input type="number" className="input-field" value={input.monthlyIncome || ''} onChange={e => update('monthlyIncome', +e.target.value)} /></div>
              <div className={styles.inputGroup}><label>เงินออมปัจจุบัน (บาท)</label><input type="number" className="input-field" value={input.currentSavings || ''} onChange={e => update('currentSavings', +e.target.value)} /></div>
              <div className={styles.inputGroup}><label>ออมต่อเดือน (บาท)</label><input type="number" className="input-field" value={input.monthlySaving || ''} onChange={e => update('monthlySaving', +e.target.value)} /></div>
              <div className={styles.inputGroup}><label>ค่าใช้จ่ายหลังเกษียณ/เดือน</label><input type="number" className="input-field" value={input.monthlyExpenseAfterRetire || ''} onChange={e => update('monthlyExpenseAfterRetire', +e.target.value)} /></div>
              <div className={styles.inputGroup}><label>ผลตอบแทนก่อนเกษียณ (%/ปี)</label><input type="number" className="input-field" step="0.5" value={input.expectedReturn} onChange={e => update('expectedReturn', +e.target.value)} /></div>
              <div className={styles.inputGroup}><label>ผลตอบแทนหลังเกษียณ (%/ปี)</label><input type="number" className="input-field" step="0.5" value={input.postRetireReturn} onChange={e => update('postRetireReturn', +e.target.value)} /></div>
              <div className={styles.inputGroup}><label>อัตราเงินเฟ้อ (%/ปี)</label><input type="number" className="input-field" step="0.1" value={input.inflationRate} onChange={e => update('inflationRate', +e.target.value)} /></div>
            </div>

            <div className={styles.adviceBox}>
              <h4>💡 คำแนะนำจากผู้เชี่ยวชาญ</h4>
              <ul>
                <li>ควรออมอย่างน้อย 15-20% ของรายได้ต่อเดือน</li>
                <li>ผลตอบแทนเฉลี่ย: กองทุนหุ้น 7-10%, ตราสารหนี้ 3-5%, ฝากธนาคาร 1-2%</li>
                <li>ลงทุนใน RMF / Thai ESG ได้ทั้งลดหย่อนภาษีและออมเกษียณ</li>
                <li>ใช้ DCA (ลงทุนรายเดือน) ลดความเสี่ยงจากจังหวะตลาด</li>
                <li>เม็ดเงินเฟ้อเฉลี่ยไทย 10 ปี: ประมาณ 2-3%</li>
              </ul>
            </div>
          </div>

          <div className={styles.resultPanel}>
            {/* Gap Analysis */}
            <div className={`${styles.gapCard} ${result.gapStatus === 'surplus' ? styles.gapSurplus : result.gapStatus === 'deficit' ? styles.gapDeficit : styles.gapExact}`}>
              <div className={styles.gapIcon}>{result.gapStatus === 'surplus' ? '✅' : result.gapStatus === 'deficit' ? '⚠️' : '🎯'}</div>
              <div className={styles.gapTitle}>{result.gapStatus === 'surplus' ? 'เงินเพียงพอ!' : result.gapStatus === 'deficit' ? 'เงินยังไม่พอ' : 'พอดี!'}</div>
              <div className={styles.gapAmount}>
                {result.gapStatus === 'surplus' ? '+' : result.gapStatus === 'deficit' ? '-' : ''}{formatCurrency(Math.abs(result.gap))}
              </div>
            </div>

            <div className={styles.resultGrid}>
              <div className={styles.miniResult}><span>เงินที่ต้องมีเมื่อเกษียณ</span><strong>{formatCurrency(result.requiredAtRetirement)}</strong></div>
              <div className={styles.miniResult}><span>เงินที่จะมีเมื่อเกษียณ</span><strong>{formatCurrency(result.projectedAtRetirement)}</strong></div>
              <div className={styles.miniResult}><span>ค่าใช้จ่ายหลังเกษียณ/เดือน (ปรับเฟ้อ)</span><strong>{formatCurrency(result.adjustedMonthlyExpense)}</strong></div>
              <div className={styles.miniResult}><span>ปีที่ต้องทำงาน</span><strong>{result.yearsToRetire} ปี</strong></div>
            </div>

            {result.gapStatus === 'deficit' && (
              <div className={styles.deficitAdvice}>
                <h4>📌 ต้องทำอย่างไร?</h4>
                <p>ต้องออมเพิ่มเดือนละ <strong>{formatCurrency(result.additionalMonthlySavingNeeded)}</strong></p>
                {result.moneyLastsUntilAge && <p>ถ้าไม่ปรับแผน เงินจะหมดเมื่ออายุ <strong>{result.moneyLastsUntilAge} ปี</strong></p>}
              </div>
            )}

            {/* Chart */}
            <div className={styles.chartSection}>
              <h4>📈 กราฟเงินออมตลอดชีวิต</h4>
              <div className={styles.barChart}>
                {result.yearlyProjection.filter((_, i) => i % 5 === 0 || result.yearlyProjection[i].age === input.retirementAge).map((y, i) => (
                  <div key={i} className={styles.barGroup}>
                    <div className={styles.barContainer}>
                      <div className={`${styles.bar} ${y.isRetired ? styles.barRetired : styles.barWorking}`}
                        style={{ height: `${maxSavings > 0 ? Math.max(2, (y.savings / maxSavings) * 100) : 2}%` }} />
                    </div>
                    <span className={styles.barLabel}>{y.age}</span>
                  </div>
                ))}
              </div>
              <div className={styles.chartLegend}>
                <span><span className={styles.dotWorking} /> ช่วงทำงาน</span>
                <span><span className={styles.dotRetired} /> ช่วงเกษียณ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
