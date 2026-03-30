// ============================================================
// src/app/layout.tsx — อัปเดตจากไฟล์เดิม
//
// สิ่งที่เพิ่ม/เปลี่ยน:
// 1. Google Consent Mode v2 (บังคับก่อน GA4 โหลด)
// 2. IP Anonymization ใน GA4
// 3. CookieBanner + CookieSettingsButton
// ============================================================

import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from 'next-themes'
import Script from 'next/script'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CookieBanner, CookieSettingsButton } from '@/components/CookieBanner'
import './globals.css'


const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? ''
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? ''

export const viewport: Viewport = {
  themeColor: '#10B981',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://calqlyhub.com'),
  title: {
    default: 'CalqlyHub — คำนวณการเงิน เข้าใจง่าย',
    template: '%s | calqly-hub.vercel.app',
  },
  description:
    'เครื่องคิดเลขการเงินและบทความให้ความรู้ทางการเงิน ภาษาไทยและอังกฤษ ข้อมูลล่าสุดปี 2568/2569 ใช้ฟรี',
  
  // 👇 ส่วนที่แก้ไข: ระบุไฟล์ Icon (Favicon) ที่อัปโหลดมา 👇
  icons: {
    icon: '/icon.png', // อ้างอิงไฟล์ icon.png ใน src/app/
    apple: '/icon.png', // สำหรับอุปกรณ์ Apple
  },

  keywords: ['คำนวณภาษี 2568', 'คำนวณสินเชื่อ', 'วางแผนเกษียณ', 'ลดหย่อนภาษี 2568'],
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    alternateLocale: 'en_US',
    siteName: 'CalqlyHub',

    // 👇 ส่วนที่แก้ไข: ระบุไฟล์ Open Graph Image ที่อัปโหลดมา 👇
    images: [
      {
        url: '/opengraph-image.png', // อ้างอิงไฟล์ opengraph-image.png ใน src/app/
        width: 1200, // ขนาดมาตรฐาน OG Image
        height: 630, // ขนาดมาตรฐาน OG Image
        alt: 'Calqly - เครื่องมือคำนวณการเงิน เข้าใจง่าย',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFY ?? '',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        {/* ── Google Consent Mode v2 ──────────────────────────────
            ต้องโหลดก่อน gtag.js เสมอ
            Default: denied ทั้งหมด — จะเปิดเมื่อ user กด accept ใน CookieBanner
            ที่มา: https://developers.google.com/tag-platform/security/guides/consent
        */}
        {GA_ID && (
          <Script id="consent-mode-default" strategy="beforeInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}

              // Default: ปิดทั้งหมดก่อน user ให้ consent
              gtag('consent', 'default', {
                analytics_storage: 'granted',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                wait_for_update: 500,
              });
            `}
          </Script>
        )}

        {/* AdSense — โหลด async ไม่ block render */}
        {ADSENSE_CLIENT && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>

      <body suppressHydrationWarning>
        {/* ── Google Analytics 4 ─────────────────────────────────
            anonymize_ip: true = IP Anonymization (PDPA compliant)
            ข้อมูลที่เก็บจะเป็นแค่ IP ที่ตัดส่วนท้ายออก เช่น 203.0.113.xxx
        */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  send_page_view: true,
                  anonymize_ip: true,
                  cookie_flags: 'SameSite=None;Secure',
                  // ไม่ส่ง PII ใดๆ ไปยัง Google
                  allow_google_signals: false,
                  allow_ad_personalization_signals: false,
                });
              `}
            </Script>
          </>
        )}

        <ThemeProvider
          attribute="class"
          defaultTheme="light"    // 1. บังคับค่าเริ่มต้นเป็นสว่าง
          enableSystem={false}    // 2. ปิดการดึงค่าจากระบบปฏิบัติการมือถือ/คอมของ User
          disableTransitionOnChange
        >
          <Script
            id="website-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "CalqlyHub",
                "url": "https://calqlyhub.com",
                "description": "เรื่องเงินให้เราช่วยคิด — เครื่องมือคำนวณการเงิน ภาษี สินเชื่อ อัปเดตล่าสุด พ.ศ. 2569",
                "publisher": {
                  "@type": "Organization",
                  "name": "CalqlyHub",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://calqlyhub.com/icon.png"
                  }
                }
              })
            }}
          />

          <Header />

          {children}

          <Footer />

          {/* ── PDPA Components ────────────────────────────────── */}
          
          <CookieBanner />
          <CookieSettingsButton />
        </ThemeProvider>
      </body>
    </html>
  )
}
