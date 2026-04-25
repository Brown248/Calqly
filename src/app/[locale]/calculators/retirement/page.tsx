import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import RetirementCalculatorClient from './RetirementCalculatorClient'
import Script from 'next/script'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'RetirementCalculator' })
  const isTh = locale === 'th'

  return {
    metadataBase: new URL('https://calqlyhub.com'),
    title: t('title'),
    description: isTh 
      ? 'วางแผนเงินออมเกษียณ คำนวณเงินก้อนที่ต้องมีหลังเกษียณออนไลน์ พร้อมวิเคราะห์ Gap Analysis และกราฟการเติบโตของเงินกองทุน' 
      : 'Online Retirement Savings Planner. Calculate your target retirement fund with gap analysis and savings projection charts.',
    keywords: isTh 
      ? ['วางแผนเกษียณ', 'คำนวณเงินเกษียณ', 'ออมเงินเพื่อเกษียณ', 'อิสรภาพทางการเงิน', 'สูตรคำนวณเงินเกษียณ']
      : ['Retirement Planner Thailand', 'Retirement Calculator', 'Financial Freedom Thailand', 'Savings Projection'],
  }
}

export default async function RetirementPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  return (
    <>
      <Script
        id="retire-app-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": locale === 'th' ? "โปรแกรมวางแผนเกษียณ" : "Retirement Savings Planner",
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
      <RetirementCalculatorClient />
    </>
  )
}
