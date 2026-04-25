import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import ROICalculatorClient from './ROICalculatorClient'
import Script from 'next/script'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ROICalculator' })
  const isTh = locale === 'th'

  return {
    metadataBase: new URL('https://calqlyhub.com'),
    title: t('title'),
    description: isTh 
      ? 'คำนวณผลตอบแทนการลงทุน (ROI) และผลตอบแทนทบต้น (CAGR) ออนไลน์ เปรียบเทียบการลงทุนแบบก้อนเดียวกับการทำ DCA' 
      : 'Online ROI and CAGR Investment Calculator. Compare lump sum vs. monthly DCA investment strategies with interactive charts.',
    keywords: isTh 
      ? ['คำนวณ ROI', 'คำนวณ DCA', 'ผลตอบแทนทบต้น', 'วางแผนการลงทุน', 'สูตรคำนวณดอกเบี้ยทบต้น']
      : ['ROI Calculator Thailand', 'DCA Calculator', 'Compound Interest Calculator', 'Investment Planner Thailand'],
  }
}

export default async function ROIPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  return (
    <>
      <Script
        id="roi-app-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": locale === 'th' ? "โปรแกรมคำนวณผลตอบแทนลงทุน" : "Investment ROI Calculator",
            "operatingSystem": "All",
            "applicationCategory": "FinanceApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "THB"
            }
          })
        }}
      />
      <ROICalculatorClient />
    </>
  )
}
