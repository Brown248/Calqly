'use client'

// ============================================================
// src/app/terms/page.tsx
// Terms of Service — จำกัดความรับผิดชอบตาม พ.ร.บ.หลักทรัพย์ฯ
// และ พ.ร.บ.คอมพิวเตอร์ 2560
// ============================================================

import { useState } from 'react'
import Link from 'next/link'

export default function TermsPage() {
  const [lang, setLang] = useState<'th' | 'en'>('th')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--c-bg, #f7f6f2)' }}>
      {/* Header */}
      <div style={{
        background: 'var(--c-surface, #fff)',
        borderBottom: '1px solid var(--c-border, rgba(0,0,0,0.07))',
        padding: '1.5rem 1.25rem',
      }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <Link href="/" style={{
            fontSize: '0.8rem', color: 'var(--c-text-3, #7a7a70)',
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4,
            marginBottom: '1rem',
          }}>
            ← {lang === 'th' ? 'กลับหน้าแรก' : 'Back to home'}
          </Link>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--c-text, #1a1a18)', margin: 0 }}>
                {lang === 'th' ? '📄 ข้อกำหนดการใช้งาน' : '📄 Terms of Service'}
              </h1>
              <p style={{ fontSize: '0.8rem', color: 'var(--c-text-3, #7a7a70)', marginTop: '0.375rem' }}>
                {lang === 'th' ? 'อัปเดตล่าสุด: 15 มีนาคม 2569' : 'Last updated: March 15, 2026'}
              </p>
            </div>
            <button
              onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
              style={{
                padding: '0.375rem 0.875rem',
                borderRadius: 8, border: '1.5px solid var(--c-border-strong, rgba(0,0,0,0.13))',
                background: 'transparent', cursor: 'pointer',
                fontSize: '0.775rem', fontWeight: 600,
                color: 'var(--c-text-2, #4a4a42)', fontFamily: 'inherit',
              }}
            >
              {lang === 'th' ? 'English' : 'ภาษาไทย'}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '2.5rem 1.25rem' }}>

        {/* Disclaimer box — สำคัญที่สุด วางไว้บนสุด */}
        <div style={{
          background: '#fff7ed',
          border: '1.5px solid rgba(234,88,12,0.3)',
          borderRadius: '1rem',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
        }}>
          <p style={{ fontWeight: 700, color: '#9a3412', marginBottom: '0.5rem', fontSize: '0.9375rem' }}>
            ⚠️ {lang === 'th' ? 'ข้อความสงวนสิทธิ์สำคัญ (Disclaimer)' : 'Important Disclaimer'}
          </p>
          <p style={{ color: '#7c2d12', fontSize: '0.875rem', lineHeight: 1.75, margin: 0 }}>
            {lang === 'th'
              ? 'ข้อมูล บทความ และผลการคำนวณทั้งหมดบนเว็บไซต์ Calqly.co มีวัตถุประสงค์เพื่อการศึกษาและการให้ข้อมูลเบื้องต้นเท่านั้น ไม่ถือเป็นคำแนะนำทางการเงิน การลงทุน กฎหมาย หรือภาษีแต่อย่างใด ตามพระราชบัญญัติหลักทรัพย์และตลาดหลักทรัพย์ พ.ศ. 2535 และพระราชบัญญัติประกอบรัฐธรรมนูญว่าด้วยการป้องกันและปราบปรามการทุจริต กรุณาปรึกษาผู้เชี่ยวชาญที่มีใบอนุญาตก่อนตัดสินใจทางการเงินทุกครั้ง'
              : 'All content, articles, and calculation results on Calqly.co are for educational and informational purposes only. They do not constitute financial, investment, legal, or tax advice under the Securities and Exchange Act B.E. 2535 or any other applicable Thai law. Always consult a licensed professional before making financial decisions.'}
          </p>
        </div>

        <div style={{
          background: 'var(--c-surface, #fff)',
          borderRadius: '1.25rem',
          border: '1px solid var(--c-border, rgba(0,0,0,0.07))',
          padding: '2rem 2.5rem',
          lineHeight: 1.8,
          color: 'var(--c-text-2, #4a4a42)',
          fontSize: '0.9rem',
        }}>
          {lang === 'th' ? <TermsTH /> : <TermsEN />}
        </div>
      </main>
    </div>
  )
}

function TermsTH() {
  const H2 = ({ children }: { children: React.ReactNode }) => (
    <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--c-text, #1a1a18)', marginTop: '2rem', marginBottom: '0.625rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--c-primary-pale, #e8f5ef)' }}>{children}</h2>
  )
  const P = ({ children }: { children: React.ReactNode }) => <p style={{ marginBottom: '0.875rem' }}>{children}</p>
  const Li = ({ children }: { children: React.ReactNode }) => <li style={{ marginBottom: '0.4rem' }}>{children}</li>

  return (
    <>
      <H2>1. การยอมรับข้อกำหนด</H2>
      <P>การใช้งานเว็บไซต์ Calqly.co ("เว็บไซต์") หมายความว่าคุณยอมรับข้อกำหนดเหล่านี้ครบถ้วน หากคุณไม่ยอมรับ กรุณาหยุดใช้งานเว็บไซต์</P>

      <H2>2. ขอบเขตของบริการ</H2>
      <P>Calqly.co ให้บริการ:</P>
      <ul>
        <Li>เครื่องคิดเลขการเงิน เช่น คำนวณสินเชื่อ ภาษีเงินได้ และการวางแผนเกษียณ</Li>
        <Li>บทความและข้อมูลทางการเงินเพื่อการศึกษา</Li>
      </ul>
      <P>เว็บไซต์ไม่ได้รับใบอนุญาตจากสำนักงานคณะกรรมการกำกับหลักทรัพย์และตลาดหลักทรัพย์ (ก.ล.ต.) ธนาคารแห่งประเทศไทย หรือกรมสรรพากร และไม่ได้เป็นตัวแทนของหน่วยงานเหล่านั้น</P>

      <H2>3. ความถูกต้องของข้อมูล</H2>
      <P>เราพยายามอย่างสุดความสามารถในการตรวจสอบความถูกต้องของข้อมูล โดยอ้างอิงจากแหล่งทางการ ได้แก่ กรมสรรพากร ธนาคารแห่งประเทศไทย และตลาดหลักทรัพย์แห่งประเทศไทย อย่างไรก็ตาม:</P>
      <ul>
        <Li>อัตราภาษี อัตราดอกเบี้ย และกฎระเบียบอาจเปลี่ยนแปลงโดยไม่แจ้งล่วงหน้า</Li>
        <Li>ผลการคำนวณเป็นการประมาณการเท่านั้น ไม่ใช่ตัวเลขยืนยันจากสถาบันการเงินหรือหน่วยงานราชการ</Li>
        <Li>คุณควรตรวจสอบข้อมูลกับแหล่งทางการโดยตรงก่อนนำไปใช้งานจริง</Li>
      </ul>

      <H2>4. การจำกัดความรับผิด</H2>
      <P>ในขอบเขตสูงสุดที่กฎหมายอนุญาต Calqly.co ไม่รับผิดชอบต่อ:</P>
      <ul>
        <Li>ความเสียหายทางการเงินที่เกิดจากการนำข้อมูลหรือผลการคำนวณไปใช้</Li>
        <Li>ความไม่ถูกต้องของข้อมูลที่เกิดจากการเปลี่ยนแปลงกฎหมายหรือนโยบายของหน่วยงานรัฐ</Li>
        <Li>การหยุดชะงักของบริการเนื่องจากเหตุสุดวิสัย</Li>
        <Li>ความเสียหายทางอ้อม ความเสียหายพิเศษ หรือความเสียหายที่เป็นผลสืบเนื่อง</Li>
      </ul>

      <H2>5. ทรัพย์สินทางปัญญา</H2>
      <P>เนื้อหา การออกแบบ โค้ด และองค์ประกอบทั้งหมดของเว็บไซต์เป็นสิทธิ์ของ Calqly.co ห้ามคัดลอก ดัดแปลง หรือเผยแพร่โดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษร ยกเว้นการแบ่งปันลิงก์ไปยังหน้าเว็บ</P>

      <H2>6. กฎหมายที่บังคับใช้</H2>
      <P>ข้อกำหนดนี้อยู่ภายใต้กฎหมายไทย ข้อพิพาทใดๆ ให้ใช้กระบวนการของศาลไทย</P>

      <H2>7. การเปลี่ยนแปลงข้อกำหนด</H2>
      <P>เราขอสงวนสิทธิ์ในการเปลี่ยนแปลงข้อกำหนดเหล่านี้ได้ตลอดเวลา การเปลี่ยนแปลงมีผลทันทีที่ประกาศบนเว็บไซต์ การใช้งานต่อเนื่องหลังจากนั้นถือว่ายอมรับการเปลี่ยนแปลง</P>

      <H2>8. ติดต่อเรา</H2>
      <P>หากมีคำถามเกี่ยวกับข้อกำหนดเหล่านี้ ติดต่อได้ที่ <a href="invioly01@gmail.com" style={{ color: 'var(--c-primary, #2d7a5f)' }}>invioly01@gmail.com</a></P>
    </>
  )
}

function TermsEN() {
  const H2 = ({ children }: { children: React.ReactNode }) => (
    <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--c-text, #1a1a18)', marginTop: '2rem', marginBottom: '0.625rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--c-primary-pale, #e8f5ef)' }}>{children}</h2>
  )
  const P = ({ children }: { children: React.ReactNode }) => <p style={{ marginBottom: '0.875rem' }}>{children}</p>
  const Li = ({ children }: { children: React.ReactNode }) => <li style={{ marginBottom: '0.4rem' }}>{children}</li>

  return (
    <>
      <H2>1. Acceptance of Terms</H2>
      <P>By using Calqly.co (&quot;the Website&quot;), you agree to these Terms in full. If you do not agree, please discontinue use immediately.</P>

      <H2>2. Scope of Service</H2>
      <P>Calqly.co provides financial calculators (loan, tax, retirement) and educational finance articles. The Website is not licensed by the SEC Thailand, Bank of Thailand, or Revenue Department, and does not represent any of these authorities.</P>

      <H2>3. Accuracy of Information</H2>
      <P>We make every effort to verify information against official sources. However:</P>
      <ul>
        <Li>Tax rates, interest rates, and regulations may change without notice</Li>
        <Li>Calculator results are estimates only, not official figures from financial institutions</Li>
        <Li>Always verify with official sources before taking action</Li>
      </ul>

      <H2>4. Limitation of Liability</H2>
      <P>To the fullest extent permitted by Thai law, Calqly.co is not liable for financial losses arising from use of our content, inaccuracies due to regulatory changes, service interruptions, or any indirect or consequential damages.</P>

      <H2>5. Intellectual Property</H2>
      <P>All content, design, and code belongs to Calqly.co. No reproduction or redistribution without written permission, except sharing links.</P>

      <H2>6. Governing Law</H2>
      <P>These Terms are governed by Thai law. Disputes shall be resolved in Thai courts.</P>

      <H2>7. Contact</H2>
      <P>Questions about these Terms: <a href="mailto:invioly01@gmail.com" style={{ color: 'var(--c-primary, #2d7a5f)' }}>invioly01@gmail.com</a></P>
    </>
  )
}
