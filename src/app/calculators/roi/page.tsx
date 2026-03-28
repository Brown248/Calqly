'use client';
import { useState, useMemo } from 'react';
import { calculateROI, defaultROIInput } from '@/utils/roiCalculations';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import styles from './page.module.css';

export default function ROIPage() {
  const [input, setInput] = useState(defaultROIInput);
  const update = (k: string, v: number) => setInput(p => ({ ...p, [k]: v }));
  const result = useMemo(() => calculateROI(input), [input]);
  const maxVal = Math.max(...result.yearlyData.map(d => d.portfolioValue), 1);

  return (
    <div className={styles.page}>
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
      </div>
    </div>
  );
}
