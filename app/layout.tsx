import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import Script from 'next/script'
import './globals.css'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? ''
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? ''

export const metadata: Metadata = {
  metadataBase: new URL('https://finwise.th'),
  title: {
    default: 'calqly — คำนวณการเงิน อธิบายง่าย',
    template: '%s | calqly',
  },
  description:
    'เว็บไซต์คำนวณการเงินและบทความให้ความรู้ทางการเงิน ภาษาไทยและอังกฤษ ใช้งานฟรี ไม่ต้องลงทะเบียน',
  keywords: ['คำนวณสินเชื่อ', 'ภาษีเงินได้', 'วางแผนเกษียณ', 'loan calculator', 'thai tax calculator'],
  authors: [{ name: 'FinWise.th' }],
  creator: 'FinWise.th',
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    alternateLocale: 'en_US',
    siteName: 'FinWise.th',
    title: 'FinWise.th — คำนวณการเงิน อธิบายง่าย',
    description: 'เว็บไซต์คำนวณการเงินและบทความให้ความรู้ทางการเงิน',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinWise.th',
    description: 'คำนวณการเงิน อธิบายง่าย',
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
        {/* Google AdSense — load async เพื่อไม่ block render */}
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
        {/* Google Analytics 4 */}
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
                  page_path: window.location.pathname,
                  cookie_flags: 'SameSite=None;Secure',
                  send_page_view: true,
                });
              `}
            </Script>
          </>
        )}

        {/* ThemeProvider ของ next-themes — ห่อ children ทั้งหมด */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
