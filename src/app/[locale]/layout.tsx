import type { Metadata, Viewport } from 'next'
import '../globals.css'
import Script from 'next/script'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Inter, Noto_Sans_Thai } from 'next/font/google'
import { LazyMotion, domAnimation } from 'framer-motion'
import { CookieBanner, CookieSettingsButton } from '@/components/CookieBanner'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import AIAdvisor from '@/components/AIAdvisor'
import { routing } from '@/i18n/routing'

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
  preload: true 
})
const notoTh = Noto_Sans_Thai({ 
  subsets: ['thai'], 
  variable: '--font-noto-th',
  display: 'swap',
  preload: true
})

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? ''
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? ''

export const viewport: Viewport = {
  themeColor: '#0d9488',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isTh = locale === 'th'

  return {
    title: {
      default: isTh
        ? 'CalqlyHub - เครื่องมือวางแผนการเงินและภาษี 2569 | แม่นยำ พรีเมียม ใช้งานฟรี'
        : 'CalqlyHub - Premium Financial Calculators & Tax Planning 2026',
      template: '%s | CalqlyHub',
    },
    description: isTh
      ? 'ยกระดับการวางแผนการเงินของคุณด้วย CalqlyHub รวมเครื่องคำนวณภาษี 2569 สินเชื่อบ้าน แผนเกษียณ และวิเคราะห์ผลตอบแทนการลงทุนแบบมืออาชีพ ใช้งานง่าย ข้อมูลปลอดภัย'
      : 'Elevate your financial planning with CalqlyHub. Precision calculators for 2026 taxes, home loans, retirement, and investment ROI analysis. Fast, secure, and professional.',
    metadataBase: new URL('https://calqlyhub.com'),
    alternates: {
      canonical: isTh ? '/' : '/en',
      languages: {
        'th-TH': '/',
        'en-US': '/en',
      },
    },
    icons: {
      icon: '/icon.png',
      apple: '/icon.png',
    },
    keywords: isTh
      ? [
          'คำนวณภาษี 2569',
          'คำนวณภาษีเงินได้',
          'คำนวณสินเชื่อบ้าน',
          'วางแผนเกษียณ',
          'คำนวณ ROI',
          'คำนวณต้นทุนจริง',
          'ลดหย่อนภาษี',
        ]
      : [
          'Thai Tax Calculator 2026',
          'Loan Calculator Thailand',
          'Retirement Planning',
          'ROI Calculator',
          'Real Cost Calculator',
        ],
    openGraph: {
      type: 'website',
      locale: isTh ? 'th_TH' : 'en_US',
      siteName: 'CalqlyHub',
      title: isTh
        ? 'CalqlyHub - เครื่องมือวางแผนการเงินและภาษี'
        : 'CalqlyHub - Financial Calculators and Planning Tools',
      description: isTh
        ? 'คำนวณภาษี สินเชื่อ การลงทุน และวางแผนการเงินส่วนตัวได้ในที่เดียว'
        : 'Plan taxes, loans, investments, and personal finances in one place.',
      images: [
        {
          url: 'https://calqlyhub.com/opengraph-image.png',
          width: 1200,
          height: 630,
          alt: 'CalqlyHub - Financial Planning Made Simple',
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
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as 'th' | 'en')) {
    notFound()
  }

  const messages = await getMessages()
  const isTh = locale === 'th'

  return (
    <html lang={locale} className={`${inter.variable} ${notoTh.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <body suppressHydrationWarning>
        <div className="aurora-bg" />
        <div className="noise-overlay" />

      {GA_ID && (
        <Script
          id="consent-mode-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                wait_for_update: 500,
              });
            `,
          }}
        />
      )}

      {ADSENSE_CLIENT && !ADSENSE_CLIENT.includes('รหัส') && (
        <Script
          id="adsense-init"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      )}

      {GA_ID && (
        <>
          <Script
            id="gtag-script"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="lazyOnload"
          />
          <Script
            id="ga4-init"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  send_page_view: true,
                  anonymize_ip: true,
                  cookie_flags: 'SameSite=None;Secure',
                  allow_google_signals: false,
                  allow_ad_personalization_signals: false,
                });
              `,
            }}
          />
        </>
      )}

      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'CalqlyHub',
            url: 'https://calqlyhub.com',
            description: isTh
              ? 'เครื่องมือช่วยคิดเรื่องภาษี สินเชื่อ การลงทุน และการวางแผนการเงินส่วนบุคคลแบบเข้าใจง่าย'
              : 'Practical calculators and guides for taxes, loans, investing, and personal finance planning.',
            publisher: {
              '@type': 'Organization',
              name: 'CalqlyHub',
              logo: {
                '@type': 'ImageObject',
                url: 'https://calqlyhub.com/icon.png',
              },
            },
          }),
        }}
      />

      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: isTh ? 'หน้าแรก' : 'Home',
                item: 'https://calqlyhub.com',
              },
            ],
          }),
        }}
      />

      <NextIntlClientProvider messages={messages}>
        <LazyMotion features={domAnimation}>
          <Header />
          <main className="flex min-h-screen flex-grow flex-col">{children}</main>
          <Footer />
          <AIAdvisor />
          <CookieBanner />
          <CookieSettingsButton />
        </LazyMotion>
      </NextIntlClientProvider>
      </body>
    </html>
  )
}
