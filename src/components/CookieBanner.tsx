'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export function CookieBanner() {
  const t = useTranslations('CookieBanner');
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [preferences, setPreferences] = useState({ analytics: true, ads: true });

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsMounted(true);

      const consent = localStorage.getItem('cookieConsent');
      if (!consent) {
        setShowBanner(true);
      } else if (consent === 'custom') {
        const savedPrefs = localStorage.getItem('cookiePreferences');
        if (savedPrefs) {
          setPreferences(JSON.parse(savedPrefs));
        }
      }
    });

    const handleOpenModal = () => setShowModal(true);
    window.addEventListener('openCookieModal', handleOpenModal);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('openCookieModal', handleOpenModal);
    };
  }, []);

  const updateGtag = (analyticsStatus: string, adsStatus: string) => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('consent', 'update', {
        analytics_storage: analyticsStatus,
        ad_storage: adsStatus,
        ad_user_data: adsStatus,
        ad_personalization: adsStatus,
      });
    }
  };

  const acceptAll = () => {
    localStorage.setItem('cookieConsent', 'all');
    setPreferences({ analytics: true, ads: true });
    updateGtag('granted', 'granted');
    setShowBanner(false);
    setShowModal(false);
  };

  const savePreferences = () => {
    localStorage.setItem('cookieConsent', 'custom');
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    updateGtag(preferences.analytics ? 'granted' : 'denied', preferences.ads ? 'granted' : 'denied');
    setShowBanner(false);
    setShowModal(false);
  };

  if (!isMounted) return null;

  return (
    <>
      {showBanner && !showModal && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200 p-4 z-[9999] flex flex-wrap gap-4 items-center justify-between shadow-2xl animate-fade-in-up">
          <div className="flex-1 min-w-[300px] text-sm text-slate-600 leading-relaxed">
            🍪 <strong>{t('notice')}</strong> {t('read_more_prefix')}{' '}
            <Link href="/privacy" className="text-teal-600 underline font-bold">
              {t('privacy_policy')}
            </Link>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button className="btn btn-secondary btn-sm" onClick={() => setShowModal(true)}>
              {t('settings')}
            </button>
            <button className="btn btn-primary btn-sm" onClick={acceptAll}>
              {t('accept_all')}
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-[500px] shadow-2xl animate-scale-in border border-white">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">⚙️ {t('privacy_title')}</h3>

            <div className="mb-4 pb-4 border-b border-slate-100">
              <label className="flex justify-between items-center font-bold text-slate-800">
                {t('necessary_title')}
                <input type="checkbox" checked disabled className="w-5 h-5 accent-teal-600" aria-label={t('necessary_title')} />
              </label>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {t('necessary_desc')}
              </p>
            </div>

            <div className="mb-4 pb-4 border-b border-slate-100">
              <label className="flex justify-between items-center font-bold text-slate-800 cursor-pointer">
                {t('analytics_title')}
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="w-5 h-5 accent-teal-600 cursor-pointer"
                  aria-label={t('analytics_title')}
                />
              </label>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {t('analytics_desc')}
              </p>
            </div>

            <div className="mb-8">
              <label className="flex justify-between items-center font-bold text-slate-800 cursor-pointer">
                {t('ads_title')}
                <input
                  type="checkbox"
                  checked={preferences.ads}
                  onChange={(e) => setPreferences({ ...preferences, ads: e.target.checked })}
                  className="w-5 h-5 accent-teal-600 cursor-pointer"
                  aria-label={t('ads_title')}
                />
              </label>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {t('ads_desc')}
              </p>
            </div>

            <div className="flex gap-2 justify-end">
              <button className="btn btn-secondary btn-md" onClick={acceptAll}>
                {t('accept_all')}
              </button>
              <button className="btn btn-primary btn-md" onClick={savePreferences}>
                {t('save_preferences')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function CookieSettingsButton() {
  const t = useTranslations('CookieBanner');
  const [isMounted, setIsMounted] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      setHasConsented(!!localStorage.getItem('cookieConsent'));
    };

    const frame = requestAnimationFrame(() => {
      setIsMounted(true);
      checkConsent();
    });
    window.addEventListener('click', checkConsent);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('click', checkConsent);
    };
  }, []);

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
        border: '1px solid rgba(15, 23, 42, 0.05)',
        boxShadow: 'var(--shadow-premium)',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.2s ease-in-out',
      }}
      aria-label={t('settings')}
      title={t('settings')}
      onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      🍪
    </button>
  );
}
