'use client'

// ============================================================
// src/app/privacy/page.tsx
// Privacy Policy — ถูกต้องตาม PDPA พ.ร.บ.คุ้มครองข้อมูลฯ 2562
// อัปเดต: มีนาคม 2569
// ============================================================

import { useState } from 'react'
import Link from 'next/link'

export const metadata = {
  title: 'นโยบายความเป็นส่วนตัว (Privacy Policy)',
  description: 'นโยบายการคุ้มครองข้อมูลส่วนบุคคลของเว็บไซต์ ตาม พ.ร.บ. PDPA และ Google AdSense',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  const [lang, setLang] = useState<'th' | 'en'>('th')

  const UPDATED = '15 มีนาคม 2569'
  const UPDATED_EN = 'March 15, 2026'
  const EFFECTIVE = '1 มกราคม 2568'
  const EFFECTIVE_EN = 'January 1, 2025'

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
                {lang === 'th' ? '🔒 นโยบายความเป็นส่วนตัว' : '🔒 Privacy Policy'}
              </h1>
              <p style={{ fontSize: '0.8rem', color: 'var(--c-text-3, #7a7a70)', marginTop: '0.375rem' }}>
                {lang === 'th'
                  ? `มีผลบังคับใช้: ${EFFECTIVE} · อัปเดตล่าสุด: ${UPDATED}`
                  : `Effective: ${EFFECTIVE_EN} · Last updated: ${UPDATED_EN}`}
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

      {/* Content */}
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '2.5rem 1.25rem' }}>
        <div style={{
          background: 'var(--c-surface, #fff)',
          borderRadius: '1.25rem',
          border: '1px solid var(--c-border, rgba(0,0,0,0.07))',
          padding: '2rem 2.5rem',
          lineHeight: 1.8,
          color: 'var(--c-text-2, #4a4a42)',
          fontSize: '0.9rem',
        }}>
          {lang === 'th' ? <PrivacyTH /> : <PrivacyEN />}
        </div>

        {/* Contact box */}
        <div style={{
          marginTop: '1.5rem',
          background: 'var(--c-primary-pale, #e8f5ef)',
          border: '1px solid rgba(45,122,95,0.2)',
          borderRadius: '1rem',
          padding: '1.25rem 1.5rem',
        }}>
          <p style={{ fontWeight: 700, color: 'var(--c-primary-dark, #1f5942)', marginBottom: '0.375rem', fontSize: '0.875rem' }}>
            {lang === 'th' ? '📬 ติดต่อเรา' : '📬 Contact Us'}
          </p>
          <p style={{ fontSize: '0.8375rem', color: 'var(--c-text-2, #4a4a42)', margin: 0 }}>
            {lang === 'th'
              ? 'หากมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัว หรือต้องการใช้สิทธิ์ตาม PDPA ติดต่อได้ที่'
              : 'For privacy questions or to exercise your PDPA rights, contact us at'}
            {' '}<a href="invioly01@gmail.com" style={{ color: 'var(--c-primary, #2d7a5f)', fontWeight: 600 }}>
              invioly01@gmail.com
              
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--c-text, #1a1a18)', marginTop: '2rem', marginBottom: '0.625rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--c-primary-pale, #e8f5ef)' }}>
    {children}
  </h2>
)
const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ marginBottom: '0.875rem' }}>{children}</p>
)
const Li = ({ children }: { children: React.ReactNode }) => (
  <li style={{ marginBottom: '0.4rem' }}>{children}</li>
)

// ── Thai Content ────────────────────────────────────────────
function PrivacyTH() {

  return (
    <>
      <div style={{ background: 'var(--c-primary-pale, #e8f5ef)', borderRadius: '0.75rem', padding: '1rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.8375rem', color: 'var(--c-primary-dark, #1f5942)' }}>
        <strong>สรุปสั้นๆ:</strong> เราเก็บข้อมูลการใช้งานแบบ anonymous ผ่าน Google Analytics เท่านั้น ไม่ขายข้อมูลส่วนตัวคุณ ไม่บังคับสมัครสมาชิก
      </div>

      <H2>1. ผู้ควบคุมข้อมูลส่วนบุคคล (Data Controller)</H2>
      <P>
        Calqly.co ดำเนินการโดยบุคคลธรรมดา ตั้งอยู่ในประเทศไทย ในฐานะผู้ให้บริการเว็บไซต์ให้ความรู้ทางการเงิน เราคือผู้ควบคุมข้อมูลส่วนบุคคลตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
      </P>

      <H2>2. ข้อมูลที่เราเก็บรวบรวม</H2>
      <P>เราเก็บข้อมูลดังต่อไปนี้เมื่อคุณใช้งานเว็บไซต์:</P>
      <ul>
        <Li><strong>ข้อมูลการใช้งาน (Usage Data):</strong> หน้าที่เข้าชม, ระยะเวลาที่ใช้, ประเทศ, ประเภทอุปกรณ์ — เก็บผ่าน Google Analytics 4 แบบ anonymous (IP ถูก anonymize ก่อนส่ง)</Li>
        <Li><strong>ข้อมูลคุกกี้:</strong> การตั้งค่า theme (dark/light mode) และสถานะ cookie consent ของคุณ — เก็บใน localStorage เท่านั้น ไม่ส่งออกไปที่ใด</Li>
        <Li><strong>ข้อมูลโฆษณา:</strong> Google AdSense อาจเก็บข้อมูลเพื่อแสดงโฆษณาที่เกี่ยวข้อง ดู <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--c-primary, #2d7a5f)' }}>Google Privacy Policy</a></Li>
      </ul>
      <P><strong>เราไม่เก็บ:</strong> ชื่อ, อีเมล, เบอร์โทร, ข้อมูลทางการเงินส่วนตัว, หรือข้อมูลที่บ่งชี้ตัวตนใดๆ</P>

      <H2>3. วัตถุประสงค์การใช้ข้อมูล</H2>
      <ul>
        <Li>วิเคราะห์การใช้งานเพื่อปรับปรุงเว็บไซต์ (ฐาน: ประโยชน์อันชอบธรรม)</Li>
        <Li>แสดงโฆษณาผ่าน Google AdSense (ฐาน: consent)</Li>
        <Li>จัดเก็บการตั้งค่า UI ของคุณ เช่น dark mode (ฐาน: ประโยชน์อันชอบธรรม)</Li>
      </ul>

      <H2>4. การแบ่งปันข้อมูลกับบุคคลที่สาม</H2>
      <ul>
        <Li><strong>Google Analytics 4</strong> — ข้อมูลการใช้งาน (anonymous) เพื่อวิเคราะห์สถิติ</Li>
        <Li><strong>Google AdSense</strong> — ข้อมูล cookie เพื่อแสดงโฆษณา (ต้องได้รับ consent ก่อน)</Li>
        <Li><strong>Vercel</strong> — ผู้ให้บริการ hosting เข้าถึง access log พื้นฐาน</Li>
      </ul>
      <P>เราไม่ขาย แลกเปลี่ยน หรือโอนข้อมูลส่วนบุคคลของคุณให้กับบุคคลที่สามใดๆ นอกจากที่ระบุข้างต้น</P>

      <H2>5. สิทธิ์ของคุณตาม PDPA</H2>
      <P>ในฐานะเจ้าของข้อมูล คุณมีสิทธิ์ดังต่อไปนี้:</P>
      <ul>
        <Li><strong>สิทธิ์ในการเข้าถึง</strong> — ขอทราบว่าเรามีข้อมูลอะไรของคุณบ้าง</Li>
        <Li><strong>สิทธิ์ในการลบ</strong> — ขอให้ลบข้อมูลของคุณ</Li>
        <Li><strong>สิทธิ์ในการถอนความยินยอม</strong> — เปลี่ยนการตั้งค่า cookie ได้ตลอดเวลาโดยคลิก 🍪 ที่มุมซ้ายล่าง</Li>
        <Li><strong>สิทธิ์ในการร้องเรียน</strong> — ร้องเรียนต่อสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (PDPC)</Li>
      </ul>
      <P>ติดต่อใช้สิทธิ์ได้ที่ <a href="mailto:privacy@calqly.co" style={{ color: 'var(--c-primary, #2d7a5f)' }}>privacy@calqly.co</a> เราจะตอบกลับภายใน 30 วัน</P>

      <H2>6. ระยะเวลาเก็บรักษาข้อมูล</H2>
      <ul>
        <Li>ข้อมูล Google Analytics: 14 เดือน (ตามค่าเริ่มต้น GA4)</Li>
        <Li>ข้อมูล cookie consent ใน localStorage: จนกว่าคุณจะล้าง browser data หรือเปลี่ยนการตั้งค่า</Li>
      </ul>

      <H2>7. ความปลอดภัยของข้อมูล</H2>
      <P>เว็บไซต์ใช้ HTTPS ตลอดเวลา ข้อมูลส่วนบุคคลถูก anonymize ก่อนส่งไปยัง Google Analytics การตั้งค่าคุณถูกเก็บไว้ใน localStorage ของ browser ของคุณเอง ไม่ได้ส่งมาที่เซิร์ฟเวอร์ของเรา</P>

      <H2>8. คุกกี้และ localStorage</H2>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem', marginBottom: '1rem' }}>
        <thead>
          <tr style={{ background: 'var(--c-primary-pale, #e8f5ef)' }}>
            {['ชื่อ', 'ประเภท', 'อายุ', 'วัตถุประสงค์'].map(h => (
              <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: 'var(--c-primary-dark, #1f5942)', fontWeight: 700, fontSize: '0.775rem' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            ['calqly_cookie_consent', 'localStorage', 'ถาวร', 'จดจำ consent ของคุณ'],
            ['theme', 'localStorage', 'ถาวร', 'จำ dark/light mode'],
            ['_ga, _ga_*', 'Cookie', '14 เดือน', 'Google Analytics (ต้องการ consent)'],
            ['ar_debug, IDE', 'Cookie', 'ผันแปร', 'Google AdSense (ต้องการ consent)'],
          ].map(row => (
            <tr key={row[0]} style={{ borderTop: '1px solid var(--c-border, rgba(0,0,0,0.07))' }}>
              {row.map((cell, i) => (
                <td key={i} style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', color: i === 0 ? 'var(--c-primary-dark, #1f5942)' : 'var(--c-text-2, #4a4a42)', fontFamily: i === 0 ? 'monospace' : 'inherit' }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <H2>9. เว็บไซต์ของบุคคลที่สาม</H2>
      <P>เว็บไซต์อาจมีลิงก์ไปยังเว็บไซต์ภายนอก เราไม่รับผิดชอบต่อนโยบายความเป็นส่วนตัวของเว็บไซต์เหล่านั้น</P>

      <H2>10. การเปลี่ยนแปลงนโยบาย</H2>
      <P>เราอาจอัปเดตนโยบายนี้เป็นครั้งคราว การเปลี่ยนแปลงสำคัญจะแจ้งผ่านแบนเนอร์บนเว็บไซต์ วันที่ &quot;อัปเดตล่าสุด&quot; ที่ด้านบนจะแสดงเวอร์ชันปัจจุบันเสมอ</P>
    </>
  )
}

// ── English Content ─────────────────────────────────────────
function PrivacyEN() {

  return (
    <>
      <div style={{ background: 'var(--c-primary-pale, #e8f5ef)', borderRadius: '0.75rem', padding: '1rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.8375rem', color: 'var(--c-primary-dark, #1f5942)' }}>
        <strong>Summary:</strong> We collect anonymous usage data via Google Analytics only. We do not sell your personal data or require registration.
      </div>

      <H2>1. Data Controller</H2>
      <P>Calqly.co is operated by an individual based in Thailand, providing a financial information website. We are the data controller under Thailand&apos;s Personal Data Protection Act B.E. 2562 (PDPA).</P>

      <H2>2. Data We Collect</H2>
      <ul>
        <Li><strong>Usage Data:</strong> Pages visited, session duration, country, device type — collected via Google Analytics 4 in anonymized form (IP is anonymized before transmission)</Li>
        <Li><strong>Preferences:</strong> Dark/light mode setting and cookie consent status — stored in your browser&apos;s localStorage only, never transmitted</Li>
        <Li><strong>Advertising Data:</strong> Google AdSense may collect cookie data to serve relevant ads. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--c-primary, #2d7a5f)' }}>Google&apos;s Privacy Policy</a></Li>
      </ul>
      <P><strong>We do NOT collect:</strong> name, email, phone number, financial details, or any personally identifiable information.</P>

      <H2>3. Legal Bases for Processing</H2>
      <ul>
        <Li>Analytics: Legitimate interest (anonymous, aggregated data to improve the service)</Li>
        <Li>Advertising cookies: Consent (you control this via the cookie banner)</Li>
        <Li>UI preferences: Legitimate interest (essential for user experience)</Li>
      </ul>

      <H2>4. Third-Party Services</H2>
      <ul>
        <Li><strong>Google Analytics 4</strong> — anonymous usage statistics</Li>
        <Li><strong>Google AdSense</strong> — advertising (consent-gated)</Li>
        <Li><strong>Vercel</strong> — hosting provider with access to basic server logs</Li>
      </ul>
      <P>We do not sell, trade, or transfer your personal data to any other third parties.</P>

      <H2>5. Your Rights Under PDPA</H2>
      <ul>
        <Li><strong>Right to Access</strong> — request to know what data we hold</Li>
        <Li><strong>Right to Erasure</strong> — request deletion of your data</Li>
        <Li><strong>Right to Withdraw Consent</strong> — change cookie settings anytime via the 🍪 button at the bottom-left</Li>
        <Li><strong>Right to Lodge a Complaint</strong> — with Thailand&apos;s Personal Data Protection Committee (PDPC)</Li>
      </ul>

      <H2>6. Data Retention</H2>
      <ul>
        <Li>Google Analytics data: 14 months (GA4 default)</Li>
        <Li>Cookie consent in localStorage: Until you clear browser data or change settings</Li>
      </ul>

      <H2>7. Security</H2>
      <P>The website enforces HTTPS at all times. Data sent to Google Analytics is IP-anonymized. Your preferences are stored in your own browser and never transmitted to our servers.</P>

      <H2>8. Changes to This Policy</H2>
      <P>We may update this policy periodically. Material changes will be announced via a banner on the website. The &quot;Last updated&quot; date at the top always reflects the current version.</P>
    </>
  )
}
