import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import RealCostCalculatorClient from './RealCostCalculatorClient'
import Script from 'next/script'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'RealCostCalculator' })
  const isTh = locale === 'th'

  return {
    metadataBase: new URL('https://calqlyhub.com'),
    title: t('title'),
    description: isTh 
      ? 'คำนวณราคาที่แท้จริงของสิ่งของ รวมดอกเบี้ย ค่าใช้จ่ายแฝง และค่าเสียโอกาสจากการไม่นำเงินไปลงทุน เพื่อการตัดสินใจซื้ออย่างชาญฉลาด' 
      : 'Calculate the true price of your purchase including interest, hidden fees, and opportunity cost of not investing.',
    keywords: isTh 
      ? ['ราคาที่จ่ายจริง', 'คำนวณค่าเสียโอกาส', 'วางแผนการเงิน', 'ความจริงของราคา', 'Mindful Spending']
      : ['Real Cost Calculator', 'Opportunity Cost Calculator Thailand', 'True Price of Things', 'Financial Planning Tool'],
  }
}

export default async function RealCostPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  return (
    <>
      {/* SoftwareApplication Schema */}
      <Script
        id="real-cost-app-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": locale === 'th' ? "โปรแกรมคำนวณราคาที่จ่ายจริง" : "The Real Cost Calculator",
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
      
      <RealCostCalculatorClient />
    </>
  )
}
