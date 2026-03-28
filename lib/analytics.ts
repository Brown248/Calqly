// lib/analytics.ts
// Google Analytics 4 helper functions
// ใช้ gtag() ซึ่ง inject โดย layout.tsx

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string,
      config?: Record<string, unknown>
    ) => void
    dataLayer: unknown[]
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? ''

// Page view - เรียกเมื่อ route เปลี่ยน (Next.js App Router จัดการให้อัตโนมัติ)
export function trackPageView(url: string) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return
  window.gtag('config', GA_MEASUREMENT_ID, { page_path: url })
}

// Calculator events
export function trackCalculatorUse(calculatorName: string, inputs: Record<string, number>) {
  if (typeof window === 'undefined') return
  window.gtag('event', 'calculator_use', {
    event_category: 'Calculator',
    event_label: calculatorName,
    calculator_name: calculatorName,
    ...inputs,
  })
}

export function trackCalculatorShare(calculatorName: string) {
  if (typeof window === 'undefined') return
  window.gtag('event', 'share', {
    method: 'url_copy',
    content_type: 'calculator',
    content_id: calculatorName,
  })
}

export function trackCalculatorPrint(calculatorName: string) {
  if (typeof window === 'undefined') return
  window.gtag('event', 'print', {
    event_category: 'Calculator',
    event_label: calculatorName,
  })
}

// Article events
export function trackArticleRead(articleSlug: string, readPercent: number) {
  if (typeof window === 'undefined') return
  // Track เฉพาะ milestones 25, 50, 75, 100%
  const milestones = [25, 50, 75, 100]
  if (!milestones.includes(readPercent)) return
  window.gtag('event', 'scroll', {
    event_category: 'Article',
    event_label: articleSlug,
    percent_scrolled: readPercent,
  })
}

export function trackLanguageSwitch(from: string, to: string) {
  if (typeof window === 'undefined') return
  window.gtag('event', 'language_switch', {
    from_language: from,
    to_language: to,
  })
}

// Ad events (optional - AdSense จัดการ tracking เองอยู่แล้ว)
export function trackAdClick(adUnit: string, position: string) {
  if (typeof window === 'undefined') return
  window.gtag('event', 'ad_click', {
    event_category: 'Ad',
    ad_unit: adUnit,
    position,
  })
}
