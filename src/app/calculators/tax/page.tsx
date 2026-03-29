'use client';
import { useState, useMemo } from 'react';
import { calculateTax, defaultTaxInput, TaxInput } from '@/utils/taxCalculations';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import styles from './page.module.css';

const STEPS = ['รายได้', 'สถานะ', 'ลดหย่อน', 'ผลลัพธ์'];

export default function TaxCalculatorPage() {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState<TaxInput>(defaultTaxInput);

  const update = (field: keyof TaxInput, value: number | boolean) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  const result = useMemo(() => calculateTax(input), [input]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>📋 คำนวณ<span className={styles.accent}>ภาษีเงินได้</span>บุคคลธรรมดา</h1>
          <p>ปีภาษี พ.ศ. 2569 • อ้างอิงจากกรมสรรพากร (rd.go.th)</p>
        </div>

        {/* Steps */}
        <div className={styles.steps}>
          {STEPS.map((s, i) => (
            <div key={i} className={styles.stepRow}>
              <button
                className={`${styles.stepBtn} ${i === step ? styles.stepActive : ''} ${i < step ? styles.stepDone : ''}`}
                onClick={() => setStep(i)}
              >
                {i < step ? '✓' : i + 1}
              </button>
              <span className={`${styles.stepLabel} ${i === step ? styles.stepLabelActive : ''}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`${styles.stepLine} ${i < step ? styles.stepLineDone : ''}`} />}
            </div>
          ))}
        </div>

        <div className={styles.layout}>
          {/* Form */}
          <div className={styles.formPanel}>
            {step === 0 && (
              <div className={styles.formSection}>
                <h3>💼 ข้อมูลรายได้</h3>
                <div className={styles.inputGroup}>
                  <label>เงินเดือนต่อเดือน (บาท)</label>
                  <input type="number" className="input-field" value={input.monthlyIncome || ''} onChange={e => update('monthlyIncome', +e.target.value)} placeholder="เช่น 50000" />
                  <span className={styles.hint}>รวมเงินเดือนก่อนหักภาษีและประกันสังคม</span>
                </div>
                <div className={styles.inputGroup}>
                  <label>รายได้อื่นทั้งปี (บาท)</label>
                  <input type="number" className="input-field" value={input.otherIncome || ''} onChange={e => update('otherIncome', +e.target.value)} placeholder="โบนัส ค่าคอมมิชชั่น ฯลฯ" />
                </div>
                {input.monthlyIncome > 0 && (
                  <div className={styles.quickResult}>
                    <span>รายได้รวมทั้งปี</span>
                    <strong>{formatCurrency(result.annualIncome)}</strong>
                  </div>
                )}
              </div>
            )}

            {step === 1 && (
              <div className={styles.formSection}>
                <h3>👨‍👩‍👧‍👦 สถานะส่วนตัวและครอบครัว</h3>
                <div className={styles.toggleRow}>
                  <label>สถานภาพสมรส</label>
                  <div className={styles.toggleGroup}>
                    <button className={`${styles.toggleBtn} ${!input.hasSpouse ? styles.toggleActive : ''}`} onClick={() => update('hasSpouse', false)}>โสด</button>
                    <button className={`${styles.toggleBtn} ${input.hasSpouse ? styles.toggleActive : ''}`} onClick={() => update('hasSpouse', true)}>สมรส</button>
                  </div>
                </div>
                {input.hasSpouse && (
                  <div className={styles.toggleRow}>
                    <label>คู่สมรสมีรายได้ไหม?</label>
                    <div className={styles.toggleGroup}>
                      <button className={`${styles.toggleBtn} ${!input.spouseHasIncome ? styles.toggleActive : ''}`} onClick={() => update('spouseHasIncome', false)}>ไม่มี (ลดหย่อน 60,000)</button>
                      <button className={`${styles.toggleBtn} ${input.spouseHasIncome ? styles.toggleActive : ''}`} onClick={() => update('spouseHasIncome', true)}>มีรายได้</button>
                    </div>
                  </div>
                )}
                <div className={styles.inputGroup}>
                  <label>จำนวนบุตร</label>
                  <input type="number" className="input-field" min="0" max="10" value={input.numberOfChildren} onChange={e => update('numberOfChildren', +e.target.value)} />
                </div>
                {input.numberOfChildren > 0 && (
                  <div className={styles.inputGroup}>
                    <label>จำนวนบุตรที่เกิดปี 2561 เป็นต้นไป (ลดหย่อนเพิ่ม)</label>
                    <input type="number" className="input-field" min="0" max={input.numberOfChildren} value={input.childrenBornAfter2018} onChange={e => update('childrenBornAfter2018', Math.min(+e.target.value, input.numberOfChildren))} />
                  </div>
                )}
                <div className={styles.inputGroup}>
                  <label>จำนวนบิดามารดาที่อุปการะ (อายุ 60+ รายได้ไม่เกิน 30,000/ปี)</label>
                  <input type="number" className="input-field" min="0" max="4" value={input.numberOfParents} onChange={e => update('numberOfParents', +e.target.value)} />
                </div>
                <div className={styles.inputGroup}>
                  <label>ประกันสังคม (บาท/ปี)</label>
                  <input type="number" className="input-field" value={input.socialSecurity || ''} onChange={e => update('socialSecurity', +e.target.value)} placeholder="สูงสุด 9,000" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className={styles.formSection}>
                <h3>🛡️ ค่าลดหย่อนภาษี</h3>
                <p className={styles.sectionDesc}>กรอกเฉพาะรายการที่คุณมี ส่วนที่ไม่มีไม่ต้องกรอก</p>
                <div className={styles.deductGrid}>
                  <div className={styles.inputGroup}>
                    <label>เบี้ยประกันชีวิต</label>
                    <input type="number" className="input-field" value={input.lifeInsurance || ''} onChange={e => update('lifeInsurance', +e.target.value)} placeholder="สูงสุด 100,000" />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>เบี้ยประกันสุขภาพ</label>
                    <input type="number" className="input-field" value={input.healthInsurance || ''} onChange={e => update('healthInsurance', +e.target.value)} placeholder="สูงสุด 25,000" />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>กองทุน RMF</label>
                    <input type="number" className="input-field" value={input.rmf || ''} onChange={e => update('rmf', +e.target.value)} placeholder="30% ของรายได้ / กลุ่มเกษียณ ≤500K" />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>กองทุน Thai ESG</label>
                    <input type="number" className="input-field" value={input.thaiESG || ''} onChange={e => update('thaiESG', +e.target.value)} placeholder="แยกวงเงิน สูงสุด 300,000" />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>กองทุนสำรองเลี้ยงชีพ (PVD)</label>
                    <input type="number" className="input-field" value={input.providentFund || ''} onChange={e => update('providentFund', +e.target.value)} placeholder="ตามจริง / กลุ่มเกษียณ ≤500K" />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>ดอกเบี้ยบ้าน</label>
                    <input type="number" className="input-field" value={input.homeLoanInterest || ''} onChange={e => update('homeLoanInterest', +e.target.value)} placeholder="สูงสุด 100,000" />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>เงินบริจาคทั่วไป</label>
                    <input type="number" className="input-field" value={input.generalDonation || ''} onChange={e => update('generalDonation', +e.target.value)} placeholder="ไม่เกิน 10% ของเงินได้สุทธิ" />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>บริจาคการศึกษา/กีฬา/รพ. (ลดหย่อน 2 เท่า)</label>
                    <input type="number" className="input-field" value={input.educationDonation || ''} onChange={e => update('educationDonation', +e.target.value)} placeholder="จำนวนที่บริจาคจริง" />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className={styles.formSection}>
                <h3>📊 ผลการคำนวณภาษี</h3>

                <div className={styles.resultGrid}>
                  <div className={`${styles.resultCard} ${styles.resultMain}`}>
                    <div className={styles.resultLabel}>ภาษีที่ต้องจ่ายทั้งปี</div>
                    <div className={styles.resultValue}>{formatCurrency(result.totalTax)}</div>
                    <div className={styles.resultSub}>เดือนละ {formatCurrency(result.monthlyTax)}</div>
                  </div>
                  <div className={styles.resultCard}>
                    <div className={styles.resultLabel}>อัตราภาษีที่แท้จริง</div>
                    <div className={styles.resultValue}>{formatPercent(result.effectiveRate)}</div>
                  </div>
                  <div className={styles.resultCard}>
                    <div className={styles.resultLabel}>เงินได้สุทธิ</div>
                    <div className={styles.resultValue}>{formatCurrency(result.netIncome)}</div>
                  </div>
                  <div className={styles.resultCard}>
                    <div className={styles.resultLabel}>ค่าลดหย่อนรวม</div>
                    <div className={styles.resultValue}>{formatCurrency(result.totalDeductions)}</div>
                  </div>
                </div>

                {/* Tax Breakdown */}
                <div className={styles.breakdownSection}>
                  <h4>📐 การคำนวณภาษีขั้นบันได</h4>
                  <table className="data-table">
                    <thead>
                      <tr><th>ช่วงเงินได้สุทธิ (บาท)</th><th>อัตราภาษี</th><th>เงินได้ในช่วงนี้</th><th>ภาษี</th></tr>
                    </thead>
                    <tbody>
                      {result.taxBreakdown.map((row, i) => (
                        <tr key={i}>
                          <td>{row.bracket}</td>
                          <td>{row.rate}%</td>
                          <td>{formatCurrency(row.income)}</td>
                          <td style={{ color: row.tax > 0 ? 'var(--danger-400)' : 'var(--success-400)' }}>{formatCurrency(row.tax)}</td>
                        </tr>
                      ))}
                      <tr style={{ fontWeight: 700 }}>
                        <td colSpan={3}>รวมภาษีทั้งสิ้น</td>
                        <td style={{ color: 'var(--danger-400)' }}>{formatCurrency(result.totalTax)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Deduction Details */}
                <div className={styles.breakdownSection}>
                  <h4>📝 สรุปค่าลดหย่อนที่ใช้</h4>
                  <table className="data-table">
                    <thead><tr><th>รายการ</th><th>จำนวน (บาท)</th></tr></thead>
                    <tbody>
                      <tr><td>ค่าใช้จ่ายเหมา (50% ไม่เกิน 100,000)</td><td>{formatCurrency(result.expenseDeduction)}</td></tr>
                      {result.deductionDetails.map((d, i) => (
                        <tr key={i}><td>{d.name}</td><td>{formatCurrency(d.amount)}</td></tr>
                      ))}
                      <tr style={{ fontWeight: 700 }}><td>รวมค่าลดหย่อน</td><td>{formatCurrency(result.totalDeductions + result.expenseDeduction)}</td></tr>
                    </tbody>
                  </table>
                </div>

                {/* Tax Saving Tips */}
                {(result.unusedDeductions.length > 0 || result.savingTips.length > 0) && (
                  <div className={styles.tipsSection}>
                    <h4>💡 คำแนะนำประหยัดภาษี</h4>
                    {result.unusedDeductions.map((d, i) => (
                      <div key={i} className={styles.tipCard}>
                        <div className={styles.tipTitle}>📌 {d.name} — ยังเหลือสิทธิ์อีก {formatCurrency(d.remaining)}</div>
                        <p>{d.tip}</p>
                      </div>
                    ))}
                    {result.savingTips.map((tip, i) => (
                      <div key={i} className={styles.tipCard}><p>💡 {tip}</p></div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className={styles.navButtons}>
              {step > 0 && <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>← ย้อนกลับ</button>}
              {step < STEPS.length - 1 && <button className="btn btn-primary" onClick={() => setStep(s => s + 1)}>ถัดไป →</button>}
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className={styles.sidebar}>
            <div className={styles.summaryCard}>
              <h4>สรุปภาษี (Real-time)</h4>
              <div className={styles.summaryRow}><span>รายได้/ปี</span><strong>{formatCurrency(result.annualIncome)}</strong></div>
              <div className={styles.summaryRow}><span>หักค่าใช้จ่าย</span><strong>-{formatCurrency(result.expenseDeduction)}</strong></div>
              <div className={styles.summaryRow}><span>หักลดหย่อน</span><strong>-{formatCurrency(result.totalDeductions)}</strong></div>
              <div className={`${styles.summaryRow} ${styles.summaryHighlight}`}><span>เงินได้สุทธิ</span><strong>{formatCurrency(result.netIncome)}</strong></div>
              <hr className={styles.divider} />
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}><span>ภาษีที่ต้องจ่าย</span><strong style={{ color: result.totalTax > 0 ? 'var(--danger-400)' : 'var(--success-400)' }}>{formatCurrency(result.totalTax)}</strong></div>
              <div className={styles.summaryRow}><span>อัตราภาษีแท้จริง</span><strong>{formatPercent(result.effectiveRate)}</strong></div>
              <div className={styles.summaryRow}><span>ภาษีต่อเดือน</span><strong>{formatCurrency(result.monthlyTax)}</strong></div>
            </div>
            <div className={styles.disclaimer}>
              ⚠️ คำนวณเบื้องต้น อ้างอิงกรมสรรพากร พ.ศ. 2569<br/>
              กรุณาตรวจสอบกับผู้เชี่ยวชาญก่อนยื่นภาษีจริง
            </div>
          </div>
        </div>

        {/* Educational Section */}
        <div style={{ marginTop: '3rem', background: 'var(--c-surface, #fff)', padding: '2rem', borderRadius: '1.25rem', border: '1px solid var(--c-border, rgba(0,0,0,0.07))', color: 'var(--c-text-2, #4a4a42)' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--c-text, #1a1a18)', marginBottom: '1rem', borderBottom: '2px solid var(--c-primary-pale, #e8f5ef)', paddingBottom: '0.75rem', fontWeight: 800 }}>💡 เกร็ดความรู้เรื่องภาษี</h2>
          
          <h3 style={{ fontSize: '1.05rem', color: 'var(--c-primary-dark, #1f5942)', marginTop: '1.5rem', marginBottom: '0.5rem', fontWeight: 700 }}>วิธีคำนวณภาษีแบบขั้นบันไดคิดยังไง?</h3>
          <p style={{ lineHeight: 1.7, marginBottom: '1rem', fontSize: '0.925rem' }}>
            การคำนวณภาษีแบบ &quot;ขั้นบันได&quot; คือการนำ <b>เงินได้สุทธิ</b> (รายได้ทั้งปี หักค่าใช้จ่ายและค่าลดหย่อนแล้ว) มาแบ่งคำนวณตามฐานภาษีแต่ละขั้น 
            โดยไม่ได้นำเงินได้ทั้งหมดไปคูณกับอัตราภาษีสูงสุดทีเดียว ตัวอย่างเช่น หากคุณมีเงินได้สุทธิ 500,000 บาท:
          </p>
          <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.925rem' }}>
            <li>0 - 150,000 บาทแรก: <b>ยกเว้นภาษี</b> (เสีย 0 บาท)</li>
            <li>150,001 - 300,000 บาทส่วนถัดมา (150,000 บาท): เสียภาษีอัตรา 5% = 7,500 บาท</li>
            <li>300,001 - 500,000 บาทส่วนที่เหลือ (200,000 บาท): เสียภาษีอัตรา 10% = 20,000 บาท</li>
            <li><strong>รวมภาษีที่ต้องเสีย: 0 + 7,500 + 20,000 = 27,500 บาท</strong></li>
          </ul>

          <h3 style={{ fontSize: '1.05rem', color: 'var(--c-primary-dark, #1f5942)', marginTop: '1.5rem', marginBottom: '0.5rem', fontWeight: 700 }}>รวมรายการลดหย่อนภาษีปี 2569 ที่สำคัญมีอะไรบ้าง?</h3>
          <p style={{ lineHeight: 1.7, marginBottom: '1rem', fontSize: '0.925rem' }}>
            เพื่อให้การวางแผนภาษีมีประสิทธิภาพมากขึ้น นี่คือรายการลดหย่อนที่คุณสามารถใช้สิทธิ์ได้ (เงื่อนไขเบื้องต้น):
          </p>
          <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.7, fontSize: '0.925rem' }}>
            <li style={{ marginBottom: '0.5rem' }}><strong>กลุ่มส่วนตัวและครอบครัว:</strong> ลดหย่อนส่วนตัว 60,000 บาท, คู่สมรสไม่มีรายได้ 60,000 บาท, บุตรคนละ 30,000 บาท (คนที่เกิดตั้งแต่ปี 2561 ได้ 60,000 บาท), บิดามารดา (อายุ 60 ปีขึ้นไป) คนละ 30,000 บาท</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>กลุ่มประกันสุขภาพและชีวิต:</strong> ประกันชีวิตสูงสุด 100,000 บาท, ประกันสุขภาพสูงสุด 25,000 บาท (เมื่อรวมกับประกันชีวิตต้องไม่เกิน 1 แสนบาท)</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>กลุ่มการลงทุน:</strong> กองทุนสำรองเลี้ยงชีพ (PVD), กองทุนรวมเพื่อการออม (SSF), กองทุน RMF, และ Thai ESG ซึ่งแต่ละตัวมีเพดานสูงสุดในการลดหย่อนแยกกัน (ควรศึกษาเงื่อนไขของแต่ละกองทุน)</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>กลุ่มเงินบริจาค:</strong> บริจาคทั่วไปลดหย่อนตามจริงแบบไม่เกิน 10% ของเงินได้สุทธิ, บริจาคการศึกษาและโรงพยาบาลรัฐหักลดหย่อนได้ 2 เท่า</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>กลุ่มอสังหาริมทรัพย์:</strong> ดอกเบี้ยกู้ยืมเพื่อซื้อที่อยู่อาศัยสูงสุด 100,000 บาท</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
