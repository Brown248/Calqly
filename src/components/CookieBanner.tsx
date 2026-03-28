'use client'

// ============================================================
// CookieBanner.tsx
// PDPA (พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล 2562) Compliant
// ต้องได้รับ consent ก่อน GA4 และ AdSense จะทำงาน
// ============================================================

import { useState, useEffect } from 'react'

const CONSENT_KEY = 'calqly_cookie_consent'
const CONSENT_VERSION = 'v1' // เพิ่มเลขเมื่อ policy เปลี่ยน — จะ reset consent ทั้งหมด

type ConsentStatus = 'pending' | 'accepted' | 'declined'

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// ── Helper: เปิด/ปิด GA4 ──────────────────────────────────
function enableAnalytics() {
  if (typeof window === 'undefined') return
  // เปิด GA4 — gtag ถูก inject ใน layout.tsx แล้ว
  window.gtag?.('consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
  })
}

function disableAnalytics() {
  if (typeof window === 'undefined') return
  window.gtag?.('consent', 'update', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })
}

// ── Exports: ใช้ใน layout.tsx ──────────────────────────────
export function getStoredConsent(): ConsentStatus {
  if (typeof window === 'undefined') return 'pending'
  try {
    const stored = localStorage.getItem(CONSENT_KEY)
    if (!stored) return 'pending'
    const parsed = JSON.parse(stored)
    if (parsed.version !== CONSENT_VERSION) return 'pending'
    return parsed.status as ConsentStatus
  } catch {
    return 'pending'
  }
}

function storeConsent(status: 'accepted' | 'declined') {
  localStorage.setItem(
    CONSENT_KEY,
    JSON.stringify({ status, version: CONSENT_VERSION, timestamp: Date.now() })
  )
}

// ── Main Component ─────────────────────────────────────────
export function CookieBanner() {
  const [status, setStatus] = useState<ConsentStatus>('pending')
  const [visible, setVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const stored = getStoredConsent()
    setStatus(stored)

    if (stored === 'pending') {
      // หน่วง 0.5s ให้หน้าโหลดก่อน
      const t = setTimeout(() => setVisible(true), 500)
      return () => clearTimeout(t)
    }

    // ถ้า consent เดิมอยู่แล้ว ใช้ตามนั้นได้เลย
    if (stored === 'accepted') enableAnalytics()
    else disableAnalytics()
  }, [])

  const handleAccept = () => {
    storeConsent('accepted')
    enableAnalytics()
    setStatus('accepted')
    setVisible(false)
  }

  const handleDecline = () => {
    storeConsent('declined')
    disableAnalytics()
    setStatus('declined')
    setVisible(false)
  }

  if (!visible || status !== 'pending') return null

  return (
    <>
      {/* Backdrop overlay เบาๆ */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 998,
          background: 'rgba(0,0,0,0.25)',
          backdropFilter: 'blur(2px)',
          animation: 'fadeIn 0.3s ease',
        }}
        onClick={handleDecline}
        aria-hidden
      />

      {/* Banner */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="การตั้งค่าคุกกี้"
        style={{
          position: 'fixed',
          bottom: '1.25rem',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(640px, calc(100vw - 2rem))',
          zIndex: 999,
          background: 'var(--c-surface, #fff)',
          border: '1px solid var(--c-border-strong, rgba(0,0,0,0.13))',
          borderRadius: '1.25rem',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          padding: '1.5rem',
          animation: 'slideUp 0.35s cubic-bezier(0.16,1,0.3,1)',
          fontFamily: 'inherit',
        }}
      >
        <style>{`
          @keyframes fadeIn { from{opacity:0} to{opacity:1} }
          @keyframes slideUp { from{opacity:0;transform:translateX(-50%) translateY(20px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        `}</style>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🍪</span>
            <h2 style={{
              fontSize: '0.9375rem', fontWeight: 700,
              color: 'var(--c-text, #1a1a18)', margin: 0,
            }}>
              เว็บไซต์นี้ใช้คุกกี้
            </h2>
          </div>
          <div style={{
            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em',
            color: 'var(--c-primary, #2d7a5f)',
            background: 'var(--c-primary-pale, #e8f5ef)',
            borderRadius: '99px', padding: '0.2rem 0.6rem',
            whiteSpace: 'nowrap',
          }}>
            PDPA Compliant
          </div>
        </div>

        {/* Body */}
        <p style={{
          fontSize: '0.8375rem', color: 'var(--c-text-2, #4a4a42)',
          lineHeight: 1.7, marginBottom: '0.875rem',
        }}>
          เราใช้คุกกี้เพื่อวิเคราะห์การใช้งาน (Google Analytics 4) และแสดงโฆษณาที่เหมาะสม (Google AdSense)
          ตามกฎหมาย PDPA คุณสามารถเลือกอนุญาตหรือปฏิเสธได้{' '}
          <a href="/privacy" style={{ color: 'var(--c-primary, #2d7a5f)', fontWeight: 600 }}>
            อ่าน Privacy Policy
          </a>
        </p>

        {/* Details toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '0.775rem', color: 'var(--c-text-3, #7a7a70)',
            fontWeight: 600, padding: 0, marginBottom: '0.875rem',
            display: 'flex', alignItems: 'center', gap: '0.3rem',
            fontFamily: 'inherit',
          }}
        >
          {showDetails ? '▲' : '▼'} {showDetails ? 'ซ่อนรายละเอียด' : 'ดูรายละเอียดคุกกี้'}
        </button>

        {showDetails && (
          <div style={{
            background: 'var(--c-bg, #f7f6f2)',
            borderRadius: '0.75rem',
            padding: '0.875rem 1rem',
            marginBottom: '0.875rem',
            fontSize: '0.775rem',
            color: 'var(--c-text-2, #4a4a42)',
          }}>
            <div style={{ marginBottom: '0.625rem' }}>
              <span style={{ fontWeight: 700 }}>✅ คุกกี้ที่จำเป็น (Strictly Necessary)</span>
              <p style={{ margin: '0.25rem 0 0', color: 'var(--c-text-3, #7a7a70)' }}>
                ใช้สำหรับการทำงานพื้นฐานของเว็บ เช่น การบันทึกการตั้งค่า dark mode ไม่สามารถปิดได้
              </p>
            </div>
            <div style={{ borderTop: '1px solid var(--c-border, rgba(0,0,0,0.07))', paddingTop: '0.625rem', marginBottom: '0.625rem' }}>
              <span style={{ fontWeight: 700 }}>📊 คุกกี้วิเคราะห์ (Analytics)</span>
              <p style={{ margin: '0.25rem 0 0', color: 'var(--c-text-3, #7a7a70)' }}>
                Google Analytics 4 — วิเคราะห์ว่า user ใช้เว็บอย่างไร เก็บ IP แบบ anonymized เท่านั้น
              </p>
            </div>
            <div style={{ borderTop: '1px solid var(--c-border, rgba(0,0,0,0.07))', paddingTop: '0.625rem' }}>
              <span style={{ fontWeight: 700 }}>📢 คุกกี้โฆษณา (Advertising)</span>
              <p style={{ margin: '0.25rem 0 0', color: 'var(--c-text-3, #7a7a70)' }}>
                Google AdSense — แสดงโฆษณาที่เกี่ยวข้อง ข้อมูลถูกส่งให้ Google ตาม Privacy Policy ของ Google
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleAccept}
            style={{
              flex: 1, minWidth: 120,
              padding: '0.7rem 1.25rem',
              background: 'var(--c-primary, #2d7a5f)',
              color: 'white', border: 'none',
              borderRadius: '0.75rem', cursor: 'pointer',
              fontSize: '0.875rem', fontWeight: 700,
              fontFamily: 'inherit',
              boxShadow: '0 2px 8px rgba(45,122,95,0.3)',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#38966f')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--c-primary, #2d7a5f)')}
          >
            ยอมรับทั้งหมด
          </button>

          <button
            onClick={handleDecline}
            style={{
              flex: 1, minWidth: 120,
              padding: '0.7rem 1.25rem',
              background: 'transparent',
              color: 'var(--c-text-2, #4a4a42)',
              border: '1.5px solid var(--c-border-strong, rgba(0,0,0,0.13))',
              borderRadius: '0.75rem', cursor: 'pointer',
              fontSize: '0.875rem', fontWeight: 600,
              fontFamily: 'inherit',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--c-bg, #f7f6f2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            ยอมรับเฉพาะที่จำเป็น
          </button>
        </div>

        <p style={{
          fontSize: '0.7rem', color: 'var(--c-text-3, #7a7a70)',
          textAlign: 'center', marginTop: '0.75rem',
        }}>
          คุณสามารถเปลี่ยนการตั้งค่าได้ตลอดเวลาใน{' '}
          <a href="/privacy" style={{ color: 'var(--c-primary, #2d7a5f)' }}>Privacy Policy</a>
        </p>
      </div>
    </>
  )
}

// ── Floating button สำหรับเปิด consent อีกครั้ง ─────────────
export function CookieSettingsButton() {
  const [status, setStatus] = useState<ConsentStatus>('pending')

  useEffect(() => {
    setStatus(getStoredConsent())
  }, [])

  const handleReset = () => {
    localStorage.removeItem(CONSENT_KEY)
    window.location.reload()
  }

  if (status === 'pending') return null

  return (
    <button
      onClick={handleReset}
      title="จัดการคุกกี้"
      aria-label="จัดการการตั้งค่าคุกกี้"
      style={{
        position: 'fixed', bottom: '1.25rem', left: '1.25rem',
        zIndex: 100,
        width: 38, height: 38,
        borderRadius: '50%',
        background: 'var(--c-surface, #fff)',
        border: '1px solid var(--c-border-strong, rgba(0,0,0,0.13))',
        cursor: 'pointer', fontSize: '1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform 0.15s, box-shadow 0.15s',
        fontFamily: 'inherit',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)'
        ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = ''
        ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      🍪
    </button>
  )
}
