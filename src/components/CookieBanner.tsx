'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// ==========================================
// 1. Component: CookieBanner (ตัวแบนเนอร์และ Modal)
// ==========================================
export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // State สำหรับเก็บค่าตัวเลือก
  const [preferences, setPreferences] = useState({ analytics: true, ads: true });

  useEffect(() => {
    setIsMounted(true);
    
    // โหลดค่าเดิมที่เคยตั้งไว้
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true); // ถ้าไม่เคยเลือก ให้โชว์ Banner
    } else if (consent === 'custom') {
      const savedPrefs = localStorage.getItem('cookiePreferences');
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }
    }

    // สร้าง Event Listener รับคำสั่งเปิด Modal จากปุ่มตั้งค่า (CookieSettingsButton)
    const handleOpenModal = () => setShowModal(true);
    window.addEventListener('openCookieModal', handleOpenModal);
    
    return () => window.removeEventListener('openCookieModal', handleOpenModal);
  }, []);

  // ฟังก์ชันกดยอมรับทั้งหมด
  const acceptAll = () => {
    localStorage.setItem('cookieConsent', 'all');
    setPreferences({ analytics: true, ads: true });
    updateGtag('granted', 'granted');
    setShowBanner(false);
    setShowModal(false);
  };

  // ฟังก์ชันบันทึกการตั้งค่าแบบเลือกเอง
  const savePreferences = () => {
    localStorage.setItem('cookieConsent', 'custom');
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    updateGtag(preferences.analytics ? 'granted' : 'denied', preferences.ads ? 'granted' : 'denied');
    setShowBanner(false);
    setShowModal(false);
  };

  // อัปเดต Google Tag Manager Consent Mode
  const updateGtag = (analyticsStatus: string, adsStatus: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: analyticsStatus,
        ad_storage: adsStatus,
        ad_user_data: adsStatus,
        ad_personalization: adsStatus,
      });
    }
  };

  // ป้องกัน Hydration Error
  if (!isMounted) return null;

  return (
    <>
      {/* ── แถบ Banner ด้านล่างสุด ── */}
      {showBanner && !showModal && (
        <div 
          className="animate-fade-in-up"
          style={{ 
            position: 'fixed', 
            bottom: 0, left: 0, right: 0, 
            background: 'var(--bg-surface)', 
            backdropFilter: 'blur(10px)', 
            WebkitBackdropFilter: 'blur(10px)',
            borderTop: '1px solid var(--border-primary)', 
            padding: 'var(--space-4)', 
            zIndex: 9999, 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '1rem', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            boxShadow: 'var(--shadow-lg)' 
          }}
        >
          <div style={{ flex: '1 1 300px', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            🍪 <strong>เว็บไซต์นี้ใช้คุกกี้</strong> เราใช้คุกกี้เพื่อพัฒนาประสบการณ์การใช้งานของคุณ และเพื่อนำเสนอเนื้อหาโฆษณาที่ตรงกับความสนใจ สามารถอ่านรายละเอียดเพิ่มเติมได้ที่ <Link href="/privacy" style={{ color: 'var(--primary-500)', textDecoration: 'underline' }}>นโยบายความเป็นส่วนตัว</Link>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowModal(true)}>
              ตั้งค่าคุกกี้
            </button>
            <button className="btn btn-primary btn-sm" onClick={acceptAll}>
              ยอมรับทั้งหมด
            </button>
          </div>
        </div>
      )}

      {/* ── Modal สำหรับตั้งค่าแบบละเอียด ── */}
      {showModal && (
        <div 
          style={{ 
            position: 'fixed', inset: 0, 
            background: 'rgba(0,0,0,0.6)', 
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 10000, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: 'var(--space-4)'
          }}
        >
          <div className="glass-card animate-scale-in" style={{ width: '100%', maxWidth: '500px', background: 'var(--bg-primary)', padding: 'var(--space-6)' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ⚙️ ตั้งค่าความเป็นส่วนตัว
            </h3>
            
            {/* 1. คุกกี้ที่จำเป็น */}
            <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-secondary)' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '600', color: 'var(--text-primary)' }}>
                คุกกี้ที่จำเป็น (Strictly Necessary)
                <input type="checkbox" checked disabled style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary-500)' }} />
              </label>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: '0.5rem', lineHeight: '1.5' }}>
                จำเป็นต่อการทำงานพื้นฐานของเว็บไซต์ เช่น การเข้าสู่ระบบ ระบบความปลอดภัย (ไม่สามารถปิดได้)
              </p>
            </div>

            {/* 2. คุกกี้วิเคราะห์ (GA4) */}
            <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-secondary)' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '600', cursor: 'pointer', color: 'var(--text-primary)' }}>
                คุกกี้เพื่อการวิเคราะห์ (Analytics)
                <input 
                  type="checkbox" 
                  checked={preferences.analytics} 
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })} 
                  style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer', accentColor: 'var(--primary-500)' }}
                />
              </label>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: '0.5rem', lineHeight: '1.5' }}>
                ช่วยให้เราเข้าใจรูปแบบการใช้งานเว็บไซต์ เพื่อนำไปพัฒนาเนื้อหาและเครื่องมือให้ดียิ่งขึ้น
              </p>
            </div>

            {/* 3. คุกกี้โฆษณา (AdSense) */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '600', cursor: 'pointer', color: 'var(--text-primary)' }}>
                คุกกี้เพื่อการโฆษณา (Advertising)
                <input 
                  type="checkbox" 
                  checked={preferences.ads} 
                  onChange={(e) => setPreferences({ ...preferences, ads: e.target.checked })} 
                  style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer', accentColor: 'var(--primary-500)' }}
                />
              </label>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: '0.5rem', lineHeight: '1.5' }}>
                ช่วยให้เราสามารถนำเสนอโฆษณาที่ตรงกับความสนใจของคุณได้มากขึ้น
              </p>
            </div>

            {/* ปุ่ม Actions */}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={acceptAll}>
                ยอมรับทั้งหมด
              </button>
              <button className="btn btn-primary" onClick={savePreferences}>
                บันทึกการตั้งค่า
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ==========================================
// 2. Component: CookieSettingsButton (ปุ่มลอยมุมซ้ายล่าง)
// ==========================================
export function CookieSettingsButton() {
  const [isMounted, setIsMounted] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // เช็คว่าเคยตอบรับ Banner ไปหรือยัง
    const checkConsent = () => {
      setHasConsented(!!localStorage.getItem('cookieConsent'));
    };
    
    checkConsent(); // เช็คตอนโหลดครั้งแรก

    // ให้เช็คซ้ำทุกครั้งที่มีการคลิกในเว็บ (เผื่อเพิ่งกดยอมรับไปหมาดๆ)
    window.addEventListener('click', checkConsent);
    return () => window.removeEventListener('click', checkConsent);
  }, []);

  // จะแสดงปุ่มนี้ ก็ต่อเมื่อผู้ใช้เคยกด ยอมรับ/บันทึก แบนเนอร์ไปแล้วเท่านั้น
  if (!isMounted || !hasConsented) return null;

  return (
    <button
      onClick={() => window.dispatchEvent(new Event('openCookieModal'))}
      className="glass-card animate-scale-in"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 9998,
        width: '46px',
        height: '46px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: 0,
        fontSize: '1.25rem',
        border: '1px solid var(--border-primary)',
        boxShadow: 'var(--shadow-md)',
        background: 'var(--bg-surface)',
        transition: 'all 0.2s ease-in-out',
      }}
      aria-label="ตั้งค่าความเป็นส่วนตัว (PDPA)"
      title="ตั้งค่าคุกกี้"
      onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      🍪
    </button>
  );
}